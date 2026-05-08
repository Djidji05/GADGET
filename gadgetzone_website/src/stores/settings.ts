import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { settingsService } from '@/services/api'

export const useSettingsStore = defineStore('settings', () => {
    const general = ref({
        site_name: 'HTFasil',
        site_logo: '',
        maintenance_mode: 'false',
        isLoaded: false
    })

    const fetchGeneralSettings = async () => {
        try {
            const data = await settingsService.get('general')
            general.value = {
                site_name: data.site_name || 'HTFasil',
                site_logo: data.site_logo || '',
                maintenance_mode: String(data.maintenance_mode || 'false'),
                isLoaded: true
            }
        } catch (error) {
            console.error('Error fetching general settings:', error)
        }
    }

    const getImageUrl = (path: string) => {
        if (!path) return ''
        if (path.startsWith('http')) return path
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3003'
        return `${baseUrl}${path}`
    }

    const logoUrl = computed(() => {
        if (general.value.site_logo) {
            return getImageUrl(general.value.site_logo)
        }
        return '/images/logo.png' // Default fallback
    })

    return {
        general,
        fetchGeneralSettings,
        logoUrl,
    }
})
