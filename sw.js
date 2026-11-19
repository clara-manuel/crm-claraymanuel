/* Only a public offline page is cached. Never cache CRM pages, API or documents. */
const CACHE='cm-crm-pwa-v12:'+self.registration.scope;
const offlineURL=new URL('./offline.html',self.registration.scope).href;
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.add(new Request(offlineURL,{cache:'reload'}))));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('cm-crm-pwa-')&&key.endsWith(':'+self.registration.scope)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url),base=new URL(self.registration.scope);
  if(request.method!=='GET'||request.mode!=='navigate'||url.origin!==base.origin)return;
  const allowed=[base.pathname,base.pathname+'index.html',base.pathname+'CRM_REAL_BASE_LIMPIA.html'];
  if(!allowed.includes(url.pathname))return;
  event.respondWith(fetch(request).catch(async()=>await caches.match(offlineURL)||new Response('Sin conexión. Vuelve a abrir el CRM cuando tengas Internet.',{headers:{'Content-Type':'text/plain;charset=utf-8'}})));
});
