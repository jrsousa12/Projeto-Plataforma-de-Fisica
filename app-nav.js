/* Barra de navegação inferior e seleção de áreas */
(function () {
  var $ = function (i) {
      return document.getElementById(i);
    },
    B = document.querySelectorAll("#bnav button");
  B.forEach(function (b) {
    b.onclick = function () {
      var t = $(b.getAttribute("data-t"));
      if (t) t.click();
      window.scrollTo(0, 0);
    };
  });
  function upd() {
    B.forEach(function (b) {
      var s = $(b.getAttribute("data-v")),
        on = !!s && !s.classList.contains("hidden");
      b.classList.toggle("on", on);
      if (on) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    var m = /\((\d+)\)/.exec($("bopen").textContent || ""),
      n = m ? +m[1] : 0,
      g = $("bdg");
    var tx = n > 99 ? "99+" : String(n);
    if (g.textContent !== tx) g.textContent = tx;
    if (g.hidden !== !n) g.hidden = !n;
    var chips = document.querySelectorAll(".chip2[data-a]"),
      all = document.querySelectorAll(".chip2[data-a].on").length === chips.length;
    if ($("allareas").disabled !== all) $("allareas").disabled = all;
  }
  $("allareas").onclick = function () {
    document.querySelectorAll(".chip2[data-a]:not(.on)").forEach(function (c) {
      c.click();
    });
    upd();
  };
  new MutationObserver(upd).observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
    childList: true,
    characterData: true,
  });
  upd();
})();
