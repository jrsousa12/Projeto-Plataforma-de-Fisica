# Instruções para o Claude neste repositório

Este projeto prioriza a economia de contexto e tokens. As regras abaixo são obrigatórias, mas a economia nunca dispensa a conferência de fontes, de cálculos nem os testes.

## Contexto do projeto

- **App:** quiz de Física do ensino médio (Eletrostática, Eletrodinâmica, Mecânica, Fluidos, Termologia, Som, Óptica). Todo o texto em português do Brasil, com linguagem simples.
- **Dono:** professor que não programa. Explique o que foi feito em português simples, sem jargão.
- **Textos para os alunos:** explique cada termo técnico na primeira vez que aparecer; prefira frases curtas; unidades no SI.
- **Stack:** PWA em HTML + CSS + JavaScript puro (sem framework nem bundler), na raiz do repositório; ferramentas em Python 3 e Node na pasta `build/`.
- **Lista única dos quizzes:** `quizzes.js` (usada pelo app, editor, `sw.js`, nuvem e `build/`). Quiz novo: siga "Acrescentar um quiz" no README.
- **Comandos:**
  - Validar bancos: `node validar-banco.js`
  - Montar tudo (arquivo único, versão do cache, validação, auditoria da aritmética, README): `bash build/tudo.sh`
  - Questões novas: `cd build && python3 novas.py verificar` (e `aplicar arq.json`); auditoria: `python3 novas.py auditar --estrito`
  - Testes de navegador: `cd build && python3 testes.py` (~15 min; um só: `python3 testes.py t_ui.py`). Precisa de `pip install playwright pillow`.
  - README: `python3 build/gerar_readme.py --verificar`
  - Lint: não há (só `node --check` em cada `.js`).
- **Arquivos gerados (não editar à mão):** a versão `CACHE` do `sw.js` (`build/versao.py`), a tabela entre `ARQUIVOS:INICIO/FIM` do README (`build/gerar_readme.py`), `figuras-animq-auto.js` (moldes do `build/novas.py`) e `build/saida/` (arquivo único, `build/bundle.py`).

## Onde ficam as regras

- Este arquivo é carregado em toda sessão: só regras globais, comandos e convenções, em bullets curtos.
- Regras de uma subpasta vão para um `CLAUDE.md` dentro dela (ex.: `build/CLAUDE.md`). Exceção: "Pesquisa padrão" e "Formato das perguntas" ficam aqui, porque os bancos estão na raiz.

## Pesquisa padrão para conteúdo conceitual (obrigatório)

Antes de criar, editar ou corrigir qualquer parte conceitual (perguntas, dicas, explicações, cartões, resumos, animações de resolução, cientistas, fontes):

1. Primeiro procure no próprio app (`grep` em `perguntas-*.js`, `quiz-*.js` e `fontes.js`). Se o fato já está lá e a tarefa não é alterá-lo, reaproveite-o sem pesquisar de novo.
2. Para conteúdo novo, alterado ou corrigido, consulte os sites de `build/fontes_confiaveis.json`, respeitando as notas de licença de cada um. Use WebSearch/WebFetch com `allowed_domains` restrito a esses domínios.
3. Questões novas passam pelo pipeline `build/novas.py` (fonte, cálculo conferido, viabilidade de animação); não grave direto no banco sem `verificar`.
4. Números, constantes e datas precisam de duas fontes que concordem; se divergirem, use a forma mais cautelosa e diga isso ao usuário.
5. Questões de cálculo: refaça a conta (o `novas.py auditar --estrito` confere a aritmética das explicações) e confira unidades e algarismos.
6. Nas perguntas, confira que **nenhuma alternativa errada pode ser considerada correta** e que a explicação não contradiz outra parte do app (`grep` nos `perguntas-*.js`, `quiz-*.js` e `figuras-*.js`).
7. Não copie texto das fontes: escreva com palavras próprias (o OpenStax, por exemplo, proíbe uso para treinar LLMs; o GREF só pode ser copiado sem alterar).
8. Se a informação vier de uma fonte que ainda não está no app, acrescente-a em `fontes.js`.
9. Na resposta ao usuário, diga quais fontes foram consultadas para cada mudança conceitual.

