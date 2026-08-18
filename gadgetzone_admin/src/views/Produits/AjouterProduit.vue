<template>
  <div class="p-4 sm:p-6">
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="max-w-6xl mx-auto">
      <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <!-- Header -->
        <div class="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-3">
            <div class="p-2 bg-primary-600 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            {{ isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit' }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Remplissez les informations ci-dessous pour {{ isEditing ? 'mettre à jour' : 'ajouter' }} un produit
          </p>
        </div>

        <form @submit.prevent="submitForm" class="p-4 sm:p-6 space-y-8">
          <!-- Section 1: Informations de base -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Informations de base</h3>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div class="lg:col-span-2">
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="name">
                  Nom du produit <span class="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  v-model="produit.name"
                  type="text"
                  required
                  class="form-input w-full"
                  placeholder="Ex: iPhone 15 Pro Max 256GB"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="price">
                  Prix (HTG) <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">HTG</span>
                  <input
                    id="price"
                    v-model.number="produit.price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="form-input w-full pl-16"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="stock">
                  Quantité en stock <span class="text-red-500">*</span>
                </label>
                <input
                  id="stock"
                  v-model.number="produit.stock"
                  type="number"
                  min="0"
                  required
                  class="form-input w-full"
                  placeholder="0"
                />
              </div>

              <div class="lg:col-span-2">
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="category_id">
                  Catégorie <span class="text-red-500">*</span>
                </label>
                <select
                  id="category_id"
                  v-model.number="produit.category_id"
                  required
                  class="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option :value="null">Sélectionnez une catégorie</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div class="lg:col-span-2">
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="brand_id">
                  Marque
                </label>
                <select
                  id="brand_id"
                  v-model.number="produit.brand_id"
                  class="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option :value="null">Sélectionnez une marque (optionnel)</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                    {{ brand.name }}
                  </option>
                </select>
              </div>

              <div class="lg:col-span-2">
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="description">
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="produit.description"
                  rows="4"
                  class="form-textarea w-full"
                  placeholder="Décrivez les caractéristiques principales du produit..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Section 2: Spécifications du produit -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Spécifications du produit</h3>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="spec-couleur">
                  Couleur(s) (ex: Noir, Bleu...)
                </label>
                <input
                  id="spec-couleur"
                  v-model="produit.specifications.Couleur"
                  type="text"
                  class="form-input w-full"
                  placeholder="Ex: Noir, Bleu, Blanc"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="spec-taille">
                  Taille / Stockage (ex: M, L ou 128Go...)
                </label>
                <input
                  id="spec-taille"
                  v-model="produit.specifications.Taille"
                  type="text"
                  class="form-input w-full"
                  placeholder="Ex: L ou 128Go, 256Go"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="spec-poids">
                  Poids (ex: 187 g)
                </label>
                <input
                  id="spec-poids"
                  v-model="produit.specifications.Poids"
                  type="text"
                  class="form-input w-full"
                  placeholder="Ex: 187 g"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="spec-dimensions">
                  Dimensions
                </label>
                <input
                  id="spec-dimensions"
                  v-model="produit.specifications.Dimensions"
                  type="text"
                  class="form-input w-full"
                  placeholder="Ex: 159.9 x 76.7 x 8.3 mm"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="spec-autonomie">
                  Autonomie / Batterie
                </label>
                <input
                  id="spec-autonomie"
                  v-model="produit.specifications.Autonomie"
                  type="text"
                  class="form-input w-full"
                  placeholder="Ex: Jusqu'à 20 heures"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="spec-garantie">
                  Garantie
                </label>
                <input
                  id="spec-garantie"
                  v-model="produit.specifications.Garantie"
                  type="text"
                  class="form-input w-full"
                  placeholder="Ex: 1 An"
                />
              </div>
            </div>

            <!-- Spécifications personnalisées -->
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
                Autres spécifications personnalisées
              </h4>
              
              <!-- Liste des caractéristiques personnalisées existantes -->
              <div class="space-y-3 mb-4">
                <div v-for="(val, key) in customSpecs" :key="key" class="flex gap-3 items-center bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span class="text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 min-w-[120px]">
                    {{ key }}
                  </span>
                  <input
                    v-model="produit.specifications[key]"
                    type="text"
                    class="flex-1 form-input"
                  />
                  <button
                    type="button"
                    @click="removeCustomSpec(key as string)"
                    class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Formulaire d'ajout rapide d'une nouvelle caractéristique -->
              <div class="flex flex-col sm:flex-row gap-3 max-w-2xl bg-gray-50/50 dark:bg-gray-800/20 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <input
                  v-model="newCustomKey"
                  type="text"
                  placeholder="Caractéristique (ex: RAM, Matériau...)"
                  class="form-input sm:w-1/2"
                />
                <input
                  v-model="newCustomValue"
                  type="text"
                  placeholder="Valeur (ex: 8Go, Aluminium...)"
                  class="form-input flex-1"
                  @keyup.enter="addCustomSpec"
                />
                <button
                  type="button"
                  @click="addCustomSpec"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <!-- Section 3: Images du produit -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Images du produit</h3>
            </div>

            <!-- Zone de dépôt -->
            <div
              @dragover.prevent
              @drop.prevent="handleDrop"
              @click="fileInput?.click()"
              class="relative mt-1 flex justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 pb-6 pt-5 transition-all hover:border-primary-500 hover:bg-primary-50 dark:hover:border-primary-500 dark:hover:bg-primary-900/10 cursor-pointer group"
            >
              <div class="space-y-2 text-center">
                <svg class="mx-auto h-16 w-16 text-gray-400 group-hover:text-primary-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex flex-col items-center text-sm text-gray-600 dark:text-gray-400">
                  <span class="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                    <span>Télécharger une image</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      class="sr-only"
                      accept="image/*"
                      @change="handleFileUpload"
                      ref="fileInput"
                    />
                  </span>
                  <p class="pl-1">ou glissez-déposez</p>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF jusqu'à 10MB
                </p>
              </div>
            </div>

            <!-- Aperçu des images -->
            <div v-if="produit.images && produit.images.length > 0" class="mt-6">
              <h4 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Aperçu des images ({{ produit.images.length }})
              </h4>
              <p class="text-xs text-gray-500 mb-4">La première image sera l'image principale. Cliquez sur "Définir principale" pour changer.</p>
              
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div 
                  v-for="(img, index) in produit.images" 
                  :key="index"
                  class="group relative aspect-square rounded-lg overflow-hidden border-2 transition-all"
                  :class="index === 0 ? 'border-primary-500 ring-2 ring-primary-200 ring-offset-2' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
                >
                  <img alt="" :src="img" class="h-full w-full object-cover" />
                  
                  <!-- Badge Principale -->
                  <div v-if="index === 0" class="absolute top-2 left-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    Principale
                  </div>

                  <!-- Overlay Actions -->
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <button
                      v-if="index !== 0"
                      type="button"
                      @click.stop="setMainImage(index)"
                      class="px-3 py-1 bg-white text-gray-900 text-xs font-medium rounded hover:bg-gray-100 w-full"
                    >
                      Définir principale
                    </button>
                    <button
                      type="button"
                      @click.stop="removeImage(index)"
                      class="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 w-full flex items-center justify-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Vidéo du produit -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Vidéo du produit (optionnel)</h3>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300" for="video_url">
                  URL de la vidéo (Direct MP4, YouTube, Cloudinary, etc.)
                </label>
                <div class="flex gap-3">
                  <input
                    id="video_url"
                    v-model="produit.video_url"
                    type="text"
                    class="form-input w-full"
                    placeholder="Ex: https://res.cloudinary.com/.../video.mp4"
                  />
                  <button
                    v-if="produit.video_url"
                    type="button"
                    @click="produit.video_url = ''"
                    class="px-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <!-- Upload local video -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ou téléverser un fichier vidéo local (Max 50MB)
                </label>
                <div class="flex items-center gap-4">
                  <button
                    type="button"
                    @click="videoFileInput?.click()"
                    :disabled="uploadingVideo"
                    class="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <svg v-if="uploadingVideo" class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {{ uploadingVideo ? 'Téléversement de la vidéo...' : 'Choisir une vidéo' }}
                  </button>
                  <input
                    type="file"
                    ref="videoFileInput"
                    class="hidden"
                    accept="video/*"
                    @change="handleVideoUpload"
                  />
                  <span v-if="uploadingVideo" class="text-xs text-gray-500">Veuillez patienter pendant le traitement...</span>
                </div>
              </div>

              <!-- Prévisualisation vidéo -->
              <div v-if="produit.video_url" class="max-w-md mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <video
                  v-if="produit.video_url.endsWith('.mp4') || produit.video_url.includes('cloudinary') || produit.video_url.includes('/uploads/')"
                  :src="produit.video_url"
                  controls
                  class="w-full aspect-video bg-black"
                ></video>
                <div v-else class="p-4 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500">
                  Prévisualisation vidéo non disponible pour ce type de lien externe (ex: YouTube).
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="$router.go(-1)"
              class="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="hidden sm:inline">Annuler</span>
              </span>
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <span class="flex items-center gap-2">
                <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-white font-bold hidden sm:inline">
                  {{ loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour le produit' : 'Enregistrer le produit') }}
                </span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import { productService, categoryService, brandService, api } from '@/services/api';

const router = useRouter();
const route = useRoute();
const currentPageTitle = ref('Ajouter un produit');
const isEditing = ref(false);
const loading = ref(false);

// Vérifier si on est en mode édition (simulation)
const productId = route.params.id as string;
if (productId) {
  currentPageTitle.value = 'Modifier un produit';
  isEditing.value = true;
  setTimeout(() => {
    produit.value = {
      id: parseInt(productId),
      name: 'iPhone 15 Pro (exemple)',
      description: 'Dernier iPhone avec processeur A17 Pro',
      price: 120000,
      stock: 25,
      category_id: 1,
      image_url: 'https://placehold.co/300x300/3B82F6/FFFFFF?text=Product',
      images: ['https://placehold.co/300x300/3B82F6/FFFFFF?text=Product'], // Init images array
      brand_id: null,
      video_url: '',
      specifications: {
        Couleur: 'Gris',
        Taille: '128Go',
        Poids: '187g',
        Dimensions: '159.9 x 76.7 x 8.3 mm',
        Autonomie: 'Jusqu\'à 20 heures',
        Garantie: '1 An'
      }
    };
    loading.value = false;
  }, 500);
}

const uploadingVideo = ref(false);
const videoFileInput = ref<HTMLInputElement | null>(null);

const handleVideoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  if (file.size > 50 * 1024 * 1024) {
    alert("Le fichier vidéo est trop volumineux (max 50 Mo).");
    input.value = '';
    return;
  }

  try {
    uploadingVideo.value = true;
    const formData = new FormData();
    formData.append('video', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data && response.data.video) {
      produit.value.video_url = response.data.video.url;
      alert("Vidéo téléversée avec succès !");
    } else {
      throw new Error("Erreur de format de réponse.");
    }
  } catch (error: any) {
    console.error('Erreur lors du téléversement de la vidéo:', error);
    alert("Échec du téléversement de la vidéo.");
  } finally {
    uploadingVideo.value = false;
    input.value = '';
  }
};

const categories = ref<any[]>([]);

const loadCategories = async () => {
  try {
    const data = await categoryService.getAll() as any;
    categories.value = Array.isArray(data) ? data : (data.categories || []);
  } catch (error) {
    console.error('Erreur chargement catégories', error);
  }
};

const brands = ref<any[]>([]);

const loadBrands = async () => {
  try {
    const data = await brandService.getAll();
    brands.value = data;
  } catch (error) {
    console.error('Erreur chargement marques', error);
  }
};

const produit = ref({
  id: null as number | null,
  name: '',
  description: '',
  price: null as number | null,
  stock: 0,
  category_id: null as number | null,
  brand_id: null as number | null,
  image_url: '', // Main image (first one)
  images: [] as string[], // All images
  video_url: '', // Video URL
  specifications: {
    Couleur: '',
    Taille: '',
    Poids: '',
    Dimensions: '',
    Autonomie: '',
    Garantie: ''
  } as Record<string, string>
});

const newCustomKey = ref('');
const newCustomValue = ref('');
const standardKeys = ['Couleur', 'Taille', 'Poids', 'Dimensions', 'Autonomie', 'Garantie', 'Color', 'Size', 'Weight'];

const customSpecs = computed(() => {
  const custom: Record<string, string> = {};
  if (!produit.value.specifications) return custom;
  Object.keys(produit.value.specifications).forEach(k => {
    if (!standardKeys.includes(k)) {
      custom[k] = produit.value.specifications[k] || '';
    }
  });
  return custom;
});

const addCustomSpec = () => {
  const key = newCustomKey.value.trim();
  const val = newCustomValue.value.trim();
  if (!key || !val) return;
  if (!produit.value.specifications) {
    produit.value.specifications = {};
  }
  produit.value.specifications[key] = val;
  newCustomKey.value = '';
  newCustomValue.value = '';
};

const removeCustomSpec = (key: string) => {
  if (produit.value.specifications) {
    delete produit.value.specifications[key];
  }
};

const fileInput = ref<HTMLInputElement | null>(null);

// Charger le produit si en mode édition
const loadProduit = async () => {
  if (!isEditing.value) return;

  try {
    loading.value = true;
    const product = await productService.getById(parseInt(productId));
    if (product) {
      // Ensure images array exists
      const images = (product as any).images || (product.image_url ? [product.image_url] : []);
      
      const fetchedSpecs = (product as any).specifications || {};
      produit.value = {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category_id: product.category_id || null,
        brand_id: (product as any).brand_id || null,
        image_url: product.image_url || '',
        images: images,
        video_url: (product as any).video_url || '',
        specifications: {
          Couleur: fetchedSpecs.Couleur || fetchedSpecs.Color || '',
          Taille: fetchedSpecs.Taille || fetchedSpecs.Size || '',
          Poids: fetchedSpecs.Poids || fetchedSpecs.Weight || '',
          Dimensions: fetchedSpecs.Dimensions || '',
          Autonomie: fetchedSpecs.Autonomie || '',
          Garantie: fetchedSpecs.Garantie || '',
          ...fetchedSpecs
        }
      };
    }
  } catch (error) {
    console.error('Error loading product:', error);
    alert('Erreur lors du chargement du produit');
    router.push('/liste-produits');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCategories();
  loadBrands();
  loadProduit();
});

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    // Process all selected files
    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageUrl = e.target.result as string;
          // Add to images array
          produit.value.images.push(imageUrl);
          // Set as main image if it's the first one
          if (produit.value.images.length === 1) {
            produit.value.image_url = imageUrl;
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }
};

