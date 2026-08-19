import type { Page } from '@/payload-types'
import type { Bloco, TemaDoBloco } from '@/types/content'

import { toImageOpcional, toTextos } from './shared'

/* Documento do Payload → blocos de apresentação.
 *
 * ⚠️ Bloco desconhecido é **descartado, não derruba a página**. É diferente do
 * relacionamento não populado, que derruba: ali o dado existe e a consulta está
 * errada; aqui o bloco pode ter sido removido do código com conteúdo antigo
 * ainda no banco, e uma página institucional inteira fora do ar por causa de
 * uma seção obsoleta é pior que a seção sumir. O aviso vai para o log do
 * servidor, onde quem opera enxerga. */

type BlocoDoPayload = NonNullable<Page['layout']>[number]

const vazio = (v: string | null | undefined): string | null => {
  const t = v?.trim()
  return t ? t : null
}

function base(b: BlocoDoPayload) {
  return {
    id: b.id ?? `${b.blockType}-sem-id`,
    anchor: vazio(b.anchor),
    theme: (b.theme ?? 'surface-1') as TemaDoBloco,
  }
}

export function toBlocos(layout: Page['layout'] | null | undefined): Bloco[] {
  const blocos: Bloco[] = []

  for (const b of layout ?? []) {
    switch (b.blockType) {
      case 'pageHero':
        blocos.push({
          ...base(b),
          tipo: 'pageHero',
          badge: vazio(b.badge),
          chip: vazio(b.chip),
          title: b.title,
          highlight: vazio(b.highlight),
          description: vazio(b.description),
          ctas: (b.ctas ?? []).map((c) => ({ label: c.label, href: c.href })),
        })
        break

      case 'richTextSection':
        blocos.push({
          ...base(b),
          tipo: 'richTextSection',
          eyebrow: vazio(b.eyebrow),
          title: vazio(b.title),
          body: b.body ?? null,
          image: toImageOpcional(b.image, 'richTextSection.image'),
          imagePosition: b.imagePosition ?? 'right',
        })
        break

      case 'iconCardGrid':
        blocos.push({
          ...base(b),
          tipo: 'iconCardGrid',
          eyebrow: vazio(b.eyebrow),
          title: vazio(b.title),
          columns: Number(b.columns ?? 4) as 2 | 3 | 4,
          items: (b.items ?? []).map((i) => ({
            icon: i.icon,
            title: i.title,
            description: vazio(i.description),
          })),
        })
        break

      case 'ctaBanner':
        blocos.push({
          ...base(b),
          tipo: 'ctaBanner',
          title: b.title,
          highlight: vazio(b.highlight),
          description: vazio(b.description),
          cta:
            b.cta?.label && b.cta?.href ? { label: b.cta.label, href: b.cta.href } : null,
          variant: b.variant ?? 'primary',
        })
        break

      default:
        console.warn(
          `[mapper] bloco desconhecido "${(b as { blockType: string }).blockType}" ignorado. ` +
            `Removido do código com conteúdo ainda no banco?`,
        )
    }
  }

  return blocos
}

/** Itens do menu lateral: os blocos que preencheram `anchor` (blocos.md, regra 2). */
export function ancorasDe(blocos: Bloco[]): { anchor: string; label: string }[] {
  return blocos
    .filter((b) => b.anchor)
    .map((b) => ({
      anchor: b.anchor as string,
      label: 'title' in b && b.title ? b.title : (b.anchor as string),
    }))
}

export { toTextos }
