"""Perfil (app-perfil.js) e Compartilhar (app-compartilhar.js): joga uma rodada cronometrada, confere o texto
do Compartilhar (nota, total e modo); depois abre "Meu desempenho": o quadro aparece e o botão Treino adaptativo abre o quiz."""
import os,re
from playwright.sync_api import sync_playwright
from navegador import abrir
with sync_playwright() as p:
    b=abrir(p)
    pg=b.new_page(viewport={'width':800,'height':1000}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8123/index.html?q=mec'); pg.wait_for_timeout(500)
    pg.evaluate("delete navigator.share; navigator.clipboard.writeText=function(t){window.__cop=t;return Promise.resolve()}")
    pg.click('#go2'); pg.wait_for_timeout(300); n=0
    while pg.locator('#end:not(.hidden)').count()==0 and n<40:
        n+=1
        if pg.locator('#num').count(): pg.fill('#num','1'); pg.click('#nsend')
        else: pg.locator('#opts .opt').nth(0).click()
        pg.wait_for_timeout(100)
        if pg.locator('#next:not(.hidden)').count(): pg.click('#next'); pg.wait_for_timeout(120)
    pg.wait_for_timeout(900)
    certas=pg.locator('#rdots .rd.ok').count()
    pg.click('#share'); pg.wait_for_timeout(200)
    t=pg.evaluate("window.__cop||''"); print('compartilhar:',t)
    assert re.match(r'Fiz %d/10 no quiz de .+ \(cronometrado\) em .+\. Tente também!'%certas,t), 'texto do compartilhar errado'
    assert pg.inner_text('#share')=='Copiado!', 'botão não mudou para Copiado!'
    pg.goto('http://localhost:8123/index.html?q=mec#desempenho'); pg.wait_for_timeout(800)
    perf=pg.inner_text('#perfilbox'); print('perfil:',perf[:120].replace('\n',' | '))
    assert 'Perguntas dominadas' in perf and 'perguntas vistas' in perf, 'quadro do perfil incompleto'
    pg.click('.htab[data-p="2"]'); pg.wait_for_timeout(200)
    pg.click('#tadapt'); pg.wait_for_timeout(500)
    assert pg.locator('#quiz:not(.hidden) #opts, #quiz:not(.hidden) #num').count()>=1, 'treino adaptativo não abriu o quiz'
    print('erros',errs); assert not errs; b.close()
