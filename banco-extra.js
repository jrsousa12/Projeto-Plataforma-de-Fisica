/* Banco extra: perguntas criadas no editor + perguntas ocultadas. Carregado depois de perguntas-*.js.
   No aparelho de quem edita, os dados ficam em localStorage ("eletriz:custom" e "eletriz:ocultas").
   Nos aparelhos dos alunos valem as perguntas publicadas no arquivo banco-proprio.js (gerado pelo editor). */
(function () {
  "use strict";
  var KC = "eletriz:custom",
    KO = "eletriz:ocultas";
  function ler(k, d) {
    try {
      var v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch (e) {
      return d;
    }
  }
  function gravar(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
  var B = (window.BANKS = window.BANKS || {});
  window.BANKS_ALL = window.BANKS_ALL || {};
  var X = (window.BancoExtra = {
    editando: function () {
      return ler("eletriz:ed", false) === true;
    },
    site: function () {
      var b = window.BANCO_PROPRIO;
      return b && typeof b === "object" ? b : {};
    },
    custom: function () {
      return X.editando() ? ler(KC, {}) : X.site().custom || {};
    } /* {quiz:[pergunta,...]} */,
    ocultas: function () {
      return X.editando() ? ler(KO, []) : X.limpaOcultas(X.site().ocultas);
    } /* [id,...] */,
    salvarCustom: function (c) {
      if (!X.editando()) gravar(KO, X.ocultas());
      gravar(KC, c);
      gravar("eletriz:ed", true);
    },
    salvarOcultas: function (o) {
      if (!X.editando()) gravar(KC, X.custom());
      gravar(KO, o);
      gravar("eletriz:ed", true);
    },
    novoId: function () {
      return "u" + Date.now().toString(36) + Math.floor(Math.random() * 46656).toString(36);
    },
    /* sanitiza uma pergunta que veio de fora (arquivo publicado, importação); devolve null se for inválida */
    limpa: function (d, areas) {
      if (!d || typeof d !== "object") return null;
      var s = function (v, n) {
        return typeof v === "string" ? v.slice(0, n) : "";
      };
      if (typeof d.id !== "string" || !/^u[a-z0-9]{3,24}$/.test(d.id)) return null;
      if (typeof d.t !== "string" || !Object.prototype.hasOwnProperty.call(areas, d.t)) return null;
      if (!Array.isArray(d.o) || (d.o.length !== 2 && d.o.length !== 4)) return null;
      var o = d.o.map(function (x) {
          return s(x, 160).trim();
        }),
        a = +d.a;
      var r = { id: d.id, t: d.t, q: s(d.q, 400).trim(), o: o, a: a, h: s(d.h, 160).trim(), e: s(d.e, 500).trim() };
      if (d.c === 1) r.c = 1;
      if (d.v === 1) r.v = 1;
      if (typeof d.f === "string" && /^[a-z_]{1,24}$/.test(d.f)) r.f = d.f;
      return X.valida(r, areas) ? null : r;
    },
    limpaLista: function (L, areas) {
      return (Array.isArray(L) ? L : [])
        .map(function (d) {
          return X.limpa(d, areas);
        })
        .filter(Boolean);
    },
    limpaOcultas: function (o) {
      return (Array.isArray(o) ? o : [])
        .filter(function (x) {
          return typeof x === "string" && /^[a-z0-9]{1,30}$/.test(x);
        })
        .slice(0, 1000);
    },
    valida: function (d, areas) {
      var o = (d.o || []).map(function (s) {
        return String(s || "").trim();
      });
      if (!String(d.q || "").trim()) return "Escreva o enunciado.";
      if (!areas[d.t]) return "Escolha a área.";
      if (
        o.length < 2 ||
        o.some(function (s) {
          return !s;
        })
      )
        return "Preencha todas as alternativas.";
      var u = {};
      for (var i = 0; i < o.length; i++) {
        if (u[o[i].toLowerCase()]) return "Há alternativas repetidas.";
        u[o[i].toLowerCase()] = 1;
      }
      if (!(d.a >= 0 && d.a < o.length)) return "Marque a alternativa correta.";
      return "";
    },
    /* registra um quiz recém-carregado: guarda a cópia original do banco e aplica as perguntas próprias e as ocultas */
    registrar: function (q) {
      if (!B[q]) return;
      if (!window.BANKS_ALL[q]) window.BANKS_ALL[q] = B[q].slice();
      X.aplicar(q);
    },
    /* aplica: acrescenta as perguntas do professor e remove as ocultadas (de um quiz, ou de todos os já registrados) */
    aplicar: function (so) {
      var c = X.custom(),
        oc = X.ocultas(),
        QZ = window.QUIZZES || {};
      Object.keys(window.BANKS_ALL).forEach(function (q) {
        if (so && q !== so) return;
        var base = window.BANKS_ALL[q].filter(function (d) {
            return !d.u;
          }),
          ex = (QZ[q] ? X.limpaLista(c[q], QZ[q].areas) : []).map(function (d) {
            d.u = 1;
            return d;
          });
        window.BANKS_ALL[q] = base.concat(ex);
        B[q].length = 0;
        window.BANKS_ALL[q].forEach(function (d) {
          if (oc.indexOf(d.id) < 0) B[q].push(d);
        });
      });
    },
  });
  Object.keys(B).forEach(X.registrar); /* quizzes já carregados (editor e arquivo único) */
})();
