# Feature: Área Restrita no rodapé (e remoção da página Design System)

> Substitui o link interno "Design System" do rodapé por um botão "Área Restrita" que abre o ERP (`https://erp.atra.com.br/`) em nova aba, e remove a página `/design-system` do site — mantendo intactas todas as outras páginas.

**Slug:** area-restrita
**Prioridade:** Alta
**Status:** Rascunho
**Data:** 13/09/2026
**Projeto:** ATRA — site institucional (migração Next.js 16 + Payload CMS 3)

---

## 1. Motivação

### 1.1 Problema / Oportunidade

A página `/design-system` é uma **vitrine interna** (`noindex`, fora de menu/sitemap — SPEC §7.8) usada durante a construção do porte para conferir os componentes de UI. Com o projeto em homologação e o conteúdo migrado, ela **não tem mais função no site público** e só ocupa o único ponto de link "livre" do rodapé.

Ao mesmo tempo, existe uma necessidade concreta: dar aos usuários internos da ATRA um ponto de entrada visível para o **ERP** (`https://erp.atra.com.br/`). O rodapé, hoje desperdiçado com um link de ferramenta de desenvolvimento, é o lugar natural.

A feature é, portanto, uma **troca de baixo risco**: aposenta uma página sem público e usa o espaço para um atalho útil. A restrição dominante do pedido é cirúrgica — **remover a página não pode quebrar nenhuma outra rota nem os testes**.

### 1.2 Personas Impactadas

- **Ricardo — Decisor B2B (visitante, SPEC §2.2):** impacto neutro/positivo. Nunca usou o Design System; passa a ver um atalho "Área Restrita" no rodapé (ignora se não for da casa).
- **Colaborador interno da ATRA (persona operacional, não catalogada no SPEC):** ganha um ponto de acesso visível ao ERP a partir de qualquer página do site. A autenticação e o conteúdo do ERP são responsabilidade do próprio ERP — fora desta feature.
- **Marina — Editora de Marketing (SPEC §2.1):** sem impacto. Tanto o link antigo quanto o novo são **cromo de casca** hardcoded (`lib/navegacao.ts`), não conteúdo de CMS — ela não os edita hoje e não passará a editar.

### 1.3 Métricas de Sucesso

| Métrica | Meta | Prazo |
|---------|------|-------|
| `/design-system` e `/en/design-system` deixam de existir | 404 (catch-all), sem erro de build | no merge |
| Nenhuma regressão em outras rotas | `pnpm typecheck`, `pnpm lint` e `pnpm test:e2e` (smoke) verdes | no merge |
| Botão "Área Restrita" abre o ERP em nova aba | 100% dos cliques abrem `https://erp.atra.com.br/` em `_blank` | no merge |

---

## 2. Escopo

### 2.1 O que entra (v1)

- **Remover a página `/design-system`**: apagar o diretório da rota (`src/app/(frontend)/[locale]/design-system/`, com `page.tsx` e `bancada.tsx`). Vale para PT e EN (é uma rota `[locale]` única).
- **Substituir o link do rodapé**: trocar o `<Link>` "Design System" por um `<a>` "Área Restrita" apontando para `https://erp.atra.com.br/`, com `target="_blank"` e `rel="noopener noreferrer"` (mesmo padrão dos links de redes sociais do rodapé).
- **Rótulo localizado**: `pt: "Área Restrita"`, `en: "Restricted Area"` em `lib/navegacao.ts`.
- **Ajustar o smoke test**: remover `/design-system` e `/en/design-system` de `e2e/smoke.spec.ts` (hoje esperam 200 — passariam a falhar com 404).
- **Limpeza completa das referências mortas**: remover a entrada `designSystem` de `lib/routes.ts` e a chave `designSystem` de `lib/navegacao.ts` (verificado: nada além do rodapé as consome).

### 2.2 O que fica pra depois

- **Autenticação/SSO com o ERP** — o botão é um link simples; qualquer login é do ERP. Não há v2 planejada nesta feature.
- **Tornar o link editável no CMS** (global `Footer`) — o rodapé de cromo é hardcoded por decisão de arquitetura; mover para o CMS seria outra feature.

