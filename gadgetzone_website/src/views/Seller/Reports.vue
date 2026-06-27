<template>
  <div class="w-full lg:pt-4 pb-12">
    <!-- MOBILE HEADER (Blue Gradient Theme) -->
    <div class="lg:hidden bg-gray-50 min-h-screen pb-20 -mt-2 font-sans">
        <!-- Top Section -->
        <div class="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 pt-8 pb-10 relative rounded-b-[40px] shadow-lg shadow-blue-900/20">
            <div class="flex justify-between items-center mb-6">
                <button @click="router.back()" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md active:scale-95 transition-all">
                    <i class="fas fa-arrow-left text-sm"></i>
                </button>
                <h1 class="font-bold text-lg tracking-wide">Rapports & Ventes</h1>
                <div class="w-10"></div> <!-- Spacer for center alignment -->
            </div>

            <!-- Main Stat (Revenue) -->
            <div class="text-center mb-4">
                <p class="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Chiffre d'Affaires Total</p>
                <div class="flex items-center justify-center gap-2">
                    <h2 class="text-4xl font-extrabold tracking-tight">{{ formatPrice(stats.sales).replace('HTG', '').trim() }}</h2>
                    <span class="text-lg font-bold text-blue-300">HTG</span>
                </div>
                
                <!-- Net Income Breakdown -->
                <div class="mt-3 flex justify-center gap-4">
                    <div class="text-center px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                        <p class="text-[10px] text-blue-200 uppercase font-bold">Commission ({{ storeCommissionRate * 100 }}%)</p>
                        <p class="text-sm font-bold text-white">{{ formatPrice(commissionAmount) }}</p>
                    </div>
                    <div class="text-center px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-lg backdrop-blur-sm">
                        <p class="text-[10px] text-green-200 uppercase font-bold">Net à Recevoir</p>
                        <p class="text-sm font-bold text-green-100">{{ formatPrice(netEarnings) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Floating Stats Cards -->
        <div class="px-5 -mt-8 relative z-10 grid grid-cols-2 gap-4">
            <!-- Orders Card -->
            <div class="bg-white p-5 rounded-3xl shadow-lg shadow-blue-900/5 group active:scale-[0.98] transition-all border border-gray-50">
                <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <i class="fas fa-shopping-bag text-lg"></i>
                </div>
                <p class="text-xs text-gray-400 font-bold uppercase">Commandes</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.orders }}</p>
            </div>
            
            <!-- Products Card -->
            <div class="bg-white p-5 rounded-3xl shadow-lg shadow-blue-900/5 group active:scale-[0.98] transition-all border border-gray-50">
                <div class="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <i class="fas fa-box-open text-lg"></i>
                </div>
                <p class="text-xs text-gray-400 font-bold uppercase">Produits</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.products }}</p>
            </div>
        </div>

        <!-- Chart Section -->
        <div class="px-5 mt-6">
            <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-gray-900 text-lg">Aperçu des Ventes</h3>
                    <select v-model="timeRange" class="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-100">
                        <option value="7d">7 Jours</option>
                        <option value="30d">30 Jours</option>
                        <option value="12m">12 Mois</option>
                    </select>
                </div>
                
                <div class="h-48 relative w-full">
                     <!-- No data overlay -->
                     <div v-if="!hasSalesData" class="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] z-10 rounded-2xl pointer-events-none">
                         <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-1.5">
                             <i class="fas fa-chart-line text-sm"></i>
                         </div>
                         <p class="text-[11px] font-bold text-gray-400">Aucune activité de vente</p>
                     </div>
                     <svg viewBox="0 0 100 50" class="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="mobileGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.2"/>
                          <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
                        </linearGradient>
                      </defs>
                      <path :d="areaPath" fill="url(#mobileGradient)" stroke="none" />
                      <path :d="linePath" fill="none" stroke="#2563EB" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
                      <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="1.5" fill="#2563EB" class="opacity-0 hover:opacity-100 md:opacity-100 transition-opacity" />
                  </svg>
                </div>
                
                <!-- X Axis (Dates) -->
                <div class="flex justify-between mt-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    <span>{{ firstDate }}</span>
                    <span>{{ midDate }}</span>
                    <span>{{ lastDate }}</span>
                </div>
            </div>
        </div>

        <!-- Recent Sales List -->
        <div class="px-5 mt-8 pb-10">
            <h3 class="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <i class="fas fa-history text-blue-600"></i> Les Ventes
            </h3>
            
            <div class="space-y-3">
                 <div v-for="sale in filteredRecentSales" :key="sale.id" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4 active:scale-[0.99] transition-transform">
                     <div class="w-12 h-12 rounded-xl bg-gray-50 p-1 flex-shrink-0 border border-gray-100">
                         <img alt="" :src="sale.image || '/placeholder.png'" class="w-full h-full object-cover rounded-lg mix-blend-multiply" />
                     </div>
                     <div class="flex-1 min-w-0">
                         <h4 class="font-bold text-gray-900 text-sm truncate">{{ sale.productName }}</h4>
                         <p class="text-xs text-gray-400 mt-0.5">{{ formatDateFull(sale.date) }}</p>
                     </div>
                     <div class="text-right">
                         <div v-if="sale.grossPrice" class="flex flex-col items-end mb-1">
                             <span class="text-[10px] text-gray-300 line-through leading-none">{{ formatPrice(sale.grossPrice) }}</span>
                             <span class="text-[9px] text-red-500 font-bold bg-red-50 px-1 rounded">{{ sale.commissionRate }}%</span>
                         </div>
                         <p class="font-bold text-gray-900 text-sm">{{ formatPrice(sale.netPrice || sale.price) }} <span class="text-[10px] opacity-60">HTG</span></p>
                         <p class="text-[10px] font-bold uppercase tracking-wider text-green-600 mt-1 bg-green-50 px-2 py-0.5 rounded-full inline-block">Net Reçu</p>
                     </div>
                 </div>

                 <!-- Empty State -->
                 <div v-if="filteredRecentSales.length === 0" class="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-200">
                     <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                         <i class="fas fa-receipt"></i>
                     </div>
                     <p class="text-gray-500 text-sm">Aucune vente sur cette période.</p>
                 </div>
            </div>
        </div>
    </div>




    <!-- DESKTOP DASHBOARD (Hidden on Mobile) -->
    <div class="hidden lg:flex flex-col lg:flex-row gap-6 lg:items-start">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content -->
      <div class="flex-1 w-full pb-20">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Rapports & Ventes</h1>
                <p class="text-gray-500 text-sm mt-1">Analysez la performance de votre boutique.</p>
            </div>
            
            <div class="flex gap-3">
                <div class="relative">
                    <i class="fas fa-calendar text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm"></i>
                    <select v-model="timeRange" class="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm">
                        <option value="30d">30 Derniers Jours</option>
                        <option value="7d">7 Derniers Jours</option>
                        <option value="12m">12 derniers mois</option>
                    </select>
                </div>
                <button class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
                    <i class="fas fa-download"></i> Exporter
                </button>
            </div>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
        </div>

        <div v-else class="space-y-6">
          
          <!-- Summary Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Revenue Card -->
            <div class="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative overflow-hidden group">
                <div class="relative z-10">
                    <div class="flex justify-between items-start mb-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-wallet"></i>
                        </div>
                        <span class="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <i class="fas fa-arrow-up text-[10px]"></i> 12.5%
                        </span>
                    </div>
                    <p class="text-sm font-bold text-gray-400 uppercase tracking-wide">Chiffre d'Affaires Brut</p>
                    <h3 class="text-3xl font-extrabold text-gray-900 mt-1">{{ formatPrice(stats.sales) }} <span class="text-sm opacity-50">HTG</span></h3>
                    <div class="mt-3 py-2 px-3 bg-red-50/50 rounded-xl border border-red-100/50">
                        <div class="flex justify-between items-center text-xs font-bold">
                            <span class="text-gray-400 uppercase tracking-tighter">Commission GadgetZone</span>
                            <span class="text-red-500 font-black">- {{ formatPrice(commissionAmount) }} HTG</span>
                        </div>
                    </div>
                    <div class="mt-2 py-2 px-3 bg-green-50/50 rounded-xl border border-green-100/50">
                        <div class="flex justify-between items-center text-sm font-bold">
                            <span class="text-green-600/70 uppercase tracking-tighter font-black">Votre Revenu Net</span>
                            <span class="text-green-600 font-black">{{ formatPrice(netEarnings) }} HTG</span>
                        </div>
                    </div>
                </div>
                <!-- Decor -->
                <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl group-hover:bg-blue-100/50 transition-colors"></div>
            </div>

            <!-- Orders Card -->
            <div class="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative overflow-hidden group">
                <div class="relative z-10">
                    <div class="flex justify-between items-start mb-4">
                         <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <span class="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <i class="fas fa-arrow-up text-[10px]"></i> 5.2%
                        </span>
                    </div>
                    <p class="text-sm font-bold text-gray-400 uppercase tracking-wide">Total Commandes</p>
                    <h3 class="text-3xl font-extrabold text-gray-900 mt-1">{{ stats.orders }}</h3>
                </div>
                 <!-- Decor -->
                <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-purple-50/50 rounded-full blur-2xl group-hover:bg-purple-100/50 transition-colors"></div>
            </div>

            <!-- Products Card -->
            <div class="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative overflow-hidden group">
                <div class="relative z-10">
                    <div class="flex justify-between items-start mb-4">
                         <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-box-open"></i>
                        </div>
                         <span class="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <i class="fas fa-minus text-[10px]"></i> 0%
                        </span>
                    </div>
                    <p class="text-sm font-bold text-gray-400 uppercase tracking-wide">Produits Actifs</p>
                    <h3 class="text-3xl font-extrabold text-gray-900 mt-1">{{ stats.products }}</h3>
                </div>
                 <!-- Decor -->
                <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-50/50 rounded-full blur-2xl group-hover:bg-orange-100/50 transition-colors"></div>
            </div>
          </div>

          <!-- Main Chart -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div class="flex justify-between items-center mb-8">
                  <div>
                      <h3 class="text-lg font-bold text-gray-900">Performance des Ventes</h3>
                      <p class="text-sm text-gray-500 mt-1">Comparaison des revenus sur la période sélectionnée.</p>
                  </div>
                  <!-- Legend -->
                  <div class="flex items-center gap-4">
                      <div class="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <span class="w-3 h-3 rounded-full bg-blue-500"></span> Ventes
                      </div>
                      <div class="flex items-center gap-2 text-sm font-medium text-gray-400">
                          <span class="w-3 h-3 rounded-full bg-gray-300"></span> Prévisions
                      </div>
                  </div>
              </div>

              <!-- SVG Chart Container -->
              <div class="relative h-80 w-full bg-gray-50/50 rounded-2xl border border-gray-100/50 p-4">
                  <!-- No data overlay -->
                  <div v-if="!hasSalesData" class="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px] z-10 rounded-2xl pointer-events-none">
                      <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2 text-lg">
                          <i class="fas fa-chart-line"></i>
                      </div>
                      <p class="text-sm font-bold text-gray-400">Aucune activité de vente sur cette période</p>
                  </div>
                  <svg viewBox="0 0 100 50" class="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <!-- Gradient definition -->
                      <defs>
                        <linearGradient id="desktopGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.15"/>
                          <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
                        </linearGradient>
                      </defs>
                      <path :d="areaPath" fill="url(#desktopGradient)" stroke="none" />
                      <path :d="linePath" fill="none" stroke="#2563EB" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
                      
                      <!-- Interactive Points -->
                      <circle 
                        v-for="(point, index) in points" 
                        :key="index"
                        :cx="point.x" 
                        :cy="point.y" 
                        r="0.5" 
                        fill="#2563EB" 
                        class="hover:r-1.5 transition-all cursor-pointer opacity-0 hover:opacity-100"
                        :title="`${formatDateShort(point.date)}: ${formatPrice(point.amount)}`"
                      />
                  </svg>
                  
                  <!-- X Axis -->
                  <div class="flex justify-between mt-4 text-xs font-medium text-gray-400 uppercase tracking-wider px-2">
                       <span v-for="(point, i) in points" :key="'label-'+i" v-show="i % 2 === 0">{{ formatDateShort(point.date) }}</span>
                  </div>
              </div>
          </div>

          <!-- Sales Table -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                 <div>
                     <h3 class="text-lg font-bold text-gray-900">Détails des Ventes</h3>
                     <p class="text-sm text-gray-500 mt-1">Liste détaillée de vos transactions sur la période.</p>
                 </div>
                 
                 <div class="relative w-72">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-search text-gray-400 text-sm"></i>
                    </span>
                    <input 
                      v-model="saleSearch" 
                      type="text" 
                      placeholder="Rechercher un produit..." 
                      class="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400"
                    />
                 </div>
             </div>
             
             <div class="overflow-x-auto">
                 <table class="w-full text-left border-collapse">
                     <thead>
                         <tr class="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                             <th class="px-8 py-4">Produit</th>
                             <th class="px-8 py-4">Quantité</th>
                             <th class="px-8 py-4">Client</th>
                             <th class="px-8 py-4">Date</th>
                             <th class="px-8 py-4 text-right">Montant</th>
                             <th class="px-8 py-4 text-center">Statut</th>
                         </tr>
                     </thead>
                     <tbody class="divide-y divide-gray-50">
                         <tr v-for="sale in filteredRecentSales" :key="sale.id" class="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                             <td class="px-8 py-4">
                                 <div class="flex items-center gap-4">
                                     <div class="w-12 h-12 rounded-xl bg-gray-100 p-0.5 border border-gray-200 flex-shrink-0">
                                        <img alt="" :src="sale.image || '/placeholder.png'" class="w-full h-full object-cover rounded-lg mix-blend-multiply" />
                                     </div>
                                     <div>
                                         <p class="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">{{ sale.productName }}</p>
                                         <p class="text-xs text-gray-500">SKU: {{ sale.sku || 'N/A' }}</p>
                                     </div>
                                 </div>
                             </td>
                             <td class="px-8 py-4 text-sm font-medium text-gray-600">
                                 1 <!-- Replace with real qty if available in mock/api -->
                             </td>
                             <td class="px-8 py-4">
                                 <div class="flex items-center gap-2">
                                     <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                         {{ (sale.customerName || 'C').charAt(0) }}
                                     </div>
                                     <span class="text-sm font-medium text-gray-700">{{ sale.customerName || 'Client' }}</span>
                                 </div>
                             </td>
                             <td class="px-8 py-4 text-sm text-gray-500">
                                 {{ formatDateFull(sale.date) }}
                             </td>
                             <td class="px-8 py-4 text-right">
                                 <div v-if="sale.grossPrice" class="flex flex-col items-end mb-1">
                                    <span class="text-[10px] text-gray-300 line-through">{{ formatPrice(sale.grossPrice) }}</span>
                                    <span class="text-[9px] text-red-500 font-bold bg-red-50 px-1 rounded">{{ sale.commissionRate }}%</span>
                                 </div>
                                 <span class="text-sm font-bold text-gray-900 font-mono">{{ formatPrice(sale.netPrice || sale.price) }} <span class="text-[11px] opacity-60">HTG</span></span>
                             </td>
                             <td class="px-8 py-4 text-center">
                                 <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                     Gain Net
                                 </span>
                             </td>
                         </tr>
                         <tr v-if="filteredRecentSales.length === 0">
                            <td colspan="6" class="px-8 py-16 text-center">
                                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <i class="fas fa-search text-2xl"></i>
                                </div>
                                <h4 class="text-gray-900 font-bold mb-1">Aucun résultat</h4>
                                <p class="text-gray-500 text-sm">Essayez de modifier vos filtres de recherche.</p>
                            </td>
                         </tr>
                     </tbody>
                 </table>
             </div>
             
             <!-- Pagination (Desktop) -->
             <div class="bg-white px-8 py-4 border-t border-gray-100 flex items-center justify-between">
                 <p class="text-sm text-gray-500">
                     Affichage de <span class="font-bold text-gray-900">{{ filteredRecentSales.length }}</span> ventes
                 </p>
                 <div class="flex gap-2">
                     <button class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-50" disabled>
                         <i class="fas fa-chevron-left text-xs"></i>
                     </button>
                     <button class="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-blue-200">1</button>
                      <button class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-50" disabled>
                         <i class="fas fa-chevron-right text-xs"></i>
                     </button>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const timeRange = ref('30d');
