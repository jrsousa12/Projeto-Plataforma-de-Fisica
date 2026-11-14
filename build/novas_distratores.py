"""Alternativas erradas automáticas (questões de cálculo com "o": "auto"). Usado pelo novas.py.
Refaz a conta do bloco calc com um erro típico de aluno e usa o resultado como distrator, já com a frase do "x"."""
import hashlib
from novas_comum import *
from novas_unidades import Q, avaliar, mesmo, qty, unidade

SUPER = str.maketrans("0123456789-", "⁰¹²³⁴⁵⁶⁷⁸⁹⁻")


def formatar(v, un):
    """Número no jeito do banco: 3 algarismos, vírgula decimal, '× 10ⁿ' para muito grande ou pequeno."""
    if v == 0: return f"0 {un}".strip()
    e = math.floor(math.log10(abs(v)))
    if e < -3 or e >= 6:
        m = round(v / 10 ** e, 2)
        if abs(m) >= 10: m, e = m / 10, e + 1
        num = f"{m:.2f}".rstrip("0").rstrip(".").replace(".", ",") + " × 10" + str(e).translate(SUPER)
    else:
        num = f"{round(v, 2 - e):.{max(0, 2 - e)}f}"
        if "." in num: num = num.rstrip("0").rstrip(".")
        num = num.replace(".", ",")
        if abs(v) >= 10000: num = f"{int(round(v)):,}".replace(",", " ")
    return f"{num} {un}".strip()


def _conta(c, vs):
    return avaliar(c["expr"], vs).v / unidade(c["unidade"]).v


def candidatos(d):
    """Lista de (valor, frase) na ordem de preferência. O valor já está na unidade da resposta."""
    c = d["calc"]; rot = c.get("rotulos", {}); un = c["unidade"]
    vs = {k: qty(v) for k, v in c["vars"].items()}; val = _conta(c, vs); alvo = unidade(un)
    nome = lambda k: rot.get(k, k)
    out = []
    def troca(k, nova, frase):
        try: out.append((_conta(c, dict(vs, **{k: nova})), frase))
        except Exception: pass
    # 1. T final no lugar de ΔT (enunciado com duas temperaturas)
    temps = [float(t.replace(",", ".").replace("−", "-")) for t in re.findall(r"([-−]?\d+(?:,\d+)?)\s*°C", d.get("q", ""))]
    for k in vs:
        if re.match(r"^(dT|deltaT|ΔT)", k) and len(temps) >= 2 and not mesmo(temps[-1], vs[k].v, 1e-6):
            troca(k, Q(temps[-1], vs[k].d), f"Usou a temperatura final ({formatar(temps[-1], '°C')}) no lugar da variação {nome(k)}.")
    # 2. unidades não convertidas: só quando as unidades do enunciado não combinam entre si
    nums = {}
    for k, txt in c["vars"].items():
        m = re.match(r"^\s*([-+−]?[\d.,]+(?:[eE][-+−]?\d+)?)\s*(.*)$", txt)
        nums[k] = (Q(float(m.group(1).replace("−", "-").replace(",", ".")), vs[k].d), unidade(m.group(2)))
    try: cru = _conta(c, {k: n for k, (n, _) in nums.items()}) * alvo.v
    except Exception: cru = val
    if not mesmo(cru, val, 1e-6):
        out.append((cru, "Usou os números do enunciado sem converter as unidades."))
        for k, (n, u) in nums.items():
            if not mesmo(u.v, 1, 1e-9): troca(k, n, f"Não converteu {nome(k)} ({c['vars'][k]}) para a unidade do SI antes da conta.")
    # 3. resposta deixada no SI, sem passar para a unidade pedida
    if not mesmo(alvo.v, 1, 1e-9): out.append((val * alvo.v, f"Deixou o resultado na unidade do SI, sem converter para {un}."))
    # 4. grandeza que divide foi multiplicada (e, mais para o fim, o contrário)
    expo = {}
    for k in vs:
        try: expo[k] = math.log2(_conta(c, dict(vs, **{k: vs[k] * 2})) / val)
        except Exception: pass
    out += [(val * vs[k].v ** 2, f"Multiplicou por {nome(k)} em vez de dividir.") for k, p in expo.items() if abs(p + 1) < 1e-6]
    # 5. potência de dez; depois divisão no lugar da multiplicação e erro de conta
    out += [(val * 10, "Errou a potência de dez: o resultado ficou 10 vezes maior."), (val / 10, "Errou a potência de dez: o resultado ficou 10 vezes menor.")]
    out += [(val / vs[k].v ** 2, f"Dividiu por {nome(k)} em vez de multiplicar.") for k, p in expo.items() if abs(p - 1) < 1e-6]
    out += [(val * 2, "Errou a conta: o resultado ficou o dobro do certo."), (val / 2, "Errou a conta: o resultado ficou a metade do certo.")]
    return val, out


def gerar(d):
    """Devolve (o, a, x) com a certa numa posição sorteada (sempre a mesma para o mesmo enunciado)."""
    un = d["calc"]["unidade"]; val, cands = candidatos(d)
    certa = formatar(val, un); escolhidos = []
    for v, fr in cands:
        t = formatar(v, un)
        if not math.isfinite(v) or v == 0 or (v > 0) != (val > 0) or not 1e-6 < abs(v / val) < 1e6: continue
        if mesmo(v, val, .03) or t == certa or any(mesmo(v, w, .03) or t == s for w, s, _ in escolhidos): continue
        escolhidos.append((v, t, fr))
        if len(escolhidos) == 3: break
    if len(escolhidos) < 3: raise ValueError("não achei 3 alternativas erradas diferentes")
    a = int(hashlib.md5(d.get("q", "").encode()).hexdigest(), 16) % 4
    o, x = [t for _, t, _ in escolhidos], [fr for _, _, fr in escolhidos]
    o.insert(a, certa); x.insert(a, None)
    return o, a, {str(i): fr for i, fr in enumerate(x) if fr}


def preencher(arq):
    """Comando 'distratores': troca "o": "auto" pelas 4 alternativas, o gabarito e as frases do "x"."""
    j = json.load(open(arq, encoding="utf-8")); n = 0
    for i, d in enumerate(j["questoes"]):
        if d.get("o") != "auto": continue
        try: d["o"], d["a"], d["x"] = gerar(d); n += 1
        except Exception as ex: print(f"#{i+1}: não gerou ({ex})"); continue
        print(f"#{i+1}: " + " | ".join(("✔ " if k == d["a"] else "") + t for k, t in enumerate(d["o"])))
    json.dump(j, open(arq, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{n} questão(ões) preenchida(s) em {os.path.basename(arq)}. Confira as frases e rode: python3 novas.py verificar {arq}")
    return n
