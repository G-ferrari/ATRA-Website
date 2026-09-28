/* Cromo da casca do site: o que a interface diz, não o que a ATRA publica.
 *
 * O conteúdo saiu daqui — o menu virou o global `navigation` (MIG-072a), o
 * rodapé e as redes viraram `footer` e `contact` (MIG-072), e o logo virou
 * mídia do CMS (MIG-073). O que sobrou é rótulo de botão, `alt` de imagem e
 * texto de acessibilidade: string que muda com o código, não com a campanha, e
 * que um editor de marketing não vai procurar no admin.
 *
 * ⚠️ Saiu junto a lista `CATEGORIAS`, que **ninguém importava** desde que
 * MIG-072a passou o menu a ler o global. Ficou de pé um mês parecendo a fonte
 * dos sete itens do topo. */
export const TEXTOS_CASCA = {
  pt: {
    menu: 'Menu',
    faleConosco: 'Fale Conosco',
    whatsapp: 'Falar no WhatsApp',
    fecharMenu: 'Fechar menu',
    abrirMenu: 'Abrir menu',
    logo: 'ATRA Logo',
    areaRestrita: 'Área Restrita',
    alternarTema: 'Alternar tema',
  },
  en: {
    menu: 'Menu',
    faleConosco: 'Contact Us',
    whatsapp: 'Chat on WhatsApp',
    fecharMenu: 'Close menu',
    abrirMenu: 'Open menu',
    logo: 'ATRA Logo',
    areaRestrita: 'Restricted Area',
    alternarTema: 'Toggle theme',
  },
} as const
