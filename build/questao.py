"""Motor de questão: mostra ou altera UMA questão dos bancos perguntas-*.js, sem ler o banco inteiro.
Os bancos têm linhas enormes (até ~130 KB); um grep pelo id devolveria a linha toda.

Uso (da raiz ou de build/):
  python3 build/questao.py q001 [t002 ...]       mostra as questões (com o banco de cada uma)
  python3 build/questao.py q001 -c q,e           mostra só os campos pedidos
  python3 build/questao.py --busca "capacitor"   lista id + início do enunciado que contém o texto
  python3 build/questao.py q001 h="Nova dica"    troca um campo de texto
  python3 build/questao.py q001 a:=2 'o:=["A","B","C","D"]'   troca um campo como JSON (números, listas)
  python3 build/questao.py q001 -x f             apaga um campo
Ao alterar, só o trecho da questão muda no arquivo; depois rode: node validar-banco.js"""
import glob, json, os, re, sys

RAIZ = os.environ.get('QUESTAO_RAIZ') or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # variável: usada no teste
CAB = re.compile(r'window\.BANKS\.(\w+)=\[')


def bancos():
    """Para cada banco: (arquivo, texto, nome, [(questão, início, fim)]) com o trecho exato de cada questão."""
    dec = json.JSONDecoder()
    for arq in sorted(glob.glob(os.path.join(RAIZ, 'perguntas-*.js'))):
        s = open(arq, encoding='utf-8').read()
        m = CAB.search(s)
        if not m:
            continue
        i, itens = m.end(), []
        while True:
            while s[i] in ' ,\n\t\r':
                i += 1
            if s[i] == ']':
                break
            obj, fim = dec.raw_decode(s, i)
            itens.append((obj, i, fim)); i = fim
        yield arq, s, m.group(1), itens


def achar(ids):
    achados = {}
    for arq, s, nome, itens in bancos():
        for obj, ini, fim in itens:
            if obj.get('id') in ids:
                achados[obj['id']] = (arq, s, nome, obj, ini, fim)
    falta = [i for i in ids if i not in achados]
    if falta:
        sys.exit('Não achei: ' + ', '.join(falta))
    return achados


def mostrar(ids, campos):
    for i, (arq, _, nome, obj, _, _) in achar(ids).items():
        if campos:
            obj = {k: obj[k] for k in campos if k in obj}
        print('# %s  (banco %s, %s)' % (i, nome, os.path.basename(arq)))
        print(json.dumps(obj, ensure_ascii=False, indent=1))


def buscar(txt):
    t, n = txt.lower(), 0
    for _, _, nome, itens in bancos():
        for obj, _, _ in itens:
            if t in json.dumps(obj, ensure_ascii=False).lower():
                n += 1; print('%s [%s] %s' % (obj.get('id'), nome, obj.get('q', '')[:90]))
    print('%d questão(ões).' % n)


def alterar(qid, trocas, apagar):
    arq, s, nome, obj, ini, fim = achar([qid])[qid]
    novo = dict(obj)
    for t in trocas:
        if t.find(':=') >= 0 and t.find(':=') + 1 == t.find('='):   # campo:=json
            k, v = t.split(':=', 1); novo[k] = json.loads(v)
        else:
            k, v = t.split('=', 1); novo[k] = v
    for k in apagar:
        novo.pop(k, None)
    if novo.get('id') != qid:
        sys.exit('O id não pode mudar por aqui.')
    # mantém o estilo do trecho original (com ou sem espaços)
    compacto = s[ini:fim] == json.dumps(obj, ensure_ascii=False, separators=(',', ':'))
    sep = (',', ':') if compacto else None
    txt = json.dumps(novo, ensure_ascii=False, separators=sep)
    open(arq, 'w', encoding='utf-8').write(s[:ini] + txt + s[fim:])
    mud = sorted(k for k in set(obj) | set(novo) if obj.get(k) != novo.get(k))
    print('%s alterada em %s: %s' % (qid, os.path.basename(arq), ', '.join(mud) or 'nada mudou'))


def main(a):
    if not a or a[0] in ('-h', '--help'):
        print(__doc__); return
    if a[0] == '--busca':
        return buscar(' '.join(a[1:]))
    ids, trocas, apagar, campos, i = [], [], [], [], 0
    while i < len(a):
        x = a[i]
        if x in ('-c', '-x'):
            (campos if x == '-c' else apagar).extend(a[i + 1].split(',')); i += 2; continue
        (trocas if '=' in x else ids).append(x); i += 1
    if trocas or apagar:
        if len(ids) != 1:
            sys.exit('Para alterar, indique um id só.')
        return alterar(ids[0], trocas, apagar)
    mostrar(ids, campos)


if __name__ == '__main__':
    main(sys.argv[1:])
