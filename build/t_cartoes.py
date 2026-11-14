"""Cartões de revisão: abrir, virar, avançar, embaralhar, trocar de baralho, sair e voltar
pelo endereço #cartoes (deve recomeçar do primeiro cartão, virado para a frente)."""
import os
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None,args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':800,'height':1000}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    cc=lambda: pg.text_content('#cc')
    curio=0
    for q in ('eletro','termo','mec','onda','optica','fluidos','edin'):
        pg.goto('http://localhost:8123/index.html?q='+q); pg.wait_for_timeout(500)
        pg.evaluate("document.getElementById('fopen').click()"); pg.wait_for_timeout(300)
        assert cc().startswith('Cartão 1 de ') and 'conceito' in cc(), q+': não abriu no cartão 1: '+cc()
        pg.click('#cflip'); pg.wait_for_timeout(100)
        assert 'resposta' in cc() and 'back' in pg.get_attribute('#fc','class'), q+': não virou'
        pg.click('#cnext'); pg.wait_for_timeout(700)
        assert cc().startswith('Cartão 2 de ') and 'resposta' not in cc(), q+': não avançou: '+cc()
        pg.click('#cshuf'); pg.wait_for_timeout(700)
        assert cc().startswith('Cartão 1 de '), q+': embaralhar não voltou ao 1: '+cc()
        pg.click('#cnext'); pg.wait_for_timeout(700); pg.click('#cflip'); pg.wait_for_timeout(100)
        pg.click('#cback'); pg.wait_for_timeout(300)
        pg.evaluate("location.hash='#cartoes'"); pg.wait_for_timeout(500)
        assert pg.locator('#cards:not(.hidden)').count() and cc().startswith('Cartão 1 de ') and 'resposta' not in cc(), q+': #cartoes não recomeçou: '+cc()
        if pg.locator('#cdeck:not(.hidden)').count():
            curio+=1; pg.click('#dk1'); pg.wait_for_timeout(200)
            assert 'curiosidade' in cc(), q+': baralho de curiosidades não abriu: '+cc()
        print(q,'ok |',cc())
    print('quizzes com curiosidades:',curio)
    print('erros',errs); b.close()
