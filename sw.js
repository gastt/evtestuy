const CACHE_NAME = 'evuruguay-pwa-v3-instalacion-shell-20260710';
const APP_SHELL = [
  '/',
  '/index.html',
  '/evuy-design.css',
  '/version.json',
  '/manifest.webmanifest',
  '/manifest.json',
  '/assets/js/theme-sync.js',
  '/assets/js/top-app-bar.js',
  '/assets/js/bottom-nav.js',
  '/assets/js/install-prompt.js',
  '/assets/js/instalacion-shell.js',
  '/assets/js/update-check.js',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin && url.pathname === '/version.json') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/version.json', clone)).catch(() => undefined);
          return response;
        })
        .catch(() => caches.match('/version.json'))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => undefined);
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html')))
  );
});
