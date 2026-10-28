import type { Locale } from '../locales'

/* Os perfis de consultores (`specialist-roles`) como texto da página de
 * Consultores, para a busca da ATRA AI (D-75).
 *
 * A página-mestra de Consultores tem só o herói no `layout`: os perfis vêm da
 * collection, montados por bloco na hora. O índice lia o `layout`, e
 * "quais consultores vocês têm com Databricks?" não achava o perfil que lista
 * Databricks e a certificação dele — achava artigo. Os perfis entram no texto
 * da página, e o cartão continua sendo o da página: perfil não tem endereço.
 *
 * ⚠️ Os números do cartão (projetos, parceiros, tamanho do time) ficam de fora:
 * o assistente não fala de tamanho de equipe (limite 1 de `instrucao-da-ia.ts`),
 * e um número no trecho é convite para ele repetir. */

export type Perfil = {
  role?: string | null
  level?: string | null
  description?: string | null
  tags?: { name?: string | null }[] | null
  certifications?: { name?: string | null }[] | null
}

const ROTULOS = {
  pt: { perfil: 'Perfil de consultor', especialidades: 'Especialidades', certificacoes: 'Certificações' },
  en: { perfil: 'Consultant profile', especialidades: 'Specialties', certificacoes: 'Certifications' },
  es: { perfil: 'Perfil de consultor', especialidades: 'Especialidades', certificacoes: 'Certificaciones' },
} as const

const nomes = (lista: Perfil['tags']): string =>
  (lista ?? [])
    .map((i) => i.name?.trim())
    .filter(Boolean)
    .join(', ')

/** Um parágrafo por perfil: cargo, senioridade, descrição, especialidades e certificações. */
export function paragrafosDosPerfis(perfis: readonly Perfil[], locale: Locale): string[] {
  const r = ROTULOS[locale]
  return perfis.flatMap((p) => {
    const cargo = p.role?.trim()
    if (!cargo) return []
    const partes = [`${r.perfil}: ${cargo}${p.level ? ` (${p.level})` : ''}.`]
    if (p.description?.trim()) partes.push(p.description.trim())
    const especialidades = nomes(p.tags)
    if (especialidades) partes.push(`${r.especialidades}: ${especialidades}.`)
    const certificacoes = nomes(p.certifications)
    if (certificacoes) partes.push(`${r.certificacoes}: ${certificacoes}.`)
    return [partes.join(' ')]
  })
}
