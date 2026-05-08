<template>
<div class="min-h-screen bg-gray-100 flex">
 <!-- Sidebar -->
 <aside class="w-64 bg-white shadow-lg fixed h-full z-10 hidden md:flex flex-col">
 <div class="p-4 border-b ">
 <router-link to="/" class="flex items-center space-x-2">
 <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
 HTFasil <span class="text-xs text-gray-500">Seller</span>
 </span>
 </router-link>
 </div>

 <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
 <router-link to="/seller/dashboard" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 :bg-gray-700 rounded-lg transition-colors" active-class="bg-blue-50 text-blue-600 ">
 <i class="fas fa-home w-5"></i>
 <span class="ml-3">Tableau de bord</span>
 </router-link>

 <router-link to="/seller/products" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 :bg-gray-700 rounded-lg transition-colors" active-class="bg-blue-50 text-blue-600 ">
 <i class="fas fa-box w-5"></i>
 <span class="ml-3">Mes Produits</span>
 </router-link>

 <router-link to="/seller/orders" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 :bg-gray-700 rounded-lg transition-colors" active-class="bg-blue-50 text-blue-600 ">
 <i class="fas fa-shopping-cart w-5"></i>
 <span class="ml-3">Commandes</span>
 </router-link>

 <div class="pt-4 mt-4 border-t ">
 <router-link to="/" class="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 :bg-gray-700 rounded-lg transition-colors">
 <i class="fas fa-arrow-left w-5"></i>
 <span class="ml-3">Retour au site</span>
 </router-link>
 </div>
 </nav>

 <div class="p-4 border-t ">
 <div class="flex items-center">
 <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
 {{ userInitials }}
 </div>
 <div class="ml-3">
 <p class="text-sm font-medium text-gray-700 truncate w-32">{{ userName }}</p>
 <button @click="logout" class="text-xs text-red-500 hover:text-red-700">Déconnexion</button>
 </div>
 </div>
 </div>
 </aside>

 <!-- Main Content -->
 <div class="flex-1 md:ml-64 flex flex-col min-h-screen">
 <!-- Header Mobile -->
 <header class="md:hidden bg-white shadow p-4 flex justify-between items-center sticky top-0 z-20">
 <span class="font-bold">Seller Dashboard</span>
 <button @click="toggleSidebar" class="p-2">
 <i class="fas fa-bars"></i>
 </button>
 </header>

 <!-- Page Content -->
 <main class="flex-1 p-6">
 <router-view></router-view>
 </main>
 </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useUiStore } from '@/stores/ui';

const authStore = useAuthStore();
const router = useRouter();
const uiStore = useUiStore();

const userInitials = computed(() => {
 const name = authStore.customer?.firstName || '';
 return name.slice(0, 2).toUpperCase();
});

const userName = computed(() => authStore.customer?.firstName || 'Vendeur');

const logout = async () => {
 await authStore.logout();
 router.push('/login');
};

const toggleSidebar = () => {
 // TODO: Implement mobile sidebar toggle logic using a ref or state
 uiStore.showToast("Menu mobile à venir", "info");
};
</script>
