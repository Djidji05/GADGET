<template>
  <div class="w-full font-sans bg-gray-50/50 min-h-screen pt-4 pb-12 px-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
              <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all">
                  <i class="fas fa-arrow-left"></i>
              </button>
              <div>
                  <h1 class="text-2xl font-black text-gray-900 tracking-tight">Académie Vendeur</h1>
                  <p class="text-sm text-gray-500 font-medium">Formez-vous pour vendre plus et mieux</p>
              </div>
          </div>
          
          <div class="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
              <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                  <i class="fas fa-trophy text-sm"></i>
              </div>
              <div class="flex flex-col">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Votre Niveau</span>
                  <span class="text-sm font-black text-gray-900 leading-none">Débutant</span>
              </div>
          </div>
      </div>

      <!-- Quick Categories Filter -->
      <div class="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar scrollbar-hide">
          <button 
              @click="activeCategory = 'Toutes'"
              :class="activeCategory === 'Toutes' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
              class="px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border shrink-0"
          >
              Toutes
          </button>
          <button 
              v-for="cat in categories" 
              :key="cat.name"
              @click="activeCategory = cat.name"
              :class="activeCategory === cat.name ? cat.bg + ' ' + cat.color + ' border-transparent ring-2 ring-offset-1 ' + cat.ring : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
              class="px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border flex items-center gap-2 shrink-0"
          >
              <i :class="cat.icon"></i>
              {{ cat.name }}
          </button>
      </div>

      <!-- Featured Course (Only show if 'Toutes' is selected and course exists) -->
      <div v-if="activeCategory === 'Toutes' && featuredCourse" class="bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 rounded-[32px] p-8 text-white mb-10 shadow-xl shadow-blue-900/20 relative overflow-hidden group">
          <div class="relative z-10 md:w-2/3">
              <div class="flex items-center gap-2 mb-4">
                  <span class="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full">En Vedette</span>
                  <span class="bg-red-500 text-white text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full flex items-center gap-1">
                      <i class="fas fa-play text-[8px]"></i> Vidéo
                  </span>
              </div>
              <h2 class="text-3xl md:text-4xl font-black mb-3 leading-tight">{{ featuredCourse.title }}</h2>
              <p class="text-blue-100/90 mb-8 max-w-lg text-sm leading-relaxed">{{ featuredCourse.description || "Apprenez à configurer un studio maison, gérer l'éclairage et retoucher vos photos pour doubler vos ventes et attirer plus de clients sur HTFasil." }}</p>
              
              <div class="flex items-center gap-4">
                  <button @click="openVideo(featuredCourse)" class="bg-white text-blue-600 px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-3">
                      <i class="fas fa-play"></i>
                      Regarder maintenant
                  </button>
                  <span class="text-sm font-bold text-blue-200 flex items-center gap-1.5 opacity-80">
                      <i class="far fa-clock"></i> {{ featuredCourse.duration || '12 min' }}
                  </span>
              </div>
          </div>
          <div class="absolute right-0 top-0 bottom-0 w-1/3 bg-black/10 hidden md:block">
              <img :src="featuredCourse.thumbnail" class="w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-700/80 to-transparent"></div>
          </div>
          <i class="fas fa-camera absolute -right-4 -bottom-8 text-[200px] text-white/5 rotate-12 pointer-events-none md:hidden"></i>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Main Content Area: Videos and Articles -->
          <div class="md:col-span-2 space-y-10">
              
              <!-- Video Courses List -->
              <div>
                  <div class="flex justify-between items-center mb-6">
                      <h3 class="font-black text-xl text-gray-900 tracking-tight flex items-center gap-2">
                          <i class="fas fa-play-circle text-blue-500"></i> Cours vidéos
                      </h3>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div v-for="course in filteredVideos" :key="course.id" 
                           @click="openVideo(course)"
                           class="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden cursor-pointer group active:scale-[0.98] transition-all hover:shadow-md">
                          <div class="relative h-48 bg-gray-200 overflow-hidden">
                              <img :src="course.thumbnail" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div class="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg">
                                      <i class="fas fa-play text-xl ml-1"></i>
                                  </div>
                              </div>
                              <div class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                                  <i class="fas fa-clock text-[8px] text-gray-300"></i> {{ course.duration }}
                              </div>
                              <div class="absolute top-3 left-3 flex gap-1">
                                   <span class="bg-blue-600 text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full shadow-sm">{{ course.category }}</span>
                              </div>
                          </div>
                          <div class="p-5">
                              <h4 class="font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 text-[15px]">{{ course.title }}</h4>
                              <p class="text-[12px] text-gray-500 line-clamp-2 leading-relaxed">{{ course.description }}</p>
                          </div>
                      </div>
                  </div>
                  
                  <div v-if="filteredVideos.length === 0" class="py-10 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
                      <div class="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mx-auto mb-4 text-gray-300">
                           <i class="fas fa-video text-2xl"></i>
                      </div>
                      <p class="text-gray-500 font-bold">Aucune vidéo disponible pour cette catégorie.</p>
                  </div>
              </div>

              <!-- Text Articles List -->
              <div>
                  <div class="flex justify-between items-center mb-6">
                      <h3 class="font-black text-xl text-gray-900 tracking-tight flex items-center gap-2">
                          <i class="fas fa-book-open text-purple-500"></i> Guides & Articles
                      </h3>
                  </div>
                  <div class="space-y-4">
                      <div v-for="article in filteredArticles" :key="article.id" 
                           @click="openArticle(article)"
                           class="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 lg:gap-5 cursor-pointer hover:shadow-md transition-all group active:scale-[0.99]">
                          <div class="w-full sm:w-32 h-40 sm:h-32 rounded-[16px] bg-gray-100 flex-shrink-0 bg-cover bg-center overflow-hidden relative" :style="{ backgroundImage: `url(${article.thumbnail})` }">
                              <div class="absolute inset-0 bg-black/10 group-hover:scale-105 transition-transform duration-500"></div>
                          </div>
                          <div class="flex-1 flex flex-col justify-center">
                              <div class="flex items-center gap-2 mb-2">
                                  <span class="text-[10px] font-black tracking-wider uppercase text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">{{ article.category }}</span>
                                  <span class="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                                      <i class="far fa-clock"></i> {{ article.readTime }} min
                                  </span>
                              </div>
                              <h4 class="font-bold text-lg text-gray-900 leading-tight mb-1.5 group-hover:text-purple-600 transition-colors">{{ article.title }}</h4>
                              <p class="text-[13px] text-gray-500 line-clamp-2 leading-relaxed" v-html="article.description || article.excerpt"></p>
                          </div>
                      </div>
                  </div>
                  
                  <div v-if="filteredArticles.length === 0" class="py-10 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
                      <div class="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mx-auto mb-4 text-gray-300">
                           <i class="fas fa-file-alt text-2xl"></i>
                      </div>
                      <p class="text-gray-500 font-bold">Aucun guide disponible pour cette catégorie.</p>
                  </div>
              </div>

          </div>

          <!-- Sidebar (Stats & Resources) -->
          <div class="space-y-6">
              <!-- Progress Card -->
              <div class="bg-gray-900 rounded-[32px] p-6 text-white shadow-xl shadow-gray-900/10">
                  <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                      <i class="fas fa-chart-line text-blue-400"></i> Votre progression
                  </h3>
                  <div class="mb-4">
                      <div class="flex justify-between text-xs font-bold mb-2">
                          <span class="text-gray-400">Cours complétés</span>
                          <span class="text-white">3 / 12</span>
                      </div>
                      <div class="w-full bg-white/10 rounded-full h-2.5">
                          <div class="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full" style="width: 25%"></div>
                      </div>
                  </div>
                  <p class="text-[11px] text-gray-400 font-medium italic border-t border-white/10 pt-4">Continuez votre apprentissage pour débloquer le badge "Expert Vendeur" et booster la visibilité de votre boutique.</p>
              </div>

              <!-- Quick Links -->
              <div class="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                  <h3 class="font-black text-gray-900 mb-4 px-1">Ressources utiles</h3>
                  <div class="space-y-2">
                      <button class="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left group">
                          <div class="flex items-center gap-3">
                              <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                  <i class="fas fa-calculator text-sm"></i>
                              </div>
                              <span class="text-xs font-bold text-gray-700 group-hover:text-blue-600">Calculateur de marges</span>
                          </div>
                          <i class="fas fa-chevron-right text-[10px] text-gray-300"></i>
                      </button>
                      <button class="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left group">
                          <div class="flex items-center gap-3">
                              <div class="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                  <i class="fas fa-file-invoice-dollar text-sm"></i>
                              </div>
                              <span class="text-xs font-bold text-gray-700 group-hover:text-green-600">Grille tarifaire PDF</span>
                          </div>
                          <i class="fas fa-chevron-right text-[10px] text-gray-300"></i>
                      </button>
                      <button class="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left group">
                          <div class="flex items-center gap-3">
                              <div class="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                                  <i class="fas fa-images text-sm"></i>
                              </div>
                              <span class="text-xs font-bold text-gray-700 group-hover:text-orange-600">Templates réseaux sociaux</span>
                          </div>
                          <i class="fas fa-chevron-right text-[10px] text-gray-300"></i>
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <!-- VIDEO OVERLAY MODAL -->
      <div v-if="selectedVideo" class="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="closeVideo"></div>
          
          <div ref="videoContainerRef" class="relative w-full max-w-5xl bg-black rounded-[32px] overflow-hidden shadow-2xl shadow-black/50 z-10 border border-white/10 flex flex-col animate-in zoom-in-95 duration-300">
              <!-- Toolbar -->
              <div class="absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start z-20 pointer-events-none">
                  <div class="pointer-events-auto">
                      <span class="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-block mb-2">{{ selectedVideo.category }}</span>
                      <h2 class="text-white font-bold text-lg md:text-2xl drop-shadow-md">{{ selectedVideo.title }}</h2>
                  </div>
                  <div class="flex items-center gap-2 pointer-events-auto">
                      <button @click="toggleFullscreen" class="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-colors" title="Plein écran">
                          <i class="fas fa-expand text-sm"></i>
                      </button>
                      <button @click="closeVideo" class="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-colors">
                          <i class="fas fa-times text-lg"></i>
                      </button>
                  </div>
              </div>
              
              <!-- Video Player (Mocked via iframe or video tag) -->
              <div class="w-full relative bg-gray-900" style="padding-top: 56.25%;">
                  <!-- Since we don't have real videos, we use a placeholder image with a play button state -->
                  <div class="absolute inset-0 flex items-center justify-center overflow-hidden">
                      <img :src="selectedVideo.thumbnail" class="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" />
                       <iframe 
                            v-if="selectedVideo.url"
                            class="absolute inset-0 w-full h-full" 
                            :src="formatYoutubeUrl(selectedVideo.url) + '?autoplay=1&rel=0'" 
                            title="YouTube video player" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
                            allowfullscreen>
                        </iframe>
                      <div v-else class="relative z-10 text-center text-white">
                           <div class="w-20 h-20 bg-blue-600/80 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                               <i class="fas fa-play text-2xl ml-1"></i>
                           </div>
                           <p class="font-bold text-xl">Démarrage de la vidéo...</p>
                      </div>
                  </div>
              </div>
              
              <!-- Video Details (Bottom Bar) -->
              <div class="bg-gray-900 p-6 flex flex-col md:flex-row gap-4 justify-between items-center text-white text-sm">
                  <p class="text-gray-400 flex-1">{{ selectedVideo.description }}</p>
                  <button class="bg-white/10 hover:bg-white/20 font-bold px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2">
                       <i class="fas fa-check-circle"></i> Marquer comme terminé
                  </button>
              </div>
          </div>
      </div>

      <!-- ARTICLE OVERLAY MODAL -->
      <div v-if="selectedArticle" class="fixed inset-0 z-[1100] flex animate-in slide-in-from-bottom duration-300">
           <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeArticle"></div>
          
          <!-- Article Panel -->
          <div class="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl md:m-auto bg-white md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden z-10">
              
              <!-- Header Image -->
              <div class="relative h-64 md:h-80 shrink-0">
                  <img :src="selectedArticle.thumbnail" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  <button @click="closeArticle" class="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white flex items-center justify-center transition-colors">
                      <i class="fas fa-times text-sm"></i>
                  </button>
                  
                  <div class="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
                       <div class="flex items-center gap-3 mb-3">
                           <span class="bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{{ selectedArticle.category }}</span>
                           <span class="text-xs font-bold text-gray-300 flex items-center gap-1"><i class="far fa-clock"></i> {{ selectedArticle.readTime }} min</span>
                       </div>
                       <h2 class="text-3xl md:text-4xl font-black drop-shadow-md leading-tight">{{ selectedArticle.title }}</h2>
                  </div>
              </div>
              
              <!-- Article Content -->
              <div class="p-6 md:p-10 overflow-y-auto flex-1 bg-white scrollbar-hide">
                  <p class="text-xl text-gray-500 font-medium leading-relaxed mb-8 italic" v-html="selectedArticle.description || selectedArticle.excerpt">
                  </p>
                  
                  <div class="prose prose-blue max-w-none text-gray-700" v-html="selectedArticle.content">
                  </div>
                  
                  <div class="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                      <div class="text-sm font-bold text-gray-400">Avez-vous trouvé cet article utile ?</div>
                      <div class="flex gap-2">
                          <button class="w-10 h-10 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all"><i class="fas fa-thumbs-up"></i></button>
                          <button class="w-10 h-10 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"><i class="fas fa-thumbs-down"></i></button>
                      </div>
                  </div>
              </div>
          </div>
      </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUiStore } from '@/stores/ui';
