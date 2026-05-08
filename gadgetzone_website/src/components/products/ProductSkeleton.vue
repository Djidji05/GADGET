<template>
  <div class="bg-white rounded-2xl p-2 md:p-3 shadow-sm border border-gray-100 h-full flex flex-col animate-pulse">
    <!-- Image Skeleton -->
    <div class="w-full aspect-square bg-gray-200 rounded-xl mb-2 md:mb-3"></div>

    <!-- Content Skeleton -->
    <div class="flex-1 space-y-3">
      <!-- Title -->
      <div class="space-y-1">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <!-- Vendor -->
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded-full bg-gray-200"></div>
        <div class="h-3 bg-gray-100 rounded w-1/3"></div>
      </div>

      <!-- Price and Actions -->
      <div class="mt-auto flex items-end justify-between pt-2">
        <div class="h-6 bg-gray-200 rounded w-1/4"></div>
        <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed for skeleton
</script>
