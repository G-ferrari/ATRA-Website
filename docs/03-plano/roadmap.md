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
| 1 | Fundação | ✅ **concluída em 18/08/2026** | 0 |
| 2 | Fatia vertical | ✅ **concluída em 20/08/2026** — MIG-072a fechou o megamenu, último item aberto | 1 |
| 3 | Fábrica de rotas | ✅ **concluída em 20/08/2026** — 20 rotas no ar, 15 sob regressão visual | 2 |
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
**imagens do legado recuperadas** (MIG-070) · Mona Sans no app novo via
`next/font/google` (D-16).

**Critério de conclusão — verificado em 18/08/2026:**

| Critério | Resultado |
|---|---|
| `pnpm dev` sobe; `/admin` abre e cria o 1º usuário | ✅ 200; usuário criado e autenticado |
| `pnpm payload generate:types` sem erro | ✅ |
| `pnpm test:e2e` roda sem erro de configuração | ✅ **24 testes passando** em 3 viewports |
| Zero imagem corrompida no legado | ✅ 0 de 48; home renderiza 52 imagens sem quebra |
| Largura de texto bate com o legado (±0,1%) | ✅ **0,0005%** nos pesos 200–900; **0,0003%** no itálico |
| CI verde em PR limpo | ✅ **verde em 20/08/2026** ([run 32326603668](https://github.com/G-ferrari/ATRA-Website/actions/runs/32326603668)), nos dois jobs. O `e2e` nunca tinha passado: o executor do seed exigia um `.env.local` que não existe no CI, e não havia serviço de storage para o upload de mídia |

> As duas últimas linhas de imagem e fonte eram pré-requisito do baseline visual:
> capturas congeladas com imagem quebrada ou fonte divergente registrariam
> defeito como comportamento correto.

**Entregue além do previsto:** papéis `editor`/`admin` com access control
(MIG-013), admin em português (MIG-014) e o
[piloto de conversão do WordPress](piloto-conversao-wp.md) (MIG-012), que baixou
o risco da Fase 4b de alto para baixo.

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

**Critério de conclusão:** ✅ **concluída em 20/08/2026.**
- ✅ 20 rotas do protótipo respondendo 200 em PT e EN
- ✅ Regressão visual passando — **15 rotas** em `ROTAS_COM_GABARITO`, nos três
  viewports. Ficaram de fora, com razão registrada: `/solucoes` (D-09 mudou o
  comportamento da rota) e `/contato` (rota nova, D-10 — não há gabarito)
- ✅ 404 real
- ⚠️ **Nenhuma PR acima de ~400 linhas: não cumprido.** A home (MIG-057 a 059) e
  as duas reconstruções passaram longe disso. O motivo é o mesmo nos três casos:
  a composição prevista não batia com o markup do legado, e a correção veio
  junto com a rota. Ver o padrão em
  [blocos.md](../02-especificacao/blocos.md#regras-de-bloco)

**O que a fase ensinou.** Cinco das composições previstas estavam erradas, todas
escritas a partir do inventário de seções em vez do markup. Três rotas foram
fechadas sem gabarito e saíram 30% a 57% mais curtas — daí a regra de que rota
com gabarito entra em `ROTAS_COM_GABARITO` **na mesma PR** que a porta.

## Fase 4a — Seed do protótipo

**Escopo.** Script idempotente que lê `legacy/` e cria: 17 termos de glossário, 4
cases, 9 materiais (metadados), 9 parceiros, 7 clientes, 7 depoimentos,
`specialist-roles`, globals · recuperação das 30 imagens corrompidas a partir dos
gêmeos íntegros · upload para o Media.

**Critério de conclusão:**
- `pnpm seed` roda **duas vezes** sem duplicar registro ✅
- Zero imagem corrompida no Media (`file -b` reporta imagem em 100%) ✅ (MIG-070)
- Nenhuma URL do Unsplash ou `picsum.photos` no banco ⚠️ **não atingido** — as 7
  capas de `/insights` e as 4 do `contentTeaser` da home continuam sendo do
  Unsplash e do `picsum.photos`. Não é defeito de porte: o legado não liga
  aqueles cartões a conteúdo nenhum, e capa real é conteúdo (P-07, D-22). Fica
  para a 4c, com o resto do material editorial
  > **Fechado em 24/08/2026, mas não como a 4c previa.** Não virou capa real:
  > virou uma chave. MIG-095 pôs as 31 imagens do protótipo atrás de
  > `SEED_FIXTURES=1` (D-27) — a revisão interna vê a página como o gabarito a
  > desenha, e o banco de produção segue só com o marcador. Capa real continua
  > sendo decisão do marketing, agora sem custar a legibilidade da revisão.

> ✅ **Fase 4a concluída.** As três tasks fecharam. O que ela mudou de fato: o
> conteúdo do protótipo deixou de morar no repositório. Clientes e depoimentos
> viraram collection (MIG-071), contato e rodapé viraram global (MIG-072), e o
> último hotlink do WordPress virou mídia do CMS (MIG-073) — o site novo não
> pede mais nada ao site velho para se desenhar. Antes disso, desligar o
> WordPress apagava o logo de todas as páginas.

## Fase 4b — Migração do WordPress (D-17)

**Escopo.** Importador via `/wp-json/wp/v2/posts` · conversão HTML → Lexical ·
download de imagens destacadas e inline para o Media · mapeamento de categorias
para `topics` · importação das 6 vagas · geração automática do CSV de redirects
dos 207 posts.

**Critério de conclusão:**
- 207 posts publicados, com corpo, data, autor e imagem ✅ — 207 publicados,
  287 imagens no acervo, nenhum sem corpo nem sem resumo
- Amostra de 20 posts conferida manualmente: formatação, imagens e links internos
  ✅ **superado** — `check-convert.ts` roda nos **207**: 100% de retenção de
  texto, 287/287 imagens, 516/517 links (o que falta é um `<a>` sem `href` na
  origem, desfeito em texto), 2/2 tabelas e 112 links internos reescritos
- `redirects.csv` gerado com 207 linhas de post + as curadas à mão ⚠️ **parcial**
  — 214 linhas geradas (207 posts + 7 vagas), todas com destino conferido no
  banco. As ~30 institucionais são curadoria da 4c; bater 301/200 contra staging
  é da Fase 5, quando o `next.config.ts` passa a consumir o arquivo
- Nenhum post com corpo vazio ou imagem quebrada (query de verificação) ✅
- ⚠️ **MIG-084 fora**: o WP não tem taxonomia para mapear (P-27). Os 207 entraram
  com `tags` vazio, e `/blog` nasce com filtro que não filtra

> **O aceite visual encolheu de 15 para 13 rotas, de propósito.** `/blog` e
> `/carreiras` listam conteúdo, e o conteúdo virou real — 207 artigos e 7 vagas
> no lugar de 6 e 6 fixtures. Nenhuma captura do protótipo pode voltar a bater.
> As duas ficam com o `smoke.spec.ts`; as outras 13 seguem sob o gate.

> **O build passou de 77 para 491 páginas estáticas e começou a morrer** em
> "took more than 60 seconds". Não era página quebrada: eram nove workers do
> Next disputando a máquina com o Postgres, o MinIO e dois containers de app.
> `next.config.ts` passou a usar metade dos núcleos e 180s de teto — a mesma
> conta que o `pnpm gate` já fazia.

> ✅ **Risco medido e reduzido — ver [piloto-conversao-wp](piloto-conversao-wp.md).**
> A hipótese estava errada: o conteúdo não é Gutenberg, é Elementor. Varredura dos
> 207 posts encontrou **zero** blocos Gutenberg, iframes, galerias, colunas ou
> shortcodes. A conversão retém 99,9–100% do texto, com imagens e links íntegros.
> Uma armadilha real apareceu: tabela converte com 100% de retenção de texto e
> **zero estrutura** — corrigido com `EXPERIMENTAL_TableFeature`. Risco de
> estouro: de **alto** para **baixo**.

## Fase 4c — Conteúdo novo (D-17)

**Escopo.** Collection `segments` + template + 10 páginas · expansão de `solutions`
de 6 para 13, com conteúdo vindo do WP · `/politicas-e-termos` · revisão editorial.

**Critério de conclusão:**
- `/segmentos` e as 10 `/segmentos/[slug]` respondendo 200 ✅ — são **8**
  verticais; as outras duas páginas do WP (`/segmentos/` e `/segmentos-atra/`)
  são índices, e viram o próprio `/segmentos`
- 13 soluções publicadas ⚠️ **bloqueado por P-16** — as 12 do WordPress entraram
  em rascunho e as 6 no ar não foram tocadas. Não é atraso de execução: as 13 do
  WP e as 6 do protótipo são **vocabulários diferentes** para a mesma oferta, e
  publicar as duas listas poria 18 ofertas no menu. Ver a nota em `tasks.md`
- Página legal publicada e linkada no rodapé ✅ — os 3 links apontam para a mesma
  página, como no WordPress. **Destrava a Fase 5**: P-14 impede coletar dado
  pessoal sem política publicada, e MIG-100 liga o formulário de contato
- Nenhuma das ~30 URLs do WP sem destino no `redirects.csv` ✅ **superado** — 261
  linhas cobrindo os 207 posts, as 7 vagas e as 53 páginas. A geração reprova se
  alguma ficar sem destino

> **O que a 4c acrescentou ao site.** Nove rotas que o protótipo não tinha:
> `/segmentos`, as 8 verticais e `/politicas-e-termos`. Nenhuma tem gabarito —
> não existem no protótipo, por definição — e as duas primeiras reaproveitam a
> composição de `/solucoes` em vez de inventar linguagem visual nova.
>
> ⚠️ **`/segmentos` ainda não está no menu nem no rodapé.** Acrescentar item ao
> cromo mudaria as 13 rotas sob gate. `/solucoes` está na mesma situação desde a
> Fase 3. Ligar as duas é decisão de navegação, com regravação de gabarito
> justificada.

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
| ~~Conversão HTML → Lexical pior que o esperado~~ | ~~alta~~ → **baixa** | ✅ Piloto executado (MIG-012): retenção de 99,9–100%, sem estruturas exóticas no corpus |
| Mona Sans revela quebras de layout no legado (D-16) | média | Descobrir na Fase 1, antes do baseline |
| Conteúdo de `segments` e `solutions` travado no marketing | **alta** | 4c depende de gente fora da engenharia; começar a conversa na Fase 1 |
| Regressão visual instável (animações, carrosséis) | alta | Desabilitar animação nas capturas; `prefers-reduced-motion` |
| P-01/P-16 sem resposta até o seed | média | Seed roda com placeholder marcado; publicar exige valor real |
