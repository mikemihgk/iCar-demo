// service-worker.js

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('icar-store').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './icar.css',
        './icar.js',
        './manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});