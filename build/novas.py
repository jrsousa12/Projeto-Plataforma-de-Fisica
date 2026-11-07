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
import ast, datetime, difflib, json, math, operator, os, re, shutil, subprocess, sys, tempfile, unicodedata, urllib.parse, urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(AQUI, "..", "app")
NOVAS = os.path.join(AQUI, "novas")
PREFIXO = {"eletro": "q", "fluidos": "f", "termo": "t", "onda": "o", "optica": "p", "mec": "m", "edin": "d"}
MOLDES = ("generico", "dilatacao", "calor", "pressao", "coulomb", "bernoulli", "latente", "potencial")

# ----------------------------------------------------------------- utilidades
class Rel:
    def __init__(self): self.erros, self.avisos, self.infos = [], [], []
    def E(self, loc, m): self.erros.append(f"{loc}: {m}")
    def W(self, loc, m): self.avisos.append(f"{loc}: {m}")
    def I(self, loc, m): self.infos.append(f"{loc}: {m}")

def dump():
    out = subprocess.run(["node", os.path.join(AQUI, "dump_banco.js"), APP], capture_output=True, text=True, check=True).stdout
    return json.loads(out)

def norm(t):
    t = unicodedata.normalize("NFD", str(t).lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", t).strip()

# ----------------------------------------------------------------- grandezas com unidade
DIMS = ["m", "kg", "s", "A", "K", "mol"]
class Q:
    """Valor numérico com dimensão (expoentes de m, kg, s, A, K, mol), em unidades do SI."""
    def __init__(s, v, d=None): s.v = float(v); s.d = tuple(d or (0,) * 6)
    def __add__(s, o):
        o = _q(o)
        if s.d != o.d: raise ValueError(f"soma de grandezas diferentes ({fmt_dim(s.d)} + {fmt_dim(o.d)})")
        return Q(s.v + o.v, s.d)
    __radd__ = __add__
    def __sub__(s, o): return s + (-_q(o))
    def __rsub__(s, o): return _q(o) + (-s)
    def __neg__(s): return Q(-s.v, s.d)
    def __mul__(s, o): o = _q(o); return Q(s.v * o.v, tuple(a + b for a, b in zip(s.d, o.d)))
    __rmul__ = __mul__
    def __truediv__(s, o): o = _q(o); return Q(s.v / o.v, tuple(a - b for a, b in zip(s.d, o.d)))
    def __rtruediv__(s, o): return _q(o) / s
    def __pow__(s, n):
        if isinstance(n, Q):
            if any(n.d): raise ValueError("expoente com unidade")
            n = n.v
        return Q(s.v ** n, tuple(a * n for a in s.d))
def _q(x): return x if isinstance(x, Q) else Q(x)
def fmt_dim(d):
    p = [f"{n}^{e:g}" if e != 1 else n for n, e in zip(DIMS, d) if e]
    return "·".join(p) or "adimensional"
def _u(v, **e): return Q(v, tuple(e.get(n, 0) for n in DIMS))
J = _u(1, kg=1, m=2, s=-2); N_ = _u(1, kg=1, m=1, s=-2); PA = _u(1, kg=1, m=-1, s=-2)
BASE = {"m": _u(1, m=1), "g": _u(1e-3, kg=1), "kg": _u(1, kg=1), "s": _u(1, s=1), "A": _u(1, A=1), "K": _u(1, K=1), "mol": _u(1, mol=1),
        "degC": _u(1, K=1), "min": _u(60, s=1), "h": _u(3600, s=1), "N": N_, "Pa": PA, "J": J, "W": _u(1, kg=1, m=2, s=-3),
        "C": _u(1, A=1, s=1), "V": _u(1, kg=1, m=2, s=-3, A=-1), "F": _u(1, kg=-1, m=-2, s=4, A=2), "Hz": _u(1, s=-1),
        "cal": Q(4.186) * J, "atm": Q(101325) * PA, "mmHg": Q(133.322) * PA, "cmHg": Q(1333.22) * PA, "L": _u(1e-3, m=3),
        "ohm": _u(1, kg=1, m=2, s=-3, A=-2), "Ω": _u(1, kg=1, m=2, s=-3, A=-2), "ton": _u(1000, kg=1), "kgf": Q(9.80665) * N_,
        "Wh": _u(3600, kg=1, m=2, s=-2), "dB": Q(1), "rad": Q(1), "di": _u(1, m=-1), "eV": Q(1.602e-19) * J, "dina": Q(1e-5) * N_, "1": Q(1)}
PREF = {"p": 1e-12, "n": 1e-9, "µ": 1e-6, "μ": 1e-6, "u": 1e-6, "m": 1e-3, "c": 1e-2, "d": 1e-1, "da": 10, "h": 1e2, "k": 1e3, "M": 1e6, "G": 1e9}
SUP = str.maketrans("⁰¹²³⁴⁵⁶⁷⁸⁹⁻", "0123456789-")

def unidade(txt):
    """Interpreta 'cal/g·°C', 'N·m²/C²', 'kg/m³', 'm/s²'... (tudo depois da 1ª barra fica no denominador)."""
    t = txt.strip().replace("°C", "degC").replace("·", "*").replace("⋅", "*").replace(" ", "")
    t = re.sub(r"([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)", lambda m: "^" + m.group(1).translate(SUP), t)
    if t in ("", "1"): return Q(1)
    num, _, den = t.partition("/")
    def prod(s):
        r = Q(1)
        for f in filter(None, s.split("*")):
            nome, _, e = f.partition("^"); e = float(e) if e else 1.0
            r = r * (_atom(nome) ** e)
        return r
    return prod(num) / prod(den) if den else prod(num)
def _atom(n):
    if n in BASE: return BASE[n]
    for p in sorted(PREF, key=len, reverse=True):
        if n.startswith(p) and n[len(p):] in BASE and n[len(p):] not in ("1",):
            return Q(PREF[p]) * BASE[n[len(p):]]
    raise ValueError(f"unidade desconhecida: {n}")

def qty(txt):
    """'200 g', '1,2e-5 1/degC', '4 µC' -> Q"""
    m = re.match(r"^\s*([-+−]?[\d.,]+(?:[eE][-+−]?\d+)?)\s*(.*)$", str(txt))
    if not m: raise ValueError(f"valor inválido: {txt}")
    n = float(m.group(1).replace("−", "-").replace(",", ".")); return Q(n) * unidade(m.group(2))

# ----------------------------------------------------------------- avaliador seguro
OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul, ast.Div: operator.truediv, ast.Pow: operator.pow, ast.USub: operator.neg, ast.UAdd: operator.pos}
FUN = {"sqrt": lambda x: x ** 0.5, "log10": lambda x: Q(math.log10(_q(x).v)), "abs": lambda x: Q(abs(x.v), x.d) if isinstance(x, Q) else abs(x)}
CONST = {"pi": Q(math.pi), "g": Q(9.8) * unidade("m/s²"), "G": Q(6.674e-11) * unidade("N·m²/kg²"), "k": Q(9e9) * unidade("N·m²/C²"), "c_luz": Q(3e8) * unidade("m/s")}
def avaliar(expr, vars_):
    env = dict(CONST); env.update(vars_)
    def ev(n):
        if isinstance(n, ast.Expression): return ev(n.body)
        if isinstance(n, ast.Constant) and isinstance(n.value, (int, float)): return Q(n.value)
        if isinstance(n, ast.Name):
            if n.id not in env: raise ValueError(f"variável '{n.id}' não definida em calc.vars")
            return env[n.id]
        if isinstance(n, ast.BinOp) and type(n.op) in OPS:
            a, b = ev(n.left), ev(n.right)
            return a ** b if isinstance(n.op, ast.Pow) else OPS[type(n.op)](a, b)
        if isinstance(n, ast.UnaryOp) and type(n.op) in OPS: return OPS[type(n.op)](ev(n.operand))
        if isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id in FUN and len(n.args) == 1: return FUN[n.func.id](ev(n.args[0]))
        raise ValueError("expressão não permitida em calc.expr")
    return ev(ast.parse(expr.replace("^", "**"), mode="eval"))

