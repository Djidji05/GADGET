<template>
  <!-- If called inline inside the views without isLayout, render nothing on desktop -->
  <div v-if="!props.isLayout" class="hidden"></div>

  <!-- If isLayout is true, render the premium left fixed sidebar -->
  <aside v-else class="hidden md:flex w-64 fixed inset-y-0 left-0 bg-white dark:bg-gray-900 border-r border-slate-100 dark:border-gray-800 flex-col z-30 justify-between h-screen transition-colors duration-300">
    <!-- Top Section: Logo & Brand -->
    <div class="flex flex-col flex-1 min-h-0">
      <div class="h-16 flex items-center px-6 border-b border-slate-50 dark:border-gray-800">
        <router-link to="/seller/dashboard" class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm shadow-blue-200">
            HT
          </div>
          <span class="text-base font-black text-slate-800 dark:text-gray-100 tracking-tight">
            HTFasil <span class="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/55 px-1.5 py-0.5 rounded-md ml-1">Vendeur</span>
          </span>
        </router-link>
      </div>

      <!-- Navigation Links Groups -->
      <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin">
        <!-- Group 1: Activité -->
        <div>
          <h4 class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Activité</h4>
          <div class="space-y-1">
            <router-link to="/seller/dashboard" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-50/50 hover:text-blue-600">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>Tableau de bord</span>
            </router-link>

            <router-link to="/seller/orders" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-50/50 hover:text-blue-600">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-75 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span>Commandes</span>
            </router-link>

            <router-link to="/seller/products" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-50/50 hover:text-blue-600">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <span>Mes Produits</span>
            </router-link>
          </div>
        </div>

        <!-- Group 2: Finance & Marketing -->
        <div>
          <h4 class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Finance & Marketing</h4>
          <div class="space-y-1">
            <router-link to="/seller/deposits" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-50/50 hover:text-blue-600">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Dépôts</span>
            </router-link>

            <router-link to="/seller/payments" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-50/50 hover:text-blue-600">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5c.621 0 1.125.504 1.125 1.125v12.75c0 .621-.504 1.125-1.125 1.125H3.75A1.125 1.125 0 012.625 17.25V5.625c0-.621.504-1.125 1.125-1.125z" />
              </svg>
              <span>Revenu</span>
            </router-link>

            <router-link to="/seller/transactions" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-50/50 hover:text-blue-600">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span>Historique</span>
            </router-link>

            <router-link to="/seller/promotions" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-600 text-white shadow-sm hover:bg-blue-600 hover:text-white">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.357.205a.75.75 0 01-1.006-.322l-2.686-4.97c-.027-.051-.04-.108-.04-.165V15.24c0-.224.086-.439.24-.6l2.58-2.69a.75.75 0 011.006-.322l.357.205c.522.3.71.96.463 1.51-.401.892-.732 1.82-1.006 2.783zm9.66 0c.253-.962.584-1.892.985-2.783.247-.55.06-1.21-.463-1.511l-.357-.205a.75.75 0 00-1.006.322l-2.686 4.97a.75.75 0 00.04.165v.003c0 .224-.086.439-.24.6l-2.58 2.69a.75.75 0 00-1.006.322l-.357-.205c-.522-.3-.71-.96-.463-1.51.401-.892.732-1.82 1.006-2.783z" />
              </svg>
              <span>Promotions</span>
            </router-link>
          </div>
        </div>

        <!-- Group 3: Outils & Aide -->
        <div>
          <h4 class="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Outils & Aide</h4>
          <div class="space-y-1">
            <router-link to="/seller/academy" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-50/50 hover:text-blue-600">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span>Académie</span>
            </router-link>

            <router-link to="/seller/help" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-50/50 hover:text-blue-600">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              <span>Centre d'aide</span>
            </router-link>

            <router-link to="/seller/my-qr" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-50/50 hover:text-blue-600">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 14.625c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5zM17.625 13.5h1.5a1.125 1.125 0 011.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-4.5a1.125 1.125 0 011.125-1.125z" />
              </svg>
              <span>Mon QR Code</span>
            </router-link>

            <router-link to="/seller/shipping" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-50/50 hover:text-blue-600">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1M18 16h1a1 1 0 001-1v-5a1 1 0 00-1-1h-2V7a1 1 0 00-1-1h-3v10m-3-7h3m-3 3h3" />
              </svg>
              <span>Zones de livraison</span>
            </router-link>

            <router-link to="/seller/settings" class="flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-gray-100 transition-colors group" active-class="bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 hover:bg-blue-50/50 hover:text-blue-600">
              <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600 group-[.active-class]:text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774a1.125 1.125 0 01.12 1.45l-.527.737c-.25.35-.273.807-.11 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738a1.125 1.125 0 01-.12 1.45l-.774.773a1.125 1.125 0 01-1.45.12l-.737-.527c-.35-.25-.807-.272-1.204-.11-.397.166-.71.506-.78.93l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.149-.894c-.07-.424-.383-.764-.78-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.163-.397-.502-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.11.398-.166.71-.506.78-.93l.15-.894z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Paramètres</span>
            </router-link>
          </div>
        </div>
      </nav>
    </div>

    <!-- Bottom Section: Back to Site, Profile & Logout -->
    <div class="p-4 border-t border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/50 space-y-4">
      <router-link to="/" class="flex items-center justify-center space-x-2 w-full py-2 bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-xl border border-slate-200 dark:border-gray-700 transition-colors text-xs font-bold shadow-sm">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>Retour au site</span>
      </router-link>

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            {{ userInitials }}
          </div>
          <div class="text-left">
            <p class="text-xs font-bold text-slate-700 dark:text-gray-300 truncate w-28 leading-none mb-1">{{ userName }}</p>
            <span class="text-[9px] text-slate-400 dark:text-slate-500 font-medium leading-none">Boutique Pro</span>
          </div>
        </div>
        <button @click="logout" class="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center transition-colors" title="Se déconnecter">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import api from '@/services/api';

const props = withDefaults(defineProps<{
  isLayout?: boolean
}>(), {
  isLayout: false
});

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const router = useRouter();
const store = ref<any>({});

const userInitials = computed(() => {
  const name = authStore.customer?.firstName || store.value.name || '';
  return name.slice(0, 2).toUpperCase();
});

const userName = computed(() => authStore.customer?.firstName || 'Vendeur');

const logout = async () => {
  await authStore.logout();
  router.push('/login');
};

onMounted(async () => {
  // Only load store data if it's rendered as layout to optimize performance
  if (props.isLayout) {
    try {
      const res = await api.get('/vendors/me');
      store.value = res.data;
    } catch (e) {
      console.error("Failed to load store in sidebar", e);
    }
    // Fetch notifications
    notificationsStore.fetchNotifications(true);
  }
});
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
