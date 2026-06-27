import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useComparisonStore = defineStore('comparison', () => {
    const MAX_ITEMS = 3
    const items = ref<any[]>([])

    const addItem = (product: any) => {
        if (items.value.length >= MAX_ITEMS) return false
        if (items.value.some(i => i.id === product.id)) return false
        items.value.push(product)
        save()
        return true
    }

    const removeItem = (productId: number) => {
        items.value = items.value.filter(i => i.id !== productId)
        save()
    }

    const toggleItem = (product: any): boolean => {
        if (isInComparison(product.id)) {
            removeItem(product.id)
            return false
        }
        return addItem(product)
    }

    const clearAll = () => {
        items.value = []
        sessionStorage.removeItem('comparison')
    }

    const isInComparison = (productId: number) => items.value.some(i => i.id === productId)

    const save = () => {
        sessionStorage.setItem('comparison', JSON.stringify(items.value))
    }

    const init = () => {
        const stored = sessionStorage.getItem('comparison')
        if (stored) items.value = JSON.parse(stored)
    }

    init()

    return { items, addItem, removeItem, toggleItem, clearAll, isInComparison, MAX_ITEMS }
})
