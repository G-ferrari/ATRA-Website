# Feature: Página RC18 (Soluções) + diagnóstico de prontidão

> Nova página de solução, gerida pelo CMS, sobre a **RC 18/2025** do Banco Central — apresenta o processo de consultoria da ATRA sobre Google Cloud, captura leads por formulário (padrão da home) e oferece um **diagnóstico de prontidão** interativo (autoavaliação com nota na hora), acessível como uma aba própria no mega-menu de Soluções.

**Slug:** rc18
**Prioridade:** Alta
**Status:** Rascunho
**Data:** 13/09/2026
**Projeto:** ATRA — site institucional (migração Next.js 16 + Payload CMS 3)

---

## 1. Motivação

### 1.1 Problema / Oportunidade

A **Resolução Conjunta nº 18/2025** (BCB + CMN) entrou em vigor em janeiro de 2026 e cria um requisito novo para o setor financeiro: **qualidade sistemática e auditável da informação prestada ao regulador**, com **prazo de adequação em 31/12/2026**. A norma não é uma ferramenta, é um **programa de governança** — exige política de qualidade aprovada pelo conselho anualmente, diretor responsável designado perante o BCB, **12 dimensões de qualidade** mensuradas e comprováveis, arquitetura com validação automatizada antes do envio, e relatório semestral + dossiê de auditoria retido por 5 anos.

É uma janela comercial concreta e datada para a ATRA (parceira oficial Google Cloud, 15+ anos em dados/IA, 140+ profissionais): existe demanda urgente e finita nos bancos, e a ATRA já tem uma **arquitetura de referência** para a norma sobre Google Cloud (BigQuery, Knowledge Catalog, Dataform, Datastream+Pub/Sub, Looker) e um **e-mail sendo enviado aos clientes** (fonte: `RC18_2026.pdf`). O site precisa de uma landing dedicada que esse e-mail e a executiva do Google Cloud possam linkar — o próprio PDF pede "colocar link de One Page".

Conecta com o problema-raiz do projeto (SPEC §1.1): o site é o motor de **geração de leads B2B** (SPEC §12), e hoje não há destino para essa campanha. A feature transforma o material comercial já pronto em uma página viva, editável pelo marketing (SPEC §2.1), com dois pontos de conversão: o formulário de contato e um diagnóstico rápido que qualifica o lead.

### 1.2 Personas Impactadas

- **Ricardo — Decisor B2B em setor regulado (SPEC §2.2):** é o alvo direto. Diretor/gerente de dados ou TI de banco/seguradora chega pelo e-mail da campanha (ou por busca "RC 18/2025") e precisa entender rápido o que a norma exige, como a ATRA resolve, e se autoavaliar. O diagnóstico dá a ele um retorno imediato ("quão pronto estou?") e à ATRA um lead qualificado.
- **Marina — Editora de Marketing (SPEC §2.1):** ganha uma página de solução como as outras — cria/edita o conteúdo por blocos no CMS, com Live Preview, e publica sem dev. A cópia inicial nasce semeada (rascunho a partir do PDF), mas a decisão de conteúdo é dela (D-22).
- **Admin do CMS (SPEC §6):** passa a ver os leads do diagnóstico em `FormSubmissions` (novo `kind`), com sincronização para o RD Station CRM como qualquer lead comercial (D-29).

### 1.3 Métricas de Sucesso

| Métrica | Meta | Prazo |
|---------|------|-------|
| Página `/solucoes/rc18` no ar, editável no CMS, na aba RC18 do menu | Publicada e linkável pelo e-mail da campanha | v1 |
| Lead capturado pelo formulário e pelo diagnóstico → grava + notifica + CRM | 100% das submissões válidas gravadas em `FormSubmissions`; kind comercial sincroniza no CRM | v1 |
| Diagnóstico entrega índice de prontidão na tela | Resultado exibido em < 1s após responder, sem reload | v1 |
| Conversão da campanha (visitas → leads) | `[a definir — depende de baseline P-19/GA4]` | pós-cutover |

