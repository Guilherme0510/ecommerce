import express from 'express';
import cors from 'cors';
import { connectDb } from './config/mongodb.js';
import { usuarioRoute } from './routes/usuarioRoute.js';
import { produtoRoute } from './routes/produtoRoute.js';
import {pedidoRoute} from './routes/pedidoRoute.js';
import {carrinhoRoute}  from './routes/carrinhoRoute.js';
import { connectCloudinary } from './config/cloudinary.js';

const app = express();
const port = 4000
connectDb()
connectCloudinary()

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.send("API Working")
})



app.use('/api/user', usuarioRoute)
app.use('/api/produto', produtoRoute)
app.use('/api/pedido', pedidoRoute)
app.use('/api/carrinho', carrinhoRoute)


app.listen(port, () => console.log("Rodando na porta " + port))
