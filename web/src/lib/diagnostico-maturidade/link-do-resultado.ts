import { randomBytes } from 'node:crypto'

import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'

/* O link da página do resultado de cada lead (28/10): o botão "Ver o
 * diagnóstico completo" do e-mail que a automação do RD manda.
 *
 * ⚠️ O token é a **única** chave da página — não há login. Por isso 32 bytes de
 * `randomBytes` (256 bits) e nada derivado do lead: id sequencial deixaria
 * percorrer os resultados de todo mundo, e e-mail na URL vazaria no histórico e
 * em log. Quem tem o link vê o resultado; quem não tem não tem como chegar lá.
 *
 * Fora do `index.ts` de propósito: `node:crypto` não pode entrar no pacote do
 * navegador, e o questionário importa o índice. */

/** O trecho da URL antes do token. Em português nos três idiomas, como o
 *  `pagina` das listagens: o proxy só traduz o primeiro segmento. */
export const SEGMENTO_DO_RESULTADO = 'resultado'

/** 32 bytes em base64url: 43 caracteres, sem `=`. Qualquer outra coisa na URL
 *  é recusada antes de ir ao banco. */
export const FORMATO_DO_TOKEN = /^[A-Za-z0-9_-]{43}$/

export function novoTokenDoResultado(): string {
  return randomBytes(32).toString('base64url')
}

export const ehTokenDoResultado = (v: unknown): v is string => typeof v === 'string' && FORMATO_DO_TOKEN.test(v)

/** Caminho da página do resultado no idioma em que o lead respondeu. */
export function caminhoDoResultado(locale: Locale, token: string): string {
  return hrefDe('diagnosticoMaturidade', locale, `${SEGMENTO_DO_RESULTADO}/${token}`)
}
