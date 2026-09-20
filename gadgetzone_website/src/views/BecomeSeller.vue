<template>
  <div class="overflow-hidden bg-gray-50 pb-12">
    <!-- HERO SECTION MARKETING -->
    <section v-if="!submitted && !existingApplication" class="bg-[#0A1A2F] text-white pt-20 pb-24 relative">
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-6">Faites décoller vos ventes avec Panyem</h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Rejoignez la marketplace n°1 et accédez instantanément à des milliers de clients prêts à acheter vos produits.
        </p>
        <button 
          @click="scrollToForm" 
          class="px-6 py-3 mt-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-md mx-auto"
        >
          Devenir Vendeur
        </button>
      </div>
      <!-- Background decoration -->
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    </section>

    <!-- AVANTAGES SECTION -->
    <section v-if="!submitted && !existingApplication" class="py-16 bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 max-w-5xl">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Pourquoi vendre chez nous ?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">
              <i class="fas fa-users"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">Audience Massive</h3>
            <p class="text-gray-600">Vos produits sont immédiatement visibles par des milliers d'acheteurs de la région.</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-4">
              <i class="fas fa-percent"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">Commissions Faibles</h3>
            <p class="text-gray-600">Gardez la majorité de vos gains. Nos frais sont parmi les plus compétitifs du marché.</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-4">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">Paiements Sécurisés</h3>
            <p class="text-gray-600">Nous protégeons vos transactions et gérons les paiements pour vous évitez les fraudes.</p>
          </div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 mt-12 md:mt-16" id="form-section">
      <!-- SUCCESS SCREEN -->
      <div v-if="submitted" class="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-12 text-center animate-fade-in mt-12 border border-green-50">
        <div class="mb-8 relative flex justify-center">
          <div class="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center animate-bounce-subtle">
            <i class="fas fa-check-circle text-6xl text-green-500"></i>
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
             <div class="w-32 h-32 bg-green-200 opacity-20 rounded-full animate-ping"></div>
          </div>
        </div>
        
        <h2 class="text-4xl font-extrabold text-gray-900 mb-6">Candidature envoyée !</h2>
        <p class="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
          Merci pour votre confiance. Vos informations ont été transmises avec succès. Notre équipe examine votre demande dans les plus brefs délais (généralement sous 24h).
        </p>
        
        <div class="flex flex-col sm:flex-row gap-5 justify-center">
          <router-link to="/" class="px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 hover:scale-105 transition-all shadow-lg">
            <i class="fas fa-shopping-bag mr-2"></i> Retour à la boutique
          </router-link>
          <router-link to="/account" class="px-10 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 hover:scale-105 transition-all">
            <i class="fas fa-user-circle mr-2"></i> Mon compte
          </router-link>
        </div>
      </div>

      <!-- PENDING APPLICATION STATE -->
      <div v-if="existingApplication && existingApplication.status === 'pending'" class="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12 text-center border border-amber-200 dark:border-amber-900/50 my-12">
        <div class="w-20 h-20 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          <i class="fas fa-clock"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Candidature en cours d'examen</h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          Vous avez déjà soumis une candidature pour la boutique <strong>{{ existingApplication.name }}</strong>. Elle est actuellement en attente de validation par notre équipe d'administration.
        </p>
        <div class="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 text-left mb-8 space-y-1">
          <div class="font-bold flex items-center gap-1.5"><i class="fas fa-lock text-amber-600"></i> Soumission verrouillée :</div>
          <div>Conformément aux règles de Panyem, vous ne pouvez pas déposer de nouvelle candidature tant que la précédente n'a pas été annulée ou traitée.</div>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="cancelApplication" :disabled="isCancelling" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow transition-colors flex items-center justify-center gap-2">
            <i v-if="isCancelling" class="fas fa-spinner fa-spin text-xs"></i>
            <i v-else class="fas fa-times-circle"></i>
            Annuler ma candidature
          </button>
          <router-link to="/" class="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm transition-colors">
            Retour à l'accueil
          </router-link>
        </div>
      </div>

      <!-- INSCRIPTION FORM (Hidden if pending) -->
      <div v-else-if="!submitted" class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 mb-3">Formulaire d'Inscription Vendeur</h2>
          <p class="text-gray-600">
            Complétez ces informations pour soumettre votre candidature à notre équipe de validation.
          </p>
        </div>

      <div v-if="existingApplication && (existingApplication.status === 'cancelled' || existingApplication.status === 'rejected')" class="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
        <div class="flex items-start gap-3">
          <i class="fas fa-info-circle text-blue-600 text-lg mt-0.5"></i>
          <p class="text-sm text-blue-900">
            Votre précédente candidature a été <strong>{{ existingApplication.status === 'cancelled' ? 'annulée' : 'refusée' }}</strong>. Vous pouvez soumettre une nouvelle candidature ci-dessous.
          </p>
        </div>
      </div>

      <form @submit.prevent="submitApplication" class="space-y-6">
        <!-- Informations Boutique -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-gray-800 ">Informations de la Boutique</h2>
          
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label for="storeName" class="block text-sm font-medium text-gray-700 ">Nom de la boutique</label>
              <input
                type="text"
                id="storeName"
                v-model="form.storeName"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 "
                placeholder="Ma Super Boutique"
              />
            </div>

            <div>
              <label for="storeDescription" class="block text-sm font-medium text-gray-700 ">Description</label>
              <textarea
                id="storeDescription"
                v-model="form.storeDescription"
                rows="4"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 "
                placeholder="Décrivez votre boutique et vos produits..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Informations Propriétaire -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-gray-800 ">Informations du Propriétaire</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="ownerAddress" class="block text-sm font-medium text-gray-700 ">Adresse complète</label>
              <input
                type="text"
                id="ownerAddress"
                v-model="form.address"
                required
                placeholder="Ex: 12 Rue de la Paix, Port-au-Prince"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 "
              />
            </div>

            <div>
              <label for="ownerWhatsapp" class="block text-sm font-medium text-gray-700 ">Numéro WhatsApp</label>
              <input
                type="tel"
                id="ownerWhatsapp"
                v-model="form.whatsapp"
                required
                placeholder="+509 XXXX XXXX"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 "
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Pièce d'identité (Carte ID, Passeport...)</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ">
                <div class="space-y-1 text-center">
                  <div v-if="!form.identityData" class="flex flex-col items-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600 ">
                      <label for="identity-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                        <span>Téléverser un fichier</span>
                        <input id="identity-upload" name="identity-upload" type="file" class="sr-only" @change="handleFileUpload" accept="image/*,.pdf" />
                      </label>
                    </div>
                    <p class="text-xs text-gray-500 ">PNG, JPG, PDF jusqu'à 5MB</p>
                  </div>
                  <div v-else class="flex flex-col items-center">
                    <p class="text-sm text-green-600 font-medium my-2">✅ Fichier sélectionné</p>
                    <button type="button" @click="form.identityData = '';" class="text-xs text-red-500 hover:underline">Supprimer</button>
                    <img alt="" v-if="form.identityData.startsWith('data:image')" :src="form.identityData" class="mt-2 h-24 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations Produits -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-gray-800 ">Type de Produits</h2>
          <div>
            <label for="productStyle" class="block text-sm font-medium text-gray-700 ">Quels types de produits comptez-vous vendre ?</label>
            <textarea
              id="productStyle"
              v-model="form.productStyle"
              rows="3"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 "
              placeholder="Ex: Électronique, Vêtements, Accessoires fait main..."
            ></textarea>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900 ">
            J'accepte les <router-link to="/terms" target="_blank" class="text-brand-600 hover:text-brand-500 font-medium">conditions générales de vente</router-link> de la marketplace.
          </label>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="flex w-full justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Envoi en cours...' : 'Envoyer ma candidature' }}
        </button>
      </form>
    </div>
    </div> <!-- Close form-section -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useUiStore } from '@/stores/ui';

