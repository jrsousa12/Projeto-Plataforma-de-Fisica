/* Tela do resultado (fim da rodada): nota, medalha, sequência, desempenho por área, revisão das erradas e ranking
   do cronometrado. Só monta a tela; a rodada (pontos, respostas) fica no script.js e chega em mostrar(o). */
window.AppResultado = function (c) {
  "use strict";
  var $ = c.$,
    Q = c.Q,
    QZ = c.QZ,
    TN = c.QZ.areas,
    esc = c.esc,
    num = c.num,
    fmt = c.fmt,
    ST = c.ST;
  var res, n, score, secs;
  function resUi() {
    var p = score / n,
      pc = Math.round(100 * p),
      rf = $("rfill"),
      T =
        p === 1
          ? ["🏆", "Perfeito!"]
          : p >= 0.9
            ? ["🥇", "Excelente"]
            : p >= 0.7
              ? ["🥈", "Muito bom"]
              : p >= 0.4
                ? ["🥉", "No caminho certo"]
                : ["📚", "Hora de revisar"];
    rf.style.strokeDashoffset = "100";
    rf.setAttribute("class", "rf " + (p >= 0.7 ? "g" : p >= 0.4 ? "m" : "b"));
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        rf.style.strokeDashoffset = String(
          100 - Math.max(0, Math.min(100, pc)),
        );
      });
    });
    $("rpct").textContent = pc + "% de acerto";
    $("rbadge").textContent = T[0];
    $("rtitle").textContent = T[1];
    var bs = 0,
      c = 0;
    res.forEach(function (r) {
      c = r.ok ? c + 1 : 0;
      if (c > bs) bs = c;
    });
    $("s4").textContent = bs;
    $("rdots").innerHTML = res
      .map(function (r, k) {
        return (
          '<span class="rd ' +
          (r.ok ? "ok" : "bad") +
          '" title="Pergunta ' +
          (k + 1) +
          (r.ok ? ": certa" : ": errada") +
          '">' +
          (k + 1) +
          "</span>"
        );
      })
      .join("");
    var ag = {};
    res.forEach(function (r) {
      var t = Q[r.qi].t;
      ag[t] = ag[t] || [0, 0];
      ag[t][1]++;
      if (r.ok) ag[t][0]++;
    });
    var ks = Object.keys(ag).filter(function (t) {
        return ag[t][1] >= 1;
      }),
      pcs = function (t) {
        return ag[t][0] / ag[t][1];
      },
      best = null,
      worst = null;
    ks.forEach(function (t) {
      if (
        !best ||
        pcs(t) > pcs(best) ||
        (pcs(t) === pcs(best) && ag[t][1] > ag[best][1])
      )
        best = t;
      if (
        !worst ||
        pcs(t) < pcs(worst) ||
        (pcs(t) === pcs(worst) && ag[t][1] > ag[worst][1])
      )
        worst = t;
    });
    var h = "";
    if (best && pcs(best) > 0)
      h +=
        "<div><b>Ponto forte:</b> " +
        esc(TN[best]) +
        " (" +
        Math.round(100 * pcs(best)) +
        "%)</div>";
    if (
      (worst && pcs(worst) < 1 && worst !== best) ||
      (worst && pcs(worst) < 1 && ks.length === 1)
    )
      h +=
        '<div class="w"><b>Para reforçar:</b> ' +
        esc(TN[worst]) +
        " (" +
        Math.round(100 * pcs(worst)) +
        "%)</div>";
    h +=
      '<div class="n"><b>Ritmo:</b> ' +
      Math.max(1, Math.round(secs / n)) +
      " s por pergunta em média</div>";
    $("rins").innerHTML = h;
  }
  /* o: {res, n (total de perguntas), score, secs, right, hints, ranking (salvar no ranking?), nick}.
     Devolve {ag (acertos por área), wrong (respostas erradas)}. */
  function mostrar(o) {
    res = o.res;
    n = o.n;
    score = o.score;
    secs = o.secs;
    var right = o.right,
      hints = o.hints;
    $("final").textContent = num(score) + " / " + n;
    resUi();
    if (o.ranking) {
      saveRank(o.nick, score, secs);
    }
    rank($("rank2"));
    var ag = {};
    res.forEach(function (r) {
      var t = Q[r.qi].t;
      ag[t] = ag[t] || [0, 0];
      ag[t][1]++;
      if (r.ok) ag[t][0]++;
    });
    $("areas").innerHTML =
      '<div class="rk"><h3>Desempenho por área</h3>' +
      Object.keys(ag)
        .map(function (t) {
          var pc = Math.round((100 * ag[t][0]) / ag[t][1]);
          return (
            '<div class="ab"><div class="t"><span>' +
            esc(TN[t]) +
            "</span><span>" +
            ag[t][0] +
            " de " +
            ag[t][1] +
            " · " +
            pc +
            '%</span></div><div class="tr"><i class="' +
            (pc >= 70 ? "b1" : pc >= 50 ? "b2" : "b3") +
            '" data-w="' +
            pc +
            '"></i></div></div>'
          );
        })
        .join("") +
      "</div>";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        $("areas")
          .querySelectorAll("i[data-w]")
          .forEach(function (e) {
            e.style.width = e.getAttribute("data-w") + "%";
          });
      });
    });
    $("s1").textContent = right + " de " + n;
    $("s2").textContent = hints;
    $("s3").textContent = fmt(secs);
    var p = score / n;
    if (window.FX) FX.end(p);
    $("final").classList.toggle("party", p >= 0.7);
    $("msg").textContent =
      p === 1
        ? QZ.msgs[0]
        : p >= 0.7
          ? QZ.msgs[1]
          : p >= 0.4
            ? QZ.msgs[2]
            : QZ.msgs[3];
    var wrong = res.filter(function (r) {
        return !r.ok;
      }),
      h = "";
    wrong.forEach(function (r) {
      var d = Q[r.qi];
      h +=
        '<div class="rv"><h3></h3><p><b>Você marcou:</b> <span class="a"></span></p><p><b>Correta:</b> <span class="b"></span></p><p class="x"></p></div>';
    });
    $("rev").innerHTML = wrong.length
      ? '<h3 style="font-family:Georgia,serif;margin:16px 0 0">Revise estas perguntas</h3>' +
        h
      : "";
    var cards = $("rev").querySelectorAll(".rv");
    wrong.forEach(function (r, n) {
      var d = Q[r.qi],
        c = cards[n];
      c.querySelector("h3").textContent = d.q;
      c.querySelector(".a").textContent =
        r.pick < 0 ? "Sem resposta (tempo esgotado)" : d.o[r.pick];
      c.querySelector(".b").textContent = d.o[d.a];
      Eq.set(c.querySelector(".x"), d.e.replace(/\n/g, " "));
      if (r.g) {
        c.querySelector("h3").textContent = r.g.q;
        c.querySelector(".a").textContent = r.nr
          ? "Sem resposta (tempo esgotado)"
          : String(r.v).replace(".", ",");
        c.querySelector(".b").textContent = r.g.at;
        Eq.set(c.querySelector(".x"), r.g.e);
      }
    });
    $("redo").classList.toggle("hidden", !wrong.length);
    return { ag: ag, wrong: wrong };
  }
  function getRank() {
    return ST.get("rank", []);
  }
  function saveRank(nick, score, secs) {
    try {
      var r = getRank();
      r.push({ n: nick, s: score, t: secs });
      r.sort(function (a, b) {
        return b.s - a.s || a.t - b.t;
      });
      ST.set("rank", r.slice(0, 20));
    } catch (e) {}
  }
  function rank(el) {
    var r = getRank().slice(0, 5);
    el.innerHTML =
      '<div class="rk"><h3>Melhores pontuações (cronometrado)</h3>' +
      (r.length
        ? "<ol>" +
          r
            .map(function (x) {
              return (
                "<li>" +
                esc(x.n || "Anônimo") +
                ": <b>" +
                num(x.s) +
                "</b> pontos · " +
                fmt(x.t) +
                "</li>"
              );
            })
            .join("") +
          "</ol><small>Salvo neste navegador.</small>"
        : "<small>Nenhuma pontuação ainda. Jogue uma rodada!</small>") +
      "</div>";
  }
  return { mostrar: mostrar, rank: rank };
};
