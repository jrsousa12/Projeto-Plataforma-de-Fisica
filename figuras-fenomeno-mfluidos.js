/* Mecânica dos fluidos: simulações do FENÔMENO (substituem as resoluções passo a passo). */
(function(){"use strict";
var F=window.FEN,N=F.N,t_=F.t_,ACC=F.ACC,NEG=F.NEG,xy=F.xy,cvP=F.cvP,f=F.f,GR=F.GR,arr=F.arr;
var WATER="#38bdf8";

/* densidade: o volume do corpo cresce e a massa cresce junto, em reta (inclinação = densidade) */
function dens(key,alt,o){
 var S=54;
 xy(key,alt,{ym:o.m,xl:"",xe:o.xe,yl:o.yl,ye:o.ye,
  sc:GR+'<g class="cb" style="transform-origin:160px 94px"><rect x="'+(160-S/2)+'" y="'+(94-S)+'" width="'+S+'" height="'+S+'" fill="'+ACC+'" fill-opacity=".45" stroke="currentColor" stroke-width="2.4"/></g>'+t_(160,94-S/2+4,o.lab,{s:12})+t_(262,34,o.l2,{s:11}),
  tr:function(T,T0,D){return[N.sc(".cb",T,[[T0,.3,.3],[T0+D,1,1]],"linear")]},cv:[cvP(function(q){return o.m*q})],
  rd:function(q){return"V = "+f(o.V*q,0)+" "+o.vu+"  ·  m = "+f(o.m*q,o.md)+" "+o.mu},caps:o.caps})}
dens("calc_f010","Simulação: um bloco cresce em volume e a massa cresce em reta com ele; a inclinação do gráfico massa × volume é a massa específica, 2 g/cm³ (500 g em 250 cm³)",{m:500,V:250,xe:"250 cm³",yl:"massa (g)",ye:"500",md:0,vu:"cm³",mu:"g",lab:"500 g",l2:"250 cm³",caps:["Quanto maior o volume do material,|maior a sua massa.","A massa cresce em reta com o volume:|a inclinação é a massa específica.","μ = m / V = 500 / 250|μ = 2 g/cm³."]});
dens("calc_f075","Simulação: um cubo de 10 cm de aresta cresce em volume e a massa cresce em reta até 2700 g em 1000 cm³; a inclinação é a massa específica, 2,7 g/cm³",{m:2700,V:1000,xe:"1000 cm³",yl:"massa (g)",ye:"2700",md:0,vu:"cm³",mu:"g",lab:"2,7 kg",l2:"aresta 10 cm",caps:["O cubo maciço tem 10 cm de aresta,|ou seja, 10 · 10 · 10 = 1000 cm³.","A massa cresce em reta com o volume:|a inclinação é a massa específica.","μ = 2700 g / 1000 cm³|μ = 2,7 g/cm³."]});
dens("calc_f089","Simulação: um bloco de 600 g ocupa 200 cm³; a massa cresce em reta com o volume e a inclinação do gráfico é a densidade, 3 g/cm³",{m:600,V:200,xe:"200 cm³",yl:"massa (g)",ye:"600",md:0,vu:"cm³",mu:"g",lab:"600 g",l2:"200 cm³",caps:["Aumentando o volume do bloco,|a massa aumenta junto.","A massa cresce em reta com o volume:|a inclinação é a densidade.","d = m / V = 600 / 200|d = 3 g/cm³."]});
dens("calc_f091","Simulação: um cubo de 10 cm de aresta tem volume de 10⁻³ m³ e massa de 2 kg; a massa cresce em reta com o volume e a inclinação é a densidade, 2000 kg/m³",{m:2,V:1,xe:"10⁻³ m³",yl:"massa (kg)",ye:"2",md:1,vu:"× 10⁻³ m³",mu:"kg",lab:"2 kg",l2:"aresta 10 cm",caps:["A aresta de 10 cm vale 0,1 m,|então o volume é (0,1)³ = 10⁻³ m³.","A massa cresce em reta com o volume:|a inclinação é a densidade.","d = 2 / 10⁻³|d = 2000 kg/m³."]});

/* m = ρ·V: tanque enchendo */
xy("calc_f011","Simulação: um tanque se enche de água (1000 kg/m³) e a massa cresce em reta com o volume até 2000 kg em 2 m³",{ym:2000,xl:"",xe:"2 m³",yl:"massa (kg)",ye:"2000",
 sc:'<path d="M110 20L110 92L210 92L210 20" fill="none" stroke="currentColor" stroke-width="2.6"/><g class="wt" style="transform-origin:160px 92px"><rect x="111" y="26" width="98" height="65" fill="'+WATER+'" fill-opacity=".5"/></g>'+t_(160,66,"2 m³",{s:13})+t_(262,34,"água: 1000 kg/m³",{s:11}),
 tr:function(T,T0,D){return[N.sc(".wt",T,[[T0,1,.02],[T0+D,1,1]],"linear")]},cv:[cvP(function(q){return 2000*q})],
 rd:function(q){return"V = "+f(2*q)+" m³  ·  m = "+f(2000*q,0)+" kg"},caps:["O tanque vai se enchendo de água.|Cada metro cúbico tem 1000 kg.","A massa cresce em reta com o volume:|a inclinação é a massa específica.","m = μ · V = 1000 · 2|m = 2000 kg."]});

/* pressão = força / área */
function pres(key,alt,o){
 xy(key,alt,{ym:o.p,xl:"",xe:o.xe,yl:"p (Pa)",ye:o.ye,
  sc:GR+'<rect x="'+(160-o.w/2)+'" y="86" width="'+o.w+'" height="8" fill="currentColor" fill-opacity=".6"/><g class="fa" style="transform-origin:160px 40px"><line x1="160" y1="8" x2="160" y2="72" stroke="'+NEG+'" stroke-width="4"/><path d="M160 84L150 70L170 70Z" fill="'+NEG+'"/></g>'+t_(160+o.w/2+12,60,o.l1,{s:12,a:"start"})+t_(160,106-4,"",{}),
  tr:function(T,T0,D){return[N.sc(".fa",T,[[T0,1,.08],[T0+D,1,1]],"linear")]},cv:[cvP(function(q){return o.p*q})],
  rd:function(q){return"F = "+f(o.F*q,0)+" N  ·  p = "+f(o.p*q,0)+" Pa"},caps:o.caps})}
pres("calc_f020","Simulação: uma força perpendicular cresce sobre uma área fixa de 0,5 m²; a pressão cresce em reta com a força, e com 200 N ela vale 400 Pa",{p:400,F:200,w:70,xe:"200 N",ye:"400",l1:"A = 0,5 m²",caps:["A força age perpendicular à superfície,|que tem área 0,5 m².","Com a área fixa, a pressão cresce em reta|com a força.","p = F / A = 200 / 0,5|p = 400 Pa."]});
pres("calc_f092","Simulação: uma força perpendicular cresce sobre uma área fixa de 0,6 m²; a pressão cresce em reta com a força, e com 300 N ela vale 500 Pa",{p:500,F:300,w:80,xe:"300 N",ye:"500",l1:"A = 0,6 m²",caps:["A força age perpendicular à superfície,|que tem área 0,6 m².","Com a área fixa, a pressão cresce em reta|com a força.","p = F / A = 300 / 0,6|p = 500 Pa."]});
(function(){var A=function(q){return .6-.3*q};
 xy("calc_f021","Simulação: uma caixa de 60 N apoiada numa face grande e depois numa face menor, de 0,3 m², exerce pressão maior quanto menor a área de apoio, p = F / A; ao chegar a 0,3 m² a pressão vale 200 Pa",{ym:200,xl:"",x0t:"0,6 m²",xe:"0,3 m²",yl:"p (Pa)",ye:"200",n:60,
  sc:GR+'<g class="cx" style="transform-origin:160px 94px"><rect x="142" y="38" width="36" height="56" fill="'+ACC+'" fill-opacity=".45" stroke="currentColor" stroke-width="2.4"/></g>'+t_(160,70,"60 N",{s:12})+t_(250,50,"mesmo peso,",{s:11})+t_(250,66,"menos área",{s:11}),
  tr:function(T,T0,D){return[N.sc(".cx",T,[[T0,2,.5],[T0+D,1,1]],"linear")]},cv:[cvP(function(q){return 60/A(q)})],
  rd:function(q){return"A = "+f(A(q))+" m²  ·  p = "+f(60/A(q),0)+" Pa"},caps:["A mesma caixa de 60 N pode apoiar numa face|grande ou numa face pequena.","Menos área de apoio, mais pressão:|a mesma força se concentra.","p = F / A = 60 / 0,3|p = 200 Pa."]})})();

/* pressão da coluna de líquido */
function coluna(key,alt,caps){
 xy(key,alt,{ym:5,xl:"",xe:"5 m",yl:"p (10⁴ Pa)",ye:"5",
  sc:'<path d="M80 8L80 94L240 94L240 8" fill="none" stroke="currentColor" stroke-width="2.6"/><rect x="81" y="14" width="158" height="79" fill="'+WATER+'" fill-opacity=".4"/><line x1="80" y1="14" x2="240" y2="14" stroke="currentColor" stroke-width="2"/>'+
   '<g class="sd"><g transform="translate(160 80)"><circle r="7" fill="'+NEG+'" stroke="currentColor" stroke-width="2"/></g></g>'+t_(110,32,"água",{s:11})+t_(110,46,"1000 kg/m³",{s:10})+t_(228,28,"superfície",{s:10,a:"end"})+t_(228,92,"5 m",{s:10,a:"end"}),
  mv:[[".sd",function(q){return[0,-66*(1-q)]},12]],cv:[cvP(function(q){return 5*q})],
  rd:function(q){return"profundidade "+f(5*q)+" m  ·  p = "+f(5*q,2)+" × 10⁴ Pa"},caps:caps})}
coluna("calc_f022","Simulação: descendo na água, a pressão da coluna de líquido cresce em reta com a profundidade, p = μ·g·h, e a 5 m ela vale 5 × 10⁴ Pa sem contar a atmosfera",["Quanto mais fundo, mais água em cima:|a pressão aumenta com a profundidade.","A pressão cresce em reta com a altura|da coluna de água.","p = μ · g · h = 1000 · 10 · 5|p = 5 × 10⁴ Pa."]);
coluna("calc_f094","Simulação: descendo na água, a pressão da coluna de líquido cresce em reta com a profundidade, p = ρ·g·h, e a 5 m ela vale 5 × 10⁴ Pa sem contar a atmosfera",["Quanto mais fundo, mais água em cima:|a pressão aumenta com a profundidade.","A pressão cresce em reta com a altura|da coluna de água.","p = ρ · g · h = 1000 · 10 · 5|p = 5 × 10⁴ Pa."]);

/* barômetro: mmHg -> atm */
xy("calc_f086","Simulação: a coluna de mercúrio sobe de 0 a 380 mmHg; como 760 mmHg valem 1 atm, a pressão cresce em reta e 380 mmHg correspondem a 0,5 atm",{ym:.5,xl:"",xe:"380 mmHg",yl:"p (atm)",ye:"0,5",
 sc:'<rect x="146" y="10" width="16" height="82" fill="none" stroke="currentColor" stroke-width="2.4"/><g class="hg" style="transform-origin:154px 92px"><rect x="147" y="51" width="14" height="40" fill="#9ca3af" stroke="currentColor"/></g><line x1="140" y1="10" x2="170" y2="10" stroke="currentColor" stroke-dasharray="3 3"/>'+t_(176,14,"760 mmHg = 1 atm",{s:10,a:"start"})+t_(176,56,"380 mmHg",{s:10,a:"start"}),
 tr:function(T,T0,D){return[N.sc(".hg",T,[[T0,1,.02],[T0+D,1,1]],"linear")]},cv:[cvP(function(q){return .5*q})],
 rd:function(q){return"p = "+f(380*q,0)+" mmHg  =  "+f(.5*q,3)+" atm"},caps:["A coluna de mercúrio mede a pressão:|760 mmHg equivalem a 1 atm.","A pressão em atm cresce em reta|com a altura da coluna.","380 / 760 = 0,5 atm."]});
})();
