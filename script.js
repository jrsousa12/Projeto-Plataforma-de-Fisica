/* Lógica do quiz. Depende dos bancos (perguntas-*.js), das configurações (quiz-*.js), das figuras e de fx.js. */
/* Meta diária de questões: compartilhada entre os quizzes e guardada só neste aparelho. */
window.Meta=(function(){var K="eletriz:meta";
 function dk(d){d=d||new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}
 function rd(){try{var v=JSON.parse(localStorage.getItem(K));if(v&&typeof v==="object")return v}catch(e){}return null}
 function get(){var m=rd()||{goal:10,day:dk(),n:0,met:[]};if(!(m.goal>0))m.goal=10;if(!Array.isArray(m.met))m.met=[];if(m.day!==dk()){m.day=dk();m.n=0}return m}
 function put(m){try{localStorage.setItem(K,JSON.stringify(m))}catch(e){}}
 function marca(m){if(m.n>=m.goal&&m.met.indexOf(m.day)<0)m.met=m.met.concat(m.day).slice(-60)}
 function inc(){var m=get();m.n++;marca(m);put(m);ui();return m.n===m.goal}
 function goal(n){var m=get();m.goal=n;marca(m);put(m);ui()}
 function sem(m){var c=0,d=new Date();for(var k=0;k<7;k++){var x=new Date(d);x.setDate(d.getDate()-k);if(m.met.indexOf(dk(x))>=0)c++}return c}
 function ui(){var m=get(),el=document.getElementById("metabar"),ch=document.getElementById("mtc"),pc=Math.min(100,Math.round(100*m.n/m.goal));
  if(ch){ch.textContent="🎯 "+Math.min(m.n,m.goal)+"/"+m.goal;ch.classList.toggle("done",m.n>=m.goal)}
  if(!el)return;
  el.querySelector(".mt").textContent=m.n>=m.goal?"✓ Meta de hoje cumprida! "+m.n+" questões respondidas.":"🎯 Meta de hoje: "+m.n+" de "+m.goal+" questões";
  el.querySelector(".mpb i").style.width=pc+"%";el.querySelector(".mpb").setAttribute("aria-valuenow",String(pc));
  var w=sem(m);el.querySelector(".ms").textContent=w?"Meta cumprida em "+w+(w===1?" dia":" dias")+" dos últimos 7.":"Responda questões para começar a contar.";
  el.querySelectorAll("button[data-g]").forEach(function(b){var on=+b.getAttribute("data-g")===m.goal;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on?"true":"false")})}
 return {get:get,inc:inc,goal:goal,ui:ui}})();
