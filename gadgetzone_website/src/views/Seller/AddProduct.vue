<template>
  <div class="w-full md:pt-4 pb-12">
    <!-- MOBILE HEADER (Blue Gradient Theme) -->
    <div class="md:hidden bg-gray-50 -mt-2 font-sans relative">
        <!-- Top Section -->
        <div class="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-6 pt-8 pb-16 relative rounded-b-[40px] shadow-lg shadow-blue-900/20">
            <div class="flex justify-between items-center mb-0 relative z-10">
                <button @click="router.back()" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md active:scale-95 transition-all">
                    <i class="fas fa-arrow-left text-sm"></i>
                </button>
                <h1 class="font-bold text-lg tracking-wide">{{ isEdit ? 'Modifier Produit' : 'Nouveau Produit' }}</h1>
                <div class="w-10"></div>
            </div>
        </div>

        <!-- Floating Card: Basic Info -->
        <div class="px-5 -mt-10 relative z-20">
            <div class="bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 relative overflow-hidden">
                <div class="space-y-4">
                    <!-- Image Upload (Main) -->
                    <div class="flex justify-center mb-4">
                        <div class="relative group cursor-pointer" @click="mainImageInput?.click()">
                            <div class="w-28 h-28 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                <img v-if="mainImagePreview" :src="mainImagePreview" class="w-full h-full object-cover" />
                                <div v-else class="flex flex-col items-center justify-center text-gray-400">
                                    <i class="fas fa-camera text-2xl mb-1"></i>
                                    <span class="text-[10px] uppercase font-bold">Photo</span>
                                </div>
                            </div>
                            <div class="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                                Principale
                            </div>
                        </div>
                        <input type="file" ref="mainImageInput" class="hidden" @change="handleMainImageUpload" accept="image/*" />
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nom du produit</label>
                        <input 
                            v-model="form.name" 
                            type="text" 
                            required 
                            placeholder="Ex: iPhone 15 Pro Max"
                            class="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-300" 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- DESKTOP LAYOUT -->
    <div class="flex flex-col md:flex-row gap-6 md:items-start mt-6 md:mt-0">
      <!-- Sidebar (Desktop Only) -->
      <SellerSidebar />

      <!-- Main Content -->
      <div class="flex-1 w-full pb-24 md:pb-10">
          
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
                    <h1 class="text-2xl font-bold text-gray-900">{{ isEdit ? 'Modifier le produit' : 'Ajouter un produit' }}</h1>
                    <p class="text-gray-500 text-sm mt-1">Remplissez les informations ci-dessous pour mettre en ligne votre article.</p>
                </div>
            </div>
            <button 
                @click="submitProduct" 
                :disabled="loading"
                class="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 transition-all active:scale-95 flex items-center gap-2"
            >
                <i v-if="loading" class="fas fa-circle-notch animate-spin"></i>
                <span v-else>{{ isEdit ? 'Mettre à jour' : 'Publier le produit' }}</span>
            </button>
        </div>

        <!-- Form Container -->
        <form @submit.prevent="submitProduct" class="space-y-6">
            
            <!-- Details Card -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm"><i class="fas fa-tag"></i></span>
                    Détails du produit
                </h3>
                
                <div class="space-y-5">
                    <div class="hidden md:block">
                         <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nom du produit</label>
                        <input 
                            v-model="form.name" 
                            type="text" 
                            required 
                            placeholder="Ex: iPhone 15 Pro Max"
                            class="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-300" 
                        />
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Catégorie</label>
                        <div class="relative">
                            <!-- Custom Select Trigger -->
                            <div 
                                @click="showCategoryDropdown = !showCategoryDropdown"
                                class="w-full bg-gray-50 rounded-xl py-3 px-4 flex items-center justify-between cursor-pointer border border-transparent hover:border-blue-200 transition-all select-none"
                                :class="{'ring-2 ring-blue-500/20': showCategoryDropdown}"
                            >
                                <span class="text-sm font-medium" :class="form.category_id ? 'text-gray-900' : 'text-gray-400'">
                                    {{ selectedCategoryName }}
                                </span>
                                <span class="text-gray-400 transition-transform duration-200" :class="{'rotate-180': showCategoryDropdown}">
                                    <i class="fas fa-chevron-down text-xs"></i>
                                </span>
                            </div>

                            <!-- Backdrop for clicking outside -->
                            <div v-if="showCategoryDropdown" @click="showCategoryDropdown = false" class="fixed inset-0 z-30 bg-transparent"></div>

                            <!-- Dropdown List -->
                            <div v-if="showCategoryDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-40 max-h-60 overflow-y-auto w-full">
                                <div 
                                    v-for="cat in categories" 
                                    :key="cat.id" 
                                    @click="selectCategory(cat.id)"
                                    class="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors border-b border-gray-50 last:border-none flex items-center justify-between group"
                                >
                                    <span>{{ cat.name }}</span>
                                    <i v-if="form.category_id === cat.id" class="fas fa-check text-blue-600 text-xs"></i>
                                </div>
                                <div v-if="categories.length === 0" class="px-4 py-3 text-xs text-gray-400 text-center">
                                    Aucune catégorie disponible
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Marque (Optionnel)</label>
                        <div class="relative">
                            <!-- Custom Select Trigger -->
                            <div 
                                @click="showBrandDropdown = !showBrandDropdown"
                                class="w-full bg-gray-50 rounded-xl py-3 px-4 flex items-center justify-between cursor-pointer border border-transparent hover:border-blue-200 transition-all select-none"
                                :class="{'ring-2 ring-blue-500/20': showBrandDropdown}"
                            >
                                <span class="text-sm font-medium" :class="form.brand_id ? 'text-gray-900' : 'text-gray-400'">
                                    {{ selectedBrandName }}
                                </span>
                                <span class="text-gray-400 transition-transform duration-200" :class="{'rotate-180': showBrandDropdown}">
                                    <i class="fas fa-chevron-down text-xs"></i>
                                </span>
                            </div>

                            <!-- Backdrop for clicking outside -->
                            <div v-if="showBrandDropdown" @click="showBrandDropdown = false" class="fixed inset-0 z-30 bg-transparent"></div>

                            <!-- Dropdown List -->
                            <div v-if="showBrandDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-40 max-h-60 overflow-y-auto w-full">
                                <div 
                                    class="px-4 py-3 text-sm text-gray-500 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors border-b border-gray-50 flex items-center justify-between group"
                                    @click="selectBrand(null)"
                                >
                                    <span>Aucune marque</span>
                                    <i v-if="form.brand_id === null" class="fas fa-check text-blue-600 text-xs"></i>
                                </div>
                                <div 
                                    v-for="brand in brands" 
                                    :key="brand.id" 
                                    @click="selectBrand(brand.id)"
                                    class="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors border-b border-gray-50 last:border-none flex items-center justify-between group"
                                >
                                    <span>{{ brand.name }}</span>
                                    <i v-if="form.brand_id === brand.id" class="fas fa-check text-blue-600 text-xs"></i>
                                </div>
                                <div v-if="brands.length === 0" class="px-4 py-3 text-xs text-gray-400 text-center">
                                    Aucune marque disponible
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                        <textarea 
                            v-model="form.description" 
                            rows="4" 
                            placeholder="Décrivez les caractéristiques, l'état, etc..."
                            class="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-300 resize-none"
                        ></textarea>
                    </div>
                </div>
            </div>

            <!-- Price & Stock Card -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm"><i class="fas fa-coins"></i></span>
                    Prix & Stock
                </h3>
                
                <div class="grid grid-cols-2 gap-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prix (HTG)</label>
                        <div class="relative">
                            <input 
                                v-model.number="form.price" 
                                type="number" 
                                min="0" 
                                placeholder="0"
                                class="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-lg font-extrabold text-gray-900 focus:ring-2 focus:ring-green-500/20 transition-all placeholder-gray-300"
                            />
                            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">HTG</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quantité (Optionnel)</label>
                         <div class="relative flex items-center">
                            <button type="button" @click="form.stock > 0 ? form.stock-- : null" class="w-10 h-10 bg-gray-100 rounded-l-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors">
                                <i class="fas fa-minus text-xs"></i>
                            </button>
                            <input 
                                v-model.number="form.stock" 
                                type="number" 
                                min="0" 
                                class="w-full bg-gray-50 border-none py-2.5 px-0 text-center text-lg font-bold text-gray-900 focus:ring-0 appearance-none m-0"
                            />
                            <button type="button" @click="form.stock++" class="w-10 h-10 bg-gray-100 rounded-r-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors">
                                <i class="fas fa-plus text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Media Upload Card -->
             <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
                <h3 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm"><i class="fas fa-images"></i></span>
                    Galerie Photos
                </h3>

                <!-- Desktop Upload Area -->
                <div class="hidden md:block">
                     <div 
                        class="border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:bg-gray-50 transition-colors cursor-pointer group text-center"
                        @click="desktopFileInput?.click()"
                     >
                        <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <i class="fas fa-cloud-upload-alt text-2xl"></i>
                        </div>
                        <p class="font-bold text-gray-900">Cliquez pour ajouter des photos</p>
                        <p class="text-xs text-gray-400 mt-1">PNG, JPG acceptés (Max 5MB)</p>
                     </div>
                     <input type="file" ref="desktopFileInput" class="hidden" @change="handleFileUpload" accept="image/*" multiple />
                </div>

                <!-- Mobile 'Add More' Button -->
                <button type="button" @click="mobileFileInput?.click()" class="md:hidden w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mb-4">
                    <i class="fas fa-plus-circle"></i> Ajouter d'autres photos
                </button>
                <input type="file" ref="mobileFileInput" class="hidden" @change="handleFileUpload" accept="image/*" multiple />


                <!-- Preview Grid -->
                <div v-if="filePreviews.length > 0" class="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    <div v-for="(preview, index) in filePreviews" :key="index" class="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <img :src="preview.url || preview" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" @click.stop="removeImage(index)" class="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all">
                                <i class="fas fa-trash-alt text-xs"></i>
                            </button>
                        </div>
                        <!-- Mobile Remove Button (Always Visible) -->
                        <button type="button" @click.stop="removeImage(index)" class="md:hidden absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md">
                            <i class="fas fa-times text-[10px]"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium text-center border border-red-100">
                <i class="fas fa-exclamation-circle mr-2"></i> {{ error }}
            </div>

        </form>
      </div>
    </div>


    <!-- Mobile Sticky Bottom Action Bar -->
    <div class="md:hidden fixed bottom-[65px] left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button 
            @click="submitProduct" 
            :disabled="loading" 
            class="w-full text-white rounded-2xl py-4 font-bold text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 bg-gray-900 shadow-gray-200"
        >
            <i v-if="loading" class="fas fa-circle-notch animate-spin"></i>
            <span v-else>{{ isEdit ? 'Enregistrer les modifications' : 'Créer le produit' }}</span>
        </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import { useUiStore } from '@/stores/ui';

