<template>
  <div class="container mx-auto px-4 pt-6 md:pt-8 pb-32">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('cart.title') }}</h1>
      <div class="flex items-center gap-4">
        <!-- Tout sélectionner -->
        <button 
          @click="toggleSelectAll"
          class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-bold text-[13px]"
        >
          <div 
            class="w-4 h-4 rounded border flex items-center justify-center transition-all duration-200"
            :class="isAllSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300'"
          >
            <i v-if="isAllSelected" class="fas fa-check text-[8px]"></i>
          </div>
          <span>{{ $t('account.check_all') }}</span>
        </button>

        <!-- Partager -->
        <button 
          @click="shareCart"
          class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-bold text-[13px]"
        >
          <i class="fas fa-share-alt"></i>
          <span class="hidden sm:inline">{{ $t('account.share') }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse space-y-8 max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
             <div v-for="n in 3" :key="n" class="h-32 bg-gray-200 rounded-2xl"></div>
        </div>
        <div class="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>

    <!-- Cart Content -->
    <div v-else-if="!isEmpty" class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
      


      <!-- Cart Items List -->
      <div class="lg:col-span-2 space-y-4">

        <div v-for="item in items" :key="item.id" class="group py-3 border-b border-gray-100 last:border-0">
          <div class="flex gap-3">
             <!-- Image with Checkbox overlay -->
             <div class="shrink-0 relative">
               <router-link :to="'/products/' + item.product.id" class="block relative overflow-hidden rounded-xl w-20 h-20">
                 <img
                   :src="item.product.image || 'https://placehold.co/100?text=No+Image'"
                   :alt="item.product.name"
                   class="w-full h-full object-cover"
                   @error="handleImageError"
                 />
               </router-link>
               <!-- Checkbox Overlay -->
               <div 
                  @click="toggleSelection(item.id)"
                  class="absolute top-1 left-1 z-10 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all"
                  :class="selectedItems.has(item.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/80 border-gray-300'"
               >
                  <i v-if="selectedItems.has(item.id)" class="fas fa-check text-[9px]"></i>
               </div>
             </div>

             <!-- Details -->
             <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                   <div class="flex justify-between items-start gap-2">
                      <router-link :to="'/products/' + item.product.id" class="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-blue-600 transition-colors flex-1">
                        {{ item.product.name }}
                      </router-link>
                      <div class="flex items-center">
                        <button @click="shareItem(item)" class="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-blue-500 transition-all" :title="$t('account.share')">
                          <i class="far fa-share-square text-sm"></i>
                        </button>
                        <button @click="removeFromCart(item.id)" class="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all" :title="$t('common.delete')">
                          <i class="fas fa-trash-alt text-sm"></i>
                        </button>
                      </div>
                   </div>
                   <p class="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                     {{ item.product.description || $t('account.view_details') }}
                   </p>
                </div>

                <div class="flex items-center justify-between mt-2">
                   <div class="font-bold text-blue-600 text-base">
                      {{ formatPrice(item.product.price) }}
                   </div>
                   <!-- Quantity Stepper -->
                   <div class="flex items-center">
                      <button
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30 active:scale-90 transition-all"
                        :title="$t('products.decrease_qty')"
                      >
                        <i class="fas fa-minus text-[10px]"></i>
                      </button>
                      <span class="w-7 text-center text-sm font-bold text-gray-900">{{ item.quantity }}</span>
                      <button
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="w-7 h-7 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-blue-600 active:scale-90 transition-all"
                        :title="$t('products.increase_qty')"
                      >
                        <i class="fas fa-plus text-[10px]"></i>
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- Cart Summary Mobile (Floating above BottomNav) -->
        <div class="lg:hidden fixed bottom-[65px] left-0 right-0 z-[65] bg-white border-b-2 border-gray-300 px-3 py-2.5 flex items-center justify-between">
            <div class="flex flex-col justify-center">
               <div class="flex items-baseline gap-1.5">
                  <span class="text-[22px] font-black text-blue-600 leading-none tracking-tight">{{ formatPrice(total) }}</span>
                  <i class="fas fa-chevron-up text-gray-500 text-sm align-middle"></i>
               </div>
               <div class="text-gray-400 text-xs font-medium mt-1 flex items-center">
                  <i class="fas fa-lock text-[10px] mr-1"></i> {{ $t('account.secure_payment_lock') }}
               </div>
            </div>
            
            <router-link 
              to="/checkout" 
              class="bg-blue-600 text-white px-5 py-2.5 flex items-center justify-center active:scale-95 transition-transform min-w-[150px] rounded-xl hover:bg-blue-700"
              :class="{ 'opacity-50 pointer-events-none': selectedCount === 0 }"
            >
              <span class="font-bold text-base">{{ $t('account.cart.checkout') }} ({{ selectedCount }})</span>
            </router-link>
        </div>

        <!-- Spacer for mobile to clear the fixed bar -->
        <div class="lg:hidden h-24"></div>
      </div>


      <!-- Cart Summary -->
      <div class="lg:col-span-1 space-y-6 sticky top-24">
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hidden lg:block">
          <h3 class="text-xl font-bold text-gray-900 mb-6 hidden lg:block">{{ $t('cart.summary') }}</h3>

          <div class="space-y-4 mb-6 hidden lg:block">
            <div class="flex justify-between text-gray-500 text-sm">
              <span>{{ $t('account.cart.subtotal', { count: selectedCount }) }}</span>
              <span class="font-medium text-gray-900">{{ formatPrice(subtotal) }}</span>
            </div>
            
            <div class="h-px bg-gray-100 my-2"></div>
         
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">{{ $t('account.cart.total') }}</span>
              <span class="text-2xl font-bold text-blue-600">{{ formatPrice(subtotal) }}</span>
            </div>
          </div>

          <div class="space-y-3 hidden lg:block">
            <router-link 
              to="/checkout" 
              class="w-full bg-blue-600 text-white text-center flex items-center justify-center py-4 text-base font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              :class="{ 'opacity-50 pointer-events-none grayscale': selectedCount === 0 }"
            >
              {{ $t('account.cart.checkout') }}
              <i class="las la-arrow-right ml-2"></i>
            </router-link>
            
            <div class="flex items-center justify-center gap-2 text-gray-400 text-sm mt-4">
              <i class="las la-lock"></i>
              <span>{{ $t('checkout.secure_payment') }}</span>
            </div>
          </div>
        </div>


      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-24 max-w-md mx-auto">
      <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <i class="las la-shopping-cart text-4xl text-gray-300"></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-3">{{ $t('cart.empty') }}</h3>
      <p class="text-gray-500 mb-8 leading-relaxed">{{ $t('cart.empty_message') }}</p>
      <router-link to="/products" class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        {{ $t('account.cart.discover') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'

const { t } = useI18n()
const cartStore = useCartStore()
const uiStore = useUiStore()

// State
const selectedItems = computed(() => cartStore.selectedItems)
const toggleSelection = (id: number) => cartStore.toggleSelection(id)
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    cartStore.clearSelection()
  } else {
    cartStore.selectAll()
  }
}

// Computed
const items = computed(() => cartStore.items)
const isEmpty = computed(() => cartStore.isEmpty)
const isLoading = computed(() => cartStore.isLoading)

// Watch items to auto-select all newly loaded items
watch(items, (newItems) => {
  if (newItems.length > 0 && selectedItems.value.size === 0) {
    cartStore.selectAll()
  }
}, { immediate: true })

const isAllSelected = computed(() => {
  return items.value.length > 0 && selectedItems.value.size === items.value.length
})

const selectedCount = computed(() => {
  return items.value
    .filter(item => selectedItems.value.has(item.id))
    .reduce((count, item) => count + item.quantity, 0)
})

const subtotal = computed(() => {
  return items.value
    .filter(item => selectedItems.value.has(item.id))
    .reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
})

const total = computed(() => subtotal.value)


// Methods
const formatPrice = (price: number) => {
  const locale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price).replace('HTG', 'G')
}

