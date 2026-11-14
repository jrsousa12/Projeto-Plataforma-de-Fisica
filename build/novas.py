#!/usr/bin/env python3
"""Pipeline de questões novas: fonte confiável, cálculo conferido, viabilidade de animação.

Uso (a partir da pasta build/):
  python3 novas.py modelo <quiz> [n]       cria novas/<quiz>_AAAA-MM-DD.json com esqueleto
  python3 novas.py verificar [arq.json..]  roda todas as verificações (padrão: tudo em novas/*.json)
        --online                           tenta abrir as URLs das fontes e conferir palavras-chave
  python3 novas.py cache URL texto.txt     guarda o texto de uma página para conferir 'fonte.verificar' sem internet
  python3 novas.py aplicar arq.json        verifica e, se tudo passar, grava em app/perguntas-<quiz>.js
  python3 novas.py auditar [--estrito]     confere a aritmética das explicações de TODOS os bancos
  python3 novas.py animacoes               cobertura de animação do banco inteiro
Saída 1 se houver erro. Relatório em novas/relatorio.md.
"""
# O código fica dividido em novas_*.py (um assunto por arquivo); aqui ficam só os comandos.
from novas_comum import *
from novas_unidades import *
from novas_checagens import *
from novas_fonte import *
from novas_animacao import *
from novas_moldes import *

# ----------------------------------------------------------------- comandos
def carregar(arq):
    j = json.load(open(arq, encoding="utf-8"))
    return j["quiz"], j["questoes"]


def verificar(arqs, online=False, salvar=True):
    R = Rel(); info = dump(); dom = json.load(open(os.path.join(AQUI, "fontes_confiaveis.json")))["dominios"]; linhas = []
    arqs = arqs or sorted(os.path.join(NOVAS, f) for f in os.listdir(NOVAS) if f.endswith(".json"))
    tot = 0
    for arq in arqs:
        quiz, qs = carregar(arq); base = os.path.basename(arq)
        if quiz not in info["banks"]: R.E(base, f"quiz '{quiz}' inexistente"); continue
        for i, d in enumerate(qs):
            d["_quiz"] = quiz; loc = f"{base}#{i+1}"; tot += 1
            if "id" not in d: d["id"] = f"novo{i+1}"
            checar_fonte(d, loc, R, dom, online)
            duplicadas(d, loc, R, info, quiz)
            checar_calculo(d, loc, R)
            checar_equacoes(d, loc, R)
            if d.get("c") and not d.get("calc") is None: auditar_explicacao(d, loc, R, estrito=True)
            st, mot = classificar_animacao(d, loc, R, info)
            linhas.append((loc, d.get("q", "")[:70], st, mot))
        validar_estrutura(quiz, qs, R, base)
    if salvar:
        with open(os.path.join(NOVAS, "relatorio.md"), "w", encoding="utf-8") as f:
            f.write(f"# Relatório das questões novas ({datetime.date.today()})\n\n{tot} questões verificadas, {len(R.erros)} erro(s), {len(R.avisos)} aviso(s).\n\n## Animações\n\n| Questão | Enunciado | Situação | Observação |\n|---|---|---|---|\n")
            for l in linhas: f.write("| " + " | ".join(str(x).replace("|", "/") for x in l) + " |\n")
            for t, L in (("Erros", R.erros), ("Avisos", R.avisos), ("Conferências", R.infos)):
                f.write(f"\n## {t}\n\n" + ("\n".join("- " + x for x in L) or "nenhum") + "\n")
    for t, L in (("ERRO", R.erros), ("aviso", R.avisos), ("ok", R.infos)):
        for x in L: print(f"{t}: {x}")
    print(f"\n{tot} questões: {len(R.erros)} erro(s), {len(R.avisos)} aviso(s). Relatório: build/novas/relatorio.md")
    return R, arqs

