import { ArrowRight, Handshake } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { formasDoMosaico, MAXIMO_DO_MOSAICO, type FormaDoMosaico } from '@/lib/mosaico'
import { cn } from '@/lib/utils'
import type { BlocoPartnerMosaic } from '@/types/content'

/* Mosaico de parceiros (07/10) — o cabeçalho à esquerda e, abaixo, os cartões
 * com imagem em tamanhos mistos. O arranjo por quantidade está em
 * `lib/mosaico.ts`; aqui fica só como cada forma ocupa a grade.
 *
 * ⚠️ A altura das linhas não é escrita em lugar nenhum: sai do cartão
 * **quadrado**. O pequeno é `aspect-square` numa coluna, o grande é
 * `aspect-square` em duas colunas e duas linhas, e `auto-rows-fr` iguala as
 * linhas — então o largo, que não tem proporção própria no desktop, herda a
 * altura da linha. Dar `aspect-[2/1]` a ele ali quebraria a conta por meio
 * `gap`, e a borda de baixo desalinharia dos vizinhos.
 *
 * No celular a grade tem 2 colunas: grande e largo ocupam a linha (aí sim com
 * proporção própria), e os pequenos andam aos pares. */
const FORMA: Record<FormaDoMosaico, string> = {
  grande: 'col-span-2 aspect-[4/3] md:row-span-2 md:aspect-square',
  largo: 'col-span-2 aspect-[2/1] md:aspect-auto md:h-full',
  pequeno: 'aspect-square',
  faixa: 'col-span-2 aspect-[4/3] md:col-span-4 md:aspect-[3/1]',
}

/* O cartão grande e o largo ocupam metade da tela; o pequeno, um quarto. */
const TAMANHOS: Record<FormaDoMosaico, string> = {
  grande: '(min-width: 1280px) 624px, (min-width: 768px) 50vw, 100vw',
  largo: '(min-width: 1280px) 624px, (min-width: 768px) 50vw, 100vw',
  pequeno: '(min-width: 1280px) 300px, (min-width: 768px) 25vw, 50vw',
  faixa: '(min-width: 1280px) 1248px, 100vw',
}

/* Destino com `http(s)://` é o site do parceiro: abre em outra aba. */
const ehExterno = (href: string) => /^https?:\/\//i.test(href)

/* Um link só por cartão, com `after:inset-0` cobrindo o cartão inteiro — o
 * mesmo desenho dos cartões de webinar. */
const LINK =
  "after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:after:rounded-[6px] focus-visible:after:ring-2 focus-visible:after:ring-[#3C98FA]"

export function BlocoMosaicoDeParceiros({ bloco }: { bloco: BlocoPartnerMosaic }) {
  const items = bloco.items.slice(0, MAXIMO_DO_MOSAICO)
  if (items.length === 0) return null
  const formas = formasDoMosaico(items.length)
  const temCabecalho = Boolean(bloco.eyebrow || bloco.title || bloco.paragrafos.length > 0)

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        ESPACOS[bloco.espaco],
        'scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {temCabecalho && (
          <div className="max-w-2xl mb-10 md:mb-12">
            {bloco.eyebrow && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest mb-4">
                <Handshake size={13} aria-hidden />
                <span>{bloco.eyebrow}</span>
              </div>
            )}
            {bloco.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main leading-tight">
                {bloco.title}
              </h2>
            )}
            {bloco.paragrafos.length > 0 && (
              <div className="mt-4 space-y-3 text-sm md:text-base text-text-muted font-light leading-relaxed">
                {bloco.paragrafos.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <ul className="grid grid-cols-2 md:grid-cols-4 md:auto-rows-fr gap-3 sm:gap-4 lg:gap-6">
          {items.map((item, i) => {
            const forma = formas[i]
            /* O texto do cartão: o nome em destaque e, embaixo, o do link. Vai
               inteiro dentro do link, que é o nome acessível do cartão. */
            const texto = (
              <>
                <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-secondary">
                  {item.name}
                </span>
                {item.linkLabel && (
                  <span
                    className={cn(
                      'mt-1 inline-flex items-center gap-2 font-light text-white',
                      forma === 'pequeno' ? 'text-sm' : 'text-base md:text-lg',
                    )}
                  >
                    {item.linkLabel}
                    <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </>
            )

            return (
              <li
                key={`${item.name}-${i}`}
                data-forma={forma}
                className={cn('group relative overflow-hidden rounded-[6px] bg-[#0b0d12] shadow-lg', FORMA[forma])}
              >
                <Image
                  src={item.image.url}
                  alt={item.image.alt}
                  fill
                  sizes={TAMANHOS[forma]}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* O véu de baixo é o que deixa o nome legível sobre qualquer
                    arte — e por isso o texto é branco nos dois temas. */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 via-30% to-transparent to-65%" aria-hidden />
                <div className={cn('absolute inset-x-0 bottom-0', forma === 'pequeno' ? 'p-3 sm:p-4' : 'p-4 sm:p-6')}>
                  {item.href ? (
                    ehExterno(item.href) ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                        {texto}
                      </a>
                    ) : (
                      <Link href={item.href} className={LINK}>
                        {texto}
                      </Link>
                    )
                  ) : (
                    texto
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
