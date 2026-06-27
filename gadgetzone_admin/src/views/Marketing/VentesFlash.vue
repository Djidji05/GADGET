<template>
  <div class="p-4 sm:p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-200 dark:shadow-red-900/30">
          <Zap class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ventes Flash</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Creez des offres limitees dans le temps pour booster vos ventes</p>
        </div>
      </div>
      <button @click="openCreateModal" class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-sm font-semibold">
        <Plus class="w-4 h-4" />
        Nouvelle vente flash
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg flex items-center justify-center"><Zap class="w-5 h-5" /></div>
          <div><p class="text-xs text-gray-500 dark:text-gray-400">Actives</p><p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.active }}</p></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center"><Clock class="w-5 h-5" /></div>
          <div><p class="text-xs text-gray-500 dark:text-gray-400">Planifiees</p><p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.scheduled }}</p></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-lg flex items-center justify-center"><CheckCircle class="w-5 h-5" /></div>
          <div><p class="text-xs text-gray-500 dark:text-gray-400">Terminees</p><p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.ended }}</p></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg flex items-center justify-center"><TrendingDown class="w-5 h-5" /></div>
          <div><p class="text-xs text-gray-500 dark:text-gray-400">Remise moy.</p><p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.avgDiscount }}%</p></div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 class="font-bold text-gray-900 dark:text-white">Toutes les ventes flash</h3>
        <div class="flex items-center gap-3">
          <select v-model="filterStatus" class="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500">
            <option value="">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="scheduled">Planifiees</option>
            <option value="ended">Terminees</option>
            <option value="cancelled">Annulees</option>
          </select>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input v-model="search" type="text" placeholder="Rechercher..." class="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 w-48" />
          </div>
        </div>
      </div>

      <div v-if="loading" class="p-16 flex justify-center items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
      </div>

      <div v-else-if="filteredSales.length === 0" class="p-16 text-center">
        <div class="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4"><Zap class="w-8 h-8 text-red-400" /></div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Aucune vente flash</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Creez votre premiere vente flash pour attirer plus de clients.</p>
        <button @click="openCreateModal" class="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm">
          <Plus class="w-4 h-4" /> Creer une vente flash
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-900/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th class="px-6 py-4">Produit</th>
              <th class="px-6 py-4">Prix flash</th>
              <th class="px-6 py-4">Remise</th>
              <th class="px-6 py-4">Periode</th>
              <th class="px-6 py-4">Stock</th>
              <th class="px-6 py-4">Statut</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
            <tr v-for="sale in filteredSales" :key="sale.id" class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="sale.product?.image_url || '/placeholder.png'" :alt="sale.product?.name" class="w-10 h-10 rounded-lg object-cover border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0" />
                  <div class="min-w-0">
                    <p class="font-semibold text-sm text-gray-900 dark:text-white truncate max-w-[180px]">{{ sale.product?.name || 'Produit supprime' }}</p>
                    <p class="text-xs text-gray-400">Original : {{ formatPrice(sale.original_price) }} HTG</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4"><span class="text-red-600 dark:text-red-400 font-black text-base">{{ formatPrice(sale.flash_price) }}</span><span class="text-xs text-gray-400 ml-1">HTG</span></td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold px-2.5 py-1 rounded-lg">
                  <TrendingDown class="w-3 h-3" />-{{ sale.discount_percentage }}%
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-xs space-y-0.5">
                  <p class="text-gray-500 dark:text-gray-400"><span class="font-semibold text-gray-700 dark:text-gray-300">Du</span> {{ formatDate(sale.start_at) }}</p>
                  <p class="text-gray-500 dark:text-gray-400"><span class="font-semibold text-gray-700 dark:text-gray-300">Au</span> {{ formatDate(sale.end_at) }}</p>
                  <p v-if="sale.status === 'active'" class="font-black text-red-500 tabular-nums">Restant: {{ getSaleCountdown(sale) }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="sale.stock_limit" class="min-w-[80px]">
                  <div class="flex items-center justify-between mb-1"><span class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ sale.current_stock }} / {{ sale.stock_limit }}</span></div>
                  <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden w-20">
                    <div class="h-full bg-red-500 rounded-full transition-all" :style="{ width: Math.min(100, ((sale.current_stock || 0) / sale.stock_limit) * 100) + '%' }"></div>
                  </div>
                </div>
                <span v-else class="text-xs text-gray-400 dark:text-gray-500 italic">Illimite</span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" :class="statusClass(sale.status)">
                  <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(sale.status)"></span>
                  {{ statusLabel(sale.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button v-if="sale.status !== 'cancelled' && sale.status !== 'ended'" @click="cancelSale(sale)" :disabled="cancelling === sale.id" class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-50">
                  <X class="w-3 h-3" />{{ cancelling === sale.id ? 'Annulation...' : 'Annuler' }}
                </button>
                <span v-else class="text-xs text-gray-400 dark:text-gray-500 italic">termine</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CREATE MODAL -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden z-10">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-500 to-orange-500">
              <div class="flex items-center gap-2"><Zap class="w-5 h-5 text-white" /><h2 class="text-lg font-bold text-white">Nouvelle Vente Flash</h2></div>
              <button @click="closeModal" class="text-white/80 hover:text-white transition-colors p-1"><X class="w-5 h-5" /></button>
            </div>
            <form @submit.prevent="createFlashSale" class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <!-- Product Search -->
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Produit <span class="text-red-500">*</span></label>
                <div class="relative">
                  <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input v-model="productSearch" type="text" placeholder="Rechercher un produit..." class="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-red-500" @focus="showProductDropdown = true" @blur="setTimeout(() => { showProductDropdown = false }, 200)" />
                  <div v-if="showProductDropdown && filteredProducts.length > 0" class="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                    <button v-for="p in filteredProducts" :key="p.id" type="button" @click="selectProduct(p)" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                      <img :src="p.image_url || '/placeholder.png'" class="w-8 h-8 rounded-lg object-cover border border-gray-100 dark:border-gray-700" />
                      <div class="min-w-0"><p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ p.name }}</p><p class="text-xs text-gray-400">{{ formatPrice(p.price) }} HTG</p></div>
                    </button>
                  </div>
                </div>
                <div v-if="form.selectedProduct" class="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl">
                  <img :src="form.selectedProduct.image_url || '/placeholder.png'" class="w-10 h-10 rounded-lg object-cover" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ form.selectedProduct.name }}</p>
                    <p class="text-xs text-gray-500">Prix actuel : <span class="font-semibold text-gray-700 dark:text-gray-300">{{ formatPrice(form.selectedProduct.price) }} HTG</span></p>
                  </div>
                  <button type="button" @click="form.selectedProduct = null; productSearch = ''" class="text-gray-400 hover:text-red-500 transition-colors"><X class="w-4 h-4" /></button>
                </div>
              </div>
              <!-- Flash Price -->
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Prix Flash (HTG) <span class="text-red-500">*</span></label>
                <input v-model.number="form.flash_price" type="number" min="1" step="0.01" placeholder="ex: 5000" class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-red-500" required />
                <p v-if="form.selectedProduct && form.flash_price > 0 && form.flash_price < form.selectedProduct.price" class="text-xs text-green-600 dark:text-green-400 font-bold">Remise de {{ computedDiscount }}% — economie de {{ formatPrice(form.selectedProduct.price - form.flash_price) }} HTG</p>
                <p v-else-if="form.selectedProduct && form.flash_price >= form.selectedProduct.price" class="text-xs text-red-500 font-semibold">Le prix flash doit etre inferieur au prix original ({{ formatPrice(form.selectedProduct.price) }} HTG)</p>
              </div>
              <!-- Date Range -->
              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Debut <span class="text-red-500">*</span></label>
                  <input v-model="form.start_at" type="datetime-local" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-red-500" required />
                </div>
                <div class="space-y-1.5">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Fin <span class="text-red-500">*</span></label>
                  <input v-model="form.end_at" type="datetime-local" class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-red-500" required />
                </div>
              </div>
              <!-- Quick Duration -->
              <div class="flex flex-wrap gap-2">
                <span class="text-xs text-gray-500 dark:text-gray-400 font-semibold self-center">Duree rapide :</span>
                <button v-for="d in quickDurations" :key="d.label" type="button" @click="applyDuration(d.hours)" class="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors font-semibold">{{ d.label }}</button>
              </div>
              <!-- Stock Limit -->
              <div class="space-y-1.5">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Limite de stock <span class="text-gray-400 font-normal">(optionnel)</span></label>
                <input v-model.number="form.stock_limit" type="number" min="1" placeholder="Laissez vide = illimite" class="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-red-500" />
                <p class="text-xs text-gray-400 dark:text-gray-500">Si renseigne, la vente flash s arretera quand le stock est epuise.</p>
              </div>
              <!-- Error -->
              <div v-if="formError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl">
                <p class="text-sm text-red-600 dark:text-red-400 font-semibold">{{ formError }}</p>
              </div>
              <!-- Submit -->
              <div class="flex gap-3 pt-2">
                <button type="button" @click="closeModal" class="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Annuler</button>
                <button type="submit" :disabled="creating || !form.selectedProduct || !form.flash_price" class="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <span v-if="creating" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {{ creating ? 'Creation...' : 'Lancer la vente flash' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Zap, Plus, Clock, CheckCircle, TrendingDown, Search, X } from 'lucide-vue-next'
