// Varre todos os bancos (app/perguntas-*.js) e cartões e lista divisões que não viram fração empilhada.
const fs=require("fs"),vm=require("vm"),path=require("path"),Eq=require("../app/eq.js");
const APP=path.join(__dirname,"..","app"),UN=new Set("m s h km kg g N C J W V A Pa L cm mm K mol min Hz cal rad atm kWh kW mA dB mmHg µC μC nC mC kΩ Ω °C".split(" "));
const RX=/(?<![\w])([A-Za-zΔεπρτωθλμΩ°µ][\wΔ₀-₉]*)\/([A-Za-zΔεπρτωθλμΩ°µ(][\wΔ₀-₉]*)/g,SUP=/[²³¹⁰⁴⁵⁶⁷⁸⁹⁻]/g;
const win={BANKS:{},QUIZZES:{}};const ctx=vm.createContext({window:win,document:{}});
for(const f of fs.readdirSync(APP).filter(f=>/^(perguntas|banco).*\.js$/.test(f))){try{vm.runInContext(fs.readFileSync(path.join(APP,f),"utf8"),ctx)}catch(e){}}
let n=0;const out=[];
function ver(loc,campo,t){if(!t)return;t=String(t);
 for(const m of t.matchAll(RX)){const a=m[1].replace(SUP,""),b=m[2].replace(SUP,"").replace(/^\(/,"");if(a.length<=4&&b.length<=4&&!(UN.has(a)&&UN.has(b))){out.push(loc+" "+campo+": «"+m[0]+"» sem espaços")}}
 for(const b of Eq.naoEmpilha(t))out.push(loc+" "+campo+": não empilha perto de «"+b.trim()+"»")}
for(const [q,bank] of Object.entries(win.BANKS))for(const d of bank){n++;ver(q+"/"+d.id,"e",d.e);ver(q+"/"+d.id,"h",d.h);for(const [k,v] of Object.entries(d.x||{}))ver(q+"/"+d.id,"x"+k,v)}
console.log(out.join("\n"));console.log("\n"+n+" questões verificadas, "+out.length+" aviso(s) de divisão");
