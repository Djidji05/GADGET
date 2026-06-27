<template>
  <div class="container mx-auto px-4 pt-16 md:pt-20 pb-32">
    <!-- 1. Informations utilisateur (Profil) - En haut de la page -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-950/20 rounded-full transform translate-x-10 -translate-y-10 blur-2xl"></div>
      
      <div class="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <!-- Photo de profil (avatar) -->
        <div class="relative group">
          <div class="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-md overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.customer?.firstName || 'U')}&background=random&size=128`"
              alt="Profile"
              class="w-full h-full object-cover"
            />
          </div>
          <button class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors">
            <i class="fas fa-camera text-xs"></i>
          </button>
        </div>

        <div class="text-center md:text-left flex-1">
          <!-- Nom et prénom -->
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ authStore.customer?.firstName }} {{ authStore.customer?.lastName }}
          </h1>
          
          <!-- Adresse e-mail -->
          <p class="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-1">
            <i class="far fa-envelope"></i>
            {{ authStore.customer?.email }}
          </p>

          <!-- Bouton Modifier le profil -->
          <div class="mt-4">
             <button @click="openProfileEdit" class="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 text-sm flex items-center justify-center md:justify-start gap-1">
                <i class="far fa-edit"></i> {{ $t('account.profile_modal_title') }}
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <!-- 2. Sécurité & connexion -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="p-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
             <i class="fas fa-shield-alt"></i>
           </div>
           <h2 class="font-bold text-gray-900 dark:text-white">{{ $t('account.security_settings') }}</h2>
        </div>
        <div class="p-2">
           <button @click="openPasswordChange" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.change_password') }}</span>
              <i class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
           </button>
           <button @click="openConnections" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.connection_methods') }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">Email, Google</span>
           </button>
           <button @click="open2FA" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.two_fa') }}</span>
              <span class="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded">
                {{ authStore.customer?.two_factor_enabled ? $t('account.status_open') : $t('account.status_closed') }}
              </span>
           </button>
           <div class="p-2 mt-2 border-t border-gray-50 dark:border-gray-800">
             <button @click="handleLogout" class="w-full py-2 text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                <i class="fas fa-sign-out-alt"></i> {{ $t('account.logout_btn') }}
             </button>
           </div>
        </div>
      </div>

      <!-- 3. Commandes / Activités -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="p-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
             <i class="fas fa-box"></i>
           </div>
           <h2 class="font-bold text-gray-900 dark:text-white">{{ $t('account.orders_activities') }}</h2>
        </div>
        <div class="p-2">
           <router-link to="/orders" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.my_orders') }}</span>
              <span class="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[10px] flex items-center justify-center font-bold" v-if="ordersCount > 0">{{ ordersCount }}</span>
              <i class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs" v-else></i>
           </router-link>
           <button @click="openTracking" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.delivery_tracking') }}</span>
              <i class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
           </button>
           <button @click="openPaymentHistory" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.payment_history_title') }}</span>
              <i class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
           </button>
        </div>
      </div>

      <!-- 4. Paiement -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="p-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
             <i class="fas fa-credit-card"></i>
           </div>
           <h2 class="font-bold text-gray-900 dark:text-white">{{ $t('account.payment_methods') }}</h2>
        </div>
        <div class="p-2">
           <button @click="openPaymentAdd" class="w-full py-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors flex items-center justify-center gap-2">
              <i class="fas fa-plus"></i> {{ $t('account.add_payment') }}
           </button>
        </div>
      </div>

      <!-- 5. Adresses -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="p-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
             <i class="fas fa-map-marker-alt"></i>
           </div>
           <h2 class="font-bold text-gray-900 dark:text-white">{{ $t('account.addresses') }}</h2>
        </div>
        <div class="p-2">
           <router-link to="/addresses" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.addresses') }}</span>
              <i class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
           </router-link>
           <router-link to="/addresses" class="w-full py-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors flex items-center justify-center gap-2">
              <i class="fas fa-plus"></i> {{ $t('account.add_address') }}
           </router-link>
        </div>
      </div>

       <!-- 6. Préférences -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="p-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
             <i class="fas fa-cog"></i>
           </div>
           <h2 class="font-bold text-gray-900 dark:text-white">{{ $t('account.pref_notifications') }}</h2>
        </div>
        <div class="p-2 space-y-1">
           <button class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.language') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $i18n.locale === 'fr' ? 'Français' : 'Kreyòl' }}</span>
           </button>
           <button @click="openNotifications" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.pref_notifications') }}</span>
              <i class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
           </button>
        </div>
      </div>

       <!-- 7. Aide & support -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="p-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
             <i class="fas fa-life-ring"></i>
           </div>
           <h2 class="font-bold text-gray-900 dark:text-white">{{ $t('account.help_support') }}</h2>
        </div>
        <div class="p-2">
           <router-link to="/faq" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.help_center') }}</span>
              <i class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
           </router-link>
           <router-link to="/contact" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.contact_support') }}</span>
              <i class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
           </router-link>
           <router-link to="/report-issue" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.report_problem_action') }}</span>
              <i class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
           </router-link>
        </div>
      </div>

       <!-- 8. Informations légales -->
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div class="p-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/50 flex items-center gap-3">
           <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center">
             <i class="fas fa-file-alt"></i>
           </div>
           <h2 class="font-bold text-gray-900 dark:text-white">{{ $t('account.legal_info') }}</h2>
        </div>
        <div class="p-2">
           <router-link to="/terms" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.terms_of_use') }}</span>
              <i class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
           </router-link>
           <router-link to="/privacy" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left text-gray-700 dark:text-gray-300">
              <span>{{ $t('account.privacy_policy') }}</span>
              <i class="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs"></i>
           </router-link>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Profile Modal -->
    <Modal v-model:isOpen="showProfileModal" :title="$t('account.profile_modal_title')">
      <form @submit.prevent="saveProfile" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('checkout.firstname') }}</label>
            <Input v-model="profileForm.firstName" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('checkout.lastname') }}</label>
            <Input v-model="profileForm.lastName" required />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <Input v-model="profileForm.email" type="email" required />
          </div>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showProfileModal = false" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">{{ $t('common.cancel') }}</button>
          <button @click="saveProfile" :disabled="isSavingProfile" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">{{ $t('common.save') }}</button>
        </div>
      </template>
    </Modal>

    <!-- Tracking Modal -->
    <Modal v-model:isOpen="showTrackingModal" :title="$t('account.delivery_tracking')">
       <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-400 text-sm">{{ $t('account.tracking_hint') }}</p>
          <div class="flex gap-2">
             <Input v-model="trackingId" :placeholder="$t('account.tracking_placeholder')" class="flex-1" />
             <button @click="trackOrder" class="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700">{{ $t('account.follow_order') }}</button>
          </div>
          <div v-if="trackedOrder" class="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
             <div class="flex justify-between items-center mb-2">
                <h4 class="font-bold text-blue-900 dark:text-blue-400">{{ $t('account.order') }} {{ trackedOrder.orderNumber }}</h4>
                <span :class="['px-2 py-0.5 rounded-full text-[10px] uppercase font-bold', trackedOrder.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400']">
                   {{ trackedOrder.status }}
                </span>
             </div>
             <p class="text-sm text-blue-800 dark:text-blue-300">Status: {{ trackedStatus }}</p>
          </div>
          <div v-else-if="isTracking" class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg flex flex-col items-center justify-center">
             <i class="fas fa-spinner fa-spin text-blue-500 text-2xl mb-2"></i>
          </div>
       </div>
    </Modal>

    <!-- Payment History Modal -->
    <Modal v-model:isOpen="showPaymentHistoryModal" :title="$t('account.payment_history_title')">
       <div class="space-y-2">
          <div v-if="paymentHistory.length === 0" class="py-12 text-center text-gray-500 dark:text-gray-400">
             <i class="fas fa-receipt text-3xl mb-2 block"></i>
             {{ $t('account.history_empty') }}
          </div>
          <div v-for="payment in paymentHistory" :key="payment.id" class="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
             <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ payment.amount }} HTG</div>
                <div class="text-[10px] text-gray-500 dark:text-gray-400">{{ payment.date }} • {{ payment.method }}</div>
             </div>
             <span :class="['px-2 py-1 text-[10px] rounded-full font-bold uppercase', payment.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400']">{{ payment.status }}</span>
          </div>
       </div>
    </Modal>

    <!-- Notifications Modal -->
    <Modal v-model:isOpen="showNotificationsModal" :title="$t('account.pref_notifications')">
       <div class="space-y-6">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('account.notif_settings_desc') }}</p>
          
          <div class="space-y-4">
             <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div class="flex items-center gap-3">
                   <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <i class="far fa-envelope"></i>
                   </div>
                   <div>
                      <div class="font-bold text-gray-900 dark:text-white">{{ $t('account.notif_email_title') }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ $t('account.notif_email_desc') }}</div>
                   </div>
                </div>
                <input type="checkbox" v-model="notifForm.notif_email" class="w-6 h-6 rounded border-gray-300 dark:border-gray-700 bg-transparent text-blue-600 focus:ring-blue-500" />
             </div>

             <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div class="flex items-center gap-3">
                   <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <i class="far fa-bell"></i>
                   </div>
                   <div>
                      <div class="font-bold text-gray-900 dark:text-white">{{ $t('account.notif_push_title') }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ $t('account.notif_push_desc') }}</div>
                   </div>
                </div>
                <input type="checkbox" v-model="notifForm.notif_push" class="w-6 h-6 rounded border-gray-300 dark:border-gray-700 bg-transparent text-blue-600 focus:ring-blue-500" />
             </div>

             <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div class="flex items-center gap-3">
                   <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                      <i class="fas fa-sms"></i>
                   </div>
                   <div>
                      <div class="font-bold text-gray-900 dark:text-white">{{ $t('account.notif_sms_title') }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ $t('account.notif_sms_desc') }}</div>
                   </div>
                </div>
                <input type="checkbox" v-model="notifForm.notif_sms" class="w-6 h-6 rounded border-gray-300 dark:border-gray-700 bg-transparent text-blue-600 focus:ring-blue-500" />
             </div>
          </div>
       </div>
       <template #footer>
          <div class="flex justify-end gap-3">
             <button @click="showNotificationsModal = false" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">{{ $t('common.cancel') }}</button>
             <button @click="saveNotifSettings" :disabled="isSavingNotifs" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {{ isSavingNotifs ? $t('common.loading') : $t('common.save') }}
             </button>
          </div>
       </template>
     </Modal>

    <!-- 2FA Modal -->
    <Modal v-model:isOpen="show2FAModal" :title="authStore.customer?.two_factor_enabled ? $t('account.two_fa_disable_title') : $t('account.two_fa_enable_title')">
       <div class="space-y-4">
          <!-- State: Enable (Verify Code) -->
          <div v-if="!authStore.customer?.two_factor_enabled">
             <div v-if="!faSetupPending" class="text-center py-4">
                <i class="fas fa-shield-alt text-4xl text-blue-500 mb-3 block"></i>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">{{ $t('account.two_fa_desc') }}</p>
                <button @click="start2FASetup" :disabled="authStore.isLoading" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full">
                   {{ authStore.isLoading ? $t('account.two_fa_sending') : $t('account.two_fa_start') }}
                </button>
             </div>
             <div v-else class="space-y-4">
                <p class="text-sm text-gray-600 dark:text-gray-400" v-html="$t('account.two_fa_code_sent', { email: authStore.customer?.email })"></p>
                <Input v-model="faCode" :placeholder="$t('account.two_fa_placeholder')" maxlength="6" class="text-center text-2xl tracking-widest" />
                <button @click="confirmEnable2FA" :disabled="!faCode || authStore.isLoading" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full uppercase font-bold">
                   {{ authStore.isLoading ? $t('account.two_fa_verifying') : $t('account.two_fa_enable_btn') }}
                </button>
             </div>
          </div>

          <!-- State: Disable (Verify Password) -->
          <div v-else class="space-y-4">
             <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('account.two_fa_disable_desc') }}</p>
             <Input v-model="faPassword" type="password" :placeholder="$t('account.two_fa_password_ph')" />
             <button @click="confirmDisable2FA" :disabled="!faPassword || authStore.isLoading" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 w-full">
               {{ authStore.isLoading ? $t('account.two_fa_disabling') : $t('account.two_fa_disable_btn') }}
             </button>
          </div>
       </div>
    </Modal>
    <Modal v-model:isOpen="showConnectionsModal" title="Connexions"></Modal>
    <Modal v-model:isOpen="showPaymentModal" title="Moyens de paiement"></Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { ordersService } from '@/services/orders'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const uiStore = useUiStore()

