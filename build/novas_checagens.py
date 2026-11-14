"""Checagens de conta: cálculo dos metadados, aritmética das explicações e frações das equações. Usado pelo novas.py."""
from novas_comum import *  # caminhos, imports e utilidades
from novas_unidades import SUP, avaliar, fmt_dim, mesmo, opcao_num, qty, unidade

# ----------------------------------------------------------------- verificação do cálculo (metadados)
def checar_calculo(d, loc, R):
    c = d.get("calc")
    if not c:
        if d.get("c"): R.E(loc, "questão de cálculo (c:1) sem bloco 'calc' (vars/expr/unidade) para conferência automática")
        return
    if not d.get("c"): R.W(loc, "tem bloco 'calc' mas falta \"c\": 1")
    tol = float(c.get("tol", 0.005))
    try:
        vs = {k: qty(v) for k, v in c["vars"].items()}
        r = avaliar(c["expr"], vs)
        alvo = unidade(c["unidade"])
        if r.d != alvo.d: R.E(loc, f"ANÁLISE DIMENSIONAL: a expressão dá [{fmt_dim(r.d)}] mas a unidade da resposta é [{fmt_dim(alvo.d)}]"); return
        val = r.v / alvo.v
        if "expr2" in c:
            r2 = avaliar(c["expr2"], vs)
            if r2.d != alvo.d: R.E(loc, f"ANÁLISE DIMENSIONAL: expr2 dá [{fmt_dim(r2.d)}], diferente da unidade da resposta [{fmt_dim(alvo.d)}]")
            elif not mesmo(val, r2.v / alvo.v, tol): R.E(loc, f"o segundo caminho de cálculo (expr2) dá {r2.v/alvo.v:g} e o primeiro dá {val:g}")
        else:
            R.W(loc, "sem 'expr2' (segundo caminho de cálculo independente): recomendado")
    except Exception as ex:
        R.E(loc, f"erro no bloco calc: {ex}"); return
    R.I(loc, f"resultado calculado = {val:g} {c['unidade']}")
    o = d["o"]; a = d.get("a")
    # alternativa correta
    pa = opcao_num(o[a]) if isinstance(a, int) and a < len(o) else None
    if pa is None: R.E(loc, "gabarito não é numérico, mas a questão tem bloco calc"); return
    def conv(p):
        v, u = p
        if not u: return v
        try:
            qu = unidade(u)
            if qu.d != alvo.d: return None
            return v * qu.v / alvo.v
        except Exception: return None
    vc = conv(pa)
    if vc is None: R.E(loc, f"unidade do gabarito ('{pa[1]}') incompatível com a unidade do cálculo ('{c['unidade']}')")
    elif not mesmo(vc, val, tol): R.E(loc, f"GABARITO ERRADO: a conta dá {val:g} {c['unidade']}, mas a alternativa marcada vale {vc:g}")
    # distratores
    for i, t in enumerate(o):
        if i == a: continue
        p = opcao_num(t)
        if p is None: continue
        v = conv(p)
        if v is not None and mesmo(v, val, tol): R.E(loc, f"o distrator {i} ('{t}') é numericamente igual à resposta correta")
    # explicação precisa conter o resultado
    nums = [x for x in (opcao_num(s) for s in re.split(r"[=;]|\.\s", d.get("e", ""))) if x]
    ok = any(conv(x) is not None and mesmo(conv(x), val, max(tol, .01)) for x in nums) or any(mesmo(x[0], val, .01) for x in nums)
    if not ok: R.W(loc, "a explicação não parece conter o valor final calculado")
    if not d.get("x"): R.W(loc, "sem 'x' (explicação dos distratores) numa questão de cálculo")

# ----------------------------------------------------------------- auditoria da aritmética nas explicações
SUPNUM = r"[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+"
def _limpa(s):
    s = s.replace("−", "-").replace("×", "*").replace("·", "*").replace("÷", "/").replace(" ", " ").replace(" ", " ")
    s = re.sub(r"(\d)\s+(?=\d{3}\b)", r"\1", s)          # 6 000 -> 6000
    s = re.sub(r"10(" + SUPNUM + ")", lambda m: "1e" + m.group(1).translate(SUP), s)
    s = re.sub(r"10\^\(?(-?\d+)\)?", r"1e\1", s)
    s = re.sub(r"(\d),(\d)", r"\1.\2", s)
    return s
UNID_TOK = r"(?:cal|kcal|kg|g|mg|cm|mm|km|dm|m|s|min|h|N|Pa|J|W|V|C|A|K|L|mL|atm|mmHg|cmHg|mol|Hz|µC|μC|nC|mC|°C|eV|Ω|kΩ|MΩ|kW|MW|kWh|Wh|kV|mV|mA|µA|μA|kJ|MJ|kPa|kN|T|mT|µT|μT|Wb|nm|µm|μm|di|rad|F|µF|μF|nF|pF|kHz|MHz|GHz|ms|µs|μs|cm³|m³|dB|lx|VA)"
def _expr(parte):
    """(expressão numérica, unidades) de um lado de '='; (None, '') se houver variáveis/rótulos."""
    p = re.sub(r"\s*\([^()]*[A-Za-zµμ][^()]*\)[\s.]*$", "", parte)   # comentário final, ex.: (15 kcal)
    p = _limpa(p).rstrip(" .")                      # ponto final da frase
    p = re.sub(r"(?<![\d.])(\d+(?:\.\d+)?)\s*\*\s*1e(-?\d+)", r"(\1e\2)", p)   # 4 × 10⁻⁶ é um número só
    p = re.sub(r"(\)|\d)\s*²", r"\1**2", p); p = re.sub(r"(\)|\d)\s*³", r"\1**3", p)
    un = []
    def tira(m): un.append(m.group(0)); return ""
    p = re.sub(r"(?<=[\d)])\s*" + UNID_TOK + r"[²³]?(?:\*\*\d)?(?:[/*]" + UNID_TOK + r"[²³]?(?:\*\*\d)?)*(?![A-Za-zµμ])", tira, p)
    p = re.sub(r"(?<=\d)e(?=-?\d)", "E", p)           # notação científica
    if re.search(r"[A-Za-zµμΔΩαβγρτλ%]", p.replace("E", "")): return None, ""
    p = p.replace("E", "e").replace(" ", "")
    if not p or not re.fullmatch(r"[\d.\-+*/()e]+", p): return None, ""
    p = re.sub(r"^[+*/]+|[+\-*/]+$", "", p)
    p = re.sub(r"(\d|\))(\()", r"\1*\2", p)
    return (p or None), "".join(sorted(un))
