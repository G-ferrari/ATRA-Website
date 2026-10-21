import type { CollectionConfig } from 'payload'

import { isAdmin, isEditorOrAdmin } from '@/access'
import { sincronizarComRd } from '@/hooks/sincronizar-rd'

/* Envios de formulário (MIG-100).
 *
 * ⚠️ **Dado pessoal.** Tudo aqui é submetido por um visitante e cai sob a LGPD:
 * a coleta só é legítima porque `/politicas-e-termos` está publicada (MIG-094,
 * P-14). Três consequências no schema:
 *
 *  - `create` fechado no admin. Quem grava é a Server Action, que roda com
 *    `overrideAccess`. Ninguém digita lead à mão, e ninguém grava por engano.
 *  - Sem IP e sem user-agent. Dá para justificar guardá-los contra fraude, mas
 *    ninguém pediu, e dado pessoal que não se guarda não vaza. O anti-spam usa
 *    o IP **em memória**, sem gravar.
 *  - `delete` só para admin: apagar é o exercício do direito de exclusão, e
 *    precisa ser rastreável a alguém.
 *
 * ⚠️ Isto **não** é a ferramenta de marketing, e agora se sabe qual é: **D-26**
 * respondeu P-18 com o RD Station CRM, e a **D-54** corrigiu para o RD Station
 * **Marketing** — é lá que os formulários da ATRA vivem. Esta collection é o
 * registro de passagem, e continua sendo a **primeira** escrita: grava aqui,
 * sincroniza depois. A sincronização é o hook `hooks/sincronizar-rd.ts`: sem
 * `RDSTATION_MARKETING_API_KEY` ela não roda, e o backup diário volta a ser a
 * única cópia — o RPO de 24h que P-22 questiona. Lead perdido não volta.
 */

/* Os campos do diagnóstico de maturidade só aparecem nos envios desse kind:
 * nos outros seriam um bloco vazio no meio do lead. */
const soDiagnosticoDeMaturidade = (data: Partial<{ kind: string }> | undefined) =>
  data?.kind === 'data-maturity-diagnostic'

const soBancoDeTalentos = (data: Partial<{ kind: string }> | undefined) => data?.kind === 'talent-pool'

const soFormularioDoAdmin = (data: Partial<{ kind: string }> | undefined) => data?.kind === 'custom-form'

/* Task 050 — o que o visitante enviou no formulário do admin é a prova do
 * consentimento que vai ao RD, e cada edição tenta o RD de novo. `readOnly` só
 * trava a tela: um `PATCH` na API ainda gravaria `communicationConsent: true` e
 * a mesma edição declararia ao RD um consentimento que ninguém deu. Negado aqui,
 * o Payload mantém o valor gravado. A action grava pelo `create` e a Local API
 * passa por cima (`overrideAccess`), então nada do site muda. */
