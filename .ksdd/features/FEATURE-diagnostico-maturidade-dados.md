# Feature: Diagnóstico de maturidade de dados

> Questionário DAMA-DMBOK do Roger (v1.7), reimplementado no site: o visitante responde de 15 a 18 perguntas do seu setor, deixa um contato corporativo e **recebe o resultado por e-mail** — nível de maturidade, pilares, gaps regulatórios e roadmap —, enquanto a ATRA ganha um lead qualificado e uma leitura estruturada do cliente.

**Slug:** diagnostico-maturidade-dados
**Prioridade:** Alta
**Status:** Rascunho
**Data:** 26/09/2026
**Projeto:** ATRA — site institucional (migração Next.js 16 + Payload CMS 3)

---

## 1. Motivação

### 1.1 Problema / Oportunidade

O Roger (ATRA) montou um diagnóstico de maturidade de dados baseado no DAMA-DMBOK que cobre **8 setores** e as normas que pesam sobre cada um em 2026-2027 — RC 18/2025, CMN 5.274, LGPD/ANPD, IFRS 9 e 17, SUSEP, ANS/TISS, Anatel, MEC/INEP, Reforma Tributária, Marco Legal da IA. O material chegou pronto para **WordPress/Elementor + RD Station Marketing** (HTML monolítico, envio direto à API de Conversões), e o site novo não é nenhum dos dois.

A reunião de 24/09 decidiu que ele **substitui o formulário da página RC18** e é **linkado em todas as páginas de normativas**; a D-35 (26/09) registrou que ele substitui também o diagnóstico RC18 (feature `rc18`, tasks 005–007), por ser transversal: atende vários clientes e dá à ATRA uma visão melhor de cada um. É o problema-raiz do projeto (SPEC §1.1): o site como motor de **geração de lead B2B** — aqui, com o lead chegando já qualificado por setor, porte, cargo e maturidade.

Fonte: `docs/02-especificacao/diagnostico-maturidade/` (HTML v1.7, guia de implantação, notas de adaptação) e a ata de 24/09.

### 1.2 Personas Impactadas

- **Ricardo — Decisor B2B (SPEC §2.2):** o alvo. Diretor de dados, risco ou TI de um banco, seguradora, operadora de saúde, grupo educacional… Chega por uma página de normativa, pelo segmento dele ou pela campanha, responde em poucos minutos e recebe no e-mail um retrato do próprio nível, o que está em jogo e um roadmap — material que ele leva para a diretoria.
- **Marina — Editora de Marketing (SPEC §2.1):** decide os textos da página e do e-mail, o link de agenda e onde o diagnóstico é linkado, pelo CMS e sem dev (D-22). As perguntas ficam em código na v1 (ver §2.2).
- **Admin do CMS (SPEC §6) e o comercial:** recebem o lead em `form-submissions` com as respostas **em estrutura** — setor, porte, cargo, nota por pilar DAMA, gaps por regulação — e o aviso por e-mail na caixa de "Diagnóstico" (Contato → Destino dos formulários). O lead segue para o RD Station CRM como qualquer lead comercial (D-26, D-29).

### 1.3 Métricas de Sucesso

| Métrica | Meta | Prazo |
|---------|------|-------|
| Diagnóstico no ar, linkado da página RC18 e das páginas de segmento | Rota publicada e 100% dos links antigos de `/diagnostico-rc18` redirecionando | v1 |
| Leads gravados com respostas estruturadas | 100% das submissões válidas em `form-submissions` com setor, pilares e gaps | v1 |
| Resultado entregue por e-mail ao lead | ≥ 95% dos leads com `resultSentAt` preenchido (com Resend configurado) | v1 |
| Taxa de conclusão (perfil → contato enviado) | `[a definir — depende de baseline GA4, P-19]` | pós-cutover |

---

## 2. Escopo

### 2.1 O que entra (v1)

