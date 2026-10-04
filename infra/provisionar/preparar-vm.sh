#!/usr/bin/env bash
# Prepara uma VM Debian/Ubuntu vazia para receber o site. Idempotente: rodar de
# novo não duplica nada. Uso, na VM, com o código já em /opt/atra:
#
#     sudo /opt/atra/infra/provisionar/preparar-vm.sh
#
# Escrito para a VM da ATRA no Google Cloud (30/09/2026), que substitui a VPS da
# Hostinger. O que ele faz é o que a Hostinger tinha e ninguém escreveu: Docker,
# swap, a pasta do site com dono certo e o timer de backup.
set -Eeuo pipefail

[ "$(id -u)" -eq 0 ] || { echo "✖ rodar com sudo" >&2; exit 1; }
DONO="${SUDO_USER:-root}"
RAIZ=/opt/atra

. /etc/os-release
case "$ID" in debian|ubuntu) : ;; *) echo "✖ só Debian/Ubuntu (achei $ID)" >&2; exit 1 ;; esac

echo "→ Docker"
# Repositório oficial da Docker, e não o `docker.io` da distribuição: o pacote
# da distro atrasa versões do Compose v2, e o deploy usa `--wait`.
if ! command -v docker >/dev/null; then
  apt-get update -qq
  apt-get install -y -qq ca-certificates curl rsync >/dev/null
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL "https://download.docker.com/linux/$ID/gpg" -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/$ID $VERSION_CODENAME stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -qq
  apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >/dev/null
fi
systemctl enable --now docker >/dev/null
docker compose version

echo "→ swap"
# ⚠️ Sem swap o build do Next mata o Postgres: na Hostinger foram 70 OOM kills
# antes do swapfile de 4 GB. O build roda na mesma máquina que o site porque as
# páginas são pré-renderizadas lendo o banco (deploy-vps.md).
if ! swapon --show | grep -q .; then
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
echo 'vm.swappiness=10' > /etc/sysctl.d/99-atra.conf
sysctl -q -p /etc/sysctl.d/99-atra.conf

echo "→ pasta e permissões"
mkdir -p "$RAIZ/backup"
chown -R "$DONO:$DONO" "$RAIZ"
chmod 700 "$RAIZ/backup"
# O CI entra como este usuário e roda `docker` sem sudo.
[ "$DONO" = root ] || usermod -aG docker "$DONO"

echo "→ journald e pasta de logs"
# Os containers logam no journald do host (compose, `logging: journald`): o log
# sobrevive ao `--force-recreate` de cada deploy e se consulta por período.
# Persistente em disco e com teto, senão o padrão do Ubuntu guarda em RAM e
# descarta no reboot. 30 dias é a retenção que backup-e-observabilidade.md pede.
mkdir -p /etc/systemd/journald.conf.d /var/log/journal
cat > /etc/systemd/journald.conf.d/atra.conf <<'JOURNAL'
[Journal]
Storage=persistent
SystemMaxUse=2G
MaxRetentionSec=30day
JOURNAL
systemctl restart systemd-journald
# O Caddy escreve o log de acesso aqui (bind mount do compose).
mkdir -p "$RAIZ/logs/caddy"
chown -R "$DONO:$DONO" "$RAIZ/logs"

echo "→ timer de backup"
if [ -f "$RAIZ/infra/backup/atra-backup.service" ]; then
  cp "$RAIZ/infra/backup/atra-backup.service" "$RAIZ/infra/backup/atra-backup.timer" /etc/systemd/system/
  chmod +x "$RAIZ"/infra/backup/*.sh
  systemctl daemon-reload
  systemctl enable --now atra-backup.timer >/dev/null
  systemctl list-timers atra-backup.timer --no-pager | head -2
else
  echo "⚠ $RAIZ/infra ainda não chegou — rode de novo depois do rsync"
fi

echo "✓ VM pronta ($(nproc) vCPU, $(free -g | awk '/Mem/{print $2}') GB, swap $(swapon --show=SIZE --noheadings | head -1))"
[ "$DONO" = root ] || echo "  ⚠ $DONO entrou no grupo docker: saia e entre de novo no SSH para valer"
