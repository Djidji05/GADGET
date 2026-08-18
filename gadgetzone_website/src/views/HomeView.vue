<template>
<div class="min-h-screen pb-32">
    <!-- Hero Section with Banners -->
    <!-- New Banner Section -->
    <!-- Mobile Banner Carousel (Infinite Loop) -->
    <!-- Unified Banner Section (Mobile & Desktop) -->
    <section class="relative">
      <div v-if="promotionsStore.isLoading" key="banner-skeleton" class="relative h-[300px] md:h-[500px] lg:h-[580px] xl:h-[620px] bg-gray-200 mx-4 rounded-2xl md:mx-0 md:rounded-none animate-pulse"></div>
      <div v-else key="banner-content" class="relative h-[300px] md:h-[500px] lg:h-[580px] xl:h-[620px] bg-gray-900 mx-4 rounded-2xl overflow-hidden shadow-md md:mx-0 md:mt-0 md:rounded-none md:shadow-none md:w-full">
        <!-- Carousel Container -->
        <div class="relative w-full h-full overflow-hidden">
          <!-- Carousel Slides -->
          <div
            v-for="(banner, index) in banners"
            :key="banner.id"
            v-show="currentBannerIndex === index"
            class="absolute inset-0 transition-opacity duration-1000 flex items-start justify-center"
          >
            <!-- Image Background -->
            <img
              :src="banner.image"
              :alt="banner.title"
              width="1920"
              height="600"
              :loading="index === 0 ? 'eager' : 'lazy'"
              class="absolute inset-0 w-full h-full object-cover"
              @error="handleImageError"
            />
            
            <!-- Overlay with smooth bottom fade for overlapping cards -->
            <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-gray-950/80"></div>

            <!-- Content -->
            <div 
              class="absolute inset-0 z-10 flex flex-col px-4 text-white transition-all duration-300"
              :class="[
                banner.verticalAlign === 'items-start' ? 'justify-start pt-6 md:pt-16 lg:pt-20' : 
                banner.verticalAlign === 'items-end' ? 'justify-end pb-8 lg:justify-start lg:pt-28' : 
                'justify-center lg:justify-start lg:pt-24',
                banner.textAlign === 'text-left' ? 'items-start text-left' : 
                banner.textAlign === 'text-right' ? 'items-end text-right' : 
                'items-center text-center'
              ]"
            >
              <div class="max-w-4xl w-full mx-auto px-4 md:px-12 flex flex-col"
                :class="[
                    banner.textAlign === 'text-left' ? 'items-start' : 
                    banner.textAlign === 'text-right' ? 'items-end' : 
                    'items-center'
                ]"
              >
                <h1 
                  class="mb-2 md:mb-4 drop-shadow-lg leading-tight"
                  :class="[
                    banner.titleSize || 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl', 
                    banner.titleWeight || 'font-extrabold'
                  ]"
                  :style="{ color: banner.titleColor || '#ffffff' }"
                >
                  {{ banner.title }}
                </h1>
                <p 
                  class="text-sm sm:text-base md:text-xl lg:text-2xl mb-4 md:mb-8 opacity-95 drop-shadow-md max-w-2xl font-medium"
                  :style="{ color: banner.subtitleColor || '#ffffff' }"
                >
                  {{ banner.subtitle }}
                </p>
                <div class="flex flex-row gap-3 md:gap-4">
                  <router-link
                    v-if="banner.link"
                    :to="banner.link"
                    class="bg-white text-gray-900 hover:bg-blue-600 hover:text-white px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-bold rounded-full shadow-xl transition-all hover:scale-105 uppercase tracking-wide flex items-center gap-2"
                  >
                    <i class="fas fa-shopping-bag"></i>
                    {{ banner.buttonText || $t('common.discover') }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Carousel Indicators -->
          <div class="absolute bottom-4 md:bottom-8 lg:bottom-56 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            <button
              v-for="(banner, index) in banners"
              :key="index"
              @click="goToBanner(index)"
              :class="[
                'w-2 h-2 rounded-full transition-all shadow-sm',
                currentBannerIndex === index
                  ? 'bg-white w-6 md:w-8'
                  : 'bg-white/50 hover:bg-white/80',
              ]"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Discovery Sections (PC Desktop Overlapping Style ONLY) -->
    <div class="relative z-20 mt-4 md:mt-6 lg:-mt-48 xl:-mt-52 max-w-7xl mx-auto px-4">
      <DiscoverySlider :cards="mainDiscoveryCards as any" :cards-per-view="4" :is-loading="personalizationStore.isLoading" />
    </div>

    <!-- Commercial Trust & Services Bar (PC Desktop ONLY) -->
    <section class="hidden lg:block max-w-7xl mx-auto px-4 my-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-gray-900 rounded-3xl p-4 md:p-6 shadow-md border border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-3.5 p-2">
          <div class="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg md:text-xl flex-shrink-0">
            <i class="fas fa-shipping-fast"></i>
          </div>
          <div>
            <h4 class="font-bold text-xs md:text-sm text-gray-900 dark:text-white">Livraison Express</h4>
            <p class="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Expédition rapide 24h-48h</p>
          </div>
        </div>
        <div class="flex items-center gap-3.5 p-2">
          <div class="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center text-lg md:text-xl flex-shrink-0">
            <i class="fas fa-shield-alt"></i>
          </div>
          <div>
            <h4 class="font-bold text-xs md:text-sm text-gray-900 dark:text-white">Produits Certifiés</h4>
            <p class="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">100% Vérifiés & Garantis</p>
          </div>
        </div>
        <div class="flex items-center gap-3.5 p-2">
          <div class="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg md:text-xl flex-shrink-0">
            <i class="fas fa-lock"></i>
          </div>
          <div>
            <h4 class="font-bold text-xs md:text-sm text-gray-900 dark:text-white">Paiement Sécurisé</h4>
            <p class="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">MonCash, QR, Carte bancaire</p>
          </div>
        </div>
        <div class="flex items-center gap-3.5 p-2">
          <div class="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-lg md:text-xl flex-shrink-0">
            <i class="fas fa-headset"></i>
          </div>
          <div>
            <h4 class="font-bold text-xs md:text-sm text-gray-900 dark:text-white">Support Local 24/7</h4>
            <p class="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Assistance rapide à votre service</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Flash Sales Section -->
    <FlashSalesSection />

    <!-- Picking Up Where You Left Off (Browsing History) -->
    <DiscoverySlider 
      v-if="browsingHistoryCards.length > 0"
      :section-title="$t('home.history_title')" 
      :cards="browsingHistoryCards as any" 
      :is-loading="productsStore.isLoading"
    />

    <!-- Inter-section Ad Banner -->
    <AdBanner />

    <!-- Featured Products -->
    <section class="container mx-auto px-4 pt-4">
      <div class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('home.featured_title') }}</h2>
        <p class="text-sm md:text-base text-gray-600 dark:text-gray-400">{{ $t('home.featured_subtitle') }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingFeatured" key="featured-skeleton" class="flex overflow-x-auto pb-6 gap-4 no-scrollbar -mx-4 px-4">
        <div
          v-for="n in 3"
          :key="'f-skeleton-' + n"
          class="flex-shrink-0 w-[calc(50%-8px)] min-w-[calc(50%-8px)] md:min-w-[280px] md:w-[280px] lg:min-w-[calc(25%-12px)] lg:w-[calc(25%-12px)] rounded-2xl shadow-xl overflow-hidden bg-white border border-[#EDEDED] animate-pulse"
        >
          <div class="p-2">
            <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div class="w-3/4 mx-auto aspect-square rounded-xl bg-gray-300 mb-2"></div>
            <div class="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- Featured Products Horizontal Slide -->
      <div v-else key="featured-content" class="space-y-4">
        <!-- Row 1 Wrapper -->
        <div class="relative group px-2">
          <!-- Left Button -->
          <button 
            @click="scrollFeatured('left')"
            class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 md:-left-4"
            aria-label="Previous"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <!-- Right Button -->
          <button 
            @click="scrollFeatured('right')"
            class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 md:-right-4"
            aria-label="Next"
          >
            <i class="fas fa-chevron-right"></i>
          </button>

          <div 
            ref="featuredProductsContainer"
            class="flex overflow-x-auto pb-6 gap-4 no-scrollbar scroll-smooth -mx-4 px-4"
          >
            <div 
              v-for="product in featuredProductsRow1"
              :key="product.id"
              class="flex-shrink-0 w-[calc(50%-8px)] min-w-[calc(50%-8px)] md:min-w-[220px] md:w-[220px] lg:min-w-[calc(20%-13px)] lg:w-[calc(20%-13px)] xl:min-w-[calc(16.66%-14px)] xl:w-[calc(16.66%-14px)]"
            >
              <ProductCard :product="product" />
            </div>
          </div>
        </div>

        <!-- Second Row Slider -->
        <div v-if="featuredProductsRow2.length > 0" class="mt-4 relative group">
           <!-- Left Button -->
          <button 
            @click="scrollFeaturedRow2('left')"
            class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 md:-left-4"
            aria-label="Previous"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <!-- Right Button -->
          <button 
            @click="scrollFeaturedRow2('right')"
            class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 md:-right-4"
            aria-label="Next"
          >
            <i class="fas fa-chevron-right"></i>
          </button>

          <div 
            ref="featuredProductsContainer2"
            class="flex overflow-x-auto pb-6 gap-4 no-scrollbar scroll-smooth -mx-4 px-4"
          >
            <div 
              v-for="product in featuredProductsRow2"
              :key="product.id"
              class="flex-shrink-0 w-[calc(50%-8px)] min-w-[calc(50%-8px)] md:min-w-[220px] md:w-[220px] lg:min-w-[calc(20%-13px)] lg:w-[calc(20%-13px)] xl:min-w-[calc(16.66%-14px)] xl:w-[calc(16.66%-14px)]"
            >
              <ProductCard :product="product" />
            </div>
          </div>
        </div>
      </div>

      <!-- View All Products Button -->
      <div class="text-center mt-8 mb-8">
        <router-link to="/products" class="btn-primary text-base px-6 py-2">
          {{ $t('home.view_all') }}
          <i class="fas fa-arrow-right ml-2 text-xs"></i>
        </router-link>
      </div>
    </section>

    <!-- Weather & Practical Picks Section -->
    <DiscoverySlider 
      :section-title="$t('home.weather_picks')" 
      :section-subtitle="$t('home.weather_subtitle')"
      :cards="weatherPicksCards" 
      :is-loading="personalizationStore.isLoading"
    />

    <!-- Contextual Category Shopping -->
    <DiscoverySlider 
      v-if="keepShoppingCards.length > 0"
      :section-title="$t('home.inspired_by_title')" 
      :cards="keepShoppingCards as any" 
      :is-loading="productsStore.isLoading"
    />

    <!-- Personalized Recommendations -->
    <PersonalizedSlider :is-loading="productsStore.isLoading" />

    <!-- Deals & Discovery Section -->
    <DiscoverySlider 
      v-if="dealsToDiscoverCards.length > 0"
      :section-title="$t('home.offers_discovery')" 
      :section-subtitle="$t('home.selected_for_you')"
      :cards="dealsToDiscoverCards as any"
      layout="grid"
      :is-loading="personalizationStore.isLoading"
    />


    <section class="container mx-auto px-4 py-4">
      <div class="text-center mb-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('home.vendors_title') }}</h2>
        <p class="text-sm md:text-base text-gray-600 dark:text-gray-400">{{ $t('home.vendors_subtitle') }}</p>
      </div>

      <div v-if="productsStore.isLoading" key="vendors-skeleton" class="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-4 px-4">
        <div v-for="n in 6" :key="'v-skeleton-' + n" class="flex-shrink-0 w-[80px] h-[50px] md:w-[120px] md:h-[70px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
      <div v-else key="vendors-content" class="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-4 px-4">
        <router-link
          v-for="vendor in activeVendors"
          :key="vendor.id"
          :to="`/store/${vendor.slug || vendor.id}`"
          class="flex-shrink-0 w-[80px] h-[50px] md:w-[120px] md:h-[70px] group relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
        >
          <div class="w-full h-full flex items-center justify-center group-hover:scale-110 opacity-100 transition-all duration-300">
            <img
              v-if="vendor.logoUrl"
              :src="vendor.logoUrl"
              :alt="vendor.name"
              class="max-w-full max-h-full object-contain"
            />
            <div v-else class="text-sm md:text-base font-bold text-gray-400 dark:text-gray-500 group-hover:text-blue-600 text-center line-clamp-2 px-1">{{ vendor.name }}</div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 40 Produits Supplémentaires -->
    <section class="container mx-auto px-4 py-4">
      <div class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('home.new_products_title') }}</h2>
        <p class="text-sm md:text-base text-gray-600 dark:text-gray-400">{{ $t('home.new_products_subtitle') }}</p>
      </div>

      <div v-if="productsStore.isLoading" key="new-products-skeleton" class="product-grid">
        <div v-for="n in 8" :key="'np-skeleton-' + n" class="bg-gray-100 dark:bg-gray-850 rounded-2xl aspect-[4/5] animate-pulse"></div>
      </div>
      <div v-else key="new-products-content" class="product-grid">
        <ProductCard
          v-for="product in newProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <!-- Final Discovery Section -->
    <DiscoverySlider 
      :section-title="$t('home.tech_news')" 
      :section-subtitle="$t('home.tech_subtitle')"
      :cards="itemsYouMayLikeCards as any" 
      :is-loading="productsStore.isLoading || personalizationStore.isLoading"
    />



  </div>

  <!-- Bouton retour en haut flottant -->
  <button
    @click="scrollToTop"
    class="hidden md:block fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
    :class="{ 'opacity-0 invisible': !showScrollTop, 'opacity-100 visible': showScrollTop }"
  >
    <i class="fas fa-arrow-up text-lg"></i>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { usePromotionsStore } from '@/stores/promotions'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import ProductCard from '@/components/products/ProductCard.vue'
