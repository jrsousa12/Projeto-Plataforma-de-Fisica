from playwright.sync_api import sync_playwright
import json,time
B='http://localhost:8123/';bad=[]
def ck(c,m):
    if not c:bad.append(m)
now=int(time.time()*1000)
hist=[{'d':now-i*864e5*1.3,'s':[5,6,7.5,6.5,8,9,7,8.5][i%8],'n':10,'a':{'el':[3,5],'co':[2,5]}} for i in range(8,-1,-1)]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':360,'height':760});errs=[]
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(B+'index.html');pg.wait_for_timeout(900)
    # meta numa linha
    ys=pg.evaluate("[...document.querySelectorAll('#metabar .mg button')].map(b=>Math.round(b.getBoundingClientRect().top))")
    ck(len(set(ys))==1 and len(ys)==4,'metas em uma linha '+str(ys))
    ws=pg.evaluate("[...document.querySelectorAll('#metabar .mg button')].map(b=>Math.round(b.getBoundingClientRect().width))");print('metas',ws)
    pg.locator('#metabar').scroll_into_view_if_needed();pg.screenshot(path='/tmp/m2.png')
    pg.goto(B+'index.html?q=eletro');pg.wait_for_timeout(900)
    ck(not pg.locator('#fz').is_visible(),'fz oculto antes do menu')
    ck(pg.locator('#mnu').is_visible(),'botão menu')
    pg.screenshot(path='/tmp/m0.png')
    pg.click('#mnu');pg.wait_for_timeout(300)
    ck(all(pg.locator(i).is_visible() for i in ['#snd','#fz','#th','#pal']),'itens do menu visíveis')
    ck(pg.locator('#navb').count()==1,'nav')
    pg.screenshot(path='/tmp/m1.png')
    pg.keyboard.press('Escape');pg.wait_for_timeout(100)
    ck(not pg.locator('#fz').is_visible(),'Esc fecha')
    pg.click('#mnu');pg.click('body',position={'x':200,'y':600});pg.wait_for_timeout(100)
    ck(not pg.locator('#fz').is_visible(),'clique fora fecha')
    # resumo
    pg.click('details.sum summary');pg.wait_for_timeout(200)
    ck(pg.locator('details.sum .fr').count()>=4,'frações no resumo')
    pg.locator('details.sum').scroll_into_view_if_needed();pg.screenshot(path='/tmp/m3.png')
    # cartões
    pg.locator('#bnav [data-v=cards]').click();pg.wait_for_timeout(200)
    t0=pg.inner_text('#cc');pg.click('#cflip');pg.wait_for_timeout(250)
    pg.screenshot(path='/tmp/m4.png')
    pg.wait_for_timeout(600)
    ck(pg.inner_text('#cc')!=t0 and 'back' in pg.get_attribute('#fc','class'),'virou')
    ck('📇' in pg.inner_text('#bnav'),'ícone novo')
    pg.click('#fc');pg.wait_for_timeout(700)
    ck('back' not in pg.get_attribute('#fc','class'),'desvirou clicando no cartão')
    # desempenho
    pg.evaluate("h=>localStorage.setItem('eletriz:hist',JSON.stringify(h))",hist)
    pg.reload();pg.wait_for_timeout(700)
    pg.locator('#bnav [data-v=hist]').click();pg.wait_for_timeout(900)
    ck(pg.locator('#histbody .gr svg').count()>=2,'gráficos '+str(pg.locator('#histbody .gr svg').count()))
    pg.screenshot(path='/tmp/m5.png',full_page=True)
    print('erros',errs,'falhas',bad)
