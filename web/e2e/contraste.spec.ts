import { expect, test } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'
import { ROTAS_COM_GABARITO } from './support/rotas'

/* Legibilidade no tema claro.
 *
 * ⚠️ **O aceite visual não cobre isto.** O gabarito é capturado com o `<html>`
 * em `dark` — é como o legado inicia (`App.tsx:2575`) e como o porte inicia —,
 * e a captura nunca clica no alternador. O tema claro existe, tem botão no
 * canto da tela, e nunca foi olhado por nenhum teste: a home ficava com o
 * título do herói **branco sobre fundo branco**, invisível, e o protótipo
 * também.
 *
 * Este arquivo é a rede que faltava. Ele não compara pixels — mede contraste
 * real, com a cor computada de cada texto contra o fundo que de fato está atrás
 * dele.
 */

type Achado = { chave: string; razao: number }

/** Abaixo disto o texto não se lê. Branco sobre branco dá ~1:1. */
const LIMITE_ILEGIVEL = 2

/**
 * Roda no browser: mede o contraste real de cada texto contra o fundo que está
 * de fato atrás dele.
 *
 * ⚠️ Função de verdade passada a `page.evaluate`, e **não** uma string. Com
 * string o Playwright avalia a expressão e devolve a própria função — o teste
 * recebia `undefined` e quebrava com "cannot read properties of undefined",
 * reprovando as 13 rotas sem ter medido nada.
 */
async function auditar(page: import('@playwright/test').Page): Promise<Achado[]> {
  return page.evaluate(() => {
    /* ⚠️ A cor é normalizada por **canvas**, e não por regex.
     *
     * O Tailwind 4 emite `oklab(...)` e `lab(...)` para qualquer cor com
     * opacidade — `text-white/70` vira
     * `oklab(0.999994 0.0000455 0.00002 / 0.7)`. Uma regex de números lê
     * `0.999994` como o canal vermelho, e a conta sai por completo do lugar:
     * a primeira versão deste teste acusou **1.480** problemas, 720 deles em
     * links de rodapé perfeitamente legíveis. O `fillStyle` do canvas aceita
     * qualquer cor que o browser entenda e devolve RGBA. */
    const pincel = document.createElement('canvas').getContext('2d')!

    const lum = (cor: string): number | null => {
      if (!cor) return null
      pincel.clearRect(0, 0, 1, 1)
      pincel.fillStyle = '#000'
      pincel.fillStyle = cor
      pincel.fillRect(0, 0, 1, 1)
      const [r, g, b, alfa] = pincel.getImageData(0, 0, 1, 1).data
      /* Cor quase transparente não é o que o olho vê: o fundo atravessa. */
      if (alfa < 128) return null
      const canal = (v: number) => {
        const c = v / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      }
      return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
    }

    const fundoDe = (el: Element): number | null => {
      let n: Element | null = el
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n)
        /* Imagem ou gradiente atrás do texto: o contraste depende do pixel e
           não do token, e medir a cor daria falso positivo. Sai da conta. */
        if (cs.backgroundImage && cs.backgroundImage !== 'none') return null
        const l = lum(cs.backgroundColor)
        if (l !== null) return l
        n = n.parentElement
      }
      return lum(getComputedStyle(document.body).backgroundColor) ?? 1
    }

    const achados: Achado[] = []
    for (const el of document.querySelectorAll('main *, header *, footer *')) {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim())) continue
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.3) continue
      if (!el.getClientRects().length) continue

      const texto = lum(cs.color)
      const fundo = fundoDe(el)
      if (texto === null || fundo === null) continue

      const razao = (Math.max(texto, fundo) + 0.05) / (Math.min(texto, fundo) + 0.05)
      /* A chave identifica o **mesmo** texto nos dois temas. Texto e classe
       * juntos, porque nenhum dos dois basta: a mesma classe aparece em vinte
       * cartões, e o mesmo texto aparece em lugares diferentes. */
      achados.push({
        chave: `"${(el.textContent ?? '').trim().slice(0, 50)}" [${String(el.className).slice(0, 90)}]`,
        razao: Number(razao.toFixed(2)),
      })
    }
    return achados
  })
}

async function medir(page: import('@playwright/test').Page, tema: 'dark' | 'light'): Promise<Map<string, number>> {
  await page.evaluate((t) => {
    document.documentElement.classList.toggle('dark', t === 'dark')
    document.documentElement.classList.toggle('light', t === 'light')
  }, tema)

  /* ⚠️ Espera a transição de cor terminar antes de medir.
   *
   * A casca e várias seções carregam `transition-colors duration-500`, e
   * `getComputedStyle` devolve o valor **em movimento**: medindo na hora, o
   * texto já estava claro e o fundo ainda escuro, e o teste acusou 164
   * "ilegíveis" que eram só o meio da animação. */
  await page.waitForTimeout(900)

  return new Map((await auditar(page)).map((a) => [a.chave, a.razao]))
}

for (const { nome, caminho } of ROTAS_COM_GABARITO) {
  test(`tema claro: ${nome} é legível`, async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'contraste não muda com o viewport')

    await page.goto(`${NEXT_URL}${caminho}?e2e=1`, { waitUntil: 'networkidle' })

    /* ⚠️ Mede os **dois** temas e compara, em vez de reprovar por contraste
     * baixo no claro.
     *
     * Contraste baixo que existe igual nos dois é escolha de design — laranja
     * da marca sobre o azul da marca dá 1,27:1 e está assim no protótipo, nos
     * dois temas. Reprovar por isso transformaria o teste num pedido de
     * redesenho, e D-15 mantém melhoria fora da migração.
     *
     * O que este teste protege é outra coisa: texto que **funciona no escuro e
     * quebra no claro**, porque a cor foi escrita sem par. Foi o que apagou o
     * título do herói da home. */
    const escuro = await medir(page, 'dark')
    const claro = await medir(page, 'light')

    const regressoes = [...claro.entries()]
      .filter(([chave, razao]) => razao < LIMITE_ILEGIVEL && (escuro.get(chave) ?? 0) >= LIMITE_ILEGIVEL)
      .map(([chave, razao]) => `  ${razao}:1 no claro (${escuro.get(chave)}:1 no escuro) · ${chave}`)

    expect(regressoes, `${regressoes.length} textos que o tema claro torna ilegíveis:\n${regressoes.join('\n')}`).toEqual(
      [],
    )
  })
}
