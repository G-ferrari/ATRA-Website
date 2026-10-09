import { describe, expect, it, vi } from 'vitest'

import { ancorasDe, comVitrineDeParceiros, toBlocos } from './blocks'
import type { Page } from '@/payload-types'

/* O layout vem do Payload com muito mais campo do que o mapper lê; o `as`
 * evita reconstruir o documento inteiro em cada caso de teste. */
const layout = (...blocos: unknown[]) => blocos as NonNullable<Page['layout']>

describe('toBlocos', () => {
  it('converte um pageHero e normaliza os campos vazios para null', () => {
    const [b] = toBlocos(
      layout({
        id: '1',
        blockType: 'pageHero',
        title: 'A ATRA transforma desafios',
        highlight: ['ATRA'],
        badge: '   ',
        chip: null,
        ctas: [{ label: 'Conhecer', href: '/sobre' }],
      }),
    )

    expect(b).toMatchObject({
      tipo: 'pageHero',
      title: 'A ATRA transforma desafios',
      highlight: ['ATRA'],
      // string só de espaço é ausência, não conteúdo
      badge: null,
      chip: null,
      theme: 'surface-1',
      ctas: [{ label: 'Conhecer', href: '/sobre' }],
    })
  })

  describe('vídeo na abertura de página', () => {
    const hero = (campos: Record<string, unknown>) =>
      toBlocos(layout({ id: '1', blockType: 'pageHero', title: 'Abertura', mediaMode: 'video', ...campos }))[0]
    const arquivo = { id: 7, url: '/api/media/file/demo.mp4', mimeType: 'video/mp4', alt: 'Demonstração do produto' }

    it('link do YouTube vira embed sem cookie, que só carrega no clique', () => {
      expect(hero({ videoUrl: 'https://youtu.be/abc123' })).toMatchObject({
        mediaMode: 'video',
        video: { tipo: 'embed', src: 'https://www.youtube-nocookie.com/embed/abc123', provedor: 'YouTube' },
      })
    })

    it('arquivo enviado toca no próprio site e vence o link', () => {
      expect(hero({ videoFile: arquivo, videoUrl: 'https://youtu.be/abc123' })).toMatchObject({
        video: { tipo: 'arquivo', url: '/api/media/file/demo.mp4', mimeType: 'video/mp4', titulo: 'Demonstração do produto' },
      })
    })

    it('a primeira imagem é a capa', () => {
      const capa = { id: 3, url: '/api/media/file/capa.webp', alt: 'Capa', width: 1600, height: 900, mimeType: 'image/webp' }
      expect(hero({ videoUrl: 'https://youtu.be/abc123', images: [capa] })).toMatchObject({
        images: [{ url: '/api/media/file/capa.webp' }],
      })
    })

    /* Coluna vazia espremeria o texto em 7/12 ao lado de um buraco. */
    it.each([
      ['nada preenchido', {}],
      ['link que não é YouTube nem Vimeo', { videoUrl: 'https://exemplo.com/video.mp4' }],
      ['arquivo que não é vídeo', { videoFile: { ...arquivo, mimeType: 'application/pdf' } }],
    ])('sem vídeo resolvido (%s) o herói sai sem mídia', (_, campos) => {
      expect(hero(campos)).toMatchObject({ mediaMode: 'none', video: null })
    })

    it('fora do modo de vídeo, link preenchido é ignorado', () => {
      expect(hero({ mediaMode: 'none', videoUrl: 'https://youtu.be/abc123' })).toMatchObject({ mediaMode: 'none', video: null })
    })
  })

  it('descarta o botão do ctaBanner quando falta rótulo ou destino', () => {
    const [so_label, completo] = toBlocos(
      layout(
        { id: '1', blockType: 'ctaBanner', title: 'A', cta: { label: 'Fale', href: null } },
        { id: '2', blockType: 'ctaBanner', title: 'B', cta: { label: 'Fale', href: '/contato' } },
      ),
    )

    expect(so_label).toMatchObject({ cta: null })
    expect(completo).toMatchObject({ cta: { label: 'Fale', href: '/contato' } })
  })

  it('lê columns como número', () => {
    const [b] = toBlocos(
      layout({ id: '1', blockType: 'iconCardGrid', columns: '3', items: [{ icon: 'target', title: 'X' }] }),
    )
    expect(b).toMatchObject({ columns: 3 })
  })

  /* Um bloco removido do código com conteúdo ainda no banco não pode derrubar
   * uma página institucional inteira — some e avisa no log. */
  it('ignora bloco desconhecido em vez de derrubar a página', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const blocos = toBlocos(
      layout(
        { id: '1', blockType: 'blocoQueNaoExisteMais', seja: 'o que for' },
        { id: '2', blockType: 'ctaBanner', title: 'Sobrevivi' },
      ),
    )

    expect(blocos).toHaveLength(1)
    expect(blocos[0]).toMatchObject({ title: 'Sobrevivi' })
    expect(aviso).toHaveBeenCalledOnce()
    aviso.mockRestore()
  })

  /* 05/10: o tamanho do parágrafo da seção "Texto com imagem". Seção gravada
     antes do campo (ou com valor inesperado) sai no tamanho normal. */
  it('richTextSection leva o tamanho do texto, com "normal" como padrão', () => {
    const [grande, semCampo, estranho] = toBlocos(
      layout(
        { id: '1', blockType: 'richTextSection', title: 'A', bodySize: 'large' },
        { id: '2', blockType: 'richTextSection', title: 'B' },
        { id: '3', blockType: 'richTextSection', title: 'C', bodySize: 'enorme' },
      ),
    )
    expect(grande).toMatchObject({ tipo: 'richTextSection', bodySize: 'large' })
    expect(semCampo).toMatchObject({ bodySize: 'normal' })
    expect(estranho).toMatchObject({ bodySize: 'normal' })
  })

  /* 07/10: cartões com imagem, nome e link, em mosaico. */
  it('partnerMosaic separa a descrição em parágrafos e deixa link vazio como null', () => {
    const imagem = { id: 1, url: '/api/media/file/gcp.webp', alt: 'Google Cloud', width: 1254, height: 1254 }
    const [b] = toBlocos(
      layout({
        id: '1',
        blockType: 'partnerMosaic',
        eyebrow: 'Nossos Parceiros',
        title: 'Soluções das principais empresas de tecnologia',
        description: 'Primeiro parágrafo.\n\nSegundo parágrafo.',
        items: [
          { id: 'a', image: imagem, name: 'Google Cloud', linkLabel: 'Ferramentas', href: '/parceiros/google-cloud' },
          { id: 'b', image: imagem, name: 'Denodo', linkLabel: '  ', href: '' },
        ],
      }),
    )

    expect(b).toMatchObject({
      tipo: 'partnerMosaic',
      eyebrow: 'Nossos Parceiros',
      paragrafos: ['Primeiro parágrafo.', 'Segundo parágrafo.'],
      items: [
        { name: 'Google Cloud', linkLabel: 'Ferramentas', href: '/parceiros/google-cloud', image: { url: '/api/media/file/gcp.webp' } },
        { name: 'Denodo', linkLabel: null, href: null },
      ],
    })
  })

  it('aceita layout vazio ou ausente', () => {
    expect(toBlocos(null)).toEqual([])
    expect(toBlocos([])).toEqual([])
  })
})

