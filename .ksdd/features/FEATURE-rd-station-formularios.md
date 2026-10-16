# Feature: RD Station nos formulários do site novo

> Os formulários de contato, e-book, newsletter e Trabalhe Conosco do site novo criam ou atualizam o lead no RD Station Marketing com o identificador e a tag que o time de marketing já usa, para que as automações do RD (agradecimento e aviso ao time) continuem funcionando depois que o WordPress for desligado.

**Slug:** rd-station-formularios
**Prioridade:** Crítica (é o que falta para desligar o WordPress)
**Status:** Rascunho
**Data:** 15/10/2026
**Projeto:** ATRA — site institucional (Next.js + Payload)
**Pedido:** Taci, na reunião de 14/10/2026, via G-ferrari

---

## 1. Motivação

### 1.1 Problema / Oportunidade

O site atual (WordPress) entrega cada lead ao RD Station, e o RD faz duas coisas: manda à pessoa um e-mail automático de agradecimento e avisa o time por e-mail. No site novo, os leads comerciais **já** vão ao RD Station Marketing como conversão (D-29, alvo trocado pela D-54). Mas a integração está desligada em produção, por falta da chave, e não cobre o que o marketing usa hoje:

- **Não manda tag.** A newsletter é segmentada no RD pela tag `newsletter`.
- **Não identifica o e-book.** Todos os downloads chegam com o mesmo identificador, e o RD não sabe qual material foi baixado.
- **Trabalhe Conosco fica fora.** A D-29 deixou dado de candidato fora do RD (LGPD). O site atual manda.
- **O admin recusa identificador com espaço ou acento.** O identificador do site atual pode ser um desses: o formulário de contato do Elementor se chama "Formulário Home".
- **O time recebe aviso em dobro.** O site novo manda o próprio aviso por e-mail (Resend) a cada formulário, e o RD também mandaria.

Sem isso, desligar o WordPress interrompe as automações do marketing. O lead continua gravado no site, mas ninguém recebe o agradecimento, a newsletter perde a segmentação e o time deixa de ser avisado pelo canal de sempre.

**Como o site atual faz** (levantado em 15/10 só pelo HTML público, sem acesso ao admin do WordPress nem ao RD):

- Todas as páginas carregam o script de monitoramento do RD (`d335luupugsy2.cloudfront.net/js/loader-scripts/fbafbc60-…-loader.js?ver=7.1.3`). O `ver` indica o plugin oficial "RD Station" para WordPress.
- **Contato** (`/contato/` e home): formulário do **Elementor**, chamado "Formulário Home", com nome, e-mail, empresa, telefone e mensagem. A ligação com o RD não aparece no HTML. Pode ser a captura de formulários do script de monitoramento ou uma ação configurada no Elementor; só o RD ou o admin do WordPress dizem qual.
- **Trabalhe Conosco** (`/trabalhe-conosco/`): **Contact Form 7** com nome, e-mail, LinkedIn, telefone, área de atuação, nível e arquivo do currículo. O plugin do RD integra o Contact Form 7 pela API.
- **Newsletter e e-books** não aparecem nas páginas públicas do WordPress. A landing page do RC18 mora no próprio RD (`www-atrainformatica-com-br.rds.land`), e é provável que e-books e newsletter também estejam lá. [a confirmar com a Taci]

**O que o HTML não mostra**, e por isso entra como dependência: os identificadores de conversão, as tags, os campos personalizados e as automações configuradas no RD.

**O site novo não usa plugin.** O plugin do WordPress é só uma ponte: recebe o formulário e chama a **API de conversões do RD Station** (`POST https://api.rd.services/platform/conversions`). O site novo chama a mesma API direto do servidor (`lib/rd-marketing.ts`, D-54), com a Chave de API gerada na conta do RD. Do site atual só interessa copiar os nomes: o identificador e a tag de cada formulário, que são o que as automações do RD usam. Desligado o WordPress, nada muda para o RD.

### 1.2 Personas Impactadas

- **Marina — Editora de Marketing** (SPEC 2.1): é ela (na ATRA, a Taci) quem opera o RD. Continua com as mesmas automações, sem refazer nada, e passa a escolher no admin do site o identificador e a tag de cada formulário e de cada e-book.
- **Ricardo — Decisor B2B** (SPEC 2.2): continua recebendo o e-mail de agradecimento ao pedir contato ou baixar um e-book. Na página de e-book, lê o conteúdo antes de chegar ao formulário.
- **Paula — Candidata** (SPEC 2.3): ao se cadastrar no banco de talentos, recebe o agradecimento do RD como no site atual. O currículo nunca vai ao RD.

