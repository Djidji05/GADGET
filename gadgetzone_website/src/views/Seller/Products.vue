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
                    <div class="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center relative">
                        <i class="fas fa-filter text-gray-400 text-xs"></i>
                    </div>
                </div>
            </div>

            <div class="relative z-10">
                <h1 class="text-xl font-black text-gray-900 tracking-tight">Mes Produits</h1>
                <p class="text-gray-400 text-xs font-medium">Gérez votre catalogue</p>
                
                <!-- Search Bar (Integrated) -->
                <div class="mt-4 relative">
                    <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 text-xs"></i>
                    <input 
                      v-model="productSearch" 
                      @input="handleProductSearch"
                      type="text" 
                      placeholder="Rechercher..." 
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
            <h1 class="text-xl font-bold text-gray-900">Mes Produits</h1>
            <div class="flex-1"></div>
            <button @click="navigateToAddProduct" class="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center shadow-lg shadow-blue-200 active:scale-95 transition-all hover:bg-blue-800">
                <i class="fas fa-plus text-sm"></i>
            </button>
        </div>
    </div>

    <!-- Stats Summary -->
    <div class="flex justify-between items-center mb-4 px-1">
        <h2 class="font-bold text-gray-800 text-lg">Catalogue</h2>
        <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-2">
            <i class="fas fa-box"></i> {{ productPagination.total }} Articles
        </span>
    </div>

    <!-- Products List (Card Design) -->
    <div class="space-y-4">
        <div v-if="loading" class="py-12 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
        </div>

        <div v-else-if="products.length === 0" class="py-12 text-center bg-white rounded-3xl border border-dashed border-gray-200 md:mx-0">
             <i class="fas fa-box-open text-4xl text-gray-200 mb-3 block"></i>
             <p class="text-gray-400 text-sm">Aucun produit {{ productSearch ? 'trouvé' : 'dans votre boutique' }}</p>
             <button v-if="!productSearch" @click="navigateToAddProduct" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200">Ajouter mon premier produit</button>
        </div>

        <div v-else v-for="product in products" :key="product.id" :class="{'opacity-75 grayscale': product.status === 'deleted'}" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 transition-all active:scale-[0.99] relative overflow-hidden group">
            
            <!-- Product Image -->
            <div class="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 relative">
                <img alt="" :src="product.image_url || 'https://via.placeholder.com/100'" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                <div v-if="product.status === 'deleted'" class="absolute inset-0 bg-gray-900/50 flex items-center justify-center backdrop-blur-[1px]">
                    <i class="fas fa-ban text-white text-xl"></i>
                </div>
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                    <div class="flex justify-between items-start mb-1">
                        <h3 class="font-bold text-gray-900 text-sm truncate leading-tight pr-2">{{ product.name }}</h3>
                        <button class="text-gray-300 hover:text-gray-500 px-1">
                             <i class="fas fa-ellipsis-v text-xs"></i>
                        </button>
                    </div>
                    
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-blue-600 font-yellix font-black text-lg">{{ formatPrice(product.price) }}</span>
                    </div>

                    <!-- Admin Note if deleted -->
                    <div v-if="product.status === 'deleted'" class="mt-1 p-1.5 bg-red-50 rounded-lg border border-red-100 inline-block">
                        <p class="text-[10px] text-red-700 leading-tight">
                            <span class="font-black">SUPPRIMÉ</span>
                        </p>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span 
                          v-if="product.status !== 'deleted'"
                          :class="product.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'" 
                          class="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5"
                        >
                            <span class="w-1.5 h-1.5 rounded-full" :class="product.stock < 5 ? 'bg-red-500' : 'bg-green-500'"></span>
                            {{ product.stock }} en stock
                        </span>
                        <span 
                          v-else
                          class="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500"
                        >
                            Archivé
                        </span>
                    </div>
                    
                    <div class="flex gap-2">
                        <button 
                          @click="router.push(`/seller/products/edit/${product.id}`)" 
                          :disabled="product.status === 'deleted'"
                          class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
                        >
                            <i class="fas fa-pen text-xs"></i>
                        </button>
                        <button 
                          @click="handleDelete(product.id)" 
                          class="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center active:scale-90 transition-transform"
                        >
                            <i class="fas fa-trash-alt text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Floating Action Button (Mobile) -->
    <button @click="navigateToAddProduct" class="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full shadow-xl shadow-blue-500/30 flex items-center justify-center z-40 active:scale-95 transition-transform border-4 border-white/20 backdrop-blur-sm">
        <i class="fas fa-plus text-xl"></i>
    </button>

    <!-- Pagination (Matched with Orders) -->
    <div v-if="productPagination.total > 0" class="px-4 pt-4 flex justify-center items-center gap-3">
        <button 
            @click="changeProductPage(productPagination.page - 1)" 
            :disabled="productPagination.page === 1"
            class="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
            <i class="fas fa-chevron-left text-xs"></i>
        </button>
        
        <div class="flex items-center gap-2 mx-1">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page</span>
            <div class="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold shadow-md shadow-gray-200 min-w-[32px] text-center">
                {{ productPagination.page }}
            </div>
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">sur {{ productPagination.totalPages }}</span>
        </div>

        <button 
            @click="changeProductPage(productPagination.page + 1)" 
            :disabled="productPagination.page === productPagination.totalPages"
            class="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
            <i class="fas fa-chevron-right text-xs"></i>
        </button>
    </div>

    </div>

  </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import { useUiStore } from '@/stores/ui';

