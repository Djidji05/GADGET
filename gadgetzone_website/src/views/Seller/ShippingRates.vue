<template>
  <div class="w-full md:pt-4 pb-12">
    <!-- MOBILE HEADER -->
    <div class="md:hidden bg-gray-50 -mt-2 font-sans relative">
        <div class="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 pt-8 pb-16 relative rounded-b-[40px] shadow-lg shadow-blue-900/20">
            <div class="flex justify-between items-center mb-0 relative z-10">
                <button @click="router.back()" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md active:scale-95 transition-all">
                    <i class="fas fa-arrow-left text-sm"></i>
                </button>
                <h1 class="font-bold text-lg tracking-wide">Tarifs de Livraison</h1>
                <div class="w-10"></div>
            </div>
        </div>
    </div>

    <!-- MAIN GRID -->
    <div class="flex flex-col md:flex-row gap-6 md:items-start mt-6 md:mt-0 px-4 md:px-0">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar class="hidden md:block" />

      <!-- Content -->
      <div class="flex-1 w-full pb-10">
        <!-- Desktop Header -->
        <div class="hidden md:flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
                <button 
                    @click="router.back()" 
                    class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm active:scale-95"
                    title="Retour"
                >
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Tarifs et Zones de Livraison</h1>
                    <p class="text-gray-550 text-sm mt-1">Gérez vos zones de livraison ainsi que les tarifs appliqués à vos clients.</p>
                </div>
            </div>
            <button 
                @click="saveShippingSettings" 
                :disabled="saving"
                class="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 transition-all active:scale-95 flex items-center gap-2"
            >
                <i v-if="saving" class="fas fa-circle-notch animate-spin"></i>
                <span>Enregistrer</span>
            </button>
        </div>

        <div class="space-y-6">
            <!-- Add Zone Section -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm"><i class="fas fa-plus-circle"></i></span>
                    Ajouter une zone de livraison
                </h3>
                              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end bg-gray-55/30 p-4 rounded-2xl border border-gray-150/50">
                    <div>
                        <label class="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Ville / Zone *</label>
                        <select 
                            v-model="newZone.city" 
                            class="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-medium text-gray-700 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">-- Choisir une ville --</option>
                            <option value="Port-au-Prince">Port-au-Prince</option>
                            <option value="Delmas">Delmas</option>
                            <option value="Pétion-Ville">Pétion-Ville</option>
                            <option value="Carrefour">Carrefour</option>
                            <option value="Tabarre">Tabarre</option>
                            <option value="Cité Soleil">Cité Soleil</option>
                            <option value="Croix-des-Bouquets">Croix-des-Bouquets</option>
                            <option value="Cap-Haïtien">Cap-Haïtien</option>
                            <option value="Gonaïves">Gonaïves</option>
                            <option value="Les Cayes">Les Cayes</option>
                            <option value="Jacmel">Jacmel</option>
                            <option value="Saint-Marc">Saint-Marc</option>
                            <option value="Jérémie">Jérémie</option>
                            <option value="Port-de-Paix">Port-de-Paix</option>
                            <option value="Hinche">Hinche</option>
                            <option value="Fort-Liberté">Fort-Liberté</option>
                            <option value="Autre">Autre Ville / Zone...</option>
                        </select>
                        <input 
                            v-if="newZone.city === 'Autre'"
                            v-model="customCity"
                            type="text" 
                            placeholder="Saisir la ville..."
                            class="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-gray-800 focus:ring-1 focus:ring-blue-500 mt-2"
                        />
                    </div>
                    <div>
                        <label class="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Frais de base (HTG) *</label>
                        <input 
                            v-model.number="newZone.baseFee" 
                            type="number" 
                            min="0"
                            placeholder="Ex: 150"
                            class="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-gray-800 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label class="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Par art. supp. (HTG)</label>
                        <input 
                            v-model.number="newZone.perItemFee" 
                            type="number" 
                            min="0"
                            placeholder="Ex: 50"
                            class="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-medium text-gray-800 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div class="mt-4 flex flex-wrap gap-6 bg-gray-50 p-3 rounded-2xl border border-gray-100/50">
                    <label class="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                            v-model="newZone.deliverable" 
                            type="checkbox" 
                            class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" 
                        />
                        <span class="text-xs font-bold text-gray-700">Proposer la livraison dans cette zone</span>
                    </label>
                </div>
                <div class="mt-4 flex justify-end">
                    <button 
                        type="button" 
                        @click="addZone"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                    >
                        <i class="fas fa-plus"></i> Ajouter la zone
                    </button>
                </div>
            </div>

            <!-- Shipping Zones Table / List -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm"><i class="fas fa-map-marked-alt"></i></span>
                    Vos zones et tarifs configurés
                </h3>

                <div v-if="zones.length === 0" class="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <i class="fas fa-truck-loading text-3xl text-gray-300 mb-2"></i>
                    <p class="text-xs text-gray-400 font-bold">Aucune zone de livraison configurée pour le moment.</p>
                </div>

                <div v-else class="overflow-x-auto border border-gray-100 rounded-2xl">
                    <table class="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                                <th class="py-3.5 px-5">Ville / Zone</th>
                                <th class="py-3.5 px-5">Frais de base</th>
                                <th class="py-3.5 px-5">Par article supp.</th>
                                <th class="py-3.5 px-5">Options</th>
                                <th class="py-3.5 px-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(zone, index) in zones" :key="index" class="hover:bg-gray-50/50" :class="{ 'opacity-50': zone.deliverable === false }">
                                <td class="py-3.5 px-5 font-bold text-gray-900">
                                    {{ zone.city }}
                                    <span v-if="zone.deliverable === false" class="ml-2 px-1.5 py-0.5 text-[9px] font-bold text-red-600 bg-red-50 rounded">Non livré</span>
                                </td>
                                <td class="py-3.5 px-5 font-medium text-gray-700">
                                    <input 
                                        v-model.number="zone.baseFee" 
                                        type="number" 
                                        min="0"
                                        :disabled="zone.deliverable === false"
                                        class="bg-transparent border-none p-1 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded font-bold w-20"
                                    /> HTG
                                </td>
                                <td class="py-3.5 px-5 font-medium text-gray-700">
                                    <input 
                                        v-model.number="zone.perItemFee" 
                                        type="number" 
                                        min="0"
                                        :disabled="zone.deliverable === false"
                                        class="bg-transparent border-none p-1 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded font-bold w-20"
                                    /> HTG
                                </td>
                                <td class="py-3.5 px-5 font-medium text-gray-700">
                                    <label class="flex items-center gap-1.5 cursor-pointer">
                                        <input 
                                            v-model="zone.deliverable" 
                                            type="checkbox" 
                                            class="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500" 
                                        />
                                        <span>Livrer</span>
                                    </label>
                                </td>
                                <td class="py-3.5 px-5 text-center">
                                    <button 
                                        type="button" 
                                        @click="removeZone(index)"
                                        class="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors mx-auto"
                                    >
                                        <i class="fas fa-trash-alt text-xs"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Mobile Sticky Save Button -->
        <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom,0)]">
            <button 
                @click="saveShippingSettings" 
                :disabled="saving"
                class="w-full bg-gray-900 text-white py-4 font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-none"
            >
                 <i v-if="saving" class="fas fa-circle-notch animate-spin"></i>
                 <span>Enregistrer les modifications</span>
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import { useUiStore } from '@/stores/ui';

