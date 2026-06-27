import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

interface LoyaltyAccount {
    points_balance: number
    lifetime_points: number
    level: 'Bronze' | 'Silver' | 'Gold' | 'Diamond'
    next_level: { name: string; threshold: number } | null
    redeem_value: number
}

interface LoyaltyTransaction {
    id: number
    points_earned: number
    points_spent: number
    reason: string
    description: string
    created_at: string
}

interface Achievement {
    id: number
    code: string
    name: string
    description: string
    icon: string
    points_reward: number
    tier_required: string
    unlocked: boolean
}

interface LeaderboardUser {
    rank: number
    name: string
    email: string
    lifetime_points: number
    tier: string
}

export const useLoyaltyStore = defineStore('loyalty', () => {
    const account = ref<LoyaltyAccount | null>(null)
    const transactions = ref<LoyaltyTransaction[]>([])
    const achievements = ref<Achievement[]>([])
    const leaderboard = ref<LeaderboardUser[]>([])
    const isLoading = ref(false)
    const pendingPoints = ref(0) // Points gagnés mais pas encore vus (pour animation)

    const fetchLoyalty = async () => {
        isLoading.value = true
        try {
            const { data } = await api.get('/loyalty/me')
            account.value = data.account
            transactions.value = data.transactions
        } catch (err) {
            console.error('Erreur chargement fidélité:', err)
        } finally {
            isLoading.value = false
        }
    }

    const fetchAchievements = async () => {
        try {
            const { data } = await api.get('/loyalty/achievements')
            achievements.value = data
        } catch (err) {
            console.error('Erreur chargement badges:', err)
        }
    }

    const fetchLeaderboard = async () => {
        try {
            const { data } = await api.get('/loyalty/leaderboard')
            leaderboard.value = data
        } catch (err) {
            console.error('Erreur chargement leaderboard:', err)
        }
    }

    const calculateRedeem = async (orderTotal: number) => {
        try {
            const { data } = await api.post('/loyalty/redeem/calculate', { order_total: orderTotal })
            return data
        } catch {
            return { discount: 0, points_to_use: 0, points_balance: 0 }
        }
    }

    const levelColor = computed(() => {
        if (!account.value) return 'text-gray-500'
        return account.value.level === 'Diamond' ? 'text-indigo-500'
             : account.value.level === 'Gold' ? 'text-yellow-500'
             : account.value.level === 'Silver' ? 'text-slate-400'
             : 'text-amber-600'
    })

    const levelIcon = computed(() => {
        if (!account.value) return 'fas fa-medal'
        return account.value.level === 'Diamond' ? 'fas fa-gem'
             : account.value.level === 'Gold' ? 'fas fa-crown'
             : account.value.level === 'Silver' ? 'fas fa-medal'
             : 'fas fa-award'
    })

    // Appelé quand le SSE reçoit points_earned
    const addPendingPoints = (points: number) => {
        pendingPoints.value += points
        // Rafraîchir le compte après 2 secondes pour afficher le nouveau solde
        setTimeout(() => { fetchLoyalty(); pendingPoints.value = 0 }, 2000)
    }

    return {
        account, transactions, achievements, leaderboard, isLoading, pendingPoints,
        levelColor, levelIcon,
        fetchLoyalty, fetchAchievements, fetchLeaderboard, calculateRedeem, addPendingPoints
    }
})
