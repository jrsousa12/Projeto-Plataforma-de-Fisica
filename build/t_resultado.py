"""Resultado (app-resultado.js): joga uma rodada cronometrada e confere a tela final: % de acerto, bolinhas das 10
perguntas, desempenho por área, revisão só das erradas, botão Refazer e o ranking do cronometrado."""
import os,re
from playwright.sync_api import sync_playwright
from navegador import abrir
with sync_playwright() as p:
    b=abrir(p)
    pg=b.new_page(viewport={'width':800,'height':1000}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8123/index.html?q=mec'); pg.wait_for_timeout(500)
    pg.click('#go2'); pg.wait_for_timeout(300); n=0
    while pg.locator('#end:not(.hidden)').count()==0 and n<40:
        n+=1
        if pg.locator('#num').count(): pg.fill('#num','1'); pg.click('#nsend')
        else: pg.locator('#opts .opt').nth(0).click()
        pg.wait_for_timeout(100)
        if pg.locator('#next:not(.hidden)').count(): pg.click('#next'); pg.wait_for_timeout(120)
    pg.wait_for_timeout(900)
    ok=pg.locator('#rdots .rd.ok').count(); bad=pg.locator('#rdots .rd.bad').count()
    print('certas',ok,'erradas',bad,'|',pg.inner_text('#rpct'),'|',pg.inner_text('#s1'))
    assert ok+bad==10, 'deveria ter 10 bolinhas'
    assert pg.inner_text('#s1')=='%d de 10'%ok, 'contagem de acertos diferente das bolinhas'
    assert re.match(r'\d+% de acerto',pg.inner_text('#rpct')) and pg.inner_text('#rtitle'), 'nota/medalha vazia'
    assert pg.locator('#areas .ab').count()>=1, 'desempenho por área vazio'
    assert pg.locator('#rev .rv').count()==bad, 'revisão deveria listar só as erradas'
    assert pg.locator('#redo').is_hidden()==(bad==0), 'botão Refazer errado'
    assert pg.locator('#rank2 li').count()==1, 'cronometrado não entrou no ranking'
    print('erros',errs); assert not errs; b.close()
