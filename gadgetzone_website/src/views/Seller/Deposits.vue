<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useNotificationsStore } from '@/stores/notifications';

const router = useRouter();
const notificationsStore = useNotificationsStore();

const deposits = ref<any[]>([]);
const loading = ref(true);

const totalAmount = ref(0);
const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 1 });

const fetchDeposits = async () => {
    try {
        loading.value = true;
        const res = await api.get('/vendors/me/deposits');
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

onMounted(() => {
    fetchDeposits();
    notificationsStore.fetchNotifications(true);
});
</script>

<template>
<div class="bg-gray-50 min-h-screen pb-20 font-sans">
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
</template>

<style scoped>
.font-sans {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
