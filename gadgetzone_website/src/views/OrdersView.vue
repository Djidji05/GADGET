<template>
  <div class="container mx-auto px-4 lg: lg: pt-4 pb-12">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('account.my_orders') }}</h1>
    </div>

    <!-- Stats Tabs -->
    <div class="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="currentTab = tab.id"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
          currentTab === tab.id 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ $t(tab.labelKey) }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div v-for="n in 3" :key="n" class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
        <div class="w-20 h-20 bg-gray-200 rounded-lg shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>

    <!-- Orders List (Simplified) -->
    <div v-else-if="filteredOrders.length > 0" class="space-y-4">
      <router-link
        v-for="order in filteredOrders"
        :key="order.id"
        :to="`/orders/${order.id}`"
        class="block bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-4"
      >
        <!-- Product Image (First item) -->
        <div class="w-20 h-20 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
           <img 
              :src="getFirstItemImage(order)" 
              alt="Product" 
              class="w-full h-full object-cover"
            />
        </div>

        <!-- Order Info -->
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-bold text-gray-900 line-clamp-1 pr-2">
              {{ getOrderTitle(order) }}
            </h3>
            <span class="font-bold text-gray-900 shrink-0">{{ formatPrice(getOrderTotal(order)) }}</span>
          </div>
          
          <div class="flex justify-between items-end">
            <div class="text-sm text-gray-500 space-y-0.5">
               <p>{{ formatDate(order.createdAt) }}</p>
               <p v-if="order.items.length > 1" class="text-xs text-blue-600 font-medium">
                 {{ order.items.length - 1 > 1 ? $t('account.other_items_plural', { count: order.items.length - 1 }) : $t('account.other_items', { count: 1 }) }}
               </p>
            </div>
            
             <span
             :class="[
               'px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide',
               getOrderStatusClass(order.status),
             ]"
           >
             {{ getOrderStatusText(order.status) }}
           </span>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="las la-box-open text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('account.orders_empty') }}</h3>
      <p class="text-gray-500 mb-6">{{ $t('account.orders_empty_desc') }}</p>
      <button @click="currentTab = 'all'" v-if="currentTab !== 'all'" class="text-blue-600 font-medium hover:underline">
        {{ $t('account.tab_all') }}
      </button>
      <router-link v-else to="/products" class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        {{ $t('account.start_shopping') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ordersService } from '@/services/orders'
import type { Order } from '@/services/orders'
import { formatOrderId } from '@/utils/formatters'

const router = useRouter()
const { t } = useI18n()

// State
const isLoading = ref(false)
const orders = ref<Order[]>([])
const currentTab = ref('all')

const tabs = [
  { id: 'all', labelKey: 'account.tab_all' },
  { id: 'paid', labelKey: 'account.status_progress' },
  { id: 'delivered', labelKey: 'account.status_delivered' },
  { id: 'cancelled', labelKey: 'account.status_cancelled' }
]

// Computed
const filteredOrders = computed(() => {
  if (currentTab.value === 'all') return orders.value
  
  if (currentTab.value === 'paid') {
    return orders.value.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.status))
  }
  
  if (currentTab.value === 'delivered') {
    return orders.value.filter(o => o.status === 'delivered')
  }
  
  if (currentTab.value === 'cancelled') {
    return orders.value.filter(o => o.status === 'cancelled')
  }
  
  return orders.value
})

// Methods
const loadOrders = async () => {
  try {
    isLoading.value = true
    orders.value = await ordersService.getCustomerOrders()
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    isLoading.value = false
  }
}

const getFirstItemImage = (order: Order) => {
  if (order.items && order.items.length > 0 && order.items[0]?.product) {
    return order.items[0].product.image_url || '/placeholder-product.jpg'
  }
  return '/placeholder-product.jpg'
}

const getOrderTitle = (order: Order) => {
  if (order.items && order.items.length > 0 && order.items[0]?.product) {
    return order.items[0].product.name
  }
  return `${formatOrderId(order.orderNumber || order.id)}`
}

const formatDate = (dateString: string) => {
  const locale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
  return new Date(dateString).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const formatPrice = (price: number) => {
  const locale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(price).replace('HTG', 'G')
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

const getOrderTotal = (orderData: Order) => {
  const subtotal = orderData.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const shipping = orderData.shipping || 0;
  const monCashFee = getMonCashFee(orderData);
  return subtotal + shipping + monCashFee;
}

const getOrderStatusClass = (status: Order['status']) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getOrderStatusText = (status: Order['status']) => {
  const texts = {
    pending: t('account.status_waiting'),
    confirmed: t('account.status_progress'),
    processing: t('account.status_progress'),
    shipped: t('account.status_expediated'),
    delivered: t('account.status_delivered'),
    cancelled: t('account.status_cancelled'),
  }
  return texts[status] || status
}

// Load orders on mount
onMounted(() => {
  loadOrders()
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
