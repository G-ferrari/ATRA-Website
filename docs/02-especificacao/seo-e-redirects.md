---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [mapa-de-migracao.md, ../00-contexto/decisoes.md]
---

# SEO e redirects

> ⚠️ **Leia primeiro:** o levantamento das URLs reais do WordPress revelou uma
> lacuna de escopo grande o bastante para exigir decisão antes da Etapa 3. Ver
> [lacuna-de-escopo](lacuna-de-escopo.md).

## Inventário real do WordPress

Levantado em 17/08/2026 a partir de `https://www.atra.com.br/wp-sitemap.xml`
(WordPress core, sem plugin de SEO). Lista completa versionada em
[dados/wp-urls-2026-08-17.txt](dados/wp-urls-2026-08-17.txt).

| Sitemap | URLs | Conteúdo |
|---|---|---|
| `wp-sitemap-posts-post-1.xml` | **207** | Posts do blog, padrão `/YYYY/MM/DD/slug/` |
| `wp-sitemap-posts-page-1.xml` | **52** | Páginas institucionais |
| `wp-sitemap-taxonomies-category-1.xml` | 1 | Só `/category/uncategorized/` |
| `wp-sitemap-users-1.xml` | — | Autores; não migrar |
| **Total indexável** | **~259** | |

Distribuição dos posts por ano: 2021 (8), 2022 (36), 2023 (59), 2024 (48),
2025 (30), **2026 (26)** — o mais recente é de 17/08/2026. **O blog está ativo.**

### Método (para repetir antes do cutover)

```bash
curl -s https://www.atra.com.br/wp-sitemap.xml \
  | grep -o '<loc>[^<]*</loc>' | sed 's|<[^>]*>||g' \
  | while read -r s; do curl -s "$s"; done \
  | grep -o '<loc>[^<]*</loc>' | sed 's|<[^>]*>||g' \
  | sort -u > wp-urls-$(date +%F).txt
```

Complementar com, na ordem de confiabilidade:
1. **Google Search Console** → Páginas → exportar todas as URLs com impressões
   dos últimos 12 meses. **É a única fonte que diz o que de fato ranqueia.**
2. `site:atra.com.br` no Google, para achar o que está indexado fora do sitemap.
3. Log do servidor / Cloudflare: URLs com tráfego real, inclusive as que dão 404
   hoje.
4. Backlinks (Ahrefs/Search Console → Links) — URLs com link externo são as mais
   caras de quebrar.

## Grupos de redirect

| Grupo | Qtd | Origem | Destino | Situação |
|---|---|---|---|---|
| **Posts do blog** | 207 | `/YYYY/MM/DD/slug/` | `/blog/[slug]` | 1:1 automatizável — slug já é o último segmento |
| **Cases** | 4 | `/case-<nome>/` | `/cases-de-sucesso/[slug]` | 1:1 manual; os 4 batem com os do protótipo |
| **Índice de cases** | 1 | `/case-de-sucesso/` | `/cases-de-sucesso` | 1:1 |
| **Blog índice** | 1 | `/blog/` | `/blog` | 1:1 |
| **Contato** | 1 | `/contato/` | `/contato` | 1:1 — valida D-10 |
| **Institucionais** | ~8 | `/quem-somos/`, `/sobre/`, `/conheca-atra/`, `/nossas-conquistas/` … | `/sobre` | **N:1** — o WP tem páginas redundantes |
| **Carreiras** | ~3 | `/carreiras/`, `/trabalhe-conosco/`, `/programa-de-trainee/` | `/carreiras` | N:1 |
| **Soluções** | **13** | `/cloud/`, `/data-integration/`, `/governanca-de-dados/`, `/inteligencia-artificial/`, `/data-analytics/`, `/master-data-management/`, `/data-discovery/`, `/customer-360/`, `/fabrica-de-transformacao-de-dados/`, `/sustentacao-remota/`, `/treinamento/`, `/alocacao-de-consultores/`, `/assessoria-em-produtos/` | `/solucoes/[slug]` | ⚠️ **O protótipo modela 6 soluções; o WP tem 13 páginas** |
| **Segmentos** | **10** | `/bancos-seguradoras-servicos-financeiros/`, `/educacao/`, `/logistica/`, `/varejo/`, `/telecom/`, `/industria/`, `/saude/`, `/utilidades/`, `/segmentos/`, `/segmentos-atra/` | — | ⚠️ **Sem equivalente no protótipo** |
| **Vagas** | **7** | `/engenheiroa-de-dados-sr-azure-databricks/`, `/key-account-manager-pl-sr/`, `/engenheiro-de-dados-sr-oracle-cloud-oci/`, `/analytics-engineer-sr-gcp-dbt-looker-plataform/`, `/analista-de-sistemas-net-sr/`, `/trainee-engenheiro-de-data-analytics-ai/`, `/cientista-de-dados-pl-sr/` | `/carreiras/[slug]` | ⚠️ **Responde P-02**: as vagas são páginas do WP hoje. Destino 1:1 e não âncora em `/carreiras` — âncora levaria o candidato à lista, não à vaga |
| **Parceiros / clientes** | 2 | `/parceiros/`, `/clientes/` | `/parceiros`, `/sobre` | Protótipo não tem índice de parceiros |
| **Legal** | 1 | `/politicas-e-termos/` | ⚠️ sem destino | Rodapé do protótipo tem 3 links `#` para Privacidade/Termos/Cookies |
| **Eventos** | 1 | `/eventos/` | ⚠️ sem destino | |
| **Descartar** | 2 | `/em-manutencao/`, `/health-check/` | `410 Gone` | Páginas técnicas |
| **Taxonomia vazia** | 1 | `/category/uncategorized/` | `410 Gone` | |

