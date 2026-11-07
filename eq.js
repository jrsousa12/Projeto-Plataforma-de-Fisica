/* Equações: mostra toda divisão escrita como "a / b" (com espaços) em forma de fração empilhada.
   Funciona sozinho em explicações, dicas, cartões e caderno. Não precisa marcar nada nos bancos de perguntas. */
(function(root){"use strict";
var DIG=/[0-9₀-₉⁰-⁹²³¹√]/,OPS=[" · "," × "," * "];
var UNID=/^(kWh|kW|W|J|V|A|C|s|h|min|m|kg|g|N|Ω|kΩ|mA|mm|cm|km|Hz|Pa|K|mol|L|cal|rad|atm|µC|μC|nC|mC)[²³]?$/;
var WL={Req:1,Rp:1,Rs:1,icc:1,Ec:1,Ep:1,vm:1,Fat:1,Pot:1,sen:1,cos:1};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function matchBack(s,i){var n=0;for(var k=i;k>=0;k--){if(s[k]===")")n++;else if(s[k]==="("){n--;if(!n)return k}}return -1}
function matchFwd(s,i){var n=0;for(var k=i;k<s.length;k++){if(s[k]==="(")n++;else if(s[k]===")"){n--;if(!n)return k}}return -1}
function mathTerm(t){if(!t)return false;if(t[0]==="(")return true;if(DIG.test(t))return true;
 return t.split(/[·×*]/).every(function(p){if(/^[−-]?[A-Za-zΔεπρτωθλμΩ][A-Za-z0-9Δ]*_[A-Za-zÀ-ÿ0-9]{1,10}'?$/.test(p))return true;p=p.replace(/[()⁻^_.,'−+|]/g,"");return p.length>0&&(p.length<=2||WL[p]||(p[0]==="Δ"&&p.length<=4))})}
function isNum(t){return /^[0-9]/.test(t)}
function termBack(s,end){if(end<=0)return -1;var i=end;
 while(i>0){var c=s[i-1];if(c===")"){var m=matchBack(s,i-1);if(m<0)break;i=m;continue}
  if(/\s/.test(c)||c==="("||"=≈;:".indexOf(c)>=0)break;i--}
 return i<end?i:-1}
function termFwd(s,st){var i=st;
 while(i<s.length){var c=s[i];if(c==="("){var m=matchFwd(s,i);if(m<0)break;i=m+1;continue}
  if(/\s/.test(c)||c===")"||"=≈;:".indexOf(c)>=0)break;i++}
 var e=i;while(e>st&&/[.,;:!?]/.test(s[e-1]))e--;return e>st?e:-1}
function numStart(s,p){var cur=-1,start=p,first=true,prev=null;
 for(;;){var t=termBack(s,start);if(t<0)break;var term=s.slice(t,start);
  if(!mathTerm(term)){var up=UNID.test(term)&&t>0&&s[t-1]===" "?termBack(s,t-1):-1;if(!(up>=0&&isNum(s.slice(up,t-1))))break}
  cur=t;prev=term;first=false;
  if(OPS.indexOf(s.slice(cur-3,cur))>=0){start=cur-3;continue}
  if(s[cur-1]===" "&&UNID.test(term)){var t2=termBack(s,cur-1);if(t2>=0&&isNum(s.slice(t2,cur-1))){start=cur-1;continue}}
  break}
 return cur}
function denEnd(s,p){var cur=-1,start=p,lastTerm=null;
 for(;;){var e=termFwd(s,start);if(e<0)break;var term=s.slice(start,e);
  if(!mathTerm(term)&&!(lastTerm&&isNum(lastTerm)&&UNID.test(term)))break;
  cur=e;lastTerm=term;
  var nx=s.slice(cur,cur+3);if(OPS.indexOf(nx)>=0){start=cur+3;continue}
  if(s[cur]===" "){var e2=termFwd(s,cur+1);if(e2>=0&&isNum(term)&&UNID.test(s.slice(cur+1,e2))){start=cur+1;continue}}
  break}
 return cur}
function strip(x){x=x.trim();if(x[0]==="("&&matchFwd(x,0)===x.length-1)return x.slice(1,-1).trim();return x}
var NUMFR=/(^|[^\w/])(\d+(?:,\d+)?)\/(\d+(?:,\d+)?)(?![\w/])/;
function splitNum(t){var out=[],m;while((m=NUMFR.exec(t))){var ini=m.index+m[1].length;out.push({x:t.slice(0,ini)});out.push({n:m[2],d:m[3]});t=t.slice(ini+m[2].length+1+m[3].length)}out.push({x:t});return out}
/* partes: lista de {x:texto} e {n:numerador,d:denominador} */
function parts(s){s=String(s);var r=[],pos=0;
 for(;;){var p=s.indexOf(" / ",pos);if(p<0)break;
  var a=numStart(s,p),b=denEnd(s,p+3);
  if(a<pos||a<0||b<0){r.push({x:s.slice(pos,p+3)});pos=p+3;continue}
  r.push({x:s.slice(pos,a)});r.push({n:strip(s.slice(a,p)),d:strip(s.slice(p+3,b))});pos=b}
 r.push({x:s.slice(pos)});
 var o=[];r.forEach(function(q){if(q.n!==undefined)o.push(q);else splitNum(q.x).forEach(function(z){if(z.x===""&&z.n===undefined)return;o.push(z)})});
 return o}
function html(s){return parts(s).map(function(q){return q.n!==undefined?'<span class="fr"><span class="n">'+html(q.n)+'</span><span class="sl">/</span><span class="d">'+html(q.d)+'</span></span>':esc(q.x)}).join("")}
function tem(s){return /\s\/\s|\d\/\d/.test(String(s))}
function set(el,t){t=String(t);if(tem(t))el.innerHTML=html(t);else el.textContent=t;return el}
/* diz se uma divisão com " / " virou fração (usado pela validação) */
function naoEmpilha(s){s=String(s);var r=[],pos=0;for(;;){var p=s.indexOf(" / ",pos);if(p<0)break;var a=numStart(s,p),b=denEnd(s,p+3);if(a<pos||a<0||b<0)r.push(s.slice(Math.max(0,p-12),p+12));pos=p+3}return r}
var Eq={html:html,parts:parts,set:set,tem:tem,naoEmpilha:naoEmpilha};
if(typeof module!=="undefined"&&module.exports)module.exports=Eq;else root.Eq=Eq;
})(typeof window!=="undefined"?window:this);
