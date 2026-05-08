<template>
  <div class="w-full md:pt-4 pb-12">
    <div class="flex flex-col md:flex-row gap-6 md:items-start">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content Area -->
      <div class="flex-1 min-h-screen bg-gray-50 rounded-3xl overflow-hidden shadow-sm md:shadow-md md:mx-0">
        
        <!-- MOBILE HEADER (Clean & Minimalist) -->
        <div class="md:hidden bg-white font-sans relative border-b border-gray-100">
            <div class="px-5 pt-8 pb-6 relative">
                <div class="flex justify-between items-center mb-4 relative z-10">
                    <button @click="router.back()" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 border border-gray-100">
                        <i class="fas fa-arrow-left text-xs"></i>
                    </button>
                    <div class="flex gap-3">
                        <div class="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center relative">
                            <i class="fas fa-bullhorn text-gray-400 text-xs"></i>
                        </div>
                    </div>
                </div>

                <div class="relative z-10">
                    <h1 class="text-xl font-black text-gray-900 tracking-tight">Promotions</h1>
                    <p class="text-gray-400 text-xs font-medium">Boostez vos ventes</p>
                </div>
            </div>
        </div>

        <!-- MAIN CONTENT CONTAINER -->
        <div class="relative z-20 px-4 pb-24 md:pb-0 md:mt-0 md:px-0">
            <!-- Desktop Header -->
            <div class="hidden md:block bg-white sticky top-0 z-30 px-4 pt-2 pb-2 shadow-sm mb-4 rounded-xl">
                <div class="flex items-center gap-3">
                    <h1 class="text-xl font-bold text-gray-900">Promotions Marketing</h1>
                    <div class="flex-1"></div>
                    <button @click="openCreateModal" class="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-200 active:scale-95 transition-all hover:bg-violet-700">
                        <i class="fas fa-plus text-sm"></i>
                    </button>
                </div>
            </div>

            <!-- Promotion Tabs -->
            <div class="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 flex mb-6">
                <button 
                  @click="activeTab = 'discounts'"
                  :class="activeTab === 'discounts' ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'"
                  class="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                    <i class="fas fa-percentage"></i>
                    Remises Produits
                </button>
                <button 
                  @click="activeTab = 'coupons'"
                  :class="activeTab === 'coupons' ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'"
                  class="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                    <i class="fas fa-ticket"></i>
                    Codes Promo
                </button>
            </div>

            <!-- LOADING STATE -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                <div class="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Chargement...</p>
            </div>

            <!-- CONTENT -->
            <div v-else class="space-y-4">
                <div v-if="filteredPromotions.length > 0" class="animate-in fade-in duration-500">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="promo in filteredPromotions" :key="promo.id" class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 text-xl font-black">
                                    {{ promo.discountType === 'percentage' ? '-' + Math.round(promo.discount) + '%' : Math.round(promo.discount) }}
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-bold text-gray-900 text-sm truncate">{{ promo.title }}</h3>
                                    <p v-if="promo.code" class="text-[10px] text-violet-600 font-black uppercase tracking-widest">{{ promo.code }}</p>
                                    <p v-else class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Remise Directe</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center text-xs text-gray-500 font-medium">
                                <span>{{ getDaysLeft(promo.endDate) }} jours restants</span>
                                <div class="flex gap-3">
                                    <button @click="openEditModal(promo)" class="text-violet-600 font-bold hover:underline">Gérer</button>
                                    <button @click="handleDelete(promo.id)" class="text-red-400 font-bold hover:text-red-600 transition-colors">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div @click="openCreateModal" class="bg-white p-5 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center py-10 cursor-pointer hover:border-violet-200 transition-colors group">
                             <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-violet-50 group-hover:text-violet-400 mb-3">
                                 <i class="fas fa-plus"></i>
                             </div>
                             <p class="text-[11px] font-bold text-gray-400 group-hover:text-violet-600 transition-colors">Créer une offre</p>
                        </div>
                    </div>
                </div>

                <div v-else class="animate-in fade-in duration-500 flex flex-col items-center justify-center py-20 text-center px-10">
                    <div class="w-20 h-20 rounded-full bg-violet-50 flex items-center justify-center text-violet-200 text-4xl mb-6">
                        <i class="fas" :class="activeTab === 'discounts' ? 'fa-percentage' : 'fa-ticket'"></i>
                    </div>
                    <h3 class="text-lg font-black text-gray-900 mb-2">Pas de {{ activeTab === 'discounts' ? 'remises' : 'codes promo' }} actifs</h3>
                    <p class="text-gray-400 text-xs leading-relaxed max-w-[250px]">
                        {{ activeTab === 'discounts' ? 'Appliquez des remises sur vos produits pour attirer plus de clients.' : 'Créez des codes personnalisés pour remercier vos clients.' }}
                    </p>
                    <button @click="openCreateModal" class="mt-8 px-8 py-3 bg-violet-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-200 active:scale-95 transition-all">
                        {{ activeTab === 'discounts' ? 'Créer une remise' : 'Générer un code' }}
                    </button>
                </div>
            </div>

            <!-- Marketing Tips Card -->
            <div class="mt-10 bg-gradient-to-br from-gray-900 to-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
                <div class="relative z-10">
                    <h4 class="text-lg font-black mb-3">Conseil Marketing 💡</h4>
                    <p class="text-indigo-100/80 text-xs leading-relaxed max-w-[280px]">Les remises de 20% sont les plus performantes sur HTFasil. Essayez de coupler une remise avec un code coupon limité !</p>
                </div>
                <i class="fas fa-rocket absolute -right-6 -bottom-6 text-9xl text-white/5 -rotate-12"></i>
            </div>
        </div>

        <!-- Floating Action Button (Mobile) -->
        <button @click="openCreateModal" class="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-800 text-white rounded-full shadow-xl shadow-violet-500/30 flex items-center justify-center z-40 active:scale-95 transition-transform border-4 border-white/20 backdrop-blur-sm">
            <i class="fas fa-plus text-xl"></i>
        </button>

        <!-- PROMOTION MODAL -->
        <div v-if="showModal" class="fixed inset-0 z-[60] flex items-start justify-center p-4 overflow-y-auto no-scrollbar">
            <div @click="showModal = false" class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div class="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 my-auto">
                <div class="p-8 max-h-[90vh] overflow-y-auto no-scrollbar">
                    <div class="flex justify-between items-center mb-8">
                        <div>
                            <h2 class="text-2xl font-black text-gray-900 leading-tight">{{ isEditing ? 'Gérer la Promotion' : 'Nouvelle Promotion' }}</h2>
                            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Configurez votre offre</p>
                        </div>
                        <button @click="showModal = false" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <form @submit.prevent="handleSave" class="space-y-5">
                        <div class="space-y-2">
                            <label class="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Titre de la promotion</label>
                            <input v-model="form.title" type="text" required placeholder="Ex: Offre de Printemps" class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-violet-500 transition-all outline-none" />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Valeur</label>
                                <input v-model.number="form.discount" type="number" required placeholder="Ex: 20" class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-violet-500 transition-all outline-none" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Type</label>
                                <select v-model="form.discountType" class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-violet-500 transition-all outline-none appearance-none">
                                    <option value="percentage">Pourcentage (%)</option>
                                    <option value="fixed">Montant Fixe (HTG)</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Code Promo (Optionnel)</label>
                            <div class="relative">
                                <input v-model="form.code" type="text" placeholder="Ex: SPRING20" class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-violet-500 transition-all outline-none" />
                                <i class="fas fa-ticket absolute right-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Date de début</label>
                                <input v-model="form.startDate" type="date" required class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-violet-500 transition-all outline-none" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Date de fin</label>
                                <input v-model="form.endDate" type="date" required class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-violet-500 transition-all outline-none" />
                            </div>
                        </div>

                        <!-- PRODUCT SELECTION SECTION -->
                        <div class="space-y-3 pt-2">
                            <div class="flex justify-between items-center px-1">
                                <label class="text-[11px] font-black uppercase tracking-widest text-gray-400">Produits concernés</label>
                                <span class="bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                                    {{ form.applicableProducts.length }} sélectionné(s)
                                </span>
                            </div>

                            <!-- Search Input for Products -->
                            <div class="relative">
                                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs text-xs"></i>
                                <input 
                                    v-model="productSearchQuery" 
                                    type="text" 
                                    placeholder="Rechercher un produit..." 
                                    class="w-full bg-gray-50 border-none rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-violet-500 transition-all outline-none"
                                />
                            </div>

                            <!-- Products Selection Area -->
                            <div class="bg-gray-50 rounded-3xl p-3 max-h-[200px] overflow-y-auto no-scrollbar border border-gray-100/50">
                                <div v-if="loadingProducts" class="flex justify-center py-8">
                                    <div class="w-6 h-6 border-2 border-violet-200 border-t-violet-500 rounded-full animate-spin"></div>
                                </div>
                                <div v-else-if="filteredSellerProducts.length === 0" class="text-center py-8">
                                    <p class="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Aucun produit trouvé</p>
                                </div>
                                <div v-else class="space-y-2">
                                    <div 
                                        v-for="product in filteredSellerProducts" 
                                        :key="product.id"
                                        @click="toggleProductSelection(product.id)"
                                        :class="form.applicableProducts.includes(product.id) ? 'bg-white border-violet-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'"
                                        class="flex items-center gap-3 p-2 rounded-2xl border-2 transition-all cursor-pointer hover:bg-white"
                                    >
                                        <div class="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                                            <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" />
                                            <div v-else class="w-full h-full flex items-center justify-center bg-violet-100 text-violet-400">
                                                <i class="fas fa-image text-xs"></i>
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-[11px] font-black text-gray-900 truncate">{{ product.name }}</p>
                                            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{{ product.category?.name || 'Général' }}</p>
                                        </div>
                                        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                                             :class="form.applicableProducts.includes(product.id) ? 'bg-violet-600 border-violet-600 text-white' : 'border-gray-200'">
                                            <i v-if="form.applicableProducts.includes(product.id)" class="fas fa-check text-[8px]"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            :disabled="saving"
                            class="w-full bg-gradient-to-br from-violet-600 to-indigo-800 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-violet-500/30 active:scale-95 transition-all mt-4 flex items-center justify-center"
                        >
                            <template v-if="saving">
                                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </template>
                            <template v-else>
                                {{ isEditing ? 'Mettre à jour' : 'Lancer la Promotion' }}
                            </template>
                        </button>
                    </form>
                </div>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import { promotionsService, type Promotion } from '@/services/promotions';
