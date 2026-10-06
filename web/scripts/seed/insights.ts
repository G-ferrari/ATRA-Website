/* Seed de /insights (MIG-060).
 *
 * Desde a D-55 (05/10) a Insights é automática: as faixas com os 3 conteúdos
 * mais recentes de cada tipo saem das collections, e os 10 cartões escritos à
 * mão do legado — e os tópicos e as contagens que os acompanhavam — saíram.
 * O seed grava só o que ainda é texto da página: topo, pílulas, canais,
 * inscrição e chamada final.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { casarIds } from './ids'

const payload = await getPayload({ config })

/* As pílulas do topo levam a cada seção; a de "todos" desce às faixas. */
const FORMATOS = [
  { key: 'all', label: 'Todos os Formatos', icon: 'app' as const },
  { key: 'case', label: 'Cases de Sucesso', icon: 'star' as const, href: '/cases-de-sucesso' },
  { key: 'blog', label: 'Artigos & Blog', icon: 'file-text' as const, href: '/blog' },
  { key: 'report', label: 'ATRA na mídia', icon: 'book' as const, href: '/atra-na-midia' },
  { key: 'webinar', label: 'Webinars', icon: 'video' as const, href: '/webinars' },
  { key: 'ebook', label: 'Ebooks & Guias', icon: 'book' as const, href: '/ebooks' },
]

const layout = [
  {
    blockType: 'insightsHub' as const,
    badge: 'Hub Central de Conhecimento',
    chip: 'ATRA Insights',
    title: 'Transformando inteligência técnica em vantagem competitiva.',
    highlight: 'vantagem competitiva',
    description: 'Explore nossos cases de sucesso com grandes marcas, relatórios de mercado, artigos de arquitetos especialistas, webinars ao vivo e ebooks estratégicos sobre Dados & IA.',
    formats: FORMATOS,
    portals: {
      title: 'Nossos Canais de Conteúdo',
      description: 'Acesse as seções dedicadas para cada formato de material.',
    },
    newsletter: {
      eyebrow: 'ATRA Knowledge Club',
      title: 'Receba os melhores Insights quinzenalmente',
      description: 'Junte-se a mais de 5.000 líderes de dados e receba nossos artigos, pesquisas de mercado e convites de webinars direto na sua caixa de entrada.',
    },
    closing: {
      title: 'Quer implementar esses conceitos na sua empresa?',
      description: 'Nossos consultores e arquitetos seniores estão prontos para ajudar sua equipe a desenhar e executar soluções em Dados, IA e Cloud.',
      ctaLabel: 'Conhecer Nossos Consultores',
      ctaHref: '/consultores',
      secondaryLabel: 'Falar com Especialista',
      secondaryHref: '/#fale-conosco',
    },
  },
]

console.log('→ /insights')
const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'insights' } }, limit: 1, locale: 'pt', depth: 0 })
const dados = { title: 'Insights', slug: 'insights', layout, _status: 'published' as const }
const doc = docs[0]
  ? await payload.update({ collection: 'pages', id: docs[0].id, data: dados, locale: 'pt' })
  : await payload.create({ collection: 'pages', data: dados, locale: 'pt' })

const gravado = await payload.findByID({ collection: 'pages', id: doc.id, locale: 'pt', depth: 0 })
await payload.update({ collection: 'pages', id: doc.id, data: { title: 'Insights', slug: 'insights', layout: casarIds(layout, gravado.layout) }, locale: 'en' })
console.log('  insights')
process.exit(0)
