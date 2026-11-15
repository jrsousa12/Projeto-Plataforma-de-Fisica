"""Revisão de textos: clareza para o aluno.
frases_longas vale para qualquer texto; as outras olham a questão inteira (enunciado e alternativas)."""
import re


def frases(t):
    """Divide em frases (não corta em 9,78 nem em 'ex.')."""
    return [f for f in re.split(r'(?<=[.!?])\s+(?=[A-ZÀ-Ö0-9])', t) if f.strip()]


def frases_longas(t, cfg):
    lim = cfg.get('limites', {}).get('palavras_por_frase', 40)
    out = []
    for f in frases(t):
        n = len(f.split())
        if n > lim:
            out.append(('frase longa', '%s… (%d palavras)' % (' '.join(f.split()[:8]), n),
                        'dividir em frases menores (até %d palavras)' % lim))
    return out


def sem_pergunta(q, cfg):
    """Enunciado sem '?' e sem comando ('Calcule', 'Assinale'...): o aluno pode não saber o que fazer."""
    t = (q.get('q') or '').strip()
    if isinstance(q.get('o'), list) and len(q['o']) == 2:   # Verdadeiro/Falso: a afirmação é o enunciado
        return []
    if not t or '?' in t or t.endswith((':', '…', '...')) or '___' in t:
        return []
    cmds = cfg.get('comandos_sem_pergunta', [])
    if re.search(r'\b(%s)' % '|'.join(cmds), t, re.I):
        return []
    return [('q', 'enunciado sem pergunta', t[-60:], 'terminar com uma pergunta ou um comando (Calcule…, Assinale…)')]


def alternativas(q, cfg):
    """Alternativas de tamanhos muito diferentes (o aluno 'chuta' a maior)."""
    o, a = q.get('o'), q.get('a')
    if not isinstance(o, list) or len(o) < 3 or not all(isinstance(x, str) for x in o):
        return []
    lim = cfg.get('limites', {})
    tam = [len(x) for x in o]
    out = []
    if isinstance(a, int) and 0 <= a < len(o):
        outras = tam[:a] + tam[a + 1:]
        media = sum(outras) / len(outras)
        if tam[a] == max(tam) and tam[a] >= lim.get('correta_maior_vezes', 1.6) * media \
                and tam[a] - media >= lim.get('diferenca_minima', 15):   # números curtos ('40 J') não contam
            out.append(('o', 'correta é a mais longa', '%d letras contra %d em média' % (tam[a], media),
                        'encurtar a correta ou alongar as erradas'))
    if min(tam) and max(tam) / min(tam) >= lim.get('alternativas_razao', 5) and not out \
            and max(tam) - min(tam) >= lim.get('diferenca_minima', 15):
        out.append(('o', 'alternativas desiguais', 'de %d a %d letras' % (min(tam), max(tam)),
                    'deixar as alternativas com tamanhos parecidos'))
    return out


TEXTO = [frases_longas]          # por texto: (texto, cfg) -> [(tipo, trecho, sugestão)]
QUESTAO = [sem_pergunta, alternativas]   # por questão: (q, cfg) -> [(campo, tipo, trecho, sugestão)]
