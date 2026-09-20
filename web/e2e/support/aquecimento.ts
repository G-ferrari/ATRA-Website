import { LEGACY_URL, NEXT_URL } from '../../playwright.config'
import { ROTAS_COM_GABARITO } from './rotas'

/* Aquecimento das rotas antes da suíte.
 *
 * A comparação roda contra o servidor de **desenvolvimento**, que compila sob
 * demanda: a primeira requisição a uma rota levava de 30s a 70s e a seguinte
 * ~8s. Com os testes disputando essa primeira compilação em paralelo, o timeout
 * disparava e aparecia como falha de paridade — a suíte alternava entre 27
 * verdes e 4 vermelhos sem nenhuma mudança de código.
 *
 * Aqui cada rota é visitada uma vez, em sequência, antes de qualquer teste
 * começar. O custo é pago uma vez em vez de ser distribuído aleatoriamente.
 *
 * Antes disso, espera cada servidor responder: logo após um `docker compose
 * restart`, o Next leva alguns segundos até aceitar conexão, e sem a espera o
 * aquecimento desistia no boot e a suíte inteira reprovava (24 de 27).
 *
 * ⚠️ Isto trata o sintoma. A correção durável é comparar contra um build de
 * produção — MIG-035. */

const TETO_DE_ESPERA = 120_000

/** Bate na origem até responder ou estourar o teto. */
async function esperarNoAr(origem: string): Promise<boolean> {
  const limite = Date.now() + TETO_DE_ESPERA
  while (Date.now() < limite) {
    try {
      await fetch(origem, { signal: AbortSignal.timeout(10_000) })
      return true
    } catch {
      await new Promise((r) => setTimeout(r, 2_000))
    }
  }
  return false
}

export default async function aquecer() {
  for (const origem of [NEXT_URL, LEGACY_URL]) {
    if (!(await esperarNoAr(origem))) {
      console.warn(`  ⚠️ ${origem} não respondeu em ${TETO_DE_ESPERA / 1000}s`)
    }
  }

  /* Toda URL que a suíte visita, não só as com gabarito: numa partida a frio,
   * as rotas de smoke e de paridade do design system também pagam a primeira
   * compilação, e foi o que derrubou 2 testes na primeira execução depois de um
   * restart. Manter em dia ao portar rotas novas. */
  const alvos = [
    ...ROTAS_COM_GABARITO.map((r) => `${NEXT_URL}${r.caminho}`),
    ...ROTAS_COM_GABARITO.map((r) => `${LEGACY_URL}${r.caminho}`),
    `${NEXT_URL}/`,
    `${NEXT_URL}/en`,
    `${NEXT_URL}/en/success-stories`,
    `${NEXT_URL}/en/about`,
    `${NEXT_URL}/admin`,
    `${NEXT_URL}/rota-que-nao-existe`,
    `${LEGACY_URL}/`,
  ]

  for (const url of alvos) {
    const inicio = Date.now()
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(180_000) })
      // Consumir o corpo: o Next só termina de compilar ao terminar de servir.
      await r.text()
      console.log(`  aquecida ${url} → ${r.status} em ${Math.round((Date.now() - inicio) / 1000)}s`)
    } catch (e) {
      // Falha aqui não deve derrubar a suíte: o smoke test é quem reprova um
      // servidor fora do ar, com mensagem melhor.
      console.warn(`  ⚠️ não aqueceu ${url}: ${(e as Error).message}`)
    }
  }
}
