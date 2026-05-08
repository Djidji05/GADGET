<template>
<div 
    :class="{ 
      'relative z-[100] w-full': isMobile,
      'relative z-[100]': !isMobile
    }"
  >
    <!-- Image Search Input (Hidden) - Global -->
    <input
      type="file"
      ref="imageInput"
      accept="image/*"
      class="hidden"
      @change="handleImageSearch"
    />

    <!-- MOBILE HEADER -->
    <div 
      v-if="isMobile" 
      class="mobile-header transition-all duration-300"
      :class="{
        'w-full z-[90] bg-white shadow-sm': isProductPage,
        'bg-white shadow-sm': !isProductPage && !props.transparent,
        'bg-transparent': !isProductPage && props.transparent
      }"
    >
      <!-- Unauth Banner Removed -->

      <!-- Product Page View -->
      <template v-if="isProductPage || route.meta.hideNavSearch">
        <div class="fixed top-0 left-0 w-full z-[110] flex items-center gap-3 py-2 px-3 bg-white shadow-sm border-b border-gray-50 h-[56px]">
          <!-- Back Button -->
          <button 
            @click="handleBack" 
            class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-colors"
          >
            <i class="fas fa-arrow-left text-gray-700"></i>
          </button>
          
          <!-- Page Title when search is hidden -->
          <div v-if="route.meta.hideNavSearch" class="flex-1 font-bold text-gray-900 truncate">
            {{ (route.meta.title as string)?.split(' - ')[0] }}
          </div>

          <!-- Search Bar (only if not hidden by meta) -->
          <div v-else class="flex-1 relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="search"
              :placeholder="$t('products.search')"
              class="w-full bg-gray-100 border-none rounded-full pl-4 pr-16 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
            <button 
              @click="triggerImageSearch"
              class="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 p-1"
            >
               <i :class="isImageSearching ? 'fas fa-spinner fa-spin' : 'fas fa-camera'"></i>
            </button>
            <button @click="handleSearch" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
               <i class="fas fa-search"></i>
            </button>
          </div>
        </div>



        <div v-if="!route.meta.hideNavSearch" class="pt-[56px]">
          <!-- Spacer to maintain layout when categories and filters are fixed -->
          <div v-if="isProductListingPage" class="h-[120px]"></div>

          <!-- Mobile Categories & Filters Container with Smart Sticky Animation -->
          <div 
            class="fixed top-[56px] left-0 w-full z-[95] bg-white transition-all duration-500 transform ease-in-out border-b border-gray-50 shadow-sm"
            :class="[
              isScrollingUp ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none invisible'
            ]"
          >
            <MobileCategories />

            <!-- Thin Separator -->
            <div class="border-t border-gray-50 mx-4 mb-2"></div>

            <!-- Filter Chips Row -->
            <div v-if="isProductListingPage" class="flex overflow-x-auto px-3 pb-3 gap-2 no-scrollbar">
              <!-- Main Filter Button -->
              <button 
                @click="openFilterDrawer('all')"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-200"
              >
                <i class="fas fa-sliders-h"></i>
                {{ $t('products.filter') || 'Filtrer' }}
              </button>
              
              <!-- Brand -->
              <button 
                @click="openFilterDrawer('brand')"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50"
              >
                {{ $t('products.brand') || 'Marque' }}
                <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
              </button>
              
              <!-- Price -->
              <button 
                @click="openFilterDrawer('price')"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50"
              >
                {{ $t('products.price') || 'Prix' }}
                <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
              </button>

               <!-- Category -->
              <button 
                @click="openFilterDrawer('category')"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50"
              >
                {{ $t('products.category') || 'Catégorie' }}
                <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
              </button>
              
              <!-- Sort -->
              <button 
                @click="openFilterDrawer('sort')"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 whitespace-nowrap active:bg-gray-50"
              >
                {{ $t('products.sort') || 'Trier' }}
                <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Authenticated View -->
      <template v-else-if="authStore.isAuthenticated && authStore.customer">
        <!-- Line 1: Avatar, Greeting, Cart -->
        <div class="mobile-top-bar">
          <div class="flex flex-col ml-0">
            <span class="text-[10px] text-gray-500 font-medium">{{ authStore.isFirstLogin ? 'Bienvenue sur HTFasil' : 'Bon retour sur HTFasil' }}</span>
            <span class="font-bold text-gray-900 text-sm leading-tight max-w-[150px] truncate">
              {{ authStore.customer.firstName || authStore.customer.email }}
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <router-link 
              v-if="authStore.isAuthenticated"
              to="/notifications" 
              class="text-gray-700 hover:text-blue-600 transition-colors relative p-1"
            >
              <i class="fas fa-bell text-xl"></i>
              <span v-if="notificationsStore.unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">{{ notificationsStore.unreadCount }}</span>
            </router-link>

            <router-link to="/wishlist" class="text-gray-700 hover:text-red-600 transition-colors relative p-1">
              <i class="fas fa-heart text-xl"></i>
              <span v-if="wishlistStore.itemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">{{ wishlistStore.itemCount }}</span>
            </router-link>
          </div>
        </div>

        <!-- Sticky Search & Categories Container -->
        <div 
          v-if="!isProductPage && !route.meta.hideNavSearch" 
          :class="{
            'fixed top-0 left-0 w-full z-[100] bg-white shadow-md pt-2': isHeaderFixed,
            'relative bg-white shadow-sm pb-1': !isHeaderFixed
          }"
        >
          <!-- Line 2: Search + Settings -->
          <div class="mobile-search-bar">
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="search"
                :placeholder="$t('products.search')"
                class="mobile-search-input w-full pr-10"
              />
              <button 
                @click="triggerImageSearch"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
              >
                <i :class="isImageSearching ? 'fas fa-spinner fa-spin' : 'fas fa-camera'"></i>
              </button>
            </div>
            <Transition name="fade">
              <button v-if="!isMobileMenuOpen" @click="isMobileMenuOpen = true" class="p-2 text-gray-600 hover:text-primary-600">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H21L19 9H2L4 6Z"/>
                    <path d="M4 12H16L14 15H2L4 12Z"/>
                    <path d="M4 18H21L19 21H2L4 18Z"/>
                </svg>
              </button>
            </Transition>
          </div>

          <!-- Categories inside sticky -->
          <MobileCategories v-if="shouldShowMobileCategories" />
        </div>

        <!-- Placeholder to prevent jump when header becomes fixed -->
        <div v-if="!isProductPage && !route.meta.hideNavSearch && isHeaderFixed" style="height: 110px;"></div>
      </template>

      <!-- Guest View -->
      <template v-else>
        <!-- Top bar mobile -->
        <div class="mobile-top-bar">
          <router-link to="/" class="flex items-center gap-2">
            <img src="/images/logo.png" alt="HTFasil" class="h-8 w-auto" />
          </router-link>
          
          <div class="flex items-center gap-2">
            <router-link 
              v-if="authStore.isAuthenticated"
              to="/notifications" 
              class="text-gray-700 hover:text-blue-600 transition-colors relative p-1"
            >
              <i class="fas fa-bell text-xl"></i>
              <span v-if="notificationsStore.unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">{{ notificationsStore.unreadCount }}</span>
            </router-link>

            <router-link to="/wishlist" class="text-gray-700 hover:text-red-600 transition-colors relative p-1">
              <i class="fas fa-heart text-xl"></i>
              <span v-if="wishlistStore.itemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none">{{ wishlistStore.itemCount }}</span>
            </router-link>
          </div>
        </div>

        <!-- Sticky Search & Categories Container (Guest) -->
        <div 
          v-if="!isProductPage && !route.meta.hideNavSearch" 
          :class="{
            'fixed top-0 left-0 w-full z-[100] bg-white shadow-md pt-2': isHeaderFixed,
            'relative bg-white shadow-sm pb-1': !isHeaderFixed
          }"
        >
          <!-- Search bar mobile -->
          <div class="mobile-search-bar border-b border-gray-100">
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="search"
                :placeholder="$t('products.search')"
                class="mobile-search-input w-full pr-10"
              />
              <button 
                @click="triggerImageSearch"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
              >
                <i :class="isImageSearching ? 'fas fa-spinner fa-spin' : 'fas fa-camera'"></i>
              </button>
            </div>
            <Transition name="fade">
              <button v-if="!isMobileMenuOpen" @click="isMobileMenuOpen = true" class="p-2 text-gray-600 hover:text-primary-600">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H21L19 9H2L4 6Z"/>
                    <path d="M4 12H16L14 15H2L4 12Z"/>
                    <path d="M4 18H21L19 21H2L4 18Z"/>
                </svg>
              </button>
            </Transition>
          </div>

          <!-- Categories inside sticky -->
          <MobileCategories v-if="shouldShowMobileCategories" />
        </div>
        
        <!-- Placeholder to prevent jump when header becomes fixed -->
        <div v-if="!isProductPage && !route.meta.hideNavSearch && isHeaderFixed" style="height: 110px;"></div>
      </template>
    </div>

    <!-- CATEGORIES (Mobile) REMOVED - Moved inside sticky wrapper above -->

    <!-- DESKTOP HEADER -->
    <div v-else-if="!isMobile">
    <!-- Top Bar -->
    <div
      class="bg-gray-100 text-gray-700 text-xs border-b border-gray-300 transition-all duration-300 ease-in-out"
      :class="{
        'transform -translate-y-full opacity-0': !props.transparent,
        'transform translate-y-0 opacity-100': props.transparent,
      }"
    >
      <div class="container mx-auto px-4 flex items-center justify-between">
        <!-- Left side -->
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-1">
            <i class="fas fa-map-marker-alt text-xs"></i>
            <span class="text-xs">{{ $t('nav.delivery') }}</span>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-3">
          <router-link to="/contact" class="hover:underline cursor-pointer text-xs">{{ $t('nav.help') }}</router-link>
          <router-link to="/promotions" class="hover:underline cursor-pointer text-xs">{{ $t('nav.offers') }}</router-link>
          <router-link v-if="!isSeller" to="/become-seller" class="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1">
            <i class="fas fa-store text-xs"></i>
            <span>{{ $t('nav.sell') }}</span>
          </router-link>
          <router-link v-else to="/seller/dashboard" class="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1">
            <i class="fas fa-store text-xs"></i>
            <span>{{ $t('nav.seller_dashboard') }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Bar -->
    <div
      class="bg-white border-b border-gray-200 py-2 transition-all duration-300 ease-in-out relative z-50"
      :class="{
        'transform -translate-y-full opacity-0': !props.transparent,
        'transform translate-y-0 opacity-100': props.transparent,
      }"
    >
      <div class="container mx-auto px-4 flex items-center">
        <!-- Logo -->
        <div class="flex items-center mr-6">
          <router-link to="/" class="flex items-center">
            <img src="/images/logo.png" alt="HTFasil Logo" class="h-6 w-auto" />
          </router-link>
        </div>

        <!-- Search Section -->
        <div class="flex-1 flex items-center max-w-4xl">
          <div class="relative flex-1">
            <!-- Search Input -->
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              :placeholder="$t('products.search')"
              class="w-full border border-gray-300 pl-4 pr-24 py-2 text-sm focus:outline-none focus:border-blue-400 rounded-full"
            />


             <!-- Camera Button -->
            <button
              @click="triggerImageSearch"
              class="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors p-2"
              title="Recherche par image"
            >
               <i :class="isImageSearching ? 'fas fa-spinner fa-spin' : 'fas fa-camera'"></i>
            </button>

            <!-- Search Button -->
            <button
              @click="handleSearch"
              class="absolute right-0 top-0 bottom-0 bg-blue-400 hover:bg-blue-500 text-white px-6 rounded-r-full transition-colors"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Language Selector -->
        <div class="flex items-center ml-4 relative">
          <button 
            @click="showLanguageMenu = !showLanguageMenu"
            class="flex items-center gap-1.5 border border-gray-300 rounded-full px-2.5 py-1 text-xs cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all bg-white shadow-sm"
          >
            <img :src="currentLanguage.flag" :alt="currentLanguage.name" class="w-4 h-4 rounded-full object-cover" />
            <span class="font-bold text-gray-700">{{ currentLanguage.name }}</span>
            <i class="fas fa-chevron-down text-[10px] text-gray-400"></i>
          </button>

          <Transition name="dropdown">
            <div 
              v-if="showLanguageMenu"
              class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl py-2 min-w-[120px] z-[100]"
              @mouseleave="showLanguageMenu = false"
            >
              <button 
                v-for="lang in languages" 
                :key="lang.code"
                @click="changeLanguage(lang.code)"
                class="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition-colors text-left"
                :class="{ 'bg-blue-50/50': currentLocale === lang.code }"
              >
                <img :src="lang.flag" :alt="lang.name" class="w-5 h-5 rounded-full object-cover border border-gray-100" />
                <span class="text-xs font-semibold" :class="currentLocale === lang.code ? 'text-blue-600' : 'text-gray-700'">
                  {{ lang.code === 'ht' ? 'Kreyòl Ayisyen' : 'Français' }}
                </span>
                <i v-if="currentLocale === lang.code" class="fas fa-check text-blue-500 text-[10px] ml-auto"></i>
              </button>
            </div>
          </Transition>
        </div>

        <!-- Right Icons -->
        <div class="flex items-center ml-6 space-x-4">
          <!-- Account -->
          <div 
            class="relative z-50"
            @mouseenter="showAccountMenu = true"
            @mouseleave="showAccountMenu = false"
          >
            <div
              class="flex flex-col cursor-pointer hover:text-blue-600 transition-colors"
            >
              <span class="text-xs">
                {{
                  authStore.isAuthenticated && authStore.customer
                    ? `${$t('common.hello')}, ${authStore.customer.firstName || authStore.customer.email}`
                    : $t('common.hello')
                }}
              </span>
              <div class="flex items-center">
                <span class="text-sm font-semibold">
                  {{ $t('nav.account') }}
                </span>
                <i class="fas fa-chevron-down text-xs ml-1"></i>
              </div>
            </div>

            <!-- Account Dropdown Menu - Dans le container Account avec z-index élevé -->
            <div
              v-if="showAccountMenu"
              class="absolute top-full right-0 mt-0 w-64 bg-white border border-gray-300 rounded-lg shadow-xl p-4"
              style="z-index: 99999999"
              @click.stop
            >
              <div class="border-b border-gray-200 pb-3 mb-3">
                <div class="text-sm font-semibold mb-1">{{ $t('nav.your_account') }}</div>
                <a 
                  v-if="['admin', 'gestionnaire'].includes(authStore.customer?.role || '')"
                  href="http://localhost:5174" 
                  target="_blank"
                  class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-gray-700 font-semibold text-blue-600"
                >
                  <i class="fas fa-user-shield mr-2"></i>{{ $t('nav.admin') }}
                </a>
                <router-link to="/account" class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-gray-700">
                  <i class="fas fa-user mr-2"></i>{{ $t('nav.your_account') }}
                </router-link>
              </div>

              <div class="space-y-1">
                <router-link to="/orders" class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-gray-700">
                  <i class="fas fa-box mr-2"></i>{{ $t('nav.your_orders') }}
                </router-link>
                <router-link to="/wishlist" class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-gray-700">
                  <i class="fas fa-heart mr-2"></i>{{ $t('nav.your_wishlist') }}
                </router-link>
                <router-link to="/notifications" class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-gray-700 flex items-center justify-between">
                  <span><i class="fas fa-bell mr-2"></i>{{ $t('nav.your_notifications') }}</span>
                  <span v-if="notificationsStore.unreadCount > 0" class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {{ notificationsStore.unreadCount }}
                  </span>
                </router-link>
                <router-link to="/addresses" class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-gray-700">
                  <i class="fas fa-cog mr-2"></i>{{ $t('nav.addresses') }}
                </router-link>
                <router-link v-if="isSeller" to="/seller/dashboard" target="_blank" class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-blue-600 font-semibold">
                  <i class="fas fa-store mr-2"></i>{{ $t('nav.seller_dashboard') }}
                </router-link>
              </div>

              <div class="border-t border-gray-200 mt-3 pt-3">
                <router-link
                  v-if="!authStore.isAuthenticated"
                  to="/login"
                  class="block w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-blue-600 font-semibold"
                >
                  <i class="fas fa-sign-in-alt mr-2"></i>{{ $t('nav.login') }}
                </router-link>
                <button
                  v-else
                  @click="handleLogout"
                  class="w-full text-left py-2 px-3 hover:bg-gray-100 rounded text-sm text-blue-600 font-semibold"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i>{{ $t('nav.logout') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Orders -->
          <router-link to="/orders" class="flex flex-col cursor-pointer hover:text-blue-600 transition-colors">
            <i class="fas fa-shopping-cart text-sm"></i>
            <span class="text-sm font-semibold">{{ $t('nav.orders') }}</span>
          </router-link>

          <!-- Notifications -->
          <router-link
            v-if="authStore.isAuthenticated"
            to="/notifications"
            class="flex items-center cursor-pointer hover:text-blue-600 transition-colors relative px-2"
            title="Notifications"
          >
            <i class="fas fa-bell text-2xl"></i>
            <span
              v-if="notificationsStore.unreadCount > 0"
              class="absolute top-0 right-1 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold"
            >
              {{ notificationsStore.unreadCount }}
            </span>
          </router-link>

          <!-- Cart -->
          <!-- Cart -->
          <router-link
            to="/cart"
            class="flex items-center cursor-pointer hover:text-blue-600 transition-colors relative"
            :class="{ 'cart-animate': uiStore.isCartAnimating }"
          >
            <i class="fas fa-shopping-cart text-2xl"></i>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-2 bg-blue-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </router-link>

          <!-- Sign In & Register Buttons -->
          <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-2">
            <router-link
              to="/login"
              class="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold transition-colors inline-block"
            >
              {{ $t('nav.login') }}
            </router-link>
            <router-link
              to="/register"
              class="bg-white border border-blue-400 text-blue-400 hover:bg-blue-50 px-4 py-2 rounded text-sm font-semibold transition-colors inline-block"
            >
              {{ $t('nav.register') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Menu -->
    <div
      v-if="!isMobile && !route.meta.hideNavSearch"
      class="bg-gray-100 border-b border-gray-200 py-2 shadow-sm"
      :class="{
        'fixed top-0 left-0 right-0 z-40 shadow-lg bg-opacity-95 backdrop-blur-sm':
          !props.transparent,
        relative: props.transparent,
      }"
    >
      <div class="container mx-auto px-4 relative">
        <div class="flex items-center justify-center space-x-8 text-sm">
          <!-- Tous les produits -->
          <div class="group">
            <router-link
              to="/products"
              class="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-th-large text-gray-600"></i>
              <span>{{ $t('nav.cat_all') }}</span>
              <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Promo</span>
            </router-link>
          </div>

          <!-- High-Tech & Informatique -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'hitech'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=high-tech"
              class="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-laptop text-gray-600"></i>
              <span>{{ $t('nav.cat_hitech') }}</span>
            </router-link>
 
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'hitech'"
                class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded p-4 min-w-[280px]"
                style="z-index: 99999"
              >
                <div class="grid grid-cols-2 gap-x-6 text-sm text-gray-600">
                  <div class="space-y-2">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_hitech_computing') }}</div>
                    <router-link to="/products?category=laptop" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_hitech_laptops') }}</router-link>
                    <router-link to="/products?category=composants" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_hitech_parts') }}</router-link>
                    <router-link to="/products?category=tablettes" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_hitech_tablets') }}</router-link>
                  </div>
                  <div class="space-y-2">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_hitech_phones') }}</div>
                    <router-link to="/products?category=smartphone" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_hitech_smartphones') }}</router-link>
                    <router-link to="/products?category=montres-connectées" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_hitech_watches') }}</router-link>
                  </div>
                  <div class="space-y-2 mt-3">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_hitech_audio') }}</div>
                    <router-link to="/products?category=audio" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_hitech_headphones') }}</router-link>
                    <router-link to="/products?category=photo" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_hitech_photo') }}</router-link>
                  </div>
                  <div class="space-y-2 mt-3">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_hitech_tv') }}</div>
                    <router-link to="/products?category=tv" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_hitech_televisions') }}</router-link>
                    <router-link to="/products?category=video" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_hitech_projectors') }}</router-link>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Maison & Bricolage -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'maison'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=maison"
              class="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-home text-gray-600"></i>
              <span>{{ $t('nav.cat_maison') }}</span>
            </router-link>
 
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'maison'"
                class="absolute top-full left-0 mt-1 bg-white shadow-lg rounded p-4 min-w-[280px]"
                style="z-index: 99999"
              >
                <div class="grid grid-cols-2 gap-x-6 text-sm text-gray-600">
                  <div class="space-y-2">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_maison_habitat') }}</div>
                    <router-link to="/products?category=cuisine" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_maison_kitchen') }}</router-link>
                    <router-link to="/products?category=meubles" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_maison_furniture') }}</router-link>
                    <router-link to="/products?category=electromenager" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_maison_appliances') }}</router-link>
                  </div>
                  <div class="space-y-2">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_maison_diy') }}</div>
                    <router-link to="/products?category=outillage" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_maison_tools') }}</router-link>
                    <router-link to="/products?category=jardin" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_maison_garden') }}</router-link>
                    <router-link to="/products?category=animalerie" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_maison_pets') }}</router-link>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Mode & Beauté -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'mode'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=mode"
              class="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-tshirt text-gray-600"></i>
              <span>{{ $t('nav.cat_mode') }}</span>
            </router-link>
 
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'mode'"
                class="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white shadow-lg rounded p-4 min-w-[320px]"
                style="z-index: 99999"
              >
                <div class="grid grid-cols-2 gap-x-6 text-sm text-gray-600">
                  <div class="space-y-2">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_mode_clothes') }}</div>
                    <router-link to="/products?category=mode-femme" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_mode_women') }}</router-link>
                    <router-link to="/products?category=mode-homme" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_mode_men') }}</router-link>
                    <router-link to="/products?category=chaussures" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_mode_shoes') }}</router-link>
                  </div>
                  <div class="space-y-2">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_mode_beauty') }}</div>
                    <router-link to="/products?category=beaute" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_mode_makeup') }}</router-link>
                    <router-link to="/products?category=bijoux" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_mode_jewelry') }}</router-link>
                    <router-link to="/products?category=sante" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_mode_health') }}</router-link>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Jeux & Jouets -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'jeux'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=jeux-jouets"
              class="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-gamepad text-gray-600"></i>
              <span>{{ $t('nav.cat_jeux') }}</span>
            </router-link>
 
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'jeux'"
                class="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white shadow-lg rounded p-4 min-w-[280px]"
                style="z-index: 99999"
              >
                <div class="grid grid-cols-2 gap-x-6 text-sm text-gray-600">
                  <div class="space-y-2">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_jeux_entertainment') }}</div>
                    <router-link to="/products?category=gaming" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_jeux_consoles') }}</router-link>
                    <router-link to="/products?category=jouets" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_jeux_toys') }}</router-link>
                    <router-link to="/products?category=societe" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_jeux_board') }}</router-link>
                  </div>
                  <div class="space-y-2">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_jeux_baby') }}</div>
                    <router-link to="/products?category=puericulture" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_jeux_nursery') }}</router-link>
                    <router-link to="/products?category=vetements-bebe" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_jeux_babyclothes') }}</router-link>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Culture & Livres -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'culture'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=culture"
              class="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-book text-gray-600"></i>
              <span>{{ $t('nav.cat_culture') }}</span>
            </router-link>
 
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'culture'"
                class="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white shadow-lg rounded p-4 min-w-[240px]"
                style="z-index: 99999"
              >
                <div class="text-sm text-gray-600 space-y-2">
                  <router-link to="/products?category=livres" class="block hover:text-blue-600 py-1">• {{ $t('nav.cat_culture_books') }}</router-link>
                  <router-link to="/products?category=manga" class="block hover:text-blue-600 py-1">• {{ $t('nav.cat_culture_manga') }}</router-link>
                  <router-link to="/products?category=musique" class="block hover:text-blue-600 py-1">• {{ $t('nav.cat_culture_music') }}</router-link>
                  <router-link to="/products?category=instruments" class="block hover:text-blue-600 py-1">• {{ $t('nav.cat_culture_instruments') }}</router-link>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Supermarché & Autres -->
          <div
            class="relative group"
            @mouseenter="showCategoriesMenu = 'supermarche'"
            @mouseleave="showCategoriesMenu = ''"
          >
            <router-link
              to="/products?category=autres"
              class="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors py-1"
            >
              <i class="fas fa-shopping-basket text-gray-600"></i>
              <span>{{ $t('nav.cat_super') }}</span>
            </router-link>
 
            <Transition name="dropdown">
              <div
                v-if="showCategoriesMenu === 'supermarche'"
                class="absolute top-full right-0 mt-1 bg-white shadow-lg rounded p-4 min-w-[300px]"
                style="z-index: 99999"
              >
                <div class="grid grid-cols-2 gap-x-6 text-sm text-gray-600">
                  <div class="space-y-2">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_super_food') }}</div>
                    <router-link to="/products?category=epicerie" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_super_grocery') }}</router-link>
                    <router-link to="/products?category=snacks" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_super_snacks') }}</router-link>
                    <router-link to="/products?category=bureau" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_super_office') }}</router-link>
                  </div>
                  <div class="space-y-2">
                    <div class="font-bold text-gray-800 border-b pb-1 mb-1">{{ $t('nav.cat_super_leisure') }}</div>
                    <router-link to="/products?category=sports" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_super_sports') }}</router-link>
                    <router-link to="/products?category=auto" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_super_auto') }}</router-link>
                    <router-link to="/products?category=camping" class="block hover:text-blue-600 py-0.5">• {{ $t('nav.cat_super_camping') }}</router-link>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>



        <!-- Sticky Cart -->
        <div
          v-if="!props.transparent"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center"
        >
          <div
            class="flex items-center cursor-pointer hover:text-blue-600 transition-colors relative"
            @click="router.push('/cart')"
          >
            <i class="fas fa-shopping-cart text-xl"></i>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-2 bg-blue-400 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </div>
        </div>
      </div>

    </div>

    </div>
    <!-- END DESKTOP HEADER -->


    <!-- Mobile Menu Drawer -->
    <!-- Backdrop -->
    <Transition name="fade">
      <div 
        v-if="isMobileMenuOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-[100] backdrop-blur-sm"
        @click="closeMobileMenu"
      ></div>
    </Transition>

    <!-- Drawer Panel -->
    <Transition name="slide-left">
      <div 
        v-if="isMobileMenuOpen" 
        class="fixed inset-0 bg-white z-[101] flex flex-col font-sans"
      >
        <!-- Drawer Header -->
        <div class="px-6 py-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between relative overflow-hidden">
          <!-- Decorative Background Blob -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <!-- User Info or Logo -->
          <div class="relative z-10 flex items-center gap-4 w-full">
             <div v-if="authStore.customer" class="flex-shrink-0">
                 <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-200">
                     {{ authStore.customer.firstName ? authStore.customer.firstName.charAt(0).toUpperCase() : 'U' }}
                 </div>
             </div>
             <div v-if="authStore.customer" class="flex-1 min-w-0">
                 <p class="font-bold text-gray-900 text-lg leading-tight truncate">
                   {{ authStore.customer.firstName }} {{ authStore.customer.lastName }}
                 </p>
                 <router-link to="/account" @click="closeMobileMenu" class="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1 mt-1">
                   Mon compte <i class="las la-arrow-right"></i>
                 </router-link>
             </div>
             
             <div v-else class="flex items-center gap-3">
               <img src="/images/logo.png" class="h-10 w-auto" alt="HTFasil">
             </div>
          </div>
          
          <button 
             @click="closeMobileMenu" 
             class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-gray-600 shadow-md flex items-center justify-center hover:text-red-500 hover:bg-gray-50 transition-colors z-50 ring-1 ring-gray-100"
          >
             <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
           <!-- Search in Drawer -->
           <!-- Search in Drawer Removed -->

           <MobileMenuLinks @close="closeMobileMenu" />
        </div>
        
        <!-- Drawer Footer (Socials or Info) -->
        <div class="p-6 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-400">
          <p>© 2024 HTFasil. Tous droits réservés.</p>
        </div>
      </div>
    </Transition>
    
    <!-- Filter Drawer -->
    <ProductFilterDrawer 
      :is-open="isFilterDrawerOpen" 
      :active-tab="activeFilterTab"
      @close="isFilterDrawerOpen = false" 
    />
  </div>
</template>

<script setup lang="ts">
import api from '@/services/api'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useDevice } from '@/composables/useDevice'
import { useNotificationsStore } from '@/stores/notifications'
import { useUiStore } from '@/stores/ui'
import MobileMenuLinks from './MobileMenuLinks.vue'
import ProductFilterDrawer from '../products/ProductFilterDrawer.vue'
import MobileCategories from './MobileCategories.vue'
import { useHistoryStore } from '@/stores/history'
import i18n from '@/i18n'

const { locale } = useI18n()
const { isMobile } = useDevice()

// Methods and Computed moved down

// Props
interface Props {
  transparent?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  transparent: false,
})

// Router
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const notificationsStore = useNotificationsStore()
const uiStore = useUiStore()
const historyStore = useHistoryStore()

// Categories visibility logic
const shouldShowMobileCategories = computed(() => {
  const hiddenPaths = ['/cart', '/checkout', '/account', '/orders', '/wishlist', '/addresses', '/notifications']
  return !hiddenPaths.some(path => route.path.includes(path)) && route.name !== 'product-detail'
})

const isProductListingPage = computed(() => {
  return route.name === 'products'
})

const isSeller = computed(() => {
  return authStore.customer?.role === 'seller' || authStore.customer?.role === 'admin'
})

const isProductPage = computed(() => {
  // On considère la page panier, checkout et notifications comme une page produit pour avoir le header spécifique
  return route.path.includes('/products') || route.path.includes('/cart') || route.name === 'cart' || route.path.includes('/checkout') || route.path.includes('/account') || route.path.includes('/orders') || route.path.includes('/wishlist') || route.path.includes('/addresses') || route.path.includes('/notifications')
})

// State
const searchQuery = ref('')
const isMobileMenuOpen = ref(false)
const isFilterDrawerOpen = ref(false)
const activeFilterTab = ref('all')
const showUserMenu = ref(false)
const showAccountMenu = ref(false)
const showCategoriesMenu = ref('')
const showLanguageMenu = ref(false)
const currentLocale = ref(locale.value)

const languages = [
  { code: 'fr', name: 'FR', flag: '/images/flags/fr.png' },
  { code: 'ht', name: 'HT', flag: '/images/flags/ht.png' }
]

const currentLanguage = computed(() => languages.find(l => l.code === currentLocale.value) || languages[0])
const isHeaderFixed = ref(false)
const isScrollingUp = ref(true)
const lastScrollY = ref(0)

const handleHeaderScroll = () => {
    const currentScrollY = window.scrollY
    const scrollDiff = Math.abs(currentScrollY - lastScrollY.value)
    
    // Only trigger if scroll difference is significant (tolerance)
    if (scrollDiff > 10) {
        // Determine scroll direction
        if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
            isScrollingUp.value = false // Scrolling down
        } else if (currentScrollY < lastScrollY.value) {
            isScrollingUp.value = true // Scrolling up
        }
        lastScrollY.value = currentScrollY
    }

    if (isMobile.value && !isProductPage.value) {
        isHeaderFixed.value = currentScrollY > 56
    } else {
        isHeaderFixed.value = false
    }
}

