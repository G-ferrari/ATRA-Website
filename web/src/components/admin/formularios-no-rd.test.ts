import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { FormulariosNoRd } from './formularios-no-rd'

/* A lista "Formulários do admin" de Sistema → Integrações (task 052). O que
 * estes testes guardam: ela mostra o que vai ao RD — e nada dos envios. */

type Doc = { id: number; name: string; _status: 'published' | 'draft'; rd?: { conversionIdentifier?: string | null; tags?: string[] | null } }

const usuario = { id: 1, role: 'editor', collection: 'users' }

/** `ultimas`: a última versão (draft: true) dos que nunca foram publicados. */
function montar(formularios: Doc[], rdStationMarketing: Record<string, unknown> = {}, ultimas: Doc[] = []) {
  const find = vi.fn(async (args: { draft?: boolean }) => ({ docs: args.draft ? ultimas : formularios }))
  const findGlobal = vi.fn(async () => ({ rdStationMarketing }))
  const payload = { config: { routes: { admin: '/admin' } }, find, findGlobal }
  const renderizar = async (idioma = 'pt') => {
    const elemento = await (FormulariosNoRd as unknown as (p: unknown) => Promise<React.ReactElement | null>)({
      payload,
      i18n: { language: idioma },
      user: usuario,
    })
    return elemento ? renderToStaticMarkup(elemento) : ''
  }
  return { find, findGlobal, renderizar }
}

const evento: Doc = { id: 3, name: 'Inscrição no evento', _status: 'published', rd: { conversionIdentifier: 'Evento Dados', tags: ['evento', 'evento'] } }
const semIdentificador: Doc = { id: 4, name: 'Pesquisa', _status: 'published', rd: { conversionIdentifier: '', tags: [] } }
const rascunho: Doc = { id: 5, name: 'Webinar novo', _status: 'draft', rd: { conversionIdentifier: 'site-contato' } }

describe('FormulariosNoRd', () => {
  it('lê só nome, situação e o grupo do RD dos formulários, com o acesso de quem vê — nada dos envios nem do aviso', async () => {
    const { find, findGlobal, renderizar } = montar([evento])
    await renderizar()
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'forms',
        select: { name: true, _status: true, rd: true },
        overrideAccess: false,
        user: usuario,
      }),
    )
    expect(findGlobal).toHaveBeenCalledWith(expect.objectContaining({ overrideAccess: false, user: usuario }))
    expect(JSON.stringify(find.mock.calls)).not.toMatch(/form-submissions|notifyEmails|fields/)
  })

  it('do publicado, os valores publicados; do que nunca foi publicado, a última versão', async () => {
    const { find, renderizar } = montar(
      [evento, { ...rascunho, name: 'Novo formulário', rd: { conversionIdentifier: 'Novo formulário' } }],
      {},
      [rascunho],
    )
    const html = await renderizar()
    expect(find).toHaveBeenLastCalledWith(expect.objectContaining({ draft: true, where: { id: { in: [5] } } }))
    expect(html).toContain('Webinar novo')
    expect(html).not.toContain('Novo formulário')
  })

  it('sem acesso a Formulários, a lista não aparece e Integrações segue de pé', async () => {
    const { find, renderizar } = montar([evento])
    find.mockRejectedValueOnce(new Error('Forbidden'))
    expect(await renderizar()).toBe('')
  })

  it('cada formulário com situação, identificador, tags e o link para editar', async () => {
    const html = await montar([evento]).renderizar()
    expect(html).toContain('href="/admin/collections/forms/3"')
    expect(html).toContain('Inscrição no evento')
    expect(html).toContain('Publicado')
    expect(html).toContain('Evento Dados')
    // A tag repetida aparece uma vez: é o que vai ao RD.
    expect(html.match(/>evento</g)).toHaveLength(1)
  })

  it('sem identificador: "Não vai ao RD"; rascunho: marcado como fora do site', async () => {
    const html = await montar([semIdentificador, rascunho]).renderizar()
    expect(html).toContain('Não vai ao RD')
    expect(html).toContain('Rascunho')
    expect(html).toContain('Não está no site')
  })

  it('identificador repetido aponta quem mais usa — inclusive um formulário fixo, sem distinguir caixa', async () => {
    const html = await montar([evento, { ...semIdentificador, rd: { conversionIdentifier: 'evento dados' } }, rascunho]).renderizar()
    expect(html).toContain('Mesmo identificador de: Pesquisa')
    expect(html).toContain('Mesmo identificador de: Inscrição no evento')
    // `site-contato` é o identificador padrão do Contato, em Sistema → Integrações.
    expect(html).toContain('Mesmo identificador de: Contato')
  })

  it('o "Download de material" fica fora da comparação: cada e-book vai com o próprio identificador', async () => {
    const html = await montar([{ ...evento, rd: { conversionIdentifier: 'site-download-material' } }]).renderizar()
    expect(html).not.toContain('Mesmo identificador de')
  })

  it('sem formulários, o convite para criar; com a integração desligada, o aviso', async () => {
    const html = await montar([], { enabled: false }).renderizar()
    expect(html).toContain('Nenhum formulário criado ainda.')
    expect(html).toContain('href="/admin/collections/forms/create"')
    expect(html).toContain('A integração está desligada')
  })

  it('em inglês no admin em inglês', async () => {
    const html = await montar([semIdentificador]).renderizar('en')
    expect(html).toContain('Does not go to RD')
    expect(html).toContain('Admin forms')
  })
})
