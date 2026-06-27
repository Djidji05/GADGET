<template>
  <div class="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10 pb-24">
    <!-- Header -->
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <i class="las la-file-contract text-blue-600 text-3xl"></i>
          Pages du site (CGU, etc.)
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez le contenu des pages légales, de confidentialité et informatives du site public.</p>
      </div>
      
      <button 
        @click="createNewPage"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0"
      >
        <i class="las la-plus text-lg"></i>
        Nouvelle Page
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
        <h4 class="text-lg font-bold text-gray-900 dark:text-white">Pages publiées</h4>
        <span class="text-xs font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/30">{{ pages.length }} page(s)</span>
      </div>

      <div class="p-6">
        <div v-if="pages.length === 0" class="py-16 text-center text-gray-500">
          <i class="las la-file-excel text-5xl text-gray-300 dark:text-gray-650 mb-3 block"></i>
          Chargement ou aucune page trouvée...
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-gray-150 dark:border-gray-800">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-150 dark:border-gray-800 text-left text-gray-500 font-black uppercase text-[10px] tracking-wider">
                <th class="py-3.5 px-6">Titre de la page</th>
                <th class="py-3.5 px-6">Lien / Slug</th>
                <th class="py-3.5 px-6">Dernière modification</th>
                <th class="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr 
                v-for="page in pages" 
                :key="page.slug"
                class="hover:bg-gray-50/50 dark:hover:bg-gray-850/50 transition-colors font-medium text-gray-700 dark:text-gray-300"
              >
                <td class="py-4 px-6 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <i class="las la-file-alt text-lg text-blue-600"></i>
                  {{ page.title }}
                </td>
                <td class="py-4 px-6">
                  <code class="text-xs bg-blue-50/50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 px-2 py-1 rounded-lg border border-blue-100/30 font-bold font-mono">/{{ page.slug }}</code>
                </td>
                <td class="py-4 px-6 text-xs text-gray-400">
                  {{ formatDate(page.updated_at) }}
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="editPage(page.slug)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100 text-xs font-bold dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-900/30"
                      title="Modifier la page"
                    >
                      <i class="las la-edit text-sm"></i>
                      Modifier
                    </button>
                    <button 
                      v-if="!['terms', 'privacy'].includes(page.slug)"
                      @click="deletePage(page.slug)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100 text-xs font-bold dark:bg-red-950/20 dark:text-red-450 dark:border-red-900/30"
                      title="Supprimer la page"
                    >
                      <i class="las la-trash text-sm"></i>
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { pagesService } from '@/services/api'

const router = useRouter()
const pages = ref<any[]>([])

const fetchPages = async () => {
  try {
    const data = await pagesService.getAll()
    pages.value = data.pages || []
  } catch (error) {
    console.error('Erreur lors de la récupération des pages:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const editPage = (slug: string) => {
  router.push(`/parametres/pages/edit/${slug}`)
}

const createNewPage = () => {
  const title = prompt('Titre de la nouvelle page:')
  if (!title) return
  
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  pagesService.create({ title, slug, content: 'Nouveau contenu...' })
    .then(() => fetchPages())
    .catch(err => alert('Erreur: ' + err.message))
}

const deletePage = async (slug: string) => {
  if (confirm(`Supprimer la page "${slug}" ?`)) {
    try {
      await pagesService.delete(slug)
      fetchPages()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

onMounted(() => {
  fetchPages()
})
</script>
