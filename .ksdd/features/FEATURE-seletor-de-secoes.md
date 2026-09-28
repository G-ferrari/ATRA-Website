# Feature: Seletor de seções no admin

> Na tela "Adicionar Seção" do admin, os 28 blocos passam a aparecer **agrupados pela função e em ordem alfabética dentro de cada grupo**, cada um com **uma miniatura real de como a seção fica no site** — para a editora escolher o bloco pelo que ele parece, e não pelo nome.

**Slug:** seletor-de-secoes
**Prioridade:** Média
**Status:** Rascunho
**Data:** 27/09/2026
**Projeto:** ATRA — site institucional (migração Next.js 16 + Payload CMS 3)

---

## 1. Motivação

### 1.1 Problema / Oportunidade

O marketing monta as páginas combinando blocos (SPEC §7, "Blocos de conteúdo"). Na tela "Adicionar Seção" do admin — o drawer de blocos do Payload — os 28 blocos aparecem **na ordem em que foram escritos no código** (`BLOCOS`, `web/src/blocks/index.ts`) e **todos com a mesma imagem genérica** (a montanha cinza do Payload). Quem abre o seletor não sabe se "Grade de cards", "Cards de valores" e "Cards de metodologia" são parecidos ou não, nem onde está o "Carrossel de destaques" — o designer do site (G-ferrari) não o achou em 27/09.

É o problema de fundo do projeto do lado de quem publica (SPEC §2.1, D-20): a experiência do editor é entregável, e escolher o bloco errado é o primeiro tropeço de quem monta uma página sem dev.

**Avaliação técnica (27/09, Payload 3.88):**
- **Busca já existe.** O drawer tem "Procurar bloco" no topo, que filtra pelo rótulo. Nada a construir.
- **Grupos são nativos** (`admin.group` no Block): o drawer mostra um título por grupo.
- **Miniaturas são nativas** (`admin.images.thumbnail`, proporção 3:2, ex. 480×320).
- **Ordem:** o drawer não ordena — renderiza na ordem do array. Ordenar é responsabilidade do projeto.

### 1.2 Personas Impactadas

- **Marina — Editora de Marketing (SPEC §2.1):** a usuária do seletor. Passa a achar o bloco pelo grupo e a reconhecê-lo pela miniatura antes de inserir.
- **Admin do CMS (SPEC §6):** mesmo ganho; e quem cria bloco novo no código passa a ter um lugar óbvio (grupo + miniatura) para ele aparecer bem no seletor.

### 1.3 Métricas de Sucesso

| Métrica | Meta | Prazo |
|---------|------|-------|
| Blocos com grupo e miniatura própria | 28 de 28 (teste reprova bloco sem os dois) | v1 |
| Editor acha um bloco pedido sem ajuda | Sim, no teste com o marketing (MIG-127) | v1 |

---

## 2. Escopo

### 2.1 O que entra (v1)

- **Grupos por função**, com ordem alfabética (pelo rótulo em PT) dentro de cada grupo. Proposta inicial, a confirmar na implementação:
  - **Abertura e navegação** — Abertura de página, Abertura de parceiro, Herói da home, Menu da página
  - **Texto e cards** — Texto com imagem, Grade de cards, Cards de valores, Cards de metodologia, Grade bento, Para quem é, Abas de destaque
  - **Etapas** — Etapas de processo, Etapas em acordeão
  - **Prova: números, selos e parceiros** — Números, Faixa de selos, Grade de imagens, Vitrine de parceiros, Faixa de logos, Seção de parceiro
  - **Carrosséis e vitrines** — Carrossel de destaques, Carrossel de cases, Carrossel de depoimentos, Vitrine de conteúdo, Hub de insights, Bento da home
  - **Chamadas e contato** — Faixa de chamada, Contato com formulário, Lista de vagas
- **Miniatura real de cada bloco**: captura da seção como ela aparece no site (tema escuro, que é o padrão do site e do admin), 480×320, gerada por script versionado — regerável quando o design mudar.
- **Catálogo de blocos** fora da produção: uma página interna que renderiza cada bloco com dados de exemplo, de onde o script captura — inclusive os blocos que hoje não aparecem em nenhuma página.
- **Rede de segurança:** teste que reprova bloco sem grupo ou sem miniatura, e miniatura apontando para arquivo inexistente.
- **Guia do editor** (`docs/05-operacao/guia-do-editor.md`) explica o seletor: grupos, busca e miniaturas.

### 2.2 O que fica pra depois

- Descrição curta de cada bloco no seletor (quando usar), se o Payload passar a exibi-la no drawer.
- Miniatura também do tema claro.

### 2.3 O que NÃO é essa feature

- Reescrever o drawer do Payload (componente próprio) — só configuração nativa.
- Pré-visualização ao vivo do bloco com o conteúdo que o editor está digitando (isso é o Live Preview, que já existe).
- Mudar conteúdo, rótulos de página ou schema de dados (D-22).

---

## 3. User Stories

