import pedidoModel from "../models/pedidoModel.js";
import usuarioModelo from "../models/usuarioModel.js";
import produtoModel from "../models/produtoModel.js";
import gerencianet from "sdk-node-apis-efi";
import Stripe from "stripe";
import axios from "axios";
import https from "https";
import fs from "fs";
import path from "path";

import dotenv from "dotenv";

dotenv.config();

const moeda = "brl";
const frete = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const fazerPedido = async (req, res) => {
  try {
    const { usuarioId, itens, quantidade, endereco, metodoPagamento } =
      req.body;

    const pedidoDados = {
      usuarioId,
      itens,
      quantidade,
      endereco,
      metodoPagamento, // Valor dinâmico vindo do frontend
      pagamento: false, // Inicialmente como falso
      data: Date.now(),
    };

    const novoPedido = new pedidoModel(pedidoDados);
    await novoPedido.save();

    await usuarioModelo.findByIdAndUpdate(usuarioId, { dadosCarrinho: {} });

    res.json({ success: true, message: "Pedido realizado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const fazerPedidoStripe = async (req, res) => {
  try {
    const { usuarioId, itens, quantidade, endereco } = req.body;
    const { origin } = req.headers;

    const pedidoDados = {
      usuarioId,
      itens,
      quantidade,
      endereco,
      metodoPagamento: "Stripe",
      pagamento: false,
      data: Date.now(),
    };

    const novoPedido = new pedidoModel(pedidoDados);
    await novoPedido.save();

    const line_items = itens.map((item) => ({
      price_data: {
        currency: moeda,
        product_data: {
          name: item.nome,
        },
        unit_amount: item.preco * 100,
      },
      quantity: item.quantidade,
    }));

    line_items.push({
      price_data: {
        currency: moeda,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: frete * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verificarStripe = async (req, res) => {
  const { pedidoId, success, usuarioId } = req.body;

  try {
    const isSuccess = success === true || success === "true";

    if (isSuccess) {
      await pedidoModel.findByIdAndUpdate(pedidoId, { payment: true });
      await usuarioModelo.findByIdAndUpdate(usuarioId, { cartData: {} });
      return res.json({ success: true });
    } else {
      await usuarioModelo.findByIdAndDelete(pedidoId);
      return res.json({ success: false, message: "Pagamento Falhou" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const pedidosUsuarios = async (req, res) => {
  try {
    const { usuarioId } = req.body;

    // Encontrar os pedidos do usuário
    const pedidos = await pedidoModel.find({ usuarioId });

    if (!pedidos || pedidos.length === 0) {
      return res.json({ success: false, message: "Nenhum pedido encontrado" });
    }

    const pedidosComProdutos = await Promise.all(
      pedidos.map(async (pedido) => {
        const produtosDetalhados = await Promise.all(
          pedido.itens.map(async (idProduto) => {
            const produto = await produtoModel.findById(idProduto); // Supondo que o modelo de produto seja 'produtoModel'
            return produto; // Retorna o produto com todos os detalhes
          })
        );

        // Retornar o pedido com os produtos detalhados
        return { ...pedido.toObject(), produtos: produtosDetalhados };
      })
    );

    // Retornar os pedidos com os produtos incluídos
    res.json({ success: true, pedidos: pedidosComProdutos });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const todosPedidos = async (req, res) => {
  try {
    const pedidos = await pedidoModel.find({});
    res.json({ success: true, pedidos });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const atualizarStatus = async (req, res) => {
  try {
    const { pedidoId, status } = req.body;
    await pedidoModel.findByIdAndUpdate(pedidoId, { status });
    res.json({ success: true, message: "Status atualizado" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const gerenciaNetPix = async (req, res) => {
  const certPath = path.join(process.cwd(), "certs", process.env.CERTIFICADO);

  console.log(certPath);

  const certBuffer = fs.readFileSync(certPath);

  const agent = new https.Agent({
    pfx: certBuffer,
    passphrase: "", 
  });

  const credentials = Buffer.from(
    `${process.env.CHAVE_CLIENT_ID}:${process.env.CHAVE_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const authResponse = await axios({
      method: "POST",
      url: `${process.env.ENDPOINT}/oauth/token`,
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      httpsAgent: agent,
      data: {
        grant_type: "client_credentials",
      },
    });

    const accessToken = authResponse.data?.access_token;

    const reqGN = axios.create({
      baseURL: process.env.ENDPOINT,
      httpsAgent: agent,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const dataCob = {
      calendario: {
        expiracao: 3600,
      },
      devedor: {
        cpf: req.body.cpf,
        nome: req.body.nome,
      },
      valor: {
        original: req.body.preco || "100.00",
      },
      chave: "11932911121",
      solicitacaoPagador:
        req.body.solicitacaoPagador || "Cobrança dos serviços prestados.",
    };
    const cobResponse = await reqGN.post("/v2/cob", dataCob);
    const qrCodeResponse = await reqGN.get(
      `/v2/loc/${cobResponse.data.loc.id}/qrcode`
    );

    res.status(200).json(qrCodeResponse.data);
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao gerar QR Code", details: error.message });
  }
};




export {
  fazerPedido,
  pedidosUsuarios,
  todosPedidos,
  atualizarStatus,
  gerenciaNetPix,
  fazerPedidoStripe,
  verificarStripe,
};
