/* Eletrostática e Eletrodinâmica: simulações do FENÔMENO (substituem as resoluções passo a passo). */
(function(){"use strict";
var F=window.FEN,N=F.N,t_=F.t_,ACC=F.ACC,NEG=F.NEG,xy=F.xy,cvP=F.cvP,f=F.f,GR=F.GR,mvg=F.mvg,PI=Math.PI;
var K=9e9,WATER="#38bdf8";
function col(s){return s<0?NEG:ACC}
function sg(s){return s<0?"−":"+"}
function bal(x,y,r,s,lab,cl,ly){return mvg(cl||"",x,y,'<circle r="'+r+'" fill="'+col(s)+'" fill-opacity=".45" stroke="currentColor" stroke-width="2.2"/>'+t_(0,5,sg(s),{s:r>10?16:12})+(lab?t_(0,-(r+6),lab,{s:11}):""))}

/* ---------- gráfico genérico: X(q) e Y(q) em unidades de exibição ---------- */
function G(key,alt,o){
 var dx=o.dx===undefined?2:o.dx,dy=o.dy===undefined?2:o.dy,X=o.X,Y=o.Y,ym=o.ym,i;
 if(!ym){ym=0;for(i=0;i<=24;i++)ym=Math.max(ym,Y(i/24))}
 var xu=o.xu?" "+o.xu:"",yu=o.yu?" "+o.yu:"";
 xy(key,"Simulação: "+alt,{ym:ym,xl:"",x0t:o.x0?f(X(0),dx)+xu:"",xe:f(X(1),dx)+xu,yl:o.yl,ye:f(ym,dy),
  sc:o.sc,mv:o.mv,tr:o.tr,gs:o.gs,end:o.end,n:o.n,
  cv:o.cvs||[cvP(Y)],
  rd:o.rd||function(q){return o.rx+" = "+f(X(q),dx)+xu+"  ·  "+o.ry+" = "+f(Y(q),dy)+yu},caps:o.caps})}
function lin(key,alt,o){var xm=o.xm,ym=o.ym;o.X=function(q){return xm*q};o.Y=function(q){return ym*q};G(key,alt,o)}
function quad(key,alt,o){var xm=o.xm,ym=o.ym;o.X=function(q){return xm*q};o.Y=function(q){return ym*q*q};G(key,alt,o)}

/* ---------- cenas ---------- */
/* duas cargas; a móvel chega (ou se afasta) até a distância final */
function cargas(o){
 var Dr=2.2,small=o.small,rm=small?9:15,away=o.away;
 function dr(q){return away?(1/Dr+(1-1/Dr)*q):(Dr-(Dr-1)*q)}
 return{sc:bal(60,56,15,o.s1,o.l1)+bal(150,56,rm,o.s2,o.l2,"mq"),
  mv:[[".mq",function(q){return[90*dr(q),0]},24]],
  end:function(){return'<line x1="60" y1="76" x2="150" y2="76" stroke="currentColor" stroke-width="1.6"/><line x1="60" y1="71" x2="60" y2="81" stroke="currentColor"/><line x1="150" y1="71" x2="150" y2="81" stroke="currentColor"/>'+t_(105,91,o.dl,{s:11})}}}
/* placas paralelas; carga se desloca de a até b */
function placas(o){
 var arrs="";for(var k=0;k<3;k++)arrs+='<line x1="100" y1="'+(24+k*20)+'" x2="214" y2="'+(24+k*20)+'" stroke="currentColor" stroke-opacity=".35" stroke-width="1.6"/><path d="M220 '+(24+k*20)+'L210 '+(19+k*20)+'L210 '+(29+k*20)+'Z" fill="currentColor" fill-opacity=".35"/>';
 return{sc:'<rect x="86" y="8" width="8" height="66" fill="'+ACC+'" fill-opacity=".5" stroke="currentColor" stroke-width="1.8"/><rect x="226" y="8" width="8" height="66" fill="'+NEG+'" fill-opacity=".5" stroke="currentColor" stroke-width="1.8"/>'+arrs+t_(76,16,"+",{s:13})+t_(244,16,"−",{s:13})+t_(160,91,o.lab||"",{s:11})+bal(o.b,44,9,o.s,o.l,"mq"),
  mv:[[".mq",function(q){return[o.a+(o.b-o.a)*q,0]},24]]}}
/* corpo que ganha ou perde elétrons */
function corpo(o){
 var dots="";for(var k=0;k<4;k++)dots+='<g transform="translate('+(194+k*12)+' 56)"><circle r="4.5" fill="'+NEG+'" stroke="currentColor"/></g>';
 return{sc:'<circle cx="160" cy="56" r="26" fill="'+col(o.s)+'" fill-opacity=".35" stroke="currentColor" stroke-width="2.4"/>'+t_(160,62,sg(o.s),{s:20})+t_(160,18,o.lab,{s:12})+'<g class="es">'+dots+'</g>'+t_(230,28,"elétrons",{s:11,a:"start"}),
  mv:[[".es",function(q){return[o.ganha?70*(1-q):70*q,0]},24]]}}
/* carga num campo uniforme: seta da força cresce com a carga ou com o campo */
function forca(o){
 var arrs="";for(var k=0;k<3;k++)arrs+='<line x1="30" y1="'+(22+k*26)+'" x2="294" y2="'+(22+k*26)+'" stroke="currentColor" stroke-opacity=".25" stroke-width="1.6"/><path d="M300 '+(22+k*26)+'L290 '+(17+k*26)+'L290 '+(27+k*26)+'Z" fill="currentColor" fill-opacity=".25"/>';
 var dir=o.neg?-1:1,x1=160,x2=160+dir*100;
 return{sc:arrs+'<g class="fa" style="transform-origin:160px 48px"><line x1="160" y1="48" x2="'+(x2-dir*6)+'" y2="48" stroke="'+NEG+'" stroke-width="4"/><path d="M'+x2+' 48L'+(x2-dir*12)+' 41L'+(x2-dir*12)+' 55Z" fill="'+NEG+'"/></g>'+bal(160,48,10,o.s,"")+t_(160,92,o.lab,{s:11}),
  tr:function(T,T0,D){return[N.sc(".fa",T,[[T0,.1,1],[T0+D,1,1]],"linear")]}}}
/* pêndulo elétrico */
function pendulo(){
 return{sc:'<line x1="100" y1="8" x2="220" y2="8" stroke="currentColor" stroke-width="2"/><g class="pd" style="transform-origin:160px 8px"><g transform="rotate(-45 160 8)"><line x1="160" y1="8" x2="160" y2="76" stroke="currentColor" stroke-width="2"/>'+'<circle cx="160" cy="84" r="9" fill="'+ACC+'" fill-opacity=".5" stroke="currentColor" stroke-width="2"/></g></g><line x1="160" y1="8" x2="160" y2="80" stroke="currentColor" stroke-dasharray="3 3" stroke-opacity=".5"/>'+t_(250,40,"45°",{s:12})+t_(250,58,"campo →",{s:11}),
  tr:function(T,T0,D){return[N.rot(".pd",T,[[T0,45],[T0+D,0]],"linear")]}}}
/* circuito simples com bolinhas de carga */
function circ(o){
 var zz='<path d="M140 82L148 82L152 74L160 90L168 74L176 90L180 82L190 82" fill="none" stroke="currentColor" stroke-width="2"/>';
 return{sc:'<path d="M100 22H220V82H190M140 82H100V56M100 46V22" fill="none" stroke="currentColor" stroke-width="2"/>'+zz+'<line x1="90" y1="56" x2="110" y2="56" stroke="currentColor" stroke-width="3"/><line x1="95" y1="46" x2="105" y2="46" stroke="currentColor" stroke-width="2"/>'+t_(166,70,o.r,{s:11})+(function(){var L=String(o.b||"").split(", ");return L.length>1?t_(84,46,L[0],{s:11,a:"end"})+t_(84,62,L.slice(1).join(", "),{s:11,a:"end"}):t_(84,52,L[0],{s:11,a:"end"})})()+
  '<g class="dt"><circle cx="150" cy="22" r="4" fill="'+ACC+'"/><circle cx="170" cy="22" r="4" fill="'+ACC+'"/><circle cx="190" cy="22" r="4" fill="'+ACC+'"/></g>'+t_(160,14,o.i||"",{s:11}),
  mv:[[".dt",function(q){return[40*q,0]},24]]}}
/* componentes ligados um a um (resistores ou capacitores) */
function comp(x,y,t,lab,cl,lado){
 return'<g class="'+cl+'"><g transform="translate('+x+' '+y+')">'+(t=="c"?'<line x1="-3" y1="-12" x2="-3" y2="12" stroke="currentColor" stroke-width="3"/><line x1="3" y1="-12" x2="3" y2="12" stroke="currentColor" stroke-width="3"/><line x1="-18" y1="0" x2="-3" y2="0" stroke="currentColor" stroke-width="2"/><line x1="3" y1="0" x2="18" y2="0" stroke="currentColor" stroke-width="2"/>':'<rect x="-18" y="-8" width="36" height="16" fill="'+ACC+'" fill-opacity=".35" stroke="currentColor" stroke-width="2"/>')+(lado?t_(21,4,lab,{s:11,a:"start"}):t_(0,t=="c"?-17:-13,lab,{s:11}))+'</g></g>'}
/* layout: lista de [x,y,rótulo]; visível a partir de i/k do tempo; fios opcionais */
function passos(o){
 var svg=o.fios||"",tr=[],k=o.k;
 return{sc:svg+o.itens.map(function(it,i){return comp(it[0],it[1],o.t,it[2],"pc"+i,it[3]==="d")}).join(""),
  tr:function(T,T0,D){var a=[];for(var i=0;i<o.itens.length;i++)a.push(N.vis(".pc"+i,T,T0+D*(it_i(o,i)/k)));return a}}}
function it_i(o,i){return o.vez?o.vez[i]:i}
function degraus(v){var k=v.length;return function(q){return v[Math.min(k-1,Math.floor(q*k+1e-9))]}}
var SERIE_FIOS=function(n){var xs=[],i;for(i=0;i<n;i++)xs.push(160+(i-(n-1)/2)*74);return xs};

/* =========================  ELETROSTÁTICA  ========================= */
/* contagem de elétrons: carga cresce em reta com o número de elétrons */
function contagem(id,alt,o){var s=corpo(o);
 lin("calc_"+id,alt,{xm:o.n,ym:o.Q,xu:o.nu,yu:o.qu,rx:"n",ry:"Q",yl:o.yl,dx:1,dy:o.dy||1,sc:s.sc,mv:s.mv,caps:o.caps})}
contagem("q006","o corpo recebe elétrons e a carga cresce em reta com o número deles; com 2 × 10¹³ elétrons a carga é −3,2 µC",{s:-1,ganha:1,lab:"Q = −3,2 µC",n:2,nu:"×10¹³ e⁻",Q:3.2,qu:"µC",yl:"|Q| (µC)",caps:["O corpo vai ganhando elétrons em excesso.|Cada um carrega 1,6 × 10⁻¹⁹ C.","A carga cresce em reta com o número|de elétrons: Q = n · e.","n = Q / e = 3,2·10⁻⁶ / 1,6·10⁻¹⁹|n = 2 × 10¹³ elétrons."]});
contagem("q046","o bastão perde elétrons e a carga positiva cresce em reta com o número deles; com 2 × 10¹⁰ elétrons perdidos a carga é +3,2 nC",{s:1,ganha:0,lab:"Q = +3,2 nC",n:2,nu:"×10¹⁰ e⁻",Q:3.2,qu:"nC",yl:"Q (nC)",caps:["Atritado com seda, o vidro vai perdendo|elétrons e fica positivo.","A carga cresce em reta com o número|de elétrons perdidos: Q = n · e.","n = Q / e = 3,2·10⁻⁹ / 1,6·10⁻¹⁹|n = 2 × 10¹⁰ elétrons."]});
contagem("q049","o corpo recebe 10¹² elétrons e a carga negativa cresce em reta com o número deles até −1,6 × 10⁻⁷ C",{s:-1,ganha:1,lab:"Q = −160 nC",n:1,nu:"×10¹² e⁻",Q:160,qu:"nC",yl:"|Q| (nC)",dy:0,caps:["O corpo recebe elétrons, um a um.|Cada um carrega 1,6 × 10⁻¹⁹ C.","A carga cresce em reta com o número|de elétrons ganhos: Q = n · e.","Q = n · e = 10¹² · 1,6·10⁻¹⁹|Q = −1,6 × 10⁻⁷ C."]});
contagem("q058","o corpo perde elétrons e a carga positiva cresce em reta com o número deles; com 3 × 10¹³ elétrons perdidos a carga é +4,8 µC",{s:1,ganha:0,lab:"Q = +4,8 µC",n:3,nu:"×10¹³ e⁻",Q:4.8,qu:"µC",yl:"Q (µC)",caps:["O corpo vai perdendo elétrons e fica|com carga positiva.","A carga cresce em reta com o número|de elétrons perdidos: Q = n · e.","n = Q / e = 4,8·10⁻⁶ / 1,6·10⁻¹⁹|n = 3 × 10¹³ elétrons."]});

/* contato entre esferas idênticas: as cargas se igualam */
function sm(q){return q*q*(3-2*q)}
G("calc_q051","Simulação: a esfera A (+8 µC) toca a esfera B, neutra e idêntica; a carga passa de A para B até as duas ficarem com +4 µC",{
 X:function(q){return q},Y:function(q){return 8-4*sm(q)},ym:8,yl:"carga (µC)",rx:"A",ry:"B",
 cvs:[cvP(function(q){return 8-4*sm(q)}),cvP(function(q){return 4*sm(q)},NEG)],
 rd:function(q){return"A = "+f(8-4*sm(q),1)+" µC  ·  B = "+f(4*sm(q),1)+" µC"},dy:1,sc:'<g transform="translate(138 56)"><circle r="22" fill="'+ACC+'" fill-opacity=".45" stroke="currentColor" stroke-width="2.4"/>'+t_(0,5,"A",{s:14})+'</g><g transform="translate(182 56)"><circle r="22" fill="'+NEG+'" fill-opacity=".3" stroke="currentColor" stroke-width="2.4"/>'+t_(0,5,"B",{s:14})+'</g>'+t_(138,22,"+8 µC",{s:11})+t_(182,22,"0",{s:11}),
 caps:["A esfera A (+8 µC) encosta na esfera B,|neutra e idêntica.","No contato, a carga se reparte até|as duas ficarem com o mesmo valor.","qB = (8 + 0) / 2|qB = +4 µC."]});

/* força de Coulomb (e energia potencial) em função da distância */
function coul(id,o){
 var d1=o.d,Dr=2.2,k=o.ep?1:2,away=o.away,qa=Math.abs(o.q1*o.q2);
 function d(q){return d1*(away?(1/Dr+(1-1/Dr)*q):(Dr-(Dr-1)*q))}
 function Y(q){return K*qa*1e-12/Math.pow(d(q),k)}
 var cg=cargas({s1:o.q1<0?-1:1,s2:o.q2<0?-1:1,l1:(o.q1>0?"+":"")+o.q1+" µC",l2:(o.q2>0?"+":"")+o.q2+" µC",dl:"d = "+f(d1)+" m",away:away,small:o.teste});
 var nome=o.ep?"|Ep| (J)":"F (N)",unid=o.ep?"J":"N",ym=Y(away?0:1);
 var alt=o.ep?"as cargas se "+(away?"afastam":"aproximam")+" e a energia potencial elétrica varia com o inverso da distância; com d = "+f(d1)+" m ela vale "+o.res:"as cargas se "+(away?"afastam":"aproximam")+" e a força varia com o inverso do quadrado da distância; com d = "+f(d1)+" m ela vale "+o.res;
 G("calc_"+id,alt,{X:function(q){return d(q)},Y:Y,ym:ym,x0:1,xu:"m",yu:unid,yl:nome,rx:"d",ry:o.ep?"|Ep|":"F",dx:2,dy:o.dy===undefined?2:o.dy,sc:cg.sc,mv:cg.mv,end:cg.end,
  caps:[o.c1||("As cargas "+(away?"se afastam.":"se aproximam.")+"|"+(o.ep?"A energia depende de 1/d.":"A força depende de 1/d².")),(o.ep?"Quanto menor a distância,|maior o módulo da energia: Ep = k·q₁·q₂ / d.":"Quanto menor a distância,|maior a força: F = k·q₁·q₂ / d²."),o.c3]})}
coul("q023",{q1:2,q2:3,d:.3,res:"0,6 N",c3:"F = 9·10⁹ · 2·10⁻⁶ · 3·10⁻⁶ / 0,3²|F = 0,6 N."});
coul("q064",{q1:1,q2:-1,d:.1,res:"0,9 N (atração)",c3:"F = 9·10⁹ · 10⁻⁶ · 10⁻⁶ / 0,1²|F = 0,9 N (atração).",c1:"As cargas opostas se aproximam.|A atração depende de 1/d²."});
coul("q067",{q1:2,q2:2,d:.6,res:"0,1 N",c3:"F = 9·10⁹ · 2·10⁻⁶ · 2·10⁻⁶ / 0,6²|F = 0,1 N."});
coul("q126",{q1:4,q2:4,d:.2,res:"3,6 N",c3:"F = 9·10⁹ · 4·10⁻⁶ · 4·10⁻⁶ / 0,2²|F = 3,6 N."});
coul("q160",{q1:4,q2:9,d:.3,res:"3,6 N",c3:"F = 9·10⁹ · 4·10⁻⁶ · 9·10⁻⁶ / 0,3²|F = 3,6 N."});
coul("q161",{q1:2,q2:-5,d:.2,res:"2,25 N (atração)",c3:"F = 9·10⁹ · 2·10⁻⁶ · 5·10⁻⁶ / 0,2²|F = 2,25 N, de atração.",c1:"As cargas opostas se aproximam.|A atração depende de 1/d²."});
coul("q162",{q1:5,q2:2,d:.5,teste:1,res:"0,36 N",c3:"F = 9·10⁹ · 5·10⁻⁶ · 2·10⁻⁶ / 0,5²|F = 0,36 N.",c1:"A carga de prova se aproxima da|carga fixa de +5 µC."});
coul("q167",{q1:3,q2:3,d:.3,away:1,res:"0,9 N (repulsão)",dy:2,c1:"Após o contato, cada esfera tem +3 µC.|Elas são afastadas até 0,3 m.",c3:"q = (8 − 2) / 2 = +3 µC cada;|F = 9·10⁹ · 3·10⁻⁶ · 3·10⁻⁶ / 0,3² = 0,9 N."});
coul("q093",{q1:2,q2:3,d:.6,ep:1,dy:2,res:"0,09 J",c3:"Ep = 9·10⁹ · 2·10⁻⁶ · 3·10⁻⁶ / 0,6|Ep = 0,09 J."});
coul("q169",{q1:3,q2:6,d:.9,ep:1,dy:2,res:"0,18 J",c3:"Ep = 9·10⁹ · 3·10⁻⁶ · 6·10⁻⁶ / 0,9|Ep = 0,18 J."});
coul("q188",{q1:5,q2:-2,d:.3,ep:1,dy:2,res:"−0,30 J (negativa)",c3:"Ep = 9·10⁹ · 5·10⁻⁶ · (−2·10⁻⁶) / 0,3|Ep = −0,30 J (módulo 0,30 J).",c1:"As cargas opostas se aproximam.|A energia é negativa (mostrado o módulo)."});

/* campo e potencial de carga puntiforme, com ponto de prova que se move */
function pontual(id,o){
 var d0=o.d0,d1=o.d1,pot=o.pot;
 function d(q){return d0+(d1-d0)*q}
 function Y(q){return K*Math.abs(o.Q)*1e-6/(pot?d(q):d(q)*d(q))/o.esc}
 var cg=cargas({s1:o.Q<0?-1:1,s2:1,l1:(o.Q>0?"+":"")+o.Q+" µC",l2:"",dl:"d = "+f(d1)+" m",away:o.away,small:1});
 var dec=d1>d0?1:0;
 G("calc_"+id,pot?("o ponto de prova "+(o.away?"se afasta":"se aproxima")+" e o potencial varia com 1/d; a "+f(d1)+" m ele vale "+o.res):("o ponto de prova se aproxima e o campo cresce com 1/d²; a "+f(d1)+" m ele vale "+o.res),{
  X:d,Y:Y,x0:1,xu:"m",yu:o.yu,yl:o.yl,rx:"d",ry:pot?"V":"E",dx:2,dy:o.dy,sc:cg.sc,mv:cg.mv,end:cg.end,
  caps:[o.c1,pot?"O potencial varia com o inverso|da distância: V = k·Q / d.":"O campo varia com o inverso do|quadrado da distância: E = k·Q / d².",o.c3]})}
pontual("q033",{Q:2,d0:.66,d1:.3,esc:1e5,pot:0,yu:"×10⁵ N/C",yl:"E (×10⁵ N/C)",dy:1,res:"2 × 10⁵ N/C",c1:"Um ponto de prova se aproxima|da carga de +2 µC.",c3:"E = 9·10⁹ · 2·10⁻⁶ / 0,3²|E = 2 × 10⁵ N/C."});
pontual("q077",{Q:1,d0:2.2,d1:1,esc:1e3,pot:0,yu:"kN/C",yl:"E (kN/C)",dy:1,res:"9 × 10³ N/C",c1:"Um ponto de prova se aproxima|da carga de +1 µC.",c3:"E = 9·10⁹ · 10⁻⁶ / 1²|E = 9 × 10³ N/C."});
pontual("q037",{Q:4,d0:4.4,d1:2,esc:1e4,pot:1,yu:"×10⁴ V",yl:"V (×10⁴ V)",dy:1,res:"1,8 × 10⁴ V",c1:"Um ponto de prova se aproxima|da carga de +4 µC.",c3:"V = 9·10⁹ · 4·10⁻⁶ / 2|V = 1,8 × 10⁴ V."});
pontual("q084",{Q:-6,d0:6.6,d1:3,esc:1e4,pot:1,yu:"×10⁴ V",yl:"|V| (×10⁴ V)",dy:1,res:"−1,8 × 10⁴ V",c1:"Um ponto de prova se aproxima|da carga de −6 µC (módulo de V).",c3:"V = 9·10⁹ · (−6·10⁻⁶) / 3|V = −1,8 × 10⁴ V."});
pontual("q170",{Q:4,d0:.6,d1:1.2,away:1,esc:1e4,pot:1,yu:"×10⁴ V",yl:"V (×10⁴ V)",dy:1,res:"3 × 10⁴ V",c1:"O ponto se afasta de 0,6 m para 1,2 m|da carga de +4 µC.",c3:"V(0,6) = 6·10⁴ V; V(1,2) = 3·10⁴ V|ΔV = 3,0 × 10⁴ V."});

/* campo a partir de F/q ou F = q·E: reta */
function reta(id,alt,o){
 var s=o.cena?o.cena:forca({s:o.s||1,neg:o.neg,lab:o.lab});
 lin("calc_"+id,alt,{xm:o.xm,ym:o.ym,xu:o.xu,yu:o.yu,rx:o.rx,ry:o.ry,yl:o.yl,dx:o.dx===undefined?1:o.dx,dy:o.dy===undefined?2:o.dy,sc:s.sc,mv:s.mv,tr:s.tr,end:s.end,caps:o.caps})}
reta("q073","a carga cresce dentro de um campo de 3 × 10⁵ N/C e a força cresce em reta com ela; com 2 µC a força é 0,6 N",{lab:"E = 3 × 10⁵ N/C",xm:2,ym:.6,xu:"µC",yu:"N",rx:"q",ry:"F",yl:"F (N)",caps:["Uma carga num campo de 3 × 10⁵ N/C.|Aumentando a carga...","...a força cresce em reta:|F = q · E (a inclinação é o campo).","F = 2·10⁻⁶ · 3·10⁵|F = 0,6 N."]});
reta("q138","a carga cresce dentro de um campo de 500 N/C e a força cresce em reta com ela; com 4 µC a força é 2 × 10⁻³ N",{lab:"E = 500 N/C",xm:4,ym:2,xu:"µC",yu:"mN",rx:"q",ry:"F",yl:"F (mN)",caps:["Uma carga num campo de 500 N/C.|Aumentando a carga...","...a força cresce em reta:|F = q · E (a inclinação é o campo).","F = 4·10⁻⁶ · 500|F = 2 × 10⁻³ N."]});
reta("q185","o campo cresce e a força sobre o elétron cresce em reta com ele; com 2000 N/C a força é 3,2 × 10⁻¹⁶ N",{s:-1,neg:1,lab:"elétron, e = 1,6 × 10⁻¹⁹ C",xm:2000,ym:3.2,xu:"N/C",yu:"×10⁻¹⁶ N",rx:"E",ry:"F",yl:"F (×10⁻¹⁶ N)",dx:0,caps:["Um elétron num campo que vai aumentando|até 2000 N/C.","A força cresce em reta com o campo:|F = q · E.","F = 1,6·10⁻¹⁹ · 2000|F = 3,2 × 10⁻¹⁶ N."]});
reta("q184","a carga de prova é a mesma e a força cresce em reta com ela; a inclinação F/q é o campo, e com 3 µC e 0,12 N o campo vale 4 × 10⁴ N/C",{lab:"mede-se F para cada q",xm:3,ym:.12,xu:"µC",yu:"N",rx:"q",ry:"F",yl:"F (N)",dy:2,caps:["Colocam-se cargas de prova cada vez|maiores no mesmo ponto.","A força cresce em reta; a inclinação|F / q é o campo naquele ponto.","E = F / q = 0,12 / 3·10⁻⁶|E = 4,0 × 10⁴ N/C."]});
reta("q080","a carga de prova negativa sofre força que cresce em reta com o valor da carga; com 1 µC a força é 4 N para o leste e o campo vale 4 × 10⁶ N/C para o oeste",{s:-1,neg:0,lab:"F → leste (carga negativa)",xm:1,ym:4,xu:"µC",yu:"N",rx:"|q|",ry:"F",yl:"F (N)",caps:["Uma carga negativa sofre força para|o leste, de 4 N.","A força por unidade de carga é o campo,|e ele tem sentido contrário (oeste).","E = F / q = 4 / 10⁻⁶|E = 4 × 10⁶ N/C, para o oeste."]});

/* ddp e campo uniforme */
function pl(id,alt,o){
 var p=placas({a:o.a,b:o.b,s:o.s||1,l:"",lab:o.lab});
 lin("calc_"+id,alt,{xm:o.xm,ym:o.ym,xu:o.xu,yu:o.yu,rx:o.rx,ry:o.ry,yl:o.yl,dx:o.dx===undefined?2:o.dx,dy:o.dy===undefined?1:o.dy,sc:p.sc,mv:p.mv,caps:o.caps})}
pl("q089","uma carga se afasta ao longo de um campo uniforme de 200 V/m e a diferença de potencial cresce em reta com a distância; com 0,5 m ela vale 100 V",{a:105,b:215,lab:"E = 200 V/m",xm:.5,ym:100,xu:"m",yu:"V",rx:"d",ry:"U",yl:"U (V)",dy:0,caps:["Percorrendo o campo uniforme de 200 V/m,|o potencial vai variando.","A ddp cresce em reta com a distância:|U = E · d.","U = 200 · 0,5|U = 100 V."]});
pl("q193","entre as placas a ddp cresce em reta com a distância percorrida; em 2 cm ela chega a 600 V e a inclinação é o campo, 3 × 10⁴ V/m",{a:105,b:215,lab:"2 cm · 600 V",xm:2,ym:600,xu:"cm",yu:"V",rx:"x",ry:"U",yl:"U (V)",dy:0,dx:1,caps:["Entre as placas, a ddp cresce em reta|com a distância percorrida.","A inclinação é o campo:|E = U / d.","E = 600 / 0,02|E = 3,0 × 10⁴ V/m."]});
/* trabalho = q·ΔV */
function trab(id,alt,o){
 var p=placas({a:105,b:215,s:1,l:"",lab:o.lab});
 lin("calc_"+id,alt,{xm:o.xm,ym:o.ym,xu:o.xu,yu:o.yu,rx:o.rx,ry:o.ry,yl:o.yl,dx:o.dx===undefined?0:o.dx,dy:o.dy===undefined?0:o.dy,sc:p.sc,mv:p.mv,caps:o.caps})}
trab("q038","a carga de 2 µC atravessa uma diferença de potencial que cresce até 100 V e o trabalho cresce em reta com a ddp, chegando a 2 × 10⁻⁴ J",{lab:"q = 2 µC",xm:100,ym:200,xu:"V",yu:"µJ",rx:"U",ry:"W",yl:"W (µJ)",caps:["A carga de 2 µC percorre uma região|com ddp crescente.","O trabalho cresce em reta com a ddp:|W = q · U.","W = 2·10⁻⁶ · 100|W = 2 × 10⁻⁴ J."]});
trab("q085","a carga de 5 µC passa de 20 V para 120 V; a energia potencial varia em reta com a ddp percorrida, chegando a 5 × 10⁻⁴ J",{lab:"q = 5 µC · 20 V → 120 V",xm:100,ym:500,xu:"V",yu:"µJ",rx:"ΔV",ry:"ΔEp",yl:"ΔEp (µJ)",caps:["A carga de 5 µC vai do ponto a 20 V|até o ponto a 120 V.","A variação da energia cresce em reta|com a ddp: ΔEp = q · ΔV.","ΔEp = 5·10⁻⁶ · (120 − 20)|ΔEp = 5 × 10⁻⁴ J."]});
trab("q149","a carga de 3 µC atravessa uma ddp que cresce até 50 V e o trabalho cresce em reta com ela, chegando a 1,5 × 10⁻⁴ J",{lab:"q = 3 µC",xm:50,ym:150,xu:"V",yu:"µJ",rx:"U",ry:"W",yl:"W (µJ)",caps:["A carga de 3 µC percorre uma região|com ddp crescente.","O trabalho cresce em reta com a ddp:|W = q · U.","W = 3·10⁻⁶ · 50|W = 1,5 × 10⁻⁴ J."]});
trab("q163","a carga de 3 µC atravessa duas regiões seguidas (200 V e 150 V); o trabalho cresce em reta com a ddp total e chega a 1,05 × 10⁻³ J",{lab:"q = 3 µC · 200 V + 150 V",xm:350,ym:1050,xu:"V",yu:"µJ",rx:"U",ry:"W",yl:"W (µJ)",caps:["A carga de 3 µC atravessa duas regiões:|200 V e depois 150 V.","O trabalho cresce em reta com a ddp|total: W = q · U.","W = 3·10⁻⁶ · (200 + 150)|W = 1,05 × 10⁻³ J."]});
trab("q192","a carga de 8 µC passa de 300 V para 120 V e o trabalho cresce em reta com a ddp percorrida, chegando a 1,44 × 10⁻³ J",{lab:"q = 8 µC · 300 V → 120 V",xm:180,ym:1440,xu:"V",yu:"µJ",rx:"U",ry:"W",yl:"W (µJ)",caps:["A carga de 8 µC vai do ponto a 300 V|até o ponto a 120 V.","O trabalho cresce em reta com a ddp:|W = q · (V₁ − V₂).","W = 8·10⁻⁶ · (300 − 120)|W = 1,44 × 10⁻³ J."]});
trab("q164","a carga de 2 µC é deslocada no campo de 400 N/C e o trabalho cresce em reta com o deslocamento, chegando a 2 × 10⁻⁴ J em 0,25 m",{lab:"E = 400 N/C · q = 2 µC",xm:.25,ym:200,xu:"m",yu:"µJ",rx:"d",ry:"W",yl:"W (µJ)",dx:2,caps:["A carga de 2 µC é empurrada pelo campo|de 400 N/C.","O trabalho cresce em reta com o|deslocamento: W = q · E · d.","W = 2·10⁻⁶ · 400 · 0,25|W = 2 × 10⁻⁴ J."]});
trab("q189","a carga de 2 µC é levada contra a força elétrica no campo de 500 N/C e a energia potencial cresce em reta com o deslocamento, chegando a 4 × 10⁻⁴ J em 0,4 m",{lab:"E = 500 N/C · contra a força",xm:.4,ym:400,xu:"m",yu:"µJ",rx:"d",ry:"ΔEp",yl:"ΔEp (µJ)",dx:2,caps:["A carga de 2 µC é levada contra a força|elétrica, no campo de 500 N/C.","A energia potencial cresce em reta|com o deslocamento: ΔEp = q · E · d.","ΔEp = 2·10⁻⁶ · 500 · 0,4|ΔEp = 4 × 10⁻⁴ J."]});
trab("q111","a bateria move carga pelo circuito e a energia fornecida cresce em reta com a carga; com 2 C ela vale 3 J",{lab:"bateria de 1,5 V",xm:2,ym:3,xu:"C",yu:"J",rx:"q",ry:"E",yl:"E (J)",dx:1,dy:1,caps:["A bateria de 1,5 V vai empurrando carga|pelo circuito.","A energia cresce em reta com a carga:|E = q · U.","E = 2 · 1,5|E = 3 J."]});

/* elétron acelerado */
(function(){var p=placas({a:105,b:215,s:-1,l:"",lab:"elétron acelerado por 500 V"});
 G("calc_q165","Simulação: o elétron parte do repouso entre as placas e, conforme ganha energia dos 500 V, a velocidade cresce como raiz quadrada da ddp, chegando a 1,3 × 10⁷ m/s",{
  X:function(q){return 500*q},Y:function(q){return 1.326*Math.sqrt(q)},ym:1.326,xu:"V",yu:"×10⁷ m/s",yl:"v (×10⁷ m/s)",rx:"U",ry:"v",dx:0,dy:2,sc:p.sc,
  mv:[[".mq",function(q){return[105+110*q*q,0]},24]],
  caps:["O elétron parte do repouso e é acelerado|pela ddp de 500 V.","A energia ganha vale e·U, e|e·U = m·v² / 2: v cresce como √U.","v = √(2·1,6·10⁻¹⁹·500 / 9,1·10⁻³¹)|v ≈ 1,3 × 10⁷ m/s."]})})();

/* equilíbrio da gotícula e do pêndulo: força elétrica cresce até igualar o peso */
(function(){
 var gp=placas({a:160,b:160,s:-1,l:"",lab:"gotícula em equilíbrio"});
 G("calc_q166","Simulação: o campo entre as placas cresce e a força elétrica sobe em reta até igualar o peso da gotícula, 1,6 × 10⁻¹³ N, o que acontece com 5 × 10⁵ N/C; daí a carga é 3,2 × 10⁻¹⁹ C",{
  X:function(q){return 5*q},Y:function(q){return 1.6*q},ym:1.6,xu:"×10⁵ N/C",yl:"F (×10⁻¹³ N)",rx:"E",ry:"Fe",yu:"×10⁻¹³ N",dx:1,dy:2,sc:gp.sc,
  cvs:[cvP(function(q){return 1.6*q}),cvP(function(q){return 1.6},NEG)],
  gs:function(gx,gy){return t_(gx(.5),gy(1.6)-6,"peso = m·g",{s:10})},
  caps:["O campo entre as placas vai aumentando.|A força elétrica sobre a gotícula cresce.","A gotícula fica em equilíbrio quando|a força elétrica iguala o peso.","q·E = m·g → q = 1,6·10⁻¹⁴ · 10 / 5·10⁵|q = 3,2 × 10⁻¹⁹ C."]});
 var pd=pendulo();
 G("calc_q171","Simulação: o campo horizontal cresce e a esfera se afasta da vertical até 45°; nesse ponto a força elétrica iguala o peso, 0,2 N, o que acontece com 5 × 10⁴ N/C",{
  X:function(q){return 5*q},Y:function(q){return .2*q},ym:.2,xu:"×10⁴ N/C",yl:"força (N)",rx:"E",ry:"Fe",yu:"N",dx:1,dy:2,sc:pd.sc,tr:pd.tr,
  cvs:[cvP(function(q){return .2*q}),cvP(function(q){return .2},NEG)],
  gs:function(gx,gy){return t_(gx(.5),gy(.2)-6,"peso = m·g",{s:10})},
  caps:["O campo horizontal vai aumentando e a|esfera se afasta da vertical.","A 45°, a força elétrica iguala o peso:|tg 45° = qE / mg = 1.","E = m·g / q = 0,02 · 10 / 4·10⁻⁶|E = 5 × 10⁴ N/C."]})})();

/* campo resultante nulo entre duas cargas positivas */
(function(){
 function E1(q){var x=.12+.16*q;return 18000/(x*x)/1e5*1e0*1}
 function E2(q){var x=.12+.16*q;return 72000/Math.pow(.6-x,2)/1e5}
 var xs=function(x){return 160-60+(x/.6)*120};
 G("calc_q168","Simulação: um ponto de prova se desloca entre as cargas de 2 µC e 8 µC; o campo da menor cai e o da maior cresce, e eles se igualam a 0,2 m de q₁, onde o campo resultante é nulo",{
  X:function(q){return .12+.16*q},Y:E1,ym:Math.max(E1(0),E2(1)),xu:"m",yu:"×10⁵ N/C",yl:"E (×10⁵ N/C)",rx:"x",ry:"E₁",dx:2,dy:1,x0:1,
  cvs:[cvP(E1),cvP(E2,NEG)],
  sc:bal(100,56,12,1,"2 µC")+bal(220,56,16,1,"8 µC")+'<line x1="100" y1="78" x2="220" y2="78" stroke="currentColor" stroke-width="1.6"/>'+t_(160,91,"0,6 m",{s:11})+mvg("mq",160,56,'<circle r="5" fill="currentColor"/>'),
  mv:[[".mq",function(q){return[100+120*((.12+.16*q)/.6),0]},24]],
  gs:function(gx,gy){return'<line x1="'+gx(.5)+'" y1="'+gy(4.5)+'" x2="'+gx(.5)+'" y2="196" stroke="currentColor" stroke-dasharray="3 3"/><circle cx="'+gx(.5)+'" cy="'+gy(4.5)+'" r="4" fill="currentColor"/>'+t_(gx(.5),208,"0,2 m",{s:10})},
  rd:function(q){var x=.12+.16*q;return"x = "+f(x)+" m  ·  E₁ = "+f(E1(q),1)+"  ·  E₂ = "+f(E2(q),1)},
  caps:["Um ponto de prova se move entre as duas|cargas positivas (2 µC e 8 µC).","O campo de q₁ diminui e o de q₂ aumenta.|Eles se cancelam onde são iguais.","k·q₁ / x² = k·q₂ / (0,6 − x)²|x = 0,2 m."]})})();

/* densidade superficial de carga */
(function(){
 var pl_='<rect x="110" y="40" width="100" height="40" fill="'+ACC+'" fill-opacity=".3" stroke="currentColor" stroke-width="2.2"/>';
 lin("calc_q196","Simulação: a carga cresce sobre a chapa de 0,02 m² e a densidade superficial cresce em reta com ela, chegando a 3 × 10⁻⁴ C/m² com 6 µC",{xm:6,ym:3,xu:"µC",yu:"×10⁻⁴ C/m²",rx:"Q",ry:"σ",yl:"σ (×10⁻⁴ C/m²)",dx:1,dy:1,
  sc:pl_+t_(160,64,"A = 0,02 m²",{s:12})+t_(160,28,"carga se espalhando",{s:11})+'<g class="sg"><circle cx="130" cy="52" r="3" fill="'+ACC+'"/><circle cx="160" cy="48" r="3" fill="'+ACC+'"/><circle cx="190" cy="52" r="3" fill="'+ACC+'"/><circle cx="145" cy="72" r="3" fill="'+ACC+'"/><circle cx="175" cy="72" r="3" fill="'+ACC+'"/></g>',
  tr:function(T,T0,D){return[N.op(".sg",T,[[T0,0],[T0+.8,1]])]},
  caps:["A chapa de 0,02 m² vai recebendo carga,|espalhada por toda a superfície.","A densidade σ = Q / A cresce em reta|com a carga.","σ = 6·10⁻⁶ / 0,02|σ = 3,0 × 10⁻⁴ C/m²."]});
 lin("calc_q197","Simulação: a carga cresce sobre a esfera de raio 0,1 m e a densidade superficial cresce em reta com ela, chegando a 3,3 × 10⁻⁵ C/m² com 4 µC",{xm:4,ym:3.33,xu:"µC",yu:"×10⁻⁵ C/m²",rx:"Q",ry:"σ",yl:"σ (×10⁻⁵ C/m²)",dx:1,dy:1,
  sc:'<circle cx="160" cy="54" r="32" fill="'+ACC+'" fill-opacity=".3" stroke="currentColor" stroke-width="2.4"/>'+t_(160,59,"R = 0,1 m",{s:12})+t_(160,14,"carga na superfície",{s:11}),
  caps:["A esfera de raio 0,1 m vai recebendo carga|na superfície.","σ = Q / (4πR²), com π = 3, cresce em|reta com a carga.","σ = 4·10⁻⁶ / (4 · 3 · 0,1²)|σ ≈ 3,3 × 10⁻⁵ C/m²."]})})();

/* capacitores */
function cap(id,alt,o){
 var cs='<line x1="100" y1="54" x2="152" y2="54" stroke="currentColor" stroke-width="2"/><line x1="168" y1="54" x2="220" y2="54" stroke="currentColor" stroke-width="2"/><line x1="152" y1="30" x2="152" y2="78" stroke="currentColor" stroke-width="4"/><line x1="168" y1="30" x2="168" y2="78" stroke="currentColor" stroke-width="4"/>'+t_(160,20,o.lab,{s:12})+'<g class="ch"><circle cx="146" cy="40" r="3" fill="'+NEG+'"/><circle cx="146" cy="54" r="3" fill="'+NEG+'"/><circle cx="146" cy="68" r="3" fill="'+NEG+'"/><circle cx="174" cy="40" r="3" fill="'+ACC+'"/><circle cx="174" cy="54" r="3" fill="'+ACC+'"/><circle cx="174" cy="68" r="3" fill="'+ACC+'"/></g>';
 var P={xm:o.xm,ym:o.ym,xu:o.xu,yu:o.yu,rx:o.rx,ry:o.ry,yl:o.yl,dx:o.dx===undefined?0:o.dx,dy:o.dy===undefined?0:o.dy,sc:cs,tr:function(T,T0,D){return[N.op(".ch",T,[[T0,.15],[T0+D,1]])]},caps:o.caps};
 if(o.q2)quad("calc_"+id,alt,P);else lin("calc_"+id,alt,P)}
cap("q203","a tensão cresce e a carga do capacitor cresce em reta com ela; a inclinação é a capacitância, 5 µF, e com 12 V a carga é 60 µC",{lab:"capacitor",xm:12,ym:60,xu:"V",yu:"µC",rx:"U",ry:"Q",yl:"Q (µC)",caps:["Aumenta-se a tensão aplicada ao capacitor.|A carga armazenada cresce.","A carga cresce em reta com a tensão;|a inclinação é a capacitância.","C = Q / U = 60 / 12|C = 5 µF."]});
cap("q204","a tensão sobe até 9 V e a carga do capacitor de 20 µF cresce em reta com ela, chegando a 180 µC",{lab:"C = 20 µF",xm:9,ym:180,xu:"V",yu:"µC",rx:"U",ry:"Q",yl:"Q (µC)",caps:["Liga-se o capacitor de 20 µF a uma|tensão que sobe até 9 V.","A carga cresce em reta com a tensão:|Q = C · U.","Q = 20·10⁻⁶ · 9|Q = 180 µC."]});
cap("q205","a tensão sobe até 50 V e a energia do capacitor de 100 µF cresce com o quadrado dela, chegando a 0,125 J",{lab:"C = 100 µF",xm:50,ym:.125,xu:"V",yu:"J",rx:"U",ry:"E",yl:"E (J)",dy:3,q2:1,caps:["O capacitor de 100 µF é carregado com|tensão que sobe até 50 V.","A energia cresce com o quadrado da tensão:|E = C · U² / 2.","E = 100·10⁻⁶ · 50² / 2|E = 0,125 J."]});
cap("q214","a tensão da fonte sobe até 12 V e a carga de cada capacitor da associação em série (6 µF e 3 µF) cresce em reta, chegando a 24 µC",{lab:"série · Ceq = 2 µF",xm:12,ym:24,xu:"V",yu:"µC",rx:"U",ry:"Q",yl:"Q (µC)",caps:["Dois capacitores em série (6 µF e 3 µF)|ligados a uma fonte que sobe até 12 V.","Em série, os dois têm a mesma carga,|que cresce em reta: Q = Ceq · U.","Ceq = 2 µF → Q = 2·10⁻⁶ · 12|Q = 24 µC."]});

/* associações passo a passo (resistores ou capacitores) */
function assoc(id,alt,o){
 var v=o.v,k=v.length,Y=degraus(v),ym=Math.max.apply(null,v),p=passos({t:o.t,k:k,itens:o.itens,fios:o.fios,vez:o.vez});
 G("calc_"+id,alt,{X:function(q){return q},Y:Y,ym:ym,xu:"",yu:o.u,yl:o.yl,rx:"",ry:o.ry,dx:0,dy:o.dy===undefined?1:o.dy,n:48,sc:p.sc,tr:p.tr,
  rd:function(q){return o.ry+" = "+f(Y(q),o.dy===undefined?1:o.dy)+" "+o.u},caps:o.caps})}
var SF='<line x1="70" y1="54" x2="250" y2="54" stroke="currentColor" stroke-width="2"/>';
assoc("q210","dois capacitores são ligados em série, um depois do outro, e a capacitância equivalente cai de 6 µF para 2 µF",{t:"c",u:"µF",ry:"Ceq",yl:"Ceq (µF)",v:[6,2],dy:0,fios:SF,itens:[[120,54,"6 µF"],[200,54,"3 µF"]],caps:["Primeiro só o capacitor de 6 µF no circuito.|Depois liga-se o de 3 µF em série.","Em série, a capacitância equivalente|diminui: 1/Ceq = 1/C₁ + 1/C₂.","1/Ceq = 1/6 + 1/3 = 1/2|Ceq = 2 µF."]});
assoc("q211","três capacitores são ligados em paralelo, um depois do outro, e a capacitância equivalente cresce de 2 µF para 5 µF e para 10 µF",{t:"c",u:"µF",ry:"Ceq",yl:"Ceq (µF)",v:[2,5,10],dy:0,fios:'<line x1="110" y1="18" x2="110" y2="78" stroke="currentColor" stroke-width="2"/><line x1="222" y1="18" x2="222" y2="78" stroke="currentColor" stroke-width="2"/>',itens:[[160,18,"2 µF","d"],[160,48,"3 µF","d"],[160,78,"5 µF","d"]],caps:["Os capacitores de 2, 3 e 5 µF vão sendo|ligados em paralelo, um a um.","Em paralelo, as capacitâncias se somam:|Ceq = C₁ + C₂ + C₃.","Ceq = 2 + 3 + 5|Ceq = 10 µF."]});
assoc("q212","um capacitor de 4 µF em série com dois de 3 µF em paralelo; ao ligar um e depois o outro de 3 µF a capacitância equivalente passa de 4 µF para 1,7 µF e chega a 2,4 µF",{t:"c",u:"µF",ry:"Ceq",yl:"Ceq (µF)",v:[4,12/7,2.4],dy:1,
 fios:'<line x1="60" y1="48" x2="130" y2="48" stroke="currentColor" stroke-width="2"/><line x1="190" y1="30" x2="190" y2="66" stroke="currentColor" stroke-width="2"/><line x1="250" y1="30" x2="250" y2="66" stroke="currentColor" stroke-width="2"/><line x1="130" y1="48" x2="190" y2="48" stroke="currentColor" stroke-width="2"/><line x1="250" y1="48" x2="270" y2="48" stroke="currentColor" stroke-width="2"/>',
 itens:[[100,48,"4 µF"],[220,30,"3 µF"],[220,66,"3 µF"]],vez:[0,1,2],caps:["Entra o capacitor de 4 µF; depois um de|3 µF em série; por fim, outro de 3 µF.","Os dois de 3 µF em paralelo somam 6 µF;|esse conjunto fica em série com o de 4 µF.","Ceq = (4 · 6) / (4 + 6)|Ceq = 2,4 µF."]});

/* =========================  ELETRODINÂMICA  ========================= */
function ci(o){return circ(o)}
function rc(id,alt,o){
 var c=ci({r:o.rl,b:o.bl,i:o.il});
 lin("calc_"+id,alt,{xm:o.xm,ym:o.ym,xu:o.xu,yu:o.yu,rx:o.rx,ry:o.ry,yl:o.yl,dx:o.dx===undefined?0:o.dx,dy:o.dy===undefined?0:o.dy,sc:c.sc,mv:c.mv,caps:o.caps})}
/* carga = i·t */
rc("d002","a carga que atravessa a seção do fio cresce em reta com o tempo, e a inclinação é a corrente; em 40 s passam 120 C, ou seja, 3 A",{rl:"fio",bl:"",il:"i constante",xm:40,ym:120,xu:"s",yu:"C",rx:"t",ry:"Q",yl:"Q (C)",caps:["As cargas vão passando pela seção do fio,|ao longo do tempo.","A carga cresce em reta com o tempo;|a inclinação é a corrente.","i = Q / t = 120 / 40|i = 3 A."]});
rc("d003","com corrente de 2 A a carga que atravessa o fio cresce em reta com o tempo, chegando a 600 C em 5 minutos",{rl:"fio",bl:"",il:"i = 2 A",xm:300,ym:600,xu:"s",yu:"C",rx:"t",ry:"Q",yl:"Q (C)",caps:["Uma corrente de 2 A percorre o fio|durante 5 minutos (300 s).","A carga cresce em reta com o tempo:|Q = i · t.","Q = 2 · 300|Q = 600 C."]});
rc("d006","com corrente de 250 mA a carga que atravessa o aparelho cresce em reta com o tempo, chegando a 1800 C em 2 h",{rl:"aparelho",bl:"",il:"i = 250 mA",xm:2,ym:1800,xu:"h",yu:"C",rx:"t",ry:"Q",yl:"Q (C)",dx:1,caps:["Uma corrente de 250 mA passa pelo aparelho|durante 2 h (7200 s).","A carga cresce em reta com o tempo:|Q = i · t.","Q = 0,25 · 7200|Q = 1800 C."]});
/* U = R·i */
rc("d008","a corrente cresce pelo resistor de 20 Ω e a tensão cresce em reta com ela, chegando a 60 V com 3 A",{rl:"20 Ω",bl:"U",il:"i",xm:3,ym:60,xu:"A",yu:"V",rx:"i",ry:"U",yl:"U (V)",caps:["Aumenta-se a corrente no resistor de 20 Ω.|A tensão entre os terminais muda.","A tensão cresce em reta com a corrente;|a inclinação é a resistência.","U = R · i = 20 · 3|U = 60 V."]});
rc("d009","a tensão da fonte cresce sobre o resistor de 4 Ω e a corrente cresce em reta com ela, chegando a 3 A com 12 V",{rl:"4 Ω",bl:"U",il:"i",xm:12,ym:3,xu:"V",yu:"A",rx:"U",ry:"i",yl:"i (A)",caps:["Aumenta-se a tensão da fonte ligada ao|resistor de 4 Ω.","A corrente cresce em reta com a tensão:|i = U / R.","i = 12 / 4|i = 3 A."]});
rc("d010","a corrente cresce pelo resistor do chuveiro e a tensão cresce em reta com ela; a inclinação é a resistência, e com 5 A a tensão é 220 V",{rl:"chuveiro",bl:"U",il:"i",xm:5,ym:220,xu:"A",yu:"V",rx:"i",ry:"U",yl:"U (V)",caps:["A corrente no chuveiro vai aumentando|até 5 A, com 220 V.","A tensão cresce em reta com a corrente;|a inclinação é a resistência.","R = U / i = 220 / 5|R = 44 Ω."]});
rc("d011","a corrente cresce pelo resistor de 2 kΩ e a tensão cresce em reta com ela, chegando a 10 V com 5 mA",{rl:"2 kΩ",bl:"U",il:"i",xm:5,ym:10,xu:"mA",yu:"V",rx:"i",ry:"U",yl:"U (V)",caps:["Aumenta-se a corrente no resistor de 2 kΩ|até 5 mA.","A tensão cresce em reta com a corrente;|a inclinação é a resistência.","U = R · i = 2000 · 0,005|U = 10 V."]});
/* R = ρL/A */
rc("d016","o fio de cobre fica mais comprido e a resistência cresce em reta com o comprimento, chegando a 1,7 Ω em 100 m",{rl:"cobre",bl:"",il:"",xm:100,ym:1.7,xu:"m",yu:"Ω",rx:"L",ry:"R",yl:"R (Ω)",dy:1,caps:["O fio de cobre (seção de 1 mm²) vai|ficando mais comprido, até 100 m.","A resistência cresce em reta com o|comprimento: R = ρ · L / A.","R = 1,7·10⁻⁸ · 100 / 10⁻⁶|R = 1,7 Ω."]});
rc("d020","o fio de nicromo fica mais comprido e a resistência cresce em reta com o comprimento, chegando a 10 Ω com 20 m",{rl:"nicromo",bl:"",il:"",xm:20,ym:10,xu:"m",yu:"Ω",rx:"L",ry:"R",yl:"R (Ω)",caps:["O fio de nicromo (seção de 2 mm²) vai|ficando mais comprido.","A resistência cresce em reta com o|comprimento: R = ρ · L / A.","L = R · A / ρ = 10 · 2·10⁻⁶ / 10⁻⁶|L = 20 m."]});
/* associações de resistores */
var SFR='<line x1="60" y1="54" x2="260" y2="54" stroke="currentColor" stroke-width="2"/>';
assoc("d024","três resistores são ligados em série, um depois do outro, e a resistência equivalente cresce de 10 Ω para 30 Ω e para 60 Ω",{t:"r",u:"Ω",ry:"Req",yl:"Req (Ω)",v:[10,30,60],dy:0,fios:SFR,itens:[[100,54,"10 Ω"],[160,54,"20 Ω"],[220,54,"30 Ω"]],caps:["Os resistores de 10, 20 e 30 Ω vão sendo|ligados em série, um a um.","Em série, as resistências se somam:|Req = R₁ + R₂ + R₃.","Req = 10 + 20 + 30|Req = 60 Ω."]});
var PF='<line x1="110" y1="18" x2="110" y2="78" stroke="currentColor" stroke-width="2"/><line x1="222" y1="18" x2="222" y2="78" stroke="currentColor" stroke-width="2"/>';
assoc("d031","um segundo resistor é ligado em paralelo ao de 6 Ω e a resistência equivalente cai de 6 Ω para 2 Ω",{t:"r",u:"Ω",ry:"Req",yl:"Req (Ω)",v:[6,2],dy:0,fios:'<line x1="110" y1="30" x2="110" y2="70" stroke="currentColor" stroke-width="2"/><line x1="210" y1="30" x2="210" y2="70" stroke="currentColor" stroke-width="2"/>',itens:[[160,30,"6 Ω"],[160,70,"3 Ω"]],caps:["Só o resistor de 6 Ω no circuito.|Depois liga-se o de 3 Ω em paralelo.","Em paralelo, a resistência equivalente|diminui: 1/Req = 1/R₁ + 1/R₂.","1/Req = 1/6 + 1/3 = 1/2|Req = 2 Ω."]});
assoc("d032","três resistores iguais de 12 Ω são ligados em paralelo, um depois do outro, e a resistência equivalente cai de 12 Ω para 6 Ω e para 4 Ω",{t:"r",u:"Ω",ry:"Req",yl:"Req (Ω)",v:[12,6,4],dy:0,fios:PF,itens:[[160,18,"12 Ω","d"],[160,48,"12 Ω","d"],[160,78,"12 Ω","d"]],caps:["Três resistores de 12 Ω vão sendo ligados|em paralelo, um a um.","Em paralelo, a resistência equivalente|diminui a cada novo ramo.","Req = R / n = 12 / 3|Req = 4 Ω."]});
assoc("d034","um resistor de 12 Ω é ligado em paralelo ao de 8 Ω e a resistência equivalente cai de 8 Ω para 4,8 Ω",{t:"r",u:"Ω",ry:"Req",yl:"Req (Ω)",v:[8,4.8],dy:1,fios:'<line x1="110" y1="30" x2="110" y2="70" stroke="currentColor" stroke-width="2"/><line x1="210" y1="30" x2="210" y2="70" stroke="currentColor" stroke-width="2"/>',itens:[[160,30,"8 Ω"],[160,70,"12 Ω"]],caps:["Só o resistor de 8 Ω no circuito.|Depois liga-se o de 12 Ω em paralelo.","Em paralelo, a resistência equivalente|diminui: Req = R₁·R₂ / (R₁ + R₂).","Req = 8 · 12 / (8 + 12)|Req = 4,8 Ω."]});
assoc("d040","um resistor de 4 Ω é ligado em série com um de 6 Ω e depois um de 3 Ω entra em paralelo com o de 6 Ω; a resistência equivalente vai de 4 Ω para 10 Ω e cai para 6 Ω",{t:"r",u:"Ω",ry:"Req",yl:"Req (Ω)",v:[4,10,6],dy:0,
 fios:'<line x1="60" y1="46" x2="130" y2="46" stroke="currentColor" stroke-width="2"/><line x1="190" y1="28" x2="190" y2="64" stroke="currentColor" stroke-width="2"/><line x1="250" y1="28" x2="250" y2="64" stroke="currentColor" stroke-width="2"/><line x1="130" y1="46" x2="190" y2="46" stroke="currentColor" stroke-width="2"/><line x1="250" y1="46" x2="270" y2="46" stroke="currentColor" stroke-width="2"/>',
 itens:[[100,46,"4 Ω"],[220,28,"6 Ω"],[220,64,"3 Ω"]],caps:["Entra o resistor de 4 Ω; depois um de 6 Ω|em série; por fim, o de 3 Ω em paralelo.","O paralelo de 6 Ω e 3 Ω dá 2 Ω,|que fica em série com os 4 Ω.","Req = 4 + (6 · 3) / (6 + 3)|Req = 6 Ω."]});
/* tensão da fonte cresce (circuito de resistores) */
function fonte(id,alt,o){
 var c=ci({r:o.rl,b:o.bl,i:"i"});
 lin("calc_"+id,alt,{xm:o.xm,ym:o.ym,xu:o.xu,yu:o.yu,rx:o.rx,ry:o.ry,yl:o.yl,dx:0,dy:o.dy===undefined?0:o.dy,sc:c.sc,mv:c.mv,caps:o.caps})}
fonte("d025","a tensão da fonte cresce sobre os resistores de 2 Ω e 4 Ω em série e a corrente cresce em reta com ela, chegando a 2 A com 12 V",{rl:"2 Ω + 4 Ω",bl:"U",xm:12,ym:2,xu:"V",yu:"A",rx:"U",ry:"i",yl:"i (A)",caps:["Aumenta-se a tensão da fonte ligada aos|resistores de 2 Ω e 4 Ω em série.","A corrente cresce em reta com a tensão:|i = U / Req.","i = 12 / (2 + 4)|i = 2 A."]});
fonte("d026","a tensão da fonte cresce e a tensão sobre o resistor de 4 Ω, em série com 2 Ω, cresce em reta, chegando a 8 V com 12 V",{rl:"2 Ω + 4 Ω",bl:"U",xm:12,ym:8,xu:"V",yu:"V",rx:"U",ry:"U₄",yl:"U no 4 Ω (V)",caps:["Aumenta-se a tensão da fonte ligada aos|resistores de 2 Ω e 4 Ω em série.","A tensão se divide em proporção às|resistências: o 4 Ω fica com 4/6 do total.","i = 12 / 6 = 2 A|U = 4 · 2 = 8 V."]});
fonte("d033","a tensão da fonte cresce sobre os resistores de 8 Ω e 12 Ω em paralelo e a corrente total cresce em reta com ela, chegando a 5 A com 24 V",{rl:"8 Ω ∥ 12 Ω",bl:"U",xm:24,ym:5,xu:"V",yu:"A",rx:"U",ry:"i",yl:"i total (A)",caps:["Aumenta-se a tensão da fonte ligada aos|resistores de 8 Ω e 12 Ω em paralelo.","As correntes dos dois ramos se somam:|i = U/8 + U/12.","i = 24/8 + 24/12 = 3 + 2|i = 5 A."]});
fonte("d041","a tensão da fonte cresce sobre o conjunto de 4 Ω em série com 6 Ω e 3 Ω em paralelo e a corrente cresce em reta, chegando a 2 A com 12 V",{rl:"4 Ω + (6 Ω ∥ 3 Ω)",bl:"U",xm:12,ym:2,xu:"V",yu:"A",rx:"U",ry:"i",yl:"i (A)",caps:["Aumenta-se a tensão da fonte ligada ao|conjunto, cuja Req é 6 Ω.","A corrente cresce em reta com a tensão:|i = U / Req.","i = 12 / 6|i = 2 A."]});
fonte("d042","a tensão da fonte cresce e a tensão sobre o paralelo de 6 Ω e 3 Ω cresce em reta, chegando a 4 V com 12 V",{rl:"4 Ω + (6 Ω ∥ 3 Ω)",bl:"U",xm:12,ym:4,xu:"V",yu:"V",rx:"U",ry:"Upar",yl:"U no paralelo (V)",caps:["Aumenta-se a tensão da fonte; a corrente|passa pelos 4 Ω e pelo paralelo (2 Ω).","A tensão se divide em proporção às|resistências: o paralelo fica com 2/6.","i = 12 / 6 = 2 A|U = 2 · 2 = 4 V."]});
/* gerador */
fonte("d068","a fem do gerador cresce e a corrente no circuito (1 Ω interno e 5 Ω externo) cresce em reta, chegando a 2 A com 12 V",{rl:"5 Ω",bl:"ε, r = 1 Ω",xm:12,ym:2,xu:"V",yu:"A",rx:"ε",ry:"i",yl:"i (A)",caps:["Aumenta-se a fem do gerador, que tem|resistência interna de 1 Ω.","A corrente cresce em reta com a fem:|i = ε / (R + r).","i = 12 / (5 + 1)|i = 2 A."]});
(function(){var c=ci({r:"R",b:"ε = 12 V, r = 1 Ω",i:"i"});
 function Y(q){return 12-2*q}
 G("calc_d067","Simulação: a corrente fornecida pelo gerador cresce até 2 A e a tensão nos terminais cai em reta, de 12 V para 10 V, por causa da resistência interna de 1 Ω",{X:function(q){return 2*q},Y:Y,ym:12,xu:"A",yu:"V",yl:"U (V)",rx:"i",ry:"U",dx:1,dy:1,sc:c.sc,mv:c.mv,caps:["O gerador de 12 V fornece corrente cada vez|maior ao circuito.","A tensão nos terminais cai em reta:|U = ε − r · i.","U = 12 − 1 · 2|U = 10 V."]})})();
(function(){var c=ci({r:"fio",b:"ε = 12 V, r = 0,5 Ω",i:"i"});
 function Y(q){return 12/(5*(1-q)+.5)}
 G("calc_d069","Simulação: a resistência externa diminui até zero (curto-circuito) e a corrente do gerador de 12 V e 0,5 Ω cresce até 24 A",{X:function(q){return 5*(1-q)},Y:Y,ym:24,xu:"Ω",yu:"A",yl:"i (A)",rx:"R",ry:"i",dx:1,dy:1,x0:1,sc:c.sc,mv:c.mv,caps:["A resistência externa da bateria de 12 V|vai diminuindo até zero (curto).","A corrente cresce muito:|i = ε / (R + r).","Com R = 0: i = 12 / 0,5|i = 24 A."]})})();
/* potência */
function pot(id,alt,o){
 var c=ci({r:o.rl,b:o.bl,i:o.il});
 var P={xm:o.xm,ym:o.ym,xu:o.xu,yu:o.yu,rx:o.rx,ry:o.ry,yl:o.yl,dx:o.dx===undefined?0:o.dx,dy:o.dy===undefined?0:o.dy,sc:c.sc,mv:c.mv,caps:o.caps};
 if(o.q2)quad("calc_"+id,alt,P);else lin("calc_"+id,alt,P)}
pot("d043","a corrente cresce no aparelho ligado em 220 V e a potência cresce em reta, chegando a 1100 W com 5 A",{rl:"aparelho",bl:"220 V",il:"i",xm:5,ym:1100,xu:"A",yu:"W",rx:"i",ry:"P",yl:"P (W)",caps:["A corrente num aparelho de 220 V vai|aumentando até 5 A.","A potência cresce em reta com a corrente:|P = U · i.","P = 220 · 5|P = 1100 W."]});
pot("d044","a tensão cresce sobre o resistor de 24 Ω e a potência cresce com o quadrado dela, chegando a 600 W com 120 V",{rl:"24 Ω",bl:"U",il:"i",xm:120,ym:600,xu:"V",yu:"W",rx:"U",ry:"P",yl:"P (W)",q2:1,caps:["Aumenta-se a tensão sobre o resistor de 24 Ω.|A potência dissipada muda.","A potência cresce com o quadrado da tensão:|P = U² / R.","P = 120² / 24|P = 600 W."]});
pot("d045","a corrente cresce no resistor de 10 Ω e a potência cresce com o quadrado dela, chegando a 90 W com 3 A",{rl:"10 Ω",bl:"",il:"i",xm:3,ym:90,xu:"A",yu:"W",rx:"i",ry:"P",yl:"P (W)",q2:1,caps:["Aumenta-se a corrente no resistor de 10 Ω.|A potência dissipada muda.","A potência cresce com o quadrado da corrente:|P = R · i².","P = 10 · 3²|P = 90 W."]});
pot("d046","a potência do chuveiro cresce e a corrente puxada da rede de 220 V cresce em reta, chegando a 25 A com 5500 W",{rl:"chuveiro",bl:"220 V",il:"i",xm:5500,ym:25,xu:"W",yu:"A",rx:"P",ry:"i",yl:"i (A)",caps:["Um chuveiro ligado em 220 V, com a potência|subindo até 5500 W.","A corrente cresce em reta com a potência:|i = P / U.","i = 5500 / 220|i = 25 A."]});
pot("d047","a potência do chuveiro de 220 V cresce até 4400 W e a corrente cresce em reta até 20 A; daí a resistência vale 11 Ω",{rl:"chuveiro",bl:"220 V",il:"i",xm:4400,ym:20,xu:"W",yu:"A",rx:"P",ry:"i",yl:"i (A)",caps:["Um chuveiro de 220 V, com a potência|subindo até 4400 W.","A corrente cresce em reta com a potência:|i = P / U = 20 A.","R = U / i = 220 / 20|R = 11 Ω."]});
pot("d061","a corrente cresce no fio de 0,5 Ω e a potência por efeito Joule cresce com o quadrado dela, chegando a 50 W com 10 A",{rl:"0,5 Ω",bl:"",il:"i",xm:10,ym:50,xu:"A",yu:"W",rx:"i",ry:"P",yl:"P (W)",q2:1,caps:["Aumenta-se a corrente no fio de 0,5 Ω.|O fio esquenta.","A potência cresce com o quadrado da corrente:|P = R · i².","P = 0,5 · 10²|P = 50 W."]});
/* energia = P·t */
function en(id,alt,o){
 var c=ci({r:o.rl,b:"",i:o.il});
 lin("calc_"+id,alt,{xm:o.xm,ym:o.ym,xu:o.xu,yu:o.yu,rx:"t",ry:"E",yl:o.yl,dx:o.dx===undefined?0:o.dx,dy:o.dy===undefined?0:o.dy,sc:c.sc,mv:c.mv,caps:o.caps})}
en("d052","o chuveiro de 4000 W fica ligado e a energia consumida cresce em reta com o tempo, chegando a 1 kWh em 15 minutos",{rl:"chuveiro 4000 W",il:"",xm:15,ym:1,xu:"min",yu:"kWh",yl:"E (kWh)",caps:["O chuveiro de 4000 W (4 kW) fica ligado|por 15 minutos.","A energia cresce em reta com o tempo:|E = P · t.","E = 4 kW · 0,25 h|E = 1 kWh."]});
en("d053","a lâmpada de 60 W fica acesa e a energia consumida cresce em reta com o tempo, chegando a 9 kWh em 150 horas",{rl:"lâmpada 60 W",il:"",xm:150,ym:9,xu:"h",yu:"kWh",yl:"E (kWh)",caps:["A lâmpada de 60 W (0,06 kW) fica acesa|5 h por dia, 150 h em 30 dias.","A energia cresce em reta com o tempo:|E = P · t.","E = 0,06 kW · 150 h|E = 9 kWh."]});
en("d054","a lâmpada de 100 W fica ligada e a energia transformada cresce em reta com o tempo, chegando a 1,2 × 10⁴ J em 2 minutos",{rl:"lâmpada 100 W",il:"",xm:120,ym:12,xu:"s",yu:"kJ",yl:"E (kJ)",caps:["A lâmpada de 100 W fica ligada por|2 minutos (120 s).","A energia cresce em reta com o tempo:|E = P · t.","E = 100 · 120|E = 1,2 × 10⁴ J."]});
en("d055","o aparelho de 1500 W fica ligado e a energia consumida cresce em reta com o tempo, chegando a 3 kWh em 2 h",{rl:"aparelho 1500 W",il:"",xm:2,ym:3,xu:"h",yu:"kWh",yl:"E (kWh)",dx:1,caps:["O aparelho de 1500 W (1,5 kW) fica ligado,|e a energia vai sendo consumida.","A energia cresce em reta com o tempo;|chega a 3 kWh quando t = E / P.","t = 3 kWh / 1,5 kW|t = 2 h."]});
en("d060","o resistor de 10 Ω com 2 A dissipa 40 W e a energia em forma de calor cresce em reta com o tempo, chegando a 1,2 × 10⁴ J em 5 minutos",{rl:"10 Ω",il:"2 A",xm:300,ym:12,xu:"s",yu:"kJ",yl:"E (kJ)",caps:["O resistor de 10 Ω com 2 A dissipa|P = R·i² = 40 W.","A energia cresce em reta com o tempo:|E = P · t.","E = 40 · 300|E = 1,2 × 10⁴ J."]});
})();
