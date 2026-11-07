#!/usr/bin/env python3
"""Migra os textos "subst" já gravados em app/figuras-animq-auto.js para o estilo novo (frações a / b, sem parênteses sobrando).
Pode rodar de novo sem problema. Os cálculos novos já saem assim em novas.py (expr_texto)."""
import re, os, sys
APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app")
p = os.path.join(APP, "figuras-animq-auto.js"); s = open(p, encoding="utf-8").read()
NUM = r"−?[\d,]+(?:·10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)?"
def novo(t):
    t = t.replace("sqrt(", "√(")
    for _ in range(4):
        t2 = re.sub(r"(?<!\^)\((" + NUM + r")\)(?!\^)", r"\1", t)
        if t2 == t: break
        t = t2
    t = re.sub(r"(?<=[\d)])\s*-\s*(?=[\d(√])", " − ", t)
    t = re.sub(r"(?<=[\d)⁰¹²³⁴⁵⁶⁷⁸⁹])\s*\+\s*(?=[\d(√])", " + ", t)
    t = re.sub(r"(?<=[\d)A-Za-zΔ⁰¹²³⁴⁵⁶⁷⁸⁹])\s*/\s*(?=[\d(√A-Za-zΔ])", " / ", t)
    t = re.sub(r"\^(\d)", lambda m: "⁰¹²³⁴⁵⁶⁷⁸⁹"[int(m.group(1))], t)
    return t
n = [0]
def troca(m):
    a = m.group(2); b = novo(a)
    if a != b: n[0] += 1
    return m.group(1) + b + m.group(3)
s2 = re.sub(r'("subst": ")([^"]*)(")', troca, s)
open(p, "w", encoding="utf-8").write(s2)
print(n[0], "substituições atualizadas")
