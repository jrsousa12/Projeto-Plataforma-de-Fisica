/* Eletrostática: resoluções passo a passo animadas (cálculos) — lote 3. */
(function(){"use strict";
var N=window.AN,t_=N.t,E=N.el,P=N.pl,PI=Math.PI;
var METAL='fill="#9aa6b8" fill-opacity=".55" stroke="currentColor" stroke-width="1.5"';
function big(x,y,r,v,lab,cl){var c=v>0?"an-rp":"an-rn";return'<g class="'+(cl||"")+'"><circle cx="'+x+'" cy="'+y+'" r="'+r+'" class="'+c+'"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-size="'+Math.round(r*.9)+'" font-weight="700">'+(v>0?"+":"−")+'</text>'+(lab?t_(x,y+r+14,lab,{s:11}):"")+'</g>'}
function S(k,body){return'<g class="s'+k+'">'+body+'</g>'}
function pulse(sel,T,t0){return N.sc(sel,T,[[0,1],[t0,1],[t0+.5,1.12],[t0+1,1],[t0+1.5,1.12],[t0+2,1]])}
/* dois corpos com força (ou energia) */
function coul(key,alt,o){var H=170,T,s='',tr=[],opp=o.sa!==o.sb,ax=84,bx=236,y=62;
 s+=big(ax,y,18,o.sa,o.la,"ca")+big(bx,y,18,o.sb,o.lb,"cb");
 s+=N.dm(ax,bx,108,o.d,"dm");
 s+=S(3,t_(160,132,o.d2,{s:11}));
 if(o.ep){s+=S(4,'<rect x="106" y="50" width="108" height="24" rx="12" fill="#f59e0b" fill-opacity=".35" stroke="#f59e0b" stroke-width="2"/>'+t_(160,67,"Ep = "+o.res,{s:13}))}
 else{var l=48;s+=S(4,(opp?N.arrow(ax+22,ax+22+l,y,"an-a2",4)+N.arrow(bx-22,bx-22-l,y,"an-a2",4):N.arrow(ax-22,ax-22-l,y,"an-a2",4)+N.arrow(bx+22,bx+22+l,y,"an-a2",4))+t_(160,38,"F = "+o.res+(opp?" (atração)":" (repulsão)"),{s:13}))}
 var st=o.steps,tt=st[st.length-1][0];T=tt+3.6;
 tr.push(N.sc(".ca",T,[[0,1],[tt,1],[tt+.5,1.15],[tt+1.1,1]]),N.sc(".cb",T,[[0,1],[tt,1],[tt+.5,1.15],[tt+1.1,1]]));
 var c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H);
 for(var k=1;k<st.length;k++)tr.push(N.vis(".s"+(k+1),T,st[k][0]));
 N.reg(key,{a:alt,h:H,s:s+c.s,t:tr.concat(c.t),T:T})}
function STP(a,b,c,d){return[[0,a],[2.6,b],[5.2,c],[8,d]]}
coul("calc_q023","Animação passo a passo: duas cargas positivas de 2 e 3 microcoulombs a 0,3 metro se repelem com força de 0,6 newton",{sa:1,sb:1,la:"+2 µC",lb:"+3 µC",d:"d = 0,3 m",d2:"d² = 0,09 m²",res:"0,6 N",steps:STP("Cargas de mesmo sinal se repelem.|d = 0,3 m","F = k · q₁ · q₂ / d²","F = 9·10⁹ · 2·10⁻⁶ · 3·10⁻⁶ / 0,3²","F = 5,4·10⁻² / 0,09 = 0,6 N")});
coul("calc_q064","Animação passo a passo: uma carga de mais 1 e outra de menos 1 microcoulomb, a 0,1 metro, se atraem com força de 0,9 newton",{sa:1,sb:-1,la:"+1 µC",lb:"−1 µC",d:"d = 0,1 m",d2:"d² = 0,01 m²",res:"0,9 N",steps:STP("Cargas de sinais opostos se atraem.|d = 0,1 m","F = k · |q₁| · |q₂| / d²","F = 9·10⁹ · 10⁻⁶ · 10⁻⁶ / 0,1²","F = 9·10⁻³ / 0,01 = 0,9 N")});
coul("calc_q067","Animação passo a passo: duas cargas de mais 2 microcoulombs a 0,6 metro se repelem com força de 0,1 newton",{sa:1,sb:1,la:"+2 µC",lb:"+2 µC",d:"d = 0,6 m",d2:"d² = 0,36 m²",res:"0,1 N",steps:STP("Cargas iguais se repelem.|d = 0,6 m","F = k · q₁ · q₂ / d²","F = 9·10⁹ · 2·10⁻⁶ · 2·10⁻⁶ / 0,6²","F = 3,6·10⁻² / 0,36 = 0,1 N")});
coul("calc_q126","Animação passo a passo: duas cargas de mais 4 microcoulombs a 0,2 metro se repelem com força de 3,6 newtons",{sa:1,sb:1,la:"+4 µC",lb:"+4 µC",d:"d = 0,2 m",d2:"d² = 0,04 m²",res:"3,6 N",steps:STP("Cargas iguais se repelem.|d = 0,2 m","F = k · q₁ · q₂ / d²","F = 9·10⁹ · 4·10⁻⁶ · 4·10⁻⁶ / 0,2²","F = 0,144 / 0,04 = 3,6 N")});
coul("calc_q093","Animação passo a passo: a energia potencial de duas cargas de mais 2 e mais 3 microcoulombs separadas por 0,6 metro é 0,09 joule",{sa:1,sb:1,la:"+2 µC",lb:"+3 µC",d:"d = 0,6 m",d2:"energia armazenada ao aproximar as cargas",res:"0,09 J",ep:1,steps:STP("Duas cargas de mesmo sinal,|a 0,6 m uma da outra","Ep = k · q₁ · q₂ / d","Ep = 9·10⁹ · 2·10⁻⁶ · 3·10⁻⁶ / 0,6","Ep = 5,4·10⁻² / 0,6 = 0,09 J")});

/* campo e potencial de carga puntiforme */
function fonte(key,alt,o){var H=176,s='',tr=[],i,sx=60,y=82,px=240;
 for(i=0;i<8;i++){var a=i*PI/4;s+='<line x1="'+(sx+24*Math.cos(a)).toFixed(1)+'" y1="'+(y+24*Math.sin(a)).toFixed(1)+'" x2="'+(sx+(o.pot?0:44)*Math.cos(a)+(o.pot?0:0)).toFixed(1)+'" y2="'+(y+(o.pot?0:44)*Math.sin(a)).toFixed(1)+'" stroke="currentColor" stroke-opacity="'+(o.pot?0:.3)+'" stroke-dasharray="3 3"/>'}
 if(o.pot)[[44,.55],[76,.4],[104,.3]].forEach(function(r){s+='<circle cx="'+sx+'" cy="'+y+'" r="'+(r[0]*1)+'" fill="none" stroke="currentColor" stroke-opacity="'+r[1]+'" stroke-dasharray="5 4"/>'});
 s+=big(sx,y,20,o.sg,"Q = "+o.Q,"src")+'<circle cx="'+px+'" cy="'+y+'" r="5" fill="var(--acc)"/>'+t_(px,y+22,"P",{s:12})+N.dm(sx,px,128,"r = "+o.r,"dm")+S(3,t_(150,150,o.r2,{s:11}));
 s+=S(4,o.pot?'<g><rect x="196" y="38" width="88" height="24" rx="12" fill="#f59e0b" fill-opacity=".3" stroke="#f59e0b" stroke-width="2"/>'+t_(240,55,"V = "+o.res,{s:13})+'</g>':N.arrow(px+10,px+(o.sg>0?58:-0),y,"an-a3",4)+t_(px+34,y-12,"E = "+o.res,{s:12}));
 var st=o.steps,T=st[st.length-1][0]+3.6,c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H);
 for(var k=1;k<st.length;k++)tr.push(N.vis(".s"+(k+1),T,st[k][0]));
 tr.push(N.sc(".src",T,[[0,1],[st[3][0],1],[st[3][0]+.5,1.15],[st[3][0]+1.1,1]]));
 N.reg(key,{a:alt,h:H,s:s+c.s,t:tr.concat(c.t),T:T})}
