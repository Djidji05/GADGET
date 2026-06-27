<template>
  <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Gestion des Litiges
      </h2>
      <nav>
        <ol class="flex items-center gap-2">
          <li>
            <router-link class="font-medium" to="/">Tableau de bord /</router-link>
          </li>
          <li class="font-medium text-primary">Litiges</li>
        </ol>
      </nav>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      <!-- En attente Card -->
      <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-amber-100/50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <i class="las la-exclamation-circle text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.pending }}</h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">En attente</span>
      </div>

      <!-- En cours d'examen Card -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <i class="las la-search text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.under_review }}</h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">En cours d'examen</span>
      </div>

      <!-- Résolus Card -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-100 dark:border-green-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-green-100/50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
            <i class="las la-check-double text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.resolved }}</h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Résolus</span>
      </div>
    </div>

    <!-- Filters and Table -->
    <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/50">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="status in statusOptions"
            :key="status.value"
            @click="selectedStatus = status.value"
            :class="[
              'px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm',
              selectedStatus === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-850'
            ]"
          >
            {{ status.label }}
          </button>
        </div>
        <div class="relative min-w-[260px]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par client..."
            class="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-2 pl-10 pr-4 text-sm font-semibold outline-none focus:border-blue-500 transition"
          />
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <i class="las la-search text-lg"></i>
          </span>
        </div>
      </div>

      <div class="p-6">
        <div class="max-w-full overflow-x-auto rounded-xl border border-gray-150 dark:border-gray-800">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-150 dark:border-gray-800 text-left text-gray-500 font-black uppercase text-[10px] tracking-wider">
                <th class="py-3.5 px-6">ID Litige</th>
                <th class="py-3.5 px-6">Client / Acheteur</th>
                <th class="py-3.5 px-6">Motif du litige</th>
                <th class="py-3.5 px-6">Commande</th>
                <th class="py-3.5 px-6">Statut</th>
                <th class="py-3.5 px-6">Date de création</th>
                <th class="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="loading">
                <td colspan="7" class="py-12 text-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </td>
              </tr>
              <tr v-else-if="filteredDisputes.length === 0">
                <td colspan="7" class="py-12 text-center text-gray-500">
                  <i class="las la-gavel text-4xl text-gray-300 dark:text-gray-650 mb-2 block"></i>
                  Aucun litige trouvé.
                </td>
              </tr>
              <tr 
                v-else 
                v-for="dispute in filteredDisputes" 
                :key="dispute.id" 
                class="hover:bg-gray-50/50 dark:hover:bg-gray-850/50 transition-colors font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                @click="$router.push(`/support/disputes/${dispute.id}`)"
              >
                <td class="py-4 px-6 text-gray-400 font-bold">#{{ dispute.id }}</td>
                <td class="py-4 px-6">
                  <p class="font-bold text-gray-900 dark:text-white">{{ dispute.customer?.name || 'Inconnu' }}</p>
                  <p class="text-xs text-gray-400">{{ dispute.customer?.email }}</p>
                </td>
                <td class="py-4 px-6">
                  <p class="font-bold text-gray-900 dark:text-white">{{ formatReason(dispute.reason) }}</p>
                  <p class="text-xs text-gray-400 truncate max-w-[200px]">{{ dispute.description }}</p>
                </td>
                <td class="py-4 px-6">
                  <span class="font-bold text-blue-600 dark:text-blue-400">#{{ dispute.order_id }}</span>
                </td>
                <td class="py-4 px-6">
                  <span
                    :class="[
                      'inline-flex rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-opacity-10',
                      statusClasses[dispute.status] || 'bg-gray-500 text-gray-500'
                    ]"
                  >
                    {{ formatStatus(dispute.status) }}
                  </span>
                </td>
                <td class="py-4 px-6 text-xs text-gray-400">
                  {{ formatDate(dispute.created_at) }}
                </td>
                <td class="py-4 px-6 text-right">
                  <button class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100 text-xs font-bold dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-900/30">
                    <i class="las la-eye text-sm"></i>
                    Examiner
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { disputeService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

const authStore = useAuthStore()
const uiStore = useUIStore()

const disputes = ref<any[]>([])
const loading = ref(true)
const selectedStatus = ref('all')
const searchQuery = ref('')

const statusOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'under_review', label: 'En examen' },
  { value: 'resolved', label: 'Résolus' },
  { value: 'closed', label: 'Fermés' }
]

const statusClasses: Record<string, string> = {
  pending: 'bg-warning text-warning',
  under_review: 'bg-primary text-primary',
  resolved: 'bg-success text-success',
  closed: 'bg-gray-500 text-gray-500'
}

const loadDisputes = async () => {
  try {
    loading.value = true
    let data
    if (authStore.isAdmin) {
      data = await disputeService.getAll()
    } else {
      data = await disputeService.getSellerDisputes()
    }
    disputes.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Erreur chargement litiges:', error)
    uiStore.addToast('Erreur lors du chargement des litiges', 'error')
  } finally {
    loading.value = false
  }
}

const filteredDisputes = computed(() => {
  if (!Array.isArray(disputes.value)) return []
  
  return disputes.value.filter((d) => {
    const statusMatch = selectedStatus.value === 'all' || d.status === selectedStatus.value
    const searchMatch = !searchQuery.value || 
      d.id.toString().includes(searchQuery.value) ||
      d.customer?.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.reason?.toLowerCase().includes(searchQuery.value.toLowerCase())
    return statusMatch && searchMatch
  })
})

const stats = computed(() => {
  return {
    pending: disputes.value.filter(d => d.status === 'pending').length,
    under_review: disputes.value.filter(d => d.status === 'under_review').length,
    resolved: disputes.value.filter(d => d.status === 'resolved').length
  }
})

const formatReason = (reason: string) => {
  const reasons: Record<string, string> = {
    not_received: 'Non reçu',
    damaged: 'Endommagé',
    wrong_item: 'Mauvais article',
    other: 'Autre'
  }
  return reasons[reason] || reason
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    pending: 'En attente',
    under_review: 'En examen',
    resolved: 'Résolu',
    closed: 'Fermé'
  }
  return statuses[status] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(() => {
  loadDisputes()
})
</script>
