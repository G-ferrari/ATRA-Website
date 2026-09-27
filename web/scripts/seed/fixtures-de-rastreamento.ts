/* Os ids de teste do global `tracking` (D-40), num arquivo sem efeito colateral
 * para o e2e poder importar — o `rastreamento.ts` ao lado grava no banco ao ser
 * carregado. Nenhum dos dois existe de verdade: o e2e intercepta os scripts
 * antes de qualquer pedido sair para o Google ou para a Lusha. */
export const GTM_ID_DE_TESTE = 'GTM-E2ETESTE'
export const LUSHA_SITE_ID_DE_TESTE = '00000000-0000-4000-8000-00000000e2e0'
