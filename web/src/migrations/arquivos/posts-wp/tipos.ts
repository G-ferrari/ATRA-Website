/* Formato dos posts exportados do WordPress para dentro do repositório
 * (`posts.json`, ao lado). Quem escreve é `scripts/wp-import/exportar-posts.ts`;
 * quem lê é a migração `20261002_120000_posts_novos_do_wordpress`. */

export type ImagemExportada = {
  /** Nome do arquivo nesta pasta — `wp-<id>-<nome>.<ext>`, o mesmo que o importador grava. */
  arquivo: string
  /** `wp-<id>-`: sobrevive à troca de extensão para WebP, e é como a mídia é achada no acervo. */
  chave: string
  alt: string
  legenda: string | null
  mime: string
  /** URL de origem no WordPress, para conferência. */
  origem: string
}

export type PostExportado = {
  /** Já normalizado (`slugify`), como o importador grava. */
  slug: string
  titulo: string
  resumo: string
  publicadoEm: string
  /** URL do post no WordPress, para conferência. */
  origem: string
  /** `arquivo` da capa, que também está em `imagens`. */
  capa: string
  imagens: ImagemExportada[]
  /** Raiz Lexical. Os nós `upload` vêm com `pending: { arquivo }` no lugar da relação. */
  corpo: unknown
}
