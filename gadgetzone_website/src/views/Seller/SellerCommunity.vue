<template>
  <div class="w-full pt-4 pb-12 px-4">
      <div class="flex items-center gap-3 mb-8">
          <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <i class="fas fa-arrow-left"></i>
          </button>
          <div>
              <h1 class="text-2xl font-bold text-gray-900">Communauté</h1>
              <p class="text-sm text-gray-500">Échangez avec les autres vendeurs</p>
          </div>
      </div>

      <!-- Main Group CTA -->
      <div class="bg-green-600 rounded-3xl p-6 text-white mb-8 shadow-lg shadow-green-100 relative overflow-hidden">
          <div class="relative z-10">
              <h2 class="text-2xl font-bold mb-2">Rejoindre le Club VIP</h2>
              <p class="text-sm text-green-100 mb-6">Accédez au groupe WhatsApp officiel des vendeurs certifiés HTFasil.</p>
              <a v-if="whatsappLink" :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="inline-flex bg-white text-green-600 px-6 py-3 rounded-xl font-bold text-sm items-center gap-2 hover:bg-green-50 transition-colors shadow-sm focus:outline-none">
                  <i class="fab fa-whatsapp text-lg"></i>
                  Intégrer le groupe
              </a>
              <button v-else disabled class="inline-flex bg-white/80 text-green-700/50 px-6 py-3 rounded-xl font-bold text-sm items-center gap-2 cursor-not-allowed shadow-sm">
                  <i class="fab fa-whatsapp text-lg"></i>
                  Lien indisponible
              </button>
          </div>
          <i class="fas fa-users-cog absolute -right-6 -bottom-6 text-[150px] text-white/10 rotate-12"></i>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-3 mb-8">
          <div class="bg-white p-3 rounded-2xl border border-gray-100 text-center">
              <p class="text-lg font-black text-gray-900 line-none" v-if="!loading">{{ stats.totalMembers }}</p>
              <p class="text-lg font-black text-gray-300 animate-pulse bg-gray-200 h-6 w-12 mx-auto rounded" v-else></p>
              <p class="text-[9px] text-gray-400 font-bold uppercase mt-1">Membres</p>
          </div>
          <div class="bg-white p-3 rounded-2xl border border-gray-100 text-center">
              <p class="text-lg font-black text-gray-900 line-none" v-if="!loading">{{ stats.activeMembers }}</p>
              <p class="text-lg font-black text-gray-300 animate-pulse bg-gray-200 h-6 w-12 mx-auto rounded" v-else></p>
              <p class="text-[9px] text-gray-400 font-bold uppercase mt-1">Actifs</p>
          </div>
          <div class="bg-white p-3 rounded-2xl border border-gray-100 text-center">
              <p class="text-lg font-black text-gray-900 line-none" v-if="!loading">{{ stats.experts }}</p>
              <p class="text-lg font-black text-gray-300 animate-pulse bg-gray-200 h-6 w-12 mx-auto rounded" v-else></p>
              <p class="text-[9px] text-gray-400 font-bold uppercase mt-1">Experts</p>
          </div>
      </div>

      <!-- Forum Preview -->
      <h3 class="font-bold text-lg text-gray-900 mb-4">Discussions du jour</h3>
      
      <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
              <div class="flex items-center gap-2 mb-3">
                  <div class="w-6 h-6 rounded-full bg-gray-200"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
      </div>
      
      <div v-else-if="forumPosts.length === 0" class="text-center py-10 bg-white rounded-2xl border border-gray-100">
          <i class="far fa-comments text-4xl text-gray-300 mb-2"></i>
          <p class="text-gray-500 font-medium">Aucune discussion pour le moment.</p>
          <p class="text-sm text-gray-400">Soyez le premier à lancer un sujet !</p>
      </div>

      <div v-else class="space-y-4">
          <div v-for="post in forumPosts" :key="post.id" @click="openPostDetails(post)" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-green-200 transition-colors">
              <div class="flex items-center gap-2 mb-3">
                  <img :src="post.avatar" alt="Avatar" class="w-6 h-6 rounded-full bg-gray-100 object-cover" />
                  <span class="text-xs font-bold text-gray-700">{{ post.author }}</span>
                  <span class="text-[10px] text-gray-400 ml-auto">{{ post.time }}</span>
              </div>
              <h4 class="font-bold text-sm text-gray-900 mb-1">{{ post.title }}</h4>
              <p class="text-xs text-gray-500 line-clamp-2 mb-3 whitespace-pre-line">{{ post.content }}</p>
              <div class="flex items-center gap-4 text-xs text-gray-400 font-bold">
                  <span class="flex items-center gap-1"><i class="far fa-comment"></i> {{ post.comments }}</span>
                  <button @click="(e) => toggleLike(post, e)" class="flex items-center gap-1 transition-colors hover:text-red-500" :class="{ 'text-red-500': post.hasLiked }">
                      <i :class="post.hasLiked ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i> {{ post.likes }}
                  </button>
              </div>
          </div>
      </div>

      <!-- Create Post FAB -->
      <button @click="showCreateModal = true" class="fixed bottom-24 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center text-xl active:scale-95 transition-all z-40">
          <i class="fas fa-plus"></i>
      </button>

      <!-- Create Post Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 sm:p-0">
          <div class="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in flex flex-col max-h-[90vh]">
              <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                  <h3 class="font-bold text-lg flex items-center gap-2">
                      Démarrer une discussion
                  </h3>
                  <button @click="showCreateModal = false" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                      <i class="fas fa-times"></i>
                  </button>
              </div>
              <div class="p-4 overflow-y-auto">
                  <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium flex items-center gap-2">
                      <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
                  </div>
                  
                  <div class="space-y-4">
                      <div>
                          <label class="block text-xs font-bold text-gray-700 mb-1">Titre de la discussion</label>
                          <input type="text" v-model="newPostForm.title" placeholder="Ex: Avis sur les livraisons en province" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-medium">
                      </div>
                      <div>
                          <label class="block text-xs font-bold text-gray-700 mb-1">Message</label>
                          <textarea v-model="newPostForm.content" placeholder="Partagez votre expérience ou posez votre question..." rows="5" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-none"></textarea>
                      </div>
                  </div>
              </div>
              <div class="p-4 bg-gray-50 border-t border-gray-100 sticky bottom-0">
                  <button @click="createPost" :disabled="processing || !newPostForm.title || !newPostForm.content" class="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      <i v-if="processing" class="fas fa-circle-notch fa-spin"></i>
                      Publier
                  </button>
              </div>
          </div>
      </div>

      <!-- Post Details Modal (Full Screen Mobile) -->
      <div v-if="showPostDetails && selectedPost" class="fixed inset-0 z-50 flex flex-col bg-gray-50 animate-slide-up">
          <div class="p-4 bg-white border-b border-gray-100 flex items-center gap-3 shadow-sm sticky top-0 z-10">
              <button @click="showPostDetails = false" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                  <i class="fas fa-arrow-left"></i>
              </button>
              <h3 class="font-bold text-lg truncate flex-1">Discussion</h3>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 pb-24">
              <!-- Original Post -->
              <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6">
                  <div class="flex items-center gap-3 mb-4">
                      <img :src="selectedPost.post.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPost.post.authorName || 'V')}&background=random`" alt="Avatar" class="w-10 h-10 rounded-full bg-gray-100 object-cover" />
                      <div>
                          <div class="font-bold text-gray-900">{{ selectedPost.post.authorName || 'Vendeur Anonyme' }}</div>
                          <div class="text-[11px] text-gray-500">{{ selectedPost.post.created_at }}</div>
                      </div>
                  </div>
                  <h2 class="text-xl font-bold text-gray-900 mb-3">{{ selectedPost.post.title }}</h2>
                  <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">{{ selectedPost.post.content }}</p>
                  
                  <div class="flex items-center gap-6 pt-4 border-t border-gray-100 text-sm text-gray-500 font-bold">
                      <span class="flex items-center gap-2"><i class="far fa-comment"></i> {{ selectedPost.post.comments_count }} réponses</span>
                      <button @click="toggleLike({ id: selectedPost.post.id, likes: selectedPost.post.likes_count } as any)" class="flex items-center gap-2 transition-colors hover:text-red-500">
                          <i class="far fa-heart"></i> {{ selectedPost.post.likes_count }} j'aime
                      </button>
                  </div>
              </div>

              <!-- Comments Section -->
              <h4 class="font-bold text-gray-900 mb-4 px-2">Réponses ({{ selectedPost.comments?.length || 0 }})</h4>
              
              <div v-if="selectedPost.comments?.length === 0" class="text-center py-8 text-gray-400 text-sm">
                  Soyez le premier à répondre !
              </div>

              <div v-else class="space-y-4">
                  <div v-for="comment in selectedPost.comments" :key="comment.id" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex gap-3">
                      <img :src="comment.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author || 'V')}&background=random`" class="w-8 h-8 rounded-full bg-gray-100 object-cover shrink-0" />
                      <div class="flex-1">
                          <div class="flex items-center justify-between mb-1">
                              <span class="text-xs font-bold text-gray-900">{{ comment.author }}</span>
                              <span class="text-[10px] text-gray-400">{{ comment.time }}</span>
                          </div>
                          <p class="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{{ comment.content }}</p>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Add Comment Fixed Input -->
          <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-2">
              <input type="text" v-model="newCommentContent" @keyup.enter="addComment" placeholder="Votre réponse..." class="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500">
              <button @click="addComment" :disabled="processing || !newCommentContent.trim()" class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-50 transition-all hover:bg-green-700">
                  <i v-if="processing" class="fas fa-circle-notch fa-spin"></i>
                  <i v-else class="fas fa-paper-plane"></i>
              </button>
          </div>
      </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { vendorService, type ForumPost, type ForumStats } from '@/services/vendor';
