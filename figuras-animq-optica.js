/* Óptica Geométrica: animações. */
(function(){"use strict";
var N=window.AN,t_=N.t,PI=Math.PI;
var RC="var(--acc)";
function ray(x1,y1,x2,y2,cl,col,dash){var a=Math.atan2(y2-y1,x2-x1),h=7,mx=(x1+x2)/2,my=(y1+y2)/2,p=function(r,b){return(mx+r*Math.cos(a+b)).toFixed(1)+" "+(my+r*Math.sin(a+b)).toFixed(1)};
 return'<g class="'+(cl||"")+'"><line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+(col||RC)+'" stroke-width="2.4"'+(dash?' stroke-dasharray="5 4"':'')+'/><path d="M'+p(h,0)+'L'+p(h,2.6)+'L'+p(h,-2.6)+'Z" fill="'+(col||RC)+'"/></g>'}
function dsh(x1,y1,x2,y2,cl){return'<g class="'+(cl||"")+'"><line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="currentColor" stroke-opacity=".5" stroke-dasharray="4 3"/></g>'}
function pt(x,y,lab,dy){return'<circle cx="'+x+'" cy="'+y+'" r="3.5" fill="currentColor"/>'+t_(x,y+(dy||16),lab,{s:11})}

/* ---- reflexão no espelho plano ---- */
N.calc("opt_plano","Animação: um raio de luz incide em um espelho plano e é refletido; o ângulo de incidência é igual ao ângulo de reflexão, medidos em relação à normal",{h:176,
 s:'<line x1="60" y1="110" x2="260" y2="110" stroke="currentColor" stroke-width="4"/>'+ray(80,35,160,110,"",RC)+dsh(160,28,160,110,"s2")+'<g class="s3">'+ray(160,110,240,35,"","var(--neg)")+t_(139,82,"î",{s:13})+t_(181,82,"r̂",{s:13})+'</g>'+t_(160,126,"espelho",{s:10}),
 steps:[[0,"Um raio de luz incide no espelho plano."],[3,"A normal é a reta perpendicular|ao espelho no ponto de incidência."],[6,"O raio refletido sai com r̂ = î."]]});

/* ---- espelho côncavo ---- */
/* corrigido: F em x=195.5 (ponto médio entre V=262 e C=129); raios refletidos recalculados para cruzar em F. — ref. Moysés Vol. 4 Cap. 1 */
N.calc("opt_concavo","Animação: raios paralelos ao eixo principal de um espelho côncavo são refletidos passando pelo foco; por isso o espelho côncavo é convergente e a distância focal é a metade do raio de curvatura",{h:196,
 s:'<line x1="20" y1="70" x2="290" y2="70" stroke="currentColor" stroke-opacity=".4"/><path d="M262 22Q236 70 262 118" fill="none" stroke="currentColor" stroke-width="4"/>'+pt(129,70,"C")+pt(195.5,70,"F")+t_(249,52,"V",{s:11})+'<g class="s2">'+ray(40,40,254,40,"",RC)+ray(254,40,115.5,111,"","var(--neg)")+ray(40,100,254,100,"",RC)+ray(254,100,115.5,29,"","var(--neg)")+'</g><g class="s3">'+N.dm(195.5,249,148,"f = R/2","")+'</g>',
 steps:[[0,"Espelho côncavo: a face refletora|está voltada para o centro C."],[3,"Raios paralelos ao eixo principal|refletem passando pelo foco F."],[6,"Por isso ele é convergente: f = R/2."]]});

/* ---- refração (Snell) ---- */
N.calc("opt_snell","Animação: um raio de luz passa do ar para o vidro, de maior índice de refração, muda de direção e se aproxima da normal",{h:178,
 s:'<rect x="40" y="75" width="240" height="60" fill="var(--acc)" fill-opacity=".14"/><line x1="40" y1="75" x2="280" y2="75" stroke="currentColor" stroke-width="2"/>'+dsh(160,18,160,134,"")+t_(70,20,"ar (n₁ menor)",{s:11,a:"start"})+t_(70,128,"vidro (n₂ maior)",{s:11,a:"start"})+ray(80,22,160,75,"",RC)+'<g class="s2">'+ray(160,75,194,128,"","var(--neg)")+'</g><g class="s3">'+t_(133,60,"θ₁",{s:12})+t_(176,108,"θ₂",{s:12})+'</g>',
 steps:[[0,"O raio vai do ar (n menor)|para o vidro (n maior)."],[3,"Ele muda de direção e se aproxima da normal."],[6,"n₁ · sen θ₁ = n₂ · sen θ₂ (θ₂ < θ₁)"]]});

/* ---- reflexão total ---- */
(function(){var s='<rect x="20" y="75" width="280" height="58" fill="var(--acc)" fill-opacity=".14"/><line x1="20" y1="75" x2="300" y2="75" stroke="currentColor" stroke-width="2"/>';
 [70,160,250].forEach(function(x){s+=dsh(x,30,x,122,"")});
 s+=ray(54.6,117.3,70,75,"",RC)+ray(70,75,93.1,38.7,"","var(--neg)");
 s+='<g class="s2">'+ray(160-30,75+33.6,160,75,"",RC)+ray(160,75,210,75,"","var(--neg)")+t_(160,26,"θ = L",{s:11})+'</g>';
 s+='<g class="s3">'+ray(250-39,75+22.5,250,75,"",RC)+ray(250,75,289,97.5,"","var(--neg)")+t_(250,26,"θ > L",{s:11})+'</g>';
 s+=t_(70,26,"θ < L",{s:11})+t_(160,146,"meio mais refringente",{s:10});
 N.calc("opt_total","Animação: um raio que vai do meio mais refringente para o menos refringente sai afastando-se da normal; no ângulo limite emerge rasante; acima dele sofre reflexão total",{h:190,s:s,
  steps:[[0,"Ângulo pequeno: o raio sai afastando-se da normal."],[3,"No ângulo limite L, ele emerge rasante:|sen L = n₂ / n₁."],[6,"Acima de L não há refração: reflexão total."]]})})();

/* ---- lente convergente ---- */
N.calc("opt_lente","Animação: raios paralelos ao eixo principal de uma lente convergente se refratam e passam pelo foco",{h:176,
 s:'<line x1="20" y1="75" x2="300" y2="75" stroke="currentColor" stroke-opacity=".4"/><path d="M160 22C190 60 190 90 160 128C130 90 130 60 160 22Z" fill="var(--acc)" fill-opacity=".18" stroke="currentColor" stroke-width="2.4"/>'+pt(100,75,"F")+pt(220,75,"F'")+'<g class="s2">'+ray(40,45,160,45,"",RC)+ray(160,45,290,111,"","var(--neg)")+ray(40,105,160,105,"",RC)+ray(160,105,290,39,"","var(--neg)")+'</g><g class="s3">'+N.dm(160,220,142,"f","")+'</g>',
 steps:[[0,"Lente convergente (bordas finas)|no ar."],[3,"Raios paralelos ao eixo principal|se refratam e passam por F'."],[6,"Vergência: V = 1/f (em dioptrias)."]]});
})();
