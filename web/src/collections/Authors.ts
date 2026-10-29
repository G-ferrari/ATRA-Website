import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin } from '@/access'

/* Autores dos artigos (GEO, D-80).
 *
 * O Google "recomenda fortemente" autoria precisa, com assinatura onde o
 * leitor espera, e pede o autor marcado como pessoa, com link para um perfil
 * que a identifique (documentação de Article). Até aqui os 207 artigos do
 * WordPress saíam assinados só pela ATRA — o WordPress não guardava autor.
 *
 * Sem página própria por autor, de propósito: a página teria nome, cargo e uma
 * lista de artigos, o que o Google trata como página magra (D-08). O link do
 * perfil vai para o LinkedIn, que já identifica a pessoa.
 *
 * Sem rascunho nem tradução automática: é cadastro, não conteúdo, e o cargo é
 * o único texto que muda de idioma. */

const ehUrl = (valor: unknown) =>
  !valor ||
  (typeof valor === 'string' && /^https:\/\/\S+$/i.test(valor.trim())) ||
  'Use o endereço completo do perfil, começando com https://'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'jobTitle'],
    group: { pt: 'Conteúdo', en: 'Content' },
    description: {
      pt: 'Especialistas que assinam os artigos do blog. A assinatura aparece no artigo e nos dados que os buscadores leem.',
      en: 'Specialists who sign blog posts. The byline shows on the post and in the data search engines read.',
    },
  },
  labels: {
    singular: { pt: 'Autor', en: 'Author' },
    plural: { pt: 'Autores', en: 'Authors' },
  },
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  defaultSort: 'name',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { pt: 'Nome', en: 'Name' },
      admin: { description: { pt: 'Só o nome, sem cargo nem título.', en: 'Name only, no job title or honorific.' } },
    },
    { name: 'jobTitle', type: 'text', localized: true, label: { pt: 'Cargo', en: 'Job title' } },
    {
      name: 'profileUrl',
      type: 'text',
      validate: ehUrl,
      label: { pt: 'Perfil no LinkedIn', en: 'LinkedIn profile' },
    },
  ],
}
