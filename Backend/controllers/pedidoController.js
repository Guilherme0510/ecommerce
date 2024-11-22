import pedidoModel from "../models/pedidoModel.js";
import usuarioModelo from "../models/usuarioModel.js";
import produtoModel from "../models/produtoModel.js";
import gerencianet from "sdk-node-apis-efi";
import Stripe from "stripe";
import axios from "axios";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

import dotenv from "dotenv";

dotenv.config();

const moeda = "brl";
const frete = 10;


const fazerPedido = async (req, res) => {
  try {
    const { usuarioId, itens, quantidade, endereco, metodoPagamento, status } =
    req.body;
    
    const pedidoDados = {
      usuarioId,
      itens,
      quantidade,
      endereco,
      metodoPagamento,
      pagamento: false,
      data: Date.now(),
      status: "Pendente"
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_PROD);
const fazerPedidoStripe = async (req, res) => {
  try {
    const { usuarioId, itens, endereco, metodoPagamento } = req.body;
    const { origin } = req.headers;
    const origem = origin || "http://localhost:5173";

    const pedidoDados = {
      usuarioId,
      itens,
      endereco,
      metodoPagamento,
      pagamento: false,
      data: Date.now(),
    };

    // Criar o pedido no banco de dados
    const novoPedido = new pedidoModel(pedidoDados);
    await novoPedido.save();

    // Buscar o preço de cada item no banco de dados
    const line_items = await Promise.all(itens.map(async (item) => {
      const produto = await produtoModel.findById(item.produtoId); // Buscar produto pelo ID
      if (!produto || !produto.preco) {
        throw new Error(`Produto com ID ${item.produtoId} não encontrado ou sem preço.`);
      }

      // Criar item para o Stripe com preço em centavos
      return {
        price_data: {
          currency: moeda, // Substitua pela moeda que você está usando
          product_data: {
            name: item.nome,
          },
          unit_amount: produto.preco * 100, // Preço em centavos
        },
        quantity: item.quantidade,
      };
    }));

    // Caso tenha frete, adicione no final (verifique se a variável 'frete' está definida)
    if (!frete || isNaN(frete)) {
      throw new Error('Valor de frete inválido.');
    }

    line_items.push({
      price_data: {
        currency: moeda, // Substitua pela moeda que você está usando
        product_data: {
          name: "Frete",
        },
        unit_amount: frete * 100, // Multiplicando por 100 para valores em centavos
      },
      quantity: 1,
    });

    // Criar a sessão de pagamento no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${origem}/verify?success=true&orderId=${novoPedido._id}`,
      cancel_url: `${origem}/verify?success=false&orderId=${novoPedido._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log('Erro ao criar pedido Stripe:', error);
    res.json({ success: false, message: error.message });
  }
};



const verificarStripe = async (req, res) => {
  const { pedidoId, success, usuarioId } = req.body;

  try {
    const isSuccess = success === true || success === "true";

    if (isSuccess) {
      await pedidoModel.findByIdAndUpdate(pedidoId, { pagamento: true });
      await usuarioModelo.findByIdAndUpdate(usuarioId, { dadosCarrinho: {} });
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

const atualizarPagamento = async (req, res) => {
  try {
    const { pedidoId, pagamento } = req.body;
    await pedidoModel.findByIdAndUpdate(pedidoId, { pagamento });
    res.json({ success: true, message: "Pagamento atualizado" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const gerenciaNetPix = async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  try {
    console.log("Dados recebidos no body:", req.body);

    const cert = fs.readFileSync(
      path.resolve(__dirname, `../certs/${process.env.CERTIFICADO_PROD}`)
    );

    const agent = new https.Agent({
      pfx: cert,
      passphrase: "", 
    });

    const credentials = Buffer.from(
      `${process.env.CHAVE_CLIENT_ID_PROD}:${process.env.CHAVE_CLIENT_SECRET_PROD}`
    ).toString("base64");

    const authResponse = await axios({
      method: "POST",
      url: `${process.env.ENDPOINT_PROD}/oauth/token`,
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      httpsAgent: agent,
      data: {
        grant_type: "client_credentials",
      },
    });

    console.log("Resposta da API de autenticação:", authResponse.data);

    const accessToken = authResponse.data?.access_token;

    const reqGN = axios.create({
      baseURL: process.env.ENDPOINT_PROD,
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
        original: req.body.preco,
      },
      chave: process.env.CHAVE_PIX,
      solicitacaoPagador:
        req.body.solicitacaoPagador || "Cobrança dos serviços prestados.",
    };

    const cobResponse = await reqGN.post("/v2/cob", dataCob);

    console.log("Resposta da criação de cobrança:", cobResponse.data);

    const qrCodeResponse = await reqGN.get(
      `/v2/loc/${cobResponse.data.loc.id}/qrcode`
    );

    console.log("QR Code response:", qrCodeResponse.data);

    const { usuarioId, itens, quantidade, endereco } = req.body;
    const pedidoDados = {
      usuarioId,
      itens,
      quantidade,
      endereco,
      metodoPagamento: "Pix",
      pagamento: false,
      data: Date.now(),
      status: "Pendente",
    };

    const novoPedido = new pedidoModel(pedidoDados);
    await novoPedido.save();

    await usuarioModelo.findByIdAndUpdate(usuarioId, { dadosCarrinho: {} });

    res.status(200).json({
      success: true,
      message: "Pedido realizado com sucesso!",
      qrCode: qrCodeResponse.data,
    });
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);

    if (error.response) {
      console.error("Resposta da API de erro:", error.response.data);
      console.error("Status de erro:", error.response.status);
    }

    res.status(500).json({
      error: "Erro ao gerar QR Code",
      details: error.message,
    });
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
  atualizarPagamento
};
