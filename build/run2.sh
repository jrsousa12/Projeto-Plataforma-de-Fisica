#!/bin/bash
# uso: ./run2.sh teste.py  (servidor estático na porta $PORTA, padrão 8123, + Firebase simulado em $PORTA_FB, padrão 8124)
AQUI="$(cd "$(dirname "$0")" && pwd)"
export PORTA="${PORTA:-8123}" PORTA_FB="${PORTA_FB:-8124}"
cd "$AQUI/.." && python3 -m http.server "$PORTA" >/dev/null 2>&1 &
S1=$!; cd "$AQUI" && python3 mockfb.py "$PORTA_FB" >/dev/null 2>&1 &
S2=$!; sleep 1
python3 "$@" 2>&1 | grep -v "^\[agent\|^- \|Allowed\|For details"
kill $S1 $S2 2>/dev/null
