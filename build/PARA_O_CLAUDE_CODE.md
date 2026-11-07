# Tarefa para o Claude Code: publicar e testar automaticamente no GitHub

Contexto: projeto de quiz de Física (HTML/JS estático, sem servidor). Pastas: `app/` (o site, publicado no GitHub Pages) e `build/` (ferramentas: testes, validação, pipeline de questões). O dono é professor e não programa: entregue tudo funcionando e explique em português simples.

## Objetivo
A cada envio (push) para `main`: (1) montar e validar, (2) rodar todos os testes, (3) conferir as fontes das questões novas online, (4) publicar `app/` no GitHub Pages só se tudo passar.

## O que fazer
1. **Tornar os caminhos relativos.** Hoje vários arquivos usam `/home/claude/quiz` (ex.: `build/tudo.sh`, `build/run2.sh`, `build/testes.py`, `build/bundle.py`, `build/versao.py`, `build/captura_real.py`). Troque por caminhos relativos à pasta do próprio arquivo e confira com `grep -rn "/home/claude" .`.
2. **Criar `.github/workflows/publicar.yml`** (já existe `app/.github/workflows/validar.yml`; mova/una para a raiz do repositório se o projeto inteiro for subido):
   - gatilhos: `push` em `main` e `pull_request`;
   - `ubuntu-latest`, Node 20, Python 3.12; `pip install playwright pillow`; o Chrome já vem na imagem (os testes usam `/usr/bin/google-chrome`; se faltar, use `playwright install chrome` e ajuste o caminho com variável de ambiente);
   - passos: `bash build/tudo.sh` (monta o arquivo único, atualiza a versão do cache do `sw.js`, valida o banco, audita a aritmética e atualiza o README) → falhar se `git diff --exit-code` mostrar que o README ou o `sw.js` mudaram e não foram commitados, ou rode `python3 build/gerar_readme.py --verificar`;
   - testes: `cd build && python3 testes.py` (leva ~8 min; deve terminar com "Todos os testes passaram."). Se possível rode os `t_*.py` em paralelo (matrix) para reduzir o tempo; os testes sobem servidores nas portas 8123 e 8124, então use portas distintas por job ou execute em jobs separados;
   - fontes: se `build/novas/*.json` mudou, rode `python3 build/novas.py verificar --online` (no GitHub há internet, então a conferência lê a página de verdade; sem isso, só o cache). Falha do `--online` por site fora do ar deve ser aviso, não erro;
   - revisão visual: rode `python3 build/revisao.py --novas` (servidor em 8123) e envie `build/revisao/` como artefato (`actions/upload-artifact`);
   - publicação: só em `push` para `main` e se tudo acima passou, com `actions/upload-pages-artifact` (path: `app`) e `actions/deploy-pages`. Peça ao dono para ir em Settings → Pages → Source → **GitHub Actions**.
3. **Documentar** no `README.md` (seção curta "Publicação automática"): como ver o resultado na aba Actions, o que significa cada passo, e que o site só atualiza quando todos passam.
4. **Cuidado:** não mude o comportamento do app, não apague testes e não desligue verificações para "fazer passar". Se um teste falhar por causa do ambiente, explique e corrija o ambiente.

## Pronto quando
- um push de teste dispara o fluxo, ele fica verde e o site atualiza;
- um push que quebre algo (ex.: gabarito errado em questão de cálculo) fica vermelho e **não** publica.
