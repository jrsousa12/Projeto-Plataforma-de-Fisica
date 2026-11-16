#!/usr/bin/env bash
# Diagnóstico do protocolo-token: olha o projeto e imprime só um resumo curto (não altera nada).
# Uso: bash diagnostico.sh [pasta do projeto]   (padrão: raiz do git ou pasta atual)
cd "${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}" || exit 1
ok()  { echo "OK    $*"; }
falta() { echo "FALTA $*"; }
info() { echo "INFO  $*"; }

# lista de arquivos do projeto, sem dependências nem gerados
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then ARQS=$(git ls-files)
else ARQS=$(find . -type f -not -path '*/.git/*' | sed 's|^\./||'); fi
ARQS=$(echo "$ARQS" | grep -vE '(^|/)(node_modules|vendor|dist|\.venv|__pycache__)/|\.min\.|\.lock$')
CODIGO=$(echo "$ARQS" | grep -E '\.(js|ts|jsx|tsx|py|sh|css|html|java|c|cpp|go|rb|php)$')

echo "== Diagnóstico protocolo-token: $(basename "$PWD") =="

# 1. onde estou
if [ "$CLAUDE_CODE_REMOTE" = true ]; then info "nuvem (instalação global não se aplica)"
else
  [ -f ~/.claude/CLAUDE.md ] && ok "global ~/.claude/CLAUDE.md" || falta "global ~/.claude/CLAUDE.md"
  [ -d ~/.claude/skills/protocolo-token ] && ok "comando global /protocolo-token" || falta "comando global /protocolo-token"
fi

# 2. CLAUDE.md da raiz
if [ -f CLAUDE.md ]; then
  n=$(wc -l < CLAUDE.md)
  [ "$n" -le 200 ] && ok "CLAUDE.md ($n linhas)" || falta "CLAUDE.md com $n linhas (> 200): mover trechos para subpastas"
  for s in "## 1\." "## 8\." "Idioma"; do grep -q "$s" CLAUDE.md || falta "CLAUDE.md sem a parte '${s//\\/}' do modelo"; done
else falta "CLAUDE.md na raiz (criar pelo modelo)"; fi
sub=$(echo "$ARQS" | grep -c '/CLAUDE\.md$'); info "CLAUDE.md em subpastas: $sub"

# 3. arquivos de código acima de 300 linhas (mais longos primeiro)
# (arquivo citado no CLAUDE.md = exceção já registrada; arquivo citado como gerado/dados = não é código)
grandes=$(echo "$CODIGO" | tr '\n' '\0' | xargs -0 wc -l 2>/dev/null | awk '$1>300 && $2!="total"' | sort -rn)
novos=""; regs=0
while read -r n f; do [ -z "$f" ] && continue
  if grep -qsF "$(basename "$f")" CLAUDE.md; then regs=$((regs+1)); else novos="$novos$n $f"$'\n'; fi
done <<< "$grandes"
[ "$regs" -gt 0 ] && info "$regs arquivo(s) > 300 linhas já citados no CLAUDE.md (exceção ou dados)"
if [ -z "$novos" ]; then ok "nenhum arquivo de código novo > 300 linhas"
else falta "$(echo -n "$novos" | grep -c .) arquivo(s) > 300 linhas (dividir ou registrar exceção):"
  echo -n "$novos" | head -10 | awk '{printf "        %5d  %s\n", $1, $2}'; fi

# 4. dados com linhas enormes (só conta o tamanho; nunca imprime o conteúdo)
longos=$(echo "$ARQS" | grep -E '\.(js|json|csv|txt|jsonl)$' | while read -r f; do
  [ -f "$f" ] && awk 'length>2000{print FILENAME; exit}' "$f"; done)
if [ -n "$longos" ]; then
  info "$(echo "$longos" | wc -l) arquivo(s) com linha > 2000 caracteres: $(echo "$longos" | head -5 | tr '\n' ' ')"
  grep -qsE 'deny|bloquear' .claude/settings.json && ok "trava de leitura dos dados" || falta "trava de leitura dos dados (travas-e-barra.md)"
  echo "$ARQS" | grep -qiE '(questao|item|registro)\.(py|js|sh)$' && ok "motor de item único" || falta "motor de item único (motor-questao.md)"
fi

# 5. barra de contexto (projeto ou global)
if grep -qs statusLine .claude/settings.json ~/.claude/settings.json; then ok "barra de contexto"
else falta "barra de contexto (travas-e-barra.md)"; fi

# 6. scripts e testes
scripts=$(echo "$ARQS" | grep -cE '^(build|scripts|tools|ferramentas)/|^Makefile$|^package\.json$')
info "scripts/ferramentas encontrados: $scripts (conferir 'Comandos úteis' da seção 0)"
testes=$(echo "$ARQS" | grep -cE '(^|/)(t_|test_)[^/]*\.py$|\.(test|spec)\.[jt]s$|(^|/)tests?/')
[ "$testes" -gt 0 ] && ok "testes guardados: $testes" || falta "testes guardados por assunto"
[ "$testes" -gt 0 ] && { echo "$ARQS" | grep -qE 'mudou|changed|affected' && ok "rodar só os testes do que mudou" || falta "rodar só os testes do que mudou"; }

# 7. tipo de conteúdo → receita a abrir
echo "$ARQS" | grep -qiE 'pergunt|quest|quiz|simulad|prova' && info "banco de questões → ver motor-teoria.md e motor-questao.md"
[ "$(echo "$ARQS" | grep -cE '\.(html|md)$')" -ge 5 ] && info "textos para leitura → ver motor-revtexto.md"
figs=$(echo "$CODIGO" | grep -E '\.(js|ts)$' | tr '\n' '\0' | xargs -0 grep -lE "createElementNS|getContext\(['\"]2d" 2>/dev/null | wc -l)
[ "$figs" -ge 2 ] && { echo "$ARQS" | grep -qiE 'kit' && ok "kit de peças de desenho" || info "$figs arquivo(s) desenham → ver kit-figuras.md"; }

# 8. a skill vem junto
d=.claude/skills/protocolo-token
for f in SKILL.md modelo-CLAUDE.md motor-questao.md motor-teoria.md motor-revtexto.md kit-figuras.md travas-e-barra.md diagnostico.sh; do
  [ -f "$d/$f" ] || faltam="$faltam $f"; done
[ -z "$faltam" ] && ok "skill completa no projeto" || falta "arquivos da skill no projeto:$faltam"