import { useNotificationsStore } from '@/stores/notifications';
import { useUiStore } from '@/stores/ui';
import api from '@/services/api';

const router = useRouter();
const notificationsStore = useNotificationsStore();
const uiStore = useUiStore();

const activeTab = ref('discounts');
const loading = ref(true);
const saving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const targetId = ref<number | null>(null);

const promotions = ref<Promotion[]>([]);
const sellerProducts = ref<any[]>([]);
const productSearchQuery = ref('');
const loadingProducts = ref(false);

const form = ref({
    title: '',
    description: '',
    code: '',
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
    startDate: '',
    endDate: '',
    minAmount: 0,
    applicableProducts: [] as number[]
});

// Watch modal state to hide/show bottom nav and lock scroll
watch(showModal, (val) => {
    uiStore.isSellerNavVisible = !val;
    if (val) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

onUnmounted(() => {
    // Restore navbar visibility and scroll when leaving the page
    uiStore.isSellerNavVisible = true;
    document.body.style.overflow = '';
});

const filteredPromotions = computed(() => {
    if (activeTab.value === 'discounts') {
        return promotions.value.filter(p => !p.code);
    } else {
        return promotions.value.filter(p => p.code);
    }
});

const filteredSellerProducts = computed(() => {
    if (!productSearchQuery.value) return sellerProducts.value;
    const query = productSearchQuery.value.toLowerCase();
    return sellerProducts.value.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.sku && p.sku.toLowerCase().includes(query))
    );
});

