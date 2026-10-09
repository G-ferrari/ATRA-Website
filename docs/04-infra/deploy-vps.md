---
status: rascunho
atualizado_em: 2026-08-25
depende_de: [docker.md, ambientes.md]
---

# Deploy em VPS

## O que precisa existir

| Necessidade | Por quê |
|---|---|
| Proxy reverso + TLS automático | Dois hosts (produção e staging), certificado renovando sozinho |
| Deploy a partir do git | O fluxo é uma PR por rota; deploy manual não acompanha |
| Staging isolado | Ensaio de cutover e validação dos 200+ redirects |
| Backup de Postgres agendado, com cópia externa | Perder o CMS é perder o trabalho de todo o marketing |
| Gerenciamento de segredos | 6 variáveis secretas, fora do repositório |
| Deploy sem derrubar o site | Menos crítico aqui — ver abaixo |
| Logs e métricas acessíveis | Diagnóstico sem SSH toda vez |

### Sobre "deploy sem downtime"

Vale dimensionar honestamente: é um site institucional, com tráfego concentrado
em horário comercial e deploys que acontecem quando quisermos. Uma janela de 5 a
15 segundos às 3h da manhã não tem custo real de negócio.

O que **não** é aceitável é deploy que quebra e fica quebrado. Então a prioridade
não é *zero* downtime — é **rollback rápido e healthcheck que impeça promover um
container quebrado**. Ambas as opções abaixo entregam isso.

## Comparativo

| Critério | Coolify / Dokploy | Docker Compose + Caddy |
|---|---|---|
| TLS automático | Sim, embutido | Sim — Caddy faz com 2 linhas |
| Deploy por git push | **Sim**, com webhook | Precisa montar (Actions → SSH → `compose pull && up`) |
| Preview por branch | **Sim** | Não, sem trabalho considerável |
| Staging | Um clique | Segundo arquivo de compose |
| Backup de Postgres agendado | **Embutido**, com destino S3 | Cron + script próprio |
| Gerenciamento de segredos | UI, com histórico | Arquivo `.env` no host, permissão 600 |
| Rollback | **Um clique**, imagens anteriores retidas | `TAG=anterior docker compose up -d` |
| Logs e métricas | UI | `docker logs`, ou stack própria |
| Consumo do próprio painel | ~1 GB RAM, ~1 vCPU | ~0 |
| Peças que precisam de patch | +1 (o próprio painel, exposto na internet) | 0 |
| Curva de aprendizado | Média, mas visual | Baixa para quem já usa Docker |
| Reprodutibilidade | Configuração vive **no painel** (exportável, mas fora do git) | **Tudo no git** |
| Portabilidade | Containers padrão; sair é possível | Trivial |

## Recomendação: Coolify

**Motivo principal:** três das necessidades da lista — deploy por git, backup
agendado e gerenciamento de segredos — são trabalho recorrente que o Coolify
entrega pronto e que, no caminho Compose+Caddy, viram scripts que alguém escreve
uma vez e ninguém mantém. Backup com cópia externa e restore testado é o exemplo
claro: é fácil escrever o cron e fácil esquecer de verificar se ele ainda roda.

O segundo motivo é o **preview por branch**. Com uma PR por rota e revisão por
paridade visual, poder abrir a URL da PR e comparar com o legado lado a lado é
exatamente o fluxo de revisão que este projeto precisa.

**O que se paga por isso, dito com clareza:**

- Mais um sistema exposto à internet, que precisa de atualização de segurança.
  Painel de deploy é alvo de valor alto — se comprometido, dá acesso a segredos e
  a todos os containers.
- A configuração vive no painel, não no git. Contradiz em parte o princípio de
  reprodutibilidade que o resto desta documentação defende.
- ~1 GB de RAM do servidor para o painel.

**Mitigações:** painel em subdomínio próprio com acesso restrito por IP ou VPN,
2FA obrigatório, atualizações agendadas, e o `docker-compose.yml` de produção
versionado no repositório mesmo assim — assim, se o Coolify sair do caminho, subir
tudo na mão continua sendo `docker compose up -d`.

**Dokploy** é uma alternativa legítima e mais enxuta. A escolha entre os dois é de
preferência, não de arquitetura: ambos orquestram containers Docker padrão.

> ✅ **P-05 respondida na prática (25/08/2026) → D-28.** O caminho que subiu foi
> **Compose + Caddy**, com o deploy por GitHub Actions — o que este comparativo
> apontava como fraqueza do Compose ("precisa montar") custou um job de CI e um
> script, e o rollback por tag de SHA foi exercitado de verdade. O Coolify
> perdeu pelo próprio argumento da tabela: +1 GB de RAM e mais um painel exposto
> à internet, numa VPS de 8 GB que também roda o build. O que roda está em
> `docker-compose.prod.yml`, `Caddyfile` e `infra/` — tudo no git, que era o
> critério de reprodutibilidade.

## Dimensionamento da VPS

Carga esperada: site institucional, tráfego de horário comercial, conteúdo
majoritariamente estático.

