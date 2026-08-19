import { Icone } from './icones'

/* A pílula numerada que abre cada seção de `legacy/src/pages/SolutionAI.tsx`
 * (`:231`, `:406`, `:633`, `:697`).
 *
 * Só a pílula é compartilhada. O `h2` e o parágrafo de cada seção ficam no
 * bloco: as quatro variam de propósito no legado — a 01 tem `mb-4` no título e
 * a 02 tem `mb-3`, a 02 centraliza e a 04 alinha à esquerda, e o parágrafo da
 * 04 é `mt-2 max-w-2xl` enquanto o da 01 é largura cheia. Unificar aqui
 * economizaria linhas e reprovaria o aceite visual (D-15). */
export function PilulaDeSecao({ texto, icone }: { texto: string; icone: string | null }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
      {icone && <Icone nome={icone} size={13} />} {texto}
    </div>
  )
}
