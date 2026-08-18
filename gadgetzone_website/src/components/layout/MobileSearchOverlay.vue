<template>
  <Transition name="slide-up">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-white dark:bg-gray-950 z-[9999] flex flex-col font-sans md:hidden dark:text-white"
    >
      <!-- Search Header -->
      <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-white dark:bg-gray-900">
        <!-- Back Button -->
        <button 
          @click="closeOverlay" 
          class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-90 transition-all text-gray-700 dark:text-gray-300"
        >
          <i class="fas fa-arrow-left text-lg"></i>
        </button>

        <!-- Search Input Wrapper -->
        <div class="flex-1 relative flex items-center">
          <input
            ref="searchInput"
            v-model="query"
            @keyup.enter="triggerSearch(query)"
            type="search"
            placeholder="Rechercher des produits, marques..."
            class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-full pl-5 pr-20 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <div class="absolute right-3 flex items-center gap-1.5">
            <!-- Clear Button -->
            <button 
              v-if="query" 
              @click="clearQuery"
              class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            >
              <i class="fas fa-times-circle"></i>
            </button>
            <!-- Camera Button -->
            <button 
              @click="triggerImageSearch"
              class="text-gray-400 dark:text-gray-500 hover:text-blue-500 p-1"
              title="Recherche par image"
            >
               <i :class="isImageSearching ? 'fas fa-spinner fa-spin' : 'fas fa-camera'"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Image Search Input (Hidden) -->
      <input
        type="file"
        ref="imageInput"
        accept="image/*"
        class="hidden"
        @change="handleImageSearch"
      />

      <!-- Scrollable Suggestion Body -->
      <div class="flex-1 overflow-y-auto px-4 py-6 space-y-8 no-scrollbar bg-gray-50/50 dark:bg-gray-950">
        <!-- MODE 1: EMPTY QUERY (Show Recent, Popular & Categories) -->
        <template v-if="!query.trim()">
          <!-- Recent Searches -->
          <section v-if="recentSearches.length > 0" class="space-y-3">
            <div class="flex justify-between items-center">
              <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Recherches récentes</h3>
              <button 
                @click="clearAllRecent"
                class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Tout effacer
              </button>
            </div>
            <div class="space-y-1">
              <div 
                v-for="(search, idx) in recentSearches" 
                :key="idx"
                class="flex items-center justify-between py-2 border-b border-gray-100/50 dark:border-gray-800/50 active:bg-gray-100/50 dark:active:bg-gray-800/50 rounded-lg transition-colors px-1"
              >
                <button 
                  @click="triggerSearch(search)"
                  class="flex-1 text-left flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium"
                >
                  <i class="fas fa-history text-gray-400 text-xs"></i>
                  <span>{{ search }}</span>
                </button>
                <button 
                  @click="deleteRecent(search)"
                  class="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1.5 transition-colors"
                >
                  <i class="fas fa-times text-xs"></i>
                </button>
              </div>
            </div>
          </section>

          <!-- Popular Searches -->
          <section class="space-y-3">
            <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Recherches populaires</h3>
            <div class="flex flex-wrap gap-2.5">
              <button 
                v-for="keyword in popularKeywords" 
                :key="keyword"
                @click="triggerSearch(keyword)"
                class="px-3.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-500 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 active:scale-95 transition-all shadow-sm"
              >
                {{ keyword }}
              </button>
            </div>
          </section>

          <!-- Featured Categories -->
          <section class="space-y-3">
            <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Explorer par catégorie</h3>
            <div class="grid grid-cols-2 gap-3">
              <button 
                v-for="cat in featuredCategories" 
                :key="cat.id"
                @click="triggerCategorySearch(cat)"
                class="flex items-center gap-3 p-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-left active:scale-95 transition-transform shadow-sm"
              >
                <div class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <i class="fas" :class="getCategoryIcon(cat.name)"></i>
                </div>
                <div class="min-w-0">
                  <h4 class="font-bold text-xs text-gray-800 dark:text-gray-200 truncate leading-tight">{{ cat.name }}</h4>
                  <span class="text-[9px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">Découvrir</span>
                </div>
              </button>
            </div>
          </section>
        </template>

        <!-- MODE 2: ACTIVE QUERY (Show Autocomplete Suggests & Live Product Results) -->
        <template v-else>
          <!-- Loading indicator -->
          <div v-if="isSearching" class="flex items-center gap-2 py-2 px-1">
            <div class="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-xs text-gray-400 dark:text-gray-500">Recherche en cours...</span>
          </div>

          <!-- Autocomplete Keywords -->
          <section v-if="suggestedKeywords.length > 0" class="space-y-1">
            <div 
              v-for="suggest in suggestedKeywords" 
              :key="suggest"
              @click="triggerSearch(suggest)"
              class="flex items-center gap-3 py-3 border-b border-gray-100/50 dark:border-gray-800/50 active:bg-gray-100/30 dark:active:bg-gray-800/30 rounded-lg px-2 transition-colors cursor-pointer"
            >
              <i class="fas fa-search text-gray-400 dark:text-gray-500 text-xs"></i>
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span class="font-normal">{{ query }}</span>{{ suggest.toLowerCase().includes(query.toLowerCase()) ? suggest.slice(suggest.toLowerCase().indexOf(query.toLowerCase()) + query.length) : '' }}
              </span>
            </div>
          </section>

          <!-- Matching Categories -->
          <section v-if="matchingCategories.length > 0" class="space-y-2">
            <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Catégories</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in matchingCategories"
                :key="cat.id"
                @click="triggerCategorySearch(cat)"
                class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:scale-95 transition-all"
              >
                <i class="fas" :class="getCategoryIcon(cat.name)" style="font-size:9px"></i>
                {{ cat.name }}
              </button>
            </div>
          </section>

          <!-- Quick Product Results (Amazon/Shein style) -->
          <section class="space-y-4">
            <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Produits suggérés</h3>
            <div v-if="suggestedProducts.length > 0" class="space-y-3">
              <div 
                v-for="product in suggestedProducts" 
                :key="product.id"
                @click="goToProduct(product)"
                class="bg-white dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex gap-3 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <img 
                  :src="product.image_url || product.image || '/placeholder.png'" 
                  class="w-14 h-14 object-cover rounded-xl bg-gray-50 dark:bg-gray-800 flex-shrink-0 border border-gray-100 dark:border-gray-800" 
                  alt="Product Image"
                />
                <div class="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                  <h4 class="font-bold text-xs text-gray-800 dark:text-gray-200 truncate leading-tight">{{ product.name }}</h4>
                  <div class="flex items-baseline gap-1.5">
                    <span class="text-xs font-black text-blue-600 dark:text-blue-400">{{ formatPrice(product.price) }}</span>
                    <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500">HTG</span>
                  </div>
                </div>
                <div class="flex items-center text-gray-300 dark:text-gray-600 pr-1">
                  <i class="fas fa-chevron-right text-xs"></i>
                </div>
              </div>
            </div>
            <div v-else-if="!isSearching" class="text-center py-8 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-850">
              <i class="fas fa-search text-gray-300 dark:text-gray-600 text-2xl mb-2"></i>
              <p class="text-xs text-gray-400 dark:text-gray-500 italic">Aucun résultat pour "{{ query }}"</p>
              <button @click="triggerSearch(query)" class="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Voir tous les résultats →
              </button>
            </div>
          </section>
        </template>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import api from '@/services/api'
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import { useProductsStore } from '@/stores/products'
import { productsService } from '@/services/products'
import type { Category, Product } from '@/services/products'