const fetchPromotions = async () => {
    loading.value = true;
    try {
        promotions.value = await promotionsService.getMyPromotions();
    } catch (error) {
        console.error("Failed to fetch promotions", error);
        promotions.value = [];
    } finally {
        loading.value = false;
    }
};

const fetchSellerProducts = async () => {
    loadingProducts.value = true;
    try {
        const res = await api.get('/vendors/me/products', { params: { limit: 100 } });
        sellerProducts.value = res.data.products || res.data;
    } catch (error) {
        console.error("Failed to fetch products", error);
    } finally {
        loadingProducts.value = false;
    }
};

onMounted(() => {
    fetchPromotions();
    fetchSellerProducts();
});

onUnmounted(() => {
    // Restore navbar visibility when leaving the page
    uiStore.isSellerNavVisible = true;
});

const toggleProductSelection = (productId: number) => {
    const index = form.value.applicableProducts.indexOf(productId);
    if (index > -1) {
        form.value.applicableProducts.splice(index, 1);
    } else {
        form.value.applicableProducts.push(productId);
    }
};

const openCreateModal = () => {
    isEditing.value = false;
    targetId.value = null;
    form.value = {
        title: '',
        description: '',
        code: activeTab.value === 'coupons' ? 'PROMO' + Math.floor(Math.random() * 1000) : '',
        discount: 10,
        discountType: 'percentage',
        startDate: new Date().toISOString().split('T')[0]!,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
        minAmount: 0,
        applicableProducts: []
    };
    showModal.value = true;
};

