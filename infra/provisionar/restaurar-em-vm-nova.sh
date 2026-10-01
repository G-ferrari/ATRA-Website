#!/usr/bin/env bash
# Restaura um backup do `backup.sh` numa VM **nova**, com volumes vazios.
# É a mudança de servidor: Hostinger → Google Cloud (30/09/2026).
#
# Uso, na VM nova, dentro de /opt/atra, com `.env.prod` já no lugar:
#
#     infra/provisionar/restaurar-em-vm-nova.sh backup/banco-<carimbo>.dump \
#         backup/midia-<carimbo>.tar.gz [backup/imagem-minio.tar.gz]
#
# Depois dele, `infra/deploy/deploy.sh <sha>` faz o resto: migração, build e
# subida com healthcheck.
#
# ⚠️ Recusa rodar sobre banco com conteúdo. Restaurar por cima de produção é o
# tipo de erro que não tem volta; `FORCAR=1` existe para quem sabe o que faz.
set -Eeuo pipefail

BANCO="${1:?uso: restaurar-em-vm-nova.sh <banco.dump> <midia.tar.gz> [imagem-minio.tar.gz]}"
MIDIA="${2:?falta o arquivo de mídia}"
IMAGEM_MINIO="${3:-}"
RAIZ="${RAIZ:-/opt/atra}"
cd "$RAIZ"
COMPOSE="docker compose -f docker-compose.prod.yml --env-file .env.prod"
VOLUME_MIDIA="${VOLUME_MIDIA:-atra_miniodata}"

[ -f .env.prod ] || { echo "✖ falta $RAIZ/.env.prod" >&2; exit 1; }
[ -f "$BANCO" ] && [ -f "$MIDIA" ] || { echo "✖ arquivo de backup não encontrado" >&2; exit 1; }

# ⚠️ A imagem do MinIO saiu do Docker Hub e do quay.io em set/2026 (P-32). A
# Hostinger só a tem em cache. Carregar a **mesma** imagem exportada de lá
# garante que o servidor lê o volume restaurado sem surpresa de versão.
if [ -n "$IMAGEM_MINIO" ]; then
  echo "→ imagem do MinIO"
  gunzip -c "$IMAGEM_MINIO" | docker load
fi

echo "→ banco e storage"
$COMPOSE up -d --wait postgres minio >/dev/null

tabelas=$($COMPOSE exec -T postgres psql -U atra -d atra -t -A \
  -c "select count(*) from information_schema.tables where table_schema='public';" </dev/null | tr -d '[:space:]')
if [ "${tabelas:-0}" -gt 0 ] && [ "${FORCAR:-0}" != 1 ]; then
  echo "✖ o banco já tem $tabelas tabelas — isto é para VM nova. FORCAR=1 para sobrescrever" >&2
  exit 1
fi

echo "→ restaurando o banco"
# Sem `--jobs`, pelo mesmo motivo do testar-restore.sh: por stdin o
# paralelismo aborta sem restaurar nada.
$COMPOSE exec -T postgres pg_restore -U atra -d atra --no-owner --clean --if-exists < "$BANCO" >/dev/null 2>&1 \
  || echo "  (pg_restore emitiu avisos — o que vale é a conferência abaixo)"

echo "→ restaurando a mídia"
# Volume lido e escrito direto, como o backup faz: não depende da API do MinIO.
$COMPOSE stop minio >/dev/null
docker run --rm -v "$VOLUME_MIDIA:/data" -v "$(cd "$(dirname "$MIDIA")" && pwd):/entrada:ro" alpine:3 \
  sh -c "rm -rf /data/* /data/.minio.sys && tar -xzf /entrada/$(basename "$MIDIA") -C /data"
$COMPOSE up -d --wait minio >/dev/null

echo "→ conferindo"
falhou=0
while IFS='|' read -r tabela minimo; do
  [ -n "$tabela" ] || continue
  n=$({ $COMPOSE exec -T postgres psql -U atra -d atra -t -A \
      -c "select count(*) from $tabela;" 2>/dev/null </dev/null || true; } | tr -d '[:space:]')
  n=${n:-0}
  if [ "$n" -ge "$minimo" ]; then printf "  ✓ %-14s %6s\n" "$tabela" "$n"
  else printf "  ✖ %-14s %6s — esperado ao menos %s\n" "$tabela" "$n" "$minimo"; falhou=1; fi
done <<'TABELAS'
posts|200
media|300
cases|4
solutions|13
users|1
TABELAS

objetos=$(docker run --rm -v "$VOLUME_MIDIA:/data:ro" alpine:3 sh -c 'find /data/atra-media -type f | wc -l' | tr -d '[:space:]')
echo "  mídia: $objetos arquivos em atra-media"
[ "${objetos:-0}" -gt 0 ] || falhou=1

[ "$falhou" -eq 0 ] || { echo "✖ restauração incompleta — não subir o site" >&2; exit 1; }
echo "✓ dados restaurados. Próximo passo: infra/deploy/deploy.sh <sha>"
