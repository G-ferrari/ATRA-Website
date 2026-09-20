import { cache } from 'react'

import { toContato } from './mappers/site'
import { getPayload } from './payload'
import type { Contato } from '@/types/content'

/* Dados de contato exibidos no site, do global `contact` (MIG-072).
 *
 * Este módulo era a lista escrita à mão, até o global existir — e agora é o que
 * o comentário anterior prometia: um leitor e um mapper, sem componente nenhum
 * mudando de forma.
 *
 * ⚠️ Quem chama é **página ou layout**, nunca componente (regra 4). Os blocos de
 * CTA recebem o contato por injeção em `resolverPagina`, do mesmo jeito que as
 * vagas e os logos de cliente.
 *
 * `cache()` por requisição: uma página com rodapé e CTA de contato pediria o
 * mesmo global duas vezes. */
export const lerContato = cache(async (): Promise<Contato> => {
  const payload = await getPayload()
  /* Sem `locale`: o global não é localizado — telefone e endereço são os mesmos
   * nos dois idiomas. */
  return toContato(await payload.findGlobal({ slug: 'contact', depth: 0 }))
})
