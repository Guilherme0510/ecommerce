import EfiPay from "sdk-node-apis-efi";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; // Para compatibilidade com módulos ES

dotenv.config();

// Obter o caminho do diretório com import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const gerenciaNetConfig = async () => {
  // Usando a variável de ambiente CERT_PATH
  const certPath = process.env.CERT_PATH || path.join(__dirname, "..", "certs", "producao-630873-ecommerce-maps.p12");

  console.log("Caminho do certificado:", certPath);

  // Ler o certificado
  const cert = fs.readFileSync(certPath);

  // Configuração do cliente Gerencianet
  const gerenciaNetClient = new EfiPay({
    client_id: process.env.CHAVE_CLIENT_ID_PROD,
    client_secret: process.env.CHAVE_CLIENT_SECRET_PROD,
    sandbox: false,
    certificate: cert,
  });

  return gerenciaNetClient;
};