### 1.3 Métricas de Sucesso

| Métrica | Meta | Prazo |
|---------|------|-------|
| Envios dos quatro formulários que chegam ao RD (`rd.syncedAt` preenchido) | 100% dos envios com a integração ligada | na homologação, antes da virada |
| Leads de teste que recebem o e-mail de agradecimento do RD | 4 de 4 formulários | teste na homologação |
| E-mails de aviso ao time por lead | exatamente 1 (do RD; do site só se o RD falhar) | da virada em diante |
| Lead perdido por falha no RD | 0 (gravado no site e avisado pelo site) | contínuo |

---

## 2. Escopo

### 2.1 O que entra (v1)

- **Identificadores e tags no admin.** Em Sistema → Integrações (global `integrations`), cada formulário tem o identificador de conversão e as tags. O identificador passa a aceitar o nome que o RD já usa, com espaço e acento. Hoje ele recusa.
- **Situação da chave no admin.** A Chave de API do RD fica no servidor (`RDSTATION_MARKETING_API_KEY`), como a do ATRAIR (D-41): é credencial, e no banco iria junto nos backups e ficaria à vista de qualquer administrador. O admin mostra só "Chave do RD: configurada" ou "ausente", sem nunca exibir a chave. Decidido em 15/10.
- **Tags na conversão.** Cada conversão leva as tags do formulário. A newsletter leva `newsletter`.
- **Trabalhe Conosco no RD** (o banco de talentos de `/carreiras`, kind `talent-pool`): vira conversão, com identificador e tag próprios. Vão nome, e-mail, telefone e LinkedIn (campo padrão do RD), mais área e senioridade nos campos personalizados que a conta já tiver. **O currículo nunca vai ao RD.** O envio ao ATRAIR continua como está. Isso revê a D-29 por decisão da ATRA e entra como decisão nova em `decisoes.md`.
- **Um identificador por e-book.** Cada material ganha o campo "Identificador no RD". Vazio, vale um padrão derivado do endereço (`ebook-<slug>`).
- **Formulário do e-book depois do texto.** Na página do e-book, o formulário sai do herói e fica depois do conteúdo, antes da faixa "Entre em contato". O botão do herói continua e leva até o formulário. [a confirmar com a Taci: botão no herói]
- **Aviso ao time sem duplicar.** Quando a conversão é aceita pelo RD, o site **não** manda o próprio aviso: quem avisa é o RD. Quando o RD falha (chave ausente, integração desligada, campo recusado, RD fora do ar), o site manda o aviso dele, como hoje. Nenhum lead fica sem aviso.
- **A gravação no Payload continua** (`form-submissions`) para todos os formulários, antes de qualquer envio, como já é hoje.
- **Homologação ponta a ponta.** Chave no servidor, identificadores e tags iguais aos do RD, e um lead de teste por formulário conferido no RD: lead criado, tag, e-mail de agradecimento e aviso ao time.

### 2.2 O que fica pra depois

- **E-mail com o e-book anexado ou com link** — hoje o download é liberado na própria página; se o marketing quiser o envio por e-mail, é uma automação do RD com um link do site que gere o download na hora (o link atual vale 15 minutos). Fica para depois de o fluxo básico estar no ar.
- **Candidatura com currículo na página de cada vaga** (`job-application`) — continua desligada esperando a P-17; quando ligar, segue a mesma regra do Trabalhe Conosco (sem currículo no RD).
- **Base legal por formulário** (`legal_bases`) — hoje só a newsletter confirmada declara consentimento; os outros esperam o aviso de consentimento da P-14. Se a conta do RD bloquear e-mail para quem não tem base legal, isso sobe de prioridade (ver Riscos).
- **Campos personalizados novos no RD** — só se usam os que a conta já tem; criar campo é com o marketing.

### 2.3 O que NÃO é essa feature

- Não troca o formulário do site por formulário do RD embutido: a gravação no site, o anti-spam e a UTM continuam do jeito do site (D-26, D-29).
- Não configura as automações do RD — elas são do marketing e já existem; a feature manda o identificador e a tag certos para elas dispararem.
- Não mexe no consentimento de cookies nem no script de monitoramento do RD (D-30/D-54), salvo se o teste mostrar conversão duplicada (ver Riscos).
- Não muda o que o candidato envia ao ATRAIR (D-41).

