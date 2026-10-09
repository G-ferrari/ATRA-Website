import { sql } from '@payloadcms/db-postgres/drizzle'
import { drizzle } from '@payloadcms/db-postgres/drizzle/node-postgres'
import { expect, test, type Page } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'

/* /diagnostico-maturidade — comportamento (feature diagnostico-maturidade-dados,
 * task 030).
 *
 * ⚠️ **Esta rota não tem gabarito visual**: nasceu depois do protótipo (D-35),
 * e desde a D-39 nenhuma rota compara pixel no CI. O que a cobre é este
 * arquivo — perfil, perguntas, avanço, contato e envio — mais o
 * `smoke.spec.ts` (200, `noindex`, setor no HTML do servidor, fora do sitemap,
 * redirect do RC18). É o molde de `consultores.spec.ts` (D-34).
 *
 * O que o unitário já prova não se repete aqui: a navegação é o reducer de
 * `lib/diagnostico-maturidade/questionario.ts` e a validação do contato é
 * `contato.ts`, ambos com teste próprio. Aqui o que se testa é a **ilha
 * montada**: o reducer chegando à tela, a tela chegando à action, e a action
 * chegando ao banco.
 *
 * ⚠️ O `playwright.config.ts` liga `reducedMotion: 'reduce'` para a suíte
 * inteira, e com ele o avanço automático já nasce desligado. Por isso os testes
 * do avanço declaram o `prefers-reduced-motion` que querem, e há um de controle
 * provando que o avanço existe — sem ele, "não avançou sozinho" passaria mesmo
 * que o avanço automático tivesse sumido do código.
 *
 * Contra o servidor de **dev** (fora do `pnpm gate`), de dentro da imagem
 * oficial: `--network host` e `NEXT_URL=http://localhost:3000`. Com
 * `host.docker.internal` o Next 16 recusa os chunks de JS a essa origem
 * (`allowedDevOrigins`), a ilha nunca hidrata e todo teste reprova no "Começar".
 *
 * ⚠️ O `next dev` (Turbopack) às vezes responde **500** a esta rota quando ela
 * renderiza junto com `/solucoes` ou `/solucoes/[slug]` — "module factory is
 * not available" para `questionario.tsx`, atribuído à entrada da outra rota.
 * Nenhum import liga as duas: é corrida do runtime de desenvolvimento, e some
 * ao repetir. Aparece mais no smoke, que visita as duas em paralelo. O
 * `pnpm gate` compara contra build de produção, que não tem esse runtime. */

const MARCA = 'Diagnóstico de Maturidade de Dados'

/* Saúde tem 16 perguntas: 13 transversais e 3 que a incluem. O mesmo número que
 * `PERGUNTAS_POR_SETOR` fixa em `motor.test.ts` contra o HTML do Roger — aqui é
 * a contagem que a pessoa **percorre** na tela. */
const SETOR = 'saude'
const PERGUNTAS_DE_SAUDE = 16
const PORTE = '300mi_1bi'
const CARGO = 'cio_cto_cdo'

const TITULO_DO_CONTATO = 'Para onde enviamos o seu diagnóstico?'
const TITULO_DA_CONCLUSAO = 'Diagnóstico registrado. Obrigado!'

/** O cartão do questionário: `<section aria-labelledby>` com a marca. */
const cartao = (page: Page) => page.getByRole('region', { name: MARCA })

/** A barra diz em que tela se está pelo `aria-valuetext` ("Pergunta 4 de 16"),
 * o mesmo texto que o leitor de tela anuncia. */
const barra = (page: Page) => cartao(page).getByRole('progressbar')

async function abrir(page: Page, busca: string) {
  await page.goto(`${NEXT_URL}/diagnostico-maturidade${busca}`)
  await expect(barra(page)).toHaveAttribute('aria-valuetext', 'Perfil')
}

