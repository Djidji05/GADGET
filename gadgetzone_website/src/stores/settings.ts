import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { settingsService } from '@/services/api'
import { normalizeImageUrl } from '@/utils/urlHelper'

export const useSettingsStore = defineStore('settings', () => {
    const general = ref({
        site_name: 'Panyem',
        site_logo: '',
        maintenance_mode: 'false',
        usd_exchange_rate: '135.00',
        isLoaded: false
    })

    const fetchGeneralSettings = async () => {
        try {
            const data = await settingsService.get('general')
            general.value = {
                site_name: data.site_name || 'Panyem',
                site_logo: data.site_logo || '',
                maintenance_mode: String(data.maintenance_mode || 'false'),
                usd_exchange_rate: String(data.usd_exchange_rate || '135.00'),
                isLoaded: true
            }
        } catch (error) {
            console.error('Error fetching general settings:', error)
            general.value.isLoaded = true
        }
    }

    const getImageUrl = (path: string) => {
        return normalizeImageUrl(path)
    }

    const logoUrl = computed(() => {
        if (general.value.site_logo) {
            return getImageUrl(general.value.site_logo)
        }
        return '/images/logo.webp' // Default fallback
    })

    return {
        general,
        fetchGeneralSettings,
        logoUrl,
    }
})
