/* Moldes de CONCEITO (antes_depois, etapas, comparacao, grafico): desenho.
   Os dados ficam em window.AN_AUTO (itens com tipo:"conceito"), gravados por build/novas.py.
   Regras e formato dos dados: build/CLAUDE.md. */
(function () {
  "use strict";
  var N = window.AN;
  if (!N) return;
  var DATA = (window.AN_AUTO || []).filter(function (d) { return d.tipo === "conceito"; });
  var H = 118, ACC = "var(--acc)", AGUA = "var(--f-agua)";
  function tx(x, y, s, sz, neg, anc) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anc || "middle") + '" font-size="' + (sz || 11) + '"' + (neg ? ' font-weight="700"' : "") + ">" + s + "</text>";
  }
  function linhas(x, y, txt, sz) {
    return String(txt || "").split("|").map(function (l, i) { return tx(x, y + i * ((sz || 11) + 3), l, sz); }).join("");
  }
  /* ícones (cerca de 70 × 40), centrados em (cx, cy) */
  function icone(n, cx, cy) {
    switch (n) {
      case "chama": return N.chama(cx, cy + 16);
      case "gelo": return '<rect x="' + (cx - 17) + '" y="' + (cy - 14) + '" width="34" height="28" rx="5" fill="#bfe3f5" stroke="currentColor" stroke-width="2"/>';
      case "barra": return '<rect x="' + (cx - 35) + '" y="' + (cy - 7) + '" width="70" height="14" rx="3" fill="#9aa6b8" stroke="currentColor" stroke-width="2"/>';
      case "bola": return '<circle cx="' + cx + '" cy="' + cy + '" r="14" fill="' + ACC + '" fill-opacity=".35" stroke="currentColor" stroke-width="2"/>';
      case "agua": return N.bk(cx - 24, cy - 16, 48, 34, 0.6, AGUA);
      case "mola": return N.mola(cx - 36, cx + 36, cy, 6);
      case "onda": return '<path d="' + N.onda(cx - 36, cx + 36, cy, 10, 36) + '" fill="none" stroke="' + ACC + '" stroke-width="2.4"/>';
      case "mais": case "menos":
        return '<circle cx="' + cx + '" cy="' + cy + '" r="14" fill="' + (n === "mais" ? "#ef4444" : "#3b82f6") + '" fill-opacity=".85" stroke="currentColor" stroke-width="2"/>' + tx(cx, cy + 5, n === "mais" ? "+" : "−", 16, 1);
      case "seta": return N.seta(cx, cy + 16, cx, cy - 16, ACC);
      default: return "";
    }
  }
  /* ícone já no tamanho final (escala e); a trilha faz ele crescer/encolher a partir de 1 */
  function iconeEsc(n, cx, cy, e, cl, T, t0, tr) {
    if (!e || e === 1) return icone(n, cx, cy);
    tr.push(N.sc("." + cl, T, [[0, 1 / e], [t0, 1 / e], [t0 + 2, 1]]));
    return '<g transform="translate(' + cx + " " + cy + ") scale(" + e + ") translate(" + -cx + " " + -cy + ')"><g class="' + cl + '" style="transform-box:fill-box;transform-origin:50% 50%">' + icone(n, cx, cy) + "</g></g>";
  }
  /* painel: moldura, título, ícone e texto curto */
  function painel(p, cx, cl, T, t0, tr, iw) {
    var s = '<g class="' + cl + '"><rect x="' + (cx - 70) + '" y="4" width="140" height="' + (H - 8) + '" rx="8" fill="none" stroke="currentColor" stroke-opacity=".35"/>' + tx(cx, 20, p.titulo, 12, 1);
    s += iconeEsc(p.icone, cx, 52, p.escala, iw, T, t0, tr) + linhas(cx, 90, p.texto, 11) + "</g>";
    return s;
  }
  function antesDepois(d, T, t, tr) {
    tr.push(N.vis(".pb", T, t[1]), N.vis(".sb", T, t[1] - 0.6));
    return painel(d.antes, 80, "pa", T, 0, tr, "ia") + N.seta(152, 52, 172, 52, ACC, "sb") + painel(d.depois, 240, "pb", T, t[1] + 0.3, tr, "ib");
  }
  function comparacao(d, T, t, tr) {
    tr.push(N.vis(".pb", T, t[1]));
    return painel(d.a, 80, "pa", T, 0, tr, "ia") + tx(160, 58, "×", 18, 1) + painel(d.b, 240, "pb", T, t[1], tr, "ib");
  }
  function etapas(d, T, t, tr) {
    var n = d.etapas.length, g = 12, w = (300 - (n - 1) * g) / n, s = "";
    d.etapas.forEach(function (e, i) {
      var x = 10 + i * (w + g), cx = x + w / 2, cl = "e" + i;
      s += '<g class="' + cl + '"><rect x="' + x.toFixed(1) + '" y="14" width="' + w.toFixed(1) + '" height="' + (H - 28) + '" rx="8" fill="' + ACC + '" fill-opacity=".08" stroke="currentColor" stroke-opacity=".4"/>';
      s += '<circle cx="' + cx.toFixed(1) + '" cy="14" r="10" fill="' + ACC + '"/>' + '<text x="' + cx.toFixed(1) + '" y="18.5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">' + (i + 1) + "</text>";
      s += (e.icone ? icone(e.icone, cx, 50) : "") + linhas(cx, e.icone ? 84 : 52, e.titulo, 10.5) + "</g>";
      if (i) { s += N.seta(x - g + 1, 52, x - 1, 52, ACC, "s" + i, 2); tr.push(N.vis(".s" + i, T, t[i])); }
      if (i) tr.push(N.vis("." + cl, T, t[i]));
    });
    return s;
  }
  var CURVAS = {
    sobe: function (u) { return u; }, desce: function (u) { return 1 - u; }, constante: function () { return 0.5; },
    acelera: function (u) { return u * u; }, satura: function (u) { return 1 - Math.exp(-4 * u); },
    patamar: function (u) { return u < 0.35 ? u / 0.35 * 0.5 : u < 0.65 ? 0.5 : 0.5 + (u - 0.65) / 0.35 * 0.5; }
  };
  function grafico(d, T, t, tr) {
    var x0 = 50, y0 = 100, L = 236, A = 80, f = CURVAS[d.curva], p = "", i;
    for (i = 0; i <= 60; i++) p += (i ? "L" : "M") + (x0 + L * i / 60).toFixed(1) + " " + (y0 - 4 - (A - 8) * f(i / 60)).toFixed(1);
    var s = N.seta(x0, y0, x0 + L + 14, y0, "currentColor", "", 2) + N.seta(x0, y0, x0, y0 - A - 8, "currentColor", "", 2);
    s += tx(x0 + L + 14, y0 + 14, d.x, 11, 0, "end") + tx(x0 + 6, 10, d.y, 11, 0, "start");
    s += '<path class="cv" d="' + p + '" pathLength="1" stroke-dasharray="1" fill="none" stroke="' + ACC + '" stroke-width="3" stroke-linecap="round"/>';
    tr.push(N.pr(".cv", T, "strokeDashoffset", [[0, 1], [0.6, 1], [t[t.length - 1], 0]], "ease-in-out"));
    return s;
  }
  var MOLDES = { antes_depois: antesDepois, comparacao: comparacao, etapas: etapas, grafico: grafico };
  function build(d) {
    var leg = d.legendas, n = leg.length, t = leg.map(function (_, i) { return i * 3.2; }), T = t[n - 1] + 4, tr = [];
    var s = MOLDES[d.molde](d, T, t, tr);
    N.scene(d.key, d.alt, H, s, tr, T, leg, t);
  }
  DATA.forEach(function (d) { try { build(d); } catch (e) { if (window.console) console.error("molde conceito " + d.key, e); } });
})();