# ----------------------------------------------------------------- número de uma alternativa
EXP = r"(?:\s*[×x·*]\s*10\s*(?:\^?\s*([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+|[-−+]?\d+)))"
def opcao_num(txt):
    """Extrai (valor, texto_da_unidade) de '1,2 × 10⁻³ m²', '6 000 cal', '−40'. None se não for numérica."""
    t = str(txt).strip().replace(" ", " ").replace(" ", " ")
    m = re.match(r"^([-+−]?\d[\d ]*(?:,\d+)?(?:\.\d+)?)" + EXP + r"?\s*(.*)$", t)
    if not m: return None
    n = m.group(1).replace(" ", "").replace("−", "-")
    n = n.replace(",", ".") if "," in n else n
    if re.fullmatch(r"-?[1-9]\d{0,2}(\.\d{3})+", n): n = n.replace(".", "")
    v = float(n)
    if m.group(2):
        e = m.group(2).translate(SUP).replace("−", "-"); v *= 10 ** int(e)
    return v, m.group(3).strip(" .")

def mesmo(a, b, tol): return math.isclose(a, b, rel_tol=tol, abs_tol=1e-40)

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
UNID_TOK = r"(?:cal|kcal|kg|g|mg|cm|mm|km|dm|m|s|min|h|N|Pa|J|W|V|C|A|K|L|mL|atm|mmHg|cmHg|mol|Hz|µC|μC|nC|mC|°C|eV)"
def _expr(parte):
    """(expressão numérica, unidades) de um lado de '='; (None, '') se houver variáveis/rótulos."""
    p = _limpa(parte)
    p = re.sub(r"(\)|\d)\s*²", r"\1**2", p); p = re.sub(r"(\)|\d)\s*³", r"\1**3", p)
    un = []
    def tira(m): un.append(m.group(0)); return ""
    p = re.sub(r"(?<=[\d)])\s*" + UNID_TOK + r"[²³]?(?:\*\*\d)?(?:/" + UNID_TOK + r"[²³]?(?:\*\*\d)?)?(?![A-Za-zµμ])", tira, p)
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

