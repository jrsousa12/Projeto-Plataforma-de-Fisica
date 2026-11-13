/* Relógio do quiz: tempo da rodada (mm:ss; contagem regressiva de 40 min no simulado), pausa (modo estudo, ou ao sair da aba)
   e barra de tempo de cada pergunta no modo cronometrado. Recebe do quiz (script.js) o que usa; o que muda vem de funções:
   c.mode(), c.locked() (pergunta já respondida), c.dq() (pergunta atual) e c.running() (quiz aberto). */
window.AppRelogio = function (c) {
  "use strict";
  var $ = c.$,
    QZ = c.QZ,
    fmt = c.fmt;
  var TL = 30, // segundos por pergunta no modo cronometrado
    t0 = 0,
    timer = null,
    pz = 0,
    qrem = 0,
    qrest = 0,
    qTL = 30,
    autoP = false,
    qt = null,
    qs = 0;
  function tick() {
    if (pz) return;
    var sc2 = Math.floor((Date.now() - t0) / 1000);
    if (c.mode() === "simulado") {
      var r = 2400 - sc2;
      $("tm").textContent = fmt(Math.max(r, 0));
      if (r <= 0 && !$("quiz").classList.contains("hidden")) {
        c.finish();
      }
    } else {
      $("tm").textContent = fmt(sc2);
    }
  }
  function elapsed() {
    return Math.max(0, Math.floor(((pz || Date.now()) - t0) / 1000));
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
    if (pz) c.save();
  }
  $("tpause").onclick = function () {
    setPz(!pz);
  };
  /* Pausa o relógio sem sair da tela (também o tempo da pergunta no modo cronometrado) e devolve se pausou agora. */
  function qPause() {
    if ($("quiz").classList.contains("hidden") || pz) return false;
    if (c.mode() === "tempo" && !c.locked()) {
      qrem = Math.max(1, qTL * 1000 - (Date.now() - qs));
      clearInterval(qt);
    } else qrem = 0;
    setPz(true);
    return true;
  }
  function qResume() {
    setPz(false);
    if (c.mode() === "tempo" && qrem > 0 && !c.locked()) {
      qs = Date.now() - (qTL * 1000 - qrem);
      qrem = 0;
      runQt();
    } else qrem = 0;
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      if (c.running() && qPause()) autoP = true;
      c.save();
    } else if (autoP) {
      autoP = false;
      if (c.running()) qResume();
    }
  });
  function runQt() {
    var tb = $("tbar");
    qt = setInterval(function () {
      var l = qTL * 1000 - (Date.now() - qs);
      if (l <= 0) {
        $("tfill").style.width = "0%";
        c.pick(-1);
        return;
      }
      $("tfill").style.width = l / (qTL * 10) + "%";
      tb.classList.toggle("low", l < 8000);
    }, 200);
  }
  function startQ() {
    clearInterval(qt);
    var tb = $("tbar");
    if (c.mode() !== "tempo") {
      tb.classList.add("hidden");
      return;
    }
    tb.classList.remove("hidden");
    tb.classList.remove("low");
    qs = Date.now();
    $("tfill").style.width = "100%";
    var dq = c.dq();
    qTL = (dq.c || dq.g) && QZ.tempoCalc ? QZ.tempoCalc : TL;
    if (qrest > 0) {
      qs = Date.now() - (qTL * 1000 - qrest);
      qrest = 0;
    }
    runQt();
  }
  function parar() {
    clearInterval(timer);
    clearInterval(qt);
  }
  return {
    elapsed: elapsed,
    qPause: qPause,
    startQ: startQ,
    parar: parar,
    qrem: function () {
      return qrem;
    },
    /* milissegundos que restam da pergunta (lido pelos testes) */
    resta: function () {
      return qTL * 1000 - (Date.now() - qs);
    },
    /* início da rodada: zera a pausa; S é a sessão salva (retomar), com o tempo que restava da pergunta */
    zerar: function (S) {
      pz = 0;
      autoP = false;
      qrem = 0;
      qrest = S && S.qr > 0 ? S.qr : 0;
      setPz(false);
    },
    /* liga o relógio da rodada (S: continua do tempo salvo) */
    iniciar: function (S) {
      t0 = S ? Date.now() - S.el * 1000 : Date.now();
      clearInterval(timer);
      timer = setInterval(tick, 1000);
      tick();
    },
    pararPergunta: function () {
      clearInterval(qt);
    },
    /* fim da rodada: para tudo, tira a pausa e devolve os segundos gastos */
    encerrar: function () {
      parar();
      pz = 0;
      setPz(false);
      return Math.floor((Date.now() - t0) / 1000);
    },
    estacionar: function () {
      autoP = false;
      parar();
    },
  };
};
