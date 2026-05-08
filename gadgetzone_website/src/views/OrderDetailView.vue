<template>
<div class="bg-gray-50 min-h-screen pt-4 pb-12">
 <div class="container mx-auto px-4 lg:px-8">
 
 <!-- Loading State -->
 <div v-if="isLoading" class="animate-pulse max-w-6xl mx-auto">
 <div class="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
 <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8">
 <div class="h-8 bg-gray-200 rounded w-1/2"></div>
 <div class="space-y-4">
 <div class="h-16 bg-gray-100 rounded"></div>
 <div class="h-16 bg-gray-100 rounded"></div>
 </div>
 </div>
 </div>

 <!-- Order Content -->
 <div v-else-if="order" class="max-w-6xl mx-auto">
 
 <!-- Header Section -->
 <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
 <div>
 <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
 <router-link to="/orders" class="hover:text-blue-600 transition-colors">{{ $t('account.my_orders') }}</router-link>
 <i class="las la-angle-right text-xs"></i>
 <span>{{ $t('account.view_details') }}</span>
 </div>
 <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
 <button @click="router.back()" class="p-2 -ml-2 hover:bg-gray-100 :bg-gray-800 rounded-xl transition-colors">
 <i class="fas fa-arrow-left text-lg"></i>
 </button>
 {{ $t('account.order') }} <span class="text-blue-600 text-base md:text-lg">{{ formatOrderId(order.orderNumber || order.id) }}</span>
 </h1>
 <p class="text-gray-500 mt-1">{{ $t('account.ordered_on') }} {{ formatDate(order.createdAt) }}</p>
 </div>

 <div class="flex items-center gap-3">
 <span :class="getStatusBadgeClass(order.status)" class="px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2">
 <i :class="getStatusIcon(order.status)"></i>
 {{ getStatusLabel(order.status) }}
 </span>
 <button v-if="order.status === 'pending'" @click="cancelOrder" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm">
 {{ $t('account.cancel_order_title') }}
 </button>
 </div>
 </div>

 <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
 <!-- Main Content: Products Table -->
 <div class="lg:col-span-2 space-y-8">
 <!-- Invoice Card -->
 <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
 <!-- Invoice Header -->
 <div class="flex items-center justify-between pb-4 border-b border-gray-100 ">
 <span class="text-gray-500 font-medium">{{ $t('account.checkout.order_id') || 'ID Commande' }}</span>
 <span class="text-sm text-gray-500 font-mono">{{ formatOrderId(order.orderNumber || order.id) }}</span>
 </div>

 <!-- Invoice Items Query -->
 <div class="p-0">
 <table class="w-full text-left">
 <thead>
 <tr class="border-b border-gray-100 text-xs uppercase text-gray-400 font-semibold tracking-wider">
 <th class="px-8 py-4 w-1/2">{{ $t('account.description') }}</th>
 <th class="px-4 py-4 text-center">{{ $t('seller.qty') }}</th>
 <th class="px-4 py-4 text-right">{{ $t('account.unit_price') }}</th>
 <th class="px-8 py-4 text-right">{{ $t('account.amount') }}</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-gray-50">
 <tr v-for="item in order.items" :key="item.id" class="hover:bg-gray-50/30">
 <td class="px-8 py-4">
 <div class="flex items-center gap-4">
 <!-- Optional: Small thumbnail for invoice feel, or remove for strict text only -->
 <div class="w-10 h-10 bg-gray-50 rounded border border-gray-100 flex-shrink-0 flex items-center justify-center">
 <img :src="item.product.image_url || '/placeholder-product.jpg'" class="w-full h-full object-contain mix-blend-multiply" :alt="item.product.name">
 </div>
 <div>
 <p class="font-bold text-gray-900 text-sm">{{ item.product.name }}</p>
 <button 
 v-if="order.status === 'delivered'" 
 @click="openReviewModal(item.product)" 
 class="text-xs text-blue-600 font-medium hover:text-blue-700 mt-1 flex items-center gap-1"
 >
 <i class="las la-star"></i> {{ $t('account.leave_review') }}
 </button>
 </div>
 </div>
 </td>
 <td class="px-4 py-4 text-center text-sm text-gray-600">
 {{ item.quantity }}
 </td>
 <td class="px-4 py-4 text-right text-sm text-gray-600">
 {{ formatPrice(item.unitPrice) }}
 </td>
 <td class="px-8 py-4 text-right text-sm font-bold text-gray-900">
 {{ formatPrice(item.unitPrice * item.quantity) }}
 </td>
 </tr>
 </tbody>
 </table>
 </div>

 <!-- Invoice Summary (Integrated) -->
 <div class="bg-gray-50/50 px-8 py-6 border-t border-gray-100">
 <div class="flex flex-col items-end gap-2 text-sm">
 <div class="w-full md:w-1/2 flex justify-between text-gray-500">
 <span>{{ $t('account.checkout.subtotal') }}</span>
 <span class="font-medium text-gray-900">{{ formatPrice(order.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0)) }}</span>
 </div>
 <div class="w-full md:w-1/2 flex justify-between text-gray-500">
 <span>{{ $t('account.checkout.delivery') }}</span>
 <span class="text-gray-900">{{ order.shipping === 0 || !order.shipping ? $t('account.checkout.free').toUpperCase() : formatPrice(order.shipping) }}</span>
 </div>
 <div class="w-full md:w-1/2 flex justify-between text-gray-500">
 <span>{{ $t('checkout.moncash_fee') }}</span>
 <span class="text-gray-900">{{ formatPrice(getMonCashFee(order)) }}</span>
 </div>
 
 <div class="w-full md:w-1/2 border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
 <span class="font-bold text-gray-900 text-base uppercase">{{ $t('account.checkout.total') }}</span>
 <span class="font-bold text-blue-600 text-xl">{{ formatPrice(order.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0) + (order.shipping || 0) + getMonCashFee(order)) }}</span>
 </div>
 </div>
 </div>
 </div>

 <!-- Timeline (Simplified Horizontal) -->
 <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
 <h3 class="font-bold text-lg text-gray-900 mb-8">{{ $t('account.delivery_status') }}</h3>
 <div class="relative">
 <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
 <div class="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full z-0 transition-all duration-1000" :style="{ width: getProgressWidth(order.status) }"></div>
 
 <div class="relative z-10 flex justify-between w-full">
 <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center gap-3">
 <div :class="[
 'w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300',
 isStepActive(order.status, step.id) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
 ]">
 <i :class="step.icon" class="text-xs"></i>
 </div>
 <span :class="[
 'text-xs font-medium',
 isStepActive(order.status, step.id) ? 'text-blue-700 font-bold' : 'text-gray-400'
 ]">{{ $t(step.labelKey) }}</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Sidebar Info -->
 <div class="space-y-6">


 <!-- Shipping Info -->
 <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
 <h3 class="font-bold text-gray-900 mb-4 text-lg">{{ $t('checkout.title') }}</h3>
 <div class="flex items-start gap-4">
 <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
 <i class="las la-map-marker text-xl"></i>
 </div>
 <div>
 <p class="font-bold text-gray-900 text-sm">{{ order.user?.firstName }} {{ order.user?.lastName }}</p>
 <p class="text-gray-500 text-sm mt-1 leading-relaxed">
  {{ order.shippingAddress.street }}<br>
  {{ order.shippingAddress.city }}<br>
  {{ order.shippingAddress.country }}
 </p>
 <p class="text-gray-500 text-sm mt-2 flex items-center gap-2">
 <i class="las la-phone"></i> {{ order.shippingAddress.phone || $t('account.not_provided') }}
 </p>
 </div>
 </div>
 </div>

 <!-- Delivery QR Code -->
 <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-all duration-300">
 <h3 class="font-bold text-gray-900 mb-2 text-lg">{{ $t('account.qr_code_title') }}</h3>
 
 <!-- Active QR State -->
 <div v-if="order.status !== 'delivered' && order.status !== 'cancelled'">
 <p class="text-xs text-gray-500 mb-4 max-w-[200px] mx-auto">{{ $t('account.qr_code_hint') }}</p>
 
  <div class="relative group" v-if="order.deliveryToken">
  <div class="p-3 bg-white rounded-xl border-2 border-dashed border-gray-200 mb-4 inline-block relative overflow-hidden">
  <vue-qrcode ref="qrCodeRef" :value="order.deliveryToken" :options="{ width: 200, margin: 2, color: { dark: '#1e40af', light: '#ffffff' } }" tag="img" class="mix-blend-multiply" />
  </div>
  </div>
  <div v-else class="py-12 flex flex-col items-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <p class="text-xs text-gray-400 mt-2">{{ $t('common.loading') }}</p>
  </div>

 <!-- Actions (Always Visible) -->
 <div class="flex items-center justify-center gap-4 mb-2">
 <button @click="downloadQR" class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-200 active:scale-95 transition-all">
 <i class="las la-download text-lg"></i> {{ $t('account.download') }}
 </button>
 <button @click="shareQR" class="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-100 active:scale-95 transition-all">
 <i class="las la-share-alt text-lg"></i> {{ $t('account.share') }}
 </button>
 </div>

 <div class="text-center mt-4">
 <p class="font-mono text-xs font-bold text-gray-400 tracking-wider">{{ formatOrderId(order.orderNumber || order.id) }}</p>
 <p class="text-[10px] text-gray-400 mt-1">Version {{ new Date().getFullYear() }}</p>
 </div>
 </div>

 <!-- Delivered/Used State -->
 <div v-else-if="order.status === 'delivered'" class="py-4 animate-in fade-in zoom-in">
 <div class="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
 <i class="las la-check-double text-3xl"></i>
 </div>
 <p class="text-sm font-bold text-gray-900 mb-1">{{ $t('account.code_used') }}</p>
 <p class="text-xs text-gray-500 max-w-[200px] mx-auto">{{ $t('account.code_used_hint') }}</p>
 <p class="mt-3 text-xs font-mono text-gray-300">{{ $t('account.delivered_on') }} {{ formatDate(order.delivered_at || new Date().toISOString()) }}</p>
 </div>

 <!-- Cancelled State -->
 <div v-else class="py-4 opacity-50">
 <div class="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
 <i class="las la-ban text-2xl"></i>
 </div>
 <p class="text-sm font-bold text-gray-500">{{ $t('account.order_cancelled') }}</p>
 </div>
 </div>

 <!-- Support -->
 <div class="bg-gray-900 rounded-2xl p-6 text-center text-white relative overflow-hidden group">
 <div class="relative z-10">
 <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
 <i class="las la-headset text-2xl"></i>
 </div>
 <h4 class="font-bold mb-2">{{ $t('account.need_assistance') }}</h4>
 <p class="text-gray-400 text-sm mb-4">{{ $t('account.support_hint') }}</p>
 <router-link to="/contact" class="inline-block w-full py-2.5 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm">
 {{ $t('account.contact_support') }}
 </router-link>
 </div>
 
 <!-- Decor -->
 <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:opacity-30 transition-opacity"></div>
 </div>
 </div>
 </div>
 </div>

 <!-- Not Found -->
 <div v-else class="text-center py-32">
 <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
 <i class="las la-search text-4xl text-gray-300"></i>
 </div>
 <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('account.order_not_found') }}</h3>
 <p class="text-gray-500 mb-8 max-w-md mx-auto">{{ $t('account.order_not_found_hint') }}</p>
 <router-link to="/orders" class="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
 <i class="las la-arrow-left mr-2"></i>
 {{ $t('account.back_to_orders') }}
 </router-link>
 </div>
 </div>

 <!-- Review Modal -->
 <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
 <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
 <div class="p-6 border-b border-gray-100 flex justify-between items-center">
 <h3 class="text-xl font-bold text-gray-900">{{ $t('account.leave_review') }}</h3>
 <button @click="showReviewModal = false" class="text-gray-400 hover:text-gray-600">
 <i class="las la-times text-2xl"></i>
 </button>
 </div>
 <div class="p-6 space-y-6">
 <div v-if="reviewProduct" class="flex items-center gap-4 mb-4">
 <img :src="reviewProduct.image_url || '/placeholder-product.jpg'" class="w-12 h-12 object-cover rounded-lg" :alt="reviewProduct.name">
 <p class="font-medium text-sm text-gray-900 line-clamp-2">{{ reviewProduct.name }}</p>
 </div>
 <div>
 <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.your_rating') }}</label>
 <div class="flex gap-2">
 <button 
 v-for="star in 5" 
 :key="star" 
 @click="newReview.rating = star"
 class="text-3xl focus:outline-none transition-transform hover:scale-110 active:scale-95"
 :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-200'"
 >
 ★
 </button>
 </div>
 </div>
 <div>
 <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('account.your_comment') }}</label>
 <textarea 
 v-model="newReview.comment"
 rows="4"
 class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors"
 :placeholder="$t('products.comment_placeholder')"
 ></textarea>
 </div>
 </div>
 <div class="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
 <button @click="showReviewModal = false" class="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
 {{ $t('common.cancel') }}
 </button>
 <button 
 @click="submitReview" 
 :disabled="isSubmittingReview"
 class="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
 >
 {{ isSubmittingReview ? $t('products.publishing') : $t('account.send_review') }}
 </button>
 </div>
 </div>
 </div>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ordersService } from '@/services/orders'