# ----------------------------------------------------------------- fonte confiável
def checar_fonte(d, loc, R, dominios, online=False):
    f = d.get("fonte")
    if not isinstance(f, dict): R.E(loc, "sem bloco 'fonte' (site, url, titulo, conferido_em, base)"); return
    for k in ("url", "titulo", "conferido_em", "base"):
        if not str(f.get(k, "")).strip(): R.E(loc, f"fonte sem '{k}'")
    url = f.get("url", "")
    host = (urllib.parse.urlparse(url).hostname or "").lower()
    if not url.startswith("https://") : R.E(loc, "a URL da fonte precisa começar com https://")
    if not any(host == dom or host.endswith("." + dom) for dom in dominios): R.E(loc, f"o site '{host}' não está na lista de fontes confiáveis (fontes_confiaveis.json)")
    try: datetime.date.fromisoformat(f.get("conferido_em", ""))
    except Exception: R.E(loc, "fonte.conferido_em deve estar no formato AAAA-MM-DD")
    tr = f.get("trecho")
    if tr:
        a = set(zip(*[norm(tr).split()[i:] for i in range(6)])); b = norm(d.get("q", "") + " " + d.get("e", "")).split()
        g = set(zip(*[b[i:] for i in range(6)]))
        if a and len(a & g) / max(1, len(g)) > .35: R.E(loc, "o texto da questão copia o trecho da fonte: reescreva com suas palavras")
    txt = None; origem = ""
    if online and url:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "quiz-fisica-verificador"})
            html = urllib.request.urlopen(req, timeout=15).read().decode("utf-8", "ignore")
            txt = norm(re.sub(r"<[^>]+>", " ", html)); origem = "página aberta agora"
        except Exception as ex: R.W(loc, f"não consegui abrir a fonte agora ({type(ex).__name__}); tentando o cache")
    if txt is None and url:
        cp = cache_path(url)
        if os.path.exists(cp):
            linhas = open(cp, encoding="utf-8").read().split("\n", 1); txt = norm(linhas[1] if len(linhas) > 1 else ""); origem = "cache de " + linhas[0].rsplit("#", 1)[-1]
    if txt is None:
        R.W(loc, "fonte não conferida: sem rede e sem cache. Use `novas.py cache URL arquivo.txt` com o texto da página (obtido por busca/leitura) ou rode com --online onde houver internet")
        return
    chaves = f.get("verificar", [])
    if not chaves: R.W(loc, "sem 'fonte.verificar' (palavras-chave que devem existir na página)"); return
    falt = [k for k in chaves if norm(k) not in txt]
    if falt: R.E(loc, f"a página da fonte ({origem}) não contém: {', '.join(falt)}")
    else: R.I(loc, f"fonte conferida ({origem}): {len(chaves)} palavra(s)-chave encontradas")

