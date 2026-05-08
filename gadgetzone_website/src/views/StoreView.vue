<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productsService, type Product, type Store } from '@/services/products';
import { useUiStore } from '@/stores/ui';
import { useI18n } from 'vue-i18n';
import ProductCard from '@/components/products/ProductCard.vue';

const route = useRoute();
const router = useRouter();

const store = ref<Store | null>(null);
const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const selectedCategory = ref<string | null>(null);
const showOnlyPromos = ref(false);
const searchQuery = ref('');
const sortBy = ref<'newest' | 'price_asc' | 'price_desc' | 'name'>('newest');
const { t } = useI18n();
const uiStore = useUiStore();

const isFollowing = ref(false);
const storeId = computed(() => route.params.id as string);

// Derive categories from the actual products in the store
const categories = computed(() => {
    const cats: Record<string, number> = {};
    products.value.forEach(p => {
        if (p.category) {
            cats[p.category] = (cats[p.category] || 0) + 1;
        }
    });
    return Object.entries(cats).map(([name, count]) => ({ name, count }));
});

const promoCount = computed(() => {
    return products.value.filter(p => p.original_price && Number(p.original_price) > Number(p.price)).length;
});

const filteredProducts = computed(() => {
    let result = [...products.value];
    
    // 1. Search Filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    // 2. Category Filter
    if (selectedCategory.value) {
        result = result.filter(p => p.category === selectedCategory.value);
    }
    
    // 3. Promotions Filter
    if (showOnlyPromos.value) {
        result = result.filter(p => p.original_price && Number(p.original_price) > Number(p.price));
    }

    // 4. Sorting logic
    result.sort((a, b) => {
        if (sortBy.value === 'price_asc') return Number(a.price) - Number(b.price);
        if (sortBy.value === 'price_desc') return Number(b.price) - Number(a.price);
        if (sortBy.value === 'name') return a.name.localeCompare(b.name);
        
        // newest
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    });
    
    return result;
});

const fetchStoreData = async () => {
    if (!storeId.value || storeId.value === 'undefined') {
        error.value = t('store.invalid_id');
        loading.value = false;
        return;
    }
    try {
        loading.value = true;
        error.value = null;
        
        const [storeRes, productsRes] = await Promise.all([
            productsService.getVendor(storeId.value),
            productsService.getProducts({ vendor: storeId.value, limit: 100 })
        ]);
        
        store.value = storeRes;
        products.value = productsRes.products || productsRes || [];
        
        if (store.value) {
            isFollowing.value = !!store.value.isFollowing;
            document.title = `${store.value.name} - Boutique HTFasil`;
        }
    } catch (e: any) {
        console.error("Error fetching store data", e);
        error.value = t('store.load_error');
    } finally {
        loading.value = false;
    }
};

const toggleFollow = async () => {
    if (!store.value) return;
    try {
        if (isFollowing.value) {
            const res = await productsService.unfollowStore(store.value.id);
            isFollowing.value = false;
            store.value.follower_count = res.follower_count;
            uiStore.showToast(t('store.unfollow_msg', { name: store.value.name }), 'info');
        } else {
            const res = await productsService.followStore(store.value.id);
            isFollowing.value = true;
            store.value.follower_count = res.follower_count;
            uiStore.showToast(t('store.follow_msg', { name: store.value.name }), 'success');
        }
    } catch (e: any) {
        if (e.response?.status === 401) {
            uiStore.showToast(t('store.login_to_follow'), 'warning');
            router.push({ name: 'login', query: { redirect: route.fullPath } });
        } else {
            uiStore.showToast(t('store.error_operation'), 'error');
        }
    }
};

