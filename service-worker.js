const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `novalearn-${CACHE_VERSION}`;

function scopeUrl(path){
  return new URL(path, self.registration.scope).toString();
}

const PRECACHE_URLS = [
  scopeUrl('./'),
  scopeUrl('./index.html'),
  scopeUrl('./style.css'),
  scopeUrl('./script.js'),
  scopeUrl('./manifest.json'),
  scopeUrl('./icons/favicon-32.png'),
  scopeUrl('./icons/icon-192.png'),
  scopeUrl('./icons/icon-512.png')
];

self.addEventListener('install', (event)=>{
  event.waitUntil((async ()=>{
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_URLS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event)=>{
  event.waitUntil((async ()=>{
    const keys = await caches.keys();
    await Promise.all(keys.map((k)=> (k.startsWith('novalearn-') && k !== CACHE_NAME) ? caches.delete(k) : Promise.resolve()));
    await self.clients.claim();
  })());
});

async function cacheFirst(request){
  const cached = await caches.match(request);
  if(cached) return cached;
  const res = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, res.clone());
  return res;
}

async function networkFirst(request){
  try{
    const res = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, res.clone());
    return res;
  }catch{
    const cached = await caches.match(request);
    if(cached) return cached;
    return caches.match(scopeUrl('./index.html'));
  }
}

self.addEventListener('fetch', (event)=>{
  const req = event.request;
  if(req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  if(req.mode === 'navigate'){
    event.respondWith(networkFirst(req));
    return;
  }

  if(!sameOrigin) return;

  const isAsset = url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.endsWith('.json') || url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('.jpeg') || url.pathname.endsWith('.webp') || url.pathname.endsWith('.svg') || url.pathname.endsWith('.ico');
  if(isAsset){
    event.respondWith(cacheFirst(req));
    return;
  }
});
