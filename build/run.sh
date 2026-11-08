#!/bin/bash
# uso: ./run.sh teste.py  (sobe o servidor, roda o teste e encerra o servidor)
AQUI="$(cd "$(dirname "$0")" && pwd)"
cd "$AQUI/.." && python3 -m http.server 8123 >/dev/null 2>&1 &
SP=$!; sleep 1; cd "$AQUI"
python3 "$@" 2>&1 | grep -v "^\[agent\|^- \|Allowed\|For details"
kill $SP 2>/dev/null
