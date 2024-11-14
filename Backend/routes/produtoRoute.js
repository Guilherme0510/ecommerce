import express from 'express';
import { addProduto, listaProduto, produtoUnico, removerProduto } from '../controllers/produtoController.js'; 
export const produtoRoute = express.Router();
import upload from "../middleware/multer.js";
import adminAuth from '../middleware/admin_auth.js'

produtoRoute.post('/addproduto', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 }
]), addProduto);

produtoRoute.get('/listaproduto', listaProduto)
produtoRoute.post('/removerproduto', removerProduto)
produtoRoute.post('/unico', produtoUnico)