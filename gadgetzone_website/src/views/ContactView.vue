<template>
  <div class="container mx-auto px-4 pt-4 pb-12">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Contactez-nous</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-6">Envoyez-nous un message</h2>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
                Sujet *
              </label>
              <select
                id="subject"
                v-model="form.subject"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="order">Question sur une commande</option>
                <option value="product">Information sur un produit</option>
                <option value="payment">Problème de paiement</option>
                <option value="return">Retour ou échange</option>
                <option value="technical">Support technique</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Décrivez votre demande en détail..."
              ></textarea>
            </div>

            <!-- Success Message -->
            <div
              v-if="successMessage"
              class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg"
            >
              {{ successMessage }}
            </div>

            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
            >
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full btn-primary disabled:opacity-50"
            >
              <i v-if="isSubmitting" class="las la-spinner la-spin mr-2"></i>
              {{ isSubmitting ? 'Envoi...' : 'Envoyer le message' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="space-y-8">
        <!-- Contact Details -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-6">Nos coordonnées</h2>

          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <i class="las la-phone text-primary-600 mt-1"></i>
              <div>
                <h3 class="font-medium">Téléphone</h3>
                <p class="text-gray-600">+509 34 56 78 90</p>
                <p class="text-gray-600">+509 29 87 65 43</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <i class="las la-envelope text-primary-600 mt-1"></i>
              <div>
                <h3 class="font-medium">Email</h3>
                <p class="text-gray-600">contact@htfasil.ht</p>
                <p class="text-gray-600">support@htfasil.ht</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <i class="las la-map-marker-alt text-primary-600 mt-1"></i>
              <div>
                <h3 class="font-medium">Adresse</h3>
                <p class="text-gray-600 mb-2">
                  <strong class="text-gray-900 block">Ouanaminthe</strong>
                  Cité la Lumière
                </p>
                <p class="text-gray-600">
                  <strong class="text-gray-900 block">Cap-Haïtien</strong>
                  Rue 25H
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <i class="las la-clock text-primary-600 mt-1"></i>
              <div>
                <h3 class="font-medium">Heures d'ouverture</h3>
                <p class="text-gray-600">
                  Lun-Ven: 9h-18h<br />
                  Sam: 9h-15h<br />
                  Dim: Fermé
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-6">Suivez-nous</h2>

          <div class="flex space-x-4">
            <a
              href="#"
              class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <i class="lab la-facebook-f"></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
            >
              <i class="lab la-instagram"></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
            >
              <i class="lab la-twitter"></i>
            </a>
            <a
              href="#"
              class="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
            >
              <i class="lab la-whatsapp"></i>
            </a>
          </div>
        </div>

        <!-- FAQ Link -->
        <div class="bg-primary-50 rounded-lg p-6">
          <h3 class="font-semibold text-primary-900 mb-2">Questions fréquentes?</h3>
          <p class="text-primary-700 mb-4">
            Consultez notre FAQ pour trouver rapidement des réponses à vos questions.
          </p>
          <router-link to="/faq" class="text-primary-600 hover:text-primary-700 font-medium">
            Voir la FAQ →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Map Integration -->
    <div class="mt-12 bg-white rounded-xl shadow-sm p-4 flex flex-col">
        <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-map-marker-alt text-blue-600"></i> Nos Succursales
        </h3>
        <div id="contact-map" class="w-full h-[450px] rounded-lg overflow-hidden relative z-0">
             <!-- Leaftlet map will be mounted here -->
        </div>
        <div class="flex justify-center gap-6 mt-4">
             <p class="text-sm text-gray-500 text-center"><span class="w-3 h-3 inline-block bg-blue-600 rounded-full mr-1"></span> Cité la Lumière, Ouanaminthe</p>
             <p class="text-sm text-gray-500 text-center"><span class="w-3 h-3 inline-block bg-blue-600 rounded-full mr-1"></span> Rue 25H, Cap-Haïtien</p>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

// State
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

// Methods
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Implement real contact form submission API
    await api.post('/contact', form.value)

    // Show success message
    successMessage.value =
      'Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais.'
    uiStore.showToast(successMessage.value, 'success')

    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    }
  } catch (error: any) {
    console.error('Error submitting contact form:', error)
    if (error.response?.data?.errors) {
      errorMessage.value = error.response.data.errors.map((e: any) => e.msg).join(', ')
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Une erreur est survenue. Veuillez réessayer plus tard.'
    }
    uiStore.showToast(errorMessage.value, 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Leaflet Map Initialization
onMounted(() => {
    // Inject Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Inject Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    
    script.onload = () => {
        const L = (window as any).L;
        if (!L) return;

        // Initialize map centered roughly between Ouanaminthe and Cap-Haitien
        const map = L.map('contact-map').setView([19.6531, -71.9768], 10);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Custom HTFasil icon
        const gzIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #2563EB; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                      <div style="background-color: white; width: 12px; height: 12px; border-radius: 50%;"></div>
                   </div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -42]
        });

        // Ouanaminthe marker
        L.marker([19.5492, -71.7454], { icon: gzIcon }).addTo(map)
            .bindPopup('<b>HTFasil Ouanaminthe</b><br>Cité la Lumière');

        // Cap-Haitien marker
        L.marker([19.7570, -72.2081], { icon: gzIcon }).addTo(map)
            .bindPopup('<b>HTFasil Cap-Haïtien</b><br>Rue 25H');
            
        // Fit bounds to show both markers
        const bounds = L.latLngBounds([
            [19.5492, -71.7454],
            [19.7570, -72.2081]
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });
    };

    document.head.appendChild(script);
});
</script>
