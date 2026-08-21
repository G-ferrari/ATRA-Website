import { expect, test, type APIRequestContext } from '@playwright/test'

import { LEGACY_URL, NEXT_URL } from '../playwright.config'
import { visit } from './support/stability'

/* Smoke: barato, roda em toda PR, pega o modo de falha mais provável de uma
 * fábrica de 20 rotas — "quebrou porque alguém renomeou um slug". */

/* Cresce a cada rota portada na Fase 3.
 *
 * Listado por idioma em vez de montado com prefixo: o inglês usa **slugs
 * traduzidos** (D-07), então `/en` + `/cases-de-sucesso` não é uma URL válida —
 * é `/en/success-stories`, e é justamente essa tradução que precisa ser testada. */
const ROTAS_PORTADAS = {
  pt: [
    '/',
    '/cases-de-sucesso',
    '/glossario',
    '/relatorios',
    '/ebooks',
    '/webinars',
    '/blog',
    '/solucoes',
    // Fase 4c: as duas nascem aqui, sem equivalente no protótipo (D-17).
    '/segmentos',
    '/politicas-e-termos',
  ],
  en: [
    '/en',
    '/en/success-stories',
    '/en/glossary',
    '/en/reports',
    '/en/ebooks',
    '/en/webinars',
    '/en/blog',
    '/en/solutions',
    '/en/segments',
    '/en/privacy-and-terms',
  ],
} as const