import type { Order } from '@/services/orders'
import { productsService } from '@/services/products'
import { useUiStore } from '@/stores/ui'
import { formatOrderId } from '@/utils/formatters';

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()
const { t } = useI18n()

// State
const isLoading = ref(false)
const order = ref<Order | null>(null)

// Review State
const showReviewModal = ref(false)
const reviewProduct = ref<any>(null)
const newReview = ref({ rating: 5, comment: '' })
const isSubmittingReview = ref(false)

const openReviewModal = (product: any) => {
 reviewProduct.value = product
 newReview.value = { rating: 5, comment: '' }
 showReviewModal.value = true
}

const submitReview = async () => {
 if (!reviewProduct.value) return
 
 try {
 isSubmittingReview.value = true
 await productsService.addReview({
 product_id: reviewProduct.value.id,
 rating: newReview.value.rating,
 comment: newReview.value.comment
 })
 
 showReviewModal.value = false
 uiStore.showToast(t('products.review_success'), 'success')
 } catch (error: any) {
 console.error('Erreur envoi avis:', error)
 uiStore.showToast(error.response?.data?.error || t('common.error'), 'error')
 } finally {
 isSubmittingReview.value = false
 }
}

// Methods
const loadOrder = async () => {
 try {
 isLoading.value = true
 const orderId = Number(route.params.id)
 order.value = await ordersService.getOrder(orderId)
 } catch (error) {
 console.error('Error loading order:', error)
 router.push('/orders')
 } finally {
 isLoading.value = false
 }
}

