/* Seed dos 6 materiais (MIG-041).
 *
 * 3 relatórios de `legacy/src/pages/Reports.tsx:10` e 3 e-books de
 * `Ebooks.tsx:9`. Idempotente por slug.
 *
 * Entram **publicados**, e isso revisa a leitura de D-08 para materiais.
 *
 * D-08 mandou rascunho porque "15 itens não têm corpo". Vale para blog: post sem
 * texto é página magra. Não vale aqui: no legado os botões são "Solicitar
 * acesso" e "Baixar agora" — material rico é isca de lead com formulário, não
 * artigo. O card já está completo, e a página de detalhe (MIG-045) é landing
 * com formulário, não texto corrido.
 *
 * ⚠️ As datas dos e-books são inventadas: no legado eles não têm data, e a
 * ordem da página é a do array. Semeadas em ordem decrescente para que
 * `sort: '-publishedAt'` reproduza aquela ordem — inclusive qual aparece no
 * destaque. Trocar por um campo de ordenação explícito se o marketing quiser
 * controlar isso à mão.
 *
 * ⚠️ O que falta de verdade é o **arquivo**: o botão do legado não baixa nada.
 * Registrado em debito-tecnico.md; não é motivo para esconder a listagem, que
 * no protótipo está no ar com os seis.
 *
 * ⚠️ A capa é um marcador gerado, não a imagem real — no legado são hotlinks do
 * Unsplash, imagem de banco que não é da ATRA. As capas de verdade entram com
 * o conteúdo. Com `SEED_FIXTURES=1` a do protótipo entra no lugar, para a
 * revisão interna — ver `imagens-do-prototipo.ts`.
 */

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { slugify as paraSlug } from '../../src/fields/slug'
import { capaPendente } from './midia'
import { type ChaveDoPrototipo, comFixtures, imagemDoPrototipo } from './imagens-do-prototipo'

type Material = {
  kind: 'report' | 'ebook'
  title: string
  description: string
  tags: string[]
  pages?: number
  publishedAt: string
  /* A capa que o protótipo desenha, usada só com `SEED_FIXTURES=1`. Ausente
   * quando o hotlink do legado responde 404 — aí não há imagem a trazer. */
  prototipo?: ChaveDoPrototipo
  /* Task 046: o e-book que ganha um PDF de teste, só com `SEED_FIXTURES=1` —
   * sem PDF a página não mostra o formulário, e o e2e não teria o que medir. */
  pdfDeTeste?: true
}

const MATERIAIS: Material[] = [
  {
    kind: 'report',
    title: 'Relatório Anual de Dados 2025: Tendências e Projeções',
    prototipo: 'relatorio.anual-2025',
    description:
      'Um mergulho profundo nas tecnologias que moldarão as empresas brasileiras nos próximos 12 meses.',
    tags: ['Market', 'Trends', '2026'],
    publishedAt: '2026-01-10',
  },
  {
    kind: 'report',
    title: 'O Impacto da IA Generativa na Produtividade Corporativa',
    prototipo: 'relatorio.ia-produtividade',
    description:
      'Pesquisa exclusiva com 200 CEOs sobre como a IA está mudando a forma como trabalhamos.',
    tags: ['IA', 'Business', 'ROI'],
    publishedAt: '2025-11-15',
  },
  {
    kind: 'report',
    title: 'Benchmarks de Cloud Computing na América Latina',
    description:
      'Comparativo de custos, adoção e maturidade digital entre os principais mercados da região.',
    tags: ['Cloud', 'LATAM', 'Infrastructure'],
    publishedAt: '2025-10-05',
  },
  {
    kind: 'ebook',
    title: 'O Guia Definitivo do Data Lakehouse para Executivos',
    prototipo: 'ebook.lakehouse-executivos',
    description:
      'Saiba como unificar seus dados e IA em uma única arquitetura resiliente e de baixo custo.',
    tags: ['Data', 'Architecture', 'Strategy'],
    pages: 45,
    publishedAt: '2025-09-01',
  },
  {
    kind: 'ebook',
    title: 'Governança de Dados na Era da IA Generativa',
    prototipo: 'ebook.governanca-ia',
    description:
      'Políticas essenciais para garantir segurança e qualidade nos seus modelos de linguagem.',
    tags: ['Governance', 'Security', 'IA'],
    pages: 32,
    pdfDeTeste: true,
    publishedAt: '2025-08-01',
  },
  {
    kind: 'ebook',
    title: 'Modernizando sua Infraestrutura para Cloud Native',
    prototipo: 'ebook.cloud-native',
    description:
      'Passo a passo para uma migração segura e eficiente para a nuvem.',
    tags: ['Cloud', 'Migration', 'DevOps'],
    pages: 38,
    publishedAt: '2025-07-01',
  },
]



const payload = await getPayload({ config })

/* Um PDF de uma página em branco, montado aqui para o seed não depender de
 * arquivo binário no repositório. O Payload recusa upload que não comece por
 * `%PDF-` ou que não tenha `xref` e `%%EOF` no fim (`validatePDF`); os
 * deslocamentos da tabela são os de verdade, para leitor nenhum reclamar. */
function pdfMinimo(): Buffer {
  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] >>',
  ]
  let pdf = '%PDF-1.4\n'
  const deslocamentos = objetos.map((objeto, i) => {
    const inicio = pdf.length
    pdf += `${i + 1} 0 obj ${objeto} endobj\n`
    return inicio
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`
  pdf += deslocamentos.map((d) => `${String(d).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer << /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(pdf, 'latin1')
}

/* Idempotente pelo rótulo, como as mídias do seed. Vai para o bucket privado,
 * o mesmo dos PDFs de verdade. */
async function pdfDeTeste(): Promise<number> {
  const label = 'PDF — fixture de teste do e2e (task 046)'
  const { docs } = await payload.find({
    collection: 'private-files',
    where: { label: { equals: label } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) return docs[0].id
  const data = pdfMinimo()
  const doc = await payload.create({
    collection: 'private-files',
    data: { label, kind: 'material' },
    file: { data, mimetype: 'application/pdf', name: 'fixture-e2e.pdf', size: data.length },
  })
  return doc.id
}


console.log('→ materiais')
const capa = await capaPendente(payload)

for (const m of MATERIAIS) {
  const slug = paraSlug(m.title)
  const { docs } = await payload.find({
    collection: 'resources',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })

  const data = {
    kind: m.kind,
    title: m.title,
    slug,
    description: m.description,
    coverImage: (m.prototipo && (await imagemDoPrototipo(payload, m.prototipo, m.title))) || capa,
    tags: m.tags.map((name) => ({ name })),
    pages: m.pages,
    /* `undefined` deixa o campo como está: sem fixtures, nada muda. */
    file: m.pdfDeTeste && comFixtures() ? await pdfDeTeste() : undefined,
    publishedAt: new Date(m.publishedAt).toISOString(),
    _status: 'published' as const,
  }

  const doc = docs[0]
    ? await payload.update({ collection: 'resources', id: docs[0].id, data, locale: 'pt' })
    : await payload.create({ collection: 'resources', data, locale: 'pt' })

  await payload.update({
    collection: 'resources',
    id: doc.id,
    data: { title: m.title, slug, description: m.description },
    locale: 'en',
  })
  console.log(`  ${m.kind}: ${slug}`)
}
process.exit(0)