const saleSearch = ref('');
const stats = ref({
    sales: 0,
    orders: 0,
    products: 0,
    chartData: [] as { date: string, amount: number }[],
    recentSales: [] as any[]
});

const filteredRecentSales = computed(() => {
    if (!saleSearch.value) return stats.value.recentSales || [];
    const query = saleSearch.value.toLowerCase();
    return (stats.value.recentSales || []).filter(sale => 
        (sale.productName || '').toLowerCase().includes(query)
    );
});

const hasSalesData = computed(() => {
    return stats.value.chartData && stats.value.chartData.some(d => d.amount > 0);
});

// Improved Chart Logic for smoother curves and scaling
const points = computed(() => {
    if (!stats.value.chartData || stats.value.chartData.length === 0) return [];

    const data = stats.value.chartData;
    const maxVal = Math.max(...data.map(d => d.amount)) || 100; // avoid div by 0
    
    // Normalize to 0-100 x, 0-50 y (SVG viewbox)
    const height = 50; 
    const width = 100;

    return data.map((d, i) => ({
        x: (i / (data.length - 1 || 1)) * width,
        y: height - ((d.amount / maxVal) * height * 0.8) - 5, // -5 to lift slightly off bottom, *0.8 for top padding
        amount: d.amount,
        date: d.date
    }));
});

