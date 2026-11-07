/* Mecânica: simulações do FENÔMENO (substituem as resoluções passo a passo).
   O que muda no tempo vira gráfico: o traço é desenhado enquanto o corpo se move. */
(function(){"use strict";
var N=window.AN,t_=N.t,ACC="var(--acc)",NEG="var(--neg)",PI=Math.PI;
function f(n,d){var p=Math.pow(10,d===undefined?2:d);return String(Math.round(n*p)/p).replace(".",",")}
function r(n){return Math.round(n*10)/10}
var uid=0;

/* eixos: x0,y0 = origem; w,h = tamanho; xe/ye = valores nas pontas */
function axes(x0,y0,w,h,xl,yl,xe,ye){
 return'<path d="M'+x0+' '+(y0-h-4)+'V'+y0+'H'+(x0+w+4)+'" fill="none" stroke="currentColor" stroke-width="1.6"/>'+
  t_(x0+w,y0+13,xe+(xl?" "+xl:""),{s:10,a:"end"})+t_(x0-4,y0+4,"0",{s:10,a:"end"})+t_(x0-4,y0-h+4,ye,{s:10,a:"end"})+t_(x0+4,y0-h-8,yl,{s:11,a:"start"})}
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
vert({key:"calc_m019",alt:"Simulação: uma pedra lançada para cima a 30 m/s sobe, desacelera 10 m/s a cada segundo e para a 45 m de altura, após 3 s",y0:0,v0:30,tf:3,hm:45,caps:["A pedra sobe a 30 m/s,|mas a gravidade a freia 10 m/s por segundo.","A subida vai ficando mais lenta:|o gráfico h × t se curva para baixo.","No ponto mais alto v = 0 (em 3 s):|h = 30 · 3 − 5 · 3² = 45 m."]});
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
imp("calc_m064","Simulação: uma força média de 200 N atua por 0,05 s sobre um corpo; no gráfico força × tempo a área do retângulo é o impulso, 10 N·s",{Fl:"200 N",tl:"0,1",imp:"10 N·s",caps:["Uma força de 200 N empurra o corpo|durante um contato curto, de 0,05 s.","No gráfico F × t o traço forma um|retângulo, e sua área vai sendo preenchida.","A área é o impulso:|I = F · Δt = 200 · 0,05 = 10 N·s."]});
imp("calc_m065","Simulação: um chute de 0,01 s lança uma bola de 0,5 kg a 20 m/s; a área do gráfico força × tempo é o impulso, 10 N·s, o que exige uma força média de 1000 N",{Fl:"1000 N",tl:"0,02",imp:"10 N·s",vl:"20 m/s",caps:["O pé toca a bola parada por só 0,01 s.|Durante o contato atua uma força grande.","Depois do chute a bola sai a 20 m/s:|sua quantidade de movimento vai de 0 a 10.","A área de F × t é o impulso:|I = m·Δv = 0,5 · 20 = 10 N·s|F = 10 / 0,01 = 1000 N."]});
(function(){
 var T0=1.4,D=4,T=T0+D+3.4,H=226,svg='<line x1="10" y1="96" x2="310" y2="96" stroke="currentColor" stroke-width="2"/>'+
  '<g class="bl"><g transform="translate(214 0)"><circle cx="0" cy="82" r="14" fill="'+ACC+'" fill-opacity=".6" stroke="currentColor" stroke-width="2"/>'+arr(20,64,82,"v = 15 m/s",NEG)+'</g></g>'+
  '<g>'+arr(30,30+6*5,120,"Q = 6 kg·m/s","currentColor")+'</g>'+t_(160,136,"Q = m · v  (0,4 kg · 15 m/s)",{s:12});
 var rd=readout("rd",160,function(q){return"t = "+f(q*2,1)+" s  ·  x = "+f(q*30,0)+" m"},4,T0,D,T);
 mk("calc_m063","Simulação: uma bola de 0,4 kg rola a 15 m/s; sua quantidade de movimento é um vetor na mesma direção da velocidade, de módulo m·v = 6 kg·m/s",H,svg+rd.s,[N.tr(".bl",T,[[T0,-180,0],[T0+D,0,0]],"linear")].concat(rd.t),T,["A bola de 0,4 kg se move a 15 m/s.|A seta vermelha é a velocidade.","A quantidade de movimento Q é um vetor|com a mesma direção da velocidade.","Q = m · v = 0,4 · 15 = 6 kg·m/s."],[0,T0,T0+D+.2])})();
})();
