---
status: rascunho
atualizado_em: 2026-09-27
depende_de: [deploy-vps.md, backup-e-observabilidade.md, ../02-especificacao/seo-e-redirects.md]
---

# Runbook de cutover

Trocar `atra.com.br` do WordPress para o site novo.

**Papéis** — preencher os nomes antes de executar:

| Papel | Quem | Responsabilidade |
|---|---|---|
| Condutor | Leonardo | Executa os passos, decide abortar |
| DNS | ? | Acesso à Cloudflare |
| Conteúdo | ? | Congelamento editorial e conferência |
| Comunicação | ? | Avisa ATRA de início e fim |

> [!DECISÃO PENDENTE] **P-23** — quem tem acesso à conta Cloudflare da ATRA? Sem
> isso resolvido com antecedência, o cutover trava no passo mais crítico.

**Janela recomendada:** terça ou quarta, 6h–8h. Evitar sexta — se algo aparecer
só depois de horas, ninguém quer descobrir no sábado.

---

## Pré-requisitos (nada começa sem todos)

- [ ] **Testes e2e de comportamento religados no CI (D-39)** — o job `e2e`
      ficou desligado de 26/08 a 27/09/2026 para acelerar a validação em
      homologação, e voltou **sem** a paridade com o protótipo: o gabarito de
      21/08 reprovava as rotas por mudança deliberada de design (P-30). O deploy
      voltou a esperar por ele (`needs: [verify, e2e]`). Marcar só depois da
      **primeira execução verde** na `migracao` — religar no arquivo não é o
      mesmo que passar. **Nenhum cutover com o e2e desligado ou vermelho.**

- [ ] Fase 4c concluída: **paridade de conteúdo** (D-17) — 207 posts, 13 soluções, 10 segmentos, 6 vagas, página legal
- [ ] Fase 6 concluída: performance, backup **com restore testado**, Sentry, uptime
- [ ] `redirects.csv` completo e validado em staging — toda linha 301 → destino 200
- [ ] Ensaio completo executado em staging (MIG-132)
- [ ] Google Analytics rodando **no WordPress** há ≥ 30 dias, para haver baseline (P-19)
- [ ] Search Console com acesso confirmado e propriedade do domínio verificada
- [ ] Backup do WordPress (arquivos + banco) guardado fora do servidor
- [ ] Contato do suporte da hospedagem do WP à mão

---

## D-7 — Uma semana antes

| # | Ação | Responsável |
|---|---|---|
| 1 | Congelar publicação no WordPress. Comunicar a todos que publicam | Conteúdo |
| 2 | Reexecutar a coleta de URLs do WP e comparar com `wp-urls-2026-08-17.txt`. **Post publicado depois do inventário não teria redirect** | Condutor |
| 3 | Regerar `redirects.csv` com as diferenças e revalidar | Condutor |
| 4 | Backup completo do WordPress, guardado fora do servidor | DNS |
| 5 | Conferir que o servidor do WP continuará no ar 30 dias, fora do DNS | DNS |

## D-2 — 48 horas antes

| # | Ação | Verificação |
|---|---|---|
| 6 | **Reduzir o TTL do DNS para 300 s** na Cloudflare, em `atra.com.br` e `www` | `dig www.atra.com.br` mostra TTL ≤ 300 |
| 7 | Última sincronização de conteúdo do WP → Payload | Contagem por collection bate |
| 8 | Congelar também o Payload (só leitura durante a virada) | — |
| 9 | Revisão final em staging: amostra de 30 URLs antigas, os 4 cases, 3 posts, formulário e chat | Checklist assinado |
| 10 | Confirmar que os **MX seguem apontando para o Google Workspace** e que ninguém vai tocá-los | `dig MX atra.com.br` registrado antes e depois |

⚠️ O passo 7, para os artigos, é **sempre com `--so-novos`**:

```bash
docker compose -f docker-compose.prod.yml --profile tarefas run --rm migrate \
  pnpm exec tsx scripts/wp-import/import-posts.ts --so-novos
```

Sem a chave o importador **regrava** os artigos que já existem com o texto do
WordPress, por cima do que o marketing corrigiu no admin. Com ela, só cria o que
falta e lista o que criou. Tem de rodar **antes do passo 15**: depois da virada
`atra.com.br` é o site novo, e o importador não acha mais o WordPress. Em 01/10
faltavam 6 artigos (de 03/09 a 25/09); os redirects deles já estão no
`redirects.csv`, mas cada artigo publicado depois disso precisa da linha dele
(passos 2 e 3).

⚠️ O passo 6 é o que torna o rollback rápido. Sem reduzir o TTL antes, reverter
pode levar horas em vez de minutos.

⚠️ O passo 10 existe porque **derrubar o e-mail da empresa ao mexer no DNS é o
erro mais comum de cutover**. O registro A muda; MX, TXT (SPF/DKIM/DMARC) e
verificação de domínio **não se tocam**.

## D-0 — O dia

### Antes de mexer (06:00)