fonte("calc_q033","Animação passo a passo: o campo elétrico a 0,3 metro de uma carga de 2 microcoulombs vale 2 vezes 10 elevado a 5 newtons por coulomb",{sg:1,Q:"+2 µC",r:"0,3 m",r2:"r² = 0,09 m²",res:"2·10⁵ N/C",steps:STP("Carga +2 µC cria campo que|aponta para fora. P está a 0,3 m","E = k · Q / r²","E = 9·10⁹ · 2·10⁻⁶ / 0,3²","E = 1,8·10⁴ / 0,09 = 2·10⁵ N/C")});
fonte("calc_q077","Animação passo a passo: o campo a 1 metro de uma carga de 1 microcoulomb vale 9 vezes 10 elevado a 3 newtons por coulomb",{sg:1,Q:"+1 µC",r:"1 m",r2:"r² = 1 m²",res:"9·10³ N/C",steps:STP("Carga +1 µC; o ponto P|está a 1 m dela","E = k · Q / r²","E = 9·10⁹ · 10⁻⁶ / 1²","E = 9·10³ / 1 = 9·10³ N/C")});
fonte("calc_q037","Animação passo a passo: o potencial a 2 metros de uma carga de 4 microcoulombs vale 1,8 vezes 10 elevado a 4 volts",{sg:1,pot:1,Q:"+4 µC",r:"2 m",r2:"V = k · Q / r (r sem quadrado!)",res:"1,8·10⁴ V",steps:STP("Carga +4 µC; P está a 2 m.|O potencial é escalar","V = k · Q / r","V = 9·10⁹ · 4·10⁻⁶ / 2","V = 3,6·10⁴ / 2 = 1,8·10⁴ V")});
fonte("calc_q084","Animação passo a passo: o potencial a 3 metros de uma carga de menos 6 microcoulombs vale menos 1,8 vezes 10 elevado a 4 volts",{sg:-1,pot:1,Q:"−6 µC",r:"3 m",r2:"o sinal da carga entra na conta",res:"−1,8·10⁴ V",steps:STP("Carga negativa (−6 µC); P a 3 m.|O potencial também é negativo","V = k · Q / r","V = 9·10⁹ · (−6·10⁻⁶) / 3","V = −5,4·10⁴ / 3 = −1,8·10⁴ V")});

