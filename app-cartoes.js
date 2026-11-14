/* Cartões de revisão (conceitos e curiosidades): virar, avançar, embaralhar e trocar de baralho.
   Recebe do quiz (script.js) o que usa; nenhum desses itens muda durante o jogo. */
window.AppCartoes = function (c) {
  "use strict";
  var $ = c.$,
    QZ = c.QZ,
    shuf = c.shuf,
    goHome = c.goHome,
    openOnly = c.openOnly;
  var CARDS = QZ.cards.slice(),
    fi = 0,
    fl = false,
    DK = 0;
  function setDeck(k) {
    DK = k;
    CARDS = (k && QZ.curio ? QZ.curio : QZ.cards).slice();
    fi = 0;
    fl = false;
    $("dk0").className = k ? "" : "on";
    $("dk1").className = k ? "on" : "";
    $("dk0").setAttribute("aria-pressed", k ? "false" : "true");
    $("dk1").setAttribute("aria-pressed", k ? "true" : "false");
    renderCard();
  }
  $("cdeck").classList.toggle("hidden", !(QZ.curio && QZ.curio.length));
  $("dk0").onclick = function () {
    setDeck(0);
  };
  $("dk1").onclick = function () {
    setDeck(1);
  };
  function mkFace(cl, c, tx) {
    var e = document.createElement("span");
    e.className = cl;
    if (c[2] && window.AV && AV[c[2]]) {
      var w = document.createElement("span");
      w.innerHTML =
        '<svg class="av" viewBox="0 0 100 100" role="img" aria-label="Retrato ilustrado">' + AV[c[2]] + "</svg>";
      e.appendChild(w.firstChild);
    }
    var t = document.createElement("span");
    Eq.set(t, tx);
    e.appendChild(t);
    return e;
  }
  function renderCard() {
    var c = CARDS[fi],
      f = $("fc");
    $("cc").textContent =
      "Cartão " + (fi + 1) + " de " + CARDS.length + (fl ? " · resposta" : DK ? " · curiosidade" : " · conceito");
    if (f.getAttribute("data-k") !== c[0]) {
      f.setAttribute("data-k", c[0]);
      f.innerHTML = "";
      var i = document.createElement("span");
      i.className = "fci";
      i.appendChild(mkFace("fcf", c, c[0]));
      i.appendChild(mkFace("fcb", c, c[1]));
      f.appendChild(i);
      f.className = "fc nt" + (fl ? " back" : "");
      void f.offsetWidth;
      f.classList.remove("nt");
    } else f.className = "fc" + (fl ? " back" : "");
    var fa = f.querySelector(".fcf"),
      fb = f.querySelector(".fcb");
    fa.setAttribute("aria-hidden", fl ? "true" : "false");
    fb.setAttribute("aria-hidden", fl ? "false" : "true");
  }
  function flip() {
    fl = !fl;
    renderCard();
  }
  /* Abre a tela e recomeça do primeiro cartão (botão do menu e endereço #cartoes). */
  function abrirCartoes() {
    openOnly("cards");
    fi = 0;
    fl = false;
    renderCard();
  }
  $("fopen").onclick = abrirCartoes;
  $("fc").onclick = flip;
  $("cflip").onclick = flip;
  var swT = 0,
    swP = null;
  function swapCard(fn) {
    var f = $("fc");
    if (swP) {
      clearTimeout(swT);
      var p = swP;
      swP = null;
      p();
    }
    if (window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches) {
      fn();
      return;
    }
    f.classList.remove("sin");
    f.classList.add("sout");
    swP = fn;
    swT = setTimeout(function () {
      swP = null;
      fn();
      f.classList.remove("sout");
      void f.offsetWidth;
      f.classList.add("sin");
      swT = setTimeout(function () {
        f.classList.remove("sin");
      }, 420);
    }, 170);
  }
  $("cnext").onclick = function () {
    swapCard(function () {
      fi = (fi + 1) % CARDS.length;
      fl = false;
      renderCard();
    });
  };
  $("cshuf").onclick = function () {
    swapCard(function () {
      CARDS = shuf(CARDS);
      fi = 0;
      fl = false;
      renderCard();
    });
  };
  $("cback").onclick = goHome;
  return { abrirCartoes: abrirCartoes };
};
