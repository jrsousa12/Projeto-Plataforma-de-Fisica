/* Sessão do quiz: guardar e retomar de onde parou, e a tela de Fontes de referência.
   O quiz em andamento fica guardado (com o tempo pausado) e pode ser retomado da tela inicial da área.
   Recebe em "c" o que precisa do script.js; o que muda com o tempo chega como função. */
window.AppSessao = function (c) {
  var $ = c.$;
  /* lê a sessão guardada e converte os ids de volta em posições do banco atual; devolve null se alguma pergunta não existir mais */
  function sessGet() {
    var S = c.ST.get("sess", null);
    if (
      !(
        S &&
        S.v === 2 &&
        Array.isArray(S.ids) &&
        Array.isArray(S.r) &&
        S.ids.length &&
        Date.now() - S.at < 432e5 &&
        (S.m === "estudo" || S.m === "tempo" || S.m === "simulado")
      )
    )
      return null;
    var IX = {};
    c.Q.forEach(function (d, k) {
      IX[d.id] = k;
    });
    var o = S.ids.map(function (x) {
        return IX[x];
      }),
      r = S.r.map(function (x) {
        var y = {};
        for (var k in x) y[k] = x[k];
        y.qi = IX[x && x.id];
        return y;
      });
    if (
      o.some(function (k) {
        return k === undefined;
      }) ||
      r.some(function (x) {
        return x.qi === undefined;
      })
    )
      return null;
    S.o = o;
    S.r = r;
    return S;
  }
  /* pausa e guarda o quiz em andamento */
  function parkQuiz() {
    if (!c.running()) return false;
    c.qPause();
    c.save();
    c.estacionar();
    return true;
  }
  function openFontes() {
    if (c.running()) parkQuiz();
    ["home", "quiz", "end", "book", "sheet", "cards", "hist", "bar", "dots", "exitq"].forEach(function (x) {
      $(x).classList.add("hidden");
    });
    c.Fontes.tela($("fbody"), c.id);
    $("fontes").classList.remove("hidden");
    retUi();
    window.scrollTo(0, 0);
    c.setHash("fontes");
  }
  function retomar() {
    var S = sessGet();
    if (!S) {
      c.goHome();
      return;
    }
    c.retomarCom(S);
  }
  /* botões "Voltar ao quiz atual" (tela inicial e tela de fontes) */
  function retUi() {
    var S = sessGet(),
      ok = !!S;
    [$("retq"), $("fvolta")].forEach(function (x) {
      if (!x) return;
      x.classList.toggle("hidden", !ok);
      if (ok) {
        x.textContent = "";
        var t = document.createElement("span");
        t.textContent = "↩ Voltar ao quiz atual";
        x.appendChild(t);
        var sm = document.createElement("small"),
          n = Math.min(S.r.length + 1, S.o.length),
          el = S.el || 0;
        sm.textContent =
          "Pergunta " +
          n +
          " de " +
          S.o.length +
          " · " +
          (S.m === "simulado" ? "restam " + c.fmt(Math.max(0, 2400 - el)) : "tempo " + c.fmt(el)) +
          " (pausado)";
        x.appendChild(sm);
      }
    });
  }
  $("retq").onclick = retomar;
  $("fvolta").onclick = retomar;
  $("fonteq").onclick = function (e) {
    e.stopPropagation();
    var p = $("fpop"),
      abre = p.classList.contains("hidden");
    if (abre) c.Fontes.quadro(p, c.id, openFontes);
    p.classList.toggle("hidden", !abre);
    $("fonteq").setAttribute("aria-expanded", abre ? "true" : "false");
  };
  document.addEventListener("click", function (e) {
    var p = $("fpop");
    if (p && !p.classList.contains("hidden") && !p.contains(e.target) && e.target !== $("fonteq")) {
      p.classList.add("hidden");
      $("fonteq").setAttribute("aria-expanded", "false");
    }
  });
  window.QzFonte = {
    abrir: openFontes,
    voltar: function () {
      $("back").click();
    },
  };
  return { sessGet: sessGet, openFontes: openFontes, retomar: retomar, retUi: retUi };
};
