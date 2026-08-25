#!/usr/bin/env bash
# Backup do CMS: banco + mídia. Ver docs/04-infra/backup-e-observabilidade.md.
#
# Roda pelo systemd timer (`atra-backup.timer`), diariamente. Também pode rodar
# à mão: `/opt/atra/infra/backup/backup.sh`
#
# ⚠️ O que se perde sem isto não volta: 213 artigos, 352 mídias e todo o
# trabalho editorial que o marketing fizer daqui em diante. O WordPress continua
# de pé como contingência até o cutover, mas o conteúdo **novo** só existe aqui.
set -Eeuo pipefail

RAIZ="${RAIZ:-/opt/atra}"
DESTINO="${DESTINO:-$RAIZ/backup}"
COMPOSE="docker compose -f $RAIZ/docker-compose.prod.yml --env-file $RAIZ/.env.prod"
CARIMBO="$(date -u +%Y%m%dT%H%M%SZ)"
MANTER_DIAS="${MANTER_DIAS:-14}"

# ⚠️ **Nunca** fazer `source .env.prod` aqui. O arquivo guarda o hash bcrypt
# com `$$` — escape do compose para `$` literal — e o bash expande `$$` para o
# PID do processo. Como o compose dá precedência ao ambiente do shell sobre o
# `--env-file`, o source contaminava o Caddy com um hash inválido e o punha em
# laço de reinício ("illegal base64 data"). Extrai-se só o necessário, por texto.
# ⚠️ O `|| true` cobre o pipeline sob `pipefail`: variável AUSENTE devolve
# vazio, não mata o script. Sem ele, o primeiro backup com BACKUP_S3_* ainda
# não configurado morria em silêncio antes do trap — saída 1, zero linhas.
valor() { { grep "^$1=" "$RAIZ/.env.prod" || true; } | head -1 | cut -d= -f2- | sed "s/^'//;s/'\$//"; }
POSTGRES_PASSWORD="$(valor POSTGRES_PASSWORD)"
BACKUP_S3_ENDPOINT="$(valor BACKUP_S3_ENDPOINT)"
BACKUP_S3_ACCESS_KEY="$(valor BACKUP_S3_ACCESS_KEY)"
BACKUP_S3_SECRET_KEY="$(valor BACKUP_S3_SECRET_KEY)"
BACKUP_S3_BUCKET="$(valor BACKUP_S3_BUCKET)"

mkdir -p "$DESTINO"
umask 077

erro() { echo "✖ falhou na linha $1" >&2; exit 1; }
trap 'erro $LINENO' ERR

echo "→ banco"
# ⚠️ Formato `custom` (-Fc), não SQL puro. É o que permite restaurar tabela por
# tabela e o que o `pg_restore` sabe paralelizar; um .sql de 200 MB restaura em
# série e sem escolha nenhuma.
$COMPOSE exec -T postgres pg_dump -U atra -d atra -Fc \
  > "$DESTINO/banco-$CARIMBO.dump"

echo "→ mídia"
# ⚠️ Container mínimo montando o volume, e **não** a imagem do MinIO: ela não
# traz `tar`. Ler o volume direto também é mais honesto — o backup não depende
# de o MinIO estar de pé nem de a API dele responder.
VOLUME_MIDIA="${VOLUME_MIDIA:-atra_miniodata}"
docker run --rm -v "$VOLUME_MIDIA:/data:ro" alpine:3 \
  tar -czf - -C /data . > "$DESTINO/midia-$CARIMBO.tar.gz"

echo "→ segredos"
# O `.env.prod` entra **cifrado**, com a mesma senha do banco derivada em KDF.
# Backup que restaura o banco e não tem PAYLOAD_SECRET não restaura o site:
# o Payload não valida sessão nem lê campo cifrado sem ele.
openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt \
  -pass "pass:$POSTGRES_PASSWORD" \
  -in "$RAIZ/.env.prod" -out "$DESTINO/segredos-$CARIMBO.env.enc"

# ⚠️ Rotação **depois** de os três terem sido escritos com sucesso. Apagar antes
# significa que uma falha no dump deixa o servidor sem backup nenhum.
echo "→ rotação (mantendo $MANTER_DIAS dias)"
find "$DESTINO" -maxdepth 1 -name 'banco-*.dump'      -mtime "+$MANTER_DIAS" -delete
find "$DESTINO" -maxdepth 1 -name 'midia-*.tar.gz'    -mtime "+$MANTER_DIAS" -delete
find "$DESTINO" -maxdepth 1 -name 'segredos-*.env.enc' -mtime "+$MANTER_DIAS" -delete

# ⚠️ Cópia externa: sem ela, o backup morre junto com a VPS que ele existe para
# proteger. Fica ligada assim que houver bucket (deploy-vps.md recomenda R2).
if [ -n "${BACKUP_S3_ENDPOINT:-}" ]; then
  echo "→ cópia externa"
  docker run --rm -v "$DESTINO:/backup:ro" --entrypoint sh minio/mc:latest -c "
    mc alias set remoto '$BACKUP_S3_ENDPOINT' '$BACKUP_S3_ACCESS_KEY' '$BACKUP_S3_SECRET_KEY' &&
    mc cp /backup/banco-$CARIMBO.dump /backup/midia-$CARIMBO.tar.gz /backup/segredos-$CARIMBO.env.enc \
       remoto/${BACKUP_S3_BUCKET}/"
else
  echo "⚠ sem cópia externa: BACKUP_S3_ENDPOINT não configurado"
fi

echo "✓ $CARIMBO — $(du -sh "$DESTINO" | cut -f1) em $DESTINO"
