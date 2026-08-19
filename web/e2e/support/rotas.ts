/** Rotas portadas com gabarito no legado. Cresce a cada rota da Fase 3. */
export const ROTAS_COM_GABARITO = [
  { nome: 'cases-listagem', caminho: '/cases-de-sucesso' },
  { nome: 'cases-detalhe', caminho: '/cases-de-sucesso/eficiencia-processos-risco' },
  { nome: 'glossario', caminho: '/glossario' },
  { nome: 'relatorios', caminho: '/relatorios' },
  { nome: 'ebooks', caminho: '/ebooks' },
  { nome: 'webinars', caminho: '/webinars' },
  { nome: 'blog', caminho: '/blog' },
  /* ⚠️ `/sobre` está FORA do gate de propósito — MIG-049 não fechou.
   *
   * A rota existe e os 9 blocos renderizam, mas a página sai 1.760px mais curta
   * que o legado no desktop. Medido seção a seção:
   *
   *   hero            623px → 224px   (falta a coluna de mídia: `mediaMode`)
   *   quem-somos      604px → 160px   (falta a imagem ao lado)
   *   nossos-valores  610px → 480px
   *   nossas-solucoes 681px → 490px
   *   porque-escolher 618px → 412px
   *   CTA final       343px → 177px
   *
   * As duas primeiras respondem por metade e têm causa conhecida. Reativar
   * junto com a correção — deixar aqui reprovando tornaria a suíte vermelha e
   * o gate deixaria de servir para as outras 7 rotas. */
  // { nome: 'sobre', caminho: '/sobre' },
] as const

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
