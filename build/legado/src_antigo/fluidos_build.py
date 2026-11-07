import json,sys,os
sys.path.insert(0,os.path.dirname(__file__))
from fluidos_q import F as F1
from fluidos_q2 import F2
F=F1+F2
OUT='/home/claude/quiz/app/'
TN={"de":"Densidade e massa específica","pr":"Pressão","pa":"Pressão atmosférica","em":"Empuxo e Arquimedes","pp":"Princípio de Pascal e prensa","to":"Experimento de Torricelli","cs":"Cientistas e história"}
def bank():
    B=[]
    for n,(t,q,o,a,h,e,x) in enumerate(F):
        d={"id":"f%03d"%(n+1),"t":t,"q":q,"o":o,"a":a,"h":h,"e":e}; d.update(x); B.append(d)
    ids=[d['id'] for d in B]; assert len(set(ids))==len(ids)
    return B
def write_bank(B):
    js=json.dumps(B,ensure_ascii=False).replace('},{"id"','},\n{"id"')
    open(OUT+'perguntas-fluidos.js','w',encoding='utf-8').write('/* Banco de perguntas: Mecânica dos Fluidos. Mesmos campos do banco de Eletrostática. */\nwindow.BANKS=window.BANKS||{};\nwindow.BANKS.fluidos='+js+';\n')

FIGS=r'''/* Figuras (SVG) de Mecânica dos Fluidos e retratos ilustrados dos cientistas (desenhos próprios, não são fotos). */
(function(){"use strict";
var SK="#f1c9a5",OUT="#2b2b2b";
function bust(k){
  var cl={arquimedes:"#c9b27c",pascal:"#3b4a6b",torricelli:"#7a3b3b",stevin:"#2f2f2f"}[k];
  var back="",front="",top="";
  if(k==="arquimedes"){front='<path d="M33 44Q35 72 50 74Q65 72 67 44Q60 58 50 58Q40 58 33 44Z" fill="#ececec"/><ellipse cx="32" cy="36" rx="4" ry="9" fill="#ececec"/><ellipse cx="68" cy="36" rx="4" ry="9" fill="#ececec"/><path d="M42 49Q50 52 58 49" stroke="#ececec" stroke-width="3" fill="none"/>'}
  if(k==="pascal"){back='<path d="M25 40Q22 70 30 80L42 66L58 66L70 80Q78 70 75 40Q73 16 50 16Q27 16 25 40Z" fill="#5a3a22"/>';top='<path d="M31 36Q50 10 69 36Q60 24 50 24Q40 24 31 36Z" fill="#5a3a22"/>';front='<path d="M38 68L50 82L62 68Z" fill="#fff"/>'}
  if(k==="torricelli"){back='<path d="M28 36Q26 62 30 70L42 62L58 62L70 70Q74 62 72 36Q70 16 50 16Q30 16 28 36Z" fill="#3b2a1d"/>';top='<path d="M31 34Q50 12 69 34Q58 28 50 30Q42 28 31 34Z" fill="#3b2a1d"/>';front='<path d="M41 49Q50 46 59 49Q50 52 41 49Z" fill="#3b2a1d"/><path d="M38 68L50 80L62 68Z" fill="#fff"/>'}
  if(k==="stevin"){back='';top='<ellipse cx="50" cy="22" rx="30" ry="6" fill="#222"/><path d="M36 22Q38 4 50 4Q62 4 64 22Z" fill="#222"/>';front='<path d="M44 50Q50 62 56 50Q50 54 44 50Z" fill="#6b4a2b"/><ellipse cx="50" cy="70" rx="17" ry="6" fill="#fff" stroke="#ccc"/>'}
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
'''
def write_figs():
    open(OUT+'figuras-fluidos.js','w',encoding='utf-8').write(FIGS)

