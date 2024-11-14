import authUsuario from '../middleware/auth.js'
import express from 'express'
import { addParaCarrinho, atualizarCarrinho, carrinhoUsuario } from '../controllers/carrinhoController.js'

export const carrinhoRoute = express.Router() 

carrinhoRoute.post('/addcarrinho', authUsuario ,addParaCarrinho)
carrinhoRoute.post('/visualizar', authUsuario, carrinhoUsuario )
carrinhoRoute.post('/atualizar', authUsuario, atualizarCarrinho)