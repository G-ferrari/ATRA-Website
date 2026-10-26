/* Quando o índice da busca da ATRA AI se refaz (D-73).
 *
 * ⚠️ Módulo **sem import nenhum**, pelo mesmo motivo de
 * `cache-do-catalogo-da-ia.ts`: quem avisa que o conteúdo mudou é
 * `hooks/revalidar.ts`, que o `payload.config.ts` carrega; quem sabe
 * sincronizar é `indice.ts`, que importa o Payload. As duas pontas no mesmo
 * arquivo fechariam o ciclo config → hook → índice → config. Então o índice se
 * **registra** aqui quando a rota do chat o carrega, e o gancho só chama o que
 * estiver registrado.
 *
 * ⚠️ Em `globalThis`, e não em variável do módulo: o admin e a rota do chat
 * podem carregar cópias diferentes deste arquivo no mesmo processo.
 *
 * Três momentos refazem o índice:
 * 1. a primeira conversa de cada processo (deploy novo, reinício) — o processo
 *    nasce com o índice marcado como desatualizado;
 * 2. uma publicação no admin, 15 s depois da última de uma leva — quem publica
 *    dez artigos seguidos dispara uma sincronização, não dez;
 * 3. a conversa que chega com o índice marcado e nada rodando — cobre o
 *    processo em que a publicação aconteceu antes de o índice se registrar.
 *
 * Fora do Next (seed, importadores, migração) ninguém se registra, e marcar
 * não faz nada: o processo seguinte do site nasce desatualizado e sincroniza. */

export const ESPERA_MS = 15_000

type Estado = {
  desatualizado: boolean
  rodando: Promise<void> | null
  deNovo: boolean
  espera: ReturnType<typeof setTimeout> | null
  sincronizar: (() => Promise<void>) | null
}

const CHAVE = Symbol.for('atra.indiceDaIa')

function estado(): Estado {
  const g = globalThis as { [CHAVE]?: Estado }
  return (g[CHAVE] ??= { desatualizado: true, rodando: null, deNovo: false, espera: null, sincronizar: null })
}

/** Roda já, ou, se já está rodando, mais uma vez logo depois — a mudança pode
 *  ter chegado depois de a leitura do banco começar. */
function rodar(): void {
  const e = estado()
  if (!e.sincronizar) return
  if (e.rodando) {
    e.deNovo = true
    return
  }
  e.desatualizado = false
  e.rodando = e
    .sincronizar()
    .catch((erro: unknown) => {
      /* Falhou: continua desatualizado, e a próxima conversa tenta de novo. */
      e.desatualizado = true
      console.error('ATRA AI: índice da busca não sincronizou:', erro)
    })
    .finally(() => {
      e.rodando = null
      if (e.deNovo) {
        e.deNovo = false
        rodar()
      }
    })
}

/** Chamado a cada publicação no CMS (`hooks/revalidar.ts`). */
export function marcarIndiceDesatualizado(): void {
  const e = estado()
  e.desatualizado = true
  if (!e.sincronizar) return
  if (e.espera) clearTimeout(e.espera)
  e.espera = setTimeout(() => {
    e.espera = null
    rodar()
  }, ESPERA_MS)
  /* Não segura o processo vivo só por causa da espera. */
  e.espera.unref?.()
}

/** Registra quem sabe sincronizar e, se o índice está desatualizado e nada
 *  está rodando nem esperando, começa agora — sem esperar o fim. */
export function garantirIndiceEmDia(sincronizar: () => Promise<void>): void {
  const e = estado()
  e.sincronizar = sincronizar
  if (e.desatualizado && !e.rodando && !e.espera) rodar()
}

/** Só para os testes. */
export function estadoDoIndice(): Readonly<Pick<Estado, 'desatualizado'>> & { rodando: boolean; esperando: boolean } {
  const e = estado()
  return { desatualizado: e.desatualizado, rodando: e.rodando !== null, esperando: e.espera !== null }
}

/** Só para os testes. */
export function reiniciarAgendaDoIndice(): void {
  const e = estado()
  if (e.espera) clearTimeout(e.espera)
  Object.assign(e, { desatualizado: true, rodando: null, deNovo: false, espera: null, sincronizar: null })
}
