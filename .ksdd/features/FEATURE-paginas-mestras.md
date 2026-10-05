# Feature: Páginas-mestras editáveis no admin

> As páginas-índice de cada seção do site — Soluções, Segmentos, Consultores, Insights, Blog, Webinars, Cases, ATRA na mídia, E-books e Carreiras — passam a ser **Páginas do admin**, montadas em blocos e editáveis pelo time de conteúdo, com a lista automática de cada seção virando um bloco que a editora posiciona. A Insights deixa de ser curada à mão: mostra sozinha os conteúdos mais recentes de cada tipo.

**Slug:** paginas-mestras
**Prioridade:** Alta — a maior dor do time de conteúdo agora (G-ferrari, 05/10/2026)
**Status:** Rascunho
**Data:** 05/10/2026
**Projeto:** ATRA — site institucional (migração Next.js 16 + Payload CMS 3)

---

## 1. Motivação

### 1.1 Problema / Oportunidade

Cada seção do site tem uma "home" — a página que abre quando se clica no link da seção. Das 10, **8 são escritas em código**: título, destaque, textos de abertura, rótulos de botão e a descrição para o Google estão em constantes `TEXTOS`/`META` dentro das rotas (`solucoes`, `segmentos`, `consultores`, `blog`, `webinars`, `cases-de-sucesso`, `atra-na-midia`, `ebooks`). Elas **não aparecem em Conteúdo → Páginas** e o time não acha onde editá-las — porque não há onde. Trocar uma frase do topo de `/blog` hoje é PR e deploy.

As outras duas já são Páginas do CMS — `/carreiras` ("Trabalhe Conosco") e `/insights` —, mas a Insights tem um problema próprio: os cartões são **digitados à mão** (título, imagem, data, link de cada conteúdo), então ela envelhece a cada post, case ou webinar novo, e ninguém atualiza.

É exatamente a frustração da persona primária do CMS (SPEC §2.1, Marina): "texto errado fica no ar até alguém ter tempo".

### 1.2 Personas Impactadas
- **Marina — Editora de Marketing** (SPEC §2.1): ganha as 8 páginas no admin, com Live Preview, e para de manter a Insights à mão. É a persona cujo sucesso define a feature.
- **Ricardo — Decisor B2B** (SPEC §2.2): indireto — a Insights passa a mostrar sempre o conteúdo mais novo, e as páginas de seção podem ganhar texto de venda sem esperar dev.

### 1.3 Métricas de Sucesso
- As **10** páginas-mestras aparecem em Conteúdo → Páginas e se editam sem PR.
- Trocar o título, o texto de abertura ou o SEO de qualquer uma delas leva **< 5 minutos** e aparece no site ao publicar, sem deploy.
- A Insights mostra o conteúdo publicado mais recente de cada tipo **sem nenhuma ação manual**.
- **Zero mudança visual** no dia em que a feature for ao ar (antes de alguém editar).

---

## 2. Escopo

### 2.1 O que entra (v1)

1. **Página-mestra como Página do CMS.** Cada uma das 10 seções tem um documento em `pages`, identificado como "página-mestra da seção X". Lá ficam o topo, os textos, as seções extras, a faixa final e o SEO, montados com os blocos que o time já usa.
2. **Proteção** (decisão de 05/10). Página-mestra **não pode ser apagada**. **Pode ser despublicada** — aí a seção sai do ar e responde "não encontrado", e o admin avisa que menu e rodapé continuam apontando para ela. **O endereço fica travado no admin**: ele é a base da seção inteira (`/blog` e `/blog/<artigo>`), e renomear a seção é um pedido ao time técnico, como foi "Relatórios" → "ATRA na mídia" (D-43): um PR que muda o endereço em `lib/routes.ts` e deixa o redirect do antigo. O admin mostra de qual seção a página é e explica isso no campo do endereço.
3. **Bloco "Lista da seção".** A parte automática de cada seção — os cartões de posts, cases, webinars, matérias, e-books, soluções, segmentos, perfis de consultores, vagas — vira um bloco que a editora posiciona no layout, com título e texto de abertura opcionais acima da lista. Dentro dele tudo funciona como hoje: filtros, busca, paginação do blog, carrinho de consultores.
4. **Bloco "Destaques da seção".** O carrossel de destaques do topo (Blog, Webinars, Cases, ATRA na mídia, E-books) vira um bloco próprio, automático, que a editora pode tirar ou mover.
5. **Insights automática.** A grade curada à mão sai. No lugar, uma faixa por tipo — Cases, Blog, Webinars, ATRA na mídia, E-books — com os **3 mais recentes publicados** e um botão **"Ver todos"** que leva à página-mestra do tipo. Topo, newsletter e fechamento da Insights continuam editáveis.
6. **Consultores**: topo, textos principais e SEO editáveis. A lista de perfis, o carrinho e o formulário de pedido continuam no código, como hoje, dentro do bloco "Lista da seção".
7. **Live Preview nas Páginas** — hoje só os cases têm. A editora vê a página-mestra mudar enquanto digita.
8. **Migração de conteúdo.** As 8 páginas que faltam nascem com os **textos de hoje, literais**, nos dois idiomas (D-22): o site não muda no dia da entrega. Carreiras e Insights são marcadas como páginas-mestras.
9. **Blog paginado**: `/blog/pagina/N` usa a mesma página-mestra; o carrossel de destaques continua só na página 1.
10. **Guia do editor** com a seção nova: o que é página-mestra, o que se edita e o que é automático.

