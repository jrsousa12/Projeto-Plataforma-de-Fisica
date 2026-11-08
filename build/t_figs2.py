from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=__import__('os').environ.get('CHROME_PATH') or None,args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':400,'height':820})
    pg.goto('http://localhost:8123/index.html?q=fluidos'); pg.wait_for_timeout(500)
    pg.evaluate('''()=>{var h="";["empuxo","prensa","torricelli"].forEach(function(k){h+='<div class="fig" style="margin:6px"><svg viewBox="0 0 320 140">'+FIG[k].s+'</svg></div>'});document.body.innerHTML='<div style="max-width:420px;margin:0 auto">'+h+'</div>'}''')
    pg.screenshot(path='/tmp/figs2.png',full_page=True); b.close()
