"""Moldes de CONCEITO (animação montada só com textos): checagem e dados. Usado pelo novas.py.
Desenho em app/figuras-animq-conceito.js; formato em build/CLAUDE.md."""
from novas_comum import *  # caminhos, imports e utilidades

CONCEITOS = ("antes_depois", "etapas", "comparacao", "grafico")
ICONES = ("chama", "gelo", "barra", "bola", "agua", "mola", "onda", "mais", "menos", "seta")
CURVAS = ("sobe", "desce", "constante", "acelera", "satura", "patamar")
LIM_TITULO, LIM_TEXTO, LIM_LEGENDA = 18, 22, 48  # caracteres por linha (cabe na largura da figura)

def _linhas(R, loc, campo, txt, lim, max_l=2):
    if not isinstance(txt, str) or not txt.strip(): R.E(loc, f"conceito: falta o texto '{campo}'"); return
    ls = txt.split("|")
    if len(ls) > max_l: R.E(loc, f"conceito: '{campo}' tem {len(ls)} linhas (máx. {max_l}; separe linhas com '|')")
    for l in ls:
        if len(l) > lim: R.E(loc, f"conceito: linha de '{campo}' com {len(l)} caracteres (máx. {lim}), não cabe: «{l}»")

def _painel(R, loc, nome, p):
    if not isinstance(p, dict): R.E(loc, f"conceito: falta o painel '{nome}' ({{titulo, texto, icone}})"); return
    _linhas(R, loc, f"{nome}.titulo", p.get("titulo"), LIM_TITULO, 1)
    _linhas(R, loc, f"{nome}.texto", p.get("texto"), LIM_TEXTO)
    if p.get("icone") not in ICONES: R.E(loc, f"conceito: ícone '{p.get('icone')}' de '{nome}' desconhecido. Use: {', '.join(ICONES)}")
    e = p.get("escala", 1)
    if not isinstance(e, (int, float)) or not .5 <= e <= 1.6: R.E(loc, f"conceito: '{nome}.escala' deve ficar entre 0,5 e 1,6")

def checar_conceito(dec, loc, R):
    """Confere os dados de um molde de conceito; devolve True se não houve erro."""
    n0 = len(R.erros); m = dec.get("molde")
    if m not in CONCEITOS: R.E(loc, f"molde de conceito '{m}' desconhecido. Use: {', '.join(CONCEITOS)}"); return False
    leg = dec.get("legendas")
    if not isinstance(leg, list) or not 2 <= len(leg) <= 4: R.E(loc, "conceito: 'legendas' precisa ser uma lista de 2 a 4 textos"); leg = []
    for i, l in enumerate(leg): _linhas(R, loc, f"legendas[{i}]", l, LIM_LEGENDA)
    if m == "antes_depois": _painel(R, loc, "antes", dec.get("antes")); _painel(R, loc, "depois", dec.get("depois"))
    elif m == "comparacao": _painel(R, loc, "a", dec.get("a")); _painel(R, loc, "b", dec.get("b"))
    elif m == "etapas":
        et = dec.get("etapas")
        if not isinstance(et, list) or not 2 <= len(et) <= 4: R.E(loc, "conceito: 'etapas' precisa ter de 2 a 4 itens"); return False
        if len(leg) != len(et): R.E(loc, f"conceito: em 'etapas' use uma legenda por etapa ({len(et)} etapas, {len(leg)} legendas)")
        lim = int(((300 - (len(et) - 1) * 12) / len(et)) / 6.5)
        for i, e in enumerate(et):
            if not isinstance(e, dict): R.E(loc, f"conceito: etapas[{i}] deve ser {{titulo, icone?}}"); continue
            _linhas(R, loc, f"etapas[{i}].titulo", e.get("titulo"), lim, 3 if not e.get("icone") else 2)
            if e.get("icone") and e["icone"] not in ICONES: R.E(loc, f"conceito: ícone '{e['icone']}' desconhecido. Use: {', '.join(ICONES)}")
    elif m == "grafico":
        _linhas(R, loc, "x", dec.get("x"), 24, 1); _linhas(R, loc, "y", dec.get("y"), 24, 1)
        if dec.get("curva") not in CURVAS: R.E(loc, f"conceito: curva '{dec.get('curva')}' desconhecida. Use: {', '.join(CURVAS)}")
    return len(R.erros) == n0

def entrada_conceito(d, nid, dec):
    """Item gravado em figuras-animq-auto-dados.js (lido por figuras-animq-conceito.js)."""
    esc = lambda x: x.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;") if isinstance(x, str) else x
    def limpa(v):
        if isinstance(v, dict): return {k: limpa(x) for k, x in v.items()}
        if isinstance(v, list): return [limpa(x) for x in v]
        return esc(v)
    campos = {k: limpa(dec[k]) for k in ("antes", "depois", "a", "b", "etapas", "x", "y", "curva", "legendas") if k in dec}
    alt = "Animação: " + (dec.get("descricao") or re.sub(r"\s+", " ", d["q"])[:140])
    return {"key": f"conc_{nid}", "tipo": "conceito", "molde": dec["molde"], "alt": esc(alt), **campos}
