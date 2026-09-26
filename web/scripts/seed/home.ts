/* Seed da home (MIG-057/058/059).
 *
 * A home do legado (`App.tsx:2544`) não reusa nenhuma seção das páginas
 * internas: são oito componentes próprios. Cada um virou um bloco, e a ordem
 * aqui é a daquele arquivo.
 *
 * ⚠️ A composição prevista no plano listava seis blocos e não tinha a caixa de
 * conversa com a IA (`App.tsx:2055`), que no legado é filha do herói. Foi o
 * quarto levantamento escrito a partir do inventário de seções em vez do
 * markup; ver a nota em docs/02-especificacao/blocos.md.
 */
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { midiaDe } from './midia'
import { casarIds } from './ids'
import { imagemDoPrototipo } from './imagens-do-prototipo'

const payload = await getPayload({ config })
const LEGADO = path.resolve(process.cwd(), '../legacy')

/* Os dois resolvem raiz diferente — web/ e legacy/ — e o resto vive em midia.ts. */
const upsertMidiaLocal = (arquivo: string, alt: string) =>
  midiaDe(payload, path.resolve(process.cwd(), arquivo), alt)
const upsertMidia = (arquivo: string, alt: string) => midiaDe(payload, path.join(LEGADO, arquivo), alt)

/* ⚠️ Onde o gabarito tem imagem, o porte precisa ter **alguma** imagem.
 *
 * O aceite visual mascara `img`, e a máscara cobre a caixa do elemento: no
 * cartão de destaque o fundo é `absolute inset-0 w-full h-full`, então no legado
 * o cartão inteiro vira um retângulo magenta. Sem imagem do nosso lado o texto
 * aparecia e **100% do cartão** divergia — foi o que levou o tablet a 31% de
 * pixels diferentes.
 *
 * As do legado são banco de imagens (Unsplash) e placeholder (picsum), não
 * acervo da ATRA: entram como o mesmo marcador das capas de material, que diz o
 * que é. Trocar por foto real é decisão de conteúdo (D-22). */
const marcador = await upsertMidiaLocal('scripts/seed/assets/capa-pendente.png', 'CAPA PENDENTE')

/* Com `SEED_FIXTURES=1` a foto do protótipo entra no lugar do marcador, para a
 * revisão interna ver a página como o gabarito a desenha. Sem o sinal devolve
 * `null` e nada muda. Ver `imagens-do-prototipo.ts`. */
const doPrototipo = (chave: Parameters<typeof imagemDoPrototipo>[1], alt: string) =>
  imagemDoPrototipo(payload, chave, alt)

const DESTAQUES = [
  { image: (await doPrototipo('home.destaque.transformacao', 'Acelere sua Transformação')) ?? marcador, icon: 'zap' as const, badge: 'Inovação Cloud', title: 'Acelere sua Transformação', description: 'Modernize sua infraestrutura, integre sistemas e construa uma base de dados escalável em cloud com suporte de ponta a ponta.' },
  { image: (await doPrototipo('home.destaque.eficiencia', 'Eficiência Operacional')) ?? marcador, icon: 'settings' as const, badge: 'Automação & Analytics', title: 'Eficiência Operacional', description: 'Automatize processos complexos, gere insights em tempo real e aumente exponencialmente a produtividade das equipes com BI e Analytics.' },
  { image: (await doPrototipo('home.destaque.governanca', 'Governança, Segurança e FinOps')) ?? marcador, icon: 'shield-check' as const, badge: 'Governança & FinOps', title: 'Governança, Segurança e FinOps', description: 'Assegure máxima qualidade de dados, proteção e controle rigoroso de custos de nuvem com compliance e governança contínua.' },
  { image: (await doPrototipo('home.destaque.ia', 'Decisões Inteligentes e IA')) ?? marcador, icon: 'sparkles' as const, badge: 'Inteligência Artificial', title: 'Decisões Inteligentes e IA', description: 'Aplique IA Generativa, modelos preditivos e soluções digitais avançadas para antecipar cenários e acelerar tomada de decisão.' },
]

/* Os 5 cartões do carrossel de cases (`App.tsx:1611`).
 *
 * ⚠️ O quinto anuncia um case da RD Saúde que **não existe** e aponta para o
 * slug do Banco ABC — é P-11, e está portado como está (D-15). Ver a nota do
 * campo `items` em `blocks/index.ts`. */
