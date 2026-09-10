<!--
Salvar em: .ksdd/specs/brainstorm.md (default v0.6.0+)
-->

# Brainstorm — ATRA (site institucional, migração para Next.js + Payload)

> Reconstrução do site institucional de uma consultoria de Dados & IA para que o marketing publique sozinho e o domínio ganhe SEO/SSR — sem perder 6 anos de conteúdo nem um pixel do visual atual.

**Data:** 28/08/2026
**Status:** Aprovado
**Origem:** Reverse-engineered via `/ksdd:setup` em 28/08/2026
**Aviso:** Artefato gerado automaticamente a partir de `docs/`, código e git. Revise e corrija antes de usar como contrato. A documentação-fonte (`docs/00-contexto/`, `docs/README.md`) é a autoridade; este arquivo a resume no formato KSDD.

---

## 1. Conceito em uma frase

Portar o site institucional da ATRA — hoje um WordPress público (`atra.com.br`) espelhado por um protótipo React sem SSR — para **Next.js 16 + Payload CMS 3 + PostgreSQL**, de modo que o marketing publique conteúdo sem depender de desenvolvedor e o domínio ganhe o SEO server-side que hoje não tem, preservando o visual pixel a pixel.

## 2. Problema

**O que existe hoje e por que não resolve.** A ATRA tem *dois* ativos e nenhum atende:

- **`atra.com.br` (WordPress, ~259 URLs).** No ar, público, é o principal ativo de SEO — 207 posts de blog de 2021 a 2026. Mas publicar depende de desenvolvedor, e a stack é a que a migração quer deixar para trás (D-02).
- **Protótipo React + Vite (`legacy/`, gerado no Google AI Studio).** Uma SPA client-side **sem SSR, sem `<meta>` por rota, sem 404 real** (`docs/01-descoberta/inventario-rotas.md`) — invisível para busca. Cobre só 20 rotas contra as ~259 do WordPress.

**Quem sofre.** O time de **marketing** da ATRA, que precisa de um desenvolvedor para cada case, post ou número institucional corrigido. O objetivo de negócio declarado é explícito: *"o marketing publica cases, blog e materiais sem depender de dev, e o site ganha SSR/SEO que hoje não existe"* (`docs/README.md:13-14`).

**Sinais de que o problema é real.**
- **4 formulários não enviam nada** — todo lead preenchido hoje é perdido (`docs/README.md:151-152`).
- **Números institucionais divergem entre páginas** (150+ vs 140+ profissionais, GPTW 5x vs 4x) sem ninguém perceber (P-01).
- **5 links de solução e 3 links legais do rodapé apontam para `#`**; `/contato` é link quebrado em produção (D-09, D-10).
- O site é **bilíngue pela metade**: i18next cobre navegação (172 chaves PT / 169 EN), mas nenhum item de conteúdo está traduzido.

**O critério que define sucesso** (`docs/README.md:16-21`): *uma pessoa de marketing, sem acesso ao código e sem ajuda, cria um case com imagem, vê como ficou, publica, e corrige um número institucional — tudo em português.* Se isso não for verdade no cutover, a migração entregou desempenho e indexação, mas não o que a justificou. Verificado na Fase 6 (MIG-127), com alguém do marketing executando os passos sob observação.

## 3. Solução proposta

Reconstruir o site em **Next.js 16 (App Router) + Payload CMS 3 + PostgreSQL** (D-01, D-04), na pasta `web/`, tratando o protótipo `legacy/` como **gabarito visual** a ser portado pixel a pixel — inclusive os defeitos (D-15), para que a regressão visual do Playwright funcione como rede de segurança real.

O loop de valor tem dois lados:

- **Quem publica.** Todo conteúdo hoje hardcoded (cases, depoimentos, clientes, contato, rodapé, logo, blog) vira **collection / global / mídia** do Payload. O editor de marketing (papel `editor`) cria, edita com **Live Preview**, e publica — sem etapa de aprovação (D-18, D-19), sem chamar dev. Publicar no CMS atualiza o site **sem deploy** (MIG-143, `revalidatePath` em processo).
- **Quem visita.** Cada rota é renderizada no servidor com `<meta>`, `hreflang`, JSON-LD e sitemap próprios. PT na raiz, EN sob `/en/...` com **slugs traduzidos** (D-07). Potenciais clientes B2B convertem por formulário (→ RD Station CRM, D-26) ou pelo chat "ATRA AI" (assistente comercial via Gemini, com UI generativa e teto de custo, D-12).

O WordPress é **substituído** (não coexiste): 207 posts, 287 imagens e 7 vagas migrados por script (`scripts/wp-import/`), com **261 redirects 301** garantindo que nenhuma URL antiga quebre. A virada (cutover) só acontece com **paridade de conteúdo** (D-17) — trocar o domínio antes significaria perder 6 anos de SEO ou manter dois sites no ar.