import { useUiStore } from '@/stores/ui'
import { useHistoryStore } from '@/stores/history'
import { useWishlistStore } from '@/stores/wishlist'
import DiscoverySlider from '@/components/home/DiscoverySlider.vue'
import PersonalizedSlider from '@/components/home/PersonalizedSlider.vue'
import AdBanner from '@/components/home/AdBanner.vue'
import FlashSalesSection from '@/components/home/FlashSalesSection.vue'
import { usePersonalizationStore } from '@/stores/personalization'
import { useGeolocation } from '@/composables/useGeolocation'

const { t } = useI18n()
const router = useRouter()
const productsStore = useProductsStore()
const promotionsStore = usePromotionsStore()
const cartStore = useCartStore()

const uiStore = useUiStore()
const personalizationStore = usePersonalizationStore()
const wishlistStore = useWishlistStore()
const historyStore = useHistoryStore()
const { getPosition, saveCoords } = useGeolocation()

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  uiStore.showToast(message, type)
}

const addToCart = async (product: any) => {
  try {
    await cartStore.addToCart(product.id, 1)
    uiStore.triggerCartAnimation()
  } catch (error) {
    console.error('Error adding to cart:', error)
    showNotification("Erreur lors de l'ajout au panier", 'error')
  }
}

// State

