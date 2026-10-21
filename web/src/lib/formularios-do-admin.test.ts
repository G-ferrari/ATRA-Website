import { describe, expect, it } from 'vitest'

import {
  conferirCampos,
  ehCampoPersonalizadoDoRd,
  ehEnderecoInterno,
  sugerirIdentificador,
  valorDaOpcao,
  valoresDasOpcoes,
} from './formularios-do-admin'

describe('sugerirIdentificador', () => {
  it('usa o próprio nome, com espaço e acento, como o RD aceita', () => {
    expect(sugerirIdentificador('Inscrição Evento Dados & IA')).toBe('Inscrição Evento Dados & IA')
  })

  it('tira o que a validação recusaria e junta os espaços', () => {
    expect(sugerirIdentificador('  Campanha "Out" <2026>\n  ')).toBe('Campanha Out 2026')
  })

  it('corta em 100 caracteres', () => {
    expect(sugerirIdentificador('a'.repeat(140))).toHaveLength(100)
  })

  it('não sugere nada de um nome vazio ou só com sinais', () => {
    expect(sugerirIdentificador('')).toBeNull()
    expect(sugerirIdentificador(null)).toBeNull()
    expect(sugerirIdentificador('<<>>')).toBeNull()
  })
})

describe('valorDaOpcao', () => {
  it('gera o valor sem acento, minúsculo e com hífen', () => {
    expect(valorDaOpcao('Governança & Qualidade')).toBe('governanca-qualidade')
    expect(valorDaOpcao('  IA generativa  ')).toBe('ia-generativa')
  })
})

describe('valoresDasOpcoes', () => {
  it('opção nova ganha o valor do rótulo; repetido ganha sufixo; vazio vira "opcao"', () => {
    expect(valoresDasOpcoes([{ label: 'Sim' }, { label: 'Sim' }, { label: '' }, { label: '!!' }], [])).toEqual([
      'sim',
      'sim-2',
      'opcao',
      'opcao-2',
    ])
  })

  it('opção salva mantém o valor mesmo com o rótulo reescrito', () => {
    expect(valoresDasOpcoes([{ id: 'a', label: 'Sim, já uso', value: 'sim' }], [{ id: 'a', value: 'sim' }])).toEqual(['sim'])
  })

  it('opção nova arrastada para o topo não toma o valor da antiga', () => {
    const atuais = [{ id: 'b', label: 'Sim' }, { id: 'a', label: 'Sim, já uso', value: 'sim' }]
    expect(valoresDasOpcoes(atuais, [{ id: 'a', value: 'sim' }])).toEqual(['sim-2', 'sim'])
  })

  it('linha duplicada no admin não leva o valor copiado: gera o próprio', () => {
    const atuais = [{ id: 'a', label: 'Dados', value: 'dados' }, { id: 'nova', label: 'IA', value: 'dados' }]
    expect(valoresDasOpcoes(atuais, [{ id: 'a', value: 'dados' }])).toEqual(['dados', 'ia'])
  })

  it('o sufixo pula valores já tomados e cabe em 60 caracteres', () => {
    expect(valoresDasOpcoes([{ label: 'Sim' }], [])).toEqual(['sim'])
    const salvas = [{ id: 'x', value: 'sim' }, { id: 'y', value: 'sim-2' }]
    expect(valoresDasOpcoes([{ id: 'x', label: 'Sim' }, { id: 'y', label: 'Sim' }, { label: 'Sim' }], salvas)).toEqual([
      'sim',
      'sim-2',
      'sim-3',
    ])
    const longo = 'Quero receber uma proposta comercial para um projeto de dados agora'
    const [primeiro, segundo] = valoresDasOpcoes([{ label: longo }, { label: longo }], [])
    expect(primeiro).toHaveLength(60)
    expect(segundo).toHaveLength(60)
    expect(segundo.endsWith('-2')).toBe(true)
  })
})

