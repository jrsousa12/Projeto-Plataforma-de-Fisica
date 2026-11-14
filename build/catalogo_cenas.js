/* Gera build/CENAS.md: catálogo curto das animações (chave + frase), por arquivo.
   Serve para achar cena para reaproveitar sem abrir os figuras-animq-*.js. Rodado pelo tudo.sh.
   Fica de fora calc_* (resolução por molde de cálculo: não se reaproveita). */
const fs = require("fs"), vm = require("vm"), path = require("path");
const APP = path.join(__dirname, "..");
const win = { matchMedia: () => ({ matches: false }) }; win.window = win;
vm.createContext(win);
const base = ["figuras-anim.js", "figuras-anim-pecas.js", "figuras-anim-kit.js", "figuras-anim-passos.js", "figuras-animq-auto-dados.js"];
const cenas = fs.readdirSync(APP).filter(f => /^figuras-animq-.*\.js$/.test(f) && !base.includes(f)).sort();
const roda = f => vm.runInContext(fs.readFileSync(path.join(APP, f), "utf8"), win, { filename: f });
base.forEach(roda);
const curto = a => String(a || "").replace(/^(Animação|Resolução animada):\s*/i, "").replace(/\s+/g, " ").slice(0, 110);
let out = ["# Catálogo de cenas (gerado por build/catalogo_cenas.js: não editar)", "",
  "Uso: `grep -i palavra build/CENAS.md`; reaproveitar com `\"an\": \"chave\"`. Seção = arquivo onde a cena está.", ""], total = 0;
for (const f of cenas) {
  const antes = new Set(Object.keys(win.ANIM || {}));
  roda(f);
  const novas = Object.keys(win.ANIM).filter(k => !antes.has(k) && !k.startsWith("calc_")).sort();
  if (!novas.length) continue;
  out.push(`## ${f.replace(/^figuras-animq-|\.js$/g, "")} (${novas.length})`);
  novas.forEach(k => out.push(`- \`${k}\`: ${curto(win.ANIM[k].a)}`));
  out.push(""); total += novas.length;
}
fs.writeFileSync(path.join(__dirname, "CENAS.md"), out.join("\n"));
/* impressão digital de TODAS as cenas (inclui calc_): igual antes/depois de uma edição = visual idêntico */
const A = win.ANIM, ks = Object.keys(A).sort();
const dig = require("crypto").createHash("sha1").update(ks.map(k => k + JSON.stringify(A[k], (_, v) => typeof v === "function" ? String(v) : v)).join("\n")).digest("hex").slice(0, 12);
console.log(`CENAS.md: ${total} cenas; impressão digital das ${ks.length}: ${dig}`);
