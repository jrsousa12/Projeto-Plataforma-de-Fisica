# Receita: kit de peças de desenho (figuras e animações)

Para projetos que desenham figuras (SVG, canvas): ilustrações, animações, gráficos.
Problema: cada figura nova recopia o mesmo desenho (eixos, setas, molas). Isso gasta tokens e, quando há um erro, ele tem de ser corrigido em vários lugares.
Exemplo pronto: `figuras-anim-kit.js` do projeto de física (Projeto-Plataforma-de-Fisica): `N.grafico` (escala + curva) e `N.eixos`.

## Regra
- **Um motor só para figuras e animações.** A ilustração é uma animação parada: não criar um motor de ilustrações separado, e sim acrescentar peças ao kit.
- Ordem (da mais barata para a mais cara): molde pronto → reaproveitar uma cena parecida → montar com peças do kit → desenho cru só para o que o kit não tem.
- Uma peça usada em 2 ou mais arquivos vai para o kit: curta, com um comentário de uma linha e parâmetros simples (ex.: `N.grafico(x0,y0,w,h,ym)` devolve `g.x(q)`, `g.y(v)`, `g.d(Y,n)`).
- Listar as peças no `CLAUDE.md` da área (nome + parâmetros), para que o Claude não precise abrir o kit.
- Catálogo gerado das cenas (chave + frase) para achar uma cena sem abrir os arquivos de desenho.

## Trocar uma cópia pela peça sem mudar o visual
1. **Impressão digital** antes: um script carrega todos os arquivos de figuras e calcula o hash do que cada cena gera. Ele tem de cobrir **todos** os arquivos que serão mexidos.
2. Trocar as cópias pela peça. Se as cópias forem um pouco diferentes entre si, a diferença vira parâmetro (ex.: `zero`, o rótulo da origem).
3. Impressão digital depois: tem de dar **igual**.
4. Provar que a conferência funciona: mudar um detalhe de propósito (espessura de linha), ver o hash mudar e desfazer.
5. Testes seletivos; anotar a peça no `CLAUDE.md` da área e na lista de ideias.

## Cuidados
- Manter a mesma ordem das contas (ex.: `y0-h*v/ym`), senão o arredondamento muda e o hash acusa diferença.
- Arquivo de desenho perto de 300 linhas: a troca pelas peças do kit costuma ser a primeira forma de encolhê-lo.