- **Rota única** `/diagnostico-maturidade` (slug EN traduzido em `lib/routes.ts`, D-07), com **setor pré-selecionado pela URL** (`?setor=financeiro`), para ser linkada de qualquer página.
- **Fluxo do Roger, fiel à v1.7:** perfil (setor, porte, cargo, com a linha "Impactos avaliados" do setor) → perguntas filtradas pelo setor (15 a 18 de uma base de 33), uma por tela, com avanço automático ao escolher e botão de voltar → contato → conclusão.
- **Base de perguntas, pontuação e textos do resultado portados do HTML v1.7** (`QUESTIONS`, `TAG_LABELS`, `SECTOR_TAGS`, `LEVELS`, `OFFERS`, `REG_ACTIONS`, `STAKES`, roadmap), em código versionado, com a mesma regra de cálculo (`computeScores`, `buildRoadmap`).
- **Contato:** nome, e-mail **corporativo** (lista de domínios pessoais bloqueados do Roger), telefone, empresa e consentimento obrigatório (texto do P-14).
- **Resultado só por e-mail ao lead** (decisão de 26/09): nível DMBOK e média, leitura pelo porte, impactos do setor, barras por pilar, "o que está em jogo", regulações com maior gap, roadmap em 3 fases e ações por regulação, com os botões de WhatsApp e de agenda.
- **Tela de conclusão:** confirma o envio para o e-mail informado, com os botões de WhatsApp e de agenda — sem mostrar o resultado.
- **Captura no servidor:** Server Action que **recalcula a pontuação a partir das respostas** (não confia no cliente), grava em `form-submissions` com `kind: data-maturity-diagnostic` e um grupo estruturado do diagnóstico, avisa a caixa "Diagnóstico" com o resultado completo e as respostas, e dispara o fluxo D-26 (e-mail → RD Station CRM via hook).
- **Conteúdo no CMS:** um global "Diagnóstico de maturidade" com os textos da página e da conclusão, o assunto e a abertura do e-mail, o **link de agenda** (vazio = sem botão) e o link do WhatsApp.
- **Aposentar o diagnóstico RC18 (D-35):** `/diagnostico-rc18` redireciona para `/diagnostico-maturidade?setor=financeiro`; saem a rota, o motor, a action e a leitura de `RC18_LEAD_EMAIL` dele; o valor `rc18-diagnostic` **fica** no enum, escondido.
- **Página RC18:** o convite ao diagnóstico passa a levar à rota nova e o formulário de contato da página sai, trocado pelo diagnóstico (instrução do Roger na ata).
- **LGPD e analytics:** sem IP nem user agent gravados; evento `quiz_maturidade_lead` só com consentimento (`lib/rastreio.ts`, D-30).
- **SEO e testes:** metadata e `noindex` na rota (é ferramenta, não conteúdo), smoke das rotas e unitários do motor (paridade com o HTML).

### 2.2 O que fica pra depois

- **Editar perguntas, setores, ofertas e ações no admin** — são 33 perguntas × opções × tags × 8 setores; modelar isso no Payload não cabe antes de 02/10. Na v1 ficam em código, como o motor RC18 já fazia; os textos da página e do e-mail já ficam no CMS.
- **Mostrar o resultado na tela** — decisão de 26/09: só e-mail. O HTML do Roger marca a tela de resultado como "temporária" até a automação de e-mail existir.
- **PDF do resultado** anexo ao e-mail (a Taci converteu o README para PDF; o PDF do resultado é outro artefato).
- **Campos `cf_*` do RD Station Marketing** e as automações sugeridas no README — o site fala com o RD **CRM** (D-26); mapear para o Marketing só se o comercial depender (pergunta 7 da mensagem de 26/09, sem resposta).
- **Reenviar o resultado pelo admin** quando o e-mail falhar.
- **Tradução EN** do questionário — o público das normas é nacional; a rota EN serve o conteúdo PT.

### 2.3 O que NÃO é essa feature

- **Não** cola o HTML do Roger em lugar nenhum nem embute o monolito HTML+CSS+JS — reimplementa com os componentes do site.
- **Não** chama a API do RD Station do navegador nem expõe `rdApiKey`.
- **Não** redige nem valida o texto das normas: a validação jurídica dos 3 itens sem fonte primária é pré-requisito de publicação (§9), não trabalho de código.
- **Não** muda as páginas de segmento e de normativa: os links para o diagnóstico entram por blocos de CTA no admin.

