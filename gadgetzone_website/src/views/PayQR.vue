<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import { useUiStore } from '../stores/ui';

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();

const refCode = ref<string>('');
const paymentDetails = ref<any>(null);
const loading = ref(true);
const paying = ref(false);
const error = ref<string | null>(null);

const fetchPaymentDetails = async () => {
    try {
        loading.value = true;
        error.value = null;
        const res = await api.get(`/qr-payments/${refCode.value}`);
        paymentDetails.value = res.data;
        if (res.data.status !== 'pending') {
            error.value = 'Ce paiement QR a déjà été réglé ou a expiré.';
        }
    } catch (e: any) {
        console.error('Error fetching QR details:', e);
        error.value = e.response?.data?.message || 'Impossible de récupérer les informations de paiement.';
    } finally {
        loading.value = false;
    }
};

const processPayment = async () => {
    try {
        paying.value = true;
        const res = await api.post(`/qr-payments/${refCode.value}/pay`, {
            returnUrl: `${window.location.origin}/payment/success`
        });
        if (res.data && res.data.redirectUrl) {
            window.location.href = res.data.redirectUrl;
        } else {
            throw new Error("Redirection URL manquante.");
        }
    } catch (e: any) {
        console.error('Payment error:', e);
        uiStore.showToast(e.response?.data?.message || 'Erreur lors du traitement du paiement.', 'error');
        paying.value = false;
    }
};

onMounted(() => {
    const queryRef = route.query.ref as string;
    if (!queryRef) {
        error.value = 'Référence de paiement QR manquante.';
        loading.value = false;
    } else {
        refCode.value = queryRef;
        fetchPaymentDetails();
    }
});
</script>

<template>
    <div class="min-h-screen bg-[#FFF8F0] dark:bg-gray-950 font-sans flex flex-col justify-between py-10 px-6 transition-colors duration-500">
        <!-- Header -->
        <header class="w-full flex items-center justify-between max-w-md mx-auto">
            <button @click="router.push('/')" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white shadow-sm active:scale-95 transition-all">
                <i class="fas fa-arrow-left"></i>
            </button>
            <span class="text-sm font-black text-gray-800 dark:text-gray-200 tracking-wider uppercase">Paiement QR</span>
            <div class="w-10"></div>
        </header>

        <!-- Main Card -->
        <main class="flex-1 flex items-center justify-center py-8">
            <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100/50 dark:border-gray-800 p-8 text-center relative">
                
                <!-- Loading State -->
                <div v-if="loading" class="flex flex-col items-center justify-center min-h-[300px]">
                    <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <span class="text-xs font-bold text-gray-500 dark:text-gray-400">Récupération des détails...</span>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[300px]">
                    <div class="w-16 h-16 bg-red-100 dark:bg-red-950/30 text-red-500 rounded-full flex items-center justify-center mb-6">
                        <i class="fas fa-circle-exclamation text-2xl"></i>
                    </div>
                    <h2 class="text-xl font-black text-gray-900 dark:text-white mb-2">Erreur</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">{{ error }}</p>
                    <button @click="router.push('/')" class="w-full py-4 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-all">
                        Retour à l'accueil
                    </button>
                </div>

                <!-- Normal Content -->
                <div v-else-if="paymentDetails" class="flex flex-col items-center">
                    <!-- Store Brand -->
                    <div class="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-black shadow-sm mb-6 border border-blue-100/30">
                        <img v-if="paymentDetails.store.logoUrl" :src="paymentDetails.store.logoUrl" alt="Logo" class="w-full h-full object-cover rounded-3xl" />
                        <span v-else>{{ paymentDetails.store.name.slice(0, 2).toUpperCase() }}</span>
                    </div>

                    <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{{ paymentDetails.store.name }}</h2>
                    <span class="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mt-1">Facturation en magasin</span>

                    <div class="my-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl w-full border border-gray-100 dark:border-gray-700/50">
                        <span class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">Montant à régler</span>
                        <span class="text-4xl font-black text-blue-600 dark:text-blue-400 block tracking-tight">
                            {{ paymentDetails.amount }} <span class="text-lg">HTG</span>
                        </span>
                        <div class="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span class="font-bold">Référence :</span>
                            <code class="font-mono bg-white dark:bg-gray-900 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-800">{{ paymentDetails.ref }}</code>
                        </div>
                    </div>

                    <!-- Payment Button -->
                    <button @click="processPayment" :disabled="paying" class="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-200/50 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-50">
                        <i v-if="paying" class="fas fa-spinner animate-spin"></i>
                        <span>{{ paying ? 'Traitement en cours...' : 'Payer avec MonCash' }}</span>
                    </button>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="w-full text-center text-xs text-gray-400 dark:text-gray-600">
            Paiement 100% sécurisé via Starbee / MonCash
        </footer>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.font-sans {
    font-family: 'Outfit', sans-serif;
}
</style>
