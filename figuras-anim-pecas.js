/* Peças de desenho das animações de resolução: subscrito, carga, cotas, setas, texto e béquer.
   Complementa figuras-anim.js: usa window.AN. */
(function () {
  "use strict";
  var N = (window.AN = window.AN || {});
  /* índice: tspan com subscrito */
  N.sb = function (t) {
    return '<tspan dy="3" font-size="9">' + t + '</tspan><tspan dy="-3"> </tspan>';
  };
  /* carga elétrica: círculo com sinal e rótulo abaixo */
  N.ch = function (x, y, v, lab, cl, r) {
    r = r || 15;
    var c = v > 0 ? "an-rp" : "an-rn",
      sg = v > 0 ? "+" : v < 0 ? "−" : "";
    return (
      '<g class="' +
      (cl || "") +
      '"><circle cx="' +
      x +
      '" cy="' +
      y +
      '" r="' +
      r +
      '" class="' +
      c +
      '"/><text x="' +
      x +
      '" y="' +
      (y + 5) +
      '" text-anchor="middle" font-size="16" font-weight="700">' +
      sg +
      "</text>" +
      (lab
        ? '<text x="' +
          x +
          '" y="' +
          (y + r + 14) +
          '" text-anchor="middle" font-size="12" font-weight="700">' +
          lab +
          "</text>"
        : "") +
      "</g>"
    );
  };
  /* cota horizontal */
  N.dm = function (x1, x2, y, txt, cl) {
    return (
      '<g class="' +
      (cl || "") +
      '"><line x1="' +
      x1 +
      '" y1="' +
      y +
      '" x2="' +
      x2 +
      '" y2="' +
      y +
      '" stroke="currentColor" stroke-width="1.5"/><line x1="' +
      x1 +
      '" y1="' +
      (y - 5) +
      '" x2="' +
      x1 +
      '" y2="' +
      (y + 5) +
      '" stroke="currentColor" stroke-width="1.5"/><line x1="' +
      x2 +
      '" y1="' +
      (y - 5) +
      '" x2="' +
      x2 +
      '" y2="' +
      (y + 5) +
      '" stroke="currentColor" stroke-width="1.5"/><text x="' +
      (x1 + x2) / 2 +
      '" y="' +
      (y - 8) +
      '" text-anchor="middle" font-size="12" font-weight="700">' +
      txt +
      "</text></g>"
    );
  };
  /* cota vertical (texto à esquerda) */
  N.dv = function (x, y1, y2, txt, cl) {
    return (
      '<g class="' +
      (cl || "") +
      '"><line x1="' +
      x +
      '" y1="' +
      y1 +
      '" x2="' +
      x +
      '" y2="' +
      y2 +
      '" stroke="currentColor" stroke-width="1.5"/><line x1="' +
      (x - 5) +
      '" y1="' +
      y1 +
      '" x2="' +
      (x + 5) +
      '" y2="' +
      y1 +
      '" stroke="currentColor" stroke-width="1.5"/><line x1="' +
      (x - 5) +
      '" y1="' +
      y2 +
      '" x2="' +
      (x + 5) +
      '" y2="' +
      y2 +
      '" stroke="currentColor" stroke-width="1.5"/><text x="' +
      (x - 8) +
      '" y="' +
      ((y1 + y2) / 2 + 4) +
      '" text-anchor="end" font-size="12" font-weight="700">' +
      txt +
      "</text></g>"
    );
  };
  /* seta em qualquer direção: sai de (x,y), comprimento len, ângulo deg (0 = para a direita, 90 = para baixo) */
  N.ar = function (x, y, len, deg, cls, w) {
    return '<g transform="translate(' + x + " " + y + ") rotate(" + deg + ')">' + N.arrow(0, len, 0, cls, w) + "</g>";
  };
  /* texto simples */
  N.t = function (x, y, txt, o) {
    o = o || {};
    return (
      '<text x="' +
      x +
      '" y="' +
      y +
      '" text-anchor="' +
      (o.a || "middle") +
      '" font-size="' +
      (o.s || 12) +
      '" font-weight="700"' +
      (o.c ? ' class="' + o.c + '"' : "") +
      (o.o !== undefined ? ' opacity="' + o.o + '"' : "") +
      (o.f ? ' style="fill:' + o.f + '"' : "") +
      ">" +
      txt +
      "</text>"
    );
  };
  /* béquer: paredes, líquido até a fração lv da altura */
  N.bk = function (x, y, w, h, lv, fill, cl) {
    var ly = y + h * (1 - lv);
    return (
      '<g class="' +
      (cl || "") +
      '"><rect x="' +
      (x + 1.5) +
      '" y="' +
      ly +
      '" width="' +
      (w - 3) +
      '" height="' +
      (y + h - ly - 1.5) +
      '" fill="' +
      fill +
      '" fill-opacity=".45"/><path d="M' +
      x +
      " " +
      y +
      "V" +
      (y + h) +
      "H" +
      (x + w) +
      "V" +
      y +
      '" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></g>'
    );
  };
})();
