import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { slugify } from '@/fields/slug'

import type { PostExportado } from './tipos'

/* O que estes testes protegem: a migração só descobriria um arquivo de imagem
 * que faltou no commit, um nó de imagem sem arquivo ou um artigo sem redirect
 * **no deploy**, com o site no meio da troca. Aqui o erro aparece no CI. */

const pasta = path.dirname(fileURLToPath(import.meta.url))
const posts: PostExportado[] = JSON.parse(readFileSync(path.join(pasta, 'posts.json'), 'utf8'))
const redirects = readFileSync(path.resolve(pasta, '../../../../../docs/02-especificacao/dados/redirects.csv'), 'utf8')

type No = { type?: string; children?: No[]; pending?: { arquivo?: string; src?: string }; value?: unknown }
const uploads = (no: No): No[] => [...(no.type === 'upload' ? [no] : []), ...(no.children ?? []).flatMap(uploads)]

describe('artigos exportados do WordPress', () => {
  it('são os 6 publicados depois da carga, sem repetir, com slug normalizado', () => {
    expect(posts).toHaveLength(6)
    expect(new Set(posts.map((p) => p.slug)).size).toBe(6)
    for (const p of posts) {
      expect(p.slug).toBe(slugify(p.slug))
      expect(p.publicadoEm >= '2026-08-18', p.slug).toBe(true)
      expect(p.titulo.trim(), p.slug).not.toBe('')
      expect(p.resumo.trim(), p.slug).not.toBe('')
    }
  })

  it('toda imagem — capa e corpo — está versionada ao lado, com alt e chave do WordPress', () => {
    for (const p of posts) {
      expect(p.imagens.map((i) => i.arquivo), p.slug).toContain(p.capa)
      for (const i of p.imagens) {
        expect(existsSync(path.join(pasta, i.arquivo)), i.arquivo).toBe(true)
        expect(i.alt.trim(), i.arquivo).not.toBe('')
        expect(i.arquivo.startsWith(i.chave), i.arquivo).toBe(true)
        expect(i.chave).toMatch(/^wp-\d+-$/)
      }
    }
  })

  /* Um `upload` com `src` é o conversor cru; com `value` é id de outro banco.
     Os dois chegariam ao admin como imagem quebrada. */
  it('todo nó de imagem do corpo aponta para um arquivo exportado, e só isso', () => {
    for (const p of posts) {
      const arquivos = new Set(p.imagens.map((i) => i.arquivo))
      for (const no of uploads(p.corpo as No)) {
        expect(arquivos.has(no.pending?.arquivo ?? ''), p.slug).toBe(true)
        expect(no.pending?.src, p.slug).toBeUndefined()
        expect(no.value, p.slug).toBeUndefined()
      }
    }
  })

  /* Sem a linha, o endereço antigo do artigo vira 404 no dia da virada. */
  it('todo artigo tem o redirect do endereço do WordPress', () => {
    for (const p of posts) {
      const [ano, mes, dia] = p.publicadoEm.slice(0, 10).split('-')
      expect(redirects, p.slug).toContain(`/${ano}/${mes}/${dia}/${p.slug}/,/blog/${p.slug},301,post 1:1`)
    }
  })
})
