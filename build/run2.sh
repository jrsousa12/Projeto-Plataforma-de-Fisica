#!/bin/bash
# uso: ./run2.sh teste.py  (servidor estático + Firebase simulado na porta 8124)
AQUI="$(cd "$(dirname "$0")" && pwd)"
cd "$AQUI/.." && python3 -m http.server 8123 >/dev/null 2>&1 &
S1=$!; cd "$AQUI" && python3 mockfb.py 8124 >/dev/null 2>&1 &
S2=$!; sleep 1
python3 "$@" 2>&1 | grep -v "^\[agent\|^- \|Allowed\|For details"
kill $S1 $S2 2>/dev/null
