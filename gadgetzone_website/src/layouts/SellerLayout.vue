<template>
  <!-- ========== DESKTOP LAYOUT (lg+) ========== -->
  <div class="hidden lg:block">
    <!-- Fixed Left Sidebar -->
    <SellerSidebar :isLayout="true" />

    <!-- Fixed Top Navbar (offset left by sidebar width 256px) -->
    <div class="fixed top-0 left-64 right-0 z-50 h-16">
      <SellerNavbar />
    </div>

    <!-- Scrollable Content Area (offset top by navbar height 64px and left by sidebar width 256px) -->
    <div class="ml-64 mt-16 min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <main class="p-8">
        <router-view></router-view>
      </main>
    </div>
  </div>

  <!-- ========== MOBILE LAYOUT (<lg) — UNTOUCHED ========== -->
  <div class="lg:hidden">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import SellerSidebar from '@/components/seller/SellerSidebar.vue';
import SellerNavbar from '@/components/seller/SellerNavbar.vue';
</script>
