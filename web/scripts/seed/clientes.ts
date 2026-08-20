/* Seed de clientes e depoimentos da home (MIG-071).
 *
 * Os dois saíram de arrays dentro dos blocos da home e viraram collection na
 * Fase 4a: a mesma lista existia em dois lugares, e um case podia anexar um
 * depoimento que a home mostrava com outra redação.
 *
 * ⚠️ Os 4 depoimentos da home entram **sem foto**. O gabarito usa retrato de
 * banco de imagens para representar pessoas reais de ABC Brasil e Banco
 * Carrefour (`App.tsx:1927`); D-14 decidiu descartar essas URLs e mostrar as
 * iniciais. Os 3 dos cases já vêm com nome real e sem foto, por `cases.ts`.
 *
 * ⚠️ Idempotente por chave natural: cliente por `name`, depoimento pelos 60
 * primeiros caracteres da citação. Rodar duas vezes atualiza, não duplica.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'

const payload = await getPayload({ config })
const LEGADO = path.resolve(process.cwd(), '../legacy')

const CLIENTES = [
  { name: 'RD Saúde', arquivo: 'rdsaude.jpg', enlarge: false },
  { name: 'ANBIMA', arquivo: 'anbima.jpg', enlarge: true },
  { name: 'Afya', arquivo: 'afya.jpg', enlarge: true },
  { name: 'Oncoclínicas', arquivo: 'oncoclinicas.jpg', enlarge: false },
  { name: 'Carrefour Banco', arquivo: 'bcarrefour.jpg', enlarge: false },
  { name: 'Icatu', arquivo: 'icatu.jpg', enlarge: true },
  { name: 'Porto', arquivo: 'porto.jpg', enlarge: false },
]

async function upsertLogo(arquivo: string, alt: string) {
  const nome = path.basename(arquivo)
  const chave = nome.replace(/\.[^.]+$/, '')
  const { docs } = await payload.find({ collection: 'media', where: { filename: { contains: chave } }, limit: 1, depth: 0 })
  if (docs[0]) return docs[0].id
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: readFileSync(path.join(LEGADO, arquivo)), mimetype: 'image/jpeg', name: nome, size: 0 },
    locale: 'pt',
  })
  return doc.id
}

console.log('→ clientes')
let ordem = 0
for (const c of CLIENTES) {
  const logo = await upsertLogo(`public/logos/${c.arquivo}`, `Logo ${c.name}`)
  const dados = { name: c.name, logo, enlarge: c.enlarge, order: ordem++ }
  const { docs } = await payload.find({ collection: 'clients', where: { name: { equals: c.name } }, limit: 1, depth: 0 })
  if (docs[0]) await payload.update({ collection: 'clients', id: docs[0].id, data: dados })
  else await payload.create({ collection: 'clients', data: dados })
}
console.log(`  ${CLIENTES.length} clientes`)

/* Os 4 da home (`App.tsx:1927`). Anônimos de propósito: o legado dá cargo e
 * empresa, sem nome — e é assim que a ATRA os recebeu. */
const DEPOIMENTOS = [
  {
    company: 'ABC Brasil',
    authorRole: 'Gerente de Arquitetura de Dados',
    quote:
      'Integrar nossos serviços do Google Cloud com as soluções Informatica CDGC nos proporcionou agilidade, escalabilidade e eficiência em nossa transformação digital.',
  },
  {
    company: 'ABC Brasil',
    authorRole: 'Especialista Cloud & DevOps',
    quote:
      'Com o uso de Pub/Sub e Cloud Functions, conseguimos alcançar dados quase em tempo real e escalabilidade em nossos processos, ao mesmo tempo em que reduzimos significativamente os custos e esforços operacionais.',
  },
  {
    company: 'Banco Carrefour',
    authorRole: 'Líder de Engenharia de Dados',
    quote:
      'Gostaria de expressar meu reconhecimento e gratidão à Equipe de Fábrica da ATRA pelo trabalho realizado nos processos de ingestão de dados. A equipe desempenhou um papel fundamental na aceleração das implementações e contribuiu de forma consistente para os procedimentos de validação estabelecidos. A colaboração constante resultou em uma melhoria na qualidade das entregas e possibilitou o avanço do nosso projeto de migração da plataforma de dados para o Google Cloud.',
  },
  {
    company: 'Banco Carrefour',
    authorRole: 'Superintendente de Risco',
    quote:
      'A parceria com a ATRA foi essencial para o nosso sucesso na modernização do processamento de dados financeiros no Google Cloud. A capacidade da equipe em se alinhar às necessidades do nosso time de Risco resultou em uma solução totalmente automatizada e 51 vezes mais rápida, garantindo conformidade e excelência operacional.',
  },
]

console.log('→ depoimentos da home')
for (const d of DEPOIMENTOS) {
  const { docs } = await payload.find({
    collection: 'testimonials',
    where: { quote: { like: d.quote.slice(0, 60) } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })
  const dados = { ...d, featured: true }
  if (docs[0]) await payload.update({ collection: 'testimonials', id: docs[0].id, data: dados, locale: 'pt' })
  else await payload.create({ collection: 'testimonials', data: dados, locale: 'pt' })
}
console.log(`  ${DEPOIMENTOS.length} depoimentos em destaque`)
process.exit(0)