| Recurso | Mínimo | Recomendado | Por quê |
|---|---|---|---|
| vCPU | 2 | **4** | Build do Next é o pico; 2 vCPU builda, mas devagar |
| RAM | 4 GB | **8 GB** | Next ~512 MB + Postgres ~1 GB + Coolify ~1 GB + build ~2 GB |
| Disco | 40 GB | **80 GB SSD** | Imagens Docker acumulam; mídia cresce; backups locais |
| Banda | — | 2 TB | Folgado para o tráfego esperado |

⚠️ **Buildar na VPS de produção compete por CPU com o site** — e por RAM: a
primeira tentativa matou o Postgres com 70 OOM kills; um swapfile de 4 GB
(`vm.swappiness=10`) absorve o pico desde então. O plano original era buildar no
CI e publicar no registry, mas ele esbarra num fato do projeto: as páginas são
**pré-renderizadas lendo o banco**, e o banco do CI tem fixture, não conteúdo —
a imagem sairia com as páginas erradas. Por isso o build roda na VPS, contra o
banco real, depois das migrações (`infra/deploy/deploy.sh`). Registry continua
valendo para o futuro se a renderização migrar para ISR pura.

⚠️ **Medido na prática (KVM 2, 2 vCPU/8 GB):** build completo em 3–5 min, site
com ~4,4 GB de RAM em uso com tudo no ar. Funciona — o documento recomendava
KVM 4 e a folga faria diferença no dia em que staging e produção coexistirem.

## Estratégia de deploy

```
PR → CI (lint, types, testes, build) → merge em main
  → Actions builda a imagem e publica em ghcr.io com tag = SHA
  → webhook do Coolify → pull da imagem → migração do banco
  → healthcheck → troca de tráfego → container antigo removido
```

Regras:

1. **Tag por SHA, nunca `latest`.** Rollback precisa de alvo determinístico.
2. **Migração antes do healthcheck.** Container que não migrou não recebe tráfego.
3. **Migração destrutiva exige backup verificado antes** — bloqueio manual.
4. Reter as **5 imagens anteriores** para rollback imediato.

### Deploy em segundo plano (D-58)

O `deploy.sh` leva ~14 minutos, e o executor do GitHub passava esse tempo
parado, gastando a franquia de minutos. Com um token na VM, o CI dispara o
deploy e sai; quem espera é a VM (`infra/deploy/em-segundo-plano.sh`).

**Para ligar** — uma vez, por quem tem acesso à VM:

1. No GitHub, criar um *fine-grained personal access token* restrito ao
   repositório do site, com duas permissões de leitura e escrita: **Commit
   statuses** e **Issues**. Nada além disso.
2. Na VM, acrescentar ao `/opt/atra/.env.prod`, **por edição de texto**:
   `GITHUB_STATUS_TOKEN=<o token>`.

A partir do deploy seguinte, o job "deploy na VPS" termina em cerca de um
minuto e o commit ganha um status **deploy**: pendente enquanto a VM trabalha,
verde quando o site trocou, vermelho se reprovou — e a reprovação abre uma
issue, que é o que manda e-mail. O que aconteceu fica em `/opt/atra/deploy.log`.

**Para desligar**, apagar a linha do `.env.prod`: o job volta a esperar.

⚠️ O job verde passa a dizer "deploy **disparado**", não "no ar". Quem diz "no
ar" é o status do commit. ⚠️ O token expira: quando expirar, o deploy continua
funcionando e para de avisar — o status fica sem aparecer. Renovar o token, ou
apagar a linha.

## Storage de mídia

Duas opções, e a escolha depende de P-21:

| | Volume local no host | S3 externo (Cloudflare R2 / Backblaze B2) |
|---|---|---|
| Custo | Incluso na VPS | Baixo; R2 não cobra egress |
| Backup | Precisa entrar na rotina | Versionamento e replicação do provedor |
| Servir | Passa pelo app | Direto do CDN, sem tocar a VPS |
| Perda da VPS | **Perde a mídia** se o backup falhar | Mídia sobrevive |

**Recomendação: R2.** Tira a mídia do caminho crítico da VPS, sobrevive à perda do
servidor e casa com o Cloudflare que a ATRA já usa para DNS. Em desenvolvimento
segue MinIO, que fala a mesma API.

## Domínios

| Domínio | Aponta para | Quando |
|---|---|---|
| `staging.atra.com.br` | VPS nova | Fase 1 — antes de tudo |
| `www.atra.com.br` | VPS nova | Cutover (Fase 7) |
| `atra.com.br` | redirect 301 → `www` | Cutover |
| `deploy.atra.com.br` | painel do Coolify | Fase 1, com acesso restrito |

⚠️ Hoje `atra.com.br` e `www` respondem no **mesmo IP**, sem redirect entre si —
duas URLs servindo o mesmo conteúdo. Consolidar em `www` com 301 é ganho de SEO
que sai de graça no cutover. Confirmar qual das duas o Search Console trata como
principal antes de escolher o lado.
