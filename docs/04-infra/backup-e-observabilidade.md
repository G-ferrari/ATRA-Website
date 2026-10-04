---
status: rascunho
atualizado_em: 2026-08-25
depende_de: [deploy-vps.md]
---

# Backup e observabilidade

## O que estamos protegendo

| Ativo | Onde vive | Perda significa |
|---|---|---|
| Conteúdo do CMS | Postgres | Todo o trabalho editorial: 207 posts migrados, cases, glossário, páginas |
| Mídia | R2 / volume | Imagens de case, capas, selos, fotos de evento |
| Código | GitHub | Nada — está distribuído |
| Segredos | Painel de deploy | Indisponibilidade até regerar |
| Leads (`form-submissions`) | Postgres | **Receita** — contato que ninguém mais consegue recuperar |

O Postgres concentra os dois itens insubstituíveis. É onde o rigor tem que estar.

## Backup do Postgres

```
diário   03:00  pg_dump completo, comprimido → local + R2
semanal  domingo → retenção estendida
```

| Item | Definição |
|---|---|
| Ferramenta | `pg_dump -Fc` (formato custom, permite restore seletivo) |
| Retenção | 7 diários · 4 semanais · 6 mensais |
| Destino primário | Volume do host, `/backups` |
| **Destino externo** | **R2, bucket separado, credencial só de escrita** |
| Criptografia | `age` ou `gpg` antes do upload — o dump tem dado pessoal de lead |
| Verificação | Tamanho não pode cair mais de 20% em relação ao anterior sem alerta |

**Cópia externa não é opcional.** Backup no mesmo host que o banco protege contra
`DROP TABLE`, não contra perder o servidor. E a credencial de upload deve ser
**write-only**: se a VPS for comprometida, o invasor não consegue apagar o
histórico de backups.

### O que está implementado (25/08 — MIG-123) e o que esta spec ainda cobra

Vive em `infra/backup/`: timer de systemd às 03:10 UTC (com `Persistent=true` —
VPS desligada na hora roda ao religar), três artefatos por corrida (banco em
`-Fc`, mídia lida direto do volume, `.env.prod` cifrado com AES-256/PBKDF2) e
**restore verificado por contagem em base limpa** — o `testar-restore.sh` já
provou o próprio valor pegando um dump que restaurava vazio sem erro.

| Item da spec | Estado |
|---|---|
| `pg_dump -Fc` diário + rotação | ✅ 14 dias (a spec pede camadas 7/4/6 — refinar quando houver destino externo) |
| Restore verificado | ✅ **superado** — por contagem mínima por tabela, não só "rodou" |
| Cópia externa write-only | ⏳ o script liga sozinho quando `BACKUP_S3_*` existir; **espera o bucket (R2)** e avisa em toda corrida enquanto falta |
| Cifrar o dump antes do upload externo | ⏳ hoje só os segredos são cifrados; entra junto com a cópia externa — é lá que o dump sai do host |
| Alerta de tamanho (−20%) | ⏳ junto com uptime/alerta (MIG-124, espera destino de notificação) |

### Teste de restore — o item que costuma faltar

Backup não verificado é esperança, não backup.

```
mensal, agendado: restaura o dump mais recente em base descartável,
                  roda contagem de registros por collection,
                  compara com produção, publica resultado
```

Critério de aceite do MIG-123: **restore executado em base limpa e verificado** —
não o dump rodando sem erro. A diferença já custou caro em muita empresa.

Antes de toda migração destrutiva: backup manual + restore verificado. Sem
exceção.

## Backup de mídia

Com R2 (recomendado em [deploy-vps](deploy-vps.md)): versionamento de objeto
ligado, com 30 dias de retenção. Cobre exclusão acidental pelo editor sem rotina
própria.

Com volume local: entra no mesmo `pg_dump` diário, via `tar` do diretório. Pior
em todos os aspectos — mais um motivo para o R2.

## Observabilidade

### Sentry

| Item | Configuração |
|---|---|
| Escopo | Erros de servidor e de cliente, com `environment` por ambiente |
| Release | SHA do commit, para ligar erro a deploy |
| `tracesSampleRate` | 0.1 em produção — performance sem inflar custo |
| Filtros | Descartar ruído de extensão de browser e bot |
| **PII** | padrão do SDK (sem IP nem cookies — `sendDefaultPii` saiu no SDK 11); **nunca** enviar corpo de formulário nem conversa do chat |
| Alerta | Erro novo, ou taxa acima do normal → e-mail/Slack |

### Uptime

Checagem externa a cada minuto, de fora da VPS:

