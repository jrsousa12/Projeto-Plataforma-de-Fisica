/* Valida os bancos de perguntas. Uso: node validar-banco.js  (sai com erro se algo estiver errado) */
const fs=require("fs"),vm=require("vm");
const win={};win.window=win;win.localStorage={getItem(){return null},setItem(){}};
const ctx=vm.createContext(win);
const arqs=fs.readdirSync(".").filter(f=>/^(perguntas|quiz|figuras)(-.*)?\.js$/.test(f)).sort((a,b)=>{const r=f=>/^perguntas/.test(f)?0:f==="figuras.js"?1:2;return r(a)-r(b)||a.localeCompare(b)});
arqs.forEach(f=>vm.runInContext(fs.readFileSync(f,"utf8"),ctx,{filename:f}));
const B=win.BANKS||{},Z=win.QUIZZES||{},erros=[],avisos=[];
const E=(m)=>erros.push(m),W=(m)=>avisos.push(m);
const ids={},qtxt={},areasDe={};
Object.keys(Z).forEach(q=>Object.keys(Z[q].areas||{}).forEach(k=>{if(areasDe[k])E(`área "${k}" repetida nos quizzes ${areasDe[k]} e ${q}`);areasDe[k]=q}));
Object.keys(Z).forEach(q=>{if(!B[q])E(`quiz "${q}" sem banco de perguntas`)});
Object.keys(B).forEach(q=>{
  if(!Z[q]){E(`banco "${q}" sem configuração de quiz`);return}
  const A=Z[q].areas||{};
  B[q].forEach((d,n)=>{
    const loc=`${q}#${n+1}${d&&d.id?" ("+d.id+")":""}`;
    if(!d||typeof d!=="object"){E(`${loc}: pergunta inválida`);return}
    if(!d.id||typeof d.id!=="string")E(`${loc}: sem id`);
    else{if(ids[d.id])E(`${loc}: id repetido (também em ${ids[d.id]})`);ids[d.id]=loc}
    if(!Object.prototype.hasOwnProperty.call(A,d.t))E(`${loc}: área "${d.t}" não existe em ${q}`);
    if(typeof d.q!=="string"||d.q.trim().length<8)E(`${loc}: enunciado vazio ou curto`);
    if(!Array.isArray(d.o)||(d.o.length!==2&&d.o.length!==4)){E(`${loc}: precisa de 2 (V/F) ou 4 alternativas`);return}
    if(!Number.isInteger(d.a)||d.a<0||d.a>=d.o.length)E(`${loc}: gabarito fora do intervalo`);
    const L=d.o.map(x=>String(x).trim().toLowerCase());
    if(d.o.some(x=>typeof x!=="string"||!x.trim()))E(`${loc}: alternativa vazia`);
    if(new Set(L).size!==L.length)E(`${loc}: alternativas repetidas`);
    if(d.o.length===2&&!d.v)W(`${loc}: 2 alternativas sem marcar v:1`);
    if(typeof d.e!=="string"||d.e.trim().length<5)W(`${loc}: sem explicação`);
    {const k=String(d.q).trim();if(qtxt[k])E(`${loc}: pergunta repetida (também em ${qtxt[k]})`);qtxt[k]=loc}
    if(d.n!==undefined&&![1,2,3].includes(d.n))E(`${loc}: nível "n" deve ser 1, 2 ou 3`);
    if(d.an&&win.ANIM&&!win.ANIM[d.an])E(`${loc}: animação "${d.an}" não existe`);
    if(d.f&&win.FIG&&!win.FIG[d.f])W(`${loc}: figura "${d.f}" não carregada neste teste`);
  });
  const n=B[q].length;console.log(`${q}: ${n} perguntas, ${Object.keys(A).length} áreas`);
});
avisos.slice(0,15).forEach(m=>console.log("aviso:",m));if(avisos.length>15)console.log(`... e mais ${avisos.length-15} avisos`);
if(erros.length){erros.forEach(m=>console.log("ERRO:",m));console.log(`\n${erros.length} erro(s).`);process.exit(1)}
console.log("Banco válido.");
