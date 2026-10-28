import { cache } from 'react'

import { toDiagnosticoDeMaturidade } from './mappers/diagnostico'
import { getPayload } from './payload'
import type { Locale } from './locales'
import type { DiagnosticoDeMaturidade } from '@/types/content'

/* D-35 (task 023) — os textos e links do Diagnóstico de Maturidade de Dados,
 * do global `data-maturity-diagnostic`.
 *
 * ⚠️ Quem chama é **página** ou **Server Action** (o e-mail do resultado),
 * nunca componente (regra 4). A ilha do questionário recebe isto pronto.
 *
 * Com `locale`: o texto é localizado. O inglês é lido **sem** fallback (D-76):
 * vazio, o mapper põe o padrão inglês, e não o português do `fallback: true`.
 *
 * `cache()` por requisição: a página lê o global para o cabeçalho e para a
 * conclusão, e não precisa ir ao banco duas vezes. */
export const lerDiagnosticoDeMaturidade = cache(async (locale: Locale): Promise<DiagnosticoDeMaturidade> => {
  const payload = await getPayload()
  return toDiagnosticoDeMaturidade(
    await payload.findGlobal({
      slug: 'data-maturity-diagnostic',
      depth: 0,
      locale,
      ...(locale === 'pt' ? {} : { fallbackLocale: false as const }),
    }),
    locale,
  )
})
