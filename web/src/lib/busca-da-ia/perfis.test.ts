import { describe, expect, it } from 'vitest'

import { paragrafosDosPerfis } from './perfis'

const ENGENHEIRO = {
  role: 'Data Engineer',
  level: 'Senior',
  description: 'Especialista em arquiteturas Lakehouse.',
  tags: [{ name: 'Databricks' }, { name: 'PySpark' }],
  certifications: [{ name: 'Databricks Certified Data Engineer Professional' }],
}

describe('paragrafosDosPerfis', () => {
  /* D-75 — "quais consultores vocês têm com Databricks?" precisa achar o perfil
     que lista Databricks, e a certificação dele. */
  it('um parágrafo por perfil, com especialidades e certificações', () => {
    expect(paragrafosDosPerfis([ENGENHEIRO], 'pt')).toEqual([
      'Perfil de consultor: Data Engineer (Senior). Especialista em arquiteturas Lakehouse. Especialidades: Databricks, PySpark. Certificações: Databricks Certified Data Engineer Professional.',
    ])
    expect(paragrafosDosPerfis([ENGENHEIRO], 'en')[0]).toContain('Consultant profile: Data Engineer (Senior).')
  })

  it('campo vazio não deixa rótulo solto; perfil sem cargo não entra', () => {
    expect(paragrafosDosPerfis([{ role: 'Cloud Architect', tags: [], certifications: null }], 'pt')).toEqual([
      'Perfil de consultor: Cloud Architect.',
    ])
    expect(paragrafosDosPerfis([{ role: ' ', description: 'Sem cargo.' }], 'pt')).toEqual([])
  })
})
