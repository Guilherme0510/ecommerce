import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtém o diretório atual do arquivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define o diretório onde as imagens serão armazenadas
const uploadDir = path.join(__dirname, 'uploads');

// Cria o diretório se não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Cria o diretório se não existir
}

// Configuração do multer
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, uploadDir); // Usa o diretório criado
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname); // Adiciona um timestamp ao nome do arquivo
    }
});

const upload = multer({ storage });

export default upload;
