<template>
<div :class="['space-y-2', containerClass]">
    <label
      v-if="label"
      :for="id"
      :class="[
        'block text-sm font-medium',
        disabled ? 'text-gray-400' : 'text-gray-700',
        labelClass,
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div class="relative">
      <i
        v-if="prefixIcon"
        :class="[prefixIcon, 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400']"
      ></i>

      <input
        :id="id"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="[
          'block w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          prefixIcon ? 'pl-10' : 'pl-3',
          suffixIcon ? 'pr-10' : 'pr-3',
          disabled
            ? 'bg-gray-50 border-gray-200 text-gray-400'
            : 'bg-white border-gray-300 text-gray-900',
          error ? 'border-red-300 focus:ring-red-500' : '',
          sizeClasses,
          className,
        ]"
        @input="handleInput"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />

      <i
        v-if="suffixIcon"
        :class="[suffixIcon, 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400']"
      ></i>
    </div>

    <div v-if="error || hint" class="flex items-center space-x-1">
      <i v-if="error" class="las la-exclamation-circle text-red-500 text-sm"></i>
      <span :class="['text-sm', error ? 'text-red-600' : 'text-gray-500']">
        {{ error || hint }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' | 'search'
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autocomplete?: string
  prefixIcon?: string
  suffixIcon?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  containerClass?: string
  labelClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [event: Event]
  change: [event: Event]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()

const inputRef = ref<HTMLInputElement>()

const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'py-1.5 text-sm',
    md: 'py-2 text-sm',
    lg: 'py-3 text-base',
  }
  return sizes[props.size]
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', event)
}

const handleChange = (event: Event) => {
  emit('change', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

// Expose methods
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select(),
})
</script>
