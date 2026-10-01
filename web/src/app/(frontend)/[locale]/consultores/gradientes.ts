/* Cor do monograma de cada perfil — as chaves espelham as opções do campo
 * `gradient` em `collections/SpecialistRoles.ts`. Módulo próprio porque desde a
 * task 018 duas ilhas desenham o monograma: a lista (card e detalhe) e a aba de
 * pedido. */
export const GRADIENTES: Record<string, string> = {
  'blue-cyan': 'from-blue-600 to-cyan-500',
  'cyan-teal': 'from-cyan-500 to-teal-400',
  'indigo-blue': 'from-indigo-600 to-blue-500',
  'sky-indigo': 'from-sky-500 to-indigo-500',
  'purple-indigo': 'from-purple-600 to-indigo-500',
  'emerald-teal': 'from-emerald-500 to-teal-600',
  'amber-orange': 'from-amber-500 to-orange-600',
  'blue-teal': 'from-blue-500 to-teal-500',
}

export function gradienteDe(chave: string): string {
  return GRADIENTES[chave] ?? GRADIENTES['blue-cyan']
}
