import type { Case, Partner, Testimonial as TestimonialDoc } from '@/payload-types'
import type { CaseCard, CaseDetail, PartnerBadge, Testimonial } from '@/types/content'

import { toSeo } from './seo'
import {
  isPopulated,
  toImage,
  toImageOpcional,
  toTextos,
  toTopics,
} from './shared'

/* Documento do Payload → tipo de apresentação.
 * O componente nunca vê `Case`; vê `CaseCard` ou `CaseDetail`. */

export function toCaseCard(doc: Case): CaseCard {
  return {
    slug: doc.slug,
    title: doc.title,
    client: doc.client,
    summary: doc.summary,
    impact: doc.impact ?? null,
    image: toImage(doc.heroImage, 'cases.heroImage'),
    topics: toTopics(doc.topics),
    publishedAt: doc.publishedAt,
  }
}

function toPartnerBadge(valor: number | Partner): PartnerBadge | null {
  if (!isPopulated<Partner>(valor)) return null
  return {
    name: valor.name,
    slug: valor.slug,
    logo: toImageOpcional(valor.logo, 'partners.logo'),
    logoScale: valor.logoScale ?? 'md',
  }
}

export function toTestimonial(valor: number | TestimonialDoc | null | undefined): Testimonial | null {
  if (!isPopulated<TestimonialDoc>(valor)) return null
  return {
    quote: valor.quote,
    // D-14: sem nome, o componente cai para monograma.
    authorName: valor.authorName ?? null,
    authorRole: valor.authorRole,
    company: valor.company,
    photo: toImageOpcional(valor.photo, 'testimonials.photo'),
  }
}

export function toCaseDetail(doc: Case): CaseDetail {
  return {
    ...toCaseCard(doc),
    seo: toSeo(doc.seo, { titulo: doc.title, descricao: doc.summary, imagem: toImage(doc.heroImage, 'cases.heroImage') }),
    // Vazio no CMS cai no resumo: a página nunca fica sem linha de abertura.
    heroSubtitle: doc.heroSubtitle?.trim() || doc.summary,
    challenges: toTextos(doc.challenges, 'text'),
    solution: doc.solution ?? null,
    results: toTextos(doc.results, 'text'),
    technologies: toTextos(doc.technologies, 'name'),
    partners: (doc.partners ?? [])
      .map(toPartnerBadge)
      .filter((p): p is PartnerBadge => p !== null),
    testimonial: toTestimonial(doc.testimonial),
    aboutClient: doc.aboutClient ?? null,
  }
}
