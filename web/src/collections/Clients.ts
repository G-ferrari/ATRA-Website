import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'

/* Logos de cliente — a esteira que roda sob a caixa de conversa da home
 * (`legacy/src/App.tsx:1862`).
 *
 * Separada de `partners` porque cliente é quem **contrata** — nome e logo, e
 * mais nada. Parceiro é fornecedor de tecnologia, com descrição, nível e página
 * própria (modelo-de-conteudo.md). Misturar as duas colocaria o Banco Carrefour
 * no painel de parceiros do megamenu.
 *
 * ⚠️ Não tem `slug` nem página. Se um dia um cliente precisar de URL, o que ele
 * quer é um **case**, que já existe. */
export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    listSearchableFields: ['name'],
    defaultColumns: ['name', 'order', 'enlarge'],
    group: { pt: 'Catálogos', en: 'Catalogs' },
    description: {
      pt: 'Logos de cliente. Aparecem na esteira da home, na ordem definida aqui.',
      en: 'Client logos. Shown in the home page strip, in the order set here.',
    },
  },
  labels: { singular: { pt: 'Cliente', en: 'Client' }, plural: { pt: 'Clientes', en: 'Clients' } },
  access: { read: isPublic, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: { pt: 'Nome', en: 'Name' },
      admin: { description: { pt: 'Não é traduzido: nome próprio.', en: 'Not translated: proper noun.' } },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: { pt: 'Logo', en: 'Logo' },
    },
    {
      /* ⚠️ Três dos sete logos são desenhados menores dentro do arquivo, e o
       * legado os amplia um a um (`App.tsx:1895`). Sem isto, ANBIMA, Afya e
       * Icatu aparecem visivelmente menores que os outros quatro na mesma
       * fileira. É correção de arte do arquivo, não preferência. */
      name: 'enlarge',
      type: 'checkbox',
      defaultValue: false,
      label: { pt: 'Ampliar o logo', en: 'Enlarge the logo' },
      admin: {
        description: {
          pt: 'Para arquivos em que a marca ocupa pouco espaço e sai menor que as vizinhas.',
          en: 'For files where the mark sits small in the canvas and reads smaller than its neighbours.',
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: { pt: 'Ordem', en: 'Order' },
      admin: { position: 'sidebar' },
    },
  ],
}
