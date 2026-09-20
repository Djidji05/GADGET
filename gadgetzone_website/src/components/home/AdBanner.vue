<template>
  <div v-if="activeBanners.length > 0" class="ad-banners-slider relative group max-w-7xl mx-auto px-4 my-4 sm:my-8 overflow-hidden w-full">
    <!-- Section Header (Optional) -->
    <div v-if="activeBanners.length > 1 && adsConfig?.sliderTitle" class="text-center mb-4 md:mb-8">
      <h2 class="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">{{ adsConfig.sliderTitle }}</h2>
    </div>

    <!-- Desktop Dual Grid (LG only when 2+ banners) -->
    <div v-if="activeBanners.length >= 2" class="hidden lg:grid lg:grid-cols-2 gap-6">
      <div 
        v-for="(banner, index) in activeBanners.slice(0, 2)" 
        :key="'pc-grid-' + index"
        class="relative overflow-hidden rounded-3xl shadow-xl bg-gray-900 group h-[220px] transition-all hover:-translate-y-1 hover:shadow-2xl"
      >
        <img 
          :src="normalizeImageUrl(banner.image)" 
          width="800"
          height="300"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          :alt="banner.title || 'Promotion'"
        >
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div class="absolute inset-0 z-10 flex flex-col justify-center p-6 md:p-8 text-white">
          <h3 class="text-xl md:text-2xl font-extrabold mb-2" :style="{ color: banner.titleColor || '#ffffff' }">
            {{ banner.title }}
          </h3>
          <p class="text-xs md:text-sm mb-4 opacity-90 line-clamp-2" :style="{ color: banner.subtitleColor || '#ffffff' }">
            {{ banner.subtitle }}
          </p>
          <router-link 
            v-if="banner.link" 
            :to="banner.link" 
            class="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-blue-600 hover:text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md w-max"
          >
            {{ banner.buttonText || 'Profiter de l\'offre' }}
            <i class="fas fa-arrow-right text-[9px]"></i>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mobile & Single Banner Slider Track -->
    <div :class="{ 'lg:hidden': activeBanners.length >= 2 }" class="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl bg-gray-900 w-full">
      <div 
        class="flex transition-transform duration-700 ease-in-out w-full" 
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div 
          v-for="(banner, index) in activeBanners" 
          :key="banner.id || index" 
          class="w-full flex-shrink-0 flex-grow-0 basis-full relative h-48 sm:h-64 md:h-80 lg:h-[320px] overflow-hidden"
        >
          <!-- Background Image -->
          <img 
            :src="normalizeImageUrl(banner.image)" 
            loading="lazy"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            :alt="banner.title || 'Promotion'"
          >
          
          <!-- Dark Overlay -->
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

          <!-- Content Overlay -->
          <div 
            class="absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-8 md:px-16 text-white"
            :class="[
              banner.textAlign === 'text-right' ? 'items-end text-right' : 
              banner.textAlign === 'text-center' ? 'items-center text-center' : 
              'items-start text-left'
            ]"
          >
            <div class="max-w-xl w-full">
              <h3 
                v-if="banner.title"
                class="mb-1.5 sm:mb-2 transition-all duration-500 delay-100 transform text-lg sm:text-2xl md:text-4xl font-black leading-tight drop-shadow-md"
                :style="{ color: banner.titleColor || '#ffffff' }"
              >
                {{ banner.title }}
              </h3>
              <p 
                v-if="banner.subtitle"
                class="text-xs sm:text-sm md:text-base mb-3 sm:mb-6 opacity-90 transition-all duration-500 delay-200 transform line-clamp-2 drop-shadow"
                :style="{ color: banner.subtitleColor || '#ffffff' }"
              >
                {{ banner.subtitle }}
              </p>
              
              <div 
                v-if="banner.link"
                class="transition-all duration-500 delay-300 transform"
              >
                <router-link 
                  :to="banner.link" 
                  class="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-gray-900 hover:bg-blue-600 hover:text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-blue-200"
                >
                  {{ banner.buttonText || 'Découvrir' }}
                  <i class="fas fa-arrow-right text-[9px]"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows (Shown when 2+ banners) -->
      <template v-if="activeBanners.length > 1">
        <button 
          @click="prevSlide" 
          class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-blue-600 z-20 shadow-lg text-xs sm:text-base"
          aria-label="Bannière précédente"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button 
          @click="nextSlide" 
          class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-blue-600 z-20 shadow-lg text-xs sm:text-base"
          aria-label="Bannière suivante"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <!-- Slide Indicators -->
        <div class="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
          <button 
            v-for="(_, index) in activeBanners" 
            :key="index"
            @click="currentIndex = Number(index)"
            class="h-1.5 rounded-full transition-all duration-300 bg-white/40 overflow-hidden"
            :class="currentIndex === index ? 'w-6 sm:w-8 bg-white' : 'w-2.5 sm:w-4 hover:bg-white/60'"
            :aria-label="`Bannière ${Number(index) + 1}`"
          >
            <div 
              v-if="currentIndex === index"
              class="h-full bg-blue-500"
              :style="{ width: '100%' }"
            ></div>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePersonalizationStore } from '@/stores/personalization';
import { storeToRefs } from 'pinia';
import { normalizeImageUrl } from '@/utils/urlHelper';

const { adsConfig } = storeToRefs(usePersonalizationStore());
const currentIndex = ref(0);
let intervalId: number | null = null;

const activeBanners = computed(() => {
  const banners = adsConfig.value?.interBanners || [];
  const single = adsConfig.value?.interBanner;
  
  let list = banners;
  if (list.length === 0 && single) {
    list = [single];
  }

  const now = new Date();
  return list.filter((b: any) => {
    if (!b.isActive || !b.image) return false;
    
    if (b.startDate) {
      if (now < new Date(b.startDate)) return false;
    }
    if (b.endDate) {
      const end = new Date(b.endDate);
      end.setHours(23, 59, 59, 999);
      if (now > end) return false;
    }
    return true;
  });
});

const nextSlide = () => {
  if (activeBanners.value.length <= 1) return;
  currentIndex.value = (currentIndex.value + 1) % activeBanners.value.length;
};

const prevSlide = () => {
  if (activeBanners.value.length <= 1) return;
  currentIndex.value = currentIndex.value === 0 
    ? activeBanners.value.length - 1 
    : currentIndex.value - 1;
};

const startAutoSlide = () => {
  stopAutoSlide();
  if (activeBanners.value.length > 1) {
    const interval = (adsConfig.value?.sliderInterval || 6) * 1000;
    intervalId = setInterval(nextSlide, interval);
  }
};

const stopAutoSlide = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(() => {
  startAutoSlide();
});

onUnmounted(() => {
  stopAutoSlide();
});
</script>
