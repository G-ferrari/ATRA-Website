import type { Locale } from '@/lib/locales'
import { hrefNoIdioma } from '@/lib/routes'
import type { Contact, Footer } from '@/payload-types'
import type { Contato, Rodape } from '@/types/content'

import { toImageOpcional } from './shared'

/* Mappers da casca do site: contato e rodapé (MIG-072).
 *
 * Os dois globals nasceram com os dados que estavam escritos em
 * `lib/contato.ts` e `lib/navegacao.ts`. Os módulos continuam existindo — o que
 * sobrou neles é cromo de interface, não conteúdo. */

/* ⚠️ Sem `??` nos obrigatórios: `phone` e `email` são `required` no global, e
 * um deles vazio significa que o seed não rodou. Cair com o campo no nome é
 * melhor do que o rodapé publicar uma linha em branco. `address` deixou de ser
 * obrigatório em 29/09 — a ATRA não tem mais endereço fixo —, e vazio vira
 * `null` para quem desenha esconder a linha. */
export function toContato(doc: Contact): Contato {
  return {
    telefone: doc.phone,
    telefoneComDdd: doc.phoneWithArea,
    whatsapp: doc.whatsapp,
    email: doc.email,
    endereco: doc.address?.trim() || null,
    redes: {
      linkedin: doc.social?.linkedin ?? null,
      instagram: doc.social?.instagram ?? null,
      facebook: doc.social?.facebook ?? null,
      youtube: doc.social?.youtube ?? null,
    },
    foto: toImageOpcional(doc.panelPhoto, 'contact.panelPhoto'),
    destinos: {
      contato: doc.formRecipients?.contact || null,
      consultores: doc.formRecipients?.consultants || null,
      diagnostico: doc.formRecipients?.diagnostic || null,
      carreiras: doc.formRecipients?.careers || null,
      chat: doc.formRecipients?.chat || null,
    },
    avisoDeCandidatura: doc.jobApplications?.privacyNotice?.trim() || null,
    avisoDoBancoDeTalentos: doc.jobApplications?.talentPoolNotice?.trim() || null,
  }
}

export function toRodape(doc: Footer, locale: Locale): Rodape {
  return {
    sobre: doc.about,
    direitos: doc.copyright,
    colunas: (doc.columns ?? []).map((c) => ({
      titulo: c.title,
      tipo: c.kind,
      /* `href` vazio vira `null`, e o componente desenha `<a href="#">` — que é
       * o que o legado faz nos 3 links legais e nas 3 soluções (D-15).
       *
       * O admin guarda o caminho português sem o idioma (`/sobre`), um só para
       * os dois. O prefixo entrava no componente e o `proxy.ts` traduzia com um
       * 308 (`/en/sobre` → `/en/about`); agora o destino sai pronto daqui. */
      links: (c.links ?? []).map((l) => ({ label: l.label, href: l.href ? hrefNoIdioma(l.href, locale) : null })),
    })),
  }
}