def cache_path(url):
    import hashlib
    d = os.path.join(NOVAS, "fontes_cache"); os.makedirs(d, exist_ok=True)
    return os.path.join(d, hashlib.sha1(url.encode()).hexdigest()[:16] + ".txt")

def guardar_cache(url, arq):
    txt = open(arq, encoding="utf-8").read()
    open(cache_path(url), "w", encoding="utf-8").write(f"{url}#{datetime.date.today()}\n{txt}")
    print("guardado no cache:", url)

# ----------------------------------------------------------------- viabilidade de animação
FAMILIAS = {  # fórmula na explicação -> construtor de resolução já existente
    "termo": [(r"m\s*[·*×]\s*c\s*[·*×]\s*Δ?T", "qsens"), (r"m\s*[·*×]\s*L", "qlat"), (r"L₀\s*[·*×]\s*α", "dilat (linear)"), (r"A₀\s*[·*×]\s*β", "dilat (área)"),
              (r"T[CK]\s*=\s*T[CK]\s*[+−-]\s*273", "conv"), (r"T[CF]\s*/\s*5|T[CF]/5", "conv"), (r"Q\s*/\s*C|C\s*=\s*m", "cap_term")],
    "fluidos": [(r"μ\s*=\s*m\s*/\s*V|d\s*=\s*m\s*/\s*V|m\s*=\s*μ", "dens"), (r"P\s*=\s*F\s*/\s*A", "pf"), (r"ρ\s*[·*×]\s*g\s*[·*×]\s*h", "rgh"), (r"mmHg", "mmhg"),
                (r"E\s*=\s*μ|empuxo", "empuxo (ver calc_f106..)"), (r"F₁\s*/\s*A₁", "prensa")],
    "eletro": [(r"k\s*[·*×]\s*q", "coul / fonte"), (r"F\s*=\s*q\s*[·*×]\s*E", "fe"), (r"U\s*=|V\s*=\s*k", "pot"), (r"ΔV|trabalho", "trab")],
}
NAO_ANIMAVEL = [r"^qual (é|e) a unidade", r"^quem (é|e) o cientista", r"cientista desenhado", r"^como se chama", r"^qual (é|e) o nome", r"^qual (é|e) o valor d[eao]", r"constante", r"^o que significa a sigla"]
PROCESSO = r"(aument|diminu|flutu|afund|aquec|esfri|sobe|sobem|desce|se move|movimenta|dobr|tripl|reduz|cresc|escoa|expand|dilat|contr|atra|repel|fric|atrit|ferv|evapor|conden|solidific|fund|propag|transmit|equilibr|por que|o que acontece|quando)"
def classificar_animacao(d, loc, R, info):
    anim = info["anim"]; an = d.get("an"); dec = d.get("animacao") or {}
    if an:
        if an in anim: return ("tem", f"usa a animação '{an}'")
        R.E(loc, f"animação '{an}' não existe em figuras-animq-*.js"); return ("erro", "")
    if dec.get("decisao") == "nao_aplica":
        if len(str(dec.get("motivo", "")).strip()) < 15: R.E(loc, "animacao.decisao='nao_aplica' exige um 'motivo' (mín. 15 caracteres)")
        return ("nao_aplica", dec.get("motivo", ""))
    if dec.get("decisao") == "molde":
        if not d.get("calc"): R.E(loc, "animacao.decisao='molde' só vale para questão de cálculo (precisa do bloco 'calc')"); return ("erro", "")
        if dec.get("molde", "generico") not in MOLDES: R.E(loc, f"molde '{dec.get('molde')}' desconhecido. Use: {', '.join(MOLDES)}"); return ("erro", "")
        return ("molde", f"animação de resolução gerada pelo molde '{dec.get('molde', 'generico')}'")
    txt = d.get("q", "") + " " + d.get("e", "")
    quiz = d.get("_quiz", "")
    if d.get("c") or d.get("calc"):
        fam = next((n for rx, n in FAMILIAS.get(quiz, []) if re.search(rx, txt)), None)
        sug = f"criar 'calc_{d.get('id','<id>')}' com o construtor '{fam}'" if fam else f"criar 'calc_{d.get('id','<id>')}' (nenhum construtor existente cobre esta fórmula: escrever novo)"
        R.E(loc, f"questão de cálculo sem animação ('an'). Sugestão: {sug}")
        return ("criar", sug)
    if any(re.search(rx, norm(d.get("q", ""))) for rx in NAO_ANIMAVEL):
        R.W(loc, "provavelmente não animável (nome/unidade/definição). Confirme com animacao: {decisao:'nao_aplica', motivo:'...'}")
        return ("provavel_nao", "")
    # sugestão de reaproveitamento por similaridade com o texto alternativo das animações existentes
    toks = set(norm(txt).split()) - {"de", "da", "do", "a", "o", "e", "que", "um", "uma", "em", "na", "no", "para", "por", "com", "se", "os", "as", "qual", "como"}
    pont = sorted(((len(toks & set(norm(a).split())) / (1 + len(toks) ** .5), k) for k, a in anim.items() if not k.startswith("calc_")), reverse=True)[:3]
    sug = ", ".join(f"{k} ({p:.2f})" for p, k in pont)
    if re.search(PROCESSO, norm(d.get("q", "")) + " " + norm(d.get("e", ""))):
        R.E(loc, f"conceito com processo físico visualizável e sem animação. Reaproveitar ('an') ou criar cena nova. Parecidas: {sug}")
        return ("criar", f"parecidas: {sug}")
    R.W(loc, f"sem animação; não há processo óbvio. Decida: 'an' (parecidas: {sug}) ou animacao.decisao='nao_aplica'")
    return ("indefinido", sug)

