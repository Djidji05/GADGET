<template>
  <!-- Barre flottante de comparaison — visible seulement si ≥1 produit sélectionné -->
  <Transition name="slide-up">
    <div 
      v-if="comparisonStore.items.length > 0"
      class="fixed bottom-20 md:bottom-6 left-4 right-4 z-50 max-w-2xl mx-auto"
    >
      <div class="bg-gray-900 rounded-2xl shadow-2xl p-3 flex items-center gap-3">
        <!-- Miniatures -->
        <div class="flex gap-2 flex-1 overflow-hidden">
          <div 
            v-for="product in comparisonStore.items" 
            :key="product.id"
            class="relative flex-shrink-0"
          >
            <img 
              :src="product.image_url || '/placeholder.png'" 
              :alt="product.name"
              class="w-12 h-12 rounded-xl object-cover border-2 border-gray-700"
            >
            <button 
              @click.stop="comparisonStore.removeItem(product.id)"
              class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <i class="fas fa-times text-white text-[8px]"></i>
            </button>
          </div>
          <!-- Slots vides -->
          <div 
            v-for="n in (comparisonStore.MAX_ITEMS - comparisonStore.items.length)"
            :key="'empty-' + n"
            class="w-12 h-12 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center"
          >
            <i class="fas fa-plus text-gray-600 text-xs"></i>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 flex-shrink-0">
          <router-link 
            to="/compare"
            class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <i class="fas fa-balance-scale"></i>
            Comparer
          </router-link>
          <button 
            @click="comparisonStore.clearAll()"
            class="w-8 h-8 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 flex items-center justify-center transition-colors"
          >
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useComparisonStore } from '@/stores/comparison'
const comparisonStore = useComparisonStore()
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
</style>
