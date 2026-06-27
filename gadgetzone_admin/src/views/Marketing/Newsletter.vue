<template>
  <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <h2 class="mb-6 text-title-md2 font-bold text-black dark:text-white">Newsletter</h2>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement...</p>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- Active Subscribers Card -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <i class="las la-user-check text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.activeSubscribers.toLocaleString() }}</h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Abonnés actifs</span>
      </div>

      <!-- Total Subscribers Card -->
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-100 dark:border-purple-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-purple-100/50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <i class="las la-envelope-open text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.totalSubscribers.toLocaleString() }}</h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Total abonnés</span>
      </div>

      <!-- New Subscribers Card -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-100 dark:border-green-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-green-100/50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
            <i class="las la-user-plus text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.recentSubscribers }}</h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Nouveaux (30j)</span>
      </div>

      <!-- Inactive Subscribers Card -->
      <div class="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-100 dark:border-red-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-red-100/50 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
            <i class="las la-user-slash text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.inactiveSubscribers }}</h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Désabonnés</span>
      </div>
    </div>

    <!-- Subscribers List -->
    <div v-if="!isLoading" class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Liste des abonnés</h3>
          <p class="text-xs text-gray-500 font-medium mt-1">Gérer et exporter les adresses email inscrites à votre newsletter</p>
        </div>
        <button 
          @click="exportSubscribers"
          class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
        >
          <i class="las la-file-export text-lg"></i>
          Exporter en CSV
        </button>
      </div>
      
      <div class="p-6">
        <div v-if="subscribers.length === 0" class="text-center py-12">
          <i class="las la-users-slash text-4xl text-gray-300 dark:text-gray-600 mb-2"></i>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Aucun abonné pour le moment</p>
        </div>
        <div v-else class="overflow-x-auto rounded-xl border border-gray-150 dark:border-gray-800">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-150 dark:border-gray-800 text-left text-gray-500 font-black uppercase text-[10px] tracking-wider">
                <th class="py-3.5 px-6">ID Abonné</th>
                <th class="py-3.5 px-6">Adresse Email</th>
                <th class="py-3.5 px-6">Date & Heure d'inscription</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr 
                v-for="subscriber in subscribers" 
                :key="subscriber.id"
                class="hover:bg-gray-50/50 dark:hover:bg-gray-850/50 transition-colors font-medium text-gray-700 dark:text-gray-300"
              >
                <td class="py-4 px-6 text-gray-400 font-bold">#{{ subscriber.id }}</td>
                <td class="py-4 px-6 font-bold text-gray-900 dark:text-white">{{ subscriber.email }}</td>
                <td class="py-4 px-6 text-xs">{{ formatDate(subscriber.subscribedAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { newsletterService, type NewsletterSubscriber, type NewsletterStats } from '@/services/newsletter';

const subscribers = ref<NewsletterSubscriber[]>([]);
const stats = ref<NewsletterStats>({
  totalSubscribers: 0,
  activeSubscribers: 0,
  inactiveSubscribers: 0,
  recentSubscribers: 0
});
const isLoading = ref(true);

const loadData = async () => {
  try {
    isLoading.value = true;
    
    const [subscribersData, statsData] = await Promise.all([
      newsletterService.getSubscribers(),
      newsletterService.getStats()
    ]);
    
    subscribers.value = subscribersData.subscribers;
    stats.value = statsData;
  } catch (error) {
    console.error('Erreur lors du chargement des données newsletter:', error);
  } finally {
    isLoading.value = false;
  }
};

const exportSubscribers = () => {
  // Create CSV content
  const csv = [
    ['ID', 'Email', 'Date d\'inscription'],
    ...subscribers.value.map(s => [s.id, s.email, formatDate(s.subscribedAt)])
  ].map(row => row.join(',')).join('\n');
  
  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  loadData();
});
</script>
