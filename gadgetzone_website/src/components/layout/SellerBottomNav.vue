<template>
<nav class="seller-bottom-nav">
    <!-- Active Indicator Bar (Animated) -->
    <div 
      class="active-bar" 
      :style="{ left: activeBarLeft }"
      v-if="activeIndex !== -1 && activeIndex !== 2"
    ></div>

    <!-- Dashboard -->
    <router-link to="/seller/dashboard" class="nav-item" :class="{ active: route.path === '/seller/dashboard' }">
      <div class="icon-wrapper">
        <i class="fas fa-home"></i>
      </div>
      <span>Dashboard</span>
    </router-link>

    <!-- Commandes -->
    <router-link to="/seller/orders" class="nav-item" :class="{ active: isActive('/seller/orders') }">
      <div class="icon-wrapper">
        <i class="fas fa-shopping-bag"></i>
      </div>
      <span>Commandes</span>
    </router-link>

    <!-- Balayer (Central Action) -->
    <router-link to="/seller/my-qr?tab=scanner" class="nav-item central-item" :class="{ active: route.path === '/seller/my-qr' }">
      <div class="central-button-wrapper">
        <div class="central-button">
          <i class="fas fa-expand"></i>
        </div>
      </div>
      <span>Livrer</span>
    </router-link>

    <!-- Mes Produits -->
    <router-link to="/seller/products" class="nav-item" :class="{ active: isActive('/seller/products') }">
      <div class="icon-wrapper">
        <i class="fas fa-box"></i>
      </div>
      <span>Produits</span>
    </router-link>

    <!-- Site -->
    <router-link to="/" class="nav-item">
      <div class="icon-wrapper">
        <i class="fas fa-store"></i>
      </div>
      <span>Site</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isActive = (path: string) => {
  return route.path === path || (path !== '/seller/dashboard' && route.path.startsWith(path))
}

const activeIndex = computed(() => {
  if (route.path === '/seller/dashboard') return 0
  if (isActive('/seller/orders')) return 1
  if (route.path === '/seller/my-qr') return 2
  if (isActive('/seller/products')) return 3
  if (route.path === '/') return 4
  return -1
})

const activeBarLeft = computed(() => {
  const index = activeIndex.value
  if (index === -1) return '0%'
  return `calc(${index * 20}% + (20% - 40px) / 2)`
})
</script>

<style scoped>
.seller-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  background: white;
  border: 1px solid #f3f4f6;
  border-bottom: none;
  padding: 0;
  z-index: 1000;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.05); /* Sharper, minimal shadow instead of large blur */
  padding-bottom: env(safe-area-inset-bottom, 0);
  height: 60px;
  border-radius: 24px 24px 0 0; /* Rounded top corners */
}

/* Blue Top Bar Indicator */
.active-bar {
  position: absolute;
  top: 0;
  width: 40px;
  height: 4px;
  background: #2563eb; /* Theme Blue */
  border-radius: 0 0 4px 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end; /* Align elements to the bottom */
  padding-bottom: 8px; /* Fixed distance from bottom for labels */
  text-decoration: none;
  color: #94a3b8;
  transition: all 0.2s ease;
  width: 20%;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  height: 100%;
}

.icon-wrapper {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.nav-item i {
  font-size: 1.25rem;
}

.nav-item span {
  font-size: 0.65rem;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap;
}

/* Active State - Blue */
.nav-item.active {
  color: #2563eb;
}

/* Central Button Logic (Rond séparé) */
.central-button-wrapper {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none; /* Let clicks pass to the nav-item link */
}

.central-button {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: none; /* Removed the blue shadow completely */
  transform: translateY(-35px); /* Exactly half-in (35px) half-out (35px) */
  border: 5px solid white;
  pointer-events: auto; /* Re-enable pointer events for the button circle itself */
}

.central-button i {
  font-size: 1.9rem;
}

/* Hover/Press effect */
.nav-item:active .icon-wrapper,
.nav-item:active .central-button {
  transform: scale(0.9);
}
.nav-item.central-item:active .central-button {
  transform: scale(0.9) translateY(-35px);
}

/* Hide on desktop */
@media (min-width: 768px) {
  .seller-bottom-nav {
    display: none;
  }
}

/* Dark mode support */
:global(.dark) .seller-bottom-nav {
  background: #0f172a;
  border-color: #1e293b;
}

:global(.dark) .central-button {
  border-color: #0f172a;
}

:global(.dark) .nav-item.active span {
  color: #3b82f6;
}
</style>
