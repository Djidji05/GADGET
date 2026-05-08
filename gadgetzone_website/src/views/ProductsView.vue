<template>
  <div class="container mx-auto px-4 lg:pt-4 pt-2 pb-32">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar Filter (PC only) -->
      <aside class="hidden lg:block w-72 flex-shrink-0">
        <ProductSidebarFilter />
      </aside>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Products Grid -->
        <!-- Products Grid Loading State (Skeleton) -->
        <div v-if="isLoading" class="product-grid">
          <ProductSkeleton v-for="i in 8" :key="i" />
        </div>

        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500 mb-4">{{ error }}</div>
          <button @click="loadProducts" class="btn-primary">{{ $t('products.retry') }}</button>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
          <div class="mb-4">
            <i class="fas fa-search text-4xl text-gray-300"></i>
          </div>
          <p class="text-gray-600 mb-2">{{ $t('products.no_products_search') }}</p>
          <p class="text-sm text-gray-500 mb-4">
            {{ searchQuery ? $t('products.search_label', { query: searchQuery }) : $t('products.try_filters') }}
          </p>
          <button @click="resetFilters" class="btn-primary">{{ $t('products.reset_filters') }}</button>
        </div>

        <div v-else class="product-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>

    <!-- Bouton retour en haut flottant -->
    <button
      @click="scrollToTop"
      class="hidden md:block fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
      :class="{ 'opacity-0 invisible': !showScrollTop, 'opacity-100 visible': showScrollTop }"
    >
      <i class="fas fa-arrow-up text-lg"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useHistoryStore } from '@/stores/history'
import type { Product } from '@/services/products'
import ProductCard from '@/components/products/ProductCard.vue'
import ProductSkeleton from '@/components/products/ProductSkeleton.vue'
import ProductSidebarFilter from '@/components/products/ProductSidebarFilter.vue'
import { useGeolocation } from '@/composables/useGeolocation'

const route = useRoute()
const historyStore = useHistoryStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const { getPosition, saveCoords } = useGeolocation()

// State
const currentPage = computed(() => productsStore.currentPage)

// Computed
const isLoading = computed(() => productsStore.isLoading)
const error = computed(() => productsStore.error)
const categories = computed(() => productsStore.categories)
const brands = computed(() => productsStore.brands)

// Filters
const searchQuery = computed({
  get: () => productsStore.searchQuery,
  set: (value) => {
    productsStore.searchQuery = value
    productsStore.setPage(1) // Reset page when search changes
  },
})

const selectedCategory = computed({
  get: () => productsStore.selectedCategory,
  set: (value) => {
    productsStore.selectedCategory = value
    productsStore.setPage(1) // Reset page when category changes
  },
})

const selectedBrand = computed({
  get: () => productsStore.selectedBrand,
  set: (value) => {
    productsStore.selectedBrand = value
    productsStore.setPage(1) // Reset page when brand changes
  },
})

const sortBy = computed({
  get: () => productsStore.sortBy,
  set: (value) => {
    productsStore.sortBy = value
    productsStore.setPage(1) // Reset page when sort changes
  },
})

// Filtered and paginated products
const filteredProducts = computed(() => {
  return productsStore.filteredProducts
})

const products = computed(() => {
  return filteredProducts.value
})

const totalPages = computed(() => {
  return productsStore.totalPages
})

// Methods
const changePage = (page: number) => {
  productsStore.setPage(page)
  loadProducts()
  scrollToTop()
}

// Methods
const loadProducts = async () => {
  try {
    await productsStore.loadProducts()
  } catch {
    console.warn('Backend failed, checking for fallback products')
    // Si le backend échoue, utiliser les produits fallback directement
    if (productsStore.products.length === 0) {
      // Charger les produits fallback manuellement
      const { fallbackFeaturedProducts } = await import('@/services/fallback')
      productsStore.products = fallbackFeaturedProducts
    }
  }
}

const loadCategories = async () => {
  try {
    await productsStore.loadCategories()
  } catch {
    console.warn('Categories backend failed, using fallback')
  }
}

const loadBrands = async () => {
  try {
    await productsStore.loadBrands()
  } catch {
    console.warn('Brands backend failed')
  }
}

const handleSearch = () => {
  // Search is handled by computed setter
}

const handleFilter = () => {
  // Filter is handled by computed setters
}

const resetFilters = () => {
  productsStore.searchQuery = ''
  productsStore.selectedCategory = null
  productsStore.selectedBrand = null
  productsStore.selectedVendor = null
  productsStore.sortBy = 'name'
  productsStore.setPage(1)
}