const ordersCount = ref(0)
const paymentHistory = ref<any[]>([])
const trackedOrder = ref<any>(null)
const trackedStatus = ref('')
const isTracking = ref(false)
const isSavingProfile = ref(false)
const trackingId = ref('')

const showProfileModal = ref(false)
const showPaymentModal = ref(false)
const showPasswordModal = ref(false)
const showNotificationsModal = ref(false)
const showTrackingModal = ref(false)
const showPaymentHistoryModal = ref(false)
const show2FAModal = ref(false)
const showConnectionsModal = ref(false)

const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

onMounted(async () => {
  try {
    const orders = await ordersService.getCustomerOrders()
    ordersCount.value = orders.length
  } catch (error) {
    console.error('Error fetching orders count:', error)
  }
})

const openProfileEdit = () => {
  if (authStore.customer) {
    profileForm.value = {
      firstName: authStore.customer.firstName || '',
      lastName: authStore.customer.lastName || '',
      email: authStore.customer.email || '',
      phone: authStore.customer.phone || ''
    }
    showProfileModal.value = true
  }
}

const saveProfile = async () => {
  try {
    isSavingProfile.value = true
    await authStore.updateProfile(profileForm.value)
    showProfileModal.value = false
    uiStore.showToast(t('account.save_success'), 'success')
  } catch (error) {
    uiStore.showToast(t('account.save_error'), 'error')
  } finally {
    isSavingProfile.value = false
  }
}

