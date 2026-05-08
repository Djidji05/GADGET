import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
    const items = ref<any[]>([])

    // Load from localStorage
    const init = () => {
        const stored = localStorage.getItem('wishlist')
        if (stored) {
            items.value = JSON.parse(stored)
        }
    }

    const save = () => {
        localStorage.setItem('wishlist', JSON.stringify(items.value))
    }

    const addItem = (product: any) => {
        if (!items.value.find(i => i.id === product.id)) {
            items.value.push(product)
            save()
        }
    }

    const removeItem = (productId: number) => {
        items.value = items.value.filter(i => i.id !== productId)
        save()
    }

    const toggleItem = (product: any) => {
        if (isInWishlist(product.id)) {
            removeItem(product.id)
        } else {
            addItem(product)
        }
    }

    const isInWishlist = (productId: number) => {
        return items.value.some(i => i.id === productId)
    }

    const itemCount = computed(() => items.value.length)

    // Initialize
    init()

    return {
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        itemCount
    }
})
