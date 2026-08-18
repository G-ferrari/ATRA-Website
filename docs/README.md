---
status: rascunho
atualizado_em: 2026-08-17
depende_de: []
---

# Documentação — migração do site ATRA para Next.js + Payload CMS

Especificação executável da migração do site institucional da ATRA, hoje uma SPA
React + Vite gerada no Google AI Studio (preservada em `legacy/`), para
Next.js App Router + Payload CMS 3 + PostgreSQL.

**Objetivo de negócio:** o marketing publica cases, blog e materiais sem depender
de dev, e o site ganha SSR/SEO que hoje não existe.

> **O critério que define sucesso.** Uma pessoa de marketing, sem acesso ao código
> e sem ajuda, cria um case com imagem, vê como ficou, publica, e corrige um número
> institucional — tudo em português. Se isso não for verdade no cutover, a migração
> entregou desempenho e indexação, mas não o que a justificou. Detalhado em
> [experiencia-do-editor](02-especificacao/experiencia-do-editor.md); verificado na
> Fase 6 (MIG-127), com alguém do marketing executando os passos sob observação.

## Os três sites em jogo

Confundir os três leva a conclusões erradas — vale fixar:

| | O quê | Situação |
|---|---|---|
| **`atra.com.br`** | WordPress, ~259 URLs | No ar, público. É o site que será **substituído** (D-02) |
| **`atra-website.ai.studio`** | Build do protótipo React | No ar, **em análise interna** — ainda não divulgado. É o site que estamos **migrando** |
| **`legacy/`** | Código-fonte do protótipo | Neste repositório. Gera o build acima |

O protótipo está sob revisão interna da ATRA agora, o que torna os achados da
Etapa 2 insumo direto dessa revisão — em especial a
[lacuna de escopo](02-especificacao/lacuna-de-escopo.md) entre o que ele cobre e o
que o WordPress cobre.

