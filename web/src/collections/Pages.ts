import { APIError, type CollectionConfig, type Field } from 'payload'

import { isAdminFieldLevel, isEditorOrAdmin } from '@/access'
import { BLOCOS } from '@/blocks'
import { BLOCOS_DE_PAGINA_MESTRA } from '@/blocks/pagina-mestra'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { DEFAULT_LOCALE, isLocale } from '@/lib/locales'
import { ehSecaoMestra, nomeDaSecao, PAGINAS_MESTRAS } from '@/lib/paginas-mestras'
import { urlDePreview } from '@/lib/preview'

/* Onde a página aparece no site, para o Live Preview. A página-mestra é achada
 * pela seção; as outras pelo slug, que é o próprio endereço (`/sobre`,
 * `/en/about`) — menos a home, que é a raiz. */
function enderecoDaPagina(doc: unknown, localeCru?: string): string {
  const locale = isLocale(localeCru) ? localeCru : DEFAULT_LOCALE
  const { slug, masterOf } = (doc ?? {}) as { slug?: string; masterOf?: string | null }
  if (ehSecaoMestra(masterOf)) return urlDePreview({ secao: masterOf, locale })
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const caminho = !slug || slug === 'home' ? '' : `/${slug}`
  const url = new URL('/api/preview', base)
  url.searchParams.set('caminho', `${locale === 'pt' ? '' : `/${locale}`}${caminho}` || '/')
  return url.toString()
}

/* Páginas montadas por blocos (MIG-047).
 *
 * É a collection que responde ao objetivo declarado da migração: o marketing
 * monta e reordena seção sem pedir deploy. `/sobre`, `/carreiras` e `/contato`
 * vivem aqui (blocos.md); rota e seed vêm em MIG-049.
 *
 * O slug é localizado (D-07) e a rota é resolvida por ele, então mudar o slug
 * muda a URL — o admin avisa. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'masterOf', 'slug', 'updatedAt', '_status'],
    preview: (doc, { locale }) => enderecoDaPagina(doc, locale),
    livePreview: { url: ({ data, locale }) => enderecoDaPagina(data, locale?.code) },
    listSearchableFields: ['title', 'slug'],
    group: { pt: 'Conteúdo', en: 'Content' },
    description: {
      pt: 'Páginas montadas por blocos. Arraste para reordenar as seções.',
      en: 'Pages assembled from blocks. Drag to reorder sections.',
    },
  },
  labels: { singular: { pt: 'Página', en: 'Page' }, plural: { pt: 'Páginas', en: 'Pages' } },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    /* Página-mestra não se apaga (decisão de 05/10): a rota da seção existe no
     * código e depende dela. Despublicar continua possível — tira a seção do ar
     * de propósito —, e o campo "Página-mestra de" avisa disso. */
    beforeDelete: [
      async ({ req, id }) => {
        const doc = await req.payload.findByID({ collection: 'pages', id, depth: 0, req, draft: true })
        if (ehSecaoMestra(doc?.masterOf)) {
          throw new APIError(
            `"${doc.title}" é a página-mestra da seção ${nomeDaSecao(doc.masterOf)} e não pode ser apagada. Para tirá-la do ar, despublique.`,
            400,
            undefined,
            true,
          )
        }
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      ...slugField('title'),
      /* Na página-mestra o endereço é o da seção em `lib/routes.ts`, base também
       * das páginas internas (`/blog/<artigo>`). Renomear a seção é pedido ao
       * time técnico, como foi "Relatórios" → "ATRA na mídia" (D-43). */
      access: { update: ({ doc }) => !ehSecaoMestra((doc as { masterOf?: unknown } | undefined)?.masterOf) },
      admin: {
        position: 'sidebar',
        description: {
          pt: 'Parte final da URL. Mudar depois de publicar quebra links existentes. Nas páginas-mestras o endereço é fixo: para renomear a seção, peça ao time técnico.',
          en: 'Final part of the URL. Changing it after publishing breaks links. On section pages the address is fixed: ask the tech team to rename a section.',
        },
      },
    } as Field,
    {
      /* A marca da página-mestra (feature paginas-mestras). Quem marca é a
       * migração de conteúdo; só admin muda. Fica escondido nas páginas comuns. */
      name: 'masterOf',
      type: 'select',
      unique: true,
      index: true,
      options: PAGINAS_MESTRAS.map((p) => ({ value: p.id, label: { pt: p.pt, en: p.en } })),
      label: { pt: 'Página-mestra de', en: 'Section page of' },
      access: { update: isAdminFieldLevel },
      admin: {
        position: 'sidebar',
        condition: (data) => ehSecaoMestra(data?.masterOf),
        description: {
          pt: 'Esta é a página principal da seção: não pode ser apagada e o endereço é fixo. Se for despublicada, a seção sai do ar — e o menu e o rodapé continuam apontando para ela.',
          en: 'This is the section’s main page: it cannot be deleted and its address is fixed. If unpublished, the section goes offline while menu and footer still link to it.',
        },
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [...BLOCOS, ...BLOCOS_DE_PAGINA_MESTRA],
      label: { pt: 'Seções', en: 'Sections' },
      labels: { singular: { pt: 'Seção', en: 'Section' }, plural: { pt: 'Seções', en: 'Sections' } },
    },
    seoField,
  ],
}
