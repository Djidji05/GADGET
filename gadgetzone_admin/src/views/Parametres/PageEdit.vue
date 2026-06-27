<template>
  <div class="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10 pb-24 animate-fadeIn">
    <!-- Header -->
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i class="las la-edit text-blue-600 text-3xl"></i>
          Éditer la Page : {{ page.title }}
        </h2>
        <p class="text-xs text-gray-500 mt-1">Modifiez le titre et le contenu HTML de la page d'information.</p>
      </div>

      <nav>
        <ol class="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <li>
            <router-link class="hover:text-blue-650" to="/parametres/pages">Pages</router-link>
          </li>
          <li class="text-gray-400">/</li>
          <li class="text-blue-600 font-bold">Éditer</li>
        </ol>
      </nav>
    </div>

    <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <h3 class="font-bold text-gray-900 dark:text-white">
          Contenu de la Page
        </h3>
      </div>
      <form @submit.prevent="savePage">
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300">
                Titre de la Page *
              </label>
              <input
                v-model="page.title"
                type="text"
                placeholder="Titre de la page"
                required
                class="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 px-5 text-sm font-semibold outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-bold text-gray-500 dark:text-gray-400">
                Slug (Identifiant URL)
              </label>
              <input
                v-model="page.slug"
                type="text"
                disabled
                class="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-3 px-5 text-sm font-semibold text-gray-500 cursor-not-allowed outline-none opacity-80"
              />
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Contenu de la page (Format HTML / Texte brute) *</span>
              <span class="text-xs text-blue-600 font-bold bg-blue-50 dark:bg-blue-950/20 px-2.5 py-1 rounded-lg">HTML Autorisée</span>
            </label>
            <textarea
              v-model="page.content"
              rows="16"
              placeholder="Rédigez le contenu de la page en utilisant des balises HTML (ex: <h2>, <p>)..."
              required
              class="w-full font-mono text-sm shadow-inner rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/40 py-4 px-5 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 transition-all resize-y"
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
              {{ loading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
            </button>
            <button
              type="button"
              @click="$router.push('/parametres/pages')"
              class="px-6 py-3 border border-gray-200 dark:border-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 transition-all"
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pagesService } from '@/services/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const page = ref({
  title: '',
  slug: '',
  content: ''
})

const fetchPage = async () => {
  try {
    const data = await pagesService.getOne(route.params.slug as string)
    page.value = data
  } catch (error) {
    console.error('Erreur lors du chargement de la page:', error)
    router.push('/parametres/pages')
  }
}

const savePage = async () => {
  loading.value = true
  try {
    await pagesService.update(route.params.slug as string, page.value)
    router.push('/parametres/pages')
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error)
    alert('Une erreur est survenue lors de l\'enregistrement.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPage()
})
</script>
