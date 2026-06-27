<template>
  <div class="w-full pt-4 pb-12 px-4">
      <!-- Top Header -->
      <div class="flex items-center gap-3 mb-10">
          <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all">
              <i class="fas fa-arrow-left text-sm"></i>
          </button>
          <div>
              <h1 class="text-2xl font-black text-gray-900 tracking-tight">Confiance & Sécurité</h1>
              <p class="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Votre protection, notre priorité</p>
          </div>
      </div>

      <!-- Trust Score Card (DYNAMIQUE) -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 border-t-4 border-t-indigo-500">
          <div class="flex items-center justify-between mb-4">
              <h2 class="font-bold text-gray-900">Votre Score de Confiance</h2>
              <span 
                class="text-[10px] font-black px-3 py-1 rounded-full uppercase"
                :class="scoreLabel.class"
              >{{ scoreLabel.text }}</span>
          </div>

          <div v-if="loading" class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-gray-100 animate-pulse"></div>
              <div class="flex-1">
                  <div class="h-2 w-full bg-gray-100 rounded-full mb-2 animate-pulse"></div>
                  <div class="h-3 w-1/2 bg-gray-100 rounded animate-pulse"></div>
              </div>
          </div>

          <div v-else class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-inner flex-shrink-0" :class="scoreIconBg">
                  <i class="fas fa-user-shield" :class="scoreIconColor"></i>
              </div>
              <div class="flex-1">
                  <!-- Barre de progression animée -->
                  <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div 
                        class="h-full rounded-full transition-all duration-1000 ease-out"
                        :class="scoreBarColor"
                        :style="{ width: (trustScore || 0) + '%' }"
                      ></div>
                  </div>
                  <p class="text-[11px] text-gray-500 font-medium">{{ scoreLabel.detail }}</p>
              </div>
              <div class="text-right">
                  <span class="text-2xl font-black" :class="scoreIconColor">{{ Math.round(trustScore || 0) }}</span>
                  <span class="text-xs text-gray-400">/100</span>
              </div>
          </div>

          <!-- Critères détaillés -->
          <div v-if="!loading" class="mt-6 grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              <div class="text-center">
                  <div class="text-sm font-black text-gray-800">{{ Math.round(ratingScore) }}<span class="text-xs text-gray-400">/40</span></div>
                  <p class="text-[9px] text-gray-400 font-medium mt-1">⭐ Avis</p>
              </div>
              <div class="text-center border-x border-gray-100">
                  <div class="text-sm font-black text-gray-800">{{ Math.round(completionScore) }}<span class="text-xs text-gray-400">/30</span></div>
                  <p class="text-[9px] text-gray-400 font-medium mt-1">✅ Livraisons</p>
              </div>
              <div class="text-center">
                  <div class="text-sm font-black text-gray-800">{{ Math.round(disputeScore) }}<span class="text-xs text-gray-400">/30</span></div>
                  <p class="text-[9px] text-gray-400 font-medium mt-1">🛡️ Litiges</p>
              </div>
          </div>
      </div>

      <!-- Trust Pillars (inchangés) -->
      <div class="grid grid-cols-1 gap-4">
          <div class="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div class="relative z-10">
                  <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                      <i class="fas fa-certificate text-xl"></i>
                  </div>
                  <h3 class="font-bold text-lg mb-2">Badge Vendeur Vérifié</h3>
                  <p class="text-sm text-indigo-100 leading-relaxed">
                      Ce badge indique aux acheteurs que votre identité et votre boutique ont été validées par nos experts. 
                      Les vendeurs vérifiés vendent <b>3x plus</b> en moyenne.
                  </p>
              </div>
              <i class="fas fa-check-double absolute -right-4 -bottom-4 text-[120px] text-white/10 rotate-12"></i>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-2xl bg-gray-50 text-gray-900 flex items-center justify-center text-xl shadow-sm border border-gray-100">
                      <i class="fas fa-lock"></i>
                  </div>
                  <div>
                      <h3 class="font-bold text-gray-900 leading-none mb-1">Paiements Sécurisés</h3>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Protection contre les fraudes</p>
                  </div>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed">
                  L'argent de chaque vente est placé en <b>Escrow</b> (séquestre). Il ne vous est versé qu'une fois la livraison confirmée par le Scan QR.
              </p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center text-xl shadow-sm">
                      <i class="fas fa-star"></i>
                  </div>
                  <div>
                      <h3 class="font-bold text-gray-900 leading-none mb-1">Avis & Réputation</h3>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Preuve sociale</p>
                  </div>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed">
                  Chaque avis est vérifié et lié à une commande réelle. Votre bonne réputation est votre capital le plus précieux.
              </p>
          </div>
      </div>

      <!-- Action Footer -->
      <div class="mt-12 text-center bg-gray-50 rounded-3xl p-8 border border-gray-200 border-dashed">
          <h4 class="font-bold text-gray-900 mb-2">Un problème de sécurité ?</h4>
          <p class="text-xs text-gray-500 mb-6">Signalez toute activité suspecte immédiatement à notre équipe de sécurité.</p>
          <router-link to="/contact" class="inline-flex bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-gray-200 hover:scale-95 transition-all items-center justify-center gap-2 mx-auto">
              <i class="fas fa-exclamation-triangle text-red-400"></i>
              Signaler un incident
          </router-link>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const loading = ref(true)
const trustScore = ref(0)
const ratingScore = ref(0)
const completionScore = ref(0)
const disputeScore = ref(0)

const scoreLabel = computed(() => {
    const s = trustScore.value
    if (s >= 90) return { text: 'Excellent', detail: `Score de confiance excellent (${Math.round(s)}%)`, class: 'bg-green-50 text-green-600' }
    if (s >= 70) return { text: 'Bon', detail: `Bon score de confiance (${Math.round(s)}%)`, class: 'bg-blue-50 text-blue-600' }
    if (s >= 50) return { text: 'Moyen', detail: `Score à améliorer (${Math.round(s)}%)`, class: 'bg-yellow-50 text-yellow-600' }
    return { text: 'Faible', detail: `Score faible — action requise (${Math.round(s)}%)`, class: 'bg-red-50 text-red-600' }
})

const scoreBarColor = computed(() => {
    const s = trustScore.value
    if (s >= 90) return 'bg-green-500'
    if (s >= 70) return 'bg-indigo-500'
    if (s >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
})

const scoreIconBg = computed(() => {
    const s = trustScore.value
    if (s >= 90) return 'bg-green-50'
    if (s >= 70) return 'bg-indigo-50'
    if (s >= 50) return 'bg-yellow-50'
    return 'bg-red-50'
})

const scoreIconColor = computed(() => {
    const s = trustScore.value
    if (s >= 90) return 'text-green-600'
    if (s >= 70) return 'text-indigo-600'
    if (s >= 50) return 'text-yellow-600'
    return 'text-red-600'
})

onMounted(async () => {
    try {
        const { data } = await api.get('/vendors/me')
        const store = data.store || data
        trustScore.value = Number(store.trust_score || 0)
        // Décomposer les sous-scores si disponibles
        ratingScore.value = Number(store.trust_rating_score || (trustScore.value * 0.4))
        completionScore.value = Number(store.trust_completion_score || (trustScore.value * 0.3))
        disputeScore.value = Number(store.trust_dispute_score || (trustScore.value * 0.3))
    } catch (err) {
        console.error('Erreur chargement trust score:', err)
    } finally {
        loading.value = false
    }
})
</script>
