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
(function(){var s=W("M60 72V30H260V130H60V86")+bat(60,79)+el(110,30)+el(160,30)+el(210,30)+el(260,80)+el(110,130)+el(210,130);
 s+='<g class="s2">'+ray(215,14,150,14,"",NG)+t_(182,6,"elétrons",{s:12})+'</g>';
 s+='<g class="s3">'+ray(120,46,200,46,"",RC)+t_(160,64,"i (sentido convencional)",{s:12})+'</g>';
 N.calc("edin_corrente","Animação: circuito simples com pilha; os elétrons se movem do polo negativo para o positivo, e o sentido convencional da corrente é o oposto, do positivo para o negativo",{h:166,s:'<g transform="translate(0,16)">'+s+'</g>',
  steps:[[0,"Em um fio ligado à pilha, os elétrons livres|se movem de forma ordenada."],[3,"Os elétrons andam do polo negativo|para o polo positivo."],[6,"Por convenção, a corrente tem o sentido contrário:|do positivo para o negativo."]]})})();

/* série: mesma corrente */
(function(){var s=W("M60 72V30H260V130H60V86")+bat(60,79)+'<rect x="104" y="22" width="112" height="16" fill="var(--bg,#fff)"/>'+lamp(130,30)+lamp(200,30);
 s+='<g class="s2">'+ray(70,18,95,18,"",RC)+t_(82,10,"i",{s:12})+ray(150,48,178,48,"",RC)+t_(164,64,"i",{s:12})+ray(228,18,252,18,"",RC)+t_(240,10,"i",{s:12})+'</g>';
 s+='<g class="s3">'+t_(130,56,"U₁",{s:12})+t_(200,56,"U₂",{s:12})+t_(160,100,"U = U₁ + U₂",{s:13})+'</g>';
 N.calc("edin_serie","Animação: duas lâmpadas em série com uma pilha; a corrente é a mesma em todos os pontos e a tensão da fonte se divide entre as lâmpadas",{h:166,s:'<g transform="translate(0,16)">'+s+'</g>',
  steps:[[0,"Duas lâmpadas em série têm|um único caminho para a corrente."],[3,"A mesma corrente i passa por todos|os pontos do circuito."],[6,"A tensão da fonte se divide entre as lâmpadas:|U = U₁ + U₂."]]})})();

/* paralelo: mesma tensão */
(function(){var s=W("M60 72V30H220M60 86V130H220M140 30V130M220 30V130")+bat(60,79)+'<rect x="128" y="66" width="24" height="28" fill="var(--bg,#fff)"/><rect x="208" y="66" width="24" height="28" fill="var(--bg,#fff)"/>'+lamp(140,80)+lamp(220,80);
 s+='<g class="s2">'+ray(82,18,108,18,"",RC)+t_(95,10,"i",{s:12})+ray(124,44,124,62,"",RC)+t_(112,56,"i₁",{s:12,a:"end"})+ray(204,44,204,62,"",RC)+t_(192,56,"i₂",{s:12,a:"end"})+'</g>';
 s+='<g class="s3">'+t_(170,112,"mesma tensão U nos dois ramos",{s:12})+'</g>';
 N.calc("edin_paralelo","Animação: duas lâmpadas em paralelo com uma pilha; a corrente total se divide entre os ramos e a tensão é a mesma nos dois",{h:166,s:'<g transform="translate(0,16)">'+s+'</g>',
  steps:[[0,"Em paralelo, cada lâmpada tem|seu próprio caminho."],[3,"A corrente total i se divide:|i = i₁ + i₂."],[6,"As duas lâmpadas recebem|a mesma tensão U."]]})})();

/* efeito Joule */
(function(){var z="M40 100H110L120 80L140 120L160 80L180 120L200 80L210 100H280",s=W(z)+t_(160,142,"resistor",{s:12});
 var wv=function(x){return'<path d="M'+x+' 66Q'+(x+6)+' 56 '+x+' 46Q'+(x-6)+' 36 '+x+' 26" fill="none" stroke="'+NG+'" stroke-width="2.4" stroke-linecap="round"/>'};
 s+='<g class="s2">'+wv(130)+wv(160)+wv(190)+'</g>';
 s+='<g class="s3">'+ray(40,76,80,76,"",RC)+t_(60,70,"i",{s:12})+t_(160,14,"calor",{s:13})+'</g>';
 N.calc("edin_joule","Animação: corrente atravessando um resistor, que se aquece e libera calor; energia elétrica transformada em energia térmica",{h:156,s:s,
  steps:[[0,"A corrente atravessa um resistor.|Os elétrons colidem com os átomos do material."],[3,"As colisões aquecem o resistor,|que libera calor."],[6,"Energia elétrica se transforma em calor:|é o efeito Joule."]]})})();
})();
