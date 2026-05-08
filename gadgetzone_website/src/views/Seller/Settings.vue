<template>
  <div class="w-full md:pt-4 pb-12">
    <!-- MOBILE HEADER (Blue Gradient Theme) -->
    <div class="md:hidden bg-gray-50 -mt-2 font-sans relative">
        <!-- Top Section -->
        <div class="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 pt-8 pb-16 relative rounded-b-[40px] shadow-lg shadow-blue-900/20">
            <div class="flex justify-between items-center mb-0 relative z-10">
                <button @click="router.back()" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md active:scale-95 transition-all">
                    <i class="fas fa-arrow-left text-sm"></i>
                </button>
                <h1 class="font-bold text-lg tracking-wide">Paramètres Boutique</h1>
                <div class="w-10"></div>
            </div>
        </div>

        <!-- Floating Profile Card -->
        <div class="px-5 -mt-10 relative z-20">
            <div class="bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 text-center relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-24 bg-gray-50">
                    <img v-if="form.bannerUrl" :src="form.bannerUrl" class="w-full h-full object-cover opacity-80" />
                    <div v-else class="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200"></div>
                    
                    <!-- Banner Upload Button -->
                    <button @click="bannerInput?.click()" class="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all active:scale-95">
                        <i class="fas fa-camera text-xs"></i>
                    </button>
                    <input type="file" ref="bannerInput" class="hidden" @change="handleBannerUpload" accept="image/*" />
                </div>

                <div class="relative mt-8 mb-2">
                    <div class="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden relative group">
                        <img v-if="form.logoUrl" :src="form.logoUrl" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                             <i class="fas fa-store text-3xl"></i>
                        </div>
                        
                        <!-- Logo Upload Overlay -->
                        <div @click="logoInput?.click()" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <i class="fas fa-camera text-white"></i>
                        </div>
                    </div>
                    <button @click="logoInput?.click()" class="absolute bottom-0 right-1/2 translate-x-10 bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md active:scale-95">
                        <i class="fas fa-plus text-[10px]"></i>
                    </button>
                    <input type="file" ref="logoInput" class="hidden" @change="handleLogoUpload" accept="image/*" />
                </div>

                <h2 class="font-bold text-xl text-gray-900">{{ form.name || 'Nom de votre boutique' }}</h2>
                <p class="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Vendeur #{{ sellerId }}</p>
            </div>
        </div>
    </div>


    <!-- DESKTOP LAYOUT -->
    <div class="flex flex-col md:flex-row gap-6 md:items-start mt-6 md:mt-0">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content -->
      <div class="flex-1 w-full pb-24 md:pb-10">
          
        <!-- Desktop Header -->
        <div class="hidden md:flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Paramètres de la Boutique</h1>
                <p class="text-gray-500 text-sm mt-1">Personnalisez l'apparence et les informations de votre commerce.</p>
            </div>
            <button 
                @click="saveSettings" 
                :disabled="saving"
                class="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 transition-all active:scale-95 flex items-center gap-2"
            >
                <i v-if="saving" class="fas fa-circle-notch animate-spin"></i>
                <span v-else>Enregistrer</span>
            </button>
        </div>

        <!-- Form Container -->
        <form @submit.prevent="saveSettings" class="space-y-6">
            
            <!-- Desktop Logo & Banner Upload -->
            <div class="hidden md:block bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6">
                <div class="h-32 w-full bg-gray-50 relative group">
                    <img v-if="form.bannerUrl" :src="form.bannerUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200"></div>
                    <button @click="bannerInput?.click()" class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-sm">
                        <i class="fas fa-camera mr-2"></i> Changer la bannière
                    </button>
                </div>
                <div class="px-6 pb-6 relative flex items-end gap-6">
                    <div class="relative -mt-10">
                        <div class="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-gray-100 overflow-hidden relative group">
                            <img v-if="form.logoUrl" :src="form.logoUrl" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                <i class="fas fa-store text-3xl"></i>
                            </div>
                            <div @click="logoInput?.click()" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <i class="fas fa-camera text-white"></i>
                            </div>
                        </div>
                    </div>
                    <div class="pb-2">
                        <h4 class="font-bold text-gray-900">Logo & Bannière</h4>
                        <p class="text-xs text-gray-500">Cliquez sur les images pour les modifier.</p>
                    </div>
                </div>
            </div>

            <!-- Basic Info Card -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm"><i class="fas fa-info"></i></span>
                    Informations Générales
                </h3>
                
                <div class="grid grid-cols-1 gap-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nom de la boutique</label>
                        <input 
                            v-model="form.name" 
                            type="text" 
                            placeholder="Ex: HTFasil Officiel"
                            class="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                        <textarea 
                            v-model="form.description" 
                            rows="4" 
                            placeholder="Décrivez votre activité, vos produits..."
                            class="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400 resize-none"
                        ></textarea>
                        <p class="text-right text-[10px] text-gray-400 mt-1 font-bold">{{ form.description.length }}/500</p>
                    </div>
                </div>
            </div>

            <!-- Contact & Socials Card -->
             <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm"><i class="fas fa-address-card"></i></span>
                    Contact & Réseaux
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Téléphone</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"><i class="fas fa-phone"></i></span>
                            <input 
                                v-model="form.phone" 
                                type="tel" 
                                placeholder="+509 ..."
                                class="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                        </div>
                    </div>

                     <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Adresse</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"><i class="fas fa-map-marker-alt"></i></span>
                            <input 
                                v-model="form.address" 
                                type="text" 
                                placeholder="Port-au-Prince, Haïti"
                                class="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Facebook</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-sm"><i class="fab fa-facebook-f"></i></span>
                            <input 
                                v-model="form.facebook" 
                                type="url" 
                                placeholder="https://facebook.com/..."
                                class="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Instagram</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600 text-sm"><i class="fab fa-instagram"></i></span>
                            <input 
                                v-model="form.instagram" 
                                type="url" 
                                placeholder="https://instagram.com/..."
                                class="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-pink-500/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

            </div>

            <!-- Withdrawal Methods Card -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm"><i class="fas fa-wallet"></i></span>
                    Méthodes de Retrait
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">MonCash</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 text-sm font-black">M</span>
                            <input 
                                v-model="form.moncashNumber" 
                                type="tel" 
                                placeholder="Numéro MonCash..."
                                class="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-red-500/20 transition-all font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Natcash</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-black">N</span>
                            <input 
                                v-model="form.natcashNumber" 
                                type="tel" 
                                placeholder="Numéro Natcash..."
                                class="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                            />
                        </div>
                    </div>
                </div>
            </div>


        </form>
      </div>
    </div>


    <!-- Mobile Sticky Save Button (Moved up to avoid bottom nav overlap) -->
    <div class="md:hidden fixed bottom-[60px] left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40 pb-[env(safe-area-inset-bottom,0)]">
        <button 
            @click="saveSettings" 
            :disabled="saving"
            class="w-full bg-gray-900 text-white rounded-2xl py-4 font-bold text-sm shadow-xl shadow-gray-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
             <i v-if="saving" class="fas fa-circle-notch animate-spin"></i>
             <span v-else>Enregistrer les modifications</span>
        </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();

