# Diretrizes de Eficiência de Contexto e Tokens

Este projeto prioriza a economia de contexto e tokens. Toda interação deve seguir as regras abaixo para garantir que o plano de uso do Claude não seja esgotado desnecessariamente. Estas diretrizes são de cumprimento obrigatório.

## 0. Contexto do Projeto

- **Stack**: site estático HTML/CSS/JS puro (PWA com `sw.js`), sem framework nem npm; Firebase opcional (`nuvem.js`). Ferramentas e testes em Python 3.12 + Playwright (`build/`). Publicado no GitHub Pages.
- **Comandos úteis**:
  - Build: `bash build/tudo.sh` (arquivo único, versão do cache, validação, README)
  - Testes: `node validar-banco.js` (rápido); `cd build && python3 testes.py --mudou` (só o que mudou, durante a tarefa); `python3 testes.py` (todos, ~15 min, no fim)
  - Lint: `for f in *.js; do node --check "$f"; done` (só sintaxe; não há linter)
- **Convenções**:
  - Nomes e comentários em português; arquivos com prefixo por área (`perguntas-*`, `quiz-*`, `figuras-*`).
  - Novo quiz: registrar em `quizzes.js` e rodar `node validar-banco.js`.
  - Melhorias planejadas (lista numerada): `build/IDEIAS.md`; o que vem depois de cada uma: `NOTAS.md` (Pendências).
  - **Próximas tarefas (fazer nesta ordem; ao concluir, riscar aqui e anotar em `NOTAS.md`):**
    1. Fontes em PT-BR na lista FONTE (Toda Matéria, InfoEscola, GREF), conferindo cada endereço.
    2. Exportar questões para o Kahoot (`build/IDEIAS.md`); combinar os termos com o dono antes de começar.
    3. Simulado em PDF com gabarito, reaproveitando a seleção de questões do item 2.
    4. Conversor de Word (docx) e PDF + imagens, com catálogo de peças reaproveitáveis (`build/IDEIAS.md`); lembrar o dono a partir de 20/11/2026, ao mostrar o projeto; plano aprovado antes de codar.
    5. Peça de gráfico com eixos no kit (item 3 de `IDEIAS.md`), junto com as primeiras imagens marcadas `[redesenhar]` do item 4.
    - Só o dono: atualizar o endereço do `origin` (`Projeto-Plataforma-de-Fisica`) e rodar `/fewer-permission-prompts`.
  - Animações: antes de criar ou editar, ler `build/CLAUDE.md` (molde → reaproveitar → kit `figuras-anim-kit.js`; nunca recopiar peças).
  - `sw.js` (versão) e a tabela do README são gerados por `build/versao.py` e `build/gerar_readme.py`; não editar à mão.
  - Público: o dono é professor e não programa; explicar em português simples.
  - Protocolo de tokens reutilizável: `/protocolo-token` (`.claude/skills/protocolo-token/`); em outros projetos, buscar daqui.
  - **Idioma**: responder sempre em português do Brasil (PT-BR), inclusive resumos, avisos e mensagens de commit.

> Mantenha esta seção curta. Regras específicas de domínio vão nos `CLAUDE.md` dos subdiretórios.

---

## 1. Regra de Ouro: Modularização e Limite de Tamanho de Arquivo

- **Limite de Linhas**: Nenhum arquivo de código deve exceder **300 linhas**. O ideal é manter os arquivos abaixo de **200 linhas**.
- **Ação Corretiva**: Se, ao ler um arquivo, você detectar que ele excede esse limite, sua primeira tarefa deve ser **propor um plano de modularização**, dividindo-o em arquivos menores com responsabilidades únicas, antes de fazer qualquer outra edição.
- **Arquivos de Dados**: os bancos `perguntas-*.js` têm poucas linhas, mas muito longas (até ~130 KB). Para eles o limite de linhas não se aplica e o critério é o tamanho. Nunca leia nem faça `grep` num banco (a linha inteira vem junto): use `python3 build/questao.py ID` (mostrar), `--busca texto` e `ID campo=valor` / `campo:=json` (alterar). O mesmo vale para `figuras-animq-auto-dados.js` (gerado por `build/novas.py`).
- **Exceções Toleradas** (pouco acima de 300 linhas; dividir só se a tarefa exigir mexer muito neles): `editor.js`, `nuvem.js`, `figuras-animq-eletro.js`, `figuras-animq-fluidos2.js`.
- **`script.js` (~705 linhas)**: exceção tolerada por decisão do dono (13/11/2026). É o núcleo do quiz (início da rodada, `show`/`pick`, `finish`, níveis), muito ligado entre si; não dividir sem pedido do dono. Ao editar, leia só o trecho necessário.
- **Motor de questões (`build/novas.py`)**: só os comandos; o resto fica em `build/novas_*.py`, um assunto por arquivo (`unidades`, `checagens`, `fonte`, `animacao`, `moldes`, `conceito`, `distratores`, `teoria`, `fichas`, `comum`). Calibração por área: `build/fichas/<quiz>.json` (dados, não código). Novidade vai no módulo do assunto; teste em `build/t_novas.py`.
- **Visual (`style.css` + `estilo-*.css`)**: a ordem dos `<link>` decide qual regra vale; não reordenar. Arquivo `.css` novo: `index.html`, `editor.html` e `sw.js`.
- **Novas Funcionalidades**: Ao criar novas funcionalidades, já as estruture em módulos pequenos, seguindo o princípio da responsabilidade única.

