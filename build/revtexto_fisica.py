"""Revisão de textos: conferências de física (unidades e números).
Cada função recebe (texto, cfg) e devolve avisos [(tipo, trecho, sugestão)]."""
import re

NUM = r'(?>-?\d+(?: \d{3})*(?:,\d+)?)'   # 12 | 1 000 000 | 9,78 (grupo atômico: não corta o número)


def unidades(t, cfg):
    out = []
    for pad, sug in cfg.get('unidades', {}).items():
        if pad.startswith('_'):
            continue
        for m in re.finditer(pad, t):
            out.append(('unidade fora do padrão', m.group(0), sug))
    return out


def coladas(t, cfg):
    """Número grudado na unidade: '20m/s' -> '20 m/s'."""
    u = cfg.get('unidades_coladas', '')
    if not u:
        return []
    pad = re.compile(r'(?<![\w,])(\d+(?:,\d+)?)(%s)(?![\wÀ-ÿ²³/])' % u)
    return [('número colado na unidade', m.group(0), '%s %s' % (m.group(1), m.group(2)))
            for m in pad.finditer(t)]


def decimal(t, cfg):
    """Ponto como separador decimal (em português é vírgula)."""
    return [('ponto decimal', m.group(0), m.group(0).replace('.', ','))
            for m in re.finditer(r'(?<![\d.,])\d+\.\d+(?![\d.,])', t)]


def sem_unidade(t, cfg):
    """Resultado de grandeza com unidade escrito sem unidade: 'v = 20.' (só aviso de atenção)."""
    simb = cfg.get('simbolos_com_unidade', [])
    if not simb:
        return []
    alt = '|'.join(re.escape(s) for s in sorted(simb, key=len, reverse=True))
    pad = re.compile(r'(?<![\wÀ-ÿ])(%s)\s*=\s*%s(?=\s*(?:[.;)]|,\s|$|\s+e\s))' % (alt, NUM))   # zero não precisa de unidade
    return [('número sem unidade?', m.group(0), 'conferir se falta a unidade')
            for m in pad.finditer(t) if not re.search(r'=\s*-?0$', m.group(0))]


TODAS = [unidades, coladas, decimal, sem_unidade]
