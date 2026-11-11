/* Termologia: simulações do FENÔMENO (substituem as resoluções passo a passo). */
(function(){"use strict";
var F=window.FEN,N=F.N,t_=F.t_,ACC=F.ACC,NEG=F.NEG,xy=F.xy,cvP=F.cvP,f=F.f,GR=F.GR,mvg=F.mvg;
var ICE="#7dd3fc";

/* ---- termômetro: o líquido sobe enquanto o gráfico de conversão é desenhado ---- */
function termo(key,alt,o){
 var hh=62,top=18,svg='<rect x="154" y="10" width="12" height="72" rx="6" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="160" cy="88" r="8" fill="'+NEG+'" stroke="currentColor" stroke-width="2"/>'+
  '<rect class="lq" x="157" y="'+(80-hh)+'" width="6" height="'+hh+'" fill="'+NEG+'" style="transform-box:fill-box;transform-origin:50% 100%"/>'+
  t_(146,top+6,o.l1,{s:11,a:"end"})+t_(146,76,o.l0,{s:11,a:"end"})+t_(174,top+6,o.r1,{s:11,a:"start"})+t_(174,76,o.r0,{s:11,a:"start"});
 xy(key,alt,{ym:o.ym,xl:"",x0t:o.x0t,y0t:o.y0t,gs:o.gs,xe:o.xe,yl:o.yl,ye:o.ye,sc:svg,cv:[cvP(o.Y)],
  tr:function(T,T0,D){return[N.sc(".lq",T,[[T0,1,10/hh],[T0+D,1,1]],"linear")]},rd:o.rd,caps:o.caps})}
termo("calc_t011","Simulação: o líquido do termômetro sobe de 273 K a 300 K, e o gráfico mostra que a temperatura em °C é sempre a temperatura em K menos 273, chegando a 27 °C",{ym:27,x0t:"273",xe:"300 K",yl:"T (°C)",ye:"27",l0:"0 °C",l1:"27 °C",r0:"273 K",r1:"300 K",ls:"°C",rs:"K",Y:function(q){return 27*q},
 rd:function(q){return"T = "+f(273+27*q,0)+" K  =  "+f(27*q,0)+" °C"},caps:["A escala Kelvin começa no zero absoluto;|0 °C corresponde a 273 K.","Sobe 1 grau numa, sobe 1 na outra:|o gráfico é uma reta de inclinação 1.","TC = TK − 273 = 300 − 273 = 27 °C."]});
termo("calc_t061","Simulação: o líquido do termômetro sobe de 0 °C a 50 °C, e o gráfico mostra a temperatura em K sempre 273 acima da temperatura em °C, chegando a 323 K",{ym:323,x0t:"0",xe:"50 °C",yl:"T (K)",ye:"323",gs:function(gx,gy){return t_(gx(0)+6,gy(273)+14,"começa em 273 K",{s:10,a:"start"})},l0:"0 °C",l1:"50 °C",r0:"273 K",r1:"323 K",ls:"°C",rs:"K",Y:function(q){return 273+50*q},
 rd:function(q){return f(50*q,0)+" °C  =  "+f(273+50*q,0)+" K"},caps:["O gelo derrete a 0 °C, que é 273 K.|Daí em diante os graus têm o mesmo tamanho.","Cada °C a mais é um K a mais:|a reta começa em 273 K, inclinação 1.","TK = TC + 273 = 50 + 273 = 323 K."]});
function fa(key,alt,n){termo(key,alt,{ym:20,x0t:"32",xe:"68 °F",yl:"T (°C)",ye:"20",l0:"0 °C",l1:"20 °C",r0:"32 °F",r1:"68 °F",ls:"°C",rs:"°F",Y:function(q){return 20*q},
 rd:function(q){return f(32+36*q,0)+" °F  =  "+f(20*q,0)+" °C"},caps:["O gelo derrete a 32 °F (0 °C).|Subindo, o grau Fahrenheit é menor.","De 32 °F a 68 °F são 36 graus Fahrenheit,|que valem 20 °C (reta no gráfico).","TC / 5 = (TF − 32) / 9|TC / 5 = (68 − 32) / 9 = 4|logo TC = 20 °C."]})}
fa("calc_t012","Simulação: o líquido do termômetro sobe de 32 °F a 68 °F, e o gráfico mostra a conversão para Celsius em reta, chegando a 20 °C");
fa("calc_t062","Simulação: o líquido do termômetro sobe de 32 °F a 68 °F, e o gráfico mostra a conversão para Celsius em reta, chegando a 20 °C");

/* ---- dilatação linear: a barra cresce e o gráfico ΔL × ΔT é uma reta ---- */
function dil1(key,alt,o){
 var k=.3,W=110,x0=70,svg=GR+'<rect x="40" y="52" width="14" height="42" fill="currentColor" fill-opacity=".35"/>'+
  '<g class="br" style="transform-origin:'+(x0)+'px 70px"><rect x="'+x0+'" y="62" width="'+(W*(1+k))+'" height="18" fill="'+ACC+'" fill-opacity=".5" stroke="currentColor" stroke-width="2"/></g>'+
  '<path d="M'+(x0+W)+' 56L'+(x0+W)+' 90" stroke="currentColor" stroke-dasharray="3 3" stroke-opacity=".6"/>'+t_(250,34,o.lab,{s:12})+t_(250,50,"α = 1,2 × 10⁻⁵ °C⁻¹",{s:11})+t_(250,18,"(dilatação ampliada)",{s:10});
 xy(key,alt,{ym:o.dl,xl:"",xe:o.xe,yl:"ΔL (mm)",ye:o.ye,sc:svg,cv:[cvP(function(q){return o.dl*q})],tr:function(T,T0,D){return[N.sc(".br",T,[[T0,1/(1+k),1],[T0+D,1,1]],"linear")]},
  rd:function(q){return"ΔT = "+f(o.dT*q,0)+" °C  ·  ΔL = "+f(o.dl*q)+" mm"},caps:o.caps})}
dil1("calc_t023","Simulação: uma barra de 2 m aquecida em 50 °C se alonga; o gráfico do aumento de comprimento é uma reta e chega a 1,2 mm",{dl:1.2,dT:50,xe:"50 °C",ye:"1,2",lab:"barra de 2 m",caps:["A barra de 2 m é aquecida e se alonga|(aqui o aumento está bem ampliado).","O aumento é proporcional ao aquecimento:|o gráfico de ΔL × ΔT é uma reta.","ΔL = L₀ · α · ΔT|ΔL = 2 · 1,2·10⁻⁵ · 50|ΔL = 1,2·10⁻³ m = 1,2 mm."]});
dil1("calc_t066","Simulação: uma barra de 2,0 m aquecida de 20 °C a 120 °C se alonga; o gráfico do aumento de comprimento é uma reta e chega a 2,4 mm",{dl:2.4,dT:100,xe:"100 °C",ye:"2,4",lab:"barra de 2,0 m",caps:["A barra de 2,0 m vai de 20 °C a 120 °C|e se alonga (aumento ampliado).","O aumento é proporcional ao aquecimento:|o gráfico de ΔL × ΔT é uma reta.","ΔL = L₀ · α · ΔT|ΔL = 2,0 · 1,2·10⁻⁵ · 100 = 2,4 mm."]});

/* ---- dilatação superficial ---- */
xy("calc_t024","Simulação: uma placa de 1 m² aquecida de 20 °C a 120 °C se expande nas duas direções; o gráfico do aumento de área é uma reta e chega a 2,4 × 10⁻³ m²",{ym:2.4,xl:"",xe:"100 °C",yl:"ΔA (10⁻³ m²)",ye:"2,4",
 sc:GR+'<g class="pl" style="transform-origin:130px 90px"><rect x="130" y="30" width="70" height="60" fill="'+ACC+'" fill-opacity=".5" stroke="currentColor" stroke-width="2"/></g><rect x="130" y="40" width="58" height="50" fill="none" stroke="currentColor" stroke-dasharray="3 3" stroke-opacity=".6"/>'+t_(250,34,"placa de 1 m²",{s:12})+t_(250,50,"(dilatação ampliada)",{s:10}),
 cv:[cvP(function(q){return 2.4*q})],tr:function(T,T0,D){return[N.sc(".pl",T,[[T0,.83,.83],[T0+D,1,1]],"linear")]},
 rd:function(q){return"ΔT = "+f(100*q,0)+" °C  ·  ΔA = "+f(2.4*q)+" × 10⁻³ m²"},caps:["A placa aquece e cresce em largura e altura|(ampliado; o tracejado é a placa fria).","O aumento de área também é proporcional|ao aquecimento: reta no gráfico.","ΔA = A₀ · β · ΔT|ΔA = 1 · 2,4·10⁻⁵ · 100|ΔA = 2,4·10⁻³ m²."]});

/* ---- dilatação volumétrica ---- */
xy("calc_t111","Simulação: 500 cm³ de líquido aquecidos de 20 °C a 60 °C se expandem e o nível sobe no tubo; o gráfico mostra o aumento de volume crescendo em reta até 20 cm³ (o volume chega a 520 cm³)",{ym:20,xl:"",xe:"40 °C",yl:"ΔV (cm³)",ye:"20",
 sc:'<path d="M140 8L140 40Q112 52 112 76Q112 92 150 92Q188 92 188 76Q188 52 160 40L160 8" fill="none" stroke="currentColor" stroke-width="2.2"/><g class="lq" style="transform-box:fill-box;transform-origin:50% 100%"><path d="M140 22L140 40Q112 52 112 76Q112 92 150 92Q188 92 188 76Q188 52 160 40L160 22Z" fill="'+ACC+'" fill-opacity=".5"/></g>'+t_(250,40,"500 cm³ a 20 °C",{s:11})+t_(250,56,"γ = 1,0 × 10⁻³ °C⁻¹",{s:11}),
 cv:[cvP(function(q){return 20*q})],tr:function(T,T0,D){return[N.sc(".lq",T,[[T0,1,.82],[T0+D,1,1]],"linear")]},
 rd:function(q){return"T = "+f(20+40*q,0)+" °C  ·  V = "+f(500+20*q,0)+" cm³"},caps:["O líquido é aquecido e se expande:|o nível sobe no tubo.","O aumento de volume é proporcional|ao aquecimento: o gráfico é uma reta.","ΔV = V₀ · γ · ΔT|ΔV = 500 · 1,0·10⁻³ · 40|ΔV = 20 cm³."]});

/* ---- aquecimento sensível: Q = m·c·ΔT ---- */
function becher(lab1,lab2,fill,ov){return'<path d="M110 22L110 74Q110 80 116 80L204 80Q210 80 210 74L210 22" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="111" y="38" width="98" height="41" fill="'+fill+'" fill-opacity=".35"/><rect class="hot" x="111" y="38" width="98" height="41" fill="'+NEG+'" fill-opacity=".5"/>'+
 '<path d="M150 98C142 90 148 86 150 80C154 86 158 90 150 98ZM166 98C160 92 164 88 166 82C170 88 172 92 166 98Z" fill="'+NEG+'" fill-opacity=".8"/>'+t_(160,62,lab1,{s:12})+t_(160,15,lab2,{s:11})}
function aquec(key,alt,o){
 xy(key,alt,{y0t:o.y0t,ym:o.ym,xl:"",xe:o.xe,yl:o.yl,ye:o.ye,sc:becher(o.l1,o.l2,o.fill||ACC),cv:[cvP(o.Y)],
  tr:function(T,T0,D){return[N.op(".hot",T,[[T0,0],[T0+D,.5]],"linear")]},rd:o.rd,caps:o.caps})}
aquec("calc_t034","Simulação: 200 g de água recebem calor e a temperatura sobe em reta de 20 °C a 50 °C, o que exige 6000 cal",{y0t:"20 °C",ym:50,xe:"6000 cal",yl:"T (°C)",ye:"50",l1:"200 g de água",l2:"c = 1 cal/g·°C",Y:function(q){return 20+30*q},rd:function(q){return"Q = "+f(6000*q,0)+" cal  ·  T = "+f(20+30*q,0)+" °C"},caps:["A água recebe calor da chama|e sua temperatura vai subindo.","A temperatura sobe em reta com o calor:|cada caloria faz subir o mesmo tanto.","Q = m · c · ΔT|Q = 200 · 1 · (50 − 20) = 6000 cal."]});
aquec("calc_t071","Simulação: 200 g de água recebem calor e a temperatura sobe em reta de 20 °C a 50 °C, o que exige 6000 cal",{y0t:"20 °C",ym:50,xe:"6000 cal",yl:"T (°C)",ye:"50",l1:"200 g de água",l2:"c = 1 cal/g·°C",Y:function(q){return 20+30*q},rd:function(q){return"Q = "+f(6000*q,0)+" cal  ·  T = "+f(20+30*q,0)+" °C"},caps:["A água recebe calor da chama|e sua temperatura vai subindo.","A temperatura sobe em reta com o calor:|cada caloria faz subir o mesmo tanto.","Q = m · c · ΔT|Q = 200 · 1 · (50 − 20) = 6000 cal."]});
aquec("calc_t106","Simulação: 250 g de água numa panela recebem calor e a temperatura sobe em reta de 20 °C a 80 °C, o que exige 15 000 cal",{y0t:"20 °C",ym:80,xe:"15 000 cal",yl:"T (°C)",ye:"80",l1:"250 g de água",l2:"c = 1 cal/g·°C",Y:function(q){return 20+60*q},rd:function(q){return"Q = "+f(15000*q,0)+" cal  ·  T = "+f(20+60*q,0)+" °C"},caps:["A água da panela recebe calor|e a temperatura vai de 20 °C a 80 °C.","A temperatura sobe em reta com o calor recebido.","ΔT = 80 − 20 = 60 °C|Q = 250 · 1 · 60 = 15 000 cal (15 kcal)."]});
aquec("calc_t107","Simulação: um bloco de ferro de 400 g recebe calor e a temperatura sobe em reta de 20 °C a 120 °C, o que exige 4400 cal",{y0t:"20 °C",ym:120,xe:"4400 cal",yl:"T (°C)",ye:"120",l1:"ferro, 400 g",l2:"c = 0,11 cal/g·°C",fill:"#9ca3af",Y:function(q){return 20+100*q},rd:function(q){return"Q = "+f(4400*q,0)+" cal  ·  T = "+f(20+100*q,0)+" °C"},caps:["O bloco de ferro recebe calor|e vai de 20 °C a 120 °C.","O ferro esquenta com pouco calor:|c é pequeno, então a reta sobe depressa.","ΔT = 120 − 20 = 100 °C|Q = 400 · 0,11 · 100 = 4400 cal."]});
aquec("calc_t035","Simulação: um corpo de capacidade térmica 50 cal/°C recebe 1000 cal e sua temperatura sobe em reta 20 °C",{ym:20,xe:"1000 cal",yl:"ΔT (°C)",ye:"20",l1:"C = 50 cal/°C",l2:"capacidade térmica",Y:function(q){return 20*q},rd:function(q){return"Q = "+f(1000*q,0)+" cal  ·  ΔT = "+f(20*q,0)+" °C"},caps:["O corpo recebe calor; a capacidade térmica|diz quanto calor cada °C exige: 50 cal.","A cada 50 cal recebidas,|a temperatura sobe 1 °C (reta).","ΔT = Q / C = 1000 / 50 = 20 °C."]});
function cap(key,alt,C,dT,l1,l2,caps){xy(key,alt,{ym:C*dT,xl:"",xe:f(dT,0)+" °C",yl:"Q (cal)",ye:f(C*dT,0),sc:becher(l1,l2,ACC),cv:[cvP(function(q){return C*dT*q})],tr:function(T,T0,D){return[N.op(".hot",T,[[T0,0],[T0+D,.5]],"linear")]},
 rd:function(q){return"ΔT = "+f(dT*q,0)+" °C  ·  Q = "+f(C*dT*q,0)+" cal"},caps:caps})}
cap("calc_t072","Simulação: um corpo de 500 g com calor específico 0,2 cal/g·°C precisa de mais calor a cada grau; a inclinação do gráfico Q × ΔT é a capacidade térmica, 100 cal/°C",100,10,"500 g","c = 0,2 cal/g·°C",["Para aquecer o corpo, cada grau exige|uma quantidade fixa de calor.","O gráfico de Q × ΔT é uma reta:|a inclinação é a capacidade térmica C.","C = m · c = 500 · 0,2 = 100 cal/°C."]);
cap("calc_t108","Simulação: um objeto de cobre de 200 g com calor específico 0,09 cal/g·°C precisa de calor a cada grau; a inclinação do gráfico Q × ΔT é a capacidade térmica, 18 cal/°C",18,10,"cobre, 200 g","c = 0,09 cal/g·°C",["Para aquecer o objeto de cobre, cada grau|exige uma quantidade fixa de calor.","O gráfico de Q × ΔT é uma reta:|a inclinação é a capacidade térmica C.","C = m · c = 200 · 0,09 = 18 cal/°C."]);

/* ---- fusão: o gelo derrete a 0 °C e o gráfico mostra massa fundida × calor ---- */
function fusao(key,alt,m,Q,caps){
 xy(key,alt,{ym:m,xl:"",xe:f(Q,0)+" cal",yl:"massa fundida (g)",ye:f(m,0),
 sc:GR+'<g class="pd" style="transform-origin:160px 92px"><ellipse cx="160" cy="90" rx="62" ry="6" fill="'+ACC+'" fill-opacity=".45"/></g><g class="ic" style="transform-origin:160px 88px"><rect x="150" y="80" width="20" height="8" rx="2" fill="'+ICE+'" fill-opacity=".8" stroke="currentColor" stroke-width="1.6"/></g>'+t_(160,18,"gelo a 0 °C  ·  L = 80 cal/g",{s:12})+t_(160,34,"a temperatura não muda",{s:11}),
 cv:[cvP(function(q){return m*q})],tr:function(T,T0,D){return[N.sc(".ic",T,[[T0,4.2,4.2],[T0+D,1,1]],"linear"),N.sc(".pd",T,[[T0,.1,.1],[T0+D,1,1]],"linear")]},
 rd:function(q){return"Q = "+f(Q*q,0)+" cal  ·  derretidos: "+f(m*q,0)+" g"},caps:caps})}
fusao("calc_t047","Simulação: 50 g de gelo a 0 °C derretem aos poucos enquanto recebem calor; a massa fundida cresce em reta e todo o gelo derrete com 4000 cal",50,4000,["O gelo recebe calor, mas a temperatura|fica em 0 °C: o calor derrete o gelo.","Quanto mais calor, mais gelo derrete:|a massa fundida cresce em reta.","Q = m · L = 50 · 80 = 4000 cal."]);
fusao("calc_t076","Simulação: 100 g de gelo a 0 °C derretem aos poucos enquanto recebem calor; a massa fundida cresce em reta e todo o gelo derrete com 8000 cal",100,8000,["O gelo recebe calor, mas a temperatura|fica em 0 °C: o calor derrete o gelo.","Quanto mais calor, mais gelo derrete:|a massa fundida cresce em reta.","Q = m · L = 100 · 80 = 8000 cal,|sem mudar a temperatura."]);
fusao("calc_t109","Simulação: 300 g de gelo a 0 °C derretem aos poucos enquanto recebem calor; a massa fundida cresce em reta e todo o gelo derrete com 24 000 cal",300,24000,["O gelo recebe calor, mas a temperatura|fica em 0 °C: o calor derrete o gelo.","Quanto mais calor, mais gelo derrete:|a massa fundida cresce em reta.","Na fusão a temperatura não muda:|Q = m · L = 300 · 80 = 24 000 cal (24 kcal)."]);

/* ---- vaporização: a água a 100 °C vira vapor ---- */
function vapor(key,alt,m,Q,caps){
 xy(key,alt,{ym:m,xl:"",xe:f(Q,0)+" cal",yl:"massa vaporizada (g)",ye:f(m,0),
 sc:'<path d="M110 30L110 76Q110 82 116 82L204 82Q210 82 210 76L210 30" fill="none" stroke="currentColor" stroke-width="2.4"/><g class="wt" style="transform-origin:160px 81px"><rect x="111" y="78" width="98" height="3" fill="'+ACC+'" fill-opacity=".45"/></g>'+
  '<g class="vp"><path d="M130 26C126 18 134 14 130 6M160 26C156 18 164 14 160 6M190 26C186 18 194 14 190 6" fill="none" stroke="currentColor" stroke-width="2" stroke-opacity=".6"/></g>'+
  '<path d="M150 98C142 90 148 86 150 82C154 86 158 90 150 98ZM166 98C160 92 164 88 166 84C170 88 172 92 166 98Z" fill="'+NEG+'" fill-opacity=".8"/>'+t_(250,36,"água a 100 °C",{s:11})+t_(250,52,"L = 540 cal/g",{s:11}),
 cv:[cvP(function(q){return m*q})],tr:function(T,T0,D){return[N.sc(".wt",T,[[T0,1,13],[T0+D,1,1]],"linear"),N.op(".vp",T,[[T0,0],[T0+D*.2,0],[T0+D,1]],"linear")]},
 rd:function(q){return"Q = "+f(Q*q,0)+" cal  ·  vaporizados: "+f(m*q,0)+" g"},caps:caps})}
vapor("calc_t048","Simulação: 10 g de água a 100 °C viram vapor aos poucos enquanto recebem calor; a massa vaporizada cresce em reta e toda a água vira vapor com 5400 cal",10,5400,["A água já está a 100 °C e recebe calor.|A temperatura fica fixa: a água vira vapor.","Quanto mais calor, mais água vaporiza:|a massa vaporizada cresce em reta.","Q = m · L = 10 · 540 = 5400 cal."]);
vapor("calc_t080","Simulação: 10 g de água a 100 °C viram vapor aos poucos enquanto recebem calor; a massa vaporizada cresce em reta e toda a água vira vapor com 5400 cal",10,5400,["A água já está a 100 °C e recebe calor.|A temperatura fica fixa: a água vira vapor.","Quanto mais calor, mais água vaporiza:|a massa vaporizada cresce em reta.","Q = m · L = 10 · 540 = 5400 cal."]);
vapor("calc_t110","Simulação: 50 g de água a 100 °C viram vapor aos poucos enquanto recebem calor; a massa vaporizada cresce em reta e toda a água vira vapor com 27 000 cal",50,27000,["A água já está a 100 °C (ebulição):|só há mudança de estado.","Quanto mais calor, mais água vaporiza:|a massa vaporizada cresce em reta.","Q = m · L = 50 · 540 = 27 000 cal."]);
})();
