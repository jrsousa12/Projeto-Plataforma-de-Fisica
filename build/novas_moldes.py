"""Moldes de animação (figuras-animq-auto-dados.js) e lista FONTE dos bancos. Usado pelo novas.py."""
from novas_comum import *  # caminhos, imports e utilidades
from novas_unidades import avaliar, qty, unidade

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
    p = os.path.join(APP, "figuras-animq-auto-dados.js"); s = open(p, encoding="utf-8").read()
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
