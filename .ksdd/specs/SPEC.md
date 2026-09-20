<!--
Salvar em: .ksdd/specs/SPEC.md (default v0.6.0+)
-->

# SPEC.md — ATRA (site institucional, migração para Next.js + Payload)

> Site institucional de uma consultoria de Dados & IA, reconstruído para que o marketing publique sozinho e o domínio ganhe SSR/SEO — portado pixel a pixel do protótipo legado.

**Versão:** 1.0
**Última atualização:** 28/08/2026
**Status:** Aprovado
**Plataforma alvo (MVP):** Web responsivo (375 / 768 / 1280)
**Idioma da interface:** pt-BR (raiz) + en-US (`/en`, slugs traduzidos)
**Origem:** Reverse-engineered via `/ksdd:setup` em 28/08/2026 (a partir de `docs/`, código e git).
**Aviso:** Artefato gerado automaticamente. As seções 4 (dados), 7 (páginas), 8 (componentes) e 14 (fases) são derivadas do código e confiáveis; as seções 2 (personas) e 15 (métricas) carregam inferência — revise antes de usar como contrato. Autoridade: `docs/02-especificacao/` e `docs/00-contexto/`.

---

## 1. Visão do Produto

### 1.1 Problema
O site institucional da ATRA vive em **WordPress** (`atra.com.br`, ~259 URLs, 207 posts de blog de 2021–2026 — o principal ativo de SEO), onde **publicar depende de desenvolvedor**. Em paralelo existe um **protótipo React + Vite** (`legacy/`, gerado no Google AI Studio) — uma SPA client-side **sem SSR, sem `<meta>` por rota, sem 404 real**, portanto invisível para busca, e que cobre só 20 das ~259 URLs. Sintomas concretos: 4 formulários que não enviam nada (lead perdido), números institucionais divergentes entre páginas (P-01), 5 links de solução e 3 links legais apontando para `#`, `/contato` quebrado.

### 1.2 Solução
Reconstruir em **Next.js 16 (App Router) + Payload CMS 3 + PostgreSQL**, tratando `legacy/` como **gabarito visual** portado pixel a pixel (inclusive defeitos, D-15). Todo conteúdo hardcoded vira collection/global/mídia do CMS; o marketing (papel `editor`) cria, edita com **Live Preview** e publica sem aprovação e sem dev — e publicar **atualiza o site sem deploy** (MIG-143). Cada rota é SSR/SSG com metadata, `hreflang`, JSON-LD e sitemap. O WordPress é **substituído** (D-02) com 261 redirects 301, e a virada só ocorre com **paridade de conteúdo** (D-17).

### 1.3 Público-Alvo
Dois lados: **quem publica** (marketing da ATRA, no CMS) e **quem visita** (potenciais clientes B2B de Dados/IA/Cloud em setores regulados). Secundários: admin do CMS, RH (vagas), candidatos, leitores de conteúdo, parceiros de tecnologia. Detalhe na seção 2.

### 1.4 Referência Principal
Site institucional B2B de consultoria de tecnologia (portfólio + cases + blog de autoridade + materiais ricos + carreiras), com a exigência extra de **paridade visual absoluta** com o protótipo e **handoff real** para o marketing (a experiência do editor é entregável, não consequência — D-20).

---

## 2. Personas

### 2.1 Marina — Editora de Marketing (usuária primária do CMS)
- Analista de marketing da ATRA, ~30 anos, sem acesso ao código.
- **Hoje:** abre um chamado ou pede a um desenvolvedor para publicar um case, corrigir um número institucional ou subir um post. Espera dias.
- **Frustração:** não consegue ver como a página fica antes de publicar, nem corrigir um número sozinha; texto errado fica no ar até alguém "ter tempo".
- **Espera:** criar um case com imagem, ver o resultado (Live Preview), publicar, e corrigir uma métrica — tudo em português, sem chamar ninguém. **É a persona cujo sucesso define a migração** (`README.md:16`, verificado em MIG-127).
- **Uso:** desktop, no horário comercial; admin em português; publica em rajadas (campanha, novo case, vaga).

