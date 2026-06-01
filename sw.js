const CACHE_NAME = 'fachrindah-pwa-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js'
];

// Saat aplikasi diinstall, simpan file inti ke memori HP
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Saat aplikasi dibuka, gunakan file dari memori HP agar loading super cepat
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});