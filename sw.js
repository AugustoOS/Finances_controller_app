var CACHE = "finances-controller-v3";
var ARQUIVOS = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ARQUIVOS); }).catch(function(){}));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){ return k === CACHE ? null : caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

/* O app em si (index.html e o manifest) vem sempre da rede quando ela existe,
   e do cache quando não existe. Assim uma versão nova aparece na próxima abertura
   sem depender de trocar o nome do cache. Ícones ficam no cache direto. */
function ehApp(url){
  var u = new URL(url);
  return u.pathname.endsWith("/") || u.pathname.endsWith("index.html") ||
         u.pathname.endsWith("manifest.webmanifest") || u.pathname.endsWith("sw.js");
}

self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  if(e.request.mode === "navigate" || ehApp(e.request.url)){
    e.respondWith(
      fetch(e.request, {cache:"no-store"}).then(function(res){
        var copia = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copia); }).catch(function(){});
        return res;
      }).catch(function(){
        return caches.match(e.request).then(function(hit){ return hit || caches.match("index.html"); });
      })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(hit){
      if(hit) return hit;
      return fetch(e.request).then(function(res){
        var copia = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copia); }).catch(function(){});
        return res;
      });
    })
  );
});