const cancelOrder = async () => {
 if (!order.value) return

 uiStore.confirm({
 title: t('account.cancel_order_title'),
 message: t('account.cancel_order_confirm'),
 type: 'danger',
 confirmText: t('account.cancel_order_title'),
 cancelText: t('account.back'),
 onConfirm: async () => {
 try {
 await ordersService.cancelOrder(order.value!.id)
 await loadOrder()
 uiStore.showToast(t('account.order_cancelled_success'), 'info')
 } catch (error) {
 console.error('Error cancelling order:', error)
 uiStore.showToast(t('account.order_cancel_error'), 'error')
 }
 }
 })
}

const formatDate = (dateString: string) => {
 if (!dateString) return ''
 const locale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
 return new Date(dateString).toLocaleDateString(locale, {
 day: 'numeric',
 month: 'short',
 year: 'numeric'
 })
}

const formatPrice = (price: number) => {
 const locale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
 return new Intl.NumberFormat(locale, {
 style: 'currency',
 currency: 'HTG',
 minimumFractionDigits: 0,
 }).format(price)
}

const getMonCashFee = (orderData: Order) => {
 if (!orderData || !orderData.paymentMethod || orderData.paymentMethod.type !== 'moncashwise') return 0;
 const subtotalValue = orderData.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
 const shipping = orderData.shipping || 0;
 const amount = subtotalValue + shipping;

 if (amount < 20) return 0;
 if (amount <= 99) return 7;
 if (amount <= 249) return 14;
 if (amount <= 499) return 19;
 if (amount <= 999) return 30;
 if (amount <= 1999) return 60;
 if (amount <= 3999) return 105;
 if (amount <= 7999) return 171;
 if (amount <= 11999) return 247;
 if (amount <= 19999) return 366;
 if (amount <= 39999) return 629;
 if (amount <= 59999) return 1011;
 return 1368;
}

