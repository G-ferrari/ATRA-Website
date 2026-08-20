/* Seed da página do parceiro Google Cloud (MIG-054/054a).
 *
 * O legado monta **todas** as páginas de parceiro com um componente só,
 * `PartnerPageBase.tsx`, instanciado com props. Aqui a mesma estrutura vira
 * blocos guardados no próprio parceiro, e serve qualquer parceiro com `hasPage`.
 *
 * ⚠️ MIG-054 portou a página com os blocos genéricos e ela saiu 5.789px contra
 * os 9.317px do gabarito — 38% mais curta —, sem gabarito registrado. As três
 * seções de duas colunas tinham virado grades de ícones e o herói perdeu a
 * faixa de prêmios. MIG-054a introduziu `partnerHero` e `partnerSplit` e
 * registrou a rota em `ROTAS_COM_GABARITO`.
 *
 * Conteúdo de `legacy/src/locales/pt.json`, chave `partner`.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { casarIds } from './ids'

const payload = await getPayload({ config })

/* Os cinco "Latin America Partner of the Year" (`PartnerGoogleCloud.tsx:9`).
 * A quebra de linha no título é do gabarito — o cartão a preserva com
 * `whitespace-pre-line`, e sem ela o cartão fica uma linha mais baixo. */
const premios = [2018, 2020, 2022, 2024, 2025].map((ano) => ({
  topText: 'LATIN AMERICA',
  title: 'Partner of the Year\nService',
  highlight: String(ano),
}))

const beneficios = [
  'Certificação oficial pela Google Cloud, garantindo qualidade e segurança.',
  'Soluções personalizadas que atendem às necessidades exclusivas do seu negócio.',
  'Acesso a soluções avançadas e inovação contínua.',
  'Alinhamento com as melhores práticas globais em cloud computing.',
  'Acompanhamento completo durante toda a jornada na nuvem.',
]

/* ⚠️ "Workplace Transformation" vem com o parêntese: é assim em
 * `PartnerGoogleCloud.tsx:32`, e o texto mais longo é o que decide a altura da
 * ficha, que tem `line-clamp-2`. */
const especializacoes = [
  'Infrastructure',
  'Workplace Transformation (clientes SMB e Enterprise)',
  'Consulting Partner',
  'Data Analytics',
  'Application Development',
  'Cloud Migration',
  'Managed Service Provider',
]

async function midia(chave: string) {
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: chave } },
    limit: 1,
    depth: 0,
  })
  if (!docs[0]) console.warn(`  ⚠️ mídia "${chave}" não encontrada no acervo`)
  return docs[0]?.id ?? null
}

/* O logo sai do acervo, não do `gstatic.com` do gabarito
 * (`PartnerGoogleCloud.tsx:50`); a foto da seção "Trajetória Conjunta" sai do
 * acervo da ATRA, não do hotlink do Unsplash (`:57`) — mesma decisão de /sobre. */
const logo = await midia('logo_google_cloud')
const foto = await midia('Evento parceiro Google')

const layout = [
  {
    blockType: 'partnerHero' as const,
    badge: 'Parceria Estratégica',
    chip: 'Google Cloud',
    title: 'ATRA / Google Cloud Partner',
    highlight: 'ATRA',
    description: 'Quer agilidade, inovação e resultados? Conheça o Google Cloud com a expertise ATRA.',
    logo,
    awards: premios,
    cta: { label: 'Saiba Mais Sobre a Parceria', href: '#about' },
  },
  {
    blockType: 'partnerSplit' as const,
    anchor: 'about',
    navLabel: 'A parceria',
    eyebrow: 'Trajetória Conjunta',
    title: 'Parceria estratégica para sua transformação digital!',
    body: [
      { text: 'O Google Cloud é a plataforma de nuvem do Google que oferece serviços de dados, inteligência artificial e colaboração para empresas. A ATRA, parceira oficial de Google Workspace, Google Cloud Platform e Google Maps Platform, foi Latin America Partner of the Year em 2018, 2020, 2022, 2024 e 2025.' },
      { text: 'Com mais de 20 anos de experiência, ajudamos organizações a migrar, modernizar e inovar na nuvem, unindo nossa expertise à tecnologia do Google.' },
    ],
    rightColumn: 'image' as const,
    image: foto,
    imageLabel: 'Partner',
    logo,
    cta: { label: 'Conheça nossos serviços', href: '#services' },
  },
  {
    blockType: 'partnerSplit' as const,
    anchor: 'services',
    navLabel: 'Capacidades',
    theme: 'surface-2' as const,
    borda: 'ambas' as const,
    eyebrow: 'Capacidades',
    title: 'Por que escolher um Google Cloud Partner?',
    /* ⚠️ "transform desafios" é erro do gabarito (`pt.json`, `partner.benefitsDesc`),
       portado como está (D-15). Registrado em debito-tecnico.md. */
    body: [
      { text: 'Como parceiro certificado Google Cloud, temos a expertise para compreender suas necessidades e transform desafios em oportunidades. Apoiamos sua empresa em todas as etapas da jornada na nuvem, aproveitando ao máximo a infraestrutura e as ferramentas do Google.' },
    ],
    rightColumn: 'checklist' as const,
    items: beneficios.map((text) => ({ text })),
    cta: { label: 'Fale conosco', href: '/contato' },
  },
  {
    blockType: 'partnerSplit' as const,
    anchor: 'especializacoes',
    navLabel: 'Especializações',
    eyebrow: 'Especializações Técnicas',
    title: 'Nossas especializações',
    body: [
      { text: 'A ATRA está preparada para ajudar sua empresa a migrar, modernizar e inovar com o Google Cloud.' },
    ],
    rightColumn: 'specGrid' as const,
    logo,
    items: especializacoes.map((text) => ({ text })),
    /* Aqui não há botão: a seção fecha num link de texto com seta. */
    linkCta: { label: 'Fale com um especialista Google Cloud', href: '/contato' },
  },
  {
    blockType: 'ctaBanner' as const,
    variant: 'dark-centered' as const,
    title: 'Entre em contato',
    description: 'Saiba mais sobre quem somos e como trabalhamos, ou entre em contato conosco para descobrir como podemos moldar o futuro da sua empresa juntos.',
    cta: { label: 'Fale conosco', href: '/contato' },
    secondaryCta: { label: 'Dúvida Rápida? Fale com nossa IA', href: '/chat' },
  },
]

console.log('→ /parceiros/google-cloud')
const { docs } = await payload.find({ collection: 'partners', where: { slug: { equals: 'google-cloud' } }, limit: 1, locale: 'pt', depth: 0 })
if (!docs[0]) {
  console.error('  ✖ parceiro google-cloud não existe — rode parceiros-catalogo.ts antes.')
  process.exit(1)
}
const doc = await payload.update({ collection: 'partners', id: docs[0].id, data: { hasPage: true, layout }, locale: 'pt' })

const gravado = await payload.findByID({ collection: 'partners', id: doc.id, locale: 'pt', depth: 0 })
await payload.update({
  collection: 'partners',
  id: doc.id,
  data: {
    // description é localized e obrigatório; o parceiro nasceu só em PT.
    description: 'Technology partner of ATRA.',
    layout: casarIds(layout, gravado.layout),
  },
  locale: 'en',
})
console.log(`  google-cloud (${layout.length} blocos)`)
process.exit(0)
