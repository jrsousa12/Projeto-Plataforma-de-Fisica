"""Navegação entre telas (app-telas.js): endereço #nome muda a tela, voltar do navegador e botão ← funcionam,
sair do quiz pede confirmação (Ficar / Sair) e Esc fecha o aviso."""
import os
from playwright.sync_api import sync_playwright
from navegador import abrir
def vis(pg,s): return pg.locator(s+':not(.hidden)').count()==1
with sync_playwright() as p:
    b=abrir(p)
    pg=b.new_page(viewport={'width':800,'height':1000}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8123/index.html?q=mec'); pg.wait_for_timeout(500)
    assert vis(pg,'#home') and pg.locator('#homebtn').is_hidden()
    for h,s in (('caderno','#book'),('lista','#sheet'),('desempenho','#hist'),('cartoes','#cards')):
        pg.evaluate("location.hash='#%s'"%h); pg.wait_for_timeout(300)
        assert vis(pg,s), ('endereço não abriu', h)
    pg.go_back(); pg.wait_for_timeout(300); assert vis(pg,'#hist'), 'voltar do navegador falhou'
    pg.click('#back'); pg.wait_for_timeout(300); assert vis(pg,'#sheet'), 'botão ← falhou'
    pg.evaluate("location.hash='#inicio'"); pg.wait_for_timeout(300); assert vis(pg,'#home')
    # durante o quiz: voltar pede confirmação
    pg.click('#go'); pg.wait_for_timeout(300); assert pg.url.endswith('#quiz') and pg.locator('#homebtn').is_visible()
    pg.click('#back'); pg.wait_for_timeout(200); assert vis(pg,'#exitq'), 'aviso de sair não apareceu'
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    assert not vis(pg,'#exitq') and pg.locator('#quiz').is_visible(), 'Esc não fechou o aviso'
    pg.go_back(); pg.wait_for_timeout(300)
    assert vis(pg,'#exitq') and pg.locator('#quiz').is_visible(), 'voltar do navegador saiu do quiz sem perguntar'
    pg.click('#exleave'); pg.wait_for_timeout(300); assert vis(pg,'#home'), 'Sair não voltou ao início'
    print('erros',errs); assert not errs; b.close()
