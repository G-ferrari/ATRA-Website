# E-mails do site pelo Google Workspace (D-78)

O site manda e-mails automáticos: o resultado do Diagnóstico de Maturidade ao
visitante e os avisos internos de cada formulário. Desde a D-78 eles saem pela
**retransmissão SMTP do Google Workspace**, com o remetente
`nao-responda@atra.com.br`. Leva uns 30 minutos, mais a propagação do DNS.

Precisa: superadmin no Admin do Google, acesso ao Cloudflare (DNS de
atra.com.br) e o IP da VM de produção, **35.211.105.220**. Nada disso mexe nas
caixas de e-mail das pessoas.

## 1. A conta do site

1. admin.google.com → **Diretório → Usuários**: criar `site@atra.com.br` (ou
   usar uma conta de serviço que já exista — nunca a de uma pessoa).
2. Na conta, **Informações do usuário → Endereços de e-mail alternativos**:
   adicionar `nao-responda@atra.com.br` (alias não gasta licença).
3. myaccount.google.com, logado nela → Segurança → ligar a **Verificação em
   duas etapas**.
4. myaccount.google.com → **Senhas de app** → criar "Site atra.com.br" e
   copiar os 16 caracteres (aparecem uma vez só).

## 2. A retransmissão SMTP

admin.google.com → **Apps → Google Workspace → Gmail → Roteamento**, na
unidade organizacional raiz → **Serviço de retransmissão SMTP → Configurar**:

| Campo | Valor |
|---|---|
| Descrição | Site atra.com.br |
| Remetentes permitidos | Somente endereços nos meus domínios |
| Autenticação | **Aceitar e-mails apenas dos endereços IP especificados** (`35.211.105.220`) **e** **Exigir autenticação SMTP** |
| Criptografia | **Exigir criptografia TLS** |

Salvar. Pode levar até 1 h para valer.

## 3. DKIM e SPF

Em 28/10 atra.com.br não tinha DKIM e tinha **dois** registros SPF, o que
invalida o SPF.

1. admin.google.com → **Apps → Google Workspace → Gmail → Autenticar e-mail** →
   `atra.com.br` → **Gerar novo registro** (2048 bits, prefixo `google`).
2. Cloudflare → DNS → Adicionar registro: **TXT**, nome `google._domainkey`,
   conteúdo = o valor inteiro do Google.
3. Esperar ~15 min (até 48 h) e clicar em **Iniciar autenticação** no Admin.
4. No Cloudflare, deixar **um só** TXT `v=spf1` na raiz:
   `v=spf1 ip4:216.238.109.21 include:_spf.google.com ~all` — e apagar o outro.
   Se outro serviço manda com remetente @atra.com.br, o `include` dele entra na
   mesma linha antes do `~all`.

## 4. O servidor

No `.env.prod` da VM (`/opt/atra`). ⚠️ Nunca `source` do arquivo (ver CLAUDE.md):

```
SMTP_HOST=smtp-relay.gmail.com
SMTP_PORT=587
SMTP_USER=site@atra.com.br
SMTP_PASSWORD=<senha de app, sem espaços>
EMAIL_FROM=ATRA <nao-responda@atra.com.br>
# opcional: cópia oculta do resultado do diagnóstico (vírgula separa vários)
EMAIL_COPIA_DO_RESULTADO=
```

Depois, um deploy (ou `docker compose ... up -d web`) para o contêiner ler.
Com `SMTP_HOST` vazio, volta a valer o Resend (`RESEND_API_KEY`).

## 5. Teste

1. Responder ao diagnóstico em `/diagnostico-maturidade` com um e-mail da ATRA.
2. O resultado chega em até 1 min, de "ATRA <nao-responda@atra.com.br>".
3. Gmail → ⋮ → **Mostrar original**: SPF, DKIM e DMARC em **PASS**.
4. Admin → Envios de formulário: o lead tem "Resultado enviado em".

## Se der errado

| Sintoma | Causa provável |
|---|---|
| "Resultado enviado em" vazio | regra ainda não vale (1 h), IP errado ou senha errada |
| Log `[email] falhou: EAUTH 535 ... Username and Password not accepted` | senha de app com espaços ou de outra conta |
| Log `... 550 ... Mail relay denied` | IP fora da regra, ou remetente fora do domínio |
| Chega no spam | DKIM não ativo, ou SPF duplicado |

Log: `journalctl CONTAINER_NAME=atra-web-1 --since "10 min ago" | grep email`.
Limite da retransmissão: 10 mil destinatários por dia por conta.