const handleShare = async () => {
    try {
        if (navigator.share) {
            await navigator.share({
                title: store.value?.name || t('store.default_name'),
                text: store.value?.description || t('products.subtitle'),
                url: window.location.href
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
            uiStore.showToast(t('store.link_copied'), 'info');
        }
    } catch (err) {
        console.error('Error sharing:', err);
    }
};

onMounted(() => {
    fetchStoreData();
});

watch(() => route.params.id, () => {
    if (route.name === 'store-view') {
        fetchStoreData();
        selectedCategory.value = null;
        showOnlyPromos.value = false;
    }
});
</script>

<template>
<div class="bg-gray-50 min-h-screen pb-20 pt-[56px] md:pt-0">
        <!-- Store Header -->
        <div class="bg-white border-b border-gray-100 shadow-sm mb-8 overflow-hidden">
            <!-- Banner removed as requested -->

            
            <div class="container mx-auto px-6 relative">
                <div class="flex flex-row items-center py-6 gap-5 md:gap-8">
                    <!-- Store Logo (Left) -->
                    <div class="w-20 h-20 md:w-28 md:h-28 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 transition-transform hover:scale-105 duration-300">
                        <img v-if="store?.logoUrl" :src="store.logoUrl" class="w-full h-full object-cover" />
                        <i v-else class="fas fa-store text-3xl text-gray-100"></i>
                    </div>
                    
                    <!-- Center: Name and Badge -->
                    <div class="flex-1 flex flex-col justify-center text-left">
                        <h1 class="text-xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight truncate max-w-[200px] md:max-w-none">{{ store?.name || $t('store.default_name') }}</h1>
                        <div class="mt-1">
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-50">
                                <i class="fas fa-check-circle mr-1.5 opacity-70"></i>
                                {{ $t('store.verified_seller') }}
                            </span>
                        </div>
                    </div>
                    
                    <!-- Right: Follow Button + Count -->
                    <div class="flex flex-col items-center gap-1.5 min-w-[100px] md:min-w-[120px]">
                        <button 
                            @click="toggleFollow"
                            :class="isFollowing ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white shadow-blue-200'"
                            class="px-5 py-2.5 md:px-8 md:py-3 rounded-2xl font-bold text-xs md:text-sm shadow-lg active:scale-95 transition-all w-full"
                        >
                            {{ isFollowing ? $t('store.following') : $t('store.follow') }}
                        </button>
                        <span class="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-tighter">{{ $t('store.followers', { count: store?.follower_count || 0 }) }}</span>
                    </div>
                </div>
                
                <!-- Description (Bottom Middle) -->
                <div v-if="store?.description" class="pb-6 text-center">
                    <p class="text-gray-500 max-w-2xl mx-auto text-[11px] md:text-xs leading-relaxed font-medium italic opacity-80">
                        {{ store.description }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-6">
            <div class="flex flex-col lg:flex-row gap-8">
                
                <!-- Sidebar (Left) -->
                <aside class="hidden lg:block w-72 flex-shrink-0">
                    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                        <div class="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                            <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <i class="fas fa-filter text-blue-600"></i>
                                {{ $t('store.filter') }}
                            </h2>
                        </div>
                        
                        <div class="p-6 space-y-8">
                            <!-- Search -->
                            <section>
                                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{{ $t('products.search') }}</h3>
                                <div class="relative">
                                    <input 
                                        type="text" 
                                        v-model="searchQuery"
                                        :placeholder="$t('store.search_ph')"
                                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                    <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
                                </div>
                            </section>

                            <!-- Sort -->
                            <section>
                                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{{ $t('products.sortBy') }}</h3>
                                <div class="space-y-3">
                                    <label v-for="opt in [
                                        {v: 'newest', l: $t('products.newest')},
                                        {v: 'price_asc', l: $t('products.price') + ' ↑'},
                                        {v: 'price_desc', l: $t('products.price') + ' ↓'},
                                        {v: 'name', l: $t('products.name') + ' (A-Z)'}
                                    ]" :key="opt.v" class="flex items-center group cursor-pointer">
                                        <input type="radio" :value="opt.v" v-model="sortBy" class="sr-only peer" />
                                        <div class="w-4 h-4 rounded-full border-2 border-gray-200 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all flex items-center justify-center">
                                            <div class="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                                        </div>
                                        <span class="ml-3 text-xs font-semibold text-gray-500 group-hover:text-gray-900 peer-checked:text-gray-900">{{ opt.l }}</span>
                                    </label>
                                </div>
                            </section>

                            <!-- Categories -->
                            <section v-if="categories.length > 0">
                                <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{{ $t('account.tab_all') }}</h3>
                                <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    <label class="flex items-center group cursor-pointer">
                                        <input type="radio" :value="null" v-model="selectedCategory" class="sr-only peer" />
                                        <div class="w-4 h-4 rounded-md border-2 border-gray-200 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all flex items-center justify-center">
                                            <i class="fas fa-check text-[8px] text-white opacity-0 peer-checked:opacity-100"></i>
                                        </div>
                                        <span class="ml-3 text-xs font-semibold text-gray-500 group-hover:text-gray-900 peer-checked:text-gray-900">{{ $t('products.allCategories') }}</span>
                                    </label>
                                    <label v-for="cat in categories" :key="cat.name" class="flex items-center group cursor-pointer justify-between">
                                        <div class="flex items-center">
                                            <input type="radio" :value="cat.name" v-model="selectedCategory" class="sr-only peer" />
                                            <div class="w-4 h-4 rounded-md border-2 border-gray-200 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all flex items-center justify-center">
                                                <i class="fas fa-check text-[8px] text-white opacity-0 peer-checked:opacity-100"></i>
                                            </div>
                                            <span class="ml-3 text-xs font-semibold text-gray-500 group-hover:text-gray-900 peer-checked:text-gray-900 truncate max-w-[120px]">{{ cat.name }}</span>
                                        </div>
                                        <span class="text-[10px] font-bold px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded-md group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{{ cat.count }}</span>
                                    </label>
                                </div>
                            </section>

                            <!-- Promotions Toggle -->
                            <section class="pt-6 border-t border-gray-50">
                                <label class="flex items-center justify-between cursor-pointer group">
                                    <span class="text-xs font-bold text-gray-700">{{ $t('store.promo_only') }}</span>
                                    <div class="relative inline-block w-10 h-6 align-middle select-none">
                                        <input type="checkbox" v-model="showOnlyPromos" class="sr-only peer" />
                                        <div class="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </div>
                                </label>
                            </section>
                        </div>
                    </div>
                </aside>

                <!-- Products Grid (Main Content) -->
                <div class="flex-1 min-w-0">
                    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                        <div v-for="i in 6" :key="i" class="h-72 bg-white rounded-3xl animate-pulse shadow-sm border border-gray-100"></div>
                    </div>

                    <div v-else-if="error" class="bg-white p-12 rounded-3xl border border-red-50 text-center shadow-sm">
                        <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                        </div>
                        <h4 class="font-bold text-gray-900 text-xl">{{ error }}</h4>
                        <button @click="fetchStoreData" class="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">
                            Réessayer
                        </button>
                    </div>

                    <div v-else-if="products.length === 0" class="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center shadow-sm">
                        <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-box-open text-gray-200 text-4xl"></i>
                        </div>
                        <h4 class="font-bold text-gray-900 text-2xl">Boutique vide</h4>
                        <p class="text-gray-500 mt-2 max-w-sm mx-auto">Ce vendeur n'a pas encore ajouté de produits dans sa boutique publique.</p>
                    </div>

                    <div v-else>
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 px-2 gap-4">
                            <div>
                                <h2 class="text-xl font-bold text-gray-900 tracking-tight">Tous nos produits</h2>
                                <p class="text-xs text-gray-400 font-semibold mt-1">Affichage de {{ filteredProducts.length }} produit(s)</p>
                            </div>
                            
                            <!-- Mobile Filter Button (can be added later if needed) -->
                            <div class="lg:hidden flex gap-2">
                                <!-- Could add a simpler Sort dropdown for mobile here -->
                            </div>
                        </div>
                        
                        <!-- Empty results -->
                        <div v-if="filteredProducts.length === 0" class="bg-white py-20 px-6 rounded-3xl text-center border border-gray-100">
                            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                                <i class="fas fa-search text-3xl"></i>
                            </div>
                            <h3 class="text-lg font-bold text-gray-900">Aucun résultat trouvé</h3>
                            <p class="text-xs text-gray-400 mt-2">Essayez d'ajuster vos filtres pour trouver ce que vous cherchez.</p>
                            <button @click="searchQuery = ''; selectedCategory = null; showOnlyPromos = false" class="mt-6 text-blue-600 font-bold text-xs hover:underline">
                                Réinitialiser les filtres
                            </button>
                        </div>

                        <div v-else class="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                            <ProductCard 
                                v-for="product in filteredProducts" 
                                :key="product.id" 
                                :product="product" 
                                view-mode="grid"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1400px;
}
</style>
