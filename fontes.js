/* Fontes de referência do quiz: lista curada, usada no botão FONTE, na tela Fontes e no item Fonte do menu.
   Só entram páginas de sites confiáveis (ver build/fontes_confiaveis.json). Para acrescentar uma fonte, crie o item em "itens"
   e inclua o id em "principais" (as 4 do quadro pequeno) e/ou em "todas" (tela completa). */
(function(){"use strict";
var I={
 "tm":{n:"Toda Matéria · Física",u:"https://www.todamateria.com.br/fisica/",d:"Resumos e exercícios com gabarito, em português",s:"Toda Matéria"},
 "os":{n:"OpenStax",u:"https://openstax.org/",d:"Livros-texto universitários gratuitos de Física",s:"OpenStax"},
 "ph":{n:"PhET · Simulações",u:"https://phet.colorado.edu/pt_BR/",d:"Simulações interativas em português",s:"PhET, Univ. do Colorado"},
 "hp":{n:"HyperPhysics",u:"http://hyperphysics.phy-astr.gsu.edu/hbase/hframe.html",d:"Mapa de conceitos de Física",s:"HyperPhysics, Georgia State"},
 "is":{n:"InfoEscola · Física",u:"https://www.infoescola.com/fisica/",d:"Artigos de Física em português",s:"InfoEscola"},
 "gr":{n:"GREF/USP · Leituras de Física",u:"https://fep.if.usp.br/~profis/gref.html",d:"Leituras de Física para o aluno",s:"GREF, Instituto de Física da USP"},
 "lt":{n:"LibreTexts · Física",u:"https://phys.libretexts.org/",d:"Livros abertos de Física",s:"LibreTexts"},
 "x-3cae83":{n:"PrePara Enem",u:"https://www.preparaenem.com/",d:"",s:"PrePara Enem"}
};
var A={
 eletro:{nome:"Eletrostática",p:["tm","os","ph","hp"],t:["tm","os","ph","hp","is","gr","lt","x-3cae83"]},
 fluidos:{nome:"Mecânica dos Fluidos",p:["tm","os","ph","hp"],t:["tm","os","ph","hp","is","gr","lt"]},
 termo:{nome:"Termologia",p:["tm","os","ph","hp"],t:["tm","os","ph","hp","is","gr","lt"]},
 onda:{nome:"Ondulatória: Som",p:["tm","os","ph","hp"],t:["tm","os","ph","hp","is","gr","lt","x-3cae83"]},
 optica:{nome:"Óptica Geométrica",p:["tm","os","ph","hp"],t:["tm","os","ph","hp","is","gr","lt"]},
 mec:{nome:"Mecânica: Cinemática e Dinâmica",p:["tm","os","ph","hp"],t:["tm","os","ph","hp","is","gr","lt","x-3cae83"]},
 edin:{nome:"Eletrodinâmica",p:["tm","os","ph","hp"],t:["tm","os","ph","hp","is","gr","lt","x-3cae83"]}
};
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function link(id,full){var f=I[id],a=el("a","flk");a.href=f.u;a.target="_blank";a.rel="noopener noreferrer";
 a.appendChild(el("b","",f.n));if(full){a.appendChild(el("span","fd",f.d));a.appendChild(el("span","fs",f.s))}else a.appendChild(el("span","fs",f.s));
 a.setAttribute("aria-label",f.n+" (abre em outra aba)");return a}
function listaDe(area,full){return (A[area]||A.eletro)[full?"t":"p"]}
/* Quadro pequeno do botão FONTE: as 4 principais e, no fim, três pontinhos para a tela com todas. */
function quadro(box,area,onAll){
 box.textContent="";box.appendChild(el("div","fph","Fontes de referência deste assunto"));
 listaDe(area).forEach(function(id){box.appendChild(link(id,false))});
 var m=el("button","fmais","⋯");m.type="button";m.setAttribute("aria-label","Ver todas as fontes");m.title="Ver todas as fontes";m.onclick=function(e){e.stopPropagation();onAll()};box.appendChild(m)}
/* Tela completa. Mostra primeiro a área atual (se houver) e depois as outras. */
function tela(body,area){
 body.textContent="";var ks=Object.keys(A);if(area&&A[area])ks=[area].concat(ks.filter(function(k){return k!==area}));
 ks.forEach(function(k){var s=el("section","fsec");s.appendChild(el("h3","",A[k].nome+(k===area?" (assunto atual)":"")));
  listaDe(k,true).forEach(function(id){s.appendChild(link(id,true))});body.appendChild(s)});
 body.appendChild(el("p","fnote","Os links abrem em outra aba. As questões foram elaboradas a partir de conteúdos desses materiais e de livros-texto de Física do ensino médio e superior. Confira sempre o enunciado e a unidade."))}
window.Fontes={dados:{itens:I,areas:A},quadro:quadro,tela:tela,
 /* Tela de escolha do quiz (nenhum quiz carregado): abre a lista completa no lugar da escolha. */
 abrirEscolha:function(){var l=document.getElementById("landing"),f=document.getElementById("fontes");if(!f)return;if(l)l.classList.add("hidden");f.classList.remove("hidden");tela(document.getElementById("fbody"),null);var v=document.getElementById("fvolta");if(v)v.classList.add("hidden");window.scrollTo(0,0)}};
var fb=document.getElementById("fback");
if(fb)fb.onclick=function(){if(window.QzFonte){window.QzFonte.voltar()}else{var l=document.getElementById("landing"),f=document.getElementById("fontes");if(f)f.classList.add("hidden");if(l)l.classList.remove("hidden");window.scrollTo(0,0)}};
})();