/* trabalho = q · ΔV */
function trab(key,alt,o){var H=180,s='',tr=[],y=84,ax=80,bx=240;
 s+='<rect x="'+(ax-30)+'" y="24" width="60" height="100" rx="6" fill="#ef4444" fill-opacity=".15" stroke="currentColor" stroke-dasharray="5 3"/><rect x="'+(bx-30)+'" y="24" width="60" height="100" rx="6" fill="#3b82f6" fill-opacity=".15" stroke="currentColor" stroke-dasharray="5 3"/>'+t_(ax,18,o.va,{s:12})+t_(bx,18,o.vb,{s:12});
 s+='<g class="mv">'+big(bx,y,13,1,"","")+'</g>'+t_(ax,140,o.q,{s:11,c:"ql"});
 s+=N.arrow(ax+36,bx-36,y,"an-a3 ar",3);
 s+=S(3,t_(160,50,o.dv,{s:12}))+S(4,'<rect x="94" y="146" width="132" height="26" rx="13" fill="#10b981" fill-opacity=".25" stroke="#10b981" stroke-width="2"/>'+t_(160,164,o.w+" = "+o.res,{s:13}));
 var st=o.steps,T=st[3][0]+3.6,c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H);
 for(var k=1;k<st.length;k++)tr.push(N.vis(".s"+(k+1),T,st[k][0]));
 tr.push(N.tr(".mv",T,[[0,-160,0],[st[1][0]-.4,-160,0],[st[3][0]-.6,0,0]]));
 N.reg(key,{a:alt,h:H,s:s+c.s,t:tr.concat(c.t),T:T})}
