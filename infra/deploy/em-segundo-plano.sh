#!/usr/bin/env bash
# Deploy sem prender o executor do CI (D-58).
#
#   em-segundo-plano.sh --disparar <sha> <dono/repositório>
#       o que o workflow chama: solta o deploy na VM e volta em segundos.
#   em-segundo-plano.sh <sha> <dono/repositório>
#       o deploy em si — trava, log, e o aviso do resultado ao GitHub.
#
# Por que existe: o `deploy.sh` leva ~14 min (o build pré-renderiza 563
# páginas), e o executor do GitHub passava esse tempo parado, de SSH aberto,
# gastando a franquia de minutos. Aqui quem espera é a VM.
#
# ⚠️ O workflow só usa este caminho quando o `.env.prod` tem
# `GITHUB_STATUS_TOKEN`. Sem o token não haveria quem contasse que o deploy
# reprovou — ele falharia calado, com o CI verde —, e por isso sem o token o
# workflow continua esperando o `deploy.sh`, como sempre.
#
# O `deploy.sh` não muda: é a rotina provada, e continua podendo ser chamada à
# mão. Isto é só a casca em volta dela.
set -Euo pipefail

RAIZ="${ATRA_RAIZ:-/opt/atra}"
EU="$(readlink -f "$0")"

MODO=deploy
if [ "${1:-}" = "--disparar" ]; then
  MODO=disparar
  shift
fi
SHA="${1:?uso: em-segundo-plano.sh [--disparar] <sha> <dono/repositório>}"
REPO="${2:?uso: em-segundo-plano.sh [--disparar] <sha> <dono/repositório>}"

# Os dois valores entram em URL e em JSON: só passam no formato esperado.
case "$SHA" in *[!0-9a-f]* | "") echo "✖ sha inválido: $SHA" >&2; exit 2 ;; esac
[ "${#SHA}" -eq 40 ] || { echo "✖ sha inválido: $SHA" >&2; exit 2; }
case "$REPO" in */*/* | *[!A-Za-z0-9._/-]* | /* | */ | "") echo "✖ repositório inválido: $REPO" >&2; exit 2 ;; esac
case "$REPO" in */*) : ;; *) echo "✖ repositório inválido: $REPO" >&2; exit 2 ;; esac

RECIBO="$RAIZ/.deploy-recebido-$SHA"
EM_CURSO="$RAIZ/.deploy-em-curso"
LOG="$RAIZ/deploy.log"

if [ "$MODO" = disparar ]; then
  rm -f "$RECIBO"
  # `setsid` + `nohup` + os três descritores fechados: o deploy sobrevive ao fim
  # da sessão SSH, e o `ssh` não fica pendurado esperando a saída dele.
  nohup setsid "$EU" "$SHA" "$REPO" >/dev/null 2>&1 </dev/null &
  # O recibo prova que o deploy **começou**. O resultado não se espera aqui.
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    if [ -e "$RECIBO" ]; then
      echo "✓ deploy de $SHA disparado — o resultado chega ao commit como status \"deploy\" (log: $LOG)"
      exit 0
    fi
    sleep 1
  done
  echo "✖ o deploy de $SHA não deu sinal de partida" >&2
  exit 1
fi

# ⚠️ Nunca `source .env.prod` — ver o `deploy.sh`. Extrai-se por texto.
valor() { { grep "^$1=" "$RAIZ/.env.prod" || true; } | head -1 | cut -d= -f2- | sed "s/^'//;s/'\$//"; }
TOKEN="$(valor GITHUB_STATUS_TOKEN)"

# O token vai pela entrada padrão (`--config -`), e não num argumento: argumento
# aparece no `ps` para qualquer processo da VM.
# ⚠️ Nada daqui pode derrubar o deploy: avisar é o de menos (`|| true`).
api() { # caminho, corpo
  [ -n "$TOKEN" ] || return 0
  printf 'header = "Authorization: Bearer %s"\n' "$TOKEN" |
    curl -sS -o /dev/null --max-time 20 --config - -X POST \
      -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" \
      "https://api.github.com/repos/$REPO/$1" -d "$2" || true
}
avisar() { api "statuses/$SHA" "{\"state\":\"$1\",\"context\":\"deploy\",\"description\":\"$2\"}"; }

# Recibos de deploy que morreu no meio (VM reiniciada) não ficam para sempre.
find "$RAIZ" -maxdepth 1 -name '.deploy-recebido-*' -mmin +180 -delete 2>/dev/null || true
touch "$RECIBO"

# Um deploy de cada vez: interromper entre a migração e a troca de imagem deixa
# o banco à frente do site. Era o `concurrency` do job que garantia isso, e ele
# só vale enquanto o job espera.
exec 9>"$RAIZ/.deploy.lock"
if ! flock -n 9; then
  # O mesmo commit já está no meio do deploy: o disparo veio em dobro (o
  # workflow repete o SSH quando a conexão cai). Não há o que fazer.
  if [ "$(cat "$EM_CURSO" 2>/dev/null || true)" = "$SHA" ]; then exit 0; fi
  # Outro commit está no meio: espera a vez.
  flock 9
fi
echo "$SHA" >"$EM_CURSO"
trap 'rm -f "$EM_CURSO" "$RECIBO"' EXIT

printf '\n=== %s · deploy de %s\n' "$(date -u +%FT%TZ)" "$SHA" >>"$LOG"
avisar pending "Deploy em andamento na VM"

if "$RAIZ/infra/deploy/deploy.sh" "$SHA" >>"$LOG" 2>&1; then
  printf '=== %s · no ar\n' "$(date -u +%FT%TZ)" >>"$LOG"
  avisar success "No ar"
else
  codigo=$?
  printf '=== %s · reprovado (código %s)\n' "$(date -u +%FT%TZ)" "$codigo" >>"$LOG"
  avisar failure "Deploy reprovado na VM; ver deploy.log"
  # Status de commit não manda e-mail; issue manda, para quem acompanha o
  # repositório. ⚠️ Sem trecho do log no corpo: a saída do build pode trazer a
  # linha de comando, com a senha do banco.
  api issues "{\"title\":\"Deploy de ${SHA:0:7} reprovado\",\"labels\":[\"deploy\"],\"body\":\"O deploy do commit $SHA foi reprovado na VM. Se a troca chegou a acontecer, o healthcheck devolveu a versão anterior.\\n\\nO que aconteceu está em \`$LOG\`, na VM.\"}"
fi

# O log não cresce para sempre.
tail -n 4000 "$LOG" >"$LOG.tmp" && mv "$LOG.tmp" "$LOG"
