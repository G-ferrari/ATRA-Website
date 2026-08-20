/* Catálogo de parceiros (MIG-071, fechado por MIG-072a).
 *
 * O painel de Parceiros do megamenu lê a collection, e ela tinha só 5 registros
 * — semeados de passagem por `cases.ts` e `sobre.ts`, com descrição genérica
 * ("Parceiro de tecnologia da ATRA"). O legado mostra 9, cada um com a sua
 * (`App.tsx:107`). Este seed é o catálogo completo, e roda **antes** dos outros
 * dois, que a partir daqui só complementam o que já existe.
 *
 * ⚠️ **São 8, não 9.** O nono está cadastrado no legado apenas como "Partner",
 * sem nome real (`App.tsx:111`) — P-10. Semear um card chamado "Partner" seria
 * publicar um parceiro genérico; fica de fora até alguém dizer quem é.
 *
 * Os logos vieram do WordPress para `assets/parceiros/` (parte de MIG-073): o
 * legado os hotlinka, e hotlink em produção é risco de disponibilidade.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'

type Parceiro = {
  slug: string
  name: string
  arquivo: string
  pt: string
  en: string
  order: number
}

const PARCEIROS: Parceiro[] = [
  {
    slug: 'google-cloud',
    name: 'Google Cloud',
    arquivo: 'logo_google_cloud.png',
    pt: 'Nuvem pública líder em dados e IA.',
    en: 'The public cloud leader in data and AI.',
    order: 0,
  },
  {
    slug: 'denodo',
    name: 'Denodo',
    arquivo: 'logo_denodo.png',
    pt: 'Virtualização de dados para agilidade.',
    en: 'Data virtualization for agility.',
    order: 1,
  },
  {
    slug: 'bigid',
    name: 'BigID',
    arquivo: 'logo_bigid.jpg',
    pt: 'Descoberta e proteção de dados sensíveis.',
    en: 'Discovery and protection of sensitive data.',
    order: 2,
  },
  {
    /* Slug `microsoft-azure`, e não `azure`: é o que a vitrine de /sobre já
     * usa (`sobre.ts:54`). Slugs diferentes para a mesma marca criariam dois
     * parceiros, e o megamenu mostraria a Azure duas vezes. */
    slug: 'microsoft-azure',
    name: 'Azure',
    arquivo: 'logo_azure.png',
    pt: 'Plataforma de nuvem abrangente da Microsoft.',
    en: 'Microsoft’s comprehensive cloud platform.',
    order: 3,
  },
  {
    slug: 'atlan',
    name: 'Atlan',
    arquivo: 'logo_atlan.png',
    pt: 'Catálogo de dados moderno e colaborativo.',
    en: 'A modern, collaborative data catalogue.',
    order: 4,
  },
  {
    slug: 'ibm',
    name: 'IBM',
    arquivo: 'logo_ibm.png',
    pt: 'Inovação em IA e nuvem híbrida.',
    en: 'Innovation in AI and hybrid cloud.',
    order: 5,
  },
  {
    slug: 'salesforce-informatica',
    name: 'Informatica',
    arquivo: 'logo_informatica.png',
    pt: 'Gestão de dados em nuvem líder de mercado.',
    en: 'Market-leading cloud data management.',
    order: 6,
  },
  {
    slug: 'databricks',
    name: 'Databricks',
    arquivo: 'logo_databricks.png',
    pt: 'Lakehouse unificado para dados e IA.',
    en: 'A unified lakehouse for data and AI.',
    order: 7,
  },
]

const PASTA = path.resolve(process.cwd(), 'scripts/seed/assets/parceiros')
const payload = await getPayload({ config })

/* Procura pelo nome do arquivo, como os outros seeds: dois seeds que gravem o
 * mesmo logo precisam cair no **mesmo** doc de mídia, senão o parceiro fica
 * com dois logos concorrentes conforme a ordem de execução. */
async function midiaDoLogo(p: Parceiro) {
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: p.arquivo.replace(/\.[a-z]+$/, '') } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) return docs[0]
  return payload.create({
    collection: 'media',
    data: { alt: `Logo ${p.name}` },
    file: {
      data: readFileSync(path.join(PASTA, p.arquivo)),
      mimetype: p.arquivo.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
      name: p.arquivo,
      size: 0,
    },
    locale: 'pt',
  })
}

console.log('→ catálogo de parceiros')
for (const p of PARCEIROS) {
  const logo = await midiaDoLogo(p)
  const { docs } = await payload.find({
    collection: 'partners',
    where: { slug: { equals: p.slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })

  /* `hasPage` e `layout` **não** entram aqui: quem os define é o seed da página
   * do parceiro (`parceiros.ts`). Reenviá-los apagaria o layout do Google Cloud
   * conforme a ordem dos seeds. */
  const data = { name: p.name, slug: p.slug, logo: logo.id, description: p.pt, order: p.order }
  const doc = docs[0]
    ? await payload.update({ collection: 'partners', id: docs[0].id, data, locale: 'pt' })
    : await payload.create({ collection: 'partners', data, locale: 'pt' })

  /* ⚠️ O slug vai **explícito** também no inglês. Ele é localizado (D-07) e o
   * hook do campo o gera do `name` quando chega vazio — "Azure" virava `azure`
   * no inglês enquanto o português era `microsoft-azure`, e a gravação seguinte
   * batia em "Valor deve ser único". Nome de marca não se traduz: o slug é o
   * mesmo nos dois. */
  await payload.update({
    collection: 'partners',
    id: doc.id,
    data: { slug: p.slug, description: p.en },
    locale: 'en',
  })
}
console.log(`  ${PARCEIROS.length} parceiros (o 9º depende de P-10)`)
process.exit(0)
