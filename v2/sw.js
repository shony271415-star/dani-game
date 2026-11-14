/* Offline support for the illustrated edition: network first (for updates), cache as fallback */
const CACHE = 'mystery-grid-art-v2';
const FILES = ['./', 'index.html', 'worker.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png',
  '../engine.js', '../app.js', '../art.js',
  '../tools/fonts/fredoka-latin-500-normal.woff2', '../tools/fonts/fredoka-latin-600-normal.woff2', '../tools/fonts/quicksand-latin-600-normal.woff2',
  '../tools/fonts/quicksand-latin-700-normal.woff2', '../tools/fonts/pacifico-latin-400-normal.woff2'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('mystery-grid-art') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html')))
  );
});
