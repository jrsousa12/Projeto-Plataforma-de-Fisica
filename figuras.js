/* Figuras (SVG) usadas nas perguntas. */
(function(){"use strict";
function S(x,y,s){return '<text class="t '+(s==="+"?"pos":"neg")+'" x="'+x+'" y="'+y+'" text-anchor="middle">'+s+'</text>'}
var SPH='<circle class="sph" cx="215" cy="62" r="42"/>';
var ARR=function(x1,y1,x2,y2){var dx=x2-x1,dy=y2-y1,L=Math.sqrt(dx*dx+dy*dy);dx/=L;dy/=L;var bx=x2-8*dx,by=y2-8*dy,px=-dy*4,py=dx*4,f=function(n){return n.toFixed(1)};return '<path class="arr" d="M'+f(x1)+' '+f(y1)+'L'+f(bx)+' '+f(by)+'"/><path d="M'+f(x2)+' '+f(y2)+'L'+f(bx+px)+' '+f(by+py)+'L'+f(bx-px)+' '+f(by-py)+'Z" class="ah"/>'};
var RAD=function(cx,cy,n,out){var h="";for(var k=0;k<n;k++){var a=k*2*Math.PI/n,c=Math.cos(a),s=Math.sin(a),i0=out?24:58,o0=out?58:24;h+=ARR(cx+i0*c,cy+i0*s,cx+o0*c,cy+o0*s)}return h};
window.FIG={
atrito:{a:"Lã e plástico: elétrons passam da lã para o plástico",s:'<rect class="sph" x="25" y="35" width="85" height="56" rx="12"/><rect class="sph" x="210" y="35" width="85" height="56" rx="12"/>'+S(48,70,"+")+S(68,70,"+")+S(88,70,"+")+S(233,70,"−")+S(253,70,"−")+S(273,70,"−")+'<path class="arr" d="M125 63H190"/><path d="M190 56L202 63L190 70Z" class="ah"/><text x="160" y="52" text-anchor="middle">e⁻</text><circle class="el" cx="125" cy="63" r="4"/><circle class="el" style="animation-delay:.6s" cx="125" cy="63" r="4"/><circle class="el" style="animation-delay:1.2s" cx="125" cy="63" r="4"/><text x="67" y="112" text-anchor="middle">lã</text><text x="252" y="112" text-anchor="middle">plástico</text>'},
contato:{a:"Duas esferas idênticas antes e depois do contato",s:'<circle class="sph" cx="40" cy="60" r="24"/><circle class="sph" cx="88" cy="60" r="24"/><text class="t pos" x="40" y="65" text-anchor="middle">+6</text><text class="t neg" x="88" y="65" text-anchor="middle">−2</text><path class="arr" d="M135 60H185"/><path d="M185 53L197 60L185 67Z" class="ah"/><circle class="sph" cx="245" cy="60" r="24"/><circle class="sph" cx="293" cy="60" r="24"/><text class="t pos" x="245" y="65" text-anchor="middle">?</text><text class="t pos" x="293" y="65" text-anchor="middle">?</text><text x="64" y="108" text-anchor="middle">antes (µC)</text><text x="269" y="108" text-anchor="middle">depois</text>'},
inducao:{a:"Bastão positivo perto de esfera metálica neutra, sem tocar",s:'<rect class="sph" x="15" y="48" width="100" height="28" rx="8"/>'+S(38,68,"+")+S(65,68,"+")+S(92,68,"+")+SPH+S(190,56,"−")+S(190,78,"−")+S(203,67,"−")+S(240,56,"+")+S(240,78,"+")+S(227,67,"+")+'<text x="65" y="102" text-anchor="middle">bastão +</text><circle class="el l" cx="238" cy="56" r="3.5"/><circle class="el l" style="animation-delay:.9s" cx="238" cy="76" r="3.5"/><text x="215" y="118" text-anchor="middle">esfera neutra</text>'},
terra:{a:"Indução com a esfera ligada à terra",s:'<rect class="sph" x="15" y="48" width="100" height="28" rx="8"/>'+S(38,68,"+")+S(65,68,"+")+S(92,68,"+")+SPH+S(190,56,"−")+S(190,78,"−")+S(203,67,"−")+'<path class="arr" d="M215 104V126"/><circle class="el u" cx="215" cy="124" r="4"/><circle class="el u" style="animation-delay:.9s" cx="215" cy="124" r="4"/><path d="M208 114L215 104L222 114Z" class="ah"/><path class="arr" d="M203 128H227M208 133H222M213 138H217"/><text x="228" y="118">e⁻ sobem</text><text x="65" y="102" text-anchor="middle">bastão +</text>'},
coulomb:{a:"Duas cargas positivas separadas pela distância d, com forças de repulsão F",s:'<circle class="sph" cx="95" cy="55" r="26"/><circle class="sph" cx="225" cy="55" r="26"/>'+S(95,62,"+")+S(225,62,"+")+'<path class="arr" d="M64 55H22"/><path d="M22 48L10 55L22 62Z" class="ah"/><path class="arr" d="M256 55H298"/><path d="M298 48L310 55L298 62Z" class="ah"/><text x="38" y="40">F</text><text x="274" y="40">F</text><path class="arr" d="M121 100H199"/><text x="160" y="118" text-anchor="middle">d</text>'},
eletroscopio:{a:"Bastão negativo perto do botão de um eletroscópio positivo",s:'<rect class="sph" x="15" y="18" width="95" height="26" rx="8"/>'+S(38,38,"−")+S(63,38,"−")+S(88,38,"−")+'<circle class="sph" cx="170" cy="31" r="11"/><path class="arr" d="M170 42V82M170 82L146 116M170 82L194 116"/>'+S(138,108,"+")+S(202,108,"+")+'<text x="62" y="62" text-anchor="middle">bastão −</text><text x="215" y="70">eletroscópio +</text>'},
campopos:{a:"Linhas de campo saindo de uma carga positiva",s:'<circle class="sph" cx="160" cy="68" r="17"/>'+S(160,74,"+")+RAD(160,68,8,true)},
camponeg:{a:"Linhas de campo chegando a uma carga negativa",s:'<circle class="sph" cx="160" cy="68" r="17"/>'+S(160,74,"−")+RAD(160,68,8,false)},
placas:{a:"Campo elétrico uniforme entre duas placas paralelas, da positiva para a negativa",s:'<rect class="sph" x="40" y="22" width="240" height="8"/><rect class="sph" x="40" y="108" width="240" height="8"/>'+S(80,16,"+")+S(160,16,"+")+S(240,16,"+")+S(80,134,"−")+S(160,134,"−")+S(240,134,"−")+ARR(80,36,80,102)+ARR(130,36,130,102)+ARR(190,36,190,102)+ARR(240,36,240,102)+'<text x="262" y="74">E</text>'},
equip:{a:"Carga positiva com superfícies equipotenciais circulares e linhas de campo radiais",s:'<circle class="arr" cx="160" cy="70" r="36" style="stroke-dasharray:5 4;stroke:var(--neg)"/><circle class="arr" cx="160" cy="70" r="58" style="stroke-dasharray:5 4;stroke:var(--neg)"/><circle class="sph" cx="160" cy="70" r="14"/>'+S(160,76,"+")+ARR(176,86,200,110)+ARR(144,86,120,110)+ARR(176,54,200,30)+ARR(144,54,120,30)+'<text x="222" y="72">equipotenciais</text>'},
dipolo:{a:"Carga positiva e carga negativa de mesmo módulo, com linhas de campo indo da positiva para a negativa",s:'<circle class="sph" cx="90" cy="70" r="24"/><circle class="sph" cx="236" cy="70" r="24"/>'+S(90,77,"+")+S(236,77,"−")+'<path class="arr" d="M112 56Q163 6 212 52"/><path class="ah" d="M213.0 57.0L203.4 54.0L209.6 47.5Z"/><path class="arr" d="M112 84Q163 134 212 88"/><path class="ah" d="M213.0 83.0L209.6 92.5L203.4 86.0Z"/><path class="arr" d="M116 70H198"/><path class="ah" d="M206.0 70.0L197.0 74.5L197.0 65.5Z"/>'},
pontas:{a:"Condutor carregado em formato de gota: poucas cargas na parte arredondada e muitas na ponta",s:'<path class="sph" d="M70 70C70 22 190 22 262 70C190 118 70 118 70 70Z"/>'+S(82,60,"+")+S(82,84,"+")+S(110,38,"+")+S(110,106,"+")+S(150,32,"+")+S(150,112,"+")+S(205,44,"+")+S(205,98,"+")+S(232,56,"+")+S(232,84,"+")+S(250,65,"+")+S(250,77,"+")+'<text x="262" y="40">ponta</text>'}
};
})();

