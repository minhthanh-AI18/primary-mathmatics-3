const CACHE='math-genius-v4.0.0-flat-shell-1';
const CORE=['./','./index.html','./app.css','./app.js','./mastery.js','./data-tools.js','./pwa.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('math-genius-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==location.origin)return;if(/\/auth\/|\/rest\/v1\//.test(url.pathname))return;event.respondWith(caches.match(req).then(cached=>{const fresh=fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;}).catch(()=>cached);return cached||fresh;}));});
