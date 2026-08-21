/* Fixture de teste do blog — **não é conteúdo**.
 *
 * Os 6 artigos são fictícios, do protótipo (`legacy/src/pages/Blog.tsx:11`). Na
 * Fase 3 existiam porque o aceite visual de `/blog` comparava contra o protótipo
 * e precisava dos mesmos 6 cards. MIG-083 importou os 207 artigos reais do
 * WordPress, `/blog` saiu do gate visual (a listagem agora tem conteúdo real, que
 * o protótipo nunca terá) e o único motivo que sobrou para eles é dar à suíte de
 * e2e um blog não vazio, sem depender de rede.
 *
 * ⚠️ **Só rodam com `SEED_FIXTURES=1`**, que o CI liga e mais ninguém.
 *
 * D-17 manda descartá-los, e a razão é forte: publicados num banco de verdade,
 * seis artigos inventados vão ao ar assinados pela ATRA. Enquanto isso era uma
 * linha de runbook, dependia de alguém lembrar na hora do cutover. A variável
 * põe a regra no código — `pnpm seed` sem ela não recria nenhum.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'

type Post = { title: string; description: string; tags: string[]; publishedAt: string }

const POSTS: Post[] = [
  {
    title: 'Squad Gerenciada: como estruturar equipes de TI mais eficientes',
    description:
      'Saiba como o modelo de squads pode escalar sua operação de tecnologia mantendo a qualidade e cultura.',
    tags: ['Business', 'Managed IT', 'Strategy'],
    publishedAt: '2026-03-23',
  },
  {
    title: 'IA Generativa e Preditiva: O Futuro da Análise de Dados',
    description:
      'Como a combinação de diferentes tipos de IA está criando uma nova era de insights de negócios.',
    tags: ['Analytics', 'IA', 'Innovation'],
    publishedAt: '2026-02-02',
  },
  {
    title: 'Arquitetura Multicloud: O que é, por que importa e como fortalecer sua TI',
    description:
      'Explore os benefícios e desafios de manter uma estratégia de nuvem distribuída e resiliente.',
    tags: ['Cloud', 'Infraestrutura', 'Security'],
    publishedAt: '2026-01-05',
  },
  {
    title: 'Data Center no Varejo: O Que Está em Jogo Quando as Vendas Disparam',
    description:
      'Garantindo a disponibilidade e performance durante os maiores eventos do varejo digital.',
    tags: ['Cloud', 'Infraestrutura', 'Retail'],
    publishedAt: '2025-10-14',
  },
  {
    title: 'ROI em TI: do cálculo ao impacto real no crescimento da empresa',
    description:
      'Métricas e metodologias que o C-level espera ver ao investir em modernização de plataformas de dados.',
    tags: ['Business', 'Finance', 'Strategy'],
    publishedAt: '2025-08-13',
  },
  {
    title: 'Segurança de Dados em 2026: O que mudou e o que virá',
    description:
      'As novas ameaças cibernéticas e as defesas essenciais para um ecossistema corporativo hiperconectado.',
    tags: ['Cybersecurity', 'Data', 'Privacy'],
    publishedAt: '2025-07-10',
  },
]

/** Categorias fixas da barra de filtro (`Blog.tsx:62`), fora as "Todos". */
export const CATEGORIAS_DO_BLOG = ['Business', 'IA', 'Cloud', 'Analytics', 'Cybersecurity', 'Strategy']

const CAPA = path.resolve(process.cwd(), 'scripts/seed/assets/capa-pendente.png')

const paraSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const payload = await getPayload({ config })

async function capaMarcadora() {
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: 'capa-pendente' } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) return docs[0]
  return payload.create({
    collection: 'media',
    data: { alt: 'CAPA PENDENTE — imagem real entra com o conteúdo' },
    file: { data: readFileSync(CAPA), mimetype: 'image/png', name: 'capa-pendente.png', size: 0 },
    locale: 'pt',
  })
}

if (!process.env.SEED_FIXTURES) {
  console.log('→ blog (pulado: fixture de teste, exige SEED_FIXTURES=1 — os artigos reais vêm de scripts/wp-import)')
  process.exit(0)
}

/** Corpo mínimo em Lexical: um parágrafo. */
const corpo = (texto: string) =>
  ({
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textFormat: 0,
          children: [{ type: 'text', text: texto, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        },
      ],
    },
  }) as never

console.log('→ blog (fixtures de teste)')
const capa = await capaMarcadora()

for (const p of POSTS) {
  const slug = paraSlug(p.title)
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })

  const data = {
    title: p.title,
    slug,
    description: p.description,
    coverImage: capa.id,
    tags: p.tags.map((name) => ({ name })),
    /* Corpo de uma linha. Até a Fase 4b eles ficavam **sem corpo** de propósito,
     * porque o smoke provava neles a regra de D-08 (página magra sai com
     * `noindex`). A regra virou unitário em `lib/seo.ts`; o que o e2e precisa
     * agora é do caso oposto — artigo com corpo é indexável — e para isso o
     * fixture tem que ter corpo. */
    body: corpo(p.description),
    publishedAt: new Date(p.publishedAt).toISOString(),
    _status: 'published' as const,
  }

  const doc = docs[0]
    ? await payload.update({ collection: 'posts', id: docs[0].id, data, locale: 'pt' })
    : await payload.create({ collection: 'posts', data, locale: 'pt' })

  await payload.update({
    collection: 'posts',
    id: doc.id,
    data: { title: p.title, slug, description: p.description },
    locale: 'en',
  })
  console.log(`  ${slug}`)
}
process.exit(0)
