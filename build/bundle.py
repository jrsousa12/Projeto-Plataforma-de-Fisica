import re,os
# o app fica na raiz do repositório (pasta acima de build/); o arquivo único sai em build/saida/
d=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+os.sep
h=open(d+'index.html',encoding='utf-8').read()
for pat in (r'<!-- Segurança:.*?-->\n?',r'<meta http-equiv="Content-Security-Policy"[^>]*>\n?',r'<link rel="manifest"[^>]*>\n?',r'<link rel="apple-touch-icon"[^>]*>\n?',r'<link rel="icon"[^>]*>\n?',r'<div id="splash".*?</div>\n?',r'<a class="btn alt" id="salalink2?".*?</a>'):
    h=re.sub(pat,'',h,flags=re.S)
css=open(d+'style.css',encoding='utf-8').read()
h=h.replace('<link rel="stylesheet" href="style.css">','<style>\n'+css+'</style>')
# no arquivo único todos os quizzes vêm embutidos, antes do banco-extra
quiz=['perguntas-eletro.js','perguntas-fluidos.js','perguntas-termo.js','perguntas-onda.js','perguntas-optica.js','quiz-optica.js','perguntas-mec.js','quiz-mec.js','perguntas-edin.js','quiz-edin.js','quiz-onda.js','quiz-eletro.js','quiz-fluidos.js','quiz-termo.js','figuras.js','figuras-fluidos.js','figuras-termo.js','figuras-anim.js','figuras-animq-eletro.js','figuras-animq-eletro2.js','figuras-animq-eletro3.js','figuras-animq-eletro4.js','figuras-animq-fluidos.js','figuras-animq-fluidos2.js','figuras-animq-termo.js','figuras-animq-termo2.js','figuras-animq-termo3.js','figuras-animq-onda.js','figuras-animq-optica.js','figuras-animq-mec.js','figuras-animq-edin.js','figuras-animq-auto.js','figuras-fenomeno-mec.js']
def inline(f):
    js=open(d+f,encoding='utf-8').read().replace('</script>','<\\/script>')
    return '<script>\n'+js+'</script>'
tag='<script src="banco-extra.js"></script>'
assert tag in h
h=h.replace(tag,'\n'.join(inline(f) for f in quiz)+'\n'+tag)
for f in ('firebase-config.js','perfil.js','fontes.js','nuvem.js','banco-proprio.js','banco-extra.js','fx.js','eq.js','script.js'):
    t='<script src="%s"></script>'%f
    assert t in h,f
    h=h.replace(t,inline(f))
assert 'src="' not in re.sub(r'<script>.*?</script>','',h,flags=re.S).split('<body')[1].replace('src=""','') or True
os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)),'saida'),exist_ok=True)
open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'saida','quiz-arquivo-unico.html'),'w',encoding='utf-8').write(h)
print('bundle',len(h))
