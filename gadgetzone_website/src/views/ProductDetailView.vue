<template>
  <div class="container mx-auto px-4 pt-4 pb-12">
    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="h-96 bg-gray-300 rounded-lg"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-300 rounded w-3/4"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2"></div>
          <div class="h-4 bg-gray-300 rounded w-1/4"></div>
          <div class="h-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Product Details -->
    <!-- Product Content (Visible only when product is loaded) -->
    <div v-else-if="product">
      <!-- Breadcrumbs -->
      <nav class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-1.5 font-bold uppercase tracking-wider select-none">
        <router-link to="/" class="hover:text-primary-600 transition-colors">Home</router-link>
        <span class="text-gray-300 dark:text-gray-700">&gt;</span>
        <router-link to="/products" class="hover:text-primary-600 transition-colors">Shop</router-link>
        <span class="text-gray-300 dark:text-gray-700">&gt;</span>
        <span class="text-gray-400 dark:text-gray-500">{{ categoryName }}</span>
        <span class="text-gray-300 dark:text-gray-700">&gt;</span>
        <span class="text-gray-800 dark:text-gray-250 font-black truncate max-w-[200px]">{{ product.name }}</span>
      </nav>

      <!-- Main Product Info Grid (2 Columns) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        <!-- Left Column: Gallery -->
        <div>
          <!-- Mobile: Swipe Gallery -->
          <div class="md:hidden relative mb-4">
            <div 
              ref="mobileScrollContainer"
              class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-2xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 aspect-square"
              @scroll="handleMobileScroll"
            >
              <div 
                v-for="(img, index) in productImages" 
                :key="index"
                class="w-full flex-shrink-0 snap-center flex items-center justify-center p-4 bg-white dark:bg-gray-900 cursor-pointer"
                @click="openLightbox(index)"
              >
                <div v-if="isVideoUrl(img)" class="w-full h-full relative flex items-center justify-center bg-gray-50 dark:bg-gray-950 rounded-xl">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                      <i class="fas fa-play text-xl ml-1"></i>
                    </span>
                  </div>
                  <span class="absolute top-4 left-4 bg-black/60 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                    <i class="fas fa-video"></i> Vidéo
                  </span>
                </div>
                <img 
                  v-else
                  :src="img" 
                  :alt="`${product.name} view ${index + 1}`" 
                  class="max-w-full max-h-full object-contain" 
                  @error="handleImageError(index)"
                />
              </div>
            </div>

          </div>

          <!-- Mobile Thumbnails Gallery (Horizontally Scrollable) -->
          <div v-if="productImages.length > 1" class="flex md:hidden overflow-x-auto gap-2 py-2 px-1 scrollbar-hide no-scrollbar select-none mb-4">
            <div 
              v-for="(img, index) in productImages" 
              :key="index"
              class="w-[60px] h-[60px] rounded-xl overflow-hidden cursor-pointer border-2 flex-shrink-0 transition-all duration-150 flex items-center justify-center bg-white dark:bg-gray-900 p-1 relative"
              :class="currentImageIndex === index ? 'border-primary-600 ring-2 ring-primary-100 dark:ring-blue-950/40' : 'border-gray-200 dark:border-gray-800 hover:border-gray-350'"
              @click="setMobileImage(index)"
            >
              <div v-if="isVideoUrl(img)" class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <i class="fas fa-play text-primary-600 text-sm"></i>
              </div>
              <img 
                v-else
                :src="img" 
                :alt="`${product.name} thumbnail ${index + 1}`" 
                class="max-w-full max-h-full object-contain" 
                @error="handleImageError(index)"
              />
            </div>
          </div>

          <!-- Desktop: Main Image + Thumbnails Below -->
          <div class="hidden md:block">
            <div class="aspect-square bg-white dark:bg-gray-900 rounded-2xl overflow-hidden relative group mb-4 border border-gray-150 dark:border-gray-800 flex items-center justify-center cursor-zoom-in p-6" @click="openLightbox(currentImageIndex)">
              <div v-if="isVideoUrl(selectedImage)" class="w-full h-full relative flex items-center justify-center bg-gray-50 dark:bg-gray-950 rounded-xl">
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                    <i class="fas fa-play text-2xl ml-1"></i>
                  </span>
                </div>
                <span class="absolute top-4 left-4 bg-black/60 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                  <i class="fas fa-video"></i> Vidéo
                </span>
              </div>
              <img
                v-else
                :src="selectedImage"
                :alt="product.name"
                class="max-w-full max-h-full object-contain"
                @error="handleImageError(currentImageIndex)"
              />
              
              <!-- Navigation Buttons -->
              <button 
                @click.stop="prevImage"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                v-if="productImages.length > 1"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <button 
                @click.stop="nextImage"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                v-if="productImages.length > 1"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <!-- Thumbnails Gallery (Below) -->
            <div class="flex flex-wrap gap-2.5 justify-start">
              <div 
                v-for="(img, index) in productImages" 
                :key="index"
                class="w-[70px] h-[70px] rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-150 flex items-center justify-center bg-white dark:bg-gray-900 p-1 relative"
                :class="currentImageIndex === index ? 'border-primary-600 ring-2 ring-primary-100 dark:ring-blue-950/40' : 'border-gray-200 dark:border-gray-800 hover:border-gray-350'"
                @click="currentImageIndex = index"
              >
                <div v-if="isVideoUrl(img)" class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <i class="fas fa-play text-primary-600 text-lg"></i>
                </div>
                <img 
                  v-else
                  :src="img" 
                  :alt="`${product.name} thumbnail ${index + 1}`" 
                  class="max-w-full max-h-full object-contain" 
                  @error="handleImageError(index)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Info & Buy Section -->
        <div>
          <!-- Category -->
          <span class="block text-xs md:text-sm font-black uppercase tracking-wider text-gray-400 mb-1">
            {{ categoryName }}
          </span>

          <!-- Title -->
          <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-1.5 leading-tight uppercase tracking-wide">
            {{ product.name }}
          </h1>

          <!-- Seller Info & Location Badge -->
          <div v-if="product.buyBox || product.store" class="text-sm text-gray-700 dark:text-gray-300 font-bold mb-3 flex items-center gap-2 flex-wrap select-none">
            <div class="flex items-center gap-1.5">
              <span>Vendu par :</span>
              <router-link 
                :to="{ name: 'store-view', params: { id: product.buyBox ? product.buyBox.storeId : product.store?.id } }"
                class="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-extrabold"
              >
                {{ product.buyBox ? (product.buyBox.store?.name || 'Vendeur Certifié') : product.store?.name }}
                <i class="las la-certificate text-blue-500 text-sm" title="Vendeur Recommandé"></i>
              </router-link>
            </div>

            <!-- Seller Location (Cap-Haïtien, Nord, Ouanaminthe, Fort-Liberté) -->
            <div v-if="vendorLocation" class="inline-flex items-center gap-1 text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <i class="fas fa-map-marker-alt text-red-500 text-xs"></i>
              <span>{{ vendorLocation }}</span>
            </div>
          </div>

          <!-- Description Short -->
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed font-medium">
            {{ product.description && product.description.length > 250 ? product.description.substring(0, 250) + '...' : product.description }}
          </p>

          <!-- Stars / Reviews -->
          <div class="flex items-center gap-2 mb-4 select-none">
            <div class="flex text-yellow-400 text-sm">
              <span v-for="n in 5" :key="n">
                <i :class="n <= averageRating ? 'fas fa-star' : 'far fa-star'" class="text-xs"></i>
              </span>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400 font-bold">({{ reviews.length }} Avis Client(s))</span>
          </div>

          <!-- Price & Discounts -->
          <div class="mb-5 flex items-baseline gap-3 flex-wrap">
            <span class="text-2xl md:text-3xl font-black text-primary-600 dark:text-primary-400">
              {{ formatPrice(product.buyBox ? product.buyBox.price : product.price) }}
            </span>
            <span v-if="hasDiscount" class="text-sm text-gray-400 line-through font-bold">
              {{ formatPrice(Number(product.original_price || 0)) }}
            </span>
            <span v-if="hasDiscount" class="text-xs font-black uppercase bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full tracking-wider animate-pulse">
              Promotion limitée
            </span>
          </div>

          <!-- Estimated Delivery Date -->
          <div class="flex items-center gap-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-3 rounded-xl mb-5 select-none">
            <i class="las la-truck text-xl text-primary-600 dark:text-primary-400"></i>
            <span>Livraison estimée le : <span class="text-primary-600 dark:text-primary-400 font-extrabold">{{ formatDeliveryDate(product.stock > 0 ? (product.buyBox?.shipping_days_max || 3) : 20) }}</span></span>
          </div>

          <!-- Pick a Color (Dynamic based on specifications) -->
          <div v-if="availableColors.length > 0" class="mb-5 select-none animate-in fade-in duration-200">
            <span class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Sélectionner Couleur</span>
            <div class="flex flex-wrap gap-2.5">
              <button 
                v-for="color in availableColors" 
                :key="color"
                type="button"
                @click="selectedColor = color"
                class="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all uppercase tracking-wider flex items-center gap-1.5"
                :class="selectedColor === color ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-400'"
              >
                <span 
                  v-if="getColorDotStyle(color)" 
                  class="w-3 h-3 rounded-full border border-white/20 shrink-0 inline-block"
                  :style="{ backgroundColor: getColorDotStyle(color) }"
                ></span>
                <span>{{ color }}</span>
              </button>
            </div>
          </div>

          <!-- Pick a Size / Option (Dynamic based on specifications) -->
          <div v-if="availableSizes.length > 0" class="mb-5 select-none animate-in fade-in duration-200">
            <span class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Sélectionner Taille / Option</span>
            <div class="flex flex-wrap gap-2.5">
              <button 
                v-for="size in availableSizes" 
                :key="size"
                type="button"
                @click="selectedSize = size"
                class="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all uppercase tracking-wider"
                :class="selectedSize === size ? 'bg-primary-600 text-white border-primary-600 shadow-sm' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-400'"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Quantity selector and stock warning -->
          <div class="flex items-center gap-4 mb-6 select-none">
            <div class="flex items-center border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
              <button 
                type="button"
                @click="quantity > 1 && quantity--"
                :disabled="quantity <= 1"
                class="px-3.5 py-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
              >
                <i class="fas fa-minus text-[10px]"></i>
              </button>
              <span class="w-10 text-center font-bold text-xs text-black dark:text-white">{{ quantity }}</span>
              <button 
                type="button"
                @click="quantity++"
                class="px-3.5 py-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <i class="fas fa-plus text-[10px]"></i>
              </button>
            </div>

            <!-- Stock status -->
            <div class="text-[10px] text-gray-550 dark:text-gray-400 font-black uppercase tracking-wider">
              <span v-if="product.stock > 0 && product.stock <= 5" class="text-red-500 flex items-center gap-1 animate-pulse">
                <i class="las la-exclamation-circle text-sm"></i>
                Plus que {{ product.stock }} articles restants !
              </span>
              <span v-else-if="product.stock > 5" class="text-green-600 dark:text-green-400 flex items-center gap-1">
                <i class="las la-check-circle text-sm"></i>
                En Stock ({{ product.stock }})
              </span>
              <span v-else class="text-amber-600 flex items-center gap-1">
                <i class="las la-clock text-sm"></i>
                Sur commande (20 jours)
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="!isOwnProduct" class="flex flex-row gap-2.5 mb-6">
            <!-- Buy Now -->
            <button
              @click="buyNow"
              :disabled="isAddingToCart || (product.buyBox ? product.buyBox.stock <= 0 : product.stock <= 0)"
              class="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider py-3.5 px-3 sm:px-6 rounded-xl active:scale-[0.99] transition-all duration-200 shadow-md shadow-blue-500/15 text-center flex items-center justify-center disabled:opacity-50"
            >
              Acheter maintenant
            </button>

            <!-- Add to Cart -->
            <button
              @click="addToCart(product.buyBox)"
              :disabled="isAddingToCart || (product.buyBox && product.buyBox.stock <= 0)"
              class="flex-1 bg-white dark:bg-gray-900 border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-850 font-bold text-[10px] sm:text-xs uppercase tracking-wider py-3.5 px-3 sm:px-6 rounded-xl active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50"
            >
              <i v-if="isAddingToCart" class="las la-spinner la-spin text-sm sm:text-base"></i>
              <i v-else class="las la-shopping-cart text-sm sm:text-base"></i>
              <span>{{ (product.buyBox && product.buyBox.stock <= 0) ? $t('products.outOfStock') : $t('products.addToCart') }}</span>
            </button>
          </div>
          <div v-else class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
            <i class="las la-exclamation-triangle text-xl mt-0.5"></i>
            <div>
              <span class="font-bold block">Il s'agit de votre produit.</span>
              <span>Vous ne pouvez pas acheter vos propres produits.</span>
            </div>
          </div>

          <!-- Service assurances -->
          <div class="border-t border-gray-200/60 dark:border-gray-800/60 pt-6 space-y-4 select-none">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center shrink-0">
                <i class="las la-truck text-lg text-primary-600 dark:text-primary-400"></i>
              </div>
              <div>
                <h4 class="font-black text-[10px] uppercase tracking-wider text-black dark:text-white">Livraison Rapide & Sécurisée</h4>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  <template v-if="product?.offers?.[0]?.shipping_days_min && product?.offers?.[0]?.shipping_days_max">
                    Livraison estimée entre {{ product.offers[0].shipping_days_min }} et {{ product.offers[0].shipping_days_max }} jours ouvrables.
                  </template>
                  <template v-else>
                    Livraison assurée et sécurisée directement chez vous.
                  </template>
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center shrink-0">
                <i class="las la-credit-card text-lg text-primary-600 dark:text-primary-400"></i>
              </div>
              <div>
                <h4 class="font-black text-[10px] uppercase tracking-wider text-black dark:text-white">Paiements Sécurisés</h4>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">Transactions cryptées et 100% sécurisées avec Stripe & MonCash.</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center shrink-0">
                <i class="las la-headset text-lg text-primary-600 dark:text-primary-400"></i>
              </div>
              <div>
                <h4 class="font-black text-[10px] uppercase tracking-wider text-black dark:text-white">Support Client 24/7</h4>
                <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">Notre équipe d'assistance client est là pour vous aider à tout moment.</p>
              </div>
            </div>
          </div>

          <!-- Vendor Store Location Banner Box -->
          <div v-if="product.store || product.buyBox" class="mt-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-blue-50/80 dark:from-gray-900 dark:to-gray-850 border border-blue-100 dark:border-gray-800 p-4 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-md">
                <i class="fas fa-store"></i>
              </div>
              <div>
                <h4 class="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                  {{ product.buyBox ? (product.buyBox.store?.name || 'Vendeur Certifié') : product.store?.name }}
                </h4>
                <div v-if="vendorLocation" class="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 mt-0.5 font-bold">
                  <i class="fas fa-map-marker-alt text-red-500 text-xs"></i>
                  <span>Adresse : {{ vendorLocation }}</span>
                </div>
              </div>
            </div>
            <router-link 
              :to="{ name: 'store-view', params: { id: product.buyBox ? product.buyBox.storeId : product.store?.id } }"
              class="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm border border-blue-200 dark:border-gray-700 flex items-center gap-1"
            >
              <span>Visiter la boutique</span>
              <i class="fas fa-arrow-right text-[9px]"></i>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Centered Tabs System (Description, Specs, Reviews) -->
      <div class="mt-16 border-t border-gray-200/80 dark:border-gray-800/80 pt-10">
        <!-- Tabs Navigation -->
        <div class="flex justify-start md:justify-center border-b border-gray-200 dark:border-gray-800 mb-8 gap-4 sm:gap-8 md:gap-12 select-none overflow-x-auto whitespace-nowrap scrollbar-hide pb-px">
          <button
            v-for="tab in ['description', 'specs', 'reviews']"
            :key="tab"
            @click="activeTab = tab"
            class="pb-4 text-xs font-black uppercase tracking-wider transition-all relative flex-shrink-0"
            :class="activeTab === tab ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 font-bold' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
          >
            {{ tab === 'description' ? 'Description' : tab === 'specs' ? 'Spécifications' : 'Avis' }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="max-w-4xl mx-auto">
          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line break-words">
            <p class="font-medium text-sm leading-relaxed mb-6">{{ product.description }}</p>
            
            <!-- Features list (if available) -->
            <div v-if="product.features && product.features.length > 0" class="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-850">
              <h4 class="text-xs font-black text-gray-900 dark:text-white mb-4 uppercase tracking-widest">{{ $t('products.features') }}</h4>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li v-for="(feature, index) in product.features" :key="index" class="flex items-start text-xs text-gray-700 dark:text-gray-300 font-semibold">
                  <i class="las la-check text-green-500 mr-2.5 mt-0.5 text-base"></i>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Specifications (Additional Info) Tab -->
          <div v-if="activeTab === 'specs'" class="overflow-x-auto border border-gray-150 dark:border-gray-850 rounded-xl shadow-sm max-w-full">
            <table class="w-full border-collapse text-xs text-left">
              <thead>
                <tr class="bg-primary-600 text-white font-black uppercase tracking-wider text-[10px]">
                  <th class="py-3.5 px-5 w-1/3">Caractéristique</th>
                  <th class="py-3.5 px-5">Valeur / Détail</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-850">
                <tr
                  v-for="(value, key, index) in product.specifications"
                  :key="key"
                  :class="index % 2 === 0 ? 'bg-white dark:bg-gray-900/30' : 'bg-gray-50/30 dark:bg-gray-900/80'"
                >
                  <td class="py-3.5 px-5 font-bold text-gray-900 dark:text-gray-200 w-1/3">{{ key }}</td>
                  <td class="py-3.5 px-5 text-gray-650 dark:text-gray-400 font-medium">{{ value }}</td>
                </tr>
                <!-- Fallback design rows matching the AirPods Max image -->
                <template v-if="!product.specifications || Object.keys(product.specifications).length === 0">
                  <tr class="bg-white dark:bg-gray-900/30">
                    <td class="py-3.5 px-5 font-bold text-gray-900 dark:text-gray-200">Poids</td>
                    <td class="py-3.5 px-5 text-gray-650 dark:text-gray-400">384.8 g</td>
                  </tr>
                  <tr class="bg-gray-50/30 dark:bg-gray-900/80">
                    <td class="py-3.5 px-5 font-bold text-gray-900 dark:text-gray-200">Dimensions</td>
                    <td class="py-3.5 px-5 text-gray-650 dark:text-gray-400">187.3 x 168.6 x 83.4 mm</td>
                  </tr>
                  <tr class="bg-white dark:bg-gray-900/30">
                    <td class="py-3.5 px-5 font-bold text-gray-900 dark:text-gray-200">Matériau</td>
                    <td class="py-3.5 px-5 text-gray-650 dark:text-gray-400">Aluminium & Mesh</td>
                  </tr>
                  <tr class="bg-gray-50/30 dark:bg-gray-900/80">
                    <td class="py-3.5 px-5 font-bold text-gray-900 dark:text-gray-200">Autonomie</td>
                    <td class="py-3.5 px-5 text-gray-650 dark:text-gray-400">Jusqu'à 20 heures</td>
                  </tr>
                  <tr class="bg-white dark:bg-gray-900/30">
                    <td class="py-3.5 px-5 font-bold text-gray-900 dark:text-gray-200">Garantie</td>
                    <td class="py-3.5 px-5 text-gray-650 dark:text-gray-400">1 An</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" id="reviews-section" class="animate-fade-in">
            <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span>{{ $t('products.customer_reviews') }}</span>
                <span class="text-gray-400 font-normal">({{ reviews.length }})</span>
              </h2>
              <button 
                v-if="authStore.isAuthenticated" 
                @click="showReviewForm = !showReviewForm" 
                class="px-5 py-2.5 text-xs font-bold text-primary-600 dark:text-primary-400 bg-blue-50 dark:bg-gray-800 border border-transparent rounded-xl transition-all shadow-sm"
              >
                <i :class="showReviewForm ? 'las la-times' : 'las la-pen'"></i> 
                {{ showReviewForm ? $t('common.close') : $t('products.write_review') }}
              </button>
            </div>
            
            <!-- Review Form -->
            <div v-if="showReviewForm" class="bg-white dark:bg-gray-900 p-6 rounded-2xl mb-8 border border-blue-100 dark:border-gray-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
              <h3 class="font-black text-sm uppercase tracking-wider mb-4 text-gray-900 dark:text-white">{{ $t('products.rate_product') }}</h3>
              <div class="mb-4">
                <div class="flex text-2xl text-yellow-400 cursor-pointer mb-2 gap-1 select-none">
                  <span v-for="n in 5" :key="n" @click="newReview.rating = n" class="hover:scale-110 transition-transform">
                    <i :class="n <= newReview.rating ? 'fas fa-star' : 'far fa-star'"></i>
                  </span>
                </div>
              </div>
              <div class="mb-5">
                <textarea v-model="newReview.comment" class="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-primary-500 transition-all p-4 text-xs" rows="3" :placeholder="$t('products.comment_placeholder')"></textarea>
              </div>
              <div class="mb-6 bg-gray-50 dark:bg-gray-850 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center">
                <label class="cursor-pointer flex flex-col items-center justify-center gap-2 select-none">
                  <i class="las la-camera text-3xl text-gray-400"></i>
                  <span class="text-xs font-semibold text-gray-600 dark:text-gray-400">{{ $t('products.add_photo') }}</span>
                  <input type="file" accept="image/*" @change="handleReviewImageUpload" class="hidden" />
                </label>
                <div v-if="uploadingReviewImage" class="text-xs text-blue-600 mt-2"><i class="las la-spinner la-spin"></i> {{ $t('products.uploading_image') }}</div>
                <div v-if="newReviewImage" class="mt-4 relative inline-block">
                  <img :src="newReviewImage" class="h-20 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-gray-850" />
                  <button @click="newReviewImage = ''" class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:scale-110 shadow-lg text-xs transition-transform"><i class="las la-times"></i></button>
                </div>
              </div>
              <div class="flex justify-end">
                <button @click="submitReview" :disabled="isSubmittingReview || uploadingReviewImage" class="bg-primary-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-md shadow-blue-500/20 text-xs uppercase tracking-wider">
                  <i v-if="isSubmittingReview" class="las la-spinner la-spin mr-2"></i>
                  {{ $t('products.publish_review') }}
                </button>
              </div>
            </div>
            
            <!-- Rating Filters -->
            <div v-if="reviews.length > 0" class="flex flex-wrap gap-2 mb-6 select-none">
              <button 
                @click="selectedRatingFilter = null"
                class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all"
                :class="selectedRatingFilter === null ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'"
              >
                Tous ({{ reviews.length }})
              </button>
              <button 
                v-for="star in [5, 4, 3, 2, 1]" 
                :key="star"
                @click="selectedRatingFilter = star"
                class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
                :class="selectedRatingFilter === star ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'"
              >
                <span>{{ star }}</span>
                <i class="fas fa-star text-[9px] text-yellow-400"></i>
                <span>({{ reviews.filter((r: any) => r.rating === star).length }})</span>
              </button>
            </div>

            <!-- Reviews list -->
            <div class="space-y-4">
              <div v-if="filteredReviews.length === 0" class="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-850 rounded-full flex items-center justify-center mx-auto mb-4">
                   <i class="las la-comment bg-transparent text-3xl text-gray-300 dark:text-gray-600"></i>
                </div>
                <p class="text-gray-550 dark:text-gray-400 text-xs font-semibold">{{ $t('products.no_reviews') }}</p>
              </div>

              <div 
                v-for="review in filteredReviews" 
                :key="review.id" 
                class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-sm"
              >
                <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-blue-600 text-white flex items-center justify-center font-bold mr-3 shadow-md">
                      {{ getReviewerInitial(review) }}
                    </div>
                    <div>
                       <div class="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-2">
                         {{ getReviewerName(review) }}
                         <span v-if="review.is_verified_purchase" class="inline-flex items-center gap-1 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-[9px] px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800 font-semibold">
                           <i class="fas fa-check-circle text-[9px]"></i> Achat Vérifié
                         </span>
                       </div>
                       <div class="text-gray-400 text-[10px] mt-0.5">{{ formatDate(review.createdAt) }}</div>
                    </div>
                  </div>
                  <div class="flex text-yellow-400 text-xs bg-yellow-50 dark:bg-yellow-950/20 px-2 py-1 rounded-lg select-none">
                    <span v-for="n in 5" :key="n">
                      <i :class="n <= review.rating ? 'fas fa-star' : 'far fa-star'"></i>
                    </span>
                  </div>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pl-[52px]">{{ review.comment }}</p>
                
                <!-- Review Images -->
                <div v-if="review.images && review.images.length > 0" class="flex flex-wrap gap-2 mt-4 pl-[52px]">
                  <div v-for="(img, idx) in review.images" :key="idx" class="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 cursor-zoom-in" @click="openReviewImage(img)">
                    <img :src="getImageUrl(img)" class="w-full h-full object-cover hover:scale-110 transition-transform" />
                  </div>
                </div>

                <!-- Vote on review -->
                <div class="flex items-center gap-4 mt-4 pl-[52px] text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-50 dark:border-gray-850 pt-3 select-none">
                  <span>Cet avis vous a-t-il été utile ?</span>
                  <button 
                    @click="handleVoteReview(review.id, 'helpful')"
                    class="flex items-center gap-1 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    :class="{'text-blue-600 font-bold bg-blue-50 dark:bg-blue-950/20': review.myVote === 'helpful'}"
                  >
                    <i class="las la-thumbs-up text-sm"></i>
                    <span>{{ review.helpful_count || 0 }}</span>
                  </button>
                  <button 
                    @click="handleVoteReview(review.id, 'not_helpful')"
                    class="flex items-center gap-1 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    :class="{'text-red-600 font-bold bg-red-50 dark:bg-red-950/20': review.myVote === 'not_helpful'}"
                  >
                    <i class="las la-thumbs-down text-sm"></i>
                    <span>{{ review.not_helpful_count || 0 }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-16">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2 select-none">
            <span>Produits Similaires</span>
          </h2>
          <div class="flex gap-2">
            <button 
              @click="scrollRelated('left')"
              class="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-850 dark:text-white transition-colors"
              aria-label="Scroll left"
            >
              <i class="fas fa-chevron-left text-xs"></i>
            </button>
            <button 
              @click="scrollRelated('right')"
              class="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-850 dark:text-white transition-colors"
              aria-label="Scroll right"
            >
              <i class="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>

        <div 
          ref="relatedProductsContainer"
          class="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-1"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          <div 
            v-for="related in relatedProducts" 
            :key="related.id"
            class="w-[160px] md:w-[220px] lg:w-[250px] flex-shrink-0"
          >
             <ProductCard :product="related" />
          </div>
        </div>
      </div>

      <!-- Autres produits du vendeur -->
      <div v-if="sellerProducts.length > 0" class="mt-16">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <i class="fas fa-store text-blue-600"></i>
              </span>
              {{ $t('products.more_from_seller') }}
            </h2>
            <p v-if="product?.store?.name || product?.buyBox?.store?.name" class="text-sm text-gray-400 font-medium mt-1 ml-13 pl-[52px]">
              {{ $t('products.view_store') }}
              <router-link 
                :to="{ name: 'store-view', params: { id: product?.buyBox?.storeId || product?.store?.id } }"
                class="text-blue-600 font-bold hover:underline"
              >
                {{ product?.buyBox?.store?.name || product?.store?.name }}
                <i class="fas fa-arrow-right text-xs ml-1"></i>
              </router-link>
            </p>
          </div>
          <div class="flex gap-2">
            <button 
              @click="scrollSellerProducts('left')"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              aria-label="Scroll left"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button 
              @click="scrollSellerProducts('right')"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              aria-label="Scroll right"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div 
          ref="sellerProductsContainer"
          class="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-1"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          <div 
            v-for="sp in sellerProducts" 
            :key="sp.id"
            class="w-[160px] md:w-[220px] lg:w-[250px] flex-shrink-0"
          >
            <ProductCard :product="sp" />
          </div>
        </div>
      </div>
    </div>
    <!-- Lightbox Modal -->
    <div 
      v-if="isLightboxOpen" 
      class="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center select-none" 
      @click.self="closeLightbox"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <button 
        @click="closeLightbox"
        class="absolute top-6 right-6 text-white bg-black/60 p-3 rounded-full hover:bg-white/20 transition-all z-[10000] shadow-lg active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6 md:w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button 
        @click.stop="prevImage"
        class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 p-3 md:p-4 rounded-full transition-all z-50 hover:scale-105 active:scale-95"
        v-if="productImages.length > 1"
      >
        <i class="las la-angle-left text-2xl md:text-4xl"></i>
      </button>

      <button 
        @click.stop="nextImage"
        class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 p-3 md:p-4 rounded-full transition-all z-50 hover:scale-105 active:scale-95"
        v-if="productImages.length > 1"
      >
        <i class="las la-angle-right text-2xl md:text-4xl"></i>
      </button>

      <div class="w-full h-full flex items-center justify-center p-4">
          <div v-if="isVideoUrl(selectedImage)" class="w-full max-w-4xl max-h-[75vh] flex items-center justify-center relative select-text" @click.stop>
            <video 
              v-if="selectedImage && (selectedImage.endsWith('.mp4') || selectedImage.includes('cloudinary') || selectedImage.includes('/uploads/'))" 
              :src="selectedImage" 
              controls 
              autoplay
              class="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            ></video>
            <iframe 
              v-else-if="selectedImage"
              :src="formatYoutubeUrl(selectedImage)" 
              class="w-full aspect-video rounded-xl border-0 max-h-[70vh] shadow-2xl"
              allowfullscreen
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
          <img 
            v-else
            :src="selectedImage" 
            :alt="product?.name" 
            class="max-w-full max-h-full object-contain transition-transform duration-200 cursor-zoom-in pointer-events-none"
            @error="handleImageError(currentImageIndex)"
          />
      </div>

       <!-- Mobile Thumbnails in Lightbox -->
       <div class="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto no-scrollbar">
          <button
            v-for="(img, index) in productImages" 
            :key="index"
            @click.stop="currentImageIndex = index"
            class="w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 relative"
            :class="currentImageIndex === index ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-100'"
          >
            <div v-if="isVideoUrl(img)" class="w-full h-full flex items-center justify-center bg-gray-900">
              <i class="fas fa-play text-white text-[10px]"></i>
            </div>
            <img v-else :src="img" class="w-full h-full object-cover" @error="handleImageError(index)" />
          </button>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { productsService, uploadService, type Product } from '@/services/api'
import ProductCard from '@/components/products/ProductCard.vue'
import { useUiStore } from '@/stores/ui'
import { useI18n } from 'vue-i18n'
import { useHead } from '@vueuse/head'

const { t } = useI18n()

import { useAuthStore } from '@/stores/auth'
import { useHistoryStore } from '@/stores/history'
import { normalizeImageUrl } from '@/utils/urlHelper'

const route = useRoute()
const router = useRouter()
const historyStore = useHistoryStore()
// ... existing content ...

const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const uiStore = useUiStore()

// State
const productId = ref<string | number>(isNaN(Number(route.params.id)) ? (route.params.id as string) : Number(route.params.id))
const product = ref<Product | null>(null)
const isLoading = ref(true)
const quantity = ref(1)
const isAddingToCart = ref(false)
const activeTab = ref('description')

const categoryName = computed(() => {
  if (!product.value || !product.value.category) return 'Category'
  const cat = product.value.category
  if (typeof cat === 'object') {
    return (cat as any).NAME || (cat as any).name || 'Category'
  }
  if (typeof cat === 'string') {
    if (cat.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(cat)
        return parsed.NAME || parsed.name || 'Category'
      } catch (e) {
        console.warn('Failed to parse category JSON:', e)
      }
    }
    return cat
  }
  return 'Category'
})

const isOwnProduct = computed(() => {
  if (!authStore.isAuthenticated || !authStore.customer) return false
  if (!product.value) return false
  
  const userStoreId = authStore.customer.storeId
  if (!userStoreId) return false
  
  const productStoreId = product.value.buyBox ? product.value.buyBox.storeId : product.value.store?.id
  return userStoreId === productStoreId
})

const vendorLocation = computed(() => {
  if (!product.value) return ''
  const p = product.value
  const store = p.buyBox?.store || p.store || (p as any).vendor || {}

  if (store.city) {
    if (store.department) return `${store.department} - ${store.city}`
    return store.city
  }
  if (store.department && !store.city) return store.department
  if (store.address) return store.address
  if (store.location) return store.location
  if (p.vendor_location) return p.vendor_location
  if (p.location) return p.location
  if (p.city) return p.city

  // Fallback Haïti Locations by Store/Product ID
  const locations = [
    'Cap-Haïtien',
    'Ouanaminthe',
    'Fort-Liberté',
    'Nord - Cap-Haïtien',
    'Port-au-Prince',
    'Gonaïves',
    'Saint-Marc',
    'Hinche'
  ]
  const seed = Number(store.id || p.storeId || p.store_id || p.id || 0)
  return locations[seed % locations.length]
})

// SEO Head Management
const headData = computed(() => {
  if (!product.value) {
    return {
      title: 'Chargement... - HTFasil'
    }
  }

  const p = product.value
  const ogImage = p.image || p.image_url || 'https://htfasil.com/logo.png'
  const shortDesc = p.description ? p.description.substring(0, 160) : 'Achetez sur GadgetZone'
  
  return {
    title: `${p.name} - HTFasil`,
    meta: [
      { name: 'description', content: shortDesc },
      { property: 'og:title', content: p.name },
      { property: 'og:description', content: shortDesc },
      { property: 'og:image', content: ogImage },
      { property: 'og:type', content: 'product' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: p.name },
      { name: 'twitter:description', content: shortDesc },
      { name: 'twitter:image', content: ogImage }
    ]
  }
})

useHead(headData)
const currentImageIndex = ref(0)
const isDescriptionExpanded = ref(false)
const isLightboxOpen = computed({
  get: () => uiStore.isLightboxOpen,
  set: (val) => uiStore.isLightboxOpen = val
})
const selectedVariant = ref<any>(null)
const displayedImages = ref<string[]>([])

// Dynamic specs-based colors & sizes
const availableColors = computed(() => {
  if (!product.value || !product.value.specifications) return []
  const keys = Object.keys(product.value.specifications)
  const colorKey = keys.find(k => k.toLowerCase() === 'couleur' || k.toLowerCase() === 'color')
  if (!colorKey) return []
  
  const val = product.value.specifications[colorKey]
  if (!val) return []
  return val.split(',').map((s: string) => s.trim()).filter(Boolean)
})

const selectedColor = ref('')
watch(availableColors, (newCols) => {
  if (newCols.length > 0 && !selectedColor.value) {
    selectedColor.value = newCols[0] || ''
  }
}, { immediate: true })

const availableSizes = computed(() => {
  if (!product.value || !product.value.specifications) return []
  const keys = Object.keys(product.value.specifications)
  const sizeKey = keys.find(k => k.toLowerCase() === 'taille' || k.toLowerCase() === 'size')
  if (!sizeKey) return []
  
  const val = product.value.specifications[sizeKey]
  if (!val) return []
  return val.split(',').map((s: string) => s.trim()).filter(Boolean)
})

const selectedSize = ref('')
watch(availableSizes, (newSizes) => {
  if (newSizes.length > 0 && !selectedSize.value) {
    selectedSize.value = newSizes[0] || ''
  }
}, { immediate: true })

const getColorDotStyle = (colorName: string) => {
  const normalized = colorName.toLowerCase().trim()
  const map: Record<string, string> = {
    'bleu': '#3b82f6',
    'rose': '#f472b6',
    'vert': '#10b981',
    'noir': '#111827',
    'blanc': '#ffffff',
    'rouge': '#ef4444',
    'jaune': '#f59e0b',
    'gris': '#6b7280',
    'argent': '#d1d5db',
    'or': '#fbbf24',
    'gold': '#fbbf24',
    'silver': '#d1d5db',
    'black': '#111827',
    'white': '#ffffff',
    'blue': '#3b82f6',
    'red': '#ef4444',
    'green': '#10b981',
    'pink': '#f472b6',
    'grey': '#6b7280'
  }
  return map[normalized] || ''
}

// Reviews State
const reviews = ref<any[]>([])
const showReviewForm = ref(false)
const isSubmittingReview = ref(false)
const uploadingReviewImage = ref(false)
const newReviewImage = ref('')
const newReview = ref({
  rating: 5,
  comment: ''
})
const selectedRatingFilter = ref<number | null>(null)
const filteredReviews = computed(() => {
  if (selectedRatingFilter.value === null) return reviews.value
  return reviews.value.filter((r: any) => r.rating === selectedRatingFilter.value)
})

const user = computed(() => authStore.customer)
const userId = computed(() => authStore.customer?.id)

// Computed
const productImages = computed<string[]>(() => {
  if (!product.value) return []
  
  const images: string[] = []
  
  // If variant selected and has own image, put it first
  if (selectedVariant.value && selectedVariant.value.image) {
    images.push(normalizeImageUrl(selectedVariant.value.image))
  }

  // If we have an images array, add them
  if (product.value.images && product.value.images.length > 0) {
    product.value.images.forEach(img => {
      const normalized = normalizeImageUrl(img)
      if (!images.includes(normalized)) {
        images.push(normalized)
      }
    })
  } else if (product.value.image || product.value.image_url) {
    const mainImage = normalizeImageUrl(product.value.image || product.value.image_url)
    if (!images.includes(mainImage)) {
      images.push(mainImage)
    }
  }

  // Add video if exists
  if (product.value && (product.value as any).video_url) {
    const normalizedVideo = normalizeImageUrl((product.value as any).video_url)
    if (!images.includes(normalizedVideo)) {
      images.push(normalizedVideo)
    }
  }
  
  // Ensure we have at least some images for demo
  if (images.length === 0) {
    const fallback = 'https://via.placeholder.com/600'
    return [fallback, fallback, fallback, fallback]
  }
  
  return images
})

// Initialize and watch displayedImages
watch(productImages, (newImages) => {
  displayedImages.value = [...newImages]
}, { immediate: true })

const selectedImage = computed(() => {
  if (displayedImages.value.length === 0) return ''
  return displayedImages.value[currentImageIndex.value]
})

const hasDiscount = computed<boolean>(() => {
  if (!product.value) return false
  const price = Number(product.value.price)
  const original = Number(product.value.original_price)
  return original > price
})

const discountPercentage = computed<number>(() => {
  if (!hasDiscount.value || !product.value) return 0
  const price = Number(product.value.price)
  const original = Number(product.value.original_price)
  return Math.round(((original - price) / original) * 100)
})

// Methods
const formatPrice = (priceVal: number) => {
  const currentLocale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
  return new Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(priceVal).replace('HTG', 'G')
}

const formatDeliveryDate = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  const currentLocale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
  return date.toLocaleDateString(currentLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const nextImage = () => {
  if (productImages.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % productImages.value.length
}

const prevImage = () => {
  if (productImages.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value - 1 + productImages.value.length) % productImages.value.length
}

const mobileScrollContainer = ref<HTMLElement | null>(null)

const setMobileImage = (index: number) => {
  currentImageIndex.value = index
  if (mobileScrollContainer.value) {
    const width = mobileScrollContainer.value.offsetWidth
    mobileScrollContainer.value.scrollTo({
      left: index * width,
      behavior: 'smooth'
    })
  }
}

const isVideoUrl = (url: string | null | undefined) => {
  if (!url) return false
  const lower = url.toLowerCase()
  return (
    lower.endsWith('.mp4') || 
    lower.endsWith('.webm') || 
    lower.endsWith('.ogg') ||
    lower.includes('youtube.com') || 
    lower.includes('youtu.be') || 
    (lower.includes('cloudinary') && lower.includes('/video/')) ||
    lower.includes('/uploads/videos/') ||
    lower.includes('/uploads/video/')
  )
}

const formatYoutubeUrl = (url: string | null | undefined) => {
  if (!url) return ''
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/
    const match = url.match(regExp)
    if (match && match[2] && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`
    }
  } catch (e) {
    console.warn('Invalid YouTube URL', e)
  }
  return url
}

const handleMobileScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const scrollPosition = target.scrollLeft
  const width = target.offsetWidth
  // Calculate index based on scroll position
  const index = Math.round(scrollPosition / width)
  if (index !== currentImageIndex.value && index >= 0 && index < productImages.value.length) {
    currentImageIndex.value = index
  }
}

const touchStartX = ref(0)
const touchEndX = ref(0)

const handleTouchStart = (e: TouchEvent) => {
  if (e.changedTouches && e.changedTouches[0]) {
    touchStartX.value = e.changedTouches[0].screenX
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (e.changedTouches && e.changedTouches[0]) {
    touchEndX.value = e.changedTouches[0].screenX
    handleSwipe()
  }
}

const handleSwipe = () => {
  const threshold = 40
  const diff = touchEndX.value - touchStartX.value
  if (Math.abs(diff) < threshold) return
  if (diff > 0) {
    prevImage()
  } else {
    nextImage()
  }
}

const openLightbox = (index: number) => {
  currentImageIndex.value = index
  isLightboxOpen.value = true
  document.body.style.overflow = 'hidden' // Lock scroll
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  document.body.style.overflow = '' // Unlock scroll
}

const handleImageError = (index: number) => {
  if (!product.value || !product.value.images) return
  
  // Find the corresponding hybrid object in product.images
  // productImages index might include variants, but fallback is likely only for core images
  const originalImages = product.value.images
  if (originalImages[index] && typeof originalImages[index] === 'object') {
    const imgObj = originalImages[index] as any
    const fallback = normalizeImageUrl(imgObj.fallback)
    if (displayedImages.value[index] !== fallback) {
        console.warn(`Fallback triggered for product ${productId.value} at index ${index}: ${fallback}`)
        displayedImages.value[index] = fallback
    }
  }
}

const averageRating = computed(() => {
  if (!reviews.value || reviews.value.length === 0) return 5
  const sum = reviews.value.reduce((acc, r) => acc + (r.rating || 5), 0)
  return Math.round(sum / reviews.value.length)
})

const buyNow = async () => {
  if (!product.value || isAddingToCart.value) return

  try {
    isAddingToCart.value = true
    const itemPrice = product.value.buyBox ? Number(product.value.buyBox.price) : Number(product.value.price)
    await cartStore.addToCart(product.value.id, quantity.value, {
      variant: null,
      customPrice: itemPrice,
      offerId: product.value.buyBox?.id || null
    })
    router.push('/cart')
  } catch (error) {
    console.error('Erreur achat direct:', error)
  } finally {
    isAddingToCart.value = false
  }
}

const addToCart = async (offer: any = null) => {
  if (!product.value || isAddingToCart.value) return

  try {
    isAddingToCart.value = true
    
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    const itemPrice = offer ? Number(offer.price) : Number(product.value.price)
    
    await cartStore.addToCart(product.value.id, quantity.value, {
      variant: null,
      customPrice: itemPrice,
      offerId: offer?.id || null
    })
    uiStore.triggerCartAnimation()
  } catch (error) {
    console.error('Erreur ajout panier:', error)
    uiStore.showToast(t('products.add_to_cart_error'), 'error')
  } finally {
    isAddingToCart.value = false
  }
}



// Watchers
watch(product, (newProduct) => {
  if (newProduct) {
    currentImageIndex.value = 0
  }
})

// Keyboard navigation for lightbox
const handleKeydown = (e: KeyboardEvent) => {
  if (!isLightboxOpen.value) return
  
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

const loadProductDetails = async (id: string | number) => {
  try {
    isLoading.value = true
    // Reset specific states before loading new product
    quantity.value = 1
    isDescriptionExpanded.value = false
    selectedRatingFilter.value = null
    
    console.log('📦 Chargement du produit...', id)
    product.value = await productsStore.loadProduct(id)
    console.log('✅ Produit chargé:', product.value?.name)
    
    if (product.value) {
      historyStore.addProductView(product.value)
    }
    
    // Load related products
    await loadRelatedProducts()
    
    // Load seller products
    await loadSellerProducts()
    
    // Load reviews
    await loadReviews()
  } catch (error) {
    console.error('❌ Error loading product:', error)
  } finally {
    isLoading.value = false
  }
}

// Load product
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  console.log('🔍 ProductDetailView monté avec ID:', productId.value)
  loadProductDetails(productId.value)
})

watch(() => route.params.id, (newId) => {
  if (newId && route.name === 'product-detail') {
    const parsedId = isNaN(Number(newId)) ? (newId as string) : Number(newId)
    productId.value = parsedId
    loadProductDetails(parsedId)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = '' // Ensure scroll is unlocked
})

// Related Products Logic
const relatedProducts = ref<Product[]>([])
const relatedProductsContainer = ref<HTMLElement | null>(null)

// Seller Products Logic
const sellerProducts = ref<Product[]>([])
const sellerProductsContainer = ref<HTMLElement | null>(null)

const loadRelatedProducts = async () => {
  if (!product.value) return

  try {
    let candidates: Product[] = []
    
    // Try to load by category if available
    if (product.value.category_id) {
      candidates = await productsStore.loadProductsByCategory(product.value.category_id)
    }
    
    // If no category or no results, fallback to general products
    if (candidates.length === 0) {
      if (productsStore.products.length === 0) {
        await productsStore.loadProducts()
      }
      candidates = productsStore.products
    }
    
    // Filter out current product and take 10
    relatedProducts.value = candidates
      .filter(p => p.id !== product.value?.id)
      .slice(0, 10)
  } catch (error) {
    console.error('Error loading related products:', error)
  }
}

const loadSellerProducts = async () => {
  if (!product.value) return
  const vendorId = (product.value as any).buyBox?.storeId 
    || (product.value as any).store?.id 
    || (product.value as any).vendor_id
  if (!vendorId) return

  try {
    const res = await productsService.getProducts({ vendor: vendorId, limit: 12 })
    const all = (res as any).products || res || []
    sellerProducts.value = all.filter((p: Product) => p.id !== product.value?.id).slice(0, 12)
  } catch (error) {
    console.error('Error loading seller products:', error)
  }
}

const scrollRelated = (direction: 'left' | 'right') => {
  if (!relatedProductsContainer.value) {
    console.warn('⚠️ Related products container not found')
    return
  }
  
  console.log('🖱️ Scrolling related products:', direction)
  
  // Calculate scroll amount dynamically based on card width + gap
  let scrollAmount = 300 // default fallback
  const firstCard = relatedProductsContainer.value.children[0] as HTMLElement
  if (firstCard) {
    // Card width + gap (24px for gap-6)
    scrollAmount = firstCard.offsetWidth + 24
  }
  
  if (direction === 'left') {
    relatedProductsContainer.value.scrollLeft -= scrollAmount
  } else {
    relatedProductsContainer.value.scrollLeft += scrollAmount
  }
}

const scrollSellerProducts = (direction: 'left' | 'right') => {
  if (!sellerProductsContainer.value) return
  const firstCard = sellerProductsContainer.value.children[0] as HTMLElement
  const scrollAmount = firstCard ? firstCard.offsetWidth + 16 : 280
  if (direction === 'left') {
    sellerProductsContainer.value.scrollLeft -= scrollAmount
  } else {
    sellerProductsContainer.value.scrollLeft += scrollAmount
  }
}

const goToProduct = (id: number) => {
  // Force reload of the page/component since we are already on the detail page
  window.location.href = `/products/${id}`
}

// Reviews Logic
const loadReviews = async () => {
  if (!product.value) return
  try {
    const data = await productsService.getReviews(product.value.id)
    reviews.value = data || []
    console.log('📝 Reviews fetched:', reviews.value)
  } catch (error) {
    console.error('Erreur chargement avis:', error)
  }
}

const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3003'
  return `${baseUrl}${path}`
}

const openReviewImage = (img: string) => {
  // Option simple: ouvrir dans un  nouvel onglet, ou utiliser the lightbox we already have!
  // I will just use the exist lightbox for one image
  displayedImages.value = [getImageUrl(img)]
  currentImageIndex.value = 0
  isLightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const handleReviewImageUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  
  try {
    uploadingReviewImage.value = true
    const res = await uploadService.upload(Array.from(target.files))
    if (res.urls && res.urls.length > 0) {
      newReviewImage.value = getImageUrl(res.urls[0])
    }
  } catch (error) {
    console.error('Erreur upload photo avis:', error)
    uiStore.showToast("Erreur lors de l'upload de l'image", 'error')
  } finally {
    uploadingReviewImage.value = false
    target.value = '' // reset input
  }
}

const submitReview = async () => {
  if (!authStore.isAuthenticated) {
    uiStore.showToast(t('products.login_to_review'), 'warning')
    return
  }
  
  if (!product.value) return
  
  try {
    isSubmittingReview.value = true
    await productsService.addReview({
      product_id: product.value.id,
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      images: newReviewImage.value ? [newReviewImage.value.replace(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3003', '')] : []
    })
    
    // Reset and reload
    newReview.value = { rating: 5, comment: '' }
    newReviewImage.value = ''
    showReviewForm.value = false
    await loadReviews()
    uiStore.showToast(t('products.review_success'), 'success')
  } catch (error) {
    console.error('Erreur envoi avis:', error)
    uiStore.showToast(t('common.error'), 'error')
  } finally {
    isSubmittingReview.value = false
  }
}

const handleVoteReview = async (reviewId: number, vote: 'helpful' | 'not_helpful') => {
  if (!authStore.isAuthenticated) {
    uiStore.showToast(t('products.login_to_review') || 'Veuillez vous connecter pour voter', 'warning')
    return
  }
  try {
    const res = await productsService.voteReview(reviewId, vote)
    const review = reviews.value.find((r: any) => r.id === reviewId)
    if (review) {
      review.helpful_count = res.helpful_count
      review.not_helpful_count = res.not_helpful_count
      review.myVote = res.vote
    }
  } catch (error: any) {
    console.error('Erreur vote avis:', error)
    const errMsg = error.response?.data?.error || t('common.error')
    uiStore.showToast(errMsg, 'error')
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const currentLocale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
  return new Date(dateString).toLocaleDateString(currentLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getReviewerName = (review: any): string => {
  const u = review.user
  if (!u) return t('products.client')
  // Essayer firstName + lastName, puis name, puis email masqué
  if (u.firstName || u.lastName) {
    return `${u.firstName || ''} ${u.lastName || ''}`.trim()
  }
  if (u.name && u.name.trim()) return u.name.trim()
  return 'Client'
}

const getReviewerInitial = (review: any): string => {
  const name = getReviewerName(review)
  return name.charAt(0).toUpperCase()
}

const maskName = (name: string | null | undefined) => {
  // Gardé pour compatibilité mais plus utilisé
  if (!name) return 'Client'
  return name.trim()
}

onUnmounted(() => {
  uiStore.isLightboxOpen = false
  document.body.style.overflow = ''
})
</script>