const router = useRouter();
const route = useRoute();
const uiStore = useUiStore();
const loading = ref(false);
const error = ref('');
const categories = ref<any[]>([]);

const mainImageInput = ref<HTMLInputElement | null>(null);
const desktopFileInput = ref<HTMLInputElement | null>(null);
const mobileFileInput = ref<HTMLInputElement | null>(null);

const isEdit = computed(() => !!route.params.id);
const productId = computed(() => route.params.id as string);

const showCategoryDropdown = ref(false); // for custom dropdown

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 1,
  category_id: null,
  brand_id: null,
  image_url: '',
  images: [] as string[]
});

const brands = ref<any[]>([]);
const showBrandDropdown = ref(false);

const selectedCategoryName = computed(() => {
    if (!form.category_id) return 'Sélectionner une catégorie';
    const cat = categories.value.find(c => c.id === form.category_id);
    return cat ? cat.name : 'Sélectionner une catégorie';
});

const selectedBrandName = computed(() => {
    if (!form.brand_id) return 'Sélectionner une marque (Optionnel)';
    const brand = brands.value.find(b => b.id === form.brand_id);
    return brand ? brand.name : 'Sélectionner une marque (Optionnel)';
});

const selectCategory = (id: any) => {
    form.category_id = id;
    showCategoryDropdown.value = false;
};