const CASES = [
  { icon: 'building' as const, company: 'Banco ABC', title: 'Marketplace & Governança de Dados', description: 'Estabelecimento de fluxo automatizado entre Informatica e GCP para democratizar dados com total segurança, governança e eficiência regulatória.', slug: 'marketplace-governanca-dados', color: '#2A75C5', foto: 'case_marketplace_gov_1785848321737.jpg' },
  { icon: 'trending-up' as const, company: 'Banco Carrefour', title: 'Eficiência em Processos de Risco com GCP', description: 'Ingestão e processamento de dados 51 vezes mais rápido para relatórios regulatórios de risco financeiro no Google Cloud com otimização de FinOps.', slug: 'eficiencia-processos-risco', color: '#1A5FB4', foto: 'case_risk_efficiency_1785848355083.jpg' },
  { icon: 'cpu' as const, company: 'Banco ABC', title: 'Migração de Legado para Google Cloud', description: 'Alimentação automática de aplicação de Risco de Mercado a partir de ambiente legado em curto prazo e migração contínua.', slug: 'migracao-legado-gcp', color: '#124185', foto: 'case_legacy_migration_1785848338358.jpg' },
  { icon: 'chart' as const, company: 'Banco ABC', title: 'Dashboards Estratégicos de BI', description: 'Desenvolvimento de KPIs executivos e painéis de acompanhamento em tempo real para produtos de Crédito Pessoal e Consignado.', slug: 'dashboards-estrategicos', color: '#3C98FA', foto: 'case_strategic_dashboards_1785848371031.jpg' },
  { icon: 'shield-check' as const, company: 'RD Saúde', title: 'Plataforma de Inteligência de Saúde', description: 'Consolidação de ecossistema analítico para inteligência preventiva de saúde, melhorando a experiência do usuário e otimizando processos.', slug: 'marketplace-governanca-dados', color: '#0B2545', foto: 'case_marketplace_gov_1785848321737.jpg' },
]

console.log('→ capas dos cases')
const cases = []
for (const c of CASES) {
  cases.push({
    icon: c.icon,
    company: c.company,
    title: c.title,
    description: c.description,
    href: `/cases-de-sucesso/${c.slug}`,
    color: c.color,
    image: await upsertMidia(`src/assets/images/${c.foto}`, c.title),
  })
}

const CARTOES = [
  { image: (await doPrototipo('home.vitrine.inovacao', 'Inovação em ação: Onde a criatividade encontra a colaboração')) ?? marcador, icon: 'sparkles' as const, category: 'BLOG POST', title: 'Inovação em ação: Onde a criatividade encontra a colaboração', column: 'first' as const },
  { image: (await doPrototipo('home.vitrine.impacto', 'Focado no impacto: Três estratégias essenciais')) ?? marcador, icon: 'trending-up' as const, category: 'BLOG POST', title: 'Focado no impacto: Três estratégias essenciais', column: 'first' as const },
  { image: (await doPrototipo('home.vitrine.ceos', 'Liderando em meio a mudanças: 5 imperativos para CEOs')) ?? marcador, icon: 'user-check' as const, category: 'ARTIGO', title: 'Liderando em meio a mudanças: 5 imperativos para CEOs', column: 'second' as const },
  { image: (await doPrototipo('home.vitrine.ia-generativa', 'O futuro da IA generativa nas empresas')) ?? marcador, icon: 'cpu' as const, category: 'ARTIGO', title: 'O futuro da IA generativa nas empresas', column: 'second' as const },
]

