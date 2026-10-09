import type { GlobalConfig } from 'payload'

import { isAdmin, isPublic } from '@/access'
import { ehGtmId, ehLushaSiteId, ehRdStationLoaderId } from '@/lib/formatos-de-rastreamento'

/* Os ids dos scripts de rastreamento (D-40): Google Tag Manager e Lusha — e,
 * desde a D-54, o script de monitoramento do RD Station Marketing.
 *
 * ⚠️ Só **admin** edita. Trocar o id do container é trocar o código que roda
 * em toda página do site — o GTM injeta o que estiver configurado nele —, e
 * isso não é decisão de editor de conteúdo. O editor vê os valores, não muda.
 *
 * ⚠️ Preencher aqui **não carrega nada sozinho**. Cada script espera o aceite
 * da sua categoria no aviso de cookies (D-30): o GTM, estatística; a Lusha e
 * o RD Station, marketing. Sem `bannerMessage` no `cookie-consent` não há aviso, ninguém
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
      pt: 'Ids do Google Tag Manager, da Lusha e do RD Station Marketing. Só administradores editam. Nada carrega sem o aceite do visitante no aviso de cookies.',
      en: 'Google Tag Manager, Lusha and RD Station Marketing ids. Admins only. Nothing loads until the visitor accepts in the cookie notice.',
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
    {
      /* D-54 — o "código de monitoramento" do RD Station Marketing. O que o RD
       * manda colar é um `<script src=".../loader-scripts/<uuid>-loader.js">`;
       * o campo guarda só o uuid, e o componente monta a URL. Colar a tag
       * inteira reprova. */
      name: 'rdStationLoaderId',
      type: 'text',
      label: { pt: 'ID do monitoramento do RD Station Marketing', en: 'RD Station Marketing tracking ID' },
      admin: {
        placeholder: '00000000-0000-0000-0000-000000000000',
        description: {
          pt: 'Só o código entre "loader-scripts/" e "-loader.js" no script que o RD fornece. Carrega só para quem aceitar "marketing". Vazio: o RD não rastreia visitas no site (os leads dos formulários vão do mesmo jeito).',
          en: 'Only the code between "loader-scripts/" and "-loader.js" in the script RD provides. Loads only for visitors who accept "marketing". Empty: RD does not track visits (form leads are still sent).',
        },
      },
      hooks: { beforeValidate: [aparar] },
      validate: (valor: string | null | undefined) =>
        !valor ||
        ehRdStationLoaderId(valor) ||
        'Cole só o código do script (8-4-4-4-12 caracteres), não a tag <script> inteira.',
    },
  ],
}
