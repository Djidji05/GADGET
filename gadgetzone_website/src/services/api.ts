import axios from 'axios'

// Configuration de l'API pour se connecter au backend de HTFasil Admin
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar_url?: string
  phone?: string
  role?: string
}

// === SERVICES ADRESSES ===
export interface Address {
  id: number
  name?: string
  street: string
  quartier: string
  city: string
  country: string
  whatsapp?: string
  note?: string
  is_default: boolean
}

export const addressService = {
  getAll: async () => {
    const response = await api.get('/addresses')
    return response.data
  },
  create: async (data: Partial<Address>) => {
    const response = await api.post('/addresses', data)
    return response.data
  },
  update: async (id: number, data: Partial<Address>) => {
    const response = await api.put(`/addresses/${id}`, data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete(`/addresses/${id}`)
    return response.data
  }
}

export const messageService = {
  getConversations: async () => {
    const response = await api.get('/messages/conversations')
    return response.data
  },
  getConversationMessages: async (id: number) => {
    const response = await api.get(`/messages/conversations/${id}/messages`)
    return response.data
  },
  sendMessage: async (receiverId: number, content: string) => {
    const response = await api.post('/messages/send', { receiverId, content })
    return response.data
  }
}

export const pagesService = {
  getBySlug: async (slug: string) => {
    const response = await api.get(`/pages/${slug}`)
    return response.data
  },
  getAll: async () => {
    const response = await api.get('/pages')
    return response.data
  }
}

export const settingsService = {
  get: async (group: string) => {
    const response = await api.get(`/settings/${group}`)
    return response.data
  },
  update: async (group: string, settings: any) => {
    const response = await api.put(`/settings/${group}`, settings)
    return response.data
  }
}

export const disputeService = {
  getDisputes: async () => {
    const response = await api.get('/disputes')
    return response.data
  },
  getSellerDisputes: async () => {
    const response = await api.get('/disputes/seller')
    return response.data
  },
  getDispute: async (id: number) => {
    const response = await api.get(`/disputes/${id}`)
    return response.data
  },
  createDispute: async (data: any) => {
    const response = await api.post('/disputes', data)
    return response.data
  },
  addMessage: async (id: number, content: string) => {
    const response = await api.post(`/disputes/${id}/messages`, { content })
    return response.data
  }
}

export const ambassadorService = {
  getStats: async () => {
    const response = await api.get('/ambassador/stats')
    return response.data
  },
  apply: async () => {
    const response = await api.post('/ambassador/apply')
    return response.data
  },
  getReferrals: async () => {
    const response = await api.get('/ambassador/referrals')
    return response.data
  }
}

export const uploadService = {
  upload: async (files: File[]) => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('images', file)
    })
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export const statsService = {
  track: async (data: { path: string; referrer: string; session_id?: string }) => {
    try {
      // Échec silencieux possible car c'est facultatif
      await api.post('/stats/track', data)
    } catch (e) {
      console.warn('Analytics track failed', e)
    }
  }
}

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('customer_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_data')

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export * from './products'
export * from './orders'
export * from './promotions'
export * from './payment'
export * from './vendor'

export default api