/** Porte e cargo; o setor já veio da URL. */
async function comecar(page: Page) {
  const c = cartao(page)
  /* ⚠️ Em `toPass`: no servidor de dev a ilha hidrata **depois** que o HTML já
   * está na tela. Uma escolha feita antes disso muda o `<select>` sem chegar ao
   * estado do React, e o "Começar" acende os erros de campo em vez de avançar.
   * Refazer as escolhas é idempotente; a primeira linha evita refazê-las quando
   * a tentativa anterior avançou e só a asserção atrasou. */
  await expect(async () => {
    if (/^Pergunta 1 de /.test((await barra(page).getAttribute('aria-valuetext')) ?? '')) return
    await c.getByLabel('Faturamento anual aproximado').selectOption(PORTE, { timeout: 2_000 })
    await c.getByLabel('Seu cargo').selectOption(CARGO, { timeout: 2_000 })
    await c.getByRole('button', { name: 'Começar', exact: true }).click({ timeout: 2_000 })
    await expect(barra(page)).toHaveAttribute('aria-valuetext', /^Pergunta 1 de \d+$/, { timeout: 2_000 })
  }).toPass({ timeout: 30_000 })
}

/** Responde tudo pela primeira alternativa e devolve quantas perguntas a tela
 * mostrou. Cada passo confere o número: pular ou repetir uma pergunta reprova
 * aqui, e não só na contagem do fim. */
async function responderTodas(page: Page): Promise<number> {
  const c = cartao(page)
  const rotulo = (await barra(page).getAttribute('aria-valuetext')) ?? ''
  const total = Number(/^Pergunta 1 de (\d+)$/.exec(rotulo)?.[1])
  expect(total, `rótulo inesperado: "${rotulo}"`).toBeGreaterThan(0)

  let vistas = 0
  for (let n = 1; n <= total; n++) {
    await expect(barra(page)).toHaveAttribute('aria-valuetext', `Pergunta ${n} de ${total}`)
    await c.getByRole('radio').first().click()
    await c.getByRole('button', { name: 'Próxima', exact: true }).click()
    vistas++
  }
  await expect(barra(page)).toHaveAttribute('aria-valuetext', 'Contato')
  await expect(c.getByRole('heading', { name: TITULO_DO_CONTATO })).toBeVisible()
  return vistas
}

async function preencherContato(page: Page, contato: { email: string; consentir: boolean }) {
  const c = cartao(page)
  await c.getByLabel('Nome completo').fill('Teste e2e')
  await c.getByLabel('E-mail corporativo').fill(contato.email)
  await c.getByLabel('Telefone / WhatsApp').fill('11 99999-0000')
  if (contato.consentir) await c.getByRole('checkbox', { name: /^Autorizo a ATRA/ }).check()
}

const enviar = (page: Page) => cartao(page).getByRole('button', { name: 'Receber meu diagnóstico' })

/** Toda requisição POST da página. A Server Action é um POST; a validação do
 * cliente existe justamente para ele não sair — nem gastar a cota por IP, que
 * é dividida com os outros formulários do site. */
function registrarPosts(page: Page): string[] {
  const posts: string[] = []
  page.on('request', (r) => {
    if (r.method() === 'POST') posts.push(r.url())
  })
  return posts
}

test.describe('/diagnostico-maturidade — setor pela URL', () => {
  test('?setor=saude chega pré-selecionado, com a linha de impactos', async ({ page }) => {
    await abrir(page, `?setor=${SETOR}&e2e=1`)
    const c = cartao(page)
    await expect(c.getByLabel('Setor de atuação')).toHaveValue(SETOR)
    await expect(c.getByText('Impactos avaliados:')).toBeVisible()
    /* Duas etiquetas que só a saúde tem (`TAGS_DO_SETOR.saude`). A linha mostra
       o órgão, não a norma (Roger, 08/10): a TISS aparece como "ANS". */
    await expect(c.getByText('Anvisa', { exact: true })).toBeVisible()
    await expect(c.getByText('RNDS', { exact: true })).toBeVisible()
    await expect(c.getByText('LGPD/ANPD', { exact: true })).toBeVisible()
    await expect(c.getByText('ANS RN 639/2025 (TISS)', { exact: true })).toHaveCount(0)

    /* O setor da URL entra no estado da ilha, e não só no `<select>`: basta
       porte e cargo para começar, e as perguntas são as da saúde. */
    await comecar(page)
    await expect(barra(page)).toHaveAttribute('aria-valuetext', `Pergunta 1 de ${PERGUNTAS_DE_SAUDE}`)
  })

  test('setor fora dos oito códigos é ignorado: perfil sem seleção e sem impactos', async ({ page }) => {
    await abrir(page, '?setor=xpto&e2e=1')
    const c = cartao(page)
    await expect(c.getByLabel('Setor de atuação')).toHaveValue('')
    await expect(c.getByText('Impactos avaliados:')).toHaveCount(0)

    /* E escolher à mão acende a linha — o que prova que ela sumiu pelo setor
       inválido, e não por defeito da tela. `toPass` pela hidratação (ver
       `comecar`). */
    await expect(async () => {
      await c.getByLabel('Setor de atuação').selectOption(SETOR, { timeout: 2_000 })
      await expect(c.getByText('Impactos avaliados:')).toBeVisible({ timeout: 2_000 })
    }).toPass({ timeout: 30_000 })
  })
})

