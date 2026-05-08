<template>
<div class="checkout-page bg-gray-50 min-h-screen">
    <!-- Minimal Header Fixed -->
    <header class="bg-white border-b border-gray-100 py-4 px-4 fixed top-0 left-0 right-0 z-50">
      <div class="container mx-auto flex items-center justify-between">
        <button 
          @click="router.push('/cart')" 
          class="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition-colors"
        >
          <i class="fas fa-times text-xl"></i>
          <span class="text-sm uppercase tracking-wide">{{ $t('common.cancel') }}</span>
        </button>
        <h1 class="text-lg font-black text-gray-900 absolute left-1/2 -translate-x-1/2">{{ $t('account.checkout.step_payment') }}</h1>
        <div class="w-10"></div> <!-- Spacer for balance -->
      </div>
    </header>

    <!-- Spacer to push content down -->
    <div class="h-[60px]"></div>

    <div class="container mx-auto px-4 py-8 lg:py-12 animate-in fade-in slide-in-from-top-2 duration-700">
      <h2 class="text-2xl font-black text-gray-900 mb-8 hidden lg:block">{{ $t('checkout.finalize') }}</h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Checkout Form -->
      <div class="space-y-6">
        <!-- Shipping Information -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">{{ $t('checkout.title') }}</h3>

          <!-- Selected Address Summary -->
          <div v-if="selectedAddressId !== 'new'" class="bg-gray-50 rounded-xl p-4 border border-gray-200">
             <div class="flex justify-between items-start">
               <div>
                 <h4 class="font-bold text-gray-900">{{ shippingInfo.firstName }} {{ shippingInfo.lastName }}</h4>
                 <p class="text-gray-600 text-sm mt-1">
                   {{ shippingInfo.street }}<br>
                   {{ shippingInfo.city }}<br>
                   {{ shippingInfo.country }}
                 </p>
                 <p class="text-gray-600 text-sm mt-2 flex items-center gap-2">
                   <i class="las la-phone"></i>
                   {{ shippingInfo.phone || $t('account.not_provided') }}
                 </p>
               </div>
               <button 
                 @click="selectedAddressId = 'new'"
                 class="text-blue-600 text-sm font-bold hover:underline"
               >
                 {{ $t('account.add_address') }}
               </button>
             </div>
             
             <!-- Dropdown to switch between *other* saved addresses -->
             <div class="mt-4 pt-4 border-t border-gray-200">
                <label class="text-xs text-gray-500 font-medium mb-1 block">{{ $t('checkout.change_address') }}</label>
                <select 
                  v-model="selectedAddressId" 
                  class="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option v-for="addr in savedAddresses" :key="addr.id" :value="addr.id">
                    {{ addr.street }} ({{ addr.city }}) {{ addr.is_default ? '★' : '' }}
                  </option>
                  <option value="new">+ {{ $t('account.add_address') }}</option>
                </select>
             </div>
          </div>

          <!-- New Address Form -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            <!-- Header for New Address Mode -->
            <div class="md:col-span-2 flex justify-between items-center mb-2" v-if="savedAddresses.length > 0">
               <h4 class="text-sm font-bold text-gray-700">{{ $t('checkout.new_address') }}</h4>
               <button 
                 @click="selectedAddressId = savedAddresses[0] ? savedAddresses[0].id : 'new'"
                 class="text-gray-500 text-xs hover:text-gray-700 underline"
               >
                 {{ $t('checkout.back_to_addresses') }}
               </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> {{ $t('checkout.firstname') }} </label>
              <input
                v-model="shippingInfo.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> {{ $t('checkout.lastname') }} </label>
              <input
                v-model="shippingInfo.lastName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"> {{ $t('checkout.address') }} </label>
              <input
                v-model="shippingInfo.street"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> {{ $t('checkout.city') }} </label>
              <input
                v-model="shippingInfo.city"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"> {{ $t('checkout.country') }} </label>
              <input
                v-model="shippingInfo.country"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"> {{ $t('checkout.phone') }} </label>
              <input
                v-model="shippingInfo.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 font-bold text-blue-600"
              />
              <div class="mt-2 flex items-center gap-2 text-blue-600">
                <i class="las la-phone-volume animate-pulse"></i>
                <span class="text-xs font-bold">{{ $t('checkout.phone_hint') }}</span>
              </div>
            </div>
            
            <!-- Reference Point Field (Specific for Haiti) -->
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-1"> {{ $t('checkout.reference_point') }} <span class="text-xs font-normal text-gray-500">{{ $t('checkout.reference_point_eg') }}</span> </label>
              <textarea
                v-model="shippingInfo.referencePoint"
                rows="2"
                :placeholder="$t('checkout.reference_point_ph')"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 text-sm"
              ></textarea>
            </div>

            <!-- Checkbox to save address -->
             <div class="md:col-span-2 flex items-center gap-2 mt-2">
                <input type="checkbox" id="saveAddr" class="rounded text-primary-600 focus:ring-primary-500">
                <label for="saveAddr" class="text-sm text-gray-600">{{ $t('checkout.save_address') }}</label>
             </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">{{ $t('account.checkout.payment_method') }}</h3>

          <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                v-model="paymentMethod"
                type="radio"
                value="visa"
                class="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div class="flex items-center space-x-2">
                <i class="lab la-cc-visa text-2xl text-blue-600"></i>
                <span>{{ $t('account.checkout.payment_card') }}</span>
              </div>
            </label>

            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                v-model="paymentMethod"
                type="radio"
                value="moncashwise"
                class="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div class="flex items-center space-x-2">
                <img src="/images/moncash.png" alt="MonCash" class="h-8 w-auto object-contain" />
              </div>
            </label>
          </div>
          
          <!-- MonCash Hint -->
          <div v-if="paymentMethod === 'moncashwise'" class="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-start gap-2">
            <i class="las la-info-circle text-lg mt-0.5"></i>
            <p>{{ $t('checkout.moncash_redirect_hint') }}</p>
          </div>

          <!-- Payment Details Form -->
          <div v-if="paymentMethod && paymentMethod !== 'moncashwise'" class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-4">{{ $t('checkout.payment_info') }}</h4>

            <!-- Credit Card Fields (Visa) -->
            <div v-if="paymentMethod === 'visa'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('checkout.card_number') }}</label>
                <input
                  v-model="paymentDetails.cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('checkout.expiry_date') }}</label>
                  <input
                    v-model="paymentDetails.cardExpiry"
                    type="text"
                    placeholder="MM/AA"
                    maxlength="5"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('account.checkout.cvc') }}</label>
                  <input
                    v-model="paymentDetails.cardCvc"
                    type="text"
                    placeholder="123"
                    maxlength="4"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('checkout.card_holder') }}</label>
                <input
                  v-model="paymentDetails.cardHolder"
                  type="text"
                  placeholder="JEAN DUPONT"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <h3 class="text-lg font-semibold mb-4">{{ $t('account.checkout.summary') }}</h3>

          <!-- Cart Items -->
          <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
            <div v-for="item in items" :key="item.id" class="flex items-center space-x-3">
              <img
                :src="item.product.image || '/placeholder-product.jpg'"
                :alt="item.product.name"
                class="w-12 h-12 object-cover rounded"
              />
              <div class="flex-1">
                <h4 class="font-medium text-sm">{{ item.product.name }}</h4>
                <p class="text-gray-600 text-xs">{{ $t('nav.quantity') }}: {{ item.quantity }}</p>
              </div>
              <span class="font-medium">{{ formatPrice(item.subtotal) }}</span>
            </div>
          </div>

          <!-- Totals -->
          <div class="space-y-2 border-t pt-4">
            <div class="flex justify-between text-sm">
              <span>{{ $t('account.checkout.subtotal') }} ({{ $t('checkout.items_count', { count: items.reduce((acc, item) => acc + item.quantity, 0) }) }})</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>{{ $t('account.checkout.shipping_cost') }}</span>
              <span>{{ formatPrice(subtotal > 5000 ? 0 : 250) }}</span>
            </div>
            <div v-if="paymentMethod === 'moncashwise'" class="flex justify-between text-red-600">
              <span>{{ $t('checkout.moncash_fee') }}</span>
              <span>+ {{ formatPrice(monCashFee) }}</span>
            </div>
            <hr class="my-2" />
            <div class="flex justify-between font-semibold text-lg">
              <span>{{ $t('account.checkout.total') }}</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>

          <!-- Place Order Button -->
          <button
            @click="placeOrder"
            :disabled="isPlacingOrder"
            class="w-full btn-primary mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <i v-if="isPlacingOrder" class="las la-spinner la-spin mr-2"></i>
            {{ isPlacingOrder ? $t('account.checkout.processing') : $t('account.checkout.place_order') }}
          </button>
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
import { ordersService, type CreateOrderData } from '@/services/orders'
import api, { addressService, type Address } from '@/services/api'
import { useUiStore } from '@/stores/ui'
import { formatOrderId } from '@/utils/formatters';

