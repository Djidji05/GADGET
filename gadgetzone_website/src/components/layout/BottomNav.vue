<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()

import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const isSeller = computed(() => {
  return authStore.customer?.role === 'seller' || authStore.customer?.role === 'admin'
})

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
<nav class="bottom-nav" :style="{ gridTemplateColumns: isSeller ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)' }">
     <!-- Unauth Banner (Floating above) -->
      <div 
        v-if="!authStore.isAuthenticated" 
        class="absolute bottom-full left-0 right-0 bg-blue-600 text-white text-[11px] py-2 px-3 flex justify-between items-center shadow-lg"
      >
        <span class="font-medium">Profitez des offres !</span>
        <div class="flex items-center gap-2 font-bold uppercase tracking-wide">
             <router-link to="/register" class="underline decoration-white/50 underline-offset-2">Inscription</router-link>
             <span class="opacity-60 text-[10px]">•</span>
             <router-link to="/login" class="underline decoration-white/50 underline-offset-2">Connexion</router-link>
        </div>
      </div>
    <router-link to="/" class="nav-item" :class="{ active: isActive('/') && route.path === '/' }">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span>Accueil</span>
    </router-link>

    <router-link to="/orders" class="nav-item" :class="{ active: isActive('/orders') }">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <span>Commandes</span>
    </router-link>

    <router-link to="/cart" class="nav-item" :class="{ active: isActive('/cart') }">
      <div class="relative" :class="{ 'cart-animate': uiStore.isCartAnimating }">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full leading-none">{{ cartStore.itemCount }}</span>
      </div>
      <span>Panier</span>
    </router-link>

    <router-link to="/account" class="nav-item" :class="{ active: isActive('/account') }">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span>Compte</span>
    </router-link>
    
    <router-link v-if="isSeller" to="/seller/dashboard" class="nav-item text-blue-600" :class="{ active: isActive('/seller') }">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <span class="font-bold">Boutique</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  /* Columns are handled dynamically inline now */
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 0.5rem 0;
  z-index: 60;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

:global(.dark) .bottom-nav {
  background: #030712;
  border-top-color: #1f2937;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

:global(.dark) .nav-item {
  color: #9ca3af;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item.active {
  color: #3b82f6;
}

:global(.dark) .nav-item.active {
  color: #3b82f6;
}

.icon {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

span {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Cacher sur desktop */
@media (min-width: 1024px) {
  .bottom-nav {
    display: none;
  }
}

@keyframes cart-shake {
  0% { transform: scale(1); }
  25% { transform: scale(1.2) rotate(-10deg); }
  50% { transform: scale(1.2) rotate(10deg); }
  75% { transform: scale(1.2) rotate(-10deg); }
  100% { transform: scale(1); }
}

.cart-animate {
  animation: cart-shake 0.6s ease-in-out;
}
</style>

<style>
.dark .bottom-nav {
  background: #030712 !important;
  border-top-color: #1f2937 !important;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3) !important;
}

.dark .nav-item {
  color: #9ca3af !important;
}

.dark .nav-item.active {
  color: #3b82f6 !important;
}
</style>
