import EfiPay from 'sdk-node-apis-efi';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export const gerenciaNetConfig = async () => {
  const certificado = fs.readFileSync("certs/producao-630873-ecommerce-maps.p12");

  console.log(certificado);
  

  const gerenciaNetClient = new EfiPay({
    client_id: process.env.CHAVE_CLIENT_ID_PROD,
    client_secret: process.env.CHAVE_CLIENT_SECRET_PROD,
    sandbox: false, 
    certificate: certificado,
  });

  return gerenciaNetClient;
};
