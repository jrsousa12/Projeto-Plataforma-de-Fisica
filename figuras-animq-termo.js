/* Animações de Termologia (prioridade alta). */
(function(){"use strict";
var N=window.AN;
function along(pts,t0,speeds){ /* amostra uma polilinha: devolve [[t,x,y],...] com tempos por trecho */
 var o=[[t0,pts[0][0],pts[0][1]]],t=t0;for(var i=1;i<pts.length;i++){t+=speeds[i-1];o.push([t,pts[i][0],pts[i][1]])}return o}

/* ---------- gráfico de aquecimento ---------- */
(function(){var T=11.5,P=[[44,128],[84,112],[134,112],[194,48],[254,48],[296,28]],D=[1.6,2.4,2,2.8,1.6],t0=0.8;
 var len=[],tot=0;for(var i=1;i<P.length;i++){var l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);len.push(l);tot+=l}
 var s='<path d="M36 12V136H306" fill="none" stroke="currentColor" stroke-width="2"/><text x="30" y="16" font-size="11" text-anchor="end">T</text><text x="304" y="150" font-size="11" text-anchor="end">calor recebido (Q)</text>';
 s+='<text x="37" y="51" font-size="8.5" text-anchor="end">100°C</text><text x="37" y="115" font-size="8.5" text-anchor="end">0°C</text>';
 s+='<line x1="36" y1="48" x2="306" y2="48" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="3 4"/><line x1="36" y1="112" x2="306" y2="112" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="3 4"/>';
 var d="M"+P.map(function(p){return p[0]+" "+p[1]}).join("L");
 s+='<path class="cv" d="'+d+'" fill="none" stroke="var(--f-calor)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="'+tot+'" stroke-dashoffset="0"/>';
 s+='<text class="n1" x="64" y="98" font-size="10" text-anchor="middle">gelo</text><text class="n2" x="109" y="126" font-size="10" text-anchor="middle">fusão</text><text class="n3" x="158" y="84" font-size="10" text-anchor="start">água líquida</text><text class="n4" x="224" y="40" font-size="10" text-anchor="middle">ebulição</text><text class="n5" x="296" y="46" font-size="10" text-anchor="end">vapor</text>';
 s+='<circle class="dot" cx="296" cy="28" r="6" fill="var(--spark)" stroke="currentColor" stroke-width="1.5"/>';
 var ts=[t0];D.forEach(function(x){ts.push(ts[ts.length-1]+x)});
 /* deslocamento da curva: dashoffset de tot a 0, proporcional ao comprimento percorrido por trecho */
 var off=[[0,tot],[t0,tot]],acc=0;for(i=1;i<P.length;i++){acc+=len[i-1];off.push([ts[i],tot-acc])}
 var tr=[N.pr(".cv",T,"strokeDashoffset",off.map(function(p){return[p[0],p[1]]}),"linear")];
 var mv=[[0,P[0][0]-296,P[0][1]-28],[t0,P[0][0]-296,P[0][1]-28]];for(i=1;i<P.length;i++)mv.push([ts[i],P[i][0]-296,P[i][1]-28]);
 tr.push(N.tr(".dot",T,mv,"linear"));
 for(i=1;i<=5;i++)tr.push(N.vis(".n"+i,T,ts[i-1]+.2));
 var times=[0,ts[1],ts[2],ts[3],ts[4]];
 var c=N.cap(["Aquecendo o gelo:|a temperatura sobe","Fusão: o calor muda o estado|e a temperatura fica constante","Aquecendo a água líquida:|a temperatura sobe","Ebulição: o calor muda o estado|e a temperatura fica constante","Aquecendo o vapor:|a temperatura sobe de novo"],times,T,172);
 N.reg("aquec",{a:"Animação: gráfico de aquecimento da água; a temperatura sobe com o gelo, fica constante durante a fusão, sobe com a água líquida, fica constante na ebulição e sobe com o vapor",h:204,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* ---------- dilatação anômala: gráfico volume x temperatura ---------- */
(function(){var T=8.4,pts=[],i;
 function X(t){return 50+t*24}function Y(t){return 128-0.9*(t-4)*(t-4)}
 for(i=0;i<=20;i++){var t=i*.5;pts.push([X(t),Y(t)])}
 var s='<path d="M42 14V136H300" fill="none" stroke="currentColor" stroke-width="2"/><text x="48" y="14" font-size="11">volume</text><text x="300" y="130" font-size="11" text-anchor="end">T (°C)</text>';
 [0,4,10].forEach(function(t){s+='<line x1="'+X(t)+'" y1="136" x2="'+X(t)+'" y2="140" stroke="currentColor" stroke-width="2"/><text x="'+X(t)+'" y="150" font-size="11" text-anchor="middle">'+t+'</text>'});
 s+='<path class="cv" d="M'+pts.map(function(p){return p[0]+" "+p[1]}).join("L")+'" fill="none" stroke="var(--f-agua)" stroke-width="4" stroke-linecap="round" stroke-dasharray="400" stroke-dashoffset="0"/>';
 s+='<line class="mn" x1="'+X(4)+'" y1="'+Y(4)+'" x2="'+X(4)+'" y2="136" stroke="currentColor" stroke-dasharray="3 3" stroke-opacity=".6"/>';
 s+='<text class="mnl" x="'+(X(4)+8)+'" y="'+(Y(4)-22)+'" font-size="11" font-weight="700">4 °C: volume mínimo|</text>';
 s+='<circle class="dot" cx="'+X(10)+'" cy="'+Y(10)+'" r="6" fill="var(--spark)" stroke="currentColor" stroke-width="1.5"/>';
 /* movimento do ponto por amostras, de 0 a 10 °C, 6 s */
 var tr=[],mv=[[0,X(0)-X(10),Y(0)-Y(10)],[1,X(0)-X(10),Y(0)-Y(10)]];
 for(i=1;i<=20;i++){var tt=i*.5;mv.push([1+i*.3,X(tt)-X(10),Y(tt)-Y(10)])}
 tr.push(N.tr(".dot",T,mv,"linear"));
 /* curva desenhada acompanhando o ponto */
 var tot=0,seg=[];for(i=1;i<pts.length;i++){var l=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(l);tot+=l}
 s=s.replace('stroke-dasharray="400"','stroke-dasharray="'+Math.ceil(tot)+'"');
 var off=[[0,Math.ceil(tot)],[1,Math.ceil(tot)]],acc=0;for(i=1;i<pts.length;i++){acc+=seg[i-1];off.push([1+i*.3,Math.ceil(tot)-acc])}
 tr.push(N.pr(".cv",T,"strokeDashoffset",off,"linear"),N.vis(".mn,.mnl",T,3.0));
 var c=N.cap(["Aquecendo a água a partir de 0 °C:|o volume DIMINUI","Em 4 °C o volume é mínimo,|e a densidade é máxima","Acima de 4 °C ela dilata|como os outros líquidos"],[0,1.2,4.2],T,170);
 s=s.replace('4 °C: volume mínimo|','4 °C: mínimo');
 N.reg("agua_vol",{a:"Animação: gráfico do volume da água em função da temperatura; de 0 a 4 graus o volume diminui, em 4 graus é mínimo e depois aumenta",h:206,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* ---------- lago congelando ---------- */
(function(){var T=9,s="",tr=[],x0=60,x1=260,y0=46,y1=146;
 var cols=["#cfeaf8","#bfe0f4","#a8d3ee","#8ec4e6","#6fb0dc"];
 for(var i=0;i<5;i++)s+='<rect x="'+(x0+1)+'" y="'+(y0+i*20+1)+'" width="'+(x1-x0-2)+'" height="20" style="fill:'+cols[i]+'"/>';
 s+='<path d="M'+x0+' 30V'+y1+'H'+x1+'V30" fill="none" stroke="currentColor" stroke-width="2"/>';
 var lab=["0 °C","1 °C","2 °C","3 °C","4 °C"];
 for(i=0;i<5;i++)s+='<text class="tl" x="'+(x1+8)+'" y="'+(y0+i*20+14)+'" font-size="11" font-weight="700">'+lab[i]+'</text>';
 s+='<rect class="ice" x="'+(x0+1)+'" y="'+y0+'" width="'+(x1-x0-2)+'" height="14" style="fill:#f4fbff;stroke:currentColor;stroke-width:1.5;transform-box:fill-box;transform-origin:50% 0%"/>';
 s+='<text class="gel" x="160" y="'+(y0+11)+'" font-size="10" text-anchor="middle" style="fill:#1b1b1b">gelo</text>';
 s+='<text x="160" y="22" text-anchor="middle" font-size="11">ar frio (abaixo de 0 °C)</text>';
 for(var k=0;k<3;k++){s+=N.varrow(100+k*60,y0+4,y0+36,"an-a1 sk",2.5).replace("<g ",'<g opacity="0" ')}
 tr=[N.vis(".sk",T,0.8,3.8),N.tr(".sk",T,[[0,0,0],[0.8,0,0],[3.8,0,38]],"ease-in"),N.sc(".ice",T,[[0,1,0],[4.2,1,0],[6.2,1,1]]),N.vis(".gel",T,6.0),N.vis(".tl",T,4.0)];
 var c=N.cap(["A superfície esfria. A água a 4 °C|é a mais densa e afunda","A água mais fria (menos densa)|fica por cima e congela","O gelo flutua e isola o fundo:|a água embaixo continua a 4 °C"],[0,1.0,4.2],T,172);
 N.reg("lago",{a:"Animação: a superfície do lago esfria, a água a 4 graus é a mais densa e afunda, a água mais fria fica por cima e congela; o gelo flutua e o fundo continua a 4 graus",h:204,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* ---------- convecção ---------- */
function circ(key,alt,cfg){var T=cfg.T||9,L=cfg.L,Rr=cfg.R,top=cfg.top,bot=cfg.bot,s=cfg.base||"",tr=[],per=3000,it=3,n=4;
 var lens=[bot-top,Rr-L,bot-top,Rr-L],tot=lens[0]+lens[1]+lens[2]+lens[3];
 var C=[[L,bot,0,"#f97316"],[L,top,lens[0],"#f97316"],[Rr,top,lens[0]+lens[1],"#60a5fa"],[Rr,bot,lens[0]*2+lens[1],"#3b82f6"]];
 function pos(d){d=((d%tot)+tot)%tot;for(var i=3;i>=0;i--)if(d>=C[i][2]){var a=C[i],b=C[(i+1)%4],u=(d-a[2])/(lens[i]),x=a[0]+(b[0]-a[0])*u,y=a[1]+(b[1]-a[1])*u;return[x,y,a[3]]}}
 s+='<path d="M'+L+' '+bot+'V'+top+'H'+Rr+'V'+bot+'Z" fill="none" stroke="currentColor" stroke-opacity=".3" stroke-width="2" stroke-dasharray="4 4"/>'+'<path d="M'+(L-5)+' '+((top+bot)/2+4)+'L'+L+' '+((top+bot)/2-6)+'L'+(L+5)+' '+((top+bot)/2+4)+'M'+((L+Rr)/2-4)+' '+(top-5)+'L'+((L+Rr)/2+6)+' '+top+'L'+((L+Rr)/2-4)+' '+(top+5)+'M'+(Rr-5)+' '+((top+bot)/2-4)+'L'+Rr+' '+((top+bot)/2+6)+'L'+(Rr+5)+' '+((top+bot)/2-4)+'M'+((L+Rr)/2+4)+' '+(bot-5)+'L'+((L+Rr)/2-6)+' '+bot+'L'+((L+Rr)/2+4)+' '+(bot+5)+'" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="2"/>';
 for(var i=0;i<n;i++){var d0=i*tot/n,p0=pos(d0);
  s+='<circle class="pt'+i+'" cx="'+Math.round(p0[0])+'" cy="'+Math.round(p0[1])+'" r="5" style="fill:'+p0[2]+'" stroke="currentColor" stroke-width="1"/>';
  var ds=[];C.forEach(function(c){var dist=((c[2]-d0)%tot+tot)%tot;if(dist>0.5)ds.push([dist,c])});ds.sort(function(a,b){return a[0]-b[0]});
  var kf=[{offset:0,transform:"translate(0px,0px)",fill:p0[2]}];
  ds.forEach(function(q){kf.push({offset:q[0]/tot,transform:"translate("+(q[1][0]-p0[0])+"px,"+(q[1][1]-p0[1])+"px)",fill:q[1][3]})});
  kf.push({offset:1,transform:"translate(0px,0px)",fill:p0[2]});
  tr.push(["kf",".pt"+i,kf,0,per,it])}
 var c=N.cap(cfg.caps,[0,2.7,5.4],T,cfg.cy);
 N.reg(key,{a:alt,h:cfg.h,s:s+c.s,t:tr.concat(c.t),T:T})}
(function(){var T=9,tr=[],per=3000,it=3,top=52,bot=122,cx=160,xs=[120,200],O="#f97316",O2="#93c5fd",B="#3b82f6";
 var s='<path d="M80 36V130Q80 140 90 140H230Q240 140 240 130V36" fill="var(--f-agua2)" fill-opacity=".45" stroke="currentColor" stroke-width="2"/><ellipse cx="160" cy="132" rx="50" ry="12" fill="#f97316" opacity=".28"/>';
 xs.forEach(function(x){s+='<path d="M'+cx+' '+bot+'V'+top+'H'+x+'V'+bot+'Z" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="2" stroke-dasharray="4 4"/>'});
 s+='<path d="M146 166Q150 150 157 158Q160 142 164 156Q170 150 174 166Z" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/><path d="M154 166Q157 158 160 162Q163 156 166 166Z" fill="#fde047"/>';
 [128,160,192].forEach(function(x,i){s+='<path class="vp'+i+'" d="M'+x+' 34q5-7 0-14t0-14" fill="none" stroke="currentColor" stroke-opacity=".6" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>';
  tr.push(["kf",".vp"+i,[{offset:0,transform:"translate(0px,0px)",opacity:0},{offset:.25,transform:"translate(1px,-3px)",opacity:.75},{offset:1,transform:"translate("+(i%2?-4:4)+"px,-16px)",opacity:0}],3600+i*650,2400,3])});
 s+='<text x="232" y="30" font-size="10" font-weight="700" text-anchor="start" class="vap" opacity="0">vapor</text>';
 tr.push(N.vis(".vap",T,5.4));
 var pts=function(x){return [[cx,bot,O],[cx,top,O],[x,top,O2],[x,bot,B]]};
 var n=0;
 xs.forEach(function(x){var C=pts(x),lens=[bot-top,Math.abs(x-cx),bot-top,Math.abs(x-cx)],tot=lens[0]+lens[1]+lens[2]+lens[3],cum=[0,lens[0],lens[0]+lens[1],lens[0]*2+lens[1]];
  function pos(d){d=((d%tot)+tot)%tot;for(var i=3;i>=0;i--)if(d>=cum[i]){var a=C[i],b=C[(i+1)%4],u=(d-cum[i])/lens[i];return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]]}}
  for(var i=0;i<3;i++){var d0=i*tot/3,p0=pos(d0),id=n++;
   s+='<circle class="pt'+id+'" cx="'+Math.round(p0[0])+'" cy="'+Math.round(p0[1])+'" r="5" style="fill:'+p0[2]+'" stroke="currentColor" stroke-width="1"/>';
   var ds=[];cum.forEach(function(c0,k){var dist=((c0-d0)%tot+tot)%tot;if(dist>0.5)ds.push([dist,C[k]])});ds.sort(function(a,b){return a[0]-b[0]});
   var kf=[{offset:0,transform:"translate(0px,0px)",fill:p0[2]}];
   ds.forEach(function(q){kf.push({offset:q[0]/tot,transform:"translate("+(q[1][0]-p0[0])+"px,"+(q[1][1]-p0[1])+"px)",fill:q[1][2]})});
   kf.push({offset:1,transform:"translate(0px,0px)",fill:p0[2]});
   tr.push(["kf",".pt"+id,kf,0,per,it])}});
 var c=N.cap(["A chama, no centro, aquece a água de baixo","A água quente sobe pelo meio e esfria;|ao descer pelos lados, fica azul (mais densa)","Formam-se correntes de convecção; no alto,|parte da água evapora e sai como vapor"],[0,2.7,5.4],T,178);
 N.reg("convec",{a:"Animação: a chama, no centro do recipiente, aquece a água de baixo, que sobe pelo meio; ao esfriar, a água desce pelos lados e fica azul. Forma-se uma corrente de convecção e sai vapor de água do recipiente",h:208,s:s+c.s,t:tr.concat(c.t),T:T})})();
circ("geladeira","Animação: no interior da geladeira o ar frio do congelador, no alto, é mais denso e desce, e o ar mais quente sobe pelo outro lado, formando uma corrente de convecção",
 {L:100,R:220,top:80,bot:128,T:9,cy:172,h:204,caps:["O congelador fica na parte de cima","O ar frio é mais denso e desce|o ar mais quente sobe","A corrente de convecção resfria|toda a geladeira"],
  base:'<rect x="70" y="26" width="180" height="116" rx="8" fill="var(--f-vidro)" stroke="currentColor" stroke-width="2.5"/><rect x="76" y="32" width="168" height="26" rx="4" fill="#bfe6f5" stroke="currentColor" stroke-width="1.5"/><text x="160" y="50" text-anchor="middle" font-size="11" font-weight="700" style="fill:#1b1b1b">congelador</text><line x1="70" y1="62" x2="250" y2="62" stroke="currentColor" stroke-width="2"/>'});

/* ================= PRIORIDADE MÉDIA ================= */
function sol(cx,cy){var r='<g class="sun"><circle cx="'+cx+'" cy="'+cy+'" r="11" fill="var(--f-calor)"/>';for(var i=0;i<8;i++){var a=i*Math.PI/4;r+='<line x1="'+(cx+16*Math.cos(a)).toFixed(1)+'" y1="'+(cy+16*Math.sin(a)).toFixed(1)+'" x2="'+(cx+22*Math.cos(a)).toFixed(1)+'" y2="'+(cy+22*Math.sin(a)).toFixed(1)+'" stroke="var(--f-calor)" stroke-width="2.5" stroke-linecap="round"/>'}return r+'</g>'}
/* ---------- trilhos de ferrovia ---------- */
(function(){var T=8,tr=[],s='';
 s+=sol(284,30);
 for(var x=30;x<=300;x+=30)s+='<rect x="'+x+'" y="82" width="12" height="16" rx="2" fill="#8d99ad" opacity=".55"/>';
 s+='<g class="r1" style="transform-box:fill-box;transform-origin:left center"><rect x="20" y="66" width="140" height="14" rx="3" fill="#8d99ad" stroke="currentColor" stroke-width="1.5"/><rect class="hot" x="20" y="66" width="140" height="14" rx="3" fill="var(--f-calor)" opacity=".5"/></g>';
 s+='<g class="r2" style="transform-box:fill-box;transform-origin:right center"><rect x="170" y="66" width="130" height="14" rx="3" fill="#8d99ad" stroke="currentColor" stroke-width="1.5"/><rect class="hot" x="170" y="66" width="130" height="14" rx="3" fill="var(--f-calor)" opacity=".5"/></g>';
 s+='<line x1="165" y1="104" x2="165" y2="84" stroke="currentColor" stroke-width="1.5"/><text x="165" y="118" text-anchor="middle" font-size="12" font-weight="700">folga</text>';
 tr.push(N.sc(".r1",T,[[0,.857,1],[2,.857,1],[5,1,1]]),N.sc(".r2",T,[[0,.923,1],[2,.923,1],[5,1,1]]));
 tr.push(N.op(".hot",T,[[0,0],[2,0],[5,.5]]),N.vis(".sun",T,1.6));
 var c=N.cap(["Trilhos no frio, com folga entre eles","O Sol aquece os trilhos","Eles dilatam e a folga diminui:|sem ela, o trilho se entortaria"],[0,1.6,5],T,152);
 N.reg("trilhos",{a:"Animação: sob o calor do Sol os trilhos dilatam e a folga entre eles diminui; sem a folga os trilhos se deformariam",h:172,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- furo em chapa aquecida ---------- */
(function(){var T=8,tr=[],s='';
 function pl(r,sq){return'M'+(160-sq)+' '+(66-sq)+'h'+2*sq+'v'+2*sq+'h'+(-2*sq)+'zM'+(160+r)+' 66a'+r+' '+r+' 0 1 0 '+(-2*r)+' 0a'+r+' '+r+' 0 1 0 '+(2*r)+' 0z'}
 s+=sol(284,26);
 s+='<g class="pl" style="transform-box:fill-box;transform-origin:center"><path d="'+pl(26,60)+'" fill-rule="evenodd" fill="#8d99ad" stroke="currentColor" stroke-width="2"/><path class="hot" d="'+pl(26,60)+'" fill-rule="evenodd" fill="var(--f-calor)" opacity=".5"/></g>';
 s+='<g class="ref"><rect x="'+(160-54)+'" y="'+(66-54)+'" width="108" height="108" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3" opacity=".8"/><circle cx="160" cy="66" r="23.4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/></g>';
 s+='<text x="160" y="150" text-anchor="middle" font-size="11">tracejado: tamanho antes de aquecer</text>';
 tr.push(N.sc(".pl",T,[[0,.9,.9],[2,.9,.9],[5,1,1]]),N.op(".hot",T,[[0,0],[2,0],[5,.5]]),N.vis(".sun",T,1.6));
 var c=N.cap(["Chapa metálica com um furo circular","A chapa é aquecida e dilata","O furo também aumenta, como se fosse|feito do mesmo material da chapa"],[0,1.6,5],T,172);
 N.reg("furo",{a:"Animação: uma chapa metálica com um furo circular é aquecida e dilata por inteiro; o furo também aumenta, como se fosse feito do mesmo material da chapa",h:192,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- lâmina bimetálica ---------- */
(function(){var T=8,tr=[],s='',n=5,L=44,x0=22,y0=72,th=10;
 s+=sol(284,30);
 s+='<rect x="8" y="52" width="14" height="60" fill="#8d99ad" stroke="currentColor" stroke-width="1.5"/>';
 var inner='';
 for(var i=n-1;i>=0;i--){var px=x0+i*L;
  inner='<g class="sg'+i+'" style="transform:rotate('+th*.55+'deg);transform-origin:'+px+'px '+y0+'px"><rect x="'+px+'" y="'+(y0-th)+'" width="'+(L+.5)+'" height="'+th+'" fill="var(--f-calor)" fill-opacity=".75" stroke="currentColor" stroke-width="1.2"/><rect x="'+px+'" y="'+y0+'" width="'+(L+.5)+'" height="'+th+'" fill="#8d99ad" stroke="currentColor" stroke-width="1.2"/>'+inner+'</g>';
  tr.push(N.rot(".sg"+i,T,[[0,0],[2,0],[5,th*.55]]))}
 s+=inner;
 s+='<text x="28" y="'+(y0-th-6)+'" font-size="11" font-weight="700">metal A: dilata mais</text><text x="28" y="'+(y0+th+34)+'" font-size="11" font-weight="700">metal B: dilata menos</text>';
 tr.push(N.vis(".sun",T,1.6));
 var c=N.cap(["Lâmina de dois metais unidos,|reta e fria","Ao aquecer, o metal A dilata mais","A lâmina se curva para o lado do metal B:|é o princípio do termostato"],[0,1.6,5],T,176);
 N.reg("bimetal",{a:"Animação: uma lâmina feita de dois metais unidos é aquecida; o metal que dilata mais fica no lado de fora da curva e a lâmina se curva, princípio do termostato bimetálico",h:196,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- equilíbrio térmico ---------- */
(function(){var T=9,tr=[],s='';
 s+='<path d="M40 14V130H304" fill="none" stroke="currentColor" stroke-width="2"/><text x="36" y="20" font-size="11" text-anchor="end">T</text><text x="304" y="146" font-size="11" text-anchor="end">tempo</text>';
 [[42,"80"],[75,"50"],[108,"20"]].forEach(function(a){s+='<line x1="37" y1="'+a[0]+'" x2="43" y2="'+a[0]+'" stroke="currentColor" stroke-width="1.5"/><text x="34" y="'+(a[0]+4)+'" font-size="10" text-anchor="end">'+a[1]+'</text>'});
 s+='<line x1="40" y1="75" x2="300" y2="75" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3" opacity=".7"/><text x="298" y="100" font-size="11" font-weight="700" text-anchor="end">equilíbrio: 50 °C</text>';
 s+='<path class="cq" pathLength="1" d="M50 42C100 58 140 72 280 75" fill="none" stroke="var(--f-verm)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="1 1"/><path class="cf" pathLength="1" d="M50 108C100 92 140 78 280 75" fill="none" stroke="var(--f-agua)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="1 1"/>';
 s+='<text class="lq" x="56" y="34" font-size="11" font-weight="700">água quente: 100 g, 80 °C</text><text class="lf" x="56" y="124" font-size="11" font-weight="700">água fria: 100 g, 20 °C</text>';
 tr.push(N.pr(".cq",T,"strokeDashoffset",[[0,1],[1.4,1],[5.4,0]],"ease-out"),N.pr(".cf",T,"strokeDashoffset",[[0,1],[1.4,1],[5.4,0]],"ease-out"));
 var c=N.cap(["Mistura isolada: a água quente cede calor|e a água fria recebe","Mesma massa e mesmo calor específico:|a variação de T é igual nas duas","Tf = (80 + 20) ÷ 2 = 50 °C"],[0,1.4,5.6],T,170);
 N.reg("equil_termico",{a:"Animação: ao misturar 100 g de água a 80 graus com 100 g de água a 20 graus, a quente esfria e a fria esquenta até a temperatura de equilíbrio de 50 graus",h:190,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* ================= PRIORIDADE BAIXA ================= */
/* ---------- condução ---------- */
(function(){var T=9,tr=[],s='';
 s+='<rect x="30" y="64" width="260" height="26" rx="4" fill="#8d99ad" stroke="currentColor" stroke-width="2"/><rect class="hb" x="30" y="64" width="260" height="26" rx="4" fill="var(--f-calor)" opacity=".7" style="transform-box:fill-box;transform-origin:left center"/>';
 s+='<path d="M24 128C12 112 26 106 20 92C34 102 42 116 34 128Z" fill="var(--f-calor)" stroke="currentColor" stroke-width="1.5"/><text x="30" y="148" text-anchor="middle" font-size="11" font-weight="700">chama</text><text x="288" y="112" text-anchor="end" font-size="11" font-weight="700">extremidade fria</text>';
 for(var i=0;i<8;i++){var x=50+i*32;s+='<circle class="pt p'+i+'" cx="'+x+'" cy="77" r="4.5" fill="var(--surface)" stroke="currentColor" stroke-width="1.5"/>';
  tr.push(["kf",".p"+i,[{offset:0,transform:"translate(0px,0px)"},{offset:.5,transform:"translate(3px,0px)"},{offset:1,transform:"translate(-3px,0px)"}],(i*.55+.5)*1000,260,Infinity])}
 for(var j=0;j<8;j++)tr.push(N.op(".p"+j,T,[[0,0],[.5+j*.55,0],[.8+j*.55,1]]));
 tr.push(N.sc(".hb",T,[[0,.02,1],[.5,.02,1],[6.8,1,1]],"linear"));
 var c=N.cap(["Barra metálica com uma extremidade na chama","As partículas que recebem energia vibram mais|e passam a energia às vizinhas","O calor se propaga pelo material, sem que o|material se desloque: condução"],[0,.8,4.6],T,168);
 N.reg("conducao",{a:"Animação: uma extremidade de uma barra metálica é aquecida; a agitação das partículas passa de uma para outra e o calor se propaga ao longo da barra, sem deslocamento de matéria, o que é a condução térmica",h:188,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- Sol → Terra ---------- */
(function(){var T=9,tr=[],s='';
 s+='<circle cx="46" cy="76" r="30" fill="var(--f-calor)" stroke="currentColor" stroke-width="2"/><text x="46" y="122" text-anchor="middle" font-size="11" font-weight="700" dy="22">Sol</text>';
 s+='<circle cx="284" cy="76" r="16" fill="var(--f-agua)" stroke="currentColor" stroke-width="2"/><text x="284" y="120" text-anchor="middle" font-size="11" font-weight="700">Terra</text>';
 s+='<rect x="92" y="20" width="164" height="112" rx="8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/><text x="174" y="38" text-anchor="middle" font-size="11" font-weight="700">vácuo</text>';
 [56,76,96].forEach(function(y,i){var d='M100 '+y;for(var k=0;k<5;k++)d+='q9 -8 18 0t18 0';
  s+='<path class="wv w'+i+'" pathLength="1" d="'+d.replace(/t18 0/g,'t18 0')+'" fill="none" stroke="var(--f-calor)" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 1"/>';
  tr.push(N.pr(".w"+i,T,"strokeDashoffset",[[0,1],[1.4+i*.5,1],[4.6+i*.5,0]],"linear"))});
 s+='<text class="ir" x="174" y="150" text-anchor="middle" font-size="12" font-weight="700">ondas eletromagnéticas: irradiação</text>';
 tr.push(N.vis(".ir",T,5.4));
 var c=N.cap(["O Sol e a Terra estão separados|pelo vácuo","Sem matéria entre eles, não há condução|nem convecção","O calor chega por ondas eletromagnéticas,|que se propagam no vácuo: irradiação"],[0,1.2,4.6],T,176);
 N.reg("sol_terra",{a:"Animação: entre o Sol e a Terra há vácuo; o calor chega até nós por ondas eletromagnéticas, que se propagam no vácuo, processo chamado de irradiação térmica",h:196,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- garrafa térmica ---------- */
(function(){var T=10,tr=[],s='';
 s+='<rect x="88" y="34" width="144" height="116" rx="16" fill="var(--f-vidro)" fill-opacity=".4" stroke="currentColor" stroke-width="3"/><rect x="104" y="42" width="112" height="100" rx="10" fill="#c7d2e6" fill-opacity=".5" stroke="currentColor" stroke-width="2.5"/>';
 s+='<rect x="106" y="62" width="108" height="78" rx="8" fill="var(--f-calor)" opacity=".45"/>';
 s+='<rect x="130" y="16" width="60" height="20" rx="5" fill="#8d99ad" stroke="currentColor" stroke-width="2.5"/><rect x="124" y="94" width="44" height="16" rx="4" fill="#fdfdfd"/><text x="146" y="106" font-size="11" font-weight="700" text-anchor="middle" style="fill:#14161a">quente</text>';
 s+='<text x="96" y="92" font-size="9" text-anchor="middle" transform="rotate(-90 96 92)">vácuo</text>';
 s+=N.arrow(180,203,100,"an-a2 c1",3)+'<text class="x1" x="222" y="105" text-anchor="middle" font-size="18" font-weight="700" fill="var(--neg)">✕</text>';
 s+=N.arrow(130,110,72,"an-a2 c2",3)+N.arrow(112,134,80,"an-a1 c3",3);
 s+=N.varrow(160,58,42,"an-a2 c4",3)+'<text class="x4" x="160" y="12" text-anchor="middle" font-size="16" font-weight="700" fill="var(--neg)">✕</text>';
 tr.push(N.vis(".c1",T,.6),N.vis(".x1",T,2.4),N.vis(".c2",T,3.4),N.vis(".c3",T,4.6),N.vis(".c4",T,6.6),N.vis(".x4",T,8));
 var c=N.cap(["Parede dupla com vácuo entre as paredes:|a condução é bloqueada","Paredes espelhadas refletem de volta|o calor irradiado","A tampa impede a convecção:|o calor quase não escapa"],[0,3.2,6.4],T,176);
 N.reg("garrafa",{a:"Animação: a garrafa térmica tem parede dupla com vácuo, que bloqueia a condução; paredes espelhadas, que refletem a irradiação; e tampa, que impede a convecção, mantendo o líquido quente",h:196,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- termômetro de mercúrio ---------- */
(function(){var T=8,tr=[],s='';
 s+=sol(262,122);
 s+='<rect x="150" y="16" width="20" height="112" rx="10" fill="var(--f-vidro)" fill-opacity=".5" stroke="currentColor" stroke-width="2.5"/><circle cx="160" cy="138" r="17" fill="var(--f-vidro)" fill-opacity=".5" stroke="currentColor" stroke-width="2.5"/><circle cx="160" cy="138" r="12" class="an-hg"/>';
 s+='<rect class="hg an-hg" x="156" y="40" width="8" height="96" style="transform-box:fill-box;transform-origin:center bottom"/>';
 for(var y=30;y<=120;y+=15)s+='<line x1="140" y1="'+y+'" x2="148" y2="'+y+'" stroke="currentColor" stroke-width="1.5"/>';
 tr.push(N.sc(".hg",T,[[0,1,.5],[1.6,1,.5],[5.6,1,1]]),N.vis(".sun",T,1.4));
 s+='<text class="ml" x="182" y="46" font-size="12" font-weight="700">mercúrio sobe</text>';
 tr.push(N.vis(".ml",T,5));
 var c=N.cap(["Termômetro em equilíbrio com o ambiente","Ao receber calor, o mercúrio dilata|bem mais que o vidro","A coluna sobe pelo tubo estreito:|sua altura indica a temperatura"],[0,1.4,4.6],T,184);
 N.reg("termometro",{a:"Animação: ao receber calor o mercúrio de um termômetro dilata mais que o vidro e a coluna sobe pelo tubo estreito, e a altura da coluna indica a temperatura",h:204,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- dilatação aparente do líquido ---------- */
(function(){var T=9,tr=[],s='';
 s+=sol(262,130);
 s+='<circle cx="160" cy="112" r="40" class="an-w"/><rect class="an-w lq" x="151" y="34" width="18" height="46" style="transform-box:fill-box;transform-origin:center bottom"/>';
 s+='<path d="M150 28V76A40 40 0 1 0 170 76V28" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>';
 tr.push(N.sc(".lq",T,[[0,1,.5],[1.6,1,.5],[5,1,1]]),N.vis(".sun",T,1.4));
 [[176,24],[184,36],[190,52]].forEach(function(p,i){s+='<circle class="dr d'+i+'" cx="'+p[0]+'" cy="'+p[1]+'" r="3.5" class="an-w"/>';
  tr.push(N.tr(".d"+i,T,[[0,0,0],[5+i*.4,0,0],[6.6+i*.4,6,52]]),N.op(".d"+i,T,[[0,0],[5+i*.4,0],[5.1+i*.4,1],[6.4+i*.4,1],[6.7+i*.4,0]]))});
 s=s.replace(/<circle class="dr d(\d)" cx="(\d+)" cy="(\d+)" r="3.5" class="an-w"\/>/g,'<circle class="dr d$1 an-w" cx="$2" cy="$3" r="3.5" opacity="0"/>');
 s+='<text class="tv" x="190" y="30" font-size="11" font-weight="700">transborda</text>';
 tr.push(N.vis(".tv",T,5.4));
 var c=N.cap(["Frasco de vidro cheio de líquido","Ao aquecer, o frasco e o líquido dilatam;|o líquido dilata mais","O excesso transborda: a dilatação aparente|é a do líquido menos a do frasco"],[0,1.4,5],T,184);
 N.reg("frasco",{a:"Animação: um frasco cheio de líquido é aquecido; frasco e líquido dilatam, mas o líquido dilata mais e o excesso transborda, e por isso a dilatação aparente é a do líquido menos a do frasco",h:204,s:s+c.s,t:tr.concat(c.t),T:T})})();
})();

/* ---------- resoluções passo a passo das questões de cálculo (t086 a t097) ---------- */
(function(){"use strict";
var N=window.AN,H=186,CY=140,AG="var(--f-agua)",VM="var(--f-verm)",CA="var(--f-calor)";
function sb(t){return N.sb(t)}
function axes(){return'<path d="M36 10V108H300" fill="none" stroke="currentColor" stroke-width="2"/><text x="40" y="12" font-size="11">T</text><text x="298" y="122" font-size="11" text-anchor="end">calor</text>'}
function seg(x1,y1,x2,y2,c,cl){return'<line class="'+(cl||"")+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="4.5" stroke-linecap="round"/>'}
/* t086: gelo a −10 °C até água a 20 °C */
N.calc("calc_t086","Animação passo a passo: para levar 200 gramas de gelo a menos 10 graus até água a 20 graus são necessários 1000 calorias para aquecer o gelo, 16000 para fundir e 4000 para aquecer a água, ou seja, 21000 calorias",{h:H,cy:CY,
 s:axes()+'<text x="32" y="43" font-size="10" text-anchor="end">20</text><text x="32" y="75" font-size="10" text-anchor="end">0</text><text x="32" y="95" font-size="10" text-anchor="end">−10</text><line x1="36" y1="72" x2="300" y2="72" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="3 4"/>'+seg(44,92,60,72,AG)+'<g class="s2">'+seg(60,72,224,72,CA)+N.t(142,64,"fusão: Q₂",{s:11})+'</g><g class="s3">'+seg(224,72,282,40,VM)+N.t(268,60,"Q₃",{s:11})+'</g><text x="70" y="94" font-size="11" text-anchor="middle">Q₁</text>',
 steps:[[0,"Q₁: aquecer o gelo de −10 °C a 0 °C|Q₁ = 200 · 0,5 · 10 = 1 000 cal"],[3,"Q₂: fundir o gelo|Q₂ = 200 · 80 = 16 000 cal"],[6,"Q₃: aquecer a água de 0 °C a 20 °C|Q₃ = 200 · 1 · 20 = 4 000 cal"],[9,"Q = 1 000 + 16 000 + 4 000 = 21 000 cal"]]});
/* béquer com termômetro rotulado */
function bk(x,lv,f,l1,l2,cl){return N.bk(x,20,56,70,lv,f,cl)+N.t(x+28,106,l1,{s:11})+N.t(x+28,118,l2,{s:11})}
N.calc("calc_t087","Animação passo a passo: ao misturar 200 gramas de água a 90 graus com 300 gramas a 20 graus, em um recipiente isolado, a temperatura final é 48 graus",{h:H,cy:CY,
 s:bk(24,.55,VM,"200 g","90 °C")+N.t(98,62,"+",{s:20})+bk(116,.8,AG,"300 g","20 °C")+'<g class="s4">'+N.t(206,62,"=",{s:20})+bk(232,.9,"#b58fc9","500 g","48 °C")+'</g>',
 steps:[[0,"Sistema isolado:|calor cedido + calor recebido = 0"],[3,"200 · 1 · (T − 90) + 300 · 1 · (T − 20) = 0"],[6,"500 · T = 18 000 + 6 000"],[8.6,"T = 24 000 / 500 = 48 °C"]]});
N.calc("calc_t098","Animação passo a passo: ao misturar 500 gramas de água a 80 graus com 1500 gramas a 20 graus, em um recipiente isolado, a temperatura final é 35 graus",{h:H,cy:CY,
 s:bk(24,.35,VM,"500 g","80 °C")+N.t(98,62,"+",{s:20})+bk(116,.9,AG,"1 500 g","20 °C")+'<g class="s4">'+N.t(206,62,"=",{s:20})+bk(232,1,"#b58fc9","2 000 g","35 °C")+'</g>',
 steps:[[0,"Sistema isolado:|calor cedido + calor recebido = 0"],[3,"500 · 1 · (T − 80) + 1 500 · 1 · (T − 20) = 0"],[6,"2 000 · T = 40 000 + 30 000"],[8.6,"T = 70 000 / 2 000 = 35 °C"]]});
N.calc("calc_t088","Animação passo a passo: um bloco metálico de 100 gramas a 200 graus é colocado em 200 gramas de água a 20 graus e o equilíbrio ocorre a 30 graus; o calor específico do metal é cerca de 0,12 caloria por grama e por grau",{h:H,cy:CY,
 s:N.bk(100,38,120,60,.7,AG)+'<g class="blk"><rect x="140" y="66" width="40" height="24" rx="3" fill="#8b95a5" stroke="currentColor" stroke-width="2"/>'+'<text x="160" y="83" text-anchor="middle" font-size="11" style="fill:#14161a">100 g</text></g>'+N.t(160,30,"200 °C → 30 °C",{s:11})+N.t(50,60,"água",{s:11})+N.t(50,72,"200 g, 20 °C",{s:10})+'<g class="s2">'+N.arrow(186,214,78,"an-a2",3)+'</g>',
 tr:[N.tr(".blk",11.8,[[0,0,-52],[2.4,0,-52],[3.6,0,0]],"linear")],
 steps:[[0,"Bloco quente (100 g, 200 °C) na água|(200 g, 20 °C). Equilíbrio em 30 °C"],[3,"Calor cedido pelo bloco = calor recebido pela água"],[5.6,"100 · c · (200 − 30) = 200 · 1 · (30 − 20)"],[8.2,"17 000 · c = 2 000 → c ≈ 0,12 cal/g·°C"]]});
(function(){var pivot=function(t){return t};
 N.calc("calc_t089","Animação passo a passo: uma barra de 5 metros, com coeficiente de dilatação linear de 1,2 vezes 10 elevado a menos 5, aquecida de 20 a 120 graus, aumenta 6 milímetros de comprimento",{h:H,cy:CY,
 s:'<rect x="40" y="46" width="200" height="26" fill="#8d99ad" stroke="currentColor" stroke-width="2"/><rect class="ext" x="240" y="46" width="30" height="26" fill="var(--f-calor)" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:0 50%"/>'+N.dm(40,240,100,"L₀ = 5 m")+'<g class="s2">'+N.dm(240,270,36,"ΔL")+'</g>'+N.t(110,38,"20 °C",{s:11,c:"t0",o:0})+N.t(110,38,"120 °C",{s:11,c:"t1"})+'<line x1="270" y1="40" x2="270" y2="80" stroke="currentColor" stroke-dasharray="3 3" stroke-opacity=".5"/>'+N.t(160,118,"(ΔL fora de escala)",{s:10}),
 tr:[N.sc(".ext",11.8,[[0,0,1],[2.4,0,1],[6.2,1,1]],"linear"),N.op(".t0",11.8,[[0,1],[2.4,1],[2.6,0]]),N.op(".t1",11.8,[[0,0],[2.4,0],[2.6,1]])],
 steps:[[0,"Barra: L₀ = 5 m e α = 1,2·10⁻⁵ °C⁻¹,|aquecida de 20 °C a 120 °C (ΔT = 100 °C)"],[3,"ΔL = L₀ · α · ΔT"],[5.6,"ΔL = 5 · 1,2·10⁻⁵ · 100"],[8.2,"ΔL = 6·10⁻³ m = 6 mm"]]})})();
N.calc("calc_t090","Animação passo a passo: uma chapa de 2 metros quadrados, com coeficiente linear de 2 vezes 10 elevado a menos 5, aquecida em 50 graus, aumenta 4 vezes 10 elevado a menos 3 metros quadrados, ou 40 centímetros quadrados",{h:H,cy:CY,
 s:'<rect x="116" y="18" width="88" height="88" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/><rect class="pl" x="120" y="22" width="80" height="80" fill="#8d99ad" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:50% 50%"/>'+N.t(160,66,"A₀ = 2 m²",{s:12,f:"#14161a"})+N.t(250,60,"ΔT = 50 °C",{s:11})+N.t(60,60,"(fora de escala)",{s:9}),
 tr:[N.sc(".pl",11.8,[[0,.92,.92],[2.4,.92,.92],[6,1.1,1.1]],"linear")],
 steps:[[0,"Chapa: A₀ = 2 m², α = 2·10⁻⁵ °C⁻¹|ΔT = 50 °C"],[3,"Superficial: β = 2α = 4·10⁻⁵ °C⁻¹"],[5.6,"ΔA = A₀ · β · ΔT = 2 · 4·10⁻⁵ · 50"],[8.2,"ΔA = 4·10⁻³ m² = 40 cm²"]]});
N.calc("calc_t091","Animação passo a passo: um frasco de 500 centímetros cúbicos cheio de líquido é aquecido 40 graus; como o líquido dilata mais que o frasco, 16 centímetros cúbicos transbordam",{h:H,cy:CY,
 s:'<circle cx="160" cy="76" r="34" fill="var(--f-agua)" fill-opacity=".6" stroke="currentColor" stroke-width="2.5"/><rect x="152" y="14" width="16" height="30" fill="var(--bg)" stroke="none"/><path d="M152 12V44M168 12V44" stroke="currentColor" stroke-width="2.5"/><rect x="153" y="12" width="14" height="40" fill="var(--f-agua)" fill-opacity=".6"/>'+N.t(160,80,"500 cm³",{s:11})+'<g class="s4"><circle class="dr" cx="160" cy="6" r="3.5" fill="var(--f-agua)" stroke="currentColor" stroke-width="1.2"/><circle class="dr2" cx="172" cy="10" r="3.5" fill="var(--f-agua)" stroke="currentColor" stroke-width="1.2"/>'+N.t(228,22,"16 cm³",{a:"start",s:11})+'</g>'+N.t(240,86,"ΔT = 40 °C",{s:11}),
 tr:[N.tr(".dr",12.4,[[0,0,0],[8.8,0,0],[10.4,-8,40]],"linear"),N.tr(".dr2",12.4,[[0,0,0],[9.2,0,0],[10.8,10,38]],"linear")],
 steps:[[0,"Frasco (500 cm³) cheio, aquecido em 40 °C.|O líquido dilata mais que o frasco"],[3,"Dilatação aparente: γ"+sb("ap")+" = γ"+sb("líq")+" − γ"+sb("frasco")+"|γ"+sb("ap")+" = 1,0·10⁻³ − 0,2·10⁻³ = 0,8·10⁻³ °C⁻¹"],[6.2,"ΔV = V₀ · γ"+sb("ap")+" · ΔT = 500 · 0,8·10⁻³ · 40"],[8.8,"ΔV = 16 cm³ transbordam"]]});
N.calc("calc_t092","Animação passo a passo: 104 graus Fahrenheit correspondem a 40 graus Celsius e a 313 kelvins",{h:H,cy:CY,
 s:'<rect x="20" y="32" width="72" height="50" rx="8" class="an-rp"/>'+N.t(56,54,"104",{s:18})+N.t(56,72,"°F",{s:12})+'<g class="s2">'+N.arrow(98,122,57,"an-a3",3)+'<rect x="124" y="32" width="72" height="50" rx="8" class="an-rn"/>'+N.t(160,54,"40",{s:18})+N.t(160,72,"°C",{s:12})+'</g><g class="s3">'+N.arrow(202,226,57,"an-a3",3)+'<rect x="228" y="32" width="72" height="50" rx="8" fill="var(--ok)" fill-opacity=".2" stroke="var(--ok)" stroke-width="2"/>'+N.t(264,54,"313",{s:18})+N.t(264,72,"K",{s:12})+'</g>',
 steps:[[0,"Converter 104 °F para kelvin"],[2.8,"Celsius: TC / 5 = (TF − 32) / 9|TC = (104 − 32) · 5 / 9 = 40 °C"],[5.8,"Kelvin: TK = TC + 273 = 40 + 273"],[8.4,"TK = 313 K"]]});
N.calc("calc_t093","Animação passo a passo: um aquecedor de 500 watts aquece 2 quilogramas de água de 20 a 70 graus, o que exige 420000 joules, e leva 840 segundos, ou 14 minutos",{h:H,cy:CY,
 s:N.bk(100,18,120,60,.75,AG)+'<rect x="112" y="86" width="96" height="14" rx="4" fill="#f4b266" stroke="currentColor" stroke-width="2"/>'+N.t(160,97,"500 W",{s:11,f:"#14161a"})+N.t(160,52,"2 kg de água",{s:11})+N.t(250,40,"20 °C",{s:12,c:"t0",o:0})+N.t(250,40,"70 °C",{s:12,c:"t1"})+'<g class="s4">'+N.t(250,70,"14 min",{s:14})+'</g>',
 tr:[N.op(".t0",12,[[0,1],[3,1],[3.4,0]]),N.op(".t1",12,[[0,0],[3,0],[3.4,1]])],
 steps:[[0,"Aquecedor de 500 W: 2 kg de água|de 20 °C a 70 °C (ΔT = 50 °C)"],[3,"Q = m · c · ΔT = 2 · 4 200 · 50 = 420 000 J"],[5.8,"Potência: P = Q / t → t = Q / P"],[8.4,"t = 420 000 / 500 = 840 s = 14 min"]]});
N.calc("calc_t094","Animação passo a passo: 100 gramas de vapor a 100 graus se condensam, liberando 54000 calorias, e a água esfria até 60 graus, liberando mais 4000 calorias, num total de 58000 calorias",{h:H,cy:CY,
 s:axes()+'<line x1="36" y1="34" x2="300" y2="34" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="3 4"/><text x="32" y="38" font-size="10" text-anchor="end">100</text><text x="32" y="86" font-size="10" text-anchor="end">60</text>'+seg(48,34,218,34,CA)+N.t(133,26,"condensação: Q₁",{s:11})+'<g class="s2">'+seg(218,34,274,84,AG)+N.t(262,66,"Q₂",{s:11})+'</g>'+N.t(60,52,"vapor",{s:11,a:"start"}),
 steps:[[0,"Vapor a 100 °C se condensa (cede calor)|Q₁ = m · L = 100 · 540 = 54 000 cal"],[3.2,"A água esfria de 100 °C a 60 °C|Q₂ = m · c · ΔT = 100 · 1 · 40 = 4 000 cal"],[6.4,"Q = 54 000 + 4 000"],[8.8,"Q = 58 000 cal liberadas"]]});
N.calc("calc_t095","Animação passo a passo: um corpo de 400 gramas com calor específico de 0,25 caloria por grama e por grau recebe 3000 calorias e sua temperatura sobe 30 graus",{h:H,cy:CY,
 s:'<rect x="90" y="40" width="70" height="50" rx="4" fill="#8d99ad" stroke="currentColor" stroke-width="2"/>'+N.t(125,60,"400 g",{s:12,f:"#14161a"})+N.t(125,76,"c = 0,25",{s:11,f:"#14161a"})+N.arrow(30,84,66,"an-a2",3.5)+N.t(50,56,"3 000 cal",{s:11})+'<rect x="226" y="14" width="14" height="84" rx="7" fill="none" stroke="currentColor" stroke-width="2"/><rect class="mr" x="229" y="40" width="8" height="56" rx="4" fill="var(--f-verm)" style="transform-box:fill-box;transform-origin:50% 100%"/>'+'<g class="s4">'+N.t(256,60,"+30 °C",{a:"start",s:12})+'</g>',
 tr:[N.sc(".mr",11.8,[[0,1,.45],[2.6,1,.45],[7,1,1]],"linear")],
 steps:[[0,"Corpo de 400 g, c = 0,25 cal/g·°C,|recebe Q = 3 000 cal"],[3,"Q = m · c · ΔT → ΔT = Q / (m · c)"],[5.6,"ΔT = 3 000 / (400 · 0,25) = 3 000 / 100"],[8.2,"ΔT = 30 °C"]]});
N.calc("calc_t096","Animação passo a passo: pela vidraça de 1,5 metro quadrado, 5 milímetros de espessura e condutividade de 0,8, com diferença de temperatura de 10 graus, o fluxo de calor por condução é 2400 watts",{h:H,cy:CY,
 s:'<rect x="60" y="20" width="60" height="80" fill="var(--f-verm)" fill-opacity=".25"/><rect x="200" y="20" width="60" height="80" fill="var(--f-agua)" fill-opacity=".3"/><rect x="152" y="14" width="16" height="92" fill="var(--f-vidro)" stroke="currentColor" stroke-width="2.5"/>'+N.t(90,64,"quente",{s:12})+N.t(230,64,"frio",{s:12})+N.arrow(100,196,44,"an-a2",3.5)+N.arrow(100,196,76,"an-a2",3.5)+N.t(160,13,"e = 5 mm",{s:11})+N.t(160,120,"A = 1,5 m²    ΔT = 10 °C",{s:11}),
 steps:[[0,"Condução pela vidraça: Φ = k · A · ΔT / L|k = 0,8; A = 1,5 m²; ΔT = 10 °C; L = 0,005 m"],[3.2,"Φ = 0,8 · 1,5 · 10 / 0,005"],[6,"Φ = 12 / 0,005"],[8.4,"Φ = 2 400 W"]]});
N.calc("calc_t097","Animação passo a passo: um recipiente de capacidade térmica de 50 calorias por grau com 250 gramas de água a 20 graus recebe 5000 calorias; a temperatura final é cerca de 36,7 graus",{h:H,cy:CY,
 s:N.bk(100,18,120,62,.75,AG)+N.t(160,50,"250 g de água",{s:11})+N.t(160,64,"C = 50 cal/°C",{s:11})+N.arrow(30,92,52,"an-a2",3.5)+N.t(56,40,"5 000 cal",{s:11})+N.t(262,48,"20 °C",{s:12,c:"t0",o:0})+N.t(262,48,"36,7 °C",{s:12,c:"t1"}),
 tr:[N.op(".t0",12,[[0,1],[5,1],[5.4,0]]),N.op(".t1",12,[[0,0],[5,0],[5.4,1]])],
 steps:[[0,"O calor aquece a água e o recipiente|Q = 5 000 cal; C = 50 cal/°C; m = 250 g"],[3,"Q = (C + m · c) · ΔT"],[5.6,"5 000 = (50 + 250 · 1) · ΔT → ΔT ≈ 16,7 °C"],[8.4,"T final = 20 + 16,7 ≈ 36,7 °C"]]});
})();
