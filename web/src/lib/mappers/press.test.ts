import { describe, expect, it } from 'vitest'

import type { Press } from '@/payload-types'

import { toMateriaDaImprensa } from './press'

const capa = { id: 9, url: '/api/media/file/atra-na-midia-01.webp', alt: 'Gazeta Mercantil Digital: IA agêntica', width: 1024, height: 768 }

const doc = (extra: Partial<Press> = {}): Press =>
  ({
    id: 3,
    title: 'IA agêntica na banca',
    outlet: 'Gazeta Mercantil Digital',
    description: 'A ferramenta permite simulações financeiras.',
    url: 'https://gazetamercantil.com.br/ia-agentica/',
    coverImage: capa,
    kind: 'article',
    order: 1,
    updatedAt: '2026-10-02T00:00:00.000Z',
    createdAt: '2026-10-02T00:00:00.000Z',
    ...extra,
  }) as Press

describe('toMateriaDaImprensa', () => {
  it('leva o que o cartão desenha, com o id como texto', () => {
    expect(toMateriaDaImprensa(doc())).toEqual({
      id: '3',
      title: 'IA agêntica na banca',
      outlet: 'Gazeta Mercantil Digital',
      description: 'A ferramenta permite simulações financeiras.',
      url: 'https://gazetamercantil.com.br/ia-agentica/',
      image: { url: capa.url, alt: capa.alt, width: 1024, height: 768 },
      kind: 'article',
      publishedAt: null,
    })
  })

  /* A página antiga não tinha data em nenhuma matéria: vazio é o caso normal. */
  it('sem data fica `null`; com data, passa adiante', () => {
    expect(toMateriaDaImprensa(doc({ publishedAt: undefined })).publishedAt).toBeNull()
    expect(toMateriaDaImprensa(doc({ publishedAt: '2026-09-03T00:00:00.000Z' })).publishedAt).toBe('2026-09-03T00:00:00.000Z')
  })

  it('só "video" é vídeo — é o que põe o botão de play no cartão', () => {
    expect(toMateriaDaImprensa(doc({ kind: 'video' })).kind).toBe('video')
    expect(toMateriaDaImprensa(doc({ kind: undefined as never })).kind).toBe('article')
  })

  /* Capa não populada derruba com o nome do campo — imagem quebrada em silêncio é pior. */
  it('capa que veio só como id derruba, dizendo o campo', () => {
    expect(() => toMateriaDaImprensa(doc({ coverImage: 9 }))).toThrow(/press\.coverImage/)
  })
})
