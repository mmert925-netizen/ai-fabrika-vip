const CACHE = 'omerai-v4';
const ASSETS = ['/', '/index.html', '/style.css', '/script.js', '/manifest.json', '/img/proje1.jpg', '/img/proje1-400.webp', '/img/proje1-800.webp'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
