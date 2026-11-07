# Testes das equações: frações empilhadas (app/eq.js), cenas com fração e ausência de divisões que não empilham.
import subprocess, json, os, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
js = r'''
const Eq=require("../app/eq.js");let ok=0,bad=0;
function ck(nome,cond){if(cond)ok++;else{bad++;console.log("FALHOU:",nome)}}
const simp=h=>h.replace(/<span class="sl">\/<\/span>/g,"").replace(/<span class="fr"><span class="n">/g,"[").replace(/<\/span><span class="d">/g,"|").replace(/<\/span><\/span>/g,"]");
const T=[["i = Q / Δt = 120 / 40 = 3 A.","i = [Q|Δt] = [120|40] = 3 A."],
["Req = R₁·R₂ / (R₁ + R₂)","Req = [R₁·R₂|R₁ + R₂]"],
["F = G·M·m / d²","F = [G·M·m|d²]"],
["Δt = 3 kWh / 1,5 kW = 2 h","Δt = [3 kWh|1,5 kW] = 2 h"],
["Req = R₁ + R₂·R₃ / (R₂ + R₃)","Req = R₁ + [R₂·R₃|R₂ + R₃]"],
["L = (10 · 2) / (1 × 10⁻⁶)","L = [10 · 2|1 × 10⁻⁶]"],
["Dividiu 1 h por 15 min (4 · 1/15)","Dividiu 1 h por 15 min (4 · [1|15])"],
["A velocidade é 30 m/s e 5 km/h","A velocidade é 30 m/s e 5 km/h"],
["Use R = ρ · L / A","Use R = [ρ · L|A]"],
["a < b & c","a &lt; b &amp; c"]];
for(const [a,b] of T)ck(a,simp(Eq.html(a))===b);
ck("tem",Eq.tem("a / b")&&!Eq.tem("m/s"));
ck("naoEmpilha",Eq.naoEmpilha("Calculou massa total / volume total").length===1);
console.log(ok+" ok, "+bad+" falha(s)");process.exit(bad?1:0)
'''
r = subprocess.run(["node", "-e", js], cwd=AQUI, capture_output=True, text=True)
print(r.stdout.strip(), r.stderr.strip()[:300])
if r.returncode: sys.exit(1)
# nenhuma divisão com espaços fora do padrão nos bancos
a = subprocess.run(["node", os.path.join(AQUI, "eqaudit.js")], capture_output=True, text=True)
linhas = [l for l in a.stdout.splitlines() if "sem espaços" in l]
print("divisões sem espaços nos bancos:", len(linhas))
if linhas: print("\n".join(linhas[:10])); sys.exit(1)
print("OK")
