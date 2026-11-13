/* Service worker: deixa o quiz funcionar sem internet depois da primeira visita. */
var CACHE = "quiz-fisica-4bddd6f6";
/* Arquivos gerais; os de cada quiz vêm da lista única em quizzes.js. */
var BASE = [
  "./",
  "index.html",
  "style.css",
  "script.js",
  "fx.js",
  "eq.js",
  "banco-proprio.js",
  "banco-extra.js",
  "firebase-config.js",
  "nuvem.js",
  "perfil.js",
  "fontes.js",
  "editor.html",
  "editor.js",
  "editor.css",
  "manifest.webmanifest",
  "icon.svg",
  "icon-192.png",
  "icon-512.png",
  "quizzes.js",
];
importScripts("quizzes.js");
var ARQUIVOS = BASE.concat(self.QuizLista.todosArquivos());
/* Instala cada arquivo separadamente: se um falhar, o resto continua disponível offline. */
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open(CACHE)
      .then(function (c) {
        return Promise.all(
          ARQUIVOS.map(function (u) {
            return c.add(new Request(u, { cache: "reload" })).catch(function () {});
          })
        );
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches
      .keys()
      .then(function (ks) {
        return Promise.all(
          ks
            .filter(function (k) {
              return k !== CACHE;
            })
            .map(function (k) {
              return caches.delete(k);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});
function comTempo(p, ms) {
  return new Promise(function (ok, no) {
    var t = setTimeout(function () {
      no(new Error("tempo"));
    }, ms);
    p.then(
      function (r) {
        clearTimeout(t);
        ok(r);
      },
      function (x) {
        clearTimeout(t);
        no(x);
      }
    );
  });
}
self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") {
    /* Páginas: tenta a rede por 3 s; sem rede (ou rede lenta) usa a cópia guardada, mesmo com ?q=... na URL. */
    e.respondWith(
      comTempo(fetch(r), 3000)
        .then(function (res) {
          var cp = res.clone();
          caches.open(CACHE).then(function (c) {
            c.put(r, cp);
          });
          return res;
        })
        .catch(function () {
          return caches.match(r, { ignoreSearch: true }).then(function (m) {
            return m || caches.match("index.html", { ignoreSearch: true }) || caches.match("./");
          });
        })
    );
    return;
  }
  /* Demais arquivos: responde na hora com a cópia guardada e atualiza em segundo plano. */
  e.respondWith(
    caches.match(r).then(function (m) {
      var rede = fetch(r)
        .then(function (res) {
          if (res && res.ok) {
            var cp = res.clone();
            caches.open(CACHE).then(function (c) {
              c.put(r, cp);
            });
          }
          return res;
        })
        .catch(function () {
          return m;
        });
      return m || rede;
    })
  );
});