test.describe('app novo', () => {
  for (const [idioma, rotas] of Object.entries(ROTAS_PORTADAS)) {
    for (const rota of rotas) {
      test(`${idioma} ${rota} responde 200`, async ({ request }) => {
        const r = await request.get(`${NEXT_URL}${rota}`)
        expect(r.status()).toBe(200)
      })
    }
  }

  test('URL inválida responde 404, não 200', async ({ request }) => {
    // O legado devolve 200 em rota inexistente — ver debito-tecnico.md.
    const r = await request.get(`${NEXT_URL}/rota-que-nao-existe`)
    expect(r.status()).toBe(404)
  })

  /* A 404 precisa **parecer** o site: sem a rota curinga ela cairia no
   * `not-found` da raiz, fora do grupo (frontend) — sem fonte, sem tema e sem
   * casca. O rodapé é o sinal mais barato de que o layout veio junto. */
  test('a 404 vem com a casca do site nos dois idiomas', async ({ page }) => {
    for (const [url, marca] of [
      [`${NEXT_URL}/rota-que-nao-existe`, 'Esta página não existe'],
      [`${NEXT_URL}/en/does-not-exist`, 'This page does not exist'],
    ] as const) {
      await page.goto(url)
      await expect(page.getByRole('heading', { name: marca })).toBeVisible()
      await expect(page.locator('footer')).toBeVisible()
    }
  })

  test('/pt redireciona para a raiz (sem conteúdo duplicado)', async ({ request }) => {
    const r = await request.get(`${NEXT_URL}/pt/`, { maxRedirects: 0 })
    expect(r.status()).toBe(308)
  })

  /* `/blog/[slug]` **não existe no legado** (os cards apontam para `#`), então
   * não há gabarito e a regressão visual não cobre esta rota. Estas asserções
   * são o que sobra de rede de segurança — ver a nota no topo da página.
   *
   * ⚠️ O slug sai da **listagem**, não escrito aqui. Escrito, o teste amarra a
   * suíte ao conteúdo do banco: o slug que estava aqui era de uma das 6
   * fixtures do protótipo, que MIG-083 apagou ao importar os 207 posts reais, e
   * três asserções passaram a apontar para um 404. */
  test.describe('/blog/[slug] — rota sem gabarito', () => {
    async function primeiroArtigo(request: APIRequestContext): Promise<string> {
      const html = await (await request.get(`${NEXT_URL}/blog`)).text()
      const m = html.match(/href="(\/blog\/[^"#]+)"/)
      expect(m, 'a listagem não tem nenhum link de artigo').toBeTruthy()
      return m![1]
    }

    test('artigo existente responde 200 nos dois idiomas', async ({ request }) => {
      const caminho = await primeiroArtigo(request)
      for (const url of [`${NEXT_URL}${caminho}`, `${NEXT_URL}/en${caminho}`]) {
        expect((await request.get(url)).status(), url).toBe(200)
      }
    })

    test('slug inexistente responde 404', async ({ request }) => {
      const r = await request.get(`${NEXT_URL}/blog/slug-que-nao-existe`)
      expect(r.status()).toBe(404)
    })

    /* O outro lado de D-08: artigo **com** corpo tem que ser indexável. A regra
     * em si — corpo vazio sai com `noindex` — virou unitário em `lib/seo.ts`
     * quando os 207 artigos reais entraram e não sobrou no banco nenhuma página
     * sem corpo para prová-la aqui. */
    test('artigo com corpo é indexável', async ({ request }) => {
      const r = await request.get(`${NEXT_URL}${await primeiroArtigo(request)}`)
      expect(await r.text()).not.toContain('noindex')
    })
  })

  /* `/relatorios/[slug]` e `/ebooks/[slug]` também não existem no protótipo. */
  test.describe('materiais — rotas sem gabarito', () => {
    const RELATORIO = 'relatorio-anual-de-dados-2025-tendencias-e-projecoes'
    const EBOOK = 'o-guia-definitivo-do-data-lakehouse-para-executivos'

    test('material existente responde 200 nos dois idiomas', async ({ request }) => {
      for (const url of [
        `${NEXT_URL}/relatorios/${RELATORIO}`,
        `${NEXT_URL}/ebooks/${EBOOK}`,
        `${NEXT_URL}/en/reports/${RELATORIO}`,
        `${NEXT_URL}/en/ebooks/${EBOOK}`,
      ]) {
        expect((await request.get(url)).status(), url).toBe(200)
      }
    })

    /* O tipo entra na consulta, não só na rota. Sem isso o mesmo material
     * responderia sob as duas seções e o Google veria conteúdo duplicado. */
    test('slug do outro tipo responde 404', async ({ request }) => {
      for (const url of [`${NEXT_URL}/relatorios/${EBOOK}`, `${NEXT_URL}/ebooks/${RELATORIO}`]) {
        expect((await request.get(url)).status(), url).toBe(404)
      }
    })

    test('material sem corpo sai com noindex', async ({ request }) => {
      const r = await request.get(`${NEXT_URL}/relatorios/${RELATORIO}`)
      expect(await r.text()).toContain('noindex')
    })
  })

  test.describe('/webinars/[slug] — rota sem gabarito', () => {
    const SLUG = 'data-show-como-escalar-seu-data-lakehouse'

    test('webinar existente responde 200 nos dois idiomas', async ({ request }) => {
      for (const url of [`${NEXT_URL}/webinars/${SLUG}`, `${NEXT_URL}/en/webinars/${SLUG}`]) {
        expect((await request.get(url)).status(), url).toBe(200)
      }
    })

    test('slug inexistente responde 404', async ({ request }) => {
      expect((await request.get(`${NEXT_URL}/webinars/nao-existe`)).status()).toBe(404)
    })

    /* D-11 previu os dois estados; nenhum webinar do seed tem vídeo, então é o
     * estado vazio que está no ar. Sem iframe quebrado é o que importa aqui. */
    test('webinar sem vídeo mostra o aviso e não monta iframe', async ({ request }) => {
      const html = await (await request.get(`${NEXT_URL}/webinars/${SLUG}`)).text()
      expect(html).toContain('Gravação em breve')
      expect(html).not.toContain('<iframe')
    })
  })

  /* `/segmentos` e `/segmentos/[slug]` nascem na Fase 4c (MIG-091/092): as 8
   * verticais existem só no WordPress e não têm gabarito. Como em `/blog`, o
   * slug sai da listagem em vez de ser escrito aqui. */
  test.describe('/segmentos — rota nova, sem gabarito', () => {
    test('o índice lista as verticais e cada uma leva a uma página que responde', async ({ page, request }) => {
      await page.goto(`${NEXT_URL}/segmentos`)
      const cards = page.locator('a[href*="/segmentos/"]')
      await expect(cards.first()).toBeVisible()
      expect(await cards.count(), 'o índice de segmentos está vazio').toBeGreaterThanOrEqual(8)

      const href = await cards.first().getAttribute('href')
      const r = await request.get(`${NEXT_URL}${href}`)
      expect(r.status(), href!).toBe(200)
      /* A vertical tem seções montadas: sem isso ela seria página magra e sairia
         com `noindex` (D-08), que é o que `robotsDeCorpo` decide. */
      expect(await r.text()).not.toContain('noindex')
    })

    test('slug de segmento inexistente responde 404', async ({ request }) => {
      expect((await request.get(`${NEXT_URL}/segmentos/nao-existe`)).status()).toBe(404)
    })

    /* ⚠️ Regressão de verdade, não hipótese: a Local API do Payload roda com
       `overrideAccess: true`, então o `access.read` que esconde rascunho do
       público **não se aplica** às consultas das páginas. Seis consultas ficaram
       sem `where: { _status }` por meses sem sintoma, porque nada estava em
       rascunho — e no dia em que MIG-093 pôs 12 soluções nesse estado, o índice
       passou a listar 18 e o mega-menu junto. O seed cria uma vertical em
       rascunho só para esta asserção. */
    test('rascunho não vaza para o índice nem responde por URL', async ({ page, request }) => {
      await page.goto(`${NEXT_URL}/segmentos`)
      await expect(page.getByText('Rascunho que não pode vazar')).toHaveCount(0)
      expect((await request.get(`${NEXT_URL}/segmentos/rascunho-que-nao-pode-vazar`)).status()).toBe(404)
    })
  })

  /* MIG-094: os 3 links legais do rodapé apontavam para `#` no protótipo e
     passam a apontar para a mesma página — o WordPress também tem uma só. */
  test.describe('/politicas-e-termos — pré-requisito de LGPD', () => {
    test('os 3 links legais do rodapé levam à página, que responde 200', async ({ page, request }) => {
      await page.goto(`${NEXT_URL}/sobre`)
      const legais = page.locator('footer a[href="/politicas-e-termos"]')
      await expect(legais).toHaveCount(3)
      expect((await request.get(`${NEXT_URL}/politicas-e-termos`)).status()).toBe(200)
    })
  })

  test.describe('/carreiras e /contato — páginas de bloco sem gabarito', () => {
    test('a vaga da collection aparece e leva a um detalhe que responde 200', async ({ page }) => {
      await page.goto(`${NEXT_URL}/carreiras`)
      /* Qualquer vaga serve: as 6 do protótipo saíram em MIG-085 e as 7 reais
         entraram, e um título escrito aqui envelhece a cada vaga que abre. */
      const vaga = page.locator('a[href*="/carreiras/"]').first()
      await expect(vaga).toBeVisible()
      await vaga.click()
      // A vaga leva a /carreiras/[slug] (MIG-051), que precisa **responder**,
      // não só mudar a URL: o link ficou quebrado entre MIG-050 e esta task.
      await expect(page).toHaveURL(/\/carreiras\/.+/)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    test('slug de vaga inexistente dá 404', async ({ request }) => {
      const nope = await request.get(`${NEXT_URL}/carreiras/vaga-que-nao-existe`)
      expect(nope.status()).toBe(404)
    })

    /* O formulário existe mas não envia (P-14, P-18): o botão fica desabilitado
       para não coletar dado pessoal sem política publicada nem destino. */
    test('o formulário de contato está desabilitado', async ({ page }) => {
      await page.goto(`${NEXT_URL}/contato`)
      await expect(page.getByRole('button', { name: 'Enviar' })).toBeDisabled()
      // O e-mail aparece no cartão E no rodapé; o `first()` fica com o do cartão.
      await expect(page.getByRole('link', { name: 'negocios@atra.com.br' }).first()).toBeVisible()
    })
  })

  /* `/consultores` agora tem gabarito (ver `support/rotas.ts`). O que fica aqui
     é o comportamento, que a captura não pega: o filtro. */
  test('o catálogo de consultores filtra pela pílula de senioridade', async ({ page }) => {
    await page.goto(`${NEXT_URL}/consultores`)
    // 8 perfis no total, cada um com um botão Solicitar.
    await expect(page.getByRole('link', { name: 'Solicitar' })).toHaveCount(8)
    /* Pílula, não `select`: a primeira versão da ilha usou dois `select` e isso
       foi parte dos 300px que faltavam na seção de filtros. */
    await page.getByRole('button', { name: 'Lead / Principal', exact: true }).click()
    const n = await page.getByRole('link', { name: 'Solicitar' }).count()
    expect(n).toBeGreaterThan(0)
    expect(n).toBeLessThan(8)
  })

  /* O modal do perfil não entra na regressão visual porque nasce fechado. */
  test('o botão Detalhes abre o modal do perfil', async ({ page }) => {
    await page.goto(`${NEXT_URL}/consultores`)
    await page.getByRole('button', { name: 'Detalhes' }).first().click()
    const modal = page.getByRole('dialog')
    await expect(modal).toBeVisible()
    await expect(modal.getByText('Tecnologias de Domínio')).toBeVisible()
    /* `.last()`: há três formas de fechar — o fundo, o X e o botão do rodapé —
       e as três se chamam "Fechar". Esta é a do rodapé. */
    await modal.getByRole('button', { name: 'Fechar', exact: true }).last().click()
    await expect(modal).toBeHidden()
  })

  /* `/parceiros/[slug]` monta a página do parceiro por blocos guardados na
     collection. Sem gabarito — o legado usava um componente fixo. */
  test('a página do parceiro responde e o slug sem página dá 404', async ({ request }) => {
    for (const url of [`${NEXT_URL}/parceiros/google-cloud`, `${NEXT_URL}/en/partners/google-cloud`]) {
      expect((await request.get(url)).status(), url).toBe(200)
    }
    // Um parceiro existente mas sem hasPage não vira página.
    expect((await request.get(`${NEXT_URL}/parceiros/salesforce-informatica`)).status()).toBe(404)
  })

  /* `/solucoes` é a única rota que **muda de comportamento** (D-09): no legado
     ela serve a página de IA, aqui vira índice. Não há gabarito visual, então o
     aceite é este. */
  test.describe('/solucoes — índice novo (D-09)', () => {
    /* ⚠️ **18, e não 6.** P-16 foi respondida em 21/08/2026 com "publicar": as 6
       do protótipo convivem com as 12 do WordPress (MIG-093). O número é
       asserção de verdade e não contagem frouxa — se voltar a 6, alguém
       despublicou as 12; se passar de 18, rascunho está vazando de novo. */
    test('lista as 18 soluções agrupadas nas 3 categorias', async ({ page }) => {
      await page.goto(`${NEXT_URL}/solucoes`)
      for (const categoria of ['Inovação & IA', 'Dados, BI & Advanced Analytics', 'Governança & Cultura']) {
        await expect(page.getByRole('heading', { name: categoria, level: 2 })).toBeVisible()
      }
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(18)
    })

    /* Só quem tem `hasPage` vira link: a de IA, portada em MIG-056, mais as 12
       do WordPress, que têm corpo. As outras 5 do protótipo continuam sem
       página. Sem esta asserção o índice poderia voltar a oferecer destinos que
       respondem 404 — o buraco que MIG-050 abriu e MIG-051 teve que fechar. */
    test('só as soluções com página viram link, e elas respondem', async ({ page, request }) => {
      await page.goto(`${NEXT_URL}/solucoes`)
      const links = page.locator('a[href*="/solucoes/"]')
      await expect(links).toHaveCount(13)

      const hrefs = await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')))
      expect(hrefs).toContain('/solucoes/inteligencia-artificial')
      for (const href of hrefs) {
        expect((await request.get(`${NEXT_URL}${href}`)).status(), href!).toBe(200)
      }
    })

    /* Solução sem `hasPage` não ganha URL: o slug existe na collection, mas a
       página não. Sem o filtro na consulta as 5 responderiam 200 vazias. */
    test('solução sem página responde 404', async ({ request }) => {
      expect((await request.get(`${NEXT_URL}/solucoes/cultura-de-dados`)).status()).toBe(404)
    })

    test('o inglês responde no slug traduzido e o canônico redireciona', async ({ request }) => {
      expect((await request.get(`${NEXT_URL}/en/solutions`)).status()).toBe(200)
      // `/en/solucoes` serviria o mesmo conteúdo numa segunda URL (D-07).
      const r = await request.get(`${NEXT_URL}/en/solucoes`, { maxRedirects: 0 })
      expect(r.status()).toBe(308)
    })
  })

  /* Megamenu (MIG-072a). Os painéis só existem com o menu aberto, então a
     regressão visual — que captura o estado fechado — não os cobre. É aqui. */
  test.describe('megamenu', () => {
    /* 8 desde que `/segmentos` entrou no menu: as 7 do protótipo mais Segmentos,
       ao lado de Soluções. O protótipo recebeu a mesma categoria, senão o
       gabarito passaria a medir a diferença em vez da regressão. */
    const CATEGORIAS = ['Soluções', 'Segmentos', 'Consultores', 'Insights', 'Parceiros', 'Carreiras', 'Sobre', 'Glossário']

    /* As categorias e o rótulo do rodapé têm o mesmo texto, então todo locator
       aqui é escopado no `<nav>`. A fileira é `hidden md:flex`: no celular a
       navegação é a gaveta, testada por último. */
    /* ⚠️ Não dá para usar `isMobile`: os três projetos rodam com o mesmo
       `devices['Desktop Chrome']` e só trocam o viewport, então `isMobile` é
       falso nos três. A largura é o que separa a fileira da gaveta. */
    const noCelular = (page: import('@playwright/test').Page) => (page.viewportSize()?.width ?? 0) < 768

    /* A fileira do desktop e a gaveta do celular coexistem no DOM — uma é
       escondida por CSS — então todo rótulo aparece duas vezes e um locator por
       texto vira violação de strict mode. Por isso cada teste entra pela região
       que lhe interessa. */
    const abrirMenu = async (page: import('@playwright/test').Page) => {
      await page.goto(`${NEXT_URL}/glossario`)
      await page.getByRole('button', { name: 'Abrir menu' }).click()
      return page.getByTestId('menu-categorias')
    }

    /* Passa o ponteiro numa categoria e espera o painel dela, **reabrindo o
     * menu quando ele fechou no meio do caminho**.
     *
     * ⚠️ Só repetir o hover não basta, e foi o que deixou estes dois testes
     * instáveis: depois do clique em "Abrir menu" o ponteiro fica sobre outra
     * categoria, o `onMouseEnter` dela troca o painel, e a remontagem do
     * `AnimatePresence` pode tirar a barra de debaixo do ponteiro — aí o
     * `onMouseLeave` fecha o menu. Fechado o menu, a fileira some, e todas as
     * tentativas seguintes falham no mesmo lugar. */
    const passarNaCategoria = async (
      page: import('@playwright/test').Page,
      categoria: string,
      esperar: () => Promise<void>,
    ) => {
      await expect(async () => {
        let fileira = page.getByTestId('menu-categorias')
        if (!(await fileira.isVisible().catch(() => false))) fileira = await abrirMenu(page)

        /* ⚠️ Passar por **outra** categoria antes. `hover()` só move o ponteiro,
           e mover para onde ele já está não emite `mouseenter` nenhum — na
           segunda tentativa o painel simplesmente não trocava, e o laço gastava
           os 20s repetindo um gesto que o browser ignorava. As duas ficam dentro
           da mesma barra, então o `onMouseLeave` que fecha o menu não dispara. */
        const vizinha = categoria === 'Soluções' ? 'Sobre' : 'Soluções'
        await fileira.getByRole('link', { name: vizinha, exact: true }).hover()
        await fileira.getByRole('link', { name: categoria, exact: true }).hover()
        await esperar()
      }).toPass({ timeout: 20000 })
    }

    test('abre com as 8 categorias e o painel de soluções', async ({ page }) => {
      test.skip(noCelular(page), 'a fileira de categorias é `md:flex`')
      const fileira = await abrirMenu(page)

      for (const c of CATEGORIAS) {
        await expect(fileira.getByRole('link', { name: c, exact: true })).toBeVisible()
      }

      /* Hover explícito: o painel abre em Soluções, mas depois do clique o
         ponteiro fica no meio da barra — em cima de outra categoria — e o
         `onMouseEnter` troca o painel, como no legado. */
      const painel = page.getByRole('navigation')
      await passarNaCategoria(page, 'Soluções', () =>
        expect(painel.getByRole('button', { name: 'Inovação & IA' })).toBeVisible({ timeout: 2000 }),
      )

      for (const grupo of ['Dados, BI & Advanced Analytics', 'Governança & Cultura']) {
        await expect(painel.getByRole('button', { name: grupo })).toBeVisible()
      }
      await expect(painel.getByRole('link', { name: /Inteligência Artificial & IA Generativa/ })).toHaveAttribute(
        'href',
        '/solucoes/inteligencia-artificial',
      )
    })

    /* O painel de segmentos lê a collection, como o de parceiros — digitar as 8
       verticais no global recriaria a duplicação que ele existe para evitar. */
    test('o painel de segmentos lista as verticais da collection', async ({ page }) => {
      test.skip(soNoDesktop(page), 'a troca de painel por hover só é estável no desktop')
      await abrirMenu(page)
      const painel = page.getByTestId('painel-segmentos')
      await passarNaCategoria(page, 'Segmentos', () => expect(painel).toBeVisible({ timeout: 2000 }))
      expect(await painel.getByRole('link').count()).toBeGreaterThanOrEqual(8)
    })

    /* O painel de parceiros lê a collection, não uma lista digitada no global —
       é o que impede o menu de discordar do resto do site. */
    /* ⚠️ Só no desktop. A troca de painel depende de `hover`, e em 768px a
       fileira das 7 categorias fica apertada o bastante para a remontagem do
       `AnimatePresence` correr com o ponteiro — o teste alternava entre passar
       e falhar sem mudança de código. O painel em si funciona nos dois; o que
       não é confiável ali é o hover sintético. */
    const soNoDesktop = (page: import('@playwright/test').Page) => (page.viewportSize()?.width ?? 0) < 1280

    test('o painel de parceiros vem da collection', async ({ page }) => {
      test.skip(soNoDesktop(page), 'a troca de painel por hover só é estável no desktop')
      await abrirMenu(page)
      const painel = page.getByTestId('painel-parceiros')
      await passarNaCategoria(page, 'Parceiros', () => expect(painel).toBeVisible({ timeout: 2000 }))

      // Os 8 do catálogo; o 9º do legado depende de P-10.
      await expect(painel.locator('a[href^="/parceiros/"]')).toHaveCount(8)
    })

    test('o painel de texto + cartão mostra destaques e chamada', async ({ page }) => {
      test.skip(soNoDesktop(page), 'a troca de painel por hover só é estável no desktop')
      await abrirMenu(page)
      const painel = page.getByRole('navigation')
      await passarNaCategoria(page, 'Sobre', () =>
        expect(painel.getByText('Segurança de Dados')).toBeVisible({ timeout: 2000 }),
      )

      await expect(painel.getByRole('link', { name: /Conhecer Nossa História/ })).toBeVisible()
    })

    test('no celular vira gaveta, e só as categorias com lista expandem', async ({ page }) => {
      test.skip(!noCelular(page), 'a gaveta é `md:hidden`')
      await page.goto(`${NEXT_URL}/glossario`)
      await page.getByRole('button', { name: 'Abrir menu' }).click()

      const gaveta = page.getByTestId('menu-gaveta')
      await expect(gaveta).toBeVisible()
      for (const c of CATEGORIAS) {
        await expect(gaveta.getByRole('link', { name: c, exact: true })).toBeVisible()
      }
      /* ⚠️ `dispatchEvent`, e não `click()`: a barra fecha o menu no
         `onMouseLeave`, e a gaveta é **irmã** dela — mover o ponteiro para
         dentro da gaveta fecha tudo antes do clique chegar. O legado tem o
         mesmo defeito (`App.tsx:324`), então foi portado assim; ver
         debito-tecnico.md. Num aparelho de toque não há hover e o problema não
         existe, que é por onde a gaveta é usada de verdade. */
      await gaveta.getByRole('link', { name: 'Soluções', exact: true }).dispatchEvent('click')
      await expect(gaveta.getByText('Inovação & IA')).toBeVisible()
    })
  })

  /* O campo de partículas do herói sai da regressão visual por ser
   * irreproduzível — ver a nota da `MASCARA` em `support/rotas.ts`. O que ele
   * precisa entregar é conferido aqui: existir do tamanho do herói, e reagir ao
   * ponteiro. Sem isto, mascarar o canvas o deixaria sem cobertura nenhuma. */
  test.describe('herói da home', () => {
    test('o canvas cobre o herói e reage ao ponteiro', async ({ page }) => {
      await visit(page, NEXT_URL, '/')

      const medidas = await page.evaluate(() => {
        const c = document.querySelector('canvas')
        if (!c) return null
        const pai = c.parentElement as HTMLElement
        return { largura: c.width, altura: c.height, paiL: pai.clientWidth, paiA: pai.clientHeight }
      })
      expect(medidas, 'o canvas do herói não foi renderizado').not.toBeNull()
      expect(medidas!.largura).toBe(medidas!.paiL)
      expect(medidas!.altura).toBe(medidas!.paiA)

      /* Com `?e2e=1` a velocidade é zero, então **qualquer** mudança no desenho
         vem da repulsão do ponteiro. Sem a flag o teste não provaria nada: as
         partículas andam sozinhas. */
      const desenho = () =>
        page.evaluate(() => {
          const c = document.querySelector('canvas') as HTMLCanvasElement
          const d = c.getContext('2d')!.getImageData(0, 0, c.width, Math.min(c.height, 600)).data
          let h = 0
          for (let i = 0; i < d.length; i += 16) h = (h * 33 + d[i] + d[i + 2]) >>> 0
          return h
        })

      const parado = await desenho()
      expect(await desenho(), 'o canvas deveria estar congelado com ?e2e=1').toBe(parado)

      await page.mouse.move(640, 400, { steps: 12 })
      await expect(async () => expect(await desenho()).not.toBe(parado)).toPass({ timeout: 5000 })
    })
  })

  test('admin do Payload responde', async ({ request }) => {
    const r = await request.get(`${NEXT_URL}/admin`)
    expect(r.status()).toBe(200)
  })
})

test.describe('legado (gabarito da regressão visual)', () => {
  test('está no ar em :3001', async ({ request }) => {
    const r = await request.get(LEGACY_URL)
    expect(
      r.status(),
      `O legado precisa estar rodando: cd legacy && docker compose up -d`,
    ).toBe(200)
  })
})
