<template>
<div class="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8 overflow-y-auto !pb-0">
    <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-10 my-auto border dark:border-gray-800">
      
      <!-- Back Button -->
      <div class="absolute top-8 left-8">
        <button @click="goBack" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <i class="fas fa-arrow-left text-2xl"></i>
        </button>
      </div>

      <!-- Logo/Brand -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Créer un compte</h1>
        <p class="text-gray-500 dark:text-gray-400">Inscrivez-vous pour commencer !</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div v-if="error" class="bg-red-50 text-red-500 text-sm p-3 rounded-xl text-center">
          {{ error }}
        </div>

        <div class="grid grid-cols-2 gap-4">
            <!-- First Name -->
            <div class="relative">
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="w-full pl-5 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Prénom"
              />
              <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                 <i class="far fa-user"></i>
              </span>
            </div>

            <!-- Last Name -->
            <div class="relative">
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="w-full pl-5 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Nom"
              />
            </div>
        </div>

        <!-- Email Input -->
        <div class="relative">
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full pl-5 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Email"
          />
          <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
             <i class="far fa-envelope"></i>
          </span>
        </div>

        <!-- Phone Input -->
        <div class="relative">
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            required
            class="w-full pl-5 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Téléphone"
          />
          <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
             <i class="fas fa-phone-alt"></i>
          </span>
        </div>

         <!-- Password Input -->
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="w-full pl-5 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500 text-lg tracking-widest"
            placeholder="Mot de passe"
          />
           <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none">
             <i :class="['far', showPassword ? 'fa-eye' : 'fa-eye-slash']"></i>
          </button>
        </div>
        
        <!-- Confirm Password Input -->
        <div class="relative">
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            class="w-full pl-5 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500 text-lg tracking-widest"
            placeholder="Confirmer le mot de passe"
          />
           <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none">
             <i :class="['far', showConfirmPassword ? 'fa-eye' : 'fa-eye-slash']"></i>
          </button>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-4 bg-[#0A1A2F] text-white rounded-2xl font-bold shadow-lg hover:bg-[#152C45] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
             <i class="fas fa-spinner fa-spin"></i> Création...
          </span>
          <span v-else>S'inscrire</span>
        </button>

        <!-- Or Divider -->
        <div class="relative flex py-2 items-center">
            <div class="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            <span class="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-sm">Ou inscrivez-vous avec</span>
            <div class="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-4">
           <a href="http://localhost:3003/api/auth/google" class="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <i class="fab fa-google text-xl text-red-500"></i>
              <span class="font-medium text-gray-700 dark:text-gray-300">Google</span>
           </a>
           <a href="http://localhost:3003/api/auth/facebook" class="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <i class="fab fa-facebook text-xl text-blue-600"></i>
              <span class="font-medium text-gray-700 dark:text-gray-300">Facebook</span>
           </a>
        </div>

        <!-- Sign In Link -->
        <div class="text-center mt-6">
           <p class="text-gray-500 dark:text-gray-400 text-sm">
              Déjà un compte ? 
              <router-link to="/login" class="font-semibold text-[#0A1A2F] dark:text-white hover:underline">
                 Se connecter
              </router-link>
           </p>
        </div>
      </form>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const error = ref('')
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const isFormValid = computed(() => {
    return form.value.firstName && form.value.lastName && form.value.email && 
           form.value.phone && form.value.password && form.value.confirmPassword && 
           form.value.password === form.value.confirmPassword
})

const handleRegister = async () => {
  if (!isFormValid.value) {
      error.value = "Veuillez remplir tous les champs correctement"
      return
  }
  
  try {
    isLoading.value = true
    error.value = ''
    await authStore.register({
      email: form.value.email,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone
    })
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.message || "Échec de l'inscription"
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
