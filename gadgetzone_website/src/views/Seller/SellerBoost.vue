<template>
  <div class="w-full pt-4 pb-32 px-4">
      <div class="flex items-center gap-3 mb-8">
          <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <i class="fas fa-arrow-left"></i>
          </button>
          <div>
              <h1 class="text-2xl font-bold text-gray-900">Booster Visibilité</h1>
              <p class="text-sm text-gray-500">Mettez vos produits en avant</p>
          </div>
      </div>

      <!-- Success Alert -->
      <div v-if="$route.query.success" class="mb-8 bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3 text-green-700">
          <i class="fas fa-check-circle"></i>
          <p class="text-sm font-medium">Votre paiement a été reçu. Votre boost sera activé dans quelques instants !</p>
      </div>

      <!-- Hero Promo -->
      <div class="bg-gray-900 rounded-3xl p-6 text-white mb-8 relative overflow-hidden shadow-xl">
          <div class="relative z-10">
              <h2 class="text-2xl font-bold mb-2">Vendez 5x plus vite</h2>
              <p class="text-sm text-gray-400 mb-6">En boostant vos produits, ils apparaissent en haut des résultats de recherche et sur la page d'accueil.</p>
              <div class="flex items-center gap-2 text-orange-400 font-bold mb-6">
                  <i class="fas fa-bolt"></i>
                  <span>+450% de vues en moyenne</span>
              </div>
          </div>
          <i class="fas fa-rocket absolute -right-6 -bottom-6 text-[150px] text-white/5 -rotate-12"></i>
      </div>

      <!-- Boost Packages -->
      <h3 class="font-bold text-lg text-gray-900 mb-4">Choisissez un pack</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div v-for="pkg in packages" :key="pkg.name" class="bg-white p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group" :class="selectedPackage?.name === pkg.name ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100 hover:border-gray-200'" @click="selectedPackage = pkg">
              <div v-if="pkg.popular" class="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Populaire</div>
              <div class="flex justify-between items-center mb-2">
                  <span class="font-bold text-gray-900">{{ pkg.name }}</span>
                  <span class="text-xl font-black text-gray-900">{{ pkg.price }} <span class="text-xs">HTG</span></span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                  <i class="fas fa-calendar-alt text-orange-400"></i>
                  <span>Durée : {{ pkg.duration }} jours</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <i class="fas fa-eye text-orange-400"></i>
                  <span>Visibilité : {{ pkg.impact }}</span>
              </div>
          </div>
      </div>

      <!-- Cost Model Selection -->
      <h3 class="font-bold text-lg text-gray-900 mb-4">Modèle de facturation</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div 
              v-for="model in costModels" 
              :key="model.value" 
              class="bg-white p-5 rounded-2xl border-2 transition-all cursor-pointer relative" 
              :class="selectedCostModel === model.value ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100 hover:border-gray-200'"
              @click="selectedCostModel = model.value"
          >
              <div class="font-bold text-gray-900 mb-1">{{ model.label }}</div>
              <p class="text-xs text-gray-500">{{ model.description }}</p>
          </div>
      </div>

      <!-- Budget Capping -->
      <div v-if="selectedCostModel !== 'flat'" class="mb-8 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 class="font-bold text-sm text-gray-900 mb-2">Budget maximum de la campagne (HTG)</h3>
          <div class="flex items-center gap-3">
              <input 
                  v-model.number="campaignBudget" 
                  type="number" 
                  min="100" 
                  step="50"
                  class="rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all p-3 text-sm flex-1" 
                  placeholder="Ex: 1000"
              />
              <span class="text-sm font-bold text-gray-500">HTG</span>
          </div>
          <p class="text-[10px] text-gray-400 mt-2">La campagne s'arrêtera automatiquement une fois ce budget épuisé ou après la durée du pack.</p>
      </div>

      <!-- Product Selection -->
      <h3 class="font-bold text-lg text-gray-900 mb-4">Produit à booster</h3>
      <div @click="showModal = true" class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4 cursor-pointer active:scale-[0.98] transition-all">
          <div class="flex items-center gap-3">
              <div v-if="selectedProduct" class="w-12 h-12 rounded-xl overflow-hidden bg-gray-50">
                  <img alt="" :src="selectedProduct.image_url" class="w-full h-full object-cover">
              </div>
              <div v-else class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                  <i class="fas fa-shopping-bag"></i>
              </div>
              <div>
                  <p class="text-sm font-bold text-gray-800">{{ selectedProduct ? selectedProduct.name : 'Sélectionner un produit' }}</p>
                  <p class="text-[10px] text-gray-400">{{ selectedProduct ? selectedProduct.price + ' HTG' : 'Appuyez pour choisir dans votre catalogue' }}</p>
              </div>
          </div>
          <i class="fas fa-chevron-right text-xs text-gray-300"></i>
      </div>

      <!-- Active Boosts Section -->
      <div v-if="activeBoosts.length > 0" class="mt-12">
          <h3 class="font-bold text-lg text-gray-900 mb-4">Vos Boosts Actifs</h3>
          <div class="space-y-4">
              <div v-for="boost in activeBoosts" :key="boost.id" class="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-4 shadow-sm">
                  <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                          <img alt="" :src="boost.product?.image_url" class="w-12 h-12 rounded-xl object-cover border border-gray-100">
                          <div>
                              <p class="text-sm font-bold text-gray-900 line-clamp-1">{{ boost.product?.name }}</p>
                              <p class="text-[10px] text-gray-500">Mode: <span class="font-semibold uppercase">{{ boost.cost_model || 'flat' }}</span></p>
                          </div>
                      </div>
                      <div class="text-right">
                          <span :class="getStatusClass(boost.status)" class="text-xs px-2.5 py-1 rounded-full border">
                              {{ boost.status === 'active' ? 'Actif' : boost.status === 'pending' ? 'En attente' : boost.status === 'expired' ? 'Expiré' : boost.status }}
                          </span>
                      </div>
                  </div>

                  <!-- Stats Row -->
                  <div class="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl text-center">
                      <div>
                          <p class="text-[10px] text-gray-400 font-bold uppercase">Affichages</p>
                          <p class="text-sm font-black text-gray-800">{{ boost.impressions || 0 }}</p>
                      </div>
                      <div>
                          <p class="text-[10px] text-gray-400 font-bold uppercase">Clics</p>
                          <p class="text-sm font-black text-gray-800">{{ boost.clicks || 0 }}</p>
                      </div>
                      <div>
                          <p class="text-[10px] text-gray-400 font-bold uppercase">Taux de Clic</p>
                          <p class="text-sm font-black text-gray-800">{{ boost.impressions ? ((boost.clicks || 0) / boost.impressions * 100).toFixed(2) + '%' : '0%' }}</p>
                      </div>
                  </div>

                  <!-- Budget Progress -->
                  <div v-if="boost.cost_model && boost.cost_model !== 'flat'" class="space-y-1">
                      <div class="flex justify-between text-[10px] text-gray-500 font-bold">
                          <span>Budget dépensé</span>
                          <span>{{ Number(boost.spent || 0).toFixed(2) }} / {{ boost.budget }} HTG</span>
                      </div>
                      <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div class="h-full bg-orange-500 rounded-full" :style="{ width: Math.min(((boost.spent || 0) / (boost.budget || 1)) * 100, 100) + '%' }"></div>
                      </div>
                  </div>

                  <div class="flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-50 pt-3">
                      <span>Pack: {{ boost.package_name }} ({{ boost.amount }} HTG)</span>
                      <span v-if="boost.endsAt">Expire le {{ new Date(boost.endsAt).toLocaleDateString() }}</span>
                  </div>
              </div>
          </div>
      </div>

      <!-- Product Selection Modal -->
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showModal = false"></div>
          <div class="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up">
              <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h4 class="font-bold text-gray-900">Choisir un produit</h4>
                  <button @click="showModal = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
              </div>
              <div class="max-h-[60vh] overflow-y-auto p-4 space-y-3">
                  <div v-if="loading" class="text-center py-8">
                      <i class="fas fa-circle-notch fa-spin text-orange-500 text-2xl"></i>
                  </div>
                  <div v-else-if="myProducts.length === 0" class="text-center py-8 text-gray-500">
                      Vous n'avez aucun produit actif.
                  </div>
                  <div v-else v-for="prod in myProducts" :key="prod.id" 
                      @click="selectProduct(prod)"
                      class="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-orange-500 cursor-pointer transition-all">
                      <img alt="" :src="prod.image_url" class="w-12 h-12 rounded-xl object-cover">
                      <div class="flex-1">
                          <p class="text-sm font-bold text-gray-900 line-clamp-1">{{ prod.name }}</p>
                          <p class="text-xs text-gray-500 font-medium">{{ prod.price }} HTG</p>
                      </div>
                      <i v-if="selectedProduct?.id === prod.id" class="fas fa-check-circle text-orange-500"></i>
                  </div>
              </div>
          </div>
      </div>

      <!-- Footer Action -->
      <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4 items-center z-50">
          <div class="hidden md:block">
              <p class="text-[10px] text-gray-400 uppercase font-bold">Total à payer</p>
              <p class="text-lg font-bold text-gray-900">{{ selectedPackage ? selectedPackage.price : 0 }} HTG</p>
          </div>
          <button 
            @click="handleBoost"
            :disabled="!selectedProduct || !selectedPackage || processing"
            class="flex-1 bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100">
              <i v-if="processing" class="fas fa-circle-notch fa-spin mr-2"></i>
              Activer le Boost
          </button>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { vendorService } from '@/services/vendor';
