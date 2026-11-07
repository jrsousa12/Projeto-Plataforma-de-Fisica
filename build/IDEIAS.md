# Ideias para o futuro

## Exportar questões para o Kahoot (dica)
Hoje criar um Kahoot a partir do banco é um passo manual (o Claude monta pelo conector). Dá para automatizar com um script `build/exportar_kahoot.py`:
- entrada: área (`eletro`, `fluidos`, `termo`) e/ou lista de ids, nível e quantidade;
- saída: JSON no formato do conector do Kahoot (ou planilha do modelo de importação do Kahoot) com enunciado, 4 alternativas, resposta certa e tempo (20 s; 60 s nas de cálculo);
- regras: só questões de 2 a 4 alternativas, sem figura obrigatória (ou avisar quais dependem de figura), sem texto longo (limite de caracteres do Kahoot) e sem questões numéricas de digitar (`g`);
- extra: gerar junto o gabarito em PDF e registrar em `build/novas/kahoot.jsonl` o que já foi exportado, para não repetir questões entre turmas.

## Outras
- Moldes de animação para mais fórmulas (Bernoulli, calor latente, potencial elétrico).
- Fontes em português do Brasil na lista FONTE (Toda Matéria, InfoEscola, GREF) depois de conferir cada endereço.

## Dica: atividade em sala (simulado em PDF ou Kahoot)
Gerar a partir do banco um simulado em PDF com gabarito, ou exportar uma seleção de questões para um Kahoot (o conector Kahoot já funciona). Não implementado; fica como ideia.
