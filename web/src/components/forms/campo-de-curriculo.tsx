'use client'

import { FileText, Paperclip } from 'lucide-react'
import { useId, useState } from 'react'

import { ACCEPT_CURRICULO, MENSAGENS_DO_CURRICULO, conferirArquivoNoNavegador, type MotivoDoCurriculo } from '@/lib/curriculo'
import type { Locale } from '@/lib/locales'

/* O anexo obrigatório do currículo no Banco de Talentos (26/11).
 *
 * Um `<input type="file">` de verdade, dentro de um `<label>` desenhado como os
 * outros campos: sem JavaScript o formulário continua enviando (a casca é um
 * `<form action>` com Server Action), e o `required` nativo segura o envio sem
 * anexo. Com JavaScript, a mensagem sai **na página**, no idioma dela, em vez
 * do balão do navegador — que não aponta para um campo escondido.
 *
 * ⚠️ `sr-only`, nunca `hidden`/`display:none`: o navegador só valida e só
 * foca campo que existe no layout. Com `display:none` o `required` deixa de
 * barrar o envio em parte dos navegadores.
 *
 * A conferência daqui é de conveniência (extensão e tamanho, sem ler o
 * arquivo). A que vale é a da action — `conferirCurriculo` em `lib/curriculo.ts`. */

const TEXTOS = {
  pt: { rotulo: 'Anexar currículo *', dica: 'PDF ou Word, até 5 MB', trocar: 'clique para trocar' },
  en: { rotulo: 'Attach résumé *', dica: 'PDF or Word, up to 5 MB', trocar: 'click to change' },
  es: { rotulo: 'Adjuntar currículum *', dica: 'PDF o Word, hasta 5 MB', trocar: 'haga clic para cambiar' },
} as const

const tamanho = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`

export function CampoDeCurriculo({ locale }: { locale: Locale }) {
  const t = TEXTOS[locale]
  const mensagens = MENSAGENS_DO_CURRICULO[locale]
  const id = useId()
  const [arquivo, setArquivo] = useState<{ name: string; size: number } | null>(null)
  const [erro, setErro] = useState<MotivoDoCurriculo | null>(null)

  return (
    <div>
      <label
        htmlFor={id}
        className={`flex items-center gap-3 w-full rounded-[6px] border border-dashed px-3.5 py-2.5 cursor-pointer transition-colors bg-surface-2 hover:border-primary focus-within:border-primary ${
          erro ? 'border-red-500' : arquivo ? 'border-primary/60' : 'border-text-muted/40'
        }`}
      >
        {arquivo ? (
          <FileText size={18} className="text-primary shrink-0" aria-hidden />
        ) : (
          <Paperclip size={18} className="text-primary shrink-0" aria-hidden />
        )}
        <span className="flex-1 min-w-0">
          <span className="block text-xs text-text-main truncate">{arquivo ? arquivo.name : t.rotulo}</span>
          <span className="block text-xs text-text-muted">{arquivo ? `${tamanho(arquivo.size)} · ${t.trocar}` : t.dica}</span>
        </span>
        <input
          id={id}
          type="file"
          name="cv"
          required
          accept={ACCEPT_CURRICULO}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${id}-erro` : undefined}
          className="sr-only"
          onInvalid={(e) => {
            /* Sem o balão nativo: a mensagem abaixo diz o mesmo, no idioma da página. */
            e.preventDefault()
            setErro(conferirArquivoNoNavegador(e.currentTarget.files?.[0]) ?? 'ausente')
          }}
          onChange={(e) => {
            const escolhido = e.currentTarget.files?.[0] ?? null
            const motivo = conferirArquivoNoNavegador(escolhido)
            /* `setCustomValidity` é o que faz o formulário recusar o envio de um
               arquivo grande ou de outro formato, e não só mostrar o aviso. */
            e.currentTarget.setCustomValidity(motivo && motivo !== 'ausente' ? mensagens[motivo] : '')
            setErro(escolhido ? motivo : null)
            setArquivo(escolhido && !motivo ? { name: escolhido.name, size: escolhido.size } : null)
          }}
        />
      </label>
      {erro && (
        <p id={`${id}-erro`} role="alert" className="mt-1.5 text-xs text-red-500">
          {mensagens[erro]}
        </p>
      )}
    </div>
  )
}
