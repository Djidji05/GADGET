<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <!-- Hero Header -->
    <section class="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white py-16 px-4 border-b border-gray-800">
      <div class="container mx-auto max-w-4xl text-center relative z-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4">
          <i class="fas fa-lock"></i> Vie Privée & Données
        </span>
        <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Politique de Confidentialité
        </h1>
        <p class="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
          Chez Panyem, la protection et la confidentialité de vos données personnelles sont au cœur de nos priorités.
        </p>
        <div class="mt-4 text-xs text-gray-400">
          <i class="far fa-calendar-alt mr-1"></i> Mise à jour : 19 septembre 2026
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Navigation -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-20 space-y-1">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation</h3>
            <nav class="space-y-1">
              <a
                v-for="(item, idx) in toc"
                :key="idx"
                :href="'#' + item.id"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span class="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {{ idx + 1 }}
                </span>
                <span class="truncate">{{ item.title }}</span>
              </a>
            </nav>
          </div>
        </div>

        <!-- Document Clauses -->
        <div class="lg:col-span-3 space-y-8">
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-800 space-y-8">

            <div class="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 rounded-xl flex items-start gap-3">
              <i class="fas fa-user-shield text-indigo-600 dark:text-indigo-400 text-xl mt-0.5"></i>
              <div class="text-xs md:text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                <strong>Transparence garantie :</strong> Nous ne vendons et ne louons JAMAIS vos données personnelles à des tiers. Vos informations de livraison et de téléphone servent uniquement à l'exécution de vos commandes en Haïti.
              </div>
            </div>

            <!-- Section 1 -->
            <section id="engagement" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-indigo-600 dark:text-indigo-400">1.</span> Engagement de Panyem
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                La présente Politique de Confidentialité explique comment <strong>Panyem</strong> collecte, utilise, protège et conserve vos données à caractère personnel lorsque vous naviguez sur nos sites web et applications mobiles.
              </p>
            </section>

            <!-- Section 2 -->
            <section id="donnees" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-indigo-600 dark:text-indigo-400">2.</span> Données Personnelles Collectées
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Pour assurer la gestion de votre compte et la livraison de vos produits en Haïti, nous collectons :
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div class="font-bold text-xs text-gray-900 dark:text-white mb-1"><i class="fas fa-id-card text-blue-500 mr-1.5"></i> Profil & Identité</div>
                  <div class="text-[11px] text-gray-500 dark:text-gray-400">Nom, prénom, adresse e-mail, numéro de téléphone (utilisé par les livreurs).</div>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div class="font-bold text-xs text-gray-900 dark:text-white mb-1"><i class="fas fa-map-marker-alt text-red-500 mr-1.5"></i> Adresse & Livraison</div>
                  <div class="text-[11px] text-gray-500 dark:text-gray-400">Quartier, rue, ville (Port-au-Prince, Cap-Haïtien, etc.) et point de repère.</div>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div class="font-bold text-xs text-gray-900 dark:text-white mb-1"><i class="fas fa-shield-alt text-green-500 mr-1.5"></i> Sécurité & Connexion</div>
                  <div class="text-[11px] text-gray-500 dark:text-gray-400">Adresse IP, logs d'activité, statut 2FA, type d'appareil.</div>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div class="font-bold text-xs text-gray-900 dark:text-white mb-1"><i class="fas fa-wallet text-orange-500 mr-1.5"></i> Paiement (Chiffré)</div>
                  <div class="text-[11px] text-gray-500 dark:text-gray-400">Historique des transactions MonCash, Natcash ou Stripe. Aucune carte bancaire n'est stockée chez Panyem.</div>
                </div>
              </div>
            </section>

            <!-- Section 3 -->
            <section id="utilisation" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-indigo-600 dark:text-indigo-400">3.</span> Utilisation de vos Données
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Vos informations sont exclusivement utilisées pour :
              </p>
              <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1.5 pl-2">
                <li>Traiter vos achats et sécuriser le paiement en séquestre (escrow).</li>
                <li>Transmettre les coordonnées de livraison à nos agents et transporteurs.</li>
                <li>Vous envoyer des SMS et emails de confirmation de suivi de commande.</li>
                <li>Lutter contre la fraude et sécuriser l'accès à votre compte via le 2FA.</li>
              </ul>
            </section>

            <!-- Section 4 -->
            <section id="partage" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-indigo-600 dark:text-indigo-400">4.</span> Partage de Données avec des Tiers
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Nous ne partageons vos données qu'avec des partenaires de confiance strictement indispensables à l'exécution du service :
              </p>
              <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1.5 pl-2">
                <li><strong>Opérateurs de paiement :</strong> MonCash (Digicel), Natcash, Stripe.</li>
                <li><strong>Livreurs partenaires :</strong> Pour communiquer avec vous lors de la remise du colis.</li>
              </ul>
            </section>

            <!-- Section 5 -->
            <section id="securite" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-indigo-600 dark:text-indigo-400">5.</span> Chiffrement & Sécurité des Données
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Toutes les communications entre votre appareil et nos serveurs utilisent le protocole sécurisé <strong>HTTPS / SSL 256-bit</strong>. Vos mots de passe sont hachés de manière irréversible via <code>bcrypt</code>.
              </p>
            </section>

            <!-- Section 6 -->
            <section id="cookies" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-indigo-600 dark:text-indigo-400">6.</span> Cookies & Préférences
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Nous utilisons des cookies essentiels pour maintenir votre session de connexion active, mémoriser le contenu de votre panier et sauvegarder votre préférence de langue (Français / Créole).
              </p>
            </section>

            <!-- Section 7 -->
            <section id="droits" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-indigo-600 dark:text-indigo-400">7.</span> Vos Droits & Suppression de Compte
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Vous pouvez à tout moment consulter, modifier vos informations personnelles ou fermer votre compte directement depuis la page <a href="/account" class="text-indigo-600 underline font-medium">Mon Compte</a>.
              </p>
            </section>

            <!-- Section 8 -->
            <section id="contact" class="scroll-mt-24 space-y-3">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-indigo-600 dark:text-indigo-400">8.</span> Contact - Délégué à la Protection des Données
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Pour toute demande relative à vos données personnelles, vous pouvez écrire à notre équipe :
              </p>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs space-y-1 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                <p><strong>Email :</strong> privacy@panyem.ht</p>
                <p><strong>Téléphone / WhatsApp :</strong> +509 34 56 78 90</p>
                <p><strong>Adresse :</strong> Delmas 32, #45, Port-au-Prince, Haïti</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toc = [
  { id: 'engagement', title: '1. Engagement' },
  { id: 'donnees', title: '2. Données Collectées' },
  { id: 'utilisation', title: '3. Utilisation des Données' },
  { id: 'partage', title: '4. Partage avec des Tiers' },
  { id: 'securite', title: '5. Chiffrement & Sécurité' },
  { id: 'cookies', title: '6. Cookies' },
  { id: 'droits', title: '7. Vos Droits' },
  { id: 'contact', title: '8. Contact Privacy' }
]
</script>
