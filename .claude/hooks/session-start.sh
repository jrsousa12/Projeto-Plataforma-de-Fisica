#!/bin/bash
# Ao abrir uma sessão na nuvem: garante o que os testes e o build usam.
# Só instala o que faltar (o projeto não tem npm nem requirements.txt).
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# Testes (build/navegador.py): Playwright do Python. O Chromium já vem na nuvem;
# não rodar "playwright install".
if ! python3 -c 'import playwright' 2>/dev/null; then
  python3 -m pip install -q playwright \
    || echo "Aviso: não instalou o Playwright (rede?); testes no navegador vão falhar." >&2
fi

# Arquivo único compactado (build/compactar.js): TypeScript global.
if [ ! -d "$(npm root -g)/typescript" ]; then
  npm install -g -q typescript \
    || echo "Aviso: não instalou o TypeScript; o arquivo único sai sem compactar." >&2
fi
