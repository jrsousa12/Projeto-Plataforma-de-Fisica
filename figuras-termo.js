/* Figuras (SVG) de Termologia. */
(function(){"use strict";
window.FIG=window.FIG||{};
window.FIG.escalas={a:"Três termômetros lado a lado. A água congela a 0 graus Celsius, 32 Fahrenheit e 273 Kelvin, e ferve a 100 Celsius, 212 Fahrenheit e 373 Kelvin",s:'<text x="60" y="14" text-anchor="middle">Celsius</text><text x="160" y="14" text-anchor="middle">Fahrenheit</text><text x="260" y="14" text-anchor="middle">Kelvin</text><rect x="50" y="22" width="20" height="96" rx="8" class="sph"/><rect x="150" y="22" width="20" height="96" rx="8" class="sph"/><rect x="250" y="22" width="20" height="96" rx="8" class="sph"/><path d="M40 30H80M140 30H180M240 30H280M40 110H80M140 110H180M240 110H280" stroke="currentColor" stroke-width="2"/><text x="84" y="34">100 °C</text><text x="84" y="114">0 °C</text><text x="184" y="34">212 °F</text><text x="184" y="114">32 °F</text><text x="284" y="34" text-anchor="start" font-size="10">373 K</text><text x="284" y="114" font-size="10">273 K</text>'};
window.FIG.curva={a:"Gráfico de aquecimento da água: a temperatura sobe, para em 0 graus durante a fusão, sobe de novo, para em 100 graus durante a ebulição e depois sobe como vapor",s:'<path d="M40 10V120H300" fill="none" stroke="currentColor" stroke-width="2"/><path d="M44 110L80 90H110L150 62H190L220 30H280" fill="none" stroke="#d94f1a" stroke-width="3"/><path d="M44 118V12" stroke="none"/><text x="14" y="16" font-size="10">T</text><text x="296" y="134" font-size="10">Q</text><text x="96" y="86" text-anchor="middle" font-size="10">fusão</text><text x="172" y="58" text-anchor="middle" font-size="10">ebulição</text><text x="60" y="133" font-size="9" text-anchor="middle">gelo</text><text x="130" y="76" font-size="9" text-anchor="middle" opacity="0">água</text><text x="240" y="26" font-size="9" text-anchor="middle">vapor</text><path d="M40 90H80M40 62H150" stroke="currentColor" stroke-dasharray="3 3" stroke-width="1"/><text x="36" y="94" font-size="9" text-anchor="end">0 °C</text><text x="36" y="66" font-size="9" text-anchor="end">100 °C</text>'};
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
    celsius:{c:"#3b4a6b",p:{back:WIGB(),top:WIGT(),front:'<path d="M38 68L50 82L62 68Z" fill="#fff"/>'}},
    fahrenheit:{c:"#5a3a22",p:{back:WIGB(),top:WIGT(),front:'<path d="M38 68L50 82L62 68Z" fill="#fff"/>'}},
    kelvin:{c:"#2f2f2f",p:{back:'<path d="M26 40Q24 62 30 66L40 56L60 56L70 66Q76 62 74 40Q72 12 50 10Q28 12 26 40Z" fill="#d8d8d8"/>',top:CAP("#d8d8d8")+LOCKS("#d8d8d8"),front:'<path d="M32 44Q34 78 50 80Q66 78 68 44Q60 62 50 62Q40 62 32 44Z" fill="#ececec"/><path d="M42 49Q50 52 58 49" stroke="#ececec" stroke-width="3" fill="none"/>'}},
    joule:{c:"#4a4a55",p:{back:'',top:CAP("#6b4a2b")+LOCKS("#6b4a2b"),front:'<path d="M38 68L50 76L62 68L62 74L50 80L38 74Z" fill="#fff"/><path d="M44 72L56 72L50 78Z" fill="#222"/>'}},
    black:{c:"#7a3b3b",p:{back:WIGB(),top:WIGT(),front:'<path d="M38 68L50 82L62 68Z" fill="#fff"/>'}},
  };
  return bustB(P[k].c,P[k].p);
}
window.AV=window.AV||{};["celsius", "fahrenheit", "kelvin", "joule", "black"].forEach(function(k){window.AV[k]=bust(k)});
var SYM={
celsius:'<rect x="236" y="14" width="18" height="100" rx="9" class="sph"/><circle cx="245" cy="116" r="12" fill="#d33" stroke="currentColor"/><rect x="242" y="44" width="6" height="72" fill="#d33"/><path d="M226 24H264M226 104H264" stroke="currentColor" stroke-width="2"/><text x="270" y="28">100 °C</text><text x="270" y="108">0 °C</text>',
fahrenheit:'<rect x="236" y="14" width="18" height="100" rx="9" class="sph"/><circle cx="245" cy="116" r="12" fill="#9aa4ad" stroke="currentColor"/><rect x="242" y="44" width="6" height="72" fill="#9aa4ad"/><path d="M226 24H264M226 104H264" stroke="currentColor" stroke-width="2"/><text x="270" y="28">212 °F</text><text x="270" y="108">32 °F</text>',
kelvin:'<rect x="236" y="14" width="18" height="100" rx="9" class="sph"/><circle cx="245" cy="116" r="12" fill="#2c7fb8" stroke="currentColor"/><rect x="242" y="84" width="6" height="32" fill="#2c7fb8"/><path d="M226 24H264M226 104H264" stroke="currentColor" stroke-width="2"/><text x="270" y="28">373 K</text><text x="270" y="108">0 K</text>',
joule:'<rect x="204" y="64" width="70" height="52" class="sph"/><rect x="206" y="78" width="66" height="36" fill="#7fc0e8" opacity=".75"/><path d="M239 40V100M221 100H257M227 88L251 112M251 88L227 112" stroke="currentColor" stroke-width="3"/><path d="M239 40H292V82" stroke="currentColor" stroke-width="2" fill="none"/><rect x="282" y="82" width="20" height="22" fill="#8d8d8d" stroke="currentColor"/>',
black:'<rect x="204" y="52" width="70" height="64" class="sph"/><rect x="206" y="84" width="66" height="30" fill="#7fc0e8" opacity=".75"/><rect x="222" y="66" width="22" height="22" rx="3" fill="#d7eefb" stroke="#2c7fb8" stroke-width="2"/><path d="M290 112C278 98 292 90 288 74C300 84 306 100 298 112Z" fill="#f08a24" stroke="#a85a10"/>'
};
function ret(k,al){return {a:al,s:'<g transform="translate(40,4) scale(1.3)">'+bust(k)+'</g>'+SYM[k]}}
window.FIG=window.FIG||{};
window.FIG.ret_celsius=ret("celsius","Retrato ilustrado de um astrônomo sueco do século XVIII, de peruca branca, ao lado de um termômetro marcando 0 e 100 graus");
window.FIG.ret_fahrenheit=ret("fahrenheit","Retrato ilustrado de um físico e fabricante de instrumentos do século XVIII, de peruca, ao lado de um termômetro marcando 32 e 212 graus");
window.FIG.ret_kelvin=ret("kelvin","Retrato ilustrado de um cientista britânico do século XIX, de barba branca, ao lado de um termômetro marcando 0 e 373 kelvins");
window.FIG.ret_joule=ret("joule","Retrato ilustrado de um físico inglês do século XIX, de costeletas, ao lado de um recipiente com água, uma pá giratória e um peso");
window.FIG.ret_black=ret("black","Retrato ilustrado de um químico escocês do século XVIII, de peruca, ao lado de um recipiente com gelo derretendo sobre uma chama");
})();
