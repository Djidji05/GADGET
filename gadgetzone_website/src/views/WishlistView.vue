<template>
<div class="bg-gray-50 min-h-screen pt-4 pb-32 lg:py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Votre Liste d'envies</h1>
      
      <div v-if="wishlistStore.itemCount === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-heart text-2xl text-gray-400"></i>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Votre liste est vide</h2>
        <p class="text-gray-500 mb-6">Vous n'avez pas encore ajouté de produits à votre liste d'envies.</p>
        <router-link 
          to="/products" 
          class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Découvrir nos produits
        </router-link>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <ProductCard
          v-for="product in wishlistStore.items"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWishlistStore } from '@/stores/wishlist'
import ProductCard from '@/components/products/ProductCard.vue'

const wishlistStore = useWishlistStore()
</script>
