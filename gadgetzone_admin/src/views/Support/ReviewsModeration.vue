<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Modération des Avis</h1>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 rounded-full text-sm font-medium">
          {{ filteredReviews.length }} / {{ reviews.length }} avis
        </span>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="relative flex-1 w-full">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="las la-search text-gray-400 text-lg"></i>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par produit, client, email ou commentaire..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      
      <div class="flex flex-wrap gap-3 w-full md:w-auto">
        <!-- Status Filter -->
        <select
          v-model="statusFilter"
          class="flex-1 md:flex-initial px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
        >
          <option value="all">Tous les statuts</option>
          <option value="approved">En ligne</option>
          <option value="rejected">Rejetés</option>
          <option value="pending">En attente</option>
        </select>
        
        <!-- Rating Filter -->
        <select
          v-model="ratingFilter"
          class="flex-1 md:flex-initial px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
        >
          <option value="all">Toutes les notes</option>
          <option value="5">5 étoiles</option>
          <option value="4">4 étoiles</option>
          <option value="3">3 étoiles</option>
          <option value="2">2 étoiles</option>
          <option value="1">1 étoile</option>
        </select>
      </div>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Chargement de tous les avis...</p>
      </div>
      
      <!-- General Empty State -->
      <div v-else-if="reviews.length === 0" class="text-center py-20">
        <div class="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="las la-folder-open text-4xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Aucun avis</h3>
        <p class="text-gray-600 dark:text-gray-400">Aucun avis n'a encore été publié.</p>
      </div>

      <!-- Filter Empty State -->
      <div v-else-if="filteredReviews.length === 0" class="text-center py-20">
        <div class="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="las la-search text-4xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Aucun résultat</h3>
        <p class="text-gray-600 dark:text-gray-400">Aucun avis ne correspond à vos filtres de recherche.</p>
        <button @click="resetFilters" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors">
          Réinitialiser les filtres
        </button>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              <th class="p-4 font-semibold text-gray-700 dark:text-gray-200">Produit & Client</th>
              <th class="p-4 font-semibold text-gray-700 dark:text-gray-200">Note & Commentaire</th>
              <th class="p-4 font-semibold text-gray-700 dark:text-gray-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700">
            <tr v-for="review in paginatedReviews" :key="review.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
              <td class="p-4">
                <div class="flex flex-col">
                  <span class="font-bold text-gray-900 dark:text-white">{{ review.product?.name }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ review.user?.name }} ({{ review.user?.email }})</span>
                  <span class="text-[11px] text-gray-400 mt-1">{{ formatDate(review.createdAt || review.created_at) }}</span>
                </div>
              </td>
              <td class="p-4 max-w-md">
                <div class="flex items-center gap-1 mb-2">
                  <i v-for="i in 5" :key="i" 
                     class="las la-star text-sm"
                     :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'">
                  </i>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300 italic mb-3">"{{ review.comment || 'Sans commentaire' }}"</p>
                
                <!-- Review Photos -->
                <div v-if="review.images && review.images.length > 0" class="flex flex-wrap gap-2">
                  <div v-for="(img, idx) in review.images" :key="idx" class="relative group">
                    <img alt="" 
                      :src="getImageUrl(img)" 
                      class="w-16 h-16 rounded-lg object-cover border border-gray-200 cursor-zoom-in hover:opacity-80 transition-opacity"
                      @click="openImage(img)"
                    />
                  </div>
                </div>
              </td>
              <td class="p-4 text-right">
                <div class="flex justify-end gap-2 items-center">
                  <span 
                    :class="[
                      'px-2 py-0.5 text-xs font-semibold rounded-full',
                      review.status === 'approved' ? 'bg-green-100 text-green-800' : (review.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800')
                    ]"
                  >
                    {{ review.status === 'approved' ? 'En ligne' : (review.status === 'rejected' ? 'Rejeté' : 'En attente') }}
                  </span>
                  <button
                    @click="deleteReview(review.id)"
                    class="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                    title="Supprimer"
                  >
                    <i class="las la-trash"></i>
                    <span class="text-xs font-bold">Supprimer</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Bar -->
        <div v-if="totalPages > 1" class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Affichage de {{ startItem + 1 }} à {{ Math.min(endItem, filteredReviews.length) }} sur {{ filteredReviews.length }} avis
          </div>
          <div class="flex items-center gap-1">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                currentPage === page 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ page }}
            </button>
            
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { reviewService } from '@/services/api'
import { useUIStore } from '@/stores/ui'

const uiStore = useUIStore()
const reviews = ref<any[]>([])
const isLoading = ref(true)

// Filter states
const searchQuery = ref('')
const statusFilter = ref('all')
const ratingFilter = ref('all')

// Pagination states
const currentPage = ref(1)
const itemsPerPage = ref(10)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3003'
  return `${baseUrl}${path}`
}

const openImage = (path: string) => {
  window.open(getImageUrl(path), '_blank')
}

const fetchAllReviews = async () => {
  try {
    isLoading.value = true
    reviews.value = await reviewService.getPending() // retrieves all now since findPending repository method was updated to fetch all
  } catch (error) {
    console.error('Erreur lors du chargement des avis:', error)
    uiStore.addToast('Erreur lors du chargement des avis', 'error')
  } finally {
    isLoading.value = false
  }
}

const deleteReview = async (id: number) => {
  const confirmed = await uiStore.confirm({
    title: 'Supprimer l\'avis',
    message: 'Êtes-vous sûr de vouloir supprimer cet avis définitivement ?',
    confirmText: 'Supprimer',
    type: 'danger'
  })

  if (!confirmed) return

  try {
    await reviewService.delete(id)
    uiStore.addToast('Avis supprimé avec succès', 'success')
    // Remove from list
    reviews.value = reviews.value.filter(r => r.id !== id)
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    uiStore.addToast('Erreur lors de la suppression', 'error')
  }
}

// Computed property for filtered reviews
const filteredReviews = computed(() => {
  return reviews.value.filter(review => {
    // 1. Status Filter
    if (statusFilter.value !== 'all' && review.status !== statusFilter.value) {
      return false
    }

    // 2. Rating Filter
    if (ratingFilter.value !== 'all' && review.rating !== parseInt(ratingFilter.value)) {
      return false
    }

    // 3. Search Query Filter (Product, User name, User email, Comment content)
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const productName = review.product?.name?.toLowerCase() || ''
      const userName = review.user?.name?.toLowerCase() || ''
      const userEmail = review.user?.email?.toLowerCase() || ''
      const comment = review.comment?.toLowerCase() || ''

      return productName.includes(q) || userName.includes(q) || userEmail.includes(q) || comment.includes(q)
    }

    return true
  })
})

// Pagination logic
const totalPages = computed(() => Math.ceil(filteredReviews.value.length / itemsPerPage.value))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endItem = computed(() => currentPage.value * itemsPerPage.value)

const paginatedReviews = computed(() => {
  return filteredReviews.value.slice(startItem.value, endItem.value)
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Limit displayed page numbers to max 5 around the current page
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  ratingFilter.value = 'all'
}

// Reset page when filters change
watch([searchQuery, statusFilter, ratingFilter], () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchAllReviews()
})
</script>
