"""Validação do banco: abre cada quiz com #teste e confere a mensagem "Banco OK" no topo e
o console sem avisos; depois testa a validação com uma questão quebrada de propósito."""
import os,re
from playwright.sync_api import sync_playwright
from navegador import abrir
with sync_playwright() as p:
    b=abrir(p)
    pg=b.new_page(viewport={'width':800,'height':1000}); errs=[]; avisos=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:avisos.append(m.text) if 'Banco com problemas' in m.text else None)
    for q in ('eletro','termo','mec','onda','optica','fluidos','edin'):
        pg.goto('http://localhost:8123/index.html?q=%s#teste'%q); pg.wait_for_timeout(500)
        t=pg.text_content('.hero p'); print(q,'|',t)
        assert re.match(r'Banco OK: \d+ questões validadas\.',t), q+': mensagem do #teste errada'
    assert not avisos, 'console com avisos: %s'%avisos
    er=pg.evaluate("""window.AppValidacao({Q:[{q:'x',t:'zz',o:['a','a'],a:5,f:'nada'},{id:'r1',q:'y'},{id:'r1',q:'y'}],TN:{},FIG:{}}).erros""")
    print('questão quebrada:',er)
    for msg in ('sem id','área inválida','sem dica','gabarito fora do intervalo','alternativas repetidas','figura inexistente','id repetido','pergunta repetida','sem explicação','poucas alternativas'):
        assert any(msg in e for e in er), 'não detectou: '+msg
    print('erros',errs); b.close()
