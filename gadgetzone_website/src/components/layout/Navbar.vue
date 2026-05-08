<template>
<header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    <div class="container mx-auto px-4">
      <!-- Desktop Layout -->
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <img src="/images/logo.png" alt="HTFasil Logo" class="h-8 w-auto" />
        </router-link>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link
            to="/"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            :class="{ 'text-primary-600': $route.path === '/' }"
          >
            Accueil
          </router-link>
          <router-link
            to="/products"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            :class="{ 'text-primary-600': $route.path === '/products' }"
          >
            Produits
          </router-link>
          <router-link
            to="/categories"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
          >
            Catégories
          </router-link>
          <router-link
            to="/promotions"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
          >
            Promotions
          </router-link>
          <router-link
            to="/about"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
          >
            À Propos
          </router-link>
          <router-link
            to="/contact"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
          >
            Contact
          </router-link>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- Search Bar -->
          <div class="hidden lg:flex items-center">
            <div class="relative">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                :placeholder="$t('products.search')"
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400 text-sm"></i>
              </div>
            </div>
          </div>

          <!-- Cart Icon -->
          <router-link
            to="/cart"
            class="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
          >
            <i class="fas fa-shopping-cart text-xl"></i>
            <span
              v-if="cartItemCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartItemCount }}
            </span>
          </router-link>

          <!-- User Account -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <i class="fas fa-user-circle text-xl"></i>
              <span class="hidden md:block text-sm font-medium">Compte</span>
            </button>

            <!-- User Dropdown -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mon Profil
              </router-link>
              <router-link
                to="/orders"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mes Commandes
              </router-link>
              <hr class="my-1" />
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Déconnexion
              </button>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 text-gray-700 hover:text-primary-600"
          >
            <i class="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 bg-white">
        <div class="px-4 py-2 space-y-1">
          <router-link
            to="/"
            class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md font-medium"
            @click="closeMobileMenu"
          >
            Accueil
          </router-link>
          <router-link
            to="/products"
            class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md font-medium"
            @click="closeMobileMenu"
          >
            Produits
          </router-link>
          <router-link
            to="/categories"
            class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md font-medium"
            @click="closeMobileMenu"
          >
            Catégories
          </router-link>
          <router-link
            to="/promotions"
            class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md font-medium"
            @click="closeMobileMenu"
          >
            Promotions
          </router-link>
          <router-link
            to="/about"
            class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md font-medium"
            @click="closeMobileMenu"
          >
            À Propos
          </router-link>
          <router-link
            to="/contact"
            class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md font-medium"
            @click="closeMobileMenu"
          >
            Contact
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Router
const router = useRouter()
const route = useRoute()

// State
const searchQuery = ref('')
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const cartItemCount = ref(0)

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/products?search=${encodeURIComponent(searchQuery.value)}`)
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleLogout = () => {
  // Logique de déconnexion
  showUserMenu.value = false
  router.push('/login')
}

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
