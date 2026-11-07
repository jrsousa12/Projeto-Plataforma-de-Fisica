/* Exporta bancos, áreas e animações (chave -> texto alternativo) como JSON. Uso: node dump_banco.js [pasta_app] */
const fs=require("fs"),vm=require("vm"),path=require("path");
const dir=process.argv[2]||path.join(__dirname,"..","app");
const win={};win.window=win;win.localStorage={getItem(){return null},setItem(){}};
const ctx=vm.createContext(win);
const arqs=fs.readdirSync(dir).filter(f=>/^(perguntas|quiz|figuras)(-.*)?\.js$/.test(f)).sort((a,b)=>{const r=f=>/^perguntas/.test(f)?0:f==="figuras.js"?1:2;return r(a)-r(b)||a.localeCompare(b)});
arqs.forEach(f=>vm.runInContext(fs.readFileSync(path.join(dir,f),"utf8"),ctx,{filename:f}));
const Z=win.QUIZZES||{},anim={};
Object.keys(win.ANIM||{}).forEach(k=>{anim[k]=String((win.ANIM[k]||{}).a||"")});
const quizzes={};Object.keys(Z).forEach(q=>quizzes[q]={areas:Z[q].areas||{}});
process.stdout.write(JSON.stringify({banks:win.BANKS||{},quizzes,anim}));
