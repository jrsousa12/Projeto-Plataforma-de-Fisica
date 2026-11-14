"""Escolhe só os testes ligados aos arquivos alterados (usado por: testes.py --mudou [ref]).
Alterados = git diff contra `ref` (padrão HEAD) + arquivos novos ainda não registrados no Git."""
import glob, os, re, subprocess

TODOS = None   # sinal de "mudou algo de que todos os testes dependem"
BASICOS = ['t_flow.py', 't_ui.py']   # rodada completa (http, arquivo único, prévia) + tema/menu

# (padrão do caminho, testes). Caminhos relativos à raiz do projeto.
REGRAS = [
    (r'\.(md|txt|png|svg|webmanifest)$|^\.gitignore$|^build/(novas|exemplos)/', []),  # textos e dados de rascunho
    (r'^build/(navegador\.py|run2\.sh|mockfb\.py|testes(_mudou)?\.py|lista_quizzes\.py)$', TODOS),
    (r'^build/novas', ['t_novas.py']),
    (r'^build/(bundle|compactar)\.py$', ['t_flow.py', 't_estilo.py']),
    (r'^(perguntas-|banco-|quizzes\.js|validar-banco\.js)', ['t_valida.py', 't_lazy.py']),
    (r'\.css$', ['t_estilo.py']),
    (r'^figuras', ['t_anim.py', 't_figs2.py']),
    (r'^(eq\.js|app-subscritos\.js)', ['t_eq.py']),
    (r'^(nuvem\.js|firebase-config\.js)', ['t_nuvem.py']),
    (r'^editor\.', ['t_cod.py', 't_novo.py']),
    (r'^fontes\.js', ['t_fonte.py']),
    (r'^(script\.js|index\.html|sw\.js)', BASICOS + ['t_multi.py', 't_novo2.py', 't_menu3.py']),
]


def alterados(ref='HEAD'):
    """Lista os arquivos alterados (caminhos relativos à raiz do projeto)."""
    git = lambda *a: subprocess.run(['git', *a], capture_output=True, text=True, check=True).stdout.split('\n')
    lst = git('diff', '--name-only', ref) + git('ls-files', '--others', '--exclude-standard', '--full-name', ':/')
    return sorted({x for x in lst if x})


def citam(nome):
    """Testes cujo código cita o nome do arquivo (ex.: app-relogio.js aparece no t_relogio.py)."""
    pad = re.compile(r'(?<![\w-])' + re.escape(nome) + r'(?![\w-])')
    return [t for t in sorted(glob.glob('t_*.py')) if pad.search(open(t, encoding='utf-8').read())]


def escolher(arquivos):
    """Devolve (testes, motivos). testes=None quer dizer rodar todos."""
    sel, motivos = [], {}
    def por(ts, arq):
        for t in ts:
            if os.path.exists(t) and t not in sel: sel.append(t)
            motivos.setdefault(t, arq)
    for arq in arquivos:
        nome = os.path.basename(arq)
        if re.match(r'^build/t_\w+\.py$', arq): por([nome], arq); continue
        regra = next((ts for pad, ts in REGRAS if re.search(pad, arq)), 'nenhuma')
        if regra is TODOS: return None, {'todos': arq}
        if regra == []: continue   # textos: nenhum teste
        cit = [] if nome == 'index.html' else citam(nome)
        if regra == 'nenhuma': regra = [] if arq.startswith('build/') or cit else BASICOS
        por(regra + cit, arq)
    return sel, motivos
