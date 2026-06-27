<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useNotificationsStore } from '@/stores/notifications';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';

const router = useRouter();
const notificationsStore = useNotificationsStore();

const deposits = ref<any[]>([]);
const loading = ref(true);

const totalAmount = ref(0);
const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 1 });

const selectedMonth = ref('');
const selectedYear = ref('');

const fetchDeposits = async () => {
    try {
        loading.value = true;
        const params: any = {
            page: pagination.value.page,
            limit: pagination.value.limit
        };
        if (selectedYear.value) {
            params.year = selectedYear.value;
            if (selectedMonth.value) {
                params.month = selectedMonth.value;
            }
        }
        const res = await api.get('/vendors/me/deposits', { params });
        deposits.value = res.data.deposits;
        totalAmount.value = res.data.totalAmount;
        pagination.value = res.data.pagination;
    } catch (e) {
        console.error("Error fetching deposits", e);
    } finally {
        loading.value = false;
    }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', { style: 'currency', currency: 'HTG' }).format(price);
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

watch(selectedYear, (newYear) => {
    if (!newYear) {
        selectedMonth.value = '';
    }
});

watch([selectedMonth, selectedYear], () => {
    pagination.value.page = 1;
    fetchDeposits();
});

onMounted(() => {
    fetchDeposits();
    notificationsStore.fetchNotifications(true);
});
</script>

<template>
  <div class="w-full lg:pt-4 pb-12">
    <!-- MOBILE VIEW (Hidden on Desktop) -->
    <div class="lg:hidden bg-gray-50 min-h-screen pb-20 -mt-2 font-sans">
        <!-- Header Section -->
        <div class="bg-blue-900 text-white px-6 pt-10 pb-20 rounded-b-[2.5rem] relative shadow-lg">
            <div class="flex items-center gap-4 mb-8">
                <button @click="router.push('/seller/dashboard')" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 active:scale-95 transition-all">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h1 class="text-2xl font-bold tracking-tight">Mes Dépôts Admin</h1>
            </div>

            <div class="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                <p class="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Total des Dépôts</p>
                <div class="flex items-baseline gap-2">
                    <h2 class="text-4xl font-black">{{ formatPrice(totalAmount).replace('HTG', '').trim() }}</h2>
                    <span class="text-lg font-bold text-blue-200">HTG</span>
                </div>
                <p class="text-[10px] text-blue-100/60 mt-3 italic">* Fonds versés directement par l'administration HTFasil</p>
            </div>

            <!-- Decorative element -->
            <div class="absolute right-0 bottom-4 opacity-10 pointer-events-none">
                <i class="fas fa-university text-[120px] rotate-12"></i>
            </div>
        </div>

        <!-- content -->
        <div class="px-6 -mt-10 relative z-10">
            <!-- Période Filtres Mobile -->
            <div class="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-4">
                <div class="grid grid-cols-2 gap-3">
                     <!-- Filtre Année -->
                     <select v-model="selectedYear" class="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-100 focus:outline-none w-full">
                         <option value="">Toutes les années</option>
                         <option value="2026">2026</option>
                         <option value="2025">2025</option>
                         <option value="2024">2024</option>
                     </select>

                     <!-- Filtre Mois -->
                     <select v-model="selectedMonth" :disabled="!selectedYear" class="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-100 focus:outline-none w-full disabled:opacity-50">
                         <option value="">Tous les mois</option>
                         <option value="1">Janvier</option>
                         <option value="2">Février</option>
                         <option value="3">Mars</option>
                         <option value="4">Avril</option>
                         <option value="5">Mai</option>
                         <option value="6">Juin</option>
                         <option value="7">Juillet</option>
                         <option value="8">Août</option>
                         <option value="9">Septembre</option>
                         <option value="10">Octobre</option>
                         <option value="11">Novembre</option>
                         <option value="12">Décembre</option>
                     </select>
                </div>
            </div>

            <h3 class="font-bold text-gray-900 mb-4 flex justify-between items-center px-2">
                Historique des Dépôts
                <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">{{ pagination.total }} Transactions</span>
            </h3>

            <!-- LOADING STATE -->
            <div v-if="loading" class="space-y-4">
                <div v-for="i in 3" :key="i" class="h-32 bg-white rounded-3xl animate-pulse border border-gray-100 shadow-sm"></div>
            </div>

            <!-- EMPTY STATE -->
            <div v-else-if="deposits.length === 0" class="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center shadow-sm">
                <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-50">
                    <i class="fas fa-piggy-bank text-gray-200 text-3xl"></i>
                </div>
                <h4 class="font-bold text-gray-900">Aucun dépôt</h4>
                <p class="text-xs text-gray-500 mt-2 px-8">Vous n'avez pas encore reçu de dépôt administratif.</p>
            </div>

            <!-- LIST -->
            <div v-else class="space-y-4">
                <div v-for="deposit in deposits" :key="deposit.id" class="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 group hover:border-blue-100 transition-all active:scale-[0.98]">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shadow-sm border border-gray-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <i class="fas fa-university"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900 text-sm leading-tight">Dépôt Administratif</h4>
                                <p class="text-[10px] text-gray-400 mt-1">{{ formatDate(deposit.date) }} • {{ formatTime(deposit.date) }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-black text-blue-600 text-base">{{ formatPrice(deposit.amount).replace('HTG', '').trim() }} <span class="text-[10px]">G</span></p>
                            <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-green-50 text-green-600 border border-green-100">Reçu</span>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Référence</span>
                            <span class="text-[11px] font-mono font-bold text-gray-600">{{ deposit.reference }}</span>
                        </div>
                        <div v-if="deposit.note" class="pt-2 border-t border-gray-100">
                            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-tight block mb-1">Note de l'admin</span>
                            <p class="text-[11px] text-gray-600 italic leading-snug">"{{ deposit.note }}"</p>
                        </div>
                    </div>
                </div>

                <div class="text-center py-6">
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fin de l'historique</p>
                </div>
            </div>
        </div>
    </div>

    <!-- DESKTOP VIEW (Hidden on Mobile) -->
    <div class="hidden lg:flex flex-col lg:flex-row gap-6 lg:items-start">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content -->
      <div class="flex-1 w-full pb-20">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dépôts Administratifs</h1>
            <p class="text-gray-500 text-sm mt-1">Consultez l'historique des fonds versés directement par l'administration.</p>
          </div>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
        </div>

        <div v-else class="space-y-6">
          <!-- Stat Card -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
              <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                  <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                    <i class="fas fa-university"></i>
                  </div>
                </div>
                <p class="text-sm font-bold text-gray-400 uppercase tracking-wide">Total des Dépôts</p>
                <h3 class="text-3xl font-extrabold text-gray-900 mt-1">{{ formatPrice(totalAmount).replace('HTG', '').trim() }} <span class="text-sm opacity-50">HTG</span></h3>
                <p class="text-xs text-gray-400 mt-2 italic">* Fonds administratifs versés par l'administration HTFasil</p>
              </div>
              <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl group-hover:bg-blue-100/50 transition-colors"></div>
            </div>
          </div>

          <!-- History Table -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div class="px-8 py-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                 <div>
                     <h3 class="text-lg font-bold text-gray-900">Historique des Transactions</h3>
                     <p class="text-sm text-gray-500 mt-1">Détails de tous les rechargements administratifs reçus.</p>
                 </div>
                 
                 <div class="flex items-center gap-3">
                     <!-- Filtre Année -->
                     <select v-model="selectedYear" class="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:outline-none">
                         <option value="">Toutes les années</option>
                         <option value="2026">2026</option>
                         <option value="2025">2025</option>
                         <option value="2024">2024</option>
                     </select>

                     <!-- Filtre Mois -->
                     <select v-model="selectedMonth" :disabled="!selectedYear" class="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:outline-none disabled:opacity-50">
                         <option value="">Tous les mois</option>
                         <option value="1">Janvier</option>
                         <option value="2">Février</option>
                         <option value="3">Mars</option>
                         <option value="4">Avril</option>
                         <option value="5">Mai</option>
                         <option value="6">Juin</option>
                         <option value="7">Juillet</option>
                         <option value="8">Août</option>
                         <option value="9">Septembre</option>
                         <option value="10">Octobre</option>
                         <option value="11">Novembre</option>
                         <option value="12">Décembre</option>
                     </select>

                     <span class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">{{ pagination.total }} Transactions</span>
                 </div>
             </div>
             
             <div class="overflow-x-auto">
                 <table class="w-full text-left border-collapse">
                     <thead>
                         <tr class="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                             <th class="px-8 py-4">Date & Heure</th>
                             <th class="px-8 py-4">Référence</th>
                             <th class="px-8 py-4">Note Administration</th>
                             <th class="px-8 py-4 text-center">Statut</th>
                             <th class="px-8 py-4 text-right">Montant</th>
                         </tr>
                     </thead>
                     <tbody class="divide-y divide-gray-50">
                         <tr v-for="deposit in deposits" :key="deposit.id" class="hover:bg-blue-50/30 transition-colors group">
                             <td class="px-8 py-4 text-sm text-gray-700">
                                 <div>
                                     <p class="font-semibold text-gray-900">{{ formatDate(deposit.date) }}</p>
                                     <p class="text-xs text-gray-400">{{ formatTime(deposit.date) }}</p>
                                 </div>
                             </td>
                             <td class="px-8 py-4 text-sm font-mono text-gray-600 font-bold">
                                 {{ deposit.reference }}
                             </td>
                             <td class="px-8 py-4 text-sm text-gray-500 max-w-xs truncate" :title="deposit.note || ''">
                                 {{ deposit.note || '-' }}
                             </td>
                             <td class="px-8 py-4 text-center">
                                 <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                     Reçu
                                 </span>
                             </td>
                             <td class="px-8 py-4 text-right">
                                 <span class="text-sm font-bold text-blue-600 font-mono">{{ formatPrice(deposit.amount).replace('HTG', '').trim() }} <span class="text-[11px] opacity-60">G</span></span>
                             </td>
                         </tr>
                         <tr v-if="deposits.length === 0">
                            <td colspan="5" class="px-8 py-16 text-center">
                                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <i class="fas fa-piggy-bank text-2xl"></i>
                                </div>
                                <h4 class="text-gray-900 font-bold mb-1">Aucun dépôt</h4>
                                <p class="text-gray-500 text-sm">Vous n'avez pas encore reçu de dépôt administratif.</p>
                            </td>
                         </tr>
                     </tbody>
                 </table>
             </div>
             
             <!-- Pagination (Desktop) -->
             <div class="bg-white px-8 py-4 border-t border-gray-100 flex items-center justify-between">
                 <p class="text-sm text-gray-500">
                     Affichage de <span class="font-bold text-gray-900">{{ deposits.length }}</span> dépôts
                 </p>
                 <div class="flex gap-2">
                     <button class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-50" disabled>
                         <i class="fas fa-chevron-left text-xs"></i>
                     </button>
                     <button class="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-blue-200">1</button>
                      <button class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-50" disabled>
                         <i class="fas fa-chevron-right text-xs"></i>
                     </button>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-sans {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
