<template>
  <transition
    enter-active-class="transition ease-out duration-300 transform"
    enter-from-class="opacity-0 -translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition ease-in duration-200 transform"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-4 scale-95"
  >
    <div
      v-if="isVisible"
      :class="[
        'w-full max-w-md px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-3 pointer-events-auto transition-all',
        typeClasses[type] || typeClasses.info
      ]"
    >
      <i :class="['text-lg flex-shrink-0', typeIcon[type] || typeIcon.info]"></i>
      <div class="flex-grow min-w-0 text-left">
        <h4 v-if="title" class="text-xs font-bold leading-tight mb-0.5 text-white">{{ title }}</h4>
        <p class="text-xs font-medium leading-snug break-words">
          {{ message }}
        </p>
      </div>
      <button v-if="showCloseButton" @click="close" class="text-xs opacity-70 hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/10 flex-shrink-0">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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
  duration: 3500,
  autoClose: true,
  showCloseButton: true,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isVisible = ref(true)
const progress = ref(100)
let timer: ReturnType<typeof setTimeout> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null

const typeClasses: Record<string, string> = {
  success: 'bg-slate-900/95 dark:bg-slate-900/95 text-white border-emerald-500/50 shadow-emerald-950/30',
  error: 'bg-slate-900/95 dark:bg-slate-900/95 text-white border-rose-500/50 shadow-rose-950/30',
  warning: 'bg-slate-900/95 dark:bg-slate-900/95 text-white border-amber-500/50 shadow-amber-950/30',
  info: 'bg-slate-900/95 dark:bg-slate-900/95 text-white border-blue-500/50 shadow-blue-950/30'
}

const typeIcon: Record<string, string> = {
  success: 'fas fa-check-circle text-emerald-400',
  error: 'fas fa-exclamation-circle text-rose-400',
  warning: 'fas fa-exclamation-triangle text-amber-400',
  info: 'fas fa-info-circle text-blue-400'
}

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
