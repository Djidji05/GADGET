<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <!-- Hero Header -->
    <section :class="['relative text-white py-14 px-4 border-b border-gray-800 transition-colors', isReportIssue ? 'bg-gradient-to-br from-red-950 via-slate-900 to-amber-950' : 'bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950']">
      <div class="container mx-auto max-w-4xl text-center relative z-10 space-y-3">
        <span
          :class="[
            'inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border tracking-wide uppercase',
            isReportIssue ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
          ]"
        >
          <i :class="isReportIssue ? 'fas fa-exclamation-triangle' : 'fas fa-headset'"></i>
          {{ isReportIssue ? 'Assistance & Support Client' : 'Centre de Contact Panyem' }}
        </span>
        <h1 class="text-3xl md:text-5xl font-black tracking-tight">
          {{ isReportIssue ? 'Signaler un Problème' : 'Contactez-nous' }}
        </h1>
        <p class="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
          {{ isReportIssue
              ? 'Un souci avec une commande, un paiement ou le site ? Soumettez votre signalement. Notre équipe de support intervient en priorité.'
              : 'Une question, une demande de renseignement ou un besoin d\'accompagnement ? Notre équipe est à votre écoute 7j/7.'
          }}
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-10 max-w-6xl">

      <!-- Order Dispute Hint (Only visible for report-issue) -->
      <div v-if="isReportIssue" class="mb-8 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 text-lg">
            <i class="fas fa-box-open"></i>
          </div>
          <div class="text-xs md:text-sm text-amber-900 dark:text-amber-200">
            <strong>Problème sur une commande spécifique ?</strong> Vous pouvez émettre un litige direct depuis votre espace client pour une prise en charge accélérée.
          </div>
        </div>
        <router-link
          to="/orders"
          class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow transition-colors"
        >
          Voir Mes Commandes
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Contact Form (7 cols) -->
        <div class="lg:col-span-7">
          <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i :class="isReportIssue ? 'fas fa-bug text-red-500' : 'far fa-paper-plane text-blue-600 dark:text-blue-400'"></i>
                {{ isReportIssue ? 'Formulaire de Signalement' : 'Envoyez-nous un message' }}
              </h2>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Remplissez les champs ci-dessous. Un ticket de support sera automatiquement généré.
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Prénom <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    required
                    placeholder="Votre prénom"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label for="lastName" class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nom <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    required
                    placeholder="Votre nom"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="email" class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Adresse Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="ex: nom@domaine.com"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label for="phone" class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Téléphone (WhatsApp)
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    placeholder="+509 XXXX XXXX"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label for="subject" class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Sujet du message <span class="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  v-model="form.subject"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Choisissez un motif</option>
                  <option value="order">Question / Problème sur une commande</option>
                  <option value="payment">Difficulté de paiement (MonCash, Natcash, Carte)</option>
                  <option value="technical">Bug technique ou problème de connexion</option>
                  <option value="return">Demande de retour ou remboursement</option>
                  <option value="product">Renseignement sur un produit</option>
                  <option value="seller">Devenir vendeur / Boutique marketplace</option>
                  <option value="other">Autre demande</option>
                </select>
              </div>

              <div>
                <label for="message" class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Message détaillé <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="4"
                  required
                  minlength="10"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Expliquez-nous votre demande avec précision..."
                ></textarea>
              </div>

              <!-- Success Alert Banner -->
              <div
                v-if="successMessage"
                class="p-4 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50 rounded-xl text-green-800 dark:text-green-300 text-xs md:text-sm flex items-start gap-3"
              >
                <i class="fas fa-check-circle text-green-600 dark:text-green-400 text-lg mt-0.5"></i>
                <div>
                  <div class="font-bold">Message enregistré !</div>
                  <div>{{ successMessage }}</div>
                </div>
              </div>

              <!-- Error Alert Banner -->
              <div
                v-if="errorMessage"
                class="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-red-800 dark:text-red-300 text-xs md:text-sm flex items-start gap-3"
              >
                <i class="fas fa-exclamation-circle text-red-600 dark:text-red-400 text-lg mt-0.5"></i>
                <div>
                  <div class="font-bold">Erreur lors de l'envoi</div>
                  <div>{{ errorMessage }}</div>
                </div>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                :class="[
                  'w-full py-3.5 rounded-xl text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50',
                  isReportIssue ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                ]"
              >
                <i v-if="isSubmitting" class="fas fa-spinner fa-spin text-xs"></i>
                <i v-else :class="isReportIssue ? 'fas fa-exclamation-triangle' : 'far fa-paper-plane'"></i>
                {{ isSubmitting ? 'Envoi en cours...' : (isReportIssue ? 'Envoyer le signalement' : 'Envoyer le message') }}
              </button>
            </form>
          </div>
        </div>

        <!-- Coordonnées & Support (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          
          <!-- Box 1: Coordonnées Panyem -->
          <div class="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
            <h3 class="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
              <i class="fas fa-building text-blue-600 dark:text-blue-400"></i> Nos Coordonnées
            </h3>

            <div class="space-y-4 text-xs">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <i class="fas fa-phone-alt"></i>
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white">Téléphone & Support</div>
                  <div class="text-gray-600 dark:text-gray-400 font-semibold">+509 34 56 78 90</div>
                  <div class="text-gray-600 dark:text-gray-400">+509 41 39 35 44</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <i class="far fa-envelope"></i>
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white">Email</div>
                  <div class="text-gray-600 dark:text-gray-400">support@panyem.ht</div>
                  <div class="text-gray-600 dark:text-gray-400">contact@panyem.ht</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white">Sièges & Points de Retrait</div>
                  <div class="text-gray-600 dark:text-gray-400"><strong>Port-au-Prince :</strong> Delmas 32, #45</div>
                  <div class="text-gray-600 dark:text-gray-400"><strong>Cap-Haïtien :</strong> Rue 25H</div>
                  <div class="text-gray-600 dark:text-gray-400"><strong>Ouanaminthe :</strong> Cité la Lumière</div>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <i class="far fa-clock"></i>
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white">Heures d'ouverture</div>
                  <div class="text-gray-600 dark:text-gray-400">Lundi - Vendredi : 8h00 - 18h00</div>
                  <div class="text-gray-600 dark:text-gray-400">Samedi : 9h00 - 16h00</div>
                </div>
              </div>
            </div>

            <!-- WhatsApp Direct CTA -->
            <a
              href="https://wa.me/50934567890"
              target="_blank"
              class="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
            >
              <i class="fab fa-whatsapp text-base"></i> Discuter sur WhatsApp (+509 34 56 78 90)
            </a>
          </div>

          <!-- Box 2: FAQ CTA -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl p-6 border border-blue-100 dark:border-blue-900/40 space-y-3">
            <h4 class="font-bold text-blue-950 dark:text-blue-200 text-sm">Besoin d'une réponse immédiate ?</h4>
            <p class="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              Consultez notre Foire Aux Questions pour trouver toutes les précisions sur MonCash, les retours et les délais de livraison.
            </p>
            <router-link to="/faq" class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Consulter la FAQ →
            </router-link>
          </div>

        </div>
      </div>

      <!-- Map Integration Section -->
      <div class="mt-12 bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-6 border border-gray-100 dark:border-gray-800 space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
              <i class="fas fa-map-marked-alt text-blue-600 dark:text-blue-400"></i> Carte des Succursales Panyem en Haïti
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Retrouvez nos bureaux et points de dépôt à Port-au-Prince, Cap-Haïtien et Ouanaminthe.</p>
          </div>
        </div>

        <!-- Map Container -->
        <div class="relative w-full h-[380px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div id="contact-map" class="w-full h-full relative z-0"></div>
        </div>

        <!-- Direct Map Links Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <a
            href="https://maps.google.com/?q=Delmas+32+Port-au-Prince+Haiti"
            target="_blank"
            class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-400 transition-colors flex items-center justify-between"
          >
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Port-au-Prince</div>
              <div class="text-gray-500 dark:text-gray-400 text-[11px]">Delmas 32, #45</div>
            </div>
            <i class="fas fa-external-link-alt text-blue-500 text-xs"></i>
          </a>

          <a
            href="https://maps.google.com/?q=Rue+25H+Cap-Haitien+Haiti"
            target="_blank"
            class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-400 transition-colors flex items-center justify-between"
          >
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Cap-Haïtien</div>
              <div class="text-gray-500 dark:text-gray-400 text-[11px]">Rue 25H</div>
            </div>
            <i class="fas fa-external-link-alt text-blue-500 text-xs"></i>
          </a>

          <a
            href="https://maps.google.com/?q=Ouanaminthe+Haiti"
            target="_blank"
            class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-400 transition-colors flex items-center justify-between"
          >
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Ouanaminthe</div>
              <div class="text-gray-500 dark:text-gray-400 text-[11px]">Cité la Lumière</div>
            </div>
            <i class="fas fa-external-link-alt text-blue-500 text-xs"></i>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()

const isReportIssue = computed(() => {
  return route.name === 'report-issue' || route.path.includes('report-issue') || route.query.type === 'issue'
})

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

// Pre-fill user data if logged in & set initial subject if reporting issue
onMounted(() => {
  if (authStore.customer) {
    form.value.firstName = authStore.customer.firstName || ''
    form.value.lastName = authStore.customer.lastName || ''
    form.value.email = authStore.customer.email || ''
    form.value.phone = authStore.customer.phone || ''
  }

  if (isReportIssue.value) {
    form.value.subject = (route.query.subject as string) || 'technical'
  }

  initMap()
})

// Methods
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const response = await api.post('/contact', form.value)
    const ticketId = response.data?.ticketId

    if (ticketId) {
      successMessage.value = `Votre message a été enregistré avec le ticket N° #${ticketId}. Notre équipe vous répondra par email dans les plus brefs délais.`
    } else {
      successMessage.value = 'Votre message a été transmis à notre équipe de support. Nous vous répondrons rapidement.'
    }

    uiStore.showToast(successMessage.value, 'success')

    // Reset form
    form.value = {
      firstName: authStore.customer?.firstName || '',
      lastName: authStore.customer?.lastName || '',
      email: authStore.customer?.email || '',
      phone: authStore.customer?.phone || '',
      subject: isReportIssue.value ? 'technical' : '',
      message: '',
    }
  } catch (error: any) {
    console.error('Error submitting contact form:', error)
    if (error.response?.data?.errors) {
      errorMessage.value = error.response.data.errors.map((e: any) => e.msg || e.message).join(', ')
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
    }
    uiStore.showToast(errorMessage.value, 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Leaflet Map Initialization
const initMap = () => {
  nextTick(() => {
    // Inject Leaflet CSS if not present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const loadLeafletScript = () => {
      const L = (window as any).L
      if (!L) return

      const mapContainer = document.getElementById('contact-map')
      if (!mapContainer) return

      // Clean existing map instance if any
      if ((mapContainer as any)._leaflet_id) {
        return
      }

      // Initialize map (Port-au-Prince, Cap-Haitien, Ouanaminthe center)
      const map = L.map('contact-map').setView([19.2, -72.0], 8)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map)

      const gzIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #2563EB; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white;">
                  <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
               </div>`,
        iconSize: [28, 38],
        iconAnchor: [14, 38],
        popupAnchor: [0, -38]
      })

      // Port-au-Prince marker
      L.marker([18.5473, -72.2965], { icon: gzIcon }).addTo(map)
        .bindPopup('<b>Panyem Siège Social</b><br>Delmas 32, #45, Port-au-Prince')

      // Cap-Haitien marker
      L.marker([19.7570, -72.2081], { icon: gzIcon }).addTo(map)
        .bindPopup('<b>Panyem Cap-Haïtien</b><br>Rue 25H')

      // Ouanaminthe marker
      L.marker([19.5492, -71.7454], { icon: gzIcon }).addTo(map)
        .bindPopup('<b>Panyem Ouanaminthe</b><br>Cité la Lumière')

      // Invalidate size to ensure proper tile rendering
      setTimeout(() => {
        map.invalidateSize()
      }, 300)
    }

    if ((window as any).L) {
      loadLeafletScript()
    } else if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script')
      script.id = 'leaflet-js'
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = loadLeafletScript
      document.head.appendChild(script)
    }
  })
}
</script>
