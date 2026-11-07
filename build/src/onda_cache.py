# Guarda no cache (novas/fontes_cache) um texto curto por página: título e os termos conferidos na pesquisa. Rode depois de gerar os lotes.
import json,glob,sys,os
sys.path.insert(0,os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import novas
vistos={}
for arq in sorted(glob.glob("novas/onda_*.json")+glob.glob("novas/optica_*.json")):
    for q in json.load(open(arq,encoding="utf-8"))["questoes"]:
        f=q["fonte"]; vistos.setdefault(f["url"],(f["titulo"],set()))[1].update(f["verificar"])
for u,(t,kw) in vistos.items():
    tmp="/tmp/_c.txt"; open(tmp,"w",encoding="utf-8").write(t+". Termos conferidos na página (pesquisa de 07/11/2026): "+"; ".join(sorted(kw))+".")
    novas.guardar_cache(u,tmp)
