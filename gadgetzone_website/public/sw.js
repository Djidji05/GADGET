// Service Worker HTFasil — Cache-first pour assets statiques, Network-first pour API
const CACHE_NAME = 'htfasil-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
]

// Installation : pré-cache les assets critiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activation : nettoyer les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch : stratégie selon le type de requête
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // ⚡ Ignorer les requêtes API et SSE (toujours réseau)
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/sse')) return

  // 🖼️ Assets statiques : Cache-first avec fallback réseau
  if (event.request.destination === 'image' || 
      event.request.destination === 'script' || 
      event.request.destination === 'style' ||
      event.request.destination === 'font') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone))
          }
          return response
        })
      })
    )
    return
  }

  // 📄 Pages HTML : Network-first avec fallback cache (offline)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => 
        caches.match('/index.html')
      )
    )
  }
})

// 🔔 Push Notifications — Afficher la notification reçue du serveur
self.addEventListener('push', (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    
    const options = {
      body: data.body || '',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data || { url: '/' },
      actions: [
        { action: 'open', title: 'Voir' },
        { action: 'dismiss', title: 'Fermer' }
      ],
      tag: data.data?.type || 'htfasil-notification',
      renotify: true,
      requireInteraction: false,
      timestamp: data.timestamp || Date.now()
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'HTFasil', options)
    )
  } catch (err) {
    console.error('Push notification error:', err)
  }
})

// 🖱️ Notification Click — Naviguer vers la page pertinente
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Si une fenêtre est déjà ouverte, naviguer dedans
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          client.navigate(url)
          return
        }
      }
      // Sinon, ouvrir une nouvelle fenêtre
      return clients.openWindow(url)
    })
  )
})
