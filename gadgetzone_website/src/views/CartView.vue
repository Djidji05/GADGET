<template>
  <div class="container mx-auto px-4 pt-6 md:pt-8 pb-32 max-w-6xl">
    <!-- En-tête de page raffiné -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-150 dark:border-gray-800">
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {{ $t('cart.title') }}
        </h1>
        <p v-if="!isEmpty" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ selectedCount }} {{ selectedCount > 1 ? 'articles sélectionnés' : 'article sélectionné' }}
        </p>
      </div>

      <!-- Actions globales -->
      <div v-if="!isEmpty" class="flex items-center gap-4">
        <!-- Tout sélectionner -->
        <button 
          @click="toggleSelectAll"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-500 transition-all font-bold text-xs uppercase tracking-wider"
        >
          <div 
            class="w-5 h-5 rounded border flex items-center justify-center transition-all duration-200"
            :class="isAllSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'"
          >
            <i v-if="isAllSelected" class="fas fa-check text-[8px]"></i>
          </div>
          <span>{{ $t('account.cart.select_all', { count: items.length }) }}</span>
        </button>

        <!-- Partager le panier -->
        <button 
          @click="shareCart"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-500 transition-all font-bold text-xs uppercase tracking-wider"
        >
          <i class="fas fa-share-alt"></i>
          <span>{{ $t('account.share') }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <div v-for="n in 3" :key="n" class="h-36 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200/40 dark:border-gray-700/40"></div>
        </div>
        <div class="h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200/40 dark:border-gray-700/40"></div>
      </div>
    </div>

    <!-- Cart Content -->
    <div v-else-if="!isEmpty" class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
      
      <!-- Cart Items List -->
      <div class="lg:col-span-2 relative">
        <transition-group name="cart-list" tag="div" class="space-y-4">
          <div 
            v-for="item in items" 
            :key="item.id" 
            class="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-500/20 dark:hover:border-blue-500/20 flex gap-4 md:gap-5"
          >
            <!-- Checkbox Column -->
            <div class="flex items-center justify-center shrink-0 pr-1 select-none">
              <button 
                @click="toggleSelection(item.id)"
                class="w-5 h-5 rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95"
                :class="cartStore.isSelected(item.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-transparent border-gray-300 dark:border-gray-700 hover:border-blue-500'"
              >
                <i v-if="cartStore.isSelected(item.id)" class="fas fa-check text-[9px]"></i>
              </button>
            </div>

            <!-- Product Image -->
            <div class="shrink-0 relative overflow-hidden rounded-xl w-24 h-24 bg-gray-50 dark:bg-gray-800 border border-gray-100/50 dark:border-gray-800/50 flex items-center justify-center select-none">
              <router-link :to="'/products/' + (item.product.slug || item.product.id)" class="block w-full h-full">
                <img
                  :src="item.product.image || 'https://placehold.co/100?text=No+Image'"
                  :alt="item.product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  @error="handleImageError"
                />
              </router-link>
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <!-- Store Tag if applicable -->
                    <span v-if="item.offer?.Store?.name" class="inline-flex items-center text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full mb-1">
                      <i class="fas fa-store mr-1 text-[8px]"></i> {{ item.offer.Store.name }}
                    </span>
                    <router-link 
                      :to="'/products/' + (item.product.slug || item.product.id)" 
                      class="block text-sm md:text-base font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-snug"
                    >
                      {{ item.product.name }}
                    </router-link>
                  </div>
                  
                  <!-- Actions (Delete and Share) -->
                  <div class="flex items-center gap-1 select-none">
                    <button 
                      @click="shareItem(item)" 
                      class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 active:scale-95 transition-all" 
                      :title="$t('account.share')"
                    >
                      <i class="far fa-share-square text-sm"></i>
                    </button>
                    <button 
                      @click="removeFromCart(item.id)" 
                      class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 active:scale-95 transition-all" 
                      :title="$t('common.delete')"
                    >
                      <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                </div>
                
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
                  {{ item.product.description || $t('account.view_details') }}
                </p>
              </div>

              <!-- Price & Quantity Stepper -->
              <div class="flex items-center justify-between mt-3">
                <div class="font-extrabold text-blue-600 dark:text-blue-400 text-base md:text-lg">
                  {{ formatPrice(item.product.price) }}
                </div>
                
                <!-- Quantity Stepper Pill -->
                <div class="flex items-center bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-800 rounded-full px-1.5 py-0.5 select-none">
                  <button
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                    class="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-550 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 active:scale-90 transition-all"
                    :title="$t('products.decrease_qty')"
                  >
                    <i class="fas fa-minus text-[9px]"></i>
                  </button>
                  <span class="w-8 text-center text-xs font-bold text-gray-900 dark:text-gray-100 select-none">
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    class="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-550 hover:bg-white dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 active:scale-90 transition-all"
                    :title="$t('products.increase_qty')"
                  >
                    <i class="fas fa-plus text-[9px]"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition-group>

        <!-- Cart Summary Mobile (Floating above BottomNav) -->
        <div class="lg:hidden fixed bottom-[65px] left-0 right-0 z-[65] bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-lg">
          <div class="flex flex-col justify-center">
            <div class="text-[20px] font-black text-blue-600 dark:text-blue-400 leading-none tracking-tight">
              {{ formatPrice(total) }}
            </div>
            <div class="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-1 flex items-center">
              <i class="fas fa-lock text-[8px] mr-1 text-green-500"></i> {{ $t('account.secure_payment_lock') }}
            </div>
          </div>
          
          <router-link 
            to="/checkout" 
            class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 flex items-center justify-center active:scale-95 transition-all duration-200 rounded-xl font-bold text-sm shadow-md"
            :class="{ 'opacity-50 pointer-events-none grayscale': selectedCount === 0 }"
          >
            <span>{{ $t('account.cart.checkout') }} ({{ selectedCount }})</span>
          </router-link>
        </div>

        <!-- Spacer for mobile to clear the fixed bar -->
        <div class="lg:hidden h-24"></div>
      </div>

      <!-- Cart Summary Card (Desktop) -->
      <div class="lg:col-span-1 space-y-6 sticky top-24">
        <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800/80 hidden lg:block relative overflow-hidden">
          
          <!-- Abstract Background Pattern -->
          <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-5">
            {{ $t('cart.summary') }}
          </h3>

          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
              <span>{{ $t('account.cart.subtotal', { count: selectedCount }) }}</span>
              <span class="font-bold text-gray-800 dark:text-gray-200">{{ formatPrice(subtotal) }}</span>
            </div>

            <!-- Promo Code Applied Discount -->
            <div v-if="discountAmount > 0" class="flex justify-between text-green-600 dark:text-green-400 text-sm font-medium">
              <span class="flex items-center gap-1">
                <i class="fas fa-tag text-xs"></i> Réduction Promo
              </span>
              <span>-{{ formatPrice(discountAmount) }}</span>
            </div>
            
            <div class="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
         
            <div class="flex justify-between items-center">
              <span class="text-base font-bold text-gray-900 dark:text-white">{{ $t('account.cart.total') }}</span>
              <span class="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">{{ formatPrice(total) }}</span>
            </div>
          </div>

          <!-- Promo Code Input / State -->
          <div class="my-5 pt-4 border-t border-gray-100 dark:border-gray-800/60">
            <label class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2">
              {{ $t('account.cart.promo_code') || 'Code Promo' }}
            </label>
            
            <div v-if="!promoInfo" class="flex gap-2">
              <input 
                v-model="promoCode" 
                type="text" 
                :placeholder="$t('account.cart.enter_code') || 'Entrez le code'" 
                class="flex-1 px-3.5 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white"
                @keyup.enter="applyPromo"
              />
              <button 
                @click="applyPromo" 
                :disabled="!promoCode || isApplyingPromo"
                class="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200"
              >
                <i v-if="isApplyingPromo" class="fas fa-spinner animate-spin mr-1"></i>
                {{ $t('account.cart.apply') || 'Appliquer' }}
              </button>
            </div>

            <!-- Promo Success Banner -->
            <div v-else class="flex items-center justify-between bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-xl px-3 py-2.5 text-xs text-green-700 dark:text-green-300 animate-in fade-in zoom-in-95 duration-200">
              <div class="flex items-center gap-2 min-w-0">
                <i class="fas fa-tag shrink-0 text-green-500"></i>
                <span class="truncate">
                  Code <strong>{{ promoInfo.code }}</strong> (-{{ formatPrice(discountAmount) }})
                </span>
              </div>
              <button @click="removePromoCode" class="text-red-500 hover:text-red-700 font-bold ml-2 shrink-0 hover:underline select-none">
                Retirer
              </button>
            </div>
          </div>

          <!-- Loyalty points badge (subtle gamification) -->
          <div v-if="selectedCount > 0" class="mb-5 bg-gradient-to-r from-amber-500/8 to-yellow-500/8 dark:from-amber-950/10 dark:to-yellow-950/10 border border-amber-500/10 dark:border-amber-900/30 rounded-2xl p-4 flex items-start gap-3 select-none">
            <div class="w-8 h-8 rounded-full bg-amber-500/10 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
              <i class="fas fa-coins text-sm animate-pulse"></i>
            </div>
            <div>
              <span class="text-xs font-bold text-amber-800 dark:text-amber-300 block">
                Points Fidélité Gagnés !
              </span>
              <span class="text-[11px] text-amber-600/90 dark:text-amber-400/90 mt-0.5 block">
                Cette commande vous rapportera environ <strong class="font-extrabold text-amber-800 dark:text-amber-300">+{{ Math.floor(total / 100) }} pts</strong>
              </span>
            </div>
          </div>

          <div class="space-y-3">
            <router-link 
              to="/checkout" 
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center flex items-center justify-center py-3.5 text-sm md:text-base font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              :class="{ 'opacity-50 pointer-events-none grayscale': selectedCount === 0 }"
            >
              {{ $t('account.cart.checkout') }}
              <i class="las la-arrow-right ml-2 text-base"></i>
            </router-link>
            
            <div class="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-xs mt-4">
              <i class="las la-lock text-sm text-green-500"></i>
              <span>{{ $t('checkout.secure_payment') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Cart State -->
    <div v-else class="text-center py-20 max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div class="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-gray-800">
        <i class="las la-shopping-cart text-4xl text-gray-300 dark:text-gray-600"></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ $t('cart.empty') }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        {{ $t('cart.empty_message') }}
      </p>
      <router-link 
        to="/products" 
        class="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
      >
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
const promoCode = ref('')
const isApplyingPromo = ref(false)

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

const promoInfo = computed(() => cartStore.cart?.promoInfo || null)

const discountAmount = computed(() => {
  if (!promoInfo.value) return 0
  if (promoInfo.value.discountType === 'percentage') {
    return Math.round((subtotal.value * promoInfo.value.discount) / 100)
  }
  return promoInfo.value.discountAmount || 0
})

const total = computed(() => Math.max(0, subtotal.value - discountAmount.value))

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
    url: window.location.origin + '/products/' + (item.product.slug || item.product.id)
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

// Promo Code Logic
const applyPromo = async () => {
  if (!promoCode.value) return
  try {
    isApplyingPromo.value = true
    await cartStore.applyPromoCode(promoCode.value)
    uiStore.showToast(t('cart.promo_applied') || 'Code promo appliqué avec succès !', 'success')
  } catch (err: any) {
    console.error(err)
    uiStore.showToast(err.response?.data?.message || t('cart.promo_invalid') || 'Code promo invalide', 'error')
  } finally {
    isApplyingPromo.value = false
  }
}

const removePromoCode = async () => {
  try {
    await cartStore.loadCart()
    promoCode.value = ''
    uiStore.showToast(t('cart.promo_removed') || 'Code promo retiré', 'success')
  } catch (err) {
    console.error('Failed to reload cart:', err)
  }
}
</script>

<style scoped>
/* Transition animations for transitioning list items */
.cart-list-move,
.cart-list-enter-active,
.cart-list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cart-list-enter-from,
.cart-list-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(15px);
}

.cart-list-leave-active {
  position: absolute;
  width: 100%;
  z-index: 0;
}
</style>