// Methods
const changeLanguage = (code: string) => {
  currentLocale.value = code
  locale.value = code           // locale locale du composant
  i18n.global.locale.value = code  // locale globale de toute l'app
  localStorage.setItem('locale', code)
  showLanguageMenu.value = false
}

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    historyStore.addSearch(searchQuery.value)
    router.push(`/products?search=${encodeURIComponent(searchQuery.value)}`)
    closeMobileMenu()
  }
}

const handleLogout = async () => {
  await authStore.logout()
  showAccountMenu.value = false
  router.push('/')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleBack = () => {
  if (route.name === 'cart' && uiStore.previousRouteName === 'checkout') {
    // Si on revient du Checkout vers le Panier, un "Back" doit nous sortir du flux de commande
    router.push('/')
  } else {
    router.back()
  }
}

const openFilterDrawer = (tab: string = 'all') => {
  activeFilterTab.value = tab
  isFilterDrawerOpen.value = true
}

const closeMobileMenu = () => {

  isMobileMenuOpen.value = false
}

// Image Search
const imageInput = ref<HTMLInputElement | null>(null)
const isImageSearching = ref(false)

const triggerImageSearch = () => {
  if (isImageSearching.value) return
  imageInput.value?.click()
}

const handleImageSearch = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
        uiStore.showToast("Veuillez sélectionner une image valide.", 'warning')
        return
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
        const base64Image = reader.result;
        
        try {
            isImageSearching.value = true
            
            // Show loading state (optional: could use a toast)
            console.log("Analysant l'image...")
            
            const response = await api.post('/products/search/image', { image: base64Image });
            
            if (response.data && response.data.ids && response.data.ids.length > 0) {
                console.log("Produits trouvés:", response.data.ids)
                // Redirect to filtered results
                await router.push({
                    name: 'products',
                    query: { ids: response.data.ids.join(',') }
                });
                closeMobileMenu();
            } else {
                uiStore.showToast("Aucun produit similaire trouvé.", 'info')
            }
        } catch (error: any) {
            console.error("Erreur recherche image:", error);
            const msg = error.response?.data?.error || "Erreur lors de la recherche par image.";
            uiStore.showToast(msg, 'error')
        } finally {
            isImageSearching.value = false;
            // Reset input so same file can be selected again
            if (imageInput.value) imageInput.value.value = '';
        }
    };
    
    reader.onerror = () => {
        uiStore.showToast("Erreur lors de la lecture du fichier.", 'error')
        isImageSearching.value = false;
    }
  }
}
let notificationInterval: number | undefined

