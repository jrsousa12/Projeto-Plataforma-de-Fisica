"""Compacta o código do arquivo único (tira comentários, recuos e espaços que não mudam nada).
JavaScript: build/compactar.js (precisa do Node e do TypeScript; sem eles, o código entra como está).
CSS: aqui mesmo, de forma conservadora."""
import json, os, re, subprocess

AQUI = os.path.dirname(os.path.abspath(__file__))


def js(lista):
    """Recebe uma lista de códigos JavaScript e devolve a lista compactada (ou a original, se falhar)."""
    try:
        r = subprocess.run(['node', os.path.join(AQUI, 'compactar.js')], input=json.dumps(lista),
                           capture_output=True, text=True, encoding='utf-8', check=True, timeout=300)
        saida = json.loads(r.stdout)
        assert len(saida) == len(lista)
        return saida
    except Exception as e:
        print('aviso: JavaScript não compactado (%s)' % str(e).splitlines()[0][:120])
        return lista


def css(texto):
    """Tira comentários, recuos e linhas vazias; junta espaços em volta de { } ; e depois de vírgula.
    Não mexe em textos entre aspas, em espaço antes de ':' (em seletor muda o sentido) nem dentro de calc()."""
    texto = re.sub(r'/\*.*?\*/', '', texto, flags=re.S)   # comentários primeiro (podem ter apóstrofo)
    partes = re.split(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', texto)
    for i in range(0, len(partes), 2):   # posições pares: fora das aspas
        t = re.sub(r'\s+', ' ', partes[i])
        t = re.sub(r'\s*([{};])\s*', r'\1', t)
        partes[i] = re.sub(r',\s+', ',', t).replace(';}', '}')
    return ''.join(partes).strip() + '\n'