test.describe('/diagnostico-maturidade — perguntas', () => {
  test(`saúde percorre ${PERGUNTAS_DE_SAUDE} perguntas até o contato`, async ({ page }) => {
    await abrir(page, `?setor=${SETOR}&e2e=1`)
    await comecar(page)
    expect(await responderTodas(page)).toBe(PERGUNTAS_DE_SAUDE)
  })

  /* ⚠️ O "Próxima" e o botão de envio ocupam o mesmo lugar no rodapé. Sem `key`
   * o React reaproveitava o mesmo `<button>`, que virava `type="submit"` no meio
   * do clique da última pergunta — e o navegador enviava o formulário vazio: o
   * contato nascia com os quatro campos em vermelho (visto em 02/10). O clique
   * tem de ser no botão, como `responderTodas` faz: quem avança escolhendo a
   * alternativa não passa por aqui. */
  test('o contato chega limpo: clicar em "Próxima" na última pergunta não envia o formulário', async ({ page }) => {
    const posts = registrarPosts(page)
    await abrir(page, `?setor=${SETOR}&e2e=1`)
    await comecar(page)
    await responderTodas(page)

    const c = cartao(page)
    await expect(enviar(page)).toBeVisible()
    await expect(c.locator('[aria-invalid="true"]')).toHaveCount(0)
    await expect(c.getByText('Informe seu nome')).toHaveCount(0)
    expect(posts).toHaveLength(0)
  })

  test('Voltar refaz o caminho e não perde as respostas', async ({ page }) => {
    await abrir(page, `?setor=${SETOR}&e2e=1`)
    const c = cartao(page)
    const voltar = c.getByRole('button', { name: 'Voltar', exact: true })
    const proxima = c.getByRole('button', { name: 'Próxima', exact: true })
    await comecar(page)

    await c.getByRole('radio').nth(0).click()
    await proxima.click()
    await expect(barra(page)).toHaveAttribute('aria-valuetext', `Pergunta 2 de ${PERGUNTAS_DE_SAUDE}`)
    await c.getByRole('radio').nth(1).click()

    await voltar.click()
    await expect(barra(page)).toHaveAttribute('aria-valuetext', `Pergunta 1 de ${PERGUNTAS_DE_SAUDE}`)
    await expect(c.getByRole('radio').nth(0)).toBeChecked()

    /* E de volta para a frente: a resposta da 2 também ficou. */
    await proxima.click()
    await expect(c.getByRole('radio').nth(1)).toBeChecked()

    await voltar.click()
    await voltar.click()
    await expect(barra(page)).toHaveAttribute('aria-valuetext', 'Perfil')
    await expect(c.getByLabel('Setor de atuação')).toHaveValue(SETOR)
    await expect(c.getByLabel('Faturamento anual aproximado')).toHaveValue(PORTE)
    /* No perfil não há para onde voltar. */
    await expect(voltar).toHaveCount(0)
  })
})

/* O avanço automático do HTML do Roger (350 ms depois de escolher) sai com
 * `?e2e=1` — a captura precisa da tela parada — e com `prefers-reduced-motion`,
 * porque a tela trocar sozinha é movimento que a pessoa não pediu. Nos dois
 * casos quem avança é o botão.
 *
 * ⚠️ "Não avançou" é uma asserção negativa: não há evento a esperar, só uma
 * janela de tempo. Um segundo é quase três vezes o atraso do avanço. */