const router = useRouter()
const uiStore = useUiStore()
const productsStore = useProductsStore()

// Query state
const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

// Image Search in Overlay
const imageInput = ref<HTMLInputElement | null>(null)
const isImageSearching = ref(false)

const triggerImageSearch = () => {
  if (isImageSearching.value) return
  imageInput.value?.click()
}

const handleImageSearch = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    if (!file.type.startsWith('image/')) {
        uiStore.showToast("Veuillez sélectionner une image valide.", 'warning')
        return
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
        const base64Image = reader.result;
        
        try {
            isImageSearching.value = true
            console.log("Analysant l'image...")
            
            const response = await api.post('/products/search/image', { image: base64Image });
            
            if (response.data && response.data.ids && response.data.ids.length > 0) {
                console.log("Produits trouvés:", response.data.ids)
                closeOverlay();
                await router.push({
                    name: 'products',
                    query: { ids: response.data.ids.join(',') }
                });
            } else {
                uiStore.showToast("Aucun produit similaire trouvé.", 'info')
            }
        } catch (error: any) {
            console.error("Erreur recherche image:", error);
            const msg = error.response?.data?.error || "Erreur lors de la recherche par image.";
            uiStore.showToast(msg, 'error')
        } finally {
            isImageSearching.value = false;
            if (imageInput.value) imageInput.value.value = '';
        }
    };
    
    reader.onerror = () => {
        uiStore.showToast("Erreur lors de la lecture du fichier.", 'error')
        isImageSearching.value = false;
    }
  }
}

// Live search state
const liveProducts = ref<Product[]>([])
const isSearching = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Open state mapped from global UI store
const isOpen = computed(() => uiStore.isMobileSearchOpen)

// Focus management on open
watch(isOpen, (newVal) => {
  if (newVal) {
    query.value = ''
    liveProducts.value = []
    nextTick(() => {
      setTimeout(() => {
        searchInput.value?.focus()
      }, 300)
    })
  }
})

