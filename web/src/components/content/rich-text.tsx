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

const conversores: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToJSX }) => (
    <p className="text-slate-700 text-lg leading-relaxed">{nodesToJSX({ nodes: node.children })}</p>
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

export function RichText({ data, className }: { data: unknown; className?: string }) {
  if (!data) return null
  return (
    <div className={className ?? 'mb-12 space-y-6'}>
      <RichTextPayload
        // O tipo do documento serializado vem do Payload; aqui ele chega como
        // `unknown` de propósito — o componente não importa `@/payload-types`.
        data={data as never}
        converters={conversores}
        disableContainer
      />
    </div>
  )
}
