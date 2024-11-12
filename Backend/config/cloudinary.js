import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do .env
dotenv.config();
export const connectCloudinary = async () => {

// Configuração do Cloudinary com variáveis de ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
}