const updateQuantity = async (itemId: number, quantity: number) => {
  if (quantity > 0) {
    await cartStore.updateQuantity(itemId, quantity)
  }
}

const removeFromCart = async (itemId: number) => {
  await cartStore.removeFromCart(itemId)
}

const clearCart = async () => {
  uiStore.confirm({
    title: t('cart.clear_confirm_title'),
    message: t('cart.clear_confirm_message'),
    type: 'warning',
    confirmText: t('cart.clear'),
    cancelText: t('common.cancel'),
    onConfirm: async () => {
      await cartStore.clearCart()
    }
  })
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://placehold.co/100?text=Error'
}

// Load cart on mount
onMounted(() => {
  cartStore.loadCart()
})

// Sharing Logic
const shareCart = async () => {
  if (selectedItems.value.size === 0) {
    uiStore.showToast(t('account.cart.share_selected'), "warning")
    return
  }

  const selectedProducts = items.value.filter(item => selectedItems.value.has(item.id))
  const shareData = {
    title: t('cart.share_title'),
    text: `${t('cart.share_title')} ! J'ai choisi ${selectedItems.value.size} articles pour un total de ${formatPrice(total.value)}.`,
    url: window.location.origin + '/cart'
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      uiStore.showToast(t('cart.copied'), 'success')
    }
  } catch (err) {
    console.error('Error sharing cart:', err)
  }
}

const shareItem = async (item: any) => {
  const shareData = {
    title: item.product.name,
    text: `Regarde ce produit sur HTFasil : ${item.product.name} à ${formatPrice(item.product.price)}`,
    url: window.location.origin + '/products/' + item.product.id
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      uiStore.showToast(t('cart.copied'), 'success')
    }
  } catch (err) {
    console.error('Error sharing item:', err)
  }
}
</script>
