# Animações e questões novas (regras desta área)

Passo a passo das questões: `NOVAS.md`. Aqui ficam só as regras para gastar pouco e manter a qualidade.

## Ordem de decisão (da mais barata para a mais cara)
1. **Cálculo** → molde (`"animacao": {"decisao": "molde", ...}`). Não escrever desenho.
2. **Conceito parecido com cena existente** → reaproveitar com `"an": "chave"` (o `verificar` sugere as parecidas).
3. **Cena nova** → montar com as peças do kit; desenho cru (SVG à mão) só para o que o kit não tem.

## Peças prontas (não recopiar nos arquivos)
- `figuras-anim-kit.js`: `N.chama(x,y,cl)`, `N.seta(x1,y1,x2,y2,cor,cl,w)`, `N.raio(x1,y1,x2,y2,cl,cor,tracejado,meio)`, `N.tracejado(x1,y1,x2,y2,cl)`, `N.onda(x0,x1,y,A,lam,fase,passo)` e `N.curva(x0,L,y,A,fn)` (dão o `d` do path), `N.mola(x1,x2,y,voltas,a,cl)`.
- `figuras-anim-pecas.js`: `N.t` (texto), `N.bk` (béquer com líquido), `N.ch` (carga), `N.ar` (seta por ângulo), `N.dm`/`N.dv` (cotas), `N.sb` (subscrito).
- `figuras-anim-passos.js`: `N.scene` (cena + legendas), `N.el`/`N.pl` (elétron/próton), `N.th` (termômetro), `N.nd` (material neutro), `N.seq`, `N.jit`, `N.calc`.
- `figuras-anim.js`: trilhas `N.tr`, `N.rot`, `N.sc`, `N.op`, `N.vis`, `N.pr`; setas `N.arrow`/`N.varrow`.
- Peça útil em 2+ arquivos → mover para o kit (curta, com comentário de uma linha).

## Economia de leitura
- Não abrir os `figuras-animq-*.js` inteiros: usar `grep -n 'C("chave"\|N.scene("chave"'` e ler só o trecho.
- Fazer as animações em lote; a cada lote, rodar só `node validar-banco.js` e `python3 revisao.py --novas`. `testes.py` completo só no fim.

## Qualidade
- Mexeu em peça ou arquivo de cenas sem querer mudar o visual → comparar o registro `window.ANIM` antes/depois (carregar os arquivos no Node e comparar o texto das cenas); deve ser idêntico.
- Arquivo novo de figuras: registrar em `quizzes.js` (lista de cada quiz; o `sw.js` lê dali) e em `gerar_readme.py`.
