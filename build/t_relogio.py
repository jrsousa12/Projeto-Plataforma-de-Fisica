"""Relógio (app-relogio.js): no cronometrado a barra da pergunta diminui e, ao acabar o tempo, conta como "Tempo esgotado";
no modo estudo o relógio anda, o botão Pausar congela e Continuar retoma."""
import os
from playwright.sync_api import sync_playwright
def larg(pg): return pg.evaluate("parseFloat(document.getElementById('tfill').style.width)")
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None,args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':800,'height':1000}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.clock.install()
    pg.goto('http://localhost:8123/index.html?q=mec'); pg.wait_for_timeout(500)
    # cronometrado
    pg.click('#go2'); pg.clock.run_for(1000)
    assert pg.locator('#tbar').is_visible(), 'barra de tempo não apareceu'
    w1=larg(pg); pg.clock.run_for(3000); w2=larg(pg)
    assert w1==w1 and w2==w2 and 0<w2<w1<=100, ('barra de tempo não diminui', w1, w2)
    pg.clock.run_for(90000)
    assert 'Tempo esgotado' in pg.inner_text('#fb'), 'tempo da pergunta não esgotou'
    # modo estudo (página nova, sem a rodada anterior salva): pausar congela o relógio
    pg=b.new_page(viewport={'width':800,'height':1000}); pg.on('pageerror',lambda e:errs.append(str(e))); pg.clock.install()
    pg.goto('http://localhost:8123/index.html?q=mec'); pg.wait_for_timeout(500)
    pg.click('#go'); pg.clock.run_for(3000)
    assert pg.locator('#tbar').is_hidden() and pg.inner_text('#tm')!='00:00', 'relógio do estudo não andou'
    pg.click('#tpause'); t=pg.inner_text('#tm'); pg.clock.run_for(5000)
    assert pg.inner_text('#tm')==t, 'pausa não congelou o relógio'
    pg.click('#tpause'); pg.clock.run_for(2000)
    assert pg.inner_text('#tm')!=t, 'Continuar não retomou o relógio'
    print('erros',errs); assert not errs; b.close()
