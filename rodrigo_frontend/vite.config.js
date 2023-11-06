import { fileURLToPath, URL } from 'node:url'
import dotenv from 'dotenv';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
      'vue': 'vue/dist/vue.esm-bundler'
    }
  },
  server: {
    proxy: {
      '/rodrigo-rodrigo-backend': {
        target: 'https://wecollectdiecast.ca',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
  }
})
