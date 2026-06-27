<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Check if we are on a product listing page
const isProductListingPage = computed(() => {
  return route.name === 'products'
})

// Categories visibility logic
const shouldShowMobileCategories = computed(() => {
  const hiddenPaths = ['/cart', '/checkout', '/account', '/orders', '/wishlist', '/addresses', '/notifications']
  return !hiddenPaths.some(path => route.path.includes(path)) && route.name !== 'product-detail'
})
</script>

<template>
  <div v-if="shouldShowMobileCategories" class="bg-white dark:bg-gray-950">
    <!-- Vertical Card Style (Product Listing Only) -->
    <div v-if="isProductListingPage" class="flex overflow-x-auto pt-1 pb-3 px-4 gap-3 no-scrollbar">
      <router-link 
        to="/products" 
        class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
        :class="!route.query.category 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-950' 
          : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:bg-gray-800/80'"
      >
        <i class="fas fa-th-large text-xl sm:text-2xl mb-1" :class="!route.query.category ? 'text-white' : 'text-gray-600 dark:text-gray-300'"></i>
        <span class="text-[10px] font-medium" :class="!route.query.category ? 'text-white' : 'text-gray-600 dark:text-gray-300'">Tous</span>
      </router-link>

      <router-link 
        to="/products?category=high-tech" 
        class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
        :class="route.query.category === 'high-tech' 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-950' 
          : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:bg-gray-800/80'"
      >
        <i class="fas fa-laptop text-xl sm:text-2xl mb-1" :class="route.query.category === 'high-tech' ? 'text-white' : 'text-gray-600 dark:text-gray-300'"></i>
        <span class="text-[10px] font-medium text-center leading-tight px-1" :class="route.query.category === 'high-tech' ? 'text-white' : 'text-gray-600 dark:text-gray-300'">High-Tech</span>
      </router-link>

      <router-link 
        to="/products?category=maison" 
        class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
        :class="route.query.category === 'maison' 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-950' 
          : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:bg-gray-800/80'"
      >
        <i class="fas fa-home text-xl sm:text-2xl mb-1" :class="route.query.category === 'maison' ? 'text-white' : 'text-gray-600 dark:text-gray-300'"></i>
        <span class="text-[10px] font-medium" :class="route.query.category === 'maison' ? 'text-white' : 'text-gray-600 dark:text-gray-300'">Maison</span>
      </router-link>

      <router-link 
        to="/products?category=mode" 
        class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
        :class="route.query.category === 'mode' 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-950' 
          : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:bg-gray-800/80'"
      >
        <i class="fas fa-tshirt text-xl sm:text-2xl mb-1" :class="route.query.category === 'mode' ? 'text-white' : 'text-gray-600 dark:text-gray-300'"></i>
        <span class="text-[10px] font-medium" :class="route.query.category === 'mode' ? 'text-white' : 'text-gray-600 dark:text-gray-300'">Mode</span>
      </router-link>
      
      <router-link 
        to="/products?category=jeux-jouets" 
        class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
        :class="route.query.category === 'jeux-jouets' 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-950' 
          : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:bg-gray-800/80'"
      >
        <i class="fas fa-gamepad text-xl sm:text-2xl mb-1" :class="route.query.category === 'jeux-jouets' ? 'text-white' : 'text-gray-600 dark:text-gray-300'"></i>
        <span class="text-[10px] font-medium text-center leading-tight px-1" :class="route.query.category === 'jeux-jouets' ? 'text-white' : 'text-gray-600 dark:text-gray-300'">Jeux/Jouets</span>
      </router-link>

      <router-link 
        to="/products?category=culture" 
        class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
        :class="route.query.category === 'culture' 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-950' 
          : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:bg-gray-800/80'"
      >
        <i class="fas fa-book text-xl sm:text-2xl mb-1" :class="route.query.category === 'culture' ? 'text-white' : 'text-gray-600 dark:text-gray-300'"></i>
        <span class="text-[10px] font-medium" :class="route.query.category === 'culture' ? 'text-white' : 'text-gray-600 dark:text-gray-300'">Culture</span>
      </router-link>

      <router-link 
        to="/products?category=autres" 
        class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm transition-all"
        :class="route.query.category === 'autres' 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-950' 
          : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:bg-gray-800/80'"
      >
        <i class="fas fa-shopping-basket text-xl sm:text-2xl mb-1" :class="route.query.category === 'autres' ? 'text-white' : 'text-gray-600 dark:text-gray-300'"></i>
        <span class="text-[10px] font-medium" :class="route.query.category === 'autres' ? 'text-white' : 'text-gray-600 dark:text-gray-300'">Superm.</span>
      </router-link>
    </div>

    <!-- Horizontal Chip Style (Home & Other Pages) -->
    <div v-else class="flex overflow-x-auto pt-1 pb-2 px-4 gap-2 no-scrollbar">
      <router-link to="/products" class="flex-shrink-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm">
        <i class="fas fa-th-large"></i>
        Tous
      </router-link>
      <router-link to="/products?category=high-tech" class="flex-shrink-0 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800">
        <i class="fas fa-laptop"></i>
        High-Tech
      </router-link>
      <router-link to="/products?category=maison" class="flex-shrink-0 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800">
        <i class="fas fa-home"></i>
        Maison
      </router-link>
      <router-link to="/products?category=mode" class="flex-shrink-0 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800">
        <i class="fas fa-tshirt"></i>
        Mode
      </router-link>
      <router-link to="/products?category=jeux-jouets" class="flex-shrink-0 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800">
        <i class="fas fa-gamepad"></i>
        Divertiss.
      </router-link>
      <router-link to="/products?category=culture" class="flex-shrink-0 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800">
        <i class="fas fa-book"></i>
        Culture
      </router-link>
      <router-link to="/products?category=autres" class="flex-shrink-0 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800">
        <i class="fas fa-shopping-basket"></i>
        Supermarché
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
