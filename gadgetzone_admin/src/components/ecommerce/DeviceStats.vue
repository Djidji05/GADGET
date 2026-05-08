<template>
  <div class="sm:rounded-2xl sm:border border-transparent sm:border-gray-200 sm:bg-white p-5 sm:dark:border-gray-800 bg-transparent dark:bg-transparent sm:dark:bg-white/[0.03] sm:p-6">
    <div class="flex justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Appareils Utilisés
        </h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Répartition par mode (Mobile vs PC)
        </p>
      </div>
    </div>
    
    <div class="mt-6 flex flex-col gap-5">
      <!-- Mobile -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-gray-800 text-theme-sm dark:text-white/90">Mobile</p>
            <span class="block text-gray-500 text-theme-xs dark:text-gray-400">Smartphones & Tablettes</span>
          </div>
        </div>
        <div class="flex w-full max-w-[140px] items-center gap-3">
          <div class="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
            <div class="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-indigo-500" style="width: 68%;"></div>
          </div>
          <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">68%</p>
        </div>
      </div>

      <!-- PC -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-gray-800 text-theme-sm dark:text-white/90">PC (Bureau)</p>
            <span class="block text-gray-500 text-theme-xs dark:text-gray-400">Windows, Mac, Linux</span>
          </div>
        </div>
        <div class="flex w-full max-w-[140px] items-center gap-3">
          <div class="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
            <div class="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-blue-500" style="width: 32%;"></div>
          </div>
          <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">32%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Données statiques pour la démonstration. 
// À connecter avec une API analytique plus tard pour avoir des résultats en temps réel.
</script>