## 4. Diferencial

Este não é um produto competindo num mercado — é uma **migração com uma tese metodológica**. O "diferencial" é o rigor:

- **Regressão visual pixel a pixel como contrato** — vs. a migração típica "parecido o suficiente". O legado é o gabarito; 0,1% de tolerância em 3 viewports, 13 rotas sob gate. Isso obriga a portar até os defeitos, e em troca dá uma rede que distingue erro de porte de escolha deliberada.
- **Separação migração × conteúdo** (D-22) — quem migra não consolida vocabulário, não reescreve texto, não escolhe categorias. Isso é decisão do marketing, feita pelo CMS. Um aceite visual reprovado nunca fica ambíguo.
- **Decisão registrada é permanente; pendência existe para deixar de existir** — 28 ADRs (`decisoes.md`) e as pendências (`pendencias.md`) em ciclos de vida separados.
- **Reprodutibilidade da infra no git** (D-28) — Compose + Caddy + scripts versionados em vez de painel (Coolify), com deploy por `git push`, healthcheck e rollback provado 3 vezes.

**Referência-âncora:** um site institucional B2B de consultoria de tecnologia (portfólio, cases, blog de autoridade, materiais ricos, carreiras). O que se pega emprestado é a estrutura de conteúdo; o que se evita é o acoplamento a um CMS que trava o marketing.

## 5. Público-alvo

- **Primário — quem publica (CMS):** o time de **marketing** da ATRA (papel `editor`). Cria, edita e publica todo conteúdo em português, sem etapa de aprovação e sem tocar em código. É o usuário cujo sucesso *define* a migração (`README.md:16`).
- **Primário — quem visita (site):** **potenciais clientes B2B** de serviços de Dados, IA e Cloud — de setores regulados (bancos, seguradoras, saúde, varejo). O chat existe para *"ajudar potenciais clientes que chegam ao site e conectá-los com as soluções"* (`legacy/server.ts:8`).
- **Secundário:** `admin` do CMS (navegação, rodapé, prompt da IA, usuários, dado pessoal de terceiros — D-18); **RH** (publica as 7 vagas como páginas, sem ATS); **candidatos** a vaga; **leitores** de blog/materiais/glossário; **parceiros** de tecnologia.
- **Não é pra:** não é ATS nem base de currículos (`specialist-roles` modela *perfis de cargo*, não pessoas — `modelo-de-conteudo.md:58`); não é e-commerce nem app transacional; o consultor não se cadastra, o candidato não tem login. Decisões de conteúdo e vocabulário **não** são de quem migra (D-22).

## 6. Referências

- **WordPress `atra.com.br` (o que substituir)** — pegar emprestado: a cobertura completa de conteúdo (207 posts, soluções, segmentos, legal) e as URLs a preservar via 301. Não copiar: a dependência de dev para publicar e a ausência de estrutura de dados (1 categoria, 0 tags).
- **Protótipo `legacy/` (o gabarito)** — pegar emprestado: cada pixel do visual, a estrutura de seções, os componentes. Não copiar: os defeitos como *comportamento desejado* (são portados, mas registrados como dívida), a ausência de SSR/SEO, os formulários que não enviam.
- **Payload CMS 3** — referência de como um CMS "code-first" com Live Preview, drafts e localization nativa resolve o handoff para o marketing sem recriar a dependência do dev.

## 7. Escopo MVP

O "MVP" aqui é o **cutover**: o site novo assume `atra.com.br` com paridade de conteúdo e SEO preservado.

**Entra (já entregue / no ar em homologação):**
- As 20 rotas do protótipo portadas (15/13 sob gate visual) + 9 rotas novas (`/segmentos`, 8 verticais, `/politicas-e-termos`).
- Todo conteúdo do protótipo migrado para o CMS (collections, globals, mídia).
- Migração do WordPress: 207 posts, 287 imagens, 7 vagas, 261 redirects 301.
- i18n PT/EN com slugs traduzidos; Live Preview, drafts, versionamento; papéis editor/admin.
- Formulários que enviam (→ Postgres + e-mail + RD Station CRM), chat com rate-limit e teto de custo, SEO (metadata/sitemap/JSON-LD).
- Infra: deploy por `git push` com rollback, backup com restore verificado, revalidação sem deploy.

**Fica para depois (e por quê):**
- **Sentry, uptime, treinamento do editor** (Fase 6) — esperam conta/pessoa.
- **GA4/GTM e Resend em produção** (Fase 5) — esperam chave/conta.
- **Cutover de DNS e remoção do `legacy/`** (Fases 7–8) — o caminho crítico agora é *decisão e acesso* (Cloudflare, números institucionais, revisão EN), não engenharia.
- **9 materiais editoriais** (3 relatórios, 3 ebooks, 3 webinars) e **corpos de conteúdo real** — dependem de alguém escrever (P-07).

