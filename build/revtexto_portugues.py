"""Revisão de textos: conferências de português (sem dicionário completo).
Cada função recebe (texto, cfg) e devolve avisos [(tipo, trecho, sugestão)]."""
import re

L = 'A-Za-zÀ-ÖØ-öø-ÿ'          # letras com acento
MIN = 'a-zß-öø-ÿ'


def _palavra(chave):
    """Expressão que acha a chave como palavra inteira (sem pegar pedaço de outra)."""
    return re.compile(r'(?<![%s])%s(?![%s])' % (L, re.escape(chave), L), re.I)


def repetidas(t, cfg):
    ok = {x.lower() for x in cfg.get('repeticao_ok', [])}
    out = []
    for m in re.finditer(r'(?<![%s])([%s]+)\s+\1(?![%s])' % (L, L, L), t):   # 'E e' (símbolo E) não conta
        if m.group(0).lower() not in ok:
            out.append(('palavra repetida', m.group(0), 'apagar uma das duas'))
    return out


def espacos(t, cfg):
    out = []
    for m in re.finditer(r'\S {2,}\S', t):
        out.append(('espaço duplo', m.group(0), 'deixar um espaço só'))
    for m in re.finditer(r'[%s0-9)] +[,.;:!?](?![.\d])' % L, t):
        out.append(('espaço antes da pontuação', m.group(0), 'tirar o espaço'))
    for m in re.finditer(r'[%s]{2,}[,;:][%s]|[%s]{2,}[.!?][A-ZÀ-Ö]' % (MIN, L, MIN), t):
        out.append(('falta espaço depois da pontuação', m.group(0), 'pôr um espaço'))
    return out


def maiuscula(t, cfg):
    """Letra minúscula logo depois de ponto final (ignora abreviações como 'ex.')."""
    abrev = {a.lower() for a in cfg.get('abreviacoes', [])}
    out = []
    for m in re.finditer(r'([%s]+)[.!?] +([%s])(?![%s]*\s*[=(₀-₉])' % (L, MIN, L), t):   # 'Pa. p = …': símbolo, não conta
        if m.group(1).lower() not in abrev and len(m.group(1)) > 1:
            out.append(('minúscula depois do ponto', m.group(0), 'começar a frase com maiúscula'))
    return out


def acentos(t, cfg):
    out = []
    for errado, certo in cfg.get('sem_acento', {}).items():
        for m in _palavra(errado).finditer(t):
            out.append(('falta acento', m.group(0), certo))
    return out


def termos(t, cfg):
    """Padrão da plataforma: termo que deve ser sempre escrito do mesmo jeito."""
    out = []
    for de, para in cfg.get('preferir', {}).items():
        if de.startswith('_'):
            continue
        for m in _palavra(de).finditer(t):
            if m.group(0) == de:   # chave com maiúscula só pega com maiúscula
                out.append(('termo fora do padrão', m.group(0), para))
    return out


TODAS = [repetidas, espacos, maiuscula, acentos, termos]
