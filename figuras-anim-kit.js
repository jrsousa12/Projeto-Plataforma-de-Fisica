/* Kit de peças comuns às animações por área (figuras-animq-*.js).
   Complementa figuras-anim.js e figuras-anim-pecas.js: usa window.AN.
   Antes, estas peças eram copiadas em vários arquivos; agora ficam só aqui.
   Catálogo das peças: build/CLAUDE.md. */
(function () {
  "use strict";
  var N = (window.AN = window.AN || {});
  var QUENTE = "var(--f-calor)",
    RAIO = "var(--acc)";
  function c_(cl) {
    return cl || "";
  }

  /* chama de fogo; (x, y) = base da chama */
  N.chama = function (x, y, cl) {
    return (
      '<g class="' + c_(cl) + '"><path d="M' + x + " " + y +
      'c-9-9-9-17-2-26 1 6 5 8 7 13 3-4 2-9 1-12 8 8 11 17 3 25-3 4-6 4-9 0z" fill="' + QUENTE +
      '" stroke="#a63a0f" stroke-width="1.2"/><path d="M' + x + " " + (y - 2) +
      'c-4-4-3-9 0-13 2 4 5 6 1 13z" fill="#facc15"/></g>'
    );
  };

  /* seta em qualquer direção, de (x1,y1) até (x2,y2); cor c, espessura w (padrão 3) */
  N.seta = function (x1, y1, x2, y2, c, cl, w) {
    var a = Math.atan2(y2 - y1, x2 - x1),
      h = 7;
    return (
      '<g class="' + c_(cl) + '"><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke="' + c + '" stroke-width="' + (w || 3) + '" stroke-linecap="round"/><path d="M' + x2 + " " + y2 +
      "L" + (x2 - h * Math.cos(a - 0.5)) + " " + (y2 - h * Math.sin(a - 0.5)) +
      "L" + (x2 - h * Math.cos(a + 0.5)) + " " + (y2 - h * Math.sin(a + 0.5)) +
      'z" fill="' + c + '"/></g>'
    );
  };

  /* raio de luz; ponta no fim (padrão) ou no meio (meio = verdadeiro, estilo da óptica) */
  N.raio = function (x1, y1, x2, y2, cl, col, dash, meio) {
    var a = Math.atan2(y2 - y1, x2 - x1),
      h = 7,
      k = col || RAIO,
      mx = meio ? (x1 + x2) / 2 : x2,
      my = meio ? (y1 + y2) / 2 : y2,
      sg = meio ? 1 : -1,
      p = function (r, b) {
        return (mx + sg * r * Math.cos(a + b)).toFixed(1) + " " + (my + sg * r * Math.sin(a + b)).toFixed(1);
      },
      ponta = meio ? "M" + p(h, 0) + "L" + p(h, 2.6) + "L" + p(h, -2.6) : "M" + mx + " " + my + "L" + p(h, 0.45) + "L" + p(h, -0.45);
    return (
      '<g class="' + c_(cl) + '"><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke="' + k + '" stroke-width="' + (meio ? 2.4 : 2.6) + '"' + (dash ? ' stroke-dasharray="5 4"' : "") +
      '/><path d="' + ponta + 'Z" fill="' + k + '"/></g>'
    );
  };

  /* linha tracejada fraca (guia, normal, prolongamento) */
  N.tracejado = function (x1, y1, x2, y2, cl) {
    return (
      '<g class="' + c_(cl) + '"><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke="currentColor" stroke-opacity=".5" stroke-dasharray="4 3"/></g>'
    );
  };

  /* caminho "d" de uma onda senoidal de x0 a x1, em torno de y; amplitude A, comprimento lam, fase ph, passo st */
  N.onda = function (x0, x1, y, A, lam, ph, st) {
    var p = "", x;
    st = st || 3;
    for (x = x0; x <= x1 + 0.01; x += st)
      p += (x === x0 ? "M" : "L") + x.toFixed(1) + " " + (y - A * Math.sin((2 * Math.PI * (x - x0)) / lam + (ph || 0))).toFixed(1);
    return p;
  };

  /* caminho "d" de uma curva qualquer: fn(u), u de 0 a 1, ao longo de L a partir de x0 */
  N.curva = function (x0, L, y, A, fn) {
    var p = "", i, n = 60;
    for (i = 0; i <= n; i++) {
      var x = x0 + (L * i) / n;
      p += (i ? "L" : "M") + x.toFixed(1) + " " + (y - A * fn(i / n)).toFixed(1);
    }
    return p;
  };

  /* mola horizontal de x1 a x2 na altura y; n voltas, meia-altura a (padrão 8) */
  N.mola = function (x1, x2, y, n, a, cl) {
    n = n || 8; a = a || 8;
    var ponta = 8, L = x2 - x1 - 2 * ponta, d = "M" + x1 + " " + y + "H" + (x1 + ponta), i;
    for (i = 0; i < 2 * n; i++) d += "L" + (x1 + ponta + (L * (i + 0.5)) / (2 * n)).toFixed(1) + " " + (i % 2 ? y + a : y - a);
    d += "L" + (x2 - ponta) + " " + y + "H" + x2;
    return (
      '<g class="' + c_(cl) + '"><path d="' + d +
      '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></g>'
    );
  };
})();
