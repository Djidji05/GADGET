import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
    host: true,
    hmr: {
      clientPort: 5174,
      host: 'localhost',
      overlay: false
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue-core';
            }
            if (id.includes('apexcharts') || id.includes('chart.js') || id.includes('jsvectormap')) {
              return 'charts';
            }
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('canvg')) {
              return 'pdf-utils';
            }
            if (id.includes('html5-qrcode') || id.includes('zxing')) {
              return 'qr-utils';
            }
            if (id.includes('flatpickr')) {
              return 'date-utils';
            }
            return 'vendor';
          }
        }
      }
    }
  },
})
