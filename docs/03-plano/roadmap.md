---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [../02-especificacao/mapa-de-migracao.md, ../00-contexto/decisoes.md]
---

# Roadmap

Nove fases. Cada uma tem critério de conclusão **verificável** — não "está pronto",
mas "este comando passa" ou "esta URL responde isto".

O caminho A (D-17) acrescentou as fases 4b e 4c, e é o que empurra o cutover para
depois da paridade de conteúdo.

## Visão geral

| Fase | Nome | Entrega | Depende de |
|---|---|---|---|
| 0 | Descoberta | ✅ concluída | — |
| 1 | Fundação | Next + Payload + Postgres + CI + Playwright, sem telas | 0 |
| 2 | Fatia vertical | Cases ponta a ponta, com padrão documentado | 1 |
| 3 | Fábrica de rotas | As 16 rotas restantes do protótipo | 2 |
| 4a | Seed do protótipo | Conteúdo que já existe em `legacy/` no CMS | 2 |
| 4b | Migração do WordPress | 207 posts + 6 vagas + mídia | 1 |
| 4c | Conteúdo novo | `segments` (10) + `solutions` (6→13) + página legal | 3 |
| 5 | Formulários, SEO e analytics | Leads chegando, sitemap, redirects, GA4 | 3 |
| 6 | Endurecimento | Performance, a11y, observabilidade, backup | 5 |
| 7 | Cutover | DNS apontado, WP desativado | 4c, 6 |
| 8 | Limpeza | `legacy/` removido, dívida priorizada | 7 |

**4a, 4b e 4c rodam em paralelo com a fábrica de rotas** — são script e conteúdo,
não dependem das telas ficarem prontas (só a validação final depende).

---

## Fase 1 — Fundação

CMS na fundação, não no fim: Next e Payload sobem juntos e **vazios** antes da
primeira tela.

**Escopo.** Projeto Next em `web/` · Payload 3 + adapter Postgres · localization
`pt`/`en` (D-07) · docker-compose de dev com Postgres e storage S3-compatível ·
variáveis de ambiente · CI (lint, typecheck, build) · Playwright configurado ·
**Mona Sans carregada no legado** (D-16).

**Critério de conclusão:**
- `pnpm dev` sobe; `http://localhost:3000/admin` abre e permite criar o 1º usuário
- `pnpm payload generate:types` produz `payload-types.ts` sem erro
- CI verde em PR limpo
- `pnpm test:e2e` roda a suíte vazia sem erro de configuração
- O app legado renderiza com Mona Sans (`document.fonts.check` retorna `true`)

> A última é pré-requisito da Fase 2: sem ela, o baseline visual nasce errado.

## Fase 2 — Fatia vertical (Cases)

Uma feature ponta a ponta valida o padrão antes de replicá-lo 19 vezes.

**Escopo.** Collections `media`, `topics`, `cases`, `testimonials`, `partners` ·
seed dos 4 cases reais · `/cases-de-sucesso` e `/cases-de-sucesso/[slug]` em PT e
EN · componentes-base do design system (`StatusBadge`, `MetricChip`, `GlowCard`,
`ContentCard`, `TabFilter`, `SearchInput`, `EmptyState`) · regressão visual das 2
rotas · **`CLAUDE.md` escrito ao final**, com o padrão consolidado.

**Critério de conclusão:**
- As 2 rotas respondem 200 em PT e EN
- Regressão visual contra o legado passa com diferença ≤ 0,1%
- Nenhum texto de conteúdo hardcoded nos componentes (revisão manual)
- `CLAUDE.md` descreve o padrão com exemplo de código real do que foi feito

## Fase 3 — Fábrica de rotas

