import type { Block, Field } from 'payload'

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
       * largura toda, que é o caso de /glossario e /carreiras. */
      name: 'mediaMode',
      type: 'select',
      defaultValue: 'none',
      options: [
        { value: 'none', label: { pt: 'Sem mídia', en: 'No media' } },
        { value: 'image', label: { pt: 'Uma imagem', en: 'Single image' } },
        { value: 'marquee', label: { pt: 'Fotos em rolagem', en: 'Scrolling photos' } },
      ],
      label: { pt: 'Mídia ao lado', en: 'Side media' },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: { pt: 'Imagens', en: 'Images' },
      admin: {
        condition: (_, irmaos) => irmaos?.mediaMode !== 'none',
        description: {
          pt: 'Em “uma imagem”, só a primeira é usada. Na rolagem, todas.',
          en: 'With a single image only the first is used. In the marquee, all of them.',
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

export const PartnerShowcase: Block = {
  slug: 'partnerShowcase',
  labels: { singular: { pt: 'Vitrine de parceiros', en: 'Partner showcase' }, plural: { pt: 'Vitrines', en: 'Partner showcases' } },
  fields: [
    { name: 'title', type: 'text', localized: true, label: { pt: 'Título', en: 'Title' } },
    {
      /* Relação com `partners`, não upload solto: o logo do Google Cloud
       * aparece aqui, na página do parceiro e no card de case. Um lugar só. */
      name: 'partners',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      required: true,
      label: { pt: 'Parceiros', en: 'Partners' },
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
      admin: { description: { pt: 'Telefone, e-mail, endereço e redes ao lado do formulário.', en: 'Phone, e-mail, address and socials beside the form.' } },
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

export const BLOCOS = [
  PageHero,
  StickyPageNav,
  StatsGrid,
  RichTextSection,
  IconCardGrid,
  ValueCards,
  PartnerShowcase,
  SealsBanner,
  ProcessSteps,
  MethodCards,
  BentoGrid,
  AudienceSplit,
  AccordionSteps,
  CtaContact,
  JobsList,
  CtaBanner,
]
