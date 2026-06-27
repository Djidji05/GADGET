import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from './auth'

export const useWishlistStore = defineStore('wishlist', () => {
    const items = ref<any[]>([])
    const isSynced = ref(false) // true une fois qu'on a chargé depuis le backend

    // ──────────────────────────────────────────────────────────────
    // Chargement depuis le backend (utilisateur connecté)
    // ──────────────────────────────────────────────────────────────
    const fetchWishlist = async () => {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) {
            // Fallback localStorage pour les non-connectés
            const stored = localStorage.getItem('wishlist')
            if (stored) items.value = JSON.parse(stored)
            return
        }
        try {
            const { data } = await api.get('/wishlist')
            // L'API retourne des Wishlist entries avec product inclus
            items.value = data.wishlist.map((w: any) => w.product).filter(Boolean)
            isSynced.value = true
        } catch (err) {
            console.error('Erreur chargement wishlist:', err)
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Toggle (ajouter/retirer)
    // ──────────────────────────────────────────────────────────────
    const toggleItem = async (product: any) => {
        const authStore = useAuthStore()
        const alreadyIn = isInWishlist(product.id)

        if (!authStore.isAuthenticated) {
            // Mode offline — localStorage
            if (alreadyIn) {
                items.value = items.value.filter(i => i.id !== product.id)
            } else {
                items.value.push(product)
            }
            localStorage.setItem('wishlist', JSON.stringify(items.value))
            return
        }

        // Optimistic UI
        if (alreadyIn) {
            items.value = items.value.filter(i => i.id !== product.id)
        } else {
            items.value.push(product)
        }

        try {
            if (alreadyIn) {
                await api.delete(`/wishlist/${product.id}`)
            } else {
                await api.post(`/wishlist/${product.id}`)
            }
        } catch (err) {
            // Rollback
            if (alreadyIn) {
                items.value.push(product)
            } else {
                items.value = items.value.filter(i => i.id !== product.id)
            }
            console.error('Erreur wishlist toggle:', err)
        }
    }

    const addItem = (product: any) => {
        if (!isInWishlist(product.id)) toggleItem(product)
    }

    const removeItem = (productId: number) => {
        const product = items.value.find(i => i.id === productId)
        if (product) toggleItem(product)
    }

    const isInWishlist = (productId: number) => items.value.some(i => i.id === productId)

    const itemCount = computed(() => items.value.length)

    // Initialize
    fetchWishlist()

    return {
        items,
        isSynced,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        fetchWishlist,
        itemCount
    }
})