const currentBannerIndex = ref(0)
const isScrolled = ref(false)
const showScrollTop = ref(false)
let bannerInterval: ReturnType<typeof setInterval> | null = null
let mobileBannerInterval: ReturnType<typeof setInterval> | null = null

const featuredProductsContainer = ref<HTMLElement | null>(null)
const featuredProductsContainer2 = ref<HTMLElement | null>(null)

const scrollFeatured = (direction: 'left' | 'right') => {
  if (featuredProductsContainer.value) {
    const container = featuredProductsContainer.value
    const scrollAmount = container.clientWidth * 0.75 // Scroll 75% of view width
    const targetScroll = direction === 'left' ? -scrollAmount : scrollAmount
    container.scrollBy({ left: targetScroll, behavior: 'smooth' })
  }
}

const scrollFeaturedRow2 = (direction: 'left' | 'right') => {
  if (featuredProductsContainer2.value) {
    const container = featuredProductsContainer2.value
    const scrollAmount = container.clientWidth * 0.75 // Scroll 75% of view width
    const targetScroll = direction === 'left' ? -scrollAmount : scrollAmount
    container.scrollBy({ left: targetScroll, behavior: 'smooth' })
  }
}

const goToProduct = (id: number) => {
  router.push(`/products/${id}`)
}

