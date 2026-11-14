"""Sessão (app-sessao.js): quiz pausado ao abrir Fontes volta sozinho na mesma pergunta ao recarregar a página;
sessão velha (mais de 12 h) não é oferecida."""
import os
from playwright.sync_api import sync_playwright
from navegador import abrir
def responder(f):
    if f.locator('#num').count(): f.locator('#num').fill('1'); f.locator('#nsend').click()
    else: f.locator('#opts .opt').nth(0).click()
    f.wait_for_timeout(150)
    if f.locator('#next:not(.hidden)').count(): f.locator('#next').click(); f.wait_for_timeout(200)
with sync_playwright() as p:
    b=abrir(p)
    pg=b.new_page(viewport={'width':800,'height':1000}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    for q in ('termo','mec'):
        u='http://localhost:8123/index.html?q=%s'%q
        pg.goto(u); pg.wait_for_timeout(500)
        pg.locator('#go').click(); pg.wait_for_timeout(300)
        responder(pg); pg.wait_for_timeout(300); atual=pg.locator('#q').inner_text()
        pg.evaluate('QzFonte.abrir()'); pg.wait_for_timeout(300)
        assert pg.locator('#fontes:not(.hidden)').count()==1 and pg.locator('#fvolta').is_visible()
        pg.goto(u); pg.wait_for_timeout(500)
        print(q,'|',pg.url)
        assert pg.locator('#quiz').is_visible(), 'não retomou ao recarregar'
        assert pg.locator('#q').inner_text()==atual, ('não retomou na mesma pergunta', atual[:60], pg.locator('#q').inner_text()[:60])
        # sessão com mais de 12 h: botão some
        pg.evaluate('QzFonte.abrir()'); pg.wait_for_timeout(200)
        pg.evaluate("""()=>{for(var k in localStorage){var v=localStorage.getItem(k);
          if(/sess/.test(k)&&v&&v.indexOf('"v":2')>=0){var S=JSON.parse(v);S.at-=13*3600e3;localStorage.setItem(k,JSON.stringify(S));}}}""")
        pg.goto(u); pg.wait_for_timeout(500)
        assert pg.locator('#home').is_visible() and pg.locator('#retq.hidden').count()==1, 'sessão velha ainda oferecida'
        pg.evaluate('localStorage.clear()')
    print('erros',errs); assert not errs; b.close()
