/* Relatório por área e bloco da conta na nuvem, mostrados na tela "Meu desempenho" (perfilUI, no script.js). */
window.AppRelatorio = function (c) {
  "use strict";
  var id = c.id,
    Q = c.Q,
    HI = c.HI,
    ST = c.ST,
    esc = c.esc;
  function relatorio() {
    var P = window.Perfil.ler(),
      L = [],
      h = "";
    Object.keys(P).forEach(function (id) {
      var e = P[id];
      if (HI[id] === undefined || e[0] < 2) return;
      var pc = Math.round((100 * e[1]) / e[0]);
      if (pc < 70) L.push({ i: HI[id], pc: pc, n: e[0] });
    });
    L.sort(function (a, b) {
      return a.pc - b.pc || b.n - a.n;
    });
    var H = ST.get("hist", []),
      sem = {};
    H.forEach(function (x) {
      var k = Math.floor(x.d / 6048e5);
      sem[k] = sem[k] || [0, 0];
      Object.keys(x.a).forEach(function (t) {
        sem[k][0] += x.a[t][0];
        sem[k][1] += x.a[t][1];
      });
    });
    var ks = Object.keys(sem).sort().slice(-4);
    h += '<p style="margin:16px 0 4px"><b>O que melhorar</b></p>';
    if (!L.length)
      h +=
        '<p class="msg neu" style="margin:0">Nenhuma pergunta com acerto abaixo de 70% (entre as que você tentou 2 vezes ou mais). Continue praticando!</p>';
    else
      h +=
        '<p class="msg neu" style="margin:0 0 6px">Perguntas em que você mais erra:</p><ol style="padding-left:22px;margin:0;font-size:.93rem">' +
        L.slice(0, 5)
          .map(function (x) {
            var q = Q[x.i].q;
            return (
              "<li>" +
              esc(q.length > 90 ? q.slice(0, 90) + "…" : q) +
              ' <small style="color:var(--muted)">(' +
              x.pc +
              "% em " +
              x.n +
              " tentativas)</small></li>"
            );
          })
          .join("") +
        '</ol><button class="btn alt" id="trpior" style="margin-top:8px">Treinar estas perguntas</button>';
    if (ks.length > 1)
      h +=
        '<p style="margin:12px 0 4px"><b>Evolução por semana</b></p>' +
        ks
          .map(function (k) {
            var p = Math.round((100 * sem[k][0]) / sem[k][1]);
            return (
              '<p style="margin:4px 0 0;font-size:.9rem">Semana de ' +
              new Date(k * 6048e5).toLocaleDateString("pt-BR") +
              ": " +
              p +
              "% (" +
              sem[k][0] +
              " de " +
              sem[k][1] +
              ')</p><div class="hb"><i style="width:' +
              p +
              '%"></i></div>'
            );
          })
          .join("");
    window.__pior = L.slice(0, 5).map(function (x) {
      return x.i;
    });
    return h;
  }
  function contaHtml() {
    var N = window.Nuvem;
    if (!N || !N.ativo())
      return '<p class="msg neu" style="margin-top:14px">Seu histórico fica guardado neste aparelho. Para levar a outro aparelho, use o caderno de erros (exportar e importar).</p>';
    var h = '<p style="margin:16px 0 4px"><b>Minha conta</b></p>';
    if (N.logado()) {
      var u = N.ultima();
      h +=
        '<p class="msg ok" style="margin:0 0 6px">Conectado com o código <b>' +
        esc(N.codigo()) +
        "</b>." +
        (u ? " Última sincronização: " + new Date(u).toLocaleString("pt-BR") + "." : "") +
        '</p><button class="btn alt" id="nsinc">Sincronizar agora</button><button class="btn alt" id="nsair">Sair da conta</button>';
    } else
      h +=
        '<p class="msg neu" style="margin:0 0 6px">Entre com o código que o professor entregou para guardar seu histórico na nuvem e usá-lo em qualquer aparelho.</p><label class="nl" for="ncod">Seu código</label><input id="ncod" class="fld" autocomplete="off" autocapitalize="characters" maxlength="12" placeholder="Ex.: K7M2-QX9P"><button class="btn" id="nent">Entrar</button>';
    return h + '<p class="msg neu" id="nmsg" style="display:none;margin-top:6px"></p>';
  }
  return { relatorio: relatorio, contaHtml: contaHtml };
};
