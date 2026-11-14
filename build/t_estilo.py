"""Visual dividido (style.css + estilo-*.css): o index e o editor carregam todos os arquivos, na ordem certa,
sem falhas; o arquivo único traz o CSS de todos; e alguns estilos de cada arquivo chegam aos elementos."""
import os,re
from playwright.sync_api import sync_playwright
RAIZ=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+os.sep
CSS=re.findall(r'<link rel="stylesheet" href="([^"]+)">',open(RAIZ+'index.html',encoding='utf-8').read())
print('arquivos de visual:',CSS)
assert CSS[0]=='style.css' and len(CSS)>=2, 'lista de .css inesperada no index.html'
sw=open(RAIZ+'sw.js',encoding='utf-8').read()
for f in CSS: assert '"%s"'%f in sw, f+' falta no sw.js (não funcionaria sem internet)'
uni=open(RAIZ+'build/saida/quiz-arquivo-unico.html',encoding='utf-8').read()
assert 'rel="stylesheet"' not in uni, 'o arquivo único ainda aponta para .css externo'
for f in CSS:
    trecho=open(RAIZ+f,encoding='utf-8').read().strip().splitlines()[-1]
    assert trecho in uni, f+' não entrou no arquivo único'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None,args=['--no-sandbox']); errs=[]
    for pag,extra in (('index.html',[]),('editor.html',['editor.css'])):
        pg=b.new_page(); ruins=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.on('response',lambda r:ruins.append(r.url) if r.url.endswith('.css') and r.status>=400 else None)
        pg.goto('http://localhost:8123/'+pag); pg.wait_for_timeout(600)
        folhas=pg.evaluate("[...document.styleSheets].filter(s=>s.href).map(s=>[s.href.split('/').pop(),s.cssRules.length])")
        print(pag,'->',folhas)
        assert [f for f,_ in folhas]==CSS+extra, 'ordem dos .css errada em '+pag
        assert all(n>0 for _,n in folhas) and not ruins, 'algum .css não carregou: %s'%ruins
        if pag=='index.html':
            v=pg.evaluate("""()=>{const r=getComputedStyle(document.documentElement),b=getComputedStyle(document.body);
              return [b.fontFamily,r.getPropertyValue('--f-amar').trim(),getComputedStyle(document.querySelector('.anim')||document.body).overflow]}""")
            print('estilos aplicados:',v)
            assert 'Nunito' in v[0], 'fonte do visual escolar (estilo-escolar.css) não chegou'
            assert v[1]=='#e0a800', 'cores das figuras (estilo-extras.css) não chegaram'
            cor=pg.evaluate("getComputedStyle(document.querySelector('#landing [data-q=mec]')).getPropertyValue('--c').trim()")
            print('cor do cartão da mecânica:',cor); assert cor=='#dc2626', 'cores por área (estilo-telas.css) não chegaram'
        pg.close()
    print('erros',errs); assert not errs; b.close()
