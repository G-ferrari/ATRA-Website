import { expect, test, type APIRequestContext } from '@playwright/test'

import { LEGACY_URL, NEXT_URL, PARIDADE_COM_PROTOTIPO } from '../playwright.config'
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
    '/relatorios',
    '/ebooks',
    '/webinars',
    '/blog',
    '/solucoes',
    // Fase 4c: as duas nascem aqui, sem equivalente no protótipo (D-17).
    '/segmentos',
    '/politicas-e-termos',
    // Task 026: sem equivalente no protótipo, fora do gate visual. A EN serve o
    // conteúdo em português, mas o slug é traduzido e é ele que se testa.
    '/diagnostico-maturidade',
  ],
  en: [
    '/en',
    '/en/success-stories',
    '/en/reports',
    '/en/ebooks',
    '/en/webinars',
    '/en/blog',
    '/en/solutions',
    '/en/segments',
    '/en/privacy-and-terms',
    '/en/data-maturity-assessment',
  ],
} as const

test.describe('app novo', () => {
  /* D-36: o glossário saiu do ar com 404, nos dois idiomas. */
  test('o glossário responde 404', async ({ request }) => {
    for (const rota of ['/glossario', '/en/glossary']) {
      expect((await request.get(`${NEXT_URL}${rota}`)).status(), rota).toBe(404)
    }
  })

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

  /* Task 026. O `?setor=` é lido no servidor, então o HTML já sai com o setor
   * escolhido e a linha de impactos — o aceite se prova sem clicar em nada.
   * `noindex` nos dois idiomas: é ferramenta de conversão, não conteúdo. */
  test('o diagnóstico de maturidade sai com noindex e abre no setor da URL', async ({ request }) => {
    /* ⚠️ Status conferido junto com o corpo (task 030). Uma página de erro
     * também não tem a linha de impactos — a negativa do setor inválido
     * passava sobre um 500 —, e pode sair com `noindex`. Foi visto no servidor
     * de dev, que às vezes responde 500 a esta rota (ver o fim do topo de
     * `diagnostico-maturidade.spec.ts`). */
    const html = async (rota: string) => {
      const r = await request.get(`${NEXT_URL}${rota}`)
      expect(r.status(), rota).toBe(200)
      return r.text()
    }
    for (const rota of ['/diagnostico-maturidade', '/en/data-maturity-assessment']) {
      expect(await html(rota), rota).toContain('noindex')
    }
    const comSetor = await html('/diagnostico-maturidade?setor=saude')
    expect(comSetor).toContain('<option value="saude" selected=""')
    expect(comSetor).toContain('Impactos avaliados:')
    // Setor fora dos oito códigos é ignorado: o perfil abre sem seleção.
    const invalido = await html('/diagnostico-maturidade?setor=xpto')
    // Nenhuma opção com valor escolhida: porte e cargo também nascem vazios.
    expect(invalido).not.toMatch(/<option value="[^"]+" selected=""/)
    expect(invalido).not.toContain('Impactos avaliados:')
  })

  /* Task 030. Sitemap e `robots` não podem se contradizer: anunciar ao robô uma
   * URL que a própria página manda não indexar. O diagnóstico não está em
   * `app/sitemap.ts`; isto impede que entre por engano — numa lista de índices,
   * por exemplo —, e o endereço aposentado do RC18 junto, que é redirect.
   *
   * ⚠️ A primeira asserção é a de controle: um sitemap vazio ou quebrado
   * passaria pelas negativas sem provar nada. */
  test('o sitemap não anuncia o diagnóstico de maturidade', async ({ request }) => {
    const r = await request.get(`${NEXT_URL}/sitemap.xml`)
    expect(r.status()).toBe(200)
    const xml = await r.text()
    expect(xml).toContain('/cases-de-sucesso</loc>')
    for (const caminho of ['/diagnostico-maturidade', '/data-maturity-assessment', '/diagnostico-rc18', '/rc18-diagnostic']) {
      expect(xml, caminho).not.toContain(caminho)
    }
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
  /* MIG-100/101 — o formulário de contato ligado.
     ⚠️ O que se prova aqui é o par: o envio **grava** e o robô **não passa**.
     Sem a segunda metade, ligar o formulário é abrir uma porta para spam. */
  test.describe('formulário de contato', () => {
    const preencher = async (page: import('@playwright/test').Page) => {
      const form = page.locator('form').filter({ has: page.locator('input[name="message"], textarea[name="message"]') })
      await form.locator('input[name="name"]').fill('Fulano de Teste')
      await form.locator('input[name="email"]').fill(`e2e-${Date.now()}@exemplo.com`)
      await form.locator('input[name="message"], textarea[name="message"]').fill('Mensagem de teste do e2e.')
      return form
    }

    /* ⚠️ Os dois envios rodam **só no desktop** desde 27/09, quando o e2e
       voltou ao CI (D-39). O teto de 5 envios por IP por hora
       (`lib/anti-spam.ts`) é um só para todos os formulários, e na suíte todo
       envio sai do mesmo IP — o do container do Playwright. Nos três viewports
       estes dois somavam 6, e com o de `consultores.spec.ts` e o de
       `diagnostico-maturidade.spec.ts`, 8. O diagnóstico roda depois dos
       outros e confere a linha no banco: no build de produção, com um contador
       só no processo, ele receberia o **sucesso falso** do teto e reprovaria.
       (No servidor de dev a conta não fechou assim — os 8 gravaram numa corrida
       de 27/09 —, mas é o build de produção que o CI mede.) No desktop são 4,
       dentro do teto mesmo com um retry.

       O formulário é o mesmo markup em toda largura: é o mesmo motivo que já
       deixava os outros dois envios só no desktop. A isca, que não envia nada,
       continua nos três. */
    const soNoDesktop = (info: import('@playwright/test').TestInfo) =>
      test.skip(info.project.name !== 'desktop', 'o envio roda uma vez; ver a nota acima')

    test('envia de /contato e confirma na própria página', async ({ page }, info) => {
      soNoDesktop(info)
      await page.goto(`${NEXT_URL}/contato`)
      const form = await preencher(page)
      /* A armadilha de tempo exige 3s entre a página montar e o envio — o
         mesmo que ela cobra de um robô. */
      await page.waitForTimeout(3500)
      await form.locator('button[type="submit"]').click()
      await expect(page.getByRole('status')).toBeVisible({ timeout: 20000 })
    })

    test('envia da home, onde o bloco é a outra variante', async ({ page }, info) => {
      soNoDesktop(info)
      await page.goto(`${NEXT_URL}/`)
      const form = await preencher(page)
      await page.waitForTimeout(3500)
      await form.locator('button[type="submit"]').click()
      await expect(page.getByRole('status')).toBeVisible({ timeout: 20000 })
    })

    /* O campo isca é invisível para gente e para leitor de tela: quem o
       preenche é script. O envio responde sucesso e não grava — dizer "você foi
       barrado" entregaria o critério de graça. */
    test('o campo isca está escondido e fora da navegação por teclado', async ({ page }) => {
      await page.goto(`${NEXT_URL}/contato`)
      const isca = page.locator('input[name="website"]').first()
      await expect(isca).toHaveCount(1)
      await expect(isca).not.toBeInViewport()
      expect(await isca.getAttribute('tabindex')).toBe('-1')
    })
  })

  /* MIG-110 — teto de orçamento da ATRA AI.
     ⚠️ O que se testa é a **degradação**: teto atingido responde a mensagem de
     indisponibilidade, e não 500. O caminho feliz não é testável aqui — sem
     `GEMINI_API_KEY` no container, a rota já responde indisponível. */
  test.describe('ATRA AI — limites', () => {
    test('rota de chat nunca responde 500, mesmo sem chave', async ({ request }) => {
      const r = await request.post(`${NEXT_URL}/api/chat`, {
        data: { messages: [{ role: 'user', content: 'oi' }] },
      })
      expect([200, 429, 503], `status inesperado ${r.status()}`).toContain(r.status())
      if (r.status() !== 200) {
        /* Degradar é responder texto para o visitante, não um erro cru. */
        expect(((await r.json()) as { error?: string }).error ?? '').not.toBe('')
      }
    })

    test('corpo inválido é recusado com 400, não com 500', async ({ request }) => {
      expect((await request.post(`${NEXT_URL}/api/chat`, { data: {} })).status()).toBe(400)
    })
  })

  /* MIG-107 — dados estruturados. O que o Rich Results Test do Google confere é
     a forma; isto confere que a forma chegou à página, que é o que costuma
     falhar (JSON escapado errado, nó ausente, `@id` que não casa). */
  test.describe('dados estruturados (schema.org)', () => {
    const jsonLd = async (page: import('@playwright/test').Page) =>
      (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
        (t) => JSON.parse(t) as Record<string, unknown>,
      )

    test('toda página declara a Organization, com as redes reais', async ({ page }) => {
      await page.goto(`${NEXT_URL}/sobre`)
      const org = (await jsonLd(page)).find((d) => d['@type'] === 'Organization')
      expect(org, 'nenhum nó Organization na página').toBeTruthy()
      expect(org!.name).toBe('ATRA')
      expect(org!.email).toBe('negocios@atra.com.br')
      /* Os perfis que a ATRA confirmou em 26/09 (`ef139e2`, P-26). O antigo
         (`atra-tecnologia`) vinha do CTA do protótipo e saiu do seed. */
      expect(org!.sameAs).toContain('https://www.linkedin.com/company/atraoficial/')
    })

    test('o artigo declara Article ligado à mesma organização', async ({ page }) => {
      await page.goto(`${NEXT_URL}/blog`)
      const href = await page.locator('a[href^="/blog/"]').first().getAttribute('href')
      await page.goto(`${NEXT_URL}${href}`)

      const nos = await jsonLd(page)
      const artigo = nos.find((d) => d['@type'] === 'Article')
      const org = nos.find((d) => d['@type'] === 'Organization')
      expect(artigo, 'nenhum nó Article').toBeTruthy()
      expect(artigo!.headline).toBeTruthy()
      expect(artigo!.datePublished).toBeTruthy()
      /* O `@id` do publisher tem que casar com o da organização, senão o Google
         lê dois nós soltos em vez de um artigo publicado por alguém. */
      expect((artigo!.publisher as Record<string, string>)['@id']).toBe(org!['@id'])
    })

    test('a solução declara Service', async ({ page }) => {
      await page.goto(`${NEXT_URL}/solucoes/inteligencia-artificial`)
      const servico = (await jsonLd(page)).find((d) => d['@type'] === 'Service')
      expect(servico, 'nenhum nó Service').toBeTruthy()
      expect(servico!.name).toBeTruthy()
    })
  })

  /* Os 3 links de solução do rodapé apontavam para `#`, herdado do protótipo.
     São as 3 categorias do mega-menu, sem página própria, então o destino de
     todas é o índice — mesmo caso dos 3 links legais. */
  test.describe('rodapé — os links de solução deixam de ser mortos', () => {
    test('as 3 categorias levam ao índice de soluções', async ({ page }) => {
      await page.goto(`${NEXT_URL}/sobre`)
      await expect(page.locator('footer a[href="/solucoes"]')).toHaveCount(3)
      await expect(page.locator('footer a[href="#"]')).toHaveCount(0)
    })
  })

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

    /* ⚠️ O botão **deixou de ser desabilitado** em MIG-100. A asserção era
       "não envia" enquanto P-14 estava aberta; com `/politicas-e-termos`
       publicada, o que precisa ser verdade é o contrário — e está no bloco
       "formulário de contato" acima. O que sobra aqui é o caminho alternativo,
       que continua valendo: quem prefere e-mail encontra o endereço na página. */
    test('o cartão de contato mostra o e-mail direto', async ({ page }) => {
      await page.goto(`${NEXT_URL}/contato`)
      await expect(page.getByRole('button', { name: 'Enviar' })).toBeEnabled()
      // O e-mail aparece no cartão E no rodapé; o `first()` fica com o do cartão.
      await expect(page.getByRole('link', { name: 'negocios@atra.com.br' }).first()).toBeVisible()
    })
  })

  /* `/consultores` saiu do gabarito em 24/09 (D-34); o comportamento completo
     está em `consultores.spec.ts`. O que fica aqui é o filtro, barato. */
  test('o catálogo de consultores filtra pela pílula de senioridade', async ({ page }) => {
    await page.goto(`${NEXT_URL}/consultores`)
    /* 8 perfis, cada um com um botão Solicitar. ⚠️ `button` e não `link`
       desde a task 010: o Solicitar deixou de levar a /contato — que perdia o
       perfil que o visitante estava olhando — e passou a pôr o perfil na
       lista "Minha solicitação". O nome acessível é "Solicitar: <perfil>";
       depois do clique vira "Na solicitação: …", que o `^` deixa de fora. */
    const solicitar = page.getByRole('button', { name: /^Solicitar: / })
    await expect(solicitar).toHaveCount(8)
    /* Pílula, não `select`: a primeira versão da ilha usou dois `select` e isso
       foi parte dos 300px que faltavam na seção de filtros. */
    await page.getByRole('button', { name: 'Lead / Principal', exact: true }).click()
    const n = await solicitar.count()
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

  test('a faixa de parceiros da home vem da collection e só linka quem tem página', async ({ page, request }) => {
    await page.goto(`${NEXT_URL}/`)
    const faixa = page.locator('section', { has: page.getByRole('heading', { name: 'Parceiros de Confiança' }) }).last()
    // O nome da collection, e não o da lista antiga do bloco ("Azure").
    /* ⚠️ `visible: true` antes do `first()`. A faixa monta as fichas duas vezes
       — a fileira `sm:flex` e a grade `sm:hidden` do celular —, e o primeiro
       "Microsoft Azure" do DOM é o da fileira, escondida abaixo de 640px: no
       mobile o teste esperava 20s por um texto que nunca aparece. */
    await expect(faixa.getByText('Microsoft Azure').filter({ visible: true }).first()).toBeVisible()

    const links = faixa.locator('a[href^="/parceiros/"]')
    const hrefs = [...new Set(await links.evaluateAll((as) => as.map((a) => a.getAttribute('href'))))]
    expect(hrefs).toContain('/parceiros/google-cloud')
    expect(hrefs).not.toContain('/parceiros/salesforce-informatica')
    for (const href of hrefs) expect((await request.get(`${NEXT_URL}${href}`)).status(), href!).toBe(200)
  })

  /* `/solucoes` é a única rota que **muda de comportamento** (D-09): no legado
     ela serve a página de IA, aqui vira índice. Não há gabarito visual, então o
     aceite é este. */
  test.describe('/solucoes — índice novo (D-09)', () => {
    /* ⚠️ **18, e não 6.** P-16 (21/08/2026): as 6 do protótipo convivem com as 12
       do WordPress (MIG-093). A RC18 existe e está publicada, mas saiu do índice
       e do menu em 26/09 (D-37). O número é asserção de verdade e não contagem
       frouxa — se cair, alguém despublicou; se subir, rascunho está vazando. */
    test('lista as 18 soluções agrupadas nas 3 categorias, sem a RC18', async ({ page }) => {
      await page.goto(`${NEXT_URL}/solucoes`)
      for (const categoria of ['Inovação & IA', 'Dados, BI & Advanced Analytics', 'Governança & Cultura']) {
        await expect(page.getByRole('heading', { name: categoria, level: 2 })).toBeVisible()
      }
      await expect(page.getByRole('heading', { name: 'RC18', level: 2 })).toHaveCount(0)
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
      expect(hrefs).not.toContain('/solucoes/rc18')
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

  /* Feature rc18 — a landing da RC 18/2025 (`/solucoes/rc18`, documento da coleção
     Solutions) e o endereço do diagnóstico de prontidão, que a D-35 aposentou:
     virou redirect para o diagnóstico de maturidade. Sem gabarito: aqui é a rede. */
  test.describe('RC 18/2025 — página e diagnóstico', () => {
    test('a página de solução responde nos dois idiomas', async ({ request }) => {
      for (const url of [`${NEXT_URL}/solucoes/rc18`, `${NEXT_URL}/en/solutions/rc18`]) {
        expect((await request.get(url)).status(), url).toBe(200)
      }
    })

    /* A landing é conteúdo de SEO: indexável e com `Service`. */
    test('a página é indexável e declara Service', async ({ page, request }) => {
      expect(await (await request.get(`${NEXT_URL}/solucoes/rc18`)).text()).not.toContain('noindex')
      await page.goto(`${NEXT_URL}/solucoes/rc18`)
      const servico = (await page.locator('script[type="application/ld+json"]').allTextContents())
        .map((t) => JSON.parse(t) as Record<string, unknown>)
        .find((d) => d['@type'] === 'Service')
      expect(servico, 'nenhum nó Service em /solucoes/rc18').toBeTruthy()
    })

    /* Task 029 (ata de 24/09, D-35): quem chega à RC18 vai para o diagnóstico,
       não para um formulário genérico. O `ctaContact` saiu, e com ele a âncora
       `#contato` e o item "Contato" do submenu, que se monta das âncoras. O CTA
       do herói vai direto à rota nova, já no setor financeiro — não pelo
       redirect do endereço antigo, que fica só para link de fora do site. */
    test('leva ao diagnóstico de maturidade no setor financeiro, sem formulário de contato', async ({ page, request }) => {
      for (const url of [`${NEXT_URL}/solucoes/rc18`, `${NEXT_URL}/en/solutions/rc18`]) {
        const html = await (await request.get(url)).text()
        expect(html, url).not.toContain('id="contato"')
        expect(html, url).not.toContain('href="/diagnostico-rc18"')
        expect(html, url).toContain('href="/diagnostico-maturidade?setor=financeiro"')
      }

      await page.goto(`${NEXT_URL}/solucoes/rc18`)
      await expect(page.locator('#contato')).toHaveCount(0)
      await expect(page.locator('a[href="#contato"]')).toHaveCount(0)
      await expect(page.getByRole('link', { name: 'Verificar diagnóstico' })).toHaveAttribute(
        'href',
        '/diagnostico-maturidade?setor=financeiro',
      )
    })

    /* D-35: o link antigo circula em e-mail de campanha e favorito, e tem de cair
       no diagnóstico novo já no setor financeiro. Com e sem barra final: a
       barra sai num 308 do próprio Next antes da regra, e a regra não pode
       virar laço. O destino é conferido pelo `Location`, não só o status. */
    test('o diagnóstico antigo redireciona para o de maturidade, no setor financeiro', async ({ request }) => {
      /* O `Location` pode vir absoluto ou relativo; o que se compara é o caminho com a query. */
      const caminho = (url: string) => {
        const u = new URL(url, NEXT_URL)
        return u.pathname + u.search
      }
      for (const [antigo, novo] of [
        ['/diagnostico-rc18', '/diagnostico-maturidade?setor=financeiro'],
        ['/en/rc18-diagnostic', '/en/data-maturity-assessment?setor=financeiro'],
      ] as const) {
        const r = await request.get(`${NEXT_URL}${antigo}`, { maxRedirects: 0 })
        expect(r.status(), antigo).toBe(308)
        expect(caminho(r.headers()['location'] ?? ''), antigo).toBe(novo)

        const comBarra = await request.get(`${NEXT_URL}${antigo}/`)
        expect(comBarra.status(), `${antigo}/`).toBe(200)
        expect(caminho(comBarra.url()), `${antigo}/`).toBe(novo)
      }
    })
  })

  /* Megamenu (MIG-072a). Os painéis só existem com o menu aberto, então a
     regressão visual — que captura o estado fechado — não os cobre. É aqui. */
  test.describe('megamenu', () => {
    /* As 7 do protótipo mais Segmentos, ao lado de Soluções, e menos o
       Glossário, que saiu do ar em 26/09 (D-36). */
    const CATEGORIAS = ['Soluções', 'Segmentos', 'Consultores', 'Insights', 'Parceiros', 'Carreiras', 'Sobre']

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
      await page.goto(`${NEXT_URL}/relatorios`)
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

    test('abre com as 7 categorias e o painel de soluções', async ({ page }) => {
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

    /* Soluções e Segmentos **navegam**; Parceiros não, porque não há índice de
       parceiros para onde ir. A distinção some fácil: as três abrem painel, e
       por dois anos as três apontaram para `#` no protótipo. */
    test('a categoria Soluções leva ao índice, e Parceiros continua sem destino', async ({ page, request }) => {
      test.skip(noCelular(page), 'a fileira de categorias é `md:flex`')
      const fileira = await abrirMenu(page)

      await expect(fileira.getByRole('link', { name: 'Soluções', exact: true })).toHaveAttribute('href', '/solucoes')
      await expect(fileira.getByRole('link', { name: 'Segmentos', exact: true })).toHaveAttribute('href', '/segmentos')
      await expect(fileira.getByRole('link', { name: 'Parceiros', exact: true })).toHaveAttribute('href', '#')

      expect((await request.get(`${NEXT_URL}/solucoes`)).status()).toBe(200)
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
      await page.goto(`${NEXT_URL}/relatorios`)
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

/* ⚠️ Só com `PARIDADE_COM_PROTOTIPO=1` (D-39). O legado deixou de ser gabarito
 * da suíte padrão, e o CI não o sobe mais: sem esta condição, o primeiro teste a
 * reprovar seria o que confere se ele está no ar. Quem liga a paridade precisa
 * dele de pé, e é para isso que este teste continua existindo. */
if (PARIDADE_COM_PROTOTIPO) {
  test.describe('legado (gabarito da regressão visual)', () => {
    test('está no ar em :3001', async ({ request }) => {
      const r = await request.get(LEGACY_URL)
      expect(
        r.status(),
        `O legado precisa estar rodando: cd legacy && docker compose up -d`,
      ).toBe(200)
    })
  })
}