### 2.2 Ricardo — Decisor B2B (visitante primário)
- Gerente/diretor de dados ou TI numa empresa regulada (banco, seguradora, saúde, varejo), ~40 anos.
- **Hoje:** pesquisa fornecedores de engenharia de dados/IA no Google, chega por um post de blog ou por busca de marca, compara.
- **Frustração:** páginas magras, sem prova (cases reais, parceiros, selos), difíceis de achar no Google.
- **Espera:** entender rápido o que a ATRA faz, ver cases do seu setor, e falar com alguém — por formulário, WhatsApp ou o chat.
- **Uso:** desktop no trabalho e mobile; entra por SEO orgânico (por isso o SSR/metadata importam); converte por formulário de contato ou download de material.

### 2.3 Paula — Candidata a vaga (visitante secundária)
- Profissional de dados/analytics buscando recolocação, ~28 anos.
- **Hoje:** vê a vaga publicada como página comum do site (não há ATS).
- **Frustração:** não sabe se a vaga ainda está aberta; formulário que não envia.
- **Espera:** ler a vaga, ver a área/senioridade, candidatar-se com currículo.
- **Uso:** mobile, fora do horário comercial. ⚠️ O formulário de candidatura **só entra no ar após P-17** (retenção de currículo/LGPD).

> Persona de RH e de admin do CMS existem, mas são operacionais (publicar vaga; gerir navegação/usuários/dado sensível) e derivam dos perfis da seção 6.

---

## 3. Identidade Visual e Direção de Design

Tokens completos em **[DESIGN.md](DESIGN.md)** (formato Google Stitch, extraído do `globals.css`). Direção em resumo:

### 3.1 Personalidade da Marca
Técnica, confiável e moderna, sem clichê de "startup de IA". **Competência tranquila**: nada grita; o brilho fica nos detalhes.

### 3.2 Paleta de Cores (direção)
**Escuro por padrão** (grafite `#0E1015`), com tema claro alternável. Acento **azul→laranja** (`#3C98FA` → `#FF8B08`) em gradiente para títulos de destaque e CTAs. Paleta dual (claro/escuro) com os mesmos tokens.

### 3.3 Tipografia (direção)
Família única **Mona Sans** (variável, `next/font/google`, D-16). Títulos **leves** (peso 300, `-0.02em`); corpo normal; rótulos de botão em caixa-alta espaçada.

### 3.4 Iconografia
Lista **fechada** de ícones (select em `blocks/shared.ts`, espelhada em `components/blocks/icones.ts`) — `lucide-react` + `@iconify`. Sem SVG como mídia de upload (MIG-144).

### 3.5 Tom Geral
Editorial e sóbrio na tipografia; energético nos acentos. A hierarquia vem de tamanho e espaço, não de bordas.

---

## 4. Modelo de Dados