⚠️ `legacy/` e o build publicado **não são equivalentes em assets**: 30 imagens
chegaram corrompidas ao git, e no ar estão íntegras. Ver
[inventario-assets](01-descoberta/inventario-assets.md#fonte-limpa-para-a-recuperação).

## Convenções

- Documentação em português do Brasil; código, identificadores, campos do Payload
  e mensagens de commit em inglês.
- Toda afirmação sobre o código legado cita `caminho/arquivo.tsx:linha`.
- Lacunas viram `> [!DECISÃO PENDENTE]` no próprio documento, consolidadas depois
  em `00-contexto/decisoes.md`.
- Nenhum documento passa de 400 linhas.
- `status`: `rascunho` → `revisado` → `congelado`. Documento congelado só muda por
  decisão consciente.

## Etapa 1 — Descoberta

| Documento | Status | O que cobre |
|---|---|---|
| [inventario-rotas](01-descoberta/inventario-rotas.md) | rascunho | As 20 rotas: origem, seções, componentes, conteúdo, complexidade e estratégia de renderização sugerida |
| [inventario-componentes](01-descoberta/inventario-componentes.md) | rascunho | 24 componentes exportados + 18 presos em `App.tsx`; 9 duplicações; ordem de porte do design system |
| [inventario-conteudo](01-descoberta/inventario-conteudo.md) | rascunho | Todo conteúdo hardcoded por natureza, o que é CMS vs. microcopy, e o estado real da tradução PT/EN |
| [inventario-assets](01-descoberta/inventario-assets.md) | rascunho | Imagens, ícones e fontes: origem, integridade e destino proposto |
| [debito-tecnico](01-descoberta/debito-tecnico.md) | rascunho | O que bloqueia, o que se resolve durante e o que fica para depois — inclui `/chat` e `/design-system` |
| [decisoes](00-contexto/decisoes.md) | revisado | ADR das 20 decisões tomadas e as 11 pendentes, com o custo de não decidir cada uma |

## Etapa 2 — Especificação

| Documento | Status | O que cobre |
|---|---|---|
| [modelo-de-conteudo](02-especificacao/modelo-de-conteudo.md) | rascunho | 15 collections e 5 globals, campo a campo, com justificativa de cada "collection vs. campo" |
| [blocos](02-especificacao/blocos.md) | rascunho | 19 blocos flexíveis, todos derivados de seções que já existem, e a composição de cada página |
| [contratos-de-dados](02-especificacao/contratos-de-dados.md) | rascunho | Tipos de apresentação, mappers e a regra de que componente não busca dado |
| [mapa-de-migracao](02-especificacao/mapa-de-migracao.md) | rascunho | Rota a rota: origem, destino, renderização, collections, riscos e ordem de execução |
| [seo-e-redirects](02-especificacao/seo-e-redirects.md) | rascunho | Inventário real do WP, grupos de redirect, metadata, sitemap, hreflang, JSON-LD |
| [lacuna-de-escopo](02-especificacao/lacuna-de-escopo.md) | **rascunho ⚠️** | **O protótipo cobre 20 rotas; o site atual tem ~259 URLs.** Quatro caminhos possíveis |
| [dados/wp-urls-2026-08-17.txt](02-especificacao/dados/wp-urls-2026-08-17.txt) | — | As 260 URLs do WordPress, insumo do mapa de redirects |
| [formularios-e-integracoes](02-especificacao/formularios-e-integracoes.md) | rascunho | Formulários, anti-spam, e-mail, analytics, consentimento e a integração da ATRA AI |
| [experiencia-do-editor](02-especificacao/experiencia-do-editor.md) | rascunho | **Papéis, Live Preview, idioma do admin, organização e handoff** — o lado de quem publica |

## Etapa 3 — Plano

| Documento | Status | O que cobre |
|---|---|---|
| [roadmap](03-plano/roadmap.md) | rascunho | 9 fases com critério de conclusão verificável, caminho crítico e riscos de cronograma |
| [tasks](03-plano/tasks.md) | rascunho | 93 tasks atômicas (`MIG-001`…), uma por PR, ordenadas por dependência — ~244h de engenharia |
| [estrategia-de-testes](03-plano/estrategia-de-testes.md) | rascunho | Regressão visual em primeiro lugar, e por quê; pipeline de CI; o que não testar |
| [definicao-de-pronto](03-plano/definicao-de-pronto.md) | rascunho | Checklist de PR e as 6 regras invioláveis |

## Etapa 4 — Infraestrutura

| Documento | Status | O que cobre |
|---|---|---|
| [ambientes](04-infra/ambientes.md) | rascunho | Local, staging e produção; variáveis e onde os segredos vivem; o estado real do DNS e do e-mail da ATRA |
| [docker](04-infra/docker.md) | rascunho | Compose de dev só com dependências (e por quê), Dockerfile multi-stage, e como evitar o custo de CPU da otimização de imagem |
| [deploy-vps](04-infra/deploy-vps.md) | rascunho | Coolify/Dokploy vs. Compose+Caddy em tabela, recomendação, dimensionamento e estratégia de deploy |
| [backup-e-observabilidade](04-infra/backup-e-observabilidade.md) | rascunho | Backup com cópia externa e **restore testado**, Sentry, uptime, logs e plano de recuperação |
| [runbook-cutover](04-infra/runbook-cutover.md) | rascunho | Passo a passo com horário e responsável, critérios de rollback e os 30 dias seguintes |

## Etapa seguinte

| Etapa | Situação |
|---|---|
| 5 — Memória do projeto (`CLAUDE.md`) | escrita ao final da Fase 2 (MIG-031), com o padrão real da fatia vertical — escrevê-la antes seria inventar convenção sem código para sustentá-la |

## Decisões

Registro completo em [00-contexto/decisoes.md](00-contexto/decisoes.md) —
20 decisões tomadas (D-01 a D-20) e 11 pendentes.

| Decisão | Escolha |
|---|---|
| Banco de dados | PostgreSQL |
| Escopo do WordPress | O site novo **substitui** `atra.com.br`, com redirects e migração de mídia |
| Hospedagem | VPS — plataforma (Coolify/Dokploy vs. Compose+Caddy) em aberto (P-05) |
| Idiomas | PT na raiz, **EN sob `/en/...`** com slugs traduzidos; localization desde a fundação |
| Páginas de detalhe | Blog, relatórios, ebooks e webinars ganham `/[slug]` próprio |
| Soluções | `/solucoes` vira índice + página por solução |
| Contato | `/contato` como página real (hoje é link quebrado) |
| Webinars | Embed de YouTube/Vimeo |
| ATRA AI | Rate limit por IP + teto de custo, com degradação graciosa |
| Acessibilidade | axe no CI reportando, sem reprovar PR |
| Porte fiel | Vale também para a decoração — preserva a regressão visual |
| Papéis no CMS | `editor` e `admin`; quem edita publica, sem etapa de aprovação |
| Tipografia | **Mona Sans** (SIL OFL 1.1) via `next/font/google` — mesma build do legado, para não quebrar a regressão visual |
| Versionamento | Branches locais por ora (P-06) |
| Idioma da documentação | PT-BR; código e commits em inglês |

**Pendências que atrasam o seed:** P-01 (métricas institucionais divergentes) e
P-02 (fonte das vagas). Nenhuma bloqueia a modelagem — só os valores.

**Primeira tarefa da Fase 2:** carregar Mona Sans no app legado antes de congelar
qualquer captura de referência (D-16).

## Achados da Etapa 1 que mudam premissas do plano original

1. **Imagens não são "hotlinked do WordPress".** São 33 hotlinks, mas a maior
   parte é arquivo local commitado — e 30 estão corrompidos, todos recuperáveis
   dentro do próprio repositório. Ver [inventario-assets](01-descoberta/inventario-assets.md).
2. **A chave da API do Gemini não está exposta no bundle** — mas há um `define`
   no `vite.config.ts:12` que a exporia no primeiro uso em código de cliente.
   Ver [debito-tecnico](01-descoberta/debito-tecnico.md#rota-chat).
3. **O site é bilíngue pela metade.** i18next cobre navegação e páginas
   institucionais (172 chaves PT / 169 EN), mas nenhum item de conteúdo — cases,
   posts, glossário — está traduzido.
4. **Existe um export de conteúdo pronto**, `legacy/CONTEUDO_DO_SITE.md` (440
   linhas), feito para portar o site a outro CMS. Não estava no briefing e é
   insumo direto da Etapa 2 — a validar contra o código.
5. **Quatro formulários não enviam nada** para lugar nenhum — todo lead
   preenchido hoje é perdido.

## Achado da Etapa 2 que redefine o escopo

**O protótipo não cobre o site que ele vai substituir.** O sitemap de
`atra.com.br` tem ~259 URLs indexáveis contra 20 rotas no protótipo:

- **207 posts de blog reais**, de 2021 a hoje, ativos — contra 6 posts fictícios
  no protótipo. É o principal ativo de SEO do domínio.
- **13 páginas de solução** no ar; o protótipo modela 6 e construiu 1.
- **10 páginas de segmento** (bancos, saúde, varejo, educação…) sem nenhuma
  cobertura.
- **6 vagas** publicadas como páginas — isto responde P-02.
- `/politicas-e-termos/` existe no WP; no protótipo os 3 links legais do rodapé
  apontam para `#`.

Ver [lacuna-de-escopo](02-especificacao/lacuna-de-escopo.md) para os quatro
caminhos possíveis. **P-15 bloqueia a Etapa 3.**
