import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(head)

app.mount('#app')

// 📱 PWA — Enregistrement/Désenregistrement du Service Worker
if ('serviceWorker' in navigator) {
    if (import.meta.env.DEV) {
        // En développement, désenregistrer les anciens service workers pour éviter de casser HMR / WebSockets
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (const registration of registrations) {
                registration.unregister().then(success => {
                    if (success) console.log('🧹 Ancien Service Worker de dev désenregistré pour libérer HMR.');
                });
            }
        });
    } else {
        // En production, enregistrer le service worker
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(
                reg => console.log('✅ Service Worker enregistré:', reg.scope),
                err => console.warn('⚠️ Service Worker non enregistré:', err)
            )
        })
    }
}
