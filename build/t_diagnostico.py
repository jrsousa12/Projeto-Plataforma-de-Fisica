# Testes do diagnóstico do protocolo-token (.claude/skills/protocolo-token/diagnostico.sh): projeto vazio, arquivo grande, dados longos e o projeto real.
import os, subprocess, tempfile
AQUI = os.path.dirname(os.path.abspath(__file__))
SH = os.path.join(AQUI, "..", ".claude", "skills", "protocolo-token", "diagnostico.sh")
ok = bad = 0
def ck(nome, cond):
    global ok, bad
    if cond: ok += 1
    else: bad += 1; print("FALHOU:", nome)
def roda(pasta): return subprocess.run(["bash", SH, pasta], capture_output=True, text=True, env={**os.environ, "CLAUDE_CODE_REMOTE": "true"}).stdout

with tempfile.TemporaryDirectory() as d:
    s = roda(d)
    ck("vazio: falta CLAUDE.md", "FALTA CLAUDE.md na raiz" in s)
    ck("vazio: falta skill", "FALTA arquivos da skill" in s)
    open(os.path.join(d, "grande.js"), "w").write("x=1;\n" * 301)
    open(os.path.join(d, "dados.js"), "w").write("D='" + "a" * 2500 + "';\n")
    s = roda(d)
    ck("arquivo > 300 linhas apontado", "grande.js" in s and "> 300 linhas (dividir" in s)
    ck("dados longos sem mostrar conteúdo", "linha > 2000" in s and "aaaa" not in s)
    ck("dados longos pedem motor de item único", "motor de item único" in s)
    open(os.path.join(d, "CLAUDE.md"), "w").write("## 1. x\n## 8. y\nIdioma\ngrande.js é exceção\n")
    s = roda(d)
    ck("exceção citada no CLAUDE.md não é cobrada", "já citados no CLAUDE.md" in s and "> 300 linhas (dividir" not in s)

s = roda(os.path.join(AQUI, ".."))
ck("projeto real: skill completa", "OK    skill completa" in s)
ck("projeto real: resumo curto", len(s.splitlines()) <= 30)
ck("diagnostico.sh até 200 linhas", sum(1 for _ in open(SH, encoding="utf-8")) <= 200)
print(f"t_diagnostico: {ok} ok, {bad} falha(s)")
raise SystemExit(1 if bad else 0)
