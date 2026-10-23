'use client'

import { usePathname } from 'next/navigation'
import { memo, useEffect, useId, useRef } from 'react'

import { CAMPO_ISCA } from '@/lib/anti-spam'
import { CHAVES_UTM, lerUtmGuardado, type ChaveUtm } from '@/lib/utm'

/* Os campos escondidos de todo formulário do site: a página de origem, o
 * carimbo de tempo, a campanha (UTM) e a isca. Saíram de `Formulario` para a
 * seção "Formulário" (task 051) usar os mesmos — o anti-spam e a atribuição
 * não podem ter duas versões.
 *
 * ⚠️ Vêm **antes** dos campos de verdade: ver a nota do `space-y` em
 * `formulario.tsx`. Um fragmento, não um invólucro, para o HTML dos
 * formulários de antes continuar o mesmo — menos o `id` da isca (abaixo).
 *
 * ⚠️ `memo`, e sem props: o carimbo e a UTM são escritos no DOM pelo efeito, e
 * qualquer re-render reaplicaria o `defaultValue` (`"0"`, `""`) — em campo
 * escondido, valor e valor padrão são o mesmo atributo. O `useActionState` do
 * formulário re-renderiza a cada envio, e sem isto o segundo envio (depois de
 * um erro) saía sem campanha e sem carimbo. */
export const CamposOcultos = memo(function CamposOcultos() {
  /* De onde o lead veio sai daqui, e não de uma prop: o mesmo bloco de contato
   * é desenhado na home e em `/contato`, e quem monta o bloco não sabe em qual
   * página está. */
  const caminho = usePathname()

  /* ⚠️ O carimbo é marcado **depois da montagem**, não durante o render.
   *
   * `Date.now()` no corpo do componente é função impura, e o React avisa: o
   * valor mudaria a cada re-render e o HTML do servidor não bateria com o do
   * cliente. Em efeito, o servidor manda `0` — que `conferir` trata como
   * "sem carimbo" e deixa passar, que é justamente o comportamento desejado
   * para quem está com JavaScript desligado.
   *
   * Escrito no DOM por `ref`, e não por `setState`: efeito existe para
   * sincronizar com sistema externo, e `setState` dentro dele dispara um render
   * em cascata que o lint recusa — com razão, já que ninguém precisa
   * re-renderizar por causa de um campo escondido. */
  const carimbo = useRef<HTMLInputElement>(null)

  /* A atribuição de campanha vem da sessão, guardada na chegada por
   * `CapturaDeUtm` — ver a nota no topo de `lib/utm.ts` sobre por que ela não
   * pode ser lida da URL do envio. Preenchida por `ref` pelo mesmo motivo do
   * carimbo: `sessionStorage` não existe no servidor, e ler durante o render
   * faria o HTML dos dois lados divergir. */
  const utm = useRef<HTMLInputElement[]>([])

  /* O `id` da isca é por formulário: com o contato e a seção "Formulário" na
     mesma página, um `id` fixo se repetiria. O `name` é o que o servidor lê. */
  const idDaIsca = useId()

  useEffect(() => {
    if (carimbo.current) carimbo.current.value = String(Date.now())

    const guardado = lerUtmGuardado()
    for (const campo of utm.current) campo.value = guardado[campo.name as ChaveUtm] ?? ''
  }, [])

  return (
    <>
      <input type="hidden" name="source" value={caminho ?? ''} />
      {/* Carimbo de quando a página montou: a armadilha de tempo de MIG-101. */}
      <input ref={carimbo} type="hidden" name="carimbo" defaultValue="0" />

      {/* Campanha de origem (D-26). Vazios quando não houve UTM na chegada ou
          quando o visitante está sem JavaScript — o lead entra do mesmo jeito,
          só sem atribuição. */}
      {CHAVES_UTM.map((chave, i) => (
        <input
          key={chave}
          ref={(el) => {
            if (el) utm.current[i] = el
          }}
          type="hidden"
          name={chave}
          defaultValue=""
        />
      ))}

      {/* ⚠️ Campo isca. Escondido por CSS e **não** por `type="hidden"`: robô
          que lê o HTML pula campo oculto declarado, e o que preenche às cegas
          cai aqui. `aria-hidden` e `tabIndex={-1}` mantêm quem navega por
          teclado ou leitor de tela longe dele. */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={idDaIsca}>Não preencha este campo</label>
        <input id={idDaIsca} name={CAMPO_ISCA} type="text" tabIndex={-1} autoComplete="off" />
      </div>
    </>
  )
})
