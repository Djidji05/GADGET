<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <!-- Hero Header -->
    <section class="relative bg-gradient-to-br from-red-950 via-slate-900 to-rose-950 text-white py-14 px-4 border-b border-gray-800">
      <div class="container mx-auto max-w-4xl text-center relative z-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-400/30 mb-4">
          <i class="fas fa-undo"></i> Protection Acheteur
        </span>
        <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
          Retours & Remboursements
        </h1>
        <p class="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
          Consultez nos garanties de retour sous 7 jours et la procédure de résolution des litiges en Haïti.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">
        
        <!-- Process Step Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-center space-y-2">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold flex items-center justify-center mx-auto text-sm">1</div>
            <h3 class="font-bold text-sm text-gray-900 dark:text-white">Signalement (7 jours)</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Ouvrez un litige depuis "Mes Commandes" sous 7 jours après livraison.</p>
          </div>

          <div class="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-center space-y-2">
            <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center mx-auto text-sm">2</div>
            <h3 class="font-bold text-sm text-gray-900 dark:text-white">Inspection du Colis</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Retournez le produit dans son emballage d'origine avec ses accessoires.</p>
          </div>

          <div class="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-center space-y-2">
            <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 font-bold flex items-center justify-center mx-auto text-sm">3</div>
            <h3 class="font-bold text-sm text-gray-900 dark:text-white">Remboursement Rapide</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Remboursement sous 3 à 5 jours via MonCash, Natcash ou carte.</p>
          </div>
        </div>

        <!-- Eligible Products -->
        <section class="space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="fas fa-check-circle text-green-500 text-lg"></i> Conditions d'Éligibilité
          </h2>
          <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1.5 pl-2">
            <li>Produit défectueux, endommagé ou non conforme à sa description.</li>
            <li>Article conservé dans son état d'origine avec emballage et étiquettes.</li>
            <li>Demande effectuée dans les 7 jours suivant la remise en main propre.</li>
          </ul>
        </section>

        <!-- CTA -->
        <div class="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl text-center space-y-3">
          <p class="text-sm font-bold text-red-900 dark:text-red-200">Vous rencontrez un problème avec un produit reçu ?</p>
          <router-link
            to="/orders"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow transition-colors"
          >
            <i class="fas fa-exclamation-circle"></i> Accéder à mes commandes & litiges
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
