<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        Détails de la commande #{{ order?.id }}
      </h1>
      <div class="flex items-center gap-3">
        <button
          @click="exportToPDF"
          :disabled="!order"
          class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter en PDF
        </button>
        <button
          @click="$router.back()"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Retour
        </button>
      </div>
    </div>


    
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Chargement...</p>
    </div>
    
    <div v-else-if="order" class="space-y-6">
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Colonne Gauche: Infos & Articles -->
        <div class="lg:col-span-2 space-y-6">
           <!-- Informations générales -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Informations générales</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Numéro de Commande</p>
                <p class="font-medium">{{ formatOrderId(order.id) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Date de création</p>
                <p class="font-medium">{{ formatDate(order.created_at) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Client</p>
                <p class="font-medium">{{ order.user?.name || '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p class="font-medium">{{ order.user?.email || '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                <div class="flex items-center gap-2">
                  <p class="font-medium">{{ order.user?.phone || '-' }}</p>
                  <a v-if="order.user?.phone"
                     :href="'https://wa.me/' + order.user.phone.replace(/[^0-9]/g, '')"
                     target="_blank"
                     class="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-400 border border-green-200/50 px-2 py-0.5 rounded-lg transition-colors"
                     title="Contacter sur WhatsApp"
                  >
                    <i class="lab la-whatsapp text-sm"></i>
                    WhatsApp
                  </a>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Statut Actuel</p>
                <span :class="getStatusClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p class="font-medium text-lg">{{ formatCurrency(order.total_amount) }}</p>
              </div>
              <div class="md:col-span-2">
                <p class="text-sm text-gray-600 dark:text-gray-400">Adresse de Livraison</p>
                <p class="font-medium">{{ formattedAddress }}</p>
              </div>
              <div class="md:col-span-2" v-if="order.reference_point">
                <p class="text-sm text-gray-600 dark:text-gray-400">Repère / Instructions</p>
                <p class="font-medium italic text-gray-800 dark:text-gray-200">{{ order.reference_point }}</p>
              </div>
              <div class="md:col-span-2" v-if="order.shipping_coordinates && order.shipping_coordinates.lat">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Localisation GPS</p>
                <a :href="'https://www.google.com/maps?q=' + order.shipping_coordinates.lat + ',' + order.shipping_coordinates.lng"
                   target="_blank"
                   class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-md font-semibold text-sm hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                  <i class="fas fa-map-marker-alt"></i>
                  Ouvrir dans Google Maps
                </a>
              </div>
            </div>
          </div>
          
          <!-- Articles de la commande -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Articles</h2>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b dark:border-gray-700">
                    <th class="text-left p-2">Produit</th>
                    <th class="text-left p-2">Quantité</th>
                    <th class="text-left p-2">Prix unitaire</th>
                    <th class="text-left p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item.id" class="border-b dark:border-gray-700">
                    <td class="p-2">
                      <div class="flex items-center gap-3">
                        <img alt="" v-if="item.product?.image_url" :src="item.product.image_url" class="w-10 h-10 object-cover rounded" />
                        <div class="flex flex-col">
                          <div class="font-medium text-gray-900 dark:text-white">{{ item.product?.name || '-' }}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatProductId(item.product_id) }}</div>
                          <span v-if="item.product?.store" class="text-xs text-gray-500">
                            Vendu par : <span class="font-semibold text-blue-600">{{ item.product.store.name }}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="p-2">{{ item.quantity }}</td>
                    <td class="p-2">{{ formatCurrency(item.price) }}</td>
                    <td class="p-2 font-medium">{{ formatCurrency(item.quantity * item.price) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-t-2 dark:border-gray-700">
                    <td colspan="3" class="p-2 font-semibold text-right">Total</td>
                    <td class="p-2 font-semibold text-lg">{{ formatCurrency(order.total_amount) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- Colonne Droite: Historique & Actions -->
        <div class="space-y-6">
          <!-- Actions -->
          <div v-if="authStore.isAdmin" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Mettre à jour le statut</h2>
            
            <div v-if="['delivered', 'cancelled', 'cancelled_refund_pending'].includes(order.status)" class="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-md text-sm mb-4">
              <i class="fas fa-info-circle mr-2"></i>
              Cette commande est déjà {{ getStatusText(order.status).toLowerCase() }}. Le statut ne peut plus être modifié.
            </div>

            <div v-else-if="order.status === 'partially_paid'" class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-md text-sm mb-4 font-bold border border-red-100">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              PAIEMENT INCOMPLET. En attente du paiement du solde par le client. NE PAS EXPÉDIER.
            </div>

            <div class="space-y-4">
              <select
                v-model="newStatus"
                :disabled="isUpdating || ['delivered', 'cancelled', 'partially_paid', 'cancelled_refund_pending'].includes(order.status)"
                class="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="">Sélectionner un statut</option>
                <option value="pending">En attente</option>
                <option value="partially_paid">Paiement Incomplet</option>
                <option value="confirmed">Confirmée</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
                <option value="cancelled_refund_pending">Remboursement</option>
              </select>



              <button
                @click="updateStatus"
                :disabled="!newStatus || isUpdating || newStatus === order.status || ['delivered', 'cancelled', 'partially_paid', 'cancelled_refund_pending'].includes(order.status)"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
              >
                <svg v-if="isUpdating" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isUpdating ? 'Mise à jour...' : 'Mettre à jour' }}
              </button>
            </div>
          </div>

          <!-- Validation par Scan QR (Confirm-to-Deliver) -->
          <div v-if="authStore.isAdmin && order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'partially_paid'" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 20h2a2 2 0 002-2v-2m-2-12a2 2 0 00-2-2h-2m-8 16H4a2 2 0 01-2-2v-2m2-12a2 2 0 012-2h2" />
              </svg>
              Validation de Livraison
            </h2>
            <p class="text-xs text-gray-500 mb-4">
              Scannez le code QR du client ou entrez le jeton de livraison pour confirmer et marquer la commande comme livrée.
            </p>

            <div class="space-y-4">
              <!-- Bouton pour activer/désactiver le scanner photo -->
              <button
                @click="toggleQRScanner"
                class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex justify-center items-center gap-2 text-sm font-semibold"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ showScanner ? 'Fermer le scanner camera' : 'Activer le scanner camera' }}
              </button>

              <!-- Élément HTML pour accueillir le flux vidéo du scanner -->
              <div v-show="showScanner" class="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900/50 p-2">
                <div id="qr-reader" style="width: 100%"></div>
              </div>

              <!-- Option de saisie manuelle du jeton -->
              <div class="border-t border-gray-100 dark:border-gray-700 pt-4">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" for="manual-token">
                  Ou saisie manuelle du jeton
                </label>
                <div class="flex gap-2">
                  <input
                    id="manual-token"
                    v-model="manualToken"
                    type="text"
                    placeholder="Ex: JETON12345"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                  />
                  <button
                    @click="submitManualToken"
                    :disabled="!manualToken.trim() || isValidating"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-semibold flex items-center gap-1"
                  >
                    <svg v-if="isValidating" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Valider
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Historique de la commande (Timeline) -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Historique de la commande</h2>
            
            <div class="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-6">
              
              <!-- Timeline Items from Logs -->
              <div v-for="log in order.logs" :key="log.id" class="relative">
                <div class="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800" 
                     :class="getLogColor(log.new_status)"></div>
                
                <div class="text-sm">
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ getStatusText(log.new_status) }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {{ formatDate(log.created_at) }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-300">
                    Par: <span class="font-semibold">{{ log.actor?.name || 'Système' }}</span>
                  </p>
                </div>
              </div>

               <!-- Fallback if no logs (show current dates) -->
               <div v-if="(!order.logs || order.logs.length === 0)" class="space-y-6">
                  <div v-if="order.created_at" class="relative">
                    <div class="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gray-400 border-2 border-white dark:border-gray-800"></div>
                    <div class="text-sm">
                      <p class="font-medium">Création</p>
                      <p class="text-xs text-gray-500">{{ formatDate(order.created_at) }}</p>
                    </div>
                  </div>
                  <div v-if="order.confirmed_at" class="relative">
                    <div class="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800"></div>
                    <div class="text-sm">
                      <p class="font-medium">Confirmée</p>
                      <p class="text-xs text-gray-500">{{ formatDate(order.confirmed_at) }}</p>
                    </div>
                  </div>
                  <div v-if="order.shipped_at" class="relative">
                    <div class="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-purple-500 border-2 border-white dark:border-gray-800"></div>
                    <div class="text-sm">
                      <p class="font-medium">Expédiée</p>
                      <p class="text-xs text-gray-500">{{ formatDate(order.shipped_at) }}</p>
                    </div>
                  </div>
                  <div v-if="order.delivered_at" class="relative">
                    <div class="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                    <div class="text-sm">
                      <p class="font-medium">Livrée</p>
                      <p class="text-xs text-gray-500">{{ formatDate(order.delivered_at) }}</p>
                    </div>
                  </div>
               </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { orderService, deliveryService } from '@/services/api'
import type { Order } from '@/types'
import { formatOrderId, formatProductId } from '@/utils/formatters';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

const route = useRoute()
const authStore = useAuthStore()

const order = ref<Order | null>(null)
const isLoading = ref(true)
const isUpdating = ref(false)
const newStatus = ref('')

const showScanner = ref(false)
const manualToken = ref('')
const isValidating = ref(false)

let html5QrCode: Html5Qrcode | null = null;

const toggleQRScanner = () => {
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
  html5QrCode = new Html5Qrcode("qr-reader");
  html5QrCode.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    },
    async (decodedText) => {
      console.log(`Scan réussi : ${decodedText}`);
      stopScanner();
      showScanner.value = false;
      await validateDeliveryToken(decodedText);
    },
    () => {}
  ).catch(err => {
    console.error("Impossible de démarrer le scanner camera", err);
    alert("Impossible d'accéder à la caméra. Vérifiez les permissions.");
    showScanner.value = false;
  });
};

const stopScanner = () => {
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().then(() => {
      html5QrCode = null;
    }).catch(err => {
      console.error("Erreur lors de l'arrêt du scanner", err);
    });
  }
};

const submitManualToken = async () => {
  if (!manualToken.value.trim()) return;
  await validateDeliveryToken(manualToken.value.trim());
};

const validateDeliveryToken = async (tokenValue: string) => {
  try {
    isValidating.value = true;
    if (!order.value) return;

    await deliveryService.verifyScan(order.value.id, tokenValue);
    alert("Livraison validée et confirmée avec succès !");
    manualToken.value = '';
    await fetchOrder();
  } catch (error: any) {
    console.error("Erreur lors de la validation du jeton :", error);
    const message = error.response?.data?.details || error.response?.data?.error || error.message || "Code invalide ou expiré.";
    alert(`Échec de la validation : ${message}`);
  } finally {
    isValidating.value = false;
  }
};

onBeforeUnmount(() => {
  stopScanner();
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'HTG'
  }).format(value)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium',
    partially_paid: 'bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium',
    confirmed: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium',
    shipped: 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium',
    delivered: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium',
    cancelled: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium',
    cancelled_refund_pending: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: 'En attente',
    partially_paid: 'Paiement Incomplet',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    cancelled_refund_pending: 'Remboursement'
  }
  return texts[status] || status
}

const getLogColor = (status: string) => {
    switch(status) {
        case 'pending': return 'bg-yellow-500';
        case 'partially_paid': return 'bg-orange-500';
        case 'confirmed': return 'bg-blue-500';
        case 'shipped': return 'bg-purple-500';
        case 'delivered': return 'bg-green-500';
        case 'cancelled': return 'bg-red-500';
        case 'cancelled_refund_pending': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}

const fetchOrder = async () => {
  try {
    isLoading.value = true
    const fetchedOrder = await orderService.getById(Number(route.params.id))
    order.value = fetchedOrder
    newStatus.value = fetchedOrder.status
  } catch (error) {
    console.error('Erreur lors du chargement de la commande:', error)
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async () => {
  if (!newStatus.value) return
  
  try {
    isUpdating.value = true
    await orderService.updateOrder(Number(route.params.id), { 
      status: newStatus.value as any
    })
    await fetchOrder() // Recharger pour avoir les nouveaux logs
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  } finally {
    isUpdating.value = false
  }
}



const exportToPDF = () => {
  if (!order.value) return;

  const doc = new jsPDF();
  const themeColor: [number, number, number] = [37, 99, 235]; // Blue-600

  // Header Title
  doc.setFontSize(22);
  doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
  doc.text('HTFASIL', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('FACTURE DE COMMANDE', 14, 28);

  // Horizontal line
  doc.setDrawColor(230);
  doc.line(14, 32, 190, 32);

  // Order Info
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text(`Commande: ${formatOrderId(order.value.id)}`, 14, 45);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Date: ${formatDate(order.value.created_at)}`, 14, 52);
  doc.text(`Statut: ${getStatusText(order.value.status)}`, 14, 57);

  // Customer Section
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', 130, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`${order.value.user?.name || '-'}`, 130, 52);
  doc.text(`${order.value.user?.email || '-'}`, 130, 57);
  
  // Shipping Address
  doc.setFont('helvetica', 'bold');
  doc.text('ADRESSE DE LIVRAISON', 14, 75);
  doc.setFont('helvetica', 'normal');
  const splitAddress = doc.splitTextToSize(formattedAddress.value, 80);
  doc.text(splitAddress, 14, 82);

  // Table of Items
  const tableData = (order.value.items || []).map(item => [
    item.product?.name || '-',
    item.product?.store?.name || 'Inconnue',
    item.quantity.toString(),
    new Intl.NumberFormat('fr-FR').format(item.price), // Sans HTG
    formatCurrency(item.quantity * item.price)
  ]);

  autoTable(doc, {
    startY: 100,
    head: [['Produit', 'Boutique', 'Qté', 'Prix Unit.', 'Total']],
    body: tableData,
    headStyles: { fillColor: themeColor, textColor: 255, halign: 'left' },
    alternateRowStyles: { fillColor: [245, 247, 251] },
    margin: { left: 14, right: 14 },
    theme: 'striped',
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 40 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 35, halign: 'center' }
    },
    didParseCell: (data) => {
      // Pour le statut dans l'entête du document, c'est déjà fait manuellement, 
      // ici on pourrait colorer une cellule du tableau si besoin, 
      // mais le statut général est en haut.
      // Cependant, pour la cohérence, si on veut colorer le texte du statut en haut :
    }
  });

  // Pour colorer le statut en haut du document (car c'est là qu'il se trouve dans OrderDetail)
  const statusColors: Record<string, [number, number, number]> = {
    pending: [133, 77, 14], // Yellow-800
    partially_paid: [154, 52, 18], // Orange-800
    confirmed: [30, 64, 175], // Blue-800
    processing: [55, 48, 163], // Indigo-800
    shipped: [107, 33, 168], // Purple-800
    delivered: [22, 101, 52], // Green-800
    cancelled: [153, 27, 27], // Red-800
    cancelled_refund_pending: [153, 27, 27] // Red-800
  };
  
  if (statusColors[order.value.status]) {
    const color = statusColors[order.value.status];
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont('helvetica', 'bold');
  }
  doc.text(`Statut: ${getStatusText(order.value.status)}`, 14, 57);
  doc.setTextColor(0); // Reset to black
  doc.setFont('helvetica', 'normal');

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`TOTAL FINAL: ${formatCurrency(order.value.total_amount)}`, 14, finalY);

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('Merci de votre confiance | HTFasil Market', 105, pageHeight - 10, { align: 'center' });

  // Save the PDF
  doc.save(`Commande_${order.value.id}.pdf`);
};



const formattedAddress = computed(() => {
    if (!order.value || !order.value.shipping_address) return 'Non spécifiée';
    try {
        if (order.value.shipping_address.startsWith('{')) {
            const addr = JSON.parse(order.value.shipping_address);
            return `${addr.street || ''}, ${addr.city || ''}, ${addr.country || ''}`;
        }
        return order.value.shipping_address;
    } catch (e) {
        return order.value.shipping_address;
    }
});

onMounted(() => {
  fetchOrder()
})
</script>
