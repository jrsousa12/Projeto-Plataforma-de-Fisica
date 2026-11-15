"""Caderno de erros: joga uma rodada (com erros), confere se as erradas aparecem no caderno e no
botão do menu, exporta o código, apaga, importa de volta, testa código inválido e o botão Treinar."""
import os,re
from playwright.sync_api import sync_playwright
from navegador import abrir
with sync_playwright() as p:
    b=abrir(p)
    pg=b.new_page(viewport={'width':800,'height':1000}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8123/index.html?q=eletro'); pg.wait_for_timeout(500)
    assert pg.locator('#bookbody .rv').count()==0
    pg.click('#go'); pg.wait_for_timeout(300); n=0
    while pg.locator('#end:not(.hidden)').count()==0 and n<40:
        n+=1
        if pg.locator('#num').count(): pg.fill('#num','987654'); pg.click('#nsend')
        else: pg.locator('#opts .opt').nth(0).click()
        pg.wait_for_timeout(100)
        if pg.locator('#next:not(.hidden)').count(): pg.click('#next'); pg.wait_for_timeout(120)
    pg.wait_for_timeout(900)
    pg.evaluate("location.hash='#inicio'"); pg.wait_for_timeout(400)
    menu=int(re.search(r'\((\d+)\)',pg.text_content('#bopen')).group(1))
    pg.evaluate("document.getElementById('bopen').click()"); pg.wait_for_timeout(300)
    nl=pg.locator('#bookbody .rv').count()
    print('erradas no caderno:',nl,'| no botão do menu:',menu)
    assert nl>0 and nl==menu, 'caderno e botão do menu não batem'
    assert pg.locator('#btrain:not(.hidden)').count() and pg.locator('#bclear:not(.hidden)').count()
    pg.click('#bexp'); pg.wait_for_timeout(200); cod=pg.input_value('#bkio')
    print('exportar:',pg.text_content('#bmsg'),'| código com',len(cod),'caracteres')
    assert len(cod)>10
    pg.click('#bclear'); pg.wait_for_timeout(200)
    assert pg.locator('#bookbody .rv').count()==0 and pg.locator('#btrain.hidden').count(), 'apagar não esvaziou'
    pg.fill('#bkio',cod); pg.click('#bimp'); pg.wait_for_timeout(200)
    print('importar:',pg.text_content('#bmsg'),'| questões:',pg.locator('#bookbody .rv').count())
    assert pg.text_content('#bmsg')=='Caderno importado.' and pg.locator('#bookbody .rv').count()==nl, 'importar não devolveu o caderno'
    pg.fill('#bkio','isso nao e um codigo'); pg.click('#bimp'); pg.wait_for_timeout(200)
    assert pg.text_content('#bmsg')=='Código inválido.' and pg.locator('#bookbody .rv').count()==nl
    pg.click('#btrain'); pg.wait_for_timeout(400)
    print('treinar abriu a rodada:',bool(pg.text_content('#q')))
    assert pg.locator('#book.hidden').count() and pg.text_content('#q'), 'Treinar não iniciou a rodada'
    print('erros',errs); b.close()
