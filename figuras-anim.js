/* Animações explicativas (SVG + Web Animations). Mostradas depois que o aluno responde.
   Cada animação: {a: descrição, h: altura do viewBox, s: SVG no estado final, t: trilhas, T: duração total}.
   O SVG já está no estado final; as trilhas só reproduzem o caminho até ele. */
(function () {
  "use strict";
  window.ANIM = window.ANIM || {};
  var N = (window.AN = {});
  N.sp = 1.7; /* fator de lentidão: todas as animações rodam mais devagar para dar tempo de ler */
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

  /* ---------- kit para animações de resolução passo a passo ---------- */
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
  /* animação de resolução: cena (svg final) + passos [[tempo,"linha1|linha2"],...]; elementos de classe sK entram no passo K */
  N.calc = function (key, alt, o) {
    var st = o.steps,
      T = st[st.length - 1][0] + 3.6,
      tr = (o.tr || []).slice(),
      times = st.map(function (a) {
        return a[0];
      });
    var c = N.cap(
      st.map(function (a) {
        return a[1];
      }),
      times,
      T,
      o.cy || o.h - 40
    );
    for (var k = 1; k < st.length; k++) tr.push(N.vis(".s" + (k + 1), T, times[k]));
    N.reg(key, { a: alt, h: o.h, s: o.s + c.s, t: tr.concat(c.t), T: T });
  };

  /* texto que muda ao longo do tempo (medidor): vals[i] fica visível de times[i] até times[i+1]; o último permanece */
  N.seq = function (cl, x, y, vals, times, T, o) {
    o = o || {};
    var s = "",
      t = [];
    vals.forEach(function (v, i) {
      var last = i === vals.length - 1,
        c = cl + i,
        first = i === 0 && !times[0];
      s +=
        '<text class="' +
        c +
        (o.c ? " " + o.c : "") +
        '" x="' +
        x +
        '" y="' +
        y +
        '" text-anchor="' +
        (o.a || "middle") +
        '" font-size="' +
        (o.s || 12) +
        '" font-weight="700"' +
        (last || first ? "" : ' opacity="0"') +
        ">" +
        v +
        "</text>";
      if (first && !last)
        t.push(
          N.op("." + c, T, [
            [0, 1],
            [times[1], 1],
            [times[1] + 0.25, 0],
          ])
        );
      else if (!last) t.push(N.vis("." + c, T, times[i], times[i + 1]));
      else if (!first) t.push(N.vis("." + c, T, times[i]));
    });
    return { s: s, t: t };
  };
  /* registra animação com legendas (resolve cena + passos) */
  N.scene = function (key, alt, H, s, tr, T, caps, times) {
    var c = N.cap(caps, times, T, H);
    N.reg(key, { a: alt, h: H, s: s + c.s, t: tr.concat(c.t), T: T });
  };
  /* elétron (−) e carga positiva (+) como pequenas bolas */
  N.el = function (x, y, c) {
    return (
      '<g class="' +
      (c || "") +
      '"><circle cx="' +
      x +
      '" cy="' +
      y +
      '" r="6" class="an-rn"/><text x="' +
      x +
      '" y="' +
      (y + 4) +
      '" text-anchor="middle" font-size="11" font-weight="700">−</text></g>'
    );
  };
  N.pl = function (x, y, c) {
    return (
      '<g class="' +
      (c || "") +
      '"><circle cx="' +
      x +
      '" cy="' +
      y +
      '" r="6" class="an-rp"/><text x="' +
      x +
      '" y="' +
      (y + 4) +
      '" text-anchor="middle" font-size="11" font-weight="700">+</text></g>'
    );
  };
  /* pontinhos cinza = material neutro */
  N.nd = function (x, y, w, h, st) {
    var o = "",
      i,
      j;
    st = st || 14;
    for (i = x + st / 2; i < x + w; i += st)
      for (j = y + st / 2; j < y + h; j += st)
        o += '<circle cx="' + i + '" cy="' + j + '" r="1.6" fill="currentColor" fill-opacity=".22"/>';
    return o;
  };

  /* termômetro: tubo com mercúrio na classe cl (nível final lv de 0 a 1); animar com N.sc(".cl",T,[[t,nivel],...]) */
  N.th = function (x, y, h, cl, lv, fill) {
    fill = fill || "var(--f-verm)";
    return (
      '<g><rect x="' +
      (x - 5) +
      '" y="' +
      y +
      '" width="10" height="' +
      h +
      '" rx="5" fill="var(--surface)" stroke="currentColor" stroke-width="1.8"/><rect class="' +
      cl +
      '" x="' +
      (x - 2.5) +
      '" y="' +
      y +
      '" width="5" height="' +
      h +
      '" rx="2.5" fill="' +
      fill +
      '" style="transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(' +
      lv +
      ')"/><circle cx="' +
      x +
      '" cy="' +
      (y + h + 5) +
      '" r="8" fill="' +
      fill +
      '" stroke="currentColor" stroke-width="1.8"/></g>'
    );
  };
  /* tremor de moléculas: segs=[[t0,t1,passo,amplitude],...] devolve a trilha de translação */
  N.jit = function (sel, T, segs) {
    var h = 0,
      i;
    for (i = 0; i < sel.length; i++) h = (h * 31 + sel.charCodeAt(i)) % 9973;
    var r = function () {
        h = (h * 1103 + 12345) % 9973;
        return (h / 9973) * 2 - 1;
      },
      p = [[0, 0, 0]];
    segs.forEach(function (g) {
      for (var t = g[0]; t < g[1]; t += g[2]) p.push([t, r() * g[3], r() * g[3]]);
    });
    p.push([T, 0, 0]);
    p.sort(function (a, b) {
      return a[0] - b[0];
    });
    return N.tr(sel, T, p, "linear");
  };
})();
