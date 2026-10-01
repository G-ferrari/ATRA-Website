/** Rotas portadas com gabarito no legado. Cresceu a cada rota da Fase 3.
 *
 * ⚠️ Desde 27/09 (D-39) a comparação com o gabarito só roda com
 * `PARIDADE_COM_PROTOTIPO=1` — ver `playwright.config.ts`. A lista continua
 * valendo na suíte padrão: é dela que `contraste.spec.ts` e o axe tiram as
 * rotas que medem, e o nome ficou do tempo em que era só do gate. */
export const ROTAS_COM_GABARITO = [
  { nome: 'home', caminho: '/' },
  { nome: 'cases-listagem', caminho: '/cases-de-sucesso' },
  { nome: 'cases-detalhe', caminho: '/cases-de-sucesso/eficiencia-processos-risco' },
  /* `/glossario` **saiu** em 26/09 (D-36): a rota responde 404 enquanto o
     glossário estiver escondido. `smoke.spec.ts` confere o 404. */
  // O nome fica (é o do arquivo de gabarito); o endereço mudou em 01/10.
  { nome: 'relatorios', caminho: '/atra-na-midia' },
  { nome: 'ebooks', caminho: '/ebooks' },
  { nome: 'webinars', caminho: '/webinars' },
  /* `/blog` **saiu** na Fase 4b, e `/carreiras` junto. As duas listam conteúdo,
     e o conteúdo virou real: MIG-083 importou 207 artigos do WordPress no lugar
     dos 6 fictícios, e MIG-085 trouxe as 7 vagas no lugar das 6. O gabarito é
     uma captura do protótipo mostrando as fixtures — nenhuma captura dele pode
     voltar a bater, porque o protótipo nunca vai ter esse conteúdo.

     Regravar o gabarito seria pior do que remover: o comando existe, mas
     apagaria a evidência de regressão do resto das duas páginas de uma vez, e o
     novo gabarito compararia o app contra ele mesmo. As duas continuam cobertas
     por `smoke.spec.ts` — respondem 200, o artigo e a vaga levam a um detalhe
     que existe, e artigo com corpo é indexável. */
  { nome: 'sobre', caminho: '/sobre' },
  /* `/consultores` **saiu** em 24/09 (D-34), e por um motivo diferente do de
     `/blog`: não é o conteúdo que mudou, é o desenho. De 21 a 23/09 a página
     recebeu seis mudanças pedidas pelo dono — o prazo de 48h saiu, a chamada
     "Não encontrou…" foi para os diferenciais, o pedido virou uma aba, as tags
     recolhem — e nenhuma delas existe no protótipo. Um gabarito que mostra o
     desenho antigo não reprova regressão: reprova a decisão.

     A alternativa, capturar o próprio app e chamar de gabarito, foi recusada
     por G-ferrari em 24/09 — é o espelho que a estratégia de testes descreve
     ("prova que o código não mudou, não que está certo").

     O que cobre a rota agora: `consultores.spec.ts` (filtro nos dois modos,
     carrinho, aba e envio) e `smoke.spec.ts`. */
  /* `/solucoes` (o índice) fica **fora**: D-09 mudou o comportamento da rota e
     não há gabarito — o legado serve ali a página de IA. É esta que compara. */
  { nome: 'solucao-detalhe', caminho: '/solucoes/inteligencia-artificial' },
  /* Terceira rota que MIG-054 fechou sem gabarito, e a terceira a sair curta —
     38%, neste caso. Ver a nota no topo de `seed/parceiros.ts`. */
  { nome: 'parceiro-detalhe', caminho: '/parceiros/google-cloud' },
  { nome: 'insights', caminho: '/insights' },
  { nome: 'chat', caminho: '/chat' },
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
/* `[data-mascara]` marca o que **substitui** uma imagem do gabarito por outra
 * coisa, por decisão registrada. Hoje é só o monograma de depoimento: D-14
 * descartou os 4 retratos de banco de imagens que o legado usa para representar
 * pessoas reais de ABC Brasil e Banco Carrefour, e pôs as iniciais no lugar. A
 * caixa é a mesma; o conteúdo é que muda, de propósito.
 *
 * ⚠️ A máscara **ignora opacidade**: os quatro depoimentos ficam empilhados na
 * mesma célula e os três invisíveis também são pintados. É o que faz a mancha
 * magenta dos dois lados ter o mesmo formato irregular. */
export const MASCARA = 'img, canvas, [data-mascara]'
export const COR_DA_MASCARA = '#ff00ff'
