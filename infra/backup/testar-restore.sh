#!/usr/bin/env bash
# Restaura o último backup num banco descartável e confere que o conteúdo veio.
#
# ⚠️ Existe porque **backup que roda não é backup**. O critério de MIG-123 pede
# restore verificado em base limpa, e não o dump executando sem erro: dump
# corrompido, dump de banco vazio e dump com uma tabela faltando saem todos com
# código 0. O que prova é contar linha do outro lado.
#
# Não toca no banco de produção: cria `atra_restore_teste`, confere e derruba.
set -Eeuo pipefail

RAIZ="${RAIZ:-/opt/atra}"
DESTINO="${DESTINO:-$RAIZ/backup}"
COMPOSE="docker compose -f $RAIZ/docker-compose.prod.yml --env-file $RAIZ/.env.prod"
BANCO_TESTE="atra_restore_teste"


ULTIMO="$(ls -1t "$DESTINO"/banco-*.dump 2>/dev/null | head -1 || true)"
[ -n "$ULTIMO" ] || { echo "✖ nenhum dump em $DESTINO" >&2; exit 1; }
echo "→ testando $(basename "$ULTIMO") ($(du -h "$ULTIMO" | cut -f1))"

limpar() { $COMPOSE exec -T postgres psql -U atra -d postgres \
  -c "DROP DATABASE IF EXISTS $BANCO_TESTE;" >/dev/null 2>&1 || true; }
trap limpar EXIT

limpar
$COMPOSE exec -T postgres psql -U atra -d postgres -c "CREATE DATABASE $BANCO_TESTE;" >/dev/null

# `--no-owner` porque o dono do banco de teste é o mesmo papel, mas o dump
# carrega o do original; sem isso o restore reclama de papel inexistente.
#
# ⚠️ Sem `--jobs`: restauração paralela exige arquivo posicionável, e por stdin
# o pg_restore **aborta sem restaurar nada** — o teste então contava um banco
# vazio. Foi exatamente o cenário que este script existe para pegar, e ele
# pegou; só morria sem imprimir o veredito (ver a nota no laço).
$COMPOSE exec -T postgres pg_restore -U atra -d "$BANCO_TESTE" --no-owner < "$ULTIMO" >/dev/null 2>&1 \
  || echo "  (pg_restore emitiu avisos — o que vale é a conferência abaixo)"

echo "→ conferindo"
falhou=0
# As contagens que importam. Zero em qualquer uma é backup inútil, e é
# exatamente o que um dump de banco vazio produziria sem erro.
while IFS='|' read -r tabela minimo; do
  # ⚠️ `[ -n ... ] || continue`, e não `[ -z ... ] && continue`. A segunda
  # forma devolve 1 quando a variável tem valor, e com `set -e` isso encerra
  # o script na primeira volta — sem mensagem, como se nada houvesse a testar.
  [ -n "$tabela" ] || continue
  # ⚠️ `</dev/null` obrigatório. `docker compose exec -T` lê a entrada padrão,
  # e dentro de um `while read` isso engole a lista de tabelas do heredoc: o
  # laço roda uma vez e termina em silêncio, como se estivesse tudo certo.
  # ⚠️ `|| true` dentro da substituição: com `pipefail`, uma tabela ausente faz
  # o psql falhar e o `set -e` encerrar o script **antes** do veredito. A falha
  # certa aqui é `n=0` e o ✖ na tela, não um término mudo.
  n=$({ $COMPOSE exec -T postgres psql -U atra -d "$BANCO_TESTE" -t -A \
      -c "select count(*) from $tabela;" 2>/dev/null </dev/null || true; } | tr -d '[:space:]')
  n=${n:-0}
  if [ "$n" -ge "$minimo" ]; then
    printf "  ✓ %-14s %6s (mínimo %s)\n" "$tabela" "$n" "$minimo"
  else
    printf "  ✖ %-14s %6s — esperado ao menos %s\n" "$tabela" "$n" "$minimo"
    falhou=1
  fi
done <<'TABELAS'
posts|200
media|300
cases|4
solutions|13
users|1
TABELAS

if [ "$falhou" -ne 0 ]; then
  echo "✖ restore NÃO confiável — não conte com este backup" >&2
  exit 1
fi
echo "✓ restore verificado em base limpa"
