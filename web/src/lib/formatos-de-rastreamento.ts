/* O formato dos ids de rastreamento do global `tracking` (D-40).
 *
 * ⚠️ Não é capricho de validação. O id do GTM vai para a URL de um script e o
 * da Lusha para a chamada que o script dela faz: quem edita esses campos
 * decide que código roda no site. Por isso o formato é fechado aqui, e o
 * mesmo teste vale duas vezes — no admin, para o editor ver o erro ao salvar,
 * e no mapper, para um valor que entrou por outro caminho (banco editado à
 * mão, variável de ambiente) não chegar à página. */

/** `GTM-` seguido de letras maiúsculas e dígitos — o formato do Tag Manager. */
export const ehGtmId = (valor: string): boolean => /^GTM-[A-Z0-9]{4,12}$/.test(valor)

/** O `siteId` do painel Website Visitors da Lusha é um UUID. */
export const ehLushaSiteId = (valor: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valor)
