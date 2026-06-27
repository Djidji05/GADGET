<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';

const router = useRouter();
const loading = ref(true);
const transactions = ref<any[]>([]);
const currentFilter = ref('all');
const selectedTransaction = ref<any>(null);

// Advanced Filter State
const showAdvancedFilter = ref(false);
const selectedPreset = ref('all');
const startDate = ref('');
const endDate = ref('');

// Filter Options
const filters = [
    { label: 'TOUT', value: 'all' },
    { label: 'Dépôts', value: 'deposit' },
    { label: 'Retraits', value: 'withdrawal' },
    { label: 'Livraisons', value: 'delivered' },
    { label: 'Annulations', value: 'cancelled' },
    { label: 'Commandes', value: 'order' }
];

const presets = [
    { label: 'Mois en cours', value: 'current_month' },
    { label: 'Il y a un mois', value: 'last_month' },
    { label: 'Il y a 3 mois', value: 'last_3_months' },
    { label: 'Il y a 6 mois', value: 'last_6_months' }
];

const fetchTransactions = async () => {
    try {
        loading.value = true;
        const res = await api.get('/vendors/me/transactions');
        transactions.value = res.data.transactions || [];
    } catch (e) {
        console.error("Error fetching transactions", e);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchTransactions();
});

const resetFilters = () => {
    selectedPreset.value = 'all';
    startDate.value = '';
    endDate.value = '';
    showAdvancedFilter.value = false;
};

const applyFilters = () => {
    showAdvancedFilter.value = false;
};

// 1. First Level Filter: Type and Date
const filteredTransactions = computed(() => {
    let result = transactions.value;

    // Type Filter
    const f = currentFilter.value;
    if (f !== 'all') {
        result = result.filter(t => {
            const d = t.description?.toLowerCase() || '';
            const type = t.type?.toLowerCase() || '';
            const status = t.status?.toLowerCase() || '';
            
            if (f === 'deposit') return type === 'cash_in' || type === 'deposit' || d.includes('dépot') || d.includes('rechargement');
            if (f === 'withdrawal') return type === 'cash_out' || d.includes('retrait');
            if (f === 'delivered') return d.includes('livrée') || d.includes('delivered') || status.includes('delivered');
            if (f === 'cancelled') return d.includes('annulée') || d.includes('cancelled') || status.includes('cancel') || status.includes('annule');
            if (f === 'order') return type === 'payment' || d.includes('commande') || d.includes('order');
            
            return type === f;
        });
    }

    // Date Filter (Presets or Custom)
    const now = new Date();
    let startLimit: Date | null = null;
    let endLimit: Date | null = null;

    if (startDate.value) startLimit = new Date(startDate.value);
    if (endDate.value) {
        endLimit = new Date(endDate.value);
        endLimit.setHours(23, 59, 59, 999);
    }

    if (!startDate.value && !endDate.value && selectedPreset.value !== 'all') {
        startLimit = new Date();
        startLimit.setHours(0, 0, 0, 0);

        if (selectedPreset.value === 'current_month') {
            startLimit.setDate(1);
        } else if (selectedPreset.value === 'last_month') {
            startLimit.setMonth(now.getMonth() - 1);
        } else if (selectedPreset.value === 'last_3_months') {
            startLimit.setMonth(now.getMonth() - 3);
        } else if (selectedPreset.value === 'last_6_months') {
            startLimit.setMonth(now.getMonth() - 6);
        }
    }

    if (startLimit || endLimit) {
        result = result.filter(t => {
            const tDate = new Date(t.created_at);
            if (isNaN(tDate.getTime())) return false; // Guard against invalid dates
            if (startLimit && tDate < startLimit) return false;
            if (endLimit && tDate > endLimit) return false;
            return true;
        });
    }
    
    return result;
});