### 2.3 O que NÃO é essa feature

- **Não** mexer nos componentes `TabFilter`/`ChipFilter` nem em `roadmap/page.tsx`: as menções a `/design-system` neles são **comentários históricos**, e os componentes são usados em filtros reais de outras páginas.
- **Não** tocar em `paridade-ds.spec.ts`: esse teste já não usa a página `/design-system` (a "bancada" saiu no MIG-059); ele valida os componentes de UI por outro caminho.
- **Não** alterar `ROTAS_COM_GABARITO` nem gabaritos visuais: `/design-system` **não** está sob o gate visual — não há snapshot a apagar.
- **Não** construir nada dentro do ERP nem validar seu login.

---

## 3. User Stories

| # | Como... | Quero... | Para... |
|---|---------|----------|---------|
| US-01 | colaborador interno da ATRA | ver "Área Restrita" no rodapé de qualquer página | acessar o ERP rapidamente sem decorar a URL |
| US-02 | colaborador interno da ATRA | que o ERP abra em nova aba | não perder o site institucional que eu estava vendo |
| US-03 | mantenedor do site | que `/design-system` deixe de existir sem quebrar build/testes | aposentar uma ferramenta interna sem risco de regressão |

---

## 4. Fluxos de Uso

### 4.1 Acesso ao ERP pelo rodapé

**Pré-condição:** usuário em qualquer página do site (PT ou EN).
**Trigger:** clique no botão "Área Restrita" / "Restricted Area" no rodapé.

1. Usuário rola até o rodapé.
2. Na faixa inferior (onde antes ficava "Design System"), vê "Área Restrita".
3. Clica no botão.
4. O navegador abre `https://erp.atra.com.br/` em **nova aba**; a aba do site permanece aberta.

**Sucesso:** nova aba no ERP; site institucional intacto na aba original.
**Erro / edge case:** se o ERP estiver fora do ar, o erro é do ERP na nova aba — o site institucional não é afetado.

### 4.2 Tentativa de acessar a página removida

**Pré-condição:** alguém com a URL antiga salva.
**Trigger:** navegação direta para `/design-system` (ou `/en/design-system`).

1. O Next não encontra a rota.
2. Cai no `not-found` (catch-all) padrão do site.

**Sucesso:** 404 tratado pelo site, sem 500 nem erro de build. (A rota era `noindex` e nunca esteve em sitemap/menu, então não há SEO a preservar — 404 é o comportamento correto, não é preciso redirect.)

---

## 5. Impacto em Telas Existentes

### 5.1 Telas Modificadas

| Tela (SPEC §7) | O que muda | Onde na tela | Por quê |
|----------------|------------|--------------|---------|
| **Todas** (rodapé global, SPEC §7.1) | Link "Design System" → botão "Área Restrita" (externo, nova aba) | `SiteFooter`, faixa inferior | Aposentar vitrine interna e expor atalho ao ERP |
| **`/design-system`** (interna, SPEC §7.8) | **Removida** | rota inteira | Sem função no site público |

### 5.2 Telas Novas (se aplicável)

Nenhuma. A feature remove uma tela e edita o rodapé; não cria página.

---

## 6. Impacto no Modelo de Dados

### 6.1 Novas Entidades

Nenhuma.

### 6.2 Alterações em Entidades Existentes

Nenhuma. O link do rodapé é **cromo hardcoded** (`lib/navegacao.ts` + `SiteFooter`), não o global `Footer` do Payload — **sem migração de schema** (não se aplica a regra D-21 / §5 do CLAUDE.md).

---

## 7. Impacto na API

Nenhum. Sem novos endpoints e sem alteração dos existentes. O destino é uma URL externa (`https://erp.atra.com.br/`), não uma rota do app — portanto **não passa por `lib/routes.ts`/`hrefDe`** (que é a fonte só de rota interna localizada, §6 do CLAUDE.md), e sim por `<a href>` literal, como os links de redes sociais já fazem no rodapé.

---

## 8. Impacto no Design

### 8.1 Componentes Existentes Reutilizados

