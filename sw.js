const CACHE_NAME = 'j11-tutor-v7';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/store.js',
  '/js/xp.js',
  '/js/ui.js',
  '/js/sections/learn-first.js',
  '/js/sections/collocations.js',
  '/js/sections/nvr.js',
  '/js/sections/twinkl-nvr.js',
  '/js/sections/verbal-reasoning.js',
  '/js/nvr/questions.js',
  '/js/nvr/renderers.js',
  '/js/nvr/shapes.js',
  '/js/nvr/svg-renderers.js',
  '/data/vocab-lessons.json',
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
  '/data/twinkl-nvr/q_ooo_1.png',
  '/data/twinkl-nvr/q_ooo_2.png',
  '/data/twinkl-nvr/q_ooo_3.png',
  '/data/twinkl-nvr/q_ooo_4.png',
  '/data/twinkl-nvr/q_ooo_5.png',
  '/data/twinkl-nvr/q_ooo_6.png',
  '/data/twinkl-nvr/q_analogy_1.png',
  '/data/twinkl-nvr/q_analogy_2.png',
  '/data/twinkl-nvr/q_analogy_3.png',
  '/data/twinkl-nvr/q_analogy_4.png',
  '/data/twinkl-nvr/q_analogy_5.png',
  '/data/twinkl-nvr/q_analogy_6.png',
  '/data/twinkl-nvr/q_sequence_1.png',
  '/data/twinkl-nvr/q_sequence_2.png',
  '/data/twinkl-nvr/q_sequence_3.png',
  '/data/twinkl-nvr/q_sequence_4.png',
  '/data/twinkl-nvr/q_sequence_5.png',
  '/data/twinkl-nvr/q_sequence_6.png',
  '/data/twinkl-nvr/q_similar_1.png',
  '/data/twinkl-nvr/q_similar_2.png',
  '/data/twinkl-nvr/q_similar_3.png',
  '/data/twinkl-nvr/q_similar_4.png',
  '/data/twinkl-nvr/q_similar_5.png',
  '/data/twinkl-nvr/q_similar_6.png',
  '/data/twinkl-nvr/q_reflection_1.png',
  '/data/twinkl-nvr/q_reflection_2.png',
  '/data/twinkl-nvr/q_reflection_3.png',
  '/data/twinkl-nvr/q_reflection_4.png',
  '/data/twinkl-nvr/q_reflection_5.png',
  '/data/twinkl-nvr/q_reflection_6.png',
  '/data/twinkl-nvr/q_matrix_1.png',
  '/data/twinkl-nvr/q_matrix_2.png',
  '/data/twinkl-nvr/q_matrix_3.png',
  '/data/twinkl-nvr/q_matrix_4.png',
  '/data/twinkl-nvr/q_matrix_5.png',
  '/data/twinkl-nvr/q_matrix_6.png',
  '/data/twinkl-nvr/q_codes_1.png',
  '/data/twinkl-nvr/q_codes_2.png',
  '/data/twinkl-nvr/q_codes_3.png',
  '/data/twinkl-nvr/q_codes_4.png',
  '/data/twinkl-nvr/q_codes_5.png',
  '/data/twinkl-nvr/q_codes_6.png',
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
