// Offline support. Network first, so a new deploy shows up on the next open;
// the cache is only the fallback when there is no signal at the grill.
const CACHE = 'smoke-ring-v3';
const SHELL = ['./', 'index.html', 'css/app.css', 'js/app.js', 'js/data.js', 'js/seed.js', 'js/ui.js', 'js/views.js', 'manifest.webmanifest',
  'assets/fonts/bigshoulders-normal.woff2', 'assets/fonts/archivo-normal.woff2', 'assets/fonts/archivo-italic.woff2',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('index.html'))));
});
