<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <!-- Hero Header -->
    <section class="relative bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white py-16 px-4 overflow-hidden shadow-md">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]"></div>
      <div class="container mx-auto max-w-4xl text-center relative z-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4">
          <i class="fas fa-question-circle"></i> Centre d'Aide Panyem
        </span>
        <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Questions Fréquentes (FAQ)
        </h1>
        <p class="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mb-8">
          Trouvez rapidement toutes les réponses concernant vos commandes, les paiements MonCash/Natcash, la livraison et les retours en Haïti.
        </p>

        <!-- Search Bar -->
        <div class="max-w-xl mx-auto relative">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une question (ex: MonCash, délai, garantie...)"
            class="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20 transition-all text-sm"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-10 max-w-5xl">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-20 space-y-1">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Catégories</h3>
            <button
              v-for="cat in categories"
              :key="cat.key"
              @click="activeCategory = cat.key"
              :class="[
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                activeCategory === cat.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
            >
              <span class="flex items-center gap-2.5">
                <i :class="[cat.icon, 'text-base', activeCategory === cat.key ? 'text-white' : 'text-blue-500']"></i>
                {{ cat.label }}
              </span>
              <span
                :class="[
                  'text-[10px] px-2 py-0.5 rounded-full font-bold',
                  activeCategory === cat.key ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                ]"
              >
                {{ getCategoryCount(cat.key) }}
              </span>
            </button>
          </div>
        </div>

        <!-- FAQ Items -->
        <div class="lg:col-span-3 space-y-4">
          <div
            v-for="faq in filteredFaqs"
            :key="faq.id"
            class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-900"
          >
            <button
              @click="toggleFaq(faq.id)"
              class="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs shrink-0 font-bold">
                  {{ faq.id }}
                </span>
                <span>{{ faq.question }}</span>
              </span>
              <i
                :class="[
                  'fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300',
                  openFaq === faq.id ? 'rotate-180 text-blue-600' : ''
                ]"
              ></i>
            </button>

            <div
              v-show="openFaq === faq.id"
              class="px-5 pb-5 pt-1 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-50 dark:border-gray-800/80 leading-relaxed"
            >
              <div v-html="faq.answer" class="space-y-2"></div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredFaqs.length === 0" class="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800">
            <i class="fas fa-search text-4xl text-gray-300 dark:text-gray-600 mb-3 block"></i>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Aucun résultat trouvé</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Aucune question ne correspond à votre recherche "{{ searchQuery }}".
            </p>
            <button
              @click="resetFilter"
              class="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </div>

      <!-- Support CTA Banner -->
      <div class="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center md:text-left z-10">
          <h2 class="text-2xl font-bold">Vous avez encore des questions ?</h2>
          <p class="text-blue-100 text-sm max-w-lg">
            Notre équipe de support client à Port-au-Prince et Cap-Haïtien est disponible 7j/7 pour vous assister.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
          <router-link
            to="/contact"
            class="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl shadow hover:bg-blue-50 transition-colors text-center text-sm flex items-center justify-center gap-2"
          >
            <i class="far fa-envelope"></i> Contacter le support
          </router-link>
          <a
            href="https://wa.me/50934567890"
            target="_blank"
            class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow transition-colors text-center text-sm flex items-center justify-center gap-2"
          >
            <i class="fab fa-whatsapp text-base"></i> WhatsApp (+509 34 56 78 90)
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('all')
const searchQuery = ref('')
const openFaq = ref<number | null>(1)

const categories = [
  { key: 'all', label: 'Toutes les questions', icon: 'fas fa-th-large' },
  { key: 'orders', label: 'Commandes & Suivi', icon: 'fas fa-box' },
  { key: 'payment', label: 'Paiements (MonCash, etc.)', icon: 'fas fa-wallet' },
  { key: 'shipping', label: 'Livraison Haïti', icon: 'fas fa-truck' },
  { key: 'returns', label: 'Retours & Remboursements', icon: 'fas fa-undo' },
  { key: 'account', label: 'Compte & Sécurité', icon: 'fas fa-user-shield' },
  { key: 'sellers', label: 'Devenir Vendeur', icon: 'fas fa-store' }
]

