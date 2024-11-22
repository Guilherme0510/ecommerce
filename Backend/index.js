import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/mongodb.js";
import { usuarioRoute } from "./routes/usuarioRoute.js";
import { produtoRoute } from "./routes/produtoRoute.js";
import { pedidoRoute } from "./routes/pedidoRoute.js";
import { carrinhoRoute } from "./routes/carrinhoRoute.js";
import { connectCloudinary } from "./config/cloudinary.js";
import { gerenciaNetConfig } from "./config/gerencianet.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import https from "https";

dotenv.config();
const app = express();

const port = process.env.PORT || 4000;
connectDb();
connectCloudinary();
gerenciaNetConfig();

app.use(cors());
app.use(express.json());

app.use("/api/user", usuarioRoute);
app.use("/api/produto", produtoRoute);
app.use("/api/pedido", pedidoRoute);
app.use("/api/carrinho", carrinhoRoute);

app.get('/', (req,res) => {
  res.send('api funcionando')
})

export default app;

"ENOENT: no such file or directory, open '/var/task/certs/producao-630873-ecommerce-maps.p12'"
app.listen(port, () => console.log("Rodando na porta " + port));
