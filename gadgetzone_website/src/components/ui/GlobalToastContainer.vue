<template>
  <div class="fixed top-16 md:top-20 left-1/2 -translate-x-1/2 z-[99999] flex flex-col gap-2.5 max-w-md w-[92%] sm:w-full pointer-events-none items-center px-2">
    <Toast
      v-for="toast in uiStore.toasts"
      :key="toast.id"
      :message="toast.message"
      :title="toast.title"
      :type="toast.type"
      :duration="toast.duration"
      class="pointer-events-auto"
      @close="uiStore.removeToast(toast.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui'
import Toast from './Toast.vue'

const uiStore = useUiStore()
</script>