onMounted(() => {
    window.addEventListener('scroll', handleHeaderScroll)
    handleHeaderScroll() // Initial check
    historyStore.init()
})

const startPolling = () => {
    stopPolling()
    if (authStore.isAuthenticated) {
        notificationsStore.fetchNotifications()
        // Poll for new notifications every 60 seconds
        notificationInterval = window.setInterval(() => {
            if (authStore.isAuthenticated) {
                notificationsStore.fetchNotifications(true)
            } else {
                stopPolling()
            }
        }, 60000)
    }
}

const stopPolling = () => {
    if (notificationInterval) {
        clearInterval(notificationInterval)
        notificationInterval = undefined
    }
}

// Watch for auth changes to start/stop polling
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
    if (isAuthenticated) {
        startPolling()
    } else {
        stopPolling()
    }
}, { immediate: true })

// Fermer le menu lors du changement de route
watch(() => route.path, () => {
    closeMobileMenu()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleHeaderScroll)
    stopPolling()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.8);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}

/* Mobile Header Styles */
.mobile-header {
  z-index: 50;
}

.mobile-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
}

.cart-icon-mobile {
  position: relative;
  color: #374151;
}

.badge-mobile {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #fb923c;
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 9999px;
  font-weight: 600;
}

.mobile-search-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem 0.25rem;
}

.mobile-search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 9999px;
  font-size: 0.875rem;
  outline: none;
  background: #f3f4f6;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.mobile-search-input:focus {
  border-color: #fb923c;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

@keyframes cart-shake {
  0% { transform: scale(1); }
  25% { transform: scale(1.2) rotate(-10deg); }
  50% { transform: scale(1.2) rotate(10deg); }
  75% { transform: scale(1.2) rotate(-10deg); }
  100% { transform: scale(1); }
}

.cart-animate {
  animation: cart-shake 0.6s ease-in-out;
}
</style>
