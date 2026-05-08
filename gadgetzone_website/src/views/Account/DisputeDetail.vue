<template>
  <div class="container mx-auto px-4 pt-4 pb-12">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <router-link to="/account/disputes" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-arrow-left"></i>
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('account.dispute_number') }}{{ disputeId }}</h1>
      </div>

      <div v-if="loading" class="text-center py-10">
        <i class="fas fa-spinner fa-spin text-blue-600 text-2xl"></i>
      </div>

      <div v-else-if="dispute" class="space-y-6">
        <!-- Dispute Info -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-50">
            <div>
              <p class="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{{ $t('account.dispute_reason') }}</p>
              <h2 class="text-xl font-bold text-gray-900">{{ formatReason(dispute.reason) }}</h2>
            </div>
            <span 
              class="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider self-start md:self-center"
              :class="statusClass(dispute.status)"
            >
              {{ formatStatus(dispute.status) }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{{ $t('account.order_summary') }}</p>
              <p class="text-sm font-medium text-gray-700">{{ $t('account.order_number') }}{{ dispute.order_id }}</p>
              <p class="text-sm text-gray-500">{{ $t('account.total_amount') }} {{ formatPrice(dispute.Order?.total_amount) }}</p>
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{{ $t('account.initial_description') }}</p>
              <p class="text-sm text-gray-600 leading-relaxed">{{ dispute.description }}</p>
            </div>
          </div>
        </div>

        <!-- Chat messages -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
          <div class="p-4 border-b border-gray-50 bg-gray-50/50">
             <h3 class="font-bold text-gray-900">{{ $t('account.discussion_support') }}</h3>
          </div>
          
          <div class="flex-grow overflow-y-auto p-6 space-y-4" ref="messageContainer">
            <div v-for="msg in dispute.messages" :key="msg.id" 
              class="flex flex-col max-w-[80%]"
              :class="msg.sender_id === authStore.customer?.id ? 'ml-auto items-end' : 'mr-auto items-start'"
            >
              <div 
                class="p-4 rounded-2xl text-sm"
                :class="msg.sender_id === authStore.customer?.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-700 rounded-bl-none'"
              >
                {{ msg.message }}
              </div>
              <span class="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                {{ msg.sender_id === authStore.customer?.id ? $t('account.me') : msg.sender?.name }} • {{ formatTime(msg.created_at) }}
              </span>
            </div>
          </div>

          <div class="p-4 border-t border-gray-50">
            <div class="flex gap-2">
              <input 
                v-model="newMessage" 
                @keyup.enter="sendMsg"
                :placeholder="$t('account.your_message')"
                class="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button 
                @click="sendMsg"
                :disabled="!newMessage.trim() || sending"
                class="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <i v-if="sending" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-paper-plane px-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { disputeService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()
const disputeId = route.params.id
const dispute = ref<any>(null)
const loading = ref(true)
const newMessage = ref('')
const sending = ref(false)
const messageContainer = ref<any>(null)

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

const formatPrice = (price: number) => {
  if (!price) return '0 XOF'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price)
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = () => {
    nextTick(() => {
        if (messageContainer.value) {
            messageContainer.value.scrollTop = messageContainer.value.scrollHeight
        }
    })
}

const fetchDetails = async () => {
    try {
        dispute.value = await disputeService.getDispute(Number(disputeId))
        scrollToBottom()
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const sendMsg = async () => {
    if (!newMessage.value.trim() || sending.value) return
    sending.value = true
    try {
        await disputeService.addMessage(Number(disputeId), newMessage.value)
        newMessage.value = ''
        await fetchDetails()
    } catch (e) {
        console.error(e)
    } finally {
        sending.value = false
    }
}

onMounted(() => {
    fetchDetails()
})
</script>
