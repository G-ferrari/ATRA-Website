import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

import AxeBuilder from '@axe-core/playwright'
import { test } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'
import { ROTAS_COM_GABARITO } from './support/rotas'
import { visit } from './support/stability'

/* MIG-121 — axe medindo, sem reprovar (D-13).
 *
 * ⚠️ **Nenhuma violação reprova este arquivo.** É deliberado, e está em D-13:
 * o porte fiel replica os problemas de acessibilidade do legado — mega-menu só
 * por mouse, `alt` genérico, filtro sem `aria-pressed` — e reprovar aqui
 * obrigaria a corrigi-los durante a migração, que é o que D-15 proíbe. O que
 * este spec entrega é o problema **visível**: um relatório por execução, com
 * contagem por rota e por regra, publicado como artefato do CI. A correção é
 * backlog priorizado de fase própria.
 *
 * Roda só no projeto desktop: as violações de marcação não mudam com o
 * viewport, e triplicar a medição só alonga o gate.
 */

type Achado = { rota: string; regra: string; impacto: string; ocorrencias: number; ajuda: string }

const ROTAS = [
  ...ROTAS_COM_GABARITO.map((r) => ({ nome: r.nome, caminho: r.caminho })),
  /* Fora do gate visual, mas com conteúdo real — e é onde o visitante passa. */
  { nome: 'blog', caminho: '/blog' },
  { nome: 'carreiras', caminho: '/carreiras' },
]

test.describe('acessibilidade (axe) — mede, não bloqueia', () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== 'desktop', 'marcação não muda com o viewport')
  })

  /* Um teste só, e não um por rota: teste que nunca reprova não ganha nada com
   * granularidade — e 15 entradas verdes iguais no relatório só escondem a
   * informação real, que é o JSON. */
  test('varre as rotas e publica o relatório', async ({ page }) => {
    /* A varredura inteira passa dos 30s padrão; é uma medição, não uma corrida. */
    test.setTimeout(10 * 60_000)

    const achados: Achado[] = []
    const naoMedidas: string[] = []

    for (const { caminho } of ROTAS) {
      try {
        await visit(page, NEXT_URL, caminho)
        const resultado = await new AxeBuilder({ page })
          /* WCAG A e AA: é o recorte que a auditoria pós-migração vai priorizar.
           * `best-practice` fica de fora para o relatório não afogar o que é
           * exigência no que é sugestão. */
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze()
        for (const v of resultado.violations) {
          achados.push({
            rota: caminho,
            regra: v.id,
            impacto: v.impact ?? 'desconhecido',
            ocorrencias: v.nodes.length,
            ajuda: v.helpUrl,
          })
        }
      } catch {
        /* Página que não carregou não é violação zero — é medição que faltou,
         * e sumir com ela faria o relatório melhorar sem o site melhorar. */
        naoMedidas.push(caminho)
      }
    }

    const porImpacto: Record<string, number> = {}
    for (const a of achados) porImpacto[a.impacto] = (porImpacto[a.impacto] ?? 0) + a.ocorrencias

    const relatorio = {
      geradoEm: new Date().toISOString(),
      rotasMedidas: ROTAS.length - naoMedidas.length,
      naoMedidas,
      totalOcorrencias: achados.reduce((s, a) => s + a.ocorrencias, 0),
      porImpacto,
      achados: achados.sort((a, b) => b.ocorrencias - a.ocorrencias),
    }

    const dir = path.resolve(process.cwd(), 'playwright-report')
    mkdirSync(dir, { recursive: true })
    writeFileSync(path.join(dir, 'axe.json'), JSON.stringify(relatorio, null, 2))

    /* O resumo vai para o log do CI — é o que alguém lê sem baixar artefato. */
    console.log(
      `\n♿ axe: ${relatorio.totalOcorrencias} ocorrências em ${relatorio.rotasMedidas} rotas ` +
        `(${Object.entries(porImpacto).map(([k, n]) => `${k}: ${n}`).join(' · ') || 'nenhuma'})`,
    )
    for (const a of relatorio.achados.slice(0, 10)) {
      console.log(`   ${a.rota}  ${a.regra} ×${a.ocorrencias} [${a.impacto}]`)
    }
    if (naoMedidas.length) console.log(`   ⚠ não medidas: ${naoMedidas.join(', ')}`)

    /* Anotação em vez de asserção: aparece no relatório HTML do Playwright sem
     * decidir o destino da suíte. */
    test.info().annotations.push({
      type: 'axe',
      description: `${relatorio.totalOcorrencias} ocorrências · relatório em playwright-report/axe.json`,
    })
  })
})