import api from '@/services/api'

const loading = ref(true)
const flashSales = ref<any[]>([])
const allProducts = ref<any[]>([])
const search = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const creating = ref(false)
const cancelling = ref<number | null>(null)
const formError = ref('')
const productSearch = ref('')
const showProductDropdown = ref(false)
const now = ref(Date.now())
let ticker: ReturnType<typeof setInterval> | null = null

const form = ref({
  selectedProduct: null as any,
  flash_price: '' as number | '',
  start_at: '',
  end_at: '',
  stock_limit: '' as number | '',
})

const quickDurations = [
  { label: '1h', hours: 1 },
  { label: '3h', hours: 3 },
  { label: '6h', hours: 6 },
  { label: '12h', hours: 12 },
  { label: '24h', hours: 24 },
]

const filteredSales = computed(() => flashSales.value.filter(s => {
  const matchStatus = !filterStatus.value || s.status === filterStatus.value
  const matchSearch = !search.value || s.product?.name?.toLowerCase().includes(search.value.toLowerCase())
  return matchStatus && matchSearch
}))

const stats = computed(() => {
  const active = flashSales.value.filter(s => s.status === 'active').length
  const scheduled = flashSales.value.filter(s => s.status === 'scheduled').length
  const ended = flashSales.value.filter(s => s.status === 'ended' || s.status === 'cancelled').length
  const discounts = flashSales.value.filter(s => s.discount_percentage > 0).map(s => s.discount_percentage)
  const avgDiscount = discounts.length ? Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length) : 0
  return { active, scheduled, ended, avgDiscount }
})

