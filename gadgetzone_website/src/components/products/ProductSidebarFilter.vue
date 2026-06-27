<template>
<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
      <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
        <i class="fas fa-filter text-blue-600 text-sm"></i>
        Filtres
      </h2>
      <button 
        @click="resetAll" 
        class="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        Réinitialiser
      </button>
    </div>

    <div class="p-6 space-y-8">
      <!-- Search Input -->
      <section>
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recherche</h3>
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher..."
            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        </div>
      </section>

      <!-- Sort -->
      <section>
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Trier par</h3>
        <div class="space-y-2">
          <label 
            v-for="option in sortOptions" 
            :key="option.value"
            class="flex items-center group cursor-pointer"
          >
            <div class="relative flex items-center justify-center w-5 h-5">
              <input 
                type="radio" 
                name="sidebar-sort" 
                :value="option.value" 
                v-model="sortBy"
                class="sr-only"
              />
              <div 
                class="w-5 h-5 rounded-full border-2 transition-all"
                :class="sortBy === option.value ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'"
              ></div>
              <div v-if="sortBy === option.value" class="absolute w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span 
              class="ml-3 text-sm transition-colors"
              :class="sortBy === option.value ? 'text-gray-900 font-semibold' : 'text-gray-600 group-hover:text-gray-900'"
            >
              {{ option.label }}
            </span>
          </label>
        </div>
      </section>

      <!-- Categories -->
      <section>
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Catégories</h3>
        <div class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          <label class="flex items-center group cursor-pointer">
            <div class="relative flex items-center justify-center w-5 h-5">
              <input 
                type="radio" 
                :value="null" 
                v-model="selectedCategory"
                class="sr-only"
              />
              <div 
                class="w-5 h-5 rounded-md border-2 transition-all"
                :class="selectedCategory === null ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'"
              ></div>
              <i v-if="selectedCategory === null" class="fas fa-check absolute text-[10px] text-white"></i>
            </div>
            <span 
              class="ml-3 text-sm transition-colors"
              :class="selectedCategory === null ? 'text-gray-900 font-semibold' : 'text-gray-600 group-hover:text-gray-900'"
            >
              Toutes les catégories
            </span>
          </label>

          <!-- Nested Categories Group -->
          <div v-for="group in groupedCategories" :key="'group-'+group.id" class="mb-4">
            <!-- Parent Category -->
            <label class="flex items-center group cursor-pointer mb-2">
              <div class="relative flex items-center justify-center w-5 h-5">
                <input 
                  type="radio" 
                  :value="group.id" 
                  v-model="selectedCategory"
                  class="sr-only"
                />
                <div 
                  class="w-5 h-5 rounded-md border-2 transition-all"
                  :class="selectedCategory === group.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'"
                ></div>
                <i v-if="selectedCategory === group.id" class="fas fa-check absolute text-[10px] text-white"></i>
              </div>
              <span 
                class="ml-3 text-sm transition-colors font-bold"
                :class="selectedCategory === group.id ? 'text-blue-700' : 'text-gray-900 group-hover:text-blue-600'"
              >
                {{ group.name }}
              </span>
            </label>

            <!-- Child Categories -->
            <div class="pl-6 space-y-2 border-l-2 border-gray-100 ml-2.5 mt-2">
              <label 
                v-for="category in group.children" 
                :key="category.id"
                class="flex items-center group cursor-pointer"
              >
                <div class="relative flex items-center justify-center w-4 h-4">
                  <input 
                    type="radio" 
                    :value="category.id" 
                    v-model="selectedCategory"
                    class="sr-only"
                  />
                  <div 
                    class="w-4 h-4 rounded-md border-2 transition-all"
                    :class="selectedCategory === category.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'"
                  ></div>
                  <i v-if="selectedCategory === category.id" class="fas fa-check absolute text-[8px] text-white"></i>
                </div>
                <span 
                  class="ml-3 text-sm transition-colors"
                  :class="selectedCategory === category.id ? 'text-gray-900 font-semibold' : 'text-gray-600 group-hover:text-gray-900'"
                >
                  {{ category.name }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- Brands -->
      <section v-if="brands.length > 0">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Marques</h3>
        <div class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
           <label class="flex items-center group cursor-pointer">
            <div class="relative flex items-center justify-center w-5 h-5">
              <input 
                type="radio" 
                :value="null" 
                v-model="selectedBrand"
                class="sr-only"
              />
              <div 
                class="w-5 h-5 rounded-md border-2 transition-all"
                :class="selectedBrand === null ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'"
              ></div>
              <i v-if="selectedBrand === null" class="fas fa-check absolute text-[10px] text-white"></i>
            </div>
            <span 
              class="ml-3 text-sm transition-colors"
              :class="selectedBrand === null ? 'text-gray-900 font-semibold' : 'text-gray-600 group-hover:text-gray-900'"
            >
              Toutes les marques
            </span>
          </label>

          <label 
            v-for="brand in brands" 
            :key="brand.id"
            class="flex items-center group cursor-pointer"
          >
            <div class="relative flex items-center justify-center w-5 h-5">
              <input 
                type="radio" 
                :value="brand.id" 
                v-model="selectedBrand"
                class="sr-only"
              />
              <div 
                class="w-5 h-5 rounded-md border-2 transition-all"
                :class="selectedBrand === brand.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'"
              ></div>
              <i v-if="selectedBrand === brand.id" class="fas fa-check absolute text-[10px] text-white"></i>
            </div>
            <span 
              class="ml-3 text-sm transition-colors"
              :class="selectedBrand === brand.id ? 'text-gray-900 font-semibold' : 'text-gray-600 group-hover:text-gray-900'"
            >
              {{ brand.name }}
            </span>
          </label>
        </div>
      </section>

      <!-- Price Range -->
      <section>
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Prix (G)</h3>
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <input 
              type="number" 
              v-model.number="minPrice" 
              placeholder="Min"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <span class="text-gray-400 text-xs">à</span>
          <div class="flex-1">
            <input 
              type="number" 
              v-model.number="maxPrice" 
              placeholder="Max"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      <!-- Promotions Toggle -->
      <section class="pt-4 border-t border-gray-50">
        <label class="flex items-center justify-between cursor-pointer group">
          <span class="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">Promotions</span>
          <div class="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
              <input 
                type="checkbox" 
                v-model="isPromotions" 
                class="sr-only peer"
              />
              <div class="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </label>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()

// Options for sorting
const sortOptions = [
  { label: 'Nom (A-Z)', value: 'name' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix décroissant', value: 'price_desc' },
  { label: 'Plus récents', value: 'newest' }
]

// Computed properties connected to store
const categories = computed(() => productsStore.categories)
const brands = computed(() => productsStore.brands)

const groupedCategories = computed(() => {
  const allCategories = categories.value || []
  // Identify parent categories (those without a parentId)
  const parents = allCategories.filter((c: any) => !c.parentId || c.parentId === null)
  
  // Attach children to each parent
  return parents.map((parent: any) => ({
    ...parent,
    children: allCategories.filter((c: any) => c.parentId === parent.id)
  }))
})

const searchQuery = computed({
  get: () => productsStore.searchQuery,
  set: (val) => { productsStore.searchQuery = val }
})

const sortBy = computed({
  get: () => {
    if (productsStore.sortBy === 'price') {
      return productsStore.sortOrder === 'asc' ? 'price_asc' : 'price_desc'
    }
    return productsStore.sortBy || 'name'
  },
  set: (val) => {
    if (val === 'price_asc') {
      productsStore.sortBy = 'price'
      productsStore.sortOrder = 'asc'
    } else if (val === 'price_desc') {
      productsStore.sortBy = 'price'
      productsStore.sortOrder = 'desc'
    } else {
      productsStore.sortBy = val
      productsStore.sortOrder = 'asc'
    }
    productsStore.loadProducts()
  }
})

const selectedCategory = computed({
  get: () => productsStore.selectedCategory,
  set: (val) => { 
    productsStore.selectedCategory = val
    productsStore.loadProducts()
  }
})

const selectedBrand = computed({
  get: () => productsStore.selectedBrand,
  set: (val) => { 
    productsStore.selectedBrand = val
    productsStore.loadProducts()
  }
})

const minPrice = computed({
  get: () => productsStore.minPrice,
  set: (val) => { 
    productsStore.minPrice = val
    productsStore.loadProducts()
  }
})

const maxPrice = computed({
  get: () => productsStore.maxPrice,
  set: (val) => { 
    productsStore.maxPrice = val
    productsStore.loadProducts()
  }
})

const isPromotions = computed({
  get: () => productsStore.isPromotions,
  set: (val) => { 
    productsStore.isPromotions = val
    productsStore.loadProducts()
  }
})

// Reset all filters
const resetAll = () => {
  productsStore.searchQuery = ''
  productsStore.selectedCategory = null
  productsStore.selectedBrand = null
  productsStore.minPrice = null
  productsStore.maxPrice = null
  productsStore.isPromotions = false
  productsStore.sortBy = 'name'
  productsStore.sortOrder = 'asc'
  productsStore.loadProducts()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #D1D5DB;
}
</style>
