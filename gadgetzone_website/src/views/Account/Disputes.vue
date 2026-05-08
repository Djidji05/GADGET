<template>
  <div class="container mx-auto px-4 pt-4 pb-12">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <router-link to="/account" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-arrow-left"></i>
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('account.my_disputes') }}</h1>
      </div>

      <div class="space-y-4">
        <div v-if="loading" class="text-center py-10">
          <i class="fas fa-spinner fa-spin text-blue-600 text-2xl"></i>
        </div>

        <div v-else-if="disputes.length === 0" class="bg-white rounded-2xl shadow-sm p-10 text-center border border-gray-100">
          <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-balance-scale text-2xl"></i>
          </div>
          <p class="text-gray-500">{{ $t('account.no_disputes') }}</p>
        </div>

        <div v-else v-for="dispute in disputes" :key="dispute.id" 
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition-colors cursor-pointer"
          @click="$router.push(`/account/disputes/${dispute.id}`)"
        >
          <div class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">{{ formatReason(dispute.reason) }}</h3>
                <p class="text-xs text-gray-500 mb-1">{{ $t('account.order_number') }}{{ dispute.order_id }} • {{ $t('account.created_on') }}{{ formatDate(dispute.created_at) }}</p>
                <p class="text-sm text-gray-600 line-clamp-1">{{ dispute.description }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
              <span 
                class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                :class="statusClass(dispute.status)"
              >
                {{ formatStatus(dispute.status) }}
              </span>
              <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { disputeService } from '@/services/api'
import { useI18n } from 'vue-i18n'

const disputes = ref<any[]>([])
const loading = ref(true)
const { t } = useI18n()

const formatReason = (reason: string) => {
  const reasons: any = {
    'not_received': t('account.reason_not_received'),
    'damaged': t('account.reason_damaged'),
    'wrong_item': t('account.reason_wrong_item'),
    'other': t('account.reason_other_problem')
  }
  return reasons[reason] || reason
}

const formatStatus = (status: string) => {
  const statuses: any = {
    'pending': t('account.status_pending'),
    'under_review': t('account.status_under_review'),
    'resolved': t('account.status_resolved'),
    'closed': t('account.status_closed')
  }
  return statuses[status] || status
}

const statusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700'
    case 'under_review': return 'bg-blue-100 text-blue-700'
    case 'resolved': return 'bg-green-100 text-green-700'
    case 'closed': return 'bg-gray-100 text-gray-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(async () => {
  try {
    disputes.value = await disputeService.getDisputes()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
