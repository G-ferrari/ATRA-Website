import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { sincronizarComRd } from './sincronizar-rd'

/* O gancho que leva o lead ao RD. O que este teste guarda é **como** ele grava
 * o resultado, porque foi aí que a task 044 achou o defeito: sem o `req`, a
 * escrita ia por outra conexão e morria em "NotFound" (a transação do `create`
 * ainda aberta); com `payload.update`, uma falha desfaria a transação do lead.
 * Tem que ser `db.updateOne`, com o `req`. */

type Args = Parameters<typeof sincronizarComRd>[0]

function chamar(
  doc: Record<string, unknown>,
  falhaAoGravar = false,
  findByID: (args: Record<string, unknown>) => Promise<unknown> = async () => null,
) {
  const updateOne = vi.fn(async () => {
    if (falhaAoGravar) throw new Error('falha de banco')
    return {}
  })
  const update = vi.fn()
  const lerMaterial = vi.fn(findByID)
  const req = {
    payload: {
      findGlobal: vi.fn(async () => ({ rdStationMarketing: { enabled: true } })),
      findByID: lerMaterial,
      db: { updateOne },
      update,
    },
  }
  const resultado = sincronizarComRd({ doc, req, context: {} } as unknown as Args)
  return { resultado, req, updateOne, update, lerMaterial }
}

/** O identificador com que a conversão saiu para o RD. */
const identificadorEnviado = () =>
  JSON.parse(String((vi.mocked(fetch).mock.calls[0] as unknown as [string, RequestInit])[1].body)).payload
    .conversion_identifier

const contato = { id: 7, kind: 'contact', email: 'lead@empresa.com.br', name: 'Maria' }

