# Ajudantes e fontes de Óptica Geométrica.
TM="Toda Matéria"; OSX="OpenStax"; PH="PhET"; HP="HyperPhysics"
def F(site,url,t,base,ver): return {"site":site,"url":url,"titulo":t,"conferido_em":"2026-11-07","base":base,"verificar":ver}
V3="https://openstax.org/books/university-physics-volume-3/pages/"
PROP=F(OSX,V3+"1-1-the-propagation-of-light","1.1 The Propagation of Light","propagação retilínea, raios e velocidade da luz",["propagation of light","ray"])
REFL=F(OSX,V3+"1-2-the-law-of-reflection","1.2 The Law of Reflection","lei da reflexão e reflexão difusa",["law of reflection","diffuse"])
REFR=F(OSX,V3+"1-3-refraction","1.3 Refraction","índice de refração e lei de Snell",["index of refraction","Snell"])
TIR=F(OSX,V3+"1-4-total-internal-reflection","1.4 Total Internal Reflection","ângulo crítico e fibra óptica",["critical angle","total internal reflection"])
DISP=F(OSX,V3+"1-5-dispersion","1.5 Dispersion","dispersão da luz branca em prismas",["dispersion","prism"])
PLN=F(OSX,V3+"2-1-images-formed-by-plane-mirrors","2.1 Images Formed by Plane Mirrors","imagem virtual no espelho plano",["plane mirror","virtual image"])
ESF=F(OSX,V3+"2-2-spherical-mirrors","2.2 Spherical Mirrors","foco, equação dos espelhos e aumento",["spherical mirror","focal length"])
LEN=F(OSX,V3+"2-4-thin-lenses","2.4 Thin Lenses","lentes delgadas, foco e aumento",["thin lens","focal length"])
OLH=F(OSX,V3+"2-5-the-eye","2.5 The Eye","olho, miopia e hipermetropia",["nearsightedness","farsightedness"])
BEND=F(PH,"https://phet.colorado.edu/pt_BR/simulations/bending-light","Curvando a Luz","reflexão, refração e reflexão total",["refração","reflexão"])
GEO=F(PH,"https://phet.colorado.edu/pt_BR/simulations/geometric-optics","Óptica Geométrica (PhET)","espelhos, lentes e imagens",["lente","espelho"])
TMO=F(TM,"https://www.todamateria.com.br/fisica/ondulatoria/","Física: ondulatória e óptica (Toda Matéria)","espelhos esféricos e lentes esféricas",["espelhos esféricos","lentes"])
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
