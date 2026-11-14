/* Meta diária de questões: compartilhada entre os quizzes e guardada só neste aparelho. */
window.Meta = (function () {
  var K = "eletriz:meta";
  function dk(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function rd() {
    try {
      var v = JSON.parse(localStorage.getItem(K));
      if (v && typeof v === "object") return v;
    } catch (e) {}
    return null;
  }
  function get() {
    var m = rd() || { goal: 10, day: dk(), n: 0, met: [] };
    if (!(m.goal > 0)) m.goal = 10;
    if (!Array.isArray(m.met)) m.met = [];
    if (m.day !== dk()) {
      m.day = dk();
      m.n = 0;
    }
    return m;
  }
  function put(m) {
    try {
      localStorage.setItem(K, JSON.stringify(m));
    } catch (e) {}
  }
  function marca(m) {
    if (m.n >= m.goal && m.met.indexOf(m.day) < 0) m.met = m.met.concat(m.day).slice(-60);
  }
  function inc() {
    var m = get();
    m.n++;
    marca(m);
    put(m);
    ui();
    return m.n === m.goal;
  }
  function goal(n) {
    var m = get();
    m.goal = n;
    marca(m);
    put(m);
    ui();
  }
  function sem(m) {
    var c = 0,
      d = new Date();
    for (var k = 0; k < 7; k++) {
      var x = new Date(d);
      x.setDate(d.getDate() - k);
      if (m.met.indexOf(dk(x)) >= 0) c++;
    }
    return c;
  }
  function ui() {
    var m = get(),
      el = document.getElementById("metabar"),
      ch = document.getElementById("mtc"),
      pc = Math.min(100, Math.round((100 * m.n) / m.goal));
    if (ch) {
      ch.textContent = "🎯 " + Math.min(m.n, m.goal) + "/" + m.goal;
      ch.classList.toggle("done", m.n >= m.goal);
    }
    if (!el) return;
    el.querySelector(".mt").textContent =
      m.n >= m.goal
        ? "✓ Meta de hoje cumprida! " + m.n + " questões respondidas."
        : "🎯 Meta de hoje: " + m.n + " de " + m.goal + " questões";
    el.querySelector(".mpb i").style.width = pc + "%";
    el.querySelector(".mpb").setAttribute("aria-valuenow", String(pc));
    var w = sem(m);
    el.querySelector(".ms").textContent = w
      ? "Meta cumprida em " + w + (w === 1 ? " dia" : " dias") + " dos últimos 7."
      : "Responda questões para começar a contar.";
    el.querySelectorAll("button[data-g]").forEach(function (b) {
      var on = +b.getAttribute("data-g") === m.goal;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  return { get: get, inc: inc, goal: goal, ui: ui };
})();
