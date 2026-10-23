# Feature: Criador de formulários no admin, ligado ao RD

> O marketing monta um formulário novo no admin (campos, textos, o que acontece depois do envio e o que vai ao RD), põe numa página com a seção "Formulário" e publica, sem programador. Cada envio é gravado no site e chega ao RD Station Marketing como conversão, com o identificador e as tags daquele formulário.

**Slug:** criador-de-formularios
**Prioridade:** Média (não bloqueia a virada; tira o programador do caminho de cada formulário novo)
**Status:** Rascunho
**Data:** 20/10/2026
**Projeto:** ATRA — site institucional (Next.js + Payload)
**Pedido:** tarefa #212 do checklist (pedido e análise de 16/10/2026), via G-ferrari

---

## 1. Motivação

### 1.1 Problema / Oportunidade

Hoje cada formulário do site é código: contato, newsletter, e-book, Trabalhe Conosco, consultores, diagnóstico e o convite do chat têm, cada um, a sua Server Action, o seu `kind` em `form-submissions` e uma linha fixa em Sistema → Integrações. Um formulário novo (inscrição num evento, uma campanha, uma pesquisa curta) pede programador, migração e deploy. É exatamente o que a migração prometeu tirar do caminho do marketing (SPEC 1.2, persona 2.1).

No WordPress, o marketing criava formulários sozinho (Elementor, Contact Form 7) e o plugin do RD os ligava. No site novo a ligação com o RD já existe (D-54, feature `rd-station-formularios`), mas só para os formulários escritos em código.

**O que o RD não deixa automatizar** (análise de 16/10, pela documentação pública da API): o RD não tem API para criar formulário, landing page nem fluxo de automação. O identificador de conversão e as tags passam a existir no RD sozinhos na primeira conversão que os usa. O e-mail de agradecimento e o aviso ao time continuam sendo um fluxo que o marketing monta no RD, como hoje. Campos personalizados até têm API, mas ela exige um app autorizado na conta (OAuth), além da Chave de API de hoje, e fica fora desta feature.

### 1.2 Personas Impactadas

- **Marina — Editora de Marketing** (SPEC 2.1; na ATRA, a Taci): cria, edita e publica formulários sem programador, e define no próprio formulário o que vai ao RD.
- **Ricardo — Decisor B2B** (SPEC 2.2): encontra formulários específicos para o que procura (um evento, um material, uma conversa) e recebe a resposta que o marketing configurou.
- **Time comercial**: recebe cada lead uma vez, pelo RD ou, se o RD falhar, por e-mail do site.

### 1.3 Métricas de Sucesso

| Métrica | Meta | Prazo |
|---------|------|-------|
| Uma pessoa do marketing cria um formulário, põe numa página e publica, sem ajuda | passa / não passa, sob observação | na homologação, depois da entrega |
| Envios de formulário do admin gravados em `form-submissions` | 100%, com ou sem RD | contínuo |
| Envios que chegam ao RD (`rd.syncedAt` preenchido) com a integração ligada e identificador preenchido | 100% | contínuo |
| Lead sem aviso, ou com aviso em dobro | 0 | contínuo |

---

## 2. Escopo

### 2.1 O que entra (v1)

- **Área "Formulários" no admin** (Conteúdo), onde o editor cria e edita formulários, com rascunho e publicação como o resto do conteúdo. Cada formulário tem:
  - **Nome** (interno, para achar no admin e no RD).
  - **Campos**, em ordem, com rótulo, texto de exemplo, obrigatório ou não e largura (meia ou inteira). Tipos: **nome, e-mail, telefone, empresa, cargo, texto curto, texto longo, lista de opções** (escolhe uma) e **caixa de marcar**. O e-mail é obrigatório em todo formulário: é por ele que o RD identifica o lead.
  - **Botão** (texto) e, opcional, um **aviso acima do botão** (por exemplo, o aviso de privacidade).
  - **Depois do envio:** uma **mensagem** no lugar do formulário ou **ir para uma página** do site escolhida no admin.
  - **Aviso ao time:** os endereços de e-mail que recebem o aviso do site quando o RD não aceita o lead. Vazio, vale o destino geral do contato.
  - **RD Station:** identificador de conversão (**sugerido a partir do nome**, editável, com as mesmas regras de formato de Sistema → Integrações), tags (até 10) e, por campo, para onde ele vai no RD.
