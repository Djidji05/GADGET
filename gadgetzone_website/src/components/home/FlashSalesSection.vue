<template>
  <!-- Section Ventes Flash — visible seulement si des flash sales sont actives -->
  <section v-if="flashSales.length > 0" class="container mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-200">
          <i class="fas fa-bolt text-white text-lg"></i>
        </div>
        <div>
          <h2 class="text-xl font-black text-gray-900">Ventes Flash</h2>
          <p class="text-xs text-gray-500">Offres limitées dans le temps</p>
        </div>
      </div>
      <!-- Compte à rebours global (jusqu'à la prochaine expiration) -->
      <div v-if="nextExpiry" class="bg-red-50 border border-red-100 rounded-2xl px-4 py-2 text-center">
        <p class="text-[9px] text-red-500 font-bold uppercase">Se termine dans</p>
        <p class="text-lg font-black text-red-600 tabular-nums">{{ countdownDisplay }}</p>
      </div>
    </div>

    <!-- Flash Sale Cards -->
    <div class="flex overflow-x-auto gap-4 no-scrollbar pb-2 -mx-4 px-4">
      <div 
        v-for="sale in flashSales" 
        :key="sale.id"
        class="flex-shrink-0 w-44 md:w-56 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
        @click="goToProduct(sale.product)"
      >
        <!-- Image + Badge -->
        <div class="relative aspect-square overflow-hidden bg-gray-50">
          <img 
            :src="sale.product?.image_url || '/placeholder.png'" 
            :alt="sale.product?.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          >
          <div class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow">
            -{{ sale.discount_percentage }}%
          </div>
          <!-- Timer individuel -->
          <div class="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-1">
            <span class="text-xs font-bold tabular-nums">{{ getSaleCountdown(sale) }}</span>
          </div>
        </div>
        <!-- Infos -->
        <div class="p-3">
          <p class="text-xs font-bold text-gray-800 line-clamp-2 mb-2">{{ sale.product?.name }}</p>
          <div class="flex items-baseline gap-2">
            <span class="text-lg font-black text-red-600">{{ sale.flash_price }} HTG</span>
          </div>
          <span class="text-[10px] text-gray-400 line-through">{{ sale.original_price }} HTG</span>
          <!-- Stock restant si limité -->
          <div v-if="sale.stock_limit" class="mt-2">
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-red-500 rounded-full transition-all"
                :style="{ width: Math.min(100, ((sale.current_stock || 0) / sale.stock_limit) * 100) + '%' }"
              ></div>
            </div>
            <p class="text-[9px] text-gray-400 mt-0.5">{{ sale.current_stock }} restant(s)</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const flashSales = ref<any[]>([])
let timerInterval: ReturnType<typeof setInterval> | null = null
const now = ref(Date.now())

// Prochain expiry (le plus proche)
const nextExpiry = computed(() => {
  if (flashSales.value.length === 0) return null
  return flashSales.value.reduce((min, s) => {
    const t = new Date(s.end_at).getTime()
    return t < min ? t : min
  }, Infinity)
})

const formatCountdown = (ms: number): string => {
  if (ms <= 0) return '00:00:00'
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  const s = Math.floor((ms % 60_000) / 1_000)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

const countdownDisplay = computed(() => {
  if (!nextExpiry.value || nextExpiry.value === Infinity) return ''
  return formatCountdown(nextExpiry.value - now.value)
})

const getSaleCountdown = (sale: any): string => {
  return formatCountdown(new Date(sale.end_at).getTime() - now.value)
}

const goToProduct = (product: any) => {
  if (product) router.push(`/products/${product.slug || product.id}`)
}

onMounted(async () => {
  try {
    const { data } = await api.get('/flash-sales/active')
    flashSales.value = data.flash_sales || []
  } catch {}
  // Timer tick chaque seconde
  timerInterval = setInterval(() => { now.value = Date.now() }, 1_000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>
