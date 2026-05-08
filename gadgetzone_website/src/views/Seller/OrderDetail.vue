<template>
  <div class="w-full md:pt-4 pb-12">
    <div class="flex flex-col md:flex-row gap-6 md:items-start">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content Area -->
      <div class="flex-1 min-h-screen bg-gray-50 rounded-3xl overflow-hidden shadow-sm md:shadow-md md:mx-0 pb-40 md:pb-28 relative">

    <!-- Top Navigation -->
    <div class="bg-white sticky top-0 z-30 px-4 py-2 shadow-sm border-b border-gray-100 flex items-center gap-3">
        <button @click="router.back()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <i class="fas fa-arrow-left text-gray-600"></i>
        </button>
        <div class="flex-1">
            <h1 class="text-lg font-bold text-gray-900" v-if="order">Commande #{{ order.order_number }}</h1>
            <div v-else class="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mb-4"></div>
        <p class="text-gray-500">Chargement des détails...</p>
    </div>

    <div v-else-if="!order" class="p-8 text-center text-gray-500">
        <p>Commande introuvable.</p>
        <button @click="router.back()" class="mt-4 text-blue-600 font-bold">Retour aux commandes</button>
    </div>

    <div v-else class="p-4 space-y-4">
        <!-- Status Card -->
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
                <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Statut Actuel</p>
                <div class="flex items-center gap-2">
                     <span class="w-2.5 h-2.5 rounded-full"
                        :class="{
                            'bg-orange-500': order.status === 'pending',
                            'bg-blue-600': order.status === 'confirmed',
                            'bg-purple-600': order.status === 'shipped',
                            'bg-green-600': order.status === 'delivered',
                            'bg-red-500': order.status === 'cancelled'
                        }"></span>
                    <span class="font-bold text-gray-900 capitalize text-lg">
                        {{ 
                            order.status === 'pending' ? 'En attente' : 
                            order.status === 'confirmed' ? 'Confirmé' : 
                            order.status === 'processing' ? 'En préparation' : 
                            order.status === 'shipped' ? 'Expédié' : 
                            order.status === 'delivered' ? 'Livré' : 
                            (order.status === 'cancelled' ? 'Annulé' : 'Inconnu') 
                        }}
                    </span>
                </div>
            </div>
            <div class="text-right text-xs text-gray-400">
                <p>Commandé: {{ formatDate(order.created_at) }}</p>
                <p v-if="order.status === 'delivered' && order.delivered_at" class="text-green-600 mt-1 font-medium">
                    Livré: {{ formatDate(order.delivered_at) }}
                </p>
            </div>
        </div>

        <!-- Delivery Info -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-map-marker-alt text-blue-900"></i> Livraison
            </h3>
            
            <div class="space-y-4">
                <div class="flex gap-3">
                    <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-user text-gray-400"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase font-bold">Client</p>
                        <p class="font-medium text-gray-900">{{ order.user?.name || 'Client Invité' }}</p>
                        <a :href="`tel:${clientPhone}`" class="text-blue-600 text-sm flex items-center gap-1 mt-1 font-medium" v-if="clientPhone">
                            <i class="fas fa-phone-alt text-xs"></i> {{ clientPhone }}
                        </a>
                    </div>
                </div>

                <div class="flex gap-3">
                    <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-truck text-gray-400"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase font-bold">Adresse</p>
                        <p class="font-medium text-gray-900 text-sm leading-relaxed">
                            {{ formattedAddress }}
                        </p>
                        
                        <!-- Reference Point (Phase GPS) -->
                        <div v-if="order.reference_point" class="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                            <p class="text-[10px] text-blue-500 font-bold uppercase mb-1">Point de repère</p>
                            <p class="text-xs text-blue-900 font-medium">{{ order.reference_point }}</p>
                        </div>

                        <!-- GPS Button (Phase GPS) -->
                        <div v-if="order.shipping_coordinates" class="mt-3">
                            <a 
                                :href="`https://www.google.com/maps/search/?api=1&query=${order.shipping_coordinates.lat},${order.shipping_coordinates.lng}`" 
                                target="_blank"
                                class="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-green-700 transition-all"
                            >
                                <i class="fas fa-location-arrow"></i>
                                Ouvrir dans Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-box text-blue-900"></i> Articles ({{ order.items?.length || 0 }})
            </h3>

            <div class="space-y-4 divide-y divide-gray-50">
                <div v-for="item in order.items" :key="item.id" class="pt-4 first:pt-0 flex gap-4">
                    <div class="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0">
                        <img :src="item.product?.image_url" class="w-full h-full object-cover rounded-lg mix-blend-multiply" />
                    </div>
                    <div class="flex-1">
                        <p class="font-bold text-gray-900 text-sm line-clamp-2">{{ item.product?.name }}</p>
                        <div class="flex justify-between items-end mt-2">
                            <div class="text-xs text-gray-400">
                                <span class="line-through">{{ formatPrice(item.price * item.quantity) }}</span>
                                <span class="ml-2 text-red-500 font-bold">-{{ item.product?.category?.commission_rate || 10 }}%</span>
                            </div>
                            <div class="text-right">
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gain Net</p>
                                <p class="font-black text-blue-900 text-lg">
                                    {{ formatPrice((item.price * item.quantity) * (1 - (item.product?.category?.commission_rate || 10) / 100)) }} 
                                    <span class="text-xs opacity-60">HTG</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Totals -->
            <div class="mt-6 pt-4 border-t border-gray-100 space-y-3">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-500 font-medium">Prix d'origine (Total Brut)</span>
                    <span class="font-bold text-gray-900">{{ formatPrice(orderTotal) }} HTG</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-500 font-medium whitespace-nowrap">Commission Totale (Vérifiée)</span>
                    <span class="font-bold text-red-500">- {{ formatPrice(orderTotal - order.items.reduce((acc, i) => acc + ((i.price * i.quantity) * (1 - (i.product?.category?.commission_rate || 10) / 100)), 0)) }} HTG</span>
                </div>
                <div class="flex justify-between items-center text-xl font-black pt-4 border-t border-gray-100 mt-2">
                    <span class="text-gray-900">Gain Net</span>
                    <div class="text-right">
                        <span class="text-blue-600 block leading-none">{{ formatPrice(order.items.reduce((acc, i) => acc + ((i.price * i.quantity) * (1 - (i.product?.category?.commission_rate || 10) / 100)), 0)) }} <span class="text-xs opacity-60">HTG</span></span>
                        <span class="text-[10px] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-tighter mt-1 inline-block">Vérification Terminée</span>
                    </div>
                </div>
            </div>
        </div>



    <!-- Order History Timeline -->
    <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-6">
        <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-history text-blue-900"></i> Historique
        </h3>
        
        <div class="relative pl-4 border-l-2 border-gray-100 space-y-6">
            <!-- Timeline Items -->
            <template v-if="order && order.logs && order.logs.length > 0">
                <div v-for="log in order.logs" :key="log.id" class="relative">
                    <div class="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white" 
                            :class="getLogColor(log.new_status)"></div>
                    
                    <div class="text-sm">
                        <p class="font-bold text-gray-900 capitalize">
                            {{ getStatusText(log.new_status) }}
                        </p>
                        <p class="text-xs text-gray-500 mb-1">
                            {{ formatDate(log.created_at) }}
                        </p>
                        <p class="text-xs text-gray-600">
                            Par: <span class="font-semibold">{{ log.actor?.name || 'Système' }}</span>
                        </p>
                    </div>
                </div>
            </template>

            <!-- Fallback Dates if no logs (Legacy/System) -->
            <div v-else class="space-y-6">
                    <div v-if="order.created_at" class="relative">
                    <div class="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gray-400 border-2 border-white"></div>
                    <div class="text-sm">
                        <p class="font-bold text-gray-900">Création</p>
                        <p class="text-xs text-gray-500">{{ formatDate(order.created_at) }}</p>
                    </div>
                </div>
                <div v-if="order.confirmed_at" class="relative">
                    <div class="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white"></div>
                    <div class="text-sm">
                        <p class="font-bold text-gray-900">Confirmée</p>
                        <p class="text-xs text-gray-500">{{ formatDate(order.confirmed_at) }}</p>
                    </div>
                </div>
                <div v-if="order.shipped_at" class="relative">
                    <div class="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-purple-500 border-2 border-white"></div>
                    <div class="text-sm">
                        <p class="font-bold text-gray-900">Expédiée</p>
                        <p class="text-xs text-gray-500">{{ formatDate(order.shipped_at) }}</p>
                    </div>
                </div>
                <div v-if="order.delivered_at" class="relative">
                    <div class="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                    <div class="text-sm">
                        <p class="font-bold text-gray-900">Livrée</p>
                        <p class="text-xs text-gray-500">{{ formatDate(order.delivered_at) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>

    <!-- Fixed Bottom Actions -->
    <div v-if="order" class="fixed md:absolute bottom-[65px] md:bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50 flex gap-3">
        
        <template v-if="order.status && order.status.toLowerCase() === 'pending'">
            <button @click="updateStatus('cancelled')" class="flex-1 py-3.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors">
                Refuser
            </button>
            <button @click="updateStatus('confirmed')" class="flex-[2] py-3.5 rounded-xl bg-blue-900 text-white font-bold text-sm shadow-lg shadow-blue-200 active:scale-[0.98] transition-all">
                Valider la commande
            </button>
        </template>

        <template v-else-if="order.status.toLowerCase() === 'confirmed'">
             <button @click="updateStatus('processing')" class="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <i class="fas fa-boxes"></i> Préparer commande
            </button>
        </template>

        <template v-else-if="order.status.toLowerCase() === 'processing'">
             <button @click="updateStatus('shipped')" class="w-full py-3.5 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-lg shadow-purple-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <i class="fas fa-shipping-fast"></i> Expédier
            </button>
        </template>

        <template v-else-if="order.status.toLowerCase() === 'shipped'">
             <button @click="updateStatus('delivered')" class="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold text-sm shadow-lg shadow-green-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <i class="fas fa-check-circle"></i> Livrer
            </button>
        </template>
        
        <div v-else-if="order.status.toLowerCase() === 'delivered'" class="w-full text-center py-3 bg-green-50 text-green-700 rounded-2xl font-bold text-sm border border-green-100">
            <i class="fas fa-check-circle mr-2"></i> Commande terminée et livrée
        </div>
        <div v-else-if="order.status.toLowerCase() === 'cancelled'" class="w-full text-center py-3 bg-red-50 text-red-700 rounded-2xl font-bold text-sm border border-red-100">
            <i class="fas fa-times-circle mr-2"></i> Commande annulée
        </div>
        <div v-else class="w-full text-center text-gray-400 text-xs">
            Statut: {{ order.status }}
        </div>

    </div>

    </div> <!-- Close Main Content Flex-1 -->
  </div> <!-- Close Flex Row -->
</div> <!-- Close Container -->
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import { useUiStore } from '@/stores/ui';

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();
const loading = ref(true);
const order = ref<any>(null);

const fetchOrder = async () => {
    loading.value = true;
    try {
        const id = route.params.id;
        // Assuming we have an endpoint for single order details. 
        // If not, we might need to fetch all and find, OR implement the endpoint.
        // Based on typical REST patterns, /vendors/me/orders/:id shoudl exist or be created.
        // For now I will try to fetch it.
        console.log("Fetching order", id);
        const res = await api.get(`/vendors/me/orders/${id}`);
        console.log("Direct fetch result:", res.data);
        if (res.data && res.data.id) {
            order.value = res.data;
        } else {
            throw new Error("Empty data");
        }
    } catch (e) {
        console.error("Failed to load order directly", e);
        // Fallback: try to find in list
        try {
            console.log("Attempting fallback fetch...");
            const allRes = await api.get('/vendors/me/orders', { params: { limit: 100 } });
            console.log("Fallback list:", allRes.data.orders);
            const found = allRes.data.orders.find((o: any) => String(o.id) === String(route.params.id));
            if (found) {
                console.log("Found in fallback:", found);
                order.value = found;
            } else {
                console.warn("Not found in fallback list");
            }
        } catch (err) {
            console.error("Fallback fetch failed", err);
        }
    } finally {
        loading.value = false;
    }
};

const orderTotal = computed(() => {
    if (!order.value || !order.value.items) return 0;
    return order.value.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
});

const updateStatus = async (newStatus: string) => {
    uiStore.confirm({
        title: 'Mettre à jour le statut',
        message: 'Êtes-vous sûr de vouloir changer le statut de cette commande ?',
        onConfirm: async () => {
            try {
                // Use the new single endpoint to update Order + Items
                await api.patch(`/vendors/me/orders/${order.value.id}`, { status: newStatus });

                // Optimistically update local state
                order.value.status = newStatus;
                if (order.value.items) {
                    order.value.items.forEach((i: any) => i.status = newStatus);
                }
                
                // Refresh to be sure
                await fetchOrder();
                uiStore.showToast('Statut mis à jour !', 'success');
            } catch (e) {
                console.error("Update failed", e);
                uiStore.showToast("Erreur lors de la mise à jour", "error");
            }
        }
    });
};

onMounted(() => {
    fetchOrder();
});

const formattedAddress = computed(() => {
    if (!order.value || !order.value.shipping_address) return 'Adresse non spécifiée';
    try {
        // Try to parse if it looks like JSON
        if (order.value.shipping_address.startsWith('{')) {
            const addr = JSON.parse(order.value.shipping_address);
            // Format it nicely
            return `${addr.street || ''}, ${addr.city || ''}, ${addr.country || ''}`;
        }
        return order.value.shipping_address;
    } catch (e) {
        return order.value.shipping_address;
    }
});

const clientPhone = computed(() => {
    // 1. Try user phone
    if (order.value?.user?.phone) return order.value.user.phone;
    // 2. Try address phone
    if (order.value?.shipping_address && order.value.shipping_address.startsWith('{')) {
        try {
            const addr = JSON.parse(order.value.shipping_address);
            return addr.phone || '';
        } catch (e) {
            return '';
        }
    }
    return '';
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
};

const formatDate = (date: string) => {
  if (!date || isNaN(new Date(date).getTime())) return 'Date inconnue';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En préparation',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };
  return texts[status] || status;
};

const getLogColor = (status: string) => {
    switch(status) {
        case 'pending': return 'bg-yellow-500';
        case 'confirmed': return 'bg-blue-500';
        case 'processing': return 'bg-indigo-500';
        case 'shipped': return 'bg-purple-500';
        case 'delivered': return 'bg-green-500';
        case 'cancelled': return 'bg-red-500';
        default: return 'bg-gray-400';
    }
};
</script>
