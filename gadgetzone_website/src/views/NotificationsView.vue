<template>
<div class="bg-gray-50 min-h-screen pt-4 pb-24 lg:py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ $t('nav.notifications') }}</h1>
      
      <div v-if="notificationsStore.isLoading && notificationsStore.notifications.length === 0" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="notificationsStore.notifications.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="las la-bell-slash text-4xl text-gray-300"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('account.no_notifications') }}</h2>
        <p class="text-gray-500 mb-8">{{ $t('account.no_notifications_desc') }}</p>
        <router-link to="/products" class="btn-primary inline-flex items-center">
          <i class="las la-shopping-bag mr-2"></i>
          {{ $t('account.continue_shopping') }}
        </router-link>
      </div>

      <div v-else class="max-w-4xl mx-auto space-y-4">
        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-500 text-sm">
            {{ notificationsStore.unreadCount > 1 ? $t('account.unread_count_plural', { count: notificationsStore.unreadCount }) : $t('account.unread_count', { count: notificationsStore.unreadCount }) }}
          </p>
          <button 
            v-if="notificationsStore.unreadCount > 0"
            @click="notificationsStore.markAllAsRead"
            class="text-blue-600 text-sm font-bold hover:underline"
          >
            {{ $t('account.mark_all_read') }}
          </button>
        </div>

        <div 
          v-for="notification in notificationsStore.notifications" 
          :key="notification.id"
          class="bg-white rounded-2xl shadow-sm border p-5 flex items-start gap-4 transition-all hover:shadow-md group relative"
          :class="notification.status === 'unread' ? 'border-blue-100 bg-blue-50/10' : 'border-gray-100'"
        >
          <!-- Status Indicator -->
          <div v-if="notification.status === 'unread'" class="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-10 bg-blue-600 rounded-full"></div>

          <!-- Icon Based on Type -->
          <div :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm',
            getIconBg(notification.type)
          ]">
            <i :class="[getIconClass(notification.type), 'text-xl']"></i>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0" @click="notification.status === 'unread' && notificationsStore.markAsRead(notification.id)">
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-bold text-gray-900 leading-tight">{{ notification.title }}</h3>
              <span class="text-[10px] text-gray-400 font-medium whitespace-nowrap">{{ formatDate(notification.createdAt) }}</span>
            </div>
            <p class="text-gray-600 text-sm mt-1 leading-relaxed">{{ notification.message }}</p>
            
            <!-- Actions for typical notification types -->
            <div v-if="notification.relatedType === 'order'" class="mt-3">
              <router-link 
                :to="`/orders/${notification.relatedId}`"
                class="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                {{ $t('account.view_order') }} <i class="las la-arrow-right ml-1"></i>
              </router-link>
            </div>
          </div>

          <!-- Options Menu -->
          <div class="flex flex-col gap-2">
            <button 
              @click.stop="notificationsStore.deleteNotification(notification.id)"
              class="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors shadow-sm border border-gray-100"
              :title="$t('common.delete')"
            >
              <i class="las la-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useI18n } from 'vue-i18n'
import { formatDistanceToNow } from 'date-fns'
import { fr, ht } from 'date-fns/locale'

const notificationsStore = useNotificationsStore()
const { t, locale } = useI18n()

const getIconClass = (type: string) => {
  const icons: Record<string, string> = {
    order: 'las la-box',
    success: 'las la-check-circle',
    warning: 'las la-exclamation-triangle',
    error: 'las la-exclamation-circle',
    info: 'las la-info-circle'
  }
  return icons[type] || icons.info
}

const getIconBg = (type: string) => {
  const bgs: Record<string, string> = {
    order: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-indigo-100 text-indigo-600'
  }
  return bgs[type] || bgs.info
}

const formatDate = (date: string) => {
  try {
    const dateLocale = locale.value === 'ht' ? ht : fr
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: dateLocale })
  } catch (e) {
    return date
  }
}

onMounted(() => {
  notificationsStore.fetchNotifications()
})
</script>
