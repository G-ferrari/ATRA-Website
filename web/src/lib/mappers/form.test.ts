import { describe, expect, it } from 'vitest'

import type { Form } from '@/payload-types'

import { destinoDepoisDoEnvio, toConfigDoFormulario, toFormularioDoAdmin, toFormularioNoRd } from './form'
import { ConteudoIncompleto } from './shared'

const base = (sobre: Partial<Form> = {}): Form => ({
  id: 7,
  name: 'Inscrição no evento',
  fields: [
    { id: 'a1', type: 'name', width: 'half', label: 'Nome', required: true },
    { id: 'a2', type: 'email', width: 'half', label: 'E-mail', required: false },
    {
      id: 'a3',
      type: 'select',
      width: 'full',
      label: 'Área de interesse',
      placeholder: 'Escolha',
      rdField: 'cf_area',
      options: [
        { id: 'o1', label: 'Dados', value: 'dados' },
        { id: 'o2', label: 'IA', value: 'ia' },
        { id: 'o3', label: 'Sem valor', value: null },
      ],
    },
    { id: 'a4', type: 'checkbox', width: 'full', label: 'Aceito receber comunicações', consent: true, rdField: 'cf_aceite' },
    { id: 'a5', type: 'phone', width: 'full', label: 'Telefone', rdField: 'cf_ignorado' },
  ],
  submitLabel: 'Quero participar',
  notice: '  Aviso de privacidade.  ',
  afterSubmit: 'message',
  successMessage: 'Inscrição recebida.',
  redirectPath: null,
  notifyEmails: ['eventos@atra.com.br', 'eventos@atra.com.br', 'não é e-mail'],
  rd: { conversionIdentifier: 'Evento Dados', tags: ['evento', 'evento', ' '] },
  updatedAt: '2026-10-20T00:00:00.000Z',
  createdAt: '2026-10-20T00:00:00.000Z',
  ...sobre,
})

describe('toFormularioDoAdmin', () => {
  it('leva os campos na ordem, com o e-mail sempre obrigatório e as opções com valor', () => {
    const f = toFormularioDoAdmin(base(), 'pt')
    expect(f.campos.map((c) => [c.id, c.tipo, c.obrigatorio, c.largura])).toEqual([
      ['a1', 'name', true, 'meia'],
      ['a2', 'email', true, 'meia'],
      ['a3', 'select', false, 'inteira'],
      ['a4', 'checkbox', false, 'inteira'],
      ['a5', 'phone', false, 'inteira'],
    ])
    expect(f.campos[2].opcoes).toEqual([
      { rotulo: 'Dados', valor: 'dados' },
      { rotulo: 'IA', valor: 'ia' },
    ])
    expect(f.campos[2].exemplo).toBe('Escolha')
    expect(f).toMatchObject({ botao: 'Quero participar', aviso: 'Aviso de privacidade.' })
    expect(f.depoisDoEnvio).toEqual({ tipo: 'mensagem', mensagem: 'Inscrição recebida.' })
  })

  it('não leva nada do RD nem do aviso ao time para o navegador', () => {
    const f = JSON.stringify(toFormularioDoAdmin(base(), 'pt'))
    expect(f).not.toMatch(/cf_|eventos@|Evento Dados/)
  })

  it('o depois do envio por página põe o prefixo do idioma', () => {
    const doc = base({ afterSubmit: 'page', redirectPath: '/cases-de-sucesso/abc' })
    expect(toFormularioDoAdmin(doc, 'pt').depoisDoEnvio).toEqual({ tipo: 'pagina', href: '/cases-de-sucesso/abc' })
    expect(toFormularioDoAdmin(doc, 'en').depoisDoEnvio).toEqual({ tipo: 'pagina', href: '/en/cases-de-sucesso/abc' })
    expect(toFormularioDoAdmin(base({ afterSubmit: 'page', redirectPath: '/' }), 'en').depoisDoEnvio).toEqual({
      tipo: 'pagina',
      href: '/en',
    })
  })

  it('o que falta vira ConteudoIncompleto, para o preview mostrar', () => {
    expect(() => toFormularioDoAdmin(base({ successMessage: ' ' }), 'pt')).toThrow(ConteudoIncompleto)
    expect(() => toFormularioDoAdmin(base({ afterSubmit: 'page', redirectPath: 'https://fora.com' }), 'pt')).toThrow(
      ConteudoIncompleto,
    )
    expect(() => toFormularioDoAdmin(base({ submitLabel: '' }), 'pt')).toThrow(ConteudoIncompleto)
    expect(() => toFormularioDoAdmin(base({ fields: [{ id: 'x', type: 'name', width: 'full', label: 'Nome' }] }), 'pt')).toThrow(
      ConteudoIncompleto,
    )
  })
})

describe('toConfigDoFormulario', () => {
  it('leva identificador, tags e endereços limpos, sem repetição', () => {
    const c = toConfigDoFormulario(base())
    expect(c.rd).toEqual({ identificador: 'Evento Dados', tags: ['evento'] })
    expect(c.avisarPara).toEqual(['eventos@atra.com.br'])
    expect(c.nome).toBe('Inscrição no evento')
  })

  it('campo personalizado só nos tipos sem campo padrão; consentimento só na caixa de marcar', () => {
    const porId = Object.fromEntries(toConfigDoFormulario(base()).campos.map((c) => [c.id, c]))
    expect(porId.a3).toMatchObject({ campoNoRd: 'cf_area', valores: ['dados', 'ia'], consentimento: false })
    expect(porId.a4).toMatchObject({ campoNoRd: 'cf_aceite', consentimento: true })
    expect(porId.a5.campoNoRd).toBeNull()
    expect(porId.a2.obrigatorio).toBe(true)
  })

  it('identificador vazio ou fora do formato quer dizer "não vai ao RD"', () => {
    expect(toConfigDoFormulario(base({ rd: { conversionIdentifier: '' } })).rd.identificador).toBeNull()
    expect(toConfigDoFormulario(base({ rd: { conversionIdentifier: 'a<b' } })).rd.identificador).toBeNull()
  })
})

describe('destinoDepoisDoEnvio', () => {
  it('devolve o endereço no idioma, ou null para ficar na mensagem — sem lançar', () => {
    expect(destinoDepoisDoEnvio({ afterSubmit: 'page', redirectPath: '/obrigado' }, 'en')).toBe('/en/obrigado')
    expect(destinoDepoisDoEnvio({ afterSubmit: 'message', redirectPath: '/obrigado' }, 'pt')).toBeNull()
    expect(destinoDepoisDoEnvio({ afterSubmit: 'page', redirectPath: 'https://fora.com' }, 'pt')).toBeNull()
    expect(destinoDepoisDoEnvio({ afterSubmit: 'page', redirectPath: null }, 'pt')).toBeNull()
  })
})

/* Task 052: a lista de Sistema → Integrações usa a mesma regra do envio. */
describe('toFormularioNoRd', () => {
  it('situação, identificador e tags como vão ao RD — identificador fora do formato não vai', () => {
    expect(toFormularioNoRd({ ...base(), _status: 'published', rd: { conversionIdentifier: ' Evento ', tags: ['a', ' a', 'b'] } })).toEqual({
      id: 7,
      nome: 'Inscrição no evento',
      publicado: true,
      identificador: 'Evento',
      tags: ['a', 'b'],
    })
    expect(toFormularioNoRd({ ...base(), _status: 'draft', rd: { conversionIdentifier: 'com < sinal', tags: null } })).toMatchObject({
      publicado: false,
      identificador: null,
      tags: [],
    })
  })
})
