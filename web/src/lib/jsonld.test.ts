import { describe, expect, it } from 'vitest'

import { artigo, estudoDeCaso, ID_DA_ORGANIZACAO, organizacao, perguntasFrequentes, servico, site, trilha, vaga } from './jsonld'
import { trilhaDoItem } from './trilha'
import type { Contato, Seo } from '@/types/content'

const contato: Contato = {
  telefone: '+55 11 96305-2391',
  telefoneComDdd: '+55 (11) 96305-2391',
  whatsapp: 'https://wa.me/5511963052391',
  email: 'negocios@atra.com.br',
  endereco: 'Av. Queiroz Filho, 1700 – SP',
  redes: { linkedin: 'https://linkedin.com/company/atra', instagram: null, facebook: 'https://facebook.com/atra', youtube: 'https://youtube.com/@atra' },
  foto: null,
  destinos: { contato: null, consultores: null, diagnostico: null, carreiras: null, chat: null },
  avisoDeCandidatura: null,
  avisoDoBancoDeTalentos: null,
}
const seo: Seo = { title: 'Título', description: 'Resumo', image: { url: '/capa.webp', alt: 'a', width: 1200, height: 630 }, noIndex: false }

describe('organizacao', () => {
  const o = organizacao({ contato, logo: { url: '/logo.webp', alt: 'ATRA', width: 2048, height: 1134 }, fundadaEm: 2011 })

  it('declara o essencial que o Rich Results exige', () => {
    expect(o['@type']).toBe('Organization')
    expect(o['@id']).toBe(ID_DA_ORGANIZACAO)
    expect(o.name).toBe('ATRA')
    expect((o.logo as Record<string, unknown>).url).toBe('http://localhost:3000/logo.webp')
  })

  /* `null` viraria a string "null" no JSON e o Google trataria como perfil. */
  it('só lista as redes que existem', () => {
    expect(o.sameAs).toEqual(['https://linkedin.com/company/atra', 'https://facebook.com/atra', 'https://youtube.com/@atra'])
  })

  it('omite logo e fundação quando não há', () => {
    const sem = organizacao({ contato, logo: null })
    expect(sem).not.toHaveProperty('logo')
    expect(sem).not.toHaveProperty('foundingDate')
  })

  /* A ATRA não tem mais sede fixa (29/09): sem endereço, nada de PostalAddress vazio. */
  it('omite o endereço quando o global não tem', () => {
    expect(o.address).toMatchObject({ streetAddress: 'Av. Queiroz Filho, 1700 – SP' })
    expect(organizacao({ contato: { ...contato, endereco: null }, logo: null })).not.toHaveProperty('address')
  })
})

describe('artigo', () => {
  const a = artigo({ seo, url: 'http://localhost:3000/blog/x', publicadoEm: '2026-08-17' })

  it('aponta autor e publicador para a mesma organização', () => {
    expect(a.author).toEqual({ '@id': ID_DA_ORGANIZACAO })
    expect(a.publisher).toEqual({ '@id': ID_DA_ORGANIZACAO })
  })

  /* O Google recusa caminho relativo em `image`. */
  it('torna a imagem absoluta', () => {
    expect(a.image).toEqual(['http://localhost:3000/capa.webp'])
  })

  it('sem data de alteração, repete a de publicação', () => {
    expect(a.dateModified).toBe('2026-08-17')
    expect(artigo({ seo, url: 'u', publicadoEm: '2026-08-17', atualizadoEm: '2026-08-20' }).dateModified).toBe('2026-08-20')
  })
})

describe('servico', () => {
  it('declara a ATRA como prestadora', () => {
    const s = servico({ seo, url: 'http://localhost:3000/solucoes/x' })
    expect(s['@type']).toBe('Service')
    expect(s.provider).toEqual({ '@id': ID_DA_ORGANIZACAO })
  })
})

