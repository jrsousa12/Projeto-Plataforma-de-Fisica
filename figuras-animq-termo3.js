/* Termologia: animações novas (lote 2: dilatação, calor sensível, energia) e resoluções de cálculo. */
(function(){"use strict";
var N=window.AN,t_=N.t,PI=Math.PI;
var HOT="var(--f-calor)",COLD="var(--f-agua)";
function flame(x,y,cl){return'<g class="'+(cl||"")+'"><path d="M'+x+' '+y+'c-9-9-9-17-2-26 1 6 5 8 7 13 3-4 2-9 1-12 8 8 11 17 3 25-3 4-6 4-9 0z" fill="'+HOT+'" stroke="#a63a0f" stroke-width="1.2"/><path d="M'+x+' '+(y-2)+'c-4-4-3-9 0-13 2 4 5 6 1 13z" fill="#facc15"/></g>'}
function arr(x1,y1,x2,y2,c,cl,w){var a=Math.atan2(y2-y1,x2-x1),h=7;return'<g class="'+(cl||"")+'"><line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+(w||3)+'" stroke-linecap="round"/><path d="M'+x2+' '+y2+'L'+(x2-h*Math.cos(a-.5))+' '+(y2-h*Math.sin(a-.5))+'L'+(x2-h*Math.cos(a+.5))+' '+(y2-h*Math.sin(a+.5))+'z" fill="'+c+'"/></g>'}
function S(k,b){return'<g class="s'+k+'">'+b+'</g>'}
function cup(x,y,w,h,f,cl){return'<path d="M'+x+' '+y+'V'+(y+h-6)+'a6 6 0 0 0 6 6h'+(w-12)+'a6 6 0 0 0 6-6V'+y+'" fill="none" stroke="currentColor" stroke-width="2.4"/><rect class="'+(cl||"")+'" x="'+(x+1.5)+'" y="'+(y+h*.28)+'" width="'+(w-3)+'" height="'+(h*.72-2)+'" rx="3" fill="'+f+'" fill-opacity=".5"/>'}
function C(key,alt,H,s,tr,T,caps,times){N.scene(key,alt,H,s,tr,T,caps,times)}
function STP(a,b,c,d){return[[0,a],[2.6,b],[5.2,c],[8,d]]}
function calc(key,alt,H,s,tr,st){var T=st[st.length-1][0]+3.6,c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H);for(var k=1;k<st.length;k++)tr.push(N.vis(".s"+(k+1),T,st[k][0]));N.reg(key,{a:alt,h:H,s:s+c.s,t:tr.concat(c.t),T:T})}

/* ---- dilatação linear ---- */
(function(){var T=15,H=190,s='',tr=[];
 s+='<rect x="18" y="52" width="14" height="60" fill="#9aa6b8" stroke="currentColor" stroke-width="2"/><rect x="34" y="68" width="190" height="26" rx="3" fill="#9aa6b8" fill-opacity=".55" stroke="currentColor" stroke-width="2"/>';
 s+='<rect class="ex" x="224" y="68" width="26" height="26" rx="3" fill="'+HOT+'" fill-opacity=".7" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:0 50%"/>';
 tr.push(N.sc(".ex",T,[[0,.02,1],[2,.02,1],[10,1,1]]));
 s+=flame(130,128,"fl");tr.push(N.op(".fl",T,[[0,0],[1.6,0],[2,1],[T,1]]));
 s+=N.dm(34,224,150,"L₀","d0")+'<g class="dd">'+N.dm(224,250,150,"ΔL","")+'</g>';tr.push(N.vis(".dd",T,9));
 s+=N.th(286,40,76,"mer",.85);tr.push(N.sc(".mer",T,[[0,1,.2],[2,1,.2],[10,1,.85]]));
 var q=N.seq("tq",286,28,["20 °C","60 °C","120 °C"],[0,5,8.4],T,{s:11});s+=q.s;tr=tr.concat(q.t);
 s+=t_(130,40,"ΔL = L₀ · α · ΔT",{s:15,c:"fm"});tr.push(N.vis(".fm",T,10.6));
 C("dil_linear","Animação: uma barra metálica presa em uma parede é aquecida e aumenta de comprimento; o aumento ΔL é proporcional ao comprimento inicial, ao coeficiente de dilatação e à variação de temperatura",H,s,tr,T,["Barra de comprimento inicial L₀ a 20 °C","Aquecida, ela se alonga:|ΔL cresce junto com a variação ΔT","O aumento é proporcional a L₀, a α e a ΔT:|ΔL = L₀ · α · ΔT"],[0,2,9.6])})();

/* ---- coeficientes α, β, γ ---- */
(function(){var T=15,H=200,s='',tr=[],X=[56,160,264];
 /* barra */
 s+='<rect x="26" y="52" width="60" height="9" fill="none" stroke="currentColor" stroke-dasharray="4 3"/><rect class="g1" x="26" y="52" width="60" height="9" fill="'+HOT+'" fill-opacity=".6" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:0 50%"/>'+t_(56,36,"1 dimensão",{s:11})+t_(56,82,"comprimento",{s:10});
 s+='<rect x="136" y="30" width="48" height="48" fill="none" stroke="currentColor" stroke-dasharray="4 3"/><rect class="g2" x="136" y="30" width="48" height="48" fill="'+HOT+'" fill-opacity=".6" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:0 0"/>'+t_(160,18,"2 dimensões",{s:11})+t_(160,100,"área",{s:10});
 s+='<g class="g3" style="transform-box:fill-box;transform-origin:0 100%"><rect x="244" y="44" width="34" height="34" fill="'+HOT+'" fill-opacity=".6" stroke="currentColor" stroke-width="2"/><path d="M244 44l10-10h34l-10 10M288 34v34l-10 10" fill="'+HOT+'" fill-opacity=".4" stroke="currentColor" stroke-width="2"/></g>'+t_(266,18,"3 dimensões",{s:11})+t_(266,92,"volume",{s:10});
 tr.push(N.sc(".g1",T,[[0,1,1],[2,1,1],[6,1.14,1]]),N.sc(".g2",T,[[0,1,1],[2,1,1],[6,1.14,1.14]]),N.sc(".g3",T,[[0,1,1],[2,1,1],[6,1.14,1.14]]));
 var base=170;s+='<path d="M20 '+base+'H300" stroke="currentColor" stroke-width="2"/>';
 [[1,"α","linear"],[2,"β ≈ 2α","superficial"],[3,"γ ≈ 3α","volumétrico"]].forEach(function(b,k){var x=X[k];s+='<rect class="b'+k+'" x="'+(x-18)+'" y="'+(base-18*b[0])+'" width="36" height="'+(18*b[0])+'" fill="#f59e0b" fill-opacity=".8" stroke="currentColor" style="transform-box:fill-box;transform-origin:50% 100%"/>'+t_(x,base+16,b[1],{s:13});tr.push(N.sc(".b"+k,T,[[0,1,.01],[6.4+1.4*k,1,.01],[7.8+1.4*k,1,1]]))});
 s+=t_(160,118,"coeficientes (cada dimensão a mais soma um α)",{s:10,c:"fin"});tr.push(N.vis(".fin",T,6));
 C("dil_coef","Animação: uma barra, uma placa e um cubo são aquecidos e dilatam em uma, duas e três dimensões; os coeficientes de dilatação ficam na proporção alfa, beta igual a 2 alfa e gama igual a 3 alfa",H,s,tr,T,["Aquecendo um sólido, ele dilata em todas|as direções: comprimento, área e volume","Quanto mais dimensões dilatam,|maior é o aumento relativo","Os coeficientes ficam na proporção:|α : β : γ = 1 : 2 : 3"],[0,2,6.4])})();

/* ---- tampa emperrada ---- */
(function(){var T=16,H=200,s='',tr=[],i;
 s+='<path d="M60 90h56v70a8 8 0 0 1-8 8H68a8 8 0 0 1-8-8z" fill="#cfe7fb" fill-opacity=".6" stroke="currentColor" stroke-width="2.4"/>'+t_(88,186,"vidro",{s:11});
 s+='<g class="lid"><rect x="54" y="72" width="68" height="18" rx="4" fill="#9aa6b8" stroke="currentColor" stroke-width="2.4"/>'+t_(88,66,"tampa (metal)",{s:10})+'</g>';
 tr.push(N.sc(".lid",T,[[0,1,1],[3,1,1],[8,1.1,1]]));
 for(i=0;i<5;i++){s+='<path class="dr'+i+'" d="M'+(66+i*12)+' 30c-5 7-5 12 0 12s5-5 0-12z" fill="var(--f-agua)" stroke="currentColor"/>';tr.push(N.tr(".dr"+i,T,[[0,0,0],[2.6+.25*i,0,0],[3.4+.25*i,0,40],[3.9+.25*i,0,0],[5+.25*i,0,40],[5.5+.25*i,0,0],[T,0,0]]));tr.push(N.op(".dr"+i,T,[[0,0],[2.6+.25*i,0],[2.9+.25*i,1],[T,1]]))}
 s+='<text x="88" y="24" text-anchor="middle" font-size="11" class="hw">água quente</text>';
 /* vista de cima */
 s+='<circle cx="216" cy="84" r="28" fill="#cfe7fb" fill-opacity=".6" stroke="currentColor" stroke-width="2"/><circle class="ring" cx="216" cy="84" r="28" fill="none" stroke="#6b7280" stroke-width="8"/>'+t_(216,140,"vista de cima",{s:11});
 tr.push(N.pr(".ring",T,"r",[[0,32],[3,32],[8,36]]));
 s+='<g class="gp">'+t_(216,160,"folga: a tampa afrouxa",{s:11})+'</g>';tr.push(N.vis(".gp",T,8.4));
 s+='<rect x="270" y="30" width="14" height="60" fill="#f59e0b" fill-opacity=".8" stroke="currentColor"/><rect x="292" y="30" width="14" height="22" fill="#3b82f6" fill-opacity=".7" stroke="currentColor"/>'+t_(277,104,"metal",{s:9})+t_(299,48,"vidro",{s:9});
 C("tampa","Animação: ao passar a tampa metálica emperrada de um vidro sob água quente, o metal dilata mais que o vidro; a tampa aumenta, a folga aparece e ela se solta com facilidade",H,s,tr,T,["A tampa metálica está justa e emperrada|no gargalo de vidro","Com água quente, tampa e vidro dilatam,|mas o metal dilata mais que o vidro","A tampa fica folgada em relação ao vidro:|agora é fácil abri-la"],[0,2.8,8])})();

/* ---- caloria ---- */
(function(){var T=15,H=200,s='',tr=[];
 s+=cup(80,70,70,70,COLD)+t_(115,160,"1 g de água",{s:12})+flame(115,198,"fl");tr.push(N.op(".fl",T,[[0,0],[1.6,0],[2,1],[T,1]]));
 s+=N.th(200,50,80,"mer",.5);tr.push(N.sc(".mer",T,[[0,1,.4],[2,1,.4],[6,1,.58]]));
 var tq=N.seq("tq",200,38,["14,5 °C","15,5 °C"],[0,6],T,{s:11}),qq=N.seq("qq",115,50,["calor: 0 cal","calor: 0,5 cal","calor: 1 cal"],[0,3,6],T,{s:13});s+=tq.s+qq.s;tr=tr.concat(tq.t,qq.t);
 s+=t_(160,190,"1 cal ≈ 4,2 J",{s:16,c:"fj"})+t_(160,36,"",{s:1});tr.push(N.vis(".fj",T,9.6));
 s+='<g class="fe"><rect x="244" y="64" width="50" height="14" fill="#f59e0b" fill-opacity=".8" stroke="currentColor"/>'+t_(269,60,"4,2 J",{s:11})+'<rect x="244" y="100" width="50" height="14" fill="#fb923c" fill-opacity=".8" stroke="currentColor"/>'+t_(269,96,"1 cal",{s:11})+'</g>';tr.push(N.vis(".fe",T,9.6));
 C("caloria","Animação: uma caloria é o calor necessário para elevar de 1 grau Celsius a temperatura de 1 grama de água, e equivale a cerca de 4,2 joules",H,s,tr,T,["Um grama de água recebe calor de uma chama","Para a temperatura subir 1 °C,|é preciso fornecer 1 caloria","A caloria é unidade de energia:|1 cal ≈ 4,2 J. Calor específico da água: 1 cal/g·°C"],[0,2,6.2])})();

/* ---- calor específico: areia x água ---- */
(function(){var T=16,H=206,s='',tr=[];
 [[84,"areia","#d6b87a","0,2",.9],[236,"água","var(--f-agua)","1,0",.4]].forEach(function(p,k){var x=p[0];
  s+=cup(x-42,70,84,56,p[2],"ca"+k)+t_(x,152,p[1]+" (100 g)",{s:12})+t_(x,168,"c = "+p[3]+" cal/g·°C",{s:11})+flame(x,138,"fl"+k);tr.push(N.op(".fl"+k,T,[[0,0],[1.4,0],[1.8,1],[T,1]]));
  s+=N.th(x+56,40,70,"mer"+k,p[4]);tr.push(N.sc(".mer"+k,T,[[0,1,.3],[1.8,1,.3],[11,1,p[4]]]))});
 var a=N.seq("ta",140,34,["20 °C","30 °C","40 °C","50 °C","60 °C"],[0,3.2,5.2,7.2,9.2],T,{s:11}),b=N.seq("tb",292,34,["20 °C","22 °C","25 °C","28 °C","30 °C"],[0,3.2,5.2,7.2,9.2],T,{s:11});
 s+=a.s.replace(/x="140"/g,'x="140"')+b.s;tr=tr.concat(a.t,b.t);
 s+=t_(160,12,"mesma massa, mesmo calor",{s:11});
 s+=t_(160,20,"",{s:1});
 C("cal_esp","Animação: areia e água, de mesma massa, recebem a mesma quantidade de calor; a areia, de calor específico menor, esquenta bem mais que a água, que tem calor específico maior",H,s,tr,T,["Mesma massa e mesma chama:|os dois recebem o mesmo calor","A areia (c pequeno) esquenta depressa;|a água (c grande) esquenta devagar","Q = m · c · ΔT: com Q e m iguais,|menor c ⇒ maior ΔT. Por isso a areia queima o pé"],[0,1.8,6.4])})();

/* ---- capacidade térmica ---- */
(function(){var T=16,H=206,s='',tr=[];
 [[84,"pequeno (100 g)",50,"C = 20 cal/°C",.92,"70 °C"],[236,"grande (500 g)",70,"C = 100 cal/°C",.4,"30 °C"]].forEach(function(p,k){var x=p[0],w=k?100:60;
  s+=cup(x-w/2,100-(k?20:0)+0,w,60+(k?20:0),COLD)+t_(x,174,p[1],{s:11})+t_(x,190,p[3],{s:12})+arr(x,205,x,196,HOT,"hf"+k,3);
  s+=N.th(x+(k?66:50),30,70,"mer"+k,p[4]);tr.push(N.sc(".mer"+k,T,[[0,1,.2],[2,1,.2],[9,1,p[4]]]))});
 var a=N.seq("ta",134,24,["20 °C","45 °C","70 °C"],[0,4,7],T,{s:11}),b=N.seq("tb",302,24,["20 °C","25 °C","30 °C"],[0,4,7],T,{s:11});s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 s+=t_(160,12,"cada um recebe 1000 cal",{s:10});
 tr.push(N.op(".hf0",T,[[0,0],[1.6,0],[2,1],[T,1]]),N.op(".hf1",T,[[0,0],[1.6,0],[2,1],[T,1]]));
 C("cap_term","Animação: dois recipientes com água, um pequeno e um grande, recebem a mesma quantidade de calor; o pequeno esquenta muito e o grande pouco, pois tem maior capacidade térmica",H,s,tr,T,["Dois corpos recebem o mesmo calor,|1000 cal cada um","O pequeno esquenta 50 °C;|o grande, só 10 °C","Capacidade térmica: C = Q / ΔT = m · c.|Mais massa ⇒ maior C ⇒ muda menos a temperatura"],[0,2,7])})();

/* ---- Joule: trabalho vira calor ---- */
(function(){var T=16,H=200,s='',tr=[];
 s+=cup(40,110,110,70,COLD)+'<line x1="95" y1="70" x2="95" y2="150" stroke="currentColor" stroke-width="3"/><g class="pd" style="transform-box:fill-box;transform-origin:50% 50%"><circle cx="95" cy="150" r="3" fill="currentColor"/><path d="M60 150h70M95 125v50" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></g>';
 tr.push(N.rot(".pd",T,[[0,0],[T,1400]]));
 s+='<path d="M95 70H196" stroke="currentColor" stroke-width="2"/><circle cx="196" cy="70" r="10" fill="var(--surface)" stroke="currentColor" stroke-width="2.4"/><line x1="206" y1="70" x2="206" y2="90" stroke="currentColor" stroke-width="2"/>';
 s+='<g class="wt"><line x1="206" y1="70" x2="206" y2="96" stroke="currentColor" stroke-width="2"/><rect x="188" y="96" width="36" height="28" rx="4" fill="#f59e0b" fill-opacity=".85" stroke="currentColor" stroke-width="2.2"/>'+t_(206,115,"m",{s:12})+'</g>';
 tr.push(N.tr(".wt",T,[[0,0,0],[.5,0,0],[12,0,52]]));
 s+=N.th(272,60,90,"mer",.35)+t_(272,176,"água",{s:11});tr.push(N.sc(".mer",T,[[0,1,.3],[.5,1,.3],[12,1,.42]]));
 var q=N.seq("tq",272,48,["20,0 °C","20,2 °C","20,5 °C"],[0,5,9],T,{s:11});s+=q.s;tr=tr.concat(q.t);
 s+=t_(160,22,"o peso desce e gira as pás",{s:11})+t_(160,196,"energia mecânica ⇒ calor:  1 cal ≈ 4,18 J",{s:12,c:"fin"});tr.push(N.vis(".fin",T,11.4));
 C("joule_pa","Animação: um peso que desce faz girar pás dentro da água de um recipiente; a energia mecânica vira calor e a temperatura da água sobe um pouco, mostrando a equivalência entre trabalho e calor",H,s,tr,T,["Um peso desce e faz girar as pás|mergulhadas na água, sem chama alguma","O atrito das pás com a água aquece:|a temperatura sobe","Joule mostrou que trabalho mecânico vira calor:|1 cal ≈ 4,18 J"],[0,3,9])})();
/* ================= resoluções de cálculo ================= */
function CALC(key,alt,H,vis,tr,st,lines,ly){
 var T=st[st.length-1][0]+4,c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H),g='';
 lines.forEach(function(L,k){var last=k==lines.length-1;g+='<g class="s'+(k+2)+'">'+t_(160,ly+18*k,L,{s:last?15:12,c:last?"fin":""})+'</g>';tr.push(N.vis(".s"+(k+2),T,st[k+1][0]))});
 N.reg(key,{a:alt,h:H,s:vis+g+c.s,t:tr.concat(c.t),T:T})}

/* conversão de escalas: a mesma temperatura em duas escalas */
function conv(key,alt,uA,vA,uB,vB,rel,sub,res,lvl){
 var T=16,s='',tr=[];
 s+=N.th(70,28,92,"mA",lvl)+N.th(250,28,92,"mB",lvl);
 tr.push(N.sc(".mA",T,[[0,1,.1],[1.6,1,.1],[5.6,1,lvl]]),N.sc(".mB",T,[[0,1,.1],[1.6,1,.1],[5.6,1,lvl]]));
 s+=t_(70,16,uA,{s:12})+t_(250,16,uB,{s:12})+'<g class="ax">'+arr(104,84,216,84,"#f59e0b","",3)+t_(160,74,"mesma temperatura",{s:11})+'</g>';
 tr.push(N.vis(".ax",T,5.2));
 var a=N.seq("ta",70,152,["?",vA],[0,2.2],T,{s:15}),b=N.seq("tb",250,152,["?",vB],[0,5.8],T,{s:15});s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 CALC(key,alt,214,s,tr,[[0,"Temperatura lida na escala "+uA],[2.6,rel+"|aplicada ao valor dado"],[5.8,"Resultado na escala "+uB]],[sub,res],180)}
conv("calc_t011","Resolução animada: 300 kelvin convertidos para graus Celsius, subtraindo 273","Kelvin","300 K","Celsius","27 °C","TC = TK − 273","TC = 300 − 273","TC = 27 °C",.45);
conv("calc_t061","Resolução animada: 50 graus Celsius convertidos para Kelvin, somando 273","Celsius","50 °C","Kelvin","323 K","TK = TC + 273","TK = 50 + 273","TK = 323 K",.35);
conv("calc_t012","Resolução animada: 68 graus Fahrenheit convertidos para Celsius pela relação TC/5 = (TF − 32)/9","Fahrenheit","68 °F","Celsius","20 °C","TC/5 = (TF − 32)/9","TC/5 = (68 − 32)/9 = 4","TC = 20 °C",.4);
conv("calc_t062","Resolução animada: termômetro Fahrenheit marcando 68 graus convertido para Celsius pela relação TC/5 = (TF − 32)/9","Fahrenheit","68 °F","Celsius","20 °C","TC/5 = (TF − 32)/9","TC/5 = (68 − 32)/9 = 4","TC = 20 °C",.4);

/* dilatação: barra (linear) ou placa (superficial) */
function dilat(key,alt,area,lab,sub,res,vals,fin){
 var T=17,s='',tr=[];
 if(area){s+='<rect x="54" y="30" width="80" height="80" fill="none" stroke="currentColor" stroke-dasharray="4 3"/><rect class="g" x="54" y="30" width="80" height="80" fill="'+HOT+'" fill-opacity=".6" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:0 0"/>'+lab.split('|').map(function(x,i){return t_(94,128+15*i,x,{s:11})}).join('');tr.push(N.sc(".g",T,[[0,1,1],[2,1,1],[9,1.12,1.12]]))}
 else{s+='<rect x="20" y="52" width="12" height="52" fill="#9aa6b8" stroke="currentColor" stroke-width="2"/><rect x="32" y="66" width="170" height="24" rx="3" fill="none" stroke="currentColor" stroke-dasharray="4 3"/><rect class="g" x="32" y="66" width="170" height="24" rx="3" fill="'+HOT+'" fill-opacity=".6" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:0 50%"/>'+lab.split('|').map(function(x,i){return t_(117,112+15*i,x,{s:11})}).join('');tr.push(N.sc(".g",T,[[0,1,1],[2,1,1],[9,1.12,1]]))}
 s+=flame(area?94:117,area?176:176,"fl");tr.push(N.op(".fl",T,[[0,0],[1.6,0],[2,1],[T,1]]));
 s+=N.th(250,34,84,"mer",.8)+t_(250,150,"",{s:1});tr.push(N.sc(".mer",T,[[0,1,.25],[2,1,.25],[9,1,.8]]));
 var q=N.seq("tq",250,22,vals,[0,4.6,8],T,{s:12});s+=q.s;tr=tr.concat(q.t);
 s+=t_(area?224:252,area?60:112,"",{s:1});
 CALC(key,alt,240,s,tr,[[0,"Dados do problema: "+lab.replace('|','; ')],[3,"Aplicamos a fórmula da dilatação"],[6.2,"Substituindo os valores"],[9.4,fin]],[sub,res],204)}
dilat("calc_t023","Resolução animada: barra de 2 metros com alfa de 1,2 por 10 elevado a menos 5 aquecida em 50 graus; o aumento é 1,2 milímetro",0,"L₀ = 2 m;  ΔT = 50 °C|α = 1,2·10⁻⁵ °C⁻¹","ΔL = 2 · 1,2·10⁻⁵ · 50","ΔL = 1,2·10⁻³ m = 1,2 mm",["20 °C","45 °C","70 °C"],"ΔL = L₀ · α · ΔT:|dilatação de 1,2 mm");
dilat("calc_t066","Resolução animada: barra de 2 metros com alfa de 1,2 por 10 elevado a menos 5 aquecida de 20 a 120 graus Celsius; a dilatação é 2,4 milímetros",0,"L₀ = 2,0 m;  ΔT = 100 °C|α = 1,2·10⁻⁵ °C⁻¹","ΔL = 2,0 · 1,2·10⁻⁵ · 100","ΔL = 2,4·10⁻³ m = 2,4 mm",["20 °C","70 °C","120 °C"],"ΔL = L₀ · α · ΔT:|dilatação de 2,4 mm");
dilat("calc_t024","Resolução animada: placa de 1 metro quadrado com beta de 2,4 por 10 elevado a menos 5 aquecida de 20 a 120 graus; a variação de área é 2,4 por 10 elevado a menos 3 metros quadrados",1,"A₀ = 1 m²;  ΔT = 100 °C|β = 2,4·10⁻⁵ °C⁻¹","ΔA = 1 · 2,4·10⁻⁵ · 100","ΔA = 2,4·10⁻³ m²",["20 °C","70 °C","120 °C"],"ΔA = A₀ · β · ΔT:|variação de área");

/* calor sensível: Q = m·c·ΔT */
function qsens(key,alt){
 var T=18,s='',tr=[];
 s+=cup(70,66,90,62,COLD)+t_(115,150,"200 g de água",{s:12})+flame(115,176,"fl");tr.push(N.op(".fl",T,[[0,0],[1.6,0],[2,1],[T,1]]));
 s+=N.th(206,34,92,"mer",.85);tr.push(N.sc(".mer",T,[[0,1,.3],[2,1,.3],[10,1,.85]]));
 var a=N.seq("ta",206,24,["20 °C","28 °C","36 °C","44 °C","50 °C"],[0,4,5.6,7.2,9],T,{s:12}),b=N.seq("tb",115,52,["Q = 0","Q = 1600 cal","Q = 3200 cal","Q = 4800 cal","Q = 6000 cal"],[0,4,5.6,7.2,9],T,{s:13});
 s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 CALC(key,alt,236,s,tr,[[0,"200 g de água, c = 1 cal/g·°C,|de 20 °C a 50 °C"],[3,"Calor sensível: muda a temperatura|Q = m · c · ΔT"],[6.4,"Substituímos m, c e ΔT = 50 − 20"],[9.6,"O calor necessário é 6000 cal"]],["Q = 200 · 1 · (50 − 20)","Q = 6000 cal"],200)}
qsens("calc_t034","Resolução animada: aquecer 200 gramas de água de 20 a 50 graus Celsius exige 6000 calorias");
qsens("calc_t071","Resolução animada: aquecer 200 gramas de água de 20 a 50 graus Celsius exige 6000 calorias, com Q = m·c·ΔT");

/* capacidade térmica: ΔT = Q/C  e  C = m·c */
(function(){var T=18,s='',tr=[];
 s+='<rect x="44" y="70" width="120" height="54" rx="6" fill="#9aa6b8" fill-opacity=".6" stroke="currentColor" stroke-width="2.4"/>'+t_(104,102,"C = 50 cal/°C",{s:12})+flame(104,150,"fl");tr.push(N.op(".fl",T,[[0,0],[1.6,0],[2,1],[T,1]]));
 s+=N.th(206,34,92,"mer",.7);tr.push(N.sc(".mer",T,[[0,1,.25],[2,1,.25],[10,1,.7]]));
 var a=N.seq("ta",104,52,["Q = 0","Q = 500 cal","Q = 1000 cal"],[0,4,8],T,{s:13}),b=N.seq("tb",206,24,["ΔT = 0","ΔT = 10 °C","ΔT = 20 °C"],[0,4,8],T,{s:12});s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 CALC("calc_t035","Resolução animada: um corpo de capacidade térmica 50 cal por grau recebe 1000 calorias e sua temperatura varia 20 graus",236,s,tr,[[0,"Corpo com C = 50 cal/°C|recebe Q = 1000 cal"],[3,"Capacidade térmica: C = Q / ΔT,|logo ΔT = Q / C"],[6.4,"Substituímos Q e C"],[9.6,"A temperatura varia 20 °C"]],["ΔT = 1000 / 50","ΔT = 20 °C"],200)})();
(function(){var T=18,s='',tr=[];
 s+='<rect x="30" y="66" width="120" height="60" rx="6" fill="#9aa6b8" fill-opacity=".6" stroke="currentColor" stroke-width="2.4"/>'+t_(90,90,"m = 500 g",{s:12})+t_(90,110,"c = 0,2 cal/g·°C",{s:11})+flame(90,152,"fl");tr.push(N.op(".fl",T,[[0,0],[1.6,0],[2,1],[T,1]]));
 s+=N.th(200,34,92,"mer",.4);tr.push(N.sc(".mer",T,[[0,1,.3],[2,1,.3],[10,1,.38]]));
 var a=N.seq("ta",90,52,["Q = 0","Q = 50 cal","Q = 100 cal"],[0,4,8],T,{s:13}),b=N.seq("tb",200,24,["ΔT = 0","ΔT = 0,5 °C","ΔT = 1 °C"],[0,4,8],T,{s:12});s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 s+='<g class="rr">'+t_(262,70,"1 °C",{s:12})+t_(262,88,"custa",{s:11})+t_(262,106,"100 cal",{s:12})+'</g>';tr.push(N.vis(".rr",T,8.6));
 CALC("calc_t072","Resolução animada: corpo de 500 gramas com calor específico 0,2 cal por grama grau tem capacidade térmica de 100 cal por grau Celsius",236,s,tr,[[0,"Corpo de 500 g com c = 0,2 cal/g·°C"],[3,"Capacidade térmica: C = m · c"],[6.4,"Substituímos m e c"],[9.6,"Para subir 1 °C, ele precisa de 100 cal"]],["C = 500 · 0,2","C = 100 cal/°C"],200)})();

/* calor latente: Q = m·L (temperatura constante) */
function qlat(key,alt,vap,m,L,Q,tmp,lab){
 var T=18,s='',tr=[],mx=vap?"água":"gelo";
 s+='<path d="M70 60V122a6 6 0 0 0 6 6h88a6 6 0 0 0 6-6V60" fill="none" stroke="currentColor" stroke-width="2.4"/>';
 if(vap){s+='<rect class="w1" x="72" y="76" width="96" height="50" fill="'+COLD+'" fill-opacity=".55" style="transform-box:fill-box;transform-origin:50% 100%"/><g class="vp" fill="none" stroke="#9aa6b8" stroke-width="2.4" stroke-linecap="round"><path d="M92 62c-6-8 6-12 0-20M118 62c-6-8 6-12 0-20M144 62c-6-8 6-12 0-20"/></g>';tr.push(N.sc(".w1",T,[[0,1,1],[2,1,1],[10,1,.08]]),N.op(".vp",T,[[0,0],[3,0],[9,1]]))}
 else{s+='<rect class="w1" x="72" y="104" width="96" height="22" fill="'+COLD+'" fill-opacity=".55" style="transform-box:fill-box;transform-origin:50% 100%"/><g class="ic" style="transform-box:fill-box;transform-origin:50% 100%"><rect x="80" y="74" width="34" height="30" rx="3" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/><rect x="118" y="82" width="40" height="22" rx="3" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/></g>';tr.push(N.sc(".ic",T,[[0,1,1],[2,1,1],[10,1,.05]]),N.sc(".w1",T,[[0,1,.01],[2,1,.01],[10,1,2.2]]))}
 s+=t_(120,146,m+" g de "+mx,{s:12})+flame(120,176,"fl");tr.push(N.op(".fl",T,[[0,0],[1.6,0],[2,1],[T,1]]));
 s+=N.th(236,34,92,"mer",.55)+t_(236,22,tmp,{s:13});
 var b=N.seq("tb",120,30,["Q = 0","Q = "+Q/4+" cal","Q = "+Q/2+" cal","Q = "+Q*3/4+" cal","Q = "+Q+" cal"],[0,4,5.8,7.6,9.4],T,{s:13});s+=b.s;tr=tr.concat(b.t);
 s+='<g class="kk">'+t_(236,150,"temperatura",{s:11})+t_(236,166,"constante",{s:11})+'</g>';tr.push(N.vis(".kk",T,4));
 CALC(key,alt,236,s,tr,[[0,lab],[3,"Calor latente: muda o estado, não a temperatura|Q = m · L"],[6.4,"Substituímos m e L"],[9.8,"O calor necessário é "+Q+" cal"]],["Q = "+m+" · "+L,"Q = "+Q+" cal"],200)}
qlat("calc_t047","Resolução animada: fundir 50 gramas de gelo a 0 grau Celsius com L igual a 80 cal por grama exige 4000 calorias",0,50,80,4000,"0 °C","50 g de gelo a 0 °C,|L = 80 cal/g");
qlat("calc_t076","Resolução animada: fundir 100 gramas de gelo a 0 grau Celsius com L igual a 80 cal por grama exige 8000 calorias",0,100,80,8000,"0 °C","100 g de gelo a 0 °C,|L = 80 cal/g");
qlat("calc_t048","Resolução animada: vaporizar 10 gramas de água a 100 graus Celsius com L igual a 540 cal por grama exige 5400 calorias",1,10,540,5400,"100 °C","10 g de água a 100 °C,|L = 540 cal/g");
qlat("calc_t080","Resolução animada: vaporizar 10 gramas de água a 100 graus Celsius com L igual a 540 cal por grama exige 5400 calorias",1,10,540,5400,"100 °C","10 g de água a 100 °C,|L = 540 cal/g");
})();
