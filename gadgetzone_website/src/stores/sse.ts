import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from './auth'

export const useSSEStore = defineStore('sse', () => {
    const eventSource = ref<EventSource | null>(null)
    const isConnected = ref(false)

    const connect = () => {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated || !authStore.token) return
        if (eventSource.value) return // Déjà connecté

        const token = authStore.token
        const baseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
        const url = `${baseUrl}/sse/stream?token=${encodeURIComponent(token)}`

        const es = new EventSource(url)
        eventSource.value = es

        es.addEventListener('connected', () => {
            isConnected.value = true
            console.log('📡 SSE connecté')
        })

        es.onerror = () => {
            isConnected.value = false
            es.close()
            eventSource.value = null
            // Reconnexion automatique après 10 secondes
            setTimeout(connect, 10_000)
        }
    }

    const disconnect = () => {
        eventSource.value?.close()
        eventSource.value = null
        isConnected.value = false
    }

    const onEvent = (eventName: string, callback: (data: any) => void) => {
        if (!eventSource.value) return () => {}
        const handler = (e: MessageEvent) => {
            try { callback(JSON.parse(e.data)) } catch {}
        }
        eventSource.value.addEventListener(eventName, handler)
        return () => eventSource.value?.removeEventListener(eventName, handler)
    }

    return { isConnected, connect, disconnect, onEvent, eventSource }
})
