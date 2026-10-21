import { describe, expect, it } from 'vitest'

import type { ConfigDoFormulario } from '@/types/content'

import {
  conferirEnvio,
  MAX_TEXTO_CURTO,
  MAX_TEXTO_LONGO,
  nomeDoCampo,
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

  it('só ASCII imprimível: o endereço vai cru para o cabeçalho Location', () => {
    expect(ehEnderecoInterno('/obrigado—evento')).toBe(false)
    expect(ehEnderecoInterno('/eventos/inscrição')).toBe(false)
    expect(ehEnderecoInterno('/eventos/inscricao?origem=home#form')).toBe(true)
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

describe('conferirEnvio', () => {
  const campo = (id: string, tipo: ConfigDoFormulario['campos'][number]['tipo'], extra: Partial<ConfigDoFormulario['campos'][number]> = {}) => ({
    id,
    tipo,
    rotulo: `Rótulo ${id}`,
    obrigatorio: false,
    valores: [],
    consentimento: false,
    campoNoRd: null,
    ...extra,
  })
  const config = {
    campos: [
      campo('n', 'name', { obrigatorio: true }),
      campo('e', 'email', { obrigatorio: true }),
      campo('c', 'jobTitle'),
      campo('s', 'select', { valores: ['dados', 'ia'] }),
      campo('m', 'longText'),
      campo('k', 'checkbox', { consentimento: true }),
    ],
  }
  const envio = (dados: Record<string, string>) => (id: string) => dados[id] ?? ''

  it('aceita o envio válido, com respostas na ordem, campos padrão e consentimento', () => {
    const r = conferirEnvio(config, envio({ n: ' Ana ', e: 'ana@empresa.com.br', c: 'CDO', s: 'ia', m: 'Oi\ntudo bem', k: 'on' }), 'pt')
    expect(r).toEqual({
      ok: true,
      respostas: [
        { campoId: 'n', rotulo: 'Rótulo n', valor: 'Ana' },
        { campoId: 'e', rotulo: 'Rótulo e', valor: 'ana@empresa.com.br' },
        { campoId: 'c', rotulo: 'Rótulo c', valor: 'CDO' },
        { campoId: 's', rotulo: 'Rótulo s', valor: 'ia' },
        { campoId: 'm', rotulo: 'Rótulo m', valor: 'Oi\ntudo bem' },
        { campoId: 'k', rotulo: 'Rótulo k', valor: 'Sim' },
      ],
      padrao: { name: 'Ana', email: 'ana@empresa.com.br', jobTitle: 'CDO' },
      consentimento: true,
    })
  })

  it('caixa desmarcada fica "Não" e sem consentimento; opcional vazio fica de fora', () => {
    const r = conferirEnvio(config, envio({ n: 'Ana', e: 'ana@empresa.com.br' }), 'pt')
    expect(r.ok && r.consentimento).toBe(false)
    expect(r.ok && r.respostas.map((x) => x.campoId)).toEqual(['n', 'e', 'k'])
  })

  it('recusa obrigatório vazio, e-mail inválido e opção fora da lista, com a mensagem no idioma', () => {
    expect(conferirEnvio(config, envio({ e: 'não é e-mail', s: 'outra' }), 'pt')).toEqual({
      ok: false,
      erros: { n: 'Preencha este campo.', e: 'Confira o e-mail informado.', s: 'Escolha uma das opções.' },
    })
    expect(conferirEnvio(config, envio({ n: 'Ana' }), 'en')).toEqual({ ok: false, erros: { e: 'Please fill in this field.' } })
  })

  it('e-mail pela régua do Payload: recusa o que o `create` recusaria', () => {
    for (const ruim of ['ana..souza@empresa.com', 'joão@empresa.com.br', 'ana.@empresa.com', 'ana@empresa.com.br,']) {
      expect(conferirEnvio(config, envio({ n: 'Ana', e: ruim }), 'pt')).toEqual({ ok: false, erros: { e: 'Confira o e-mail informado.' } })
    }
    expect(conferirEnvio(config, envio({ n: 'Ana', e: 'ana.souza+site@empresa.com.br' }), 'pt').ok).toBe(true)
  })

  it('campo de uma linha perde a quebra de linha; o texto longo mantém', () => {
    const r = conferirEnvio(config, envio({ n: 'Ana\r\nVeio de: forjado', e: 'a@b.co', m: 'linha 1\nlinha 2' }), 'pt')
    expect(r.ok && r.padrao.name).toBe('Ana Veio de: forjado')
    expect(r.ok && r.respostas.find((x) => x.campoId === 'm')?.valor).toBe('linha 1\nlinha 2')
  })

  it('caixa obrigatória precisa ser marcada', () => {
    const r = conferirEnvio({ campos: [campo('e', 'email', { obrigatorio: true }), campo('k', 'checkbox', { obrigatorio: true })] }, envio({ e: 'a@b.co' }), 'pt')
    expect(r).toEqual({ ok: false, erros: { k: 'Marque esta opção para enviar.' } })
  })

  it('só lê os campos do formulário: nome intruso nem é procurado', () => {
    const lidos: string[] = []
    conferirEnvio(config, (id) => (lidos.push(id), id === 'e' ? 'a@b.co' : id === 'n' ? 'Ana' : ''), 'pt')
    expect(lidos).toEqual(['n', 'e', 'c', 's', 'm', 'k'])
  })

  it('corta no teto: texto curto em 200, texto longo em 5000', () => {
    const r = conferirEnvio(config, envio({ n: 'a'.repeat(500), e: 'a@b.co', m: 'b'.repeat(9000) }), 'pt')
    expect(r.ok && r.respostas.find((x) => x.campoId === 'n')?.valor).toHaveLength(MAX_TEXTO_CURTO)
    expect(r.ok && r.respostas.find((x) => x.campoId === 'm')?.valor).toHaveLength(MAX_TEXTO_LONGO)
  })

  it('o nome no formulário tem prefixo, para não colidir com os campos de controle', () => {
    expect(nomeDoCampo('6716a1')).toBe('campo-6716a1')
  })
})
