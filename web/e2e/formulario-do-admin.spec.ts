import AxeBuilder from '@axe-core/playwright'
import { sql } from '@payloadcms/db-postgres/drizzle'
import { drizzle } from '@payloadcms/db-postgres/drizzle/node-postgres'
import { expect, test, type Page, type TestInfo } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'
import {
  FORMULARIO_DE_TESTE as F,
  FORMULARIO_QUE_LEVA_A_OUTRA_PAGINA as P,
  PAGINA_COM_FORMULARIO,
} from '../scripts/seed/fixtures-de-formulario'

/* Feature criador-de-formularios (task 053): a seção "Formulário" no site —
 * o erro no campo, o envio que grava e mostra a mensagem, e o envio que leva a
 * outra página. A conversão no RD não entra: sem chave no CI ela é inerte, e o
 * corpo dela é unitário (`lib/rd-marketing.test.ts`, 050).
 *
 * ⚠️ Precisa do seed com `SEED_FIXTURES=1`, que cria os dois formulários e os
 * põe nesta página (`scripts/seed/formulario-de-teste.ts`). Sem eles o teste
 * reprova dizendo isso, em vez de passar sem medir nada.
 *
 * ⚠️ O envio sai com um IP próprio (`x-real-ip`, que o `lib/ip` lê primeiro). O
 * teto de 5 envios por IP por hora é um só para todos os formulários, e a
 * suíte já gasta 4 no desktop (ver `smoke.spec.ts`): um envio a mais daqui, do
 * IP do container, levaria o diagnóstico ao **sucesso falso** — tela verde,
 * nada no banco. O servidor do gate é acessado direto, sem o proxy que, em
 * produção, sobrescreve esse cabeçalho. O erro de campo não gasta vaga (049),
 * mas sai com IP próprio também: se um dia o servidor deixar de recusar, ele
 * gravaria — e gastaria a cota dos outros. O IP muda a cada corrida, porque o
 * contador vive no processo, e contra o mesmo servidor de dev a sexta corrida
 * da hora levaria o sucesso falso. */

const BANCO = process.env.E2E_DATABASE_URI

async function noBanco<T>(consulta: (db: ReturnType<typeof drizzle>) => Promise<T>): Promise<T> {
  const db = drizzle(BANCO!)
  try {
    return await consulta(db)
  } finally {
    await db.$client.end()
  }
}

type Gravado = { kind: string; formulario: string | null; source: string | null; consentimento: boolean; respostas: number }

const gravadosDe = (email: string) =>
  noBanco(async (db) => {
    const r = await db.execute<Gravado>(sql`
      select s.kind, f.name as formulario, s.source, s.communication_consent as consentimento,
             (select count(*)::int from form_submissions_answers a where a._parent_id = s.id) as respostas
        from form_submissions s left join forms f on f.id = s.form_id
       where s.email = ${email}`)
    return r.rows
  })

/* Pelo e-mail desta corrida, que é único, e só no tipo novo. As respostas e a
   linha de documento travado saem em cascata. */
const apagar = (email: string) =>
  noBanco((db) => db.execute(sql`delete from form_submissions where email = ${email} and kind = 'custom-form'`))

const secao = (page: Page, ancora: string) => page.locator(`section#${ancora}`)

/** Um IP por teste e por corrida (ver a nota do topo). O `lib/ip` aceita
    qualquer texto: só serve de chave do contador. */
const ipProprio = (page: Page, info: TestInfo) =>
  page.setExtraHTTPHeaders({ 'x-real-ip': `e2e-formulario-${Date.now()}-${info.retry}` })

async function abrir(page: Page) {
  await page.goto(`${NEXT_URL}${PAGINA_COM_FORMULARIO}?e2e=1`)
  for (const ancora of [F.ancora, P.ancora]) {
    await expect(
      secao(page, ancora).locator('form'),
      `a página ${PAGINA_COM_FORMULARIO} precisa dos formulários de teste — rode o seed com SEED_FIXTURES=1`,
    ).toHaveCount(1)
  }
  /* O carimbo do anti-spam só é escrito depois da hidratação. Antes dela o
     clique iria pelo envio nativo, sem JavaScript, e a espera de 3s contaria
     de um carimbo que ainda não existe. */
  await expect(secao(page, F.ancora).locator('input[name="carimbo"]')).not.toHaveValue('0')
}

/* A armadilha de tempo do anti-spam recusa envio a menos de 3s da montagem —
   com sucesso falso, que aqui pareceria o verdadeiro. */
const esperarOAntiSpam = (page: Page) => page.waitForTimeout(3500)

