import { ArrowRight, Briefcase } from 'lucide-react'
import Link from 'next/link'

import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { BancoDeTalentos } from './banco-de-talentos'
import { cn } from '@/lib/utils'
import { hrefDe } from '@/lib/routes'
import type { VagaAberta } from '@/lib/atrair'
import type { BlocoJobsList } from '@/types/content'
import type { Locale } from '@/lib/locales'

/* Lista de vagas — porte de `legacy/src/pages/Careers.tsx:410`.
 *
 * A seção tem **duas partes**: a grade de vagas e, sob ela, o cartão do banco de
 * talentos. No legado os cards apontam para a âncora desse cartão; aqui levam
 * para `/carreiras/[slug]` (MIG-051), que é o único desvio deliberado.
 *
 * ⚠️ O card mostra **só o título**. Área e local existem na collection e não
 * entram: a linha extra sobe cada card em 16px, e com seis cards em duas
 * colunas eram 48px de diferença contra o gabarito. Informação a mais é
 * melhoria, e melhoria não entra junto com migração (D-15).
 *
 * A grade tem **duas fontes**, e quem escolhe é a chave `jobsFeed` do global
 * `integrations` (D-41):
 *
 * - **Ligada** — as vagas vêm do ATRAIR: quem cuida do recrutamento abre a vaga
 *   lá, marca "publicar", e ela aparece aqui; o card leva para a página da vaga
 *   no ATRAIR, onde a pessoa lê a descrição e se candidata.
 * - **Desligada** (ou ATRAIR fora do ar) — as vagas vêm da collection `jobs`, e
 *   o card leva para `/carreiras/[slug]`, a página da vaga **no site**.
 *
 * ⚠️ A distinção que custou a D-41: `vagasDoAtrair` **`null`** é "não foi
 * possível perguntar ao ATRAIR" e cai para o CMS; **`[]`** é o ATRAIR
 * respondendo que não há vaga aberta, e aí a grade mostra o `emptyText`. Antes
 * os dois eram lista vazia, e uma vaga fechada no ATRAIR voltava ao ar pela
 * lista antiga do CMS. Não trocar por `?.length` — apaga exatamente isso. */
export function BlocoVagas({
  bloco,
  locale,
  vagasDoAtrair = null,
}: {
  bloco: BlocoJobsList
  locale: Locale
  /* As vagas publicadas no ATRAIR, ou `null` quando a integração está
   * desligada no CMS ou o ATRAIR não respondeu — ver ⚠️ acima. */
  vagasDoAtrair?: VagaAberta[] | null
}) {
  const doAtrair = vagasDoAtrair !== null
  const vazia = doAtrair ? vagasDoAtrair.length === 0 : bloco.vagas.length === 0
  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        ESPACOS[bloco.espaco],
        'relative overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {(bloco.eyebrow || bloco.title || bloco.description) && (
          <div className="text-center mb-16">
            {bloco.eyebrow && (
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                {bloco.eyebrow}
              </span>
            )}
            {bloco.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4">
                {bloco.title}
              </h2>
            )}
            {bloco.description && (
              <p className="text-text-muted text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light">
                {bloco.description}
              </p>
            )}
          </div>
        )}

        {vazia ? (
          <p className="text-center text-text-muted text-sm font-light max-w-2xl mx-auto">
            {bloco.emptyText ?? 'Nenhuma vaga aberta no momento. Volte em breve.'}
          </p>
        ) : (
          <div className={cn('grid md:grid-cols-2 gap-4 max-w-5xl mx-auto', bloco.talentBank && 'mb-20')}>
            {doAtrair
              ? vagasDoAtrair.map((v) => (
                  /* Link para FORA do site: é uma página do ATRAIR, e o
                   * `next/link` não tem o que otimizar num destino que não é
                   * nosso. O endereço vem pronto da API (campo `url`) — o site
                   * não monta URL do ATRAIR. */
                  <a
                    key={v.id}
                    href={v.url}
                    className="group flex items-center justify-between p-5 bg-surface-1  rounded-[6px] hover:border-primary/40 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Briefcase size={18} aria-hidden />
                      </div>
                      <span className="min-w-0">
                        <span className="block font-semibold text-text-main text-xs sm:text-sm group-hover:text-primary transition-colors">
                          {v.cargo}
                        </span>
                        {/* Uma linha só, igual em todos os cards, para as
                            alturas continuarem casando (ver ⚠️ acima). */}
                        <span className="block text-[11px] text-text-muted font-light mt-0.5">
                          {[v.senioridade, v.modeloDeTrabalho, v.tipoDeContrato].filter(Boolean).join(' · ') ||
                            (locale === 'pt' ? 'Candidatar-se' : 'Apply')}
                        </span>
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0"
                      aria-hidden
                    />
                  </a>
                ))
              : bloco.vagas.map((v) => (
                  <Link
                    key={v.slug}
                    href={hrefDe('carreiras', locale, v.slug)}
                    className="group flex items-center justify-between p-5 bg-surface-1  rounded-[6px] hover:border-primary/40 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Briefcase size={18} aria-hidden />
                      </div>
                      <span className="font-semibold text-text-main text-xs sm:text-sm group-hover:text-primary transition-colors">
                        {v.title}
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0"
                      aria-hidden
                    />
                  </Link>
                ))}
          </div>
        )}

        {bloco.talentBank && <BancoDeTalentos banco={bloco.talentBank} locale={locale} />}
      </div>
    </section>
  )
}
