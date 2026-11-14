"""Fonte confiável de cada questão e cache das páginas (sem internet). Usado pelo novas.py."""
from novas_comum import *  # caminhos, imports e utilidades

# ----------------------------------------------------------------- fonte confiável
def checar_fonte(d, loc, R, dominios, online=False):
    f = d.get("fonte")
    if not isinstance(f, dict): R.E(loc, "sem bloco 'fonte' (site, url, titulo, conferido_em, base)"); return
    for k in ("url", "titulo", "conferido_em", "base"):
        if not str(f.get(k, "")).strip(): R.E(loc, f"fonte sem '{k}'")
    url = f.get("url", "")
    host = (urllib.parse.urlparse(url).hostname or "").lower()
    if not url.startswith("https://") : R.E(loc, "a URL da fonte precisa começar com https://")
    if not any(host == dom or host.endswith("." + dom) for dom in dominios): R.E(loc, f"o site '{host}' não está na lista de fontes confiáveis (fontes_confiaveis.json)")
    try: datetime.date.fromisoformat(f.get("conferido_em", ""))
    except Exception: R.E(loc, "fonte.conferido_em deve estar no formato AAAA-MM-DD")
    tr = f.get("trecho")
    if tr:
        a = set(zip(*[norm(tr).split()[i:] for i in range(6)])); b = norm(d.get("q", "") + " " + d.get("e", "")).split()
        g = set(zip(*[b[i:] for i in range(6)]))
        if a and len(a & g) / max(1, len(g)) > .35: R.E(loc, "o texto da questão copia o trecho da fonte: reescreva com suas palavras")
    txt = None; origem = ""
    if online and url:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "quiz-fisica-verificador"})
            html = urllib.request.urlopen(req, timeout=15).read().decode("utf-8", "ignore")
            txt = norm(re.sub(r"<[^>]+>", " ", html)); origem = "página aberta agora"
        except Exception as ex: R.W(loc, f"não consegui abrir a fonte agora ({type(ex).__name__}); tentando o cache")
    if txt is None and url:
        cp = cache_path(url)
        if os.path.exists(cp):
            linhas = open(cp, encoding="utf-8").read().split("\n", 1); txt = norm(linhas[1] if len(linhas) > 1 else ""); origem = "cache de " + linhas[0].rsplit("#", 1)[-1]
    if txt is None:
        R.W(loc, "fonte não conferida: sem rede e sem cache. Use `novas.py cache URL arquivo.txt` com o texto da página (obtido por busca/leitura) ou rode com --online onde houver internet")
        return
    chaves = f.get("verificar", [])
    if not chaves: R.W(loc, "sem 'fonte.verificar' (palavras-chave que devem existir na página)"); return
    falt = [k for k in chaves if norm(k) not in txt]
    if falt: R.E(loc, f"a página da fonte ({origem}) não contém: {', '.join(falt)}")
    else: R.I(loc, f"fonte conferida ({origem}): {len(chaves)} palavra(s)-chave encontradas")

def cache_path(url):
    import hashlib
    d = os.path.join(NOVAS, "fontes_cache"); os.makedirs(d, exist_ok=True)
    return os.path.join(d, hashlib.sha1(url.encode()).hexdigest()[:16] + ".txt")

def guardar_cache(url, arq):
    txt = open(arq, encoding="utf-8").read()
    open(cache_path(url), "w", encoding="utf-8").write(f"{url}#{datetime.date.today()}\n{txt}")
    print("guardado no cache:", url)
