import EfiPay from "sdk-node-apis-efi";
import dotenv from "dotenv";

dotenv.config();

export const gerenciaNetConfig = async () => {
  // Obter o conteúdo do certificado em Base64 da variável de ambiente
  const certBase64 = process.env.CERTIFICATE_P12;

  if (!certBase64) {
    throw new Error("Certificado não encontrado na variável de ambiente.");
  }

  // Converter o Base64 para um Buffer
  const cert = Buffer.from(certBase64, "base64");

  // Configuração do cliente Gerencianet
  const gerenciaNetClient = new EfiPay({
    client_id: process.env.CHAVE_CLIENT_ID_PROD,
    client_secret: process.env.CHAVE_CLIENT_SECRET_PROD,
    sandbox: false,
    certificate: cert,
  });

  return gerenciaNetClient;
};
