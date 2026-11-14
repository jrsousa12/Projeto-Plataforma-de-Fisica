"""Grandezas com unidade (Q), calculadora segura e número de cada alternativa. Usado pelo novas.py."""
from novas_comum import *  # caminhos, imports e utilidades

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
