#!/usr/bin/env bash
# Cria, ou acerta se já existir, a vigilância de um endereço do site no Google
# Cloud Monitoring (D-68): a checagem de uptime HTTPS, o canal de e-mail e as
# duas políticas de alerta — site fora do ar e certificado perto de vencer.
#
# Uso, com o gcloud de quem tem a conta (o Cloud Shell já vem pronto):
#
#     infra/monitoramento/criar-checagem-google.sh \
#         --projeto <id-do-projeto> --email <destino>[,<outro>] \
#         --url https://www.atra.com.br
#
# Os três também valem como variáveis: PROJETO, EMAIL_DO_ALERTA, URL_DO_SITE.
# A produção é `https://www.atra.com.br`, o único nome que serve o site (D-72):
# o apex e os outros domínios respondem 301, e uma checagem neles veria o
# redirect, não o site. Cada endereço ganha checagem e políticas próprias, e o
# canal de e-mail é o mesmo. `--remover` apaga a checagem e as políticas de um
# endereço; o canal fica, porque pode servir a outro.
#
# Rodar de novo não duplica nada. Cada recurso é achado pelo rótulo que o
# script põe nele e, se já existe, volta ao que está escrito aqui: rodar de novo
# também desfaz ajuste feito à mão no console — é assim que o teste do alerta
# termina. A checagem que perdeu o rótulo também é achada, pelo host e pelo
# nome que este script dá a ela (ver `checagens_do_endereco`).
#
# Runbook (rodar, testar o alerta, desligar): docs/05-operacao/monitoramento-de-uptime.md
#
# ⚠️ O repositório é público: projeto, conta e e-mail entram na hora de rodar,
# nunca escritos aqui.
set -Eeuo pipefail

# A rota do healthcheck do container (Dockerfile) e do deploy. Ela toca o banco,
# então um 200 com este corpo prova DNS, certificado, Caddy, Next e Postgres de
# uma vez. A home e /cases-de-sucesso não servem: são pré-renderizadas e
# respondem 200 do cache com o Postgres caído.
ROTA=/api/health
CONTEUDO_ESPERADO='"status":"ok"'

# Três regiões em três continentes, o mínimo que o Monitoring aceita. Cada
# região conta como uma execução: 3 por minuto dão ~130 mil por mês, e a cota
# gratuita é de 1 milhão por projeto — homologação e produção cabem juntas.
REGIOES="${REGIOES:-south-america,usa-virginia,europe}"
# A rota responde em menos de 1 s; 10 s sem resposta já é site fora para quem
# visita.
TEMPO_LIMITE=10
# Alerta quando 2 regiões ou mais falham por este tempo. Uma região sozinha é
# quase sempre a rede entre o Google e a VM, não o site. 3 minutos são 3
# checagens seguidas: a troca de containers do deploy, que dura segundos, passa
# sem alarme, e uma queda de verdade chega por e-mail em cerca de 5 minutos.
MINUTOS_FORA=3
# O Caddy renova o certificado com 30 dias de folga; abaixo de 20 é renovação
# travada há 10 dias (o mesmo limite do uptime.yml). ⚠️ Quando a Let's Encrypt
# encurtar a validade dos certificados, o Caddy passa a renovar mais perto do
# fim e 20 vira alarme falso: baixar este número.
DIAS_DO_CERTIFICADO="${DIAS_DO_CERTIFICADO:-20}"

# Rótulos que marcam o que este script criou. É por eles, e não pelo nome de
# exibição (editável no console), que o script acha o que já existe.
APP=atra-website
GERENCIADO_POR=criar-checagem-google

falha() { echo "✖ $*" >&2; exit 1; }
uso() {
  cat <<'USO'
uso: criar-checagem-google.sh --projeto <id> --email <destino>[,<outro>] --url https://<host>
     criar-checagem-google.sh --projeto <id> --url https://<host> --remover

  --projeto   id do projeto no Google Cloud (ou PROJETO)
  --email     destino do alerta; vários, separados por vírgula (ou EMAIL_DO_ALERTA)
  --url       origem do site em https, sem caminho (ou URL_DO_SITE)
  --remover   apaga a checagem e as políticas desse endereço

Ajustáveis por variável: REGIOES (mínimo 3), DIAS_DO_CERTIFICADO.
USO
}

