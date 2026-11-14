/* Gráficos de desempenho do histórico (barras por área). Recebe do quiz (script.js) a lista de áreas e a função esc. */
window.AppGraficos = function (c) {
  "use strict";
  var TN = c.TN,
    esc = c.esc;
  function graf(h, t) {
    var tot = 0,
      ac = 0,
      k,
      o = "";
    for (k in t) {
      ac += t[k][0];
      tot += t[k][1];
    }
    var pc = tot ? Math.round((100 * ac) / tot) : 0,
      dm = function (d) {
        return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      };
    o +=
      '<div class="gk"><div><b>' +
      h.length +
      "</b>rodadas</div><div><b>" +
      tot +
      "</b>questões</div><div><b>" +
      pc +
      "%</b>de acerto</div></div>";
    var L = h.slice(-12),
      n = L.length,
      W = 320,
      H = 150,
      l = 42,
      r = 26,
      tp = 20,
      bt = 28,
      pw = W - l - r,
      ph = H - tp - bt;
    var X = function (q) {
        return n > 1 ? l + (q * pw) / (n - 1) : l + pw / 2;
      },
      Y = function (v) {
        return tp + ((100 - v) * ph) / 100;
      };
    var P = L.map(function (x) {
      return Math.max(0, Math.min(100, Math.round((100 * x.s) / x.n)));
    });
    var g =
      '<svg viewBox="0 0 ' +
      W +
      " " +
      H +
      '" role="img" aria-label="Gráfico de linha do aproveitamento nas últimas ' +
      n +
      " rodadas: de " +
      P[0] +
      "% a " +
      P[n - 1] +
      '%">';
    [0, 50, 100].forEach(function (v) {
      g +=
        '<line class="gl" x1="' +
        l +
        '" x2="' +
        (W - r) +
        '" y1="' +
        Y(v) +
        '" y2="' +
        Y(v) +
        '"/><text x="' +
        (l - 5) +
        '" y="' +
        (Y(v) + 4) +
        '" text-anchor="end">' +
        v +
        "%</text>";
    });
    var pts = P.map(function (v, q) {
      return X(q).toFixed(1) + "," + Y(v).toFixed(1);
    });
    if (n > 1)
      g +=
        '<polygon class="ar" points="' +
        X(0).toFixed(1) +
        "," +
        Y(0) +
        " " +
        pts.join(" ") +
        " " +
        X(n - 1).toFixed(1) +
        "," +
        Y(0) +
        '"/><polyline class="ln draw" pathLength="1" points="' +
        pts.join(" ") +
        '"/>';
    P.forEach(function (v, q) {
      g += '<circle class="pt" cx="' + X(q).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="4"/>';
      if (q === n - 1 || n <= 6)
        g +=
          '<text class="gv" x="' +
          X(q).toFixed(1) +
          '" y="' +
          (Y(v) - 9).toFixed(1) +
          '" text-anchor="middle">' +
          v +
          "%</text>";
    });
    var step = Math.max(1, Math.ceil(n / 5));
    L.forEach(function (x, q) {
      if (q % step === 0 || q === n - 1)
        g += '<text x="' + X(q).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + dm(x.d) + "</text>";
    });
    g += "</svg>";
    o +=
      '<div class="gr"><h4>Evolução por rodada</h4>' +
      g +
      '<p class="lg">Aproveitamento (%) nas últimas ' +
      n +
      " rodadas completas.</p></div>";
    var ks = Object.keys(TN).filter(function (q) {
      return t[q];
    });
    if (ks.length) {
      var RH = 40,
        hh = ks.length * RH + 4,
        b =
          '<svg viewBox="0 0 320 ' +
          hh +
          '" role="img" aria-label="Gráfico de barras do acerto por área: ' +
          ks
            .map(function (q) {
              return TN[q] + " " + Math.round((100 * t[q][0]) / t[q][1]) + "%";
            })
            .join("; ") +
          '">';
      ks.forEach(function (q, m) {
        var p = Math.round((100 * t[q][0]) / t[q][1]),
          y = m * RH + 2,
          nm = TN[q].length > 28 ? TN[q].slice(0, 27) + "…" : TN[q],
          c = p >= 70 ? "b1" : p >= 50 ? "b2" : "b3";
        b +=
          '<text x="0" y="' +
          (y + 12) +
          '">' +
          esc(nm) +
          '</text><text class="gv" x="320" y="' +
          (y + 12) +
          '" text-anchor="end">' +
          p +
          "% · " +
          t[q][0] +
          "/" +
          t[q][1] +
          '</text><rect class="bk" x="0" y="' +
          (y + 19) +
          '" width="320" height="11" rx="5.5"/><rect class="' +
          c +
          ' grow" x="0" y="' +
          (y + 19) +
          '" width="' +
          Math.max(11, 3.2 * p) +
          '" height="11" rx="5.5"/>';
      });
      o +=
        '<div class="gr"><h4>Acerto por área</h4>' +
        b +
        '</svg><p class="lg"><span class="sw b1"></span> 70% ou mais <span class="sw b2"></span> 50% a 69% <span class="sw b3"></span> abaixo de 50%</p></div>';
    }
    var dias = [],
      day = function (d) {
        var z = new Date(d);
        return z.getFullYear() + "-" + z.getMonth() + "-" + z.getDate();
      },
      now = Date.now(),
      mx = 0,
      any = false;
    for (var q = 6; q >= 0; q--) {
      var d = now - q * 864e5;
      dias.push({ k: day(d), d: d, v: 0 });
    }
    h.forEach(function (x) {
      dias.forEach(function (z) {
        if (z.k === day(x.d)) {
          z.v += x.n;
          any = true;
        }
      });
    });
    if (any) {
      dias.forEach(function (z) {
        if (z.v > mx) mx = z.v;
      });
      var CW = 320,
        CH = 140,
        cb = 26,
        ct = 22,
        cw = CW / 7,
        bw = cw * 0.56,
        c2 =
          '<svg viewBox="0 0 ' +
          CW +
          " " +
          CH +
          '" role="img" aria-label="Gráfico de colunas das questões respondidas nos últimos 7 dias: ' +
          dias
            .map(function (z) {
              return z.v;
            })
            .join(", ") +
          '">';
      c2 += '<line class="gl" x1="0" x2="' + CW + '" y1="' + (CH - cb) + '" y2="' + (CH - cb) + '"/>';
      dias.forEach(function (z, m) {
        var hgt = mx ? Math.round(((CH - cb - ct) * z.v) / mx) : 0,
          x0 = m * cw + (cw - bw) / 2;
        c2 +=
          '<rect class="cl' +
          (z.v ? "" : " z") +
          ' gup" x="' +
          x0.toFixed(1) +
          '" y="' +
          (CH - cb - (z.v ? hgt : 2)) +
          '" width="' +
          bw.toFixed(1) +
          '" height="' +
          (z.v ? hgt : 2) +
          '" rx="4"/>' +
          (z.v
            ? '<text class="gv" x="' +
              (m * cw + cw / 2).toFixed(1) +
              '" y="' +
              (CH - cb - hgt - 5) +
              '" text-anchor="middle">' +
              z.v +
              "</text>"
            : "") +
          '<text x="' +
          (m * cw + cw / 2).toFixed(1) +
          '" y="' +
          (CH - 8) +
          '" text-anchor="middle">' +
          new Date(z.d).toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "").slice(0, 3) +
          "</text>";
      });
      o +=
        '<div class="gr"><h4>Questões nos últimos 7 dias</h4>' +
        c2 +
        '</svg><p class="lg">Quantidade de questões respondidas por dia.</p></div>';
    }
    return o;
  }
  return { graf: graf };
};
