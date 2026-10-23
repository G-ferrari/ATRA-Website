import type { ReactNode } from 'react'
import type { SerializedAutoLinkNode, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import {
  RichText as RichTextPayload,
  type JSXConverter,
  type JSXConverterArgs,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'

import { localizarHref } from '@/lib/routes'

/* Renderização de rich text do Payload.
 *
 * A tipografia reproduz a do corpo de texto do legado
 * (`legacy/src/components/CaseDetailBase.tsx:82`), onde o campo era uma string
 * solta dentro de um `<p>`. Com um parágrafo só, a caixa resultante é idêntica:
 * o `mb-12` sai do parágrafo e vai para o contêiner, e o `space-y-6` só aparece
 * quando o editor escreve mais de um.
 *
 * `disableContainer` remove a div que o Payload injetaria por padrão — ela não
 * existe no legado e mudaria o espaçamento. */

/* Link do texto com o caminho português debaixo do idioma (`/en/sobre`) sai
 * com o caminho traduzido (`/en/about`), sem o 308 do `proxy.ts`. Só o destino
 * muda: quem desenha o `<a>` continua sendo o conversor do Payload. */
function comDestinoLocalizado<N extends SerializedLinkNode | SerializedAutoLinkNode>(
  conversor: JSXConverter<N> | undefined,
  args: JSXConverterArgs<N>,
): ReactNode {
  const url = args.node.fields.url
  const node = url ? { ...args.node, fields: { ...args.node.fields, url: localizarHref(url) } } : args.node
  return typeof conversor === 'function' ? conversor({ ...args, node }) : conversor
}

/* A tipografia do parágrafo é do **chamador**, não do conversor.
 *
 * Fixá-la aqui parecia certo enquanto só a página de case usava rich text; ao
 * entrar no bloco `richTextSection` o `text-lg` vazou para uma seção que no
 * legado é `text-xs sm:text-sm`, e a página ficou 35px mais alta no mobile. */
const conversores = (classeDoParagrafo?: string): JSXConvertersFunction =>
  ({ defaultConverters }) => ({
  ...defaultConverters,
  link: (args) => comDestinoLocalizado(defaultConverters.link, args),
  autolink: (args) => comDestinoLocalizado(defaultConverters.autolink, args),
  paragraph: ({ node, nodesToJSX }) => (
    <p className={classeDoParagrafo}>{nodesToJSX({ nodes: node.children })}</p>
  ),
  /* ⚠️ Regra do Par (DESIGN.md), com o valor escuro **por último**: sem o
   * `dark:` o título e a lista saíam `slate-900`/`slate-700` sobre o grafite do
   * tema escuro — invisíveis dentro de `bloco-texto`, que tem superfície
   * temática. Corolário: toda página que renderiza este componente precisa de
   * fundo temático (as páginas de detalhe ganharam `dark:bg-[#0e1015]` junto);
   * `dark:text-white` sobre um `bg-white` fixo seria o mesmo bug ao contrário. */
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag
    return (
      <Tag className="text-2xl text-slate-900 dark:text-white">{nodesToJSX({ nodes: node.children })}</Tag>
    )
  },
  list: ({ node, nodesToJSX }) => {
    const Tag = node.tag
    return (
      <Tag className="list-inside space-y-2 text-slate-700 dark:text-slate-300 text-lg leading-relaxed data-[type=number]:list-decimal data-[type=bullet]:list-disc" data-type={node.listType}>
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    )
  },
})

export function RichText({
  data,
  className,
  classeDoParagrafo = 'text-slate-700 dark:text-slate-300 text-lg leading-relaxed',
}: {
  data: unknown
  className?: string
  /** Vazio herda a tipografia do contêiner, que é o que os blocos querem. */
  classeDoParagrafo?: string
}) {
  if (!data) return null
  return (
    <div className={className ?? 'mb-12 space-y-6'}>
      <RichTextPayload
        // O tipo do documento serializado vem do Payload; aqui ele chega como
        // `unknown` de propósito — o componente não importa `@/payload-types`.
        data={data as never}
        converters={conversores(classeDoParagrafo)}
        disableContainer
      />
    </div>
  )
}