import api from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const stats = ref<ForumStats>({
    totalMembers: '0',
    activeMembers: 0,
    experts: 0
});

const forumPosts = ref<ForumPost[]>([]);
const loading = ref(true);
const whatsappLink = ref('');

// Modals state
const showCreateModal = ref(false);
const showPostDetails = ref(false);
const processing = ref(false);
const errorMessage = ref('');

// New Post Form
const newPostForm = ref({
    title: '',
    content: ''
});

// Selected Post Detail
const selectedPost = ref<any>(null);
const newCommentContent = ref('');

const formatTime = (dateString: string) => {
    try {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
    } catch (e) {
        return dateString;
    }
};

const loadData = async () => {
    loading.value = true;
    try {
        const [statsData, postsData, settingsResponse] = await Promise.all([
            vendorService.getCommunityStats(),
            vendorService.getCommunityPosts(),
            api.get('/settings/general')
        ]);
        stats.value = statsData;
        
        if (settingsResponse.data && settingsResponse.data.whatsapp_vip_link) {
            whatsappLink.value = settingsResponse.data.whatsapp_vip_link;
        }
        
        // Format dates on the fly
        forumPosts.value = postsData.map(post => ({
            ...post,
            time: formatTime(post.time)
        }));
    } catch (error) {
        console.error('Erreur chargement communauté:', error);
    } finally {
        loading.value = false;
    }
};

