/* Animações automáticas de resolução (moldes): desenho. Os dados (window.AN_AUTO) ficam em
   figuras-animq-auto-dados.js, gravado por build/novas.py; carregue-o antes deste arquivo. */
(function(){"use strict";
var N=window.AN;if(!N)return;
var t_=N.t,HOT="var(--f-calor)",COLD="var(--f-agua)";
var DATA=window.AN_AUTO||[];
var flame=N.chama; /* kit: figuras-anim-kit.js */
var arr=N.seta; /* kit: figuras-anim-kit.js */
/* desenho pequeno (altura até 84) que ilustra o tipo de conta; cada molde é opcional */
function motivo(m,T,tr){var s="";
 if(m==="dilatacao"){s+='<rect x="40" y="26" width="14" height="40" fill="#9aa6b8" stroke="currentColor" stroke-width="2"/><rect x="56" y="38" width="170" height="18" rx="3" fill="#9aa6b8" fill-opacity=".55" stroke="currentColor" stroke-width="2"/><rect class="ex" x="226" y="38" width="30" height="18" rx="3" fill="'+HOT+'" fill-opacity=".7" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:0 50%"/>'+flame(140,78,"fl");tr.push(N.sc(".ex",T,[[0,.05,1],[2,.05,1],[9,1,1]]))}
 else if(m==="calor"){s+='<path d="M120 22V70a6 6 0 0 0 6 6h68a6 6 0 0 0 6-6V22" fill="none" stroke="currentColor" stroke-width="2.4"/><rect class="lq" x="122" y="38" width="76" height="36" rx="3" fill="'+COLD+'" fill-opacity=".5" style="transform-box:fill-box;transform-origin:50% 100%"/>'+flame(160,80,"fl");tr.push(N.op(".fl",T,[[0,0],[2,0],[2.4,1],[T,1]]));tr.push(N.sc(".lq",T,[[0,1,1],[2,1,1],[9,1,1.04]]))}
 else if(m==="pressao"){s+='<rect x="120" y="14" width="80" height="62" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="121.5" y="30" width="77" height="44.5" fill="'+COLD+'" fill-opacity=".5"/>'+arr(160,36,160,70,"var(--f-forca,#b45309)","pa")+'<line x1="214" y1="30" x2="214" y2="74" stroke="currentColor" stroke-width="1.4"/><text x="222" y="56" font-size="12" font-weight="700">h</text>';tr.push(N.vis(".pa",T,2.4))}
 else if(m==="coulomb"){s+='<circle cx="86" cy="46" r="15" fill="#ef4444" fill-opacity=".85" stroke="currentColor" stroke-width="2"/><circle cx="234" cy="46" r="15" fill="#3b82f6" fill-opacity=".85" stroke="currentColor" stroke-width="2"/>'+t_(86,51,"+",{s:16,f:"#fff"})+t_(234,51,"−",{s:16,f:"#fff"})+arr(110,46,140,46,"var(--f-forca,#b45309)","fa")+arr(210,46,180,46,"var(--f-forca,#b45309)","fb")+'<line x1="86" y1="72" x2="234" y2="72" stroke="currentColor" stroke-width="1.4"/>'+t_(160,84,"d",{s:12});tr.push(N.vis(".fa",T,2.4));tr.push(N.vis(".fb",T,2.4))}
 else if(m==="bernoulli"){s+='<path d="M30 24H120L170 40H290M30 70H120L170 54H290" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="31" y="25" width="88" height="44" fill="'+COLD+'" fill-opacity=".45"/><polygon points="120,25 170,41 170,53 120,69" fill="'+COLD+'" fill-opacity=".45"/><rect x="170" y="41" width="119" height="12" fill="'+COLD+'" fill-opacity=".45"/>'+arr(50,47,100,47,"var(--f-forca,#b45309)","pa")+arr(200,47,270,47,"var(--f-forca,#b45309)","pb")+t_(75,18,"v₁",{s:12})+t_(235,36,"v₂",{s:12});tr.push(N.vis(".pa",T,1.5));tr.push(N.vis(".pb",T,2.4))}
 else if(m==="latente"){s+='<rect class="ice" x="130" y="30" width="60" height="40" rx="5" fill="#bfe3f5" stroke="currentColor" stroke-width="2" style="transform-box:fill-box;transform-origin:50% 100%"/><path d="M110 74H210" stroke="currentColor" stroke-width="2.4"/><ellipse class="pd" cx="160" cy="74" rx="10" ry="3" fill="'+COLD+'" fill-opacity=".7" style="transform-box:fill-box;transform-origin:50% 50%"/>'+flame(160,86,"fl");tr.push(N.sc(".ice",T,[[0,1,1],[2,1,1],[9,.35,.4]]));tr.push(N.sc(".pd",T,[[0,.1,1],[2,.1,1],[9,5,1.6]]))}
 else if(m==="potencial"){s+='<circle cx="160" cy="46" r="26" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/><circle cx="160" cy="46" r="40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/><circle cx="160" cy="46" r="10" fill="#ef4444" fill-opacity=".85" stroke="currentColor" stroke-width="2"/>'+t_(160,50,"+",{s:13,f:"#fff"})+'<g class="qt"><circle cx="196" cy="46" r="5" fill="#3b82f6" stroke="currentColor" stroke-width="1.5"/>'+t_(196,38,"q",{s:10})+'</g>';tr.push(N.tr(".qt",T,[[0,0,0],[2,0,0],[9,-14,0]]))}
 return s}
/* linha de equação em SVG: divisões "a / b" viram fração empilhada (usa Eq.parts de eq.js) */
var CV=null;function wd(t,sz){try{CV=CV||document.createElement("canvas").getContext("2d");CV.font="700 "+sz+"px "+(getComputedStyle(document.body).fontFamily||"sans-serif");return CV.measureText(t).width}catch(e){return t.length*sz*.58}}
function un(t){return String(t).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")}
function ex(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function pf(str){return window.Eq?Eq.parts(un(str)):[{x:un(str)}]}
function temFr(str){return pf(str).some(function(q){return q.n!==undefined})}
function eqLine(cx,yb,str,sz,cls){var P=pf(str);if(!P.some(function(q){return q.n!==undefined}))return t_(cx,yb,str,{s:sz,c:cls});
 var pad=4,W=P.map(function(q){return q.n!==undefined?Math.max(wd(q.n,sz),wd(q.d,sz))+2*pad:wd(q.x,sz)}),tot=W.reduce(function(a,b){return a+b},0),x=cx-tot/2,ax=yb-sz*.3,o="",at=' font-size="'+sz+'" font-weight="700"'+(cls?' class="'+cls+'"':'');
 P.forEach(function(q,k){if(q.n===undefined){if(q.x)o+='<text x="'+x.toFixed(1)+'" y="'+yb+'" text-anchor="start" xml:space="preserve" style="white-space:pre"'+at+'>'+ex(q.x)+'</text>'}
  else{var xc=x+W[k]/2;o+='<text x="'+xc.toFixed(1)+'" y="'+(ax-3).toFixed(1)+'" text-anchor="middle"'+at+'>'+ex(q.n)+'</text><line x1="'+(x+2).toFixed(1)+'" y1="'+ax.toFixed(1)+'" x2="'+(x+W[k]-2).toFixed(1)+'" y2="'+ax.toFixed(1)+'" stroke="currentColor" stroke-width="1.5"/><text x="'+xc.toFixed(1)+'" y="'+(ax+sz*.8+2).toFixed(1)+'" text-anchor="middle"'+at+'>'+ex(q.d)+'</text>'}
  x+=W[k]});return o}
function build(d){var vars=d.vars||[],n=Math.min(vars.length,4),T=16,tr=[],s=motivo(d.molde,T,tr),fm=temFr(d.formula)?{h:30,b:18}:{h:20,b:14},sb=temFr(d.subst)?{h:30,b:18}:{h:20,b:14},y0=150,H=y0+fm.h+sb.h+24;
 vars.slice(0,4).forEach(function(v,k){s+=t_(160,100+15*k-(n>3?4:0),v,{s:12})});
 s+='<g class="s2">'+eqLine(160,y0+fm.b,d.formula,13)+'</g><g class="s3">'+eqLine(160,y0+fm.h+sb.b,d.subst,13)+'</g><g class="s4">'+t_(160,y0+fm.h+sb.h+16,d.resultado,{s:15,c:"fin"})+'</g>';
 var st=[[0,"Dados do problema"],[3,"Fórmula que relaciona as grandezas"],[6,"Substituindo os valores|(confira as unidades)"],[9.5,"Resultado"]],
 c=N.cap(st.map(function(a){return a[1]}),st.map(function(a){return a[0]}),T,H);
 for(var k=1;k<st.length;k++)tr.push(N.vis(".s"+(k+1),T,st[k][0]));
 N.reg(d.key,{a:d.alt,h:H,s:s+c.s,t:tr.concat(c.t),T:T})}
DATA.forEach(function(d){try{build(d)}catch(e){}});
})();
