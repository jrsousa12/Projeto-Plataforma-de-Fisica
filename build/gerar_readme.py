#!/usr/bin/env python3
"""Gera a tabela "Arquivos" do README.md a partir dos arquivos que existem de verdade.
  python3 gerar_readme.py             reescreve a tabela (entre <!-- ARQUIVOS:INICIO --> e <!-- ARQUIVOS:FIM -->)
  python3 gerar_readme.py --verificar não grava; sai com erro se a tabela estiver desatualizada ou houver arquivo sem descrição
Para descrever um arquivo novo, acrescente uma linha em REGRAS (padrão de nome, texto)."""
import fnmatch, os, re, sys
APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."); README = os.path.join(APP, "README.md")
REGRAS = [  # (padrões, descrição); arquivos com a mesma descrição aparecem juntos
 (["index.html"], "Página principal do quiz"),
 (["quizzes.js"], "**Lista única dos quizzes**: nome, arquivos e onde cada um guarda o progresso (veja \"Acrescentar um quiz\")"),
 (["style.css"], "Visual (cores, fontes, menus)"),
 (["script.js"], "Lógica do quiz (rodada, resultado, perfil, navegação)"),
 (["app-graficos.js"], "Gráficos de desempenho do histórico"),
 (["app-historico.js"], "Tela de histórico e desempenho"),
 (["app-folha.js"], "Lista de exercícios e prova para imprimir"),
 (["app-relatorio.js"], "Relatório por área e conta na nuvem (tela de desempenho)"),
 (["app-cartoes.js"], "Cartões de revisão (conceitos e curiosidades)"),
 (["app-caderno.js"], "Caderno de erros (lista, exportar e importar)"),
 (["app-validacao.js"], "Validação do banco ao abrir (console; #teste mostra no topo)"),
 (["app-armazenamento.js"], "Gravação do progresso no aparelho (com migração do formato antigo)"),
 (["app-sorteio.js"], "Sorteio das questões da rodada (áreas, nível, reforço do caderno)"),
 (["app-revisao.js"], "Rever perguntas já respondidas (botão Anterior do modo estudo)"),
 (["app-sessao.js"], "Guardar e retomar o quiz de onde parou; tela de Fontes de referência"),
 (["app-telas.js"], "Navegação entre telas (endereços #nome, botão voltar, aviso de sair do quiz)"),
 (["app-relogio.js"], "Relógio do quiz (tempo da rodada, pausa e tempo por pergunta no cronometrado)"),
 (["app-meta.js"], "Meta diária de questões"),
 (["app-nav.js"], "Barra de navegação inferior e seleção de áreas"),
 (["app-escolha.js"], "Tela de escolha do quiz e início (?q=...)"),
 (["app-subscritos.js"], "Subscritos nas temperaturas (TC, TF, TK)"),
 (["app-sombra.js"], "Sombra da barra superior ao rolar"),
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
 (["figuras-animq-auto.js"], "Desenho das animações de resolução automáticas (moldes)"),
 (["figuras-animq-auto-dados.js"], "Dados das animações de resolução, gravados por build/novas.py (não editar à mão)"),
 (["figuras-animq-*.js"], "Animações feitas à mão para cada questão, por área"),
 (["figuras-fenomeno-*.js"], "Simulações do fenômeno (corpo em movimento + gráfico desenhado no tempo), que substituem as resoluções passo a passo"),
 (["fontes.js"], "Lista de fontes de referência (botão FONTE e tela Fontes)"),
 (["banco-extra.js", "banco-proprio.js", "editor.html", "editor.js", "editor.css"], "Editor de questões; `banco-proprio.js` leva as perguntas próprias aos alunos"),
 (["validar-banco.js"], "Confere os bancos de perguntas (ids repetidos, gabarito, alternativas, áreas) e a lista quizzes.js"),
 ([".github/workflows/*.yml"], "Fluxos automáticos do GitHub: a cada envio validam os bancos, rodam os testes de navegador e atualizam a versão do app"),
 (["firebase-config.js", "nuvem.js"], "Nuvem opcional (Firebase): login por código e sincronização do histórico do aluno"),
 (["perfil.js"], "Desempenho do aluno, treino adaptativo (tudo guardado no aparelho)"),
 (["fx.js"], "Som, vibração e confete"),
 (["eq.js"], "Mostra divisões \"a / b\" como fração empilhada (explicações, dicas, cartões e animações)"),
 (["manifest.webmanifest", "sw.js", "icon-*.png", "icon.svg"], "Instalação no celular e uso sem internet"),
]
def arquivos():
    r = []
    for raiz, ds, fs in os.walk(APP):
        ds[:] = [d for d in ds if d not in (".git", "__pycache__") and not (raiz == APP and d == "build")]  # build/ são ferramentas, não o app
        for f in fs:
            rel = os.path.relpath(os.path.join(raiz, f), APP).replace(os.sep, "/")
            if rel not in ("README.md", ".gitignore", "CLAUDE.md", "NOTAS.md") and not f.startswith("_") and not f.endswith(".pyc"): r.append(rel)
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
