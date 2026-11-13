/* Lógica do quiz. Depende dos bancos (perguntas-*.js), das configurações (quiz-*.js), das figuras e de fx.js. */
window.__boot = function (id) {
  "use strict";
  var QZ = window.QUIZZES[id],
    FIG = window.FIG,
    Q = window.BANKS[id].slice();
  /* Armazenamento (app-armazenamento.js) e sorteio das questões (app-sorteio.js). */
  var LEG = {};
  var mkST = function (P) {
    return window.AppArmazenamento(P, LEG);
  };
  var ST = mkST(QZ.prefix),
    SH = mkST("eletriz:");
  if (id === "eletro") {
    Q.forEach(function (d) {
      LEG[hk(d.q)] = d.id;
    });
    ST.mig();
  }
  var perm = [];
  var $ = function (id) {
    return document.getElementById(id);
  };
  var SO = window.AppSorteio({
      Q: Q,
      QZ: QZ,
      $: $,
      sel: function () {
        return sel;
      },
      mode: function () {
        return mode;
      },
      lvl: function () {
        return lvl;
      },
      bkList: function () {
        return bkList();
      },
    }),
    shuf = SO.shuf,
    poolSel = SO.poolSel,
    pickSet = SO.pickSet;
  var order = [],
    i = 0,
    score = 0,
    res = [],
    locked = false,
    hinted = false,
    t0 = 0,
    timer = null,
    pz = 0,
    parked = false,
    qrem = 0,
    qrest = 0,
    qTL = 30,
    autoP = false;
  function fmt(s) {
    var m = Math.floor(s / 60),
      r = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }
  function num(n) {
    return String(n).replace(".", ",");
  }
  function tick() {
    if (pz) return;
    var sc2 = Math.floor((Date.now() - t0) / 1000);
    if (mode === "simulado") {
      var r = 2400 - sc2;
      $("tm").textContent = fmt(Math.max(r, 0));
      if (r <= 0 && !$("quiz").classList.contains("hidden")) {
        finish();
      }
    } else {
      $("tm").textContent = fmt(sc2);
    }
  }
  function dots() {
    var h = "";
    for (var k = 0; k < order.length; k++) {
      h += '<div class="dot ' + (k < res.length ? (res[k].ok ? "ok" : "bad") : k === i ? "cur" : "") + '"></div>';
    }
    $("dots").innerHTML = h;
  }
  function elapsed() {
    return Math.max(0, Math.floor(((pz || Date.now()) - t0) / 1000));
  }
  function save() {
    try {
      if (!order.length || $("quiz").classList.contains("hidden")) return;
      ST.set("sess", {
        v: 2,
        m: mode,
        ids: order.map(function (k) {
          return Q[k].id;
        }),
        r: res.map(function (x) {
          var y = {};
          for (var c in x) y[c] = x[c];
          y.id = Q[x.qi].id;
          return y;
        }),
        sc: score,
        st: streak,
        f: isFull,
        el: elapsed(),
        qr: qrem,
        at: Date.now(),
      });
    } catch (e) {}
  }
  function setPz(p) {
    var q = $("quiz"),
      b = $("tpause");
    if (!b) return;
    if (p && !pz) pz = Date.now();
    else if (!p && pz) {
      t0 += Date.now() - pz;
      pz = 0;
      tick();
    }
    q.classList.toggle("pausado", !!pz);
    b.setAttribute("aria-pressed", pz ? "true" : "false");
    b.textContent = pz ? "▶ Continuar" : "⏸ Pausar";
    b.setAttribute("aria-label", pz ? "Continuar o tempo" : "Pausar o tempo");
    if (pz) save();
  }
  $("tpause").onclick = function () {
    setPz(!pz);
  };
  /* Pausa o relógio sem sair da tela (também o tempo da pergunta no modo cronometrado) e devolve se pausou agora. */
  function qPause() {
    if ($("quiz").classList.contains("hidden") || pz) return false;
    if (mode === "tempo" && !locked) {
      qrem = Math.max(1, qTL * 1000 - (Date.now() - qs));
      clearInterval(qt);
    } else qrem = 0;
    setPz(true);
    return true;
  }
  function qResume() {
    setPz(false);
    if (mode === "tempo" && qrem > 0 && !locked) {
      qs = Date.now() - (qTL * 1000 - qrem);
      qrem = 0;
      runQt();
    } else qrem = 0;
  }
  window.addEventListener("pagehide", save);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      if (running() && qPause()) autoP = true;
      save();
    } else if (autoP) {
      autoP = false;
      if (running()) qResume();
    }
  });
  function start(list, full, S) {
    isFull = full !== false;
    order = list;
    i = 0;
    score = 0;
    res = [];
    streak = 0;
    pz = 0;
    parked = false;
    autoP = false;
    qrem = 0;
    qrest = S && S.qr > 0 ? S.qr : 0;
    setPz(false);
    seqUi();
    if (window.Meta) Meta.ui();
    if (S) {
      i = S.r.length;
      score = S.sc;
      res = S.r;
      streak = S.st || 0;
    }
    ["home", "book", "sheet", "cards", "hist", "fontes"].forEach(function (id) {
      $(id).classList.add("hidden");
    });
    $("bar").classList.remove("hidden");
    $("dots").classList.remove("hidden");
    $("end").classList.add("hidden");
    $("quiz").classList.remove("hidden");
    setHash("quiz");
    $("exitq").classList.add("hidden");
    t0 = S ? Date.now() - S.el * 1000 : Date.now();
    clearInterval(timer);
    timer = setInterval(tick, 1000);
    tick();
    $("tpause").classList.toggle("hidden", mode !== "estudo");
    if (S && i >= order.length) {
      finish();
      return;
    }
    show();
  }
  /* Rever perguntas anteriores: app-revisao.js. */
  var RV = window.AppRevisao({
      $: $,
      Q: Q,
      FIG: FIG,
      esc: esc,
      fmtE: fmtE,
      TN: function () {
        return TN;
      },
      res: function () {
        return res;
      },
      order: function () {
        return order;
      },
      i: function () {
        return i;
      },
    }),
    rvExit = RV.rvExit,
    rvShow = RV.rvShow;
  $("prev").onclick = function () {
    if (i > 0) rvShow(i - 1);
  };
  function show() {
    rvExit();
    $("prev").classList.toggle("hidden", !(mode === "estudo" && i > 0));
    locked = false;
    hinted = false;
    $("fonteq").classList.add("hidden");
    $("fpop").classList.add("hidden");
    $("fonteq").setAttribute("aria-expanded", "false");
    var d = Q[order[i]];
    G = d.g ? d.g() : null;
    $("quiz").setAttribute("data-a", d.t);
    $("quiz").classList.remove("qin");
    void $("quiz").offsetWidth;
    $("quiz").classList.add("qin");
    perm = d.v
      ? d.o.map(function (_, n) {
          return n;
        })
      : shuf(
          d.o.map(function (_, n) {
            return n;
          })
        );
    $("count").textContent =
      "Pergunta " +
      (i + 1) +
      " de " +
      order.length +
      " · " +
      TN[d.t] +
      " · " +
      (d.id ? "Cód. " + String(d.id).toUpperCase() + " " : "");
    var nvb = document.createElement("span"),
      nn = d.n || 2;
    nvb.className = "nvl n" + nn;
    nvb.textContent = LVN[nn];
    $("count").appendChild(nvb);
    $("pts").textContent = num(score);
    $("q").textContent = G ? G.q : d.q;
    var fg = $("fig");
    if (d.f) {
      fg.innerHTML =
        '<svg viewBox="0 0 320 140" role="img" aria-label="' + esc(FIG[d.f].a) + '">' + FIG[d.f].s + "</svg>";
      fg.classList.remove("hidden");
    } else {
      fg.classList.add("hidden");
      fg.innerHTML = "";
    }
    $("fb").innerHTML = "";
    $("hint").innerHTML = "";
    $("hbtn").classList.remove("hidden");
    $("hbtn").textContent = mode === "tempo" ? "Ver dica (vale meio ponto)" : "Ver dica";
    if (mode === "simulado") $("hbtn").classList.add("hidden");
    startQ();
    $("next").classList.add("hidden");
    var box = $("opts");
    box.innerHTML = "";
    if (G) {
      box.innerHTML =
        '<input id="num" type="text" inputmode="text" enterkeyhint="done" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="off" placeholder="Sua resposta em ' +
        G.u +
        ' (margem de 2%)" class="fld"><button class="btn" id="nsend" style="margin-top:0">Responder</button>';
      $("nsend").onclick = submitNum;
      $("num").onkeydown = function (e) {
        if (e.key === "Enter") submitNum();
      };
    }
    perm.forEach(function (oi, k) {
      var t = d.o[oi];
      var b = document.createElement("button");
      b.className = "opt";
      var l = document.createElement("span");
      l.className = "l";
      l.textContent = "ABCD".charAt(k);
      var s = document.createElement("span");
      s.textContent = t;
      b.appendChild(l);
      b.appendChild(s);
      b.onclick = function () {
        pick(k);
      };
      box.appendChild(b);
    });
    dots();
    save();
  }
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
  function pick(k, nok) {
    if (locked) return;
    locked = true;
    clearInterval(qt);
    var d = Q[order[i]],
      oi = k < 0 ? -1 : perm[k],
      ok = nok !== undefined ? nok : oi === d.a,
      bs = $("opts").children;
    if (window.Perfil && !d.g) window.Perfil.registrar(d.id, ok);
    var mf = window.Meta ? window.Meta.inc() : false;
    for (var n = 0; n < bs.length; n++) {
      bs[n].disabled = true;
      if (perm[n] === d.a) bs[n].classList.add("right");
    }
    if (!ok && k >= 0) bs[k].classList.add("wrong");
    if (ok && bs[k]) bs[k].classList.add("win");
    if (window.FX) FX.hit(ok);
    if (ok) score += hinted && mode === "tempo" ? 0.5 : 1;
    res.push({ qi: order[i], pick: oi, ok: ok, hint: hinted, g: G, v: NV });
    streak = ok ? streak + 1 : 0;
    seqUi();
    bkUpdate(order[i], ok);
    if (ok) {
      var ch = $("pts").parentNode;
      ch.classList.remove("bump");
      void ch.offsetWidth;
      ch.classList.add("bump");
    }
    if (mode === "simulado") {
      $("pts").textContent = "–";
      if (i < order.length - 1) {
        i++;
        show();
      } else {
        finish();
      }
      return;
    }
    $("pts").textContent = num(score);
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
      var A = window.ANIM[d.an],
        w = document.createElement("div");
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
      $("fb").appendChild(w);
      anCtl(w, w.querySelector("svg"), A, function () {
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
    $("next").textContent = i < order.length - 1 ? "Próxima pergunta" : "Ver resultado";
    $("next").classList.remove("hidden");
    $("fb").scrollIntoView({ block: "start", behavior: "smooth" });
    dots();
    save();
  }
  $("next").onclick = function () {
    if (i < order.length - 1) {
      i++;
      show();
    } else {
      finish();
    }
  };
  function resUi(secs, right) {
    var n = order.length,
      p = score / n,
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
        rf.style.strokeDashoffset = String(100 - Math.max(0, Math.min(100, pc)));
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
      if (!best || pcs(t) > pcs(best) || (pcs(t) === pcs(best) && ag[t][1] > ag[best][1])) best = t;
      if (!worst || pcs(t) < pcs(worst) || (pcs(t) === pcs(worst) && ag[t][1] > ag[worst][1])) worst = t;
    });
    var h = "";
    if (best && pcs(best) > 0)
      h += "<div><b>Ponto forte:</b> " + esc(TN[best]) + " (" + Math.round(100 * pcs(best)) + "%)</div>";
    if ((worst && pcs(worst) < 1 && worst !== best) || (worst && pcs(worst) < 1 && ks.length === 1))
      h += '<div class="w"><b>Para reforçar:</b> ' + esc(TN[worst]) + " (" + Math.round(100 * pcs(worst)) + "%)</div>";
    h += '<div class="n"><b>Ritmo:</b> ' + Math.max(1, Math.round(secs / n)) + " s por pergunta em média</div>";
    $("rins").innerHTML = h;
  }
  function finish() {
    clearInterval(timer);
    clearInterval(qt);
    ST.del("sess");
    pz = 0;
    setPz(false);
    /* simulado com o tempo esgotado: as perguntas que faltaram contam como sem resposta e aparecem na revisão */
    if (mode === "simulado" && res.length < order.length) {
      for (var k = res.length; k < order.length; k++) {
        var dq = Q[order[k]];
        res.push({ qi: order[k], pick: -1, ok: false, hint: false, g: dq.g ? dq.g() : null, v: "", nr: 1 });
      }
      i = order.length - 1;
    }
    var secs = Math.floor((Date.now() - t0) / 1000),
      right = res.filter(function (r) {
        return r.ok;
      }).length,
      hints = res.filter(function (r) {
        return r.hint;
      }).length;
    $("quiz").classList.add("hidden");
    $("end").classList.remove("hidden");
    setHash("resultado", true);
    $("exitq").classList.add("hidden");
    $("final").textContent = num(score) + " / " + order.length;
    resUi(secs, right);
    if (isFull && mode === "tempo") {
      saveRank(secs);
    }
    rank($("rank2"));
    var ag = {};
    res.forEach(function (r) {
      var t = Q[r.qi].t;
      ag[t] = ag[t] || [0, 0];
      ag[t][1]++;
      if (r.ok) ag[t][0]++;
    });
    histAdd(ag);
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
    $("s1").textContent = right + " de " + order.length;
    $("s2").textContent = hints;
    $("s3").textContent = fmt(secs);
    var p = score / order.length;
    if (window.FX) FX.end(p);
    $("final").classList.toggle("party", p >= 0.7);
    $("msg").textContent = p === 1 ? QZ.msgs[0] : p >= 0.7 ? QZ.msgs[1] : p >= 0.4 ? QZ.msgs[2] : QZ.msgs[3];
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
      ? '<h3 style="font-family:Georgia,serif;margin:16px 0 0">Revise estas perguntas</h3>' + h
      : "";
    var cards = $("rev").querySelectorAll(".rv");
    wrong.forEach(function (r, n) {
      var d = Q[r.qi],
        c = cards[n];
      c.querySelector("h3").textContent = d.q;
      c.querySelector(".a").textContent = r.pick < 0 ? "Sem resposta (tempo esgotado)" : d.o[r.pick];
      c.querySelector(".b").textContent = d.o[d.a];
      Eq.set(c.querySelector(".x"), d.e.replace(/\n/g, " "));
      if (r.g) {
        c.querySelector("h3").textContent = r.g.q;
        c.querySelector(".a").textContent = r.nr ? "Sem resposta (tempo esgotado)" : String(r.v).replace(".", ",");
        c.querySelector(".b").textContent = r.g.at;
        Eq.set(c.querySelector(".x"), r.g.e);
      }
    });
    $("redo").classList.toggle("hidden", !wrong.length);
    window.__wrong = wrong.map(function (r) {
      return r.qi;
    });
    dots();
  }
  $("redo").onclick = function () {
    start(window.__wrong.slice(), false);
  };
  var mode = "estudo",
    TL = 30,
    isFull = true;
  var streak = 0,
    seqUi = function () {
      var c = $("stk");
      if (!c) return;
      if (mode === "simulado" || streak < 2) {
        c.classList.add("hidden");
        return;
      }
      c.textContent = "🔥 " + streak + " seguidas";
      c.classList.remove("hidden", "bump");
      void c.offsetWidth;
      c.classList.add("bump");
    };
  function getRank() {
    return ST.get("rank", []);
  }
  function saveRank(secs) {
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
              return "<li>" + esc(x.n || "Anônimo") + ": <b>" + num(x.s) + "</b> pontos · " + fmt(x.t) + "</li>";
            })
            .join("") +
          "</ol><small>Salvo neste navegador.</small>"
        : "<small>Nenhuma pontuação ainda. Jogue uma rodada!</small>") +
      "</div>";
  }
  function goHome() {
    clearInterval(timer);
    clearInterval(qt);
    if (!parked) ST.del("sess");
    ["quiz", "end", "bar", "dots", "book", "sheet", "cards", "hist", "fontes"].forEach(function (id) {
      $(id).classList.add("hidden");
    });
    $("home").classList.remove("hidden");
    rank($("rank"));
    $("bopen").textContent = "Caderno de erros (" + bkList().length + ")";
    setHash("inicio");
    $("exitq").classList.add("hidden");
    retUi();
  }
  var qt = null,
    qs = 0,
    nick = "Anônimo";
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function runQt() {
    var tb = $("tbar");
    qt = setInterval(function () {
      var l = qTL * 1000 - (Date.now() - qs);
      if (l <= 0) {
        $("tfill").style.width = "0%";
        pick(-1);
        return;
      }
      $("tfill").style.width = l / (qTL * 10) + "%";
      tb.classList.toggle("low", l < 8000);
    }, 200);
  }
  function startQ() {
    clearInterval(qt);
    var tb = $("tbar");
    if (mode !== "tempo") {
      tb.classList.add("hidden");
      return;
    }
    tb.classList.remove("hidden");
    tb.classList.remove("low");
    qs = Date.now();
    $("tfill").style.width = "100%";
    var dq = Q[order[i]];
    qTL = (dq.c || dq.g) && QZ.tempoCalc ? QZ.tempoCalc : TL;
    if (qrest > 0) {
      qs = Date.now() - (qTL * 1000 - qrest);
      qrest = 0;
    }
    runQt();
  }
  function begin(m) {
    mode = m;
    nick = ($("nick").value || "").trim() || "Anônimo";
    SH.set("nick", nick);
    start(pickSet(m === "simulado" ? 20 : 10), true);
  }
  var TN = QZ.areas,
    sel = Object.keys(TN);
  Object.keys(TN).forEach(function (k) {
    var b = document.createElement("button");
    b.className = "chip2 on";
    b.setAttribute("data-a", k);
    b.textContent = TN[k];
    b.setAttribute("aria-pressed", "true");
    b.onclick = function () {
      var on = sel.indexOf(k) >= 0;
      if (on && sel.length === 1) return;
      sel = on
        ? sel.filter(function (x) {
            return x !== k;
          })
        : sel.concat(k);
      b.classList.toggle("on", !on);
      b.setAttribute("aria-pressed", String(!on));
      lvUi();
    };
    $("chips").appendChild(b);
  });
  var lvl = +ST.get("lvl", 0) || 0,
    LVN = ["Todos", "Fácil", "Médio", "Difícil"];
  function lvCount(n) {
    return Q.filter(function (d) {
      return sel.indexOf(d.t) >= 0 && (!n || (d.n || 2) === n);
    }).length;
  }
  function lvUi() {
    var box = $("lvs");
    if (!box) return;
    box.innerHTML = "";
    LVN.forEach(function (t, n) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip2 lv" + (lvl === n ? " on" : "");
      b.setAttribute("aria-pressed", lvl === n ? "true" : "false");
      b.textContent = t + " · " + lvCount(n);
      b.onclick = function () {
        lvl = n;
        ST.set("lvl", n);
        lvUi();
      };
      box.appendChild(b);
    });
  }
  lvUi();
  function hk(q) {
    var h = 0;
    for (var n = 0; n < q.length; n++) h = (h * 31 + q.charCodeAt(n)) | 0;
    return String(h);
  }
  var HI = {};
  Q.forEach(function (d, k) {
    HI[d.id] = k;
  });
  /* Caderno de erros fica em app-caderno.js. */
  var BK = window.AppCaderno({
    $: $,
    Q: Q,
    ST: ST,
    TN: TN,
    HI: HI,
    LEG: LEG,
    esc: esc,
    goHome: goHome,
    openOnly: openOnly,
  }),
    bkUpdate = BK.bkUpdate,
    bkList = BK.bkList,
    renderBook = BK.renderBook;
  /* Folha de exercícios e relatório ficam em app-folha.js e app-relatorio.js. */
  var renderSheet = window.AppFolha({
    $: $,
    id: id,
    Q: Q,
    QZ: QZ,
    FIG: FIG,
    TN: TN,
    esc: esc,
    shuf: shuf,
    goHome: goHome,
    openOnly: openOnly,
    sel: function () {
      return sel;
    },
  }).renderSheet;
  var rel = window.AppRelatorio({ id: id, Q: Q, HI: HI, ST: ST, esc: esc }),
    relatorio = rel.relatorio,
    contaHtml = rel.contaHtml;
  /* perfil e treino adaptativo (tela "Meu desempenho") */
  function perfilUI() {
    var el = document.createElement("div");
    el.id = "perfilbox";
    var R = window.Perfil.resumo(Q),
      o = "",
      pior = null;
    Object.keys(TN).forEach(function (k) {
      var r = R[k];
      if (!r) return;
      var pc = r.n ? Math.round((100 * r.ac) / r.n) : null;
      if (pc !== null && (pior === null || pc < pior.pc)) pior = { k: k, pc: pc };
      o +=
        '<p style="margin:6px 0 0"><b>' +
        esc(TN[k]) +
        "</b>: " +
        r.vistas +
        " de " +
        r.tot +
        " perguntas vistas, " +
        r.dom +
        " dominadas</p>";
    });
    var nv = Object.keys(window.Perfil.ler()).length;
    el.innerHTML =
      '<p style="margin:16px 0 4px"><b>Perguntas dominadas</b></p><p class="msg neu" style="margin:0 0 6px">Dominada: 2 ou mais tentativas e pelo menos 80% de acerto.</p>' +
      o +
      (pior && pior.pc < 70
        ? '<p class="msg no" style="margin-top:10px">Para reforçar: <b>' +
          esc(TN[pior.k]) +
          "</b> (" +
          pior.pc +
          "% de acerto).</p>"
        : "") +
      '<button class="btn" id="tadapt" style="margin-top:10px">Treino adaptativo (10 perguntas)</button><p class="msg neu" style="margin-top:6px">Sorteia mais perguntas das que você errou, ainda não viu ou não revê há tempo.</p>' +
      relatorio() +
      contaHtml();
    ($("hp2") || $("histbody")).appendChild(el);
    $("tadapt").onclick = function () {
      mode = "estudo";
      var ids = poolSel()
          .map(function (k) {
            return { k: k, id: Q[k].id };
          })
          .filter(function (x) {
            return !Q[x.k].g;
          }),
        s = window.Perfil.sugerir(ids, 10);
      if (s.length) start(s, false);
    };
    var nm = function (t, ok) {
      var m = $("nmsg");
      if (!m) return;
      m.textContent = t;
      m.className = "msg " + (ok ? "ok" : "no");
      m.style.display = "block";
    };
    if ($("trpior"))
      $("trpior").onclick = function () {
        mode = "estudo";
        if (window.__pior.length) start(window.__pior.slice(), false);
      };
    if ($("nent"))
      $("nent").onclick = function () {
        nm("Entrando…", true);
        window.Nuvem.entrar($("ncod").value)
          .then(function () {
            renderHist();
            nm("Conectado! Seu histórico está sincronizado.", true);
          })
          .catch(function (e) {
            nm(e.message, false);
          });
      };
    if ($("nsinc"))
      $("nsinc").onclick = function () {
        nm("Sincronizando…", true);
        window.Nuvem.sincronizar().then(function (r) {
          if (r) {
            renderHist();
            nm("Sincronizado.", true);
          } else nm("Não foi possível sincronizar agora.", false);
        });
      };
    if ($("nsair"))
      $("nsair").onclick = function () {
        window.Nuvem.sair();
        renderHist();
      };
  }
  function openOnly(id) {
    if (id !== "quiz" && !parked) ST.del("sess");
    ["home", "quiz", "end", "book", "sheet", "cards", "hist", "fontes"].forEach(function (x) {
      $(x).classList.add("hidden");
    });
    ["bar", "dots"].forEach(function (x) {
      $(x).classList.add("hidden");
    });
    $(id).classList.remove("hidden");
    window.scrollTo(0, 0);
    setHash(VMAP[id]);
  }
  $("btrain").onclick = function () {
    var l = bkList();
    if (l.length) {
      mode = "estudo";
      start(shuf(l).slice(0, 10), false);
    }
  };
  $("go").onclick = function () {
    begin("estudo");
  };
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
  Q.push.apply(Q, QZ.gq(GQ, Rn, fc, sc, sup));
  var G = null,
    NV = 0;
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
  function submitNum() {
    if (locked) return;
    var v = lerNum($("num").value);
    var er = $("numerr");
    if (isNaN(v)) {
      if (!er) {
        er = document.createElement("p");
        er.id = "numerr";
        er.className = "msg no";
        er.setAttribute("role", "alert");
        $("opts").appendChild(er);
      }
      er.textContent = "Não entendi o número. Escreva só o valor, por exemplo 2,5 ou 2,5 × 10^4.";
      return;
    }
    if (er) er.remove();
    NV = v;
    var ok = Math.abs(v - G.ans) <= Math.abs(G.ans) * 0.02;
    $("num").disabled = true;
    $("nsend").classList.add("hidden");
    pick(-2, ok);
  }
  /* Cartões de revisão ficam em app-cartoes.js. */
  var abrirCartoes = window.AppCartoes({ $: $, QZ: QZ, shuf: shuf, goHome: goHome, openOnly: openOnly }).abrirCartoes;
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
  function histAdd(ag) {
    if (!isFull) return;
    var h = ST.get("hist", []);
    h.push({ d: Date.now(), a: ag, s: score, n: order.length });
    ST.set("hist", h.slice(-200));
  }
  /* Gráficos e tela de histórico ficam em app-graficos.js e app-historico.js. */
  var graf = window.AppGraficos({ TN: TN, esc: esc }).graf;
  var renderHist = window.AppHistorico({
    $: $,
    id: id,
    QZ: QZ,
    ST: ST,
    TN: TN,
    esc: esc,
    perfilUI: perfilUI,
    goHome: goHome,
    openOnly: openOnly,
    graf: graf,
  }).renderHist;
  $("mopen").onclick = function () {
    begin("simulado");
  };
  $("hbtn").onclick = function () {
    if (locked) return;
    var d = Q[order[i]];
    if (!hinted) {
      hinted = true;
      $("hint").innerHTML = '<div class="hint"></div>';
      Eq.set($("hint").firstChild, "Dica: " + d.h);
      if (d.g || d.o.length < 4) {
        $("hbtn").classList.add("hidden");
      } else {
        $("hbtn").textContent = "Eliminar duas alternativas";
      }
    } else {
      var bs = $("opts").children,
        n = 0;
      for (var k = 0; k < bs.length && n < 2; k++) {
        if (perm[k] !== d.a && !bs[k].disabled) {
          bs[k].disabled = true;
          bs[k].style.opacity = ".35";
          n++;
        }
      }
      $("hbtn").classList.add("hidden");
    }
  };
  $("go2").onclick = function () {
    begin("tempo");
  };
  $("share").onclick = function () {
    var b = $("share"),
      t =
        "Fiz " +
        num(score) +
        "/" +
        order.length +
        " no quiz de " +
        QZ.nome.toLowerCase() +
        " (" +
        (mode === "tempo" ? "cronometrado" : "modo estudo") +
        ") em " +
        $("s3").textContent +
        ". Tente também!" +
        (/^https?:$/.test(location.protocol) ? " " + location.origin + location.pathname : "");
    var show = function () {
      var s = $("shtxt");
      if (!s) {
        s = document.createElement("p");
        s.id = "shtxt";
        s.className = "hint";
        s.style.userSelect = "all";
        b.parentNode.insertBefore(s, b.nextSibling);
      }
      s.textContent = "Copie e envie: " + t;
    };
    try {
      if (navigator.share) {
        navigator.share({ text: t }).catch(function (e) {
          if (!e || e.name !== "AbortError") show();
        });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(t)
          .then(function () {
            b.textContent = "Copiado!";
          })
          .catch(show);
      } else {
        show();
      }
    } catch (e) {
      show();
    }
  };
  $("prt").onclick = function () {
    try {
      window.print();
    } catch (e) {}
  };
  $("nick").value = SH.get("nick", "");
  $("again").onclick = function () {
    start(pickSet(mode === "simulado" ? 20 : 10));
  };
  /* Navegação: cada tela tem um endereço #nome, então o botão voltar do celular e do navegador funciona. */
  var VW = { inicio: 1, quiz: 1, resultado: 1, caderno: 1, lista: 1, cartoes: 1, desempenho: 1, fontes: 1 },
    VMAP = { home: "inicio", book: "caderno", sheet: "lista", cards: "cartoes", hist: "desempenho" };
  var curV = "inicio",
    stk = ["inicio"],
    skip = false,
    pend = null;
  var NOH = !/^(https?|file):$/.test(location.protocol);
  function setHash(v, rep) {
    if (curV !== v) {
      curV = v;
      if (rep) {
        stk[stk.length - 1] = v;
      } else {
        stk.push(v);
      }
      if (!NOH && location.hash !== "#" + v) {
        skip = true;
        try {
          if (rep) {
            location.replace("#" + v);
          } else {
            location.hash = v;
          }
        } catch (e) {
          skip = false;
        }
      }
    }
    $("navb").classList.remove("off");
    $("homebtn").hidden = v === "inicio";
  }
  function running() {
    return curV === "quiz" && !$("quiz").classList.contains("hidden");
  }
  function askExit(v) {
    pend = v;
    $("exitq").classList.remove("hidden");
    window.scrollTo(0, 0);
    $("exstay").focus();
  }
  function navTo(v) {
    if (v === "caderno") {
      openOnly("book");
      renderBook();
    } else if (v === "lista") {
      openOnly("sheet");
      renderSheet();
    } else if (v === "cartoes") {
      abrirCartoes();
    } else if (v === "desempenho") {
      openOnly("hist");
      renderHist();
    } else if (v === "fontes") {
      openFontes();
    } else if (v === "quiz") {
      retomar();
    } else {
      goHome();
    }
  }
  window.addEventListener("hashchange", function () {
    if (skip) {
      skip = false;
      return;
    }
    var v = location.hash.slice(1) || "inicio";
    if (!VW[v] || v === curV) return;
    if (running()) {
      skip = true;
      try {
        history.forward();
      } catch (e) {
        skip = false;
        location.hash = "quiz";
      }
      askExit(v);
      return;
    }
    if (stk.length > 1 && stk[stk.length - 2] === v) {
      stk.pop();
    } else {
      stk.push(v);
    }
    curV = v;
    navTo(v);
  });
  $("back").onclick = function () {
    if (running()) {
      askExit("inicio");
    } else if (curV === "inicio") {
      if (!NOH) location.href = location.pathname;
      else location.reload();
    } else if (!NOH && stk.length > 1) {
      history.back();
    } else {
      goHome();
    }
  };
  $("homebtn").onclick = function () {
    if (running()) {
      askExit("inicio");
    } else {
      goHome();
    }
  };
  $("exstay").onclick = function () {
    $("exitq").classList.add("hidden");
  };
  $("exleave").onclick = function () {
    $("exitq").classList.add("hidden");
    clearInterval(qt);
    clearInterval(timer);
    stk.pop();
    curV = "";
    var v = pend || "inicio";
    pend = null;
    navTo(v);
  };
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!$("exitq").classList.contains("hidden")) {
      $("exstay").click();
    } else if (curV !== "inicio") {
      $("back").click();
    }
  });
  $("gohome").onclick = goHome;
  /* Fontes e "retomar de onde parou": ver app-sessao.js */
  var SE = window.AppSessao({
    $: $,
    ST: ST,
    Q: Q,
    id: id,
    Fontes: Fontes,
    fmt: fmt,
    setHash: setHash,
    goHome: goHome,
    running: running,
    qPause: qPause,
    save: save,
    estacionar: function () {
      parked = true;
      autoP = false;
      clearInterval(timer);
      clearInterval(qt);
    },
    retomarCom: function (S) {
      mode = S.m;
      nick = SH.get("nick", "") || "Anônimo";
      start(S.o, S.f, S);
    },
  });
  function sessGet() {
    return SE.sessGet();
  }
  function openFontes() {
    return SE.openFontes();
  }
  function retomar() {
    return SE.retomar();
  }
  function retUi() {
    return SE.retUi();
  }
  var DBGF = location.hash === "#debug",
    SS = sessGet();
  goHome();
  try {
    if (SS) {
      mode = SS.m;
      nick = SH.get("nick", "") || "Anônimo";
      start(SS.o, SS.f, SS);
    }
  } catch (e) {
    goHome();
  }
  $("hst").innerHTML =
    "<span>" + Q.length + " questões</span><span>" + Object.keys(TN).length + " áreas</span><span>3 modos</span>";
  document.documentElement.setAttribute("data-quiz", id);
  $("navb").classList.remove("off");
  $("homebtn").hidden = true;
  document.title = "Quiz: " + QZ.nome;
  document.querySelector(".hero h1").textContent = QZ.nome;
  document.querySelector(".hero p").textContent = QZ.subt;
  document.querySelector("details.sum").innerHTML = QZ.resumo;
  $("go2").querySelector("small").textContent = QZ.tempoDesc;
  document.querySelectorAll(".chip2[data-a]").forEach(function (b) {
    var k = b.getAttribute("data-a");
    b.textContent =
      TN[k] +
      " · " +
      Q.filter(function (d) {
        return d.t === k;
      }).length;
  });
  window.AppValidacao({ Q: Q, TN: TN, FIG: FIG });
  if (DBGF) {
    window.__qz = function (c) {
      return eval(c);
    };
  }
};
