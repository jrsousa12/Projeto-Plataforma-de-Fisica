/* sombra na barra superior quando a página rola */
(function () {
  var t = document.getElementById("topbar");
  if (!t) return;
  var on = false;
  function f() {
    var s = (window.pageYOffset || 0) > 6;
    if (s !== on) {
      on = s;
      t.classList.toggle("stuck", s);
    }
  }
  window.addEventListener("scroll", f, { passive: true });
  f();
})();