// --- Browsing History ---
const browsingHistoryCards = computed(() => {
  if (historyStore.browsingHistory.length === 0) return []
  
  // We want to show a 3-column grid within one card
  const items = historyStore.browsingHistory.slice(0, 6).map(p => ({
    name: p.name,
    image: p.image || p.image_url || 'https://placehold.co/400x400?text=Product',
    link: `/products/${p.id}`,
    subtext: `${p.viewCount} ${p.viewCount > 1 ? t('home.views', { count: p.viewCount }) : t('home.views', { count: p.viewCount })}`
  }))

  return [
    {
      id: 'browsing-history',
      type: 'grid',
      title: t('home.fav_shopping'),
      cols: 3,
      items: items,
      seeMoreLink: '/account/history',
      seeMoreText: t('home.history_subtitle')
    }
  ] as any[]
})

const lastViewedCategoryName = computed(() => {
  const last = historyStore.browsingHistory[0]
  return last?.category?.name || last?.category_name || 'Toutes catégories'
})

const keepShoppingCards = computed(() => {
  if (historyStore.browsingHistory.length === 0) return []
  
  const lastItem = historyStore.browsingHistory[0]
  const categoryId = lastItem.category_id
  
  // Find products in the same category from productsStore
  const relatedInStore = productsStore.products
    .filter(p => p.category_id === categoryId && p.id !== lastItem.id)
    .slice(0, 4)
  
  if (relatedInStore.length < 2) return []

  return [
    {
      id: 'keep-shopping-cat',
      type: 'grid',
      title: t('home.inspired_by', { category: lastViewedCategoryName.value }),
      items: relatedInStore.map(p => ({
        name: p.name,
        image: p.image || p.image_url || 'https://placehold.co/400x400?text=Product',
        link: `/products/${p.id}`
      })),
      seeMoreLink: `/products?category=${categoryId}`
    }
  ] as any[]
})

