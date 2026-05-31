const CACHE = 'inocuidad-v2';
const FILES = [
  '/Inocuidadtestapp/',
  '/Inocuidadtestapp/index.html',
  '/Inocuidadtestapp/manifest.json',
  '/Inocuidadtestapp/icon-192.svg',
  '/Inocuidadtestapp/icon-512.svg'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).then(function(r){
      var c=r.clone();
      caches.open(CACHE).then(function(cache){ cache.put(e.request,c); });
      return r;
    }).catch(function(){ return caches.match(e.request); })
  );
});
