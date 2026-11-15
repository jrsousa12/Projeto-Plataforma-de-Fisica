"""Motor de questão (questao.py): mostrar, buscar e alterar uma questão sem estragar o resto do banco.
Trabalha numa cópia dos bancos (pasta temporária); não mexe nos arquivos do projeto."""
import glob, json, os, shutil, subprocess, sys, tempfile
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.dirname(AQUI)
tmp = tempfile.mkdtemp()
for f in glob.glob(os.path.join(RAIZ, 'perguntas-*.js')):
    shutil.copy(f, tmp)
env = dict(os.environ, QUESTAO_RAIZ=tmp)
q = lambda *a: subprocess.run([sys.executable, os.path.join(AQUI, 'questao.py'), *a], capture_output=True, text=True, env=env)
orig = {f: open(f, encoding='utf-8').read() for f in glob.glob(os.path.join(tmp, '*.js'))}
# mostrar: um id de cada banco (formatos diferentes de separador)
for i in ('q001', 'd001', 't002', 'f002'):
    r = q(i, '-c', 'id,q'); assert r.returncode == 0 and '"id": "%s"' % i in r.stdout, r.stdout + r.stderr
    assert len(r.stdout) < 2000, 'saída grande demais para %s' % i
assert q('zz999').returncode != 0, 'id inexistente deveria falhar'
assert 'questão(ões)' in q('--busca', 'elétrons').stdout
# alterar e desfazer: o arquivo volta idêntico e só o trecho da questão muda
arq = os.path.join(tmp, 'perguntas-eletro.js')
velho = json.loads(q('q002', '-c', 'h,a').stdout.split('\n', 1)[1])
r = q('q002', 'h=Dica de teste', 'a:=%d' % velho['a'], 'z:=[1,2]'); assert r.returncode == 0, r.stderr
assert 'h, z' in r.stdout, r.stdout
novo = json.loads(q('q002').stdout.split('\n', 1)[1]); assert novo['h'] == 'Dica de teste' and novo['z'] == [1, 2]
assert q('q001', 'id=outro').returncode != 0, 'troca de id deveria falhar'
q('q002', 'h=' + velho['h'], '-x', 'z')
for f, s in orig.items():
    assert open(f, encoding='utf-8').read() == s, 'arquivo mudou depois de desfazer: ' + f
shutil.rmtree(tmp); print('t_questao OK')
