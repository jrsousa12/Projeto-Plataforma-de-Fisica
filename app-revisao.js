/* Rever perguntas já respondidas na rodada (botão "← Anterior" do modo estudo). Recebe do quiz (script.js) o que usa; respostas, ordem, posição e áreas mudam ou chegam depois, por isso vêm de c.res(), c.order(), c.i() e c.TN(). */
window.AppRevisao = function (c) {
  "use strict";
  var $ = c.$,
    Q = c.Q,
    FIG = c.FIG,
    esc = c.esc,
    fmtE = c.fmtE;
  var rvk = -1;
  function rvExit() {
    rvk = -1;
    $("quiz").classList.remove("revmode");
    $("rvw").classList.add("hidden");
    $("rvw").innerHTML = "";
  }
  function rvShow(k) {
    rvk = k;
    var r = c.res()[k],
      d = Q[r.qi],
      g = r.g,
      w = $("rvw"),
      h = "";
    w.classList.remove("hidden");
    $("quiz").classList.add("revmode");
    $("quiz").setAttribute("data-a", d.t);
    h +=
      '<p class="rvh">Revendo pergunta ' +
      (k + 1) +
      " de " +
      c.order().length +
      " · " +
      esc(c.TN()[d.t]) +
      ' <span class="rvs ' +
      (r.ok ? "ok" : "no") +
      '">' +
      (r.ok ? "✓ certa" : "✗ errada") +
      '</span></p><p class="q">' +
      esc(g ? g.q : d.q) +
      "</p>";
    if (d.f && FIG[d.f])
      h +=
        '<div class="fig"><svg viewBox="0 0 320 140" role="img" aria-label="' +
        esc(FIG[d.f].a) +
        '">' +
        FIG[d.f].s +
        "</svg></div>";
    if (!g) {
      h += '<div class="opts">';
      d.o.forEach(function (t, n) {
        var c = "opt" + (n === d.a ? " right" : "") + (n === r.pick && !r.ok ? " wrong" : "");
        h +=
          '<button type="button" class="' +
          c +
          '" disabled><span class="l">' +
          "ABCD".charAt(n) +
          "</span><span>" +
          esc(t) +
          "</span></button>";
      });
      h += "</div>";
    }
    h +=
      '<div class="fb' +
      (r.ok ? "" : " no") +
      '"><b>Explicação</b><p id="rvp"></p></div><div class="rvn"><button type="button" class="btn alt" id="rvb"' +
      (k === 0 ? " disabled" : "") +
      '>← Anterior</button><button type="button" class="btn alt" id="rvf"' +
      (k >= c.i() - 1 ? " disabled" : "") +
      '>Seguinte →</button></div><button type="button" class="btn" id="rvx">Voltar à pergunta ' +
      (c.i() + 1) +
      "</button>";
    w.innerHTML = h;
    fmtE($("rvp"), g ? g.e + " Resposta: " + g.at : d.e, !!(g || d.c));
    $("rvb").onclick = function () {
      rvShow(k - 1);
    };
    $("rvf").onclick = function () {
      rvShow(k + 1);
    };
    $("rvx").onclick = function () {
      rvExit();
      window.scrollTo(0, 0);
    };
    window.scrollTo(0, 0);
  }
  return { rvExit: rvExit, rvShow: rvShow };
};
