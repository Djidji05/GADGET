import { defineStore } from 'pinia'
import { ref } from 'vue'
import { personalizationService, type Card } from '@/services/personalization'

export const usePersonalizationStore = defineStore('personalization', () => {
    const topDiscoveryCards = ref<Card[]>([])
    const weatherPicksCards = ref<Card[]>([])
    const weatherPicksConfig = ref<any>(null)
    const dealsToDiscoverCards = ref<Card[]>([])
    const adsConfig = ref<any>(null)
    const isLoading = ref(false)

    const loadTopDiscovery = async () => {
        isLoading.value = true
        try {
            const data = await personalizationService.getTopDiscovery()
            if (data && data.content && Array.isArray(data.content.items)) {
                topDiscoveryCards.value = data.content.items
            }
        } catch (e) {
            console.error(e)
        } finally {
            isLoading.value = false
        }
    }

    const loadWeatherPicks = async () => {
        isLoading.value = true
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
            isLoading.value = false
        }
    }

    const loadDealsToDiscover = async () => {
        isLoading.value = true
        try {
            const data = await personalizationService.getDealsToDiscover()
            if (data && data.content && Array.isArray(data.content.items)) {
                dealsToDiscoverCards.value = data.content.items
            }
        } catch (e) {
            console.error(e)
        } finally {
            isLoading.value = false
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
