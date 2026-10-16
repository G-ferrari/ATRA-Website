import type { Payload } from 'payload'

/* P-17 — quanto tempo o currículo de um candidato fica guardado.
 *
 * Definido em 14/10/2026 pela ATRA: **até 6 meses**. Passado o prazo, some o
 * PDF (do bucket privado) e o registro da candidatura (nome, e-mail, telefone,
 * mensagem, vaga). É exigência de LGPD, não preferência: guardar além do prazo
 * informado ao candidato é tratamento sem base. Por isso é regra do sistema, e
 * não lembrete para alguém apagar à mão.
 *
 * Fica no código, e não no admin: o prazo é o que o aviso de privacidade
 * promete, e mudar um sem o outro quebra a promessa. Mudou o prazo, muda aqui
 * e no texto do aviso (Contato → Candidaturas), juntos.
 *
 * ⚠️ O que esta limpeza NÃO alcança: o e-mail de aviso que o RH recebe a cada
 * candidatura (nome, e-mail e vaga, sem o PDF) e os backups diários do banco,
 * que guardam o que existia no dia em que foram feitos. */
export const MESES_DE_RETENCAO = 6

/** Candidatura criada antes deste instante já venceu. */
export function limiteDeRetencao(agora: Date): Date {
  const limite = new Date(agora)
  /* UTC para o limite não depender do fuso do servidor. 31/08 menos 6 meses
     cai em 03/03 (fevereiro não tem 31): a candidatura vive uns dias a mais,
     nunca a menos — o erro vai para o lado de quem guardou o arquivo. */
  limite.setUTCMonth(limite.getUTCMonth() - MESES_DE_RETENCAO)
  return limite
}

export type ResultadoDaLimpeza = { candidaturas: number; curriculos: number; falhas: number }

/* Apagar em lotes: `in` com milhares de ids vira uma consulta enorme, e a
   primeira corrida em produção pode pegar meses acumulados de uma vez. */
const LOTE = 100

async function apagarPorId(
  payload: Payload,
  collection: 'form-submissions' | 'private-files',
  ids: (number | string)[],
): Promise<{ apagados: number; falhas: number }> {
  let apagados = 0
  let falhas = 0
  for (let i = 0; i < ids.length; i += LOTE) {
    /* `delete` por `where` roda os ganchos de cada documento — é o gancho do
       plugin S3 que tira o PDF do bucket — e devolve as falhas em `errors`, em
       vez de interromper o lote no primeiro erro. */
    const r = await payload.delete({ collection, where: { id: { in: ids.slice(i, i + LOTE) } } })
    apagados += r.docs.length
    falhas += r.errors.length
    for (const e of r.errors) payload.logger.error(`[retencao] ${collection} ${e.id} não foi apagado: ${e.message}`)
  }
  return { apagados, falhas }
}

/**
 * Apaga as candidaturas e os currículos com mais de `MESES_DE_RETENCAO` meses.
 * Idempotente: rodar duas vezes seguidas apaga na segunda só o que venceu
 * entre uma e outra.
 */
export async function apagarCandidaturasVencidas(payload: Payload, agora = new Date()): Promise<ResultadoDaLimpeza> {
  const limite = limiteDeRetencao(agora).toISOString()

  /* 1. O registro da candidatura. A Local API roda com `overrideAccess`, o que
        aqui é o certo: a limpeza não tem usuário. */
  const candidaturas = await payload.find({
    collection: 'form-submissions',
    where: { kind: { equals: 'job-application' }, createdAt: { less_than: limite } },
    depth: 0,
    pagination: false,
    select: {},
  })

  /* 2. O PDF. Pelo tipo e pela data, e não pelo vínculo com a candidatura: o
        arquivo é gravado **antes** do registro (`actions/candidatura.ts`), e se
        a gravação do registro falhou ele ficou órfão — sem candidatura que o
        aponte, mas igualmente dado pessoal. O material rico (`kind: material`)
        não entra: não é de ninguém. */
  const curriculos = await payload.find({
    collection: 'private-files',
    where: { kind: { equals: 'cv' }, createdAt: { less_than: limite } },
    depth: 0,
    pagination: false,
    select: {},
  })

  const a = await apagarPorId(payload, 'form-submissions', candidaturas.docs.map((d) => d.id))
  const b = await apagarPorId(payload, 'private-files', curriculos.docs.map((d) => d.id))
  return { candidaturas: a.apagados, curriculos: b.apagados, falhas: a.falhas + b.falhas }
}
