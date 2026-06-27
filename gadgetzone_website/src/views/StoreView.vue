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
        const dateA = (a as any).created_at ? new Date((a as any).created_at).getTime() : 0;
        const dateB = (b as any).created_at ? new Date((b as any).created_at).getTime() : 0;
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
<div class="bg-gray-50 dark:bg-gray-950 dark:text-gray-100 min-h-screen pb-20 pt-0 transition-colors duration-300">
        <!-- Store Header -->
        <div class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm mb-8 overflow-hidden transition-colors duration-300">
            <div class="container mx-auto px-6">
                
                <!-- MOBILE HEADER VIEW (Hidden on Desktop) -->
                <div class="lg:hidden py-5 flex flex-col gap-4">
                    <!-- Top section: Logo, Name, Verified Badge, and Follow Button -->
                    <div class="flex items-center gap-4">
                        <!-- Logo -->
                        <div class="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img alt="" v-if="store?.logoUrl" :src="store.logoUrl" class="w-full h-full object-cover" />
                            <i v-else class="fas fa-store text-2xl text-gray-300 dark:text-gray-600"></i>
                        </div>
                        
                        <!-- Info & Follow -->
                        <div class="flex-1 min-w-0">
                            <h1 class="text-lg font-black text-gray-900 dark:text-white leading-tight truncate">{{ store?.name || $t('store.default_name') }}</h1>
                            <div class="mt-0.5 flex items-center gap-2">
                                <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                                    <i class="fas fa-check-circle mr-1 opacity-70"></i>
                                    {{ $t('store.verified_seller') }}
                                </span>
                            </div>
                        </div>

                        <!-- Follow Button -->
                        <div class="flex-shrink-0">
                            <button 
                                @click="toggleFollow"
                                :class="isFollowing ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' : 'bg-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-blue-950/20'"
                                class="px-4 py-2 rounded-xl font-bold text-[11px] active:scale-95 transition-all"
                            >
                                {{ isFollowing ? $t('store.following') : $t('store.follow') }}
                            </button>
                        </div>
                    </div>

                    <!-- Trust Score & Stats Pills (2x2 Grid on Mobile) -->
                    <div class="grid grid-cols-2 gap-2 px-1">
                        <!-- Score de Confiance (Green) -->
                        <div class="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100/70 dark:border-green-900/30 text-xs font-bold shadow-sm">
                            <i class="fas fa-shield-alt text-[10px]"></i>
                            <span>{{ Math.round(store?.trust_score || 95) }}% Confiance</span>
                        </div>

                        <!-- Livraison (Blue) -->
                        <div class="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100/70 dark:border-blue-900/30 text-xs font-bold shadow-sm">
                            <i class="fas fa-shipping-fast text-[10px]"></i>
                            <span>{{ store?.shippingSpeed || 95 }}% Livraison</span>
                        </div>

                        <!-- Avis Clients (Orange) -->
                        <div class="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-450 border border-orange-100/70 dark:border-orange-900/30 text-xs font-bold shadow-sm">
                            <i class="fas fa-star text-[10px]"></i>
                            <span>{{ store?.averageRating || '4.8' }} ({{ store?.reviewCount || 0 }} avis)</span>
                        </div>

                        <!-- Followers count (Gray) -->
                        <div class="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 text-xs font-bold shadow-sm">
                            <i class="fas fa-users text-[10px]"></i>
                            <span>{{ store?.follower_count || 0 }} Abonnés</span>
                        </div>
                    </div>

                    <!-- Description mobile -->
                    <p v-if="store?.description" class="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed font-medium italic opacity-90 px-1">
                        {{ store.description }}
                    </p>
                </div>

                <!-- DESKTOP HEADER VIEW (Hidden on Mobile) -->
                <div class="hidden lg:flex items-center justify-between py-8 gap-8">
                    <!-- Left: Identity -->
                    <div class="flex items-center gap-6 flex-1 min-w-0">
                        <!-- Logo -->
                        <div class="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 hover:scale-105 transition-transform duration-300">
                            <img alt="" v-if="store?.logoUrl" :src="store.logoUrl" class="w-full h-full object-cover" />
                            <i v-else class="fas fa-store text-4xl text-gray-200 dark:text-gray-600"></i>
                        </div>
                        
                        <!-- Name & Description -->
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-3 mb-1.5">
                                <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none truncate">{{ store?.name || $t('store.default_name') }}</h1>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                                    <i class="fas fa-check-circle mr-1 opacity-70"></i>
                                    {{ $t('store.verified_seller') }}
                                </span>
                            </div>
                            <p v-if="store?.description" class="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-xl font-medium italic mb-2 line-clamp-2">
                                {{ store.description }}
                            </p>
                            <!-- Share Button -->
                            <button @click="handleShare" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-xs flex items-center gap-1.5">
                                <i class="fas fa-share-alt"></i> Partager la boutique
                            </button>
                        </div>
                    </div>

                    <!-- Center: Trust Dashboard -->
                    <div class="flex bg-gradient-to-br from-green-50/40 to-emerald-50/20 dark:from-green-950/10 dark:to-emerald-950/5 border border-green-100/70 dark:border-green-900/30 rounded-[28px] p-4 items-center gap-6 shadow-sm flex-shrink-0 min-w-[340px]">
                        <!-- Trust Circular Indicator -->
                        <div class="relative w-16 h-16 flex flex-col items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-100 dark:shadow-none flex-shrink-0">
                            <span class="text-lg font-black leading-none">{{ Math.round(store?.trust_score || 95) }}%</span>
                            <span class="text-[8px] font-bold uppercase opacity-80 mt-0.5">Trust</span>
                        </div>

                        <!-- Trust Details -->
                        <div class="flex-1 space-y-2">
                            <div class="flex justify-between items-center text-xs font-bold">
                                <span class="text-gray-500 dark:text-gray-400">Score de Confiance</span>
                                <span class="text-green-600 dark:text-green-400">Excellent</span>
                            </div>
                            
                            <!-- Custom mini progress bar -->
                            <div class="w-full bg-green-100 dark:bg-green-950/50 rounded-full h-1.5">
                                <div class="bg-green-500 h-1.5 rounded-full" :style="{ width: (store?.trust_score || 95) + '%' }"></div>
                            </div>
                            
                            <!-- Micro ratings -->
                            <div class="flex items-center gap-4 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter pt-0.5">
                                <span class="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                                    <i class="fas fa-star"></i> {{ store?.averageRating || '4.8' }} ({{ store?.reviewCount || 0 }} avis)
                                </span>
                                <span class="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                    <i class="fas fa-truck"></i> {{ store?.shippingSpeed || 95 }}% Livraison
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Follow / Interaction -->
                    <div class="flex flex-col items-center gap-2 min-w-[140px] flex-shrink-0">
                        <button 
                            @click="toggleFollow"
                            :class="isFollowing ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/20'"
                            class="px-8 py-3 rounded-2xl font-bold text-sm active:scale-95 transition-all w-full text-center"
                        >
                            {{ isFollowing ? $t('store.following') : $t('store.follow') }}
                        </button>
                        <div class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                            {{ $t('store.followers', { count: store?.follower_count || 0 }) }}
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-6">
            <div class="flex flex-col lg:flex-row gap-8">
                
                <!-- Sidebar (Left) -->
                <aside class="hidden lg:block w-72 flex-shrink-0">
                    <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-24 transition-colors duration-300">
                        <div class="px-6 py-5 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/50">
                            <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <i class="fas fa-filter text-blue-600 dark:text-blue-400"></i>
                                {{ $t('store.filter') }}
                            </h2>
                        </div>
                        
                        <div class="p-6 space-y-8">
                            <!-- Search -->
                            <section>
                                <h3 class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{{ $t('products.search') }}</h3>
                                <div class="relative">
                                    <input 
                                        type="text" 
                                        v-model="searchQuery"
                                        :placeholder="$t('store.search_ph')"
                                        class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                    />
                                    <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-500 text-xs"></i>
                                </div>
                            </section>

                            <!-- Sort -->
                            <section>
                                <h3 class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{{ $t('products.sortBy') }}</h3>
                                <div class="space-y-3">
                                    <label v-for="opt in [
                                        {v: 'newest', l: $t('products.newest')},
                                        {v: 'price_asc', l: $t('products.price') + ' ↑'},
                                        {v: 'price_desc', l: $t('products.price') + ' ↓'},
                                        {v: 'name', l: $t('products.name') + ' (A-Z)'}
                                    ]" :key="opt.v" class="flex items-center group cursor-pointer">
                                        <input type="radio" :value="opt.v" v-model="sortBy" class="sr-only peer" />
                                        <div class="w-4 h-4 rounded-full border-2 border-gray-200 dark:border-gray-700 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all flex items-center justify-center">
                                            <div class="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                                        </div>
                                        <span class="ml-3 text-xs font-semibold text-gray-500 dark:text-gray-450 group-hover:text-gray-900 dark:group-hover:text-white peer-checked:text-gray-900 dark:peer-checked:text-white transition-colors">{{ opt.l }}</span>
                                    </label>
                                </div>
                            </section>

                            <!-- Categories -->
                            <section v-if="categories.length > 0">
                                <h3 class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{{ $t('account.tab_all') }}</h3>
                                <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    <label class="flex items-center group cursor-pointer">
                                        <input type="radio" :value="null" v-model="selectedCategory" class="sr-only peer" />
                                        <div class="w-4 h-4 rounded-md border-2 border-gray-200 dark:border-gray-700 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all flex items-center justify-center">
                                            <i class="fas fa-check text-[8px] text-white opacity-0 peer-checked:opacity-100"></i>
                                        </div>
                                        <span class="ml-3 text-xs font-semibold text-gray-500 dark:text-gray-450 group-hover:text-gray-900 dark:group-hover:text-white peer-checked:text-gray-900 dark:peer-checked:text-white transition-colors">{{ $t('products.allCategories') }}</span>
                                    </label>
                                    <label v-for="cat in categories" :key="cat.name" class="flex items-center group cursor-pointer justify-between">
                                        <div class="flex items-center min-w-0">
                                            <input type="radio" :value="cat.name" v-model="selectedCategory" class="sr-only peer" />
                                            <div class="w-4 h-4 rounded-md border-2 border-gray-200 dark:border-gray-700 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-all flex items-center justify-center flex-shrink-0">
                                                <i class="fas fa-check text-[8px] text-white opacity-0 peer-checked:opacity-100"></i>
                                            </div>
                                            <span class="ml-3 text-xs font-semibold text-gray-500 dark:text-gray-450 group-hover:text-gray-900 dark:group-hover:text-white peer-checked:text-gray-900 dark:peer-checked:text-white transition-colors truncate max-w-[120px]">{{ cat.name }}</span>
                                        </div>
                                        <span class="text-[10px] font-bold px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-md group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ cat.count }}</span>
                                    </label>
                                </div>
                            </section>

                            <!-- Promotions Toggle -->
                            <section class="pt-6 border-t border-gray-50 dark:border-gray-850">
                                <label class="flex items-center justify-between cursor-pointer group">
                                    <span class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ $t('store.promo_only') }}</span>
                                    <div class="relative inline-block w-10 h-6 align-middle select-none">
                                        <input type="checkbox" v-model="showOnlyPromos" class="sr-only peer" />
                                        <div class="w-10 h-6 bg-gray-200 dark:bg-gray-850 rounded-full peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-200 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </div>
                                </label>
                            </section>
                        </div>
                    </div>
                </aside>

                <!-- Products Grid (Main Content) -->
                <div class="flex-1 min-w-0">
                    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        <div v-for="i in 6" :key="i" class="h-72 bg-white dark:bg-gray-900 rounded-3xl animate-pulse shadow-sm border border-gray-100 dark:border-gray-800"></div>
                    </div>

                    <div v-else-if="error" class="bg-white dark:bg-gray-900 p-12 rounded-3xl border border-red-50 dark:border-red-950/20 text-center shadow-sm">
                        <div class="w-20 h-20 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-exclamation-triangle text-red-500 dark:text-red-400 text-3xl"></i>
                        </div>
                        <h4 class="font-bold text-gray-900 dark:text-white text-xl">{{ error }}</h4>
                        <button @click="fetchStoreData" class="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
                            Réessayer
                        </button>
                    </div>

                    <div v-else-if="products.length === 0" class="bg-white dark:bg-gray-900 p-20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-850 text-center shadow-sm">
                        <div class="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-box-open text-gray-200 dark:text-gray-700 text-4xl"></i>
                        </div>
                        <h4 class="font-bold text-gray-900 dark:text-white text-2xl">Boutique vide</h4>
                        <p class="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">Ce vendeur n'a pas encore ajouté de produits dans sa boutique publique.</p>
                    </div>

                    <div v-else>
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 px-2 gap-4">
                            <div>
                                <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Tous nos produits</h2>
                                <p class="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">Affichage de {{ filteredProducts.length }} produit(s)</p>
                            </div>
                            
                            <!-- Mobile Filter Button (can be added later if needed) -->
                            <div class="lg:hidden flex gap-2">
                                <!-- Could add a simpler Sort dropdown for mobile here -->
                            </div>
                        </div>
                        
                        <!-- Empty results -->
                        <div v-if="filteredProducts.length === 0" class="bg-white dark:bg-gray-900 py-20 px-6 rounded-3xl text-center border border-gray-100 dark:border-gray-800">
                            <div class="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200 dark:text-gray-750">
                                <i class="fas fa-search text-3xl"></i>
                            </div>
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Aucun résultat trouvé</h3>
                            <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">Essayez d'ajuster vos filtres pour trouver ce que vous cherchez.</p>
                            <button @click="searchQuery = ''; selectedCategory = null; showOnlyPromos = false" class="mt-6 text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline">
                                Réinitialiser les filtres
                            </button>
                        </div>

                        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
