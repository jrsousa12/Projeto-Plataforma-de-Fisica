from playwright.sync_api import sync_playwright
from navegador import abrir
with sync_playwright() as p:
    b=abrir(p)
    pg=b.new_page(viewport={'width':800,'height':1000}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8123/index.html?q=fluidos'); pg.wait_for_timeout(400)
    pg.click('#bnav [data-v=lista]') if pg.locator('#bnav [data-v=lista]').count() else pg.evaluate("document.getElementById('sopen').click()")
    pg.wait_for_timeout(300)
    pg.select_option('#sn','15'); pg.select_option('#sfm','prova'); pg.fill('#sh','Escola ATL · 1º ano A'); pg.wait_for_timeout(200)
    print('questões:',pg.locator('.sq').count(),'| cabeçalho:', 'Escola ATL' in pg.inner_text('#sheetbody'))
    print('gabarito:',pg.locator('.pb').inner_text()[:120].replace('\n',' '))
    pg.uncheck('#sg'); print('sem gabarito:',pg.locator('.pb').count()); pg.check('#sg'); pg.uncheck('#scc')
    print('sem cálculo, questões:',pg.locator('.sq').count())
    pg.check('#scc'); pg.pdf(path='/tmp/prova.pdf',format='A4'); print('erros',errs); b.close()
