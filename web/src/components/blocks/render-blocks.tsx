import type { VagaAberta } from '@/lib/atrair'
import type { Locale } from '@/lib/locales'
import type { Bloco } from '@/types/content'
import { BlocoChamadaWebinars } from '@/components/secoes/bloco-chamada-webinars'
import { BlocoDestaquesDaSecao } from '@/components/secoes/bloco-destaques-da-secao'
import { BlocoListaDaSecao } from '@/components/secoes/bloco-lista-da-secao'

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
import { BlocoGradeDeImagens } from './bloco-grade-de-imagens'
import { BlocoHomeHero } from './bloco-home-hero'
import { BlocoHubDeInsights } from './bloco-hub-de-insights'
import { BlocoParceiroHero } from './bloco-parceiro-hero'
import { BlocoParceiroSecao } from './bloco-parceiro-secao'
import { BlocoMosaicoDeParceiros } from './bloco-mosaico-de-parceiros'
import { BlocoParceiros } from './bloco-parceiros'
import { BlocoVagas } from './bloco-vagas'
import { BlocoVitrineDeConteudo } from './bloco-vitrine-de-conteudo'
import { BlocoSelos } from './bloco-selos'
import { BlocoTexto } from './bloco-texto'
import { BlocoValores } from './bloco-valores'

/* Seções vizinhas com o mesmo fundo emendam (27/09, G-ferrari).
 *
 * Cada bloco traz o próprio respiro, 96px em cima e embaixo no desktop. Quando
 * o fundo alterna, como nas páginas desenhadas do protótipo, a troca de cor
 * separa as seções e o respiro duplo lê como intenção. Com o mesmo fundo ele
 * vira um buraco de até 192px: foi o que apareceu nas 11 soluções e nos 8
 * segmentos vindos do WordPress, que têm todas as seções no fundo padrão.
 *
 * A regra mora aqui, e não em cada um dos componentes: o bloco que emenda na
 * anterior perde o respiro de cima (`[data-emenda]` em `globals.css`), e o
 * espaço entre as duas fica sendo o de uma seção só. Linha divisória no topo
 * mantém o respiro — sem ele o conteúdo encostaria na linha.
 *
 * Ficam de fora o herói e o submenu, cujo respiro é o de abertura da página, e
 * as duas faixas compactas da home (carrossel de destaques e faixa de logos),
 * que já têm respiro menor que o padrão: emendar nelas deixava 56px entre a
 * faixa e a seção seguinte, menos que os 96px que a regra quer garantir.
 *
 * Os três blocos das páginas-mestras também: trazem o respiro que a rota tinha
 * (D-55), e o bloco seguinte a eles não pode perder o dele — a faixa final de
 * /atra-na-midia ficaria colada na grade. */
const FORA_DA_EMENDA = new Set<Bloco['tipo']>([
  'sectionListing',
  'sectionFeatured',
  'webinarTeaser',
  'pageHero',
  'homeHero',
  'partnerHero',
  'stickyPageNav',
  'insightsHub',
  'highlightCarousel',
  'logoMarquee',
])

function emendaNaAnterior(anterior: Bloco | undefined, bloco: Bloco): boolean {
  if (!anterior || FORA_DA_EMENDA.has(anterior.tipo) || FORA_DA_EMENDA.has(bloco.tipo)) return false
  return anterior.theme === bloco.theme && bloco.borda === 'nenhuma'
}

/* Despacha os blocos de uma página (blocos.md, regra 1: bloco não busca dado —
 * recebe tudo por props, resolvidas na page).
 *
 * O `switch` é exaustivo: `Bloco` é união discriminada, então bloco novo sem
 * caso aqui não compila. É de propósito — é o que impede uma seção existir no
 * CMS e não aparecer no site. */
export function RenderBlocks({
  blocos,
  locale,
  vagasDoAtrair,
}: {
  blocos: Bloco[]
  locale: Locale
  /* Só a página de carreiras passa: são as vagas publicadas no ATRAIR, que
   * viram a grade e levam o candidato para a página da vaga lá (D-33). Quem
   * monta o bloco não busca — recebe (regra 4).
   *
   * ⚠️ `null` e `[]` são estados diferentes (D-41): `null` é "integração
   * desligada ou fora do ar" e a grade cai para a collection `jobs`; `[]` é o
   * ATRAIR dizendo que não há vaga aberta, e a grade mostra o vazio. */
  vagasDoAtrair?: VagaAberta[] | null
}) {
  const renderizar = (b: Bloco) => {
    switch (b.tipo) {
      case 'sectionListing':
        return <BlocoListaDaSecao key={b.id} bloco={b} locale={locale} />
      case 'sectionFeatured':
        return <BlocoDestaquesDaSecao key={b.id} bloco={b} locale={locale} />
      case 'webinarTeaser':
        return <BlocoChamadaWebinars key={b.id} bloco={b} locale={locale} />
      case 'pageHero':
        return <BlocoHero key={b.id} bloco={b} locale={locale} />
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
      case 'imageGrid':
        return <BlocoGradeDeImagens key={b.id} bloco={b} />
      case 'processSteps':
        return <BlocoEtapas key={b.id} bloco={b} />
      case 'ctaContact':
        return <BlocoContato key={b.id} bloco={b} locale={locale} />
      case 'jobsList':
        return <BlocoVagas key={b.id} bloco={b} locale={locale} vagasDoAtrair={vagasDoAtrair} />
      case 'partnerShowcase':
        return <BlocoParceiros key={b.id} bloco={b} />
      case 'partnerMosaic':
        return <BlocoMosaicoDeParceiros key={b.id} bloco={b} />
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
        return <BlocoHubDeInsights key={b.id} bloco={b} locale={locale} />
    }
  }

  /* Todo bloco vai num invólucro `display: contents`, que não gera caixa e não
     mexe no layout. Ele carrega o `data-bloco` — o alvo das miniaturas do
     seletor "Adicionar Seção" (`e2e/miniaturas.spec.ts`) e um jeito de achar o
     bloco no DevTools — e, quando é o caso, o `data-emenda` acima. */
  return (
    <>
      {blocos.map((b, i) => (
        <div
          key={b.id}
          className="contents"
          data-bloco={b.tipo}
          data-emenda={emendaNaAnterior(blocos[i - 1], b) ? '' : undefined}
        >
          {renderizar(b)}
        </div>
      ))}
    </>
  )
}
