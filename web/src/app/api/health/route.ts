import { NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'

/* GET /api/health — o sinal de "pronto para receber tráfego".
 *
 * Quem lê isto é o `HEALTHCHECK` do container e o proxy da plataforma de deploy.
 * A regra 2 de docs/04-infra/deploy-vps.md é o motivo de existir: container que
 * não migrou não recebe tráfego.
 *
 * ⚠️ Por isso a rota **toca o banco** em vez de devolver 200 direto. Um processo
 * Node de pé com o schema defasado responde "ok" alegremente, recebe o tráfego
 * e só então estoura `column ... does not exist` na cara do visitante — a
 * armadilha que o CLAUDE.md registra como já paga. Healthcheck que não prova
 * nada é pior que healthcheck nenhum.
 *
 * ⚠️ `force-dynamic` não é decoração. Sem ele o Next pré-renderiza a rota no
 * build e o container serve para sempre o resultado congelado do momento em que
 * foi buildado — um healthcheck que **nunca** falha.
 *
 * `count` com `where` impossível é a consulta mais barata que ainda prova as
 * duas coisas que importam: a conexão abre e a tabela existe. Não traz
 * documento nenhum. */
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload()
    await payload.count({ collection: 'users', where: { id: { equals: 0 } } })

    return NextResponse.json({ status: 'ok' })
  } catch (erro) {
    /* ⚠️ Sem detalhe na resposta: a rota é pública e o erro do driver traz host,
     * porta e usuário do banco. O diagnóstico vai para o log do container, que
     * é onde quem opera consegue ler sem expor nada. */
    console.error('[health] indisponível:', erro)

    return NextResponse.json({ status: 'indisponivel' }, { status: 503 })
  }
}
