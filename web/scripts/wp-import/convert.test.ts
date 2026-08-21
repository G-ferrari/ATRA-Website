/* Teste do conversor de MIG-081.
 *
 * As fixtures são HTML escrito à mão que reproduz as formas achadas na varredura
 * dos 207 posts: invólucro do Elementor, tabela, imagem, link, lista aninhada e
 * título. **Não** lê `.sample/posts.json` — aquilo é cache local, fora do git, e
 * teste que depende de rede falha por motivo errado. */
import { describe, expect, it } from 'vitest'

import {
  caminhoDePost,
  criarConversor,
  desfazerLinksSemUrl,
  imagensPendentes,
  reescreverLinks,
  CorpoVazio,
} from './convert'
import { tiposDe, type LexicalNode } from './types'

/* Uma imagem, um link externo e um link para outro post — como o corpus. */
const HTML_TIPICO = `
<div class="elementor-widget-container">
  <h2><b>O que muda com a governança</b></h2>
  <p><span style="font-weight: 400;">Texto com <strong>ênfase</strong> e um
  <a href="https://www.informatica.com/br/">link externo</a>.</span></p>
  <p><a href="https://www.atra.com.br/2024/03/11/governanca-de-dados-na-pratica/">o post anterior</a></p>
  <figure><img src="https://www.atra.com.br/wp-content/uploads/2021/10/4.png" alt="" /></figure>
  <ul><li>um<ul><li>aninhado</li></ul></li><li>dois</li></ul>
</div>`

/* Os 2 posts com tabela do corpus. É a conversão que a métrica de retenção de
   texto não pega: sem a feature, as linhas viram parágrafos soltos. */
const HTML_TABELA = `
<table>
  <tr><th>Camada</th><th>Ferramenta</th></tr>
  <tr><td>Ingestão</td><td>Dataflow</td></tr>
  <tr><td>Modelagem</td><td>dbt</td></tr>
</table>`

describe('caminhoDePost', () => {
  const slugs = new Set(['governanca-de-dados-na-pratica'])

  it('reescreve o permalink do WP, que carrega a data', () => {
    expect(caminhoDePost('https://www.atra.com.br/2024/03/11/governanca-de-dados-na-pratica/', slugs)).toBe(
      '/blog/governanca-de-dados-na-pratica',
    )
  })

  it('preserva a âncora', () => {
    expect(caminhoDePost('https://www.atra.com.br/2024/03/11/governanca-de-dados-na-pratica/#conclusao', slugs)).toBe(
      '/blog/governanca-de-dados-na-pratica#conclusao',
    )
  })

  it('não toca em link externo', () => {
    expect(caminhoDePost('https://www.gartner.com/doc/1', slugs)).toBeNull()
  })

  it('não toca em página institucional do WP: não é permalink de post', () => {
    expect(caminhoDePost('https://www.atra.com.br/carreiras/', slugs)).toBeNull()
  })

  /* Sem esta guarda, um permalink de post apagado viraria /blog/<slug> e o
     leitor sairia de um link que funcionava para um 404 nosso. */
  it('não reescreve slug que não está sendo importado', () => {
    expect(caminhoDePost('https://www.atra.com.br/2024/03/11/post-que-nao-existe/', slugs)).toBeNull()
  })

  it('ignora URL quebrada em vez de estourar', () => {
    expect(caminhoDePost('não é uma url', slugs)).toBeNull()
  })
})

describe('reescreverLinks', () => {
  it('troca a URL e conta quantas mudaram', () => {
    const raiz: LexicalNode = {
      type: 'root',
      children: [
        { type: 'link', fields: { url: 'https://a.com', newTab: true }, children: [] },
        { type: 'link', fields: { url: 'https://b.com' }, children: [] },
      ],
    }
    expect(reescreverLinks(raiz, (u) => (u === 'https://a.com' ? '/blog/x' : null))).toBe(1)
    expect(raiz.children![0].fields).toEqual({ url: '/blog/x', newTab: true })
    expect(raiz.children![1].fields).toEqual({ url: 'https://b.com' })
  })
})

describe('desfazerLinksSemUrl', () => {
  it('troca o link sem destino pelo seu próprio texto, preservando os vizinhos', () => {
    const raiz: LexicalNode = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { type: 'text', text: 'antes ' },
            { type: 'link', fields: {}, children: [{ type: 'text', text: 'https://statista.com/x' }] },
            { type: 'text', text: ' depois' },
          ],
        },
      ],
    }
    expect(desfazerLinksSemUrl(raiz)).toBe(1)
    expect(raiz.children![0].children!.map((c) => c.text)).toEqual(['antes ', 'https://statista.com/x', ' depois'])
  })

  it('não mexe em link com destino', () => {
    const raiz: LexicalNode = {
      type: 'root',
      children: [{ type: 'link', fields: { url: '/blog/x' }, children: [{ type: 'text', text: 'x' }] }],
    }
    expect(desfazerLinksSemUrl(raiz)).toBe(0)
    expect(raiz.children![0].type).toBe('link')
  })
})

describe('imagensPendentes', () => {
  it('lê o `src` que o conversor deixa em `pending`, em ordem', () => {
    const raiz: LexicalNode = {
      type: 'root',
      children: [
        { type: 'upload', pending: { src: 'a.png' } } as LexicalNode,
        { type: 'paragraph', children: [{ type: 'upload', pending: { src: 'b.png' } } as LexicalNode] },
        { type: 'upload' } as LexicalNode,
      ],
    }
    expect(imagensPendentes(raiz)).toEqual(['a.png', 'b.png'])
  })
})

describe('criarConversor', () => {
  it('converte o HTML típico do corpus', async () => {
    const converter = await criarConversor({ slugsDePost: new Set(['governanca-de-dados-na-pratica']) })
    const { raiz, imagens, linksReescritos } = converter(HTML_TIPICO)
    const tipos = tiposDe(raiz)

    expect(tipos.heading).toBe(1)
    expect(tipos.list).toBeGreaterThanOrEqual(1)
    expect(tipos.link).toBe(2)
    // O invólucro do Elementor não vira nó: o conversor descarta `div` sozinho.
    expect(tipos.div).toBeUndefined()

    expect(imagens).toEqual(['https://www.atra.com.br/wp-content/uploads/2021/10/4.png'])
    expect(linksReescritos).toBe(1)
  })

  /* A regressão que o piloto encontrou: sem `EXPERIMENTAL_TableFeature` isto
     passa com 100% de retenção de texto e nenhum nó de tabela. */
  it('converte tabela como tabela, não como parágrafos soltos', async () => {
    const converter = await criarConversor()
    const tipos = tiposDe(converter(HTML_TABELA).raiz)

    expect(tipos.table).toBe(1)
    expect(tipos.tablerow).toBe(3)
    expect(tipos.tablecell).toBe(6)
  })

  it('recusa corpo que converteu para nada', async () => {
    const converter = await criarConversor()
    expect(() => converter('<div class="elementor-spacer"></div>')).toThrow(CorpoVazio)
  })
})
