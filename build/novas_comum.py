"""Peças comuns do novas.py: caminhos, imports, relatório (Rel) e normalização de texto."""
import ast, datetime, difflib, json, math, operator, os, re, shutil, subprocess, sys, tempfile, unicodedata, urllib.parse, urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(AQUI, "..")  # o app fica na raiz do repositório
NOVAS = os.path.join(AQUI, "novas")
from lista_quizzes import letra_por_id
PREFIXO = letra_por_id()  # lista única em quizzes.js
MOLDES = ("generico", "dilatacao", "calor", "pressao", "coulomb", "bernoulli", "latente", "potencial")

# ----------------------------------------------------------------- utilidades
class Rel:
    def __init__(self): self.erros, self.avisos, self.infos = [], [], []
    def E(self, loc, m): self.erros.append(f"{loc}: {m}")
    def W(self, loc, m): self.avisos.append(f"{loc}: {m}")
    def I(self, loc, m): self.infos.append(f"{loc}: {m}")

def dump():
    out = subprocess.run(["node", os.path.join(AQUI, "dump_banco.js"), APP], capture_output=True, text=True, check=True).stdout
    return json.loads(out)

def norm(t):
    t = unicodedata.normalize("NFD", str(t).lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", t).strip()
