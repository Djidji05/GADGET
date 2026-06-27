<template>
<div class="space-y-2">
    
    <!-- Tous les produits -->
    <router-link
      to="/products"
      class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium"
      @click="$emit('close')"
    >
      <span class="flex items-center gap-2"><i class="fas fa-th-large text-gray-500 dark:text-gray-400"></i> Tous les produits</span>
    </router-link>

    <!-- Vendre sur HTFasil / Ma Boutique (Mobile) -->
    <router-link
      v-if="!isSeller"
      to="/become-seller"
      class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium border border-gray-100 dark:border-gray-800"
      @click="$emit('close')"
    >
      <span class="flex items-center gap-2"><i class="fas fa-store text-gray-500 dark:text-gray-400"></i> Vendre sur HTFasil</span>
    </router-link>

    <router-link
      v-else
      to="/seller/dashboard"
      class="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/30"
      @click="$emit('close')"
    >
      <span class="flex items-center gap-2"><i class="fas fa-store text-blue-600 dark:text-blue-400"></i> Ma Boutique</span>
      <i class="fas fa-chevron-right text-blue-400 text-xs"></i>
    </router-link>

    <!-- Notifications (Mobile) -->
    <router-link
      to="/notifications"
      class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium"
      @click="$emit('close')"
    >
      <span class="flex items-center gap-2">
        <i class="fas fa-bell text-gray-500 dark:text-gray-400"></i> Vos Notifications
      </span>
      <span v-if="notificationsStore.unreadCount > 0" class="bg-gray-900 dark:bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {{ notificationsStore.unreadCount }}
      </span>
    </router-link>

    <!-- Wishlist (Mobile) -->
    <router-link
      to="/wishlist"
      class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium"
      @click="$emit('close')"
    >
      <span class="flex items-center gap-2">
        <i class="fas fa-heart text-gray-500 dark:text-gray-400"></i> Votre Liste d'envies
      </span>
      <span v-if="wishlistStore.itemCount > 0" class="bg-gray-900 dark:bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
        {{ wishlistStore.itemCount }}
      </span>
    </router-link>

    <!-- High-Tech & Informatique -->
    <div class="border dark:border-gray-800 rounded-lg overflow-hidden">
      <button @click="toggleCategory('hitech')" class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
        <span class="flex items-center gap-2"><i class="fas fa-laptop text-gray-500 dark:text-gray-400 w-5 text-center"></i> High-Tech & Info</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'hitech' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'hitech'" class="bg-gray-50 dark:bg-gray-950 p-2 space-y-1">
        <div class="px-2 py-1 text-xs font-bold text-gray-400 dark:text-gray-550 uppercase">Informatique</div>
        <router-link to="/products?category=laptop" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Ordinateurs & Tablettes</router-link>
        <router-link to="/products?category=composants" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Composants & RAM</router-link>
        
        <div class="px-2 py-1 text-xs font-bold text-gray-400 dark:text-gray-550 uppercase mt-2">Téléphonie</div>
        <router-link to="/products?category=smartphone" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Smartphones & Montres</router-link>
        
        <div class="px-2 py-1 text-xs font-bold text-gray-400 dark:text-gray-550 uppercase mt-2">Audio, TV & Photo</div>
        <router-link to="/products?category=audio" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Casques, Enceintes & TV</router-link>
        <router-link to="/products?category=photo" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Photo, Drones & Sécurité</router-link>
      </div>
    </div>

    <!-- Maison & Bricolage -->
    <div class="border dark:border-gray-800 rounded-lg overflow-hidden">
      <button @click="toggleCategory('maison')" class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
        <span class="flex items-center gap-2"><i class="fas fa-home text-gray-500 dark:text-gray-400 w-5 text-center"></i> Maison & Brico</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'maison' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'maison'" class="bg-gray-50 dark:bg-gray-950 p-2 space-y-1">
        <router-link to="/products?category=cuisine" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Cuisine & Électroménager</router-link>
        <router-link to="/products?category=meubles" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Meubles & Décoration</router-link>
        <router-link to="/products?category=outillage" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Bricolage & Outils</router-link>
        <router-link to="/products?category=jardin" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Jardin & Animalerie</router-link>
      </div>
    </div>

    <!-- Mode & Beauté -->
    <div class="border dark:border-gray-800 rounded-lg overflow-hidden">
      <button @click="toggleCategory('mode')" class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
        <span class="flex items-center gap-2"><i class="fas fa-tshirt text-gray-500 dark:text-gray-400 w-5 text-center"></i> Mode & Beauté</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'mode' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'mode'" class="bg-gray-50 dark:bg-gray-950 p-2 space-y-1">
        <router-link to="/products?category=mode-femme" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Vêtements Femme & Homme</router-link>
        <router-link to="/products?category=chaussures" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Chaussures & Sacs</router-link>
        <router-link to="/products?category=beaute" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Beauté & Parfum</router-link>
        <router-link to="/products?category=bijoux" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Bijoux, Montres & Santé</router-link>
      </div>
    </div>

    <!-- Jeux Vidéo & Jouets -->
    <div class="border dark:border-gray-800 rounded-lg overflow-hidden">
      <button @click="toggleCategory('jeux')" class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
        <span class="flex items-center gap-2"><i class="fas fa-gamepad text-gray-500 dark:text-gray-400 w-5 text-center"></i> Jeux & Jouets</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'jeux' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'jeux'" class="bg-gray-50 dark:bg-gray-950 p-2 space-y-1">
        <router-link to="/products?category=gaming" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Consoles & Jeux Vidéo</router-link>
        <router-link to="/products?category=jouets" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Jouets, LEGO & Société</router-link>
        <router-link to="/products?category=bebe" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Bébé & Puériculture</router-link>
      </div>
    </div>

    <!-- Culture & Livres -->
    <div class="border dark:border-gray-800 rounded-lg overflow-hidden">
      <button @click="toggleCategory('culture')" class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
        <span class="flex items-center gap-2"><i class="fas fa-book text-gray-500 dark:text-gray-400 w-5 text-center"></i> Culture & Livres</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'culture' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'culture'" class="bg-gray-50 dark:bg-gray-950 p-2 space-y-1">
        <router-link to="/products?category=livres" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Livres, Mangas & BD</router-link>
        <router-link to="/products?category=musique" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Musique, DVD & Films</router-link>
        <router-link to="/products?category=instruments" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Instruments de musique</router-link>
      </div>
    </div>

    <!-- Supermarché & Autres -->
    <div class="border dark:border-gray-800 rounded-lg overflow-hidden">
      <button @click="toggleCategory('supermarche')" class="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
        <span class="flex items-center gap-2"><i class="fas fa-shopping-basket text-gray-500 dark:text-gray-400 w-5 text-center"></i> Supermarché & +</span>
        <i class="fas transition-transform duration-300" :class="expandedCategory === 'supermarche' ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div v-show="expandedCategory === 'supermarche'" class="bg-gray-50 dark:bg-gray-950 p-2 space-y-1">
        <router-link to="/products?category=epicerie" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Épicerie, Boissons & Snacks</router-link>
        <router-link to="/products?category=sports" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Sports, Fitness & Camping</router-link>
        <router-link to="/products?category=auto" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Auto, Moto & Brico</router-link>
        <router-link to="/products?category=bureau" @click="$emit('close')" class="block p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-900 rounded pl-9">• Bureau & Papeterie</router-link>
      </div>
    </div>

     <!-- Offres du jour -->
    <router-link to="/products?promotions=true" @click="$emit('close')" class="flex items-center justify-center p-3 rounded-lg bg-gray-900 dark:bg-blue-600 text-white font-medium hover:bg-black dark:hover:bg-blue-700 transition-colors mt-4">
       Offres du jour
     </router-link>

    <!-- Logout Button -->
    <div v-if="authStore.isAuthenticated" class="pt-6 border-t border-gray-100 dark:border-gray-800 mt-6 pb-8">
       <button @click="handleLogout" class="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-800 shadow-sm">
         <i class="fas fa-sign-out-alt text-lg"></i> 
         <span>Se déconnecter</span>
       </button>
    </div>
    <div v-else class="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
       <router-link to="/login" @click="$emit('close')" class="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
         <i class="fas fa-sign-in-alt"></i> Se connecter
       </router-link>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { useWishlistStore } from '@/stores/wishlist'

const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()
const wishlistStore = useWishlistStore()
const router = useRouter()
const expandedCategory = ref('')

const isSeller = computed(() => {
  return authStore.customer?.role === 'seller' || authStore.customer?.role === 'admin'
})

const emit = defineEmits(['close'])

const toggleCategory = (category: string) => {
  if (expandedCategory.value === category) {
    expandedCategory.value = ''
  } else {
    expandedCategory.value = category
  }
}

const handleLogout = async () => {
    try {
        await authStore.logout()
        emit('close')
        router.push('/')
    } catch (error) {
        console.error("Logout failed", error)
    }
}
</script>
