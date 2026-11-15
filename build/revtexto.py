#!/usr/bin/env python3
"""Motor de revisão de textos: aponta problemas de português, física e clareza. NÃO altera nada.

Uso (da raiz ou de build/):
  python3 build/revtexto.py q001 [t002 ...]      revisa estas questões
  python3 build/revtexto.py --area termo         revisa um banco inteiro (eletro, termo, onda...)
  python3 build/revtexto.py --todas              revisa todos os bancos
  python3 build/revtexto.py --arquivo texto.md   revisa um texto solto (.txt, .md ou .html)
  python3 build/revtexto.py --texto "frase"      revisa uma frase (teste rápido)
Grava build/revtexto/relatorio.md e mostra só o resumo. Conferências: revtexto_portugues.py,
revtexto_fisica.py, revtexto_clareza.py; listas e limites (editáveis): revtexto_termos.json."""
import collections, json, os, re, subprocess, sys
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
import revtexto_portugues, revtexto_fisica, revtexto_clareza

POR_TEXTO = revtexto_portugues.TODAS + revtexto_fisica.TODAS + revtexto_clareza.TEXTO
LETRA = 'ABCDEFGH'


def config(caminho=None):
    return json.load(open(caminho or os.path.join(AQUI, 'revtexto_termos.json'), encoding='utf-8'))


def revisar_texto(t, cfg):
    """[(tipo, trecho, sugestão)] para um texto."""
    return [a for f in POR_TEXTO for a in f(t, cfg)]


def campos(q):
    """Textos de uma questão: (nome do campo, texto)."""
    for c in ('q', 'h', 'e'):
        if isinstance(q.get(c), str):
            yield c, q[c]
    if isinstance(q.get('o'), list):
        for i, x in enumerate(q['o']):
            if isinstance(x, str):
                yield 'alt ' + LETRA[i], x
    x = q.get('x') or {}
    for k, x in sorted(x.items() if isinstance(x, dict) else ((str(i), v) for i, v in enumerate(x))):
        if isinstance(x, str):
            yield 'erro ' + LETRA[int(k)] if k.isdigit() and int(k) < 8 else 'x' + k, x


def revisar_questao(q, cfg):
    """[(campo, tipo, trecho, sugestão)] para uma questão, sem os avisos marcados para ignorar."""
    av = [(c,) + a for c, t in campos(q) for a in revisar_texto(t, cfg)]
    av += [a for f in revtexto_clareza.QUESTAO for a in f(q, cfg)]
    ign = cfg.get('ignorar', {}).get(q.get('id'), [])
    return [a for a in av if not any(i in ' '.join(a) for i in ign)]


def bancos():
    r = subprocess.run(['node', os.path.join(AQUI, 'dump_banco.js')], capture_output=True, text=True, check=True)
    return json.loads(r.stdout)['banks']


def texto_de_arquivo(caminho):
    """Parágrafos de um arquivo de texto: [(nome, texto)]. Tira marcas de HTML e de Markdown."""
    s = open(caminho, encoding='utf-8').read()
    s = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', s, flags=re.S | re.I)
    s = re.sub(r'<br\s*/?>|</(p|div|li|h\d)>', '\n\n', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    out, linha = [], 1
    for bloco in re.split(r'\n\s*\n', s):
        t = re.sub(r'^\s*(#+|[-*]|\d+\.)\s+', '', bloco.strip(), flags=re.M)
        t = re.sub(r'\*\*|__|`', '', ' '.join(t.split()))
        if t:
            out.append(('linha %d' % linha, t))
        linha += bloco.count('\n') + 2
    return out


def relatorio(itens, titulo):
    """itens = [(nome, [(campo, tipo, trecho, sugestão)])]. Grava o relatório e devolve o resumo."""
    os.makedirs(os.path.join(AQUI, 'revtexto'), exist_ok=True)
    arq = os.path.join(AQUI, 'revtexto', 'relatorio.md')
    tipos = collections.Counter(a[1] for _, av in itens for a in av)
    com = [(n, av) for n, av in itens if av]
    md = ['# Revisão de textos: %s' % titulo, '',
          '%d item(ns) revisado(s), %d com aviso, %d aviso(s).' % (len(itens), len(com), sum(tipos.values())), '']
    md += ['- %s: %d' % (t, n) for t, n in tipos.most_common()] + ['']
    for n, av in com:
        md.append('## %s' % n)
        md += ['- **%s** (%s): “%s” → %s' % (a[1], a[0], a[2], a[3]) for a in av]
        md.append('')
    open(arq, 'w', encoding='utf-8').write('\n'.join(md))
    res = md[2] + '\n' + '\n'.join('  %s: %d' % (t, n) for t, n in tipos.most_common())
    return res + '\nRelatório: ' + os.path.relpath(arq)


def main(args):
    cfg = config(os.environ.get('REVTEXTO_CFG'))
    if not args or args[0] in ('-h', '--ajuda'):
        print(__doc__); return 0
    if args[0] == '--texto':
        av = [('texto',) + a for a in revisar_texto(' '.join(args[1:]), cfg)]
        print('\n'.join('%s: “%s” → %s' % (a[1], a[2], a[3]) for a in av) or 'Nenhum aviso.'); return 0
    if args[0] == '--arquivo':
        itens = []
        for c in args[1:]:
            itens += [('%s, %s' % (os.path.basename(c), n), [(n,) + a for a in revisar_texto(t, cfg)])
                      for n, t in texto_de_arquivo(c)]
        print(relatorio(itens, ', '.join(args[1:]))); return 0
    b = bancos()
    if args[0] == '--todas':
        qs, tit = [q for v in b.values() for q in v], 'todos os bancos'
    elif args[0] == '--area':
        if args[1:2] == [] or args[1] not in b:
            print('Área desconhecida. Use uma de:', ', '.join(sorted(b))); return 1
        qs, tit = b[args[1]], 'banco ' + args[1]
    else:
        por_id = {q['id']: q for v in b.values() for q in v}
        falta = [i for i in args if i not in por_id]
        if falta:
            print('Não achei:', ', '.join(falta)); return 1
        qs, tit = [por_id[i] for i in args], ', '.join(args)
    print(relatorio([(q['id'], revisar_questao(q, cfg)) for q in qs], tit)); return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
