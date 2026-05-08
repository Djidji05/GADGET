<template>
  <div class="container mx-auto px-4 pt-4 pb-12">
    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="h-96 bg-gray-300 rounded-lg"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-300 rounded w-3/4"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2"></div>
          <div class="h-4 bg-gray-300 rounded w-1/4"></div>
          <div class="h-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Product Details -->
    <!-- Product Content (Visible only when product is loaded) -->
    <div v-else-if="product">
      <!-- Main Product Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Product Images -->
        <!-- Product Images -->
        <div>
          <!-- Mobile: Swipe Gallery -->
          <div class="md:hidden relative mb-6">
            <div 
              class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-2xl bg-gray-100 aspect-square"
              @scroll="handleMobileScroll"
            >
              <div 
                v-for="(img, index) in productImages" 
                :key="index"
                class="w-full flex-shrink-0 snap-center"
                @click="openLightbox(index)"
              >
                <img 
                  :src="img" 
                  :alt="`${product.name} view ${index + 1}`" 
                  class="w-full h-full object-cover" 
                  @error="handleImageError(index)"
                />
              </div>
            </div>
            
            <!-- Indicators -->
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full pointer-events-none">
               <div 
                 v-for="(_, index) in productImages" 
                 :key="index"
                 class="w-2 h-2 rounded-full transition-all duration-300"
                 :class="currentImageIndex === index ? 'bg-white w-4' : 'bg-white/50'"
               ></div>
            </div>
          </div>

          <!-- Desktop: Main Image + Thumbnails Below -->
          <div class="hidden md:block">
            <div class="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group mb-4 border border-gray-100 cursor-zoom-in" @click="openLightbox(currentImageIndex)">
              <img
                :src="selectedImage"
                :alt="product.name"
                class="w-full h-full object-contain p-4"
                @error="handleImageError(currentImageIndex)"
              />
              
              <!-- Navigation Buttons -->
              <button 
                @click.stop="prevImage"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                v-if="productImages.length > 1"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <button 
                @click.stop="nextImage"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                v-if="productImages.length > 1"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <!-- Thumbnails Gallery (Below) -->
            <div class="grid grid-cols-5 gap-3">
              <div 
                v-for="(img, index) in productImages" 
                :key="index"
                class="aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200"
                :class="currentImageIndex === index ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-300 scale-95 hover:scale-100'"
                @click="currentImageIndex = index"
              >
                <img 
                  :src="img" 
                  :alt="`${product.name} thumbnail ${index + 1}`" 
                  class="w-full h-full object-cover" 
                  @error="handleImageError(index)"
                />
              </div>
            </div>
          </div>

          <!-- Seller Info (Under Image) - Sync with Buy Box -->
          <div v-if="product.buyBox || product.store" class="mt-4 text-center">
            <span class="text-sm text-gray-500">{{ $t('products.sold_by') }}</span>
            <router-link 
              :to="{ name: 'products', query: { vendor: product.buyBox ? product.buyBox.storeId : product.store?.id } }"
              class="ml-1 text-sm font-semibold text-gray-900 hover:text-blue-600 hover:underline transition-colors"
            >
              {{ product.buyBox ? (product.buyBox.store?.name || $t('products.certified_vendor')) : product.store?.name }}
            </router-link>
          </div>
        </div>

        <!-- Product Info Column -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>

          <!-- Price & Buy Box Badge -->
          <div class="mb-4 flex flex-col gap-2">
            <div v-if="product.buyBox" class="flex items-center gap-2">
               <span class="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                {{ $t('products.best_price') }}
              </span>
              <span v-if="(product.offers?.length || 0) > 1" class="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                {{ $t('products.offers_available', { count: product.offers?.length || 0 }) }}
              </span>
            </div>

            <div class="flex items-center gap-4">
              <span class="text-3xl font-bold text-primary-600">
                {{ formatPrice(product.buyBox ? product.buyBox.price : product.price) }}
              </span>
              <div v-if="hasDiscount" class="flex flex-col">
                <span class="text-lg text-gray-400 line-through font-medium">
                  {{ formatPrice(Number(product.original_price || 0)) }}
                </span>
                <span class="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {{ $t('products.save', { count: discountPercentage }) }}
                </span>
              </div>
            </div>
            
            <!-- Winning Seller Info -->
            <div v-if="product.buyBox" class="flex items-center gap-2 text-sm">
                <span class="text-gray-500">{{ $t('products.sold_by') }}</span>
                <router-link 
                  :to="{ name: 'products', query: { vendor: product.buyBox.storeId } }"
                  class="font-bold text-gray-900 hover:text-blue-600 flex items-center gap-1"
                >
                  {{ product.buyBox.store?.name || $t('products.certified_vendor') }}
                  <i class="las la-certificate text-blue-500 text-xs" :title="$t('products.recommended_vendor')"></i>
                </router-link>
            </div>
          </div>
          
          <!-- Stock / Availability -->
          <div class="mb-6">
            <div v-if="product.stock > 0" class="flex items-center gap-2 text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-xl inline-flex border border-green-100">
              <i class="las la-check-circle text-xl"></i>
              <span>{{ $t('products.qty_available_stock', { count: product.stock }) }}</span>
            </div>
            <div v-else class="flex flex-col gap-1 bg-amber-50 border border-amber-100 p-4 rounded-xl">
              <div class="flex items-center gap-2 text-amber-600 font-bold">
                <i class="las la-truck text-xl"></i>
                <span>{{ $t('products.delivery_estimated', { date: formatDeliveryDate(20) }) }}</span>
              </div>
            </div>
          </div>





          <!-- Description (Expandable) -->
          <div class="mb-6">
            <div 
              class="text-gray-600 whitespace-pre-line break-words"
              :class="{'line-clamp-1': !isDescriptionExpanded}"
            >
              {{ product.description }}
            </div>
            
            <button 
              @click="isDescriptionExpanded = !isDescriptionExpanded" 
              class="text-primary-600 text-sm font-medium hover:underline mt-2 inline-flex items-center gap-1"
            >
              {{ isDescriptionExpanded ? $t('products.see_less') : $t('products.see_full_description') }}
              <i :class="isDescriptionExpanded ? 'las la-angle-up' : 'las la-angle-down'"></i>
            </button>

            <!-- Features (Visible only when expanded) -->
            <div v-if="isDescriptionExpanded && product.features && product.features.length > 0" class="mt-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-fade-in">
              <h4 class="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">{{ $t('products.features') }}</h4>
              <ul class="space-y-2">
                <li v-for="(feature, index) in product.features" :key="index" class="flex items-start text-sm text-gray-700">
                  <i class="las la-check text-green-500 mr-2 mt-0.5"></i>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
            
            <!-- Specs (Visible only when expanded) -->
             <div v-if="isDescriptionExpanded && product.specifications && Object.keys(product.specifications).length > 0" class="mt-6">
                <h4 class="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">{{ $t('products.specifications') }}</h4>
                <div class="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden text-sm">
                  <div v-for="(value, key, index) in product.specifications" :key="key" 
                    class="flex py-2 px-4 border-b border-gray-200 last:border-0"
                    :class="index % 2 === 0 ? '' : 'bg-gray-100/50'"
                  >
                    <span class="font-medium text-gray-900 w-1/3">{{ key }}</span>
                    <span class="text-gray-600 w-2/3">{{ value }}</span>
                  </div>
                </div>
             </div>
          </div>


          <!-- Actions -->
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  type="button"
                  @click="quantity > 1 && quantity--"
                  :disabled="quantity <= 1"
                  class="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  :aria-label="$t('products.decrease_qty')"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  :min="1"
                  class="w-16 text-center border-0 focus:outline-none bg-transparent"
                  :aria-label="$t('nav.quantity')"
                />
                <button
                  type="button"
                  @click="quantity++"
                  class="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  :aria-label="$t('products.increase_qty')"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>

            <button
              @click="addToCart(product.buyBox)"
              :disabled="isAddingToCart || (product.buyBox && product.buyBox.stock <= 0)"
              class="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center py-3"
            >
              <i v-if="isAddingToCart" class="las la-spinner la-spin mr-2"></i>
              <i v-else class="las la-shopping-cart mr-2"></i>
              {{ (product.buyBox && product.buyBox.stock <= 0) ? $t('products.outOfStock') : $t('products.addToCart') }}
            </button>
          </div>

          <!-- Other Offers Section -->
          <div v-if="(product?.offers?.length || 0) > 1" class="mt-8 border-t border-gray-100 pt-6">
            <h3 class="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2">
              <i class="las la-exchange-alt text-blue-600"></i>
              {{ $t('products.other_offers') }}
            </h3>
            
            <div class="space-y-3">
              <div 
                v-for="offer in (product?.offers ? product.offers.filter(o => o.id !== product?.buyBox?.id) : [])" 
                :key="offer.id"
                class="bg-gray-50 p-4 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
              >
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-gray-900">{{ offer.store?.name }}</span>
                    <span class="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold">{{ offer.condition === 'new' ? $t('products.new') : $t('products.refurbished') }}</span>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ $t('products.approx_delivery', { min: offer.shipping_days_min, max: offer.shipping_days_max }) }}
                  </div>
                </div>
                
                <div class="text-right flex items-center gap-4">
                  <div class="flex flex-col">
                    <span class="font-black text-gray-900 text-lg">{{ formatPrice(offer.price) }}</span>
                    <span v-if="offer.stock < 5" class="text-[10px] text-orange-600 font-bold">{{ $t('products.only_left', { count: offer.stock }) }}</span>
                  </div>
                  <button 
                    @click="addToCart(offer)"
                    :disabled="isAddingToCart"
                    class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                  >
                    <i class="las la-cart-plus text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section (Moved out of details-section) -->
      <div id="reviews-section" class="mt-16 max-w-4xl mx-auto">
        <section class="mb-16">
           <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <i class="las la-star text-xl"></i>
              </span>
              {{ $t('products.customer_reviews') }} <span class="text-gray-400 text-lg ml-2 font-normal">({{ reviews.length }})</span>
            </h2>
            <button v-if="authStore.isAuthenticated" @click="showReviewForm = !showReviewForm" class="px-5 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-transparent rounded-xl transition-all shadow-sm">
              <i :class="showReviewForm ? 'las la-times' : 'las la-pen'"></i> {{ showReviewForm ? $t('common.close') : $t('products.write_review') }}
            </button>
          </div>
          
          <!-- Review Form -->
          <div v-if="showReviewForm" class="bg-white p-6 rounded-2xl mb-8 border border-blue-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] animate-fade-in">
            <h3 class="font-bold text-lg mb-4 text-gray-900">{{ $t('products.rate_product') }}</h3>
            <div class="mb-4">
              <div class="flex text-3xl text-yellow-400 cursor-pointer mb-2">
                <span v-for="n in 5" :key="n" @click="newReview.rating = n" class="hover:scale-110 transition-transform">
                  <i :class="n <= newReview.rating ? 'fas fa-star' : 'far fa-star'"></i>
                </span>
              </div>
            </div>
            <div class="mb-5">
              <textarea v-model="newReview.comment" class="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all p-4 text-sm" rows="3" :placeholder="$t('products.comment_placeholder')"></textarea>
            </div>
            <div class="mb-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
              <label class="cursor-pointer flex flex-col items-center justify-center gap-2">
                <i class="las la-camera text-3xl text-gray-400"></i>
                <span class="text-sm font-medium text-gray-600">{{ $t('products.add_photo') }}</span>
                <input type="file" accept="image/*" @change="handleReviewImageUpload" class="hidden" />
              </label>
              <div v-if="uploadingReviewImage" class="text-xs text-blue-600 mt-2"><i class="las la-spinner la-spin"></i> {{ $t('products.uploading_image') }}</div>
              <div v-if="newReviewImage" class="mt-4 relative inline-block">
                <img :src="newReviewImage" class="h-24 object-cover rounded-lg shadow-sm border border-gray-200" />
                <button @click="newReviewImage = ''" class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:scale-110 shadow-lg text-sm transition-transform"><i class="las la-times"></i></button>
              </div>
            </div>
            <div class="flex justify-end">
              <button @click="submitReview" :disabled="isSubmittingReview || uploadingReviewImage" class="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md shadow-blue-500/20">
                <i v-if="isSubmittingReview" class="las la-spinner la-spin mr-2"></i>
                {{ $t('products.publish_review') }}
              </button>
            </div>
          </div>
          
          <div class="space-y-4">
            <div v-if="reviews.length === 0" class="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <i class="las la-comment bg-transparent text-3xl text-gray-300"></i>
              </div>
              <p class="text-gray-500 font-medium">{{ $t('products.no_reviews') }}</p>
            </div>

            <div 
              v-for="review in reviews" 
              :key="review.id" 
              class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold mr-3 shadow-md">
                    {{ getReviewerInitial(review) }}
                  </div>
                  <div>
                     <div class="font-bold text-gray-900">{{ getReviewerName(review) }}</div>
                     <div class="text-gray-400 text-xs mt-0.5">{{ formatDate(review.createdAt) }}</div>
                  </div>
                </div>
                <div class="flex text-yellow-400 text-sm bg-yellow-50 px-2 py-1 rounded-lg">
                  <span v-for="n in 5" :key="n">
                    <i :class="n <= review.rating ? 'fas fa-star' : 'far fa-star'"></i>
                  </span>
                </div>
              </div>
              <p class="text-gray-600 leading-relaxed pl-[52px]">{{ review.comment }}</p>
              
              <!-- Review Images -->
              <div v-if="review.images && review.images.length > 0" class="flex flex-wrap gap-2 mt-4 pl-[52px]">
                <div v-for="(img, idx) in review.images" :key="idx" class="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 cursor-zoom-in" @click="openReviewImage(img)">
                  <img :src="getImageUrl(img)" class="w-full h-full object-cover hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-16">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ $t('products.similar_products') }}</h2>
          <div class="flex gap-2">
            <button 
              @click="scrollRelated('left')"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              aria-label="Scroll left"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button 
              @click="scrollRelated('right')"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              aria-label="Scroll right"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div 
          ref="relatedProductsContainer"
          class="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-1"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          <div 
            v-for="related in relatedProducts" 
            :key="related.id"
            class="min-w-[160px] md:min-w-[220px] lg:min-w-[250px]"
          >
             <ProductCard :product="related" />
          </div>
        </div>
      </div>

      <!-- Autres produits du vendeur -->
      <div v-if="sellerProducts.length > 0" class="mt-16">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <i class="fas fa-store text-blue-600"></i>
              </span>
              {{ $t('products.more_from_seller') }}
            </h2>
            <p v-if="product?.store?.name || product?.buyBox?.store?.name" class="text-sm text-gray-400 font-medium mt-1 ml-13 pl-[52px]">
              {{ $t('products.view_store') }}
              <router-link 
                :to="{ name: 'store-view', params: { id: product?.buyBox?.storeId || product?.store?.id } }"
                class="text-blue-600 font-bold hover:underline"
              >
                {{ product?.buyBox?.store?.name || product?.store?.name }}
                <i class="fas fa-arrow-right text-xs ml-1"></i>
              </router-link>
            </p>
          </div>
          <div class="flex gap-2">
            <button 
              @click="scrollSellerProducts('left')"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              aria-label="Scroll left"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button 
              @click="scrollSellerProducts('right')"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              aria-label="Scroll right"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div 
          ref="sellerProductsContainer"
          class="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-1"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          <div 
            v-for="sp in sellerProducts" 
            :key="sp.id"
            class="min-w-[160px] md:min-w-[220px] lg:min-w-[250px]"
          >
            <ProductCard :product="sp" />
          </div>
        </div>
      </div>
    </div>
    <!-- Lightbox Modal -->
    <div v-if="isLightboxOpen" class="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center" @click.self="closeLightbox">
      <button 
        @click="closeLightbox"
        class="absolute top-6 right-6 text-white bg-black/60 p-3 rounded-full hover:bg-white/20 transition-colors z-[10000] shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button 
        @click.stop="prevImage"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-white p-4 rounded-full hover:bg-white/10 transition-colors z-50 hidden md:block"
        v-if="productImages.length > 1"
      >
        <i class="las la-angle-left text-4xl"></i>
      </button>

      <button 
        @click.stop="nextImage"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-white p-4 rounded-full hover:bg-white/10 transition-colors z-50 hidden md:block"
        v-if="productImages.length > 1"
      >
        <i class="las la-angle-right text-4xl"></i>
      </button>

      <div class="w-full h-full flex items-center justify-center p-4">
          <img 
            :src="selectedImage" 
            :alt="product?.name" 
            class="max-w-full max-h-full object-contain select-none transition-transform duration-200 cursor-zoom-in"
            @click.stop="nextImage"
            @error="handleImageError(currentImageIndex)"
          />
      </div>

       <!-- Mobile Thumbnails in Lightbox -->
       <div class="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
          <button
            v-for="(img, index) in productImages" 
            :key="index"
            @click.stop="currentImageIndex = index"
            class="w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0"
            :class="currentImageIndex === index ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-100'"
          >
            <img :src="img" class="w-full h-full object-cover" @error="handleImageError(index)" />
          </button>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { productsService, uploadService, type Product } from '@/services/api'
