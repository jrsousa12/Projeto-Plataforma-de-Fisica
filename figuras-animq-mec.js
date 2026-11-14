/* Mecânica: animações. */
(function(){"use strict";
var N=window.AN,t_=N.t,PI=Math.PI;
var RC="var(--acc)",NG="var(--neg)";
var ray=N.raio; /* kit: figuras-anim-kit.js */
var dsh=N.tracejado; /* kit: figuras-anim-kit.js */
function dot(x,y,r,fill){return'<circle cx="'+x+'" cy="'+y+'" r="'+(r||5)+'" fill="'+(fill||"currentColor")+'"/>'}

/* ---- queda livre: posições a cada segundo ---- */
(function(){var k=3.6,ys=[22,22+5*k,22+20*k,22+45*k],s='<line x1="60" y1="14" x2="60" y2="'+(ys[3]+16)+'" stroke="currentColor" stroke-opacity=".35"/>';
 var lab=["t = 0","t = 1 s","t = 2 s","t = 3 s"],dd=["","5 m","20 m","45 m"];
 for(var i=0;i<4;i++){var c=i===0?"":"s"+(i<3?2:3);
  s+='<g class="'+c+'">'+dot(60,ys[i],7,RC)+t_(110,ys[i]+4,lab[i],{s:12,a:"start"})+(dd[i]?t_(200,ys[i]+4,dd[i],{s:12,a:"start"}):"")+'</g>'}
 s+='<g class="s3">'+ray(40,ys[3]-30,40,ys[3]-2,"",NG)+t_(22,ys[3]-14,"v",{s:12})+'</g>';
 N.calc("mec_queda","Animação: um corpo solto do repouso cai em queda livre; as distâncias percorridas até cada segundo são 5 m, 20 m e 45 m, e a velocidade aumenta 10 m/s a cada segundo",{h:Math.round(ys[3]+34),s:s,
  steps:[[0,"Um corpo é solto do repouso|e cai em queda livre."],[3,"A cada segundo ele percorre mais:|5 m, 20 m, 45 m (h = g·t²/2)."],[6,"A velocidade cresce 10 m/s por segundo:|v = g·t."]]})})();

/* ---- lançamento oblíquo ---- */
(function(){var s='<line x1="20" y1="140" x2="300" y2="140" stroke="currentColor" stroke-opacity=".4"/><path d="M40 140Q160 -20 280 140" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="2" stroke-dasharray="6 4"/>';
 s+=dot(40,140,5,RC)+ray(40,140,88,98,"",RC)+t_(98,98,"v₀",{s:12,a:"start"});
 s+='<g class="s2">'+dsh(160,60,160,140,"")+dot(160,60,5,RC)+ray(160,60,214,60,"",NG)+t_(224,56,"vx",{s:12,a:"start"})+t_(174,100,"vy = 0",{s:11,a:"start"})+'</g>';
 s+='<g class="s3">'+ray(280,140,306,176,"",NG)+t_(264,166,"vy",{s:12})+'</g>';
 N.calc("mec_obliquo","Animação: lançamento oblíquo; no ponto mais alto a componente vertical da velocidade é nula e a horizontal se mantém constante",{h:196,s:s,
  steps:[[0,"O projétil sai com velocidade inclinada|e segue uma parábola."],[3,"No ponto mais alto, vy = 0.|Só resta a componente horizontal vx."],[6,"A componente horizontal é constante:|na vertical, a gravidade atua."]]})})();

/* ---- movimento circular uniforme ---- */
(function(){var cx=160,cy=84,R=56,s='<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="2"/>'+dot(cx,cy,3)+t_(cx-12,cy+16,"C",{s:11});
 s+=dot(cx+R,cy,6,RC)+'<g class="s2">'+ray(cx+R,cy,cx+R,cy-44,"",NG)+t_(cx+R+14,cy-30,"v",{s:13,a:"start"})+'</g>';
 s+='<g class="s3">'+ray(cx+R,cy,cx+R-42,cy,"",RC)+t_(cx+R-20,cy-12,"a",{s:13})+'</g>';
 N.calc("mec_mcu","Animação: movimento circular uniforme; a velocidade é tangente à trajetória e a aceleração centrípeta aponta para o centro",{h:176,s:s,
  steps:[[0,"No MCU, o corpo percorre uma circunferência|com velocidade de módulo constante."],[3,"A velocidade v é tangente à trajetória:|a direção muda o tempo todo."],[6,"A aceleração centrípeta aponta para o centro:|a = v²/R."]]})})();

/* ---- plano inclinado ---- */
(function(){var th=Math.atan2(100,190),ux=Math.cos(th),uy=-Math.sin(th),nx=-Math.sin(th)*-1*-1,ny=0;
 /* u: sobe o plano; n: normal para fora (cima e à esquerda) */
 var nxv=uy,nyv=-ux; /* (-sen, -cos) */
 var bx=140,by=96,cx=bx+nxv*12,cy=by+nyv*12; /* centro do bloco */
 var s='<path d="M40 150L250 50L250 150Z" fill="var(--acc)" fill-opacity=".1" stroke="currentColor" stroke-width="2"/>'+
  '<g transform="rotate('+(-th*180/PI).toFixed(1)+' '+bx+' '+by+')"><rect x="'+(bx-20)+'" y="'+(by-24)+'" width="40" height="24" fill="var(--acc)" fill-opacity=".35" stroke="currentColor" stroke-width="1.8"/></g>'+
  ray(cx,cy,cx,cy+40,"",NG)+t_(cx+9,cy+48,"P",{s:12,a:"start"});
 s+='<g class="s2">'+ray(cx,cy,cx+nxv*38,cy+nyv*38,"",RC)+t_(cx+nxv*38-10,cy+nyv*38-4,"N",{s:12})+'</g>';
 s+='<g class="s3">'+ray(cx,cy,cx-ux*20,cy-uy*20,"",NG,1)+t_(cx-ux*20-18,cy-uy*20+12,"Px",{s:11})+ray(cx,cy,cx-nxv*34,cy-nyv*34,"",NG,1)+t_(cx-nxv*34+16,cy-nyv*34+10,"Py",{s:11})+'</g>';
 N.calc("mec_incl","Animação: bloco em um plano inclinado; o peso se decompõe em Px, paralela ao plano, e Py, perpendicular a ele, equilibrada pela normal",{h:176,s:s,
  steps:[[0,"Sobre o bloco atuam o peso P|e a normal N, perpendicular ao plano."],[3,"A normal N é perpendicular|à superfície do plano."],[6,"O peso se decompõe: Px = P·sen θ (ao longo do plano)|e Py = P·cos θ (perpendicular)."]]})})();
})();
