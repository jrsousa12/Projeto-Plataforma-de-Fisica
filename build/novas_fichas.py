"""Fichas por área (build/fichas/<quiz>.json): dados que calibram os motores de cálculo e de teoria.
- "calculo": erros de conta típicos da área, usados pelo novas_distratores.py.
- "teoria": ideias erradas comuns dos alunos, sugeridas como alternativas erradas pelo novas_teoria.py.
Os motores são os mesmos para todas as áreas; só a ficha muda."""
import functools
from novas_comum import *

FICHAS = os.path.join(AQUI, "fichas")
TIPOS = ("fator", "inverso", "soma", "sem_quadrado")  # o que cada regra de cálculo faz com a variável


@functools.lru_cache(None)
def carregar(quiz):
    p = os.path.join(FICHAS, f"{quiz}.json")
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {"calculo": [], "teoria": []}


def regras_calculo(quiz):
    return carregar(quiz).get("calculo", []) if quiz else []


def checar_ficha(quiz):
    """Erros de formato de uma ficha (lista vazia = tudo certo)."""
    f, err = carregar(quiz), []
    for i, r in enumerate(f.get("calculo", [])):
        if r.get("tipo") not in TIPOS: err.append(f"{quiz} calculo[{i}]: tipo '{r.get('tipo')}' desconhecido ({', '.join(TIPOS)})")
        if r.get("tipo") in ("fator", "soma") and not isinstance(r.get("valor"), (int, float)): err.append(f"{quiz} calculo[{i}]: falta 'valor' numérico")
        try: re.compile(r.get("var", ""))
        except re.error: err.append(f"{quiz} calculo[{i}]: 'var' não é uma expressão válida")
        if not r.get("frase"): err.append(f"{quiz} calculo[{i}]: falta 'frase'")
    for i, t in enumerate(f.get("teoria", [])):
        if not t.get("palavras") or not t.get("ideia") or not t.get("por_que"): err.append(f"{quiz} teoria[{i}]: precisa de 'palavras', 'ideia' e 'por_que'")
    return err


def ideias(quiz, d, max_n=2):
    """Ideias erradas da ficha ligadas ao enunciado e que ainda não estão nas alternativas."""
    txt = " " + norm(d.get("q", "") + " " + d.get("e", "")) + " "
    alts = [norm(o) for o in d.get("o", []) if isinstance(o, str)]
    out = []
    for t in carregar(quiz).get("teoria", []):
        pts = sum(1 for p in t["palavras"] if " " + norm(p) in txt)
        ja = any(difflib.SequenceMatcher(None, norm(t["ideia"]), a).ratio() > .6 for a in alts)
        if pts >= min(2, len(t["palavras"])) and not ja: out.append((pts, t))  # 2 palavras em comum evitam ligação por acaso
    return [t for _, t in sorted(out, key=lambda x: -x[0])[:max_n]]