const createPost = async () => {
    if (!newPostForm.value.title || !newPostForm.value.content) return;
    
    processing.value = true;
    errorMessage.value = '';
    
    try {
        await vendorService.createCommunityPost(newPostForm.value.title, newPostForm.value.content);
        showCreateModal.value = false;
        newPostForm.value = { title: '', content: '' };
        await loadData(); // Refresh list
    } catch (error: any) {
        errorMessage.value = error.response?.data?.error || 'Erreur lors de la création';
    } finally {
        processing.value = false;
    }
};

const openPostDetails = async (post: ForumPost) => {
    processing.value = true;
    try {
        const details = await vendorService.getCommunityPostDetails(post.id);
        
        // Format dates for the details view
        if (details.post) details.post.created_at = formatTime(details.post.created_at);
        if (details.comments) {
            details.comments = details.comments.map((c: any) => ({
                ...c,
                time: formatTime(c.time)
            }));
        }
        
        selectedPost.value = details;
        showPostDetails.value = true;
    } catch (error) {
        console.error('Erreur chargement détails post:', error);
    } finally {
        processing.value = false;
    }
};

const addComment = async () => {
    if (!newCommentContent.value || !selectedPost.value) return;
    
    processing.value = true;
    try {
        await vendorService.addCommunityComment(selectedPost.value.post.id, newCommentContent.value);
        newCommentContent.value = '';
        // Refresh details
        await openPostDetails(selectedPost.value.post);
        // Refresh underlying list to update comment count silently
        loadData();
    } catch (error: any) {
        console.error('Erreur ajout commentaire:', error);
        alert(error.response?.data?.error || 'Erreur lors de l\'ajout du commentaire');
    } finally {
        processing.value = false;
    }
};

const toggleLike = async (post: ForumPost, event?: Event) => {
    if (event) event.stopPropagation(); // Prevent opening modal if clicking like button on list
    
    try {
        const result = await vendorService.toggleCommunityLike(post.id);
        post.likes = result.likes_count;
        post.hasLiked = result.liked;
        
        // Also update if viewing current details
        if (selectedPost.value && selectedPost.value.post.id === post.id) {
            selectedPost.value.post.likes_count = result.likes_count;
        }
    } catch (error) {
        console.error('Erreur like:', error);
    }
};

onMounted(() => {
    loadData();
});
</script>
