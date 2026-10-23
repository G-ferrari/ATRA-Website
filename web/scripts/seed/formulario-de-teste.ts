/* Seed da seção "Formulário" (feature criador-de-formularios, task 053) —
 * **só fixture**.
 *
 * ⚠️ Sem `SEED_FIXTURES=1` não grava nada: formulário é conteúdo do marketing
 * (D-22), e um de teste no ar receberia lead de verdade.
 *
 * Com a chave (só o CI a liga), cria dois formulários publicados — um que
 * termina na mensagem e outro que leva a outra página — e os põe numa solução
 * que o contraste e o axe já medem, antes da faixa final. É o que
 * `e2e/formulario-do-admin.spec.ts` envia.
 *
 * Roda por último: as migrações de dados do passo anterior regravam páginas, e
 * a seção tem que entrar no layout final. Idempotente: os formulários são
 * achados pelo nome e as seções pela âncora. */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import {
  FORMULARIO_DE_TESTE,
  FORMULARIO_QUE_LEVA_A_OUTRA_PAGINA,
  SLUG_DA_PAGINA_COM_FORMULARIO,
} from './fixtures-de-formulario'

if (!process.env.SEED_FIXTURES) {
  console.log('→ formulário de teste (pulado: formulário de verdade é do marketing)')
  process.exit(0)
}

const payload = await getPayload({ config })
console.log('→ formulário de teste (fixtures)')

async function formulario(nome: string, data: Record<string, unknown>): Promise<number> {
  const { docs } = await payload.find({ collection: 'forms', where: { name: { equals: nome } }, limit: 1, depth: 0 })
  if (docs[0]) return docs[0].id
  const criado = await payload.create({ collection: 'forms', locale: 'pt', data: { name: nome, ...data, _status: 'published' } as never })
  return criado.id
}

const t = FORMULARIO_DE_TESTE
const comMensagem = await formulario(t.nome, {
  fields: [
    { type: 'name', width: 'half', label: t.rotulos.nome, required: true },
    { type: 'email', width: 'half', label: t.rotulos.email },
    { type: 'select', width: 'full', label: t.rotulos.area, required: true, options: t.opcoes.map((label) => ({ label })) },
    { type: 'checkbox', width: 'full', label: t.rotulos.consentimento, consent: true },
  ],
  submitLabel: t.botao,
  afterSubmit: 'message',
  successMessage: t.mensagem,
})

const p = FORMULARIO_QUE_LEVA_A_OUTRA_PAGINA
const comPagina = await formulario(p.nome, {
  fields: [{ type: 'email', width: 'full', label: 'E-mail' }],
  submitLabel: p.botao,
  afterSubmit: 'page',
  redirectPath: p.destino,
})

const { docs } = await payload.find({
  collection: 'solutions',
  where: { slug: { equals: SLUG_DA_PAGINA_COM_FORMULARIO } },
  locale: 'pt',
  limit: 1,
  depth: 0,
})
const solucao = docs[0]
if (!solucao) throw new Error(`[seed] a solução ${SLUG_DA_PAGINA_COM_FORMULARIO} não existe — ela nasce na migração da D-52`)

const layout = solucao.layout ?? []
const jaNaPagina = (ancora: string) => layout.some((b) => b.blockType === 'formSection' && b.anchor === ancora)

/* Antes da faixa final, que fecha a página. O layout vai com os ids que já
   tem, em todos os níveis: sem eles o texto em inglês dos blocos sumiria (a
   armadilha do `casarIds`). Os blocos novos não têm inglês, e o Payload cai no
   português. */
const secoes = [
  {
    blockType: 'formSection',
    form: comMensagem,
    title: 'Inscreva-se no encontro de teste',
    text: 'Seção de teste do e2e: o formulário termina numa mensagem.',
    layout: 'side',
    anchor: t.ancora,
  },
  {
    blockType: 'formSection',
    form: comPagina,
    title: 'Formulário que leva a outra página',
    layout: 'centered',
    anchor: p.ancora,
  },
].filter((s) => !jaNaPagina(s.anchor))
if (!secoes.length) {
  console.log('  (as seções já estão na página)')
  process.exit(0)
}
const fim = Math.max(layout.length - 1, 0)
await payload.update({
  collection: 'solutions',
  id: solucao.id,
  locale: 'pt',
  data: { layout: [...layout.slice(0, fim), ...secoes, ...layout.slice(fim)], _status: 'published' } as never,
})
console.log(`  formulários ${comMensagem} e ${comPagina} na página ${SLUG_DA_PAGINA_COM_FORMULARIO}`)
process.exit(0)