---

## 2. Escopo

### 2.1 O que entra (v1)

- **Nova categoria/aba "RC18"** no mega-menu de Soluções (desktop + gaveta mobile) e no índice `/solucoes`, ao lado de Inovação & IA, Dados/BI e Governança & Cultura.
- **Página `/solucoes/rc18`** montada por blocos existentes e gerida pelo CMS: herói, o que a norma exige, arquitetura de referência sobre Google Cloud, roadmap de adequação em 4 fases (Diagnóstico → Fundação → Evidência → Sustentação), "por que ATRA", CTA para o diagnóstico e formulário de contato.
- **Formulário de contato** na página, no padrão da home (`ctaContact`, com cartão de contato populado), gravando lead como `kind: contact`.
- **Diagnóstico de prontidão** em rota própria (`/diagnostico-rc18`): autoavaliação interativa pelas 12 dimensões da RC 18/2025 que calcula um **índice de prontidão** na hora, exibe o resultado na tela e captura o lead (`kind: rc18-diagnostic`).
- **Botão "diagnóstico gratuito"** na página RC18 levando ao diagnóstico.
- **SEO** por rota (metadata, hreflang, JSON-LD) e **smoke test** das duas rotas novas.
- **PT-BR completo**; EN como stub/redirect (satisfaz a arquitetura de slug localizado — ADR-003).

### 2.2 O que fica pra depois

- **Tradução EN completa** da página e do diagnóstico — o público da RC 18/2025 é 100% nacional; EN só quando houver demanda.
- **Relatório do diagnóstico por e-mail** (PDF/link com o detalhamento por dimensão) — v1 exibe o resultado na tela e envia o lead; o disparo de um relatório formatado fica para v2.
- **Bloco de CMS dedicado ao diagnóstico** (embutir a autoavaliação dentro da página por bloco) — v1 usa rota separada + botão; embutir vira variante de bloco depois, se pedido.
- **Cases/depoimentos específicos de RC18** — quando existirem no CMS, entram por relação, sem código novo.

### 2.3 O que NÃO é essa feature

- **Não** é uma nova top-level entry no menu principal (é uma **aba dentro** do painel de Soluções).
- **Não** redefine o vocabulário de soluções nem publica as 12 soluções do WP em rascunho (P-16, decisão de marketing separada).
- **Não** cria bloco de conteúdo novo se uma variante de bloco existente resolve (D — regra do repositório; DESIGN.md "Don'ts").
- **Não** decide a cópia final: o texto semeado é rascunho a partir do PDF; consolidação de vocabulário e texto é do marketing (D-22).
- **Não** implementa retenção/consentimento além do já existente — depende de P-14 (aviso de consentimento) como qualquer formulário.

---

## 3. User Stories

| # | Como... | Quero... | Para... |
|---|---------|----------|---------|
| US-01 | Decisor de banco (Ricardo) | abrir o link do e-mail e entender o que a RC 18/2025 exige e como a ATRA resolve | avaliar rápido se vale conversar |
| US-02 | Decisor de banco | fazer um diagnóstico rápido e gratuito e ver na hora quão pronto estou | ter um retorno concreto sem esperar reunião |
| US-03 | Decisor de banco | falar com um especialista pelo formulário | agendar o assessment de 30 min |
| US-04 | Editora de marketing (Marina) | editar a página RC18 por blocos no CMS com Live Preview | corrigir e publicar sem dev (D-22) |
| US-05 | Admin do CMS | ver os leads do diagnóstico junto dos demais e sincronizados no CRM | tratar como oportunidade comercial (D-29) |

---

## 4. Fluxos de Uso

### 4.1 Da campanha ao lead qualificado (fluxo principal)

**Pré-condição:** página RC18 publicada; diagnóstico no ar.
**Trigger:** decisor clica no link do e-mail da campanha (ou acha a aba RC18 no menu).