const selectBrand = (id: any) => {
    form.brand_id = id;
    showBrandDropdown.value = false;
};

// Separate previews for better UX
const selectedFiles = ref<File[]>([]);
const filePreviews = ref<any[]>([]); 

// Helper for the main circular image on mobile
const mainImagePreview = computed(() => {
    // If we have previews, show the first one
    if (filePreviews.value.length > 0) {
        return filePreviews.value[0].url || filePreviews.value[0];
    }
    // Else fall back to form data
    if (form.image_url) return form.image_url;
    return null;
});


onMounted(async () => {
    try {
        const [catRes, brandRes] = await Promise.all([
            api.get('/categories'),
            api.get('/brands')
        ]);
        categories.value = catRes.data;
        brands.value = brandRes.data;

        if (isEdit.value) {
            fetchProduct();
        }
    } catch (e) {
        console.error("Failed to load metadata", e);
    }
});

const fetchProduct = async () => {
    try {
        loading.value = true;
        const res = await api.get(`/products/${productId.value}`);
        const product = res.data;
        
        form.name = product.name;
        form.description = product.description;
        form.price = product.price;
        form.stock = product.stock;
        form.category_id = product.category_id;
        form.brand_id = product.brand_id;
        form.image_url = product.image_url;
        form.images = product.images || [];
        
        // Initialize previews from existing images
        if (product.image_url) {
             // Avoid duplicates if image_url is also in images array
             if (!form.images.includes(product.image_url)) {
                 filePreviews.value.push({ url: product.image_url, isNew: false });
             }
        }
        
        if (product.images && product.images.length > 0) {
            product.images.forEach((img: any) => {
                 const url = typeof img === 'object' ? img.url : img;
                 filePreviews.value.push({ url, isNew: false, raw: img });
            });
        }
    } catch (err: any) {
        console.error("Failed to fetch product", err);
        error.value = "Erreur lors de la récupération du produit.";
    } finally {
        loading.value = false;
    }
};