| Componente | Onde é usado na feature | Variante |
|------------|-------------------------|----------|
| `SiteFooter` (SPEC §8, "Chrome") | recebe o botão "Área Restrita" na faixa inferior | existente — troca de conteúdo do link, sem mudar layout |

### 8.2 Componentes Novos Necessários

Nenhum.

### 8.3 Tokens / Padrões Visuais

Sem novos tokens. O botão herda exatamente as classes do link atual (`hover:text-primary transition-colors`) para não introduzir propriedade tipográfica ou de cor que o legado não tem (D-15/D-25). Visualmente é o mesmo elemento, com outro texto e destino.

---

## 9. Dependências e Riscos

### 9.1 Dependências

| Tipo | Dependência | Status | Impacto se bloqueada |
|------|-------------|--------|----------------------|
| Negócio | URL do ERP (`https://erp.atra.com.br/`) confirmada e no ar | Resolvida (fornecida no pedido) | Baixo |
| Técnica | Smoke test atualizado no mesmo PR da remoção | Sob controle (mesma task) | Alto se esquecido — smoke fica vermelho |

### 9.2 Riscos

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Remover a página deixa referência pendente que quebra typecheck/build | Alto | Baixa | Rastreamento já feito: só `SiteFooter` usa `hrefDe('designSystem')` e o smoke lista a rota; ambos tratados. `pnpm typecheck` + `pnpm lint` como gate. |
| Sitemap ainda listar `/design-system` gerando URL 404 indexável | Médio | Muito baixa | Verificar geração de sitemap (SPEC §7.8 e comentário em `roadmap/page.tsx:17` afirmam que nada aponta para a rota); critério de aceite cobre. |
| `proxy.ts` depender da entrada `designSystem` de `routes.ts` | Médio | Baixa | Verificar `proxy.ts` antes de remover a entrada; critério de aceite cobre. |

---

## 10. Critérios de Aceite

- [ ] O diretório `src/app/(frontend)/[locale]/design-system/` não existe mais no repositório.
- [ ] `GET /design-system` e `GET /en/design-system` respondem 404 (not-found do site), sem 500 e sem erro no log do servidor.
- [ ] O rodapé (PT e EN) exibe o botão "Área Restrita" / "Restricted Area" no lugar de "Design System".
- [ ] O botão aponta para `https://erp.atra.com.br/` com `target="_blank"` e `rel="noopener noreferrer"`.
- [ ] `lib/routes.ts` não contém mais a entrada `designSystem`, e `lib/navegacao.ts` não contém mais a chave `designSystem` (substituída por `areaRestrita`).
- [ ] `e2e/smoke.spec.ts` não lista mais `/design-system` nem `/en/design-system`.
- [ ] Nenhum outro arquivo referencia `hrefDe('designSystem')` ou a rota da página (comentários históricos em `chip-filter`/`tab-filter`/`roadmap` podem permanecer).
- [ ] O sitemap gerado não inclui `/design-system`.
- [ ] `pnpm typecheck` e `pnpm lint` passam sem novos erros.
- [ ] `pnpm test:e2e -- smoke.spec.ts` passa; demais rotas do site continuam respondendo 200.

---

## 11. Fases de Implementação

### Fase 1 — Troca e remoção (o essencial)
- [ ] Substituir o link do rodapé por "Área Restrita" (externo, nova aba) + rótulo localizado.
- [ ] Remover a rota `/design-system` e limpar as referências mortas (`routes.ts`, `navegacao.ts`, `smoke.spec.ts`).
- [ ] Verificar sitemap/proxy e rodar typecheck + lint + smoke.

---

**Referências:**
- `.ksdd/specs/SPEC.md` — §7.1 (rodapé global), §7.8 (`/design-system` interna), §8 (chrome/SiteFooter)
- `CLAUDE.md` — §6 (URL nunca escrita à mão — e por que URL externa é exceção), D-15/D-25 (não introduzir propriedade tipográfica nova), §5/D-21 (schema — aqui não se aplica)
- Código: `web/src/components/layout/site-footer.tsx`, `web/src/lib/navegacao.ts`, `web/src/lib/routes.ts`, `web/src/app/(frontend)/[locale]/design-system/`, `web/e2e/smoke.spec.ts`