import { useUiStore } from '@/stores/ui';

const showModal = ref(false);
const loading = ref(false);
const processing = ref(false);
const uiStore = useUiStore();
const myProducts = ref<any[]>([]);
const activeBoosts = ref<any[]>([]);
const checkInterval = ref<any>(null);

const packages = [
    { name: 'Essentiel', price: 250, duration: 3, impact: 'Basique', popular: false },
    { name: 'Standard', price: 500, duration: 7, impact: 'Élevée', popular: true },
    { name: 'Premium', price: 1500, duration: 30, impact: 'Maximale', popular: false }
];

const selectedPackage = ref<any>(packages[1]);
const selectedProduct = ref<any>(null);

const costModels = [
    { value: 'flat', label: 'Forfait fixe', description: 'Affichage illimité pendant toute la durée du pack.' },
    { value: 'cpc', label: 'Pay-per-Click (CPC)', description: '5.00 HTG par clic. Consomme le budget alloué.' },
    { value: 'cpm', label: 'Pay-per-View (CPM)', description: '20.00 HTG pour 1000 affichages. Consomme le budget.' }
];

const selectedCostModel = ref('flat');
const campaignBudget = ref<number | null>(500);

const fetchInitialData = async () => {
    loading.value = true;
    try {
        const [products, boosts] = await Promise.all([
            vendorService.getMyProducts(),
            vendorService.getMyBoosts()
        ]);
        myProducts.value = products.products || products;
        activeBoosts.value = boosts.boosts || boosts;
    } catch (err) {
        console.error('Error loading data:', err);
    } finally {
        loading.value = false;
    }
}

