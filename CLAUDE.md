# Instruções para o Claude neste repositório

Projeto que prioriza a economia de contexto e tokens. A economia nunca dispensa a conferência de fontes, de cálculos nem os testes.

## Contexto

- **App:** quiz de Física do ensino médio (7 quizzes, lista única em `quizzes.js`). Texto em português do Brasil, simples; explique cada termo técnico na primeira vez; frases curtas; unidades no SI.
- **Dono:** professor que não programa. Responda em português simples, sem jargão.
- **Stack:** PWA em HTML + CSS + JS puro na raiz; ferramentas e testes em `build/` (regras em `build/CLAUDE.md`).
- **Comandos:**
  - Procurar um fato no app: `node build/buscar.js palavra [outra] [--tudo]` (não use `grep` nos bancos: são linhas de até 66 mil caracteres).
  - Conferir o que mudou: `python3 build/rapido.py` (`--listar` só mostra; `--tudo` roda tudo).
  - Bateria completa: `cd build && python3 testes.py` (~4 min, 4 ao mesmo tempo).
- **Não editar à mão:** a versão `CACHE` do `sw.js`, a tabela `ARQUIVOS` do README, `figuras-animq-auto.js` e `build/saida/`.

## Pesquisa padrão para conteúdo conceitual (obrigatório)

Vale para perguntas, dicas, explicações, cartões, resumos, animações, cientistas e fontes.

1. Primeiro `node build/buscar.js`. Se o fato já está no app e a tarefa não é alterá-lo, reaproveite-o sem pesquisar.
2. Conteúdo novo, alterado ou corrigido: só os sites de `build/fontes_confiaveis.json` (WebSearch/WebFetch com `allowed_domains` restrito a eles), respeitando a licença de cada um. Escreva com palavras próprias.
3. Números, constantes e datas: duas fontes que concordem; se divergirem, use a forma mais cautelosa e avise.
4. Questões novas passam por `build/novas.py verificar`; questões de cálculo: refaça a conta e confira unidades.
5. Confira que **nenhuma alternativa errada pode ser considerada correta** e que a explicação não contradiz outra parte do app (`buscar.js`).
6. Fonte nova → acrescente em `fontes.js`. Na resposta, diga quais fontes foram usadas em cada mudança.

## Formato das perguntas (`perguntas-*.js`)

`id` único (letra do quiz em `quizzes.js`), `t` área, `q` enunciado, `o` alternativas, `a` posição da correta (começa em 0), `h` dica, `e` explicação, `f` figura, `an` animação, `v:1` mantém a ordem, `c:1` cálculo. Detalhes no README.

## Depois de qualquer mudança

- `python3 build/rapido.py` precisa terminar em "Tudo certo." Relate qualquer falha.
- **Publicação:** commit e push no branch da sessão. Pull request ou `main` só com pedido explícito. Antes do `main`: `bash build/tudo.sh` e `python3 build/rapido.py --tudo`.
- **Robô do `main`:** após cada push no `main`, o GitHub grava um commit (versão do cache e README). Antes de enviar de novo: `git fetch origin main && git rebase origin/main` e testes outra vez. Nunca force o push no `main`.
- Liste os commits enviados (`git log --oneline origin/main..HEAD`) para o usuário.
- Tarefa em etapas: um único commit no final, salvo pedido do usuário.
- **Arquivo novo:** geral → lista `BASE` do `sw.js`; de um quiz → `quizzes.js`. Depois: `python3 build/gerar_readme.py` e o `MAPA` do `build/rapido.py`.

## Economia de leitura

- Edições pontuais; leia só o trecho necessário (`grep -n` + offset/limit); não releia o que já leu.
- Tarefa complexa: plano em passos, validado com o usuário antes de editar.
- Saída de terminal: filtre (`| tail -20`, `| grep -E "FALHA|Erro|Traceback"`) e corte linhas longas (`| cut -c1-200`). Filtrar não é esconder: relate falhas.
- Código novo: até 300 linhas por arquivo. Já acima do limite: `script.js` (~2900), `style.css`, `figuras-anim.js`, `editor.js`, `figuras-animq-eletro.js`, `figuras-animq-fluidos2.js`, `nuvem.js`. Avise uma vez por sessão e só divida com aprovação.
- Conversa longa na mesma tarefa → sugira `/compact` com direcionamento; tarefa concluída → sugira `/clear`.
- Mantenha este arquivo curto (menos de 80 linhas); regras de uma pasta vão para o `CLAUDE.md` dela.
