import type { Block, Field } from 'payload'

import { paraEmbed } from '@/lib/video'

import { campoDeIcone, camposComuns, ICONES } from './shared'

/* Blocos de página (MIG-047).
 *
 * Regra 3 de blocos.md: **bloco novo exige justificativa no PR** — por que
 * nenhum dos existentes serve. É o que impede 20 rotas virarem 20 dialetos. */

export const PageHero: Block = {
  slug: 'pageHero',
  labels: { singular: { pt: 'Abertura de página', en: 'Page hero' }, plural: { pt: 'Aberturas', en: 'Page heroes' } },
  fields: [
    { name: 'badge', type: 'text', localized: true, label: { pt: 'Selo', en: 'Badge' } },
    { name: 'chip', type: 'text', localized: true, label: { pt: 'Etiqueta', en: 'Chip' } },
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      /* O legado destaca trechos do título com `<span>` (`About.tsx:175`).
       * Como o editor não escreve HTML, o destaque vira campo.
       *
       * `hasMany` porque o título de /sobre destaca **dois** trechos — "ATRA" e
       * "Transformação Digital". Com um só, o segundo saía branco. */
      name: 'highlight',
      type: 'text',
      hasMany: true,
      localized: true,
      label: { pt: 'Trechos destacados', en: 'Highlighted text' },
      admin: {
        description: {
          pt: 'Trechos do título que aparecem em azul. Cada um deve existir no título.',
          en: 'Slices of the title shown in blue. Each must appear in the title.',
        },
      },
    },
    {
      /* A linha média do herói de /carreiras (`Careers.tsx:126`), entre o
       * título e a descrição: maior que a descrição, menor que o título. */
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: { pt: 'Linha de apoio', en: 'Supporting line' },
    },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    {
      /* O herói de /carreiras é **centralizado** (`Careers.tsx:101`): a caixa
       * inteira em `text-center`, conteúdo em `max-w-3xl mx-auto`. Os outros
       * dois alinham à esquerda. */
      name: 'align',
      type: 'select',
      defaultValue: 'left',
      options: [
        { value: 'left', label: { pt: 'À esquerda', en: 'Left' } },
        { value: 'center', label: { pt: 'Centralizado', en: 'Centred' } },
      ],
      label: { pt: 'Alinhamento', en: 'Alignment' },
    },
    {
      /* A coluna direita do herói. `marquee` é a vitrine vertical de fotos de
       * `About.tsx:199`; `image` é uma imagem só; `none` deixa o texto ocupar a
       * largura toda, que é o caso de /glossario e /carreiras. `video` (pedido
       * de 08/10) é um arquivo enviado ou um link do YouTube/Vimeo. */
      name: 'mediaMode',
      type: 'select',
      defaultValue: 'none',
      options: [
        { value: 'none', label: { pt: 'Sem mídia', en: 'No media' } },
        { value: 'image', label: { pt: 'Uma imagem', en: 'Single image' } },
        { value: 'marquee', label: { pt: 'Fotos em rolagem', en: 'Scrolling photos' } },
        { value: 'video', label: { pt: 'Um vídeo', en: 'A video' } },
      ],
      label: { pt: 'Mídia ao lado', en: 'Side media' },
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      /* ⚠️ A biblioteca é uma só para imagem, PDF e vídeo. Sem o filtro o
       * seletor ofereceria as 287 imagens aqui — e, no campo de imagens abaixo,
       * um vídeo, que não tem largura nem altura e derruba o mapper. */
      filterOptions: { mimeType: { contains: 'video/' } },
      label: { pt: 'Arquivo de vídeo', en: 'Video file' },
      admin: {
        condition: (_, irmaos) => irmaos?.mediaMode === 'video',
        description: {
          pt: 'MP4 ou WebM, até 50 MB. O vídeo toca no próprio site, com os controles do navegador. Tendo arquivo e link, vale o arquivo.',
          en: 'MP4 or WebM, up to 50 MB. Plays on the site itself, with the browser controls. If both a file and a link are set, the file wins.',
        },
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: { pt: 'Ou o link do vídeo', en: 'Or the video link' },
      /* O mesmo conversor da página de webinar decide o que é link válido: o
       * que ele não reconhece não vira iframe, e sem este aviso o herói sairia
       * sem mídia e sem explicação. */
      validate: (valor: string | null | undefined) =>
        !valor?.trim() || paraEmbed(valor) ? true : 'Use um link do YouTube ou do Vimeo.',
      admin: {
        condition: (_, irmaos) => irmaos?.mediaMode === 'video',
        description: {
          pt: 'YouTube ou Vimeo. O vídeo só carrega quando o visitante clica no play.',
          en: 'YouTube or Vimeo. The video only loads when the visitor clicks play.',
        },
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      filterOptions: { mimeType: { contains: 'image/' } },
      label: { pt: 'Imagens', en: 'Images' },
      admin: {
        condition: (_, irmaos) => irmaos?.mediaMode !== 'none',
        description: {
          pt: 'Em “uma imagem”, só a primeira é usada. Na rolagem, todas. Em “um vídeo”, a primeira é a capa mostrada antes do play.',
          en: 'With a single image only the first is used. In the marquee, all of them. With a video, the first is the cover shown before play.',
        },
      },
    },
    {
      name: 'ctas',
      type: 'array',
      maxRows: 2,
      label: { pt: 'Botões', en: 'Buttons' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', required: true, label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    {
      /* MIG-056. O botão do herói de solução é laranja e um pouco maior que o
       * das páginas institucionais (`SolutionAI.tsx:151` contra
       * `About.tsx:186`) — é a chamada comercial da página, não um link de
       * navegação. Cor, respiro e corpo do texto andam juntos. */
      name: 'ctaVariant',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { value: 'primary', label: { pt: 'Azul, compacto', en: 'Blue, compact' } },
        { value: 'secondary', label: { pt: 'Laranja, destacado', en: 'Orange, prominent' } },
      ],
      label: { pt: 'Estilo do botão', en: 'Button style' },
      admin: { condition: (_, irmaos) => (irmaos?.ctas?.length ?? 0) > 0 },
    },
    {
      /* Mesmo motivo de `headerWidth` no `iconCardGrid`: a largura da linha é
       * escolha de composição, e o legado usa duas — `max-w-xl` nas páginas
       * institucionais, `max-w-2xl` na de solução (`SolutionAI.tsx:123`). */
      name: 'descriptionWidth',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { value: 'narrow', label: { pt: 'Estreita', en: 'Narrow' } },
        { value: 'wide', label: { pt: 'Larga', en: 'Wide' } },
      ],
      label: { pt: 'Largura da descrição', en: 'Description width' },
      admin: { condition: (_, irmaos) => Boolean(irmaos?.description) },
    },
    {
      /* Os três números do herói de solução (`SolutionAI.tsx:128`). Ficam no
       * bloco, e não no global `site-settings`: são resultados **daquela**
       * oferta, não métricas da empresa — o `statsGrid` é que consome o global. */
      name: 'metrics',
      type: 'array',
      maxRows: 3,
      label: { pt: 'Números do herói', en: 'Hero metrics' },
      fields: [
        { name: 'value', type: 'number', required: true, label: { pt: 'Valor', en: 'Value' } },
        { name: 'suffix', type: 'text', label: { pt: 'Sufixo', en: 'Suffix' } },
        { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Legenda', en: 'Label' } },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { value: 'primary', label: { pt: 'Azul', en: 'Blue' } },
            { value: 'secondary', label: { pt: 'Laranja', en: 'Orange' } },
            { value: 'emerald', label: { pt: 'Verde', en: 'Green' } },
          ],
          label: { pt: 'Cor', en: 'Colour' },
        },
      ],
    },
    ...camposComuns,
  ],
}

