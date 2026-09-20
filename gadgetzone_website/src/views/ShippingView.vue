<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <!-- Hero Header -->
    <section class="relative bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white py-14 px-4 border-b border-gray-800">
      <div class="container mx-auto max-w-4xl text-center relative z-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4">
          <i class="fas fa-truck"></i> Service Logistique Haïti
        </span>
        <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
          Livraison & Expédition
        </h1>
        <p class="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
          Découvrez nos zones de couverture, nos délais d'expédition et les méthodes de livraison sur tout le territoire haïtien.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">
        
        <!-- Zones Callout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-2xl space-y-2">
            <div class="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200 text-base">
              <i class="fas fa-bolt text-blue-600 dark:text-blue-400"></i> Zone Métropolitaine & Nord
            </div>
            <p class="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              <strong>Livraison Express (24h - 48h) :</strong> Port-au-Prince, Delmas, Pétion-Ville, Cap-Haïtien, Ouanaminthe, Croix-des-Bouquets.
            </p>
          </div>

          <div class="p-5 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 rounded-2xl space-y-2">
            <div class="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200 text-base">
              <i class="fas fa-map-marked-alt text-purple-600 dark:text-purple-400"></i> Provinces & Départements
            </div>
            <p class="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
              <strong>Livraison Standard (3 - 5 jours) :</strong> Les Cayes, Jacmel, Gonaïves, Saint-Marc, Jérémie, Port-de-Paix, Hinche.
            </p>
          </div>
        </div>

        <!-- Tarifs & Gratuité -->
        <section class="space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="fas fa-tag text-blue-600 dark:text-blue-400 text-lg"></i> Tarifs de Livraison
          </h2>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 space-y-2">
            <div class="flex justify-between items-center text-sm font-bold text-gray-900 dark:text-white">
              <span>Commandes standards (< 5 000 HTG)</span>
              <span class="text-blue-600 dark:text-blue-400">250 HTG</span>
            </div>
            <div class="flex justify-between items-center text-sm font-bold text-green-600 dark:text-green-400">
              <span>Commandes d'au moins 5 000 HTG</span>
              <span class="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs uppercase font-extrabold">Gratuite !</span>
            </div>
          </div>
        </section>

        <!-- Suivi de commande -->
        <section class="space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="fas fa-location-arrow text-blue-600 dark:text-blue-400 text-lg"></i> Suivi & Validation de Réception
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Dès l'expédition de votre colis par le vendeur, vous recevez un code de suivi (ex: <code>GZ-123456</code>). À la livraison, le livreur vous demandera de scanner ou de confirmer votre code QR pour valider la réception et libérer le paiement du vendeur.
          </p>
        </section>

        <!-- WhatsApp Support Banner -->
        <div class="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 class="font-bold text-base">Une question sur votre livraison ?</h3>
            <p class="text-xs text-blue-100">Notre équipe logistique répond à toutes vos demandes par téléphone ou WhatsApp.</p>
          </div>
          <a
            href="https://wa.me/50934567890"
            target="_blank"
            class="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-2 shrink-0"
          >
            <i class="fab fa-whatsapp text-sm"></i> WhatsApp Support
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