| Alvo | Espera |
|---|---|
| `https://www.atra.com.br/` | 200, < 2 s |
| `https://www.atra.com.br/api/health` | 200 com `{status:"ok"}` |
| `https://www.atra.com.br/cases-de-sucesso` | 200 — pega falha de banco que a home estática esconderia |
| Certificado TLS | Alerta com 20 dias de antecedência |

O terceiro alvo importa: com a home estática, o site pode parecer no ar com o
Postgres caído. Monitorar só a home é monitorar o cache.

### O que está implementado (01/10 — MIG-122 e MIG-124, D-46)

| Item da spec | Estado |
|---|---|
| Sentry servidor + edge + navegador, `environment`, `release` por SHA, 0.1 de amostra, PII fora, ruído de extensão filtrado | ✅ no código (`src/lib/sentry/`, `instrumentation.ts`, `instrumentation-client.ts`, `global-error.tsx`); **inerte até existir `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN` no `.env.prod`** — espera a conta |
| Alerta do Sentry (erro novo, taxa) | ⏳ configuração do painel, depois da conta |
| Uptime: 3 alvos + certificado | ✅ **interino** — `.github/workflows/uptime.yml`, a cada 5 min (o mínimo do cron do GitHub), alvo em `vars.SITE_URL`; queda abre issue com a etiqueta `uptime` e a fecha ao voltar. Um serviço de uptime de verdade entra com os mesmos alvos |
| Log de acesso do proxy, 30 dias | ✅ `/opt/atra/logs/caddy/access.log`, JSON, rotação pelo Caddy |
| Logs dos containers com retenção | ✅ journald do host (`logging: journald` no compose), 30 dias / 2 GB (`preparar-vm.sh`). `journalctl CONTAINER_NAME=atra-web-1 --since "13:00"` |

### Logs

| Origem | Destino | Retenção |
|---|---|---|
| Next (stdout) | journald do host, `CONTAINER_NAME=atra-web-1` | 30 dias |
| Postgres | journald do host, `CONTAINER_NAME=atra-postgres-1` | 30 dias |
| Proxy (acesso) | `/opt/atra/logs/caddy/access.log`, JSON | 30 dias — insumo do monitoramento de 404 pós-cutover |
| Uso da ATRA AI | Tabela `ai-usage` | Permanente (métrica agregada, sem conteúdo — ver P-20) |

Log estruturado em JSON, com `requestId`. Nunca logar segredo, corpo de formulário
ou dado pessoal.

### Métricas de negócio

Painel simples no admin do Payload, consultando o próprio banco:

- Leads por dia, por tipo de formulário e por origem UTM
- Materiais mais baixados
- Conversas iniciadas na ATRA AI e custo acumulado no mês (P-04)
- Conteúdo publicado por mês

São as métricas que dizem se o projeto valeu a pena. Analytics de página vem do
GA4; isto aqui é o que o GA4 não vê.

## Monitoramento específico do pós-cutover

Por 30 dias após a virada, com atenção diária:

| O que | Onde | Alerta |
|---|---|---|
| Erros 404 | Log do proxy | Qualquer URL antiga com mais de 5 acessos → falta redirect |
| Cobertura no Search Console | GSC | Queda de páginas indexadas |
| Impressões e cliques | GSC | Queda > 20% sustentada por 7 dias |
| Erros de rastreamento | GSC | Qualquer aumento |
| Tempo de resposta | Uptime | p95 acima de 2 s |

A checagem de 404 no log é a que pega o que o planejamento não previu — URL com
backlink externo que não estava no sitemap, por exemplo.

## Plano de recuperação

| Cenário | Ação | Tempo alvo |
|---|---|---|
| Deploy quebrado | Rollback para a imagem anterior | < 5 min |
| Banco corrompido | Restore do dump mais recente | < 1 h |
| VPS perdida | Recriar do compose + restore + mídia do R2 | < 4 h |
| Mídia apagada | Versionamento do R2 | < 30 min |
| Cutover deu errado | Reverter DNS para o WP (que segue vivo 30 dias) | < 15 min + TTL |

O último é o mais importante do projeto e está detalhado no
[runbook-cutover](runbook-cutover.md).

⚠️ **RPO real é de até 24 h** com backup diário. Para conteúdo editorial é
aceitável — reescrever um dia de edição é chato, não catastrófico. Para **leads**
não é: um lead perdido não volta.

> [!DECISÃO PENDENTE] **P-22** — vale replicar os `form-submissions` para fora do
> banco em tempo real (e-mail já serve de cópia; um webhook para CRM serviria
> melhor), reduzindo o RPO dos leads de 24 h para zero? Depende de P-18.
