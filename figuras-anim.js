/* Animações explicativas (SVG + Web Animations). Mostradas depois que o aluno responde.
   Cada animação: {a: descrição, h: altura do viewBox, s: SVG no estado final, t: trilhas, T: duração total}.
   O SVG já está no estado final; as trilhas só reproduzem o caminho até ele. */
(function () {
  "use strict";
  window.ANIM = window.ANIM || {};
  var N = (window.AN = window.AN || {});
  N.sp = 1.3; /* corrigido: fator de lentidão reduzido de 1.7 para 1.3 (~24% mais rápido). */ /* fator de lentidão: todas as animações rodam mais devagar para dar tempo de ler */
  N.reg = function (k, o) {
    if (N._cap && !o.cap) o.cap = N._cap;
    N._cap = null;
    window.ANIM[k] = o;
  };
  function r1(x) {
    return Math.round(x * 100) / 100;
  }
  /* garante keyframes em 0 e em 1 sem esticar a trilha */
  function fin(k) {
    var a = k[0],
      z = k[k.length - 1],
      c;
    if (a.offset > 0) {
      c = {};
      for (var q in a) c[q] = a[q];
      c.offset = 0;
      k.unshift(c);
    }
    if (z.offset < 1) {
      c = {};
      for (q in z) c[q] = z[q];
      c.offset = 1;
      k.push(c);
    }
    return k;
  }
  /* trilha de movimento: pts = [[t,x,y],...] em segundos; opcional escala [t,x,y,sx,sy] */
  N.tr = function (sel, T, pts, ease) {
    var k = pts.map(function (p) {
      var s = "translate(" + r1(p[1]) + "px," + r1(p[2]) + "px)";
      if (p.length > 3) s += " scale(" + p[3] + "," + (p[4] === undefined ? p[3] : p[4]) + ")";
      return { offset: Math.min(1, p[0] / T), transform: s };
    });
    fin(k);
    return [sel, k, 0, T, ease || "ease-in-out"];
  };
  /* trilha de rotação (graus) */
  N.rot = function (sel, T, pts, ease) {
    var k = pts.map(function (p) {
      return { offset: Math.min(1, p[0] / T), transform: "rotate(" + r1(p[1]) + "deg)" };
    });
    fin(k);
    return [sel, k, 0, T, ease || "ease-in-out"];
  };
  /* trilha de escala (origem definida por style transform-origin no elemento) */
  N.sc = function (sel, T, pts, ease) {
    var k = pts.map(function (p) {
      return {
        offset: Math.min(1, p[0] / T),
        transform: "scale(" + r1(p[1]) + "," + r1(p[2] === undefined ? p[1] : p[2]) + ")",
      };
    });
    fin(k);
    return [sel, k, 0, T, ease || "ease-in-out"];
  };
  /* trilha de opacidade: pts = [[t,o],...] */
  N.op = function (sel, T, pts) {
    var k = pts.map(function (p) {
      return { offset: Math.min(1, p[0] / T), opacity: p[1] };
    });
    fin(k);
    return [sel, k, 0, T, "linear"];
  };
  /* aparece em t0 (e some em t1, se informado) */
  N.vis = function (sel, T, t0, t1) {
    var d = 0.25,
      p = [[0, 0]];
    if (t0 > 0) p.push([t0, 0]);
    p.push([t0 + d, 1]);
    if (t1 !== undefined && t1 !== null) {
      p.push([t1, 1]);
      p.push([t1 + d, 0]);
    }
    return N.op(sel, T, p);
  };
  /* trilha de uma propriedade qualquer: pts [[t,valor],...] */
  N.pr = function (sel, T, prop, pts, ease) {
    var k = pts.map(function (p) {
      var o = { offset: Math.min(1, p[0] / T) };
      o[prop] = p[1];
      return o;
    });
    fin(k);
    return [sel, k, 0, T, ease || "linear"];
  };
  /* legendas: linhas separadas por "|"; times = instante em que cada legenda entra. A última fica. */
  N.cap = function (list, times, T, y) {
    y = y || 160;
    N._cap = { list: list, times: times, T: T, y: y };
    var s = "",
      t = [];
    list.forEach(function (txt, i) {
      var ls = txt.split("|"),
        cl = "cp" + i,
        last = i === list.length - 1;
      ls.forEach(function (l, j) {
        s +=
          '<text class="' +
          cl +
          '" x="160" y="' +
          (y + j * 14) +
          '" text-anchor="middle"' +
          (last ? "" : ' opacity="0"') +
          ">" +
          l +
          "</text>";
      });
      t.push(N.vis("." + cl, T, times[i], last ? null : times[i + 1]));
    });
    return { s: s, t: t };
  };
  N.arrow = function (x1, x2, y, cls, w) {
    var d = x2 > x1 ? 1 : -1,
      h = 6;
    return (
      '<g class="' +
      cls +
      '"><line x1="' +
      x1 +
      '" y1="' +
      y +
      '" x2="' +
      (x2 - d * h) +
      '" y2="' +
      y +
      '" stroke-width="' +
      (w || 3) +
      '"/><path d="M' +
      x2 +
      " " +
      y +
      "L" +
      (x2 - d * h * 1.6) +
      " " +
      (y - h) +
      "L" +
      (x2 - d * h * 1.6) +
      " " +
      (y + h) +
      'Z" stroke="none"/></g>'
    );
  };
  N.varrow = function (x, y1, y2, cls, w) {
    var d = y2 > y1 ? 1 : -1,
      h = 6;
    return (
      '<g class="' +
      cls +
      '"><line x1="' +
      x +
      '" y1="' +
      y1 +
      '" x2="' +
      x +
      '" y2="' +
      (y2 - d * h) +
      '" stroke-width="' +
      (w || 3) +
      '"/><path d="M' +
      x +
      " " +
      y2 +
      "L" +
      (x - h) +
      " " +
      (y2 - d * h * 1.6) +
      "L" +
      (x + h) +
      " " +
      (y2 - d * h * 1.6) +
      'Z" stroke="none"/></g>'
    );
  };
  /* roda as trilhas de um svg */
  N.run = function (svg, A) {
    var rm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm || !svg.animate) return;
    try {
      if (svg.getAnimations)
        svg.getAnimations({ subtree: true }).forEach(function (a) {
          a.cancel();
        });
    } catch (e) {}
    (A.t || []).forEach(function (r) {
      var kf = r[0] === "kf",
        els = svg.querySelectorAll(kf ? r[1] : r[0]);
      for (var i = 0; i < els.length; i++) {
        var sp = N.sp || 1,
          o = kf
            ? { delay: (r[3] || 0) * sp, duration: r[4] * sp, iterations: r[5] || 1, easing: "linear", fill: "both" }
            : {
                delay: (r[2] || 0) * 1000 * sp,
                duration: r[3] * 1000 * sp,
                fill: "both",
                easing: r[4] || "ease-in-out",
              };
        try {
          els[i].animate(kf ? r[2] : r[1], o);
        } catch (e) {}
      }
    });
  };
})();
