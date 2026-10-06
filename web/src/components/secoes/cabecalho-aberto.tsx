import { Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

import { MetricChip, StatusBadge } from '@/components/ui'
import type { CabecalhoDaSecao } from '@/types/content'

import { TituloComDestaque } from './titulo'

/**
 * Cabeçalho das listas abertas (Webinars, Mídia, E-books, Cases, Blog): selo e
 * etiqueta, título com destaque e texto de abertura — cada parte só aparece se a
 * editora a escreveu. Vazio, não desenha nada (os E-books nascem assim).
 *
 * ⚠️ Função, e não componente, de propósito: Cases e Blog passam o resultado
 * como prop para a ilha cliente, e o `key` constante precisa estar **no
 * elemento** que atravessa o RSC — ver "Overlay acusa `key` faltando" no
 * CLAUDE.md. Num componente, o `key` ficaria no invólucro.
 *
 * As classes de caixa e de título vêm de quem chama: cada seção tem as suas
 * (Webinars sem `leading-tight`, Mídia com `max-w-3xl`), e trocá-las mudaria a
 * altura da página.
 */
export function cabecalhoAberto({
  cabecalho,
  abertura,
  chave,
  classeDaCaixa,
  classeDoTitulo,
  depoisDoTitulo,
}: {
  cabecalho: CabecalhoDaSecao
  /** A lista abre a página: o título é o `h1` dela. */
  abertura: boolean
  chave: string
  classeDaCaixa?: string
  classeDoTitulo: string
  depoisDoTitulo?: ReactNode
}): ReactNode {
  const { eyebrow, chip, title, highlight, paragrafos } = cabecalho
  const temTitulo = Boolean(title || highlight)
  if (!temTitulo && !eyebrow && !chip && paragrafos.length === 0) return null

  const Titulo = abertura ? 'h1' : 'h2'
  return (
    <div key={chave} className={classeDaCaixa}>
      {(eyebrow || chip) && (
        <div className="flex items-center gap-2 mb-3">
          {eyebrow && <StatusBadge label={eyebrow} variant="primary" size="sm" pulse icon={<Sparkles size={12} />} />}
          {chip && <MetricChip label={chip} variant="neutral" size="sm" />}
        </div>
      )}
      {temTitulo && (
        <Titulo className={classeDoTitulo}>
          <TituloComDestaque cabecalho={cabecalho} />
        </Titulo>
      )}
      {depoisDoTitulo}
      {paragrafos.length > 0 && (
        <div className="mt-5 space-y-3 text-sm md:text-base text-text-muted dark:text-gray-300 font-light leading-relaxed">
          {paragrafos.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )}
    </div>
  )
}

/** O respiro de cima de uma lista aberta: o do carrossel do topo quando ela
 *  abre a página (sob o cabeçalho fixo), o dela quando vem depois dele. */
export const RESPIRO_DE_ABERTURA = 'pt-28 sm:pt-36 md:pt-44'
