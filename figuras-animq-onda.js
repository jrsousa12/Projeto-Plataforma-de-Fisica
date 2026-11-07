/* Ondulatória (Som): animações. */
(function(){"use strict";
var N=window.AN,t_=N.t,PI=Math.PI;
function C(key,alt,H,s,tr,T,caps,times){N.scene(key,alt,H,s,tr,T,caps,times)}
function sinp(x0,x1,y,A,lam,ph,st){var p="",x;st=st||3;for(x=x0;x<=x1+.01;x+=st)p+=(x===x0?"M":"L")+x.toFixed(1)+" "+(y-A*Math.sin(2*PI*(x-x0)/lam+(ph||0))).toFixed(1);return p}
function env(x0,L,y,A,fn){var p="",i,n=60;for(i=0;i<=n;i++){var x=x0+L*i/n;p+=(i?"L":"M")+x.toFixed(1)+" "+(y-A*fn(i/n)).toFixed(1)}return p}
var FL='style="transform-box:fill-box;transform-origin:50% 50%"';

/* ---- som: onda longitudinal ---- */
(function(){var T=9,H=130,s='',tr=[],i,j;
 s+='<line x1="14" y1="48" x2="306" y2="48" stroke="currentColor" stroke-opacity=".25"/>';
 for(i=0;i<16;i++){var x=24+i*18,pts=[];for(j=0;j<=18;j++){pts.push([j*T/18,6*Math.sin(2*PI*(j/18*4.5-i/8))*(j<2?j/2:1),0])}
  s+='<circle class="d'+i+'" cx="'+x+'" cy="48" r="4.5" fill="var(--acc)"/>';tr.push(N.tr(".d"+i,T,pts,"linear"))}
 s+='<g class="s2">'+N.arrow(120,200,86,"an-a3",3)+t_(160,108,"propagação",{s:11})+'</g>';
 C("som_long","Animação: as partículas do ar vibram para frente e para trás na direção em que a onda sonora avança, formando regiões de compressão e de rarefação",H,s,tr,T,["O som é uma onda mecânica longitudinal.|As partículas vibram na direção da propagação.","Formam-se compressões (partículas juntas)|e rarefações (partículas afastadas).","Sem meio material não há som: ele não se propaga no vácuo."],[0,3,6])})();

/* ---- qualidades: altura, intensidade e timbre ---- */
(function(){var T=8,H=250,s='<defs><clipPath id="qcl"><rect x="20" y="0" width="280" height="250"/></clipPath></defs><g clip-path="url(#qcl)">',tr=[];
 function comp(x0,x1,y,A,lam,st){var p="",x,u;for(x=x0;x<=x1+.01;x+=st){u=2*PI*(x-x0)/lam;p+=(x===x0?"M":"L")+x.toFixed(1)+" "+(y-A*(Math.sin(u)+.5*Math.sin(2*u)+.3*Math.sin(3*u))/1.55).toFixed(1)}return p}
 var rows=[[38,10,70,"Grave: baixa frequência"],[92,10,35,"Agudo: alta frequência"],[154,24,70,"Forte: maior amplitude (mesma altura do grave)"]];
 rows.forEach(function(r,k){s+='<g class="w'+k+'"><path d="'+sinp(-100,420,r[0],r[1],r[2],0,3)+'" fill="none" stroke="var(--acc)" stroke-width="2.4"/></g>';tr.push(N.tr(".w"+k,T,[[0,0,0],[T,-r[2]*2,0]],"linear"))});
 s+='<g class="w3"><path d="'+comp(-100,420,222,20,70,3)+'" fill="none" stroke="var(--neg)" stroke-width="2.4"/></g>';tr.push(N.tr(".w3",T,[[0,0,0],[T,-140,0]],"linear"));
 s+='</g>';rows.forEach(function(r){s+=t_(24,r[0]-r[1]-5,r[3],{s:10,a:"start"})});s+=t_(24,190,"Timbre: mesma altura, outra forma de onda",{s:10,a:"start"});
 C("qualid","Animação: quatro ondas sonoras; a de menor frequência é grave, a de maior frequência é aguda, a de maior amplitude é mais forte, e uma onda com a mesma frequência da grave, mas com outra forma, tem outro timbre",H,s,tr,T,["Altura: depende da frequência (grave ou agudo).","Intensidade: depende da amplitude (fraco ou forte).","Timbre: depende da forma da onda|e distingue as fontes."],[0,2.5,5])})();

/* ---- eco / sonar: ida e volta ---- */
(function(){var T=10,H=120,s='',tr=[];
 s+='<circle cx="34" cy="60" r="9" fill="currentColor" fill-opacity=".7"/>'+t_(34,86,"fonte",{s:10});
 s+='<rect x="262" y="26" width="12" height="68" fill="currentColor" fill-opacity=".45" stroke="currentColor"/>'+t_(268,108,"obstáculo",{s:10});
 s+=N.dm(34,268,20,"d","");
 s+='<circle class="go" cx="44" cy="60" r="6" fill="var(--acc)"/>';tr.push(N.tr(".go",T,[[0,0,0],[4,214,0],[4.2,214,0]],"linear"));tr.push(N.op(".go",T,[[0,1],[4,1],[4.2,0]]));
 s+='<circle class="bk" cx="256" cy="60" r="6" fill="var(--neg)" opacity="0"/>';tr.push(N.tr(".bk",T,[[0,0,0],[4,0,0],[8,-212,0]],"linear"));tr.push(N.op(".bk",T,[[0,0],[4,0],[4.2,1],[8,1]]));
 C("eco_ida","Animação: o som vai da fonte até o obstáculo e volta à fonte; a distância percorrida é o dobro da distância até o obstáculo",H,s,tr,T,["O som vai até o obstáculo: distância d.","Ele reflete e volta: mais d.","Percurso total: 2d = v · Δt."],[0,3.8,7.5])})();

/* ---- Doppler ---- */
(function(){var T=10,H=170,s='',tr=[],cx=[70,100,130,160],rr=[54,40,26,12],te=[0,2.2,4.4,6.6],i;
 for(i=0;i<4;i++){s+='<circle class="c'+i+'" cx="'+cx[i]+'" cy="70" r="'+rr[i]+'" fill="none" stroke="var(--acc)" stroke-width="2" '+FL+'/>';tr.push(N.sc(".c"+i,T,[[0,0],[te[i],0],[T,1]],"linear"))}
 s+='<g class="src"><circle cx="160" cy="70" r="7" fill="var(--neg)"/>'+N.arrow(172,200,70,"an-a3",3)+'</g>';tr.push(N.tr(".src",T,[[0,-90,0],[6.6,0,0],[T,0,0]],"linear"));
 s+='<circle cx="40" cy="70" r="6" fill="currentColor" fill-opacity=".6"/><circle cx="280" cy="70" r="6" fill="currentColor" fill-opacity=".6"/>';
 s+='<g class="s2">'+t_(280,138,"f' maior",{s:11})+t_(280,152,"(mais agudo)",{s:10})+'</g><g class="s3">'+t_(40,138,"f' menor",{s:11})+t_(40,152,"(mais grave)",{s:10})+'</g>';
 C("doppler","Animação: uma fonte sonora se move para a direita; as frentes de onda ficam mais próximas à frente e mais afastadas atrás, de modo que o observador à frente ouve som mais agudo e o de trás, mais grave",H,s,tr,T,["A fonte se move para a direita emitindo ondas.","À frente, as frentes ficam mais próximas:|λ menor, frequência percebida maior.","Atrás, ficam mais afastadas:|λ maior, frequência percebida menor."],[0,3,6.8])
 var A=window.ANIM.doppler;A.t.push(N.vis(".s2",T,3),N.vis(".s3",T,6.8))})();

/* ---- onda de choque (cone de Mach) ---- */
(function(){var T=10,H=170,s='',tr=[],cx=[80,110,140,170],rr=[72,54,36,18],te=[0,2,4,6],i;
 for(i=0;i<4;i++){s+='<circle class="c'+i+'" cx="'+cx[i]+'" cy="85" r="'+rr[i]+'" fill="none" stroke="var(--acc)" stroke-width="1.8" '+FL+'/>';tr.push(N.sc(".c"+i,T,[[0,0],[te[i],0],[T,1]],"linear"))}
 s+='<g class="cone"><path d="M200 85L96 11M200 85L96 159" stroke="var(--neg)" stroke-width="2.4" fill="none"/></g>';tr.push(N.vis(".cone",T,7));
 s+='<g class="src"><circle cx="200" cy="85" r="7" fill="var(--neg)"/>'+N.arrow(212,246,85,"an-a3",3)+'</g>';tr.push(N.tr(".src",T,[[0,-120,0],[6,0,0],[T,0,0]],"linear"));
 s+='<g class="s3">'+t_(268,40,"sen θ = 1/M",{s:12})+t_(268,56,"M = vfonte / vsom",{s:10})+'</g>';tr.push(N.vis(".s3",T,8));
 C("mach","Animação: uma fonte mais rápida que o som deixa para trás frentes de onda que se acumulam em um cone, a onda de choque; o estrondo acompanha toda a trajetória",H,s,tr,T,["A fonte é mais rápida que as ondas que emite.","As frentes de onda se acumulam em um cone.","A onda de choque acompanha todo o voo supersônico."],[0,3,7])})();

/* ---- ondas estacionárias ---- */
(function(){var T=10,H=170,s='',tr=[];
 s+='<path d="'+env(40,240,80,44,function(u){return Math.sin(2*PI*u)})+'" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="4 3"/>';
 s+='<path d="'+env(40,240,80,44,function(u){return -Math.sin(2*PI*u)})+'" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="4 3"/>';
 s+='<path class="st" d="'+env(40,240,80,44,function(u){return Math.sin(2*PI*u)})+'" fill="none" stroke="var(--acc)" stroke-width="3" '+FL+'/>';
 tr.push(N.sc(".st",T,[[0,1,1],[1,1,-1],[2,1,1],[3,1,-1],[4,1,1],[5,1,-1],[6,1,1],[7,1,-1],[8,1,1],[9,1,-1],[10,1,1]],"ease-in-out"));
 [40,160,280].forEach(function(x){s+='<circle cx="'+x+'" cy="80" r="4" fill="var(--neg)"/>'});
 s+='<g class="s2">'+t_(40,134,"nó",{s:11})+t_(160,134,"nó",{s:11})+t_(280,134,"nó",{s:11})+t_(100,22,"ventre",{s:11})+t_(220,22,"ventre",{s:11})+'</g>';tr.push(N.vis(".s2",T,3));
 s+='<g class="s3">'+N.dm(40,160,148,"λ/2","")+'</g>';tr.push(N.vis(".s3",T,6.5));
 C("estac","Animação: uma corda presa nas duas pontas vibra com dois fusos; os pontos fixos são nós e os pontos de maior vibração são ventres, e a distância entre dois nós consecutivos é meio comprimento de onda",H,s,tr,T,["Duas ondas iguais, em sentidos opostos,|se superpõem na corda.","Surgem nós (amplitude nula) e ventres (amplitude máxima).","Entre dois nós consecutivos há λ/2."],[0,3,6.5])})();

/* ---- tubos aberto e fechado ---- */
(function(){var T=10,H=190,s='',tr=[],L=210,x0=60;
 function tubo(y,fechado){return'<path d="M'+x0+' '+(y-24)+'H'+(x0+L)+(fechado?'V'+(y+24):'')+'M'+x0+' '+(y+24)+'H'+(x0+L)+'" fill="none" stroke="currentColor" stroke-width="2.5"/>'}
 s+=tubo(48,false)+tubo(122,true);
 s+='<path class="o1" d="'+env(x0,L,48,22,function(u){return Math.cos(PI*u)})+'" fill="none" stroke="var(--acc)" stroke-width="3" '+FL+'/>';
 s+='<path class="f1" d="'+env(x0,L,122,22,function(u){return Math.cos(PI*u/2)})+'" fill="none" stroke="var(--acc)" stroke-width="3" '+FL+'/>';
 s+='<path class="f3" d="'+env(x0,L,122,22,function(u){return Math.cos(3*PI*u/2)})+'" fill="none" stroke="var(--neg)" stroke-width="2.4" stroke-dasharray="5 3" '+FL+'/>';
 [["o1",48],["f1",122],["f3",122]].forEach(function(a){var k=a[0],pts=[],j;for(j=0;j<=20;j++)pts.push([j*.5,Math.cos(PI*j/2)*1]);tr.push(N.sc("."+k,T,pts.map(function(p){return[p[0],1,p[1]]}),"linear"))});
 tr.push(N.vis(".f3",T,6));tr.push(N.op(".f1",T,[[0,1],[6,1],[6.4,.35]]));
 s+=t_(x0-6,52,"aberto",{s:10,a:"end"})+t_(x0-6,126,"fechado",{s:10,a:"end"});
 s+='<g class="s2">'+t_(x0+L-4,172,"nó na ponta fechada",{s:10,a:"end"})+'</g>';tr.push(N.vis(".s2",T,3));
 C("tubos","Animação: no tubo aberto há ventres de deslocamento nas duas pontas; no tubo fechado há um nó na ponta fechada e um ventre na aberta, o que permite apenas harmônicos ímpares",H,s,tr,T,["Tubo aberto: ventres nas duas pontas.|Todos os harmônicos.","Tubo fechado: nó na ponta fechada, ventre na aberta.","Por isso só harmônicos ímpares: 1º, 3º, 5º…"],[0,3,6])})();
})();
