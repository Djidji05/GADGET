<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <!-- Hero Banner -->
    <section class="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white py-20 md:py-28 px-4 overflow-hidden border-b border-gray-800">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]"></div>
      
      <div class="container mx-auto max-w-5xl text-center relative z-10 space-y-6">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 tracking-wide uppercase">
          <i class="fas fa-rocket text-indigo-400"></i> Première Marketplace d'Haïti
        </span>
        <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-tight">
          L'Excellence du E-Commerce <br class="hidden sm:block" />
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-teal-300">
            Accessible à Tous en Haïti
          </span>
        </h1>
        <p class="text-gray-300 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
          Panyem redéfinit les standards de la distribution, de la logistique et de la sécurité des paiements pour connecter les meilleurs vendeurs haïtiens et internationaux avec une clientèle exigeante.
        </p>
      </div>
    </section>

    <!-- Key Metrics Grid -->
    <section class="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div class="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div class="text-3xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-1">10+</div>
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Départements Couverts</div>
          </div>
          <div class="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div class="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400 mb-1">100%</div>
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Escrow Sécurisé</div>
          </div>
          <div class="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div class="text-3xl md:text-4xl font-black text-green-600 dark:text-green-400 mb-1">24/48h</div>
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Livraison Express</div>
          </div>
          <div class="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div class="text-3xl md:text-4xl font-black text-purple-600 dark:text-purple-400 mb-1">MonCash</div>
            <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">& Natcash Intégrés</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Story & Mission -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div class="space-y-6">
            <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Notre Histoire</span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              Bâtir un écosystème commercial moderne et de confiance en Haïti
            </h2>
            <p class="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Créée avec la vision de digitaliser et de structurer le commerce haïtien, <strong>Panyem</strong> est devenue bien plus qu'une simple boutique en ligne. Nous sommes une infrastructure technologique reliant des milliers d'acheteurs avec les meilleurs commerçants et importateurs du pays.
            </p>
            <p class="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              En intégrant des solutions de paiement locales comme <strong>MonCash</strong> et <strong>Natcash</strong> aux côtés des cartes internationales (Stripe), et en garantissant un contrôle rigoureux des vendeurs, nous offrons une expérience d'achat moderne, fiable et rapide, de Port-au-Prince aux villes de province.
            </p>
          </div>

          <div class="relative">
            <div class="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-3xl blur-lg opacity-30"></div>
            <div class="relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 space-y-6">
              <div class="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div class="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold">
                  <i class="fas fa-eye"></i>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-white text-lg">Notre Vision</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">L'avenir du commerce haïtien</p>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Devenir la plateforme référence des Caraïbes permettant à n'importe quel citoyen ou entrepreneur de vendre, acheter et se faire livrer en toute sécurité.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="py-16 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">Nos Valeurs Fondamentales</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Ce qui guide chacune de nos décisions au quotidien.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-gray-50 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-base">Sécurité Escrow</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Vos fonds restent protégés en séquestre tant que votre commande n'est pas reçue et vérifiée.</p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-3">
            <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center text-lg">
              <i class="fas fa-truck-fast"></i>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-base">Livraison Nationale</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Un réseau logistique réactif couvrant l'ensemble du territoire haïtien.</p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg">
              <i class="fas fa-handshake"></i>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-base">Soutien Vendeurs</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Des outils de gestion puissants pour aider les commerçants locaux à digitaliser leurs ventes.</p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-3">
            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
              <i class="fas fa-headset"></i>
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-base">Support Proche</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Une équipe d'assistance réactive en Français et Créole haïtien disponible 7j/7.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA Banner -->
    <section class="py-16 bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
      <div class="container mx-auto px-4 max-w-4xl text-center space-y-6">
        <h2 class="text-3xl font-extrabold">Prêt à vivre l'expérience Panyem ?</h2>
        <p class="text-blue-200 text-sm max-w-xl mx-auto">
          Découvrez notre vaste sélection de produits High-Tech, vêtements, mode et accessoires au meilleur prix avec livraison sécurisée.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <router-link to="/products" class="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all text-sm">
            <i class="fas fa-shopping-bag mr-2"></i> Explorer le Catalogue
          </router-link>
          <router-link to="/become-seller" class="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all text-sm">
            <i class="fas fa-store mr-2"></i> Devenir Vendeur
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>
