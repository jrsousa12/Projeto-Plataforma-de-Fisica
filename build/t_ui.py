from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=__import__('os').environ.get('CHROME_PATH') or None,args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':400,'height':820}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    def st(): return pg.evaluate('()=>[document.documentElement.className,document.documentElement.getAttribute("data-theme"),document.documentElement.getAttribute("data-pal")]')
    pg.goto('http://localhost:8123/index.html'); pg.wait_for_timeout(400)
    print('landing antes',st(),'nav visível',pg.locator('#navb').is_visible())
    pg.evaluate("document.getElementById('mnu').getAttribute('aria-expanded')==='false'&&document.getElementById('mnu').click()"); pg.click('#fz'); pg.click('#th'); pg.click('#pal'); print('landing depois',st())
    pg.click('[data-q=fluidos]'); pg.wait_for_timeout(500)
    print('apos boot',st(),'voltar visível',pg.locator('#back').is_visible(),'início oculto',not pg.locator('#homebtn').is_visible())
    pg.evaluate("document.getElementById('mnu').getAttribute('aria-expanded')==='false'&&document.getElementById('mnu').click()"); pg.click('#fz'); pg.click('#th'); pg.click('#pal'); print('no quiz',st())
    pg.screenshot(path='/tmp/home_back.png')
    pg.click('#go'); pg.wait_for_timeout(300); print('em jogo: início visível',pg.locator('#homebtn').is_visible())
    pg.click('#back'); pg.wait_for_timeout(200); print('modal sair:',pg.locator('#exitq:not(.hidden)').count())
    pg.goto('about:blank'); pg.goto('http://localhost:8123/index.html?q=eletro'); pg.wait_for_timeout(400)
    print('reabrir persiste',st()); pg.click('#back'); pg.wait_for_timeout(500)
    print('voltar -> landing:',pg.locator('#landing').is_visible(),pg.url)
    print('erros',errs); b.close()
