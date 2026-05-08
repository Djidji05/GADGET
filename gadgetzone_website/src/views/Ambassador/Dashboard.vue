<template>
  <div class="container mx-auto px-4 pt-4 pb-12">
    <div class="max-w-4xl mx-auto">
      <div v-if="!isAmbassador" class="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-handshake text-3xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Devenez Ambassadeur HTFasil</h1>
        <p class="text-gray-600 mb-8 max-w-lg mx-auto">
          Rejoignez notre programme de parrainage et gagnez des commissions sur chaque vente réalisée grâce à votre recommandation. 
          Partagez votre amour pour les gadgets et soyez récompensé !
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 class="font-bold text-blue-600 mb-1">5% Commission</h4>
            <p class="text-xs text-gray-500">Gagnez 5% sur le montant total de chaque commande parrainée.</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 class="font-bold text-blue-600 mb-1">Paiements Rapides</h4>
            <p class="text-xs text-gray-500">Vos commissions sont validées dès que la commande est livrée.</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 class="font-bold text-blue-600 mb-1">Code Unique</h4>
            <p class="text-xs text-gray-500">Obtenez un code personnalisé à partager avec vos proches.</p>
          </div>
        </div>

        <button 
          @click="becomeAmbassador" 
          :disabled="isApplying"
          class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <i v-if="isApplying" class="fas fa-spinner fa-spin mr-2"></i>
          Démarrer maintenant
        </button>
      </div>

      <div v-else class="space-y-6">
        <!-- Dashboard Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Tableau de Bord Ambassadeur</h1>
            <p class="text-sm text-gray-500">Gérez vos liens et suivez vos revenus</p>
          </div>
          <div class="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-3">
            <span class="text-sm font-medium">Votre Code :</span>
            <span class="text-xl font-black tracking-widest">{{ stats.referral_code }}</span>
            <button @click="copyCode" class="hover:text-blue-200 transition-colors">
              <i class="far fa-copy"></i>
            </button>
          </div>
        </div>

        <!-- Progress Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p class="text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Total Parrainages</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.stats?.total_referrals || 0 }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p class="text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Gains Totaux</p>
            <p class="text-2xl font-bold text-green-600">{{ formatPrice(stats.stats?.total_commissions || 0) }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p class="text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">En Attente</p>
            <p class="text-2xl font-bold text-yellow-600">{{ formatPrice(stats.stats?.pending_commissions || 0) }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p class="text-xs text-gray-500 mb-1 uppercase font-bold tracking-wider">Payé</p>
            <p class="text-2xl font-bold text-blue-600">{{ formatPrice(stats.stats?.paid_commissions || 0) }}</p>
          </div>
        </div>

        <!-- Referral List -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 class="font-bold text-gray-900">Historique des Ventes</h3>
            <span class="text-xs text-gray-500">Dernières transactions</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[10px] uppercase text-gray-400 font-bold border-b border-gray-50">
                  <th class="px-6 py-3">Client</th>
                  <th class="px-6 py-3">Date</th>
                  <th class="px-6 py-3">Commande</th>
                  <th class="px-6 py-3">Commission</th>
                  <th class="px-6 py-3">Statut</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="ref in stats.referrals" :key="ref.id" class="text-sm">
                  <td class="px-6 py-4 font-medium">{{ ref.referred_user }}</td>
                  <td class="px-6 py-4 text-gray-500 text-xs">{{ formatDate(ref.date) }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] uppercase font-bold">
                        {{ ref.order_status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 font-bold text-green-600">{{ formatPrice(ref.amount) }}</td>
                  <td class="px-6 py-4">
                    <span 
                      class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
                      :class="ref.status === 'paid' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'"
                    >
                      {{ ref.status === 'paid' ? 'Payé' : 'En attente' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!stats.referrals || stats.referrals.length === 0">
                    <td colspan="5" class="px-6 py-10 text-center text-gray-400">
                        Aucun parrainage enregistré pour le moment.
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ambassadorService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAmbassador = computed(() => (authStore.customer as any)?.is_ambassador)
const isApplying = ref(false)
const stats = ref<any>({ referrals: [] })

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const copyCode = () => {
  if (stats.value.referral_code) {
    navigator.clipboard.writeText(stats.value.referral_code)
    // Optionnel: Notification toast
  }
}

const becomeAmbassador = async () => {
    isApplying.value = true
    try {
        const res = await ambassadorService.apply()
        // Mettre à jour l'utilisateur localement
        if (authStore.customer) {
            (authStore.customer as any).is_ambassador = true;
            (authStore.customer as any).referral_code = res.referral_code
        }
        await fetchStats()
    } catch (e) {
        console.error(e)
    } finally {
        isApplying.value = false
    }
}

const fetchStats = async () => {
    if (!isAmbassador.value) return
    try {
        stats.value = await ambassadorService.getStats()
    } catch (e) {
        console.error(e)
    }
}

onMounted(() => {
    fetchStats()
})
</script>
