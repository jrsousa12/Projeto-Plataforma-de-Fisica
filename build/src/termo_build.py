import json,sys,os
sys.path.insert(0,os.path.dirname(__file__))
from termo_q import T
import fluidos_build as FB
OUT='/home/claude/quiz/app/'
TN={"tm":"Temperatura e escalas","dl":"Dilatação térmica","cl":"Calorimetria","me":"Mudanças de estado","pc":"Propagação do calor"}
def bank():
    B=[]
    for n,(t,q,o,a,h,e,x) in enumerate(T):
        d={"id":"t%03d"%(n+1),"t":t,"q":q,"o":o,"a":a,"h":h,"e":e}; d.update(x); B.append(d)
    return B
FIGS=r'''/* Figuras (SVG) de Termologia. */
(function(){"use strict";
window.FIG=window.FIG||{};
window.FIG.escalas={a:"Três termômetros lado a lado. A água congela a 0 graus Celsius, 32 Fahrenheit e 273 Kelvin, e ferve a 100 Celsius, 212 Fahrenheit e 373 Kelvin",s:'<text x="60" y="14" text-anchor="middle">Celsius</text><text x="160" y="14" text-anchor="middle">Fahrenheit</text><text x="260" y="14" text-anchor="middle">Kelvin</text><rect x="50" y="22" width="20" height="96" rx="8" class="sph"/><rect x="150" y="22" width="20" height="96" rx="8" class="sph"/><rect x="250" y="22" width="20" height="96" rx="8" class="sph"/><path d="M40 30H80M140 30H180M240 30H280M40 110H80M140 110H180M240 110H280" stroke="currentColor" stroke-width="2"/><text x="84" y="34">100 °C</text><text x="84" y="114">0 °C</text><text x="184" y="34">212 °F</text><text x="184" y="114">32 °F</text><text x="284" y="34" text-anchor="start" font-size="10">373 K</text><text x="284" y="114" font-size="10">273 K</text>'};
window.FIG.curva={a:"Gráfico de aquecimento da água: a temperatura sobe, para em 0 graus durante a fusão, sobe de novo, para em 100 graus durante a ebulição e depois sobe como vapor",s:'<path d="M40 10V120H300" fill="none" stroke="currentColor" stroke-width="2"/><path d="M44 110L80 90H110L150 62H190L220 30H280" fill="none" stroke="#d94f1a" stroke-width="3"/><path d="M44 118V12" stroke="none"/><text x="14" y="16" font-size="10">T</text><text x="296" y="134" font-size="10">Q</text><text x="96" y="86" text-anchor="middle" font-size="10">fusão</text><text x="172" y="58" text-anchor="middle" font-size="10">ebulição</text><text x="60" y="133" font-size="9" text-anchor="middle">gelo</text><text x="130" y="76" font-size="9" text-anchor="middle" opacity="0">água</text><text x="240" y="26" font-size="9" text-anchor="middle">vapor</text><path d="M40 90H80M40 62H150" stroke="currentColor" stroke-dasharray="3 3" stroke-width="1"/><text x="36" y="94" font-size="9" text-anchor="end">0 °C</text><text x="36" y="66" font-size="9" text-anchor="end">100 °C</text>'};
})();
'''
GQ=r'''function(GQ,Rn,fc,sc,sup){return [
GQ("tm","conversão para Fahrenheit","Use F = 1,8·C + 32.",function(){var C=Rn([10,20,25,30,40,50,100]),F=1.8*C+32;return {q:"Uma temperatura de "+C+" °C corresponde a quantos graus Fahrenheit?",ans:F,u:"°F",at:fc(F)+" °F",e:"F = 1,8 · "+C+" + 32 = "+fc(F)+" °F."}}),
GQ("cl","calor sensível","Use Q = m·c·Δθ.",function(){var m=Rn([100,200,250,500]),d=Rn([10,20,30,50]),Q=m*d;return {q:"Qual é a quantidade de calor, em cal, para aquecer "+m+" g de água em "+d+" °C? (c = 1 cal/g·°C)",ans:Q,u:"cal",at:sc(Q)+" cal",e:"Q = m·c·Δθ = "+m+" × 1 × "+d+" = "+sc(Q)+" cal."}}),
GQ("me","calor latente de fusão","Use Q = m·L.",function(){var m=Rn([10,20,50,100,200]),Q=m*80;return {q:"Qual é a quantidade de calor, em cal, para fundir "+m+" g de gelo a 0 °C? (L = 80 cal/g)",ans:Q,u:"cal",at:sc(Q)+" cal",e:"Q = m·L = "+m+" × 80 = "+sc(Q)+" cal."}}),
GQ("dl","dilatação linear","Use ΔL = L₀·α·Δθ e converta o resultado para mm.",function(){var L=Rn([2,5,10,20]),d=Rn([20,40,50,100]),x=L*1.2e-5*d*1000;return {q:"Uma barra de aço de "+L+" m, com α = 1,2 × 10⁻⁵ °C⁻¹, é aquecida em "+d+" °C. Qual é o aumento de comprimento, em mm?",ans:x,u:"mm",at:fc(x)+" mm",e:"ΔL = "+L+" × 1,2 × 10⁻⁵ × "+d+" = "+sc(L*1.2e-5*d)+" m = "+fc(x)+" mm."}})
];}'''
CARDS=[["Temperatura","Mede o grau de agitação das partículas. Calor é energia em trânsito por diferença de temperatura."],["Escalas","T (K) = θ (°C) + 273. C/5 = (F − 32)/9."],["Pontos fixos","Água: congela a 0 °C = 32 °F = 273 K e ferve a 100 °C = 212 °F = 373 K."],["Dilatação linear","ΔL = L₀ · α · Δθ. Para a superficial, β ≈ 2α. Para a volumétrica, γ ≈ 3α."],["Dilatação anômala da água","Entre 0 °C e 4 °C a água se contrai ao ser aquecida. A 4 °C a densidade é máxima."],["Calor específico","c: calor por grama para variar 1 °C. Água: 1 cal/g·°C."],["Calor sensível","Q = m · c · Δθ. Muda a temperatura, sem mudar o estado."],["Capacidade térmica","C = m · c = Q / Δθ."],["Calor latente","Q = m · L. Muda o estado, com temperatura constante."],["Valores do gelo e da água","L de fusão do gelo: 80 cal/g. L de vaporização da água: 540 cal/g."],["Equilíbrio térmico","Em um sistema isolado, ΣQ = 0: o que um perde, o outro ganha."],["Condução","Transporte de energia por vibração das partículas, sem deslocamento de matéria. Típica de sólidos."],["Convecção","Correntes de fluido: o quente sobe e o frio desce."],["Irradiação","Ondas eletromagnéticas. Não precisa de meio material (vem do Sol pelo vácuo)."],["Equivalência","1 cal ≈ 4,2 J."]]
RESUMO='<summary>Resumo rápido (ideias e fórmulas)</summary><p><b>Escalas:</b> T = θ + 273. C/5 = (F − 32)/9.</p><p><b>Dilatação linear:</b> ΔL = L₀·α·Δθ (β ≈ 2α, γ ≈ 3α).</p><p><b>Calor sensível:</b> Q = m·c·Δθ. <b>Calor latente:</b> Q = m·L.</p><p><b>Água:</b> c = 1 cal/g·°C; L fusão = 80 cal/g; L vaporização = 540 cal/g. 1 cal ≈ 4,2 J.</p><p><b>Propagação:</b> condução (sólidos), convecção (fluidos) e irradiação (até no vácuo).</p>'
def run():
    B=bank()
    js=json.dumps(B,ensure_ascii=False).replace('},{"id"','},\n{"id"')
    open(OUT+'perguntas-termo.js','w',encoding='utf-8').write('/* Banco de perguntas: Termologia. Mesmos campos dos outros bancos. */\nwindow.BANKS=window.BANKS||{};\nwindow.BANKS.termo='+js+';\n')
    open(OUT+'figuras-termo.js','w',encoding='utf-8').write(FIGS)
    open(OUT+'quiz-termo.js','w',encoding='utf-8').write(FB.quiz_js("termo","Termologia","Temperatura, dilatação, calor e mudanças de estado.","termo:",TN,CARDS,RESUMO,GQ,
      ["Perfeito! Você domina calor e temperatura.","Muito bem! Revise só os pontos que errou.","Bom começo. Vale rever a diferença entre calor e temperatura.","Revise os conceitos básicos e tente de novo. Você chega lá!"],
      "30 s por pergunta (60 s nos cálculos), com ranking",False,60))
    print('termo',len(B))
if __name__=='__main__': run()
