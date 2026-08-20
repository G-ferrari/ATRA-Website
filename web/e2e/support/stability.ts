import type { Page } from '@playwright/test'

/* Estabilização de captura.
 *
 * Sem isto a regressão visual vira ruído e é ignorada em duas semanas: o site
 * tem carrossel girando a cada 5s, contador animado, 39 imagens do Unsplash e
 * animação de entrada em 24 arquivos.
 *
 * Ver docs/03-plano/estrategia-de-testes.md. */

/** PNG 1×1, servido no lugar de qualquer imagem remota. */
const PLACEHOLDER = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

const REMOTE_IMAGES = [
  '**/images.unsplash.com/**',
  '**/picsum.photos/**',
  '**/www.atra.com.br/wp-content/**',
  /* O logo do Google Cloud na página de parceiro vem do CDN do próprio Google
     (`PartnerGoogleCloud.tsx:50`). Mesma razão do resto: a altura é fixa e a
     largura sai do aspecto, então o arquivo real e o marcador medem caixas
     diferentes — e a máscara cobre justamente essa caixa. */
  '**/www.gstatic.com/**',
  /* A mídia do app novo, pelo mesmo motivo dos outros: onde a largura sai do
   * aspecto do arquivo (logos com `w-auto`), o legado recebe o marcador 1×1 e
   * o app novo precisa receber o mesmo, ou os dois medem caixas diferentes.
   *
   * ⚠️ O caminho é `/api/media/file/...`, servido pelo próprio Next — **não** o
   * endereço do MinIO. Stubbar `localhost:9000` não pegava nada, e o sintoma
   * foi a vitrine de parceiros ficar 144px mais alta no mobile: os SVGs reais
   * ocupavam mais largura e quebravam em mais linhas. */
  '**/api/media/file/**',
  /* E a mídia **local** do legado, que o Vite serve de `/src/assets/images/`.
   *
   * ⚠️ Não é simetria opcional. O selo LIPT da faixa de premiações é o único
   * dos três que vem de arquivo local; os outros dois são hotlink do WordPress
   * e já caíam aqui. Sem esta linha o legado desenhava o selo em 75×102 e o app
   * novo, com a mídia stubbada, um ponto de 1×1 — 7.473 pixels de divergência
   * numa caixa que a máscara devia ter igualado dos dois lados. */
  '**/src/assets/images/**',
]

/** Neutraliza o que muda entre execuções sem o código ter mudado. */
export async function stabilize(page: Page) {
  // Imagem remota é a maior fonte de instabilidade: muda de conteúdo, de
  // tamanho e de tempo de resposta.
  for (const pattern of REMOTE_IMAGES) {
    await page.route(pattern, (route) => {
      /* ⚠️ Só requisição de **imagem**. O legado importa os assets locais como
       * módulo (`import lipt from '@/assets/images/lipt-2026.png'`), e o Vite
       * serve esse import pelo mesmo caminho: devolver um PNG ali quebra o
       * bundle e a home do legado renderiza vazia. Foi o que aconteceu quando o
       * padrão entrou sem esta guarda. */
      if (route.request().resourceType() !== 'image') return route.continue()
      return route.fulfill({ status: 200, contentType: 'image/png', body: PLACEHOLDER })
    })
  }

  /* Relógio fixo só para Date — data renderizada deixa de variar.
   *
   * ⚠️ Não trocar por `clock.install()` + `pauseAt()`: congelar os timers da
   * página trava o React (efeitos que dependem de setTimeout nunca resolvem) e
   * a suíte estoura em 30s. Testado. A rotação do hero e os carrosséis do
   * legado precisam ser congelados no app, por flag — ver MIG-030. */
  await page.clock.setFixedTime(new Date('2026-01-01T12:00:00Z'))

  /* ⚠️ Anexar em `document.head`, não em `documentElement`.
   *
   * Um <style> filho direto de <html> some quando o parser monta head/body: o
   * documento fica com uma única folha (a do Vite) e a regra nunca vale.
   * Verificado — era o caso aqui, e por isso o menu fixo aparecia no gabarito
   * mesmo com a regra escrita. */
  await page.addInitScript(() => {
    const CSS = `
    /* Indicador de dev do Next: existe só no app novo e não no legado. */
    nextjs-portal{display:none !important;}
    *,*::before,*::after{
      animation-duration:0s !important; animation-delay:0s !important;
      animation-iteration-count:1 !important;
      transition-duration:0s !important; transition-delay:0s !important;
      scroll-behavior:auto !important;
      /* ⚠️ Sem isto o carrossel de cases se re-encaixa entre uma captura e a
         seguinte: o snap-mandatory reage a mudança de layout mexendo no
         scrollLeft, e o cartão anda alguns pixels — o suficiente para o
         Playwright desistir de estabilizar a home no tablet, com a faixa
         vermelha do diff exatamente nas duas bordas do cartão.
         (Sem crase neste comentário: ele vive dentro de um template literal.) */
      scroll-snap-type:none !important;
    }`
    /* IntersectionObserver que dispara na hora.
     *
     * Os dois apps animam a entrada dos cards com `whileInView`: 20px de
     * deslocamento e opacidade, disparados quando o elemento entra na viewport.
     * Se o observer não disparar antes da captura, o card fica no estado
     * **inicial** — 20px abaixo e transparente.
     *
     * Isso é uma corrida, e cada lado corre sozinho: a mesma suíte alternava
     * entre passar e reprovar com 20px de diferença em toda a grade, sem
     * nenhuma mudança de código. Não adianta esperar mais: o disparo depende de
     * hidratação, que varia com carga da máquina.
     *
     * Aqui o elemento observado é reportado como visível imediatamente.
     * Combinado com `reducedMotion: 'reduce'` do contexto, o framer-motion pula
     * direto para o estado final — determinístico dos dois lados.
     *
     * ⚠️ Âncoras ficam de fora. O router do Next também usa IntersectionObserver,
     * para pré-carregar `<Link>` que entra na viewport: reportar todas como
     * visíveis dispara o prefetch de todas as rotas de uma vez e o
     * `networkidle` nunca chega — a suíte inteira estourava em timeout. O
     * framer observa a `div` do card, o Next observa o `<a>`; o tipo do
     * elemento separa os dois. Não pré-carregar também deixa a captura mais
     * previsível. */
    window.IntersectionObserver = class {
      private readonly cb: IntersectionObserverCallback
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb
      }
      observe(alvo: Element) {
        if (alvo.tagName === 'A') return
        const entrada = {
          isIntersecting: true,
          intersectionRatio: 1,
          target: alvo,
          time: 0,
          boundingClientRect: alvo.getBoundingClientRect(),
          intersectionRect: alvo.getBoundingClientRect(),
          rootBounds: null,
        } as IntersectionObserverEntry
        // Fora da pilha atual: o framer registra o callback antes de montar.
        setTimeout(() => this.cb([entrada], this as unknown as IntersectionObserver), 0)
      }
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return []
      }
      root = null
      rootMargin = ''
      thresholds = [] as readonly number[]
    } as unknown as typeof window.IntersectionObserver

    const aplicar = () => {
      if (document.getElementById('e2e-estabilizacao')) return
      const style = document.createElement('style')
      style.id = 'e2e-estabilizacao'
      style.textContent = CSS
      document.head.appendChild(style)
    }
    if (document.head) aplicar()
    document.addEventListener('DOMContentLoaded', aplicar, { once: true })
  })
}

