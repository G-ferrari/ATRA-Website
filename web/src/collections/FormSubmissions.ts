import type { CollectionConfig } from 'payload'

import { isAdmin, isEditorOrAdmin } from '@/access'

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
 * ⚠️ Isto **não** é o CRM, e agora se sabe qual é: **D-26** respondeu P-18 —
 * a ATRA usa RD Station CRM, e o destino final dos leads é lá. Esta collection
 * é o registro de passagem, e continua sendo a **primeira** escrita: grava aqui,
 * sincroniza depois. Enquanto a sincronização não existe, é a única cópia — e o
 * backup diário deixa o RPO de lead em 24h, que é o que P-22 questiona. Lead
 * perdido não volta.
 */
export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'kind', 'status', 'createdAt'],
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
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        { value: 'contact', label: { pt: 'Contato', en: 'Contact' } },
        { value: 'newsletter', label: { pt: 'Newsletter', en: 'Newsletter' } },
        { value: 'talent-pool', label: { pt: 'Banco de talentos', en: 'Talent pool' } },
        { value: 'job-application', label: { pt: 'Candidatura', en: 'Job application' } },
        { value: 'material-download', label: { pt: 'Download de material', en: 'Material download' } },
      ],
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
    /* MIG-103 — dupla confirmação da newsletter. `confirmedAt` vazio = o
     * visitante pediu mas nunca clicou no link: **não** está na lista. O token
     * é o segredo do link de confirmação; `hidden` porque não é dado editorial. */
    { name: 'confirmationToken', type: 'text', index: true, admin: { hidden: true } },
    {
      name: 'confirmedAt',
      type: 'date',
      label: { pt: 'Confirmado em', en: 'Confirmed at' },
      admin: {
        position: 'sidebar',
        description: {
          pt: 'Newsletter: vazio significa que o visitante ainda não confirmou pelo e-mail — não conta como inscrito.',
          en: 'Newsletter: empty means the visitor never confirmed by e-mail — not a subscriber.',
        },
      },
    },
    /* MIG-102 — candidatura: a vaga e o currículo. O CV mora em
     * `private-files`; daqui o RH abre pelo admin, autenticado. */
    { name: 'job', type: 'relationship', relationTo: 'jobs', label: { pt: 'Vaga', en: 'Job' } },
    { name: 'cv', type: 'relationship', relationTo: 'private-files', label: { pt: 'Currículo', en: 'CV' } },
    /* MIG-104 — download: qual material o lead pediu. */
    { name: 'resource', type: 'relationship', relationTo: 'resources', label: { pt: 'Material', en: 'Material' } },
    { name: 'name', type: 'text', label: { pt: 'Nome', en: 'Name' } },
    { name: 'phone', type: 'text', label: { pt: 'Telefone', en: 'Phone' } },
    { name: 'company', type: 'text', label: { pt: 'Empresa', en: 'Company' } },
    { name: 'message', type: 'textarea', label: { pt: 'Mensagem', en: 'Message' } },
    {
      /* De onde veio, para o marketing saber o que converte. Caminho e idioma
       * bastam: é dado do site, não do visitante. */
      name: 'source',
      type: 'text',
      label: { pt: 'Página de origem', en: 'Source page' },
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      /* Que campanha trouxe o visitante (D-26), para o RD Station CRM saber
       * qual investimento pagou o lead.
       *
       * ⚠️ **Não é o `source` acima.** Aquele é *onde* a pessoa converteu — o
       * caminho da página. Este é *de onde ela veio*. São duas perguntas
       * diferentes e o CRM precisa das duas para fechar a conta.
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
