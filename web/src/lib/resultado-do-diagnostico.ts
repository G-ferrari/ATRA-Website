import { ehPorte, ehSetor, type Calculo, type NomeDoPilar, type Porte, type Setor } from '@/lib/diagnostico-maturidade'
import { ehTokenDoResultado } from '@/lib/diagnostico-maturidade/link-do-resultado'
import { isLocale, type Locale } from '@/lib/locales'
import { getPayload } from '@/lib/payload'

/* A página do resultado de cada lead (28/10): o destino do botão "Ver o
 * diagnóstico completo" no e-mail da automação do RD.
 *
 * ⚠️ Lê **o que foi gravado** no envio, e não refaz a conta a partir das
 * respostas: a página tem de mostrar o mesmo nível e as mesmas notas que o RD
 * recebeu e que o e-mail cita, mesmo que a base de perguntas mude depois. O
 * roadmap é refeito daqui (`montarRoadmap`), porque depende só de média,
 * pilares e gaps.
 *
 * ⚠️ Sai daqui só o necessário para desenhar o resultado: o primeiro nome, para
 * a saudação, e nada de e-mail, telefone, empresa ou cargo. Quem abre o link
 * pode não ser o lead — um e-mail encaminhado basta. */

export type ResultadoGravado = {
  primeiroNome: string
  setor: Setor
  porte: Porte
  calculo: Calculo
  /** O idioma em que o lead respondeu; `null` nos leads de antes de 28/10. */
  idioma: Locale | null
}

/** O pedaço de `form-submissions` que a página usa. Os JSON chegam como
 *  `unknown` e são conferidos aqui. */
export type LeadDoResultado = {
  name?: string | null
  diagnostic?: {
    sector?: string | null
    size?: string | null
    average?: number | null
    level?: string | null
    pillars?: unknown
    dama?: unknown
    gaps?: unknown
    topGaps?: string | null
    locale?: string | null
  } | null
}

const PILARES: readonly NomeDoPilar[] = ['Governança', 'Qualidade', 'Segurança', 'Conformidade']

const finito = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

/* Objeto de números, com o que não for número descartado. JSON gravado por
 * esta mesma action, mas editável por quem tiver acesso ao banco: confere. */
function numeros(v: unknown): Record<string, number> {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {}
  return Object.fromEntries(Object.entries(v).filter((e): e is [string, number] => finito(e[1])))
}

/** O cálculo como foi gravado no envio. `null` quando falta o que a página
 *  precisa (perfil ou média): melhor 404 que um resultado inventado. */
export function resultadoGravado(lead: LeadDoResultado): ResultadoGravado | null {
  const d = lead.diagnostic
  if (!d || !ehSetor(d.sector) || !ehPorte(d.size) || !finito(d.average) || !d.level) return null
  const pilaresGravados = numeros(d.pillars)
  const pilares: Calculo['pilares'] = {}
  for (const p of PILARES) if (Object.hasOwn(pilaresGravados, p)) pilares[p] = pilaresGravados[p]
  return {
    primeiroNome: (lead.name ?? '').trim().split(/\s+/)[0] ?? '',
    setor: d.sector,
    porte: d.size,
    calculo: {
      media: d.average,
      nivel: d.level,
      pilares,
      damas: numeros(d.dama),
      gaps: numeros(d.gaps),
      topGaps: (d.topGaps ?? '').split(' | ').filter(Boolean),
    },
    idioma: d.locale && isLocale(d.locale) ? d.locale : null,
  }
}

/** O resultado pelo token do link. `null` para token malformado, que não
 *  existe ou de lead sem resultado — a página responde 404 nos três, sem
 *  distinguir: dizer "existe, mas…" já é informação para quem tenta adivinhar. */
export async function lerResultadoPeloToken(token: string): Promise<ResultadoGravado | null> {
  /* Formato errado não vai ao banco: o link legítimo tem sempre 43 caracteres. */
  if (!ehTokenDoResultado(token)) return null
  const payload = await getPayload()
  /* ⚠️ A Local API roda com `overrideAccess`: o `access.read` fechado da
     collection não vale aqui. Por isso o filtro é exato (o token inteiro, e o
     kind) e o `select` traz só o que a página desenha. */
  const { docs } = await payload.find({
    collection: 'form-submissions',
    where: {
      and: [{ kind: { equals: 'data-maturity-diagnostic' } }, { 'diagnostic.resultToken': { equals: token } }],
    },
    select: { name: true, diagnostic: true },
    depth: 0,
    limit: 1,
    pagination: false,
  })
  const lead = docs[0]
  return lead ? resultadoGravado(lead as LeadDoResultado) : null
}
