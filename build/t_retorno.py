"""Retorno depois de responder (app-retorno.js, app-animacao.js, app-numeros.js): resposta errada mostra
"Não foi dessa vez", "Você marcou" e a animação com controles; a numérica recusa texto sem número e aceita
notação científica (2,5 × 10⁴); o botão diz "Próxima pergunta" e, na última, "Ver resultado"."""
import os
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None,args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':400,'height':820}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8123/index.html?q=mec#debug'); pg.wait_for_timeout(500)
    pg.click('#go'); pg.wait_for_timeout(300)
    # 1) múltipla escolha com animação, marcando uma alternativa errada; rodada de 2 perguntas
    ix=pg.evaluate("__qz('Q.findIndex(function(d){return d.an&&!d.g&&ANIM[d.an]})')")
    assert ix>=0, 'mec sem questão com animação'
    num=pg.evaluate("__qz('Q.findIndex(function(d){return d.g})')"); assert num>=0, 'mec sem questão numérica'
    pg.evaluate("__qz('order=[%d,%d];i=0;res=[];show()')"%(ix,num)); pg.wait_for_timeout(200)
    k=pg.evaluate("__qz('perm.findIndex(function(o){return o!==Q[order[i]].a})')")
    pg.locator('#opts .opt').nth(k).click(); pg.wait_for_timeout(300)
    t=pg.inner_text('#fb'); print('errada:',t[:80].replace('\n',' | '))
    assert pg.locator('#fb .fb.no').count()==1 and 'Não foi dessa vez' in t, 'faltou "Não foi dessa vez"'
    assert 'Você marcou' in t, 'faltou "Você marcou"'
    assert pg.locator('#fb .anim svg').count()==1 and pg.locator('#fb .anim .anp').count()==1, 'animação sem controles'
    pg.click('#fb .anim .anp'); assert 'Continuar' in pg.inner_text('#fb .anim .anp'), 'botão pausar não pausou'
    assert pg.inner_text('#next')=='Próxima pergunta', 'botão deveria ser "Próxima pergunta"'
    assert pg.locator('#hbtn').is_hidden() and pg.locator('#fonteq').is_visible(), 'dica/fonte errados após responder'
    # 2) numérica: texto sem número é recusado; notação científica é aceita
    pg.click('#next'); pg.wait_for_timeout(300)
    pg.fill('#num','abc'); pg.click('#nsend'); pg.wait_for_timeout(100)
    assert pg.locator('#numerr').count()==1, 'não avisou número inválido'
    v=pg.evaluate("__qz('NU.sc(G.ans)')"); print('numérica: digitado',v)
    pg.fill('#num',v); pg.click('#nsend'); pg.wait_for_timeout(300)
    t=pg.inner_text('#fb')
    assert pg.locator('#numerr').count()==0, 'aviso de número inválido não sumiu'
    assert pg.locator('#fb .fb:not(.no)').count()==1 and 'Correto' in t and 'Resposta:' in t, 'numérica não foi aceita: '+t[:80]
    assert pg.inner_text('#next')=='Ver resultado', 'na última deveria ser "Ver resultado"'
    assert pg.evaluate("__qz('score')")==1, 'pontuação errada'
    print('erros',errs); assert not errs; b.close()