**19 collections + 5 globals** (Payload/Postgres). Campos de texto `localized` (PT/EN); conteúdo com `drafts`; `access.read` esconde rascunho (exceto `isPublic`). Detalhe de schema em [architecture.md](architecture.md#3-modelo-de-dados-schemas).

### 4.1 Conteúdo com página própria
`Cases`, `Posts` (blog, 207 do WP), `Solutions`, `Segments`, `Resources` (relatórios+ebooks), `Webinars`, `Jobs`, `Partners`, `Pages` (home/sobre/carreiras/contato por blocos). Todas com slug localizado, `seo`, e a maioria montável por **blocos**.

### 4.2 Referência / apoio
`Media` (WebP, sem SVG), `Topics` (taxonomia controlada + filtro), `Testimonials` (foto opcional→monograma), `Clients` (esteira de logos), `GlossaryTerms`, `SpecialistRoles` (perfis de cargo, **não pessoas**).

### 4.3 Sistema / dados sensíveis
`Users` (editor|admin), `FormSubmissions` (LGPD, sem IP/UA), `PrivateFiles` (bucket privado), `AiUsage` (teto de custo do chat).

### 4.4 Globals
`Navigation` (mega-menu, 8 categorias), `Footer`, `Contact` (não localizado; dois formatos do telefone, D-15), `SiteSettings` (métricas com `pending` P-01, logo, selos), `AtraAi` (systemPrompt localizado + teto).

### 4.5 Relações-chave
`Cases → topics/partners/testimonials/media`; `Posts → tags` (texto solto, sem relação — P-27); `Resources → private-files`; `Segments → solutions/cases/clients` (a página se auto-monta); `Navigation` puxa painéis de `solutions/partners/segments`.

---

## 5. Fontes de Dados
- **Importação do WordPress** (`scripts/wp-import/`) — 207 posts (HTML→Lexical), 287 imagens, 7 vagas, links internos reescritos.
- **Seed** (`scripts/seed/`) — fixtures de teste; **só com `SEED_FIXTURES=1`** (senão conteúdo inventado iria ao ar); mesma chave insere imagens do protótipo (D-27).
- **Submissões de usuário** — formulários (contato, newsletter, banco de talentos, candidatura, download) → `FormSubmissions` → e-mail (Resend) → RD Station CRM (D-26).
- **Gerado pelo sistema** — respostas do chat (Gemini), URLs assinadas de download, sitemap/JSON-LD/redirects.

---

## 6. Perfis de Usuário e Permissões

| Perfil | Pode | Não pode |
|---|---|---|
| **Visitante (não logado)** | Ver todo conteúdo publicado; enviar formulários; usar o chat (dentro do rate-limit); baixar material gated | Ver rascunhos; acessar o admin; ler bucket privado |
| **Editor (marketing)** | Criar, editar e **publicar** todo conteúdo; Live Preview; corrigir métricas e globals de conteúdo | Mudar navegação/rodapé/prompt da IA; gerir usuários; ver dado pessoal de terceiros (CV); auto-promover-se a admin |
| **Admin** | Tudo do editor **+** navegação, rodapé, `AtraAi`, `SiteSettings.foundedYear`, usuários, `FormSubmissions` (dado pessoal), `PrivateFiles` | — |

Sem etapa de aprovação: quem edita, publica (D-19). Rede de segurança = drafts + Live Preview + versionamento + "nada ao ar sem corpo" (D-08).

---

## 7. Estrutura de Páginas e Telas

### 7.1 Navegação Global
- **Header** com **mega-menu** (global `Navigation`, até 8 categorias; painéis alimentados por `solutions`/`partners`/`segments`), busca, alternador de tema, **gaveta mobile**. ⚠️ `/solucoes` e `/segmentos` ainda não estão no menu (adicionar mudaria as rotas sob gate — decisão de navegação pendente).
- **Footer** (global `Footer`, 4 colunas: links + contato), com os 3 links legais → `/politicas-e-termos`.
- **Roteamento:** PT na raiz, EN em `/en` com slugs traduzidos (`lib/routes.ts` + `proxy.ts`). 404 catch-all; 410 para URLs aposentadas do WP.

### 7.2 Home (`/`)
**Objetivo:** apresentar a ATRA e converter. **Seções (blocos):** `homeHero` → `logoMarquee` (clientes) → `featureTabs` → `homeBento` → `caseCarousel` → `testimonialCarousel` → `contentTeaser` → `ctaContact`. **Mobile:** carrosséis viram scroll horizontal; bento empilha. **Sob gate visual.**

### 7.3 Cases (`/cases-de-sucesso` + `/[slug]`)
Listagem com filtro (chips de `topics` com `showInFilter`) + página de detalhe (herói, desafio, solução, resultados, depoimento). **Fatia vertical de referência** do projeto. Sob gate.

### 7.4 Soluções (`/solucoes` + `/[slug]`)
Índice das ofertas (D-09) + página por solução com `hasPage` (5 das 6 do legado sem página → índice). 18 ofertas após publicar as 12 do WP (P-16). Fora do gate (comportamento mudou).

### 7.5 Segmentos (`/segmentos` + `/[slug]`)
8 verticais (bancos, saúde, varejo, educação, logística, telecom, indústria, utilidades) — só do WP. Página se auto-monta de relações. Sem gabarito (rota nova).

### 7.6 Conteúdo editorial
`/blog` + `/[slug]` (207 posts reais — **fora do gate**, com smoke), `/relatorios`, `/ebooks`, `/webinars` (embed de vídeo, D-11), `/insights` (hub), `/glossario`. Materiais podem ser **gated** (download por formulário → URL assinada).

### 7.7 Institucional e conversão
`/sobre`, `/carreiras` (+ `jobsList`, 7 vagas), `/contato` (nova, D-10 — formulário + endereço + WhatsApp + redes), `/parceiros` + `/[slug]`, `/consultores` (catálogo de perfis com filtros), `/politicas-e-termos` (LGPD).

### 7.8 Interativas / internas
`/chat` (ATRA AI), `/newsletter` (dupla opt-in), `/design-system` (interno, `noindex`).

---

## 8. Componentes Globais Reutilizáveis

**Blocos de conteúdo (26)** — o vocabulário de layout que o marketing compõe:

| Grupo | Blocos |
|---|---|
| Home | `homeHero`, `logoMarquee`, `featureTabs`, `homeBento`, `caseCarousel`, `testimonialCarousel`, `contentTeaser`, `insightsHub` |
| Solução | `methodCards`, `bentoGrid`, `audienceSplit`, `accordionSteps` |
| Parceiro | `partnerHero`, `partnerSplit`, `partnerShowcase` |
| Institucional/genéricos | `pageHero`, `stickyPageNav`, `statsGrid`, `richTextSection`, `iconCardGrid`, `valueCards` (variantes glow/expanded), `sealsBanner`, `processSteps`, `jobsList`, `ctaContact`, `ctaBanner` |

**Componentes de UI (design system):** `StatusBadge`, `MetricChip`, `GlowCard`, `ContentCard`, `TabFilter`, `SearchInput`, `EmptyState` (verificados por `paridade-ds.spec.ts`). **Chrome:** `SiteHeader`/mega-menu, `SiteFooter`, `ThemeToggle`. Regra: bloco novo exige justificativa no PR; prefira **variante** de bloco existente.

---

## 9. Touchpoints Críticos
- **"Fale conosco"** — CTA recorrente (`ctaContact`/`ctaBanner`) → `/contato`; âncora `/#fale-conosco` na home.
- **Chat "ATRA AI"** — bolha/rota persistente para qualificar o lead e conectar a soluções.
- **Download de material** — botão de download que abre formulário gated → URL assinada (captura lead + UTM).
- **Candidatura** — CTA nas vagas (após P-17).
- **Alternador de tema** — botão fixo (claro/escuro).

---

## 10. Responsividade

| Breakpoint | Comportamento |
|---|---|
| Desktop (1280px+) | Layout pleno; mega-menu; grids/bento em múltiplas colunas; carrosséis com trilho |
| Tablet (768–1279px) | Colunas reduzidas; `padding` de cartão sobe para 32px; menu ainda horizontal |
| Mobile (<768px) | Gaveta de navegação; carrosséis viram scroll horizontal; bento e grids empilham |

Os três breakpoints são exatamente os viewports da regressão visual (375/768/1280).

---

## 11. Interações e Comportamentos
- **Carrosséis e rotações** — congelados com `?e2e=1` para captura determinística; no site, autoplay com pausa no hover (esteira de logos).
- **GlowCard** — borda de brilho que segue o cursor (`[data-glow]`, variáveis `--x/--y/--hue`).
- **Formulários funcionam sem JS** (Server Actions); anti-spam por honeypot + carimbo; robô recebe sucesso falso (exceto onde sucesso = download).
- **Newsletter** — dupla confirmação (e-mail com token; só inscrito após `confirmedAt`).
- **Tema** — alternador claro/escuro; contraste medido nos dois (`contraste.spec.ts`).
- **Empty/error states** — `EmptyState`; listagens sem item mostram estado vazio; chat degrada com mensagem amigável ao atingir o teto.
- **Anel de foco removido** fora de campos de formulário — débito de a11y portado (D-13), não "consertar".

---

## 12. Modelo de Negócio (Impacto na Interface)

Não há paywall nem planos — é **geração de leads B2B**, não SaaS. A monetização é indireta (fechar contratos de consultoria). O que aparece na UI:

### 12.1 "Planos"
Não aplicável. O produto é institucional/lead-gen.

### 12.2 Onde o "gate" aparece
- **Materiais ricos gated** (`Resources` com `file` → private-files): o download exige preencher o formulário → URL assinada de 15 min.
- **Chat** com teto: ao esgotar a cota (por IP/hora ou custo diário), responde indisponibilidade em vez de gastar mais (D-12).
- **CTAs de contato** onipresentes — o "conversion point" é o lead, não o pagamento.

---

## 13. Fluxos Críticos (User Journeys)

### 13.1 Editor publica um case (o fluxo que define sucesso)
Marina entra no admin (pt) → cria `Case` → sobe `heroImage` (Media) → preenche summary/desafio/solução/resultados → **Live Preview** mostra a página → publica → `revalidatePath` atualiza o site **sem deploy** → depois corrige um número em `SiteSettings.metrics`. Verificado sob observação na Fase 6 (MIG-127).

### 13.2 Visitante converte por formulário
Ricardo chega por SEO → lê um case → clica "Fale conosco" → `/contato` → envia → **anti-spam → grava (Postgres) → e-mail (Resend) → RD Station CRM** com UTM. Aviso/CRM nunca derrubam a gravação.

### 13.3 Download de material gated
Visitante clica em baixar um relatório → formulário → `baixarMaterial` valida (robô não recebe sucesso) → devolve **URL pré-assinada** do bucket privado → lead + UTM capturados.

### 13.4 Conversa com a ATRA AI
Visitante abre `/chat` → mensagem → `/api/chat` (Gemini) dentro do rate-limit por IP + teto diário → resposta com **UI generativa** (cards de serviço/parceiro/contato) → degradação graciosa se sem chave/no teto.

### 13.5 Descoberta orgânica (SEO)
Robô do Google indexa `/blog/[slug]` (SSR, metadata, JSON-LD Article, hreflang) → visitante entra por busca → navega para soluções/cases → converte. As 261 URLs antigas do WP redirecionam 301 (ou 410 se aposentadas).

---

## 14. Fases de Entrega

Detalhe e critérios verificáveis em `docs/03-plano/roadmap.md`. Status atual: **93 de 109 tasks (85%)**; site **no ar em homologação** na VPS com conteúdo real.

### Fase 1 — Entregue (o que já existe hoje)
- **Fundação (F1):** Next+Payload, Postgres, S3, i18n, CI, regressão visual, Mona Sans, papéis editor/admin.
- **Fatia vertical (F2):** Cases ponta a ponta + design system + `CLAUDE.md`.
- **Fábrica de rotas (F3):** 20 rotas do protótipo (15 sob gate).
- **Conteúdo (F4a/b/c):** todo conteúdo no CMS; 207 posts/287 imagens/7 vagas; 8 segmentos, 18 soluções, legal, 261 redirects.
- **Formulários/SEO (F5, parcial):** formulário de contato envia; metadata/sitemap/JSON-LD/redirects; budget guard do chat; tema claro testado; UTM.
- **Endurecimento (F6, parcial):** staging na VPS, deploy por `git push` com rollback, backup com restore verificado, axe no gate, hardening de segurança (MIG-140–147), revalidação sem deploy.

### Fase 2 — Fechar a Fase 5/6 (espera chave/conta/decisão)
GA4/GTM + consentimento, Resend em produção, candidatura (P-17), 9 materiais editoriais (P-07), Sentry, uptime, cópia externa de backup, **treinamento do editor (MIG-127/128)**.

### Fase 3 — Cutover e limpeza (espera decisão/acesso, não engenharia)
DNS apontado para o site novo (P-23, acesso Cloudflare), WP desativado com 30 dias de contingência, amostra de 30 URLs testada, Search Console sem pico de 404. Depois: remover `legacy/`, dívida priorizada, desligar WP.

---

## 15. Métricas de Sucesso

⚠️ **Sem baseline quantitativo hoje** (P-19: pode não haver analytics no WP) — instalar GA no WP **agora** é a única forma de comparar no cutover. KPIs numéricos ficam `[a definir]` até haver baseline.

| Métrica | Meta |
|---|---|
| **Critério de sucesso primário** | Uma pessoa de marketing cria+publica um case e corrige um número, sem dev, sob observação (MIG-127) — passa/não passa |
| Paridade de SEO no cutover | Sem pico de 404 no Search Console em 48 h; 30/30 URLs antigas → 301/200 |
| Tráfego orgânico pós-cutover | `[a definir — depende de baseline P-19]` |
| Conversão de leads (formulário/chat) | `[a definir]` |
| Lighthouse (5 rotas mais vistas) | ≥ 90 em Performance, SEO, Best Practices (critério da Fase 6) |
| Autonomia do marketing | Nº de publicações sem abrir chamado de dev `[a medir pós-cutover]` |

---

**Próximos passos:**
- `/ksdd:tech` — [architecture.md](architecture.md) já foi gerada neste setup.
- `/ksdd:design` — [DESIGN.md](DESIGN.md) já foi gerado neste setup.
- Revisar os `[verificar]`/`[a definir]` e aprovar (mude `Status:` para `Aprovado`).
