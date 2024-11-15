import pedidoModel from "../models/pedidoModel.js";
import usuarioModelo from "../models/usuarioModel.js";
import gerencianet from 'sdk-node-apis-efi'; 
import Stripe from 'stripe'

import dotenv from 'dotenv';

dotenv.config();

const moeda = "brl";
const frete = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const fazerPedido = async (req, res) => {
  try {
    const { usuarioId, itens, quantidade, endereco, metodoPagamento } = req.body;

    // PNE = Pagar na entrega
    const pedidoDados = {
      usuarioId,
      itens,
      quantidade,
      endereco,
      metodoPagamento: "PNE", 
      pagamento: false,
      data: Date.now(),
    };

    const novoPedido = new pedidoModel(pedidoDados);
    await novoPedido.save();

    await usuarioModelo.findByIdAndUpdate(usuarioId, { dadosCarrinho: {} });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const fazerPedidoStripe = async (req,res) => {
  try {
    const { usuarioId, itens, quantidade, endereco } = req.body
    const { origin } = req.headers

    const pedidoDados = {
      usuarioId,
      itens,
      quantidade,
      endereco,
      metodoPagamento: "Stripe", 
      pagamento: false,
      data: Date.now(),
    };

    const novoPedido = new pedidoModel(pedidoDados)
    await novoPedido.save()

    const line_items = itens.map((item) => ({
      price_data: {
        currency: moeda,
        product_data:{
          name:item.nome
        },
        unit_amount: item.preco * 100
      },
      quantity: item.quantidade
    }))

    line_items.push({
      price_data:{
        currency:moeda,
        product_data:{
          name:"Delivery Charges"
        },
        unit_amount: frete * 100
      },
      quantity:1
    })

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    })
    res.json({success: true, session_url: session.url})

  } catch (error) {
    console.log(error);
    res.json({success:false, message: error.message})
  }
}

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
      return res.json({ success: false, message: 'Pagamento Falhou' });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};



const pedidosUsuarios = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const pedidos = await pedidoModel.findById({ usuarioId });
    res.json({ success: true, pedidos });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const todosPedidos = async (req, res) => {
  try {
    const pedidos = await pedidoModel.find({});
    res.json({ success: true, message: pedidos });
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


const gerenciaNetPix = async () => {
  
};

export { fazerPedido, pedidosUsuarios, todosPedidos, atualizarStatus, gerenciaNetPix, fazerPedidoStripe, verificarStripe };
