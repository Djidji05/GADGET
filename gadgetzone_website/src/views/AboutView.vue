<template>
<div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-slate-950 text-white py-24 relative overflow-hidden">
      <!-- Subtle Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
      
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">À Propos de <span class="text-indigo-400">HTFasil</span></h1>
        <p class="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed">
          Votre marketplace d'excellence pour tous vos désirs, livrée avec passion partout en Haïti.
        </p>
      </div>
    </section>

    <!-- Our Story -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="order-2 lg:order-1">
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Notre Histoire</h2>
            <div class="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                Fondée en 2020, HTFasil est née d'une vision audacieuse : transformer l'expérience 
                d'achat en Haïti. Ce qui a commencé comme une volonté d'apporter le meilleur de la 
                qualité locale et internationale est devenu aujourd'hui une référence incontournable.
              </p>
              <p>
                D'une offre spécialisée, nous avons évolué vers un marketplace universel. 
                Aujourd'hui, HTFasil connecte des milliers de clients à un catalogue infini : 
                de l'élégance de la mode à la chaleur d'un foyer bien équipé, sans jamais 
                oublier les outils qui façonnent notre futur.
              </p>
              <p>
                Notre socle ? Une confiance inébranlable, une sécurité exemplaire et une 
                obsession pour la satisfaction de notre communauté grandissante.
              </p>
            </div>
          </div>
          <div class="order-1 lg:order-2">
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-slate-900 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img
                src="file:///C:/Users/ndjiv/.gemini/antigravity/brain/483dca1a-b9a7-40c0-b5b4-a35ef715a408/about_marketplace_intro_1775689137475.png"
                alt="L'univers HTFasil"
                class="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-24 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-500">
            <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <i class="fas fa-bullseye text-indigo-600 text-3xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-4">Notre Mission</h3>
            <p class="text-lg text-slate-600">
              Démocratiser l'excellence commerciale. Nous offrons une plateforme robuste et 
              sécurisée où chaque achat devient une expérience de plaisir, de fiabilité et 
              de rapidité exemplaire.
            </p>
          </div>

          <div class="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-500">
            <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <i class="fas fa-eye text-indigo-600 text-3xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-4">Notre Vision</h3>
            <p class="text-lg text-slate-600">
              Bâtir le futur du commerce en Haïti. Nous aspirons à être le lien vital entre 
              le talent local et chaque foyer, en redéfinissant les standards de service 
              et de choix à chaque clic.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-slate-900 mb-16 underline decoration-indigo-200 decoration-8 underline-offset-8">Ce qui nous définit</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div class="text-center group">
            <div class="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-transform duration-300">
              <i class="fas fa-shield-alt text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">Sûreté Totale</h3>
            <p class="text-slate-600">Transactions blindées et protection absolue de vos données.</p>
          </div>

          <div class="text-center group">
            <div class="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:-rotate-12 transition-transform duration-300">
              <i class="fas fa-award text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">Qualité Premium</h3>
            <p class="text-slate-600">Une sélection rigoureuse pour une satisfaction garantie.</p>
          </div>

          <div class="text-center group">
            <div class="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-transform duration-300">
              <i class="fas fa-headset text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">Support Dédié</h3>
            <p class="text-slate-600">Humains et compréhensifs, nous sommes toujours à vos côtés.</p>
          </div>

          <div class="text-center group">
            <div class="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:-rotate-12 transition-transform duration-300">
              <i class="fas fa-shipping-fast text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">Livraison Rapide</h3>
            <p class="text-slate-600">Du Cap à Ouanaminthe, nous livrons vos désirs sans attendre.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section (with Second Image) -->
    <section class="py-24 bg-slate-950 text-white overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="relative">
            <img
               src="file:///C:/Users/ndjiv/.gemini/antigravity/brain/483dca1a-b9a7-40c0-b5b4-a35ef715a408/htfasil_experience_premium_1775689313401.png"
               alt="L'expérience client"
               class="rounded-3xl shadow-2xl w-full object-cover"
            />
          </div>
          <div class="space-y-8">
            <h2 class="text-3xl md:text-5xl font-bold tracking-tight">Plus qu'un simple achat, une <span class="text-indigo-400">expérience</span></h2>
            <p class="text-xl text-slate-300 leading-relaxed">
              Nous croyons que chaque interaction avec HTFasil doit être mémorable. De la navigation fluide sur notre site à l'ouverture de votre colis, nous peaufinons chaque détail pour vous offrir le luxe de la simplicité.
            </p>
            <div class="flex flex-col sm:flex-row gap-6">
              <router-link to="/products" class="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all text-center">
                Explorer le catalogue
              </router-link>
              <router-link to="/contact" class="px-8 py-4 border-2 border-slate-700 text-white rounded-full font-bold hover:bg-slate-800 transition-all text-center">
                Besoin d'aide ?
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// About page component
</script>
