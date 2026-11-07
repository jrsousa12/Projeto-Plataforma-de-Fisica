#!/usr/bin/env python3
"""Atualiza a versão do cache do sw.js a partir do conteúdo dos arquivos (muda sozinha quando algo muda)."""
import hashlib,re,os
A='/home/claude/quiz/app/'
sw=open(A+'sw.js',encoding='utf-8').read()
lista=re.search(r'ARQUIVOS=\[(.*?)\]',sw,re.S).group(1)
arqs=[x for x in re.findall(r'"([^"]+)"',lista) if x!='./']
h=hashlib.sha1()
for f in sorted(arqs):
    p=A+f
    if os.path.exists(p): h.update(f.encode());h.update(open(p,'rb').read())
    else: print('aviso: arquivo do cache não existe:',f)
v='quiz-fisica-'+h.hexdigest()[:8]
sw2=re.sub(r'quiz-fisica-[a-z0-9]+',v,sw,count=1)
open(A+'sw.js','w',encoding='utf-8').write(sw2)
print('cache:',v)
