import { useEffect, useRef } from 'react'

import { rastrear, type EventoDeRastreio } from './rastreio'

/* MIG-156 (D-30) — rastreia a transição para o sucesso de um formulário.
 *
 * Hook e não chamada solta porque o sucesso é **estado**, não evento: o
 * componente re-renderiza com `estado.ok` verdadeiro em todo render seguinte,
 * e sem a trava um `form_submit` viraria dezenas. `rastrear` já é no-op sem
 * consentimento — quem usa este hook não confere nada. */
export function useRastrearEnvio(
  sucesso: boolean,
  evento: EventoDeRastreio,
  params?: Record<string, string | number | boolean>,
): void {
  const ja = useRef(false)
  useEffect(() => {
    if (!sucesso || ja.current) return
    ja.current = true
    rastrear(evento, params)
  }, [sucesso, evento, params])
}
