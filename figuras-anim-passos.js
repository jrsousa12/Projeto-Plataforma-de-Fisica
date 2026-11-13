/* Animações de resolução passo a passo: cena com legendas, medidores, partículas, termômetro e tremor.
   Complementa figuras-anim.js: usa window.AN. */
(function () {
  "use strict";
  var N = (window.AN = window.AN || {});
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
