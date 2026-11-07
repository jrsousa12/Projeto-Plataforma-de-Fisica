import json,re,sys,os,shutil
SRC='/home/claude/quiz/build/src/'
os.chdir('/home/claude/quiz/app')
sys.path.insert(0,SRC)
from newq import N
B=json.load(open(SRC+'_bank.json',encoding='utf-8'))
CALC={'q002','q005','q006','q014','q015','q023','q033','q037','q038','q046','q049','q051','q052','q058','q064','q067','q073','q077','q080','q084','q085','q088','q089','q093','q111'}
for d in B:
    if d['id'] in CALC: d['c']=1
nid=len(B)
for n,(t,q,o,a,h,e,x) in enumerate(N):
    d={"id":"q%03d"%(nid+n+1),"t":t,"q":q,"o":o,"a":a,"h":h,"e":e}
    d.update(x); B.append(d)
ids=[d['id'] for d in B]; assert len(ids)==len(set(ids))
# banco -> perguntas.js
js='/* Banco de perguntas: Eletrostática.\n   Campos: id, t (área), q (enunciado), o (alternativas), a (índice da correta), h (dica), e (explicação),\n   f (figura, opcional), v (1 = ordem fixa, usado em verdadeiro/falso), c (1 = exige cálculo; fica fora do modo cronometrado). */\nwindow.BANKS=window.BANKS||{};\nwindow.BANKS.eletro='+json.dumps(B,ensure_ascii=False,indent=0).replace('\n','')+';\n'
# quebra uma pergunta por linha para facilitar edição
js=js.replace('},{"id"','},\n{"id"')
open('perguntas-eletro.js','w',encoding='utf-8').write(js)
# figuras.js
fig=open(SRC+'_fig.txt',encoding='utf-8').read()
newfig=open(SRC+'_newfig.txt',encoding='utf-8').read()
assert fig.rstrip().endswith('};')
i=fig.rindex('};')
body=fig[:i].rstrip()
if not body.endswith(','): body+=','
fig2=body+'\n'+newfig.rstrip().rstrip(',')+'\n};\n'
fig2=fig2.replace('var FIG={','window.FIG={',1)
open('figuras.js','w',encoding='utf-8').write('/* Figuras (SVG) usadas nas perguntas. */\n(function(){"use strict";\n'+fig2+'})();\n')
# script.js
main=open(SRC+'_main.txt',encoding='utf-8').read()
nav=open(SRC+'_nav.txt',encoding='utf-8').read()
def rep(old,new,cnt=1):
    global main
    assert main.count(old)==cnt,(old[:60],main.count(old))
    main=main.replace(old,new)
rep('function poolSel(){return Q.map(function(_,k){return k}).filter(function(k){return sel.indexOf(Q[k].t)>=0})}',
    'function poolSel(){return Q.map(function(_,k){return k}).filter(function(k){return sel.indexOf(Q[k].t)>=0&&!(mode==="tempo"&&QZ.semCalculo&&(Q[k].c||Q[k].g))})}')