describe('ancorasDe', () => {
  it('leva só os blocos com âncora, usando o título como rótulo', () => {
    const blocos = toBlocos(
      layout(
        { id: '1', blockType: 'pageHero', title: 'Abertura' },
        { id: '2', blockType: 'iconCardGrid', title: 'Nossos valores', anchor: 'valores', items: [] },
        { id: '3', blockType: 'processSteps', title: 'Como fazemos', anchor: 'como', steps: [] },
      ),
    )

    expect(ancorasDe(blocos)).toEqual([
      { anchor: 'valores', label: 'Nossos valores' },
      { anchor: 'como', label: 'Como fazemos' },
    ])
  })

  /* A faixa de chamada é destino de rolagem, não seção do sumário — MIG-056.
   * Sem esta exclusão o menu da página de solução ganhava um quinto item com o
   * título inteiro da chamada, e crescia de 64px para 144px no mobile. */
  it('deixa o ctaBanner de fora, mesmo com âncora', () => {
    const blocos = toBlocos(
      layout(
        { id: '1', blockType: 'iconCardGrid', title: 'Valores', anchor: 'valores', items: [] },
        { id: '2', blockType: 'ctaBanner', title: 'Comece agora', anchor: 'contato' },
      ),
    )

    expect(ancorasDe(blocos)).toEqual([{ anchor: 'valores', label: 'Valores' }])
    // A âncora continua no bloco: é ela que dá o `id` para os botões `#contato`.
    expect(blocos[1]).toMatchObject({ tipo: 'ctaBanner', anchor: 'contato' })
  })

  it('cai na âncora quando o bloco não tem título', () => {
    const blocos = toBlocos(layout({ id: '1', blockType: 'iconCardGrid', anchor: 'sem-titulo', items: [] }))
    expect(ancorasDe(blocos)).toEqual([{ anchor: 'sem-titulo', label: 'sem-titulo' }])
  })
})

