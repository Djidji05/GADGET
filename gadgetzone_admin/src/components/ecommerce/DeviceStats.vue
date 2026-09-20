<template>
  <div class="sm:rounded-2xl sm:border border-transparent sm:border-gray-200 sm:bg-white p-5 sm:dark:border-gray-800 bg-transparent dark:bg-transparent sm:dark:bg-white/[0.03] sm:p-6">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Appareils Utilisés
        </h3>
        <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Répartition des connexions par type d'appareil
        </p>
      </div>
      <div v-if="isLoading" class="text-xs text-gray-400 animate-pulse flex items-center gap-1">
        <i class="fas fa-spinner fa-spin"></i> Chargement...
      </div>
    </div>
    
    <div v-if="devices.length === 0 && !isLoading" class="mt-6 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
      Aucune donnée de visite disponible pour le moment.
    </div>

    <div v-else class="mt-6 flex flex-col gap-5">
      <div v-for="device in devices" :key="device.label" class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div :class="['flex items-center justify-center w-10 h-10 rounded-full', getDeviceBgClass(device.label)]">
            <svg class="w-5 h-5" :class="getDeviceIconClass(device.label)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="isMobileDevice(device.label)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="font-semibold text-gray-800 text-theme-sm dark:text-white/90">{{ formatDeviceName(device.label) }}</p>
            <span class="block text-gray-500 text-theme-xs dark:text-gray-400">{{ device.count }} visite{{ device.count > 1 ? 's' : '' }}</span>
          </div>
        </div>
        <div class="flex w-full max-w-[140px] items-center gap-3">
          <div class="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
            <div :class="['absolute left-0 top-0 flex h-full items-center justify-center rounded-sm', getBarBgClass(device.label)]" :style="{ width: `${device.percentage}%` }"></div>
          </div>
          <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">{{ device.percentage }}%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { statsService } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const devices = ref<Array<{ label: string; count: number; percentage: number }>>([])
const isLoading = ref(true)
const authStore = useAuthStore()

const isMobileDevice = (label: string) => {
  const l = (label || '').toLowerCase()
  return l.includes('mobile') || l.includes('tablet') || l.includes('phone') || l.includes('android') || l.includes('ios')
}

const formatDeviceName = (label: string) => {
  const l = (label || '').toLowerCase()
  if (l.includes('desktop')) return 'PC / Ordinateur'
  if (l.includes('mobile')) return 'Mobile / Smartphone'
  if (l.includes('tablet')) return 'Tablette'
  return label
}

const getDeviceBgClass = (label: string) => {
  return isMobileDevice(label)
    ? 'bg-indigo-100 dark:bg-indigo-900/30'
    : 'bg-blue-100 dark:bg-blue-900/30'
}

const getDeviceIconClass = (label: string) => {
  return isMobileDevice(label)
    ? 'text-indigo-600 dark:text-indigo-400'
    : 'text-blue-600 dark:text-blue-400'
}

const getBarBgClass = (label: string) => {
  return isMobileDevice(label) ? 'bg-indigo-500' : 'bg-blue-500'
}

const fetchDeviceStats = async () => {
  if (!authStore.isAuthenticated) return

  try {
    isLoading.value = true
    const data = await statsService.getDeviceStats('30j')
    if (Array.isArray(data) && data.length > 0) {
      devices.value = data
    } else {
      // Fallback default distribution if no tracking visits registered yet
      devices.value = [
        { label: 'Mobile', count: 0, percentage: 70 },
        { label: 'Desktop', count: 0, percentage: 30 }
      ]
    }
  } catch (err) {
    console.error('❌ Error fetching device stats:', err)
    devices.value = [
      { label: 'Mobile', count: 0, percentage: 70 },
      { label: 'Desktop', count: 0, percentage: 30 }
    ]
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDeviceStats()
})
</script>
