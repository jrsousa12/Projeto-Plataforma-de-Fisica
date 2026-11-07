/* Eletrostática: animações novas (lote 2: forças, campo, potencial e condutores). */
(function(){"use strict";
var N=window.AN,t_=N.t,E=N.el,P=N.pl,PI=Math.PI;
var METAL='fill="#9aa6b8" fill-opacity=".55" stroke="currentColor" stroke-width="1.5"';
function bz(a,b,c,u){return[(1-u)*(1-u)*a[0]+2*(1-u)*u*b[0]+u*u*c[0],(1-u)*(1-u)*a[1]+2*(1-u)*u*b[1]+u*u*c[1]]}
function big(x,y,r,v,lab,cl){var c=v>0?"an-rp":"an-rn";return'<g class="'+(cl||"")+'"><circle cx="'+x+'" cy="'+y+'" r="'+r+'" class="'+c+'"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-size="'+Math.round(r*.9)+'" font-weight="700">'+(v>0?"+":"−")+'</text>'+(lab?t_(x,y+r+14,lab,{s:11}):"")+'</g>'}
function pth(d,cl,w){return'<path class="'+cl+'" d="'+d+'" pathLength="100" fill="none" stroke="currentColor" stroke-width="'+(w||2)+'" stroke-dasharray="100" stroke-dashoffset="0" stroke-linecap="round"/>'}
function draw(sel,T,t0,t1){return N.pr(sel,T,"strokeDashoffset",[[0,100],[t0,100],[t1,0]])}

/* ---- ação e reação entre cargas ---- */
(function(){var T=14,H=172,tr=[],s='';
 s+='<g class="g1">'+big(104,78,14,1,"q","a1")+big(216,78,22,1,"3q","b1")+N.arrow(86,46,78,"an-a2",3.5)+N.arrow(238,278,78,"an-a2",3.5)+t_(66,66,"F",{s:12})+t_(258,66,"F",{s:12})+t_(160,136,"mesmo sinal: repulsão",{s:12})+'</g>';
 tr.push(N.tr(".a1",T,[[0,10,0],[3.4,-10,0]]),N.tr(".b1",T,[[0,-10,0],[3.4,10,0]]));
 s+='<g class="g2">'+big(104,78,14,1,"+q","a2")+big(216,78,22,-1,"−3q","b2")+N.arrow(122,150,78,"an-a2",3.5)+N.arrow(192,164,78,"an-a2",3.5)+t_(136,66,"F",{s:12})+t_(178,66,"F",{s:12})+t_(160,136,"sinais opostos: atração",{s:12})+'</g>';
 tr.push(N.op(".g1",T,[[0,1],[6.4,1],[6.9,0]]),N.op(".g2",T,[[0,0],[6.9,0],[7.4,1]]));
 tr.push(N.tr(".a2",T,[[0,0,0],[7.4,-10,0],[10.4,10,0]]),N.tr(".b2",T,[[0,0,0],[7.4,10,0],[10.4,-10,0]]));
 s+=t_(160,160,"As forças têm o mesmo valor, mesmo q ≠ 3q",{s:11,c:"fin"});tr.push(N.vis(".fin",T,10.6));
 N.scene("par_forcas","Animação: duas cargas de valores diferentes, q e 3q, se repelem quando têm o mesmo sinal e se atraem quando têm sinais opostos; as duas forças têm sempre a mesma intensidade, direção oposta",H,s,tr,T,["Cargas de mesmo sinal se repelem.|As forças têm o mesmo tamanho nas duas","Trocando o sinal de uma delas,|as cargas passam a se atrair","Pela 3ª lei de Newton: ação e reação têm o|mesmo valor, mesmo com cargas diferentes"],[0,6.9,10.6])})();

/* ---- balões carregados pendurados ---- */
(function(){var T=13,H=208,tr=[],s='',pv=[[140,18],[180,18]];
 s+='<path d="M60 14H260" stroke="currentColor" stroke-width="4"/>'+N.nd(60,4,200,8,10);
 [[-1,0],[1,1]].forEach(function(o,k){var px=pv[k][0],py=pv[k][1];
  s+='<g class="bl'+k+'" style="transform-origin:'+px+'px '+py+'px"><line x1="'+px+'" y1="'+py+'" x2="'+px+'" y2="'+(py+104)+'" stroke="currentColor" stroke-width="1.8"/><circle cx="'+px+'" cy="'+(py+120)+'" r="16" class="an-rn"/><text x="'+px+'" y="'+(py+125)+'" text-anchor="middle" font-size="15" font-weight="700" class="sg">−</text></g>';
  tr.push(N.rot(".bl"+k,T,[[0,0],[1.6,0],[5,o[0]*21]]))});
tr.push(N.vis(".sg",T,.1));
 var a=20*PI/180;
 var rx=180+120*Math.sin(a),ry=18+120*Math.cos(a);
 s+='<g class="fz">'+N.arrow(rx+20,rx+66,ry,"an-a2",3)+t_(rx+60,ry-8,"Fe",{s:12})+N.varrow(rx,ry+20,ry+58,"an-a3",3)+t_(rx+14,ry+54,"P",{s:12})+N.ar(rx,ry,46,-110,"an-a1",3)+t_(rx-14,ry-40,"T",{s:12})+'</g>';
 tr.push(N.vis(".fz",T,6));
 s+=t_(160,203,"θ maior ⇒ força elétrica maior (ou balão mais leve)",{s:11,c:"fin"});tr.push(N.vis(".fin",T,8));
 N.scene("balao_fios","Animação: dois balões com cargas de mesmo sinal, pendurados por fios, se repelem e os fios se afastam da vertical; a força elétrica, o peso e a tração se equilibram",H,s,tr,T,["Dois balões neutros pendem na vertical:|só o peso e a tração atuam","Os dois são carregados com o mesmo sinal:|a repulsão elétrica afasta os balões","No equilíbrio, tração, peso e força elétrica|se anulam: os fios ficam inclinados"],[0,1.6,5.8])})();

/* ---- gráfico da força de Coulomb ---- */
(function(){var T=15,H=204,tr=[],s='',X=function(u){return 56+(u-.6)*68},Y=function(u){return 168-126/(u*u)};
 s+='<path d="M46 20V170H300" fill="none" stroke="currentColor" stroke-width="2"/>'+t_(40,24,"F",{s:12,a:"end"})+t_(296,186,"d",{s:12,a:"end"});
 var d="M"+X(.9)+" "+Y(.9);for(var u=.95;u<=4.4;u+=.1)d+="L"+X(u).toFixed(1)+" "+Y(u).toFixed(1);
 s+=pth(d,"cv",3);tr.push(draw(".cv",T,0,4.4));
 [[1,"d","F"],[2,"2d","F/4"],[3,"3d","F/9"]].forEach(function(p,k){var x=X(p[0]),y=Y(p[0]);
  s+='<g class="pt'+k+'"><line x1="'+x+'" y1="'+y+'" x2="'+x+'" y2="170" stroke="currentColor" stroke-dasharray="4 3"/><line x1="46" y1="'+y+'" x2="'+x+'" y2="'+y+'" stroke="currentColor" stroke-dasharray="4 3"/><circle cx="'+x+'" cy="'+y+'" r="5.5" fill="var(--acc)"/>'+t_(x,184,p[1],{s:11})+t_(x+8,y-10,p[2],{s:12,a:"start"})+'</g>';
  tr.push(N.vis(".pt"+k,T,3.6+3*k))});
 s+=t_(200,70,"F ∝ 1/d²",{s:15,c:"fin"})+t_(200,90,"dobrou a distância: F cai a 1/4",{s:11,c:"fin"});tr.push(N.vis(".fin",T,10.6));
 N.scene("coul_grafico","Animação: gráfico da força elétrica em função da distância; a curva cai rapidamente, pois a força é inversamente proporcional ao quadrado da distância: dobrando d, F vira um quarto; triplicando, um nono",H,s,tr,T,["A força elétrica diminui conforme as cargas|se afastam: a curva desce rápido","Dobrando a distância (2d), a força|cai para F/4","Triplicando (3d), a força cai para F/9:|F é inversamente proporcional a d²"],[0,3.6,6.6])})();

/* ---- campo elétrico x distância ---- */
(function(){var T=13,H=176,tr=[],s='',i;
 s+=big(44,84,20,1,"fonte Q","src");
 for(i=0;i<8;i++){var a=i*PI/4;s+='<line class="rad" x1="'+(44+24*Math.cos(a))+'" y1="'+(84+24*Math.sin(a))+'" x2="'+(44+80*Math.cos(a))+'" y2="'+(84+80*Math.sin(a))+'" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="3 3"/>'}
 var D=[[100,64,"r","E"],[150,16,"2r","E/4"],[200,7,"3r","E/9"]];
 D.forEach(function(d,k){var x=d[0],L=d[1];s+='<g class="e'+k+'"><circle cx="'+x+'" cy="84" r="3.5" fill="currentColor"/><g style="transform-origin:'+x+'px 84px" class="ea'+k+'">'+N.arrow(x,x+L,84,"an-a3",3.5)+'</g>'+t_(x,112,d[2],{s:12})+t_(x+Math.max(L,18)/2,70,d[3],{s:12})+'</g>';
  tr.push(N.vis(".e"+k,T,2.2+2.8*k));tr.push(N.sc(".ea"+k,T,[[0,0.01,1],[2.2+2.8*k,0.01,1],[3.4+2.8*k,1,1]]))});
 s+=t_(160,140,"E ∝ 1/r²",{s:15,c:"fin"})+t_(160,160,"2r → E/4  ·  3r → E/9",{s:11,c:"fin"});tr.push(N.vis(".fin",T,10));
 N.scene("campo_dist","Animação: o vetor campo elétrico de uma carga puntiforme diminui com a distância; em 2r vale E/4 e em 3r vale E/9, pois o campo é inversamente proporcional ao quadrado da distância",H,s,tr,T,["O campo da carga Q aponta para fora|e é mais intenso perto dela","Dobrando a distância, o módulo do campo|cai para E/4","A 3r, vale E/9: o campo é inversamente|proporcional ao quadrado da distância"],[0,4.2,7])})();

/* ---- carga de prova ---- */
(function(){var T=15,H=190,tr=[],s='';
 s+=big(44,80,20,1,"Q","src")+'<circle cx="190" cy="80" r="3" fill="currentColor"/>'+t_(190,128,"ponto P",{s:11});
 s+=N.arrow(66,176,38,"an-a3",0).replace(/^.*$/,'');
 s+='<g class="p1">'+big(190,80,8,1,"","")+N.arrow(204,244,80,"an-a2",3.5)+t_(228,66,"F",{s:12})+t_(190,146,"carga de prova q",{s:10})+'</g>';
 s+='<g class="p2">'+big(190,80,12,1,"","")+N.arrow(206,286,80,"an-a2",3.5)+t_(246,66,"2F",{s:12})+t_(190,146,"carga de prova 2q",{s:10})+'</g>';
 s+='<g class="p3">'+big(190,80,16,1,"","")+N.arrow(210,300,80,"an-a2",3.5)+t_(256,66,"3F",{s:12})+t_(190,146,"carga de prova 3q",{s:10})+'</g>';
 tr.push(N.op(".p1",T,[[0,1],[4.4,1],[4.9,0]]),N.op(".p2",T,[[0,0],[4.9,0],[5.4,1],[9.4,1],[9.9,0]]),N.op(".p3",T,[[0,0],[9.9,0],[10.4,1]]));
 var sq=N.seq("ee",160,30,["E = F / q","E = 2F / 2q = F / q","E = 3F / 3q = F / q"],[0,4.9,9.9],T,{s:12});s+=sq.s;tr=tr.concat(sq.t);
 s+=t_(160,172,"O campo no ponto P não depende da carga de prova",{s:11,c:"fin"});tr.push(N.vis(".fin",T,10.6));
 N.scene("carga_prova","Animação: ao colocar cargas de prova q, 2q e 3q no mesmo ponto, a força sobre elas dobra e triplica, mas a razão F/q, o campo elétrico, é a mesma",H,s,tr,T,["Uma carga de prova q sente a força F,|e o campo vale E = F / q","Com 2q, a força dobra para 2F,|mas E = 2F / 2q não muda","Com 3q a força é 3F e E continua igual:|o campo é da fonte, não da carga de prova"],[0,4.9,9.9])})();

/* ---- linhas de campo não se cruzam ---- */
(function(){var T=16,H=200,tr=[],s='',i;
 s+=big(86,92,16,1,"","qa")+big(234,92,16,-1,"","qb");
 var c=[[0,0],[-1,-1],[-1,1]];
 var L=[["M102 92L218 92",[102,92],[160,92],[218,92]],
 ["M100 82Q160 36 220 82",[100,82],[160,36],[220,82]],["M104 74Q160 8 216 74",[104,74],[160,8],[216,74]],
 ["M100 102Q160 148 220 102",[100,102],[160,148],[220,102]],["M104 110Q160 176 216 110",[104,110],[160,176],[216,110]]];
 L.forEach(function(l,k){s+=pth(l[0],"ln"+k,2.2);tr.push(draw(".ln"+k,T,.5+.7*k,1.7+.7*k))});
 /* carga de prova percorre uma linha */
 var pts=[];for(i=0;i<=10;i++){var q=bz(L[1][1],L[1][2],L[1][3],i/10);pts.push([5+i*.55,q[0]-100,q[1]-82])}
 s+='<g class="tp"><circle cx="100" cy="82" r="5" fill="var(--acc)"/></g>';tr.push(N.tr(".tp",T,[[0,0,0]].concat(pts.map(function(p){return[p[0]+2.5,p[1],p[2]]}))));
 s+='<g class="ng">'+t_(62,134,"mais juntas:",{s:10})+t_(62,146,"campo intenso",{s:10})+t_(160,22,"mais afastadas: campo fraco",{s:10})+'</g>';tr.push(N.vis(".ng",T,6));
 s+='<g class="x">'+'<path d="M260 150L296 186M296 150L260 186" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/><path d="M256 168H300M278 148V190" stroke="currentColor" stroke-width="1.8" stroke-dasharray="3 3"/></g>'+t_(262,198,"cruzar: impossível",{s:10,c:"x"});
 tr.push(N.vis(".x",T,10.5));
 N.scene("linhas_cruz","Animação: as linhas de campo de duas cargas opostas saem da positiva e chegam à negativa; elas ficam mais juntas onde o campo é intenso e nunca se cruzam, pois o campo teria duas direções no mesmo ponto",H,s,tr,T,["As linhas saem da carga positiva|e chegam à negativa","Uma carga de prova positiva percorre a linha:|a tangente indica a direção do campo","Mais juntas = campo mais intenso.|Nunca se cruzam: haveria 2 direções do campo"],[0,2.8,7.2])})();

/* ---- energia potencial ao aproximar ---- */
function pe(key,alt,opp){var T=13,H=186,tr=[],s='';
 s+=big(60,84,20,1,"Q fixa","fx");
 s+=big(240,84,13,opp?-1:1,"","mv");tr.push(N.tr(".mv",T,[[0,0,0],[1,0,0],[6,-110,0],[7.4,-110,0],[12,0,0]]));
 s+='<rect x="280" y="30" width="18" height="110" rx="4" fill="var(--surface)" stroke="currentColor" stroke-width="1.5"/><rect class="bar" x="281.5" y="31.5" width="15" height="107" rx="3" fill="'+(opp?"#2563eb":"#f59e0b")+'" fill-opacity=".8" style="transform-box:fill-box;transform-origin:50% 100%"/>'+t_(289,158,"Ep",{s:12});
 tr.push(N.sc(".bar",T,opp?[[0,.35],[1,.35],[6,.1],[7.4,.1],[12,.35]]:[[0,.3],[1,.3],[6,1],[7.4,1],[12,.3]]));
 s+=N.arrow(opp?210:130,opp?150:200,150,"an-a3 aa",3);
 s+=t_(160,172,opp?"se aproximam: Ep diminui (fica mais negativa)":"se aproximam: Ep aumenta · se afastam: Ep diminui",{s:11,c:"fin"});tr.push(N.vis(".fin",T,6.6));
 s+=t_(160,34,opp?"cargas opostas se atraem":"cargas iguais se repelem",{s:12});
 N.scene(key,alt,H,s,tr,T,opp?["Cargas de sinais opostos se atraem:|a móvel se aproxima da fixa","Aproximando, a energia potencial diminui:|ela fica cada vez mais negativa","Afastando, a energia potencial sobe:|é preciso realizar trabalho"]:["Cargas de mesmo sinal se repelem:|empurrar a móvel exige trabalho","Aproximando, a energia potencial aumenta:|o trabalho fica armazenado","Ao largar, ela se afasta e a energia potencial|diminui, virando energia cinética"],[0,1.2,6.8])}
pe("pot_energia_igual","Animação: uma carga positiva é empurrada contra outra carga positiva fixa; ao se aproximar, a energia potencial elétrica aumenta e, ao se afastar, diminui",false);
pe("pot_energia_oposta","Animação: uma carga negativa se aproxima de uma carga positiva fixa; ao se aproximar, a energia potencial elétrica diminui e fica mais negativa",true);

/* ---- superfícies equipotenciais ---- */
(function(){var T=16,H=216,tr=[],s='',i,cx=160,cy=112;
 s+=big(cx,cy,14,1,"","src");
 [[34,"90 V"],[58,"60 V"],[82,"45 V"]].forEach(function(r){s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r[0]+'" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="5 4" stroke-opacity=".7"/>'+t_(cx+r[0]*.71+4,cy-r[0]*.71,r[1],{s:9,a:"start"})});
 for(i=0;i<8;i++){var a=i*PI/4+PI/8;s+='<line x1="'+(cx+18*Math.cos(a))+'" y1="'+(cy+18*Math.sin(a))+'" x2="'+(cx+34*Math.cos(a))+'" y2="'+(cy+34*Math.sin(a))+'" stroke="currentColor" stroke-opacity=".4"/>'}
 /* carga de prova percorre a circunstância de 58 e depois sai radialmente */
 var pts=[],R=58;for(i=0;i<=12;i++){var a=-PI/2+i*(PI*1.5/12);pts.push([i*.4,R*Math.cos(a),R*Math.sin(a)])}
 var x0=pts[12][1],y0=pts[12][2];
 s+='<g class="tp"><circle cx="'+(cx+x0)+'" cy="'+(cy+y0)+'" r="6" class="an-rp"/><text x="'+(cx+x0)+'" y="'+(cy+y0+4)+'" text-anchor="middle" font-size="11" font-weight="700">+</text></g>';
 var offs=pts.map(function(p){return[p[0]+.8,p[1]-x0,p[2]-y0]});
 /* último trecho: sai radialmente para fora (para 82 V -> aqui, para dentro da de 34) */
 var fx=0.55*x0,fy=0.55*y0;
 tr.push(N.tr(".tp",T,offs.concat([[8.6,offs[12][1],offs[12][2]]]).map(function(p){return p}).concat([[11.4,fx-x0,fy-y0]])));
 var q=N.seq("w",160,14,["W = 0","W = 0","W ≠ 0"],[0,0,8.6],T,{s:13});
 s=s.replace(/$/,'')+q.s;tr=tr.concat(q.t);
 s+=t_(160,206,"na mesma superfície: ΔV = 0 ⇒ W = q·ΔV = 0",{s:11,c:"fin1"})+t_(160,206,"ao mudar de superfície: ΔV ≠ 0 ⇒ W ≠ 0",{s:11,c:"fin2"});
 tr.push(N.op(".fin1",T,[[0,0],[4,0],[4.4,1],[8.4,1],[8.8,0]]),N.vis(".fin2",T,9));
 N.scene("equip","Animação: ao redor de uma carga positiva há superfícies equipotenciais circulares; uma carga de prova que se move sobre a mesma superfície não recebe trabalho da força elétrica, e ao mudar de superfície há trabalho",H,s,tr,T,["Em torno da carga, cada círculo tracejado|tem o mesmo potencial em todos os pontos","Ao longo da mesma equipotencial (60 V):|ΔV = 0 e o trabalho da força elétrica é zero","Mudando de superfície, ΔV ≠ 0:|há trabalho, W = q · ΔV"],[0,.6,8.6])})();

/* ---- potencial: soma escalar ---- */
(function(){var T=13,H=190,tr=[],s='';
 s+=big(70,128,16,1,"Q₁","a")+big(250,128,16,-1,"Q₂","b")+'<circle cx="160" cy="48" r="5" fill="var(--acc)"/>'+t_(160,34,"ponto P",{s:11});
 s+='<g class="l1"><line x1="84" y1="118" x2="154" y2="52" stroke="currentColor" stroke-width="1.8" stroke-dasharray="5 3"/></g><g class="l2"><line x1="236" y1="118" x2="166" y2="52" stroke="currentColor" stroke-width="1.8" stroke-dasharray="5 3"/></g>';
 s+='<g class="v1">'+t_(94,76,"V₁ = +30 V",{s:12,a:"middle"})+'</g><g class="v2">'+t_(226,76,"V₂ = −10 V",{s:12})+'</g><g class="vt">'+t_(160,176,"V = V₁ + V₂ = +30 + (−10) = +20 V",{s:13})+'</g>';
 tr.push(draw(".l1",T,0,0));
 tr.push(N.vis(".v1",T,1.4),N.vis(".v2",T,4.4),N.vis(".vt",T,8));
 tr.push(N.pr(".l1",T,"opacity",[[0,0],[1,1]]),N.pr(".l2",T,"opacity",[[0,0],[4,0],[4.4,1]]));
 N.scene("pot_soma","Animação: o potencial elétrico em um ponto devido a duas cargas é a soma algébrica (escalar) dos potenciais de cada carga; por exemplo, +30 V mais −10 V dá +20 V",H,s,tr,T,["A carga Q₁ (positiva) cria em P|um potencial positivo, V₁","A carga Q₂ (negativa) cria em P|um potencial negativo, V₂","Potencial é escalar: basta somar com os sinais.|V = V₁ + V₂ (sem vetores)"],[0,1.4,5.2])})();

/* ---- condutor: potencial constante e campo perpendicular ---- */
(function(){var T=16,H=202,tr=[],s='',i,cx=136,cy=94,rx=84,ry=48;
 s+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" '+METAL+'/>';
 for(i=0;i<10;i++){var a=i*PI/5;s+=E(cx+(rx-12)*Math.cos(a),cy+(ry-10)*Math.sin(a),"")}
 /* sonda e leituras */
 [[cx-30,cy-ry-26,cx-30,cy-ry+4,"A"],[cx+rx+26,cy,cx+rx-4,cy,"B"],[cx+10,cy+10,cx+10,cy+10,"C"]].forEach(function(p,k){var cl="pr"+k;
  s+='<g class="'+cl+'"><line x1="'+p[0]+'" y1="'+p[1]+'" x2="'+p[2]+'" y2="'+p[3]+'" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/><circle cx="'+p[2]+'" cy="'+p[3]+'" r="3" fill="#dc2626"/>'+t_(p[0]+(k===1?24:0),p[1]-(k===1?0:6)+(k===2?30:0),k===2?"C: 50 V":p[4]+": 50 V",{s:11})+'</g>';tr.push(N.vis("."+cl,T,1.6+2.4*k))});
 for(i=0;i<6;i++){var a=i*PI/3+PI/6,nx=Math.cos(a)/rx,ny=Math.sin(a)/ry,m=Math.sqrt(nx*nx+ny*ny);nx/=m;ny/=m;
  var x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a);if(i===0||i===3||i===5)continue;s+='<g class="nf"><g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+(Math.atan2(ny,nx)*180/PI).toFixed(1)+')">'+N.arrow(0,28,0,"an-a3",2.5)+'</g></g>'}
 tr.push(N.vis(".nf",T,9.2));
 s+=t_(160,176,"mesmo potencial em todo o condutor e na superfície",{s:11,c:"f1"})+t_(160,194,"campo externo ⟂ à superfície · campo interno nulo",{s:11,c:"f2"});
 tr.push(N.op(".f1",T,[[0,0],[7,0],[7.4,1]]),N.vis(".f2",T,10));
 N.scene("pot_cond","Animação: em um condutor carregado em equilíbrio, voltímetros ligados a qualquer ponto, até no interior, marcam o mesmo potencial; o campo na superfície é perpendicular a ela e dentro é nulo",H,s,tr,T,["O condutor está carregado e em equilíbrio:|as cargas ficam paradas","Medindo o potencial em A, B e C (interior),|todos os pontos marcam 50 V","Potencial constante ⇒ não há ΔV na superfície:|o campo é perpendicular a ela, e nulo dentro"],[0,1.6,9])})();

/* ---- esferas ligadas por fio ---- */
(function(){var T=14,H=206,tr=[],s='',i;
 s+='<circle cx="80" cy="100" r="32" '+METAL+'/><circle cx="220" cy="100" r="60" '+METAL+'/><path d="M110 94H168" stroke="currentColor" stroke-width="3"/>'+t_(80,150,"R",{s:12})+t_(220,178,"2R",{s:12});
 var sp=[[70,88],[92,88],[70,112],[92,112],[81,100],[81,126]];
 for(i=0;i<2;i++)s+=P(sp[i][0],sp[i][1],"");
 /* esfera pequena: 6 cargas + e 4 elétrons chegam; sobram +2 */
 for(i=2;i<6;i++)s+=P(sp[i][0],sp[i][1],"");
 var bp=[[196,82],[220,82],[244,82],[208,114],[232,114],[220,136]];
 for(i=0;i<4;i++)s+=P(bp[i][0],bp[i][1],"");
 for(i=0;i<4;i++){s+=E(sp[2+i][0],sp[2+i][1],"mv"+i);var dx=bp[i][0]-sp[2+i][0],dy=bp[i][1]-sp[2+i][1];
  tr.push(N.tr(".mv"+i,T,[[0,dx,dy],[1.6+.7*i,dx,dy],[2.2+.7*i,dx*.4,dy*.4-14],[4.6+.7*i,0,0]]))}
 var q1=N.seq("q1",80,22,["Q₁ = +6","Q₁ = +2"],[0,7.6],T,{s:12}),q2=N.seq("q2",220,22,["Q₂ = 0","Q₂ = +4"],[0,7.6],T,{s:12}),v=N.seq("vv",160,196,["V₁ = 6 · V₂ = 0 (potenciais diferentes)","V₁ = V₂ = 2 · carga final ∝ raio (Q₂ = 2·Q₁)"],[0,7.6],T,{s:11});
 s+=q1.s+q2.s+v.s;tr=tr.concat(q1.t,q2.t,v.t);
 N.scene("esferas_fio","Animação: duas esferas condutoras de raios R e 2R são ligadas por um fio; as cargas se redistribuem até os potenciais ficarem iguais e a esfera maior fica com o dobro da carga",H,s,tr,T,["As esferas estão em potenciais diferentes:|a pequena é positiva e a grande é neutra","Com o fio, elétrons da grande passam para a|pequena até os potenciais se igualarem","Equilíbrio: mesmo potencial nas duas.|A carga é proporcional ao raio"],[0,1.4,5.2])})();

/* ---- gota de óleo em equilíbrio ---- */
(function(){var T=14,H=196,tr=[],s='',i;
 s+='<rect x="60" y="20" width="200" height="12" '+METAL+'/><rect x="60" y="150" width="200" height="12" '+METAL+'/>'+t_(46,30,"+",{s:15,a:"end"})+t_(46,160,"−",{s:15,a:"end"});
 for(i=0;i<8;i++)s+='<text x="'+(76+i*24)+'" y="46" font-size="11" text-anchor="middle" class="pz">+</text><text x="'+(76+i*24)+'" y="146" font-size="11" text-anchor="middle" class="nz">−</text>';
 s+='<g class="E">';for(i=0;i<4;i++)s+=N.varrow(92+i*46,56,120,"an-a3",2);s+=t_(250,92,"E",{s:13})+'</g>';tr.push(N.vis(".E",T,4.4));
 s+='<g class="drop"><circle cx="160" cy="92" r="12" class="an-rn"/><text x="160" y="97" text-anchor="middle" font-size="14" font-weight="700">−</text></g>';
 tr.push(N.tr(".drop",T,[[0,0,-30],[3.8,0,40],[4.4,0,40],[8,0,0]]));
 s+='<g class="fz">'+N.varrow(160,108,150,"an-a1",3)+t_(180,138,"P",{s:13,a:"start"})+N.varrow(160,76,34,"an-a2",3)+t_(180,54,"Fe",{s:13,a:"start"})+'</g>';tr.push(N.vis(".fz",T,8.4));
 s+=t_(160,184,"Fe = P  ⇒  q · E = m · g",{s:13,c:"fin"});tr.push(N.vis(".fin",T,9.6));
 N.scene("gota_oleo","Animação: uma gota de óleo com carga negativa cai entre duas placas; ao ligar o campo elétrico, sobe e fica em equilíbrio quando a força elétrica para cima iguala o peso",H,s,tr,T,["Sem campo, a gota cai pela ação do peso","Ao ligar a tensão, surge o campo (de + para −);|a carga negativa sofre força para cima","A gota para quando a força elétrica iguala|o peso: q · E = m · g"],[0,4.4,8.4])})();

/* ---- carga positiva abandonada ---- */
(function(){var T=14,H=190,tr=[],s='',i;
 s+='<defs><linearGradient id="gv" x1="0" x2="1"><stop offset="0" stop-color="#ef4444" stop-opacity=".35"/><stop offset="1" stop-color="#3b82f6" stop-opacity=".35"/></linearGradient></defs><rect x="30" y="30" width="250" height="80" rx="6" fill="url(#gv)" stroke="currentColor" stroke-width="1.5"/>'+t_(44,24,"V alto",{s:11,a:"start"})+t_(266,24,"V baixo",{s:11,a:"end"});
 for(i=0;i<3;i++)s+=N.arrow(60,250,50+i*28,"an-a3",1.8).replace(/class="an-a3"/,'class="an-a3" opacity=".5"');
 s+='<g class="ch">'+big(250,70,11,1,"","")+'</g>';tr.push(N.tr(".ch",T,[[0,-190,0],[1.4,-190,0],[7,0,0]],"ease-in"));
 s+='<g class="vel">'+N.arrow(262,300,70,"an-a2",3)+t_(285,60,"v",{s:12})+'</g>';tr.push(N.sc(".vel",T,[[0,.01,1],[1.4,.01,1],[7,1,1]]));
 s=s.replace('<g class="vel">','<g class="vel" style="transform-origin:262px 70px">');
 s+='<text x="40" y="136" font-size="11" font-weight="700">Ep</text><rect x="62" y="126" width="100" height="10" fill="#f59e0b" fill-opacity=".8" class="ep" style="transform-box:fill-box;transform-origin:0 50%"/><text x="40" y="156" font-size="11" font-weight="700">Ec</text><rect x="62" y="146" width="100" height="10" fill="#10b981" fill-opacity=".8" class="ec" style="transform-box:fill-box;transform-origin:0 50%"/>';
 tr.push(N.sc(".ep",T,[[0,1,1],[1.4,1,1],[7,.1,1]]),N.sc(".ec",T,[[0,.01,1],[1.4,.01,1],[7,1,1]]));
 s+=t_(160,180,"Ep + Ec = constante: a energia se transforma",{s:11,c:"fin"});tr.push(N.vis(".fin",T,7));
 N.scene("pos_livre","Animação: uma carga positiva abandonada em repouso em um campo elétrico é empurrada para os pontos de menor potencial; a energia potencial diminui e a cinética aumenta",H,s,tr,T,["A carga positiva é largada em repouso|em um ponto de potencial alto","A força elétrica a empurra no sentido do campo,|para potenciais menores, e a velocidade aumenta","A energia potencial vira cinética:|Ep + Ec permanece constante"],[0,1.4,7])})();

/* ---- volt e elétron-volt ---- */
(function(){var T=15,H=200,tr=[],s='';
 s+='<rect x="40" y="18" width="10" height="64" '+METAL+'/><rect x="270" y="18" width="10" height="64" '+METAL+'/>'+t_(45,96,"0 V",{s:10})+t_(275,96,"1 V",{s:10})+'<rect x="40" y="112" width="10" height="64" '+METAL+'/><rect x="270" y="112" width="10" height="64" '+METAL+'/>'+t_(45,190,"0 V",{s:10})+t_(275,190,"1 V",{s:10});
  s=s.replace('big','big');
 s+='<g class="c1b">'+big(70,50,15,1,"1 C","")+'</g>';
 tr.push(N.tr(".c1b",T,[[0,180,0],[1,180,0],[4.4,0,0]]));
 s+='<g class="e2">'+big(250,144,10,-1,"e⁻","")+'</g>';tr.push(N.tr(".e2",T,[[0,-180,0],[6.4,-180,0],[9.8,0,0]]));
 s+=N.seq("j",160,12,["carga positiva de 1 C em 1 V: energia potencial","cai para 0 V: ganha 1 J","1 V = 1 J/C"],[0,4.4,5.4],T,{s:11}).s+N.seq("ev",160,108,["elétron em 0 V, em repouso","vai a 1 V: ganha 1 eV","1 eV = 1,6·10⁻¹⁹ J"],[0,9.8,10.8],T,{s:11}).s;
 tr=tr.concat(N.seq("j",0,0,["a","b","c"],[0,4.4,5.4],T).t,N.seq("ev",0,0,["a","b","c"],[0,9.8,10.8],T).t);
 N.scene("volt_ev","Animação: uma carga de 1 coulomb que atravessa uma diferença de potencial de 1 volt ganha 1 joule, e um elétron que atravessa 1 volt ganha 1 elétron-volt de energia",H,s,tr,T,["Volt é joule por coulomb:|1 V = 1 J/C","Uma carga de 1 C ao cruzar 1 V|ganha 1 J de energia","O elétron-volt é a energia de um elétron|ao cruzar 1 V: unidade de energia, não de potencial"],[0,2,8])})();

/* ---- força elétrica x gravitacional ---- */
(function(){var T=13,H=176,tr=[],s='';
 s+='<text x="20" y="46" font-size="12" font-weight="700">Fe</text><rect x="52" y="34" width="230" height="16" rx="4" fill="#f59e0b" fill-opacity=".8" class="b1" style="transform-box:fill-box;transform-origin:0 50%"/>'+t_(52,70,"≈ 10⁻⁷ N",{s:11,a:"start"});
 s+='<text x="20" y="102" font-size="12" font-weight="700">Fg</text><rect x="52" y="90" width="4" height="16" rx="2" fill="#3b82f6" class="b2" style="transform-box:fill-box;transform-origin:0 50%"/>'+t_(62,126,"≈ 10⁻⁴⁷ N",{s:11,a:"start"});
 tr.push(N.sc(".b1",T,[[0,.01,1],[.4,.01,1],[3.6,1,1]]),N.sc(".b2",T,[[0,.01,1],[4,.01,1],[5,1,1]]));
 s+='<text x="160" y="152" font-size="14" text-anchor="middle" font-weight="700" class="fin">Fe / Fg ≈ 10⁴⁰ (um número com 40 zeros)</text>';tr.push(N.vis(".fin",T,7));
 N.scene("grav_vs_ele","Animação: entre um próton e um elétron, a força elétrica vale cerca de 10 elevado a menos 7 newtons e a gravitacional cerca de 10 elevado a menos 47, uma razão de aproximadamente 10 elevado a 40",H,s,tr,T,["Entre um próton e um elétron, a força|elétrica é bem perceptível","A atração gravitacional é minúscula,|bilhões de bilhões de vezes menor","Por isso, na escala atômica, a gravidade|é desprezível diante da força elétrica"],[0,3.6,7])})();
})();
