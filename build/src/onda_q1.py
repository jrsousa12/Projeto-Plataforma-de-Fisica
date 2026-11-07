# Gera o lote 1 (seções 1 a 5) de Ondulatória: Som.
import json
TM="Toda Matéria"; HP="HyperPhysics"; OSX="OpenStax"; PE="PrePara Enem"; IE="InfoEscola"
def F(site,url,t,base,ver): return {"site":site,"url":url,"titulo":t,"conferido_em":"2026-11-07","base":base,"verificar":ver}
SOM=F(TM,"https://www.todamateria.com.br/ondas-sonoras/","Ondas sonoras","som como onda mecânica longitudinal, sem propagação no vácuo",["ondas sonoras","longitudinais"])
VEL=F(TM,"https://www.todamateria.com.br/velocidade-do-som/","Velocidade do som","velocidade do som nos meios e com a temperatura",["velocidade do som","temperatura"])
V172=F(OSX,"https://openstax.org/books/university-physics-volume-1/pages/17-2-speed-of-sound","17.2 Speed of Sound","rigidez, densidade e velocidade do som",["speed of sound","density"])
ACU=F(TM,"https://www.todamateria.com.br/acustica/","Acústica","qualidades do som: altura, intensidade e timbre",["intensidade","timbre"])
QUA=F(PE,"https://www.preparaenem.com/fisica/qualidades-fisiologicas-do-som.htm","Qualidades fisiológicas do som","altura, intensidade e timbre",["altura","timbre"])
INT=F(OSX,"https://openstax.org/books/university-physics-volume-1/pages/17-3-sound-intensity","17.3 Sound Intensity","intensidade e nível sonoro em decibéis",["intensity","decibel"])
DB=F(HP,"https://hyperphysics.phy-astr.gsu.edu/hbase/Sound/db.html","Decibel Level Comparison Chart","nível sonoro e razão de intensidades",["decibel","intensity"])
INV=F(HP,"https://hyperphysics.phy-astr.gsu.edu/hbase/Acoustic/invsqc.html","Inverse Square Law, Sound","fonte pontual e queda com o quadrado da distância",["inverse square","point source"])
EXO=F(TM,"https://www.todamateria.com.br/exercicios-sobre-ondas-sonoras-com-gabarito-explicado/","Exercícios sobre ondas sonoras","v = λ·f e propagação do som",["ondas sonoras","frequência"])
ECO=F(TM,"https://www.todamateria.com.br/exercicios-sobre-eco-e-reverberacao-questoes-resolvidas/","Exercícios sobre eco e reverberação","intervalo de 0,1 s e percurso de ida e volta",["eco","reverberação"])
EXA=F(TM,"https://www.todamateria.com.br/exercicio-sobre-acustica/","Exercício sobre acústica","audição e nível sonoro",["acústica","intensidade"])
NA=lambda m:{"decisao":"nao_aplica","motivo":m}
def mc(t,q,o,e,h,x,f,n=2,mot="Conceito sem cálculo e sem processo que precise de animação.",an=None):
    d={"t":t,"q":q,"o":o,"a":0,"h":h,"e":e,"x":{str(i+1):s for i,s in enumerate(x)},"n":n,"fonte":f}
    if an: d["an"]=an
    else: d["animacao"]=NA(mot)
    return d
def vf(t,q,verd,e,h,xp,f,n=1,mot="Afirmação conceitual, sem processo para animar.",an=None):
    d={"t":t,"q":"Verdadeiro ou falso: "+q,"o":["Verdadeiro","Falso"],"a":0 if verd else 1,"h":h,"e":e,"v":1,"x":{("1" if verd else "0"):xp},"n":n,"fonte":f}
    if an: d["an"]=an
    else: d["animacao"]=NA(mot)
    return d
def calc(t,q,o,e,h,x,f,vars_,expr,expr2,un,simb,form,rot,mol="generico",n=2,tol=None):
    c={"vars":vars_,"expr":expr,"expr2":expr2,"unidade":un,"simbolo":simb,"formula":form,"rotulos":rot}
    if tol: c["tol"]=tol
    return {"t":t,"q":q,"o":o,"a":0,"h":h,"e":e,"x":{str(i+1):s for i,s in enumerate(x)},"c":1,"n":n,"fonte":f,"calc":c,"animacao":{"decisao":"molde","molde":mol}}
