/* Questões numéricas: sorteio de valores, formatação (vírgula e notação científica) e leitura do número digitado. */
window.AppNumeros = function () {
  "use strict";
  var Rn = function (a) {
      return a[Math.floor(Math.random() * a.length)];
    },
    fc = function (x) {
      return (+x.toPrecision(3) + "").replace(".", ",");
    };
  var sup = function (n) {
    return String(n).replace(/[-0-9]/g, function (c) {
      return "⁻⁰¹²³⁴⁵⁶⁷⁸⁹".charAt("-0123456789".indexOf(c));
    });
  };
  var sc = function (x) {
    if (!x) return "0";
    var e = Math.floor(Math.log10(Math.abs(x)));
    if (e >= -2 && e <= 3) return fc(x);
    return fc(x / Math.pow(10, e)) + " × 10" + sup(e);
  };
  var gn = 0;
  function GQ(t, id, h, f) {
    return { t: t, o: [], a: 0, q: "Questão numérica: " + id, h: h, e: "", g: f, id: "n" + ++gn };
  }
  /* lê o número digitado: aceita vírgula ou ponto decimal e notação científica (2,5 × 10⁴, 2,5x10^4, 2,5·10^-3, 2.5e4); a unidade depois do número é ignorada */
  function lerNum(t) {
    t = String(t || "")
      .replace(/[−–]/g, "-")
      .replace(/\s+/g, "")
      .replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) {
        return (
          "^" +
          m.replace(/./g, function (c) {
            return "-0123456789".charAt("⁻⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c));
          })
        );
      });
    t = t.replace(/^([-+]?)10\^/, "$11x10^");
    var m = /^([-+]?\d+(?:[.,]\d+)?)(?:[x×*·]10\^?([-+]?\d+)|e([-+]?\d+))?(?:[^\d^].*)?$/i.exec(t);
    if (!m) return NaN;
    var e = m[2] !== undefined ? m[2] : m[3];
    return parseFloat(m[1].replace(",", ".")) * (e !== undefined ? Math.pow(10, +e) : 1);
  }
  return { Rn: Rn, fc: fc, sup: sup, sc: sc, GQ: GQ, lerNum: lerNum };
};
