"""Histórico: joga uma rodada completa e confere se a pontuação gravada é a mesma da tela final,
se a tela "Meu desempenho" mostra a rodada e se "Apagar histórico" limpa tudo."""
import json,os,re
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None,args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':800,'height':1000}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8123/index.html?q=eletro'); pg.wait_for_timeout(500)
    pg.click('#go'); pg.wait_for_timeout(300); n=0
    while pg.locator('#end:not(.hidden)').count()==0 and n<40:
        n+=1
        if pg.locator('#num').count(): pg.fill('#num','1'); pg.click('#nsend')
        else: pg.locator('#opts .opt').nth(0).click()
        pg.wait_for_timeout(100)
        if pg.locator('#next:not(.hidden)').count(): pg.click('#next'); pg.wait_for_timeout(120)
    pg.wait_for_timeout(900)
    final=pg.inner_text('#final')
    hist=pg.evaluate("()=>{for(var k in localStorage) if(/hist$/.test(k)) return JSON.parse(localStorage[k]); return null}")
    if isinstance(hist,dict) and 'v' in hist: hist=hist['v']
    assert hist and len(hist)==1, 'histórico deveria ter 1 rodada: %r'%hist
    h=hist[-1]; nums=[int(x) for x in re.findall(r'\d+',final)]
    print('final:',final.replace('\n',' ')[:80],'| gravado: %d/%d'%(h['s'],h['n']))
    assert h['n']==10 and h['s'] in nums, 'pontuação gravada (%d/%d) não aparece na tela final'%(h['s'],h['n'])
    pg.evaluate("document.getElementById('hopen').click()"); pg.wait_for_timeout(400)
    corpo=pg.inner_text('#histbody'); print('tela desempenho:',len(corpo),'caracteres | html',pg.evaluate("document.getElementById('histbody').innerHTML.length"),'| classe',pg.get_attribute('#hist','class'))
    assert pg.locator('#hist:not(.hidden)').count() and len(corpo)>20, 'tela de desempenho vazia'
    pg.click('#hclear'); pg.wait_for_timeout(300)
    resto=pg.evaluate("()=>{for(var k in localStorage) if(/hist$/.test(k)) return localStorage[k]; return null}")
    print('após apagar:',resto)
    assert not resto or resto in ('[]','null'), 'histórico não foi apagado'
    print('erros',errs); b.close()
