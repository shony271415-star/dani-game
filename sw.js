/* Offline support: try the network first (to get updates), fall back to the cache */
const CACHE = 'mystery-grid-v58';
const FILES = ['./', 'index.html', 'engine.js', 'app.js', 'i18n.js', 'i18n-he.js', 'i18n-ru.js', 'i18n-es.js', 'worker.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    // 'no-cache' asks the server every time (cheap when nothing changed), so updates are never stuck
    fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html')))
  );
});