# ----------------------------------------------------------------- estrutura (reaproveita o validador do app)
def validar_estrutura(quiz, novas, R, loc0):
    tmp = tempfile.mkdtemp(prefix="vq_")
    try:
        for f in os.listdir(APP):
            if re.match(r"^(perguntas|quiz|figuras)(-.*)?\.js$|^validar-banco\.js$", f): shutil.copy(os.path.join(APP, f), tmp)
        p = os.path.join(tmp, f"perguntas-{quiz}.js"); s = open(p, encoding="utf-8").read().rstrip()
        add = ",".join(json.dumps(limpo(d), ensure_ascii=False) for d in novas)
        assert s.endswith("}];") or s.endswith("[];"), "formato inesperado do banco"
        open(p, "w", encoding="utf-8").write((s[:-2] + "," if s.endswith("}];") else s[:-2]) + add + "];")
        r = subprocess.run(["node", "validar-banco.js"], cwd=tmp, capture_output=True, text=True)
        for l in r.stdout.splitlines():
            if l.startswith("ERRO:"): R.E(loc0, l[5:].strip())
            elif l.startswith("aviso:") and any(n["id"] in l for n in novas): R.W(loc0, l[6:].strip())
    finally: shutil.rmtree(tmp, ignore_errors=True)

def limpo(d):
    ordem = ["id", "an", "t", "q", "o", "a", "h", "e", "f", "c", "x", "n", "v"]
    return {k: d[k] for k in ordem if k in d}

def duplicadas(d, loc, R, info, quiz):
    qn = norm(d.get("q", ""))
    for v in info["banks"][quiz]:
        r = difflib.SequenceMatcher(None, qn, norm(v["q"])).ratio()
        if r > .88: R.E(loc, f"muito parecida com {v['id']} ({r:.0%}): «{v['q'][:60]}»")

