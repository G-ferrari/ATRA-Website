import { describe, expect, it } from 'vitest'

import { MAX_CURRICULO_BYTES, conferirArquivoNoNavegador, conferirCurriculo } from './curriculo'

const PDF = [...Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\nxref\n0 1\ntrailer<<>>\nstartxref\n9\n%%EOF\n')]
const DOCX = [0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]
const DOC = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1]
const arquivo = (nome: string, bytes: number[], tipo = '') => new File([new Uint8Array(bytes)], nome, { type: tipo })

describe('conferirArquivoNoNavegador', () => {
  it('sem arquivo, ou vazio, é ausente', () => {
    expect(conferirArquivoNoNavegador(null)).toBe('ausente')
    expect(conferirArquivoNoNavegador({ name: 'cv.pdf', size: 0 })).toBe('ausente')
  })

  it('aceita PDF e Word até 5 MB, pela extensão', () => {
    for (const nome of ['cv.pdf', 'CV.PDF', 'cv.docx', 'cv.doc']) {
      expect(conferirArquivoNoNavegador({ name: nome, size: 1000 })).toBeNull()
    }
    expect(conferirArquivoNoNavegador({ name: 'cv.pdf', size: MAX_CURRICULO_BYTES })).toBeNull()
  })

  it('recusa outro formato e o que passa de 5 MB', () => {
    for (const nome of ['cv.png', 'cv.docm', 'cv.exe', 'cv.pdf.exe', 'cv']) {
      expect(conferirArquivoNoNavegador({ name: nome, size: 1000 })).toBe('formato')
    }
    expect(conferirArquivoNoNavegador({ name: 'cv.pdf', size: MAX_CURRICULO_BYTES + 1 })).toBe('grande')
  })
})

describe('conferirCurriculo (servidor)', () => {
  it('aceita PDF, DOCX e DOC pela assinatura, com o tipo do formato conferido', async () => {
    const pdf = await conferirCurriculo(arquivo('Meu Currículo.pdf', PDF, 'text/plain'))
    expect(pdf).toMatchObject({ ok: true, mimetype: 'application/pdf' })
    /* O nome vira chave no bucket: sem espaço nem acento, com a extensão. */
    expect(pdf.ok && pdf.nome).toMatch(/^cv-\d+-Meu_Curr_culo\.pdf$/)
    expect(await conferirCurriculo(arquivo('cv.docx', DOCX))).toMatchObject({
      ok: true,
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    expect(await conferirCurriculo(arquivo('cv.doc', DOC))).toMatchObject({ ok: true, mimetype: 'application/msword' })
  })

  it('recusa o executável renomeado e o formato trocado', async () => {
    expect(await conferirCurriculo(arquivo('cv.pdf', [0x4d, 0x5a, 0x90, 0x00], 'application/pdf'))).toEqual({
      ok: false,
      motivo: 'formato',
    })
    expect(await conferirCurriculo(arquivo('cv.pdf', DOCX))).toEqual({ ok: false, motivo: 'formato' })
    /* Começa como PDF mas não termina: o Payload recusaria na gravação. */
    expect(await conferirCurriculo(arquivo('cv.pdf', [...Buffer.from('%PDF-1.4\n')]))).toEqual({ ok: false, motivo: 'formato' })
  })

  it('recusa o que não é arquivo', async () => {
    expect(await conferirCurriculo(null)).toEqual({ ok: false, motivo: 'ausente' })
    expect(await conferirCurriculo('cv.pdf')).toEqual({ ok: false, motivo: 'ausente' })
    expect(await conferirCurriculo(arquivo('cv.pdf', []))).toEqual({ ok: false, motivo: 'ausente' })
  })

  it('recusa o que passa de 5 MB', async () => {
    const grande = new File([new Uint8Array(MAX_CURRICULO_BYTES + 1).fill(0x25)], 'cv.pdf')
    expect(await conferirCurriculo(grande)).toEqual({ ok: false, motivo: 'grande' })
  })
})
