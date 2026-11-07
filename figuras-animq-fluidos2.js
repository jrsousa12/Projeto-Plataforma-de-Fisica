/* Mecânica dos Fluidos: animações novas (densidade, pressão, atmosfera). */
(function(){"use strict";
var N=window.AN,t_=N.t,PI=Math.PI,W="var(--f-agua)",RED="var(--f-verm)",AMB="var(--f-amar)";
function arr(x1,y1,x2,y2,c,cl,w){var a=Math.atan2(y2-y1,x2-x1),h=7;return'<g class="'+(cl||"")+'"><line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+(w||3)+'" stroke-linecap="round"/><path d="M'+x2+' '+y2+'L'+(x2-h*Math.cos(a-.5))+' '+(y2-h*Math.sin(a-.5))+'L'+(x2-h*Math.cos(a+.5))+' '+(y2-h*Math.sin(a+.5))+'z" fill="'+c+'"/></g>'}
function R(x,y,w,h,f,o,cl,st){return'<rect'+(cl?' class="'+cl+'"':'')+' x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3" fill="'+f+'" fill-opacity="'+(o==null?1:o)+'" stroke="currentColor" stroke-width="2"'+(st?' style="'+st+'"':'')+'/>'}
function glass(x,y,w,h){return'<path d="M'+x+' '+y+'V'+(y+h-6)+'a6 6 0 0 0 6 6h'+(w-12)+'a6 6 0 0 0 6-6V'+y+'" fill="none" stroke="currentColor" stroke-width="2.4"/>'}
function wat(x,y,w,h,cl,f,o){return'<rect'+(cl?' class="'+cl+'"':'')+' x="'+(x+1.5)+'" y="'+y+'" width="'+(w-3)+'" height="'+h+'" rx="3" fill="'+(f||W)+'" fill-opacity="'+(o||.5)+'" style="transform-box:fill-box;transform-origin:50% 100%"/>'}
var BOT="transform-box:fill-box;transform-origin:50% 100%",TOP="transform-box:fill-box;transform-origin:50% 0";
function C(key,alt,H,s,tr,T,caps,times){N.scene(key,alt,H,s,tr,T,caps,times)}
function up(sel,T,t0,t1,dy){return N.tr(sel,T,[[0,0,0],[t0,0,0],[t1,0,dy]])}
function fade(sel,T,t0){return N.op(sel,T,[[0,0],[t0,0],[t0+.4,1],[T,1]])}

/* oco_navio: massa específica x densidade do objeto */
(function(){var T=16,H=212,s='',tr=[];
 s+=glass(40,50,240,120)+wat(40,84,240,86,"",W,.45);
 s+='<g class="b1">'+R(70,86,44,44,"#9aa6b8",.85)+t_(92,112,"ferro",{s:11})+t_(92,70,"maciço",{s:10})+'</g>';tr.push(N.tr(".b1",T,[[0,0,-34],[1.2,0,-34],[4,0,38]]));
 s+='<g class="b2"><path d="M138 78h60v34a8 8 0 0 1-8 8h-44a8 8 0 0 1-8-8z" fill="#9aa6b8" fill-opacity=".85" stroke="currentColor" stroke-width="2"/><path d="M148 86h40v26a4 4 0 0 1-4 4h-32a4 4 0 0 1-4-4z" fill="var(--surface)" stroke="currentColor" stroke-dasharray="3 2"/>'+t_(168,104,"ar",{s:10})+t_(168,66,"ferro oco",{s:10})+'</g>';tr.push(N.tr(".b2",T,[[0,0,-34],[5,0,-34],[8,0,-4]]));
 s+='<g class="b3"><path d="M220 98h54l-8 18h-38z" fill="#9aa6b8" fill-opacity=".9" stroke="currentColor" stroke-width="2"/><path d="M247 98V76l16 8" fill="none" stroke="currentColor" stroke-width="2"/>'+t_(247,68,"navio",{s:10})+'</g>';tr.push(N.tr(".b3",T,[[0,0,-34],[8.4,0,-34],[11,0,-10]]));
 var a=N.seq("tq",92,186,["μ = 7,8 g/cm³","afunda"],[0,4],T,{s:11}),b=N.seq("tr",168,186,["d < 1,0","flutua"],[3,8],T,{s:11}),c=N.seq("ts",247,186,["d < 1,0","flutua"],[6,11],T,{s:11});
 s+=a.s+b.s+c.s;tr=tr.concat(a.t,b.t,c.t);
 s+=t_(160,204,"densidade do objeto = massa ÷ volume total (com vazios)",{s:11,c:"fin"});tr.push(N.vis(".fin",T,11.6));
 C("oco_navio","Animação: um bloco de ferro maciço afunda na água, mas uma peça de ferro oca e um navio flutuam, pois a densidade do objeto inteiro, com o ar no interior, é menor que a da água",H,s,tr,T,["Ferro maciço: massa específica 7,8 g/cm³ maior que a da água, ele afunda","Ferro oco: o ar no interior aumenta o volume|e reduz a densidade do objeto","O navio é oco: densidade média menor que a da água, e ele flutua"],[0,4.4,8.6])})();

/* unid_dens: g/cm³ e kg/m³ */
(function(){var T=16,H=200,s='',tr=[];
 s+=R(34,86,34,34,W,.55)+t_(51,78,"1 cm³",{s:12})+t_(51,140,"1 g",{s:13})+t_(51,156,"de água",{s:11});
 s+='<g class="g2" style="transform-box:fill-box;transform-origin:50% 50%">'+R(196,38,100,100,W,.45)+t_(246,92,"1 m³",{s:16})+t_(246,160,"1000 kg",{s:14})+t_(246,176,"de água",{s:11})+'</g>';
 tr.push(N.vis(".g2",T,3.6),N.sc(".g2",T,[[0,.05,.05],[3.6,.05,.05],[7,1,1]]));
 s+='<g class="mv">'+arr(76,103,186,103,AMB,"",3)+t_(131,90,"× 10⁶ (volume)",{s:10})+t_(131,122,"× 10⁻³ (massa)",{s:10})+'</g>';tr.push(N.vis(".mv",T,3.6));
 s+='<g class="fm">'+t_(160,22,"1 g/cm³  =  1000 kg/m³",{s:16,c:"fin"})+'</g>';tr.push(N.vis(".fm",T,8.2));
 C("unid_dens","Animação: um centímetro cúbico de água tem um grama e um metro cúbico de água tem mil quilogramas; assim, 1 g/cm³ equivale a 1000 kg/m³",H,s,tr,T,["1 cm³ de água tem massa de 1 g: μ = 1 g/cm³","1 m³ tem 10⁶ cm³ e 1 g vale 10⁻³ kg:|1 m³ de água tem 1000 kg","Portanto 1 g/cm³ = 1000 kg/m³.|Para converter, multiplique por 1000"],[0,3.6,8.2])})();

/* mesmo_vol */
(function(){var T=15,H=204,s='',tr=[];
 s+=R(52,62,70,70,"#c8a36b",.9)+t_(87,102,"madeira",{s:12})+R(198,62,70,70,"#7b8794",.95)+t_(233,102,"chumbo",{s:12});
 s+=t_(87,48,"1 L",{s:12})+t_(233,48,"1 L",{s:12})+'<line x1="40" y1="134" x2="280" y2="134" stroke="currentColor" stroke-width="2"/>';
 s+=R(60,142,54,8,"#c8a36b",1,"m1",TOP)+R(206,142,54,32,"#7b8794",1,"m2",TOP);
 tr.push(N.sc(".m1",T,[[0,1,.01],[2,1,.01],[6,1,1]]),N.sc(".m2",T,[[0,1,.01],[2,1,.01],[6,1,1]]));
 var a=N.seq("ta",87,192,["m = 0","m = 0,8 kg"],[0,6],T,{s:12}),b=N.seq("tb",233,192,["m = 0","m = 11,3 kg"],[0,6],T,{s:12});s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 s+='<g class="vs">'+t_(160,22,"mesmo volume:  V₁ = V₂",{s:12})+'</g>';tr.push(N.vis(".vs",T,1));
 C("mesmo_vol","Animação: dois blocos de mesmo volume, um de madeira e outro de chumbo, são colocados em balanças; o de chumbo tem muito mais massa porque sua massa específica é maior",H,s,tr,T,["Dois blocos de mesmo volume: madeira e chumbo","Medimos a massa de cada um","Mesmo volume, mais massa:|o chumbo tem maior massa específica (μ = m / V)"],[0,2,6])})();

/* meia_barra */
(function(){var T=16,H=200,s='',tr=[];
 s+=R(30,60,150,34,"#b6bfca",.9)+t_(105,28,"barra maciça de alumínio",{s:11})+t_(105,44,"m = 4 kg   V = 1,5 dm³",{s:11});
 s+='<g class="cut"><path d="M105 54V100" stroke="'+RED+'" stroke-width="3" stroke-dasharray="5 3"/></g>';tr.push(N.vis(".cut",T,2.2));
 s+='<g class="h1">'+R(30,126,70,34,"#b6bfca",.9)+t_(65,148,"m = 2 kg",{s:11})+t_(65,176,"V = 0,75 dm³",{s:11})+'</g><g class="h2">'+R(110,126,70,34,"#b6bfca",.9)+t_(145,148,"m = 2 kg",{s:11})+t_(145,176,"V = 0,75 dm³",{s:11})+'</g>';
 tr.push(N.tr(".h1",T,[[0,0,-66],[2.6,0,-66],[5,0,0]]),N.tr(".h2",T,[[0,0,-66],[2.6,0,-66],[5,0,0]]),N.vis(".h1",T,2.6),N.vis(".h2",T,2.6));
 s+='<g class="rr">'+t_(250,90,"μ = m / V",{s:13})+t_(250,112,"μ = 2,7 g/cm³",{s:13})+t_(250,134,"em toda parte",{s:11})+'</g>';tr.push(N.vis(".rr",T,6.4));
 C("meia_barra","Animação: uma barra maciça de alumínio é cortada ao meio; cada metade tem metade da massa e metade do volume, e a massa específica continua a mesma",H,s,tr,T,["Barra maciça de alumínio: μ = m / V","Cortamos ao meio: cada pedaço tem|metade da massa e metade do volume","A razão m / V não muda:|a massa específica é uma propriedade do material"],[0,2.2,6])})();

/* esferas_dens */
(function(){var T=16,H=200,s='',tr=[];
 s+='<circle cx="90" cy="86" r="42" fill="#c8a36b" fill-opacity=".85" stroke="currentColor" stroke-width="2"/>'+t_(90,90,"A",{s:18})+'<circle cx="230" cy="86" r="26" fill="#7b8794" fill-opacity=".9" stroke="currentColor" stroke-width="2"/>'+t_(230,90,"B",{s:18});
 s+=t_(90,150,"m = 1 kg",{s:12})+t_(230,150,"m = 1 kg",{s:12})+t_(90,168,"V = 2V₀",{s:12})+t_(230,168,"V = V₀",{s:12});
 var a=N.seq("ta",90,24,["μ = ?","μ = m / 2V₀"],[0,5],T,{s:12}),b=N.seq("tb",230,24,["μ = ?","μ = m / V₀"],[0,5],T,{s:12});s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 s+='<g class="fi">'+t_(160,190,"A tem metade da massa específica de B",{s:12,c:"fin"})+'</g>';tr.push(N.vis(".fi",T,9));
 C("esferas_dens","Animação: duas esferas de mesma massa, uma com o dobro do volume da outra; a esfera de maior volume tem massa específica igual à metade da outra",H,s,tr,T,["Mesma massa, volumes diferentes:|A tem o dobro do volume de B","Calculamos μ = m / V para cada esfera","Com o mesmo m e o dobro de V,|a massa específica de A é a metade da de B"],[0,3,9])})();

/* oleo_agua */
(function(){var T=16,H=200,s='',tr=[],i;
 s+=glass(110,30,100,140)+wat(111,96,98,72,"",W,.5);
  s+='<rect class="ol2" x="111.5" y="60" width="97" height="36" fill="'+AMB+'" fill-opacity=".6" style="transform-box:fill-box;transform-origin:50% 100%"/>';
 tr.push(N.op(".ol2",T,[[0,0],[2.5,0],[10,1]]));
 for(i=0;i<5;i++){s+='<circle class="d'+i+'" cx="'+(126+i*16)+'" cy="148" r="5" fill="'+AMB+'" fill-opacity=".8" stroke="currentColor"/>';tr.push(N.tr(".d"+i,T,[[0,0,-6-i*6],[.2+.35*i,0,-6-i*6],[3.2+.35*i,0,-60-i*2]]),N.op(".d"+i,T,[[0,1],[3+.35*i,1],[3.6+.35*i,0],[T,0]]))}
 s+=t_(60,66,"óleo",{s:12})+t_(60,134,"água",{s:12})+t_(262,66,"0,9 g/cm³",{s:11})+t_(262,134,"1,0 g/cm³",{s:11});
 s+='<g class="fi">'+t_(160,190,"menos denso ⇒ fica por cima",{s:12,c:"fin"})+'</g>';tr.push(N.vis(".fi",T,8));
 C("oleo_agua","Animação: gotas de óleo misturadas à água sobem e formam uma camada por cima, porque o óleo é menos denso que a água",H,s,tr,T,["Óleo e água são misturados no copo","O óleo, menos denso (0,9 g/cm³),|sobe em gotas através da água","Líquidos que não se misturam se separam:|o menos denso fica por cima"],[0,.4,5.6])})();

/* afunda_flutua */
(function(){var T=18,H=210,s='',tr=[];
 s+=glass(30,40,260,130)+wat(30,84,260,84,"",W,.45);
 [["cortiça",.25,54,-1],["madeira",.6,114,-1],["gelo",.92,174,-1],["ferro",7.8,234,0]].forEach(function(o,k){var x=o[2],f=Math.min(o[1],1),w=44,h=34,yEq=84-h*(1-f)-0,yFund=134,end=o[1]>=1?yFund:84-h+h*f;
  s+='<g class="o'+k+'">'+R(x-w/2,0,w,h,["#d8b98a","#c8a36b","#dbeafe","#8b97a6"][k],.92)+t_(x,22,o[0],{s:10})+'</g>';
  tr.push(N.tr(".o"+k,T,[[0,0,28],[1.2+2.4*k,0,28],[3.6+2.4*k,0,end]]));
  s+=t_(x,188,String(o[1]).replace(".",","),{s:11})});
 s+=t_(160,204,"massa específica em g/cm³ (água = 1,0)",{s:10});
 C("afunda_flutua","Animação: vários materiais são soltos na água; os de massa específica menor que 1,0 g/cm³, como cortiça, madeira e gelo, flutuam, e o ferro, de 7,8 g/cm³, afunda",H,s,tr,T,["Soltamos materiais de massa específica diferente na água (1,0 g/cm³)","Cortiça, madeira e gelo são menos densos que a água:|flutuam","O ferro (7,8 g/cm³) é mais denso: afunda.|Afunda se μ > μ do líquido; flutua se μ < μ do líquido"],[0,3.4,11])})();

/* dens_temp */
(function(){var T=16,H=200,s='',tr=[];
 s+=glass(100,40,90,120)+wat(100,90,90,68,"lv",W,.5);tr.push(N.sc(".lv",T,[[0,1,1],[2,1,1],[9,1,1.17]]));
 s+=N.th(236,40,100,"mer",.75)+'<g class="fl"><path d="M145 182c-9-9-9-17-2-26 1 6 5 8 7 13 3-4 2-9 1-12 8 8 11 17 3 25-3 4-6 4-9 0z" fill="var(--f-calor)"/></g>';
 tr.push(N.sc(".mer",T,[[0,1,.25],[2,1,.25],[9,1,.75]]),N.op(".fl",T,[[0,0],[1.6,0],[2,1],[T,1]]));
 var a=N.seq("ta",145,28,["μ = 1,000 g/cm³","μ = 0,990","μ = 0,975"],[0,4,8],T,{s:11}),b=N.seq("tb",236,28,["20 °C","50 °C","80 °C"],[0,4,8],T,{s:11});s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 s+=t_(145,14,"mesma massa m",{s:11});
 C("dens_temp","Animação: um líquido é aquecido e se dilata; como a massa continua a mesma e o volume aumenta, a massa específica diminui",H,s,tr,T,["Líquido a 20 °C: massa m e volume V","Aquecido, ele se dilata:|o volume aumenta e a massa não muda","μ = m / V:  V maior ⇒ μ menor.|A massa específica diminui"],[0,2.4,8])})();

/* faca_area */
(function(){var T=15,H=200,s='',tr=[];
 s+='<rect x="30" y="130" width="120" height="34" rx="4" fill="#d8b98a" fill-opacity=".8" stroke="currentColor" stroke-width="2"/><rect x="170" y="130" width="120" height="34" rx="4" fill="#d8b98a" fill-opacity=".8" stroke="currentColor" stroke-width="2"/>';
 s+='<g class="p1"><rect x="60" y="112" width="60" height="18" fill="#9aa6b8" stroke="currentColor" stroke-width="2"/></g><g class="p2"><path d="M220 100h20l-8 46h-4z" fill="#9aa6b8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g>';
 tr.push(N.tr(".p1",T,[[0,0,-40],[1.6,0,-40],[4,0,0]]),N.tr(".p2",T,[[0,0,-40],[1.6,0,-40],[4,0,0]]));
 s+='<g class="f1">'+arr(90,34,90,70,RED,"",4)+t_(112,56,"F",{s:14})+'</g><g class="f2">'+arr(230,34,230,70,RED,"",4)+t_(252,56,"F",{s:14})+'</g>';
 tr.push(N.tr(".f1",T,[[0,0,-40],[1.6,0,-40],[4,0,0]]),N.tr(".f2",T,[[0,0,-40],[1.6,0,-40],[4,0,0]]));
 s+=t_(90,182,"área grande",{s:12})+t_(230,182,"área pequena",{s:12});
 var a=N.seq("ta",90,198,["P = F / A","pressão baixa"],[0,6],T,{s:12}),b=N.seq("tb",230,198,["P = F / A","pressão alta"],[0,6],T,{s:12});s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 C("faca_area","Animação: a mesma força é aplicada por uma placa larga e por uma ponta fina sobre massa de modelar; a ponta fina, de área pequena, penetra muito mais porque exerce maior pressão",H+14,s,tr,T,["A mesma força F empurra duas peças:|uma de área grande e outra de área pequena","A de área pequena concentra a força e afunda mais no material","P = F / A: com F igual, quanto menor a área, maior a pressão (faca, prego)"],[0,2,5.4])})();

/* raquete */
(function(){var T=15,H=200,s='',tr=[];
 s+='<rect x="20" y="120" width="130" height="50" rx="4" fill="#e8f1fb" stroke="currentColor" stroke-width="2"/><rect x="170" y="120" width="130" height="50" rx="4" fill="#e8f1fb" stroke="currentColor" stroke-width="2"/>';
 function pes(x,w,cl){return'<g class="'+cl+'"><circle cx="'+x+'" cy="40" r="10" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M'+x+' 50V92M'+x+' 62L'+(x-12)+' 80M'+x+' 62L'+(x+12)+' 80M'+x+' 92L'+(x-8)+' 114M'+x+' 92L'+(x+8)+' 114" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><rect x="'+(x-8-w/2)+'" y="114" width="'+w+'" height="5" fill="'+RED+'"/><rect x="'+(x+8-w/2)+'" y="114" width="'+w+'" height="5" fill="'+RED+'"/></g>'}
 s+=pes(85,9,"a")+pes(235,36,"b");
 tr.push(N.tr(".a",T,[[0,0,-4],[1.4,0,-4],[5,0,22]]),N.tr(".b",T,[[0,0,-4],[1.4,0,-4],[5,0,3]]));
 s+=t_(85,186,"sem raquete: A pequena",{s:11})+t_(235,186,"com raquete: A grande",{s:11});
 var a=N.seq("ta",85,24,["P = F / A","pressão alta"],[0,5],T,{s:11}),b=N.seq("tb",235,24,["P = F / A","pressão baixa"],[0,5],T,{s:11});s+=a.s+b.s;tr=tr.concat(a.t,b.t);
 C("raquete","Animação: uma pessoa afunda na neve sem raquetes, pois a área dos pés é pequena; com raquetes de área grande a pressão cai e ela quase não afunda",H,s,tr,T,["O peso da pessoa é o mesmo nos dois casos","Pés pequenos: pressão alta, a pessoa afunda.|Raquetes: área grande, pressão baixa","Aumentando a área de apoio, a pressão diminui:|P = F / A"],[0,2,5.4])})();

/* pa_unid */
(function(){var T=15,H=200,s='',tr=[];
 s+=R(40,50,100,100,"var(--f-cinza)",.6)+N.dm(40,140,164,"","")+t_(26,104,"1 m",{s:11});
 s+='<g class="mc"><circle cx="90" cy="38" r="12" fill="'+RED+'" fill-opacity=".85" stroke="currentColor" stroke-width="2"/><path d="M90 26c0-6 5-8 8-8" fill="none" stroke="#2e9e5b" stroke-width="2"/></g>'+arr(90,56,90,96,RED,"fa",3);
 tr.push(N.tr(".mc",T,[[0,0,-30],[1.2,0,-30],[3,0,0]]),N.op(".mc",T,[[0,0],[1,0],[1.4,1],[T,1]]),N.op(".fa",T,[[0,0],[3,0],[3.6,1],[T,1]]));
 s+=t_(90,124,"1 N",{s:13,c:"fa2"});tr.push(fade(".fa2",T,3.6));
 s+='<g class="r1">'+t_(230,64,"P = F / A",{s:15})+t_(230,88,"P = 1 N / 1 m²",{s:13})+t_(230,112,"P = 1 Pa",{s:16,c:"fin"})+'</g>';tr.push(N.vis(".r1",T,5));
 s+='<g class="r2">'+t_(230,148,"1 atm ≈ 100 000 Pa",{s:12})+t_(230,166,"(1 Pa é bem pequeno)",{s:10})+'</g>';tr.push(N.vis(".r2",T,9));
 C("pa_unid","Animação: uma força de um newton distribuída sobre uma área de um metro quadrado produz a pressão de um pascal; a atmosfera equivale a cerca de cem mil pascals",H,s,tr,T,["Uma força de 1 N (peso de uma maçã pequena)|atua sobre 1 m²","Pressão = força ÷ área:|1 N / 1 m² = 1 N/m²","Essa unidade se chama pascal (Pa).|É pequena: a atmosfera vale cerca de 100 000 Pa"],[0,2.4,5.2])})();

/* pressao_dir */
(function(){var T=15,H=200,s='',tr=[],i;
 s+='<path d="M30 30V170H290V30" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="31" y="60" width="258" height="109" fill="'+W+'" fill-opacity=".4"/><circle cx="160" cy="116" r="22" fill="#dbeafe" stroke="currentColor" stroke-width="2"/>';
 for(i=0;i<8;i++){var a=i*PI/4,PI_=Math.PI;a=i*PI_/4;var x1=160+62*Math.cos(a),y1=116+62*Math.sin(a),x2=160+30*Math.cos(a),y2=116+30*Math.sin(a);s+=arr(x1,y1,x2,y2,RED,"d"+i,3);tr.push(fade(".d"+i,T,1.2+.5*i))}
 s+='<g class="fi">'+t_(160,196,"mesma pressão em todas as direções",{s:12,c:"fin"})+t_(160,50,"a força é sempre perpendicular à superfície",{s:11})+'</g>';tr.push(N.vis(".fi",T,6));
 C("pressao_dir","Animação: um corpo submerso recebe da água forças perpendiculares à sua superfície em todas as direções, todas com a mesma pressão; a pressão é uma grandeza escalar, sem direção própria",H,s,tr,T,["Um corpo mergulhado em um fluido em repouso","O fluido empurra a superfície em todos os pontos,|sempre perpendicularmente","A pressão é a mesma em todas as direções: é grandeza escalar|(a força é que é vetorial)"],[0,1.4,6])})();

/* atm_peso */
(function(){var T=16,H=200,s='',tr=[];
 s+='<rect x="60" y="20" width="70" height="26" fill="#9ec5ee" fill-opacity=".2"/><rect x="60" y="46" width="70" height="26" fill="#9ec5ee" fill-opacity=".35"/><rect x="60" y="72" width="70" height="26" fill="#9ec5ee" fill-opacity=".5"/><rect x="60" y="98" width="70" height="26" fill="#9ec5ee" fill-opacity=".65"/><rect x="60" y="124" width="70" height="26" fill="#9ec5ee" fill-opacity=".8"/><rect x="40" y="150" width="110" height="12" fill="#8b6b4a" stroke="currentColor" stroke-width="2"/>';
 s+=t_(95,12,"coluna de ar sobre 1 m²",{s:10})+t_(95,178,"1 m²",{s:11});
 s+='<g class="ar">'+arr(95,26,95,146,RED,"",4)+'</g>';tr.push(N.vis(".ar",T,2));
 var a=N.seq("ta",230,70,["peso do ar:","peso ≈ 10⁵ N"],[2,5],T,{s:13});s+=a.s;tr=tr.concat(a.t);
 s+='<g class="r1">'+t_(230,100,"P = F / A",{s:13})+t_(230,122,"P = 10⁵ N / 1 m²",{s:13})+t_(230,146,"P ≈ 1,0 × 10⁵ Pa",{s:15,c:"fin"})+t_(230,166,"= 1 atm",{s:12})+'</g>';tr.push(N.vis(".r1",T,6.4));
 C("atm_peso","Animação: o peso da coluna de ar sobre um metro quadrado ao nível do mar é de cerca de cem mil newtons, o que dá a pressão atmosférica de cerca de 1,0 por 10 elevado a 5 pascals",H,s,tr,T,["O ar tem peso: sobre cada m² há uma coluna de ar que vai até o limite da atmosfera","Esse peso é de cerca de 10⁵ N","P = F / A ≈ 1,0 × 10⁵ Pa ao nível do mar (1 atm)"],[0,2.2,6])})();

/* ouvido */
(function(){var T=17,H=200,s='',tr=[];
 s+='<path d="M10 150L110 70L110 150z" fill="#8b6b4a" fill-opacity=".5" stroke="currentColor" stroke-width="2"/><g class="car"><rect x="8" y="132" width="26" height="10" rx="3" fill="'+RED+'" stroke="currentColor" stroke-width="1.8" transform="rotate(-38 21 137)"/></g>';
 tr.push(N.tr(".car",T,[[0,0,0],[1,0,0],[6,76,-62]]));
 s+=t_(60,172,"subindo a serra",{s:11})+t_(60,184,"P externa diminui",{s:10});
 s+='<line x1="220" y1="50" x2="220" y2="150" stroke="currentColor" stroke-width="4"/>'+t_(180,40,"fora",{s:11})+t_(262,40,"orelha média",{s:11})+arr(158,100,206,100,"#2c7fb8","o1",2.5)+arr(282,100,234,100,RED,"i1",5);
 s+='<g class="bg"><path d="M220 62C190 84 190 116 220 138" fill="none" stroke="currentColor" stroke-width="3"/></g>';tr.push(N.op(".bg",T,[[0,0],[2,0],[4,1],[8.4,1],[8.8,0],[T,0]]),N.op(".o1",T,[[0,1],[2,1],[2.4,.3],[T,.3]]),N.op(".i1",T,[[0,1],[8.4,1],[8.8,.2],[T,.2]]));
 s+='<g class="tb"><path d="M262 150C262 170 232 176 206 176" fill="none" stroke="#2e9e5b" stroke-width="4"/></g>'+t_(262,192,"tuba auditiva",{s:10});tr.push(fade(".tb",T,8.4));
 s+='<g class="es">'+t_(160,16,"estalo: pressões se igualam",{s:11,c:"fin"})+'</g>';tr.push(N.vis(".es",T,9));
 C("ouvido","Animação: ao subir uma serra a pressão do ar externo diminui e o tímpano é empurrado para fora pelo ar da orelha média; quando a tuba auditiva se abre, as pressões se igualam e ocorre o estalo",H,s,tr,T,["O carro sobe: a pressão atmosférica externa diminui","O ar da orelha média, a pressão maior,|empurra o tímpano para fora","A tuba auditiva abre e as pressões se igualam:|ouvimos o estalo"],[0,2.4,8.4])})();

/* traje */
(function(){var T=15,H=200,s='',tr=[],i;
 for(i=0;i<9;i++)s+='<circle cx="'+(20+i*37)+'" cy="'+(14+(i*13)%34)+'" r="1.4" fill="currentColor" fill-opacity=".5"/>';
 s+='<g class="u1" style="transform-box:fill-box;transform-origin:50% 50%"><ellipse cx="85" cy="104" rx="30" ry="46" fill="#f3c9a6" stroke="currentColor" stroke-width="2.4"/></g>'+t_(85,170,"sem traje",{s:12})+arr(55,60,38,48,RED,"x1",3)+arr(115,60,132,48,RED,"x2",3)+arr(55,150,38,162,RED,"x3",3)+arr(115,150,132,162,RED,"x4",3);
 tr.push(N.sc(".u1",T,[[0,1,1],[2,1,1],[9,1.28,1.28]]),fade(".x1",T,2),fade(".x2",T,2),fade(".x3",T,2),fade(".x4",T,2));
 s+='<g class="u2"><circle cx="235" cy="56" r="18" fill="#cfe7fb" fill-opacity=".6" stroke="currentColor" stroke-width="3"/><rect x="209" y="72" width="52" height="86" rx="18" fill="#eef1f6" stroke="currentColor" stroke-width="3"/></g>'+t_(235,176,"com traje pressurizado",{s:11});
 s+=t_(160,16,"fora: quase sem pressão",{s:11});
 C("traje","Animação: no espaço quase não há pressão externa; sem traje o corpo se expandiria pela pressão interna, e o traje pressurizado mantém a pressão em torno de um atmosfera sobre o astronauta",H+8,s,tr,T,["No espaço não há pressão atmosférica externa","Sem traje, a pressão interna do corpo não é equilibrada e ele se expandiria","O traje pressurizado mantém uma pressão externa adequada ao corpo"],[0,2,6])})();

/* ebulicao_p */
(function(){var T=16,H=206,s='',tr=[];
 [[54,"montanha",.72,"90 °C","0,7 atm"],[160,"nível do mar",.8,"100 °C","1 atm"],[266,"panela de pressão",.95,"120 °C","2 atm"]].forEach(function(p,k){var x=p[0];
  s+=R(x-30,90,60,50,W,.45,"")+'<line x1="'+(x-34)+'" y1="90" x2="'+(x+34)+'" y2="90" stroke="currentColor" stroke-width="2"/>'+t_(x,160,p[1],{s:11})+t_(x,174,p[4],{s:11});
  s+=N.th(x,24,56,"m"+k,p[2]);tr.push(N.sc(".m"+k,T,[[0,1,.3],[1.6,1,.3],[6+1.6*k,1,p[2]]]));
  var q=N.seq("t"+k,x,16,["20 °C",p[3]],[0,5+1.6*k],T,{s:11});s+=q.s;tr=tr.concat(q.t);
  s+='<circle class="bb'+k+'" cx="'+x+'" cy="128" r="4" fill="none" stroke="currentColor"/><circle class="bc'+k+'" cx="'+(x+14)+'" cy="132" r="3" fill="none" stroke="currentColor"/>';
  tr.push(N.tr(".bb"+k,T,[[0,0,0],[5+1.6*k,0,0],[6.4+1.6*k,0,-30]]),N.op(".bb"+k,T,[[0,0],[5+1.6*k,0],[5.2+1.6*k,1],[T,1]]),N.tr(".bc"+k,T,[[0,0,0],[5.4+1.6*k,0,0],[6.8+1.6*k,0,-26]]),N.op(".bc"+k,T,[[0,0],[5.4+1.6*k,0],[5.6+1.6*k,1],[T,1]]))});
 C("ebulicao_p","Animação: a água ferve a cerca de 90 graus na montanha, 100 graus ao nível do mar e 120 graus na panela de pressão; quanto maior a pressão sobre a água, maior a temperatura de ebulição",H,s,tr,T,["Na montanha a pressão é menor:|a água ferve abaixo de 100 °C","Ao nível do mar (1 atm) ela ferve a 100 °C","Na panela de pressão a pressão é maior,|a água ferve acima de 100 °C e o alimento cozinha mais rápido"],[0,5.4,7])})();

/* barometro */
(function(){var T=18,H=200,s='',tr=[];
 s+='<path d="M60 170V190H260V170" fill="none" stroke="currentColor" stroke-width="2"/><rect x="61" y="176" width="198" height="12" fill="#9aa6b8" fill-opacity=".7"/>';
 s+='<rect x="150" y="30" width="20" height="150" fill="var(--f-vidro)" fill-opacity=".5" stroke="currentColor" stroke-width="2"/><rect class="co" x="152" y="30" width="16" height="150" fill="#9aa6b8" style="transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(.78)"/>';
 tr.push(N.sc(".co",T,[[0,1,.82],[2,1,.82],[5,1,1],[9,1,1],[13,1,.7]]));
 s+='<g class="ba" style="transform-box:fill-box;transform-origin:50% 100%">'+arr(100,136,100,172,RED,"",5)+arr(220,136,220,172,RED,"",5)+'</g>';tr.push(N.sc(".ba",T,[[0,1,1.3],[4,1,1.3],[9,1,.5]]));
 var a=N.seq("ta",100,30,["760 mmHg","720 mmHg"],[0,0],T,{s:12});
 var q=N.seq("tq",250,70,["P normal","tempo bom: P alta","altitude: P baixa"],[0,4,10],T,{s:11,a:"middle"});s+=q.s;tr=tr.concat(q.t);
 C("barometro","Animação: o barômetro de mercúrio mede a pressão atmosférica pela altura da coluna; com pressão maior a coluna sobe e com pressão menor ela desce",H,s,tr,T,["Barômetro de mercúrio:|a coluna equilibra a pressão atmosférica","Pressão maior: a coluna sobe","Pressão menor (altitude, tempestade): a coluna desce"],[0,4,10])})();

/* torr_exp */
(function(){var T=16,H=200,s='',tr=[];
 s+='<path d="M60 166V190H260V166" fill="none" stroke="currentColor" stroke-width="2"/><rect x="61" y="172" width="198" height="17" fill="#9aa6b8" fill-opacity=".8"/>';
 s+='<rect x="150" y="8" width="20" height="170" fill="var(--f-vidro)" fill-opacity=".5" stroke="currentColor" stroke-width="2"/><rect class="co" x="152" y="10" width="16" height="168" fill="#9aa6b8" style="transform-box:fill-box;transform-origin:50% 100%"/>';
 tr.push(N.sc(".co",T,[[0,1,1],[3,1,1],[8,1,.55]]));
 s+='<g class="vc">'+t_(214,26,"vácuo",{s:12})+'<line x1="172" y1="22" x2="196" y2="22" stroke="currentColor" stroke-width="1.5"/></g>';tr.push(N.vis(".vc",T,7));
 s+='<g class="m76">'+'<path d="M134 86V178M130 94L134 86L138 94M130 170L134 178L138 170" fill="none" stroke="currentColor" stroke-width="1.6"/>'+t_(110,134,"76 cm",{s:13,c:"fin"})+'</g>';tr.push(N.vis(".m76",T,8.4));
 s+='<g class="pa">'+arr(90,150,90,166,RED,"",4)+arr(230,150,230,166,RED,"",4)+t_(262,148,"P atm",{s:11})+'</g>';tr.push(N.vis(".pa",T,5));
 C("torr_exp","Animação: um tubo cheio de mercúrio é emborcado em uma cuba; a coluna desce até 76 cm ao nível do mar, deixando vácuo no topo, pois a pressão atmosférica sustenta a coluna",H,s,tr,T,["Tubo de vidro cheio de mercúrio, emborcado em uma cuba com mercúrio","A coluna desce e para: surge vácuo no topo.|A pressão atmosférica sobre a cuba sustenta a coluna","Ao nível do mar, a coluna fica com 76 cm de altura"],[0,3.4,8])})();

/* torr_76 */
(function(){var T=16,H=200,s='',tr=[];
 s+='<path d="M50 160V190H200V160" fill="none" stroke="currentColor" stroke-width="2"/><rect x="51" y="166" width="148" height="23" fill="#9aa6b8" fill-opacity=".8"/><rect x="110" y="20" width="20" height="150" fill="var(--f-vidro)" fill-opacity=".5" stroke="currentColor" stroke-width="2"/><rect x="112" y="64" width="16" height="106" fill="#9aa6b8"/>'+t_(120,14,"vácuo",{s:10});
 s+='<g class="pa">'+arr(70,128,70,160,RED,"",5)+arr(180,128,180,160,RED,"",5)+t_(125,128,"",{s:1})+'</g>';tr.push(N.vis(".pa",T,1));
 s+='<g class="pc">'+arr(120,140,120,172,"#2e9e5b","",5)+'</g>';tr.push(N.vis(".pc",T,3.4));
 s+='<g class="e1">'+t_(250,70,"P atm = P coluna",{s:11})+'</g><g class="e2">'+t_(250,98,"76 cmHg = 760 mmHg",{s:11})+'</g><g class="e3">'+t_(250,126,"= 1 atm",{s:13})+t_(250,146,"≈ 1,0 × 10⁵ Pa",{s:13,c:"fin"})+'</g>';
 tr.push(N.vis(".e1",T,3.4),N.vis(".e2",T,6.6),N.vis(".e3",T,9.6));
 C("torr_76","Animação: a pressão da coluna de 76 centímetros de mercúrio equilibra a pressão atmosférica, por isso um atmosfera vale 760 milímetros de mercúrio, ou cerca de 1,0 por 10 elevado a 5 pascals",H,s,tr,T,["A pressão atmosférica empurra o mercúrio da cuba para cima no tubo","A coluna pára quando seu peso equilibra a pressão:|P atm = P coluna","1 atm = 76 cmHg = 760 mmHg ≈ 1,0 × 10⁵ Pa"],[0,3.4,7])})();

/* torr_agua */
(function(){var T=16,H=200,s='',tr=[];
 s+='<path d="M20 170V190H100V170" fill="none" stroke="currentColor" stroke-width="2"/><rect x="21" y="176" width="78" height="13" fill="#9aa6b8" fill-opacity=".8"/><rect x="50" y="76" width="16" height="104" fill="var(--f-vidro)" fill-opacity=".5" stroke="currentColor" stroke-width="2"/><rect class="h1" x="52" y="130" width="12" height="50" fill="#9aa6b8" style="transform-box:fill-box;transform-origin:50% 100%"/>'+t_(58,66,"mercúrio",{s:11})+t_(58,52,"76 cm",{s:13,c:"fin"});
 s+='<path d="M170 170V190H300V170" fill="none" stroke="currentColor" stroke-width="2"/><rect x="171" y="176" width="128" height="13" fill="'+W+'" fill-opacity=".55"/><rect x="226" y="8" width="16" height="172" fill="var(--f-vidro)" fill-opacity=".5" stroke="currentColor" stroke-width="2"/><rect class="h2" x="228" y="10" width="12" height="170" fill="'+W+'" fill-opacity=".7" style="transform-box:fill-box;transform-origin:50% 100%"/>'+t_(234,200,"água",{s:11});
 s+='<g class="br"><path d="M218 78l16 -7M218 90l16 -7" stroke="currentColor" stroke-width="2.5"/></g>'+t_(274,60,"≈ 10 m",{s:14,c:"fin"})+t_(274,80,"13,6× mais alta",{s:10});
 tr.push(N.sc(".h1",T,[[0,1,.5],[2,1,.5],[6,1,1]]),N.sc(".h2",T,[[0,1,.15],[2,1,.15],[10,1,1]]));
 C("torr_agua","Animação: o mesmo experimento feito com mercúrio dá uma coluna de 76 centímetros, mas com água, que é cerca de 13,6 vezes menos densa, a coluna chegaria a cerca de 10 metros",H+10,s,tr,T,["Pela mesma pressão atmosférica, o mercúrio sobe até 76 cm","A água é 13,6 vezes menos densa: precisa de coluna 13,6 vezes maior","A coluna de água teria cerca de 10 m, inviável para um instrumento: por isso se usa mercúrio"],[0,2,7])})();

/* barco_eq */
(function(){var T=15,H=200,s='',tr=[];
 s+=glass(20,70,280,100)+wat(20,100,280,68,"",W,.45);
 s+='<g class="bo"><path d="M110 84h100l-14 34h-72z" fill="#c8a36b" stroke="currentColor" stroke-width="2.4"/><path d="M160 84V50l26 12" fill="none" stroke="currentColor" stroke-width="2.4"/></g>';tr.push(N.tr(".bo",T,[[0,0,-30],[1.2,0,-30],[4,0,8],[5,0,0]]));
 s+='<g class="e">'+arr(160,86,160,36,"#2e9e5b","",5)+t_(184,40,"E",{s:15})+'</g><g class="p">'+arr(160,100,160,150,RED,"",5)+t_(184,144,"P",{s:15})+'</g>';tr.push(fade(".e",T,5.2),fade(".p",T,5.2));
 s+='<g class="fi">'+t_(160,192,"E = P: empuxo igual ao peso, equilíbrio",{s:12,c:"fin"})+'</g>';tr.push(N.vis(".fi",T,8));
 C("barco_eq","Animação: um barco flutua em equilíbrio; o empuxo vertical para cima tem o mesmo valor do peso e as duas forças se anulam",H+8,s,tr,T,["O barco é colocado na água e afunda um pouco","Duas forças agem nele: o peso P para baixo e o empuxo E para cima","Em equilíbrio, E = P: o barco fica parado, parcialmente imerso"],[0,3,5.6])})();

/* piscina */
(function(){var T=16,H=200,s='',tr=[];
 s+=glass(120,70,180,100)+wat(120,100,180,68,"",W,.45);
 s+='<g class="pe"><circle cx="210" cy="58" r="10" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M210 68V116M210 80L196 98M210 80L224 98M210 116L202 148M210 116L218 148" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></g>';
 tr.push(N.tr(".pe",T,[[0,0,-34],[1.4,0,-34],[5,0,30]]));
 s+='<g class="pw">'+arr(60,40,60,130,RED,"",5)+t_(60,30,"peso",{s:11})+t_(60,148,"700 N",{s:12})+'</g>';
 s+='<g class="ee">'+arr(88,130,88,66,"#2e9e5b","",5)+'</g>';
 tr.push(N.vis(".ee",T,5));
 var a=N.seq("ta",66,170,["sem água: 700 N","na água: sente 200 N"],[0,5.2],T,{s:10});s+=a.s;tr=tr.concat(a.t);
 s+='<g class="e1">'+t_(60,100,"",{s:1})+t_(250,34,"E = 500 N para cima",{s:11})+'</g>';tr.push(N.vis(".e1",T,5.4));
 C("piscina","Animação: ao entrar na piscina a pessoa recebe da água uma força de empuxo para cima que compensa parte do peso, e por isso se sente mais leve",H+4,s,tr,T,["Fora da água, só o peso age: 700 N","Dentro da água surge o empuxo para cima","O empuxo compensa parte do peso:|sensação de ficar mais leve"],[0,1.8,5.2])})();

/* mar_morto */
(function(){var T=16,H=200,s='',tr=[];
 s+=glass(30,60,110,110)+wat(30,84,110,84,"",W,.4)+glass(180,60,110,110)+wat(180,84,110,84,"",AMB,.35);
 s+='<g class="o1"><ellipse cx="85" cy="40" rx="11" ry="14" fill="#f3e9d2" stroke="currentColor" stroke-width="2"/></g><g class="o2"><ellipse cx="235" cy="40" rx="11" ry="14" fill="#f3e9d2" stroke="currentColor" stroke-width="2"/></g>';
 tr.push(N.tr(".o1",T,[[0,0,0],[1.4,0,0],[4,0,108]]),N.tr(".o2",T,[[0,0,0],[1.4,0,0],[4,0,52],[5.4,0,44]]));
 s+=t_(85,186,"água doce",{s:12})+t_(85,200,"1,0 g/cm³",{s:10})+t_(235,186,"água muito salgada",{s:12})+t_(235,200,"≈ 1,2 g/cm³",{s:10});
 var a=N.seq("ta",85,50,["",""],[0,0],T,{s:1});
 s+='<g class="r1">'+t_(85,52,"afunda",{s:12})+'</g><g class="r2">'+t_(235,52,"boia",{s:12})+'</g>';tr.push(N.vis(".r1",T,4),N.vis(".r2",T,4));
 C("mar_morto","Animação: um ovo afunda na água doce, mas boia na água muito salgada, de massa específica maior; no Mar Morto é fácil boiar porque a água é muito densa",H+6,s,tr,T,["Mesmo ovo, dois líquidos de massa específica diferente","Na água doce (menos densa) ele afunda","Na água muito salgada (mais densa) o empuxo é maior: ele boia.|Assim é no Mar Morto"],[0,1.4,4.2])})();

/* balao_ar */
(function(){var T=15,H=200,s='',tr=[];
 s+='<path d="M0 176H320" stroke="currentColor" stroke-width="2"/>';
 s+='<g class="bl"><ellipse cx="160" cy="112" rx="34" ry="42" fill="#fca5a5" fill-opacity=".85" stroke="currentColor" stroke-width="2.4"/><path d="M160 154v14" stroke="currentColor" stroke-width="2"/><rect x="152" y="168" width="16" height="10" fill="#8b6b4a" stroke="currentColor"/>'+t_(160,116,"gás leve",{s:10})+arr(160,106,160,56,"#2e9e5b","",5)+arr(160,150,160,176,RED,"",3)+t_(184,64,"E",{s:15})+t_(184,176,"P",{s:13})+'</g>';
 tr.push(N.tr(".bl",T,[[0,0,0],[2.6,0,0],[8,0,-50]]));
 s+='<g class="fi">'+t_(250,100,"E > P",{s:16,c:"fin"})+t_(250,120,"sobe",{s:12})+'</g>';tr.push(N.vis(".fi",T,3));
 s+=t_(60,188,"ar também exerce empuxo",{s:11});
 C("balao_ar","Animação: um balão cheio de gás leve, mergulhado no ar, sofre empuxo maior que o peso e sobe; o empuxo também atua em gases",H,s,tr,T,["Um balão com gás leve está mergulhado no ar","O ar (um fluido) exerce empuxo para cima:|E = μ do ar · V · g","Empuxo maior que o peso: o balão sobe.|O empuxo também atua em gases"],[0,2,4.4])})();

/* pascal_pt */
(function(){var T=16,H=200,s='',tr=[];
 s+='<rect x="70" y="60" width="180" height="104" fill="'+W+'" fill-opacity=".4" stroke="currentColor" stroke-width="2.4"/>';
 s+='<g class="pi"><rect x="74" y="50" width="172" height="12" fill="#9aa6b8" stroke="currentColor" stroke-width="2"/>'+arr(160,10,160,48,RED,"",5)+t_(184,30,"F",{s:14})+'</g>';tr.push(N.tr(".pi",T,[[0,0,0],[1.6,0,0],[4,0,10]]));
 [[100,90],[220,90],[100,142],[220,142],[160,116]].forEach(function(p,k){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="currentColor"/><g class="q'+k+'">'+arr(p[0]-4,p[1],p[0]-24,p[1],"#2e9e5b","",3)+arr(p[0]+4,p[1],p[0]+24,p[1],"#2e9e5b","",3)+arr(p[0],p[1]-4,p[0],p[1]-22,"#2e9e5b","",3)+arr(p[0],p[1]+4,p[0],p[1]+22,"#2e9e5b","",3)+'</g>';tr.push(fade(".q"+k,T,4.2+.3*k))});
 s+='<g class="fi">'+t_(160,186,"o acréscimo ΔP chega igual a todos os pontos",{s:11,c:"fin"})+'</g>';tr.push(N.vis(".fi",T,7));
 C("pascal_pt","Animação: ao empurrar o êmbolo de um recipiente fechado com líquido, o acréscimo de pressão é transmitido integralmente e com o mesmo valor a todos os pontos do líquido",H+6,s,tr,T,["Líquido em equilíbrio em um recipiente fechado","Uma força empurra o êmbolo e aumenta a pressão em ΔP","Princípio de Pascal: o acréscimo ΔP se transmite integralmente a todos os pontos"],[0,1.8,4.6])})();

/* freio */
(function(){var T=16,H=200,s='',tr=[];
 s+='<rect x="20" y="80" width="60" height="22" fill="'+W+'" fill-opacity=".5" stroke="currentColor" stroke-width="2"/><g class="p1"><rect x="20" y="82" width="10" height="18" fill="#9aa6b8" stroke="currentColor"/><path d="M8 91H20" stroke="currentColor" stroke-width="4"/></g>'+arr(14,62,22,80,RED,"f1",3)+t_(60,50,"pedal: F pequena",{s:10});
 s+='<path d="M80 91H200M200 91V122" fill="none" stroke="'+W+'" stroke-width="6"/>';
 s+='<rect x="190" y="120" width="52" height="54" fill="'+W+'" fill-opacity=".5" stroke="currentColor" stroke-width="2"/>';
 s+='<g class="p2"><rect x="224" y="132" width="16" height="30" fill="#9aa6b8" stroke="currentColor"/></g>';
 s+='<g class="dk" style="transform-box:fill-box;transform-origin:50% 50%"><circle cx="278" cy="147" r="30" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="278" cy="147" r="5" fill="currentColor"/></g>';
 tr.push(N.tr(".p1",T,[[0,0,0],[1.6,0,0],[4,14,0]]),N.tr(".p2",T,[[0,0,0],[1.6,0,0],[4,5,0]]),N.rot(".dk",T,[[0,0],[1.6,500],[6,560]]));
 s+='<g class="fb">'+arr(300,100,258,128,RED,"",1)+'</g>';
 s+='<g class="fz">'+t_(130,150,"mesma pressão",{s:11})+t_(130,166,"nos dois êmbolos",{s:11})+'</g>';tr.push(N.vis(".fz",T,3.2));
 s+='<g class="ff">'+t_(160,196,"F₂ = F₁ · A₂ / A₁: a força é multiplicada",{s:11,c:"fin"})+'</g>';tr.push(N.vis(".ff",T,6.8));
 C("freio","Animação: no freio hidráulico, a pressão aplicada pelo pedal no êmbolo pequeno se transmite pelo líquido até o êmbolo maior, que pressiona a pastilha contra o disco com força multiplicada",H+4,s,tr,T,["O pé empurra o êmbolo pequeno com pouca força","A pressão se transmite pelo líquido (princípio de Pascal) até o êmbolo grande","O êmbolo maior, de área maior, recebe força maior e a pastilha freia o disco"],[0,2,5.6])})();

/* liq_gas */
(function(){var T=16,H=206,s='',tr=[],i;
 function row(y,fillCl,op,cl){return'<rect x="20" y="'+y+'" width="60" height="20" fill="'+fillCl+'" fill-opacity="'+op+'" stroke="currentColor" stroke-width="2"/><rect x="80" y="'+(y+6)+'" width="110" height="8" fill="'+fillCl+'" fill-opacity="'+op+'" stroke="currentColor"/><rect x="190" y="'+y+'" width="60" height="20" fill="'+fillCl+'" fill-opacity="'+op+'" stroke="currentColor" stroke-width="2"/><g class="'+cl+'a"><rect x="20" y="'+(y+1)+'" width="8" height="18" fill="#9aa6b8" stroke="currentColor"/></g><g class="'+cl+'b"><rect x="224" y="'+(y+1)+'" width="8" height="18" fill="#9aa6b8" stroke="currentColor"/></g>'}
 s+=row(44,W,.5,"l")+row(124,"#d8e4f2",.45,"g");
 for(i=0;i<10;i++)s+='<circle cx="'+(34+(i%5)*10)+'" cy="'+(130+Math.floor(i/5)*8)+'" r="1.3" fill="currentColor"/>';
 tr.push(N.tr(".la",T,[[0,0,0],[1.6,0,0],[3.4,14,0]]),N.tr(".lb",T,[[0,0,0],[1.6,0,0],[3.4,14,0]]),N.tr(".ga",T,[[0,0,0],[1.6,0,0],[3.4,14,0]]),N.tr(".gb",T,[[0,0,0],[1.6,0,0],[3.4,3,0]]));
 s+=t_(135,34,"líquido (incompressível)",{s:11})+t_(135,114,"gás (compressível)",{s:11});
 s+='<g class="r1">'+t_(135,76,"o êmbolo da direita se move igual",{s:11})+'</g><g class="r2">'+t_(135,156,"o gás é comprimido: quase não transmite",{s:11})+'</g>';tr.push(N.vis(".r1",T,3.6),N.vis(".r2",T,3.6));
 s+=t_(160,190,"líquidos transmitem a força; gases se comprimem",{s:11,c:"fin"});
 C("liq_gas","Animação: ao empurrar um êmbolo, o líquido transmite o movimento e a força ao outro êmbolo, mas o gás se comprime e transmite pouco; por isso as prensas hidráulicas usam líquidos",H,s,tr,T,["Dois sistemas: um com líquido e outro com gás","Com líquido, o outro êmbolo se move junto;|com gás, ele se comprime primeiro","Líquidos são praticamente incompressíveis,|e por isso transmitem bem a pressão"],[0,2,3.8])})();

/* ================= resoluções de cálculo ================= */
function CALC(key,alt,H,vis,tr,st,lines,ly){
 var T=st[st.length-1][0]+4,c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H),g='';
 lines.forEach(function(L,k){var last=k==lines.length-1;g+='<g class="s'+(k+2)+'">'+t_(160,ly+18*k,L,{s:last?15:12,c:last?"fin":""})+'</g>';tr.push(N.vis(".s"+(k+2),T,st[k+1][0]))});
 N.reg(key,{a:alt,h:H,s:vis+g+c.s,t:tr.concat(c.t),T:T})}
function dens(key,alt,topTxt,botTxt,qLab,res,form,lines){
 var T=17,s='',tr=[];
 s+=R(40,52,80,80,"#9aa6b8",.75,"bk","transform-box:fill-box;transform-origin:50% 50%")+t_(80,98,"bloco",{s:12});tr.push(N.sc(".bk",T,[[0,.3,.3],[1.2,.3,.3],[2.6,1,1]]));
 s+=t_(80,40,topTxt,{s:13})+t_(80,152,botTxt,{s:13});
 s+='<g class="rg">'+arr(140,92,200,92,AMB,"",3)+'</g>';tr.push(N.vis(".rg",T,5));
 var a=N.seq("ta",250,96,[qLab+" = ?",qLab+" = "+res],[0,9.6],T,{s:14});s+=a.s;tr=tr.concat(a.t);
 CALC(key,alt,232,s,tr,[[0,"Dados: "+topTxt+" e "+botTxt],[3.2,form],[6.4,"Substituímos os valores"],[9.8,"Resultado: "+res]],lines,176)}
dens("calc_f010","Resolução animada: bloco de 500 gramas com volume de 250 centímetros cúbicos tem massa específica de 2 g/cm³","m = 500 g","V = 250 cm³","μ",
 "2 g/cm³","Massa específica:|μ = m / V",["μ = 500 / 250","μ = 2 g/cm³"]);
dens("calc_f089","Resolução animada: bloco de 600 gramas com volume de 200 centímetros cúbicos tem densidade de 3 g/cm³","m = 600 g","V = 200 cm³","d",
 "3 g/cm³","Densidade:|d = m / V",["d = 600 / 200","d = 3 g/cm³"]);
dens("calc_f075","Resolução animada: cubo de aresta 10 centímetros e massa 2,7 quilogramas tem massa específica de 2,7 g/cm³","aresta 10 cm","m = 2,7 kg = 2700 g","μ",
 "2,7 g/cm³","Volume do cubo: V = a³ = 1000 cm³|e depois μ = m / V",["μ = 2700 / 10³","μ = 2,7 g/cm³"]);
dens("calc_f091","Resolução animada: cubo de aresta 10 centímetros e massa 2 quilogramas tem densidade de 2000 kg/m³","aresta 0,1 m","m = 2 kg","d",
 "2000 kg/m³","Volume: V = a³ = (0,1)³ = 10⁻³ m³|e d = m / V",["d = 2 / 10⁻³","d = 2000 kg/m³"]);
dens("calc_f011","Resolução animada: dois metros cúbicos de água, com massa específica de 1000 kg/m³, têm massa de 2000 kg","V = 2 m³","μ = 1000 kg/m³","m",
 "2000 kg","Massa:|m = μ · V",["m = 1000 · 2","m = 2000 kg"]);

function pf(key,alt,F,A,P){
 var T=17,s='',tr=[],w=Math.max(46,Math.min(110,60*Math.sqrt(parseFloat(String(A).replace(",","."))/.5)));
 s+='<rect x="'+(100-w/2)+'" y="120" width="'+w+'" height="18" fill="#9aa6b8" stroke="currentColor" stroke-width="2"/>'+t_(100,156,"A = "+A+" m²",{s:12});
 s+='<g class="fa">'+arr(100,40,100,114,RED,"",5)+t_(130,70,"F = "+F+" N",{s:13})+'</g>';tr.push(N.tr(".fa",T,[[0,0,-30],[1.6,0,-30],[3.4,0,0]]),N.op(".fa",T,[[0,0],[1,0],[1.6,1],[T,1]]));
 var a=N.seq("ta",250,100,["P = ?","P = "+P],[0,9.6],T,{s:15});s+=a.s;tr=tr.concat(a.t);
 CALC(key,alt,232,s,tr,[[0,"Dados: F = "+F+" N perpendicular, A = "+A+" m²"],[3.2,"Pressão:|P = F / A"],[6.4,"Substituímos os valores"],[9.8,"Resultado: "+P]],["P = "+F+" / "+A,"P = "+P],176)}
pf("calc_f020","Resolução animada: força de 200 newtons sobre 0,5 metro quadrado produz pressão de 400 pascals",200,"0,5","400 Pa");
pf("calc_f021","Resolução animada: caixa de peso 60 newtons apoiada em 0,3 metro quadrado exerce pressão de 200 pascals",60,"0,3","200 Pa");
pf("calc_f092","Resolução animada: força de 300 newtons sobre 0,6 metro quadrado produz pressão de 500 pascals",300,"0,6","500 Pa");

function rgh(key,alt){
 var T=17,s='',tr=[];
 s+='<path d="M30 30V170H170V30" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="31" y="50" width="138" height="119" fill="'+W+'" fill-opacity=".4"/><line x1="30" y1="50" x2="170" y2="50" stroke="currentColor" stroke-dasharray="4 3"/>';
 s+='<g class="sn"><circle cx="100" cy="0" r="7" fill="'+RED+'" stroke="currentColor" stroke-width="2"/></g>';tr.push(N.tr(".sn",T,[[0,0,56],[1.4,0,56],[4,0,150]]));
 s+='<g class="hh">'+'<path d="M196 50V169M192 58L196 50L200 58M192 161L196 169L200 161" fill="none" stroke="currentColor" stroke-width="1.6"/>'+t_(228,112,"h = 5 m",{s:13,c:"fin"})+'</g>';tr.push(N.vis(".hh",T,3.4));
 s+=t_(100,24,"ρ = 1000 kg/m³;  g = 10 m/s²",{s:10});
 var a=N.seq("ta",250,150,["P = ?","P = 5 × 10⁴ Pa"],[0,9.6],T,{s:13});s+=a.s;tr=tr.concat(a.t);
 CALC(key,alt,236,s,tr,[[0,"Coluna de água de 5 m:|ρ = 1000 kg/m³, g = 10 m/s²"],[3.2,"Pressão da coluna de líquido:|P = ρ · g · h"],[6.4,"Substituímos os valores"],[9.8,"Resultado: 5 × 10⁴ Pa"]],["P = 1000 · 10 · 5","P = 5 × 10⁴ Pa"],180)}
rgh("calc_f022","Resolução animada: a pressão exercida por uma coluna de água de 5 metros é 1000 vezes 10 vezes 5, igual a 5 por 10 elevado a 4 pascals");
rgh("calc_f094","Resolução animada: a pressão da coluna de água a 5 metros de profundidade é 5 por 10 elevado a 4 pascals");

(function(){var T=17,s='',tr=[];
 s+='<rect x="130" y="22" width="20" height="140" fill="var(--f-vidro)" fill-opacity=".5" stroke="currentColor" stroke-width="2"/><rect class="co" x="132" y="24" width="16" height="136" fill="#9aa6b8" style="transform-box:fill-box;transform-origin:50% 100%"/>';tr.push(N.sc(".co",T,[[0,1,1],[2,1,1],[6,1,.5]]));
 s+='<line x1="150" y1="22" x2="176" y2="22" stroke="currentColor" stroke-dasharray="3 2"/>'+t_(232,26,"760 mmHg = 1 atm",{s:11});
 s+=t_(66,92,"380 mmHg",{s:12,c:"fin"})+'<line x1="108" y1="92" x2="128" y2="92" stroke="currentColor" stroke-width="1.5"/>';
 var a=N.seq("ta",250,110,["P = ?","P = 0,5 atm"],[0,9.6],T,{s:14});s+=a.s;tr=tr.concat(a.t);
 CALC("calc_f086","Resolução animada: 380 mmHg, metade de 760 mmHg, correspondem a 0,5 atmosfera",232,s,tr,[[0,"Pressão dada: 380 mmHg"],[3.2,"Relação: 1 atm = 760 mmHg"],[6.4,"Regra de três"],[9.8,"Resultado: 0,5 atm"]],["P = 380 / 760","P = 0,5 atm"],176)})();
})();
