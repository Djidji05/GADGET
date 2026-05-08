<template>
<div class="hidden md:block w-64 flex-shrink-0 sticky top-8 h-fit z-40 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
 <div class="flex items-center justify-between mb-4">
 <h2 class="text-lg font-bold text-gray-900 ">Ma Boutique</h2>
 </div>

 <div class="mb-6 text-center">
 <div class="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 overflow-hidden shadow-inner">
 <img 
 v-if="store.logoUrl" 
 :src="store.logoUrl" 
 class="w-full h-full object-cover" 
 />
 <i v-else class="fas fa-store text-3xl text-gray-200"></i>
 </div>
 <h3 class="mt-3 font-bold text-gray-900 truncate px-2">{{ store.name || 'Ma Boutique' }}</h3>
 <div class="mt-2 text-center flex justify-center">
 <span class="text-[10px] uppercase font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">Boutique Pro</span>
 </div>
 </div>
 
 <nav class="space-y-1">
 <router-link 
 to="/" 
 class="flex items-center px-4 py-3 mb-2 rounded-xl font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 :bg-red-900/20 transition-all group"
 >
 <i class="fas fa-arrow-left mr-3 w-5 group-hover:-translate-x-1 transition-transform"></i>
 <span>Retour au site</span>
 </router-link>

 <router-link 
 to="/seller/dashboard" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-home mr-3 w-5 group-hover:scale-110 transition-transform"></i>
 <span>Tableau de bord</span>
 </router-link>

 <router-link 
 to="/seller/notifications" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group relative"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-bell mr-3 w-5 group-hover:scale-110 transition-transform"></i>
 <span>Notifications</span>
 <span v-if="notificationsStore.unreadCount > 0" class="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white border-2 border-white ">
 {{ notificationsStore.unreadCount }}
 </span>
 </router-link>
 
 <router-link 
 to="/seller/products" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-box mr-3 w-5 group-hover:scale-110 transition-transform"></i>
 <span>Mes Produits</span>
 </router-link>

 <router-link 
 to="/seller/promotions" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-bullhorn mr-3 w-5 group-hover:scale-110 transition-transform"></i>
 <span>Promotions</span>
 </router-link>

 <router-link 
 to="/seller/messages" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-comment-dots mr-3 w-5 group-hover:scale-110 transition-transform"></i>
 <span>Messages</span>
 </router-link>

 <router-link 
 to="/seller/my-qr" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-qrcode mr-3 w-5 group-hover:scale-110 transition-transform"></i>
 <span>Mon QR</span>
 </router-link>

 <router-link 
 to="/seller/deposits" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-download mr-3 w-5 group-hover:scale-110 transition-transform"></i>
 <span>Dépôts</span>
 </router-link>

 <router-link 
 to="/seller/orders" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-shopping-cart mr-3 w-5 group-hover:scale-110 transition-transform"></i>
 <span>Commandes</span>
 </router-link>

 <router-link 
 to="/seller/reports" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-chart-bar mr-3 w-5 group-hover:scale-110 transition-transform"></i>
 <span>Rapports</span>
 </router-link>

 <router-link 
 to="/seller/payments" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-wallet mr-3 w-5 group-hover:scale-110 transition-transform"></i>
 <span>Revenue</span>
 </router-link>

 <router-link 
 to="/seller/settings" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-cog mr-3 w-5 group-hover:scale-110 transition-transform"></i>
 <span>Paramètres</span>
 </router-link>

 <div class="mt-8 mb-4">
 <h4 class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Services Vendeur</h4>
 </div>

 <router-link 
 to="/seller/academy" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-graduation-cap mr-3 w-5 group-hover:scale-110 transition-transform text-blue-500 group-[.active]:text-white"></i>
 <span>Académie</span>
 </router-link>

 <router-link 
 to="/seller/help" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-question-circle mr-3 w-5 group-hover:scale-110 transition-transform text-purple-500 group-[.active]:text-white"></i>
 <span>Centre d'Aide</span>
 </router-link>

 <router-link 
 to="/seller/trust" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-shield-alt mr-3 w-5 group-hover:scale-110 transition-transform text-indigo-500 group-[.active]:text-white"></i>
 <span>Confiance</span>
 </router-link>

 <router-link 
 to="/seller/boost" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-rocket mr-3 w-5 group-hover:scale-110 transition-transform text-orange-500 group-[.active]:text-white"></i>
 <span>Booster</span>
 </router-link>

 <router-link 
 to="/seller/community" 
 class="flex items-center px-4 py-3 rounded-xl font-semibold transition-all group"
 active-class="bg-blue-600 text-white shadow-md shadow-blue-200 "
 >
 <i class="fas fa-users mr-3 w-5 group-hover:scale-110 transition-transform text-green-500 group-[.active]:text-white"></i>
 <span>Communauté</span>
 </router-link>

 <div class="border-t border-gray-100 my-6"></div>
 </nav>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import api from '@/services/api';

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const store = ref<any>({});

onMounted(async () => {
 // Load store data
 try {
 const res = await api.get('/vendors/me');
 store.value = res.data;
 } catch (e) {
 console.error("Failed to load store in sidebar", e);
 }

 // Load notifications
 notificationsStore.fetchNotifications(true);
});
</script>