- **Para onde cada campo vai no RD.** Nome, e-mail, telefone, empresa e cargo vão sempre para os campos padrão do RD (`name`, `email`, `personal_phone`, `company_name`, `job_title`). Os outros tipos escolhem entre **não enviar** e **um campo personalizado** (`cf_…`, digitado exatamente como está no RD). Campo personalizado só vai com a chave "Enviar campos personalizados" ligada em Sistema → Integrações, a mesma regra de hoje.
- **Consentimento.** Uma caixa de marcar pode ser marcada como **consentimento de comunicação**: marcada pelo visitante, a conversão leva a base legal de consentimento (`legal_bases` e `available_for_mailing`), como a newsletter já faz. Desmarcada ou ausente, o lead vai sem base legal declarada, como os outros formulários.
- **Seção "Formulário"** (bloco novo) para pôr um formulário publicado em qualquer página montada por blocos (Páginas, Soluções, Segmentos, Parceiros). A seção tem título, texto e duas formas: o formulário **sozinho, centralizado**, ou **com o texto ao lado**. Ganha miniatura no seletor de seções, como as outras.
- **O envio segue o caminho dos formulários atuais:** anti-spam (campo isca, carimbo de tempo, limite por IP), página de origem e UTM, gravação em `form-submissions` **antes** de qualquer envio externo, e formulário que funciona sem JavaScript. O servidor confere tudo contra o formulário publicado: campo obrigatório, formato do e-mail, opção que existe na lista, tamanho máximo. O que não é campo do formulário é descartado.
- **Gravação.** Um tipo novo em Envios de formulário, "Formulário do admin", com o formulário de origem. Nome, e-mail, telefone e empresa vão nas colunas que já existem (a lista e a busca do admin continuam valendo); as outras respostas ficam legíveis no envio, como "rótulo: valor".
- **Aviso ao time igual aos formulários atuais:** quando o RD aceita a conversão, quem avisa é a automação do RD; quando não aceita (chave ausente, integração desligada, identificador vazio, RD recusou ou fora do ar), o site manda o e-mail dele aos endereços do formulário. A regra de nova tentativa por edição no admin continua.
- **Sistema → Integrações lista os formulários do admin**, com nome, identificador, tags e o link para editar, para o marketing ver num lugar só tudo o que vai ao RD. O liga/desliga geral do RD continua valendo para eles.
- **Dois idiomas.** Rótulos, textos de exemplo, opções, botão, aviso e mensagem são traduzíveis; em inglês, o que não tiver tradução sai em português (regra atual do site).

### 2.2 O que fica pra depois

- **Migrar os formulários de hoje** (contato, newsletter, e-book, Trabalhe Conosco, consultores, diagnóstico, chat) para o criador. Cada um tem regra própria (download, ATRAIR, aviso ao candidato, cálculo do diagnóstico); trocar qualquer um é decisão à parte.
- **Liberar download de material** depois do envio (como o formulário de e-book).
- **Campo oculto** com valor fixo (ex.: o nome de uma campanha).
- **Anexo de arquivo.** Currículo e documentos não entram: dado pessoal sensível e desvio de finalidade numa base de marketing (D-29).
- **Campos condicionais, várias etapas, captcha, relatórios e exportação.**
- **Criar campos personalizados no RD pelo site** (exige app OAuth na conta do RD).

### 2.3 O que NÃO é essa feature

- Não cria formulário, landing page nem automação dentro do RD: a API do RD não permite. O agradecimento e o aviso ao time continuam sendo fluxo do marketing no RD.
- Não troca o formulário do site por um formulário do RD embutido: gravação, anti-spam e UTM seguem do site (D-26, D-29, D-54).
- Não muda os formulários existentes nem os identificadores deles em Sistema → Integrações.
- Não decide texto, campos nem consentimento de nenhum formulário: isso é do marketing e do jurídico (D-22, P-14).

---

## 3. User Stories

