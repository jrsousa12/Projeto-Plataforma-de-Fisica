/* Quadro "Perguntas dominadas", treino adaptativo e botões da conta na nuvem (tela "Meu desempenho").
   Chamado pelo app-historico.js; começar um treino passa pelo script.js (c.estudar). */
window.AppPerfil = function (c) {
  "use strict";
  var $ = c.$,
    Q = c.Q,
    TN = c.TN,
    esc = c.esc;
  function perfilUI() {
    var el = document.createElement("div");
    el.id = "perfilbox";
    var R = window.Perfil.resumo(Q),
      o = "",
      pior = null;
    Object.keys(TN).forEach(function (k) {
      var r = R[k];
      if (!r) return;
      var pc = r.n ? Math.round((100 * r.ac) / r.n) : null;
      if (pc !== null && (pior === null || pc < pior.pc)) pior = { k: k, pc: pc };
      o +=
        '<p style="margin:6px 0 0"><b>' +
        esc(TN[k]) +
        "</b>: " +
        r.vistas +
        " de " +
        r.tot +
        " perguntas vistas, " +
        r.dom +
        " dominadas</p>";
    });
    var nv = Object.keys(window.Perfil.ler()).length;
    el.innerHTML =
      '<p style="margin:16px 0 4px"><b>Perguntas dominadas</b></p><p class="msg neu" style="margin:0 0 6px">Dominada: 2 ou mais tentativas e pelo menos 80% de acerto.</p>' +
      o +
      (pior && pior.pc < 70
        ? '<p class="msg no" style="margin-top:10px">Para reforçar: <b>' +
          esc(TN[pior.k]) +
          "</b> (" +
          pior.pc +
          "% de acerto).</p>"
        : "") +
      '<button class="btn" id="tadapt" style="margin-top:10px">Treino adaptativo (10 perguntas)</button><p class="msg neu" style="margin-top:6px">Sorteia mais perguntas das que você errou, ainda não viu ou não revê há tempo.</p>' +
      c.relatorio() +
      c.contaHtml();
    ($("hp2") || $("histbody")).appendChild(el);
    $("tadapt").onclick = function () {
      var ids = c.poolSel()
          .map(function (k) {
            return { k: k, id: Q[k].id };
          })
          .filter(function (x) {
            return !Q[x.k].g;
          }),
        s = window.Perfil.sugerir(ids, 10);
      if (s.length) c.estudar(s);
    };
    var nm = function (t, ok) {
      var m = $("nmsg");
      if (!m) return;
      m.textContent = t;
      m.className = "msg " + (ok ? "ok" : "no");
      m.style.display = "block";
    };
    if ($("trpior"))
      $("trpior").onclick = function () {
        if (window.__pior.length) c.estudar(window.__pior.slice());
      };
    if ($("nent"))
      $("nent").onclick = function () {
        nm("Entrando…", true);
        window.Nuvem.entrar($("ncod").value)
          .then(function () {
            c.renderHist();
            nm("Conectado! Seu histórico está sincronizado.", true);
          })
          .catch(function (e) {
            nm(e.message, false);
          });
      };
    if ($("nsinc"))
      $("nsinc").onclick = function () {
        nm("Sincronizando…", true);
        window.Nuvem.sincronizar().then(function (r) {
          if (r) {
            c.renderHist();
            nm("Sincronizado.", true);
          } else nm("Não foi possível sincronizar agora.", false);
        });
      };
    if ($("nsair"))
      $("nsair").onclick = function () {
        window.Nuvem.sair();
        c.renderHist();
      };
  }
  return { perfilUI: perfilUI };
};