const layout = [
  {
    blockType: 'homeHero' as const,
    titlePrefix: 'A ATRA cria soluções em',
    rotatingWords: ['software sob medida', 'inteligência artificial', 'dados e analytics', 'automação', 'inovação digital'],
    description: 'Criamos, desenvolvemos e avaliamos soluções personalizadas de software, inteligência artificial e dados para impulsionar a inovação e acelerar o crescimento do seu negócio.',
    scrollLabel: 'Descubra mais da ATRA',
    prompt: {
      title: 'Nossos clientes já transformaram suas operações com a ATRA.',
      placeholder: 'Escreva uma mensagem...',
      disclaimer: 'ATRA Intelligence é uma IA e pode cometer erros. Por favor verifique informações críticas.',
      clientsTitle: 'Clientes que confiam em nós',
      },
  },
  {
    blockType: 'homeBento' as const,
    partnerCard: {
      eyebrow: 'Parceiros Oficiais',
      title: 'Ecossistema Global',
      description: 'Alianças estratégicas e soluções integradas com os maiores provedores de nuvem e IA do mundo.',
      items: [
        { name: 'Google Cloud', subtitle: 'Premier Partner', logo: await upsertMidiaLocal('scripts/seed/assets/parceiros/logo_google_cloud.png', 'Google Cloud') },
        { name: 'Azure', subtitle: 'Cloud Solutions', logo: await upsertMidiaLocal('scripts/seed/assets/parceiros/logo_azure.png', 'Microsoft Azure') },
        { name: 'AWS', subtitle: 'Advanced Net', logo: await upsertMidiaLocal('scripts/seed/assets/parceiros/logo_aws.png', 'AWS') },
      ],
    },
    sealsCard: {
      eyebrow: 'Selos de Reconhecimento',
      counter: '5x',
      title: 'GPTW & LIPT',
      description: 'Certificações oficiais Great Place to Work® e Lugares Incríveis para Trabalhar, comprovando nossa cultura acolhedora e excelência contínua.',
      badge: 'Cultura de Elite',
      footnote: 'Pessoas, inovação e tecnologia no nosso DNA.',
      seals: [
        await upsertMidiaLocal('scripts/seed/assets/selos/selo_gptw.jpg', 'Selo Great Place to Work 5x ATRA'),
        await upsertMidia('src/assets/images/lipt-2026.png', 'Selo LIPT 2026 - Lugares Incríveis Para Trabalhar'),
      ],
    },
    /* ⚠️ 150+ e 20+, não 140+ e 30+. A home e /sobre divergem no legado, e a
       divergência é P-01 — decisão de conteúdo, não de quem migra (D-22). */
    metrics: [
      { icon: 'app' as const, tag: 'Tradição', value: '15+', label: 'Anos de experiência', color: 'primary' as const },
      { icon: 'users' as const, tag: 'Time', value: '150+', label: 'Profissionais Especializados', color: 'secondary' as const },
      { icon: 'award' as const, tag: 'Excelência', value: '40+', label: 'Certificações de Parceiros', color: 'primary' as const },
      { icon: 'target' as const, tag: 'Enterprise', value: '20+', label: 'Clientes Estratégicos', color: 'secondary' as const },
    ],
  },
  {
    blockType: 'featureTabs' as const,
    eyebrow: 'Nosso Processo de Valor',
    title: 'Soluções Integradas',
    description: 'Abordagem estruturada para acelerar resultados de negócios através da modernização e inteligência de dados.',
    footnote: 'Metodologia comprovada ATRA',
    cta: { label: 'Saiba mais', href: '/contato' },
    items: DESTAQUES,
  },
  {
    blockType: 'logoMarquee' as const,
    theme: 'surface-2' as const,
    title: 'Parceiros de Confiança',
    // Os logos saem da collection `partners`; ver a nota do campo em `blocks/index.ts`.
  },
  {
    blockType: 'caseCarousel' as const,
    theme: 'surface-2' as const,
    eyebrow: 'Histórias de Impacto',
    title: 'Investindo no Sucesso dos Nossos Clientes',
    description: 'Nosso portfólio reflete foco e excelência em arquitetura de dados, nuvem e inteligência artificial, transformando visão estratégica em valor de longo prazo.',
    readLabel: 'Ler estudo de caso',
    cta: { label: 'Ver todos os cases', href: '/cases-de-sucesso' },
    items: cases,
  },
  {
    blockType: 'testimonialCarousel' as const,
    theme: 'surface-2' as const,
    title: 'Por que os clientes nos escolhem',
  },
  {
    blockType: 'contentTeaser' as const,
    eyebrow: 'Insights & Tendências',
    title: 'Qual é o seu próximo passo brilhante?',
    description: 'Trabalho que muda o jogo. Crescimento impulsionado por pessoas. Na ATRA, ajudamos você a pensar maior, construir mais forte e expandir oportunidades para todos.',
    cards: CARTOES,
    featured: {
      category: 'CASE STUDY',
      title: 'Uma empresa familiar traz o poder da IA para a mesa de jantar',
      ctaLabel: 'Ler estudo de caso',
      href: '#',
      image: (await doPrototipo('home.vitrine.destaque', 'Uma empresa familiar traz o poder da IA para a mesa de jantar')) ?? marcador,
    },
    newsletter: {
      title: 'Inscreva-se para receber os últimos insights da ATRA.',
      placeholder: 'Endereço de e-mail',
    },
  },
  {
    blockType: 'ctaContact' as const,
    theme: 'surface-2' as const,
    anchor: 'fale-conosco',
    variant: 'photo' as const,
    title: 'Vamos construir o próximo nível do seu negócio?',
    subtitle: 'Comece seu projeto de dados!',
    showContactCard: true,
    /* A foto é do acervo da ATRA, não o hotlink do Unsplash do gabarito
       (`App.tsx:2357`) — mesma decisão de /sobre e /consultores. */
    photo: await upsertMidiaLocal('public/fotos/equipe-atra.jpg', 'Equipe da ATRA reunida em evento'),
  },
]

console.log('→ /')
const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, locale: 'pt', depth: 0 })
const dados = { title: 'Home', slug: 'home', layout, _status: 'published' as const }
const doc = docs[0]
  ? await payload.update({ collection: 'pages', id: docs[0].id, data: dados, locale: 'pt' })
  : await payload.create({ collection: 'pages', data: dados, locale: 'pt' })

const gravado = await payload.findByID({ collection: 'pages', id: doc.id, locale: 'pt', depth: 0 })
await payload.update({ collection: 'pages', id: doc.id, data: { title: 'Home', slug: 'home', layout: casarIds(layout, gravado.layout) }, locale: 'en' })
console.log(`  home (${layout.length} blocos)`)
process.exit(0)
