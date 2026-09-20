---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [modelo-de-conteudo.md, blocos.md]
---

# Contratos de dados

## Origem dos tipos

O Payload gera `payload-types.ts` a partir do `payload.config.ts`
(`pnpm payload generate:types`). **Esses tipos são a fonte de verdade** — nunca
escrever à mão um tipo que o Payload já gera, nem editar o arquivo gerado.

O que este documento define são os tipos **de apresentação**: o recorte que cada
componente recebe. Eles derivam dos gerados, nunca os substituem.

```ts
// src/types/content.ts
import type { Case, Post, Media, Topic } from '@/payload-types'

// Relationship pode vir como id (string) ou documento populado (depth > 0).
// Este helper força o lado populado no contrato do componente.
export type Populated<T> = Exclude<T, string | number | null | undefined>

export type MediaRef = Populated<Case['heroImage']>
export type TopicRef = Populated<Topic>
```

## Regra central: componente de apresentação não busca dado

| Camada | Pode | Não pode |
|---|---|---|
| `app/**/page.tsx` (Server Component) | Chamar `payload.find` / `payload.findByID`, montar props, definir `generateMetadata` | Conter markup de seção |
| `components/blocks/*` | Receber props tipadas e renderizar | `fetch`, `payload.*`, `use client` sem necessidade |
| `components/ui/*` | Receber props primitivas | Conhecer o schema do Payload |

Consequência prática: `components/ui/*` **não importa `@/payload-types`**. Se um
componente de UI precisa do tipo do CMS, ele está na camada errada.

```ts
// ✅ page.tsx resolve o dado
const { docs } = await payload.find({
  collection: 'cases',
  where: { _status: { equals: 'published' } },
  locale, depth: 2, limit: 12,
})
return <CaseGrid items={docs.map(toCaseCard)} />

// ✅ componente recebe pronto
export function CaseGrid({ items }: { items: CaseCard[] }) { … }

// ❌ nunca
export async function CaseGrid() {
  const { docs } = await payload.find({ collection: 'cases' })
}
```

## Mappers

Todo documento do Payload passa por um mapper antes de chegar ao componente.
Ficam em `src/lib/mappers/`, um por collection.

```ts
// src/lib/mappers/case.ts
export function toCaseCard(doc: Case): CaseCard {
  return {
    slug: doc.slug,
    title: doc.title,
    client: doc.client,
    summary: doc.summary,
    impact: doc.impact ?? null,
    image: toImage(doc.heroImage),
    topics: (doc.topics ?? []).filter(isPopulated).map(toTopic),
  }
}
```

Por que mapper e não passar o documento inteiro:

1. O componente deixa de depender da forma do CMS — trocar um campo de nome não
   quebra 8 componentes.
2. Relationship não populado (`string | Media`) morre no mapper, não no JSX. Sem
   isso, todo componente precisaria de `typeof x === 'object'`.
3. O teste do componente monta um objeto simples, sem simular o Payload.

## Tipos de apresentação

```ts
export type Image = {
  url: string
  alt: string          // obrigatório no schema: nunca undefined aqui
  width: number
  height: number
  blurDataURL?: string
}

export type Topic = { slug: string; name: string }

export type CaseCard = {
  slug: string
  title: string
  client: string
  summary: string
  impact: string | null
  image: Image
  topics: Topic[]
}

export type CaseDetail = CaseCard & {
  challenges: string[]
  solution: RichText | null
  results: string[]
  technologies: string[]
  partners: PartnerBadge[]
  testimonial: Testimonial | null
  aboutClient: string | null
}

export type ContentCard = {          // usado por posts, resources e webinars
  kind: 'post' | 'report' | 'ebook' | 'webinar'
  href: string
  title: string
  summary: string
  image: Image
  date: string                        // ISO; formatação é do componente
  topics: Topic[]
  badge?: string                      // "Artigo", "Relatório", "E-book"
  meta?: string                       // "45 min", "32 páginas"
}

export type Testimonial = {
  quote: string
  authorName: string | null           // null → monograma (D-14)
  authorRole: string
  company: string
  photo: Image | null
}
```

`ContentCard` é o contrato que permite ao hub `/insights` e às 4 listagens usarem
**um único componente de card** — resolve a duplicação #9 do
[inventário de componentes](../01-descoberta/inventario-componentes.md).

## Datas

O legado guarda data como string formatada em PT (`"23 de março de 2026"`,
`Blog.tsx:16`), o que impede ordenar e traduzir.

Contrato: **`date` é sempre ISO 8601 no dado**; a formatação acontece no
componente, com `Intl.DateTimeFormat` no locale ativo. Nenhum mapper devolve data
já formatada.

## Localização

`payload.find({ locale })` devolve os campos localizados já resolvidos para o
idioma pedido — o mapper não vê o objeto `{ pt, en }`.

```ts
// app/[locale]/blog/[slug]/page.tsx
const locale = await resolveLocale(params)   // 'pt' | 'en'
const doc = await payload.findByID({ collection: 'posts', id, locale })
```

Regra: **nenhum componente recebe `locale` para escolher texto**. Se um componente
precisa do locale, é para formatação (data, número) ou para montar href — nunca
para selecionar conteúdo.

## Blocos

Cada bloco recebe exatamente sua própria fatia, com o tipo gerado pelo Payload:

```ts
import type { Page } from '@/payload-types'

type Blocks = NonNullable<Page['layout']>
export type BlockOf<T extends Blocks[number]['blockType']> =
  Extract<Blocks[number], { blockType: T }>

export function StatsGrid({ block, metrics }: {
  block: BlockOf<'statsGrid'>
  metrics: SiteMetrics          // resolvido na page, não pelo bloco
}) { … }
```

O `RenderBlocks` faz o switch sobre `blockType` e é o único ponto que conhece
todos os blocos. Bloco novo = uma entrada no switch + um componente.

## Convenção de arquivos

```
web/src/
  app/[locale]/…                 # rotas; resolvem dado e metadata
  collections/                   # definições do Payload
  blocks/                        # config dos blocos (schema)
  components/
    blocks/                      # um componente por bloco
    ui/                          # design system — não importa payload-types
    layout/                      # Navbar, Footer, Shell
  lib/
    mappers/                     # documento → tipo de apresentação
    payload.ts                   # getPayload cacheado
  types/content.ts               # tipos de apresentação
```

## Erros que este contrato previne

| Erro do legado | Como o contrato impede |
|---|---|
| Mesma imagem importada em 3 arquivos (`App.tsx:37`, `SuccessStories.tsx:10`, `Insights.tsx:4`) | Imagem vem por relationship, resolvida na page |
| Data como string PT, sem ordenação possível | `date` sempre ISO |
| Card de conteúdo reimplementado 3× | `ContentCard` único |
| Conteúdo duplicado entre hub e listagem | Hub consulta as collections; não tem lista própria |
| Componente com dado embutido (`CaseDetailBase.tsx:167`) | Componente de apresentação não declara conteúdo |

> [!DECISÃO PENDENTE] `richText` do Payload (Lexical) serializado em React exige um
> conversor com estilos próprios. Usamos o conversor oficial do Payload com CSS
> nosso, ou restringimos `body` a um subconjunto (headings, listas, links, imagem,
> citação) para garantir que o resultado sempre caiba no design? A segunda opção dá
> mais controle visual e menos liberdade ao editor.