describe('sincronizarComRd', () => {
  beforeEach(() => {
    vi.stubEnv('RDSTATION_MARKETING_API_KEY', 'chave-falsa-de-teste')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ event_uuid: 'uuid-1' }), { status: 200 })),
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('⚠️ grava o resultado direto no adaptador, com o mesmo req do create', async () => {
    const { resultado, req, updateOne, update } = chamar(contato)
    await resultado
    expect(update).not.toHaveBeenCalled()
    expect(updateOne).toHaveBeenCalledTimes(1)
    expect(updateOne).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'form-submissions',
        id: 7,
        req,
        data: { rd: expect.objectContaining({ eventUuid: 'uuid-1', syncedAt: expect.any(String), error: null }) },
      }),
    )
  })

  it('falha ao gravar o resultado não derruba o lead (o gancho devolve o doc)', async () => {
    const { resultado } = chamar(contato, true)
    await expect(resultado).resolves.toEqual(contato)
  })

  /* O que deixa o download (e todo formulário) responder na hora com o RD fora:
     o gancho roda dentro do `create` e nunca lança. */
  it.each([
    ['RD recusou', async () => new Response('{"errors":"campo"}', { status: 400 })],
    ['rede caiu', async () => Promise.reject(new Error('fetch failed'))],
  ])('%s: devolve o doc e grava o erro', async (_, resposta) => {
    vi.stubGlobal('fetch', vi.fn(resposta))
    const { resultado, updateOne } = chamar(contato)
    await expect(resultado).resolves.toEqual(contato)
    expect(updateOne).toHaveBeenCalledWith(
      expect.objectContaining({ data: { rd: expect.objectContaining({ syncedAt: null, error: expect.any(String) }) } }),
    )
  })

  it('sem chave não chama o RD nem grava nada', async () => {
    vi.stubEnv('RDSTATION_MARKETING_API_KEY', '')
    const { resultado, updateOne } = chamar(contato)
    await resultado
    expect(fetch).not.toHaveBeenCalled()
    expect(updateOne).not.toHaveBeenCalled()
  })

  it('banco de talentos sem aviso registrado não vai ao RD (D-62)', async () => {
    const { resultado, updateOne } = chamar({ id: 8, kind: 'talent-pool', email: 'c@x.com' })
    await resultado
    expect(fetch).not.toHaveBeenCalled()
    expect(updateOne).not.toHaveBeenCalled()
  })

  /* Task 050: o formulário do admin vai com o identificador e as tags do
     próprio formulário, lido pelo gancho a partir do `form` do envio. */
  describe('formulário do admin', () => {
    const envio = {
      id: 11,
      kind: 'custom-form',
      email: 'ana@empresa.com.br',
      name: 'Ana',
      form: 12,
      answers: [{ fieldId: 'f3', label: 'Cargo', value: 'CDO' }],
      communicationConsent: true,
    }
    const formulario = {
      id: 12,
      name: 'Inscrição',
      fields: [
        { id: 'f1', type: 'email', width: 'full', label: 'E-mail' },
        { id: 'f3', type: 'jobTitle', width: 'full', label: 'Cargo' },
      ],
      submitLabel: 'Enviar',
      afterSubmit: 'message',
      successMessage: 'Ok',
      rd: { conversionIdentifier: 'Inscrição Evento', tags: ['evento'] },
    }
    const corpo = () =>
      JSON.parse(String((vi.mocked(fetch).mock.calls[0] as unknown as [string, RequestInit])[1].body)).payload

    it('lê o formulário (em português, sem o req do create) e manda identificador, tags, cargo e consentimento', async () => {
      const { resultado, lerMaterial, updateOne } = chamar(envio, false, async () => formulario)
      await resultado
      expect(lerMaterial).toHaveBeenCalledWith(expect.objectContaining({ collection: 'forms', id: 12, locale: 'pt' }))
      expect(lerMaterial.mock.calls[0][0]).not.toHaveProperty('req')
      expect(corpo()).toMatchObject({
        conversion_identifier: 'Inscrição Evento',
        tags: ['evento'],
        job_title: 'CDO',
        legal_bases: [{ category: 'communications', type: 'consent', status: 'granted' }],
      })
      expect(updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ data: { rd: expect.objectContaining({ eventUuid: 'uuid-1', error: null }) } }),
      )
    })

    it('o formulário populado também serve', async () => {
      const { resultado, lerMaterial } = chamar({ ...envio, form: { id: 12, name: 'Inscrição' } }, false, async () => formulario)
      await resultado
      expect(lerMaterial).toHaveBeenCalledWith(expect.objectContaining({ id: 12 }))
    })

    it('formulário apagado ou ilegível: não chama o RD, o lead fica, e o motivo vai para rd.error', async () => {
      for (const ler of [async () => null, async () => Promise.reject(new Error('banco fora'))]) {
        vi.mocked(fetch).mockClear()
        const { resultado, updateOne } = chamar(envio, false, ler)
        await expect(resultado).resolves.toEqual(envio)
        expect(fetch).not.toHaveBeenCalled()
        expect(updateOne).toHaveBeenCalledWith(
          expect.objectContaining({
            data: { rd: expect.objectContaining({ syncedAt: null, error: 'formulário do envio apagado ou ilegível' }) },
          }),
        )
      }
    })
  })

  /* Task 046: o download vai com o identificador do e-book, lido pelo gancho. */
  describe('download de e-book', () => {
    const download = { id: 9, kind: 'material-download', email: 'leitor@empresa.com.br', resource: 31 }

    it('lê o e-book (só slug e identificador, em português) e manda o identificador dele', async () => {
      const { resultado, lerMaterial } = chamar(download, false, async () => ({
        id: 31,
        slug: 'guia-de-governanca',
        rdConversionIdentifier: 'E-book Guia de Governança',
      }))
      await resultado
      expect(lerMaterial).toHaveBeenCalledWith(
        expect.objectContaining({
          collection: 'resources',
          id: 31,
          locale: 'pt',
          select: { slug: true, rdConversionIdentifier: true },
        }),
      )
      expect(identificadorEnviado()).toBe('E-book Guia de Governança')
    })

    /* ⚠️ O `findByID` do Payload desfaz a transação do `req` quando falha: com
       o `req` do `create`, um e-book apagado desfaria a gravação do lead. */
    it('⚠️ lê o e-book sem o req do create', async () => {
      const { resultado, lerMaterial } = chamar(download)
      await resultado
      expect(lerMaterial.mock.calls[0][0]).not.toHaveProperty('req')
    })

    it('sem identificador próprio, vai como ebook-<slug>; o material populado também serve', async () => {
      const { resultado, lerMaterial } = chamar({ ...download, resource: { id: 31, title: 'Guia' } }, false, async () => ({
        id: 31,
        slug: 'guia-de-governanca',
        rdConversionIdentifier: null,
      }))
      await resultado
      expect(lerMaterial).toHaveBeenCalledWith(expect.objectContaining({ id: 31 }))
      expect(identificadorEnviado()).toBe('ebook-guia-de-governanca')
    })

    it('e-book que não existe mais ou falha ao ler: vai com o identificador do formulário, e o lead fica', async () => {
      const apagado = chamar(download)
      await expect(apagado.resultado).resolves.toEqual(download)
      expect(identificadorEnviado()).toBe('site-download-material')

      vi.mocked(fetch).mockClear()
      const falhou = chamar(download, false, async () => {
        throw new Error('banco fora')
      })
      await expect(falhou.resultado).resolves.toEqual(download)
      expect(identificadorEnviado()).toBe('site-download-material')
      expect(falhou.updateOne).toHaveBeenCalledTimes(1)
    })

    it('outros formulários não leem material nenhum', async () => {
      const { resultado, lerMaterial } = chamar(contato)
      await resultado
      expect(lerMaterial).not.toHaveBeenCalled()
    })
  })
})