export const RichTextSection: Block = {
  slug: 'richTextSection',
  labels: { singular: { pt: 'Texto com imagem', en: 'Text with image' }, plural: { pt: 'Textos', en: 'Text sections' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'body', type: 'richText', localized: true, label: { pt: 'Texto', en: 'Body' } },
    { name: 'image', type: 'upload', relationTo: 'media', label: { pt: 'Imagem', en: 'Image' } },
    {
      /* O legado fecha a seção "quem somos" com um botão (`About.tsx:308`). */
      name: 'ctas',
      type: 'array',
      maxRows: 2,
      label: { pt: 'Botões', en: 'Buttons' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', required: true, label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    {
      /* A seção do trainee (`Careers.tsx:579`) põe linha de apoio, título e
       * descrição **centralizados acima** das duas colunas; /sobre os mantém
       * dentro da coluna de texto. */
      name: 'headerLayout',
      type: 'select',
      defaultValue: 'inline',
      options: [
        { value: 'inline', label: { pt: 'Junto ao texto', en: 'With the text' } },
        { value: 'centered', label: { pt: 'Centralizado acima', en: 'Centred above' } },
      ],
      label: { pt: 'Cabeçalho', en: 'Header' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { pt: 'Descrição do cabeçalho', en: 'Header description' },
      admin: { condition: (_, irmaos) => irmaos?.headerLayout === 'centered' },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: { pt: 'Subtítulo da coluna', en: 'Column subtitle' },
      admin: { condition: (_, irmaos) => irmaos?.headerLayout === 'centered' },
    },
    {
      /* A caixa de status do trainee (`Careers.tsx:599`): um `<strong>` azul em
       * linha própria seguido de um parágrafo, dentro de um quadro com borda.
       * Não sai de rich text — o editor não escreve o quadro — e desenhá-la com
       * `blockquote` daria outra caixa. Daí os dois campos. */
      name: 'callout',
      type: 'group',
      label: { pt: 'Caixa de destaque', en: 'Callout box' },
      admin: { condition: (_, irmaos) => irmaos?.headerLayout === 'centered' },
      fields: [
        { name: 'label', type: 'text', localized: true, label: { pt: 'Rótulo', en: 'Label' } },
        { name: 'text', type: 'textarea', localized: true, label: { pt: 'Texto', en: 'Text' } },
      ],
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { value: 'left', label: { pt: 'À esquerda', en: 'Left' } },
        { value: 'right', label: { pt: 'À direita', en: 'Right' } },
        { value: 'none', label: { pt: 'Sem imagem', en: 'No image' } },
      ],
      label: { pt: 'Posição da imagem', en: 'Image position' },
    },
    {
      /* 05/10: o parágrafo desta seção era o menor do site (12/14px). "Normal"
       * subiu para o tamanho dos outros parágrafos de destaque, e "Grande" é a
       * escolha do editor para texto que precisa de mais presença. */
      name: 'bodySize',
      type: 'radio',
      defaultValue: 'normal',
      options: [
        { value: 'normal', label: { pt: 'Normal', en: 'Normal' } },
        { value: 'large', label: { pt: 'Grande', en: 'Large' } },
      ],
      label: { pt: 'Tamanho do texto', en: 'Text size' },
      admin: {
        layout: 'horizontal',
        description: {
          pt: 'O tamanho dos parágrafos desta seção. "Grande" fica 2 pontos acima do normal.',
          en: 'The size of this section’s paragraphs. "Large" is 2 points above normal.',
        },
      },
    },
    ...camposComuns,
  ],
}

export const IconCardGrid: Block = {
  slug: 'iconCardGrid',
  labels: { singular: { pt: 'Grade de cards', en: 'Icon card grid' }, plural: { pt: 'Grades', en: 'Icon card grids' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: ['2', '3', '4'].map((v) => ({ value: v, label: v })),
      label: { pt: 'Colunas', en: 'Columns' },
    },
    {
      /* O legado usa a mesma grade com dois cards diferentes, e **os dois só
       * têm título** (`About.tsx:403` e `:434`) — a forma é escolha do bloco,
       * não consequência de ter descrição. Foi o que assumi em MIG-047 e estava
       * errado. */
      name: 'variant',
      type: 'select',
      defaultValue: 'compact',
      options: [
        { value: 'compact', label: { pt: 'Compacto e centralizado', en: 'Compact, centred' } },
        { value: 'card', label: { pt: 'Card alto', en: 'Tall card' } },
        /* Terceira forma: card centralizado **com** descrição — "Vantagens de
         * ser ATRA" (`Careers.tsx:566`). O `compact` centraliza mas só tem
         * título; o `card` tem descrição e alinha à esquerda. */
        { value: 'card-centered', label: { pt: 'Card centralizado', en: 'Centred card' } },
      ],
      label: { pt: 'Formato do card', en: 'Card shape' },
    },
    {
      /* Outra inconsistência do legado: `porque-escolher` limita o cabeçalho a
       * `max-w-3xl` e as outras grades não. Com título longo isso muda quantas
       * linhas ele ocupa — 206px de diferença na página. */
      name: 'headerWidth',
      type: 'select',
      defaultValue: 'full',
      options: [
        { value: 'full', label: { pt: 'Largura total', en: 'Full width' } },
        { value: 'narrow', label: { pt: 'Estreito (quebra mais cedo)', en: 'Narrow' } },
      ],
      label: { pt: 'Largura do cabeçalho', en: 'Header width' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Cards', en: 'Cards' },
      fields: [
        campoDeIcone,
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        {
          /* Opcional porque o legado usa a mesma grade de dois jeitos: uma só
           * com rótulo (`About.tsx:403`) e outra com título e texto (`:434`).
           * O card muda de forma conforme o preenchimento, em vez de virarem
           * dois blocos quase idênticos. */
          name: 'description',
          type: 'textarea',
          localized: true,
          label: { pt: 'Descrição', en: 'Description' },
          admin: {
            description: {
              pt: 'Vazio, o card fica compacto e centralizado.',
              en: 'Left empty, the card renders compact and centred.',
            },
          },
        },
      ],
    },
    ...camposComuns,
  ],
}

export const CtaBanner: Block = {
  slug: 'ctaBanner',
  labels: { singular: { pt: 'Faixa de chamada', en: 'CTA banner' }, plural: { pt: 'Faixas', en: 'CTA banners' } },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'highlight', type: 'text', localized: true, label: { pt: 'Trecho destacado', en: 'Highlighted text' } },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    {
      name: 'cta',
      type: 'group',
      label: { pt: 'Botão', en: 'Button' },
      fields: [
        { name: 'label', type: 'text', localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    {
      /* MIG-056: o segundo botão e a legenda só existem na variante escura
       * (`SolutionAI.tsx:846`) — lá o CTA principal é o WhatsApp e o
       * secundário leva à ATRA AI, com a legenda explicando o que é. */
      name: 'secondaryCta',
      type: 'group',
      label: { pt: 'Botão secundário', en: 'Secondary button' },
      admin: { condition: (_, irmaos) => irmaos?.variant === 'dark' },
      fields: [
        { name: 'label', type: 'text', localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
        { name: 'caption', type: 'text', localized: true, label: { pt: 'Legenda abaixo', en: 'Caption below' } },
      ],
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { value: 'primary', label: { pt: 'Azul', en: 'Primary' } },
        { value: 'subtle', label: { pt: 'Discreta', en: 'Subtle' } },
        /* Terceira forma, de MIG-056: a mesma caixa escura do herói, fechando a
         * página de solução. Não é o `ctaContact` — aquele carrega formulário. */
        { value: 'dark', label: { pt: 'Caixa escura', en: 'Dark box' } },
        /* Mesma moldura escura, conteúdo centralizado e os dois botões lado a
         * lado — é a faixa que fecha a página de parceiro
         * (`PartnerPageBase.tsx:312`). A `dark` alinha à esquerda e empilha. */
        { value: 'dark-centered', label: { pt: 'Caixa escura, centralizada', en: 'Dark box, centred' } },
      ],
      label: { pt: 'Estilo', en: 'Style' },
    },
    ...camposComuns,
  ],
}

export const StatsGrid: Block = {
  slug: 'statsGrid',
  labels: { singular: { pt: 'Números', en: 'Stats grid' }, plural: { pt: 'Números', en: 'Stats grids' } },
  fields: [
    {
      /* `siteSettings` é o padrão de propósito: o número institucional tem que
       * ser o mesmo no site inteiro, e foi por duas páginas divergirem que P-01
       * existe. `custom` fica para grade que não é institucional. */
      name: 'source',
      type: 'select',
      defaultValue: 'siteSettings',
      options: [
        { value: 'siteSettings', label: { pt: 'Dados institucionais', en: 'Site settings' } },
        { value: 'custom', label: { pt: 'Números próprios deste bloco', en: 'Custom to this block' } },
      ],
      label: { pt: 'Origem dos números', en: 'Figures from' },
    },
    {
      name: 'customItems',
      type: 'array',
      label: { pt: 'Números', en: 'Figures' },
      admin: { condition: (_, irmaos) => irmaos?.source === 'custom' },
      fields: [
        { name: 'value', type: 'number', required: true, label: { pt: 'Número', en: 'Value' } },
        { name: 'suffix', type: 'text', label: { pt: 'Sufixo', en: 'Suffix' } },
        { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Rótulo', en: 'Label' } },
      ],
    },
    ...camposComuns,
  ],
}

/* Mosaico de parceiros (07/10) — cartões com imagem, nome do parceiro e link,
 * numa grade de tamanhos mistos que se arruma sozinha pela quantidade.
 *
 * Nasceu da página de Assessoria em Produtos: o marketing montou a seção com a
 * vitrine de conteúdo da home, que distribui em colunas, e com 5 parceiros a
 * terceira coluna ficava com um cartão só. Aqui o arranjo é fechado por
 * quantidade (`lib/mosaico.ts`).
 *
 * Imagem, nome e destino são do cartão, e não do cadastro de Parceiros: a
 * imagem é uma arte quadrada feita para esta seção (o logo do cadastro não
 * serve), e o destino pode ser a página do parceiro ou o site dele. */
export const PartnerMosaic: Block = {
  slug: 'partnerMosaic',
  labels: {
    singular: { pt: 'Mosaico de parceiros', en: 'Partner mosaic' },
    plural: { pt: 'Mosaicos de parceiros', en: 'Partner mosaics' },
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { pt: 'Descrição', en: 'Description' },
      admin: {
        description: {
          pt: 'Opcional. Uma linha em branco separa os parágrafos.',
          en: 'Optional. A blank line separates paragraphs.',
        },
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      label: { pt: 'Parceiros', en: 'Partners' },
      admin: {
        description: {
          pt: 'De 4 a 6 é o ideal: o mosaico se arruma sozinho. Com 4 ou 5, o primeiro da lista é o cartão grande; com 6, o primeiro e o último são os largos. Arraste para mudar a ordem.',
          en: 'Four to six is ideal: the mosaic arranges itself. With 4 or 5 the first one is the large card; with 6, the first and the last are the wide ones. Drag to reorder.',
        },
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: { pt: 'Imagem', en: 'Image' },
          admin: {
            description: {
              pt: 'Quadrada, com pelo menos 1200px. No cartão largo ela é cortada em faixa pelo meio: deixe o principal no centro.',
              en: 'Square, at least 1200px. The wide card crops it to a band through the middle: keep the subject centred.',
            },
          },
        },
        { name: 'name', type: 'text', required: true, label: { pt: 'Nome do parceiro', en: 'Partner name' } },
        {
          name: 'linkLabel',
          type: 'text',
          localized: true,
          label: { pt: 'Texto do link', en: 'Link label' },
          admin: { description: { pt: 'Ex.: “Ferramentas”.', en: 'E.g. “Tools”.' } },
        },
        {
          name: 'href',
          type: 'text',
          label: { pt: 'Destino', en: 'Target' },
          admin: {
            description: {
              pt: 'A página do parceiro no site (/parceiros/google-cloud) ou um endereço completo, com https://. Vazio, o cartão não é link.',
              en: 'The partner page on the site (/parceiros/google-cloud) or a full address, with https://. Empty: the card is not a link.',
            },
          },
        },
      ],
    },
    ...camposComuns,
  ],
}

export const PartnerShowcase: Block = {
  slug: 'partnerShowcase',
  labels: { singular: { pt: 'Vitrine de parceiros', en: 'Partner showcase' }, plural: { pt: 'Vitrines', en: 'Partner showcases' } },
  fields: [
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      /* ⚠️ Pedido de 29/09: o bloco tem que refletir o cadastro. As 20 páginas
       * de solução e segmento guardavam uma **foto** da lista de parceiros
       * tirada no dia da migração, e parceiro novo no admin não chegava a
       * nenhuma delas — ao contrário da faixa da home, que lê a collection.
       * "Todos" é o padrão, e é o que toda vitrine existente virou (inclusive
       * /sobre, que mostrava 4 escolhidos: decisão do G-ferrari). "Escolher"
       * fica para quem precisar de uma seleção. */
      name: 'source',
      type: 'select',
      defaultValue: 'all',
      options: [
        { value: 'all', label: { pt: 'Todos os parceiros cadastrados', en: 'All registered partners' } },
        { value: 'selected', label: { pt: 'Escolher os parceiros', en: 'Choose the partners' } },
      ],
      label: { pt: 'Quais parceiros', en: 'Which partners' },
      admin: {
        description: {
          pt: 'Em "Todos", a vitrine acompanha o cadastro de Parceiros, na ordem de lá: entrou, saiu ou mudou a ordem, muda aqui.',
          en: 'With "All", the showcase follows the Partners collection, in its order.',
        },
      },
    },
    {
      /* Relação com `partners`, não upload solto: o logo do Google Cloud
       * aparece aqui, na página do parceiro e no card de case. Um lugar só.
       * Só vale em "Escolher"; em "Todos" a lista é ignorada. */
      name: 'partners',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      label: { pt: 'Parceiros', en: 'Partners' },
      admin: { condition: (_, irmaos) => irmaos?.source === 'selected' },
      validate: (valor: unknown, { siblingData }: { siblingData: Record<string, unknown> }) =>
        siblingData?.source !== 'selected' || (Array.isArray(valor) && valor.length > 0) || 'Escolha ao menos um parceiro.',
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      defaultValue: true,
      label: { pt: 'Logos em escala de cinza', en: 'Greyscale logos' },
      admin: { description: { pt: 'Ganham cor ao passar o mouse.', en: 'They gain colour on hover.' } },
    },
    ...camposComuns,
  ],
}

export const ValueCards: Block = {
  slug: 'valueCards',
  labels: { singular: { pt: 'Cards de valores', en: 'Value cards' }, plural: { pt: 'Cards de valores', en: 'Value cards' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      /* "O **Jeito ATRA** de Ser" (`Careers.tsx:212`): mesmo destaque azul do
       * herói, no título da seção. /sobre não usa. */
      name: 'highlight',
      type: 'text',
      localized: true,
      label: { pt: 'Trecho destacado', en: 'Highlighted text' },
    },
    {
      /* O legado desenha os **mesmos três valores** com dois cartões
       * diferentes: `About.tsx:357` é o `GlowCard` curto; `Careers.tsx:222` é
       * uma versão alta, com tagline colorida, divisor e checklist, e cabeçalho
       * de pílula com descrição. Mesmo conteúdo, anatomia diferente — por isso
       * variante, e não um bloco novo (blocos.md, regra 3). */
      name: 'variant',
      type: 'select',
      defaultValue: 'glow',
      options: [
        { value: 'glow', label: { pt: 'Cartão curto', en: 'Short card' } },
        { value: 'expanded', label: { pt: 'Cartão alto com checklist', en: 'Tall card with checklist' } },
      ],
      label: { pt: 'Forma do cartão', en: 'Card shape' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { pt: 'Descrição do cabeçalho', en: 'Header description' },
      admin: { condition: (_, irmaos) => irmaos?.variant === 'expanded' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Valores', en: 'Values' },
      fields: [
        campoDeIcone,
        {
          /* Só o cartão alto tem checklist. A "tagline" colorida dele **é** o
           * `description` — `Careers.tsx:232` e `About.tsx:353` trazem a mesma
           * frase; muda a cor e o `min-h`, não o texto. Um campo, dois desenhos. */
          name: 'bullets',
          type: 'array',
          label: { pt: 'Checklist', en: 'Checklist' },
          fields: [
            { name: 'text', type: 'textarea', required: true, localized: true, label: { pt: 'Texto', en: 'Text' } },
          ],
        },
        {
          name: 'glowColor',
          type: 'select',
          defaultValue: 'blue',
          options: [
            { value: 'blue', label: { pt: 'Azul', en: 'Blue' } },
            { value: 'orange', label: { pt: 'Laranja', en: 'Orange' } },
          ],
          label: { pt: 'Cor do brilho', en: 'Glow colour' },
        },
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', required: true, localized: true, label: { pt: 'Descrição', en: 'Description' } },
      ],
    },
    ...camposComuns,
  ],
}

export const StickyPageNav: Block = {
  slug: 'stickyPageNav',
  labels: { singular: { pt: 'Menu da página', en: 'Page nav' }, plural: { pt: 'Menus da página', en: 'Page navs' } },
  /* Sem campo de itens: eles são **derivados** dos blocos que preencheram
   * `anchor` (blocos.md, regra 2). Deixar o editor digitar a lista à mão
   * garantiria menu apontando para seção que não existe mais — o erro que este
   * bloco existe para não ter. Ele só marca **onde** o menu aparece. */
  fields: [
    {
      /* MIG-056. Os dois menus fixos do legado **não são o mesmo componente**:
       * o de `About.tsx:258` acompanha desde o mobile, tem borda e respiro
       * embaixo; o de `SolutionAI.tsx:181` some abaixo de `md`, sobe para
       * `z-50` e gruda 4px mais alto. Não dá para escolher um: o aceite visual
       * é contra cada página. */
      name: 'variant',
      type: 'select',
      defaultValue: 'institutional',
      options: [
        { value: 'institutional', label: { pt: 'Institucional', en: 'Institutional' } },
        { value: 'solution', label: { pt: 'Solução (some no mobile)', en: 'Solution (hidden on mobile)' } },
      ],
      label: { pt: 'Estilo', en: 'Style' },
    },
    {
      /* ⚠️ E há um terceiro eixo, independente do estilo: /sobre fecha o menu
       * com `mb-8 sm:mb-10` (`About.tsx:259`) e /carreiras não (`Careers.tsx:161`),
       * embora os dois sejam o menu institucional. São 40px que empurram a
       * página inteira — o suficiente para reprovar o aceite sozinhos. */
      name: 'bottomGap',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { value: 'normal', label: { pt: 'Com respiro abaixo', en: 'Gap below' } },
        { value: 'none', label: { pt: 'Colado na seção seguinte', en: 'Flush with next section' } },
      ],
      label: { pt: 'Respiro abaixo', en: 'Gap below' },
    },
    ...camposComuns,
  ],
}

export const SealsBanner: Block = {
  slug: 'sealsBanner',
  labels: { singular: { pt: 'Faixa de selos', en: 'Seals banner' }, plural: { pt: 'Faixas de selos', en: 'Seals banners' } },
  /* Os selos vêm de `site-settings` — são os mesmos em /carreiras, /sobre e na
   * home. O bloco só escolhe o título e onde a faixa aparece. */
  fields: [
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    ...camposComuns,
  ],
}

/* Grade de imagens soltas — selos, certificações, prêmios. Nasceu para os 10
 * selos do Google Cloud da página Data Analytics do WordPress (27/09), que
 * nenhum bloco comportava: a faixa de selos lê os de `site-settings`, e a de
 * parceiros, a collection `partners`. Aqui as imagens são do próprio bloco.
 *
 * O texto alternativo vem de cada imagem, na Biblioteca: é ali que o editor já
 * descreve a mídia, e repetir o campo aqui daria dois lugares para divergir. */
export const ImageGrid: Block = {
  slug: 'imageGrid',
  labels: { singular: { pt: 'Grade de imagens', en: 'Image grid' }, plural: { pt: 'Grades de imagens', en: 'Image grids' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Imagens', en: 'Images' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true, label: { pt: 'Imagem', en: 'Image' } },
        { name: 'caption', type: 'text', localized: true, label: { pt: 'Legenda', en: 'Caption' } },
      ],
    },
    {
      /* Ligado por padrão: selo e certificado costumam vir em JPEG de fundo
       * branco, que no tema escuro vira um quadrado solto. A caixa branca é a
       * mesma solução da faixa de selos. */
      name: 'boxed',
      type: 'checkbox',
      defaultValue: true,
      label: { pt: 'Caixa branca atrás de cada imagem', en: 'White box behind each image' },
    },
    ...camposComuns,
  ],
}

export const ProcessSteps: Block = {
  slug: 'processSteps',
  labels: { singular: { pt: 'Etapas de processo', en: 'Process steps' }, plural: { pt: 'Etapas', en: 'Process steps' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Etapas', en: 'Steps' },
      admin: {
        description: {
          pt: 'A numeração é automática, pela ordem. Arraste para reordenar.',
          en: 'Numbering follows the order. Drag to reorder.',
        },
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', required: true, localized: true, label: { pt: 'Descrição', en: 'Description' } },
      ],
    },
    ...camposComuns,
  ],
}

export const CtaContact: Block = {
  slug: 'ctaContact',
  labels: { singular: { pt: 'Contato com formulário', en: 'Contact CTA' }, plural: { pt: 'Contatos', en: 'Contact CTAs' } },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'subtitle', type: 'text', localized: true, label: { pt: 'Subtítulo', en: 'Subtitle' } },
    {
      name: 'showContactCard',
      type: 'checkbox',
      defaultValue: true,
      label: { pt: 'Mostrar o cartão de contato', en: 'Show the contact card' },
      admin: { description: { pt: 'Telefone, e-mail, endereço (quando houver) e redes ao lado do formulário.', en: 'Phone, e-mail, address (when there is one) and socials beside the form.' } },
    },
    {
      /* ⚠️ As duas formas não são estilo: são markups diferentes do legado.
       *
       * `panel` é a composição de /contato — rota **nova** (D-10), sem gabarito,
       * montada em MIG-053 a partir da faixa da home. `photo` é o porte fiel de
       * `App.tsx:2288`: quatro campos em vez de três mais textarea, botão
       * alinhado à direita, e um cartão com foto de fundo no lugar do painel de
       * gradiente. A home só fecha o aceite com a segunda. */
      name: 'variant',
      type: 'select',
      defaultValue: 'panel',
      options: [
        { value: 'panel', label: { pt: 'Cartão de gradiente', en: 'Gradient card' } },
        { value: 'photo', label: { pt: 'Cartão com foto', en: 'Photo card' } },
      ],
      label: { pt: 'Forma do cartão', en: 'Card shape' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: { pt: 'Foto de fundo do cartão', en: 'Card background photo' },
      admin: { condition: (_, irmaos) => irmaos?.variant === 'photo' },
    },
    ...camposComuns,
  ],
}

export const JobsList: Block = {
  slug: 'jobsList',
  labels: { singular: { pt: 'Lista de vagas', en: 'Jobs list' }, plural: { pt: 'Listas de vagas', en: 'Jobs lists' } },
  /* Sem campo de vagas: elas vêm da collection `jobs` (as publicadas), resolvidas
   * na página. Digitar a lista à mão recriaria o problema que a collection
   * existe para resolver — vaga fechada continuando no ar. */
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    { name: 'emptyText', type: 'text', localized: true, label: { pt: 'Texto quando não há vagas', en: 'Empty text' } },
    {
      /* ⚠️ O cartão "Banco de Talentos" vive **dentro** desta seção no legado
       * (`Careers.tsx:450`), abaixo da grade de vagas — não é uma faixa
       * separada. O porte de MIG-050 o transformou num `ctaContact` no fim da
       * página, o que muda a ordem e a altura de /carreiras. */
      name: 'talentBank',
      type: 'group',
      label: { pt: 'Banco de talentos', en: 'Talent bank' },
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
        { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'highlight', type: 'text', localized: true, label: { pt: 'Trecho destacado', en: 'Highlighted text' } },
        { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
        { name: 'note', type: 'text', localized: true, label: { pt: 'Aviso ao lado do ícone', en: 'Note beside the icon' } },
      ],
    },
    ...camposComuns,
  ],
}

