import {
  RichText as RichTextPayload,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'

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

/* A tipografia do parágrafo é do **chamador**, não do conversor.
 *
 * Fixá-la aqui parecia certo enquanto só a página de case usava rich text; ao
 * entrar no bloco `richTextSection` o `text-lg` vazou para uma seção que no
 * legado é `text-xs sm:text-sm`, e a página ficou 35px mais alta no mobile. */
const conversores = (classeDoParagrafo?: string): JSXConvertersFunction =>
  ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => (
    <p className={classeDoParagrafo}>{nodesToJSX({ nodes: node.children })}</p>
  ),
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag
    return <Tag className="text-2xl font-bold text-slate-900">{nodesToJSX({ nodes: node.children })}</Tag>
  },
  list: ({ node, nodesToJSX }) => {
    const Tag = node.tag
    return (
      <Tag className="list-inside space-y-2 text-slate-700 text-lg leading-relaxed data-[type=number]:list-decimal data-[type=bullet]:list-disc" data-type={node.listType}>
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    )
  },
})

export function RichText({
  data,
  className,
  classeDoParagrafo = 'text-slate-700 text-lg leading-relaxed',
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
