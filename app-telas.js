/* Navegação entre telas: cada tela tem um endereço #nome, então o botão voltar do celular e do navegador funciona.
   Também cuida do aviso "sair do quiz?" e da tecla Esc.
   Recebe em "c" o que precisa do script.js; o que muda com o tempo chega como função. */
window.AppTelas = function (c) {
  var $ = c.$;
  var VW = { inicio: 1, quiz: 1, resultado: 1, caderno: 1, lista: 1, cartoes: 1, desempenho: 1, fontes: 1 };
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
      c.openOnly("book");
      c.renderBook();
    } else if (v === "lista") {
      c.openOnly("sheet");
      c.renderSheet();
    } else if (v === "cartoes") {
      c.abrirCartoes();
    } else if (v === "desempenho") {
      c.openOnly("hist");
      c.renderHist();
    } else if (v === "fontes") {
      c.openFontes();
    } else if (v === "quiz") {
      c.retomar();
    } else {
      c.goHome();
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
      c.goHome();
    }
  };
  $("homebtn").onclick = function () {
    if (running()) {
      askExit("inicio");
    } else {
      c.goHome();
    }
  };
  $("exstay").onclick = function () {
    $("exitq").classList.add("hidden");
  };
  $("exleave").onclick = function () {
    $("exitq").classList.add("hidden");
    c.pararRelogios();
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
  return { setHash: setHash, running: running };
};
