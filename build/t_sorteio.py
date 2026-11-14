"""Armazenamento e sorteio (app-armazenamento.js e app-sorteio.js): grava e lê com prefixo,
migra o formato antigo do caderno e sorteia questões só das áreas e do nível pedidos, com reforço do caderno."""
import os
from playwright.sync_api import sync_playwright
from navegador import abrir
with sync_playwright() as p:
    b=abrir(p)
    pg=b.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8123/index.html?q=termo'); pg.wait_for_timeout(500)
    r=pg.evaluate("""()=>{localStorage.clear();
      var S=window.AppArmazenamento('t:',{});S.set('a',{x:1});var ok1=S.get('a').x===1&&localStorage.getItem('t:a')==='{"x":1}';
      S.del('a');var ok2=S.get('a','nada')==='nada';
      localStorage.setItem('eletriz-book',JSON.stringify({h1:3,h2:1}));localStorage.setItem('eletriz-nick','Ana');
      var M=window.AppArmazenamento('m:',{h1:'q1'});M.mig();
      var ok3=JSON.stringify(M.get('book'))==='{"q1":3}'&&M.get('nick')==='Ana'&&M.get('ver')===2;
      var Q=[];for(var k=0;k<40;k++)Q.push({t:k%2?'A':'B',n:k%3?2:3});
      var box={checked:true},lvl=0;
      var SO=window.AppSorteio({Q:Q,QZ:{},$:function(){return box},sel:function(){return['A']},mode:function(){return'estudo'},lvl:function(){return lvl},bkList:function(){return[0,1,3]}});
      var s=SO.pickSet(10),ok4=s.length===10&&s.every(function(k){return Q[k].t==='A'})&&s.indexOf(1)>=0&&s.indexOf(3)>=0&&s.indexOf(0)<0;
      lvl=3;var ok5=SO.poolSel().every(function(k){return Q[k].n===3&&Q[k].t==='A'});
      var sh=SO.shuf([1,2,3,4]),ok6=sh.slice().sort().join()==='1,2,3,4';
      localStorage.clear();return [ok1,ok2,ok3,ok4,ok5,ok6]}""")
    print('armazenamento/sorteio:',r); assert all(r), r
    pg.goto('http://localhost:8123/index.html?q=termo'); pg.wait_for_timeout(500)
    print('erros',errs); assert not errs; b.close()