trab("calc_q038","Animação passo a passo: uma carga de 2 microcoulombs que atravessa uma diferença de potencial de 100 volts recebe trabalho de 2 vezes 10 elevado a menos 4 joules",{va:"VA",vb:"VB",q:"q = 2 µC",dv:"U = 100 V",w:"W",res:"2·10⁻⁴ J",steps:STP("Carga de 2 µC vai de A para B,|com diferença de potencial U = 100 V","W = q · U","W = 2·10⁻⁶ · 100","W = 2·10⁻⁴ J")});
trab("calc_q149","Animação passo a passo: uma carga de 3 microcoulombs que atravessa uma diferença de potencial de 50 volts recebe trabalho de 1,5 vez 10 elevado a menos 4 joules",{va:"VA",vb:"VB",q:"q = 3 µC",dv:"U = 50 V",w:"W",res:"1,5·10⁻⁴ J",steps:STP("Carga de 3 µC vai de A para B,|com U = 50 V","W = q · U","W = 3·10⁻⁶ · 50","W = 1,5·10⁻⁴ J")});
trab("calc_q085","Animação passo a passo: uma carga de 5 microcoulombs levada de um ponto a 20 volts para outro a 120 volts tem a energia potencial aumentada em 5 vezes 10 elevado a menos 4 joules",{va:"20 V",vb:"120 V",q:"q = 5 µC",dv:"ΔV = 120 − 20 = 100 V",w:"ΔEp",res:"5·10⁻⁴ J",steps:STP("Carga de 5 µC vai de 20 V para 120 V","ΔEp = q · (V₂ − V₁)","ΔEp = 5·10⁻⁶ · (120 − 20)","ΔEp = 5·10⁻⁶ · 100 = 5·10⁻⁴ J")});
trab("calc_q111","Animação passo a passo: uma bateria de 1,5 volt move 2 coulombs de carga e fornece 3 joules de energia",{va:"− bateria",vb:"+ bateria",q:"q = 2 C",dv:"U = 1,5 V",w:"W",res:"3 J",steps:STP("A bateria de 1,5 V move|2 C de carga pelo circuito","W = q · U","W = 2 · 1,5","W = 3 J")});

