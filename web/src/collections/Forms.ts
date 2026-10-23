import type { CollectionBeforeValidateHook, CollectionConfig, Field } from 'payload'

import { isEditorOrAdmin } from '@/access'
import { ehIdentificadorDeConversao, ehTagDoRd, normalizarNome } from '@/lib/formatos-de-integracao'
import {
  type CampoParaConferir,
  conferirCampos,
  ehCampoPersonalizadoDoRd,
  ehEnderecoInterno,
  MAX_CAMPOS,
  MAX_OPCOES,
  ROTULO_DO_TIPO,
  sugerirIdentificador,
  TIPOS_COM_CAMPO_PERSONALIZADO,
  TIPOS_DE_CAMPO,
  valoresDasOpcoes,
  type OpcaoParaValor,
  type TipoDeCampo,
} from '@/lib/formularios-do-admin'

/* Formulários montados no admin (feature criador-de-formularios, task 048).
 *
 * O marketing cria aqui o formulário — campos, botão, o que acontece depois do
 * envio, quem recebe o aviso e o que vai ao RD — e o põe numa página com a
 * seção "Formulário" (task 051). O envio passa pelo mesmo caminho dos
 * formulários escritos em código (anti-spam, gravação em `form-submissions`
 * antes de tudo, RD, aviso — tasks 049 e 050).
 *
 * ⚠️ O RD não tem API para criar formulário, landing page nem automação. O
 * identificador e as tags passam a existir lá na primeira conversão; o
 * agradecimento e o aviso ao time continuam sendo fluxo que o marketing monta
 * no RD.
 *
 * ⚠️ Rascunho **com validação** (`drafts.validate`): sem ela o Payload pula
 * toda validação ao salvar rascunho, e um formulário sem e-mail chegaria até a
 * publicação sem aviso. São poucos campos obrigatórios — a regra não atrapalha
 * quem salva pela metade.
 */

const tipoDe = (linha: unknown): TipoDeCampo | undefined => (linha as { type?: TipoDeCampo } | undefined)?.type

const normalizar = ({ value }: { value?: unknown }) => (typeof value === 'string' ? normalizarNome(value) : value)
const normalizarLista = ({ value }: { value?: unknown }) =>
  Array.isArray(value)
    ? value.map((v) => (typeof v === 'string' ? normalizarNome(v) : v)).filter((v) => v !== '')
    : value
const aparar = ({ value }: { value?: unknown }) => (typeof value === 'string' ? value.trim() : value)

type LinhaDeCampo = {
  id?: string | null
  type?: TipoDeCampo
  required?: boolean
  options?: OpcaoParaValor[] | null
}

/* O que o editor não precisa fazer à mão: o e-mail é sempre obrigatório, cada
 * opção ganha um valor estável gerado do rótulo, e o identificador do RD nasce
 * do nome — só na criação: depois o campo é do marketing, e apagado quer dizer
 * "não mandar ao RD".
 *
 * O valor das opções olha o documento **salvo** (`originalDoc`), não o que
 * chega: ver `valoresDasOpcoes`. Num `update` parcial o Payload já mesclou o
 * documento salvo antes deste gancho, então `fields` vem inteiro. */
const completar: CollectionBeforeValidateHook = ({ data, operation, originalDoc }) => {
  if (!data) return data
  if (Array.isArray(data.fields)) {
    const salvas = new Map(
      ((originalDoc?.fields ?? []) as LinhaDeCampo[]).flatMap((l) => (l.id ? [[l.id, l.options ?? []] as const] : [])),
    )
    data.fields = (data.fields as LinhaDeCampo[]).map((linha) => {
      const completa = { ...linha }
      if (completa.type === 'email') completa.required = true
      if (completa.type === 'select' && Array.isArray(completa.options)) {
        const valores = valoresDasOpcoes(completa.options, (completa.id && salvas.get(completa.id)) || [])
        completa.options = completa.options.map((o, i) => ({ ...o, value: valores[i] }))
      }
      return completa
    })
  }
  if (operation === 'create' && !data.rd?.conversionIdentifier) {
    const sugerido = sugerirIdentificador(data.name)
    if (sugerido) data.rd = { ...data.rd, conversionIdentifier: sugerido }
  }
  return data
}

