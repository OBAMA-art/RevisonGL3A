// Service Worker - Révisions GL3A
const VERSION = "v23";
const SHELL_CACHE = `revisions-gl3a-shell-${VERSION}`;
const DATA_CACHE = `revisions-gl3a-data-${VERSION}`;
const OCR_CACHE = `revisions-gl3a-ocr-${VERSION}`;

// Shell statique : cache-first
const SHELL_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './theme-futuristic.css',
  './app.js',
  './ocr.js',
  './cloud-config.js',
  './cloud.js',
  './manifest.json'
];

// Données dynamiques : network-first avec fallback cache
const DATA_PATTERN = /\/(data|data-jeudi|data-ue|epreuves)\.js(\?.*)?$/;
// Librairies CDN (Tesseract, modèles de langue, supabase-js) : cache-first runtime isolé
const OCR_PATTERN = /(cdn\.jsdelivr\.net\/npm\/(tesseract|@supabase)|tessdata\.projectnaptha\.com)/;
// API Supabase : TOUJOURS réseau (jamais de cache — données fraîches + auth)
const SUPABASE_API_PATTERN = /\.supabase\.co\//;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL_CACHE)
      .then(c => c.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL_CACHE && k !== DATA_CACHE && k !== OCR_CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // API Supabase : ne jamais intercepter/cacher (réseau direct, toujours frais)
  if (SUPABASE_API_PATTERN.test(e.request.url)) return;

  // Librairies CDN (Tesseract, supabase-js) : cache-first opportuniste, n'altère ni shell ni données
  if (OCR_PATTERN.test(e.request.url)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(OCR_CACHE).then(c => c.put(e.request, copy)).catch(() => {});
          }
          return res;
        });
      }).catch(() => fetch(e.request))
    );
    return;
  }

  // Network-first pour les fichiers de données (data.js, data-jeudi.js, epreuves.js)
  if (DATA_PATTERN.test(url.pathname)) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(DATA_CACHE).then(c => c.put(e.request, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first pour le shell + autres assets
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        // Revalidation en arrière-plan (stale-while-revalidate)
        fetch(e.request).then(res => {
          if (res && res.ok) {
            caches.open(SHELL_CACHE).then(c => c.put(e.request, res.clone())).catch(() => {});
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(SHELL_CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

// Permet au client de demander un skipWaiting
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