/* D-80 (GEO). */
describe('artigo com autor', () => {
  it('sem autor no admin, a organização assina — como os 207 do WordPress', () => {
    expect(artigo({ seo, url: 'u', publicadoEm: '2026-01-01' }).author).toEqual({ '@id': ID_DA_ORGANIZACAO })
  })

  it('com autor, pessoa com cargo em jobTitle e o perfil em url e sameAs', () => {
    const a = artigo({
      seo,
      url: 'u',
      publicadoEm: '2026-01-01',
      autores: [{ nome: 'Ana Souza', cargo: 'Arquiteta de Dados', perfil: 'https://www.linkedin.com/in/ana' }],
    })
    expect(a.author).toEqual([
      {
        '@type': 'Person',
        name: 'Ana Souza',
        jobTitle: 'Arquiteta de Dados',
        url: 'https://www.linkedin.com/in/ana',
        sameAs: ['https://www.linkedin.com/in/ana'],
        worksFor: { '@id': ID_DA_ORGANIZACAO },
      },
    ])
  })

  /* O Google pede só o nome em `name`; sem cargo nem perfil, nada de `null`. */
  it('autor sem cargo nem perfil leva só o nome', () => {
    const a = artigo({ seo, url: 'u', publicadoEm: 'd', autores: [{ nome: 'Ana', cargo: null, perfil: null }] })
    expect(JSON.stringify(a.author)).not.toContain('null')
  })
})

describe('estudoDeCaso', () => {
  it('é um Article sobre o cliente, quando o case o identifica', () => {
    const c = estudoDeCaso({ seo, url: 'u', publicadoEm: 'd', cliente: 'Banco ABC' })
    expect(c['@type']).toBe('Article')
    expect(c.about).toEqual({ '@type': 'Organization', name: 'Banco ABC' })
  })

  it('cliente anônimo não aparece', () => {
    expect(estudoDeCaso({ seo, url: 'u', publicadoEm: 'd', cliente: null })).not.toHaveProperty('about')
  })
})

describe('servico de segmento', () => {
  it('o setor vai em audience', () => {
    expect(servico({ seo, url: 'u', publico: 'Saúde' }).audience).toEqual({ '@type': 'BusinessAudience', name: 'Saúde' })
  })
})

describe('site', () => {
  it('WebSite com o nome ATRA, publicado pela organização', () => {
    const w = site({ url: 'http://localhost:3000/', idioma: 'pt-BR' })
    expect(w).toMatchObject({ '@type': 'WebSite', name: 'ATRA', inLanguage: 'pt-BR', publisher: { '@id': ID_DA_ORGANIZACAO } })
  })
})

describe('trilha', () => {
  it('numera a partir de 1, na ordem', () => {
    const t = trilha([{ nome: 'A', url: 'a' }, { nome: 'B', url: 'b' }])
    expect(t.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'A', item: 'a' },
      { '@type': 'ListItem', position: 2, name: 'B', item: 'b' },
    ])
  })

  it('a trilha do item usa os endereços traduzidos (D-07)', () => {
    const t = trilhaDoItem('cases', 'en', 'my-case', 'My case')
    expect((t.itemListElement as { item: string }[]).map((d) => d.item)).toEqual([
      'http://localhost:3000/en',
      'http://localhost:3000/en/success-stories',
      'http://localhost:3000/en/success-stories/my-case',
    ])
  })
})

describe('perguntasFrequentes', () => {
  it('cada item vira Question com acceptedAnswer em texto', () => {
    const f = perguntasFrequentes([{ question: 'O que é?', answer: 'É isto.' }])
    expect(f).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{ '@type': 'Question', name: 'O que é?', acceptedAnswer: { '@type': 'Answer', text: 'É isto.' } }],
    })
  })
})

describe('vaga', () => {
  const comum = { titulo: 'Engenheiro de Dados', descricao: '<p>Texto</p>', publicadaEm: '2026-10-01', url: 'u' }

  /* Remota: o Google pede jobLocationType + applicantLocationRequirements. */
  it('remota sem localidade não declara endereço', () => {
    const v = vaga({ ...comum, modelo: 'remote', localidade: null })
    expect(v.jobLocationType).toBe('TELECOMMUTE')
    expect(v.applicantLocationRequirements).toEqual({ '@type': 'Country', name: 'BR' })
    expect(v).not.toHaveProperty('jobLocation')
  })

  it('presencial leva a localidade crua em addressLocality', () => {
    const v = vaga({ ...comum, modelo: 'onsite', localidade: 'São Paulo, SP' })
    expect(v).not.toHaveProperty('jobLocationType')
    expect(v.jobLocation).toEqual({
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: 'São Paulo, SP', addressCountry: 'BR' },
    })
  })

  it('traz os obrigatórios da documentação', () => {
    const v = vaga({ ...comum, modelo: 'hybrid', localidade: null })
    for (const campo of ['title', 'description', 'datePosted', 'hiringOrganization', 'jobLocation']) {
      expect(v, campo).toHaveProperty(campo)
    }
  })
})
