<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
    <!-- Hero Header -->
    <section class="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-4 border-b border-gray-800">
      <div class="container mx-auto max-w-4xl text-center relative z-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-4">
          <i class="fas fa-balance-scale"></i> Document Légal
        </span>
        <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Conditions Générales d'Utilisation (CGU)
        </h1>
        <p class="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
          Découvrez les règles d'utilisation de la plateforme Panyem, le fonctionnement des achats, de l'escrow sécurisé et des services de livraison en Haïti.
        </p>
        <div class="mt-4 text-xs text-gray-400">
          <i class="far fa-calendar-alt mr-1"></i> Dernière mise à jour : 19 septembre 2026 • Version 2.4
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Table of Contents Sticky Nav -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-20 space-y-1">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Sommaire des CGU</h3>
            <nav class="space-y-1">
              <a
                v-for="(item, idx) in toc"
                :key="idx"
                :href="'#' + item.id"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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

            <!-- Alert Callout -->
            <div class="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-xl flex items-start gap-3">
              <i class="fas fa-shield-alt text-blue-600 dark:text-blue-400 text-xl mt-0.5"></i>
              <div class="text-xs md:text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                <strong>En résumé :</strong> En naviguant sur Panyem ou en effectuant une commande, vous acceptez l'intégralité des termes ci-dessous. Vos achats sont protégés par notre système d'escrow : les vendeurs ne reçoivent le paiement qu'après validation de votre livraison.
              </div>
            </div>

            <!-- Section 1 -->
            <section id="preambule" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-blue-600 dark:text-blue-400">1.</span> Éditeur & Préambule
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du site et des applications mobiles de la marketplace <strong>Panyem</strong> (éditée par Panyem S.A., immatriculée à Port-au-Prince, Haïti).
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Tout accès ou création de compte sur la plateforme implique l'acceptation expresse et sans réserve des présentes conditions par l'utilisateur (acheteur, vendeur ou visiteur).
              </p>
            </section>

            <!-- Section 2 -->
            <section id="services" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-blue-600 dark:text-blue-400">2.</span> Rôle de Marketplace & Escrow (Protection Acheteur)
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Panyem opère en tant que place de marché technologique mettant en relation des vendeurs enregistrés et des acheteurs résidant en Haïti ou à l'étranger.
              </p>
              <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1.5 pl-2">
                <li><strong>Mécanisme d'Escrow (Séquestre) :</strong> Les fonds versés lors d'une commande sont conservés sur un compte sécurisé sous séquestre par Panyem.</li>
                <li><strong>Libération des fonds :</strong> Les fonds sont versés au vendeur uniquement après la livraison effective du produit et confirmation par l'acheteur via le code QR ou le numéro de validation.</li>
                <li><strong>Support Litiges :</strong> En cas de défaut de livraison ou d'article non conforme, l'équipe Panyem intervient pour arbitrer le remboursement.</li>
              </ul>
            </section>

            <!-- Section 3 -->
            <section id="compte" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-blue-600 dark:text-blue-400">3.</span> Compte Utilisateur & Sécurité (2FA)
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Pour passer commande ou créer une boutique, vous devez posséder un compte valide avec une adresse e-mail et un numéro de téléphone vérifiables.
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Vous êtes entièrement responsable de la confidentialité de vos identifiants. Nous vous recommandons vivement d'activer la <strong>Double Authentification (2FA)</strong> dans vos paramètres de compte.
              </p>
            </section>

            <!-- Section 4 -->
            <section id="prix" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-blue-600 dark:text-blue-400">4.</span> Prix, Devises & Frais de Transaction
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Tous les prix affichés sur la plateforme sont indiqués en <strong>Gourdes haïtiennes (HTG)</strong> ou en <strong>Dollars américains (USD)</strong> selon le choix d'affichage.
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Les prix incluent toutes les taxes applicables. Les frais de livraison sont calculés séparément avant la finalisation de la commande et sont indiqués clairement dans le panier.
              </p>
            </section>

            <!-- Section 5 -->
            <section id="paiement" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-blue-600 dark:text-blue-400">5.</span> Modes de Paiement
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Panyem propose plusieurs moyens de paiement sécurisés adaptés au marché haïtien :
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div class="font-bold text-xs text-gray-900 dark:text-white mb-1"><i class="fas fa-mobile-alt text-orange-500 mr-1.5"></i> MonCash & Natcash</div>
                  <div class="text-[11px] text-gray-500 dark:text-gray-400">Paiement mobile direct en Gourdes (HTG).</div>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div class="font-bold text-xs text-gray-900 dark:text-white mb-1"><i class="fab fa-stripe text-blue-500 mr-1.5"></i> Cartes Visa / Mastercard</div>
                  <div class="text-[11px] text-gray-500 dark:text-gray-400">Transactions chiffrées de bout en bout pour la diaspora et la clientèle locale.</div>
                </div>
              </div>
            </section>

            <!-- Section 6 -->
            <section id="livraison" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-blue-600 dark:text-blue-400">6.</span> Expédition & Livraison en Haïti
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Panyem assure ou supervise l'expédition des produits dans toutes les régions d'Haïti :
              </p>
              <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1.5 pl-2">
                <li><strong>Délais Métropolitains (Port-au-Prince, Cap-Haïtien) :</strong> 24h à 48h ouvrées.</li>
                <li><strong>Villes de Province :</strong> 3 à 5 jours ouvrés.</li>
                <li><strong>Contrôle à la réception :</strong> L'acheteur doit inspecter le colis devant le livreur et présenter son code de suivi ou scanner le QR code.</li>
              </ul>
            </section>

            <!-- Section 7 -->
            <section id="retours" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-blue-600 dark:text-blue-400">7.</span> Retours & Remboursements
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                L'acheteur bénéficie d'un délai de <strong>7 jours</strong> à compter de la réception pour signaler un problème ou solliciter un retour pour un produit défectueux ou non conforme à sa fiche descriptive.
              </p>
            </section>

            <!-- Section 8 -->
            <section id="vendeurs" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-blue-600 dark:text-blue-400">8.</span> Engagement des Vendeurs Tiers
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Les vendeurs s'engagent à vendre exclusivement des produits authentiques, légaux en Haïti, neufs ou reconditionnés certifiés. La vente de contrefaçons entraîne la fermeture immédiate de la boutique et la retenue des fonds.
              </p>
            </section>

            <!-- Section 9 -->
            <section id="propriete" class="scroll-mt-24 space-y-3 border-b border-gray-100 dark:border-gray-800 pb-6">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-blue-600 dark:text-blue-400">9.</span> Propriété Intellectuelle
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                La marque Panyem, le logo, les graphismes, le code source et le contenu sont la propriété exclusive de Panyem S.A. Toute reproduction sans autorisation préalable est strictement interdite.
              </p>
            </section>

            <!-- Section 10 -->
            <section id="droit" class="scroll-mt-24 space-y-3">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span class="text-blue-600 dark:text-blue-400">10.</span> Droit Applicable & Juridiction
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Les présentes CGU sont régies et interprétées selon le droit haïtien. En cas de différend non résolu à l'amiable, les tribunaux compétents de Port-au-Prince seront seuls habilités à trancher le litige.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toc = [
  { id: 'preambule', title: '1. Éditeur & Préambule' },
  { id: 'services', title: '2. Marketplace & Escrow' },
  { id: 'compte', title: '3. Compte & Sécurité' },
  { id: 'prix', title: '4. Prix, Devises & Taxe' },
  { id: 'paiement', title: '5. Modes de Paiement' },
  { id: 'livraison', title: '6. Expédition en Haïti' },
  { id: 'retours', title: '7. Retours & Remboursement' },
  { id: 'vendeurs', title: '8. Engagements Vendeurs' },
  { id: 'propriete', title: '9. Propriété Intellectuelle' },
  { id: 'droit', title: '10. Droit & Juridiction' }
]
</script>
