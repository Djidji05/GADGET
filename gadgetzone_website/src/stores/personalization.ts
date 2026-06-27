import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { personalizationService, type Card } from '@/services/personalization'

export const usePersonalizationStore = defineStore('personalization', () => {
    const topDiscoveryCards = ref<Card[]>([])
    const weatherPicksCards = ref<Card[]>([])
    const weatherPicksConfig = ref<any>(null)
    const dealsToDiscoverCards = ref<Card[]>([])
    const adsConfig = ref<any>(null)
    const activeRequests = ref(0)
    const isLoading = computed(() => activeRequests.value > 0)
    
    const startLoading = () => { activeRequests.value++ }
    const stopLoading = () => { activeRequests.value = Math.max(0, activeRequests.value - 1) }

    const loadTopDiscovery = async () => {
        startLoading()
        try {
            const data = await personalizationService.getTopDiscovery()
            if (data && data.content && Array.isArray(data.content.items)) {
                topDiscoveryCards.value = data.content.items
            }
        } catch (e) {
            console.error(e)
        } finally {
            stopLoading()
        }
    }

    const loadWeatherPicks = async () => {
        startLoading()
        try {
            const data = await personalizationService.getWeatherPicks()
            if (data && data.content) {
                weatherPicksConfig.value = data
                if (Array.isArray(data.content.items)) {
                    weatherPicksCards.value = data.content.items
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            stopLoading()
        }
    }

    const loadDealsToDiscover = async () => {
        startLoading()
        try {
            const data = await personalizationService.getDealsToDiscover()
            if (data && data.content && Array.isArray(data.content.items)) {
                dealsToDiscoverCards.value = data.content.items
            }
        } catch (e) {
            console.error(e)
        } finally {
            stopLoading()
        }
    }

    const loadAds = async () => {
        try {
            const data = await personalizationService.getAds()
            if (data && data.content) {
                adsConfig.value = data.content
            }
        } catch (e) {
            console.error(e)
        }
    }

    return {
        topDiscoveryCards,
        weatherPicksCards,
        weatherPicksConfig,
        dealsToDiscoverCards,
        adsConfig,
        isLoading,
        loadTopDiscovery,
        loadWeatherPicks,
        loadDealsToDiscover,
        loadAds
    }
})