const selectProduct = (prod: any) => {
    selectedProduct.value = prod;
    showModal.value = false;
}

const handleBoost = async () => {
    if (!selectedProduct.value || !selectedPackage.value) return;
    
    processing.value = true;
    try {
        const adData: any = {
            costModel: selectedCostModel.value
        };
        if (selectedCostModel.value !== 'flat') {
            adData.budget = campaignBudget.value;
        }

        const response = await vendorService.createBoost(
            selectedProduct.value.id, 
            selectedPackage.value.name,
            adData
        );
        
        if (response.redirectUrl) {
            window.location.href = response.redirectUrl;
        }
    } catch (error: any) {
        console.error('Boost error:', error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Une erreur est survenue lors de la redirection vers MonCash.';
        alert(`Erreur: ${errorMessage}`);
    } finally {
        processing.value = false;
    }
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'active': return 'text-green-500 font-bold';
        case 'pending': return 'text-orange-500 italic';
        case 'expired': return 'text-gray-400';
        default: return '';
    }
}

onMounted(() => {
    fetchInitialData();
    uiStore.isSellerNavVisible = false;

    // Si on revient d'un paiement réussi, on poll le backend pour activer le boost instantanément
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        let attempts = 0;
        checkInterval.value = setInterval(async () => {
            attempts++;
            await fetchInitialData();
            
            // Si un boost est devenu actif, on arrête le polling
            const hasActive = activeBoosts.value.some(b => b.status === 'active');
            if (hasActive || attempts > 10) {
                clearInterval(checkInterval.value);
            }
        }, 3000); // Toutes les 3 secondes
    }
});

onUnmounted(() => {
    uiStore.isSellerNavVisible = true;
    if (checkInterval.value) clearInterval(checkInterval.value);
});
</script>

<style scoped>
.animate-slide-up {
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}
</style>