const notifForm = ref({
  notif_email: true,
  notif_push: true,
  notif_sms: false
})
const isSavingNotifs = ref(false)

const openNotifications = () => {
  if (authStore.customer) {
    notifForm.value = {
      notif_email: (authStore.customer as any).notif_email ?? true,
      notif_push: (authStore.customer as any).notif_push ?? true,
      notif_sms: (authStore.customer as any).notif_sms ?? false
    }
    showNotificationsModal.value = true
  }
}

const saveNotifSettings = async () => {
  try {
    isSavingNotifs.value = true
    await authStore.updateProfile(notifForm.value)
    showNotificationsModal.value = false
    uiStore.showToast(t('account.notif_success'), 'success')
  } catch (err) {
    uiStore.showToast(t('account.notif_error'), 'error')
  } finally {
    isSavingNotifs.value = false
  }
}

const openTracking = () => {
  showTrackingModal.value = true
}

const trackOrder = async () => {
  if (!trackingId.value) return
  try {
    isTracking.value = true
    const order = await ordersService.trackOrder(trackingId.value)
    trackedOrder.value = order
    const statuses: any = {
      'pending': t('account.status_pending'),
      'confirmed': t('account.status_paid'),
      'processing': t('account.status_processing'),
      'shipped': t('account.status_shipped'),
      'delivered': t('account.status_delivered'),
      'cancelled': t('account.status_cancelled')
    }
    trackedStatus.value = statuses[order.status] || order.status
  } catch (error) {
    uiStore.showToast(t('account.tracking_not_found'), 'error')
  } finally {
    isTracking.value = false
  }
}

