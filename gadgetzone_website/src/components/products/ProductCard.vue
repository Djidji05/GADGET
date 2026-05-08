<template>
<div 
    class="group relative bg-white rounded-2xl p-2 md:p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer h-full flex" 
    :class="[
      viewMode === 'list' ? 'flex-row gap-4 md:gap-6 items-center' : 'flex-col hover:-translate-y-1',
      viewMode === 'list' ? 'w-full' : ''
    ]"
    @click="goToProduct"
  >
    
    <!-- Image Container -->
    <div 
      class="relative rounded-xl overflow-hidden bg-gray-50 group-hover:shadow-inner transition-all flex-shrink-0"
      :class="viewMode === 'list' ? 'w-24 h-24 md:w-40 md:h-40' : 'w-full aspect-square mb-2 md:mb-3'"
      style="aspect-ratio: 1 / 1;"
    >
      <img
        v-if="product.image_url"
        :src="currentImageUrl"
        :alt="product.name"
        @error="handleImageError"
        width="400"
        height="400"
        loading="lazy"
        class="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
        <i class="fas fa-image text-2xl md:text-3xl opacity-50"></i>
      </div>

      <!-- Discount Badge -->
      <div 
        v-if="hasDiscount" 
        class="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs font-black px-2 py-1 rounded-lg shadow-lg z-10"
      >
        -{{ discountPercentage }}%
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col min-w-0" :class="viewMode === 'list' ? 'h-full justify-between py-1' : 'space-y-1 md:space-y-2'">
      <div>
        <!-- Title -->
        <h3 
          class="font-semibold text-gray-800 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors"
          :class="viewMode === 'list' ? 'text-base md:text-xl mb-1' : 'text-sm md:text-[15px]'"
        >
          {{ product.name }}
        </h3>

        <!-- Vendor Name -->
        <div class="flex items-center gap-1.5 py-0.5">
          <div class="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center">
            <i class="fas fa-store text-[8px] text-blue-500"></i>
          </div>
          <span class="text-[10px] md:text-xs font-medium text-gray-500 truncate">
            {{ product.store?.name || 'HTFasil' }}
          </span>
        </div>



        <!-- List Mode Description Snippet (Optional but nice) -->
        <p v-if="viewMode === 'list' && product.description" class="hidden md:block text-sm text-gray-500 line-clamp-2 mt-2 leading-relaxed">
          {{ product.description }}
        </p>
      </div>

      <div class="mt-auto flex items-end justify-between pt-2">
        <div class="flex flex-col">
           <div class="flex items-baseline gap-2">
             <span class="font-bold text-gray-900" :class="viewMode === 'list' ? 'text-lg md:text-2xl' : 'text-sm md:text-base'">
               {{ formatPrice(product.price) }}
             </span>
             <span v-if="hasDiscount" class="text-[10px] md:text-xs text-gray-400 line-through font-medium">
               {{ formatPrice(product.original_price) }}
             </span>
           </div>
           
           <!-- List Mode Actions -->
           <div v-if="viewMode === 'list'" class="flex gap-2 md:gap-4 mt-3 md:mt-4">
              <button 
                @click.stop="addToCart"
                class="flex-1 md:flex-none px-4 md:px-6 py-2 bg-blue-600 text-white rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <i class="fas fa-shopping-bag"></i>
                <span class="hidden xs:inline md:inline">Ajouter</span>
                <span class="inline xs:hidden">Panier</span>
              </button>
              <button 
                @click.stop="toggleWishlist"
                class="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
                title="Favoris"
              >
                <i :class="isWishlisted ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i>
              </button>
           </div>
        </div>

        <!-- Grid Mode Actions -->
        <div v-if="viewMode === 'grid'" class="flex items-center gap-2">
            <!-- Mobile Rating -->
            <div v-if="Number(product.rating || 0) > 0" class="flex md:hidden items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
               <i class="fas fa-star text-yellow-500 text-[10px]"></i>
               <span class="text-xs font-bold text-gray-700">{{ Number(product.rating || 0).toFixed(1) }}</span>
            </div>
            
            <!-- Desktop Rating (Grid Only) -->
            <div v-if="Number(product.rating || 0) > 0" class="hidden md:flex items-center gap-0.5">
               <template v-for="i in 5" :key="i">
                 <i 
                    class="text-xs"
                    :class="[
                      i <= Math.round(Number(product.rating || 0)) 
                        ? 'fas fa-star text-yellow-400' 
                        : 'far fa-star text-gray-300'
                    ]"
                 ></i>
               </template>
            </div>
        </div>

        <!-- Grid Mode Floating Add to Cart -->
        <button
          v-if="viewMode === 'grid'"
          @click.stop="addToCart"
          class="absolute bottom-2 right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all duration-300 z-10 group-hover:bottom-3"
          title="Ajouter au panier"
        >
          <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>

        <!-- Wishlist Grid Mode -->
        <button 
            v-if="viewMode === 'grid'"
            class="absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all transform hover:scale-110 z-10"
            @click.stop="toggleWishlist"
        >
            <i :class="isWishlisted ? 'fas fa-heart text-red-500' : 'far fa-heart'" class="text-xs md:text-sm"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { ref, watchEffect } from 'vue'


interface Props {
  product: any;
  viewMode?: 'grid' | 'list';
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid'
})

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const uiStore = useUiStore()

const currentImageUrl = ref(props.product.image_url)

watchEffect(() => {
  currentImageUrl.value = props.product.image_url
})

const handleImageError = () => {
  // If we have multiple images and the first one (Cloudinary) fails,
  // we check if there's a fallback URL in the images array
  if (props.product.images && props.product.images[0] && typeof props.product.images[0] === 'object') {
    const hybrid = props.product.images[0]
    if (currentImageUrl.value !== hybrid.fallback) {
      console.warn(`Fallback triggered for ${props.product.name}: ${hybrid.fallback}`)
      currentImageUrl.value = hybrid.fallback
    }
  }
}

const isWishlisted = computed(() => wishlistStore.isInWishlist(props.product.id))

const hasDiscount = computed(() => {
  const price = Number(props.product.price)
  const original = Number(props.product.original_price)
  return original > price
})

const discountPercentage = computed(() => {
  if (!hasDiscount.value) return 0
  const price = Number(props.product.price)
  const original = Number(props.product.original_price)
  return Math.round(((original - price) / original) * 100)
})

const goToProduct = () => {
  router.push(`/products/${props.product.id}`)
}

const toggleWishlist = () => {
  wishlistStore.toggleItem(props.product)
}

const addToCart = async () => {
  try {
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
    
    await cartStore.addToCart(props.product.id, 1)
    uiStore.triggerCartAnimation()
  } catch (err) {
    console.error('Error adding to cart:', err)
    uiStore.showToast("Erreur lors de l'ajout au panier", 'error')
  }
}

const formatPrice = (price: any) => {
    const val = typeof price === 'number' ? price : parseFloat(price)
    return `${val} G`
}
</script>

<style scoped>
/* No extra CSS needed due to Tailwind usage.
   Keeping scoped block empty or minimal to ensure component isolation. */
</style>