---

## 3. User Stories

| # | Como... | Quero... | Para... |
|---|---------|----------|---------|
| US-01 | Ricardo (decisor) | pedir contato pelo formulário e receber o agradecimento por e-mail | saber que o pedido chegou |
| US-02 | Marina (marketing) | que cada lead do site entre no RD com o identificador e a tag que eu já uso | que as minhas automações e segmentações continuem funcionando sem eu refazer nada |
| US-03 | Marina (marketing) | escolher no admin o identificador de cada e-book | montar no RD uma automação e uma segmentação por material |
| US-04 | Ricardo (decisor) | ler sobre o e-book antes de preencher o formulário | decidir se vale baixar |
| US-05 | Inscrito na newsletter | entrar na lista com a tag `newsletter` ao confirmar o e-mail | receber os envios segmentados |
| US-06 | Paula (candidata) | me cadastrar no banco de talentos e receber o agradecimento | saber que o cadastro chegou ao RH |
| US-07 | Time comercial e RH | receber um aviso por lead, nem zero nem dois | não perder lead nem tratar o mesmo duas vezes |

---

## 4. Fluxos de Uso

### 4.1 Lead de contato (home, `/contato`, páginas de solução)

**Pré-condição:** integração ligada no admin e chave do RD no servidor.
**Trigger:** o visitante envia o formulário.

1. Anti-spam → gravação em `form-submissions` (kind `contact`), como hoje.
2. O site manda a conversão ao RD: o identificador e as tags do formulário de contato, mais nome, e-mail, empresa, telefone, mensagem (no campo personalizado, se ligado) e a UTM.
3. O RD aceita (`event_uuid`). O site marca `rd.syncedAt` e **não** manda o aviso dele.
4. No RD, a automação do identificador manda o agradecimento à pessoa e o aviso ao time.

**Sucesso:** um lead no RD, um agradecimento, um aviso ao time, e o documento no admin com `rd.syncedAt`.
**Erro / edge case:** RD recusa ou não responde → `rd.error` preenchido, o site manda o aviso dele (`notified`), e qualquer edição posterior do documento tenta de novo (regra atual de retry). O visitante nunca vê erro por causa do RD.

### 4.2 Download de e-book

**Pré-condição:** o material tem PDF enviado no admin (sem PDF, não há formulário — regra atual, P-07).
**Trigger:** o visitante lê o e-book e preenche o formulário, que fica depois do texto.

1. Gravação (kind `material-download`, com o material) → conversão com o **identificador do e-book** (o do campo; vazio, `ebook-<slug>`) e as tags do formulário de download.
2. O download é liberado na página na hora (URL assinada de 15 min), com ou sem RD.
3. Aviso ao time pela regra do 4.1.

**Sucesso:** o lead no RD com o identificador daquele e-book; o PDF baixado.

### 4.3 Newsletter

1. O visitante se inscreve → recebe o e-mail de confirmação do site (dupla confirmação, MIG-103, mantida).
2. Confirmou → conversão com o identificador da newsletter e a tag `newsletter`, com base legal de consentimento (regra atual).
3. Não confirmou → não vai ao RD (regra atual).

### 4.4 Trabalhe Conosco (banco de talentos)

1. Gravação (kind `talent-pool`) → envio ao ATRAIR como hoje (D-41).
2. Conversão no RD com identificador e tag próprios: nome, e-mail, telefone, LinkedIn; área e senioridade nos campos personalizados, se ligados. Sem currículo.
3. Aviso ao RH pela regra do 4.1.

---

## 5. Impacto em Telas Existentes

### 5.1 Telas Modificadas

| Tela (SPEC seção 7) | O que muda | Onde na tela | Por quê |
|---|---|---|---|
| Página de e-book (`/ebooks/[slug]`, 7.6) | O formulário sai do herói e fica depois do texto, antes de "Entre em contato"; o herói mantém um botão que leva ao formulário | herói e fim do conteúdo | pedido da Taci (14/10): ler antes de converter |
| Admin → Sistema → Integrações | Identificador livre (aceita o nome do RD) e tags por formulário; identificador e tag do Trabalhe Conosco; indicador "Chave do RD: configurada / ausente" | grupo do RD Station | o marketing configura e confere sem programador |
| Admin → E-books (`resources`) | Campo "Identificador no RD" | lateral do documento | US-03 |
| Contato, newsletter, banco de talentos | Nada visível — muda o destino do lead e o aviso | — | — |

