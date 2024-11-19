import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Define a base para rotas relativas (use '/' para SPAs hospedadas na raiz)
  build: {
    outDir: 'dist', // Diretório de saída padrão
  },
  server: {
    host: true, // Permite acessar em outros dispositivos na mesma rede
  },
});
