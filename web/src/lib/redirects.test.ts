import { describe, expect, it } from 'vitest'

import { ehSetor } from './diagnostico-maturidade'
import {
  PRIMEIRA_PAGINA,
  ROTAS_APOSENTADAS,
  ROTAS_RENOMEADAS,
  SOLUCOES_QUE_MUDARAM,
  caminhosGone,
  lerCsv,
  redirectsDoNext,
} from './redirects'
import { canonizarSegmento } from './routes'

const CSV = `from,to,status,note
/2021/10/18/elementor-2817/,/blog/elementor-2817,301,post 1:1
/quem-somos/,/sobre,301,N:1 institucional
/sobre/,/sobre,301,N:1 institucional
/em-manutencao/,,410,pagina tecnica do WordPress
/sample-page/,/,301,e a pagina inicial do WordPress

`

describe('lerCsv', () => {
  it('lê as 4 colunas e ignora linha vazia', () => {
    const r = lerCsv(CSV)
    expect(r).toHaveLength(5)
    expect(r[0]).toEqual({ from: '/2021/10/18/elementor-2817/', to: '/blog/elementor-2817', status: 301, note: 'post 1:1' })
  })

  /* A `note` é texto livre. O gerador proíbe vírgula lá, mas o arquivo é
     versionado e editável à mão — quebrar a linha inteira por causa disso seria
     perder um redirect sem avisar. */
  it('não deixa vírgula na justificativa comer a linha', () => {
    const [l] = lerCsv('from,to,status,note\n/a/,/b,301,N:1 porque sim, e porque também')
    expect(l.to).toBe('/b')
    expect(l.note).toBe('N:1 porque sim, e porque também')
  })

  it('descarta linha que não começa com barra', () => {
    expect(lerCsv('from,to,status,note\nlixo')).toHaveLength(0)
  })
})

describe('redirectsDoNext', () => {
  const r = redirectsDoNext(lerCsv(CSV))

  it('tira a barra final do `source`, que o Next normaliza', () => {
    expect(r[0].source).toBe('/2021/10/18/elementor-2817')
  })

  /* `redirects()` do Next só emite 307/308 e não sabe dizer "Gone". Deixar o
     410 passar viraria redirect para destino vazio — que o Next aceita e serve
     como redirect para a raiz. */
  it('deixa o 410 de fora', () => {
    expect(r.map((x) => x.source)).not.toContain('/em-manutencao')
    expect(r).toHaveLength(3)
  })

  /* Sete linhas do arquivo real são assim — `/sobre/` → `/sobre` e companhia.
     Com a barra final normalizada antes, viram `/sobre` → `/sobre`, e o
     navegador desiste com ERR_TOO_MANY_REDIRECTS na página institucional mais
     visitada do site. */
  it('descarta redirect de uma URL para ela mesma', () => {
    expect(r.map((x) => x.source)).not.toContain('/sobre')
    expect(r.filter((x) => x.destination === '/sobre')).toHaveLength(1)
  })

  it('preserva o destino na raiz', () => {
    expect(r.find((x) => x.source === '/sample-page')?.destination).toBe('/')
  })

  it('marca tudo como permanente', () => {
    expect(r.every((x) => x.permanent)).toBe(true)
  })
})

/* D-35: o link do diagnóstico RC18 circula em e-mail de campanha e favorito, e
   tem de cair no diagnóstico novo já no setor financeiro. */
describe('ROTAS_APOSENTADAS', () => {
  const destinoDe = (source: string) => ROTAS_APOSENTADAS.find((r) => r.source === source)?.destination

  it('leva o diagnóstico RC18 ao de maturidade, no setor financeiro, nos dois idiomas', () => {
    expect(destinoDe('/diagnostico-rc18')).toBe('/diagnostico-maturidade?setor=financeiro')
    expect(destinoDe('/en/rc18-diagnostic')).toBe('/en/data-maturity-assessment?setor=financeiro')
  })

  /* Com `trailingSlash: false` a barra final sai antes da consulta à lista:
     origem com barra nunca casaria, e origem igual ao destino seria laço. */
  it('origem sem barra final, diferente do destino e permanente', () => {
    for (const r of ROTAS_APOSENTADAS) {
      expect(r.source).not.toMatch(/\/$/)
      expect(r.destination.split('?')[0]).not.toBe(r.source)
      expect(r.permanent).toBe(true)
    }
  })

  /* O `?setor=` é lido pela página nova; código que o motor não conhece abre o
     perfil sem seleção, e o redirect perderia o sentido sem ninguém notar. */
  it('o setor do destino é um código que o diagnóstico conhece', () => {
    for (const r of ROTAS_APOSENTADAS) {
      expect(ehSetor(new URLSearchParams(r.destination.split('?')[1]).get('setor'))).toBe(true)
    }
  })

  /* Se a seção voltar a `routes.ts`, a rota reaparece e o redirect a esconde:
     uma das duas coisas está errada. */
  it('a origem não é mais seção do site', () => {
    expect(canonizarSegmento('diagnostico-rc18', 'pt')).toBeNull()
    expect(canonizarSegmento('rc18-diagnostic', 'en')).toBeNull()
  })
})