---

## 3. User Stories

| # | Como... | Quero... | Para... |
|---|---------|----------|---------|
| US-01 | Decisor de banco (Ricardo) | abrir o diagnóstico já no meu setor, a partir da página de normativa | não gastar tempo com perguntas que não são do meu mercado |
| US-02 | Decisor | responder em poucos minutos, uma pergunta por tela, voltando se errar | chegar ao fim sem desistir |
| US-03 | Decisor | receber por e-mail o meu nível, os gaps por regulação e um roadmap | levar um retrato concreto para a diretoria |
| US-04 | Decisor | falar com um especialista ou agendar a partir do e-mail e da tela final | transformar o diagnóstico em conversa |
| US-05 | Comercial / Admin | ver o lead com setor, porte, cargo, notas por pilar e gaps, e recebê-lo no CRM | priorizar e abordar com contexto |
| US-06 | Editora (Marina) | mudar os textos da página e do e-mail e o link de agenda no admin | ajustar a comunicação sem dev (D-22) |

---

## 4. Fluxos de Uso

### 4.1 Da página de normativa ao resultado no e-mail (principal)

**Pré-condição:** rota publicada; Resend configurado (`RESEND_API_KEY`); texto de consentimento preenchido (P-14).
**Trigger:** clique em um CTA "Faça o diagnóstico" numa página de normativa, de segmento ou na RC18 (com `?setor=`), ou acesso direto.

1. `/diagnostico-maturidade?setor=financeiro` abre no **perfil**, setor já escolhido e a linha "Impactos avaliados: LGPD, ANPD, Marco Legal da IA, Banco Central, CMN… entre outros".
2. Escolhe **porte** e **cargo** → "Começar".
3. **Perguntas** do setor (ex.: 17 no financeiro), uma por tela: pilar, "Pergunta N de M", enunciado, 4 alternativas (A–D) e as etiquetas de regulação relevantes ao setor. Escolher avança sozinho em 350 ms; "Voltar" desfaz.
4. **Contato:** nome, e-mail corporativo, telefone, empresa, consentimento → "Enviar".
5. Servidor: anti-spam → recalcula a pontuação a partir das respostas → grava (`form-submissions`, `data-maturity-diagnostic`, grupo do diagnóstico) → **e-mail do resultado ao lead** → aviso à caixa "Diagnóstico" → RD Station CRM (hook).
6. **Conclusão:** "Enviamos o seu resultado para ana@banco.com.br", com WhatsApp e, se configurado, "Agendar conversa".

**Sucesso:** lead gravado com respostas estruturadas, `resultSentAt` preenchido, evento `quiz_maturidade_lead` disparado (com consentimento), aviso na caixa "Diagnóstico".
**Erro / edge case:**
- **E-mail pessoal** (gmail, hotmail…): recusa no campo, antes de enviar, com a mensagem de que é preciso e-mail corporativo; o servidor recusa também.
- **Sem Resend:** o lead grava, `resultSentAt` fica vazio e o admin mostra; a conclusão diz que o resultado chega por e-mail e oferece o WhatsApp — o lead nunca se perde (contrato do repositório).
- **Robô** (isca ou envio rápido demais): sucesso falso, sem gravar.
- **Setor inválido na URL:** ignorado, o perfil abre sem setor escolhido.
- **Trocar de setor no meio:** recomeça as respostas (regra do Roger).

### 4.2 Link antigo do diagnóstico RC18

1. Visitante abre `/diagnostico-rc18` (e-mail da campanha, favorito).
2. Redirect permanente para `/diagnostico-maturidade?setor=financeiro`.

### 4.3 Marketing ajusta textos e link de agenda

1. Admin → global "Diagnóstico de maturidade" → edita textos / cola o link de agenda → publica.
2. `revalidatePath` atualiza a rota sem deploy (ADR-007); o próximo e-mail já sai com o texto novo.

