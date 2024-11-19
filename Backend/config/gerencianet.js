import EfiPay from 'sdk-node-apis-efi';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export const gerenciaNetConfig = async () => {
  const certificado = fs.readFileSync("certs/homologacao-630873-ecommerce-maps.p12");

  const gerenciaNetClient = new EfiPay({
    client_id: process.env.GN_CLIENT_ID,
    client_secret: process.env.GN_CLIENT_SECRET,
    sandbox: process.env.GN_ENV === 'true', 
    certificate: certificado,
  });

  return gerenciaNetClient;
};