| # | Ação | Critério para seguir |
|---|---|---|
| 11 | Backup do Postgres novo + restore verificado | Restore concluído sem erro |
| 12 | Registrar o estado atual: `dig` completo, headers, screenshot da home do WP | Arquivado |
| 13 | Deploy da versão final em produção (ainda sem DNS), acessível por IP ou domínio temporário | Healthcheck verde |
| 14 | Smoke test contra a produção nova: todas as rotas 200 em PT e EN | Suíte verde |

### A virada (07:00)

| # | Ação | Verificação |
|---|---|---|
| 15 | Alterar o registro **A de `www.atra.com.br`** para o IP da VPS nova | `dig` retorna o IP novo |
| 16 | Alterar o **A de `atra.com.br`** (apex) para o mesmo IP | idem |
| 17 | Emitir o certificado TLS para os dois | `curl -I https://www.atra.com.br` responde 200 com TLS válido |
| 18 | Confirmar o 301 de apex → `www` | `curl -I https://atra.com.br` → 301 |
| 19 | **Reconferir os MX** | Idêntico ao registrado no passo 10 |

### Verificação pós-virada (07:15–08:00)

- [ ] Home carrega, em PT e EN, claro e escuro
- [ ] 30 URLs antigas amostradas: todas 301 para destino 200 — incluindo 10 posts, os 4 cases, 3 soluções, 2 segmentos, 1 vaga
- [ ] `/sitemap.xml` responde e lista só publicados
- [ ] `/robots.txt` correto — **e não é o do staging**
- [ ] Formulário de contato: envio de teste chega em `negocios@atra.com.br` **e** aparece em `form-submissions`
- [ ] ATRA AI responde e o rate limit funciona
- [ ] Admin do Payload acessível
- [ ] **Enviar e receber um e-mail no domínio** — confirma que os MX sobreviveram
- [ ] Sentry sem erro novo
- [ ] Uptime verde nos 3 alvos
- [ ] Lighthouse ≥ 90 na home
- [ ] Google Rich Results Test valida a home e um case

### Fechamento (08:00)

| # | Ação |
|---|---|
| 20 | Search Console: enviar o novo `sitemap.xml` |
| 21 | Search Console: solicitar indexação da home e das 10 páginas mais importantes |
| 22 | Restaurar o TTL do DNS para 3600 s — **só depois de 48 h estáveis** |
| 23 | Reabrir a publicação no Payload |
| 24 | Comunicar a ATRA que o site novo está no ar |

---

## Rollback

**Critérios para abortar** — qualquer um basta, sem discussão no momento:

- Site novo indisponível por mais de 10 minutos sem causa identificada
- Perda de dado detectada
- **E-mail do domínio parou**
- Mais de 20% das URLs amostradas retornando erro
- Formulário de contato não entrega

**Procedimento (< 15 min + TTL):**

1. Reverter os registros A de `www` e apex para `172.237.63.136` (o WP atual)
2. Confirmar com `dig` que voltou
3. Confirmar que o WordPress responde 200
4. Comunicar
5. **Só então** investigar

O WordPress fica **no ar e intocado por 30 dias**, fora do DNS. É o que torna o
rollback trivial: não é restaurar um backup, é apontar o DNS de volta.

⚠️ Rollback **não recupera** leads enviados ao site novo durante a janela.
Exportar `form-submissions` antes de reverter.

---

## Os 30 dias seguintes

| Quando | O quê |
|---|---|
| Diário (1ª semana) | 404 no log do proxy; erro no Sentry; uptime |
| Diário (1ª semana) | Search Console: cobertura e erros de rastreamento |
| Semanal | Impressões e cliques vs. o baseline pré-cutover (P-19) |
| Semanal | Comparar posição das 20 buscas principais |
| Dia 30 | Decidir sobre desligar o WordPress (MIG-136) |

**O que é normal e não é motivo de pânico:** oscilação de posição nas primeiras
2–4 semanas. O Google reprocessa o site inteiro. Queda sustentada por mais de 3
semanas, ou queda de páginas indexadas, aí sim é sinal de problema — quase sempre
redirect faltando ou `noindex` esquecido do staging.

**Toda URL antiga que aparecer como 404 no log vira redirect novo no mesmo dia.**
É o mecanismo que pega o que o inventário não previu.

---

## Ensaio (MIG-132) — obrigatório

O runbook inteiro roda **antes**, contra staging, com os passos de DNS simulados
via `/etc/hosts`. Objetivo: descobrir o passo esquecido enquanto ele ainda é
barato. Nenhum cutover acontece sem ensaio concluído.

### ⚠️ Automatizar algo contra a API do CMS no staging: autentique por cookie

Descoberto na prova da revalidação (25/08, MIG-143). O staging tem a senha do
Caddy na frente, e ela ocupa o header `Authorization` com o `Basic`. Mandar o
token do Payload como segundo header `Authorization: JWT …` faz o Caddy
responder **401 de corpo vazio** — que parece credencial errada do CMS e é
colisão de header.

O caminho que funciona: o login (`POST /api/users/login`) devolve o token
também como **cookie** `payload-token`. Guarde e reenvie o cookie
(`curl -c jar -b jar`), deixando o header `Authorization` só para o Basic do
proxy.

Isto **desaparece em produção** — sem a senha do proxy, o header fica livre
para o JWT. Ou seja: script do ensaio que autentica por cookie funciona nos
dois ambientes; por header, só em produção. Escreva por cookie.
