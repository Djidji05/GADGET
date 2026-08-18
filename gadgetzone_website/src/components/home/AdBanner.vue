<template>
<div v-if="activeBanners.length > 0" class="ad-banners-slider relative group max-w-7xl mx-auto px-4 my-8 sm:my-12 overflow-hidden">
    <!-- Section Header (Optional, if multiple banners and they share a theme) -->
    <div v-if="activeBanners.length > 1 && adsConfig?.sliderTitle" class="text-center mb-6 md:mb-10">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900">{{ adsConfig.sliderTitle }}</h2>
    </div>

    <!-- Desktop Dual/Triple Banner Grid (PC Only when 2+ banners available) -->
    <div v-if="activeBanners.length >= 2" class="hidden lg:grid lg:grid-cols-2 gap-6">
      <div 
        v-for="(banner, index) in activeBanners.slice(0, 2)" 
        :key="'pc-grid-' + index"
        class="relative overflow-hidden rounded-3xl shadow-xl bg-gray-900 group h-[220px] transition-all hover:-translate-y-1 hover:shadow-2xl"
      >
        <img 
          :src="banner.image" 
          width="800"
          height="300"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          :alt="banner.title || 'Promotion'"
        >
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div class="absolute inset-0 z-10 flex flex-col justify-center p-8 text-white">
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
    <div :class="{ 'lg:hidden': activeBanners.length >= 2 }" class="relative overflow-hidden rounded-3xl shadow-xl bg-gray-100">
      <div 
        class="flex transition-transform duration-700 ease-in-out" 
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div 
          v-for="(banner, index) in activeBanners" 
          :key="banner.id || index" 
          class="w-full flex-shrink-0 relative aspect-[16/4.5] min-h-[200px] sm:min-h-[300px]"
          style="aspect-ratio: 16 / 4.5;"
        >
          <!-- Background Image -->
          <img 
            :src="banner.image" 
            width="1280"
            height="360"
            loading="lazy"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            :alt="banner.title || 'Promotion'"
          >
          
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>

          <!-- Content Overlay -->
          <div 
            class="absolute inset-0 z-10 flex flex-col justify-center px-8 md:px-16 text-white"
            :class="[
              banner.textAlign === 'text-right' ? 'items-end text-right' : 
              banner.textAlign === 'text-center' ? 'items-center text-center' : 
              'items-start text-left'
            ]"
          >
            <div class="max-w-xl">
              <h3 
                v-if="banner.title"
                class="mb-2 transition-all duration-500 delay-100 transform"
                :class="[
                  currentIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                  banner.titleSize || 'text-2xl md:text-4xl',
                  banner.titleWeight || 'font-extrabold'
                ]"
                :style="{ color: banner.titleColor || '#ffffff' }"
              >
                {{ banner.title }}
              </h3>
              <p 
                v-if="banner.subtitle"
                class="text-sm md:text-lg mb-6 opacity-90 transition-all duration-500 delay-200 transform"
                :class="currentIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
                :style="{ color: banner.subtitleColor || '#ffffff' }"
              >
                {{ banner.subtitle }}
              </p>
              
              <div 
                v-if="banner.link"
                class="transition-all duration-500 delay-300 transform"
                :class="currentIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
              >
                <router-link 
                  :to="banner.link" 
                  class="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-blue-600 hover:text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-blue-200"
                >
                  {{ banner.buttonText || 'Découvrir' }}
                  <i class="fas fa-arrow-right text-[10px]"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <template v-if="activeBanners.length > 1">
        <button 
          @click="prevSlide" 
          class="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-blue-600 z-20 shadow-lg"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button 
          @click="nextSlide" 
          class="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-blue-600 z-20 shadow-lg"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <!-- Indicators -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          <button 
            v-for="(_, index) in activeBanners" 
            :key="index"
            @click="currentIndex = Number(index)"
            class="h-1.5 rounded-full transition-all duration-500 bg-white/40 overflow-hidden"
            :class="currentIndex === index ? 'w-8 bg-white' : 'w-4 hover:bg-white/60'"
          >
            <div 
              v-if="currentIndex === index"
              class="h-full bg-blue-500 transition-all duration-[5000ms] linear"
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

const { adsConfig } = storeToRefs(usePersonalizationStore());
const currentIndex = ref(0);
let intervalId: number | null = null;

const activeBanners = computed(() => {
  const banners = adsConfig.value?.interBanners || [];
  // Also check old single banner format for compatibility
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

<style scoped>
.ad-banners-slider img {
  min-height: 120px;
  max-height: 450px;
}

@media (max-width: 640px) {
  .ad-banners-slider img {
    min-height: 80px;
    max-height: 250px;
  }
}
</style>
