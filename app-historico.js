/* Tela de histórico e desempenho: resumo geral, lista de rodadas e botões abrir/voltar/limpar.
   Recebe do quiz (script.js) o código do quiz (id) e só o que nunca muda durante o jogo; a gravação de cada rodada (histAdd) continua no script.js. */
window.AppHistorico = function (c) {
  "use strict";
  var $ = c.$,
    id = c.id,
    QZ = c.QZ,
    ST = c.ST,
    TN = c.TN,
    esc = c.esc,
    perfilUI = c.perfilUI,
    goHome = c.goHome,
    openOnly = c.openOnly,
    graf = c.graf;
  function overview() {
    var D = QuizLista.lista.map(function (q) {
        return [q.id, q.nome, q.prefixo];
      }),
      rows = [],
      T = 0,
      A = 0,
      Rd = 0;
    D.forEach(function (d) {
      var H = [];
      try {
        H = JSON.parse(localStorage.getItem(d[2] + "hist") || "[]");
      } catch (e) {}
      if (!Array.isArray(H)) H = [];
      var q = 0,
        a = 0;
      H.forEach(function (x) {
        if (!x || !x.a) return;
        Object.keys(x.a).forEach(function (k) {
          a += x.a[k][0];
          q += x.a[k][1];
        });
      });
      rows.push({ n: d[1], id: d[0], r: H.length, q: q, a: a });
      T += q;
      A += a;
      Rd += H.length;
    });
    if (!T) return "<p>Ainda não há dados. Termine um quiz para ver a comparação entre os quizzes.</p>";
    var o =
      '<div class="gk"><div><b>' +
      Rd +
      "</b>rodadas</div><div><b>" +
      T +
      "</b>questões</div><div><b>" +
      Math.round((100 * A) / T) +
      '%</b>de acerto</div></div><div class="gr"><h4>Acerto em cada quiz</h4>';
    rows.forEach(function (r) {
      var p = r.q ? Math.round((100 * r.a) / r.q) : 0;
      o +=
        '<div class="ab"><div class="t"><span>' +
        esc(r.n) +
        (r.id === id ? " (este)" : "") +
        "</span><span>" +
        (r.q ? r.a + " de " + r.q + " · " + p + "%" : "sem dados") +
        '</span></div><div class="tr"><i class="' +
        (p >= 70 ? "b1" : p >= 50 ? "b2" : "b3") +
        '" style="width:' +
        p +
        '%"></i></div></div>';
    });
    o +=
      '<p class="lg">Soma das rodadas completas de cada quiz neste aparelho.</p></div><div class="gr"><h4>Rodadas por quiz</h4>';
    var mx =
      Math.max.apply(
        null,
        rows.map(function (r) {
          return r.r;
        })
      ) || 1;
    rows.forEach(function (r) {
      o +=
        '<div class="ab"><div class="t"><span>' +
        esc(r.n) +
        "</span><span>" +
        r.r +
        (r.r === 1 ? " rodada" : " rodadas") +
        '</span></div><div class="tr"><i class="b0" style="width:' +
        Math.round((100 * r.r) / mx) +
        '%"></i></div></div>';
    });
    return o + "</div>";
  }
  function renderHist() {
    var h = ST.get("hist", []);
    var t = {},
      o = "",
      ln = "";
    h.forEach(function (x) {
      Object.keys(x.a).forEach(function (k) {
        t[k] = t[k] || [0, 0];
        t[k][0] += x.a[k][0];
        t[k][1] += x.a[k][1];
      });
    });
    Object.keys(TN).forEach(function (k) {
      if (t[k]) {
        var p = Math.round((100 * t[k][0]) / t[k][1]);
        ln += '<p style="margin:8px 0 0"><b>' + TN[k] + "</b>: " + p + "% (" + t[k][0] + " de " + t[k][1] + ")</p>";
      }
    });
    if (h.length) {
      o +=
        graf(h, t) +
        '<details class="sum" style="margin-top:12px"><summary>Ver os números</summary>' +
        ln +
        '<p style="margin:10px 0 4px"><b>Últimas rodadas</b></p><ol style="padding-left:22px;margin:0">' +
        h
          .slice(-8)
          .reverse()
          .map(function (x) {
            return (
              "<li>" +
              new Date(x.d).toLocaleDateString("pt-BR") +
              ": " +
              String(x.s).replace(".", ",") +
              " de " +
              x.n +
              "</li>"
            );
          })
          .join("") +
        "</ol></details>";
    }
    $("histbody").innerHTML =
      '<div class="htabs" role="tablist" aria-label="Seções do desempenho"><button type="button" class="chip2 lv htab on" role="tab" aria-selected="true" data-p="1">' +
      esc(QZ.nome) +
      '</button><button type="button" class="chip2 lv htab" role="tab" aria-selected="false" data-p="0">Todos os quizzes</button><button type="button" class="chip2 lv htab" role="tab" aria-selected="false" data-p="2">Conta e treino</button></div><div class="hp" id="hp1">' +
      (o || "<p>Ainda não há dados. Termine um quiz para ver sua evolução por área.</p>") +
      '</div><div class="hp hidden" id="hp0">' +
      overview() +
      '</div><div class="hp hidden" id="hp2"></div>';
    $("histbody")
      .querySelectorAll(".htab")
      .forEach(function (b) {
        b.onclick = function () {
          var p = b.getAttribute("data-p");
          $("histbody")
            .querySelectorAll(".htab")
            .forEach(function (x) {
              var on = x === b;
              x.classList.toggle("on", on);
              x.setAttribute("aria-selected", on ? "true" : "false");
            });
          ["hp0", "hp1", "hp2"].forEach(function (k) {
            $(k).classList.toggle("hidden", k !== "hp" + p);
          });
        };
      });
    perfilUI();
  }
  $("hopen").onclick = function () {
    openOnly("hist");
    renderHist();
  };
  $("hback").onclick = goHome;
  $("hclear").onclick = function () {
    ST.del("hist");
    renderHist();
  };
  return { renderHist: renderHist };
};
