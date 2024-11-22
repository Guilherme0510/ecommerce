import EfiPay from 'sdk-node-apis-efi';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export const gerenciaNetConfig = async () => {
  const certPath = path.join(__dirname, 'certs', 'producao-630873-ecommerce-maps.p12');
const cert = fs.readFileSync(certPath);

  console.log(cert);
  

  const gerenciaNetClient = new EfiPay({
    client_id: process.env.CHAVE_CLIENT_ID_PROD,
    client_secret: process.env.CHAVE_CLIENT_SECRET_PROD,
    sandbox: false, 
    certificate: cert,
  });

  return gerenciaNetClient;
};
