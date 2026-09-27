import type { Contato, FormularioComAviso } from '@/types/content'

/* Para qual e-mail vai o aviso de um formulário.
 *
 * A ordem é: o campo do formulário no admin (Contato → Destino dos
 * formulários), depois a `reserva` quando houver, depois o e-mail geral do
 * Contato. O e-mail geral é obrigatório no global, então sempre há destino —
 * lead nenhum fica sem aviso porque um campo novo ficou vazio.
 *
 * A `reserva` existe para o diagnóstico: antes do campo, o destino dele era a
 * variável `RC18_LEAD_EMAIL` (P-29), e quem já a configurou no servidor não
 * pode perder o destino no dia em que este código entrar. O campo do admin
 * vence porque é o que o conteúdo consegue mudar. */
export function destinoDoAviso(
  contato: Pick<Contato, 'email' | 'destinos'>,
  formulario: FormularioComAviso,
  reserva?: string | null,
): string {
  return contato.destinos[formulario]?.trim() || reserva?.trim() || contato.email
}
