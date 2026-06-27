<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 pb-32 pt-4">
    <div class="container mx-auto px-4 max-w-2xl">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
          <i class="fas fa-arrow-left text-sm"></i>
        </button>
        <div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Mes Points HTF</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">Programme de fidélité</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loyaltyStore.isLoading" class="space-y-4">
        <div class="h-48 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
        <div class="h-32 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
      </div>

      <template v-else-if="loyaltyStore.account">
        <!-- Balance Card -->
        <div class="relative rounded-3xl overflow-hidden mb-6 shadow-xl"
             :class="loyaltyStore.account.level === 'Diamond' ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-200 dark:shadow-none'
                   : loyaltyStore.account.level === 'Gold' ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-amber-200 dark:shadow-none'
                   : loyaltyStore.account.level === 'Silver' ? 'bg-gradient-to-br from-slate-400 to-slate-600 shadow-slate-200 dark:shadow-none'
                   : 'bg-gradient-to-br from-amber-600 to-amber-800 shadow-amber-900/25 dark:shadow-none'">
          <div class="p-8 text-white relative z-10">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <i :class="[loyaltyStore.levelIcon, 'text-3xl']"></i>
                <div>
                  <p class="text-xs opacity-80 uppercase tracking-widest font-bold">Niveau</p>
                  <p class="text-xl font-black">{{ loyaltyStore.account.level }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs opacity-80 uppercase tracking-widest font-bold">Solde</p>
                <p class="text-4xl font-black">{{ loyaltyStore.account.points_balance.toLocaleString() }}</p>
                <p class="text-xs opacity-70">points HTF</p>
              </div>
            </div>

            <!-- Progression vers niveau suivant -->
            <div v-if="loyaltyStore.account.next_level">
              <div class="flex justify-between text-xs opacity-80 mb-1">
                <span>{{ loyaltyStore.account.level }}</span>
                <span>{{ loyaltyStore.account.next_level.name }} ({{ loyaltyStore.account.next_level.threshold.toLocaleString() }} pts)</span>
              </div>
              <div class="h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-white rounded-full transition-all duration-1000"
                  :style="{ width: Math.min(100, (loyaltyStore.account.lifetime_points / loyaltyStore.account.next_level.threshold) * 100) + '%' }"
                ></div>
              </div>
              <p class="text-[10px] opacity-70 mt-1">{{ loyaltyStore.account.next_level.threshold - loyaltyStore.account.lifetime_points }} points pour atteindre {{ loyaltyStore.account.next_level.name }}</p>
            </div>
            <div v-else class="text-center">
              <p class="text-sm font-bold opacity-90">🎉 Niveau maximum atteint ! Bienvenue au club d'élite.</p>
            </div>
          </div>
          <i class="fas fa-crown absolute -right-6 -bottom-4 text-[140px] text-white/10 rotate-12"></i>
        </div>

        <!-- Valeur de la réduction disponible -->
        <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-amber-100 dark:border-gray-800 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-gray-700 dark:text-gray-300">Valeur de vos points</p>
              <p class="text-xs text-gray-400 dark:text-gray-500">Utilisable à votre prochain achat (max 50% de la commande)</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-black text-amber-600 dark:text-amber-400">{{ loyaltyStore.account.redeem_value }} HTG</p>
              <p class="text-[10px] text-gray-400 dark:text-gray-500">{{ Math.floor(loyaltyStore.account.points_balance / 100) * 100 }} pts utilisables</p>
            </div>
          </div>
          <div class="mt-4 bg-amber-50 dark:bg-amber-950/25 rounded-2xl p-3 text-xs text-amber-700 dark:text-amber-400">
            <i class="fas fa-info-circle mr-1"></i>
            100 points = 5 HTG de réduction. Les points sont automatiquement appliqués au checkout.
          </div>
        </div>

        <!-- Tabs Selector -->
        <div class="flex bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur p-1 rounded-2xl mb-6">
          <button 
            @click="activeTab = 'history'" 
            :class="activeTab === 'history' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-450 hover:text-gray-900 dark:hover:text-white'"
            class="flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <i class="fas fa-history"></i>
            <span>Historique</span>
          </button>
          <button 
            @click="activeTab = 'badges'" 
            :class="activeTab === 'badges' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-450 hover:text-gray-900 dark:hover:text-white'"
            class="flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <i class="fas fa-trophy"></i>
            <span>Badges</span>
          </button>
          <button 
            @click="activeTab = 'leaderboard'" 
            :class="activeTab === 'leaderboard' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-450 hover:text-gray-900 dark:hover:text-white'"
            class="flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <i class="fas fa-crown"></i>
            <span>Classement</span>
          </button>
        </div>

        <!-- History Tab -->
        <div v-if="activeTab === 'history'" class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div v-if="loyaltyStore.transactions.length === 0" class="text-center py-12 text-gray-400 dark:text-gray-600">
            <i class="fas fa-history text-3xl mb-3 block text-gray-200 dark:text-gray-800"></i>
            Aucune transaction pour l'instant
          </div>
          <div v-else class="divide-y divide-gray-50 dark:divide-gray-800">
            <div 
              v-for="tx in loyaltyStore.transactions" 
              :key="tx.id"
              class="flex items-center gap-4 px-5 py-4"
            >
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :class="tx.points_earned > 0 ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400'"
              >
                <i :class="tx.points_earned > 0 ? 'fas fa-plus' : 'fas fa-minus'" class="text-xs"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 dark:text-gray-250 truncate">{{ tx.description || tx.reason }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">{{ new Date(tx.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) }}</p>
              </div>
              <div class="text-right font-black" :class="tx.points_earned > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'">
                {{ tx.points_earned > 0 ? '+' + tx.points_earned : '-' + tx.points_spent }} pts
              </div>
            </div>
          </div>
        </div>

        <!-- Badges Tab -->
        <div v-if="activeTab === 'badges'" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="badge in loyaltyStore.achievements" 
              :key="badge.id"
              :class="badge.unlocked ? 'bg-white dark:bg-gray-900 border-amber-200 dark:border-amber-900/50 shadow-md shadow-amber-50/20' : 'bg-gray-50/60 dark:bg-gray-950 border-gray-100 dark:border-gray-900 opacity-60'"
              class="relative rounded-3xl p-5 border transition-all duration-300 hover:scale-[1.02] flex gap-4"
            >
              <!-- Icon Container -->
              <div 
                :class="badge.unlocked ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-100 dark:shadow-none' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600'"
                class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-bold transition-all"
              >
                <i :class="'fas fa-' + (badge.icon || 'medal')"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h4 class="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{{ badge.name }}</h4>
                  <span v-if="badge.unlocked" class="text-[10px] bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-100 dark:border-green-900/30 flex items-center gap-1 flex-shrink-0">
                    <i class="fas fa-check-circle"></i> Débloqué
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{{ badge.description }}</p>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-lg flex-shrink-0">
                    +{{ badge.points_reward }} pts
                  </span>
                  <span v-if="!badge.unlocked" class="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1 flex-shrink-0">
                    <i class="fas fa-lock text-[9px]"></i> Verrouillé
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Leaderboard Tab -->
        <div v-if="activeTab === 'leaderboard'" class="space-y-4">
          <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden divide-y divide-gray-50 dark:divide-gray-800">
            <div 
              v-for="user in loyaltyStore.leaderboard" 
              :key="user.rank"
              :class="user.rank === 1 ? 'bg-amber-50/10 dark:bg-amber-950/10' : ''"
              class="flex items-center gap-4 px-5 py-4 transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
            >
              <!-- Rank Icon/Badge -->
              <div class="w-8 flex justify-center flex-shrink-0">
                <span v-if="user.rank === 1" class="text-yellow-500 text-lg flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/30">
                  <i class="fas fa-crown"></i>
                </span>
                <span v-else-if="user.rank === 2" class="text-slate-400 text-base flex items-center justify-center w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <i class="fas fa-medal"></i>
                </span>
                <span v-else-if="user.rank === 3" class="text-amber-700 text-sm flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                  <i class="fas fa-medal"></i>
                </span>
                <span class="text-xs font-black text-gray-400 dark:text-gray-500 w-6 h-6 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                  {{ user.rank }}
                </span>
              </div>

              <!-- Initials Avatar -->
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold uppercase flex-shrink-0 border border-gray-100 dark:border-gray-800 text-xs shadow-inner">
                {{ user.name.substring(0, 2) }}
              </div>

              <!-- User Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{{ user.name }}</p>
                  <!-- Tier Badge -->
                  <span 
                    :class="user.tier === 'diamond' || user.tier === 'Diamond' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30'
                          : user.tier === 'gold' || user.tier === 'Gold' ? 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/30'
                          : user.tier === 'silver' || user.tier === 'Silver' ? 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                          : 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'"
                    class="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border flex-shrink-0"
                  >
                    {{ user.tier }}
                  </span>
                </div>
                <p class="text-[11px] text-gray-400 dark:text-gray-500">{{ user.email }}</p>
              </div>

              <!-- Score -->
              <div class="text-right flex-shrink-0">
                <span class="text-sm font-black text-gray-900 dark:text-gray-100">{{ user.lifetime_points.toLocaleString() }}</span>
                <span class="text-[10px] text-gray-400 dark:text-gray-500 block -mt-1">pts</span>
              </div>
            </div>

            <div v-if="loyaltyStore.leaderboard.length === 0" class="text-center py-12 text-gray-400 dark:text-gray-600">
              <i class="fas fa-users text-3xl mb-3 block text-gray-200 dark:text-gray-800"></i>
              Aucun classement disponible
            </div>
          </div>
        </div>
      </template>

      <!-- Empty / Logout State -->
      <div v-else class="text-center py-16 text-gray-400 dark:text-gray-600">
        <i class="fas fa-medal text-5xl mb-4 block text-gray-200 dark:text-gray-800"></i>
        <p>Connectez-vous pour voir vos points</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLoyaltyStore } from '@/stores/loyalty'

const loyaltyStore = useLoyaltyStore()
const activeTab = ref<'history' | 'badges' | 'leaderboard'>('history')

onMounted(() => {
  loyaltyStore.fetchLoyalty()
  loyaltyStore.fetchAchievements()
  loyaltyStore.fetchLeaderboard()
})
</script>
