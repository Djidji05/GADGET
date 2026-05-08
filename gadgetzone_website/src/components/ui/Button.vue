<template>
<button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center px-4 py-2 border font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      sizeClasses,
      variantClasses,
      disabledClasses,
      className,
    ]"
    @click="$emit('click', $event)"
  >
    <LoadingSpinner
      v-if="loading"
      :size="size === 'xs' ? 'sm' : size === 'sm' ? 'md' : size === 'lg' ? 'lg' : 'xl'"
      :color="variant === 'primary' ? 'white' : 'primary'"
      class="mr-2"
    />

    <i v-if="icon && !loading" :class="[icon, iconPosition === 'left' ? 'mr-2' : 'ml-2']"></i>

    <span v-if="$slots.default">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  iconPosition: 'left',
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    primary:
      'border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'border-transparent text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'border-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  }
  return variants[props.variant]
})

const disabledClasses = computed(() => {
  return props.disabled || props.loading ? 'opacity-50 cursor-not-allowed' : ''
})
</script>
