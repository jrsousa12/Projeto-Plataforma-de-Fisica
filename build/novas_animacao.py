"""Viabilidade de animação, estrutura (validador do app) e questões duplicadas. Usado pelo novas.py."""
from novas_comum import *  # caminhos, imports e utilidades
from novas_conceito import checar_conceito

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
    if dec.get("decisao") == "conceito":
        if not checar_conceito(dec, loc, R): return ("erro", "")
        return ("molde", f"animação de conceito gerada pelo molde '{dec.get('molde')}'")
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
