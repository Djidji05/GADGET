<template>
  <div class="mx-auto max-w-screen-xl p-4 md:p-6 2xl:p-10 pb-24">
    <!-- Header -->
    <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i class="las la-blog text-blue-600 text-3xl"></i>
          Gestion du Blog & Contenu
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Créez des articles et guides technologiques pour attirer plus de clients sur la plateforme.</p>
      </div>

      <router-link
        to="/marketing/blog/new"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0"
      >
        <i class="las la-plus text-lg"></i>
        Nouvel Article
      </router-link>
    </div>

    <!-- Stats -->
    <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
      <!-- Total Articles Card -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <i class="las la-folder-open text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.totalPosts || 0 }}</h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Total Articles</span>
      </div>

      <!-- Vues Totales Card -->
      <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-100 dark:border-purple-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-purple-100/50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <i class="las la-eye text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.totalViews || 0 }}</h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Vues Totales</span>
      </div>

      <!-- Articles Publiés Card -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-100 dark:border-green-900/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 bg-green-100/50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
            <i class="las la-check-circle text-2xl"></i>
          </div>
        </div>
        <h4 class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.publishedPosts || 0 }}</h4>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Articles Publiés</span>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
        <h4 class="text-lg font-bold text-gray-900 dark:text-white">Derniers Articles rédigés</h4>
        <span class="text-xs font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/30">{{ posts.length }} article(s)</span>
      </div>

      <div class="p-6">
        <div v-if="posts.length === 0" class="py-16 text-center text-gray-500">
          <i class="las la-folder-minus text-5xl text-gray-350 dark:text-gray-650 mb-3 block"></i>
          Aucun article trouvé.
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-gray-150 dark:border-gray-800">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-150 dark:border-gray-800 text-left text-gray-500 font-black uppercase text-[10px] tracking-wider">
                <th class="py-3.5 px-6">Titre de l'article</th>
                <th class="py-3.5 px-6">Auteur</th>
                <th class="py-3.5 px-6">Statut</th>
                <th class="py-3.5 px-6">Vues</th>
                <th class="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr 
                v-for="post in posts" 
                :key="post.id"
                class="hover:bg-gray-50/50 dark:hover:bg-gray-850/50 transition-colors font-medium text-gray-700 dark:text-gray-300"
              >
                <td class="py-4 px-6">
                  <div class="flex flex-col gap-1">
                    <p class="font-bold text-gray-900 dark:text-white text-sm">{{ post.title }}</p>
                    <p class="text-xs text-gray-400 flex items-center gap-1">
                      <i class="las la-calendar"></i>
                      {{ formatDate(post.created_at) }}
                    </p>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <span class="font-semibold text-gray-900 dark:text-white">{{ post.author_name || 'Admin' }}</span>
                </td>
                <td class="py-4 px-6">
                  <span
                    class="inline-flex rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-opacity-10"
                    :class="post.status === 'published' ? 'bg-success text-success' : 'bg-warning text-warning'"
                  >
                    {{ post.status === 'published' ? 'Publié' : 'Brouillon' }}
                  </span>
                </td>
                <td class="py-4 px-6 font-semibold">
                  {{ post.views }}
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="editPost(post.id)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100 text-xs font-bold dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-900/30"
                      title="Modifier l'article"
                    >
                      <i class="las la-edit text-sm"></i>
                      Modifier
                    </button>
                    <button 
                      @click="deletePost(post.id)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100 text-xs font-bold dark:bg-red-950/20 dark:text-red-450 dark:border-red-900/30"
                      title="Supprimer l'article"
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
import { blogService } from '@/services/api'

const router = useRouter()
const posts = ref<any[]>([])
const stats = ref({
  totalPosts: 0,
  totalViews: 0,
  publishedPosts: 0
})

const fetchPosts = async () => {
  try {
    const data: any = await blogService.getAll()
    posts.value = data.posts
    stats.value = data.stats
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const editPost = (id: number) => {
  router.push(`/marketing/blog/edit/${id}`)
}

const deletePost = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    try {
      await blogService.delete(id)
      fetchPosts()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

onMounted(() => {
  fetchPosts()
})
</script>