// --- Discovery Data ---

// --- Discovery Data ---
// Top Discovery (Mix of grid and banners) with fallback to guarantee 4 cards on PC
const mainDiscoveryCards = computed(() => {
  const storeCards = personalizationStore.topDiscoveryCards || []
  if (storeCards.length >= 4) return storeCards

  const fallbackCards: any[] = [
    {
      id: 'top-tech-categories',
      type: 'grid',
      title: 'Smartphones & High-Tech',
      cols: 2,
      items: [
        { name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300', link: '/products?search=phone' },
        { name: 'Écouteurs', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', link: '/products?search=audio' },
        { name: 'Smartwatches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', link: '/products?search=watch' },
        { name: 'Accessoires', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300', link: '/products?search=accessories' }
      ],
      link: '/products',
      linkText: 'Découvrir la catégorie'
    },
    {
      id: 'promo-flash-deals',
      type: 'promo',
      title: '⚡ Offres Spéciales du Jour',
      subtitle: 'Réductions exclusives sur la sélection Tech',
      promoText: 'Jusqu\'à -45% de Réduction',
      promoStyle: 'color',
      backgroundColor: '#dc2626',
      promoTextColor: '#ffffff',
      link: '/promotions',
      linkText: 'Voir les Ventes Flash'
    },
    {
      id: 'top-vendors-card',
      type: 'grid',
      title: 'Boutiques & Marques Officielles',
      cols: 2,
      items: (productsStore.activeVendors || []).slice(0, 4).map((v: any) => ({
        name: v.name,
        image: v.logoUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300',
        link: `/store/${v.slug || v.id}`
      })),
      link: '/products',
      linkText: 'Explorer les boutiques'
    },
    {
      id: 'become-seller-banner',
      type: 'promo',
      title: '🚀 Vendez vos Produits',
      subtitle: 'Rejoignez la marketplace n°1 en Haïti',
      promoText: 'Devenir Vendeur Gratuitement',
      promoStyle: 'color',
      backgroundColor: '#2563eb',
      promoTextColor: '#ffffff',
      link: '/become-seller',
      linkText: 'Créer votre boutique'
    }
  ]

  if (storeCards.length === 0) return fallbackCards

  const combined = [...storeCards]
  for (const fb of fallbackCards) {
    if (combined.length >= 4) break
    if (!combined.some(c => c.id === fb.id)) {
      combined.push(fb)
    }
  }
  return combined
})

// Weather Picks
const weatherPicksCards = computed(() => personalizationStore.weatherPicksCards)

// Deals to Discover
const dealsToDiscoverCards = computed(() => personalizationStore.dealsToDiscoverCards)


// Items you may like
// Items you may like (Dynamic Recommendation)
const itemsYouMayLikeCards = computed(() => {
  const cards: any[] = []
  
  // Helper to create a grid card
  const createGridCard = (id: string, title: string, products: any[], link: string) => ({
    id,
    type: 'grid',
    title,
    items: products.map(p => ({
      name: p.name,
      image: p.image || p.image_url || 'https://placehold.co/400x400?text=Product',
      link: `/products/${p.id}`
    })),
    seeMoreLink: link,
    seeMoreText: t('footer.shop')
  })

  // 1. Analyze Browsing History & Wishlist for multiple categories
  const viewedIds = new Set(historyStore.browsingHistory.map(p => p.id))
  const wishlistIds = new Set(wishlistStore.items.map(p => p.id))
  let potentialCategories: number[] = []

  const categoryCounts: Record<number, number> = {}
  
  // Add weight from history
  historyStore.browsingHistory.forEach(p => {
    if (p.category_id) {
      categoryCounts[p.category_id] = (categoryCounts[p.category_id] || 0) + 1
    }
  })

  // Add extra weight from wishlist
  wishlistStore.items.forEach(p => {
    if (p.category_id) {
      // Wishlist items have higher weight (3 searches)
      categoryCounts[p.category_id] = (categoryCounts[p.category_id] || 0) + 3
    }
  })

  if (Object.keys(categoryCounts).length > 0) {
    potentialCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => parseInt(id))
  }

  // 2. Generate cards for top 3 categories
  potentialCategories.slice(0, 3).forEach((catId, index) => {
    const recommendations = productsStore.products
      .filter(p => p.category_id === catId && !viewedIds.has(p.id) && !wishlistIds.has(p.id))
      .slice(0, 4)
    
    if (recommendations.length >= 2) { // Allow smaller clusters if derived from specific interests
      let title = index === 0 ? t('home.highly_recommended') : t('home.inspired_taste')
      
      // If cat came from wishlist primarily
      const isInWishlistCat = wishlistStore.items.some(i => i.category_id === catId)
      if (isInWishlistCat) title = t('home.favorite_styles')

      cards.push(createGridCard(
        `rec-hist-${catId}`, 
        title, 
        recommendations, 
        `/products?category=${catId}`
      ))
    }
  })

  // 3. Fallback: If we don't have enough cards, fill with random categories
  if (cards.length < 3) {
    const usedCats = new Set(potentialCategories)
    // Find other categories with enough data
    const otherCats = productsStore.categories
      .filter(c => !usedCats.has(c.id))
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 3 - cards.length)

    otherCats.forEach(cat => {
      const catProducts = productsStore.products
        .filter(p => p.category_id === cat.id)
        .slice(0, 4)
      
      if (catProducts.length >= 4) {
        cards.push(createGridCard(
          `rec-cat-${cat.id}`, 
          t('home.discover_category', { category: cat.name }), 
          catProducts, 
          `/products?category=${cat.id}`
        ))
      }
    })
  }
  
  // 4. Always add "Popular" if not present
  if (cards.length < 4) {
    const bestRated = [...productsStore.products]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .filter(p => !viewedIds.has(p.id))
      .slice(0, 4)
      
    if (bestRated.length >= 4) {
       cards.push(createGridCard(
        'rec-popular',
        t('home.popular'),
        bestRated,
        '/products?sort=rating'
      ))
    }
  }

  // 5. Add a tech banner (or random banner)
  cards.push({
    id: 'rec-banner-lifestyle',
    type: 'banner',
    title: t('home.tech_news'),
    subtitle: t('home.tech_subtitle'),
    image: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    link: '/products'
  })
  
  return cards
})


// 40 produits supplémentaires removed


// Computed
const banners = computed(() => {
  const list = [...promotionsStore.activeBanners]
  // Force al least 3 items for correct loop visualization logic
  while (list.length > 0 && list.length < 3) {
    list.push(...promotionsStore.activeBanners)
  }
  return list.slice(0, 6) // Limit loop size
})

const featuredProducts = computed(() => productsStore.featuredProducts)
const featuredProductsRow1 = computed(() => productsStore.featuredProducts.slice(0, Math.ceil(productsStore.featuredProducts.length / 2)))
const featuredProductsRow2 = computed(() => productsStore.featuredProducts.slice(Math.ceil(productsStore.featuredProducts.length / 2)))
const newProducts = computed(() => productsStore.newProducts)
const brands = computed(() => productsStore.brands)
const activeVendors = computed(() => productsStore.activeVendors)
const promotions = computed(() => promotionsStore.activePromotions)
const isLoadingFeatured = computed(() => productsStore.isLoading)

// Carousel Methods
const previousBanner = () => {
  if (banners.value.length > 0) {
    currentBannerIndex.value =
      currentBannerIndex.value === 0 ? banners.value.length - 1 : currentBannerIndex.value - 1
  }
}

const nextBanner = () => {
  if (banners.value.length > 0) {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length
  }
}

const goToBanner = (index: number) => {
  if (index >= 0 && index < banners.value.length) {
    currentBannerIndex.value = index
  }
}

// Scroll detection for navbar transparency and scroll-to-top button
const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const formatPrice = (priceVal: number) => {
  const currentLocale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
  return new Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(priceVal)
}



// Auto-rotate banners
const rotateBanners = () => {
  if (banners.value.length > 1) {
    bannerInterval = setInterval(() => {
      currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length
    }, 5000)
  }
}

const startMobileBannerAutoSlide = () => {
  // If we have a separate mobile carousel logic (currently unified, but keep for compatibility)
  if (banners.value.length > 1) {
    mobileBannerInterval = setInterval(() => {
        // currentBannerIndex is shared for now
    }, 5000)
  }
}

// Load data
onMounted(async () => {
  try {
    console.log('🏠 Loading home page data...')

    // Initialize Geolocation
    const lastCoords = localStorage.getItem('user_coords');
    if (!lastCoords) {
      // First time: try to get position
      try {
        const coords = await getPosition();
        if (coords) {
          saveCoords(coords.latitude, coords.longitude);
          productsStore.setCoordinates(coords.latitude, coords.longitude);
        }
      } catch (err) {
        console.log('Location access declined or error:', err);
      }
    } else {
      // Already has coords
      try {
        const coords = JSON.parse(lastCoords);
        productsStore.setCoordinates(coords.latitude, coords.longitude);
      } catch (e) {
        console.error("Error loading saved coords", e);
      }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)

    // Initial scroll check
    handleScroll()

    // Smooth scroll for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.hash) {
        e.preventDefault()
        const element = document.querySelector(target.hash)
        if (element) {
          const offset = 160 // Navbar height
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      }
    }

    // Add click listeners to anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick)
    })

    // Load all data in parallel
    await Promise.all([
      promotionsStore.loadAllPromotionsData(),
      productsStore.loadFeaturedProducts(),
      productsStore.loadNewProducts(),
      productsStore.loadBrands(),
      productsStore.loadActiveVendors(),
      personalizationStore.loadTopDiscovery(),
      personalizationStore.loadWeatherPicks(),
      personalizationStore.loadDealsToDiscover(),
      personalizationStore.loadAds()
    ])

    console.log('📊 Home data loaded:')
    console.log('🎯 Banners:', promotionsStore.activeBanners.length)
    console.log('🎁 Promotions:', promotionsStore.activePromotions.length)
    console.log('⭐ Featured Products:', productsStore.featuredProducts.length)
    console.log('🏷️ Brands:', productsStore.brands.length)

    // Afficher si on utilise les fallbacks
    if (promotionsStore.isUsingFallback || productsStore.isUsingFallback) {
      console.log('⚠️ Using fallback data - API may be unavailable')
    }

    // Start banner rotation
    rotateBanners()
    startMobileBannerAutoSlide()
  } catch (error) {
    console.error('❌ Error loading home data:', error)
  }
})

// Cleanup scroll listener and interval
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (bannerInterval) clearInterval(bannerInterval)
  if (mobileBannerInterval) clearInterval(mobileBannerInterval)
})

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  // Use a reliable fallback service
  img.src = 'https://placehold.co/1200x500/e2e8f0/1e293b?text=HTFasil'
}
</script>

<style scoped>
/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Responsive Product Grid (Same as ProductsView) */
.product-grid {
  display: grid;
  gap: 1rem;
  
  /* Mobile: 2 colonnes */
  grid-template-columns: repeat(2, 1fr);
}

/* Tablet: 3 colonnes */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop: 4 colonnes */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }
}

/* PC Large: 5 colonnes */
@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 1.25rem;
  }
}

/* PC Extra Large: 6 colonnes */
@media (min-width: 1536px) {
  .product-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 1.25rem;
  }
}
</style>
