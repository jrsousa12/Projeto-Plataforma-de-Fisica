# Notas do Projeto

Plano, decisões e pendências que precisam sobreviver ao `/clear`. Atualizar a cada etapa concluída.

## Modularização do `script.js`

Ordem: do menor risco ao maior. Antes de cada commit: `node --check`, `bash build/tudo.sh`, `python3 build/gerar_readme.py --verificar` e `cd build && python3 testes.py` (termina em "Todos os testes passaram.").

Todo arquivo novo do app entra em: `index.html` (`<script>`, na ordem certa), `sw.js` (lista `BASE`), `build/bundle.py` (lista de arquivos) e `build/gerar_readme.py` (`REGRAS`, descrição do README).

1. **Dados das animações automáticas** — feito (`4d36e8c`): `figuras-animq-auto-dados.js` separado de `figuras-animq-auto.js`.
2. **Blocos independentes do `script.js`** — feito (`9a9a20d`): `app-meta.js`, `app-nav.js`, `app-escolha.js`, `app-subscritos.js`, `app-sombra.js`.
3. **Histórico e gráficos** — feito: `app-graficos.js` (250) e `app-historico.js` (166); `script.js` 2425 → 2046. `histAdd` ficou no `script.js` (lê a pontuação, que muda). Teste novo: `build/t_hist.py`.
4. **Relatório e folha** → arquivo próprio — próximo. Mapear antes, incluindo o parâmetro `id` do `__boot`.
5. Opcional: `style.css` e `build/novas.py`.

## Decisões que valem daqui em diante

- Todo teste novo vai para `build/t_*.py` (o `testes.py` roda todos), para poder repetir depois.
- No mapeamento de dependências, incluir o parâmetro `id` do `__boot` (passou despercebido no passo 3; o teste pegou).
- Arquivos novos do app usam prefixo `app-` (o prefixo `quiz-` é lido pelo `validar-banco.js` como banco).
- A divisão não muda a lógica: só move código; variáveis compartilhadas passam por um objeto comum.
- `sw.js`: páginas usam internet primeiro (3 s); demais arquivos usam a cópia e atualizam em segundo plano. Funciona porque o nome do cache muda a cada versão (`build/versao.py`). Não trocar sem motivo.
- Nunca orientar alunos a "limpar dados do site" (apaga o progresso). Para atualizar: fechar e abrir com internet.
- O robô do GitHub (`versao.yml`) commita no `main` após cada push: antes de publicar no `main`, atualizar a cópia local; nunca forçar o push.
- CSS (quando dividir): manter a ordem dos `<link>` no `index.html` (cascata) e comparar telas antes/depois.

## Pendências

- Remoto mudou para `jrsousa12/Projeto-Plataforma-de-Fisica`; atualizar o endereço do `origin` quando o dono quiser.
- Rodar `/fewer-permission-prompts` (só o dono pode).
