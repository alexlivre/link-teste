// vite.config.js
// Configuração Vite para Vue.js seguindo Clean Code

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Função pequena para configuração (< 20 linhas)
const createViteConfig = () => {
  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue'],
            router: ['vue-router']
          }
        }
      }
    }
  })
}

export default createViteConfig()
