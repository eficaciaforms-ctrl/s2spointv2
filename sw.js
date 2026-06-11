// S2S Point — Service Worker
var CACHE_VER  = 's2s-v2-2026-06-11-1618';
var CACHE_NAME = 's2spoint-' + CACHE_VER;
var URLS = ['./','./index.html','./app.js','./config.js','./manifest.json','./icon-192.png','./icon-512.png','./manual_promotor.html','./manual_supervisor.html'];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(function(c) { return c.addAll(URLS); }).catch(function(){}));
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.map(function(k) { if (k !== CACHE_NAME) return caches.delete(k); }));
  }).then(function() { return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  // Nunca cachear GAS ni base_pdv (siempre fresh / network)
  if (url.indexOf('script.google.com') >= 0 || url.indexOf('base_pdv.js') >= 0) return;
  if (e.request.method !== 'GET') return;

  // Network-first con timeout
  e.respondWith(
    Promise.race([
      fetch(e.request).then(function(r) {
        if (r && r.status === 200) {
          var clone = r.clone();
          caches.open(CACHE_NAME).then(function(c) { c.put(e.request, clone).catch(function(){}); });
        }
        return r;
      }),
      new Promise(function(_, reject) { setTimeout(function() { reject(new Error('timeout')); }, 8000); })
    ]).catch(function() { return caches.match(e.request); })
  );
});

self.addEventListener('message', function(e) {
  if (e.data && e.data.action === 'skipWaiting') self.skipWaiting();
});
