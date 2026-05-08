<template>
<div
    :class="[
      'inline-flex items-center justify-center',
      size === 'sm' && 'w-4 h-4',
      size === 'md' && 'w-6 h-6',
      size === 'lg' && 'w-8 h-8',
      size === 'xl' && 'w-12 h-12',
      className,
    ]"
  >
    <i
      :class="[
        'las la-spinner animate-spin',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg',
        size === 'xl' && 'text-2xl',
        colorClass,
      ]"
    ></i>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
})

const colorClass = computed(() => {
  const colors = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-400',
  }
  return colors[props.color]
})
</script>
