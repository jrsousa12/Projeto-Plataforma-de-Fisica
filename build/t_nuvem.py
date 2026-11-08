import json,urllib.request
from playwright.sync_api import sync_playwright
B='http://localhost:8123/';FB='http://127.0.0.1:8124'
CFG='window.NUVEM_CONFIG={apiKey:"k",projectId:"p",authBase:"%s/v1",tokenBase:"%s/v1",fsBase:"%s/v1"};'%(FB,FB,FB)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=__import__('os').environ.get('CHROME_PATH') or None,args=['--no-sandbox']);errs=[]
    def novo(cfg=CFG):
        ctx=b.new_context(viewport={'width':400,'height':820});ctx.route('**/firebase-config.js',lambda r:r.fulfill(body=cfg,content_type='application/javascript'))
        pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'favicon' not in m.text and 'status of 40' not in m.text else None);return ctx,pg
    def jogar(pg):
        pg.fill('#nick','Ana');pg.click('#go');pg.wait_for_timeout(200)
        for k in range(10):
            if pg.locator('#num').count(): pg.locator('#num').fill('0');pg.locator('#nsend').click()
            else: pg.locator('#opts .opt').nth(pg.locator('#opts .opt').count()-1).click()
            pg.wait_for_timeout(60)
            if pg.locator('#next:not(.hidden)').count(): pg.locator('#next').click();pg.wait_for_timeout(80)
        pg.wait_for_timeout(300)
    def desemp(pg):
        pg.goto('about:blank');pg.goto(B+'index.html?q=fluidos');pg.evaluate("(()=>{const o=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(!/sess$/.test(k))o.call(this,k,v)};Object.keys(localStorage).filter(k=>/sess$/.test(k)).forEach(k=>localStorage.removeItem(k))})()");pg.goto(B+'index.html?q=fluidos');pg.wait_for_timeout(500);pg.click('#bnav [data-v=hist]');pg.click('.htab[data-p="2"]');pg.wait_for_timeout(300)
    # aparelho A
    cA,A=novo();A.goto(B+'index.html?q=fluidos');A.wait_for_timeout(500);jogar(A);jogar_ok=True
    A.evaluate("document.getElementById('homebtn').click()");A.wait_for_timeout(200)
    nA=A.evaluate("Object.keys(JSON.parse(localStorage.getItem('eletriz:perfil')||'{}')).length");print('A: perguntas registradas',nA)
    desemp(A)
    t=A.inner_text('#perfilbox');print('A: tem O que melhorar:','O que melhorar' in t,'| treinar piores:',A.locator('#trpior').count());A.screenshot(path='/tmp/conta.png',full_page=True)
    A.fill('#ncod','abcd-2345');A.click('#nent');A.wait_for_timeout(1200);print('A entrar:',A.inner_text('#nmsg'))
    bkA=A.evaluate("localStorage.getItem('fluidos:book')");print('A caderno:',len(json.loads(bkA)) if bkA else 0)
    A.wait_for_timeout(500)
    docs=json.loads(urllib.request.urlopen(FB+'/__docs').read());print('documentos na nuvem:',list(docs.keys()))
    # aparelho B (vazio) entra com o mesmo código
    cB,Bp=novo();Bp.goto(B+'index.html?q=fluidos');Bp.wait_for_timeout(400);Bp.click('#bnav [data-v=hist]');Bp.click('.htab[data-p="2"]');Bp.wait_for_timeout(300)
    Bp.fill('#ncod','ABCD2345');Bp.click('#nent');Bp.wait_for_timeout(1500);print('B entrar:',Bp.inner_text('#nmsg') if Bp.locator('#nmsg').count() else '(tela recarregada)')
    print('B perfil:',Bp.evaluate("Object.keys(JSON.parse(localStorage.getItem('eletriz:perfil')||'{}')).length"),'| caderno:',len(json.loads(Bp.evaluate("localStorage.getItem('fluidos:book')||'{}'"))),'| hist:',len(json.loads(Bp.evaluate("localStorage.getItem('fluidos:hist')||'[]'"))))
    # código errado em outro usuário não vê dados
    cC,C=novo();C.goto(B+'index.html?q=fluidos');C.wait_for_timeout(400);C.click('#bnav [data-v=hist]');C.click('.htab[data-p="2"]');C.fill('#ncod','ZZZZ-9999');C.click('#nent');C.wait_for_timeout(1200)
    print('C (outro código) perfil vazio:',C.evaluate("localStorage.getItem('eletriz:perfil')")in(None,'{}'))
    # sem configuração
    cD,D=novo('window.NUVEM_CONFIG={apiKey:"",projectId:""};');D.goto(B+'index.html?q=fluidos');D.wait_for_timeout(400);D.click('#bnav [data-v=hist]');D.click('.htab[data-p="2"]');D.wait_for_timeout(300)
    print('D sem config, sem campo de código:',D.locator('#ncod').count()==0)
    print('erros',errs);b.close()
