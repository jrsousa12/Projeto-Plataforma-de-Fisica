/* Armazenamento versionado no aparelho (localStorage): cada chave ganha um prefixo (ex.: "eletriz:") e há migração do formato antigo. LEG traduz o formato antigo do caderno para os ids. */
window.AppArmazenamento = function (P, LEG) {
  "use strict";
  function g(k, d) {
    try {
      var v = localStorage.getItem(P + k);
      return v === null ? d : JSON.parse(v);
    } catch (e) {
      return d;
    }
  }
  function s(k, v) {
    try {
      localStorage.setItem(P + k, JSON.stringify(v));
    } catch (e) {}
  }
  function del(k) {
    try {
      localStorage.removeItem(P + k);
    } catch (e) {}
  }
  function mig() {
    if (g("ver", 0) >= 2) return;
    try {
      var L = function (k) {
          return localStorage.getItem(k);
        },
        b = L("eletriz-book");
      if (b) {
        var o = JSON.parse(b),
          n = {};
        Object.keys(o).forEach(function (k) {
          if (LEG[k]) n[LEG[k]] = o[k];
        });
        s("book", n);
      }
      var h = L("eletriz-hist");
      if (h) s("hist", JSON.parse(h));
      var r = L("eletrizacao-rank");
      if (r) s("rank", JSON.parse(r));
      if (L("eletriz-nick")) s("nick", L("eletriz-nick"));
      if (L("eletriz-theme")) s("theme", L("eletriz-theme"));
      if (L("eletriz-big")) s("big", L("eletriz-big") === "1");
    } catch (e) {}
    s("ver", 2);
  }
  return { get: g, set: s, del: del, mig: mig };
};