---

## 5. Impacto em Telas Existentes

### 5.1 Telas Modificadas

| Tela (SPEC §7) | O que muda | Onde | Por quê |
|---|---|---|---|
| RC18 (`/solucoes/rc18`, §7.4) | "Verificar diagnóstico" leva a `/diagnostico-maturidade?setor=financeiro`; o formulário de contato da página sai | blocos `pageHero` (CTA) e `ctaContact` | Ata de 24/09 e D-35 |
| Páginas de segmento e de normativa (§7.5) | Bloco de CTA para o diagnóstico com o setor correspondente | layout no admin | "linkar em todas as páginas de normativas" (ata) |
| Diagnóstico RC18 (`/diagnostico-rc18`, §7.8) | Deixa de existir: redirect permanente | `proxy.ts` / redirects | D-35 |

### 5.2 Telas Novas

#### `/diagnostico-maturidade` — Diagnóstico de maturidade de dados

**Objetivo:** levar o visitante do perfil ao contato em poucos minutos e entregar o resultado por e-mail.

**Seções (de cima pra baixo):**
- A. **Cabeçalho** — título e texto do global (CMS), barra de progresso e rótulo da etapa ("Perfil", "Pergunta 4 de 17", "Contato").
- B. **Perfil** — setor (8 opções do Roger), porte (5 faixas), cargo (6 opções); linha "Impactos avaliados" ao escolher o setor.
- C. **Pergunta** — pílula do pilar, contador, enunciado, 4 alternativas como opções de rádio (A–D), etiquetas de regulação do setor.
- D. **Contato** — nome, e-mail corporativo, telefone, empresa, consentimento; erro por campo.
- E. **Conclusão** — confirmação do envio para o e-mail, botões WhatsApp e Agendar (este só com link no global).
- F. **Ajuda** — "Prefere conversar?" com WhatsApp, visível durante o fluxo (como no HTML).

**Componentes usados:** `pill-btn-primary`, `ChipFilter`/chips, `StatusBadge`, campos do padrão de formulário do site, a barra de progresso no estilo do carrossel de cases (DESIGN.md, SPEC §8).
**Mobile:** coluna única; alternativas em lista com área de toque ≥ 44 px; botões fixos de voltar/avançar no rodapé do cartão.

#### E-mail "Seu diagnóstico de maturidade de dados" (ao lead)

**Objetivo:** entregar o resultado que o HTML v1.7 mostrava na tela.
**Seções:** nota e nível (com a leitura pelo porte), impactos do setor, maturidade por pilar (barras simples em HTML de e-mail), o que está em jogo, regulações com maior gap, roadmap em 3 fases, ações por regulação, nota metodológica, botões WhatsApp e Agendar. Versão texto como alternativa.

---

## 6. Impacto no Modelo de Dados

### 6.1 Novas Entidades

| Entidade | Atributos críticos | Relações |
|----------|-------------------|----------|
| Global `data-maturity-diagnostic` | título, texto de abertura, texto da conclusão, assunto e abertura do e-mail, `agendaUrl` (opcional), `whatsappUrl` — localizados onde é texto | — |

### 6.2 Alterações em Entidades Existentes

| Entidade (SPEC §4.3) | Alteração | Migração |
|--------------------------|-----------|----------|
| `FormSubmissions` | `kind`: novo valor `data-maturity-diagnostic`; `rc18-diagnostic` fica, escondido no admin | sim — aditiva (valor de enum) |
| `FormSubmissions` | grupo `diagnostic`: setor, porte, cargo, média, nível, notas por pilar e por área DAMA, gaps por regulação e top 3, respostas (id, pilar, nota, tags, texto), roadmap, versão do questionário, duração; `resultSentAt` | sim — aditiva (colunas / JSON) |
| `FormSubmissions` → CRM (`hooks/sincronizar-crm.ts`, `lib/crm.ts`) | o novo kind é comercial e sincroniza; a nota da negociação leva nível, pilares e top 3 de gaps | não |

---

## 7. Impacto na API

