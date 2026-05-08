<template>
<div>
 <h1 class="text-2xl font-bold mb-6 text-gray-800 ">Tableau de Bord Vendeur</h1>
 
 <!-- Stats Cards -->
 <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
 <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
 <p class="text-gray-500 text-sm uppercasse font-bold">Ventes Totales</p>
 <p class="text-2xl font-bold mt-2 text-gray-900 ">0,00 €</p>
 </div>
 <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
 <p class="text-gray-500 text-sm uppercasse font-bold">Commandes</p>
 <p class="text-2xl font-bold mt-2 text-gray-900 ">0</p>
 </div>
 <div class="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
 <p class="text-gray-500 text-sm uppercasse font-bold">Produits Actifs</p>
 <p class="text-2xl font-bold mt-2 text-gray-900 ">0</p>
 </div>
 </div>

 <!-- Quick Actions -->
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div class="bg-white p-6 rounded-lg shadow">
 <h2 class="text-lg font-bold mb-4">Actions Rapides</h2>
 <div class="space-y-4">
 <router-link to="/seller/products/create" class="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition">
 Ajouter un nouveau produit
 </router-link>
 <router-link to="/seller/orders" class="block w-full py-3 px-4 bg-gray-100 text-center rounded hover:bg-gray-200 :bg-gray-600 transition">
 Voir les dernières commandes
 </router-link>
 </div>
 </div>

 <div class="bg-white p-6 rounded-lg shadow">
 <h2 class="text-lg font-bold mb-4">Dernières Annonces</h2>
 <div class="text-gray-600 ">
 <p>Bienvenue dans votre nouvel espace vendeur ! Ici vous pourrez gérer votre boutique en toute simplicité.</p>
 </div>
 </div>
 </div>
 </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

// TODO: Fetch real stats from API
onMounted(() => {
 console.log("Seller Dashboard mounted");
});
</script>
