import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productsService, type Product, type Category } from '@/services/products'
import {
  fallbackFeaturedProducts,
  fallbackCategories,
  isValidApiResponse,
} from '@/services/fallback'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const brands = ref<any[]>([])
  const featuredProducts = ref<Product[]>([])
  const newProducts = ref<Product[]>([])
  const activeVendors = ref<any[]>([])
  const activeRequests = ref(0)
  const isLoading = computed(() => activeRequests.value > 0)
  const error = ref<string | null>(null)
  const usingFallback = ref(false)
  
  const startLoading = () => { activeRequests.value++ }
  const stopLoading = () => { activeRequests.value = Math.max(0, activeRequests.value - 1) }

  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = ref(1000) // Changed from 12 to 1000 to load all products
  const totalItems = ref(0)

  // Filters
  const searchQuery = ref('')
  const selectedCategory = ref<number | null>(null)
  const selectedBrand = ref<number | null>(null)
  const selectedVendor = ref<number | string | null>(null)
  const productIds = ref<number[] | null>(null)
  const minPrice = ref<number | null>(null)
  const maxPrice = ref<number | null>(null)
  const isPromotions = ref(false)
  const sortBy = ref('name')
  const sortOrder = ref<'asc' | 'desc'>('asc')
  const userLat = ref<number | null>(null)
  const userLng = ref<number | null>(null)

  // Getters
  const hasProducts = computed(() => products.value.length > 0)
  const hasCategories = computed(() => categories.value.length > 0)
  const hasFeaturedProducts = computed(() => featuredProducts.value.length > 0)
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
  const isUsingFallback = computed(() => usingFallback.value)

  const filteredProducts = computed(() => {
    return products.value
  })

  // Actions
  const loadProducts = async (page = 1, filters?: { search?: string; category?: number; brand?: number; minPrice?: number; maxPrice?: number }) => {
    try {
      console.log('📦 Loading products...')
      startLoading()
      error.value = null
      usingFallback.value = false

      const response = await productsService.getProducts({
        category: filters?.category?.toString() || selectedCategory.value?.toString(),
        brand: filters?.brand?.toString() || selectedBrand.value?.toString(),
        minPrice: filters?.minPrice || minPrice.value || undefined,
        maxPrice: filters?.maxPrice || maxPrice.value || undefined,
        search: filters?.search || searchQuery.value,
        promotions: isPromotions.value,
        vendor: selectedVendor.value || undefined,
        page,
        limit: itemsPerPage.value,
        lat: userLat.value || undefined,
        lng: userLng.value || undefined,
      })
      console.log('📦 Products response:', response)

      // Vérifier si la réponse est valide
      if (isValidApiResponse(response) && response.products && Array.isArray(response.products)) {
        // Si aucun filtre n'est appliqué et que l'API ne renvoie rien, on suppose que la DB est vide
        // et on utilise les données de fallback pour la démo
        const hasFilters = (filters?.search || searchQuery.value) ||
          (filters?.category || selectedCategory.value) ||
          (filters?.brand || selectedBrand.value) ||
          isPromotions.value ||
          minPrice.value !== null ||
          maxPrice.value !== null

        if (response.products.length === 0 && !hasFilters) {
          console.warn('⚠️ Empty database detected, switching to fallback data')
          throw new Error('Empty database')
        }

        products.value = response.products
        totalItems.value = response.pagination?.total || response.products.length
        currentPage.value = page
        console.log('✅ Products loaded from API:', response.products.length)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Products API failed, using fallback')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value =
        errorResponse.response?.data?.message ||
        'API indisponible - utilisation des données locales'

      // Utiliser les fallbacks
      products.value = fallbackFeaturedProducts
      totalItems.value = fallbackFeaturedProducts.length
      usingFallback.value = true
      console.log('✅ Fallback products loaded:', fallbackFeaturedProducts.length)
    } finally {
      stopLoading()
    }
  }

  const loadProduct = async (id: number | string) => {
    try {
      console.log('📦 Loading product:', id)
      startLoading()
      error.value = null

      const product = await productsService.getProduct(id)
      console.log('📦 Product response:', product)

      if (isValidApiResponse(product) && product.id) {
        return product
      } else {
        throw new Error('Product not found')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Product API failed, using fallback')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value = errorResponse.response?.data?.message || 'Produit non trouvé'

      // Chercher dans les fallbacks
      const fallbackProduct = fallbackFeaturedProducts.find((p) => p.id === Number(id))
      if (fallbackProduct) {
        return fallbackProduct
      }

      throw err
    } finally {
      stopLoading()
    }
  }

  const loadCategories = async () => {
    try {
      console.log('📂 Loading categories...')
      startLoading()
      error.value = null
      usingFallback.value = false

      const categoriesResponse = await productsService.getCategories()
      console.log('📂 Categories response:', categoriesResponse)

      // Vérifier si la réponse est valide
      if (isValidApiResponse(categoriesResponse) && Array.isArray(categoriesResponse)) {
        categories.value = categoriesResponse
        console.log('✅ Categories loaded from API:', categoriesResponse.length)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Categories API failed, using fallback')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value =
        errorResponse.response?.data?.message ||
        'API indisponible - utilisation des données locales'

      // Utiliser les fallbacks
      categories.value = fallbackCategories
      usingFallback.value = true
      console.log('✅ Fallback categories loaded:', fallbackCategories.length)
    } finally {
      stopLoading()
    }
  }

  const loadBrands = async () => {
    try {
      console.log('🏷️ Loading brands...')
      startLoading()
      error.value = null
      usingFallback.value = false

      const response = await productsService.getBrands()
      console.log('🏷️ Brands response:', response)

      if (isValidApiResponse(response) && Array.isArray(response)) {
        brands.value = response
        console.log('✅ Brands loaded from API:', response.length)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Brands API failed, using fallback')
      // Fallback logic if needed
      brands.value = []
    } finally {
      stopLoading()
    }
  }

  const loadActiveVendors = async () => {
    try {
      console.log('🏪 Loading active vendors...')
      startLoading()
      error.value = null

      const response = await productsService.getVendors()
      console.log('🏪 Vendors response:', response)

      if (isValidApiResponse(response) && Array.isArray(response)) {
        activeVendors.value = response
        console.log('✅ Vendors loaded from API:', response.length)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Vendors API failed')
      activeVendors.value = []
    } finally {
      stopLoading()
    }
  }

  const loadFeaturedProducts = async () => {
    try {
      console.log('⭐ Loading featured products...')
      startLoading()
      error.value = null
      usingFallback.value = false

      // If no localStorage products, try API
      const response = await productsService.getProducts({ 
        limit: 12,
        lat: userLat.value || undefined,
        lng: userLng.value || undefined
      })
      console.log('⭐ Featured products response:', response)

      if (isValidApiResponse(response) && Array.isArray(response)) {
        if (response.length === 0) {
          // Keep empty if API returns empty, don't force fallback immediately unless error
          console.log('⭐ No featured products found in API')
        }
        featuredProducts.value = response
        console.log('✅ Featured products loaded from API:', response.length)
      } else if (isValidApiResponse(response) && response.products && Array.isArray(response.products)) {
        // Handle paginated response if any
        featuredProducts.value = response.products
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Featured products API failed', err)
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value =
        errorResponse.response?.data?.message ||
        'Impossible de charger les produits vedettes'

      // Ne plus utiliser de fallback (Demande utilisateur)
      featuredProducts.value = []
      usingFallback.value = false
    } finally {
      stopLoading()
    }
  }

  const loadNewProducts = async () => {
    try {
      console.log('🆕 Loading new products...')
      startLoading()
      error.value = null
      usingFallback.value = false

      // Fetch latest 12 products (regardless of is_new flag) to ensure auto-update
      const response = await productsService.getProducts({ 
        limit: 12,
        lat: userLat.value || undefined,
        lng: userLng.value || undefined
      })
      console.log('🆕 New products response:', response)

      if (isValidApiResponse(response) && response.products && Array.isArray(response.products)) {
        newProducts.value = response.products
        console.log('✅ New products loaded from API:', response.products.length)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ New products API failed, using fallback')
      // Fallback logic if needed
      newProducts.value = []
    } finally {
      stopLoading()
    }
  }

  const searchProducts = async (query: string) => {
    try {
      console.log('🔍 Searching products:', query)
      startLoading()
      error.value = null

      const results = await productsService.searchProducts(query, userLat.value || undefined, userLng.value || undefined)
      console.log('🔍 Search results:', results)

      if (isValidApiResponse(results) && Array.isArray(results)) {
        return results
      } else {
        throw new Error('Invalid search response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Search API failed, using local search')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value = errorResponse.response?.data?.message || 'Recherche indisponible'

      // Fallback: chercher localement
      return fallbackFeaturedProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase()),
      )
    } finally {
      stopLoading()
    }
  }

  const loadProductsByCategory = async (categoryId: number) => {
    try {
      console.log('📦 Loading products by category:', categoryId)
      startLoading()
      error.value = null

      const products = await productsService.getProductsByCategory(categoryId)
      console.log('📦 Category products response:', products)

      if (isValidApiResponse(products) && Array.isArray(products)) {
        return products
      } else {
        throw new Error('Invalid category response')
      }
    } catch (err: unknown) {
      console.warn('⚠️ Category products API failed, using local filter')
      const errorResponse = err as { response?: { data?: { message?: string } } }
      error.value = errorResponse.response?.data?.message || 'Catégorie indisponible'

      // Fallback: filtrer localement
      return fallbackFeaturedProducts.filter((product) => product.category_id === categoryId)
    } finally {
      stopLoading()
    }
  }

  const setFilters = (filters: {
    search?: string
    category?: number
    brand?: number
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    promotions?: boolean
  }) => {
    if (filters.search !== undefined) searchQuery.value = filters.search
    if (filters.category !== undefined) selectedCategory.value = filters.category
    if (filters.brand !== undefined) selectedBrand.value = filters.brand
    if (filters.minPrice !== undefined) minPrice.value = filters.minPrice
    if (filters.maxPrice !== undefined) maxPrice.value = filters.maxPrice
    if (filters.sortBy !== undefined) sortBy.value = filters.sortBy
    if (filters.sortOrder !== undefined) sortOrder.value = filters.sortOrder
    if (filters.promotions !== undefined) isPromotions.value = filters.promotions
  }

  const setCoordinates = (lat: number | null, lng: number | null) => {
    userLat.value = lat;
    userLng.value = lng;
  }

  const clearError = () => {
    error.value = null
  }

  const setPage = (page: number) => {
    currentPage.value = page
  }

  const resetFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = null
    selectedBrand.value = null
    selectedVendor.value = null
    minPrice.value = null
    maxPrice.value = null
    isPromotions.value = false
    sortBy.value = 'name'
    sortOrder.value = 'asc'
  }

  // Pagination computed
  const hasPrevPage = computed(() => currentPage.value > 1)
  const hasNextPage = computed(() => currentPage.value < totalPages.value)

  return {
    // State
    products,
    categories,
    brands,
    featuredProducts,
    newProducts,
    activeVendors,
    isLoading,
    error,
    usingFallback,
    currentPage,
    itemsPerPage,
    totalItems,
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedVendor,
    productIds,
    minPrice,
    maxPrice,
    isPromotions,
    sortBy,
    sortOrder,
    userLat,
    userLng,

    // Getters
    hasProducts,
    hasCategories,
    hasFeaturedProducts,
    totalPages,
    filteredProducts,
    isUsingFallback,
    hasPrevPage,
    hasNextPage,

    // Actions
    loadProducts,
    loadProduct,
    loadCategories,
    loadBrands,
    loadFeaturedProducts,
    loadNewProducts,
    loadActiveVendors,
    searchProducts,
    loadProductsByCategory,
    setFilters,
    setCoordinates,
    clearError,
    setPage,
    resetFilters,
  }
})
