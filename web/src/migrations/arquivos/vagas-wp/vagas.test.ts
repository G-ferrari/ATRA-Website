import { describe, expect, it } from 'vitest'

import { slugify } from '../../../fields/slug'

import { FIM_DA_CARGA, intocada, lerVagasExportadas, PROVA_DA_CARGA, VAGAS_FECHADAS } from './sincronia'

/* A migração cria, atualiza e despublica vagas no deploy. O que este teste
 * segura é o arquivo exportado e as listas: um slug fora do padrão ou uma vaga
 * aberta na lista das fechadas só apareceriam na homologação. */

const vagas = lerVagasExportadas()

describe('vagas.json', () => {
  it('tem as 9 vagas abertas no WordPress em 03/10', () => {
    expect(vagas).toHaveLength(9)
    expect(new Set(vagas.map((v) => v.slug)).size).toBe(9)
  })

  it('cada uma com título, resumo de até 220 caracteres, modelo, data e corpo', () => {
    for (const v of vagas) {
      expect(v.titulo.trim(), v.slug).toBe(v.titulo)
      expect(v.titulo.length, v.slug).toBeGreaterThan(0)
      expect(v.resumo.length, v.slug).toBeGreaterThan(0)
      expect(v.resumo.length, v.slug).toBeLessThanOrEqual(220)
      expect(['remote', 'hybrid', 'onsite']).toContain(v.modelo)
      expect(Number.isNaN(Date.parse(v.publicadaEm)), v.slug).toBe(false)
      expect((v.corpo as { type?: string }).type, v.slug).toBe('root')
    }
  })

  it('o slug é o normalizado, e a origem é o endereço do WordPress', () => {
    for (const v of vagas) {
      expect(slugify(v.slug)).toBe(v.slug)
      expect(v.origem).toBe(`/${v.slug}/`)
    }
  })

  /* O corpo sai do recorte do importador: o cabeçalho do modelo do WordPress
     ("Explore nossas vagas… #vemserATRA") e o formulário não podem vir junto. */
  it('o corpo não traz o cabeçalho do modelo nem o formulário', () => {
    for (const v of vagas) {
      const texto = JSON.stringify(v.corpo)
      expect(texto, v.slug).not.toMatch(/#vemserATRA|Explore nossas vagas|Envie seu Curr/i)
    }
  })
})

describe('listas da sincronia', () => {
  it('nenhuma vaga fechada está entre as abertas', () => {
    const abertas = new Set(vagas.map((v) => v.slug))
    for (const slug of VAGAS_FECHADAS) expect(abertas.has(slug), slug).toBe(false)
  })

  it('a prova da carga é uma das vagas de 25/08', () => {
    expect(VAGAS_FECHADAS).toContain(PROVA_DA_CARGA)
  })

  it('vaga alterada depois da carga conta como editada no admin', () => {
    expect(intocada('2026-08-25T19:11:00.000Z')).toBe(true)
    expect(intocada(FIM_DA_CARGA)).toBe(false)
    expect(intocada('2026-09-30T10:00:00.000Z')).toBe(false)
    expect(intocada(null)).toBe(false)
  })
})
