<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-gray-950 py-8 px-4 sm:px-6">
    <div class="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 text-center relative overflow-hidden">
      <!-- Success Icon -->
      <div class="mb-6">
        <div class="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
          <i class="las la-check text-3xl font-bold"></i>
        </div>
        <h1 class="text-xl font-black text-black dark:text-white uppercase tracking-wider mb-2">Paiement Réussi !</h1>
        <p class="text-xs text-gray-550 dark:text-gray-400 font-medium">Merci pour votre confiance. Votre commande a été enregistrée avec succès.</p>
      </div>

      <!-- Information Box -->
      <div v-if="orderNumber" class="bg-[#eff6ff] dark:bg-gray-800/30 border border-primary-100 dark:border-gray-700/50 p-4 rounded-xl mb-6 text-center">
        <span class="block text-[10px] text-gray-450 uppercase font-black tracking-widest mb-1">Numéro de commande</span>
        <span class="text-sm font-black text-primary-600 dark:text-primary-400 tracking-wider">{{ formattedOrderNumber }}</span>
      </div>

      <!-- Action Buttons with a modern, elegant design -->
      <div class="flex flex-col sm:flex-row gap-3 mt-6">
        <router-link
          to="/orders"
          class="flex-1 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition-all duration-200 shadow-md shadow-blue-500/15"
        >
          <i class="las la-truck text-lg"></i>
          <span>Suivre ma commande</span>
        </router-link>

        <router-link
          to="/products"
          class="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 font-bold text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.99] transition-all duration-200 border border-gray-200/60 dark:border-gray-700/50"
        >
          <i class="las la-shopping-bag text-lg"></i>
          <span>Continuer mes achats</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import confetti from 'canvas-confetti'

const route = useRoute()

// Get order number from URL query
const orderNumber = computed(() => route.query.orderId as string)

const formattedOrderNumber = computed(() => {
  if (!orderNumber.value) return '';
  // Si c'est déjà formaté, le retourner tel quel
  if (String(orderNumber.value).startsWith('Ord-ht')) {
    return orderNumber.value;
  }
  return `Ord-ht_f05-${orderNumber.value}`;
})

onMounted(() => {
  // Fire confetti animation to celebrate!
  const duration = 4 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Fire from left side
    confetti(Object.assign({}, defaults, { 
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    }));
    // Fire from right side
    confetti(Object.assign({}, defaults, { 
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    }));
  }, 250);
})
</script>

<style scoped>
.payment-success-page {
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