import ProductCard from '@/components/products/ProductCard.vue'
import { useUiStore } from '@/stores/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

import { useAuthStore } from '@/stores/auth'
import { useHistoryStore } from '@/stores/history'
import { normalizeImageUrl } from '@/utils/urlHelper'

const route = useRoute()
const historyStore = useHistoryStore()
// ... existing content ...

const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const uiStore = useUiStore()

// State
const productId = Number(route.params.id)
const product = ref<Product | null>(null)
const isLoading = ref(true)
const quantity = ref(1)
const isAddingToCart = ref(false)
const currentImageIndex = ref(0)
const isDescriptionExpanded = ref(false)
const isLightboxOpen = ref(false)
const selectedVariant = ref<any>(null)
const displayedImages = ref<string[]>([])

// Reviews State
const reviews = ref<any[]>([])
const showReviewForm = ref(false)
const isSubmittingReview = ref(false)
const uploadingReviewImage = ref(false)
const newReviewImage = ref('')
const newReview = ref({
  rating: 5,
  comment: ''
})

const user = computed(() => authStore.customer)
const userId = computed(() => authStore.customer?.id)

// Computed
const productImages = computed<string[]>(() => {
  if (!product.value) return []
  
  const images: string[] = []
  
  // If variant selected and has own image, put it first
  if (selectedVariant.value && selectedVariant.value.image) {
    images.push(normalizeImageUrl(selectedVariant.value.image))
  }

  // If we have an images array, add them
  if (product.value.images && product.value.images.length > 0) {
    product.value.images.forEach(img => {
      const normalized = normalizeImageUrl(img)
      if (!images.includes(normalized)) {
        images.push(normalized)
      }
    })
  } else if (product.value.image || product.value.image_url) {
    const mainImage = normalizeImageUrl(product.value.image || product.value.image_url)
    if (!images.includes(mainImage)) {
      images.push(mainImage)
    }
  }
  
  // Ensure we have at least some images for demo
  if (images.length === 0) {
    const fallback = 'https://via.placeholder.com/600'
    return [fallback, fallback, fallback, fallback]
  }
  
  return images
})

