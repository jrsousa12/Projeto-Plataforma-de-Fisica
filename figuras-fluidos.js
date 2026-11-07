/* Figuras (SVG) de Mecânica dos Fluidos e retratos ilustrados dos cientistas (desenhos próprios, não são fotos). */
(function(){"use strict";
var SK="#f1c9a5",OUT="#2b2b2b";
function CAP(c){return '<path d="M30 40Q27 13 50 11Q73 13 70 40Q66 27 58 25Q50 31 42 25Q34 27 30 40Z" fill="'+c+'"/>'}
function LOCKS(c){return '<path d="M30 40Q29 50 33 56L35 44ZM70 40Q71 50 67 56L65 44Z" fill="'+c+'"/>'}
function LONGB(c){return '<path d="M24 40Q19 74 28 86L42 72L58 72L72 86Q81 74 76 40Q74 12 50 10Q26 12 24 40Z" fill="'+c+'"/>'}
function bust(k){
  var cl={arquimedes:"#c9b27c",pascal:"#3b4a6b",torricelli:"#7a3b3b",stevin:"#2f2f2f"}[k];
  var back="",front="",top="";
  if(k==="arquimedes"){back=LONGB("#9a9a9a");top=CAP("#9a9a9a");front='<path d="M33 44Q35 72 50 74Q65 72 67 44Q60 58 50 58Q40 58 33 44Z" fill="#ececec"/><ellipse cx="32" cy="36" rx="4" ry="9" fill="#ececec"/><ellipse cx="68" cy="36" rx="4" ry="9" fill="#ececec"/><path d="M42 49Q50 52 58 49" stroke="#ececec" stroke-width="3" fill="none"/>'}
  if(k==="pascal"){back=LONGB("#5a3a22");top=CAP("#5a3a22");front='<path d="M38 68L50 82L62 68Z" fill="#fff"/>'}
  if(k==="torricelli"){back=LONGB("#3b2a1d");top=CAP("#3b2a1d");front='<path d="M41 49Q50 46 59 49Q50 52 41 49Z" fill="#3b2a1d"/><path d="M38 68L50 80L62 68Z" fill="#fff"/>'}
  if(k==="stevin"){back='';top=LOCKS("#4a3426")+'<path d="M32 27Q50 19 68 27Q60 31 50 29Q40 31 32 27Z" fill="#4a3426"/><ellipse cx="50" cy="22" rx="30" ry="6" fill="#222"/><path d="M36 22Q38 4 50 4Q62 4 64 22Z" fill="#222"/>';front='<path d="M44 50Q50 62 56 50Q50 54 44 50Z" fill="#6b4a2b"/><ellipse cx="50" cy="70" rx="17" ry="6" fill="#fff" stroke="#ccc"/>'}
  var sh='<path d="M10 100Q12 72 50 68Q88 72 90 100Z" fill="'+cl+'"/>';
  return back+sh+'<rect x="43" y="54" width="14" height="18" fill="'+SK+'"/><ellipse cx="50" cy="40" rx="19" ry="23" fill="'+SK+'" stroke="#b98d68" stroke-width="1"/>'+
    '<circle cx="43" cy="39" r="1.9" fill="'+OUT+'"/><circle cx="57" cy="39" r="1.9" fill="'+OUT+'"/><path d="M39 34Q43 32 47 34M53 34Q57 32 61 34" stroke="'+OUT+'" stroke-width="1.2" fill="none"/><path d="M45 50Q50 53 55 50" stroke="#8a4b3a" stroke-width="1.4" fill="none"/>'+top+front;
}
window.AV={};["arquimedes","pascal","torricelli","stevin"].forEach(function(k){window.AV[k]=bust(k)});
var SYM={
arquimedes:'<path d="M205 70L215 40L230 60L245 36L260 60L275 40L285 70Z" fill="#f5b700" stroke="#8a6a00" stroke-width="2"/><rect x="205" y="70" width="80" height="10" fill="#f5b700" stroke="#8a6a00" stroke-width="2"/><path d="M195 100Q215 90 235 100T275 100T315 100" stroke="#2c7fb8" stroke-width="3" fill="none"/>',
pascal:'<rect x="205" y="60" width="90" height="32" rx="3" class="sph"/><rect x="190" y="70" width="18" height="12" class="sph"/><rect x="270" y="56" width="6" height="40" fill="#2c7fb8"/><path d="M230 76H255" stroke="#2c7fb8" stroke-width="3"/>',
torricelli:'<rect x="235" y="14" width="16" height="96" class="sph"/><rect x="237" y="46" width="12" height="62" fill="#9aa4ad"/><path d="M200 112H290" stroke="#2c7fb8" stroke-width="3"/>',
stevin:'<rect x="215" y="24" width="64" height="86" class="sph"/><rect x="217" y="56" width="60" height="52" fill="#7fc0e8"/><path d="M296 56V108" stroke="currentColor" stroke-width="2"/><path d="M296 56l-4 8h8z M296 108l-4-8h8z" fill="currentColor"/>'
};
function ret(k,al){return {a:al,s:'<g transform="translate(40,4) scale(1.3)">'+bust(k)+'</g>'+SYM[k]}}
window.FIG=window.FIG||{};
var N={
ret_torricelli:ret("torricelli","Retrato ilustrado de um físico italiano do século XVII, ao lado de um tubo de vidro com mercúrio"),
ret_pascal:ret("pascal","Retrato ilustrado de um cientista francês do século XVII, ao lado de uma seringa com êmbolo"),
ret_arquimedes:ret("arquimedes","Retrato ilustrado de um sábio grego da Antiguidade, de barba branca, ao lado de uma coroa sobre a água"),
ret_stevin:ret("stevin","Retrato ilustrado de um cientista flamengo de chapéu, ao lado de um recipiente com líquido"),
torricelli:{a:"Tubo de vidro cheio de mercúrio, emborcado em uma cuba com mercúrio. A coluna tem 76 cm e o espaço acima dela é vácuo",s:'<rect x="60" y="100" width="150" height="30" class="sph"/><rect x="62" y="108" width="146" height="20" fill="#9aa4ad"/><rect x="120" y="8" width="22" height="116" class="sph"/><rect x="122" y="52" width="18" height="72" fill="#9aa4ad"/><text x="112" y="24" text-anchor="end">vácuo</text><path d="M114 22L119 22" stroke="currentColor" stroke-width="1.5"/><path d="M160 52V124" stroke="currentColor" stroke-width="2"/><path d="M160 52l-4 8h8zM160 124l-4-8h8z" fill="currentColor"/><text x="170" y="92">76 cm</text><text x="224" y="100">mercúrio</text><path d="M236 106l-20 14" stroke="currentColor" stroke-width="1.5"/><path d="M60 80H88M60 70L88 70" stroke="#2c7fb8" stroke-width="2" opacity="0"/><text x="270" y="30" text-anchor="middle">p atm</text><path d="M270 36V76M262 68L270 78L278 68" stroke="currentColor" stroke-width="2" fill="none"/>'},
hidro:{a:"Recipiente com líquido em repouso. Um ponto a uma profundidade h abaixo da superfície, onde atua a pressão do líquido",s:'<rect x="70" y="20" width="180" height="104" class="sph"/><rect x="72" y="44" width="176" height="78" fill="#7fc0e8" opacity=".75"/><path d="M72 44H248" stroke="#2c7fb8" stroke-width="2"/><circle cx="160" cy="98" r="5" fill="#d33"/><text x="172" y="102">ponto</text><path d="M100 44V98" stroke="currentColor" stroke-width="2"/><path d="M100 44l-4 8h8zM100 98l-4-8h8z" fill="currentColor"/><text x="108" y="76">h</text><text x="160" y="36" text-anchor="middle">superfície</text>'},
empuxo:{a:"Bloco parcialmente imerso na água. O peso age para baixo e o empuxo age para cima",s:'<rect x="40" y="62" width="240" height="68" fill="#7fc0e8" opacity=".75"/><path d="M40 62H280" stroke="#2c7fb8" stroke-width="2"/><rect x="130" y="34" width="60" height="50" class="sph"/><text x="160" y="63" text-anchor="middle">corpo</text><path d="M160 84V128M160 128l-5-9h10z" stroke="#2e9e5b" stroke-width="3" fill="#2e9e5b"/><text x="170" y="118">peso</text><path d="M160 34V8M160 8l-5 9h10z" stroke="#d33" stroke-width="3" fill="#d33"/><text x="170" y="22">empuxo</text>'},
prensa:{a:"Prensa hidráulica: dois êmbolos de áreas diferentes ligados por um líquido. Uma força pequena no êmbolo menor equilibra uma força grande no maior",s:'<path d="M50 70V120H270V70" fill="none" stroke="currentColor" stroke-width="3"/><rect x="52" y="90" width="216" height="28" fill="#7fc0e8" opacity=".75"/><rect x="70" y="80" width="40" height="10" class="sph"/><rect x="200" y="80" width="64" height="10" class="sph"/><path d="M90 40V76M90 76l-4-8h8z" stroke="#d33" stroke-width="3" fill="#d33"/><text x="90" y="32" text-anchor="middle">F₁ (pequena)</text><path d="M232 34V76M232 76l-4-8h8z" stroke="#d33" stroke-width="4" fill="#d33"/><text x="232" y="26" text-anchor="middle">F₂ (grande)</text><text x="90" y="134" text-anchor="middle">A₁</text><text x="232" y="134" text-anchor="middle">A₂</text>'},
pressao_area:{a:"Dois blocos iguais com o mesmo peso: um apoiado em uma base larga e outro em uma base estreita",s:'<rect x="30" y="30" width="100" height="60" class="sph"/><text x="80" y="64" text-anchor="middle">mesmo peso</text><rect x="20" y="90" width="120" height="6" fill="#6b6b6b"/><text x="80" y="116" text-anchor="middle">área grande</text><rect x="190" y="30" width="100" height="60" class="sph"/><text x="240" y="64" text-anchor="middle">mesmo peso</text><rect x="228" y="90" width="24" height="6" fill="#6b6b6b"/><text x="240" y="116" text-anchor="middle">área pequena</text>'}
};
Object.keys(N).forEach(function(k){window.FIG[k]=N[k]});
})();