describe('ehCampoPersonalizadoDoRd', () => {
  it('aceita cf_ com minúsculas, números e sublinhado', () => {
    expect(ehCampoPersonalizadoDoRd('cf_area_de_interesse')).toBe(true)
    expect(ehCampoPersonalizadoDoRd('cf_q2')).toBe(true)
  })

  it('recusa sem o prefixo, com espaço, maiúscula ou só o prefixo', () => {
    expect(ehCampoPersonalizadoDoRd('area')).toBe(false)
    expect(ehCampoPersonalizadoDoRd('cf_area de interesse')).toBe(false)
    expect(ehCampoPersonalizadoDoRd('cf_Area')).toBe(false)
    expect(ehCampoPersonalizadoDoRd('cf_')).toBe(false)
  })
})

describe('ehEnderecoInterno', () => {
  it('aceita caminho do próprio site em português', () => {
    expect(ehEnderecoInterno('/')).toBe(true)
    expect(ehEnderecoInterno('/contato')).toBe(true)
    expect(ehEnderecoInterno('/cases-de-sucesso/marketplace-governanca-dados#resultados')).toBe(true)
  })

  it('recusa outro domínio, endereço sem barra, espaço e o caminho em inglês', () => {
    expect(ehEnderecoInterno('https://exemplo.com')).toBe(false)
    expect(ehEnderecoInterno('//exemplo.com')).toBe(false)
    expect(ehEnderecoInterno('contato')).toBe(false)
    expect(ehEnderecoInterno('/fale conosco')).toBe(false)
    expect(ehEnderecoInterno('/en/contact')).toBe(false)
    expect(ehEnderecoInterno('/en')).toBe(false)
  })

  it('recusa o prefixo de idioma em qualquer caixa e caractere de controle, mas aceita "/entrega"', () => {
    expect(ehEnderecoInterno('/pt/contato')).toBe(false)
    expect(ehEnderecoInterno('/EN/contact')).toBe(false)
    expect(ehEnderecoInterno('/en?x=1')).toBe(false)
    expect(ehEnderecoInterno('/\u0000/x')).toBe(false)
    expect(ehEnderecoInterno('/contato​')).toBe(false)
    expect(ehEnderecoInterno('/entrega')).toBe(true)
  })
})

describe('conferirCampos', () => {
  it('aceita exatamente um e-mail', () => {
    expect(conferirCampos([{ type: 'name' }, { type: 'email' }, { type: 'shortText' }, { type: 'shortText' }])).toBeNull()
  })

  it('recusa sem e-mail e com dois', () => {
    expect(conferirCampos([{ type: 'name' }])).toMatch(/precisa de um campo de e-mail/)
    expect(conferirCampos([{ type: 'email' }, { type: 'email' }])).toMatch(/mais de um campo de e-mail/)
    expect(conferirCampos(null)).toMatch(/precisa de um campo de e-mail/)
  })

  it('recusa tipo com campo padrão repetido, dizendo qual', () => {
    expect(conferirCampos([{ type: 'email' }, { type: 'phone' }, { type: 'phone' }])).toMatch(/"Telefone" aparece mais de uma vez/)
  })

  it('recusa dois campos mandando para o mesmo cf_, mas ignora o cf_ escondido de um tipo padrão', () => {
    expect(
      conferirCampos([{ type: 'email' }, { type: 'shortText', rdField: 'cf_a' }, { type: 'longText', rdField: ' cf_a ' }]),
    ).toMatch(/"cf_a"/)
    expect(conferirCampos([{ type: 'email' }, { type: 'shortText', rdField: 'cf_a' }, { type: 'phone', rdField: 'cf_a' }])).toBeNull()
  })

  it('aceita uma caixa de consentimento opcional; recusa duas e recusa obrigatória', () => {
    expect(conferirCampos([{ type: 'email' }, { type: 'checkbox', consent: true }])).toBeNull()
    expect(conferirCampos([{ type: 'email' }, { type: 'checkbox', consent: true }, { type: 'checkbox', consent: true }])).toMatch(
      /Só uma caixa/,
    )
    expect(conferirCampos([{ type: 'email' }, { type: 'checkbox', consent: true, required: true }])).toMatch(/não pode ser obrigatória/)
    expect(conferirCampos([{ type: 'email' }, { type: 'checkbox', required: true }])).toBeNull()
  })

  it('recusa mais de 20 campos', () => {
    expect(conferirCampos([{ type: 'email' }, ...Array.from({ length: 20 }, () => ({ type: 'shortText' }))])).toMatch(/no máximo 20/)
  })
})
