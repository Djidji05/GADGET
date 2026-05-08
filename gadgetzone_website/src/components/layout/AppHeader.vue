<template>
<header class="sticky top-0 z-50 bg-white shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Mobile Auth Header -->
        <div v-if="isAuthenticated" class="md:hidden flex flex-col w-full py-2">
          <!-- Line 1: Avatar / Name + Cart -->
          <div class="flex items-center justify-between w-full mb-3">
            <!-- Left: Avatar + Greeting -->
            <div class="flex items-center space-x-3">
              <div class="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-200">
                <img
                  :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=random`"
                  alt="Avatar"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">{{ authStore.isFirstLogin ? 'Bienvenue sur HTFasil' : 'Bon retour sur HTFasil' }}</span>
                <span class="font-semibold text-gray-900 text-sm leading-tight">{{ customerName }}</span>
              </div>
            </div>

            <!-- Right: Cart -->
            <router-link
              to="/cart"
              class="relative p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <i class="fas fa-shopping-cart text-xl"></i>
              <span
                v-if="itemCount > 0"
                class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ itemCount }}
              </span>
            </router-link>
          </div>

          <!-- Line 2: Search + Settings -->
          <div class="flex items-center w-full">
            <!-- Search Bar (Grow) -->
            <div class="relative flex-grow">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                :placeholder="$t('products.search')"
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-gray-50"
              />
              <button
                @click="handleSearch"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i class="fas fa-search"></i>
              </button>
            </div>

            <!-- Settings Button -->
            <router-link
              to="/account"
              class="ml-3 p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-full hover:bg-gray-100 flex-shrink-0"
            >
              <i class="fas fa-cog text-xl"></i>
            </router-link>
          </div>
        </div>

        <!-- Logo (Desktop or Guest Mobile) -->
        <router-link
          v-if="!isAuthenticated"
          to="/"
          class="flex items-center space-x-2"
        >
          <div v-if="settingsStore.logoUrl && settingsStore.general.site_logo" class="h-8 md:h-10">
            <img :src="settingsStore.logoUrl" alt="Logo" class="h-full w-auto object-contain" />
          </div>
          <template v-else>
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-store text-white text-xl"></i>
            </div>
            <span class="text-xl font-bold text-gray-900">{{ settingsStore.general.site_name || 'HTFasil' }}</span>
          </template>
        </router-link>
        <!-- Logo (Desktop Only when Authenticated) -->
        <router-link
          v-else
          to="/"
          class="hidden md:flex items-center space-x-2"
        >
          <div v-if="settingsStore.logoUrl && settingsStore.general.site_logo" class="h-10">
            <img :src="settingsStore.logoUrl" alt="Logo" class="h-full w-auto object-contain" />
          </div>
          <template v-else>
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-store text-white text-xl"></i>
            </div>
            <span class="text-xl font-bold text-gray-900">{{ settingsStore.general.site_name || 'HTFasil' }}</span>
          </template>
        </router-link>

        <!-- Search Bar (Desktop) -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              :placeholder="$t('products.search')"
              class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              @click="handleSearch"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <!-- Navigation Links -->
          <router-link
            to="/products"
            class="text-gray-700 hover:text-primary-600 transition-colors"
          >
            Produits
          </router-link>
          <router-link to="/about" class="text-gray-700 hover:text-primary-600 transition-colors">
            À Propos
          </router-link>
          <router-link to="/contact" class="text-gray-700 hover:text-primary-600 transition-colors">
            Contact
          </router-link>

          <!-- Cart -->
          <router-link
            to="/cart"
            class="relative flex items-center text-gray-700 hover:text-primary-600 transition-colors p-2"
          >
            <i class="fas fa-shopping-cart text-xl"></i>
            <span
              v-if="itemCount > 0"
              class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ itemCount }}
            </span>
          </router-link>

          <!-- Account -->
          <div v-if="isAuthenticated" class="relative">
            <button
              @click="toggleAccountMenu"
              class="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <i class="fas fa-user text-xl"></i>
              <span class="hidden md:inline">{{ customerName }}</span>
              <i class="fas fa-chevron-down text-xs"></i>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showAccountMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            >
              <router-link
                to="/account"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="showAccountMenu = false"
              >
                <i class="fas fa-user mr-2"></i>Mon Compte
              </router-link>
              <router-link
                to="/orders"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="showAccountMenu = false"
              >
                <i class="fas fa-box mr-2"></i>Mes Commandes
              </router-link>
              <hr class="my-2" />
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <i class="fas fa-sign-out-alt mr-2"></i>Déconnexion
              </button>
            </div>
          </div>

          <!-- Login/Register -->
          <div v-else class="flex items-center space-x-4">
            <router-link to="/login" class="text-gray-700 hover:text-primary-600 transition-colors">
              Connexion
            </router-link>
            <router-link to="/register" class="btn-primary"> Inscription </router-link>
          </div>
        </nav>

        <!-- Mobile Navigation (Unauthenticated Only) -->
        <nav v-if="!isAuthenticated" class="md:hidden flex items-center space-x-4">
          <!-- Mobile Cart -->
          <router-link
            to="/cart"
            class="relative flex items-center text-gray-700 hover:text-primary-600 transition-colors p-2"
          >
            <i class="fas fa-shopping-cart text-xl"></i>
            <span
              v-if="itemCount > 0"
              class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ itemCount }}
            </span>
          </router-link>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="text-gray-700 hover:text-primary-600 transition-colors p-2"
          >
            <i class="fas fa-bars text-xl"></i>
          </button>
        </nav>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200 py-4">
        <div class="space-y-3">
          <router-link
            to="/products"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            @click="showMobileMenu = false"
          >
            <i class="fas fa-shopping-bag mr-2"></i>Produits
          </router-link>
          <router-link
            to="/about"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            @click="showMobileMenu = false"
          >
            <i class="fas fa-info-circle mr-2"></i>À Propos
          </router-link>
          <router-link
            to="/contact"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            @click="showMobileMenu = false"
          >
            <i class="fas fa-envelope mr-2"></i>Contact
          </router-link>

          <!-- Mobile Auth -->
          <div v-if="isAuthenticated" class="border-t border-gray-200 pt-3">
            <router-link
              to="/account"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-user mr-2"></i>Mon Compte
            </router-link>
            <router-link
              to="/orders"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-box mr-2"></i>Mes Commandes
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>Déconnexion
            </button>
          </div>
          <div v-else class="border-t border-gray-200 pt-3 space-y-2">
            <router-link
              to="/login"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>Connexion
            </router-link>
            <router-link
              to="/register"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-user-plus mr-2"></i>Inscription
            </router-link>
          </div>
        </div>
      </div>

      <!-- Mobile Search -->
      <div class="md:hidden pb-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Rechercher des produits..."
            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            @click="handleSearch"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.fetchGeneralSettings()
})

// State
const searchQuery = ref('')
const showAccountMenu = ref(false)
const showMobileMenu = ref(false)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const customerName = computed(() => authStore.customerName)
const itemCount = computed(() => cartStore.itemCount)

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'products',
      query: { search: searchQuery.value.trim() },
    })
  }
}

const toggleAccountMenu = () => {
  showAccountMenu.value = !showAccountMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleLogout = async () => {
  await authStore.logout()
  showAccountMenu.value = false
  router.push('/')
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    showAccountMenu.value = false
    showMobileMenu.value = false
  }
})
</script>
