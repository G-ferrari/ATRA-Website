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

/* Respiro vertical da seção. Ver a justificativa do campo em `blocks/shared.ts`:
 * /sobre e /carreiras usam escalas diferentes, e a diferença é de centenas de
 * pixels ao longo da página. */
export const ESPACOS: Record<'normal' | 'amplo', string> = {
  normal: 'py-16 md:py-20',
  amplo: 'py-20 md:py-24',
}
