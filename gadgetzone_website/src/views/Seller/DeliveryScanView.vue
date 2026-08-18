<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo or Premium Icon -->
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md">
          <i class="fas fa-shipping-fast text-2xl"></i>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Scanner de Livraison
      </h2>
      <p v-if="storeName" class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Boutique : <span class="font-semibold text-indigo-600 dark:text-indigo-400">{{ storeName }}</span>
      </p>
      <p v-if="expirationText" class="mt-1 text-center text-xs text-gray-400">
        Expire le : {{ expirationText }}
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-3xl sm:px-10 border border-gray-100 dark:border-gray-700">
        
        <!-- Error State (Invalid/Expired Session URL) -->
        <div v-if="sessionError" class="text-center py-6 space-y-4">
          <div class="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <i class="fas fa-exclamation-circle text-xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Lien de livraison invalide ou expiré</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Ce lien de scanner n'est plus valide ou a expiré (validité de 12 heures). Veuillez demander au vendeur de générer et partager un nouveau lien.
          </p>
        </div>

        <!-- Active Scanner State -->
        <div v-else class="space-y-6">
          
          <!-- Scanner Container -->
          <div class="space-y-4">
            <button
              @click="toggleScanner"
              class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-150 transition-all flex items-center justify-center gap-2"
            >
              <i class="fas" :class="showScanner ? 'fa-video-slash' : 'fa-camera'"></i>
              {{ showScanner ? 'Fermer la caméra' : 'Démarrer le scanner caméra' }}
            </button>

            <div v-show="showScanner" class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden p-2 bg-gray-50 dark:bg-gray-900/50">
              <div id="runner-qr-reader" style="width: 100%"></div>
            </div>
          </div>

          <!-- Manual Code Input -->
          <div class="border-t border-gray-100 dark:border-gray-700 pt-6">
            <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2" for="token-input">
              Ou saisir le jeton manuellement
            </label>
            <div class="flex gap-2">
              <input
                id="token-input"
                v-model="manualToken"
                type="text"
                placeholder="Ex: JETON12345"
                class="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-300"
              />
              <button
                @click="submitToken"
                :disabled="!manualToken.trim() || isValidating"
                class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
              >
                <i v-if="isValidating" class="fas fa-circle-notch animate-spin"></i>
                Valider
              </button>
            </div>
          </div>

          <!-- Status Message / Success Toast -->
          <div v-if="statusMessage" class="p-4 rounded-xl text-sm font-medium text-center" :class="statusClass">
            <i class="fas mr-2" :class="statusIcon"></i>
            {{ statusMessage }}
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';

const route = useRoute();

const sessionToken = ref('');
const storeName = ref('');
const expirationText = ref('');
const sessionError = ref(false);

const showScanner = ref(false);
const manualToken = ref('');
const isValidating = ref(false);

const statusMessage = ref('');
const statusType = ref<'success' | 'error' | ''>('');

const statusClass = computed(() => {
  if (statusType.value === 'success') return 'bg-green-50 text-green-700 border border-green-150';
  if (statusType.value === 'error') return 'bg-red-50 text-red-700 border border-red-150';
  return '';
});

const statusIcon = computed(() => {
  if (statusType.value === 'success') return 'fa-check-circle';
  if (statusType.value === 'error') return 'fa-exclamation-circle';
  return '';
});

let html5QrCode: Html5Qrcode | null = null;

// Base64URL decoder for client-side token info
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

onMounted(() => {
  const token = route.query.session as string;
  if (!token) {
    sessionError.value = true;
    return;
  }

  sessionToken.value = token;
  const decoded = decodeToken(token);
  
  if (!decoded || decoded.type !== 'delivery_runner' || !decoded.exp) {
    sessionError.value = true;
    return;
  }

  // Check client-side expiration
  const isExpired = Date.now() >= decoded.exp * 1000;
  if (isExpired) {
    sessionError.value = true;
    return;
  }

  storeName.value = decoded.storeName || 'Boutique du vendeur';
  expirationText.value = new Date(decoded.exp * 1000).toLocaleString('fr-FR');
});

const toggleScanner = () => {
  showScanner.value = !showScanner.value;
  if (showScanner.value) {
    setTimeout(() => {
      startScanner();
    }, 100);
  } else {
    stopScanner();
  }
};

const startScanner = () => {
  html5QrCode = new Html5Qrcode("runner-qr-reader");
  html5QrCode.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    },
    async (decodedText) => {
      console.log(`Scan livreur réussi : ${decodedText}`);
      stopScanner();
      showScanner.value = false;
      await validateToken(decodedText);
    },
    () => {}
  ).catch(err => {
    console.error("Démarrage caméra échoué", err);
    statusMessage.value = "Impossible d'accéder à la caméra.";
    statusType.value = 'error';
    showScanner.value = false;
  });
};

const stopScanner = () => {
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().then(() => {
      html5QrCode = null;
    }).catch(err => {
      console.error("Arrêt caméra échoué", err);
    });
  }
};

const submitToken = async () => {
  if (!manualToken.value.trim()) return;
  await validateToken(manualToken.value.trim());
};

const validateToken = async (deliveryTokenValue: string) => {
  try {
    isValidating.value = true;
    statusMessage.value = '';
    statusType.value = '';

    // Utilisation d'un client axios propre pour cette page publique
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';
    
    const response = await axios.post(`${backendUrl}/delivery/runner-verify`, {
      sessionToken: sessionToken.value,
      deliveryToken: deliveryTokenValue
    });

    if (response.data && response.data.success) {
      statusMessage.value = `Commande validée et marquée comme livrée avec succès !`;
      statusType.value = 'success';
      manualToken.value = '';
    }
  } catch (error: any) {
    console.error("Validation failed", error);
    const msg = error.response?.data?.error || error.message || "Code ou session de livraison invalide.";
    statusMessage.value = `Erreur : ${msg}`;
    statusType.value = 'error';
  } finally {
    isValidating.value = false;
  }
};

onBeforeUnmount(() => {
  stopScanner();
});
</script>
