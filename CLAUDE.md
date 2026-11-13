# Diretrizes de Eficiência de Contexto e Tokens

Este projeto prioriza a economia de contexto e tokens. Toda interação deve seguir as regras abaixo para garantir que o plano de uso do Claude não seja esgotado desnecessariamente. Estas diretrizes são de cumprimento obrigatório.

## 0. Contexto do Projeto

- **Stack**: site estático HTML/CSS/JS puro (PWA com `sw.js`), sem framework nem npm; Firebase opcional (`nuvem.js`). Ferramentas e testes em Python 3.12 + Playwright (`build/`). Publicado no GitHub Pages.
- **Comandos úteis**:
  - Build: `bash build/tudo.sh` (arquivo único, versão do cache, validação, README)
  - Testes: `node validar-banco.js` (rápido); `cd build && python3 testes.py` (navegador, ~15 min)
  - Lint: `for f in *.js; do node --check "$f"; done` (só sintaxe; não há linter)
- **Convenções**:
  - Nomes e comentários em português; arquivos com prefixo por área (`perguntas-*`, `quiz-*`, `figuras-*`).
  - Novo quiz: registrar em `quizzes.js` e rodar `node validar-banco.js`.
  - `sw.js` (versão) e a tabela do README são gerados por `build/versao.py` e `build/gerar_readme.py`; não editar à mão.
  - Público: o dono é professor e não programa; explicar em português simples.
  - **Idioma**: responder sempre em português do Brasil (PT-BR), inclusive resumos, avisos e mensagens de commit.

> Mantenha esta seção curta. Regras específicas de domínio vão nos `CLAUDE.md` dos subdiretórios.

---

## 1. Regra de Ouro: Modularização e Limite de Tamanho de Arquivo

- **Limite de Linhas**: Nenhum arquivo de código deve exceder **300 linhas**. O ideal é manter os arquivos abaixo de **200 linhas**.
- **Ação Corretiva**: Se, ao ler um arquivo, você detectar que ele excede esse limite, sua primeira tarefa deve ser **propor um plano de modularização**, dividindo-o em arquivos menores com responsabilidades únicas, antes de fazer qualquer outra edição.
- **Arquivos de Dados**: os bancos `perguntas-*.js` têm poucas linhas, mas muito longas (até ~130 KB). Para eles o limite de linhas não se aplica e o critério é o tamanho. Nunca leia um banco inteiro: localize a questão com `grep` pelo id e leia só o trecho. O mesmo vale para `figuras-animq-auto-dados.js` (gerado por `build/novas.py`).
- **Exceções Toleradas** (pouco acima de 300 linhas; dividir só se a tarefa exigir mexer muito neles): `figuras-anim.js`, `editor.js`, `nuvem.js`, `figuras-animq-eletro.js`, `figuras-animq-fluidos2.js`.
- **Modularização em Andamento**: `script.js` (814 linhas, sendo dividido por assunto; plano em `NOTAS.md`), `style.css` e `build/novas.py`. Ao editá-los, leia só o trecho necessário.
- **Lembrete para 18/11/2026**: retomar com o dono a parte difícil do `script.js` (rodada do quiz, relógio, fontes/retomar e navegação, ~1000 linhas muito ligadas entre si). Dividi-la exige reorganizar a troca de informação entre as partes (muda a lógica). Decidir: fazer ou registrar como exceção tolerada.
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