### 2.2 O que fica pra depois
- Consultores inteira editável (os ~50 textos da lista, dos diferenciais e do formulário).
- Configurar a lista pelo admin (quantos por página, ordem, quais filtros).
- Página-mestra para Parceiros e Glossário (Parceiros não tem índice; Glossário está fora do ar, D-36).
- Escolher à mão um destaque na Insights (decidido: só automático).
- **Trocar o endereço de uma seção pelo admin** (com a seção inteira e o redirect acompanhando). Fica como pedido ao time técnico; vira fase 2 se fizer falta.

### 2.3 O que NÃO é essa feature
- Não muda o desenho das listas nem dos cartões — só quem controla o texto em volta.
- Não reescreve texto (D-22): a migração copia o que está no ar.
- Não é a tradução para inglês: o inglês migrado é o que já existe no código.

---

## 3. User Stories

- Como **editora**, quero achar a página do Blog em Conteúdo → Páginas e trocar o título e o texto de abertura, para atualizar a seção sem pedir a um desenvolvedor.
- Como **editora**, quero acrescentar uma seção (por exemplo, um banner de campanha) acima da lista de webinars, para destacar um evento sem PR.
- Como **editora**, quero ver a página-mestra mudar no Live Preview enquanto digito, para publicar com confiança.
- Como **editora**, quero que a Insights se atualize sozinha quando publico um case ou um post, para não ter de manter cartões à mão.
- Como **editora**, não quero conseguir apagar a página do Blog por engano; se eu despublicar, quero ser avisada de que a seção sai do ar.
- Como **visitante**, quero ver na Insights o que a ATRA publicou de mais novo em cada formato, e ir à lista completa com "Ver todos".

---

## 4. Fluxos de Uso

### 4.1 Editar uma página-mestra (principal)
1. Admin → Conteúdo → Páginas → **Blog** (a coluna "Página-mestra" identifica as 10).
2. Abre o topo da lista e troca o título; acrescenta uma seção "Banner de chamada" depois da lista.
3. Confere no Live Preview → **Publicar alterações**.
4. O site atualiza na visita seguinte (revalidação ao publicar, ADR-007).

### 4.2 Insights se atualiza sozinha
1. A editora publica um webinar novo (Conteúdo → Webinars).
2. A faixa "Webinars" da Insights passa a mostrá-lo em primeiro, e o mais antigo dos 3 sai.

### 4.3 Tentativa de apagar, despublicar ou renomear
1. A editora tenta apagar a página "Cases de sucesso": o admin recusa, explicando que a página-mestra é parte fixa do site.
2. Ela despublica a página: o admin avisa antes que a seção sai do ar; publicada de novo, volta.
3. Ela quer trocar o endereço: o campo está travado, com a explicação de que renomear a seção é pedido ao time técnico.

---

## 5. Impacto em Telas Existentes

### 5.1 Telas Modificadas
- **Admin → Páginas** (lista e edição): coluna e indicação "Página-mestra de", endereço travado com explicação, sem apagar, aviso ao despublicar, Live Preview, blocos novos no seletor.
- **/solucoes, /segmentos, /consultores, /blog (+ /blog/pagina/N), /webinars, /cases-de-sucesso, /atra-na-midia, /ebooks** (SPEC §7.3–7.7): passam a ser montadas pela Página do CMS. Visual igual ao de hoje no dia 1.
- **/insights** (SPEC §7.6): a grade curada e os filtros dão lugar às faixas automáticas por tipo. **Muda o visual** — por decisão.
- **/carreiras**: só passa a ser marcada como página-mestra (protegida).
- Inglês (`/en/...`, slugs traduzidos, ADR-003): as mesmas páginas, com o texto em inglês que já existe.

### 5.2 Telas Novas
- Nenhuma tela de site nova. No admin, dois blocos novos no seletor de seções ("Lista da seção", "Destaques da seção"), com miniatura.

---

## 6. Impacto no Modelo de Dados

### 6.1 Novas Entidades
- Nenhuma collection nova.

### 6.2 Alterações em Entidades Existentes
- **`pages`**: campo novo "Página-mestra de" (uma das 10 seções, ou nenhuma), definido pela migração e não editável pela editora; regra de proteção (não apagar; endereço travado); Live Preview.
- **Blocos novos** no catálogo de blocos (`BLOCOS`): "Lista da seção" (título, destaque e texto de abertura opcionais) e "Destaques da seção". Só fazem sentido em página-mestra.
- **`insightsHub`**: a lista de itens digitados à mão deixa de ser usada; o bloco passa a montar as faixas automáticas. As strings fixas em português do componente ganham inglês.
- **8 documentos novos em `pages`** + Carreiras e Insights marcadas — por migração de dados com trava (cria só se não existir; não toca no que foi editado).
- ⚠️ Campo novo em `pages` e blocos novos exigem migração antecipada idempotente (a armadilha do banco novo, CLAUDE.md).