const linePath = computed(() => {
    if (points.value.length === 0) return '';
    const pts = points.value;
    
    // Create a smooth curve using Catmull-Rom or simple Bezier logic if needed. 
    // For simplicity but better looks, let's just stick to straight lines or basic svg curve.
    // To keep it robust without heavy math libraries, we stick to polyline logic but maybe add slight smoothing?
    // Let's stick to straight lines as they are safer to generate manually.
    const first = pts[0];
    if (!first) return '';
    return `M ${first.x} ${first.y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
});

const areaPath = computed(() => {
    if (points.value.length === 0) return '';
    const pts = points.value;
    const first = pts[0];
    const last = pts[pts.length - 1];
    
    if (!first || !last) return '';

    const line = linePath.value;
    return `${line} L ${last.x} 50 L ${first.x} 50 Z`;
});


const fetchData = async () => {
    loading.value = true;
    try {
        // Check vendor status first
        const storeRes = await api.get('/vendors/me');
        const storeStatus = storeRes.data.status;

        if (storeStatus !== 'active') {
            console.warn("Store not active, skipping stats fetch");
            loading.value = false;
            return;
        }

        const res = await api.get('/vendors/me/stats', {
            params: { period: timeRange.value }
        });
        stats.value = res.data;
        
        // Mock data if empty for demonstration (only if server returns nothing)
        if (!stats.value.chartData || stats.value.chartData.length === 0) {
            const today = new Date();
            const count = timeRange.value === '7d' ? 7 : (timeRange.value === '12m' ? 12 : 30);
            stats.value.chartData = Array.from({length: count}, (_, i) => {
                const d = new Date();
                if (timeRange.value === '12m') {
                    d.setMonth(today.getMonth() - (count - 1 - i));
                } else {
                    d.setDate(today.getDate() - (count - 1 - i));
                }
                return {
                    date: d.toISOString().split('T')[0] || '',
                    amount: 0
                };
            });
        }
    } catch (e) {
        console.error("Failed to load stats", e);
    } finally {
        loading.value = false;
    }
};

watch(timeRange, () => {
    fetchData();
});

onMounted(() => {
    fetchData();
});

// Commission Rate
const authStore = useAuthStore();
const storeCommissionRate = computed(() => {
    return ((authStore as any).store?.commission_rate || 5) / 100;
});

const commissionAmount = computed(() => {
    return (stats.value.sales || 0) * storeCommissionRate.value;
});

const netEarnings = computed(() => {
    return (stats.value.sales || 0) - commissionAmount.value;
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
};

const formatDateShort = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};

const formatDateFull = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
const firstDate = computed(() => {
    const data = stats.value.chartData;
    const first = data && data.length > 0 ? data[0] : null;
    return (first && first.date) ? formatDateShort(first.date) : '';
});

const midDate = computed(() => {
    const data = stats.value.chartData;
    const mid = (data && data.length > 0) ? data[Math.floor(data.length / 2)] : null;
    return (mid && mid.date) ? formatDateShort(mid.date) : '';
});

const lastDate = computed(() => {
    const data = stats.value.chartData;
    const last = (data && data.length > 0) ? data[data.length - 1] : null;
    return (last && last.date) ? formatDateShort(last.date) : '';
});
</script>
