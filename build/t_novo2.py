from playwright.sync_api import sync_playwright
B='http://localhost:8123/'
bad=[]
def ck(c,m):
    if not c:bad.append(m)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':400,'height':820});errs=[]
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(B+'index.html');pg.wait_for_timeout(1200)
    ck(pg.locator('#metabar').is_visible(),'meta visível')
    ck('0 de 10' in pg.inner_text('#metabar .mt'),'meta 0 de 10')
    pg.locator('#metabar button[data-g="5"]').click()
    ck('de 5' in pg.inner_text('#metabar .mt'),'meta muda p/ 5')
    # offline pronto
    pg.wait_for_timeout(1500)
    ck('Pronto' in pg.inner_text('#offl'),'aviso offline pronto: '+pg.inner_text('#offl'))
    pg.goto(B+'index.html?q=fluidos#debug');pg.wait_for_timeout(600)
    # nível
    ck(pg.locator('#lvs button').count()==4,'4 botões de nível')
    tot=[pg.locator('#lvs button').nth(k).inner_text() for k in range(4)];print(tot)
    pg.locator('#lvs button').nth(3).click()
    pg.locator('#go').click();pg.wait_for_timeout(300)
    ns=pg.evaluate("__qz('order.map(function(k){return Q[k].n})')")
    ck(all(n==3 for n in ns),'só difíceis '+str(ns))
    ck(pg.locator('#count .nvl').inner_text()=='Difícil','selo difícil')
    # responder 5 e checar meta
    for k in range(5):
        pg.locator('#opts .opt').first.click();pg.wait_for_timeout(100)
        if k<4:pg.locator('#next').click();pg.wait_for_timeout(100)
    ck('Meta do dia cumprida' in pg.inner_text('#fb'),'mensagem meta cumprida')
    ck('5/5' in pg.inner_text('#mtc'),'chip 5/5: '+pg.inner_text('#mtc'))
    # animação: controles
    pg.evaluate("__qz('order=Q.map(function(d,k){return k}).filter(function(k){return Q[k].an});i=0;show()')");pg.wait_for_timeout(200)
    pg.locator('#opts .opt').first.click();pg.wait_for_timeout(400)
    ck(pg.locator('#fb .anp').is_visible(),'botão pausar')
    ck(pg.locator('#fb .antx').count()==1,'descrição em texto')
    pg.locator('#fb .anp').click();t1=pg.evaluate("document.querySelector('#fb .anim svg').getAnimations({subtree:true})[0].currentTime");pg.wait_for_timeout(500)
    t2=pg.evaluate("document.querySelector('#fb .anim svg').getAnimations({subtree:true})[0].currentTime")
    ck(abs(t2-t1)<30,'pausou %s %s'%(t1,t2))
    pg.evaluate("var r=document.querySelector('#fb .anrg');r.value=2000;r.dispatchEvent(new Event('input'))")
    t3=pg.evaluate("document.querySelector('#fb .anim svg').getAnimations({subtree:true})[0].currentTime")
    ck(abs(t3-2000)<30,'slider move a animação %s'%t3)
    pg.locator('#fb .anp').click();pg.wait_for_timeout(300)
    t4=pg.evaluate("document.querySelector('#fb .anim svg').getAnimations({subtree:true})[0].currentTime");ck(t4>2200,'retomou %s'%t4)
    ck(pg.evaluate("document.querySelector('#fb .antx p').textContent.startsWith('Animação')"),'texto descrição')
    # reduced motion: sem controles
    pg2=ctx.new_page();pg2.emulate_media(reduced_motion='reduce');pg2.goto(B+'index.html?q=termo#debug');pg2.wait_for_timeout(500)
    pg2.locator('#go').click();pg2.wait_for_timeout(200)
    pg2.evaluate("__qz('order=Q.map(function(d,k){return k}).filter(function(k){return Q[k].an});i=0;show()')");pg2.wait_for_timeout(200)
    pg2.locator('#opts .opt').first.click();pg2.wait_for_timeout(300)
    ck(not pg2.locator('#fb .anp').is_visible(),'sem controles com movimento reduzido')
    ck(pg2.locator('#fb .antx summary').is_visible(),'descrição visível c/ movimento reduzido')
    # OFFLINE de verdade
    pg3=ctx.new_page()
    pg3.goto(B+'index.html?q=eletro#debug');pg3.wait_for_timeout(1500)
    ctx.set_offline(False);pg3.wait_for_timeout(100);ctx.set_offline(True);pg3.reload();pg3.wait_for_timeout(1200)
    ck(pg3.locator('#go').is_visible(),'offline: tela inicial do quiz abre')
    pg3.locator('#go').click();pg3.wait_for_timeout(300)
    pg3.evaluate("__qz('order=Q.map(function(d,k){return k}).filter(function(k){return Q[k].an});i=0;show()')");pg3.wait_for_timeout(200)
    pg3.locator('#opts .opt').first.click();pg3.wait_for_timeout(400)
    ck(pg3.locator('#fb .anim svg').count()==1,'offline: animação carrega')
    pg3.goto(B+'index.html');pg3.wait_for_timeout(600)
    ck(pg3.locator('#landing').is_visible(),'offline: landing abre')
    ctx.set_offline(False)
    print('erros',errs);print('falhas',bad);b.close()
raise SystemExit(1 if bad or errs else 0)
