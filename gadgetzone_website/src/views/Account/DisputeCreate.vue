<template>
  <div class="container mx-auto px-4 pt-4 pb-12">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button @click="$router.back()" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('account.create_dispute') }}</h1>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div class="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
          <i class="fas fa-info-circle text-blue-600 mt-1"></i>
          <p class="text-sm text-blue-800">
            {{ $t('account.dispute_open_for') }} <strong>#{{ orderId }}</strong>. 
            {{ $t('account.dispute_review_time') }}
          </p>
        </div>

        <form @submit.prevent="submitDispute" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">{{ $t('account.dispute_reason') }}</label>
            <select 
              v-model="form.reason" 
              required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="" disabled>{{ $t('account.dispute_select_reason') }}</option>
              <option value="not_received">{{ $t('account.reason_not_received') }}</option>
              <option value="damaged">{{ $t('account.reason_damaged') }}</option>
              <option value="wrong_item">{{ $t('account.reason_wrong_item') }}</option>
              <option value="other">{{ $t('account.reason_other_problem') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">{{ $t('account.detailed_description') }}</label>
            <textarea 
              v-model="form.description" 
              required
              rows="5"
              :placeholder="$t('account.explain_problem_placeholder')"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            ></textarea>
          </div>

          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
            {{ $t('account.submit_dispute') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { disputeService } from '@/services/api'
import { useUiStore } from '@/stores/ui'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()
const { t } = useI18n()
const orderId = route.query.orderId

const form = ref({
  order_id: orderId,
  reason: '',
  description: ''
})

const isSubmitting = ref(false)

const submitDispute = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    const res = await disputeService.createDispute(form.value)
    uiStore.showToast(t('account.dispute_opened_success'), 'success')
    router.push(`/account/disputes/${res.id}`)
  } catch (e) {
    console.error(e)
    uiStore.showToast(t('account.dispute_open_error'), 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