## 2. Hierarquia de Contexto (CLAUDE.md)

- **Estrutura de Dois Níveis**:
  - **`CLAUDE.md` (Raiz)**: Contém apenas regras globais, comandos de build e convenções de projeto.
  - **`CLAUDE.md` (Subdiretórios)**: Crie arquivos `CLAUDE.md` em subpastas chave (ex: `src/api/`, `src/db/`) com as convenções específicas daquele domínio. O Claude deve carregar apenas o arquivo da raiz + o do subdiretório em que está trabalhando.
- **Concisão Máxima**: Mantenha cada arquivo `CLAUDE.md` o mais curto possível. Use bullets e seções com cabeçalhos Markdown. Evite parágrafos longos e prosa desnecessária.
- **Exceções Locais**: Se um subdiretório tiver arquivos naturalmente maiores (ex: schemas de banco), registre a exceção no `CLAUDE.md` daquele subdiretório, não na raiz.

## 3. Estratégia de Edição e Leitura de Código

- **Prefira Edições Cirúrgicas**: Sempre que possível, edite o arquivo existente usando as ferramentas de edição de linha, em vez de reescrevê-lo por completo. Isso evita a geração de tokens desnecessários.
- **Leitura Sob Demanda**: Não leia arquivos inteiros de forma indiscriminada. Leia apenas os arquivos (ou trechos) diretamente relevantes para a tarefa atual, usando busca (`grep`) e leitura por intervalo de linhas. O usuário pode indicar arquivos com `@nome_do_arquivo`. Evite varrer o projeto em busca de contexto que não será usado.
- **Plano Antes do Código**: Para tarefas complexas, descreva o plano em passos lógicos (ou um diagrama simples) e valide com o usuário antes de tocar nos arquivos. Isso reduz drasticamente o consumo de tokens em retrabalho.
- **Motores para tarefas repetitivas**: se uma tarefa se repete (gerar, converter, conferir ou corrigir em lote), criar um script (motor) que a faça, em vez de refazê-la à mão a cada vez; depois, só rodar o motor e ler o resumo da saída. Ex.: `build/novas.py` (lista na seção 8).

## 4. Higiene de Comandos e Saída de Terminal

- **Silencie Comandos Barulhentos**: Ao executar comandos de teste, build ou qualquer outro que gere muita saída, utilize flags de silêncio (ex: `--silent`, `-q`) ou redirecione a saída para filtrar apenas o essencial (ex: `| grep -E "(FAIL|PASS|Error)"`).
- **Limite de Output**: A saída de ferramentas e comandos deve ser a mais concisa possível para não inundar o contexto.

## 5. Protocolo de Sessão (Lembretes)

- **Troca de Tarefa**: Se o usuário solicitar uma tarefa completamente não relacionada à anterior, lembre-o de usar o comando `/clear` para zerar o contexto e economizar cota (só o usuário pode executar `/clear` e `/compact`).
- **Tarefa Longa (Mesmo Assunto)**: Se a conversa sobre uma mesma tarefa estiver muito longa, sugira o uso de `/compact` com um direcionamento (ex: `/compact mantenha as decisões de arquitetura e os arquivos alterados`).

## 6. Protocolo de Monitoramento de Contexto (Vigia)

Você é responsável por monitorar ativamente o crescimento do contexto durante a sessão. Aja como um parceiro atento: avise no momento certo, sem interromper o fluxo à toa.

### Quando alertar
- Ao perceber que um arquivo em edição se aproxima ou ultrapassa **300 linhas**.
- Quando a conversa sobre uma mesma tarefa ficar longa e o histórico começar a acumular muita informação repetida ou já resolvida.
- Quando notar que está relendo arquivos ou trechos que já leu nesta sessão sem necessidade.
- Quando a mesma tarefa for feita à mão pela 2ª ou 3ª vez (propor um motor, seção 8).

