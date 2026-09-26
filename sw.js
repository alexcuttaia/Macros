/* Service worker di MACRO'S (versione pubblicata su GitHub Pages).

   - L'app (index.html, manifest, icone) sta in una cache con il numero di versione: si apre subito,
     anche senza rete. VERSION cambia a ogni build (tools/build_artifact.py), così il browser vede
     che c'è un aggiornamento, lo scarica in background e l'app propone "Aggiorna".
   - Caratteri di Google Fonts e librerie da CDN (lottie-web, Leaflet): in una cache a parte, riusati
     alle aperture successive.
   - Mappe, indirizzi, percorsi e servizi online: sempre dalla rete, mai in cache.
   - Notifiche dell'ordine: toccandone una si apre (o si porta davanti) l'app su quell'ordine. */
'use strict';

const VERSION = '948c244e1abf';
const APP_CACHE = 'macros-app-' + VERSION;
const LIB_CACHE = 'macros-lib-v1';
const APP_FILES = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];
const LIB_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', event=>{
  event.waitUntil(caches.open(APP_CACHE).then(c=>c.addAll(APP_FILES)));
});

self.addEventListener('activate', event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k.startsWith('macros-app-') && k !== APP_CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message', event=>{
  if(event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event=>{
  const req = event.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);

  // l'app: prima la cache della versione installata, altrimenti la rete
  if(url.origin === self.location.origin){
    if(req.mode === 'navigate'){
      event.respondWith(caches.match('./index.html', {ignoreSearch:true}).then(r=> r || fetch(req)));
      return;
    }
    event.respondWith(caches.match(req, {ignoreSearch:true}).then(r=> r || fetch(req)));
    return;
  }

  // caratteri e librerie: dalla cache se ci sono, intanto si aggiornano dalla rete
  if(LIB_HOSTS.includes(url.hostname)){
    event.respondWith(caches.open(LIB_CACHE).then(cache=>
      cache.match(req).then(hit=>{
        const net = fetch(req)
          .then(res=>{ if(res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; })
          .catch(()=> hit || Response.error());   // senza rete: la copia salvata, se c'è
        return hit || net;
      })
    ));
  }
  // tutto il resto (mappe, indirizzi, percorsi, API): sempre dalla rete, come senza service worker
});

self.addEventListener('notificationclick', event=>{
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './';
  const num = new URL(target, self.location.href).searchParams.get('order');
  event.waitUntil(self.clients.matchAll({type:'window', includeUncontrolled:true}).then(list=>{
    const open = list.find(c=> new URL(c.url).origin === self.location.origin);
    if(open){
      if(num) open.postMessage({type:'open-order', num});
      return open.focus();
    }
    return self.clients.openWindow(target);
  }));
});
