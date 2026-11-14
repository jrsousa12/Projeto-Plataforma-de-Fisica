from playwright.sync_api import sync_playwright
from navegador import abrir
B='http://localhost:8123/'
with sync_playwright() as p:
    b=abrir(p)
    pg=b.new_page(viewport={'width':400,'height':820}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.goto(B+'index.html'); pg.wait_for_timeout(400); pg.screenshot(path='/tmp/landing3.png')
    pg.locator('[data-q=termo]').click(); pg.wait_for_timeout(600)
    print('h1:',pg.locator('.hero h1').inner_text(),'|',pg.locator('#hst').inner_text().replace('\n',' '),'| chips',pg.locator('.chip2').count())
    pg.screenshot(path='/tmp/termo_home.png')
    for mode,btn in (('estudo','#go'),('tempo','#go2'),('simulado','#mopen')):
        pg.goto('about:blank'); pg.goto(B+'index.html?q=termo'); pg.wait_for_timeout(400); pg.locator(btn).click(); pg.wait_for_timeout(300); n=0
        while pg.locator('#end:not(.hidden)').count()==0 and n<60:
            n+=1
            if pg.locator('#num').count(): pg.locator('#num').fill('1'); pg.locator('#nsend').click()
            else: pg.locator('#opts .opt').nth(0).click()
            pg.wait_for_timeout(50)
            if pg.locator('#next:not(.hidden)').count(): pg.locator('#next').click(); pg.wait_for_timeout(70)
        print(mode,'fim',pg.locator('#end:not(.hidden)').count(),pg.locator('#final').inner_text())
    # numéricas: todas as geradas funcionam (resposta certa aceita)
    pg.goto('about:blank'); pg.goto(B+'index.html?q=termo#debug'); pg.wait_for_timeout(400)
    print('numéricas:',pg.evaluate("__qz('Q.filter(function(d){return d.g}).length')"))
    print('erros antes figuras',errs)
    # figuras
    pg.evaluate('''()=>{var h="";["escalas","curva"].forEach(function(k){h+='<div class="fig" style="margin:6px"><svg viewBox="0 0 320 140">'+FIG[k].s+'</svg></div>'});document.body.innerHTML='<div style="max-width:420px;margin:0 auto">'+h+'</div>'}''')
    pg.screenshot(path='/tmp/figs3.png'); print('erros',errs); b.close()