# ----------------------------------------------------------------- comandos
def carregar(arq):
    j = json.load(open(arq, encoding="utf-8"))
    return j["quiz"], j["questoes"]


# ----------------------------------------------------------------- equações: toda divisão deve virar fração empilhada (app/eq.js)
_UN = {"m","s","h","km","kg","g","N","C","J","W","V","A","Pa","L","cm","mm","K","mol","min","Hz","cal","rad","atm","kWh","kW","mA","dB","mmHg","µC","μC","nC","mC","kΩ","Ω","°C"}
_UNPAT = re.compile(r"(?<![\w])([A-Za-zΔεπρτωθλμΩ°µ][\w₀-₉Δ]*)/([A-Za-zΔεπρτωθλμΩ°µ(][\w₀-₉Δ]*)")
def _sem_sup(t): return t.translate(str.maketrans("", "", "²³¹⁰⁴⁵⁶⁷⁸⁹⁻"))
def checar_equacoes(d, loc, R):
    """Avisa quando uma divisão não vai ser mostrada como fração (escrita sem espaços ou com termos que o app não reconhece)."""
    textos = [("explicação", d.get("e", "")), ("dica", d.get("h", ""))] + [(f"x[{k}]", v) for k, v in (d.get("x") or {}).items()]
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

# ----------------------------------------------------------------- moldes de animação e lista FONTE
def _num(v):
    t = f"{v:.3g}" if abs(v) < 1 and abs(v) > 0 else f"{v:.4g}"
    if "e" in t:
        m, e = t.split("e"); sup = str(int(e)).translate(str.maketrans("-0123456789", "⁻⁰¹²³⁴⁵⁶⁷⁸⁹")); t = f"{m}·10{sup}"
    return t.replace(".", ",")


# ----------------------------------------------------------------- texto da substituição (frações "a / b", sem parênteses sobrando)
import ast as _ast
_SUPS = str.maketrans("0123456789-", "⁰¹²³⁴⁵⁶⁷⁸⁹⁻")
def expr_texto(expr, val):
    """Escreve a expressão com os valores já trocados: 'a · b / c', '√(...)', 'x²'. val: nome -> texto do valor."""
    def num(v): return ("%g" % v).replace(".", ",").replace("-", "−")
    def go(n):
        if isinstance(n, _ast.Constant): return num(n.value), 5
        if isinstance(n, _ast.Name):
            t = val.get(n.id, n.id); return t, (2 if ("·" in t or " " in t) else 5)
        if isinstance(n, _ast.UnaryOp) and isinstance(n.op, _ast.USub):
            t, p = go(n.operand); return "−" + (f"({t})" if p < 5 else t), 4
        if isinstance(n, _ast.BinOp):
            op = type(n.op); L, pl = go(n.left); R, pr = go(n.right)
            if op is _ast.Pow:
                b = f"({L})" if pl < 5 else L
                if isinstance(n.right, _ast.Constant) and float(n.right.value).is_integer() and 0 <= n.right.value <= 9:
                    return b + str(int(n.right.value)).translate(_SUPS), 5
                return b + "^" + (f"({R})" if pr < 5 else R), 3
            if op is _ast.Add: return f"{L} + {R}", 1
            if op is _ast.Sub: return f"{L} − " + (f"({R})" if pr <= 1 else R), 1
            if op is _ast.Mult: return (f"({L})" if pl < 2 else L) + " · " + (f"({R})" if pr < 2 else R), 2
            if op is _ast.Div: return (f"({L})" if pl < 2 else L) + " / " + (f"({R})" if pr <= 2 else R), 2
        if isinstance(n, _ast.Call):
            nome = n.func.id; args = ", ".join(go(a)[0] for a in n.args)
            return ("√" if nome == "sqrt" else nome) + "(" + args + ")", 5
        raise ValueError("expressão não suportada")
    return go(_ast.parse(expr.strip(), mode="eval").body)[0]

