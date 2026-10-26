import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'

import type { TipoDeConteudoDaIa } from '@/types/content'

import type { Locale } from '../locales'
import { getPayload } from '../payload'

import { comoLista } from './consulta'
import { comoVetor } from './embeddings'

/* A tabela `ai_chunks` (D-73): os trechos do site com o vetor de cada um.
 *
 * ⚠️ Fora do Payload, de propósito. Não é conteúdo que alguém edite: é um
 * índice derivado, refeito a partir do que está publicado. Como collection, ela
 * apareceria no admin, ganharia versões, o gancho de revalidação, uma coluna em
 * `payload_locked_documents_rels` — e o tipo `vector` nem existe no Payload. A
 * tabela nasce na migração `20261026_194552_busca_da_ia` com SQL escrito, e o
 * retrato `.json` do Payload não a conhece: `migrate:create` não a toca. */

export type TrechoGuardado = { codigo: string; posicao: number; hash: string }

export type TrechoNovo = TrechoGuardado & { tipo: TipoDeConteudoDaIa; conteudo: string; vetor: readonly number[] }

export type TrechoAchado = { codigo: string; conteudo: string; similaridade: number }

async function banco() {
  const payload = await getPayload()
  return (payload.db as unknown as PostgresAdapter).drizzle
}

export async function trechosGuardados(locale: Locale): Promise<TrechoGuardado[]> {
  const db = await banco()
  const { rows } = await db.execute(
    sql`SELECT code, position, content_hash FROM ai_chunks WHERE locale = ${locale}`,
  )
  return (rows as { code: string; position: number; content_hash: string }[]).map((r) => ({
    codigo: r.code,
    posicao: Number(r.position),
    hash: r.content_hash,
  }))
}

export async function gravarTrechos(locale: Locale, trechos: readonly TrechoNovo[]): Promise<void> {
  if (trechos.length === 0) return
  const db = await banco()
  for (const t of trechos) {
    await db.execute(sql`
      INSERT INTO ai_chunks (code, kind, locale, position, content, content_hash, embedding, updated_at)
      VALUES (${t.codigo}, ${t.tipo}, ${locale}, ${t.posicao}, ${t.conteudo}, ${t.hash}, ${comoVetor(t.vetor)}::vector, now())
      ON CONFLICT (code, locale, position) DO UPDATE SET
        kind = EXCLUDED.kind,
        content = EXCLUDED.content,
        content_hash = EXCLUDED.content_hash,
        embedding = EXCLUDED.embedding,
        updated_at = now()
    `)
  }
}

export async function apagarTrechos(locale: Locale, trechos: readonly Pick<TrechoGuardado, 'codigo' | 'posicao'>[]): Promise<void> {
  if (trechos.length === 0) return
  const db = await banco()
  for (const t of trechos) {
    await db.execute(sql`DELETE FROM ai_chunks WHERE locale = ${locale} AND code = ${t.codigo} AND position = ${t.posicao}`)
  }
}

/**
 * Os trechos mais próximos da pergunta, só entre os `codigos` permitidos — os
 * do catálogo que a conversa recebeu, já com os tipos que o admin ligou. Trecho
 * de item que o modelo não pode recomendar também não pode servir de resposta.
 *
 * `<=>` é a distância de cosseno do pgvector (0 = mesmo sentido); a
 * similaridade é o complemento, de 1 (igual) para baixo.
 */
export async function trechosMaisProximos(
  locale: Locale,
  vetor: readonly number[],
  codigos: readonly string[],
  quantos: number,
): Promise<TrechoAchado[]> {
  if (codigos.length === 0) return []
  const db = await banco()
  const consulta = comoVetor(vetor)
  const { rows } = await db.execute(sql`
    SELECT code, content, 1 - (embedding <=> ${consulta}::vector) AS similarity
    FROM ai_chunks
    WHERE locale = ${locale} AND code = ANY(${comoLista(codigos)}::text[])
    ORDER BY embedding <=> ${consulta}::vector
    LIMIT ${quantos}
  `)
  return (rows as { code: string; content: string; similarity: number | string }[]).map((r) => ({
    codigo: r.code,
    conteudo: r.content,
    similaridade: Number(r.similarity),
  }))
}
