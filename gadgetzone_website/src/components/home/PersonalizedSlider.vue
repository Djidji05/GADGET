<template>
<section v-if="isLoading || recommendations.length > 0" class="py-10 bg-gray-50/50">
    <div class="container mx-auto px-4">
      <div class="flex items-end justify-between mb-8 px-2">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900">{{ $t('home.inspired_picks') }}</h2>
          <p class="text-gray-500 text-sm md:text-base mt-1">{{ $t('home.interested_products') }}</p>
        </div>
        <router-link to="/products" class="text-blue-600 font-bold text-sm hover:underline flex items-center gap-2">
          {{ $t('common.see_all') || 'Tout voir' }} <i class="fas fa-arrow-right text-[10px]"></i>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex overflow-x-auto pb-6 gap-4 no-scrollbar px-2">
        <div 
          v-for="n in 4" 
          :key="n" 
          class="flex-shrink-0 w-[calc(55%-8px)] sm:w-[240px] md:w-[280px] animate-pulse"
        >
          <div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 h-[340px] flex flex-col">
            <div class="w-full aspect-square bg-gray-100 rounded-xl mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="mt-auto flex justify-between items-center">
              <div class="h-6 bg-gray-200 rounded w-1/3"></div>
              <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="relative group px-2">
        <!-- Left Button -->
        <button 
          @click="scroll('left')"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 md:-left-4"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <!-- Right Button -->
        <button 
          @click="scroll('right')"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 md:-right-4"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <div 
          ref="scrollContainer"
          class="flex overflow-x-auto pb-6 gap-4 no-scrollbar scroll-smooth snap-x"
        >
          <div 
            v-for="product in recommendations"
            :key="product.id"
            class="flex-shrink-0 w-[calc(55%-8px)] sm:w-[240px] md:w-[280px] snap-start"
          >
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Fallback if no history (Trending) -->
  <section v-else-if="trendingProducts.length > 0" class="py-10">
    <div class="container mx-auto px-4 text-center">
       <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
          <i class="fas fa-fire"></i> {{ $t('home.trending_now') }}
       </div>
       <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{{ $t('home.discover_best_sales') }}</h2>
       
       <div class="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
          <ProductCard v-for="product in trendingProducts" :key="product.id" :product="product" />
       </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useHistoryStore } from '@/stores/history'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/products/ProductCard.vue'

const props = withDefaults(defineProps<{
  isLoading?: boolean;
}>(), {
  isLoading: false
})

const historyStore = useHistoryStore()
const productsStore = useProductsStore()
const scrollContainer = ref<HTMLElement | null>(null)

const recommendations = ref<any[]>([])
const trendingProducts = computed(() => productsStore.featuredProducts.slice(0, 4))

const fetchRecommendations = async () => {
  if (historyStore.searchHistory.length === 0) {
    recommendations.value = []
    return
  }

  // Use top 2 searches to get products
  const topSearches = historyStore.searchHistory.slice(0, 2)
  let foundProducts: any[] = []

  for (const query of topSearches) {
     const results = await productsStore.searchProducts(query)
     if (results && results.length > 0) {
        foundProducts = [...foundProducts, ...results]
     }
  }

  // Randomize and unique
  const unique = Array.from(new Set(foundProducts.map(p => p.id)))
    .map(id => foundProducts.find(p => p.id === id))
    .sort(() => 0.5 - Math.random())
    .slice(0, 8)

  recommendations.value = unique
}

const scroll = (direction: 'left' | 'right') => {
  if (scrollContainer.value) {
    const amount = scrollContainer.value.clientWidth * 0.8
    scrollContainer.value.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }
}

onMounted(() => {
  historyStore.init()
  fetchRecommendations()
})

// Update if history changes (e.g. user searches something new)
watch(() => historyStore.searchHistory, () => {
  fetchRecommendations()
}, { deep: true })
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
