import express from 'express'
import { admin, Login, registrar } from '../controllers/usuarioController.js'

export const usuarioRoute = express.Router()
usuarioRoute.post('/registrar', registrar)
usuarioRoute.post('/login', Login)
usuarioRoute.post('/admin', admin)
