/* Nuvem: guarda o desempenho do aluno no Firebase (Auth por código + Firestore), via REST.
   Cada aluno entra com um código individual e só ele acessa o próprio documento (regras no README).
   O aparelho continua sendo a cópia principal: sem internet ou sem configuração, tudo funciona como antes. */
(function(){"use strict";
var C=window.NUVEM_CONFIG||{},KS="eletriz:nuvem",QS=["eletriz:","fluidos:","termo:","onda:","optica:"];
var AUTH=C.authBase||"https://identitytoolkit.googleapis.com/v1",TOK=C.tokenBase||"https://securetoken.googleapis.com/v1",FS=C.fsBase||"https://firestore.googleapis.com/v1";
var tok=null,exp=0,tim=null,ocupado=false;
function ler(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}}
function gravar(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var setRaw=Storage.prototype.setItem;
function sessao(){return ler(KS,null)}
function ativo(){return !!(C.apiKey&&C.projectId)}
function norm(c){return String(c||"").toUpperCase().replace(/[^A-Z0-9]/g,"")}
function email(c){return norm(c).toLowerCase()+"@alunos.quizfisica.app"}
function api(url,corpo,hdr){return fetch(url,{method:corpo?"POST":"GET",headers:Object.assign({"Content-Type":"application/json"},hdr||{}),body:corpo?JSON.stringify(corpo):undefined}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error((j.error&&j.error.message)||"erro");return j})})}
function guarda(j,c){tok=j.idToken;exp=Date.now()+(+j.expiresIn||3600)*1000-60000;var s={uid:j.localId||(sessao()||{}).uid,refresh:j.refreshToken,cod:c||(sessao()||{}).cod,ult:(sessao()||{}).ult||0};gravar(KS,s);return s}
function token(){if(tok&&Date.now()<exp)return Promise.resolve(tok);var s=sessao();if(!s)return Promise.reject(new Error("sem sessao"));
  return fetch(TOK+"/token?key="+C.apiKey,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=refresh_token&refresh_token="+encodeURIComponent(s.refresh)}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error("sessao expirada");
    tok=j.id_token;exp=Date.now()+(+j.expires_in||3600)*1000-60000;var n=sessao();n.refresh=j.refresh_token||n.refresh;gravar(KS,n);return tok})})}
function docUrl(){return FS+"/projects/"+C.projectId+"/databases/(default)/documents/alunos/"+sessao().uid}
/* ---------- dados locais <-> documento ---------- */
function coletar(){var q={};QS.forEach(function(p){q[p]={book:ler(p+"book",{}),hist:ler(p+"hist",[])}});return {perfil:ler("eletriz:perfil",{}),q:q}}
function juntar(a,b){ /* a = local, b = nuvem; devolve a união */
  var r={perfil:{},q:{}};
  [a.perfil||{},b.perfil||{}].forEach(function(P){Object.keys(P).forEach(function(id){var x=P[id];if(!/^[a-z0-9]{1,30}$/.test(id)||!Array.isArray(x))return;
    x=[Math.min(9999,Math.max(0,Math.round(+x[0])||0)),Math.min(9999,Math.max(0,Math.round(+x[1])||0)),Math.max(0,Math.round(+x[2])||0)];if(x[1]>x[0])x[1]=x[0];
    var e=r.perfil[id];if(!e||x[0]>e[0]||(x[0]===e[0]&&x[2]>e[2]))r.perfil[id]=x})});
  QS.forEach(function(p){var A=(a.q||{})[p]||{},B=(b.q||{})[p]||{},bk={},hs={};
    [A.book||{},B.book||{}].forEach(function(K){Object.keys(K).forEach(function(id){var x=K[id];if(!/^[a-z0-9]{1,30}$/.test(id)||!x||typeof x!=="object")return;
      x={w:Math.min(999,Math.max(0,Math.round(+x.w)||0)),r:Math.min(9,Math.max(0,Math.round(+x.r)||0))};var e=bk[id];if(!e)bk[id]=x;else{e.w=Math.max(e.w,x.w);e.r=Math.min(e.r,x.r)}})});
    [A.hist||[],B.hist||[]].forEach(function(H){(Array.isArray(H)?H:[]).forEach(function(x){if(!x||typeof x!=="object"||!isFinite(+x.d)||typeof x.a!=="object"||!x.a)return;
      var a2={};Object.keys(x.a).slice(0,12).forEach(function(k){var v=x.a[k];if(/^[a-z]{1,4}$/.test(k)&&Array.isArray(v))a2[k]=[Math.max(0,Math.round(+v[0])||0),Math.max(0,Math.round(+v[1])||0)]});
      hs[+x.d]={d:+x.d,a:a2,s:Math.max(0,Math.round(+x.s)||0),n:Math.max(0,Math.round(+x.n)||0)}})});
    r.q[p]={book:bk,hist:Object.keys(hs).map(function(k){return hs[k]}).sort(function(m,n){return m.d-n.d}).slice(-50)}});
  return r}