test.describe('/diagnostico-maturidade — avanço automático', () => {
  const JANELA_MS = 1_000

  test('controle: sem ?e2e=1 e sem movimento reduzido, escolher avança sozinho', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await abrir(page, `?setor=${SETOR}`)
    await comecar(page)

    await cartao(page).getByRole('radio').first().click()
    await expect(barra(page)).toHaveAttribute('aria-valuetext', `Pergunta 2 de ${PERGUNTAS_DE_SAUDE}`)
  })

  for (const caso of [
    { nome: 'com ?e2e=1', busca: `?setor=${SETOR}&e2e=1`, movimento: 'no-preference' },
    { nome: 'com prefers-reduced-motion', busca: `?setor=${SETOR}`, movimento: 'reduce' },
  ] as const) {
    test(`${caso.nome}, escolher não avança; o botão avança`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: caso.movimento })
      await abrir(page, caso.busca)
      await comecar(page)
      const c = cartao(page)

      await c.getByRole('radio').first().click()
      await expect(c.getByRole('radio').first()).toBeChecked()
      await page.waitForTimeout(JANELA_MS)
      await expect(barra(page)).toHaveAttribute('aria-valuetext', `Pergunta 1 de ${PERGUNTAS_DE_SAUDE}`)

      await c.getByRole('button', { name: 'Próxima', exact: true }).click()
      await expect(barra(page)).toHaveAttribute('aria-valuetext', `Pergunta 2 de ${PERGUNTAS_DE_SAUDE}`)
    })
  }
})

test.describe('/diagnostico-maturidade — contato', () => {
  test('e-mail pessoal é recusado na tela, sem POST', async ({ page }) => {
    const posts = registrarPosts(page)
    await abrir(page, `?setor=${SETOR}&e2e=1`)
    await comecar(page)
    await responderTodas(page)

    await preencherContato(page, { email: 'teste.e2e@gmail.com', consentir: true })
    await enviar(page).click()

    const c = cartao(page)
    const email = c.getByLabel('E-mail corporativo')
    await expect(c.getByText('Use um e-mail corporativo válido (não aceitamos gmail, hotmail, etc.).')).toBeVisible()
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toBeFocused()
    await expect(c.getByRole('heading', { name: TITULO_DO_CONTATO })).toBeVisible()
    /* A recusa é síncrona, no `onSubmit`: se a action fosse chamada, o POST já
       teria saído quando o erro apareceu. A pausa curta é só folga de rede. */
    await page.waitForTimeout(300)
    expect(posts).toEqual([])
  })

  test('sem consentimento o envio é bloqueado, sem POST', async ({ page }) => {
    const posts = registrarPosts(page)
    await abrir(page, `?setor=${SETOR}&e2e=1`)
    await comecar(page)
    await responderTodas(page)

    await preencherContato(page, { email: 'e2e-diagnostico@exemplo.com.br', consentir: false })
    await enviar(page).click()

    const c = cartao(page)
    const consentimento = c.getByRole('checkbox', { name: /^Autorizo a ATRA/ })
    await expect(c.getByText('É preciso autorizar o contato para receber o diagnóstico.')).toBeVisible()
    await expect(consentimento).toHaveAttribute('aria-invalid', 'true')
    await expect(consentimento).toBeFocused()
    await expect(c.getByRole('heading', { name: TITULO_DA_CONCLUSAO })).toHaveCount(0)
    await page.waitForTimeout(300)
    expect(posts).toEqual([])
  })
})

/* ---------------------------------------------------------------------
   Envio e banco
   --------------------------------------------------------------------- */

/** O banco que o servidor sob teste usa, **visto de onde a suíte roda**: de
 * dentro do container do Playwright é `host.docker.internal`, e não o
 * `localhost` do `DATABASE_URI` do app. O `scripts/gate.mjs` repassa o do
 * ambiente já traduzido; fora dele, é passar à mão. */
const BANCO = process.env.E2E_DATABASE_URI

/** A linha gravada, pelas colunas do Postgres. O grupo `diagnostic` do Payload
 * vira colunas `diagnostic_*` na própria tabela; o nome só muda por migração
 * (D-21), e é ela que avisa quem renomear. */
type LeadGravado = {
  id: number
  kind: string
  name: string
  source: string | null
  setor: string | null
  porte: string | null
  cargo: string | null
  media: string | null
  nivel: string | null
  versao: string | null
  respondidas: number | null
}

/* Pelo driver que o próprio Payload usa (`@payloadcms/db-postgres`, que
 * reexporta o drizzle e traz o `pg`) — sem dependência nova. Conexão aberta e
 * fechada por chamada: são duas consultas por corrida. */
async function noBanco<T>(consulta: (db: ReturnType<typeof drizzle>) => Promise<T>): Promise<T> {
  const db = drizzle(BANCO!)
  try {
    return await consulta(db)
  } finally {
    await db.$client.end()
  }
}

