/* Ondulatória: simulações do FENÔMENO (substituem as resoluções passo a passo). */
(function(){"use strict";
var F=window.FEN,N=F.N,t_=F.t_,ACC=F.ACC,NEG=F.NEG,xy=F.xy,cvP=F.cvP,f=F.f,r=F.r,GR=F.GR,mvg=F.mvg,mk=F.mk,PI=Math.PI;
var SUP={"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻"};
function sup(n){return String(n).split("").map(function(c){return SUP[c]}).join("")}
function path(fn,x0,x1,n){var d="",i,x;for(i=0;i<=n;i++){x=x0+(x1-x0)*i/n;d+=(i?"L":"M")+r(x)+" "+r(fn(x))+" "}return d}
function osc(cls,T,T0,D,cyc,fn){var p=[],n=cyc*12,i;for(i=0;i<=n;i++)p.push([T0+D*i/n].concat(fn(Math.cos(2*PI*cyc*(1-i/n)))));return N.sc("."+cls,T,p,"linear")}

/* onda que se propaga (v = λ·f) */
function viaja(lam,lab){
 return'<g class="wv"><path d="'+path(function(x){return 52-18*Math.sin(2*PI*x/lam)},-lam,320+lam,90)+'" fill="none" stroke="'+ACC+'" stroke-width="2.6"/></g>'+
  '<line x1="40" y1="76" x2="'+(40+lam)+'" y2="76" stroke="currentColor"/><line x1="40" y1="72" x2="40" y2="80" stroke="currentColor"/><line x1="'+(40+lam)+'" y1="72" x2="'+(40+lam)+'" y2="80" stroke="currentColor"/>'+t_(40+lam/2,90,lab,{s:11})}
function trViaja(lam){return function(T,T0,D){return[N.tr(".wv",T,[[T0,-lam,0],[T0+D,0,0]],"linear")]}}
xy("calc_o005","Simulação: uma onda sonora de 680 Hz com comprimento de onda de 0,5 m se propaga; o gráfico da velocidade em função da frequência é uma reta de inclinação λ e chega a 340 m/s",{ym:340,xl:"",xe:"680 Hz",yl:"v (m/s)",ye:"340",sc:viaja(60,"λ = 0,5 m"),tr:trViaja(60),cv:[cvP(function(q){return 340*q})],
 rd:function(q){return"f = "+f(680*q,0)+" Hz  ·  v = "+f(340*q,0)+" m/s"},caps:["A onda tem comprimento de onda 0,5 m.|Mais cristas por segundo, mais rápida.","A velocidade cresce em reta com a frequência:|a inclinação é o comprimento de onda.","v = λ · f = 0,5 · 680 = 340 m/s."]});
(function(){var L=function(q){return 1500/(250+750*q)};
 xy("calc_o012","Simulação: um som viaja na água a 1500 m/s; quanto maior a frequência, menor o comprimento de onda, e para 500 Hz o comprimento de onda vale 3 m",{ym:6,xl:"",x0t:"250",xe:"1000 Hz",yl:"λ (m)",ye:"6",n:60,sc:viaja(70,"λ = 3 m (a 500 Hz)"),tr:trViaja(70),cv:[cvP(L)],
 gs:function(gx,gy){var x=gx(1/3),y=gy(3);return'<circle cx="'+x+'" cy="'+y+'" r="8" fill="none" stroke="'+NEG+'" stroke-width="2"/>'+t_(x+10,y-8,"500 Hz: 3 m",{s:10,a:"start"})},
 rd:function(q){return"f = "+f(250+750*q,0)+" Hz  ·  λ = "+f(L(q))+" m"},caps:["Na água o som viaja a 1500 m/s.|Aumentando a frequência, o λ diminui.","A velocidade é a mesma:|dobrando f, o λ cai pela metade.","λ = v / f = 1500 / 500 = 3 m."]})})();

/* período */
xy("calc_o006","Simulação: uma fonte vibrando 250 vezes por segundo repete o movimento a cada 4 ms; o gráfico da posição mostra duas oscilações completas em 8 ms",{ym:2.4,xl:"",xe:"8 ms",yl:"",ye:"",n:96,
 sc:mvg("m0",160,52,'<circle r="9" fill="'+ACC+'" stroke="currentColor" stroke-width="2"/>')+'<line x1="160" y1="22" x2="160" y2="82" stroke="currentColor" stroke-opacity=".4" stroke-dasharray="3 3"/>'+t_(230,52,"250 Hz",{s:13}),
 mv:[[".m0",function(q){return[160,52-26*Math.sin(2*PI*2*q)]},96]],cv:[cvP(function(q){return 1+Math.sin(2*PI*2*q)})],
 gs:function(gx,gy){return'<line x1="'+gx(0)+'" y1="'+gy(1)+'" x2="'+gx(1)+'" y2="'+gy(1)+'" stroke="currentColor" stroke-dasharray="4 3" stroke-opacity=".6"/><line x1="'+gx(0)+'" y1="'+(gy(2.3))+'" x2="'+gx(.5)+'" y2="'+(gy(2.3))+'" stroke="currentColor"/>'+t_(gx(.25),gy(2.3)-5,"T = 4 ms",{s:11})},
 rd:function(q){return"t = "+f(8*q)+" ms  ·  "+f(2*q,1)+" oscilações"},caps:["A fonte vibra 250 vezes por segundo.|Veja o gráfico da posição ao longo do tempo.","Uma oscilação completa leva sempre o mesmo|tempo: esse é o período T.","T = 1 / f = 1 / 250|T = 0,004 s = 4 ms."]});

/* tempo até ouvir (trovão) e ecos */
xy("calc_o011","Simulação: o som do trovão percorre 1700 m a 340 m/s, e o gráfico da distância percorrida cresce em reta até 1700 m em 5 s, o tempo entre o clarão e o trovão",{ym:1700,xl:"",xe:"5 s",yl:"distância (m)",ye:"1700",
 sc:GR+t_(40,44,"⚡",{s:26})+t_(40,62,"clarão",{s:11})+t_(280,38,"ouvinte",{s:11})+mvg("m0",270,86,'<circle r="6" fill="'+NEG+'"/>')+'<circle cx="270" cy="52" r="7" fill="'+ACC+'"/><path d="M270 59L270 80" stroke="currentColor" stroke-width="3"/>',
 mv:[[".m0",function(q){return[50+220*q,86]},20]],cv:[cvP(function(q){return 1700*q})],rd:function(q){return"t = "+f(5*q)+" s  ·  som a "+f(1700*q,0)+" m"},
 caps:["A luz do clarão chega na hora;|o som viaja a 340 m/s.","A distância do som cresce em reta:|o trovão demora a chegar.","t = d / v = 1700 / 340 = 5 s."]});
function eco(key,alt,o){
 var P=function(q){return q<.5?50+220*2*q:270-220*(2*q-1)};
 xy(key,alt,{ym:o.d2,xl:"",xe:o.t,yl:"distância percorrida (m)",ye:f(o.d2,0),
 sc:GR+'<circle cx="38" cy="52" r="7" fill="'+ACC+'"/><path d="M38 59L38 80" stroke="currentColor" stroke-width="3"/><rect x="278" y="16" width="10" height="78" fill="currentColor" fill-opacity=".35" stroke="currentColor" stroke-width="2"/>'+t_(160,26,"d = ?",{s:13})+'<line x1="40" y1="34" x2="276" y2="34" stroke="currentColor" stroke-dasharray="4 3" stroke-opacity=".6"/>'+t_(38,36,o.l1,{s:10,a:"middle"})+mvg("m0",P(1),86,'<circle r="6" fill="'+NEG+'"/>'),
 mv:[[".m0",function(q){return[P(q),86]},40]],cv:[cvP(function(q){return o.d2*q})],rd:function(q){return"t = "+f(o.tt*q)+" s  ·  som percorreu "+f(o.d2*q,0)+" m"},caps:o.caps})}
eco("calc_o029","Simulação: o som vai até um obstáculo e volta; para o eco ser percebido, o som precisa de 0,1 s e percorre 34 m (ida e volta), então o obstáculo está a 17 m",{d2:34,t:"0,1 s",tt:.1,l1:"voz",caps:["O som vai até o obstáculo e volta.|O eco só é distinguido após 0,1 s.","Nesse tempo o som percorre ida e volta:|340 · 0,1 = 34 m.","A distância é metade do percurso:|d = 34 / 2 = 17 m."]});
eco("calc_o030","Simulação: um pulso de sonar vai até o fundo do mar e volta em 0,8 s; a 1500 m/s ele percorre 1200 m, então o fundo está a 600 m",{d2:1200,t:"0,8 s",tt:.8,l1:"sonar",caps:["O sonar emite um pulso que vai ao fundo|e volta, formando o eco.","Em 0,8 s o som percorre ida e volta:|1500 · 0,8 = 1200 m.","A profundidade é metade do percurso:|d = 1200 / 2 = 600 m."]});
eco("calc_o031","Simulação: o grito vai até a montanha e volta em 4 s; a 340 m/s o som percorre 1360 m, então a montanha está a 680 m",{d2:1360,t:"4 s",tt:4,l1:"garoto",caps:["O grito vai até a montanha e volta.|O eco chega 4 s depois.","Nesses 4 s o som percorre ida e volta:|340 · 4 = 1360 m.","A montanha está na metade do percurso:|d = 1360 / 2 = 680 m."]});

/* nível sonoro */
function medidor(fin){return'<rect x="150" y="10" width="20" height="82" fill="none" stroke="currentColor" stroke-width="2"/><rect class="mt" x="151" y="'+(92-82*fin/120)+'" width="18" height="'+(82*fin/120)+'" fill="'+NEG+'" fill-opacity=".7" style="transform-box:fill-box;transform-origin:50% 100%"/>'+t_(184,16,"120 dB",{s:10,a:"start"})+t_(184,90,"0 dB",{s:10,a:"start"})}
xy("calc_o023","Simulação: quando a intensidade sobe de 10⁻¹² a 10⁻⁵ W/m², o nível sonoro cresce em reta (escala logarítmica) até 70 dB",{ym:70,xl:"",x0t:"10⁻¹²",xe:"10⁻⁵ W/m²",yl:"β (dB)",ye:"70",nr:7,sc:medidor(70),cv:[cvP(function(q){return 70*q})],
 tr:function(T,T0,D){return[N.sc(".mt",T,[[T0,1,.02],[T0+D,1,1]],"linear")]},end:function(gx,gy){return t_(gx(1)-10,gy(70)+24,"70 dB",{s:12,a:"end"})},
 rd:function(q){var e=Math.round(-12+7*q);return"I = 10"+sup(e)+" W/m²  ·  β = "+f(70*q,0)+" dB"},caps:["A intensidade aumenta de 10⁻¹² para 10⁻⁵ W/m².|O medidor de nível sonoro sobe.","Cada vez que a intensidade fica 10 vezes maior,|o nível aumenta 10 dB.","β = 10 · log(I / I₀)|β = 10 · log(10⁷) = 70 dB."]});
xy("calc_o024","Simulação: o nível sonoro de 60 dB corresponde a seis fatores de 10 acima da intensidade de referência; a intensidade chega a 10⁻⁶ W/m²",{ym:60,xl:"",x0t:"10⁻¹²",xe:"10⁻⁶ W/m²",yl:"β (dB)",ye:"60",nr:6,sc:medidor(60),cv:[cvP(function(q){return 60*q})],
 tr:function(T,T0,D){return[N.sc(".mt",T,[[T0,1,.02],[T0+D,1,1]],"linear")]},end:function(gx,gy){return t_(gx(1)-10,gy(60)+24,"60 dB",{s:12,a:"end"})},
 rd:function(q){var e=Math.round(-12+6*q);return"I = 10"+sup(e)+" W/m²  ·  β = "+f(60*q,0)+" dB"},caps:["O nível sobe até 60 dB.|Veja que intensidade isso representa.","Cada 10 dB é um fator 10 na intensidade:|60 dB são 6 fatores de 10 acima de I₀.","60 = 10 · log(I / 10⁻¹²)|I = 10⁻¹² · 10⁶ = 10⁻⁶ W/m²."]});
(function(){var I=function(q){return 10/(12*Math.pow(1+3*q,2))},px=function(q){return 12*(1+3*q)};
 xy("calc_o025","Simulação: uma fonte de 10 W espalha o som em esferas cada vez maiores; a intensidade cai com o quadrado da distância e vale 0,208 W/m² a 2 m (π ≈ 3)",{ym:.83,xl:"",x0t:"1 m",xe:"4 m",yl:"I (W/m²)",ye:"0,83",n:60,
 sc:'<circle cx="60" cy="52" r="5" fill="'+NEG+'"/><g class="rg" style="transform-origin:60px 52px"><circle cx="60" cy="52" r="'+px(1)+'" fill="none" stroke="'+ACC+'" stroke-width="2.4"/></g><circle cx="60" cy="52" r="'+px(1/3)+'" fill="none" stroke="currentColor" stroke-dasharray="3 3" stroke-opacity=".6"/>'+t_(250,34,"P = 10 W",{s:12})+t_(250,50,"tracejado: r = 2 m",{s:10}),
 tr:function(T,T0,D){return[N.sc(".rg",T,[[T0,px(0)/px(1),px(0)/px(1)],[T0+D,1,1]],"linear")]},cv:[cvP(I)],
 gs:function(gx,gy){var x=gx(1/3),y=gy(I(1/3));return'<circle cx="'+x+'" cy="'+y+'" r="8" fill="none" stroke="'+NEG+'" stroke-width="2"/>'+t_(x+10,y-8,"2 m: 0,208 W/m²",{s:10,a:"start"})},
 rd:function(q){return"r = "+f(1+3*q)+" m  ·  I = "+f(I(q),3)+" W/m²"},caps:["O som se espalha em esferas cada vez maiores,|e a mesma potência cobre mais área.","A intensidade cai com o quadrado da distância:|dobrando r, I fica 4 vezes menor.","I = P / (4 · π · r²)|I = 10 / (4 · 3 · 4) = 0,208 W/m²."]})})();

/* batimentos: soma de duas ondas de frequências próximas (desenhadas em escala menor) */
function bat(key,alt,o){
 var s1=function(q){return Math.sin(2*PI*o.a*q)+Math.sin(2*PI*o.b*q)},env=function(q){return Math.abs(Math.cos(PI*(o.b-o.a)*q))};
 var pts=[],i,n=96;for(i=0;i<=n;i++){var e=env(i/n)+.05;pts.push([1.4+4*i/n,e,e])}
 xy(key,alt,{ym:2,xl:"",xe:"1 s",yl:"",ye:"",n:360,
 sc:'<circle class="pu" cx="160" cy="52" r="34" fill="'+ACC+'" fill-opacity=".45" stroke="currentColor" stroke-width="2"/>'+t_(60,40,o.fa+" Hz",{s:12})+t_(60,58,o.fb+" Hz",{s:12})+t_(262,52,"som que se ouve",{s:11}),
 tr:function(T,T0,D){var p=[];for(i=0;i<=n;i++){var e=env(i/n)+.05;p.push([T0+D*i/n,e,e])}return[N.sc(".pu",T,p,"linear")]},
 cv:[cvP(function(q){return 1+.5*s1(q)})],
 gs:function(gx,gy){return'<line x1="'+gx(0)+'" y1="'+gy(1)+'" x2="'+gx(1)+'" y2="'+gy(1)+'" stroke="currentColor" stroke-dasharray="4 3" stroke-opacity=".5"/>'+t_(gx(.5),gy(2)-6,"(frequências desenhadas em escala menor)",{s:9})},
 rd:function(q){return"t = "+f(q)+" s  ·  batimentos até agora: "+f(Math.floor(4*q+1e-9),0)},caps:o.caps})}
bat("calc_o037","Simulação: dois diapasões de 440 Hz e 444 Hz soam juntos; o som fica forte e fraco 4 vezes por segundo, e essa é a frequência de batimento",{a:42,b:46,fa:440,fb:444,caps:["Dois diapasões de 440 Hz e 444 Hz soam juntos.|O gráfico mostra a soma das duas ondas.","O som fica forte e fraco, forte e fraco...|Cada ciclo forte-fraco é um batimento.","Em 1 s ocorrem 4 batimentos:|f = 444 − 440 = 4 Hz."]});
bat("calc_o038","Simulação: dois sons de 512 Hz e 516 Hz soam juntos; o ouvinte percebe um som de 514 Hz, a média, que fica forte e fraco 4 vezes por segundo",{a:62,b:66,fa:512,fb:516,caps:["Dois sons, de 512 Hz e 516 Hz, soam juntos.|O gráfico mostra a soma das duas ondas.","O ouvido percebe um som intermediário,|que fica forte e fraco 4 vezes por segundo.","Frequência percebida = média:|f = (512 + 516) / 2 = 514 Hz."]});

/* efeito Doppler: frentes de onda emitidas por uma fonte em movimento */
function doppler(key,alt,o){
 var dir=o.dir,x0=o.x0,st=7*dir,H=262,T0=1.4,D=4,T=T0+D+3.4,svg='',tr=[],k;
 var xc=x0+5*st;
 for(k=0;k<5;k++){var cx=x0+k*st;svg+='<circle class="cr'+k+'" cx="'+cx+'" cy="52" r="'+(14*(5-k))+'" fill="none" stroke="'+ACC+'" stroke-width="2" style="transform-origin:'+cx+'px 52px"/>';
  tr.push(N.sc(".cr"+k,T,[[T0,0,0],[T0+D*k/5,0,0],[T0+D,1,1]],"linear"))}
 svg+=mvg("m0",xc,64,F.car(),dir<0?" scale(-1 1)":"")+'<circle cx="300" cy="56" r="6" fill="'+NEG+'"/><path d="M300 62L300 80" stroke="currentColor" stroke-width="3"/>'+t_(284,98,"observador",{s:10,a:"end"});
 tr.push(F.trk(".m0",T,T0,D,function(q){return[x0+5*st*q,64]},10));
 var y0=204,h=56,bw=[{v:800,col:"currentColor",l:"fonte parada"},{v:o.fp,col:NEG,l:o.lab}];
 svg+='<line x1="30" y1="'+y0+'" x2="290" y2="'+y0+'" stroke="currentColor" stroke-width="2"/>';
 bw.forEach(function(b,i){var x=90+i*140,bh=h*b.v/900;svg+='<rect class="b'+i+'" x="'+(x-30)+'" y="'+(y0-bh)+'" width="60" height="'+bh+'" fill="'+b.col+'" fill-opacity="'+(i?".5":".15")+'" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:50% 100%"/><g class="v'+i+'">'+t_(x,y0-bh-6,f(b.v,0)+" Hz",{s:12})+'</g>'+t_(x,y0+14,b.l,{s:11});
  tr.push(N.sc(".b"+i,T,[[T0+D*.5,1,0],[T0+D,1,1]],"ease-out"),N.vis(".v"+i,T,T0+D))});
 mk(key,alt,H+14,svg,tr,T,o.caps,[0,T0,T0+D+.2])}
doppler("calc_o043","Simulação: uma ambulância de sirene de 800 Hz se aproxima de um observador parado; as frentes de onda ficam mais juntas à frente, e o som percebido sobe para cerca de 877 Hz",{dir:1,x0:40,fp:877,lab:"se aproximando",caps:["A ambulância vem na direção do observador.|As frentes de onda ficam mais juntas à frente.","Ondas mais juntas chegam mais vezes por segundo:|o som percebido é mais agudo.","f' = f · v / (v − vF)|f' = 800 · 340 / (340 − 30) ≈ 877 Hz."]});
doppler("calc_o044","Simulação: uma ambulância de sirene de 800 Hz se afasta de um observador parado; as frentes de onda ficam mais espaçadas e o som percebido cai para cerca de 735 Hz",{dir:-1,x0:200,fp:735,lab:"se afastando",caps:["A ambulância se afasta do observador.|As frentes de onda ficam mais espaçadas.","Ondas mais espaçadas chegam menos vezes|por segundo: o som é mais grave.","f' = f · v / (v + vF)|f' = 800 · 340 / (340 + 30) ≈ 735 Hz."]});

/* Mach */
xy("calc_o045","Simulação: um avião voa a 680 m/s, o dobro da velocidade do som (340 m/s); o número de Mach cresce em reta com a velocidade e passa de 1, formando a onda de choque",{ym:2,xl:"",xe:"680 m/s",yl:"Mach",ye:"2",
 sc:'<g class="cn"><path d="M262 52L170 20M262 52L170 84" stroke="'+NEG+'" stroke-width="2.4" fill="none"/></g>'+mvg("m0",262,52,'<path d="M0 0L-30 -8L-22 0L-30 8Z" fill="'+ACC+'" stroke="currentColor" stroke-width="2"/>')+t_(80,52,"onda de choque",{s:11}),
 mv:[[".m0",function(q){return[60+202*q,52]},20]],tr:function(T,T0,D){return[N.op(".cn",T,[[T0,0],[T0+D*.5,0],[T0+D*.56,1]],"linear")]},cv:[cvP(function(q){return 2*q})],
 gs:function(gx,gy){return'<line x1="'+gx(0)+'" y1="'+gy(1)+'" x2="'+gx(1)+'" y2="'+gy(1)+'" stroke="currentColor" stroke-dasharray="4 3" stroke-opacity=".6"/>'+t_(gx(.04),gy(1)-6,"Mach 1 = 340 m/s (som)",{s:10,a:"start"})},
 rd:function(q){return"v = "+f(680*q,0)+" m/s  ·  Mach "+f(2*q)},caps:["O avião acelera. Abaixo de 340 m/s ele é|subsônico; acima disso, supersônico.","Passando de Mach 1, o avião alcança as ondas|que produz e forma a onda de choque.","M = v(avião) / v(som) = 680 / 340 = 2."]});

/* ondas estacionárias em cordas e tubos */
function estac(o){
 var x1=o.x1,x2=o.x2,yc=52,A=22,fn=o.env,svg=o.pre||'';
 svg+='<g class="sw" style="transform-origin:160px '+yc+'px"><path d="'+path(function(x){return yc-A*fn((x-x1)/(x2-x1))},x1,x2,80)+'" fill="none" stroke="'+ACC+'" stroke-width="2.6"/><path d="'+path(function(x){return yc+A*fn((x-x1)/(x2-x1))},x1,x2,80)+'" fill="none" stroke="'+ACC+'" stroke-width="2.6" stroke-opacity=".35"/></g>'+(o.post||'');
 return svg}
function corda(n){return function(u){return Math.sin(n*PI*u)}}
function cordaScene(n,lab){return estac({x1:40,x2:280,env:corda(n),pre:'<circle cx="40" cy="52" r="4" fill="currentColor"/><circle cx="280" cy="52" r="4" fill="currentColor"/>',post:t_(160,88,lab,{s:11})})}
function swTr(cyc){return function(T,T0,D){return[osc("sw",T,T0,D,cyc,function(c){return[1,c]})]}}

function nos(key,alt,o){
 var n=o.n,a=1/n;
 xy(key,alt,{ym:1,xl:"",xe:o.xe,yl:"amplitude",ye:"",n:120,sc:cordaScene(n,o.lam),tr:swTr(4),cv:[cvP(function(q){return Math.abs(Math.sin(n*PI*q))})],
  gs:function(gx,gy){var yy=gy(1)-7;return'<line x1="'+gx(a)+'" y1="'+yy+'" x2="'+gx(2*a)+'" y2="'+yy+'" stroke="currentColor"/>'+t_(gx(1.5*a),yy-5,o.fus,{s:10})+'<line x1="'+gx(a)+'" y1="'+gy(1)+'" x2="'+gx(a)+'" y2="'+gy(0)+'" stroke="currentColor" stroke-dasharray="3 3" stroke-opacity=".5"/><line x1="'+gx(2*a)+'" y1="'+gy(1)+'" x2="'+gx(2*a)+'" y2="'+gy(0)+'" stroke="currentColor" stroke-dasharray="3 3" stroke-opacity=".5"/>'},
  nr:6,rd:function(q){var e=Math.abs(Math.sin(n*PI*q));return"x = "+f(o.len*q,o.dec)+" "+o.un+"  ·  "+(e<.01?"nó":e>.99?"ventre":"entre nó e ventre")},caps:o.caps})}
nos("calc_o050","Simulação: numa corda com onda estacionária, a amplitude se anula nos nós, separados por 15 cm; dois fusos formam um comprimento de onda, 30 cm",{n:3,xe:"45 cm",lam:"λ = 30 cm",fus:"15 cm",len:45,dec:1,un:"cm",caps:["A corda vibra com nós (parados) e ventres.|O gráfico mostra a amplitude ao longo dela.","Entre dois nós seguidos há um fuso,|que vale meio comprimento de onda.","λ / 2 = 15 cm|λ = 30 cm."]});
nos("calc_o051","Simulação: uma corda de 1,2 m presa nas duas pontas vibra com 3 fusos; cada fuso mede 0,4 m e dois fusos formam um comprimento de onda, 0,8 m",{n:3,xe:"1,2 m",lam:"λ = 0,8 m",fus:"0,4 m",len:1.2,dec:1,un:"m",caps:["A corda de 1,2 m vibra com 3 fusos.|O gráfico mostra a amplitude ao longo dela.","Cada fuso vale λ / 2,|e os 3 fusos ocupam toda a corda.","L = 3 · λ / 2|λ = 2 · 1,2 / 3 = 0,8 m."]});

/* corda: f1 = v / 2L (mesma corda, comprimentos diferentes) */
(function(){var fr=function(q){return 250/(.25+.75*q)};
 xy("calc_o055","Simulação: numa corda presa nas duas pontas a frequência fundamental cai quando o comprimento aumenta, f = v / 2L; para L = 0,5 m ela vale 500 Hz, o que dá v = 500 m/s",{ym:1000,xl:"",x0t:"0,25",xe:"1 m",yl:"f₁ (Hz)",ye:"1000",n:60,sc:cordaScene(1,"L = 0,5 m  ·  f₁ = 500 Hz"),tr:swTr(8),cv:[cvP(fr)],
 gs:function(gx,gy){var x=gx(1/3),y=gy(500);return'<circle cx="'+x+'" cy="'+y+'" r="8" fill="none" stroke="'+NEG+'" stroke-width="2"/>'+t_(x+10,y-8,"0,5 m: 500 Hz",{s:10,a:"start"})},
 rd:function(q){var L=.25+.75*q;return"L = "+f(L)+" m  ·  f₁ = "+f(fr(q),0)+" Hz"},caps:["A corda vibra no modo fundamental:|um único fuso.","Corda mais curta, som mais agudo:|f₁ · L é sempre o mesmo valor (v / 2).","v = 2 · L · f₁|v = 2 · 0,5 · 500 = 500 m/s."]})})();
(function(){var v=function(q){return 10*Math.sqrt(100*q)};
 xy("calc_o056","Simulação: numa corda com 0,01 kg/m, um pulso viaja mais rápido quanto maior a tração; a velocidade cresce com a raiz da tração e chega a 100 m/s com 100 N",{ym:100,xl:"",xe:"100 N",yl:"v (m/s)",ye:"100",n:60,
 sc:'<line x1="30" y1="52" x2="262" y2="52" stroke="currentColor" stroke-width="2.4"/><circle cx="30" cy="52" r="4" fill="currentColor"/><g class="pl"><path d="M0 52C8 52 10 30 20 30C30 30 32 52 40 52" fill="none" stroke="'+ACC+'" stroke-width="3" transform="translate(130 0)"/></g><path d="M262 52L290 52M284 46L290 52L284 58" stroke="'+NEG+'" stroke-width="3" fill="none"/>'+t_(278,40,"T",{s:13,f:NEG})+t_(160,90,"μ = 0,01 kg/m",{s:11}),
 tr:function(T,T0,D){return[N.tr(".pl",T,[[T0,-100,0],[T0+D,100,0]],"linear"),N.vis(".pl",T,T0,T0+D)]},cv:[cvP(v)],
 rd:function(q){return"T = "+f(100*q,0)+" N  ·  v = "+f(v(q),0)+" m/s"},caps:["Um pulso viaja pela corda esticada.|Aumentando a tração, ele corre mais.","A velocidade cresce com a raiz da tração:|4 vezes mais tração, o dobro da velocidade.","v = √(T / μ) = √(100 / 0,01)|v = √10 000 = 100 m/s."]})})();
xy("calc_o057","Simulação: numa corda de 2 m, os harmônicos são múltiplos da fundamental; dois seguidos, 100 Hz e 125 Hz, diferem de f₁ = 25 Hz, o que dá v = 100 m/s",{ym:125,xl:"",xe:"n = 5",yl:"fₙ (Hz)",ye:"125",sc:cordaScene(4,"L = 2 m  ·  4º harmônico: 100 Hz"),tr:swTr(8),cv:[cvP(function(q){return 125*q})],
 gs:function(gx,gy){return[.8,1].map(function(a){var x=gx(a),y=gy(125*a);return'<circle cx="'+x+'" cy="'+y+'" r="7" fill="none" stroke="'+NEG+'" stroke-width="2"/>'+t_(x-10,y+(a<1?14:-8),f(125*a,0)+" Hz",{s:10,a:"end"})}).join("")},
 nr:5,rd:function(q){return"harmônico "+f(5*q,0)+"  ·  f = "+f(125*q,0)+" Hz"},caps:["Os harmônicos 4 e 5 têm 100 Hz e 125 Hz.|A frequência cresce em reta com o harmônico.","A diferença entre harmônicos seguidos|é a fundamental: f₁ = 125 − 100 = 25 Hz.","v = 2 · L · f₁|v = 2 · 2 · 25 = 100 m/s."]});
xy("calc_o058","Simulação: numa corda de 0,6 m com ondas a 360 m/s, a fundamental vale 300 Hz e as frequências dos harmônicos crescem em reta; o segundo harmônico chega a 600 Hz",{ym:900,xl:"",xe:"n = 3",yl:"fₙ (Hz)",ye:"900",sc:cordaScene(2,"L = 0,6 m  ·  2º harmônico"),tr:swTr(8),cv:[cvP(function(q){return 900*q})],
 gs:function(gx,gy){var x=gx(2/3),y=gy(600);return'<circle cx="'+x+'" cy="'+y+'" r="8" fill="none" stroke="'+NEG+'" stroke-width="2"/>'+t_(x-10,y-4,"2º: 600 Hz",{s:10,a:"end"})},
 nr:6,rd:function(q){return"harmônico "+f(3*q,1)+"  ·  f = "+f(900*q,0)+" Hz"},caps:["A fundamental vale v / 2L = 300 Hz.|Os harmônicos são múltiplos dela.","O segundo harmônico tem 2 fusos:|o dobro da frequência fundamental.","f₂ = 2 · v / (2L) = v / L|f₂ = 360 / 0,6 = 600 Hz."]});

/* tubos sonoros */
function tubo(closed,env,lab){
 var x1=60,x2=260;
 return'<line x1="'+x1+'" y1="26" x2="'+x2+'" y2="26" stroke="currentColor" stroke-width="3"/><line x1="'+x1+'" y1="78" x2="'+x2+'" y2="78" stroke="currentColor" stroke-width="3"/>'+(closed?'<line x1="'+x1+'" y1="26" x2="'+x1+'" y2="78" stroke="currentColor" stroke-width="5"/>':'')+
  '<g class="sw" style="transform-origin:160px 52px"><path d="'+path(function(x){return 52-20*env((x-x1)/(x2-x1))},x1,x2,80)+'" fill="none" stroke="'+ACC+'" stroke-width="2.6"/><path d="'+path(function(x){return 52+20*env((x-x1)/(x2-x1))},x1,x2,80)+'" fill="none" stroke="'+ACC+'" stroke-width="2.6" stroke-opacity=".35"/></g>'+t_(160,92,lab,{s:11})}
var OPEN=function(u){return Math.cos(PI*u)},CLOSED=function(n){return function(u){return Math.sin(n*PI*u/2)}};
function hip(key,alt,o){
 var g=function(q){return o.k/(o.a+(o.b-o.a)*q)},qq=(o.mark-o.a)/(o.b-o.a);
 xy(key,alt,{ym:g(0),xl:"",x0t:o.x0t,xe:o.xe,yl:o.yl,ye:o.ye,n:60,sc:tubo(o.closed,o.env,o.lab),tr:swTr(8),cv:[cvP(g)],
 gs:function(gx,gy){var x=gx(qq),y=gy(g(qq));return'<circle cx="'+x+'" cy="'+y+'" r="8" fill="none" stroke="'+NEG+'" stroke-width="2"/>'+t_(x+10,y-8,o.ml,{s:10,a:"start"})},
 rd:function(q){var x=o.a+(o.b-o.a)*q;return o.rl(x,g(q))},caps:o.caps})}
hip("calc_o062","Simulação: num tubo aberto nas duas extremidades, a frequência fundamental cai quando o tubo fica mais longo, f = v / 2L; para 0,85 m ela vale 200 Hz",{closed:0,env:OPEN,lab:"tubo aberto  ·  L = 0,85 m",k:170,a:.5,b:2,mark:.85,x0t:"0,5",xe:"2 m",yl:"f₁ (Hz)",ye:"340",ml:"0,85 m: 200 Hz",rl:function(x,y){return"L = "+f(x)+" m  ·  f₁ = "+f(y,0)+" Hz"},caps:["O tubo aberto tem ventres nas duas pontas:|na fundamental cabe meio comprimento de onda.","Tubo mais longo, som mais grave:|a frequência cai com o comprimento.","f₁ = v / (2L)|f₁ = 340 / (2 · 0,85) = 200 Hz."]});
hip("calc_o063","Simulação: num tubo fechado numa extremidade, a frequência fundamental cai quando o tubo fica mais longo, f = v / 4L; para 0,85 m ela vale 100 Hz",{closed:1,env:CLOSED(1),lab:"tubo fechado  ·  L = 0,85 m",k:85,a:.5,b:2,mark:.85,x0t:"0,5",xe:"2 m",yl:"f₁ (Hz)",ye:"170",ml:"0,85 m: 100 Hz",rl:function(x,y){return"L = "+f(x)+" m  ·  f₁ = "+f(y,0)+" Hz"},caps:["O tubo fechado tem um nó na ponta fechada|e um ventre na aberta: cabe 1/4 de λ.","Tubo mais longo, som mais grave:|a frequência cai com o comprimento.","f₁ = v / (4L)|f₁ = 340 / (4 · 0,85) = 100 Hz."]});
hip("calc_o065","Simulação: para um tubo aberto soar 340 Hz como fundamental, o comprimento cai quando a frequência desejada aumenta, L = v / 2f; para 340 Hz o tubo mede 0,5 m",{closed:0,env:OPEN,lab:"tubo aberto  ·  f₁ = 340 Hz",k:170,a:200,b:800,mark:340,x0t:"200",xe:"800 Hz",yl:"L (m)",ye:"0,85",ml:"340 Hz: 0,5 m",rl:function(x,y){return"f₁ = "+f(x,0)+" Hz  ·  L = "+f(y)+" m"},caps:["Para soar mais agudo, o tubo aberto|precisa ser mais curto.","O comprimento cai com a frequência:|L = v / (2 f₁).","L = v / (2 f₁)|L = 340 / (2 · 340) = 0,5 m."]});
(function(){
 xy("calc_o064","Simulação: num tubo fechado de 0,5 m só existem harmônicos ímpares; as frequências crescem em reta com n e o terceiro harmônico chega a 510 Hz",{ym:510,xl:"",xe:"n = 3",yl:"fₙ (Hz)",ye:"510",sc:tubo(1,CLOSED(3),"tubo fechado  ·  L = 0,5 m  ·  n = 3"),tr:swTr(8),cv:[cvP(function(q){return 510*q})],
 gs:function(gx,gy){return[1/3,1].map(function(a){var x=gx(a),y=gy(510*a);return'<circle cx="'+x+'" cy="'+y+'" r="7" fill="none" stroke="'+NEG+'" stroke-width="2"/>'+t_(x-10,y+(a<1?14:-8),f(510*a,0)+" Hz",{s:10,a:"end"})}).join("")},
 nr:6,rd:function(q){return"n = "+f(3*q,1)+"  ·  f = "+f(510*q,0)+" Hz"},caps:["No tubo fechado só cabem harmônicos ímpares:|n = 1, 3, 5...","As frequências crescem em reta com n:|f₃ é o triplo da fundamental.","f₃ = 3 · v / (4L)|f₃ = 3 · 340 / (4 · 0,5) = 510 Hz."]})})();
})();
