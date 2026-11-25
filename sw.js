/*
  Weatherglass service worker — makes the app open with no connection.

  Strategy:
  - The app page (index.html) is network-first: when online you always get
    the latest deploy, and the copy is refreshed in the cache. When offline,
    or when the network takes longer than NETWORK_TIMEOUT_MS (weak signal),
    the cached copy is used instead.
  - Libraries and fonts from the CDNs are cache-first: saved the first time
    the app loads online, then served from the phone.
  - Map tiles you've already looked at are kept (up to MAX_TILES), so a map
    you viewed recently still draws offline. Tiles are never pre-downloaded.
  - Weather, alert, geocoding and tide API calls are never cached here —
    they always go to the network, and the app handles failures itself.

  Bump CACHE_VERSION with each release that changes this file or the list of
  core files; old caches are deleted on activation.
*/
const CACHE_VERSION = "v5.6.3";
const CORE_CACHE = `weatherglass-core-${CACHE_VERSION}`;
const LIB_CACHE = "weatherglass-libs-v1";
const TILE_CACHE = "weatherglass-tiles-v1";
const KEEP = new Set([CORE_CACHE, LIB_CACHE, TILE_CACHE]);
const NETWORK_TIMEOUT_MS = 4000;
const MAX_TILES = 400;

const CORE_FILES = [
  "./",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

const LIB_HOSTS = new Set([
  "cdnjs.cloudflare.com",
  "cdn.jsdelivr.net",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "unpkg.com"
]);

self.addEventListener("install", event=>{
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then(cache=>cache.addAll(CORE_FILES))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>!KEEP.has(k)).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

function isAppPage(request, url){
  return request.mode === "navigate" ||
    (url.origin === self.location.origin && (url.pathname.endsWith("/") || url.pathname.endsWith("/index.html")));
}

async function appPage(request){
  const cache = await caches.open(CORE_CACHE);
  const network = fetch(request).then(res=>{
    if(res && res.ok) cache.put("./", res.clone());
    return res;
  });
  const timeout = new Promise(resolve=>setTimeout(()=>resolve(null), NETWORK_TIMEOUT_MS));
  try{
    const res = await Promise.race([network, timeout]);
    if(res && res.ok) return res;
  }catch(e){ /* offline — fall through to cache */ }
  const cached = await cache.match("./");
  if(cached) return cached;
  return network; // nothing cached yet (first visit): wait for the network
}

async function cacheFirst(request, cacheName){
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if(cached) return cached;
  const res = await fetch(request);
  // Opaque (no-cors) responses from CDN <script> tags have status 0 but are
  // still the real file, so they're cached too.
  if(res && (res.ok || res.type === "opaque")) cache.put(request, res.clone());
  return res;
}

async function tile(request){
  const cache = await caches.open(TILE_CACHE);
  const cached = await cache.match(request);
  if(cached) return cached;
  const res = await fetch(request);
  if(res && (res.ok || res.type === "opaque")){
    await cache.put(request, res.clone());
    const keys = await cache.keys();
    if(keys.length > MAX_TILES){
      await Promise.all(keys.slice(0, keys.length - MAX_TILES).map(k=>cache.delete(k)));
    }
  }
  return res;
}

self.addEventListener("fetch", event=>{
  const request = event.request;
  if(request.method !== "GET") return;
  const url = new URL(request.url);

  if(isAppPage(request, url)){
    event.respondWith(appPage(request));
  } else if(url.origin === self.location.origin){
    event.respondWith(cacheFirst(request, CORE_CACHE));
  } else if(LIB_HOSTS.has(url.hostname)){
    event.respondWith(cacheFirst(request, LIB_CACHE));
  } else if(url.hostname.endsWith("tile.openstreetmap.org")){
    event.respondWith(tile(request));
  }
  // Everything else (weather, alerts, geocoding, tides) goes straight to the
  // network untouched.
});
