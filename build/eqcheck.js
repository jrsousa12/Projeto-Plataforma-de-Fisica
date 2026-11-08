// Lê uma lista JSON de textos (stdin) e devolve, para cada um, os trechos com " / " que NÃO viram fração empilhada.
const Eq = require("../eq.js");
let s = ""; process.stdin.on("data", c => s += c).on("end", () => {
  console.log(JSON.stringify(JSON.parse(s).map(t => Eq.naoEmpilha(t))));
});
