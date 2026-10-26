---
status: rascunho
atualizado_em: 2026-10-23
depende_de: [../00-contexto/decisoes.md, ../04-infra/backup-e-observabilidade.md]
---

# Monitoramento de uptime

Quem avisa que o site caiu é o **Google Cloud Monitoring** (D-68), no projeto
do Google Cloud onde roda a VM de homologação. Tudo é criado por um script,
`infra/monitoramento/criar-checagem-google.sh`, que a pessoa com acesso à conta
roda com o próprio `gcloud`. Projeto e e-mail não ficam escritos em lugar
nenhum do repositório, que é público.

## O que o script cria

| Peça | Como fica |
|---|---|
| Checagem | `GET https://<host>/api/health` a cada **1 minuto**, de **3 regiões** (América do Sul, Virgínia, Europa), **10 s** de limite. Passa com resposta 2xx, `"status":"ok"` no corpo e certificado válido |
| Alerta de queda | **2 das 3 regiões falhando por 3 minutos seguidos** → e-mail crítico. Outro e-mail quando volta |
| Alerta de certificado | Menos de **20 dias** para vencer → e-mail de aviso |
| Canal | E-mail, um canal por endereço; serve às duas políticas e a mais de um site |

`/api/health` é a mesma rota do healthcheck do container e do `deploy.sh`. Ela
consulta o banco, então um 200 prova DNS, certificado, Caddy, Next e Postgres. A
home e `/cases-de-sucesso` ficaram de fora: são pré-renderizadas e respondem 200
do cache com o banco caído.

Uma queda real chega por e-mail em **cerca de 5 minutos**. A troca de containers
de um deploy dura segundos e não dispara nada.

## Rodar

Quem roda precisa ser dono do projeto (Owner), ou ter *Monitoring Editor* e
permissão de ligar APIs. O jeito mais simples é o **Cloud Shell**: no console do
Google Cloud, com o projeto da VM selecionado, o ícone `>_` no topo. Ele já
vem com login e com o `gcloud` atualizado.

```bash
git clone https://github.com/G-ferrari/ATRA-Website.git && cd ATRA-Website

infra/monitoramento/criar-checagem-google.sh \
  --projeto <id-do-projeto> \
  --email <endereço-do-alerta>[,<outro>] \
  --url https://atra-hmg.duckdns.org
```

- `<id-do-projeto>` é o id, não o nome. No Cloud Shell, `gcloud config get-value project`
  mostra o do projeto aberto.
- O `git clone` anônimo vale enquanto o repositório for público. Depois, clonar
  com login (`gh repo clone`) ou subir só o script pelo menu do Cloud Shell.
- Do próprio computador também funciona: `gcloud auth login` antes, e um
  `gcloud components update` se o SDK for antigo.
- Ao final o script imprime o id da checagem, o link do painel e o comando de
  teste. Os primeiros resultados aparecem no console em poucos minutos
  (Monitoring → Uptime checks).

Rodar de novo **não duplica nada**: o script acha o que criou pelos rótulos
(`app=atra-website`, `target=<host>`) — ou, se a checagem perdeu os rótulos, pelo
host e pelo nome `ATRA <host>/api/health` — e devolve tudo ao que está escrito nele —
inclusive o que alguém tenha mexido no console. Para trocar quem recebe, rode
com a lista nova. O canal antigo continua existindo, só deixa de receber este
alerta.

## Testar o alerta

Sem tocar no site: a checagem passa a exigir um texto que a rota não devolve.

1. Copie o comando que o script imprime no fim, já com o id, o projeto e os
   rótulos. A forma dele, para `www.atra.com.br`:

   ```bash
   gcloud monitoring uptime update <id-da-checagem> --project=<id-do-projeto> \
     --matcher-type=contains-string --matcher-content='"status":"teste-de-alerta"' \
     --update-user-labels=app=atra-website,target=www-atra-com-br,managed_by=criar-checagem-google
   ```

   ⚠️ No zsh, `<` e `>` são redirecionamento: com os marcadores no lugar do
   valor, o comando nem chega ao gcloud. O id aparece em
   `gcloud monitoring uptime list-configs --project=<id-do-projeto> --format='value(name,displayName)'`.

2. Em cerca de 5 minutos chega o e-mail de site fora do ar, e o incidente
   aparece em Monitoring → Alerting.
3. Rode o script de novo, com os mesmos argumentos. A checagem volta a exigir
   `"status":"ok"` e, alguns minutos depois, chega o e-mail de que o site voltou.

Se o e-mail não chegar, olhe o spam e confira o endereço em Monitoring →
Alerting → *Edit notification channels*; o botão *Send test notification* de lá
prova só o canal. Não teste derrubando o container da homologação: outras
pessoas usam o ambiente.

## Desligar

- **Por um tempo** (migração de servidor, manutenção longa): em Monitoring →
  Alerting → *Snooze*, adiar as duas políticas com prazo. Ao fim do prazo o
  alerta volta sozinho, sem depender de alguém lembrar.
- **De vez** (a homologação sair do ar depois da virada, por exemplo):

  ```bash
  infra/monitoramento/criar-checagem-google.sh --projeto <id-do-projeto> \
    --url https://atra-hmg.duckdns.org --remover
  ```

  Apaga a checagem e as duas políticas daquele endereço. O canal de e-mail fica,
  porque pode servir a outro site.

## Depois da virada

A mesma linha, com o endereço de produção: `--url https://www.atra.com.br` (o
`SITE_HOST` do `.env.prod` da produção, D-72). Não o apex nem os outros
domínios: eles respondem 301, e a checagem veria o redirect, não o site. Cada endereço ganha
checagem e políticas próprias; os canais são reaproveitados. Homologação e
produção juntas gastam ~260 mil execuções por mês, dentro do 1 milhão gratuito
por projeto. As políticas de alerta passam a ser cobradas em setembro de 2027
(US$ 0,35 por condição por mês, duas por endereço).

## O `uptime.yml` do GitHub

**Sem agendamento desde 26/10/2026.** A checagem do Google de
`www.atra.com.br` existe e o teste acima chegou por e-mail, nos dois sentidos
(fora e voltou); então o `schedule` saiu e ficou só o `workflow_dispatch`, útil
para conferir os três alvos e o certificado à mão (Actions → Uptime → *Run
workflow*). Uma queda não abre mais issue com a etiqueta `uptime`: o registro é
o histórico de incidentes do Monitoring.

⚠️ Antes de tirar a checagem do Google (`--remover`), volte o `schedule`: sem
ele, nada mais vigia o site.

## Ajustes

Por variável de ambiente, ao rodar o script:

- `REGIOES` — as regiões da checagem, ao menos 3 (padrão
  `south-america,usa-virginia,europe`). Cada uma a mais custa ~43 mil execuções
  por mês.
- `DIAS_DO_CERTIFICADO` — o limite do aviso de certificado (padrão 20). O Caddy
  renova com 30 dias de folga. Quando a Let's Encrypt encurtar a validade dos
  certificados, o Caddy passa a renovar mais perto do fim e 20 vira alarme
  falso: é a hora de baixar.

O resto (rota, intervalo, limite de tempo, 3 minutos fora) está no topo do
script, cada um com o motivo ao lado.