// Stepper Logic


// Status Helpers
const getStatusLabel = (status: string) => {
 const labels: Record<string, string> = {
 pending: t('account.status_waiting'),
 confirmed: t('account.status_progress'),
 processing: t('account.status_preparation'),
 shipped: t('account.status_expediated'),
 delivered: t('account.status_delivered'),
 cancelled: t('account.status_cancelled')
 }
 return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
 const classes: Record<string, string> = {
 pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
 confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
 processing: 'bg-purple-50 text-purple-700 border-purple-200',
 shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
 delivered: 'bg-green-50 text-green-700 border-green-200',
 cancelled: 'bg-red-50 text-red-700 border-red-200'
 }
 return classes[status] || 'bg-gray-50 text-gray-700 border-gray-200'
}

const getStatusIcon = (status: string) => {
 const icons: Record<string, string> = {
 pending: 'las la-clock',
 confirmed: 'las la-check',
 processing: 'las la-box-open',
 shipped: 'las la-shipping-fast',
 delivered: 'las la-check-circle',
 cancelled: 'las la-times-circle'
 }
 return icons[status] || 'las la-info-circle'
}

// Timeline Steps
const steps = [
 { id: 1, labelKey: 'account.step_validated', icon: 'las la-clipboard-check' },
 { id: 2, labelKey: 'seller.healthy_stock', icon: 'las la-box' },
 { id: 3, labelKey: 'account.step_shipped', icon: 'las la-truck' },
 { id: 4, labelKey: 'account.step_delivered', icon: 'las la-check-circle' }
]

