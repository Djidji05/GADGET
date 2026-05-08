<template>
<Transition name="fade">
    <div v-if="uiStore.modal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">{{ uiStore.modal.title }}</h3>
          <button @click="handleCancel" class="text-gray-400 hover:text-gray-600 transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-6">
          <div class="flex items-start">
            <div v-if="uiStore.modal.type" class="flex-shrink-0 mr-4">
              <i :class="[iconClass, iconColorClass, 'text-2xl']"></i>
            </div>
            <p class="text-gray-600">{{ uiStore.modal.message }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row-reverse gap-2">
          <button 
            @click="handleConfirm"
            class="px-6 py-2 rounded-lg font-bold transition-all active:scale-95"
            :class="confirmButtonClass"
          >
            {{ uiStore.modal.confirmText || 'Confirmer' }}
          </button>
          <button 
            @click="handleCancel"
            class="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition-all active:scale-95"
          >
            {{ uiStore.modal.cancelText || 'Annuler' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const handleConfirm = () => {
  if (uiStore.modal?.onConfirm) {
    uiStore.modal.onConfirm()
  }
  uiStore.closeConfirm()
}

const handleCancel = () => {
  if (uiStore.modal?.onCancel) {
    uiStore.modal.onCancel()
  }
  uiStore.closeConfirm()
}

const iconClass = computed(() => {
  switch (uiStore.modal?.type) {
    case 'danger': return 'fas fa-exclamation-triangle'
    case 'warning': return 'fas fa-exclamation-circle'
    default: return 'fas fa-info-circle'
  }
})

const iconColorClass = computed(() => {
  switch (uiStore.modal?.type) {
    case 'danger': return 'text-red-500'
    case 'warning': return 'text-yellow-500'
    default: return 'text-blue-500'
  }
})

const confirmButtonClass = computed(() => {
  switch (uiStore.modal?.type) {
    case 'danger': return 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200'
    case 'warning': return 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg shadow-yellow-100'
    default: return 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
