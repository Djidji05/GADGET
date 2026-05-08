<template>
<div 
    v-if="adsConfig?.topBar?.isActive && isVisible" 
    class="announcement-bar py-2 overflow-hidden flex whitespace-nowrap text-xs sm:text-sm font-medium transition-all bg-blue-600"
    :style="{ backgroundColor: adsConfig.topBar.backgroundColor, color: adsConfig.topBar.textColor }"
  >
    <div class="marquee-track">
      <div v-for="n in 10" :key="n" class="marquee-item px-4">
        <router-link v-if="adsConfig.topBar.link" :to="adsConfig.topBar.link" class="hover:underline">
          {{ adsConfig.topBar.text }}
        </router-link>
        <span v-else>{{ adsConfig.topBar.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePersonalizationStore } from '@/stores/personalization';
import { storeToRefs } from 'pinia';

const { adsConfig } = storeToRefs(usePersonalizationStore());

const isVisible = computed(() => {
  const config = adsConfig.value?.topBar;
  if (!config) return false;
  
  const now = new Date();
  if (config.startDate) {
    const start = new Date(config.startDate);
    if (now < start) return false;
  }
  if (config.endDate) {
    const end = new Date(config.endDate);
    end.setHours(23, 59, 59, 999); // End of the day
    if (now > end) return false;
  }
  
  return !!config.text;
});
</script>

<style scoped>
.announcement-bar {
  z-index: 100;
  position: relative;
  width: 100%;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 30s linear infinite;
}

.marquee-item {
  flex-shrink: 0;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Pause on hover */
.announcement-bar:hover .marquee-track {
  animation-play-state: paused;
}
</style>
