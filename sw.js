const CACHE_NAME = 'tiffingenie-v1';
const ASSETS = [
  './',
  './index.html',
  './dashboard.html',
  './recipes.html',
  './css/style.css',
  './js/navbar.js',
  './js/session.js',
  './js/meals_db.js',
  './js/dashboard.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