test.describe('seção "Formulário" (criador de formulários)', () => {
  test('desenha os campos com o rótulo ligado, a lista e a caixa de marcar', async ({ page }) => {
    await abrir(page)
    const s = secao(page, F.ancora)
    await expect(s.getByLabel(F.rotulos.nome)).toBeVisible()
    await expect(s.getByLabel(F.rotulos.email)).toHaveAttribute('type', 'email')
    await expect(s.getByLabel(F.rotulos.area).locator('option')).toHaveText(['Selecione…', ...F.opcoes])
    await expect(s.getByLabel(F.rotulos.consentimento)).toHaveAttribute('type', 'checkbox')
    await expect(s.getByRole('button', { name: F.botao })).toBeVisible()
  })

  test('obrigatório vazio: o erro aparece ao lado do campo, com o foco nele, e nada é gravado', async ({ page }, info) => {
    await ipProprio(page, info)
    const email = `e2e-formulario-erro-${Date.now()}-${info.project.name}@exemplo.com.br`
    try {
      await abrir(page)
      const s = secao(page, F.ancora)
      await s.getByLabel(F.rotulos.email).fill(email)
      await esperarOAntiSpam(page)
      await s.getByRole('button', { name: F.botao }).click()

      const nome = s.getByLabel(F.rotulos.nome)
      await expect(nome).toHaveAttribute('aria-invalid', 'true', { timeout: 20000 })
      await expect(nome).toBeFocused()
      await expect(s.getByText('Preencha este campo.').first()).toBeVisible()
      await expect(s.getByLabel(F.rotulos.area)).toHaveAttribute('aria-invalid', 'true')
      // O que foi digitado continua lá (o React 19 limpa o formulário a cada envio).
      await expect(s.getByLabel(F.rotulos.email)).toHaveValue(email)
      await expect(s.getByRole('status')).toHaveCount(0)
      if (BANCO) expect(await gravadosDe(email)).toEqual([])
    } finally {
      if (BANCO) await apagar(email)
    }
  })

  /* O axe da suíte (`acessibilidade.spec.ts`) só mede (D-13); aqui ele reprova
     o que a seção introduzir, em repouso e com erro. Sem a regra de contraste:
     ela tem teste próprio (`contraste.spec.ts`, que mede esta página), e o
     botão azul com texto branco (2,97:1) é o de todo o site, dívida da fase de
     acessibilidade. */
  test('axe: a seção não traz violação de WCAG A e AA', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'marcação não muda com o viewport')
    await ipProprio(page, info)
    await abrir(page)
    const medir = async () =>
      (
        await new AxeBuilder({ page })
          .include(`section#${F.ancora}`)
          .include(`section#${P.ancora}`)
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .disableRules(['color-contrast'])
          .analyze()
      ).violations.map((v) => `${v.id}: ${v.help}`)

    expect(await medir()).toEqual([])
    await esperarOAntiSpam(page)
    await secao(page, F.ancora).getByRole('button', { name: F.botao }).click()
    await expect(secao(page, F.ancora).getByLabel(F.rotulos.nome)).toHaveAttribute('aria-invalid', 'true', {
      timeout: 20000,
    })
    expect(await medir()).toEqual([])
  })

  /* ⚠️ Só no desktop: o envio grava um lead de verdade, e o formulário é o
     mesmo markup em toda largura (o que muda está no teste do erro, nos três).
     E só com o banco: sem ele não há como conferir nem apagar o lead. */
  test('envio válido grava o envio e mostra a mensagem no lugar do formulário', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'o envio roda uma vez; ver a nota acima')
    test.skip(!BANCO, 'sem E2E_DATABASE_URI não há como conferir nem apagar o lead')
    await ipProprio(page, info)
    const email = `e2e-formulario-${Date.now()}@exemplo.com.br`

    try {
      await abrir(page)
      const s = secao(page, F.ancora)
      await s.getByLabel(F.rotulos.nome).fill('Teste e2e')
      await s.getByLabel(F.rotulos.email).fill(email)
      await s.getByLabel(F.rotulos.area).selectOption({ label: F.opcoes[1] })
      await s.getByLabel(F.rotulos.consentimento).check()
      await esperarOAntiSpam(page)
      await s.getByRole('button', { name: F.botao }).click()

      await expect(s.getByRole('status')).toHaveText(F.mensagem, { timeout: 20000 })
      await expect(s.locator('form')).toHaveCount(0)
      await expect
        .poll(() => gravadosDe(email), { message: 'o envio não foi gravado (sucesso falso do anti-spam?)' })
        .toEqual([
          { kind: 'custom-form', formulario: F.nome, source: PAGINA_COM_FORMULARIO, consentimento: true, respostas: 4 },
        ])
    } finally {
      await apagar(email)
    }
  })

  test('depois do envio, o formulário que leva a outra página vai para ela', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'o envio roda uma vez; ver a nota acima')
    test.skip(!BANCO, 'sem E2E_DATABASE_URI não há como conferir nem apagar o lead')
    await ipProprio(page, info)
    const email = `e2e-formulario-pagina-${Date.now()}@exemplo.com.br`

    try {
      await abrir(page)
      const s = secao(page, P.ancora)
      await s.getByLabel('E-mail').fill(email)
      await esperarOAntiSpam(page)
      await s.getByRole('button', { name: P.botao }).click()

      await expect(page).toHaveURL(new RegExp(`${P.destino}$`), { timeout: 20000 })
      await expect.poll(async () => (await gravadosDe(email)).length).toBe(1)
    } finally {
      await apagar(email)
    }
  })
})
