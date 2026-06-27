import api from './api'

export interface Product {
  id: number
  slug?: string
  name: string
  description: string
  price: number
  original_price?: number
  category?: string
  category_id?: number
  stock: number
  image?: string
  image_url?: string
  images?: (string | { url: string; fallback: string })[]
  features?: string[]
  specifications?: Record<string, string>
  isActive: boolean
  createdAt: string
  updatedAt: string
  seller_id: number
  store?: {
    id: number
    name: string
  }
  rating?: number
  reviewCount?: number
  buyBox?: any
  offers?: any[]
}

export interface Category {
  id: number
  name: string
  description?: string
  image?: string
  parentId?: number | null
  parent_id?: number | null
}

export interface Store {
  id: number
  slug?: string
  name: string
  description?: string
  logoUrl?: string
  bannerUrl?: string
  averageRating?: string
  reviewCount?: number
  shippingSpeed?: number
  follower_count?: number
  trust_score?: number
  isFollowing?: boolean
}

export const productsService = {
  // Obtenir tous les produits
  getProducts: async (params?: {
    category?: string
    brand?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    page?: number
    limit?: number
    sortBy?: 'name' | 'price' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
    is_new?: boolean
    promotions?: boolean
    vendor?: number | string
    lat?: number
    lng?: number
  }) => {
    const response = await api.get('/products', { params })
    return response.data
  },

  // Obtenir un produit par ID ou Slug
  getProduct: async (id: number | string) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // Obtenir les catégories
  getCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  },

  // Rechercher des produits
  searchProducts: async (query: string, lat?: number, lng?: number) => {
    const response = await api.get('/products/search', { params: { q: query, lat, lng } })
    return response.data
  },

  // Obtenir les produits vedettes
  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured')
    return response.data
  },

  // Obtenir les produits par catégorie
  getProductsByCategory: async (categoryId: number) => {
    const response = await api.get('/products', { params: { category: categoryId } })
    return response.data.products || response.data
  },

  // Obtenir les marques
  getBrands: async () => {
    const response = await api.get('/brands')
    return response.data
  },

  // Obtenir les vendeurs (Stores)
  getVendors: async () => {
    const response = await api.get('/vendors')
    return response.data
  },

  // Obtenir un vendeur par ID
  getVendor: async (id: number | string) => {
    const response = await api.get(`/vendors/${id}`)
    return response.data
  },

  // Avis (Reviews)
  getReviews: async (productId: number) => {
    const response = await api.get(`/reviews/product/${productId}`)
    return response.data
  },

  addReview: async (reviewData: { product_id: number; rating: number; comment?: string; images?: string[] }) => {
    const response = await api.post('/reviews', reviewData)
    return response.data
  },

  voteReview: async (reviewId: number, vote: 'helpful' | 'not_helpful') => {
    const response = await api.post(`/reviews/${reviewId}/vote`, { vote })
    return response.data
  },
  
  // Suivre une boutique
  followStore: async (storeId: number | string) => {
    const response = await api.post(`/vendors/${storeId}/follow`)
    return response.data
  },

  unfollowStore: async (storeId: number | string) => {
    const response = await api.delete(`/vendors/${storeId}/follow`)
    return response.data
  }
}