Q=[]
# ---------- 1. ondas e grandezas
Q+=[
mc("on","Como é classificada a onda sonora que se propaga no ar?",
 ["Mecânica e longitudinal.","Mecânica e transversal.","Eletromagnética e longitudinal.","Eletromagnética e transversal."],
 "O som precisa de um meio material (é mecânico). No ar, as partículas vibram na mesma direção em que a onda avança (é longitudinal).","Pense no que vibra e em que direção.",
 ["Ondas transversais têm vibração perpendicular à propagação, o que não ocorre com o som no ar.","O som não é eletromagnético: precisa de meio material.","O som não é eletromagnético nem transversal no ar."],SOM,1,an="som_long"),
vf("on","o som pode se propagar no vácuo, como a luz do Sol.",False,
 "Falso. O som é uma onda mecânica e precisa de um meio material. A luz é eletromagnética e se propaga no vácuo.","Compare ondas mecânicas e eletromagnéticas.",
 "O som precisa de um meio (sólido, líquido ou gás). No vácuo não há partículas para transmitir a vibração.",SOM,1,an="som_long"),
mc("on","A luz de uma explosão no espaço chegaria até nós, mas o seu estrondo não. Por quê?",
 ["A luz é onda eletromagnética e se propaga no vácuo, enquanto o som é onda mecânica e precisa de meio material.","O som é muito mais lento e se perde no caminho.","A luz é longitudinal e o som é transversal.","No espaço há ar, mas ele é rarefeito demais para a luz."],
 "O som é uma onda mecânica: não existe no vácuo. A luz é uma onda eletromagnética e não depende de meio.","Pense no que cada onda precisa para se propagar.",
 ["A velocidade menor não impede o som de chegar. O que impede é a falta de meio.","O som no ar é longitudinal, e a luz é transversal.","O espaço entre os astros é praticamente vácuo."],SOM,2),
mc("on","Em uma onda sonora no ar, a distância entre duas compressões consecutivas é:",
 ["O comprimento de onda.","O período da onda.","A amplitude da onda.","A frequência da onda."],
 "Em uma onda longitudinal, o comprimento de onda é a distância entre duas compressões (ou duas rarefações) consecutivas.","Pense na distância que se repete na onda.",
 ["O período é um intervalo de tempo, não uma distância.","A amplitude mede a intensidade da vibração.","A frequência mede quantas vezes a onda se repete por segundo."],SOM,1,an="som_long"),
calc("on","Uma onda sonora tem frequência de 680 Hz e comprimento de onda de 0,5 m. Qual é a velocidade de propagação dessa onda?",
 ["340 m/s","1360 m/s","170 m/s","680,5 m/s"],
 "v = λ · f = 0,5 · 680 = 340 m/s.","Use a equação fundamental das ondas.",
 ["Dividiu a frequência pelo comprimento de onda.","Dividiu o produto por 2.","Somou λ e f em vez de multiplicar."],EXO,
 {"lam":"0.5 m","f":"680 Hz"},"lam*f","f*lam","m/s","v","v = λ · f",{"lam":"λ","f":"f"},"generico",1),
calc("on","Uma fonte sonora vibra 250 vezes por segundo (250 Hz). Qual é o período dessa vibração?",
 ["4,0 × 10⁻³ s","250 s","0,25 s","25 s"],
 "T = 1 / f = 1 / 250 = 4,0 × 10⁻³ s.","O período é o inverso da frequência.",
 ["Confundiu período com frequência.","Errou a potência de dez ao inverter.","Dividiu por 10 em vez de inverter."],EXO,
 {"f":"250 Hz"},"1/f","f**(-1)","s","T","T = 1 / f",{"f":"f"},"generico",1),
]
# ---------- 2. velocidade do som
Q+=[
mc("vs","Em qual dos meios abaixo o som se propaga com maior velocidade?",
 ["Aço.","Água.","Ar.","Vácuo."],
 "Em geral, v(sólidos) > v(líquidos) > v(gases). No aço o som chega a cerca de 5 900 m/s; na água, a 1 500 m/s; no ar, a 340 m/s. No vácuo não há propagação.","Compare sólido, líquido e gás.",
 ["A água é mais rápida que o ar, mas mais lenta que o aço.","O ar é o mais lento dos três meios materiais.","No vácuo o som não se propaga."],VEL,1),
mc("vs","Um som passa do ar para a água. Qual grandeza da onda sonora se mantém?",
 ["A frequência.","A velocidade.","O comprimento de onda.","A velocidade e o comprimento de onda."],
 "A frequência é determinada pela fonte e não muda ao mudar de meio. Como v = λ·f, a velocidade aumenta na água e o comprimento de onda aumenta junto.","Quem fixa a frequência: a fonte ou o meio?",
 ["A velocidade do som é maior na água do que no ar.","O comprimento de onda cresce, pois v cresce com f fixa.","Nenhuma das duas se mantém: só a frequência permanece."],SOM,2,
 mot="Conceito sobre a grandeza que se conserva na mudança de meio; a conta é a mesma da equação fundamental."),
mc("vs","Com o aumento da temperatura do ar, a velocidade do som nele:",
 ["Aumenta.","Diminui.","Não muda.","Fica nula."],
 "No ar, o som se propaga mais rápido quando a temperatura sobe: aproximadamente 331 m/s a 0 °C e 343 m/s a 20 °C.","Pense nas partículas mais agitadas.",
 ["É o contrário: o ar mais quente transmite a vibração mais depressa.","Há variação, de cerca de 0,6 m/s a cada grau Celsius.","A velocidade nunca se anula no ar."],VEL,1),
mc("vs","O som viaja bem mais rápido no aço do que no ar. Qual é a explicação correta?",
 ["O aço é muito mais rígido, ou seja, bem menos compressível que o ar.","O aço é mais denso, e a densidade maior sempre aumenta a velocidade do som.","O som tem frequência maior dentro do aço.","O aço não tem partículas que atrapalhem a vibração."],
 "O que aumenta a velocidade do som é a rigidez do meio (pouca compressibilidade). Para rigidez semelhante, uma densidade maior deixa o som mais lento. O aço vence pela rigidez.","Pense em rigidez, não só em densidade.",
 ["A densidade maior, sozinha, tende a reduzir a velocidade do som. Armadilha comum.","A frequência é da fonte e não muda ao entrar no aço.","O aço tem partículas, e é por elas que a vibração se transmite."],V172,3),
calc("vs","Um raio cai a 1700 m de uma pessoa. Considerando a luz instantânea e o som a 340 m/s no ar, quanto tempo depois do clarão ela ouve o trovão?",
 ["5,0 s","0,2 s","50 s","5,8 × 10⁵ s"],
 "t = d / v = 1700 / 340 = 5,0 s.","Use v = d / t e isole o tempo.",
 ["Inverteu a divisão (v / d).","Errou a potência de dez no resultado.","Multiplicou a distância pela velocidade."],VEL,
 {"d":"1700 m","v":"340 m/s"},"d/v","d*(1/v)","s","t","t = d / v",{"d":"d","v":"v"},"generico",1),
calc("vs","Um mergulhador emite um som de 500 Hz na água, onde o som viaja a 1500 m/s. Qual é o comprimento de onda desse som na água?",
 ["3,0 m","7,5 × 10⁵ m","0,33 m","1000 m"],
 "λ = v / f = 1500 / 500 = 3,0 m.","Isole λ em v = λ·f.",
 ["Multiplicou v por f em vez de dividir.","Inverteu a divisão (f / v).","Subtraiu f de v."],EXO,
 {"v":"1500 m/s","f":"500 Hz"},"v/f","v*(1/f)","m","λ","λ = v / f",{"v":"v","f":"f"},"generico",2),
]
# ---------- 3. qualidades do som
Q+=[
mc("qs","Um pai diz ao filho: “Abaixe o som, está muito alto!”. Em Física, qual qualidade do som deve ser reduzida para atender o pedido?",
 ["A intensidade (sonoridade).","A altura.","O timbre.","A velocidade de propagação."],
 "O pai quer um som menos forte, ou seja, de menor intensidade (menor amplitude). Em Física, “alto” significa agudo, ligado à frequência.","Em Física, “alto” e “forte” são coisas diferentes.",
 ["Altura é a frequência: grave ou agudo. Abaixar a altura deixaria o som mais grave, não mais fraco.","O timbre é a “cor” do som e não define se ele é forte.","A velocidade depende do meio, não do volume."],QUA,1,an="qualid"),
mc("qs","Uma flauta e um piano tocam a mesma nota musical, com a mesma intensidade. Que qualidade do som permite distinguir os dois instrumentos?",
 ["O timbre.","A altura.","A intensidade.","A velocidade de propagação."],
 "As duas fontes têm a mesma frequência (mesma altura) e a mesma intensidade. O que as distingue é o timbre, determinado pela forma da onda, isto é, pelos harmônicos que acompanham a nota.","Se altura e intensidade são iguais, o que sobra?",
 ["A altura é a mesma, pois é a mesma nota.","A intensidade foi dada como igual.","A velocidade no ar é a mesma para os dois sons."],QUA,2,an="qualid"),
mc("qs","Em geral, a voz de uma mulher é mais aguda que a de um homem. Isso significa que, em média, ela tem:",
 ["Frequência maior.","Frequência menor.","Intensidade menor.","Velocidade de propagação maior."],
 "Som agudo é som de frequência mais alta. A altura do som depende da frequência.","Agudo e grave se relacionam com a frequência.",
 ["Frequência menor corresponde ao som grave.","Intensidade é outra qualidade, ligada à amplitude.","Todos os sons têm a mesma velocidade no ar."],QUA,1,an="qualid"),
vf("qs","dois sons com a mesma altura têm sempre a mesma intensidade.",False,
 "Falso. A altura depende da frequência e a intensidade depende da amplitude. Podemos tocar a mesma nota (mesma frequência) mais forte ou mais fraco.","Altura e intensidade dependem de grandezas diferentes.",
 "Uma mesma nota pode ser tocada com amplitudes diferentes, resultando em intensidades diferentes.",QUA,1,an="qualid"),
vf("qs","um som agudo se propaga mais rápido no ar do que um som grave.",False,
 "Falso. No mesmo meio e à mesma temperatura, todos os sons têm a mesma velocidade. O que varia com a altura é a frequência (e o comprimento de onda).","A velocidade depende do meio, não da frequência.",
 "A velocidade do som no ar não depende da frequência.",VEL,2),
mc("qs","Ao dobrar a amplitude de uma onda sonora, mantendo a frequência, o som fica:",
 ["Mais intenso, com a mesma altura.","Mais agudo, com a mesma intensidade.","Mais grave, com a mesma intensidade.","Com outro timbre e a mesma intensidade."],
 "A amplitude está ligada à intensidade (energia transportada). Como a frequência não mudou, a altura é a mesma.","A amplitude se relaciona com qual qualidade?",
 ["A altura depende da frequência, que se manteve.","Um som mais grave exigiria frequência menor.","O timbre depende da forma da onda."],QUA,2,an="qualid"),
]
# ---------- 4. intensidade e decibéis
Q+=[
mc("db","A intensidade de um som é multiplicada por 100. Em quantos decibéis aumenta o nível sonoro?",
 ["20 dB","100 dB","2 dB","10 dB"],
 "O nível sonoro é logarítmico: β = 10·log(I/I₀). Multiplicar a intensidade por 10 soma 10 dB. Multiplicar por 100 (dois fatores de 10) soma 20 dB.","Cada fator 10 na intensidade soma 10 dB.",
 ["Confundiu o fator da intensidade com o aumento em dB.","O aumento é de 10 dB por fator 10; aqui há dois fatores 10.","Isso corresponde a multiplicar a intensidade por 10 apenas."],DB,2),
vf("db","duas fontes iguais, cada uma produzindo 70 dB, tocando juntas, produzem 140 dB.",False,
 "Falso. A intensidade soma, mas o nível sonoro é logarítmico. O dobro da intensidade acrescenta cerca de 3 dB: o resultado é 73 dB.","Decibel não se soma como número comum.",
 "Dobrar a intensidade soma cerca de 3 dB. Duas fontes de 70 dB dão aproximadamente 73 dB.",INT,2),
mc("db","A intensidade sonora de uma fonte pontual, em um local aberto, é medida a certa distância. Se essa distância for dobrada, a intensidade será:",
 ["Dividida por 4.","Dividida por 2.","Igual à anterior.","Multiplicada por 2."],
 "Para fonte pontual, I = P/(4πr²). Com r dobrado, r² fica 4 vezes maior e a intensidade fica 4 vezes menor.","A intensidade varia com o quadrado da distância.",
 ["Isso valeria se a intensidade fosse inversamente proporcional a r, e não a r².","A distância maior reduz a intensidade.","A intensidade só aumentaria se a fonte se aproximasse."],INV,2),
mc("db","Segundo normas de saúde ocupacional, a exposição prolongada a níveis sonoros acima de cerca de 85 dB pode causar perda auditiva. Isso mostra que:",
 ["Sons de intensidade elevada por muito tempo podem danificar o ouvido.","Só sons de frequência muito baixa fazem mal ao ouvido.","O nível em dB mede a altura do som.","O ouvido humano ouve qualquer frequência."],
 "O decibel mede o nível de intensidade, e a exposição prolongada a níveis altos danifica as células auditivas. A faixa audível é de 20 Hz a 20 kHz.","O decibel está ligado à intensidade.",
 ["O dano depende principalmente do nível de intensidade.","O decibel mede nível de intensidade, não altura.","A audição humana vai de 20 Hz a 20 kHz."],EXA,1),
calc("db","Um som tem intensidade de 10⁻⁵ W/m². Qual é o seu nível sonoro? (I₀ = 10⁻¹² W/m²)",
 ["70 dB","7 dB","−50 dB","120 dB"],
 "β = 10·log(I / I₀) = 10·log(10⁻⁵ / 10⁻¹²) = 10·log(10⁷) = 70 dB.","Use β = 10·log(I/I₀).",
 ["Esqueceu o fator 10 na frente do logaritmo.","Não dividiu por I₀ (usou só o expoente de I).","Somou os expoentes em vez de subtrair."],INT,
 {"I":"1e-5 W/m²","I0":"1e-12 W/m²"},"10*log10(I/I0)","10*(log10(I)-log10(I0))","dB","β","β = 10 · log(I / I₀)",{"I":"I","I0":"I₀"},"generico",3),
calc("db","Um som tem nível sonoro de 60 dB. Qual é a sua intensidade? (I₀ = 10⁻¹² W/m²)",
 ["1,0 × 10⁻⁶ W/m²","1,0 × 10⁻⁵ W/m²","6,0 × 10⁻¹¹ W/m²","1,0 × 10⁻⁷ W/m²"],
 "60 = 10·log(I / 10⁻¹²), logo I / 10⁻¹² = 10⁶ e I = 1,0 × 10⁻⁶ W/m².","Desfaça o logaritmo: I = I₀ · 10^(β/10).",
 ["Errou o expoente ao desfazer o logaritmo.","Multiplicou β por I₀ em vez de usar a potência de 10.","Usou 10^(β/10) com um expoente a menos."],INT,
 {"beta":"60 dB","I0":"1e-12 W/m²"},"I0*10**(beta/10)","I0*10**(beta*0.1)","W/m²","I","I = I₀ · 10^(β/10)",{"beta":"β","I0":"I₀"},"generico",3),
calc("db","Uma fonte sonora pontual emite uma potência de 10 W. Qual é a intensidade a 2 m dela, sem reflexões? (use π ≈ 3,14)",
 ["0,199 W/m²","0,398 W/m²","0,625 W/m²","2,5 W/m²"],
 "I = P / (4πr²) = 10 / (4 · 3,14 · 4) = 0,199 W/m².","A área da esfera é 4πr².",
 ["Esqueceu de elevar r ao quadrado.","Esqueceu o fator π.","Dividiu a potência só por r²."],INV,
 {"P":"10 W","r":"2 m"},"P/(4*pi*r**2)","(P/(4*pi))/r**2","W/m²","I","I = P / (4π r²)",{"P":"P","r":"r"},"generico",3,0.01),
]
# ---------- 5. eco, reverberação e reforço
Q+=[
mc("ec","O som refletido em um obstáculo chega ao ouvinte pelo menos 0,1 s depois do som direto. Esse fenômeno é chamado de:",
 ["Eco.","Reverberação.","Reforço.","Refração."],
 "O ouvido humano separa dois sons que chegam com intervalo de pelo menos 0,1 s. Nesse caso, ouve-se o som refletido separadamente do direto: é o eco.","Pense em separar o som refletido do direto.",
 ["Na reverberação o intervalo é menor que 0,1 s e o som parece prolongado.","No reforço o intervalo é quase nulo e só aumenta a intensidade.","Refração é mudança de meio, não reflexão."],ECO,1,an="eco_ida"),
mc("ec","Em um auditório, o som refletido chega ao ouvinte quase imediatamente depois do som direto (menos de 0,1 s), e ele tem a impressão de que o som se prolonga. Esse fenômeno é a:",
 ["Reverberação.","Interferência destrutiva.","Difração.","Ressonância."],
 "Quando a reflexão chega com intervalo menor que 0,1 s, os dois sons se fundem e o som parece prolongado: é a reverberação.","O intervalo é menor que o necessário para o eco.",
 ["Na interferência destrutiva as ondas se cancelam.","Difração é o contorno de obstáculos.","Ressonância ocorre quando a frequência externa é igual à natural."],ECO,2,an="eco_ida"),
vf("ec","para ouvir um eco, o obstáculo precisa estar a pelo menos 17 m porque o som deve percorrer 17 m no total.",False,
 "Falso. O som vai até o obstáculo e volta: o percurso total é de 34 m (340 m/s · 0,1 s). Por isso o obstáculo deve estar a pelo menos 17 m.","Lembre da ida e da volta.",
 "Os 17 m são só a distância até o obstáculo. O som percorre 34 m, ida e volta, em 0,1 s.",ECO,2,an="eco_ida"),
calc("ec","Considere a velocidade do som no ar igual a 340 m/s. Qual é a menor distância entre uma pessoa e um obstáculo refletor para que ela ouça o eco de sua voz? (intervalo mínimo de 0,1 s)",
 ["17 m","34 m","3,4 m","68 m"],
 "O som vai e volta: 2d = v·Δt = 340 · 0,1 = 34 m. Então d = 17 m.","Lembre que o percurso é de ida e volta.",
 ["Esqueceu de dividir por 2 (ida e volta).","Errou a potência de dez ao multiplicar.","Multiplicou por 2 em vez de dividir."],ECO,
 {"v":"340 m/s","dt":"0.1 s"},"v*dt/2","v*(dt/2)","m","d","2d = v · Δt  →  d = v · Δt / 2",{"v":"v","dt":"Δt"},"generico",2),
calc("ec","Um sonar emite um pulso de ultrassom e recebe o eco 0,8 s depois. Considerando a velocidade do som na água igual a 1500 m/s, qual é a profundidade do fundo?",
 ["600 m","1200 m","300 m","1875 m"],
 "O pulso vai e volta: 2d = v·Δt = 1500 · 0,8 = 1200 m. Então d = 600 m.","Divida o percurso por 2.",
 ["Usou o percurso de ida e volta como profundidade.","Dividiu por 4 em vez de por 2.","Dividiu a velocidade pelo tempo."],ECO,
 {"v":"1500 m/s","dt":"0.8 s"},"v*dt/2","v*(dt/2)","m","d","d = v · Δt / 2",{"v":"v","dt":"Δt"},"generico",2),
calc("ec","Um garoto grita diante de uma montanha e ouve o eco 4 s depois. Com o som a 340 m/s, a que distância está a montanha?",
 ["680 m","1360 m","85 m","340 m"],
 "2d = v·Δt = 340 · 4 = 1360 m. Então d = 680 m.","Metade do percurso total de ida e volta.",
 ["Usou o percurso total, sem dividir por 2.","Dividiu o percurso por 16 e não por 2.","Usou só a velocidade do som."],ECO,
 {"v":"340 m/s","dt":"4 s"},"v*dt/2","v*(dt/2)","m","d","d = v · Δt / 2",{"v":"v","dt":"Δt"},"generico",2),
mc("ec","Morcegos e golfinhos se orientam emitindo sons de frequência acima de 20 kHz e analisando os ecos. Esses sons são chamados de:",
 ["Ultrassons.","Infrassons.","Sons graves audíveis.","Ondas eletromagnéticas."],
 "Frequências acima de 20 kHz estão acima do limite da audição humana: são ultrassons. Eles refletem nos obstáculos e voltam como eco, o que permite localizar presas e objetos.","Acima ou abaixo da faixa audível?",
 ["Infrassons têm frequência abaixo de 20 Hz.","Sons acima de 20 kHz não são audíveis pelos humanos.","São ondas mecânicas, e não eletromagnéticas."],EXA,1),
]
print(len(Q))
json.dump({"quiz":"onda","questoes":Q},open("/home/claude/quiz/build/novas/onda_1.json","w",encoding="utf-8"),ensure_ascii=False,indent=1)
