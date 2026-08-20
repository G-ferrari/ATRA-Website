import { expect, test } from '@playwright/test'

import { LEGACY_URL, NEXT_URL } from '../playwright.config'

/* Smoke: barato, roda em toda PR, pega o modo de falha mais provável de uma
 * fábrica de 20 rotas — "quebrou porque alguém renomeou um slug". */

/* Cresce a cada rota portada na Fase 3.
 *
 * Listado por idioma em vez de montado com prefixo: o inglês usa **slugs
 * traduzidos** (D-07), então `/en` + `/cases-de-sucesso` não é uma URL válida —
 * é `/en/success-stories`, e é justamente essa tradução que precisa ser testada. */
const ROTAS_PORTADAS = {
  pt: ['/', '/cases-de-sucesso', '/glossario', '/relatorios', '/ebooks', '/webinars', '/blog', '/solucoes'],
  en: [
    '/en',
    '/en/success-stories',
    '/en/glossary',
    '/en/reports',
    '/en/ebooks',
    '/en/webinars',
    '/en/blog',
    '/en/solutions',
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
   * são o que sobra de rede de segurança — ver a nota no topo da página. */
  test.describe('/blog/[slug] — rota sem gabarito', () => {
    const COM_SLUG = '/blog/squad-gerenciada-como-estruturar-equipes-de-ti-mais-eficientes'

    test('artigo existente responde 200 nos dois idiomas', async ({ request }) => {
      for (const url of [`${NEXT_URL}${COM_SLUG}`, `${NEXT_URL}/en${COM_SLUG}`]) {
        expect((await request.get(url)).status(), url).toBe(200)
      }
    })

    test('slug inexistente responde 404', async ({ request }) => {
      const r = await request.get(`${NEXT_URL}/blog/slug-que-nao-existe`)
      expect(r.status()).toBe(404)
    })

    /* A preocupação de D-08 — página magra prejudica o domínio — aplicada em
     * código: enquanto o corpo estiver vazio o artigo não é indexável. Os 6
     * posts do protótipo estão nesse estado de propósito (fixture do porte). */
    test('artigo sem corpo sai com noindex', async ({ request }) => {
      const r = await request.get(`${NEXT_URL}${COM_SLUG}`)
      expect(await r.text()).toContain('noindex')
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

  test.describe('/carreiras e /contato — páginas de bloco sem gabarito', () => {
    test('a vaga da collection aparece e leva a um detalhe que responde 200', async ({ page }) => {
      await page.goto(`${NEXT_URL}/carreiras`)
      const vaga = page.getByRole('link', { name: /Engenheiro\(a\) de Dados SR/ }).first()
      await expect(vaga).toBeVisible()
      await vaga.click()
      // A vaga leva a /carreiras/[slug] (MIG-051), que precisa **responder**,
      // não só mudar a URL: o link ficou quebrado entre MIG-050 e esta task.
      await expect(page).toHaveURL(/\/carreiras\/.+/)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    /* A vaga sem descrição sai com noindex, como o post sem corpo (D-08). */
    test('vaga sem descrição sai com noindex; slug inexistente dá 404', async ({ request }) => {
      const ok = await request.get(`${NEXT_URL}/carreiras/engenheiro-a-de-dados-sr`)
      expect(await ok.text()).toContain('noindex')
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

  /* `/consultores` fica fora do gate: o legado tem hero com stats animados,
     modal de detalhe e formulário que não foram portados integralmente. O
     catálogo filtrável, que é o núcleo, é verificado aqui. */
  test('o catálogo de consultores filtra pelo seletor de senioridade', async ({ page }) => {
    await page.goto(`${NEXT_URL}/consultores`)
    // 8 perfis no total, cada um com um botão Solicitar.
    await expect(page.getByRole('link', { name: 'Solicitar' })).toHaveCount(8)
    // Filtrar por "Pleno" reduz a lista sem esvaziá-la.
    await page.getByLabel('Senioridade').selectOption('Lead / Principal')
    const n = await page.getByRole('link', { name: 'Solicitar' }).count()
    expect(n).toBeGreaterThan(0)
    expect(n).toBeLessThan(8)
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
    test('lista as 6 soluções agrupadas nas 3 categorias', async ({ page }) => {
      await page.goto(`${NEXT_URL}/solucoes`)
      for (const categoria of ['Inovação & IA', 'Dados, BI & Advanced Analytics', 'Governança & Cultura']) {
        await expect(page.getByRole('heading', { name: categoria, level: 2 })).toBeVisible()
      }
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(6)
    })

    /* Só quem tem `hasPage` vira link. Depois de MIG-056 é uma das seis — a de
       IA. Sem esta asserção o índice poderia voltar a oferecer 5 destinos que
       respondem 404, que é o buraco que MIG-050 abriu e MIG-051 teve que fechar. */
    test('só a solução com página vira link, e ela responde', async ({ page, request }) => {
      await page.goto(`${NEXT_URL}/solucoes`)
      const links = page.locator('a[href*="/solucoes/"]')
      await expect(links).toHaveCount(1)
      const href = await links.first().getAttribute('href')
      expect(href).toBe('/solucoes/inteligencia-artificial')
      expect((await request.get(`${NEXT_URL}${href}`)).status()).toBe(200)
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
    const CATEGORIAS = ['Soluções', 'Consultores', 'Insights', 'Parceiros', 'Carreiras', 'Sobre', 'Glossário']

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

    test('abre com as 7 categorias e o painel de soluções', async ({ page }) => {
      test.skip(noCelular(page), 'a fileira de categorias é `md:flex`')
      const fileira = await abrirMenu(page)

      for (const c of CATEGORIAS) {
        await expect(fileira.getByRole('link', { name: c, exact: true })).toBeVisible()
      }

      /* Hover explícito: o painel abre em Soluções, mas depois do clique o
         ponteiro fica no meio da barra — em cima de outra categoria — e o
         `onMouseEnter` troca o painel, como no legado. */
      await fileira.getByRole('link', { name: 'Soluções', exact: true }).hover()
      const painel = page.getByRole('navigation')
      for (const grupo of ['Inovação & IA', 'Dados, BI & Advanced Analytics', 'Governança & Cultura']) {
        await expect(painel.getByRole('button', { name: grupo })).toBeVisible()
      }
      await expect(painel.getByRole('link', { name: /Inteligência Artificial & IA Generativa/ })).toHaveAttribute(
        'href',
        '/solucoes/inteligencia-artificial',
      )
    })

    /* O painel de parceiros lê a collection, não uma lista digitada no global —
       é o que impede o menu de discordar do resto do site. */
    test('o painel de parceiros vem da collection', async ({ page }) => {
      test.skip(noCelular(page), 'a fileira de categorias é `md:flex`')
      const fileira = await abrirMenu(page)
      await fileira.getByRole('link', { name: 'Parceiros', exact: true }).hover()

      const painel = page.getByTestId('painel-parceiros')
      await expect(painel).toBeVisible()
      // Os 8 do catálogo; o 9º do legado depende de P-10.
      await expect(painel.locator('a[href^="/parceiros/"]')).toHaveCount(8)
    })

    test('o painel de texto + cartão mostra destaques e chamada', async ({ page }) => {
      test.skip(noCelular(page), 'a fileira de categorias é `md:flex`')
      const fileira = await abrirMenu(page)
      await fileira.getByRole('link', { name: 'Sobre', exact: true }).hover()

      const painel = page.getByRole('navigation')
      await expect(painel.getByText('Segurança de Dados')).toBeVisible()
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
