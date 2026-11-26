'use client'

import { useId, useState } from 'react'

import { perfilDoLinkedin } from '@/lib/banco-de-talentos'
import type { Locale } from '@/lib/locales'

/* O LinkedIn obrigatório do Banco de Talentos (26/11, pedido do RH).
 *
 * `type="text"` e não `url`: o candidato cola `linkedin.com/in/fulano`, sem o
 * `https://`, e o `type="url"` recusaria — a regra de verdade é a de
 * `perfilDoLinkedin`, a mesma que a action confere. Sem JavaScript, o
 * `required` nativo segura o campo vazio e a action responde o resto.
 *
 * Com JavaScript, a mensagem sai **na página**, no idioma dela, em vez do
 * balão do navegador: `onInvalid` cancela o balão, e `setCustomValidity` faz o
 * formulário recusar o envio de um endereço que não é perfil do LinkedIn —
 * sem isso, o aviso apareceria e o envio seguiria. */

const TEXTOS = {
  pt: {
    placeholder: 'LinkedIn (linkedin.com/in/seu-perfil) *',
    vazio: 'Informe o link do seu perfil no LinkedIn.',
    invalido: 'Use o link do seu perfil, como linkedin.com/in/seu-perfil.',
  },
  en: {
    placeholder: 'LinkedIn (linkedin.com/in/your-profile) *',
    vazio: 'Please enter your LinkedIn profile link.',
    invalido: 'Use your profile link, such as linkedin.com/in/your-profile.',
  },
  es: {
    placeholder: 'LinkedIn (linkedin.com/in/su-perfil) *',
    vazio: 'Ingrese el enlace de su perfil de LinkedIn.',
    invalido: 'Use el enlace de su perfil, como linkedin.com/in/su-perfil.',
  },
} as const

export function CampoDoLinkedin({ locale, className }: { locale: Locale; className: string }) {
  const t = TEXTOS[locale]
  const id = useId()
  const [erro, setErro] = useState<string | null>(null)

  /** A mensagem do valor, ou vazio quando ele serve. */
  const conferir = (valor: string) => (!valor.trim() ? t.vazio : perfilDoLinkedin(valor) ? '' : t.invalido)

  return (
    <div>
      <input
        type="text"
        name="linkedin"
        inputMode="url"
        autoComplete="url"
        placeholder={t.placeholder}
        aria-label={t.placeholder}
        required
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`${className} ${erro ? 'ring-1 ring-red-500' : ''}`}
        onInvalid={(e) => {
          e.preventDefault()
          setErro(conferir(e.currentTarget.value) || t.vazio)
        }}
        onChange={(e) => {
          const mensagem = conferir(e.currentTarget.value)
          e.currentTarget.setCustomValidity(mensagem)
          /* Corrige ao vivo o aviso que já está na tela; não acusa enquanto a
             pessoa ainda digita pela primeira vez. */
          if (erro) setErro(mensagem || null)
        }}
        onBlur={(e) => {
          const valor = e.currentTarget.value
          if (valor.trim()) setErro(conferir(valor) || null)
        }}
      />
      {erro && (
        <p id={`${id}-erro`} role="alert" className="mt-1.5 text-xs text-red-500">
          {erro}
        </p>
      )}
    </div>
  )
}
