/* Efeitos: som opcional, vibração e confete. Tudo respeita "reduzir movimento". */
(function(){"use strict";
var KEY="eletriz:snd",on=false,ctx=null;
try{on=localStorage.getItem(KEY)==="true"}catch(e){}
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function audio(){if(!ctx){try{ctx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){ctx=null}}if(ctx&&ctx.state==="suspended")ctx.resume();return ctx}
function tone(f,d,type,at,vol){var c=audio();if(!c)return;var t=c.currentTime+(at||0),o=c.createOscillator(),g=c.createGain();o.type=type||"sine";o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||0.18,t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+0.02)}
function buzz(ms){try{if(navigator.vibrate)navigator.vibrate(ms)}catch(e){}}
function confetti(n){
  if(reduce)return;
  var cv=document.createElement("canvas");cv.setAttribute("aria-hidden","true");
  cv.style.cssText="position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:200";
  var w=cv.width=window.innerWidth,h=cv.height=window.innerHeight,x=cv.getContext("2d");
  if(!x)return;document.body.appendChild(cv);
  var cols=["#5b3df5","#ffc233","#16a34a","#e11d48","#3b82f6","#f97316"],P=[];
  for(var i=0;i<n;i++)P.push({x:w/2+(Math.random()-.5)*80,y:h*0.35,vx:(Math.random()-.5)*11,vy:-Math.random()*11-3,s:5+Math.random()*6,c:cols[i%cols.length],r:Math.random()*6,vr:(Math.random()-.5)*.4});
  var t0=Date.now();
  (function f(){var t=Date.now()-t0;x.clearRect(0,0,w,h);P.forEach(function(p){p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.globalAlpha=Math.max(0,1-t/2400);x.fillRect(-p.s/2,-p.s/3,p.s,p.s*.6);x.restore()});if(t<2400)requestAnimationFrame(f);else cv.remove()})();
}
window.FX={
  hit:function(ok){if(ok){if(on){tone(660,.14,"triangle",0);tone(880,.2,"triangle",.1)}}else{buzz(120);if(on)tone(180,.28,"sawtooth",0,.12)}},
  end:function(p){if(p>=0.7){confetti(p===1?170:90);if(on){[523,659,784,1047].forEach(function(f,k){tone(f,.22,"triangle",k*.12)})}}else if(on){tone(392,.25,"sine",0);tone(330,.35,"sine",.18)}},
  confetti:confetti
};
function paint(b){b.textContent=(on?"🔊":"🔇")+" Som";b.setAttribute("aria-pressed",on?"true":"false")}
document.addEventListener("DOMContentLoaded",function(){var b=document.getElementById("snd");if(!b)return;paint(b);b.onclick=function(){on=!on;try{localStorage.setItem(KEY,JSON.stringify(on))}catch(e){}paint(b);if(on){tone(660,.12,"triangle",0)}}});
if(document.readyState!=="loading"){var b0=document.getElementById("snd");if(b0&&!b0.onclick){paint(b0);b0.onclick=function(){on=!on;try{localStorage.setItem(KEY,JSON.stringify(on))}catch(e){}paint(b0);if(on){tone(660,.12,"triangle",0)}}}}
})();
