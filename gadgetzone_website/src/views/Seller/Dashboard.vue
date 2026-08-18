<template>
  <div class="w-full">
 <!-- MOBILE DASHBOARD (Natcash inspired Blue Theme) -->
 <div class="lg:hidden bg-gray-50 min-h-screen pb-20 -mt-2 font-sans">
 <!-- Top Section (Header + Balance) -->
 <div class="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 pt-10 pb-20 relative">
 <!-- User Info Row -->
 <div class="flex justify-between items-start mb-10">
 <div @click="router.push('/seller/settings')" class="flex items-center gap-4 active:scale-95 transition-transform cursor-pointer">
 <div class="relative">
 <div class="w-14 h-14 rounded-full border-2 border-white/30 overflow-hidden bg-white/20 flex items-center justify-center p-0.5">
 <img alt="" v-if="store.logoUrl" :src="store.logoUrl" class="w-full h-full rounded-full object-cover" />
 <i v-else class="fas fa-store text-xl text-blue-100"></i>
 </div>
 <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 border-2 border-blue-700 rounded-full flex items-center justify-center">
 <i class="fas fa-check text-[8px] text-white"></i>
 </div>
 </div>
 <div>
 <h2 class="font-bold text-xl uppercase tracking-tight">{{ store.name || authStore.customer?.firstName || 'Vendeur' }}</h2>
 <p class="text-xs text-blue-100/80">{{ store.phone || '(509) ---- ----' }}</p>
 </div>
 </div>
 <div class="flex gap-4">
 <button @click="showAiChat = true" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative backdrop-blur-md active:scale-90 transition-all">
 <i class="fas fa-headset text-sm"></i>
 </button>
 <button @click="router.push('/seller/notifications')" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative backdrop-blur-md active:scale-90 transition-all">
 <i class="fas fa-bell text-sm"></i>
 <span v-if="notificationsStore.unreadCount > 0" class="absolute top-2.5 right-2.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-700 text-[8px] flex items-center justify-center font-bold">{{ notificationsStore.unreadCount }}</span>
 </button>
 </div>
 </div>

  <!-- Dual Balance Display -->
  <div class="mb-4">
    <div class="flex items-center justify-between mb-2">
      <p class="text-[10px] font-bold text-blue-100/60 uppercase tracking-widest">Aperçu Financier</p>
      <button @click="isBalanceVisible = !isBalanceVisible" class="text-blue-200 hover:text-white transition-colors p-2 -m-2">
        <i class="fas" :class="isBalanceVisible ? 'fa-eye' : 'fa-eye-slash'"></i>
      </button>
    </div>
    
    <div v-if="loading" class="grid grid-cols-2 gap-4">
      <div class="h-12 bg-white/10 animate-pulse rounded-2xl"></div>
      <div class="h-12 bg-white/10 animate-pulse rounded-2xl"></div>
    </div>
    <div v-else class="flex items-center">
      <!-- Argent en cours (Total Revenue in system) -->
      <div class="flex-1">
        <p class="text-[10px] text-blue-100/80 mb-1">Argent en cours</p>
        <div class="flex items-baseline gap-1">
          <span class="text-xl font-black">{{ isBalanceVisible ? formatPrice(activeRevenue) : '••••' }}</span>
          <span class="text-[10px] font-bold text-blue-200">HTG</span>
        </div>
      </div>
      
      <!-- Vertical Divider -->
      <div class="w-px h-8 bg-white/20 mx-4"></div>
      
      <!-- Solde Retirable -->
      <div class="flex-1">
        <p class="text-[10px] text-blue-100/80 mb-1">Solde Retirable</p>
        <div class="flex items-baseline gap-1">
          <span class="text-xl font-black text-white">{{ isBalanceVisible ? formatPrice(availableBalance) : '••••' }}</span>
          <span class="text-[10px] font-bold text-blue-200">HTG</span>
        </div>
      </div>
    </div>
    <p class="text-[9px] text-blue-200/50 mt-4 italic leading-tight">* Inclut les ventes livrées et en cours, moins les retraits déjà effectués.</p>
  </div>

  <!-- LOCATION ALERT -->
  <div v-if="!loading && (!store.latitude || !store.longitude)" class="mt-4 mx-2">
    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
      <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
        <i class="fas fa-map-marker-alt"></i>
      </div>
      <div class="flex-1">
        <h4 class="text-sm font-bold text-amber-900">Information de Localisation Manquante</h4>
        <p class="text-[11px] text-amber-800 mt-1 leading-relaxed">
          Ajoutez votre position GPS pour que les clients proches de vous voient vos produits en priorité ! Cela augmentera vos ventes locales.
        </p>
        <button 
          @click="updateLocation" 
          :disabled="updatingLocation"
          class="mt-3 bg-amber-600 text-white text-[11px] font-bold py-2 px-4 rounded-xl active:scale-95 transition-all flex items-center gap-2"
        >
          <i class="fas" :class="updatingLocation ? 'fa-spinner fa-spin' : 'fa-location-arrow'"></i>
          {{ updatingLocation ? 'Mise à jour...' : 'Définir ma position actuelle' }}
        </button>
      </div>
    </div>
  </div>

  <!-- SHIPPING RATE ALERT -->
  <div v-if="!loading && store.status === 'active' && !store.settings?.shipping?.setupCompleted" class="mt-4 mx-2">
    <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
      <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
        <i class="fas fa-truck"></i>
      </div>
      <div class="flex-1">
        <h4 class="text-sm font-bold text-blue-900">Configurez vos tarifs de livraison</h4>
        <p class="text-[11px] text-blue-800 mt-1 leading-relaxed">
          Définissez où vous livrez et vos tarifs pour chaque ville afin que vos clients puissent finaliser leurs commandes.
        </p>
        <button 
          @click="router.push('/seller/shipping')" 
          class="mt-3 bg-blue-600 text-white text-[11px] font-bold py-2 px-4 rounded-xl active:scale-95 transition-all flex items-center gap-2"
        >
          <i class="fas fa-cog"></i>
          Configurer les tarifs
        </button>
      </div>
    </div>
  </div>

 <!-- Abstract Background Element (Simulating the '14th' banner in screenshot) -->
 <div class="absolute right-0 bottom-4 opacity-20 pointer-events-none">
 <i class="fas fa-shield-alt text-[140px] rotate-12"></i>
 </div>
 </div>

 <!-- Main Quick Actions Card -->
 <div class="px-5 -mt-12 relative z-20">
 <div class="bg-white rounded-3xl shadow-xl shadow-blue-950/5 p-5 flex justify-between items-center border border-gray-50">
 <button @click="router.push('/seller/deposits')" class="flex flex-col items-center gap-2 group">
 <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
 <i class="fas fa-download"></i>
 </div>
 <span class="text-[11px] font-bold text-gray-700">Depot</span>
 </button>
 <button @click="showWithdrawModal = true" class="flex flex-col items-center gap-2 group">
 <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
 <i class="fas fa-reply"></i>
 </div>
 <span class="text-[11px] font-bold text-gray-700">Retrait</span>
 </button>
 <button @click="router.push('/seller/messages')" class="flex flex-col items-center gap-2 group">
 <div class="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
 <i class="fas fa-comment-dots"></i>
 </div>
 <span class="text-[11px] font-bold text-gray-700">Messages</span>
 </button>
 <button @click="router.push('/seller/my-qr')" class="flex flex-col items-center gap-2 group">
 <div class="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-active:scale-95 transition-all shadow-sm">
 <i class="fas fa-qrcode"></i>
 </div>
 <span class="text-[11px] font-bold text-gray-700">Mon QR</span>
 </button>
 </div>
 </div>

 <!-- Explore Section -->
 <div class="px-6 pt-10 pb-6">
 <div v-if="store.id" class="flex justify-between items-center mb-6 overflow-hidden gap-2">
 <h3 class="font-bold text-xl text-gray-900 tracking-tight whitespace-nowrap">Mon Menu</h3>
 <button @click="router.push('/store/' + store.id)" class="text-blue-600 text-[13px] font-bold flex items-center gap-1 group whitespace-nowrap">
 Voir ma boutique
 <i class="fas fa-eye text-[10px] group-hover:scale-110 transition-transform"></i>
 </button>
 </div>

 <div class="grid grid-cols-4 gap-y-8">
 <button @click="navigateToAddProduct" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-blue-50/50 flex items-center justify-center shadow-sm active:bg-blue-100 transition-colors">
 <i class="fas fa-plus-circle text-blue-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Ajouter<br>Produit</span>
 </button>
 <button @click="router.push('/seller/reports')" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-blue-50/50 flex items-center justify-center shadow-sm active:bg-blue-100 transition-colors">
 <i class="fas fa-chart-pie text-blue-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Rapports<br>Ventes</span>
 </button>
 <button @click="router.push('/seller/transactions')" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-emerald-50/50 flex items-center justify-center shadow-sm active:bg-emerald-100 transition-colors text-emerald-600">
 <i class="fas fa-history text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Historique<br>Transactions</span>
 </button>
 <button @click="router.push('/seller/settings')" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-blue-50/50 flex items-center justify-center shadow-sm active:bg-blue-100 transition-colors">
 <i class="fas fa-store-alt text-blue-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Paramètres<br>Boutique</span>
 </button>
 <button @click="router.push('/seller/shipping')" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-blue-50/50 flex items-center justify-center shadow-sm active:bg-blue-100 transition-colors">
 <i class="fas fa-truck text-blue-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Zones de<br>Livraison</span>
 </button>
 <button @click="router.push('/seller/promotions')" class="flex flex-col items-center gap-3 snap-center">
 <div class="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center shadow-sm active:bg-violet-100 transition-colors">
 <i class="fas fa-bullhorn text-violet-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Promotions<br>Marketing</span>
 </button>
 <button @click="uiStore.showToast('Cette fonctionnalité n\'est pas encore disponible', 'info')" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-blue-50/50 flex items-center justify-center shadow-sm active:bg-blue-100 transition-colors">
 <i class="fas fa-users-cog text-blue-600 text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Ambassadeur</span>
 </button>
 <button @click="shareDeliveryScanner" class="flex flex-col items-center gap-3">
 <div class="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center shadow-sm active:bg-indigo-100 transition-colors text-indigo-600">
 <i class="fas fa-shipping-fast text-xl"></i>
 </div>
 <span class="text-[10px] font-bold text-gray-600 text-center leading-tight">Partager<br>Livreur</span>
 </button>
 </div>
 </div>

 <!-- Horizontal Scroll Section (Autres Services) -->
 <div class="pt-4 pb-10">
 <div class="flex justify-between items-center px-6 mb-4">
 <h3 class="font-bold text-xl text-gray-900 tracking-tight">Autres Services</h3>
 <button @click="router.push('/seller/services')" class="text-blue-600 text-[13px] font-bold flex items-center gap-1 group">
 Voir Tout
 <i class="fas fa-chevron-right text-[10px] transition-transform group-hover:translate-x-1"></i>
 </button>
 </div>
 
 <div class="flex overflow-x-auto gap-4 px-6 no-scrollbar pb-4 snap-x snap-mandatory">
 <div v-for="(service, i) in services" :key="i" @click="navigateToService(service)" class="flex-shrink-0 w-32 h-32 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 snap-center flex flex-col items-center justify-center text-center group active:scale-95 transition-all cursor-pointer">
 <div class="w-12 h-12 rounded-full mb-3 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110" :class="service.bg">
 <i :class="[service.icon, service.color, 'text-xl']"></i>
 </div>
 <span class="text-[11px] font-bold text-gray-700 leading-tight">{{ service.name }}</span>
 </div>
 </div>
 </div>

 <!-- Recent Transactions -->
 <div class="px-6 pb-20">
 <div class="flex justify-between items-center mb-6">
 <h3 class="font-bold text-xl text-gray-900 tracking-tight">Historique des Transactions</h3>
 <button @click="router.push('/seller/transactions')" class="text-blue-600 text-[13px] font-bold flex items-center gap-1 group">
 Voir Tout
 <i class="fas fa-chevron-right text-[10px] transition-transform group-hover:translate-x-1"></i>
 </button>
 </div>

 <div class="space-y-4">
 <div v-for="order in recentOrders.slice(0, 3)" :key="order.id" @click="router.push(`/seller/orders/${order.id}`)" class="bg-white p-5 rounded-3xl shadow-sm flex items-center gap-4 border border-gray-50 group hover:border-blue-100 transition-colors active:scale-[0.98]">
 <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shadow-sm border border-gray-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
 <i class="fas" :class="order.status === 'completed' ? 'fa-wallet' : 'fa-receipt'"></i>
 </div>
 <div class="flex-1">
 <h4 class="font-bold text-gray-900 text-[13px] line-clamp-1 leading-tight">{{ order.user?.name || 'Client' }}</h4>
 <p class="text-[10px] text-gray-400 mt-1">{{ new Date(order.created_at).toLocaleDateString() }} {{ new Date(order.created_at).toLocaleTimeString().slice(0,5) }}</p>
 </div>
 <div class="text-right flex flex-col items-end gap-1">
 <!-- Gross Price (strikethrough) -->
 <div class="text-[10px] text-gray-400 line-through">
 {{ formatPrice(order.items.reduce((acc: any, i: any) => acc + (i.price * i.quantity), 0)) }}
 </div>
 <!-- Commission Rate -->
 <div class="text-[9px] font-bold text-red-400 bg-red-50 px-1.5 py-0.5 rounded-md">
 -{{ order.items[0]?.product?.category?.commission_rate || store.commission_rate || 3 }}%
 </div>
 <!-- Net Gain (Large) -->
 <div class="font-extrabold text-[14px]" :class="order.status === 'completed' ? 'text-green-600' : 'text-gray-900'">
 {{ order.status === 'completed' ? '+' : '' }}{{ formatPrice(order.items.reduce((acc: any, i: any) => acc + ( (i.price * i.quantity) * (1 - (i.product?.category?.commission_rate || store.commission_rate || 3) / 100) ), 0)) }} <span class="text-[10px] opacity-70">HTG</span>
 </div>
 </div>
 </div>
 <div v-if="recentOrders.length === 0" class="text-center py-12 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
 <div class="mb-3"><i class="fas fa-history text-3xl text-gray-200"></i></div>
 Aucune transaction récente.
 </div>
 </div>
 </div>
 </div>
  </div>

  <div class="hidden lg:block w-full font-sans">
    <div class="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
  
      <!-- Header: Welcome & Quick Stats -->
      <div class="flex justify-between items-end mb-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 tracking-tight mb-1">Dashboard</h1>
          <p class="text-sm text-slate-500">Bon retour, <span class="font-semibold text-slate-800">{{ store.name || 'Vendeur' }}</span> 👋</p>
        </div>
        <div class="flex gap-3">
          <!-- Bouton Assistant IA (Sober Design) -->
          <button 
            @click="showAiChat = !showAiChat"
            class="px-4 py-2 text-xs font-semibold rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 group shadow-sm"
          >
            <i class="fas fa-headset text-slate-400 group-hover:text-slate-600"></i>
            <span class="hidden sm:inline text-xs">Assistant</span>
          </button>
          <button @click="navigateToAddProduct" class="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm">
            <i class="fas fa-plus"></i> Nouveau Produit
          </button>
        </div>
      </div>

      <!-- LOCATION ALERT (Desktop) -->
      <div v-if="store.id && store.status === 'active' && (!store.latitude || !store.longitude)" class="bg-amber-50 p-5 rounded-xl border border-amber-200 flex items-center justify-between shadow-sm mt-2">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-lg shadow-sm">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-amber-900 tracking-tight">Optimisez votre visibilité locale ! 🚀</h3>
            <p class="text-xs text-amber-700">Les clients verront vos produits en priorité s'ils sont proches de votre boutique.</p>
          </div>
        </div>
        <button 
          @click="updateLocation" 
          :disabled="updatingLocation"
          class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <i v-if="updatingLocation" class="fas fa-circle-notch animate-spin text-xs"></i>
          <i v-else class="fas fa-crosshairs text-xs"></i>
          {{ updatingLocation ? 'Localisation...' : 'Définir ma position' }}
        </button>
      </div>

      <!-- SHIPPING RATE ALERT (Desktop) -->
      <div v-if="store.id && store.status === 'active' && !store.settings?.shipping?.setupCompleted" class="bg-blue-50 p-5 rounded-xl border border-blue-200 flex items-center justify-between shadow-sm mt-2">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-lg shadow-sm">
            <i class="fas fa-truck"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-blue-900 tracking-tight">Configurez vos zones de livraison ! 🚚</h3>
            <p class="text-xs text-blue-700">Définissez vos zones et tarifs pour commencer à recevoir des commandes.</p>
          </div>
        </div>
        <button 
          @click="router.push('/seller/shipping')" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <i class="fas fa-cog text-xs"></i>
          Configurer
        </button>
      </div>

      <!-- Row 1: KPI Cards (Flat minimal design) -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Card 1: Today's Orders -->
        <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all duration-200">
          <div class="flex items-center justify-between mb-3">
            <span class="text-slate-400 font-medium text-xs uppercase tracking-wider">Commandes du jour</span>
            <i class="fas fa-shopping-bag text-slate-300"></i>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="text-3xl font-bold text-slate-800">{{ stats.todayOrders || 0 }}</span>
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
        </div>

        <!-- Card 2: Revenue in System -->
        <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all duration-200">
          <div class="flex items-center justify-between mb-3">
            <span class="text-slate-400 font-medium text-xs uppercase tracking-wider">Argent en cours</span>
            <i class="fas fa-hand-holding-usd text-slate-300"></i>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-slate-800">{{ formatPrice(activeRevenue) }}</span>
            <span class="text-xs font-medium text-slate-400">HTG</span>
          </div>
        </div>

        <!-- Card 3: Main Balance (SaaS Style) -->
        <div class="bg-slate-900 p-6 rounded-xl border border-slate-950 shadow-sm transition-all duration-200 text-white flex flex-col justify-between h-[120px]">
          <div class="flex items-center justify-between">
            <span class="text-slate-300 font-medium text-xs uppercase tracking-wider">Porte-monnaie</span>
            <i class="fas fa-wallet text-slate-400"></i>
          </div>
          <div class="flex items-baseline justify-between">
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-bold text-white">{{ formatPrice(availableBalance) }}</span>
              <span class="text-xs font-medium text-slate-300">HTG</span>
            </div>
            <button @click="showWithdrawModal = true" class="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1">
              Retirer <i class="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>

        <!-- Card 4: Store Health -->
        <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all duration-200">
          <div class="flex items-center justify-between mb-3">
            <span class="text-slate-400 font-medium text-xs uppercase tracking-wider">Santé Boutique</span>
            <i class="fas fa-star text-slate-300"></i>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-baseline">
              <span class="text-xl font-bold text-slate-800">{{ loading ? '---' : (stats.healthScore >= 90 ? 'Excellent' : (stats.healthScore >= 70 ? 'Bon' : 'À améliorer')) }}</span>
              <span class="text-xs font-semibold text-slate-500">{{ loading ? '--%' : stats.healthScore + '%' }}</span>
            </div>
            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-slate-800 rounded-full transition-all duration-1000" :style="{ width: (loading ? 0 : stats.healthScore) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 2: Graph & Mini Widgets -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Interactive Chart -->
        <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-base font-bold text-slate-800 tracking-tight">Performance Analytique</h3>
              <p class="text-xs text-slate-400 font-medium">Évolution de votre chiffre d'affaires</p>
            </div>
            <div class="flex bg-slate-50 p-1 rounded-lg gap-1 border border-slate-100">
              <button class="px-3 py-1 rounded-md text-xs font-semibold bg-white text-slate-800 shadow-sm border border-slate-200/50">Hebdomadaire</button>
              <button class="px-3 py-1 rounded-md text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">Mensuel</button>
            </div>
          </div>
          
          <div class="relative h-60 w-full">
            <LineChart v-if="!loading && stats.chartData && stats.chartData.length > 0" :data="chartDataComputed" :options="chartOptions" />
            <div v-else-if="loading" class="w-full h-full flex items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
            </div>
            <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs italic">
              Aucune donnée disponible pour le graphique
            </div>
          </div>
        </div>

        <!-- Fast Actions & Small Stats -->
        <div class="space-y-6 flex flex-col justify-between">
          <!-- Quick Nav -->
          <div class="grid grid-cols-2 gap-4">
            <button @click="router.push('/seller/messages')" class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all flex flex-col justify-between text-left group">
              <div class="w-8 h-8 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <i class="fas fa-envelope text-sm"></i>
              </div>
              <div>
                <div class="text-2xl font-bold text-slate-800">{{ loading ? '-' : stats.unreadMessagesCount }}</div>
                <div class="text-xs font-medium text-slate-400 uppercase tracking-wide">Messages</div>
              </div>
            </button>
            
            <button @click="router.push('/seller/reports')" class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all flex flex-col justify-between text-left group">
              <div class="w-8 h-8 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <i class="fas fa-scroll text-sm"></i>
              </div>
              <div>
                <div class="text-2xl font-bold text-slate-800">{{ loading ? '--%' : stats.conversionRate + '%' }}</div>
                <div class="text-xs font-medium text-slate-400 uppercase tracking-wide">Conversion</div>
              </div>
            </button>
          </div>

          <!-- Low Stock Warning (Re-styled) -->
          <div class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-slate-400 font-semibold text-xs uppercase tracking-wider">Alerte Stock</span>
                <i class="fas fa-exclamation-triangle text-amber-500 text-sm"></i>
              </div>
              
              <div v-if="lowStockProducts.length > 0" class="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <img alt="" :src="currentStockItem.image_url || '/placeholder.png'" class="w-10 h-10 object-cover rounded-md bg-white border border-slate-200" />
                <div class="min-w-0 flex-1">
                  <h4 class="font-semibold text-xs text-slate-800 truncate">{{ currentStockItem.name }}</h4>
                  <p class="text-red-500 font-bold text-xs">{{ currentStockItem.stock }} unités restantes</p>
                </div>
              </div>
              <div v-else class="text-center py-4">
                <p class="text-slate-400 font-medium italic text-xs">Tout est en ordre !</p>
              </div>
            </div>
            
            <button @click="router.push('/seller/products')" class="w-full mt-4 py-2 bg-slate-900 hover:bg-black text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors">
              Réapprovisionner
            </button>
          </div>
        </div>
      </div>

      <!-- Row 3: Orders List -->
      <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-base font-bold text-slate-800 tracking-tight">Flux de Commandes</h3>
            <p class="text-xs text-slate-400 font-medium">Suivi des dernières activités en temps réel</p>
          </div>
          <router-link to="/seller/orders" class="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-xs rounded-lg transition-colors border border-slate-200/50">
            Consulter tout
          </router-link>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                <th class="pb-3 font-semibold">Référence</th>
                <th class="pb-3 font-semibold">Article Principal</th>
                <th class="pb-3 font-semibold text-center">Quantité</th>
                <th class="pb-3 font-semibold">Heure/Date</th>
                <th class="pb-3 font-semibold text-right pr-4">Détails/Prix</th>
                <th class="pb-3 font-semibold text-right">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-slate-50/50 transition-colors cursor-pointer" @click="router.push(`/seller/orders/${order.id}`)">
                <td class="py-4">
                  <span class="font-mono text-xs font-semibold text-slate-500 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md">#{{ formatOrderId(order.order_number || order.id) }}</span>
                </td>
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg border border-slate-100 p-0.5 bg-white flex-shrink-0">
                      <img alt="" :src="order.items[0]?.product?.image_url || '/placeholder.png'" class="w-full h-full rounded-md object-cover"/>
                    </div>
                    <div class="min-w-0">
                      <div class="font-semibold text-slate-800 text-sm truncate max-w-[200px]">{{ order.items[0]?.product?.name }}</div>
                      <div class="text-xs text-slate-400">Client: {{ order.user?.firstName || 'Particulier' }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-4 text-center font-semibold text-slate-600">01</td>
                <td class="py-4 text-xs">
                  <div class="font-semibold text-slate-700">{{ new Date(order.created_at).toLocaleDateString() }}</div>
                  <div class="text-slate-400">{{ new Date(order.created_at).toLocaleTimeString().slice(0,5) }}</div>
                </td>
                <td class="py-4 text-right pr-4">
                  <div class="flex flex-col items-end">
                    <div class="text-xs text-slate-300 line-through">{{ formatPrice(order.items.reduce((acc: any, i: any) => acc + (i.price * i.quantity), 0)) }}</div>
                    <div class="text-xs font-bold text-slate-800">
                      {{ formatPrice(order.items.reduce((acc: any, i: any) => acc + ( (i.price * i.quantity) * (1 - (i.product?.category?.commission_rate || store.commission_rate || 3) / 100) ), 0)) }} 
                      <span class="text-[9px] font-bold text-red-500 bg-red-50 px-1 rounded-md ml-1">-{{ order.items[0]?.product?.category?.commission_rate || store.commission_rate || 3 }}%</span>
                    </div>
                  </div>
                </td>
                <td class="py-4 text-right">
                  <span :class="{
                    'bg-amber-50 text-amber-600 border-amber-100': order.status === 'pending',
                    'bg-emerald-50 text-emerald-600 border-emerald-100': order.status === 'completed' || order.status === 'delivered',
                    'bg-blue-50 text-blue-600 border-blue-100': order.status === 'shipped',
                    'bg-rose-50 text-rose-600 border-rose-100': order.status === 'cancelled'
                    }" class="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase border">
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>

 <!-- Withdrawal Modal -->
 <div v-if="showWithdrawModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showWithdrawModal = false"></div>
 <div class="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] hide-scrollbar animate-in fade-in zoom-in duration-200 pb-2">
 <div class="p-6">
 <div class="flex justify-between items-center mb-6">
 <h3 class="text-xl font-bold text-gray-900">Demander un Retrait</h3>
 <button @click="showWithdrawModal = false" class="text-gray-400 hover:text-gray-600 p-2">
 <i class="fas fa-times"></i>
 </button>
 </div>

 <div class="mb-6 bg-blue-50 p-5 rounded-2xl border border-blue-100">
 <p class="text-xs text-blue-600 font-bold uppercase mb-1">Solde Retirable</p>
 <p class="text-2xl font-bold text-blue-700">{{ formatPrice(availableBalance) }}</p>
 <div class="flex justify-between mt-3 pt-3 border-t border-blue-100 text-[10px] text-blue-500 font-medium">
 <span>Payé: {{ formatPrice(payoutSummary.totalPaid) }}</span>
 <span>Attente: {{ formatPrice(payoutSummary.pendingValue) }}</span>
 </div>
 </div>

 <form @submit.prevent="handleWithdraw" class="space-y-4">
 <div>
 <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Montant à retirer (HTG)</label>
 <div class="relative">
 <input 
 v-model.number="withdrawForm.amount"
 type="number" 
 required
 step="1"
 min="1"
 :max="availableBalance"
 class="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl p-4 text-xl font-bold focus:outline-none transition-all pr-12"
 placeholder="0"
 />
 <span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">HTG</span>
 </div>
 </div>

 <div>
 <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Méthode de retrait</label>
 <div class="grid grid-cols-2 gap-3">
 <button 
 type="button"
 @click="withdrawForm.method = 'MonCash'"
 :class="[
 'p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2',
 withdrawForm.method === 'MonCash' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400'
 ]"
 >
 <img alt="" src="https://moncash.digicelgroup.com/images/moncash_logo.png" class="h-6 object-contain" v-if="false" />
 <i class="fas fa-mobile-alt text-xl" v-else></i>
 <span class="text-xs font-bold">MonCash</span>
 </button>
 <button 
 type="button"
 @click="withdrawForm.method = 'Natcash'"
 :class="[
 'p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2',
 withdrawForm.method === 'Natcash' ? 'border-blue-700 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400'
 ]"
 >
 <i class="fas fa-wallet text-xl"></i>
 <span class="text-xs font-bold">Natcash</span>
 </button>
 </div>
 </div>

 <!-- Account Info Display -->
 <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 mt-4">
 <div class="mb-3">
 <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Informations du compte</label>
 <p class="text-[10px] text-gray-500 mt-1">Saisissez les informations où vous souhaitez recevoir l'argent. Ce numéro sera enregistré par défaut si vous n'en avez pas encore.</p>
 </div>
 
 <div class="space-y-3">
 <div>
 <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Numéro {{ withdrawForm.method }}</label>
 <input 
 v-model="withdrawForm.phone" 
 type="text" 
 placeholder="Ex: 3XXX-XXXX" 
 class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
 required
 />
 </div>
 <div>
 <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nom sur le compte</label>
 <input 
 v-model="withdrawForm.accountName" 
 type="text" 
 placeholder="Ex: Jean Dupont" 
 class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
 required
 />
 </div>
 </div>
 </div>

 <button 
 type="submit"
 :disabled="withdrawing"
 class="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-300 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-2"
 >
 <i v-if="withdrawing" class="fas fa-circle-notch animate-spin"></i>
 {{ withdrawing ? 'Traitement...' : 'Confirmer le Retrait' }}
 </button>
 </form>
 </div>
 </div>
 </div>

 <!-- Shipping Onboarding Modal -->
 <div v-if="showShippingOnboardingModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
   <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showShippingOnboardingModal = false"></div>
   <div class="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
     <div class="p-6 text-center">
       <div class="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto mb-4 animate-bounce">
         <i class="fas fa-truck"></i>
       </div>
       <h3 class="text-xl font-bold text-gray-900 mb-2">Configurez vos zones de livraison</h3>
       <p class="text-sm text-gray-500 mb-6 leading-relaxed">
         Pour commencer à vendre sur HTFasil, vous devez configurer vos zones de livraison et vos tarifs. Les clients verront les frais de livraison correspondants lors du paiement.
       </p>
       <div class="flex flex-col gap-3">
         <button 
           @click="router.push('/seller/shipping'); showShippingOnboardingModal = false"
           class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-200"
         >
           Configurer maintenant
         </button>
         <button 
           @click="showShippingOnboardingModal = false"
           class="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold py-3 rounded-2xl transition-colors border border-gray-100"
         >
           Plus tard
         </button>
       </div>
     </div>
   </div>
 </div>
 
 <AiChatWidget v-model:isOpen="showAiChat" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import { useNotificationsStore } from '@/stores/notifications';
