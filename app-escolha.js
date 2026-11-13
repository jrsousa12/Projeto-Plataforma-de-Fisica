/* Escolha do quiz: ?q=eletro ou ?q=fluidos abre direto; sem isso, aparece a tela de escolha. */
(function () {
  var NOH = !/^(https?|file):$/.test(location.protocol),
    m = /[?&]q=(\w+)/.exec(location.search),
    q = m && m[1];
  /* arquivos de cada quiz: só os do quiz escolhido são carregados (no arquivo único eles já vêm embutidos) */
  var ARQ = {};
  QuizLista.lista.forEach(function (q) {
    ARQ[q.id] = q.arquivos;
  });
  function carregar(id) {
    if (window.QUIZZES && window.QUIZZES[id]) return Promise.resolve();
    return QuizLista.carregar(ARQ[id]).then(function () {
      if (window.BancoExtra) window.BancoExtra.registrar(id);
    });
  }
  function go(id) {
    carregar(id)
      .then(function () {
        document.body.classList.remove("pre");
        window.__boot(id);
      })
      .catch(function () {
        var l = document.getElementById("landing");
        if (l) {
          var p = document.createElement("p");
          p.className = "msg no";
          p.textContent = "Não foi possível carregar este quiz. Confira a conexão e tente de novo.";
          l.appendChild(p);
        }
      });
  }
  /* Tela inicial: progresso, medalhas e sequência de dias, calculados só com os dados já guardados neste aparelho */
  function landingStats() {
    var PX = {};
    QuizLista.lista.forEach(function (q) {
      PX[q.id] = [q.letra, q.prefixo];
    });
    var P = window.Perfil && window.Perfil.ler ? window.Perfil.ler() : {},
      dias = {},
      fm = function (d) {
        var x = new Date(d);
        return x.getFullYear() + "-" + x.getMonth() + "-" + x.getDate();
      };
    function rd(k, d) {
      try {
        var v = localStorage.getItem(k);
        return v ? JSON.parse(v) : d;
      } catch (e) {
        return d;
      }
    }
    Object.keys(PX).forEach(function (id) {
      var L = PX[id][0],
        tent = 0,
        ac = 0,
        dist = 0;
      Object.keys(P).forEach(function (k) {
        if (k.charAt(0) === L && /^\d/.test(k.slice(1))) {
          var e = P[k];
          if (e && e[0]) {
            dist++;
            tent += e[0];
            ac += e[1];
          }
        }
      });
      var H = rd(PX[id][1] + "hist", []);
      if (Array.isArray(H))
        H.forEach(function (x) {
          if (x && x.d) dias[fm(x.d)] = 1;
        });
      var B = rd(PX[id][1] + "book", {}),
        nb = B && typeof B === "object" ? Object.keys(B).length : 0,
        pc = tent ? Math.round((100 * ac) / tent) : 0,
        m = [];
      if (tent >= 10) m.push("🥉 Primeiros passos");
      if (tent >= 50 && pc >= 60) m.push("🥈 Pegando o jeito");
      if (tent >= 100 && pc >= 80 && dist >= 30) m.push("🥇 Mestre do tema");
      if (dist >= 30 && nb === 0) m.push("✨ Caderno limpo");
      var el = document.querySelector('.ts[data-s="' + id + '"]');
      if (!el) return;
      el.textContent = "";
      var l1 = document.createElement("span");
      l1.className = "tl";
      l1.textContent = tent
        ? pc +
          "% de acerto · " +
          dist +
          (dist === 1 ? " questão" : " questões") +
          " feitas" +
          (nb ? " · " + nb + (nb === 1 ? " erro" : " erros") + " para revisar" : "")
        : "Ainda não começou. Que tal um quiz de 10 perguntas?";
      el.appendChild(l1);
      var bar = document.createElement("span");
      bar.className = "tpb";
      var i = document.createElement("i");
      i.style.width = pc + "%";
      bar.appendChild(i);
      if (tent) el.appendChild(bar);
      if (m.length) {
        var l2 = document.createElement("span");
        l2.className = "tm";
        l2.textContent = m.join("  ");
        el.appendChild(l2);
      }
    });
    var hoje = new Date(),
      n = 0,
      d = new Date(hoje);
    if (!dias[fm(d)]) d.setDate(d.getDate() - 1);
    while (dias[fm(d)]) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    var sb = document.getElementById("seqbar");
    if (sb) {
      if (n >= 1) {
        sb.textContent =
          "🔥 " + n + (n === 1 ? " dia" : " dias") + " seguidos estudando. Volte amanhã para manter a sequência!";
        sb.classList.remove("hidden");
      } else {
        sb.classList.add("hidden");
      }
    }
  }
  try {
    landingStats();
  } catch (e) {}
  try {
    Meta.ui();
    document.querySelectorAll("#metabar button[data-g]").forEach(function (b) {
      b.onclick = function () {
        Meta.goal(+b.getAttribute("data-g"));
      };
    });
  } catch (e) {}
  document.querySelectorAll("#landing [data-q]").forEach(function (b) {
    b.onclick = function () {
      var id = b.getAttribute("data-q");
      if (NOH) {
        go(id);
      } else {
        location.search = "?q=" + id;
      }
    };
  });
  /* Fonte, tema e cores: funcionam também na tela de escolha (valores guardados em "eletriz:") */
  var h = document.documentElement,
    $ = function (i) {
      return document.getElementById(i);
    };
  function lg(k, d) {
    try {
      var v = localStorage.getItem("eletriz:" + k);
      return v === null ? d : JSON.parse(v);
    } catch (e) {
      return d;
    }
  }
  function ls(k, v) {
    try {
      localStorage.setItem("eletriz:" + k, JSON.stringify(v));
    } catch (e) {}
  }
  var sv = lg("theme", "");
  if (sv) h.setAttribute("data-theme", sv);
  if (lg("big", false)) h.classList.add("big");
  var PALS = ["indigo", "floresta", "grafite"];
  h.setAttribute("data-pal", lg("pal", "indigo"));
  (function () {
    var b = $("mnu"),
      p = $("mnup");
    if (!b || !p) return;
    function set(o) {
      p.classList.toggle("hidden", !o);
      b.setAttribute("aria-expanded", o ? "true" : "false");
      b.textContent = o ? "✕ Fechar" : "☰ Menu";
    }
    b.onclick = function (e) {
      e.stopPropagation();
      set(p.classList.contains("hidden"));
    };
    document.addEventListener("click", function (e) {
      if (!p.classList.contains("hidden") && !p.contains(e.target) && e.target !== b) set(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !p.classList.contains("hidden")) {
        set(false);
        b.focus();
      }
    });
  })();
  $("fonte").onclick = function () {
    var p = $("mnup"),
      b = $("mnu");
    p.classList.add("hidden");
    b.setAttribute("aria-expanded", "false");
    b.textContent = "☰ Menu";
    if (window.QzFonte) window.QzFonte.abrir();
    else window.Fontes.abrirEscolha();
  };
  $("fz").onclick = function () {
    h.classList.toggle("big");
    ls("big", h.classList.contains("big"));
  };
  $("th").onclick = function () {
    var c = h.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
      n = c === "dark" ? "light" : "dark";
    h.setAttribute("data-theme", n);
    ls("theme", n);
  };
  $("pal").onclick = function () {
    var c = h.getAttribute("data-pal") || "indigo",
      n = PALS[(PALS.indexOf(c) + 1) % PALS.length];
    h.setAttribute("data-pal", n);
    ls("pal", n);
    var bt = $("pal");
    bt.textContent = { indigo: "Índigo", floresta: "Floresta", grafite: "Grafite" }[n];
    setTimeout(function () {
      bt.textContent = "Cores";
    }, 1400);
  };
  if (q && ARQ[q]) {
    go(q);
  }
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    var ofl = function (t, c) {
      var e = document.getElementById("offl");
      if (e) {
        e.textContent = t;
        e.className = "offl" + (c ? " " + c : "");
      }
    };
    var tinha = !!navigator.serviceWorker.controller;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
      navigator.serviceWorker.ready
        .then(function () {
          return caches.keys();
        })
        .then(function (ks) {
          if (ks.length) ofl("✓ Pronto para usar sem internet", "ok");
        })
        .catch(function () {});
      try {
        if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
      } catch (e) {}
    });
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (tinha) ofl("↻ Nova versão instalada. Feche e abra o app para usar as novidades.", "up");
    });
    window.addEventListener("offline", function () {
      ofl("Sem internet agora: tudo continua funcionando e seu progresso fica neste aparelho.", "off");
    });
    window.addEventListener("online", function () {
      ofl("✓ Pronto para usar sem internet", "ok");
    });
  }
})();
