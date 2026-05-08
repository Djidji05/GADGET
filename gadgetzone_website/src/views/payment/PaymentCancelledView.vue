<template>
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div
          class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="las la-times text-4xl text-red-600"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Paiement Annulé</h1>
        <p class="text-gray-600">
          Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 class="font-semibold mb-4">Que s'est-il passé?</h3>
        <div class="space-y-3 text-left">
          <div class="flex items-start space-x-3">
            <i class="las la-info-circle text-blue-600 mt-1"></i>
            <div>
              <p class="font-medium">Annulation volontaire</p>
              <p class="text-sm text-gray-600">Vous avez annulé le processus de paiement</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <i class="las la-credit-card text-blue-600 mt-1"></i>
            <div>
              <p class="font-medium">Problème de paiement</p>
              <p class="text-sm text-gray-600">Une erreur s'est produite lors du traitement</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <i class="las fa-shield-alt text-blue-600 mt-1"></i>
            <div>
              <p class="font-medium">Sécurité</p>
              <p class="text-sm text-gray-600">La transaction a été bloquée pour votre sécurité</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <router-link to="/checkout" class="w-full btn-primary inline-block">
          <i class="las la-redo mr-2"></i>
          Réessayer le paiement
        </router-link>

        <router-link to="/cart" class="w-full btn-secondary inline-block">
          <i class="las la-shopping-cart mr-2"></i>
          Modifier mon panier
        </router-link>

        <router-link to="/contact" class="text-primary-600 hover:text-primary-500 font-medium">
          Besoin d'aide? Contactez-nous
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Payment cancelled page component
</script>
