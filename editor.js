/* Editor de questões: perguntas próprias (salvas neste aparelho; para os alunos, publique o arquivo banco-proprio.js) e ocultar perguntas do banco. */
(function(){"use strict";
var X=window.BancoExtra,Q=window.QUIZZES,V=document.getElementById("v"),$=function(i){return document.getElementById(i)};
var qa=Object.keys(Q)[0],fa="",busca="",msg="";
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function proprias(q){return X.custom()[q]||[]}
function ehPropria(q,id){return proprias(q).some(function(d){return d.id===id})}
/* ---------- lista ---------- */
function lista(){
  var ar=Q[qa].areas,oc=X.ocultas(),todas=window.BANKS_ALL[qa];
  var l=todas.filter(function(d){return (!fa||d.t===fa)&&(!busca||d.q.toLowerCase().indexOf(busca.toLowerCase())>=0)});
  var h='<div class="cnt">Banco de perguntas</div>'+(msg?'<p class="msg ok">'+esc(msg)+'</p>':'')+
   '<div style="display:flex;gap:10px;flex-wrap:wrap"><div style="flex:1;min-width:160px"><label class="nl" for="eq">Quiz</label><select id="eq" class="fld">'+Object.keys(Q).map(function(k){return '<option value="'+k+'"'+(k===qa?' selected':'')+'>'+esc(Q[k].nome)+'</option>'}).join("")+'</select></div><div style="flex:1;min-width:160px"><label class="nl" for="ea">Área</label><select id="ea" class="fld"><option value="">Todas</option>'+Object.keys(ar).map(function(k){return '<option value="'+k+'"'+(k===fa?' selected':'')+'>'+esc(ar[k])+'</option>'}).join("")+'</select></div></div><input id="eb" class="fld" placeholder="Buscar no enunciado" value="'+esc(busca)+'">'+
   '<div class="row noprt" style="gap:8px"><button class="btn" id="enova">Nova pergunta</button><button class="btn alt" id="eexp">Exportar minhas perguntas</button><button class="btn alt" id="eimp">Importar</button><button class="btn alt" id="epub">Gerar arquivo para os alunos</button></div><input type="file" id="ef" accept="application/json,.json" hidden>'+
   '<p class="msg neu" style="margin-top:10px">'+l.length+' perguntas. Próprias: '+proprias(qa).length+'. Ocultas: '+todas.filter(function(d){return oc.indexOf(d.id)>=0}).length+'.</p><table class="tb">'+
   l.map(function(d){var p=ehPropria(qa,d.id),o=oc.indexOf(d.id)>=0;
     return '<tr style="'+(o?'opacity:.5':'')+'"><td>'+(p?'<b>Própria</b>':'Banco')+(d.c?' · cálculo':'')+'<br><small>'+esc(ar[d.t]||d.t)+'</small></td><td>'+esc(d.q)+'</td><td class="n" style="white-space:nowrap">'+
     (p?'<button class="btn alt ed" data-a="ed" data-id="'+d.id+'" style="padding:4px 10px;margin:0">Editar</button> <button class="btn alt ed" data-a="ap" data-id="'+d.id+'" style="padding:4px 10px;margin:0">Apagar</button>':
        '<button class="btn alt ed" data-a="du" data-id="'+d.id+'" style="padding:4px 10px;margin:0">Duplicar</button> <button class="btn alt ed" data-a="oc" data-id="'+d.id+'" style="padding:4px 10px;margin:0">'+(o?'Mostrar':'Ocultar')+'</button>')+'</td></tr>'}).join("")+'</table>';
  msg="";V.innerHTML=h;
  $("eq").onchange=function(){qa=$("eq").value;fa="";lista()};$("ea").onchange=function(){fa=$("ea").value;lista()};
  $("eb").oninput=function(){busca=$("eb").value;var p=$("eb").selectionStart;lista();var e=$("eb");e.focus();try{e.setSelectionRange(p,p)}catch(x){}};
  $("enova").onclick=function(){form({t:fa||Object.keys(ar)[0],o:["","","",""],a:0})};
  $("eexp").onclick=exportar;$("eimp").onclick=function(){$("ef").click()};$("ef").onchange=importar;
  $("epub").onclick=function(){var c=X.custom(),o=X.ocultas(),t="window.BANCO_PROPRIO="+JSON.stringify({custom:c,ocultas:o})+";\n",
    a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:"text/javascript"}));a.download="banco-proprio.js";document.body.appendChild(a);a.click();a.remove();
    msg="Arquivo gerado. Envie-o ao GitHub, no lugar de banco-proprio.js, para as perguntas chegarem aos alunos.";lista()};
  Array.prototype.forEach.call(V.querySelectorAll(".ed"),function(b){b.onclick=function(){acao(b.getAttribute("data-a"),b.getAttribute("data-id"))}});
}
function acao(a,id){
  var c=X.custom(),L=c[qa]||[],d=window.BANKS_ALL[qa].filter(function(x){return x.id===id})[0];
  if(a==="ed")return form(JSON.parse(JSON.stringify(d)));
  if(a==="du"){var n=JSON.parse(JSON.stringify(d));delete n.id;delete n.g;n.q=n.q+" (cópia)";return form(n)}
  if(a==="ap"){if(!confirm("Apagar esta pergunta?"))return;c[qa]=L.filter(function(x){return x.id!==id});X.salvarCustom(c);X.aplicar();msg="Pergunta apagada.";return lista()}
  if(a==="oc"){var o=X.ocultas(),i=o.indexOf(id);if(i>=0)o.splice(i,1);else o.push(id);X.salvarOcultas(o);X.aplicar();return lista()}
}
/* ---------- formulário ---------- */
function form(d){
  var ar=Q[qa].areas,vf=d.o.length===2,erro="";
  function desenha(){
    var h='<div class="cnt">'+(d.id?'Editar pergunta':'Nova pergunta')+' · '+esc(Q[qa].nome)+'</div>'+(erro?'<p class="msg no">'+esc(erro)+'</p>':'')+
     '<label class="nl" for="ft">Área</label><select id="ft" class="fld">'+Object.keys(ar).map(function(k){return '<option value="'+k+'"'+(k===d.t?' selected':'')+'>'+esc(ar[k])+'</option>'}).join("")+'</select>'+
     '<label class="nl" for="fq">Enunciado</label><textarea id="fq" class="fld" rows="3" maxlength="400">'+esc(d.q||"")+'</textarea>'+
     '<label class="nl" for="ftp">Tipo</label><select id="ftp" class="fld"><option value="4"'+(vf?'':' selected')+'>Múltipla escolha (4 alternativas)</option><option value="2"'+(vf?' selected':'')+'>Verdadeiro ou falso</option></select>'+
     '<label class="nl">Alternativas (marque a correta)</label>'+d.o.map(function(t,i){return '<div style="display:flex;gap:8px;align-items:center"><input type="radio" name="fa" value="'+i+'"'+(d.a===i?' checked':'')+' aria-label="Correta"><input class="fld fo" data-i="'+i+'" value="'+esc(t)+'" maxlength="160" placeholder="Alternativa '+"ABCD".charAt(i)+'"'+(vf?' readonly':'')+'></div>'}).join("")+
     '<label class="nl" for="fh">Dica (opcional)</label><input id="fh" class="fld" maxlength="160" value="'+esc(d.h||"")+'">'+
     '<label class="nl" for="fe">Explicação da resposta</label><textarea id="fe" class="fld" rows="3" maxlength="500">'+esc(d.e||"")+'</textarea>'+
     '<label class="nl" style="display:block;margin:6px 0"><input type="checkbox" id="fc"'+(d.c?' checked':'')+'> Exige cálculo (60 s no cronometrado; fica fora do cronometrado de Eletrostática)</label>'+
     '<div class="row noprt" style="margin-top:12px"><button class="btn" id="fs">Salvar</button><button class="btn alt" id="fv">Cancelar</button></div>';
    V.innerHTML=h;
    $("ftp").onchange=function(){ler();var dois=$("ftp").value==="2";d.o=dois?["Verdadeiro","Falso"]:(d.o.length===4?d.o:["","","",""]);if(dois)d.v=1;else delete d.v;if(d.a>=d.o.length)d.a=0;erro="";vf=dois;desenha()};
    $("fv").onclick=lista;
    $("fs").onclick=function(){ler();
      var e=X.valida(d,ar);if(e){erro=e;desenha();return}
      var c=X.custom(),L=c[qa]=c[qa]||[],item={id:d.id||X.novoId(),t:d.t,q:d.q.trim(),o:d.o.map(function(s){return s.trim()}),a:d.a,h:(d.h||"").trim(),e:(d.e||"").trim()};
      if(d.c)item.c=1;if(vf)item.v=1;if(d.f)item.f=d.f;
      var i=L.map(function(x){return x.id}).indexOf(item.id);if(i>=0)L[i]=item;else L.push(item);
      X.salvarCustom(c);X.aplicar();msg="Pergunta salva.";lista()};
  }
  function ler(){d.t=$("ft").value;d.q=$("fq").value;d.h=$("fh").value;d.e=$("fe").value;d.c=$("fc").checked?1:0;
    Array.prototype.forEach.call(V.querySelectorAll(".fo"),function(i){d.o[+i.getAttribute("data-i")]=i.value});
    var r=V.querySelector('input[name=fa]:checked');d.a=r?+r.value:-1}
  desenha();
}
/* ---------- exportar e importar ---------- */
function exportar(){
  var b=new Blob([JSON.stringify({versao:1,custom:X.custom(),ocultas:X.ocultas()},null,1)],{type:"application/json"}),a=document.createElement("a");
  a.href=URL.createObjectURL(b);a.download="minhas-perguntas.json";document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},500);
}
function importar(){
  var f=$("ef").files[0];if(!f)return;var r=new FileReader();
  r.onload=function(){try{
    var j=JSON.parse(r.result),c=X.custom(),n=0;
    Object.keys(j.custom||{}).forEach(function(q){if(!Q[q])return;var L=c[q]=c[q]||[],ids=L.map(function(x){return x.id});
      (j.custom[q]||[]).forEach(function(d){if(X.valida(d,Q[q].areas)===""&&d.id){var i=ids.indexOf(d.id);if(i>=0)L[i]=d;else{L.push(d);ids.push(d.id)}n++}})});
    var o=X.ocultas();(j.ocultas||[]).forEach(function(id){if(o.indexOf(id)<0)o.push(id)});
    X.salvarCustom(c);X.salvarOcultas(o);X.aplicar();msg=n+" perguntas importadas."}catch(e){msg="Arquivo inválido."}lista()};
  r.readAsText(f);
}
lista();
})();
