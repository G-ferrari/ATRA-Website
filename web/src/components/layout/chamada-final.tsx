import { BlocoCta } from '@/components/blocks/bloco-cta'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'

/* Faixa que fecha as páginas internas desenhadas em código: case, artigo do
 * blog, webinar e material.
 *
 * Pedido de 29/09 (G-ferrari): todas as páginas internas terminam com a faixa da
 * página do Google Cloud — "Entre em contato", "Fale conosco" para /contato e a
 * IA ao lado. Antes cada template tinha a sua caixa azul (`ContactCta`), com
 * título próprio, telefone e e-mail. As páginas montadas por blocos (soluções,
 * segmentos, /sobre) ganharam a mesma faixa como bloco (D-42), pela migração
 * `20260929_223200_fim_das_paginas_internas` — o texto de lá é o mesmo daqui.
 *
 * É o próprio `BlocoCta` na variante `dark-centered`, não uma cópia do markup:
 * mudar a faixa do Google Cloud muda esta junto. O texto é o da homologação em
 * 29/09 (print do G-ferrari). */
const TEXTOS = {
  pt: {
    titulo: 'Entre em contato',
    descricao: 'Saiba mais sobre quem somos e como podemos moldar o futuro da sua empresa juntos.',
    contato: 'Fale conosco',
    ia: 'Dúvida Rápida? Fale com nossa IA',
  },
  en: {
    titulo: 'Get in touch',
    descricao: 'Learn more about who we are and how we can shape the future of your business together.',
    contato: 'Contact us',
    ia: 'Quick question? Talk to our AI',
  },
} as const

export function ChamadaFinal({ locale }: { locale: Locale }) {
  const t = TEXTOS[locale]
  return (
    <BlocoCta
      bloco={{
        tipo: 'ctaBanner',
        id: 'chamada-final',
        anchor: null,
        navLabel: null,
        theme: 'surface-1',
        borda: 'nenhuma',
        espaco: 'normal',
        variant: 'dark-centered',
        title: t.titulo,
        highlight: null,
        description: t.descricao,
        cta: { label: t.contato, href: hrefDe('contato', locale) },
        secondaryCta: { label: t.ia, href: hrefDe('chat', locale), caption: null },
      }}
    />
  )
}
