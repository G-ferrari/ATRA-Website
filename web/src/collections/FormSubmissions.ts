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
 * ⚠️ Isto **não** é o CRM. P-18 pergunta se a ATRA usa RD Station ou HubSpot;
 * se usar, o destino final dos leads é lá e isto vira registro de passagem. Até
 * a resposta, é a única cópia — e o backup diário deixa o RPO de lead em 24h,
 * que é o que P-22 questiona. Lead perdido não volta.
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