| # | Como... | Quero... | Para... |
|---|---------|----------|---------|
| US-01 | Marina (marketing) | criar um formulário no admin, escolhendo campos, textos e botão | captar leads de uma campanha sem pedir a um programador |
| US-02 | Marina (marketing) | definir no próprio formulário o identificador, as tags e para onde cada campo vai no RD | que as minhas automações e segmentações disparem com o nome certo |
| US-03 | Marina (marketing) | pôr o formulário em qualquer página com a seção "Formulário" e ver no preview antes de publicar | publicar com segurança |
| US-04 | Marina (marketing) | ver em Sistema → Integrações todos os formulários que vão ao RD | conferir num lugar só o que está ligado |
| US-05 | Ricardo (decisor) | preencher um formulário curto e ver a confirmação ou a página de obrigado | saber que o pedido chegou |
| US-06 | Ricardo (decisor) | marcar se aceito receber comunicações | receber só o que autorizei |
| US-07 | Time comercial | receber um aviso por lead, nem zero nem dois | não perder lead nem tratar o mesmo duas vezes |

---

## 4. Fluxos de Uso

### 4.1 Criar e publicar um formulário

**Pré-condição:** usuário do admin (editor ou admin).

1. Conteúdo → Formulários → criar. Dá um nome; o identificador do RD é sugerido a partir dele.
2. Adiciona os campos (o e-mail já vem), o texto do botão, o aviso, o que acontece depois do envio e os endereços do aviso.
3. No grupo do RD, confere o identificador, põe as tags e escolhe para onde vai cada campo que não é padrão.
4. Publica o formulário.
5. Numa página, adiciona a seção "Formulário", escolhe o formulário, escreve título e texto, confere no preview e publica a página.

**Sucesso:** a página mostra o formulário, e Sistema → Integrações o lista.
**Erro / edge case:** identificador fora do formato → o admin recusa com a mensagem de hoje. Formulário sem e-mail → impossível (o campo vem fixo). Seção com formulário em rascunho → o site não desenha nada; o preview mostra o rascunho.

### 4.2 Visitante envia

**Trigger:** o visitante preenche e envia.

1. Anti-spam; o servidor confere os campos contra o formulário publicado.
2. Grava em `form-submissions` (tipo "Formulário do admin", com o formulário, a página de origem e a UTM).
3. Se a integração está ligada, há chave no servidor e o formulário tem identificador: conversão no RD com o identificador, as tags, os campos padrão, os campos personalizados (com a chave deles ligada) e, com a caixa de consentimento marcada, a base legal.
4. RD aceitou → o site não avisa (a automação do RD avisa). RD não aceitou → e-mail do site aos endereços do formulário.
5. O visitante vê a mensagem ou vai para a página escolhida.

**Erro / edge case:** campo obrigatório vazio ou e-mail inválido → mensagem no formulário, nada gravado. Formulário despublicado ou apagado depois de a página ser montada → o envio é recusado com a mensagem genérica e nada é gravado. RD fora → o lead fica gravado e avisado pelo site; a próxima edição do envio no admin tenta de novo. O visitante nunca vê erro por causa do RD.

---

## 5. Impacto em Telas Existentes

### 5.1 Telas Modificadas

| Tela | O que muda | Onde na tela | Por quê |
|---|---|---|---|
| Admin → Sistema → Integrações | Lista dos formulários do admin (nome, identificador, tags, link) | grupo do RD Station, depois dos formulários fixos | US-04 |
| Admin → Sistema → Envios de formulário | Tipo novo "Formulário do admin"; o formulário de origem e as respostas legíveis no envio; filtro por formulário | lista e documento | conferir os leads de cada formulário |
| Admin → seletor "Adicionar seção" (Páginas, Soluções, Segmentos, Parceiros) | Seção nova "Formulário", com miniatura | grade do seletor | US-03 |
| Páginas do site que receberem a seção | A seção nova, nos dois temas e no celular | onde o editor puser | US-05 |

### 5.2 Telas Novas

| Tela | Objetivo | Acesso | Prioridade |
|---|---|---|---|
| Admin → Conteúdo → Formulários (lista e edição) | criar e editar formulários | editor e admin | P0 |

---

## 6. Impacto no Modelo de Dados

### 6.1 Novas Entidades

| Entidade | Campos principais | Relações |
|---|---|---|
| `forms` (Formulários) | nome; campos (tipo, rótulo, exemplo, obrigatório, largura, opções, consentimento, destino no RD); botão; aviso; depois do envio (mensagem ou página); endereços do aviso; RD (identificador, tags); rascunho e publicação | página de destino → `pages`; usada pela seção "Formulário" |

