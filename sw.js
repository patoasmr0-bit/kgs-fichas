/* KGS Fichas: funciona sin cobertura. Sube VERSION al publicar cambios. */
const VERSION='kgs-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','vendor/jspdf.umd.min.js','vendor/jspdf.plugin.autotable.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.origin!==location.origin)return; /* fuentes y demás: red normal */
 /* red primero (siempre la última versión); sin cobertura, la copia guardada */
 e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(VERSION).then(c=>c.put(r,copy));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
