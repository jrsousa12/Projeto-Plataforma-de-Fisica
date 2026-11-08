# Lote 2 de Ondulatória: Som (seções 6 a 11).
import sys,os,io,contextlib
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
with contextlib.redirect_stdout(io.StringIO()):
    from onda_q1 import F,mc,vf,calc,TM,HP,OSX,PE,IE
import json
PH="PhET"
INTF=F(PH,"https://phet.colorado.edu/pt_BR/simulations/wave-interference","Interferência de Onda","interferência construtiva e destrutiva",["interferência","ondas"])
WIN=F(PH,"https://phet.colorado.edu/pt_BR/simulations/waves-intro","Ondas: Introdução","propagação, reflexão e contorno de obstáculos por ondas",["ondas","frequência"])
RES=F(OSX,"https://openstax.org/books/university-physics-volume-1/pages/16-6-standing-waves-and-resonance","16.6 Standing Waves and Resonance","ressonância e ondas estacionárias",["resonance","standing wave"])
BEAT=F(HP,"https://hyperphysics.phy-astr.gsu.edu/hbase/Sound/beat.html","Beats","batimentos e frequência de batimento",["beat","frequency"])
DOP=F(TM,"https://www.todamateria.com.br/efeito-doppler/","Efeito Doppler","frequência percebida na aproximação e no afastamento",["efeito Doppler","frequência"])
DOPX=F(TM,"https://www.todamateria.com.br/exercicios-sobre-o-efeito-doppler-com-gabarito/","Exercícios sobre o efeito Doppler","cálculo da frequência percebida",["Doppler","observador"])
DOPH=F(HP,"https://hyperphysics.phy-astr.gsu.edu/hbase/Sound/dopp.html","Doppler Effect","frequência percebida com fonte em movimento",["Doppler","source"])
SHK=F(OSX,"https://openstax.org/books/university-physics-volume-1/pages/17-8-shock-waves","17.8 Shock Waves","número de Mach e cone de onda de choque",["shock wave","Mach"])
STR=F(HP,"https://hyperphysics.phy-astr.gsu.edu/hbase/Waves/string.html","Waves on a String","velocidade na corda e frequências naturais",["string","tension"])
HAR=F(IE,"https://www.infoescola.com/fisica/harmonica/","Harmônica (harmônicos em cordas e tubos)","harmônicos em cordas e tubos",["harmônicos","cordas"])
OPE=F(HP,"https://hyperphysics.phy-astr.gsu.edu/hbase/Waves/opecol.html","Open Tube Resonance","tubo aberto: todos os harmônicos",["open","harmonics"])
CLO=F(HP,"https://hyperphysics.phy-astr.gsu.edu/hbase/Waves/clocol.html","Closed Tube Resonance","tubo fechado: harmônicos ímpares",["closed","odd harmonics"])
NOR=F(OSX,"https://openstax.org/books/university-physics-volume-1/pages/17-4-normal-modes-of-a-standing-sound-wave","17.4 Normal Modes of a Standing Sound Wave","modos normais em tubos",["normal modes","open"])
DBH=F(HP,"https://hyperphysics.phy-astr.gsu.edu/hbase/Sound/db.html","Decibel Level Comparison Chart","unidade bel e decibel",["decibel","bel"])
Q=[]
# ---------- 6. fenômenos ondulatórios
Q+=[
mc("fn","Uma pessoa ouve a conversa de colegas que estão do outro lado de um muro, mas não consegue vê-los. Qual fenômeno explica por que o som chega até ela?",
 ["Difração: o som contorna o obstáculo, pois seu comprimento de onda é comparável às dimensões do muro.","Refração: o som atravessa o muro sem mudar de direção.","Polarização: o muro filtra a vibração.","Efeito Doppler: a pessoa se aproxima da fonte."],
 "O comprimento de onda do som vai de centímetros a vários metros, comparável ao tamanho de obstáculos comuns. Por isso ele contorna (difrata) o muro. A luz tem comprimento de onda minúsculo e quase não contorna.","Compare o comprimento de onda do som com o do muro.",
 ["Refração é mudança de velocidade ao trocar de meio.","Polarização só ocorre em ondas transversais, e o som no ar é longitudinal.","O efeito Doppler envolve movimento relativo, que aqui não existe."],WIN,2,
 mot="Conceito sobre contorno de obstáculos, sem cálculo; a animação disponível não cobre difração."),
mc("fn","Fones de ouvido com cancelamento de ruído captam o som do ambiente e emitem uma onda com a mesma frequência e amplitude, mas em oposição de fase. Qual fenômeno reduz o ruído?",
 ["Interferência destrutiva.","Interferência construtiva.","Reverberação.","Difração."],
 "Duas ondas iguais em oposição de fase se anulam ao se superpor. É a interferência destrutiva.","Ondas em oposição de fase se somam ou se anulam?",
 ["Na construtiva as ondas estão em fase e o som aumenta.","Reverberação é prolongamento do som por reflexões.","Difração é o contorno de obstáculos."],INTF,2,
 mot="Conceito sobre superposição de ondas, sem cálculo; sem animação própria nesta área."),
mc("fn","Um cantor consegue quebrar uma taça de cristal ao emitir uma nota. Qual fenômeno explica o fato?",
 ["Ressonância: a frequência do som é igual à frequência natural de vibração da taça.","Eco: o som volta da parede e bate na taça.","Efeito Doppler: o cantor se move em relação à taça.","Batimento: dois sons diferentes se somam."],
 "Quando a frequência do som é igual a uma frequência natural da taça, ela absorve energia a cada ciclo e vibra com amplitude crescente, até quebrar. É a ressonância.","Pense na frequência natural de vibração.",
 ["O eco é uma reflexão percebida depois de 0,1 s.","Doppler exige movimento relativo entre fonte e receptor.","Batimento ocorre com duas frequências próximas."],RES,2,
 mot="Conceito de ressonância, sem cálculo e sem cena disponível."),
mc("fn","Dois alto-falantes idênticos emitem o mesmo tom, e as ondas chegam em fase a um ponto. O que se percebe nesse ponto?",
 ["Um som mais intenso, por interferência construtiva.","Silêncio, por interferência destrutiva.","Um som mais agudo.","Um som mais lento."],
 "Ondas em fase se somam: a amplitude resultante é maior e o som é mais intenso (interferência construtiva). A frequência não muda.","Em fase significa que as vibrações se reforçam.",
 ["O silêncio ocorreria com ondas em oposição de fase.","A frequência continua a mesma, logo a altura não muda.","A velocidade do som no ar não depende da interferência."],INTF,2,
 mot="Conceito de superposição, sem cálculo e sem cena disponível."),
calc("fn","Dois diapasões, de 440 Hz e 444 Hz, soam ao mesmo tempo. Quantos batimentos por segundo se percebem?",
 ["4 Hz","884 Hz","442 Hz","0,25 Hz"],
 "A frequência de batimento é a diferença entre as frequências: f = 444 − 440 = 4 Hz.","A frequência de batimento é a diferença.",
 ["Somou as frequências.","442 Hz é a média, a frequência percebida do som.","Usou o inverso da diferença."],BEAT,
 {"f1":"440 Hz","f2":"444 Hz"},"f2-f1","abs(f1-f2)","Hz","f_bat","f_bat = |f₂ − f₁|",{"f1":"f₁","f2":"f₂"},"generico",2),
calc("fn","Dois sons de 512 Hz e 516 Hz são produzidos juntos. Qual é a frequência do som resultante que o ouvinte percebe, entre os batimentos?",
 ["514 Hz","4 Hz","1028 Hz","2 Hz"],
 "O som percebido tem frequência média: f = (512 + 516) / 2 = 514 Hz. Os batimentos têm 4 Hz.","A frequência percebida é a média das duas.",
 ["4 Hz é a frequência dos batimentos, e não a do som.","Somou as duas frequências.","Dividiu a diferença por 2."],BEAT,
 {"f1":"512 Hz","f2":"516 Hz"},"(f1+f2)/2","f1+(f2-f1)/2","Hz","f","f = (f₁ + f₂) / 2",{"f1":"f₁","f2":"f₂"},"generico",3),
]
# ---------- 7. Doppler e onda de choque
Q+=[
mc("dp","Uma ambulância com a sirene ligada se aproxima de um pedestre parado. Ele percebe o som da sirene:",
 ["Mais agudo, pois a frequência percebida é maior que a emitida.","Mais grave, pois a frequência percebida é menor que a emitida.","Mais forte, mas com a mesma frequência.","Com a mesma frequência e a mesma altura."],
 "Na aproximação, as frentes de onda chegam mais próximas umas das outras. A frequência percebida aumenta e o som parece mais agudo (efeito Doppler).","Pense nas frentes de onda mais juntas.",
 ["O som mais grave ocorre no afastamento.","A intensidade pode mudar, mas o efeito Doppler altera a frequência percebida.","A frequência percebida muda, mesmo que a emitida seja constante."],DOP,1,an="doppler"),
mc("dp","A ambulância passa pelo pedestre e começa a se afastar. O que acontece com a frequência emitida pela sirene e com a percebida pelo pedestre?",
 ["A emitida não muda, e a percebida fica menor.","A emitida fica menor, e a percebida também.","A emitida não muda, e a percebida fica maior.","As duas ficam iguais à frequência do pedestre."],
 "A sirene continua emitindo a mesma frequência. No afastamento, as frentes de onda chegam mais espaçadas, e a frequência percebida diminui (som mais grave).","A fonte não muda; o que muda é o que chega ao ouvido.",
 ["A fonte emite sempre a mesma frequência.","No afastamento a frequência percebida diminui.","O pedestre não tem frequência própria."],DOP,2,an="doppler"),
vf("dp","no efeito Doppler, o movimento da fonte altera a velocidade com que o som se propaga no ar.",False,
 "Falso. A velocidade do som no ar depende do meio (e da temperatura), não do movimento da fonte. O que muda é o comprimento de onda à frente e atrás da fonte, e a frequência percebida.","A velocidade depende do meio.",
 "A velocidade do som é determinada pelo meio. O movimento da fonte muda λ e a frequência percebida.",DOPH,2,an="doppler"),
mc("dp","O radar usado para medir a velocidade de veículos em rodovias e o ultrassom Doppler, usado para medir o fluxo de sangue, se baseiam em qual fenômeno?",
 ["Efeito Doppler: a frequência da onda refletida em um corpo em movimento é diferente da emitida.","Ressonância: o corpo vibra na frequência natural.","Difração: a onda contorna o veículo.","Reverberação: o som se prolonga."],
 "Ao refletir em um corpo em movimento, a onda volta com a frequência alterada. A diferença entre a frequência emitida e a recebida permite calcular a velocidade (efeito Doppler).","Pense em onda refletida por algo em movimento.",
 ["Ressonância ocorre quando a frequência externa coincide com a natural.","Difração é contorno de obstáculos.","Reverberação é prolongamento do som em um ambiente."],DOP,2,an="doppler"),
calc("dp","Uma ambulância, com sirene de 800 Hz, se aproxima a 30 m/s de um observador parado. A velocidade do som no ar é 340 m/s. Qual é a frequência percebida pelo observador?",
 ["877 Hz","735 Hz","871 Hz","800 Hz"],
 "f' = f · v / (v − vF) = 800 · 340 / (340 − 30) = 877 Hz (aproximadamente).","Na aproximação, o denominador é v − vF.",
 ["Esse é o valor para a ambulância se afastando.","Trocou o sinal e usou v + vF no numerador.","800 Hz seria a frequência emitida, sem efeito Doppler."],DOPX,
 {"f":"800 Hz","v":"340 m/s","vf":"30 m/s"},"f*v/(v-vf)","f/(1-vf/v)","Hz","f'","f' = f · v / (v − v_F)",{"f":"f","v":"v","vf":"v_F"},"generico",3),
calc("dp","A mesma ambulância (sirene de 800 Hz), agora se afastando a 30 m/s de um observador parado, com o som a 340 m/s. Qual é a frequência percebida?",
 ["735 Hz","877 Hz","700 Hz","800 Hz"],
 "No afastamento, f' = f · v / (v + vF) = 800 · 340 / (340 + 30) = 735 Hz (aproximadamente).","No afastamento, o denominador é v + vF.",
 ["Esse é o valor para a ambulância se aproximando.","Subtraiu 100 Hz sem usar a fórmula.","800 Hz seria a frequência emitida."],DOPX,
 {"f":"800 Hz","v":"340 m/s","vf":"30 m/s"},"f*v/(v+vf)","f/(1+vf/v)","Hz","f'","f' = f · v / (v + v_F)",{"f":"f","v":"v","vf":"v_F"},"generico",3),
calc("dp","Um avião voa a 680 m/s em uma região onde a velocidade do som é de 340 m/s. Qual é o número de Mach do avião?",
 ["2","0,5","1","3"],
 "M = vavião / vsom = 680 / 340 = 2. O avião é supersônico.","O número de Mach é uma razão entre velocidades.",
 ["Inverteu a razão (340 / 680).","Mach 1 seria 340 m/s.","Somou as velocidades e dividiu por 340."],SHK,
 {"vf":"680 m/s","vs":"340 m/s"},"vf/vs","vf*(1/vs)","1","M","M = v_fonte / v_som",{"vf":"v_fonte","vs":"v_som"},"generico",2),
mc("dp","Um avião supersônico passa sobre uma cidade, e as pessoas ouvem um estrondo. Qual alternativa descreve corretamente esse fenômeno?",
 ["O estrondo acompanha todo o voo supersônico, pois a onda de choque em forma de cone vai varrendo o solo.","O estrondo ocorre uma única vez, no instante em que o avião atinge a velocidade do som.","O estrondo é causado pelo motor do avião, e não pela velocidade.","O estrondo só existe quando o avião está parado."],
 "Em voo supersônico, as frentes de onda se acumulam em um cone. A onda de choque é contínua e vai varrendo o solo ao longo da trajetória. Cada observador ouve o estrondo quando o cone passa por ele.","Pense em um cone que acompanha o avião.",
 ["Não é um evento único: a onda de choque é contínua enquanto o voo for supersônico.","O estrondo é efeito da velocidade, não do ruído do motor.","Parado, o avião não gera onda de choque."],SHK,3,an="mach"),
]
# ---------- 8. ondas estacionárias
Q+=[
mc("oe","Como se forma uma onda estacionária em uma corda presa nas duas extremidades?",
 ["Pela superposição de duas ondas iguais que se propagam em sentidos opostos, como a incidente e a refletida.","Pela superposição de duas ondas de frequências muito diferentes no mesmo sentido.","Pela passagem de um único pulso, sem reflexão.","Pela absorção da onda nas extremidades."],
 "Quando a onda incidente se reflete na ponta e se superpõe à onda que chega, com mesma frequência e amplitude, e sentidos opostos, surge um padrão de nós e ventres fixos: a onda estacionária.","Pense em onda incidente e onda refletida.",
 ["Ondas de frequências muito diferentes geram batimentos ou ondas complexas, não o padrão estacionário simples.","Sem reflexão não há onda contrária para formar o padrão.","Se a onda fosse absorvida, não haveria reflexão."],RES,2,an="estac"),
mc("oe","Em uma onda estacionária, o que são nós e ventres?",
 ["Nós são pontos de amplitude nula, e ventres, pontos de amplitude máxima.","Nós são pontos de amplitude máxima, e ventres, pontos de amplitude nula.","Nós são as extremidades livres, e ventres, as fixas.","Nós e ventres são pontos que se deslocam com a velocidade da onda."],
 "Nos nós, as ondas se anulam o tempo todo (amplitude zero). Nos ventres, elas se reforçam e a amplitude é máxima (o dobro da amplitude de cada onda).","Nó lembra “parado”.",
 ["É o contrário: o nó não vibra.","Extremidades fixas são nós; livres são ventres.","Os nós e os ventres ficam em posições fixas."],RES,1,an="estac"),
vf("oe","em uma onda estacionária ideal, há transporte de energia ao longo da corda.",False,
 "Falso. A onda estacionária não transporta energia de um ponto a outro: a energia fica oscilando entre as formas cinética e potencial entre os nós.","Pense em nós parados.",
 "A energia não flui ao longo da corda, pois as duas ondas componentes transportam energia em sentidos opostos e se compensam.",RES,3,an="estac"),
calc("oe","Em uma corda com onda estacionária, a distância entre dois nós consecutivos é de 15 cm. Qual é o comprimento de onda?",
 ["0,30 m","0,15 m","0,075 m","0,60 m"],
 "Entre dois nós consecutivos há meio comprimento de onda: λ/2 = 0,15 m. Logo λ = 0,30 m.","Entre dois nós consecutivos há λ/2.",
 ["Tomou a distância entre nós como λ inteiro.","Dividiu a distância por 2 em vez de multiplicar.","Multiplicou por 4."],STR,
 {"d":"15 cm"},"2*d","d+d","m","λ","λ = 2 · d",{"d":"d"},"generico",1),
calc("oe","Uma corda de 1,2 m, presa nas duas pontas, vibra com 3 fusos (3 ventres). Qual é o comprimento de onda?",
 ["0,8 m","1,2 m","2,4 m","0,4 m"],
 "Cada fuso vale λ/2. Com 3 fusos: L = 3 · λ/2, logo λ = 2 · 1,2 / 3 = 0,8 m.","Cada fuso é meio comprimento de onda.",
 ["Tomou L como o comprimento de onda.","Usou 2L sem dividir pelo número de fusos.","Dividiu L por 3."],STR,
 {"L":"1.2 m","n":"3"},"2*L/n","L/(n/2)","m","λ","λ = 2L / n",{"L":"L","n":"n"},"generico",3),
]
# ---------- 9. cordas vibrantes
Q+=[
mc("cv","Um violonista pressiona uma corda em um traste, encurtando a parte que vibra. O que ocorre com o som emitido?",
 ["Fica mais agudo, pois a frequência aumenta.","Fica mais grave, pois a frequência diminui.","Fica mais forte, mas com a mesma altura.","Muda de timbre, mas não de altura."],
 "Na corda presa nas pontas, f₁ = v / (2L). Com L menor e v igual, f₁ aumenta: o som fica mais agudo.","f₁ é inversamente proporcional a L.",
 ["Frequência menor daria um som mais grave.","A intensidade depende da amplitude.","A altura muda porque a frequência mudou."],STR,1),
mc("cv","Em um violão, as cordas mais grossas produzem sons mais graves que as finas. Isso ocorre porque, ao serem mais grossas (maior massa por unidade de comprimento), elas têm:",
 ["Velocidade de propagação menor e, portanto, frequência menor.","Velocidade de propagação maior e, portanto, frequência maior.","Tensão sempre maior e mesma frequência.","Comprimento maior, embora todas tenham o mesmo comprimento."],
 "Na corda, v = √(T/μ). Com μ maior, v diminui, e f₁ = v/(2L) também diminui: som mais grave.","Pense em v = √(T/μ).",
 ["Com μ maior, v diminui.","A tensão pode até ser igual, mas μ maior reduz v.","Todas as cordas de um violão têm o mesmo comprimento vibrante."],STR,2),
mc("cv","Ao aumentar a tensão de uma corda (afinar o instrumento), mantendo o comprimento e a massa por unidade de comprimento, o que ocorre com o som?",
 ["A frequência aumenta, pois v = √(T/μ) cresce.","A frequência diminui, pois a corda fica mais esticada.","A frequência não muda.","O timbre desaparece."],
 "Com T maior, v = √(T/μ) cresce e f₁ = v/(2L) cresce. Se a tensão quadruplicar, a frequência dobra.","A velocidade na corda aumenta com T.",
 ["É o contrário: mais tensão, som mais agudo.","Mudar T muda v e a frequência.","O timbre não desaparece: muda a altura."],STR,2),
calc("cv","Uma corda de violão de 0,5 m, presa nas duas pontas, emite como fundamental uma nota de 500 Hz. Qual é a velocidade das ondas na corda?",
 ["500 m/s","250 m/s","1000 m/s","2000 m/s"],
 "Para a fundamental, f₁ = v / (2L). Logo v = 2 · L · f₁ = 2 · 0,5 · 500 = 500 m/s.","Isole v em f₁ = v/(2L).",
 ["Usou L · f sem o fator 2.","Dividiu f por L.","Multiplicou por 4."],HAR,
 {"L":"0.5 m","f":"500 Hz"},"2*L*f","f*(2*L)","m/s","v","v = 2 · L · f₁",{"L":"L","f":"f₁"},"generico",2),
calc("cv","Uma corda tem massa por unidade de comprimento de 0,01 kg/m e é tracionada com 100 N. Qual é a velocidade das ondas na corda?",
 ["100 m/s","10000 m/s","10 m/s","1 m/s"],
 "v = √(T / μ) = √(100 / 0,01) = √10000 = 100 m/s.","Use a equação de Taylor: v = √(T/μ).",
 ["Esqueceu a raiz quadrada.","Usou a raiz de T e esqueceu μ.","Multiplicou T por μ e tirou a raiz."],STR,
 {"T":"100 N","mu":"0.01 kg/m"},"sqrt(T/mu)","(T/mu)**0.5","m/s","v","v = √(T / μ)",{"T":"T","mu":"μ"},"generico",3),
calc("cv","Uma corda de 2 m, presa nas duas pontas, vibra com dois harmônicos consecutivos de frequências 100 Hz e 125 Hz. Qual é a velocidade das ondas na corda?",
 ["100 m/s","200 m/s","50 m/s","450 m/s"],
 "Harmônicos consecutivos diferem de f₁: f₁ = 125 − 100 = 25 Hz. Então v = 2 · L · f₁ = 2 · 2 · 25 = 100 m/s.","A diferença entre harmônicos consecutivos é a fundamental.",
 ["Usou 4L · f₁ sem o fator correto.","Dividiu o resultado por 2.","Usou a média das frequências no lugar de f₁."],HAR,
 {"fa":"100 Hz","fb":"125 Hz","L":"2 m"},"2*L*(fb-fa)","(fb-fa)*L*2","m/s","v","v = 2 · L · (f₂ − f₁)",{"fa":"f₁","fb":"f₂","L":"L"},"generico",3),
calc("cv","Uma corda de 0,6 m, presa nas duas pontas, é percorrida por ondas de velocidade 360 m/s. Qual é a frequência do segundo harmônico?",
 ["600 Hz","300 Hz","1200 Hz","180 Hz"],
 "f₂ = 2 · v / (2L) = v / L = 360 / 0,6 = 600 Hz.","No segundo harmônico, n = 2.",
 ["300 Hz é a fundamental.","Usou n = 4.","Dividiu a velocidade por 2."],HAR,
 {"v":"360 m/s","L":"0.6 m"},"v/L","2*v/(2*L)","Hz","f₂","f₂ = 2 · v / (2L)",{"v":"v","L":"L"},"generico",2),
]
# ---------- 10. tubos sonoros
Q+=[
vf("ts","um tubo sonoro fechado em uma das extremidades emite somente harmônicos de ordem ímpar.",True,
 "Verdadeiro. No tubo fechado há nó na ponta fechada e ventre na aberta. Só cabem frequências f = n·v/(4L) com n ímpar (1, 3, 5…).","Pense em nó na ponta fechada e ventre na aberta.",
 "No tubo fechado só existem os harmônicos de ordem ímpar: 1º, 3º, 5º… Não existe o 2º harmônico.",CLO,2,an="tubos"),
mc("ts","Dois tubos sonoros têm o mesmo comprimento: um é aberto nas duas pontas e o outro é fechado em uma delas. Comparando as frequências fundamentais, o tubo fechado emite:",
 ["Uma frequência igual à metade da do tubo aberto.","Uma frequência igual ao dobro da do tubo aberto.","A mesma frequência do tubo aberto.","Uma frequência quatro vezes menor."],
 "Aberto: f₁ = v/(2L). Fechado: f₁ = v/(4L), que é metade. Ou seja, uma oitava abaixo.","Compare v/(2L) e v/(4L).",
 ["Dobro seria o contrário.","As fórmulas têm denominadores diferentes.","A razão entre os dois é 2, e não 4."],OPE,2,an="tubos"),
mc("ts","Uma flauta afinada em uma sala fria é usada em um palco quente e passa a soar mais aguda. A explicação é:",
 ["Com o ar mais quente, a velocidade do som aumenta; como f = v/(2L) e L não muda, a frequência aumenta.","Com o ar mais quente, o tubo se contrai muito e a frequência cai.","A temperatura muda a frequência da fonte, mas não a velocidade.","O ar quente é menos denso e por isso o som fica mais lento."],
 "A frequência de ressonância do tubo é proporcional à velocidade do som no ar do tubo. Com o ar quente, v aumenta e a frequência também.","Lembre como a temperatura afeta v.",
 ["A dilatação do tubo é desprezível frente à variação de v.","A velocidade, e não a fonte, muda com a temperatura.","No ar quente o som é mais rápido, não mais lento."],NOR,3),
calc("ts","Um tubo aberto nas duas extremidades tem 0,85 m. Com a velocidade do som igual a 340 m/s, qual é a frequência fundamental?",
 ["200 Hz","400 Hz","100 Hz","289 Hz"],
 "No tubo aberto, f₁ = v / (2L) = 340 / (2 · 0,85) = 200 Hz.","No tubo aberto, f₁ = v/(2L).",
 ["400 Hz usa L em vez de 2L.","100 Hz é a fundamental do tubo fechado.","Multiplicou v por L."],OPE,
 {"v":"340 m/s","L":"0.85 m"},"v/(2*L)","(v/L)/2","Hz","f₁","f₁ = v / (2L)",{"v":"v","L":"L"},"generico",2),
calc("ts","Um tubo fechado em uma extremidade tem 0,85 m. Com a velocidade do som igual a 340 m/s, qual é a frequência fundamental?",
 ["100 Hz","200 Hz","50 Hz","400 Hz"],
 "No tubo fechado, f₁ = v / (4L) = 340 / (4 · 0,85) = 100 Hz.","No tubo fechado, f₁ = v/(4L).",
 ["200 Hz é a do tubo aberto.","Dividiu por 8L.","Usou v / L."],CLO,
 {"v":"340 m/s","L":"0.85 m"},"v/(4*L)","(v/L)/4","Hz","f₁","f₁ = v / (4L)",{"v":"v","L":"L"},"generico",2),
calc("ts","Um tubo fechado em uma extremidade tem 0,5 m e a velocidade do som é 340 m/s. Qual é a frequência do terceiro harmônico (n = 3)?",
 ["510 Hz","340 Hz","1020 Hz","170 Hz"],
 "f₃ = 3 · v / (4L) = 3 · 340 / (4 · 0,5) = 510 Hz.","No tubo fechado, fₙ = n · v / (4L), com n ímpar.",
 ["340 Hz seria n = 2, que não existe no tubo fechado.","Usou 2L no denominador.","170 Hz é a fundamental."],CLO,
 {"n":"3","v":"340 m/s","L":"0.5 m"},"n*v/(4*L)","(n*v)/(L*4)","Hz","f₃","fₙ = n · v / (4L)",{"n":"n","v":"v","L":"L"},"generico",3),
calc("ts","Que comprimento deve ter um tubo aberto nas duas extremidades para que sua frequência fundamental seja 340 Hz? (velocidade do som: 340 m/s)",
 ["0,5 m","1,0 m","0,25 m","2,0 m"],
 "f₁ = v / (2L). Logo L = v / (2 f₁) = 340 / (2 · 340) = 0,5 m.","Isole L em f₁ = v/(2L).",
 ["Usou L = v / f₁, sem o fator 2.","Dividiu por 4 em vez de 2.","Multiplicou por 2 em vez de dividir."],OPE,
 {"v":"340 m/s","f":"340 Hz"},"v/(2*f)","(v/f)/2","m","L","L = v / (2 f₁)",{"v":"v","f":"f₁"},"generico",2),
]
# ---------- 11. cientistas e história
Q+=[
mc("cn","Quem propôs, em 1842, que a frequência de uma onda percebida por um observador depende do movimento relativo entre a fonte e o observador?",
 ["Christian Doppler.","Ernst Mach.","Alexander Graham Bell.","Hermann von Helmholtz."],
 "O físico austríaco Christian Doppler propôs a ideia em 1842. O efeito leva seu nome.","Lembre do nome do efeito.",
 ["Mach estudou ondas de choque e velocidades supersônicas.","Bell é lembrado pelo telefone e pela unidade que dá nome ao decibel.","Helmholtz estudou o timbre e a percepção do som."],DOP,1,
 mot="Questão sobre história da ciência, sem cálculo nem processo para animar."),
mc("cn","O número que compara a velocidade de um objeto com a do som no meio leva o nome de qual cientista?",
 ["Ernst Mach.","Christian Doppler.","Marin Mersenne.","Alexander Graham Bell."],
 "O número de Mach, M = v_objeto / v_som, homenageia o físico austríaco Ernst Mach, que estudou projéteis supersônicos e ondas de choque.","Lembre de “Mach 2”.",
 ["Doppler está ligado à variação de frequência percebida.","Mersenne estudou as cordas vibrantes.","Bell está ligado ao telefone e ao bel."],SHK,1,
 mot="Questão sobre história da ciência, sem cálculo nem processo para animar."),
mc("cn","O decibel (dB) é um submúltiplo do bel, unidade que homenageia qual personagem?",
 ["Alexander Graham Bell.","Isaac Newton.","Christian Doppler.","Ernst Mach."],
 "O bel foi nomeado em homenagem a Alexander Graham Bell, pioneiro das comunicações. O decibel vale um décimo do bel.","O nome da unidade lembra o inventor ligado ao telefone.",
 ["Newton dá nome à unidade de força.","Doppler dá nome ao efeito da frequência percebida.","Mach dá nome ao número de velocidade relativa ao som."],DBH,1,
 mot="Questão sobre história da ciência, sem cálculo nem processo para animar."),
]
print(len(Q))
json.dump({"quiz":"onda","questoes":Q},open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),"novas","onda_2.json"),"w",encoding="utf-8"),ensure_ascii=False,indent=1)
