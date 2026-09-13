import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { personalizationService, type Card } from '@/services/personalization'
import { normalizeImageUrl } from '@/utils/urlHelper'

const normalizeCardImages = (cards: any[]) => {
    if (!Array.isArray(cards)) return []
    return cards.map(c => ({
        ...c,
        image: c.image ? normalizeImageUrl(c.image) : c.image,
        items: Array.isArray(c.items) ? c.items.map((i: any) => ({
            ...i,
            image: i.image ? normalizeImageUrl(i.image) : i.image
        })) : c.items
    }))
}

const normalizeAds = (ads: any) => {
    if (!ads) return ads
    const copy = { ...ads }
    if (copy.interBanner && copy.interBanner.image) {
        copy.interBanner.image = normalizeImageUrl(copy.interBanner.image)
    }
    if (Array.isArray(copy.interBanners)) {
        copy.interBanners = copy.interBanners.map((b: any) => ({
            ...b,
            image: b.image ? normalizeImageUrl(b.image) : b.image
        }))
    }
    return copy
}

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
                topDiscoveryCards.value = normalizeCardImages(data.content.items)
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
                    weatherPicksCards.value = normalizeCardImages(data.content.items)
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
                dealsToDiscoverCards.value = normalizeCardImages(data.content.items)
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
                adsConfig.value = normalizeAds(data.content)
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