def entrada_molde(d, nid, molde):
    c = d["calc"]; vs = {k: qty(v) for k, v in c["vars"].items()}
    r = avaliar(c["expr"], vs); alvo = unidade(c["unidade"]); val = r.v / alvo.v
    esc = lambda x: x.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    nome = c.get("simbolo", "resultado")
    rot = c.get("rotulos", {}); bonito = lambda t: re.sub(r"(\d)e(-?\d+)", lambda m: m.group(1) + "·10" + str(int(m.group(2))).translate(str.maketrans("-0123456789", "⁻⁰¹²³⁴⁵⁶⁷⁸⁹")), str(t)).replace(".", ",")
    pronto = True
    try: subst = expr_texto(c["expr"], {k: bonito(str(v).split()[0]) for k, v in c["vars"].items()})
    except Exception:
        pronto = False; subst = c["expr"]
        for k, v in c["vars"].items(): subst = re.sub(rf"\b{re.escape(k)}\b", "(" + bonito(str(v).split()[0]) + ")", subst)
    pretty = lambda x: re.sub(r"\b(" + "|".join(map(re.escape, rot)) + r")\b", lambda m: rot[m.group(1)], x.replace("**", "^").replace("*", " · ")) if rot else x.replace("**", "^").replace("*", " · ")
    mn = lambda t: re.sub(r"(?<![\w)])-(?=[\d(])", "−", t.replace("log10", "log"))
    un = "" if c["unidade"].strip() in ("", "1") else " " + c["unidade"]
    return {"key": f"calc_{nid}", "alt": "Resolução animada: " + (c.get("descricao") or re.sub(r"\s+", " ", d["q"])[:140]),
            "molde": molde, "vars": [esc(f"{rot.get(k, k)} = {bonito(v)}") for k, v in c["vars"].items()],
            "formula": esc(mn(c.get("formula") or f"{nome} = " + pretty(c["expr"]))), "subst": esc(mn(f"{nome} = " + (subst if pronto else pretty(subst)))),
            "resultado": esc(mn(f"{nome} = {_num(val)}{un}"))}

def gravar_moldes(entradas):
    p = os.path.join(APP, "figuras-animq-auto.js"); s = open(p, encoding="utf-8").read()
    m = re.search(r"/\*AUTO:BEGIN\*/(.*?)/\*AUTO:END\*/", s, re.S); lista = json.loads(m.group(1))
    ch = {e["key"] for e in entradas}; lista = [e for e in lista if e["key"] not in ch] + entradas
    open(p, "w", encoding="utf-8").write(s[:m.start(1)] + json.dumps(lista, ensure_ascii=False, indent=0) + s[m.end(1):])

def atualizar_fontes(quiz, fonte):
    """Garante que o SITE da fonte (não a página) esteja na lista FONTE (app/fontes.js) da área."""
    if not fonte or not fonte.get("url"): return None
    import hashlib
    from urllib.parse import urlparse
    p = os.path.join(APP, "fontes.js"); s = open(p, encoding="utf-8").read(); u = urlparse(fonte["url"]); host = u.netloc.lower().replace("www.", "")
    fid = None
    for m in re.finditer(r'"([\w-]+)":\{n:"[^"]*",u:"([^"]*)"', s):
        if urlparse(m.group(2)).netloc.lower().replace("www.", "") == host: fid = m.group(1); break
    if not fid:
        fid = "x-" + hashlib.sha1(host.encode()).hexdigest()[:6]; j = lambda t: json.dumps(t, ensure_ascii=False)
        item = f' "{fid}":{{n:{j(fonte.get("site") or host)},u:{j(u.scheme + "://" + u.netloc + "/")},d:"",s:{j(fonte.get("site") or host)}}}'
        i = s.index("\n};\nvar A={")
        s = s[:i] + ",\n" + item + s[i:]
    am = re.search(r"\b" + quiz + r":\{nome:\"[^\"]*\",p:\[[^\]]*\],t:\[([^\]]*)\]", s)
    if am and f'"{fid}"' not in am.group(1): s = s[:am.end(1)] + f',"{fid}"' + s[am.end(1):]
    open(p, "w", encoding="utf-8").write(s); return fid

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
