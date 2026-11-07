/* Service worker: deixa o quiz funcionar sem internet depois da primeira visita. */
var CACHE="quiz-fisica-1cbb9ea7";
var ARQUIVOS=["./","index.html","style.css","script.js","perguntas-eletro.js","perguntas-fluidos.js","perguntas-termo.js","perguntas-onda.js","perguntas-optica.js","perguntas-mec.js","quiz-mec.js","figuras-animq-mec.js","perguntas-edin.js","quiz-edin.js","figuras-animq-edin.js","quiz-optica.js","figuras-animq-optica.js","quiz-onda.js","figuras-animq-onda.js","quiz-termo.js","figuras-termo.js","quiz-eletro.js","quiz-fluidos.js","figuras.js","figuras-anim.js","figuras-animq-eletro.js","figuras-animq-eletro2.js","figuras-animq-eletro3.js","figuras-animq-eletro4.js","figuras-animq-fluidos.js","figuras-animq-fluidos2.js","figuras-animq-termo.js","figuras-animq-termo2.js","figuras-animq-termo3.js","figuras-animq-auto.js","figuras-fluidos.js","fx.js","eq.js","banco-proprio.js","banco-extra.js","firebase-config.js","nuvem.js","perfil.js","fontes.js","editor.html","editor.js","editor.css","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png"];
/* Instala cada arquivo separadamente: se um falhar, o resto continua disponível offline. */
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(ARQUIVOS.map(function(u){return c.add(new Request(u,{cache:"reload"})).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
function comTempo(p,ms){return new Promise(function(ok,no){var t=setTimeout(function(){no(new Error("tempo"))},ms);p.then(function(r){clearTimeout(t);ok(r)},function(x){clearTimeout(t);no(x)})})}
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  if(r.mode==="navigate"){
    /* Páginas: tenta a rede por 3 s; sem rede (ou rede lenta) usa a cópia guardada, mesmo com ?q=... na URL. */
    e.respondWith(comTempo(fetch(r),3000).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)});return res}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match("index.html",{ignoreSearch:true})||caches.match("./")})}));
    return;
  }
  /* Demais arquivos: responde na hora com a cópia guardada e atualiza em segundo plano. */
  e.respondWith(caches.match(r).then(function(m){
    var rede=fetch(r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}return res}).catch(function(){return m});
    return m||rede}));
});