## Formato do arquivo de mapeamento

CSV versionado em `docs/02-especificacao/dados/redirects.csv`, consumido pelo
`next.config.ts` em build e testado no CI.

```csv
from,to,status,note
/2026/07/15/arquitetura-multicloud-exige-uma-nova-governanca-de-dados/,/blog/arquitetura-multicloud-exige-uma-nova-governanca-de-dados,301,post 1:1
/quem-somos/,/sobre,301,N:1 consolida com /sobre e /conheca-atra
/em-manutencao/,,410,pagina tecnica
```

> ✅ **As linhas de post e de vaga são geradas** por
> `web/scripts/wp-import/gerar-redirects.ts` (MIG-086): 207 + 7 = 214 linhas,
> todas com destino conferido contra o banco. Rodar de novo **preserva** o que
> foi curado à mão — a curadoria das ~30 institucionais é da Fase 4c.
>
> ⚠️ O `to` sai do **banco**, não do WordPress. O hook de `slugField` normaliza o
> slug na gravação, e um post do corpus tem `%c2%b2` no slug do WP (um "²"
> percent-encoded), que vira `-c2-b2`. Gerando a partir do WP, essa linha
> mandaria o leitor para uma rota que o site novo não serve — e seria a única
> errada entre 207.
>
> ⚠️ A regra de catch-all abaixo **não cobre esse post**: ele precisa da linha
> explícita, que o CSV já tem.
>
> ⚠️ **São 7 vagas, não 6.** `cientista-de-dados-pl-sr` foi publicada em
> 20/08/2026, depois do levantamento do sitemap. O gerador identifica vaga pelo
> marcador `#vemserATRA` no corpo da página, e não por lista de slugs — que é o
> que deixou este número desatualizado.

Regras:
- `from` sempre com barra final (padrão do WP); `to` sem.
- **Sem vírgula na `note`**: são 4 colunas sem aspas, e quem fizer `split(',')`
  no `next.config.ts` lê metade da justificativa como uma quinta coluna.
- `status` 301 para movido, 410 para removido de propósito. **Nunca 302.**
- Toda linha tem `note` — redirect sem justificativa vira mistério em 6 meses.
- Os 207 posts entram por script, não à mão; o resto é curado.
- **Teste de CI:** para cada linha, `GET from` deve responder 301 e `to` deve
  responder 200. Roda contra staging antes do cutover.

Regra de catch-all no `next.config.ts`, para os posts:

```ts
{ source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug', destination: '/blog/:slug', permanent: true }
```

## Metadata por rota

`generateMetadata` em toda page. Fallbacks: `seo.metaTitle` → `title`;
`seo.metaDescription` → `summary`; `seo.ogImage` → `heroImage`/`coverImage` →
`site-settings.defaultOgImage`.

| Rota | Title (PT) | Description |
|---|---|---|
| `/` | `ATRA — Inteligência de dados é a nossa especialidade` | Consultoria de dados e IA, +15 anos, parceira Google Cloud |
| `/sobre` | `Sobre a ATRA` | do global `pages` |
| `/solucoes` | `Soluções em Dados, IA e Cloud` | índice |
| `/solucoes/[slug]` | `{solution.title} — ATRA` | `solution.shortDescription` |
| `/cases-de-sucesso` | `Cases de Sucesso` | listagem |
| `/cases-de-sucesso/[slug]` | `{case.title} — Case {case.client}` | `case.summary` |
| `/blog` | `Blog — Dados, IA e Cloud` | listagem |
| `/blog/[slug]` | `{post.title}` | `post.summary` |
| `/relatorios`, `/ebooks`, `/webinars` | `{Tipo} — ATRA` | listagem |
| `/glossario` | `Glossário de Dados e IA` | 17+ termos |
| `/consultores` | `Alocação de Consultores` | |
| `/carreiras` | `Carreiras na ATRA` | |
| `/contato` | `Fale com a ATRA` | |
| `/chat` | `ATRA AI` | `noIndex` |
| `/design-system` | `Design System` | `noIndex` |

