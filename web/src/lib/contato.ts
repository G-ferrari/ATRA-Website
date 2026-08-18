/* Dados de contato exibidos no site.
 *
 * No legado estão escritos dentro do JSX, repetidos em rodapé e CTAs
 * (`legacy/src/components/CaseDetailBase.tsx:204`). Ficam aqui em um lugar só
 * até o global `contact` existir (MIG-072) — aí este módulo passa a ser um
 * mapper e nenhum componente muda. */
export const CONTATO = {
  telefone: '+55 11 96305-2391',
  whatsapp: 'https://wa.me/5511963052391',
  email: 'negocios@atra.com.br',
  endereco: 'Av. Queiroz Filho, 1700 – Torre D Sala 802 Vila Hamburguesa – SP',
} as const