const faqs = [
  {
    id: 1,
    category: 'orders',
    question: 'Comment puis-je suivre ma commande en temps réel ?',
    answer:
      'Dès la validation de votre commande, un numéro de suivi unique (ex: <code>GZ-123456</code>) vous est attribué. Rendez-vous dans <a href="/account" class="text-blue-600 underline font-medium">Mon Compte</a> > <strong>Suivi de livraison</strong> pour visualiser l\'état de préparation et la géolocalisation de votre livreur.'
  },
  {
    id: 2,
    category: 'orders',
    question: 'Que faire si je souhaite modifier ou annuler ma commande ?',
    answer:
      'Vous pouvez annuler sans frais votre commande tant qu\'elle est au statut <em>En attente</em> depuis votre espace client. Si le colis est déjà confié au livreur, contactez immédiatement notre support téléphonique au <strong>+509 34 56 78 90</strong>.'
  },
  {
    id: 3,
    category: 'payment',
    question: 'Comment payer par MonCash ou Natcash sur Panyem ?',
    answer:
      'Lors du passage en caisse, sélectionnez <strong>MonCash</strong> ou <strong>Natcash</strong>. Vous serez automatiquement redirigé vers la passerelle sécurisée pour saisir votre numéro de téléphone et confirmer votre transfert en Gourdes (HTG).'
  },
  {
    id: 4,
    category: 'payment',
    question: 'Les cartes bancaires internationales (Visa, Mastercard) sont-elles acceptées ?',
    answer:
      'Oui ! Nous acceptons les cartes Visa et Mastercard via notre passerelle Stripe sécurisée. Cela permet également aux membres de la diaspora haïtienne d\'effectuer des achats et de se faire livrer pour leurs proches en Haïti.'
  },
  {
    id: 5,
    category: 'payment',
    question: 'Comment fonctionne la garantie Escrow (Protection Acheteur) ?',
    answer:
      'Panyem conserve votre paiement en toute sécurité jusqu\'à ce que vous receviez votre colis en main propre. Le vendeur n\'est payé qu\'une fois la livraison confirmée par QR Code ou SMS.'
  },
  {
    id: 6,
    category: 'shipping',
    question: 'Quels sont les délais et zones de livraison en Haïti ?',
    answer:
      'Nous livrons dans les 10 départements d\'Haïti. Les délais moyens sont de <strong>24h à 48h</strong> pour Port-au-Prince, Cap-Haïtien et Ouanaminthe, et de <strong>3 à 5 jours ouvrés</strong> pour les autres provinces (Les Cayes, Jacmel, Gonaïves, Jeremie).'
  },
  {
    id: 7,
    category: 'shipping',
    question: 'Quels sont les frais de livraison ?',
    answer:
      'Les frais standards de livraison sont de 250 HTG. La livraison est <strong>GRATUITE</strong> pour toute commande d\'un montant supérieur ou égal à 5 000 HTG !'
  },
  {
    id: 8,
    category: 'returns',
    question: 'Quelle est la politique de retour et de remboursement ?',
    answer:
      'Vous disposez de <strong>7 jours</strong> après réception pour demander un retour ou émettre un litige si le produit est défectueux ou non conforme. Une fois le retour inspecté, votre remboursement est effectué sous 3 à 5 jours sur votre compte MonCash, Natcash ou carte.'
  },
  {
    id: 9,
    category: 'account',
    question: 'Comment activer la double authentification (2FA) pour protéger mon compte ?',
    answer:
      'Allez dans votre espace client <a href="/account" class="text-blue-600 underline font-medium">Mon Compte</a> > <strong>Sécurité & connexion</strong>, puis cliquez sur <strong>Double authentification (2FA)</strong> pour recevoir vos codes de sécurité par email à chaque connexion.'
  },
  {
    id: 10,
    category: 'sellers',
    question: 'Comment ouvrir ma propre boutique vendeur sur Panyem ?',
    answer:
      'C\'est très simple et rapide ! Visitez la page <a href="/become-seller" class="text-blue-600 underline font-medium">Devenir Vendeur</a>, remplissez le formulaire avec le nom de votre entreprise et vos pièces d\'identité. Notre équipe valide votre dossier sous 24h.'
  }
]

const filteredFaqs = computed(() => {
  return faqs.filter(faq => {
    const matchesCategory = activeCategory.value === 'all' || faq.category === activeCategory.value
    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch =
      !query ||
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })
})

const getCategoryCount = (categoryKey: string) => {
  if (categoryKey === 'all') return faqs.length
  return faqs.filter(f => f.category === categoryKey).length
}

const toggleFaq = (id: number) => {
  openFaq.value = openFaq.value === id ? null : id
}

const resetFilter = () => {
  searchQuery.value = ''
  activeCategory.value = 'all'
}
</script>
