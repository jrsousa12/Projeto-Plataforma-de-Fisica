/* Animações automáticas de resolução (moldes). Os dados entre AUTO:BEGIN e AUTO:END são gravados por build/novas.py;
   não edite à mão. Cada item: {key, alt, molde, vars[], formula, subst, resultado}. */
(function(){"use strict";
var N=window.AN;if(!N)return;
var t_=N.t,HOT="var(--f-calor)",COLD="var(--f-agua)";
var DATA=/*AUTO:BEGIN*/[
{
"key": "calc_t106",
"alt": "Resolução animada: Uma panela contém 250 g de água a 20 °C. Qual a quantidade de calor necessária para aquecê-la até 80 °C? (calor específico da água: 1 cal/g·",
"molde": "calor",
"vars": [
"m = 250 g",
"c = 1 cal/g·°C",
"ΔT = 60 °C"
],
"formula": "Q = m · c · ΔT",
"subst": "Q = (250) · (1) · (60)",
"resultado": "Q = 1,5·10⁴ cal"
},
{
"key": "calc_t107",
"alt": "Resolução animada: Um bloco de ferro de 400 g (c = 0,11 cal/g·°C) é aquecido de 20 °C a 120 °C. Que quantidade de calor ele recebe?",
"molde": "calor",
"vars": [
"m = 400 g",
"c = 0,11 cal/g·°C",
"ΔT = 100 °C"
],
"formula": "Q = m · c · ΔT",
"subst": "Q = (400) · (0,11) · (100)",
"resultado": "Q = 4400 cal"
},
{
"key": "calc_t108",
"alt": "Resolução animada: Um objeto de 200 g de cobre tem calor específico de 0,09 cal/g·°C. Qual é a capacidade térmica desse objeto?",
"molde": "generico",
"vars": [
"m = 200 g",
"c = 0,09 cal/g·°C"
],
"formula": "C = m · c",
"subst": "C = (200) · (0,09)",
"resultado": "C = 18 cal/°C"
},
{
"key": "calc_t109",
"alt": "Resolução animada: Quanto calor é preciso para fundir totalmente 300 g de gelo a 0 °C? (calor latente de fusão do gelo: 80 cal/g)",
"molde": "latente",
"vars": [
"m = 300 g",
"L = 80 cal/g"
],
"formula": "Q = m · L",
"subst": "Q = (300) · (80)",
"resultado": "Q = 2,4·10⁴ cal"
},
{
"key": "calc_t110",
"alt": "Resolução animada: Qual a quantidade de calor para vaporizar 50 g de água que já está a 100 °C? (calor latente de vaporização: 540 cal/g)",
"molde": "latente",
"vars": [
"m = 50 g",
"L = 540 cal/g"
],
"formula": "Q = m · L",
"subst": "Q = (50) · (540)",
"resultado": "Q = 2,7·10⁴ cal"
},
{
"key": "calc_t111",
"alt": "Resolução animada: Um líquido ocupa 500 cm³ a 20 °C e tem coeficiente de dilatação volumétrica de 1,0·10⁻³ °C⁻¹. De quanto aumenta seu volume ao ser aquecido a",
"molde": "dilatacao",
"vars": [
"V₀ = 500 cm^3",
"γ = 1·10⁻³ 1/°C",
"ΔT = 40 °C"
],
"formula": "ΔV = V₀ · γ · ΔT",
"subst": "ΔV = (500) · (1·10⁻³) · (40)",
"resultado": "ΔV = 20 cm^3"
},
{
"key": "calc_q184",
"alt": "Resolução animada: Uma carga de prova de 3 µC, colocada em um ponto, sofre uma força de 0,12 N. Qual é a intensidade do campo elétrico nesse ponto?",
"molde": "coulomb",
"vars": [
"F = 0,12 N",
"q = 3 µC"
],
"formula": "E = F / q",
"subst": "E = (0,12)/(3)",
"resultado": "E = 4·10⁴ N/C"
},
{
"key": "calc_q185",
"alt": "Resolução animada: Um elétron (carga de módulo 1,6 × 10⁻¹⁹ C) está em um campo elétrico uniforme de 2 000 N/C. Qual é a intensidade da força elétrica sobre ele",
"molde": "coulomb",
"vars": [
"q = 1,6·10⁻¹⁹ C",
"E = 2000 N/C"
],
"formula": "F = q · E",
"subst": "F = (1,6·10⁻¹⁹) · (2000)",
"resultado": "F = 3,2·10⁻¹⁶ N"
},
{
"key": "calc_q188",
"alt": "Resolução animada: Duas cargas, +5 µC e −2 µC, estão separadas por 0,3 m, no vácuo. Qual é a energia potencial elétrica do sistema? (k = 9 × 10⁹ N·m²/C²)",
"molde": "potencial",
"vars": [
"k = 9·10⁹ N·m²/C²",
"q₁ = 5 µC",
"q₂ = -2 µC",
"d = 0,3 m"
],
"formula": "U = k · q₁ · q₂ / d",
"subst": "U = (9·10⁹) · (5) · (-2)/(0,3)",
"resultado": "U = -0,3 J"
},
{
"key": "calc_q189",
"alt": "Resolução animada: Uma carga de 2 µC está em um campo elétrico uniforme de 500 N/C e é deslocada 0,4 m no sentido contrário ao da força elétrica. Quanta energi",
"molde": "potencial",
"vars": [
"q = 2 µC",
"E = 500 N/C",
"d = 0,4 m"
],
"formula": "ΔU = q · E · d",
"subst": "ΔU = (2) · (500) · (0,4)",
"resultado": "ΔU = 0,0004 J"
},
{
"key": "calc_q192",
"alt": "Resolução animada: Uma carga de 8 µC se desloca de um ponto a 300 V até outro a 120 V. Qual é o trabalho da força elétrica sobre ela?",
"molde": "potencial",
"vars": [
"q = 8 µC",
"ΔV = 180 V"
],
"formula": "W = q · (V_i − V_f)",
"subst": "W = (8) · (180)",
"resultado": "W = 0,00144 J"
},
{
"key": "calc_q193",
"alt": "Resolução animada: Duas placas paralelas, separadas por 2 cm, têm entre elas uma diferença de potencial de 600 V. Qual é a intensidade do campo elétrico unifor",
"molde": "potencial",
"vars": [
"U = 600 V",
"d = 2 cm"
],
"formula": "E = U / d",
"subst": "E = (600)/(2)",
"resultado": "E = 3·10⁴ V/m"
},
{
"key": "calc_q196",
"alt": "Resolução animada: Uma chapa metálica de 0,02 m² de área recebe uma carga de 6 µC distribuída uniformemente. Qual é a densidade superficial de cargas?",
"molde": "generico",
"vars": [
"Q = 6 µC",
"A = 0,02 m^2"
],
"formula": "σ = Q / A",
"subst": "σ = (6)/(0,02)",
"resultado": "σ = 0,0003 C/m^2"
},
{
"key": "calc_q197",
"alt": "Resolução animada: Uma esfera condutora de raio 0,1 m tem carga de 4 µC. Considerando a carga uniformemente distribuída na superfície, qual é a densidade super",
"molde": "generico",
"vars": [
"Q = 4 µC",
"R = 0,1 m"
],
"formula": "σ = Q / (4π R²)",
"subst": "σ = (4)/(4 · pi · (0,1)^2)",
"resultado": "σ = 3,183·10⁻⁵ C/m^2"
},
{
"key": "calc_q203",
"alt": "Resolução animada: Um capacitor armazena uma carga de 60 µC quando submetido a uma tensão de 12 V. Qual é a sua capacitância?",
"molde": "generico",
"vars": [
"Q = 60 µC",
"V = 12 V"
],
"formula": "C = Q / V",
"subst": "C = (60)/(12)",
"resultado": "C = 5 µF"
},
{
"key": "calc_q204",
"alt": "Resolução animada: Um capacitor de 20 µF é ligado a uma bateria de 9 V. Qual é a carga armazenada?",
"molde": "generico",
"vars": [
"C = 20 µF",
"V = 9 V"
],
"formula": "Q = C · V",
"subst": "Q = (20) · (9)",
"resultado": "Q = 180 µC"
},
{
"key": "calc_q205",
"alt": "Resolução animada: Um capacitor de 100 µF é carregado com uma tensão de 50 V. Qual é a energia armazenada nele?",
"molde": "generico",
"vars": [
"C = 100 µF",
"V = 50 V"
],
"formula": "E = C · V² / 2",
"subst": "E = (100) · (50)^2/2",
"resultado": "E = 0,125 J"
},
{
"key": "calc_q210",
"alt": "Resolução animada: Dois capacitores, de 6 µF e 3 µF, são ligados em série. Qual é a capacitância equivalente?",
"molde": "generico",
"vars": [
"C₁ = 6 µF",
"C₂ = 3 µF"
],
"formula": "1/C_eq = 1/C₁ + 1/C₂",
"subst": "C_eq = 1/(1/(6)+1/(3))",
"resultado": "C_eq = 2 µF"
},
{
"key": "calc_q211",
"alt": "Resolução animada: Três capacitores, de 2 µF, 3 µF e 5 µF, são ligados em paralelo. Qual é a capacitância equivalente?",
"molde": "generico",
"vars": [
"C₁ = 2 µF",
"C₂ = 3 µF",
"C₃ = 5 µF"
],
"formula": "C_eq = C₁ + C₂ + C₃",
"subst": "C_eq = (2)+(3)+(5)",
"resultado": "C_eq = 10 µF"
},
{
"key": "calc_q212",
"alt": "Resolução animada: Um capacitor de 4 µF está em série com um conjunto formado por dois capacitores de 3 µF ligados em paralelo. Qual é a capacitância equivalen",
"molde": "generico",
"vars": [
"C₁ = 4 µF",
"C₂ = 3 µF",
"C₃ = 3 µF"
],
"formula": "C_eq = C₁·(C₂+C₃) / (C₁+C₂+C₃)",
"subst": "C_eq = (4) · ((3)+(3))/((4)+(3)+(3))",
"resultado": "C_eq = 2,4 µF"
},
{
"key": "calc_q214",
"alt": "Resolução animada: Dois capacitores, de 6 µF e 3 µF, são ligados em série a uma fonte de 12 V. Qual é a carga em cada capacitor?",
"molde": "generico",
"vars": [
"C_eq = 2 µF",
"V = 12 V"
],
"formula": "Q = C_eq · V",
"subst": "Q = (2) · (12)",
"resultado": "Q = 24 µC"
},
{
"key": "calc_o005",
"alt": "Resolução animada: Uma onda sonora tem frequência de 680 Hz e comprimento de onda de 0,5 m. Qual é a velocidade de propagação dessa onda?",
"molde": "generico",
"vars": [
"λ = 0,5 m",
"f = 680 Hz"
],
"formula": "v = λ · f",
"subst": "v = (0,5) · (680)",
"resultado": "v = 340 m/s"
},
{
"key": "calc_o006",
"alt": "Resolução animada: Uma fonte sonora vibra 250 vezes por segundo (250 Hz). Qual é o período dessa vibração?",
"molde": "generico",
"vars": [
"f = 250 Hz"
],
"formula": "T = 1 / f",
"subst": "T = 1/(250)",
"resultado": "T = 0,004 s"
},
{
"key": "calc_o011",
"alt": "Resolução animada: Um raio cai a 1700 m de uma pessoa. Considerando a luz instantânea e o som a 340 m/s no ar, quanto tempo depois do clarão ela ouve o trovão?",
"molde": "generico",
"vars": [
"d = 1700 m",
"v = 340 m/s"
],
"formula": "t = d / v",
"subst": "t = (1700)/(340)",
"resultado": "t = 5 s"
},
{
"key": "calc_o012",
"alt": "Resolução animada: Um mergulhador emite um som de 500 Hz na água, onde o som viaja a 1500 m/s. Qual é o comprimento de onda desse som na água?",
"molde": "generico",
"vars": [
"v = 1500 m/s",
"f = 500 Hz"
],
"formula": "λ = v / f",
"subst": "λ = (1500)/(500)",
"resultado": "λ = 3 m"
},
{
"key": "calc_o023",
"alt": "Resolução animada: Um som tem intensidade de 10⁻⁵ W/m². Qual é o seu nível sonoro? (I₀ = 10⁻¹² W/m²)",
"molde": "generico",
"vars": [
"I = 1·10⁻⁵ W/m²",
"I₀ = 1·10⁻¹² W/m²"
],
"formula": "β = 10 · log(I / I₀)",
"subst": "β = 10 · log((1·10⁻⁵)/(1·10⁻¹²))",
"resultado": "β = 70 dB"
},
{
"key": "calc_o024",
"alt": "Resolução animada: Um som tem nível sonoro de 60 dB. Qual é a sua intensidade? (I₀ = 10⁻¹² W/m²)",
"molde": "generico",
"vars": [
"β = 60 dB",
"I₀ = 1·10⁻¹² W/m²"
],
"formula": "I = I₀ · 10^(β/10)",
"subst": "I = (1·10⁻¹²) · 10^((60)/10)",
"resultado": "I = 1·10⁻⁶ W/m²"
},
{
"key": "calc_o025",
"alt": "Resolução animada: Uma fonte sonora pontual emite uma potência de 10 W. Qual é a intensidade a 2 m dela, sem reflexões? (use π ≈ 3,14)",
"molde": "generico",
"vars": [
"P = 10 W",
"r = 2 m"
],
"formula": "I = P / (4π r²)",
"subst": "I = (10)/(4 · pi · (2)^2)",
"resultado": "I = 0,199 W/m²"
},
{
"key": "calc_o029",
"alt": "Resolução animada: Considere a velocidade do som no ar igual a 340 m/s. Qual é a menor distância entre uma pessoa e um obstáculo refletor para que ela ouça o e",
"molde": "generico",
"vars": [
"v = 340 m/s",
"Δt = 0,1 s"
],
"formula": "2d = v · Δt  →  d = v · Δt / 2",
"subst": "d = (340) · (0,1)/2",
"resultado": "d = 17 m"
},
{
"key": "calc_o030",
"alt": "Resolução animada: Um sonar emite um pulso de ultrassom e recebe o eco 0,8 s depois. Considerando a velocidade do som na água igual a 1500 m/s, qual é a profun",
"molde": "generico",
"vars": [
"v = 1500 m/s",
"Δt = 0,8 s"
],
"formula": "d = v · Δt / 2",
"subst": "d = (1500) · (0,8)/2",
"resultado": "d = 600 m"
},
{
"key": "calc_o031",
"alt": "Resolução animada: Um garoto grita diante de uma montanha e ouve o eco 4 s depois. Com o som a 340 m/s, a que distância está a montanha?",
"molde": "generico",
"vars": [
"v = 340 m/s",
"Δt = 4 s"
],
"formula": "d = v · Δt / 2",
"subst": "d = (340) · (4)/2",
"resultado": "d = 680 m"
},
{
"key": "calc_o037",
"alt": "Resolução animada: Dois diapasões, de 440 Hz e 444 Hz, soam ao mesmo tempo. Quantos batimentos por segundo se percebem?",
"molde": "generico",
"vars": [
"f₁ = 440 Hz",
"f₂ = 444 Hz"
],
"formula": "f_bat = |f₂ − f₁|",
"subst": "f_bat = (444)-(440)",
"resultado": "f_bat = 4 Hz"
},
{
"key": "calc_o038",
"alt": "Resolução animada: Dois sons de 512 Hz e 516 Hz são produzidos juntos. Qual é a frequência do som resultante que o ouvinte percebe, entre os batimentos?",
"molde": "generico",
"vars": [
"f₁ = 512 Hz",
"f₂ = 516 Hz"
],
"formula": "f = (f₁ + f₂) / 2",
"subst": "f = ((512)+(516))/2",
"resultado": "f = 514 Hz"
},
{
"key": "calc_o043",
"alt": "Resolução animada: Uma ambulância, com sirene de 800 Hz, se aproxima a 30 m/s de um observador parado. A velocidade do som no ar é 340 m/s. Qual é a frequência",
"molde": "generico",
"vars": [
"f = 800 Hz",
"v = 340 m/s",
"v_F = 30 m/s"
],
"formula": "f' = f · v / (v − v_F)",
"subst": "f' = (800) · (340)/((340)-(30))",
"resultado": "f' = 877,4 Hz"
},
{
"key": "calc_o044",
"alt": "Resolução animada: A mesma ambulância (sirene de 800 Hz), agora se afastando a 30 m/s de um observador parado, com o som a 340 m/s. Qual é a frequência percebi",
"molde": "generico",
"vars": [
"f = 800 Hz",
"v = 340 m/s",
"v_F = 30 m/s"
],
"formula": "f' = f · v / (v + v_F)",
"subst": "f' = (800) · (340)/((340)+(30))",
"resultado": "f' = 735,1 Hz"
},
{
"key": "calc_o045",
"alt": "Resolução animada: Um avião voa a 680 m/s em uma região onde a velocidade do som é de 340 m/s. Qual é o número de Mach do avião?",
"molde": "generico",
"vars": [
"v_fonte = 680 m/s",
"v_som = 340 m/s"
],
"formula": "M = v_fonte / v_som",
"subst": "M = (680)/(340)",
"resultado": "M = 2"
},
{
"key": "calc_o050",
"alt": "Resolução animada: Em uma corda com onda estacionária, a distância entre dois nós consecutivos é de 15 cm. Qual é o comprimento de onda?",
"molde": "generico",
"vars": [
"d = 15 cm"
],
"formula": "λ = 2 · d",
"subst": "λ = 2 · (15)",
"resultado": "λ = 0,3 m"
},
{
"key": "calc_o051",
"alt": "Resolução animada: Uma corda de 1,2 m, presa nas duas pontas, vibra com 3 fusos (3 ventres). Qual é o comprimento de onda?",
"molde": "generico",
"vars": [
"L = 1,2 m",
"n = 3"
],
"formula": "λ = 2L / n",
"subst": "λ = 2 · (1,2)/(3)",
"resultado": "λ = 0,8 m"
},
{
"key": "calc_o055",
"alt": "Resolução animada: Uma corda de violão de 0,5 m, presa nas duas pontas, emite como fundamental uma nota de 500 Hz. Qual é a velocidade das ondas na corda?",
"molde": "generico",
"vars": [
"L = 0,5 m",
"f₁ = 500 Hz"
],
"formula": "v = 2 · L · f₁",
"subst": "v = 2 · (0,5) · (500)",
"resultado": "v = 500 m/s"
},
{
"key": "calc_o056",
"alt": "Resolução animada: Uma corda tem massa por unidade de comprimento de 0,01 kg/m e é tracionada com 100 N. Qual é a velocidade das ondas na corda?",
"molde": "generico",
"vars": [
"T = 100 N",
"μ = 0,01 kg/m"
],
"formula": "v = √(T / μ)",
"subst": "v = sqrt((100)/(0,01))",
"resultado": "v = 100 m/s"
},
{
"key": "calc_o057",
"alt": "Resolução animada: Uma corda de 2 m, presa nas duas pontas, vibra com dois harmônicos consecutivos de frequências 100 Hz e 125 Hz. Qual é a velocidade das onda",
"molde": "generico",
"vars": [
"f₁ = 100 Hz",
"f₂ = 125 Hz",
"L = 2 m"
],
"formula": "v = 2 · L · (f₂ − f₁)",
"subst": "v = 2 · (2) · ((125)-(100))",
"resultado": "v = 100 m/s"
},
{
"key": "calc_o058",
"alt": "Resolução animada: Uma corda de 0,6 m, presa nas duas pontas, é percorrida por ondas de velocidade 360 m/s. Qual é a frequência do segundo harmônico?",
"molde": "generico",
"vars": [
"v = 360 m/s",
"L = 0,6 m"
],
"formula": "f₂ = 2 · v / (2L)",
"subst": "f₂ = (360)/(0,6)",
"resultado": "f₂ = 600 Hz"
},
{
"key": "calc_o062",
"alt": "Resolução animada: Um tubo aberto nas duas extremidades tem 0,85 m. Com a velocidade do som igual a 340 m/s, qual é a frequência fundamental?",
"molde": "generico",
"vars": [
"v = 340 m/s",
"L = 0,85 m"
],
"formula": "f₁ = v / (2L)",
"subst": "f₁ = (340)/(2 · (0,85))",
"resultado": "f₁ = 200 Hz"
},
{
"key": "calc_o063",
"alt": "Resolução animada: Um tubo fechado em uma extremidade tem 0,85 m. Com a velocidade do som igual a 340 m/s, qual é a frequência fundamental?",
"molde": "generico",
"vars": [
"v = 340 m/s",
"L = 0,85 m"
],
"formula": "f₁ = v / (4L)",
"subst": "f₁ = (340)/(4 · (0,85))",
"resultado": "f₁ = 100 Hz"
},
{
"key": "calc_o064",
"alt": "Resolução animada: Um tubo fechado em uma extremidade tem 0,5 m e a velocidade do som é 340 m/s. Qual é a frequência do terceiro harmônico (n = 3)?",
"molde": "generico",
"vars": [
"n = 3",
"v = 340 m/s",
"L = 0,5 m"
],
"formula": "fₙ = n · v / (4L)",
"subst": "f₃ = (3) · (340)/(4 · (0,5))",
"resultado": "f₃ = 510 Hz"
},
{
"key": "calc_o065",
"alt": "Resolução animada: Que comprimento deve ter um tubo aberto nas duas extremidades para que sua frequência fundamental seja 340 Hz? (velocidade do som: 340 m/s)",
"molde": "generico",
"vars": [
"v = 340 m/s",
"f₁ = 340 Hz"
],
"formula": "L = v / (2 f₁)",
"subst": "L = (340)/(2 · (340))",
"resultado": "L = 0,5 m"
},
{
"key": "calc_p007",
"alt": "Resolução animada: Um poste de 6 m de altura projeta no chão uma sombra de 4 m. No mesmo instante, uma pessoa projeta uma sombra de 1,2 m. Qual é a altura da p",
"molde": "generico",
"vars": [
"H = 6 m",
"S = 4 m",
"s = 1,2 m"
],
"formula": "h = H · s / S",
"subst": "h = (6) · (1,2)/(4)",
"resultado": "h = 1,8 m"
},
{
"key": "calc_p008",
"alt": "Resolução animada: Em uma câmara escura de orifício, uma pessoa de 2 m de altura está a 8 m do orifício, e o anteparo está a 0,2 m dele. Qual é a altura da ima",
"molde": "generico",
"vars": [
"o = 2 m",
"p = 8 m",
"p' = 0,2 m"
],
"formula": "i = o · p' / p",
"subst": "i = (2) · (0,2)/(8)",
"resultado": "i = 0,05 m"
},
{
"key": "calc_p009",
"alt": "Resolução animada: A distância média entre o Sol e a Terra é de 1,5 × 10¹¹ m. Com a velocidade da luz de 3 × 10⁸ m/s, quanto tempo a luz do Sol leva para chega",
"molde": "generico",
"vars": [
"d = 1,5·10¹¹ m",
"c = 3·10⁸ m/s"
],
"formula": "t = d / c",
"subst": "t = (1,5·10¹¹)/(3·10⁸)",
"resultado": "t = 500 s"
},
{
"key": "calc_p013",
"alt": "Resolução animada: Uma pessoa está a 1,5 m de um espelho plano. Qual é a distância entre ela e a sua imagem?",
"molde": "generico",
"vars": [
"d = 1,5 m"
],
"formula": "D = 2 · d",
"subst": "D = 2 · (1,5)",
"resultado": "D = 3 m"
},
{
"key": "calc_p014",
"alt": "Resolução animada: Qual é a altura mínima de um espelho plano vertical para que uma pessoa de 1,80 m de altura se veja de corpo inteiro?",
"molde": "generico",
"vars": [
"H = 1,8 m"
],
"formula": "h = H / 2",
"subst": "h = (1,8)/2",
"resultado": "h = 0,9 m"
},
{
"key": "calc_p015",
"alt": "Resolução animada: Dois espelhos planos formam entre si um ângulo de 60°. Quantas imagens se formam de um objeto colocado entre eles?",
"molde": "generico",
"vars": [
"θ = 60"
],
"formula": "N = 360° / θ − 1",
"subst": "N = 360/(60)-1",
"resultado": "N = 5"
},
{
"key": "calc_p017",
"alt": "Resolução animada: Uma pessoa se aproxima de um espelho plano com velocidade de 2 m/s. Com que velocidade ela se aproxima da própria imagem?",
"molde": "generico",
"vars": [
"v = 2 m/s"
],
"formula": "v_rel = 2 · v",
"subst": "v_rel = 2 · (2)",
"resultado": "v_rel = 4 m/s"
},
{
"key": "calc_p023",
"alt": "Resolução animada: Um espelho esférico tem raio de curvatura de 40 cm. Qual é a sua distância focal?",
"molde": "generico",
"vars": [
"R = 40 cm"
],
"formula": "f = R / 2",
"subst": "f = (40)/2",
"resultado": "f = 20 cm"
},
{
"key": "calc_p024",
"alt": "Resolução animada: Um espelho côncavo tem distância focal de 10 cm. Um objeto real está a 30 cm do vértice. A que distância do espelho se forma a imagem?",
"molde": "generico",
"vars": [
"f = 10 cm",
"p = 30 cm"
],
"formula": "1/f = 1/p + 1/p'",
"subst": "p' = 1/(1/(10)-1/(30))",
"resultado": "p' = 15 cm"
},
{
"key": "calc_p025",
"alt": "Resolução animada: No espelho côncavo da questão anterior (f = 10 cm, objeto a 30 cm, imagem a 15 cm), qual é o aumento linear transversal A = −p'/p?",
"molde": "generico",
"vars": [
"p' = 15 cm",
"p = 30 cm"
],
"formula": "A = − p' / p",
"subst": "A = −(15)/(30)",
"resultado": "A = −0,5"
},
{
"key": "calc_p027",
"alt": "Resolução animada: Um espelho convexo tem distância focal de −15 cm. Um objeto está a 30 cm do espelho. Em que posição se forma a imagem?",
"molde": "generico",
"vars": [
"f = -15 cm",
"p = 30 cm"
],
"formula": "1/f = 1/p + 1/p'",
"subst": "p' = 1/(1/(−15)-1/(30))",
"resultado": "p' = −10 cm"
},
{
"key": "calc_p029",
"alt": "Resolução animada: Qual é a velocidade da luz em um vidro de índice de refração 1,5? (c = 3 × 10⁸ m/s)",
"molde": "generico",
"vars": [
"c = 3·10⁸ m/s",
"n = 1,5"
],
"formula": "v = c / n",
"subst": "v = (3·10⁸)/(1,5)",
"resultado": "v = 2·10⁸ m/s"
},
{
"key": "calc_p032",
"alt": "Resolução animada: Um raio de luz incide do ar (n₁ = 1) em uma superfície de vidro (n₂ = 1,5) com sen θ₁ = 0,5. Qual é o valor de sen θ₂?",
"molde": "generico",
"vars": [
"n₁ = 1",
"sen θ₁ = 0,5",
"n₂ = 1,5"
],
"formula": "sen θ₂ = n₁ · sen θ₁ / n₂",
"subst": "sen θ₂ = (1) · (0,5)/(1,5)",
"resultado": "sen θ₂ = 0,333"
},
{
"key": "calc_p033",
"alt": "Resolução animada: Um raio de luz incide do ar (n = 1) em um material desconhecido, com sen θ₁ = 0,8. O raio refratado tem sen θ₂ = 0,5. Qual é o índice de ref",
"molde": "generico",
"vars": [
"n₁ = 1",
"sen θ₁ = 0,8",
"sen θ₂ = 0,5"
],
"formula": "n₂ = n₁ · sen θ₁ / sen θ₂",
"subst": "n₂ = (1) · (0,8)/(0,5)",
"resultado": "n₂ = 1,6"
},
{
"key": "calc_p038",
"alt": "Resolução animada: Um raio de luz passa de um meio de índice n₁ = 2 para o ar (n₂ = 1). Qual é o valor do seno do ângulo limite?",
"molde": "generico",
"vars": [
"n₁ = 2",
"n₂ = 1"
],
"formula": "sen L = n₂ / n₁",
"subst": "sen L = (1)/(2)",
"resultado": "sen L = 0,5"
},
{
"key": "calc_p048",
"alt": "Resolução animada: Uma lente convergente tem distância focal de 0,5 m. Qual é a sua vergência?",
"molde": "generico",
"vars": [
"f = 0,5 m"
],
"formula": "V = 1 / f",
"subst": "V = 1/(0,5)",
"resultado": "V = 2 di"
},
{
"key": "calc_p049",
"alt": "Resolução animada: Uma lente convergente tem distância focal de 20 cm. Um objeto real está a 60 cm dela. A que distância da lente se forma a imagem?",
"molde": "generico",
"vars": [
"f = 20 cm",
"p = 60 cm"
],
"formula": "1/f = 1/p + 1/p'",
"subst": "p' = 1/(1/(20)-1/(60))",
"resultado": "p' = 30 cm"
},
{
"key": "calc_p050",
"alt": "Resolução animada: Uma lente divergente tem distância focal de −20 cm. Um objeto real está a 20 cm dela. Em que posição se forma a imagem?",
"molde": "generico",
"vars": [
"f = -20 cm",
"p = 20 cm"
],
"formula": "1/f = 1/p + 1/p'",
"subst": "p' = 1/(1/(−20)-1/(20))",
"resultado": "p' = −10 cm"
},
{
"key": "calc_p051",
"alt": "Resolução animada: Duas lentes finas justapostas têm vergências de +3 di e +2 di. Qual é a distância focal do conjunto?",
"molde": "generico",
"vars": [
"V₁ = 3 di",
"V₂ = 2 di"
],
"formula": "f = 1 / (V₁ + V₂)",
"subst": "f = 1/((3)+(2))",
"resultado": "f = 0,2 m"
},
{
"key": "calc_p054",
"alt": "Resolução animada: O ponto remoto de uma pessoa míope é de 50 cm. Qual é a vergência da lente que corrige o defeito (lente que forma, no ponto remoto, a imagem",
"molde": "generico",
"vars": [
"d = 0,5 m"
],
"formula": "V = −1 / d",
"subst": "V = −1/(0,5)",
"resultado": "V = −2 di"
},
{
"key": "calc_m001",
"alt": "Resolução animada: Um carro percorre 90 km em 1,5 h. Qual é a sua velocidade média, em km/h?",
"molde": "generico",
"vars": [
"Δs = 90 km",
"Δt = 1,5 h"
],
"formula": "vm = Δs / Δt",
"subst": "vm = (90)/(1,5)",
"resultado": "vm = 60 km/h"
},
{
"key": "calc_m003",
"alt": "Resolução animada: Um ciclista se move a 72 km/h. Qual é essa velocidade em m/s?",
"molde": "generico",
"vars": [
"v = 72 km/h"
],
"formula": "v em m/s",
"subst": "v = (72)",
"resultado": "v = 20 m/s"
},
{
"key": "calc_m004",
"alt": "Resolução animada: Dois carros se aproximam em linha reta, em movimento uniforme, em sentidos opostos. Eles estão separados por 300 m, o carro A tem 20 m/s e o",
"molde": "generico",
"vars": [
"d = 300 m",
"vA = 20 m/s",
"vB = 10 m/s"
],
"formula": "t = d / (vA + vB)",
"subst": "t = (300)/((20)+(10))",
"resultado": "t = 10 s"
},
{
"key": "calc_m008",
"alt": "Resolução animada: Um móvel tem velocidade inicial de 4 m/s e aceleração constante de 3 m/s². Qual é a sua velocidade após 5 s?",
"molde": "generico",
"vars": [
"v₀ = 4 m/s",
"a = 3 m/s²",
"t = 5 s"
],
"formula": "v = v₀ + a·t",
"subst": "v = (4)+(3) · (5)",
"resultado": "v = 19 m/s"
},
{
"key": "calc_m009",
"alt": "Resolução animada: Um carro a 20 m/s freia com desaceleração constante de 4 m/s² até parar. Qual é a distância percorrida durante a frenagem?",
"molde": "generico",
"vars": [
"v₀ = 20 m/s",
"a = 4 m/s²"
],
"formula": "Δs = v₀² / (2a)",
"subst": "Δs = (20) · (20)/(2 · (4))",
"resultado": "Δs = 50 m"
},
{
"key": "calc_m010",
"alt": "Resolução animada: Um objeto parte do repouso com aceleração constante de 2 m/s². Que distância ele percorre em 6 s?",
"molde": "generico",
"vars": [
"a = 2 m/s²",
"t = 6 s"
],
"formula": "Δs = a·t² / 2",
"subst": "Δs = (2) · (6) · (6)/2",
"resultado": "Δs = 36 m"
},
{
"key": "calc_m012",
"alt": "Resolução animada: A velocidade de um móvel passa de 10 m/s para 30 m/s em 4 s. Qual é a sua aceleração média?",
"molde": "generico",
"vars": [
"v₁ = 10 m/s",
"v₂ = 30 m/s",
"Δt = 4 s"
],
"formula": "a = Δv / Δt",
"subst": "a = ((30)-(10))/(4)",
"resultado": "a = 5 m/s²"
},
{
"key": "calc_m017",
"alt": "Resolução animada: Um objeto é abandonado do repouso de uma altura de 45 m. Desprezando a resistência do ar e adotando g = 10 m/s², quanto tempo ele leva para ",
"molde": "generico",
"vars": [
"h = 45 m",
"g = 10 m/s²"
],
"formula": "t = √(2h / g)",
"subst": "t = sqrt(2 · (45)/(10))",
"resultado": "t = 3 s"
},
{
"key": "calc_m018",
"alt": "Resolução animada: Um corpo cai do repouso de uma altura de 20 m. Com g = 10 m/s² e sem resistência do ar, com que velocidade ele atinge o solo?",
"molde": "generico",
"vars": [
"g = 10 m/s²",
"h = 20 m"
],
"formula": "v = √(2·g·h)",
"subst": "v = sqrt(2 · (10) · (20))",
"resultado": "v = 20 m/s"
},
{
"key": "calc_m019",
"alt": "Resolução animada: Uma pedra é lançada verticalmente para cima com velocidade de 30 m/s. Com g = 10 m/s² e sem resistência do ar, qual é a altura máxima atingi",
"molde": "generico",
"vars": [
"v₀ = 30 m/s",
"g = 10 m/s²"
],
"formula": "H = v₀² / (2g)",
"subst": "H = (30) · (30)/(2 · (10))",
"resultado": "H = 45 m"
},
{
"key": "calc_m020",
"alt": "Resolução animada: Uma bola é lançada verticalmente para cima com velocidade de 20 m/s. Com g = 10 m/s², quanto tempo ela leva para atingir o ponto mais alto?",
"molde": "generico",
"vars": [
"v₀ = 20 m/s",
"g = 10 m/s²"
],
"formula": "t = v₀ / g",
"subst": "t = (20)/(10)",
"resultado": "t = 2 s"
},
{
"key": "calc_m023",
"alt": "Resolução animada: Uma bola é lançada horizontalmente com velocidade de 15 m/s do alto de um prédio de 20 m de altura. Com g = 10 m/s² e sem resistência do ar,",
"molde": "generico",
"vars": [
"v₀ = 15 m/s",
"h = 20 m",
"g = 10 m/s²"
],
"formula": "x = v₀ · √(2h / g)",
"subst": "x = (15) · sqrt(2 · (20)/(10))",
"resultado": "x = 30 m"
},
{
"key": "calc_m024",
"alt": "Resolução animada: Um projétil é lançado com velocidade de 50 m/s formando 37° com a horizontal (sen 37° = 0,6 e cos 37° = 0,8). Qual é a componente vertical d",
"molde": "generico",
"vars": [
"v₀ = 50 m/s",
"sen θ = 0,6"
],
"formula": "v₀y = v₀ · sen θ",
"subst": "v₀y = (50) · (0,6)",
"resultado": "v₀y = 30 m/s"
},
{
"key": "calc_m025",
"alt": "Resolução animada: Um projétil é lançado do solo com velocidade de 20 m/s e ângulo de 45°. Com g = 10 m/s² e sem resistência do ar, qual é o alcance (mesmo nív",
"molde": "generico",
"vars": [
"v₀ = 20 m/s",
"g = 10 m/s²"
],
"formula": "A = v₀² · sen 2θ / g",
"subst": "A = (20) · (20)/(10)",
"resultado": "A = 40 m"
},
{
"key": "calc_m028",
"alt": "Resolução animada: Um corpo em movimento circular uniforme leva 0,5 s para dar uma volta completa. Qual é a sua frequência?",
"molde": "generico",
"vars": [
"T = 0,5 s"
],
"formula": "f = 1 / T",
"subst": "f = 1/(0,5)",
"resultado": "f = 2 Hz"
},
{
"key": "calc_m029",
"alt": "Resolução animada: Um corpo percorre uma circunferência de raio 2 m em movimento uniforme, com período de 4 s. Qual é a sua velocidade linear? (use π ≈ 3,14)",
"molde": "generico",
"vars": [
"R = 2 m",
"T = 4 s"
],
"formula": "v = 2πR / T",
"subst": "v = 2 · pi · (2)/(4)",
"resultado": "v = 3,142 m/s"
},
{
"key": "calc_m030",
"alt": "Resolução animada: Um corpo descreve uma trajetória circular de raio 5 m com velocidade de módulo constante de 10 m/s. Qual é o módulo da aceleração centrípeta",
"molde": "generico",
"vars": [
"v = 10 m/s",
"R = 5 m"
],
"formula": "a = v² / R",
"subst": "a = (10) · (10)/(5)",
"resultado": "a = 20 m/s²"
},
{
"key": "calc_m033",
"alt": "Resolução animada: Uma roda gira em movimento uniforme com frequência de 5 Hz. Qual é a sua velocidade angular? (use π ≈ 3,14)",
"molde": "generico",
"vars": [
"f = 5 Hz"
],
"formula": "ω = 2π·f",
"subst": "ω = 2 · pi · (5)",
"resultado": "ω = 31,42 rad/s"
},
{
"key": "calc_m035",
"alt": "Resolução animada: Sobre um bloco de 4 kg, em uma superfície sem atrito, atuam duas forças horizontais de sentidos opostos: 30 N e 10 N. Qual é a aceleração do",
"molde": "generico",
"vars": [
"F₁ = 30 N",
"F₂ = 10 N",
"m = 4 kg"
],
"formula": "a = (F₁ − F₂) / m",
"subst": "a = ((30)-(10))/(4)",
"resultado": "a = 5 m/s²"
},
{
"key": "calc_m036",
"alt": "Resolução animada: Um astronauta de 50 kg está na Lua, onde g = 1,6 m/s². Qual é o seu peso na Lua?",
"molde": "generico",
"vars": [
"m = 50 kg",
"g = 1,6 m/s²"
],
"formula": "P = m·g",
"subst": "P = (50) · (1,6)",
"resultado": "P = 80 N"
},
{
"key": "calc_m039",
"alt": "Resolução animada: Uma pessoa de 60 kg está dentro de um elevador que sobe com aceleração de 2 m/s². Com g = 10 m/s², qual é a força normal do piso sobre ela?",
"molde": "generico",
"vars": [
"m = 60 kg",
"g = 10 m/s²",
"a = 2 m/s²"
],
"formula": "N = m(g + a)",
"subst": "N = (60) · ((10)+(2))",
"resultado": "N = 720 N"
},
{
"key": "calc_m041",
"alt": "Resolução animada: Dois blocos, de 2 kg e 3 kg, estão ligados por um fio e apoiados em uma superfície sem atrito. Uma força de 20 N puxa o conjunto. Qual é a a",
"molde": "generico",
"vars": [
"F = 20 N",
"m₁ = 2 kg",
"m₂ = 3 kg"
],
"formula": "a = F / (m₁ + m₂)",
"subst": "a = (20)/((2)+(3))",
"resultado": "a = 4 m/s²"
},
{
"key": "calc_m042",
"alt": "Resolução animada: Um bloco de 10 kg está sobre um piso horizontal. O coeficiente de atrito cinético é 0,3. Com g = 10 m/s², qual é a força de atrito durante o",
"molde": "generico",
"vars": [
"μ = 0,3",
"m = 10 kg",
"g = 10 m/s²"
],
"formula": "Fat = μ·N",
"subst": "Fat = (0,3) · (10) · (10)",
"resultado": "Fat = 30 N"
},
{
"key": "calc_m044",
"alt": "Resolução animada: Um bloco desliza, sem atrito, em um plano inclinado de 30° (sen 30° = 0,5). Com g = 10 m/s², qual é a sua aceleração?",
"molde": "generico",
"vars": [
"g = 10 m/s²",
"sen θ = 0,5"
],
"formula": "a = g · sen θ",
"subst": "a = (10) · (0,5)",
"resultado": "a = 5 m/s²"
},
{
"key": "calc_m045",
"alt": "Resolução animada: Um bloco de 20 kg está sobre um plano inclinado cujo ângulo tem sen θ = 0,6 e cos θ = 0,8. Com g = 10 m/s², qual é a componente do peso para",
"molde": "generico",
"vars": [
"m = 20 kg",
"g = 10 m/s²",
"sen θ = 0,6"
],
"formula": "Px = m·g·sen θ",
"subst": "Px = (20) · (10) · (0,6)",
"resultado": "Px = 120 N"
},
{
"key": "calc_m046",
"alt": "Resolução animada: Um bloco de 5 kg repousa sobre um plano inclinado com cos θ = 0,8. Com g = 10 m/s², qual é a força normal do plano sobre o bloco?",
"molde": "generico",
"vars": [
"m = 5 kg",
"g = 10 m/s²",
"cos θ = 0,8"
],
"formula": "N = m·g·cos θ",
"subst": "N = (5) · (10) · (0,8)",
"resultado": "N = 40 N"
},
{
"key": "calc_m047",
"alt": "Resolução animada: Um bloco desce um plano inclinado com atrito (sen θ = 0,6, cos θ = 0,8 e μ = 0,5). Com g = 10 m/s², qual é a sua aceleração?",
"molde": "generico",
"vars": [
"g = 10 m/s²",
"sen θ = 0,6",
"cos θ = 0,8",
"μ = 0,5"
],
"formula": "a = g(sen θ − μ·cos θ)",
"subst": "a = (10) · ((0,6)-(0,5) · (0,8))",
"resultado": "a = 2 m/s²"
},
{
"key": "calc_m049",
"alt": "Resolução animada: Uma força constante de 50 N desloca um bloco por 4 m. A força forma 60° com o deslocamento (cos 60° = 0,5). Qual é o trabalho da força?",
"molde": "generico",
"vars": [
"F = 50 N",
"d = 4 m",
"cos θ = 0,5"
],
"formula": "τ = F·d·cos θ",
"subst": "τ = (50) · (4) · (0,5)",
"resultado": "τ = 100 J"
},
{
"key": "calc_m051",
"alt": "Resolução animada: Uma força realiza um trabalho de 1200 J em 20 s. Qual é a potência média?",
"molde": "generico",
"vars": [
"τ = 1200 J",
"Δt = 20 s"
],
"formula": "P = τ / Δt",
"subst": "P = (1200)/(20)",
"resultado": "P = 60 W"
},
{
"key": "calc_m052",
"alt": "Resolução animada: Uma bomba eleva 200 kg de água a uma altura de 10 m em 20 s. Com g = 10 m/s², qual é a potência mínima necessária?",
"molde": "generico",
"vars": [
"m = 200 kg",
"g = 10 m/s²",
"h = 10 m",
"Δt = 20 s"
],
"formula": "P = m·g·h / Δt",
"subst": "P = (200) · (10) · (10)/(20)",
"resultado": "P = 1000 W"
},
{
"key": "calc_m053",
"alt": "Resolução animada: Um carro se desloca a 20 m/s com uma força motriz constante de 500 N. Qual é a potência desenvolvida pela força?",
"molde": "generico",
"vars": [
"F = 500 N",
"v = 20 m/s"
],
"formula": "P = F·v",
"subst": "P = (500) · (20)",
"resultado": "P = 10 kW"
},
{
"key": "calc_m055",
"alt": "Resolução animada: Um carro de 1200 kg se move a 72 km/h. Qual é a sua energia cinética?",
"molde": "generico",
"vars": [
"m = 1200 kg",
"v = 72 km/h"
],
"formula": "Ec = m·v² / 2",
"subst": "Ec = (1200) · (72) · (72)/2",
"resultado": "Ec = 240 kJ"
},
{
"key": "calc_m056",
"alt": "Resolução animada: Um objeto de 3 kg está a 5 m de altura. Com g = 10 m/s², qual é a sua energia potencial gravitacional em relação ao solo?",
"molde": "generico",
"vars": [
"m = 3 kg",
"g = 10 m/s²",
"h = 5 m"
],
"formula": "Ep = m·g·h",
"subst": "Ep = (3) · (10) · (5)",
"resultado": "Ep = 150 J"
},
{
"key": "calc_m057",
"alt": "Resolução animada: Um carrinho parte do repouso do topo de uma montanha-russa, a 20 m do solo. Sem atrito e com g = 10 m/s², qual é a sua velocidade ao passar ",
"molde": "generico",
"vars": [
"g = 10 m/s²",
"H = 20 m",
"h = 5 m"
],
"formula": "v = √(2·g·(H − h))",
"subst": "v = sqrt(2 · (10) · ((20)-(5)))",
"resultado": "v = 17,32 m/s"
},
{
"key": "calc_m058",
"alt": "Resolução animada: Uma mola de constante elástica 200 N/m está comprimida de 0,1 m. Qual é a energia potencial elástica armazenada?",
"molde": "generico",
"vars": [
"k = 200 N/m",
"x = 0,1 m"
],
"formula": "Ee = k·x² / 2",
"subst": "Ee = (200) · (0,1) · (0,1)/2",
"resultado": "Ee = 1 J"
},
{
"key": "calc_m059",
"alt": "Resolução animada: Um carro de 1000 kg aumenta a velocidade de 10 m/s para 20 m/s. Qual foi o trabalho da força resultante?",
"molde": "generico",
"vars": [
"m = 1000 kg",
"v₁ = 10 m/s",
"v₂ = 20 m/s"
],
"formula": "τ = ΔEc",
"subst": "τ = (1000) · ((20) · (20)-(10) · (10))/2",
"resultado": "τ = 150 kJ"
},
{
"key": "calc_m063",
"alt": "Resolução animada: Uma bola de 0,4 kg se move a 15 m/s. Qual é a sua quantidade de movimento?",
"molde": "generico",
"vars": [
"m = 0,4 kg",
"v = 15 m/s"
],
"formula": "Q = m·v",
"subst": "Q = (0,4) · (15)",
"resultado": "Q = 6 kg·m/s"
},
{
"key": "calc_m064",
"alt": "Resolução animada: Uma força média de 200 N atua sobre um corpo por 0,05 s. Qual é o impulso dessa força?",
"molde": "generico",
"vars": [
"F = 200 N",
"Δt = 0,05 s"
],
"formula": "I = F·Δt",
"subst": "I = (200) · (0,05)",
"resultado": "I = 10 N·s"
},
{
"key": "calc_m065",
"alt": "Resolução animada: Uma bola de 0,5 kg, inicialmente parada, é chutada e sai com 20 m/s. O contato dura 0,01 s. Qual é a força média do chute?",
"molde": "generico",
"vars": [
"m = 0,5 kg",
"Δv = 20 m/s",
"Δt = 0,01 s"
],
"formula": "F = m·Δv / Δt",
"subst": "F = (0,5) · (20)/(0,01)",
"resultado": "F = 1000 N"
},
{
"key": "calc_m066",
"alt": "Resolução animada: Um bloco de 2 kg com velocidade de 6 m/s colide com um bloco de 4 kg parado, e os dois ficam unidos. Qual é a velocidade do conjunto logo ap",
"molde": "generico",
"vars": [
"m₁ = 2 kg",
"v₁ = 6 m/s",
"m₂ = 4 kg"
],
"formula": "v = m₁·v₁ / (m₁ + m₂)",
"subst": "v = (2) · (6)/((2)+(4))",
"resultado": "v = 2 m/s"
},
{
"key": "calc_m072",
"alt": "Resolução animada: Dois corpos de 1000 kg e 2000 kg estão a 10 m de distância. Com G = 6,67 × 10⁻¹¹ N·m²/kg², qual é a força gravitacional entre eles?",
"molde": "generico",
"vars": [
"m₁ = 1000 kg",
"m₂ = 2000 kg",
"d = 10 m"
],
"formula": "F = G·m₁·m₂ / d²",
"subst": "F = G · (1000) · (2000)/((10) · (10))",
"resultado": "F = 1,33·10⁻⁶ N"
},
{
"key": "calc_m075",
"alt": "Resolução animada: A Terra tem massa de 6 × 10²⁴ kg e raio de 6,4 × 10⁶ m. Com G = 6,67 × 10⁻¹¹ N·m²/kg², qual é a aceleração da gravidade na sua superfície?",
"molde": "generico",
"vars": [
"M = 6·10²⁴ kg",
"R = 6,4·10⁶ m"
],
"formula": "g = G·M / R²",
"subst": "g = G · (6·10²⁴)/((6,4·10⁶) · (6,4·10⁶))",
"resultado": "g = 9,776 m/s²"
},
{
"key": "calc_d002",
"alt": "Resolução animada: Pela seção de um fio passam 120 C de carga em 40 s. Qual é a intensidade da corrente elétrica?",
"molde": "generico",
"vars": [
"Q = 120 C",
"Δt = 40 s"
],
"formula": "i = Q / Δt",
"subst": "i = (120)/(40)",
"resultado": "i = 3 A"
},
{
"key": "calc_d003",
"alt": "Resolução animada: Um fio é percorrido por uma corrente de 2 A durante 5 minutos. Qual é a carga que atravessa a seção do fio nesse intervalo?",
"molde": "generico",
"vars": [
"i = 2 A",
"Δt = 5 min"
],
"formula": "Q = i · Δt",
"subst": "Q = (2) · (5)",
"resultado": "Q = 600 C"
},
{
"key": "calc_d006",
"alt": "Resolução animada: Uma corrente de 250 mA circula por um aparelho durante 2 h. Qual é a carga que atravessa o aparelho?",
"molde": "generico",
"vars": [
"i = 250 mA",
"Δt = 2 h"
],
"formula": "Q = i · Δt",
"subst": "Q = (250) · (2)",
"resultado": "Q = 1800 C"
},
{
"key": "calc_d008",
"alt": "Resolução animada: Um resistor de 20 Ω é percorrido por uma corrente de 3 A. Qual é a tensão entre seus terminais?",
"molde": "generico",
"vars": [
"R = 20 Ω",
"i = 3 A"
],
"formula": "U = R · i",
"subst": "U = (20) · (3)",
"resultado": "U = 60 V"
},
{
"key": "calc_d009",
"alt": "Resolução animada: Um resistor de 4 Ω é ligado a uma fonte de 12 V. Qual é a corrente que o atravessa?",
"molde": "generico",
"vars": [
"U = 12 V",
"R = 4 Ω"
],
"formula": "i = U / R",
"subst": "i = (12)/(4)",
"resultado": "i = 3 A"
},
{
"key": "calc_d010",
"alt": "Resolução animada: Um chuveiro ligado em 220 V é atravessado por uma corrente de 5 A. Qual é a resistência elétrica do seu resistor?",
"molde": "generico",
"vars": [
"U = 220 V",
"i = 5 A"
],
"formula": "R = U / i",
"subst": "R = (220)/(5)",
"resultado": "R = 44 Ω"
},
{
"key": "calc_d011",
"alt": "Resolução animada: Um resistor de 2 kΩ é percorrido por uma corrente de 5 mA. Qual é a tensão entre seus terminais?",
"molde": "generico",
"vars": [
"R = 2 kΩ",
"i = 5 mA"
],
"formula": "U = R · i",
"subst": "U = (2) · (5)",
"resultado": "U = 10 V"
},
{
"key": "calc_d016",
"alt": "Resolução animada: Um fio de cobre tem resistividade de 1,7 × 10⁻⁸ Ω·m, comprimento de 100 m e seção de 1 mm² (1 × 10⁻⁶ m²). Qual é a sua resistência?",
"molde": "generico",
"vars": [
"ρ = 1,7·10⁻⁸ Ω·m",
"L = 100 m",
"A = 1·10⁻⁶ m²"
],
"formula": "R = ρ · L / A",
"subst": "R = (1,7·10⁻⁸) · (100)/(1·10⁻⁶)",
"resultado": "R = 1,7 Ω"
},
{
"key": "calc_d020",
"alt": "Resolução animada: Um fio de nicromo tem resistividade de 1 × 10⁻⁶ Ω·m e seção de 2 × 10⁻⁶ m². Que comprimento ele deve ter para que sua resistência seja de 10",
"molde": "generico",
"vars": [
"R = 10 Ω",
"A = 2·10⁻⁶ m²",
"ρ = 1·10⁻⁶ Ω·m"
],
"formula": "L = R · A / ρ",
"subst": "L = (10) · (2·10⁻⁶)/(1·10⁻⁶)",
"resultado": "L = 20 m"
},
{
"key": "calc_d024",
"alt": "Resolução animada: Três resistores de 10 Ω, 20 Ω e 30 Ω são ligados em série. Qual é a resistência equivalente?",
"molde": "generico",
"vars": [
"R₁ = 10 Ω",
"R₂ = 20 Ω",
"R₃ = 30 Ω"
],
"formula": "Req = R1 + R2 + R3",
"subst": "Req = (10)+(20)+(30)",
"resultado": "Req = 60 Ω"
},
{
"key": "calc_d025",
"alt": "Resolução animada: Dois resistores de 2 Ω e 4 Ω são ligados em série a uma fonte de 12 V. Qual é a corrente no circuito?",
"molde": "generico",
"vars": [
"U = 12 V",
"R₁ = 2 Ω",
"R₂ = 4 Ω"
],
"formula": "i = U / (R1 + R2)",
"subst": "i = (12)/((2)+(4))",
"resultado": "i = 2 A"
},
{
"key": "calc_d026",
"alt": "Resolução animada: Dois resistores, de 2 Ω e 4 Ω, são ligados em série a uma fonte de 12 V. Qual é a tensão no resistor de 4 Ω?",
"molde": "generico",
"vars": [
"U = 12 V",
"R₁ = 2 Ω",
"R₂ = 4 Ω"
],
"formula": "U₂ = R₂ · i",
"subst": "U₂ = (12) · (4)/((2)+(4))",
"resultado": "U₂ = 8 V"
},
{
"key": "calc_d031",
"alt": "Resolução animada: Dois resistores, de 6 Ω e 3 Ω, são ligados em paralelo. Qual é a resistência equivalente?",
"molde": "generico",
"vars": [
"R₁ = 6 Ω",
"R₂ = 3 Ω"
],
"formula": "Req = R₁·R₂ / (R₁ + R₂)",
"subst": "Req = (6) · (3)/((6)+(3))",
"resultado": "Req = 2 Ω"
},
{
"key": "calc_d032",
"alt": "Resolução animada: Três resistores iguais, de 12 Ω cada, são ligados em paralelo. Qual é a resistência equivalente?",
"molde": "generico",
"vars": [
"R = 12 Ω"
],
"formula": "Req = R / n",
"subst": "Req = 1/(3/(12))",
"resultado": "Req = 4 Ω"
},
{
"key": "calc_d033",
"alt": "Resolução animada: Dois resistores, de 8 Ω e 12 Ω, são ligados em paralelo a uma fonte de 24 V. Qual é a corrente total fornecida pela fonte?",
"molde": "generico",
"vars": [
"U = 24 V",
"R₁ = 8 Ω",
"R₂ = 12 Ω"
],
"formula": "i = U/R₁ + U/R₂",
"subst": "i = (24)/(8)+(24)/(12)",
"resultado": "i = 5 A"
},
{
"key": "calc_d034",
"alt": "Resolução animada: Dois resistores, de 8 Ω e 12 Ω, são ligados em paralelo. Qual é a resistência equivalente?",
"molde": "generico",
"vars": [
"R₁ = 8 Ω",
"R₂ = 12 Ω"
],
"formula": "Req = R₁·R₂ / (R₁ + R₂)",
"subst": "Req = (8) · (12)/((8)+(12))",
"resultado": "Req = 4,8 Ω"
},
{
"key": "calc_d040",
"alt": "Resolução animada: Um resistor de 4 Ω está em série com dois resistores em paralelo, de 6 Ω e 3 Ω. Qual é a resistência equivalente do conjunto?",
"molde": "generico",
"vars": [
"R₁ = 4 Ω",
"R₂ = 6 Ω",
"R₃ = 3 Ω"
],
"formula": "Req = R₁ + R₂·R₃ / (R₂ + R₃)",
"subst": "Req = (4)+(6) · (3)/((6)+(3))",
"resultado": "Req = 6 Ω"
},
{
"key": "calc_d041",
"alt": "Resolução animada: O conjunto formado por um resistor de 4 Ω em série com dois resistores em paralelo (6 Ω e 3 Ω) é ligado a uma fonte de 12 V. Qual é a corren",
"molde": "generico",
"vars": [
"U = 12 V",
"R₁ = 4 Ω",
"R₂ = 6 Ω",
"R₃ = 3 Ω"
],
"formula": "i = U / Req",
"subst": "i = (12)/((4)+(6) · (3)/((6)+(3)))",
"resultado": "i = 2 A"
},
{
"key": "calc_d042",
"alt": "Resolução animada: No mesmo circuito (4 Ω em série com 6 Ω e 3 Ω em paralelo, fonte de 12 V), qual é a tensão sobre o conjunto de 6 Ω e 3 Ω?",
"molde": "generico",
"vars": [
"U = 12 V",
"R₁ = 4 Ω",
"R₂ = 6 Ω",
"R₃ = 3 Ω"
],
"formula": "U = Rp · i",
"subst": "U = (12) · (6) · (3)/((4) · ((6)+(3))+(6) · (3))",
"resultado": "U = 4 V"
},
{
"key": "calc_d043",
"alt": "Resolução animada: Um aparelho ligado em 220 V é atravessado por uma corrente de 5 A. Qual é a sua potência elétrica?",
"molde": "generico",
"vars": [
"U = 220 V",
"i = 5 A"
],
"formula": "P = U · i",
"subst": "P = (220) · (5)",
"resultado": "P = 1100 W"
},
{
"key": "calc_d044",
"alt": "Resolução animada: Um resistor de 24 Ω é ligado a uma tensão de 120 V. Qual é a potência que ele dissipa?",
"molde": "generico",
"vars": [
"U = 120 V",
"R = 24 Ω"
],
"formula": "P = U² / R",
"subst": "P = (120) · (120)/(24)",
"resultado": "P = 600 W"
},
{
"key": "calc_d045",
"alt": "Resolução animada: Um resistor de 10 Ω é percorrido por uma corrente de 3 A. Qual é a potência dissipada?",
"molde": "generico",
"vars": [
"R = 10 Ω",
"i = 3 A"
],
"formula": "P = R · i²",
"subst": "P = (10) · (3) · (3)",
"resultado": "P = 90 W"
},
{
"key": "calc_d046",
"alt": "Resolução animada: Um chuveiro de 5500 W é ligado em 220 V. Qual é a corrente que ele puxa da rede?",
"molde": "generico",
"vars": [
"P = 5500 W",
"U = 220 V"
],
"formula": "i = P / U",
"subst": "i = (5500)/(220)",
"resultado": "i = 25 A"
},
{
"key": "calc_d047",
"alt": "Resolução animada: Um chuveiro com valores nominais de 220 V e 4400 W tem um resistor de qual resistência?",
"molde": "generico",
"vars": [
"U = 220 V",
"P = 4400 W"
],
"formula": "R = U² / P",
"subst": "R = (220) · (220)/(4400)",
"resultado": "R = 11 Ω"
},
{
"key": "calc_d052",
"alt": "Resolução animada: Um chuveiro de 4000 W fica ligado por 15 minutos. Qual é a energia elétrica consumida, em kWh?",
"molde": "generico",
"vars": [
"P = 4000 W",
"Δt = 15 min"
],
"formula": "E = P · Δt",
"subst": "E = (4000) · (15)",
"resultado": "E = 1 kWh"
},
{
"key": "calc_d053",
"alt": "Resolução animada: Uma lâmpada de 60 W fica acesa 5 horas por dia durante 30 dias (150 horas no total). Qual é a energia consumida, em kWh?",
"molde": "generico",
"vars": [
"P = 60 W",
"Δt = 150 h"
],
"formula": "E = P · Δt",
"subst": "E = (60) · (150)",
"resultado": "E = 9 kWh"
},
{
"key": "calc_d054",
"alt": "Resolução animada: Uma lâmpada de 100 W fica ligada por 2 minutos. Qual é a energia elétrica transformada, em joules?",
"molde": "generico",
"vars": [
"P = 100 W",
"Δt = 2 min"
],
"formula": "E = P · Δt",
"subst": "E = (100) · (2)",
"resultado": "E = 1,2·10⁴ J"
},
{
"key": "calc_d055",
"alt": "Resolução animada: Um aparelho de 1500 W consumiu 3 kWh de energia. Por quanto tempo ele ficou ligado?",
"molde": "generico",
"vars": [
"E = 3 kWh",
"P = 1500 W"
],
"formula": "Δt = E / P",
"subst": "t = (3)/(1500)",
"resultado": "t = 2 h"
},
{
"key": "calc_d060",
"alt": "Resolução animada: Um resistor de 10 Ω é atravessado por uma corrente de 2 A durante 5 minutos. Qual é a energia dissipada na forma de calor?",
"molde": "generico",
"vars": [
"R = 10 Ω",
"i = 2 A",
"Δt = 5 min"
],
"formula": "E = R · i² · Δt",
"subst": "E = (10) · (2) · (2) · (5)",
"resultado": "E = 1,2·10⁴ J"
},
{
"key": "calc_d061",
"alt": "Resolução animada: Um fio de resistência 0,5 Ω é atravessado por uma corrente de 10 A. Qual é a potência dissipada por efeito Joule?",
"molde": "generico",
"vars": [
"R = 0,5 Ω",
"i = 10 A"
],
"formula": "P = R · i²",
"subst": "P = (0,5) · (10) · (10)",
"resultado": "P = 50 W"
},
{
"key": "calc_d067",
"alt": "Resolução animada: Um gerador tem força eletromotriz de 12 V e resistência interna de 1 Ω. Qual é a tensão entre seus terminais quando ele fornece 2 A?",
"molde": "generico",
"vars": [
"ε = 12 V",
"r = 1 Ω",
"i = 2 A"
],
"formula": "U = ε − r · i",
"subst": "U = (12)-(1) · (2)",
"resultado": "U = 10 V"
},
{
"key": "calc_d068",
"alt": "Resolução animada: Um gerador de fem 12 V e resistência interna 1 Ω alimenta um resistor externo de 5 Ω. Qual é a corrente no circuito?",
"molde": "generico",
"vars": [
"ε = 12 V",
"r = 1 Ω",
"R = 5 Ω"
],
"formula": "i = ε / (r + R)",
"subst": "i = (12)/((1)+(5))",
"resultado": "i = 2 A"
},
{
"key": "calc_d069",
"alt": "Resolução animada: Uma bateria de fem 12 V e resistência interna 0,5 Ω é colocada em curto-circuito. Qual é a corrente de curto-circuito?",
"molde": "generico",
"vars": [
"ε = 12 V",
"r = 0,5 Ω"
],
"formula": "icc = ε / r",
"subst": "icc = (12)/(0,5)",
"resultado": "icc = 24 A"
}
]/*AUTO:END*/;
function flame(x,y,cl){return'<g class="'+cl+'"><path d="M'+x+' '+y+'c-9-9-9-17-2-26 1 6 5 8 7 13 3-4 2-9 1-12 8 8 11 17 3 25-3 4-6 4-9 0z" fill="'+HOT+'" stroke="#a63a0f" stroke-width="1.2"/><path d="M'+x+' '+(y-2)+'c-4-4-3-9 0-13 2 4 5 6 1 13z" fill="#facc15"/></g>'}
function arr(x1,y1,x2,y2,c,cl){var a=Math.atan2(y2-y1,x2-x1),h=7;return'<g class="'+cl+'"><line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="3" stroke-linecap="round"/><path d="M'+x2+' '+y2+'L'+(x2-h*Math.cos(a-.5))+' '+(y2-h*Math.sin(a-.5))+'L'+(x2-h*Math.cos(a+.5))+' '+(y2-h*Math.sin(a+.5))+'z" fill="'+c+'"/></g>'}
/* desenho pequeno (altura até 84) que ilustra o tipo de conta; cada molde é opcional */
function motivo(m,T,tr){var s="";
 if(m==="dilatacao"){s+='<rect x="40" y="26" width="14" height="40" fill="#9aa6b8" stroke="currentColor" stroke-width="2"/><rect x="56" y="38" width="170" height="18" rx="3" fill="#9aa6b8" fill-opacity=".55" stroke="currentColor" stroke-width="2"/><rect class="ex" x="226" y="38" width="30" height="18" rx="3" fill="'+HOT+'" fill-opacity=".7" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:0 50%"/>'+flame(140,78,"fl");tr.push(N.sc(".ex",T,[[0,.05,1],[2,.05,1],[9,1,1]]))}
 else if(m==="calor"){s+='<path d="M120 22V70a6 6 0 0 0 6 6h68a6 6 0 0 0 6-6V22" fill="none" stroke="currentColor" stroke-width="2.4"/><rect class="lq" x="122" y="38" width="76" height="36" rx="3" fill="'+COLD+'" fill-opacity=".5" style="transform-box:fill-box;transform-origin:50% 100%"/>'+flame(160,80,"fl");tr.push(N.op(".fl",T,[[0,0],[2,0],[2.4,1],[T,1]]));tr.push(N.sc(".lq",T,[[0,1,1],[2,1,1],[9,1,1.04]]))}
 else if(m==="pressao"){s+='<rect x="120" y="14" width="80" height="62" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="121.5" y="30" width="77" height="44.5" fill="'+COLD+'" fill-opacity=".5"/>'+arr(160,36,160,70,"var(--f-forca,#b45309)","pa")+'<line x1="214" y1="30" x2="214" y2="74" stroke="currentColor" stroke-width="1.4"/><text x="222" y="56" font-size="12" font-weight="700">h</text>';tr.push(N.vis(".pa",T,2.4))}
 else if(m==="coulomb"){s+='<circle cx="86" cy="46" r="15" fill="#ef4444" fill-opacity=".85" stroke="currentColor" stroke-width="2"/><circle cx="234" cy="46" r="15" fill="#3b82f6" fill-opacity=".85" stroke="currentColor" stroke-width="2"/>'+t_(86,51,"+",{s:16,f:"#fff"})+t_(234,51,"−",{s:16,f:"#fff"})+arr(110,46,140,46,"var(--f-forca,#b45309)","fa")+arr(210,46,180,46,"var(--f-forca,#b45309)","fb")+'<line x1="86" y1="72" x2="234" y2="72" stroke="currentColor" stroke-width="1.4"/>'+t_(160,84,"d",{s:12});tr.push(N.vis(".fa",T,2.4));tr.push(N.vis(".fb",T,2.4))}
 else if(m==="bernoulli"){s+='<path d="M30 24H120L170 40H290M30 70H120L170 54H290" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="31" y="25" width="88" height="44" fill="'+COLD+'" fill-opacity=".45"/><polygon points="120,25 170,41 170,53 120,69" fill="'+COLD+'" fill-opacity=".45"/><rect x="170" y="41" width="119" height="12" fill="'+COLD+'" fill-opacity=".45"/>'+arr(50,47,100,47,"var(--f-forca,#b45309)","pa")+arr(200,47,270,47,"var(--f-forca,#b45309)","pb")+t_(75,18,"v₁",{s:12})+t_(235,36,"v₂",{s:12});tr.push(N.vis(".pa",T,1.5));tr.push(N.vis(".pb",T,2.4))}
 else if(m==="latente"){s+='<rect class="ice" x="130" y="30" width="60" height="40" rx="5" fill="#bfe3f5" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:50% 100%"/><path d="M110 74H210" stroke="currentColor" stroke-width="2.4"/><ellipse class="pd" cx="160" cy="74" rx="10" ry="3" fill="'+COLD+'" fill-opacity=".7" style="transform-box:fill-box;transform-origin:50% 50%"/>'+flame(160,86,"fl");tr.push(N.sc(".ice",T,[[0,1,1],[2,1,1],[9,.35,.4]]));tr.push(N.sc(".pd",T,[[0,.1,1],[2,.1,1],[9,5,1.6]]))}
 else if(m==="potencial"){s+='<circle cx="160" cy="46" r="26" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/><circle cx="160" cy="46" r="40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/><circle cx="160" cy="46" r="10" fill="#ef4444" fill-opacity=".85" stroke="currentColor" stroke-width="2"/>'+t_(160,50,"+",{s:13,f:"#fff"})+'<g class="qt"><circle cx="196" cy="46" r="5" fill="#3b82f6" stroke="currentColor" stroke-width="1.5"/>'+t_(196,38,"q",{s:10})+'</g>';tr.push(N.tr(".qt",T,[[0,0,0],[2,0,0],[9,-14,0]]))}
 return s}
function build(d){var H=214,vars=d.vars||[],n=Math.min(vars.length,4),T=16,tr=[],s=motivo(d.molde,T,tr);
 vars.slice(0,4).forEach(function(v,k){s+=t_(160,100+15*k-(n>3?4:0),v,{s:12})});
 s+='<g class="s2">'+t_(160,168,d.formula,{s:13})+'</g><g class="s3">'+t_(160,186,d.subst,{s:13})+'</g><g class="s4">'+t_(160,206,d.resultado,{s:15,c:"fin"})+'</g>';
 var st=[[0,"Dados do problema"],[3,"Fórmula que relaciona as grandezas"],[6,"Substituindo os valores|(confira as unidades)"],[9.5,"Resultado"]],
 c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H);
 for(var k=1;k<st.length;k++)tr.push(N.vis(".s"+(k+1),T,st[k][0]));
 N.reg(d.key,{a:d.alt,h:H,s:s+c.s,t:tr.concat(c.t),T:T})}
DATA.forEach(function(d){try{build(d)}catch(e){}});
})();
