<template>
  <div class="container mx-auto px-4 pt-4 pb-12">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Promotions</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="n in 6" :key="n" class="bg-white rounded-lg overflow-hidden">
          <div class="h-48 bg-gray-300"></div>
          <div class="p-6 space-y-3">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-3 bg-gray-300 rounded w-1/2"></div>
            <div class="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Promotions List -->
    <div v-else-if="promotions.length > 0" class="space-y-8">
      <!-- Active Promotions -->
      <div>
        <h2 class="text-2xl font-semibold mb-6">Offres Actives</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="promotion in activePromotions"
            :key="promotion.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div class="relative">
              <img
                v-if="promotion.image"
                :src="promotion.image"
                :alt="promotion.title"
                class="w-full h-48 object-cover"
              />
              <div
                v-else
                class="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"
              >
                <i class="las la-tag text-white text-4xl"></i>
              </div>
              <div
                class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold"
              >
                -{{ promotion.discount
                }}{{ promotion.discountType === 'percentage' ? '%' : ' HTG' }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ promotion.title }}</h3>
              <p class="text-gray-600 mb-4">{{ promotion.description }}</p>

              <div class="space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Code promo:</span>
                  <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ promotion.code }}</span>
                </div>

                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Valide jusqu'au:</span>
                  <span class="text-gray-700">{{ formatDate(promotion.endDate) }}</span>
                </div>

                <div v-if="promotion.minAmount" class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Min. d'achat:</span>
                  <span class="text-gray-700">{{ formatPrice(promotion.minAmount) }}</span>
                </div>
              </div>

              <div class="mt-6 space-y-2">
                <button @click="copyCode(promotion.code)" class="w-full btn-primary">
                  <i class="las la-copy mr-2"></i>
                  Copier le code
                </button>
                <router-link to="/products" class="w-full btn-secondary text-center block">
                  Voir les produits éligibles
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expired Promotions -->
      <div v-if="expiredPromotions.length > 0">
        <h2 class="text-2xl font-semibold mb-6">Offres Expirées</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
          <div
            v-for="promotion in expiredPromotions"
            :key="promotion.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div class="relative">
              <img
                v-if="promotion.image"
                :src="promotion.image"
                :alt="promotion.title"
                class="w-full h-48 object-cover grayscale"
              />
              <div
                v-else
                class="w-full h-48 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center"
              >
                <i class="las la-tag text-white text-4xl"></i>
              </div>
              <div
                class="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full font-bold"
              >
                Expirée
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ promotion.title }}</h3>
              <p class="text-gray-600 mb-2">{{ promotion.description }}</p>
              <p class="text-sm text-gray-500">Expirée le {{ formatDate(promotion.endDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <i class="las la-tag text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">Aucune promotion</h3>
      <p class="text-gray-500 mb-6">Revenez bientôt pour découvrir nos offres spéciales</p>
      <router-link to="/products" class="btn-primary"> Découvrir nos produits </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePromotionsStore } from '@/stores/promotions'

const promotionsStore = usePromotionsStore()

// State
const isCopied = ref('')

// Computed
const promotions = computed(() => promotionsStore.activePromotions)
const isLoading = computed(() => promotionsStore.isLoading)

const activePromotions = computed(() => {
  const now = new Date()
  return promotions.value.filter((promo) => promo.isActive && new Date(promo.endDate) > now)
})

const expiredPromotions = computed(() => {
  const now = new Date()
  return promotions.value.filter((promo) => new Date(promo.endDate) <= now)
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-HT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price)
}

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    isCopied.value = code
    setTimeout(() => {
      isCopied.value = ''
    }, 2000)
  } catch (error) {
    console.error('Error copying code:', error)
  }
}

// Load promotions on mount
onMounted(() => {
  promotionsStore.loadActivePromotions()
})
</script>
