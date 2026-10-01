import type { GlobalConfig } from 'payload'

import { isAdmin, isPublic } from '@/access'
import { ehGtmId, ehLushaSiteId } from '@/lib/formatos-de-rastreamento'

/* Os ids dos scripts de rastreamento (D-40): Google Tag Manager e Lusha.
 *
 * ⚠️ Só **admin** edita. Trocar o id do container é trocar o código que roda
 * em toda página do site — o GTM injeta o que estiver configurado nele —, e
 * isso não é decisão de editor de conteúdo. O editor vê os valores, não muda.
 *
 * ⚠️ Preencher aqui **não carrega nada sozinho**. Cada script espera o aceite
 * da sua categoria no aviso de cookies (D-30): o GTM, estatística; a Lusha,
 * marketing. Sem `bannerMessage` no `cookie-consent` não há aviso, ninguém
 * aceita, e os dois seguem fora do DOM.
 *
 * Sem `localized`: o id é o mesmo nos dois idiomas, e o site lê o global sem
 * `locale`. */

/* Colar do painel costuma trazer espaço nas pontas; aparado antes de validar,
 * o que se grava é o id limpo. */
const aparar = ({ value }: { value?: unknown }) => (typeof value === 'string' ? value.trim() : value)

export const Tracking: GlobalConfig = {
  slug: 'tracking',
  label: { pt: 'Rastreamento', en: 'Tracking' },
  admin: {
    group: { pt: 'Sistema', en: 'System' },
    description: {
      pt: 'Ids do Google Tag Manager e da Lusha. Só administradores editam. Nada carrega sem o aceite do visitante no aviso de cookies.',
      en: 'Google Tag Manager and Lusha ids. Admins only. Nothing loads until the visitor accepts in the cookie notice.',
    },
  },
  access: { read: isPublic, update: isAdmin },
  fields: [
    {
      name: 'gtmId',
      type: 'text',
      label: { pt: 'ID do Google Tag Manager', en: 'Google Tag Manager ID' },
      admin: {
        placeholder: 'GTM-XXXXXXX',
        description: {
          pt: 'O container do Tag Manager, no formato GTM-XXXXXXX. Carrega só para quem aceitar "estatística". Vazio: nenhum script do Google entra no site.',
          en: 'The Tag Manager container, as GTM-XXXXXXX. Loads only for visitors who accept "analytics". Empty: no Google script on the site.',
        },
      },
      hooks: { beforeValidate: [aparar] },
      validate: (valor: string | null | undefined) =>
        !valor || ehGtmId(valor) || 'Use o formato GTM-XXXXXXX (letras maiúsculas e números).',
    },
    {
      name: 'lushaSiteId',
      type: 'text',
      label: { pt: 'ID do site na Lusha', en: 'Lusha site ID' },
      admin: {
        placeholder: '00000000-0000-0000-0000-000000000000',
        description: {
          pt: 'O siteId do painel Website Visitors da Lusha. Carrega só para quem aceitar "marketing". Vazio: a Lusha não entra no site.',
          en: 'The siteId from Lusha’s Website Visitors dashboard. Loads only for visitors who accept "marketing". Empty: Lusha stays off the site.',
        },
      },
      hooks: { beforeValidate: [aparar] },
      validate: (valor: string | null | undefined) =>
        !valor || ehLushaSiteId(valor) || 'Cole o siteId do painel da Lusha (8-4-4-4-12 caracteres).',
    },
  ],
}
