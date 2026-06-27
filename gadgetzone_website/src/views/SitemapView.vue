<template>
<div class="bg-gray-50 min-h-screen pt-10 pb-28 md:pb-10 font-sans">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-black text-gray-900 mb-4">Architecture de la Plateforme</h1>
        <p class="text-gray-500 max-w-2xl mx-auto">
          Explorez l'écosystème HTFasil à travers notre plan détaillé. Accédez rapidement à votre espace personnel, nos boutiques partenaires ou notre centre d'assistance.
        </p>
      </div>

      <!-- Sitemap Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Category 1: Boutique -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <i class="fas fa-shopping-bag text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Boutique</h2>
          </div>
          <ul class="space-y-3">
            <li><router-link to="/products" class="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-blue-500 text-sm"></i>Tous les produits</router-link></li>
            <li><router-link to="/products?category=high-tech" class="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-blue-500 text-sm"></i>High-Tech & Informatique</router-link></li>
            <li><router-link to="/products?category=maison" class="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-blue-500 text-sm"></i>Maison & Bricolage</router-link></li>
            <li><router-link to="/products?category=mode" class="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-blue-500 text-sm"></i>Mode & Beauté</router-link></li>
            <li><router-link to="/products?category=jeux-jouets" class="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-blue-500 text-sm"></i>Jeux & Jouets</router-link></li>
            <li><router-link to="/products?category=culture" class="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-blue-500 text-sm"></i>Culture & Livres</router-link></li>
            <li><router-link to="/promotions" class="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-blue-500 text-sm"></i>Offres et Promotions</router-link></li>
          </ul>
        </div>

        <!-- Category 2: Mon Compte -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div class="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <i class="fas fa-user text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Mon Compte</h2>
          </div>
          <ul class="space-y-3">
            <li><router-link to="/login" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-purple-500 text-sm"></i>Connexion</router-link></li>
            <li><router-link to="/register" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-purple-500 text-sm"></i>Inscription</router-link></li>
            <li><router-link to="/account" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-purple-500 text-sm"></i>Tableau de bord personnel</router-link></li>
            <li><router-link to="/orders" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-purple-500 text-sm"></i>Mes Commandes</router-link></li>
            <li><router-link to="/wishlist" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-purple-500 text-sm"></i>Liste d'envies</router-link></li>
            <li><router-link to="/addresses" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-purple-500 text-sm"></i>Mes Adresses</router-link></li>
            <li><router-link to="/notifications" class="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-purple-500 text-sm"></i>Mes Notifications</router-link></li>
          </ul>
        </div>

        <!-- Category 3: Vendeurs -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div class="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <i class="fas fa-store text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Espace Vendeurs</h2>
          </div>
          <ul class="space-y-3">
            <li><router-link to="/become-seller" class="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-green-500 text-sm"></i>Devenir Vendeur</router-link></li>
            <li><router-link to="/seller/dashboard" class="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-green-500 text-sm"></i>Tableau de bord Vendeur</router-link></li>
            <li><router-link to="/seller/products" class="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-green-500 text-sm"></i>Gestion des Produits</router-link></li>
            <li><router-link to="/seller/orders" class="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-green-500 text-sm"></i>Gestion des Commandes</router-link></li>
            <li><router-link to="/seller/messages" class="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-green-500 text-sm"></i>Messagerie</router-link></li>
            <li><router-link to="/seller/services" class="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-green-500 text-sm"></i>Services et Aides</router-link></li>
          </ul>
        </div>

        <!-- Category 4: Informations Pratiques -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div class="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <i class="fas fa-info-circle text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Infos Pratiques</h2>
          </div>
          <ul class="space-y-3">
            <li><router-link to="/about" class="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-orange-500 text-sm"></i>À Propos de nous</router-link></li>
            <li><router-link to="/contact" class="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-orange-500 text-sm"></i>Nous Contacter</router-link></li>
            <li><router-link to="/faq" class="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-orange-500 text-sm"></i>Foire Aux Questions (FAQ)</router-link></li>
            <li><router-link to="/shipping" class="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-orange-500 text-sm"></i>Livraison et Suivi</router-link></li>
            <li><router-link to="/returns" class="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-orange-500 text-sm"></i>Retours et Remboursements</router-link></li>
            <li><router-link to="/warranty" class="text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-orange-500 text-sm"></i>Garantie des produits</router-link></li>
          </ul>
        </div>

        <!-- Category 5: Aspect Légal -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div class="w-10 h-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center">
              <i class="fas fa-gavel text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Aspect Légal</h2>
          </div>
          <ul class="space-y-3">
            <li><router-link to="/terms" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-gray-500 text-sm"></i>Conditions Générales d'Utilisation</router-link></li>
            <li><router-link to="/privacy" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 group"><i class="fas fa-angle-right text-gray-300 group-hover:text-gray-500 text-sm"></i>Politique de Confidentialité</router-link></li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>
