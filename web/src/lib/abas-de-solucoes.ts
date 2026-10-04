/* As abas do menu de Soluções (D-52) — a ordem e o nome de cada uma, num lugar
 * só. Leem daqui o `select` da collection, o mega-menu, o índice `/solucoes` e
 * o painel de conversão.
 *
 * ⚠️ O `id` é o valor gravado em `solutions.category`, e três deles são de
 * antes da D-52: ficaram porque renomear valor de enum é migração destrutiva.
 * Não leia o `id` como descrição — `governance-culture` é "Governança &
 * FinOps".
 *
 * `rc18` não é aba (D-37): a RC18 tem página, mas se chega a ela pela página de
 * Bancos e pelo destaque da home.
 *
 * Aba nova: uma linha aqui, o campo de cases em `globals/ConversionPanel.ts` e
 * a migração aditiva do enum (`pnpm payload migrate:create`). */
export const ABAS_DE_SOLUCOES = [
  { id: 'innovation-ai', pt: 'IA & Analytics Avançada', en: 'AI & Advanced Analytics' },
  { id: 'data-bi', pt: 'Dados & Cloud', en: 'Data & Cloud' },
  { id: 'governance-culture', pt: 'Governança & FinOps', en: 'Governance & FinOps' },
  { id: 'specialized-services', pt: 'Serviços Especializados', en: 'Specialized Services' },
] as const

export type AbaDeSolucoes = (typeof ABAS_DE_SOLUCOES)[number]['id']