const somenteNoEnvio = { update: () => false }

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'email',
    /* `form` (052): de qual formulário do admin veio — vazio nos outros tipos.
       O filtro por ele sai do próprio campo de relação. */
    defaultColumns: ['email', 'kind', 'form', 'status', 'createdAt'],
    listSearchableFields: ['email', 'name', 'company'],
    group: { pt: 'Sistema', en: 'System' },
    description: {
      pt: 'O que os visitantes enviaram pelos formulários. Dado pessoal: trate como tal.',
      en: 'What visitors submitted through the forms. Personal data — treat it as such.',
    },
  },
  labels: { singular: { pt: 'Envio', en: 'Submission' }, plural: { pt: 'Envios de formulário', en: 'Submissions' } },
  access: {
    read: isEditorOrAdmin,
    create: () => false,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  /* ⚠️ Fora do `comRevalidacao` central (lead não desenha página), então o
   * hook entra aqui mesmo — MIG-148. */
  hooks: { afterChange: [sincronizarComRd] },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        { value: 'contact', label: { pt: 'Contato', en: 'Contact' } },
        { value: 'chat-lead', label: { pt: 'Lead do chat', en: 'Chat lead' } },
        { value: 'newsletter', label: { pt: 'Newsletter', en: 'Newsletter' } },
        { value: 'talent-pool', label: { pt: 'Banco de talentos', en: 'Talent pool' } },
        { value: 'job-application', label: { pt: 'Candidatura', en: 'Job application' } },
        { value: 'material-download', label: { pt: 'Download de material', en: 'Material download' } },
        { value: 'rc18-diagnostic', label: { pt: 'Diagnóstico RC 18', en: 'RC 18 diagnostic' } },
        { value: 'consultant-request', label: { pt: 'Solicitação de consultores', en: 'Consultant request' } },
        { value: 'data-maturity-diagnostic', label: { pt: 'Diagnóstico de maturidade', en: 'Data maturity diagnostic' } },
        /* Criador de formulários (task 049): qualquer formulário montado em
           Conteúdo → Formulários. Qual deles está em `form`. */
        { value: 'custom-form', label: { pt: 'Formulário do admin', en: 'Admin form' } },
      ],
      /* D-35 — o diagnóstico de maturidade substitui o da RC 18, e
       * `rc18-diagnostic` sai das opções **sem sair do enum**: tirar o valor do
       * tipo do Postgres é migração destrutiva, e os envios antigos ficariam
       * sem origem legível.
       *
       * ⚠️ O filtro olha o valor **do próprio documento**, e não é só cosmético:
       * o Payload roda `filterOptions` também na validação do servidor, com o
       * documento já somado ao que está sendo gravado. Esconder sempre faria o
       * envio antigo recusar qualquer edição (até "marcar como lido") e a action
       * da RC 18, que ainda grava esse kind até a task 028, passar a falhar.
       * Assim a opção some do seletor do admin para quem não é RC 18, e o
       * servidor segue aceitando quem grava `rc18-diagnostic` por código. */
      filterOptions: ({ data, options }) =>
        data?.kind === 'rc18-diagnostic'
          ? options
          : options.filter((o) => (typeof o === 'string' ? o : o.value) !== 'rc18-diagnostic'),
      label: { pt: 'Origem', en: 'Kind' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { value: 'new', label: { pt: 'Novo', en: 'New' } },
        { value: 'read', label: { pt: 'Lido', en: 'Read' } },
        { value: 'archived', label: { pt: 'Arquivado', en: 'Archived' } },
      ],
      label: { pt: 'Situação', en: 'Status' },
      admin: { position: 'sidebar' },
    },
    { name: 'email', type: 'email', required: true, label: { pt: 'E-mail', en: 'Email' } },
    /* MIG-103 — a dupla confirmação da newsletter, que saiu na D-64 (16/10):
     * desde então a action carimba `confirmedAt` no envio. Vazio só fica em
     * inscrição antiga que nunca clicou no link, e essa **não** está na lista
     * nem vai ao RD. O token é o segredo dos links antigos de confirmação;
     * `hidden` porque não é dado editorial. */
    { name: 'confirmationToken', type: 'text', index: true, admin: { hidden: true } },
    {
      name: 'confirmedAt',
      type: 'date',
      label: { pt: 'Confirmado em', en: 'Confirmed at' },
      admin: {
        position: 'sidebar',
        description: {
          pt: 'Newsletter: preenchido no envio desde 16/10. Vazio só em inscrição antiga que nunca confirmou pelo e-mail: não conta como inscrito e não vai ao RD.',
          en: 'Newsletter: filled in on submission since 16/10. Empty only on old sign-ups that never confirmed by e-mail: not a subscriber, and not sent to RD.',
        },
      },
    },
    /* MIG-102 — candidatura: a vaga e o currículo. O CV mora em
     * `private-files`; daqui o RH abre pelo admin, autenticado. */
    { name: 'job', type: 'relationship', relationTo: 'jobs', label: { pt: 'Vaga', en: 'Job' } },
    { name: 'cv', type: 'relationship', relationTo: 'private-files', label: { pt: 'Currículo', en: 'CV' } },
    /* MIG-104 — download: qual material o lead pediu. */
    { name: 'resource', type: 'relationship', relationTo: 'resources', label: { pt: 'Material', en: 'Material' } },
    /* Task 049 — de qual formulário do admin veio. Dele saem o identificador e
       as tags do RD (050); apagado depois, o envio fica com o resto. */
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      label: { pt: 'Formulário', en: 'Form' },
      access: somenteNoEnvio,
      admin: { readOnly: true, position: 'sidebar', condition: soFormularioDoAdmin },
    },
    {
      /* As respostas do formulário do admin, com o rótulo de cada pergunta **no
         momento do envio** — reescrever o formulário depois não muda o que o
         lead respondeu. Nome, e-mail, telefone e empresa também ficam nas
         colunas de sempre (busca e lista do admin). `fieldId` é o id da linha
         no formulário: é por ele que a 050 acha o destino de cada resposta no
         RD. Somente leitura: é o que o visitante enviou. */
      name: 'answers',
      type: 'array',
      label: { pt: 'Respostas', en: 'Answers' },
      labels: { singular: { pt: 'Resposta', en: 'Answer' }, plural: { pt: 'Respostas', en: 'Answers' } },
      access: somenteNoEnvio,
      admin: {
        readOnly: true,
        condition: soFormularioDoAdmin,
        /* 052: a linha recolhida já é "Pergunta: resposta". Recolhidas de
           saída, o envio se lê como uma lista, na ordem do formulário. */
        initCollapsed: true,
        components: { RowLabel: '/components/admin/rotulo-da-resposta#RotuloDaResposta' },
      },
      fields: [
        { name: 'fieldId', type: 'text', admin: { hidden: true } },
        { name: 'label', type: 'text', label: { pt: 'Pergunta', en: 'Question' } },
        { name: 'value', type: 'textarea', label: { pt: 'Resposta', en: 'Answer' } },
      ],
    },
    {
      /* A caixa de consentimento do formulário do admin foi marcada: é o que a
         050 manda ao RD como base legal. Sem caixa no formulário, fica falso. */
      name: 'communicationConsent',
      type: 'checkbox',
      defaultValue: false,
      label: { pt: 'Aceitou receber comunicações', en: 'Agreed to receive communications' },
      access: somenteNoEnvio,
      admin: { readOnly: true, position: 'sidebar', condition: soFormularioDoAdmin },
    },
    { name: 'name', type: 'text', label: { pt: 'Nome', en: 'Name' } },
    { name: 'phone', type: 'text', label: { pt: 'Telefone', en: 'Phone' } },
    { name: 'company', type: 'text', label: { pt: 'Empresa', en: 'Company' } },
    { name: 'message', type: 'textarea', label: { pt: 'Mensagem', en: 'Message' } },
    {
      /* 15/10 (task 044, D-62) — o perfil do banco de talentos em campos
       * próprios. Até aqui LinkedIn, área e senioridade entravam só
       * serializados na mensagem (MIG-102), o que bastava para o admin e para
       * o aviso por e-mail. Com o Trabalhe Conosco indo ao RD, o RD precisa de
       * cada um no seu campo — e a mensagem, texto livre, **não** vai para a
       * base de marketing. A mensagem continua como está, para o admin e o
       * aviso não mudarem. Somente leitura: é o que o candidato enviou. */
      name: 'talent',
      type: 'group',
      label: { pt: 'Banco de talentos', en: 'Talent pool' },
      admin: { readOnly: true, condition: soBancoDeTalentos },
      fields: [
        { name: 'linkedin', type: 'text', label: { pt: 'LinkedIn', en: 'LinkedIn' } },
        { name: 'area', type: 'text', label: { pt: 'Área de atuação', en: 'Field' } },
        { name: 'seniority', type: 'text', label: { pt: 'Senioridade', en: 'Seniority' } },
        {
          /* D-62: o aviso de privacidade que o formulário mostrava quando a
           * pessoa se cadastrou (Sistema → Integrações), copiado no servidor
           * no momento da gravação. É o registro de que ela foi avisada de
           * que o cadastro iria ao RD — e o que libera o envio. Vazio: não
           * havia aviso, e o cadastro não vai ao RD. */
          name: 'privacyNotice',
          type: 'textarea',
          label: { pt: 'Aviso exibido no cadastro', en: 'Notice shown at sign-up' },
        },
      ],
    },
    {
      /* MIG-149 (D-29) — só o kind `chat-lead` preenche. O recorte de P-20:
       * as últimas mensagens **do visitante** na conversa com a ATRA AI, nada
       * do que o modelo respondeu. É o que o comercial precisa ("o que a
       * pessoa perguntou") e é texto que o titular digitou e enviou
       * conscientemente junto do formulário — a conversa em si continua sem
       * persistir. */
      name: 'chatContext',
      type: 'textarea',
      label: { pt: 'O que perguntou à ATRA AI', en: 'What they asked ATRA AI' },
      admin: { readOnly: true },
    },
    {
      /* D-35 — o resultado do diagnóstico de maturidade: a "visão dos
       * clientes" que o comercial lê aqui e no RD Station. Só o kind
       * `data-maturity-diagnostic` preenche (a action da task 025), sempre a
       * partir da conta refeita no servidor pelo motor
       * (`lib/diagnostico-maturidade`) — nunca do que o navegador mandou.
       *
       * Perfil, média e nível em colunas tipadas porque é por eles que se
       * filtra a lista no admin ("todos os de saúde no nível 2"). O que é
       * estrutura variável — pilares, áreas DAMA, gaps, respostas — vai em
       * JSON: a base de perguntas é versionada (`version`) e muda sem migração.
       *
       * ⚠️ Somente leitura: é a fotografia do que o lead respondeu. Editar à
       * mão desalinharia o registro do e-mail que ele recebeu. O `readOnly` do
       * grupo desce para cada campo. Sem IP e sem user-agent, como o resto da
       * collection (LGPD — ver o topo deste arquivo). */
      name: 'diagnostic',
      type: 'group',
      label: { pt: 'Diagnóstico de maturidade', en: 'Data maturity diagnostic' },
      admin: { readOnly: true, condition: soDiagnosticoDeMaturidade },
      fields: [
        /* Códigos do motor (`financeiro`, `ate_50mi`, `cio_cto_cdo`), não o
         * rótulo do HTML: o rótulo é texto do marketing e muda; o código é o
         * que se filtra e o que o motor reconhece. */
        { name: 'sector', type: 'text', label: { pt: 'Setor', en: 'Sector' } },
        { name: 'size', type: 'text', label: { pt: 'Porte (faturamento)', en: 'Size (revenue)' } },
        { name: 'role', type: 'text', label: { pt: 'Cargo', en: 'Role' } },
        { name: 'average', type: 'number', label: { pt: 'Média geral (1 a 5)', en: 'Overall average (1 to 5)' } },
        { name: 'level', type: 'text', label: { pt: 'Nível', en: 'Level' } },
        { name: 'pillars', type: 'json', label: { pt: 'Média por pilar', en: 'Average per pillar' } },
        { name: 'dama', type: 'json', label: { pt: 'Média por área DAMA-DMBOK', en: 'Average per DAMA-DMBOK area' } },
        {
          name: 'gaps',
          type: 'json',
          label: { pt: 'Gaps por regulação', en: 'Gaps per regulation' },
          admin: {
            description: {
              pt: 'Soma de (5 − nota) das respostas que tocam cada regulação: quanto maior, mais distante do nível otimizado.',
              en: 'Sum of (5 − score) over the answers tied to each regulation: the higher, the further from optimized.',
            },
          },
        },
        {
          /* No formato em que o questionário do Roger manda ao RD
           * (`cf_quiz_gaps_top3`): 'LGPD (12) | IA (9) | BCB (7)'. O campo
           * personalizado da conversão (`lib/rd-marketing.ts`) repete o texto
           * como está. */
          name: 'topGaps',
          type: 'textarea',
          label: { pt: 'Três maiores gaps', en: 'Top 3 gaps' },
        },
        {
          /* Uma entrada por pergunta respondida: id, pilar, nota, tags e o
           * texto da alternativa escolhida — legível sem abrir o HTML da
           * versão que o lead respondeu. */
          name: 'answers',
          type: 'json',
          label: { pt: 'Respostas', en: 'Answers' },
        },
        {
          name: 'roadmap',
          type: 'textarea',
          label: { pt: 'Roadmap sugerido', en: 'Suggested roadmap' },
        },
        { name: 'version', type: 'text', label: { pt: 'Versão do questionário', en: 'Questionnaire version' } },
        {
          name: 'durationSeconds',
          type: 'number',
          label: { pt: 'Tempo de resposta (segundos)', en: 'Time to answer (seconds)' },
        },
      ],
    },
    {
      /* O resultado só chega ao lead por e-mail (decisão de 26/09), então um
       * envio que falhou é um lead que respondeu tudo e não recebeu nada. A
       * action preenche isto **só** quando o envio deu certo — mesmo espírito
       * do `notified` e do `rd.syncedAt`: a falta fica visível no admin em vez
       * de virar silêncio. */
      name: 'resultSentAt',
      type: 'date',
      label: { pt: 'Resultado enviado em', en: 'Result sent at' },
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: soDiagnosticoDeMaturidade,
        description: {
          pt: 'Vazio = o lead não recebeu o resultado.',
          en: 'Empty = the lead did not receive the result.',
        },
      },
    },
    {
      /* De onde veio, para o marketing saber o que converte. Caminho e idioma
       * bastam: é dado do site, não do visitante. */
      name: 'source',
      type: 'text',
      label: { pt: 'Página de origem', en: 'Source page' },
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      /* Que campanha trouxe o visitante (D-26), para o RD Station saber qual
       * investimento pagou o lead.
       *
       * ⚠️ **Não é o `source` acima.** Aquele é *onde* a pessoa converteu — o
       * caminho da página. Este é *de onde ela veio*. São duas perguntas
       * diferentes e o RD precisa das duas para fechar a conta.
       *
       * `group` e não cinco campos soltos: no admin vira um bloco só, ao lado
       * do lead, e no Postgres vira `utm_source`, `utm_medium`… na mesma tabela.
       *
       * ⚠️ Vazio é o caso comum, não defeito: quem chegou por busca orgânica,
       * link direto ou com JavaScript desligado não tem campanha nenhuma. Ver
       * a nota do topo de `lib/utm.ts`. */
      name: 'utm',
      type: 'group',
      label: { pt: 'Campanha de origem', en: 'Campaign' },
      admin: { readOnly: true },
      fields: [
        { name: 'source', type: 'text', label: { pt: 'Origem (utm_source)', en: 'Source (utm_source)' } },
        { name: 'medium', type: 'text', label: { pt: 'Mídia (utm_medium)', en: 'Medium (utm_medium)' } },
        { name: 'campaign', type: 'text', label: { pt: 'Campanha (utm_campaign)', en: 'Campaign (utm_campaign)' } },
        { name: 'term', type: 'text', label: { pt: 'Termo (utm_term)', en: 'Term (utm_term)' } },
        { name: 'content', type: 'text', label: { pt: 'Conteúdo (utm_content)', en: 'Content (utm_content)' } },
      ],
    },
    {
      /* D-54 — o espelho da sincronização com o RD Station Marketing (sucede o
       * grupo `crm` de MIG-148).
       *
       * ⚠️ `syncedAt` **vazio é o sinal**: sem chave, ou depois de uma falha
       * (aí `error` diz qual — inclusive o campo `cf_` que o RD recusou), o
       * lead não está no RD — visível no admin em vez de silêncio. Qualquer
       * edição no doc (marcar como lido serve) dispara nova tentativa. */
      name: 'rd',
      type: 'group',
      label: { pt: 'RD Station Marketing', en: 'RD Station Marketing' },
      admin: { readOnly: true },
      fields: [
        { name: 'eventUuid', type: 'text', label: { pt: 'Conversão (event_uuid)', en: 'Conversion (event_uuid)' } },
        {
          name: 'syncedAt',
          type: 'date',
          label: { pt: 'Sincronizado em', en: 'Synced at' },
          admin: {
            description: {
              pt: 'Vazio significa que este lead ainda não chegou ao RD Station Marketing. Editar o envio (por exemplo, marcar como lido) tenta de novo.',
              en: 'Empty means this lead has not reached RD Station Marketing yet. Editing the submission (e.g. marking it read) retries.',
            },
          },
        },
        { name: 'error', type: 'textarea', label: { pt: 'Última falha', en: 'Last error' } },
      ],
    },
    {
      /* ⚠️ Marca que o e-mail de aviso **não** saiu. Sem isto, uma chave de
       * e-mail expirada viraria silêncio: o lead entra no banco, ninguém é
       * avisado, e a descoberta acontece quando alguém abre o admin por acaso. */
      name: 'notified',
      type: 'checkbox',
      defaultValue: false,
      label: { pt: 'Aviso por e-mail enviado', en: 'Notification email sent' },
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
