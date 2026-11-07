/* Animações de Mecânica dos Fluidos (prioridade alta). */
(function(){"use strict";
var N=window.AN,PI=Math.PI,cos=Math.cos;

/* ---------- Torricelli ---------- */
var PX=170,PY=150,LF=120,H0=91.9; /* 76 cm = 91,9 px (1,21 px/cm) */
function basin(x0,x1){return'<path d="M'+x0+' 140V172H'+x1+'V140" fill="none" stroke="currentColor" stroke-width="2"/><rect class="an-hg" x="'+(x0+1)+'" y="150" width="'+(x1-x0-2)+'" height="21"/>'}
function tubo(w,sty,colSty,extra){var x=PX-w/2;return'<g class="tb" style="'+sty+'"><rect x="'+x+'" y="10" width="'+w+'" height="140" fill="var(--f-vidro)" fill-opacity=".5" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"/><rect class="col an-hg" x="'+(x+2)+'" y="'+(PY-LF)+'" width="'+(w-4)+'" height="'+LF+'" style="transform-box:fill-box;transform-origin:50% 100%;'+(colSty||"")+'"/>'+(extra||"")+'</g>'}
function medida(yTop,lab,cls,x){x=x||72;return'<g class="'+(cls||"ms")+'"><line x1="'+x+'" y1="'+yTop+'" x2="'+x+'" y2="'+PY+'" stroke="currentColor" stroke-width="1.5"/><path d="M'+(x-4)+' '+(yTop+7)+'L'+x+' '+yTop+'L'+(x+4)+' '+(yTop+7)+'M'+(x-4)+' '+(PY-7)+'L'+x+' '+PY+'L'+(x+4)+' '+(PY-7)+'" fill="none" stroke="currentColor" stroke-width="1.5"/></g>'}
function lbl(x,y,t,cl,an){return'<text class="'+cl+'" x="'+x+'" y="'+y+'" font-size="12" font-weight="700" text-anchor="'+(an||"end")+'">'+t+'</text>'}
var HY=PY-H0; /* y do topo da coluna a 76 cm */

/* inclinar o tubo */
(function(){var T=7.2,s=basin(100,240);
 s+='<line x1="72" y1="'+HY+'" x2="240" y2="'+HY+'" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>';
 s+=medida(HY,"","ms");s+=lbl(64,(HY+PY)/2+4,"h = 76 cm","hl");
 s+=tubo(24,"transform:rotate(40deg);transform-origin:"+PX+"px "+PY+"px","");
 var pr=[],sc=[];for(var i=0;i<=10;i++){var t=2+i*.3,a=40*i/10;pr.push([t,a]);sc.push([t,1,(H0/cos(a*PI/180))/LF])}
 var rot=N.rot(".tb",T,[[0,0],[2,0]].concat(pr),"linear"),col=N.sc(".col",T,[[0,1,H0/LF],[2,1,H0/LF]].concat(sc),"linear");
 var c=N.cap(["Tubo vertical: h = 76 cm","Inclinando o tubo, o comprimento|da coluna de mercúrio aumenta...","...mas a altura vertical h não muda:|ela depende só da pressão atmosférica"],[0,1.8,5.4],T,186);
 N.reg("torr_incl",{a:"Animação: o tubo de Torricelli é inclinado; o comprimento da coluna de mercúrio aumenta, mas a altura vertical continua 76 cm",h:218,s:s+c.s,t:[rot,col].concat(c.t),T:T})})();

/* tubo mais largo */
(function(){var T=6,s=basin(100,240);
 s+='<line x1="72" y1="'+HY+'" x2="240" y2="'+HY+'" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>'+medida(HY,"","ms")+lbl(64,(HY+PY)/2+4,"h = 76 cm","hl");
 s+='<g class="tw" style="transform-origin:'+PX+'px 0px">'+tubo(48,"","transform:scaleY("+H0/LF+")").replace('class="tb"','class="tb2"')+'</g>';
 /* coluna na altura 76 cm já definida em ys; garantir escala final */
 var fin=s.replace("transform:scaleY("+H0/LF+")","transform:scaleY("+H0/LF+")");
 var c=N.cap(["Tubo estreito: h = 76 cm","Alargando o tubo...","...a altura h continua a mesma:|a pressão não depende da largura"],[0,1.6,3.6],T,186);
 N.reg("torr_larg",{a:"Animação: o tubo de Torricelli é alargado e a altura da coluna de mercúrio continua 76 cm",h:218,s:fin+c.s,t:[N.sc(".tw",T,[[0,.34,1],[1.6,.34,1],[3.4,1,1]])].concat(c.t),T:T})})();

/* altitude */
(function(){var T=8,k=.78,s=basin(118,222);
 var H1=H0*k,Y1=PY-H1;
 s+='<path d="M236 172L282 104L318 172Z" fill="var(--f-cinza)" stroke="currentColor" stroke-width="1.5"/>';
 s+='<g class="mt"><circle cx="282" cy="104" r="6" fill="var(--spark)" stroke="currentColor" stroke-width="1.5"/></g>';
 s+='<line class="hl0" x1="72" y1="'+HY+'" x2="224" y2="'+HY+'" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 4" opacity=".55"/>';
 s+='<line class="dl" x1="72" y1="'+Y1+'" x2="224" y2="'+Y1+'" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>';
 s+='<g class="ms" style="transform-box:fill-box;transform-origin:50% 100%;transform:scaleY('+k+')">'+medida(HY,"","m1").replace("<g ","<g ")+'</g>';
 s+=lbl(64,(Y1+PY)/2+4,"h &lt; 76 cm","hl2");s+=lbl(64,(HY+PY)/2+4,"h = 76 cm","hl1").replace('class="hl1"','class="hl1" opacity="0"');
 s+=tubo(24,"","transform:scaleY("+(H1/LF)+")");
 s+='<text x="154" y="196" font-size="0"></text>';
 var tm=3.2,t1=5.4;
 var tr=[N.sc(".col",T,[[0,1,H0/LF],[tm,1,H0/LF],[t1,1,H1/LF]]),N.sc(".ms",T,[[0,1,1/k],[tm,1,1/k],[t1,1,1]]),
  N.tr(".dl",T,[[0,0,HY-Y1],[tm,0,HY-Y1],[t1,0,0]]),
  N.tr(".mt",T,[[0,-36,62],[tm,-36,62],[t1,0,0]]),
  N.op(".hl1",T,[[0,1],[tm,1],[tm+.4,0]]),N.op(".hl2",T,[[0,0],[t1-.4,0],[t1,1]])];
 var c=N.cap(["Ao nível do mar: h = 76 cm","Subindo a montanha: há menos ar|acima, a pressão atmosférica diminui","Pressão menor, coluna menor.|(Pressão maior, coluna maior.)"],[0,2.4,5.6],T,186);
 N.reg("torr_alt",{a:"Animação: ao subir uma montanha a pressão atmosférica diminui e a coluna de mercúrio do experimento de Torricelli fica menor que 76 centímetros",h:218,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* entrada de ar */
(function(){var T=8,k=.7,s=basin(118,222),H1=H0*k,Y1=PY-H1;
 s+='<line x1="72" y1="'+HY+'" x2="224" y2="'+HY+'" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 4" opacity=".55"/>';
 s+='<rect class="arz" x="'+(PX-10)+'" y="12" width="20" height="'+(Y1-12)+'" fill="var(--pos)" fill-opacity=".18"/>';
 s+='<text class="arl" x="'+(PX+22)+'" y="'+(24)+'" font-size="11" font-weight="700" fill="var(--pos)">ar</text>';
 s+=N.varrow(PX+18,30,Y1-4,"an-a2 arp",2.5).replace("<g ",'<g class2="" ');
 s+=tubo(24,"","transform:scaleY("+(H1/LF)+")");
 s+='<circle class="bub" cx="'+PX+'" cy="'+(PY-2)+'" r="5" fill="var(--f-vidro)" stroke="var(--pos)" stroke-width="2" opacity="0"/>';
 var tr=[N.sc(".col",T,[[0,1,H0/LF],[4.2,1,H0/LF],[5.8,1,H1/LF]]),
  N.tr(".bub",T,[[0,0,0],[2.2,0,0],[4.0,0,-(PY-24)]],"ease-in"),N.op(".bub",T,[[0,0],[2.2,0],[2.35,1],[3.9,1],[4.2,0]]),
  N.op(".arz",T,[[0,0],[4.0,0],[5.0,1]]),N.op(".arl,.arp",T,[[0,0],[5.0,0],[5.8,1]])];
 var c=N.cap(["Tubo de Torricelli:|vácuo acima do mercúrio","Um pouco de ar entra|e sobe até o topo","O ar exerce pressão e empurra|o mercúrio: a coluna diminui"],[0,2.2,5.0],T,186);
 N.reg("torr_ar",{a:"Animação: uma bolha de ar entra no tubo de Torricelli e sobe até o topo; a pressão do ar empurra o mercúrio e a coluna diminui",h:218,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* ---------- Prensa hidráulica ---------- */
function prensa(key,alt,mode){var T=mode==="desl"?7.4:8,tr=[],y0L=60,y0R=104,dL=50,dR=5,th=6,s="";
 var yL=y0L+dL,yR=y0R-dR; /* posições finais */
 /* líquido */
 s+='<rect class="an-w ll" x="46" y="'+(yL+th)+'" width="16" height="'+(160-yL-th)+'" style="transform-box:fill-box;transform-origin:50% 100%"/>';
 s+='<rect class="an-w" x="46" y="140" width="254" height="20"/>';
 s+='<rect class="an-w lr" x="160" y="'+(yR+th)+'" width="140" height="'+(160-yR-th)+'" style="transform-box:fill-box;transform-origin:50% 100%"/>';
 s+='<path d="M45 30V160H302V70M63 30V140H158V70" fill="none" stroke="currentColor" stroke-width="2"/>';
 /* êmbolos */
 s+='<g class="pl"><rect x="47" y="'+yL+'" width="14" height="'+th+'" fill="currentColor"/><line x1="54" y1="'+(yL-44)+'" x2="54" y2="'+yL+'" stroke="currentColor" stroke-width="3"/><rect x="42" y="'+(yL-48)+'" width="24" height="5" rx="2" fill="currentColor"/></g>';
 s+='<g class="pr"><rect x="160" y="'+yR+'" width="140" height="'+th+'" fill="currentColor"/><rect x="198" y="'+(yR-30)+'" width="64" height="30" rx="3" fill="var(--f-cinza)" stroke="currentColor" stroke-width="2"/><text x="230" y="'+(yR-10)+'" text-anchor="middle" font-size="11">carga</text></g>';
 s+='<text x="54" y="178" text-anchor="middle" font-size="12" font-weight="700">A₁</text><text x="230" y="178" text-anchor="middle" font-size="12" font-weight="700">A₂ = 10·A₁</text>';
 if(mode==="desl"){
  s+='<rect x="47" y="'+y0L+'" width="14" height="'+th+'" fill="none" stroke="currentColor" stroke-dasharray="3 2" opacity=".6"/><rect x="160" y="'+y0R+'" width="140" height="'+th+'" fill="none" stroke="currentColor" stroke-dasharray="3 2" opacity=".6"/>';
  s+='<text class="d1" x="74" y="'+(y0L+dL/2+8)+'" font-size="12" font-weight="700">d₁ = 20 cm</text><text class="d2" x="294" y="'+(yR+24)+'" text-anchor="end" font-size="12" font-weight="700">d₂ = 2 cm</text>';
  var t0=1.6,t1=4.6;
  tr.push(N.tr(".pl",T,[[0,0,-dL],[t0,0,-dL],[t1,0,0]],"linear"),N.tr(".pr",T,[[0,0,dR],[t0,0,dR],[t1,0,0]],"linear"),
   N.sc(".ll",T,[[0,1,(160-y0L-th)/(160-yL-th)],[t0,1,(160-y0L-th)/(160-yL-th)],[t1,1,1]],"linear"),
   N.sc(".lr",T,[[0,1,(160-y0R-th)/(160-yR-th)],[t0,1,(160-y0R-th)/(160-yR-th)],[t1,1,1]],"linear"),
   N.vis(".d1,.d2",T,4.8));
  var c=N.cap(["Empurra-se o êmbolo menor (A₁)","O volume de líquido deslocado é o mesmo|dos dois lados: A₁·d₁ = A₂·d₂","O êmbolo menor desce muito (20 cm);|o maior sobe pouco (2 cm)"],[0,1.4,4.8],T,196);
 }else{
  s+=N.varrow(54,14,40,"an-a1 f1",3.5).replace("<g ",'<g style="transform-box:fill-box;transform-origin:50% 0%" ')+'<text class="f1l" x="66" y="30" font-size="12" font-weight="700">F₁</text>';
  s+=N.varrow(176,yR-2,yR-62,"an-a2 f2",6).replace("<g ",'<g style="transform-box:fill-box;transform-origin:50% 100%" ')+'<text class="f2l" x="186" y="'+(yR-40)+'" font-size="13" font-weight="800">F₂ = 10·F₁</text>';
    s+='<g class="pa">'+N.varrow(54,yL+34,yL+14,"an-a3",2)+N.varrow(190,yR+40,yR+20,"an-a3",2)+N.varrow(270,yR+40,yR+20,"an-a3",2)+'<text x="108" y="154" font-size="11" font-weight="700" text-anchor="middle" class="pt">mesma p</text></g>';
  tr.push(N.sc(".f1",T,[[0,1,0],[1.0,1,0],[1.8,1,1]]),N.vis(".f1,.f1l",T,1.0),N.vis(".pa",T,3.2),N.sc(".f2",T,[[0,1,0],[5.2,1,0],[6.6,1,1]]),N.vis(".f2",T,5.2),N.vis(".f2l",T,6.2));
  var c=N.cap(["A força F₁ no êmbolo menor|cria a pressão p = F₁/A₁","A mesma pressão p age|no êmbolo maior (princípio de Pascal)","F₂ = p·A₂: como A₂ é maior,|F₂ é maior: F₂/F₁ = A₂/A₁"],[0,1.0,3.2],T,196);
  /* a última legenda entra quando F₂ aparece */
 }
 N.reg(key,{a:alt,h:226,s:s+c.s,t:tr.concat(c.t),T:T})}
prensa("prensa_desl","Animação: o êmbolo menor da prensa hidráulica desce 20 centímetros e o êmbolo maior, com área dez vezes maior, sobe só 2 centímetros","desl");
prensa("prensa_forca","Animação: a força no êmbolo menor gera uma pressão que age também no êmbolo maior; como a área dele é maior, a força é maior na mesma proporção das áreas","forca");

/* ---------- Empuxo e flutuação ---------- */
function flut(key,alt,rho,nome,cor){var f=rho/1000,T=6.6,yeq=100-50*(1-f),sub=50*f,s="";
 s+='<rect class="an-w" x="71" y="100" width="178" height="60"/><path d="M70 60V160H250V60" fill="none" stroke="currentColor" stroke-width="2"/><line x1="71" y1="100" x2="249" y2="100" stroke="var(--f-agua)" stroke-width="2"/>';
 s+='<text x="160" y="178" text-anchor="middle" font-size="11">água: ρ = 1000 kg/m³</text>';
 s+='<g class="bk"><rect x="115" y="'+yeq+'" width="90" height="50" rx="3" style="fill:'+cor+';fill-opacity:.9" stroke="currentColor" stroke-width="2"/><text x="160" y="'+(yeq+21)+'" text-anchor="middle" font-size="12" font-weight="700" style="fill:#1b1b1b">'+nome+'</text><text x="160" y="'+(yeq+37)+'" text-anchor="middle" font-size="11" style="fill:#1b1b1b">'+rho+' kg/m³</text></g>';
 s+='<g class="fs">'+N.varrow(90,yeq+22,yeq+46,"an-a1",3.5)+N.varrow(104,yeq+22,yeq-6,"an-a2",3.5)+'<text x="90" y="'+(yeq+60)+'" text-anchor="middle" font-size="12" font-weight="800">P</text><text x="104" y="'+(yeq-12)+'" text-anchor="middle" font-size="12" font-weight="800">E</text></g>';
 var pct=Math.round(f*100);
 s+='<g class="fr"><line x1="214" y1="100" x2="214" y2="'+(100+sub)+'" stroke="currentColor" stroke-width="1.5"/><text x="222" y="'+(100+sub/2)+'" font-size="12" font-weight="800">'+pct+'%</text><text x="222" y="'+(100+sub/2+13)+'" font-size="11">submerso</text></g>';
 var tr=[N.tr(".bk",T,[[0,0,-72],[0.8,0,-72],[1.7,0,10],[2.2,0,-4],[2.7,0,2],[3.1,0,0]]),N.vis(".fs",T,3.3),N.vis(".fr",T,3.9)];
 var c=N.cap(["Bloco solto na água|("+nome+": "+rho+" kg/m³)","O bloco afunda até o empuxo|igualar o peso","Equilíbrio: E = P. Parte submersa =|"+rho+"/1000 = "+(f+"").replace(".",",")+" = "+pct+"%"],[0,1.0,3.2],T,196);
 N.reg(key,{a:alt,h:226,s:s+c.s,t:tr.concat(c.t),T:T})}
flut("flut80","Animação: um bloco de madeira com densidade 800 kg/m³ é solto na água, afunda até o empuxo igualar o peso e fica com 80% do volume submerso",800,"madeira","#b8864b");
flut("flut40","Animação: um bloco com densidade 400 kg/m³ é solto na água e flutua com 40% do volume submerso",400,"bloco","#c9a36a");
flut("flut92","Animação: um bloco de gelo com densidade 920 kg/m³ flutua na água com 92% do volume submerso",920,"gelo","#bfe6f5");

/* dinamômetro e peso aparente */
(function(){var T=8,s="",tr=[],dy=62,yb=64,bh=36;
 s+='<rect class="an-w" x="81" y="112" width="158" height="60"/><path d="M80 80V172H240V80" fill="none" stroke="currentColor" stroke-width="2"/><line x1="81" y1="112" x2="239" y2="112" stroke="var(--f-agua)" stroke-width="2"/>';
 s+='<rect x="140" y="4" width="40" height="40" rx="5" fill="var(--f-vidro)" stroke="currentColor" stroke-width="2"/>';
 s+='<text class="r50" x="160" y="29" text-anchor="middle" font-size="13" font-weight="800" opacity="0">50 N</text><text class="r30" x="160" y="29" text-anchor="middle" font-size="13" font-weight="800">30 N</text>';
 s+='<line class="rope" x1="160" y1="44" x2="160" y2="'+(yb+dy)+'" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:50% 0%"/>';
 s+='<g class="bk"><rect x="130" y="'+(yb+dy)+'" width="60" height="'+bh+'" rx="3" fill="#8b95a5" stroke="currentColor" stroke-width="2"/><text x="160" y="'+(yb+dy+23)+'" text-anchor="middle" font-size="11" font-weight="700" style="fill:#14161a">bloco</text></g>';
 s+='<g class="fe">'+N.varrow(210,yb+dy+bh/2+6,yb+dy+bh/2-24,"an-a2",3.5)+'<text x="218" y="'+(yb+dy+bh/2-6)+'" font-size="12" font-weight="800">E = 20 N</text></g>';
 var t0=1.6,t1=4.0;
 tr=[N.tr(".bk",T,[[0,0,-dy],[t0,0,-dy],[t1,0,0]],"ease-in-out"),N.sc(".rope",T,[[0,1,(yb-44)/(yb+dy-44)],[t0,1,(yb-44)/(yb+dy-44)],[t1,1,1]],"ease-in-out"),
  N.op(".r50",T,[[0,1],[t1-.8,1],[t1-.6,0]]),N.op(".r30",T,[[0,0],[t1-.6,0],[t1-.4,1]]),N.vis(".fe",T,5.2)];
 var c=N.cap(["No ar: o dinamômetro marca|o peso do bloco, 50 N","Mergulhando na água, a leitura|cai para 30 N (peso aparente)","O empuxo é a diferença:|E = 50 − 30 = 20 N"],[0,1.4,5.0],T,196);
 N.reg("balanca",{a:"Animação: um bloco pendurado no dinamômetro marca 50 newtons no ar; ao ser mergulhado na água a leitura cai para 30 newtons, e o empuxo é a diferença, 20 newtons",h:226,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* ================= PRIORIDADE MÉDIA ================= */
/* ---------- pressão x profundidade ---------- */
(function(){var T=8,tr=[],s='';
 s+='<rect class="an-w" x="70" y="16" width="170" height="124"/><path d="M70 12V140H240V12" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="64" y1="16" x2="246" y2="16" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 3"/>';
 [[16,"0 m"],[76,"5 m"],[136,"10 m"]].forEach(function(a){s+='<line x1="62" y1="'+a[0]+'" x2="70" y2="'+a[0]+'" stroke="currentColor" stroke-width="2"/><text x="58" y="'+(a[0]+4)+'" text-anchor="end" font-size="11" font-weight="700">'+a[1]+'</text>'});
 s+='<g class="pb"><circle cx="155" cy="136" r="9" fill="var(--spark)" stroke="currentColor" stroke-width="2"/></g>';
 tr.push(N.tr(".pb",T,[[0,0,-120],[1.4,0,-120],[5,0,0]]));
 s+='<rect x="40" y="154" width="200" height="16" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="40" y="154" width="100" height="16" fill="#8d99ad"/><rect class="pg" x="140" y="154" width="100" height="16" fill="var(--f-agua)" style="transform-box:fill-box;transform-origin:left center"/>';
 s+='<text x="90" y="186" text-anchor="middle" font-size="11" font-weight="700">ar: 1×10⁵ Pa</text><text class="pgl" x="190" y="186" text-anchor="middle" font-size="11" font-weight="700">água: 1×10⁵ Pa</text><text class="ptot" x="250" y="166" font-size="12" font-weight="700">= 2×10⁵ Pa</text>';
 tr.push(N.sc(".pg",T,[[0,0,1],[1.4,0,1],[5,1,1]]),N.vis(".pgl",T,3.6),N.vis(".ptot",T,4.8));
 var c=N.cap(["Na superfície, só a atmosfera:|p = 1×10⁵ Pa","Ao descer, soma-se a pressão da água:|ρ·g·h = 1000 · 10 · 10 = 1×10⁵ Pa","A pressão total aumenta com a profundidade:|p = p₀ + ρ·g·h = 2×10⁵ Pa"],[0,1.4,5],T,208);
 N.reg("profund",{a:"Animação: um sensor desce na água; a pressão total é a soma da pressão atmosférica com a pressão da coluna de água, e a 10 metros de profundidade vale 2 vezes 10 elevado a 5 pascals",h:232,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- vasos comunicantes ---------- */
(function(){var T=8,tr=[],s='';
 var cols=[[31,38,90],[121,28,30],[221,68,44]],fin=54;
 s+='<rect class="an-w" x="31" y="131" width="258" height="18"/>';
 cols.forEach(function(c,i){s+='<rect class="an-w cv'+i+'" x="'+c[0]+'" y="'+(130-fin)+'" width="'+c[1]+'" height="'+fin+'" style="transform-box:fill-box;transform-origin:center bottom"/>';
  tr.push(N.sc(".cv"+i,T,[[0,1,c[2]/fin],[1.6,1,c[2]/fin],[5,1,1]]))});
 s+='<path d="M30 30V150H290V30M70 30V130M120 30V130M150 30V130M220 30V130" fill="none" stroke="currentColor" stroke-width="2.5"/>';
 s+='<line class="nv" x1="14" y1="76" x2="306" y2="76" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 3"/><text class="nv" x="304" y="68" text-anchor="end" font-size="12" font-weight="700">mesmo nível</text>';
 tr.push(N.vis(".nv",T,5));
 var c=N.cap(["Vasos ligados pela base, com formas diferentes:|o líquido começa em níveis diferentes","O líquido escoa de um ramo para os outros","No equilíbrio, o líquido atinge o mesmo|nível em todos os ramos"],[0,1.6,5],T,172);
 N.reg("vasos",{a:"Animação: em vasos comunicantes de formas diferentes o líquido escoa até atingir o mesmo nível em todos os ramos",h:196,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- canudo ---------- */
(function(){var T=8,tr=[],s='';
 s+='<rect class="an-w" x="100" y="100" width="120" height="62"/><path d="M100 70V162H220V70" fill="none" stroke="currentColor" stroke-width="2.5"/>';
 s+='<rect class="an-w cs" x="154" y="56" width="12" height="94" style="transform-box:fill-box;transform-origin:center bottom"/><rect x="152" y="30" width="16" height="120" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>';
 tr.push(N.sc(".cs",T,[[0,1,.53],[1.6,1,.53],[5,1,1]]));
 s+=N.varrow(122,66,96,"an-a3 ata",3)+N.varrow(198,66,96,"an-a3 ata",3);
 s+='<text x="110" y="64" font-size="11" font-weight="700">p atm</text>';
 s+=N.varrow(160,36,8,"an-a2 sg",3);
 s+='<text class="sgl" x="176" y="20" font-size="11" font-weight="700">p menor</text>';
 tr.push(N.vis(".sg,.sgl",T,1.4),N.vis(".ata",T,3.4));
 var c=N.cap(["Canudo mergulhado no refresco:|a pressão é a mesma dentro e fora","Ao sugar, a pressão dentro do canudo diminui","A pressão atmosférica, maior, empurra o|líquido para dentro e para cima do canudo"],[0,1.4,3.6],T,184);
 N.reg("canudo",{a:"Animação: ao sugar o canudo a pressão dentro dele diminui, e a pressão atmosférica sobre o líquido do copo o empurra para cima pelo canudo",h:206,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- seringa ---------- */
(function(){var T=8,tr=[],s='';
 s+='<rect class="an-w" x="90" y="126" width="140" height="34"/><path d="M90 104V160H230V104" fill="none" stroke="currentColor" stroke-width="2.5"/>';
 s+='<rect class="an-w sl" x="147" y="44" width="26" height="52" style="transform-box:fill-box;transform-origin:center bottom"/>';
 tr.push(N.sc(".sl",T,[[0,1,.04],[1.6,1,.04],[5,1,1]]));
 s+='<rect x="146" y="40" width="28" height="58" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="156" y="98" width="8" height="40" fill="var(--f-cinza)" stroke="currentColor" stroke-width="2"/>';
 s+='<g class="pl"><rect x="147" y="38" width="26" height="8" fill="#8d99ad" stroke="currentColor" stroke-width="1.5"/><line x1="160" y1="38" x2="160" y2="8" stroke="currentColor" stroke-width="3"/><line x1="146" y1="8" x2="174" y2="8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></g>';
 tr.push(N.tr(".pl",T,[[0,0,50],[1.6,0,50],[5,0,0]]));
 s+=N.varrow(112,96,124,"an-a3 ata",3)+N.varrow(208,96,124,"an-a3 ata",3);
 s+='<text x="160" y="198" text-anchor="middle" font-size="0"></text><text x="112" y="90" text-anchor="middle" font-size="11" font-weight="700">p atm</text><text class="pm" x="184" y="64" font-size="11" font-weight="700">p menor</text>';
 tr.push(N.vis(".pm",T,1.8),N.vis(".ata",T,3));
 var c=N.cap(["Seringa com a ponta no líquido","Ao puxar o êmbolo, a pressão dentro da|seringa diminui","A pressão externa, maior, empurra|o líquido para dentro da seringa"],[0,1.6,3.4],T,184);
 N.reg("seringa",{a:"Animação: ao puxar o êmbolo da seringa a pressão interna diminui e a pressão atmosférica externa empurra o líquido para dentro dela",h:206,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- ventosa ---------- */
(function(){var T=8,tr=[],s='';
 s+='<rect x="236" y="14" width="16" height="116" fill="var(--f-vidro)" fill-opacity=".6" stroke="currentColor" stroke-width="2"/><text x="244" y="146" text-anchor="middle" font-size="11" font-weight="700">vidro</text>';
 s+='<g class="cup"><path d="M236 44Q190 44 190 72Q190 100 236 100Z" fill="var(--f-verde)" fill-opacity=".8" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><circle cx="186" cy="72" r="6" fill="var(--f-verde)" stroke="currentColor" stroke-width="2"/></g>';
 tr.push(N.tr(".cup",T,[[0,-40,0],[1.4,-40,0],[3,0,0]]));
 [[220,58],[214,72],[222,86],[206,72]].forEach(function(a,i){s+='<circle class="ar ar'+i+'" cx="'+a[0]+'" cy="'+a[1]+'" r="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/>';
  var dy=(i%2?1:-1)*(10+i*3);
  tr.push(N.tr(".ar"+i,T,[[0,-40,0],[1.4,-40,0],[3,0,0],[3.1,0,0],[4.2,-8,dy*3]]),N.op(".ar"+i,T,[[0,1],[3.1,1],[4,0]]))});
 s=s.replace(/<circle class="ar ar(\d)"([^>]*)\/>/g,'<circle class="ar ar$1"$2 opacity="0"/>');
 [52,72,92].forEach(function(y){s+=N.arrow(100,170,y,"an-a2 ata",3)});
 s+='<text class="atl" x="100" y="40" font-size="11" font-weight="700">p atm (fora)</text><text class="pil" x="232" y="118" text-anchor="end" font-size="11" font-weight="700">p menor</text>';
 tr.push(N.vis(".ata,.atl",T,3.8),N.vis(".pil",T,4.4));
 var c=N.cap(["Ventosa encostada no vidro,|com ar dentro","Ao apertar, o ar sai de dentro dela","Pressão externa maior que a interna:|a ventosa fica presa ao vidro"],[0,1.4,4],T,168);
 N.reg("ventosa",{a:"Animação: ao apertar a ventosa contra o vidro o ar sai de dentro dela; a pressão atmosférica externa fica maior que a interna e a ventosa gruda",h:190,s:s+c.s,t:tr.concat(c.t),T:T})})();

/* ================= PRIORIDADE BAIXA ================= */
/* ---------- empuxo ---------- */
(function(){var T=8,tr=[],s='';
 s+='<rect class="an-w" x="70" y="90" width="180" height="80"/><path d="M70 70V170H250V70" fill="none" stroke="currentColor" stroke-width="2.5"/>';
 s+='<g class="bl"><line x1="160" y1="0" x2="160" y2="100" stroke="currentColor" stroke-width="2"/><rect x="135" y="100" width="50" height="50" rx="3" fill="#8d99ad" stroke="currentColor" stroke-width="2.5"/>'+N.varrow(206,100,142,"an-a3",3.5)+'<text x="214" y="124" font-size="13" font-weight="700">P</text><g class="ea" style="transform-box:fill-box;transform-origin:center bottom">'+N.varrow(114,150,106,"an-a1",3.5)+'</g><text class="elb" x="104" y="130" text-anchor="end" font-size="13" font-weight="700">E</text></g>';
 tr.push(N.vis(".ea",T,1.8),N.tr(".bl",T,[[0,0,-80],[1,0,-80],[4.6,0,0]]),N.sc(".ea",T,[[0,1,.05],[1.8,1,.05],[4.6,1,1]]),N.vis(".elb",T,4.4));
 var c=N.cap(["Bloco pendurado fora do líquido:|só o peso P age sobre ele","Ao mergulhar, o líquido empurra o|bloco para cima: surge o empuxo E","E = ρ·g·V: o peso do volume de líquido|deslocado pelo corpo"],[0,1.4,4.8],T,188);
 N.reg("empuxo",{a:"Animação: um bloco pendurado é mergulhado em água; o empuxo vertical para cima surge e cresce conforme o bloco afunda, e é igual ao peso do volume de líquido deslocado, ρ·g·V",h:208,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- submarino ---------- */
(function(){var T=9,tr=[],s='';
 s+='<rect class="an-w" x="10" y="66" width="300" height="104"/><line x1="10" y1="66" x2="310" y2="66" stroke="currentColor" stroke-width="2"/>';
 s+='<g class="sb"><rect x="152" y="38" width="22" height="16" rx="3" fill="#8d99ad" stroke="currentColor" stroke-width="2"/><ellipse cx="160" cy="66" rx="76" ry="22" fill="#8d99ad" stroke="currentColor" stroke-width="2.5"/>';
 [[104,"tkl"],[196,"tkr"]].forEach(function(a){s+='<rect x="'+(a[0]-16)+'" y="56" width="32" height="20" rx="4" fill="var(--surface)" stroke="currentColor" stroke-width="1.8"/><rect class="tw '+a[1]+'" x="'+(a[0]-15)+'" y="57" width="30" height="18" rx="3" fill="var(--f-agua)" opacity="0" style="transform-box:fill-box;transform-origin:center bottom"/>'});
 s+='<text x="160" y="70" text-anchor="middle" font-size="10" style="fill:#1b1b1b">lastro</text></g>';
 tr.push(N.tr(".sb",T,[[0,0,66],[3,0,66],[7,0,0]]),N.op(".tw",T,[[0,1],[2.8,1],[3,0]]),N.sc(".tw",T,[[0,1,1],[1.4,1,1],[3,1,.05]]));
 s+='<text class="ar1" opacity="0" x="160" y="26" text-anchor="middle" font-size="11" font-weight="700">ar comprimido expulsa a água</text>';
 tr.push(N.vis(".ar1",T,1.4,3.2));
 var c=N.cap(["Tanques de lastro cheios de água:|submarino mais denso, afundado","Ar comprimido expulsa a água dos tanques","Densidade média menor: empuxo maior|que o peso, e o submarino sobe"],[0,1.4,3.4],T,188);
 N.reg("submarino",{a:"Animação: um submarino afundado expulsa a água dos tanques de lastro com ar comprimido, sua densidade média diminui, o empuxo supera o peso e ele sobe à superfície",h:208,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- pressão atmosférica x altitude ---------- */
(function(){var T=9,tr=[],s='';
 s+='<path d="M20 150L200 66L300 150Z" fill="#8d99ad" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="8" y1="150" x2="312" y2="150" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 3"/><text x="310" y="166" text-anchor="end" font-size="11" font-weight="700">nível do mar</text>';
 s+='<text x="160" y="12" text-anchor="middle" font-size="11" font-weight="700">topo da atmosfera</text><line x1="40" y1="16" x2="300" y2="16" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3"/>';
 s+='<rect class="bar" x="195" y="18" width="10" height="42" fill="var(--f-agua)" fill-opacity=".55" stroke="currentColor" stroke-width="1" style="transform-box:fill-box;transform-origin:center top"/><g class="hk"><circle cx="200" cy="60" r="6" fill="var(--spark)" stroke="currentColor" stroke-width="2"/></g>';
 tr.push(N.tr(".bar",T,[[0,-140,0,1,2.5],[1.2,-140,0,1,2.5],[6,0,0,1,1]],"linear"),N.tr(".hk",T,[[0,-140,65],[1.2,-140,65],[6,0,0]],"linear"));
 s+='<text class="p0" opacity="0" x="62" y="70" text-anchor="middle" font-size="12" font-weight="700">muito ar acima:|pressão maior</text><text class="p1" x="262" y="40" text-anchor="middle" font-size="12" font-weight="700">menos ar acima:|pressão menor</text>';
 s=s.replace('muito ar acima:|pressão maior','muito ar acima').replace('menos ar acima:|pressão menor','menos ar acima');
 tr.push(N.op(".p0",T,[[0,1],[4,1],[4.6,0]]),N.op(".p1",T,[[0,0],[5,0],[5.8,1]]));
 s=s.replace('<text class="p1"','<text class="p1"');
 var c=N.cap(["Ao nível do mar, a coluna de ar acima|é a mais alta: pressão maior","Subindo a montanha, há menos ar acima de nós","A pressão atmosférica diminui com a altitude"],[0,1.4,5],T,184);
 N.reg("atmosfera",{a:"Animação: um alpinista sobe uma montanha; a coluna de ar acima dele diminui e a pressão atmosférica diminui com a altitude",h:204,s:s+c.s,t:tr.concat(c.t),T:T})})();
/* ---------- pressão x área de apoio ---------- */
(function(){var T=8,tr=[],s='';
 s+='<rect x="14" y="120" width="292" height="50" rx="4" fill="#e6d3a0" stroke="currentColor" stroke-width="2"/>';
 s+='<g class="b1"><rect x="40" y="86" width="90" height="40" rx="3" fill="#8d99ad" stroke="currentColor" stroke-width="2.5"/><text x="85" y="111" text-anchor="middle" font-size="11" style="fill:#1b1b1b">mesmo bloco</text>'+N.varrow(85,50,78,"an-a3",3.5)+'<text x="97" y="68" font-size="12" font-weight="700">F</text></g>';
 s+='<g class="b2"><rect x="205" y="52" width="40" height="90" rx="3" fill="#8d99ad" stroke="currentColor" stroke-width="2.5"/><text x="225" y="100" text-anchor="middle" font-size="11" style="fill:#1b1b1b" transform="rotate(-90 225 97)">mesmo bloco</text>'+N.varrow(225,16,44,"an-a3",3.5)+'<text x="237" y="34" font-size="12" font-weight="700">F</text></g>';
 tr.push(N.tr(".b1",T,[[0,0,-30],[1.2,0,-30],[3,0,0]],"ease-in"),N.tr(".b2",T,[[0,0,-46],[1.2,0,-46],[3,0,0]],"ease-in"));
 s+='<text class="la" x="85" y="190" text-anchor="middle" font-size="12" font-weight="700">área maior: p menor</text><text class="lb" x="225" y="190" text-anchor="middle" font-size="12" font-weight="700">área menor: p maior</text>';
 tr.push(N.vis(".la,.lb",T,3.4));
 var c=N.cap(["Dois apoios do mesmo bloco|aplicam a mesma força F","Com a força igual, quem apoia numa área|menor afunda mais na superfície","p = F / A: menor área,|maior pressão"],[0,1.2,3.8],T,208);
 N.reg("pressao_area",{a:"Animação: o mesmo bloco apoiado por uma face grande e por uma face pequena aplica a mesma força; a face de menor área afunda mais, pois a pressão p = F/A é maior",h:228,s:s+c.s,t:tr.concat(c.t),T:T})})();
})();

/* ---------- resoluções passo a passo das questões de cálculo (f106 a f117) ---------- */
(function(){"use strict";
var N=window.AN,H=186,CY=140,W="var(--f-agua2)",OIL="#e2b24a";
function sb(t){return N.sb(t)}
function water(x,y,w,h,cl){return'<rect class="an-w '+(cl||"")+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"/>'}
function tank(x,y,w,h){return'<path d="M'+x+' '+y+'V'+(y+h)+'H'+(x+w)+'V'+y+'" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>'}
N.calc("calc_f106","Animação passo a passo: a pressão no fundo a 20 metros de profundidade soma a pressão atmosférica de 1 vez 10 elevado a 5 pascals com a da coluna de água, de 2 vezes 10 elevado a 5 pascals, e vale 3 vezes 10 elevado a 5 pascals",{h:H,cy:CY,
 s:water(110,24,120,84)+tank(110,24,120,84)+'<g>'+N.varrow(130,2,22,"an-a3",3)+N.varrow(210,2,22,"an-a3",3)+N.t(170,16,"p₀",{a:"middle"})+'</g>'+N.dv(100,24,108,"h = 20 m")+'<g class="s3">'+N.varrow(170,40,100,"an-a2",3.5)+N.t(190,72,"μ·g·h",{a:"start"})+'</g>',
 steps:[[0,"No fundo, a pressão soma a atmosfera|e a coluna de água"],[2.8,"p = p₀ + μ · g · h"],[5.4,"p = 1,0·10⁵ + 1000 · 10 · 20"],[8,"p = 1·10⁵ + 2·10⁵ = 3,0·10⁵ Pa"]]});
N.calc("calc_f107","Animação passo a passo: no fundo de um tanque com 0,5 metro de óleo sobre 0,3 metro de água, a pressão é a soma das camadas, 4000 pascals mais 3000 pascals, ou 7000 pascals",{h:H,cy:CY,
 s:'<rect x="110" y="20" width="110" height="40" fill="'+OIL+'" fill-opacity=".92"/>'+water(110,60,110,24)+tank(110,20,110,64)+N.t(165,44,"óleo 800 kg/m³",{s:11,f:"#14161a"})+N.t(165,76,"água 1000 kg/m³",{s:11})+N.dv(100,20,60,"0,5 m")+N.dv(100,60,84,"0,3 m")+'<g class="s2">'+N.t(240,44,"4000 Pa",{a:"start",c:"cp"})+'</g><g class="s3">'+N.t(240,76,"3000 Pa",{a:"start",c:"cp"})+'</g>',
 steps:[[0,"A pressão no fundo é a soma|das pressões de cada camada"],[2.8,"Óleo: 800 · 10 · 0,5 = 4000 Pa"],[5.4,"Água: 1000 · 10 · 0,3 = 3000 Pa"],[8,"p = 4000 + 3000 = 7 000 Pa"]]});
N.calc("calc_f108","Animação passo a passo: um bloco de 8 quilogramas e 0,01 metro cúbico, totalmente na água, tem peso de 80 newtons e empuxo de 100 newtons; a resultante é 20 newtons para cima e o bloco sobe",{h:H,cy:CY,
 s:water(70,18,180,92)+tank(70,18,180,92)+'<rect x="130" y="40" width="44" height="40" rx="3" fill="#8b95a5" stroke="currentColor" stroke-width="2"/>'+N.t(152,64,"8 kg",{s:11,f:"#14161a"})+'<g class="s2">'+N.varrow(152,80,106,"an-a1",3.5)+N.t(162,102,"P = 80 N",{a:"start"})+'</g><g class="s3">'+N.varrow(152,40,6,"an-a2",3.5)+N.t(162,22,"E = 100 N",{a:"start"})+'</g><g class="s4">'+N.varrow(100,74,40,"an-a3",4)+N.t(100,92,"R = 20 N")+'</g>',
 steps:[[0,"Bloco: m = 8 kg e V = 0,01 m³,|totalmente na água"],[2.8,"Peso: P = m · g = 8 · 10 = 80 N"],[5.2,"Empuxo: E = μ·g·V = 1000·10·0,01 = 100 N"],[8,"Resultante: 100 − 80 = 20 N para cima"]]});
function prensa(o){var s='<path d="M60 40V100H260V40" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M96 40V82H210V40" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="61" y="82" width="35" height="17" class="an-w"/><rect x="96" y="82" width="114" height="17" class="an-w"/><rect x="210" y="82" width="49" height="17" class="an-w"/>';
 s+='<g class="p1"><rect x="62" y="64" width="32" height="8" fill="#8d99ad" stroke="currentColor" stroke-width="2"/><rect x="76" y="40" width="4" height="24" fill="currentColor"/></g>';
 s+='<g class="p2"><rect x="212" y="'+o.y2+'" width="46" height="8" fill="#8d99ad" stroke="currentColor" stroke-width="2"/>'+(o.car||'')+'</g>';return s}
(function(){var s=prensa({y2:60})+N.t(78,112,"A₁ = 20 cm²",{s:11})+N.t(235,112,"A₂ = 400 cm²",{s:11})+'<g class="s2">'+N.varrow(78,22,48,"an-a2",3.5)+N.t(100,32,"d₁ = ?",{a:"start"})+N.varrow(235,56,30,"an-a1",3.5)+N.t(250,24,"2 cm",{a:"start"})+'</g>';
 N.calc("calc_f109","Animação passo a passo: em uma prensa hidráulica com êmbolos de 20 e 400 centímetros quadrados, para o êmbolo maior subir 2 centímetros o menor precisa descer 40 centímetros",{h:H,cy:CY,s:s,tr:[N.tr(".p1",11.6,[[0,0,-14],[2.4,0,-14],[7.4,0,0]],"linear"),N.tr(".p2",11.6,[[0,0,6],[2.4,0,6],[7.4,0,0]],"linear")],
 steps:[[0,"Prensa: A₁ = 20 cm² e A₂ = 400 cm².|O êmbolo maior sobe d₂ = 2 cm"],[2.8,"O volume deslocado é o mesmo:|A₁ · d₁ = A₂ · d₂"],[5.4,"20 · d₁ = 400 · 2"],[8,"d₁ = 800 / 20 = 40 cm"]]})})();
(function(){var car='<rect x="216" y="34" width="38" height="14" rx="3" fill="var(--f-calor)" fill-opacity=".7" stroke="currentColor" stroke-width="2"/><rect x="224" y="24" width="22" height="10" rx="2" fill="var(--f-calor)" fill-opacity=".5" stroke="currentColor" stroke-width="2"/><circle cx="224" cy="50" r="4" fill="currentColor"/><circle cx="246" cy="50" r="4" fill="currentColor"/>';
 var s=prensa({y2:56,car:car}).replace('<g class="p2"><rect x="212" y="56"','<g class="p2"><rect x="212" y="56"')+N.t(78,112,"A₁ = 0,01 m²",{s:11})+N.t(235,112,"A₂ = 0,3 m²",{s:11})+'<g class="s3">'+N.varrow(78,22,52,"an-a2",3.5)+N.t(100,32,"F₁ = ?",{a:"start"})+'</g><g class="s2">'+N.t(235,16,"P = 12 000 N",{c:"cp"})+'</g>';
 N.calc("calc_f113","Animação passo a passo: um elevador hidráulico ergue um carro de 1200 quilogramas, que pesa 12000 newtons, sobre um êmbolo de 0,3 metro quadrado; no êmbolo menor, de 0,01 metro quadrado, a força mínima é 400 newtons",{h:H,cy:CY,s:s,
 steps:[[0,"O carro (1 200 kg) pesa:|P = m · g = 12 000 N"],[2.8,"Pascal: F₁ / A₁ = F₂ / A₂"],[5.4,"F₁ = 12 000 · 0,01 / 0,3"],[8,"F₁ = 400 N"]]})})();
(function(){var b=function(x,h,f){return'<path d="M'+x+' 12V92H'+(x+44)+'V12" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="'+(x+1)+'" y="'+(92-h)+'" width="42" height="'+(h-1)+'" fill="'+f+'" fill-opacity=".6"/>'};
 N.calc("calc_f110","Animação passo a passo: ao misturar 200 gramas de água e 300 gramas de álcool, os volumes de 200 e 375 centímetros cúbicos somam 575 centímetros cúbicos, e a densidade da mistura é cerca de 0,87 grama por centímetro cúbico",{h:H,cy:CY,
 s:b(30,24,"var(--f-agua)")+b(110,45,OIL)+'<g class="s2">'+N.t(213,58,"=",{s:20})+b(244,69,"#9fb87a")+N.t(266,106,"500 g")+N.t(266,118,"575 cm³",{s:11})+'</g>'+N.t(52,64,"200 g",{s:11})+N.t(52,106,"água")+N.t(132,106,"álcool")+N.t(132,118,"375 cm³",{s:11})+N.t(52,118,"200 cm³",{s:11})+N.t(98,58,"+",{s:20}),
 steps:[[0,"Volume: V = m / μ|água: 200 cm³; álcool: 300 / 0,8 = 375 cm³"],[3,"V total = 200 + 375 = 575 cm³"],[6,"μ = m total / V total = 500 / 575"],[8.6,"μ ≈ 0,87 g/cm³"]]})})();
N.calc("calc_f111","Animação passo a passo: um bloco de madeira de 600 quilogramas por metro cúbico e 0,005 metro cúbico flutua na água com 60 por cento do volume submerso, ou seja, 3 vezes 10 elevado a menos 3 metros cúbicos",{h:H,cy:CY,
 s:water(60,50,200,60)+tank(60,24,200,86)+'<rect x="126" y="30" width="68" height="50" rx="3" fill="#c9a36a" stroke="currentColor" stroke-width="2"/><line x1="60" y1="50" x2="260" y2="50" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>'+N.t(160,72,"60%",{s:13,f:"#14161a"})+'<g class="s2">'+N.varrow(184,74,34,"an-a2",3)+N.t(194,40,"E",{a:"start"})+N.varrow(136,44,84,"an-a1",3)+N.t(122,60,"P",{a:"end"})+'</g>',
 steps:[[0,"O bloco flutua: empuxo = peso|μ"+sb("água")+" · g · V"+sb("sub")+" = μ"+sb("bloco")+" · g · V"],[3,"1000 · V"+sb("sub")+" = 600 · 0,005"],[5.8,"V"+sb("sub")+" = 3 / 1000"],[8.4,"V"+sb("sub")+" = 3,0·10⁻³ m³ (60% do bloco)"]]});
N.calc("calc_f112","Animação passo a passo: a mesma pressão atmosférica sustenta 76 centímetros de mercúrio ou cerca de 12,9 metros de óleo de 800 quilogramas por metro cúbico, pois o óleo é muito menos denso",{h:H,cy:CY,
 s:'<path d="M70 8V104H110V8" fill="none" stroke="currentColor" stroke-width="2.5"/><rect class="an-hg" x="71" y="78" width="38" height="25"/>'+N.t(90,120,"mercúrio",{s:11})+N.t(90,70,"76 cm",{s:10})+'<g class="s4"><path d="M200 8V104H240V8" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="201" y="22" width="38" height="81" fill="'+OIL+'" fill-opacity=".92"/><path d="M196 54l48-6M196 62l48-6" stroke="var(--surface)" stroke-width="5"/>'+N.t(220,120,"óleo",{s:11})+N.t(220,90,"12,9 m",{s:10,f:"#14161a"})+N.t(155,26,"fora de",{s:10})+N.t(155,38,"escala",{s:10})+'</g>',
 steps:[[0,"A mesma pressão atmosférica equilibra|colunas de líquidos diferentes"],[3,"μ"+sb("Hg")+" · g · h"+sb("Hg")+" = μ"+sb("óleo")+" · g · h"+sb("óleo")],[5.8,"13 600 · 0,76 = 800 · h"],[8.4,"h = 10 336 / 800 ≈ 12,9 m"]]});
(function(){var s='<rect x="130" y="100" width="60" height="8" fill="currentColor" fill-opacity=".5"/><rect x="144" y="52" width="32" height="48" rx="6" fill="var(--f-agua)" fill-opacity=".55" stroke="currentColor" stroke-width="2"/><circle cx="160" cy="38" r="10" fill="none" stroke="currentColor" stroke-width="2"/><rect x="146" y="92" width="38" height="8" rx="3" fill="#c9a36a" stroke="currentColor" stroke-width="2"/>'+N.t(224,96,"A = 0,02 m²",{a:"start",s:11})+'';
 N.calc("calc_f114","Animação passo a passo: uma pessoa de 70 quilogramas apoiada em um pé de 200 centímetros quadrados pesa 700 newtons e exerce pressão de 3,5 vezes 10 elevado a 4 pascals no chão",{h:H,cy:CY,s:s+'<g class="s2">'+N.varrow(210,28,86,"an-a1",3.5)+N.t(220,50,"P = 700 N",{a:"start"})+'</g>',
 steps:[[0,"Pessoa de 70 kg em um pé:|P = m · g = 70 · 10 = 700 N"],[3,"Área de apoio: A = 200 cm² = 0,02 m²"],[5.8,"p = F / A = 700 / 0,02"],[8.4,"p = 3,5·10⁴ Pa"]]})})();
N.calc("calc_f115","Animação passo a passo: uma janela de 0,05 metro quadrado a 30 metros de profundidade sofre pressão total de 4 vezes 10 elevado a 5 pascals e, portanto, força de 2 vezes 10 elevado a 4 newtons",{h:H,cy:CY,
 s:water(60,12,200,98)+'<path d="M60 12V110H260V12" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="254" y="82" width="12" height="20" fill="var(--f-vidro)" stroke="currentColor" stroke-width="2.5"/>'+N.dv(50,12,92,"30 m")+N.t(130,100,"A = 0,05 m²",{s:11})+'<g class="s2">'+N.arrow(200,246,86,"an-a2",3)+N.arrow(200,246,98,"an-a2",3)+'</g>',
 steps:[[0,"A janela está a 30 m de profundidade|(A = 0,05 m²)"],[3,"p = p₀ + μ · g · h = 1·10⁵ + 1000·10·30|p = 4·10⁵ Pa"],[6,"F = p · A = 4·10⁵ · 0,05"],[8.6,"F = 2,0·10⁴ N"]]});
N.calc("calc_f116","Animação passo a passo: um bloco de 2 quilogramas pesa 20 newtons no ar e o dinamômetro marca 12 newtons na água; o empuxo é 8 newtons e o volume é 8 vezes 10 elevado a menos 4 metros cúbicos",{h:H,cy:CY,
 s:'<rect x="70" y="6" width="30" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="66" y="18" width="38" height="30" rx="4" fill="var(--bg)" stroke="currentColor" stroke-width="2"/>'+N.t(85,38,"12 N",{s:12})+'<line x1="85" y1="48" x2="85" y2="66" stroke="currentColor" stroke-width="2"/>'+water(40,70,100,44)+tank(40,60,100,54)+'<rect x="68" y="76" width="34" height="30" rx="3" fill="#8b95a5" stroke="currentColor" stroke-width="2"/><g class="s3">'+N.varrow(256,100,62,"an-a2",3.5)+N.t(264,84,"E = 8 N",{a:"start"})+'</g><g class="s2">'+N.varrow(190,40,92,"an-a1",3.5)+N.t(200,44,"P = 20 N",{a:"start"})+'</g>',
 steps:[[0,"Fora da água: P = m · g = 20 N.|Na água, o dinamômetro marca 12 N"],[3,"Empuxo: E = P − P aparente = 20 − 12 = 8 N"],[5.8,"E = μ · g · V → V = 8 / (1000 · 10)"],[8.4,"V = 8·10⁻⁴ m³ (0,8 L)"]]});
N.calc("calc_f117","Animação passo a passo: em um tubo em U com água de um lado e óleo do outro, a coluna de óleo de 20 centímetros equilibra uma coluna de água de 16 centímetros acima do mesmo nível",{h:H,cy:CY,
 s:'<path d="M110 10V104H210V10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M149 10V90H171V10" fill="var(--bg)" stroke="currentColor" stroke-width="2.5"/><rect x="111" y="88" width="98" height="15" class="an-w"/><rect x="111" y="52" width="38" height="51" class="an-w"/><rect x="171" y="52" width="38" height="51" class="an-w"/><rect x="111" y="20" width="38" height="32" class="an-w"/><rect x="171" y="12" width="38" height="40" fill="'+OIL+'" fill-opacity=".92"/><line x1="100" y1="52" x2="220" y2="52" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>'+N.dv(100,20,52,"h")+N.dv(230,12,52,"20 cm").replace('text-anchor="end"','text-anchor="start"').replace(/x="222"/,'x="238"')+N.t(130,40,"água",{s:11})+N.t(190,34,"óleo",{s:11,f:"#14161a"}),
 steps:[[0,"Na superfície de separação, as pressões|dos dois ramos são iguais"],[3,"μ"+sb("água")+" · g · h = μ"+sb("óleo")+" · g · 0,20"],[5.8,"1000 · h = 800 · 20"],[8.4,"h = 16 cm"]]});
})();
