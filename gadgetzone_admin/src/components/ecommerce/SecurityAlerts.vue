<template>
  <div v-if="alerts.length > 0" class="sm:rounded-2xl sm:border border-red-200 bg-red-50/50 p-5 dark:border-red-900/50 dark:bg-red-900/10 sm:p-6 mb-6 shadow-sm ring-1 ring-red-200">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 animate-pulse">
          <svg class="h-5 w-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-red-800 dark:text-red-400">
          Alertes de Sécurité ({{ count }})
        </h3>
      </div>
      <button @click="fetchAlerts" class="text-sm text-red-600 hover:text-red-800 dark:text-red-400">
        <i class="las la-sync" :class="{ 'animate-spin': isLoading }"></i>
      </button>
    </div>

    <div class="space-y-3">
      <div v-for="alert in alerts" :key="alert.id" class="flex items-start justify-between rounded-lg bg-white p-4 shadow-sm border-l-4 dark:bg-gray-800" :class="alert.severity === 'critical' ? 'border-red-600' : 'border-orange-500'">
        <div class="flex items-start gap-3">
          <div class="mt-0.5">
            <i class="las la-shield-alt text-xl" :class="alert.severity === 'critical' ? 'text-red-600' : 'text-orange-500'"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-semibold text-gray-900 dark:text-white capitalize">
                {{ formatEventType(alert.event_type) }}
              </h4>
              <span class="rounded px-2 py-0.5 text-xs font-medium" :class="alert.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'">
                {{ alert.severity }}
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ alert.description }}</p>
            <div class="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span class="flex items-center gap-1"><i class="las la-network-wired"></i> IP: {{ alert.ip_address }}</span>
              <span class="flex items-center gap-1"><i class="las la-clock"></i> {{ formatDate(alert.created_at) }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <button @click="resolveAlert(alert.id)" class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition" :disabled="resolvingId === alert.id">
            <span v-if="resolvingId === alert.id" class="las la-spinner animate-spin"></span>
            <span v-else>Marquer Résolu</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { statsService } from '@/services/api';

const alerts = ref<any[]>([]);
const count = ref(0);
const isLoading = ref(false);
const resolvingId = ref<string | null>(null);
let intervalId: any = null;

const formatEventType = (type: string) => {
  const map: Record<string, string> = {
    'failed_login': 'Échec de connexion',
    'rate_limit': 'Limite de requêtes atteinte',
    'brute_force': 'Attaque Force Brute',
    'suspicious_activity': 'Activité Suspecte'
  };
  return map[type] || type.replace('_', ' ');
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

const fetchAlerts = async () => {
  try {
    isLoading.value = true;
    const res = await statsService.getSecurityAlerts();
    alerts.value = res.alerts || [];
    count.value = res.count || 0;
  } catch (error) {
    console.error('Failed to fetch security alerts:', error);
  } finally {
    isLoading.value = false;
  }
};

const resolveAlert = async (id: string) => {
  try {
    resolvingId.value = id;
    await statsService.resolveSecurityAlert(id);
    // Remove from UI immediately for snappy feeling
    alerts.value = alerts.value.filter(a => a.id !== id);
    count.value = Math.max(0, count.value - 1);
  } catch (error) {
    console.error('Failed to resolve alert:', error);
  } finally {
    resolvingId.value = null;
  }
};

onMounted(() => {
  fetchAlerts();
  // Automatically check every 30 seconds
  intervalId = setInterval(fetchAlerts, 30000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
