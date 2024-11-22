import EfiPay from 'sdk-node-apis-efi';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Importar fileURLToPath para compatibilidade com módulos ES

dotenv.config();

// Obter o caminho do diretório com import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const gerenciaNetConfig = async () => {
  // Caminho correto para o certificado
  const cert = fs.readFileSync(
    path.resolve(__dirname, `../certs/${process.env.CERTIFICADO_PROD}`)
  );
  
  
  // Configuração do cliente Gerencianet
  const gerenciaNetClient = new EfiPay({
    client_id: process.env.CHAVE_CLIENT_ID_PROD,
    client_secret: process.env.CHAVE_CLIENT_SECRET_PROD,
    sandbox: false, 
  });

  return gerenciaNetClient;
};
