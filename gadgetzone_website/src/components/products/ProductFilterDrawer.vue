<template>
<Transition name="slide-up">
    <div v-if="isOpen" class="fixed inset-0 z-[110] flex flex-col bg-white">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-900">{{ drawerTitle }}</h2>
        <button
          @click="close"
          class="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        
        <!-- Sort -->
        <section v-if="showSection('sort')">
          <h3 v-if="activeTab === 'all'" class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
            Trier par
          </h3>
          <div class="space-y-2">
            <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors" :class="{'ring-2 ring-blue-500 border-blue-500': localSortBy === 'price' && localSortOrder === 'asc'}">
              <span class="text-sm font-medium text-gray-700">Prix croissant</span>
              <input
                type="radio"
                name="sort"
                :value="{ by: 'price', order: 'asc' }"
                v-model="sortModel"
                class="sr-only"
              />
              <div class="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                <div v-if="localSortBy === 'price' && localSortOrder === 'asc'" class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              </div>
            </label>
            
            <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors" :class="{'ring-2 ring-blue-500 border-blue-500': localSortBy === 'price' && localSortOrder === 'desc'}">
              <span class="text-sm font-medium text-gray-700">Prix décroissant</span>
              <input
                type="radio"
                name="sort"
                :value="{ by: 'price', order: 'desc' }"
                v-model="sortModel"
                class="sr-only"
              />
              <div class="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                 <div v-if="localSortBy === 'price' && localSortOrder === 'desc'" class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              </div>
            </label>

            <label class="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors" :class="{'ring-2 ring-blue-500 border-blue-500': localSortBy === 'name' && localSortOrder === 'asc'}">
              <span class="text-sm font-medium text-gray-700">Nom (A-Z)</span>
               <input
                type="radio"
                name="sort"
                :value="{ by: 'name', order: 'asc' }"
                v-model="sortModel"
                class="sr-only"
              />
              <div class="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                 <div v-if="localSortBy === 'name' && localSortOrder === 'asc'" class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              </div>
            </label>
          </div>
        </section>

        <hr v-if="showSection('sort') && showSection('category')" class="border-gray-100" />

        <!-- Categories -->
        <section v-if="showSection('category')">
          <h3 v-if="activeTab === 'all'" class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
            Catégories
          </h3>
          <div class="space-y-1">
             <label 
              class="flex items-center py-2 cursor-pointer"
            >
              <input 
                type="radio" 
                :value="null" 
                v-model="localCategoryId"
                class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-3 text-sm text-gray-700">Toutes les catégories</span>
            </label>

            <label 
              v-for="category in categories" 
              :key="category.id"
              class="flex items-center py-2 cursor-pointer"
            >
              <input 
                type="radio" 
                :value="category.id" 
                v-model="localCategoryId"
                class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-3 text-sm text-gray-700">{{ category.name }}</span>
            </label>
          </div>
        </section>

        <hr v-if="showSection('category') && showSection('brand')" class="border-gray-100" />

        <!-- Brands -->
        <section v-if="showSection('brand') && brands.length > 0">
          <h3 v-if="activeTab === 'all'" class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
            Marques
          </h3>
          <div class="grid grid-cols-2 gap-2">
             <label 
              class="flex items-center p-2 rounded border border-gray-200 cursor-pointer hover:bg-gray-50"
              :class="{'bg-blue-50 border-blue-200': localBrandId === null}"
            >
              <input 
                type="radio" 
                :value="null" 
                v-model="localBrandId"
                class="sr-only"
              />
              <span class="text-sm text-gray-700 mx-auto" :class="{'font-medium text-blue-700': localBrandId === null}">Toutes</span>
            </label>

            <label 
              v-for="brand in brands" 
              :key="brand.id"
              class="flex items-center p-2 rounded border border-gray-200 cursor-pointer hover:bg-gray-50"
              :class="{'bg-blue-50 border-blue-200': localBrandId === brand.id}"
            >
              <input 
                type="radio" 
                :value="brand.id" 
                v-model="localBrandId"
                class="sr-only"
              />
              <span class="text-sm text-gray-700 mx-auto" :class="{'font-medium text-blue-700': localBrandId === brand.id}">{{ brand.name }}</span>
            </label>
          </div>
        </section>

        <hr v-if="showSection('brand') && showSection('price')" class="border-gray-100" />

        <!-- Price Range -->
        <section v-if="showSection('price')">
          <h3 v-if="activeTab === 'all'" class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
            Prix
          </h3>
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <label class="block text-xs text-gray-500 mb-1">Min (G)</label>
              <input 
                type="number" 
                v-model.number="localMinPrice" 
                placeholder="0"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <span class="text-gray-400 mt-5">-</span>
            <div class="flex-1">
              <label class="block text-xs text-gray-500 mb-1">Max (G)</label>
              <input 
                type="number" 
                v-model.number="localMaxPrice" 
                placeholder="Max"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </section>

        <hr v-if="(showSection('price') || showSection('brand')) && activeTab === 'all'" class="border-gray-100" />

        <!-- Promotions -->
        <section v-if="activeTab === 'all'">
          <label class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-900">Afficher uniquement les promotions</span>
            <div class="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" v-model="localIsPromotions" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300"/>
                <label class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </label>
        </section>

      </div>

      <!-- Footer Actions -->
      <div class="px-4 py-4 border-t border-gray-100 bg-white">
        <div class="flex gap-3">
          <button 
            @click="reset"
            class="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 active:scale-95 transition-all"
          >
            Réinitialiser
          </button>
          <button 
            @click="apply"
            class="flex-[2] px-4 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-200 active:scale-95 transition-all"
          >
            Voir les résultats
          </button>
        </div>
      </div>
    </div>
  </Transition>
  
  <!-- Backdrop -->
  <Transition name="fade">
    <div v-if="isOpen" @click="close" class="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"></div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProductsStore } from '@/stores/products'