## Depois de qualquer mudança

- **Publicação:** commit e push no branch da sessão. Pull request ou envio ao `main` só com pedido explícito do usuário (o histórico usa pull requests).
- **Antes de publicar:** `node --check` nos `.js` alterados → `node validar-banco.js` → `bash build/tudo.sh` → testes de navegador (ao menos os `t_*.py` ligados ao que mudou; todos antes de ir ao `main`).
- **Robô do `main`:** depois de cada push no `main`, o GitHub faz um commit (versão do cache e README). Antes de enviar de novo: `git fetch origin main`, `git rebase origin/main`, testes outra vez. Nunca force o push no `main`.
- **Commits que vão junto:** antes de enviar, liste com `git log --oneline origin/main..HEAD` e informe ao usuário todos os commits enviados.
- **Tarefas em etapas:** um único commit no final, salvo pedido do usuário.
- **Arquivo novo:** arquivo geral → lista `BASE` do `sw.js`; arquivo de um quiz → campo de arquivos dele em `quizzes.js`. Confira também se o `build/bundle.py` o inclui e rode `python3 build/gerar_readme.py` (e descreva o arquivo no `gerar_readme.py`, se ele pedir).

## Formato das perguntas (`perguntas-*.js`)

Ver o README ("Incluir perguntas"). Campos: `id` único (letra do quiz em `quizzes.js`), `t` área, `q` enunciado, `o` alternativas, `a` posição da correta (começa em 0), `h` dica, `e` explicação, `f` figura (opcional), `v:1` mantém a ordem, `c:1` exige cálculo (fica fora do modo cronometrado).

## Edição e leitura

- Prefira edições pontuais a reescrever o arquivo inteiro.
- Leia só o necessário: localize com `grep -n` e leia o trecho (offset/limit). Não releia o que já foi lido na sessão.
- Em tarefas complexas, apresente o plano em passos e valide com o usuário antes de editar.

## Tamanho de arquivo e alertas de contexto

- Código novo: até 300 linhas por arquivo (ideal: menos de 200), cada arquivo com uma responsabilidade.
- Arquivos já acima do limite (hoje `script.js` ~2900, `style.css` ~740, `figuras-anim.js` ~540, `editor.js`, `figuras-animq-eletro.js`, `figuras-animq-fluidos2.js`, `nuvem.js`): avise uma vez por sessão e sugira a divisão, sem travar a tarefa. Só divida com aprovação do usuário; dividir exige atualizar `sw.js` ou `quizzes.js`, `build/bundle.py`, o README e os testes.
- Fora do limite: os bancos `perguntas-*.js` (dados) e os gerados (`figuras-animq-auto.js`, `build/saida/`).
- Avise em uma frase (o que cresceu e por que importa) e sugira a ação:
  - mesma tarefa, conversa longa → `/compact` com direcionamento (ex.: `/compact mantenha as decisões e os arquivos alterados`);
  - tarefa concluída ou assunto novo → `/clear` (só sugerir: o usuário executa);
  - arquivo grande demais → propor a divisão.
- Avise também ao perceber que está relendo trechos sem necessidade.

## Saída de terminal

- Use flags de silêncio (`-q`, `--silent`) ou filtre a saída (ex.: `| tail -20`, `| grep -E "FALHA|Erro|Traceback"`).
- Em arquivos com linhas enormes (`figuras-animq-auto.js`, `build/saida/*.html`, bancos), corte a saída das buscas (ex.: `grep ... | cut -c1-200`).
- Filtrar não é esconder: sempre relate falhas e erros ao usuário.

## Manutenção deste arquivo

- Mantenha este `CLAUDE.md` abaixo de 200 linhas; regras de domínio que crescerem vão para um `CLAUDE.md` de subpasta.
- Revise-o a cada mudança estrutural (nova stack, novo quiz, novo fluxo de build).