const getProgressWidth = (status: string) => {
 const statusMap: Record<string, number> = {
 'pending': 1,
 'confirmed': 2,
 'processing': 2,
 'shipped': 3,
 'delivered': 4,
 'cancelled': 0
 }
 const currentStep = statusMap[status] || 0
 if (currentStep === 0) return '0%'
 const percentage = ((currentStep - 1) / 3) * 100
 return `${percentage}%`
}

const isStepActive = (status: string, stepId: number) => {
 const statusMap: Record<string, number> = {
 'pending': 1,
 'confirmed': 2,
 'processing': 2,
 'shipped': 3,
 'delivered': 4,
 'cancelled': 0
 }
 return (statusMap[status] || 0) >= stepId
}

const qrCodeRef = ref<any>(null)

const downloadQR = () => {
 if (!qrCodeRef.value) return;
 const img = qrCodeRef.value.$el; 
 if (img && img.src) {
 const link = document.createElement('a');
 link.href = img.src;
 link.download = `HTFasil-Order-${order.value?.id || 'QR'}.png`;
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 }
}

const shareQR = async () => {
 if (!qrCodeRef.value || !order.value) return;
 
 try {
 const img = qrCodeRef.value.$el;
 if (img && img.src) {
 const blob = await (await fetch(img.src)).blob();
 const file = new File([blob], `order-${order.value.id}.png`, { type: blob.type });

 if (navigator.share && navigator.canShare({ files: [file] })) {
 await navigator.share({
 title: `${t('account.order')} #${order.value.id}`,
 text: t('account.qr_code_hint'),
 files: [file]
 });
 } else {
 // Fallback to text share
 await navigator.share({
 title: `${t('account.order')} #${order.value.id}`,
 text: `${t('account.order')} #${order.value.id} - ${window.location.href}`,
 url: window.location.href
 });
 }
 }
 } catch (e) {
 console.error('Sharing failed', e);
 uiStore.showToast(t('account.share_not_supported'), 'error');
 }
}

onMounted(() => {
 loadOrder()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
 display: none;
}
.no-scrollbar {
 -ms-overflow-style: none;
 scrollbar-width: none;
}
</style>
