<template>
  <div class="pointer-events-none">
    <!-- Top Progress Bar (NProgress style) -->
    <div
      v-if="uiStore.isPageLoading || uiStore.pageLoadingProgress > 0"
      class="fixed top-0 left-0 right-0 z-[99999] h-1 bg-transparent overflow-hidden"
    >
      <div
        class="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 transition-all duration-200 ease-out shadow-[0_0_12px_rgba(59,130,246,0.8)]"
        :style="{ width: `${uiStore.pageLoadingProgress}%` }"
      ></div>
    </div>

    <!-- Floating Slow Loading Pill (Appears when route/page launch takes > 300ms) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-4 scale-95"
    >
      <div
        v-if="uiStore.isPageSlowLoading"
        class="fixed top-5 left-1/2 -translate-x-1/2 z-[99998] pointer-events-auto"
      >
        <div class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-blue-200/80 dark:border-blue-900/60 text-gray-800 dark:text-gray-100 px-5 py-2.5 rounded-full shadow-xl flex items-center gap-3 text-xs font-semibold tracking-wide border-t-2 border-t-blue-500">
          <div class="relative flex items-center justify-center">
            <i class="fas fa-circle-notch fa-spin text-blue-600 dark:text-blue-400 text-sm"></i>
          </div>

          <div class="flex flex-col">
            <span class="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
              {{ uiStore.isPageVerySlow ? 'Connexion réseau lente...' : 'Chargement de la page...' }}
            </span>
            <span v-if="uiStore.isPageVerySlow" class="text-[10px] text-gray-500 dark:text-gray-400 font-normal">
              Ouverture en cours, veuillez patienter...
            </span>
          </div>

          <!-- Pulsing dot -->
          <span class="relative flex h-2 w-2 ml-1">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
</script>
