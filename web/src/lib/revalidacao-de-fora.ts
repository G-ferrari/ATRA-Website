import { randomUUID, timingSafeEqual } from 'node:crypto'

/* Revalidação pedida **fora** de uma requisição, dentro do processo do Next.
 *
 * ⚠️ `revalidatePath` só funciona dentro de uma requisição: fora dela lança
 * "static generation store missing". É o caso da fila do Payload, que roda no
 * `cron` do processo e não numa visita. Foi assim que a carga do inglês (D-74,
 * 27/10) gravou 202 artigos traduzidos e o site seguiu servindo o português
 * do cache, até alguém salvar algo no admin.
 *
 * O caminho é o processo pedir a si mesmo: um POST para `/api/revalidar`, que
 * é uma rota, e lá o `revalidatePath` vale. Sem segredo no ambiente: o token
 * nasce com o processo e fica no `globalThis`, que o hook do Payload e a rota
 * compartilham mesmo vindo de pacotes diferentes do build. Quem está fora do
 * processo não tem como saber o token, e a rota responde 404 a ele. */

const CHAVE = Symbol.for('atra.tokenDaRevalidacao')
const global = globalThis as unknown as Record<symbol, string | undefined>

function token(): string {
  return (global[CHAVE] ??= randomUUID())
}

export function tokenConfere(recebido: string | null): boolean {
  if (!recebido) return false
  const esperado = Buffer.from(token())
  const dado = Buffer.from(recebido)
  return dado.length === esperado.length && timingSafeEqual(dado, esperado)
}

/* A fila traduz um documento por minuto, e cada um invalidaria o site
 * inteiro. Junta os pedidos de poucos segundos num só. */
let agendado: ReturnType<typeof setTimeout> | null = null

export function pedirRevalidacaoAoProprioServidor(): void {
  /* Fora do Next (seed, wp-import, migrador) não há servidor a quem pedir, e o
     build que vem depois já sai atualizado. */
  if (!process.env.NEXT_RUNTIME || agendado) return
  agendado = setTimeout(() => {
    agendado = null
    const porta = process.env.PORT || '3000'
    fetch(`http://127.0.0.1:${porta}/api/revalidar`, { method: 'POST', headers: { 'x-revalidar': token() } }).catch(
      (erro) => console.error('[revalidar] o pedido ao próprio servidor falhou:', erro),
    )
  }, 5_000)
}
