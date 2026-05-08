<template>
  <div class="w-full pt-4 pb-12 px-4">
      <!-- Top Header -->
      <div class="flex items-center gap-3 mb-10">
          <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all">
              <i class="fas fa-arrow-left text-sm"></i>
          </button>
          <div>
              <h1 class="text-2xl font-black text-gray-900 tracking-tight">Guide du Vendeur</h1>
              <p class="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Tout ce qu'il faut savoir</p>
          </div>
      </div>

      <!-- Main Guide "Card" Container -->
      <div class="space-y-6">
          
          <!-- Introduction Card -->
          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
              <div class="relative z-10">
                  <h2 class="text-xl font-bold mb-2">Bienvenue sur HTFasil !</h2>
                  <p class="text-sm text-blue-100 leading-relaxed mb-4">
                      Vous faites désormais partie de la plus grande plateforme de vente de gadgets en Haïti. 
                      Ce guide vous explique comment réussir votre aventure.
                  </p>
                  <div class="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10 backdrop-blur-sm">
                      <i class="fas fa-clock"></i>
                      <span>Lecture : 5 minutes</span>
                  </div>
              </div>
              <i class="fas fa-rocket absolute -right-6 -bottom-6 text-[140px] text-white/10 -rotate-12"></i>
          </div>

          <!-- Step 1: Boutique -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
              <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-sm">
                      <i class="fas fa-store"></i>
                  </div>
                  <div>
                      <h3 class="font-bold text-gray-900 leading-none mb-1">1. Votre Boutique</h3>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Configuration de base</p>
                  </div>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed mb-4">
                  Personnalisez votre espace dans les <b>Paramètres</b>. Ajoutez un logo clair et un nom accrocheur. 
                  Une boutique bien présentée inspire 2x plus de confiance.
              </p>
              <ul class="space-y-2">
                  <li class="flex items-center gap-2 text-xs text-gray-500">
                      <i class="fas fa-check-circle text-green-500"></i>
                      Vérifiez votre numéro de téléphone
                  </li>
                  <li class="flex items-center gap-2 text-xs text-gray-500">
                      <i class="fas fa-check-circle text-green-500"></i>
                      Remplissez vos infos de retrait
                  </li>
              </ul>
          </div>

          <!-- Step 2: Produits -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
              <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl shadow-sm">
                      <i class="fas fa-box-open"></i>
                  </div>
                  <div>
                      <h3 class="font-bold text-gray-900 leading-none mb-1">2. Vos Produits</h3>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Inventaire & Vente</p>
                  </div>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed mb-4">
                  Pour vendre, vous devez ajouter vos gadgets. Soyez précis sur la description et le prix. 
                  <b>Astuce :</b> Utilisez le service "Booster" pour être affiché en tête de liste.
              </p>
              <div class="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 border-dashed">
                  <p class="text-xs text-orange-700 font-medium">
                      <i class="fas fa-lightbulb mr-1"></i> Des photos lumineuses sur fond neutre augmentent les ventes de 40%.
                  </p>
              </div>
          </div>

          <!-- Step 3: Commandes -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-xl shadow-sm">
                      <i class="fas fa-shipping-fast"></i>
                  </div>
                  <div>
                      <h3 class="font-bold text-gray-900 leading-none mb-1">3. Gestion & Livraison</h3>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Flux de travail</p>
                  </div>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed mb-4">
                  Quand une commande arrive, vous recevez une notification. 
              </p>
              <div class="space-y-4">
                  <div class="flex gap-4">
                      <div class="w-6 h-6 rounded-full bg-green-500 text-white flex flex-shrink-0 items-center justify-center text-[10px] font-bold">1</div>
                      <p class="text-xs text-gray-500">Préparez le colis proprement.</p>
                  </div>
                  <div class="flex gap-4">
                      <div class="w-6 h-6 rounded-full bg-green-500 text-white flex flex-shrink-0 items-center justify-center text-[10px] font-bold">2</div>
                      <p class="text-xs text-gray-500">Scannez le <b>QR Code "Scan-to-Deliver"</b> au moment de la remise au transporteur ou au client.</p>
                  </div>
              </div>
          </div>

          <!-- Step 4: Revenus -->
          <div class="bg-gray-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
              <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center text-xl">
                      <i class="fas fa-wallet"></i>
                  </div>
                  <div>
                      <h3 class="font-bold text-white leading-none mb-1">4. Vos Revenus</h3>
                      <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Commission & Paiements</p>
                  </div>
              </div>
              <p class="text-sm text-gray-400 leading-relaxed mb-4">
                  HTFasil prend une commission de <b>10%</b> sur vos ventes. Le reste est versé sur votre solde "Retirable".
              </p>
              <div class="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                      <p class="text-[10px] text-gray-500 uppercase font-bold">Retrait via</p>
                      <p class="text-sm font-bold">MonCash / Natcash</p>
                  </div>
                  <div class="text-right">
                      <p class="text-[10px] text-gray-500 uppercase font-bold">Délai</p>
                      <p class="text-sm font-bold">24h à 48h</p>
                  </div>
              </div>
          </div>

      </div>

      <!-- Need Help Button -->
      <div class="mt-12 text-center">
          <p class="text-xs text-gray-400 mb-4">Une question spécifique ?</p>
          <a href="https://wa.me/votre_numero" target="_blank" class="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-all">
              <i class="fab fa-whatsapp text-lg"></i>
              Contacter le Support
          </a>
      </div>
  </div>
</template>

<script setup lang="ts">
// No complex logic needed for a static guide
</script>