/* Retratos ilustrados de cientistas (desenhos próprios, não são fotos). */
(function(){"use strict";
var SK="#f1c9a5",OUT="#2b2b2b",WIG="#e9e9ef",WS="#b9b9c6";
function CAP(c){return '<path d="M30 40Q27 13 50 11Q73 13 70 40Q66 27 58 25Q50 31 42 25Q34 27 30 40Z" fill="'+c+'"/>'}
function LOCKS(c){return '<path d="M30 40Q29 50 33 56L35 44ZM70 40Q71 50 67 56L65 44Z" fill="'+c+'"/>'}
function LONGB(c){return '<path d="M24 40Q19 74 28 86L42 72L58 72L72 86Q81 74 76 40Q74 12 50 10Q26 12 24 40Z" fill="'+c+'"/>'}
function WIGB(){return '<path d="M24 44Q20 74 30 82L44 70L56 70L70 82Q80 74 76 44Q74 12 50 12Q26 12 24 44Z" fill="#e9e9ef" stroke="#b9b9c6"/>'}
function WIGT(){var c='fill="#e9e9ef" stroke="#b9b9c6"';return '<path d="M28 40Q26 8 50 8Q74 8 72 40Q66 22 50 22Q34 22 28 40Z" '+c+'/>'+[[26,46],[25,56],[28,65],[74,46],[75,56],[72,65]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5.5" '+c+'/>'}).join("")}

function wig(){return {back:'<path d="M24 44Q20 74 30 82L44 70L56 70L70 82Q80 74 76 44Q74 14 50 14Q26 14 24 44Z" fill="'+WIG+'" stroke="'+WS+'"/>',top:'<path d="M30 38Q50 8 70 38Q60 24 50 26Q40 24 30 38Z" fill="'+WIG+'" stroke="'+WS+'"/><ellipse cx="27" cy="52" rx="6" ry="4" fill="'+WIG+'" stroke="'+WS+'"/><ellipse cx="73" cy="52" rx="6" ry="4" fill="'+WIG+'" stroke="'+WS+'"/>'}}
function bustB(cl,p){
  var sh='<path d="M10 100Q12 72 50 68Q88 72 90 100Z" fill="'+cl+'"/>';
  return (p.back||"")+sh+(p.pre||"")+'<rect x="43" y="54" width="14" height="18" fill="'+SK+'"/><ellipse cx="50" cy="40" rx="19" ry="23" fill="'+SK+'" stroke="#b98d68" stroke-width="1"/>'+
    '<circle cx="43" cy="39" r="1.9" fill="'+OUT+'"/><circle cx="57" cy="39" r="1.9" fill="'+OUT+'"/><path d="M39 34Q43 32 47 34M53 34Q57 32 61 34" stroke="'+OUT+'" stroke-width="1.2" fill="none"/><path d="M45 50Q50 53 55 50" stroke="#8a4b3a" stroke-width="1.4" fill="none"/>'+(p.top||"")+(p.front||"");
}
function bust(k){
  var w=wig();
  var P={
    tales:{c:"#c9b27c",p:{back:LONGB("#9b9b9b"),top:CAP("#9b9b9b")+'<path d="M30 28Q50 20 70 28" stroke="#c0392b" stroke-width="3" fill="none"/>',front:'<path d="M33 44Q35 72 50 74Q65 72 67 44Q60 58 50 58Q40 58 33 44Z" fill="#b5b5b5"/><path d="M42 49Q50 52 58 49" stroke="#b5b5b5" stroke-width="3" fill="none"/>'}},
    franklin:{c:"#3b4a6b",p:{back:LONGB("#cfcfd8"),top:CAP("#cfcfd8"),front:'<circle cx="43" cy="39" r="6" fill="none" stroke="#444" stroke-width="1.4"/><circle cx="57" cy="39" r="6" fill="none" stroke="#444" stroke-width="1.4"/><path d="M49 39H51" stroke="#444" stroke-width="1.4"/>'}},
    coulomb:{c:"#6b3b4a",p:{back:WIGB(),top:WIGT(),front:'<path d="M38 68L50 80L62 68Z" fill="#fff"/>'}},
    faraday:{c:"#2f2f2f",p:{back:'',top:CAP("#5a4a3a")+LOCKS("#5a4a3a"),front:'<path d="M38 68L50 80L62 68Z" fill="#fff"/><path d="M46 70L50 76L54 70Z" fill="#222"/>'}},
    volta:{c:"#7a3b3b",p:{back:LONGB("#4a3426"),top:CAP("#4a3426"),front:'<path d="M38 68L50 82L62 68Z" fill="#fff"/>'}},
  };
  return bustB(P[k].c,P[k].p);
}
window.AV=window.AV||{};["tales", "franklin", "coulomb", "faraday", "volta"].forEach(function(k){window.AV[k]=bust(k)});
var SYM={
tales:'<ellipse cx="240" cy="64" rx="22" ry="28" fill="#e0a21b" stroke="#8a6a00" stroke-width="2"/><ellipse cx="233" cy="54" rx="6" ry="9" fill="#fff" opacity=".45"/><path d="M200 112H290M212 112L222 96M230 112L236 98M262 112L254 98M276 112L268 94" stroke="#c9a44c" stroke-width="3"/>',
franklin:'<path d="M240 20L270 50L240 80L210 50Z" class="sph"/><path d="M240 20V80M210 50H270" stroke="currentColor" stroke-width="1.5"/><path d="M240 80Q226 96 236 108T230 124" stroke="currentColor" stroke-width="2" fill="none"/><path d="M286 12L272 38H284L270 64" stroke="#f5b700" stroke-width="3" fill="none"/><circle cx="230" cy="124" r="4" fill="#c9a44c" stroke="#8a6a00"/>',
coulomb:'<path d="M240 8V56" stroke="currentColor" stroke-width="2"/><path d="M204 62H276" stroke="currentColor" stroke-width="3"/><circle cx="204" cy="62" r="9" class="sph"/><circle cx="276" cy="62" r="9" fill="#d33" stroke="#7a1a1a" stroke-width="1.5"/><circle cx="276" cy="106" r="9" fill="#d33" stroke="#7a1a1a" stroke-width="1.5"/><path d="M276 71V97" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>',
faraday:'<rect x="214" y="48" width="70" height="34" rx="4" class="sph"/><path d="M222 48V82M234 48V82M246 48V82M258 48V82M270 48V82" stroke="#b86b2a" stroke-width="3"/><path d="M214 65H196M284 65H302" stroke="currentColor" stroke-width="2"/><path d="M196 65V108H302V65" stroke="currentColor" stroke-width="2" fill="none"/><rect x="236" y="16" width="26" height="14" fill="#d33"/><rect x="262" y="16" width="26" height="14" fill="#2c7fb8"/>',
volta:'<rect x="224" y="20" width="54" height="12" rx="2" fill="#c9c9d0" stroke="currentColor"/><rect x="224" y="34" width="54" height="12" rx="2" fill="#c98a4a" stroke="currentColor"/><rect x="224" y="48" width="54" height="12" rx="2" fill="#c9c9d0" stroke="currentColor"/><rect x="224" y="62" width="54" height="12" rx="2" fill="#c98a4a" stroke="currentColor"/><rect x="224" y="76" width="54" height="12" rx="2" fill="#c9c9d0" stroke="currentColor"/><rect x="224" y="90" width="54" height="12" rx="2" fill="#c98a4a" stroke="currentColor"/><path d="M224 106H196V60M278 106H300V60" stroke="currentColor" stroke-width="2" fill="none"/>'
};
function ret(k,al){return {a:al,s:'<g transform="translate(40,4) scale(1.3)">'+bust(k)+'</g>'+SYM[k]}}
window.FIG=window.FIG||{};
window.FIG.ret_tales=ret("tales","Retrato ilustrado de um sábio grego da Antiguidade, de barba grisalha, ao lado de uma peça de âmbar e palhas");
window.FIG.ret_franklin=ret("franklin","Retrato ilustrado de um cientista americano do século XVIII, de óculos, ao lado de uma pipa com uma chave e um raio");
window.FIG.ret_coulomb=ret("coulomb","Retrato ilustrado de um físico francês do século XVIII, de peruca branca, ao lado de uma balança de torção com esferas carregadas");
window.FIG.ret_faraday=ret("faraday","Retrato ilustrado de um cientista inglês do século XIX, ao lado de uma bobina de fio e ímãs");
window.FIG.ret_volta=ret("volta","Retrato ilustrado de um físico italiano do século XVIII, ao lado de uma pilha de discos metálicos");
})();
