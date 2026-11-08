"""Lê a lista única de quizzes (quizzes.js, na raiz do repositório) para as ferramentas em Python."""
import json, os, subprocess
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def quizzes():
    js = 'console.log(JSON.stringify(require(process.argv[1]).lista))'
    return json.loads(subprocess.check_output(["node", "-e", js, os.path.join(RAIZ, "quizzes.js")], text=True))
def ids(): return [q["id"] for q in quizzes()]
def por_letra(): return {q["letra"]: q["id"] for q in quizzes()}
def letra_por_id(): return {q["id"]: q["letra"] for q in quizzes()}