interface ShippingZone {
  city: string;
  baseFee: number;
  perItemFee: number;
  deliverable?: boolean;
}

const router = useRouter();
const uiStore = useUiStore();
const saving = ref(false);
const storeSettings = ref<any>({});
const zones = ref<ShippingZone[]>([]);

const newZone = reactive<ShippingZone>({
  city: '',
  baseFee: 150,
  perItemFee: 50,
  deliverable: true
});
const customCity = ref('');

onMounted(async () => {
  try {
    const res = await api.get('/vendors/me');
    const store = res.data;
    storeSettings.value = store.settings || {};
    
    if (storeSettings.value.shipping && Array.isArray(storeSettings.value.shipping.enabledZones)) {
      zones.value = storeSettings.value.shipping.enabledZones.map((z: any) => ({
        ...z,
        deliverable: z.deliverable !== false
      }));
    }
  } catch (e) {
    console.error("Failed to load shipping settings", e);
  }
});

const addZone = () => {
  const city = newZone.city === 'Autre' ? customCity.value.trim() : newZone.city;
  if (!city) {
    uiStore.showToast("Veuillez sélectionner ou saisir une ville", "warning");
    return;
  }

  // Check duplicate
  if (zones.value.some(z => z.city.toLowerCase() === city.toLowerCase())) {
    uiStore.showToast("Cette ville est déjà configurée", "warning");
    return;
  }

  zones.value.push({
    city,
    baseFee: Number(newZone.baseFee) || 0,
    perItemFee: Number(newZone.perItemFee) || 0,
    deliverable: newZone.deliverable !== false
  });

  // reset form
  newZone.city = '';
  newZone.baseFee = 150;
  newZone.perItemFee = 50;
  newZone.deliverable = true;
  customCity.value = '';
};

const removeZone = (index: number) => {
  zones.value.splice(index, 1);
};

const saveShippingSettings = async () => {
  saving.value = true;
  try {
    const shippingConfig = {
      enabledZones: zones.value,
      setupCompleted: zones.value.length > 0
    };

    const payload = {
      settings: {
        ...storeSettings.value,
        shipping: shippingConfig
      }
    };

    await api.put('/vendors/me', payload);
    uiStore.showToast("Tarifs de livraison enregistrés avec succès !", "success");
  } catch (e) {
    console.error("Failed to save shipping rates", e);
    uiStore.showToast("Erreur lors de la sauvegarde.", "error");
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
/* Scoped forms styling in inter */
.w-full {
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
