#!/usr/bin/env python3
"""Roda os testes de navegador e resume: ./testes.py [-j N] [nome ...]  (sem nomes = todos).
Roda N testes ao mesmo tempo (padrão: até 4), cada um com portas próprias; -j 1 roda um por vez.
O t_anim.py (o mais lento) é dividido em um teste por quiz. A variável QUIZ=termo,mec limita os quizzes do t_anim.py."""
import subprocess, sys, glob, os, re, time
from concurrent.futures import ThreadPoolExecutor
os.chdir(os.path.dirname(os.path.abspath(__file__)))
# o t_flow.py abre o arquivo único (build/saida/), que não fica no Git: gera antes de testar
subprocess.run([sys.executable, 'bundle.py'], check=True, stdout=subprocess.DEVNULL)
ignorar = ("Clipboard API has been blocked", "reading 'textContent'")  # artefatos conhecidos do ambiente de teste
args = sys.argv[1:]
j = min(4, os.cpu_count() or 1)
if '-j' in args:
    k = args.index('-j'); j = max(1, int(args[k + 1])); del args[k:k + 2]
nomes = args or sorted(glob.glob('t_*.py'))

# lista de trabalhos: (rótulo, arquivo, QUIZ); t_anim.py vira um trabalho por quiz
from lista_quizzes import ids
trabalhos = []
for t in nomes:
    if t == 't_anim.py' and j > 1:
        so = [x for x in os.environ.get('QUIZ', '').split(',') if x] or ids()
        trabalhos += [('t_anim.py[%s]' % q, t, q) for q in so]
    else:
        trabalhos.append((t, t, os.environ.get('QUIZ', '')))
# testes presos às portas padrão (a CSP do index.html só libera a nuvem simulada em 127.0.0.1:8124): rodam sozinhos no fim
PADRAO = ('t_nuvem.py',)
fim = [w for w in trabalhos if w[1] in PADRAO]; trabalhos = [w for w in trabalhos if w[1] not in PADRAO]
trabalhos.sort(key=lambda w: not w[1] in ('t_anim.py', 't_flow.py', 't_fonte.py'))  # os lentos primeiro

livres = list(range(j))  # cada vaga usa as portas 8123+2v e 8124+2v
def rodar(w, padrao=False):
    rot, t, quiz = w
    v = 0 if padrao else livres.pop()
    env = dict(os.environ, PORTA=str(8123 + 2 * v), PORTA_FB=str(8124 + 2 * v), QUIZ=quiz)
    t0 = time.time()
    try:
        r = subprocess.run(['./run2.sh', t], capture_output=True, text=True, timeout=900, env=env); saida = r.stdout + r.stderr
    except subprocess.TimeoutExpired:
        saida = 'TIMEOUT'
    finally:
        None if padrao else livres.append(v)
    linhas = [l for l in saida.splitlines() if not any(i in l for i in ignorar)]
    ruim = [l for l in linhas if 'Traceback' in l or 'TIMEOUT' in l or re.search(r'err(o|s|ors)s?:? ?\[[^\]]', l, re.I) or 'Error:' in l]
    msg = [('OK   ' if not ruim else 'FALHA') + ' %s (%ds)' % (rot, time.time() - t0)] + ['     ' + l[:200] for l in ruim[:3]]
    print('\n'.join(msg), flush=True)
    return not ruim

t0 = time.time()
with ThreadPoolExecutor(j) as ex:
    falhas = sum(1 for ok in ex.map(rodar, trabalhos) if not ok)
falhas += sum(1 for w in fim if not rodar(w, True))
print('\nTempo total: %ds com %d ao mesmo tempo.' % (time.time() - t0, j))
print('\n%d teste(s) com falha.' % falhas if falhas else '\nTodos os testes passaram.')
sys.exit(1 if falhas else 0)
