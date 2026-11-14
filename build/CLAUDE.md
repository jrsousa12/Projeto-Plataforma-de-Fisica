# Regras da pasta build/ (ferramentas e testes)

## Conferência rápida (use sempre durante o trabalho)

- `python3 build/rapido.py` olha o que mudou desde o `origin/main` e roda só o necessário. Use `--listar` para ver o plano sem rodar e `--tudo` para a bateria completa.
- No container da nuvem: `pip install -q playwright pillow` e `export CHROME_PATH=/opt/pw-browsers/chromium` antes dos testes.
- A bateria completa (`--tudo` ou `python3 testes.py`) fica só para antes de ir ao `main`.

## Comandos das ferramentas

- Montar tudo (arquivo único, versão do cache, validação, auditoria, README): `bash build/tudo.sh`.
- Questões novas: `python3 novas.py modelo <quiz>` → `verificar` → `aplicar arq.json`; auditoria das contas: `python3 novas.py auditar --estrito`.
- README: `python3 gerar_readme.py` (arquivo sem descrição → acrescente em `REGRAS`).
- Lint: não há (o `rapido.py` roda `node --check` nos `.js` mudados).

## Testes em paralelo

- `python3 testes.py` roda 4 ao mesmo tempo (`-j 1` = um por vez), cada vaga com portas próprias (8123+2v e 8124+2v, via `PORTA` e `PORTA_FB` no `run2.sh`).
- O `t_anim.py` vira um trabalho por quiz; `QUIZ=termo,mec` limita os quizzes.
- O `t_nuvem.py` roda sozinho no fim, nas portas 8123/8124: a CSP do `index.html` só libera a nuvem simulada em `127.0.0.1:8124`.
- Teste novo: leia a porta com `P=os.environ.get('PORTA','8123')` (veja a 1ª linha dos `t_*.py`), nunca fixa.

## Mapa "o que mudou → o que testar" (a regra vive no `MAPA` do `rapido.py`)

| Mudou | Testes de navegador |
|---|---|
| `*.md`, `.github/`, textos | nenhum (só a tabela do README) |
| `perguntas-*.js`, `quiz-*.js`, `build/novas/` | `t_anim` (só o quiz mudado), `t_flow`, `t_sheet`, `t_termo` (se for Termologia) + auditoria das contas |
| `figuras-anim*.js`, `figuras-fenomeno-*.js` | `t_anim` (só o quiz dono do arquivo; arquivo comum = todos), `t_eq` |
| `figuras.js`, `figuras-fluidos.js`, `figuras-termo.js` | `t_figs2`, `t_flow`, `t_termo` |
| `eq.js` | `t_eq`, `t_anim` |
| editor, `banco-*.js` | `t_cod`, `t_novo` |
| `nuvem.js`, `firebase-config.js`, `perfil.js` | `t_nuvem`, `t_novo` |
| `fontes.js` | `t_fonte` |
| `quizzes.js`, `sw.js`, `index.html`, ícones | `t_lazy`, `t_multi`, `t_novo2`, `t_ui` |
| um `t_*.py` | ele mesmo |
| `script.js`, `style.css`, `fx.js` ou arquivo fora do mapa | todos |

- Sempre rodam: `node --check` nos `.js` mudados, `node validar-banco.js` e a tabela do README.
- Arquivo novo de teste ou do app: acrescente-o ao `MAPA`; se não acrescentar, o script roda tudo (seguro, mas lento).

## Tempos medidos (14/11/2026)

- Bateria completa: ~14 min um por vez; ~4 min com 4 ao mesmo tempo.
- `t_anim` por quiz: eletro ~150 s, fluidos e termo ~105 s, os demais ~40 s; `t_flow` ~120 s, `t_fonte` ~70 s; os outros, menos de 35 s.
- Não rode dois `testes.py` ao mesmo tempo (as portas se repetem).
