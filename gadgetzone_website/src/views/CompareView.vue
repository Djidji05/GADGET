<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" class="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-all">
            <i class="fas fa-arrow-left text-sm"></i>
          </button>
          <div>
            <h1 class="font-black text-gray-900">Comparer les produits</h1>
            <p class="text-xs text-gray-400">{{ comparisonStore.items.length }}/{{ comparisonStore.MAX_ITEMS }} produit(s) sélectionné(s)</p>
          </div>
        </div>
        <button @click="comparisonStore.clearAll()" class="text-xs text-red-500 font-bold hover:underline">
          Tout effacer
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="comparisonStore.items.length === 0" class="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <i class="fas fa-balance-scale text-3xl text-gray-300"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-700 mb-2">Aucun produit à comparer</h2>
      <p class="text-gray-400 mb-8 max-w-sm">Naviguez sur les produits et cliquez sur ⚖️ pour ajouter jusqu'à 3 produits à comparer côte à côte.</p>
      <router-link to="/products" class="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
        Découvrir les produits
      </router-link>
    </div>

    <!-- Comparison Table -->
    <div v-else class="container mx-auto px-4 pt-6 overflow-x-auto">
      <table class="w-full min-w-[600px]">
        <thead>
          <tr>
            <th class="w-32 md:w-44 text-left text-xs font-bold text-gray-400 uppercase pb-4 pr-4">Critère</th>
            <th 
              v-for="product in comparisonStore.items" 
              :key="product.id"
              class="pb-4 px-2 align-top"
            >
              <div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 relative">
                <button 
                  @click="comparisonStore.removeItem(product.id)"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                >
                  <i class="fas fa-times"></i>
                </button>
                <img :src="product.image_url || '/placeholder.png'" :alt="product.name" class="w-full aspect-square object-cover rounded-xl mb-2">
                <p class="font-bold text-gray-800 text-sm line-clamp-2 text-center">{{ product.name }}</p>
                <p class="text-xs text-gray-400 text-center">{{ product.store?.name || 'HTFasil' }}</p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <!-- Prix -->
          <tr class="hover:bg-white/60 transition-colors">
            <td class="py-4 pr-4 text-xs font-bold text-gray-500 uppercase">Prix</td>
            <td v-for="p in comparisonStore.items" :key="p.id" class="py-4 px-2 text-center">
              <span class="text-lg font-black text-gray-900">{{ p.price }} HTG</span>
              <span v-if="p.original_price && Number(p.original_price) > Number(p.price)" class="block text-xs text-gray-400 line-through">{{ p.original_price }} HTG</span>
            </td>
          </tr>
          <!-- Note -->
          <tr class="hover:bg-white/60 transition-colors">
            <td class="py-4 pr-4 text-xs font-bold text-gray-500 uppercase">Note</td>
            <td v-for="p in comparisonStore.items" :key="p.id" class="py-4 px-2 text-center">
              <div class="flex items-center justify-center gap-1">
                <i class="fas fa-star text-yellow-400 text-sm"></i>
                <span class="font-bold text-gray-700">{{ Number(p.average_rating || p.rating || 0).toFixed(1) }}</span>
              </div>
              <span class="text-xs text-gray-400">{{ p.review_count || 0 }} avis</span>
            </td>
          </tr>
          <!-- Vendeur -->
          <tr class="hover:bg-white/60 transition-colors">
            <td class="py-4 pr-4 text-xs font-bold text-gray-500 uppercase">Vendeur</td>
            <td v-for="p in comparisonStore.items" :key="p.id" class="py-4 px-2 text-center">
              <span class="text-sm font-medium text-gray-700">{{ p.store?.name || 'HTFasil' }}</span>
            </td>
          </tr>
          <!-- Catégorie -->
          <tr class="hover:bg-white/60 transition-colors">
            <td class="py-4 pr-4 text-xs font-bold text-gray-500 uppercase">Catégorie</td>
            <td v-for="p in comparisonStore.items" :key="p.id" class="py-4 px-2 text-center">
              <span class="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">{{ p.category?.name || 'N/A' }}</span>
            </td>
          </tr>
          <!-- État / Condition -->
          <tr class="hover:bg-white/60 transition-colors">
            <td class="py-4 pr-4 text-xs font-bold text-gray-500 uppercase">État</td>
            <td v-for="p in comparisonStore.items" :key="p.id" class="py-4 px-2 text-center">
              <span class="capitalize text-sm text-gray-600">{{ p.condition || 'Neuf' }}</span>
            </td>
          </tr>
          <!-- Spécifications -->
          <tr v-for="specKey in allSpecKeys" :key="specKey" class="hover:bg-white/60 transition-colors">
            <td class="py-4 pr-4 text-xs font-bold text-gray-500 uppercase">{{ specKey }}</td>
            <td v-for="p in comparisonStore.items" :key="p.id" class="py-4 px-2 text-center">
              <span class="text-sm text-gray-700">{{ p.specifications?.[specKey] || '—' }}</span>
            </td>
          </tr>
          <!-- Action -->
          <tr>
            <td class="py-4 pr-4"></td>
            <td v-for="p in comparisonStore.items" :key="p.id" class="py-4 px-2">
              <router-link 
                :to="`/products/${p.slug || p.id}`"
                class="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                Voir le produit
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComparisonStore } from '@/stores/comparison'

const comparisonStore = useComparisonStore()

// Réunion de toutes les clés de spécifications disponibles dans les produits sélectionnés
const allSpecKeys = computed(() => {
  const keys = new Set<string>()
  comparisonStore.items.forEach(p => {
    if (p.specifications && typeof p.specifications === 'object') {
      Object.keys(p.specifications).forEach(k => keys.add(k))
    }
  })
  return [...keys]
})
</script>
