from playwright.sync_api import sync_playwright
B='http://localhost:8123/'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    errs=[];tot=0;bad=[]
    for q in ('eletro','fluidos','termo','onda','optica'):
        pg=b.new_page(viewport={'width':400,'height':820})
        pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.goto(B+'index.html?q='+q+'#debug');pg.wait_for_timeout(500)
        pg.locator('#go').click();pg.wait_for_timeout(300)
        n=pg.evaluate("__qz('Q.filter(function(d){return d.an}).length')")
        pg.evaluate("__qz('order=Q.map(function(d,k){return k}).filter(function(k){return Q[k].an});i=0;show()')")
        pg.wait_for_timeout(200)
        for k in range(n):
            id_=pg.evaluate("__qz('Q[order[i]].id')");an=pg.evaluate("__qz('Q[order[i]].an')")
            pg.locator('#opts .opt').nth(k%4 if False else 0).click();pg.wait_for_timeout(120)
            has=pg.locator('#fb .anim svg').count()
            nodes=pg.evaluate("document.querySelectorAll('#fb .anim svg *').length")
            if not has or nodes<5:bad.append((q,id_,an,has,nodes))
            pg.screenshot(path='/tmp/an_%s_%s.png'%(q,id_)) if k==0 else None
            if pg.locator('#fb .anr').count():pg.locator('#fb .anr').click()
            if pg.locator('#next:not(.hidden)').count():pg.locator('#next').click();pg.wait_for_timeout(80)
        tot+=n;print(q,'questões com animação:',n)
        # nenhuma pergunta sem 'an' mostra animação
        pg.close()
    print('falhas:',bad);print('erros',[e for e in errs if '404' not in e]);b.close()
    raise SystemExit(1 if bad or [e for e in errs if '404' not in e] else 0)
