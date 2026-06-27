<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div v-if="verifying" class="mb-8">
        <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="las la-spinner la-spin text-4xl text-blue-600"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Vérification en cours...</h1>
        <p class="text-gray-600">Veuillez patienter pendant que nous confirmons votre paiement.</p>
      </div>

      <div v-else-if="error" class="mb-8">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="las la-times text-4xl text-red-600"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Échec du paiement</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <div class="space-y-4">
          <router-link to="/cart" class="w-full btn-primary inline-block">
            <i class="las la-shopping-cart mr-2"></i>
            Retourner au panier
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const verifying = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const status = route.query.status as string
  const transactionId = route.query.transaction_id as string
  
  if (status !== 'success' || !transactionId) {
    verifying.value = false
    error.value = "Le paiement a été annulé ou a échoué."
    return
  }

  try {
    // Appeler le backend pour vérifier la transaction Starbee
    const response = await api.get(`/paiements/callback/verify?transaction_id=${transactionId}`)
    
    if (response.data.success) {
      await cartStore.clearCart() // Vider le panier si le paiement est un succès
      router.push(`/payment/success?orderId=${response.data.orderId || transactionId}`)
    } else {
      verifying.value = false
      error.value = "La vérification du paiement a échoué. Veuillez contacter le support."
    }
  } catch (err: any) {
    console.error('Erreur lors de la vérification du paiement:', err)
    verifying.value = false
    error.value = err.response?.data?.error || "Une erreur est survenue lors de la vérification du paiement."
  }
})
</script>
