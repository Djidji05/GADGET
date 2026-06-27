<template>
  <header class="h-16 bg-white dark:bg-gray-900 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300">
    <!-- Left: Dynamic Title / Breadcrumb -->
    <div class="flex items-center space-x-3">
      <h2 class="text-lg font-bold text-slate-800 dark:text-gray-100 tracking-tight">{{ pageTitle }}</h2>
      <span v-if="store.status" :class="statusClass" class="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border">
        {{ statusLabel }}
      </span>
    </div>

    <!-- Right: Search, Actions, Notifications & Profile -->
    <div class="flex items-center space-x-6">
      <!-- Search Bar (Active for search-supporting pages) -->
      <div v-if="isSearchEnabled" class="relative hidden lg:block w-64 animate-in fade-in duration-200">
        <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
        <input 
          v-model="uiStore.globalSearchQuery"
          type="text" 
          placeholder="Recherche rapide..." 
          class="w-full bg-slate-50 dark:bg-gray-800 text-xs rounded-xl py-2 pl-9 pr-4 border border-transparent focus:border-slate-200 dark:focus:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500 text-slate-700 dark:text-gray-100"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-2">
        <!-- Messages -->
        <router-link 
          to="/seller/messages" 
          class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 flex items-center justify-center text-slate-600 dark:text-slate-350 transition-colors relative"
          title="Messages"
        >
          <i class="far fa-comment-dots text-sm"></i>
          <span v-if="stats.unreadMessagesCount > 0" class="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
            {{ stats.unreadMessagesCount }}
          </span>
        </router-link>

        <!-- Notifications -->
        <router-link 
          to="/seller/notifications" 
          class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 flex items-center justify-center text-slate-600 dark:text-slate-350 transition-colors relative"
          :class="{ 'ring-2 ring-red-500 bg-red-50 dark:bg-red-950/20': hasNewEvent }"
          title="Notifications"
          @click="hasNewEvent = false"
        >
          <i class="far fa-bell text-sm" :class="{ 'text-red-500 animate-bounce': hasNewEvent }"></i>
          <span v-if="notificationsStore.unreadCount > 0 || hasNewEvent" class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900" :class="{ 'animate-pulse': hasNewEvent }">
            {{ notificationsStore.unreadCount || 1 }}
          </span>
        </router-link>
      </div>

      <!-- Divider -->
      <div class="w-px h-6 bg-slate-100 dark:bg-gray-800"></div>

      <!-- Profile Summary -->
      <div class="flex items-center space-x-3 cursor-pointer" @click="router.push('/seller/settings')">
        <div class="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-sm animate-pulse-subtle">
          {{ userInitials }}
        </div>
        <div class="hidden xl:block text-left">
          <p class="text-xs font-semibold text-slate-800 dark:text-gray-250 leading-none truncate max-w-[120px]">{{ store.name || userName }}</p>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none">Boutique</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import { useSSEStore } from '@/stores/sse';
import { useUiStore } from '@/stores/ui';
import api from '@/services/api';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();
const notificationsStore = useNotificationsStore();
const sseStore = useSSEStore();

const isSearchEnabled = computed(() => {
  return ['/seller/orders', '/seller/products'].some(path => route.path.includes(path));
});

// Clear search query on route changes
watch(() => route.path, () => {
  uiStore.globalSearchQuery = '';
});

const store = ref<any>({});
const stats = ref<any>({ unreadMessagesCount: 0 });
const hasNewEvent = ref(false);
let unsubscribeSSE: (() => void) | null = null;

const pageTitle = computed(() => {
  const title = (route.meta?.title as string) || '';
  return title.replace(' - HTFasil', '').replace(' Vendeur', '');
});

const userInitials = computed(() => {
  const name = authStore.customer?.firstName || store.value.name || '';
  return name.slice(0, 2).toUpperCase();
});

const userName = computed(() => authStore.customer?.firstName || 'Vendeur');

const statusLabel = computed(() => {
  const status = store.value?.status;
  if (status === 'active') return 'Actif';
  if (status === 'pending') return 'En attente';
  return status || 'Statut';
});

const statusClass = computed(() => {
  const status = store.value?.status;
  if (status === 'active') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  if (status === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100';
  return 'bg-slate-50 text-slate-500 border-slate-100';
});

onMounted(async () => {
  try {
    const [storeRes, statsRes] = await Promise.all([
      api.get('/vendors/me'),
      api.get('/vendors/me/stats').catch(() => ({ data: { unreadMessagesCount: 0 } }))
    ]);
    store.value = storeRes.data;
    stats.value = statsRes.data;
  } catch (e) {
    console.error('Failed to load navbar data', e);
  }

  // Fetch notifications count
  notificationsStore.fetchNotifications(true);

  // Écouter les événements SSE de commande pour notifier en temps réel
  unsubscribeSSE = sseStore.onEvent('new_order', () => {
    hasNewEvent.value = true;
    notificationsStore.fetchNotifications(true);
  });
});

onUnmounted(() => {
  if (unsubscribeSSE) {
    unsubscribeSSE();
  }
});
</script>
