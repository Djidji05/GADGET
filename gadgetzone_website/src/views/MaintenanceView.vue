<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-gray-950 transition-colors">
    <div class="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col items-center">
      <!-- Brand Logo / Badge -->
      <div class="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 animate-bounce">
        <i class="fas fa-tools text-3xl"></i>
      </div>

      <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3">
        Plateforme en maintenance
      </h1>

      <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
        Panyem effectue actuellement des améliorations techniques sur ses serveurs. Nous serons de retour très rapidement.
      </p>

      <div class="w-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4 text-xs text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2 mb-6">
        <i class="fas fa-sync fa-spin"></i>
        <span>Optimisation système en cours... Merci pour votre patience !</span>
      </div>

      <div class="pt-4 border-t border-gray-100 dark:border-gray-800 w-full flex justify-between items-center text-xs text-gray-500">
        <span>© Panyem</span>
        <router-link to="/login" class="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          Accès Administrateur
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page de maintenance Panyem
</script>
