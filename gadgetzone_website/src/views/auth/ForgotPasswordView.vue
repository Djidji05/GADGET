<template>
<div class="min-h-screen pt-[120px] pb-12 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
    <div class="w-full max-w-md space-y-8 animate-fadeIn">
      <!-- Header -->
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Mot de passe oublié ?
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white dark:bg-gray-900 py-8 px-4 shadow-xl shadow-blue-50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-800">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          
          <div v-if="successMessage" class="rounded-md bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 p-4 animate-fade-in-down">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="fas fa-check-circle text-green-400"></i>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800 dark:text-green-300">{{ successMessage }}</p>
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="rounded-md bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-4 animate-fade-in-down">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="fas fa-times-circle text-red-400"></i>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800 dark:text-red-300">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"> Adresse email </label>
            <div class="mt-1 relative">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 pl-10 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:text-white sm:text-sm transition-colors"
                placeholder="vous@exemple.com"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="las la-envelope text-gray-400 text-xl"></i>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
            >
              <i v-if="isLoading" class="las la-spinner la-spin text-xl mr-2"></i>
              <span v-else>Envoyer le lien de réinitialisation</span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
                <router-link to="/login" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center justify-center gap-1">
                    <i class="las la-arrow-left"></i> Retour à la connexion
                </router-link>
            </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api' // Using standard API service

const email = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  if (!email.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // This endpoint handles the logic. If it doesn't exist, we'll need to create it.
    // Assuming a standard auth flow: /auth/forgot-password
    await api.post('/auth/forgot-password', { email: email.value })
    successMessage.value = "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation."
    email.value = '' // Clear input
  } catch (error: any) {
    console.error('Forgot password error:', error)
    // Generic error message for security, or specific if needed
    errorMessage.value = "Une erreur est survenue. Veuillez réessayer plus tard."
  } finally {
    isLoading.value = false
  }
}
</script>
