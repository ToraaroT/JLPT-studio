const CACHE='jlpt-studio-v0.12.8-github';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./2024-12_P1Q02_choices.jpeg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
    if(resp && resp.ok){ const copy=resp.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); }
    return resp;
  }).catch(()=> e.request.mode==='navigate' ? caches.match('./index.html') : undefined)));
});
