/* subscritos nas temperaturas: TC, TF e TK viram T com índice (HTML e SVG) */
(function () {
  "use strict";
  if (!window.MutationObserver || !document.body) return;
  var RE = /(^|[^A-Za-zÀ-ú0-9_])T([CFK])(?![A-Za-zÀ-ú0-9_])/,
    NS = "http://www.w3.org/2000/svg",
    SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION)$/i;
  function fix(n) {
    var t = n.nodeValue,
      m = RE.exec(t),
      p = n.parentNode;
    if (!m || !p || SKIP.test(p.nodeName)) return;
    var L = m[1].length,
      K = m[2],
      pre = t.slice(0, m.index + L),
      end = m.index + L + 2;
    var svg = p.namespaceURI === NS,
      rest = t.slice(end),
      h = document.createTextNode(pre + "T"),
      s,
      r;
    if (svg) {
      s = document.createElementNS(NS, "tspan");
      s.setAttribute("dy", "3");
      s.setAttribute("font-size", "75%");
      s.textContent = K;
      r = document.createElementNS(NS, "tspan");
      r.setAttribute("dy", "-3");
      var rt = document.createTextNode(rest || " ");
      r.appendChild(rt);
      p.insertBefore(h, n);
      p.insertBefore(s, n);
      p.insertBefore(r, n);
      p.removeChild(n);
      if (RE.test(rest)) fix(rt);
    } else {
      s = document.createElement("sub");
      s.textContent = K;
      var rt2 = document.createTextNode(rest);
      p.insertBefore(h, n);
      p.insertBefore(s, n);
      p.insertBefore(rt2, n);
      p.removeChild(n);
      if (RE.test(rest)) fix(rt2);
    }
  }
  function walk(nd) {
    if (nd.nodeType === 3) {
      if (RE.test(nd.nodeValue)) fix(nd);
      return;
    }
    if (nd.nodeType !== 1 || SKIP.test(nd.nodeName)) return;
    var w = document.createTreeWalker(nd, 4, null, false),
      a = [],
      x;
    while ((x = w.nextNode())) if (RE.test(x.nodeValue)) a.push(x);
    a.forEach(fix);
  }
  new MutationObserver(function (ms) {
    ms.forEach(function (m) {
      if (m.type === "characterData") {
        if (RE.test(m.target.nodeValue)) fix(m.target);
      } else for (var i = 0; i < m.addedNodes.length; i++) walk(m.addedNodes[i]);
    });
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  walk(document.body);
})();
