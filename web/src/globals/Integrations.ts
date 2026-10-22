import type { GlobalConfig } from 'payload'

import { isAdmin, isEditorOrAdmin } from '@/access'
import {
  CONVERSOES_PADRAO,
  ehEndpointDeIntegracao,
  ehIdentificadorDeConversao,
  ehTagDoRd,
  ENDPOINT_PADRAO_ATRAIR,
  normalizarNome,
  TAGS_PADRAO,
} from '@/lib/formatos-de-integracao'
import { CAMPOS_PERSONALIZADOS } from '@/lib/rd-marketing'

/* As chaves da integração com o ATRAIR (D-41), o sistema de R&S da ATRA.
 *
 * Até aqui quem decidia era o **ambiente**: `ATRAIR_API_URL` + `ATRAIR_API_KEY`
 * preenchidas ligavam a integração, vazias a desligavam, e mudar isso era
 * deploy. Pior: o desligamento era **implícito** — a grade de `/carreiras` caía
 * para a lista do CMS quando a lista do ATRAIR vinha vazia, e "integração
 * desligada", "ATRAIR fora do ar" e "nenhuma vaga aberta de verdade" eram o
 * mesmo estado para o site. Agora são três, e só o terceiro mostra a página
 * vazia. Mesmo precedente da D-40, que tirou os ids de rastreamento do ambiente.
 *
 * ⚠️ Só **admin** edita. O site manda a `ATRAIR_API_KEY` no cabeçalho para o
 * endereço deste campo — trocar o endereço é escolher para quem a chave de
 * servidor é entregue, e isso não é decisão de editor de conteúdo. O editor vê
 * os valores, não muda.
 *
 * ⚠️ **A chave de API continua no ambiente**, de propósito. Endpoint e
 * liga/desliga são configuração; `ATRAIR_API_KEY` é credencial, e credencial em
 * coluna do Postgres entra no backup diário e aparece no admin. As duas chaves
 * abaixo são, portanto, a **segunda** tranca: ligadas sem `ATRAIR_API_KEY` no
 * ambiente, a integração segue inerte. É o que faz esta migração não mudar o
 * que está no ar — daí `defaultValue: true` nas duas.
 *
 * Sem `localized`: endereço e liga/desliga são os mesmos nos dois idiomas, e o
 * site lê o global sem `locale`.
 */

/* Colar do painel costuma trazer espaço nas pontas; aparado antes de validar,
 * o que se grava é o endereço limpo. */
const aparar = ({ value }: { value?: unknown }) => (typeof value === 'string' ? value.trim() : value)

/* Nomes do RD (identificadores e tags): além de aparar, normaliza — ver
 * `normalizarNome`. As listas perdem as entradas vazias. */
const normalizar = ({ value }: { value?: unknown }) => (typeof value === 'string' ? normalizarNome(value) : value)
const normalizarLista = ({ value }: { value?: unknown }) =>
  Array.isArray(value)
    ? value.map((v) => (typeof v === 'string' ? normalizarNome(v) : v)).filter((v) => v !== '')
    : value

/* Os formulários que vão ao RD, na ordem do admin. A mesma lista monta os
 * identificadores e as tags, para os dois grupos não divergirem. */
const FORMULARIOS_DO_RD = [
  ['contact', 'Contato', 'Contact'],
  ['chatLead', 'Lead do chat (ATRA AI)', 'Chat lead (ATRA AI)'],
  ['newsletter', 'Newsletter', 'Newsletter'],
  ['materialDownload', 'Download de material', 'Material download'],
  ['consultantRequest', 'Solicitação de consultores', 'Consultant request'],
  ['dataMaturityDiagnostic', 'Diagnóstico de maturidade de dados', 'Data maturity diagnostic'],
  /* O Trabalhe Conosco esteve aqui da D-62 (15/10) à D-67 (22/10): cada
     inscrição gastava um lead do plano do RD. Saiu da lista, e as colunas dele
     só são apagadas numa publicação seguinte (ver a migração da D-67). */
] as const

/* Task 046: o download de e-book vai com o identificador de cada e-book, e o
 * campo daqui ficou com outro papel — o de liga/desliga. Sem dizer isso, o
 * marketing renomearia este campo e não veria o nome mudar no RD. */
