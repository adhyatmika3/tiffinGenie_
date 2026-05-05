const CACHE_NAME = 'tiffingenie-v2';
const ASSETS = [
  './',
  './index.html',
  './dashboard.html',
  './login.html',
  './onboarding.html',
  './recipes.html',
  './css/style.css',
  './js/navbar.js',
  './js/session.js',
  './js/meals_db.js',
  './js/dashboard.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Clear old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network-First strategy
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Optionally update cache here
        return networkResponse;
      })
      .catch(() => {
        // If network fails, try the cache
        return caches.match(event.request);
      })
  );
});
