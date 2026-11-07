#!/usr/bin/env python3
"""Roda todos os testes de navegador e resume: ./testes.py [nome ...]  (sem nomes = todos)."""
import subprocess,sys,glob,os,re,time
os.chdir('/home/claude/quiz/build')
ignorar=("Clipboard API has been blocked","reading 'textContent'")  # artefatos conhecidos do ambiente de teste
nomes=sys.argv[1:] or sorted(glob.glob('t_*.py'))
falhas=0
for t in nomes:
    t0=time.time()
    try:
        r=subprocess.run(['./run2.sh',t],capture_output=True,text=True,timeout=900);saida=r.stdout+r.stderr
    except subprocess.TimeoutExpired: saida='TIMEOUT'
    linhas=[l for l in saida.splitlines() if not any(i in l for i in ignorar)]
    ruim=[l for l in linhas if 'Traceback' in l or 'TIMEOUT' in l or re.search(r'err(o|s|ors)s?:? ?\[[^\]]',l,re.I) or 'Error:' in l]
    ok=not ruim;falhas+=0 if ok else 1
    print(('OK   ' if ok else 'FALHA'),t,'(%ds)'%(time.time()-t0))
    for l in ruim[:3]: print('    ',l[:200])
print('\n%d teste(s) com falha.'%falhas if falhas else '\nTodos os testes passaram.')
sys.exit(1 if falhas else 0)