const router = useRouter();
const uiStore = useUiStore();
const loading = ref(false);
const products = ref<any[]>([]);
const productSearch = ref('');
const productSearchTimeout = ref<any>(null);
const productPagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
});

const handleDelete = async (id: number) => {
    uiStore.confirm({
        title: 'Supprimer le produit',
        message: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
        type: 'danger',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        onConfirm: async () => {
            try {
                await api.delete(`/vendors/me/products/${id}`);
                fetchProducts(productPagination.value.page);
                uiStore.showToast("Produit supprimé avec succès", "success");
            } catch (e) {
                console.error("Delete failed", e);
                uiStore.showToast("Erreur lors de la suppression", "error");
            }
        }
    });
};


const store = ref<any>(null);

const fetchProducts = async (page = 1) => {
    loading.value = true;
    try {
        // Check vendor status first
        const storeRes = await api.get('/vendors/me');
        store.value = storeRes.data;

        if (store.value.status !== 'active') {
            console.warn("Store not active, skipping products fetch");
            products.value = [];
            return;
        }

        const productsRes = await api.get('/vendors/me/products', {
            params: {
                page,
                limit: 10,
                search: productSearch.value || undefined
            }
        });
        
        if (productsRes.data.products) {
            products.value = productsRes.data.products;
            productPagination.value = productsRes.data.pagination;
        } else {
            products.value = productsRes.data;
        }
    } catch (e) {
        console.error("Error fetching products", e);
    } finally {
        loading.value = false;
    }
};

const handleProductSearch = () => {
    if (productSearchTimeout.value) clearTimeout(productSearchTimeout.value);
    productSearchTimeout.value = setTimeout(() => {
        productPagination.value.page = 1;
        fetchProducts(1);
    }, 500);
};

// React to global navbar search on desktop PC
watch(() => uiStore.globalSearchQuery, (newVal) => {
    productSearch.value = newVal;
    handleProductSearch();
});

const clearProductSearch = () => {
    productSearch.value = '';
    handleProductSearch();
};

const changeProductPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= productPagination.value.totalPages) {
        fetchProducts(newPage);
    }
};

onMounted(() => {
    fetchProducts();
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', { style: 'currency', currency: 'HTG' }).format(price);
};

const navigateToAddProduct = () => {
    router.push('/seller/products/new');
};
</script>