/** Espera a página assentar: lazy images carregadas, fontes prontas, tudo
 *  decodificado. A ordem importa. */
export async function settle(page: Page) {
  // 1. Rolar PRIMEIRO. Imagem com loading="lazy" fora do viewport nunca
  //    completa, e decode() nela fica pendente para sempre — foi o que
  //    travava a suíte em 30s. Rolar também dispara IntersectionObserver
  //    (contadores, animações de entrada).
  //    O laço fica do lado do Playwright: setTimeout dentro da página é
  //    frágil quando o relógio está congelado.
  const altura = await page.evaluate(() => document.body.scrollHeight)
  const passo = page.viewportSize()?.height ?? 800
  for (let y = 0; y < altura; y += passo) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(80)
  }
  await page.evaluate(() => window.scrollTo(0, 0))

  await page.waitForLoadState('networkidle').catch(() => {})
  await page.evaluate(() => document.fonts.ready)

  // 2. Decodificar o que sobrou, com teto de tempo: uma imagem que nunca
  //    resolve não pode derrubar a suíte inteira.
  await page.evaluate(async () => {
    const pendentes = [...document.images]
      .filter((i) => !i.complete)
      .map((i) => i.decode().catch(() => {}))
    await Promise.race([
      Promise.all(pendentes),
      new Promise((r) => setTimeout(r, 3000)),
    ])
  })

  /* 3. Esperar a **altura parar de mudar**.
   *
   * ⚠️ `networkidle` + fontes + `decode()` não bastam. Medindo a home do legado
   * a 768px, a página continuava crescendo depois disso: 10.791 → 10.851 →
   * 10.877px em ~1,6s, e só então parava. O `toHaveScreenshot` tira as duas
   * capturas com 100ms de intervalo, pegava a página no meio do crescimento, e
   * desistia com "failed to take two consecutive stable screenshots" e ~14.700
   * pixels de diferença — capturando o gabarito contra ele mesmo.
   *
   * Esperar altura repetida três vezes é mais barato e mais confiável que um
   * `waitForTimeout` grande: sai assim que assentou, e insiste quando demora. */
  /* Zera a rolagem **horizontal** de qualquer trilho antes de medir.
   *
   * ⚠️ O carrossel de cases da home é `overflow-x-auto`, e o navegador pode
   * deixá-lo com alguns pixels de `scrollLeft` depois da rolagem vertical e do
   * re-encaixe de layout. No gabarito ele saiu deslocado 24px — a largura do
   * respiro do container — e a faixa inteira do carrossel divergia, sozinha
   * respondendo por 92% dos pixels diferentes da home. */
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('*')) {
      if (el.scrollWidth > el.clientWidth) el.scrollLeft = 0
    }
  })

  let anterior = -1
  let iguais = 0
  const limite = Date.now() + 8000
  while (iguais < 3 && Date.now() < limite) {
    const altura = await page.evaluate(() => document.body.scrollHeight)
    iguais = altura === anterior ? iguais + 1 : 0
    anterior = altura
    await page.waitForTimeout(200)
  }

  await page.waitForTimeout(300)
}

/** Prepara, navega e assenta. `?e2e=1` é a flag que o app usa para congelar
 *  carrossel e contador — ver estrategia-de-testes.md. */
export async function visit(
  page: Page,
  base: string,
  path: string,
  theme: 'dark' | 'light' = 'dark',
) {
  await stabilize(page)
  const url = new URL(path, base)
  url.searchParams.set('e2e', '1')
  await page.goto(url.toString(), { waitUntil: 'domcontentloaded' })
  await page.evaluate((t) => {
    document.documentElement.classList.toggle('dark', t === 'dark')
    document.documentElement.classList.toggle('light', t === 'light')
  }, theme)
  await settle(page)
}
