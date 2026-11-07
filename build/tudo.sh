#!/bin/bash
# Gera o arquivo único, a versão do cache e valida o banco. (index.html e script.js são editados diretamente em app/.)

set -e
set -o pipefail
cd /home/claude/quiz/build && python3 bundle.py | tail -1
python3 versao.py
cd ../app && node validar-banco.js | tail -2
cd ../build && python3 novas.py auditar --estrito | tail -2
python3 t_eq.py | tail -2
python3 gerar_readme.py