rep('if(ok)score+=(hinted&&mode==="tempo")?0.5:1;','if(window.FX)FX.hit(ok);if(ok)score+=(hinted&&mode==="tempo")?0.5:1;')
rep('var p=score/order.length;$("final")','var p=score/order.length;if(window.FX)FX.end(p);$("final")')
i0=main.index('$("share").onclick=function(){'); i1=main.index('};',i0)+2
main=main[:i0]+'$("share").onclick=function(){var b=$("share"),t="Fiz "+num(score)+"/"+order.length+" no quiz de eletrostática ("+(mode==="tempo"?"cronometrado":"modo estudo")+") em "+$("s3").textContent+". Tente também!"+(/^https?:$/.test(location.protocol)?" "+location.origin+location.pathname:"");var show=function(){var s=$("shtxt");if(!s){s=document.createElement("p");s.id="shtxt";s.className="hint";s.style.userSelect="all";b.parentNode.insertBefore(s,b.nextSibling)}s.textContent="Copie e envie: "+t};try{if(navigator.share){navigator.share({text:t}).catch(function(e){if(!e||e.name!=="AbortError")show()})}else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){b.textContent="Copiado!"}).catch(show)}else{show()}}catch(e){show()}};'+main[i1:]
# ---- multi-quiz: transforma o script em boot(id) ----
main=main.rstrip()
assert main.endswith('})();')
main=main[:-len('})();')]+'};'
rep('(function(){"use strict";\nvar FIG=window.FIG,Q=window.BANK.slice();','window.__boot=function(id){"use strict";\nvar QZ=window.QUIZZES[id],FIG=window.FIG,Q=window.BANKS[id].slice();')
rep('var ST=(function(){var P="eletriz:";','var mkST=function(P){')
rep('return {get:g,set:s,del:del,mig:mig}})();','return {get:g,set:s,del:del,mig:mig}};var ST=mkST(QZ.prefix),SH=mkST("eletriz:");')
rep('Q.forEach(function(d){LEG[hk(d.q)]=d.id});ST.mig();','if(id==="eletro"){Q.forEach(function(d){LEG[hk(d.q)]=d.id});ST.mig()}')
for k in ('theme','big','nick','pal'):
    main=main.replace('ST.get("%s"'%k,'SH.get("%s"'%k).replace('ST.set("%s"'%k,'SH.set("%s"'%k)
rep('var TN={el:"Eletrização",co:"Lei de Coulomb",ca:"Campo elétrico",po:"Potencial elétrico",eq:"Condutores em equilíbrio"},sel=Object.keys(TN);','var TN=QZ.areas,sel=Object.keys(TN);')
i=main.index('var CARDS=')+len('var CARDS='); j=main.index(',fi=0,fl=false;',i)
main=main[:i]+'QZ.cards.slice()'+main[j:]
i=main.index('Q.push(\n')+len('Q.push('); j=main.index('\n);\nvar G=null',i)+2
main=main[:i-len('Q.push(')]+'Q.push.apply(Q,QZ.gq(GQ,Rn,fc,sc,sup));'+main[j:]
rep('function renderCard(){$("cc").textContent="Cartão "+(fi+1)+" de "+CARDS.length+(fl?" · resposta":" · conceito");$("fc").textContent=fl?CARDS[fi][1]:CARDS[fi][0];$("fc").className="fc"+(fl?" back":"")}',
 'function renderCard(){var c=CARDS[fi],tx=fl?c[1]:c[0],f=$("fc");$("cc").textContent="Cartão "+(fi+1)+" de "+CARDS.length+(fl?" · resposta":" · conceito");if(c[2]&&window.AV&&AV[c[2]]){f.innerHTML=\'<svg class="av" viewBox="0 0 100 100" role="img" aria-label="Retrato ilustrado">\'+AV[c[2]]+\'</svg><span></span>\';f.lastChild.textContent=tx}else{f.textContent=tx}f.className="fc"+(fl?" back":"")}')
k0=main.index('$("msg").textContent=p===1?'); k1=main.index(';\n',k0)
main=main[:k0]+'$("msg").textContent=p===1?QZ.msgs[0]:p>=0.7?QZ.msgs[1]:p>=0.4?QZ.msgs[2]:QZ.msgs[3]'+main[k1:]
rep('no quiz de eletrostática (','no quiz de "+QZ.nome.toLowerCase()+" (')
rep('Lista de exercícios: eletrostática','Lista de exercícios: \'+QZ.nome.toLowerCase()+\'')
rep('$("hst").innerHTML="<span>"+Q.length+" questões</span><span>5 áreas</span><span>3 modos</span>";',
 '$("hst").innerHTML="<span>"+Q.length+" questões</span><span>"+Object.keys(TN).length+" áreas</span><span>3 modos</span>";document.documentElement.setAttribute("data-quiz",id);document.title="Quiz: "+QZ.nome;document.querySelector(".hero h1").textContent=QZ.nome;document.querySelector(".hero p").textContent=QZ.subt;document.querySelector("details.sum").innerHTML=QZ.resumo;$("go2").querySelector("small").textContent=QZ.tempoDesc;')
