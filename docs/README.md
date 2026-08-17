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

## Etapas seguintes

| Etapa | Situação |
|---|---|
| 2 — Especificação (modelo de conteúdo, contratos, mapa de migração, SEO/redirects, formulários) | não iniciada |
| 3 — Plano (roadmap, backlog, testes, definição de pronto) | não iniciada |
| 4 — Infraestrutura (ambientes, Docker, deploy VPS, backup, runbook de cutover) | não iniciada |
| 5 — Memória do projeto (`CLAUDE.md`, decisões) | não iniciada |

## Decisões já tomadas

| Decisão | Escolha |
|---|---|
| Banco de dados | PostgreSQL |
| Escopo do WordPress | O site novo **substitui** `atra.com.br`, com redirects e migração de mídia |
| Hospedagem | VPS — plataforma (Coolify/Dokploy vs. Compose+Caddy) em aberto |
| Idiomas | **PT e EN**, com localization do Payload desde a fundação |
| Versionamento | Branches locais por ora; publicação no remoto em aberto |
| Idioma da documentação | PT-BR; código e commits em inglês |

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
5. **Quatro formulários não enviam nada** para lugar nenhum.
