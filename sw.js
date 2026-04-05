const CACHE_NAME = 'j11-tutor-v5';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/store.js',
  '/js/xp.js',
  '/js/ui.js',
  '/js/sections/collocations.js',
  '/js/sections/nvr.js',
  '/js/sections/twinkl-nvr.js',
  '/js/sections/verbal-reasoning.js',
  '/js/nvr/questions.js',
  '/js/nvr/renderers.js',
  '/js/nvr/shapes.js',
  '/js/nvr/svg-renderers.js',
  '/data/collocations.json',
  '/data/bexley-20-week-plan.json',
  '/data/nvr-questions.json',
  '/data/twinkl-nvr/manifest.json',
  '/data/twinkl-nvr/page_001.png',
  '/data/twinkl-nvr/page_002.png',
  '/data/twinkl-nvr/page_003.png',
  '/data/twinkl-nvr/page_004.png',
  '/data/twinkl-nvr/page_005.png',
  '/data/twinkl-nvr/page_006.png',
  '/data/twinkl-nvr/page_007.png',
  '/data/twinkl-nvr/page_008.png',
  '/data/twinkl-nvr/page_009.png',
  '/data/twinkl-nvr/page_010.png',
  '/data/twinkl-nvr/page_011.png',
  '/data/twinkl-nvr/page_012.png',
  '/data/twinkl-nvr/page_013.png',
  '/data/twinkl-nvr/page_014.png',
  '/data/verbal-reasoning.json',
  '/manifest.json'
];

// Install: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, fall back to network, cache new responses
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Only cache same-origin GET requests
        if (
          event.request.method === 'GET' &&
          response.status === 200 &&
          response.type === 'basic'
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    })
  );
});
