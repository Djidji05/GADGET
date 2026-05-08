```
<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import { useUiStore } from '@/stores/ui';

const router = useRouter();
const notificationsStore = useNotificationsStore();
const authStore = useAuthStore();
const uiStore = useUiStore();
const store = ref<any>({});

// Initialize with safe defaults
const payouts = ref<any[]>([]);
const summary = ref({ totalPaid: 0, pendingValue: 0 });
const totalSales = ref(0);
const netSales = ref(0);
const chartData = ref<number[]>([]); // Mock data for chart
const loading = ref(true);

// Withdraw Modal
const showWithdrawModal = ref(false);
const withdrawing = ref(false);
const withdrawForm = reactive({
 amount: 0,
 method: 'MonCash',
 phone: '',
 accountName: ''
});

const searchQuery = ref('');
const searchTimeout = ref<any>(null);
const currentTab = ref('sales'); // 'sales' or 'payouts'
const transactions = ref<any[]>([]);
const transactionsLoading = ref(false);
const transactionsPagination = ref({
 page: 1,
 limit: 10,
 total: 0,
 totalPages: 1
});

const pagination = ref({
 page: 1,
 limit: 10,
 total: 0,
 totalPages: 1
});

const availableBalance = computed(() => {
 const val = netSales.value - (summary.value.totalPaid + summary.value.pendingValue);
 return Number(Math.max(0, val).toFixed(2));
});

const fetchPayouts = async (page = 1) => {
 try {
 loading.value = true;
 const [payoutsRes, statsRes] = await Promise.all([
 api.get('/vendors/me/payouts', {
 params: {
 page,
 limit: 10,
 search: searchQuery.value || undefined
 }
 }),
 api.get('/vendors/me/stats')
 ]);
 
 if (payoutsRes.data) {
 payouts.value = payoutsRes.data.payouts || [];
 if (payoutsRes.data.summary) {
 summary.value = payoutsRes.data.summary;
 }
 if (payoutsRes.data.pagination) {
 pagination.value = payoutsRes.data.pagination;
 }
 }
 
 if (statsRes.data) {
 totalSales.value = statsRes.data.sales || 0;
 netSales.value = statsRes.data.netSales || 0;
 }

 // Mock chart data for "Savings" curve
 chartData.value = Array.from({length: 6}, () => Math.floor(Math.random() * 100) + 20);

 } catch (e) {
 console.error("Error fetching financial data", e);
 } finally {
 loading.value = false;
 }
};

const fetchTransactions = async (page = 1) => {
 try {
 transactionsLoading.value = true;
 const res = await api.get('/vendors/me/transactions', {
 params: { page, limit: 10 }
 });
 
 if (res.data) {
 transactions.value = res.data.transactions || [];
 if (res.data.pagination) {
 transactionsPagination.value = res.data.pagination;
 }
 }
 } catch (e) {
 console.error("Error fetching transactions", e);
 } finally {
 transactionsLoading.value = false;
 }
};

// SVG Curve Logic
const curvePath = computed(() => {
 if (chartData.value.length === 0) return '';
 const points = chartData.value.map((val, i) => {
 const x = (i / (chartData.value.length - 1)) * 100;
 const y = 50 - (val / Math.max(...chartData.value, 1)) * 40; // Scale to fit 0-50 height
 return { x, y };
 });
 if (points.length < 2) return '';

 // Simple Catmull-Rom or cubic bezier approximation could handle smoothing
 // For now, let's just do a basic quadratic curve between points for smoothness
 let path = `M ${points[0]!.x} ${points[0]!.y}`;
 for (let i = 0; i < points.length - 1; i++) {
 const p0 = points[i]!;
 const p1 = points[i + 1]!;
 // Control points for a "smooth" look
 const cp1x = p0.x + (p1.x - p0.x) / 2;
 const cp1y = p0.y; 
 const cp2x = p0.x + (p1.x - p0.x) / 2; 
 const cp2y = p1.y;
 
 path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
 }
 return path;
});

const handleSearch = () => {
 if (searchTimeout.value) clearTimeout(searchTimeout.value);
 searchTimeout.value = setTimeout(() => {
 pagination.value.page = 1;
 fetchPayouts(1);
 }, 500);
};

const clearSearch = () => {
 searchQuery.value = '';
 handleSearch();
};

// Watch showWithdrawModal to hide/show bottom nav and lock scroll
watch(showWithdrawModal, (val) => {
 uiStore.isSellerNavVisible = !val;
 if (val) {
  document.body.style.overflow = 'hidden';
  // Pre-fill with save default if exists
  if (store.value?.settings?.payoutPhone) {
   withdrawForm.phone = store.value.settings.payoutPhone;
   withdrawForm.accountName = store.value.settings.payoutName || '';
  }
 } else {
  document.body.style.overflow = '';
 }
});

const changePage = (newPage: number) => {
 if (currentTab.value === 'payouts') {
 if (newPage >= 1 && pagination.value && newPage <= pagination.value.totalPages) {
 fetchPayouts(newPage);
 }
 } else {
 if (newPage >= 1 && transactionsPagination.value && newPage <= transactionsPagination.value.totalPages) {
 fetchTransactions(newPage);
 }
 }
};

onMounted(async () => {
 fetchPayouts();
 fetchTransactions();

 // Load store data for header
 try {
 const res = await api.get('/vendors/me');
 store.value = res.data;
 } catch (e) {
 console.error("Failed to load store in payments", e);
 }
 
 // Refresh notifications
 notificationsStore.fetchNotifications(true);
});

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

const handleWithdraw = async () => {
 if (withdrawForm.amount <= 0) {
  uiStore.showToast("Veuillez entrer un montant valide", "warning");
  return;
 }
 if (withdrawForm.amount > availableBalance.value) {
  uiStore.showToast("Solde insuffisant", "warning");
  return;
 }
 if (!withdrawForm.phone || !withdrawForm.accountName) {
  uiStore.showToast("Veuillez remplir vos informations de retrait", "warning");
  return;
 }
 
 try {
 withdrawing.value = true;
 await api.post('/vendors/me/payouts', withdrawForm);
 showWithdrawModal.value = false;
 withdrawForm.amount = 0;
 // Refresh data
 fetchPayouts();
 } catch (e: any) {
 uiStore.showToast(e.response?.data?.message || "Erreur lors du retrait", "error");
 } finally {
 withdrawing.value = false;
 }
};

const handleSendInfo = () => {
 uiStore.showToast("La fonctionnalité d'envoi (P2P) sera bientôt disponible !", "info");
};
</script>

<template>
  <div class="w-full md:pt-4 pb-12">
 <div class="flex flex-col md:flex-row gap-6 md:items-start">
 <!-- Sidebar (Desktop Only) -->
 <SellerSidebar />

 <!-- Main Content -->
 <div class="flex-1 w-full relative">

 <!-- MOBILE PAYMENTS (Site Theme) -->
 <div class="md:hidden bg-gray-50 min-h-screen pb-0 -mx-4 -mt-2">
 <!-- Top Navy Blue Section -->
 <div class="bg-blue-900 text-white px-6 pt-8 pb-8 rounded-b-[2.5rem] relative z-10 shadow-lg shadow-blue-900/20">
 <!-- Header Row -->
 <div class="flex justify-between items-center mb-8">
 <div class="flex items-center gap-3">
 <button @click="router.back()" class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
 <i class="fas fa-arrow-left text-xs"></i>
 </button>
 <div>
 <h2 class="font-bold text-lg leading-tight transition-all">Paiements</h2>
 </div>
 </div>
 <!-- Notification Bell -->
 <button 
 @click="router.push('/seller/notifications')"
 class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center relative hover:bg-white/20 transition-colors"
 >
 <i class="fas fa-bell text-sm"></i>
 <span v-if="notificationsStore.unreadCount > 0" class="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border border-blue-900"></span>
 </button>
 </div>

 <!-- Balance Section -->
 <div class="text-center mb-8">
 <p class="text-xs text-blue-100 mb-2 font-medium">Solde Retirable (Livraisons confirmées)</p>
 <h1 class="text-4xl font-bold mb-6 tracking-tight text-white">{{ formatPrice(availableBalance).replace('HTG', '').replace('G', '').trim() }} G</h1>
 
 <div class="flex justify-center gap-4">
 <button 
 @click="showWithdrawModal = true"
 class="bg-white text-blue-900 font-bold px-8 py-3 rounded-2xl text-sm hover:bg-blue-50 transition-colors w-32 shadow-xl shadow-black/10"
 >
 Retrait
 </button>
 <button 
 @click="handleSendInfo"
 class="bg-blue-800 text-white border border-blue-700/50 font-bold px-8 py-3 rounded-2xl text-sm hover:bg-blue-700 transition-colors w-32 shadow-lg shadow-black/10"
 >
 Envoyer
 </button>
 </div>
 </div>

 <!-- Stats grid -->
 <div class="grid grid-cols-2 gap-3">
 <div class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
 <p class="text-[10px] text-blue-100 uppercase font-bold mb-1 opacity-70">En Attente</p>
 <p class="font-bold text-sm">{{ formatPrice(summary.pendingValue) }}</p>
 </div>
 <div class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
 <p class="text-[10px] text-blue-100 uppercase font-bold mb-1 opacity-70">Total Reçu</p>
 <p class="font-bold text-sm">{{ formatPrice(summary.totalPaid) }}</p>
 </div>
 </div>
 </div>

 <!-- Tab Switcher Mobile -->
 <div class="px-6 -mt-4 relative z-20">
 <div class="bg-white p-1.5 rounded-2xl shadow-lg flex gap-1 border border-gray-100 ">
 <button 
 @click="currentTab = 'sales'"
 :class="[
 'flex-1 py-3 rounded-xl text-xs font-bold transition-all',
 currentTab === 'sales' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-400 hover:text-gray-600'
 ]"
 >
 Ventes
 </button>
 <button 
 @click="currentTab = 'payouts'"
 :class="[
 'flex-1 py-3 rounded-xl text-xs font-bold transition-all',
 currentTab === 'payouts' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-400 hover:text-gray-600'
 ]"
 >
 Retraits
 </button>
 </div>
 </div>

 <!-- Transaction History Mobile -->
 <div class="px-6 py-8 pb-24">
 <div class="flex justify-between items-center mb-6">
 <h3 class="font-bold text-lg text-gray-900">{{ currentTab === 'sales' ? 'Détails des Ventes' : 'Historique des Retraits' }}</h3>
 <div class="flex gap-2">
 <button class="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm">
 <i class="fas fa-search text-xs"></i>
 </button>
 <button class="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm">
 <i class="fas fa-filter text-xs"></i>
 </button>
 </div>
 </div>

 <!-- LOADING -->
 <div v-if="loading || transactionsLoading" class="space-y-4">
 <div v-for="i in 3" :key="i" class="h-28 bg-white rounded-2xl animate-pulse border border-gray-100"></div>
 </div>

 <!-- SALES TAB -->
 <div v-else-if="currentTab === 'sales'">
 <div v-if="transactions.length === 0" class="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
 <i class="fas fa-shopping-cart text-3xl text-gray-200 mb-3"></i>
 <p class="text-gray-400 text-sm">Aucune vente enregistrée.</p>
 </div>
 <div v-else class="space-y-4">
 <div v-for="tx in transactions" :key="tx.id" class="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 active:scale-[0.98] transition-transform">
 <div class="flex items-center gap-4 mb-4">
 <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
 <img :src="tx.image || '/placeholder.png'" class="w-full h-full object-cover" />
 </div>
 <div class="flex-1 min-w-0">
 <h4 class="font-bold text-gray-900 text-sm truncate">{{ tx.productName }}</h4>
 <div class="flex items-center gap-2 mt-1">
 <span class="text-[10px] text-gray-400">CMD #{{ tx.orderId }}</span>
 <span class="w-1 h-1 rounded-full bg-gray-300"></span>
 <span class="text-[10px] text-gray-400 capitalize">{{ tx.status }}</span>
 </div>
 </div>
 </div>

 <div class="grid grid-cols-3 gap-2 border-t border-gray-50 pt-4 mb-4">
 <div>
 <p class="text-[9px] text-gray-400 uppercase font-bold mb-1">Montant Brut</p>
 <p class="text-xs font-bold text-gray-900">{{ formatPrice(tx.gross) }}</p>
 </div>
 <div class="text-center">
 <p class="text-[9px] text-gray-400 uppercase font-bold mb-1">Taxe (10%)</p>
 <p class="text-xs font-bold text-red-500">-{{ formatPrice(tx.tax) }}</p>
 </div>
 <div class="text-right">
 <p class="text-[9px] text-gray-400 uppercase font-bold mb-1">Revenu Net</p>
 <p class="text-xs font-bold text-green-600">{{ formatPrice(tx.net) }}</p>
 </div>
 </div>

 <div class="flex justify-between items-center text-[10px] bg-gray-50/50 p-2 rounded-lg">
 <div class="flex flex-col">
 <span class="text-gray-400">Commandé le</span>
 <span class="font-bold text-gray-600">{{ formatDate(tx.orderDate) }} à {{ formatTime(tx.orderDate) }}</span>
 </div>
 <div class="flex flex-col text-right">
 <span class="text-gray-400">Livré le</span>
 <span class="font-bold text-gray-600">{{ tx.deliveryDate ? formatDate(tx.deliveryDate) + ' à ' + formatTime(tx.deliveryDate) : 'En attente' }}</span>
 </div>
 </div>
 </div>

 <!-- Mobile Pagination Sales -->
 <div v-if="transactionsPagination.totalPages > 1" class="flex justify-center gap-4 pt-4">
 <button 
 @click="changePage(transactionsPagination.page - 1)" 
 :disabled="transactionsPagination.page === 1"
 class="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 disabled:opacity-30"
 >
 <i class="fas fa-chevron-left text-xs"></i>
 </button>
 <div class="flex items-center text-xs font-bold text-gray-500">
 {{ transactionsPagination.page }} / {{ transactionsPagination.totalPages }}
 </div>
 <button 
 @click="changePage(transactionsPagination.page + 1)" 
 :disabled="transactionsPagination.page === transactionsPagination.totalPages"
 class="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 disabled:opacity-30"
 >
 <i class="fas fa-chevron-right text-xs"></i>
 </button>
 </div>
 </div>
 </div>

 <!-- PAYOUTS TAB -->
 <div v-else-if="currentTab === 'payouts'">
 <!-- Empty State -->
 <div v-if="payouts.length === 0" class="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
 <i class="fas fa-receipt text-3xl text-gray-200 mb-3"></i>
 <p class="text-gray-400 text-sm">Aucun retrait trouvé.</p>
 </div>

 <!-- List -->
 <div v-else class="space-y-4">
 <div v-for="payout in payouts" :key="payout.id" class="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 border border-gray-100 active:scale-[0.98] transition-transform">
 <div :class="[
 'w-12 h-12 rounded-full flex items-center justify-center',
 payout.status === 'completed' ? 'bg-green-50 text-green-600' : 
 payout.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
 ]">
 <i :class="[
 payout.status === 'completed' ? 'fas fa-check' : 
 payout.status === 'pending' ? 'fas fa-clock' : 'fas fa-times'
 ]"></i>
 </div>
 <div class="flex-1">
 <h4 class="font-bold text-gray-900 text-sm">{{ payout.method || 'Transfert' }}</h4>
 <p class="text-[10px] text-gray-400 font-medium">{{ formatDate(payout.created_at) }}</p>
 </div>
 <div class="text-right">
 <p class="font-bold text-gray-900 text-sm">{{ formatPrice(payout.amount) }}</p>
 <p :class="[
 'text-[10px] font-bold uppercase tracking-wider',
 payout.status === 'completed' ? 'text-green-500' : 
 payout.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
 ]">
 {{ payout.status }}
 </p>
 </div>
 </div>

 <!-- Mobile Pagination Payouts -->
 <div v-if="pagination.totalPages > 1" class="flex justify-center gap-4 pt-4">
 <button 
 @click="changePage(pagination.page - 1)" 
 :disabled="pagination.page === 1"
 class="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 disabled:opacity-30"
 >
 <i class="fas fa-chevron-left text-xs"></i>
 </button>
 <div class="flex items-center text-xs font-bold text-gray-500">
 {{ pagination.page }} / {{ pagination.totalPages }}
 </div>
 <button 
 @click="changePage(pagination.page + 1)" 
 :disabled="pagination.page === pagination.totalPages"
 class="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 disabled:opacity-30"
 >
 <i class="fas fa-chevron-right text-xs"></i>
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- DESKTOP CONTENT (Hidden on Mobile) -->
 <div class="hidden md:block">
 <div class="flex items-center justify-between mb-8">
 <div>
 <h1 class="text-2xl font-bold text-gray-900 ">Mes Paiements</h1>
 <p class="text-gray-500 ">Gérez vos revenus et l'historique de vos transactions</p>
 </div>
 <div class="flex gap-3">
 <button 
 @click="handleSendInfo"
 class="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 :bg-gray-700 transition-colors flex items-center gap-2"
 >
 <i class="fas fa-paper-plane text-xs"></i>
 Envoyer
 </button>
 <button 
 @click="showWithdrawModal = true"
 class="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
 >
 <i class="fas fa-wallet text-xs"></i>
 Demander un Retrait
 </button>
 </div>
 </div>

 <!-- Summary Cards (Desktop Only) -->
 <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
 <!-- Available Balance -->
 <div class="bg-blue-600 p-6 rounded-xl shadow-lg relative overflow-hidden">
 <div class="relative z-10">
 <div class="flex items-center justify-between mb-2">
 <h3 class="text-blue-100 text-sm font-medium uppercase tracking-wider">Solde Retirable</h3>
 <i class="fas fa-wallet text-blue-200"></i>
 </div>
 <p class="text-3xl font-bold text-white">{{ formatPrice(availableBalance) }}</p>
 <p class="text-blue-200 text-xs mt-2">Net des commandes livrées</p>
 </div>
 <i class="fas fa-money-bill-wave absolute -right-4 -bottom-4 text-8xl text-blue-500 opacity-20 transform -rotate-12"></i>
 </div>

 <!-- Pending -->
 <div class="bg-transparent md:bg-white p-6 rounded-xl shadow-none md:shadow border-l-4 border-yellow-500">
 <div class="flex items-center justify-between mb-2">
 <h3 class="text-gray-500 text-sm font-medium uppercase tracking-wider">En Attente</h3>
 <i class="fas fa-clock text-yellow-500"></i>
 </div>
 <p class="text-2xl font-bold text-gray-900 ">{{ formatPrice(summary.pendingValue) }}</p>
 <p class="text-gray-400 text-xs mt-2">Transferts en cours</p>
 </div>

 <!-- Total Received -->
 <div class="bg-transparent md:bg-white p-6 rounded-xl shadow-none md:shadow border-l-4 border-green-500">
 <div class="flex items-center justify-between mb-2">
 <h3 class="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Reçu</h3>
 <i class="fas fa-check-circle text-green-500"></i>
 </div>
 <p class="text-2xl font-bold text-gray-900 ">{{ formatPrice(summary.totalPaid) }}</p>
 <p class="text-gray-400 text-xs mt-2">Depuis le début</p>
 </div>
 </div>

 <!-- DESKTOP TABS -->
 <div class="flex gap-4 mb-6 border-b border-gray-100 mt-8">
 <button 
 @click="currentTab = 'sales'"
 :class="[
 'pb-3 px-4 text-sm font-bold transition-all relative',
 currentTab === 'sales' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
 ]"
 >
 Détails des Ventes
 <div v-if="currentTab === 'sales'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
 </button>
 <button 
 @click="currentTab = 'payouts'"
 :class="[
 'pb-3 px-4 text-sm font-bold transition-all relative',
 currentTab === 'payouts' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
 ]"
 >
 Historique des Retraits
 <div v-if="currentTab === 'payouts'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
 </button>
 </div>

 <!-- SALES TABLE (Desktop) -->
 <div v-if="currentTab === 'sales'" class="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
 <div v-if="transactionsLoading" class="p-12 text-center">
 <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
 <p class="mt-4 text-gray-500">Chargement de vos ventes...</p>
 </div>

 <div v-else-if="transactions.length === 0" class="p-12 text-center">
 <i class="fas fa-shopping-cart text-gray-200 text-4xl mb-4"></i>
 <h4 class="text-lg font-medium text-gray-900 ">Aucune vente</h4>
 <p class="text-gray-500">Vos ventes apparaîtront ici dès qu'elles seront validées.</p>
 </div>

 <div v-else class="overflow-x-auto">
 <table class="min-w-full divide-y divide-gray-200 ">
 <thead class="bg-gray-50 ">
 <tr>
 <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Commande</th>
 <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Livraison</th>
 <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant Brut</th>
 <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Comm. (10%)</th>
 <th class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Réçu</th>
 <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
 </tr>
 </thead>
 <tbody class="bg-white divide-y divide-gray-100 ">
 <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-50 :bg-gray-700/50 transition-colors">
 <td class="px-6 py-4 whitespace-nowrap">
 <div class="flex items-center">
 <div class="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden mr-3 border border-gray-100">
 <img :src="tx.image || '/placeholder.png'" class="h-full w-full object-cover" />
 </div>
 <div>
 <p class="text-sm font-bold text-gray-900 truncate max-w-[150px]">{{ tx.productName }}</p>
 <p class="text-[10px] text-gray-400 font-mono">#{{ tx.orderId }}</p>
 </div>
 </div>
 </td>
 <td class="px-6 py-4 whitespace-nowrap">
 <div class="text-xs">
 <p class="text-gray-600 font-medium"><i class="far fa-calendar-alt mr-1"></i> {{ formatDate(tx.orderDate) }}</p>
 <p v-if="tx.deliveryDate" class="text-green-600 mt-1"><i class="fas fa-truck mr-1"></i> {{ formatDate(tx.deliveryDate) }}</p>
 <p v-else class="text-gray-400 mt-1 italic"><i class="fas fa-clock mr-1"></i> {{ tx.status }}</p>
 </div>
 </td>
 <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 ">
 {{ formatPrice(tx.gross) }}
 </td>
 <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-red-500">
 -{{ formatPrice(tx.tax) }}
 </td>
 <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
 {{ formatPrice(tx.net) }}
 </td>
 <td class="px-6 py-4 whitespace-nowrap text-center">
 <span :class="[
 'px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border',
 tx.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'
 ]">
 {{ tx.status }}
 </span>
 </td>
 </tr>
 </tbody>
 </table>
 </div>

 <!-- Sales Pagination -->
 <div v-if="!transactionsLoading && transactionsPagination.totalPages > 1" class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
 <span class="text-xs text-gray-500">Page {{ transactionsPagination.page }} sur {{ transactionsPagination.totalPages }}</span>
 <div class="flex space-x-2">
 <button 
 @click="changePage(transactionsPagination.page - 1)" 
 :disabled="transactionsPagination.page === 1"
 class="p-1 px-3 border border-gray-200 rounded bg-white text-gray-600 text-xs disabled:opacity-50 hover:bg-gray-50"
 >
 <i class="fas fa-chevron-left"></i>
 </button>
 <button 
 @click="changePage(transactionsPagination.page + 1)" 
 :disabled="transactionsPagination.page === transactionsPagination.totalPages"
 class="p-1 px-3 border border-gray-200 rounded bg-white text-gray-600 text-xs disabled:opacity-50 hover:bg-gray-50"
 >
 <i class="fas fa-chevron-right"></i>
 </button>
 </div>
 </div>
 </div>

 <!-- PAYOUTS TABLE (Desktop) -->
 <div v-if="currentTab === 'payouts'" class="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
 <div class="px-6 py-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
 <h3 class="text-lg font-bold text-gray-900 ">Historique des retraits</h3>
 <div class="flex items-center gap-3">
 <div class="relative w-full sm:w-64">
 <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <i class="fas fa-search text-gray-400 text-xs"></i>
 </span>
 <input 
 v-model="searchQuery" 
 type="text" 
 placeholder="Référence..." 
 class="block w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
 />
 </div>
 </div>
 </div>
 
 <div v-if="loading" class="p-12 text-center">
 <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
 <p class="mt-4 text-gray-500">Chargement de vos retraits...</p>
 </div>

 <div v-else-if="payouts.length === 0" class="p-12 text-center">
 <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
 <i class="fas fa-receipt text-gray-400 text-2xl"></i>
 </div>
 <h4 class="text-lg font-medium text-gray-900 ">Aucun retrait</h4>
 <p class="text-gray-500">Vos demandes apparaîtront ici.</p>
 </div>

 <div v-else class="overflow-x-auto">
 <table class="min-w-full divide-y divide-gray-200 ">
 <thead class="bg-gray-50 ">
 <tr>
 <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
 <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
 <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Méthode</th>
 <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Référence</th>
 <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
 </tr>
 </thead>
 <tbody class="bg-white divide-y divide-gray-100 ">
 <tr v-for="payout in payouts" :key="payout.id" class="hover:bg-gray-50 :bg-gray-700/50 transition-colors">
 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 ">
 {{ formatDate(payout.created_at) }}
 </td>
 <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 ">
 {{ formatPrice(payout.amount) }}
 </td>
 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 ">
 <span class="flex items-center">
 <i v-if="payout.method?.toLowerCase().includes('moncash')" class="fas fa-mobile-alt mr-2 text-red-500"></i>
 <i v-else-if="payout.method?.toLowerCase().includes('bank')" class="fas fa-university mr-2 text-blue-500"></i>
 <i v-else class="fas fa-money-bill mr-2 text-gray-400"></i>
 {{ payout.method || '-' }}
 </span>
 </td>
 <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 ">
 {{ payout.reference || '-' }}
 </td>
 <td class="px-6 py-4 whitespace-nowrap text-center">
 <span :class="{
 'bg-green-100 text-green-700 border border-green-200': payout.status === 'completed',
 'bg-yellow-100 text-yellow-700 border border-yellow-200': payout.status === 'pending',
 'bg-red-100 text-red-700 border border-red-200': payout.status === 'failed'
 }" class="px-3 py-1 inline-flex text-[10px] leading-5 font-bold rounded-full uppercase border tracking-wider">
 {{ payout.status === 'completed' ? 'Completé' : (payout.status === 'pending' ? 'Attente' : 'Échoué') }}
 </span>
 </td>
 </tr>
 </tbody>
 </table>
 </div>

 <!-- Payouts Pagination -->
 <div v-if="!loading && pagination && pagination.totalPages > 1" class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
 <span class="text-xs text-gray-500">Page {{ pagination.page }} sur {{ pagination.totalPages }}</span>
 <div class="flex space-x-2">
 <button 
 @click="changePage(pagination.page - 1)" 
 :disabled="pagination.page === 1"
 class="p-1 px-3 border border-gray-200 rounded bg-white text-gray-600 text-xs disabled:opacity-50 hover:bg-gray-50"
 >
 <i class="fas fa-chevron-left"></i>
 </button>
 <button 
 @click="changePage(pagination.page + 1)" 
 :disabled="pagination.page === pagination.totalPages"
 class="p-1 px-3 border border-gray-200 rounded bg-white text-gray-600 text-xs disabled:opacity-50 hover:bg-gray-50"
 >
 <i class="fas fa-chevron-right"></i>
 </button>
 </div>
 </div>
 </div>
 </div>

 </div>
 </div>
 </div>

 <!-- Withdrawal Modal -->
 <div v-if="showWithdrawModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showWithdrawModal = false"></div>
  <div class="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar animate-in fade-in zoom-in duration-200">
 <div class="p-6">
 <div class="flex justify-between items-center mb-6">
 <h3 class="text-xl font-bold text-gray-900 ">Demander un Retrait</h3>
 <button @click="showWithdrawModal = false" class="text-gray-400 hover:text-gray-600">
 <i class="fas fa-times"></i>
 </button>
 </div>

 <div class="mb-6 bg-blue-50 p-4 rounded-2xl">
 <p class="text-xs text-blue-600 font-bold uppercase mb-1">Solde Retirable (Livré)</p>
 <p class="text-2xl font-bold text-blue-700 ">{{ formatPrice(availableBalance) }}</p>
 </div>

 <form @submit.prevent="handleWithdraw" class="space-y-4">
 <div>
 <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Montant à retirer (HTG)</label>
 <input 
 v-model.number="withdrawForm.amount"
 type="number" 
 required
 step="0.01"
 min="1"
 :max="availableBalance"
 class="w-full bg-gray-50 border-none rounded-2xl p-4 text-lg font-bold focus:ring-2 focus:ring-blue-500"
 placeholder="0.00"
 />
 </div>

 <div>
 <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Méthode de retrait</label>
 <div class="grid grid-cols-2 gap-3">
 <button 
 type="button"
 @click="withdrawForm.method = 'MonCash'"
 :class="[
 'p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2',
 withdrawForm.method === 'MonCash' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'
 ]"
 >
 <i class="fas fa-mobile-alt text-xl"></i>
 <span class="text-xs font-bold">MonCash</span>
 </button>
 <button 
 type="button"
 @click="withdrawForm.method = 'Natcash'"
 :class="[
 'p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2',
 withdrawForm.method === 'Natcash' ? 'border-blue-700 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400'
 ]"
 >
 <i class="fas fa-university text-xl"></i>
 <span class="text-xs font-bold">Natcash</span>
  </button>
  </div>
 </div>

 <!-- Account Info Display -->
 <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 mt-4">
  <div class="mb-3">
   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Informations du compte</label>
   <p class="text-[10px] text-gray-500 mt-1">Saisissez les informations où vous souhaitez recevoir l'argent. Ce numéro sera enregistré par défaut si vous n'en avez pas encore.</p>
  </div>
  
  <div class="space-y-3">
   <div>
    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Numéro {{ withdrawForm.method }}</label>
    <input 
     v-model="withdrawForm.phone" 
     type="text" 
     placeholder="Ex: 3XXX-XXXX" 
     class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
     required
    />
   </div>
   <div>
    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nom sur le compte</label>
    <input 
     v-model="withdrawForm.accountName" 
     type="text" 
     placeholder="Ex: Jean Dupont" 
     class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
     required
    />
   </div>
  </div>
 </div>

 <div class="pt-4">
 <button 
 type="submit"
 :disabled="withdrawing"
 class="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
 >
 <span v-if="withdrawing"><i class="fas fa-spinner fa-spin mr-2"></i>Traitement...</span>
 <span v-else>Confirmer le Retrait</span>
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