// 2. Second Level Filter: Group transactions by date
const groupedTransactions = computed(() => {
    const groups: { [key: string]: any[] } = {};
    filteredTransactions.value.forEach(t => {
        const dateObj = t.created_at ? new Date(t.created_at) : new Date();
        const date = dateObj.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(t);
    });
    
    // Convert to sorted array
    return Object.entries(groups).map(([date, items]) => ({
        date,
        items: items.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        })
    })).sort((a, b) => {
        const dateA = a.date.split('/').reverse().join('-');
        const dateB = b.date.split('/').reverse().join('-');
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
});

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-HT', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
};

const formatAmount = (tx: any) => {
    const amount = Number(tx.amount) || 0;
    const sign = tx.type === 'cash_in' || tx.type === 'refund' || (tx.type === 'transfer' && tx.is_credit) || tx.type === 'payment' ? '+' : '-';
    return `${sign}${formatPrice(amount)}`;
};

const getStatusClass = (status: string) => {
    if (!status) return 'bg-gray-50 text-gray-600';
    const s = status.toLowerCase();
    if (s.includes('success') || s.includes('complete') || s.includes('delivered') || s.includes('confirme')) {
        return 'bg-green-50 text-green-600';
    }
    if (s.includes('fail') || s.includes('cancel') || s.includes('annule')) {
        return 'bg-red-50 text-red-600';
    }
    if (s.includes('pending') || s.includes('attente') || s.includes('shipped')) {
        return 'bg-orange-50 text-orange-600';
    }
    return 'bg-gray-50 text-gray-600';
};

const getIcon = (type: string, description: string = '') => {
    const t = type?.toLowerCase() || '';
    const d = description?.toLowerCase() || '';
    
    if (d.includes('dépot') || d.includes('rechargement')) return 'fa-university text-blue-500';
    if (d.includes('livrée') || d.includes('delivered')) return 'fa-check-circle text-green-500';
    if (d.includes('annulée') || d.includes('cancelled')) return 'fa-times-circle text-red-500';
    if (d.includes('commande') || d.includes('order')) return 'fa-shopping-bag text-blue-500';
    
    switch (t) {
        case 'payment': return 'fa-wallet text-blue-500';
        case 'transfer': return 'fa-exchange-alt text-blue-500';
        case 'cash_in': return 'fa-arrow-down text-green-500';
        case 'cash_out': return 'fa-arrow-up text-red-500';
        case 'deposit': return 'fa-university text-blue-500';
        default: return 'fa-receipt text-gray-400';
    }
};

const formatTime = (dateStr: string) => {
    // If dateStr is missing, try to use current date as last resort but ideally we want the transaction date
    const date = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(date.getTime())) return 'Date invalide';
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `${day}-${month} ${time}`;
};

const getTransactionTitle = (tx: any) => {
    const d = tx.description?.toLowerCase() || '';
    const type = tx.type?.toLowerCase();
    
    if (d.includes('livrée') || d.includes('delivered')) return 'Vente finalisée';
    if (d.includes('annulée') || d.includes('cancelled')) return 'Commande retournée';
    if (d.includes('dépot') || d.includes('rechargement') || type === 'deposit') return 'Approvisionnement';
    if (d.includes('commande') || type === 'payment') return 'Facturation vente';
    if (d.includes('transfert') || type === 'transfer') return 'Virement interne';
    
    return tx.description && tx.description !== 'Transaction' ? tx.description : 'Opération financière';
};

const getTransactionCategory = (tx: any) => {
    const type = tx.type?.toLowerCase();
    const d = tx.description?.toLowerCase() || '';
    
    if (d.includes('dépot') || type === 'deposit' || type === 'cash_in') return 'Dépôt';
    if (d.includes('retrait') || type === 'cash_out') return 'Retrait';
    if (d.includes('livrée') || d.includes('delivered')) return 'Livraison';
    if (d.includes('annulée') || d.includes('cancelled')) return 'Annulation';
    if (type === 'payment' || d.includes('commande')) return 'Paiement';
    if (type === 'transfer') return 'Transfert';
    
    return 'Détails';
};
</script>

