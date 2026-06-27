<template>
  <div class="container mx-auto px-4 lg: lg: pt-4 pb-12">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('account.history_title') }}</h1>
      <button 
        v-if="historyStore.browsingHistory.length > 0"
        @click="clearHistory"
        class="text-red-500 text-sm font-medium hover:underline flex items-center gap-1"
      >
        <i class="fas fa-trash-alt"></i> {{ $t('account.clear_history') }}
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="historyStore.browsingHistory.length === 0" class="text-center py-24">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
        <i class="fas fa-history text-4xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('account.no_history') }}</h3>
      <p class="text-gray-500 mb-6">{{ $t('account.continue_shopping') }}</p>
      <router-link to="/products" class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        {{ $t('common.discover') }}
      </router-link>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <div 
        v-for="product in historyStore.browsingHistory" 
        :key="product.id"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
      >
        <router-link :to="`/products/${product.slug || product.id}`" class="block">
          <div class="aspect-square bg-gray-50 relative overflow-hidden">
            <img 
              :src="normalizeImageUrl(product.image_url || product.image)" 
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div class="p-3">
            <h3 class="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px] mb-1 group-hover:text-blue-600 transition-colors">
              {{ product.name }}
            </h3>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-blue-600 font-bold text-sm">{{ formatPrice(product.price) }}</span>
              <span class="text-[10px] text-gray-400">{{ $t('history_viewed_on') }}{{ formatDate(product.lastViewed) }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHistoryStore } from '@/stores/history'
import { normalizeImageUrl } from '@/utils/urlHelper'
import { useUiStore } from '@/stores/ui'
import { useI18n } from 'vue-i18n'

const historyStore = useHistoryStore()
const uiStore = useUiStore()
const { t } = useI18n()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price).replace('HTG', 'G')
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-HT', {
    day: 'numeric',
    month: 'short'
  })
}

const clearHistory = () => {
  uiStore.confirm({
    title: t('account.clear_history'),
    message: t('account.clear_history') + ' ?',
    type: 'danger',
    onConfirm: () => {
      historyStore.clearHistory()
      uiStore.showToast(t('account.history_cleared'), 'info')
    }
  })
}
</script>
