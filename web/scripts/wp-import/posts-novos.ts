/* A regra do modo `--so-novos` de `import-posts.ts`, separada para ter teste.
 *
 * ⚠️ O importador, sem a chave, **regrava** todo post que acha pelo slug —
 * título, resumo, capa e corpo. Era o certo na carga inicial, e virou perigo
 * depois dela: rodá-lo de novo para trazer meia dúzia de artigos novos
 * apagaria qualquer correção feita no admin nos 207 que já estavam lá. Com a
 * chave, só entra o que ainda não existe; o resto nem é lido para gravação.
 *
 * A comparação é pelo slug **normalizado**, o mesmo que o importador grava
 * (`slugify` — ver a nota do `%c2%b2` em `import-posts.ts`): comparar com o
 * slug bruto do WordPress trataria aquele post como novo a cada rodada. */
import { slugify } from '../../src/fields/slug'

export function soOsNovos<T extends { slug: string }>(posts: T[], slugsExistentes: Iterable<string>): T[] {
  const existentes = new Set(slugsExistentes)
  return posts.filter((p) => !existentes.has(slugify(p.slug)))
}
