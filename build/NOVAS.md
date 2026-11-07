# Como criar questões novas (fonte → cálculo → animação)

1. `python3 novas.py modelo termo 3` cria `novas/termo_AAAA-MM-DD.json` com o esqueleto (uma questão comum + uma de cálculo).
2. Escreva as questões **com suas palavras**, baseadas numa página de `fontes_confiaveis.json`. Cada questão precisa de:
   - `fonte`: `url` (https, de um site da lista), `titulo`, `conferido_em`, `base` (o que foi usado) e `verificar` (palavras-chave que existem na página).
   - Cálculo (`"c": 1`): bloco `calc` com `vars` (valores com unidade), `expr`, `expr2` (outro caminho de conta) e `unidade` da resposta.
   - Animação: `"an": "chave"` (cena existente ou nova) **ou** `"animacao": {"decisao": "nao_aplica", "motivo": "..."}`.
3. `python3 novas.py verificar [--online]` confere tudo e escreve `novas/relatorio.md`. Sai com erro se:
   - a fonte não é de site confiável, falta campo, ou o texto copia a fonte;
   - a questão repete outra já existente (≥ 88% de semelhança);
   - o gabarito não bate com a conta, a **análise dimensional** falha, `expr2` discorda, ou algum distrator vale o mesmo que a resposta;
   - falta animação em questão de cálculo ou em conceito com processo visualizável (o relatório sugere cena existente ou construtor);
   - o validador do app (`validar-banco.js`) acusa problema.
4. `python3 novas.py aplicar arquivo.json` repete a verificação e só então grava em `app/perguntas-<quiz>.js` (ids novos em sequência; fonte e conta ficam em `novas/aplicadas.jsonl`).
5. `bash tudo.sh` (inclui `novas.py auditar --estrito`, que confere a aritmética das explicações de todos os bancos) e `python3 testes.py`.

Outros comandos: `python3 novas.py auditar` e `python3 novas.py animacoes` (cobertura por quiz).
`--online` só funciona onde o computador alcança a internet; sem rede, vira aviso (conferir a fonte manualmente).

## Conferência da fonte sem internet (cache)
Quando o computador não alcança a página, `verificar` usa o texto guardado em `novas/fontes_cache/`. Para alimentar o cache use o comando `cache` do `novas.py` : `python3 novas.py cache URL arquivo.txt` (arquivo com o texto da página). Se a fonte não está no cache nem online, aparece só um aviso.

## Botão FONTE no app
O quadro FONTE (4 principais) e a tela Fontes leem a lista curada em `app/fontes.js`. Ao criar questões de um assunto novo, acrescente a página usada em `itens` e o id em `p` (principais) ou `t` (todas) da área.

## Automações extras
- **Fonte na lista FONTE:** `novas.py aplicar` inclui a página usada (`fonte.url`) na lista `app/fontes.js` da área, se ainda não estiver lá.
- **Animação automática (molde):** em questão de cálculo use `"animacao": {"decisao": "molde", "molde": "dilatacao"}` (moldes: `generico`, `dilatacao`, `calor`, `pressao`, `coulomb`, `bernoulli`, `latente`, `potencial`). No bloco `calc` você pode acrescentar `simbolo` (ex.: `"ΔL"`), `formula` (texto da fórmula) e `rotulos` (ex.: `{"L0": "L₀", "alfa": "α"}`). O `aplicar` grava a cena em `app/figuras-animq-auto.js` com os dados e a conta, e preenche `an` sozinho. Veja `exemplos/molde_dilatacao.json`.
- **Revisão visual:** `python3 revisao.py --novas` (ou ids, `--area termo`, `--todas`) gera folhas com o começo e o fim de cada animação e acusa texto fora da figura ou sobreposto. Precisa de `cd app && python3 -m http.server 8123` rodando.
- **README:** `python3 gerar_readme.py` refaz a tabela de arquivos (o `tudo.sh` já roda). Arquivo novo sem descrição é avisado: acrescente uma linha em `REGRAS`.