---

## 7. Impacto na API
- Nenhum endpoint novo. As rotas de seção passam a ler a Página-mestra pela Local API (com filtro de publicado e modo rascunho para o preview) e a injetar a lista automática no bloco, como hoje `resolverPagina` faz com vagas e clientes.
- Consultas das listas mantêm `select` (sem ele `/solucoes` leva 18–23 s).
- Revalidação ao publicar uma Página (já existe, ADR-007) atualiza a página-mestra; publicar um post/case/webinar/matéria/e-book precisa revalidar também a Insights.

---

## 8. Impacto no Design

### 8.1 Componentes Existentes Reutilizados
`BlocoHero` (topo das páginas de Soluções, Segmentos, Consultores), `FeaturedHero` (destaques), `ListaDeArtigos`, `ListaDeCases`, `ContentCard`, grades de webinars/matérias/e-books, `CartaoDeSolucao`, `ChipFilter`, `SearchInput`, `Paginacao`, `BlocoCta`/faixa final, `RenderBlocks`.

### 8.2 Componentes Novos Necessários
- Renderizador do bloco "Lista da seção" que escolhe a lista da seção da página.
- Faixa "3 mais recentes + Ver todos" da Insights (reaproveita os cartões existentes).

### 8.3 Tokens / Padrões Visuais
Nenhum token novo. Regra: dia 1 sem diferença visual nas 9 páginas que não são a Insights.

---

## 9. Dependências e Riscos

### 9.1 Dependências
- Nenhuma externa. Usa a revalidação ao publicar (MIG-143) e o padrão de Live Preview dos cases (`lib/preview.ts`).

### 9.2 Riscos
- **Paridade visual no dia 1**: 8 rotas reescritas — risco de mudar espaçamento ou título sem perceber. Mitigação: captura antes/depois de cada rota nos 3 tamanhos e nos 2 temas.
- **Banco novo** (`pnpm migrate` do CI): campo e blocos novos precisam nascer antes das migrações de dados antigas.
- **Blog paginado**: `generateStaticParams` e a página N leem a mesma Página-mestra.
- **Consultores**: tudo vive dentro de um contexto cliente (carrinho); o bloco precisa envolver lista, carrinho e formulário juntos.
- **Insights muda de cara**: os filtros por tópico e a busca da grade curada saem com ela. Decisão de produto já tomada (só automático); o marketing deve saber antes da publicação.
- **Despublicar é permitido**: a seção sai do ar (404), e menu e rodapé continuam apontando para ela. O aviso no admin é a defesa; a trava de apagar precisa cobrir o botão e a API.
- **Endereço travado**: o slug da página-mestra é o de `lib/routes.ts`. A trava precisa valer nos dois idiomas, e a migração precisa gravar exatamente o slug de cada idioma.

---

## 10. Critérios de Aceite

- [ ] As 10 páginas-mestras aparecem em Conteúdo → Páginas, identificadas pela seção, em PT e EN.
- [ ] Editar e publicar o título ou o texto de abertura de qualquer uma muda o site sem deploy.
- [ ] Página-mestra não pode ser apagada (botão e API recusam); o endereço está travado no admin, com a explicação; despublicada, a seção responde 404, e o admin avisa disso antes.
- [ ] O bloco "Lista da seção" pode ser movido e ter seções acima/abaixo; a lista mantém filtros, busca, paginação (blog) e carrinho (consultores).
- [ ] O bloco "Destaques da seção" mostra o carrossel automático e pode ser removido.
- [ ] Live Preview funciona nas Páginas, inclusive nas páginas-mestras.
- [ ] Insights: uma faixa por tipo (Cases, Blog, Webinars, ATRA na mídia, E-books) com os 3 mais recentes publicados e "Ver todos" para a página-mestra; publicar um conteúdo novo o leva à faixa sem ação manual; rascunho não aparece.
- [ ] No dia da entrega, as 9 páginas que não são a Insights ficam visualmente iguais às de antes (captura antes/depois, 3 tamanhos, 2 temas); SEO (título, descrição) igual.
- [ ] `/blog/pagina/N`, os endereços em inglês e os redirects existentes continuam respondendo.
- [ ] `pnpm migrate` num banco zerado passa; a migração de conteúdo não toca em página já editada.
- [ ] typecheck, lint, testes unitários e o e2e do CI verdes; guia do editor atualizado.

---

## 11. Fases de Implementação

Entrega única (decisão de 05/10), feita na ordem: base (campo, proteção, blocos, preview, migração antecipada) → páginas simples (Soluções, Segmentos) → destaques + grade (Webinars, ATRA na mídia, E-books) → listas com filtro (Cases, Blog) → Consultores → Insights automática → migração de conteúdo, guia e verificação de paridade.
