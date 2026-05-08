<template>
<teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[100] overflow-y-auto" @click="handleBackdropClick">
        <div class="flex min-h-screen items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

          <!-- Modal -->
          <transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="isOpen"
              class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
              :class="[sizeClasses, className]"
              @click.stop
            >
              <!-- Header -->
              <div v-if="title || showCloseButton" class="border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                  <h3 v-if="title" class="text-lg font-medium text-gray-900">
                    {{ title }}
                  </h3>
                  <button
                    v-if="showCloseButton"
                    @click="close"
                    class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <i class="las la-times text-xl"></i>
                  </button>
                </div>
              </div>

              <!-- Body -->
              <div class="px-6 py-4">
                <slot>
                  <div v-if="content" class="text-gray-600" v-html="content"></div>
                </slot>
              </div>

              <!-- Footer -->
              <div v-if="$slots.footer" class="border-t border-gray-200 px-6 py-4">
                <slot name="footer"></slot>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  isOpen: boolean
  title?: string
  content?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showCloseButton: true,
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  close: []
  open: []
}>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-full max-w-md',
    md: 'w-full max-w-lg',
    lg: 'w-full max-w-2xl',
    xl: 'w-full max-w-4xl',
    full: 'w-full max-w-7xl',
  }
  return sizes[props.size]
})

const close = () => {
  emit('update:isOpen', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

// Handle escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    close()
  }
}

// Watch for open/close
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      emit('open')
      // Add escape key listener
      document.addEventListener('keydown', handleEscapeKey)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Remove escape key listener
      document.removeEventListener('keydown', handleEscapeKey)
      // Restore body scroll
      document.body.style.overflow = ''
    }
  },
)

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})
</script>