Template global: `%s | ATRA` (exceto a home, que usa título próprio).

## Canonical e hreflang (D-07)

```tsx
alternates: {
  canonical: `https://www.atra.com.br${ptPath}`,
  languages: {
    'pt-BR': `https://www.atra.com.br${ptPath}`,
    'en':    `https://www.atra.com.br/en${enPath}`,
    'x-default': `https://www.atra.com.br${ptPath}`,
  },
}
```

Cada URL aponta para si mesma como canonical; `hreflang` é **recíproco** (a página
EN referencia a PT e vice-versa) — sem isso o Google ignora o par.

⚠️ Página EN sem tradução do conteúdo **não entra no sitemap nem ganha hreflang**.
Publicar `/en/blog/[slug]` com corpo em português é conteúdo duplicado.

## Sitemap

`app/sitemap.ts` gerado do Payload, só com `_status: published`:

| Grupo | `changeFrequency` | `priority` |
|---|---|---|
| `/` | weekly | 1.0 |
| Soluções, `/sobre`, `/contato` | monthly | 0.9 |
| Cases (detalhe) | monthly | 0.8 |
| Posts | monthly | 0.7 |
| Listagens | weekly | 0.6 |
| Glossário, materiais | monthly | 0.5 |

Excluir: `/chat`, `/design-system`, `/admin`, rascunhos e locales sem tradução.

## robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /design-system

Sitemap: https://www.atra.com.br/sitemap.xml
```

⚠️ O robots atual traz `Content-Signal: ai-train=yes, search=yes, ai-input=yes`.
Manter ou não é decisão da ATRA — ver P-12.

## Dados estruturados (JSON-LD)

| Tipo | Onde | Campos |
|---|---|---|
| `Organization` | layout raiz | nome, logo, `sameAs` (LinkedIn, Instagram, YouTube), `contactPoint` |
| `WebSite` + `SearchAction` | layout raiz | busca interna |
| `BreadcrumbList` | toda página interna | |
| `Article` | `/blog/[slug]` | `headline`, `datePublished`, `author`, `image` |
| `Article` + `about` | `/cases-de-sucesso/[slug]` | ⚠️ `CaseStudy` não é tipo do schema.org; usar `Article` |
| `Service` | `/solucoes/[slug]` | `provider`, `areaServed` |
| `JobPosting` | vagas | ⚠️ Só se P-02 for resolvida com dado estruturado real — `JobPosting` inválido gera penalidade no Google for Jobs |
| `VideoObject` | `/webinars/[slug]` | quando `state: recorded` |
| `DefinedTermSet` | `/glossario` | |
| `FAQPage` | onde houver FAQ | |

## Prioridade máxima de preservação

Sem acesso ao Search Console, a prioridade é inferida de estrutura e volume — a
**confirmar com dados reais antes do cutover** (P-13):

1. **Os 207 posts** — 6 anos de conteúdo, o ativo de SEO orgânico do domínio.
   Perder isso é perder o tráfego que sustenta o domínio inteiro.
2. **As 13 páginas de solução** — são as páginas comerciais; provável destino de
   busca por serviço ("governança de dados", "master data management").
3. **As 10 páginas de segmento** — busca por vertical.
4. `/`, `/quem-somos/`, `/contato/`, `/clientes/`.
5. Os 4 cases.

> [!DECISÃO PENDENTE] **P-12** — manter o `Content-Signal: ai-train=yes` do
> robots.txt atual? Autoriza treino de modelos com o conteúdo da ATRA.

> [!DECISÃO PENDENTE] **P-13** — exportar do Search Console as URLs com impressão
> nos últimos 12 meses. Sem isso, a priorização de redirects é palpite estruturado,
> não dado.

> [!DECISÃO PENDENTE] **P-14** — `/politicas-e-termos/` e `/eventos/` não têm
> destino no site novo; o rodapé do protótipo tem 3 links legais apontando para
> `#`. Portar a página legal existente ou redirecionar para a home?
