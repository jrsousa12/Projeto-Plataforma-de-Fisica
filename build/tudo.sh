#!/bin/bash
# Gera o arquivo único, a versão do cache e valida o banco. O app fica na raiz do repositório (pasta acima de build/).
set -e
set -o pipefail
AQUI="$(cd "$(dirname "$0")" && pwd)"
cd "$AQUI" && python3 bundle.py | tail -1
python3 versao.py
cd "$AQUI/.." && node validar-banco.js | tail -2
cd "$AQUI" && python3 novas.py auditar --estrito | tail -2
python3 t_eq.py | tail -2
node catalogo_cenas.js
python3 gerar_readme.py
