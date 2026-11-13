/* Caderno de erros: guarda as questões erradas (saem após 2 acertos seguidos), mostra a lista e exporta/importa por código.
   Recebe do quiz (script.js) o que usa; nenhum desses itens muda durante o jogo. O botão "Treinar" continua no script.js (inicia rodada). */
window.AppCaderno = function (c) {
  "use strict";
  var $ = c.$,
    Q = c.Q,
    ST = c.ST,
    TN = c.TN,
    HI = c.HI,
    LEG = c.LEG,
    esc = c.esc,
    goHome = c.goHome,
    openOnly = c.openOnly;
  function bkGet() {
    return ST.get("book", {});
  }
  function bkSet(o) {
    ST.set("book", o);
  }
  function bkUpdate(qi, ok) {
    if (Q[qi].g) return;
    var o = bkGet(),
      k = Q[qi].id,
      x = o[k];
    if (!ok) {
      x = x || { w: 0, r: 0 };
      x.w++;
      x.r = 0;
      o[k] = x;
    } else if (x) {
      x.r++;
      if (x.r >= 2) delete o[k];
    }
    bkSet(o);
  }
  function bkList() {
    var o = bkGet();
    return Object.keys(o)
      .filter(function (k) {
        return HI[k] !== undefined;
      })
      .sort(function (a, b) {
        return o[b].w - o[a].w;
      })
      .map(function (k) {
        return HI[k];
      });
  }
  function renderBook() {
    var l = bkList(),
      o = bkGet(),
      h = "";
    l.forEach(function (qi) {
      var d = Q[qi];
      h +=
        '<div class="rv"><h3>' +
        esc(d.q) +
        "</h3><p><b>Correta:</b> " +
        esc(d.o[d.a]) +
        "</p><p>" +
        Eq.html(d.e.replace(/\n/g, " ")) +
        '</p><p style="color:var(--muted)">Erros: ' +
        o[d.id].w +
        " · " +
        TN[d.t] +
        "</p></div>";
    });
    $("bookbody").innerHTML =
      h ||
      "<p>Seu caderno está vazio. As questões que você errar aparecem aqui e saem depois de 2 acertos seguidos.</p>";
    $("btrain").classList.toggle("hidden", !l.length);
    $("bclear").classList.toggle("hidden", !l.length);
  }
  $("bopen").onclick = function () {
    openOnly("book");
    renderBook();
  };
  $("bback").onclick = goHome;
  $("bclear").onclick = function () {
    bkSet({});
    renderBook();
  };
  $("bexp").onclick = function () {
    var c = btoa(JSON.stringify(bkGet()));
    $("bkio").value = c;
    try {
      navigator.clipboard.writeText(c).catch(function () {});
    } catch (e) {}
    $("bmsg").textContent = "Código gerado. Copie e cole em outro aparelho.";
  };
  $("bimp").onclick = function () {
    try {
      var o = JSON.parse(atob($("bkio").value.trim())),
        c = bkGet();
      if (!o || typeof o !== "object" || Array.isArray(o)) throw 0;
      Object.keys(o).forEach(function (k0) {
        var k = LEG[k0] || k0,
          x = o[k0];
        if (HI[k] === undefined || !x || typeof x !== "object") return;
        x = {
          w: Math.min(999, Math.max(0, Math.round(+x.w) || 0)),
          r: Math.min(9, Math.max(0, Math.round(+x.r) || 0)),
        };
        if (!x.w) return;
        if (!c[k] || c[k].w < x.w) c[k] = x;
      });
      bkSet(c);
      renderBook();
      $("bmsg").textContent = "Caderno importado.";
    } catch (e) {
      $("bmsg").textContent = "Código inválido.";
    }
  };
  return { bkUpdate: bkUpdate, bkList: bkList, renderBook: renderBook };
};
