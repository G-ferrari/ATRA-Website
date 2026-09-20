---
status: revisado
atualizado_em: 2026-08-17
depende_de: [seo-e-redirects.md, mapa-de-migracao.md]
---

# Lacuna de escopo: o protótipo não cobre o site atual

> ✅ **Resolvido em 17/08/2026 — caminho A** (paridade de conteúdo antes do
> cutover). Registrado como [D-17](../00-contexto/decisoes.md#d-17--paridade-de-conteúdo-antes-do-cutover).
> Este documento fica como o diagnóstico que fundamentou a decisão.

Todo o planejamento até aqui
tratou o protótipo do AI Studio (20 rotas) como equivalente ao site que ele vai
substituir. O levantamento do sitemap real mostrou que não é.

| | URLs |
|---|---|
| WordPress em produção (`atra.com.br`) | **~259** indexáveis |
| Protótipo em `legacy/` | **20** rotas |

O protótipo não é uma reconstrução do site atual. É um site **novo**, com
proposta diferente, que por acaso tem o mesmo dono.

## O que o protótipo tem e o WordPress não

Sete coisas — o valor real do protótipo, e o motivo de não ser simplesmente
descartado:

`/glossario` (17 termos) · `/insights` (hub agregador) · `/relatorios` ·
`/ebooks` · `/webinars` · `/chat` (ATRA AI) · `/design-system`

## O que o WordPress tem e o protótipo não

### 1. Os 207 posts do blog 🔴

O protótipo tem **6 posts fictícios** (`legacy/src/pages/Blog.tsx:11-60`) com
imagens do Unsplash. Nenhum corresponde a um post real — cruzei os slugs: dos 6,
só o de multicloud tem tema semelhante a um post real, e ainda assim com título
diferente.

O blog real está **ativo**: 8 posts em 2021, 36 em 2022, 59 em 2023, 48 em 2024,
30 em 2025 e **26 em 2026**, o mais recente de 17/08/2026 — hoje.

**São 6 anos de conteúdo e o principal ativo de SEO do domínio.** A rota
`/blog/[slug]` existe no modelo, mas o plano previa semear 6 itens; a tarefa real
é migrar 207 posts com corpo, imagens, datas e autores.

**Efeito colateral bom:** isso resolve boa parte de P-07. A pergunta "quem escreve
o corpo dos artigos?" tinha como resposta implícita "ninguém, eles não existem" —
mas eles existem, no WordPress. Não é redação, é migração.

### 2. As 13 páginas de solução 🔴

O mega-menu do protótipo modela **6 soluções**; o WordPress tem **13 páginas**
publicadas:

`/cloud/` · `/data-integration/` · `/master-data-management/` ·
`/governanca-de-dados/` · `/data-analytics/` · `/data-discovery/` ·
`/customer-360/` · `/fabrica-de-transformacao-de-dados/` ·
`/sustentacao-remota/` · `/treinamento/` · `/assessoria-em-produtos/` ·
`/inteligencia-artificial/` · `/alocacao-de-consultores/`

As duas últimas têm equivalente no protótipo; **as outras 11 não**. E a lista bate
com o portfólio institucional da ATRA, não com as 6 do protótipo — ou seja, o
protótipo **reduziu** a oferta comercial.

D-09 já decidiu criar `/solucoes/[slug]`. A collection `solutions` acomoda 13 tão
bem quanto 6 — o que muda é o volume de conteúdo a migrar e o mega-menu, hoje
desenhado para 3 categorias × 2 itens.

### 3. As 10 páginas de segmento 🔴

`/bancos-seguradoras-servicos-financeiros/` · `/educacao/` · `/logistica/` ·
`/varejo/` · `/telecom/` · `/industria/` · `/saude/` · `/utilidades/` ·
`/segmentos/` · `/segmentos-atra/`

**Zero cobertura no protótipo** — não há rota, componente nem modelagem. São
páginas de vertical, tipicamente boas em busca ("consultoria de dados para
varejo"). Exigiriam uma collection `segments` e um template, nos moldes de
`solutions`.

### 4. As 6 vagas — **isto responde P-02** ✅

`/engenheiroa-de-dados-sr-azure-databricks/` ·
`/engenheiro-de-dados-sr-oracle-cloud-oci/` ·
`/analytics-engineer-sr-gcp-dbt-looker-plataform/` ·
`/analista-de-sistemas-net-sr/` · `/key-account-manager-pl-sr/` ·
`/trainee-engenheiro-de-data-analytics-ai/`

As vagas hoje **são páginas do WordPress**, publicadas pelo RH como qualquer outra
página. Não há ATS integrado. A collection `jobs` do
[modelo-de-conteudo](modelo-de-conteudo.md#jobs-) está correta, e o fluxo atual
(alguém publica no CMS) se mantém — só muda o CMS.

Confirmar com o RH se querem seguir assim ou aproveitar para adotar um ATS.

### 5. Páginas soltas sem destino 🟡

`/clientes/` · `/parceiros/` (índice) · `/eventos/` · `/politicas-e-termos/`

A última é relevante: o rodapé do protótipo tem três links legais
(Privacidade, Termos, Cookies) apontando para `#` (`legacy/src/App.tsx:2522-2524`),
enquanto a página real existe no WordPress. Lançar sem política de privacidade,
com formulários coletando dados pessoais, é problema de LGPD, não de SEO.

### 6. Páginas técnicas a descartar ⚪

`/em-manutencao/` · `/health-check/` · `/category/uncategorized/` → `410 Gone`.

## Resumo da lacuna

| Grupo | URLs no WP | Cobertura no protótipo |
|---|---|---|
| Posts do blog | 207 | rota existe; **conteúdo não** (6 fictícios) |
| Soluções | 13 | 1 construída, 6 modeladas |
| Segmentos | 10 | **nenhuma** |
| Vagas | 6 | nenhuma (mas modelada) |
| Institucionais / cases / contato | ~20 | boa |
| Soltas (legal, eventos, clientes) | 4 | nenhuma |
| Técnicas | 3 | descartar |

**~30 páginas sem destino real + 207 posts a migrar.**

## Caminhos possíveis

| | Abordagem | Escopo | SEO | Prazo |
|---|---|---|---|---|
| **A** | **Paridade de conteúdo antes do cutover.** Migra os 207 posts, cria `segments`, expande `solutions` para 13, importa as 6 vagas e a página legal. O site novo cobre tudo que o WP cobre, e mais | +3 collections, +2 templates, migração em volume | Preservado | Maior |
| **B** | **Cutover parcial com WP em subdomínio.** Site novo assume `atra.com.br`; o blog antigo continua vivo em `blog.atra.com.br` até ser migrado | Menor agora | ⚠️ Divide autoridade de domínio; migração de blog fica "para depois" e costuma não acontecer | Menor |
| **C** | **Cutover só do institucional.** Site novo nas rotas que ele cobre; WP mantém `/blog/*`, `/cloud/`, `/educacao/` etc. via proxy de caminho | Menor | Frankenstein com dois designs no mesmo domínio | Menor |
| **D** | **Reduzir o site.** 301 das ~237 URLs sem equivalente para as páginas mais próximas | Mínimo | ❌ Descarta 6 anos de conteúdo e 23 páginas comerciais | Mínimo |

**Recomendação: A**, com a migração dos posts automatizada.

Os 207 posts saem da API REST do WordPress (`/wp-json/wp/v2/posts?per_page=100`),
que entrega título, slug, corpo em HTML, data, autor, categorias e imagem
destacada. Converter HTML → Lexical e baixar as mídias é um script, não trabalho
manual — o mesmo script do seed da Fase 4, com outra fonte. **O custo real está em
segmentos e soluções**, que são conteúdo de página montada e precisam de decisão
editorial, não de conversão automática.

D é a única que eu desaconselho ativamente: joga fora o ativo que justifica o
domínio ranquear.

✅ **P-15 resolvida: caminho A.** Entram no roadmap três frentes novas — migração
do blog (207 posts, por script), collection `segments` (10 páginas) e expansão de
`solutions` de 6 para 13.

> [!DECISÃO PENDENTE] **P-16** — o protótipo reduziu a oferta de 13 soluções para
> 6, e não tem segmentos. Isso foi decisão de posicionamento do marketing, ou
> simplificação de protótipo? Muda se estamos restaurando conteúdo ou respeitando
> uma escolha já feita.
>
> **O momento é oportuno:** o protótipo está em análise interna na ATRA agora
> (publicado em `atra-website.ai.studio`, ainda não divulgado). Esta lacuna é
> exatamente o tipo de coisa que a revisão interna precisa ver — e a resposta de
> P-16 provavelmente sai de lá, não da engenharia.
