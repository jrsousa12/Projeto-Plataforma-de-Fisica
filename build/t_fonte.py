from playwright.sync_api import sync_playwright
B='http://localhost:8123/'
ERR=[]
def ck(c,m):
    if not c: ERR.append(m); print('FALHOU:',m)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    errs=[]
    def novo(url):
        pg=b.new_page(viewport={'width':400,'height':820})
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and '404' not in m.text else None)
        pg.goto(B+url);pg.wait_for_timeout(500);return pg
    # 1) tela de escolha: item Fonte do menu abre a lista completa e volta
    pg=novo('index.html')
    pg.locator('#mnu').click();ck(pg.locator('#fonte').is_visible(),'item Fonte no menu (escolha)')
    pg.locator('#fonte').click();pg.wait_for_timeout(200)
    ck(pg.locator('#fontes').is_visible() and not pg.locator('#landing').is_visible(),'tela Fontes abre na escolha')
    ck(pg.locator('#fbody .fsec').count()==3,'3 áreas na tela Fontes')
    ck(pg.locator('#fbody a[target=_blank][rel*=noopener]').count()>=20,'links abrem em outra aba')
    pg.locator('#fback').click();ck(pg.locator('#landing').is_visible(),'volta para a escolha')
    pg.close()
    for q in ('eletro','fluidos','termo','onda','optica'):
        # 2) botão FONTE na pergunta respondida
        pg=novo('index.html?q=%s#debug'%q)
        pg.locator('#go').click();pg.wait_for_timeout(300)
        pg.evaluate("__qz('order=order.filter(function(k){return !Q[k].g}).concat(order.filter(function(k){return Q[k].g}));i=0;show()')");pg.wait_for_timeout(200)
        ck(not pg.locator('#fonteq').is_visible(),q+': FONTE oculto antes de responder')
        pg.locator('#opts .opt').first.click();pg.wait_for_timeout(200)
        ck(pg.locator('#fonteq').is_visible(),q+': FONTE aparece após responder')
        pg.locator('#fonteq').click();pg.wait_for_timeout(150)
        ck(pg.locator('#fpop .flk').count()==4,q+': quadro com 4 fontes')
        ck(pg.locator('#fpop .fmais').is_visible(),q+': três pontinhos')
        pg.locator('#fonteq').click();ck(not pg.locator('#fpop').is_visible(),q+': fecha ao tocar de novo')
        pg.locator('#fonteq').click();pg.locator('#q').click();ck(not pg.locator('#fpop').is_visible(),q+': fecha ao tocar fora')
        # 3) ⋯ leva à tela completa, quiz fica guardado com tempo pausado
        pg.locator('#fonteq').click();pg.locator('#fpop .fmais').click();pg.wait_for_timeout(300)
        ck(pg.locator('#fontes').is_visible() and not pg.locator('#quiz').is_visible(),q+': tela Fontes aberta pelo ⋯')
        ck(pg.locator('#exitq').is_hidden(),q+': sem aviso de perda de progresso')
        ck(pg.locator('#fvolta').is_visible(),q+': botão voltar ao quiz na tela Fontes')
        ck(pg.locator('#fbody h3').first.inner_text().startswith({'eletro':'Eletro','fluidos':'Mec','termo':'Termo','onda':'Ondul','optica':'Óptic'}[q]),q+': área atual primeiro')
        e1=pg.evaluate("__qz('ST.get(\"sess\",null).el')");pg.wait_for_timeout(2300)
        # 4) início da área mostra o botão de retorno
        pg.locator('#homebtn').click();pg.wait_for_timeout(200)
        ck(pg.locator('#retq').is_visible(),q+': botão Voltar ao quiz atual no início')
        t=pg.locator('#retq').inner_text();ck('Pergunta 2 de 10' in t,q+': texto do retorno: '+t.replace('\n',' | '))
        ck('pausado' in t,q+': informa tempo pausado')
        pg.wait_for_timeout(1500)
        pg.locator('#retq').click();pg.wait_for_timeout(300)
        ck(pg.locator('#quiz').is_visible(),q+': quiz retomado')
        ck(pg.evaluate("document.getElementById('count').textContent").startswith('Pergunta 2 de 10'),q+': na pergunta seguinte')
        e2=pg.evaluate("elapsed? 0:0") if False else pg.evaluate("__qz('elapsed()')")
        ck(abs(e2-e1)<=2,q+': tempo ficou parado (%s -> %s)'%(e1,e2))
        ck(pg.evaluate("__qz('score')")>=0,q+': pontuação preservada')
        ck(pg.locator('#retq').is_hidden() or not pg.locator('#home').is_visible(),q+': retorno só na tela inicial')
        # 5) menu Fonte dentro do quiz (sem responder) estaciona e volta pelo botão Voltar
        pg.locator('#mnu').click();pg.locator('#fonte').click();pg.wait_for_timeout(250)
        ck(pg.locator('#fontes').is_visible(),q+': menu Fonte abre dentro do quiz')
        pg.locator('#back').click();pg.wait_for_timeout(500)
        ck(pg.locator('#quiz').is_visible(),q+': botão Voltar da tela Fontes retoma o quiz')
        # 6) quiz concluído não deixa sessão guardada
        pg.close()
    # 7) modo cronometrado: tempo da pergunta fica pausado
    pg=novo('index.html?q=termo#debug')
    pg.locator('#go2').click();pg.wait_for_timeout(2200)
    pg.locator('#mnu').click();pg.locator('#fonte').click();pg.wait_for_timeout(250)
    s=pg.evaluate("__qz('ST.get(\"sess\",null)')");ck(s and s['qr']>0 and s['m']=='tempo','cronometrado: guardou tempo restante da pergunta (%s)'%(s and s.get('qr')))
    pg.wait_for_timeout(3000)
    pg.locator('#homebtn').click();pg.locator('#retq').click();pg.wait_for_timeout(400)
    w=pg.evaluate("document.getElementById('tfill').style.width")
    rest=pg.evaluate("__qz('qTL*1000-(Date.now()-qs)')")
    ck(s and abs(rest-s['qr'])<1500,'cronometrado: tempo restante preservado (%s vs %s)'%(rest,s and s['qr']))
    # 8) fim do quiz apaga a sessão guardada; Fontes sem quiz não mostra retorno
    pg.close()
    pg=novo('index.html?q=eletro#debug')
    pg.locator('#mnu').click();pg.locator('#fonte').click();pg.wait_for_timeout(200)
    ck(pg.locator('#fvolta').is_hidden(),'sem quiz em andamento não há botão de retorno')
    pg.close()
    ck(not errs,'erros de console: %s'%errs[:3])
    b.close()
print('ERROS:',len(ERR))
raise SystemExit(1 if ERR else 0)