/* ─────────────────────────────────────────────────────────────────────────
 * Blocos da página de solução (MIG-056).
 *
 * Justificativa exigida pela regra 3 de blocos.md. A composição prevista para
 * `solucoes/[slug]` era `pageHero → stickyPageNav → iconCardGrid →
 * processSteps → richTextSection → ctaBanner`, e **não corresponde ao legado**:
 * `SolutionAI.tsx` tem quatro seções com anatomia própria, nenhuma delas
 * expressável nos blocos existentes sem desfigurar o gabarito (D-15).
 *
 * - `iconCardGrid` e `valueCards` são cards de ícone+título+texto. As seções 01
 *   e 02 têm selo de etapa, lista de conferência, métricas, etiquetas e rodapé,
 *   e a 02 é um bento de 12 colunas com larguras diferentes por card.
 * - `processSteps` é uma grade de 4 cards numerados (veio de `Careers.tsx`).
 *   A seção 04 é imagem + acordeão, que é outra coisa.
 *
 * Os quatro nascem configuráveis porque esta página é o **template das outras
 * 5** (e das 13 de MIG-093): o que hoje é conteúdo de IA vira conteúdo de
 * qualquer solução sem componente novo.
 * ───────────────────────────────────────────────────────────────────────── */

/* A pílula de seção do legado (`SolutionAI.tsx:231`) é ícone + texto, e o ícone
 * muda por seção (Workflow, Sparkles, Target, Settings). Opcional, ao contrário
 * de `campoDeIcone`: seção sem pílula é uso normal. */
