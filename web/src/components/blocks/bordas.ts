/* Linhas de separação entre seções.
 *
 * O legado alterna borda junto com o fundo, e não de forma uniforme:
 * `nossos-valores` usa `border-y`, `nassas-solucoes` e o CTA final usam
 * `border-t`, `porque-escolher` não usa nenhuma. É inconsistência do original,
 * reproduzida por fidelidade (D-15) e candidata a unificação depois do aceite. */
export const BORDAS: Record<'nenhuma' | 'topo' | 'ambas', string> = {
  nenhuma: '',
  topo: 'border-t border-slate-200 dark:border-white/5',
  ambas: 'border-y border-slate-200 dark:border-white/5',
}