- Como **editora de marketing**, quero ver os blocos agrupados pelo que fazem, para ir direto ao grupo certo em vez de percorrer 28 cards.
- Como **editora de marketing**, quero ver como cada seção fica no site antes de inseri-la, para não inserir, olhar o preview e apagar.
- Como **quem cria um bloco novo no código**, quero que o teste me avise se esqueci o grupo ou a miniatura, para o bloco não entrar no seletor com a montanha cinza.

---

## 4. Fluxos de Uso

### 4.1 Inserir uma seção (principal)

1. Editora abre uma página no admin → "Seções" → **Adicionar Seção**.
2. Vê os blocos em grupos com título, cada card com a miniatura da seção real.
3. Opcionalmente digita em "Procurar bloco" (já existe) para filtrar.
4. Clica no bloco → ele entra na página → preenche → Live Preview mostra o resultado.

### 4.2 Design muda e as miniaturas ficam velhas

1. Dev roda o script de captura (um comando) com o catálogo de pé.
2. As 28 miniaturas são regravadas; o diff do PR mostra quais mudaram.

---

## 5. Impacto em Telas Existentes

### 5.1 Telas Modificadas

| Tela (SPEC §7) | O que muda |
|----------------|------------|
| Admin — drawer "Adicionar Seção" (Páginas, Soluções, Segmentos, Parceiros) | Grupos com título, ordem alfabética dentro do grupo, miniatura por bloco |

### 5.2 Telas Novas

| Tela | Descrição | Visível em produção? |
|------|-----------|----------------------|
| Catálogo de blocos | Renderiza os 28 blocos com dados de exemplo, um abaixo do outro, cada um identificável pelo slug — só para a captura | **Não** — responde 404 em produção, fora do sitemap, `noindex` |

---

## 6. Impacto no Modelo de Dados

### 6.1 Novas Entidades

Nenhuma.

### 6.2 Alterações em Entidades Existentes

Nenhuma no banco. Grupos e miniaturas são configuração do admin (`admin.group`, `admin.images.thumbnail`) — não geram coluna. ⚠️ Reordenar `BLOCOS` **não pode** gerar migração: conferir com `migrate:create --skip-empty` (tabelas de bloco são por slug).

---

## 7. Impacto na API

Nenhum endpoint novo. Arquivos estáticos novos em `web/public/admin/blocos/<slug>.webp`, servidos pelo Next (o runner já copia `public/`).

---

## 8. Impacto no Design

### 8.1 Componentes Existentes Reutilizados

Os 28 componentes de bloco (`web/src/components/blocks/`), renderizados pelo `RenderBlocks` no catálogo — a miniatura é o componente de verdade, não uma imitação.

### 8.2 Componentes Novos Necessários

- Página do catálogo (rota interna) com dados de exemplo por bloco.
- Script de captura (Playwright, na imagem oficial usada pelo gate) + redimensionamento (`sharp`, que o Payload já traz).

### 8.3 Tokens / Padrões Visuais

Miniaturas no tema escuro, 480×320, recorte centrado no topo da seção (o que identifica o bloco é o cabeçalho e o primeiro terço).

---

## 9. Dependências e Riscos

### 9.1 Dependências

- Nenhuma decisão externa. Os grupos propostos em §2.1 são confirmados com G-ferrari na implementação.

### 9.2 Riscos

| Risco | Mitigação |
|-------|-----------|
| Reordenar `BLOCOS` gerar migração ou mexer em dado | Conferir com `migrate:create --skip-empty` antes do PR; a ordem não entra no schema |
| Catálogo vazar para produção | 404 fora de desenvolvimento/e2e, fora do sitemap, `noindex`; teste que garante o 404 no build de produção |
| Dados de exemplo inventarem conteúdo (D-22) | Os exemplos só existem no catálogo, nunca no CMS nem nas páginas públicas |
| Miniatura envelhecer quando o design muda | Script regerável num comando; o teste só confere existência, não pixel |

---

## 10. Critérios de Aceite

- [ ] No drawer "Adicionar Seção", os blocos aparecem em grupos com título, em ordem alfabética (rótulo PT) dentro de cada grupo.
- [ ] Os 28 blocos têm miniatura própria (nenhum com a imagem genérica do Payload).
- [ ] A busca "Procurar bloco" continua funcionando com grupos.
- [ ] Reordenar e agrupar não gera migração (`migrate:create --skip-empty` sem SQL).
- [ ] Teste unitário reprova bloco sem grupo, sem miniatura ou com miniatura apontando para arquivo inexistente em `public/`.
- [ ] O catálogo responde 404 no build de produção e não aparece no sitemap.
- [ ] O script de captura regera as 28 miniaturas num comando, documentado.
- [ ] Guia do editor atualizado com o seletor (grupos, busca, miniaturas).
- [ ] `lint`, `typecheck`, unitários e e2e verdes.

---

## 11. Fases de Implementação

### Fase 1 — organizar (entrega sozinha)
- [ ] Grupos + ordem alfabética, sem migração; teste de grupo

### Fase 2 — miniaturas
- [ ] Catálogo de blocos fora da produção
- [ ] Script de captura, 28 miniaturas, `admin.images.thumbnail`, teste de miniatura e guia do editor
