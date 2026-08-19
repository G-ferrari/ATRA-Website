import type { Bloco } from '@/types/content'

import { BlocoCta } from './bloco-cta'
import { BlocoGradeDeCards } from './bloco-grade-de-cards'
import { BlocoHero } from './bloco-hero'
import { BlocoTexto } from './bloco-texto'

/* Despacha os blocos de uma página (blocos.md, regra 1: bloco não busca dado —
 * recebe tudo por props, resolvidas na page).
 *
 * O `switch` é exaustivo: `Bloco` é união discriminada, então bloco novo sem
 * caso aqui não compila. É de propósito — é o que impede uma seção existir no
 * CMS e não aparecer no site. */
export function RenderBlocks({ blocos }: { blocos: Bloco[] }) {
  return (
    <>
      {blocos.map((b) => {
        switch (b.tipo) {
          case 'pageHero':
            return <BlocoHero key={b.id} bloco={b} />
          case 'richTextSection':
            return <BlocoTexto key={b.id} bloco={b} />
          case 'iconCardGrid':
            return <BlocoGradeDeCards key={b.id} bloco={b} />
          case 'ctaBanner':
            return <BlocoCta key={b.id} bloco={b} />
        }
      })}
    </>
  )
}