const handleQueryChange = (query: any) => {
  if (query.category) {
    // Normaliser le nom de la catégorie recherchée
    const categoryName = query.category.toLowerCase().trim()
    
    // Mapping manuel pour les cas courants
    const categoryAliases: Record<string, string[]> = {
      'smartphone': ['smartphone', 'téléphone', 'phone', 'mobile'],
      'laptop': ['laptop', 'ordinateur', 'pc', 'computer'],
      'audio': ['audio', 'casque', 'écouteur', 'headphone', 'speaker', 'enceinte'],
      'gaming': ['gaming', 'jeu', 'console', 'game'],
      'photo': ['photo', 'appareil photo', 'camera', 'caméra'],
      'accessories': ['accessoire', 'accessory', 'gadget'],
      'high-tech': ['high-tech', 'hitech', 'technologie', 'info', 'informatique'],
      'maison': ['maison', 'brico', 'habitat', 'cuisine', 'meuble'],
      'mode': ['mode', 'beauté', 'vêtement', 'chaussure'],
      'culture': ['culture', 'livre', 'manga', 'musique'],
      'jeux-jouets': ['jeux', 'jouet', 'gaming', 'lego', 'société'],
      'autres': ['autres', 'supermarché', 'divers']
    }
    
    // Chercher d'abord dans les alias
    let foundCategory = null
    for (const [key, aliases] of Object.entries(categoryAliases)) {
      if (aliases.some(alias => categoryName.includes(alias) || alias.includes(categoryName))) {
        // Chercher la catégorie correspondante dans la liste
        // Prioriser les correspondances exactes ou courtes (catégories principales)
        const matchingCategories = categories.value.filter(cat => 
          aliases.some(alias => cat.name.toLowerCase().includes(alias))
        )
        
        if (matchingCategories.length > 0) {
          // Trier par longueur de nom (les catégories principales ont généralement des noms plus courts)
          matchingCategories.sort((a, b) => a.name.length - b.name.length)
          
          // Prioriser les catégories qui correspondent exactement à un alias
          const exactMatch = matchingCategories.find(cat =>
            aliases.some(alias => cat.name.toLowerCase() === alias || cat.name.toLowerCase() === alias + 's')
          )
          
          foundCategory = exactMatch || matchingCategories[0]
          break
        }
      }
    }
    
    // Si pas trouvé via alias, chercher directement
    if (!foundCategory) {
      const matchingCategories = categories.value.filter(
        cat => cat.name.toLowerCase().includes(categoryName) ||
               categoryName.includes(cat.name.toLowerCase())
      )
      
      if (matchingCategories.length > 0) {
        // Trier par longueur de nom
        matchingCategories.sort((a, b) => a.name.length - b.name.length)
        foundCategory = matchingCategories[0]
      }
    }
    
    if (foundCategory) {
      productsStore.selectedCategory = foundCategory.id
      console.log(`✅ Category matched: "${query.category}" → "${foundCategory.name}" (ID: ${foundCategory.id})`)
    } else if (categories.value.length > 0) {
      console.warn(`⚠️ Category not found: ${query.category}`)
      productsStore.selectedCategory = null
    }
  } else {
    productsStore.selectedCategory = null
  }

  if (query.brand) {
    productsStore.selectedBrand = parseInt(query.brand as string)
  } else {
    productsStore.selectedBrand = null
  }

  if (query.search) {
    productsStore.searchQuery = query.search
  } else {
    productsStore.searchQuery = ''
  }

  if (query.promotions === 'true') {
    productsStore.isPromotions = true
  } else {
    productsStore.isPromotions = false
  }

  if (query.ids) {
    const ids = (query.ids as string).split(',').map(Number)
    productsStore.productIds = ids
  } else {
    productsStore.productIds = null
  }

  if (query.vendor) {
    productsStore.selectedVendor = parseInt(query.vendor as string)
  } else {
    productsStore.selectedVendor = null
  }
  
  // Recharger les produits avec les nouveaux filtres
  loadProducts()
}

// Watch for route changes to reload data
watch(
  [() => route.query], // Removed categories dependency to avoid loop if categories load late
  ([newQuery]) => {
    handleQueryChange(newQuery)
  },
  { immediate: true },
)

// Lifecycle
// Watch for loading state to restore scroll
watch(isLoading, (loading) => {
  if (!loading && historyStore.productsScrollPosition > 0) {
    nextTick(() => {
      // Delay slightly to ensure layout is fully rendered
      setTimeout(() => {
        window.scrollTo({
          top: historyStore.productsScrollPosition,
          behavior: 'instant'
        })
        // Reset after restoration
        historyStore.productsScrollPosition = 0
      }, 100)
    })
  }
})

// Save scroll position before leaving
onBeforeRouteLeave((to, from) => {
  if (to.name === 'product-detail') {
    historyStore.productsScrollPosition = window.scrollY
  } else {
    historyStore.productsScrollPosition = 0
  }
})

onMounted(async () => {
  // Initialize Geolocation first
  const lastCoords = localStorage.getItem('user_coords');
  if (!lastCoords) {
    try {
      const coords = await getPosition();
      saveCoords(coords.latitude, coords.longitude);
      productsStore.setCoordinates(coords.latitude, coords.longitude);
    } catch (err) {
      console.log('Location access declined or error:', err);
    }
  } else {
    try {
      const coords = JSON.parse(lastCoords);
      productsStore.setCoordinates(coords.latitude, coords.longitude);
    } catch (e) {
      console.error("Error loading saved coords", e);
    }
  }

  // loadProducts est déjà appelé par le watcher immédiat
  await Promise.all([loadCategories(), loadBrands()])
  
  // Re-déclencher le matching maintenant que les catégories sont chargées
  if (route.query.category) {
    handleQueryChange(route.query)
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Scroll to top logic
const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
  top: 0,
    behavior: 'smooth',
  })
}
</script>

<style scoped>
/* Responsive Product Grid */
.product-grid {
  display: grid;
  gap: 0.75rem;
  
  /* Mobile: 2 colonnes */
  grid-template-columns: repeat(2, 1fr);
}

/* Tablet: 3 colonnes */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

/* Desktop: 4 colonnes */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
}
</style>
