# Testes do motor de questões novas (novas.py + novas_*.py): divisão em módulos, unidades, contas e comandos.
import contextlib, glob, io, os, subprocess, sys
AQUI = os.path.dirname(os.path.abspath(__file__)); os.chdir(AQUI); sys.path.insert(0, AQUI)
import novas
ok = bad = 0
def ck(nome, cond):
    global ok, bad
    if cond: ok += 1
    else: bad += 1; print("FALHOU:", nome)

# cada módulo pequeno (limite do CLAUDE.md) e os nomes usados por outros scripts continuam em novas
for f in ["novas.py"] + glob.glob("novas_*.py"): ck(f"{f} até 300 linhas", sum(1 for _ in open(f, encoding="utf-8")) <= 300)
for n in ["guardar_cache", "verificar", "aplicar", "auditar", "animacoes", "modelo", "checar_calculo", "checar_fonte", "classificar_animacao", "entrada_molde"]:
    ck(f"novas.{n}", callable(getattr(novas, n, None)))

# unidades e calculadora segura
ck("5 km = 5000 m", novas.mesmo(novas.qty("5 km").v, 5000, 1e-9))
F = novas.avaliar("m * a", {"m": novas.qty("2 kg"), "a": novas.qty("3 m/s²")})
ck("2 kg · 3 m/s² = 6 N", novas.mesmo(F.v, 6, 1e-9) and F.d == novas.unidade("N").d)
v, u = novas.opcao_num("3,2 × 10⁻³ C"); ck("alternativa 3,2 × 10⁻³ C", novas.mesmo(v, 3.2e-3, 1e-9) and u == "C")

# checar_equacoes aceita "x" como lista ou dicionário (antes a lista quebrava o verificar)
for x in (["a = 10/2 = 5"], {"0": "a = 10/2 = 5"}):
    R = novas.Rel(); novas.checar_equacoes({"e": "", "h": "", "x": x}, "t", R); ck(f"x {type(x).__name__}", True)

# comandos: verificar (sem gravar relatório) e auditar --estrito
arqs = sorted(glob.glob("novas/*.json"))
with contextlib.redirect_stdout(io.StringIO()): R, _ = novas.verificar(arqs[:1], salvar=False)
ck("verificar roda", R is not None)
r = subprocess.run([sys.executable, "novas.py", "auditar", "--estrito"], capture_output=True, text=True)
ck("auditar --estrito sem erro", r.returncode == 0)
print(f"{ok} ok, {bad} falha(s)"); sys.exit(1 if bad else 0)
