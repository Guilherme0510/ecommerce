import express from 'express'
import authUsuario from '../middleware/auth.js'
import { atualizarPagamento, atualizarStatus, fazerPedido, fazerPedidoStripe, gerenciaNetPix, pedidosUsuarios, todosPedidos, verificarStripe } from '../controllers/pedidoController.js'
import adminAuth from '../middleware/admin_auth.js'

export const pedidoRoute = express.Router() 

pedidoRoute.post('/fazer_pedido', authUsuario, fazerPedido)
pedidoRoute.post('/pix-qr-code',authUsuario, gerenciaNetPix);
pedidoRoute.post('/stripe', authUsuario, fazerPedidoStripe)


pedidoRoute.post('/lista', todosPedidos )
pedidoRoute.post('/status', atualizarStatus)
pedidoRoute.post('/pagamento', atualizarPagamento)

pedidoRoute.post('/pedidousuario', authUsuario, pedidosUsuarios)

pedidoRoute.post('/verificarstripe', authUsuario, verificarStripe)