/* campo uniforme entre placas: U = E·d */
(function(){var H=170,s='',tr=[],i;
 s+='<rect x="60" y="24" width="200" height="12" '+METAL+'/><rect x="60" y="118" width="200" height="12" '+METAL+'/>'+t_(48,34,"+",{s:15,a:"end"})+t_(48,128,"−",{s:15,a:"end"});
 for(i=0;i<5;i++)s+=N.varrow(90+i*35,42,110,"an-a3",2);
 s+=t_(278,80,"E = 200 V/m",{s:11,a:"end"}).replace('x="278"','x="304"');
 s+=N.dv(44,36,118,"d = 0,5 m","dd");
 s+=S(3,t_(160,150,"U = E · d  (ao longo do campo)",{s:11}))+S(4,'<rect x="104" y="146" width="112" height="22" rx="11" fill="#f59e0b" fill-opacity=".3" stroke="#f59e0b" stroke-width="2"/>'+t_(160,162,"U = 100 V",{s:13}));
 s=s.replace(S(3,t_(160,150,"U = E · d  (ao longo do campo)",{s:11})),"");
 var st=STP("Campo uniforme de 200 V/m entre|pontos separados por d = 0,5 m","U = E · d","U = 200 · 0,5","U = 100 V"),T=st[3][0]+3.6,c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H);
 for(var k=1;k<st.length;k++)tr.push(N.vis(".s"+(k+1),T,st[k][0]));
 N.reg("calc_q089",{a:"Animação passo a passo: em um campo uniforme de 200 volts por metro, dois pontos a 0,5 metro um do outro, ao longo do campo, têm diferença de potencial de 100 volts",h:H,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* F = q · E */
function fe(key,alt,o){var H=170,s='',tr=[],i;
 for(i=0;i<3;i++)s+=N.arrow(30,290,34+i*46,"an-a3",1.8).replace(/class="an-a3"/,'class="an-a3" opacity=".4"');
 s+=t_(300,24,"E = "+o.E,{s:11,a:"end"});
 s+='<g class="qq">'+big(120,80,16,1,o.q,"")+'</g>'+S(4,N.arrow(140,244,80,"an-a2",4)+t_(196,64,"F = "+o.res,{s:13}));
 var st=o.steps,T=st[3][0]+3.6,c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H);
 for(var k=1;k<st.length;k++)tr.push(N.vis(".s"+(k+1),T,st[k][0]));
 tr.push(N.tr(".qq",T,[[0,0,0],[st[3][0],0,0],[st[3][0]+.8,16,0],[st[3][0]+1.6,0,0]]));
 N.reg(key,{a:alt,h:H,s:s+c.s,t:tr.concat(c.t),T:T})}
fe("calc_q073","Animação passo a passo: uma carga de 2 microcoulombs em um campo de 3 vezes 10 elevado a 5 newtons por coulomb sofre força de 0,6 newton",{q:"+2 µC",E:"3·10⁵ N/C",res:"0,6 N",steps:STP("Carga de 2 µC em um campo|de 3·10⁵ N/C","F = q · E","F = 2·10⁻⁶ · 3·10⁵","F = 0,6 N")});
fe("calc_q138","Animação passo a passo: uma carga de 4 microcoulombs em um ponto de campo 500 newtons por coulomb sofre força de 2 vezes 10 elevado a menos 3 newtons",{q:"+4 µC",E:"500 N/C",res:"2·10⁻³ N",steps:STP("Carga de 4 µC em um ponto onde|o campo vale 500 N/C","F = q · E","F = 4·10⁻⁶ · 500","F = 2·10⁻³ N")});
/* carga negativa: campo contra a força */
(function(){var H=170,s='',tr=[],i;
 for(i=0;i<2;i++)s+=N.arrow(290,30,40+i*76,"an-a3",1.8).replace(/class="an-a3"/,'class="an-a3" opacity=".35"');
 s+=t_(160,20,"leste →",{s:10,a:"middle"}).replace('>leste →<','>oeste ← · leste →<');
 s+='<g class="qq">'+big(160,86,16,-1,"q = −1 µC","")+'</g>'+N.arrow(180,252,86,"an-a2",4)+t_(220,70,"F = 4 N (leste)",{s:12});
 s+=S(3,t_(160,148,"carga negativa: F tem sentido oposto a E",{s:11}))+S(4,N.arrow(138,48,86,"an-a3",4)+t_(90,70,"E = 4·10⁶ N/C",{s:12})+t_(90,106,"(oeste)",{s:12}));
 var st=[[0,"Carga de prova de −1 µC sofre|força de 4 N para o leste"],[2.6,"E = F / |q|"],[5.2,"E = 4 / 10⁻⁶ = 4·10⁶ N/C"],[8,"q é negativa: E aponta contra a força,|para o oeste"]],T=st[3][0]+3.6,c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H);
 for(var k=1;k<st.length;k++)tr.push(N.vis(".s"+(k+1),T,st[k][0]));
 N.reg("calc_q080",{a:"Animação passo a passo: uma carga de prova negativa de 1 microcoulomb sofre força de 4 newtons para o leste; o campo vale 4 vezes 10 elevado a 6 newtons por coulomb e aponta para o oeste",h:H,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* contagem de elétrons: n = Q / e */
function ne(key,alt,o){var H=176,s='',tr=[],i,pos=o.sg>0,st=o.steps,T=st[3][0]+3.6;
 s+='<rect x="70" y="40" width="130" height="64" rx="14" class="'+(pos?"an-rp":"an-rn")+'"/>'+t_(135,34,o.body,{s:11});
 for(i=0;i<6;i++){var x=88+i*21;if(pos)s+=P(x,72,"");else if(i<2)s+=E(x,72,"")}
 for(i=0;i<4;i++){
  if(pos){var fx=236+(i%2)*22,fy=56+Math.floor(i/2)*32,sx=88+(2+i)*21;s+=E(fx,fy,"fl"+i);tr.push(N.tr(".fl"+i,T,[[0,sx-fx,72-fy],[st[2][0]-.4+.5*i,sx-fx,72-fy],[st[3][0]-.6+.5*i,0,0]]))}
  else{var gx=88+(2+i)*21,sx2=gx+150;s+=E(gx,72,"fl"+i);tr.push(N.tr(".fl"+i,T,[[0,125,(i-1.5)*14],[st[2][0]-.4+.5*i,125,(i-1.5)*14],[st[3][0]-.6+.5*i,0,0]]))}}
 s+=t_(266,128,pos?"elétrons perdidos":"",{s:10});
 s+=S(4,'<rect x="60" y="138" width="200" height="26" rx="13" fill="#f59e0b" fill-opacity=".3" stroke="#f59e0b" stroke-width="2"/>'+t_(160,156,o.res,{s:13}));
 var c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H);
 for(var k=1;k<st.length;k++)tr.push(N.vis(".s"+(k+1),T,st[k][0]));
 N.reg(key,{a:alt,h:H,s:s+c.s,t:tr.concat(c.t),T:T})}
ne("calc_q006","Animação passo a passo: um corpo com carga de menos 3,2 microcoulombs possui 2 vezes 10 elevado a 13 elétrons em excesso",{sg:-1,body:"Q = −3,2 µC",res:"n = 2·10¹³ elétrons em excesso",steps:STP("Corpo com Q = −3,2 µC: tem|elétrons em excesso","n = Q / e","n = 3,2·10⁻⁶ / 1,6·10⁻¹⁹","n = 2·10¹³ elétrons")});
ne("calc_q049","Animação passo a passo: um corpo que ganhou 10 elevado a 12 elétrons fica com carga de menos 1,6 vezes 10 elevado a menos 7 coulombs",{sg:-1,body:"ganhou 10¹² elétrons",res:"Q = −1,6·10⁻⁷ C",steps:STP("O corpo ganhou n = 10¹² elétrons:|fica negativo","Q = n · e","|Q| = 10¹² · 1,6·10⁻¹⁹","Q = −1,6·10⁻⁷ C")});
ne("calc_q046","Animação passo a passo: um bastão com carga de mais 3,2 vezes 10 elevado a menos 9 coulombs perdeu 2 vezes 10 elevado a 10 elétrons",{sg:1,body:"Q = +3,2·10⁻⁹ C",res:"n = 2·10¹⁰ elétrons perdidos",steps:STP("Bastão positivo: perdeu elétrons.|Q = +3,2·10⁻⁹ C","n = Q / e","n = 3,2·10⁻⁹ / 1,6·10⁻¹⁹","n = 2·10¹⁰ elétrons")});
ne("calc_q058","Animação passo a passo: um corpo com carga de mais 4,8 vezes 10 elevado a menos 6 coulombs perdeu 3 vezes 10 elevado a 13 elétrons",{sg:1,body:"Q = +4,8·10⁻⁶ C",res:"n = 3·10¹³ elétrons perdidos",steps:STP("Corpo positivo: perdeu elétrons.|Q = +4,8·10⁻⁶ C","n = Q / e","n = 4,8·10⁻⁶ / 1,6·10⁻¹⁹","n = 3·10¹³ elétrons")});

/* esferas idênticas em contato: média */
(function(){var H=176,s='',tr=[],ax=124,bx=196,y=76,R=36,st=[[0,"A (+8 µC) toca B, neutra e idêntica"],[2.6,"Idênticas: dividem a carga em partes iguais"],[5.2,"qB = (8 + 0) / 2"],[8,"qB = +4 µC"]],T=st[3][0]+3.6;
 s+='<g class="ga"><circle cx="'+ax+'" cy="'+y+'" r="'+R+'" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>'+t_(ax,y-R-8,"A",{s:12})+'</g><g class="gb"><circle cx="'+bx+'" cy="'+y+'" r="'+R+'" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>'+t_(bx,y-R-8,"B",{s:12})+'</g>';
 var q=N.seq("qa",ax-30,y+R+22,["+8 µC","+4 µC"],[0,5.6],T,{s:13}),r=N.seq("qb",bx+30,y+R+22,["0","+4 µC"],[0,5.6],T,{s:13});
 s+=q.s+r.s;tr=tr.concat(q.t,r.t);
 var pa=[[-14,-12],[8,-12],[-14,10],[8,10]];pa.forEach(function(p,i){s+=P(ax+p[0]+3,y+p[1]+3,"")});
 s+=P(bx-12,y-6,"")+P(bx+10,y+10,"");
 s+=E(ax-4,y,"mv0")+E(ax+8,y+4,"mv1");
 tr.push(N.tr(".mv0",T,[[0,bx-12-(ax-4),-6],[3.2,bx-12-(ax-4),-6],[5.4,0,0]]),N.tr(".mv1",T,[[0,bx+10-(ax+8),6],[3.6,bx+10-(ax+8),6],[5.8,0,0]]));
 var c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H);
 N.reg("calc_q051",{a:"Animação passo a passo: a esfera A com mais 8 microcoulombs toca a esfera B, neutra e idêntica; depois de separadas, cada uma fica com mais 4 microcoulombs",h:H,s:s+c.s,t:tr.concat(c.t),T:T})})();
})();