import api from '@/services/api';

const uiStore = useUiStore();
const activeCategory = ref('Toutes');

const categories = [
    { name: 'Débuter', icon: 'fas fa-flag', color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-100' },
    { name: 'Marketing', icon: 'fas fa-bullhorn', color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100' },
    { name: 'Expédition', icon: 'fas fa-box', color: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-100' },
    { name: 'Règles', icon: 'fas fa-gavel', color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-100' }
];

const videosList = ref<any[]>([]);
const articlesList = ref<any[]>([]);
const featuredCourse = ref<any>(null);
const loading = ref(true);

const fetchCourses = async () => {
    loading.value = true;
    try {
        const response = await api.get('/academy');
        const allCourses = response.data;
        
        videosList.value = allCourses.filter((c: any) => c.type === 'video');
        articlesList.value = allCourses.filter((c: any) => c.type === 'article');
        
        if (videosList.value.length > 0) {
            featuredCourse.value = videosList.value[0];
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des cours:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchCourses();
});

// Filters
const filteredVideos = computed(() => {
    if (activeCategory.value === 'Toutes') return videosList.value;
    return videosList.value.filter(v => v.category === activeCategory.value);
});

const filteredArticles = computed(() => {
    if (activeCategory.value === 'Toutes') return articlesList.value;
    return articlesList.value.filter(a => a.category === activeCategory.value);
});


// Logic for Opening Videos
const selectedVideo = ref<any>(null);

const openVideo = (videoInfo: any) => {
    selectedVideo.value = videoInfo;
    document.body.style.overflow = 'hidden';
    uiStore.isSellerNavVisible = false;
};

const videoContainerRef = ref<HTMLElement | null>(null);

const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        if (videoContainerRef.value?.requestFullscreen) {
            videoContainerRef.value.requestFullscreen().catch(err => {
                console.error(`Erreur plein écran: ${err.message}`);
            });
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

const formatYoutubeUrl = (url: string | null) => {
    if (!url) return '';
    try {
        // Regex pour attraper l'ID d'une vidéo YouTube dans n'importe quel format courant
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2] && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
    } catch (e) {
        console.warn('Invalid YouTube URL', e);
    }
    return url;
};

const closeVideo = () => {
    selectedVideo.value = null;
    document.body.style.overflow = '';
    uiStore.isSellerNavVisible = true;
};

// Logic for Opening Articles
const selectedArticle = ref<any>(null);

const openArticle = (articleInfo: any) => {
    selectedArticle.value = articleInfo;
    document.body.style.overflow = 'hidden';
    uiStore.isSellerNavVisible = false;
};

const closeArticle = () => {
    selectedArticle.value = null;
    document.body.style.overflow = '';
    uiStore.isSellerNavVisible = true;
};

onUnmounted(() => {
    document.body.style.overflow = '';
    uiStore.isSellerNavVisible = true;
});

</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.animate-in {
    animation-duration: 0.3s;
    animation-fill-mode: both;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
.fade-in { animation-name: fadeIn; }

@keyframes zoomIn95 {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
.zoom-in-95 { animation-name: zoomIn95; }

@keyframes slideInBottom {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}
.slide-in-from-bottom { animation-name: slideInBottom; }
</style>
