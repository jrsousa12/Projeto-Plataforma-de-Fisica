"""Folha de exercícios: deixa só uma área marcada na tela inicial e confere se a lista
traz apenas questões dessa área (as áreas marcadas mudam com o uso; a folha deve ler o valor atual)."""
import os
from playwright.sync_api import sync_playwright
from navegador import abrir
with sync_playwright() as p:
    b=abrir(p)
    pg=b.new_page(viewport={'width':800,'height':1000}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    for q in ('eletro','termo'):
        pg.goto('http://localhost:8123/index.html?q='+q); pg.wait_for_timeout(500)
        areas=pg.evaluate("[...document.querySelectorAll('#chips [data-a]')].map(b=>b.getAttribute('data-a'))")
        alvo=areas[-1]
        for a in areas[:-1]: pg.click('#chips [data-a="%s"]'%a)
        pg.evaluate("document.getElementById('sopen').click()"); pg.wait_for_timeout(400)
        pg.select_option('#sn','15'); pg.wait_for_timeout(300)
        r=pg.evaluate("""(q)=>{var m={};window.BANKS[q].forEach(d=>m[d.q]=d.t);
          var ok=0,fora=[];document.querySelectorAll('#sheetbody .sq > p:first-child').forEach(p=>{
            var t=p.textContent.replace(/^\\d+\\.\\s*/,''); if(t in m){ if(m[t]==ALVO) ok++; else fora.push(m[t]); }});
          return {ok:ok,fora:fora,total:document.querySelectorAll('#sheetbody .sq').length}}""".replace('ALVO',repr(alvo)),q)
        print(q,'área',alvo,'| questões:',r['total'],'| da área:',r['ok'],'| de outras áreas:',r['fora'])
        assert r['total']>0 and r['ok']>0 and not r['fora'], 'folha trouxe questões de áreas desmarcadas'
        # remarca uma área e confere que a folha passa a aceitá-la (valor atual, não cópia antiga)
        pg.click('#sback'); pg.click('#chips [data-a="%s"]'%areas[0])
        pg.evaluate("document.getElementById('sopen').click()"); pg.wait_for_timeout(400)
        cab=pg.inner_text('#sheetbody'); nome=pg.evaluate("a=>window.QUIZZES[a[0]].areas[a[1]]",[q,areas[0]])
        print('  após remarcar',repr(nome),'aparece no cabeçalho:',nome in cab)
        assert nome in cab, 'folha não viu a área remarcada'
    print('erros',errs); b.close()
