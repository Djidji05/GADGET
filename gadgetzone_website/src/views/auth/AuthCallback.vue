<template>
<div class="h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="mb-4">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
      </div>
      <h2 class="text-xl font-semibold text-gray-900">Connexion en cours...</h2>
      <p class="text-gray-500 mt-2">Veuillez patienter pendant que nous vous connectons.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const token = route.query.token as string
  const error = route.query.error as string

  if (token) {
    try {
      // Store token temporarily for the API interceptor
      localStorage.setItem('customer_token', token)
      authStore.token = token
      
      // Fetch user profile to ensure everything is synced
      await authStore.fetchUserProfile()
      
      // Redirect to home or account
      router.push('/')
    } catch (err) {
      console.error('Login Callback Error:', err)
      router.push('/login?error=auth_failed')
    }
  } else if (error) {
    router.push(`/login?error=${error}`)
  } else {
    router.push('/login')
  }
})
</script>