def aplicar(arq):
    R, _ = verificar([arq])
    if R.erros: print("\nNada foi gravado: corrija os erros acima e rode de novo."); sys.exit(1)
    quiz, qs = carregar(arq); info = dump()
    pre = PREFIXO[quiz]; prox = max([int(re.sub(r"\D", "", d["id"]) or 0) for d in info["banks"][quiz]] or [0]) + 1
    sai = []; log = []; mold = []
    for d in qs:
        novo = dict(d); novo["id"] = f"{pre}{prox:03d}"; prox += 1
        dec = d.get("animacao") or {}
        if dec.get("decisao") == "molde": mold.append(entrada_molde(d, novo["id"], dec.get("molde", "generico"))); novo["an"] = f"calc_{novo['id']}"
        sai.append(limpo(novo)); log.append({"id": novo["id"], "fonte": d.get("fonte"), "calc": d.get("calc"), "data": str(datetime.date.today())})
    if mold: gravar_moldes(mold)
    for d in qs: atualizar_fontes(quiz, d.get("fonte"))
    p = os.path.join(APP, f"perguntas-{quiz}.js"); s = open(p, encoding="utf-8").read().rstrip(); assert s.endswith("}];") or s.endswith("[];")
    open(p, "w", encoding="utf-8").write((s[:-2] + "," if s.endswith("}];") else s[:-2]) + ",".join(json.dumps(x, ensure_ascii=False) for x in sai) + "];")
    with open(os.path.join(NOVAS, "aplicadas.jsonl"), "a", encoding="utf-8") as f:
        for l in log: f.write(json.dumps(l, ensure_ascii=False) + "\n")
    print(f"\n{len(sai)} questões gravadas em app/perguntas-{quiz}.js ({sai[0]['id']}..{sai[-1]['id']}). Rode: bash build/tudo.sh")

def _tem_conta(d):
    R = Rel(); return auditar_explicacao(d, "x", R)

def auditar(estrito=False):
    R = Rel(); info = dump(); n = c = 0
    for quiz, B in info["banks"].items():
        for d in B:
            if d.get("c"):
                c += 1; loc = f"{quiz}/{d['id']}"
                if auditar_explicacao(d, loc, R, estrito): n += 1
    for x in R.erros: print("ERRO:", x)
    for x in R.avisos: print("aviso:", x)
    sem = [f"{q}/{d['id']}" for q, B in info["banks"].items() for d in B if d.get("c") and not _tem_conta(d)]
    if sem: print("sem conta verificável na explicação (conferir à mão):", " ".join(sem))
    print(f"\nAuditoria aritmética: {c} questões de cálculo, {n} com conta verificável na explicação, {len(R.erros)} erro(s), {len(R.avisos)} aviso(s).")
    return 1 if R.erros else 0

def animacoes():
    info = dump(); tot = 0
    for quiz, B in info["banks"].items():
        sem = [d["id"] for d in B if not d.get("an")]; tot += len(sem)
        print(f"{quiz}: {len(B)-len(sem)}/{len(B)} com animação; sem: {' '.join(sem) or '-'}")
    return 0

def modelo(quiz, n=1):
    info = dump(); areas = list(info["quizzes"][quiz]["areas"])
    ex = {"t": areas[0], "q": "Enunciado novo (reescrito com suas palavras).", "o": ["Correta", "Errada 1", "Errada 2", "Errada 3"], "a": 0, "h": "Dica curta.", "e": "Explicação.", "n": 2,
          "fonte": {"site": "OpenStax", "url": "https://openstax.org/...", "titulo": "Título da página", "conferido_em": str(datetime.date.today()), "base": "o que se usou da fonte (conceito/valor)", "verificar": ["palavra-chave 1", "palavra-chave 2"]},
          "animacao": {"decisao": "nao_aplica", "motivo": "preencha ou use 'an': 'chave'"}}
    calc = {"c": 1, "calc": {"vars": {"m": "200 g", "c": "1 cal/g·°C", "dT": "30 °C"}, "expr": "m*c*dT", "expr2": "m*(c*dT)", "unidade": "cal", "tol": 0.005}}
    j = {"quiz": quiz, "areas": info["quizzes"][quiz]["areas"], "questoes": [ex] * n + [dict(ex, **calc)]}
    p = os.path.join(NOVAS, f"{quiz}_{datetime.date.today()}.json"); json.dump(j, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1); print("criado", p)

if __name__ == "__main__":
    a = sys.argv[1:]; cmd = a[0] if a else ""
    if cmd == "modelo": modelo(a[1], int(a[2]) if len(a) > 2 else 1)
    elif cmd == "verificar": R, _ = verificar([x for x in a[1:] if not x.startswith("--")], "--online" in a); sys.exit(1 if R.erros else 0)
    elif cmd == "cache": guardar_cache(a[1], a[2])
    elif cmd == "aplicar": aplicar(a[1])
    elif cmd == "auditar": sys.exit(auditar("--estrito" in a))
    elif cmd == "animacoes": sys.exit(animacoes())
    else: print(__doc__)
