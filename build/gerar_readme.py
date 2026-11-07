#!/usr/bin/env python3
"""Gera a tabela "Arquivos" do app/README.md a partir dos arquivos que existem de verdade.
  python3 gerar_readme.py             reescreve a tabela (entre <!-- ARQUIVOS:INICIO --> e <!-- ARQUIVOS:FIM -->)
  python3 gerar_readme.py --verificar não grava; sai com erro se a tabela estiver desatualizada ou houver arquivo sem descrição
Para descrever um arquivo novo, acrescente uma linha em REGRAS (padrão de nome, texto)."""
import fnmatch, os, re, sys
APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "app"); README = os.path.join(APP, "README.md")
REGRAS = [  # (padrões, descrição); arquivos com a mesma descrição aparecem juntos
 (["index.html"], "Página principal do quiz"),
 (["style.css"], "Visual (cores, fontes, menus)"),
 (["script.js"], "Lógica do quiz"),
 (["perguntas-eletro.js"], "**Banco de perguntas** de Eletrostática (edite aqui para incluir questões)"),
 (["perguntas-fluidos.js"], "**Banco de perguntas** de Mecânica dos Fluidos"),
 (["perguntas-termo.js"], "**Banco de perguntas** de Termologia"),
 (["perguntas-onda.js"], "**Banco de perguntas** de Ondulatória (Som)"),
 (["perguntas-optica.js"], "**Banco de perguntas** de Óptica Geométrica"),
 (["perguntas-mec.js"], "**Banco de perguntas** de Mecânica (cinemática e dinâmica)"),
 (["perguntas-edin.js"], "**Banco de perguntas** de Eletrodinâmica"),
 (["quiz-*.js"], "Configuração de cada quiz: nome, áreas, cartões, resumo, mensagens e questões numéricas"),
 (["figuras.js", "figuras-fluidos.js", "figuras-termo.js"], "Figuras (SVG) usadas nas perguntas e retratos ilustrados dos cientistas (desenhos próprios)"),
 (["figuras-anim.js"], "Kit de animação (cenas, legendas, linha do tempo)"),
 (["figuras-animq-auto.js"], "Animações de resolução geradas automaticamente pelos moldes (não editar à mão)"),
 (["figuras-animq-*.js"], "Animações feitas à mão para cada questão, por área"),
 (["fontes.js"], "Lista de fontes de referência (botão FONTE e tela Fontes)"),
 (["banco-extra.js", "banco-proprio.js", "editor.html", "editor.js", "editor.css"], "Editor de questões; `banco-proprio.js` leva as perguntas próprias aos alunos"),
 (["validar-banco.js", ".github/workflows/*.yml"], "Conferem os bancos de perguntas (ids repetidos, gabarito, alternativas, áreas); os fluxos do GitHub rodam sozinhos a cada envio"),
 (["firebase-config.js", "nuvem.js"], "Nuvem opcional (Firebase): login por código e sincronização do histórico do aluno"),
 (["perfil.js"], "Desempenho do aluno, treino adaptativo (tudo guardado no aparelho)"),
 (["fx.js"], "Som, vibração e confete"),
 (["manifest.webmanifest", "sw.js", "icon-*.png", "icon.svg"], "Instalação no celular e uso sem internet"),
]
def arquivos():
    r = []
    for raiz, ds, fs in os.walk(APP):
        ds[:] = [d for d in ds if d not in (".git", "__pycache__")]
        for f in fs:
            rel = os.path.relpath(os.path.join(raiz, f), APP).replace(os.sep, "/")
            if rel != "README.md" and not f.startswith("_") and not f.endswith(".pyc"): r.append(rel)
    return sorted(r)
def montar():
    grupos = {}; sem = []
    for f in arquivos():
        for i, (pads, _) in enumerate(REGRAS):
            if any(fnmatch.fnmatch(f, p) for p in pads): grupos.setdefault(i, []).append(f); break
        else: sem.append(f)
    linhas = ["| Arquivo | Para que serve |", "|---|---|"]
    for i in sorted(grupos): linhas.append("| " + ", ".join(f"`{f}`" for f in grupos[i]) + f" | {REGRAS[i][1]} |")
    return "\n".join(linhas), sem
def main():
    tab, sem = montar(); s = open(README, encoding="utf-8").read(); bloco = f"<!-- ARQUIVOS:INICIO -->\n{tab}\n<!-- ARQUIVOS:FIM -->"
    if "<!-- ARQUIVOS:INICIO -->" in s: novo = re.sub(r"<!-- ARQUIVOS:INICIO -->.*?<!-- ARQUIVOS:FIM -->", lambda m: bloco, s, flags=re.S)
    else: novo = re.sub(r"(## Arquivos\n\n)\|.*?\n(?=\n## )", lambda m: m.group(1) + bloco + "\n", s, count=1, flags=re.S)
    for f in sem: print("SEM DESCRIÇÃO (acrescente em REGRAS):", f)
    if "--verificar" in sys.argv:
        if novo != s: print("README desatualizado: rode python3 build/gerar_readme.py"); return 1
        return 1 if sem else 0
    open(README, "w", encoding="utf-8").write(novo); print(f"README atualizado ({len(tab.splitlines())-2} linhas na tabela)"); return 1 if sem else 0
sys.exit(main())
