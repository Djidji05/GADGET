<template>
  <div class="w-full lg:pt-4 pb-12">
    <div class="flex flex-col lg:flex-row gap-6 lg:items-start">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content Area -->
      <div class="flex-1 min-h-screen bg-gray-50 rounded-3xl overflow-hidden shadow-sm lg:shadow-md lg:mx-0">

    <!-- MOBILE HEADER (Clean & Minimalist) -->
    <div class="lg:hidden bg-white font-sans relative border-b border-gray-100">
        <div class="px-5 pt-8 pb-6 relative">
            <div class="flex justify-between items-center mb-4 relative z-10">
                <button @click="router.back()" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 border border-gray-100">
                    <i class="fas fa-arrow-left text-xs"></i>
                </button>
                <div class="flex gap-3">
                    <router-link to="/seller/notifications" class="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center relative">
                        <i class="fas fa-bell text-gray-500 text-xs"></i>
                        <span class="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                    </router-link>
                </div>
            </div>

            <div class="relative z-10">
                <h1 class="text-xl font-black text-gray-900 tracking-tight">Commandes</h1>
                <p class="text-gray-400 text-xs font-medium">Gérez vos expéditions</p>
                
                <!-- Search Bar (Integrated) -->
                <div class="mt-4 relative">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 text-xs"></i>
                    <input 
                      v-model="searchQuery" 
                      @input="handleSearch"
                      type="text" 
                      placeholder="Rechercher une commande..." 
                      class="w-full bg-gray-50 text-sm rounded-xl py-3 pl-11 pr-4 border border-gray-100 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all font-medium"
                    />
                </div>
            </div>
        </div>
    </div>

    <!-- MAIN CONTENT CONTAINER -->
    <div class="relative z-20 px-4 pb-24 lg:pb-0 lg:mt-0 lg:px-0">
    
    <!-- Desktop Header -->
    <div class="hidden lg:block bg-white sticky top-0 z-30 px-4 pt-2 pb-2 shadow-sm mb-4 rounded-xl">
        <div class="flex items-center gap-3">
            <h1 class="text-xl font-bold text-gray-900">Commandes</h1>
            <div class="flex-1"></div>
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center relative">
                <i class="fas fa-bell text-gray-500 text-xs"></i>
                <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </div>
        </div>
    </div>

    <!-- Horizontal Status Slider (Refined for better mobile appearance) -->
    <div class="pb-4 sticky top-[70px] z-20 -mx-4 px-4 md:mx-0 md:px-0">
        <div class="flex gap-2 overflow-x-auto pb-3 no-scrollbar snap-x pt-2 px-1">
            <button 
                @click="activeStatusFilter = 'all'"
                :class="activeStatusFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-100'"
                class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all snap-center flex items-center gap-2 active:scale-95"
            >
                Toutes <span class="bg-white/20 px-1.5 rounded-md text-[10px] ml-1">{{ pagination.total }}</span>
            </button>

            <button 
                v-for="status in ['pending', 'partially_paid', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']"
                :key="status"
                @click="activeStatusFilter = status"
                :class="activeStatusFilter === status ? 
                    (status === 'pending' || status === 'partially_paid' ? 'bg-orange-500 text-white' : 
                     status === 'confirmed' ? 'bg-blue-600 text-white' :
                     status === 'processing' ? 'bg-indigo-600 text-white' :
                     status === 'shipped' ? 'bg-purple-600 text-white' :
                     status === 'delivered' ? 'bg-green-600 text-white' :
                     'bg-red-500 text-white') + ' border-transparent' 
                    : 'bg-white text-gray-500 border border-gray-100'"
                class="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all snap-center capitalize flex items-center gap-2 active:scale-95 border"
            >
                {{ 
                    status === 'pending' ? 'En attente' : 
                    status === 'partially_paid' ? 'Paiement Incomplet' : 
                    status === 'confirmed' ? 'Confirmé' : 
                    status === 'processing' ? 'En préparation' : 
                    status === 'shipped' ? 'Expédié' : 
                    status === 'delivered' ? 'Livré' : 'Annulé' 
                }}
                <span :class="activeStatusFilter === status ? 'bg-white/20' : 'bg-gray-50 text-gray-400'" class="px-1.5 rounded-md text-[10px]">{{ countByStatus(status) }}</span>
            </button>
        </div>
    </div>

    <!-- Active Filter Label -->
    <div class="py-4 flex justify-between items-end">
        <div>
            <h2 class="font-bold text-gray-800 text-lg capitalize">{{ activeStatusFilter === 'all' ? 'Toutes les commandes' : (
                activeStatusFilter === 'pending' ? 'En attente' : 
                activeStatusFilter === 'partially_paid' ? 'Paiement Incomplet' : 
                activeStatusFilter === 'confirmed' ? 'Confirmé' : 
                activeStatusFilter === 'processing' ? 'En préparation' : 
                activeStatusFilter
            ) }}</h2>
        </div>
    </div>

    <!-- Orders List (Redesigned) -->
    <div class="space-y-4">
        <div v-if="loading" class="py-12 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
        </div>

        <div v-else-if="orders.length === 0" class="py-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
             <i class="fas fa-inbox text-4xl text-gray-200 mb-3 block"></i>
             <p class="text-gray-400 text-sm">Aucune commande {{ activeStatusFilter !== 'all' ? 'dans cette catégorie' : '' }}</p>
        </div>

        <div v-else v-for="order in orders" :key="order.id" class="bg-white rounded-2xl p-0 shadow-sm border border-gray-100 overflow-hidden transition-all active:scale-[0.99] group hover:shadow-md">
            <!-- New Card Header -->
            <div class="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm"
                        :class="{
                            'bg-orange-100 text-orange-600': order.status === 'pending' || order.status === 'partially_paid',
                            'bg-blue-100 text-blue-600': order.status === 'confirmed',
                            'bg-indigo-100 text-indigo-600': order.status === 'processing',
                            'bg-purple-100 text-purple-600': order.status === 'shipped',
                            'bg-green-100 text-green-600': order.status === 'delivered',
                            'bg-red-100 text-red-600': order.status === 'cancelled'
                        }">
                        <i class="fas" :class="{
                            'fa-clock': order.status === 'pending' || order.status === 'partially_paid',
                            'fa-check': order.status === 'confirmed',
                            'fa-boxes': order.status === 'processing',
                            'fa-truck': order.status === 'shipped',
                            'fa-box': order.status === 'delivered',
                            'fa-times': order.status === 'cancelled'
                        }"></i>
                    </div>
                    <div>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">#{{ formatOrderId(order.id) }}</p>
                        <h3 class="text-sm font-bold text-gray-900 truncate max-w-[120px]">{{ order.user?.name || 'Client Invité' }}</h3>
                        <span v-if="order.status === 'partially_paid'" class="text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-black uppercase">PAIEMENT PARTIEL - NE PAS EXPÉDIER</span>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-[11px] text-gray-500 font-medium bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">{{ formatDate(order.created_at) }}</p>
                </div>
            </div>

            <!-- Items -->
            <div class="p-4">
                 <div class="flex -space-x-2 mb-4 overflow-hidden py-1 pl-1">
                     <template v-for="(item, idx) in order.items.slice(0, 4)" :key="item.id">
                         <img alt="" :src="item.product?.image_url" class="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-100 shadow-sm" />
                     </template>
                     <div v-if="order.items.length > 4" class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm">
                         +{{ order.items.length - 4 }}
                     </div>
                 </div>
                 
                 <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-50 border-dashed">
                     <div class="flex flex-col items-end">
                         <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Prix Client vs Gain Net</p>
                         <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold text-gray-300 line-through">
                              {{ formatPrice(order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0)) }}
                            </span>
                            <span class="text-[9px] font-bold text-red-400 bg-red-50 px-1 rounded">-{{ order.items[0]?.product?.category?.commission_rate || store?.commission_rate || 3 }}%</span>
                            <p class="text-lg font-black text-gray-900">
                                {{ formatPrice(order.items.reduce((acc, i) => acc + ((i.price * i.quantity) * (1 - (i.product?.category?.commission_rate || store?.commission_rate || 3) / 100)), 0)) }} 
                                <span class="text-[10px] opacity-60">HTG</span>
                            </p>
                         </div>
                     </div>
                     <button @click="router.push(`/seller/orders/${order.id}`)" class="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl active:scale-95 transition-transform shadow-lg shadow-gray-200 flex items-center gap-2">
                         <span>Gérer</span>
                         <i class="fas fa-arrow-right text-[10px]"></i>
                     </button>
                 </div>
            </div>
        </div>
    </div>
    


    <!-- Pagination -->
    <div v-if="pagination.total > 0" class="px-4 pt-4 flex justify-center items-center gap-3">
        <button 
            @click="changePage(pagination.page - 1)" 
            :disabled="pagination.page === 1"
            class="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
            <i class="fas fa-chevron-left text-xs"></i>
        </button>
        
        <div class="flex items-center gap-2 mx-1">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page</span>
            <div class="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold shadow-md shadow-gray-200 min-w-[32px] text-center">
                {{ pagination.page }}
            </div>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">sur {{ pagination.totalPages }}</span>
        </div>

        <button 
            @click="changePage(pagination.page + 1)" 
            :disabled="pagination.page === pagination.totalPages"
            class="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
            <i class="fas fa-chevron-right text-xs"></i>
        </button>
    </div>
    
    <!-- End Floating Container -->
    </div>

  </div>
  </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router'; // Add router import
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import { useUiStore } from '@/stores/ui';
import { formatOrderId } from '@/utils/formatters';

