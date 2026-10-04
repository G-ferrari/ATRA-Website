import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { MATERIAS_DO_WORDPRESS } from './conteudo'

/* O que estes testes protegem: a migração só descobriria uma capa que faltou no
 * commit, um link repetido (o campo é `unique`) ou um resumo maior que o campo
 * **no deploy**, com o site no meio da troca. Aqui o erro aparece no CI. */

const pasta = path.dirname(fileURLToPath(import.meta.url))

describe('matérias da imprensa vindas do WordPress', () => {
  it('são as 6 da página antiga, cada uma com um link diferente', () => {
    expect(MATERIAS_DO_WORDPRESS).toHaveLength(6)
    expect(new Set(MATERIAS_DO_WORDPRESS.map((m) => m.url)).size).toBe(6)
  })

  it('toda matéria cabe nos campos da collection', () => {
    for (const m of MATERIAS_DO_WORDPRESS) {
      expect(m.url, m.veiculo).toMatch(/^https:\/\/\S+$/)
      expect(m.veiculo.trim(), m.url).not.toBe('')
      expect(m.titulo.trim(), m.url).not.toBe('')
      expect(m.resumo.trim(), m.url).not.toBe('')
      // `maxLength` do campo `description` em `collections/Press.ts`.
      expect(m.resumo.length, m.veiculo).toBeLessThanOrEqual(300)
    }
  })

  it('link do YouTube é vídeo; o resto é matéria', () => {
    for (const m of MATERIAS_DO_WORDPRESS) {
      expect(m.tipo, m.url).toBe(/youtube\.com|youtu\.be/.test(m.url) ? 'video' : 'article')
    }
  })

  /* O prefixo numerado é a chave pela qual a migração acha a capa no acervo:
     repetido, duas matérias ficariam com a mesma imagem. */
  it('toda capa está versionada ao lado, com prefixo próprio', () => {
    const prefixos = MATERIAS_DO_WORDPRESS.map((m) => m.imagem.match(/^atra-na-midia-\d+-/)?.[0])
    expect(prefixos.every(Boolean)).toBe(true)
    expect(new Set(prefixos).size).toBe(6)
    for (const m of MATERIAS_DO_WORDPRESS) expect(existsSync(path.join(pasta, m.imagem)), m.imagem).toBe(true)
  })
})
