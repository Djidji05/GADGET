<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AIAssistant from '@/components/ui/AIAssistant.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import SellerBottomNav from '@/components/layout/SellerBottomNav.vue'
import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import { useAuthStore } from '@/stores/auth'
import { usePersonalizationStore } from '@/stores/personalization'
import { useHistoryStore } from '@/stores/history'
import { useDevice } from '@/composables/useDevice'
import { useUiStore } from '@/stores/ui'
import GlobalToastContainer from '@/components/ui/GlobalToastContainer.vue'
import GlobalModal from '@/components/ui/GlobalModal.vue'

const authStore = useAuthStore()
const personalizationStore = usePersonalizationStore()
const historyStore = useHistoryStore()
const route = useRoute()
const uiStore = useUiStore()
const isScrolled = ref(false)

// Device detection
const { isMobile, isTablet, isDesktop } = useDevice()

// Check if current route is an auth page
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register' || route.path === '/forgot-password' || route.path === '/reset-password'
})

// Check if current route is a seller page
const isSellerPage = computed(() => {
  return route.path.startsWith('/seller')
})

// Check if current route is the checkout page
const isCheckoutPage = computed(() => {
  return route.path === '/checkout'
})

// Check if current route is the order detail page
const isOrderDetailPage = computed(() => {
  return route.name === 'order-detail'
})

// Check if current route is the maintenance page
const isMaintenancePage = computed(() => {
  return route.name === 'maintenance'
})

// Check if footer should be shown
const shouldShowFooter = computed(() => {
  // Always hide on auth, seller, checkout and maintenance pages
  if (isAuthPage.value || isSellerPage.value || isCheckoutPage.value || isMaintenancePage.value) return false
  
  // Hide on mobile for specific pages requested (Orders, Cart, Account)
  if (isMobile.value) {
    const isCart = route.name === 'cart'
    const isOrders = route.name === 'orders' || route.name === 'order-detail'
    const isAccount = ['account', 'addresses', 'wishlist', 'notifications', 'browsing-history'].includes(route.name as string)
    
    if (isCart || isOrders || isAccount) return false
  }
  
  return true
})


// Gérer le scroll pour le navbar
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// PWA Install Prompt State
const deferredPrompt = ref<any>(null)
const showInstallPrompt = ref(false)

const installApp = async () => {
    if (!deferredPrompt.value) return;
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    if (outcome === 'accepted') {
        showInstallPrompt.value = false;
    }
    deferredPrompt.value = null;
}

import { statsService } from '@/services/api'

// Initialize auth on app load
onMounted(() => {
  authStore.initAuth()
  historyStore.init()
  personalizationStore.loadAds()
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Vérifier la position initiale

  // Analytics: Enregistrer la visite
  statsService.track({
    path: route.path,
    referrer: document.referrer || 'Direct'
  })
  
  // Handle PWA Installation
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA avant l\'installation (beforeinstallprompt) interceptée.');
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallPrompt.value = true;
  });
  
  // Inactivity tracking (24h)
  setupInactivityTracking()

  // Periodic Profile Refresh (every 5 minutes) as a safety net for role changes
  const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes
  const refreshTimer = setInterval(() => {
    if (authStore.isAuthenticated) {
      authStore.fetchUserProfile().catch(() => { /* silent error */ })
    }
  }, REFRESH_INTERVAL)
  
  // Cleanup on unmount (App.vue rarely unmounts, but good practice)
  return () => {
    window.removeEventListener('scroll', handleScroll)
    clearInterval(refreshTimer)
  }
})

const setupInactivityTracking = () => {
  const INACTIVITY_LIMIT = 6 * 60 * 60 * 1000 // 6 hours
  let activityTimer: number | undefined

  const resetActivity = () => {
    localStorage.setItem('lastActivity', Date.now().toString())
  }

  const checkInactivity = () => {
    const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0', 10)
    if (lastActivity && Date.now() - lastActivity > INACTIVITY_LIMIT) {
      if (authStore.isAuthenticated) {
        authStore.logout()
        // Optional: Redirect to login or show message
        // window.location.href = '/login' 
      }
    }
  }

  // Events to track
  const events = ['mousedown', 'keydown', 'touchstart', 'scroll']
  events.forEach(event => {
    window.addEventListener(event, () => {
      resetActivity()
      // Optional: Debounce strictly if needed, but simple reset is usually fine for local storage if not spamming it too hard.
      // Actually, writing to LS on every scroll is bad performance. Let's throttle it.
    }, { passive: true })
  })
  
  // Throttle wrapper for resetActivity to avoid excessive LS writes
  let throttleTimer: number | undefined
  const throttledReset = () => {
    if (!throttleTimer) {
        resetActivity()
        throttleTimer = window.setTimeout(() => throttleTimer = undefined, 1000)
    }
  }
  
  // Remove old listeners and add throttled ones
  events.forEach(event => {
    window.removeEventListener(event, resetActivity as any) // Cleanup potential previous (none here but good practice)
    window.addEventListener(event, throttledReset, { passive: true })
  })

  // Check immediately
  checkInactivity()

  // Periodic check
  setInterval(checkInactivity, 60000) // Check every minute
}
</script>

<template>
<div class="min-h-screen flex flex-col bg-gray-50">
    <!-- PWA Install Banner -->
    <div v-if="showInstallPrompt && route.name === 'home' && !isMaintenancePage" class="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-md relative z-50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-xl shadow-sm border border-blue-500 overflow-hidden flex items-center justify-center text-blue-600 font-black text-xl">
          <!-- Logo Placeholder -->
          HT
        </div>
        <div>
          <h4 class="font-bold text-sm leading-tight">HTFasil E-commerce</h4>
          <p class="text-xs text-blue-100">Rapide, léger et sécurisé</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="installApp" class="bg-white text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm hover:scale-105 transition-transform uppercase tracking-wider">
          Installer
        </button>
        <button @click="showInstallPrompt = false" class="text-white hover:text-blue-200">
          <i class="las la-times ml-2 text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Show announcement bar only on the home page -->
    <AnnouncementBar v-if="route.name === 'home' && !isAuthPage && !isSellerPage && !isCheckoutPage && !isMaintenancePage" />
    <AppNavbar v-if="!isAuthPage && !isSellerPage && !isCheckoutPage && !isMaintenancePage" :transparent="!isScrolled" />

    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Show footer conditionally -->
    <AppFooter v-if="shouldShowFooter" />
    
    <!-- Bottom Navigation (hidden on auth, seller and checkout pages) -->
    <BottomNav v-if="!isAuthPage && !isSellerPage && !isCheckoutPage && !isOrderDetailPage && !route.meta.hideBottomNav" />
    <SellerBottomNav v-if="isSellerPage && uiStore.isSellerNavVisible && !route.meta.hideBottomNav" />

    <!-- Global UI Components -->
    <GlobalToastContainer />
    <GlobalModal />
    
    <!-- AI Assistant -->
    <AIAssistant />
  </div>
</template>

<style>
/* Import Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Mobile padding for bottom nav */
  /* Removed global padding-bottom to fix gray strip */

/* Custom animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Focus styles */
.focus-ring:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading states */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
