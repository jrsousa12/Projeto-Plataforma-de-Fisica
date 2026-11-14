# Ideias para o futuro

## Exportar questões para o Kahoot (dica)
Hoje criar um Kahoot a partir do banco é um passo manual (o Claude monta pelo conector). Dá para automatizar com um script `build/exportar_kahoot.py`:
- entrada: área (`eletro`, `fluidos`, `termo`) e/ou lista de ids, nível e quantidade;
- saída: JSON no formato do conector do Kahoot (ou planilha do modelo de importação do Kahoot) com enunciado, 4 alternativas, resposta certa e tempo (20 s; 60 s nas de cálculo);
- regras: só questões de 2 a 4 alternativas, sem figura obrigatória (ou avisar quais dependem de figura), sem texto longo (limite de caracteres do Kahoot) e sem questões numéricas de digitar (`g`);
- extra: gerar junto o gabarito em PDF e registrar em `build/novas/kahoot.jsonl` o que já foi exportado, para não repetir questões entre turmas.

## Outras
- Fontes em português do Brasil na lista FONTE (Toda Matéria, InfoEscola, GREF) depois de conferir cada endereço.

## Dica: atividade em sala (simulado em PDF ou Kahoot)
Gerar a partir do banco um simulado em PDF com gabarito, ou exportar uma seleção de questões para um Kahoot (o conector Kahoot já funciona). Não implementado; fica como ideia.

## Melhorias de economia (mesma receita do kit/moldes de animação; ordem indicada: 2, 1, 3)
> Item 2 feito em 14/11/2026: `testes.py --mudou` (regras em `build/testes_mudou.py`) e ajudante `build/navegador.py`.
1. ~~**Distratores automáticos (cálculo):**~~ (feito em 14/11/2026: `novas.py distratores`) o motor gera as 3 alternativas erradas a partir de erros típicos (unidade não convertida, potência de 10, divisão invertida, T final no lugar de ΔT), já com a frase do `x` e a conta conferida. Módulo novo `novas_distratores.py` + teste em `t_novas.py`.
2. ~~**Testes só do que mudou:**~~ (feito) `testes.py --mudou` lê `git diff` e roda só os `t_*.py` ligados aos arquivos alterados (~1–3 min em vez de ~15); o completo fica para o fim da tarefa. Ajudante comum de navegador para os testes (28 arquivos repetem a abertura do Chromium).
3. **Figuras estáticas:** peça de gráfico com eixos (`gx`/`gy`/`path` copiados 5× em `figuras-fenomeno-*.js`) no kit; fazer quando houver figuras novas.
