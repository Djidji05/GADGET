<template>
<transition
    enter-active-class="transition ease-out duration-300 transform"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      class="bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg border border-white/10 pointer-events-auto"
    >
      <p class="text-[13px] font-medium whitespace-nowrap">
        {{ message }}
      </p>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  message: string
  title?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  autoClose?: boolean
  showCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 2000,
  autoClose: true,
  showCloseButton: true,
})

const emit = defineEmits<{
  close: []
}>()

const isVisible = ref(false)
const progress = ref(100)
let timer: number | null = null
let progressTimer: number | null = null

// No variant classes needed for minimal style

const close = () => {
  isVisible.value = false
  clearTimers()
  emit('close')
}

const clearTimers = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

const startAutoClose = () => {
  if (!props.autoClose || props.duration <= 0) return

  const interval = 50 // Update progress every 50ms
  const totalSteps = props.duration / interval

  let currentStep = 0
  progressTimer = setInterval(() => {
    currentStep++
    progress.value = Math.max(0, 100 - (currentStep / totalSteps) * 100)

    if (currentStep >= totalSteps) {
      clearTimers()
      close()
    }
  }, interval)

  timer = setTimeout(() => {
    clearTimers()
    close()
  }, props.duration)
}

onMounted(() => {
  isVisible.value = true
  startAutoClose()
})

onUnmounted(() => {
  clearTimers()
})
</script>