Uma PR por rota, na ordem de dependência do
[mapa-de-migracao](../02-especificacao/mapa-de-migracao.md#ordem-de-execução).

**Critério de conclusão:**
- 20 rotas do protótipo respondendo 200 em PT e EN
- Regressão visual passando para as 17 com baseline legado
- Nenhuma PR de rota acima de ~400 linhas de diff
- 404 real (hoje o legado devolve 200 em URL inválida)

## Fase 4a — Seed do protótipo

**Escopo.** Script idempotente que lê `legacy/` e cria: 17 termos de glossário, 4
cases, 9 materiais (metadados), 9 parceiros, 7 clientes, 7 depoimentos,
`specialist-roles`, globals · recuperação das 30 imagens corrompidas a partir dos
gêmeos íntegros · upload para o Media.

**Critério de conclusão:**
- `pnpm seed` roda **duas vezes** sem duplicar registro
- Zero imagem corrompida no Media (`file -b` reporta imagem em 100%)
- Nenhuma URL do Unsplash ou `picsum.photos` no banco

## Fase 4b — Migração do WordPress (D-17)

**Escopo.** Importador via `/wp-json/wp/v2/posts` · conversão HTML → Lexical ·
download de imagens destacadas e inline para o Media · mapeamento de categorias
para `topics` · importação das 6 vagas · geração automática do CSV de redirects
dos 207 posts.

**Critério de conclusão:**
- 207 posts publicados, com corpo, data, autor e imagem
- Amostra de 20 posts conferida manualmente: formatação, imagens e links internos
- `redirects.csv` gerado com 207 linhas de post + as curadas à mão
- Nenhum post com corpo vazio ou imagem quebrada (query de verificação)

> **Risco:** a conversão HTML → Lexical é onde este projeto pode consumir tempo
> imprevisto. Blocos do Gutenberg (galerias, embeds, colunas) não têm equivalente
> direto. Mitigação: rodar a conversão cedo, na Fase 1 se possível, sobre 10 posts,
> para medir o estrago antes de comprometer prazo.

## Fase 4c — Conteúdo novo (D-17)

**Escopo.** Collection `segments` + template + 10 páginas · expansão de `solutions`
de 6 para 13, com conteúdo vindo do WP · `/politicas-e-termos` · revisão editorial.

**Critério de conclusão:**
- `/segmentos` e as 10 `/segmentos/[slug]` respondendo 200
- 13 soluções publicadas
- Página legal publicada e linkada no rodapé (hoje os 3 links vão para `#`)
- Nenhuma das ~30 URLs do WP sem destino no `redirects.csv`

## Fase 5 — Formulários, SEO e analytics

**Escopo.** `form-submissions` + Server Actions + Resend + anti-spam ·
`sitemap.ts`, `robots.ts`, `generateMetadata` em todas as rotas · JSON-LD ·
`redirects.csv` no `next.config.ts` · GA4/GTM + consentimento · rate limit e
budget guard do chat (D-12).

**Critério de conclusão:**
- Envio de teste chega em `negocios@atra.com.br` **e** aparece em `form-submissions`
- Teste de CI: toda linha do `redirects.csv` responde 301 para um destino 200
- `sitemap.xml` lista só publicados, sem rascunho e sem locale não traduzido
- Rich Results Test do Google valida `Organization`, `Article` e `Service`
- Chat recusa a 11ª requisição na mesma hora, com mensagem amigável

## Fase 6 — Endurecimento

**Escopo.** Performance (LCP, CLS) · axe no CI (D-13) · Sentry · uptime ·
backup `pg_dump` agendado com **teste de restore** · rate limit de formulário ·
`/design-system` portado com `noIndex`.

**Critério de conclusão:**
- Lighthouse ≥ 90 em Performance, SEO e Best Practices nas 5 rotas mais vistas
- Restore de backup em base limpa, verificado — não só o dump rodando
- Sentry recebendo erro de teste
- Relatório do axe publicado (não bloqueia PR, mas existe)

## Fase 7 — Cutover

Passo a passo em `../04-infra/runbook-cutover.md`.

**Critério de conclusão:**
- `atra.com.br` servindo o site novo com TLS válido
- Amostra de 30 URLs antigas testada: todas 301 para destino 200
- Search Console sem pico de 404 em 48 h
- WordPress no ar 30 dias como contingência, fora do DNS

## Fase 8 — Limpeza

**Escopo.** Remover `legacy/` · arquivar o baseline visual do legado ·
transformar o débito 🟢 em backlog priorizado · desativar o WordPress.

**Critério de conclusão:**
- `legacy/` fora do repositório (histórico preservado no git)
- Backlog de dívida com dono e prioridade
- Hospedagem do WP encerrada

---

## Caminho crítico

```
1 Fundação → 2 Fatia vertical → 3 Fábrica de rotas → 4c Conteúdo novo → 7 Cutover
                     ↘ 4a Seed          ↗
        4b Migração WP ─────────────────┘  (pode começar já na Fase 1)
```

**4b não depende das telas.** Começar a migração do WordPress cedo é a maior
alavanca de prazo do projeto — e é onde mora o risco técnico menos previsível.

## Riscos de cronograma

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Conversão HTML → Lexical pior que o esperado nos 207 posts | **alta** | Piloto de 10 posts na Fase 1 |
| Mona Sans revela quebras de layout no legado (D-16) | média | Descobrir na Fase 1, antes do baseline |
| Conteúdo de `segments` e `solutions` travado no marketing | **alta** | 4c depende de gente fora da engenharia; começar a conversa na Fase 1 |
| Regressão visual instável (animações, carrosséis) | alta | Desabilitar animação nas capturas; `prefers-reduced-motion` |
| P-01/P-16 sem resposta até o seed | média | Seed roda com placeholder marcado; publicar exige valor real |
