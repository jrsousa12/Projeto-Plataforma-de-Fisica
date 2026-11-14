#!/usr/bin/env python3
"""Conferência rápida: olha os arquivos que mudaram e roda só as verificações e os testes ligados a eles.

Uso (de qualquer pasta):
  python3 build/rapido.py            mudanças desde o origin/main (commits + arquivos não enviados)
  python3 build/rapido.py --listar   só mostra o que rodaria, sem rodar
  python3 build/rapido.py --base REF compara com outro ponto do Git
  python3 build/rapido.py --tudo     roda tudo (o mesmo que antes de enviar ao main)
Arquivo que não está no mapa abaixo → roda todos os testes (na dúvida, testa tudo).
"""
import fnmatch, glob, os, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
TODOS = "*"  # marca "todos os testes de navegador"

# (padrões de arquivo, testes de navegador). A primeira regra que casar vale.
MAPA = [
    (["*.md", "*.txt", ".gitignore", "build/*.md", "build/exemplos/*", ".github/*", "build/novas/*.md", "build/novas/fontes_cache/*"], []),
    (["build/t_*.py"], None),  # teste alterado: roda ele mesmo
    (["eq.js", "build/eqaudit.js", "build/eqcheck.js", "build/corrigir_eq.py"], ["t_eq.py", "t_anim.py"]),
    (["figuras-anim.js", "figuras-animq-*.js", "figuras-fenomeno-*.js"], ["t_anim.py", "t_eq.py"]),
    (["figuras.js", "figuras-fluidos.js", "figuras-termo.js"], ["t_figs2.py", "t_flow.py", "t_termo.py"]),
    (["perguntas-*.js", "quiz-*.js", "build/novas/*", "build/novas.py"], ["t_anim.py", "t_flow.py", "t_termo.py", "t_sheet.py"]),
    (["editor.*", "banco-proprio.js", "banco-extra.js"], ["t_cod.py", "t_novo.py"]),
    (["nuvem.js", "firebase-config.js", "perfil.js", "build/mockfb.py"], ["t_nuvem.py", "t_novo.py"]),
    (["fontes.js"], ["t_fonte.py"]),
    (["quizzes.js", "sw.js", "index.html", "manifest.webmanifest", "icon*", "build/lista_quizzes.py"],
     ["t_lazy.py", "t_multi.py", "t_novo2.py", "t_ui.py"]),
    (["build/bundle.py"], ["t_flow.py"]),
    (["build/versao.py", "build/gerar_readme.py", "build/tudo.sh", "build/rapido.py", "build/buscar.js"], []),
    (["build/testes.py", "build/run2.sh"], TODOS),
    # script.js, style.css, fx.js e qualquer outro arquivo caem no padrão: todos os testes
]


def git(*a):
    return subprocess.run(["git", *a], cwd=RAIZ, capture_output=True, text=True).stdout.split()


def mudados(base):
    ponto = (git("merge-base", base, "HEAD") or [base])[0]
    arqs = set(git("diff", "--name-only", ponto))  # commits + alterações não gravadas
    arqs |= set(git("ls-files", "--others", "--exclude-standard"))  # arquivos novos
    return sorted(arqs)


def plano(arqs):
    testes, sem_regra = set(), []
    for a in arqs:
        for pads, ts in MAPA:
            if any(fnmatch.fnmatch(a, p) for p in pads):
                testes |= {os.path.basename(a)} if ts is None else set(ts)
                break
        else:
            sem_regra.append(a)
    if sem_regra:
        testes = {TODOS}
    return testes, sem_regra


def dono_ids(qs):
    return {q["id"] for q in qs}


def quizzes_afetados(arqs):
    """Quizzes cujo t_anim.py precisa rodar. Vazio = todos (arquivo comum a vários quizzes, ou fora deles)."""
    sys.path.insert(0, AQUI)
    from lista_quizzes import quizzes
    qs = quizzes()
    dono = {}
    for q in qs:
        for f in q["arquivos"]:
            dono.setdefault(f, []).append(q["id"])
    anim = [a for a in arqs if "t_anim.py" in (plano([a])[0])]
    for a in anim:  # questões novas: build/novas/<quiz>_....json
        if a.startswith("build/novas/") and a.split("/")[-1].split("_")[0] in dono_ids(qs):
            dono[a] = [a.split("/")[-1].split("_")[0]]
    if any(len(dono.get(a, [])) != 1 for a in anim):
        return []
    return sorted({dono[a][0] for a in anim})


def rodar(nome, cmd, cwd=RAIZ):
    print(">>", nome, flush=True)
    r = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True)
    print("   " + "\n   ".join(l[:200] for l in (r.stdout + r.stderr).strip().splitlines()[-3:]))
    if r.returncode:
        print("   FALHA em:", nome)
    return r.returncode == 0


def main():
    args = sys.argv[1:]
    base = args[args.index("--base") + 1] if "--base" in args else "origin/main"
    arqs = ["script.js"] if "--tudo" in args else mudados(base)
    testes, sem_regra = plano(arqs)
    js = [a for a in arqs if a.endswith(".js") and "/" not in a and os.path.exists(os.path.join(RAIZ, a))]
    banco = any(fnmatch.fnmatch(a, p) for a in arqs for p in ("perguntas-*.js", "quiz-*.js", "quizzes.js", "build/novas*"))
    print("Arquivos mudados:", ", ".join(arqs) or "nenhum")
    if sem_regra:
        print("Sem regra no mapa (por isso roda tudo):", ", ".join(sem_regra))
    lista = sorted(os.path.basename(t) for t in glob.glob(os.path.join(AQUI, "t_*.py"))) if TODOS in testes else sorted(testes)
    print("Testes de navegador:", " ".join(lista) or "nenhum")
    if "--listar" in args:
        return 0
    ok = True
    if js:
        ok &= rodar("sintaxe dos .js", "for f in %s; do node --check \"$f\" || exit 1; done" % " ".join(js))
    ok &= rodar("bancos de perguntas", "node validar-banco.js")
    if banco or "--tudo" in args:
        ok &= rodar("aritmética das explicações", "python3 novas.py auditar --estrito", AQUI)
    ok &= rodar("tabela do README", "python3 gerar_readme.py --verificar && ! python3 gerar_readme.py --verificar | grep -q 'SEM DESCRI'", AQUI)
    if lista:
        qs = quizzes_afetados(arqs) if TODOS not in testes else []
        if qs and "t_anim.py" in lista:
            print("   t_anim.py só nos quizzes:", ",".join(qs))
            os.environ["QUIZ"] = ",".join(qs)
            if "termo" not in qs and "t_termo.py" in lista:
                lista.remove("t_termo.py")  # t_termo.py só abre o quiz de Termologia
        ok &= rodar("testes de navegador", "python3 testes.py " + " ".join(lista), AQUI)
    print("\nTudo certo." if ok else "\nHouve falha: veja acima.")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