**A pergunta que o MVP responde:** o marketing consegue operar o site sozinho, e o Google indexa o novo site tão bem quanto o antigo?

## 8. Modelo de negócio (hipótese inicial)

Não é um produto que se sustenta por si — é o **site institucional de uma consultoria B2B de Dados & IA**. A ATRA se descreve como *"uma consultoria de Dados e IA e parceira do Google Cloud"* (`legacy/server.ts:6`). O portfólio cobre três frentes: **Inovação & IA** (IA generativa/preditiva, OCR, apps), **Dados, BI & Advanced Analytics** (engenharia de dados, Lakehouse em BigQuery/Databricks), e **Governança & Cultura** (governança de dados, LGPD, FinOps, Data Literacy), atendendo verticais reguladas.

O site sustenta o negócio por três vias: **geração de leads** (formulários + chat → RD Station CRM), **recrutamento** (vagas) e **autoridade de marca** via conteúdo (blog, materiais, glossário). Prova social: GPTW 5x, +15 anos de mercado, +150 profissionais (números a confirmar — P-01). Clientes citados: Banco ABC, Banco Carrefour, RD Saúde, ANBIMA, Afya, Oncoclínicas, Icatu, Porto.

## 9. Restrições conhecidas

- **Fidelidade visual absoluta (D-15).** O site novo tem de sair igual ao legado, pixel a pixel — inclusive os defeitos. Melhoria não entra junto com migração.
- **Schema muda só por migração versionada (D-21).** `push: false`; toda mudança de campo passa por `migrate:create` + `migrate`.
- **Nenhum segredo com prefixo `NEXT_PUBLIC_`** — o CI reprova (regra 7 do CLAUDE.md).
- **LGPD** — formulário que coleta dado pessoal exige política de privacidade publicada (P-14); retenção de currículos e acesso do RH pendentes (P-17); envio a terceiro (CRM) pede consentimento.
- **VPS modesta** (Hostinger KVM2, 2 vCPU / 8 GB) que também builda o site — o build já derrubou o Postgres por memória uma vez; workers limitados a `cpus/2` (D-28).
- **Dependências de terceiros para decisões finais:** Cloudflare (DNS, cutover), números institucionais, revisão da tradução EN, corpos de conteúdo editorial — todos fora da engenharia.
- **Equipe:** praticamente mono-autor (150/152 commits), sprint intenso de ~10 dias, autoria assistida por IA (`Co-Authored-By: Claude`).

## 10. Perguntas em aberto

Decisões pendentes (`docs/00-contexto/pendencias.md`) — na maioria **decisões de negócio da ATRA**, não de engenharia. Cada uma trava o *seed* (valores reais no ar), a *priorização de redirects* ou o *cutover*:

- **P-01** — números institucionais corretos (profissionais, clientes, GPTW 5x/4x). *Bloqueia seed.*
- **P-04** — teto de custo mensal da ATRA AI (hoje 20 req/IP/hora, provisório). *Bloqueia dimensionamento do chat.*
- **P-07** — quem escreve o corpo dos 9 materiais editoriais. *Ficam em rascunho.*
- **P-08** — o conteúdo EN é tradução aprovada ou saída de máquina? *Define escopo de revisão.*
- **P-09/P-10/P-11** — telefone oficial, nome real do parceiro "Partner", existência do case "RD Saúde".
- **P-12** — manter `Content-Signal: ai-train=yes` no robots? *Decisão de negócio.*
- **P-13/P-19** — export do Search Console e analytics no WP hoje. *Baratas agora, caras depois — dão baseline para o cutover.*
- **P-14/P-17** — política de privacidade e retenção de currículos (LGPD). *Travam o que os formulários podem fazer.*
- **P-20** — guardar histórico de conversas do chat?
- **P-21/P-23** — proxy Cloudflare e acesso à conta Cloudflare. *P-23 trava o cutover.*
- **P-22** — replicar `form-submissions` fora do banco em tempo real (RPO de lead).
- **P-24** — quem da ATRA vai editar o site e ser o ponto de contato pós-cutover.

Já respondidas e promovidas a decisão: P-02, P-03→D-16, P-05→D-28, P-06, P-15→D-17, P-16 (publicar), P-18→D-26, P-27 (sem taxonomia), P-28 (sem área).

---

**Próximo passo:** Este brainstorm foi gerado por reverse-engineering. Revise, aprove (mude `Status:` para `Aprovado`) e siga para o `SPEC.md` (também gerado neste setup) — ou rode `/ksdd:spec` para regerá-lo a partir daqui.
