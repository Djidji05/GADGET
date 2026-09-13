import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

function fontDisplaySwapPlugin() {
  return {
    name: 'font-display-swap-plugin',
    transform(code: string, id: string) {
      if (id.endsWith('.css') || id.includes('.css?')) {
        let updated = code.replace(/font-display\s*:\s*(block|auto|fallback|optional)/gi, 'font-display: swap');
        updated = updated.replace(/@font-face\s*\{(?!\s*font-display:)/gi, '@font-face { font-display: swap; ');
        return updated;
      }
    },
    generateBundle(_options: any, bundle: any) {
      for (const file in bundle) {
        if (file.endsWith('.css')) {
          const chunk = bundle[file];
          if (chunk.type === 'asset' && typeof chunk.source === 'string') {
            let updated = chunk.source.replace(/font-display\s*:\s*(block|auto|fallback|optional)/gi, 'font-display: swap');
            updated = updated.replace(/@font-face\s*\{(?!\s*font-display:)/gi, '@font-face { font-display: swap; ');
            chunk.source = updated;
          }
        }
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    fontDisplaySwapPlugin(),
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      devOptions: {
        enabled: false
      },
      manifest: {
        name: 'Panyem',
        short_name: 'Panyem',
        description: 'La meilleure marketplace e-commerce en Haïti',
        theme_color: '#2563eb', // Blue
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vue-core';
            }
            if (id.includes('axios') || id.includes('vue-i18n')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