describe('blocos de MIG-048', () => {
  it('statsGrid usa os números institucionais por padrão e os próprios quando pedido', () => {
    const institucional = {
      metricas: [{ value: 140, suffix: '+', label: 'Profissionais', icon: null }],
    }

    const [doGlobal, proprios] = toBlocos(
      layout(
        { id: '1', blockType: 'statsGrid', source: 'siteSettings' },
        {
          id: '2',
          blockType: 'statsGrid',
          source: 'custom',
          customItems: [{ value: 51, suffix: 'x', label: 'Mais rápido' }],
        },
      ),
      institucional,
    )

    expect(doGlobal).toMatchObject({ items: institucional.metricas })
    expect(proprios).toMatchObject({ items: [{ value: 51, suffix: 'x', label: 'Mais rápido' }] })
  })

  /* O menu lista âncoras de blocos que vêm **depois** dele na página, então só
   * pode ser montado quando a lista inteira já foi percorrida. */
  it('stickyPageNav recebe âncoras de blocos posteriores a ele', () => {
    const blocos = toBlocos(
      layout(
        { id: '1', blockType: 'pageHero', title: 'Abertura' },
        { id: '2', blockType: 'stickyPageNav' },
        { id: '3', blockType: 'iconCardGrid', title: 'Valores', anchor: 'valores', items: [] },
        { id: '4', blockType: 'processSteps', title: 'Etapas', anchor: 'etapas', steps: [] },
      ),
    )

    const menu = blocos.find((b) => b.tipo === 'stickyPageNav')
    expect(menu).toMatchObject({
      items: [
        { anchor: 'valores', label: 'Valores' },
        { anchor: 'etapas', label: 'Etapas' },
      ],
    })
  })

  it('partnerShowcase descarta parceiro não populado em vez de derrubar a vitrine', () => {
    const [b] = toBlocos(
      layout({
        id: '1',
        blockType: 'partnerShowcase',
        title: 'Parceiros',
        source: 'selected',
        // O primeiro veio como id (depth insuficiente); o segundo, populado.
        partners: [7, { name: 'Google Cloud', slug: 'google-cloud', logo: null }],
      }),
    )
    expect(b).toMatchObject({ tipo: 'partnerShowcase', grayscale: true, source: 'selected' })
    expect((b as { partners: unknown[] }).partners).toHaveLength(1)
  })

  /* 29/09: a vitrine em "Todos" ignora a lista gravada no bloco (a "foto" do dia
     da migração) e recebe o cadastro da página — inclusive sem valor gravado,
     que é o padrão do campo. */
  it('partnerShowcase em "Todos" ignora a lista do bloco e recebe o cadastro', () => {
    const gravado = { name: 'Antigo', slug: 'antigo', logo: null }
    const blocos = toBlocos(
      layout(
        { id: '1', blockType: 'partnerShowcase', source: 'all', partners: [gravado] },
        { id: '2', blockType: 'partnerShowcase', partners: [gravado] },
        { id: '3', blockType: 'partnerShowcase', source: 'selected', partners: [gravado] },
      ),
    )
    expect(blocos.map((b) => (b as { partners: unknown[] }).partners.length)).toEqual([0, 0, 1])

    comVitrineDeParceiros(blocos, [
      { name: 'Google Cloud', slug: 'google-cloud', logo: null },
      { name: 'Databricks', slug: 'databricks', logo: null },
    ])
    expect(blocos.map((b) => (b as { partners: { slug: string }[] }).partners.map((p) => p.slug))).toEqual([
      ['google-cloud', 'databricks'],
      ['google-cloud', 'databricks'],
      ['antigo'],
    ])
  })
})