const logoInput = ref<HTMLInputElement | null>(null);
const bannerInput = ref<HTMLInputElement | null>(null);

const saving = ref(false);
const sellerId = ref('');
const form = reactive({
    name: '',
    description: '',
    logoUrl: '',
    bannerUrl: '', // New field
    phone: '',     // New field
    address: '',   // New field
    facebook: '',  // New field
    instagram: '',  // New field
    moncashNumber: '', // New field
    natcashNumber: ''  // New field
});

onMounted(async () => {
    try {
        const res = await api.get('/vendors/me');
        const store = res.data;
        Object.assign(form, {
            name: store.name,
            description: store.description || '',
            logoUrl: store.logoUrl || '',
            bannerUrl: store.bannerUrl || '',
            phone: store.phone || '',
            address: store.address || '',
            facebook: store.facebook || '',
            instagram: store.instagram || '',
            moncashNumber: store.moncashNumber || '',
            natcashNumber: store.natcashNumber || ''
        });
        sellerId.value = store.id || '---';
    } catch (e) {
        console.error("Failed to load settings", e);
    }
});

const handleUpload = async (file: File, type: 'logo' | 'banner') => {
    if (file.size > 5 * 1024 * 1024) {
        uiStore.showToast("Image trop volumineuse (max 5MB)", "warning");
        return;
    }

    const formData = new FormData();
    formData.append('images', file);

    try {
        saving.value = true;
        const uploadRes = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3003';
        const url = `${baseUrl}${uploadRes.data.urls[0]}`;
        
        if (type === 'logo') form.logoUrl = url;
        else form.bannerUrl = url;

    } catch (e) {
        console.error("Upload failed", e);
        uiStore.showToast("Erreur lors de l'envoi de l'image", "error");
    } finally {
        saving.value = false;
    }
};

const handleLogoUpload = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) handleUpload(input.files[0], 'logo');
};

const handleBannerUpload = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) handleUpload(input.files[0], 'banner');
};

const saveSettings = async () => {
    saving.value = true;
    try {
        await api.put('/vendors/me', form);
        // Show success toast (basic alert for now, ideally use a toast component)
        // alert('Modifications enregistrées !'); 
        // Or create a visual feedback
    } catch (e) {
        console.error("Failed to save settings", e);
        uiStore.showToast('Erreur lors de la sauvegarde.', 'error');
    } finally {
        saving.value = false;
    }
};
</script>

