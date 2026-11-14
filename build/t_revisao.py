"""Rever perguntas anteriores (app-revisao.js): no modo estudo, responde duas perguntas, usa
"← Anterior", navega entre as já respondidas e volta à pergunta atual."""
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
        pg.goto('http://localhost:8123/index.html?q=%s'%q); pg.wait_for_timeout(500)
        pg.locator('#go').click(); pg.wait_for_timeout(300)
        assert pg.locator('#prev.hidden').count()==1, 'Anterior visível na 1ª pergunta'
        responder(pg); responder(pg)
        atual=pg.locator('#q').inner_text()
        pg.locator('#prev').click(); pg.wait_for_timeout(200)
        h=pg.locator('#rvw .rvh').inner_text(); print(q,'|',h)
        assert h.startswith('Revendo pergunta 2 de 10'), h
        assert pg.locator('#quiz.revmode').count()==1 and pg.locator('#rvp').inner_text().strip()
        assert pg.locator('#rvf').is_disabled() and not pg.locator('#rvb').is_disabled()
        assert 'Voltar à pergunta 3' in pg.locator('#rvx').inner_text()
        pg.locator('#rvb').click(); pg.wait_for_timeout(150)
        assert pg.locator('#rvw .rvh').inner_text().startswith('Revendo pergunta 1 de 10')
        assert pg.locator('#rvb').is_disabled() and not pg.locator('#rvf').is_disabled()
        pg.locator('#rvf').click(); pg.wait_for_timeout(150)
        assert pg.locator('#rvw .rvh').inner_text().startswith('Revendo pergunta 2 de 10')
        pg.locator('#rvx').click(); pg.wait_for_timeout(150)
        assert pg.locator('#rvw.hidden').count()==1 and pg.locator('#quiz.revmode').count()==0
        assert pg.locator('#q').inner_text()==atual, 'não voltou à pergunta atual'
    print('erros',errs); assert not errs; b.close()
