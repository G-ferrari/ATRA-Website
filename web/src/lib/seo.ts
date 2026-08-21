import type { Metadata } from 'next'

/**
 * Página magra não é indexável (D-08).
 *
 * A regra vale para artigo, vaga e material rico: enquanto o corpo estiver
 * vazio, a página existe para quem tem o link e é invisível para busca. Página
 * magra não prejudica só a si — prejudica o domínio inteiro.
 *
 * `follow: true` de propósito: o robô não indexa a página, mas segue os links
 * dela, então o que estiver linkado ali continua sendo descoberto.
 *
 * ⚠️ Vivia repetida em quatro `generateMetadata`. Virou função quando a Fase 4b
 * levou embora as fixtures que a testavam: os 6 posts do protótipo estavam sem
 * corpo **de propósito**, e o `smoke.spec.ts` provava a regra neles. Com os 207
 * artigos reais importados não existe mais página sem corpo no banco, e a
 * asserção passaria a depender de qual banco rodou o teste. Aqui ela é testável
 * sem banco nenhum.
 */
export function robotsDeCorpo(corpo: unknown): Metadata['robots'] {
  return corpo ? undefined : { index: false, follow: true }
}
