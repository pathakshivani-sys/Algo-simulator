import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        arena: resolve(__dirname, 'arena.html'),
        learn: resolve(__dirname, 'learn.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
  server: {
    port: 3000,
  }
});
