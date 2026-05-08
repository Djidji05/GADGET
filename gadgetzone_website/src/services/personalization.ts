import { api } from './api'

export interface GridItem {
    id?: number
    name?: string
    image?: string
    link?: string
}

export interface Card {
    id: string | number
    type: 'grid' | 'promo' | 'banner'
    title: string
    subtitle?: string
    promoText?: string
    image?: string
    items?: GridItem[]
    link?: string
    linkText?: string
    category?: string
    promoStyle?: 'image' | 'color'
    backgroundColor?: string
    cols?: number
}

export const personalizationService = {
    getTopDiscovery: async () => {
        try {
            const response = await api.get('/personalization/sections/top_discovery')
            return response.data;
        } catch (error) {
            console.warn('Failed to fetch Top Discovery', error)
            return null
        }
    },

    getWeatherPicks: async () => {
        try {
            const response = await api.get('/personalization/sections/weather_picks')
            return response.data;
        } catch (error) {
            console.warn('Failed to fetch Weather Picks', error)
            return null
        }
    },

    getDealsToDiscover: async () => {
        try {
            const response = await api.get('/personalization/sections/deals_to_discover')
            return response.data;
        } catch (error) {
            console.warn('Failed to fetch Deals to Discover', error)
            return null
        }
    },

    getAds: async () => {
        try {
            const response = await api.get('/personalization/sections/ads')
            return response.data;
        } catch (error) {
            console.warn('Failed to fetch Ads', error)
            return null
        }
    }
}
