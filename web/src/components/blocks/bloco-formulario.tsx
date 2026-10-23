import { AlertTriangle } from 'lucide-react'

import { FormularioDaSecao } from '@/components/forms/formulario-da-secao'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'
import type { BlocoFormSection } from '@/types/content'

import { BORDAS, ESPACOS } from './bordas'

/* A seção "Formulário" (feature criador-de-formularios, task 051): título,
 * texto e um formulário de Conteúdo → Formulários.
 *
 * Duas formas. **Sozinho, centralizado**: título e texto em cima, o formulário
 * numa coluna de leitura. **Com o texto ao lado**: título e texto à esquerda,
 * presos no alto enquanto o formulário rola, e o formulário à direita; no
 * celular, um embaixo do outro. Sem título nem texto, as duas são a mesma.
 *
 * O formulário vai num cartão (tom de superfície e sombra leve, sem borda),
 * que o separa do texto da página como os cartões da home. */

const AVISOS: Record<NonNullable<BlocoFormSection['avisoDoPreview']>['tipo'], string> = {
  'sem-formulario': 'Escolha um formulário nesta seção. Se ele foi apagado, escolha outro.',
  incompleto: 'O formulário escolhido está incompleto. Falta preencher:',
  'nao-publicado':
    'Este formulário tem alterações que não foram publicadas. O site mostra só a versão publicada; se ele nunca foi publicado, a seção não aparece.',
}

export function BlocoFormulario({ bloco, locale }: { bloco: BlocoFormSection; locale: Locale }) {
  /* No site, formulário fora do ar some com a seção inteira: um título
     chamando para um formulário que não está lá é pior que nada. */
  if (!bloco.formulario && !bloco.avisoDoPreview) return null

  const temCabecalho = Boolean(bloco.title || bloco.paragrafos.length)
  const aoLado = bloco.layout === 'lado-a-lado' && temCabecalho
  const idDoTitulo = bloco.title ? `secao-formulario-${bloco.id}` : undefined

  const cabecalho = temCabecalho && (
    <div className={cn('flex flex-col gap-5', aoLado ? 'lg:sticky lg:top-32' : 'text-center')}>
      {bloco.title && (
        <h2
          id={idDoTitulo}
          className="text-balance font-display text-3xl leading-tight tracking-tight text-text-main md:text-4xl"
        >
          {bloco.title}
        </h2>
      )}
      {bloco.paragrafos.map((p, i) => (
        <p key={i} className="text-pretty text-base leading-relaxed text-text-subtle md:text-lg">
          {p}
        </p>
      ))}
    </div>
  )

  /* O cartão contrasta com o fundo da seção: no fundo alternado, que já é o
     tom do cartão, ele volta ao tom da página. */
  const cartao = (
    <div
      className={cn(
        'rounded-[12px] p-6 shadow-sm sm:p-8',
        bloco.theme === 'surface-2' ? 'bg-surface-1' : 'bg-surface-2',
      )}
    >
      {bloco.avisoDoPreview && <AvisoDoPreview aviso={bloco.avisoDoPreview} />}
      {bloco.formulario && <FormularioDaSecao formulario={bloco.formulario} locale={locale} idDoTitulo={idDoTitulo} />}
    </div>
  )

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'scroll-mt-24 px-4 sm:px-6',
        ESPACOS[bloco.espaco],
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      {aoLado ? (
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">{cabecalho}</div>
          <div className="lg:col-span-7">{cartao}</div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col gap-10">
          {cabecalho}
          {cartao}
        </div>
      )}
    </section>
  )
}

/** O campo que falta, com o nome que ele tem no admin (o mapper diz o
 *  caminho no schema). */
function oQueFalta(campo: string): string {
  const rotulo = /^forms\.fields\[(\d+)\]\.label$/.exec(campo)
  if (rotulo) return `Rótulo do ${rotulo[1]}º campo (aba Campos)`
  const nomes: Record<string, string> = {
    'forms.fields (campo de e-mail)': 'O campo de e-mail (aba Campos)',
    'forms.submitLabel': 'Texto do botão (aba Botão e envio)',
    'forms.successMessage': 'Mensagem depois do envio (aba Botão e envio)',
    'forms.redirectPath': 'Endereço da página depois do envio (aba Botão e envio)',
  }
  return nomes[campo] ?? campo
}

/** Só no preview: o que falta para a seção aparecer no site. Quem visita o
 *  site nunca vê isto — o mapper só preenche o aviso no modo rascunho. */
function AvisoDoPreview({ aviso }: { aviso: NonNullable<BlocoFormSection['avisoDoPreview']> }) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-[6px] bg-amber-500/10 p-4 text-sm text-text-main last:mb-0">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      <div className="flex flex-col gap-1">
        <p>{AVISOS[aviso.tipo]}</p>
        {aviso.tipo === 'incompleto' && <p className="font-semibold">{oQueFalta(aviso.campo)}</p>}
        <p className="text-text-muted">Você está vendo isto porque abriu o preview.</p>
      </div>
    </div>
  )
}
