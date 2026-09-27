import type { GlobalConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'

/* Dados de contato da ATRA (MIG-072).
 *
 * No legado estão escritos dentro do JSX e repetidos em cinco lugares — rodapé,
 * CTA da home, CTA de /consultores, cartão de contato e `CaseDetailBase.tsx:204`.
 * Trocar o telefone hoje é trocar em cinco arquivos, e o legado já mostra o
 * sintoma: escreve o número de dois jeitos.
 *
 * ⚠️ **Não é localizado**, de propósito: telefone, e-mail e endereço são os
 * mesmos nos dois idiomas, e um campo localizado criaria a chance de o inglês
 * apontar para um e-mail que não existe.
 *
 * As redes sociais moram aqui, e não no `footer`, porque os blocos de contato
 * também as desenham (P-26 — no rodapé do protótipo elas apontavam para `#`, e
 * as URLs reais estavam no CTA de contato). */
export const Contact: GlobalConfig = {
  slug: 'contact',
  label: { pt: 'Contato', en: 'Contact' },
  admin: {
    group: { pt: 'Sistema', en: 'System' },
    description: {
      pt: 'Telefone, e-mail, endereço e redes. Mudar aqui muda no site inteiro.',
      en: 'Phone, email, address and social. Changing here changes the whole site.',
    },
  },
  access: { read: isPublic, update: isEditorOrAdmin },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', required: true, label: { pt: 'Telefone', en: 'Phone' } },
        {
          /* ⚠️ Dois campos para o mesmo número porque o legado o escreve de dois
           * jeitos: com parênteses no cartão da home (`App.tsx:2395`) e de
           * /consultores (`Consultants.tsx:876`), sem eles no rodapé
           * (`App.tsx:2510`). O aceite visual compara caractere a caractere, e
           * unificar seria melhoria — que não entra junto com migração (D-15). */
          name: 'phoneWithArea',
          type: 'text',
          required: true,
          label: { pt: 'Telefone com DDD', en: 'Phone with area code' },
          admin: {
            description: {
              pt: 'O mesmo número entre parênteses. O legado usa os dois formatos.',
              en: 'The same number with parentheses. The legacy uses both formats.',
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'whatsapp', type: 'text', required: true, label: { pt: 'Link do WhatsApp', en: 'WhatsApp link' } },
        { name: 'email', type: 'email', required: true, label: { pt: 'E-mail', en: 'Email' } },
      ],
    },
    { name: 'address', type: 'textarea', required: true, label: { pt: 'Endereço', en: 'Address' } },
    {
      name: 'social',
      type: 'group',
      label: { pt: 'Redes sociais', en: 'Social networks' },
      fields: [
        { name: 'linkedin', type: 'text', label: { pt: 'LinkedIn', en: 'LinkedIn' } },
        { name: 'instagram', type: 'text', label: { pt: 'Instagram', en: 'Instagram' } },
        { name: 'facebook', type: 'text', label: { pt: 'Facebook', en: 'Facebook' } },
        { name: 'youtube', type: 'text', label: { pt: 'YouTube', en: 'YouTube' } },
      ],
    },
    {
      /* Para onde vai o aviso de cada formulário (resposta do G-ferrari em
       * 26/09: "um campo no painel para editar isso"). Até aqui todos iam para
       * o `email` acima, e o diagnóstico dependia de `RC18_LEAD_EMAIL` na VPS
       * (P-29) — que ninguém do conteúdo consegue mudar. Vazio, vale o `email`
       * acima: nada muda até alguém preencher, e nenhum lead cai no vazio. */
      name: 'formRecipients',
      type: 'group',
      label: { pt: 'Destino dos formulários', en: 'Form recipients' },
      admin: {
        description: {
          pt: 'Para qual e-mail vai o aviso de cada formulário. Vazio, vai para o e-mail acima.',
          en: 'Which inbox receives each form. When empty, the email above is used.',
        },
      },
      fields: [
        { name: 'contact', type: 'email', label: { pt: 'Fale Conosco (home, /contato, páginas de solução)', en: 'Contact (home, /contato, solution pages)' } },
        { name: 'consultants', type: 'email', label: { pt: 'Pedido de consultores', en: 'Consultant requests' } },
        { name: 'diagnostic', type: 'email', label: { pt: 'Diagnóstico', en: 'Diagnostic' } },
        { name: 'careers', type: 'email', label: { pt: 'Carreiras (banco de talentos e candidaturas)', en: 'Careers (talent pool and applications)' } },
        { name: 'chat', type: 'email', label: { pt: 'Lead do chat', en: 'Chat lead' } },
      ],
    },
  ],
}
