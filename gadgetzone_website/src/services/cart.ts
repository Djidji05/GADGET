import api from './api'

export interface CartItem {
  id: number
  productId: number
  offerId?: number
  offer?: {
    id: number
    name?: string
    Store?: {
      id: number
      name: string
    }
  }
  product: {
    id: number
    slug?: string
    name: string
    description?: string
    price: number
    image?: string
  }
  quantity: number
  subtotal: number
}


export interface Cart {
  id: number
  customerId: number
  items: CartItem[]
  totalAmount: number
  createdAt: string
  updatedAt: string
  promoInfo?: {
    code: string
    discount: number
    discountType: 'percentage' | 'fixed'
    discountAmount: number
  }
}

export const cartService = {
  // Obtenir le panier du client
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart')
    return response.data
  },

  // Ajouter un produit au panier
  addToCart: async (productId: number, quantity: number = 1, options: any = {}): Promise<Cart> => {
    const response = await api.post('/cart/add', { productId, quantity, ...options })
    return response.data
  },

  // Mettre à jour la quantité d'un article
  updateQuantity: async (itemId: number, quantity: number): Promise<Cart> => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity })
    return response.data
  },

  // Supprimer un article du panier
  removeFromCart: async (itemId: number): Promise<Cart> => {
    const response = await api.delete(`/cart/items/${itemId}`)
    return response.data
  },

  // Vider le panier
  clearCart: async (): Promise<void> => {
    await api.delete('/cart/clear')
  },

  // Appliquer un code promo
  applyPromoCode: async (code: string): Promise<Cart> => {
    const response = await api.post('/cart/promo', { code })
    return response.data
  },

  // Calculer le total avec taxes et frais
  calculateTotal: async (cart: Cart): Promise<{
    subtotal: number
    tax: number
    shipping: number
    total: number
  }> => {
    const response = await api.post('/cart/calculate', { items: cart.items })
    return response.data
  }
}
