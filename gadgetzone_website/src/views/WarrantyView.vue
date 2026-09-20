<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <!-- Hero Header -->
    <section class="relative bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white py-14 px-4 border-b border-gray-800">
      <div class="container mx-auto max-w-4xl text-center relative z-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-4">
          <i class="fas fa-shield-alt"></i> Produits Authentiques
        </span>
        <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
          Garantie & Qualité Panyem
        </h1>
        <p class="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
          Tous nos produits high-tech et électroniques vendus en Haïti bénéficient de notre garantie de sérénité.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">
        
        <!-- Standard Warranty Card -->
        <div class="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0">
            <i class="fas fa-award"></i>
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-emerald-900 dark:text-emerald-200 text-base">Garantie Minimum de 6 Mois</h3>
            <p class="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
              Sauf mention contraire spécifiée sur la fiche descriptive, tous les articles électroniques et smartphones bénéficient d'une garantie constructeur ou Panyem de 6 à 12 mois.
            </p>
          </div>
        </div>

        <!-- Coverage Comparison -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Covered -->
          <div class="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-3">
            <h3 class="font-bold text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
              <i class="fas fa-check-circle"></i> Éléments Couverts
            </h3>
            <ul class="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <li class="flex items-start gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i> Défauts de fabrication et composants matériels.</li>
              <li class="flex items-start gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i> Panne de batterie prématurée ou chargeur défectueux d'origine.</li>
              <li class="flex items-start gap-2"><i class="fas fa-check text-green-500 mt-0.5"></i> Dysfonctionnements système non causés par une mauvaise utilisation.</li>
            </ul>
          </div>

          <!-- Excluded -->
          <div class="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-3">
            <h3 class="font-bold text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <i class="fas fa-times-circle"></i> Éléments Exclus
            </h3>
            <ul class="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <li class="flex items-start gap-2"><i class="fas fa-times text-red-400 mt-0.5"></i> Chutes accidentelles, fissures d'écran ou chocs physiques.</li>
              <li class="flex items-start gap-2"><i class="fas fa-times text-red-400 mt-0.5"></i> Dommages causés par l'eau, l'humidité ou surtension électrique.</li>
              <li class="flex items-start gap-2"><i class="fas fa-times text-red-400 mt-0.5"></i> Tentative de réparation par un atelier non agréé Panyem.</li>
            </ul>
          </div>
        </div>

        <!-- How to Claim -->
        <section class="space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="fas fa-tools text-emerald-600 dark:text-emerald-400 text-lg"></i> Comment faire jouer la garantie ?
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Conservez votre facture d'achat disponible dans <a href="/account" class="text-emerald-600 underline font-medium">Mon Compte</a>. En cas de dysfonctionnement, contactez notre support client muni de votre numéro de commande et d'une courte vidéo montrant le problème.
          </p>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