Sem endpoints HTTP novos: o site usa Server Actions (architecture.md — padrão de `actions/formularios.ts`, `actions/consultores.ts`).

### 7.1 Novas Server Actions

```
enviarDiagnosticoDeMaturidade(FormData)    grava o lead, recalcula, envia o resultado ao lead e o aviso à ATRA    Auth: não (anti-spam + limite por IP)
```

### 7.2 Modificados

| Ponto | Alteração |
|---|---|
| `lib/email.ts` (`enviarAviso`) | aceitar corpo **HTML** opcional além do texto (hoje só `text`) |
| `lib/destino-do-aviso.ts` | o aviso usa o campo "Diagnóstico" (PR #51) |
| `actions/diagnostico-rc18.ts`, `lib/diagnostico-rc18.ts`, rota `/diagnostico-rc18` | removidos (D-35) |

---

## 8. Impacto no Design

### 8.1 Componentes Existentes Reutilizados

| Componente (DESIGN.md) | Onde | Variante |
|---|---|---|
| Botões `pill-btn-primary` / secundário | avançar, enviar, WhatsApp, agenda | existente |
| Chips (etiquetas) | impactos do setor, regulações na pergunta | existente, sem borda |
| Campos de formulário do site (padrão de `/contato`) | perfil e contato | existente |
| Cartão (6 px, sem borda, sombra no hover) | cartão do questionário | existente |

### 8.2 Componentes Novos Necessários

| Componente | Descrição | Variantes | Estados |
|---|---|---|---|
| `OpcaoDoQuestionario` | alternativa como rádio com letra A–D | — | default, hover, foco, selecionada, desabilitada |
| `BarraDeProgresso` | progresso das etapas | — | 0–100% |
| Template de e-mail do resultado | HTML de e-mail com estilos em linha | — | — |

### 8.3 Tokens / Padrões Visuais

Os do DESIGN.md; nenhum token novo. Cores dos pilares no e-mail: crítico (< 2,6) e atenção (< 3,5) como no HTML do Roger, mapeados para o laranja e o azul da marca.

---

## 9. Dependências e Riscos

### 9.1 Dependências

| Tipo | Dependência | Status | Impacto se bloqueada |
|------|-------------|--------|----------------------|
| Técnica | Campo de destino "Diagnóstico" (PR #51) | aberto | baixo — sem ele, o aviso vai para o e-mail geral |
| Técnica | `RESEND_API_KEY` e domínio de envio em produção | a confirmar | **alto** — o resultado só chega por e-mail |
| Negócio | Texto de consentimento / política (P-14) | pendente — o texto existe, segundo o G-ferrari | alto — sem ele não há base legal para o envio |
| Negócio | Validação jurídica das normas citadas (3 itens sem fonte primária no README) | pendente (Taci + jurídico) | alto para publicar; não trava o código |
| Negócio | Caixa de e-mail do diagnóstico (P-29) | pendente — agora campo no admin | baixo |
| Negócio | Link de agenda (se houver) | pendente — campo no admin | baixo — sem link, sem botão |
| Feature | `.ksdd/features/FEATURE-rc18.md` (tasks 005–007 substituídas) | concluída | — |

### 9.2 Riscos

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| E-mail não entregue: o lead não vê resultado nenhum (decisão "só e-mail") | Alto | Média | `resultSentAt` visível no admin; conclusão oferece WhatsApp; reenviar pelo admin na v2 |
| Porte divergir do HTML (nota ou nível diferentes) | Alto | Média | testes de paridade com respostas fixas contra os valores do `computeScores` original |
| Bloqueio de e-mail pessoal reduz conversão | Médio | Média | decisão de produto (26/09); a lista fica em um só lugar para ajuste |
| Texto regulatório errado publicado | Alto | Baixa | validação jurídica como critério de publicação (§10) |
| Prazo (02/10) | Médio | Média | perguntas em código na v1; admin das perguntas na v2 |

---

## 10. Critérios de Aceite

- [ ] `/diagnostico-maturidade` responde 200 em PT; a rota EN responde com o conteúdo PT; ambas com `noindex`.
- [ ] `?setor=financeiro` abre o perfil com o setor escolhido e os impactos do setor; setor inválido é ignorado.
- [ ] Para cada um dos 8 setores, o número de perguntas bate com o HTML v1.7 (15 a 18) e a ordem é a da base.
- [ ] Para um conjunto fixo de respostas por setor, média, nível, notas por pilar, gaps e roadmap são **idênticos** aos do `computeScores`/`buildRoadmap` do HTML (testes unitários).
- [ ] E-mail de domínio pessoal da lista do Roger é recusado no cliente e no servidor.
- [ ] Envio válido grava `form-submissions` com `kind: data-maturity-diagnostic` e o grupo do diagnóstico completo; **sem IP nem user agent**.
- [ ] A pontuação gravada é a **recalculada no servidor**; resposta forjada (id de pergunta ou opção inexistente) é descartada ou recusada.
- [ ] Com Resend configurado, o lead recebe o e-mail com nível, pilares, gaps, roadmap e ações; `resultSentAt` é preenchido.
- [ ] A caixa "Diagnóstico" (ou o e-mail geral, se vazia) recebe o aviso com o resultado e as respostas.
- [ ] O lead sincroniza com o RD Station CRM pelo hook (kind comercial).
- [ ] A tela de conclusão **não** mostra o resultado; mostra o e-mail de destino, WhatsApp e — só com link no global — Agendar.
- [ ] `quiz_maturidade_lead` só vai para o `dataLayer` com consentimento de estatística/marketing.
- [ ] `/diagnostico-rc18` e `/en/rc18-diagnostic` redirecionam (301/308) para a rota nova com `setor=financeiro`; `rc18-diagnostic` não aparece mais como opção no admin, mas os registros antigos continuam legíveis.
- [ ] A página RC18 leva ao diagnóstico novo e não tem mais o formulário de contato.
- [ ] Anti-spam e limite por IP iguais aos dos outros formulários.
- [ ] Smoke das rotas, `lint`, `typecheck` e unitários verdes.
- [ ] **Publicação:** textos das normas validados pelo jurídico (Taci) antes de linkar nas páginas públicas.

---

## 11. Fases de Implementação

### Fase 1 — o diagnóstico funcionando
- [ ] Motor portado do HTML (base, pontuação, roadmap, textos do resultado) com testes de paridade
- [ ] Modelo de dados (kind novo, grupo do diagnóstico, global de textos) e e-mail HTML
- [ ] Rota e ilha do questionário (perfil → perguntas → contato → conclusão)
- [ ] Server Action de captura, e-mail do resultado ao lead e aviso à ATRA, CRM

### Fase 2 — trocar o RC18 e ligar nas páginas
- [ ] Aposentar `/diagnostico-rc18` (redirect, remoção do motor e da action antigos)
- [ ] Página RC18 apontando para o diagnóstico, sem o formulário
- [ ] SEO, smoke, evento de analytics com consentimento

### Fase 3 — v2 (fora deste ciclo)
- [ ] Perguntas, ofertas e ações editáveis no admin
- [ ] PDF do resultado, reenviar pelo admin, campos `cf_*` do RD Marketing

---

**Referências:**
- `.ksdd/specs/SPEC.md` — §1.1, §2.1, §2.2, §4.3, §7.4, §7.5, §7.8, §8, §13
- `.ksdd/specs/architecture.md` — Server Actions, anti-spam, ADR-007 (revalidação), fluxo de leads
- `.ksdd/specs/DESIGN.md` e `DESIGN.md` (raiz) — botões, chips, cartões, campos
- `.ksdd/features/FEATURE-rc18.md` — motor, captura e rota que esta feature substitui (D-35)
- `docs/00-contexto/decisoes.md` — D-07, D-22, D-26, D-29, D-30, D-35
- `docs/00-contexto/pendencias.md` — P-14, P-19, P-29
- `docs/02-especificacao/diagnostico-maturidade/` — HTML v1.7, README de implantação, adaptação ao site novo
