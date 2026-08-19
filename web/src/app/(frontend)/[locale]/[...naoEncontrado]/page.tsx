import { notFound } from 'next/navigation'

/* Captura tudo que não casou com nenhuma rota (MIG-062).
 *
 * Sem isto, uma URL inexistente cai no `not-found` da **raiz** do app, que está
 * fora do grupo `(frontend)` — ou seja, sem a fonte, sem o tema e sem
 * cabeçalho e rodapé. O visitante recebe um 404 sem identidade nenhuma.
 *
 * Chamando `notFound()` daqui, o Next renderiza o `not-found.tsx` deste
 * segmento, que herda o layout inteiro.
 *
 * Rota específica sempre vence a curinga, então isto não sombreia nada. */
export default function NaoCasou(): never {
  notFound()
}
