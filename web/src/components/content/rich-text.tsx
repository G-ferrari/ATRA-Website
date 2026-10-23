import { locale as getLocale } from 'next/root-params'
import type { ReactNode } from 'react'
import type { SerializedAutoLinkNode, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import {
  RichText as RichTextPayload,
  type JSXConverter,
  type JSXConverterArgs,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'

import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/locales'
import { linkNoIdioma } from '@/lib/routes'

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

/* O link do texto no idioma da página (D-71): `/en/sobre` sai `/en/about`, sem
 * o 308 do `proxy.ts`, e no inglês o português sem `/en` vai para a seção
 * inglesa (`/contato` → `/en/contact`). ⚠️ Só seção e página inicial: o
 * conversor não consulta o banco, e o link para um item (`/blog/<slug>`) segue
 * em português — saber se o artigo existe no inglês pediria uma consulta por
 * texto. Só o destino muda: quem desenha o `<a>` é o conversor do Payload. */
function comDestinoNoIdioma<N extends SerializedLinkNode | SerializedAutoLinkNode>(
  conversor: JSXConverter<N> | undefined,
  args: JSXConverterArgs<N>,
  locale: Locale,
): ReactNode {
  const url = args.node.fields.url
  const node = url ? { ...args.node, fields: { ...args.node.fields, url: linkNoIdioma(url, locale) } } : args.node
  return typeof conversor === 'function' ? conversor({ ...args, node }) : conversor
}

/* A tipografia do parágrafo é do **chamador**, não do conversor.
 *
 * Fixá-la aqui parecia certo enquanto só a página de case usava rich text; ao
 * entrar no bloco `richTextSection` o `text-lg` vazou para uma seção que no
 * legado é `text-xs sm:text-sm`, e a página ficou 35px mais alta no mobile. */
const conversores = (locale: Locale, classeDoParagrafo?: string): JSXConvertersFunction =>
  ({ defaultConverters }) => ({
  ...defaultConverters,
  link: (args) => comDestinoNoIdioma(defaultConverters.link, args, locale),
  autolink: (args) => comDestinoNoIdioma(defaultConverters.autolink, args, locale),
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

export async function RichText({
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
  /* O idioma vem da rota (`next/root-params`), e não de prop: são cinco
     chamadas, e o bloco de texto nem sabe o idioma. */
  const daRota = await getLocale()
  const locale = isLocale(daRota) ? daRota : DEFAULT_LOCALE
  return (
    <div className={className ?? 'mb-12 space-y-6'}>
      <RichTextPayload
        // O tipo do documento serializado vem do Payload; aqui ele chega como
        // `unknown` de propósito — o componente não importa `@/payload-types`.
        data={data as never}
        converters={conversores(locale, classeDoParagrafo)}
        disableContainer
      />
    </div>
  )
}
