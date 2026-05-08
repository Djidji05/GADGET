<template>
<div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Loading State -->
      <div v-if="isLoading" class="animate-pulse space-y-8">
        <div class="h-12 bg-gray-200 rounded-lg w-2/3 mx-auto"></div>
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20 bg-white rounded-2xl shadow-sm">
        <div class="text-6xl mb-6 text-gray-200">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Page non trouvée</h1>
        <p class="text-gray-500 mb-8">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        <router-link to="/" class="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors inline-block">
          Retour à l'accueil
        </router-link>
      </div>

      <!-- Content -->
      <div v-else class="bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">{{ page.title }}</h1>
        <div class="content-body" v-html="page.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { pagesService } from '@/services/api'

const route = useRoute()
const isLoading = ref(true)
const page = ref<any>(null)
const error = ref(false)

const fetchPage = async () => {
  isLoading.value = true
  error.value = false
  try {
    const slug = route.params.slug as string
    const data = await pagesService.getBySlug(slug)
    if (data && data.isPublished) {
      page.value = data
      // Update page title
      document.title = `${data.metaTitle || data.title} - HTFasil`
    } else {
      error.value = true
    }
  } catch (err) {
    console.error('Error fetching page:', err)
    error.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPage)

// Refetch if the slug changes (navigating between pages)
watch(() => route.params.slug, fetchPage)
</script>

<style scoped>
.content-body {
  @apply text-gray-600 leading-relaxed;
}
.content-body :deep(h1) {
    @apply text-3xl font-bold text-gray-900 mt-8 mb-4;
}
.content-body :deep(h2) {
  @apply text-2xl font-bold text-gray-800 mt-8 mb-4;
}
.content-body :deep(h3) {
  @apply text-xl font-bold text-gray-800 mt-6 mb-3;
}
.content-body :deep(p) {
  @apply mb-4;
}
.content-body :deep(ul) {
  @apply list-disc pl-6 mb-4;
}
.content-body :deep(ol) {
  @apply list-decimal pl-6 mb-4;
}
.content-body :deep(a) {
    @apply text-blue-600 hover:underline;
}
.content-body :deep(img) {
    @apply rounded-xl shadow-md my-8 mx-auto max-w-full;
}
.content-body :deep(blockquote) {
    @apply border-l-4 border-blue-200 pl-4 italic my-6 text-gray-500;
}
</style>