// Initialize and watch displayedImages
watch(productImages, (newImages) => {
  displayedImages.value = [...newImages]
}, { immediate: true })

const selectedImage = computed(() => {
  if (displayedImages.value.length === 0) return ''
  return displayedImages.value[currentImageIndex.value]
})

const hasDiscount = computed<boolean>(() => {
  if (!product.value) return false
  const price = Number(product.value.price)
  const original = Number(product.value.original_price)
  return original > price
})

const discountPercentage = computed<number>(() => {
  if (!hasDiscount.value || !product.value) return 0
  const price = Number(product.value.price)
  const original = Number(product.value.original_price)
  return Math.round(((original - price) / original) * 100)
})

// Methods
const formatPrice = (priceVal: number) => {
  const currentLocale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
  return new Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency: 'HTG',
    minimumFractionDigits: 0,
  }).format(priceVal).replace('HTG', 'G')
}

const formatDeliveryDate = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  const currentLocale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
  return date.toLocaleDateString(currentLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const nextImage = () => {
  if (productImages.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % productImages.value.length
}

const prevImage = () => {
  if (productImages.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value - 1 + productImages.value.length) % productImages.value.length
}

const handleMobileScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const scrollPosition = target.scrollLeft
  const width = target.offsetWidth
  // Calculate index based on scroll position
  const index = Math.round(scrollPosition / width)
  if (index !== currentImageIndex.value && index >= 0 && index < productImages.value.length) {
    currentImageIndex.value = index
  }
}

const openLightbox = (index: number) => {
  currentImageIndex.value = index
  isLightboxOpen.value = true
  document.body.style.overflow = 'hidden' // Lock scroll
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  document.body.style.overflow = '' // Unlock scroll
}

const handleImageError = (index: number) => {
  if (!product.value || !product.value.images) return
  
  // Find the corresponding hybrid object in product.images
  // productImages index might include variants, but fallback is likely only for core images
  const originalImages = product.value.images
  if (originalImages[index] && typeof originalImages[index] === 'object') {
    const imgObj = originalImages[index] as any
    const fallback = normalizeImageUrl(imgObj.fallback)
    if (displayedImages.value[index] !== fallback) {
        console.warn(`Fallback triggered for product ${productId} at index ${index}: ${fallback}`)
        displayedImages.value[index] = fallback
    }
  }
}

const addToCart = async (offer: any = null) => {
  if (!product.value || isAddingToCart.value) return

  try {
    isAddingToCart.value = true
    
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    const itemPrice = offer ? Number(offer.price) : Number(product.value.price)
    
    await cartStore.addToCart(product.value.id, quantity.value, {
      variant: null,
      customPrice: itemPrice,
      offerId: offer?.id || null
    })
    uiStore.triggerCartAnimation()
  } catch (error) {
    console.error('Erreur ajout panier:', error)
    uiStore.showToast(t('products.add_to_cart_error'), 'error')
  } finally {
    isAddingToCart.value = false
  }
}



// Watchers
watch(product, (newProduct) => {
  if (newProduct) {
    currentImageIndex.value = 0
  }
})

// Keyboard navigation for lightbox
const handleKeydown = (e: KeyboardEvent) => {
  if (!isLightboxOpen.value) return
  
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

// Load product
onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  console.log('🔍 ProductDetailView monté avec ID:', productId)
  try {
    isLoading.value = true
    console.log('📦 Chargement du produit...', productId)
    product.value = await productsStore.loadProduct(productId)
    console.log('✅ Produit chargé:', product.value?.name)
    
    if (product.value) {
      historyStore.addProductView(product.value)
      // Auto-select first variant if exists

    }
    
    // Load related products
    await loadRelatedProducts()
    
    // Load seller products
    await loadSellerProducts()
    
    // Load reviews
    await loadReviews()
  } catch (error) {
    console.error('❌ Error loading product:', error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = '' // Ensure scroll is unlocked
})

// Related Products Logic
const relatedProducts = ref<Product[]>([])
const relatedProductsContainer = ref<HTMLElement | null>(null)

// Seller Products Logic
const sellerProducts = ref<Product[]>([])
const sellerProductsContainer = ref<HTMLElement | null>(null)

const loadRelatedProducts = async () => {
  if (!product.value) return

  try {
    let candidates: Product[] = []
    
    // Try to load by category if available
    if (product.value.category_id) {
      candidates = await productsStore.loadProductsByCategory(product.value.category_id)
    }
    
    // If no category or no results, fallback to general products
    if (candidates.length === 0) {
      if (productsStore.products.length === 0) {
        await productsStore.loadProducts()
      }
      candidates = productsStore.products
    }
    
    // Filter out current product and take 10
    relatedProducts.value = candidates
      .filter(p => p.id !== productId)
      .slice(0, 10)
  } catch (error) {
    console.error('Error loading related products:', error)
  }
}

const loadSellerProducts = async () => {
  if (!product.value) return
  const vendorId = (product.value as any).buyBox?.storeId 
    || (product.value as any).store?.id 
    || (product.value as any).vendor_id
  if (!vendorId) return

  try {
    const res = await productsService.getProducts({ vendor: vendorId, limit: 12 })
    const all = (res as any).products || res || []
    sellerProducts.value = all.filter((p: Product) => p.id !== productId).slice(0, 12)
  } catch (error) {
    console.error('Error loading seller products:', error)
  }
}

const scrollRelated = (direction: 'left' | 'right') => {
  if (!relatedProductsContainer.value) {
    console.warn('⚠️ Related products container not found')
    return
  }
  
  console.log('🖱️ Scrolling related products:', direction)
  
  // Calculate scroll amount dynamically based on card width + gap
  let scrollAmount = 300 // default fallback
  const firstCard = relatedProductsContainer.value.children[0] as HTMLElement
  if (firstCard) {
    // Card width + gap (24px for gap-6)
    scrollAmount = firstCard.offsetWidth + 24
  }
  
  if (direction === 'left') {
    relatedProductsContainer.value.scrollLeft -= scrollAmount
  } else {
    relatedProductsContainer.value.scrollLeft += scrollAmount
  }
}

const scrollSellerProducts = (direction: 'left' | 'right') => {
  if (!sellerProductsContainer.value) return
  const firstCard = sellerProductsContainer.value.children[0] as HTMLElement
  const scrollAmount = firstCard ? firstCard.offsetWidth + 16 : 280
  if (direction === 'left') {
    sellerProductsContainer.value.scrollLeft -= scrollAmount
  } else {
    sellerProductsContainer.value.scrollLeft += scrollAmount
  }
}

const goToProduct = (id: number) => {
  // Force reload of the page/component since we are already on the detail page
  window.location.href = `/products/${id}`
}

// Reviews Logic
const loadReviews = async () => {
  try {
    const data = await productsService.getReviews(productId)
    reviews.value = data || []
    console.log('📝 Reviews fetched:', reviews.value)
  } catch (error) {
    console.error('Erreur chargement avis:', error)
  }
}

const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3003'
  return `${baseUrl}${path}`
}

const openReviewImage = (img: string) => {
  // Option simple: ouvrir dans un  nouvel onglet, ou utiliser the lightbox we already have!
  // I will just use the exist lightbox for one image
  displayedImages.value = [getImageUrl(img)]
  currentImageIndex.value = 0
  isLightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const handleReviewImageUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  
  try {
    uploadingReviewImage.value = true
    const res = await uploadService.upload(Array.from(target.files))
    if (res.urls && res.urls.length > 0) {
      newReviewImage.value = getImageUrl(res.urls[0])
    }
  } catch (error) {
    console.error('Erreur upload photo avis:', error)
    uiStore.showToast("Erreur lors de l'upload de l'image", 'error')
  } finally {
    uploadingReviewImage.value = false
    target.value = '' // reset input
  }
}

const submitReview = async () => {
  if (!authStore.isAuthenticated) {
    uiStore.showToast(t('products.login_to_review'), 'warning')
    return
  }
  
  try {
    isSubmittingReview.value = true
    await productsService.addReview({
      productId: productId,
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      images: newReviewImage.value ? [newReviewImage.value.replace(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3003', '')] : []
    })
    
    // Reset and reload
    newReview.value = { rating: 5, comment: '' }
    newReviewImage.value = ''
    showReviewForm.value = false
    await loadReviews()
    uiStore.showToast(t('products.review_success'), 'success')
  } catch (error) {
    console.error('Erreur envoi avis:', error)
    uiStore.showToast(t('common.error'), 'error')
  } finally {
    isSubmittingReview.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const currentLocale = t('common.loading') === 'Chargement...' ? 'fr-HT' : 'ht-HT'
  return new Date(dateString).toLocaleDateString(currentLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getReviewerName = (review: any): string => {
  const u = review.user
  if (!u) return t('products.client')
  // Essayer firstName + lastName, puis name, puis email masqué
  if (u.firstName || u.lastName) {
    return `${u.firstName || ''} ${u.lastName || ''}`.trim()
  }
  if (u.name && u.name.trim()) return u.name.trim()
  return 'Client'
}

const getReviewerInitial = (review: any): string => {
  const name = getReviewerName(review)
  return name.charAt(0).toUpperCase()
}

const maskName = (name: string | null | undefined) => {
  // Gardé pour compatibilité mais plus utilisé
  if (!name) return 'Client'
  return name.trim()
}

</script>
