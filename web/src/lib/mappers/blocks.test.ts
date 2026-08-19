import { describe, expect, it, vi } from 'vitest'

import { ancorasDe, toBlocos } from './blocks'
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
        // O primeiro veio como id (depth insuficiente); o segundo, populado.
        partners: [7, { name: 'Google Cloud', slug: 'google-cloud', logo: null }],
      }),
    )
    expect(b).toMatchObject({ tipo: 'partnerShowcase', grayscale: true })
    expect((b as { partners: unknown[] }).partners).toHaveLength(1)
  })
})