const quandoTipo =
  (...tipos: TipoDeCampo[]) =>
  (_: unknown, irmaos: unknown) =>
    tipos.includes(tipoDe(irmaos) as TipoDeCampo)

const camposDoFormulario: Field = {
  name: 'fields',
  type: 'array',
  minRows: 1,
  maxRows: MAX_CAMPOS,
  label: { pt: 'Campos', en: 'Fields' },
  labels: { singular: { pt: 'Campo', en: 'Field' }, plural: { pt: 'Campos', en: 'Fields' } },
  /* O formulário nasce com o e-mail: é por ele que o RD identifica o lead, e
     a validação abaixo não deixa salvar sem ele. */
  defaultValue: [{ type: 'email', label: 'E-mail', required: true, width: 'full' }],
  admin: {
    description: {
      pt: 'Na ordem em que aparecem. O e-mail é obrigatório e vem sempre. Não peça documento (CPF, RG), dado de saúde nem arquivo: o formulário vai para uma base de marketing.',
      en: 'In display order. The e-mail field is required and always present. Do not ask for ID numbers, health data or files: submissions go to a marketing database.',
    },
    components: { RowLabel: '/components/admin/rotulo-do-campo-do-formulario#RotuloDoCampoDoFormulario' },
  },
  validate: (linhas: unknown) => conferirCampos((linhas as CampoParaConferir[] | null | undefined) ?? []) ?? true,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'shortText',
          options: TIPOS_DE_CAMPO.map((t) => ({ value: t, label: ROTULO_DO_TIPO[t] })),
          label: { pt: 'Tipo', en: 'Type' },
          admin: { width: '50%' },
        },
        {
          name: 'width',
          type: 'select',
          required: true,
          defaultValue: 'full',
          options: [
            { value: 'full', label: { pt: 'Linha inteira', en: 'Full width' } },
            { value: 'half', label: { pt: 'Meia linha', en: 'Half width' } },
          ],
          label: { pt: 'Largura', en: 'Width' },
          admin: {
            width: '50%',
            description: { pt: 'No celular, todo campo ocupa a linha inteira.', en: 'On phones every field is full width.' },
          },
        },
      ],
    },
    { name: 'label', type: 'text', required: true, localized: true, maxLength: 200, label: { pt: 'Rótulo', en: 'Label' } },
    {
      name: 'placeholder',
      type: 'text',
      localized: true,
      maxLength: 200,
      label: { pt: 'Texto de exemplo', en: 'Placeholder' },
      admin: {
        condition: (_, irmaos) => tipoDe(irmaos) !== 'checkbox',
        description: { pt: 'Aparece apagado dentro do campo vazio. Opcional.', en: 'Shown greyed out inside the empty field. Optional.' },
      },
    },
    {
      name: 'required',
      type: 'checkbox',
      defaultValue: false,
      label: { pt: 'Obrigatório', en: 'Required' },
      admin: {
        condition: (_, irmaos) => tipoDe(irmaos) !== 'email',
        description: {
          pt: 'O visitante só consegue enviar com este campo preenchido — ou, numa caixa de marcar, marcado.',
          en: 'Visitors can only submit with this field filled in — or, on a checkbox, ticked.',
        },
      },
    },
    {
      name: 'options',
      type: 'array',
      maxRows: MAX_OPCOES,
      label: { pt: 'Opções', en: 'Options' },
      labels: { singular: { pt: 'Opção', en: 'Option' }, plural: { pt: 'Opções', en: 'Options' } },
      admin: { condition: quandoTipo('select') },
      /* ⚠️ O `maxRows` não vale sozinho no servidor quando há `validate`
         próprio — por isso o teto está aqui também. */
      validate: (opcoes: unknown, { siblingData }: { siblingData?: unknown }) =>
        tipoDe(siblingData) !== 'select' ||
        (Array.isArray(opcoes) && opcoes.length >= 2 && opcoes.length <= MAX_OPCOES) ||
        `Uma lista de opções precisa de 2 a ${MAX_OPCOES} opções.`,
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, maxLength: 200, label: { pt: 'Opção', en: 'Option' } },
        {
          /* Gerado do rótulo na criação (gancho `completar`) e estável depois:
             é o que fica gravado no envio e vai ao RD. */
          name: 'value',
          type: 'text',
          maxLength: 60,
          label: { pt: 'Valor gravado', en: 'Stored value' },
          admin: {
            readOnly: true,
            description: {
              pt: 'Criado a partir da opção ao salvar. É o que fica no envio e vai ao RD, e não muda se a opção for reescrita.',
              en: 'Created from the option on save. It is what the submission stores and RD receives, and it does not change if the option is reworded.',
            },
          },
        },
      ],
    },
    {
      name: 'consent',
      type: 'checkbox',
      defaultValue: false,
      label: { pt: 'É o consentimento para receber comunicações', en: 'This is the consent to receive communications' },
      admin: {
        condition: quandoTipo('checkbox'),
        description: {
          pt: 'Marcada pelo visitante, o lead chega ao RD com a base legal de consentimento e liberado para receber e-mails. O texto do rótulo é do jurídico.',
          en: 'When the visitor ticks it, the lead reaches RD with consent as legal basis and open to e-mails. The label text comes from legal.',
        },
      },
    },
    {
      name: 'rdField',
      type: 'text',
      label: { pt: 'Campo personalizado no RD', en: 'RD custom field' },
      admin: {
        condition: (_, irmaos) => TIPOS_COM_CAMPO_PERSONALIZADO.includes(tipoDe(irmaos) as TipoDeCampo),
        placeholder: 'cf_',
        description: {
          pt: 'Vazio: a resposta fica só no site. Para mandar ao RD, escreva o nome do campo personalizado exatamente como está no RD, começando com cf_ (ex.: cf_area_de_interesse). Só vai com "Enviar campos personalizados" ligado em Sistema → Integrações; campo que não existe no RD faz o RD recusar o lead.',
          en: 'Empty: the answer stays on the site only. To send it to RD, type the custom field name exactly as in RD, starting with cf_ (e.g. cf_area_de_interesse). Only sent with "Send custom fields" on under System → Integrations; a field missing in RD makes RD reject the lead.',
        },
      },
      hooks: { beforeValidate: [aparar] },
      validate: (valor: string | null | undefined) =>
        !valor || ehCampoPersonalizadoDoRd(valor) || 'Use cf_ seguido de letras minúsculas, números e _ (ex.: cf_area_de_interesse).',
    },
  ],
}

