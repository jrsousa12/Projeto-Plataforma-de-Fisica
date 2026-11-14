/* Retorno depois de responder: "Correto!"/"Não foi dessa vez", explicação (passo a passo nas contas), animação, "Você marcou" e meta do dia. */
window.AppRetorno = function (c) {
  "use strict";
  var $ = c.$,
    esc = c.esc;
  function fmtE(el, t, calc) {
    el.textContent = "";
    if (!calc && t.indexOf("\n") < 0) {
      Eq.set(el, t);
      return;
    }
    var L = [];
    if (t.indexOf("\n") >= 0) {
      L = t.split("\n");
    } else
      t.replace(/([.!?])\s+(?=[A-ZΔΦΣ(−0-9])/g, "$1\u0001")
        .split("\u0001")
        .forEach(function (sn) {
          sn.split(" → ").forEach(function (p, k) {
            var q = p.replace(/\.$/, "").split(" = ");
            if (q.length > 2) {
              L.push((k ? "→ " : "") + q[0] + " = " + q[1]);
              for (var j = 2; j < q.length; j++) L.push("= " + q[j]);
            } else L.push((k ? "→ " : "") + p);
          });
        });
    L.forEach(function (x, k) {
      var d = document.createElement("span");
      d.className = "eln";
      Eq.set(d, x);
      el.appendChild(d);
    });
    el.classList.add("calc");
  }
  /* o: { ok, k (botão marcado; -1 = tempo esgotado), oi (alternativa marcada), d (questão), G (numérica), hinted, mode, mf (meta cumprida), ultima } */
  function mostrar(o) {
    var ok = o.ok,
      k = o.k,
      oi = o.oi,
      d = o.d,
      G = o.G,
      hinted = o.hinted,
      mode = o.mode,
      mf = o.mf;
    $("hbtn").classList.add("hidden");
    $("fonteq").classList.remove("hidden");
    $("fb").innerHTML =
      '<div class="fb' +
      (ok ? "" : " no") +
      '"><b>' +
      (ok
        ? hinted && mode === "tempo"
          ? "Correto, com dica! (meio ponto)"
          : "Correto!"
        : k === -1
          ? "Tempo esgotado."
          : "Não foi dessa vez.") +
      "</b><p></p></div>";
    fmtE($("fb").querySelector("p"), G ? G.e + " Resposta: " + G.at : d.e, !!(G || d.c));
    if (d.an && window.ANIM && window.ANIM[d.an]) {
      window.AppAnimacao.montar($("fb"), window.ANIM[d.an], esc, function () {
        setTimeout(function () {
          var n = $("next");
          if (n && !n.classList.contains("hidden")) n.scrollIntoView({ block: "center", behavior: "smooth" });
        }, 500);
      });
    }
    if (!ok && !G && oi >= 0) {
      var fp = document.createElement("p");
      fp.className = "fbx";
      Eq.set(fp, "Você marcou: " + d.o[oi] + (d.x && d.x[oi] ? " — " + d.x[oi] : ""));
      $("fb").querySelector(".fb").appendChild(fp);
    }
    if (mf) {
      var mp = document.createElement("p");
      mp.className = "msg ok";
      mp.textContent = "🎯 Meta do dia cumprida! Muito bem!";
      $("fb").appendChild(mp);
    }
    $("next").textContent = o.ultima ? "Ver resultado" : "Próxima pergunta";
    $("next").classList.remove("hidden");
    $("fb").scrollIntoView({ block: "start", behavior: "smooth" });
  }
  return { fmtE: fmtE, mostrar: mostrar };
};