PROJETO="${PROJETO:-}"
EMAIL_DO_ALERTA="${EMAIL_DO_ALERTA:-}"
URL_DO_SITE="${URL_DO_SITE:-}"
REMOVER=0
while [ $# -gt 0 ]; do
  case "$1" in
    --projeto | --email | --url)
      [ $# -ge 2 ] || falha "$1 pede um valor"
      case "$1" in
        --projeto) PROJETO=$2 ;;
        --email) EMAIL_DO_ALERTA=$2 ;;
        --url) URL_DO_SITE=$2 ;;
      esac
      shift 2
      ;;
    --projeto=*) PROJETO=${1#*=}; shift ;;
    --email=*) EMAIL_DO_ALERTA=${1#*=}; shift ;;
    --url=*) URL_DO_SITE=${1#*=}; shift ;;
    --remover) REMOVER=1; shift ;;
    -h | --help) uso; exit 0 ;;
    *) uso >&2; falha "opção desconhecida: $1" ;;
  esac
done

# ⚠️ Compatível com o bash 3.2 do macOS: sem `${x,,}`, sem `mapfile`, sem
# expandir array vazio sob `set -u`. No Cloud Shell o bash é novo, mas quem roda
# do próprio Mac não deveria ter de saber disso.
[ -n "$PROJETO" ] || { uso >&2; falha "falta o projeto (--projeto ou PROJETO)"; }
padrao='^[a-z][a-z0-9-]{4,28}[a-z0-9]$'
[[ $PROJETO =~ $padrao ]] || falha "id de projeto inválido: $PROJETO"

[ -n "$URL_DO_SITE" ] || { uso >&2; falha "falta a URL (--url ou URL_DO_SITE)"; }
URL_DO_SITE=$(printf '%s' "$URL_DO_SITE" | tr '[:upper:]' '[:lower:]')
URL_DO_SITE=${URL_DO_SITE%/}
padrao='^https://[a-z0-9.-]+$'
[[ $URL_DO_SITE =~ $padrao ]] \
  || falha "a URL é a origem do site em https, sem caminho nem porta (ex.: https://atra-hmg.duckdns.org): $URL_DO_SITE"