1. Chega em `/solucoes/rc18` (SSR, metadata/JSON-LD).
2. Lê: o que a norma exige → arquitetura Google Cloud → roadmap em 4 fases → por que ATRA.
3. Clica em **"Fazer diagnóstico gratuito"** → `/diagnostico-rc18`.
4. Responde a autoavaliação (12 dimensões, escala de maturidade).
5. Vê o **índice de prontidão** na tela, com leitura por dimensão.
6. Preenche contato para receber o retorno/assessment → submit.
7. Anti-spam → grava (`FormSubmissions`, `kind: rc18-diagnostic`) → notifica (Resend) → RD Station CRM.

**Sucesso:** lead gravado com o resumo do diagnóstico; visitante vê confirmação e resultado.
**Erro / edge case:** robô recebe sucesso falso (não grava); sem chave de Resend/CRM o lead grava e fica pendente (contrato do repositório: aviso/CRM nunca derrubam a gravação); campos cortados no servidor (`MAX_CAMPO`/`MAX_MENSAGEM`).

### 4.2 Contato direto pela página

**Trigger:** visitante prefere falar direto.
1. Rola até a seção de contato em `/solucoes/rc18` (`#fale-conosco`).
2. Preenche nome/e-mail/telefone/mensagem.
3. Submit → mesmo contrato anti-spam → grava (`kind: contact`) → notifica → CRM.

**Sucesso:** lead `contact` gravado. **Erro:** idem 4.1.

### 4.3 Marketing edita a página

**Trigger:** Marina precisa ajustar um número ou um texto.
1. Admin → coleção Soluções → RC18 → edita blocos → Live Preview → publica.
2. `revalidatePath` atualiza o site sem deploy (ADR-007).

---

## 5. Impacto em Telas Existentes

### 5.1 Telas Modificadas

| Tela (SPEC §7) | O que muda | Onde | Por quê |
|---|---|---|---|
| Header / mega-menu (SPEC §7.1, §8) | Nova aba "RC18" no painel de Soluções + linha na gaveta mobile | `components/layout/mega-menu.tsx` (`PainelDeSolucoes`), `mappers/navigation.ts` (`GRUPOS`) | Requisito: RC18 "ao lado dos outros submenus" |
| Índice `/solucoes` (SPEC §7.4) | Novo grupo/categoria RC18 na listagem | `app/(frontend)/[locale]/solucoes/page.tsx` (`CATEGORIAS`) | Consistência com o mega-menu |
| Rota de solução `[slug]` | Passa a popular o cartão de contato do `ctaContact` | `app/(frontend)/[locale]/solucoes/[slug]/page.tsx` (`buscarSolucao` → `comContato`, espelhando `lib/paginas.ts:88-90`) | Formulário no padrão da home (com cartão), hoje nulo em rota de solução |

### 5.2 Telas Novas

#### `/solucoes/rc18` — Página de solução RC18 (CMS/blocos)

**Objetivo:** apresentar a RC 18/2025 e o processo de consultoria da ATRA, e converter (diagnóstico + contato).

**Seções (de cima pra baixo), por blocos existentes:**
- A. **Herói** (`pageHero`) — título, subtítulo, prazo 31/12/2026, selo "ATRA × Google Cloud | Parceiro Oficial".
- B. **Menu fixo da página** (`stickyPageNav`) — âncoras das seções.
- C. **O que a norma exige** (`richTextSection` ou `iconCardGrid`) — política ao conselho, diretor responsável, 12 dimensões, validação antes do envio, relatório semestral + dossiê 5 anos.
- D. **Arquitetura de referência (Google Cloud)** (`bentoGrid`/`iconCardGrid`) — BigQuery, Knowledge Catalog, Dataform, Datastream+Pub/Sub, Looker.
- E. **Roadmap de adequação em 4 fases** (`methodCards` / `accordionSteps`) — Diagnóstico → Fundação → Evidência → Sustentação.
- F. **Por que ATRA** (`valueCards`/`audienceSplit`) — 15+ anos, 140+ profissionais, parceiro oficial Google Cloud.
- G. **CTA para o diagnóstico** (`ctaBanner` variante dark, `secondaryCta`) — "Fazer diagnóstico gratuito" → `/diagnostico-rc18`.
- H. **Contato** (`ctaContact`, cartão populado) — formulário no padrão da home.