const filteredProducts = computed(() => {
  if (!productSearch.value.trim()) return allProducts.value.slice(0, 8)
  const val = productSearch.value.toLowerCase()
  return allProducts.value.filter(p => p.name.toLowerCase().includes(val)).slice(0, 8)
})

const computedDiscount = computed(() => {
  if (!form.value.selectedProduct || !form.value.flash_price) return 0
  const orig = form.value.selectedProduct.price
  const flash = Number(form.value.flash_price)
  if (flash >= orig) return 0
  return Math.round(((orig - flash) / orig) * 100)
})

const loadFlashSales = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/flash-sales')
    flashSales.value = data.flash_sales || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const loadProducts = async () => {
  try {
    const { data } = await api.get('/products', { params: { limit: 200, status: 'active' } })
    allProducts.value = data.products || []
  } catch (e) { console.error(e) }
}

const openCreateModal = () => {
  formError.value = ''
  form.value = { selectedProduct: null, flash_price: '', start_at: toLocalDatetimeInput(new Date()), end_at: toLocalDatetimeInput(new Date(Date.now() + 3 * 60 * 60 * 1000)), stock_limit: '' }
  productSearch.value = ''
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

const selectProduct = (p: any) => { form.value.selectedProduct = p; productSearch.value = p.name; showProductDropdown.value = false }

const applyDuration = (hours: number) => {
  const start = form.value.start_at ? new Date(form.value.start_at) : new Date()
  form.value.end_at = toLocalDatetimeInput(new Date(start.getTime() + hours * 60 * 60 * 1000))
}

const createFlashSale = async () => {
  formError.value = ''
  const product = form.value.selectedProduct
  if (!product) { formError.value = 'Veuillez selectionner un produit.'; return }
  if (!form.value.flash_price || Number(form.value.flash_price) <= 0) { formError.value = 'Prix flash invalide.'; return }
  if (Number(form.value.flash_price) >= product.price) { formError.value = 'Le prix flash doit etre inferieur au prix original.'; return }
  if (!form.value.start_at || !form.value.end_at) { formError.value = 'Les dates de debut et fin sont obligatoires.'; return }
  if (new Date(form.value.end_at) <= new Date(form.value.start_at)) { formError.value = 'La date de fin doit etre apres la date de debut.'; return }
  creating.value = true
  try {
    await api.post('/flash-sales', { product_id: product.id, flash_price: Number(form.value.flash_price), start_at: new Date(form.value.start_at).toISOString(), end_at: new Date(form.value.end_at).toISOString(), stock_limit: form.value.stock_limit ? Number(form.value.stock_limit) : null })
    closeModal()
    await loadFlashSales()
  } catch (e: any) {
    formError.value = e?.response?.data?.error || 'Erreur lors de la creation.'
  } finally { creating.value = false }
}

const cancelSale = async (sale: any) => {
  if (!confirm(`Annuler la vente flash pour "${sale.product?.name}" ?`)) return
  cancelling.value = sale.id
  try { await api.delete(`/flash-sales/${sale.id}`); await loadFlashSales() }
  catch (e) { alert('Erreur lors de l annulation.') }
  finally { cancelling.value = null }
}

const formatPrice = (v: number) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(Number(v))

const formatDate = (d: string) => new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const toLocalDatetimeInput = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const getSaleCountdown = (sale: any): string => {
  const ms = new Date(sale.end_at).getTime() - now.value
  if (ms <= 0) return 'Expire'
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  const s = Math.floor((ms % 60_000) / 1_000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const statusLabel = (s: string) => ({ active: 'Active', scheduled: 'Planifiee', ended: 'Terminee', cancelled: 'Annulee' }[s] || s)

const statusClass = (s: string) => ({ active: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', scheduled: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', ended: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400', cancelled: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' }[s] || 'bg-gray-100 text-gray-600')

const statusDot = (s: string) => ({ active: 'bg-green-500 animate-pulse', scheduled: 'bg-blue-500', ended: 'bg-gray-400', cancelled: 'bg-red-500' }[s] || 'bg-gray-400')

onMounted(async () => {
  await Promise.all([loadFlashSales(), loadProducts()])
  ticker = setInterval(() => { now.value = Date.now() }, 1_000)
})

onUnmounted(() => { if (ticker) clearInterval(ticker) })
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
