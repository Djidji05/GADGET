<template>
  <div class="checkout-page bg-[#fafafa] dark:bg-gray-950 min-h-screen text-gray-800 dark:text-gray-200 pb-8 transition-colors duration-300">
    <!-- Minimalist Premium Header -->
    <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-850 py-4 px-6 sticky top-0 z-50 select-none">
      <div class="container mx-auto flex items-center justify-between max-w-5xl">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-1">
          <span class="text-lg font-black uppercase tracking-wider text-black dark:text-white">HT<span class="text-blue-600">Fasil</span></span>
        </router-link>
        
        <!-- Steps Progress Text -->
        <div class="hidden sm:flex items-center gap-4 text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500">
          <span class="text-gray-300 dark:text-gray-700">1. PANIER</span>
          <span class="text-gray-300 dark:text-gray-700">/</span>
          <span class="text-blue-600 dark:text-blue-400 font-extrabold">2. LIVRAISON & PAIEMENT</span>
          <span class="text-gray-300 dark:text-gray-700">/</span>
          <span>3. CONFIRMATION</span>
        </div>
        
        <!-- Cancel button -->
        <button 
          @click="router.push('/cart')" 
          class="flex items-center gap-1 text-gray-400 hover:text-red-500 font-bold transition-all duration-200 text-[10px] uppercase tracking-wider"
        >
          <i class="las la-times text-sm"></i>
          <span>{{ $t('common.cancel') }}</span>
        </button>
      </div>
    </header>

    <!-- Main Container -->
    <div class="container mx-auto px-4 py-8 max-w-5xl">
      <!-- Title Page & Welcome info -->
      <div class="mb-8">
        <h1 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Validation de commande</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Connecté en tant que <span class="font-bold text-gray-700 dark:text-gray-300">{{ authStore.customer?.firstName }} {{ authStore.customer?.lastName }}</span> ({{ authStore.customer?.email }})
        </p>
      </div>

      <!-- Collapsible Mobile Order Summary -->
      <div class="lg:hidden bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 mb-6 rounded-2xl overflow-hidden shadow-sm">
        <div 
          @click="showMobileSummary = !showMobileSummary" 
          class="p-4 flex justify-between items-center cursor-pointer"
        >
          <div class="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-gray-750 dark:text-gray-250">
            <i class="las la-shopping-bag text-blue-600 text-lg"></i>
            <span>{{ showMobileSummary ? 'Masquer le récapitulatif' : 'Afficher le récapitulatif' }}</span>
            <i class="las" :class="showMobileSummary ? 'la-angle-up' : 'la-angle-down'"></i>
          </div>
          <div class="font-black text-sm text-blue-600 dark:text-blue-400">
            {{ formatPrice(total) }}
          </div>
        </div>
        
        <!-- Mobile Accordion Content -->
        <div v-if="showMobileSummary" class="border-t border-gray-100 dark:border-gray-850 p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50 animate-fade-in">
          <div class="space-y-2 text-xs">
            <div class="flex justify-between text-gray-500">
              <span>{{ items.reduce((acc, item) => acc + item.quantity, 0) }} Article(s)</span>
              <span class="font-semibold text-gray-850 dark:text-gray-150">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>Livraison</span>
              <span v-if="loadingShipping" class="text-gray-400">Calcul...</span>
              <span v-else-if="shippingFee === 0" class="text-green-600 font-bold uppercase">Gratuit</span>
              <span v-else class="font-semibold text-gray-850 dark:text-gray-150">{{ formatPrice(shippingFee) }}</span>
            </div>
            <div v-if="pointsDiscount > 0" class="flex justify-between text-green-600 font-bold">
              <span>Réduction Fidélité</span>
              <span>- {{ formatPrice(pointsDiscount) }}</span>
            </div>
          </div>
          
          <div class="border-t border-gray-150 dark:border-gray-800 my-2"></div>
          
          <!-- Items List -->
          <div class="space-y-3 max-h-48 overflow-y-auto">
            <div v-for="item in items" :key="item.id" class="flex gap-3 text-xs items-center">
              <img
                :src="item.product.image || 'https://placehold.co/100?text=Product'"
                :alt="item.product.name"
                class="w-10 h-10 object-cover border border-gray-100 dark:border-gray-800 shrink-0 rounded-lg"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-gray-850 dark:text-gray-150 truncate">{{ item.product.name }}</h4>
                <p class="text-gray-450 mt-0.5">Quantité : <span class="font-semibold text-gray-700 dark:text-gray-300">{{ item.quantity }}</span></p>
              </div>
              <span class="font-bold text-gray-800 dark:text-gray-200 shrink-0">{{ formatPrice(item.subtotal) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <!-- Left Column: Checkout Forms -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Shipping Address Section -->
          <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm">
            <div 
              @click="showShippingForm = !showShippingForm" 
              class="flex justify-between items-center cursor-pointer select-none border-b pb-4 border-gray-100 dark:border-gray-850 mb-6"
            >
              <h3 class="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                <span class="w-5 h-5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-[10px]">1</span>
                <span>Adresse de livraison</span>
              </h3>
              <i class="las text-gray-400" :class="showShippingForm ? 'la-angle-up' : 'la-angle-down'"></i>
            </div>

            <!-- Shipping Inputs Form Body -->
            <div class="space-y-5">
              <!-- Saved Addresses Selector -->
              <div v-if="savedAddresses.length > 0" class="mb-4">
                <label class="premium-label">Utiliser une adresse sauvegardée</label>
                <select 
                  v-model="selectedAddressId" 
                  class="premium-input font-bold rounded-xl"
                >
                  <option value="new">+ Saisir une nouvelle adresse de livraison</option>
                  <option v-for="addr in savedAddresses" :key="addr.id" :value="addr.id">
                    {{ addr.street }}, {{ addr.city }} ({{ addr.country }}) {{ addr.is_default ? '★ Par défaut' : '' }}
                  </option>
                </select>
              </div>

              <!-- Selected Address Display Card -->
              <div v-if="selectedAddressId !== 'new'" class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-fade-in mb-4 relative">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                    <i class="las la-map-marker-alt text-xl text-blue-600 dark:text-blue-400"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 dark:text-white text-sm">{{ shippingInfo.firstName }} {{ shippingInfo.lastName }}</h4>
                    <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{{ shippingInfo.street }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-300">{{ shippingInfo.city }}, {{ shippingInfo.country }}</p>
                    <p v-if="shippingInfo.phone" class="text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1 uppercase tracking-wider">
                      <i class="las la-phone"></i> {{ shippingInfo.phone }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Other Shipping Inputs Form - Hidden when a saved address is selected -->
              <div v-show="showShippingForm && selectedAddressId === 'new'" class="space-y-4 animate-fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="premium-label">Prénom *</label>
                    <input
                      v-model="shippingInfo.firstName"
                      type="text"
                      required
                      placeholder="Votre prénom"
                      class="premium-input"
                    />
                  </div>
                  <div>
                    <label class="premium-label">Nom de famille *</label>
                    <input
                      v-model="shippingInfo.lastName"
                      type="text"
                      required
                      placeholder="Votre nom"
                      class="premium-input"
                    />
                  </div>
                </div>

                <!-- Address Lookup / Search Input -->
                <div class="relative">
                  <label class="premium-label">Adresse physique *</label>
                  <div class="relative flex items-center">
                    <input
                      v-model="shippingInfo.street"
                      type="text"
                      required
                      placeholder="Numéro, rue, quartier..."
                      class="premium-input pr-10"
                    />
                    <i class="las la-map-marker absolute right-3.5 text-blue-600 dark:text-blue-400 text-lg"></i>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="premium-label">Ville *</label>
                    <input
                      v-model="shippingInfo.city"
                      type="text"
                      required
                      placeholder="Ex: Pétion-Ville, Cap-Haïtien..."
                      class="premium-input"
                    />
                  </div>
                  <div>
                    <label class="premium-label">Pays *</label>
                    <input
                      v-model="shippingInfo.country"
                      type="text"
                      required
                      placeholder="Pays"
                      class="premium-input"
                    />
                  </div>
                </div>

                <!-- GPS Autocomplete Button -->
                <div class="pt-2">
                  <button 
                    type="button"
                    @click="captureGPS"
                    class="w-full bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-750 dark:text-gray-300 text-xs font-bold py-3 transition-all duration-200 rounded-xl flex items-center justify-center gap-2"
                  >
                    <i class="las la-crosshairs text-blue-600 dark:text-blue-400 text-base"></i>
                    <span>Géolocaliser ma position par GPS</span>
                  </button>
                  <div v-if="shippingInfo.coordinates" class="mt-2.5 text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider flex items-center gap-1.5 justify-center">
                    <i class="las la-check-circle text-sm"></i>
                    <span>Coordonnées GPS capturées : {{ shippingInfo.coordinates.lat.toFixed(5) }}, {{ shippingInfo.coordinates.lng.toFixed(5) }}</span>
                  </div>
                </div>

                <!-- Haiti Reference Point Detail -->
                <div>
                  <label class="premium-label">Repère ou instructions de livraison (Spécifique Haïti)</label>
                  <textarea
                    v-model="shippingInfo.referencePoint"
                    rows="2"
                    placeholder="Ex: Près de la station-service, portail métallique vert, face à l'école..."
                    class="premium-input rounded-xl"
                  ></textarea>
                </div>
              </div>

              <!-- Undeliverable Alert (Always visible if undeliverable, regardless of address selection) -->
              <div v-if="!isDeliverable && showShippingForm" class="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-400 p-4 rounded-xl text-xs font-semibold space-y-1 mt-4 animate-fade-in">
                <p class="font-black flex items-center gap-1.5 uppercase tracking-wide">
                  <i class="las la-exclamation-triangle text-base"></i>
                  <span>Destination non desservie</span>
                </p>
                <p>Les boutiques suivantes ne peuvent pas livrer à <strong>{{ shippingInfo.city }}</strong> :</p>
                <ul class="list-disc pl-5 font-black">
                  <li v-for="storeName in undeliverableStores" :key="storeName">{{ storeName }}</li>
                </ul>
                <p class="italic text-[10px] mt-1 text-red-500 dark:text-red-400/80">
                  Veuillez renseigner une autre ville ou modifier votre panier.
                </p>
              </div>
            </div>
          </div>



          <!-- Contact Details Section -->
          <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm">
            <h3 class="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-100 dark:border-gray-855 flex items-center gap-2">
              <span class="w-5 h-5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-[10px]">2</span>
              <span>Contact & Notification</span>
            </h3>

            <div class="space-y-4">
              <div>
                <label class="premium-label">Numéro de téléphone WhatsApp (Pour le suivi) *</label>
                <input
                  v-model="shippingInfo.phone"
                  type="tel"
                  required
                  placeholder="Ex: +509 3700 0000"
                  class="premium-input font-bold text-blue-600 dark:text-blue-400"
                />
              </div>
              <p class="text-[10px] text-gray-450 dark:text-gray-500">
                Les mises à jour de livraison vous seront envoyées sur ce numéro WhatsApp ainsi qu'à l'adresse <strong>{{ authStore.customer?.email }}</strong>.
              </p>
            </div>
          </div>

          <!-- Loyalty Points Section -->
          <div v-if="loyaltyStore.account && loyaltyStore.account.points_balance >= 100" class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm">
            <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 border-b pb-3 border-gray-100 dark:border-gray-850">
              Fidélité & Réductions
            </h3>
            
            <div class="flex justify-between items-center text-xs font-bold mb-4 bg-gray-50 dark:bg-gray-950 p-3 rounded-xl">
              <span class="text-gray-500">Vos points de fidélité :</span>
              <span class="text-gray-900 dark:text-white">{{ loyaltyStore.account.points_balance }} pts (valeur : {{ formatPrice(loyaltyStore.account.redeem_value) }})</span>
            </div>

            <div class="flex items-center gap-3">
              <input 
                type="checkbox" 
                v-model="usePoints" 
                id="apply_points_box"
                class="premium-checkbox" 
              />
              <label for="apply_points_box" class="text-xs text-gray-700 dark:text-gray-300 font-bold cursor-pointer select-none">
                Utiliser mes points pour économiser <span class="text-blue-600 dark:text-blue-400">{{ formatPrice(applicablePointsDiscount) }}</span> (coûte {{ pointsToUse }} pts)
              </label>
            </div>
          </div>

          <!-- Payment Methods Section -->
          <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm">
            <h3 class="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-100 dark:border-gray-850 flex items-center gap-2">
              <span class="w-5 h-5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-[10px]">3</span>
              <span>Mode de paiement</span>
            </h3>

            <!-- Payment Selector Tabs -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- MonCash -->
              <div 
                @click="paymentMethod = 'moncashwise'"
                class="relative border cursor-pointer p-5 transition-all duration-200 rounded-2xl flex flex-col justify-between h-28 bg-gray-50/20 dark:bg-gray-900/20"
                :class="paymentMethod === 'moncashwise' ? 'border-2 border-blue-600 dark:border-blue-500 shadow-sm' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'"
              >
                <div class="flex justify-between items-start w-full">
                  <img src="/images/moncash.png" alt="MonCash" class="h-6 object-contain" />
                  <span class="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center shrink-0">
                    <span v-if="paymentMethod === 'moncashwise'" class="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
                  </span>
                </div>
                <div>
                  <h4 class="font-extrabold text-xs text-gray-850 dark:text-gray-150">Payer par MonCash</h4>
                  <p class="text-[9px] text-gray-400 mt-1">Transaction locale haïtienne en Gourdes via Starbee.</p>
                </div>
              </div>

              <!-- Stripe -->
              <div 
                @click="paymentMethod = 'visa'"
                class="relative border cursor-pointer p-5 transition-all duration-200 rounded-2xl flex flex-col justify-between h-28 bg-gray-50/20 dark:bg-gray-900/20"
                :class="paymentMethod === 'visa' ? 'border-2 border-blue-600 dark:border-blue-500 shadow-sm' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'"
              >
                <div class="flex justify-between items-start w-full">
                  <div class="flex items-center gap-1 text-xl text-gray-600 dark:text-gray-400">
                    <i class="lab la-cc-visa text-blue-600"></i>
                    <i class="lab la-cc-mastercard text-orange-500"></i>
                  </div>
                  <span class="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center shrink-0">
                    <span v-if="paymentMethod === 'visa'" class="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
                  </span>
                </div>
                <div>
                  <h4 class="font-extrabold text-xs text-gray-850 dark:text-gray-150">Carte Bancaire / Stripe</h4>
                  <p class="text-[9px] text-gray-400 mt-1">Paiements Visa/Mastercard sécurisés en Dollars.</p>
                </div>
              </div>
            </div>

            <!-- MonCash Information Panel -->
            <div v-if="paymentMethod === 'moncashwise'" class="mt-4 p-4 border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/10 text-xs rounded-xl animate-fade-in space-y-2">
              <p class="leading-relaxed text-gray-600 dark:text-gray-400">
                <i class="las la-info-circle text-blue-600 dark:text-blue-400 mr-1.5 text-sm align-middle"></i>
                Vous serez redirigé vers l'interface sécurisée de **Digicel MonCash** pour confirmer le paiement.
              </p>
              <div v-if="total > 100000" class="mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg text-yellow-800 dark:text-yellow-400">
                <i class="las la-exclamation-triangle mr-1 text-base"></i>
                <strong>Paiement en tranches :</strong> Le total dépasse le plafond MonCash (100 000 HTG). Vous paierez une première tranche de <strong>100 000 HTG</strong> maintenant, et le reste ultérieurement depuis "Mes Commandes".
              </div>
            </div>

            <!-- Stripe Information Panel -->
            <div v-if="paymentMethod === 'visa'" class="mt-4 p-4 border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/10 text-xs rounded-xl animate-fade-in space-y-2">
              <p class="leading-relaxed text-gray-600 dark:text-gray-400">
                <i class="las la-info-circle text-blue-600 dark:text-blue-400 mr-1.5 text-sm align-middle"></i>
                Vous allez être redirigé vers la passerelle sécurisée **Stripe Checkout** pour entrer vos détails de carte.
              </p>
              <div class="pt-3.5 border-t border-gray-200 dark:border-gray-800 space-y-1.5">
                <div class="flex justify-between font-bold text-[10px] text-gray-400 uppercase">
                  <span>Montant (HTG) :</span>
                  <span>{{ formatPrice(total) }}</span>
                </div>
                <div class="flex justify-between font-black text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  <span>Total Converti :</span>
                  <span>$ {{ usdAmount }} USD</span>
                </div>
                <p class="text-[9px] text-gray-450 italic mt-0.5">
                  Taux appliqué : 1 USD = {{ exchangeRate }} HTG
                </p>
              </div>
            </div>
          </div>

          <!-- Save Address & Preferences -->
          <div class="space-y-3.5 pt-2">
            <div class="flex items-start gap-3 select-none">
              <input 
                type="checkbox" 
                v-model="saveAddress" 
                id="save_addr_box"
                class="premium-checkbox mt-0.5 shrink-0" 
              />
              <label for="save_addr_box" class="text-xs text-gray-600 dark:text-gray-400 font-semibold cursor-pointer select-none">
                Mémoriser cette adresse de livraison pour mes futurs achats.
              </label>
            </div>

            <div class="flex items-start gap-3 select-none">
              <input 
                type="checkbox" 
                id="age_check"
                checked
                class="premium-checkbox mt-0.5 shrink-0" 
              />
              <label for="age_check" class="text-xs text-gray-600 dark:text-gray-400 font-semibold cursor-pointer select-none">
                J'accepte les conditions générales de vente de HTFasil.
              </label>
            </div>
          </div>

          <!-- Checkout Confirm Button -->
          <div class="pt-4">
            <button
              @click="placeOrder"
              :disabled="isPlacingOrder || !isDeliverable"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base uppercase tracking-widest py-5 rounded-2xl active:scale-[0.99] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <span>{{ isPlacingOrder ? 'TRAITEMENT DU PAIEMENT...' : 'PAYER MAINTENANT' }}</span>
              <i class="las la-lock text-xl"></i>
            </button>
            <p class="text-center text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black mt-3 flex items-center justify-center gap-1">
              <i class="las la-shield-alt text-green-500 text-xs"></i>
              <span>Sécurité SSL de niveau bancaire</span>
            </p>
          </div>
        </div>

        <!-- Right Column: Sidebar Order Summary -->
        <div class="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
          
          <!-- Order Summary Card -->
          <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-sm">
            <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
              Récapitulatif
            </h3>

            <div class="space-y-3.5 text-xs">
              <div class="flex justify-between text-gray-550 dark:text-gray-450 font-medium">
                <span>{{ items.reduce((acc, item) => acc + item.quantity, 0) }} Article(s)</span>
                <span class="font-bold text-gray-800 dark:text-gray-200">{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-550 dark:text-gray-455 font-medium">
                <span>Frais de livraison</span>
                <span v-if="loadingShipping" class="text-gray-400">Calcul...</span>
                <span v-else-if="shippingFee === 0" class="text-green-600 dark:text-green-400 font-extrabold uppercase">Gratuit</span>
                <span v-else class="font-bold text-gray-800 dark:text-gray-200">{{ formatPrice(shippingFee) }}</span>
              </div>
              
              <!-- Points Discount -->
              <div v-if="pointsDiscount > 0" class="flex justify-between text-green-600 dark:text-green-400 font-extrabold">
                <span>Réduction fidélité</span>
                <span>- {{ formatPrice(pointsDiscount) }}</span>
              </div>

              <div class="border-t border-gray-100 dark:border-gray-850 my-4"></div>

              <div class="flex justify-between items-baseline font-bold text-gray-900 dark:text-white">
                <span class="text-xs uppercase tracking-wider">Montant total</span>
                <div class="text-right">
                  <span class="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">{{ formatPrice(total) }}</span>
                </div>
              </div>
              
              <!-- Stripe USD display -->
              <div v-if="paymentMethod === 'visa'" class="text-right text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-1">
                $ {{ usdAmount }} USD
              </div>
            </div>
          </div>

          <!-- Order Details Card (Items List) -->
          <div class="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-855 p-6 rounded-2xl shadow-sm">
            <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
              Articles commandés
            </h3>

            <div class="space-y-4 max-h-[320px] overflow-y-auto pr-1">
              <div v-for="item in items" :key="item.id" class="flex gap-3 border-b border-gray-50 dark:border-gray-850 pb-3 last:border-b-0 last:pb-0 items-center">
                <img
                  :src="item.product.image || 'https://placehold.co/100?text=Product'"
                  :alt="item.product.name"
                  class="w-12 h-12 object-cover border border-gray-100 dark:border-gray-800 shrink-0 rounded-xl"
                />
                <div class="flex-1 min-w-0 text-xs">
                  <h4 class="font-bold text-gray-800 dark:text-gray-250 truncate leading-snug">
                    {{ item.product.name }}
                  </h4>
                  <p class="text-[10px] text-gray-450 mt-0.5">Qté : <span class="font-bold text-gray-800 dark:text-gray-200">{{ item.quantity }}</span></p>
                  
                  <div class="flex justify-between items-center mt-1">
                    <span class="font-bold text-gray-800 dark:text-gray-200">{{ formatPrice(item.subtotal) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Safe Gateway Footer Details -->
          <div class="text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider p-4 select-none">
            <span>Certifié PCI-DSS • Cryptage AES 256 bits</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useLoyaltyStore } from '@/stores/loyalty'
import { ordersService, type CreateOrderData } from '@/services/orders'
import api, { addressService, type Address } from '@/services/api'
import { useUiStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'
import { formatOrderId } from '@/utils/formatters';

const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()
const authStore = useAuthStore()
const loyaltyStore = useLoyaltyStore()
const uiStore = useUiStore()
const settingsStore = useSettingsStore()

// State
const savedAddresses = ref<Address[]>([])
const selectedAddressId = ref<number | 'new'>('new')
const isPlacingOrder = ref(false)
const saveAddress = ref(true)
const showMobileSummary = ref(false) // Toggle mobile order summary details
const showShippingForm = ref(true)  // Toggle shipping address form (unfolded by default)

// Computed
const items = computed(() => cartStore.items.filter(item => cartStore.selectedItems.has(item.id)))
const subtotal = computed(() => items.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))

const usePoints = ref(false)
const pointsDiscount = ref(0)
const pointsToUse = ref(0)

const applicablePointsDiscount = computed(() => {
  if (!loyaltyStore.account) return 0
  const maxDiscount = Math.floor(subtotal.value * 0.5)
  const availableDiscount = Math.floor(loyaltyStore.account.points_balance / 100) * 5
  return Math.min(maxDiscount, availableDiscount)
})

watch([usePoints, subtotal], () => {
  if (usePoints.value) {
    pointsDiscount.value = applicablePointsDiscount.value
    pointsToUse.value = Math.floor(pointsDiscount.value / 5) * 100
  } else {
    pointsDiscount.value = 0
    pointsToUse.value = 0
  }
})

const paymentMethod = ref('moncashwise')
const shippingInfo = ref({
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  country: 'Haïti',
  phone: '',
  referencePoint: '',
  coordinates: null as { lat: number; lng: number } | null,
})

const paymentDetails = ref({
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  cardHolder: '',
  mobileNumber: '',
})

const shippingFee = ref(0)
const loadingShipping = ref(false)
const isDeliverable = ref(true)
const undeliverableStores = ref<string[]>([])

const calculateShipping = async () => {
  if (items.value.length === 0 || !shippingInfo.value.city) {
    shippingFee.value = 0
    isDeliverable.value = true
    undeliverableStores.value = []
    return
  }
  
  try {
    loadingShipping.value = true
    const response = await api.post('/orders/calculate-shipping', {
      items: items.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      shippingAddress: {
        city: shippingInfo.value.city
      }
    })
    shippingFee.value = Number(response.data.shippingFee) || 0
    isDeliverable.value = response.data.deliverable !== false
    
    const storesList: string[] = []
    if (response.data.breakdown) {
      Object.values(response.data.breakdown).forEach((b: any) => {
        if (b.deliverable === false) {
          storesList.push(b.storeName || 'Vendeur')
        }
      })
    }
    undeliverableStores.value = storesList
  } catch (e) {
    console.error('Failed to calculate shipping', e)
    shippingFee.value = 250 // Fallback
    isDeliverable.value = true
    undeliverableStores.value = []
  } finally {
    loadingShipping.value = false
  }
}

watch(() => shippingInfo.value.city, () => {
  calculateShipping()
})

watch(items, () => {
  calculateShipping()
}, { deep: true })

const total = computed(() => {
  const subtotalValue = subtotal.value
  return Math.max(0, subtotalValue + shippingFee.value - pointsDiscount.value)
})

const exchangeRate = computed(() => Number(settingsStore.general.usd_exchange_rate) || 135)
const usdAmount = computed(() => {
  return (total.value / exchangeRate.value).toFixed(2);
})

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price)
}

const captureGPS = () => {
  if (!navigator.geolocation) {
    uiStore.showToast(t('common.error'), "error");
    return;
  }

  uiStore.showToast(t('common.loading'), "info");
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      shippingInfo.value.coordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      uiStore.showToast(t('common.success'), "success");
    },
    (error) => {
      console.error("GPS Error", error);
      let msg = t('common.error');
      if (error.code === 1) msg = t('common.error');
      uiStore.showToast(msg, "warning");
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
}

const placeOrder = async () => {
  if (isPlacingOrder.value) return

  // Validation manuelle avec feedback
  if (!shippingInfo.value.firstName || !shippingInfo.value.lastName || !shippingInfo.value.street || !shippingInfo.value.city) {
    uiStore.showToast("Veuillez remplir correctement l'adresse de livraison.", 'warning')
    return
  }
  
  if (isDeliverable.value === false) {
    uiStore.showToast("Certains vendeurs ne livrent pas dans votre zone de livraison.", 'error')
    return
  }

  if (items.value.length === 0) {
    uiStore.showToast(t('checkout.empty_cart'), 'error')
    router.push('/cart')
    return
  }

  try {
    isPlacingOrder.value = true

    // Sauvegarder l'adresse si demandé et si c'est une nouvelle adresse
    if (saveAddress.value && selectedAddressId.value === 'new') {
      try {
        await addressService.create({
          street: shippingInfo.value.street,
          city: shippingInfo.value.city,
          country: shippingInfo.value.country,
          whatsapp: shippingInfo.value.phone,
          quartier: shippingInfo.value.city,
          coordinates: shippingInfo.value.coordinates,
          reference_point: shippingInfo.value.referencePoint,
          is_default: savedAddresses.value.length === 0
        })
      } catch (err) {
        console.warn('Failed to save address:', err)
      }
    }

    // Agrégation
    const aggregatedItems = items.value.reduce((acc, item) => {
      const existing = acc.find(i => i.productId === item.productId && i.offerId === item.offerId)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        acc.push({ 
          productId: item.productId, 
          offerId: item.offerId, 
          quantity: item.quantity 
        })
      }
      return acc
    }, [] as { productId: number; offerId?: number; quantity: number }[])

    const orderData: CreateOrderData = {
      userId: authStore.customer?.id || 0,
      items: aggregatedItems,
      shippingAddress: {
        street: shippingInfo.value.street,
        city: shippingInfo.value.city,
        postalCode: '00000',
        country: shippingInfo.value.country,
        phone: shippingInfo.value.phone
      },
      shippingCoordinates: shippingInfo.value.coordinates,
      referencePoint: shippingInfo.value.referencePoint,
      paymentMethod: {
        type: paymentMethod.value as 'moncashwise' | 'visa',
        details: paymentDetails.value,
      },
      pointsToUse: pointsToUse.value,
    }

    const order = await ordersService.createOrder(orderData)

    if (paymentMethod.value === 'moncashwise') {
      try {
        const orderTotal = order.totalAmount || items.value.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        
        const response = await api.post('/paiements/init-moncash', {
          orderId: order.id,
          amount: orderTotal,
          returnUrl: `${window.location.origin}/payment/callback`
        })
        
        if (response.data.redirectUrl) {
          try {
            if (window.self !== window.top) {
              window.open(response.data.redirectUrl, '_blank')
              uiStore.showToast("Paiement ouvert dans un nouvel onglet.", "info")
            } else {
              window.location.href = response.data.redirectUrl
            }
          } catch(e) {
            window.open(response.data.redirectUrl, '_blank')
            uiStore.showToast("Paiement ouvert dans un nouvel onglet.", "info")
          }
          return
        }
      } catch (err: any) {
        console.error('MonCash Init Error:', err)
        const msg = err.response?.data?.error || err.message || t('common.error')
        uiStore.showToast(`${t('common.error')} MonCash: ${msg}`, 'error')
        isPlacingOrder.value = false
        return
      }
    }

    if (paymentMethod.value === 'visa') {
      try {
        const orderTotal = order.totalAmount || items.value.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        
        const response = await api.post('/paiements/init-stripe', {
          orderId: order.id,
          amount: orderTotal,
          returnUrl: `${window.location.origin}/payment/callback?status=success&transaction_id={CHECKOUT_SESSION_ID}`
        })
        
        if (response.data.redirectUrl) {
          try {
            if (window.self !== window.top) {
              window.open(response.data.redirectUrl, '_blank')
              uiStore.showToast("Paiement Stripe ouvert dans un nouvel onglet.", "info")
            } else {
              window.location.href = response.data.redirectUrl
            }
          } catch(e) {
            window.open(response.data.redirectUrl, '_blank')
            uiStore.showToast("Paiement Stripe ouvert dans un nouvel onglet.", "info")
          }
          return
        }
      } catch (err: any) {
        console.error('Stripe Init Error:', err)
        const msg = err.response?.data?.error || err.message || t('common.error')
        uiStore.showToast(`${t('common.error')} Stripe: ${msg}`, 'error')
        isPlacingOrder.value = false
        return
      }
    }

    await cartStore.clearCart()
    router.push(`/payment/success?orderId=${formatOrderId(order.id)}`)
  } catch (error: any) {
    console.error('Error placing order:', error)
    const msg = error.response?.data?.error || error.message || t('common.error')
    uiStore.showToast(`${t('common.error')}: ${msg}`, 'error')
  } finally {
    isPlacingOrder.value = false
  }
}

// Initialize
onMounted(async () => {
  try {
    await settingsStore.fetchGeneralSettings()
  } catch (e) {
    console.warn('Failed to load settings in checkout view:', e)
  }

  if (authStore.customer) {
    const customer = authStore.customer
    shippingInfo.value = {
      ...shippingInfo.value,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone || '',
    }
    
    loyaltyStore.fetchLoyalty()
    try {
      const addresses = await addressService.getAll()
      savedAddresses.value = addresses
      
      const defaultAddr = addresses.find((a: Address) => a.is_default)
      if (defaultAddr) {
        selectedAddressId.value = defaultAddr.id
        fillAddress(defaultAddr)
      } else if (addresses.length > 0) {
        selectedAddressId.value = addresses[0].id
        fillAddress(addresses[0])
      }
    } catch (e) {
      console.error("Failed to load addresses", e)
    }
  }
})

const fillAddress = (addr: Address) => {
  shippingInfo.value.street = addr.street
  shippingInfo.value.city = addr.city
  shippingInfo.value.country = addr.country || 'Haïti'
  if (addr.whatsapp) shippingInfo.value.phone = addr.whatsapp
  
  if (addr.coordinates) {
    shippingInfo.value.coordinates = typeof addr.coordinates === 'string' ? JSON.parse(addr.coordinates) : addr.coordinates
  } else {
    shippingInfo.value.coordinates = null
  }
  
  if (addr.reference_point) {
    shippingInfo.value.referencePoint = addr.reference_point
  } else {
    shippingInfo.value.referencePoint = ''
  }
}

watch(selectedAddressId, (newId) => {
  if (newId === 'new') {
    shippingInfo.value.street = ''
    shippingInfo.value.city = ''
    showShippingForm.value = true // Automatically unfold when adding new address!
  } else {
    const addr = savedAddresses.value.find(a => a.id === newId)
    if (addr) fillAddress(addr)
  }
})
</script>

<style scoped>
.checkout-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Premium modern inputs */
.premium-input {
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  color: #1f2937;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  font-weight: 500;
}

.premium-input:focus {
  border-color: #2563eb; /* Pure Blue */
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
  outline: none;
}

.dark .premium-input {
  background-color: #111827;
  border-color: #374151;
  color: #f3f4f6;
}

.dark .premium-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.premium-label {
  display: block;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
  color: #4b5563;
}

.dark .premium-label {
  color: #9ca3af;
}

/* Premium checkbox design */
.premium-checkbox {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1.5px solid #d1d5db;
  border-radius: 4px;
  background-color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background-color 0.1s ease, border-color 0.1s ease;
}

.dark .premium-checkbox {
  border-color: #4b5563;
  background-color: #1f2937;
}

.premium-checkbox:checked {
  background-color: #2563eb;
  border-color: #2563eb;
}

.dark .premium-checkbox:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.premium-checkbox:checked::after {
  content: "";
  display: block;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}
</style>
