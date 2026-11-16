---
name: protocolo-token
description: Aplica o protocolo de economia de tokens e contexto do dono a um projeto (novo ou já iniciado) e, no computador do dono, oferece instalá-lo para todos os projetos. Use quando o dono digitar /protocolo-token ou pedir "aplique o protocolo-token".
---

# /protocolo-token

Aplica `modelo-CLAUDE.md` ao projeto atual. Responder em PT-BR simples (o dono é professor e não programa).

**Regras fixas (valem em todos os passos)**
- **Propor, não fazer**: tudo que cria ou muda arquivo (exceto o `CLAUDE.md` no Passo 2) só com "sim" do dono (AskUserQuestion, uma frase por item).
- **Nunca apagar** regra do dono; em conflito, perguntar.
- Ler só o necessário; não varrer o projeto.

**Arquivos da skill** (copiar sempre todos): `SKILL.md`, `modelo-CLAUDE.md`, `motor-questao.md`, `motor-teoria.md`, `motor-revtexto.md`, `kit-figuras.md`, `travas-e-barra.md`, `diagnostico.sh`.
**Origem**: GitHub `jrsousa12/projeto-plataforma-de-fisica`, pasta `.claude/skills/protocolo-token/`. Faltou algum arquivo aqui → buscar de lá antes de seguir.

## Passo 1 — Onde estou?

- `CLAUDE_CODE_REMOTE=true` → **nuvem**: ir ao Passo 2.
- Senão → **notebook do dono**: oferecer o que faltar (cada item é uma pergunta):
  1. `~/.claude/CLAUDE.md` ("regras em todos os projetos"): seções 1–10 do modelo + linhas **Público** e **Idioma**. Se já existir, só acrescentar.
  2. `~/.claude/skills/protocolo-token/` ("/protocolo-token em qualquer projeto"): copiar os arquivos da skill.
  3. Barra de contexto global: parte 2 de `travas-e-barra.md`.
  4. Só lembrar (não insistir; recusado na nuvem em 15/11/2026): no claude.ai, Configurações → Ambientes, liberar sites de pacotes (pypi, npm) e tirar acento do nome do ambiente.

## Passo 2 — `CLAUDE.md` da raiz

- **Não existe**: ver só lista da raiz, início do `README` e arquivos de build/teste; criar pelo modelo preenchendo a seção 0. Não descobriu → perguntar. Com o global instalado, as seções 1–10 viram uma linha ("Segue o protocolo-token, `~/.claude/CLAUDE.md`"); na nuvem, manter completas.
- **Existe**: ler só ele; acrescentar apenas o que falta do modelo, no lugar certo. Passou de 200 linhas → propor mover trechos para `CLAUDE.md` de subpastas.

## Passo 3 — Diagnóstico (só olhar, anotar o que falta)

Rodar `bash .claude/skills/protocolo-token/diagnostico.sh` (ou o da pasta global) **antes de ler qualquer arquivo**. Ele confere sozinho a tabela abaixo e imprime só `OK` / `FALTA` / `INFO`; ler o resumo e abrir apenas as receitas apontadas. Sem o script, conferir a tabela à mão.

| Se o projeto tem… | Conferir | Receita |
|---|---|---|
| sempre | arquivos > 300 linhas não citados no `CLAUDE.md` → dividir ou registrar exceção | — |
| sempre | scripts existentes listados em "Comandos úteis" | seções 8–9 do modelo |
| sempre | testes guardados por assunto + rodar só o que mudou | seção 8 do modelo |
| sempre | barra de contexto (global ou do projeto) | `travas-e-barra.md` |
| dados com linhas > ~2 000 caracteres | motor de item único; depois, trava de leitura | `motor-questao.md`, `travas-e-barra.md` |
| banco de questões | motor de teoria com fichas por área (perguntar áreas e se embaralha) | `motor-teoria.md` |
| textos para pessoas lerem | revisor de textos (perguntar conferências; sem corretor completo) | `motor-revtexto.md` |
| figuras/animações | desenho repetido em 2+ arquivos → kit de peças único | `kit-figuras.md` |

Abrir a receita **só** da linha que se aplica.

## Passo 4 — Proposta única

Mostrar ao dono **uma lista curta**, cada item com: o que faz · quanto poupa · esforço. O dono marca o que quer (AskUserQuestion, `multiSelect`).
Fazer só os aprovados, seguindo a receita: pequeno, testado (teste guardado), conferido no conteúdo real. Ganchos e barra valem a partir da próxima sessão (avisar).

## Passo 5 — Levar a skill junto

Sem `.claude/skills/protocolo-token/` no projeto → copiar os arquivos da skill (para funcionar nas próximas sessões, inclusive na nuvem).

## Passo 6 — Fechar

- Resumo em PT-BR: feito · pendente de decisão.
- Commit/push pelas regras de branch da sessão; mensagem em PT-BR.
- Dicas da seção 10 do modelo (curtas) e lembrar `/clear` ao trocar de assunto.
