#!/bin/bash
# Impede ler bancos de questões (linhas de até ~130 KB) com cat/grep/sed etc.
# Usar build/questao.py (mostrar, --busca, alterar) no lugar.
cmd=$(jq -r '.tool_input.command // ""')
if echo "$cmd" | grep -qE '\b(cat|grep|rg|sed|head|tail|less|more|awk|cut)\b' &&
   echo "$cmd" | grep -qE 'perguntas-[^ ]*\.js|figuras-animq-auto-dados\.js'; then
  echo "Bloqueado: não ler bancos direto (linhas enormes gastam muitos tokens). Use: python3 build/questao.py ID | --busca texto | ID campo=valor" >&2
  exit 2
fi
exit 0
