<template>
<footer class="bg-gray-900 text-gray-300 mt-auto font-sans pb-24 md:pb-0">
    <!-- Newsletter Section -->
    <div class="border-b border-gray-800 bg-gray-800/50">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i class="fas fa-envelope text-white text-xl"></i>
            </div>
            <div>
              <h3 class="text-white text-lg font-bold">{{ $t('footer.newsletter_title') }}</h3>
              <p class="text-sm text-gray-400">{{ $t('footer.newsletter_subtitle') }}</p>
            </div>
          </div>
          <div class="w-full md:w-auto flex-1 max-w-md">
            <div class="relative">
              <input 
                v-model="newsletterEmail"
                type="email" 
                :placeholder="$t('footer.email_placeholder')" 
                @keyup.enter="subscribeNewsletter"
                class="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
              <button 
                @click="subscribeNewsletter"
                :disabled="isSubscribing"
                class="absolute right-1 top-1 bottom-1 bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubscribing ? $t('footer.subscribing') : $t('footer.subscribe') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Brand Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i class="fas fa-bolt text-white text-xl"></i>
            </div>
            <span class="text-2xl font-bold text-white tracking-tight">HTFasil</span>
          </div>
          <p class="text-gray-400 leading-relaxed">
            {{ $t('footer.description') }}
          </p>
          <div class="flex gap-4">
            <a href="https://www.tiktok.com/@htfasilhightech" target="_blank" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 group">
              <i class="fab fa-tiktok text-lg group-hover:scale-110 transition-transform"></i>
            </a>
            <a href="https://wa.me/50941393544" target="_blank" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all duration-300 group">
              <i class="fab fa-whatsapp text-lg group-hover:scale-110 transition-transform"></i>
            </a>
            <a href="https://www.instagram.com/htfasilhightech" target="_blank" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 group">
              <i class="fab fa-instagram text-lg group-hover:scale-110 transition-transform"></i>
            </a>
          </div>
        </div>

        <!-- Shop Links -->
        <div>
          <h4 class="text-white text-lg font-bold mb-6 relative inline-block">
            {{ $t('footer.shop') }}
            <span class="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
          </h4>
          <ul class="space-y-3">
            <li>
              <router-link to="/products?category=high-tech" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('nav.cat_hitech') }}
              </router-link>
            </li>
            <li>
              <router-link to="/products?category=maison" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('nav.cat_maison') }}
              </router-link>
            </li>
            <li>
              <router-link to="/products?category=mode" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('nav.cat_mode') }}
              </router-link>
            </li>
            <li>
              <router-link to="/products?category=jeux-jouets" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('nav.cat_jeux') }}
              </router-link>
            </li>
            <li>
              <router-link to="/products?category=culture" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('nav.cat_culture') }}
              </router-link>
            </li>
            <li>
              <router-link to="/products?category=autres" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('nav.cat_super') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Support Links -->
        <div>
          <h4 class="text-white text-lg font-bold mb-6 relative inline-block">
            {{ $t('footer.support') }}
            <span class="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
          </h4>
          <ul class="space-y-3">
            <li>
              <router-link to="/account" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('nav.your_account') }}
              </router-link>
            </li>
            <li>
              <router-link to="/orders" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('nav.your_orders') }}
              </router-link>
            </li>
            <li>
              <router-link to="/wishlist" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('nav.your_wishlist') }}
              </router-link>
            </li>
            <li>
              <router-link to="/notifications" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('nav.your_notifications') }}
              </router-link>
            </li>
            <li>
              <router-link to="/addresses" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('nav.your_addresses') }}
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('common.about') || 'À Propos' }}
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('common.contact') || 'Contact' }}
              </router-link>
            </li>
            <li>
              <router-link to="/faq" class="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <i class="fas fa-chevron-right text-xs text-gray-600 group-hover:text-blue-500 transition-colors"></i>
                {{ $t('common.faq') || 'FAQ' }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h4 class="text-white text-lg font-bold mb-6 relative inline-block">
            {{ $t('footer.contact_us') }}
            <span class="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
          </h4>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0 text-blue-500">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <span>Cap-Haitien<br>Ouanaminthe, Haïti</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0 text-blue-500">
                <i class="fas fa-phone-alt"></i>
              </div>
              <span class="font-semibold text-white">+509 41 39 35 44</span>
            </li>
            <li class="flex items-center gap-3">
              <div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0 text-blue-500">
                <i class="fas fa-envelope"></i>
              </div>
              <span class="hover:text-blue-400 transition-colors cursor-pointer">htfasil308@gmail.com</span>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0 text-blue-500">
                <i class="fas fa-clock"></i>
              </div>
              <span class="text-sm">
                {{ $t('footer.working_days') }}<br>
                {{ $t('footer.weekend') }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800 bg-gray-950">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-500">
            {{ $t('footer.rights') }}
          </p>
          
          <!-- Payment Icons -->
          <div class="flex items-center gap-3 text-2xl">
            <div class="bg-white px-2 py-1 rounded h-8 flex items-center text-[#1A1F71]">
              <i class="fab fa-cc-visa"></i>
            </div>
            <div class="bg-white px-2 py-1 rounded h-8 flex items-center text-[#EB001B]">
              <i class="fab fa-cc-mastercard"></i>
            </div>
            <div class="bg-white px-2 py-1 rounded h-8 flex items-center">
              <span class="text-xs font-bold text-gray-800">{{ $t('footer.moncash') }}</span>
            </div>
            <div class="bg-white px-2 py-1 rounded h-8 flex items-center">
              <span class="text-xs font-bold text-gray-800">{{ $t('footer.natcash') }}</span>
            </div>
          </div>

          <div class="flex gap-6 text-sm">
            <router-link to="/privacy" class="text-gray-500 hover:text-white transition-colors">{{ $t('footer.privacy') }}</router-link>
            <router-link to="/terms" class="text-gray-500 hover:text-white transition-colors">{{ $t('footer.terms') }}</router-link>
            <router-link to="/faq" class="text-gray-500 hover:text-white transition-colors">{{ $t('common.faq') || 'FAQ' }}</router-link>
            <router-link to="/sitemap" class="text-gray-500 hover:text-white transition-colors">{{ $t('footer.sitemap') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { newsletterService } from '@/services/newsletter'
import { useUiStore } from '@/stores/ui'

const newsletterEmail = ref('')
const isSubscribing = ref(false)
const uiStore = useUiStore()

const subscribeNewsletter = async () => {
  if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) {
    uiStore.showToast('Veuillez entrer une adresse email valide', 'warning')
    return
  }

  try {
    isSubscribing.value = true
    
    const response = await newsletterService.subscribe(newsletterEmail.value)
    uiStore.showToast(response.message, 'success')
    newsletterEmail.value = ''
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error)
    const message = error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
    uiStore.showToast(message, 'error')
  } finally {
    isSubscribing.value = false
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