const openPaymentHistory = async () => {
  try {
    const orders = await ordersService.getCustomerOrders()
    paymentHistory.value = orders.map(o => ({
      id: o.id,
      date: new Date(o.createdAt).toLocaleDateString(),
      amount: o.total,
      status: ['confirmed', 'processing', 'shipped', 'delivered'].includes(o.status) ? 'completed' : 'pending',
      method: typeof o.paymentMethod === 'string' ? o.paymentMethod : (o.paymentMethod as any)?.type || 'Carte'
    }))
    showPaymentHistoryModal.value = true
  } catch (error) {
    uiStore.showToast(t('common.error'), 'error')
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const faSetupPending = ref(false)
const faCode = ref('')
const faPassword = ref('')

const start2FASetup = async () => {
  try {
    await authStore.setup2FA()
    faSetupPending.value = true
    uiStore.showToast(t('nav.notifications'), 'info')
  } catch (err) {
    uiStore.showToast(t('common.error'), 'error')
  }
}

const confirmEnable2FA = async () => {
  try {
    await authStore.verifyEnable2FA(faCode.value)
    show2FAModal.value = false
    faSetupPending.value = false
    faCode.value = ''
    uiStore.showToast(t('account.two_fa_success'), 'success')
  } catch (err) {
    uiStore.showToast(t('account.two_fa_error'), 'error')
  }
}

const confirmDisable2FA = async () => {
  try {
    await authStore.disable2FA(faPassword.value)
    show2FAModal.value = false
    faPassword.value = ''
    uiStore.showToast(t('account.two_fa_disabled_msg'), 'info')
  } catch (err) {
    uiStore.showToast(t('account.two_fa_pass_error'), 'error')
  }
}

const openPasswordChange = () => showPasswordModal.value = true
const open2FA = () => {
  faSetupPending.value = false
  faCode.value = ''
  faPassword.value = ''
  show2FAModal.value = true
}
const openConnections = () => showConnectionsModal.value = true
const openPaymentAdd = () => showPaymentModal.value = true

</script>