HOST=${URL_DO_SITE#https://}
# Valor de rótulo aceita só minúscula, número, hífen e sublinhado, até 63.
ALVO=$(printf '%s' "$HOST" | tr -c 'a-z0-9' '-' | cut -c1-63)
NOME_DA_CHECAGEM="ATRA $HOST$ROTA"
ROTULOS="app=$APP,target=$ALVO,managed_by=$GERENCIADO_POR"

EMAILS=()
if [ "$REMOVER" = 0 ]; then
  [ -n "$EMAIL_DO_ALERTA" ] || { uso >&2; falha "falta o e-mail de destino (--email ou EMAIL_DO_ALERTA)"; }
  padrao='^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  set -f # a lista é separada por espaço e vírgula, mas `*` não vira nome de arquivo
  for email in $(printf '%s' "$EMAIL_DO_ALERTA" | tr ',' ' '); do
    [[ $email =~ $padrao ]] || falha "e-mail inválido: $email"
    EMAILS+=("$email")
  done
  set +f
  [ ${#EMAILS[@]} -gt 0 ] || falha "nenhum e-mail em: $EMAIL_DO_ALERTA"
fi

padrao='^[a-z-]+(,[a-z-]+){2,}$'
[[ $REGIOES =~ $padrao ]] || falha "REGIOES pede ao menos 3, separadas por vírgula: $REGIOES"
N_REGIOES=$(printf '%s' "$REGIOES" | tr ',' '\n' | grep -c .)
padrao='^[1-9][0-9]*$'
[[ $DIAS_DO_CERTIFICADO =~ $padrao ]] || falha "DIAS_DO_CERTIFICADO tem que ser um número: $DIAS_DO_CERTIFICADO"

command -v gcloud >/dev/null 2>&1 || falha "falta o gcloud (https://cloud.google.com/sdk/docs/install), ou rode no Cloud Shell"
command -v curl >/dev/null 2>&1 || falha "falta o curl"
TOKEN=$(gcloud auth print-access-token 2>/dev/null) || falha "o gcloud não tem login: rode 'gcloud auth login'"

gc() { gcloud --quiet --project="$PROJETO" "$@"; }

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# --- Achar o que já existe ----------------------------------------------------
# A comparação dos rótulos é feita aqui, e não no `--filter` do gcloud: a lista
# é curta, e a igualdade exata não depende da semântica do filtro — o rótulo
# `atra-com-br` não pode achar `www-atra-com-br`.

# nome, app, alvo, host e nome de exibição de cada checagem, separados por
# tabulação. O nome de exibição vai por último: é o único com espaço.
listar_checagens() {
  gc monitoring uptime list-configs \
    --format='value(name,userLabels.app,userLabels.target,monitoredResource.labels.host,displayName)'
}
# As deste endereço: pelo rótulo, ou — sem rótulo nenhum — pelo host e pelo nome
# que este script dá. ⚠️ A segunda regra existe porque o gcloud apaga os
# rótulos da checagem quando o `update` leva `--set-regions`, mesmo com
# `--update-user-labels` na mesma linha (gcloud 588, provado em 26/10/2026).
# Só o rótulo, e a corrida seguinte não achava a checagem e criava outra,
# deixando as duas no ar. Checagem com rótulo de outro app, ou com outro nome,
# não é adotada: é de alguém.
checagens_do_endereco() {
  awk -F'\t' -v app="$APP" -v alvo="$ALVO" -v host="$HOST" -v nome="$NOME_DA_CHECAGEM" '
    ($2 == app && $3 == alvo) || ($2 == "" && $3 == "" && $4 == host && $5 == nome) { print $1 }'
}

politicas_do_alvo() { # tipo: down | tls
  gc monitoring policies list --format='value(name,userLabels.app,userLabels.target,userLabels.alert)' \
    | awk -F'\t' -v app="$APP" -v alvo="$ALVO" -v tipo="$1" '$2 == app && $3 == alvo && $4 == tipo { print $1 }'
}

# `sed -n 1p` e não `head -1`: o head fecha o cano antes do fim, o produtor
# morre de SIGPIPE e o `pipefail` derruba o script.
primeira() { sed -n 1p; }

# --- Remover --------------------------------------------------------------------
if [ "$REMOVER" = 1 ]; then
  echo "→ removendo a vigilância de $HOST em $PROJETO"
  # Políticas antes da checagem: a API recusa apagar checagem que política usa.
  for tipo in down tls; do
    politicas=$(politicas_do_alvo "$tipo")
    for politica in $politicas; do
      gc monitoring policies delete "$politica" >/dev/null
      echo "  − política $tipo: $politica"
    done
  done
  lista=$(listar_checagens)
  checagens=$(printf '%s\n' "$lista" | checagens_do_endereco)
  for checagem in $checagens; do
    gc monitoring uptime delete "$checagem" >/dev/null
    echo "  − checagem: $checagem"
  done
  echo "✓ nada mais vigia $HOST. O canal de e-mail ficou: ele pode servir a outro endereço."
  exit 0
fi

echo "→ API do Cloud Monitoring em $PROJETO"
# Projeto com VM costuma já ter a API ligada, e ligar pede uma permissão a mais
# que só criar alerta. Sem a permissão, segue: se a API estiver mesmo
# desligada, o passo seguinte falha dizendo isso.
gc services enable monitoring.googleapis.com \
  || echo "  ⚠️ não consegui ligar a API (falta permissão?); sigo assumindo que já está ligada" >&2

# --- Canal de e-mail --------------------------------------------------------------
# Pela API REST, com o token do gcloud: o canal só existe no `gcloud beta`, que
# pode não estar instalado — e, faltando, pede a instalação num prompt
# interativo no meio do script.
API="https://monitoring.googleapis.com/v3/projects/$PROJETO"
# O token vai num arquivo da pasta temporária (só o dono lê), e não na linha de
# comando do curl, onde qualquer usuário da máquina o veria no `ps`.
printf 'Authorization: Bearer %s\n' "$TOKEN" >"$TMP/autorizacao"
rest() { # MÉTODO caminho [opções do curl…] → JSON da resposta
  local metodo=$1 caminho=$2 saida
  shift 2
  if ! saida=$(curl -sS --fail-with-body -X "$metodo" \
    -H @"$TMP/autorizacao" -H 'Content-Type: application/json' \
    "$@" "$API/$caminho" 2>&1); then
    echo "✖ a API do Monitoring recusou $metodo $caminho:" >&2
    printf '%s\n' "$saida" >&2
    return 1
  fi
  printf '%s\n' "$saida"
}
# A API devolve JSON indentado, um campo por linha; o padrão casa só o nome de
# canal, que tem formato fixo. Evita depender de jq ou python na máquina.
nomes_de_canal() {
  { grep -oE '"name": *"projects/[^"]+/notificationChannels/[^"]+"' || true; } \
    | sed -E 's/.*"(projects\/[^"]+)"$/\1/'
}

CANAIS=()
garantir_canal() { # e-mail
  local email=$1 resposta nome
  resposta=$(rest GET notificationChannels -G \
    --data-urlencode "filter=type = \"email\" AND labels.email_address = \"$email\"")
  nome=$(printf '%s\n' "$resposta" | nomes_de_canal | primeira)
  if [ -n "$nome" ]; then
    echo "  ✓ canal de $email já existe"
    if printf '%s\n' "$resposta" | grep -qE '"enabled": *false'; then
      echo "  ⚠️ o canal de $email está desligado no console: o alerta não chega nele até religar" >&2
    fi
  else
    resposta=$(rest POST notificationChannels --data "{
      \"type\": \"email\",
      \"displayName\": \"Alerta de uptime ATRA: $email\",
      \"labels\": { \"email_address\": \"$email\" },
      \"userLabels\": { \"app\": \"$APP\", \"managed_by\": \"$GERENCIADO_POR\" },
      \"enabled\": true
    }")
    nome=$(printf '%s\n' "$resposta" | nomes_de_canal | primeira)
    [ -n "$nome" ] || falha "o canal de $email foi criado, mas a resposta não trouxe o nome"
    echo "  + canal de $email criado"
  fi
  CANAIS+=("$nome")
}

echo "→ canais de e-mail"
for email in "${EMAILS[@]}"; do garantir_canal "$email"; done

# --- Checagem de uptime -------------------------------------------------------------
# Os rótulos vão pela API REST, e não pelo `--update-user-labels` do gcloud: ver
# `checagens_do_endereco`. O PATCH com `updateMask=userLabels` não toca no resto.
gravar_rotulos() { # nome da checagem
  rest PATCH "uptimeCheckConfigs/${1##*/}?updateMask=userLabels" --data "{
    \"userLabels\": { \"app\": \"$APP\", \"target\": \"$ALVO\", \"managed_by\": \"$GERENCIADO_POR\" }
  }" >/dev/null
}

echo "→ checagem de $HOST$ROTA"
lista=$(listar_checagens)
checagens=$(printf '%s\n' "$lista" | checagens_do_endereco)
CHECAGEM=$(printf '%s\n' "$checagens" | primeira)
avulsas=$(printf '%s\n' "$lista" | awk -F'\t' -v app="$APP" -v host="$HOST" -v esta="$CHECAGEM" \
  '$4 == host && $2 != app && $1 != esta { print $1 }')
if [ -n "$avulsas" ]; then
  echo "  ⚠️ há checagem de $HOST criada fora deste script; confira se não repete esta:" >&2
  # shellcheck disable=SC2086 # um nome por linha, sem espaço: separar é o objetivo
  printf '     %s\n' $avulsas >&2
fi
if [ -z "$CHECAGEM" ]; then
  gc monitoring uptime create "$NOME_DA_CHECAGEM" \
    --resource-type=uptime-url --resource-labels="host=$HOST,project_id=$PROJETO" \
    --protocol=https --port=443 --path="$ROTA" --validate-ssl=true \
    --status-classes=2xx --matcher-type=contains-string --matcher-content="$CONTEUDO_ESPERADO" \
    --period=1 --timeout="$TEMPO_LIMITE" --regions="$REGIOES" \
    --user-labels="$ROTULOS" >/dev/null
  CHECAGEM=$(listar_checagens | checagens_do_endereco | primeira)
  [ -n "$CHECAGEM" ] || falha "a checagem foi criada, mas não aparece na lista — confira no console"
  echo "  + criada"
else
  [ "$(printf '%s\n' "$checagens" | wc -l | tr -d ' ')" = 1 ] \
    || echo "  ⚠️ mais de uma checagem de $HOST; acerto só a primeira — apague as outras no console" >&2
  # Host, protocolo e porta não mudam numa checagem existente (o recurso
  # monitorado é imutável); como o rótulo vem do host, nem precisariam.
  gc monitoring uptime update "$CHECAGEM" \
    --display-name="$NOME_DA_CHECAGEM" --path="$ROTA" --validate-ssl=true \
    --set-status-classes=2xx --matcher-type=contains-string --matcher-content="$CONTEUDO_ESPERADO" \
    --period=1 --timeout="$TEMPO_LIMITE" --set-regions="$REGIOES" >/dev/null
  gravar_rotulos "$CHECAGEM"
  # Prova, e não confiança: sem o rótulo, a próxima corrida dependeria só da
  # regra do nome, que some se alguém renomear a checagem no console.
  listar_checagens | awk -F'\t' -v c="$CHECAGEM" -v app="$APP" -v alvo="$ALVO" \
    '$1 == c && $2 == app && $3 == alvo { achou = 1 } END { exit !achou }' \
    || falha "a checagem $CHECAGEM foi acertada, mas ficou sem o rótulo — confira no console"
  echo "  ✓ já existia; acertada"
fi
ID_DA_CHECAGEM=${CHECAGEM##*/}

# --- Políticas de alerta ------------------------------------------------------------
# Escritas inteiras a cada corrida: o `update` com arquivo substitui a política,
# então o que estiver aqui vence o que foi mexido no console.
CANAIS_JSON=""
for canal in "${CANAIS[@]}"; do CANAIS_JSON="${CANAIS_JSON:+$CANAIS_JSON, }\"$canal\""; done
RUNBOOK=https://github.com/G-ferrari/ATRA-Website/blob/main/docs/05-operacao/monitoramento-de-uptime.md

# Condição do modelo do Google para checagem de uptime: em cada região vale o
# resultado mais recente (ALIGN_NEXT_OLDER numa janela de 20 min), conta-se
# quantas regiões estão falhando (REDUCE_COUNT_FALSE), e o alerta abre quando
# passam de 1 por MINUTOS_FORA seguidos. Avisa também quando fecha (CLOSED).
cat >"$TMP/down.json" <<JSON
{
  "displayName": "ATRA fora do ar: $HOST",
  "userLabels": { "app": "$APP", "target": "$ALVO", "alert": "down", "managed_by": "$GERENCIADO_POR" },
  "severity": "CRITICAL",
  "enabled": true,
  "combiner": "OR",
  "notificationChannels": [ $CANAIS_JSON ],
  "alertStrategy": { "notificationPrompts": [ "OPENED", "CLOSED" ] },
  "documentation": {
    "mimeType": "text/markdown",
    "content": "\`$HOST$ROTA\` falhou em 2 ou mais das $N_REGIOES regiões por $MINUTOS_FORA minutos seguidos. A rota toca o banco: a causa pode ser a VM, o DNS, o certificado, o Caddy, o Next ou o Postgres.\n\nNa VM: \`docker compose -f docker-compose.prod.yml ps\` em /opt/atra e \`journalctl CONTAINER_NAME=atra-web-1 --since '15 min ago'\`.\n\nRunbook: $RUNBOOK"
  },
  "conditions": [
    {
      "displayName": "$HOST$ROTA falhando em 2 regiões ou mais",
      "conditionThreshold": {
        "filter": "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.label.check_id=\"$ID_DA_CHECAGEM\" AND resource.type=\"uptime_url\"",
        "aggregations": [
          {
            "alignmentPeriod": "1200s",
            "perSeriesAligner": "ALIGN_NEXT_OLDER",
            "crossSeriesReducer": "REDUCE_COUNT_FALSE",
            "groupByFields": [ "resource.label.*" ]
          }
        ],
        "comparison": "COMPARISON_GT",
        "thresholdValue": 1,
        "duration": "$((MINUTOS_FORA * 60))s",
        "trigger": { "count": 1 }
      }
    }
  ]
}
JSON

# O mesmo modelo, com a métrica de validade do certificado, que a checagem
# HTTPS com validação de SSL publica sozinha. Com o site fora não há dado, e
# esta política fica quieta: o alerta de queda já disse o que importa.
cat >"$TMP/tls.json" <<JSON
{
  "displayName": "ATRA certificado perto de vencer: $HOST",
  "userLabels": { "app": "$APP", "target": "$ALVO", "alert": "tls", "managed_by": "$GERENCIADO_POR" },
  "severity": "WARNING",
  "enabled": true,
  "combiner": "OR",
  "notificationChannels": [ $CANAIS_JSON ],
  "alertStrategy": { "notificationPrompts": [ "OPENED", "CLOSED" ] },
  "documentation": {
    "mimeType": "text/markdown",
    "content": "O certificado de \`$HOST\` vence em menos de $DIAS_DO_CERTIFICADO dias. O Caddy renova sozinho com 30 dias de folga: se chegou aqui, a renovação está falhando. Ver o log do Caddy na VM: \`journalctl CONTAINER_NAME=atra-caddy-1 --since '1 day ago' | grep -i acme\`.\n\nRunbook: $RUNBOOK"
  },
  "conditions": [
    {
      "displayName": "certificado de $HOST com menos de $DIAS_DO_CERTIFICADO dias",
      "conditionThreshold": {
        "filter": "metric.type=\"monitoring.googleapis.com/uptime_check/time_until_ssl_cert_expires\" AND metric.label.check_id=\"$ID_DA_CHECAGEM\" AND resource.type=\"uptime_url\"",
        "aggregations": [
          {
            "alignmentPeriod": "1200s",
            "perSeriesAligner": "ALIGN_NEXT_OLDER",
            "crossSeriesReducer": "REDUCE_MEAN",
            "groupByFields": [ "resource.label.*" ]
          }
        ],
        "comparison": "COMPARISON_LT",
        "thresholdValue": $DIAS_DO_CERTIFICADO,
        "duration": "600s",
        "trigger": { "count": 1 }
      }
    }
  ]
}
JSON

garantir_politica() { # tipo arquivo
  local tipo=$1 arquivo=$2 politicas politica
  politicas=$(politicas_do_alvo "$tipo")
  politica=$(printf '%s\n' "$politicas" | primeira)
  if [ -z "$politica" ]; then
    gc monitoring policies create --policy-from-file="$arquivo" >/dev/null
    politica=$(politicas_do_alvo "$tipo" | primeira)
    [ -n "$politica" ] || falha "a política \"$tipo\" foi criada, mas não aparece na lista — confira no console"
    echo "  + \"$tipo\" criada"
  else
    gc monitoring policies update "$politica" --policy-from-file="$arquivo" >/dev/null
    echo "  ✓ \"$tipo\" já existia; acertada"
  fi
}

echo "→ políticas de alerta"
garantir_politica down "$TMP/down.json"
garantir_politica tls "$TMP/tls.json"

cat <<FIM
✓ $URL_DO_SITE$ROTA vigiado a cada minuto, de $REGIOES
  alerta por e-mail (${EMAILS[*]}): $HOST fora em 2 regiões por $MINUTOS_FORA minutos,
  ou certificado com menos de $DIAS_DO_CERTIFICADO dias; avisa também quando volta.
  painel: https://console.cloud.google.com/monitoring/uptime?project=$PROJETO

  Testar o alerta sem tocar no site (a checagem passa a exigir um texto que a
  rota não devolve; o e-mail chega em ~5 min):
    gcloud monitoring uptime update $ID_DA_CHECAGEM --project=$PROJETO \\
      --matcher-type=contains-string --matcher-content='"status":"teste-de-alerta"' \\
      --update-user-labels=$ROTULOS
  Depois do e-mail, rode este script de novo, com os mesmos argumentos, para desfazer.
FIM
