import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { promotionsService, type Banner, type Promotion } from '@/services/promotions'
import {
  fallbackBanners,
  fallbackPromotions,
  validateFallbackPromoCode,
  isValidApiResponse,
} from '@/services/fallback'

export const usePromotionsStore = defineStore('promotions', () => {
  // State
  const activeBanners = ref<Banner[]>([])
  const activePromotions = ref<Promotion[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const usingFallback = ref(false)

  // Getters
  const hasActiveBanners = computed(() => activeBanners.value.length > 0)
  const hasActivePromotions = computed(() => activePromotions.value.length > 0)
  const isUsingFallback = computed(() => usingFallback.value)

  // Actions
  const loadActiveBanners = async () => {
    try {
      console.log('🎯 Loading banners...')
      isLoading.value = true
      error.value = null
      usingFallback.value = false

      const banners = await promotionsService.getActiveBanners()
      console.log('🎯 Banners response:', banners)

      // Vérifier si la réponse est valide
      if (isValidApiResponse(banners) && Array.isArray(banners)) {
        activeBanners.value = banners
        console.log('✅ Banners loaded from API:', banners.length)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ API failed, using fallback banners')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value =
        errorResponse.response?.data?.message ||
        'API indisponible - utilisation des données locales'

      // Utiliser les fallbacks
      activeBanners.value = fallbackBanners
      usingFallback.value = true
      console.log('✅ Fallback banners loaded:', fallbackBanners.length)
    } finally {
      isLoading.value = false
    }
  }

  const loadActivePromotions = async () => {
    try {
      console.log('🎁 Loading promotions...')
      isLoading.value = true
      error.value = null
      usingFallback.value = false

      const promotions = await promotionsService.getActivePromotions()
      console.log('🎁 Promotions response:', promotions)

      // Vérifier si la réponse est valide
      if (isValidApiResponse(promotions) && Array.isArray(promotions)) {
        activePromotions.value = promotions
        console.log('✅ Promotions loaded from API:', promotions.length)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ API failed, using fallback promotions')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value =
        errorResponse.response?.data?.message ||
        'API indisponible - utilisation des données locales'

      // Utiliser les fallbacks
      activePromotions.value = fallbackPromotions
      usingFallback.value = true
      console.log('✅ Fallback promotions loaded:', fallbackPromotions.length)
    } finally {
      isLoading.value = false
    }
  }

  const validatePromoCode = async (code: string, cartTotal: number) => {
    try {
      isLoading.value = true
      error.value = null

      // Si on utilise déjà les fallbacks, valider localement
      if (usingFallback.value) {
        console.log('🎁 Validating promo code with fallback data')
        return validateFallbackPromoCode(code, cartTotal)
      }

      // Sinon essayer l'API
      return await promotionsService.validatePromoCode(code, cartTotal)
    } catch (err: unknown) {
      console.warn('⚠️ Promo validation API failed, using fallback')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value = errorResponse.response?.data?.message || 'API indisponible - validation locale'

      // Fallback sur la validation locale
      return validateFallbackPromoCode(code, cartTotal)
    } finally {
      isLoading.value = false
    }
  }

  const getProductPromotion = (productId: number) => {
    if (!Array.isArray(activePromotions.value)) {
      return null
    }

    return (
      activePromotions.value.find(
        (promo) =>
          promo.isActive &&
          (!promo.applicableProducts || promo.applicableProducts.includes(productId)),
      ) || null
    )
  }

  const clearError = () => {
    error.value = null
  }

  // Charger toutes les données
  const loadAllPromotionsData = async () => {
    await Promise.all([loadActiveBanners(), loadActivePromotions()])
  }

  return {
    // State
    activeBanners,
    activePromotions,
    isLoading,
    error,
    usingFallback,

    // Getters
    hasActiveBanners,
    hasActivePromotions,
    isUsingFallback,

    // Actions
    loadActiveBanners,
    loadActivePromotions,
    validatePromoCode,
    getProductPromotion,
    clearError,
    loadAllPromotionsData,
  }
})
