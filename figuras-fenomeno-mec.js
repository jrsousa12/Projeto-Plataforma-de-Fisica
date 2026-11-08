/* Mecânica: simulações do FENÔMENO (substituem as resoluções passo a passo).
   O que muda no tempo vira gráfico: o traço é desenhado enquanto o corpo se move. */
(function(){"use strict";
var N=window.AN,t_=N.t,ACC="var(--acc)",NEG="var(--neg)",PI=Math.PI;
function f(n,d){var p=Math.pow(10,d===undefined?2:d);return String(Math.round(n*p)/p).replace(".",",")}
function r(n){return Math.round(n*10)/10}
var uid=0;

/* eixos: x0,y0 = origem; w,h = tamanho; xe/ye = valores nas pontas */
function axes(x0,y0,w,h,xl,yl,xe,ye,x0t){
 return'<path d="M'+x0+' '+(y0-h-4)+'V'+y0+'H'+(x0+w+4)+'" fill="none" stroke="currentColor" stroke-width="1.6"/>'+
  t_(x0+w,y0+13,xe+(xl?" "+xl:""),{s:10,a:"end"})+t_(x0-4,y0+4,x0t||"0",{s:10,a:"end"})+t_(x0-4,y0-h+4,ye,{s:10,a:"end"})+t_(x0+4,y0-h-8,yl,{s:11,a:"start"})}
/* traço que é desenhado com o tempo */
function curve(d,cls,col){return'<path class="'+cls+'" d="'+d+'" pathLength="1" fill="none" stroke="'+col+'" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:1;stroke-dashoffset:0"/>'}
function draw(cls,T,t0,t1){return N.pr("."+cls,T,"strokeDashoffset",[[t0,1],[t1,0]],"linear")}
/* área que cresce da esquerda para a direita: clipPath com retângulo escalado */
function area(id,cls,x,y,w,h,poly,col){return'<clipPath id="'+id+'"><rect class="'+cls+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" style="transform-box:fill-box;transform-origin:0 50%"/></clipPath><path d="'+poly+'" fill="'+col+'" fill-opacity=".28" clip-path="url(#'+id+')"/>'}
function grow(cls,T,t0,t1){return N.sc("."+cls,T,[[t0,0,1],[t1,1,1]],"linear")}
/* trilha de um ponto: fn(frac) -> [x,y]; o elemento fica desenhado na posição final */
function trk(sel,T,t0,D,fn,n){var e=fn(1),p=[],i,q;for(i=0;i<=n;i++){q=fn(i/n);p.push([t0+D*i/n,q[0]-e[0],q[1]-e[1]])}return N.tr(sel,T,p,"linear")}
function mk(key,alt,H,svg,tr,T,caps,times){var c=N.cap(caps,times,T,H-34);N.reg(key,{a:alt,h:H,s:svg+c.s,t:tr.concat(c.t),T:T})}
/* leitura que muda: n+1 amostras igualmente espaçadas */
function readout(cl,y,fn,n,t0,D,T){var vals=[],times=[],k;for(k=0;k<=n;k++){vals.push(fn(k/n));times.push(k?t0+D*k/n:0)}return N.seq(cl,160,y,vals,times,T,{s:12})}

/* ---- corpos ---- */
function car(col){return'<rect x="0" y="-18" width="44" height="12" rx="3" fill="'+(col||ACC)+'" fill-opacity=".55" stroke="currentColor" stroke-width="1.8"/><rect x="10" y="-26" width="22" height="9" rx="3" fill="'+(col||ACC)+'" fill-opacity=".3" stroke="currentColor" stroke-width="1.6"/><circle cx="10" cy="-5" r="5" fill="var(--surface)" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="-5" r="5" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>'}
function blk(x,w,lab,col){return'<rect x="'+x+'" y="-28" width="'+w+'" height="28" fill="'+(col||ACC)+'" fill-opacity=".4" stroke="currentColor" stroke-width="2"/>'+t_(x+w/2,-10,lab,{s:12})}
function arr(x1,x2,y,lab,col,ly){var d=x2>x1?1:-1;return'<line x1="'+x1+'" y1="'+y+'" x2="'+(x2-d*6)+'" y2="'+y+'" stroke="'+col+'" stroke-width="3"/><path d="M'+x2+' '+y+'L'+(x2-d*10)+' '+(y-5)+'L'+(x2-d*10)+' '+(y+5)+'Z" fill="'+col+'"/>'+t_((x1+x2)/2,y-(ly||9),lab,{s:11})}

/* ===== A. movimento retilíneo com aceleração constante: corpo + gráfico v×t (área = deslocamento) ===== */
function uv(key,alt,o){
 var x0=44,y0=118,w=232,h=92,T0=1.4,D=4,T=T0+D+3.4,H=268,v0=o.v0,a=o.a,tf=o.tf,vf=v0+a*tf,vm=Math.max(v0,vf),
  S=v0*tf+a*tf*tf/2,bw=o.bw,xs0=16,tr=288-bw,id="ar"+(++uid);
 function v(q){return v0+a*tf*q}function s(q){return v0*tf*q+a*tf*tf*q*q/2}
 function gx(q){return x0+w*q}function gy(vv){return y0-h*vv/vm}
 var xe=xs0+tr,svg='<line x1="10" y1="188" x2="310" y2="188" stroke="currentColor" stroke-width="2"/>'+
  '<g class="bd"><g transform="translate('+xe+' 188)">'+o.body+'</g></g>'+
  axes(x0,y0,w,h,"s",o.yl||"v (m/s)",f(tf),f(vm))+
  area(id,"ar",x0,y0-h-4,w,h+4,"M"+x0+" "+y0+"L"+x0+" "+gy(v0)+"L"+gx(1)+" "+gy(vf)+"L"+gx(1)+" "+y0+"Z",ACC)+
  curve("M"+x0+" "+gy(v0)+"L"+gx(1)+" "+gy(vf),"cv",ACC)+'<circle class="pt" cx="'+gx(1)+'" cy="'+gy(vf)+'" r="5" fill="'+NEG+'"/>';
 var T1=T0+D,tr_=[trk(".bd",T,T0,D,function(q){return[tr*(S?s(q)/S:q),0]},24),trk(".pt",T,T0,D,function(q){return[gx(q),gy(v(q))]},12),draw("cv",T,T0,T1),grow("ar",T,T0,T1)];
 var rd=readout("rd",214,function(q){return"t = "+f(tf*q)+" s  ·  v = "+f(v(q))+" m/s  ·  s = "+f(s(q))+" m"},4,T0,D,T);
 tr_=tr_.concat(rd.t);
 mk(key,alt,H,svg+rd.s,tr_,T,o.caps,[0,T0,T1+.2])}

/* ===== B. movimento vertical: bola + gráfico h×t ===== */
function vert(o){
 var x0=112,y0=196,w=188,h=150,T0=1.4,D=4,T=T0+D+3.4,H=272,y00=o.y0,v0=o.v0,tf=o.tf,hm=o.hm,id="ar"+(++uid);
 function y(q){return y00+v0*tf*q-5*tf*tf*q*q}function vv(q){return v0-10*tf*q}
 function gx(q){return x0+w*q}function gy(m){return y0-h*m/hm}
 var d="",i;for(i=0;i<=24;i++)d+=(i?"L":"M")+r(gx(i/24))+" "+r(gy(y(i/24)))+" ";
 var bx=58,svg='<line x1="20" y1="'+y0+'" x2="96" y2="'+y0+'" stroke="currentColor" stroke-width="2"/>'+(o.tower?'<rect x="30" y="'+gy(y00)+'" width="16" height="'+(y0-gy(y00))+'" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.6"/>':'')+
  '<g class="bl"><circle cx="'+bx+'" cy="'+(gy(y(1))-7)+'" r="7" fill="'+ACC+'" stroke="currentColor" stroke-width="2"/></g>'+
  axes(x0,y0,w,h,"s","h (m)",f(tf),f(hm))+curve(d,"cv",ACC)+'<circle class="pt" cx="'+gx(1)+'" cy="'+gy(y(1))+'" r="5" fill="'+NEG+'"/>';
 var T1=T0+D,tr=[trk(".bl",T,T0,D,function(q){return[0,gy(y(q))-gy(y(1))]},24),trk(".pt",T,T0,D,function(q){return[gx(q),gy(y(q))]},24),draw("cv",T,T0,T1)];
 var rd=readout("rd",226,function(q){return"t = "+f(tf*q)+" s  ·  h = "+f(y(q))+" m  ·  v = "+f(Math.abs(vv(q)))+" m/s"},4,T0,D,T);
 mk(o.key,o.alt,H,svg+rd.s,tr.concat(rd.t),T,o.caps,[0,T0,T1+.2])}

/* ===== C. movimento uniforme: corpos + gráfico s×t ===== */
function mu(key,alt,o){
 var x0=44,y0=118,w=232,h=92,T0=1.4,D=4,T=T0+D+3.4,H=268,L=o.L,tf=o.tf,bw=44,xs0=16,tr=288-2*bw,svg='<line x1="10" y1="188" x2="310" y2="188" stroke="currentColor" stroke-width="2"/>',tracks=[],i,c;
 function gx(q){return x0+w*q}function gy(s){return y0-h*s/L}
 function pos(c,q){return c.s0+c.v*tf*q}
 svg+=axes(x0,y0,w,h,o.tl,o.yl,f(tf),f(L));
 o.cars.forEach(function(c,i){
  svg+='<g class="bd'+i+'"><g transform="translate('+(xs0+bw+tr*pos(c,1)/L+(c.v<0?bw:-bw))+' 188)'+(c.v<0?' scale(-1 1)':'')+'">'+car(c.col)+'</g></g>'+curve("M"+gx(0)+" "+gy(c.s0)+"L"+gx(1)+" "+gy(pos(c,1)),"cv"+i,c.col)+'<circle class="pt'+i+'" cx="'+gx(1)+'" cy="'+gy(pos(c,1))+'" r="5" fill="'+c.col+'"/>';
  tracks.push(trk(".bd"+i,T,T0,D,function(q){return[tr*(pos(c,q)-pos(c,1))/L,0]},12),trk(".pt"+i,T,T0,D,function(q){return[gx(q),gy(pos(c,q))]},12),draw("cv"+i,T,T0,T0+D))});
 if(o.meet)svg+='<g class="mt"><circle cx="'+gx(1)+'" cy="'+gy(o.meet)+'" r="9" fill="none" stroke="'+NEG+'" stroke-width="2.2"/></g>',tracks.push(N.vis(".mt",T,T0+D));
 var rd=readout("rd",214,o.rd,4,T0,D,T);
 mk(key,alt,H,svg+rd.s,tracks.concat(rd.t),T,o.caps,[0,T0,T0+D+.2])}

/* ===== D. lançamento de projéteis ===== */
function proj(key,alt,o){
 var g=10,vx=o.vx,vy=o.vy,y0=o.y0||0,tf=(vy+Math.sqrt(vy*vy+2*g*y0))/g,xm=vx*tf,ym=y0+vy*vy/(2*g),
  k=Math.min(250/xm,(o.vec?96:120)/ym),ox=40,gy=o.vec?176:170,T0=1.4,D=4,T=T0+D+3.4,H=o.vec?278:262;
 function X(q){return ox+k*vx*tf*q}function Y(q){return gy-k*(y0+vy*tf*q-g*tf*tf*q*q/2)}
 var d="",i,svg='<line x1="10" y1="'+gy+'" x2="312" y2="'+gy+'" stroke="currentColor" stroke-width="2"/>';
 if(y0)svg+='<rect x="'+(ox-26)+'" y="'+(gy-k*y0)+'" width="26" height="'+(k*y0)+'" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.6"/>';
 for(i=0;i<=28;i++)d+=(i?"L":"M")+r(X(i/28))+" "+r(Y(i/28))+" ";
 svg+=curve(d,"cv",ACC)+'<g class="bl"><circle cx="'+X(1)+'" cy="'+Y(1)+'" r="6" fill="'+ACC+'" stroke="currentColor" stroke-width="2"/></g>';
 if(o.vec){var sc=.9,ex=ox+vx*sc,ey=Y(0)-vy*sc;svg+='<line x1="'+ox+'" y1="'+Y(0)+'" x2="'+ex+'" y2="'+Y(0)+'" stroke="currentColor" stroke-dasharray="4 3"/><line x1="'+ex+'" y1="'+Y(0)+'" x2="'+ex+'" y2="'+ey+'" stroke="currentColor" stroke-dasharray="4 3"/>'+
  arr(ox,ex,Y(0),"",NEG).replace(/<text.*$/,"")+t_(ex+3,(Y(0)+ey)/2+4,o.vyl,{s:12,a:"start"})+t_((ox+ex)/2,Y(0)+14,o.vxl,{s:12})}
 svg+='<g class="dm">'+t_((ox+X(1))/2,gy+18,o.dim,{s:12})+'</g>';
 var tr=[trk(".bl",T,T0,D,function(q){return[X(q),Y(q)]},28),draw("cv",T,T0,T0+D),N.vis(".dm",T,T0+D)];
 var rd=readout("rd",H-52,function(q){return"t = "+f(tf*q)+" s  ·  x = "+f(vx*tf*q)+" m  ·  y = "+f(y0+vy*tf*q-g*tf*tf*q*q/2)+" m"},4,T0,D,T);
 mk(key,alt,H,svg+rd.s,tr.concat(rd.t),T,o.caps,[0,T0,T0+D+.2])}
/* o ponto fica em (0,0) antes de mover: corrige o deslocamento relativo */

/* ===== F. movimento circular ===== */
function circ(key,alt,o){
 var T0=1.4,D=4,T=T0+D+3.4,H=226,cx=o.graph?72:160,cy=82,R=44,id="ar"+(++uid),
  svg='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="2"/><circle cx="'+cx+'" cy="'+cy+'" r="2.5" fill="currentColor"/>',tr=[];
 svg+='<g class="rt" style="transform-origin:'+cx+'px '+cy+'px"><circle cx="'+(cx+R)+'" cy="'+cy+'" r="7" fill="'+ACC+'" stroke="currentColor" stroke-width="2"/>'+
  (o.arrows?'<line x1="'+(cx+R)+'" y1="'+cy+'" x2="'+(cx+R)+'" y2="'+(cy-32)+'" stroke="'+NEG+'" stroke-width="3"/><path d="M'+(cx+R)+' '+(cy-40)+'L'+(cx+R-5)+' '+(cy-30)+'L'+(cx+R+5)+' '+(cy-30)+'Z" fill="'+NEG+'"/>'+
   (o.arrows===1?'<line x1="'+(cx+R)+'" y1="'+cy+'" x2="'+(cx+R-30)+'" y2="'+cy+'" stroke="currentColor" stroke-width="3"/><path d="M'+(cx+R-38)+' '+cy+'L'+(cx+R-28)+' '+(cy-5)+'L'+(cx+R-28)+' '+(cy+5)+'Z" fill="currentColor"/>':''):'')+'</g>';
 tr.push(N.rot(".rt",T,[[T0,-360*o.turns],[T0+D,0]],"linear"));
 if(o.graph){var x0=162,y0=128,w=132,h=96,gx=function(q){return x0+w*q},gy=function(q){return y0-h*q};
  svg+=axes(x0,y0,w,h,o.xl,o.yl,o.xe,o.ye)+area(id,"ar",x0,y0-h-4,w,h+4,"M"+x0+" "+y0+"L"+gx(1)+" "+gy(1)+"L"+gx(1)+" "+y0+"Z",ACC)+curve("M"+x0+" "+y0+"L"+gx(1)+" "+gy(1),"cv",ACC)+'<circle class="pt" cx="'+gx(1)+'" cy="'+gy(1)+'" r="5" fill="'+NEG+'"/>';
  tr.push(draw("cv",T,T0,T0+D),trk(".pt",T,T0,D,function(q){return[gx(q),gy(q)]},12))}
 else svg+=t_(46,24,o.leg1,{s:12,a:"start",f:NEG})+t_(46,40,o.leg2,{s:12,a:"start"});
 var rd=readout("rd",166,o.rd,o.n,T0,D,T);
 mk(key,alt,H,svg+rd.s,tr.concat(rd.t),T,o.caps,[0,T0,T0+D+.2])}

/* ===== G. impulso: força média durante o contato, área do gráfico F×t ===== */
function imp(key,alt,o){
 var x0=44,y0=186,w=232,h=84,T0=1.4,D=3.6,T=T0+D+3.6,H=272,id="ar"+(++uid),fr=.5,gx=function(q){return x0+w*q},gy=y0-h;
 var bx=70,svg='<line x1="10" y1="70" x2="310" y2="70" stroke="currentColor" stroke-width="2"/>'+
  '<g class="bl"><g transform="translate('+(bx+84)+' 0)"><circle cx="0" cy="58" r="12" fill="'+ACC+'" fill-opacity=".6" stroke="currentColor" stroke-width="2"/></g></g>'+
  '<g class="fa">'+arr(bx-34,bx-10,58,o.Fl,NEG)+'</g>'+(o.vl?'<g class="va">'+arr(bx+94,bx+144,58,o.vl,"currentColor").replace(/y1="58"/,'y1="58"')+'</g>':'')+
  axes(x0,y0,w,h,"s","F (N)",o.tl,o.Fl.replace(" N",""))+
  area(id,"ar",x0,y0-h-4,w,h+4,"M"+x0+" "+y0+"L"+x0+" "+gy+"L"+gx(fr)+" "+gy+"L"+gx(fr)+" "+y0+"Z",ACC)+
  curve("M"+x0+" "+y0+"L"+x0+" "+gy+"L"+gx(fr)+" "+gy+"L"+gx(fr)+" "+y0+"L"+gx(1)+" "+y0,"cv",ACC)+t_(gx(fr/2),gy+(y0-gy)/2+4,"área = "+o.imp,{s:13,f:"var(--ink,currentColor)"});
 var tr=[draw("cv",T,T0,T0+D),grow("ar",T,T0,T0+D*fr),N.vis(".fa",T,T0,T0+D*fr),
  N.tr(".bl",T,[[T0,-84,0],[T0+D*fr,-84+8,0],[T0+D,0,0]],"linear")];
 if(o.vl)tr.push(N.vis(".va",T,T0+D*fr));
 mk(key,alt,H,svg,tr,T,o.caps,[0,T0,T0+D+.2])}

/* ===== registro ===== */
var CAR=car(),CAP4=["Um carro acelera a partir do repouso.|O gráfico mostra v crescendo com t.","O gráfico v × t é desenhado enquanto|o carro anda; a área sob ele cresce junto|com o deslocamento.","A área do triângulo é o deslocamento:|A = base · altura / 2|A = 4 · 8 / 2 = 16 m."];
uv("fen_m011","Simulação: um carro acelera a partir do repouso (v = 2·t); o gráfico velocidade × tempo é desenhado e a área sob a curva cresce até valer o deslocamento percorrido, 16 m",{v0:0,a:2,tf:4,body:CAR,bw:44,caps:CAP4});
uv("calc_m008","Simulação: um móvel com 4 m/s e aceleração de 3 m/s² tem a velocidade aumentando 3 m/s a cada segundo, chegando a 19 m/s em 5 s",{v0:4,a:3,tf:5,body:CAR,bw:44,caps:["O móvel já tem 4 m/s e acelera 3 m/s².|Veja a velocidade crescer no gráfico.","A cada segundo a velocidade ganha 3 m/s:|v = v₀ + a·t.","Em 5 s: v = 4 + 3 · 5 = 19 m/s."]});
uv("calc_m009","Simulação: um carro a 20 m/s freia com desaceleração de 4 m/s² e para em 5 s; a área sob o gráfico é a distância de frenagem, 50 m",{v0:20,a:-4,tf:5,body:CAR,bw:44,caps:["O carro vem a 20 m/s e começa a frear.|A velocidade cai 4 m/s a cada segundo.","Ele para quando v chega a zero, em 5 s.|A área sob o gráfico é a distância.","Área do triângulo:|d = 5 · 20 / 2 = 50 m."]});
uv("calc_m010","Simulação: um objeto parte do repouso com aceleração de 2 m/s²; o gráfico v × t cresce em linha reta e a área sob ele, 36 m, é a distância em 6 s",{v0:0,a:2,tf:6,body:CAR,bw:44,caps:["O objeto parte do repouso, a = 2 m/s².|A velocidade cresce em linha reta.","A distância é a área sob o gráfico v × t,|que cresce cada vez mais depressa.","Em 6 s: v = 12 m/s e a área é 6 · 12 / 2 = 36 m."]});
uv("calc_m012","Simulação: a velocidade de um móvel passa de 10 m/s para 30 m/s em 4 s; a inclinação do gráfico v × t é a aceleração, 5 m/s²",{v0:10,a:5,tf:4,body:CAR,bw:44,caps:["O móvel vai de 10 m/s a 30 m/s em 4 s.|O gráfico de v × t é uma reta inclinada.","A aceleração é a inclinação da reta:|quanto v varia a cada segundo.","a = (30 − 10) / 4 = 5 m/s²."]});
(function(){
 var b35=blk(28,44,"4 kg")+arr(72,98,-14,"30 N",ACC,20)+arr(28,6,-14,"10 N",NEG,20);
 uv("calc_m035","Simulação: um bloco de 4 kg sofre forças opostas de 30 N e 10 N; a resultante de 20 N o acelera a 5 m/s², e a velocidade cresce em linha reta no gráfico",{v0:0,a:5,tf:4,body:b35,bw:100,caps:["As forças de 30 N e 10 N são opostas.|A resultante vale 30 − 10 = 20 N.","O bloco acelera e sua velocidade cresce|em linha reta no gráfico v × t.","a = F / m = 20 / 4 = 5 m/s²:|a velocidade ganha 5 m/s por segundo."]});
 var b41=blk(6,32,"2 kg")+'<line x1="38" y1="-14" x2="52" y2="-14" stroke="currentColor" stroke-width="2.4"/>'+blk(52,40,"3 kg","var(--neg)")+arr(92,120,-14,"20 N",ACC,20);
 uv("calc_m041","Simulação: dois blocos de 2 kg e 3 kg ligados por um fio são puxados por 20 N; o conjunto acelera a 4 m/s² e a velocidade cresce em linha reta",{v0:0,a:4,tf:4,body:b41,bw:124,caps:["Os dois blocos, ligados por um fio,|são puxados pela força de 20 N.","O fio faz os dois se moverem juntos:|a massa a acelerar é 2 + 3 = 5 kg.","a = F / m = 20 / 5 = 4 m/s²:|v cresce 4 m/s a cada segundo."]})})();

/* movimento vertical */
vert({key:"calc_m017",alt:"Simulação: um objeto abandonado de 45 m cai e a altura diminui com o tempo em parábola, chegando ao solo em 3 s",y0:45,v0:0,tf:3,hm:45,tower:1,caps:["O objeto é abandonado do repouso a 45 m.|Veja a altura cair com o tempo.","A altura diminui cada vez mais depressa,|pois a velocidade aumenta.","Ele chega ao solo (h = 0) em 3 s:|45 = 5 · t², logo t = 3 s."]});
vert({key:"calc_m018",alt:"Simulação: um corpo cai de 20 m e atinge o solo em 2 s com velocidade de 20 m/s",y0:20,v0:0,tf:2,hm:20,tower:1,caps:["O corpo cai do repouso, de 20 m.|A leitura mostra a velocidade crescendo.","A cada segundo v ganha 10 m/s,|e a altura cai cada vez mais rápido.","Ao tocar o solo, em 2 s,|v = 10 · 2 = 20 m/s."]});
vert({key:"calc_m019",alt:"Simulação: uma pedra lançada para cima a 30 m/s sobe, desacelera 10 m/s a cada segundo e para a 45 m de altura, após 3 s",y0:0,v0:30,tf:3,hm:45,caps:["A pedra sobe a 30 m/s,|mas a gravidade a freia 10 m/s a cada s.","A subida vai ficando mais lenta:|o gráfico h × t se curva para baixo.","No ponto mais alto v = 0 (em 3 s):|h = 30 · 3 − 5 · 3² = 45 m."]});
vert({key:"calc_m020",alt:"Simulação: uma bola lançada para cima a 20 m/s perde 10 m/s a cada segundo e para no ponto mais alto, a 20 m, após 2 s",y0:0,v0:20,tf:2,hm:20,caps:["A bola sobe a 20 m/s e a gravidade|a freia 10 m/s a cada segundo.","A velocidade diminui até zero:|esse é o ponto mais alto da trajetória.","v = 20 − 10 · t = 0, logo t = 2 s."]});

/* movimento uniforme */
mu("calc_m001","Simulação: um carro percorre 90 km em 1,5 h em movimento uniforme; o gráfico posição × tempo é uma reta de inclinação 60 km/h",{L:90,tf:1.5,tl:"h",yl:"s (km)",cars:[{s0:0,v:60,col:ACC}],
 rd:function(q){return"t = "+f(1.5*q)+" h  ·  s = "+f(90*q)+" km"},caps:["O carro percorre 90 km em 1,5 h,|sempre no mesmo ritmo.","O gráfico s × t sai como uma reta:|a distância cresce igual a cada hora.","A inclinação da reta é a velocidade:|v = 90 / 1,5 = 60 km/h."]});
mu("calc_m004","Simulação: dois carros se aproximam, A a 20 m/s e B a 10 m/s, partindo de 300 m de distância; as retas do gráfico posição × tempo se cruzam em 10 s",{L:300,tf:10,tl:"s",yl:"s (m)",meet:200,cars:[{s0:0,v:20,col:ACC},{s0:300,v:-10,col:NEG}],
 rd:function(q){return"t = "+f(10*q)+" s  ·  A: "+f(200*q)+" m  ·  B: "+f(300-100*q)+" m"},caps:["A parte de 0, a 20 m/s; B parte de 300 m,|vindo ao encontro a 10 m/s.","Cada carro desenha sua reta de s × t.|O encontro é onde as retas se cruzam.","Aproximam-se a 20 + 10 = 30 m/s:|t = 300 / 30 = 10 s."]});

/* lançamentos */
proj("calc_m023","Simulação: uma bola é lançada horizontalmente a 15 m/s do alto de um prédio de 20 m; ela cai em parábola, leva 2 s e avança 30 m",{vx:15,vy:0,y0:20,dim:"alcance = 30 m",caps:["A bola sai na horizontal a 15 m/s,|de 20 m de altura.","Na horizontal a velocidade não muda;|na vertical ela cai em queda livre.","Cai em 2 s (20 = 5 · t²):|alcance = 15 · 2 = 30 m."]});
proj("calc_m024","Simulação: um projétil é lançado a 50 m/s com 37°; a velocidade inicial se decompõe em 40 m/s na horizontal e 30 m/s na vertical, e a trajetória é uma parábola",{vx:40,vy:30,vec:1,vxl:"vx = 40",vyl:"vy = 30",dim:"alcance = 240 m",caps:["O projétil sai a 50 m/s, a 37°.|Essa velocidade tem duas componentes.","vx = 50 · 0,8 = 40 m/s (horizontal)|vy = 50 · 0,6 = 30 m/s (vertical).","A parábola nasce da soma: vx constante,|e vy mudando por causa da gravidade."]});
proj("calc_m025","Simulação: um projétil lançado do solo a 20 m/s e 45° desenha uma parábola e alcança 40 m",{vx:20*Math.SQRT1_2,vy:20*Math.SQRT1_2,dim:"alcance = 40 m",caps:["O projétil sai do solo a 20 m/s, a 45°.|Veja a parábola ser desenhada.","Ele sobe, para no ponto mais alto|e volta ao nível do lançamento.","Tempo de voo: 2 · 14,1 / 10 ≈ 2,8 s.|Alcance: 14,1 · 2,83 = 40 m."]});

/* movimento circular */
circ("calc_m033","Simulação: uma roda gira 5 voltas por segundo; o gráfico do ângulo percorrido cresce em reta até 30 rad em 1 s, e a inclinação é a velocidade angular, 30 rad/s",{turns:5,n:5,graph:1,xl:"s",yl:"θ (rad)",xe:"1",ye:"30",rd:function(q){return"t = "+f(q)+" s  ·  "+f(5*q,0)+" voltas  ·  θ = "+f(30*q,0)+" rad"},caps:["A roda dá 5 voltas por segundo (5 Hz).|O ângulo θ cresce com o tempo.","Cada volta vale 2π ≈ 6 rad.|O gráfico de θ × t é uma reta.","A inclinação é a velocidade angular:|ω = 5 · 6 = 30 rad/s."]});
circ("calc_m029","Simulação: um corpo percorre uma circunferência de 2 m de raio em 4 s; o gráfico da distância percorrida cresce em reta até 12 m, e a inclinação é a velocidade linear, 3 m/s",{turns:1,n:4,graph:1,arrows:2,xl:"s",yl:"d (m)",xe:"4",ye:"12",rd:function(q){return"t = "+f(4*q)+" s  ·  d = "+f(12*q)+" m  ·  "+f(q*100,0)+"% da volta"},caps:["O corpo dá uma volta em T = 4 s.|A seta vermelha é a velocidade (tangente).","A distância cresce em reta; em uma volta:|2πR = 2 · 3 · 2 = 12 m.","A inclinação do gráfico é a velocidade:|v = 12 / 4 = 3 m/s."]});
circ("calc_m028","Simulação: um corpo leva 0,5 s por volta, então dá 2 voltas por segundo; a frequência é 2 Hz",{turns:2,n:4,graph:1,xl:"s",yl:"voltas",xe:"1",ye:"2",rd:function(q){return"t = "+f(q)+" s  ·  "+f(2*q,1)+" voltas"},caps:["Uma volta leva 0,5 s (o período).|Veja quantas voltas cabem em 1 s.","A cada 0,5 s completa uma volta:|o gráfico sobe 2 voltas por segundo.","Frequência = voltas por segundo:|f = 1 / 0,5 = 2 Hz."]});
circ("calc_m030","Simulação: um corpo percorre uma circunferência de 5 m de raio a 10 m/s; a velocidade (vermelha) é tangente e a aceleração centrípeta (preta) aponta para o centro, valendo 20 m/s²",{turns:2,n:4,arrows:1,leg1:"v = 10 m/s (tangente)",leg2:"a aponta para o centro",rd:function(q){return f(q*2,1)+" voltas"},caps:["O módulo de v é constante,|mas sua direção muda o tempo todo.","Mudar de direção exige aceleração,|e ela aponta sempre para o centro.","a = v² / R = 10² / 5 = 20 m/s²."]});

/* impulso e quantidade de movimento */
imp("calc_m064","Simulação: uma força média de 200 N atua por 0,05 s sobre um corpo; no gráfico força × tempo a área do retângulo é o impulso, 10 N·s",{Fl:"200 N",tl:"0,1",imp:"10 N·s",caps:["Uma força de 200 N empurra o corpo|durante um contato curto, de 0,05 s.","No gráfico F × t o traço forma um|retângulo; sua área vai sendo preenchida.","A área é o impulso:|I = F · Δt = 200 · 0,05 = 10 N·s."]});
imp("calc_m065","Simulação: um chute de 0,01 s lança uma bola de 0,5 kg a 20 m/s; a área do gráfico força × tempo é o impulso, 10 N·s, o que exige uma força média de 1000 N",{Fl:"1000 N",tl:"0,02",imp:"10 N·s",vl:"20 m/s",caps:["O pé toca a bola parada por só 0,01 s.|Durante o contato atua uma força grande.","Depois do chute a bola sai a 20 m/s:|sua quantidade de movimento vai de 0 a 10.","A área de F × t é o impulso:|I = m·Δv = 0,5 · 20 = 10 N·s|F = 10 / 0,01 = 1000 N."]});
(function(){
 var T0=1.4,D=4,T=T0+D+3.4,H=226,svg='<line x1="10" y1="96" x2="310" y2="96" stroke="currentColor" stroke-width="2"/>'+
  '<g class="bl"><g transform="translate(214 0)"><circle cx="0" cy="82" r="14" fill="'+ACC+'" fill-opacity=".6" stroke="currentColor" stroke-width="2"/>'+arr(20,64,82,"v = 15 m/s",NEG)+'</g></g>'+
  '<g>'+arr(30,30+6*5,120,"Q = 6 kg·m/s","currentColor")+'</g>'+t_(160,136,"Q = m · v  (0,4 kg · 15 m/s)",{s:12});
 var rd=readout("rd",160,function(q){return"t = "+f(q*2,1)+" s  ·  x = "+f(q*30,0)+" m"},4,T0,D,T);
 mk("calc_m063","Simulação: uma bola de 0,4 kg rola a 15 m/s; sua quantidade de movimento é um vetor na mesma direção da velocidade, de módulo m·v = 6 kg·m/s",H,svg+rd.s,[N.tr(".bl",T,[[T0,-180,0],[T0+D,0,0]],"linear")].concat(rd.t),T,["A bola de 0,4 kg se move a 15 m/s.|A seta vermelha é a velocidade.","A quantidade de movimento Q é um vetor|com a mesma direção da velocidade.","Q = m · v = 0,4 · 15 = 6 kg·m/s."],[0,T0,T0+D+.2])})();
/* ===== H. relação entre duas grandezas: cena em cima, gráfico embaixo (x = q de 0 a 1) ===== */
function mvg(cl,x,y,inner,extra){return'<g class="'+cl+'"><g transform="translate('+x+' '+y+')'+(extra||"")+'">'+inner+'</g></g>'}
function xy(key,alt,o){
 var x0=48,y0=196,w=228,h=84,T0=1.4,D=o.D||4,T=T0+D+3.4,H=276,id="ar"+(++uid),ym=o.ym,svg=o.sc||"",tr=[],i,n=o.n||48;
 function gx(q){return x0+w*q}function gy(v){return y0-h*v/ym}
 svg+=axes(x0,y0,w,h,o.xl,o.yl,o.xe,o.ye,o.x0t);
 function path(Y){var d="";for(i=0;i<=n;i++)d+=(i?"L":"M")+r(gx(i/n))+" "+r(gy(Y(i/n)))+" ";return d}
 if(o.area){var p=path(o.cv[0].Y);svg+=area(id,"ar",x0,y0-h-4,w,h+4,"M"+x0+" "+y0+" L"+p.slice(1)+"L"+gx(1)+" "+y0+"Z",o.cv[0].col||ACC);tr.push(grow("ar",T,T0,T0+D))}
 o.cv.forEach(function(c,k){svg+=curve(path(c.Y),"cv"+k,c.col||ACC)+'<circle class="pt'+k+'" cx="'+gx(1)+'" cy="'+gy(c.Y(1))+'" r="5" fill="'+(c.col||ACC)+'"/>';
  tr.push(draw("cv"+k,T,T0,T0+D),trk(".pt"+k,T,T0,D,function(q){return[gx(q),gy(c.Y(q))]},n))});
 (o.mv||[]).forEach(function(m){tr.push(trk(m[0],T,T0,D,m[1],m[2]||24))});
 if(o.tr)tr=tr.concat(o.tr(T,T0,D));
 if(o.gs)svg+=o.gs(gx,gy);
 if(o.end)svg+='<g class="en">'+o.end(gx,gy)+'</g>',tr.push(N.vis(".en",T,T0+D));
 var rd=readout("rd",226,o.rd,4,T0,D,T);
 mk(key,alt,H,svg+rd.s,tr.concat(rd.t),T,o.caps,[0,T0,T0+D+.2])}
function bike(){return'<circle cx="8" cy="-8" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="-8" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 -8L18 -22L30 -22L34 -8M18 -22L22 -8L8 -8" fill="none" stroke="'+ACC+'" stroke-width="2.4"/><circle cx="23" cy="-33" r="4" fill="'+ACC+'"/>'}
var GR='<line x1="10" y1="94" x2="310" y2="94" stroke="currentColor" stroke-width="2"/>';
var cvP=function(Y,c){return{Y:Y,col:c}};

/* m003: km/h -> m/s */
xy("calc_m003","Simulação: um ciclista a 72 km/h percorre 20 m a cada segundo; o gráfico distância × tempo é uma reta de inclinação 20 m/s, ou seja, 72 km/h = 20 m/s",{ym:100,xl:"",xe:"5 s",yl:"s (m)",ye:"100",
 sc:GR+mvg("m0",262,94,bike())+t_(160,28,"72 km/h = ? m/s",{s:14}),mv:[[".m0",function(q){return[14+248*q,94]},12]],cv:[cvP(function(q){return 100*q})],
 rd:function(q){return"t = "+f(5*q)+" s  ·  s = "+f(100*q)+" m"},caps:["O ciclista anda sempre a 72 km/h.|Veja quanto ele avança a cada segundo.","O gráfico s × t é uma reta:|a cada 1 s ele anda 20 m.","A inclinação é 20 m/s:|72 / 3,6 = 20 m/s."]});

/* m039: elevador */
(function(){var Nf=function(q){var t=4*q;return t>=1&&t<=3?720:600},Sf=function(q){var t=4*q;return t<1?0:t<3?(t-1)*(t-1):4+4*(t-3)};
 var el='<rect x="-26" y="-48" width="52" height="48" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="2"/><circle cx="0" cy="-34" r="6" fill="'+ACC+'"/><rect x="-7" y="-28" width="14" height="22" fill="'+ACC+'" fill-opacity=".6"/>'+t_(18,-8,"60 kg",{s:9,a:"end"});
 xy("calc_m039","Simulação: uma pessoa de 60 kg num elevador; em repouso a normal é 600 N e, durante a subida acelerada a 2 m/s², a normal sobe a 720 N, voltando a 600 N quando a velocidade fica constante",{ym:800,xl:"",xe:"4 s",yl:"N (N)",ye:"800",n:80,
 sc:'<line x1="100" y1="6" x2="100" y2="96" stroke="currentColor" stroke-opacity=".4"/><line x1="220" y1="6" x2="220" y2="96" stroke="currentColor" stroke-opacity=".4"/>'+GR+mvg("m0",160,94-32,el),
 mv:[[".m0",function(q){return[160,94-4*Sf(q)]},48]],cv:[cvP(Nf)],gs:function(gx,gy){return'<line x1="'+gx(0)+'" y1="'+gy(600)+'" x2="'+gx(1)+'" y2="'+gy(600)+'" stroke="currentColor" stroke-dasharray="4 3" stroke-opacity=".6"/>'+t_(gx(1),gy(600)+12,"P = 600 N",{s:10,a:"end"})},
 rd:function(q){return"t = "+f(4*q)+" s  ·  N = "+f(Nf(q),0)+" N"},caps:["Parado ou a velocidade constante,|a normal vale o peso: 600 N.","Enquanto o elevador acelera para cima,|o piso empurra mais: a normal aumenta.","N − P = m·a → N = 60 · (10 + 2) = 720 N.|Sem aceleração, volta a 600 N."]})})();

/* m042: atrito proporcional à normal */
xy("calc_m042","Simulação: um bloco de 10 kg desliza em piso com coeficiente de atrito 0,3; o gráfico mostra a força de atrito crescendo em reta com a normal, chegando a 30 N quando N = 100 N",{ym:30,xl:"",xe:"100 N",yl:"Fat (N)",ye:"30",
 sc:GR+mvg("m0",120,94,blk(0,50,"10 kg")+arr(0,-34,-14,"Fat = 30 N",NEG,20))+t_(250,40,"N = P = 100 N",{s:12}),
 mv:[[".m0",function(q){return[120+40*q,94]},12]],cv:[cvP(function(q){return 30*q})],
 rd:function(q){return"N = "+f(100*q,0)+" N  ·  Fat = "+f(30*q,0)+" N"},caps:["O bloco desliza no piso e o atrito|o freia, contra o movimento.","Quanto maior a força normal,|maior o atrito: Fat = μ · N.","Na horizontal N = P = 10 · 10 = 100 N:|Fat = 0,3 · 100 = 30 N."]});


/* ===== barras (comparações) ===== */
function bars(key,alt,o){
 var T0=1.2,T=T0+4+3.4,H=262,y0=174,h=110,svg='<line x1="30" y1="'+y0+'" x2="290" y2="'+y0+'" stroke="currentColor" stroke-width="2"/>',tr=[],xs=[80,200];
 o.b.forEach(function(b,i){var bh=h*b.v/o.ym;
  svg+='<rect class="b'+i+'" x="'+(xs[i]-28)+'" y="'+(y0-bh)+'" width="56" height="'+bh+'" fill="'+b.col+'" fill-opacity=".5" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:50% 100%"/>'+
   '<g class="v'+i+'">'+t_(xs[i],y0-bh-8,b.txt,{s:13})+'</g>'+t_(xs[i],y0+16,b.lab,{s:12})+t_(xs[i],y0+30,b.lab2,{s:11});
  tr.push(N.sc(".b"+i,T,[[T0+i*1.2,1,0],[T0+i*1.2+1.8,1,1]],"ease-out"),N.vis(".v"+i,T,T0+i*1.2+1.8))});
 mk(key,alt,H,svg,tr,T,o.caps,[0,T0,T0+4.2])}
bars("calc_m036","Simulação: o astronauta de 50 kg tem a mesma massa em qualquer lugar, mas pesa 500 N na Terra e apenas 80 N na Lua, onde g = 1,6 m/s²",{ym:500,b:[{v:500,col:ACC,txt:"P = 500 N",lab:"Terra",lab2:"g = 10 m/s²"},{v:80,col:NEG,txt:"P = 80 N",lab:"Lua",lab2:"g = 1,6 m/s²"}],
 caps:["O astronauta tem 50 kg em qualquer lugar.|O peso depende da gravidade local.","Na Terra (g = 10 m/s²) a barra é grande.|Na Lua, com g menor, ela é bem menor.","P = m · g = 50 · 1,6 = 80 N na Lua.|A massa não mudou: continua 50 kg."]});

/* ===== planos inclinados ===== */
function rampa(key,alt,o){
 var th=o.th,deg=th*180/PI,px=24,py=94,
  inner='<line x1="0" y1="0" x2="160" y2="0" stroke="currentColor" stroke-width="3"/><rect x="70" y="-26" width="40" height="26" fill="'+ACC+'" fill-opacity=".45" stroke="currentColor" stroke-width="2"/>'+t_(90,-8,o.lab,{s:11}),
  sc='<line x1="10" y1="94" x2="200" y2="94" stroke="currentColor" stroke-opacity=".4" stroke-width="2"/><g class="rp" style="transform-origin:'+px+'px '+py+'px"><g transform="translate('+px+' '+py+') rotate('+(-deg)+')">'+inner+'</g></g>'+t_(250,34,o.fl,{s:12})+t_(250,50,o.fl2,{s:12});
 xy(key,alt,{ym:o.ym,xl:"",xe:f(deg,0)+"°",yl:o.yl,ye:o.ye,sc:sc,cv:[cvP(function(q){return o.Y(th*q)})],
  tr:function(T,T0,D){return[N.rot(".rp",T,[[T0,deg],[T0+D,0]],"linear")]},
  gs:o.gs,end:o.end,rd:function(q){return"θ = "+f(deg*q,0)+"°  ·  "+o.rl(th*q)},caps:o.caps})}
rampa("calc_m044","Simulação: ao inclinar o plano até 30°, a aceleração de um bloco sem atrito cresce com o ângulo segundo g·sen θ, chegando a 5 m/s²",{th:PI/6,lab:"bloco",fl:"sem atrito",fl2:"g = 10 m/s²",ym:5,yl:"a (m/s²)",ye:"5",Y:function(t){return 10*Math.sin(t)},rl:function(t){return"a = "+f(10*Math.sin(t))+" m/s²"},
 caps:["Quanto mais inclinado o plano,|mais o peso puxa o bloco ao longo dele.","Sem atrito, só essa parte acelera o bloco:|a = g · sen θ.","Com θ = 30°: a = 10 · 0,5 = 5 m/s²."]});
rampa("calc_m045","Simulação: ao inclinar o plano até sen θ = 0,6, a componente do peso paralela ao plano de um bloco de 20 kg cresce segundo m·g·sen θ, chegando a 120 N",{th:Math.asin(.6),lab:"20 kg",fl:"P = 200 N",fl2:"",ym:120,yl:"Px (N)",ye:"120",Y:function(t){return 200*Math.sin(t)},rl:function(t){return"Px = "+f(200*Math.sin(t),0)+" N"},
 caps:["Quanto mais inclinado o plano,|maior a parte do peso ao longo dele.","A componente paralela é Px = P · sen θ,|com P = 20 · 10 = 200 N.","Com sen θ = 0,6:|Px = 200 · 0,6 = 120 N."]});
rampa("calc_m046","Simulação: ao inclinar o plano até cos θ = 0,8, a força normal sobre um bloco de 5 kg diminui segundo m·g·cos θ, chegando a 40 N",{th:Math.acos(.8),lab:"5 kg",fl:"P = 50 N",fl2:"",ym:50,yl:"N (N)",ye:"50",Y:function(t){return 50*Math.cos(t)},rl:function(t){return"N = "+f(50*Math.cos(t),0)+" N"},
 caps:["Quanto mais inclinado o plano,|menos o bloco o pressiona.","A normal equilibra só a parte do peso|perpendicular ao plano: N = P · cos θ.","Com cos θ = 0,8 e P = 5 · 10 = 50 N:|N = 50 · 0,8 = 40 N."]});

/* m047: plano fixo, com e sem atrito */
(function(){var th=Math.asin(.6),c=Math.cos(th),sn=Math.sin(th),tx=26,ty=4,Sm=105,blkI='<rect x="2" y="-22" width="36" height="22" fill="'+ACC+'" fill-opacity=".45" stroke="currentColor" stroke-width="2"/>';
 xy("calc_m047","Simulação: um bloco desce um plano inclinado com atrito (sen θ = 0,6, μ = 0,5) acelerando a 2 m/s²; sem atrito a aceleração seria 6 m/s², e as retas v × t mostram a diferença",{ym:24,xl:"",xe:"4 s",yl:"v (m/s)",ye:"24",
 sc:'<path d="M'+tx+' '+ty+'L'+(tx+120)+' '+(ty+90)+'L'+tx+' '+(ty+90)+'Z" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="2"/>'+mvg("m0",tx+Sm*c,ty+Sm*sn,blkI,"rotate("+(th*180/PI)+")")+t_(230,40,"μ = 0,5",{s:12}),
 mv:[[".m0",function(q){var s=Sm*q*q;return[tx+s*c,ty+s*sn]},24]],cv:[cvP(function(q){return 8*q}),cvP(function(q){return 24*q},NEG)],
 gs:function(gx,gy){return t_(gx(.62),gy(24*.62)-6,"sem atrito: 6 m/s²",{s:11,f:NEG,a:"end"})+t_(gx(.98),gy(2.2),"com atrito: 2 m/s²",{s:11,a:"end"})},
 rd:function(q){return"t = "+f(4*q)+" s  ·  v = "+f(8*q)+" m/s  (com atrito)"},caps:["Sem atrito o bloco aceleraria 6 m/s²,|mas o atrito o segura (reta vermelha).","O atrito se opõe ao movimento no plano:|Fat = μ · m · g · cos θ.","a = g · (sen θ − μ · cos θ)|a = 10 · (0,6 − 0,5 · 0,8) = 2 m/s²."]})})();

/* ===== trabalho, potência e energia ===== */
xy("calc_m049","Simulação: uma força de 50 N, a 60° do deslocamento, arrasta um bloco por 4 m; só a componente horizontal, de 25 N, realiza trabalho, e a área sob o gráfico dá 100 J",{ym:30,xl:"",xe:"4 m",yl:"Fx (N)",ye:"30",area:1,
 sc:GR+mvg("m0",120,94,blk(0,50,"")+'<line x1="50" y1="-14" x2="72" y2="-14" stroke="currentColor" stroke-dasharray="3 3"/><line x1="72" y1="-14" x2="72" y2="-52" stroke="currentColor" stroke-dasharray="3 3"/>'+'<line x1="50" y1="-14" x2="68" y2="-45" stroke="'+NEG+'" stroke-width="3"/><path d="M72 -52L62 -46L70 -40Z" fill="'+NEG+'"/>'+t_(80,-46,"F = 50 N",{s:11,a:"start"})),
 mv:[[".m0",function(q){return[30+90*q,94]},16]],cv:[cvP(function(q){return 25})],
 end:function(gx,gy){return t_(gx(.5),gy(12.5)+4,"área = 100 J",{s:13})},gs:function(gx,gy){return t_(gx(1),gy(25)-6,"Fx = 25 N",{s:11,a:"end"})},
 rd:function(q){return"d = "+f(4*q)+" m  ·  τ = "+f(100*q,0)+" J"},caps:["A força puxa o bloco de lado,|a 60° do deslocamento.","Só a componente na direção do movimento|trabalha: Fx = 50 · cos 60° = 25 N.","O trabalho é a área do gráfico:|τ = 25 · 4 = 100 J."]});
xy("calc_m051","Simulação: uma força realiza trabalho sem parar e o gráfico do trabalho acumulado sobe em reta, chegando a 1200 J em 20 s; a inclinação é a potência, 60 W",{ym:1200,xl:"",xe:"20 s",yl:"τ (J)",ye:"1200",
 sc:GR+mvg("m0",150,94,blk(0,50,"")+arr(-30,0,-14,"F",ACC,20)),mv:[[".m0",function(q){return[40+110*q,94]},16]],cv:[cvP(function(q){return 1200*q})],
 rd:function(q){return"t = "+f(20*q,0)+" s  ·  τ = "+f(1200*q,0)+" J"},caps:["A força age o tempo todo,|então o trabalho vai se acumulando.","O gráfico de τ × t é uma reta:|o mesmo trabalho a cada segundo.","A inclinação é a potência média:|P = 1200 / 20 = 60 W."]});
(function(){var bk='<rect x="-18" y="-4" width="36" height="22" fill="'+ACC+'" fill-opacity=".45" stroke="currentColor" stroke-width="2"/>'+t_(0,12,"200 kg",{s:10});
 xy("calc_m052","Simulação: uma bomba eleva 200 kg de água a 10 m em 20 s; o trabalho acumulado cresce em reta até 20 kJ, e a inclinação é a potência, 1000 W",{ym:20,xl:"",xe:"20 s",yl:"τ (kJ)",ye:"20",
 sc:'<line x1="70" y1="6" x2="70" y2="94" stroke="currentColor" stroke-opacity=".5" stroke-dasharray="4 3"/>'+t_(110,18,"10 m",{s:11})+GR+mvg("m0",70,16,bk),mv:[[".m0",function(q){return[70,76-60*q]},16]],cv:[cvP(function(q){return 20*q})],
 rd:function(q){return"t = "+f(20*q,0)+" s  ·  h = "+f(10*q)+" m  ·  τ = "+f(20*q,0)+" kJ"},caps:["A bomba sobe a água, 200 kg, a 10 m|de altura, em 20 s.","O trabalho contra o peso vai acumulando:|τ = m · g · h = 200 · 10 · 10 = 20 000 J.","A inclinação do gráfico é a potência:|P = 20 000 / 20 = 1000 W."]})})();
xy("calc_m053","Simulação: um carro aumenta a velocidade até 20 m/s sob força motriz de 500 N; a potência P = F·v cresce em reta com a velocidade, chegando a 10 kW",{ym:10,xl:"",xe:"20 m/s",yl:"P (kW)",ye:"10",
 sc:GR+mvg("m0",200,94,car()+arr(44,74,-14,"F = 500 N",NEG,20)),mv:[[".m0",function(q){return[16+184*q*q,94]},24]],cv:[cvP(function(q){return 10*q})],
 rd:function(q){return"v = "+f(20*q,0)+" m/s  ·  P = "+f(10*q)+" kW"},caps:["A força motriz é constante, 500 N,|e o carro vai ganhando velocidade.","A potência é P = F · v:|dobrando a velocidade, dobra a potência.","A 20 m/s: P = 500 · 20|P = 10 000 W = 10 kW."]});
xy("calc_m055","Simulação: um carro de 1200 kg aumenta a velocidade até 72 km/h (20 m/s); a energia cinética cresce com o quadrado da velocidade, chegando a 240 kJ",{ym:240,xl:"",xe:"20 m/s",yl:"Ec (kJ)",ye:"240",
 sc:GR+mvg("m0",250,94,car())+t_(160,30,"1200 kg  ·  72 km/h = 20 m/s",{s:12}),mv:[[".m0",function(q){return[16+234*q*q,94]},24]],cv:[cvP(function(q){return 240*q*q})],
 rd:function(q){return"v = "+f(20*q,0)+" m/s  ·  Ec = "+f(240*q*q,0)+" kJ"},caps:["O carro vai acelerando até 72 km/h.|A energia cinética cresce com v².","Dobrar a velocidade quadruplica a energia:|o gráfico é uma parábola.","72 km/h = 20 m/s:|Ec = 1200 · 20² / 2 = 240 000 J = 240 kJ."]});
xy("calc_m056","Simulação: um objeto de 3 kg é erguido até 5 m; a energia potencial gravitacional cresce em reta com a altura, chegando a 150 J",{ym:150,xl:"",xe:"5 m",yl:"Ep (J)",ye:"150",
 sc:'<line x1="100" y1="94" x2="100" y2="14" stroke="currentColor" stroke-opacity=".4"/>'+GR+mvg("m0",100,24,'<circle cx="0" cy="0" r="9" fill="'+ACC+'" stroke="currentColor" stroke-width="2"/>'+t_(0,4,"3",{s:11})+'<line x1="18" y1="0" x2="18" y2="26" stroke="'+NEG+'" stroke-width="3"/><path d="M18 34L13 24L23 24Z" fill="'+NEG+'"/>'+t_(26,18,"P = 30 N",{s:11,a:"start"})),
 mv:[[".m0",function(q){return[100,86-62*q]},16]],cv:[cvP(function(q){return 150*q})],
 rd:function(q){return"h = "+f(5*q)+" m  ·  Ep = "+f(150*q,0)+" J"},caps:["O objeto de 3 kg é erguido do solo.|Quanto mais alto, mais energia potencial.","A energia cresce em reta com a altura:|o mesmo ganho a cada metro.","Ep = m · g · h = 3 · 10 · 5 = 150 J."]});
(function(){var hx=function(h){return 20+260*Math.pow(1-h/20,.9)},hy=function(h){return 96-82*h/20},d="",i;for(i=0;i<=40;i++){var h=20-20*i/40;d+=(i?"L":"M")+r(hx(h))+" "+r(hy(h))+" "}
 var cart='<rect x="-12" y="-14" width="24" height="10" rx="2" fill="'+ACC+'" fill-opacity=".6" stroke="currentColor" stroke-width="2"/><circle cx="-6" cy="-3" r="3" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/><circle cx="6" cy="-3" r="3" fill="var(--surface)" stroke="currentColor" stroke-width="1.6"/>',hh=function(q){return 20-15*q};
 xy("calc_m057","Simulação: um carrinho desce uma montanha-russa de 20 m sem atrito; a energia potencial diminui e a cinética aumenta na mesma medida, e a soma permanece constante, dando 17,3 m/s a 5 m do solo",{ym:200,xl:"",x0t:"20 m",xe:"5 m",yl:"J por kg",ye:"200",
 sc:'<path d="'+d+'" fill="none" stroke="currentColor" stroke-width="3"/>'+mvg("m0",hx(5),hy(5),cart)+t_(34,12,"H = 20 m",{s:11,a:"start"}),
 mv:[[".m0",function(q){return[hx(hh(q)),hy(hh(q))]},30]],cv:[cvP(function(q){return 10*hh(q)}),cvP(function(q){return 10*(20-hh(q))},NEG)],
 gs:function(gx,gy){return'<line x1="'+gx(0)+'" y1="'+gy(200)+'" x2="'+gx(1)+'" y2="'+gy(200)+'" stroke="currentColor" stroke-dasharray="4 3" stroke-opacity=".6"/>'+t_(gx(.04),gy(200)+14,"Ep",{s:12,a:"start"})+t_(gx(.96),gy(10*(20-5))-8,"Ec",{s:12,a:"end",f:NEG})+t_(gx(1),gy(200)-5,"Ep + Ec = constante",{s:10,a:"end"})},
 rd:function(q){return"h = "+f(hh(q))+" m  ·  v = "+f(Math.sqrt(20*(20-hh(q))))+" m/s"},caps:["O carrinho parte do topo, a 20 m,|e desce sem atrito.","A energia potencial vira cinética:|a soma Ep + Ec não muda.","A 5 m do solo: g·(H − h) = v² / 2|v = √(2 · 10 · 15) = √300 ≈ 17,3 m/s."]})})();
(function(){var zz='<path d="M0 -14L10 -14L15 -24L25 -4L35 -24L45 -4L55 -24L65 -4L70 -14L80 -14" fill="none" stroke="currentColor" stroke-width="2.4"/>';
 xy("calc_m058","Simulação: uma mola de 200 N/m é comprimida 0,1 m; a força cresce em reta com a compressão e a área sob o gráfico, 1 J, é a energia armazenada",{ym:20,xl:"",xe:"0,1 m",yl:"F (N)",ye:"20",area:1,
 sc:GR+'<rect x="12" y="62" width="8" height="32" fill="currentColor" fill-opacity=".4"/><g class="sp" style="transform-origin:20px 94px"><g transform="translate(20 94) scale(.6 1)">'+zz+'</g></g>'+mvg("m0",68,94,blk(0,34,"")),
 mv:[[".m0",function(q){return[68+32*(1-q),94]},12]],tr:function(T,T0,D){return[N.sc(".sp",T,[[T0,1/.6,1],[T0+D,1,1]],"linear")]},cv:[cvP(function(q){return 20*q})],
 end:function(gx,gy){return t_(gx(.62),gy(5)+4,"área = 1 J",{s:13})},rd:function(q){return"x = "+f(.1*q,3)+" m  ·  F = "+f(20*q,0)+" N"},caps:["Uma mola de 200 N/m vai sendo|comprimida, de 0 até 0,1 m.","A força cresce com a compressão: F = k · x.|A área sob a reta é o trabalho feito.","Essa área é a energia armazenada:|Ee = 20 · 0,1 / 2 = 1 J."]})})();
xy("calc_m059","Simulação: um carro de 1000 kg passa de 10 m/s para 20 m/s; a energia cinética vai de 50 kJ a 200 kJ, e o trabalho da força resultante é essa variação, 150 kJ",{ym:200,xl:"",x0t:"10",xe:"20 m/s",yl:"Ec (kJ)",ye:"200",
 sc:GR+mvg("m0",250,94,car())+t_(160,30,"1000 kg",{s:12}),mv:[[".m0",function(q){return[16+234*(10*q+5*q*q)/15,94]},24]],cv:[cvP(function(q){return 0.5*Math.pow(10+10*q,2)})],
 gs:function(gx,gy){return'<line x1="'+gx(0)+'" y1="'+gy(50)+'" x2="'+gx(1)+'" y2="'+gy(50)+'" stroke="currentColor" stroke-dasharray="4 3" stroke-opacity=".6"/>'+t_(gx(.04),gy(50)+13,"Ec inicial = 50 kJ",{s:10,a:"start"})},
 end:function(gx,gy){return t_(gx(.55),gy(80),"ΔEc = 150 kJ",{s:13})},rd:function(q){return"v = "+f(10+10*q,1)+" m/s  ·  Ec = "+f(.5*Math.pow(10+10*q,2),0)+" kJ"},caps:["O carro acelera de 10 m/s para 20 m/s.|Sua energia cinética cresce.","O trabalho da força resultante é igual|à variação da energia cinética: τ = ΔEc.","Ec inicial = 1000 · 10² / 2 = 50 kJ|Ec final = 1000 · 20² / 2 = 200 kJ|τ = 200 − 50 = 150 kJ."]});
(function(){var A=function(q){var t=2*q;return 14+15*(t<=1?6*t:6+2*(t-1))},B=function(q){var t=2*q;return t<=1?144:144+30*(t-1)};
 xy("calc_m066","Simulação: um bloco de 2 kg a 6 m/s colide com um bloco de 4 kg parado e os dois seguem unidos a 2 m/s; o gráfico mostra a velocidade de cada bloco antes e depois do choque",{ym:6,xl:"",xe:"2 s",yl:"v (m/s)",ye:"6",n:60,
 sc:GR+mvg("m0",A(1),94,blk(0,40,"2 kg"))+mvg("m1",B(1),94,blk(0,48,"4 kg",NEG)),mv:[[".m0",function(q){return[A(q),94]},40],[".m1",function(q){return[B(q),94]},40]],
 cv:[cvP(function(q){return 2*q<=1?6:2}),cvP(function(q){return 2*q<=1?0:2},NEG)],gs:function(gx,gy){return t_(gx(.5),gy(6)-6,"choque",{s:11})+t_(gx(.25),gy(6)-6,"2 kg",{s:11})+t_(gx(.04),gy(0)-6,"4 kg (parado)",{s:11,a:"start",f:NEG})},
 rd:function(q){return"t = "+f(2*q)+" s  ·  v₂ = "+f(2*q<=1?6:2,0)+" m/s  ·  v₄ = "+f(2*q<=1?0:2,0)+" m/s"},caps:["O bloco de 2 kg, a 6 m/s, vai de encontro|ao bloco de 4 kg, que está parado.","No choque os blocos ficam unidos:|a velocidade de um cai e a do outro sobe.","A quantidade de movimento se conserva:|2 · 6 = (2 + 4) · v, logo v = 2 m/s."]})})();

/* ===== gravitação ===== */
(function(){var dd=function(q){return 5+15*q},F=function(q){return 133.4/Math.pow(dd(q),2)};
 xy("calc_m072","Simulação: dois corpos de 1000 kg e 2000 kg se afastam; a força gravitacional entre eles cai com o quadrado da distância e vale 1,3 × 10⁻⁶ N quando a distância é 10 m",{ym:5.34,xl:"",x0t:"5 m",xe:"20 m",yl:"F (10⁻⁶ N)",ye:"5,3",n:60,
 sc:mvg("m0",60,58,'<circle r="10" fill="'+ACC+'" fill-opacity=".6" stroke="currentColor" stroke-width="2"/>'+t_(0,-16,"1000 kg",{s:10}))+mvg("m1",60+6*20,58,'<circle r="14" fill="'+NEG+'" fill-opacity=".5" stroke="currentColor" stroke-width="2"/>'+t_(0,-20,"2000 kg",{s:10}))+t_(160,92,"d de 5 m a 20 m",{s:11}),
 mv:[[".m1",function(q){return[60+6*dd(q),58]},30]],cv:[cvP(F)],
 gs:function(gx,gy){var x=gx(1/3),y=gy(F(1/3));return'<circle cx="'+x+'" cy="'+y+'" r="8" fill="none" stroke="'+NEG+'" stroke-width="2"/>'+t_(x+10,y-10,"d = 10 m: 1,3 × 10⁻⁶ N",{s:10,a:"start"})},
 rd:function(q){return"d = "+f(dd(q))+" m  ·  F = "+f(F(q))+" × 10⁻⁶ N"},caps:["Os corpos se afastam, de 5 m até 20 m.|A força entre eles vai diminuindo.","A força cai com o quadrado da distância:|dobrando a distância, ela cai a 1/4.","A 10 m: F = G · m₁ · m₂ / d²|F = 6,67·10⁻¹¹ · 2·10⁶ / 100|F = 1,3 · 10⁻⁶ N."]})})();
(function(){var g=function(q){return 9.78/Math.pow(1+2*q,2)};
 xy("calc_m075","Simulação: um corpo se afasta da superfície da Terra; a aceleração da gravidade cai com o quadrado da distância ao centro, valendo 9,8 m/s² na superfície",{ym:9.8,xl:"",x0t:"R",xe:"3 R",yl:"g (m/s²)",ye:"9,8",n:60,
 sc:'<circle cx="40" cy="84" r="34" fill="'+ACC+'" fill-opacity=".25" stroke="currentColor" stroke-width="2"/>'+t_(40,88,"Terra",{s:12})+mvg("m0",40+34*3+8,34,'<circle r="6" fill="'+NEG+'" stroke="currentColor" stroke-width="2"/>')+t_(240,22,"distância ao centro: de R a 3 R",{s:11}),
 mv:[[".m0",function(q){return[40+34*(1+2*q)+8,84-50*q]},30]],cv:[cvP(g)],
 gs:function(gx,gy){return'<circle cx="'+gx(0)+'" cy="'+gy(g(0))+'" r="8" fill="none" stroke="'+NEG+'" stroke-width="2"/>'+t_(gx(.05)+8,gy(g(0))+16,"superfície: 9,8 m/s²",{s:10,a:"start"})},
 rd:function(q){return"r = "+f(1+2*q)+" R  ·  g = "+f(g(q))+" m/s²"},caps:["Na superfície da Terra, g ≈ 9,8 m/s².|Afastando-se, ele diminui.","A gravidade cai com o quadrado da|distância ao centro: g = G·M / r².","Na superfície: g = G · M / R²|g = 6,67·10⁻¹¹ · 6·10²⁴ / (6,4·10⁶)²|g ≈ 9,8 m/s²."]})})();

})();