def _val(p):
    try:
        if re.search(r"[^\d.\-+*/()e]", p): return None
        v = eval(p, {"__builtins__": {}}, {})
        return float(v) if isinstance(v, (int, float)) else None
    except Exception: return None
def auditar_explicacao(d, loc, R, estrito=False):
    e = d.get("e", ""); ach = 0
    for frase in re.split(r"\n|;|\.\s+|,\s+(?:então|logo|portanto|assim|ou seja|isto|isso)\b|→", e):
        if "=" not in frase: continue
        partes = frase.split("=")
        ok = []
        for i, p in enumerate(partes):
            tr = p.split(":")[-1] if i == 0 else p
            ex, un = _expr(tr)
            v = _val(ex) if ex else None
            if v is not None: ok.append((v, un, tr.strip()))
        if len(ok) < 2: continue
        ach += 1
        for (v1, u1, t1), (v2, u2, t2) in zip(ok, ok[1:]):
            if u1 and u2 and u1 != u2: continue          # conversão de unidade entre os lados
            if mesmo(v1, v2, 0.012): continue
            (R.E if estrito else R.W)(loc, f"aritmética da explicação não fecha: «{t1[:50]}» = {v1:g}, mas o passo seguinte «{t2[:30]}» vale {v2:g} (frase: «{frase.strip()[:70]}»)")
        # resultado da explicação versus gabarito (apenas questões de cálculo com alternativa numérica)
    if d.get("c") and isinstance(d.get("a"), int):
        pa = opcao_num(d["o"][d["a"]])
        if pa is not None and ach:
            nums = []
            for m in re.finditer(r"[-−]?\d[\d\s ]*(?:[.,]\d+)?(?:\s*[×x·]\s*10[⁰¹²³⁴⁵⁶⁷⁸⁹⁻\^\d-]+)?", e):
                p = opcao_num(m.group(0))
                if p: nums.append(p[0])
            if not any(mesmo(n, pa[0], 0.012) or (n and pa[0] and abs(math.log10(abs(n / pa[0])) % 1) < 1e-2 and abs(n / pa[0]) in (1e3, 1e-3, 1e2, 1e-2, 1e6, 1e-6, 10, .1)) for n in nums):
                R.W(loc, f"o gabarito ({d['o'][d['a']]}) não aparece como resultado na explicação")
    return ach


# ----------------------------------------------------------------- equações: toda divisão deve virar fração empilhada (app/eq.js)
_UN = {"m","s","h","km","kg","g","N","C","J","W","V","A","Pa","L","cm","mm","K","mol","min","Hz","cal","rad","atm","kWh","kW","mA","dB","mmHg","µC","μC","nC","mC","kΩ","Ω","°C"}
_UNPAT = re.compile(r"(?<![\w])([A-Za-zΔεπρτωθλμΩ°µ][\w₀-₉Δ]*)/([A-Za-zΔεπρτωθλμΩ°µ(][\w₀-₉Δ]*)")
def _sem_sup(t): return t.translate(str.maketrans("", "", "²³¹⁰⁴⁵⁶⁷⁸⁹⁻"))
def checar_equacoes(d, loc, R):
    """Avisa quando uma divisão não vai ser mostrada como fração (escrita sem espaços ou com termos que o app não reconhece)."""
    x = d.get("x") or {}
    pares = x.items() if isinstance(x, dict) else enumerate(x)  # "x" pode vir como dicionário ou lista
    textos = [("explicação", d.get("e", "")), ("dica", d.get("h", ""))] + [(f"x[{k}]", v) for k, v in pares]
    if d.get("calc", {}).get("formula"): textos.append(("fórmula", d["calc"]["formula"]))
    for nome, t in textos:
        for m in _UNPAT.finditer(t or ""):
            a, b = _sem_sup(m.group(1)), _sem_sup(m.group(2)).lstrip("(")
            if len(a) <= 4 and len(b) <= 4 and not (a in _UN and b in _UN): R.W(loc, f"{nome}: divisão sem espaços «{m.group(0)}» não vira fração; escreva «{m.group(1)} / {m.group(2)}»")
    try:
        import subprocess
        out = subprocess.run(["node", os.path.join(AQUI, "eqcheck.js")], input=json.dumps([t or "" for _, t in textos]), capture_output=True, text=True, timeout=30)
        if out.returncode == 0:
            for (nome, _), bad in zip(textos, json.loads(out.stdout)):
                for b in bad: R.W(loc, f"{nome}: a divisão perto de «{b.strip()}» não virou fração (confira se numerador e denominador são só símbolos, números e unidades)")
    except Exception: pass
