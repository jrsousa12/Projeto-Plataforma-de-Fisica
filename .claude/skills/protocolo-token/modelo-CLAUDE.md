# Diretrizes de Eficiência de Contexto e Tokens

Este projeto prioriza a economia de contexto e tokens. Estas diretrizes são de cumprimento obrigatório.

## 0. Contexto do Projeto

- **Stack**: (linguagens, frameworks, onde é publicado)
- **Comandos úteis**:
  - Build: (comando)
  - Testes: (rápido durante a tarefa; completo no fim)
  - Lint: (comando, ou "não há")
- **Convenções**: (nomes, pastas, arquivos gerados que não se editam à mão)
- **Próximas tarefas**: (lista numerada, ou "nenhuma")
- **Público**: o dono é professor e não programa; explicar em português simples.
- **Idioma**: responder sempre em português do Brasil (PT-BR), inclusive resumos, avisos e mensagens de commit.

> Mantenha esta seção curta. Regras de um domínio vão no `CLAUDE.md` do subdiretório.

---

## 1. Modularização e Limite de Tamanho de Arquivo

- **Limite**: nenhum arquivo de código acima de **300 linhas**; ideal abaixo de **200**.
- **Ação corretiva**: ao ler um arquivo acima do limite, a primeira tarefa é **propor um plano de modularização** antes de qualquer outra edição.
- **Arquivos de dados** (linhas longas, gerados, bancos): o critério é o tamanho, não as linhas. Nunca ler inteiro; localizar com `grep` e ler só o trecho.
- **Exceções toleradas**: (listar aqui, com o motivo e a data da decisão do dono)
- **Novas funcionalidades**: já nascem em módulos pequenos, uma responsabilidade por arquivo.

## 2. Hierarquia de Contexto (CLAUDE.md)

- **Raiz**: só regras globais, comandos e convenções.
- **Subdiretórios**: um `CLAUDE.md` por pasta-chave, com as regras daquele domínio e suas exceções locais.
- **Concisão**: bullets e cabeçalhos; nada de prosa longa.

## 3. Edição e Leitura de Código

- **Edições cirúrgicas**: editar o trecho, não reescrever o arquivo.
- **Leitura sob demanda**: só os arquivos/trechos da tarefa, com `grep` e intervalos de linhas. O dono pode indicar arquivos com `@nome`.
- **Plano antes do código**: em tarefas complexas, descrever os passos e validar com o dono antes de mexer.
- **Motores para tarefas repetitivas**: se uma tarefa se repete (gerar, converter, conferir ou corrigir em lote), criar um script (motor) que a faça, em vez de refazê-la à mão a cada vez; depois, só rodar o motor e ler o resumo da saída (tipos na seção 8).

## 4. Higiene de Comandos

- **Silenciar** comandos barulhentos (`-q`, `--silent`) ou filtrar (`| grep -E "(FAIL|PASS|Error)"`).
- **Saída concisa**: nunca despejar logs inteiros no contexto.

## 5. Protocolo de Sessão

- **Mudança de assunto** → lembrar o dono de usar `/clear`.
- **Mesma tarefa, conversa longa** → sugerir `/compact` com direcionamento (ex.: `/compact mantenha as decisões e os arquivos alterados`).
- Só o dono pode executar `/clear` e `/compact`.

## 6. Vigia de Contexto

- **Alertar** quando: um arquivo em edição se aproxima de 300 linhas; a conversa acumula informação repetida; houver releitura desnecessária; a mesma tarefa for feita à mão pela 2ª ou 3ª vez (propor um motor, seção 8).
- **Como**: uma frase com o motivo + a ação (`/compact`, `/clear` ou modularizar).
- **Regra de ouro**: nunca editar arquivo acima do limite sem **perguntar** antes. A decisão é sempre do dono.

## 7. Manutenção deste Arquivo

- Manter abaixo de **200 linhas**; o excedente vai para os `CLAUDE.md` dos subdiretórios.
- Revisar a cada mudança estrutural (nova stack, módulo ou fluxo de build).

## 8. Motores e Automações

Motor = script que faz o trabalho pesado e devolve só um resumo curto. Criar quando a tarefa se repete; propor ao dono antes (plano aprovado), registrar em "Comandos úteis" (seção 0) e manter cada motor pequeno (seção 1). Tipos que valem a pena:

- **Comando único de build**: um script que roda tudo em ordem (montar, versionar, validar, gerar docs), cada etapa com `| tail -2`.
- **Validador/auditor**: confere dados em lote (formato, cálculo, unidades, links) e lista só os erros.
- **Gerador de conteúdo**: cria itens novos (questões, páginas, registros) a partir de dados mínimos, já conferidos.
- **Moldes e kit de peças**: partes prontas reaproveitáveis; o novo se monta com elas, nunca recopiando código.
- **Catálogo/índice**: gera um `.md` curto do que já existe (chave + frase), para achar o que reaproveitar sem abrir arquivos grandes.
- **Extrator de dados**: exporta só o pedaço necessário (ex.: JSON de um banco), em vez de ler o arquivo inteiro.
- **Correção em lote**: acha e corrige um mesmo erro em todos os arquivos de uma vez.
- **Gerados automáticos**: versão, tabelas do README, listas; nunca editar à mão (anotar na seção 0).
- **Testes seletivos**: rodar só os testes ligados ao que mudou durante a tarefa; todos só no fim.
- **Ajudantes comuns de teste**: abrir navegador, simular serviço externo etc. num só módulo usado por todos os testes.
- **Revisão em lote**: capturas/relatórios de muitos itens de uma vez, em vez de um por um.
- **Memória do projeto**: listas de ideias e pendências (`IDEIAS.md`, `NOTAS.md`) para não redescobrir decisões.
