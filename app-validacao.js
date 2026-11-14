/* Validação do banco: roda ao abrir a página (chamada pelo script.js).
   Problemas vão para o console; abra com #teste para ver o resultado no topo. */
window.AppValidacao = function (c) {
  "use strict";
  var Q = c.Q,
    TN = c.TN,
    FIG = c.FIG;
  function validateBank() {
    var er = [],
      ids = {},
      qs = {};
    Q.forEach(function (d, k) {
      var w = "Q" + (k + 1) + " (" + (d.id || "sem id") + ")";
      if (!d.id) er.push(w + ": sem id");
      else if (ids[d.id]) er.push(w + ": id repetido");
      ids[d.id] = 1;
      if (!TN[d.t]) er.push(w + ": área inválida");
      if (!d.h) er.push(w + ": sem dica");
      if (!d.g) {
        if (!d.e) er.push(w + ": sem explicação");
        if (!d.o || d.o.length < 2) er.push(w + ": poucas alternativas");
        else {
          if (!(d.a >= 0 && d.a < d.o.length)) er.push(w + ": gabarito fora do intervalo");
          if (new Set(d.o).size !== d.o.length) er.push(w + ": alternativas repetidas");
        }
        if (qs[d.q]) er.push(w + ": pergunta repetida");
        qs[d.q] = 1;
      }
      if (d.f && !FIG[d.f]) er.push(w + ": figura inexistente (" + d.f + ")");
    });
    return er;
  }
  var BE = validateBank();
  if (BE.length) {
    console.warn("Banco com problemas:\n" + BE.join("\n"));
  }
  if (location.hash === "#teste") {
    document.querySelector(".hero p").textContent = BE.length
      ? "Banco: " + BE.length + " problema(s). Veja o console."
      : "Banco OK: " + Q.length + " questões validadas.";
  }
  return { erros: BE };
};
