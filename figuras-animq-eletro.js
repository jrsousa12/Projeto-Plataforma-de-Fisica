/* Animações de Eletrostática (prioridade alta). */
(function(){"use strict";
var N=window.AN,PI=Math.PI;
function f1(v){var s=(Math.round(v*100)/100).toString().replace(".",",");return (v>0?"+":v<0?"−":"")+s.replace("-","")}
function g(c,x,y,cls,txt,extra){return'<text class="t '+cls+' '+c+'" x="'+x+'" y="'+(y+5)+'" text-anchor="middle"'+(extra||"")+'>'+txt+'</text>'}

/* ---------- esfera com cargas (indução e ligação à terra) ---------- */
var CX=210,CY=78,R=42;
var PP=[[-8,-14],[6,-14],[-8,0],[6,0],[-8,14],[6,14]];
function ring(n,rad){var o=[];for(var i=0;i<n;i++){var a=(i*360/n)*PI/180;o.push([rad*Math.cos(a),rad*Math.sin(a)])}return o}
var LEFT=[[-32,-14],[-20,-14],[-32,0],[-20,0],[-32,14],[-20,14]];
function mir(a){return a.map(function(p){return[-p[0],p[1]]})}
function rod(sign,tx){ /* bastão com sinais; posição final = longe (tx) quando fora */
 var cls=sign>0?"an-rp":"an-rn",c=sign>0?"pos":"neg",s='<g class="rod" style="transform:translate('+tx+'px,0px)"><rect class="'+cls+'" x="66" y="66" width="92" height="24" rx="7"/>';
 for(var i=0;i<4;i++)s+=g(c,82+i*22,78,"",sign>0?"+":"−");return s+'</g>'}
function ground(){return'<g class="gnd"><line class="wire" x1="'+CX+'" y1="'+(CY+R)+'" x2="'+CX+'" y2="150" stroke="currentColor" stroke-width="2" opacity="0"/><path class="gsym" d="M'+(CX-14)+' 150H'+(CX+14)+'M'+(CX-9)+' 155H'+(CX+9)+'M'+(CX-4)+' 160H'+(CX+4)+'" stroke="currentColor" stroke-width="2" fill="none"/></g>'}

/* indução (q003) */
(function(){var T=7,pp=PP.map(function(p){return[CX+p[0],CY+p[1]]}),s='<circle class="sph" cx="'+CX+'" cy="'+CY+'" r="'+R+'"/>';
 pp.forEach(function(p){s+=g("pos",p[0],p[1],"","+")});
 var tr=[],cl=LEFT;
 cl.forEach(function(p,i){var fx=CX+p[0],fy=CY+p[1],ix=pp[i][0]-11,iy=pp[i][1]+7;s+=g("neg e"+i,fx,fy,"","−");
  tr.push(N.tr(".e"+i,T,[[0,ix-fx,iy-fy],[2,ix-fx,iy-fy],[3.8,0,0]]))});
 s+=rod(1,0);
 tr.push(N.tr(".rod",T,[[0,-60,0],[1.6,0,0]]));
 s+=N.arrow(CX-R,CX-R-40,CY+56,"an-a1 f1",4)+N.arrow(CX+R,CX+R+22,CY+56,"an-a2 f2",2.5)+'<text x="'+(CX-R-20)+'" y="'+(CY+74)+'" text-anchor="middle" font-size="10" class="lb1">atração</text><text x="'+(CX+R+11)+'" y="'+(CY+74)+'" text-anchor="middle" font-size="10" class="lb2">repulsão</text>';
 var c=N.cap(["Bastão positivo se aproxima|da esfera neutra","Elétrons livres vão para|o lado próximo do bastão","Atração (perto) > repulsão (longe):|a esfera é atraída, sem tocar"],[0,2,4.2],T,172);
 tr=tr.concat(c.t);tr.push(N.vis(".f1,.lb1",T,4.4),N.vis(".f2,.lb2",T,4.4));
 N.reg("inducao",{a:"Animação: o bastão positivo se aproxima da esfera neutra, os elétrons livres vão para o lado mais próximo e a atração vence a repulsão",h:198,s:s+c.s,t:tr,T:T})})();

/* ligação à terra, bastão positivo (q004) e negativo (q018) */
function terra(sign,key,alt){var T=9,pp=PP.map(function(p){return[CX+p[0],CY+p[1]]}),s='<circle class="sph" cx="'+CX+'" cy="'+CY+'" r="'+R+'"/>',tr=[];
 pp.forEach(function(p){s+=g("pos",p[0],p[1],"","+")});
 var rg=ring(sign>0?9:3,31).map(function(p){return[CX+p[0],CY+p[1]]});
 if(sign>0){ /* 6 elétrons à esquerda -> anel; 3 novos sobem pelo fio */
  LEFT.forEach(function(p,i){var fx=rg[i+3][0],fy=rg[i+3][1],ix=CX+p[0],iy=CY+p[1];s+=g("neg e"+i,fx,fy,"","−");
   tr.push(N.tr(".e"+i,T,[[0,ix-fx,iy-fy],[5.4,ix-fx,iy-fy],[7,0,0]]))});
  for(var j=0;j<3;j++){var fx=rg[j][0],fy=rg[j][1];s+=g("neg n"+j,fx,fy,"","−");
   tr.push(N.tr(".n"+j,T,[[0,CX-fx,156-fy],[2.6+j*.3,CX-fx,156-fy],[4.6+j*.3,0,0]]),N.vis(".n"+j,T,2.6+j*.3))}
 }else{ /* 6 elétrons à direita (afastados do bastão negativo); 3 descem pelo fio, 3 vão ao anel */
  mir(LEFT).forEach(function(p,i){var ix=CX+p[0],iy=CY+p[1];
   if(i<3){var fx=rg[i][0],fy=rg[i][1];s+=g("neg e"+i,fx,fy,"","−");tr.push(N.tr(".e"+i,T,[[0,ix-fx,iy-fy],[5.4,ix-fx,iy-fy],[7,0,0]]))}
   else{var d=i-3;tr.push(N.tr(".d"+d,T,[[0,0,0],[2.6+d*.3,0,0],[4.6+d*.3,CX-ix,156-iy]]),N.op(".d"+d,T,[[0,1],[4.2+d*.3,1],[4.7+d*.3,0]]));
    s+='<text class="t neg d'+d+'" x="'+ix+'" y="'+(iy+5)+'" text-anchor="middle" opacity="0">−</text>'}});
 }
 s+=ground();
 tr.push(N.pr(".wire",T,"opacity",[[0,0],[2.2,0],[2.5,1],[4.8,1],[5.1,0]]));
 s+=rod(sign,-60);
 tr.push(N.tr(".rod",T,[[0,0,0],[5.2,0,0],[6.6,-60,0]]));
 var sg=sign>0?"+":"−";
 var cp=sign>0?["Bastão positivo perto:|esfera polarizada","Ligada à terra: elétrons|sobem da terra para a esfera","Fio desligado e bastão afastado:|elétrons se espalham","A esfera fica NEGATIVA|(ganhou elétrons)"]
  :["Bastão negativo perto:|esfera polarizada","Ligada à terra: elétrons|descem da esfera para a terra","Fio desligado e bastão afastado:|cargas se espalham","A esfera fica POSITIVA|(perdeu elétrons)"];
 var c=N.cap(cp,[0,2.2,5,7.3],T,182);tr=tr.concat(c.t);
 N.reg(key,{a:alt,h:216,s:s+c.s,t:tr,T:T})}
terra(1,"terra_pos","Animação: com o bastão positivo perto, a esfera é ligada à terra e recebe elétrons; depois o fio é desligado, o bastão se afasta e a esfera fica negativa");
terra(-1,"terra_neg","Animação: com o bastão negativo perto, a esfera é ligada à terra e perde elétrons; depois o fio é desligado, o bastão se afasta e a esfera fica positiva");

/* ---------- contato entre esferas idênticas ---------- */
function mkcontato(key,alt,vals,steps,caps,fim){
 /* constrói trilhas de movimento combinadas por esfera */
 var n=vals.length,xs=n===2?[100,220]:[56,160,264],T=0.5+steps.length*2.6+0.6,cy=62,r=30,s="",tr=[],cur=vals.slice();
 var hist=vals.map(function(v){return[[v,0]]}),mv=vals.map(function(){return[[0,0]]});
 steps.forEach(function(p,k){var t0=0.5+k*2.6,i=p[0],j=p[1],sum=cur[i]+cur[j],m=sum/2,dx=(xs[j]>xs[i]?1:-1)*(Math.abs(xs[j]-xs[i])-2*r);
  cur[i]=m;cur[j]=m;hist[i].push([m,t0+1.0]);hist[j].push([m,t0+1.0]);
  mv[i].push([t0,0],[t0+.9,dx],[t0+1.3,dx],[t0+2.2,0])});
 xs.forEach(function(x,i){s+='<circle class="sph s'+i+'" cx="'+x+'" cy="'+cy+'" r="'+r+'"/>';s+='<text x="'+x+'" y="'+(cy-r-7)+'" text-anchor="middle" font-size="11">'+"ABC".charAt(i)+'</text>'});
 hist.forEach(function(h,i){h.forEach(function(e,k){var last=k===h.length-1,v=e[0],cl=v>0?"pos":v<0?"neg":"";
  s+='<text class="v'+i+' v'+i+'_'+k+' '+cl+'" x="'+xs[i]+'" y="'+(cy+4)+'" text-anchor="middle" font-size="12" font-weight="700"'+(last?"":' opacity="0"')+'>'+f1(v)+' µC</text>';
  tr.push(N.vis(".v"+i+"_"+k,T,e[1]>0?e[1]-0.1:0,last?null:h[k+1][1]-0.1))})});
 mv.forEach(function(m,i){if(m.length<2)return;var p=m.map(function(a){return[a[0],a[1],0]});p.sort(function(a,b){return a[0]-b[0]});
  tr.push(N.tr(".s"+i+",.v"+i,T,p))});
 var times=[0];steps.forEach(function(_,k){times.push(0.5+k*2.6)});times=times.slice(0,caps.length);
 var c=N.cap(caps,times.length===caps.length?[0].concat(steps.map(function(_,k){return 0.5+k*2.6})).slice(0,caps.length):times,T,138);
 tr=tr.concat(c.t);
 N.reg(key,{a:alt,h:176,s:s+c.s,t:tr,T:T})}
function fx(v){return f1(v)+" µC"}
mkcontato("contato_q002","Animação: a esfera A (+6 µC) toca a esfera B (−2 µC); a soma é dividida igualmente e cada uma fica com +2 µC",[6,-2],[[0,1]],
 ["Duas esferas idênticas, cargas diferentes","A toca B: soma = +4 µC|dividida igualmente: +2 µC cada"]);
mkcontato("contato_q052","Animação: duas esferas idênticas com +5 µC e −1 µC se tocam; a soma é dividida igualmente e cada uma fica com +2 µC",[5,-1],[[0,1]],
 ["Duas esferas idênticas, cargas diferentes","Contato: soma = +4 µC|dividida igualmente: +2 µC cada"]);
mkcontato("contato_q005","Animação: A (+9 µC) toca B e as duas ficam com +4,5 µC; depois B toca C (neutra) e as duas ficam com +2,25 µC",[9,0,0],[[0,1],[1,2]],
 ["A (+9) toca B (neutra)","A toca B: soma +9 → +4,5 µC cada","B toca C: soma +4,5 → +2,25 µC cada"]);
mkcontato("contato_q014","Animação: A (−8 µC) toca B (+2 µC) e ficam com −3 µC; depois B toca C (+6 µC) e as duas ficam com +1,5 µC",[-8,2,6],[[0,1],[1,2]],
 ["A (−8) toca B (+2)","A toca B: soma −6 → −3 µC cada","B (−3) toca C (+6): soma +3 → +1,5 µC cada"]);
mkcontato("contato_q015","Animação: A (+4 µC) toca B (−8 µC); a soma é −4 µC e cada uma fica com −2 µC. B passa de −8 para −2 µC, ou seja, 6 µC de elétrons passam de B para A",[4,-8],[[0,1]],
 ["A (+4) toca B (−8)","Soma −4 µC → −2 µC cada.|B foi de −8 a −2: 6 µC = 3,75 × 10¹³ elétrons"]);

/* ---------- campo / força no ponto médio ---------- */
function campo(key,alt,mode){var T=8,L=50,Rr=270,M=160,y=60,s="",tr=[];
 var q2=mode==="pm"?"−":"+",fb=mode==="fb",nm=fb?"F":"E";
 function ch(x,sg,cl){return'<circle class="sph" cx="'+x+'" cy="'+y+'" r="14"/>'+g(cl,x,y,"",sg)}
 s+=ch(L,"+","pos")+ch(Rr,q2,q2==="+"?"pos":"neg");
 s+='<text x="'+L+'" y="'+(y+32)+'" text-anchor="middle" font-size="11">'+(fb?"A":"+Q")+'</text><text x="'+Rr+'" y="'+(y+32)+'" text-anchor="middle" font-size="11">'+(fb?"C":(mode==="pm"?"−Q":"+Q"))+'</text>';
 if(fb)s+='<circle class="sph" cx="'+M+'" cy="'+y+'" r="14"/>'+g("pos",M,y,"","+")+'<text x="'+M+'" y="'+(y+32)+'" text-anchor="middle" font-size="11">B</text>';
 else s+='<circle cx="'+M+'" cy="'+y+'" r="3.5" fill="currentColor"/><text x="'+M+'" y="'+(y+22)+'" text-anchor="middle" font-size="11">P</text>';
 var x0=fb?M+16:M,l1=48,dir2=mode==="pm"?1:-1,x1=fb?M-16:M;
 var y1=y-40,y2=y-24;
 var a1=N.arrow(x0,x0+l1,y1,"an-a1 ar1",3.5).replace("<g ",'<g style="transform-box:fill-box;transform-origin:0% 50%" ');
 var a2=N.arrow(x1,x1+dir2*l1,y2,"an-a2 ar2",3.5).replace("<g ",'<g style="transform-box:fill-box;transform-origin:'+(dir2>0?"0%":"100%")+' 50%" ');
 s+=a1+a2;
 s+='<text class="lb1" x="'+(x0+l1+8)+'" y="'+(y1+4)+'" font-size="12" font-weight="700">'+nm+'₁ (de '+(fb?"A":"+Q")+')</text>';
 s+='<text class="lb2" x="'+(x1+dir2*(l1+8))+'" y="'+(y2+4)+'" font-size="12" font-weight="700" text-anchor="'+(dir2>0?"start":"end")+'">'+nm+'₂ (de '+(fb?"C":(mode==="pm"?"−Q":"+Q"))+')</text>';
 tr.push(N.sc(".ar1",T,[[0,0,1],[1.2,0,1],[2.2,1,1]]),N.vis(".ar1",T,1.2),N.vis(".lb1",T,2.0),N.sc(".ar2",T,[[0,0,1],[3.2,0,1],[4.2,1,1]]),N.vis(".ar2",T,3.2),N.vis(".lb2",T,4.0));
 var ry=y+62;
 if(mode==="pm"){s+=N.arrow(M,M+96,ry,"an-a3 res",5).replace("<g ",'<g style="transform-box:fill-box;transform-origin:0% 50%" ')+'<text class="resl" x="'+(M+50)+'" y="'+(ry+22)+'" text-anchor="middle" font-size="12" font-weight="800">E = E₁ + E₂</text>';
  tr.push(N.sc(".res",T,[[0,0,1],[5.6,0,1],[6.8,1,1]]),N.vis(".res",T,5.6),N.vis(".resl",T,6.4))}
 else{s+='<text class="resl" x="'+M+'" y="'+(ry+4)+'" text-anchor="middle" font-size="15" font-weight="800">'+(fb?"F resultante = 0":"E resultante = 0")+'</text>';
  tr.push(N.vis(".resl",T,5.6))}
 var cp=mode==="pm"?["Cargas +Q e −Q, de mesmo módulo","A carga + afasta: E₁ aponta →|A carga − atrai: E₂ também aponta →","Mesmo sentido: os módulos se somam"]
  :fb?["Três cargas positivas iguais,|B no meio","A repele B para a direita (F₁)|C repele B para a esquerda (F₂)","Mesmo módulo, sentidos opostos:|a força resultante em B é nula"]
  :["Duas cargas +Q iguais","As duas afastam: E₁ aponta →|e E₂ aponta ←","Mesmo módulo, sentidos opostos:|o campo resultante é NULO"];
 var c=N.cap(cp,[0,1.2,5.6],T,ry+50);
 N.reg(key,{a:alt,h:ry+82,s:s+c.s,t:tr.concat(c.t),T:T})}
campo("campo_pp","Animação: duas cargas positivas iguais criam, no ponto médio, campos de mesmo módulo e sentidos opostos; o campo resultante é zero","pp");
campo("campo_pm","Animação: com cargas +Q e −Q, os campos no ponto médio têm o mesmo sentido (da positiva para a negativa) e se somam","pm");
campo("forca_fb","Animação: duas cargas positivas iguais, uma de cada lado de B, empurram B com forças de mesmo módulo e sentidos opostos; a resultante é zero","fb");

/* ================= PRIORIDADE MÉDIA ================= */
/* ---------- eletroscópio ---------- */
function jarro(){return'<rect x="170" y="70" width="80" height="86" rx="10" fill="var(--f-vidro)" fill-opacity=".35" stroke="currentColor" stroke-width="2"/><line x1="210" y1="50" x2="210" y2="100" stroke="currentColor" stroke-width="3"/><circle cx="210" cy="36" r="14" fill="var(--surface)" stroke="currentColor" stroke-width="2.5"/>'}
function folha(cls,ang,extra){return'<g class="'+cls+'" style="transform:rotate('+ang+'deg);transform-origin:210px 100px"><line x1="210" y1="100" x2="210" y2="140" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'+(extra||"")+'</g>'}
(function(){var T=7.6,s=jarro(),tr=[];
 s+=g("pos",203,36,"","+")+g("pos",217,36,"","+");
 s+=folha("lfA",22)+folha("lfB",-22);
 var E=[[199,113],[193,126],[221,113],[227,126]],I=[[210,24],[210,42],[210,60],[210,76]];
 E.forEach(function(e,i){s+=g("neg ee"+i,e[0],e[1],"","−");tr.push(N.tr(".ee"+i,T,[[0,I[i][0]-e[0],I[i][1]-e[1]],[2.2+i*.15,I[i][0]-e[0],I[i][1]-e[1]],[4+i*.15,0,0]]))});
 s+=rod(-1,-70).replace('<rect class="an-rn" x="66" y="66" width="92" height="24" rx="7"/>','<rect class="an-rn" x="98" y="24" width="90" height="24" rx="7"/>').replace(/<text class="t neg ">/g,'<text class="t neg ">');
 /* posiciona sinais do bastão */
 s=s.replace(/(<g class="rod"[^>]*>)(.*?)(<\/g>)/,function(m,a,b,c){var h='<rect class="an-rn" x="98" y="24" width="90" height="24" rx="7"/>';for(var i=0;i<4;i++)h+=g("neg",114+i*22,36,"","−");return a+h+c});
 tr.push(N.tr(".rod",T,[[0,0,0],[1.8,0,0]].map(function(p,i){return i===0?[0,-70,0]:[1.8,0,0]})));
 tr.push(N.rot(".lfA",T,[[0,0],[3.8,0],[5.6,22]]),N.rot(".lfB",T,[[0,0],[3.8,0],[5.6,-22]]));
 var c=N.cap(["Bastão negativo se aproxima|do botão, sem tocar","Os elétrons livres são repelidos|do botão para as folhas","Folhas com cargas de mesmo sinal|se repelem e se abrem"],[0,2,4],T,180);
 N.reg("eletroscopio_neg",{a:"Animação: um bastão negativo se aproxima do botão de um eletroscópio neutro; os elétrons vão para as folhas, que ficam com cargas de mesmo sinal e se abrem",h:212,s:s+c.s,t:tr.concat(c.t),T:T})})();

(function(){var T=7.6,tr=[],s=jarro();
 var L2=[[-5,14],[-5,30]],R2=[[5,14],[5,30]];
 function lf(cls,sg,ang){var ex="";[16,32].forEach(function(d,i){ex+='<text class="t pos'+(i?' pz':'')+'" x="'+(210+sg*9)+'" y="'+(100+d+4)+'" text-anchor="middle">+</text>'});return folha(cls,ang,ex)}
 s+=g("pos",203,36,"","+")+g("pos",217,36,"","+");
 s+=lf("lfA",1,28)+lf("lfB",-1,-28);
 s+=g("neg ea",203,45,"","−")+g("neg eb",217,45,"","−");
 s+=rod(-1,-70);
 s=s.replace(/(<g class="rod"[^>]*>)(.*?)(<\/g>)/,function(m,a,b,c){var h='<rect class="an-rn" x="98" y="24" width="90" height="24" rx="7"/>';for(var i=0;i<4;i++)h+=g("neg",114+i*22,36,"","−");return a+h+c});
 tr.push(N.tr(".rod",T,[[0,-70,0],[1.8,0,0]]));
 tr.push(N.rot(".lfA",T,[[0,28],[3.4,28],[5.6,14]]),N.rot(".lfB",T,[[0,-28],[3.4,-28],[5.6,-14]]));
 /* elétrons descem até as folhas e neutralizam uma carga + em cada */
 tr.push(N.tr(".ea",T,[[0,0,0],[2,0,0],[4,-3,86]]),N.tr(".eb",T,[[0,0,0],[2,0,0],[4,3,86]]));
 tr.push(N.op(".ea,.eb",T,[[0,1],[4.1,1],[4.4,0]]),N.op(".pz",T,[[0,1],[4.1,1],[4.4,0]]));
 var c=N.cap(["Eletroscópio carregado positivamente:|folhas abertas","Bastão negativo se aproxima: elétrons|são repelidos para as folhas","Elétrons neutralizam parte da carga +:|as folhas se fecham um pouco"],[0,2,4.2],T,180);
 N.reg("eletroscopio_pos",{a:"Animação: um eletroscópio carregado positivamente tem as folhas abertas; um bastão negativo se aproxima, elétrons vão para as folhas, neutralizam parte da carga positiva e as folhas se fecham um pouco",h:212,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* ---------- polarização de isolante ---------- */
(function(){var T=8,tr=[],s='';
 s+='<g class="obj"><rect class="an-rn" x="60" y="40" width="40" height="100" rx="8"/>';[56,78,100,122].forEach(function(y){s+=g("neg",80,y,"","−")});s+='</g>';
 s+='<text x="80" y="156" text-anchor="middle" font-size="11">objeto (−)</text>';
 s+='<rect x="178" y="40" width="112" height="100" rx="8" fill="var(--surface)" stroke="currentColor" stroke-width="2" stroke-dasharray="5 3"/><text x="234" y="156" text-anchor="middle" font-size="11">isolante neutro</text>';
 var pos=[[205,62],[262,62],[205,118],[262,118],[234,90]],ang=[70,-130,150,-40,110];
 pos.forEach(function(p,i){s+='<g class="mol m'+i+'" style="transform-box:fill-box;transform-origin:50% 50%;transform:rotate(0deg)"><ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="17" ry="8" fill="none" stroke="currentColor" stroke-width="1.5"/><text class="t pos" x="'+(p[0]-9)+'" y="'+(p[1]+5)+'" font-size="13" text-anchor="middle">+</text><text class="t neg" x="'+(p[0]+9)+'" y="'+(p[1]+4)+'" font-size="13" text-anchor="middle">−</text></g>';
  tr.push(N.rot(".m"+i,T,[[0,ang[i]],[2.6,ang[i]],[4.6,0]]))});
 tr.push(N.tr(".obj",T,[[0,-70,0],[1.8,0,0]]));
 s+=N.arrow(176,140,22,"an-a2 fa",3.5)+'<text class="fal" x="158" y="40" text-anchor="middle" font-size="11" font-weight="700">atração</text>';
 tr.push(N.vis(".fa,.fal",T,5.4));
 var c=N.cap(["O isolante é neutro, mas suas moléculas|são polares (+ e −), orientadas ao acaso","O objeto negativo se aproxima: as moléculas|giram, com o lado + voltado para ele","O lado + fica mais perto: a atração|vence a repulsão e há força líquida"],[0,1.8,4.8],T,180);
 N.reg("polariz",{a:"Animação: um objeto carregado negativamente se aproxima de um material neutro com moléculas polares; as moléculas giram com o lado positivo voltado para o objeto e surge uma atração",h:212,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* ---------- pontas e vento elétrico ---------- */
function corpo(){return'<path d="M268 90L174 66.5A50 50 0 1 0 174 113.5Z" fill="var(--surface)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>'}
(function(){var T=8,tr=[],s=corpo();
 var F=[[258,90],[246,84],[246,96],[230,80],[230,100],[212,74],[212,106],[190,70],[190,110],[150,50],[150,130],[100,64],[96,118],[84,92]];
 var I=[];for(var i=0;i<14;i++){var a=i*2*PI/14;I.push([130+43*Math.cos(a),90+43*Math.sin(a)])}
 F.forEach(function(f,i){s+=g("pos cg"+i,f[0],f[1],"","+");tr.push(N.tr(".cg"+i,T,[[0,I[i][0]-f[0],I[i][1]-f[1]],[1.6,I[i][0]-f[0],I[i][1]-f[1]],[4.2,0,0]]))});
 s+=N.arrow(271,306,90,"an-a3 fe1",3)+N.arrow(262,292,72,"an-a3 fe2",2.5)+N.arrow(262,292,108,"an-a3 fe3",2.5)+'<text class="fel" x="296" y="130" text-anchor="middle" font-size="11" font-weight="700">campo|intenso</text>';
 s=s.replace('campo|intenso','campo intenso').replace('x="296" y="130"','x="262" y="146"');
 tr.push(N.vis(".fe1,.fe2,.fe3,.fel",T,4.8));
 var c=N.cap(["Condutor carregado, com ponta,|em equilíbrio","As cargas se concentram|nas regiões pontiagudas","Onde há mais carga, o campo é mais|intenso (raio de curvatura menor)"],[0,1.6,4.8],T,172);
 N.reg("pontas",{a:"Animação: em um condutor carregado com uma ponta, as cargas se concentram na região pontiaguda e o campo elétrico é mais intenso ali",h:204,s:s+c.s,t:tr.concat(c.t),T:T})})();
(function(){var T=9,tr=[],s=corpo();
 var F=[[258,90],[246,84],[246,96],[230,80],[230,100],[212,74],[212,106],[190,70],[190,110],[150,50],[150,130]];
 F.forEach(function(f){s+=g("pos",f[0],f[1],"","+")});
 [[284,70],[290,90],[284,110]].forEach(function(p,i){
  s+='<circle class="ar a'+i+'" cx="'+p[0]+'" cy="'+p[1]+'" r="5" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0"/>';
  var sx=p[0]+20+i*3,sy=p[1]+(i-1)*12;
  s+=g("pos ip"+i,sx,sy,"","+");
  s+=g("neg in"+i,272,90,"","−",' opacity="0"');
  tr.push(N.tr(".ip"+i,T,[[0,p[0]-sx,p[1]-sy],[3.4,p[0]-sx,p[1]-sy],[6.4,0,0]]),N.op(".ip"+i,T,[[0,0],[3.2,0],[3.4,1]]));
  tr.push(N.tr(".in"+i,T,[[0,p[0]-272,p[1]-90],[3.4,p[0]-272,p[1]-90],[5.6,0,0]]),N.op(".in"+i,T,[[0,0],[3.2,0],[3.4,1],[5.4,1],[5.7,0]]));
  tr.push(N.op(".a"+i,T,[[0,1],[3.2,1],[3.4,0]]))});
 s=s.replace(/opacity="0"/g,'opacity="0"').replace(/(<circle class="ar a\d[^>]*)opacity="0"/g,'$1');
 s+=N.arrow(285,312,40,"an-a2 vw",3)+'<text class="vwl" x="262" y="26" text-anchor="middle" font-size="11" font-weight="700">vento elétrico</text>';
 tr.push(N.vis(".vw,.vwl",T,6.6));
 var c=N.cap(["Perto da ponta o campo é muito intenso","Ele ioniza as moléculas do ar:|surgem íons positivos e negativos","Íons − vão para a ponta; íons + são|repelidos: é o vento elétrico"],[0,2.2,4.6],T,172);
 N.reg("vento",{a:"Animação: perto da ponta o campo intenso ioniza o ar; os íons de sinal contrário são atraídos pela ponta e os do mesmo sinal são repelidos, produzindo o vento elétrico",h:204,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* ---------- Lei de Coulomb: distância e cargas ---------- */
function coul(key,alt,c){var T=8,tr=[],s='',Y=52,R=15;
 function dim(x1,x2,cls,txt,op){return'<g class="'+cls+'"'+(op?' opacity="0"':'')+'><line x1="'+x1+'" y1="92" x2="'+x2+'" y2="92" stroke="currentColor" stroke-width="1.5"/><line x1="'+x1+'" y1="86" x2="'+x1+'" y2="98" stroke="currentColor" stroke-width="1.5"/><line x1="'+x2+'" y1="86" x2="'+x2+'" y2="98" stroke="currentColor" stroke-width="1.5"/><text x="'+((x1+x2)/2)+'" y="84" text-anchor="middle" font-size="12" font-weight="700">'+txt+'</text></g>'}
 function arrs(a,b,L,cls,t1,t2,op){return'<g class="'+cls+'"'+(op?' opacity="0"':'')+'>'+N.arrow(a-R-2,a-R-2-L,Y,"an-a1",3.5)+N.arrow(b+R+2,b+R+2+L,Y,"an-a1",3.5)+'<text x="'+(a-R-2-L/2)+'" y="'+(Y-(L<30?22:12))+'" text-anchor="middle" font-size="12" font-weight="700">'+t1+'</text><text x="'+(b+R+2+L/2)+'" y="'+(Y-12)+'" text-anchor="middle" font-size="12" font-weight="700">'+t2+'</text></g>'}
 s+=dim(c.A0,c.B0,"d0",c.d0,1)+dim(c.A1,c.B1,"d1",c.d1);
 s+=arrs(c.A0,c.B0,c.L0,"f0","F","F",1)+arrs(c.A1,c.B1,c.L1,"f1",c.f1,c.f1);
 s+='<g class="cA"><circle cx="'+c.A1+'" cy="'+Y+'" r="'+R+'" class="an-rp"/><text style="fill:var(--ink);font-weight:700" class="la1" x="'+c.A1+'" y="'+(Y+5)+'" text-anchor="middle" font-size="14">'+c.qa+'</text>'+(c.qa0&&c.qa0!==c.qa?'<text style="fill:var(--ink);font-weight:700" class="la0" x="'+c.A1+'" y="'+(Y+5)+'" text-anchor="middle" font-size="14" opacity="0">'+c.qa0+'</text>':'')+'</g>';
 s+='<g class="cB"><circle cx="'+c.B1+'" cy="'+Y+'" r="'+R+'" class="an-rp"/><text style="fill:var(--ink);font-weight:700" class="lb1" x="'+c.B1+'" y="'+(Y+5)+'" text-anchor="middle" font-size="14">'+c.qb1+'</text>'+(c.qb0!==c.qb1?'<text style="fill:var(--ink);font-weight:700" class="lb0" x="'+c.B1+'" y="'+(Y+5)+'" text-anchor="middle" font-size="14" opacity="0">'+c.qb0+'</text>':'')+'</g>';
 tr.push(N.tr(".cA",T,[[0,c.A0-c.A1,0],[2,c.A0-c.A1,0],[3.8,0,0]]),N.tr(".cB",T,[[0,c.B0-c.B1,0],[2,c.B0-c.B1,0],[3.8,0,0]]));
 tr.push(N.op(".d0,.f0",T,[[0,1],[1.9,1],[2.2,0]]),N.op(".d1,.f1",T,[[0,0],[3.8,0],[4.2,1]]));
 if(c.qa0&&c.qa0!==c.qa)tr.push(N.op(".la0",T,[[0,1],[2,1],[2.3,0]]),N.op(".la1",T,[[0,0],[2,0],[2.3,1]]));
 if(c.qb0!==c.qb1){tr.push(N.op(".lb1",T,[[0,0],[2,0],[2.3,1]]),N.op(".lb0",T,[[0,1],[2,1],[2.3,0]]))}
 var cp=N.cap(c.caps,[0,2,4.3],T,134);
 N.reg(key,{a:alt,h:150,s:s+cp.s,t:tr.concat(cp.t),T:T})}
coul("coul_d3","Animação: duas cargas positivas iguais se repelem; quando a distância triplica, a força cai para um nono",{A0:80,B0:150,A1:40,B1:250,L0:54,L1:6,d0:"d",d1:"3d",f1:"F/9",qa:"q",qb0:"q",qb1:"q",caps:["Duas cargas iguais à distância d:|força de repulsão F","A distância passa a 3d","Força inversamente proporcional a d²:|3² = 9, logo F/9"]});
coul("coul_d05","Animação: ao reduzir à metade a distância entre duas cargas, a força fica quatro vezes maior",{A0:60,B0:240,A1:115,B1:205,L0:20,L1:80,d0:"d",d1:"d/2",f1:"4F",qa:"q",qb0:"q",qb1:"q",caps:["Duas cargas à distância d:|força F","A distância cai pela metade: d/2","(1/2)⁻² = 4:|a força fica 4 vezes maior"]});
coul("coul_q2","Animação: ao dobrar uma das cargas, a força entre elas dobra",{A0:100,B0:230,A1:100,B1:230,L0:30,L1:60,d0:"d",d1:"d",f1:"2F",qa:"q",qb0:"q",qb1:"2q",caps:["Duas cargas q à mesma distância d:|força F","Uma das cargas dobra: q → 2q","Força proporcional ao produto das cargas:|2 · q · q, logo 2F"]});
coul("coul_qq2","Animação: ao dobrar as duas cargas, a força fica quatro vezes maior",{A0:110,B0:220,A1:110,B1:220,L0:19,L1:76,d0:"d",d1:"d",f1:"4F",qa:"2q",qa0:"q",qb0:"q",qb1:"2q",caps:["Duas cargas q à distância d:|força F","As duas cargas dobram: q → 2q","2 · 2 = 4:|a força fica 4 vezes maior"]});
coul("coul_d2q2","Animação: dobrando a distância e uma das cargas, a força cai à metade",{A0:90,B0:160,A1:60,B1:200,L0:60,L1:30,d0:"d",d1:"2d",f1:"F/2",qa:"q",qb0:"q",qb1:"2q",caps:["Duas cargas q à distância d:|força F","d vira 2d (÷4) e uma carga vira 2q (×2)","2 ÷ 4 = 1/2:|a nova força é F/2"]});

/* ---------- campo uniforme: movimento de cargas ---------- */
function plates(l,r,lt,rt){return'<rect class="an-rp" x="12" y="14" width="10" height="104" rx="3"/><rect class="an-rn" x="298" y="14" width="10" height="104" rx="3"/>'+g(lt==="+"?"pos":"neg",17,66,"",lt)+g(rt==="+"?"pos":"neg",303,66,"",rt)}
function unif(key,alt,sg,caps){var T=8,tr=[],s='',x0=sg>0?105:215,x1=sg>0?230:90,col=sg>0?"pos":"neg";
 s+=plates(0,0,"+","−");
 [30,52,74,96].forEach(function(y){s+=N.arrow(34,286,y,"an-a3",1.6)});
 s+='<text x="160" y="24" text-anchor="middle" font-size="11" font-weight="700">E →</text>';
 s+='<g class="ch"><circle class="'+(sg>0?"an-rp":"an-rn")+'" cx="'+x1+'" cy="63" r="12"/>'+g(col,x1,63,"",sg>0?"+":"−")+N.arrow(x1+sg*14,x1+sg*48,63,"an-a1",3.5)+'<text x="'+(x1+sg*32)+'" y="52" text-anchor="middle" font-size="12" font-weight="700">F</text></g>';
 tr.push(N.tr(".ch",T,[[0,x0-x1,0],[1.6,x0-x1,0],[5.4,0,0]]));
 s+=N.arrow(50,270,138,"an-a3",2)+'<text x="50" y="156" font-size="11" font-weight="700">V maior</text><text x="270" y="156" text-anchor="end" font-size="11" font-weight="700">V menor</text>';
 var c=N.cap(caps,[0,1.6,5],T,176);
 N.reg(key,{a:alt,h:196,s:s+c.s,t:tr.concat(c.t),T:T})}
unif("unif_neg","Animação: em um campo elétrico uniforme, uma carga negativa abandonada em repouso se move em sentido oposto ao do campo, rumo a pontos de maior potencial",-1,["Campo uniforme para a direita;|carga negativa abandonada em repouso","A força tem sentido oposto ao do campo:|a carga se move para a esquerda","O potencial diminui no sentido do campo:|a carga negativa vai para maior potencial"]);
unif("unif_pos","Animação: em um campo elétrico uniforme, uma carga positiva abandonada em repouso se move no sentido do campo, rumo a pontos de menor potencial",1,["Campo uniforme para a direita;|carga positiva abandonada em repouso","A força tem o mesmo sentido do campo:|a carga se move para a direita","O potencial diminui no sentido do campo:|a carga positiva vai para menor potencial"]);
(function(){var T=8,tr=[],s='';
 s+='<rect class="an-rn" x="12" y="14" width="10" height="104" rx="3"/><rect class="an-rp" x="298" y="14" width="10" height="104" rx="3"/>'+g("neg",17,66,"","−")+g("pos",303,66,"","+");
 s+='<text x="17" y="10" text-anchor="middle" font-size="11" font-weight="700">0 V</text><text x="303" y="10" text-anchor="middle" font-size="11" font-weight="700">100 V</text>';
 [30,52,74,96].forEach(function(y){s+=N.arrow(286,34,y,"an-a3",1.6)});
 s+='<text x="160" y="24" text-anchor="middle" font-size="11" font-weight="700">← E</text>';
 s+='<g class="ch"><circle class="an-rn" cx="240" cy="63" r="12"/>'+g("neg",240,63,"","−")+N.arrow(256,286,63,"an-a1",3.5)+'</g>';
 tr.push(N.tr(".ch",T,[[0,-200,0],[1.6,-200,0],[5,0,0]],"ease-in"));
 s+='<rect x="40" y="134" width="240" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><rect class="eb" x="40" y="134" width="240" height="14" rx="4" fill="var(--spark)" style="transform-box:fill-box;transform-origin:left center"/><text x="40" y="164" font-size="11" font-weight="700">energia cinética</text><text x="280" y="164" text-anchor="end" font-size="11" font-weight="700">e·ΔV = 1,6×10⁻¹⁷ J</text>';
 tr.push(N.sc(".eb",T,[[0,0,1],[1.6,0,1],[5,1,1]],"ease-in"));
 var c=N.cap(["Elétron parte do repouso na placa negativa","A força elétrica o acelera até a placa de 100 V","Ec = e·ΔV = 1,6×10⁻¹⁹ × 100|= 1,6×10⁻¹⁷ J"],[0,1.6,5],T,184);
 N.reg("acel_e",{a:"Animação: um elétron parte do repouso e é acelerado entre duas placas com diferença de potencial de 100 volts, ganhando energia cinética de 1,6 vezes 10 elevado a menos 17 joules",h:204,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* ================= PRIORIDADE BAIXA ================= */
/* ---------- linhas de campo de carga puntiforme ---------- */
function linhas(key,alt,sg,caps){var T=8,tr=[],s='',cx=160,cy=80,r0=22,r1=76;
 for(var i=0;i<8;i++){var a=i*PI/4,ca=Math.cos(a),sa=Math.sin(a);
  var xa=cx+r0*ca,ya=cy+r0*sa,xb=cx+r1*ca,yb=cy+r1*sa;
  var d=sg>0?'M'+xa.toFixed(1)+' '+ya.toFixed(1)+'L'+xb.toFixed(1)+' '+yb.toFixed(1):'M'+xb.toFixed(1)+' '+yb.toFixed(1)+'L'+xa.toFixed(1)+' '+ya.toFixed(1);
  s+='<path class="ln l'+i+'" pathLength="1" d="'+d+'" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 1"/>';
  var hx=sg>0?xb:xa,hy=sg>0?yb:ya,dir=sg>0?1:-1,ux=ca*dir,uy=sa*dir;
  s+='<path class="hd" d="M'+hx.toFixed(1)+' '+hy.toFixed(1)+'L'+(hx-ux*10-uy*5).toFixed(1)+' '+(hy-uy*10+ux*5).toFixed(1)+'L'+(hx-ux*10+uy*5).toFixed(1)+' '+(hy-uy*10-ux*5).toFixed(1)+'Z" fill="currentColor"/>';
  tr.push(N.pr(".l"+i,T,"strokeDashoffset",[[0,1],[1.2,1],[3.4,0]],"ease-out"))}
 s+='<circle cx="'+cx+'" cy="'+cy+'" r="16" class="'+(sg>0?"an-rp":"an-rn")+'"/>'+g(sg>0?"pos":"neg",cx,cy,"",sg>0?"+":"−");
 tr.push(N.vis(".hd",T,3.2));
 var c=N.cap(caps,[0,1.2,4.2],T,176);
 N.reg(key,{a:alt,h:196,s:s+c.s,t:tr.concat(c.t),T:T})}
linhas("linhas_pos","Animação: as linhas de campo elétrico de uma carga positiva isolada saem da carga, em todas as direções, afastando-se dela",1,["Carga puntiforme positiva isolada","As linhas de campo saem da carga,|radiais e para fora","Perto da carga as linhas são mais próximas:|ali o campo é mais intenso"]);
linhas("linhas_neg","Animação: as linhas de campo elétrico de uma carga negativa isolada chegam à carga, vindo de todas as direções, aproximando-se dela",-1,["Carga puntiforme negativa isolada","As linhas de campo chegam à carga,|radiais e para dentro","Perto da carga as linhas são mais próximas:|ali o campo é mais intenso"]);
/* ---------- campo entre placas paralelas ---------- */
(function(){var T=8,tr=[],s='';
 s+='<rect class="an-rp" x="30" y="14" width="260" height="10" rx="3"/><rect class="an-rn" x="30" y="132" width="260" height="10" rx="3"/>'+g("pos",16,24,"","+")+g("neg",16,142,"","−");
 [60,100,140,180,220,260].forEach(function(x,i){s+='<path class="ln l'+i+'" pathLength="1" d="M'+x+' 28V122" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="1 1"/><path class="hd" d="M'+x+' 128L'+(x-5)+' 118L'+(x+5)+' 118Z" fill="currentColor"/>';
  tr.push(N.pr(".l"+i,T,"strokeDashoffset",[[0,1],[.6+i*.1,1],[2.4+i*.1,0]],"ease-out"))});
 tr.push(N.vis(".hd",T,2.6));
 [[80,44],[160,70],[240,96]].forEach(function(p,i){s+='<g class="tc tc'+i+'"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="9" class="an-rp"/>'+g("pos",p[0],p[1],"","+")+N.varrow(p[0],p[1]+11,p[1]+34,"an-a1",3)+'</g>';
  tr.push(N.vis(".tc"+i,T,3.6+i*.5))});
 s+='<text class="fq" x="160" y="164" text-anchor="middle" font-size="11" font-weight="700">F igual em qualquer ponto</text>';
 tr.push(N.vis(".fq",T,5.4));
 var c=N.cap(["Placas paralelas com cargas opostas","Linhas de campo paralelas e igualmente|espaçadas: campo uniforme","Uma carga de prova sofre a mesma|força em qualquer ponto entre as placas"],[0,.6,3.6],T,184);
 N.reg("placas",{a:"Animação: entre duas placas paralelas com cargas opostas as linhas de campo são paralelas e igualmente espaçadas; uma carga de prova sofre a mesma força em qualquer ponto entre as placas",h:204,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- cargas na superfície do condutor ---------- */
(function(){var T=8,tr=[],s='<circle cx="160" cy="78" r="60" fill="var(--surface)" stroke="currentColor" stroke-width="3"/>';
 var ini=[[-20,-22],[14,-30],[28,4],[-8,26],[-30,10],[6,-6],[-14,-4],[22,28],[-26,-26],[2,38]];
 ini.forEach(function(p,i){var a=i*2*PI/10-PI/2,fx=160+51*Math.cos(a),fy=78+51*Math.sin(a);
  s+=g("pos cg"+i,fx,fy,"","+");tr.push(N.tr(".cg"+i,T,[[0,160+p[0]-fx,78+p[1]-fy],[1.4,160+p[0]-fx,78+p[1]-fy],[4.4,0,0]]))});
 s+='<text class="e0" x="160" y="82" text-anchor="middle" font-size="14" font-weight="700">E = 0</text>';
 tr.push(N.vis(".e0",T,4.6));
 var c=N.cap(["Cargas em excesso soltas|dentro de um condutor","Cargas de mesmo sinal se repelem|e se afastam o máximo possível","No equilíbrio ficam todas na superfície;|dentro do condutor, E = 0"],[0,1.4,4.6],T,168);
 N.reg("superf",{a:"Animação: cargas em excesso dentro de um condutor se repelem e migram para a superfície externa; no equilíbrio o campo no interior é nulo",h:192,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- blindagem eletrostática ---------- */
(function(){var T=9,tr=[],s='';
 [48,68,88,108].forEach(function(y,i){s+=N.arrow(16,100,y,"an-a3 fi",2.4)+N.arrow(220,304,y,"an-a3 fo",2.4)});
 s+='<rect x="108" y="36" width="104" height="92" rx="8" fill="var(--f-cinza)" fill-opacity=".5" stroke="currentColor" stroke-width="5"/><rect x="134" y="66" width="52" height="32" rx="5" fill="var(--surface)" stroke="currentColor" stroke-width="2"/><text x="160" y="86" text-anchor="middle" font-size="10">aparelho</text>';
 [[100,50],[100,70],[100,90],[100,110]].forEach(function(p,i){s+=g("neg cn"+i,p[0]+3,p[1]+4,"","−")});
 [[220,50],[220,70],[220,90],[220,110]].forEach(function(p,i){s+=g("pos cn"+(i+4),p[0]-3,p[1]+4,"","+")});
 s+='<text class="e0" x="160" y="58" text-anchor="middle" font-size="13" font-weight="700">E = 0</text>';
 tr.push(N.vis(".fi",T,.4),N.vis(".fo",T,3.6),N.op(".t.neg,.t.pos",T,[[0,0],[1.6,0],[2.6,1]]),N.vis(".e0",T,5));
 var c=N.cap(["Campo elétrico externo atinge|um condutor oco","As cargas se rearranjam na superfície externa|e o campo fica nulo na cavidade","Dentro do condutor oco o campo é nulo:|é a blindagem eletrostática"],[0,1.6,5],T,172);
 N.reg("gaiola",{a:"Animação: um campo elétrico externo atinge um condutor oco; as cargas se rearranjam na superfície externa e o campo dentro da cavidade fica nulo, que é a blindagem eletrostática",h:196,s:s+c.s,t:tr.concat(c.t),T:T})})();
})();

/* ---------- resoluções passo a passo das questões de cálculo (q160 a q171) ---------- */
(function(){"use strict";
var N=window.AN,H=186,CY=140,Y=50;
function plate(x,sg,y1,y2){var s='<rect x="'+(x-4)+'" y="'+y1+'" width="8" height="'+(y2-y1)+'" rx="2" fill="currentColor" fill-opacity=".55"/>';for(var y=y1+12;y<y2;y+=22)s+='<text x="'+(x+(sg>0?14:-14))+'" y="'+(y+4)+'" text-anchor="middle" font-size="14" font-weight="700">'+(sg>0?"+":"−")+'</text>';return s}
/* par de cargas com cota e setas de força */
function par(o){var a=64,b=256,s='',ra=o.ra||15,rb=o.rb||15;
 s+=N.ch(a,Y,o.sa,o.la,"",ra)+N.ch(b,Y,o.sb,o.lb,"",rb)+N.dm(a,b,100,o.d);
 var rep=o.sa*o.sb>0,L=34;
 s+='<g class="s2">'+(rep?N.arrow(a-ra-3,a-ra-3-L,Y,"an-a2",3.5)+N.arrow(b+rb+3,b+rb+3+L,Y,"an-a2",3.5)+N.t(a-ra-3-L/2,Y-12,"F")+N.t(b+rb+3+L/2,Y-12,"F"):N.arrow(a+ra+3,a+ra+3+L,Y,"an-a2",3.5)+N.arrow(b-rb-3,b-rb-3-L,Y,"an-a2",3.5)+N.t(a+ra+3+L/2,Y-12,"F")+N.t(b-rb-3-L/2,Y-12,"F"))+'</g>';
 return s}
var Q="q₁",Q2="q₂";
N.calc("calc_q160","Animação passo a passo: duas cargas positivas, de 4 microcoulombs e 9 microcoulombs, a 0,3 metro uma da outra, se repelem com força de 3,6 newtons, obtida pela lei de Coulomb",{h:H,cy:CY,s:par({sa:1,sb:1,la:"+4 µC",lb:"+9 µC",d:"d = 0,3 m"}),steps:[[0,"Cargas de mesmo sinal se repelem.|d = 30 cm = 0,3 m"],[2.6,"F = k · q₁ · q₂ / d²"],[5.2,"F = 9·10⁹ · 4·10⁻⁶ · 9·10⁻⁶ / 0,3²"],[8,"F = 0,324 / 0,09 = 3,6 N"]]});
N.calc("calc_q161","Animação passo a passo: uma carga de 2 microcoulombs e outra de menos 5 microcoulombs, a 0,2 metro, se atraem com força de 2,25 newtons",{h:H,cy:CY,s:par({sa:1,sb:-1,la:"+2 µC",lb:"−5 µC",d:"d = 0,2 m"}),steps:[[0,"Cargas de sinais opostos se atraem.|d = 0,2 m"],[2.6,"F = k · |q₁| · |q₂| / d²"],[5.2,"F = 9·10⁹ · 2·10⁻⁶ · 5·10⁻⁶ / 0,2²"],[8,"F = 0,09 / 0,04 = 2,25 N (atração)"]]});
N.calc("calc_q162","Animação passo a passo: uma carga fixa de 5 microcoulombs cria, a 0,5 metro, um campo de 1,8 vezes 10 elevado a 5 newtons por coulomb, que age sobre a carga de prova de 2 microcoulombs com força de 0,36 newton",{h:H,cy:CY,
 s:N.ch(64,Y,1,"Q = +5 µC","",18)+N.ch(256,Y,1,"q = 2 µC","",12)+N.dm(64,256,100,"d = 0,5 m")+'<g class="s2">'+N.arrow(190,222,Y-28,"an-a3",2.5)+N.t(206,Y-34,"E")+'</g><g class="s3">'+N.arrow(272,306,Y,"an-a2",3.5)+N.t(289,Y-12,"F")+'</g>',
 steps:[[0,"Carga fixa Q = +5 µC e carga de prova|q = 2 µC, a d = 0,5 m"],[2.6,"E = k·Q / d² = 9·10⁹ · 5·10⁻⁶ / 0,5²|E = 1,8·10⁵ N/C"],[5.8,"F = q · E = 2·10⁻⁶ · 1,8·10⁵"],[8.4,"F = 0,36 N (repulsão)"]]});
N.calc("calc_q163","Animação passo a passo: uma carga de 3 microcoulombs atravessa duas regiões com diferenças de potencial de 200 volts e 150 volts; a diferença total é 350 volts e o trabalho é 1,05 vezes 10 elevado a menos 3 joules",{h:H,cy:CY,
 s:'<rect x="40" y="30" width="120" height="44" class="an-rn" style="fill-opacity:.12"/><rect x="160" y="30" width="120" height="44" class="an-rp" style="fill-opacity:.12"/>'+N.t(100,24,"ΔV₁ = 200 V")+N.t(220,24,"ΔV₂ = 150 V")+'<line x1="40" y1="52" x2="280" y2="52" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/><g class="mv">'+N.ch(268,52,1,"","",12)+'</g>'+N.t(268,86,"q = 3 µC")+N.dm(40,280,106,"ΔV total = 350 V",'s2'),
 tr:[N.tr(".mv",11.6,[[0,-228,0],[2.4,-228,0],[7.4,0,0]],"linear")],steps:[[0,"A carga q = 3 µC atravessa duas regiões,|sempre no mesmo sentido"],[2.8,"Os potenciais se somam:|ΔV = 200 + 150 = 350 V"],[5.6,"W = q · ΔV = 3·10⁻⁶ · 350"],[8,"W = 1,05·10⁻³ J"]]});
(function(){var s='',y;for(y=26;y<=70;y+=44)s+=N.arrow(40,300,y,"an-a1",2);
 N.calc("calc_q164","Animação passo a passo: em um campo uniforme de 400 newtons por coulomb, uma carga de 2 microcoulombs se desloca 0,25 metro no sentido do campo; a força vale 8 vezes 10 elevado a menos 4 newtons e o trabalho 2 vezes 10 elevado a menos 4 joules",{h:H,cy:CY,
 s:s+N.t(160,16,"E = 400 N/C")+'<g class="mv">'+N.ch(250,48,1,"","",12)+'<g class="s2">'+N.arrow(266,300,48,"an-a2",3.5)+'</g></g>'+N.dm(70,250,112,"d = 0,25 m"),
 tr:[N.tr(".mv",12,[[0,-180,0],[2.4,-180,0],[6.4,0,0]],"linear")],steps:[[0,"Campo uniforme E = 400 N/C.|A carga q = 2 µC anda d = 0,25 m"],[2.8,"Força: F = q · E = 2·10⁻⁶ · 400|F = 8·10⁻⁴ N"],[5.8,"W = F · d = 8·10⁻⁴ · 0,25"],[8.4,"W = 2·10⁻⁴ J"]]})})();
N.calc("calc_q165","Animação passo a passo: um elétron parte do repouso e é acelerado por 500 volts entre duas placas; o trabalho vira energia cinética e a velocidade final é cerca de 1,3 vezes 10 elevado a 7 metros por segundo",{h:H,cy:CY,
 s:plate(48,-1,16,100)+plate(272,1,16,100)+N.t(160,16,"U = 500 V")+'<g class="mv">'+N.ch(232,58,-1,"","",11)+'<g class="s3">'+N.arrow(246,264,58,"an-a2",3.5)+'</g></g>'+N.t(160,118,"elétron: parte do repouso"),
 tr:[N.tr(".mv",12,[[0,-156,0],[2.4,-156,0],[7.6,0,0]],"linear")],steps:[[0,"O elétron parte do repouso e é|acelerado por U = 500 V"],[2.8,"O trabalho vira energia cinética:|e · U = ½ · m · v²"],[5.8,"v = √(2 · 1,6·10⁻¹⁹ · 500 / 9,1·10⁻³¹)"],[8.4,"v ≈ 1,3·10⁷ m/s"]]});
N.calc("calc_q166","Animação passo a passo: uma gotícula de óleo em equilíbrio entre duas placas horizontais, com a força elétrica para cima igual ao peso para baixo; a carga é 3,2 vezes 10 elevado a menos 19 coulombs",{h:H,cy:CY,
 s:'<rect x="70" y="14" width="180" height="7" rx="2" fill="currentColor" fill-opacity=".55"/><rect x="70" y="104" width="180" height="7" rx="2" fill="currentColor" fill-opacity=".55"/><text x="92" y="40" text-anchor="middle" font-size="14" font-weight="700">+</text><text x="228" y="40" text-anchor="middle" font-size="14" font-weight="700">+</text><text x="92" y="100" text-anchor="middle" font-size="14" font-weight="700">−</text><text x="228" y="100" text-anchor="middle" font-size="14" font-weight="700">−</text>'+N.varrow(112,32,88,"an-a3",2.5)+N.t(126,64,"E",{a:"start"})+'<circle cx="160" cy="62" r="9" class="an-rn"/><g class="s2">'+N.varrow(160,52,18+8,"an-a2",3.5)+N.t(184,34,"q·E",{a:"start"})+N.varrow(160,72,106-8,"an-a1",3.5)+N.t(184,96,"m·g",{a:"start"})+'</g>',
 steps:[[0,"A gota está parada: a força elétrica|equilibra o peso"],[2.8,"q · E = m · g"],[5.4,"q = m·g / E = 1,6·10⁻¹⁴ · 10 / 5·10⁵"],[8,"q = 3,2·10⁻¹⁹ C"]]});
(function(){var sA='<circle cx="64" cy="'+Y+'" r="15" class="an-rp"/>',s;
 N.calc("calc_q167","Animação passo a passo: duas esferas idênticas com 8 microcoulombs e menos 2 microcoulombs se tocam e ficam com 3 microcoulombs cada; afastadas 0,3 metro, se repelem com força de 0,9 newton",{h:H,cy:CY,
 s:'<g class="cA"><circle cx="64" cy="50" r="15" class="an-rp"/><text x="64" y="55" text-anchor="middle" font-size="16" font-weight="700">+</text><text class="la0" x="64" y="79" text-anchor="middle" font-size="12" font-weight="700" opacity="0">+8 µC</text><text class="la1" x="64" y="79" text-anchor="middle" font-size="12" font-weight="700">+3 µC</text></g><g class="cB"><circle class="cn" cx="256" cy="50" r="15" style="fill:var(--neg);fill-opacity:.2;stroke:var(--neg);stroke-width:2;opacity:0"/><circle class="cp an-rp" cx="256" cy="50" r="15"/><text class="sn" x="256" y="55" text-anchor="middle" font-size="16" font-weight="700" opacity="0">−</text><text class="sp" x="256" y="55" text-anchor="middle" font-size="16" font-weight="700">+</text><text class="lb0" x="256" y="79" text-anchor="middle" font-size="12" font-weight="700" opacity="0">−2 µC</text><text class="lb1" x="256" y="79" text-anchor="middle" font-size="12" font-weight="700">+3 µC</text></g>'+N.dm(64,256,106,"d = 0,3 m")+'<g class="s3">'+N.arrow(46,12,50,"an-a2",3.5)+N.arrow(274,308,50,"an-a2",3.5)+'</g>',
 tr:[N.tr(".cA",12.2,[[0,0,0],[1.6,81,0],[3.4,81,0],[5.2,0,0]],"linear"),N.tr(".cB",12.2,[[0,0,0],[1.6,-81,0],[3.4,-81,0],[5.2,0,0]],"linear"),N.op(".la0",12.2,[[0,1],[3,1],[3.2,0]]),N.op(".la1",12.2,[[0,0],[3,0],[3.2,1]]),N.op(".lb0",12.2,[[0,1],[3,1],[3.2,0]]),N.op(".lb1",12.2,[[0,0],[3,0],[3.2,1]]),N.op(".sn",12.2,[[0,1],[3,1],[3.2,0]]),N.op(".sp",12.2,[[0,0],[3,0],[3.2,1]]),N.op(".cn",12.2,[[0,1],[3,1],[3.2,0]]),N.op(".cp",12.2,[[0,0],[3,0],[3.2,1]])],
 steps:[[0,"Esferas idênticas: no contato,|a carga total se divide igualmente"],[3.4,"q = (+8 + (−2)) / 2 = +3 µC cada"],[6,"F = k·q·q / d² = 9·10⁹ · (3·10⁻⁶)² / 0,3²"],[8.6,"F = 0,081 / 0,09 = 0,9 N (repulsão)"]]})})();
N.calc("calc_q168","Animação passo a passo: entre duas cargas positivas de 2 e 8 microcoulombs, separadas por 0,6 metro, o campo resultante é nulo no ponto a 0,2 metro da menor carga",{h:H+10,cy:CY+10,
 s:N.ch(60,Y,1,"q₁ = 2 µC","",13)+N.ch(240,Y,1,"q₂ = 8 µC","",18)+'<path d="M120 42l7 8-7 8-7-8z" fill="var(--spark)" stroke="currentColor" stroke-width="1.5"/>'+N.t(120,34,"P")+'<g class="s2">'+N.arrow(130,160,Y-1,"an-a1",3.5)+N.t(146,Y-12,"E₁")+N.arrow(110,80,Y-1,"an-a2",3.5)+N.t(95,Y-12,"E₂")+'</g>'+N.dm(60,120,106,"x")+N.dm(60,240,134,"d = 0,6 m"),
 steps:[[0,"No ponto P, os campos de q₁ e q₂|têm sentidos opostos"],[3,"E₁ = E₂ → k·q₁ / x² = k·q₂ / (0,6 − x)²"],[6,"(0,6 − x) / x = √(8/2) = 2"],[8.6,"0,6 − x = 2x → x = 0,2 m"]]});
N.calc("calc_q169","Animação passo a passo: duas cargas de 3 e 6 microcoulombs, a 0,9 metro uma da outra, têm energia potencial elétrica de 0,18 joule",{h:H,cy:CY,
 s:N.ch(70,Y,1,"+3 µC")+N.ch(250,Y,1,"+6 µC")+N.dm(70,250,102,"d = 0,9 m")+'<path class="s3" d="M92 50c10-14 20 14 30 0s20 14 30 0 20 14 30 0 20 14 30 0" fill="none" stroke="var(--pos)" stroke-width="2.5" stroke-linecap="round"/>',
 steps:[[0,"Energia potencial do par de cargas:|U = k · q₁ · q₂ / d"],[3,"U = 9·10⁹ · 3·10⁻⁶ · 6·10⁻⁶ / 0,9"],[6,"U = 0,162 / 0,9"],[8.4,"U = 0,18 J"]]});
N.calc("calc_q170","Animação passo a passo: o potencial de uma carga de 4 microcoulombs vale 6 vezes 10 elevado a 4 volts a 0,6 metro e 3 vezes 10 elevado a 4 volts a 1,2 metro; a diferença é 3 vezes 10 elevado a 4 volts",{h:H,cy:CY,
 s:N.ch(50,Y,1,"+4 µC")+'<line x1="65" y1="50" x2="290" y2="50" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 4" stroke-opacity=".6"/><g class="s2"><circle cx="140" cy="50" r="5" fill="var(--spark)" stroke="currentColor" stroke-width="1.5"/>'+N.t(140,36,"A")+N.dm(50,140,92,"0,6 m")+'</g><g class="s3"><circle cx="230" cy="50" r="5" fill="var(--spark)" stroke="currentColor" stroke-width="1.5"/>'+N.t(230,36,"B")+N.dm(50,230,118,"1,2 m")+'</g>',
 steps:[[0,"Potencial de uma carga puntiforme:|V = k · Q / d"],[3,"V"+N.sb("A")+" = 9·10⁹ · 4·10⁻⁶ / 0,6 = 6·10⁴ V"],[5.8,"V"+N.sb("B")+" = 9·10⁹ · 4·10⁻⁶ / 1,2 = 3·10⁴ V"],[8.6,"ΔV = V"+N.sb("A")+" − V"+N.sb("B")+" = 3·10⁴ V"]]});
(function(){var px=110,py=14,L=92,a=45*Math.PI/180,x=px+L*Math.sin(a),y=py+L*Math.cos(a);
 N.calc("calc_q171","Animação passo a passo: uma esfera presa a um fio fica em equilíbrio a 45 graus da vertical sob um campo elétrico horizontal; a tangente de 45 graus é a força elétrica dividida pelo peso, e o campo vale 5 vezes 10 elevado a 4 newtons por coulomb",{h:H,cy:CY,
 s:'<line x1="'+px+'" y1="8" x2="'+px+'" y2="'+(y+10)+'" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 4" stroke-opacity=".5"/><line x1="'+(px-18)+'" y1="'+py+'" x2="'+(px+18)+'" y2="'+py+'" stroke="currentColor" stroke-width="3"/><line x1="'+px+'" y1="'+py+'" x2="'+x.toFixed(1)+'" y2="'+y.toFixed(1)+'" stroke="currentColor" stroke-width="2"/><path d="M'+px+' 36A22 22 0 0 1 '+(px+22*Math.sin(a)).toFixed(1)+' '+(py+22*Math.cos(a)).toFixed(1)+'" fill="none" stroke="currentColor" stroke-width="1.5"/>'+N.t(px-6,52,"45°",{a:"end",s:11})+'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="9" class="an-rp"/><g class="s2">'+N.varrow(x,y+10,y+44,"an-a1",3)+N.t(x+10,y+38,"m·g",{a:"start"})+N.arrow(x+10,x+54,y,"an-a2",3)+N.t(x+54,y-8,"q·E",{a:"end"})+N.ar(x-6,y-6,40,225,"an-a3",2.5)+N.t(132,56,"T",{a:"end"})+'</g><g>'+N.arrow(236,296,28,"an-a1",2)+N.arrow(236,296,50,"an-a1",2)+N.t(266,20,"E")+'</g>',
 steps:[[0,"Em equilíbrio, as forças se anulam:|tração T, peso m·g e força elétrica q·E"],[3,"No ângulo de 45°: tan 45° = q·E / (m·g)"],[5.8,"E = m·g·tan 45° / q = 0,02·10·1 / 4·10⁻⁶"],[8.6,"E = 5·10⁴ N/C"]]})})();
})();

/* ---------- para-raios: o raio atinge a ponta e a carga desce até a terra ---------- */
(function(){"use strict";var N=window.AN,T=9.5,tr=[],s="";
 s+='<rect x="0" y="140" width="320" height="30" fill="#c9a77c" opacity=".45"/><path d="M0 140H320" stroke="currentColor" stroke-width="1.5"/>';
 s+='<path transform="translate(0,2) scale(1,.7)" d="M60 30Q56 8 92 12Q108 -2 140 10Q176 0 196 16Q232 14 228 36Q224 46 190 44H100Q64 48 60 30Z" fill="#cfd6df" stroke="#8b94a3" stroke-width="1.8" class="nuv"/>';
 [[92,18],[118,20],[144,20],[170,18],[196,18]].forEach(function(p){s+=g("neg",p[0],p[1],"","−")});
 s+='<rect x="200" y="98" width="82" height="42" fill="var(--surface)" stroke="currentColor" stroke-width="2"/><path d="M192 98L241 66L290 98Z" fill="var(--surface)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><rect x="230" y="112" width="20" height="28" fill="none" stroke="currentColor" stroke-width="1.5"/>';
 s+='<line x1="150" y1="62" x2="150" y2="158" stroke="currentColor" stroke-width="3.5"/><path d="M150 52L145 64H155Z" fill="currentColor"/><rect x="132" y="158" width="36" height="5" fill="currentColor"/>';
 s+='<path d="M136 28L146 38L136 44L150 56" stroke="#f5b700" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round" class="bolt" opacity="0"/><circle cx="150" cy="54" r="16" fill="#fff3a8" class="flash" opacity="0"/>';
 s+='<text x="136" y="100" text-anchor="end" font-size="11" font-weight="700">para-raios</text><text x="241" y="157" text-anchor="middle" font-size="10" font-weight="700" opacity="0" class="pro">casa protegida</text><text x="14" y="157" font-size="10">terra</text>';
 [0,1,2].forEach(function(i){var t0=4.6+i*.7;
  s+='<g class="cr'+i+'" opacity="0"><circle cx="150" cy="72" r="9" style="fill:var(--neg);stroke:#fff;stroke-width:1.5"/><text x="150" y="77" text-anchor="middle" font-size="15" font-weight="800" style="fill:#fff">−</text></g>';
  tr.push(N.tr(".cr"+i,T,[[0,0,0],[t0,0,0],[t0+2,0,84]],"linear"),N.op(".cr"+i,T,[[0,0],[t0,0],[t0+.15,1],[t0+1.85,1],[t0+2.1,0]]))});
 tr.push(N.op(".bolt",T,[[0,0],[3.2,0],[3.25,1],[4.2,1],[4.5,0]]),N.op(".flash",T,[[0,0],[3.2,0],[3.3,.9],[3.9,0]]),N.vis(".pro",T,6.9));
 tr.push(N.op(".nuv",T,[[0,1],[3.2,1],[3.3,.7],[4.5,1]]));
 var c=N.cap(["Nuvem carregada perto da construção.|O para-raios é um condutor ligado à terra","O raio atinge a ponta do para-raios,|o ponto mais alto e mais próximo","A carga desce pelo condutor até a terra|e a casa não é atingida"],[0,2.8,5.2],T,184);
 N.reg("pararaios",{a:"Animação: uma nuvem carregada descarrega um raio na ponta de um para-raios; a carga desce pelo condutor metálico até a terra e a casa ao lado não é atingida",h:212,s:s+c.s,t:tr.concat(c.t),T:T});
 function g(c,x,y,cls,txt){return'<text class="t '+cls+' '+c+'" x="'+x+'" y="'+(y+5)+'" text-anchor="middle">'+txt+'</text>'}
})();
