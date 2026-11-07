import html,sys
from playwright.sync_api import sync_playwright
def play(pg,fr,btn,perfect,tag,errs):
    f=fr
    f.locator(btn).click(); pg.wait_for_timeout(300)
    n=0
    while f.locator('#end:not(.hidden)').count()==0 and n<80:
        n+=1
        st=f.locator('body').evaluate('()=>0')  # noop
        info=pg.evaluate('(()=>{var w=window;return 0})()') if False else None
        q=f.locator('#q').inner_text()
        if f.locator('#num').count():
            if perfect:
                ans=pg.evaluate('0') if False else None
            f.locator('#num').fill('1'); f.locator('#nsend').click()
        else:
            f.locator('#opts .opt').nth(0).click()
        pg.wait_for_timeout(100)
        if f.locator('#next:not(.hidden)').count(): f.locator('#next').click(); pg.wait_for_timeout(120)
    pg.wait_for_timeout(900)
    ok=f.locator('#end:not(.hidden)').count()
    print(tag,'fim:',ok,'passos',n,'final:',f.locator('#final').inner_text(),'| erros:',errs)
    for bid in ('share','prt','again'):
        el=f.locator('#'+bid)
        if f.locator('#end:not(.hidden)').count() and el.is_visible():
            try: el.click(timeout=2000)
            except Exception: print(' falha em',bid)
            pg.wait_for_timeout(300)
    print('  após botões, erros:',errs)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for name,url,iframe in (('http','http://localhost:8123/index.html?q=eletro',False),('arquivo único','file:///home/claude/quiz/Quiz__Eletrost_tica_3.html?q=eletro',False),('prévia (iframe)','file:///home/claude/quiz/build/wrap_bundle.html',True)):
        if iframe:
            s=open('/home/claude/quiz/Quiz__Eletrost_tica_3.html',encoding='utf-8').read()
            open('wrap_bundle.html','w',encoding='utf-8').write('<!doctype html><iframe id="f" style="width:390px;height:800px" sandbox="allow-scripts allow-modals allow-popups" srcdoc="'+html.escape(s,quote=True)+'"></iframe>')
        for mode,btn in (('estudo','#go'),('cronometrado','#go2'),('simulado','#mopen')):
            pg=b.new_page(viewport={'width':400,'height':820}); errs=[]
            pg.on('pageerror',lambda e:errs.append(str(e)))
            pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
            pg.goto(url); pg.wait_for_timeout(500)
            fr=pg.frame_locator('#f') if iframe else pg
            if iframe: fr.locator('[data-q=fluidos]').click(); pg.wait_for_timeout(400)
            play(pg,fr,btn,False,name+' / '+mode,errs)
            pg.close()
    b.close()
