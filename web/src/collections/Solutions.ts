import type { CollectionConfig, Field, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

import { isEditorOrAdmin } from '@/access'
import { BLOCOS } from '@/blocks'
import { campoDeIcone } from '@/blocks/shared'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { ABAS_DE_SOLUCOES } from '@/lib/abas-de-solucoes'
import { enderecoReservado } from '@/lib/redirects'

/* Endereço antigo de solução ainda preso a um redirect não pode virar o
 * endereço de uma página: o redirect responde **antes** de a rota existir, e a
 * página nunca abriria — o menu mostraria o endereço novo e o clique cairia em
 * outro lugar. Foi o defeito de 06/10 com Customer 360 e Master Data
 * Management (`ENDERECOS_REOCUPADOS`). A recusa aqui troca o defeito mudo por
 * um aviso na hora de salvar; liberar um endereço é uma linha naquela lista. */
const enderecoLivre: TextFieldSingleValidation = (valor, opcoes) => {
  const destino = typeof valor === 'string' ? enderecoReservado(valor) : null
  if (destino) {
    return opcoes.req?.i18n?.language === 'en'
      ? `"${valor}" was the address of an old page and still redirects to "${destino}". Pick another address, or ask the tech team to release this one.`
      : `"${valor}" era o endereço de uma página antiga e ainda redireciona para "${destino}". Escolha outro endereço, ou peça ao time técnico para liberar este.`
  }
  return text(valor, opcoes)
}

/* Ofertas da ATRA (MIG-055).
 *
 * No legado é a literal `solutionsData` (`App.tsx:45-97`), lida em quatro
 * lugares — mega-menu desktop, submenu, gaveta mobile e rodapé. Collection e
 * não bloco de página porque D-09 dá URL própria a cada solução, e porque o
 * mega-menu precisa consultá-las: mantida como bloco, cada categoria do menu
 * dependeria de qual página estivesse sendo montada.
 *
 * As 6 de hoje viram 13 em MIG-093, com conteúdo vindo do WordPress. */
export const Solutions: CollectionConfig = {
  slug: 'solutions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'order', 'hasPage'],
    listSearchableFields: ['title', 'shortDescription'],
    group: { pt: 'Catálogos', en: 'Catalogs' },
    description: {
      pt: 'Ofertas da ATRA. Aparecem no menu de Soluções e no índice /solucoes.',
      en: 'ATRA offerings. Shown in the Solutions menu and on the /solucoes index.',
    },
  },
  labels: {
    singular: { pt: 'Solução', en: 'Solution' },
    plural: { pt: 'Soluções', en: 'Solutions' },
  },
  access: {
    // Rascunho fica fora da leitura pública; o site só enxerga publicado.
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isEditorOrAdmin,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  /* Por aba e, dentro dela, pela ordem — como o menu mostra. Só com `order`, a
   * lista do admin intercalava as abas (todas as de ordem 0, depois as de 1…) e
   * a numeração não batia com o que aparece no site. A categoria ordena pela
   * declaração das opções, que é a ordem das abas. */
  defaultSort: ['category', 'order'],
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    { ...slugField(), validate: enderecoLivre } as Field,
    {
      /* As categorias do mega-menu (`App.tsx:45`). `select` e não relacionamento
       * a `topics`: aquela taxonomia classifica conteúdo editorial (case, post,
       * glossário) e é curada pelo marketing. Estas são a espinha do menu —
       * criar uma categoria muda a navegação do site, não a etiqueta de um artigo.
       * `rc18` é a 4ª categoria, adicionada de propósito (feature rc18): uma aba
       * própria para a landing da RC 18/2025, ao lado das três originais. Quem
       * adicionar uma quinta precisa refletir em `GRUPOS` (mappers/navigation.ts)
       * e `CATEGORIAS` (solucoes/page.tsx) e gerar migração aditiva de enum. */
      name: 'category',
      type: 'select',
      required: true,
      /* ⚠️ Desde a D-52 (02/10) são **quatro abas**, com nomes novos. Os três
       * valores antigos ficaram e só o rótulo mudou — renomear valor de enum é
       * migração destrutiva —, então o valor já não descreve a aba:
       * `governance-culture` é "Governança & FinOps", e a cultura de dados foi
       * para Serviços Especializados. Quem manda é `ABAS_DE_SOLUCOES`. */
      options: [
        ...ABAS_DE_SOLUCOES.map((a) => ({ value: a.id, label: { pt: a.pt, en: a.en } })),
        { value: 'rc18', label: { pt: 'RC18', en: 'RC18' } },
      ],
      label: { pt: 'Categoria', en: 'Category' },
      admin: { description: { pt: 'A aba do menu de Soluções.', en: 'The tab in the Solutions menu.' } },
    },
    {
      /* ⚠️ modelo-de-conteudo.md previa `text` com o nome do ícone Fluent
       * (`fluent:brain-circuit-24-regular`), como no legado. Fica no `select`
       * fechado de `campoDeIcone` pelo motivo que já vale para todo bloco: o
       * valor vira componente React, e nome livre inválido só apareceria como
       * buraco na página em produção. O legado usa Iconify, o app novo usa
       * Lucide — a troca de biblioteca já estava feita, e manter o nome Fluent
       * aqui guardaria um identificador que nada resolve. */
      ...campoDeIcone,
    },
    {
      /* D-52: o selo do cartão em destaque — "Diferencial ATRA" em Analytics
       * Conversacional. Texto livre e não checkbox: o que destaca o cartão é o
       * selo ter o que dizer. */
      name: 'badge',
      type: 'text',
      localized: true,
      label: { pt: 'Selo', en: 'Badge' },
      admin: {
        description: {
          pt: 'Opcional. Preenchido, o cartão ganha destaque e o selo no menu e no índice. Ex.: “Diferencial ATRA”.',
          en: 'Optional. When filled, the card is highlighted and shows the badge in the menu and index.',
        },
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      localized: true,
      label: { pt: 'Descrição curta', en: 'Short description' },
      admin: {
        description: {
          pt: 'Uma frase. Usada no menu de Soluções e no card do índice.',
          en: 'One sentence. Used in the Solutions menu and on the index card.',
        },
      },
    },
    {
      /* 5 das 6 soluções do legado têm `link: "#"` — só IA tem página. O
       * checkbox preserva esse estado em vez de fingir que as outras existem:
       * sem ele, o índice ofereceria 5 links para 404. MIG-056 traz o template
       * da página e liga a de IA; MIG-093 escreve as demais. */
      name: 'hasPage',
      type: 'checkbox',
      label: { pt: 'Tem página própria', en: 'Has its own page' },
      admin: {
        description: {
          pt: 'Sem isto, a solução aparece no menu e no índice, mas não vira link.',
          en: 'Without this, the solution appears in the menu and index but is not a link.',
        },
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: BLOCOS,
      label: { pt: 'Seções da página', en: 'Page sections' },
      admin: { condition: (_, irmaos) => Boolean(irmaos?.hasPage) },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: { pt: 'Ordem', en: 'Order' },
      admin: {
        position: 'sidebar',
        description: { pt: 'Ordem dentro da categoria.', en: 'Order within the category.' },
      },
    },
    seoField,
  ],
}
