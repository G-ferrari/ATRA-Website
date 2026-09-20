import { AlertTriangle } from 'lucide-react'

/* Aviso de rascunho incompleto, visível só no modo rascunho.
 *
 * O Payload não exige campos obrigatórios enquanto o documento é rascunho — é
 * o que permite salvar pela metade e voltar depois. A consequência é que o
 * preview recebe documentos sem imagem, sem resumo, sem cliente. Estourar uma
 * página de erro nesse caso ensina o editor a evitar o preview; dizer qual
 * campo falta ensina a preencher. */

/** Nome do campo como aparece no formulário, não como está no schema. */
const ROTULOS: Record<string, string> = {
  'cases.heroImage': 'Imagem principal',
  'cases.topics': 'Assuntos',
  'partners.logo': 'Logo do parceiro',
  'testimonials.photo': 'Foto do depoimento',
}

export function RascunhoIncompleto({ campos }: { campos: string[] }) {
  const lista = [...new Set(campos)].map((c) => ROTULOS[c] ?? c)

  return (
    <div className="rounded-[6px] border border-amber-500/40 bg-amber-500/10 p-6 text-text-main">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" aria-hidden />
        <div>
          <h2 className="font-bold mb-1">Rascunho incompleto</h2>
          <p className="text-sm text-text-muted mb-3">
            {lista.length === 1
              ? 'Falta preencher um campo para esta página ficar pronta:'
              : 'Faltam preencher estes campos para a página ficar pronta:'}
          </p>
          <ul className="text-sm font-semibold space-y-1">
            {lista.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
          <p className="text-xs text-text-muted mt-3">
            Você está vendo isto porque abriu o modo rascunho. Quem visita o site não vê esta página.
          </p>
        </div>
      </div>
    </div>
  )
}
