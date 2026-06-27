import api from './api'

export interface Boost {
    id: number
    productId: number
    package_name: string
    amount: number
    duration_days: number
    status: 'pending' | 'active' | 'expired' | 'cancelled'
    startsAt?: string
    endsAt?: string
    created_at: string
    product?: {
        name: string
        image_url: string
    }
}

export interface ForumPost {
    id: number
    author: string
    avatar: string
    time: string
    title: string
    content: string
    comments: number
    likes: number
    hasLiked?: boolean
}

export interface ForumStats {
    totalMembers: number | string
    activeMembers: number
    experts: number
}

export const vendorService = {
    // Obtenir les produits du vendeur connecté
    getMyProducts: async () => {
        const response = await api.get('/vendors/me/products')
        return response.data
    },

    // Créer une demande de boost
    createBoost: async (productId: number, packageName: string, adData: { costModel?: string; budget?: number; targetCategories?: string[] } = {}) => {
        const response = await api.post('/vendors/me/boost', { productId, packageName, ...adData })
        return response.data
    },

    // Obtenir les boosts du vendeur
    getMyBoosts: async () => {
        const response = await api.get('/vendors/me/boosts')
        return response.data
    },

    // --- COMMUNITY FORUM ---

    getCommunityStats: async (): Promise<ForumStats> => {
        const response = await api.get('/vendors/me/community/stats')
        return response.data
    },

    getCommunityPosts: async (limit = 20, offset = 0): Promise<ForumPost[]> => {
        const response = await api.get('/vendors/me/community/posts', { params: { limit, offset } })
        return response.data
    },

    getCommunityPostDetails: async (postId: number) => {
        const response = await api.get(`/vendors/me/community/posts/${postId}/comments`)
        return response.data
    },

    createCommunityPost: async (title: string, content: string) => {
        const response = await api.post('/vendors/me/community/posts', { title, content })
        return response.data
    },

    addCommunityComment: async (postId: number, content: string) => {
        const response = await api.post(`/vendors/me/community/posts/${postId}/comments`, { content })
        return response.data
    },

    toggleCommunityLike: async (postId: number) => {
        const response = await api.post(`/vendors/me/community/posts/${postId}/like`)
        return response.data
    }
}
