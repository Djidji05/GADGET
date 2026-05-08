<template>
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <i class="las la-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Page non trouvée</h2>
        <p class="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
      </div>

      <div class="space-y-4">
        <router-link to="/" class="w-full btn-primary inline-block">
          <i class="las la-home mr-2"></i>
          Retour à l'accueil
        </router-link>

        <div class="text-sm text-gray-500">
          Ou essayez de:
          <router-link to="/products" class="text-primary-600 hover:text-primary-500 font-medium">
            parcourir nos produits
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 page component
</script>
