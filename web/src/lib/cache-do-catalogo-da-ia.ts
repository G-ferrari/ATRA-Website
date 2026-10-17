/* O catálogo da ATRA AI, guardado em memória (D-60).
 *
 * ⚠️ Módulo **sem import nenhum**, de propósito. Quem zera o cache é
 * `hooks/revalidar.ts`, que o `payload.config.ts` carrega; quem enche é
 * `lib/catalogo-da-ia.ts`, que importa o Payload. As duas pontas no mesmo
 * arquivo fechariam um ciclo config → hook → catálogo → config.
 *
 * ⚠️ Em `globalThis`, e não numa variável do módulo: a rota do chat e o admin
 * do Payload são pacotes diferentes do mesmo processo, e cada um pode carregar
 * a sua cópia deste arquivo. Com a variável local, publicar no admin zeraria
 * um cache e a conversa leria o outro.
 *
 * Duas validades, uma para cada falha: o gancho de publicação zera na hora
 * (publicou, a conversa seguinte já vê), e os 60 s cobrem o que muda sem passar
 * pelo gancho — escrita direta no banco, outro processo. */

export const VALIDADE_MS = 60_000

type Guardado = { ate: number; valor: unknown }

const CHAVE = Symbol.for('atra.catalogoDaIa')

function armazem(): Map<string, Guardado> {
  const g = globalThis as { [CHAVE]?: Map<string, Guardado> }
  return (g[CHAVE] ??= new Map())
}

/**
 * Devolve o valor guardado, ou chama `montar` e guarda o que ele prometer.
 *
 * Guarda a **promessa**: duas conversas que cheguem juntas com o cache vazio
 * dividem a mesma consulta. Promessa que falha sai do cache, para a próxima
 * conversa tentar de novo em vez de herdar o erro por um minuto.
 */
export function comCache<T>(chave: string, montar: () => Promise<T>, agora: number = Date.now()): Promise<T> {
  const guardado = armazem().get(chave)
  if (guardado && guardado.ate > agora) return guardado.valor as Promise<T>

  const promessa = montar()
  armazem().set(chave, { ate: agora + VALIDADE_MS, valor: promessa })
  promessa.catch(() => {
    if (armazem().get(chave)?.valor === promessa) armazem().delete(chave)
  })
  return promessa
}

/** Chamado a cada publicação no CMS (`hooks/revalidar.ts`). */
export function invalidarCatalogoDaIa(): void {
  armazem().clear()
}
