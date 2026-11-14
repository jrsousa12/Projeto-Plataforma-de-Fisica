// Compacta JavaScript para o arquivo único: tira comentários e recuos, sem mudar a lógica.
// Usa o TypeScript (instalado no computador) para ler o código: ele entende textos, regex e `modelos`.
// Entrada (stdin): JSON com uma lista de códigos. Saída (stdout): JSON com a lista compactada.
const ts = require(require("child_process").execSync("npm root -g").toString().trim() + "/typescript");

const impressora = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed });

// trechos onde a quebra de linha e os espaços fazem parte do texto (não podem perder o recuo)
function trechosLiterais(sf) {
  const r = [];
  (function visita(n) {
    if (
      ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) ||
      ts.isTemplateMiddle(n) || ts.isTemplateTail(n) || ts.isRegularExpressionLiteral(n)
    ) r.push([n.getStart(sf), n.end]);
    ts.forEachChild(n, visita);
  })(sf);
  return r;
}

function compactar(codigo) {
  const sf = ts.createSourceFile("a.js", codigo, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  if (sf.parseDiagnostics && sf.parseDiagnostics.length) return codigo; // não entendeu: deixa como está
  const impresso = impressora.printFile(sf);
  const sf2 = ts.createSourceFile("b.js", impresso, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const lit = trechosLiterais(sf2).sort((x, y) => x[0] - y[0]);
  // uma passada só: copia os textos intactos; fora deles, tira espaços que não separam nada.
  // As quebras de linha ficam (o JavaScript usa algumas delas como fim de comando).
  const pal = /[A-Za-z0-9_$\u0080-￿]/;
  let saida = "", i = 0, k = 0;
  while (i < impresso.length) {
    while (k < lit.length && lit[k][1] <= i) k++;
    if (k < lit.length && lit[k][0] <= i) { saida += impresso.slice(i, lit[k][1]); i = lit[k][1]; continue; }
    const c = impresso[i];
    if (c === " " || c === "\t") {
      let j = i; while (impresso[j] === " " || impresso[j] === "\t") j++;
      const a = saida[saida.length - 1] || "\n", b = impresso[j] || "\n";
      const precisa = (pal.test(a) && pal.test(b)) || ("+-".includes(a) && "+-".includes(b)) ||
        (a === "/" && "/*".includes(b)) || (/[0-9]/.test(a) && b === ".") || (a === "<" && b === "!");
      if (precisa && a !== "\n" && b !== "\n") saida += " ";
      i = j; continue;
    }
    saida += c; i++;
  }
  return saida.replace(/\n+$/, "\n");
}

let entrada = "";
process.stdin.on("data", (d) => (entrada += d));
process.stdin.on("end", () => {
  process.stdout.write(JSON.stringify(JSON.parse(entrada).map(compactar)));
});
