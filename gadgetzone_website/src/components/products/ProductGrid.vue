<template>
<div>
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div v-for="n in 8" :key="n" class="card animate-pulse">
        <div class="h-48 bg-gray-300 rounded-t-lg"></div>
        <div class="p-4 space-y-3">
          <div class="h-4 bg-gray-300 rounded w-3/4"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2"></div>
          <div class="h-4 bg-gray-300 rounded w-1/4"></div>
          <div class="h-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div
      v-else-if="hasProducts"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :promotion="getProductPromotion(product) || undefined"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <i class="las la-box-open text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">Aucun produit trouvé</h3>
      <p class="text-gray-500 mb-6">Essayez de modifier vos filtres ou votre recherche.</p>
      <button @click="resetFilters" class="btn-primary">Réinitialiser les filtres</button>
    </div>

    <!-- Pagination -->
    <div v-if="hasProducts && totalPages > 1" class="mt-8 flex justify-center">
      <nav class="flex items-center space-x-2">
        <!-- Previous -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="!hasPrevPage"
          class="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <i class="las la-chevron-left"></i>
        </button>

        <!-- Page Numbers -->
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page !== '...'"
            @click="goToPage(page)"
            :class="[
              'px-3 py-2 rounded-lg border',
              page === currentPage
                ? 'bg-primary-600 text-white border-primary-600'
                : 'border-gray-300 hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>
          <span v-else class="px-3 py-2 text-gray-500"> ... </span>
        </template>

        <!-- Next -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="!hasNextPage"
          class="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <i class="las la-chevron-right"></i>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { usePromotionsStore } from '@/stores/promotions'
import ProductCard from './ProductCard.vue'
import type { Product } from '@/services/products'

const router = useRouter()
const productsStore = useProductsStore()
const promotionsStore = usePromotionsStore()

// Computed
const products = computed(() => productsStore.filteredProducts)
const isLoading = computed(() => productsStore.isLoading)
const hasProducts = computed(() => productsStore.hasProducts)
const currentPage = computed(() => productsStore.currentPage)
const totalPages = computed(() => productsStore.totalPages)
const hasPrevPage = computed(() => productsStore.hasPrevPage)
const hasNextPage = computed(() => productsStore.hasNextPage)

// Pagination logic
const visiblePages = computed(() => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (current <= 3) {
      for (let i = 2; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// Methods
const getProductPromotion = (product: Product) => {
  return promotionsStore.getProductPromotion(product.id)
}

const goToPage = (page: string | number) => {
  if (Number(page) >= 1 && Number(page) <= totalPages.value) {
    productsStore.setPage(Number(page))
    // Update URL
    router.push({
      query: { ...router.currentRoute.value.query, page: Number(page) },
    })
    // Load products for this page
    loadProducts()
  }
}

const resetFilters = () => {
  productsStore.resetFilters()
  router.push({ name: 'products' })
  loadProducts()
}

const loadProducts = () => {
  const query = router.currentRoute.value.query
  productsStore.loadProducts(currentPage.value, false, {
    search: query.search as string,
    category: Number(query.category) || undefined,
  })
}
</script>
