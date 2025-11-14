import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  base: '/Schwerterschlag/',
  plugins: [
    legacy({
      targets: ['defaults', 'not dead']
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2
      }
    }
  }
});