import { useUiStore } from '@/stores/ui';
import AiChatWidget from '@/components/seller/AiChatWidget.vue';
import { formatOrderId } from '@/utils/formatters';
import { Line as LineChart } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale, 
  Filler 
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler);

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const notificationsStore = useNotificationsStore();
const uiStore = useUiStore();

const updatingLocation = ref(false);

const updateLocation = () => {
  if (!navigator.geolocation) {
    uiStore.showToast("La géolocalisation n'est pas supportée par votre navigateur", "error");
    return;
  }

  updatingLocation.value = true;
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await api.put('/vendors/me', { latitude, longitude });
        
        // Update local state with the exact data returned by the server
        if (res.data?.store) {
          Object.assign(store, res.data.store);
        } else {
          store.latitude = latitude;
          store.longitude = longitude;
        }
        
        uiStore.showToast("Position mise à jour avec succès ! Votre boutique est désormais géo-référencée.", "success");
      } catch (error) {
        console.error("Error updating location", error);
        uiStore.showToast("Erreur lors de l'enregistrement de votre position", "error");
      } finally {
        updatingLocation.value = false;
      }
    },
    (error) => {
      updatingLocation.value = false;
      let message = "Impossible de récupérer votre position";
      if (error.code === error.PERMISSION_DENIED) {
        message = "Veuillez autoriser l'accès à votre position pour utiliser cette fonction";
      }
      uiStore.showToast(message, "warning");
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

const showAiChat = ref(false);
const loading = ref(true);
const isBalanceVisible = ref(false);
const products = ref<any[]>([]);
const recentOrders = ref<any[]>([]);
const store = reactive<any>({
 name: '',
 status: 'pending',
 latitude: null,
 longitude: null
});
const stats = reactive({
 sales: 0,
 orders: 0,
 products: 0,
 todaySales: 0,
 todayOrders: 0,
 netSales: 0,
 pendingNetSales: 0,
 lifetimeNetSales: 0,
 lifetimePendingSales: 0,
 totalDeposits: 0,
 healthScore: 100,
 unreadMessagesCount: 0,
 conversionRate: 0,
 chartData: [] as { date: string, amount: number }[],
 recentSales: []
});

const payoutSummary = ref({ totalPaid: 0, pendingValue: 0 });
const showWithdrawModal = ref(false);
const withdrawing = ref(false);
const withdrawForm = reactive({
 amount: 0,
 method: 'MonCash',
 phone: '',
 accountName: ''
});

const services = [
 { name: 'Académie', icon: 'fas fa-graduation-cap', color: 'text-blue-600', bg: 'bg-blue-50', route: '/seller/academy' },
 { name: 'Centre Aide', icon: 'fas fa-question-circle', color: 'text-purple-600', bg: 'bg-purple-50', route: '/seller/help' },
 { name: 'Confiance', icon: 'fas fa-shield-alt', color: 'text-indigo-500', bg: 'bg-indigo-50', route: '/seller/trust' },
 { name: 'Booster', icon: 'fas fa-rocket', color: 'text-orange-500', bg: 'bg-orange-50', route: '/seller/boost' },
 { name: 'Communauté', icon: 'fas fa-users', color: 'text-green-600', bg: 'bg-green-50', route: '/seller/community' }
];

const navigateToService = (service: any) => {
 router.push(service.route);
};

// Watch showWithdrawModal to hide/show bottom nav and lock scroll
watch(showWithdrawModal, (val) => {
 uiStore.isSellerNavVisible = !val;
 if (val) {
 document.body.style.overflow = 'hidden';
 // Pre-fill with save default if exists
 if (store.settings?.payoutPhone) {
 withdrawForm.phone = store.settings.payoutPhone;
 withdrawForm.accountName = store.settings.payoutName || '';
 }
 } else {
 document.body.style.overflow = '';
 }
});

const showShippingOnboardingModal = ref(false);

watch(showShippingOnboardingModal, (val) => {
  uiStore.isSellerNavVisible = !val;
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

watch(showAiChat, (val) => {
 uiStore.isSellerNavVisible = !val;
 if (val) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = '';
 }
});

onUnmounted(() => {
 // Restore navbar visibility and scroll when leaving the page
 uiStore.isSellerNavVisible = true;
 document.body.style.overflow = '';
});

const handleRequestNumberChange = () => {
 uiStore.confirm({
 title: 'Changer de numéro',
 message: 'Êtes-vous sûr de vouloir changer de numéro ? Cette action nécessitera une validation administrative.',
 onConfirm: () => {
 uiStore.showToast("Votre demande de changement de numéro a été transmise à l'administrateur. Vous serez contacté sous peu pour validation.", "info");
 }
 });
};

const availableBalance = computed(() => {
 const val = (stats.lifetimeNetSales || 0) + (stats.totalDeposits || 0) - (payoutSummary.value.totalPaid + payoutSummary.value.pendingValue);
 return Number(Math.max(0, val).toFixed(2));
});

// Total money currently held in the system for the seller (Active + Available - Paid)
const activeRevenue = computed(() => {
 const val = (stats.lifetimeNetSales || 0) + (stats.lifetimePendingSales || 0) + (stats.totalDeposits || 0) - (payoutSummary.value.totalPaid);
 return Number(Math.max(0, val).toFixed(2));
});

const productSearch = ref('');
const productSearchTimeout = ref<any>(null);
const productPagination = ref({
 page: 1,
 limit: 10,
 total: 0,
 totalPages: 1
});

const lowStockProducts = computed(() => {
 return products.value.filter(p => p.stock < 5);
});

const currentStockIndex = ref(0);
const currentStockItem = computed(() => {
 if (lowStockProducts.value.length === 0) return {};
 return lowStockProducts.value[currentStockIndex.value] || lowStockProducts.value[0];
});

const nextStockItem = () => {
 if (currentStockIndex.value < lowStockProducts.value.length - 1) {
 currentStockIndex.value++;
 } else {
 currentStockIndex.value = 0;
 }
};

const prevStockItem = () => {
 if (currentStockIndex.value > 0) {
 currentStockIndex.value--;
 } else {
 currentStockIndex.value = lowStockProducts.value.length - 1;
 }
};

// Chart Logic
const chartDataComputed = computed(() => {
  const labels = stats.chartData.map(d => {
    const date = new Date(d.date);
    return date.getDate() + '/' + (date.getMonth() + 1);
  });
  
  const data = stats.chartData.map(d => d.amount);

  return {
    labels: labels.length > 0 ? labels : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: "Chiffre d'affaires (HTG)",
        backgroundColor: 'rgba(37, 99, 235, 0.04)',
        borderColor: '#2563eb',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#2563eb',
        pointHoverBackgroundColor: '#2563eb',
        pointHoverBorderColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        fill: true,
        tension: 0.35,
        data: data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0]
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: '#1e293b',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 10,
      borderRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label = '';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('fr-HT', { style: 'currency', currency: 'HTG', maximumFractionDigits: 0 }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#94a3b8',
        font: {
          size: 10,
          family: 'Inter'
        }
      }
    },
    y: {
      grid: {
        color: '#f1f5f9'
      },
      ticks: {
        color: '#94a3b8',
        font: {
          size: 10,
          family: 'Inter'
        },
        callback: function(value: any) {
          if (value >= 1000) {
            return (value / 1000) + 'k';
          }
          return value;
        }
      }
    }
  }
};

const points = computed(() => {
 if (!stats.chartData || stats.chartData.length === 0) return [];

 const data = stats.chartData;
 const maxVal = Math.max(...data.map(d => d.amount)) || 100; // avoid div by 0
 
 // Normalize to 0-100 x, 0-50 y (SVG viewbox)
 // We want some padding on top (e.g. 50 * 0.9)
 const height = 50; 
 const width = 100;

 return data.map((d, i) => ({
 x: (i / (data.length - 1 || 1)) * width,
 y: height - ((d.amount / maxVal) * height * 0.8), // *0.8 to leave top padding
 amount: d.amount,
 date: new Date(d.date).getDate() + '/' + (new Date(d.date).getMonth() + 1)
 }));
});

const linePath = computed(() => {
 if (points.value.length === 0) return '';
 const pts = points.value;
 const first = pts[0];
 if (!first) return '';
 
 // Simple line: M x1 y1 L x2 y2 ...
 return `M ${first.x} ${first.y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
});

const areaPath = computed(() => {
 if (points.value.length === 0) return '';
 const pts = points.value;
 const first = pts[0];
 const last = pts[pts.length - 1];
 
 if (!first || !last) return '';
 
 // Close the path: LinePath -> L right-bottom -> L left-bottom -> Z
 const line = linePath.value;
 return `${line} L ${last.x} 50 L ${first.x} 50 Z`;
});


const fetchData = async () => {
    loading.value = true;
    
    // Reset local stats to avoid stale data
    stats.sales = 0;
    stats.orders = 0;
    stats.todaySales = 0;
    stats.todayOrders = 0;
    stats.netSales = 0;
    stats.totalDeposits = 0;
    stats.chartData = [];
    payoutSummary.value = { totalPaid: 0, pendingValue: 0 };
    
    try {
        // Step 1: Fetch store info first (to check status) - Adding timestamp to bypass cache
        const storeRes = await api.get('/vendors/me', { params: { _t: Date.now() } });
        Object.assign(store, storeRes.data);

        // Step 2: Parallel fetch for financial and operational data
        // This ensures balances are calculated with all data points at once
        if (store.status === 'active') {
            const [statsRes, payoutsRes, ordersRes, productsRes] = await Promise.all([
                api.get('/vendors/me/stats'),
                api.get('/vendors/me/payouts'),
                api.get('/vendors/me/orders', { params: { limit: 5 }}),
                api.get('/vendors/me/products', { params: { page: 1, limit: 10 }})
            ]);

            // Single update block to prevent reactive "flickering"
            Object.assign(stats, statsRes.data);
            
            if (payoutsRes.data?.summary) {
                payoutSummary.value = payoutsRes.data.summary;
            }

            recentOrders.value = ordersRes.data.orders || [];
            
            if (productsRes.data.products) {
                products.value = productsRes.data.products;
                productPagination.value = productsRes.data.pagination;
            } else {
                products.value = productsRes.data;
            }
            
            if (!store.settings?.shipping?.setupCompleted) {
                showShippingOnboardingModal.value = true;
            }
        }
        
        // Final polish - Ensure stats properties exist
        if (stats.sales === undefined) stats.sales = 0;
        if (stats.orders === undefined) stats.orders = 0;

    } catch (e) {
        console.error("Error fetching dashboard data", e);
    } finally {
        loading.value = false;
    }
};

const fetchRecentOrders = async () => {
 if (store.status !== 'active') return;
 try {
 const res = await api.get('/vendors/me/orders', { params: { limit: 5 }});
 recentOrders.value = res.data.orders || [];
 } catch (e) {
 console.error("Error fetching recent orders", e);
 }
}


const fetchProducts = async (page = 1) => {
 if (store.status !== 'active') return;
 try {
 const productsRes = await api.get('/vendors/me/products', {
 params: {
 page,
 limit: 10,
 search: productSearch.value || undefined
 }
 });
 
 if (productsRes.data.products) {
 products.value = productsRes.data.products;
 productPagination.value = productsRes.data.pagination;
 } else {
 // Fallback for older API or direct array return
 products.value = productsRes.data;
 }
 } catch (e) {
 console.error("Error fetching products", e);
 }
};

const fetchPayouts = async () => {
 if (store.status !== 'active') return;
 try {
 const res = await api.get('/vendors/me/payouts');
 if (res.data && res.data.summary) {
 payoutSummary.value = res.data.summary;
 }
 } catch (e) {
 console.error("Error fetching payouts", e);
 }
};

const handleWithdraw = async () => {
 if (withdrawForm.amount <= 0) {
 uiStore.showToast("Veuillez entrer un montant valide", "warning");
 return;
 }
 if (withdrawForm.amount > availableBalance.value) {
 uiStore.showToast("Solde insuffisant", "warning");
 return;
 }
 if (!withdrawForm.phone || !withdrawForm.accountName) {
 uiStore.showToast("Veuillez remplir vos informations de retrait", "warning");
 return;
 }
 
 try {
 withdrawing.value = true;
 // In a real app, we might want to save these settings to the vendor profile too
 await api.post('/vendors/me/payouts', withdrawForm);
 showWithdrawModal.value = false;
 withdrawForm.amount = 0;
 // Refresh data
 await fetchData();
 uiStore.showToast("Votre demande de retrait a été envoyée avec succès !", "success");
 } catch (e: any) {
 uiStore.showToast(e.response?.data?.message || "Erreur lors du retrait", "error");
 } finally {
 withdrawing.value = false;
 }
};

const handleProductSearch = () => {
 if (productSearchTimeout.value) clearTimeout(productSearchTimeout.value);
 productSearchTimeout.value = setTimeout(() => {
 productPagination.value.page = 1;
 fetchProducts(1);
 }, 500);
};

const clearProductSearch = () => {
 productSearch.value = '';
 handleProductSearch();
};

const changeProductPage = (newPage: number) => {
 if (newPage >= 1 && newPage <= productPagination.value.totalPages) {
 fetchProducts(newPage);
 }
};

onMounted(() => {
 fetchData();
});

const formatPrice = (price: number) => {
 return new Intl.NumberFormat('fr-HT', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
};

const formatDate = (date: string) => {
 return new Date(date).toLocaleDateString('fr-FR', {
 day: 'numeric',
 month: 'short'
 });
};


const navigateToAddProduct = () => {
 router.push('/seller/products/new');
};

const shareDeliveryScanner = async () => {
  try {
    const response = await api.post('/delivery/session');
    if (response.data && response.data.token) {
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/delivery/scan?session=${response.data.token}`;
      
      const message = `Bonjour! Voici le lien de mon scanner de livraison pour la boutique (${response.data.storeName}). Ce lien est valable pendant 12 heures pour valider mes commandes :\n\n${shareUrl}`;
      
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      uiStore.showToast("Lien de livraison WhatsApp généré !", "success");
    }
  } catch (error: any) {
    console.error("Erreur de génération de session de livraison", error);
    uiStore.showToast("Échec de la génération du lien de livraison.", "error");
  }
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
