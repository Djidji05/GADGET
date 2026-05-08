import api from './api'

export interface OrderItem {
  id: number
  productId: number
  product: {
    id: number
    name: string
    price: number
    image_url?: string
  }
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface ShippingAddress {
  street: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

export interface PaymentMethod {
  type: 'natcash' | 'moncashwise' | 'visa' | 'zelle'
  details?: any
}

export interface CreateOrderData {
  userId: number
  items: {
    productId: number
    offerId?: number
    quantity: number
  }[]
  shippingAddress: ShippingAddress
  shippingCoordinates?: { lat: number; lng: number } | null
  referencePoint?: string
  paymentMethod: PaymentMethod
  promoCode?: string
}

export interface Order {
  id: number
  orderNumber: string
  customerId: number
  offerId?: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  subtotal: number
  tax: number
  shipping: number
  total: number
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingNumber?: string
  deliveryToken?: string
  user?: any
  delivered_at?: string
}

export interface CheckoutSummary {
  id: number
  orderIds: number[]
  totalOrders: number
  totalAmount: number
}


// Convert backend snake_case to frontend camelCase
const mapOrderResponse = (data: any): Order => {
  return {
    ...data,
    shippingAddress: typeof data.shipping_address === 'string'
      ? JSON.parse(data.shipping_address)
      : data.shipping_address,
    paymentMethod: typeof data.payment_method === 'string'
      ? JSON.parse(data.payment_method)
      : (data.payment_method || { type: 'card', details: {} }), // Safe fallback
    orderNumber: data.order_number || data.orderNumber, // Handle both cases just to be safe
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt,
    estimatedDelivery: data.estimated_delivery,
    trackingNumber: data.tracking_number,
    deliveryToken: data.delivery_token,
    subtotal: Number(data.subtotal || 0),
    tax: Number(data.tax || 0),
    shipping: Number(data.shipping || 0),
    total: Number(data.total_amount || data.total || 0),

    // Map items if structure matches backend response
    items: data.items?.map((item: any) => ({
      ...item,
      productId: item.product_id,
      unitPrice: item.unit_price || item.price || item.unitPrice,
      product: {
        ...item.product,
        image_url: item.product?.image_url || item.product?.image
      }
    })) || []
  }
}

export const ordersService = {
  // Créer une nouvelle commande (retourne un sommaire si multi-vendeurs)
  createOrder: async (data: CreateOrderData): Promise<CheckoutSummary> => {
    // Map to snake_case for backend
    const payload = {
      user_id: data.userId,
      items: data.items.map(item => ({
        product_id: item.productId,
        offer_id: item.offerId,
        quantity: item.quantity
      })),

      shipping_address: data.shippingAddress,
      shipping_coordinates: data.shippingCoordinates,
      reference_point: data.referencePoint,
      payment_method: data.paymentMethod
    }

    const response = await api.post('/orders', payload)
    return response.data as CheckoutSummary
  },

  // Obtenir les commandes du client
  getCustomerOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/my-orders')
    return response.data.map(mapOrderResponse)
  },

  // Obtenir une commande par ID
  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`)
    return mapOrderResponse(response.data)
  },

  // Annuler une commande
  cancelOrder: async (id: number): Promise<Order> => {
    const response = await api.put(`/orders/${id}/cancel`)
    return mapOrderResponse(response.data)
  },

  // Suivre une commande
  trackOrder: async (trackingNumber: string): Promise<Order> => {
    const response = await api.get(`/orders/track/${trackingNumber}`)
    return mapOrderResponse(response.data)
  },

  // Mettre à jour le statut de la commande (admin only)
  updateOrderStatus: async (id: number, status: Order['status']): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, { status })
    return mapOrderResponse(response.data)
  }
}
