/* Óptica geométrica: simulações do FENÔMENO (substituem as resoluções passo a passo). */
(function(){"use strict";
var F=window.FEN,N=F.N,t_=F.t_,ACC=F.ACC,NEG=F.NEG,xy=F.xy,cvP=F.cvP,f=F.f,r=F.r,GR=F.GR,mvg=F.mvg,PI=Math.PI,D2R=PI/180;
function arrUp(h,col){return'<path d="M0 0L0 '+(-h)+'" stroke="'+col+'" stroke-width="3"/><path d="M-5 '+(-h+7)+'L0 '+(-h-2)+'L5 '+(-h+7)+'Z" fill="'+col+'"/>'}
var AXIS='<line x1="10" y1="60" x2="310" y2="60" stroke="currentColor" stroke-opacity=".5"/>';

/* ===== semelhança de triângulos: sombras ===== */
xy("calc_p007","Simulação: o Sol desce e as sombras crescem; a sombra da pessoa é sempre 0,3 da sombra do poste, pois os triângulos são semelhantes, e quando o poste de 6 m tem 4 m de sombra a pessoa tem 1,2 m",{ym:1.2,xl:"",xe:"4 m",yl:"",ye:"1,2",gs:function(gx,gy){return t_(gx(0)+8,gy(1.2)+10,"sombra da pessoa (m)",{s:11,a:"start"})},
 sc:GR+'<rect x="60" y="34" width="6" height="60" fill="currentColor" fill-opacity=".7"/><rect x="190" y="76" width="5" height="18" fill="currentColor" fill-opacity=".7"/><circle cx="192" cy="72" r="4" fill="currentColor"/>'+
  '<g class="s1" style="transform-origin:66px 94px"><rect x="66" y="90" width="80" height="4" fill="currentColor" fill-opacity=".35"/></g><g class="s2" style="transform-origin:195px 94px"><rect x="195" y="90" width="24" height="4" fill="currentColor" fill-opacity=".35"/></g>'+
  t_(63,26,"6 m",{s:11})+t_(192,62,"? m",{s:11})+'<line x1="60" y1="34" x2="146" y2="94" stroke="'+NEG+'" stroke-dasharray="4 3"/><line x1="192" y1="76" x2="219" y2="94" stroke="'+NEG+'" stroke-dasharray="4 3"/>',
 tr:function(T,T0,D){return[N.sc(".s1",T,[[T0,.08,1],[T0+D,1,1]],"linear"),N.sc(".s2",T,[[T0,.08,1],[T0+D,1,1]],"linear")]},cv:[cvP(function(q){return 1.2*q})],
 rd:function(q){return"poste: "+f(4*q)+" m  ·  pessoa: "+f(1.2*q)+" m"},caps:["Com o Sol mais baixo, as duas sombras crescem.|Veja a razão entre elas: sempre a mesma.","Os triângulos são semelhantes:|H / S = h / s (reta no gráfico).","h = 6 · 1,2 / 4 = 1,8 m."]});
xy("calc_p008","Simulação: numa câmara escura de orifício, quanto mais longe o anteparo do orifício maior a imagem invertida; a altura da imagem é proporcional à distância, i / o = p' / p, e com 0,2 m ela vale 0,05 m",{ym:5,xl:"",xe:"0,2 m",yl:"imagem (cm)",ye:"5",
 sc:AXIS+mvg("o",34,60,arrUp(50,ACC))+t_(34,76,"2 m",{s:11})+'<path d="M190 8L190 56M190 64L190 100" stroke="currentColor" stroke-width="5"/>'+
  mvg("scr",250,60,'<line x1="0" y1="10" x2="0" y2="100" stroke="currentColor" stroke-width="3"/>')+mvg("im",250,60,'<g class="is" style="transform-origin:0 0"><g transform="scale(1 -1)">'+arrUp(19,NEG)+'</g></g>')+t_(110,88,"8 m (fora de escala)",{s:10})+t_(222,88,"0,2 m",{s:10})
  ,mv:[[".scr",function(q){return[190+60*q,60]},12],[".im",function(q){return[190+60*q,60]},12]],
 tr:function(T,T0,D){return[N.sc(".is",T,[[T0,1,.05],[T0+D,1,1]],"linear")]},cv:[cvP(function(q){return 5*q})],
 rd:function(q){return"anteparo a "+f(.2*q,2)+" m  ·  imagem: "+f(5*q,1)+" cm"},caps:["A luz passa pelo orifício e forma uma|imagem invertida no anteparo.","Afastando o anteparo, a imagem cresce em reta:|i / o = p' / p.","i = 2 · 0,2 / 8 = 0,05 m|(5 cm, invertida)."]});
xy("calc_p009","Simulação: a luz do Sol viaja a 3 × 10⁸ m/s e percorre 1,5 × 10¹¹ m até a Terra em 500 s, cerca de 8 min 20 s",{ym:1.5,xl:"",xe:"500 s",yl:"distância (10¹¹ m)",ye:"1,5",
 sc:'<circle cx="40" cy="52" r="26" fill="#fbbf24" stroke="currentColor" stroke-width="2"/><circle cx="290" cy="52" r="8" fill="'+ACC+'" stroke="currentColor" stroke-width="2"/>'+t_(40,92,"Sol",{s:11})+t_(290,76,"Terra",{s:11})+mvg("m0",276,52,'<circle r="5" fill="'+NEG+'"/>'),
 mv:[[".m0",function(q){return[74+202*q,52]},20]],cv:[cvP(function(q){return 1.5*q})],rd:function(q){return"t = "+f(500*q,0)+" s  ·  luz a "+f(1.5*q,2)+" × 10¹¹ m"},
 caps:["Um pulso de luz sai do Sol em direção à Terra.|A velocidade da luz é constante: 3 × 10⁸ m/s.","A distância percorrida cresce em reta:|a inclinação é a velocidade da luz.","t = d / c = 1,5·10¹¹ / 3·10⁸|t = 500 s (cerca de 8 min 20 s)."]});

/* ===== espelho plano ===== */
function planoDist(key,alt,o){
 xy(key,alt,o)}
xy("calc_p013","Simulação: a imagem num espelho plano fica à mesma distância atrás dele que a pessoa na frente; afastando-se do espelho até 1,5 m, a distância entre pessoa e imagem cresce até 3 m",{ym:3,xl:"",xe:"1,5 m",yl:"pessoa–imagem (m)",ye:"3",
 sc:'<line x1="160" y1="8" x2="160" y2="98" stroke="currentColor" stroke-width="5"/><path d="M160 8L170 18M160 24L170 34M160 40L170 50M160 56L170 66M160 72L170 82M160 88L170 98" stroke="currentColor" stroke-opacity=".5"/>'+mvg("p0",60,60,'<circle cy="-24" r="6" fill="'+ACC+'"/><path d="M0 -18L0 6" stroke="'+ACC+'" stroke-width="4"/>')+mvg("p1",260,60,'<circle cy="-24" r="6" fill="none" stroke="'+ACC+'" stroke-dasharray="3 2" stroke-width="2"/><path d="M0 -18L0 6" stroke="'+ACC+'" stroke-dasharray="3 2" stroke-opacity=".7" stroke-width="3"/>')+t_(110,88,"pessoa",{s:11})+t_(210,88,"imagem",{s:11}),
 mv:[[".p0",function(q){return[160-100*q,60]},12],[".p1",function(q){return[160+100*q,60]},12]],cv:[cvP(function(q){return 3*q})],
 rd:function(q){return"pessoa a "+f(1.5*q)+" m  ·  pessoa–imagem: "+f(3*q)+" m"},caps:["A imagem é simétrica à pessoa em relação|ao espelho: mesma distância, do outro lado.","Se a pessoa se afasta, a imagem se afasta igual:|a distância entre as duas é o dobro.","d = 1,5 + 1,5 = 3 m."]});
xy("calc_p014","Simulação: para uma pessoa se ver de corpo inteiro num espelho plano vertical, a altura mínima do espelho é metade da altura dela; para 1,80 m o espelho tem 0,90 m",{ym:.9,xl:"",xe:"1,80 m",yl:"espelho mínimo (m)",ye:"0,90",
 sc:'<g class="sp" style="transform-origin:90px 94px">'+'<circle cx="90" cy="26" r="7" fill="'+ACC+'"/><path d="M90 33L90 76M90 76L82 94M90 76L98 94M90 44L80 62M90 44L100 62" stroke="'+ACC+'" stroke-width="3.4" fill="none"/></g>'+
  '<g class="sm" style="transform-origin:200px 94px"><rect x="196" y="46" width="8" height="45" fill="currentColor" fill-opacity=".5" stroke="currentColor" stroke-width="2"/></g>'+t_(250,34,"espelho = metade",{s:11})+t_(250,50,"da altura",{s:11}),
 tr:function(T,T0,D){return[N.sc(".sp",T,[[T0,.3,.3],[T0+D,1,1]],"linear"),N.sc(".sm",T,[[T0,1,.3],[T0+D,1,1]],"linear")]},cv:[cvP(function(q){return .9*q})],
 rd:function(q){return"pessoa: "+f(1.8*q)+" m  ·  espelho mínimo: "+f(.9*q)+" m"},caps:["Quanto mais alta a pessoa, maior precisa|ser o espelho para ela se ver inteira.","A altura mínima do espelho é sempre|metade da altura da pessoa (reta).","h(espelho) = 1,80 / 2 = 0,90 m."]});
xy("calc_p017","Simulação: uma pessoa se aproxima do espelho a 2 m/s e a imagem se aproxima dele também a 2 m/s; a distância entre as duas diminui 4 m a cada segundo",{ym:8,xl:"",xe:"2 s",yl:"pessoa–imagem (m)",ye:"8",
 sc:'<line x1="160" y1="8" x2="160" y2="98" stroke="currentColor" stroke-width="5"/>'+mvg("p0",160,60,'<circle cy="-24" r="6" fill="'+ACC+'"/><path d="M0 -18L0 6" stroke="'+ACC+'" stroke-width="4"/>')+mvg("p1",160,60,'<circle cy="-24" r="6" fill="none" stroke="'+ACC+'" stroke-dasharray="3 2" stroke-width="2"/><path d="M0 -18L0 6" stroke="'+ACC+'" stroke-dasharray="3 2" stroke-opacity=".7" stroke-width="3"/>')+t_(70,88,"pessoa",{s:11})+t_(250,88,"imagem",{s:11}),
 mv:[[".p0",function(q){return[60+100*q-10,60]},12],[".p1",function(q){return[260-100*q+10,60]},12]],cv:[cvP(function(q){return 8*(1-q)})],
 rd:function(q){return"t = "+f(2*q)+" s  ·  pessoa–imagem: "+f(8*(1-q))+" m"},caps:["A pessoa anda para o espelho a 2 m/s.|A imagem anda para o espelho também a 2 m/s.","Elas se aproximam uma da outra com|as duas velocidades somadas.","v = 2 + 2 = 4 m/s."]});

/* ===== dois espelhos planos ===== */
(function(){var N0=34,imgs=[-30,90,150,-90,210],cx=110,cy=62;
 function P(a){return[cx+N0*Math.cos(a*D2R),cy-N0*Math.sin(a*D2R)]}
 var im=imgs.map(function(a){var p=P(a);return'<circle cx="'+r(p[0])+'" cy="'+r(p[1])+'" r="4.5" fill="none" stroke="'+ACC+'" stroke-dasharray="2 2" stroke-width="1.6"/>'}).join(""),o=P(30);
 xy("calc_p015","Simulação: ao fechar o ângulo entre dois espelhos planos de 180° para 60°, o número de imagens de um objeto cresce segundo 360° / θ − 1, chegando a 5 imagens",{ym:5,xl:"",x0t:"180°",xe:"60°",yl:"nº de imagens",ye:"5",n:60,
 sc:'<g class="m2" style="transform-origin:'+cx+'px '+cy+'px"><g transform="translate('+cx+' '+cy+') rotate(-60)"><line x1="0" y1="0" x2="64" y2="0" stroke="currentColor" stroke-width="4"/></g></g><line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+64)+'" y2="'+cy+'" stroke="currentColor" stroke-width="4"/><g class="im">'+im+'</g><circle cx="'+r(o[0])+'" cy="'+r(o[1])+'" r="4.5" fill="'+NEG+'"/>'+t_(250,34,"objeto (vermelho)",{s:11})+t_(250,50,"imagens (tracejadas)",{s:11}),
 tr:function(T,T0,D){return[N.rot(".m2",T,[[T0,120],[T0+D,0]],"linear"),N.vis(".im",T,T0+D)]},cv:[cvP(function(q){return 360/(180-120*q)-1})],
 rd:function(q){var a=180-120*q;return"θ = "+f(a,0)+"°  ·  imagens: "+f(360/a-1,1)},caps:["Fechando o ângulo entre os espelhos,|as reflexões se repetem mais vezes.","Quanto menor o ângulo, mais imagens:|o número cresce rápido.","Com θ = 60°:|N = 360° / θ − 1 = 360 / 60 − 1 = 5."]})})();

/* ===== espelho esférico: f = R/2 ===== */
xy("calc_p023","Simulação: num espelho esférico o foco fica na metade do caminho entre o vértice e o centro de curvatura; o gráfico mostra a distância focal crescendo em reta com o raio, f = R / 2, e para R = 40 cm ela vale 20 cm",{ym:20,xl:"",xe:"40 cm",yl:"f (cm)",ye:"20",
 sc:AXIS+'<g class="sp" style="transform-origin:60px 60px"><path d="M60 8Q 60 60 60 112" stroke="currentColor" stroke-width="0" fill="none"/><path d="M60 14A 100 100 0 0 1 60 106" fill="none" stroke="currentColor" stroke-width="4" transform="translate(0 0)"/><circle cx="160" cy="60" r="4" fill="'+NEG+'"/><circle cx="110" cy="60" r="4" fill="'+ACC+'"/>'+t_(160,76,"C",{s:12})+t_(110,76,"F",{s:12})+'</g>'+t_(238,34,"R = distância ao centro C",{s:10})+t_(238,50,"f = distância ao foco F",{s:10}),
 tr:function(T,T0,D){return[N.sc(".sp",T,[[T0,.3,.3],[T0+D,1,1]],"linear")]},cv:[cvP(function(q){return 20*q})],
 rd:function(q){return"R = "+f(40*q,0)+" cm  ·  f = "+f(20*q,0)+" cm"},caps:["O foco F fica sempre na metade do caminho|entre o espelho e o centro de curvatura C.","Quanto maior o raio, maior a distância focal:|reta no gráfico.","f = R / 2 = 40 / 2 = 20 cm."]});

/* ===== imagem em espelhos e lentes: o objeto se aproxima e a imagem se desloca ===== */
function imagem(key,alt,o){
 var X0=o.X0,f0=o.f,pS=o.pS,pE=o.pE,k=(X0-16)/Math.max(pS,pE),ho=22,mir=o.type==="mirror";
 function pp(p){return f0*p/(p-f0)}
 function xo(p){return X0-p*k}
 function xi(p){return mir?X0-pp(p)*k:X0+pp(p)*k}
 function mg(p){return -pp(p)/p}
 var P=function(q){return pS+(pE-pS)*q},xe=P(1),
 optic=mir?(f0>0?'<path d="M'+X0+' 18Q'+(X0+16)+' 60 '+X0+' 102" fill="none" stroke="currentColor" stroke-width="4"/>':'<path d="M'+X0+' 18Q'+(X0-16)+' 60 '+X0+' 102" fill="none" stroke="currentColor" stroke-width="4"/>'):
  (f0>0?'<path d="M'+X0+' 16Q'+(X0+11)+' 60 '+X0+' 104Q'+(X0-11)+' 60 '+X0+' 16Z" fill="'+ACC+'" fill-opacity=".25" stroke="currentColor" stroke-width="2.4"/>':'<path d="M'+(X0-8)+' 16Q'+X0+' 60 '+(X0-8)+' 104L'+(X0+8)+' 104Q'+X0+' 60 '+(X0+8)+' 16Z" fill="'+ACC+'" fill-opacity=".25" stroke="currentColor" stroke-width="2.4"/>');
 var fx=function(s){return mir?X0-s*f0*k:X0+s*f0*k};
 var foci=mir?'<circle cx="'+fx(1)+'" cy="60" r="3.5" fill="'+NEG+'"/>'+t_(fx(1),76,"F",{s:11}):'<circle cx="'+(X0-f0*k)+'" cy="60" r="3.5" fill="'+NEG+'"/><circle cx="'+(X0+f0*k)+'" cy="60" r="3.5" fill="'+NEG+'"/>'+t_(X0-f0*k,76,"F",{s:11})+t_(X0+f0*k,76,"F'",{s:11}),
 me=mg(xe);
 var svg=AXIS+optic+foci+mvg("ob",xo(xe),60,arrUp(ho,ACC))+t_(xo(xe),30,"objeto",{s:10})+mvg("im",xi(xe),60,'<g class="is" style="transform-origin:0 0"><g transform="scale(1 '+r(me)+')">'+arrUp(ho,NEG)+'</g></g>')+t_(xi(xe),92,"imagem",{s:10});
 xy(key,alt,{ym:o.ym,xl:"",x0t:f(pS,0),xe:f(pE,0)+" cm",yl:o.yl,ye:o.ye,sc:svg,
  mv:[[".ob",function(q){return[xo(P(q)),60]},24],[".im",function(q){return[xi(P(q)),60]},24]],
  tr:function(T,T0,D){var p=[],i,n=24;for(i=0;i<=n;i++)p.push([T0+D*i/n,1,mg(P(i/n))/me]);return[N.sc(".is",T,p,"linear")]},
  cv:[cvP(function(q){return o.Y(P(q),pp(P(q)),mg(P(q)))})],nr:4,
  rd:function(q){var p=P(q);return o.rd(p,pp(p),mg(p))},caps:o.caps})}
imagem("calc_p024","Simulação: um objeto se aproxima de um espelho côncavo de 10 cm de distância focal; a imagem real se desloca e, com o objeto a 30 cm, forma-se a 15 cm do espelho",{type:"mirror",X0:290,f:10,pS:60,pE:30,ym:15,yl:"p' (cm)",ye:"15",Y:function(p,pi){return pi},
 rd:function(p,pi){return"p = "+f(p,0)+" cm  ·  p' = "+f(pi,1)+" cm"},caps:["O objeto se aproxima do espelho côncavo.|A imagem real (invertida) se desloca também.","Cada posição do objeto tem uma imagem:|1/f = 1/p + 1/p'.","1/p' = 1/10 − 1/30 = 2/30|p' = 15 cm (imagem real)."]});
imagem("calc_p025","Simulação: num espelho côncavo de f = 10 cm, aproximando o objeto de 60 cm a 30 cm, a imagem invertida cresce; a 30 cm o aumento vale −0,5, a imagem tem metade do tamanho do objeto",{type:"mirror",X0:290,f:10,pS:60,pE:30,ym:.5,yl:"|A|",ye:"0,5",Y:function(p,pi,m){return Math.abs(m)},
 rd:function(p,pi,m){return"p = "+f(p,0)+" cm  ·  A = "+f(m,2)},caps:["Ao aproximar o objeto, a imagem invertida cresce.|O aumento A mede quantas vezes.","A = −p' / p: o sinal negativo indica|imagem invertida.","A = −15 / 30 = −0,5:|a imagem tem metade|do tamanho do objeto."]});
imagem("calc_p027","Simulação: um objeto se aproxima de um espelho convexo de distância focal −15 cm; a imagem virtual, menor e direita, forma-se atrás do espelho e, com o objeto a 30 cm, fica a 10 cm dele",{type:"mirror",X0:200,f:-15,pS:90,pE:30,ym:13,yl:"|p'| (cm)",ye:"13",Y:function(p,pi){return Math.abs(pi)},
 rd:function(p,pi){return"p = "+f(p,0)+" cm  ·  p' = "+f(pi,1)+" cm"},caps:["O espelho convexo dá imagem virtual,|menor e direita, atrás do espelho.","O sinal negativo de p' indica imagem virtual:|1/p' = 1/f − 1/p.","1/p' = −1/15 − 1/30 = −3/30|p' = −10 cm."]});
imagem("calc_p049","Simulação: um objeto se aproxima de uma lente convergente de 20 cm de distância focal; a imagem real, invertida, se desloca e, com o objeto a 60 cm, forma-se a 30 cm da lente",{type:"lens",X0:140,f:20,pS:90,pE:60,ym:30,yl:"p' (cm)",ye:"30",Y:function(p,pi){return pi},
 rd:function(p,pi){return"p = "+f(p,0)+" cm  ·  p' = "+f(pi,1)+" cm"},caps:["O objeto se aproxima da lente convergente.|A imagem real, invertida, se afasta da lente.","Cada posição tem sua imagem:|1/f = 1/p + 1/p'.","1/p' = 1/20 − 1/60 = 2/60|p' = 30 cm (imagem real)."]});
imagem("calc_p050","Simulação: um objeto se aproxima de uma lente divergente de distância focal −20 cm; a imagem virtual, direita e menor, fica do mesmo lado do objeto e, com o objeto a 20 cm, forma-se a 10 cm da lente",{type:"lens",X0:200,f:-20,pS:60,pE:20,ym:15,yl:"|p'| (cm)",ye:"15",Y:function(p,pi){return Math.abs(pi)},
 rd:function(p,pi){return"p = "+f(p,0)+" cm  ·  p' = "+f(pi,1)+" cm"},caps:["A lente divergente sempre dá imagem virtual,|direita e menor, do lado do objeto.","O sinal negativo de p' indica imagem virtual:|1/p' = 1/f − 1/p.","1/p' = −1/20 − 1/20 = −2/20|p' = −10 cm."]});

/* ===== luz num meio: v = c / n ===== */
xy("calc_p029","Simulação: a luz anda mais devagar quanto maior o índice de refração do meio; no vidro de n = 1,5 sua velocidade cai de 3,0 para 2,0 × 10⁸ m/s",{ym:3,xl:"",x0t:"1",xe:"1,5",yl:"v (10⁸ m/s)",ye:"3",n:48,
 sc:'<rect x="30" y="14" width="260" height="30" fill="none" stroke="currentColor" stroke-opacity=".4"/><rect x="30" y="54" width="260" height="30" fill="'+ACC+'" fill-opacity=".25" stroke="currentColor" stroke-opacity=".6"/>'+t_(160,26,"vácuo (n = 1): 3,0 × 10⁸ m/s",{s:10})+t_(160,66,"vidro (n = 1,5): 2,0 × 10⁸ m/s",{s:10})+mvg("a",284,35,'<circle r="5" fill="'+NEG+'"/>')+mvg("b",224,75,'<circle r="5" fill="'+NEG+'"/>'),
 mv:[[".a",function(q){return[34+250*q,35]},12],[".b",function(q){return[34+190*q,75]},12]],cv:[cvP(function(q){return 3/(1+.5*q)})],
 rd:function(q){var n=1+.5*q;return"n = "+f(n)+"  ·  v = "+f(3/n)+" × 10⁸ m/s"},caps:["Duas luzes partem juntas: uma no vácuo,|outra no vidro. A do vidro fica para trás.","Quanto maior o índice de refração n,|menor a velocidade da luz no meio.","v = c / n = 3·10⁸ / 1,5|v = 2,0·10⁸ m/s."]});

/* ===== refração (lei de Snell) ===== */
function snell(key,alt,o){
 var Px=160,Py=56,L=46,t1f=o.t1,t2f=o.t2,n1=o.n1,n2=o.n2,sup=o.sup;
 function t2(t1){var s=n1*Math.sin(t1)/n2;return Math.asin(Math.min(1,s))}
 var inc=o.inv?'<g class="ri" style="transform-origin:'+Px+'px '+Py+'px"><line x1="'+Px+'" y1="'+Py+'" x2="'+r(Px-L*Math.sin(t1f))+'" y2="'+r(Py+L*Math.cos(t1f))+'" stroke="'+ACC+'" stroke-width="3"/></g><g class="rr" style="transform-origin:'+Px+'px '+Py+'px"><line x1="'+Px+'" y1="'+Py+'" x2="'+r(Px+L*Math.sin(t2f))+'" y2="'+r(Py-L*Math.cos(t2f))+'" stroke="'+NEG+'" stroke-width="3"/></g>'
  :'<g class="ri" style="transform-origin:'+Px+'px '+Py+'px"><line x1="'+Px+'" y1="'+Py+'" x2="'+r(Px-L*Math.sin(t1f))+'" y2="'+r(Py-L*Math.cos(t1f))+'" stroke="'+ACC+'" stroke-width="3"/></g><g class="rr" style="transform-origin:'+Px+'px '+Py+'px"><line x1="'+Px+'" y1="'+Py+'" x2="'+r(Px+L*Math.sin(t2f))+'" y2="'+r(Py+L*Math.cos(t2f))+'" stroke="'+NEG+'" stroke-width="3"/></g>';
 var med=o.inv?'<rect x="20" y="'+Py+'" width="280" height="44" fill="'+ACC+'" fill-opacity=".2"/>':'<rect x="20" y="'+Py+'" width="280" height="44" fill="'+ACC+'" fill-opacity=".2"/>';
 var svg=med+'<line x1="20" y1="'+Py+'" x2="300" y2="'+Py+'" stroke="currentColor" stroke-width="2"/><line x1="'+Px+'" y1="8" x2="'+Px+'" y2="100" stroke="currentColor" stroke-dasharray="4 3" stroke-opacity=".5"/>'+inc+t_(60,26,o.top,{s:11})+t_(60,84,o.bot,{s:11});
 var sgn=o.inv?-1:1;
 xy(key,alt,{ym:o.ym,xl:"",xe:o.xe,yl:o.yl,ye:o.ye,sc:svg,cv:[cvP(o.Y)],nr:4,
  tr:function(T,T0,D){var p1=[],p2=[],i,n=24;for(i=0;i<=n;i++){var q=i/n,a1=o.A1(q),a2=o.A2(q);p1.push([T0+D*i/n,sgn*(t1f-a1)*180/PI]);p2.push([T0+D*i/n,sgn*(t2f-a2)*180/PI])}
   return[N.rot(".ri",T,p1,"linear"),N.rot(".rr",T,p2,"linear")]},rd:o.rd,caps:o.caps})}
(function(){var t1=Math.asin(.5),t2=Math.asin(.5/1.5);
 snell("calc_p032","Simulação: um raio passa do ar para o vidro de n = 1,5 e se aproxima da normal; aumentando o ângulo de incidência, sen θ₂ cresce em reta com sen θ₁ e, para sen θ₁ = 0,5, vale 0,33",{n1:1,n2:1.5,t1:t1,t2:t2,ym:.34,xe:"0,5",yl:"sen θ₂",ye:"0,33",top:"ar (n = 1)",bot:"vidro (n = 1,5)",
  A1:function(q){return Math.asin(.5*q)},A2:function(q){return Math.asin(.5*q/1.5)},Y:function(q){return .5*q/1.5},rd:function(q){return"sen θ₁ = "+f(.5*q)+"  ·  sen θ₂ = "+f(.5*q/1.5)},
  caps:["O raio entra no vidro e se aproxima da normal.|Aumente o ângulo de incidência.","sen θ₂ cresce em reta com sen θ₁:|a razão é n₁ / n₂.","n₁ · sen θ₁ = n₂ · sen θ₂|sen θ₂ = 1 · 0,5 / 1,5 = 0,33."]})})();
(function(){var t1=Math.asin(.8),t2=Math.asin(.5);
 snell("calc_p033","Simulação: um raio passa do ar para um material desconhecido; para sen θ₁ = 0,8 o raio refratado tem sen θ₂ = 0,5, e a inclinação do gráfico de sen θ₁ contra sen θ₂ é o índice de refração, 1,6",{n1:1,n2:1.6,t1:t1,t2:t2,ym:.8,xe:"0,5",yl:"sen θ₁",ye:"0,8",top:"ar (n = 1)",bot:"material (n = ?)",
  A1:function(q){return Math.asin(.8*q)},A2:function(q){return Math.asin(.5*q)},Y:function(q){return .8*q},rd:function(q){return"sen θ₂ = "+f(.5*q)+"  ·  sen θ₁ = "+f(.8*q)},
  caps:["O raio se aproxima da normal no material.|Veja a relação entre os senos dos ângulos.","sen θ₁ / sen θ₂ é sempre o mesmo:|esse valor é o índice de refração n₂.","n₂ = n₁ · sen θ₁ / sen θ₂|n₂ = 1 · 0,8 / 0,5 = 1,6."]})})();
(function(){var t1=Math.asin(.5),t2=PI/2;
 snell("calc_p038","Simulação: um raio sai de um meio de n = 2 para o ar; aumentando o ângulo de incidência, o raio refratado se afasta da normal até ficar rasante (90°) quando sen θ₁ = 0,5, o ângulo limite de 30°",{inv:1,n1:2,n2:1,t1:t1,t2:t2,ym:1,xe:"30°",yl:"sen θ₂",ye:"1",top:"ar (n = 1)",bot:"meio (n = 2)",
  A1:function(q){return t1*q},A2:function(q){return Math.asin(Math.min(1,2*Math.sin(t1*q)))},Y:function(q){return Math.min(1,2*Math.sin(t1*q))},rd:function(q){return"θ₁ = "+f(30*q,0)+"°  ·  sen θ₂ = "+f(Math.min(1,2*Math.sin(t1*q)))},
  caps:["O raio vai do meio mais refringente para o ar|e se afasta da normal.","Aumentando θ₁, o raio refratado chega a 90°:|rente à superfície.","sen L = n₂ / n₁ = 1 / 2 = 0,5|o ângulo limite vale 30°."]})})();

/* ===== lentes: vergência ===== */
xy("calc_p048","Simulação: quanto menor a distância focal de uma lente convergente, maior a vergência, V = 1 / f; com f = 0,5 m a vergência vale 2 di",{ym:2,xl:"",x0t:"2 m",xe:"0,5 m",yl:"V (di)",ye:"2",n:60,
 sc:AXIS+'<path d="M110 16Q121 60 110 104Q99 60 110 16Z" fill="'+ACC+'" fill-opacity=".25" stroke="currentColor" stroke-width="2.4"/>'+
  '<g class="cv" style="transform-origin:110px 60px"><path d="M110 24L250 60M110 96L250 60M110 40L250 60M110 80L250 60" stroke="'+NEG+'" stroke-width="1.8" fill="none"/></g>'+'<path d="M20 24L110 24M20 40L110 40M20 80L110 80M20 96L110 96" stroke="'+NEG+'" stroke-width="1.8"/>'+'<circle cx="250" cy="60" r="3.5" fill="'+ACC+'"/>'+t_(250,76,"foco",{s:10})+t_(180,98,"f = 0,5 m",{s:10}),
 tr:function(T,T0,D){return[N.sc(".cv",T,[[T0,1.9,1],[T0+D,1,1]],"linear")]},cv:[cvP(function(q){return 1/(2-1.5*q)})],
 rd:function(q){var fv=2-1.5*q;return"f = "+f(fv)+" m  ·  V = "+f(1/fv)+" di"},caps:["Raios paralelos convergem para o foco.|Uma lente mais forte tem o foco mais perto.","Menor distância focal, maior vergência:|V é o inverso de f.","V = 1 / f = 1 / 0,5 = 2 di."]});
xy("calc_p051","Simulação: ao juntar uma lente de +2 di a outra de +3 di, as vergências se somam: a vergência do conjunto cresce de 3 para 5 di e a distância focal cai para 0,20 m",{ym:5,xl:"",x0t:"3",xe:"5 di",yl:"V do conjunto (di)",ye:"5",
 sc:AXIS+mvg("l1",120,60,'<path d="M0 -40Q10 0 0 40Q-10 0 0 -40Z" fill="'+ACC+'" fill-opacity=".3" stroke="currentColor" stroke-width="2.4"/>')+mvg("l2",120,60,'<path d="M0 -40Q10 0 0 40Q-10 0 0 -40Z" fill="'+NEG+'" fill-opacity=".3" stroke="currentColor" stroke-width="2.4"/>')+t_(230,34,"conjunto: +5 di",{s:12})+t_(230,50,"(lentes de +3 di e +2 di)",{s:10}),
 mv:[[".l2",function(q){return[120+90*(1-q),60]},12]],cv:[cvP(function(q){return 3+2*q})],
 rd:function(q){var v=3+2*q;return"V = "+f(v)+" di  ·  f = "+f(1/v)+" m"},caps:["Duas lentes finas são encostadas.|O conjunto fica mais convergente.","As vergências se somam: V = V₁ + V₂,|então o foco do conjunto fica mais curto.","V = 3 + 2 = 5 di|f = 1 / 5 = 0,20 m."]});
xy("calc_p054","Simulação: para corrigir a miopia, a lente divergente deve ter foco no ponto remoto; quanto mais perto o ponto remoto, mais forte a lente, e para 50 cm ela vale −2 di",{ym:4,xl:"",x0t:"0,25 m",xe:"0,5 m",yl:"|V| (di)",ye:"4",n:60,
 sc:'<circle cx="250" cy="56" r="30" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="250" cy="56" r="8" fill="currentColor" fill-opacity=".5"/><path d="M168 18Q176 56 168 94L180 94Q172 56 180 18Z" fill="'+ACC+'" fill-opacity=".3" stroke="currentColor" stroke-width="2"/>'+t_(174,106,"lente divergente",{s:10})+mvg("pr",90,56,'<circle r="6" fill="'+NEG+'"/>')+t_(90,40,"ponto remoto",{s:10})+'<line x1="96" y1="56" x2="160" y2="56" stroke="currentColor" stroke-dasharray="4 3" stroke-opacity=".6"/>',
 mv:[[".pr",function(q){return[90+60*(1-q),56]},12]],cv:[cvP(function(q){return 1/(.25+.25*q)})],
 gs:function(gx,gy){return t_(gx(1)-8,gy(2)-8,"0,5 m: −2 di",{s:10,a:"end"})},
 rd:function(q){var d=.25+.25*q;return"ponto remoto: "+f(d)+" m  ·  V = "+f(-1/d)+" di"},caps:["O míope só vê nítido até o ponto remoto.|A lente deve formar a imagem lá.","Quanto mais perto o ponto remoto,|mais forte (mais negativa) é a lente.","f = −0,5 m (divergente)|V = 1 / f = 1 / (−0,5) = −2 di."]});
})();
