import json
from playwright.sync_api import sync_playwright
B='http://localhost:8123/'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox']);errs=[]
    def novo(ctx=None):
        ctx=ctx or b.new_context(viewport={'width':400,'height':820},accept_downloads=True)
        pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'favicon' not in m.text else None);return ctx,pg
    reqs=[]
    ctx,pg=novo();pg.on('request',lambda r:reqs.append(r.url))
    pg.goto(B+'index.html?q=eletro');pg.wait_for_timeout(600)
    html=pg.content();print('sem sala ao vivo:','Sala ao vivo' not in html and 'salalink' not in html)
    # rodada errando de propósito
    pg.fill('#nick','Ana');pg.click('#go');pg.wait_for_timeout(200)
    for k in range(10):
        if pg.locator('#num').count(): pg.locator('#num').fill('0');pg.locator('#nsend').click()
        else: pg.locator('#opts .opt').nth(pg.locator('#opts .opt').count()-1).click()
        pg.wait_for_timeout(60)
        if pg.locator('#next:not(.hidden)').count(): pg.locator('#next').click();pg.wait_for_timeout(80)
    pg.wait_for_timeout(300)
    pg.evaluate("document.getElementById('homebtn').click()");pg.wait_for_timeout(200)
    pg.click('#bnav [data-v=book]');pg.wait_for_timeout(300)
    n=pg.locator('#bookbody .rv').count();print('erros no caderno:',n)
    pg.click('#btrain');pg.wait_for_timeout(300);print('treino dos erros iniciou:',pg.locator('#quiz:not(.hidden)').count())
    pg.goto('about:blank');pg.goto(B+'index.html?q=eletro');pg.evaluate("(()=>{const o=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(!/sess$/.test(k))o.call(this,k,v)};Object.keys(localStorage).filter(k=>/sess$/.test(k)).forEach(k=>localStorage.removeItem(k))})()");pg.goto(B+'index.html?q=eletro');pg.wait_for_timeout(500)
    pg.click('#bnav [data-v=hist]');pg.click('.htab[data-p="2"]');pg.wait_for_timeout(300)
    pg.wait_for_timeout(300);t=pg.inner_text('#perfilbox') if pg.locator('#perfilbox').count() else '';print('perfil sem nuvem:','nuvem' not in t.lower(), '| tem treino adaptativo:','adaptativo' in t.lower())
    ext=[u for u in reqs if not u.startswith(B) and not u.startswith('data:')];print('requisições externas:',ext)
    # editor -> arquivo para alunos
    ctx2,ed=novo();ed.goto(B+'editor.html');ed.wait_for_timeout(500)
    ed.click('#enova');ed.select_option('#ft','el') if ed.locator('#ft option[value=el]').count() else None
    ed.fill('#fq','Pergunta nova do professor?')
    for i,t in enumerate(['A','B','C','D']): ed.locator('.fo').nth(i).fill(t)
    ed.locator('input[name=fa]').nth(2).check();ed.fill('#fe','Explicação.');ed.click('#fs');ed.wait_for_timeout(300)
    with ed.expect_download() as d: ed.click('#epub')
    path=d.value.path();txt=open(path,encoding='utf-8').read();print('arquivo gerado:',txt[:90].replace('\n',' '))
    # aluno novo recebe o banco publicado
    ctx3,al=novo()
    al.route('**/banco-proprio.js',lambda r:r.fulfill(body=txt,content_type='application/javascript'))
    al.goto(B+'index.html?q=eletro');al.wait_for_timeout(600)
    print('aluno vê pergunta publicada:',al.evaluate("BANKS.eletro.some(d=>d.q==='Pergunta nova do professor?')"))
    print('erros',errs);b.close()
