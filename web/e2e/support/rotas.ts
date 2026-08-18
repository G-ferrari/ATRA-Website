/** Rotas portadas com gabarito no legado. Cresce a cada rota da Fase 3. */
export const ROTAS_COM_GABARITO = [
  { nome: 'cases-listagem', caminho: '/cases-de-sucesso' },
  { nome: 'cases-detalhe', caminho: '/cases-de-sucesso/eficiencia-processos-risco' },
] as const

/* O recorte da comparação: `<main>`, não a página inteira.
 *
 * Cabeçalho e rodapé do legado ainda não existem no app novo — a casca é
 * MIG-034, no fim da Fase 2. Comparar a página inteira antes disso mede a ausência da
 * casca, não a fidelidade da rota portada, e nenhuma task de conteúdo
 * conseguiria fechar o limite. Os dois lados expõem um `<main>` como raiz da
 * página, então o recorte é o mesmo nos dois.
 *
 * ⚠️ Em MIG-034, trocar por `fullPage: true` nos dois arquivos e regravar o
 * gabarito — aí a casca passa a ser comparada também. */
export const ALVO = 'main'

/* Imagens entram mascaradas na comparação.
 *
 * O legado serve o JPEG original; o app novo serve variante responsiva
 * reencodada pelo next/image (WebP, qualidade 75, largura por viewport). Os
 * bytes divergem por projeto, não por regressão — era ~1% dos pixels, todo ele
 * dentro das imagens. Mascarar mantém no teste o que importa: posição, caixa e
 * dimensão da imagem, além de toda a tipografia e layout ao redor.
 *
 * O que o mascaramento deixa de cobrir — imagem certa no lugar certo — é
 * coberto por `smoke.spec.ts`, que confere src e alt. */
export const MASCARA = 'img'
export const COR_DA_MASCARA = '#ff00ff'
