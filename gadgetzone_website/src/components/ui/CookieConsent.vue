<template>
  <Transition name="slide-up">
    <div v-if="!accepted" class="cookie-banner-wrapper">
      <div class="cookie-banner">
        <div class="cookie-content">
          <div class="cookie-icon">
            <i class="fas fa-cookie-bite"></i>
          </div>
          <div class="cookie-text-wrapper">
            <p class="cookie-text">
              {{ $t('common.cookie_text') }}
            </p>
            <div class="cookie-links">
              <router-link to="/privacy" class="cookie-link">{{ $t('common.cookie_learn_more') }}</router-link>
            </div>
          </div>
        </div>
        <div class="cookie-actions">
          <button @click="acceptCookies" class="btn-accept">
            {{ $t('common.cookie_accept') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { analyticsService } from '@/services/analytics'

const accepted = ref(true) // Hidden by default to avoid flash

onMounted(() => {
  const consent = localStorage.getItem('cookie_consent')
  if (!consent) {
    // Show after a small delay for better UX
    setTimeout(() => {
      accepted.value = false
    }, 1000)
  } else {
    // Already accepted, inject scripts
    analyticsService.injectScripts()
  }
})

const acceptCookies = () => {
  localStorage.setItem('cookie_consent', 'true')
  accepted.value = true
  // Inject scripts immediately after acceptance
  analyticsService.injectScripts()
}
</script>

<style scoped>
.cookie-banner-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  z-index: 9999;
  pointer-events: none;
}

.cookie-banner {
  pointer-events: auto;
  max-width: 800px;
  margin: 0 auto;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

.cookie-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.cookie-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.cookie-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cookie-text {
  color: #f8fafc;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.cookie-link {
  color: #3b82f6;
  text-decoration: underline;
  font-size: 0.75rem;
  font-weight: 500;
  transition: color 0.2s;
}

.cookie-link:hover {
  color: #60a5fa;
}

.cookie-actions {
  flex-shrink: 0;
}

.btn-accept {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-accept:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.btn-accept:active {
  transform: translateY(0);
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%) scale(0.95);
  opacity: 0;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .cookie-banner-wrapper {
    padding: 1rem;
    bottom: 60px; /* Space for bottom nav if present, else just a bit higher */
  }
  
  .cookie-banner {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
    border-radius: 1rem;
  }
  
  .btn-accept {
    width: 100%;
  }
}
</style>
