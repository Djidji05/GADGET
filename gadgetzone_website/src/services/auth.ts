import api from './api'

export interface Customer {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  country?: string
  isActive: boolean
  createdAt: string
  role?: string
  avatar_url?: string
  two_factor_enabled?: boolean
  notif_email?: boolean
  notif_push?: boolean
  notif_sms?: boolean
  storeId?: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface AuthResponse {
  customer: Customer
  token: string
}

export const authService = {
  // Inscription
  // Inscription
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return {
      customer: response.data.user,
      token: response.data.token
    }
  },

  // Connexion
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    return {
      customer: response.data.user,
      token: response.data.token
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      // Tenter l'appel API mais ignorer l'erreur si l'API n'existe pas
      try {
        await api.post('/auth/logout')
      } catch (apiError) {
        console.log('API logout not available, clearing local data only')
      }
    } finally {
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_data')
    }
  },

  // Obtenir le profil client
  getProfile: async (): Promise<Customer> => {
    const response = await api.get('/auth/profile')
    // Le backend renvoie { message: '...', user: {...} } d'après auth.js
    return response.data.user
  },

  // Mettre à jour le profil
  updateProfile: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await api.put('/auth/profile', data)
    return response.data.user
  },

  // Vérifier si le token est valide
  verifyToken: async (): Promise<boolean> => {
    try {
      await api.get('/auth/verify')
      return true
    } catch {
      return false
    }
  },

  // Sauvegarder les données dans localStorage
  saveAuthData: (authData: AuthResponse) => {
    localStorage.setItem('customer_token', authData.token)
    localStorage.setItem('customer_data', JSON.stringify(authData.customer))
  },

  // Obtenir les données depuis localStorage
  getStoredAuthData: (): AuthResponse | null => {
    const token = localStorage.getItem('customer_token')
    const customerData = localStorage.getItem('customer_data')

    if (token && customerData) {
      try {
        return {
          token,
          customer: JSON.parse(customerData),
        }
      } catch {
        return null
      }
    }
    return null
  },

  // --- Double Authentification (2FA) ---
  
  // Vérifier le code 2FA pour finaliser la connexion
  verify2FA: async (email: string, code: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-2fa', { email, code })
    return {
      customer: response.data.user,
      token: response.data.token
    }
  },

  // Initier le setup 2FA
  setup2FA: async () => {
    return await api.post('/auth/2fa/setup')
  },

  // Vérifier et activer le 2FA
  verifyEnable2FA: async (code: string) => {
    return await api.post('/auth/2fa/verify-enable', { code })
  },

  // Désactiver le 2FA
  disable2FA: async (password: string) => {
    return await api.post('/auth/2fa/disable', { password })
  }
}
