# Ideias para o futuro

## Exportar questões para o Kahoot (dica) — PRÓXIMA
> **Antes de iniciar:** conversar com o dono sobre os termos (o que será feito, regras, condições e termos de uso do Kahoot). Só começar se ele aceitar; se não aceitar, a ideia fica parada.

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

## Importar questões de Word (docx) — retomar a partir de 20/11/2026 (apresentação do projeto)
> Conversa de 14/11/2026. Nada implementado; só o plano.
- **Medição do banco (14/11):** 717 questões, 563 (79%) com animação; ~571 caracteres ≈ 180 tokens por questão; animação ≈ 200 tokens (manual) ou ≈ 100 (motor).
- **Estimativa p/ 1000 questões:** criar do zero ~2–6 milhões de tokens (conforme animação); pelo motor ~1–2 milhões; **docx + conversor ~20–50 mil** (quase tudo para criar o conversor, uma vez só).
- **Ideia central:** um script Python (`python-docx`, já instalado) converte o Word direto para o formato do banco, sem as questões passarem pelo Claude, que só lê o relatório de erros. Planilha (xlsx/Google Planilhas) é alternativa ainda mais simples.
- **Modelo fixo no Word:** `1. enunciado` / `a) … d)` / `Gabarito:` / `Dica:` / `Explicação:`; assunto e nível pelo título da seção (ex.: `## Eletrodinâmica – nível 1`). Explicação de cada alternativa errada (`x`) escrita pelo professor sai de graça; se o Claude completar, ~50 tokens/questão.
- **Imagens (modelo misto):** o conversor salva toda imagem como arquivo (`img/<id>.png`, ~0 token); exige ajuste pequeno no quiz (`script.js` só usa SVG via campo `f`) e no `sw.js`. Só as marcadas `[redesenhar]` viram SVG no estilo da plataforma (~2–3 mil tokens cada; leve e com modo escuro).
- **Cuidados:** fórmulas do editor de equações do Word dão mais trabalho (texto simples é melhor); texto dentro de imagem (escaneada) não é lido pelo conversor.
- **Ampliação (14/11/2026, pedido do dono):** ler também **PDF** (extrair imagens com biblioteca a instalar, ex.: PyMuPDF); e **catálogo de peças reaproveitáveis**: cada `[redesenhar]` vira peças no kit (`figuras-anim-kit.js`) + registro em catálogo, para figuras parecidas futuras saírem com poucas centenas de tokens. Vetorização automática (decalque) descartada: pesada, feia e sem modo escuro.
- **Próximo passo (a partir de 20/11/2026, na ordem das tarefas do `CLAUDE.md`):** montar plano curto do conversor (arquivos, modelo do Word/PDF, catálogo de peças, teste) e validar com o dono antes de codar.
