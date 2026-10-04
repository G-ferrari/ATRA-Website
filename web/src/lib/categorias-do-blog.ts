/* Quais categorias da barra do blog têm artigo (D-47).
 *
 * ⚠️ As seis da barra vieram fixas do protótipo, e os 207 artigos do WordPress
 * vieram **sem tag** (P-27): todo botão levava a "Nenhum artigo encontrado".
 * Só entra na barra a categoria com pelo menos um artigo; sem nenhuma, a barra
 * não aparece. No dia em que o marketing classificar os artigos, ela volta
 * sozinha, só com o que tem resultado.
 *
 * Fora da ilha para ter teste: a comparação é a mesma do filtro — sem diferença
 * de maiúscula — e é ela que impede um botão de aparecer e não achar nada. */
export function categoriasComArtigo(categorias: string[], posts: { tags: string[] }[]): string[] {
  const tags = new Set(posts.flatMap((p) => p.tags.map((tag) => tag.toLowerCase())))
  return categorias.filter((c) => tags.has(c.toLowerCase()))
}
