# Ajudantes e fontes de Mecânica (cinemática e dinâmica).
TM="Toda Matéria"; PE="PrePara Enem"
def F(site,url,t,base,ver): return {"site":site,"url":url,"titulo":t,"conferido_em":"2026-11-07","base":base,"verificar":ver}
T="https://www.todamateria.com.br/"; P="https://www.preparaenem.com/fisica/"
MU=F(TM,T+"movimento-uniforme/","Movimento Uniforme (Toda Matéria)","velocidade constante e função horária",["movimento uniforme","velocidade constante"])
MUV=F(TM,T+"movimento-uniformemente-variado/","Movimento Uniformemente Variado (Toda Matéria)","aceleração constante e equações do MUV",["movimento uniformemente variado","aceleração é constante"])
MUV2=F(PE,P+"movimento-uniformemente-variado-muv.htm","Movimento Uniformemente Variado (PrePara Enem)","funções horárias do MUV",["movimento uniformemente variado","aceleração escalar"])
QL=F(TM,T+"queda-livre/","Queda livre (Toda Matéria)","queda livre, g e fórmulas",["queda livre","gravidade"])
LOB=F(TM,T+"lancamento-obliquo/","Lançamento Oblíquo (Toda Matéria)","lançamento oblíquo e fórmulas",["lançamento oblíquo","fórmulas"])
LOB2=F(PE,P+"lancamento-obliquo.htm","Lançamento oblíquo (PrePara Enem)","movimento composto, alcance e altura máxima",["lançamento oblíquo","movimento uniforme"])
MCU=F(TM,T+"movimento-circular/","Movimento Circular (Toda Matéria)","período, frequência e velocidades",["período","frequência"])
MCU2=F(PE,P+"movimento-circular-uniforme.htm","Movimento circular uniforme (PrePara Enem)","MCU, aceleração centrípeta e velocidades",["movimento circular uniforme","aceleração"])
NEW=F(TM,T+"leis-de-newton/","Leis de Newton (Toda Matéria)","as três leis de Newton",["Leis de Newton","Principia"])
FR=F(TM,T+"forca-resultante/","Força resultante (Toda Matéria)","segunda lei e força resultante",["Força resultante","segunda Lei de Newton"])
ATR=F(TM,T+"forca-de-atrito/","Força de Atrito (Toda Matéria)","atrito estático e dinâmico",["força de atrito","atrito estático"])
PLI=F(TM,T+"plano-inclinado/","Plano Inclinado (Toda Matéria)","componentes do peso e atrito no plano",["plano inclinado","força peso"])
PLI2=F(PE,P+"plano-inclinado.htm","Plano inclinado (PrePara Enem)","forças no plano inclinado com e sem atrito",["plano inclinado","força de atrito"])
TRAB=F(TM,T+"trabalho-na-fisica/","Trabalho na Física (Toda Matéria)","trabalho de uma força e teorema da energia cinética",["Trabalho","joule"])
POT=F(TM,T+"potencia-mecanica-e-rendimento/","Potência mecânica e rendimento (Toda Matéria)","potência e rendimento",["Potência","trabalho"])
EC=F(TM,T+"energia-cinetica/","Energia Cinética (Toda Matéria)","energia cinética e teorema trabalho-energia",["Energia Cinética","Teorema"])
EM=F(TM,T+"energia-mecanica/","Energia mecânica (Toda Matéria)","energia mecânica e conservação",["energia mecânica","conservação"])
IMP=F(PE,P+"impulso-quantidade-movimento.htm","Impulso e Quantidade de Movimento (PrePara Enem)","impulso e quantidade de movimento",["impulso","quantidade de movimento"])
GRV=F(PE,P+"lei-gravitacao-newton.htm","Lei da Gravitação de Newton (PrePara Enem)","lei da gravitação universal",["gravitação","inversamente proporcional"])
GRV2=F(PE,P+"gravitacao.htm","Gravitação (PrePara Enem)","leis de Kepler e gravitação",["Kepler","gravitação"])
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