rep('qt=setInterval(function(){var l=TL*1000-(Date.now()-qs);if(l<=0){$("tfill").style.width="0%";pick(-1);return}$("tfill").style.width=(l/(TL*10))+"%"','var dq=Q[order[i]],TLc=((dq.c||dq.g)&&QZ.tempoCalc)?QZ.tempoCalc:TL;qt=setInterval(function(){var l=TLc*1000-(Date.now()-qs);if(l<=0){$("tfill").style.width="0%";pick(-1);return}$("tfill").style.width=(l/(TLc*10))+"%"')
# ---- botões de ajuste (fonte, tema, cores) passam para o carregador, para funcionar já na tela de escolha ----
import re as _re
main=_re.sub(r'\$\("fz"\)\.onclick=function.*?\n','',main,count=1)
main=_re.sub(r'\$\("th"\)\.onclick=function.*?\n','',main,count=1)
main=main.replace('var sv=SH.get("theme","");if(sv)document.documentElement.setAttribute("data-theme",sv);if(SH.get("big",false))document.documentElement.classList.add("big");','')
main=_re.sub(r'var PALS=\["indigo","floresta","grafite"\],pv=SH\.get\("pal","indigo"\);document\.documentElement\.setAttribute\("data-pal",pv\);\n','',main,count=1)
main=_re.sub(r'\$\("pal"\)\.onclick=function.*?\n','',main,count=1)
assert 'SH.get("theme"' not in main and '$("pal").onclick' not in main and '$("fz").onclick' not in main
# botão Voltar também na tela inicial do quiz (volta para a escolha)
rep('$("navb").classList.toggle("off",v==="inicio")','$("navb").classList.remove("off");$("homebtn").hidden=v==="inicio"')
rep('$("back").onclick=function(){if(running()){askExit("inicio")}else if(!NOH&&stk.length>1){history.back()}else{goHome()}};','$("back").onclick=function(){if(running()){askExit("inicio")}else if(curV==="inicio"){if(!NOH)location.href=location.pathname;else location.reload()}else if(!NOH&&stk.length>1){history.back()}else{goHome()}};')
rep('document.documentElement.setAttribute("data-quiz",id);','document.documentElement.setAttribute("data-quiz",id);$("navb").classList.remove("off");$("homebtn").hidden=true;')
# ---- lista/prova configurável ----
i=main.index('function renderSheet(){'); j=main.index('function openOnly(')
main=main[:i]+open(SRC+'_sheet.txt',encoding='utf-8').read()+main[j:]
# ---- perfil do aluno e treino adaptativo ----
i=main.index('function openOnly('); main=main[:i]+open(SRC+'_perfil.txt',encoding='utf-8').read()+main[i:]
rep("$(\"histbody\").innerHTML=o||'<p>Ainda não há dados. Termine um quiz para ver sua evolução por área.</p>'}","$(\"histbody\").innerHTML=o||'<p>Ainda não há dados. Termine um quiz para ver sua evolução por área.</p>';perfilUI()}")
rep('var d=Q[order[i]],oi=k<0?-1:perm[k],ok=nok!==undefined?nok:oi===d.a,bs=$("opts").children;','var d=Q[order[i]],oi=k<0?-1:perm[k],ok=nok!==undefined?nok:oi===d.a,bs=$("opts").children;if(window.Perfil&&!d.g)window.Perfil.registrar(d.id,ok);')
open('script.js','w',encoding='utf-8').write('/* Lógica do quiz. Depende dos bancos (perguntas-*.js), das configurações (quiz-*.js), das figuras e de fx.js. */\n'+main+'\n\n/* Barra de navegação inferior e seleção de áreas */\n'+nav.strip()+'\n'+open(SRC+'_loader.txt',encoding='utf-8').read())
# index.html
html=open(SRC+'_skeleton.html',encoding='utf-8').read()
html=html.replace('<body>','<body class="pre">',1)
html=html.replace('<title>Quiz: Eletrostática</title>','<title>Quiz de Física</title>')
html=html.replace('<link rel="stylesheet" href="style.css">','<meta name="theme-color" content="#5b3df5">\n<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icon.svg" type="image/svg+xml">\n<link rel="apple-touch-icon" href="icon-192.png">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<link rel="stylesheet" href="style.css">',1)
assert 'id="fz"' in html
html=html.replace('<button id="fz"','<button id="snd" aria-label="Ligar ou desligar o som" aria-pressed="false">🔇 Som</button><button id="fz"',1)
html=html.replace('<h1>Eletrostática</h1><p>Quiz de física para o ensino médio.</p>','<h1>Quiz de Física</h1><p>Escolha o assunto para começar.</p>')
old='30 s por pergunta e ranking'
assert old in html
html=html.replace(old,'30 s por pergunta, com ranking')
land='<section class="card" id="landing"><div class="cnt">Escolha o quiz</div><div class="modes"><button class="btn" data-q="eletro">Eletrostática<small>Eletrização, Lei de Coulomb, campo e potencial elétrico</small></button><button class="btn alt" data-q="fluidos">Mecânica dos Fluidos<small>Densidade, pressão, pressão atmosférica e Torricelli</small></button><button class="btn alt" data-q="termo">Termologia<small>Temperatura, dilatação, calorimetria e propagação do calor</small></button></div></section>\n  '
html=html.replace('<section class="card" id="home">',land+'<section class="card" id="home">',1)
html=html.replace('</body>','<script src="perguntas-eletro.js"></script>\n<script src="perguntas-fluidos.js"></script>\n<script src="perguntas-termo.js"></script>\n<script src="firebase-config.js"></script>\n<script src="perfil.js"></script>\n<script src="nuvem.js"></script>\n<script src="quiz-eletro.js"></script>\n<script src="quiz-fluidos.js"></script>\n<script src="quiz-termo.js"></script>\n<script src="banco-proprio.js"></script>\n<script src="banco-extra.js"></script>\n<script src="figuras.js"></script>\n<script src="figuras-fluidos.js"></script>\n<script src="figuras-termo.js"></script>\n<script src="fx.js"></script>\n<script src="script.js"></script>\n</body>')
i=html.index('id="mopen"'); j=html.index('</button>',i)+len('</button>')
open('index.html','w',encoding='utf-8').write(html)
# configuração do quiz de eletrostática
gq=open(SRC+'_gq_eletro.txt',encoding='utf-8').read() if False else open(SRC+'eletro_gq.txt',encoding='utf-8').read()
import fluidos_build as FB
cards=json.load(open(SRC+'eletro_cards.json',encoding='utf-8'))
resumo=open(SRC+'eletro_resumo.html',encoding='utf-8').read()
TNE={"el":"Eletrização","co":"Lei de Coulomb","ca":"Campo elétrico","po":"Potencial elétrico","eq":"Condutores em equilíbrio"}
open('quiz-eletro.js','w',encoding='utf-8').write(FB.quiz_js("eletro","Eletrostática","Quiz de física para o ensino médio.","eletriz:",TNE,cards,resumo,'function(GQ,Rn,fc,sc,sup){return [\n'+gq+'\n];}',
  ["Perfeito! Você domina os processos de eletrização.","Muito bem! Revise só os pontos que errou.","Bom começo. Vale rever a diferença entre contato e indução.","Revise os conceitos básicos e tente de novo. Você chega lá!"],
  "30 s por pergunta, só conceitos, com ranking",True,0))
FB.run()
import termo_build as TB
TB.run()
print('ok',len(B),'perguntas')
