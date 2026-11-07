# Uso: python3 captura_real.py ID [ID...]  (qualquer área: q=Eletro, f=Fluidos, t=Termo; mistura permitida)
from playwright.sync_api import sync_playwright
import sys
AREA={'q':'eletro','f':'fluidos','t':'termo','o':'onda','p':'optica'}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for qid in sys.argv[1:]:
        pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        pg.goto('http://localhost:8123/index.html?q=%s#debug'%AREA[qid[0]]);pg.wait_for_timeout(500)
        pg.locator('#go').click();pg.wait_for_timeout(300)
        pg.evaluate("__qz('order=[Q.findIndex(function(d){return d.id===\"%s\"})];i=0;show()')"%qid);pg.wait_for_timeout(200)
        if pg.locator('#opts .opt').count(): pg.locator('#opts .opt').nth(0).click()
        else: pg.locator('#num').fill('1');pg.locator('#nsend').click()
        pg.wait_for_timeout(300)
        if not pg.locator('#fb .anim').count(): print(qid,'sem animacao');pg.close();continue
        pg.evaluate("document.querySelector('#fb .anim').scrollIntoView()")
        for t in (3,9):
            pg.evaluate("t=>{document.querySelectorAll('#fb .anim svg').forEach(s=>s.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=t*1000*1.7}))}",t)
            pg.wait_for_timeout(150)
            pg.locator('#fb .anim').screenshot(path='/tmp/real_%s_%d.png'%(qid,t))
        pg.close()
    b.close()