window.__boot=function(id){"use strict";
var QZ=window.QUIZZES[id],FIG=window.FIG,Q=window.BANKS[id].slice();
/* Armazenamento versionado: todas as chaves ficam sob o prefixo "eletriz:" e há migração do formato antigo. */
var LEG={};
var mkST=function(P){
function g(k,d){try{var v=localStorage.getItem(P+k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function s(k,v){try{localStorage.setItem(P+k,JSON.stringify(v))}catch(e){}}
function del(k){try{localStorage.removeItem(P+k)}catch(e){}}
function mig(){if(g("ver",0)>=2)return;try{var L=function(k){return localStorage.getItem(k)},b=L("eletriz-book");
if(b){var o=JSON.parse(b),n={};Object.keys(o).forEach(function(k){if(LEG[k])n[LEG[k]]=o[k]});s("book",n)}
var h=L("eletriz-hist");if(h)s("hist",JSON.parse(h));var r=L("eletrizacao-rank");if(r)s("rank",JSON.parse(r));
if(L("eletriz-nick"))s("nick",L("eletriz-nick"));if(L("eletriz-theme"))s("theme",L("eletriz-theme"));if(L("eletriz-big"))s("big",L("eletriz-big")==="1")}catch(e){}s("ver",2)}
return {get:g,set:s,del:del,mig:mig}};var ST=mkST(QZ.prefix),SH=mkST("eletriz:");
if(id==="eletro"){Q.forEach(function(d){LEG[hk(d.q)]=d.id});ST.mig()}
var shuf=function(a){a=a.slice();for(var n=a.length-1;n>0;n--){var j=Math.floor(Math.random()*(n+1)),t=a[n];a[n]=a[j];a[j]=t}return a};
var perm=[];
function poolSel(){var b=Q.map(function(_,k){return k}).filter(function(k){return sel.indexOf(Q[k].t)>=0&&!(mode==="tempo"&&QZ.semCalculo&&(Q[k].c||Q[k].g))});if(lvl){var f=b.filter(function(k){return (Q[k].n||2)===lvl});if(f.length)return f}return b}
function pickSet(n){n=n||10;var pool=poolSel(),pk=[];if($("reinf").checked){pk=shuf(bkList().filter(function(k){return pool.indexOf(k)>=0})).slice(0,Math.floor(n*0.4))}var rest=shuf(pool.filter(function(k){return pk.indexOf(k)<0}));return shuf(pk.concat(rest.slice(0,n-pk.length)))}
var $=function(id){return document.getElementById(id)};
var order=[],i=0,score=0,res=[],locked=false,hinted=false,t0=0,timer=null,pz=0,parked=false,qrem=0,qrest=0,qTL=30,autoP=false;
function fmt(s){var m=Math.floor(s/60),r=s%60;return (m<10?"0":"")+m+":"+(r<10?"0":"")+r}
function num(n){return String(n).replace(".",",")}
function tick(){if(pz)return;var sc2=Math.floor((Date.now()-t0)/1000);if(mode==="simulado"){var r=2400-sc2;$("tm").textContent=fmt(Math.max(r,0));if(r<=0&&!$("quiz").classList.contains("hidden")){finish()}}else{$("tm").textContent=fmt(sc2)}}
function dots(){
  var h="";
  for(var k=0;k<order.length;k++){h+='<div class="dot '+(k<res.length?(res[k].ok?"ok":"bad"):(k===i?"cur":""))+'"></div>'}
  $("dots").innerHTML=h;
}
function elapsed(){return Math.max(0,Math.floor(((pz||Date.now())-t0)/1000))}
function save(){try{if(!order.length||$("quiz").classList.contains("hidden"))return;ST.set("sess",{v:1,m:mode,o:order,r:res,sc:score,st:streak,f:isFull,el:elapsed(),qr:qrem,at:Date.now()})}catch(e){}}
function setPz(p){var q=$("quiz"),b=$("tpause");if(!b)return;if(p&&!pz)pz=Date.now();else if(!p&&pz){t0+=Date.now()-pz;pz=0;tick()}q.classList.toggle("pausado",!!pz);b.setAttribute("aria-pressed",pz?"true":"false");b.textContent=pz?"▶ Continuar":"⏸ Pausar";b.setAttribute("aria-label",pz?"Continuar o tempo":"Pausar o tempo");if(pz)save()}
$("tpause").onclick=function(){if(!locked||pz)setPz(!pz);else setPz(!pz)};
/* Pausa o relógio sem sair da tela (também o tempo da pergunta no modo cronometrado) e devolve se pausou agora. */
function qPause(){if($("quiz").classList.contains("hidden")||pz)return false;if(mode==="tempo"&&!locked){qrem=Math.max(1,qTL*1000-(Date.now()-qs));clearInterval(qt)}else qrem=0;setPz(true);return true}
function qResume(){setPz(false);if(mode==="tempo"&&qrem>0&&!locked){qs=Date.now()-(qTL*1000-qrem);qrem=0;runQt()}else qrem=0}
window.addEventListener("pagehide",save);
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden"){if(running()&&qPause())autoP=true;save()}else if(autoP){autoP=false;if(running())qResume()}});
function start(list,full,S){
  isFull=full!==false;order=list;i=0;score=0;res=[];streak=0;pz=0;parked=false;autoP=false;qrem=0;qrest=S&&S.qr>0?S.qr:0;setPz(false);seqUi();if(window.Meta)Meta.ui();
  if(S){i=S.r.length;score=S.sc;res=S.r;streak=S.st||0}
  ["home","book","sheet","cards","hist","fontes"].forEach(function(id){$(id).classList.add("hidden")});$("bar").classList.remove("hidden");$("dots").classList.remove("hidden");
  $("end").classList.add("hidden");$("quiz").classList.remove("hidden");setHash("quiz");$("exitq").classList.add("hidden");
  t0=S?Date.now()-S.el*1000:Date.now();clearInterval(timer);timer=setInterval(tick,1000);tick();$("tpause").classList.toggle("hidden",mode!=="estudo");
  if(S&&i>=order.length){finish();return}
  show();
}
var rvk=-1;
function rvExit(){rvk=-1;$("quiz").classList.remove("revmode");$("rvw").classList.add("hidden");$("rvw").innerHTML=""}
function rvShow(k){
 rvk=k;var r=res[k],d=Q[r.qi],g=r.g,w=$("rvw"),h="";w.classList.remove("hidden");$("quiz").classList.add("revmode");$("quiz").setAttribute("data-a",d.t);
 h+='<p class="rvh">Revendo pergunta '+(k+1)+' de '+order.length+' · '+esc(TN[d.t])+' <span class="rvs '+(r.ok?"ok":"no")+'">'+(r.ok?"✓ certa":"✗ errada")+'</span></p><p class="q">'+esc(g?g.q:d.q)+'</p>';
 if(d.f&&FIG[d.f])h+='<div class="fig"><svg viewBox="0 0 320 140" role="img" aria-label="'+esc(FIG[d.f].a)+'">'+FIG[d.f].s+'</svg></div>';
 if(!g){h+='<div class="opts">';d.o.forEach(function(t,n){var c="opt"+(n===d.a?" right":"")+(n===r.pick&&!r.ok?" wrong":"");h+='<button type="button" class="'+c+'" disabled><span class="l">'+"ABCD".charAt(n)+'</span><span>'+esc(t)+'</span></button>'});h+='</div>'}
 h+='<div class="fb'+(r.ok?"":" no")+'"><b>Explicação</b><p id="rvp"></p></div><div class="rvn"><button type="button" class="btn alt" id="rvb"'+(k===0?" disabled":"")+'>← Anterior</button><button type="button" class="btn alt" id="rvf"'+(k>=i-1?" disabled":"")+'>Seguinte →</button></div><button type="button" class="btn" id="rvx">Voltar à pergunta '+(i+1)+'</button>';
 w.innerHTML=h;fmtE($("rvp"),g?g.e+" Resposta: "+g.at:d.e,!!(g||d.c));
 $("rvb").onclick=function(){rvShow(k-1)};$("rvf").onclick=function(){rvShow(k+1)};$("rvx").onclick=function(){rvExit();window.scrollTo(0,0)};
 window.scrollTo(0,0)}
$("prev").onclick=function(){if(i>0)rvShow(i-1)};
function show(){
  rvExit();$("prev").classList.toggle("hidden",!(mode==="estudo"&&i>0));
  locked=false;hinted=false;$("fonteq").classList.add("hidden");$("fpop").classList.add("hidden");$("fonteq").setAttribute("aria-expanded","false");
  var d=Q[order[i]];G=d.g?d.g():null;$("quiz").setAttribute("data-a",d.t);$("quiz").classList.remove("qin");void $("quiz").offsetWidth;$("quiz").classList.add("qin");
  perm=d.v?d.o.map(function(_,n){return n}):shuf(d.o.map(function(_,n){return n}));
  $("count").textContent="Pergunta "+(i+1)+" de "+order.length+" · "+TN[d.t]+" · "+(d.id?"Cód. "+String(d.id).toUpperCase()+" ":"");var nvb=document.createElement("span"),nn=d.n||2;nvb.className="nvl n"+nn;nvb.textContent=LVN[nn];$("count").appendChild(nvb);
  $("pts").textContent=num(score);
  $("q").textContent=G?G.q:d.q;
  var fg=$("fig");
  if(d.f){fg.innerHTML='<svg viewBox="0 0 320 140" role="img" aria-label="'+FIG[d.f].a+'">'+FIG[d.f].s+'</svg>';fg.classList.remove("hidden")}else{fg.classList.add("hidden");fg.innerHTML=""}
  $("fb").innerHTML="";$("hint").innerHTML="";
  $("hbtn").classList.remove("hidden");$("hbtn").textContent=mode==="tempo"?"Ver dica (vale meio ponto)":"Ver dica";if(mode==="simulado")$("hbtn").classList.add("hidden");startQ();
  $("next").classList.add("hidden");
  var box=$("opts");box.innerHTML="";if(G){box.innerHTML='<input id="num" type="text" inputmode="text" enterkeyhint="done" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="off" placeholder="Sua resposta em '+G.u+' (margem de 2%)" class="fld"><button class="btn" id="nsend" style="margin-top:0">Responder</button>';$("nsend").onclick=submitNum;$("num").onkeydown=function(e){if(e.key==="Enter")submitNum()}}
  perm.forEach(function(oi,k){var t=d.o[oi];
    var b=document.createElement("button");b.className="opt";
    var l=document.createElement("span");l.className="l";l.textContent="ABCD".charAt(k);
    var s=document.createElement("span");s.textContent=t;
    b.appendChild(l);b.appendChild(s);b.onclick=function(){pick(k)};box.appendChild(b);
  });
  dots();save();
}
function capUi(w,svg,A){var C=A.cap,k,ol=document.createElement("ol"),sp=(window.AN&&AN.sp)||1,els=svg.querySelectorAll("text"),bb=0,li=[];
 for(k=els.length-1;k>=0;k--){if(/(^|\s)cp\d+(\s|$)/.test(els[k].getAttribute("class")||""))els[k].parentNode.removeChild(els[k])}
 try{var b=svg.getBBox();bb=Math.ceil(b.y+b.height)+8}catch(e){}
 svg.setAttribute("viewBox","0 0 320 "+Math.min(A.h,Math.max(C.y-4,bb)));
 ol.className="ancap";
 C.list.forEach(function(t){var l=document.createElement("li");t.split("|").forEach(function(x){var sp2=document.createElement("span");sp2.textContent=x;l.appendChild(sp2)});ol.appendChild(l);li.push(l)});
 w.insertBefore(ol,w.querySelector(".anrow"));
 var cur=-2;return function(ms){var t=ms/1000,n=0;C.times.forEach(function(x,j){if(x*sp<=t+0.001)n=j});if(n===cur)return;cur=n;li.forEach(function(l,j){l.className=j===n?"on":j<n?"done":""})}}
function anCtl(w,svg,A,onEnd){
  var pb=w.querySelector(".anp"),rv=w.querySelector(".anr"),rg=w.querySelector(".anrg"),T=Math.round((A.T||8)*1000*((window.AN&&AN.sp)||1)),paused=false,raf=0,cu=A.cap?capUi(w,svg,A):null;
  function all(){try{return svg.getAnimations?svg.getAnimations({subtree:true}):[]}catch(e){return[]}}
  function setP(p){paused=p;all().forEach(function(a){try{p?a.pause():a.play()}catch(e){}});pb.textContent=p?"▶ Continuar":"⏸ Pausar";pb.setAttribute("aria-pressed",p?"true":"false")}
  function loop(){if(!w.isConnected)return;if(!paused){var a=all()[0];if(a&&a.currentTime!=null)var ct=Math.min(T,Math.round(a.currentTime%(T+1)));rg.value=String(ct);if(cu)cu(ct);if(onEnd&&ct>=T-60){var f=onEnd;onEnd=null;f()}}raf=requestAnimationFrame(loop)}
  function go(){window.AN.run(svg,A);paused=false;pb.textContent="⏸ Pausar";pb.setAttribute("aria-pressed","false");rg.value="0";cancelAnimationFrame(raf);if(all().length){w.classList.remove("static");loop()}else{w.classList.add("static")}}
  rg.max=String(T);
  pb.onclick=function(){setP(!paused)};
  rv.onclick=go;
  rg.oninput=function(){setP(true);var v=+rg.value;all().forEach(function(a){try{a.currentTime=v}catch(e){}})};
  go();
}
function pick(k,nok){
  if(locked)return;locked=true;clearInterval(qt);
  var d=Q[order[i]],oi=k<0?-1:perm[k],ok=nok!==undefined?nok:oi===d.a,bs=$("opts").children;if(window.Perfil&&!d.g)window.Perfil.registrar(d.id,ok);var mf=window.Meta?window.Meta.inc():false;
  for(var n=0;n<bs.length;n++){bs[n].disabled=true;if(perm[n]===d.a)bs[n].classList.add("right")}
  if(!ok&&k>=0)bs[k].classList.add("wrong");if(ok&&bs[k])bs[k].classList.add("win");
  if(window.FX)FX.hit(ok);if(ok)score+=(hinted&&mode==="tempo")?0.5:1;
  res.push({qi:order[i],pick:oi,ok:ok,hint:hinted,g:G,v:NV});streak=ok?streak+1:0;seqUi();bkUpdate(order[i],ok);if(ok){var ch=$("pts").parentNode;ch.classList.remove("bump");void ch.offsetWidth;ch.classList.add("bump")}if(mode==="simulado"){$("pts").textContent="–";if(i<order.length-1){i++;show()}else{finish()}return}
  $("pts").textContent=num(score);
  $("hbtn").classList.add("hidden");$("fonteq").classList.remove("hidden");
  $("fb").innerHTML='<div class="fb'+(ok?"":" no")+'"><b>'+(ok?(hinted&&mode==="tempo"?"Correto, com dica! (meio ponto)":"Correto!"):(k===-1?"Tempo esgotado.":"Não foi dessa vez."))+'</b><p></p></div>';
  fmtE($("fb").querySelector("p"),G?G.e+" Resposta: "+G.at:d.e,!!(G||d.c));if(d.an&&window.ANIM&&window.ANIM[d.an]){var A=window.ANIM[d.an],w=document.createElement("div");w.className="fig anim";w.innerHTML='<svg viewBox="0 0 320 '+A.h+'" role="img" aria-label="'+A.a+'">'+A.s+'</svg><div class="anrow"><button type="button" class="btn alt anp" aria-pressed="false">⏸ Pausar</button><button type="button" class="btn alt anr">↻ Ver de novo</button></div><label class="anlb">Linha do tempo<input type="range" class="anrg" min="0" step="50" value="0" aria-label="Linha do tempo da animação"></label><details class="antx"><summary>Descrição em texto</summary><p></p></details>';w.querySelector(".antx p").textContent=A.a;$("fb").appendChild(w);anCtl(w,w.querySelector("svg"),A,function(){setTimeout(function(){var n=$("next");if(n&&!n.classList.contains("hidden"))n.scrollIntoView({block:"center",behavior:"smooth"})},500)})}
  if(!ok&&!G&&oi>=0){var fp=document.createElement("p");fp.className="fbx";Eq.set(fp,"Você marcou: "+d.o[oi]+(d.x&&d.x[oi]?" — "+d.x[oi]:""));$("fb").querySelector(".fb").appendChild(fp)}
  if(mf){var mp=document.createElement("p");mp.className="msg ok";mp.textContent="🎯 Meta do dia cumprida! Muito bem!";$("fb").appendChild(mp)}
  $("next").textContent=i<order.length-1?"Próxima pergunta":"Ver resultado";
  $("next").classList.remove("hidden");$("fb").scrollIntoView({block:"start",behavior:"smooth"});
  dots();save();
}
$("next").onclick=function(){if(i<order.length-1){i++;show()}else{finish()}};
function resUi(secs,right){
 var n=order.length,p=score/n,pc=Math.round(100*p),rf=$("rfill"),T=p===1?["🏆","Perfeito!"]:p>=.9?["🥇","Excelente"]:p>=.7?["🥈","Muito bom"]:p>=.4?["🥉","No caminho certo"]:["📚","Hora de revisar"];
 rf.style.strokeDashoffset="100";rf.setAttribute("class","rf "+(p>=.7?"g":p>=.4?"m":"b"));
 requestAnimationFrame(function(){requestAnimationFrame(function(){rf.style.strokeDashoffset=String(100-Math.max(0,Math.min(100,pc)))})});
 $("rpct").textContent=pc+"% de acerto";$("rbadge").textContent=T[0];$("rtitle").textContent=T[1];
 var bs=0,c=0;res.forEach(function(r){c=r.ok?c+1:0;if(c>bs)bs=c});$("s4").textContent=bs;
 $("rdots").innerHTML=res.map(function(r,k){return '<span class="rd '+(r.ok?"ok":"bad")+'" title="Pergunta '+(k+1)+(r.ok?": certa":": errada")+'">'+(k+1)+'</span>'}).join("");
 var ag={};res.forEach(function(r){var t=Q[r.qi].t;ag[t]=ag[t]||[0,0];ag[t][1]++;if(r.ok)ag[t][0]++});
 var ks=Object.keys(ag).filter(function(t){return ag[t][1]>=1}),pcs=function(t){return ag[t][0]/ag[t][1]},best=null,worst=null;
 ks.forEach(function(t){if(!best||pcs(t)>pcs(best)||(pcs(t)===pcs(best)&&ag[t][1]>ag[best][1]))best=t;if(!worst||pcs(t)<pcs(worst)||(pcs(t)===pcs(worst)&&ag[t][1]>ag[worst][1]))worst=t});
 var h="";if(best&&pcs(best)>0)h+='<div><b>Ponto forte:</b> '+esc(TN[best])+' ('+Math.round(100*pcs(best))+'%)</div>';
 if(worst&&pcs(worst)<1&&worst!==best||(worst&&pcs(worst)<1&&ks.length===1))h+='<div class="w"><b>Para reforçar:</b> '+esc(TN[worst])+' ('+Math.round(100*pcs(worst))+'%)</div>';
 h+='<div class="n"><b>Ritmo:</b> '+Math.max(1,Math.round(secs/n))+' s por pergunta em média</div>';
 $("rins").innerHTML=h}
function finish(){
  clearInterval(timer);clearInterval(qt);ST.del("sess");pz=0;setPz(false);
  var secs=Math.floor((Date.now()-t0)/1000),right=res.filter(function(r){return r.ok}).length,hints=res.filter(function(r){return r.hint}).length;
  $("quiz").classList.add("hidden");$("end").classList.remove("hidden");setHash("resultado",true);$("exitq").classList.add("hidden");
  $("final").textContent=num(score)+" / "+order.length;resUi(secs,right);
  if(isFull&&mode==="tempo"){saveRank(secs)}rank($("rank2"));
  var ag={};res.forEach(function(r){var t=Q[r.qi].t;ag[t]=ag[t]||[0,0];ag[t][1]++;if(r.ok)ag[t][0]++});histAdd(ag);
  $("areas").innerHTML='<div class="rk"><h3>Desempenho por área</h3>'+Object.keys(ag).map(function(t){var pc=Math.round(100*ag[t][0]/ag[t][1]);return '<div class="ab"><div class="t"><span>'+esc(TN[t])+'</span><span>'+ag[t][0]+' de '+ag[t][1]+' · '+pc+'%</span></div><div class="tr"><i class="'+(pc>=70?"b1":pc>=50?"b2":"b3")+'" data-w="'+pc+'"></i></div></div>'}).join("")+'</div>';
  requestAnimationFrame(function(){requestAnimationFrame(function(){$("areas").querySelectorAll("i[data-w]").forEach(function(e){e.style.width=e.getAttribute("data-w")+"%"})})});
  $("s1").textContent=right+" de "+order.length;$("s2").textContent=hints;$("s3").textContent=fmt(secs);
  var p=score/order.length;if(window.FX)FX.end(p);$("final").classList.toggle("party",p>=0.7);
  $("msg").textContent=p===1?QZ.msgs[0]:p>=0.7?QZ.msgs[1]:p>=0.4?QZ.msgs[2]:QZ.msgs[3];
  var wrong=res.filter(function(r){return !r.ok}),h="";
  wrong.forEach(function(r){
    var d=Q[r.qi];
    h+='<div class="rv"><h3></h3><p><b>Você marcou:</b> <span class="a"></span></p><p><b>Correta:</b> <span class="b"></span></p><p class="x"></p></div>';
  });
  $("rev").innerHTML=wrong.length?'<h3 style="font-family:Georgia,serif;margin:16px 0 0">Revise estas perguntas</h3>'+h:'';
  var cards=$("rev").querySelectorAll(".rv");
  wrong.forEach(function(r,n){
    var d=Q[r.qi],c=cards[n];
    c.querySelector("h3").textContent=d.q;
    c.querySelector(".a").textContent=r.pick<0?"Sem resposta (tempo esgotado)":d.o[r.pick];
    c.querySelector(".b").textContent=d.o[d.a];
    Eq.set(c.querySelector(".x"),d.e.replace(/\n/g," "));if(r.g){c.querySelector("h3").textContent=r.g.q;c.querySelector(".a").textContent=String(r.v).replace(".",",");c.querySelector(".b").textContent=r.g.at;Eq.set(c.querySelector(".x"),r.g.e)}
  });
  $("redo").classList.toggle("hidden",!wrong.length);
  window.__wrong=wrong.map(function(r){return r.qi});
  dots();
}
$("redo").onclick=function(){start(window.__wrong.slice(),false)};
var mode="estudo",TL=30,isFull=true;var streak=0,seqUi=function(){var c=$("stk");if(!c)return;if(mode==="simulado"||streak<2){c.classList.add("hidden");return}c.textContent="🔥 "+streak+" seguidas";c.classList.remove("hidden","bump");void c.offsetWidth;c.classList.add("bump")};
function getRank(){return ST.get("rank",[])}
function saveRank(secs){try{var r=getRank();r.push({n:nick,s:score,t:secs});r.sort(function(a,b){return b.s-a.s||a.t-b.t});ST.set("rank",r.slice(0,20))}catch(e){}}
function rank(el){var r=getRank().slice(0,5);el.innerHTML='<div class="rk"><h3>Melhores pontuações (cronometrado)</h3>'+(r.length?'<ol>'+r.map(function(x){return '<li>'+esc(x.n||"Anônimo")+': <b>'+num(x.s)+'</b> pontos · '+fmt(x.t)+'</li>'}).join("")+'</ol><small>Salvo neste navegador.</small>':'<small>Nenhuma pontuação ainda. Jogue uma rodada!</small>')+'</div>'}
function goHome(){clearInterval(timer);clearInterval(qt);if(!parked)ST.del("sess");["quiz","end","bar","dots","book","sheet","cards","hist","fontes"].forEach(function(id){$(id).classList.add("hidden")});$("home").classList.remove("hidden");rank($("rank"));$("bopen").textContent="Caderno de erros ("+bkList().length+")";setHash("inicio");$("exitq").classList.add("hidden");retUi()}
var qt=null,qs=0,nick="Anônimo";
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function runQt(){var tb=$("tbar");qt=setInterval(function(){var l=qTL*1000-(Date.now()-qs);if(l<=0){$("tfill").style.width="0%";pick(-1);return}$("tfill").style.width=(l/(qTL*10))+"%";tb.classList.toggle("low",l<8000)},200)}
function startQ(){
  clearInterval(qt);var tb=$("tbar");
  if(mode!=="tempo"){tb.classList.add("hidden");return}
  tb.classList.remove("hidden");tb.classList.remove("low");qs=Date.now();$("tfill").style.width="100%";
  var dq=Q[order[i]];qTL=((dq.c||dq.g)&&QZ.tempoCalc)?QZ.tempoCalc:TL;
  if(qrest>0){qs=Date.now()-(qTL*1000-qrest);qrest=0}
  runQt();
}
function begin(m){mode=m;nick=($("nick").value||"").trim()||"Anônimo";SH.set("nick",nick);start(pickSet(m==="simulado"?20:10),true)}
var TN=QZ.areas,sel=Object.keys(TN);
Object.keys(TN).forEach(function(k){var b=document.createElement("button");b.className="chip2 on";b.setAttribute("data-a",k);b.textContent=TN[k];b.setAttribute("aria-pressed","true");b.onclick=function(){var on=sel.indexOf(k)>=0;if(on&&sel.length===1)return;sel=on?sel.filter(function(x){return x!==k}):sel.concat(k);b.classList.toggle("on",!on);b.setAttribute("aria-pressed",String(!on));lvUi()};$("chips").appendChild(b)});
var lvl=+ST.get("lvl",0)||0,LVN=["Todos","Fácil","Médio","Difícil"];
function lvCount(n){return Q.filter(function(d){return sel.indexOf(d.t)>=0&&(!n||(d.n||2)===n)}).length}
function lvUi(){var box=$("lvs");if(!box)return;box.innerHTML="";LVN.forEach(function(t,n){var b=document.createElement("button");b.type="button";b.className="chip2 lv"+(lvl===n?" on":"");b.setAttribute("aria-pressed",lvl===n?"true":"false");b.textContent=t+" · "+lvCount(n);b.onclick=function(){lvl=n;ST.set("lvl",n);lvUi()};box.appendChild(b)})}
lvUi();
function hk(q){var h=0;for(var n=0;n<q.length;n++)h=(h*31+q.charCodeAt(n))|0;return String(h)}
var HI={};Q.forEach(function(d,k){HI[d.id]=k});
function bkGet(){return ST.get("book",{})}
function bkSet(o){ST.set("book",o)}
function bkUpdate(qi,ok){if(Q[qi].g)return;var o=bkGet(),k=Q[qi].id,x=o[k];if(!ok){x=x||{w:0,r:0};x.w++;x.r=0;o[k]=x}else if(x){x.r++;if(x.r>=2)delete o[k]}bkSet(o)}
function bkList(){var o=bkGet();return Object.keys(o).filter(function(k){return HI[k]!==undefined}).sort(function(a,b){return o[b].w-o[a].w}).map(function(k){return HI[k]})}
function renderBook(){var l=bkList(),o=bkGet(),h="";l.forEach(function(qi){var d=Q[qi];h+='<div class="rv"><h3>'+esc(d.q)+'</h3><p><b>Correta:</b> '+esc(d.o[d.a])+'</p><p>'+Eq.html(d.e.replace(/\n/g," "))+'</p><p style="color:var(--muted)">Erros: '+o[d.id].w+' · '+TN[d.t]+'</p></div>'});$("bookbody").innerHTML=h||'<p>Seu caderno está vazio. As questões que você errar aparecem aqui e saem depois de 2 acertos seguidos.</p>';$("btrain").classList.toggle("hidden",!l.length);$("bclear").classList.toggle("hidden",!l.length)}
function sheetOpts(){
  if($("sopts"))return;
  var d=document.createElement("div");d.id="sopts";d.className="noprt";
  d.innerHTML='<div class="cnt">Montar lista ou prova</div><div style="display:flex;gap:10px;flex-wrap:wrap"><div style="flex:1;min-width:120px"><label class="nl" for="sn">Questões</label><select id="sn" class="fld"><option>5</option><option selected>10</option><option>15</option><option>20</option></select></div><div style="flex:2;min-width:160px"><label class="nl" for="sfm">Formato</label><select id="sfm" class="fld"><option value="lista">Lista de exercícios</option><option value="prova">Prova (com cabeçalho)</option></select></div></div><label class="nl" for="sh">Escola e turma (cabeçalho da prova)</label><input id="sh" class="fld" maxlength="70" autocomplete="off" placeholder="Ex.: Escola Antônio Teodoro Leal · 1º ano A"><label class="nl" style="display:block;margin:6px 0"><input type="checkbox" id="sg" checked> Incluir gabarito comentado em página separada</label><label class="nl" style="display:block;margin:6px 0 12px"><input type="checkbox" id="scc" checked> Incluir perguntas de cálculo</label>';
  $("sheetbody").parentNode.insertBefore(d,$("sheetbody"));
  ["sn","sfm","sg","scc"].forEach(function(i){$(i).onchange=renderSheet});$("sh").oninput=renderSheet;
}
function renderSheet(){
  sheetOpts();
  var n=+$("sn").value,prova=$("sfm").value==="prova",calc=$("scc").checked,porA={};
  Q.forEach(function(d,k){if(sel.indexOf(d.t)>=0&&!d.g&&(calc||!d.c)){(porA[d.t]=porA[d.t]||[]).push(k)}});
  Object.keys(porA).forEach(function(a){porA[a]=shuf(porA[a])});
  var ids=[],ks=Object.keys(porA),i=0;
  while(ids.length<n&&ks.length){var a=ks[i%ks.length];if(porA[a].length)ids.push(porA[a].shift());else{ks.splice(i%ks.length,1);continue}i++}
  ids=shuf(ids);
  var topo=prova?'<div style="border:1.5px solid var(--ink);padding:10px 12px;margin-bottom:12px"><p style="margin:0 0 6px"><b>'+esc($("sh").value||"Escola ______________________  Turma ______")+'</b></p><p style="margin:0 0 6px">'+esc(QZ.nome)+' · Prova</p><p style="margin:0">Nome: ______________________________________ Data: ___/___/_____ Nota: ______</p></div><p style="margin:0 0 10px;font-size:.9rem">Marque apenas uma alternativa em cada questão.</p>':'<h3 style="margin:0 0 4px;font-family:Georgia,serif">Lista de exercícios: '+QZ.nome.toLowerCase()+'</h3><p style="margin:0 0 10px;color:var(--muted);font-size:.9rem">Áreas: '+sel.map(function(k){return TN[k]}).join(", ")+'</p>',h=topo,g='',res=[];
  ids.forEach(function(qi,x){var d=Q[qi],pm=d.v?d.o.map(function(_,y){return y}):shuf(d.o.map(function(_,y){return y})),L="ABCD".charAt(pm.indexOf(d.a));res.push((x+1)+"-"+L);
    h+='<div class="sq"><p><b>'+(x+1)+'.</b> '+esc(d.q)+'</p>'+(d.f?'<div class="fig sf"><svg viewBox="0 0 320 140">'+FIG[d.f].s+'</svg></div>':'')+'<ol type="A">'+pm.map(function(oi){return '<li>'+esc(d.o[oi])+'</li>'}).join("")+'</ol></div>';
    g+='<p><b>'+(x+1)+'. '+L+'</b> '+Eq.html(d.e.replace(/\n/g," "))+'</p>'});
  if(!ids.length)h+='<p class="msg neu">Selecione ao menos uma área na tela inicial.</p>';
  $("sheetbody").innerHTML=h+($("sg").checked&&ids.length?'<div class="pb"><h3 style="font-family:Georgia,serif">Gabarito'+(prova?' · '+esc($("sh").value||""):'')+'</h3><p><b>'+res.join(" · ")+'</b></p><h3 style="font-family:Georgia,serif">Comentários</h3>'+g+'</div>':'');
}
/* perfil e treino adaptativo (tela "Meu desempenho") */
function relatorio(){
  var P=window.Perfil.ler(),L=[],h="";
  Object.keys(P).forEach(function(id){var e=P[id];if(HI[id]===undefined||e[0]<2)return;var pc=Math.round(100*e[1]/e[0]);if(pc<70)L.push({i:HI[id],pc:pc,n:e[0]})});
  L.sort(function(a,b){return a.pc-b.pc||b.n-a.n});
  var H=ST.get("hist",[]),sem={};H.forEach(function(x){var k=Math.floor(x.d/6048e5);sem[k]=sem[k]||[0,0];Object.keys(x.a).forEach(function(t){sem[k][0]+=x.a[t][0];sem[k][1]+=x.a[t][1]})});
  var ks=Object.keys(sem).sort().slice(-4);
  h+='<p style="margin:16px 0 4px"><b>O que melhorar</b></p>';
  if(!L.length)h+='<p class="msg neu" style="margin:0">Nenhuma pergunta com acerto abaixo de 70% (entre as que você tentou 2 vezes ou mais). Continue praticando!</p>';
  else h+='<p class="msg neu" style="margin:0 0 6px">Perguntas em que você mais erra:</p><ol style="padding-left:22px;margin:0;font-size:.93rem">'+L.slice(0,5).map(function(x){var q=Q[x.i].q;return '<li>'+esc(q.length>90?q.slice(0,90)+"…":q)+' <small style="color:var(--muted)">('+x.pc+'% em '+x.n+' tentativas)</small></li>'}).join('')+'</ol><button class="btn alt" id="trpior" style="margin-top:8px">Treinar estas perguntas</button>';
  if(ks.length>1)h+='<p style="margin:12px 0 4px"><b>Evolução por semana</b></p>'+ks.map(function(k){var p=Math.round(100*sem[k][0]/sem[k][1]);return '<p style="margin:4px 0 0;font-size:.9rem">Semana de '+new Date(k*6048e5).toLocaleDateString("pt-BR")+': '+p+'% ('+sem[k][0]+' de '+sem[k][1]+')</p><div class="hb"><i style="width:'+p+'%"></i></div>'}).join('');
  window.__pior=L.slice(0,5).map(function(x){return x.i});
  return h}
function contaHtml(){
  var N=window.Nuvem;if(!N||!N.ativo())return '<p class="msg neu" style="margin-top:14px">Seu histórico fica guardado neste aparelho. Para levar a outro aparelho, use o caderno de erros (exportar e importar).</p>';
  var h='<p style="margin:16px 0 4px"><b>Minha conta</b></p>';
  if(N.logado()){var u=N.ultima();h+='<p class="msg ok" style="margin:0 0 6px">Conectado com o código <b>'+esc(N.codigo())+'</b>.'+(u?' Última sincronização: '+new Date(u).toLocaleString("pt-BR")+'.':'')+'</p><button class="btn alt" id="nsinc">Sincronizar agora</button><button class="btn alt" id="nsair">Sair da conta</button>'}
  else h+='<p class="msg neu" style="margin:0 0 6px">Entre com o código que o professor entregou para guardar seu histórico na nuvem e usá-lo em qualquer aparelho.</p><label class="nl" for="ncod">Seu código</label><input id="ncod" class="fld" autocomplete="off" autocapitalize="characters" maxlength="12" placeholder="Ex.: K7M2-QX9P"><button class="btn" id="nent">Entrar</button>';
  return h+'<p class="msg neu" id="nmsg" style="display:none;margin-top:6px"></p>'}
function perfilUI(){
  var el=document.createElement("div");el.id="perfilbox";
  var R=window.Perfil.resumo(Q),o="",pior=null;
  Object.keys(TN).forEach(function(k){var r=R[k];if(!r)return;var pc=r.n?Math.round(100*r.ac/r.n):null;if(pc!==null&&(pior===null||pc<pior.pc))pior={k:k,pc:pc};
    o+='<p style="margin:6px 0 0"><b>'+esc(TN[k])+'</b>: '+r.vistas+' de '+r.tot+' perguntas vistas, '+r.dom+' dominadas</p>'});
  var nv=Object.keys(window.Perfil.ler()).length;
  el.innerHTML='<p style="margin:16px 0 4px"><b>Perguntas dominadas</b></p><p class="msg neu" style="margin:0 0 6px">Dominada: 2 ou mais tentativas e pelo menos 80% de acerto.</p>'+o+
   (pior&&pior.pc<70?'<p class="msg no" style="margin-top:10px">Para reforçar: <b>'+esc(TN[pior.k])+'</b> ('+pior.pc+'% de acerto).</p>':'')+
   '<button class="btn" id="tadapt" style="margin-top:10px">Treino adaptativo (10 perguntas)</button><p class="msg neu" style="margin-top:6px">Sorteia mais perguntas das que você errou, ainda não viu ou não revê há tempo.</p>'+
   relatorio()+contaHtml();
  ($("hp2")||$("histbody")).appendChild(el);
  $("tadapt").onclick=function(){mode="estudo";var ids=poolSel().map(function(k){return {k:k,id:Q[k].id}}).filter(function(x){return !Q[x.k].g}),s=window.Perfil.sugerir(ids,10);if(s.length)start(s,false)};
  var nm=function(t,ok){var m=$("nmsg");if(!m)return;m.textContent=t;m.className="msg "+(ok?"ok":"no");m.style.display="block"};
  if($("trpior"))$("trpior").onclick=function(){mode="estudo";if(window.__pior.length)start(window.__pior.slice(),false)};
  if($("nent"))$("nent").onclick=function(){nm("Entrando…",true);window.Nuvem.entrar($("ncod").value).then(function(){renderHist();nm("Conectado! Seu histórico está sincronizado.",true)}).catch(function(e){nm(e.message,false)})};
  if($("nsinc"))$("nsinc").onclick=function(){nm("Sincronizando…",true);window.Nuvem.sincronizar().then(function(r){if(r){renderHist();nm("Sincronizado.",true)}else nm("Não foi possível sincronizar agora.",false)})};
  if($("nsair"))$("nsair").onclick=function(){window.Nuvem.sair();renderHist()};
}
function openOnly(id){if(id!=="quiz"&&!parked)ST.del("sess");["home","quiz","end","book","sheet","cards","hist","fontes"].forEach(function(x){$(x).classList.add("hidden")});["bar","dots"].forEach(function(x){$(x).classList.add("hidden")});$(id).classList.remove("hidden");window.scrollTo(0,0);setHash(VMAP[id])}
$("bopen").onclick=function(){openOnly("book");renderBook()};
$("bback").onclick=goHome;$("sback").onclick=goHome;
$("bclear").onclick=function(){bkSet({});renderBook()};
$("btrain").onclick=function(){var l=bkList();if(l.length){mode="estudo";start(shuf(l).slice(0,10),false)}};
$("sopen").onclick=function(){openOnly("sheet");renderSheet()};
$("snew").onclick=renderSheet;
$("sprint").onclick=function(){try{window.print()}catch(e){}};
$("go").onclick=function(){begin("estudo")};
var Rn=function(a){return a[Math.floor(Math.random()*a.length)]},fc=function(x){return (+x.toPrecision(3)+"").replace(".",",")};
var sup=function(n){return String(n).replace(/[-0-9]/g,function(c){return "⁻⁰¹²³⁴⁵⁶⁷⁸⁹".charAt("-0123456789".indexOf(c))})};
var sc=function(x){if(!x)return "0";var e=Math.floor(Math.log10(Math.abs(x)));if(e>=-2&&e<=3)return fc(x);return fc(x/Math.pow(10,e))+" × 10"+sup(e)};
var gn=0;
function GQ(t,id,h,f){return {t:t,o:[],a:0,q:"Questão numérica: "+id,h:h,e:"",g:f,id:"n"+(++gn)}}
Q.push.apply(Q,QZ.gq(GQ,Rn,fc,sc,sup));;
var G=null,NV=0;
function submitNum(){if(locked)return;var v=parseFloat(($("num").value||"").replace("−","-").replace(",","."));if(isNaN(v))return;NV=v;var ok=Math.abs(v-G.ans)<=Math.abs(G.ans)*0.02;$("num").disabled=true;$("nsend").classList.add("hidden");pick(-2,ok)}
var CARDS=QZ.cards.slice(),fi=0,fl=false;
function mkFace(cl,c,tx){var e=document.createElement("span");e.className=cl;if(c[2]&&window.AV&&AV[c[2]]){var w=document.createElement("span");w.innerHTML='<svg class="av" viewBox="0 0 100 100" role="img" aria-label="Retrato ilustrado">'+AV[c[2]]+'</svg>';e.appendChild(w.firstChild)}var t=document.createElement("span");Eq.set(t,tx);e.appendChild(t);return e}
function fmtE(el,t,calc){el.textContent="";if(!calc&&t.indexOf("\n")<0){Eq.set(el,t);return}
 var L=[];if(t.indexOf("\n")>=0){L=t.split("\n")}else t.replace(/([.!?])\s+(?=[A-ZΔΦΣ(−0-9])/g,"$1\u0001").split("\u0001").forEach(function(sn){sn.split(" → ").forEach(function(p,k){var q=p.replace(/\.$/,"").split(" = ");if(q.length>2){L.push((k?"→ ":"")+q[0]+" = "+q[1]);for(var j=2;j<q.length;j++)L.push("= "+q[j])}else L.push((k?"→ ":"")+p)})});
 L.forEach(function(x,k){var d=document.createElement("span");d.className="eln";Eq.set(d,x);el.appendChild(d)});el.classList.add("calc")}
function renderCard(){var c=CARDS[fi],f=$("fc");$("cc").textContent="Cartão "+(fi+1)+" de "+CARDS.length+(fl?" · resposta":" · conceito");
 if(f.getAttribute("data-k")!==c[0]){f.setAttribute("data-k",c[0]);f.innerHTML="";var i=document.createElement("span");i.className="fci";i.appendChild(mkFace("fcf",c,c[0]));i.appendChild(mkFace("fcb",c,c[1]));f.appendChild(i);f.className="fc nt"+(fl?" back":"");void f.offsetWidth;f.classList.remove("nt")}
 else f.className="fc"+(fl?" back":"");
 var fa=f.querySelector(".fcf"),fb=f.querySelector(".fcb");fa.setAttribute("aria-hidden",fl?"true":"false");fb.setAttribute("aria-hidden",fl?"false":"true")}
function flip(){fl=!fl;renderCard()}
$("fopen").onclick=function(){openOnly("cards");fi=0;fl=false;renderCard()};
$("fc").onclick=flip;$("cflip").onclick=flip;
var swT=0,swP=null;
function swapCard(fn){var f=$("fc");
 if(swP){clearTimeout(swT);var p=swP;swP=null;p()}
 if(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches){fn();return}
 f.classList.remove("sin");f.classList.add("sout");swP=fn;
 swT=setTimeout(function(){swP=null;fn();f.classList.remove("sout");void f.offsetWidth;f.classList.add("sin");swT=setTimeout(function(){f.classList.remove("sin")},420)},170)}
$("cnext").onclick=function(){swapCard(function(){fi=(fi+1)%CARDS.length;fl=false;renderCard()})};
$("cshuf").onclick=function(){swapCard(function(){CARDS=shuf(CARDS);fi=0;fl=false;renderCard()})};
$("cback").onclick=goHome;
function histAdd(ag){if(!isFull)return;var h=ST.get("hist",[]);h.push({d:Date.now(),a:ag,s:score,n:order.length});ST.set("hist",h.slice(-200))}
function graf(h,t){
 var tot=0,ac=0,k,o="";for(k in t){ac+=t[k][0];tot+=t[k][1]}
 var pc=tot?Math.round(100*ac/tot):0,dm=function(d){return new Date(d).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})};
 o+='<div class="gk"><div><b>'+h.length+'</b>rodadas</div><div><b>'+tot+'</b>questões</div><div><b>'+pc+'%</b>de acerto</div></div>';
 var L=h.slice(-12),n=L.length,W=320,H=150,l=42,r=26,tp=20,bt=28,pw=W-l-r,ph=H-tp-bt;
 var X=function(q){return n>1?l+q*pw/(n-1):l+pw/2},Y=function(v){return tp+(100-v)*ph/100};
 var P=L.map(function(x){return Math.max(0,Math.min(100,Math.round(100*x.s/x.n)))});
 var g='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Gráfico de linha do aproveitamento nas últimas '+n+' rodadas: de '+P[0]+'% a '+P[n-1]+'%">';
 [0,50,100].forEach(function(v){g+='<line class="gl" x1="'+l+'" x2="'+(W-r)+'" y1="'+Y(v)+'" y2="'+Y(v)+'"/><text x="'+(l-5)+'" y="'+(Y(v)+4)+'" text-anchor="end">'+v+'%</text>'});
 var pts=P.map(function(v,q){return X(q).toFixed(1)+","+Y(v).toFixed(1)});
 if(n>1)g+='<polygon class="ar" points="'+X(0).toFixed(1)+","+Y(0)+" "+pts.join(" ")+" "+X(n-1).toFixed(1)+","+Y(0)+'"/><polyline class="ln draw" pathLength="1" points="'+pts.join(" ")+'"/>';
 P.forEach(function(v,q){g+='<circle class="pt" cx="'+X(q).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="4"/>';if(q===n-1||n<=6)g+='<text class="gv" x="'+X(q).toFixed(1)+'" y="'+(Y(v)-9).toFixed(1)+'" text-anchor="middle">'+v+'%</text>'});
 var step=Math.max(1,Math.ceil(n/5));
 L.forEach(function(x,q){if(q%step===0||q===n-1)g+='<text x="'+X(q).toFixed(1)+'" y="'+(H-8)+'" text-anchor="middle">'+dm(x.d)+'</text>'});
 g+='</svg>';
 o+='<div class="gr"><h4>Evolução por rodada</h4>'+g+'<p class="lg">Aproveitamento (%) nas últimas '+n+' rodadas completas.</p></div>';
 var ks=Object.keys(TN).filter(function(q){return t[q]});
 if(ks.length){var RH=40,hh=ks.length*RH+4,b='<svg viewBox="0 0 320 '+hh+'" role="img" aria-label="Gráfico de barras do acerto por área: '+ks.map(function(q){return TN[q]+" "+Math.round(100*t[q][0]/t[q][1])+"%"}).join("; ")+'">';
  ks.forEach(function(q,m){var p=Math.round(100*t[q][0]/t[q][1]),y=m*RH+2,nm=TN[q].length>28?TN[q].slice(0,27)+"…":TN[q],c=p>=70?"b1":p>=50?"b2":"b3";
   b+='<text x="0" y="'+(y+12)+'">'+esc(nm)+'</text><text class="gv" x="320" y="'+(y+12)+'" text-anchor="end">'+p+'% · '+t[q][0]+'/'+t[q][1]+'</text><rect class="bk" x="0" y="'+(y+19)+'" width="320" height="11" rx="5.5"/><rect class="'+c+' grow" x="0" y="'+(y+19)+'" width="'+Math.max(11,3.2*p)+'" height="11" rx="5.5"/>'});
  o+='<div class="gr"><h4>Acerto por área</h4>'+b+'</svg><p class="lg"><span class="sw b1"></span> 70% ou mais <span class="sw b2"></span> 50% a 69% <span class="sw b3"></span> abaixo de 50%</p></div>'}
 var dias=[],day=function(d){var z=new Date(d);return z.getFullYear()+"-"+z.getMonth()+"-"+z.getDate()},now=Date.now(),mx=0,any=false;
 for(var q=6;q>=0;q--){var d=now-q*864e5;dias.push({k:day(d),d:d,v:0})}
 h.forEach(function(x){dias.forEach(function(z){if(z.k===day(x.d)){z.v+=x.n;any=true}})});
 if(any){dias.forEach(function(z){if(z.v>mx)mx=z.v});var CW=320,CH=140,cb=26,ct=22,cw=CW/7,bw=cw*.56,c2='<svg viewBox="0 0 '+CW+' '+CH+'" role="img" aria-label="Gráfico de colunas das questões respondidas nos últimos 7 dias: '+dias.map(function(z){return z.v}).join(", ")+'">';
  c2+='<line class="gl" x1="0" x2="'+CW+'" y1="'+(CH-cb)+'" y2="'+(CH-cb)+'"/>';
  dias.forEach(function(z,m){var hgt=mx?Math.round((CH-cb-ct)*z.v/mx):0,x0=m*cw+(cw-bw)/2;
   c2+='<rect class="cl'+(z.v?"":" z")+' gup" x="'+x0.toFixed(1)+'" y="'+(CH-cb-(z.v?hgt:2))+'" width="'+bw.toFixed(1)+'" height="'+(z.v?hgt:2)+'" rx="4"/>'+(z.v?'<text class="gv" x="'+(m*cw+cw/2).toFixed(1)+'" y="'+(CH-cb-hgt-5)+'" text-anchor="middle">'+z.v+'</text>':'')+'<text x="'+(m*cw+cw/2).toFixed(1)+'" y="'+(CH-8)+'" text-anchor="middle">'+new Date(z.d).toLocaleDateString("pt-BR",{weekday:"short"}).replace(".","").slice(0,3)+'</text>'});
  o+='<div class="gr"><h4>Questões nos últimos 7 dias</h4>'+c2+'</svg><p class="lg">Quantidade de questões respondidas por dia.</p></div>'}
 return o}
function overview(){
 var D=[["eletro","Eletrostática","eletriz:"],["fluidos","Mecânica dos Fluidos","fluidos:"],["termo","Termologia","termo:"],["onda","Ondulatória: Som","onda:"],["optica","Óptica Geométrica","optica:"],["mec","Mecânica: Cinemática e Dinâmica","mec:"],["edin","Eletrodinâmica","edin:"]],rows=[],T=0,A=0,Rd=0;
 D.forEach(function(d){var H=[];try{H=JSON.parse(localStorage.getItem(d[2]+"hist")||"[]")}catch(e){}if(!Array.isArray(H))H=[];var q=0,a=0;H.forEach(function(x){if(!x||!x.a)return;Object.keys(x.a).forEach(function(k){a+=x.a[k][0];q+=x.a[k][1]})});rows.push({n:d[1],id:d[0],r:H.length,q:q,a:a});T+=q;A+=a;Rd+=H.length});
 if(!T)return '<p>Ainda não há dados. Termine um quiz para ver a comparação entre os três temas.</p>';
 var o='<div class="gk"><div><b>'+Rd+'</b>rodadas</div><div><b>'+T+'</b>questões</div><div><b>'+Math.round(100*A/T)+'%</b>de acerto</div></div><div class="gr"><h4>Acerto em cada quiz</h4>';
 rows.forEach(function(r){var p=r.q?Math.round(100*r.a/r.q):0;o+='<div class="ab"><div class="t"><span>'+esc(r.n)+(r.id===id?" (este)":"")+'</span><span>'+(r.q?r.a+' de '+r.q+' · '+p+'%':'sem dados')+'</span></div><div class="tr"><i class="'+(p>=70?"b1":p>=50?"b2":"b3")+'" style="width:'+p+'%"></i></div></div>'});
 o+='<p class="lg">Soma das rodadas completas de cada quiz neste aparelho.</p></div><div class="gr"><h4>Rodadas por quiz</h4>';
 var mx=Math.max.apply(null,rows.map(function(r){return r.r}))||1;
 rows.forEach(function(r){o+='<div class="ab"><div class="t"><span>'+esc(r.n)+'</span><span>'+r.r+(r.r===1?" rodada":" rodadas")+'</span></div><div class="tr"><i class="b0" style="width:'+Math.round(100*r.r/mx)+'%"></i></div></div>'});
 return o+'</div>'}
function renderHist(){var h=ST.get("hist",[]);var t={},o="",ln="";h.forEach(function(x){Object.keys(x.a).forEach(function(k){t[k]=t[k]||[0,0];t[k][0]+=x.a[k][0];t[k][1]+=x.a[k][1]})});
Object.keys(TN).forEach(function(k){if(t[k]){var p=Math.round(100*t[k][0]/t[k][1]);ln+='<p style="margin:8px 0 0"><b>'+TN[k]+'</b>: '+p+'% ('+t[k][0]+' de '+t[k][1]+')</p>'}});
if(h.length){o+=graf(h,t)+'<details class="sum" style="margin-top:12px"><summary>Ver os números</summary>'+ln+'<p style="margin:10px 0 4px"><b>Últimas rodadas</b></p><ol style="padding-left:22px;margin:0">'+h.slice(-8).reverse().map(function(x){return '<li>'+new Date(x.d).toLocaleDateString("pt-BR")+': '+String(x.s).replace(".",",")+' de '+x.n+'</li>'}).join("")+'</ol></details>'}
$("histbody").innerHTML='<div class="htabs" role="tablist" aria-label="Seções do desempenho"><button type="button" class="chip2 lv htab on" role="tab" aria-selected="true" data-p="1">'+esc(QZ.nome)+'</button><button type="button" class="chip2 lv htab" role="tab" aria-selected="false" data-p="0">Todos os quizzes</button><button type="button" class="chip2 lv htab" role="tab" aria-selected="false" data-p="2">Conta e treino</button></div><div class="hp" id="hp1">'+(o||'<p>Ainda não há dados. Termine um quiz para ver sua evolução por área.</p>')+'</div><div class="hp hidden" id="hp0">'+overview()+'</div><div class="hp hidden" id="hp2"></div>';
$("histbody").querySelectorAll(".htab").forEach(function(b){b.onclick=function(){var p=b.getAttribute("data-p");$("histbody").querySelectorAll(".htab").forEach(function(x){var on=x===b;x.classList.toggle("on",on);x.setAttribute("aria-selected",on?"true":"false")});["hp0","hp1","hp2"].forEach(function(k){$(k).classList.toggle("hidden",k!=="hp"+p)})}});
perfilUI()}
$("hopen").onclick=function(){openOnly("hist");renderHist()};$("hback").onclick=goHome;
$("hclear").onclick=function(){ST.del("hist");renderHist()};
$("mopen").onclick=function(){begin("simulado")};
$("bexp").onclick=function(){var c=btoa(JSON.stringify(bkGet()));$("bkio").value=c;try{navigator.clipboard.writeText(c).catch(function(){})}catch(e){}$("bmsg").textContent="Código gerado. Copie e cole em outro aparelho."};
$("bimp").onclick=function(){try{var o=JSON.parse(atob($("bkio").value.trim())),c=bkGet();Object.keys(o).forEach(function(k0){var k=LEG[k0]||k0;if(!c[k]||c[k].w<o[k0].w)c[k]=o[k0]});bkSet(c);renderBook();$("bmsg").textContent="Caderno importado."}catch(e){$("bmsg").textContent="Código inválido."}};
$("hbtn").onclick=function(){if(locked)return;var d=Q[order[i]];if(!hinted){hinted=true;$("hint").innerHTML='<div class="hint"></div>';Eq.set($("hint").firstChild,"Dica: "+d.h);if(d.g||d.o.length<4){$("hbtn").classList.add("hidden")}else{$("hbtn").textContent="Eliminar duas alternativas"}}else{var bs=$("opts").children,n=0;for(var k=0;k<bs.length&&n<2;k++){if(perm[k]!==d.a&&!bs[k].disabled){bs[k].disabled=true;bs[k].style.opacity=".35";n++}}$("hbtn").classList.add("hidden")}};
$("go2").onclick=function(){begin("tempo")};
$("share").onclick=function(){var b=$("share"),t="Fiz "+num(score)+"/"+order.length+" no quiz de "+QZ.nome.toLowerCase()+" ("+(mode==="tempo"?"cronometrado":"modo estudo")+") em "+$("s3").textContent+". Tente também!"+(/^https?:$/.test(location.protocol)?" "+location.origin+location.pathname:"");var show=function(){var s=$("shtxt");if(!s){s=document.createElement("p");s.id="shtxt";s.className="hint";s.style.userSelect="all";b.parentNode.insertBefore(s,b.nextSibling)}s.textContent="Copie e envie: "+t};try{if(navigator.share){navigator.share({text:t}).catch(function(e){if(!e||e.name!=="AbortError")show()})}else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){b.textContent="Copiado!"}).catch(show)}else{show()}}catch(e){show()}};
$("prt").onclick=function(){try{window.print()}catch(e){}};
$("nick").value=SH.get("nick","");
$("again").onclick=function(){start(pickSet(mode==="simulado"?20:10))};
/* Navegação: cada tela tem um endereço #nome, então o botão voltar do celular e do navegador funciona. */
var VW={inicio:1,quiz:1,resultado:1,caderno:1,lista:1,cartoes:1,desempenho:1,fontes:1},VMAP={home:"inicio",book:"caderno",sheet:"lista",cards:"cartoes",hist:"desempenho"};
var curV="inicio",stk=["inicio"],skip=false,pend=null;
var NOH=!/^(https?|file):$/.test(location.protocol);function setHash(v,rep){if(curV!==v){curV=v;if(rep){stk[stk.length-1]=v}else{stk.push(v)}if(!NOH&&location.hash!=="#"+v){skip=true;try{if(rep){location.replace("#"+v)}else{location.hash=v}}catch(e){skip=false}}}$("navb").classList.remove("off");$("homebtn").hidden=v==="inicio"}
function running(){return curV==="quiz"&&!$("quiz").classList.contains("hidden")}
function askExit(v){pend=v;$("exitq").classList.remove("hidden");window.scrollTo(0,0);$("exstay").focus()}
function navTo(v){if(v==="caderno"){openOnly("book");renderBook()}else if(v==="lista"){openOnly("sheet");renderSheet()}else if(v==="cartoes"){openOnly("cards");fi=0;fl=false;renderCard()}else if(v==="desempenho"){openOnly("hist");renderHist()}else if(v==="fontes"){openFontes()}else if(v==="quiz"){retomar()}else{goHome()}}
window.addEventListener("hashchange",function(){if(skip){skip=false;return}var v=location.hash.slice(1)||"inicio";if(!VW[v]||v===curV)return;
if(running()){skip=true;try{history.forward()}catch(e){skip=false;location.hash="quiz"}askExit(v);return}
if(stk.length>1&&stk[stk.length-2]===v){stk.pop()}else{stk.push(v)}curV=v;navTo(v)});
$("back").onclick=function(){if(running()){askExit("inicio")}else if(curV==="inicio"){if(!NOH)location.href=location.pathname;else location.reload()}else if(!NOH&&stk.length>1){history.back()}else{goHome()}};
$("homebtn").onclick=function(){if(running()){askExit("inicio")}else{goHome()}};
$("exstay").onclick=function(){$("exitq").classList.add("hidden")};
$("exleave").onclick=function(){$("exitq").classList.add("hidden");clearInterval(qt);clearInterval(timer);stk.pop();curV="";var v=pend||"inicio";pend=null;navTo(v)};
document.addEventListener("keydown",function(e){if(e.key!=="Escape")return;if(!$("exitq").classList.contains("hidden")){$("exstay").click()}else if(curV!=="inicio"){$("back").click()}});
$("gohome").onclick=goHome;
/* Fontes de referência: o quiz em andamento fica guardado (com o tempo pausado) e pode ser retomado da tela inicial da área. */
function sessOk(S){return !!(S&&S.v===1&&Array.isArray(S.o)&&Array.isArray(S.r)&&S.o.length&&S.o.every(function(k){return k>=0&&k<Q.length})&&Date.now()-S.at<432e5&&(S.m==="estudo"||S.m==="tempo"||S.m==="simulado"))}
function parkQuiz(){if(!running())return false;qPause();save();parked=true;autoP=false;clearInterval(timer);clearInterval(qt);return true}
function openFontes(){if(running())parkQuiz();["home","quiz","end","book","sheet","cards","hist","bar","dots","exitq"].forEach(function(x){$(x).classList.add("hidden")});Fontes.tela($("fbody"),id);$("fontes").classList.remove("hidden");retUi();window.scrollTo(0,0);setHash("fontes")}
function retomar(){var S=ST.get("sess",null);if(!sessOk(S)){goHome();return}mode=S.m;nick=SH.get("nick","")||"Anônimo";start(S.o,S.f,S)}
function retUi(){var S=ST.get("sess",null),ok=sessOk(S),b=$("retq"),v=$("fvolta");[b,v].forEach(function(x){if(!x)return;x.classList.toggle("hidden",!ok);if(ok){x.textContent="";var t=document.createElement("span");t.textContent="↩ Voltar ao quiz atual";x.appendChild(t);var sm=document.createElement("small"),n=Math.min(S.r.length+1,S.o.length),el=S.el||0;sm.textContent="Pergunta "+n+" de "+S.o.length+" · "+(S.m==="simulado"?"restam "+fmt(Math.max(0,2400-el)):"tempo "+fmt(el))+" (pausado)";x.appendChild(sm)}})}
$("retq").onclick=retomar;$("fvolta").onclick=retomar;
$("fonteq").onclick=function(e){e.stopPropagation();var p=$("fpop"),abre=p.classList.contains("hidden");if(abre)Fontes.quadro(p,id,openFontes);p.classList.toggle("hidden",!abre);$("fonteq").setAttribute("aria-expanded",abre?"true":"false")};
document.addEventListener("click",function(e){var p=$("fpop");if(p&&!p.classList.contains("hidden")&&!p.contains(e.target)&&e.target!==$("fonteq")){p.classList.add("hidden");$("fonteq").setAttribute("aria-expanded","false")}});
window.QzFonte={abrir:openFontes,voltar:function(){$("back").click()}};
var DBGF=location.hash==="#debug",TSTF=location.hash==="#teste",SS=ST.get("sess",null);
goHome();
try{if(sessOk(SS)){mode=SS.m;nick=SH.get("nick","")||"Anônimo";start(SS.o,SS.f,SS)}}catch(e){goHome()}
$("hst").innerHTML="<span>"+Q.length+" questões</span><span>"+Object.keys(TN).length+" áreas</span><span>3 modos</span>";document.documentElement.setAttribute("data-quiz",id);$("navb").classList.remove("off");$("homebtn").hidden=true;document.title="Quiz: "+QZ.nome;document.querySelector(".hero h1").textContent=QZ.nome;document.querySelector(".hero p").textContent=QZ.subt;document.querySelector("details.sum").innerHTML=QZ.resumo;$("go2").querySelector("small").textContent=QZ.tempoDesc;
document.querySelectorAll(".chip2[data-a]").forEach(function(b){var k=b.getAttribute("data-a");b.textContent=TN[k]+" · "+Q.filter(function(d){return d.t===k}).length});
/* Validação do banco: roda ao abrir a página. Abra com #teste para ver o resultado no topo. */
function validateBank(){var er=[],ids={},qs={};Q.forEach(function(d,k){var w="Q"+(k+1)+" ("+(d.id||"sem id")+")";
if(!d.id)er.push(w+": sem id");else if(ids[d.id])er.push(w+": id repetido");ids[d.id]=1;
if(!TN[d.t])er.push(w+": área inválida");if(!d.h)er.push(w+": sem dica");
if(!d.g){if(!d.e)er.push(w+": sem explicação");if(!d.o||d.o.length<2)er.push(w+": poucas alternativas");else{if(!(d.a>=0&&d.a<d.o.length))er.push(w+": gabarito fora do intervalo");if(new Set(d.o).size!==d.o.length)er.push(w+": alternativas repetidas")}if(qs[d.q])er.push(w+": pergunta repetida");qs[d.q]=1}
if(d.f&&!FIG[d.f])er.push(w+": figura inexistente ("+d.f+")")});return er}
var BE=validateBank();
if(BE.length){console.warn("Banco com problemas:\n"+BE.join("\n"))}
if(TSTF){document.querySelector(".hero p").textContent=BE.length?"Banco: "+BE.length+" problema(s). Veja o console.":"Banco OK: "+Q.length+" questões validadas."}
if(DBGF){window.__qz=function(c){return eval(c)}}
};

/* Barra de navegação inferior e seleção de áreas */
(function(){
var $=function(i){return document.getElementById(i)},B=document.querySelectorAll("#bnav button");
B.forEach(function(b){b.onclick=function(){var t=$(b.getAttribute("data-t"));if(t)t.click();window.scrollTo(0,0)}});
function upd(){
 B.forEach(function(b){var s=$(b.getAttribute("data-v")),on=!!s&&!s.classList.contains("hidden");b.classList.toggle("on",on);if(on)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
 var m=/\((\d+)\)/.exec($("bopen").textContent||""),n=m?+m[1]:0,g=$("bdg");var tx=n>99?"99+":String(n);if(g.textContent!==tx)g.textContent=tx;if(g.hidden!==!n)g.hidden=!n;
 var chips=document.querySelectorAll(".chip2[data-a]"),all=document.querySelectorAll(".chip2[data-a].on").length===chips.length;if($("allareas").disabled!==all)$("allareas").disabled=all;
}
$("allareas").onclick=function(){document.querySelectorAll(".chip2[data-a]:not(.on)").forEach(function(c){c.click()});upd()};
new MutationObserver(upd).observe(document.body,{subtree:true,attributes:true,attributeFilter:["class"],childList:true,characterData:true});
upd();
})();

/* Escolha do quiz: ?q=eletro ou ?q=fluidos abre direto; sem isso, aparece a tela de escolha. */
(function(){
var NOH=!/^(https?|file):$/.test(location.protocol),m=/[?&]q=(\w+)/.exec(location.search),q=m&&m[1];
/* arquivos de cada quiz: só os do quiz escolhido são carregados (no arquivo único eles já vêm embutidos) */
var ARQ={eletro:["perguntas-eletro.js","quiz-eletro.js","figuras.js","figuras-anim.js","figuras-animq-eletro.js","figuras-animq-eletro2.js","figuras-animq-eletro3.js","figuras-animq-eletro4.js","figuras-animq-auto.js"],fluidos:["perguntas-fluidos.js","quiz-fluidos.js","figuras-fluidos.js","figuras-anim.js","figuras-animq-fluidos.js","figuras-animq-fluidos2.js","figuras-animq-auto.js"],optica:["perguntas-optica.js","quiz-optica.js","figuras-anim.js","figuras-animq-optica.js","figuras-animq-auto.js"],mec:["perguntas-mec.js","quiz-mec.js","figuras-anim.js","figuras-animq-mec.js","figuras-animq-auto.js"],edin:["perguntas-edin.js","quiz-edin.js","figuras-anim.js","figuras-animq-edin.js","figuras-animq-auto.js"],onda:["perguntas-onda.js","quiz-onda.js","figuras-anim.js","figuras-animq-onda.js","figuras-animq-auto.js"],termo:["perguntas-termo.js","quiz-termo.js","figuras-termo.js","figuras-anim.js","figuras-animq-termo.js","figuras-animq-termo2.js","figuras-animq-termo3.js","figuras-animq-auto.js"]};
function carregar(id){
  if(window.QUIZZES&&window.QUIZZES[id])return Promise.resolve();
  return ARQ[id].reduce(function(p,f){return p.then(function(){return new Promise(function(ok,err){var s=document.createElement("script");s.src=f;s.onload=ok;s.onerror=function(){err(new Error(f))};document.head.appendChild(s)})})},Promise.resolve()).then(function(){if(window.BancoExtra)window.BancoExtra.registrar(id)})}
function go(id){carregar(id).then(function(){document.body.classList.remove("pre");window.__boot(id)}).catch(function(){var l=document.getElementById("landing");if(l){var p=document.createElement("p");p.className="msg no";p.textContent="Não foi possível carregar este quiz. Confira a conexão e tente de novo.";l.appendChild(p)}})}
/* Tela inicial: progresso, medalhas e sequência de dias, calculados só com os dados já guardados neste aparelho */
function landingStats(){
  var PX={eletro:["q","eletriz:"],fluidos:["f","fluidos:"],termo:["t","termo:"],onda:["o","onda:"],optica:["p","optica:"],mec:["m","mec:"],edin:["d","edin:"]},P=(window.Perfil&&window.Perfil.ler)?window.Perfil.ler():{},dias={},fm=function(d){var x=new Date(d);return x.getFullYear()+"-"+x.getMonth()+"-"+x.getDate()};
  function rd(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
  Object.keys(PX).forEach(function(id){
    var L=PX[id][0],tent=0,ac=0,dist=0;
    Object.keys(P).forEach(function(k){if(k.charAt(0)===L&&/^\d/.test(k.slice(1))){var e=P[k];if(e&&e[0]){dist++;tent+=e[0];ac+=e[1]}}});
    var H=rd(PX[id][1]+"hist",[]);if(Array.isArray(H))H.forEach(function(x){if(x&&x.d)dias[fm(x.d)]=1});
    var B=rd(PX[id][1]+"book",{}),nb=B&&typeof B==="object"?Object.keys(B).length:0,pc=tent?Math.round(100*ac/tent):0,m=[];
    if(tent>=10)m.push("🥉 Primeiros passos");if(tent>=50&&pc>=60)m.push("🥈 Pegando o jeito");if(tent>=100&&pc>=80&&dist>=30)m.push("🥇 Mestre do tema");if(dist>=30&&nb===0)m.push("✨ Caderno limpo");
    var el=document.querySelector('.ts[data-s="'+id+'"]');if(!el)return;
    el.textContent="";
    var l1=document.createElement("span");l1.className="tl";l1.textContent=tent?(pc+"% de acerto · "+dist+(dist===1?" questão":" questões")+" feitas"+(nb?" · "+nb+(nb===1?" erro":" erros")+" para revisar":"")):"Ainda não começou. Que tal um quiz de 10 perguntas?";el.appendChild(l1);
    var bar=document.createElement("span");bar.className="tpb";var i=document.createElement("i");i.style.width=pc+"%";bar.appendChild(i);if(tent)el.appendChild(bar);
    if(m.length){var l2=document.createElement("span");l2.className="tm";l2.textContent=m.join("  ");el.appendChild(l2)}
  });
  var hoje=new Date(),n=0,d=new Date(hoje);if(!dias[fm(d)])d.setDate(d.getDate()-1);
  while(dias[fm(d)]){n++;d.setDate(d.getDate()-1)}
  var sb=document.getElementById("seqbar");if(sb){if(n>=1){sb.textContent="🔥 "+n+(n===1?" dia":" dias")+" seguidos estudando. Volte amanhã para manter a sequência!";sb.classList.remove("hidden")}else{sb.classList.add("hidden")}}
}
try{landingStats()}catch(e){}
try{Meta.ui();document.querySelectorAll("#metabar button[data-g]").forEach(function(b){b.onclick=function(){Meta.goal(+b.getAttribute("data-g"))}})}catch(e){}
document.querySelectorAll("#landing [data-q]").forEach(function(b){b.onclick=function(){var id=b.getAttribute("data-q");if(NOH){go(id)}else{location.search="?q="+id}}});
/* Fonte, tema e cores: funcionam também na tela de escolha (valores guardados em "eletriz:") */
var h=document.documentElement,$=function(i){return document.getElementById(i)};
function lg(k,d){try{var v=localStorage.getItem("eletriz:"+k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function ls(k,v){try{localStorage.setItem("eletriz:"+k,JSON.stringify(v))}catch(e){}}
var sv=lg("theme","");if(sv)h.setAttribute("data-theme",sv);if(lg("big",false))h.classList.add("big");
var PALS=["indigo","floresta","grafite"];h.setAttribute("data-pal",lg("pal","indigo"));
(function(){var b=$("mnu"),p=$("mnup");if(!b||!p)return;function set(o){p.classList.toggle("hidden",!o);b.setAttribute("aria-expanded",o?"true":"false");b.textContent=o?"✕ Fechar":"☰ Menu"}
b.onclick=function(e){e.stopPropagation();set(p.classList.contains("hidden"))};
document.addEventListener("click",function(e){if(!p.classList.contains("hidden")&&!p.contains(e.target)&&e.target!==b)set(false)});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!p.classList.contains("hidden")){set(false);b.focus()}})})();
$("fonte").onclick=function(){var p=$("mnup"),b=$("mnu");p.classList.add("hidden");b.setAttribute("aria-expanded","false");b.textContent="☰ Menu";if(window.QzFonte)window.QzFonte.abrir();else window.Fontes.abrirEscolha()};
$("fz").onclick=function(){h.classList.toggle("big");ls("big",h.classList.contains("big"))};
$("th").onclick=function(){var c=h.getAttribute("data-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),n=c==="dark"?"light":"dark";h.setAttribute("data-theme",n);ls("theme",n)};
$("pal").onclick=function(){var c=h.getAttribute("data-pal")||"indigo",n=PALS[(PALS.indexOf(c)+1)%PALS.length];h.setAttribute("data-pal",n);ls("pal",n);var bt=$("pal");bt.textContent={indigo:"Índigo",floresta:"Floresta",grafite:"Grafite"}[n];setTimeout(function(){bt.textContent="Cores"},1400)};
if(q&&ARQ[q]){go(q)}
if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol)){
 var ofl=function(t,c){var e=document.getElementById("offl");if(e){e.textContent=t;e.className="offl"+(c?" "+c:"")}};
 var tinha=!!navigator.serviceWorker.controller;
 window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){});
  navigator.serviceWorker.ready.then(function(){return caches.keys()}).then(function(ks){if(ks.length)ofl("✓ Pronto para usar sem internet","ok")}).catch(function(){});
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}});
 navigator.serviceWorker.addEventListener("controllerchange",function(){if(tinha)ofl("↻ Nova versão instalada. Feche e abra o app para usar as novidades.","up")});
 window.addEventListener("offline",function(){ofl("Sem internet agora: tudo continua funcionando e seu progresso fica neste aparelho.","off")});
 window.addEventListener("online",function(){ofl("✓ Pronto para usar sem internet","ok")});
}
})();