function aplicarLocal(d){setRaw.call(localStorage,"eletriz:perfil",JSON.stringify(d.perfil));QS.forEach(function(p){setRaw.call(localStorage,p+"book",JSON.stringify(d.q[p].book));setRaw.call(localStorage,p+"hist",JSON.stringify(d.q[p].hist))})}
/* ---------- sincronização ---------- */
function baixar(){return token().then(function(t){return fetch(docUrl(),{headers:{Authorization:"Bearer "+t}}).then(function(r){if(r.status===404)return null;return r.json().then(function(j){if(!r.ok)throw new Error("erro");return j})})}).then(function(j){
  if(!j||!j.fields)return null;var s=j.fields.dados&&j.fields.dados.stringValue,ts=j.fields.ts&&+j.fields.ts.integerValue||0;if(!s)return null;try{return {d:JSON.parse(s),ts:ts}}catch(e){return null}})}
function enviar(d){var ts=Date.now();return token().then(function(t){return fetch(docUrl()+"?updateMask.fieldPaths=dados&updateMask.fieldPaths=ts",{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:"Bearer "+t},body:JSON.stringify({fields:{dados:{stringValue:JSON.stringify(d)},ts:{integerValue:String(ts)}}})}).then(function(r){if(!r.ok)throw new Error("erro ao enviar");var s=sessao();s.ult=ts;gravar(KS,s);return ts})})}
/* puxa, junta se a nuvem mudou desde a última sincronização, e envia */
function sincronizar(){if(!ativo()||!sessao()||ocupado)return Promise.resolve(false);ocupado=true;
  return baixar().then(function(n){var loc=coletar(),s=sessao(),fin=loc;if(n&&n.ts>(s.ult||0)){fin=juntar(loc,n.d);aplicarLocal(fin)}return enviar(fin).then(function(){return n&&n.ts>(s.ult||0)?"mesclado":"enviado"})}).then(function(r){ocupado=false;N.aviso("");return r},function(e){ocupado=false;N.aviso(e.message||"erro");return false})}
function agendar(){if(!ativo()||!sessao())return;clearTimeout(tim);tim=setTimeout(sincronizar,4000)}
/* qualquer gravação de desempenho, caderno ou histórico agenda um envio */
Storage.prototype.setItem=function(k,v){setRaw.call(this,k,v);if(this===window.localStorage&&/^(eletriz|fluidos|termo|onda|optica):(perfil|book|hist)$/.test(k))agendar()};
var N=window.Nuvem={
  ativo:ativo,logado:function(){return !!sessao()},codigo:function(){var s=sessao();return s?s.cod:""},ultima:function(){var s=sessao();return s&&s.ult||0},aviso:function(){},
  entrar:function(cod){if(!ativo())return Promise.reject(new Error("A nuvem não está configurada."));var c=norm(cod);if(c.length<6)return Promise.reject(new Error("Digite o código completo."));
    var corpo={email:email(c),password:c,returnSecureToken:true};
    return api(AUTH+"/accounts:signInWithPassword?key="+C.apiKey,corpo).catch(function(e){
      if(/INVALID_PASSWORD|EMAIL_NOT_FOUND|INVALID_LOGIN_CREDENTIALS|USER_NOT_FOUND/.test(e.message))return api(AUTH+"/accounts:signUp?key="+C.apiKey,corpo);throw e}).then(function(j){guarda(j,c);return sincronizar().then(function(r){return r||"enviado"})}).catch(function(e){
      throw new Error(/EMAIL_EXISTS/.test(e.message)?"Código não aceito.":/OPERATION_NOT_ALLOWED/.test(e.message)?"Ative o login por e-mail e senha no Firebase.":/TOO_MANY/.test(e.message)?"Muitas tentativas. Aguarde um pouco.":e.message==="Failed to fetch"?"Sem conexão com a internet.":/API key/i.test(e.message)?"Chave do Firebase inválida.":"Não foi possível entrar ("+e.message+").")})},
  sair:function(){try{localStorage.removeItem(KS)}catch(e){}tok=null},
  sincronizar:sincronizar,
  /* só para testes */_juntar:juntar,_norm:norm
};
/* ao abrir: se já houver sessão, sincroniza em segundo plano */
if(ativo()&&sessao()&&/^https?:|^file:/.test(location.protocol))setTimeout(sincronizar,1500);
})();
