from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=__import__('os').environ.get('CHROME_PATH') or None,args=['--no-sandbox']);pg=b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8123/editor.html');pg.wait_for_timeout(400);pg.fill('#cn','30');pg.click('#cg')
    t=pg.eval_on_selector_all('#clist b','e=>e.map(x=>x.textContent)');import re
    print('códigos:',len(t),'únicos:',len(set(t)),'formato ok:',all(re.fullmatch(r'[A-Z2-9]{4}-[A-Z2-9]{4}',x) for x in t),'exemplo:',t[0],'erros',errs)
