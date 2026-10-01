/* O fim padrão das páginas internas (29/09) — conteúdo e regra de troca da
 * migração `20260929_223200_fim_das_paginas_internas`, separados dela para
 * terem teste (`fim-das-paginas.test.ts`) e para o seed e os importadores
 * chegarem ao mesmo resultado em banco novo.
 *
 * Pedido do G-ferrari: toda página interna termina com a faixa da página do
 * Google Cloud — "Entre em contato", "Fale conosco" para /contato e a IA ao
 * lado —, e as 12 soluções do WordPress e os 8 segmentos **perdem o
 * formulário** do fim ("Tira o formulário"). Quem quiser falar vai a /contato.
 *
 * O texto é o da faixa do Google Cloud na homologação em 29/09 (print do
 * G-ferrari), igual ao de `components/layout/chamada-final.tsx`, que fecha as
 * páginas desenhadas em código (case, artigo, webinar, material). */

type Bloco = { blockType: string; id?: string | null; [campo: string]: unknown }

export const FIM_PT = {
  blockType: 'ctaBanner',
  variant: 'dark-centered',
  title: 'Entre em contato',
  description: 'Saiba mais sobre quem somos e como podemos moldar o futuro da sua empresa juntos.',
  cta: { label: 'Fale conosco', href: '/contato' },
  secondaryCta: { label: 'Dúvida Rápida? Fale com nossa IA', href: '/chat' },
} as const

/* Só os campos localizados: o resto (variante, destinos) é o mesmo nos dois. */
export const FIM_EN = {
  title: 'Get in touch',
  description: 'Learn more about who we are and how we can shape the future of your business together.',
  cta: { label: 'Contact us' },
  secondaryCta: { label: 'Quick question? Talk to our AI' },
} as const

const ultimo = (layout: Bloco[], n = 1) => layout[layout.length - n]

/** A faixa já é a padrão — a migração rodou, ou alguém a pôs pelo admin. */
export const jaTemOFimPadrao = (layout: Bloco[]) => {
  const b = ultimo(layout)
  return (
    b?.blockType === 'ctaBanner' &&
    b.variant === 'dark-centered' &&
    (b.cta as { href?: string } | undefined)?.href === FIM_PT.cta.href
  )
}

/* `#contato` era a âncora do formulário que sai. Botão que apontava para ela
 * (o "Quero saber mais" do herói, principalmente) passa a levar à página de
 * contato — o que o G-ferrari aceitou junto com a saída do formulário. Só
 * troca valor de campo `href`, e só o exato `#contato`. */
export function semAncoraDeContato<T>(valor: T): T {
  if (Array.isArray(valor)) return valor.map(semAncoraDeContato) as T
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(
      Object.entries(valor).map(([k, v]) => [k, k === 'href' && v === '#contato' ? '/contato' : semAncoraDeContato(v)]),
    ) as T
  }
  return valor
}

export type Troca = { layout: Bloco[]; motivo: null } | { layout: null; motivo: string }

/* ⚠️ Trava: só mexe no formato esperado — página terminando em faixa +
 * formulário (soluções e segmentos do WordPress) ou só em faixa (IA, RC18,
 * /sobre). Página que termina de outro jeito foi editada no admin, e fica como
 * está: a migração avisa no log em vez de adivinhar onde é o fim.
 *
 * A faixa nova entra **sem id**: é bloco novo, sem linha no inglês. Reaproveitar
 * o id da faixa antiga deixaria o texto inglês antigo aparecendo em /en. */
export function trocarOFim(layout: Bloco[]): Troca {
  if (jaTemOFimPadrao(layout)) return { layout: null, motivo: 'já tem o fim padrão' }

  let corte: number
  if (ultimo(layout)?.blockType === 'ctaContact' && ultimo(layout, 2)?.blockType === 'ctaBanner') corte = 2
  else if (ultimo(layout)?.blockType === 'ctaBanner') corte = 1
  else return { layout: null, motivo: `termina em ${ultimo(layout)?.blockType ?? 'nada'}` }

  const resto = layout.slice(0, layout.length - corte)
  /* Formulário que sobrasse no meio da página perderia a âncora que os botões
     usam — não é o formato que esta migração conhece. */
  if (resto.some((b) => b.blockType === 'ctaContact')) return { layout: null, motivo: 'tem formulário no meio' }

  return {
    layout: [...semAncoraDeContato(resto), structuredClone(FIM_PT) as unknown as Bloco],
    motivo: null,
  }
}
