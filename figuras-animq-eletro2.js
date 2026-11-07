/* Eletrostática: animações novas (lote 1: eletrização, condução e descargas). */
(function(){"use strict";
var N=window.AN,t_=N.t,E=N.el,P=N.pl;
var WOOL='fill="#d9c7a0" fill-opacity=".75" stroke="currentColor" stroke-width="1.5"',PLAS='fill="#9cc3ec" fill-opacity=".6" stroke="currentColor" stroke-width="1.5"',METAL='fill="#9aa6b8" fill-opacity=".55" stroke="currentColor" stroke-width="1.5"';
function sh(a,dx,dy){return[a[0]+dx,a[1]+dy]}

/* ---- atrito: lã e plástico ---- */
(function(){var T=14,H=178,tr=[],s='',i,xs=[100,140,180,220],a=[];
 s+='<rect x="40" y="94" width="230" height="42" rx="10" '+WOOL+'/>'+N.nd(48,98,214,34)+t_(155,150,"lã",{s:11});
 s+='<rect x="70" y="58" width="200" height="28" rx="12" '+PLAS+'/>'+N.nd(80,62,180,20)+t_(62,76,"plástico",{s:11,a:"end"});
 for(i=0;i<4;i++)s+=P(xs[i]-8,116,"wp");
 s+='<g class="rub"><path d="M96 154h46M96 154l8-5M96 154l8 5M142 154l-8-5M142 154l-8 5" fill="none" stroke="currentColor" stroke-width="2"/></g>';
 tr.push(N.tr(".rub",T,[[0,0,0],[.7,12,0],[1.4,-12,0],[2.1,12,0],[2.8,-12,0],[3.5,12,0],[4.2,-12,0],[5,12,0],[5.8,0,0]]));
 tr.push(N.op(".rub",T,[[0,1],[6.4,1],[6.8,0]]));
 for(i=0;i<4;i++){var st=1.8+1.1*i;a.push(st+1.9);s+=E(xs[i]+10,72,"ee"+i);tr.push(N.tr(".ee"+i,T,[[0,-10,44],[st,-10,44],[st+.9,-16,20],[st+1.9,0,0]]))}
 var c1=N.seq("qp",100,38,["plástico: 0","plástico: −1e","plástico: −2e","plástico: −3e","plástico: −4e"],[0,a[0],a[1],a[2],a[3]],T,{s:12}),c2=N.seq("cw",230,38,["lã: 0","lã: +1e","lã: +2e","lã: +3e","lã: +4e"],[0,a[0],a[1],a[2],a[3]],T,{s:12});
 s+=c1.s+c2.s+t_(155,172,"Total: (−4e) + (+4e) = 0",{s:12,c:"tot"});tr=tr.concat(c1.t,c2.t);tr.push(N.vis(".tot",T,a[3]+.8));
 N.scene("atrito_transfer","Animação: ao atritar o plástico com a lã, quatro elétrons passam da lã para o plástico; o plástico fica negativo, a lã fica positiva e a carga total continua zero",H,s,tr,T,["Plástico e lã estão neutros.|Esfregando, os dois se atritam","Elétrons passam da lã para o plástico:|só os elétrons se movem, os prótons ficam","O plástico ganhou elétrons (−);|a lã perdeu elétrons (+)","As cargas finais são iguais e opostas:|a carga total se conserva (zero)"],[0,1.6,4.4,a[3]+.8])})();

/* ---- contato com bastão negativo ---- */
function contato(key,alt,pos){var T=11,H=176,tr=[],s='',i,sx=232,sy=84,R=40,rx=88,n=6;
 s+='<circle cx="'+sx+'" cy="'+sy+'" r="'+R+'" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>'+N.nd(sx-30,sy-30,60,60,15)+t_(sx,sy+R+16,"esfera metálica neutra",{s:11});
 s+='<g class="rod"><rect x="'+rx+'" y="70" width="104" height="28" rx="8" class="'+(pos?"an-rp":"an-rn")+'"/>';
 for(i=0;i<n;i++){var x=rx+14+i*15;s+=pos?P(x,84,""):(i<3?E(x,84,""):"")}
 var inside=[[sx-14,sy-14],[sx+10,sy-6],[sx-6,sy+14]],mv='',sp='';
 if(!pos){for(i=0;i<3;i++){var fx=rx+14+(3+i)*15,ox=inside[i][0]-fx,oy=inside[i][1]-84;mv+=N.el(inside[i][0],inside[i][1],"m"+i);tr.push(N.tr(".m"+i,T,[[0,-ox-80,-oy],[2.6,-ox,-oy],[3.4+.7*i,-ox,-oy],[5.2+.7*i,0,0]]))}}
 else{for(i=0;i<3;i++){var fx2=rx+14+(3+i)*15,ox2=inside[i][0]-fx2,oy2=inside[i][1]-84;sp+=P(inside[i][0]-3,inside[i][1],"");mv+=N.el(fx2,84,"m"+i);tr.push(N.tr(".m"+i,T,[[0,ox2,oy2],[3.4+.7*i,ox2,oy2],[5.2+.7*i,0,0]]))}}
 s+='</g>'+mv+sp;
 tr.push(N.tr(".rod",T,[[0,-80,0],[2.6,0,0]]));
 var t3=[5.2+1.4+.4,5.2+.7+.4,5.2+.4];
 var rc=pos?["bastão: +6e","bastão: +3e"]:["bastão: −6e","bastão: −3e"],sc=pos?["esfera: 0","esfera: +3e"]:["esfera: 0","esfera: −3e"],tf=6.9;
 var q1=N.seq("rq",90,34,rc,[0,tf],T,{s:12}),q2=N.seq("sq",232,34,sc,[0,tf],T,{s:12});
 s+=q1.s+q2.s;tr=tr.concat(q1.t,q2.t);
 s+=t_(160,158,pos?"A esfera cedeu elétrons: ficou positiva":"A esfera recebeu elétrons: ficou negativa",{s:11,c:"fin"});tr.push(N.vis(".fin",T,tf+.4));
 N.scene(key,alt,H,s,tr,T,pos?["Bastão positivo (falta de elétrons)|e esfera metálica neutra","Ao tocar, os elétrons livres da esfera|são atraídos para o bastão","O contato equilibra a carga: a esfera|fica positiva, como o bastão"]:["Bastão negativo (excesso de elétrons)|e esfera metálica neutra","Ao tocar, o excesso de elétrons se repele|e parte passa para a esfera","O contato equilibra a carga: a esfera|fica negativa, como o bastão"],[0,2.8,tf])}
contato("contato_neg","Animação: um bastão negativo toca uma esfera metálica neutra; parte dos elétrons passa para a esfera, que fica negativa",false);
contato("contato_pos","Animação: um bastão positivo toca uma esfera metálica neutra; elétrons da esfera passam para o bastão e a esfera fica positiva",true);

/* ---- esferas idênticas dividem a carga ---- */
(function(){var T=11,H=176,tr=[],s='',i;
 var ax=96,bx=224,y=82,R=38;
 s+='<circle cx="'+ax+'" cy="'+y+'" r="'+R+'" fill="var(--surface)" stroke="currentColor" stroke-width="2"/><circle cx="'+bx+'" cy="'+y+'" r="'+R+'" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>'+t_(ax,y+R+16,"A (carregada)",{s:11})+t_(bx,y+R+16,"B (neutra)",{s:11});
 var ap=[[-14,-14],[6,-14],[-14,6],[6,6]];
 for(i=0;i<4;i++)s+=P(ax+ap[i][0]+4,y+ap[i][1]+4,"pa"+i);
 s+=P(bx-12,y-8,"pb0")+P(bx+10,y+8,"pb1");
 /* dois elétrons de B vão para A, neutralizando 2 cargas + */
 var e1=[[ax+ap[0][0]+4+14,y+ap[0][1]+4+14],[ax+ap[1][0]+4-4,y+ap[1][1]+4+16]];
 s+=E(ax+10,y+4,"mv0")+E(ax-4,y-6,"mv1");
 tr.push(N.tr(".mv0",T,[[0,bx-12-(ax+10),y-8-(y+4)],[3.2,bx-12-(ax+10),y-8-(y+4)],[5.6,0,0]]),N.tr(".mv1",T,[[0,bx+10-(ax-4),y+8-(y-6)],[3.6,bx+10-(ax-4),y+8-(y-6)],[6,0,0]]));
 s+=N.arrow(150,170,y,"an-a3 ft",3);tr.push(N.vis(".ft",T,2.4));
 var q1=N.seq("qa",ax,34,["A: +4","A: +3","A: +2"],[0,5.6,6],T,{s:13}),q2=N.seq("qb",bx,34,["B: 0","B: +1","B: +2"],[0,5.6,6],T,{s:13});
 s+=q1.s+q2.s+t_(160,162,"Carga final de cada uma: (+4 + 0) / 2 = +2",{s:11,c:"fin"});
 tr=tr.concat(q1.t,q2.t);tr.push(N.vis(".fin",T,6.6));
 N.scene("contato_div","Animação: duas esferas condutoras idênticas, uma com carga +4 unidades e outra neutra, entram em contato; elétrons passam da neutra para a carregada e cada uma fica com +2",H,s,tr,T,["A tem carga +4 e B é neutra.|As esferas são idênticas","No contato, elétrons de B passam para A|e neutralizam parte da carga positiva","O equilíbrio acontece quando as cargas são iguais:|cada esfera fica com a média, +2"],[0,2.4,5.2])})();

/* ---- choque ao tocar na maçaneta ---- */
(function(){var T=16,H=190,tr=[],s='',i;
 s+='<rect x="10" y="150" width="190" height="18" rx="4" '+WOOL+'/>'+N.nd(14,153,182,12,12)+t_(105,182,"carpete",{s:10});
 s+='<rect x="262" y="26" width="40" height="142" rx="4" fill="var(--surface)" stroke="currentColor" stroke-width="2"/>'+t_(282,182,"porta",{s:10});
 s+='<circle cx="242" cy="86" r="11" '+METAL+'/><rect x="242" y="83" width="20" height="6" '+METAL+'/>'+t_(228,64,"maçaneta",{s:10});
 s+='<circle cx="90" cy="46" r="13" fill="var(--surface)" stroke="currentColor" stroke-width="2.5"/><path d="M90 59V108M90 108L74 148M90 108L106 148M90 72L128 84L158 86M90 72L70 96" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>';
 var ex=[[228,100],[246,104],[272,92],[284,116],[292,78]],pp=[[84,84],[96,92],[82,100],[98,76],[94,104]];
 for(i=0;i<5;i++)s+=E(ex[i][0],ex[i][1],"ee"+i);
 /* os elétrons sobem do carpete para a pessoa e depois pulam para a maçaneta */
 for(i=0;i<5;i++){var cx=60+i*22,st=1.2+.8*i;tr.push(N.tr(".ee"+i,T,[[0,cx-ex[i][0],150-ex[i][1]],[st,cx-ex[i][0],150-ex[i][1]],[st+1.6,pp[i][0]-ex[i][0],pp[i][1]-ex[i][1]],[9.8,pp[i][0]-ex[i][0],pp[i][1]-ex[i][1]],[10.6+.25*i,0,0]],"ease-in-out"))}
 s+='<path class="spk" d="M160 86l14-8 8 12 14-12 10 10 14-6" fill="none" stroke="#f5b50a" stroke-width="3" stroke-linejoin="round"/>';
 tr.push(N.op(".spk",T,[[0,0],[9.9,0],[10,1],[10.4,.2],[10.7,1],[11.4,0]]));
 var c=N.seq("pc",110,22,["pessoa: 0","−1e","−2e","−3e","−4e","−5e","pessoa: 0"],[0,2.8,3.6,4.4,5.2,6,11.4],T,{s:12});
 s+=c.s;tr=tr.concat(c.t);
 N.scene("choque","Animação: ao andar no carpete, a pessoa recebe elétrons e fica negativa; ao aproximar a mão da maçaneta metálica, os elétrons pulam em uma faísca e a pessoa se descarrega",H,s,tr,T,["Andar sobre o carpete: o atrito|passa elétrons do carpete para a pessoa","A pessoa fica carregada (excesso de elétrons).|O ar seco isola e mantém a carga","Perto da maçaneta metálica, o campo é tão forte|que o ar ioniza: faísca e choque!","Os elétrons passam para o metal|e a pessoa volta a ficar neutra"],[0,2.6,8,10.2])})();

/* ---- caminhão com corrente ---- */
(function(){var T=13,H=186,tr=[],s='',i;
 s+='<rect x="30" y="52" width="150" height="48" rx="12" '+METAL+'/><rect x="184" y="64" width="50" height="36" rx="6" '+PLAS+'/><circle cx="64" cy="108" r="12" fill="var(--surface)" stroke="currentColor" stroke-width="3"/><circle cx="148" cy="108" r="12" fill="var(--surface)" stroke="currentColor" stroke-width="3"/><circle cx="212" cy="108" r="12" fill="var(--surface)" stroke="currentColor" stroke-width="3"/>'+t_(105,81,"combustível",{s:11});
 s+='<path d="M0 134H320" stroke="currentColor" stroke-width="3"/>'+N.nd(0,136,320,18,14);
 s+='<path d="M100 112c-10 6 10 12 0 18s6 8 0 8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="6 3"/>'+t_(130,156,"corrente metálica",{s:10,a:"start"});
 var pos=[[60,70],[82,64],[104,70],[126,64],[148,70]];
 for(i=0;i<5;i++){s+=E(56+i*34,150,"ee"+i);var dx=pos[i][0]-(56+i*34),dy=pos[i][1]-150,st=1.2+.9*i;
  tr.push(N.tr(".ee"+i,T,[[0,dx,dy],[st,dx,dy],[st+.8,100-(56+i*34),118-150],[st+1.9,0,0]]))}
 var a=[3.1,4,4.9,5.8,6.7],c=N.seq("tc",105,34,["carga do caminhão: −5e","−4e","−3e","−2e","−1e","0"],[0,a[0],a[1],a[2],a[3],a[4]],T,{s:12});
 s+=c.s;tr=tr.concat(c.t);
 N.scene("corrente_caminhao","Animação: o atrito acumula elétrons no caminhão de combustível; a corrente metálica encostada no chão deixa os elétrons escoarem para a Terra, evitando faíscas",H,s,tr,T,["O atrito do ar e da estrada acumula|elétrons na carroceria do caminhão","Com a corrente tocando o chão, os elétrons|escoam pelo metal, que é condutor","O caminhão fica neutro: sem diferença de|potencial, não há faísca perto do combustível"],[0,1.2,7.2])})();

/* ---- pente atrai papel ---- */
(function(){var T=12,H=172,tr=[],s='',i;
 s+='<rect x="70" y="26" width="180" height="22" rx="6" '+PLAS+'/>';for(i=0;i<9;i++)s+='<rect x="'+(78+i*19)+'" y="48" width="5" height="12" '+PLAS+'/>';
 for(i=0;i<5;i++)s+=E(88+i*36,37,"");
 s+=t_(260,40,"pente (−)",{s:11,a:"start"});
 s+='<rect x="10" y="150" width="300" height="10" rx="3" '+METAL+'/>';
 var xs=[110,150,190,230];
 xs.forEach(function(x,k){s+='<g class="pp'+k+'"><rect x="'+(x-12)+'" y="74" width="24" height="9" rx="2" fill="#fff" stroke="currentColor" stroke-width="1.5"/><text x="'+x+'" y="72" text-anchor="middle" font-size="10" font-weight="700" class="pz">+</text><text x="'+x+'" y="94" text-anchor="middle" font-size="10" font-weight="700" class="pz">−</text></g>';
  tr.push(N.tr(".pp"+k,T,[[0,0,72],[1.6+.3*k,0,72],[3.6+.3*k,0,-3],[4.8+.3*k,0,0]]))});
 xs.forEach(function(x,k){s+=N.varrow(x,106,88,"an-a2 fz"+k,2.5);tr.push(N.vis(".fz"+k,T,3.2+.2*k))});
 s+=t_(160,138,"força de atração > peso do papel",{s:11,c:"fin"});tr.push(N.vis(".fin",T,5.6));
 N.scene("pente_papel","Animação: um pente de plástico atritado fica negativo e atrai pedacinhos de papel neutros, que se polarizam e sobem até ele",H,s,tr,T,["O pente, atritado no cabelo, fica negativo.|Os papéis estão neutros","O pente polariza o papel: cargas + ficam do|lado mais próximo, e − do lado oposto","O lado + está mais perto: a atração vence|a repulsão e o papel sobe até o pente"],[0,1.4,3.4])})();

/* ---- metal na mão não eletriza ---- */
(function(){var T=14,H=186,tr=[],s='',i;
 s+='<rect x="190" y="50" width="110" height="22" rx="6" '+WOOL+'/>'+t_(245,43,"lã",{s:10});
 s+='<rect x="96" y="76" width="160" height="14" rx="5" '+METAL+'/>'+t_(210,106,"barra de metal",{s:10});
 s+='<ellipse cx="86" cy="83" rx="20" ry="14" fill="#f1c9a5" fill-opacity=".8" stroke="currentColor" stroke-width="2"/>'+t_(86,62,"mão",{s:10});
 s+='<path d="M72 92C60 108 50 120 48 140" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-opacity=".35"/><rect x="20" y="146" width="80" height="14" rx="3" '+METAL+'/>'+N.nd(24,148,72,10,12)+t_(60,176,"corpo e Terra",{s:10});
 var xs=[130,160,190,220,240];
 for(i=0;i<5;i++){s+=E(34+i*11,152,"ee"+i);var st=1.4+.9*i,dx=xs[i]-(34+i*11),dy=83-152;
  tr.push(N.tr(".ee"+i,T,[[0,dx,dy],[st,dx,dy],[st+1.8,86-(34+i*11),100-152],[st+3.6,0,0]]))}
 s+=N.arrow(268,236,62,"an-a3 fr",2.5);tr.push(N.tr(".fr",T,[[0,0,0],[.8,-10,0],[1.6,0,0],[2.4,-10,0],[3.2,0,0]]));
 var c=N.seq("mc",150,22,["metal: −5e","−4e","−3e","−2e","−1e","metal: 0"],[0,4.2,5.1,6,6.9,7.8],T,{s:12});s+=c.s;tr=tr.concat(c.t);
 N.scene("metal_mao","Animação: uma barra de metal segurada na mão é atritada com a lã; as cargas que surgem escoam pelo corpo até a Terra e a barra continua neutra",H,s,tr,T,["Atritar o metal segurando na mão:|surgem elétrons em excesso na barra","O metal é condutor: os elétrons escoam|pela mão e pelo corpo até a Terra","Nada fica na barra: ela não se eletriza.|Com cabo isolante, a carga ficaria"],[0,1.2,8])})();

/* ---- condutor x isolante ---- */
(function(){var T=14,H=190,tr=[],s='',i,j;
 s+='<rect x="12" y="62" width="140" height="70" rx="8" '+METAL+'/>'+t_(82,152,"condutor (metal)",{s:11});
 s+='<rect x="168" y="62" width="140" height="70" rx="8" '+PLAS+'/>'+t_(238,152,"isolante (plástico)",{s:11});
 var fe=[[26,80],[30,104],[42,92],[28,120],[46,114],[38,72]],og=[[34,80],[60,104],[86,82],[112,108],[132,86],[48,120]];
 for(i=0;i<fe.length;i++){s+=E(fe[i][0],fe[i][1],"fe"+i);var ox=og[i][0]-fe[i][0],oy=og[i][1]-fe[i][1],d=[[8,5],[-6,8],[7,-6],[-8,-5],[6,7],[-7,4]][i];
  tr.push(N.tr(".fe"+i,T,[[0,ox,oy],[1.4,ox-d[0],oy+d[1]],[2.8,ox+d[0],oy-d[1]],[4.2,ox-d[0],oy-d[1]],[5.6,ox,oy],[10,0,0]]))}
 var bx=[[184,80],[210,104],[236,82],[262,104],[286,84],[196,120]];
 for(i=0;i<bx.length;i++){s+='<circle cx="'+bx[i][0]+'" cy="'+bx[i][1]+'" r="5" fill="currentColor" fill-opacity=".4"/>'+E(bx[i][0]+8,bx[i][1]+2,"be"+i).replace('r="6"','r="4.5"');
 tr.push(N.tr(".be"+i,T,[[0,0,0],[1,3,2],[2,-3,3],[3,2,-3],[4,-3,-2],[5,3,3],[6,-2,-3],[7,0,0]]))}
 s+='<g class="fld">'+N.arrow(60,252,32,"an-a3",2.5)+t_(160,24,"campo elétrico externo",{s:10})+'</g>';tr.push(N.vis(".fld",T,5.6));
 s+=t_(82,176,"elétrons livres escoam",{s:10,c:"r1"})+t_(238,176,"elétrons presos ao átomo",{s:10,c:"r2"});tr.push(N.vis(".r1,.r2",T,9.4));
 N.scene("cond_isol","Animação: no metal, elétrons livres se movem e o campo elétrico os faz escoar; no plástico, os elétrons ficam presos aos átomos e só vibram",H,s,tr,T,["Condutor: tem elétrons livres,|que passeiam por todo o material","Isolante: os elétrons estão presos|aos átomos e apenas vibram","Com um campo elétrico, só os elétrons|livres do condutor se deslocam"],[0,1.4,5.4])})();
})();
