/* Formato das vagas exportadas do WordPress para dentro do repositório
 * (`vagas.json`, ao lado). Quem escreve é `scripts/wp-import/exportar-vagas.ts`;
 * quem lê é a migração `20261003_120000_vagas_do_wordpress`. */

export type VagaExportada = {
  /** Já normalizado (`slugify`), como o importador grava. */
  slug: string
  titulo: string
  /** O começo do texto da vaga, até 220 caracteres — como o importador faz. */
  resumo: string
  modelo: 'remote' | 'hybrid' | 'onsite'
  publicadaEm: string
  /** Caminho da página no WordPress (`/slug/`), para o `redirects.csv`. */
  origem: string
  /** Raiz Lexical, já convertida pelo conversor do importador. */
  corpo: unknown
}