const router = useRouter();
const uiStore = useUiStore();
const loading = ref(false);
const isCancelling = ref(false);
const error = ref('');
const submitted = ref(false);

const scrollToForm = () => {
  const formSection = document.getElementById('form-section');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const form = reactive({
  storeName: '',
  storeDescription: '',
  businessType: 'individual',
  taxId: '',
  address: '',
  whatsapp: '',
  productStyle: '',
  identityData: '', // Base64 string
  acceptTerms: false
});

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      uiStore.showToast("Le fichier est trop volumineux (max 5MB).", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      form.identityData = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const existingApplication = ref<any>(null);

const checkApplicationStatus = async () => {
  try {
    const response = await api.get('/vendors/me');
    if (response.data) {
      const store = response.data;
      
      // Si approuvé ou suspendu, rediriger vers le tableau de bord vendeur interne
      if (store.status === 'active' || store.status === 'suspended') {
        router.push('/seller/dashboard');
        return;
      }

      existingApplication.value = store;
      
      // Pre-fill form if cancelled or rejected
      form.storeName = response.data.name;
      form.storeDescription = response.data.description;
      
      if(response.data.settings) {
        form.businessType = response.data.settings.businessType || 'individual';
        form.taxId = response.data.settings.taxId || '';
        form.address = response.data.settings.address || '';
        form.whatsapp = response.data.settings.whatsapp || '';
        form.productStyle = response.data.settings.productStyle || '';
      }
    } else {
      existingApplication.value = null;
    }
  } catch (e: any) {
    if (e.response?.status !== 404) {
      console.error("Error checking status", e);
    }
    existingApplication.value = null;
  }
};

onMounted(() => {
  checkApplicationStatus();
});

const cancelApplication = () => {
  uiStore.confirm({
    title: 'Annuler la candidature',
    message: 'Êtes-vous sûr de vouloir annuler votre candidature vendeur ? Vous pourrez en soumettre une nouvelle à tout moment.',
    onConfirm: async () => {
      try {
        isCancelling.value = true;
        const response = await api.post('/vendors/cancel-application');
        uiStore.showToast(response.data.message || 'Candidature annulée avec succès.', 'info');
        existingApplication.value = null;
        submitted.value = false;
        await checkApplicationStatus();
      } catch (err: any) {
        console.error('Error cancelling application:', err);
        uiStore.showToast(err.response?.data?.message || 'Erreur lors de l\'annulation.', 'error');
      } finally {
        isCancelling.value = false;
      }
    }
  });
};

const submitApplication = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (!form.identityData && !existingApplication.value?.settings?.identityData) {
      throw new Error("Veuillez téléverser une pièce d'identité.");
    }
    
    const response = await api.post('/vendors/apply', form);
    const msg = response.data.message || 'Candidature envoyée avec succès! En attente de validation.';
    uiStore.showToast(msg, 'success');
    submitted.value = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    checkApplicationStatus();
  } catch (err: any) {
    console.error(err);
    if (err.response?.data?.error === 'Application pending') {
      uiStore.showToast("Vous avez déjà une candidature en cours d'examen.", "warning");
      checkApplicationStatus();
    } else {
      error.value = err.response?.data?.message || err.message || 'Une erreur est survenue.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-bounce-subtle {
  animation: bounceSubtle 2s infinite;
}

@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
</style>
