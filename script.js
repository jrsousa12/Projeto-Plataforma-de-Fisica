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
  /* Relógio da rodada, pausa e tempo por pergunta: ver app-relogio.js */
  var RL = window.AppRelogio({
    $: $,
    QZ: QZ,
    fmt: fmt,
    finish: finish,
    pick: pick,
    save: save,
    running: running,
    mode: function () {
      return mode;
    },
    locked: function () {
      return locked;
    },
    dq: function () {
      return Q[order[i]];
    },
  });
  /* Tela do resultado (fim da rodada) e ranking: ver app-resultado.js */
  var RS = window.AppResultado({ $: $, Q: Q, QZ: QZ, esc: esc, num: num, fmt: fmt, ST: ST });
  /* Questões numéricas: app-numeros.js. Retorno depois de responder: app-retorno.js. Animação: app-animacao.js */
  var NU = window.AppNumeros(),
    RT = window.AppRetorno({ $: $, esc: esc }),
    fmtE = RT.fmtE;
  var order = [],
    i = 0,
    score = 0,
    res = [],
    locked = false,
    hinted = false,
    parked = false;
  function fmt(s) {
    var m = Math.floor(s / 60),
      r = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }
  function num(n) {
    return String(n).replace(".", ",");
  }
  function dots() {
    var h = "";
    for (var k = 0; k < order.length; k++) {
      h += '<div class="dot ' + (k < res.length ? (res[k].ok ? "ok" : "bad") : k === i ? "cur" : "") + '"></div>';
    }
    $("dots").innerHTML = h;
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
        el: RL.elapsed(),
        qr: RL.qrem(),
        at: Date.now(),
      });
    } catch (e) {}
  }
  window.addEventListener("pagehide", save);
  function start(list, full, S) {
    isFull = full !== false;
    order = list;
    i = 0;
    score = 0;
    res = [];
    streak = 0;
    parked = false;
    RL.zerar(S);
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
    RL.iniciar(S);
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
    RL.startQ();
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
  function pick(k, nok) {
    if (locked) return;
    locked = true;
    RL.pararPergunta();
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
    /* caixa de retorno (explicação, animação, "Você marcou", meta): app-retorno.js */
    RT.mostrar({ ok: ok, k: k, oi: oi, d: d, G: G, hinted: hinted, mode: mode, mf: mf, ultima: i >= order.length - 1 });
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
  function finish() {
    var secs = RL.encerrar();
    ST.del("sess");
    /* simulado com o tempo esgotado: as perguntas que faltaram contam como sem resposta e aparecem na revisão */
    if (mode === "simulado" && res.length < order.length) {
      for (var k = res.length; k < order.length; k++) {
        var dq = Q[order[k]];
        res.push({ qi: order[k], pick: -1, ok: false, hint: false, g: dq.g ? dq.g() : null, v: "", nr: 1 });
      }
      i = order.length - 1;
    }
    var right = res.filter(function (r) {
        return r.ok;
      }).length,
      hints = res.filter(function (r) {
        return r.hint;
      }).length;
    $("quiz").classList.add("hidden");
    $("end").classList.remove("hidden");
    setHash("resultado", true);
    $("exitq").classList.add("hidden");
    var R = RS.mostrar({ res: res, n: order.length, score: score, secs: secs, right: right, hints: hints, ranking: isFull && mode === "tempo", nick: nick }),
      wrong = R.wrong;
    histAdd(R.ag);
    window.__wrong = wrong.map(function (r) {
      return r.qi;
    });
    dots();
  }
  $("redo").onclick = function () {
    start(window.__wrong.slice(), false);
  };
  var mode = "estudo",
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
  function goHome() {
    RL.parar();
    if (!parked) ST.del("sess");
    ["quiz", "end", "bar", "dots", "book", "sheet", "cards", "hist", "fontes"].forEach(function (id) {
      $(id).classList.add("hidden");
    });
    $("home").classList.remove("hidden");
    RS.rank($("rank"));
    $("bopen").textContent = "Caderno de erros (" + bkList().length + ")";
    setHash("inicio");
    $("exitq").classList.add("hidden");
    retUi();
  }
  var nick = "Anônimo";
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
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
  /* Perfil e treino adaptativo (tela "Meu desempenho"): ver app-perfil.js */
  var perfilUI = window.AppPerfil({
    $: $,
    Q: Q,
    TN: TN,
    esc: esc,
    relatorio: relatorio,
    contaHtml: contaHtml,
    poolSel: poolSel,
    estudar: function (lista) {
      mode = "estudo";
      start(lista, false);
    },
    renderHist: function () {
      renderHist();
    },
  }).perfilUI;
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
  /* Questões numéricas (sorteio de valores, notação científica, leitura do número): app-numeros.js */
  Q.push.apply(Q, QZ.gq(NU.GQ, NU.Rn, NU.fc, NU.sc, NU.sup));
  var G = null,
    NV = 0;
  function submitNum() {
    if (locked) return;
    var v = NU.lerNum($("num").value);
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
  /* Botão "Compartilhar resultado": ver app-compartilhar.js */
  window.AppCompartilhar({
    $: $,
    QZ: QZ,
    num: num,
    dados: function () {
      return { score: score, n: order.length, mode: mode };
    },
  });
  $("prt").onclick = function () {
    try {
      window.print();
    } catch (e) {}
  };
  $("nick").value = SH.get("nick", "");
  $("again").onclick = function () {
    start(pickSet(mode === "simulado" ? 20 : 10));
  };
  /* Navegação entre telas, botão voltar e aviso de sair do quiz: ver app-telas.js */
  var VMAP = { home: "inicio", book: "caderno", sheet: "lista", cards: "cartoes", hist: "desempenho" };
  var TE = window.AppTelas({
    $: $,
    openOnly: openOnly,
    renderBook: renderBook,
    renderSheet: renderSheet,
    abrirCartoes: abrirCartoes,
    renderHist: renderHist,
    openFontes: openFontes,
    retomar: retomar,
    goHome: goHome,
    pararRelogios: RL.parar,
  });
  function setHash(v, rep) {
    return TE.setHash(v, rep);
  }
  function running() {
    return TE.running();
  }
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
    qPause: RL.qPause,
    save: save,
    estacionar: function () {
      parked = true;
      RL.estacionar();
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
