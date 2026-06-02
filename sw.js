const CACHE = 'ghetto-v1';

// Archivos que se cachean al instalar el SW
const PRECACHE = [
  './index.html',
  './cursos.html',
  './galeria.html',
  './artistas.html',
  './reservar.html',
  './contacto.html',
  './styles.css',
  './assets/logo.png',
  './assets/icon.svg',
  './manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  // Borra caches viejas cuando se actualiza el SW
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Solo interceptar GET
  if (e.request.method !== 'GET') return;

  // Supabase API: siempre red, nunca cache (datos dinámicos)
  if (url.hostname.includes('supabase.co')) return;

  // CDN (React, Babel, Supabase JS, Google Fonts): cache-first
  const isCDN = url.hostname.includes('unpkg.com')
    || url.hostname.includes('cdn.jsdelivr.net')
    || url.hostname.includes('fonts.googleapis.com')
    || url.hostname.includes('fonts.gstatic.com');

  if (isCDN) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
          }
          return res;
        });
      })
    );
    return;
  }

  // Páginas HTML: network-first con fallback a cache (siempre contenido fresco)
  if (e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Todo lo demás (CSS, JS, imágenes locales): cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
