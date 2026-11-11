/* Biblioteca das simulações do fenômeno (corpo/cena + gráfico desenhado no tempo). */
(function(){"use strict";
var N=window.AN,t_=N.t,ACC="var(--acc)",NEG="var(--neg)",PI=Math.PI;
function f(n,d){var p=Math.pow(10,d===undefined?2:d);return String(Math.round(n*p)/p).replace(".",",")}
function r(n){return Math.round(n*10)/10}
var uid=0;

/* eixos: x0,y0 = origem; w,h = tamanho; xe/ye = valores nas pontas */
function axes(x0,y0,w,h,xl,yl,xe,ye,x0t){
 return'<path d="M'+x0+' '+(y0-h-4)+'V'+y0+'H'+(x0+w+4)+'" fill="none" stroke="currentColor" stroke-width="1.6"/>'+
  t_(x0+w,y0+13,xe+(xl?" "+xl:""),{s:10,a:"end"})+t_(x0-4,y0+4,"0",{s:10,a:"end"})+(x0t?t_(x0,y0+13,x0t,{s:10,a:"start"}):"")+t_(x0-4,y0-h+4,ye,{s:10,a:"end"})+t_(x0+4,y0-h-8,yl,{s:11,a:"start"})}
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
 if(o.y0t)svg+=t_(gx(0)+6,gy(o.cv[0].Y(0))-7,o.y0t,{s:10,a:"start"});
 if(o.end)svg+='<g class="en">'+o.end(gx,gy)+'</g>',tr.push(N.vis(".en",T,T0+D));
 var rd=readout("rd",226,o.rd,o.nr||4,T0,D,T);
 mk(key,alt,H,svg+rd.s,tr.concat(rd.t),T,o.caps,[0,T0,T0+D+.2])}
/* ===== barras (comparações) ===== */
function bars(key,alt,o){
 var T0=1.2,T=T0+4+3.4,H=262,y0=174,h=110,svg='<line x1="30" y1="'+y0+'" x2="290" y2="'+y0+'" stroke="currentColor" stroke-width="2"/>',tr=[],xs=[80,200];
 o.b.forEach(function(b,i){var bh=h*b.v/o.ym;
  svg+='<rect class="b'+i+'" x="'+(xs[i]-28)+'" y="'+(y0-bh)+'" width="56" height="'+bh+'" fill="'+b.col+'" fill-opacity=".5" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:50% 100%"/>'+
   '<g class="v'+i+'">'+t_(xs[i],y0-bh-8,b.txt,{s:13})+'</g>'+t_(xs[i],y0+16,b.lab,{s:12})+t_(xs[i],y0+30,b.lab2,{s:11});
  tr.push(N.sc(".b"+i,T,[[T0+i*1.2,1,0],[T0+i*1.2+1.8,1,1]],"ease-out"),N.vis(".v"+i,T,T0+i*1.2+1.8))});
 mk(key,alt,H,svg,tr,T,o.caps,[0,T0,T0+4.2])}
var GR='<line x1="10" y1="94" x2="310" y2="94" stroke="currentColor" stroke-width="2"/>';var cvP=function(Y,c){return{Y:Y,col:c}};

window.FEN={N:N,xy:xy,bars:bars,mvg:mvg,cvP:cvP,GR:GR,axes:axes,curve:curve,draw:draw,grow:grow,trk:trk,mk:mk,readout:readout,f:f,r:r,ACC:ACC,NEG:NEG,t_:t_,arr:arr,blk:blk,car:car};
})();
