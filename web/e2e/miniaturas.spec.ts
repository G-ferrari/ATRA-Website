import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'
import { settle } from './support/stability'

/* Gera as miniaturas do seletor "Adicionar Seção" do admin (feature
 * seletor-de-secoes, task 033): uma por bloco, 480×320, a seção como ela
 * aparece no site, no tema escuro.
 *
 * Fora da suíte: só roda com `GERAR_MINIATURAS=1` (`testIgnore` em
 * `playwright.config.ts`). Regerar quando o design de um bloco mudar — o
 * comando está no CLAUDE.md, em "Comandos".
 *
 * ⚠️ Três escolhas que parecem estranhas e não são:
 * - **Sem `stabilize()`.** Ele troca toda imagem por um PNG 1×1, que é o certo
 *   para comparar pixel e o errado para mostrar a seção.
 * - **Sem `?e2e=1`, com movimento reduzido.** No servidor de desenvolvimento o
 *   `?e2e=1` deixa o contador de números em 0 (armadilha do CLAUDE.md). O
 *   movimento reduzido para os carrosséis e mostra os números prontos.
 * - **A redução acontece num `<canvas>` do próprio Chromium**, não com `sharp`:
 *   a captura roda no Linux da imagem do Playwright, e o `node_modules` montado
 *   é o do host.
 *
 * A página de cada bloco é uma em que ele aparece hoje, escolhida pelo melhor
 * exemplo. Se o bloco sair dela, o teste falha dizendo qual — é a hora de
 * apontar outra página.
 *
 * ⚠️ **Gerar contra um banco sem `SEED_FIXTURES`.** Com a chave, o seed põe as
 * fotos de banco de imagens do protótipo (Unsplash, picsum) nas capas e nos
 * retratos, e `public/` vai para a produção: seria foto de banco no ar, o que a
 * D-27 e a D-14 recusam. O teste reprova a miniatura que tiver uma — o nome do
 * arquivo sobrevive na URL da mídia. */

const PAGINA_DO_BLOCO: Record<string, string> = {
  pageHero: '/solucoes/cloud',
  partnerHero: '/parceiros/google-cloud',
  homeHero: '/',
  stickyPageNav: '/solucoes/rc18',
  richTextSection: '/solucoes/cloud',
  iconCardGrid: '/solucoes/cloud',
  valueCards: '/sobre',
  methodCards: '/solucoes/inteligencia-artificial',
  bentoGrid: '/solucoes/inteligencia-artificial',
  audienceSplit: '/solucoes/rc18',
  featureTabs: '/',
  processSteps: '/solucoes/rc18',
  accordionSteps: '/solucoes/inteligencia-artificial',
  statsGrid: '/sobre',
  sealsBanner: '/carreiras',
  imageGrid: '/solucoes/data-analytics',
  partnerShowcase: '/solucoes/cloud',
  logoMarquee: '/',
  partnerSplit: '/parceiros/google-cloud',
  highlightCarousel: '/',
  caseCarousel: '/',
  testimonialCarousel: '/',
  contentTeaser: '/',
  insightsHub: '/insights',
  homeBento: '/',
  ctaBanner: '/solucoes/cloud',
  ctaContact: '/solucoes/cloud',
  jobsList: '/carreiras',
}

const LARGURA = 480
const ALTURA = 320
const PASTA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/miniaturas-de-blocos')

test.use({ viewport: { width: 1280, height: 900 }, colorScheme: 'dark' })

test.describe('miniaturas do seletor de seções', () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== 'desktop', 'uma miniatura por bloco, no desenho do desktop')
  })

  for (const [bloco, caminho] of Object.entries(PAGINA_DO_BLOCO)) {
    test(`miniatura: ${bloco}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(new URL(caminho, NEXT_URL).toString(), { waitUntil: 'domcontentloaded' })
      await page.evaluate(() => document.documentElement.classList.add('dark'))
      await settle(page)

      /* `:has(> *)`: bloco sem conteúdo (faixa de selos vazia, por exemplo)
         devolve `null` e deixa o invólucro vazio — não serve de alvo. */
      const seletor = `[data-bloco="${bloco}"]:has(> *)`
      const alvo = page.locator(`${seletor} > *`).first()
      await expect(alvo, `"${bloco}" não está mais em ${caminho}, ou está vazio — aponte outra página`).toBeAttached()

      const fotosDeBanco = await page
        .locator(`${seletor} img`)
        .evaluateAll((imgs) =>
          (imgs as HTMLImageElement[]).map((i) => i.currentSrc || i.src).filter((s) => /unsplash-|picsum-/.test(s)),
        )
      expect(fotosDeBanco, 'foto de banco do protótipo (SEED_FIXTURES) na seção — gere contra um banco sem fixtures').toEqual([])
      await alvo.scrollIntoViewIfNeeded()
      /* Entrada animada por `whileInView` e imagem carregando. */
      await page.waitForTimeout(1200)

      /* O que é fixo na tela (cabeçalho, alternador de tema, aviso de cookies,
         overlay do Next) cobriria a seção na captura. Some tudo que não seja o
         próprio bloco. */
      await page.evaluate((seletor) => {
        const dentro = document.querySelector(seletor)
        document.querySelector('nextjs-portal')?.remove()
        for (const el of document.querySelectorAll<HTMLElement>('body *')) {
          const posicao = getComputedStyle(el).position
          if ((posicao === 'fixed' || posicao === 'sticky') && !dentro?.contains(el) && !el.contains(dentro))
            el.style.visibility = 'hidden'
        }
      }, seletor)

      const png = (await alvo.screenshot({ animations: 'disabled' })).toString('base64')

      /* Reduz para 480 de largura e recorta o topo em 3:2 — o que identifica o
         bloco é o cabeçalho e o primeiro terço. Seção mais baixa que o recorte
         completa com o fundo da página. */
      const webp = await page.evaluate(
        async ({ png, largura, altura }) => {
          const img = new Image()
          img.src = `data:image/png;base64,${png}`
          await img.decode()
          const canvas = document.createElement('canvas')
          canvas.width = largura
          canvas.height = altura
          const ctx = canvas.getContext('2d')!
          ctx.fillStyle = getComputedStyle(document.body).backgroundColor
          ctx.fillRect(0, 0, largura, altura)
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, largura, (img.naturalHeight * largura) / img.naturalWidth)
          return canvas.toDataURL('image/webp', 0.86)
        },
        { png, largura: LARGURA, altura: ALTURA },
      )

      /* Encoder sem WebP cai em PNG sem erro, e o `.webp` sairia com PNG dentro. */
      expect(webp.startsWith('data:image/webp'), 'o Chromium não gerou WebP').toBe(true)
      writeFileSync(path.join(PASTA, `${bloco}.webp`), Buffer.from(webp.split(',')[1], 'base64'))
    })
  }
})
