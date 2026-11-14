# Animações e questões novas (regras desta área)

Passo a passo das questões: `NOVAS.md`. Aqui ficam só as regras para gastar pouco e manter a qualidade.

## Ordem de decisão (da mais barata para a mais cara)
1. **Cálculo** → molde (`"animacao": {"decisao": "molde", ...}`). Não escrever desenho.
2. **Conceito que cabe num molde de conceito** → `"animacao": {"decisao": "conceito", "molde": ...}` (só textos; ver abaixo).
3. **Conceito parecido com cena existente** → reaproveitar com `"an": "chave"` (o `verificar` sugere as parecidas).
4. **Cena nova** → montar com as peças do kit; desenho cru (SVG à mão) só para o que o kit não tem.

## Moldes de conceito (exemplos completos: `exemplos/conceito.json`)
- `antes_depois` (`antes`, `depois`), `comparacao` (`a`, `b`): painel = `{titulo, texto, icone, escala?}`; `escala` 0,5–1,6 faz o ícone crescer/encolher.
- `etapas`: 2–4 itens `{titulo, icone?}`, **uma legenda por etapa**.
- `grafico`: `x`, `y`, `curva` (`sobe`, `desce`, `constante`, `acelera`, `satura`, `patamar`).
- Todos: `legendas` (2–4; linhas com `|`). Ícones: `chama gelo barra bola agua mola onda mais menos seta`.
- Limites (o `verificar` barra): título 18, texto 22, legenda 48 caracteres por linha. Chave gravada: `conc_<id>`.
- Código: `novas_conceito.py` (checagem/dados) e `app/figuras-animq-conceito.js` (desenho). Molde novo → nos dois + exemplo + `t_novas.py`.

## Peças prontas (não recopiar nos arquivos)
- `figuras-anim-kit.js`: `N.chama(x,y,cl)`, `N.seta(x1,y1,x2,y2,cor,cl,w)`, `N.raio(x1,y1,x2,y2,cl,cor,tracejado,meio)`, `N.tracejado(x1,y1,x2,y2,cl)`, `N.onda(x0,x1,y,A,lam,fase,passo)` e `N.curva(x0,L,y,A,fn)` (dão o `d` do path), `N.mola(x1,x2,y,voltas,a,cl)`.
- `figuras-anim-pecas.js`: `N.t` (texto), `N.bk` (béquer com líquido), `N.ch` (carga), `N.ar` (seta por ângulo), `N.dm`/`N.dv` (cotas), `N.sb` (subscrito).
- `figuras-anim-passos.js`: `N.scene` (cena + legendas), `N.el`/`N.pl` (elétron/próton), `N.th` (termômetro), `N.nd` (material neutro), `N.seq`, `N.jit`, `N.calc`.
- `figuras-anim.js`: trilhas `N.tr`, `N.rot`, `N.sc`, `N.op`, `N.vis`, `N.pr`; setas `N.arrow`/`N.varrow`.
- Peça útil em 2+ arquivos → mover para o kit (curta, com comentário de uma linha).

## Economia de leitura
- Achar cena para reaproveitar: `grep -i palavra build/CENAS.md` (catálogo gerado pelo `tudo.sh`; chave + frase de cada cena).
- Não abrir os `figuras-animq-*.js` inteiros: usar `grep -n 'C("chave"\|N.scene("chave"'` e ler só o trecho.
- Fazer as animações em lote; a cada lote, rodar só `node validar-banco.js` e `python3 revisao.py --novas`. `testes.py --mudou` no meio; completo só no fim.

## Qualidade
- Mexeu em peça ou arquivo de cenas sem querer mudar o visual → `node catalogo_cenas.js` antes e depois: a impressão digital tem de ser a mesma.
- Arquivo novo de figuras: registrar em `quizzes.js` (lista de cada quiz; o `sw.js` lê dali) e em `gerar_readme.py`.

## Testes
- Teste novo de navegador: `from navegador import abrir, B` e `b = abrir(p)` (não recopiar o `launch`).
- Arquivo sem teste ligado: acrescentar a regra em `testes_mudou.py` (`REGRAS`).