const removeImage = (index: number) => {
  produit.value.images.splice(index, 1);
  // Update main image if needed
  if (produit.value.images.length > 0) {
    produit.value.image_url = produit.value.images[0];
  } else {
    produit.value.image_url = '';
  }
};

const setMainImage = (index: number) => {
  const image = produit.value.images[index];
  // Move to front of array
  produit.value.images.splice(index, 1);
  produit.value.images.unshift(image);
  produit.value.image_url = image;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    const input = document.createElement('input');
    input.type = 'file';
    input.files = e.dataTransfer.files;
    const event = new Event('change');
    Object.defineProperty(event, 'target', { value: { files: e.dataTransfer.files } });
    handleFileUpload(event);
  }
};

const validateForm = () => {
  if (!produit.value.name?.trim()) return 'Le nom du produit est obligatoire.';
  if (!produit.value.price || produit.value.price <= 0) return 'Le prix doit être supérieur à 0.';
  if (produit.value.stock === null || produit.value.stock < 0) return 'Le stock ne peut pas être négatif.';
  if (!produit.value.category_id) return 'Veuillez sélectionner une catégorie.';
  if (produit.value.images.length === 0) return 'Veuillez ajouter au moins une image.';
  return null;
};

const submitForm = async () => {
  const validationError = validateForm();
  if (validationError) {
    alert(validationError);
    return;
  }

  try {
    loading.value = true;

    const cleanedSpecs: Record<string, string> = {};
    if (produit.value.specifications) {
      Object.keys(produit.value.specifications).forEach(k => {
        const val = produit.value.specifications[k];
        if (val && String(val).trim() !== '') {
          cleanedSpecs[k] = String(val).trim();
        }
      });
    }

    const productData = {
      name: produit.value.name,
      description: produit.value.description,
      price: produit.value.price || 0,
      stock: produit.value.stock,
      category_id: produit.value.category_id,
      brand_id: produit.value.brand_id,
      image_url: produit.value.image_url,
      images: produit.value.images,
      video_url: produit.value.video_url,
      specifications: cleanedSpecs,
    };

    if (isEditing.value && produit.value.id) {
      // Mode édition : mettre à jour le produit existant
      await productService.update(produit.value.id, productData);
      console.log('Produit modifié (API):', productData);
      alert('Produit modifié avec succès !');
    } else {
      // Mode ajout : créer un nouveau produit
      await productService.create(productData as any);
      console.log('Produit ajouté (API):', productData);
      alert('Produit ajouté avec succès !');
    }

    // Rediriger vers la liste des produits
    router.push('/liste-produits');
  } catch (error: any) {
    console.error('Erreur lors de la sauvegarde du produit :', error);
    const message = error.response?.data?.details || error.response?.data?.error || error.message || 'Une erreur est survenue';
    alert(`Erreur lors de la sauvegarde : ${message}`);
  } finally {
    loading.value = false;
  }
};
</script>
