#!/usr/bin/env python3
"""Revisão visual em lote das animações.

Uso (na pasta build/):
  python3 revisao.py ID [ID...]      ids como q012 f034 t106 (qualquer área)
  python3 revisao.py --novas         todas as questões gravadas por novas.py (novas/aplicadas.jsonl)
  python3 revisao.py --area termo    todas as questões animadas de uma área (eletro, fluidos, termo)
  python3 revisao.py --todas         tudo
Gera revisao/folha_N.png (várias animações lado a lado, no começo e no fim) e revisao/relatorio.md.
O relatório aponta automaticamente: texto fora da figura e textos sobrepostos no quadro final.
Precisa de um servidor em http://localhost:8123 servindo app/ (cd app && python3 -m http.server 8123)."""
import json, os, subprocess, sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
AQUI = os.path.dirname(os.path.abspath(__file__)); SAI = os.path.join(AQUI, "revisao"); os.makedirs(SAI, exist_ok=True)
AREA = {"q": "eletro", "f": "fluidos", "t": "termo", "o": "onda", "p": "optica", "m": "mec", "d": "edin"}; PORTA = os.environ.get("PORTA", "8123")
JS_CHECA = """() => {
  const svg = document.querySelector('#fb .anim svg'); if (!svg) return null;
  const vb = svg.viewBox.baseVal, out = [], tx = [];
  svg.querySelectorAll('text').forEach(t => {
    const cs = getComputedStyle(t); let o = 1, n = t; while (n && n !== svg) { o *= parseFloat(getComputedStyle(n).opacity); n = n.parentNode; }
    if (o < .5 || !t.textContent.trim()) return;
    let b; try { b = t.getBBox(); } catch (e) { return; }
    const m = t.getCTM(), s = svg.getCTM(); if (!m || !s) return;
    const k = s.inverse().multiply(m), p = [[b.x,b.y],[b.x+b.width,b.y+b.height]].map(([x,y]) => { const q = svg.createSVGPoint(); q.x=x; q.y=y; return q.matrixTransform(k) });
    const r = {x0: Math.min(p[0].x,p[1].x), y0: Math.min(p[0].y,p[1].y), x1: Math.max(p[0].x,p[1].x), y1: Math.max(p[0].y,p[1].y), t: t.textContent.trim().slice(0, 24)};
    tx.push(r); if (r.x0 < vb.x - 1 || r.x1 > vb.x + vb.width + 1 || r.y0 < vb.y - 1 || r.y1 > vb.y + vb.height + 1) out.push('fora da figura: "' + r.t + '"');
  });
  for (let i = 0; i < tx.length; i++) for (let j = i + 1; j < tx.length; j++) {
    const a = tx[i], b = tx[j], w = Math.min(a.x1,b.x1) - Math.max(a.x0,b.x0), h = Math.min(a.y1,b.y1) - Math.max(a.y0,b.y0);
    if (w > 2 && h > 2 && (w*h) / Math.min((a.x1-a.x0)*(a.y1-a.y0), (b.x1-b.x0)*(b.y1-b.y0)) > .25) out.push('textos sobrepostos: "' + a.t + '" e "' + b.t + '"');
  }
  return out;
}"""
JS_TEMPO = "(t) => {document.querySelectorAll('#fb .anim svg').forEach(s => s.getAnimations({subtree:true}).forEach(a => {a.pause(); a.currentTime = t * 1.7}))}"

def ids_do_banco():
    r = subprocess.run(["node", os.path.join(AQUI, "dump_banco.js")], capture_output=True, text=True, cwd=AQUI); return json.loads(r.stdout)
def escolher(args):
    info = ids_do_banco(); B = info["banks"]
    if args == ["--novas"]:
        p = os.path.join(AQUI, "novas", "aplicadas.jsonl"); return [json.loads(l)["id"] for l in open(p, encoding="utf-8") if l.strip()] if os.path.exists(p) else []
    if args[:1] == ["--area"]: return [d["id"] for d in B[args[1]] if d.get("an")]
    if args == ["--todas"]: return [d["id"] for q in B.values() for d in q if d.get("an")]
    return args

def main():
    ids = escolher(sys.argv[1:])
    if not ids: print(__doc__); return 1
    rel = []; quadros = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for qid in ids:
            pg = b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
            pg.goto(f"http://localhost:{PORTA}/index.html?q={AREA[qid[0]]}#debug"); pg.wait_for_timeout(400)
            pg.locator("#go").click(); pg.wait_for_timeout(200)
            if not pg.evaluate("__qz('Q.some(function(d){return d.id===\"%s\"})')" % qid): rel.append(f"- **{qid}**: id inexistente"); pg.close(); continue
            pg.evaluate("__qz('order=[Q.findIndex(function(d){return d.id===\"%s\"})];i=0;show()')" % qid); pg.wait_for_timeout(150)
            if pg.locator("#opts .opt").count(): pg.locator("#opts .opt").nth(0).click()
            else: pg.locator("#num").fill("1"); pg.locator("#nsend").click()
            pg.wait_for_timeout(250)
            if not pg.locator("#fb .anim").count(): rel.append(f"- **{qid}**: sem animação"); pg.close(); continue
            T = pg.evaluate("__qz('ANIM[Q[order[i]].an].T')") or 15
            fs = []
            for t in (T * .25, T * .97):
                pg.evaluate(JS_TEMPO, t * 1000); pg.wait_for_timeout(120)
                f = f"/tmp/rev_{qid}_{int(t)}.png"; pg.locator("#fb .anim").screenshot(path=f); fs.append(f)
            probs = pg.evaluate(JS_CHECA) or []
            rel.append(f"- **{qid}**: " + ("; ".join(sorted(set(probs))) if probs else "ok (sem texto fora da figura ou sobreposto)"))
            quadros.append((qid, fs, bool(probs))); pg.close()
        b.close()
    # folhas: 4 animações por folha, cada uma com início e fim lado a lado
    for n in range(0, len(quadros), 4):
        grupo = quadros[n:n + 4]; imgs = [[Image.open(f) for f in fs] for _, fs, _ in grupo]
        w = sum(i.width for i in imgs[0]) + 10; h = max(sum(0 for _ in [0]) + max(i.height for i in r) for r in imgs) + 22
        folha = Image.new("RGB", (w * len(grupo), h), "white"); d = ImageDraw.Draw(folha)
        for k, (qid, _, bad) in enumerate(grupo):
            x = k * w; d.text((x + 4, 4), qid + ("  ⚠ ver relatório" if bad else ""), fill=(200, 0, 0) if bad else (0, 0, 0))
            for i in imgs[k]: folha.paste(i, (x, 22)); x += i.width + 10
        folha.save(os.path.join(SAI, f"folha_{n // 4 + 1}.png"))
    open(os.path.join(SAI, "relatorio.md"), "w", encoding="utf-8").write("# Revisão visual\n\n" + "\n".join(rel) + "\n")
    print("\n".join(rel)); print(f"\n{len(quadros)} animações, folhas em build/revisao/ (folha_N.png) e relatorio.md")
    return 1 if any(b for *_, b in quadros) else 0
sys.exit(main())