const handleMainImageUpload = (e: Event) => {
    // Treat as adding the FIRST image
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
        // Clear existing first image if replacing main? Or just append to start?
        // Let's prepend to list
        const file = input.files[0];
        addFile(file, true);
    }
    input.value = '';
};

const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        const files = Array.from(input.files);
        files.forEach(file => addFile(file));
    }
    input.value = '';
};

const addFile = (file: File, atStart = false) => {
     if (file.size > 5 * 1024 * 1024) {
        uiStore.showToast(`Fichier ${file.name} trop volumineux (max 5MB)`, "warning");
        return;
     }

     if (filePreviews.value.length >= 5) {
         uiStore.showToast("Maximum 5 photos autorisées", "warning");
         return;
     }

     const reader = new FileReader();
     reader.onload = (e) => {
         if (e.target?.result) {
             const previewObj = {
                 url: e.target.result as string,
                 file: file,
                 isNew: true
             };
             
             if (atStart) {
                 selectedFiles.value.unshift(file);
                 filePreviews.value.unshift(previewObj);
             } else {
                 selectedFiles.value.push(file);
                 filePreviews.value.push(previewObj);
             }
         }
     };
     reader.readAsDataURL(file);
};

const removeImage = (index: number) => {
    const preview = filePreviews.value[index];
    if (preview.isNew) {
        const fileIndex = selectedFiles.value.indexOf(preview.file);
        if (fileIndex > -1) selectedFiles.value.splice(fileIndex, 1);
    } 
    // If it was an existing image (isNew: false), we just remove it from the preview list.
    // Ideally we should track 'deleted' images to send to backend if needed, 
    // but here we just reconstruct the list on submit.
    
    filePreviews.value.splice(index, 1);
};

const submitProduct = async () => {
  loading.value = true;
  error.value = '';

  try {
     const productData = { ...form };
     
     // 1. Filter out remaining existing images from previews
     const remainingExistingImages = filePreviews.value
        .filter(p => !p.isNew)
        .map(p => p.raw || p.url);
        
     // 2. Upload NEW files
     let newUploadedHybrid: any[] = [];
     if (selectedFiles.value.length > 0) {
         const formData = new FormData();
         selectedFiles.value.forEach(file => {
             formData.append('images', file);
         });
         
         const uploadRes = await api.post('/upload', formData, {
             headers: { 'Content-Type': 'multipart/form-data' }
         });
         
         // Use the hybrid response from our new backend strategy
         newUploadedHybrid = uploadRes.data.hybrid || uploadRes.data.urls.map((u: string) => ({ url: u, fallback: u }));
     }

     const allImages = [...remainingExistingImages, ...newUploadedHybrid];
     
     const firstImg = allImages[0];
     productData.image_url = (firstImg && typeof firstImg === 'object') ? firstImg.url : (firstImg || '');
     productData.images = allImages;

     if (isEdit.value) {
         await api.put(`/products/${productId.value}`, productData);
         uiStore.showToast('Produit mis à jour avec succès !', 'success');
     } else {
         await api.post('/products', productData);
         uiStore.showToast('Produit créé avec succès !', 'success');
     }
     router.push('/seller/products'); 
  } catch (err: any) {
    console.error(err);
    if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        error.value = err.response.data.errors.join(' | ');
    } else {
        error.value = err.response?.data?.message || err.response?.data?.error || "Erreur lors de l'enregistrement.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

