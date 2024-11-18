import express from 'express'
import authUsuario from '../middleware/auth.js'
import { atualizarStatus, fazerPedido, fazerPedidoStripe, gerenciaNetPix, pedidosUsuarios, todosPedidos, verificarStripe } from '../controllers/pedidoController.js'
import adminAuth from '../middleware/admin_auth.js'

export const pedidoRoute = express.Router() 

pedidoRoute.post('/fazer_pedido', authUsuario, fazerPedido)
pedidoRoute.post('/pix', gerenciaNetPix);
pedidoRoute.post('/stripe', authUsuario, fazerPedidoStripe)


pedidoRoute.post('/lista', todosPedidos )
pedidoRoute.post('/status', atualizarStatus)

pedidoRoute.post('/pedidousuario', authUsuario, pedidosUsuarios)

pedidoRoute.post('/verificarstripe', authUsuario, verificarStripe)