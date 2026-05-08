<template>
<div class="h-screen bg-white relative overflow-hidden !pb-0">
    <!-- LOGIN FORM -->
    <div class="h-screen flex items-center justify-center bg-gray-50 px-4 py-8 relative z-10 overflow-y-auto !pb-0">
        <div class="absolute top-8 left-8">
            <button @click="goBack" class="text-gray-500 hover:text-gray-900 transition-colors">
                <i class="fas fa-arrow-left text-2xl"></i>
            </button>
        </div>

      <div class="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 md:p-10 animate-fade-in-up">
        
        <!-- Logo/Brand -->
        <div class="mb-8">
          <div class="w-12 h-12 bg-[#0A1A2F] rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
            G
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            {{ is2FAPending ? 'Vérification' : 'Bon retour sur HTFasil !' }}
          </h1>
          <p class="text-gray-500">
            {{ is2FAPending ? `Un code a été envoyé à ${form.email}` : 'Veuillez entrer vos identifiants.' }}
          </p>
        </div>
  
        <!-- 2FA FORM -->
        <form v-if="is2FAPending" @submit.prevent="handle2FAVerify" class="space-y-6">
          <div v-if="error" class="bg-red-50 text-red-500 text-sm p-3 rounded-xl text-center">
            {{ error }}
          </div>

          <div class="space-y-4">
             <div class="relative">
                <input
                  v-model="faCode"
                  type="text"
                  required
                  maxlength="6"
                  class="w-full text-center py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-2xl tracking-[0.5em] font-bold"
                  placeholder="000000"
                />
             </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading || faCode.length < 6"
            class="w-full py-4 bg-[#0A1A2F] text-white rounded-2xl font-bold shadow-lg hover:bg-[#152C45] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <span v-if="isLoading"><i class="fas fa-spinner fa-spin"></i> Vérification...</span>
            <span v-else>Continuer</span>
          </button>

          <button type="button" @click="is2FAPending = false" class="w-full text-sm text-gray-500 hover:underline">
             Annuler
          </button>
        </form>

        <!-- LOGIN FORM -->
        <form v-else @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="error" class="bg-red-50 text-red-500 text-sm p-3 rounded-xl text-center">
            {{ error }}
          </div>
  
          <!-- Email Input -->
          <div class="space-y-4">
            <div>
              <div class="relative">
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full pl-5 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder-gray-400"
                  placeholder="Email"
                />
                <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                   <i class="far fa-envelope"></i>
                </span>
              </div>
            </div>
  
            <!-- Password Input -->
            <div>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full pl-5 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder-gray-400 text-lg tracking-widest"
                  placeholder="Mot de passe"
                />
                 <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                   <i :class="['far', showPassword ? 'fa-eye' : 'fa-eye-slash']"></i>
                </button>
              </div>
            </div>
          </div>
  
          <!-- Forgot Password -->
          <div class="flex justify-end">
            <router-link 
              to="/forgot-password" 
              class="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Mot de passe oublié ?
            </router-link>
          </div>
  
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-4 bg-[#0A1A2F] text-white rounded-2xl font-bold shadow-lg hover:bg-[#152C45] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
               <i class="fas fa-spinner fa-spin"></i> Connexion...
            </span>
            <span v-else>Se connecter</span>
          </button>
  
          <!-- Or Divider -->
          <div class="relative flex py-2 items-center">
              <div class="flex-grow border-t border-gray-200"></div>
              <span class="flex-shrink-0 mx-4 text-gray-400 text-sm">Ou connectez-vous avec</span>
              <div class="flex-grow border-t border-gray-200"></div>
          </div>
  
          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-4">
             <a href="http://localhost:3003/api/auth/google" class="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
                <i class="fab fa-google text-xl text-red-500"></i>
                <span class="font-medium text-gray-700">Google</span>
             </a>
             <a href="http://localhost:3003/api/auth/facebook" class="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
                <i class="fab fa-facebook text-xl text-blue-600"></i>
                <span class="font-medium text-gray-700">Facebook</span>
             </a>
          </div>
  
          <!-- Sign Up Link -->
          <div class="text-center mt-6">
             <p class="text-gray-500 text-sm">
                Pas encore de compte ? 
                <router-link to="/register" class="font-semibold text-[#0A1A2F] hover:underline">
                   S'inscrire
                </router-link>
             </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(false)
const error = ref('')
const form = ref({
  email: '',
  password: '',
})
const showPassword = ref(false)

// 2FA State
const is2FAPending = ref(false)
const faCode = ref('')

const handleLogin = async () => {
  try {
    isLoading.value = true
    error.value = ''
    const response = await authStore.login(form.value.email, form.value.password)
    
    if ((response as any).require2FA) {
      is2FAPending.value = true
      return
    }

    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Échec de la connexion'
  } finally {
    isLoading.value = false
  }
}

const handle2FAVerify = async () => {
  try {
    isLoading.value = true
    error.value = ''
    await authStore.verify2FA(form.value.email, faCode.value)
    
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Code invalide'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  if (window.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