/* 01/10: "Relatórios" virou "ATRA na mídia" e o endereço mudou junto. O antigo
   está em link gravado no CMS e em favorito de quem viu a homologação. */
describe('ROTAS_RENOMEADAS', () => {
  const destinoDe = (source: string) => ROTAS_RENOMEADAS.find((r) => r.source === source)?.destination

  it('leva /relatorios e /en/reports ao endereço novo, com e sem slug', () => {
    expect(destinoDe('/relatorios')).toBe('/atra-na-midia')
    // Com slug, a lista: os relatórios saíram do site e matéria não tem página (D-49).
    expect(destinoDe('/relatorios/:slug')).toBe('/atra-na-midia')
    expect(destinoDe('/en/reports')).toBe('/en/atra-in-the-media')
    expect(destinoDe('/en/reports/:slug')).toBe('/en/atra-in-the-media')
  })

  it('origem sem barra final, diferente do destino e permanente', () => {
    for (const r of ROTAS_RENOMEADAS) {
      expect(r.source).not.toMatch(/\/$/)
      expect(r.destination).not.toBe(r.source)
      expect(r.permanent).toBe(true)
    }
  })

  /* Se o endereço antigo voltar a `routes.ts`, a rota reaparece e o redirect a
     esconde: uma das duas coisas está errada. */
  it('a origem não é mais endereço de seção', () => {
    expect(canonizarSegmento('relatorios', 'pt')).toBeNull()
    expect(canonizarSegmento('reports', 'en')).toBeNull()
    expect(canonizarSegmento('atra-na-midia', 'pt')).toBe('atra-na-midia')
    expect(canonizarSegmento('atra-in-the-media', 'en')).toBe('atra-na-midia')
  })
})

/* D-52: as soluções antigas saíram, e o endereço de cada uma leva à solução
   nova mais próxima. */
describe('SOLUCOES_QUE_MUDARAM', () => {
  const destinoDe = (source: string) => SOLUCOES_QUE_MUDARAM.find((r) => r.source === source)?.destination

  it('leva o endereço antigo à solução nova, nos dois idiomas', () => {
    expect(destinoDe('/solucoes/inteligencia-artificial')).toBe('/solucoes/ia-generativa-e-agentes-conversacionais')
    expect(destinoDe('/en/solutions/inteligencia-artificial')).toBe('/en/solutions/ia-generativa-e-agentes-conversacionais')
    expect(destinoDe('/solucoes/customer-360')).toBe('/solucoes/master-data-e-customer-360')
  })

  /* Estas duas nasceram de novo no mesmo endereço: redirect ali viraria laço. */
  it('quem manteve o endereço não entra', () => {
    expect(destinoDe('/solucoes/alocacao-de-consultores')).toBeUndefined()
    expect(destinoDe('/solucoes/assessoria-em-produtos')).toBeUndefined()
  })

  it('a RC18 não é tocada', () => {
    expect(SOLUCOES_QUE_MUDARAM.some((r) => r.source.includes('rc18') || r.destination.includes('rc18'))).toBe(false)
  })

  it('origem sem barra final, diferente do destino e permanente', () => {
    for (const r of SOLUCOES_QUE_MUDARAM) {
      expect(r.source).not.toMatch(/\/$/)
      expect(r.destination).not.toBe(r.source)
      expect(r.permanent).toBe(true)
    }
  })
})

/* D-47: `/blog/pagina/1` é `/blog`. Na lista de redirects, e não dentro da
   página — lá o Next respondia com o `Location` em dobro. */
describe('PRIMEIRA_PAGINA', () => {
  it('leva a página 1 do blog à própria seção, nos dois idiomas', () => {
    expect(PRIMEIRA_PAGINA).toEqual([
      { source: '/blog/pagina/1', destination: '/blog', permanent: true },
      { source: '/en/blog/pagina/1', destination: '/en/blog', permanent: true },
    ])
  })
})

describe('caminhosGone', () => {
  it('separa o que sai de propósito, sem barra final', () => {
    expect(caminhosGone(lerCsv(CSV))).toEqual(['/em-manutencao'])
  })
})
