import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
    const searchHistory = ref<string[]>([])
    const browsingHistory = ref<any[]>([])
    const productsScrollPosition = ref(0)
    const MAX_SEARCH_HISTORY = 10
    const MAX_VIEW_HISTORY = 10

    // Init from localStorage
    const init = () => {
        // Search History
        const savedSearch = localStorage.getItem('search_history')
        if (savedSearch) {
            try {
                searchHistory.value = JSON.parse(savedSearch)
            } catch (e) {
                searchHistory.value = []
            }
        }

        // Browsing History
        const savedViews = localStorage.getItem('browsing_history')
        if (savedViews) {
            try {
                browsingHistory.value = JSON.parse(savedViews)
            } catch (e) {
                browsingHistory.value = []
            }
        }
    }

    const addSearch = (query: string) => {
        if (!query || query.trim().length === 0) return
        const trimmed = query.trim().toLowerCase()
        searchHistory.value = searchHistory.value.filter(s => s !== trimmed)
        searchHistory.value.unshift(trimmed)
        if (searchHistory.value.length > MAX_SEARCH_HISTORY) {
            searchHistory.value = searchHistory.value.slice(0, MAX_SEARCH_HISTORY)
        }
        localStorage.setItem('search_history', JSON.stringify(searchHistory.value))
    }

    const addProductView = (product: any) => {
        if (!product || !product.id) return

        const existing = browsingHistory.value.find(p => p.id === product.id)
        if (existing) {
            existing.viewCount = (existing.viewCount || 1) + 1
            existing.lastViewed = new Date().toISOString()
            // Move to front
            browsingHistory.value = browsingHistory.value.filter(p => p.id !== product.id)
            browsingHistory.value.unshift(existing)
        } else {
            browsingHistory.value.unshift({
                ...product,
                viewCount: 1,
                lastViewed: new Date().toISOString()
            })
        }

        if (browsingHistory.value.length > MAX_VIEW_HISTORY) {
            browsingHistory.value = browsingHistory.value.slice(0, MAX_VIEW_HISTORY)
        }

        localStorage.setItem('browsing_history', JSON.stringify(browsingHistory.value))
    }

    const clearHistory = () => {
        searchHistory.value = []
        browsingHistory.value = []
        localStorage.removeItem('search_history')
        localStorage.removeItem('browsing_history')
    }

    return {
        searchHistory,
        browsingHistory,
        productsScrollPosition,
        addSearch,
        addProductView,
        clearHistory,
        init
    }
})
