<template>
<div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-5xl">
      <!-- Header -->
      <div class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-3">Blog HTFasil</h1>
        <p class="text-gray-500 text-lg">Actualités, conseils et nouveautés tech</p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200"></div>
          <div class="p-5 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="posts.length === 0" class="text-center py-20">
        <i class="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-xl">Aucun article publié pour le moment.</p>
        <p class="text-gray-400 mt-2">Revenez bientôt !</p>
      </div>

      <!-- Posts Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="post in posts"
          :key="post.id"
          @click="$router.push(`/blog/${post.id}`)"
          class="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300 group"
        >
          <!-- Cover Image -->
          <div class="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden relative">
            <img
              v-if="post.featuredImage || post.coverImage || post.cover_image"
              :src="getImageUrl(post.featuredImage || post.coverImage || post.cover_image)"
              :alt="post.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="fas fa-newspaper text-4xl text-blue-300"></i>
            </div>
            <!-- Category badge -->
            <span v-if="post.category" class="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {{ post.category }}
            </span>
          </div>

          <!-- Content -->
          <div class="p-5">
            <h2 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {{ post.title }}
            </h2>
            <p class="text-gray-500 text-sm line-clamp-3 mb-4">
              {{ post.excerpt || stripHtml(post.content) }}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-400">
              <span>{{ formatDate(post.createdAt || post.created_at) }}</span>
              <span class="flex items-center gap-1">
                <i class="fas fa-eye"></i> {{ post.views || 0 }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const isLoading = ref(true)
const posts = ref<any[]>([])

const getImageUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://localhost:3003${url}`
}

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''

const stripHtml = (html: string) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').slice(0, 150) + '...'
}

onMounted(async () => {
  try {
    const res = await api.get('/blog')
    posts.value = (res.data.posts || []).filter((p: any) => p.status === 'published')
  } catch {
    posts.value = []
  } finally {
    isLoading.value = false
  }
})
</script>
