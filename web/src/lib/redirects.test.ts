import { describe, expect, it } from 'vitest'

import { caminhosGone, lerCsv, redirectsDoNext } from './redirects'

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

describe('caminhosGone', () => {
  it('separa o que sai de propósito, sem barra final', () => {
    expect(caminhosGone(lerCsv(CSV))).toEqual(['/em-manutencao'])
  })
})
