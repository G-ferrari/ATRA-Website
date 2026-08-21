/* Teste das decisões do importador de mídia (MIG-082). A parte que baixa e
   grava é exercida pela importação real; o que tem lógica é o nome do arquivo e
   a escolha do texto alternativo. */
import { describe, expect, it } from 'vitest'

import { nomeDeArquivo, pareceNomeDeArquivo, resolverAlt } from './media'
import type { WpMedia } from './types'

const midia = (p: Partial<WpMedia>): WpMedia =>
  ({ id: 1, slug: 's', date: '', title: { rendered: '' }, source_url: 'https://x/a.png', ...p }) as WpMedia

describe('nomeDeArquivo', () => {
  /* A razão de a chave ser o id: 4 arquivos distintos se chamam
     `banner-site-blog-1` entre as 287 imagens dos posts. */
  it('distingue arquivos de mesmo nome pelo id do WP', () => {
    const a = midia({ id: 8441, source_url: 'https://www.atra.com.br/wp-content/uploads/2024/01/banner-site-blog-1.png' })
    const b = midia({ id: 6766, source_url: 'https://www.atra.com.br/wp-content/uploads/2023/02/banner-site-blog-1.png' })
    expect(nomeDeArquivo(a)).toBe('wp-8441-banner-site-blog-1.png')
    expect(nomeDeArquivo(b)).toBe('wp-6766-banner-site-blog-1.png')
    expect(nomeDeArquivo(a)).not.toBe(nomeDeArquivo(b))
  })

  it('decodifica nome com acento vindo da URL', () => {
    expect(nomeDeArquivo(midia({ id: 7, source_url: 'https://x/uploads/2024/gest%C3%A3o.jpg' }))).toBe('wp-7-gestão.jpg')
  })

  it('trunca nome longo mas preserva a extensão', () => {
    const nome = nomeDeArquivo(midia({ id: 9, source_url: `https://x/${'a'.repeat(200)}.jpeg` }))
    expect(nome.startsWith('wp-9-')).toBe(true)
    expect(nome.endsWith('.jpeg')).toBe(true)
    expect(nome.length).toBeLessThan(100)
  })
})

describe('pareceNomeDeArquivo', () => {
  it.each(['4', 'tendencia', 'marketPlace', '1-innovation-from-informatica-world-3', 'IMG_2024', ''])(
    'recusa %j como texto alternativo',
    (t) => expect(pareceNomeDeArquivo(t)).toBe(true),
  )

  it.each(['ATRA no Rio Preto Tech Summit 2026 Dados, Cloud e IA', 'Arquitetura multicloud exige uma nova governança'])(
    'aceita %j',
    (t) => expect(pareceNomeDeArquivo(t)).toBe(false),
  )
})

describe('resolverAlt', () => {
  it('prefere o alt_text da biblioteca', () => {
    expect(resolverAlt(midia({ alt_text: 'Gráfico de adoção', title: { rendered: 'Título' } }), 'reserva')).toEqual({
      alt: 'Gráfico de adoção',
      fonte: 'biblioteca',
    })
  })

  it('cai para o título da mídia quando ele é uma frase', () => {
    expect(resolverAlt(midia({ title: { rendered: 'Por que projetos de IA não saem do piloto' } }), 'reserva')).toEqual({
      alt: 'Por que projetos de IA não saem do piloto',
      fonte: 'tituloDaMidia',
    })
  })

  it('cai para o título do artigo quando o do arquivo não descreve nada', () => {
    expect(resolverAlt(midia({ title: { rendered: 'tendencia' } }), 'Dados ruins geram decisões ruins')).toEqual({
      alt: 'Dados ruins geram decisões ruins',
      fonte: 'tituloDoPost',
    })
  })
})