const DESCRICAO_DO_DOWNLOAD = {
  pt: 'Cada e-book vai ao RD com o identificador dele (Conteúdo → Materiais → Identificador no RD) ou, se estiver vazio lá, como "ebook-" seguido do endereço. Este campo liga o envio dos downloads — vazio, nenhum vai — e só é usado como nome se o e-book não for encontrado.',
  en: 'Each ebook reaches RD with its own identifier (Content → Resources → RD identifier) or, when that is empty, as "ebook-" followed by its address. This field turns download sending on — empty, none go — and is only used as the name when the ebook cannot be found.',
}

export const Integrations: GlobalConfig = {
  slug: 'integrations',
  label: { pt: 'Integrações', en: 'Integrations' },
  admin: {
    group: { pt: 'Sistema', en: 'System' },
    description: {
      pt: 'Integrações com o ATRAIR (recrutamento) e com o RD Station Marketing (leads). Só administradores editam. As chaves de API ficam no servidor — sem elas, nada sincroniza mesmo ligado aqui.',
      en: 'ATRAIR (recruiting) and RD Station Marketing (leads) integrations. Admins only. The API keys live on the server — without them nothing syncs, even when enabled here.',
    },
  },
  /* Leitura só para quem está logado (15/10). Era pública, e `GET
   * /api/globals/integrations` mostrava a qualquer visitante o endereço do
   * ATRAIR e, com a task 043, as tags de segmentação do marketing. O site lê
   * pela Local API (`lib/integracoes.ts`, `hooks/sincronizar-rd.ts`), que
   * ignora o `access` — nada do site muda. */
  access: { read: isEditorOrAdmin, update: isAdmin },
  fields: [
    {
      name: 'atrair',
      type: 'group',
      label: { pt: 'ATRAIR (recrutamento)', en: 'ATRAIR (recruiting)' },
      fields: [
        {
          /* A chave que a missão pede: liga e desliga o carregamento dinâmico
           * das vagas. Desligada, `/carreiras` lista as vagas da collection
           * `jobs` — que é cadastro completo, com página própria em
           * `/carreiras/[slug]`, e não um espelho do ATRAIR. */
          name: 'jobsFeed',
          type: 'checkbox',
          defaultValue: true,
          label: { pt: 'Carregar vagas do ATRAIR', en: 'Load jobs from ATRAIR' },
          admin: {
            description: {
              pt: 'Ligado: a grade de /carreiras mostra as vagas publicadas no ATRAIR, e cada card leva para a vaga lá. Desligado: mostra as vagas cadastradas em Conteúdo → Vagas, com página própria no site.',
              en: 'On: the /careers grid lists the jobs published in ATRAIR, each card linking to the role there. Off: it lists the jobs registered under Content → Jobs, with their own page on the site.',
            },
          },
        },
        {
          /* Chave separada da de cima por decisão do dono: a ida do currículo e
           * a vinda das vagas quebram por motivos diferentes e se desligam em
           * momentos diferentes. Nada aqui muda o que o candidato vê — a
           * candidatura é gravada no admin antes de qualquer sincronização
           * (D-26), ligada ou desligada. */
          name: 'talentPool',
          type: 'checkbox',
          defaultValue: true,
          label: { pt: 'Enviar currículos para o ATRAIR', en: 'Send CVs to ATRAIR' },
          admin: {
            description: {
              pt: 'Ligado: quem se inscreve no Banco de Talentos é criado no ATRAIR (que deduplica por e-mail). Desligado: a inscrição fica só em Formulários, aqui no admin. Em nenhum dos casos o candidato vê erro.',
              en: 'On: Talent Pool sign-ups are created in ATRAIR (deduplicated by e-mail there). Off: the sign-up stays in Form Submissions here. Either way the candidate never sees an error.',
            },
          },
        },
        {
          name: 'endpoint',
          type: 'text',
          /* ⚠️ **Função, não literal.** `defaultValue: ENDPOINT_PADRAO_ATRAIR`
           * é assado pelo drizzle como `DEFAULT` da coluna, e o valor sai do
           * `ATRAIR_API_URL` de quem *gerou* a migração — o contêiner de dev.
           * A primeira tentativa produziu
           * `"atrair_endpoint" varchar DEFAULT 'http://host.docker.internal:3300'`
           * num arquivo versionado que roda no CI e em produção, congelando o
           * endereço de desenvolvimento como padrão de schema lá. Função o
           * drizzle não consegue assar: ela roda quando o documento nasce, no
           * ambiente certo. */
          defaultValue: () => ENDPOINT_PADRAO_ATRAIR,
          label: { pt: 'Endereço do ATRAIR', en: 'ATRAIR address' },
          admin: {
            placeholder: 'https://atrair.exemplo.com.br',
            description: {
              pt: 'A base da API do ATRAIR, sem a rota — o site acrescenta /api/public/vagas e /api/public/talent-pool. Já vem preenchido com o endereço deste ambiente; edite só se o ATRAIR mudar de endereço. Vazio: as duas chaves acima ficam inertes.',
              en: 'The base of the ATRAIR API, without the route — the site appends /api/public/vagas and /api/public/talent-pool. Pre-filled with this environment’s address; change it only if ATRAIR moves. Empty: both toggles above stay inert.',
            },
          },
          hooks: { beforeValidate: [aparar] },
          validate: (valor: string | null | undefined) =>
            !valor ||
            ehEndpointDeIntegracao(valor) ||
            'Use o endereço completo, com https:// e sem a rota (ex.: https://atrair.exemplo.com.br). http:// só é aceito para o ATRAIR local.',
        },
      ],
    },
    {
      /* D-54 — os leads dos formulários viram conversões no RD Station
       * Marketing. Mesmo arranjo do ATRAIR: liga/desliga e nomes são
       * configuração e moram aqui; `RDSTATION_MARKETING_API_KEY` é credencial
       * e fica no ambiente, como segunda tranca. */
      name: 'rdStationMarketing',
      type: 'group',
      label: { pt: 'RD Station Marketing (leads)', en: 'RD Station Marketing (leads)' },
      fields: [
        {
          /* 15/10: o marketing vê se a chave está no servidor sem depender de
           * ninguém. Campo `ui`: não tem coluna, não sai na API (o global é de
           * leitura pública) e o componente é de servidor — só o "configurada
           * / ausente" chega ao navegador, nunca a chave. */
          name: 'keyStatus',
          type: 'ui',
          admin: {
            components: { Field: '/components/admin/situacao-da-chave-rd#SituacaoDaChaveRd' },
          },
        },
        {
          name: 'enabled',
          type: 'checkbox',
          /* `true` por não mudar o que está no ar: sem a chave no ambiente a
           * integração segue inerte, e com a chave é para sincronizar mesmo. */
          defaultValue: true,
          label: { pt: 'Enviar leads para o RD Station Marketing', en: 'Send leads to RD Station Marketing' },
          admin: {
            description: {
              pt: 'Ligado: cada envio dos formulários abaixo vira uma conversão no RD (precisa da chave de API no servidor). Desligado: o lead fica só em Envios de formulário. O Trabalhe Conosco e a candidatura com currículo nunca vão: ficam só aqui no admin.',
              en: 'On: every submission of the forms below becomes a conversion in RD (needs the API key on the server). Off: the lead stays in Form submissions only. Work with us sign-ups and job applications with a CV never go: they stay here in the admin.',
            },
          },
        },
        {
          name: 'customFields',
          type: 'checkbox',
          /* ⚠️ Nasce desligado: `cf_` que não existe na conta derruba a
           * conversão inteira em 400. Primeiro se criam os campos no RD. */
          defaultValue: false,
          label: { pt: 'Enviar campos personalizados', en: 'Send custom fields' },
          admin: {
            description: {
              pt: `Só ligue depois de criar na conta do RD os campos personalizados com exatamente estes nomes: ${CAMPOS_PERSONALIZADOS.mensagem} (mensagem do contato), ${CAMPOS_PERSONALIZADOS.chat} (o que perguntou à ATRA AI) e, para o diagnóstico, ${CAMPOS_PERSONALIZADOS.diagnostico.join(', ')}. Campo inexistente faz o RD recusar o lead inteiro — a falha aparece em Envios de formulário.`,
              en: `Only enable after creating custom fields in the RD account with exactly these names: ${CAMPOS_PERSONALIZADOS.mensagem} (contact message), ${CAMPOS_PERSONALIZADOS.chat} (what they asked ATRA AI) and, for the diagnostic, ${CAMPOS_PERSONALIZADOS.diagnostico.join(', ')}. A missing field makes RD reject the whole lead — the failure shows under Form submissions.`,
            },
          },
        },
        {
          /* Um identificador por formulário. É o nome que o marketing vê nos
           * relatórios e usa nas automações — deles, por isso editável aqui.
           * Vazio = aquele formulário não vai ao RD. */
          name: 'conversions',
          type: 'group',
          label: { pt: 'Identificadores de conversão', en: 'Conversion identifiers' },
          admin: {
            description: {
              pt: 'O nome com que cada formulário aparece no RD — escreva exatamente como está lá, com espaço e acento se tiver: é por ele que as automações do RD disparam. Vazio: aquele formulário não é enviado.',
              en: 'The name each form shows up with in RD — type it exactly as it is there, spaces and accents included: RD automations fire on it. Empty: that form is not sent.',
            },
          },
          fields: FORMULARIOS_DO_RD.map(([name, pt, en]) => ({
            name,
            type: 'text' as const,
            defaultValue: CONVERSOES_PADRAO[name],
            label: { pt, en },
            ...(name === 'materialDownload' && { admin: { description: DESCRICAO_DO_DOWNLOAD } }),
            hooks: { beforeValidate: [normalizar] },
            validate: (valor: string | null | undefined) =>
              !valor ||
              ehIdentificadorDeConversao(valor) ||
              'Use o nome como está no RD, com até 100 caracteres, sem quebra de linha e sem < > { } " ` \\ (ex.: Formulário Home).',
          })),
        },
        {
          /* 15/10: as tags com que o lead chega ao RD. A newsletter nasce com
           * `newsletter` — é por ela que o marketing segmenta os envios. */
          name: 'tags',
          type: 'group',
          label: { pt: 'Tags', en: 'Tags' },
          admin: {
            description: {
              pt: 'As tags que o lead recebe no RD, por formulário. Digite e tecle Enter para cada uma; use os mesmos nomes do RD. Vazio: o lead chega sem tag.',
              en: 'The tags the lead gets in RD, per form. Type and press Enter for each; use the same names as in RD. Empty: the lead arrives untagged.',
            },
          },
          fields: FORMULARIOS_DO_RD.map(([name, pt, en]) => ({
            name,
            type: 'text' as const,
            hasMany: true,
            maxRows: 10,
            defaultValue: [...TAGS_PADRAO[name]],
            label: { pt, en },
            /* O padrão do Payload ("Selecione um valor") sugere uma lista para
               escolher; aqui a tag é digitada. */
            admin: { placeholder: { pt: 'Digite a tag e tecle Enter', en: 'Type a tag and press Enter' } },
            hooks: { beforeValidate: [normalizarLista] },
            /* ⚠️ O `maxRows` acima não vale sozinho no servidor: um `validate`
               próprio substitui o padrão do Payload, que é quem o confere. Sem
               a contagem aqui, a API aceitaria centenas de tags. */
            validate: (valores: string[] | null | undefined) =>
              !valores?.length ||
              (valores.length <= 10 && valores.every(ehTagDoRd)) ||
              'Até 10 tags, cada uma com até 50 caracteres, sem quebra de linha e sem < > { } " ` \\.',
          })),
        },
        {
          /* Task 052: os formulários de Conteúdo → Formulários, com o
           * identificador e as tags com que vão ao RD — que moram em cada
           * formulário, não aqui. Campo `ui`, como a situação da chave: sem
           * coluna, fora da API, e o componente é de servidor. */
          name: 'adminForms',
          type: 'ui',
          admin: {
            components: { Field: '/components/admin/formularios-no-rd#FormulariosNoRd' },
          },
        },
      ],
    },
  ],
}
