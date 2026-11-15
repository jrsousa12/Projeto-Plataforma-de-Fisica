# Receita: motor de revisão de textos (só aponta, nunca altera)

Para projetos com textos para pessoas lerem: questões, aulas, apostilas, páginas.
Problema: revisar à mão gasta tokens a cada rodada e deixa passar erros repetidos.
Exemplo pronto: `build/revtexto.py` + `build/t_revtexto.py` do projeto de física (Projeto-Plataforma-de-Fisica).

## Organização (um assunto por arquivo, cada um com menos de 200 linhas)
- `revtexto.py`: só os comandos e o relatório.
- `revtexto_portugues.py`: palavra repetida, espaço duplo ou antes da pontuação, falta de espaço depois dela, minúscula depois do ponto, falta de acento (lista), termo fora do padrão.
- `revtexto_<area>.py`: conferências da área (na física: unidade fora do padrão, número colado na unidade, ponto decimal, resultado sem unidade).
- `revtexto_clareza.py`: frase longa; e, em questões: enunciado sem pergunta ou comando, alternativa correta bem mais longa que as outras, alternativas de tamanhos muito diferentes.
- `revtexto_termos.json`: listas e limites (dados que o dono edita), incluindo `ignorar` (id → trechos de avisos já conferidos).
- Cada conferência é uma função `(texto, cfg) -> [(tipo, trecho, sugestão)]`; conferência nova = função nova na lista `TODAS` do módulo.

## Comandos (saída: resumo curto; detalhe num `relatorio.md` fora do Git)
- `revtexto.py ID...`, `--area X`, `--todas`: itens do banco (lidos pelo extrator, nunca abrindo o banco).
- `--arquivo a.md`: texto solto (.txt/.md/.html); tira marcas e revisa por parágrafo, com o número da linha.
- `--texto "frase"`: teste rápido.

## Cuidados (aprendidos na calibração)
- **Calibrar no banco real antes de entregar**: rodar `--todas`, ver amostras de cada tipo de aviso e cortar os alarmes falsos até sobrar só o que é real.
- Alarmes falsos comuns: questões Verdadeiro/Falso (afirmação sem "?"; "Verdadeiro" maior que "Falso"); símbolos ("campo E e", "Pa. p = F/A", "2h" = 2 vezes h); ordinais ("2º grau"); milhar com espaço ("1 000 000"); valor zero sem unidade; alternativas numéricas curtas.
- Sem corretor ortográfico completo por padrão (pede instalação e marca termos técnicos); só listas curtas e editáveis.
- Palavras ambíguas (esta/está, e/é) ficam fora da lista de acentos.

## Teste guardado
- Uma lista de textos com erro (cada um acha o seu tipo) e uma lista de textos certos tirados do banco (nenhum aviso).
- Rodar em todo o banco real sem quebrar; conferir `ignorar` e `--arquivo`. Registrar no mapa de testes seletivos.
