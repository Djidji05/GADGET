<template>
  <div class="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10 pb-24 animate-fadeIn">
    <!-- Breadcrumb -->
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i class="las la-pen-nib text-blue-600 text-3xl"></i>
          {{ isEdit ? 'Modifier l\'Article' : 'Nouvel Article' }}
        </h2>
        <p class="text-xs text-gray-500 mt-1">Rédigez ou éditez le contenu et configurez la visibilité de l'article sur la Marketplace.</p>
      </div>

      <nav>
        <ol class="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <li>
            <router-link class="hover:text-blue-650" to="/marketing/blog">Blog</router-link>
          </li>
          <li class="text-gray-400">/</li>
          <li class="text-blue-600 font-bold">{{ isEdit ? 'Modifier' : 'Nouveau' }}</li>
        </ol>
      </nav>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Left Column: Article Form -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <h3 class="font-bold text-gray-900 dark:text-white">
              Contenu de l'article
            </h3>
          </div>
          <form @submit.prevent="savePost">
            <div class="p-6 space-y-5">
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Titre de l'article *
                </label>
                <input
                  v-model="post.title"
                  type="text"
                  placeholder="Ex: Top 10 des gadgets high-tech incontournables de 2026"
                  required
                  class="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 px-5 text-sm font-semibold outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Image de couverture (Optionnelle)
                </label>
                <div class="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleFileUpload"
                    class="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer outline-none dark:file:bg-blue-950/35 dark:file:text-blue-450"
                  />
                  <div v-if="uploading" class="h-5 w-5 animate-spin rounded-full border-2 border-blue-650 border-t-transparent shrink-0"></div>
                </div>
                <p class="mt-1 text-xs text-gray-400">Format recommandé : JPG, PNG (Max 5Mo). Ratio : 16:9 recommandé.</p>
              </div>

              <div>
                <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                  Corps de l'article *
                </label>
                <textarea
                  v-model="post.content"
                  rows="14"
                  placeholder="Rédigez votre article ici..."
                  required
                  class="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/30 py-3 px-5 text-sm outline-none focus:border-blue-500 transition-all resize-y font-sans leading-relaxed"
                ></textarea>
              </div>

              <div class="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="submit"
                  :disabled="loading"
                  class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-sm"
                >
                  <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <i v-else class="las la-save text-lg"></i>
                  {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
                <button
                  type="button"
                  @click="$router.push('/marketing/blog')"
                  class="px-6 py-3 border border-gray-200 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Column: Settings & Preview -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <h3 class="font-bold text-gray-900 dark:text-white">
              Paramètres & Statut
            </h3>
          </div>
          <div class="p-6 space-y-5">
            <div>
              <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                Statut de publication
              </label>
              <select
                v-model="post.status"
                class="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 px-5 text-sm font-semibold outline-none focus:border-blue-500 transition"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>

            <div>
              <label class="mb-2 block text-sm font-bold text-gray-750 dark:text-gray-350">
                Aperçu de la couverture
              </label>
              <div v-if="post.featuredImage" class="relative block h-40 w-full overflow-hidden rounded-xl border border-gray-150 dark:border-gray-800 bg-gray-100">
                <img :src="getImageUrl(post.featuredImage)" alt="Preview" class="h-full w-full object-cover" />
              </div>
              <div v-else class="flex h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20 text-gray-400">
                <i class="las la-image text-3xl mb-1"></i>
                <span class="text-xs font-semibold">Aucune image</span>
              </div>
            </div>
            
            <div class="rounded-xl bg-blue-50/50 p-4 border border-blue-100/50 dark:bg-blue-950/20 dark:border-blue-900/20">
              <p class="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-semibold">
                <i class="las la-info-circle text-sm mr-1"></i>
                Les articles au statut "Publié" sont instantanément mis en ligne sur la section Blog de la plateforme publique.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { blogService, uploadService } from '@/services/api'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const uploading = ref(false)

const post = ref({
  title: '',
  content: '',
  featuredImage: '',
  status: 'draft',
  author: 'Admin'
})

const getImageUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://localhost:3003${url}`
}

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
}

const handleFileUpload = async (event: any) => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  try {
    const response = await uploadService.upload([file])
    if (response.urls && response.urls.length > 0) {
      post.value.featuredImage = response.urls[0]
      alert('Image téléversée avec succès !')
    }
  } catch (error) {
    console.error('Erreur lors du téléversement:', error)
    alert('Erreur lors du téléversement de l\'image.')
  } finally {
    uploading.value = false
  }
}

const fetchPost = async () => {
  if (!isEdit.value) return
  try {
    const data = await blogService.getOne(route.params.id as string)
    post.value = data
  } catch (error) {
    console.error('Erreur lors du chargement de l\'article:', error)
    router.push('/marketing/blog')
  }
}

const savePost = async () => {
  if (!post.value.title.trim()) {
    alert('Le titre est requis.')
    return
  }

  loading.value = true
  try {
    const payload = { 
      ...post.value,
      slug: (post.value as any).slug || generateSlug(post.value.title)
    }

    if (isEdit.value) {
      await blogService.update(route.params.id as string, payload)
    } else {
      await blogService.create(payload)
    }
    alert('Article enregistré avec succès !')
    router.push('/marketing/blog')
  } catch (error: any) {
    console.error('Erreur lors de l\'enregistrement:', error)
    const errorData = error.response?.data
    const message = errorData?.error || errorData?.message || error.message
    alert(`Erreur lors de l'enregistrement : ${message}`)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPost()
})
</script>
