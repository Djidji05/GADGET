<template>
  <div class="w-full pt-4 pb-12 px-4">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
          <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all">
              <i class="fas fa-arrow-left"></i>
          </button>
          <div>
              <h1 class="text-2xl font-black text-gray-900 tracking-tight">Tous les Services</h1>
              <p class="text-xs text-gray-500 font-medium">Découvrez tous les outils pour votre boutique</p>
          </div>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div 
            v-for="(service, i) in services" 
            :key="i" 
            @click="router.push(service.route)" 
            class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group active:scale-95 transition-all cursor-pointer h-40"
          >
              <div class="w-14 h-14 rounded-full mb-4 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110" :class="service.bg">
                   <i :class="[service.icon, service.color, 'text-2xl']"></i>
              </div>
              <span class="text-xs font-black text-gray-800 uppercase tracking-wide">{{ service.name }}</span>
          </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <i class="fas fa-info-circle"></i>
          </div>
          <div>
              <h4 class="font-bold text-blue-900 text-sm mb-1">Besoin d'aide ?</h4>
              <p class="text-xs text-blue-700 leading-relaxed">
                  Consultez le Centre d'aide pour comprendre le fonctionnement de chaque service ou contactez notre équipe support.
              </p>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const services = [
    { name: 'Académie', icon: 'fas fa-graduation-cap', color: 'text-blue-600', bg: 'bg-blue-50', route: '/seller/academy' },
    { name: 'Centre Aide', icon: 'fas fa-question-circle', color: 'text-purple-600', bg: 'bg-purple-50', route: '/seller/help' },
    { name: 'Confiance', icon: 'fas fa-shield-alt', color: 'text-indigo-500', bg: 'bg-indigo-50', route: '/seller/trust' },
    { name: 'Booster', icon: 'fas fa-rocket', color: 'text-orange-500', bg: 'bg-orange-50', route: '/seller/boost' },
    { name: 'Communauté', icon: 'fas fa-users', color: 'text-green-600', bg: 'bg-green-50', route: '/seller/community' }
];
</script>


