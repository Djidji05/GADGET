import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Accueil - HTFasil' },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: { title: 'Produits - HTFasil' },
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      meta: { title: 'Détail Produit - HTFasil' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: { title: 'Panier - HTFasil' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: {
        title: 'Commande - HTFasil',
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { title: 'Connexion - HTFasil', guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { title: 'Inscription - HTFasil', guestOnly: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/auth/ForgotPasswordView.vue'),
      meta: { title: 'Mot de passe oublié - HTFasil', guestOnly: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/auth/ResetPasswordView.vue'),
      meta: { title: 'Réinitialisation mot de passe - HTFasil', guestOnly: true },
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('../views/auth/AuthCallback.vue'),
      meta: { title: 'Connexion... - HTFasil', guestOnly: true },
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: {
        title: 'Mon Compte - HTFasil',
        requiresAuth: true,
        hideNavSearch: true,
      },
    },
    {
      path: '/account/history',
      name: 'browsing-history',
      component: () => import('../views/Account/HistoryView.vue'),
      meta: {
        title: 'Historique de navigation - HTFasil',
        requiresAuth: true,
      },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      meta: {
        title: 'Mes Commandes - HTFasil',
        requiresAuth: true,
      },
    },
    {
      path: '/orders/:id',
      name: 'order-detail',
      component: () => import('../views/OrderDetailView.vue'),
      meta: {
        title: 'Détail Commande - HTFasil',
        requiresAuth: true,
      },
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('../views/WishlistView.vue'),
      meta: {
        title: "Liste d'envies - HTFasil",
        requiresAuth: true,
      },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue'),
      meta: {
        title: 'Notifications - HTFasil',
        requiresAuth: true,
      },
    },
    {
      path: '/addresses',
      name: 'addresses',
      component: () => import('../views/AddressesView.vue'),
      meta: {
        title: 'Mes Adresses - HTFasil',
        requiresAuth: true,
        hideNavSearch: true,
        hideBottomNav: true
      },
    },
    {
      path: '/promotions',
      name: 'promotions',
      component: () => import('../views/PromotionsView.vue'),
      meta: { title: 'Promotions - HTFasil' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: { title: 'Contact - HTFasil', hideBottomNav: true, hideNavSearch: true },
    },
    {
      path: '/report-issue',
      name: 'report-issue',
      component: () => import('../views/ContactView.vue'),
      meta: { title: 'Signaler un problème - HTFasil', hideBottomNav: true, hideNavSearch: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'À Propos - HTFasil', hideBottomNav: true, hideNavSearch: true },
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue'),
      meta: { title: 'FAQ - HTFasil', hideBottomNav: true, hideNavSearch: true },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue'),
      meta: { title: 'Confidentialité - HTFasil', hideBottomNav: true, hideNavSearch: true },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue'),
      meta: { title: 'Conditions - HTFasil', hideBottomNav: true, hideNavSearch: true },
    },
    {
      path: '/sitemap',
      name: 'sitemap',
      component: () => import('../views/SitemapView.vue'),
      meta: { title: 'Plan du site - HTFasil', hideBottomNav: true, hideNavSearch: true },
    },
    {
      path: '/shipping',
      name: 'shipping',
      component: () => import('../views/ShippingView.vue'),
      meta: { title: 'Livraison - HTFasil', hideBottomNav: true, hideNavSearch: true },
    },
    {
      path: '/returns',
      name: 'returns',
      component: () => import('../views/ReturnsView.vue'),
      meta: { title: 'Retours - HTFasil', hideBottomNav: true, hideNavSearch: true },
    },
    {
      path: '/warranty',
      name: 'warranty',
      component: () => import('../views/WarrantyView.vue'),
      meta: { title: 'Garantie - HTFasil', hideBottomNav: true, hideNavSearch: true },
    },
    {
      path: '/payment/success',
      name: 'payment-success',
      component: () => import('../views/payment/PaymentSuccessView.vue'),
      meta: { title: 'Paiement Réussi - HTFasil' },
    },
    {
      path: '/payment/cancelled',
      name: 'payment-cancelled',
      component: () => import('../views/payment/PaymentCancelledView.vue'),
      meta: { title: 'Paiement Annulé - HTFasil' },
    },
    {
      path: '/become-seller',
      name: 'become-seller',
      component: () => import('../views/BecomeSeller.vue'),
      meta: {
        title: 'Devenir Vendeur - HTFasil',
        requiresAuth: true
      },
    },
    {
      path: '/seller/dashboard',
      name: 'seller-dashboard',
      component: () => import('../views/Seller/Dashboard.vue'),
      meta: {
        title: 'Tableau de Bord Vendeur - HTFasil',
        requiresAuth: true
      },
    },
    {
      path: '/seller/products',
      name: 'seller-products',
      component: () => import('../views/Seller/Products.vue'),
      meta: {
        title: 'Mes Produits - HTFasil',
        requiresAuth: true
      },
    },
    {
      path: '/seller/products/new',
      name: 'seller-add-product',
      component: () => import('../views/Seller/AddProduct.vue'),
      meta: {
        title: 'Ajouter un Produit - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      },
    },
    {
      path: '/seller/products/edit/:id',
      name: 'seller-edit-product',
      component: () => import('../views/Seller/AddProduct.vue'),
      meta: {
        title: 'Modifier un Produit - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      },
    },
    {
      path: '/seller/orders',
      name: 'seller-orders',
      component: () => import('../views/Seller/Orders.vue'),
      meta: {
        title: 'Commandes Vendeur - HTFasil',
        requiresAuth: true
      }
    },
    {
      path: '/seller/orders/:id',
      name: 'seller-order-detail',
      component: () => import('../views/Seller/OrderDetail.vue'),
      meta: {
        title: 'Détail Commande - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/reports',
      name: 'seller-reports',
      component: () => import('../views/Seller/Reports.vue'),
      meta: {
        title: 'Rapports Vendeur - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/transactions',
      name: 'seller-transactions',
      component: () => import('../views/Seller/Transactions.vue'),
      meta: {
        title: 'Transactions Vendeur - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/payments',
      name: 'seller-payments',
      component: () => import('../views/Seller/Payments.vue'),
      meta: {
        title: 'Paiements Vendeur - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/deposits',
      name: 'seller-deposits',
      component: () => import('../views/Seller/Deposits.vue'),
      meta: {
        title: 'Dépôts Vendeur - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/settings',
      name: 'seller-settings',
      component: () => import('../views/Seller/Settings.vue'),
      meta: {
        title: 'Paramètres Vendeur - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/notifications',
      name: 'seller-notifications',
      component: () => import('../views/Seller/Notifications.vue'),
      meta: {
        title: 'Notifications Vendeur - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/messages',
      name: 'seller-messages',
      component: () => import('../views/Seller/Messages.vue'),
      meta: {
        title: 'Messages Vendeur - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/my-qr',
      name: 'seller-my-qr',
      component: () => import('../views/Seller/MyQR.vue'),
      meta: {
        title: 'Mon QR Code - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/academy',
      name: 'seller-academy',
      component: () => import('../views/Seller/SellerAcademy.vue'),
      meta: {
        title: 'Académie Vendeur - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/ambassador',
      name: 'seller-ambassador',
      component: () => import('../views/Ambassador/Dashboard.vue'),
      meta: {
        title: 'Ambassadeur Vendeur - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/help',
      name: 'seller-help',
      component: () => import('../views/Seller/SellerHelp.vue'),
      meta: {
        title: "Centre d'Aide - HTFasil",
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/boost',
      name: 'seller-boost',
      component: () => import('../views/Seller/SellerBoost.vue'),
      meta: {
        title: 'Booster Visibilité - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/community',
      name: 'seller-community',
      component: () => import('../views/Seller/SellerCommunity.vue'),
      meta: {
        title: 'Communauté Vendeur - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/trust',
      name: 'seller-trust',
      component: () => import('../views/Seller/SellerTrust.vue'),
      meta: {
        title: 'Confiance & Sécurité - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/services',
      name: 'seller-services',
      component: () => import('../views/Seller/SellerServices.vue'),
      meta: {
        title: 'Nos Services Vendeur - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/seller/promotions',
      name: 'seller-promotions',
      component: () => import('../views/Seller/Promotions.vue'),
      meta: {
        title: 'Mes Promotions - HTFasil',
        requiresAuth: true,
        hideBottomNav: true
      }
    },
    {
      path: '/store/:id',
      name: 'store-view',
      component: () => import('../views/StoreView.vue'),
      meta: { title: 'Boutique - HTFasil', hideNavSearch: true },
    },
    {
      path: '/maintenance',
      name: 'maintenance',
      component: () => import('../views/MaintenanceView.vue'),
      meta: { title: 'Maintenance en cours - HTFasil', hideBottomNav: true, hideNavSearch: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Page Non Trouvée - HTFasil' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

import { useUiStore } from '@/stores/ui'
import { useSettingsStore } from '@/stores/settings'

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const uiStore = useUiStore()
  const settingsStore = useSettingsStore()

  // Ensure settings are loaded on first navigation to protect the whole site
  if (!settingsStore.general.isLoaded) {
    await settingsStore.fetchGeneralSettings()
  }

  // Check Maintenance Mode (Only visible to non-admins and if route is not login/admin pages)
  const isMaintenanceActive = settingsStore.general.maintenance_mode === 'true'
  const isAccessibleInMaintenance = to.name === 'maintenance' || to.name === 'login' || to.name === 'auth-callback'
  const isAdmin = authStore.user?.role === 'admin' || authStore.user?.role === 'gestionnaire'

  if (isMaintenanceActive && !isAccessibleInMaintenance && !isAdmin) {
    // If we're not an admin, force maintenance page
    return next({ name: 'maintenance' })
  }

  // Optional: Redirect away from maintenance if mode is disabled
  if (!isMaintenanceActive && to.name === 'maintenance') {
    return next({ name: 'home' })
  }

  // Track previous route name
  if (from.name) {
    uiStore.previousRouteName = from.name as string
  }

  // Update page title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
