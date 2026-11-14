from playwright.sync_api import sync_playwright
from navegador import abrir
import json
with sync_playwright() as p:
    b=abrir(p)
    pg=b.new_page(viewport={'width':400,'height':820}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8123/index.html'); pg.wait_for_timeout(500)
    print('landing visível:',pg.locator('#landing').is_visible(),'home visível:',pg.locator('#home').is_visible(),'nav:',pg.locator('#bnav').is_visible())
    pg.screenshot(path='/tmp/landing.png')
    pg.locator('[data-q=fluidos]').click(); pg.wait_for_timeout(700)
    print('url',pg.url,'h1',pg.locator('.hero h1').inner_text(),'hst',pg.locator('#hst').inner_text().replace('\n',' '),'chips',pg.locator('.chip2').all_inner_texts())
    pg.screenshot(path='/tmp/fl_home.png')
    # estudo completo
    for mode,btn in (('estudo','#go'),('tempo','#go2'),('simulado','#mopen')):
        pg.goto('http://localhost:8123/index.html?q=fluidos'); pg.wait_for_timeout(400)
        pg.locator(btn).click(); pg.wait_for_timeout(300); n=0; tls=[]
        while pg.locator('#end:not(.hidden)').count()==0 and n<60:
            n+=1
            d=pg.evaluate('()=>0')
            if pg.locator('#num').count(): pg.locator('#num').fill('1'); pg.locator('#nsend').click()
            else: pg.locator('#opts .opt').nth(0).click()
            pg.wait_for_timeout(60)
            if pg.locator('#next:not(.hidden)').count(): pg.locator('#next').click(); pg.wait_for_timeout(80)
        print('fluidos',mode,'fim',pg.locator('#end:not(.hidden)').count(),'passos',n,pg.locator('#final').inner_text(),pg.locator('#msg').inner_text())
    pg.screenshot(path='/tmp/fl_end.png')
    # cartões
    pg.goto('http://localhost:8123/index.html?q=fluidos'); pg.wait_for_timeout(400)
    pg.locator('#bnav [data-v=cards]').click()
    for k in range(13): pg.locator('#cnext').click()
    pg.locator('#cflip').click(); pg.wait_for_timeout(700)
    pg.screenshot(path='/tmp/fl_card.png'); print('cartão',pg.locator('#cc').inner_text(), pg.locator('#fc svg.av').count())
    # tempo: amostra de pergunta de cálculo -> 60 s
    pg.goto('about:blank'); pg.goto('http://localhost:8123/index.html?q=fluidos#debug'); pg.wait_for_timeout(400)
    pg.locator('#go2').click(); pg.wait_for_timeout(300)
    r=pg.evaluate('()=>__qz("Q.filter(function(d){return d.c||d.g}).length+\\"/\\"+Q.length")'); print('calc/total',r)
    # figuras e perguntas com figura renderizam
    pg.goto('about:blank'); pg.goto('http://localhost:8123/index.html?q=fluidos#debug'); pg.wait_for_timeout(400)
    ids=pg.evaluate('()=>__qz("Q.map(function(d,k){return d.f?k:-1}).filter(function(k){return k>=0})")')
    print('perguntas com figura',len(ids))
    pg.evaluate('()=>__qz("start([%s],false)")'%ids[0])
    pg.wait_for_timeout(200); pg.screenshot(path='/tmp/fl_q.png')
    print('SVG fig:',pg.locator('#fig svg').count())
    # eletro tempo sem cálculo
    pg.goto('about:blank'); pg.goto('http://localhost:8123/index.html?q=eletro#debug'); pg.wait_for_timeout(400)
    pg.locator('#go2').click();
    bad=0
    for k in range(40):
        pg.evaluate('()=>__qz("begin(\\"tempo\\")")'); pg.wait_for_timeout(20)
        bad+=pg.evaluate('()=>__qz("order.filter(function(k){return Q[k].c||Q[k].g}).length")')
    print('eletro tempo c/g:',bad)
    pg.goto('http://localhost:8123/index.html?q=eletro'); pg.wait_for_timeout(400)
    print('eletro h1',pg.locator('.hero h1').inner_text(),'go2:',pg.locator('#go2').inner_text().replace('\n',' '))
    print('ERROS',errs)
    b.close()