**Componentes usados:** blocos de SPEC §8; UI do DESIGN.md (`GlowCard`, `MetricChip`, `StatusBadge`, `pill-btn-*`, gradiente da marca).
**Mobile:** blocos empilham; carrossel/grid viram scroll/coluna (SPEC §10).

#### `/diagnostico-rc18` — Diagnóstico de prontidão (autoavaliação)

**Objetivo:** dar ao visitante um índice de prontidão imediato e capturar o lead qualificado.

**Seções:**
- A. **Intro** — o que é o diagnóstico, caráter indicativo (autoavaliação), ~2–3 min.
- B. **Autoavaliação** — 12 dimensões da RC 18/2025; cada uma com uma escala de maturidade (ex.: 0–3, do "controle manual/planilha" ao "regra em produção").
- C. **Resultado na tela** — índice de prontidão (%) + leitura por dimensão (o que está fraco), com CTA para falar com a ATRA.
- D. **Captura de lead** — contato (nome/instituição/e-mail/telefone) para receber o retorno.

**Componentes usados:** ilha cliente própria (não é bloco de CMS); `GlowCard`, `MetricChip`, `pill-btn-*`, `TabFilter`/steps, gradiente. Tokens do DESIGN.md.
**Mobile:** uma dimensão por vez / lista rolável; resultado em coluna única.

---

## 6. Impacto no Modelo de Dados

### 6.1 Novas Entidades

Nenhuma. A feature reutiliza `Solutions`, `FormSubmissions` e `Media` (SPEC §4).

### 6.2 Alterações em Entidades Existentes

| Entidade (SPEC §4) | Alteração | Migração |
|---|---|---|
| `Solutions.category` (select, `collections/Solutions.ts:51-59`) | Nova opção `rc18` (4ª categoria/aba) | **Sim — aditiva** (`ALTER TYPE ... ADD VALUE`). Baixa complexidade; conferir o ALTER antes de aplicar (armadilha do repositório) |
| `FormSubmissions.kind` (select, `collections/FormSubmissions.ts:53-66`) | Nova opção `rc18-diagnostic` | **Sim — aditiva**. Baixa complexidade |
| Documento `Solutions` (conteúdo) | 1 doc novo "RC18" (`category: rc18`, `slug: rc18`, `hasPage: true`, layout por blocos), PT completo + EN stub | Não (dado, não schema) — via seed idempotente e/ou CMS |

> Nenhuma remoção de coluna (que viraria prompt interativo do Drizzle, armadilha conhecida). Só adições de valor de enum. Fluxo D-21: `pnpm payload generate:types` → `migrate:create` → conferir → `migrate`.

---

## 7. Impacto na API

Ver architecture.md §4.

### 7.1 Novos Endpoints / Server Actions

```
Server Action  enviarDiagnosticoRc18(FormData)   actions/diagnostico-rc18.ts   (Auth: não; anti-spam → grava → notifica → CRM)
```
Modelada em `actions/formularios.ts` (`enviarFormulario`) e `actions/chat-lead.ts`. Grava `FormSubmissions` com `kind: rc18-diagnostic`, contato e um **resumo do diagnóstico** (índice + respostas) em `message` (respeitando `MAX_MENSAGEM=5000`).

Sem novos endpoints REST/`route.ts`. Sem alteração em `/api/*`.

### 7.2 Endpoints/contratos modificados

