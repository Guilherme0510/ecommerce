import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Use caminhos relativos para funcionar corretamente
  build: {
    outDir: 'dist', // Confirma que o Vite gera arquivos na pasta 'dist'
  },
});