const props = withDefaults(defineProps<{
  isOpen: boolean
  activeTab?: string // 'all', 'sort', 'category', 'brand', 'price'
}>(), {
  activeTab: 'all'
})

const emit = defineEmits(['close', 'apply'])

const productsStore = useProductsStore()

// Local state
const localCategoryId = ref<number | null>(null)
const localBrandId = ref<number | null>(null)
const localMinPrice = ref<number | null>(null)
const localMaxPrice = ref<number | null>(null)
const localIsPromotions = ref(false)
const localSortBy = ref('name')
const localSortOrder = ref<'asc' | 'desc'>('asc')

// Computed
const categories = computed(() => productsStore.categories)
const brands = computed(() => productsStore.brands)

const drawerTitle = computed(() => {
  switch (props.activeTab) {
    case 'sort': return 'Trier par'
    case 'category': return 'Catégories'
    case 'brand': return 'Marques'
    case 'price': return 'Fourchette de prix'
    default: return 'Filtres'
  }
})

const sortModel = computed({
  get: () => ({ by: localSortBy.value, order: localSortOrder.value }),
  set: (val) => {
    localSortBy.value = val.by
    localSortOrder.value = val.order
  }
})

const showSection = (section: string) => {
  if (props.activeTab === 'all') return true
  return props.activeTab === section
}

// Sync with store when opening
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    localCategoryId.value = productsStore.selectedCategory
    localBrandId.value = productsStore.selectedBrand
    localMinPrice.value = productsStore.minPrice
    localMaxPrice.value = productsStore.maxPrice
    localIsPromotions.value = productsStore.isPromotions
    localSortBy.value = productsStore.sortBy || 'name'
    localSortOrder.value = productsStore.sortOrder || 'asc'
  }
})

const close = () => {
  emit('close')
}

const reset = () => {
  // Reset only current section if not 'all'? No, ease of use suggests logic:
  // If viewing 'Brand', reset Brand only? 
  // For now reset everything to keep it simple, or user might get confused.
  // Actually, let's reset specifically if detailed view, or all if all.
  
  if (props.activeTab === 'brand') localBrandId.value = null
  else if (props.activeTab === 'category') localCategoryId.value = null
  else if (props.activeTab === 'price') { localMinPrice.value = null; localMaxPrice.value = null }
  else if (props.activeTab === 'sort') { localSortBy.value = 'name'; localSortOrder.value = 'asc' }
  else {
    localCategoryId.value = null
    localBrandId.value = null
    localMinPrice.value = null
    localMaxPrice.value = null
    localIsPromotions.value = false
    localSortBy.value = 'name'
    localSortOrder.value = 'asc'
  }
}

const apply = () => {
  productsStore.setFilters({
    category: localCategoryId.value !== null ? localCategoryId.value : undefined,
    brand: localBrandId.value !== null ? localBrandId.value : undefined,
    minPrice: localMinPrice.value !== null ? localMinPrice.value : undefined,
    maxPrice: localMaxPrice.value !== null ? localMaxPrice.value : undefined,
    sortBy: localSortBy.value,
    sortOrder: localSortOrder.value
  })

  productsStore.selectedCategory = localCategoryId.value
  productsStore.selectedBrand = localBrandId.value
  productsStore.minPrice = localMinPrice.value
  productsStore.maxPrice = localMaxPrice.value
  productsStore.isPromotions = localIsPromotions.value
  productsStore.sortBy = localSortBy.value
  productsStore.sortOrder = localSortOrder.value
  
  productsStore.loadProducts()
  
  emit('close')
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom Checkbox Toggle */
.toggle-checkbox:checked {
  right: 0;
  border-color: #3B82F6;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #3B82F6;
}
.toggle-checkbox {
  right: 24px; /* Default pos */
  transition: all 0.2s ease-in-out; 
}
</style>
