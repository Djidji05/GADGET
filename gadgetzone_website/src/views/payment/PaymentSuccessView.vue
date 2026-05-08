<template>
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div
          class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="las la-check text-4xl text-green-600"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Paiement Réussi!</h1>
        <p class="text-gray-600 mb-2">Merci pour votre commande</p>
        <p v-if="orderNumber" class="text-lg font-medium text-gray-700">
          Commande #{{ orderNumber }}
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 class="font-semibold mb-4">Prochaines étapes</h3>
        <div class="space-y-3 text-left">
          <div class="flex items-start space-x-3">
            <i class="las la-envelope text-primary-600 mt-1"></i>
            <div>
              <p class="font-medium">Email de confirmation</p>
              <p class="text-sm text-gray-600">
                Vous recevrez un email avec les détails de votre commande
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 text-gray-600">
            <i class="las la-box text-xl text-blue-600"></i>
            <p class="font-medium">Disponible de la commande</p>
          </div>
          <p class="text-sm text-gray-600">Nous préparons votre commande pour expédition</p>
          <div class="flex items-start space-x-3">
            <i class="las la-box text-primary-600 mt-1"></i>
            <div>
              <p class="font-medium">Livraison</p>
              <p class="text-sm text-gray-600">Votre commande sera livrée à l'adresse indiquée</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <router-link to="/orders" class="w-full btn-primary inline-block">
          <i class="las la-box mr-2"></i>
          Voir mes commandes
        </router-link>

        <router-link to="/products" class="w-full btn-secondary inline-block">
          <i class="las la-shopping-bag mr-2"></i>
          Continuer mes achats
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Get order number from URL query
const orderNumber = computed(() => route.query.orderId as string)
</script>
