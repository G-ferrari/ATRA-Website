import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { ICONES } from '@/blocks/shared'

import { PAGINAS_DO_WORDPRESS } from './conteudo'

/* O que estes testes protegem: a migração só descobre um ícone inexistente, um
 * arquivo que faltou no commit ou uma página repetida **no deploy**, quando o
 * Payload recusa a gravação no meio da troca. Aqui o erro aparece no CI. */

const pasta = path.dirname(fileURLToPath(import.meta.url))

describe('páginas de solução do WordPress', () => {
  it('são as 11, sem repetir — Alocação e IA ficam de fora', () => {
    const slugs = PAGINAS_DO_WORDPRESS.map((p) => p.slug)
    expect(slugs).toHaveLength(11)
    expect(new Set(slugs).size).toBe(11)
    expect(slugs).not.toContain('alocacao-de-consultores')
    expect(slugs).not.toContain('inteligencia-artificial')
  })

  it('toda imagem do herói está versionada ao lado', () => {
    for (const p of PAGINAS_DO_WORDPRESS) expect(existsSync(path.join(pasta, p.imagem)), p.imagem).toBe(true)
  })

  it('todo cartão usa um ícone que o bloco aceita', () => {
    const aceitos = new Set<string>(ICONES)
    for (const p of PAGINAS_DO_WORDPRESS)
      for (const s of p.secoes)
        if (s.tipo === 'cards') for (const c of s.itens) expect(aceitos.has(c.icone), `${p.slug}: ${c.icone}`).toBe(true)
  })

  it('toda página tem chamada, e toda seção de texto tem corpo', () => {
    for (const p of PAGINAS_DO_WORDPRESS) {
      expect(p.chamada.trim(), p.slug).not.toBe('')
      for (const s of p.secoes) if (s.tipo === 'texto') expect(s.corpo.length, `${p.slug}: ${s.titulo}`).toBeGreaterThan(0)
    }
  })
})
