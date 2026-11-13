import re,os
# o app fica na raiz do repositório (pasta acima de build/); o arquivo único sai em build/saida/
d=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+os.sep
h=open(d+'index.html',encoding='utf-8').read()
for pat in (r'<!-- Segurança:.*?-->\n?',r'<meta http-equiv="Content-Security-Policy"[^>]*>\n?',r'<link rel="manifest"[^>]*>\n?',r'<link rel="apple-touch-icon"[^>]*>\n?',r'<link rel="icon"[^>]*>\n?',r'<div id="splash".*?</div>\n?',r'<a class="btn alt" id="salalink2?".*?</a>'):
    h=re.sub(pat,'',h,flags=re.S)
css=open(d+'style.css',encoding='utf-8').read()
h=h.replace('<link rel="stylesheet" href="style.css">','<style>\n'+css+'</style>')
# no arquivo único todos os quizzes vêm embutidos, antes do banco-extra
from lista_quizzes import quizzes
quiz=[]
for _q in quizzes():
    quiz+=[f for f in _q['arquivos'] if f not in quiz]   # lista única em quizzes.js
def inline(f):
    js=open(d+f,encoding='utf-8').read().replace('</script>','<\\/script>')
    return '<script>\n'+js+'</script>'
tag='<script src="banco-extra.js"></script>'
assert tag in h
h=h.replace(tag,'\n'.join(inline(f) for f in quiz)+'\n'+tag)
for f in ('quizzes.js','firebase-config.js','perfil.js','fontes.js','nuvem.js','banco-proprio.js','banco-extra.js','fx.js','eq.js','app-meta.js','app-graficos.js','app-historico.js','app-folha.js','app-relatorio.js','app-cartoes.js','app-caderno.js','app-validacao.js','app-armazenamento.js','app-sorteio.js','app-revisao.js','app-sessao.js','app-telas.js','app-relogio.js','app-resultado.js','app-animacao.js','app-numeros.js','app-retorno.js','script.js','app-nav.js','app-escolha.js','app-subscritos.js','app-sombra.js'):
    t='<script src="%s"></script>'%f
    assert t in h,f
    h=h.replace(t,inline(f))
assert 'src="' not in re.sub(r'<script>.*?</script>','',h,flags=re.S).split('<body')[1].replace('src=""','') or True
os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)),'saida'),exist_ok=True)
open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'saida','quiz-arquivo-unico.html'),'w',encoding='utf-8').write(h)
print('bundle',len(h))
