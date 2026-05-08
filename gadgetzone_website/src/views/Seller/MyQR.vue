<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../../services/api';
import { useNotificationsStore } from '../../stores/notifications';
import { useUiStore } from '../../stores/ui';
import { Html5Qrcode } from 'html5-qrcode';

const router = useRouter();
const notificationsStore = useNotificationsStore();
const uiStore = useUiStore();

const store = ref<any>(null);
const loading = ref(true);
const imageError = ref(false);
const activeTab = ref('shop_qr'); // Default to Mon QR

// Scanner State
const scannerActive = ref(false);
const scanning = ref(false);
const scanResult = ref<any>(null);
const scanError = ref<string | null>(null);
const html5QrCode = ref<Html5Qrcode | null>(null);
const scannerId = "qr-reader";
const fileInput = ref<HTMLInputElement | null>(null);

const fetchStoreData = async () => {
    try {
        loading.value = true;
        const res = await api.get('/vendors/me');
        store.value = res.data;
    } catch (e) {
        console.error("Error fetching store data", e);
    } finally {
        loading.value = false;
    }
};

const storeUrl = computed(() => {
    if (!store.value) return '';
    const origin = window.location.origin;
    return `${origin}/store/${store.value.id}`;
});

const qrImageUrl = computed(() => {
    if (!storeUrl.value) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=1e3a8a&bgcolor=ffffff&data=${encodeURIComponent(storeUrl.value)}`;
});

// Scanner Methods
const startScanner = async () => {
    if (scannerActive.value) return;
    
    scanResult.value = null;
    scanError.value = null;
    scannerActive.value = true;
    
    try {
        // Wait for DOM
        setTimeout(async () => {
            if (!html5QrCode.value) {
                html5QrCode.value = new Html5Qrcode(scannerId);
            }
            
            const config = { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };
            
            await html5QrCode.value.start(
                { facingMode: "environment" }, 
                config, 
                onScanSuccess,
                onScanFailure
            );
        }, 300);
    } catch (err) {
        console.error("Failed to start scanner", err);
        scanError.value = "Impossible d'accéder à la caméra.";
        scannerActive.value = false;
    }
};

const stopScanner = async () => {
    if (!html5QrCode.value || !scannerActive.value) return;
    
    try {
        await html5QrCode.value.stop();
        scannerActive.value = false;
    } catch (err) {
        console.error("Failed to stop scanner", err);
    }
};

const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;

    if (!html5QrCode.value) {
        html5QrCode.value = new Html5Qrcode(scannerId);
    }

    const scanner = html5QrCode.value;

    try {
        scanning.value = true;
        const decodedText = await scanner.scanFile(file, true);
        onScanSuccess(decodedText);
    } catch (err) {
        console.error("Error scanning file", err);
        scanResult.value = {
            success: false,
            message: "Aucun QR code valide trouvé dans cette image."
        };
    } finally {
        scanning.value = false;
    }
};

const onScanSuccess = async (decodedText: string) => {
    console.log("Scan Result:", decodedText);
    
    if (scannerActive.value) {
        await stopScanner();
    }
    
    try {
        scanning.value = true;
        
        // Simple heuristic: extract ID from order URL or match numeric
        let orderId = decodedText;
        if (decodedText.includes('/orders/')) {
            const parts = decodedText.split('/orders/');
            orderId = parts[1] ? parts[1].split('?')[0]! : '';
        }
        
        if (!orderId) throw new Error("Format QR invalide");

        // Call API to mark as delivered
        const res = await api.patch(`/vendors/me/orders/${orderId}`, { status: 'delivered' });
        
        scanResult.value = {
            success: true,
            orderId,
            message: "Livraison confirmée avec succès !"
        };
        
        notificationsStore.fetchNotifications(true);
        
    } catch (err: any) {
        console.error("Scan processing failed", err);
        scanResult.value = {
            success: false,
            message: err.response?.data?.message || "Erreur lors de la validation de la livraison."
        };
    } finally {
        scanning.value = false;
    }
};

const onScanFailure = (error: any) => {
    // Only log errors that aren't "no QR code found" noise
    // console.warn(`QR error = ${error}`);
};

const shareToWhatsApp = () => {
    const text = `Découvrez ma boutique sur HTFasil ! 🚀 Voici le lien : ${storeUrl.value}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
};

const downloadQR = async () => {
    try {
        const response = await fetch(qrImageUrl.value);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `HTFasil-QR-${store.value?.name || 'Boutique'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (e) {
        console.error("Download failed", e);
        uiStore.showToast("Erreur lors du téléchargement", "error");
    }
};

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(storeUrl.value);
        uiStore.showToast('Lien copié !', 'success');
    } catch (e) {
        console.error("Failed to copy", e);
    }
};

const route = useRoute();

onMounted(() => {
    fetchStoreData();
    notificationsStore.fetchNotifications(true);
    
    // Hide main seller bottom nav while on this page to avoid redundancy
    uiStore.isSellerNavVisible = false;

    // Direct access to scanner via query param
    if (route.query.tab === 'scanner') {
        activeTab.value = 'scanner';
        // Small delay to ensure DOM is ready for scanner
        setTimeout(() => {
            startScanner();
        }, 500);
    }
});

onUnmounted(() => {
    if (scannerActive.value) {
        stopScanner();
    }
    // Always restore bottom nav when leaving the page
    uiStore.isSellerNavVisible = true;
});
</script>

<template>
<div class="min-h-screen font-sans relative overflow-hidden transition-colors duration-500" :class="activeTab === 'scanner' ? 'bg-black' : 'bg-[#FFF8F0]'">
        
        <!-- FULL SCREEN CAMERA BACKGROUND -->
        <div v-show="activeTab === 'scanner'" class="fixed inset-0 z-0">
            <div id="qr-reader" class="w-full h-full"></div>
            <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <!-- MAIN UI OVERLAY -->
        <div class="relative z-10 flex flex-col min-h-screen">
            <!-- HEADER -->
            <header class="px-6 py-8 flex items-center justify-between bg-transparent backdrop-blur-md">
                <button @click="router.push('/seller/dashboard')" class="w-10 h-10 flex items-center justify-center rounded-2xl active:scale-95 transition-all"
                        :class="activeTab === 'scanner' ? 'text-white' : 'text-gray-900'">
                    <i class="fas fa-chevron-left text-xl"></i>
                </button>
                <h1 class="text-lg font-bold tracking-tight" :class="activeTab === 'scanner' ? 'text-white' : 'text-gray-900'">
                    {{ activeTab === 'scanner' ? 'Scanner le code QR' : 'Mon code QR' }}
                </h1>
                <div class="w-10"></div>
            </header>

            <!-- SCANNER TAB CONTENT -->
            <div v-if="activeTab === 'scanner'" class="flex-1 flex flex-col items-center px-8 pt-6 animate-in fade-in duration-700">
                <div class="text-center mb-8 relative">
                    <h2 class="text-3xl font-black tracking-tighter mb-2 text-white drop-shadow-lg">HTFasil</h2>
                    <p class="text-[12px] font-medium text-white/80 leading-relaxed max-w-[250px] mx-auto drop-shadow-md">
                        Placer le code QR du client dans le cadre ou téléverser une image.
                    </p>
                </div>

                <div class="relative w-full aspect-square max-w-[260px]">
                    <div class="absolute inset-0 rounded-[40px] border-2 border-white/40 shadow-[0_0_0_1000px_rgba(0,0,0,0.4)]"></div>
                    <div class="absolute inset-0 pointer-events-none">
                         <div class="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-[25px]"></div>
                         <div class="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-[25px]"></div>
                         <div class="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-[25px]"></div>
                         <div class="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-[25px]"></div>
                         <button class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center pointer-events-auto active:scale-90 transition-all border border-white/20">
                             <i class="fas fa-bolt-lightning text-white text-base"></i>
                         </button>
                    </div>
                    <div class="absolute left-4 right-4 h-0.5 bg-blue-500/80 shadow-[0_0_15px_rgba(37,99,235,1)] blur-[0.5px] animate-scan-line"></div>
                </div>

                <button @click="fileInput?.click()" class="mt-12 flex items-center gap-2 group active:scale-95 transition-all">
                    <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center border border-white/10 group-hover:bg-white/30 transition-colors">
                        <i class="fas fa-image text-white text-xs"></i>
                    </div>
                    <span class="text-[11px] font-black text-white uppercase tracking-widest">Téléverser un QR</span>
                    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
                </button>
            </div>

            <!-- SHOP QR TAB CONTENT (Reference Image Style) -->
            <div v-else class="flex-1 flex flex-col items-center px-6 pt-4 animate-in fade-in duration-700">
                <div v-if="store" class="w-full max-w-[340px] bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative">
                    <!-- QR SECTION -->
                    <div class="p-8 pb-4 flex flex-col items-center">
                        <div class="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
                            <img :src="qrImageUrl" alt="QR Code" class="w-[220px] h-[220px] object-contain" />
                        </div>
                        
                        <h3 class="text-xl font-black text-gray-900 tracking-tight uppercase">{{ store.name }}</h3>
                        <p class="text-gray-500 font-bold text-sm mt-1 mb-4">{{ store.phone || 'HTFasil Vendor' }}</p>
                    </div>

                    <!-- TICKET DIVIDER -->
                    <div class="relative py-2 flex items-center">
                        <div class="absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FFF8F0]"></div>
                        <div class="flex-1 border-t-2 border-dashed border-gray-100"></div>
                        <div class="absolute right-0 translate-x-1/2 w-8 h-8 rounded-full bg-[#FFF8F0]"></div>
                    </div>

                    <!-- ACTION SECTION -->
                    <div class="px-8 py-6 flex items-center justify-around">
                        <button @click="shareToWhatsApp" class="flex items-center gap-2 group active:scale-95 transition-all">
                            <i class="fas fa-share-nodes text-blue-600 text-lg"></i>
                            <span class="text-[11px] font-black text-gray-700">Partager le QR</span>
                        </button>
                        <div class="w-[1px] h-6 bg-gray-100"></div>
                        <button @click="downloadQR" class="flex items-center gap-2 group active:scale-95 transition-all">
                            <i class="fas fa-file-arrow-down text-blue-600 text-lg"></i>
                            <span class="text-[11px] font-black text-gray-700">Télécharger</span>
                        </button>
                    </div>
                </div>

                <div v-if="loading" class="w-full max-w-[340px] bg-white animate-pulse rounded-[32px] h-[500px]"></div>
            </div>

            <!-- Overlays & Feedback -->
            <div v-if="scanning" class="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
                <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h4 class="text-white font-black text-xl tracking-tight">Vérification...</h4>
            </div>

            <div v-if="scanResult" class="fixed inset-0 bg-white z-[110] flex flex-col items-center justify-center p-10 text-center animate-in zoom-in">
                <div class="w-20 h-20 rounded-[28px] flex items-center justify-center mb-6 shadow-2xl"
                     :class="scanResult.success ? 'bg-green-500 text-white shadow-green-200' : 'bg-red-500 text-white shadow-red-200'">
                    <i class="fas text-3xl" :class="scanResult.success ? 'fa-check' : 'fa-times'"></i>
                </div>
                <h4 class="text-gray-900 font-black text-2xl tracking-tight mb-2">{{ scanResult.success ? 'Succès !' : 'Oups...' }}</h4>
                <p class="text-gray-500 font-bold text-sm leading-relaxed mb-10">{{ scanResult.message }}</p>
                <button @click="scanResult = null; startScanner()" class="w-full py-4 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all">
                    Recommencer
                </button>
            </div>
        </div>

        <!-- NEW BOTTOM TAB BAR (Reference Image Style) -->
        <div class="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-[350px] px-6">
            <div class="flex items-center bg-white rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.08)] p-1.5 h-[64px] border border-gray-100">
                <button 
                  @click="activeTab = 'scanner'; startScanner()"
                  class="flex-1 flex items-center justify-center gap-3 rounded-full h-full transition-all duration-300 active:scale-95"
                  :class="activeTab === 'scanner' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'"
                >
                    <i class="fas fa-table-cells-large text-lg"></i>
                    <span class="text-[10px] font-black uppercase tracking-tight">Scanner le QR</span>
                </button>
                <button 
                  @click="activeTab = 'shop_qr'; stopScanner()"
                  class="flex-1 flex items-center justify-center gap-3 rounded-full h-full transition-all duration-300 active:scale-95"
                  :class="activeTab === 'shop_qr' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'"
                >
                    <i class="fas fa-barcode text-lg"></i>
                    <div class="flex flex-col items-start leading-[1]">
                        <span class="text-[10px] font-black uppercase">Mon</span>
                        <span class="text-[10px] font-black uppercase">QR</span>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.font-sans {
    font-family: 'Outfit', sans-serif;
}

#qr-reader {
    background: black !important;
}

#qr-reader :deep(video) {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
}

#qr-reader :deep(canvas) {
    display: none !important;
}

/* Hide library's internal UI */
#qr-reader__dashboard, #qr-reader__header_message, #qr-reader__status_span {
    display: none !important;
}

/* Animations */
@keyframes scan-line {
    0% { top: 10%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 90%; opacity: 0; }
}
.animate-scan-line {
    animation: scan-line 2.5s ease-in-out infinite;
}

.animate-in { animation-duration: 0.6s; animation-fill-mode: both; }
.fade-in { animation-name: fadeIn; }
.zoom-in { animation-name: zoomIn; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
