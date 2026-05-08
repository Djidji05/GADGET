<template>
<div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-3xl">
      <!-- Back -->
      <button @click="$router.push('/blog')" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 text-sm font-medium">
        <i class="fas fa-arrow-left"></i> Retour au blog
      </button>

      <!-- Loading -->
      <div v-if="isLoading" class="bg-white rounded-2xl shadow-sm p-8 animate-pulse space-y-4">
        <div class="h-8 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
        <div class="h-64 bg-gray-200 rounded-xl"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>

      <!-- Not found -->
      <div v-else-if="!post" class="text-center py-20">
        <i class="fas fa-exclamation-circle text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-xl">Article introuvable.</p>
      </div>

      <!-- Article -->
      <article v-else class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <!-- Cover -->
        <div v-if="post.featuredImage || post.coverImage || post.cover_image" class="h-64 md:h-80 overflow-hidden">
          <img :src="getImageUrl(post.featuredImage || post.coverImage || post.cover_image)" :alt="post.title" class="w-full h-full object-cover" />
        </div>

        <div class="p-8">
          <!-- Category & Date -->
          <div class="flex items-center gap-3 mb-4">
            <span v-if="post.category" class="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              {{ post.category }}
            </span>
            <span class="text-gray-400 text-sm">{{ formatDate(post.createdAt || post.created_at) }}</span>
            <span class="text-gray-400 text-sm flex items-center gap-1">
              <i class="fas fa-eye text-xs"></i> {{ post.views || 0 }} vues
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl font-bold text-gray-900 mb-6 leading-tight">{{ post.title }}</h1>

          <!-- Content -->
          <div class="prose max-w-none text-gray-700 leading-relaxed" v-html="post.content"></div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const isLoading = ref(true)
const post = ref<any>(null)

const getImageUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://localhost:3003${url}`
}

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''

onMounted(async () => {
  try {
    const res = await api.get(`/blog/${route.params.id}`)
    post.value = res.data
    
    // Incrémenter les vues
    api.post(`/blog/${route.params.id}/view`).catch(err => {
      console.warn('Erreur lors de l\'incrémentation des vues:', err)
    })
  } catch {
    post.value = null
  } finally {
    isLoading.value = false
  }
})
</script>