export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rd.conversionIdentifier', '_status', 'updatedAt'],
    listSearchableFields: ['name'],
    group: { pt: 'Conteúdo', en: 'Content' },
    description: {
      pt: 'Formulários para pôr em qualquer página com a seção "Formulário". Cada envio fica em Envios de formulário e vai ao RD com o identificador e as tags daqui.',
      en: 'Forms to place on any page with the "Form" section. Every submission is stored under Form submissions and reaches RD with the identifier and tags set here.',
    },
  },
  labels: { singular: { pt: 'Formulário', en: 'Form' }, plural: { pt: 'Formulários', en: 'Forms' } },
  /* ⚠️ Leitura só para quem está logado, e não "público lê o publicado" como
   * nas collections de conteúdo: o documento leva os e-mails do aviso e o
   * mapeamento do RD (identificador, tags, `cf_`), e `GET /api/forms` mostraria
   * isso a qualquer visitante — o motivo de Integrações ter deixado de ser
   * pública em 15/10. O site lê pela Local API (seção e action), que ignora o
   * `access`; por isso toda consulta do site escreve o filtro de `_status`. */
  access: {
    read: isEditorOrAdmin,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: { validate: true }, maxPerDoc: 20 },
  hooks: { beforeValidate: [completar] },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
      label: { pt: 'Nome', en: 'Name' },
      /* A cópia nasce com outro nome — e, com o identificador zerado abaixo,
         o gancho sugere um identificador novo a partir dele. */
      hooks: { beforeDuplicate: [({ value }) => (typeof value === 'string' ? `${value.slice(0, 92)} (cópia)` : value)] },
      admin: {
        description: {
          pt: 'Para achar o formulário no admin e no RD. O visitante não vê.',
          en: 'To find the form in the admin and in RD. Visitors do not see it.',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        { label: { pt: 'Campos', en: 'Fields' }, fields: [camposDoFormulario] },
        {
          label: { pt: 'Botão e envio', en: 'Button and submission' },
          fields: [
            {
              name: 'submitLabel',
              type: 'text',
              required: true,
              localized: true,
              maxLength: 60,
              defaultValue: ({ locale }: { locale?: string }) => (locale === 'en' ? 'Send' : 'Enviar'),
              label: { pt: 'Texto do botão', en: 'Button text' },
            },
            {
              name: 'notice',
              type: 'textarea',
              localized: true,
              maxLength: 1500,
              label: { pt: 'Aviso acima do botão', en: 'Notice above the button' },
              admin: {
                description: {
                  pt: 'Opcional. Por exemplo, o aviso de privacidade: o que acontece com os dados e como pedir a exclusão. Texto do jurídico.',
                  en: 'Optional. For example, the privacy notice: what happens to the data and how to ask for deletion. Written by legal.',
                },
              },
            },
            {
              name: 'afterSubmit',
              type: 'radio',
              required: true,
              defaultValue: 'message',
              options: [
                { value: 'message', label: { pt: 'Mostrar uma mensagem', en: 'Show a message' } },
                { value: 'page', label: { pt: 'Ir para outra página', en: 'Go to another page' } },
              ],
              label: { pt: 'Depois do envio', en: 'After submission' },
              admin: { layout: 'horizontal' },
            },
            {
              name: 'successMessage',
              type: 'textarea',
              localized: true,
              maxLength: 600,
              label: { pt: 'Mensagem', en: 'Message' },
              admin: {
                condition: (_, irmaos) => (irmaos as { afterSubmit?: string })?.afterSubmit !== 'page',
                description: {
                  pt: 'Aparece no lugar do formulário depois do envio.',
                  en: 'Replaces the form after submission.',
                },
              },
              validate: (valor: string | null | undefined, { siblingData }: { siblingData?: unknown }) =>
                (siblingData as { afterSubmit?: string })?.afterSubmit === 'page' ||
                Boolean(valor?.trim()) ||
                'Escreva a mensagem que aparece depois do envio.',
            },
            {
              name: 'redirectPath',
              type: 'text',
              maxLength: 200,
              label: { pt: 'Endereço da página', en: 'Page address' },
              admin: {
                condition: (_, irmaos) => (irmaos as { afterSubmit?: string })?.afterSubmit === 'page',
                placeholder: '/contato',
                description: {
                  pt: 'O endereço em português, começando com / (ex.: /cases-de-sucesso/marketplace-governanca-dados). Na versão em inglês, o site leva à mesma página em inglês.',
                  en: 'The Portuguese address, starting with / (e.g. /cases-de-sucesso/marketplace-governanca-dados). On the English site, visitors go to the same page in English.',
                },
              },
              hooks: { beforeValidate: [aparar] },
              validate: (valor: string | null | undefined, { siblingData }: { siblingData?: unknown }) =>
                (siblingData as { afterSubmit?: string })?.afterSubmit !== 'page' ||
                (Boolean(valor) && ehEnderecoInterno(valor as string)) ||
                'Use um endereço do próprio site em português, começando com / (ex.: /contato).',
            },
            {
              name: 'notifyEmails',
              type: 'text',
              hasMany: true,
              maxRows: 10,
              label: { pt: 'Quem recebe o aviso do site', en: 'Who gets the site notice' },
              admin: {
                placeholder: { pt: 'Digite o e-mail e tecle Enter', en: 'Type an e-mail and press Enter' },
                description: {
                  pt: 'O site manda o aviso de novo lead para estes endereços só quando o RD não aceita o lead — quando aceita, quem avisa é a automação do RD. Vazio: vai para o destino geral de contato.',
                  en: 'The site e-mails these addresses about a new lead only when RD does not accept it — when it does, the RD automation notifies. Empty: the general contact recipient.',
                },
              },
              hooks: { beforeValidate: [normalizarLista] },
              validate: (valores: string[] | null | undefined) =>
                !valores?.length ||
                (valores.length <= 10 && valores.every((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))) ||
                'Até 10 endereços de e-mail válidos.',
            },
          ],
        },
        {
          label: { pt: 'RD Station', en: 'RD Station' },
          fields: [
            {
              name: 'rd',
              type: 'group',
              label: { pt: 'RD Station Marketing', en: 'RD Station Marketing' },
              admin: {
                description: {
                  pt: 'Nome, e-mail, telefone, empresa e cargo vão sempre para os campos padrão do RD; os outros campos, só se tiverem um campo personalizado escolhido. O liga/desliga geral e a chave ficam em Sistema → Integrações.',
                  en: 'Name, e-mail, phone, company and job title always go to RD standard fields; other fields only when a custom field is set. The global switch and the key live under System → Integrations.',
                },
              },
              fields: [
                {
                  name: 'conversionIdentifier',
                  type: 'text',
                  label: { pt: 'Identificador de conversão', en: 'Conversion identifier' },
                  /* ⚠️ Duplicar não copia o identificador: com o mesmo nome, as
                     conversões da cópia e do original ficariam indistinguíveis
                     no RD, e as automações do original disparariam pela cópia.
                     O Duplicar do Payload é um `create`, e o gancho `completar`
                     sugere um novo a partir do nome da cópia. */
                  hooks: { beforeDuplicate: [() => null], beforeValidate: [normalizar] },
                  admin: {
                    description: {
                      pt: 'O nome com que o formulário aparece no RD; é por ele que as automações disparam. Vem do nome do formulário ao criar — troque pelo que você usa no RD. Vazio: este formulário não vai ao RD.',
                      en: 'The name the form shows up with in RD; automations fire on it. Taken from the form name on creation — change it to what you use in RD. Empty: this form is not sent to RD.',
                    },
                  },
                  validate: (valor: string | null | undefined) =>
                    !valor ||
                    ehIdentificadorDeConversao(valor) ||
                    'Use o nome como está no RD, com até 100 caracteres, sem quebra de linha e sem < > { } " ` \\ (ex.: Formulário Home).',
                },
                {
                  name: 'tags',
                  type: 'text',
                  hasMany: true,
                  maxRows: 10,
                  label: { pt: 'Tags', en: 'Tags' },
                  admin: { placeholder: { pt: 'Digite a tag e tecle Enter', en: 'Type a tag and press Enter' } },
                  hooks: { beforeValidate: [normalizarLista] },
                  /* ⚠️ O `maxRows` não vale sozinho no servidor quando há
                     `validate` próprio — mesma nota de Integrações. */
                  validate: (valores: string[] | null | undefined) =>
                    !valores?.length ||
                    (valores.length <= 10 && valores.every(ehTagDoRd)) ||
                    'Até 10 tags, cada uma com até 50 caracteres, sem quebra de linha e sem < > { } " ` \\.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