GQ=r'''function(GQ,Rn,fc,sc,sup){return [
GQ("de","massa específica","Use μ = m / V.",function(){var m=Rn([200,300,450,600,900]),V=Rn([100,150,200,300]),r=m/V;return {q:"Um bloco maciço tem massa de "+m+" g e volume de "+V+" cm³. Qual é a massa específica do material, em g/cm³?",ans:r,u:"g/cm³",at:fc(r)+" g/cm³",e:"μ = m / V = "+m+" / "+V+" = "+fc(r)+" g/cm³."}}),
GQ("de","massa de um líquido","Converta litros em m³ (1 L = 10⁻³ m³) e use m = μ·V.",function(){var mu=Rn([800,900,1000,1200,1360]),L=Rn([2,5,10,20]),m=mu*L/1000;return {q:"Qual é a massa de "+L+" litros de um líquido de massa específica "+mu+" kg/m³, em kg?",ans:m,u:"kg",at:fc(m)+" kg",e:"V = "+L+" L = "+fc(L/1000)+" m³. m = μ·V = "+mu+" × "+fc(L/1000)+" = "+fc(m)+" kg."}}),
GQ("pr","pressão de uma força","Use p = F / A.",function(){var F=Rn([100,300,500,800,1200]),A=Rn([0.1,0.2,0.5,2]),p=F/A;return {q:"Uma força de "+F+" N age perpendicularmente sobre uma área de "+fc(A)+" m². Qual é a pressão, em Pa?",ans:p,u:"Pa",at:sc(p)+" Pa",e:"p = F / A = "+F+" / "+fc(A)+" = "+sc(p)+" Pa."}}),
GQ("pr","pressão da coluna de água","Use p = μ·g·h, com μ = 1000 kg/m³ e g = 10 m/s².",function(){var h=Rn([2,3,5,8,12]),p=1000*10*h;return {q:"Qual é a pressão exercida pela água a "+h+" m de profundidade, sem contar a pressão atmosférica, em Pa? (μ = 1000 kg/m³ e g = 10 m/s²)",ans:p,u:"Pa",at:sc(p)+" Pa",e:"p = μ·g·h = 1000 × 10 × "+h+" = "+sc(p)+" Pa."}}),
GQ("em","empuxo","Use E = μ·g·V, com V em m³ (1 L = 10⁻³ m³).",function(){var V=Rn([2,5,10,20,50]),mu=Rn([1000,1000,800,1200]),E=mu*10*V/1000;return {q:"Um corpo de "+V+" litros está totalmente imerso em um líquido de massa específica "+mu+" kg/m³. Qual é o empuxo sobre ele, em N? (g = 10 m/s²)",ans:E,u:"N",at:fc(E)+" N",e:"V = "+fc(V/1000)+" m³. E = μ·g·V = "+mu+" × 10 × "+fc(V/1000)+" = "+fc(E)+" N."}}),
GQ("pp","prensa hidráulica","Use F₁/A₁ = F₂/A₂.",function(){var A1=Rn([2,4,5,10]),k=Rn([5,10,20,25]),F1=Rn([20,40,50,100]),F2=F1*k;return {q:"Os êmbolos de uma prensa hidráulica têm áreas de "+A1+" cm² e "+(A1*k)+" cm². Qual é a força no êmbolo maior, em N, quando se aplica "+F1+" N no menor?",ans:F2,u:"N",at:fc(F2)+" N",e:"F₂ = F₁ · A₂ / A₁ = "+F1+" × "+(A1*k)+" / "+A1+" = "+fc(F2)+" N."}}),
GQ("to","pressão da coluna de mercúrio","Use p = μ·g·h, com h em metros.",function(){var h=Rn([0.70,0.72,0.74,0.76]),p=13600*10*h;return {q:"Qual é a pressão exercida por uma coluna de mercúrio de "+fc(h)+" m de altura, em Pa? (μ = 13 600 kg/m³ e g = 10 m/s²)",ans:p,u:"Pa",at:sc(p)+" Pa",e:"p = μ·g·h = 13 600 × 10 × "+fc(h)+" = "+sc(p)+" Pa."}})
];}'''
CARDS=[["Massa específica","μ = m / V. Unidade no SI: kg/m³. Vale 1 g/cm³ = 1000 kg/m³."],["Densidade","d = m / V do corpo inteiro. Só coincide com a massa específica se o corpo for maciço e homogêneo."],["Pressão","p = F / A, com F perpendicular à superfície. Unidade: pascal (Pa = N/m²)."],["Pressão e área","Com a mesma força, menor área significa maior pressão."],["Teorema de Stevin","p = p₀ + μ·g·h: em um líquido em repouso, a pressão aumenta com a profundidade."],["Mesmo nível","Em um mesmo líquido em repouso, pontos na mesma profundidade têm a mesma pressão."],["Pressão atmosférica","É o peso da coluna de ar. Ao nível do mar, 1 atm ≈ 1,0 × 10⁵ Pa."],["Altitude","Quanto maior a altitude, menor a pressão atmosférica."],["Experimento de Torricelli","Tubo com mercúrio emborcado em uma cuba: a coluna para em cerca de 76 cm."],["Equivalências","1 atm = 76 cmHg = 760 mmHg ≈ 1,0 × 10⁵ Pa."],["Vácuo de Torricelli","É o espaço acima do mercúrio no tubo, praticamente vazio."],["Por que mercúrio?","Ele é muito denso (13,6 g/cm³). Com água, a coluna teria cerca de 10 m."],["Princípio de Arquimedes","Todo corpo mergulhado em um fluido recebe um empuxo vertical, para cima, igual ao peso do fluido deslocado: E = μ·g·V."],["Flutua ou afunda?","Se o peso é maior que o empuxo máximo, o corpo afunda. Se a densidade é menor que a do fluido, ele flutua."],["Peso aparente","P aparente = P − E. Por isso nos sentimos mais leves na água."],["Princípio de Pascal","O acréscimo de pressão em um ponto de um líquido em equilíbrio se transmite integralmente a todos os pontos."],["Prensa hidráulica","F₁/A₁ = F₂/A₂. A força é multiplicada, mas o êmbolo menor percorre uma distância maior."],["Valores úteis","g = 10 m/s². Massa específica da água: 1000 kg/m³."],
["Evangelista Torricelli (1608–1647)","Físico italiano, discípulo de Galileu. Realizou o experimento que mostrou a pressão atmosférica e inventou o barômetro de mercúrio.","torricelli"],["Blaise Pascal (1623–1662)","Físico e matemático francês. Estudou a pressão nos fluidos, e a unidade de pressão do SI leva o nome dele.","pascal"],["Arquimedes (cerca de 287–212 a.C.)","Sábio grego de Siracusa. Formulou o princípio do empuxo: o corpo imerso recebe uma força para cima igual ao peso do fluido deslocado.","arquimedes"],["Simon Stevin (1548–1620)","Cientista flamengo. Mostrou que a pressão em um líquido aumenta com a profundidade (teorema de Stevin).","stevin"]]
RESUMO='<summary>Resumo rápido (ideias e fórmulas)</summary><p><b>Massa específica:</b> μ = m / V. A densidade do corpo considera o volume total, inclusive partes ocas.</p><p><b>Pressão:</b> p = F / A, em pascal (Pa).</p><p><b>Stevin:</b> p = p₀ + μ·g·h. A pressão cresce com a profundidade.</p><p><b>Atmosfera:</b> 1 atm ≈ 1,0 × 10⁵ Pa = 76 cmHg = 760 mmHg.</p><p><b>Empuxo:</b> E = μ·g·V (peso do fluido deslocado). P aparente = P − E.</p><p><b>Pascal:</b> a pressão se transmite integralmente. Prensa: F₁/A₁ = F₂/A₂.</p><p><b>Torricelli:</b> a coluna de mercúrio equilibra a pressão atmosférica e tem cerca de 76 cm ao nível do mar.</p><p>Nos cálculos, use g = 10 m/s² e μ da água = 1000 kg/m³.</p>'
def quiz_js(id,nome,subt,prefix,areas,cards,resumo,gq,msgs,tempoDesc,semCalculo,tempoCalc):
    j=lambda x:json.dumps(x,ensure_ascii=False)
    return ('/* Configuração do quiz "%s". */\nwindow.QUIZZES=window.QUIZZES||{};\nwindow.QUIZZES.%s={id:%s,nome:%s,subt:%s,prefix:%s,areas:%s,cards:%s,resumo:%s,msgs:%s,tempoDesc:%s,semCalculo:%s,tempoCalc:%s,gq:%s};\n'
        %(nome,id,j(id),j(nome),j(subt),j(prefix),j(areas),j(cards),j(resumo),j(msgs),j(tempoDesc),'true' if semCalculo else 'false',tempoCalc,gq))
def write_quiz():
    open(OUT+'quiz-fluidos.js','w',encoding='utf-8').write(quiz_js("fluidos","Mecânica dos Fluidos","Densidade, pressão, empuxo, Pascal e Torricelli.","fluidos:",TN,CARDS,RESUMO,GQ,
      ["Perfeito! Você domina densidade, pressão, empuxo e Torricelli.","Muito bem! Revise só os pontos que errou.","Bom começo. Vale rever a relação entre pressão, força e área.","Revise os conceitos básicos e tente de novo. Você chega lá!"],
      "30 s por pergunta (60 s nos cálculos), com ranking",False,60))
    B=open('/home/claude/quiz/build/src/eletro_cards.txt',encoding='utf-8').read()
def run():
    B=bank(); write_bank(B); write_figs(); write_quiz(); print('fluidos',len(B))
if __name__=='__main__': run()
