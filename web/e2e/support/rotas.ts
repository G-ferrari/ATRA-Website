/** Rotas portadas com gabarito no legado. Cresce a cada rota da Fase 3. */
export const ROTAS_COM_GABARITO = [
  { nome: 'home', caminho: '/' },
  { nome: 'cases-listagem', caminho: '/cases-de-sucesso' },
  { nome: 'cases-detalhe', caminho: '/cases-de-sucesso/eficiencia-processos-risco' },
  { nome: 'glossario', caminho: '/glossario' },
  { nome: 'relatorios', caminho: '/relatorios' },
  { nome: 'ebooks', caminho: '/ebooks' },
  { nome: 'webinars', caminho: '/webinars' },
  { nome: 'blog', caminho: '/blog' },
  { nome: 'sobre', caminho: '/sobre' },
  /* Entrou tarde: MIG-052 fechou /consultores sem gabarito, e 57% da página
     estava faltando sem ninguém ver. Ver a nota no topo de `consultores/page.tsx`. */
  { nome: 'consultores', caminho: '/consultores' },
  /* Pelo mesmo motivo: MIG-050 fechou /carreiras com quatro das sete seções, e
     sem gabarito ninguém viu os 4.428px que faltavam. Ver `seed/carreiras.ts`. */
  { nome: 'carreiras', caminho: '/carreiras' },
  /* `/solucoes` (o índice) fica **fora**: D-09 mudou o comportamento da rota e
     não há gabarito — o legado serve ali a página de IA. É esta que compara. */
  { nome: 'solucao-detalhe', caminho: '/solucoes/inteligencia-artificial' },
  /* Terceira rota que MIG-054 fechou sem gabarito, e a terceira a sair curta —
     38%, neste caso. Ver a nota no topo de `seed/parceiros.ts`. */
  { nome: 'parceiro-detalhe', caminho: '/parceiros/google-cloud' },
  { nome: 'insights', caminho: '/insights' },
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
/* ⚠️ O `canvas` entra na máscara junto com as imagens, e por um motivo
 * diferente: ele **não é reproduzível**, nem contra si mesmo.
 *
 * O campo de partículas do herói da home é redesenhado a cada `resize`, e a
 * altura do canvas sai de `container.clientHeight` — um inteiro arredondado de
 * uma altura fracionária. Medindo a mesma página duas vezes no mesmo viewport,
 * a altura alterna entre 1217 e 1218px, e 1px de diferença muda a posição de
 * todas as 60 partículas. O Playwright desistia com "failed to take two
 * consecutive stable screenshots" e ~14.700 pixels de diferença entre um quadro
 * e o seguinte — no **legado**, capturando o próprio gabarito.
 *
 * Mascarado, o teste continua conferindo o que importa: a caixa do canvas, e
 * portanto a altura do herói e a posição de tudo em volta. O que sai da
 * comparação — o desenho das partículas e a reação ao ponteiro — é coberto por
 * `smoke.spec.ts`, que mede o canvas e move o mouse sobre ele.
 *
 * `reiniciarAleatorio()` (em `lib/e2e.ts` dos dois apps) continua valendo: sem
 * ele o `?e2e=1` não congela nada, e um dia o canvas pode voltar à comparação. */
export const MASCARA = 'img, canvas'
export const COR_DA_MASCARA = '#ff00ff'