### 6.2 Alterações em Entidades Existentes

| Entidade | Alteração | Migração |
|---|---|---|
| `form-submissions` | tipo novo no `kind`; relação com o formulário; respostas dos campos que não têm coluna | sim, aditiva |
| Blocos de `pages`, `solutions`, `segments`, `partners` | bloco novo "Formulário" (tabelas novas de bloco) | sim, aditiva, **com a migração antecipada** datada antes da primeira migração de dados: o adapter faz JOIN em toda tabela de bloco a cada consulta, e migração de dados antiga roda com o config de hoje (armadilha do CLAUDE.md) |
| `payload_locked_documents_rels` | coluna da collection nova, criada pelo Payload | idem: entra na antecipada (a armadilha da `press`, 02/10) |

---

## 7. Impacto na API

### 7.1 Novos Endpoints

Nenhum endpoint público. O envio é uma **Server Action** nova (o formulário funciona sem JavaScript), no mesmo padrão de `actions/formularios.ts`.

### 7.2 Endpoints Modificados

| Ponto (architecture.md) | Alteração |
|---|---|
| Gancho `afterChange` de `form-submissions` (`hooks/sincronizar-rd.ts`) | o tipo novo lê identificador, tags e mapeamento do próprio formulário |
| `lib/rd-marketing.ts` | corpo da conversão com os campos mapeados, `job_title`, `cf_` do formulário e base legal pela caixa de consentimento |
| Chamada externa `POST https://api.rd.services/platform/conversions` | mesmo endpoint e contrato |

---

## 8. Impacto no Design

### 8.1 Componentes Existentes Reutilizados

| Componente | Onde | Variante |
|---|---|---|
| Campos e botão dos formulários atuais (`contato-com-foto`, `bloco-contato`) | seção "Formulário" | mesmos estilos de campo, foco e erro, nos dois temas |
| `Formulario` (casca cliente: carimbo, UTM, estado de envio) | seção "Formulário" | generalizada para o formulário do admin |
| Cabeçalho de seção (título e texto) e `camposComuns` (fundo, borda, âncora) | seção "Formulário" | os de qualquer bloco |

### 8.2 Componentes Novos Necessários

| Componente | Descrição | Onde aparece |
|---|---|---|
| Seção "Formulário" | título, texto e o formulário, sozinho centralizado ou com o texto ao lado | páginas montadas por blocos |
| Campo de lista de opções e caixa de marcar | os dois tipos que o site ainda não desenha | dentro da seção |

### 8.3 Tokens / Padrões Visuais

Os do DESIGN.md: raio de 6px, sem borda em caixa, campo com 16px no celular (D-65), contraste medido nos dois temas.

---

## 9. Dependências e Riscos

### 9.1 Dependências

| Tipo | Dependência | Status | Impacto se bloqueada |
|---|---|---|---|
| Feature | `rd-station-formularios` (envio ao RD, tags, aviso só quando o RD falha) | código mesclado; prova na homologação pendente (tarefa 047) | médio: o criador funciona, mas o RD só se prova junto |
| Infra | `RDSTATION_MARKETING_API_KEY` e `RESEND_API_KEY` em produção | pendente (Léo) | alto para o RD e o aviso; o formulário grava mesmo sem elas |
| Negócio | automação de agradecimento e aviso no RD para cada identificador novo | do marketing, por formulário | médio: sem ela o lead chega ao RD, mas ninguém recebe e-mail do RD |
| Conteúdo | aviso de privacidade e texto do consentimento (P-14) | pendente | médio: formulário sem aviso coleta dado sem a base explicada |
| Decisão | campos v1: básicos + lista de opções + caixa de marcar | **decidida em 20/10** | — |
| Decisão | depois do envio: mensagem ou outra página | **decidida em 20/10** | — |
| Decisão | aviso ao time igual aos formulários atuais | **decidida em 20/10** | — |