const campoDeIconeOpcional = (nome = 'eyebrowIcon'): Field => ({
  name: nome,
  type: 'select',
  options: ICONES.map((v) => ({ value: v, label: v })),
  label: { pt: 'Ícone da linha de apoio', en: 'Eyebrow icon' },
})

/* `select` e não texto de cor: o valor vira classe do Tailwind, e classe
 * montada em tempo de execução (`text-${x}`) o Tailwind não enxerga no build.
 * Cada opção precisa existir como string literal no componente. */
const campoDeAcento: Field = {
  name: 'accent',
  type: 'select',
  defaultValue: 'primary',
  options: [
    { value: 'primary', label: { pt: 'Azul', en: 'Blue' } },
    { value: 'secondary', label: { pt: 'Laranja', en: 'Orange' } },
  ],
  label: { pt: 'Cor de destaque', en: 'Accent colour' },
}

const camposDeCabecalho: Field[] = [
  { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
  campoDeIconeOpcional(),
  { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
  { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
]

export const MethodCards: Block = {
  slug: 'methodCards',
  labels: {
    singular: { pt: 'Cards de metodologia', en: 'Method cards' },
    plural: { pt: 'Cards de metodologia', en: 'Method cards' },
  },
  fields: [
    ...camposDeCabecalho,
    {
      /* O cabeçalho desta seção não é centralizado: é uma linha com o texto à
       * esquerda e um botão à direita (`SolutionAI.tsx:229`). Por isso o CTA
       * mora no bloco, e não numa faixa separada depois. */
      name: 'headerCta',
      type: 'group',
      label: { pt: 'Botão no cabeçalho', en: 'Header button' },
      fields: [
        { name: 'label', type: 'text', localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 3,
      label: { pt: 'Cards', en: 'Cards' },
      admin: { description: { pt: 'Três no legado, lado a lado.', en: 'Three in the prototype, side by side.' } },
      fields: [
        { ...campoDeIcone },
        campoDeAcento,
        {
          name: 'badge',
          type: 'text',
          localized: true,
          label: { pt: 'Selo da etapa', en: 'Step badge' },
          admin: { description: { pt: 'Ex.: 01 / DIAGNÓSTICO.', en: 'E.g. 01 / DIAGNOSIS.' } },
        },
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', required: true, localized: true, label: { pt: 'Descrição', en: 'Description' } },
        {
          name: 'bullets',
          type: 'array',
          label: { pt: 'Lista de conferência', en: 'Checklist' },
          fields: [{ name: 'text', type: 'text', required: true, localized: true, label: { pt: 'Item', en: 'Item' } }],
        },
      ],
    },
    ...camposComuns,
  ],
}

export const BentoGrid: Block = {
  slug: 'bentoGrid',
  labels: { singular: { pt: 'Grade bento', en: 'Bento grid' }, plural: { pt: 'Grades bento', en: 'Bento grids' } },
  fields: [
    ...camposDeCabecalho,
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Cards', en: 'Cards' },
      fields: [
        {
          /* Largura em colunas de uma grade de 12 (`SolutionAI.tsx:418`): o
           * legado usa 7+5 na primeira fileira e 6+6 na segunda. Lista fechada
           * porque cada valor é uma classe literal do Tailwind. */
          name: 'span',
          type: 'select',
          required: true,
          defaultValue: '6',
          options: [
            { value: '5', label: { pt: '5 de 12', en: '5 of 12' } },
            { value: '6', label: { pt: '6 de 12 (metade)', en: '6 of 12 (half)' } },
            { value: '7', label: { pt: '7 de 12', en: '7 of 12' } },
            { value: '12', label: { pt: '12 de 12 (inteira)', en: '12 of 12 (full)' } },
          ],
          label: { pt: 'Largura', en: 'Width' },
        },
        {
          /* Os cards da primeira fileira têm título maior que os da segunda
           * (`text-xl sm:text-2xl` contra `text-lg sm:text-xl`). É hierarquia
           * deliberada do legado, não consequência da largura — card de 6
           * colunas na fileira de cima seguiria grande. */
          name: 'size',
          type: 'select',
          defaultValue: 'supporting',
          options: [
            { value: 'featured-wide', label: { pt: 'Destaque maior', en: 'Lead' } },
            { value: 'featured', label: { pt: 'Destaque', en: 'Featured' } },
            { value: 'supporting', label: { pt: 'Apoio', en: 'Supporting' } },
          ],
          label: { pt: 'Peso', en: 'Weight' },
        },
        campoDeAcento,
        campoDeIconeOpcional('icon'),
        { name: 'badge', type: 'text', localized: true, label: { pt: 'Selo', en: 'Badge' } },
        {
          name: 'chip',
          type: 'text',
          localized: true,
          label: { pt: 'Etiqueta à direita', en: 'Right-hand chip' },
          admin: { description: { pt: 'Ex.: +70% Automação. Sai em verde.', en: 'E.g. +70% automation. Rendered in green.' } },
        },
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', required: true, localized: true, label: { pt: 'Descrição', en: 'Description' } },
        {
          name: 'metrics',
          type: 'array',
          maxRows: 3,
          label: { pt: 'Números', en: 'Metrics' },
          fields: [
            { name: 'value', type: 'text', required: true, label: { pt: 'Valor', en: 'Value' } },
            { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Legenda', en: 'Label' } },
            {
              name: 'color',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { value: 'primary', label: { pt: 'Azul', en: 'Blue' } },
                { value: 'secondary', label: { pt: 'Laranja', en: 'Orange' } },
                { value: 'emerald', label: { pt: 'Verde', en: 'Green' } },
              ],
              label: { pt: 'Cor', en: 'Colour' },
            },
          ],
        },
        {
          name: 'tags',
          type: 'array',
          label: { pt: 'Etiquetas', en: 'Tags' },
          fields: [{ name: 'name', type: 'text', required: true, localized: true, label: { pt: 'Etiqueta', en: 'Tag' } }],
        },
        {
          name: 'bullets',
          type: 'array',
          label: { pt: 'Lista de conferência', en: 'Checklist' },
          fields: [{ name: 'text', type: 'text', required: true, localized: true, label: { pt: 'Item', en: 'Item' } }],
        },
        { name: 'footer', type: 'text', localized: true, label: { pt: 'Rodapé do card', en: 'Card footer' } },
        {
          /* O legado fecha cada card de destaque com um glifo diferente:
           * `ArrowUpRight` no mais largo (`SolutionAI.tsx:470`) e `Cpu` no
           * outro (`:516`). Não dá para derivar do ícone do selo — no primeiro
           * card os dois diferem.
           *
           * Escrito por extenso, e não com spread de `campoDeIconeOpcional`:
           * espalhar um `Field` e acrescentar chaves desfaz o estreitamento da
           * união e o TypeScript passa a cobrar campos de `RowField`. */
          name: 'footerIcon',
          type: 'select',
          options: ICONES.map((v) => ({ value: v, label: v })),
          label: { pt: 'Ícone do rodapé', en: 'Footer icon' },
          admin: { condition: (_, irmaos) => Boolean(irmaos?.footer) },
        },
      ],
    },
    ...camposComuns,
  ],
}

export const AudienceSplit: Block = {
  slug: 'audienceSplit',
  labels: {
    singular: { pt: 'Para quem é', en: 'Who it is for' },
    plural: { pt: 'Seções "para quem é"', en: 'Who-it-is-for sections' },
  },
  fields: [
    ...camposDeCabecalho,
    {
      name: 'cta',
      type: 'group',
      label: { pt: 'Botão', en: 'Button' },
      fields: [
        { name: 'label', type: 'text', localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Perfis', en: 'Profiles' },
      fields: [
        { ...campoDeIcone },
        campoDeAcento,
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', required: true, localized: true, label: { pt: 'Descrição', en: 'Description' } },
      ],
    },
    ...camposComuns,
  ],
}

export const AccordionSteps: Block = {
  slug: 'accordionSteps',
  labels: {
    singular: { pt: 'Etapas em acordeão', en: 'Accordion steps' },
    plural: { pt: 'Etapas em acordeão', en: 'Accordion steps' },
  },
  fields: [
    ...camposDeCabecalho,
    { name: 'image', type: 'upload', relationTo: 'media', label: { pt: 'Imagem', en: 'Image' } },
    {
      name: 'imageBadge',
      type: 'group',
      label: { pt: 'Selo sobre a imagem', en: 'Badge over the image' },
      admin: { condition: (_, irmaos) => Boolean(irmaos?.image) },
      fields: [
        campoDeIconeOpcional('icon'),
        { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'subtitle', type: 'text', localized: true, label: { pt: 'Subtítulo', en: 'Subtitle' } },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Etapas', en: 'Steps' },
      admin: {
        description: {
          pt: 'A numeração é automática, pela ordem. A primeira já abre aberta.',
          en: 'Numbering follows the order. The first one starts expanded.',
        },
      },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', required: true, localized: true, label: { pt: 'Descrição', en: 'Description' } },
      ],
    },
    ...camposComuns,
  ],
}

/* Blocos do template de página de parceiro (MIG-054a).
 *
 * Justificativa (blocos.md, regra 3): o legado não monta essa página com seções
 * avulsas — tem um componente só, `PartnerPageBase.tsx`, que **todas** as 8
 * páginas de parceiro instanciam com props diferentes. Portar com os blocos
 * genéricos foi o que MIG-054 tentou, e a página saiu 38% mais curta: o herói
 * perdeu a faixa de prêmios, e as três seções de duas colunas viraram grades de
 * ícones que não têm coluna nenhuma.
 *
 * São dois blocos, não cinco, porque as três seções do meio são o **mesmo
 * esqueleto** em `PartnerPageBase` — muda só o que vai na coluna direita. */

export const PartnerHero: Block = {
  slug: 'partnerHero',
  labels: { singular: { pt: 'Abertura de parceiro', en: 'Partner hero' }, plural: { pt: 'Aberturas de parceiro', en: 'Partner heroes' } },
  fields: [
    { name: 'badge', type: 'text', localized: true, label: { pt: 'Selo', en: 'Badge' } },
    { name: 'chip', type: 'text', localized: true, label: { pt: 'Etiqueta', en: 'Chip' } },
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'highlight', type: 'text', localized: true, label: { pt: 'Trecho destacado', en: 'Highlighted text' } },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: { pt: 'Logo do parceiro', en: 'Partner logo' },
      admin: {
        description: {
          pt: 'Aparece em cada cartão da faixa de prêmios.',
          en: 'Shown on every award card in the strip.',
        },
      },
    },
    {
      name: 'logoDark',
      type: 'upload',
      relationTo: 'media',
      label: { pt: 'Logo do parceiro (tema escuro)', en: 'Partner logo (dark theme)' },
      admin: {
        description: {
          pt: 'Opcional. Vazio, o logo acima vale nos dois temas.',
          en: 'Optional. When empty, the logo above is used in both themes.',
        },
      },
    },
    {
      /* A faixa de prêmios (`PartnerPageBase.tsx:131`): cartões de largura fixa
       * que rolam na horizontal no mobile e centralizam a partir de `md`. O
       * título quebra linha por `whitespace-pre-line` — "Partner of the Year" e
       * "Service" são duas linhas no gabarito. */
      name: 'awards',
      type: 'array',
      label: { pt: 'Prêmios', en: 'Awards' },
      fields: [
        { name: 'topText', type: 'text', localized: true, label: { pt: 'Linha superior', en: 'Top line' } },
        { name: 'title', type: 'textarea', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'highlight', type: 'text', label: { pt: 'Destaque (ano)', en: 'Highlight (year)' } },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: { pt: 'Botão', en: 'Button' },
      fields: [
        { name: 'label', type: 'text', localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    ...camposComuns,
  ],
}

export const PartnerSplit: Block = {
  slug: 'partnerSplit',
  labels: { singular: { pt: 'Seção de parceiro', en: 'Partner section' }, plural: { pt: 'Seções de parceiro', en: 'Partner sections' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Linha de apoio', en: 'Eyebrow' } },
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      /* `whitespace-pre-line` no gabarito: as quebras do texto são preservadas
       * (`PartnerPageBase.tsx:181`). Por isso `textarea` e não `text`. */
      name: 'body',
      type: 'array',
      label: { pt: 'Parágrafos', en: 'Paragraphs' },
      fields: [
        { name: 'text', type: 'textarea', required: true, localized: true, label: { pt: 'Texto', en: 'Text' } },
      ],
    },
    {
      name: 'rightColumn',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { value: 'image', label: { pt: 'Imagem com etiqueta', en: 'Image with label' } },
        { value: 'checklist', label: { pt: 'Lista de conferência', en: 'Checklist' } },
        { value: 'specGrid', label: { pt: 'Grade de especializações', en: 'Specialisation grid' } },
      ],
      label: { pt: 'Coluna direita', en: 'Right column' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: { pt: 'Imagem', en: 'Image' },
      admin: { condition: (_, irmaos) => irmaos?.rightColumn === 'image' },
    },
    {
      name: 'imageLabel',
      type: 'text',
      localized: true,
      label: { pt: 'Etiqueta sobre a imagem', en: 'Image label' },
      admin: { condition: (_, irmaos) => irmaos?.rightColumn === 'image' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: { pt: 'Logo do parceiro', en: 'Partner logo' },
      admin: {
        // Só a etiqueta da imagem usa o logo: os cartões da grade o perderam em 29/09.
        condition: (_, irmaos) => irmaos?.rightColumn === 'image',
        description: {
          pt: 'Na etiqueta sobre a imagem.',
          en: 'Used in the image label.',
        },
      },
    },
    {
      name: 'logoDark',
      type: 'upload',
      relationTo: 'media',
      label: { pt: 'Logo do parceiro (tema escuro)', en: 'Partner logo (dark theme)' },
      admin: {
        condition: (_, irmaos) => irmaos?.rightColumn === 'image',
        description: {
          pt: 'Opcional. Vazio, o logo acima vale nos dois temas.',
          en: 'Optional. When empty, the logo above is used in both themes.',
        },
      },
    },
    {
      name: 'items',
      type: 'array',
      label: { pt: 'Itens', en: 'Items' },
      admin: {
        description: {
          pt: 'Na lista de conferência, uma frase por linha. Na grade, o nome da especialização — que também vira a lista de fichas à esquerda.',
          en: 'In the checklist, one sentence per row. In the grid, the specialisation name, which also feeds the chips on the left.',
        },
      },
      fields: [
        { name: 'text', type: 'text', required: true, localized: true, label: { pt: 'Texto', en: 'Text' } },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: { pt: 'Botão', en: 'Button' },
      fields: [
        { name: 'label', type: 'text', localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    {
      /* Só a seção de especializações tem, e é link de texto com seta, não
       * botão (`PartnerPageBase.tsx:287`). */
      name: 'linkCta',
      type: 'group',
      label: { pt: 'Link de texto', en: 'Text link' },
      admin: { condition: (_, irmaos) => irmaos?.rightColumn === 'specGrid' },
      fields: [
        { name: 'label', type: 'text', localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    ...camposComuns,
  ],
}

/* Blocos da home (MIG-057).
 *
 * Justificativa (blocos.md, regra 3): a home do legado não reusa nenhuma seção
 * das páginas internas — são oito componentes próprios em `App.tsx`, do herói
 * de partículas ao carrossel de cases. A composição prevista no plano também
 * estava incompleta: previa `hero`, `featureTabs` e `logoMarquee`, e a seção do
 * prompt de IA com os logos de cliente (`App.tsx:2055`) não estava lá. */

export const HomeHero: Block = {
  slug: 'homeHero',
  labels: { singular: { pt: 'Herói da home', en: 'Home hero' }, plural: { pt: 'Heróis da home', en: 'Home heroes' } },
  fields: [
    { name: 'titlePrefix', type: 'text', required: true, localized: true, label: { pt: 'Início do título', en: 'Title prefix' } },
    {
      /* A palavra laranja que troca a cada 2,5s (`aether-flow-hero.tsx:471`).
       * Com `?e2e=1` fica na primeira — nos dois apps, ou o gabarito dependeria
       * de quando a captura pegou o ciclo. */
      name: 'rotatingWords',
      type: 'text',
      hasMany: true,
      required: true,
      localized: true,
      label: { pt: 'Palavras que giram', en: 'Rotating words' },
    },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    { name: 'scrollLabel', type: 'text', localized: true, label: { pt: 'Texto do indicador de rolagem', en: 'Scroll cue label' } },
    {
      /* ⚠️ A caixa de conversa fica **dentro** deste bloco, e não num bloco
       * irmão, porque no legado ela é filha do herói (`App.tsx:2548` passa
       * `<Clients />` como `children` de `AetherFlowHero`). O canvas é
       * `absolute inset-0` do container que envolve os dois: separá-los encurta
       * o canvas para a altura do herói, muda a densidade de partículas — que
       * sai de `largura * altura / 22000` — e tira o fundo de baixo da caixa. */
      name: 'prompt',
      type: 'group',
      label: { pt: 'Caixa de conversa com a IA', en: 'AI prompt box' },
      fields: [
        { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'placeholder', type: 'text', localized: true, label: { pt: 'Texto do campo', en: 'Input placeholder' } },
        { name: 'disclaimer', type: 'textarea', localized: true, label: { pt: 'Aviso sob a caixa', en: 'Disclaimer' } },
        { name: 'clientsTitle', type: 'text', localized: true, label: { pt: 'Título dos logos de cliente', en: 'Client logos title' } },
        /* ⚠️ Os logos **não** ficam aqui: vêm da collection `clients`, resolvida
         * pela página (MIG-071). Eram um array neste bloco até a Fase 4a, e a
         * mesma lista já vivia à mão no legado em outro lugar — é o tipo de
         * duplicação que a migração existe para acabar. */
      ],
    },
    ...camposComuns,
  ],
}

export const LogoMarquee: Block = {
  slug: 'logoMarquee',
  labels: { singular: { pt: 'Faixa de logos', en: 'Logo strip' }, plural: { pt: 'Faixas de logos', en: 'Logo strips' } },
  fields: [
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      /* ⚠️ Campo aposentado: os logos da faixa saem da collection `partners`
       * (`resolverPagina`), a mesma do mega-menu, para uma troca de logo no
       * admin valer nos dois lugares.
       *
       * Antes era lista própria porque o legado mostra 9 logos e a collection
       * tem 8 — o nono é um "Partner" sem nome real (P-10). O dono pediu a faixa
       * ligada ao cadastro e cada logo levando à página do parceiro, e um logo
       * sem parceiro não leva a lugar nenhum: o nono sai da home.
       *
       * O campo fica, escondido, só para não exigir migração que apaga a
       * tabela e os dados antigos. Não é lido por ninguém. */
      name: 'partners',
      type: 'array',
      admin: { hidden: true },
      label: { pt: 'Logos', en: 'Logos' },
      fields: [
        { name: 'name', type: 'text', required: true, label: { pt: 'Nome', en: 'Name' } },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true, label: { pt: 'Logo', en: 'Logo' } },
      ],
    },
    ...camposComuns,
  ],
}

export const FeatureTabs: Block = {
  slug: 'featureTabs',
  labels: { singular: { pt: 'Abas de destaque', en: 'Feature tabs' }, plural: { pt: 'Abas de destaque', en: 'Feature tabs' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Pílula', en: 'Pill' } },
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Texto ao lado do título', en: 'Text beside the title' } },
    { name: 'footnote', type: 'text', localized: true, label: { pt: 'Rodapé do cartão', en: 'Card footnote' } },
    {
      name: 'cta',
      type: 'group',
      label: { pt: 'Botão do cartão', en: 'Card button' },
      fields: [
        { name: 'label', type: 'text', localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Abas', en: 'Tabs' },
      admin: {
        description: {
          pt: 'A numeração (01, 02…) sai da ordem. A primeira abre ativa.',
          en: 'Numbering (01, 02…) follows the order. The first one opens active.',
        },
      },
      fields: [
        campoDeIcone,
        { name: 'badge', type: 'text', required: true, localized: true, label: { pt: 'Etiqueta', en: 'Badge' } },
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', required: true, localized: true, label: { pt: 'Descrição', en: 'Description' } },
        { name: 'image', type: 'upload', relationTo: 'media', label: { pt: 'Imagem de fundo', en: 'Background image' } },
      ],
    },
    ...camposComuns,
  ],
}

export const HomeBento: Block = {
  slug: 'homeBento',
  labels: { singular: { pt: 'Bento da home', en: 'Home bento' }, plural: { pt: 'Bentos da home', en: 'Home bentos' } },
  fields: [
    {
      /* Cartão largo da esquerda (`App.tsx:1151`): ecossistema de parceiros. */
      name: 'partnerCard',
      type: 'group',
      label: { pt: 'Cartão de parceiros', en: 'Partners card' },
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Pílula', en: 'Pill' } },
        { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
        {
          name: 'items',
          type: 'array',
          maxRows: 3,
          label: { pt: 'Provedores', en: 'Providers' },
          fields: [
            { name: 'name', type: 'text', required: true, label: { pt: 'Nome', en: 'Name' } },
            { name: 'subtitle', type: 'text', localized: true, label: { pt: 'Nível', en: 'Tier' } },
            { name: 'logo', type: 'upload', relationTo: 'media', label: { pt: 'Logo', en: 'Logo' } },
          ],
        },
      ],
    },
    {
      /* Cartão da direita (`App.tsx:1218`): selos GPTW e LIPT. */
      name: 'sealsCard',
      type: 'group',
      label: { pt: 'Cartão de selos', en: 'Seals card' },
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Pílula', en: 'Pill' } },
        { name: 'counter', type: 'text', label: { pt: 'Número', en: 'Counter' }, admin: { description: { pt: 'Ex.: 5x', en: 'E.g. 5x' } } },
        { name: 'title', type: 'text', localized: true, label: { pt: 'Título ao lado do número', en: 'Title beside the counter' } },
        { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
        { name: 'badge', type: 'text', localized: true, label: { pt: 'Etiqueta âmbar', en: 'Amber badge' } },
        { name: 'footnote', type: 'text', localized: true, label: { pt: 'Rodapé do cartão', en: 'Card footnote' } },
        { name: 'seals', type: 'upload', relationTo: 'media', hasMany: true, label: { pt: 'Selos', en: 'Seals' } },
      ],
    },
    {
      /* ⚠️ Os quatro números ficam **aqui**, e não no global `site-settings`.
       *
       * A home diz 150+ profissionais e 20+ clientes; /sobre diz 140+ e 30+
       * (`About.tsx` contra `App.tsx:1336`). Ligar os dois ao mesmo global
       * consertaria a divergência de passagem — e ela é P-01, decisão de
       * conteúdo, não de quem migra (D-22). */
      name: 'metrics',
      type: 'array',
      label: { pt: 'Números', en: 'Metrics' },
      fields: [
        campoDeIcone,
        { name: 'tag', type: 'text', required: true, localized: true, label: { pt: 'Etiqueta', en: 'Tag' } },
        { name: 'value', type: 'text', required: true, label: { pt: 'Número', en: 'Value' } },
        { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Legenda', en: 'Label' } },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { value: 'primary', label: { pt: 'Azul', en: 'Blue' } },
            { value: 'secondary', label: { pt: 'Laranja', en: 'Orange' } },
          ],
          label: { pt: 'Cor', en: 'Colour' },
        },
      ],
    },
    ...camposComuns,
  ],
}

export const CaseCarousel: Block = {
  slug: 'caseCarousel',
  labels: { singular: { pt: 'Carrossel de cases', en: 'Case carousel' }, plural: { pt: 'Carrosséis de cases', en: 'Case carousels' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Pílula', en: 'Pill' } },
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Texto ao lado do título', en: 'Text beside the title' } },
    { name: 'readLabel', type: 'text', localized: true, label: { pt: 'Texto do link no cartão', en: 'Card link label' } },
    {
      name: 'cta',
      type: 'group',
      label: { pt: 'Botão do cabeçalho', en: 'Header button' },
      fields: [
        { name: 'label', type: 'text', localized: true, label: { pt: 'Texto', en: 'Label' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    {
      /* ⚠️ Os cartões trazem o **próprio** texto em vez de sair da collection
       * `cases`, e isso é deliberado: o quinto card do gabarito
       * (`App.tsx:1660`) anuncia um case da RD Saúde que não existe, apontando
       * para o slug do Banco ABC. Puxar da collection sumiria com o cartão ou
       * mostraria o case errado — os dois resolvem P-11 por conta própria, e
       * P-11 é decisão de conteúdo. Some quando ela for respondida. */
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Cartões', en: 'Cards' },
      fields: [
        campoDeIcone,
        { name: 'company', type: 'text', required: true, localized: true, label: { pt: 'Cliente', en: 'Client' } },
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', required: true, localized: true, label: { pt: 'Descrição', en: 'Description' } },
        { name: 'href', type: 'text', required: true, label: { pt: 'Destino', en: 'Target' } },
        { name: 'image', type: 'upload', relationTo: 'media', label: { pt: 'Imagem', en: 'Image' } },
        {
          /* Cor de fundo do cartão de texto. Os cinco do gabarito são tons de
           * azul diferentes, escolhidos um a um (`App.tsx:1620` em diante). */
          name: 'color',
          type: 'text',
          required: true,
          label: { pt: 'Cor do cartão', en: 'Card colour' },
          admin: { description: { pt: 'Hexadecimal, ex.: #2A75C5.', en: 'Hex, e.g. #2A75C5.' } },
        },
      ],
    },
    ...camposComuns,
  ],
}

export const TestimonialCarousel: Block = {
  slug: 'testimonialCarousel',
  labels: { singular: { pt: 'Carrossel de depoimentos', en: 'Testimonial carousel' }, plural: { pt: 'Carrosséis de depoimentos', en: 'Testimonial carousels' } },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    /* ⚠️ Os depoimentos vêm da collection `testimonials`, com `featured`
     * marcado — não de um array aqui (MIG-071). Os mesmos 4 textos existiam
     * neste bloco e na collection, e um case podia anexar um depoimento que a
     * home mostrava com outra redação. */
    ...camposComuns,
  ],
}

export const ContentTeaser: Block = {
  slug: 'contentTeaser',
  labels: { singular: { pt: 'Vitrine de conteúdo', en: 'Content teaser' }, plural: { pt: 'Vitrines de conteúdo', en: 'Content teasers' } },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Pílula', en: 'Pill' } },
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    {
      /* ⚠️ Os quatro cartões pequenos do gabarito (`App.tsx:2200`) são
       * **fixture**: título inventado, capa do picsum e `href="#"`. Não saem das
       * collections porque a home do legado não os liga a nada. Ligar em
       * `/blog` e `/insights` é melhoria, e melhoria não entra com migração
       * (D-15) — vira task depois do aceite. */
      name: 'cards',
      type: 'array',
      label: { pt: 'Cartões', en: 'Cards' },
      fields: [
        campoDeIcone,
        { name: 'category', type: 'text', required: true, localized: true, label: { pt: 'Categoria', en: 'Category' } },
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
        { name: 'image', type: 'upload', relationTo: 'media', label: { pt: 'Capa', en: 'Cover' } },
        {
          name: 'column',
          type: 'select',
          required: true,
          defaultValue: 'first',
          options: [
            { value: 'first', label: { pt: 'Coluna 1 (sob o texto)', en: 'Column 1 (below the text)' } },
            { value: 'second', label: { pt: 'Coluna 2', en: 'Column 2' } },
          ],
          label: { pt: 'Coluna', en: 'Column' },
        },
      ],
    },
    {
      name: 'featured',
      type: 'group',
      label: { pt: 'Cartão em destaque', en: 'Featured card' },
      fields: [
        { name: 'category', type: 'text', localized: true, label: { pt: 'Categoria', en: 'Category' } },
        { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'ctaLabel', type: 'text', localized: true, label: { pt: 'Texto do botão', en: 'Button label' } },
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
        { name: 'image', type: 'upload', relationTo: 'media', label: { pt: 'Capa', en: 'Cover' } },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      label: { pt: 'Caixa de inscrição', en: 'Subscribe box' },
      fields: [
        { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'placeholder', type: 'text', localized: true, label: { pt: 'Texto do campo', en: 'Input placeholder' } },
      ],
    },
    ...camposComuns,
  ],
}

export const InsightsHub: Block = {
  slug: 'insightsHub',
  labels: { singular: { pt: 'Hub de insights', en: 'Insights hub' }, plural: { pt: 'Hubs de insights', en: 'Insights hubs' } },
  fields: [
    { name: 'badge', type: 'text', localized: true, label: { pt: 'Selo', en: 'Badge' } },
    { name: 'chip', type: 'text', localized: true, label: { pt: 'Etiqueta', en: 'Chip' } },
    { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
    { name: 'highlight', type: 'text', localized: true, label: { pt: 'Trecho destacado', en: 'Highlighted text' } },
    { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
    {
      /* Os formatos viram pílula no herói, aba no filtro e cartão no rodapé —
       * a mesma lista nos três lugares (`Insights.tsx:55`). O `count` é escrito
       * à mão no gabarito e **não** confere com o número de itens do hub. */
      name: 'formats',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Formatos', en: 'Formats' },
      fields: [
        { name: 'key', type: 'text', required: true, label: { pt: 'Chave', en: 'Key' } },
        { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Rótulo', en: 'Label' } },
        campoDeIcone,
        { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
      ],
    },
    {
      name: 'portals',
      type: 'group',
      label: { pt: 'Canais de conteúdo', en: 'Content channels' },
      fields: [
        { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      label: { pt: 'Caixa de inscrição', en: 'Subscribe box' },
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, label: { pt: 'Pílula', en: 'Pill' } },
        { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
      ],
    },
    {
      name: 'closing',
      type: 'group',
      label: { pt: 'Chamada final', en: 'Closing CTA' },
      fields: [
        { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
        { name: 'ctaLabel', type: 'text', localized: true, label: { pt: 'Botão principal', en: 'Primary button' } },
        { name: 'ctaHref', type: 'text', label: { pt: 'Destino principal', en: 'Primary target' } },
        { name: 'secondaryLabel', type: 'text', localized: true, label: { pt: 'Botão secundário', en: 'Secondary button' } },
        { name: 'secondaryHref', type: 'text', label: { pt: 'Destino secundário', en: 'Secondary target' } },
      ],
    },
    ...camposComuns,
  ],
}

export const HighlightCarousel: Block = {
  slug: 'highlightCarousel',
  labels: {
    singular: { pt: 'Carrossel de destaques', en: 'Highlight carousel' },
    plural: { pt: 'Carrosséis de destaques', en: 'Highlight carousels' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: { pt: 'Título da seção', en: 'Section title' },
      admin: { description: { pt: 'Opcional. Vazio, os banners aparecem sem cabeçalho.', en: 'Optional. When empty, the banners show without a heading.' } },
    },
    {
      /* Banners editáveis pelo marketing, um por destaque (reunião de 24/09):
       * nasceu com a RC18 e recebe Atra Analytics e PDD Febraban quando as
       * páginas existirem. O teto de 6 é de leitura, não técnico — com mais
       * que isso ninguém vê o último antes de rolar a página. */
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      label: { pt: 'Banners', en: 'Banners' },
      admin: { description: { pt: 'A ordem aqui é a ordem no carrossel.', en: 'The order here is the carousel order.' } },
      fields: [
        { name: 'tag', type: 'text', localized: true, label: { pt: 'Etiqueta', en: 'Tag' } },
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'textarea', localized: true, label: { pt: 'Texto', en: 'Text' } },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: { pt: 'Imagem', en: 'Image' },
          admin: {
            description: {
              pt: 'Opcional. Sem imagem, o banner usa o gradiente da marca. Horizontal, com pelo menos 1200px de largura: no celular ela é cortada em 16:9, no computador em 4:3.',
              en: 'Optional. Without an image the banner uses the brand gradient. Landscape, at least 1200px wide: cropped to 16:9 on mobile and 4:3 on desktop.',
            },
          },
        },
        {
          name: 'cta',
          type: 'group',
          label: { pt: 'Botão', en: 'Button' },
          fields: [
            { name: 'label', type: 'text', localized: true, label: { pt: 'Texto', en: 'Label' } },
            { name: 'href', type: 'text', label: { pt: 'Destino', en: 'Target' } },
          ],
        },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
      label: { pt: 'Avançar sozinho', en: 'Autoplay' },
      admin: {
        description: {
          pt: 'A cada 7 segundos, pausando com o mouse em cima ou o foco dentro. Nunca avança para quem pediu menos movimento no sistema.',
          en: 'Every 7 seconds, pausing on hover or focus. Never advances for visitors who asked the system for reduced motion.',
        },
      },
    },
    ...camposComuns,
  ],
}

/* O seletor "Adicionar Seção" do admin (feature seletor-de-secoes, task 031).
 *
 * ⚠️ O Payload agrupa pelo `admin.group` mas **não ordena**: o drawer mostra os
 * blocos na ordem deste array. Com 28 blocos numa lista só, a editora não achava
 * nem o carrossel da home (27/09). A ordem é montada aqui — grupo na sequência
 * de `GRUPOS`, e alfabética pelo rótulo em português dentro dele —, para bloco
 * novo cair no lugar certo sem ninguém reordenar à mão.
 *
 * A ordem não entra no schema: as tabelas de bloco são por slug, e reordenar
 * não gera migração (conferido com `migrate:create --skip-empty`). */
const GRUPOS = {
  abertura: { pt: 'Abertura e navegação', en: 'Opening and navigation' },
  texto: { pt: 'Texto e cards', en: 'Text and cards' },
  etapas: { pt: 'Etapas', en: 'Steps' },
  prova: { pt: 'Prova: números, selos e parceiros', en: 'Proof: figures, seals and partners' },
  vitrines: { pt: 'Carrosséis e vitrines', en: 'Carousels and showcases' },
  chamadas: { pt: 'Chamadas e contato', en: 'Calls to action and contact' },
}

type Grupo = keyof typeof GRUPOS

/* Bloco novo sem linha aqui cai sem grupo, no fim do seletor — e reprova
 * `index.test.ts`. O TypeScript não pega: o Payload tipa `slug` como `string`. */
const GRUPO_DO_BLOCO = {
  pageHero: 'abertura',
  partnerHero: 'abertura',
  homeHero: 'abertura',
  stickyPageNav: 'abertura',
  richTextSection: 'texto',
  iconCardGrid: 'texto',
  valueCards: 'texto',
  methodCards: 'texto',
  bentoGrid: 'texto',
  audienceSplit: 'texto',
  featureTabs: 'texto',
  processSteps: 'etapas',
  accordionSteps: 'etapas',
  statsGrid: 'prova',
  sealsBanner: 'prova',
  imageGrid: 'prova',
  partnerShowcase: 'prova',
  partnerMosaic: 'prova',
  logoMarquee: 'prova',
  partnerSplit: 'prova',
  highlightCarousel: 'vitrines',
  caseCarousel: 'vitrines',
  testimonialCarousel: 'vitrines',
  contentTeaser: 'vitrines',
  insightsHub: 'vitrines',
  homeBento: 'vitrines',
  ctaBanner: 'chamadas',
  ctaContact: 'chamadas',
  jobsList: 'chamadas',
} satisfies Record<string, Grupo>

const TODOS = [
  PageHero,
  StickyPageNav,
  StatsGrid,
  RichTextSection,
  IconCardGrid,
  ValueCards,
  PartnerShowcase,
  PartnerMosaic,
  SealsBanner,
  ImageGrid,
  ProcessSteps,
  MethodCards,
  BentoGrid,
  AudienceSplit,
  AccordionSteps,
  CtaContact,
  JobsList,
  CtaBanner,
  PartnerHero,
  PartnerSplit,
  HomeHero,
  LogoMarquee,
  FeatureTabs,
  HomeBento,
  CaseCarousel,
  HighlightCarousel,
  TestimonialCarousel,
  ContentTeaser,
  InsightsHub,
]

const ORDEM_DOS_GRUPOS = Object.keys(GRUPOS) as Grupo[]

export const grupoDe = (bloco: Block): Grupo | undefined =>
  (GRUPO_DO_BLOCO as Record<string, Grupo | undefined>)[bloco.slug]

export const rotuloPt = (bloco: Block): string => {
  const singular = bloco.labels?.singular
  return typeof singular === 'string' ? singular : ((singular as Record<string, string> | undefined)?.pt ?? bloco.slug)
}

/* A miniatura de cada card do seletor (task 033): a seção como aparece no
 * site, gerada por `e2e/miniaturas.spec.ts` em `public/miniaturas-de-blocos/`.
 * Fora de `public/admin/` de propósito: o caminho colidiria com a rota do
 * admin do Payload. */
export const miniaturaDe = (bloco: Block) => ({
  url: `/miniaturas-de-blocos/${bloco.slug}.webp`,
  alt: `Como fica a seção "${rotuloPt(bloco)}" no site`,
})

export const BLOCOS: Block[] = TODOS.map((b) => {
  const grupo = grupoDe(b)
  return {
    ...b,
    admin: {
      ...b.admin,
      ...(grupo ? { group: GRUPOS[grupo] } : {}),
      images: { thumbnail: miniaturaDe(b) },
    },
  }
}).sort(
  (a, b) =>
    ORDEM_DOS_GRUPOS.indexOf(grupoDe(a)!) - ORDEM_DOS_GRUPOS.indexOf(grupoDe(b)!) ||
    rotuloPt(a).localeCompare(rotuloPt(b), 'pt'),
)
