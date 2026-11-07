/* Termologia: animações novas (lote 1: temperatura, mudanças de estado e propagação do calor). */
(function(){"use strict";
var N=window.AN,t_=N.t,PI=Math.PI;
var HOT="var(--f-calor)",COLD="var(--f-agua)",RED="var(--f-verm)";
function mol(x,y,c,cl,r){return'<circle class="'+(cl||"")+'" cx="'+x+'" cy="'+y+'" r="'+(r||4.5)+'" fill="'+c+'" stroke="currentColor" stroke-width="1"/>'}
function box(x,y,w,h,f){return'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" fill="'+(f||"var(--surface)")+'" fill-opacity=".6" stroke="currentColor" stroke-width="2"/>'}
function flame(x,y,cl){return'<g class="'+(cl||"")+'"><path d="M'+x+' '+y+'c-9-9-9-17-2-26 1 6 5 8 7 13 3-4 2-9 1-12 8 8 11 17 3 25-3 4-6 4-9 0z" fill="'+HOT+'" stroke="#a63a0f" stroke-width="1.2"/><path d="M'+x+' '+(y-2)+'c-4-4-3-9 0-13 2 4 5 6 1 13z" fill="#facc15"/></g>'}
function arr(x1,y1,x2,y2,c,cl,w){var a=Math.atan2(y2-y1,x2-x1),h=7;return'<g class="'+(cl||"")+'"><line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+(w||3)+'" stroke-linecap="round"/><path d="M'+x2+' '+y2+'L'+(x2-h*Math.cos(a-.5))+' '+(y2-h*Math.sin(a-.5))+'L'+(x2-h*Math.cos(a+.5))+' '+(y2-h*Math.sin(a+.5))+'z" fill="'+c+'"/></g>'}
function C(key,alt,H,s,tr,T,caps,times){N.scene(key,alt,H,s,tr,T,caps,times)}

/* ---- temperatura = agitação média ---- */
(function(){var T=15,H=176,s='',tr=[],i;
 s+=box(40,30,150,100,"#9cc3ec");
 var pos=[[64,56],[100,50],[140,60],[170,52],[70,92],[108,100],[148,94],[172,108],[88,76],[128,78]];
 for(i=0;i<pos.length;i++){s+=mol(pos[i][0],pos[i][1],"var(--f-agua2)","m"+i);tr.push(N.jit(".m"+i,T,[[0,5,.8,3],[5,7,.3,6],[7,T,.22,15]]))}
 s+=flame(115,162,"fl");tr.push(N.op(".fl",T,[[0,0],[4.6,0],[5,1],[T,1]]));
 s+=N.th(236,30,100,"mer",.85)+t_(236,168,"temperatura",{s:11});
 tr.push(N.sc(".mer",T,[[0,1,.25],[4.6,1,.25],[9,1,.85]]));
 var q=N.seq("tq",236,20,["baixa","alta"],[0,8],T,{s:12});s+=q.s;tr=tr.concat(q.t);
 s+=t_(115,22,"agitação das moléculas",{s:11});
 C("agitacao","Animação: as moléculas de um corpo estão em movimento; ao aquecê-lo elas ficam mais agitadas e o termômetro mostra temperatura maior, pois a temperatura mede a agitação média das moléculas",H,s,tr,T,["Frio: moléculas pouco agitadas,|temperatura baixa","Aquecendo, a energia faz as moléculas|se agitarem cada vez mais","Mais agitação média = maior temperatura.|O termômetro mede isso"],[0,4.6,8.4])})();

/* ---- calor x temperatura ---- */
(function(){var T=15,H=184,s='',tr=[],i;
 s+='<rect x="30" y="40" width="100" height="70" rx="8" fill="#ef4444" fill-opacity=".3" stroke="currentColor" stroke-width="2"/><rect x="190" y="40" width="100" height="70" rx="8" fill="#3b82f6" fill-opacity=".3" stroke="currentColor" stroke-width="2"/>'+t_(80,128,"corpo quente",{s:11})+t_(240,128,"corpo frio",{s:11});
 for(i=0;i<4;i++){s+=arr(134,52+i*16,186,52+i*16,HOT,"hf"+i,2.4);tr.push(N.tr(".hf"+i,T,[[0,-8,0],[1.4+.4*i,-8,0],[2.4+.4*i,0,0],[3.4+.4*i,8,0]]));tr.push(N.op(".hf"+i,T,[[0,0],[1.4+.4*i,0],[2+.4*i,1],[9,1],[10,0]]))}
 s+=t_(160,34,"calor (energia em trânsito)",{s:11,c:"ct"});tr.push(N.vis(".ct",T,1.4,10));
 var a=N.seq("ta",80,82,["90 °C","60 °C"],[0,3],T,{s:16}),b=N.seq("tb",240,82,["30 °C","60 °C"],[0,3],T,{s:16});
 /* temperaturas: transição gradual com valores intermediários */
 a=N.seq("ta",80,82,["90 °C","80 °C","70 °C","60 °C"],[0,2.6,4.6,6.6],T,{s:16});b=N.seq("tb",240,82,["30 °C","40 °C","50 °C","60 °C"],[0,2.6,4.6,6.6],T,{s:16});
 s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 s+=t_(160,160,"T iguais: equilíbrio térmico, o calor para de fluir",{s:11,c:"fn"});tr.push(N.vis(".fn",T,7.4));
 C("calor_temp","Animação: um corpo quente a 90 graus e um frio a 30 graus em contato; o calor, energia em trânsito, flui do quente para o frio até as temperaturas se igualarem em 60 graus",H,s,tr,T,["Temperatura mede o quão quente está o corpo:|90 °C e 30 °C","Calor é a energia que passa do corpo quente|para o frio por diferença de temperatura","Quando as temperaturas se igualam,|cessa o fluxo de calor"],[0,1.4,7])})();

/* ---- escalas termométricas ---- */
(function(){var T=16,H=190,s='',tr=[];
 s+=N.th(56,26,130,"mer",1);
 s+='<line x1="68" y1="30" x2="86" y2="30" stroke="currentColor"/><line x1="68" y1="176" x2="86" y2="176" stroke="currentColor"/>'+t_(90,34,"ebulição da água",{s:10,a:"start"})+t_(90,180,"fusão do gelo",{s:10,a:"start"});
 tr.push(N.sc(".mer",T,[[0,1,.02],[1,1,.02],[10,1,1]]));
 var tc=["0","25","50","75","100"],tf=["32","77","122","167","212"],tk=["273","298","323","348","373"],ts=[0,3,5.2,7.4,9.6];
 var a=N.seq("tc",200,56,tc.map(function(v){return"TC = "+v+" °C"}),ts,T,{s:15}),b=N.seq("tf",200,86,tf.map(function(v){return"TF = "+v+" °F"}),ts,T,{s:15}),c=N.seq("tk",200,116,tk.map(function(v){return"TK = "+v+" K"}),ts,T,{s:15});
 s+=a.s+b.s+c.s;tr=tr.concat(a.t,b.t,c.t);
 s+=t_(200,146,"TK = TC + 273 · TC/5 = (TF − 32)/9",{s:10,c:"fm"})+t_(200,164,"ΔTK = ΔTC · ΔTF = 1,8 · ΔTC",{s:10,c:"fm2"});
 tr.push(N.vis(".fm",T,10.4),N.vis(".fm2",T,11.4));
 C("escalas","Animação: um termômetro sobe do ponto de fusão do gelo ao de ebulição da água e mostra os valores correspondentes nas escalas Celsius, Fahrenheit e Kelvin: 0, 32 e 273 até 100, 212 e 373",H,s,tr,T,["O mesmo termômetro lido em três escalas:|gelo derretendo = 0 °C = 32 °F = 273 K","Subindo, as leituras mudam juntas:|Celsius e Kelvin variam igual, Fahrenheit varia 1,8 vez","Água fervendo = 100 °C = 212 °F = 373 K.|Kelvin = Celsius + 273; não há Kelvin negativo"],[0,3,9.6])})();

/* ---- onde C e F coincidem ---- */
(function(){var T=14,H=196,s='',tr=[],X=function(c){return 160+c*1.1},Y=function(v){return 100-v*.8};
 s+='<path d="M40 100H290M160 20V176" stroke="currentColor" stroke-width="1.5"/>'+t_(292,96,"TC",{s:11,a:"start"})+t_(166,24,"T",{s:11,a:"start"});
 s+='<path class="l1" pathLength="100" d="M'+X(-60)+' '+Y(-60)+'L'+X(60)+' '+Y(60)+'" stroke="currentColor" stroke-opacity=".6" stroke-width="2.5" fill="none" stroke-dasharray="100" stroke-dashoffset="0"/>';
 s+='<path class="l2" pathLength="100" d="M'+X(-60)+' '+Y(-76)+'L'+X(60)+' '+Y(140)+'" stroke="var(--f-calor)" stroke-width="3" fill="none" stroke-dasharray="100" stroke-dashoffset="0"/>';
 tr.push(N.pr(".l1",T,"strokeDashoffset",[[0,100],[.2,100],[2,0]]),N.pr(".l2",T,"strokeDashoffset",[[0,100],[2,100],[4.4,0]]));
 s+=t_(X(46),Y(40)+14,"TF = TC",{s:11,a:"start"})+t_(X(40),Y(100)+4,"TF = 1,8·TC + 32",{s:11,a:"start"});
 s+='<g class="pt"><circle cx="'+X(-40)+'" cy="'+Y(-40)+'" r="6" fill="var(--acc)"/><line x1="'+X(-40)+'" y1="'+Y(-40)+'" x2="'+X(-40)+'" y2="100" stroke="currentColor" stroke-dasharray="3 3"/>'+t_(X(-40)-6,Y(-40)+16,"−40",{s:12,a:"end"})+'</g>';tr.push(N.vis(".pt",T,4.8));
 s+=t_(160,190,"−40 °C = −40 °F",{s:14,c:"fi"});tr.push(N.vis(".fi",T,6));
 C("menos40","Animação: as retas das escalas Celsius e Fahrenheit se cruzam em menos 40: nessa temperatura os dois termômetros marcam o mesmo número, menos 40",H,s,tr,T,["Plotando TF contra TC, a conversão|é uma reta: TF = 1,8 · TC + 32","A reta TC = TC (mesmo valor) é a diagonal.|Elas se cruzam em um único ponto","No cruzamento, TC = TF = −40:|as duas escalas marcam o mesmo número"],[0,2,4.8])})();

/* ---- estados físicos ---- */
(function(){var T=16,H=206,s='',tr=[],i,j;
 var X=[8,125,242],nm=["sólido","líquido","gasoso"];
 X.forEach(function(x,k){s+=box(x,56,70,70,k===0?"#9cc3ec":k===1?"#7fc0e8":"var(--surface)")+t_(x+35,142,nm[k],{s:12})});
 for(i=0;i<3;i++)for(j=0;j<3;j++){s+=mol(22+i*20,72+j*22,"var(--f-agua2)","ms"+i+j,5);tr.push(N.jit(".ms"+i+j,T,[[0,T,.5,1.5]]))}
 var lq=[[140,74],[170,76],[152,98],[186,100],[132,112],[166,116],[190,84]];lq.forEach(function(p,k){s+=mol(p[0],p[1],"var(--f-agua)","ml"+k,5);tr.push(N.jit(".ml"+k,T,[[0,T,.35,6]]))});
 var gs=[[246,70],[290,82],[262,108],[240,116],[296,114]];gs.forEach(function(p,k){s+=mol(p[0],p[1],"var(--f-calor)","mg"+k,5);tr.push(N.jit(".mg"+k,T,[[0,T,.25,16]]))});
 var G1='<g class="g1">'+arr(82,80,121,80,HOT,"",3)+arr(121,106,82,106,COLD,"",3)+t_(102,72,"fusão",{s:10})+t_(102,124,"solidif.",{s:9})+'</g>';
 var G2='<g class="g2">'+arr(199,80,238,80,HOT,"",3)+arr(238,106,199,106,COLD,"",3)+t_(219,72,"vapor.",{s:10})+t_(219,124,"cond.",{s:9})+'</g>';
 var G3='<g class="g3"><path d="M43 52C110 -2 210 -2 277 52" fill="none" stroke="var(--acc)" stroke-width="3" stroke-dasharray="6 4"/>'+t_(160,26,"sublimação (direta)",{s:11})+'</g>';
 s+=G1+G2+G3;
 tr.push(N.vis(".g1",T,1.2),N.vis(".g2",T,5),N.vis(".g3",T,9));
 s+=t_(160,176,"aquecer: ordem → desordem (↑ energia)",{s:10,c:"fa"})+t_(160,192,"resfriar: o caminho inverso",{s:10,c:"fb"});tr.push(N.vis(".fa",T,3),N.vis(".fb",T,7.4));
 C("estados","Animação: três estados da matéria com moléculas em arranjos diferentes, e setas que nomeiam as mudanças de estado: fusão e solidificação, vaporização e condensação, sublimação direta do sólido ao gás",H,s,tr,T,["Sólido (moléculas organizadas) vira líquido na|fusão; líquido vira sólido na solidificação","Líquido vira gás na vaporização;|gás vira líquido na condensação","Sublimação: passa direto de sólido a gás,|sem virar líquido (ex.: gelo-seco)"],[0,1.2,5])})();

/* ---- pressão e ebulição ---- */
(function(){var T=16,H=216,s='',tr=[],P=[[56,"nível do mar","100 °C",3],[160,"alta montanha","~90 °C",1],[264,"panela de pressão","~120 °C",5]];
 P.forEach(function(p,k){var x=p[0];
  s+='<path d="M'+(x-32)+' 62V132a8 8 0 0 0 8 8h48a8 8 0 0 0 8-8V62" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="'+(x-30)+'" y="84" width="60" height="54" rx="4" fill="var(--f-agua)" fill-opacity=".45"/>'+t_(x,156,p[1],{s:11});
  if(k===2)s+='<rect x="'+(x-36)+'" y="56" width="72" height="8" rx="3" fill="#9aa6b8" stroke="currentColor" stroke-width="2"/>';
  for(var a=0;a<p[3];a++)s+=arr(x-24+a*(48/Math.max(p[3]-1,1)),32,x-24+a*(48/Math.max(p[3]-1,1)),(k===2?52:78),"currentColor","pa"+k,2);
  for(var b=0;b<3;b++){s+='<circle class="bb'+k+b+'" cx="'+(x-14+b*14)+'" cy="128" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/>';tr.push(N.tr(".bb"+k+b,T,[[0,0,0],[1.2+.5*b,0,0],[3+.5*b,0,-42],[3.2+.5*b,0,0],[4.8+.5*b,0,-42],[5,0,0],[6.6+.5*b,0,-42],[6.8,0,0],[8.2+.5*b,0,-42],[8.4,0,0],[T,0,0]]));tr.push(N.op(".bb"+k+b,T,[[0,0],[1.2+.5*b,0],[1.5+.5*b,1],[T,1]]))}
  s+=N.th(x+46,70,0,"mx"+k,0).replace(/<g>[^]*<\/g>/,'')+t_(x,176,p[2],{s:15,c:"tp"+k});tr.push(N.vis(".tp"+k,T,3.4+2.4*k))});
 s+=t_(160,198,"mais pressão ⇒ ferve em temperatura maior",{s:11,c:"fin"});tr.push(N.vis(".fin",T,11));
 C("pressao_ebul","Animação: três recipientes com água fervendo: ao nível do mar a 100 graus, no alto da montanha a cerca de 90 graus, pois a pressão é menor, e na panela de pressão a cerca de 120 graus, pois a pressão é maior",H,s,tr,T,["Ao nível do mar a pressão é normal:|a água ferve a 100 °C","Em grande altitude a pressão é menor:|a água ferve a uma temperatura menor","Na panela de pressão a pressão é maior:|a água ferve acima de 100 °C e cozinha mais rápido"],[0,3.4,5.8])})();

/* ---- evaporação x ebulição ---- */
(function(){var T=15,H=204,s='',tr=[],i;
 [[80,"evaporação"],[240,"ebulição"]].forEach(function(p,k){var x=p[0];
  s+='<path d="M'+(x-44)+' 54V134a8 8 0 0 0 8 8h72a8 8 0 0 0 8-8V54" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="'+(x-42)+'" y="80" width="84" height="60" rx="4" fill="var(--f-agua)" fill-opacity=".45"/>'+t_(x,164,p[1],{s:13});
  s+=t_(x,178,k?"no líquido todo (100 °C)":"só na superfície",{s:10})});
 for(i=0;i<5;i++){s+=mol(52+i*14,78,"var(--f-agua)","ev"+i,3.5);tr.push(N.tr(".ev"+i,T,[[0,0,0],[1+1.8*i,0,0],[3+1.8*i,(i%2?8:-6),-38],[3.1+1.8*i,0,0],[T,0,0]]));tr.push(N.op(".ev"+i,T,[[0,1],[1+1.8*i,1],[2.6+1.8*i,.2],[3.1+1.8*i,1],[T,1]]))}
 for(i=0;i<6;i++){s+='<circle class="eb'+i+'" cx="'+(212+(i%3)*14)+'" cy="'+(124-Math.floor(i/3)*18)+'" r="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/>';tr.push(N.tr(".eb"+i,T,[[0,0,0],[6+.3*i,0,0],[8+.3*i,0,-66+Math.floor(i/3)*16],[8.2+.3*i,0,0],[T,0,0]]));tr.push(N.op(".eb"+i,T,[[0,0],[5.6+.3*i,0],[6+.3*i,1],[T,1]]))}
 s+=flame(240,212,"fl");tr.push(N.op(".fl",T,[[0,0],[5,0],[5.4,1],[T,1]]));
 s+=t_(80,44,"(lenta, silenciosa)",{s:10})+t_(240,44,"(rápida, com bolhas)",{s:10});
 C("evap_ebul","Animação: na evaporação, moléculas escapam apenas da superfície do líquido, lentamente e em qualquer temperatura; na ebulição, bolhas de vapor se formam no interior do líquido que atingiu a temperatura de ebulição",H,s,tr,T,["Evaporação: moléculas da superfície escapam|aos poucos, em qualquer temperatura","Ebulição: com muito calor, bolhas de vapor se formam|dentro do líquido, na temperatura de ebulição","Evaporação é lenta e superficial;|ebulição é rápida e acontece em todo o líquido"],[0,3,6])})();

/* ---- suor ---- */
(function(){var T=15,H=198,s='',tr=[],i;
 s+='<rect x="40" y="108" width="240" height="44" rx="10" fill="#f1c9a5" fill-opacity=".7" stroke="currentColor" stroke-width="2"/>'+t_(160,172,"pele",{s:11});
 for(i=0;i<5;i++){s+='<g class="sw'+i+'"><path d="M'+(70+i*44)+' 98c-6 8-6 14 0 14s6-6 0-14z" fill="var(--f-agua)" stroke="currentColor" stroke-width="1.2"/></g>';
  s+=mol(70+i*44,90,"var(--f-calor)","ev"+i,4);tr.push(N.tr(".ev"+i,T,[[0,0,10],[2+.7*i,0,10],[6+.7*i,6,-52]]));tr.push(N.op(".ev"+i,T,[[0,0],[2+.7*i,0],[2.4+.7*i,1],[6+.7*i,.2],[T,0]]));
  tr.push(N.op(".sw"+i,T,[[0,0],[.6+.2*i,1],[3+.7*i,1],[5+.7*i,0],[T,0]]))}
 s+=N.th(298,30,80,"mer",.72)+t_(298,128,"",{s:1});tr.push(N.sc(".mer",T,[[0,1,.85],[6,1,.85],[11,1,.62]]));
 var q=N.seq("pt",298,18,["37 °C","36 °C"],[0,8],T,{s:11});s+=q.s;tr=tr.concat(q.t);
 for(i=0;i<3;i++){s+=arr(70+i*90,150,70+i*90,118,HOT,"cl"+i,2.4);tr.push(N.vis(".cl"+i,T,2.4+.6*i,8))}
 s+=t_(160,190,"evaporar retira energia da pele: ela esfria",{s:11,c:"fin"});tr.push(N.vis(".fin",T,8.6));
 C("suor","Animação: gotas de suor na pele recebem calor do corpo e evaporam; as moléculas mais energéticas escapam levando energia embora, e a temperatura da pele diminui",H,s,tr,T,["O suor molha a pele; o corpo está aquecido","Para evaporar, a água retira calor da pele:|as moléculas mais energéticas escapam","Com a energia levada pelo vapor, a pele esfria.|Por isso suar ajuda a resfriar o corpo"],[0,2.2,6.4])})();

/* ---- três formas de propagação ---- */
(function(){var T=18,H=204,s='',tr=[],i;
 s+=flame(110,150,"fl")+'<rect x="82" y="150" width="56" height="10" rx="3" fill="#8b5a2b" stroke="currentColor"/>';
 s+='<rect x="150" y="124" width="100" height="10" rx="3" fill="#9aa6b8" stroke="currentColor"/>'+t_(206,150,"",{s:1});
 for(i=0;i<5;i++){s+='<circle class="cd'+i+'" cx="'+(160+i*20)+'" cy="129" r="4" fill="'+HOT+'" opacity="0"/>';tr.push(N.op(".cd"+i,T,[[0,0],[1+1.1*i,0],[1.8+1.1*i,.9],[T,.9]]))}
 s+='<g class="g1">'+t_(206,116,"condução",{s:12})+'</g>';tr.push(N.vis(".g1",T,1,6));
 for(i=0;i<3;i++){s+=arr(80+i*30,118,80+i*30,60,HOT,"cv"+i,3);tr.push(N.tr(".cv"+i,T,[[0,0,10],[6.4+.4*i,0,10],[7.6+.4*i,0,0],[10,0,-8]]));tr.push(N.op(".cv"+i,T,[[0,0],[6.4+.4*i,0],[7+.4*i,1],[11,1],[12,0]]))}
 s+='<g class="g2">'+t_(110,50,"convecção",{s:12})+'</g>';tr.push(N.vis(".g2",T,6.4,12));
 s+='<g class="g3"><circle cx="28" cy="108" r="11" fill="#f1c9a5" stroke="currentColor" stroke-width="2"/><rect x="14" y="120" width="28" height="30" rx="8" fill="#f1c9a5" stroke="currentColor" stroke-width="2"/>'+arr(80,118,50,118,"#f5b50a","",2.4)+arr(80,132,50,132,"#f5b50a","",2.4)+arr(80,146,50,146,"#f5b50a","",2.4)+t_(40,168,"radiação",{s:12})+'</g>';tr.push(N.vis(".g3",T,12.4));
 s+=t_(160,196,"condução · convecção · radiação",{s:11,c:"fin"});tr.push(N.vis(".fin",T,15));
 C("tres_formas","Animação: uma fogueira mostra as três formas de propagação do calor: condução ao longo de uma barra de metal em contato com o fogo, convecção com o ar quente subindo e radiação em ondas que chegam a uma pessoa ao lado",H,s,tr,T,["Condução: o calor passa ao longo do material,|de partícula em partícula, sem transporte de matéria","Convecção: o ar quente sobe e o frio desce.|Ocorre em líquidos e gases","Radiação: ondas eletromagnéticas levam calor|mesmo no vácuo, sem precisar de meio material"],[0,6,12.2])})();

/* ---- ar preso isola ---- */
(function(){var T=15,H=196,s='',tr=[],i,j;
 s+='<rect x="30" y="40" width="70" height="110" rx="14" fill="#f1c9a5" fill-opacity=".8" stroke="currentColor" stroke-width="2"/>'+t_(65,98,"37 °C",{s:14})+t_(65,170,"corpo",{s:11});
 s+='<g class="coat"><rect x="104" y="40" width="70" height="110" rx="6" fill="#d9c7a0" fill-opacity=".7" stroke="currentColor" stroke-width="2"/>';
 for(i=0;i<3;i++)for(j=0;j<6;j++)s+='<circle cx="'+(116+i*21)+'" cy="'+(54+j*18)+'" r="6" fill="var(--surface)" stroke="currentColor" stroke-width="1"/>';
 s+=t_(139,170,"lã (ar preso)",{s:11})+'</g>';
 tr.push(N.tr(".coat",T,[[0,70,0],[0,70,0],[4,70,0],[5.6,0,0]]));tr.push(N.op(".coat",T,[[0,0],[4,0],[5.6,1]]));
 for(i=0;i<3;i++){s+=arr(102,64+i*34,300,64+i*34,HOT,"h1"+i,3)+arr(178,64+i*34,230,64+i*34,HOT,"h2"+i,1.6);tr.push(N.op(".h1"+i,T,[[0,1],[4,1],[5,0]]),N.op(".h2"+i,T,[[0,0],[4.4,0],[5.8,1]]))}
 s+=t_(230,176,"perda de calor",{s:11,c:"pl1"});tr.push(N.op(".pl1",T,[[0,1],[4,1],[5,0]]));
 s+=t_(230,176,"perda bem menor",{s:11,c:"pl2"});tr.push(N.vis(".pl2",T,5.8));
 s+=t_(160,190,"o ar é mau condutor: dificulta a saída do calor",{s:11,c:"fin"});tr.push(N.vis(".fin",T,8));
 C("ar_isolante","Animação: o calor do corpo escapa rápido para o ambiente; ao vestir um casaco de lã, o ar preso entre as fibras, mau condutor, reduz muito a perda de calor",H,s,tr,T,["Sem agasalho: o calor do corpo escapa|facilmente para o ambiente frio","A lã prende ar entre as fibras;|o ar é um péssimo condutor de calor","Com o ar preso, a perda de calor diminui:|a lã não aquece, ela isola o corpo"],[0,3.6,6.4])})();

/* ---- cores e radiação ---- */
(function(){var T=15,H=200,s='',tr=[],i;
 s+='<circle cx="160" cy="28" r="14" fill="#f5b50a" stroke="#a67c00" stroke-width="2"/>';
 s+='<rect x="52" y="108" width="70" height="40" rx="6" fill="#1f1f24" stroke="currentColor" stroke-width="2"/><rect x="198" y="108" width="70" height="40" rx="6" fill="#f4f4f4" stroke="currentColor" stroke-width="2"/>'+t_(87,168,"preto",{s:12})+t_(233,168,"branco",{s:12});
 for(i=0;i<3;i++){s+=arr(140+i*8,48+i*4,70+i*18,100,"#f5b50a","r1"+i,2.4);s+=arr(180+i*8,48+i*4,214+i*18,100,"#f5b50a","r2"+i,2.4)}
 s+=arr(210,100,236,56,"#f5b50a","rf0",2.4)+arr(232,100,258,56,"#f5b50a","rf1",2.4)+arr(254,100,280,56,"#f5b50a","rf2",2.4)+t_(262,48,"refletida",{s:10,c:"rl"});
 tr.push(N.vis(".rf0,.rf1,.rf2,.rl",T,3.4));
 s+=N.th(30,80,70,"m1",.9)+N.th(298,80,70,"m2",.3);
 tr.push(N.sc(".m1",T,[[0,1,.2],[3,1,.2],[10,1,.9]]),N.sc(".m2",T,[[0,1,.2],[3,1,.2],[10,1,.3]]));
 var a=N.seq("c1",30,64,["25 °C","58 °C"],[0,8],T,{s:11}),b=N.seq("c2",298,64,["25 °C","32 °C"],[0,8],T,{s:11});s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 s+=t_(160,190,"escuro absorve mais radiação · claro reflete mais",{s:11,c:"fin"});tr.push(N.vis(".fin",T,8.6));
 C("cores_sol","Animação: a luz do Sol atinge um objeto preto e outro branco; o preto absorve quase toda a radiação e esquenta muito, enquanto o branco reflete grande parte e esquenta pouco",H,s,tr,T,["O Sol envia radiação para os dois objetos,|inicialmente à mesma temperatura","O branco reflete grande parte da radiação;|o preto a absorve quase toda","O objeto que absorve mais fica mais quente:|por isso os escuros esquentam mais ao sol"],[0,3,6.4])})();

/* ---- sensação de frio: cerâmica x tapete ---- */
(function(){var T=15,H=196,s='',tr=[],i;
 [[82,"cerâmica","conduz bem",4,"#c9d3de"],[238,"tapete","conduz mal",1,"#d9c7a0"]].forEach(function(p,k){var x=p[0];
  s+='<rect x="'+(x-56)+'" y="112" width="112" height="30" rx="6" fill="'+p[4]+'" fill-opacity=".8" stroke="currentColor" stroke-width="2"/>'+t_(x,160,p[1]+" (15 °C)",{s:11})+t_(x,176,p[2],{s:10});
  s+='<rect x="'+(x-22)+'" y="62" width="44" height="40" rx="14" fill="#f1c9a5" stroke="currentColor" stroke-width="2"/>'+t_(x,48,"mão 32 °C",{s:11});
  for(i=0;i<p[3];i++){s+=arr(x-24+i*16,102,x-24+i*16,126,HOT,"f"+k+i,2.6);tr.push(N.tr(".f"+k+i,T,[[0,0,-6],[1+.5*i,0,-6],[2.4+.5*i,0,4],[4+.5*i,0,10]]));tr.push(N.op(".f"+k+i,T,[[0,0],[1+.5*i,0],[1.5+.5*i,1],[T,1]]))}});
 var a=N.seq("e1",82,28,["perde calor rápido","sensação: frio"],[0,7],T,{s:11}),b=N.seq("e2",238,28,["perde calor devagar","sensação: menos frio"],[0,7],T,{s:11});s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 s+=t_(160,192,"mesma temperatura, troca de calor diferente",{s:10,c:"fin"});tr.push(N.vis(".fin",T,8));
 C("tato","Animação: uma mão encosta em um piso de cerâmica e em um tapete, ambos à mesma temperatura; a cerâmica conduz o calor bem e retira calor da mão depressa, parecendo mais fria, enquanto o tapete conduz mal",H,s,tr,T,["Cerâmica e tapete estão na mesma temperatura,|bem abaixo da temperatura da mão","A cerâmica conduz bem: tira calor da mão|rapidamente e parece muito fria","O tapete conduz mal: tira calor devagar.|A sensação depende da rapidez da troca"],[0,1,3.4])})();
})();
