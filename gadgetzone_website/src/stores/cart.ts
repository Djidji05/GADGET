import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartService, type Cart, type CartItem } from '@/services/cart'

export const useCartStore = defineStore('cart', () => {
  // State
  const cart = ref<Cart | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedItems = ref<Set<number>>(new Set())

  // Getters
  const items = computed<CartItem[]>(() => cart.value?.items || [])
  const itemCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const subtotal = computed(() => cart.value?.totalAmount || 0)
  const isEmpty = computed(() => !items.value.length)

  // Actions
  const loadCart = async () => {
    try {
      isLoading.value = true
      error.value = null

      cart.value = await cartService.getCart()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de chargement du panier'
      console.error('Load cart error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addToCart = async (productId: number, quantity: number = 1, options: any = {}) => {
    try {
      error.value = null

      // Check if item already exists in cart
      const existingItem = items.value.find((item) => item.productId === productId)

      if (existingItem && !options.offerId) {
        // Update quantity (only if not a specific offer)
        const newQuantity = existingItem.quantity + quantity
        cart.value = await cartService.updateQuantity(existingItem.id, newQuantity)
      } else {
        // Add new item (or new offer)
        cart.value = await cartService.addToCart(productId, quantity, options)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur d'ajout au panier"
      throw err
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      error.value = null

      cart.value = await cartService.updateQuantity(itemId, quantity)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de mise à jour'
      throw err
    }
  }

  const removeFromCart = async (itemId: number) => {
    try {
      error.value = null

      cart.value = await cartService.removeFromCart(itemId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de suppression'
      throw err
    }
  }

  const clearCart = async () => {
    try {
      isLoading.value = true
      error.value = null

      await cartService.clearCart()
      cart.value = null
      selectedItems.value = new Set()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de vidage du panier'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const applyPromoCode = async (code: string) => {
    try {
      isLoading.value = true
      error.value = null

      cart.value = await cartService.applyPromoCode(code)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Code promo invalide'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getItemQuantity = (productId: number) => {
    const item = items.value.find((item) => item.productId === productId)
    return item?.quantity || 0
  }

  const isInCart = (productId: number) => {
    return items.value.some((item) => item.productId === productId)
  }

  const clearError = () => {
    error.value = null
  }

  // Selection Actions
  const toggleSelection = (itemId: number) => {
    const next = new Set(selectedItems.value)
    if (next.has(itemId)) {
      next.delete(itemId)
    } else {
      next.add(itemId)
    }
    selectedItems.value = next
  }

  const selectAll = () => {
    selectedItems.value = new Set(items.value.map(item => item.id))
  }

  const clearSelection = () => {
    selectedItems.value = new Set()
  }

  const isSelected = (itemId: number) => {
    return selectedItems.value.has(itemId)
  }

  return {
    // State
    cart,
    isLoading,
    error,

    // Getters
    items,
    itemCount,
    subtotal,
    isEmpty,

    // Actions
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    getItemQuantity,
    isInCart,
    clearError,

    // Selection
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected
  }
})
