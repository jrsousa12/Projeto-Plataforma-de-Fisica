/* Eletrodinâmica: animações. */
(function(){"use strict";
var N=window.AN,t_=N.t;
var RC="var(--acc)",NG="var(--neg)";
function ray(x1,y1,x2,y2,cl,col){var a=Math.atan2(y2-y1,x2-x1),h=7,p=function(r,b){return(x2-r*Math.cos(a+b)).toFixed(1)+" "+(y2-r*Math.sin(a+b)).toFixed(1)};
 return'<g class="'+(cl||"")+'"><line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+(col||RC)+'" stroke-width="2.6"/><path d="M'+x2+' '+y2+'L'+p(h,.45)+'L'+p(h,-.45)+'Z" fill="'+(col||RC)+'"/></g>'}
function W(d){return'<path d="'+d+'" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'}
function bat(x,yc){return'<line x1="'+(x-12)+'" y1="'+(yc-6)+'" x2="'+(x+12)+'" y2="'+(yc-6)+'" stroke="currentColor" stroke-width="3"/><line x1="'+(x-7)+'" y1="'+(yc+6)+'" x2="'+(x+7)+'" y2="'+(yc+6)+'" stroke="currentColor" stroke-width="3"/>'+t_(x-22,yc-8,"+",{s:13,a:"end"})+t_(x-22,yc+14,"−",{s:13,a:"end"})}
function lamp(x,y){return'<circle cx="'+x+'" cy="'+y+'" r="13" fill="var(--acc)" fill-opacity=".18" stroke="currentColor" stroke-width="2.2"/><line x1="'+(x-9)+'" y1="'+(y-9)+'" x2="'+(x+9)+'" y2="'+(y+9)+'" stroke="currentColor" stroke-width="2"/><line x1="'+(x-9)+'" y1="'+(y+9)+'" x2="'+(x+9)+'" y2="'+(y-9)+'" stroke="currentColor" stroke-width="2"/>'}
function el(x,y){return'<circle cx="'+x+'" cy="'+y+'" r="5.5" fill="'+NG+'"/>'+t_(x,y+3.5,"−",{s:10,a:"middle"})}

/* corrente: sentido convencional x elétrons */
/* corrigido: os elétrons agora andam pelo fio no sentido anti-horário (do polo − pela parte de baixo, sobem pela direita e voltam por cima ao polo +); antes ficavam parados. A seta convencional i continua no sentido oposto (horário). */
(function(){var T=9.6,DS=80,LOOP=[[60,86],[60,130],[260,130],[260,30],[60,30],[60,72]];
 function pos(d){var i,a,b,L;for(i=0;i<LOOP.length-1;i++){a=LOOP[i];b=LOOP[i+1];L=Math.abs(b[0]-a[0])+Math.abs(b[1]-a[1]);if(d<=L||i===LOOP.length-2){var u=Math.min(1,d/L);return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u]}d-=L}}
 var S0=[494,444,394,294,94,194],tr=[],s=W("M60 72V30H260V130H60V86")+bat(60,79);
 S0.forEach(function(d0,k){var p0=pos(d0),pts=[],j;for(j=0;j<=24;j++){var p=pos(d0+DS*j/24);pts.push([T*j/24,p[0]-p0[0],p[1]-p0[1]])}
  s+='<g class="e'+k+'">'+el(p0[0],p0[1])+'</g>';tr.push(N.tr(".e"+k,T,pts,"linear"))});
 s+='<g class="s2">'+ray(215,14,150,14,"",NG)+t_(182,6,"elétrons (anti-horário)",{s:12})+'</g>';
 s+='<g class="s3">'+ray(120,46,200,46,"",RC)+t_(160,64,"i (sentido convencional)",{s:12})+'</g>';
 N.calc("edin_corrente","Animação: circuito simples com pilha; os elétrons se movem pelo fio do polo negativo para o positivo, no sentido anti-horário, e o sentido convencional da corrente é o oposto, do positivo para o negativo",{h:166,s:'<g transform="translate(0,16)">'+s+'</g>',tr:tr,
  steps:[[0,"Em um fio ligado à pilha, os elétrons livres|se movem de forma ordenada."],[3,"Os elétrons andam do polo negativo|para o polo positivo (aqui, anti-horário)."],[6,"Por convenção, a corrente tem o sentido contrário:|do positivo para o negativo (horário)."]]})})();

/* série: mesma corrente */
/* corrigido: o fio agora chega até as lâmpadas e liga uma à outra; antes um retângulo de fundo apagava o fio entre x = 104 e 216 e o circuito parecia aberto. A seta i do meio foi para cima do fio entre as lâmpadas, como as outras duas. */
(function(){var s=W("M60 72V30H117M143 30H187M213 30H260V130H60V86")+bat(60,79)+lamp(130,30)+lamp(200,30);
 s+='<g class="s2">'+ray(70,18,95,18,"",RC)+t_(82,10,"i",{s:12})+ray(152,18,178,18,"",RC)+t_(165,10,"i",{s:12})+ray(228,18,252,18,"",RC)+t_(240,10,"i",{s:12})+'</g>';
 s+='<g class="s3">'+t_(130,56,"U₁",{s:12})+t_(200,56,"U₂",{s:12})+t_(160,100,"U = U₁ + U₂",{s:13})+'</g>';
 N.calc("edin_serie","Animação: duas lâmpadas em série com uma pilha; a corrente é a mesma em todos os pontos e a tensão da fonte se divide entre as lâmpadas",{h:166,s:'<g transform="translate(0,16)">'+s+'</g>',
  steps:[[0,"Duas lâmpadas em série têm|um único caminho para a corrente."],[3,"A mesma corrente i passa por todos|os pontos do circuito."],[6,"A tensão da fonte se divide entre as lâmpadas:|U = U₁ + U₂."]]})})();

/* paralelo: mesma tensão */
(function(){var s=W("M60 72V30H220M60 86V130H220M140 30V130M220 30V130")+bat(60,79)+'<rect x="128" y="66" width="24" height="28" fill="var(--bg,#fff)"/><rect x="208" y="66" width="24" height="28" fill="var(--bg,#fff)"/>'+lamp(140,80)+lamp(220,80);
 s+='<g class="s2">'+ray(82,18,108,18,"",RC)+t_(95,10,"i",{s:12})+ray(124,44,124,62,"",RC)+t_(112,56,"i₁",{s:12,a:"end"})+ray(204,44,204,62,"",RC)+t_(192,56,"i₂",{s:12,a:"end"})+'</g>';
/* corrigido: equação U = U₁ = U₂ (em paralelo a tensão é a mesma nos dois ramos), com U₁ e U₂ ao lado das lâmpadas; antes só havia o texto "mesma tensão U nos dois ramos", que ficava por cima dos fios e das lâmpadas. */
 s+='<g class="s3">'+t_(156,84,"U₁",{s:12,a:"start"})+t_(236,84,"U₂",{s:12,a:"start"})+t_(272,46,"U = U₁ = U₂",{s:13})+'</g>';
 N.calc("edin_paralelo","Animação: duas lâmpadas em paralelo com uma pilha; a corrente total se divide entre os ramos e a tensão é a mesma nos dois, U = U₁ = U₂",{h:166,s:'<g transform="translate(0,16)">'+s+'</g>',
  steps:[[0,"Em paralelo, cada lâmpada tem|seu próprio caminho."],[3,"A corrente total i se divide:|i = i₁ + i₂."],[6,"As duas lâmpadas recebem a mesma tensão:|U = U₁ = U₂."]]})})();

/* efeito Joule */
(function(){var z="M40 100H110L120 80L140 120L160 80L180 120L200 80L210 100H280",s=W(z)+t_(160,142,"resistor",{s:12});
 var wv=function(x){return'<path d="M'+x+' 66Q'+(x+6)+' 56 '+x+' 46Q'+(x-6)+' 36 '+x+' 26" fill="none" stroke="'+NG+'" stroke-width="2.4" stroke-linecap="round"/>'};
/* corrigido: as ondas de calor agora sobem e se apagam, em 3 levas, a partir do resistor; antes ficavam paradas. O rótulo "calor" foi para o lado das ondas, para não ser tocado por elas na subida. */
 var hw=[],c,t0;for(c=0;c<3;c++){t0=3+c*2.2;hw.push([t0,0,0],[t0+2.19,0,-12]);if(c<2)hw.push([t0+2.2,0,0])}
 var ho=[[0,1],[3,1]];for(c=0;c<3;c++){t0=3+c*2.2;ho.push([t0+.3,1],[t0+2.19,.25]);if(c<2)ho.push([t0+2.2,1])}
 s+='<g class="s2"><g class="hw">'+wv(130)+wv(160)+wv(190)+'</g></g>';
 s+='<g class="s3">'+ray(40,76,80,76,"",RC)+t_(60,70,"i",{s:12})+t_(206,40,"calor",{s:13,a:"start"})+'</g>';
 N.calc("edin_joule","Animação: corrente atravessando um resistor, que se aquece e libera calor em ondas que sobem; energia elétrica transformada em energia térmica",{h:156,s:s,tr:[N.tr(".hw",9.6,hw,"linear"),N.op(".hw",9.6,ho)],
  steps:[[0,"A corrente atravessa um resistor.|Os elétrons colidem com os átomos do material."],[3,"As colisões aquecem o resistor,|que libera calor."],[6,"Energia elétrica se transforma em calor:|é o efeito Joule."]]})})();
})();
