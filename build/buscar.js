#!/usr/bin/env node
/* Procura um fato no próprio app antes de pesquisar fora (passo 1 da "Pesquisa padrão").
   Uso: node build/buscar.js palavra [outra ...] [--max 20] [--tudo]
   - Acha perguntas que tenham TODAS as palavras (sem diferenciar maiúsculas e acentos) e mostra id, campo e um trecho curto.
   - Também procura em quiz-*.js, fontes.js, figuras-*.js e banco-*.js (arquivo:linha + trecho).
   - --tudo mostra a pergunta inteira (enunciado, alternativas, gabarito, explicação) de cada achado. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const RAIZ = path.join(__dirname, "..");
const args = process.argv.slice(2);
let max = 20, tudo = false;
const termos = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--max") max = +args[++i];
  else if (args[i] === "--tudo") tudo = true;
  else termos.push(args[i]);
}
if (!termos.length) { console.log("Uso: node build/buscar.js palavra [outra ...] [--max 20] [--tudo]"); process.exit(1); }
const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const T = termos.map(norm);
const tem = s => { const n = norm(s); return T.every(t => n.includes(t)); };
const trecho = (s, larg = 70) => {
  s = String(s).replace(/\s+/g, " ");
  const k = norm(s).indexOf(T[0]);
  const a = Math.max(0, k - larg), b = Math.min(s.length, k + T[0].length + larg);
  return (a ? "…" : "") + s.slice(a, b) + (b < s.length ? "…" : "");
};

// 1) perguntas: carrega os bancos como o navegador faria
const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
const bancos = fs.readdirSync(RAIZ).filter(f => /^(perguntas-.*|banco-proprio|banco-extra)\.js$/.test(f));
for (const f of bancos) { try { vm.runInContext(fs.readFileSync(path.join(RAIZ, f), "utf8"), ctx); } catch (e) { /* banco que precisa de outro arquivo: fica de fora */ } }
const B = ctx.window.BANKS || {};
let n = 0;
console.log("== Perguntas");
for (const quiz of Object.keys(B)) for (const p of B[quiz] || []) {
  if (!tem(JSON.stringify(p))) continue;
  if (++n > max) continue;
  if (tudo) {
    console.log(`${quiz}/${p.id} [${p.t}]${p.c ? " (cálculo)" : ""}: ${p.q}`);
    (p.o || []).forEach((o, i) => console.log(`   ${i === p.a ? "*" : " "} ${o}`));
    console.log(`   explicação: ${p.e}`);
  } else {
    const campo = ["q", "o", "e", "h", "x"].find(c => p[c] && norm(JSON.stringify(p[c])).includes(T[0])) || "q";
    console.log(`${quiz}/${p.id} [${campo}] ${trecho(typeof p[campo] === "string" ? p[campo] : JSON.stringify(p[campo]))}`);
  }
}
if (n > max) console.log(`… e mais ${n - max} (use --max)`);
if (!n) console.log("(nenhuma)");

// 2) outros arquivos de conteúdo: arquivo:linha + trecho
console.log("== Outros arquivos");
let m = 0;
const outros = fs.readdirSync(RAIZ).filter(f => /^(quiz-.*|fontes|figuras.*)\.js$/.test(f)).sort();
for (const f of outros) {
  fs.readFileSync(path.join(RAIZ, f), "utf8").split("\n").forEach((l, i) => {
    if (tem(l) && ++m <= max) console.log(`${f}:${i + 1} ${trecho(l)}`);
  });
}
if (m > max) console.log(`… e mais ${m - max} (use --max)`);
if (!m) console.log("(nenhum)");