const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()
const authStore = useAuthStore()
const uiStore = useUiStore()

// State
const savedAddresses = ref<Address[]>([])
const selectedAddressId = ref<number | 'new'>('new')
const isPlacingOrder = ref(false)

const selectedPaymentMethod = ref({
  type: 'moncashwise' as 'moncashwise' | 'visa',
  name: 'Mon Cash',
  description: 'Payer avec MonCash',
  icon: 'las la-wallet',
  isActive: true,
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

// Computed
const items = computed(() => cartStore.items.filter(item => cartStore.selectedItems.has(item.id)))
const subtotal = computed(() => items.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))

const monCashFee = computed(() => {
  if (paymentMethod.value !== 'moncashwise') return 0
  const amount = subtotal.value + (subtotal.value > 5000 ? 0 : 250)
  
  if (amount < 20) return 0
  if (amount <= 99) return 7
  if (amount <= 249) return 14
  if (amount <= 499) return 19
  if (amount <= 999) return 30
  if (amount <= 1999) return 60
  if (amount <= 3999) return 105
  if (amount <= 7999) return 171
  if (amount <= 11999) return 247
  if (amount <= 19999) return 366
  if (amount <= 39999) return 629
  if (amount <= 59999) return 1011
  return 1368
})

const total = computed(() => {
  const subtotalValue = subtotal.value
  const shipping = subtotalValue > 5000 ? 0 : 250
  return subtotalValue + shipping + monCashFee.value
})

const isValidForm = computed(() => {
  const hasShippingInfo = 
    shippingInfo.value.firstName &&
    shippingInfo.value.lastName &&
    shippingInfo.value.street &&
    shippingInfo.value.city &&
    shippingInfo.value.country &&
    items.value.length > 0

  // Pour le moment, on valide seulement les informations de livraison
  // Les détails de paiement seront validés plus tard
  return hasShippingInfo
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
  if (!shippingInfo.value.street || !shippingInfo.value.city) {
    uiStore.showToast(t('checkout.fill_address'), 'warning')
    return
  }
  
  if (items.value.length === 0) {
    uiStore.showToast(t('checkout.empty_cart'), 'error')
    router.push('/cart')
    return
  }

  try {
    isPlacingOrder.value = true

    // Aggregate items by productId and offerId to prevent duplicates while respecting vendor splitting
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
    }

    const order = await ordersService.createOrder(orderData)

    if (paymentMethod.value === 'moncashwise') {
      try {
        const response = await api.post('/paiements/init-moncash', {
          orderId: order.id,
          amount: order.totalAmount // 🛡️ Utiliser le montant calculé (et arrondi) par le serveur
        })
        
        if (response.data.redirectUrl) {
          window.location.href = response.data.redirectUrl
          return // Stop execution here to allow redirect
        }
      } catch (err: any) {
        console.error('MonCash Init Error:', err)
        const msg = err.response?.data?.error || err.message || t('common.error')
        uiStore.showToast(`${t('common.error')} MonCash: ${msg}`, 'error')
        isPlacingOrder.value = false
        return
      }
    }

    // Clear cart and redirect to payment success (Visa or fallback)
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

// Initialize with customer data
onMounted(async () => {
  // Pre-fill user info
  if (authStore.customer) {
    const customer = authStore.customer
    shippingInfo.value = {
      ...shippingInfo.value,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone || '',
    }
    
    // Fetch saved addresses
    try {
      const addresses = await addressService.getAll()
      savedAddresses.value = addresses
      
      // Auto-select default address
      const defaultAddr = addresses.find((a: Address) => a.is_default)
      if (defaultAddr) {
        selectedAddressId.value = defaultAddr.id
        fillAddress(defaultAddr)
      } else if (addresses.length > 0) {
        // If no default but has addresses, maybe select first? Or let user choose.
        // Let's keep 'new' unless default exists, to avoid confusion.
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
}

watch(selectedAddressId, (newId) => {
  if (newId === 'new') {
    // Clear address fields but keep name/phone
    shippingInfo.value.street = ''
    shippingInfo.value.city = ''
  } else {
    const addr = savedAddresses.value.find(a => a.id === newId)
    if (addr) fillAddress(addr)
  }
})
</script>
