#!/usr/bin/env python3
"""Corrige nos bancos (app/perguntas-*.js) as divisões escritas sem espaços (Q/t, v/(2L), T/μ), para o app mostrar fração empilhada.
Unidades (m/s, cal/(g·°C), km/h) não são alteradas. Pode rodar de novo sem problema."""
import re, os, glob
APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UN = set("m s h km kg g N C J W V A Pa L cm mm K mol min Hz cal rad atm kWh kW mA dB mmHg µC μC nC mC kΩ Ω °C".split())
RX = re.compile(r"(?<![\w])([A-Za-zΔεπρτωθλμΩ°µ][\wΔ₀-₉]*)/([A-Za-zΔεπρτωθλμΩ°µ(][\wΔ₀-₉]*)")
SUP = str.maketrans("", "", "²³¹⁰⁴⁵⁶⁷⁸⁹⁻")
def troca(m):
    a, b = m.group(1).translate(SUP), m.group(2).translate(SUP).lstrip("(")
    if len(a) <= 4 and len(b) <= 4 and not (a in UN and b in UN): return m.group(1) + " / " + m.group(2)
    return m.group(0)
tot = 0
for p in sorted(glob.glob(os.path.join(APP, "perguntas-*.js"))):
    s = open(p, encoding="utf-8").read(); n = RX.sub(troca, s)
    if n != s:
        k = sum(1 for _ in RX.finditer(s)) ; tot += 1; open(p, "w", encoding="utf-8").write(n); print("corrigido:", os.path.basename(p))
print(tot, "arquivo(s) alterado(s)")