/* subscritos nas temperaturas: TC, TF e TK viram T com índice (HTML e SVG) */
(function(){"use strict";if(!window.MutationObserver||!document.body)return;
 var RE=/(^|[^A-Za-zÀ-ú0-9_])T([CFK])(?![A-Za-zÀ-ú0-9_])/,NS="http://www.w3.org/2000/svg",SKIP=/^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION)$/i;
 function fix(n){var t=n.nodeValue,m=RE.exec(t),p=n.parentNode;if(!m||!p||SKIP.test(p.nodeName))return;var L=m[1].length,K=m[2],pre=t.slice(0,m.index+L),end=m.index+L+2;
  var svg=p.namespaceURI===NS,rest=t.slice(end),h=document.createTextNode(pre+"T"),s,r;
  if(svg){s=document.createElementNS(NS,"tspan");s.setAttribute("dy","3");s.setAttribute("font-size","75%");s.textContent=K;
   r=document.createElementNS(NS,"tspan");r.setAttribute("dy","-3");var rt=document.createTextNode(rest||" ");r.appendChild(rt);
   p.insertBefore(h,n);p.insertBefore(s,n);p.insertBefore(r,n);p.removeChild(n);if(RE.test(rest))fix(rt)}
  else{s=document.createElement("sub");s.textContent=K;var rt2=document.createTextNode(rest);
   p.insertBefore(h,n);p.insertBefore(s,n);p.insertBefore(rt2,n);p.removeChild(n);if(RE.test(rest))fix(rt2)}}
 function walk(nd){if(nd.nodeType===3){if(RE.test(nd.nodeValue))fix(nd);return}
  if(nd.nodeType!==1||SKIP.test(nd.nodeName))return;var w=document.createTreeWalker(nd,4,null,false),a=[],x;while((x=w.nextNode()))if(RE.test(x.nodeValue))a.push(x);a.forEach(fix)}
 new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==="characterData"){if(RE.test(m.target.nodeValue))fix(m.target)}else for(var i=0;i<m.addedNodes.length;i++)walk(m.addedNodes[i])})}).observe(document.body,{childList:true,subtree:true,characterData:true});
 walk(document.body)})();

/* sombra na barra superior quando a página rola */
(function(){var t=document.getElementById("topbar");if(!t)return;var on=false;function f(){var s=(window.pageYOffset||0)>6;if(s!==on){on=s;t.classList.toggle("stuck",s)}}window.addEventListener("scroll",f,{passive:true});f()})();
