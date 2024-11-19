import express, { response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './config/mongodb.js';
import { usuarioRoute } from './routes/usuarioRoute.js';
import { produtoRoute } from './routes/produtoRoute.js';
import {pedidoRoute} from './routes/pedidoRoute.js';
import {carrinhoRoute}  from './routes/carrinhoRoute.js';
import { connectCloudinary } from './config/cloudinary.js';
import { gerenciaNetConfig } from './config/gerencianet.js';
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import https from 'https'

dotenv.config();
const app = express();
const port = process.env.PORT || 4000
connectDb()
connectCloudinary()
gerenciaNetConfig()

app.use(cors());
app.use(express.json());


app.use('/api/user', usuarioRoute)
app.use('/api/produto', produtoRoute)
app.use('/api/pedido', pedidoRoute)
app.use('/api/carrinho', carrinhoRoute)



// curl --request POST \
//   --url https://pix-h.api.efipay.com.br/oauth/token \
//   --header 'Authorization: Basic Q2xpZW50X0lkX2EzNWI2OGFiMDU0YjBkYzVjZjVmODE1ZWI4YWQ4NjY2YzEzYjFiZWU6Q2xpZW50X1NlY3JldF8xYTY3MTc3NTBiMzA5MDY5YTZhODU5N2I4OTQ4YjBjZTY4NGM5NjYz' \
//   --header 'Content-Type: application/json' \
//   --header 'User-Agent: insomnia/10.1.1' \
//   --data '{
// 	"grant_type": "client_credentials"
// }'

const certPath = path.join(process.cwd(), 'certs', process.env.CERTIFICADO);

// Lê o certificado (PFX) como um buffer
const certBuffer = fs.readFileSync(certPath);

// Configuração do agente HTTPS
const agent = new https.Agent({
  pfx: certBuffer,
  passphrase: '', // Substitua se necessário
});

// Gera as credenciais em base64
const credentials = Buffer.from(
  `${process.env.CHAVE_CLIENT_ID}:${process.env.CHAVE_CLIENT_SECRET}`
).toString('base64');

// Faz a requisição
axios({
  method: 'POST',
  url: `${process.env.ENDPOINT}/oauth/token`,
  headers: {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json',
  },
  httpsAgent: agent,
  data: {
    grant_type: 'client_credentials'
  }
}).then((response) => {
  const accessToken = response.data?.access_token

  const endpoint = `${process.env.ENDPOINT}/v2/cob`

  const dataCob = {
    calendario: {
      expiracao: 3600
    },
    devedor: {
      cpf: "12345678909",
      nome: "Francisco da Silva"
    },
    valor: {
      original: "100.00"
    },
    chave: "11932911121",
    solicitacaoPagador: "Cobrança dos serviços prestados."
  }

  const config = {
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  }

  axios.post(endpoint, dataCob, config).then(console.log);
});


app.get('/', (req,res) => {
  res.send(`api funcionando`);
})

app.listen(port, () => console.log("Rodando na porta " + port))
