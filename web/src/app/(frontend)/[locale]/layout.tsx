import type { Metadata } from 'next'
import { Mona_Sans } from 'next/font/google'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { Casca } from '@/components/layout/casca'
import { CapturaDeUtm } from '@/components/layout/captura-de-utm'
import { DadosEstruturados } from '@/components/layout/dados-estruturados'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { lerContato } from '@/lib/contato'
import { organizacao } from '@/lib/jsonld'
import { LOCALES, isLocale } from '@/lib/locales'
import { toNavegacao } from '@/lib/mappers/navigation'
import { toImageOpcional } from '@/lib/mappers/shared'
import { toRodape } from '@/lib/mappers/site'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'
import '../globals.css'

/* D-16: Mona Sans pela MESMA build que o legado consome.
 *
 * next/font/google baixa em tempo de build e serve do nosso domínio: métrica
 * idêntica à do legado, sem requisição do visitante ao Google (LGPD) e sem DNS
 * extra no carregamento.
 *
 * Não trocar por next/font/local com a build do GitHub: medido, ela é de 1,4% a
 * 2,3% mais estreita, o que estouraria o limite de 0,1% da regressão visual em
 * toda captura com texto.
 *
 * ⚠️ Não adicionar `axes: ['wdth']`. O site não usa largura condensada nem
 * expandida, e pedir o eixo faz o Google servir um corte diferente: os pesos
 * romanos continuam batendo, mas o itálico fica 3,2% mais largo que o do legado.
 * Sem o eixo, os 8 pesos e o itálico batem em 0,0000%. */
const monaSans = Mona_Sans({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-mona-sans',
})

export const metadata: Metadata = {
  title: { default: 'ATRA', template: '%s | ATRA' },
  description: 'Consultoria de Dados e IA.',
}

/* Pré-renderiza os dois idiomas. O proxy reescreve a raiz para /pt, então
 * este é o layout raiz de fato do site público. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children }: LayoutProps<'/[locale]'>) {
  // next/root-params (Next 16): dá o locale em qualquer Server Component,
  // sem passar por props até o fim da árvore.
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  /* O menu é ilha cliente e não busca dado (blocos.md, regra 1): o layout
   * resolve as três fontes e entrega pronto. `select` em cada consulta porque
   * o menu só precisa do cartão — sem ele, `solutions` arrasta um join por
   * tipo de bloco e o cabeçalho passa a custar dezenas de segundos. */
  const payload = await getPayload()
  const [navGlobal, rodapeGlobal, institucional, contato, solucoes, parceiros, segmentos] = await Promise.all([
    payload.findGlobal({ slug: 'navigation', locale, depth: 0 }),
    payload.findGlobal({ slug: 'footer', locale, depth: 0 }),
    /* `depth: 1` só pelo logo: o `site-settings` também carrega selos e
       métricas, que o cabeçalho não usa. */
    payload.findGlobal({ slug: 'site-settings', locale, depth: 1 }),
    lerContato(),
    payload.find({
      collection: 'solutions',
      locale,
      depth: 0,
      limit: 100,
      sort: 'order',
      /* ⚠️ O filtro de status é **obrigatório aqui**, e não redundante com o
       * `access.read` da collection: a Local API roda com `overrideAccess: true`
       * por padrão, então o acesso que esconde rascunho do público **não se
       * aplica**. Sem isto o mega-menu lista rascunho para todo visitante — o
       * que só apareceu quando MIG-093 pôs 12 soluções em rascunho, meses depois
       * de a consulta ter sido escrita. */
      where: { _status: { equals: 'published' } },
      select: { title: true, slug: true, category: true, icon: true, shortDescription: true, hasPage: true },
    }),
    payload.find({
      collection: 'partners',
      locale,
      depth: 1,
      limit: 100,
      sort: 'order',
      select: { name: true, slug: true, logo: true, logoScale: true, description: true },
    }),
    payload.find({
      collection: 'segments',
      locale,
      depth: 0,
      limit: 100,
      sort: 'order',
      where: { _status: { equals: 'published' } },
      select: { name: true, slug: true, icon: true, shortDescription: true },
    }),
  ])

  const logo = toImageOpcional(institucional.logo, 'site-settings.logo')
  const rodape = toRodape(rodapeGlobal)

  const navegacao = toNavegacao({
    global: navGlobal,
    solucoes: solucoes.docs,
    parceiros: parceiros.docs,
    segmentos: segmentos.docs,
    locale,
    hrefDaSolucao: (slug) => hrefDe('solucoes', locale, slug),
  })

  return (
    /* `dark` no servidor: o legado inicia no tema escuro (App.tsx:2571) e a
     * regressão visual compara os dois. Aplicar por efeito no cliente causaria
     * flash de tema claro na primeira pintura. O alternador entra com a casca
     * do site (MIG-034). */
    <html
      lang={locale === 'pt' ? 'pt-BR' : 'en'}
      /* Sem `antialiased`: o legado não define `-webkit-font-smoothing`, e
       * ligá-lo muda a rasterização de todo glifo do site. Era a diferença que
       * sobrava na regressão visual depois de layout e fonte já baterem — as
       * 60 caixas de texto da listagem coincidem ao décimo de pixel, e ainda
       * assim as bordas divergiam. Porte fiel vale para isso também (D-15). */
      className={`${monaSans.variable} h-full dark`}
    >
      {/* A árvore reproduz a do legado (`App.tsx:2597`): o `<body>` fica limpo,
        * como no `index.html` dele, e as classes de casca vivem no wrapper. */}
      <body>
        {/* Uma vez por página, no layout: a organização é a mesma em todas, e
            repetir o nó em cada rota só multiplicaria bytes. */}
        <DadosEstruturados
          dados={organizacao({ contato, logo, fundadaEm: institucional.foundedYear })}
        />
        {/* Não desenha nada: guarda a campanha da URL de chegada para o
            formulário mandar junto no envio (D-26). */}
        <CapturaDeUtm />
        <Casca
          cabecalho={<SiteHeader locale={locale} navegacao={navegacao} logo={logo} />}
          rodape={<SiteFooter locale={locale} rodape={rodape} contato={contato} logo={logo} />}
          alternadorDeTema={<ThemeToggle locale={locale} />}
        >
          {children}
        </Casca>
      </body>
    </html>
  )
}
