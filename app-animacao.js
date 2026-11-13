/* Controles da animação da explicação (pausar, ver de novo, linha do tempo e legendas passo a passo). Usa window.AN (figuras-anim.js). */
(function () {
  "use strict";
  function capUi(w, svg, A) {
    var C = A.cap,
      k,
      ol = document.createElement("ol"),
      sp = (window.AN && AN.sp) || 1,
      els = svg.querySelectorAll("text"),
      bb = 0,
      li = [];
    for (k = els.length - 1; k >= 0; k--) {
      if (/(^|\s)cp\d+(\s|$)/.test(els[k].getAttribute("class") || "")) els[k].parentNode.removeChild(els[k]);
    }
    try {
      var b = svg.getBBox();
      bb = Math.ceil(b.y + b.height) + 8;
    } catch (e) {}
    svg.setAttribute("viewBox", "0 0 320 " + Math.min(A.h, Math.max(C.y - 4, bb)));
    ol.className = "ancap";
    C.list.forEach(function (t) {
      var l = document.createElement("li");
      t.split("|").forEach(function (x) {
        var sp2 = document.createElement("span");
        sp2.textContent = x;
        l.appendChild(sp2);
      });
      ol.appendChild(l);
      li.push(l);
    });
    w.insertBefore(ol, w.querySelector(".anrow"));
    var cur = -2;
    return function (ms) {
      var t = ms / 1000,
        n = 0;
      C.times.forEach(function (x, j) {
        if (x * sp <= t + 0.001) n = j;
      });
      if (n === cur) return;
      cur = n;
      li.forEach(function (l, j) {
        l.className = j === n ? "on" : j < n ? "done" : "";
      });
    };
  }
  function anCtl(w, svg, A, onEnd) {
    var pb = w.querySelector(".anp"),
      rv = w.querySelector(".anr"),
      rg = w.querySelector(".anrg"),
      T = Math.round((A.T || 8) * 1000 * ((window.AN && AN.sp) || 1)),
      paused = false,
      raf = 0,
      cu = A.cap ? capUi(w, svg, A) : null;
    function all() {
      try {
        return svg.getAnimations ? svg.getAnimations({ subtree: true }) : [];
      } catch (e) {
        return [];
      }
    }
    function setP(p) {
      paused = p;
      all().forEach(function (a) {
        try {
          p ? a.pause() : a.play();
        } catch (e) {}
      });
      pb.textContent = p ? "▶ Continuar" : "⏸ Pausar";
      pb.setAttribute("aria-pressed", p ? "true" : "false");
    }
    function loop() {
      if (!w.isConnected) return;
      if (!paused) {
        var a = all()[0];
        if (a && a.currentTime != null) var ct = Math.min(T, Math.round(a.currentTime % (T + 1)));
        rg.value = String(ct);
        if (cu) cu(ct);
        if (onEnd && ct >= T - 60) {
          var f = onEnd;
          onEnd = null;
          f();
        }
      }
      raf = requestAnimationFrame(loop);
    }
    function go() {
      window.AN.run(svg, A);
      paused = false;
      pb.textContent = "⏸ Pausar";
      pb.setAttribute("aria-pressed", "false");
      rg.value = "0";
      cancelAnimationFrame(raf);
      if (all().length) {
        w.classList.remove("static");
        loop();
      } else {
        w.classList.add("static");
      }
    }
    rg.max = String(T);
    pb.onclick = function () {
      setP(!paused);
    };
    rv.onclick = go;
    rg.oninput = function () {
      setP(true);
      var v = +rg.value;
      all().forEach(function (a) {
        try {
          a.currentTime = v;
        } catch (e) {}
      });
    };
    go();
  }
  /* Monta o bloco da animação A dentro de "pai"; aoFim é chamado quando a animação termina. */
  function montar(pai, A, esc, aoFim) {
    var w = document.createElement("div");
    w.className = "fig anim";
    w.innerHTML =
      '<svg viewBox="0 0 320 ' +
      A.h +
      '" role="img" aria-label="' +
      esc(A.a) +
      '">' +
      A.s +
      '</svg><div class="anrow"><button type="button" class="btn alt anp" aria-pressed="false">⏸ Pausar</button><button type="button" class="btn alt anr">↻ Ver de novo</button></div><label class="anlb">Linha do tempo<input type="range" class="anrg" min="0" step="50" value="0" aria-label="Linha do tempo da animação"></label><details class="antx"><summary>Descrição em texto</summary><p></p></details>';
    w.querySelector(".antx p").textContent = A.a;
    pai.appendChild(w);
    anCtl(w, w.querySelector("svg"), A, aoFim);
  }
  window.AppAnimacao = { montar: montar };
})();
