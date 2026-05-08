<template>
  <div class="w-full md:pt-4 pb-12">
    <div class="flex flex-col md:flex-row gap-6 md:items-start">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content Area -->
      <div class="flex-1 min-h-screen bg-gray-50 rounded-3xl overflow-hidden shadow-sm md:shadow-md md:mx-0">
        <!-- Top Header -->
        <div class="bg-white sticky top-0 z-30 px-6 py-2 shadow-sm flex items-center justify-between">
            <div class="flex items-center gap-3">
                <button @click="router.back()" class="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                    <i class="fas fa-arrow-left text-gray-600"></i>
                </button>
                <h1 class="text-xl font-bold text-gray-900">Notifications</h1>
            </div>
            <button 
                v-if="notificationsStore.unreadCount > 0"
                @click="notificationsStore.markAllAsRead"
                class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
                Tout marquer comme lu
            </button>
        </div>

        <div class="p-4 md:p-6">
            <!-- Loading State -->
            <div v-if="notificationsStore.isLoading && notificationsStore.notifications.length === 0" class="flex flex-col items-center justify-center py-20">
                <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-500 font-medium">Chargement des notifications...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="notificationsStore.notifications.length === 0" class="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <i class="fas fa-bell-slash text-3xl text-gray-300"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-900 mb-2">Aucune notification</h2>
                <p class="text-gray-500 max-w-xs mx-auto">Vous n'avez pas encore reçu de notifications concernant votre boutique.</p>
            </div>

            <!-- Notifications List -->
            <div v-else class="space-y-3">
                <div 
                    v-for="notification in notificationsStore.notifications" 
                    :key="notification.id"
                    @click="handleNotificationClick(notification)"
                    class="bg-white p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer group flex gap-4"
                    :class="notification.status === 'unread' ? 'border-blue-100 bg-blue-50/20 shadow-sm shadow-blue-50' : 'border-gray-50'"
                >
                    <!-- Icon -->
                    <div :class="[
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        getIconBg(notification.type)
                    ]">
                        <i :class="[getIconClass(notification.type), 'text-lg']"></i>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2">
                            <h3 class="font-bold text-gray-900 line-clamp-1" :class="{'text-blue-900': notification.status === 'unread'}">
                                {{ notification.title }}
                            </h3>
                            <span class="text-[10px] text-gray-400 font-medium whitespace-nowrap pt-1">
                                {{ formatDate(notification.createdAt) }}
                            </span>
                        </div>
                        <p class="text-gray-600 text-sm mt-1 leading-relaxed line-clamp-2">{{ notification.message }}</p>
                        
                        <!-- Mini Badge for status -->
                        <div v-if="notification.status === 'unread'" class="mt-2 flex">
                            <span class="w-2 h-2 bg-blue-600 rounded-full"></span>
                        </div>
                    </div>

                    <!-- Actions Icons -->
                    <div class="flex flex-col gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            @click.stop="notificationsStore.deleteNotification(notification.id)"
                            class="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                        >
                            <i class="fas fa-trash text-xs"></i>
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
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationsStore } from '@/stores/notifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';

const router = useRouter();
const notificationsStore = useNotificationsStore();

const getIconClass = (type: string) => {
  const icons: Record<string, string> = {
    order: 'fas fa-box',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-exclamation-circle',
    info: 'fas fa-info-circle'
  };
  return icons[type] || icons.info;
};

const getIconBg = (type: string) => {
  const bgs: Record<string, string> = {
    order: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-indigo-100 text-indigo-600'
  };
  return bgs[type] || bgs.info;
};

const formatDate = (date: string) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  } catch (e) {
    return date;
  }
};

const handleNotificationClick = async (notification: any) => {
    if (notification.status === 'unread') {
        await notificationsStore.markAsRead(notification.id);
    }
    
    // Auto-navigate based on relatedId
    if (notification.relatedType === 'order' && notification.relatedId) {
        router.push(`/seller/orders/${notification.relatedId}`);
    }
};

onMounted(() => {
  notificationsStore.fetchNotifications();
});
</script>
