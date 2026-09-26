import type { VagaAberta } from '@/lib/atrair'
import type { Locale } from '@/lib/locales'
import type { Bloco } from '@/types/content'

import { BlocoAcordeao } from './bloco-acordeao'
import { BlocoBento } from './bloco-bento'
import { BlocoCardsDeMetodo } from './bloco-cards-de-metodo'
import { BlocoCta } from './bloco-cta'
import { BlocoGradeDeCards } from './bloco-grade-de-cards'
import { BlocoHero } from './bloco-hero'
import { BlocoMenuDaPagina } from './bloco-menu-da-pagina'
import { BlocoNumeros } from './bloco-numeros'
import { BlocoEtapas } from './bloco-etapas'
import { BlocoContato } from './bloco-contato'
import { BlocoParaQuem } from './bloco-para-quem'
import { BlocoAbasDeDestaque } from './bloco-abas-de-destaque'
import { BlocoBentoDaHome } from './bloco-bento-da-home'
import { BlocoCarrosselDeCases } from './bloco-carrossel-de-cases'
import { BlocoCarrosselDeDestaques } from './bloco-carrossel-de-destaques'
import { BlocoDepoimentos } from './bloco-depoimentos'
import { BlocoFaixaDeLogos } from './bloco-faixa-de-logos'
import { BlocoHomeHero } from './bloco-home-hero'
import { BlocoHubDeInsights } from './bloco-hub-de-insights'
import { BlocoParceiroHero } from './bloco-parceiro-hero'
import { BlocoParceiroSecao } from './bloco-parceiro-secao'
import { BlocoParceiros } from './bloco-parceiros'
import { BlocoVagas } from './bloco-vagas'
import { BlocoVitrineDeConteudo } from './bloco-vitrine-de-conteudo'
import { BlocoSelos } from './bloco-selos'
import { BlocoTexto } from './bloco-texto'
import { BlocoValores } from './bloco-valores'

/* Despacha os blocos de uma página (blocos.md, regra 1: bloco não busca dado —
 * recebe tudo por props, resolvidas na page).
 *
 * O `switch` é exaustivo: `Bloco` é união discriminada, então bloco novo sem
 * caso aqui não compila. É de propósito — é o que impede uma seção existir no
 * CMS e não aparecer no site. */
export function RenderBlocks({
  blocos,
  locale,
  vagasAbertas,
}: {
  blocos: Bloco[]
  locale: Locale
  /* Só a página de carreiras passa: são as vagas publicadas no ATRAIR, que
   * viram a grade e levam o candidato para a página da vaga lá (D-33). Quem
   * monta o bloco não busca — recebe (regra 4). */
  vagasAbertas?: VagaAberta[]
}) {
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
          case 'statsGrid':
            return <BlocoNumeros key={b.id} bloco={b} />
          case 'sealsBanner':
            return <BlocoSelos key={b.id} bloco={b} />
          case 'processSteps':
            return <BlocoEtapas key={b.id} bloco={b} />
          case 'ctaContact':
            return <BlocoContato key={b.id} bloco={b} locale={locale} />
          case 'jobsList':
            return <BlocoVagas key={b.id} bloco={b} locale={locale} vagasAbertas={vagasAbertas} />
          case 'partnerShowcase':
            return <BlocoParceiros key={b.id} bloco={b} />
          case 'valueCards':
            return <BlocoValores key={b.id} bloco={b} />
          case 'stickyPageNav':
            return <BlocoMenuDaPagina key={b.id} bloco={b} />
          case 'methodCards':
            return <BlocoCardsDeMetodo key={b.id} bloco={b} />
          case 'bentoGrid':
            return <BlocoBento key={b.id} bloco={b} />
          case 'audienceSplit':
            return <BlocoParaQuem key={b.id} bloco={b} />
          case 'accordionSteps':
            return <BlocoAcordeao key={b.id} bloco={b} />
          case 'partnerHero':
            return <BlocoParceiroHero key={b.id} bloco={b} />
          case 'partnerSplit':
            return <BlocoParceiroSecao key={b.id} bloco={b} locale={locale} />
          case 'homeHero':
            return <BlocoHomeHero key={b.id} bloco={b} locale={locale} />
          case 'logoMarquee':
            return <BlocoFaixaDeLogos key={b.id} bloco={b} />
          case 'featureTabs':
            return <BlocoAbasDeDestaque key={b.id} bloco={b} />
          case 'homeBento':
            return <BlocoBentoDaHome key={b.id} bloco={b} />
          case 'caseCarousel':
            return <BlocoCarrosselDeCases key={b.id} bloco={b} />
          case 'highlightCarousel':
            return <BlocoCarrosselDeDestaques key={b.id} bloco={b} locale={locale} />
          case 'testimonialCarousel':
            return <BlocoDepoimentos key={b.id} bloco={b} />
          case 'contentTeaser':
            return <BlocoVitrineDeConteudo key={b.id} bloco={b} />
          case 'insightsHub':
            return <BlocoHubDeInsights key={b.id} bloco={b} />
        }
      })}
    </>
  )
}
