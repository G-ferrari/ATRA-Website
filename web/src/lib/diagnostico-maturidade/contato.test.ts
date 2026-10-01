import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { COOKIE_DE_CONSENTIMENTO, VERSAO_DE_CONSENTIMENTO } from '@/lib/consentimento'
import { definirContainer, rastrear } from '@/lib/rastreio'

import { perguntasDoSetor } from '.'
import { ERROS_DO_CONTATO, parametrosDoLead, validarContato, type ContatoDigitado } from './contato'

/* A validação do formulário de contato (task 027) e o evento do envio aceito.
 *
 * A action entra de verdade no bloco de paridade: é ela a regra, e o cliente só
 * a antecipa. Banco, e-mail, globais e cabeçalhos são simulados — o caso válido
 * chega até o `getPayload`, que falha de propósito: o que importa aqui é que a
 * action **passou** pelo contato, não o que ela grava (isso é o
 * `diagnostico-maturidade.test.ts` da action). */

vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-real-ip': '203.0.113.9' }) }))
vi.mock('@/lib/payload', () => ({ getPayload: async () => Promise.reject(new Error('sem banco no teste')) }))
vi.mock('@/lib/email', () => ({ enviarAviso: async () => false }))
vi.mock('@/lib/contato', () => ({ lerContato: async () => ({ email: 'negocios@atra.com.br' }) }))
vi.mock('@/lib/diagnostico', () => ({ lerDiagnosticoDeMaturidade: async () => ({}) }))

const { enviarDiagnosticoDeMaturidade } = await import('@/actions/diagnostico-maturidade')

const VALIDO: ContatoDigitado = {
  name: 'Ana Souza',
  email: 'ana.souza@banco.com.br',
  phone: '(11) 99999-0000',
  consentimento: true,
}
const com = (extra: Partial<ContatoDigitado>): ContatoDigitado => ({ ...VALIDO, ...extra })

describe('validarContato', () => {
  it('contato completo passa', () => {
    expect(validarContato(VALIDO)).toEqual({})
  })

  it('recusa e-mail pessoal com a mensagem do HTML', () => {
    for (const email of ['ana@gmail.com', 'Ana.Souza@GMAIL.COM', 'ana@hotmail.com', 'ana@icloud.com']) {
      expect(validarContato(com({ email })), email).toEqual({ email: ERROS_DO_CONTATO.email })
    }
    expect(ERROS_DO_CONTATO.email).toBe('Use um e-mail corporativo válido (não aceitamos gmail, hotmail, etc.).')
  })

  it('sem consentimento não envia', () => {
    expect(validarContato(com({ consentimento: false }))).toEqual({
      consentimento: 'É preciso autorizar o contato para receber o diagnóstico.',
    })
  })

  it('aponta todos os campos de uma vez, e só os obrigatórios', () => {
    expect(validarContato({ name: '', email: '', phone: '', consentimento: false })).toEqual(ERROS_DO_CONTATO)
  })
})

/* Os casos de borda são os que separam uma validação da outra: espaço nas
 * pontas, espaço no meio, e-mail sem domínio de topo, telefone contado por
 * dígito. */
const CASOS: [string, ContatoDigitado][] = [
  ['válido', VALIDO],
  ['gmail', com({ email: 'ana@gmail.com' })],
  ['hotmail em maiúsculas', com({ email: 'ANA@HOTMAIL.COM' })],
  ['e-mail sem domínio de topo', com({ email: 'ana@banco' })],
  ['e-mail com espaço no meio', com({ email: 'ana @banco.com.br' })],
  ['e-mail com espaço nas pontas', com({ email: '  ana@banco.com.br  ' })],
  ['nome curto', com({ name: 'Al' })],
  ['nome de três letras entre espaços', com({ name: '  A    b ' })],
  ['telefone com 9 dígitos', com({ phone: '(11) 9999-000' })],
  ['telefone com 10 dígitos', com({ phone: '11 9999-0000' })],
  ['sem consentimento', com({ consentimento: false })],
  ['tudo vazio', { name: '', email: '', phone: '', consentimento: false }],
]

describe('paridade com a action', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  for (const [nome, contato] of CASOS) {
    it(`${nome}: o cliente recusa exatamente o que o servidor recusa`, async () => {
      const dados = new FormData()
      dados.set('setor', 'financeiro')
      dados.set('porte', '1_5bi')
      dados.set('cargo', 'cio_cto_cdo')
      dados.set('respostas', JSON.stringify({ [perguntasDoSetor('financeiro')[0].id]: 1 }))
      dados.set('name', contato.name)
      dados.set('email', contato.email)
      dados.set('phone', contato.phone)
      if (contato.consentimento) dados.set('consentimento', 'on')

      const r = await enviarDiagnosticoDeMaturidade(null, dados)
      const doServidor = !r.ok && r.codigo === 'contato' ? r.campos : {}
      expect(validarContato(contato)).toEqual(doServidor)
    })
  }
})

/* `rastrear` de verdade, com `window`, `document` e o container do GTM
 * simulados — a matriz de `rastreio.test.ts` aplicada ao evento do
 * diagnóstico. */
describe('quiz_maturidade_lead', () => {
  const janela: { dataLayer?: Record<string, unknown>[] } = {}
  const documento = { cookie: '' }
  const consentimento = (analytics: boolean, marketing: boolean) =>
    `${COOKIE_DE_CONSENTIMENTO}=${encodeURIComponent(
      JSON.stringify({ v: VERSAO_DE_CONSENTIMENTO, analytics, marketing, ts: 1 }),
    )}`
  const disparar = () => rastrear('quiz_maturidade_lead', parametrosDoLead('saude'))

  beforeEach(() => {
    janela.dataLayer = undefined
    documento.cookie = ''
    vi.stubGlobal('window', janela)
    vi.stubGlobal('document', documento)
    definirContainer(true)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    definirContainer(false)
  })

  it('com consentimento de estatística, vai ao dataLayer com o setor e sem nível', () => {
    documento.cookie = consentimento(true, false)
    disparar()
    expect(janela.dataLayer).toEqual([{ event: 'quiz_maturidade_lead', quiz_setor: 'saude' }])
  })

  it('sem resposta ao banner, não sai', () => {
    disparar()
    expect(janela.dataLayer).toBeUndefined()
  })

  it('recusando tudo, não sai', () => {
    documento.cookie = consentimento(false, false)
    disparar()
    expect(janela.dataLayer).toBeUndefined()
  })

  /* ⚠️ Só marketing também não sai. O `dataLayer` só tem leitor quando o GTM
   * está na página, e o GTM só entra com estatística (`components/layout/
   * gtm.tsx`); a regra mora em `rastrear` (D-30), não em cada evento. */
  it('só com marketing, não sai: sem estatística não há GTM para ler', () => {
    documento.cookie = consentimento(false, true)
    disparar()
    expect(janela.dataLayer).toBeUndefined()
  })

  it('sem setor, vai sem parâmetro em vez de inventar um', () => {
    expect(parametrosDoLead(null)).toEqual({})
    expect(parametrosDoLead('financeiro')).toEqual({ quiz_setor: 'financeiro' })
  })
})
