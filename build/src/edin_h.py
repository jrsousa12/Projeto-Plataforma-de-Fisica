# Ajudantes e fontes de Eletrodinâmica.
TM="Toda Matéria"; PE="PrePara Enem"
def F(site,url,t,base,ver): return {"site":site,"url":url,"titulo":t,"conferido_em":"2026-11-07","base":base,"verificar":ver}
T="https://www.todamateria.com.br/"; P="https://www.preparaenem.com/fisica/"
ELD=F(TM,T+"eletrodinamica/","Eletrodinâmica (Toda Matéria)","corrente elétrica, resistência e lei de Ohm",["Eletrodinâmica","corrente elétrica"])
OHM=F(TM,T+"leis-de-ohm/","Leis de Ohm (Toda Matéria)","primeira e segunda leis de Ohm",["Primeira Lei de Ohm","Segunda Lei de Ohm"])
RES=F(TM,T+"resistencia-eletrica/","Resistência Elétrica (Toda Matéria)","resistência, resistividade e leis de Ohm",["Resistência","Segunda Lei de Ohm"])
POTE=F(TM,T+"potencia-eletrica/","Potência Elétrica (Toda Matéria)","potência elétrica e consumo em kWh",["Potência elétrica","kWh"])
JOU=F(TM,T+"efeito-joule/","Efeito Joule (Toda Matéria)","transformação de energia elétrica em calor",["Efeito Joule","energia térmica"])
GER=F(TM,T+"geradores-eletricos/","Geradores Elétricos (Toda Matéria)","força eletromotriz, resistência interna e equação do gerador",["força eletromotriz","resistência interna"])
ASS=F(PE,P+"associacao-de-resistores.htm","Associação de resistores (PrePara Enem)","associação em série, em paralelo e mista",["Associação de resistores","em paralelo"])
LOH=F(PE,P+"leis-ohm.htm","Leis de Ohm (PrePara Enem)","leis de Ohm",["Primeira lei de Ohm","diferença de potencial"])
PDR=F(PE,P+"potencia-dissipada-por-um-resistor.htm","Potência dissipada por um resistor (PrePara Enem)","potência dissipada e efeito Joule",["efeito Joule","Potência"])
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
