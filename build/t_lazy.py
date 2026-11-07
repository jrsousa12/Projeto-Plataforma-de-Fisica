from playwright.sync_api import sync_playwright
B='http://localhost:8123/'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);errs=[]
    for q in ('eletro','fluidos','termo','onda','optica',None):
        pg=b.new_context().new_page();reqs=[];pg.on('request',lambda r:reqs.append(r.url.split('/')[-1].split('?')[0]))
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto(B+'index.html'+('?q='+q if q else ''));pg.wait_for_timeout(900)
        arq=sorted(x for x in reqs if x.startswith(('perguntas','quiz-','figuras')))
        n=pg.evaluate("(window.BANKS&&Object.keys(BANKS).map(k=>k+':'+BANKS[k].length).join(','))||'-'")
        print(q or 'landing','-> carregou:',arq,'| bancos:',n,'| tela de quiz:',pg.locator('#home:not(.hidden)').count())
    print('erros',errs);b.close()