### 5.2 Telas Novas

Nenhuma.

---

## 6. Impacto no Modelo de Dados

### 6.1 Novas Entidades

Nenhuma.

### 6.2 Alterações em Entidades Existentes

| Entidade (SPEC seção 4) | Alteração | Migração |
|---|---|---|
| `integrations` (global) | identificador do Trabalhe Conosco; tags por formulário; validação do identificador aceita espaço e acento | sim — aditiva |
| `resources` (e-books e materiais) | `rdConversionIdentifier` (texto, opcional) | sim — aditiva, com a antecipada para banco novo se alguma migração de dados ler a collection inteira (armadilha do CLAUDE.md) |
| `form-submissions` | nada novo — `rd` e `notified` já existem | não |

---

## 7. Impacto na API

### 7.1 Novos Endpoints

Nenhum.

### 7.2 Endpoints Modificados

| Ponto (architecture.md) | Alteração |
|---|---|
| Server Action dos formulários (`actions/formularios.ts`: contato, newsletter, banco de talentos) | aviso do site só quando a conversão não foi aceita pelo RD |
| Server Action do download (`actions/materiais.ts`) | idem; identificador por e-book |
| Gancho `afterChange` de `form-submissions` (`hooks/sincronizar-rd.ts`) + `lib/rd-marketing.ts` | `talent-pool` entra; tags; LinkedIn; campos de candidato; identificador por e-book |
| Chamada externa: `POST https://api.rd.services/platform/conversions` | mesmo endpoint; corpo ganha `tags`, `linkedin` e os `cf_*` de candidato |

---

## 8. Impacto no Design

### 8.1 Componentes Existentes Reutilizados

| Componente | Onde | Variante |
|---|---|---|
| `DownloadGate` (formulário de download) | página de e-book, depois do texto | existente, em fundo claro/escuro do corpo em vez do herói azul |
| Botão do herói do material | herói do e-book | existente, vira âncora para o formulário |

### 8.2 Componentes Novos Necessários

Nenhum.

### 8.3 Tokens / Padrões Visuais

Os do corpo da página (DESIGN.md); o formulário passa a precisar do contraste no fundo da página, nos dois temas, em vez do fundo azul.

---

## 9. Dependências e Riscos

### 9.1 Dependências

| Tipo | Dependência | Status | Impacto se bloqueada |
|---|---|---|---|
| Negócio | **Lista do RD** — identificador de conversão, tags e campos personalizados de cada formulário (contato, newsletter, e-books, Trabalhe Conosco) e as automações ligadas a eles. Taci; plano B: Léo | pendente | alto — sem o mesmo identificador, as automações não disparam |
| Infra | `RDSTATION_MARKETING_API_KEY` (Chave de API da App Store do RD) no servidor de produção | pendente (Léo) | alto — sem ela nada vai ao RD |
| Infra | `RESEND_API_KEY` em produção, para o aviso do site quando o RD falhar | pendente (Fase 2 da SPEC) | médio — sem ela, lead com falha no RD só aparece no admin |
| Conteúdo | PDFs dos e-books (P-07) — sem PDF não há formulário | pendente | médio — o fluxo do e-book não pode ser testado de ponta a ponta |
| Decisão | Trabalhe Conosco no RD sem currículo — revê a D-29 | **decidida em 15/10** (G-ferrari) | — |
| Decisão | Aviso do site só quando o RD falha | **decidida em 15/10** | — |
| Decisão | Identificador por e-book | **decidida em 15/10** | — |
| Decisão | Chave do RD no servidor, com indicador no admin (não editável no admin) | **decidida em 15/10** | — |

