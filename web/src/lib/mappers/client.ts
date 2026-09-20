import type { Client, Testimonial } from '@/payload-types'
import type { Depoimento, LogoDeCliente } from '@/types/content'

import { toImage, toImageOpcional } from './shared'

/* Documento do Payload → apresentação, para as duas collections que a home
 * consome direto: `clients` e `testimonials`. */

export function toLogoDeCliente(doc: Client): LogoDeCliente {
  return {
    name: doc.name,
    /* ⚠️ Aqui o logo **derruba** se não estiver populado, ao contrário da
     * vitrine de parceiros: o cliente é só nome e logo, e sem a imagem sobra
     * uma caixa branca vazia na esteira — pior que a página avisar. */
    logo: toImage(doc.logo, 'clients.logo'),
    enlarge: Boolean(doc.enlarge),
  }
}

export function toDepoimento(doc: Testimonial): Depoimento {
  return {
    quote: doc.quote,
    company: doc.company,
    authorName: doc.authorName?.trim() ? doc.authorName : null,
    authorRole: doc.authorRole,
    // D-14: sem foto o site mostra as iniciais, e é o caso dos 4 da home.
    photo: toImageOpcional(doc.photo, 'testimonials.photo'),
  }
}