| Alvo (architecture.md §4) | Alteração |
|---|---|
| `enviarFormulario` (`actions/formularios.ts`) | Nenhuma — a página RC18 usa `kind: contact`, já aceito |
| CRM sync (`hooks/sincronizar-crm.ts` / `lib/crm.ts`, D-29) | Incluir `rc18-diagnostic` na classificação **comercial** (não RH) para sincronizar |
| `lib/routes.ts` (`SECOES`) | Nova seção do diagnóstico: `diagnosticoRc18: { pt: 'diagnostico-rc18', en: 'rc18-diagnostic' }`. `/solucoes/rc18` **não** exige mudança (é doc da coleção, resolvido por `[slug]`) |

---

## 8. Impacto no Design

Ver DESIGN.md.

### 8.1 Componentes Existentes Reutilizados

| Componente (DESIGN.md / SPEC §8) | Onde | Variante |
|---|---|---|
| `pageHero`, `stickyPageNav`, `richTextSection`, `iconCardGrid`, `bentoGrid`, `methodCards`, `accordionSteps`, `valueCards`, `audienceSplit`, `ctaBanner`, `ctaContact` | Página RC18 (blocos) | Existentes |
| `GlowCard`, `MetricChip`, `StatusBadge`, `pill-btn-*`, gradiente `bg-gradient-atra`/`text-gradient` | Página + diagnóstico | Existentes |

### 8.2 Componentes Novos Necessários

| Componente | Descrição | Variantes | Estados |
|---|---|---|---|
| Ilha do diagnóstico (`diagnostico-rc18/*.tsx`) | Autoavaliação interativa + cálculo do índice + resultado + captura de lead | — | default, respondendo, resultado, enviando, sucesso, erro |

> Não é bloco de CMS (é ilha de rota própria). Reaproveita utilities e tokens do design system; nenhuma propriedade tipográfica nova (D-25). Cor sempre em par claro/escuro com o valor escuro por último (DESIGN.md, armadilha paga).

### 8.3 Tokens / Padrões Visuais

Nenhum token novo. Usa a paleta grafite + acento azul→laranja, Mona Sans peso 300 em títulos, `rounded-[6px]`, `pill-btn-*` (DESIGN.md). Índice de prontidão pode usar o gradiente da marca como medida visual.

---

## 9. Dependências e Riscos

### 9.1 Dependências

| Tipo | Dependência | Status | Impacto se bloqueada |
|---|---|---|---|
| Conteúdo | Lista oficial das **12 dimensões** da RC 18/2025 (o PDF as cita, mas o OCR do one-page está ilegível) | Pendente — confirmar na norma/marketing | Alto (o diagnóstico depende delas) |
| Negócio | Cópia final da página e do diagnóstico (D-22) | Rascunho semeado do PDF; marketing revisa | Baixo (a página existe com rascunho) |
| Técnica | RD Station CRM ligado (`RDSTATION_CRM_TOKEN`, D-29) | Já integrado; inerte sem token | Baixo (lead grava mesmo sem CRM) |
| Técnica | Consentimento/LGPD dos formulários (P-14) | Pendente do projeto | Médio (mesmo gate dos demais formulários) |
| Feature | Nenhuma dependência de outra FEATURE | — | — |

### 9.2 Riscos

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Migração de enum tratada como interativa/destrutiva | Médio | Baixa | É **aditiva** (`ADD VALUE`); conferir o `ALTER TABLE`/`ALTER TYPE` da migração antes de aplicar; nunca remover valor |
| Aba RC18 é *tab* (troca painel), não link — parecer que "não leva à página" | Médio | Média | Categoria com item único: renderizar o card RC18 em destaque, linkando direto a `/solucoes/rc18`; ajustar `PainelDeSolucoes` se preciso |
| `/solucoes/rc18` cair fora do gate visual sem cobertura | Médio | Média | Rota nova sem gabarito legado → **smoke** (200 por idioma), como segmentos (SPEC §7.5); não entra no gate |
| Diagnóstico embutir lógica de score que gasta/varia | Baixo | Baixa | Score puro e determinístico em `lib/diagnostico-rc18.ts`, coberto por Vitest |
| EN exigido pela arquitetura de slug, mas sem tradução | Baixo | Alta | EN stub/redirect para PT; slug EN semeado para a rota resolver |

