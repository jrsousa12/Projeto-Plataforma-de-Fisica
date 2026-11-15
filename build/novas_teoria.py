"""Motor de teoria: confere questões sem conta (pistas que entregam a resposta, alternativas repetidas,
'todas as anteriores' com embaralhamento) e sugere ideias erradas da ficha da área como distratores.
Usado pelo verificar (questões novas) e pelo comando 'teoria' (pente-fino do banco inteiro)."""
from novas_comum import *
from novas_fichas import ideias

ABSOLUTAS = re.compile(r"\b(sempre|nunca|jamais|somente|apenas|todos|todas|nenhum|nenhuma|qualquer)\b")
ANTERIORES = re.compile(r"\b(todas|nenhuma) (as |das )?(anteriores|alternativas|acima)\b")
NEGACAO = re.compile(r"\b(incorreta|incorretas|errada|erradas|falsa|falsas|exceto)\b|\b(qual|quais)\b.{0,40}\bnao (e|sao|esta|estao|corresponde|representa|apresenta|pode|ocorre)\b")
VAZIAS = set("a o as os de da do das dos em no na nos nas um uma uns umas e ou que se por para com sem ao aos mais menos e quando qual como sua seu ser sao esta este isso".split())


def _palavras(t): return {w for w in norm(t).split() if len(w) >= 5 and w not in VAZIAS}


def checar_teoria(d, loc, R, quiz=None, sugerir=True):
    """Avisos de qualidade numa questão de teoria; devolve a lista de tipos de aviso encontrados."""
    o, a = d.get("o"), d.get("a")
    if not isinstance(o, list) or not isinstance(a, int) or not 0 <= a < len(o) or d.get("c"): return []
    achou = []
    def W(tipo, m): achou.append(tipo); R.W(loc, f"teoria: {m}")
    n = [norm(x) for x in o]
    if len({re.sub(r"\s+", " ", str(x)).strip().lower() for x in o}) < len(o): W("repetida", "há alternativas repetidas")
    erradas = [x for i, x in enumerate(o) if i != a]
    # 1. a certa bem mais longa que as outras (o aluno acerta só pelo tamanho)
    media = sum(len(x) for x in erradas) / len(erradas)
    if len(o[a]) > 1.6 * media and len(o[a]) == max(len(x) for x in o) and len(o[a]) - media > 15:
        W("longa", f"a certa tem {len(o[a])} letras e as erradas {media:.0f} em média; encurte a certa ou alongue as erradas")
    # 2. palavras absolutas (sempre, nunca...) só nas erradas: o aluno elimina sem saber física
    abs_e = sum(1 for x in erradas if ABSOLUTAS.search(norm(x)))
    if abs_e >= 2 and not ABSOLUTAS.search(norm(o[a])):
        W("absoluta", f"{abs_e} erradas usam 'sempre/nunca/apenas' e a certa não; a pista entrega a resposta")
    # 3. a certa repete palavras do enunciado e as erradas não (eco)
    pq = _palavras(d.get("q", "")); eco = [len(pq & _palavras(x)) for x in o]
    if eco[a] >= 2 and all(e == 0 for i, e in enumerate(eco) if i != a):
        W("eco", "só a certa repete palavras do enunciado; use essas palavras também em uma errada")
    # 4. 'todas/nenhuma das anteriores' perde o sentido porque o quiz embaralha (a não ser com "v": 1)
    if not d.get("v") and any(ANTERIORES.search(x) for x in n):
        W("anteriores", "alternativa do tipo 'todas as anteriores': o quiz embaralha a ordem; reescreva ou use \"v\": 1")
    # 5. pergunta negativa sem destaque
    q = d.get("q", "")
    if NEGACAO.search(norm(q)) and not re.search(r"\b(NÃO|INCORRETA|ERRADA|FALSA|EXCETO)\b", q):
        W("negacao", "pergunta negativa: escreva NÃO / INCORRETA em maiúsculas para o aluno não se confundir")
    # 6. errada sem explicação no "x"
    x = d.get("x") or {}; x = {str(i): v for i, v in enumerate(x)} if isinstance(x, list) else x
    sem = [i for i in range(len(o)) if i != a and not x.get(str(i))]
    if sem: W("sem_x", f"faltam as explicações das erradas {', '.join('abcd'[i] for i in sem)} no \"x\"")
    if sugerir and quiz:
        for t in ideias(quiz, d): R.I(loc, f"ideia errada comum para usar como alternativa: \"{t['ideia']}\" (x: {t['por_que']})")
    return achou


def pente_fino():
    """Comando 'teoria': confere todas as questões de teoria do banco; detalhes em novas/teoria.md."""
    info = dump(); cont = {}; lin = []; tot = 0
    for quiz, B in info["banks"].items():
        for d in B:
            if d.get("c"): continue
            tot += 1; R = Rel()
            for t in checar_teoria(d, f"{quiz}/{d['id']}", R, sugerir=False): cont[t] = cont.get(t, 0) + 1
            lin += R.avisos
    with open(os.path.join(NOVAS, "teoria.md"), "w", encoding="utf-8") as f:
        f.write(f"# Pente-fino das questões de teoria ({datetime.date.today()})\n\n{tot} questões, {len(lin)} aviso(s).\n\n" + "\n".join("- " + l for l in lin) + "\n")
    print(f"Teoria: {tot} questões, {len(lin)} aviso(s): " + (", ".join(f"{k} {v}" for k, v in sorted(cont.items(), key=lambda x: -x[1])) or "nenhum"))
    print("Detalhes: build/novas/teoria.md")
    return 0