// Watch query → debounced live search
watch(query, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!val.trim()) {
    liveProducts.value = []
    isSearching.value = false
    return
  }
  isSearching.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const result = await productsService.searchProducts(val.trim())
      liveProducts.value = Array.isArray(result) ? result : (result.products || result.hits || [])
    } catch {
      liveProducts.value = []
    } finally {
      isSearching.value = false
    }
  }, 350)
})

// Local Storage Recent Searches
const recentSearches = ref<string[]>([])

const loadRecentSearches = () => {
  try {
    const saved = localStorage.getItem('recent_searches')
    recentSearches.value = saved ? JSON.parse(saved) : []
  } catch (e) {
    recentSearches.value = []
  }
}

const saveSearchToRecent = (searchTerm: string) => {
  if (!searchTerm.trim()) return
  const normalized = searchTerm.trim()
  let list = [normalized, ...recentSearches.value.filter(s => s.toLowerCase() !== normalized.toLowerCase())]
  list = list.slice(0, 10)
  recentSearches.value = list
  localStorage.setItem('recent_searches', JSON.stringify(list))
}

const deleteRecent = (searchTerm: string) => {
  recentSearches.value = recentSearches.value.filter(s => s !== searchTerm)
  localStorage.setItem('recent_searches', JSON.stringify(recentSearches.value))
}

const clearAllRecent = () => {
  recentSearches.value = []
  localStorage.removeItem('recent_searches')
}

loadRecentSearches()

const popularKeywords = ['Smartphone', 'Laptop', 'Casque', 'Gaming', 'Promotions', 'Enceinte', 'Xiaomi', 'iPhone']

const featuredCategories = computed(() => {
  const list = productsStore.categories || []
  return list.filter((c: Category) => !c.parentId || c.parentId === null).slice(0, 6)
})

// Categories matching the current query
const matchingCategories = computed(() => {
  if (!query.value.trim()) return []
  const val = query.value.trim().toLowerCase()
  return (productsStore.categories || [])
    .filter((c: Category) => c.name.toLowerCase().includes(val))
    .slice(0, 3)
})

const getCategoryIcon = (catName: string): string => {
  const name = catName.toLowerCase()
  if (name.includes('tech') || name.includes('informatique') || name.includes('laptop') || name.includes('smartphone')) return 'fa-laptop text-blue-500'
  if (name.includes('maison') || name.includes('cuisine') || name.includes('meuble')) return 'fa-home text-amber-500'
  if (name.includes('mode') || name.includes('beauté') || name.includes('vêtement')) return 'fa-tshirt text-pink-500'
  if (name.includes('jeu') || name.includes('gaming') || name.includes('console')) return 'fa-gamepad text-green-500'
  if (name.includes('culture') || name.includes('livre') || name.includes('musique')) return 'fa-book text-purple-500'
  return 'fa-shopping-basket text-emerald-500'
}

// Keyword suggestions from live results + categories + in-memory
const suggestedKeywords = computed(() => {
  if (!query.value.trim()) return []
  const val = query.value.trim().toLowerCase()
  const keywordsSet = new Set<string>()

  ;(productsStore.categories || []).forEach((c: Category) => {
    if (c.name.toLowerCase().includes(val)) keywordsSet.add(c.name)
  })

  liveProducts.value.forEach((p: Product) => {
    if (p.name.toLowerCase().includes(val)) {
      keywordsSet.add(p.name.split(' ').slice(0, 4).join(' '))
    }
  })

  ;(productsStore.products || []).forEach((p: Product) => {
    if (p.name.toLowerCase().includes(val)) {
      keywordsSet.add(p.name.split(' ').slice(0, 4).join(' '))
    }
  })

  return Array.from(keywordsSet).slice(0, 5)
})

// Live products first, fallback to in-memory store while API loads
const suggestedProducts = computed(() => {
  if (!query.value.trim()) return []
  if (liveProducts.value.length > 0) return liveProducts.value.slice(0, 5)
  const val = query.value.trim().toLowerCase()
  return (productsStore.products || [])
    .filter((p: Product) => p.name.toLowerCase().includes(val) || p.description?.toLowerCase().includes(val))
    .slice(0, 5)
})

const triggerSearch = (searchTerm: string) => {
  if (!searchTerm.trim()) return
  saveSearchToRecent(searchTerm)
  closeOverlay()
  router.push({ name: 'products', query: { search: searchTerm.trim() } })
}

const triggerCategorySearch = (cat: Category) => {
  closeOverlay()
  router.push({ name: 'products', query: { category: cat.name } })
}

const goToProduct = (product: Product) => {
  closeOverlay()
  router.push({ name: 'product-detail', params: { id: product.slug || product.id } })
}

const closeOverlay = () => {
  uiStore.isMobileSearchOpen = false
}

const clearQuery = () => {
  query.value = ''
  liveProducts.value = []
  nextTick(() => { searchInput.value?.focus() })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(price)
}
</script>



<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Slide up animation for full screen layout */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.94, 0.6, 1), opacity 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0.8;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0.8;
}
</style>