### 9.2 Riscos

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Campo personalizado digitado com nome que não existe no RD faz o RD recusar o lead inteiro | Médio | Média | `cf_` só com a chave geral ligada; a recusa aparece em `rd.error` com o nome do campo; o site avisa o time |
| Editor cria campo para dado sensível (CPF, saúde) | Alto | Baixa | descrição no admin dizendo o que não pedir; nenhum tipo de campo para documento ou anexo |
| Formulário novo vira alvo de spam | Médio | Média | o mesmo anti-spam e o limite por IP dos atuais |
| Identificador repetido entre formulários mistura leads no RD | Baixo | Média | permitido de propósito (dois formulários podem ser a mesma conversão); a lista em Integrações mostra a repetição |
| Bloco e collection novos quebram migração antiga em banco novo | Alto | Alta se esquecido | migração antecipada, testada com `pnpm migrate` em banco zerado |
| Consentimento declarado sem texto aprovado pelo jurídico | Médio | Média | a caixa de consentimento só declara a base legal com o texto preenchido; o texto é do jurídico (P-14) |

---

## 10. Critérios de Aceite

- [ ] Um editor cria um formulário com os nove tipos de campo, publica, põe numa página com a seção "Formulário" e vê no preview; a página publicada mostra o formulário nos dois temas, a 1280 e a 390 px.
- [ ] O identificador do RD vem sugerido a partir do nome, pode ser trocado e segue a validação de Sistema → Integrações.
- [ ] Todo formulário tem o campo de e-mail, obrigatório; não há como removê-lo.
- [ ] Envio com obrigatório vazio, e-mail inválido ou opção fora da lista é recusado no servidor, com mensagem no formulário e nada gravado, também com JavaScript desligado.
- [ ] Envio válido grava em `form-submissions` com o tipo "Formulário do admin", o formulário, nome, e-mail, telefone e empresa nas colunas de sempre, as outras respostas legíveis, a página de origem e a UTM.
- [ ] Com a integração ligada, a chave no servidor e o identificador preenchido, a conversão chega ao RD com o identificador e as tags do formulário, os campos padrão e os `cf_` mapeados (estes só com a chave de campos personalizados ligada).
- [ ] Com a caixa de consentimento marcada, a conversão leva `legal_bases` de consentimento e `available_for_mailing`; desmarcada, não leva.
- [ ] RD aceitou → o site não manda aviso; RD não aceitou → o site manda o aviso aos endereços do formulário (vazio: o destino geral de contato) e marca `notified`.
- [ ] Depois do envio, o visitante vê a mensagem configurada ou vai para a página escolhida.
- [ ] Formulário despublicado ou apagado: a seção some do site e um envio antigo é recusado sem gravar.
- [ ] Sistema → Integrações lista os formulários do admin com nome, identificador e tags.
- [ ] O seletor de seções mostra "Formulário" com miniatura.
- [ ] Os formulários existentes continuam exatamente como estão (testes atuais passando).
- [ ] Testes unitários da validação do envio, do corpo da conversão e da regra do aviso; migrações rodam em banco zerado e sem diferença depois.

---

## 11. Fases de Implementação

### Fase 1 — essencial
- [ ] Collection "Formulários" e a gravação do tipo novo em `form-submissions`
- [ ] Seção "Formulário" com os nove tipos de campo, validação no servidor e o depois do envio
- [ ] RD: identificador, tags, mapeamento de campos e consentimento; aviso igual aos atuais

### Fase 2 — acabamento
- [ ] Lista em Sistema → Integrações e filtro por formulário em Envios
- [ ] Miniatura no seletor de seções, guia do editor e decisão em `decisoes.md`
- [ ] Teste com o marketing: criar e publicar um formulário sem ajuda

---

**Referências:**
- `.ksdd/specs/SPEC.md` — seções 2 (personas), 4 (modelo de dados), 6 (permissões), 8 (blocos), 13.2 (lead por formulário)
- `.ksdd/specs/architecture.md` — Server Actions, `form-submissions`, integrações
- `.ksdd/features/FEATURE-rd-station-formularios.md` — envio ao RD, tags, aviso só quando o RD falha
- `.ksdd/features/FEATURE-seletor-de-secoes.md` — miniaturas do seletor
- `docs/00-contexto/decisoes.md` — D-22 (conteúdo), D-26 (UTM), D-29 e D-54 (RD), D-62 (Trabalhe Conosco), D-64 (newsletter), D-65 (escala de letras)
- `docs/00-contexto/pendencias.md` — P-14 (aviso de consentimento)