const router = useRouter(); // Initialize router
const uiStore = useUiStore();

interface OrderItem {
    id: number;
    price: number;
    quantity: number;
    status: string;
    product: {
        name: string;
        image_url: string;
        category?: {
            commission_rate?: number;
        };
    };
}

interface Order {
    id: number;
    order_number: string;
    created_at: string;
    status: string;
    user: {
        name: string;
    };
    items: OrderItem[];
}

const orders = ref<Order[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const searchTimeout = ref<any>(null);
const activeStatusFilter = ref('all'); // State for active filter

const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
});

// React to filter changes
watch(activeStatusFilter, () => {
    pagination.value.page = 1;
    fetchOrders(1);
});

// React to global navbar search on desktop PC
watch(() => uiStore.globalSearchQuery, (newVal) => {
    searchQuery.value = newVal;
    handleSearch();
});

// Helper to count orders by status (kept for the UI badges but might be inaccurate with pagination)
// Ideally, we'd need a separate endpoint for status counts or get them in each fetch.
// For now, we will count what's in the current list or keep previous logic.
const countByStatus = (status: string) => {
    return orders.value.filter(o => o.status === status).length;
};

const store = ref<any>(null); // Add store ref

const fetchOrders = async (page = 1) => {
    try {
        loading.value = true;
        
        // Check vendor status first
        const storeRes = await api.get('/vendors/me');
        store.value = storeRes.data;

        if (store.value.status !== 'active') {
            console.warn("Store not active, skipping orders fetch");
            orders.value = [];
            return;
        }

        // In a real app we might filter on backend, but for now fetching all for client-side filtering demo
        const res = await api.get(`/vendors/me/orders`, {
            params: {
                page,
                limit: pagination.value.limit,
                search: searchQuery.value || undefined,
                status: activeStatusFilter.value
            }
        });
        orders.value = res.data.orders;
        pagination.value = res.data.pagination;
    } catch (e) {
        console.error("Failed to load orders", e);
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    if (searchTimeout.value) clearTimeout(searchTimeout.value);
    searchTimeout.value = setTimeout(() => {
        pagination.value.page = 1;
        fetchOrders(1);
    }, 500);
};

const clearSearch = () => {
    searchQuery.value = '';
    handleSearch();
};

const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.value.totalPages) {
        fetchOrders(newPage);
    }
};

onMounted(() => fetchOrders());

const updateItemStatus = async (orderId: number, itemId: number, newStatus: string) => {
    let message = 'Mettre à jour le statut ?';
    if (newStatus === 'confirmed') message = 'Accepter cette commande ?';
    if (newStatus === 'cancelled') message = 'Refuser cette commande ?';
    if (newStatus === 'shipped') message = 'Confirmer expédition ?';
    if (newStatus === 'delivered') message = 'Confirmer la livraison au client ?';

    uiStore.confirm({
        title: 'Mise à jour statut',
        message: message,
        onConfirm: async () => {
            try {
                await api.patch(`/vendors/me/orders/${orderId}/items/${itemId}`, { status: newStatus });
                // Optimistic update or reload
                await fetchOrders(pagination.value.page); 
                uiStore.showToast('Statut mis à jour !', 'success');
            } catch (e) {
                console.error("Error updating status", e);
                uiStore.showToast("Erreur lors de la mise à jour", "error");
            }
        }
    });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
};

const formatDate = (date: string) => {
    if (!date) return ''
    return new Date(date).toLocaleString('fr-HT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>