### 9.2 Riscos

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| A conta do RD bloqueia e-mail para lead sem base legal (só a newsletter declara consentimento) e o agradecimento não sai | Alto | Média | testar na homologação com lead de teste; se bloquear, decidir com o jurídico a base legal de cada formulário (legítimo interesse para contato/candidato) |
| O identificador do site atual não é conhecido (o HTML não mostra) e o site novo dispara outro nome | Alto | Média | a lista do RD é dependência; o admin aceita qualquer nome; conferir no histórico de conversões de um lead real |
| O script de monitoramento do RD, quando carregado no site novo (aceite de marketing), também captura os formulários e duplica a conversão | Médio | Média | conferir no teste da homologação; se duplicar, desligar a captura de formulários na conta do RD ou marcar os formulários para o script ignorar |
| Dado de candidato no RD (LGPD) | Médio | — | decisão da ATRA registrada; só dados de contato, nunca o currículo; retenção no RD é responsabilidade da conta |
| O teste na homologação cria leads reais no RD | Baixo | Alta | usar e-mails de teste combinados com a Taci, que apaga os leads depois; cada envio de teste só com autorização |
| Campo personalizado `cf_*` que não existe na conta faz o RD recusar a conversão inteira | Médio | Média | os campos de candidato entram atrás do mesmo liga/desliga dos campos personalizados que já existe; nomes conferidos na lista do RD |

---

## 10. Critérios de Aceite

- [ ] Envio de contato com a integração ligada cria ou atualiza o lead no RD com o identificador e as tags configurados no admin para contato, nome, e-mail, empresa, telefone e a origem da UTM (`traffic_source`).
- [ ] Inscrição confirmada na newsletter cria ou atualiza o lead no RD com a tag `newsletter`; inscrição não confirmada não chega ao RD.
- [ ] Download de e-book cria ou atualiza o lead no RD com o identificador daquele e-book (o do campo, ou `ebook-<slug>` vazio) e libera o PDF na página.
- [ ] Cadastro no banco de talentos cria ou atualiza o lead no RD com o identificador e a tag do Trabalhe Conosco, com LinkedIn; o corpo enviado ao RD não contém currículo nem link para ele; o envio ao ATRAIR segue igual.
- [ ] O admin aceita como identificador um nome com espaço e acento (ex.: "Formulário Home").
- [ ] Em Sistema → Integrações, o admin mostra "Chave do RD: configurada" quando `RDSTATION_MARKETING_API_KEY` existe no servidor e "ausente" quando não existe, sem que a chave apareça na tela, na resposta da API do admin ou no banco.
- [ ] Todo envio dos quatro formulários grava em `form-submissions` antes de qualquer chamada externa, com ou sem RD.
- [ ] Conversão aceita pelo RD → o site não manda aviso por e-mail; conversão recusada, RD fora, chave ausente ou integração desligada → o site manda o aviso (`notified: true`).
- [ ] Na página de e-book, o formulário aparece depois do texto e antes de "Entre em contato", nos dois temas e no celular; o botão do herói leva até ele.
- [ ] Na homologação, um lead de teste por formulário, com autorização: lead no RD com identificador e tag certos, e-mail de agradecimento recebido, aviso ao time recebido, um só.
- [ ] Testes unitários do corpo da conversão (tags, LinkedIn, `cf_*` de candidato, identificador do e-book, ausência do currículo) e da regra do aviso; migrações rodam em banco zerado.

---

## 11. Fases de Implementação

### Fase 1 — o essencial (código)
- [ ] Identificadores livres e tags no admin; Trabalhe Conosco configurável
- [ ] Conversão com tags, LinkedIn e campos de candidato; `talent-pool` no RD
- [ ] Aviso do site só quando o RD falha
- [ ] Identificador por e-book e formulário depois do texto

### Fase 2 — ligar (configuração e prova)
- [ ] Lista do RD (Taci; plano B Léo) e configuração no admin da homologação
- [ ] Chave do RD no servidor (Léo)
- [ ] Teste ponta a ponta na homologação, um lead por formulário, conferido no RD com a Taci
- [ ] Virada: o WordPress pode ser desligado quando os quatro passarem

---

**Referências:**
- `.ksdd/specs/SPEC.md` — seções 2 (personas), 4 (modelo de dados), 7.6–7.8 (telas), 12.2 (gate), 13.2–13.3 (fluxos de conversão), 14 (fases)
- `.ksdd/specs/architecture.md` — integrações e Server Actions
- `docs/00-contexto/decisoes.md` — D-26 (UTM), D-29 e D-54 (RD Station), D-30 (consentimento), D-41 (ATRAIR), D-61 (retenção do currículo)
- `docs/00-contexto/pendencias.md` — P-07 (PDFs), P-14 (aviso de consentimento), P-17 (candidatura)
