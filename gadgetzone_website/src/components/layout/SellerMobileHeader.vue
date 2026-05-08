<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
</script>

<template>
<div>
 <header class="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/50 px-4 py-3 h-16 flex items-center justify-between transition-all duration-300">
 <!-- Store Name (Left) -->
 <div class="flex-1 min-w-0 pr-4">
 <h1 class="text-xl font-bold text-gray-900 truncate tracking-tight font-display">
 {{ authStore.customer?.firstName }}'s Store
 </h1>
 <div class="flex items-center gap-1.5 mt-0.5">
 <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 leading-none">
 <i class="fas fa-check-circle mr-1 text-[9px]"></i> {{ $t('store.verified_seller') }}
 </span>
 </div>
 </div>

 <!-- Actions (Right) -->
 <div class="flex items-center gap-3">
 <!-- Return to Site Button -->
 <router-link to="/" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 :bg-gray-700 transition-all hover:scale-105 active:scale-95 shadow-sm ring-1 ring-gray-100 ">
 <i class="fas fa-arrow-left text-sm"></i>
 </router-link>

 <!-- Profile Icon / Avatar -->
 <router-link to="/seller/settings" class="relative group">
 <div class="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
 <img 
 v-if="authStore.customer?.avatar_url" 
 :src="authStore.customer.avatar_url" 
 class="w-full h-full object-cover" 
 />
 <div v-else class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
 {{ authStore.customer?.firstName?.charAt(0) || 'U' }}
 </div>
 </div>
 <!-- Online Indicator Dot -->
 <span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
 </router-link>
 </div>
 </header>
 
 <!-- Spacer to prevent content from going under the fixed header -->
 <div class="md:hidden h-16"></div>
 </div>
</template>

<style scoped>
/* Ensure the blur works beautifully */
header {
 @supports (backdrop-filter: blur(12px)) {
 background-color: rgba(255, 255, 255, 0.85);
 backdrop-filter: blur(12px);
 }
}
</style>
