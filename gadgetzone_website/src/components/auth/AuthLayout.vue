<template>
<div class="min-h-screen bg-white relative overflow-hidden flex flex-col justify-center sm:py-12">
    <!-- Gradient Circle Background -->
    <div class="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-purple-100 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"></div>
    
    <!-- Mobile Back Button -->
    <div class="absolute top-6 left-6 z-20">
      <router-link to="/" class="text-gray-800 hover:text-purple-600 transition-colors">
        <i class="fas fa-chevron-left text-xl"></i>
      </router-link>
    </div>

    <!-- Main Content Container -->
    <div class="relative w-full max-w-md mx-auto px-6 pt-10 pb-8 bg-white sm:rounded-xl sm:shadow-lg">
      <div class="w-full">
        <!-- Title & Subtitle -->
        <div class="mb-10">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ title }}</h1>
          <div class="text-sm text-gray-500">
            <slot name="subtitle"></slot>
          </div>
        </div>

        <!-- Form Content -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
