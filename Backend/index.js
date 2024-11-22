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

// Certificados HTTPS
const certPath = path.join(process.cwd(), "certs", process.env.CERTIFICADO);
const certBuffer = fs.readFileSync(certPath);
const agent = new https.Agent({
  pfx: certBuffer,
  passphrase: "", // Substitua se necessário
});

// Gera as credenciais em base64
const credentials = Buffer.from(
  `${process.env.CHAVE_CLIENT_ID}:${process.env.CHAVE_CLIENT_SECRET}`
).toString("base64");

// Função para registrar o webhook no Gerencianet
const registrarWebhook = async (accessToken) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.ENDPOINT}/v1/webhook`, // Endpoint para configurar o webhook
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        url: "https://ecommerce-maps-backend.vercel.app/webhook", 
      },
    });

    console.log("Webhook registrado com sucesso", response.data);
  } catch (error) {
    console.error("Erro ao registrar webhook", error);
  }
};

// Rota para autenticar e gerar o QRCode de cobrança
app.get("/", async (req, res) => {
  const authResponse = await axios({
    method: "POST",
    url: `${process.env.ENDPOINT}/oauth/token`,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    httpsAgent: agent,
    data: {
      grant_type: "client_credentials",
    },
  });

  const accessToken = authResponse.data?.access_token;

  // Registrar o webhook assim que o token for obtido
  await registrarWebhook(accessToken);

  const reqGN = axios.create({
    baseURL: process.env.ENDPOINT,
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
      cpf: "12345678909",
      nome: "Francisco da Silva",
    },
    valor: {
      original: "100.00",
    },
    chave: "11932911121",
    solicitacaoPagador: "Cobrança dos serviços prestados.",
  };

  const cobResponse = await reqGN.post("/v2/cob", dataCob);
  const qrCodeResponse = await reqGN.get(`v2/loc/${cobResponse.data.loc.id}/qrcode`);

  res.send(qrCodeResponse.data);
});
// Rota para receber notificações de pagamento via Webhook
app.post("/webhook", async (req, res) => {
  const notificacao = req.body;
  console.log("Notificação recebida:", notificacao); // Para verificar a estrutura completa

  // Verificar se a notificação contém os dados esperados
  if (!notificacao || !notificacao.loc) {
    return res.status(400).json({ message: "Notificação inválida." });
  }

  // Acessando diretamente o status e o loc
  const { status, loc } = notificacao; // Acesse status e loc diretamente

  console.log("Status da cobrança:", status); // Exibe o status
  console.log("Dados da localização (loc):", loc); // Exibe o loc

  if (status === "Pago") {
    console.log("Pagamento efetuado com sucesso!");
    res.json({ success: true, message: "Pagamento confirmado!" });
  } else {
    console.log("Pagamento não confirmado. Status:", status);

    // Verificar se loc existe antes de tentar acessar loc.id
    if (loc && loc.id) {
      const statusVerificado = await verificarStatusPagamento(loc.id);
      if (statusVerificado === "Pago") {
        console.log("Pagamento confirmado após verificação adicional!");
        res.json({ success: true, message: "Pagamento confirmado após verificação!" });
      } else {
        console.log("Pagamento ainda não confirmado ou status diferente:", statusVerificado);
        res.json({ success: false, message: "Pagamento não confirmado após verificação." });
      }
    } else {
      console.log("Loc não encontrado na notificação.");
      res.json({ success: false, message: "Dados da cobrança não encontrados." });
    }
  }
});

const verificarStatusPagamento = async (locId) => {
  try {
    const statusResponse = await axios.get(`${process.env.ENDPOINT}/v2/loc/${locId}`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`, // Substitua com seu token de acesso
      }
    });

    const statusCob = statusResponse.data.status;
    return statusCob; // Retorna o status da cobrança
  } catch (error) {
    console.error("Erro ao verificar o status da cobrança:", error);
    return null;
  }
};


// Inicializar o servidor
app.listen(port, () => console.log("Rodando na porta " + port));
