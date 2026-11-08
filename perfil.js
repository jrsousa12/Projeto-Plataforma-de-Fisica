/* Perfil do aluno: desempenho por pergunta neste aparelho, e treino adaptativo. */
(function () {
  "use strict";
  var K = "eletriz:perfil";
  function ler() {
    try {
      return JSON.parse(localStorage.getItem(K) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function gravar(o) {
    try {
      localStorage.setItem(K, JSON.stringify(o));
    } catch (e) {}
  }
  var P = (window.Perfil = {
    ler: ler,
    /* [tentativas, acertos, último uso] por id */
    registrar: function (id, ok) {
      if (!id || /^n\d+$/.test(id)) return;
      var o = ler(),
        e = o[id] || [0, 0, 0];
      e[0]++;
      if (ok) e[1]++;
      e[2] = Date.now();
      o[id] = e;
      gravar(o);
    },
    peso: function (id, o) {
      var e = (o || ler())[id];
      if (!e || !e[0]) return 1;
      var acc = e[1] / e[0],
        dias = Math.min(30, (Date.now() - e[2]) / 864e5) / 30;
      return 0.15 + 2 * (1 - acc) + 0.5 * dias + (e[0] < 2 ? 0.3 : 0);
    },
    /* sorteia n perguntas dando mais chance às que o aluno errou, ainda não viu ou não revê há tempo */
    sugerir: function (ids, n) {
      var o = ler(),
        L = ids.map(function (i) {
          return { i: i.id !== undefined ? i.k : i, w: P.peso(i.id !== undefined ? i.id : i, o) };
        }),
        r = [];
      while (r.length < n && L.length) {
        var t = L.reduce(function (s, x) {
            return s + x.w;
          }, 0),
          u = Math.random() * t,
          k = 0;
        for (; k < L.length - 1; k++) {
          u -= L[k].w;
          if (u <= 0) break;
        }
        r.push(L[k].i);
        L.splice(k, 1);
      }
      return r;
    },
    /* resumo por área: dominadas (2 ou mais tentativas e 80% de acerto), vistas, total */
    resumo: function (banco) {
      var o = ler(),
        a = {};
      banco.forEach(function (d) {
        if (d.g) return;
        var r = (a[d.t] = a[d.t] || { tot: 0, vistas: 0, dom: 0, n: 0, ac: 0 }),
          e = o[d.id];
        r.tot++;
        if (e && e[0]) {
          r.vistas++;
          r.n += e[0];
          r.ac += e[1];
          if (e[0] >= 2 && e[1] / e[0] >= 0.8) r.dom++;
        }
      });
      return a;
    },
  });
})();