const openEditModal = (promo: Promotion) => {
    isEditing.value = true;
    targetId.value = promo.id;
    form.value = {
        title: promo.title,
        description: promo.description || '',
        code: promo.code || '',
        discount: Number(promo.discount),
        discountType: promo.discountType,
        startDate: promo.startDate ? new Date(promo.startDate).toISOString().split('T')[0]! : '',
        endDate: promo.endDate ? new Date(promo.endDate).toISOString().split('T')[0]! : '',
        minAmount: Number(promo.minAmount) || 0,
        applicableProducts: Array.isArray(promo.applicableProducts) ? [...promo.applicableProducts] : []
    };
    showModal.value = true;
};

const handleSave = async () => {
    if (form.value.applicableProducts.length === 0 && activeTab.value === 'discounts') {
        uiStore.showToast("Veuillez sélectionner au moins un produit pour cette remise.", "warning");
        return;
    }

    saving.value = true;
    try {
        if (isEditing.value && targetId.value) {
            await promotionsService.updatePromotion(targetId.value, form.value);
        } else {
            await promotionsService.createPromotion(form.value);
        }
        showModal.value = false;
        fetchPromotions();
    } catch (error) {
        console.error("Save failed", error);
    } finally {
        saving.value = false;
    }
};

const handleDelete = async (id: number) => {
    uiStore.confirm({
        title: 'Supprimer la promotion',
        message: 'Voulez-vous vraiment supprimer cette promotion ?',
        type: 'danger',
        onConfirm: async () => {
            try {
                await promotionsService.deletePromotion(id);
                fetchPromotions();
                uiStore.showToast('Promotion supprimée !', 'success');
            } catch (error) {
                console.error("Delete failed", error);
                uiStore.showToast('Erreur lors de la suppression', 'error');
            }
        }
    });
};

const getDaysLeft = (date: string) => {
    const end = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-in {
    animation-duration: 0.6s;
    animation-fill-mode: both;
}
.fade-in {
    animation-name: fadeIn;
}
.zoom-in {
    animation-name: zoomIn;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes zoomIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>
