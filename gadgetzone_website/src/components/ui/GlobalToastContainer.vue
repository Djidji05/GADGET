<template>
<div class="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none items-center">
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
