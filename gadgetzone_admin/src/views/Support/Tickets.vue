<template>
  <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <h2 class="mb-6 text-title-md2 font-bold text-black dark:text-white">Support — Tickets</h2>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      <!-- Tickets Ouverts Card -->
      <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-amber-100/50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <i class="las la-envelope-open-text text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">
          {{ isLoading ? '—' : stats.open }}
        </h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Tickets ouverts</span>
      </div>

      <!-- Temps de Réponse Moyen Card -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <i class="las la-clock text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">
          {{ isLoading ? '—' : (stats.avgResponseHours > 0 ? stats.avgResponseHours + 'h' : 'N/A') }}
        </h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Temps de réponse moyen</span>
      </div>

      <!-- Taux de Résolution Card -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-100 dark:border-green-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-green-100/50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
            <i class="las la-check-circle text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">
          {{ isLoading ? '—' : (stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) + '%' : 'N/A') }}
        </h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Taux de résolution</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap items-center gap-2.5">
      <button
        v-for="f in statusFilters"
        :key="f.value"
        @click="selectedStatus = f.value; loadTickets()"
        :class="[
          'px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-102 active:scale-98 shadow-sm',
          selectedStatus === f.value
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850'
        ]"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Tickets Table -->
    <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
        <div>
          <h4 class="text-lg font-bold text-gray-900 dark:text-white">Tickets récents</h4>
          <p class="text-xs text-gray-500 font-medium mt-1">Gérer et répondre aux demandes de support des utilisateurs</p>
        </div>
        <span class="text-xs font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/30">{{ total }} ticket(s)</span>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="tickets.length === 0" class="p-16 text-center">
        <i class="las la-comment-slash text-5xl text-gray-350 dark:text-gray-650 mb-3 block"></i>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Aucun ticket pour le moment</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-150 dark:border-gray-800 text-left text-gray-500 font-black uppercase text-[10px] tracking-wider">
              <th class="py-3.5 px-6">ID</th>
              <th class="py-3.5 px-6">Sujet du ticket</th>
              <th class="py-3.5 px-6">Client / Utilisateur</th>
              <th class="py-3.5 px-6">Priorité</th>
              <th class="py-3.5 px-6">Statut</th>
              <th class="py-3.5 px-6">Date de création</th>
              <th class="py-3.5 px-6">Actions administratives</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="ticket in tickets"
              :key="ticket.id"
              class="hover:bg-gray-50/50 dark:hover:bg-gray-850/50 transition-colors font-medium text-gray-700 dark:text-gray-300"
            >
              <td class="py-4 px-6 text-gray-400 font-bold">#{{ ticket.id }}</td>
              <td class="py-4 px-6">
                <p class="font-bold text-gray-900 dark:text-white text-sm">{{ ticket.subject }}</p>
              </td>
              <td class="py-4 px-6">
                <p class="font-bold text-gray-900 dark:text-white">{{ ticket.user_name || 'Inconnu' }}</p>
                <p class="text-xs text-gray-400">{{ ticket.user_email }}</p>
              </td>
              <td class="py-4 px-6">
                <span
                  class="inline-flex rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider"
                  :class="priorityClass(ticket.priority)"
                >
                  {{ ticket.priority || 'normal' }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span
                  class="inline-flex rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider"
                  :class="statusClass(ticket.status)"
                >
                  {{ statusLabel(ticket.status) }}
                </span>
              </td>
              <td class="py-4 px-6 text-xs text-gray-400">
                {{ formatDate(ticket.created_at) }}
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <button
                    v-if="ticket.status === 'open'"
                    @click="changeStatus(ticket, 'in_progress')"
                    class="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100 dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-900/30"
                    title="Prendre en charge"
                  >
                    Prendre en charge
                  </button>
                  <button
                    v-if="ticket.status !== 'closed'"
                    @click="changeStatus(ticket, 'closed')"
                    class="text-xs font-bold px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors border border-green-100 dark:bg-green-950/20 dark:text-green-450 dark:border-green-900/30"
                    title="Fermer le ticket"
                  >
                    Fermer
                  </button>
                  <button
                    v-if="ticket.status === 'closed'"
                    @click="changeStatus(ticket, 'open')"
                    class="text-xs font-bold px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-150 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    title="Réouvrir"
                  >
                    Réouvrir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ticketService } from '@/services/api'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()

interface TicketStats {
  open: number
  inProgress: number
  closed: number
  total: number
  avgResponseHours: number
}

interface Ticket {
  id: number
  subject: string
  status: 'open' | 'in_progress' | 'closed'
  priority: string
  created_at: string
  user_name: string
  user_email: string
}

const tickets = ref<Ticket[]>([])
const stats = ref<TicketStats>({ open: 0, inProgress: 0, closed: 0, total: 0, avgResponseHours: 0 })
const isLoading = ref(true)
const total = ref(0)
const selectedStatus = ref('')

const statusFilters = [
  { value: '', label: 'Tous' },
  { value: 'open', label: 'Ouverts' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'closed', label: 'Fermés' }
]

const loadTickets = async () => {
  try {
    isLoading.value = true
    const params = selectedStatus.value ? { status: selectedStatus.value } : {}
    const data = await ticketService.getAll(params)
    tickets.value = data.tickets || []
    total.value = data.total || 0
  } catch (error) {
    console.error('Erreur chargement tickets:', error)
    uiStore.addToast('Erreur lors du chargement des tickets', 'error')
  } finally {
    isLoading.value = false
  }
}

const loadStats = async () => {
  try {
    stats.value = await ticketService.getStats()
  } catch (error) {
    console.error('Erreur stats tickets:', error)
  }
}

const changeStatus = async (ticket: Ticket, newStatus: 'open' | 'in_progress' | 'closed') => {
  try {
    await ticketService.updateStatus(ticket.id, newStatus)
    ticket.status = newStatus
    uiStore.addToast('Statut du ticket mis à jour', 'success')
    // Refresh stats
    await loadStats()
  } catch (error) {
    console.error('Erreur mise à jour ticket:', error)
    uiStore.addToast('Erreur lors de la mise à jour', 'error')
  }
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: 'Ouvert',
    in_progress: 'En cours',
    closed: 'Fermé'
  }
  return labels[status] || status
}

const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    open: 'bg-warning bg-opacity-10 text-warning',
    in_progress: 'bg-primary bg-opacity-10 text-primary',
    closed: 'bg-success bg-opacity-10 text-success'
  }
  return classes[status] || 'bg-gray-100 text-gray-600'
}

const priorityClass = (priority: string) => {
  const classes: Record<string, string> = {
    high: 'bg-danger bg-opacity-10 text-danger',
    urgent: 'bg-red-100 text-red-700',
    normal: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    low: 'bg-blue-50 text-blue-500'
  }
  return classes[priority] || classes.normal
}

const formatDate = (dateString: string) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await Promise.all([loadTickets(), loadStats()])
})
</script>
