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

      <!-- Trust Score Card -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 border-t-4 border-t-indigo-500">
          <div class="flex items-center justify-between mb-4">
              <h2 class="font-bold text-gray-900">Votre Statut de Confiance</h2>
              <span class="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Vérifié</span>
          </div>
          <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-2xl text-indigo-600 shadow-inner">
                  <i class="fas fa-user-shield"></i>
              </div>
              <div class="flex-1">
                  <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div class="h-full bg-indigo-500 w-[95%]"></div>
                  </div>
                  <p class="text-[11px] text-gray-500 font-medium">Excellent score de confiance (95%)</p>
              </div>
          </div>
      </div>

      <!-- Trust Pillars -->
      <div class="grid grid-cols-1 gap-4">
          
          <!-- Pillar 1: Verified Badge -->
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

          <!-- Pillar 2: Escrow Payments -->
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
                  Cela protège aussi bien le vendeur que l'acheteur contre les fausses réclamations.
              </p>
          </div>

          <!-- Pillar 3: Reviews System -->
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
                  Chaque avis est vérifié et lié à une commande réelle. Personne ne peut laisser de faux avis négatifs. 
                  Votre bonne réputation est votre capital le plus précieux.
              </p>
          </div>

          <!-- Pillar 4: Data Protection -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl shadow-sm">
                      <i class="fas fa-fingerprint"></i>
                  </div>
                  <div>
                      <h3 class="font-bold text-gray-900 leading-none mb-1">Données Cryptées</h3>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Vie privée</p>
                  </div>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed">
                  Vos informations personnelles et bancaires sont sécurisées selon les standards internationaux. 
                  HTFasil ne partage jamais vos données sans votre accord explicite.
              </p>
          </div>

      </div>

      <!-- Action Footer -->
      <div class="mt-12 text-center bg-gray-50 rounded-3xl p-8 border border-gray-200 border-dashed">
          <h4 class="font-bold text-gray-900 mb-2">Un problème de sécurité ?</h4>
          <p class="text-xs text-gray-500 mb-6">Signalez toute activité suspecte immédiatement à notre équipe de sécurité.</p>
          <a href="https://wa.me/votre_numero" target="_blank" rel="noopener noreferrer" class="inline-flex bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-gray-200 hover:scale-95 transition-all items-center justify-center gap-2 mx-auto">
              <i class="fas fa-exclamation-triangle text-red-400"></i>
              Signaler un incident
          </a>
      </div>
  </div>
</template>

<script setup lang="ts">
// Logic can be added here later if needed (e.g. dynamic score)
</script>