### Como alertar
- Seja breve e direto. Nada de parágrafos longos.
- Explique o motivo em uma frase: o que está crescendo e por quê isso importa.
- Sugira a ação mais adequada para o caso:
  - **Mesma tarefa, conversa longa** → `/compact` com direcionamento.
  - **Tarefa concluída ou mudança de assunto** → `/clear`.
  - **Arquivo grande demais** → pausar a edição e propor modularização antes de continuar.

### Exemplo de alerta
> "O arquivo `auth.ts` está com 340 linhas. Antes de continuar editando, sugiro pausarmos e modularizá-lo em `auth/login.ts`, `auth/session.ts` e `auth/validation.ts`. Posso propor a divisão?"

### Regra de ouro
Nunca prossiga editando um arquivo acima do limite sem antes **perguntar** se o usuário quer modularizar ou continuar mesmo assim. A decisão final é sempre do usuário.

---

## 7. Manutenção deste Arquivo

- Este `CLAUDE.md` deve permanecer **abaixo de 200 linhas**. Se crescer além disso, mova seções específicas para os `CLAUDE.md` dos subdiretórios.
- Revise este arquivo a cada mudança estrutural relevante no projeto (nova stack, novo módulo, novo fluxo de build).

## 8. Motores e Automações

Motor = script que faz o trabalho pesado e devolve só um resumo curto. Criar quando a tarefa se repete; propor ao dono antes (plano aprovado) e manter cada motor pequeno (seção 1). Usar o que já existe antes de ler arquivos:

- **Build único**: `build/tudo.sh` (monta, versiona, valida, gera catálogo e README).
- **Validador/auditor**: `node validar-banco.js`; `python3 build/novas.py auditar --estrito`.
- **Gerador de questões**: `build/novas.py` (fonte, cálculo, unidades, distratores, teoria, animação); fichas por área em `build/fichas/`.
- **Moldes e kit**: `figuras-anim-kit.js` + moldes (`build/CLAUDE.md`); nunca recopiar peças.
- **Catálogo**: `build/CENAS.md` (gerado por `build/catalogo_cenas.js`): achar cena sem abrir `figuras-animq-*.js`.
- **Questão única**: `build/questao.py` (mostrar, buscar e alterar uma questão sem abrir o banco).
- **Extrator**: `node build/dump_banco.js` (bancos em JSON); `build/lista_quizzes.py`.
- **Correção em lote**: `build/eqaudit.js`, `build/eqcheck.js`, `build/corrigir_eq.py` (frações).
- **Gerados**: `build/versao.py` (`sw.js`) e `build/gerar_readme.py` (README); não editar à mão.
- **Testes guardados**: todo teste criado numa tarefa fica salvo em `build/t_<assunto>.py` (estrutura em `build/navegador.py`); antes de criar, procurar um `t_*.py` do assunto e ampliá-lo. Nunca teste descartável nem repetido.
- **Testes seletivos**: `python3 build/testes.py --mudou` roda só os testes ligados ao que mudou (mapa `REGRAS` em `build/testes_mudou.py`); teste novo entra no mapa na hora. Todos (`testes.py`) só no fim.
- **Ajudantes de teste**: `build/navegador.py` (Chromium), `build/mockfb.py` (Firebase simulado).
- **Revisão em lote**: `build/revisao.py`, `build/captura_real.py ID...`.
- **Memória**: `build/IDEIAS.md` e `NOTAS.md` (Pendências).
- **Travas e barra**: `.claude/settings.json` + `.claude/hooks/` (bloqueia ler bancos; barra mostra % do contexto).

## 9. Recursos de Apoio (usar antes de criar ou pesquisar)

- **Modelos e exemplos**: `python3 build/novas.py modelo <área> <n>`; `build/exemplos/`.
- **Cache de fontes**: `build/novas/fontes_cache` (o `novas.py` usa sem internet).
- **Fontes confiáveis**: `build/fontes_confiaveis.json`.
- **Já aplicado**: `build/novas/aplicadas.jsonl`; não refazer.
- **Guias**: `build/NOVAS.md` (questões), `build/CLAUDE.md` (animações), `build/PARA_O_CLAUDE_CODE.md` (publicação automática, planejada).
- **Fonte única**: `quizzes.js` (lista de quizzes; Python lê via `build/lista_quizzes.py`).
- **Relatórios**: `build/novas/relatorio.md`; ler só o resumo.


## 10. Dicas para o Dono (lembrar quando couber, em uma frase)

- Uma tarefa por conversa; `/clear` ao trocar de assunto.
- Indicar o arquivo com `@nome` quando souber qual é.
- Pedidos diretos ("faça X em Y"); responder "sim"/"não" às perguntas basta.
- Decisões tomadas ficam anotadas (`NOTAS.md`), para não serem perguntadas de novo.

