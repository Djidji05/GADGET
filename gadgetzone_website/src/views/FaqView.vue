<template>
  <div class="container mx-auto px-4 pt-4 pb-12">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">FAQ - Questions Fréquentes</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- FAQ Categories -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <h3 class="font-semibold mb-4">Catégories</h3>
          <nav class="space-y-2">
            <button
              v-for="category in categories"
              :key="category.key"
              @click="activeCategory = category.key"
              :class="[
                'w-full text-left px-3 py-2 rounded-lg transition-colors',
                activeCategory === category.key
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50',
              ]"
            >
              <i :class="category.icon + ' mr-3'"></i>
              {{ category.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- FAQ Content -->
      <div class="lg:col-span-2">
        <div class="space-y-4">
          <div
            v-for="faq in filteredFaqs"
            :key="faq.id"
            class="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <button
              @click="toggleFaq(faq.id)"
              class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 class="font-medium text-gray-900">{{ faq.question }}</h3>
              <i
                :class="[
                  'las la-chevron-down transition-transform',
                  openFaq === faq.id ? 'rotate-180' : '',
                ]"
              ></i>
            </button>

            <div v-show="openFaq === faq.id" class="px-6 pb-4 border-t">
              <div class="pt-4 text-gray-600" v-html="faq.answer"></div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredFaqs.length === 0" class="text-center py-12">
          <i class="las la-question-circle text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">Aucune question trouvée</h3>
          <p class="text-gray-500">Essayez une autre catégorie ou contactez-nous directement.</p>
        </div>
      </div>
    </div>

    <!-- Contact Support -->
    <div class="mt-12 bg-primary-50 rounded-lg p-8 text-center">
      <h2 class="text-2xl font-bold text-primary-900 mb-4">Vous ne trouvez pas votre réponse?</h2>
      <p class="text-primary-700 mb-6">Notre équipe de support est là pour vous aider</p>
      <div class="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
        <router-link to="/contact" class="btn-primary">
          <i class="las la-envelope mr-2"></i>
          Contacter le support
        </router-link>
        <a href="tel:+50934567890" class="btn-secondary">
          <i class="las la-phone mr-2"></i>
          +509 34 56 78 90
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// State
const activeCategory = ref('all')
const openFaq = ref<number | null>(null)

// Categories
const categories = [
  { key: 'all', label: 'Toutes les questions', icon: 'las la-question-circle' },
  { key: 'orders', label: 'Commandes', icon: 'las la-box' },
  { key: 'payment', label: 'Paiement', icon: 'las la-credit-card' },
  { key: 'shipping', label: 'Livraison', icon: 'las fa-truck' },
  { key: 'returns', label: 'Retours', icon: 'las la-undo' },
  { key: 'account', label: 'Compte', icon: 'las la-user' },
  { key: 'products', label: 'Produits', icon: 'las la-shopping-bag' },
]

// FAQ Data
const faqs = [
  // Orders
  {
    id: 1,
    category: 'orders',
    question: 'Comment puis-je suivre ma commande?',
    answer:
      'Vous pouvez suivre votre commande en vous connectant à votre compte et en allant dans la section "Mes Commandes". Vous y trouverez le statut actuel et le numéro de suivi si votre commande a été expédiée.',
  },
  {
    id: 2,
    category: 'orders',
    question: "Puis-je modifier ma commande après l'avoir passée?",
    answer:
      "Une fois la commande confirmée, vous ne pouvez plus la modifier directement. Cependant, vous pouvez nous contacter immédiatement et nous ferons de notre mieux pour vous aider si la commande n'a pas encore été traitée.",
  },
  {
    id: 3,
    category: 'orders',
    question: 'Comment annuler ma commande?',
    answer:
      'Vous pouvez annuler votre commande depuis votre compte dans les 2 heures suivant la passation. Après ce délai, contactez notre service client.',
  },

  // Payment
  {
    id: 4,
    category: 'payment',
    question: 'Quelles méthodes de paiement acceptez-vous?',
    answer:
      'Nous acceptons Visa, Natcash, Mon Cash Wise, et Zelle. Toutes nos transactions sont sécurisées.',
  },
  {
    id: 5,
    category: 'payment',
    question: 'Mes informations de paiement sont-elles sécurisées?',
    answer:
      'Oui, nous utilisons des technologies de cryptage de pointe pour protéger vos informations. Nous ne stockons jamais vos détails de carte de crédit.',
  },
  {
    id: 6,
    category: 'payment',
    question: 'Que faire si mon paiement est refusé?',
    answer:
      'Vérifiez que vos informations sont correctes et que vous avez suffisamment de fonds. Si le problème persiste, contactez votre banque ou essayez une autre méthode de paiement.',
  },

  // Shipping
  {
    id: 7,
    category: 'shipping',
    question: 'Quels sont les délais de livraison?',
    answer:
      'Les délais de livraison varient selon votre localisation: Port-au-Prince: 1-2 jours, Provinces: 3-5 jours.',
  },
  {
    id: 8,
    category: 'shipping',
    question: 'Quels sont les frais de livraison?',
    answer:
      'Les frais de livraison sont de 250 HTG pour les commandes de moins de 5000 HTG. La livraison est gratuite pour les commandes de 5000 HTG et plus.',
  },
  {
    id: 9,
    category: 'shipping',
    question: 'Puis-je choisir un créneau de livraison?',
    answer:
      "Pour le moment, nous livrons pendant nos heures d'ouverture (9h-18h). Nous vous contacterons avant la livraison.",
  },

  // Returns
  {
    id: 10,
    category: 'returns',
    question: 'Quel est votre politique de retour?',
    answer:
      "Vous avez 14 jours pour retourner un produit. Le produit doit être dans son état d'origine avec tous les accessoires et emballages.",
  },
  {
    id: 11,
    category: 'returns',
    question: 'Comment retourner un produit?',
    answer:
      'Contactez notre service client pour obtenir une autorisation de retour. Nous vous fournirons les instructions et une étiquette de retour si nécessaire.',
  },
  {
    id: 12,
    category: 'returns',
    question: 'Les frais de retour sont-ils remboursés?',
    answer:
      "Oui, si le retour est dû à une erreur de notre part. Pour les changements d'avis, les frais de retour sont à votre charge.",
  },

  // Account
  {
    id: 13,
    category: 'account',
    question: 'Comment créer un compte?',
    answer:
      'Cliquez sur "Inscription" en haut de la page et remplissez le formulaire. Vous recevrez un email de confirmation.',
  },
  {
    id: 14,
    category: 'account',
    question: "J'ai oublié mon mot de passe. Que faire?",
    answer:
      'Cliquez sur "Mot de passe oublié" sur la page de connexion. Vous recevrez un email pour réinitialiser votre mot de passe.',
  },
  {
    id: 15,
    category: 'account',
    question: 'Puis-je modifier mes informations personnelles?',
    answer:
      'Oui, connectez-vous à votre compte et allez dans "Mon Compte" pour modifier vos informations.',
  },

  // Products
  {
    id: 16,
    category: 'products',
    question: 'Comment savoir si un produit est en stock?',
    answer:
      'La disponibilité est indiquée sur chaque page produit. Vous pouvez aussi nous contacter pour confirmation.',
  },
  {
    id: 17,
    category: 'products',
    question: 'Les produits ont-ils une garantie?',
    answer:
      'Oui, la plupart de nos produits ont une garantie fabricant. La durée varie selon le produit et est indiquée sur la page produit.',
  },
  {
    id: 18,
    category: 'products',
    question: 'Comment puis-je obtenir des conseils sur un produit?',
    answer:
      "Notre équipe d'experts est disponible par téléphone ou email pour vous aider à choisir le produit adapté à vos besoins.",
  },
]

// Computed
const filteredFaqs = computed(() => {
  if (activeCategory.value === 'all') {
    return faqs
  }
  return faqs.filter((faq) => faq.category === activeCategory.value)
})

// Methods
const toggleFaq = (faqId: number) => {
  openFaq.value = openFaq.value === faqId ? null : faqId
}
</script>