<template>
  <div class="w-full font-sans bg-gray-50/50 min-h-screen pt-4 pb-12">
        <div class="flex flex-col lg:flex-row gap-6">
            <SellerSidebar />
            
            <div class="flex-1">
                <!-- MOBILE FIXED TOP NAVBAR -->
                <div v-if="!selectedTransaction" class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-50 shadow-sm border-b border-gray-200/50">
                    <div class="px-4 pt-4 pb-2">
                        <!-- Header -->
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-4">
                                <button @click="router.back()" class="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 text-gray-600 active:scale-95 transition-all">
                                    <i class="fas fa-chevron-left text-xs"></i>
                                </button>
                                <h1 class="text-xl font-black text-gray-900 tracking-tight">Transactions</h1>
                            </div>
                            <button @click="showAdvancedFilter = true" class="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 active:scale-95 transition-all shadow-sm">
                                <i class="fas fa-filter text-xs"></i>
                            </button>
                        </div>

                        <!-- Filters -->
                        <div class="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide no-scrollbar">
                            <button 
                                v-for="filter in filters" 
                                :key="filter.value"
                                @click="currentFilter = filter.value"
                                class="px-5 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all border shadow-sm"
                                :class="currentFilter === filter.value 
                                    ? 'bg-blue-50 text-blue-600 border-blue-200 ring-2 ring-blue-100/50' 
                                    : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'"
                            >
                                {{ filter.label }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Spacer for Fixed Navbar on Mobile -->
                <div v-if="!selectedTransaction" class="lg:hidden h-[120px]"></div>

                <!-- Desktop Header -->
                <div class="hidden lg:flex items-center justify-between mb-10">
                    <div>
                        <h1 class="text-4xl font-black text-gray-900 mb-2">Historique financier</h1>
                        <p class="text-gray-500 font-medium">Consultez tous vos flux de fonds et transactions</p>
                    </div>
                    <button @click="showAdvancedFilter = true" class="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100/50 transition-all font-bold shadow-sm">
                        <i class="fas fa-filter"></i>
                        <span>Filtre avancé</span>
                    </button>
                </div>

                <!-- Desktop Filters (Hidden on Mobile) -->
                <div class="hidden lg:flex gap-3 overflow-x-auto pb-8 px-4 scrollbar-hide no-scrollbar">
                    <button 
                        v-for="filter in filters" 
                        :key="filter.value"
                        @click="currentFilter = filter.value"
                        class="px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all border shadow-sm"
                        :class="currentFilter === filter.value 
                            ? 'bg-blue-50 text-blue-600 border-blue-200 ring-2 ring-blue-100/50' 
                            : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'"
                    >
                        {{ filter.label }}
                    </button>
                </div>

                <!-- Transactions List -->
                <div v-if="loading" class="space-y-6">
                    <div v-for="i in 2" :key="i" class="animate-pulse bg-gray-200/50 h-48 rounded-[32px] w-full"></div>
                </div>

                <!-- Mobile View -->
                <div v-else-if="groupedTransactions.length > 0" class="lg:hidden space-y-10">
                    <div v-for="group in groupedTransactions" :key="group.date" class="space-y-5">
                        <h2 class="text-xs font-black text-gray-400 px-1 tracking-[0.2em] uppercase">{{ group.date }}</h2>
                        
                        <div class="bg-white rounded-[32px] shadow-xl shadow-gray-200/40 border border-gray-100/80 overflow-hidden">
                            <div v-for="(tx, index) in group.items" :key="tx.id">
                                <!-- Divider -->
                                <div v-if="index > 0" class="border-t border-dashed border-gray-300 mx-6"></div>
                                
                                <div @click="selectedTransaction = tx" class="p-6 flex flex-col gap-1 transition-all active:bg-gray-50/40 cursor-pointer">
                                    <!-- Top Row: Time & Status -->
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="text-[12px] font-bold text-gray-400">
                                            {{ formatTime(tx.created_at) }}
                                        </span>
                                        <span :class="getStatusClass(tx.status)" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-black/5 shadow-sm">
                                            {{ tx.status === 'successed' || tx.status === 'success' || tx.status === 'completed' ? 'Successed' : tx.status }}
                                        </span>
                                    </div>

                                    <!-- Content Row -->
                                    <div class="flex items-center gap-5">
                                        <!-- Leading Icon -->
                                        <div class="w-12 h-12 flex items-center justify-center">
                                            <i class="fas" :class="getIcon(tx.type, tx.description) + ' text-3xl opacity-80'"></i>
                                        </div>
                                        
                                        <!-- Middle Info -->
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center gap-2 mb-0.5">
                                                <span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100/50 text-blue-600 uppercase tracking-tighter">
                                                    {{ getTransactionCategory(tx) }}
                                                </span>
                                            </div>
                                            <h3 class="font-bold text-[17px] text-gray-900 leading-tight mb-1 break-words">
                                                {{ getTransactionTitle(tx) }}
                                            </h3>
                                            <p class="text-[12px] text-gray-400 font-bold opacity-80 uppercase tracking-tighter break-all">
                                                TID: {{ tx.transaction_id || tx.id }}
                                            </p>
                                        </div>

                                        <!-- Right side: Amount & Footer -->
                                        <div class="text-right flex flex-col items-end whitespace-nowrap">
                                            <div v-if="tx.type === 'payment' && tx.gross_amount" class="flex flex-col items-end mb-1">
                                                <span class="text-[10px] text-gray-300 line-through leading-none">{{ formatPrice(tx.gross_amount) }}</span>
                                                <span class="text-[9px] text-red-400 font-bold bg-red-50 px-1 rounded mt-0.5">-{{ ((tx.fee / tx.gross_amount) * 100).toFixed(0) }}%</span>
                                            </div>
                                            <p class="font-black text-lg leading-none mb-1.5" :class="tx.is_credit || tx.type === 'payment' ? 'text-green-600' : 'text-gray-900'">
                                                {{ formatAmount(tx) }} <span class="text-[11px] opacity-60">HTG</span>
                                            </p>
                                            <p class="text-[11px] text-gray-500 font-black opacity-60 uppercase truncate max-w-[80px]">
                                                {{ tx.partner_name || tx.creator_name || tx.from_user?.name || 'System' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Desktop Table View -->
                <div v-else-if="filteredTransactions.length > 0" class="hidden lg:block bg-white rounded-[32px] shadow-xl shadow-gray-200/40 border border-gray-100/80 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <th class="px-8 py-4">Transaction ID / Date</th>
                                    <th class="px-8 py-4">Type</th>
                                    <th class="px-8 py-4">Libellé / Description</th>
                                    <th class="px-8 py-4">Origine / Destinataire</th>
                                    <th class="px-8 py-4 text-center">Statut</th>
                                    <th class="px-8 py-4 text-right">Montant</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr 
                                    v-for="tx in filteredTransactions" 
                                    :key="tx.id" 
                                    @click="selectedTransaction = tx"
                                    class="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                                >
                                    <td class="px-8 py-4">
                                        <p class="text-[12px] text-gray-400 font-bold opacity-80 uppercase tracking-tighter break-all">
                                            TID: {{ tx.transaction_id || tx.id }}
                                        </p>
                                        <p class="text-xs text-gray-500 mt-0.5">{{ formatTime(tx.created_at) }}</p>
                                    </td>
                                    <td class="px-8 py-4">
                                        <span class="text-[10px] font-black px-2 py-1 rounded-md bg-blue-50 text-blue-600 uppercase tracking-tighter">
                                            {{ getTransactionCategory(tx) }}
                                        </span>
                                    </td>
                                    <td class="px-8 py-4">
                                        <p class="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">{{ getTransactionTitle(tx) }}</p>
                                    </td>
                                    <td class="px-8 py-4 text-sm text-gray-600 font-medium">
                                        {{ tx.partner_name || tx.creator_name || tx.from_user?.name || 'System' }}
                                    </td>
                                    <td class="px-8 py-4 text-center">
                                        <span :class="getStatusClass(tx.status)" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-black/5">
                                            {{ tx.status === 'successed' || tx.status === 'success' || tx.status === 'completed' ? 'Successed' : tx.status }}
                                        </span>
                                    </td>
                                    <td class="px-8 py-4 text-right whitespace-nowrap">
                                        <div v-if="tx.type === 'payment' && tx.gross_amount" class="flex flex-col items-end mb-0.5">
                                            <span class="text-[10px] text-gray-300 line-through leading-none">{{ formatPrice(tx.gross_amount) }}</span>
                                            <span class="text-[9px] text-red-400 font-bold bg-red-50 px-1 rounded mt-0.5">-{{ ((tx.fee / tx.gross_amount) * 100).toFixed(0) }}%</span>
                                        </div>
                                        <span class="text-sm font-bold font-mono" :class="tx.is_credit || tx.type === 'payment' ? 'text-green-600' : 'text-gray-900'">
                                            {{ formatAmount(tx) }} <span class="text-[11px] opacity-60">HTG</span>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                    <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <i class="fas fa-receipt text-4xl text-gray-200"></i>
                    </div>
                    <h3 class="text-xl font-black text-gray-900 mb-2 tracking-tight">Aucun mouvement</h3>
                    <p class="text-gray-400 font-medium max-w-[240px] mx-auto text-sm leading-relaxed">Votre historique de transactions est vide pour le moment.</p>
                </div>
            </div>
        </div>

        <!-- TRANSACTION DETAIL OVERLAY -->
        <div v-if="selectedTransaction" class="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 md:p-4">
            <!-- Backdrop click to close on PC -->
            <div @click="selectedTransaction = null" class="absolute inset-0 hidden md:block"></div>
            
            <!-- Modal Card -->
            <div class="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-xl bg-gray-50 rounded-none md:rounded-[40px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <!-- Header -->
                <div class="flex items-center px-6 py-6 md:py-5 justify-between bg-white border-b border-gray-100 shrink-0">
                    <button @click="selectedTransaction = null" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-900 active:scale-95 transition-all">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                    <h2 class="text-[18px] font-bold text-gray-900 tracking-tight">Détails de la transaction</h2>
                    <div class="w-10"></div> <!-- Spacer -->
                </div>

                <!-- Scrollable Content -->
                <div class="flex-1 overflow-y-auto px-6 py-6 space-y-8 no-scrollbar scrollbar-hide">
                <!-- Large Status Icon Section -->
                <div class="flex flex-col items-center justify-center py-8">
                    <div class="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200 border-4 border-white mb-6 animate-bounce-subtle">
                        <i class="fas fa-check text-5xl text-white"></i>
                    </div>
                    <h3 class="text-3xl font-black text-gray-900 mb-1 tracking-tight">{{ selectedTransaction.status || 'Successed' }}</h3>
                    <p class="text-gray-400 font-bold uppercase tracking-widest text-xs opacity-80">
                        {{ selectedTransaction.type === 'transfer' ? 'Transfer wallet to wallet' : (selectedTransaction.description || 'Service Transaction') }}
                    </p>
                </div>

                <!-- Amount Information Card -->
                <div class="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/40 border border-gray-100/80">
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-gray-400 font-bold text-[15px] max-w-[140px] leading-tight opacity-90">Montant de la transaction</span>
                        <span class="text-2xl font-black tracking-tight" :class="selectedTransaction.type === 'cash_in' || selectedTransaction.type === 'refund' || selectedTransaction.is_credit ? 'text-green-600' : 'text-gray-900'">
                           {{ formatAmount(selectedTransaction) }}
                        </span>
                    </div>
                    
                    <div class="border-t border-dashed border-gray-100 -mx-8 mb-6"></div>

                    <div class="flex justify-between items-center text-[13px] font-bold">
                        <span class="text-gray-400 opacity-70">TID: {{ selectedTransaction.transaction_id || selectedTransaction.id }}</span>
                        <span class="text-gray-400 opacity-70">{{ formatTime(selectedTransaction.created_at) }}</span>
                    </div>
                </div>

                <!-- Details Section -->
                <div class="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/40 border border-gray-100/80">
                    <h4 class="text-xs font-black text-gray-900 mb-8 uppercase tracking-[0.15em] opacity-90">DETAILS DE LA TRANSACTION</h4>
                    
                    <div class="space-y-6">
                        <div class="flex justify-between items-start gap-4">
                            <span class="text-[14px] text-gray-300 font-bold whitespace-nowrap">Nom de l'expediteur</span>
                            <span class="text-[15px] font-black text-gray-900 text-right uppercase tracking-tighter leading-tight">
                                {{ selectedTransaction.partner_name || selectedTransaction.creator_name || selectedTransaction.from_user?.name || 'Inconnu' }}
                            </span>
                        </div>
                        <div class="flex justify-between items-center gap-4">
                            <span class="text-[14px] text-gray-300 font-bold whitespace-nowrap">Telephone de l'expediteur</span>
                            <span class="text-[15px] font-black text-gray-900 text-right tracking-tight">
                                {{ selectedTransaction.sender_phone || selectedTransaction.from_user?.phone || '...' }}
                            </span>
                        </div>
                        <div class="flex justify-between items-center gap-4">
                            <span class="text-[14px] text-gray-300 font-bold whitespace-nowrap">Service</span>
                            <span class="text-[15px] font-black text-gray-900 text-right tracking-tight">
                                {{ getTransactionCategory(selectedTransaction) }}
                            </span>
                        </div>
                        <div class="flex justify-between items-start gap-4">
                            <span class="text-[14px] text-gray-300 font-bold whitespace-nowrap">Contenu</span>
                            <span class="text-[14px] font-medium text-gray-400 text-right max-w-[180px] leading-relaxed italic">
                                {{ selectedTransaction.description || 'Dernière transaction de service effectuée.' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Payment Details Section -->
                <div class="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/40 border border-gray-100/80">
                    <h4 class="text-xs font-black text-gray-900 mb-8 uppercase tracking-[0.15em] opacity-90">DETAILS DE PAIEMENT</h4>
                    
                    <div class="space-y-5">
                        <template v-if="selectedTransaction.type === 'payment' && selectedTransaction.gross_amount">
                            <div class="flex justify-between items-center text-sm font-bold">
                                <span class="text-gray-300">Prix payé par le client</span>
                                <span class="text-gray-900 line-through">{{ formatPrice(selectedTransaction.gross_amount) }} HTG</span>
                            </div>
                            <div class="flex justify-between items-center text-sm font-bold">
                                <span class="text-gray-300">Commission GadgetZone</span>
                                <span class="text-red-500">- {{ formatPrice(selectedTransaction.fee) }} HTG</span>
                            </div>
                        </template>

                        <div class="flex justify-between items-center text-sm font-bold">
                            <span class="text-gray-300">{{ selectedTransaction.type === 'payment' ? 'Votre Revenu Net' : 'Montant' }}</span>
                            <span class="text-gray-900">{{ formatAmount(selectedTransaction) }} HTG</span>
                        </div>
                        
                        <div class="flex justify-between items-center pt-2 border-t border-gray-50 mt-2">
                             <span class="text-gray-300 font-bold text-sm">Crédité au Portefeuille</span>
                             <span class="text-lg font-black text-gray-900 underline decoration-blue-100 underline-offset-8">
                                {{ formatAmount(selectedTransaction) }} HTG
                             </span>
                        </div>
                    </div>
                </div>

                <!-- Progress Section -->
                <div class="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/40 border border-gray-100/80">
                    <div class="flex justify-between items-center mb-6">
                        <h4 class="text-xs font-black text-gray-900 uppercase tracking-[0.15em] opacity-90">TRANSACTION EN COURS</h4>
                    </div>
                    <div class="flex justify-between items-center text-xs font-bold">
                        <span class="text-gray-400">{{ formatTime(selectedTransaction.created_at) }}</span>
                        <span class="text-green-500 font-black uppercase tracking-widest">{{ selectedTransaction.status || 'Successed' }}</span>
                    </div>
                </div>

                <!-- Footer Action Bar - Now inside scrolling flow -->
                <div class="pt-4 flex gap-4 items-center justify-between">
                    <button class="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-bold text-[13px] uppercase tracking-wider active:scale-95 transition-all">
                        <i class="fas fa-share-alt text-[12px]"></i>
                        Partager
                    </button>
                    <div class="w-[1px] h-6 bg-gray-100"></div>
                    <button class="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white text-gray-400 font-bold text-[13px] uppercase tracking-tighter active:scale-95 transition-all">
                        <i class="fas fa-arrow-down text-[12px]"></i>
                        Télécharger
                    </button>
                </div>
            </div>
        </div>
    </div>

        <!-- ADVANCED FILTER MODAL (BOTTOM SHEET) -->
        <div v-if="showAdvancedFilter" class="fixed inset-0 z-[1200] flex items-end md:items-center md:justify-center p-0 md:p-4">
            <!-- Backdrop -->
            <div @click="showAdvancedFilter = false" class="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"></div>
            
            <!-- Sheet Content -->
            <div class="relative w-full md:max-w-md bg-white rounded-t-[40px] md:rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                <div class="p-8">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-[20px] font-black text-gray-900 tracking-tight">Filtre avancé</h2>
                        <button @click="showAdvancedFilter = false" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 active:scale-95 transition-all">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <!-- Presets Grid -->
                    <div class="grid grid-cols-2 gap-4 mb-10">
                        <button 
                            v-for="preset in presets" 
                            :key="preset.value"
                            @click="selectedPreset = preset.value; startDate = ''; endDate = ''"
                            class="px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-all border shadow-sm text-center"
                            :class="selectedPreset === preset.value && !startDate && !endDate
                                ? 'bg-blue-50 text-blue-600 border-blue-200 ring-2 ring-blue-100/50' 
                                : 'bg-gray-50/50 text-gray-400 border-gray-100 hover:bg-gray-50'"
                        >
                            {{ preset.label }}
                        </button>
                    </div>

                    <!-- Custom Date Options -->
                    <div class="space-y-6 mb-10">
                        <h3 class="text-[16px] font-black text-gray-900 tracking-tight">Options de temps</h3>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-[12px] font-bold text-gray-400">Date de début</label>
                                <div class="relative">
                                    <input 
                                        type="date" 
                                        v-model="startDate"
                                        @change="selectedPreset = 'all'"
                                        class="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-[14px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    >
                                    <i class="fas fa-calendar-alt absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"></i>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-[12px] font-bold text-gray-400">Date de fin</label>
                                <div class="relative">
                                    <input 
                                        type="date" 
                                        v-model="endDate"
                                        @change="selectedPreset = 'all'"
                                        class="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-[14px] font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    >
                                    <i class="fas fa-calendar-alt absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-4">
                        <button 
                            @click="resetFilters"
                            class="flex-1 py-4 rounded-2xl border-2 border-blue-500 text-blue-500 font-black text-[15px] uppercase tracking-widest active:scale-95 transition-all"
                        >
                            Reset
                        </button>
                        <button 
                            @click="applyFilters"
                            class="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black text-[15px] uppercase tracking-widest shadow-lg shadow-blue-200 active:scale-95 transition-all"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-bounce-subtle {
    animation: bounce-subtle 3s infinite;
}

@keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}

/* Slide in animation for overlay */
.animate-in {
    animation-duration: 0.3s;
    animation-fill-mode: both;
}

.fade-in {
    animation-name: fadeIn;
}

.slide-in-from-bottom-4 {
    animation-name: slideInBottom;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideInBottom {
    from { transform: translateY(1rem); }
    to { transform: translateY(0); }
}
</style>
