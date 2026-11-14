# Notas do Projeto

Plano, decisões e pendências que precisam sobreviver ao `/clear`. Atualizar a cada etapa concluída.

## Modularização do `script.js`

Ordem: do menor risco ao maior. Antes de cada commit: `node --check`, `bash build/tudo.sh`, `python3 build/gerar_readme.py --verificar` e `cd build && python3 testes.py` (termina em "Todos os testes passaram.").

Todo arquivo novo do app entra em: `index.html` (`<script>`, na ordem certa), `sw.js` (lista `BASE`), `build/bundle.py` (lista de arquivos) e `build/gerar_readme.py` (`REGRAS`, descrição do README).

1. **Dados das animações automáticas** — feito (`4d36e8c`): `figuras-animq-auto-dados.js` separado de `figuras-animq-auto.js`.
2. **Blocos independentes do `script.js`** — feito (`9a9a20d`): `app-meta.js`, `app-nav.js`, `app-escolha.js`, `app-subscritos.js`, `app-sombra.js`.
3. **Histórico e gráficos** — feito: `app-graficos.js` (250) e `app-historico.js` (166); `script.js` 2425 → 2046. `histAdd` ficou no `script.js` (lê a pontuação, que muda). Teste novo: `build/t_hist.py`.
4. **Folha e relatório** — feito: `app-folha.js` (127) e `app-relatorio.js` (100); `script.js` 2046 → 1864. As áreas marcadas (`sel`) mudam, a folha lê por `c.sel()`. Teste novo: `build/t_folha.py`; `t_hist.py` confere o relatório.
5. **Cartões** — feito: `app-cartoes.js` (127); `script.js` 1864 → 1749. A navegação (#cartoes) chama `abrirCartoes()`. Teste novo: `build/t_cartoes.py`.
   **Caderno de erros** — feito: `app-caderno.js` (115); `script.js` 1749 → 1664. Botão Treinar ficou no `script.js`. Teste novo: `build/t_caderno.py`.
   **Validação do banco** — feito: `app-validacao.js` (43); `script.js` 1664 → 1629. O `#debug` com `eval` ficou no `script.js`. Teste novo: `build/t_valida.py`. Etapas fáceis concluídas.
6. **Parte difícil** (aprovada pelo dono em 13/11/2026). Ordem: armazenamento/sorteio → revisão → sessão (fontes/retomar) → navegação → relógio → resultado → pergunta/resposta. Variáveis que mudam passam por funções (`c.mode()`) ou por um objeto comum.
   - **Armazenamento e sorteio** — feito: `app-armazenamento.js` (48) e `app-sorteio.js` (50); `script.js` 1629 → 1564. Teste novo: `build/t_sorteio.py`.
   - **Rever perguntas anteriores** (botão "← Anterior", não a revisão do fim) — feito: `app-revisao.js` (87); `script.js` 1564 → 1509. Teste novo: `build/t_revisao.py`.
   - **Sessão (fontes / retomar de onde parou)** — feito: `app-sessao.js` (125); `script.js` 1509 → 1422. O que altera variáveis do `script.js` (pausar, retomar) fica em funções passadas ao módulo (`c.estacionar`, `c.retomarCom`). Teste novo: `build/t_sessao.py` (ao recarregar volta à mesma pergunta; sessão de mais de 12 h não é oferecida).
   - **Navegação** (endereços #nome, botão voltar, aviso "sair do quiz?", Esc) — feito: `app-telas.js` (131); `script.js` 1422 → 1318. `VMAP` ficou no `script.js` (usado pelo `openOnly`); parar os relógios chega como `c.pararRelogios`. O botão "início" só aparece no quiz e nas Fontes (regra do CSS, não é erro). Teste novo: `build/t_telas.py`.
   - **Relógio** (tempo da rodada, pausa, tempo por pergunta no cronometrado) — feito: `app-relogio.js` (155); `script.js` 1318 → 1216. Corrigido erro do passo anterior: `var TL` (navegação) apagava `TL = 30` (segundos por pergunta) e a barra do cronometrado não esgotava; a navegação agora é `TE`. Teste novo: `build/t_relogio.py` (usa relógio simulado do Playwright, `pg.clock`).
   - **Resultado** (tela do fim da rodada e ranking) — feito: `app-resultado.js` (253); `script.js` 1216 → 1039. O `finish()` ficou no `script.js` (fecha a rodada, completa o simulado, grava o histórico) e chama `RS.mostrar({...})`, que só monta a tela. Teste novo: `build/t_resultado.py`.
   - **Pergunta/resposta** — feito: `app-animacao.js` (133), `app-numeros.js` (47) e `app-retorno.js` (85); `script.js` 1039 → 814. `show()`, `pick()` e `submitNum()` ficaram no `script.js` (mexem em pontuação, sequência e `locked`); o `pick` chama `RT.mostrar({...})`, que só monta a caixa de retorno. Teste novo: `build/t_retorno.py`. Parte difícil concluída.
   - **Perfil e Compartilhar** (decidido com o dono em 13/11, adiantando o dia 18) — feito: `app-perfil.js` (97) e `app-compartilhar.js` (54); `script.js` 814 → 705. Teste novo: `build/t_perfil.py`.
   - **Encerrado**: o resto do `script.js` (início da rodada, `show`/`pick`, `finish`, níveis) fica como exceção tolerada (registrado no `CLAUDE.md`).
7. Opcional: `style.css` e `build/novas.py`.
   - **Kit de animação** — feito: `figuras-anim.js` 540 → 212, mais `figuras-anim-pecas.js` (175, peças de desenho) e `figuras-anim-passos.js` (163, cena com legendas, medidores, termômetro). Registrados em `quizzes.js` (o `sw.js` e o `bundle.py` leem de lá). Os três usam `window.AN = window.AN || {}` porque o `validar-banco.js` carrega em ordem alfabética.
   - **Visual** — feito: `style.css` 739 → 236, mais `estilo-escolar.css` (169, visual escolar e menus), `estilo-extras.css` (210, extras, cartões, animações) e `estilo-telas.css` (124, resultado, desempenho, fontes, cores por área). Só cortes em blocos seguidos: no CSS a ordem decide, então a ordem dos `<link>` no `index.html`/`editor.html` não pode mudar. O `bundle.py` junta os `.css` na ordem do `index.html` (arquivo único saiu idêntico). Teste novo: `build/t_estilo.py`. 
   - **Motor de questões** — feito: `build/novas.py` 561 → 117 (só comandos), mais `novas_comum.py` (25, caminhos e utilidades), `novas_unidades.py` (102, unidades, calculadora, número das alternativas), `novas_checagens.py` (138, conta, aritmética da explicação, frações), `novas_fonte.py` (49, fonte e cache), `novas_animacao.py` (70, viabilidade, estrutura, duplicadas) e `novas_moldes.py` (83, moldes e lista FONTE). `novas.py` reexporta tudo (`build/src/*_cache.py` usam `novas.guardar_cache`). Saídas de `auditar`, `animacoes`, `modelo` e do relatório saíram idênticas. Corrigido de passagem: `verificar` quebrava quando `x` vinha como lista. Teste novo: `build/t_novas.py`. **Modularização encerrada.**

## Decisões que valem daqui em diante

- Todo teste novo vai para `build/t_*.py` (o `testes.py` roda todos), para poder repetir depois.
- No mapeamento de dependências, incluir o parâmetro `id` do `__boot` (passou despercebido no passo 3; o teste pegou).
- Ao passar a usar um nome novo no `script.js` (ex.: `var TL`), conferir com `grep -n "\bNOME\b"` se ele já existe.
- Arquivos novos do app usam prefixo `app-` (o prefixo `quiz-` é lido pelo `validar-banco.js` como banco).
- A divisão não muda a lógica: só move código; variáveis compartilhadas passam por um objeto comum.
- `sw.js`: páginas usam internet primeiro (3 s); demais arquivos usam a cópia e atualizam em segundo plano. Funciona porque o nome do cache muda a cada versão (`build/versao.py`). Não trocar sem motivo.
- Nunca orientar alunos a "limpar dados do site" (apaga o progresso). Para atualizar: fechar e abrir com internet.
- O robô do GitHub (`versao.yml`) commita no `main` após cada push: antes de publicar no `main`, atualizar a cópia local; nunca forçar o push.
- CSS (quando dividir): manter a ordem dos `<link>` no `index.html` (cascata) e comparar telas antes/depois.

## Pendências

- **Depois do item 1 do `build/IDEIAS.md`** (distratores automáticos), nesta ordem:
  1. Deixar o `build/t_sessao.py` confiável: falhou 1 vez em 7 sem mudança (confere a pergunta antes de a página terminar de carregar; esperar o elemento em vez de tempo fixo).
  2. Item 3 do `IDEIAS.md` (peça de gráfico com eixos no kit) só quando houver figuras estáticas novas.

- Remoto mudou para `jrsousa12/Projeto-Plataforma-de-Fisica`; atualizar o endereço do `origin` quando o dono quiser.
- Rodar `/fewer-permission-prompts` (só o dono pode).

## Otimização (14/11/2026)

- **Bancos em paralelo** — feito (`5c0994e`): `QuizLista.carregar` (`quizzes.js`) pede todos os arquivos juntos e executa na ordem (`async = false`).
- **Arquivo único compactado** — feito: `build/bundle.py` passa o código por `build/compactar.py` (CSS) e `build/compactar.js` (JavaScript, lido pelo TypeScript instalado no computador; sem ele, entra sem compactar e avisa). Tira comentários e espaços; mantém as quebras de linha e não renomeia nada. 1242 → 1147 KB. O site publicado (GitHub Pages) continua sem compactar, por decisão do dono.
