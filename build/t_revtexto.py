"""Motor de revisão de textos (revtexto.py): cada conferência acha o erro e não dá alarme falso.
Não usa navegador; o relatório vai para uma pasta temporária e os bancos não são alterados."""
import os, sys, tempfile
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
import revtexto as R
cfg = R.config()
tipos = lambda t: [a[0] for a in R.revisar_texto(t, cfg)]

# acha o erro (texto -> tipo esperado)
ERROS = {
    'A carga de de um elétron.': 'palavra repetida',
    'A força  vale 2 N.': 'espaço duplo',
    'A força vale 2 N .': 'espaço antes da pontuação',
    'Calor é energia,temperatura é medida.': 'falta espaço depois da pontuação',
    'O corpo cai. a velocidade aumenta.': 'minúscula depois do ponto',
    'Voce sabe por que a agua ferve?': 'falta acento',
    'A temperatura é 300 graus kelvin.': 'termo fora do padrão',
    'O carro anda a 60 Km por hora.': 'unidade fora do padrão',
    'A aceleração é 9,8 m/s2.': 'unidade fora do padrão',
    'A água ferve a 100 ºC.': 'unidade fora do padrão',
    'O carro anda a 20m/s.': 'número colado na unidade',
    'A massa é 2,5kg.': 'número colado na unidade',
    'O valor é 9.8 m/s².': 'ponto decimal',
    'Logo, v = 20.': 'número sem unidade?',
    ' '.join(['palavra'] * 45) + '.': 'frase longa',
}
for t, tipo in ERROS.items():
    assert tipo in tipos(t), 'não achou "%s" em: %s -> %s' % (tipo, t, tipos(t))

# não dá alarme falso (textos certos, vários tirados dos bancos)
CERTOS = [
    '1 m³ = 1 000 000 cm³ e 1 kg = 1 000 g.', 'i = 0,25 A e Δt = 2 h = 7200 s.',
    'A função horária do MUV é do 2º grau.', 'O campo E e o potencial V.', 'Se se aproximar, a força cresce.',
    'A pressão é 100 Pa. p = F/A.', 'Então v = 0 no ponto mais alto.', 'A energia é 2h vezes g, ou seja, 2g.',
    'Ex. de grandeza: a massa.', 'A água ferve a 100 °C ao nível do mar.', 'A velocidade é 20 m/s.',
    'Veja a figura: I = I₀ · 10^(β/10).',
]
for t in CERTOS:
    assert not tipos(t), 'alarme falso em: %s -> %s' % (t, tipos(t))

# clareza da questão inteira
q = lambda **k: [a[1] for a in R.revisar_questao(dict(id='z1', a=0, **k), cfg)]
assert 'enunciado sem pergunta' in q(q='O calor passa do quente para o frio.', o=['a1', 'b1', 'c1', 'd1'])
assert not q(q='O calor passa do quente para o frio.', o=['Verdadeiro', 'Falso']), 'V/F não é erro'
assert not q(q='Calcule a força resultante.', o=['10 N', '20 N', '30 N', '40 N'])
longa = ['Calor é energia em trânsito por diferença de temperatura.', 'São iguais.', 'Calor é medida.', 'Não existe.']
assert 'correta é a mais longa' in q(q='O que é calor?', o=longa)
assert not q(q='Quanto vale?', o=['1,2 × 10⁴ J', '200 J', '6000 J', '40 J']), 'números curtos não contam'
cfg['ignorar'] = {'z1': ['correta é a mais longa']}
assert not q(q='O que é calor?', o=longa), 'aviso marcado em "ignorar" deveria sumir'
cfg = R.config()

# texto solto (arquivo .md) e banco real: roda inteiro e só grava o relatório
tmp = tempfile.mkdtemp(); md = os.path.join(tmp, 'aula.md')
open(md, 'w', encoding='utf-8').write('# Aula\n\nO carro anda a 20m/s.\n\nTudo certo aqui.\n')
par = R.texto_de_arquivo(md)
assert [p[1] for p in par] == ['Aula', 'O carro anda a 20m/s.', 'Tudo certo aqui.'], par
assert par[1][0] == 'linha 3', par
qs = [x for v in R.bancos().values() for x in v]
assert len(qs) > 500
for x in qs:
    R.revisar_questao(x, cfg)   # não pode quebrar em nenhuma questão
print('t_revtexto OK')
