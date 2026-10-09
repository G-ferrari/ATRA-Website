#!/usr/bin/env bash
# Deploy na VM, chamado pelo workflow (`deploy.yml`, no executor instalado na
# própria VM) depois de o código chegar a /opt/atra. Quem confere o código antes
# é o `pnpm ship`, na máquina de quem publica (D-59).
# Uso: /opt/atra/infra/deploy/deploy.sh <sha>
#
# A ordem é a de deploy-vps.md, com um ajuste que a prática impôs:
#
#   migrator → migração → build completo → troca → healthcheck → rollback se falhar
#
# O build completo vem **depois** da migração porque ele pré-renderiza as 563
# páginas lendo o banco: código novo que consulta coluna nova quebraria o build
# antes de a migração criar a coluna. O migrator não tem esse problema — é
# código + dependências, sem build (ver o estágio no Dockerfile).
set -Eeuo pipefail

SHA="${1:?uso: deploy.sh <sha>}"
RAIZ=/opt/atra
cd "$RAIZ"
COMPOSE="docker compose -f docker-compose.prod.yml --env-file .env.prod"

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
SITE_URL="$(valor SITE_URL)"
TAG_ANTERIOR="$(valor TAG)"
# O primeiro nome de `SITE_HOST` é o que a conferência externa testa. Era o
# hostname da Hostinger escrito à mão, e a troca para a VM do Google (30/09)
# teria reprovado todo deploy bom por falta de certificado naquele nome.
HOST_EXTERNO="$(valor SITE_HOST | cut -d, -f1 | tr -d '[:space:]')"

echo "→ deploy de $SHA (atual: $TAG_ANTERIOR)"

echo "→ migrator"
docker build --target migrator -t "atra-website:$SHA-migrator" . >/dev/null

echo "→ migrações"
TAG="$SHA" $COMPOSE --profile tarefas run --rm migrate 2>&1 | grep -E "Migrating|Migrated|Done|Error" | tail -8

echo "→ build completo"
# ⚠️ `--no-cache-filter build,runner`, e não só `build`. O BuildKit reaproveita a
# camada de COPY do runner mesmo quando o estágio build foi refeito — foi assim
# que um deploy publicou HTML de três horas antes com o log dizendo "563 páginas
# geradas". Invalidar os dois é a única combinação que provou entregar o que o
# build gerou. Ver a armadilha no CLAUDE.md.
docker build --target runner --network=host --no-cache-filter build,runner \
  --build-arg DATABASE_URI="postgres://atra:${POSTGRES_PASSWORD}@127.0.0.1:5432/atra" \
  --build-arg NEXT_PUBLIC_SITE_URL="${SITE_URL}" \
  --build-arg S3_ENDPOINT="http://127.0.0.1:9000" \
  --build-arg S3_BUCKET="atra-media" \
  --build-arg SENTRY_RELEASE="$SHA" \
  --build-arg NEXT_PUBLIC_SENTRY_DSN="$(valor NEXT_PUBLIC_SENTRY_DSN)" \
  -t "atra-website:$SHA" . 2>&1 | grep --line-buffered -E "Generating static pages|ERROR" \
  || true  # o veredito é do healthcheck adiante; aqui é só progresso fluindo
# ⚠️ `--line-buffered` e sem `tail`: o progresso precisa **fluir** durante os
# ~5min de build — era o silêncio deste trecho que deixava o SSH do CI ocioso
# até o caminho de rede derrubar a conexão ("Broken pipe").

echo "→ troca"
sed -i "s/^TAG=.*/TAG=$SHA/" .env.prod

rollback() {
  echo "✖ healthcheck reprovou — voltando para $TAG_ANTERIOR" >&2
  sed -i "s/^TAG=.*/TAG=$TAG_ANTERIOR/" .env.prod
  $COMPOSE up -d --force-recreate --wait web caddy >/dev/null 2>&1 || true
  exit 1
}
# `--wait` respeita o healthcheck da imagem (start-period de 60s): container que
# não migrou ou não sobe não recebe tráfego, e o anterior volta.
$COMPOSE up -d --force-recreate --wait web caddy 2>&1 | grep -vE "variable is not set" | tail -2 || rollback

echo "→ conferência externa"
# O `--wait` de cima já provou o healthcheck interno (/api/health responde
# dentro do container). Isto prova o resto da cadeia: TLS válido, Caddy de pé e
# roteando. **401 é sucesso** — o site é protegido por senha, e chegar na camada
# de autenticação exige que tudo antes dela funcione. O que reprova é 5xx,
# timeout ou TLS inválido (`-k` não entra de propósito).
# ⚠️ `--resolve` aponta o hostname para 127.0.0.1: de dentro da VPS o IP
# público não é alcançável (hairpin NAT) e o curl devolvia 000 — derrubando
# deploy bom. Com o resolve, o TLS continua sendo validado contra o certificado
# real; só o caminho de rede muda. Três tentativas porque o Caddy acabou de ser
# recriado.
codigo=000
for _ in 1 2 3; do
  codigo=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 \
    --resolve "$HOST_EXTERNO:443:127.0.0.1" \
    "https://$HOST_EXTERNO/" || true)
  case "$codigo" in 200|401) break ;; esac
  sleep 5
done
case "$codigo" in
  200|401) : ;;
  *) echo "  resposta externa: $codigo" >&2; rollback ;;
esac

echo "→ retenção (5 imagens)"
# Rollback precisa de alvo: as 5 últimas ficam, o resto sai. `local` e tags de
# trabalho (`check:*`) não contam para a retenção — são varridos sempre.
docker images "atra-website" --format '{{.Tag}} {{.CreatedAt}}' \
  | grep -vE "migrator" | sort -rk2 | awk 'NR>5 {print $1}' \
  | xargs -r -I{} docker rmi "atra-website:{}" 2>/dev/null || true
docker image prune -f >/dev/null

echo "✓ $SHA no ar"