const leadsDe = (email: string) =>
  noBanco(async (db) => {
    const r = await db.execute<LeadGravado>(sql`
      select id, kind, name, source,
             diagnostic_sector as setor, diagnostic_size as porte, diagnostic_role as cargo,
             diagnostic_average as media, diagnostic_level as nivel, diagnostic_version as versao,
             jsonb_array_length(diagnostic_answers) as respondidas
        from form_submissions
       where email = ${email}`)
    return r.rows
  })

/* ⚠️ Apaga pelo e-mail **desta** corrida, que é único, e só no kind do
 * diagnóstico. O `payload_locked_documents_rels` tem `ON DELETE CASCADE`, e a
 * collection não tem tabela de array — não sobra linha órfã. */
const apagarLeadsDe = (email: string) =>
  noBanco((db) => db.execute(sql`delete from form_submissions where email = ${email} and kind = 'data-maturity-diagnostic'`))

test.describe('/diagnostico-maturidade — envio', () => {
  /* ⚠️ Só no desktop, pelo mesmo motivo de `consultores.spec.ts`: a tela do
   * contato é o mesmo markup em toda largura, e cada corrida grava um lead de
   * verdade. Nos três viewports, o teto de 5 envios por IP por hora (dividido
   * com os outros formulários) responderia **sucesso falso** — conclusão na
   * tela, nada no banco. É a consulta ao banco que pega esse caso.
   *
   * ⚠️ E só com acesso ao banco (`E2E_DATABASE_URI`): sem ele não há como
   * conferir o que foi gravado **nem apagar**, e o lead de teste ficaria na
   * base do ambiente. Pular é melhor que deixar lixo assinado como lead. */
  test('envio válido chega à conclusão sem número do resultado, e o lead é gravado', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'o envio roda uma vez; ver a nota acima')
    test.skip(!BANCO, 'sem E2E_DATABASE_URI não há como conferir nem apagar o lead')

    /* Único por corrida e marcado: um lead que escape da limpeza (corrida
       interrompida) é reconhecível na base. */
    const email = `e2e-diagnostico-${Date.now()}@exemplo.com.br`
    const posts = registrarPosts(page)

    try {
      await abrir(page, `?setor=${SETOR}&e2e=1`)
      const aberto = Date.now()
      await comecar(page)
      await responderTodas(page)
      await preencherContato(page, { email, consentir: true })

      /* ⚠️ O anti-spam descarta envio com menos de 3 s desde o início do
         questionário — e devolve **sucesso falso**. Responder 16 perguntas
         costuma levar mais que isso, mas "costuma" não é garantia. */
      await page.waitForTimeout(Math.max(0, 3_500 - (Date.now() - aberto)))
      await enviar(page).click()

      const c = cartao(page)
      await expect(c.getByRole('heading', { name: TITULO_DA_CONCLUSAO })).toBeVisible({ timeout: 20_000 })
      await expect(barra(page)).toHaveAttribute('aria-valuetext', 'Concluído')
      await expect(c).toContainText(`Enviamos o seu resultado para ${email}`)
      expect(posts).toHaveLength(1)

      /* O resultado vai **só por e-mail** (decisão de 26/09): a action devolve o
         endereço e nada mais. Nenhum algarismo no cartão, tirando o do próprio
         e-mail. ⚠️ Vale para os textos padrão do global — se o marketing
         escrever um número na `conclusao`, é este teste que precisa mudar. */
      const texto = (await c.innerText()).replace(email, '')
      expect(texto).not.toMatch(/\d/)

      const leads = await leadsDe(email)
      expect(leads).toHaveLength(1)
      const [lead] = leads
      expect(lead).toMatchObject({
        kind: 'data-maturity-diagnostic',
        name: 'Teste e2e',
        source: '/diagnostico-maturidade',
        setor: SETOR,
        porte: PORTE,
        cargo: CARGO,
        respondidas: PERGUNTAS_DE_SAUDE,
      })
      /* Média e nível são refeitos pelo servidor (MIG-142) — o formulário não
         manda nota nenhuma. Gravados, provam que o motor rodou na action. */
      expect(lead.media).not.toBeNull()
      expect(lead.nivel).not.toBeNull()
      expect(lead.versao).not.toBeNull()
      /* E o nível, que existe no banco, não chegou à tela. */
      expect(texto).not.toContain(lead.nivel!)
    } finally {
      await apagarLeadsDe(email)
    }
    expect(await leadsDe(email)).toEqual([])
  })
})
