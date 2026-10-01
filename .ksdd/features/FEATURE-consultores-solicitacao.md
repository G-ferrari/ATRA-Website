# Feature: Solicitação de consultores em /consultores

> Transforma `/consultores` de catálogo com filtro de uma tag por vez num funil de captação: o gestor marca os perfis que precisa, diz quantas pessoas de cada, e o pedido chega à ATRA como lead — hoje não chega nada.

**Slug:** consultores-solicitacao
**Prioridade:** Alta
**Status:** Rascunho
**Data:** 20/09/2026
**Projeto:** ATRA — site institucional (migração Next.js 16 + Payload CMS 3)

---

## 1. Motivação

### 1.1 Problema / Oportunidade

Feedback recebido em **20/09/2026** (cinco prints de WhatsApp da conversa com **Karen Falco Arra** + um áudio de 3'12" de briefing) aponta a mesma falha por três ângulos: o filtro de `/consultores` não deixa o visitante descrever o que precisa, e nada do que ele seleciona chega à ATRA.

> *"neste filtro, poderia ter uma função (OU) […] aí estas infos vão pra nossas mensagens"*
> *"no fim a gente busca receber um contato sistêmico com o que foi selecionado pelo usuário"*
> *"vale ter também um botão do tipo: 'Não encontrou um consultor nesta lista? clique aqui e solicite que vamos encontrar um candidato ideal para você'"*

A auditoria do código confirma e agrava o diagnóstico:

| Percepção no feedback | O que o código faz |
|---|---|
| "marca tudo o que ele quer" | **Falso.** O filtro é *single-select*: `setEspecialidade(e)` substitui a tag anterior (`lista-de-consultores.tsx:135`). Não é "E" nem "OU" — é "só um" |
| "estas infos vão pra nossas mensagens" | **Não vão.** "Solicitar" e "Solicitar este Profissional" são `<Link href="/contato">` — vão para o contato genérico **sem levar perfil nem tags** (`:301`, `:428`) |
| — | O formulário da própria página está **morto**: campos `disabled`, `<form>` sem `action` (`solicitar-consultores.tsx:110`) |

⚠️ **`/consultores` é a última página do site com formulário morto.** Contato, newsletter, banco de talentos, download e diagnóstico RC18 foram ligados em MIG-100/101/102/104 e sincronizam com o RD Station CRM desde D-29. O comentário em `contato-com-foto.tsx:14` registra a irmandade esquecida: *"É irmã de `consultores/solicitar-consultores.tsx` […] O formulário **envia** desde MIG-100."* A página de maior intenção comercial do site é a única que não captura nada — defeito independente de qualquer decisão de UX.

#### O dado que encerra o debate "E × OU"

A página **não lista pessoas — lista 8 arquétipos de perfil** (`SpecialistRoles`, SPEC §4.2: *"perfis de cargo, **não pessoas**"*), com 36 tags no total. Rodando os exemplos do próprio feedback contra os dados semeados (`scripts/seed/consultores.ts:23-96`):

| Exemplo citado no feedback | Com **E** | Com **OU** |
|---|---|---|
| "GCP, FinOps e PySpark" | **0 perfis** | 4 perfis |
| "AWS e GCP" (Karen) | 2 perfis | 5 perfis |
| "Looker, GCP, Data Lake, BigQuery" | **0 perfis** | 4 perfis |

Os zeros da coluna "E" são o resultado de interseção pura — e são a razão de o modo "E" **não** ser implementado como corte seco: ver §2.1 (ordenação por cobertura). Com 8 arquétipos, "E" a partir de três tags quase sempre devolve vazio. É literalmente o *"do jeito atual não atende 100% nem no formato E nem OU"* do feedback: o problema não é o operador — é que **o usuário tenta descrever um time dentro de um catálogo de 8 arquétipos**.

Daí o eixo da feature: **separar navegar de pedir.** O filtro é navegação sobre 8 cards; o pedido é uma lista de perfis escolhidos, cada um com quantidade. O "E" verdadeiro já mora no card, que representa alguém que domina aquele conjunto de tecnologias.

#### A premissa de produto (ratificada)

O áudio recusa o modelo self-service que a conversa com a Karen desenhava (*"uma estrutura para um perfil de cada vez […] o sistema responde individualmente"*), com argumento de processo, não de tela:

> *"sempre vai precisar montar uma proposta comercial […] depois a gente vai entrar em contato, vai fazer uma reunião pra bater se essas informações estão certas — por isso que na minha percepção não poderia ter essa, entre aspas, burocracia nesse momento do site […] pra mim é só um chamariz."*

Se a reunião comercial acontece de qualquer forma, detalhar no site é atrito antes da conversão. O áudio pedia que isso fosse *"discutido executivamente"*. ✅ **A ratificação foi obtida em 20/09/2026** — o modelo "chamariz" é o escolhido, e o modelo self-service da conversa com a Karen sai de cena (§2.3). O que resta dele fica registrado em §2.2 como candidato a v2, não como alternativa em aberto.

Conecta com o problema-raiz do projeto: o site é motor de **geração de leads B2B** (SPEC §12), e `/consultores` é um dos touchpoints de conversão (SPEC §9) que hoje termina em beco sem saída.

### 1.2 Personas Impactadas

- **Ricardo — Decisor B2B (SPEC §2.2):** é o alvo direto. Gerente/diretor de dados de empresa regulada que precisa de reforço de time. Hoje consegue filtrar por **uma** tecnologia e, ao clicar em "Solicitar", cai num formulário genérico que não sabe o que ele estava olhando. Passa a marcar os perfis que precisa, dizer quantas pessoas de cada, e enviar — com o contexto junto. A frustração da SPEC (*"formulário que não envia"*, §1.1) é exatamente esta página.
- **Marina — Editora de Marketing (SPEC §2.1):** impacto indireto e positivo. As tags do filtro já saem de `specialist-roles` (`lista-de-consultores.tsx:129`), então acrescentar um perfil no CMS passa a acrescentar também uma opção de pedido — sem dev, como o resto do site.
- **Admin do CMS (SPEC §6):** passa a ver os pedidos em `FormSubmissions` com um `kind` próprio, sincronizados no RD Station CRM como qualquer lead comercial (D-29).
- **Equipe comercial da ATRA (fora do SPEC, operacional):** recebe por e-mail o recorte legível — quais perfis, quantas pessoas, duração estimada — em vez de um "fale conosco" sem contexto. É o *"contato sistêmico"* pedido no feedback.

### 1.3 Métricas de Sucesso

| Métrica | Meta | Prazo |
|---------|------|-------|
| Pedido com perfis selecionados grava + notifica + sincroniza | 100% das submissões válidas em `FormSubmissions`; kind comercial no CRM | v1 |
| `/consultores` deixa de ser a única rota com formulário morto | 0 formulários estáticos no site | v1 |
| Combinação de filtro que hoje zera passa a devolver resultado | Os 3 exemplos do feedback devolvem ≥ 1 perfil em OU | v1 |
| Leads originados em `/consultores` | `[a definir — depende de baseline P-19/GA4]` (SPEC §15) | pós-cutover |
| Reuniões comerciais que começam com perfis já conhecidos | `[a medir com o comercial]` | pós-cutover |

---

## 2. Escopo

### 2.1 O que entra (v1)

- **Filtro multi-seleção** de tags e de senioridade, com **alternador `OU | E`** visível e **contador de resultados** ao vivo. "Todos"/"Todas" continua limpando a dimensão.
- **Modo "E" por ordenação de cobertura, não por corte seco.** Os perfis que cobrem **todas** as tags marcadas vão ao topo; os que cobrem parte aparecem logo abaixo, com selo **"cobre 2 de 3"** e a chamada de **combinar dois perfis**. ⚠️ **O modo "E" nunca esvazia a lista sozinho** — com 8 arquétipos, exigir três tags zeraria a maioria das combinações, e um beco sem saída no meio do funil é pior que um resultado parcial. É também o que empurra o visitante para o comportamento certo: quando nenhum perfil cobre tudo, a resposta é **pedir dois perfis**, que é exatamente o *"preciso de 1 de cada"* da Karen.
- **Lista cumulativa "Minha solicitação"** — o botão "Solicitar" do card e o "Solicitar este Profissional" do modal passam a **adicionar o perfil à lista**, em vez de navegar para `/contato`. Painel com os perfis escolhidos, remoção individual e botão de enviar.
- ~~**Quantidade de pessoas por perfil** (stepper, padrão 1) dentro da lista.~~ *Removida na task 020 (22/09).*
- **CTA "Não encontrou um consultor nesta lista?"** — no estado vazio do filtro e ao fim da lista de perfis; abre a solicitação **sem nenhum perfil marcado**, com campo livre "descreva o perfil que você procura".
- **Envio vivo:** `solicitar-consultores.tsx` deixa de ser estático, recebe os perfis escolhidos e grava lead com **novo `kind: consultant-request`** → e-mail de aviso → RD Station CRM (kind comercial, D-29). Contato pedido: **nome, e-mail, telefone** e descrição. *(A empresa e a duração estimada saíram na task 020 — 22/09.)*
- **Ajustes de UI** guiados pelo Impeccable (D-31) para reduzir cliques, com **regravação de gabarito justificada no PR**.
- **Testes:** e2e do filtro em OU e em E, do acúmulo na lista, do envio; `pnpm gate --baseline` regravado.
- **PT-BR e EN** nos rótulos de UI (a página já é bilíngue — `TEXTOS` em ambos os arquivos).

### Revisão de 21/09

Pedidos de G-ferrari depois da primeira rodada, registrados como tasks 017 e 018:

- **Chamada "Não encontrou…" junto dos diferenciais** (017): sai do fim da grade e entra num componente com a seção "Por que os maiores players…", em visual de destaque. Continua no estado vazio do filtro.
- **Aba de pedido** (018): o painel "Minha solicitação" e o formulário da seção final viram **uma aba**, como carrinho — sobe de baixo no celular, desliza da direita no computador. Abre expandida no primeiro "adicionar", minimiza numa barra de resumo e expande de novo. A seção final fica com título, subtítulo e contatos, e um botão que abre a aba.
- Fora das tasks: as promessas de **48h** saíram dos cards, do modal e do herói (PR #26).

### Revisão de 22/09

- **Tags recolhíveis** (019): o filtro de especialidades e as tecnologias dos cards recolhem numa tag "+N", que abre e fecha.
- **Pedido enxuto** (020), olhando a aba pronta: sai a **quantidade de pessoas por perfil** — cada perfil entra uma vez, e quantas pessoas de cada vira conversa comercial —, o "X" vira lixeira, o formulário fica com **nome, e-mail, telefone e descrição (opcional)**, o botão passa a "Enviar solicitação" e a confirmação ocupa a aba. Saem, com os campos, o modelo de alocação e a duração estimada.

### 2.2 O que fica pra depois

- **Campo estruturado dos perfis pedidos** no admin (array `requestedProfiles` com perfil + quantidade). v1 grava resumo legível em `message`, como o `rc18-diagnostic` faz com os 11 pilares — zero coluna nova além do valor de enum. Vira campo próprio se o comercial pedir filtro/relatório por perfil.
- **Duração e detalhe por perfil** (em vez de um campo único) — pedido em 10:17, deslocado pelo áudio para a conversa comercial. Volta se a ratificação executiva escolher o modelo estruturado.
- **Persistência da lista entre visitas** (`sessionStorage`) — v1 mantém a lista só na sessão da página.
- **Campos "Entregáveis" e "Escopo de Responsabilidade"** no modal — dívida pré-existente (`docs/01-descoberta/debito-tecnico.md:216`), exige dois `array` no schema e conteúdo para os 8 perfis.

### 2.3 O que NÃO é essa feature

- **Resposta automática com proposta** (*"o sistema responde individualmente"*, *"recebe um e-mail já com a proposta só pra ele assinar"*) — é o modelo self-service que o áudio recusa explicitamente. Não há motor de precificação, nem deve haver nesta v1.
- **Perfis de pessoas reais, disponibilidade ou agenda** — `SpecialistRoles` é catálogo de **arquétipos** (SPEC §4.2), não de profissionais. Nada nesta feature sugere ao visitante que ele está reservando uma pessoa específica.
- **Alterar a barra de números do herói, a seção de diferenciais ou o painel de contatos** — ficam como estão, sob gabarito. *Revisto em 21/09: o herói perdeu o "< 48h" e a seção de diferenciais recebe a chamada "Não encontrou…" (017), ambos a pedido do dono via G-ferrari. O painel de contatos segue intocado.*
- **Mexer em texto institucional da página** — rótulos de UI sim; cópia editorial é decisão do marketing (D-22). A cópia do CTA "Não encontrou…" veio do dono no próprio feedback, e por isso está autorizada.
- **Tornar `/consultores` uma rota de conteúdo real fora do gate** — o catálogo continua com 8 arquétipos comparáveis ao gabarito; o caminho é regravar (D-31), não remover do gate.

---

## 3. User Stories

| # | Como... | Quero... | Para... |
|---|---------|----------|---------|
| US-01 | Ricardo (decisor B2B) | marcar várias tecnologias de uma vez no filtro | achar os perfis que cobrem o que meu projeto precisa, sem refazer a busca a cada clique |
| US-02 | Ricardo | alternar entre "qualquer uma destas" e "todas estas" | distinguir "preciso de 1 de cada" de "preciso de alguém que acumule as duas" |
| US-03 | Ricardo | juntar os perfis que me interessam numa lista e dizer quantas pessoas de cada | pedir um time de uma vez, em vez de abrir três conversas |
| US-04 | Ricardo | enviar o pedido com meu nome, e-mail e telefone | ser procurado pela ATRA sem ter que detalhar tudo antes de falar com alguém |
| US-05 | Ricardo | pedir um perfil que não está no catálogo | não sair de mãos vazias quando nenhum dos 8 arquétipos descreve o que preciso |
| US-06 | Equipe comercial | receber por e-mail quais perfis e quantas pessoas foram pedidos | entrar na reunião já sabendo do que se trata |
| US-07 | Admin do CMS | ver o pedido em `FormSubmissions` com origem própria e sincronizado no CRM | tratar o lead como qualquer outro lead comercial |
| US-08 | Marina (marketing) | acrescentar um perfil no CMS | que ele apareça no filtro e possa ser pedido, sem chamar dev |

---

## 4. Fluxos de Uso

### 4.1 Do filtro ao pedido (fluxo principal)

**Pré-condição:** `specialist-roles` publicados (8 hoje); visitante em `/consultores`.
**Trigger:** visitante quer reforçar o time e chega à página.

1. Vê os 8 perfis e a barra de filtros com o alternador em **OU** (padrão).
2. Marca as tecnologias que interessam (ex.: `GCP`, `FinOps`, `PySpark`) — a lista reage e o **contador** mostra quantos perfis restam.
3. (Opcional) Troca para **E** ("todas estas"): os perfis que cobrem tudo sobem ao topo e os parciais ficam logo abaixo, com selo **"cobre 2 de 3"** e a chamada de combinar dois perfis. O contador diz quantos cobrem tudo. A lista **não** esvazia.
4. (Opcional) Abre "Detalhes" de um perfil e lê certificações e tecnologias.
5. Clica **"Solicitar"** no card (ou no modal) → o perfil entra em **"Minha solicitação"**; o botão do card passa a indicar que já está na lista.
6. Ajusta a **quantidade** de pessoas de cada perfil na lista; pode remover itens.
7. Clica em enviar → desce para a seção de solicitação, já com os perfis resumidos à vista.
8. Preenche **nome, e-mail, telefone** (empresa e duração em meses opcionais) e envia.

**Sucesso:** mensagem de confirmação inline (padrão `Formulario`, SPEC §11); lead gravado em `FormSubmissions` com `kind: consultant-request`, resumo legível dos perfis e quantidades em `message`, `source` e UTM; e-mail disparado; CRM sincronizado.
**Erro / edge case:** e-mail inválido → mensagem no campo, nada gravado. Robô (honeypot/carimbo) → **sucesso falso**, nada gravado. Falha de e-mail ou de CRM → **a gravação permanece** e `crm.syncedAt` vazio denuncia no admin (contrato de `architecture.md` §4). Sem JS → o `<form>` funciona por Server Action, mas a lista de perfis é ilha cliente: ver §9.2.

### 4.2 "Não encontrou um consultor nesta lista?" (fluxo alternativo)

**Pré-condição:** filtro devolveu vazio, ou o visitante chegou ao fim da lista sem se identificar com nenhum arquétipo.
**Trigger:** clique no CTA.

1. O CTA leva à seção de solicitação **sem nenhum perfil marcado**.
2. O campo livre "descreva o perfil que você procura" fica em evidência.
3. Visitante descreve, preenche o contato e envia.

**Sucesso:** mesmo lead, com `message` contendo só o texto livre e a nota de que nenhum perfil do catálogo foi selecionado.
**Erro / edge case:** envio sem perfis **e** sem texto livre → bloqueado com mensagem pedindo uma das duas coisas.

### 4.3 Envio antes de P-14 (produção)

**Pré-condição:** política de privacidade não publicada.
**Comportamento:** igual ao adotado em D-29/D-30 — em **homologação** o fluxo roda completo com o aviso de consentimento provisório; em **produção** o envio permanece desligado até P-14 ser respondida. O gate é de rollout, não de implementação.

---

## 5. Impacto em Telas Existentes

### 5.1 Telas Modificadas

| Tela (SPEC §7.7) | O que muda | Onde na tela | Por quê |
|---|---|---|---|
| `/consultores` — barra de filtros | Multi-seleção em tags e senioridade; alternador `OU \| E`; contador de resultados; resumo de filtros ativos passa a listar N valores | `lista-de-consultores.tsx:148-249` | US-01, US-02 — hoje é single-select |
| `/consultores` — card de perfil | "Solicitar" deixa de ser `<Link>` para `/contato` e vira botão que adiciona à lista, com estado "já na lista" | `lista-de-consultores.tsx:296-306` | US-03; o link atual perde o contexto do perfil |
| `/consultores` — modal de detalhe | "Solicitar este Profissional" adiciona à lista e fecha o modal | `lista-de-consultores.tsx:420-434` | coerência com o card |
| `/consultores` — estado vazio | Ganha o CTA "Não encontrou…" ao lado de "Resetar Filtros". ⚠️ Deixa de ser o destino normal do modo **E** (ver §2.1): sobra para busca textual sem casamento e para tag sem nenhum perfil | `lista-de-consultores.tsx:231-247` | US-05; o estado vazio já existe e é o gancho natural |
| `/consultores` — grade de perfis | Em modo **E**, separador entre "cobrem tudo" e "cobrem parte", com selo de cobertura por card | `lista-de-consultores.tsx:252-311` | §2.1 — nunca devolver vazio |
| `/consultores` — **nova** faixa "Minha solicitação" | Painel com perfis escolhidos, quantidade por perfil, remoção e botão de enviar | entre a lista de perfis e a seção de diferenciais | US-03 |
| `/consultores` — seção de solicitação | Deixa de ser estática: recebe os perfis escolhidos, ganha campo livre e campo de duração, e passa a enviar | `solicitar-consultores.tsx:110-168` | US-04, US-06 |
| `/consultores` — fim da lista | Segundo ponto do CTA "Não encontrou…" | após a grade de perfis | US-05 |

### 5.2 Telas Novas

Nenhuma. Toda a feature acontece dentro de `/consultores` — decisão deliberada: o áudio pede *"o mais simples possível"*, e uma rota nova de requisição seria a burocracia que ele recusa.

---

## 6. Impacto no Modelo de Dados

### 6.1 Novas Entidades

Nenhuma. `SpecialistRoles` já modela os perfis (SPEC §4.2) e `FormSubmissions` já modela o lead (§4.3).

### 6.2 Alterações em Entidades Existentes

| Entidade (SPEC §4.3) | Alteração | Migração |
|---|---|---|
| `FormSubmissions` | Novo valor no select `kind`: `consultant-request` (`collections/FormSubmissions.ts:53-66`) | **Sim** — fluxo D-21 completo: `generate:types` → `migrate:create add_consultant_request_kind` → conferir o `ALTER TABLE` → `migrate`. ⚠️ Migração **aditiva**; remover valor de enum vira pergunta interativa do drizzle, que não roda sem TTY |
| `FormSubmissions.message` | Passa a receber o resumo legível gerado (perfis + quantidade + duração) seguido do texto livre do visitante, dentro de `MAX_MENSAGEM=5000` | Não — campo existente |
| `FormSubmissions.phone` / `.company` | Passam a ser preenchidos por esta origem | Não — campos existentes |
| `SpecialistRoles` | **Nenhuma.** As tags que alimentam o filtro já existem (`tags`, array) | Não |

⚠️ **Estado do filtro e da lista não persistem no banco.** São estado de ilha cliente, como o filtro atual (`lista-de-consultores.tsx:123-126`). Só o que o visitante envia vira dado.

---

## 7. Impacto na API

### 7.1 Novos Endpoints

Nenhuma rota de API. Uma **Server Action**, seguindo o contrato de `architecture.md` §4 (*anti-spam → grava → avisa → sincroniza*, com aviso/CRM incapazes de derrubar a gravação):

```
web/src/actions/consultores.ts
  solicitarConsultores(FormData) → { ok: true } | { ok: false; erro: string }
```

Modelada em `web/src/actions/diagnostico-rc18.ts`: honeypot (`CAMPO_ISCA`) + carimbo via `conferir`, `excedeuPorIp(ipDe(cabecalhos))` (`lib/ip.ts` — nunca ler `x-forwarded-for` primeiro), corte de campos no servidor (`MAX_CAMPO=200`, `MAX_MENSAGEM=5000`), UTM por `MAX_POR_VALOR`, `enviarAviso` do `lib/email.ts`.

⚠️ **Os perfis pedidos são revalidados no servidor.** A Server Action é endpoint público (MIG-142): os slugs recebidos são conferidos contra `specialist-roles` e o resumo é montado a partir do que o banco diz, não do que o cliente mandou. Quantidade é limitada a um teto sensato por perfil.

### 7.2 Endpoints Modificados

| Local (`architecture.md` §4-5) | Alteração |
|---|---|
| `web/src/lib/crm.ts:63` | `consultant-request` entra em `KINDS_COMERCIAIS` — RH continua fora (D-29) |
| `web/src/lib/crm.ts:102` | Rótulo legível da origem para a negociação no RD Station CRM |
| `web/src/hooks/sincronizar-crm.ts` | Nenhuma mudança — o hook `afterChange` já cobre todo `kind` comercial |

---

## 8. Impacto no Design

### 8.1 Componentes Existentes Reutilizados

| Componente (DESIGN.md §Components) | Onde é usado na feature | Variante |
|---|---|---|
| Pílulas de filtro (`rounded-[4px]`, `px-2 py-0.5`) | tags e senioridade | existente, agora com estado **múltiplo selecionado** |
| `EmptyState` | estado vazio do filtro, com o CTA novo | existente |
| `SearchInput` | busca por cargo/tag/tecnologia | existente, sem mudança |
| `GlowCard` | cards de perfil | existente |
| `MetricChip` / `StatusBadge` | contador de resultados e selo "já na lista" | existente |
| `pill-btn-primary` / `pill-btn-outline` | enviar solicitação e CTA "Não encontrou…" | existentes |
| `Formulario` (`components/forms/formulario.tsx`) | casca cliente do envio (UTM, carimbo, `useActionState`, confirmação inline) | ⚠️ hoje tipa `kind` como `'contact' \| 'newsletter' \| 'talent-pool'` e chama `enviarFormulario` fixo — precisa aceitar a action nova, ou a seção usa `useActionState` direto, como faz `diagnostico-rc18/diagnostico.tsx` |

### 8.2 Componentes Novos Necessários

| Componente | Descrição | Variantes | Estados |
|---|---|---|---|
| Alternador `OU \| E` | dois segmentos exclusivos sobre a lista de tags | — | default, selecionado, hover, foco |
| Stepper de quantidade | −/+ com número, por perfil na lista | — | default, mínimo (1), máximo (teto), disabled |
| Painel "Minha solicitação" | lista de perfis escolhidos + quantidade + remover + enviar | fixo no fluxo; considerar barra fixa no mobile | vazio, com itens, enviando |
| Aba de pedido (018, substitui o painel acima e o formulário em fluxo) | carrinho + formulário numa aba | de baixo (celular), lateral (computador) | oculta, expandida, minimizada, enviando, enviada |
| Chamada sob medida (017) | "Não encontrou…" em destaque, dentro da seção de diferenciais | destaque (seção), discreta (estado vazio) | default, hover, foco |
| Selo de cobertura | "cobre 2 de 3" no card, só em modo **E** com cobertura parcial | — | completo (some), parcial, nenhum (some) |

⚠️ Nenhum bloco de CMS novo (DESIGN.md §Do's and Don'ts: *bloco novo exige justificativa no PR*). Tudo vive na ilha cliente de `/consultores`.

### 8.3 Tokens / Padrões Visuais

Sem token novo. Restrições do DESIGN.md que a implementação herda:

- **Cor sempre em par claro/escuro, valor escuro por último** (`text-slate-900 dark:text-white`) — é o que o gabarito escuro compara, e `e2e/contraste.spec.ts` mede os dois temas.
- **`rounded-[6px]`** como raio padrão; pílulas de filtro em `rounded-[4px]`, como as atuais.
- **Nada de `bg-gradient-to-*`** — Tailwind 4 usa `bg-linear-to-*`; o nome antigo não gera `background-image` e some no tema claro.
- **`cn()` / tailwind-merge:** tamanho antes de `leading-*`, senão o `leading` é descartado.
- **Sem `antialiased`** nem propriedade tipográfica ausente no legado (D-25).

---

## 9. Dependências e Riscos

### 9.1 Dependências

| Tipo | Dependência | Status | Impacto se bloqueada |
|---|---|---|---|
| Negócio | **Ratificação executiva do modelo "chamariz"** | ✅ **Ratificada em 20/09/2026** | — (resolvida; o modelo self-service sai de cena) |
| Negócio | **P-14** — política de privacidade publicada (`docs/00-contexto/pendencias.md:41`) | Pendente | **Alto para produção, nenhum para homologação.** Mesmo gate de D-29/D-30 |
| Técnica | `RESEND_API_KEY` e `RDSTATION_CRM_TOKEN` no ambiente | Homologação sim; produção espera P-14 | Baixo — sem token o lead grava e `crm.syncedAt` vazio denuncia no admin |
| Técnica | **Gabarito visual** — `/consultores` está em `ROTAS_COM_GABARITO` (`web/e2e/support/rotas.ts:24`) | Ativo | **Alto se ignorado.** D-31 libera a melhoria **exigindo** `pnpm gate --baseline` com justificativa no PR |
| Técnica | Gate do CI **desligado desde 26/08** por decisão do Leonardo | Ativo | Médio — `pnpm gate` local é o aceite visual; religar antes de produção é pré-requisito do runbook de cutover |
| Feature | Nenhuma. Independente de `FEATURE-rc18` e `FEATURE-area-restrita` | — | — |

### 9.2 Riscos

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Regravar o gabarito apaga evidência de regressão no resto da página | Alto | Alta | Regravar **depois** de a UI estar fechada, não durante a iteração; justificar no PR; `pnpm gate --rota consultores --viewport desktop` para iterar. ⚠️ `--baseline` não reescreve o que passou dentro da tolerância — ver um subconjunto mudar é esperado |
| Lista de perfis é ilha cliente: sem JS, o visitante não consegue montar o pedido | Médio | Baixa | O `<form>` continua funcionando por Server Action (SPEC §11): sem JS a pessoa envia o pedido pelo campo livre. Degradação explícita, não silenciosa |
| Filtro em **E** devolvendo vazio vira beco sem saída | Médio | **Baixa após a mitigação de §2.1** (seria Alta com corte seco) | Modo E ordena por cobertura em vez de cortar: parciais aparecem com selo "cobre 2 de 3" e chamada de combinar dois perfis. O estado vazio sobra só para busca textual sem casamento |
| Ordenação por cobertura confunde ("marquei E e apareceu quem não tem tudo") | Baixo | Média | Separador explícito entre "cobrem tudo" e "cobrem parte"; o selo diz a fração; o contador conta só os completos |
| Enum `kind` migrado errado: vários blocos têm campos de mesmo rótulo e o `replace` casa no lugar errado | Alto | Média | Conferir o `ALTER TABLE` da migração **antes** de aplicar; `migrate:down` desfaz só a última |
| Regra 4 violada: consulta sem filtro de rascunho | Médio | Baixa | `specialist-roles` é `isPublic` sem drafts; a consulta de `page.tsx:167` permanece como está |
| Texto novo de UI invadindo decisão de conteúdo (D-22) | Baixo | Média | Só rótulos funcionais; a cópia do CTA veio do dono no feedback de 20/09 |
| Teste e2e atual quebra: espera 8 `link` "Solicitar" (`e2e/smoke.spec.ts:366`) | Baixo | **Certa** — vira `button` | Atualizar o smoke **na mesma task que muda o CTA**, não antes: editado agora, o teste passa a falhar contra o código que ainda renderiza `<Link>` |

---

## 10. Critérios de Aceite

- [ ] Marcar `GCP`, `FinOps` e `PySpark` em **OU** devolve 4 perfis.
- [ ] Marcar as mesmas três em **E** **não esvazia a lista**: 0 perfis cobrem tudo, e FinOps & Cloud Cost Specialist e Cloud Architect aparecem com selo "cobre 2 de 3".
- [ ] Marcar `AWS` e `GCP` em **E** põe Cloud Architect e FinOps & Cloud Cost Specialist no topo como cobertura total (2 de 2).
- [ ] O contador em modo **E** conta os que cobrem tudo, e o separador entre "cobrem tudo" e "cobrem parte" só aparece quando há os dois grupos.
- [ ] O estado vazio só aparece quando a busca textual ou a senioridade não casa com nenhum perfil — nunca como resultado direto do modo **E**.
- [ ] O contador de resultados reflete a seleção a cada clique, sem recarregar.
- [ ] Senioridade também aceita múltipla seleção, e "Todos" limpa a dimensão.
- [ ] "Solicitar" no card adiciona o perfil a "Minha solicitação" e indica que já está lá; **não navega para `/contato`**.
- [ ] "Solicitar este Profissional" no modal adiciona e fecha o modal.
- [ ] Cada item da lista tem quantidade ajustável (mínimo 1, com teto) e pode ser removido.
- [ ] O CTA "Não encontrou um consultor nesta lista?" aparece no estado vazio e ao fim da lista, e leva à solicitação sem perfis marcados com o campo livre em evidência.
- [ ] Envio válido grava `FormSubmissions` com `kind: consultant-request`, contato, `source`, UTM e `message` contendo perfis + quantidades + duração + texto livre.
- [ ] Os perfis são **revalidados no servidor**: slug inexistente é descartado e o resumo sai do banco, não do cliente.
- [ ] Envio sem perfis **e** sem texto livre é recusado com mensagem clara.
- [ ] Honeypot/carimbo preenchidos → resposta de sucesso **sem gravar nada**.
- [ ] Falha de e-mail ou de CRM **não** derruba a gravação; `crm.syncedAt` vazio aparece no admin.
- [ ] `consultant-request` sincroniza no RD Station CRM como kind comercial.
- [ ] A migração do enum é aditiva e o `ALTER TABLE` foi conferido antes de aplicar.
- [ ] Nenhum componente importa `@/payload-types` (regra 3); a ilha continua recebendo `perfis` prontos (regra 4).
- [ ] Toda cor nova tem par claro/escuro, com o valor escuro por último; `e2e/contraste.spec.ts` passa nos dois temas.
- [ ] `pnpm lint`, `pnpm typecheck` e `pnpm test` passam.
- [ ] Smoke de `/consultores` atualizado (o "Solicitar" virou `button`) e novos e2e cobrem OU, E, acúmulo e envio.
- [ ] `pnpm gate --baseline` regravado **com justificativa no PR**, e o gate seguinte passa nos 3 viewports.
- [ ] Rótulos novos existem em PT e EN.

---

## 11. Fases de Implementação

### Fase 1 — O filtro faz o que o feedback pede
- [ ] Multi-seleção de tags e senioridade com alternador `OU | E` e contador
- [ ] Estado vazio com saída (voltar para OU / CTA "Não encontrou…")

### Fase 2 — Do catálogo ao pedido
- [ ] Lista cumulativa "Minha solicitação" com quantidade por perfil
- [ ] "Solicitar" do card e do modal passam a adicionar

### Fase 3 — O pedido chega à ATRA
- [ ] `kind: consultant-request` + migração D-21
- [ ] Server Action, e-mail de aviso, CRM; seção de solicitação deixa de ser estática

### Fase 4 — Acabamento e aceite
- [ ] Ajustes de UI guiados pelo Impeccable (D-31)
- [ ] e2e novos + smoke atualizado + `pnpm gate --baseline` com justificativa

---

**Referências:**
- `.ksdd/specs/SPEC.md` — §2.2 (Ricardo), §4.2-4.3 (SpecialistRoles, FormSubmissions), §7.7 (`/consultores`), §9 (touchpoints), §11 (interações), §12 (lead-gen), §13.2 (conversão por formulário)
- `.ksdd/specs/architecture.md` — §4 (Server Actions, contrato dos formulários), §5 (Resend, RD Station CRM), §7 (segurança), ADR-004 (regressão visual), ADR-009 (mappers)
- `.ksdd/specs/DESIGN.md` — §Components, §Do's and Don'ts
- `docs/00-contexto/decisoes.md` — D-15, D-21, D-22, D-26, D-29, D-31
- `docs/00-contexto/pendencias.md` — P-14
- `docs/01-descoberta/debito-tecnico.md:216-217` — modal sem Entregáveis/Escopo; formulário estático
- Feedback de 20/09/2026 — 5 prints de WhatsApp + áudio de 3'12" (briefing consolidado fora do repositório)