---

## 10. Critérios de Aceite

- [ ] A aba **"RC18"** aparece no painel de Soluções (desktop) e na gaveta mobile, ao lado das três categorias existentes, e leva a `/solucoes/rc18`.
- [ ] `/solucoes/rc18` responde 200 (PT), é montada por blocos do CMS e cobre: o que a norma exige, arquitetura Google Cloud, roadmap em 4 fases, por que ATRA.
- [ ] A página é editável no admin (coleção Soluções → RC18) com Live Preview, e publicar atualiza o site sem deploy.
- [ ] O **formulário de contato** da página segue o padrão da home (com cartão de contato) e grava lead `kind: contact` (anti-spam → grava → notifica → CRM).
- [ ] O botão **"diagnóstico gratuito"** na página leva a `/diagnostico-rc18`.
- [ ] O **diagnóstico** apresenta as 12 dimensões, calcula um **índice de prontidão** e o exibe na tela em < 1s após responder, sem reload.
- [ ] Ao enviar o diagnóstico, o lead grava em `FormSubmissions` com `kind: rc18-diagnostic`, resumo do diagnóstico em `message`, e sincroniza no CRM como lead comercial.
- [ ] Robô (honeypot/carimbo) recebe sucesso falso e **não** grava, nos dois formulários.
- [ ] `lib/diagnostico-rc18.ts` (score) tem testes unitários (Vitest) verdes.
- [ ] Migrações de `Solutions.category` e `FormSubmissions.kind` são aditivas, versionadas e aplicadas; `pnpm typecheck` e `pnpm lint` verdes.
- [ ] Rotas `/solucoes/rc18` e `/diagnostico-rc18` entram no **smoke** (200 PT) e têm metadata/hreflang/JSON-LD.
- [ ] EN resolve (stub/redirect), sem 404 nem erro de build.

---

## 11. Fases de Implementação

### Fase 1 — A página no menu, com contato (o essencial)
- [ ] Nova categoria/aba RC18 (schema + nav + índice) — task 002
- [ ] Página `/solucoes/rc18` por blocos + seed idempotente (conteúdo do PDF) — task 003
- [ ] Formulário de contato no padrão da home (`comContato` na rota de solução) — task 004

### Fase 2 — O diagnóstico de prontidão
- [ ] Motor de pontuação `lib/diagnostico-rc18.ts` + testes — task 005
- [ ] Rota + ilha do diagnóstico (autoavaliação com nota na hora) — task 006
- [ ] Captura de lead do diagnóstico (`kind` + Server Action + CRM) — task 007

### Fase 3 — Acabamento
- [ ] SEO, JSON-LD, sitemap e smoke das rotas novas; EN stub/redirect — task 008

---

**Referências:**
- `.ksdd/specs/SPEC.md` — §1.1, §2.1–2.2, §4, §6, §7.1/§7.4/§7.5, §8, §9, §10, §12
- `.ksdd/specs/architecture.md` — §3.1/§3.3/§3.4 (schema), §4 (Server Actions/rotas), §5 (CRM/Resend), ADR-003/007/009
- `.ksdd/specs/DESIGN.md` — Colors, Typography, Components, Do's/Don'ts
- Fonte de conteúdo: `RC18_2026.pdf` (e-mail ATRA × Google Cloud + one-page); referência de estrutura: logiks.com.br/RC-18 e /formularioRC18
- `CLAUDE.md` — regras 3 (mappers), 4 (filtro `_status`), 5 (migração versionada), 6 (rotas), armadilhas de enum/migração
