<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-gray-50">
    <div class="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
      <i class="fas fa-tools text-4xl"></i>
    </div>
    <h1 class="text-3xl font-bold text-gray-900 mb-4">Site en maintenance</h1>
    <p class="text-gray-600 max-w-md mb-8">
      Nous effectuons actuellement une mise à jour sur la plateforme pour améliorer votre expérience. 
      Veuillez revenir dans quelques instants.
    </p>
    
    <!-- Optional admin login bypass -->
    <router-link to="/login" class="text-sm text-gray-400 hover:text-blue-600 transition">
      Accès administrateur
    </router-link>
  </div>
</template>

<script setup lang="ts">
// Vue de maintenance simple
</script>
