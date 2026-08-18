import type { Field } from 'payload'

/* Grupo reaproveitado por toda collection com URL pública.
 * Os fallbacks (title, summary, heroImage) são resolvidos no
 * generateMetadata — ver docs/02-especificacao/seo-e-redirects.md. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: { pt: 'SEO', en: 'SEO' },
  admin: {
    description: {
      pt: 'Opcional. Vazio, o site usa o título e o resumo da página.',
      en: 'Optional. When empty, the site falls back to the page title and summary.',
    },
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      localized: true,
      label: { pt: 'Título para buscadores', en: 'Meta title' },
      admin: { description: { pt: 'Até ~60 caracteres.', en: 'Up to ~60 characters.' } },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      localized: true,
      maxLength: 160,
      label: { pt: 'Descrição para buscadores', en: 'Meta description' },
      admin: {
        description: {
          pt: 'Até 160 caracteres — o Google corta o excedente.',
          en: 'Up to 160 characters — Google truncates the rest.',
        },
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: { pt: 'Imagem de compartilhamento', en: 'Share image' },
      admin: {
        description: {
          pt: 'Aparece ao compartilhar no LinkedIn e WhatsApp. Vazio, usa a imagem de capa.',
          en: 'Shown when shared on LinkedIn and WhatsApp. Falls back to the cover image.',
        },
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: { pt: 'Esconder dos buscadores', en: 'Hide from search engines' },
    },
  ],
}
